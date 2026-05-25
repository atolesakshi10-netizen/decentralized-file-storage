import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  FileText,
  FileVideo,
  FileArchive,
} from "lucide-react";

function SharePage() {
  const { id } = useParams();

  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchFile();
  }, []);

  const fetchFile = async () => {
    try {
      const response = await axios.get(
        `https://ipfs-vault-backend.onrender.com/share/${id}`
      );

      setFile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderPreview = () => {
    if (!file) return null;

    if (file.fileType?.startsWith("image/")) {
      return (
        <img
          src={file.ipfsUrl}
          alt={file.fileName}
          style={styles.image}
        />
      );
    }

    if (file.fileType?.includes("pdf")) {
      return (
        <div style={styles.iconBox}>
          <FileText size={90} color="#ef4444" />
          <h2>PDF Document</h2>
        </div>
      );
    }

    if (file.fileType?.startsWith("video/")) {
      return (
        <div style={styles.iconBox}>
          <FileVideo size={90} color="#38bdf8" />
          <h2>Video File</h2>
        </div>
      );
    }

    return (
      <div style={styles.iconBox}>
        <FileArchive size={90} color="#10b981" />
        <h2>File</h2>
      </div>
    );
  };

  if (!file) {
    return (
      <div style={styles.loading}>
        Loading shared file...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={styles.title}>Shared File</h1>

        {renderPreview()}

        <div style={styles.info}>
          <h2>{file.fileName}</h2>

          <p>{file.fileSize}</p>

          <p>{file.fileType}</p>
        </div>

        <div style={styles.actions}>
          <a
            href={file.ipfsUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.openBtn}
          >
            <ExternalLink size={18} />
            Open File
          </a>

          <a
            href={file.ipfsUrl}
            download
            style={styles.downloadBtn}
          >
            <Download size={18} />
            Download
          </a>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(to bottom, #020617, #0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    color: "white",
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(17,24,39,0.9)",
    borderRadius: "30px",
    padding: "30px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  title: {
    marginBottom: "30px",
  },

  image: {
    width: "100%",
    borderRadius: "20px",
    maxHeight: "500px",
    objectFit: "cover",
  },

  iconBox: {
    height: "320px",
    background: "#111827",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },

  info: {
    marginTop: "25px",
  },

  actions: {
    marginTop: "30px",
    display: "flex",
    gap: "20px",
  },

  openBtn: {
    flex: 1,
    padding: "16px",
    background: "#10b981",
    borderRadius: "14px",
    textDecoration: "none",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
  },

  downloadBtn: {
    flex: 1,
    padding: "16px",
    background: "#2563eb",
    borderRadius: "14px",
    textDecoration: "none",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
  },

  loading: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
  },
};

export default SharePage;
