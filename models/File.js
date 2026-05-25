import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fileName: String,

    ipfsHash: String,

    ipfsUrl: String,

    fileSize: String,

    fileType: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("File", fileSchema);
