import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileArchive,
  Copy,
  Download,
  Trash2,
  ExternalLink,
  UploadCloud,
  Search,
  ShieldCheck,
  Database,
  Lock,
  Share2,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const response = await axios.get("https://ipfs-vault-backend.onrender.com/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter(
      (file) =>
        file.fileName?.toLowerCase().includes(search.toLowerCase()) ||
        file.fileType?.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  const totalStorageKB = files.reduce((total, file) => {
    const size = parseFloat(file.fileSize);
    return total + (Number.isNaN(size) ? 0 : size);
  }, 0);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post("https://ipfs-vault-backend.onrender.com/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      toast.success("File uploaded successfully");
      setSelectedFile(null);
      setProgress(0);
      await fetchFiles();
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`https://ipfs-vault-backend.onrender.com/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("File deleted");
      await fetchFiles();
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("IPFS link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const copyShareLink = async (id) => {
    const shareUrl = `${window.location.origin}/share/${id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Public share link copied");
    } catch {
      toast.error("Share copy failed");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      toast.success("File selected");
    }
  };

  const renderPreview = (file) => {
    if (file.fileType?.startsWith("image/")) {
      return (
        <img
          src={file.ipfsUrl}
          alt={file.fileName}
          style={styles.previewImage}
        />
      );
    }

    if (file.fileType?.includes("pdf")) {
      return (
        <div style={styles.fileIconBox}>
          <FileText size={76} color="#ef4444" />
          <p style={styles.iconText}>PDF Document</p>
        </div>
      );
    }

    if (file.fileType?.startsWith("video/")) {
      return (
        <div style={styles.fileIconBox}>
          <FileVideo size={76} color="#38bdf8" />
          <p style={styles.iconText}>Video File</p>
        </div>
      );
    }

    return (
      <div style={styles.fileIconBox}>
        <FileArchive size={76} color="#10b981" />
        <p style={styles.iconText}>File</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <nav style={styles.navbar}>
        <div style={styles.brandBox}>
          <div style={styles.brandIcon}>
            <ShieldCheck size={28} />
          </div>

          <div>
            <h2 style={styles.logo}>IPFS Vault</h2>
            <p style={styles.logoSub}>Secure decentralized storage</p>
          </div>
        </div>

        <div style={styles.userBox}>
          <span style={styles.welcome}>Welcome, {user?.name}</span>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <section style={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p style={styles.badge}>WEB3 STORAGE DASHBOARD</p>

          <h1 style={styles.heroTitle}>Decentralized File Storage</h1>

          <p style={styles.heroText}>
            Upload, preview, search, copy, download, share, and manage your
            files securely using IPFS, Pinata, MongoDB, and JWT authentication.
          </p>
        </motion.div>

        <div style={styles.statsBox}>
          <motion.div style={styles.statCard} whileHover={{ y: -8 }}>
            <Database size={28} color="#38bdf8" />
            <h3>{files.length}</h3>
            <p>Total Files</p>
          </motion.div>

          <motion.div style={styles.statCard} whileHover={{ y: -8 }}>
            <UploadCloud size={28} color="#10b981" />
            <h3>{totalStorageKB.toFixed(1)} KB</h3>
            <p>Stored Metadata</p>
          </motion.div>

          <motion.div style={styles.statCard} whileHover={{ y: -8 }}>
            <Lock size={28} color="#818cf8" />
            <h3>JWT</h3>
            <p>Protected Access</p>
          </motion.div>
        </div>
      </section>

      <motion.section
        style={{
          ...styles.uploadCard,
          border: dragActive
            ? "2px dashed #38bdf8"
            : "1px solid rgba(255,255,255,0.08)",
          transform: dragActive ? "scale(1.015)" : "scale(1)",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <div style={styles.uploadLeft}>
          <div style={styles.uploadIconCircle}>
            <UploadCloud size={36} />
          </div>

          <div>
            <h3 style={styles.uploadTitle}>Upload File</h3>

            <p style={styles.uploadText}>
              Drag and drop your file here or choose it manually.
            </p>

            {selectedFile && (
              <p style={styles.selectedFile}>Selected: {selectedFile.name}</p>
            )}
          </div>
        </div>

        <div style={styles.uploadActions}>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={styles.fileInput}
          />

          <button style={styles.uploadBtn} onClick={handleUpload}>
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {uploading && (
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            ></div>
          </div>
        )}
      </motion.section>

      <section style={styles.filesHeader}>
        <div>
          <h2 style={styles.sectionTitle}>My Files</h2>
          <p style={styles.sectionSub}>
            Search, preview, open, copy, download, share, or delete your
            uploaded files.
          </p>
        </div>

        <div style={styles.searchBox}>
          <Search size={18} color="#94a3b8" />

          <input
            type="text"
            placeholder="Search files by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </section>

      <section style={styles.filesContainer}>
        {filteredFiles.length === 0 ? (
          <motion.div
            style={styles.emptyBox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ImageIcon size={64} color="#38bdf8" />
            <h3>No files found</h3>
            <p>Upload your first file or try a different search keyword.</p>
          </motion.div>
        ) : (
          filteredFiles.map((file, index) => (
            <motion.div
              key={file._id}
              style={styles.fileCard}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 60px rgba(56,189,248,0.12)",
              }}
            >
              {renderPreview(file)}

              <div style={styles.fileInfo}>
                <h3 style={styles.fileName}>{file.fileName}</h3>

                <div style={styles.metaRow}>
                  <span style={styles.metaBadge}>{file.fileSize}</span>
                  <span style={styles.metaBadge}>{file.fileType}</span>
                  {file.createdAt && (
                    <span style={styles.metaBadge}>
                      {new Date(file.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div style={styles.actionGrid}>
                <a
                  href={file.ipfsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.openBtn}
                >
                  <ExternalLink size={16} />
                  Open
                </a>

                <a href={file.ipfsUrl} download style={styles.downloadBtn}>
                  <Download size={16} />
                  Download
                </a>

                <button
                  style={styles.copyBtn}
                  onClick={() => copyLink(file.ipfsUrl)}
                >
                  <Copy size={16} />
                  Copy
                </button>

                <button
                  style={styles.shareBtn}
                  onClick={() => copyShareLink(file._id)}
                >
                  <Share2 size={16} />
                  Share
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(file._id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 30%), linear-gradient(to bottom, #020617, #0f172a)",
    color: "white",
    padding: "32px",
    position: "relative",
    overflowX: "hidden",
  },

  glowOne: {
    position: "fixed",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background: "rgba(37,99,235,0.25)",
    filter: "blur(120px)",
    top: "-180px",
    right: "-120px",
    zIndex: 0,
  },

  glowTwo: {
    position: "fixed",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.13)",
    filter: "blur(100px)",
    bottom: "-160px",
    left: "-100px",
    zIndex: 0,
  },

  navbar: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "60px",
  },

  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  brandIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 0 28px rgba(56,189,248,0.35)",
  },

  logo: {
    fontSize: "28px",
    margin: 0,
  },

  logoSub: {
    marginTop: "6px",
    color: "#94a3b8",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  welcome: {
    color: "#e5e7eb",
    fontWeight: "600",
  },

  logoutBtn: {
    padding: "11px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  hero: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1.25fr 1fr",
    gap: "28px",
    alignItems: "center",
    marginBottom: "36px",
  },

  badge: {
    display: "inline-block",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "rgba(56,189,248,0.12)",
    border: "1px solid rgba(56,189,248,0.35)",
    color: "#38bdf8",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1px",
  },

  heroTitle: {
    fontSize: "52px",
    margin: "18px 0 14px",
    lineHeight: 1.05,
  },

  heroText: {
    maxWidth: "850px",
    color: "#cbd5e1",
    fontSize: "18px",
    lineHeight: 1.7,
  },

  statsBox: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },

  statCard: {
    background: "rgba(17,24,39,0.78)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "22px",
    backdropFilter: "blur(18px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.28)",
  },

  uploadCard: {
    position: "relative",
    zIndex: 1,
    background: "rgba(17,24,39,0.72)",
    padding: "30px",
    borderRadius: "26px",
    marginBottom: "38px",
    display: "flex",
    gap: "24px",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "0.3s",
    backdropFilter: "blur(18px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.28)",
  },

  uploadLeft: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  uploadIconCircle: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    display: "grid",
    placeItems: "center",
    background: "rgba(56,189,248,0.12)",
    color: "#38bdf8",
  },

  uploadTitle: {
    fontSize: "24px",
    margin: 0,
  },

  uploadText: {
    color: "#94a3b8",
    marginTop: "8px",
  },

  uploadActions: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  fileInput: {
    color: "white",
  },

  uploadBtn: {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    border: "none",
    borderRadius: "14px",
    color: "white",
    cursor: "pointer",
    fontWeight: "800",
  },

  selectedFile: {
    marginTop: "10px",
    color: "#38bdf8",
    fontWeight: "bold",
  },

  progressBar: {
    position: "absolute",
    left: "30px",
    right: "30px",
    bottom: "16px",
    height: "8px",
    borderRadius: "999px",
    background: "rgba(148,163,184,0.22)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2563eb, #38bdf8)",
    transition: "0.25s",
  },

  filesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    marginBottom: "24px",
    position: "relative",
    zIndex: 1,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "30px",
  },

  sectionSub: {
    color: "#94a3b8",
    marginTop: "8px",
  },

  searchBox: {
    width: "430px",
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(17,24,39,0.85)",
  },

  searchInput: {
    width: "100%",
    padding: "15px 0",
    border: "none",
    background: "transparent",
    color: "white",
    outline: "none",
  },

  filesContainer: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "28px",
  },

  fileCard: {
    background: "rgba(17,24,39,0.72)",
    padding: "20px",
    borderRadius: "26px",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.28)",
  },

  previewImage: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    borderRadius: "20px",
  },

  fileIconBox: {
    height: "240px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#cbd5e1",
  },

  iconText: {
    fontWeight: "700",
    color: "#cbd5e1",
  },

  fileInfo: {
    minHeight: "96px",
  },

  fileName: {
    fontSize: "18px",
    wordBreak: "break-word",
    margin: 0,
  },

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "14px",
  },

  metaBadge: {
    background: "#1e293b",
    color: "#38bdf8",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
  },

  openBtn: {
    padding: "12px 14px",
    background: "#10b981",
    color: "white",
    borderRadius: "12px",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },

  downloadBtn: {
    padding: "12px 14px",
    background: "#2563eb",
    color: "white",
    borderRadius: "12px",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },

  copyBtn: {
    padding: "12px 14px",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },

  shareBtn: {
    padding: "12px 14px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },

  deleteBtn: {
    padding: "12px 14px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },

  emptyBox: {
    gridColumn: "1 / -1",
    minHeight: "270px",
    background: "rgba(17,24,39,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "26px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#cbd5e1",
    gap: "10px",
  },
};

export default Dashboard;
