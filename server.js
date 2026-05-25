import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import File from "./models/File.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

const upload = multer({ storage: multer.memoryStorage() });

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.send("IPFS File Storage Backend Running");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/files", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch files",
    });
  }
});

app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();

    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const metadata = JSON.stringify({
      name: req.file.originalname,
    });

    formData.append("pinataMetadata", metadata);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    const savedFile = await File.create({
      userId: req.userId,
      fileName: req.file.originalname,
      ipfsHash,
      ipfsUrl,
      fileSize: `${(req.file.size / 1024).toFixed(2)} KB`,
      fileType: req.file.mimetype,
    });

    res.json({
      success: true,
      file: savedFile,
      fileName: req.file.originalname,
      ipfsHash,
      ipfsUrl,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "File upload failed",
    });
  }
});


app.delete("/files/:id", authMiddleware, async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});
app.get("/public/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch file" });
  }
});
app.get("/share/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load shared file",
    });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
