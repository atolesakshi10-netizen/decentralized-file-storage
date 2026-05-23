import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:5000/upload", formData);
      setResult(response.data);
    } catch {
      setError("Upload failed. Check backend or Pinata JWT.");
    } finally {
      setUploading(false);
    }
  };

  const copyCID = async () => {
    await navigator.clipboard.writeText(result.ipfsHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="app">
      <div className="mesh-bg"></div>
      <div className="particles">
        {[...Array(18)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <nav className="navbar">
        <div className="brand">
          <div className="brand-logo">⬡</div>
          <div>
            <h2>IPFS Vault</h2>
            <p>Premium Decentralized File Storage</p>
          </div>
        </div>

        <div className="network-pill">
          <span></span>
          IPFS Online
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">WEB3 • IPFS • SECURE STORAGE</div>

          <h1>
            Store Files With
            <br />
            <span>Decentralized Power</span>
          </h1>

          <p>
            Upload your files to IPFS, generate immutable CID hashes, and share
            them instantly with secure gateway links and QR codes.
          </p>

          <div className="hero-actions">
            <a href="#upload">Upload Now</a>
            <a href="#features" className="secondary-btn">View Features</a>
          </div>

          <div className="stats">
            <div>
              <h3>IPFS</h3>
              <p>Storage Protocol</p>
            </div>
            <div>
              <h3>CID</h3>
              <p>Content Identity</p>
            </div>
            <div>
              <h3>QR</h3>
              <p>Instant Sharing</p>
            </div>
          </div>
        </div>

        <div className="upload-panel" id="upload">
          <div className="orbit">
            <div className="orbit-ring"></div>
            <div className="orbit-ring two"></div>
            <div className="cloud-icon">☁</div>
          </div>

          <h2>Upload To IPFS</h2>
          <p>Choose a file and pin it to decentralized storage.</p>

          <label className="drop-zone">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="drop-icon">📁</div>
            <strong>{file ? file.name : "Choose your file"}</strong>
            <small>{file ? `${(file.size / 1024).toFixed(2)} KB` : "PDF, Image, TXT, DOCX supported"}</small>
          </label>

          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? (
              <div className="uploading">
                <span className="loader"></span>
                Uploading...
              </div>
            ) : (
              "Upload File To IPFS"
            )}
          </button>

          {uploading && (
            <div className="progress">
              <div></div>
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </section>

      {result && (
        <section className="result-card">
          <div className="success-icon">✓</div>
          <div className="success-label">Upload Successful</div>

          <h2>File Stored On IPFS</h2>

          <div className="result-grid">
            <div className="info-card">
              <label>File Name</label>
              <p>{result.fileName}</p>
            </div>

            <div className="info-card">
              <label>IPFS CID Hash</label>
              <p>{result.ipfsHash}</p>
              <button className="copy-btn" onClick={copyCID}>
                {copied ? "Copied!" : "Copy CID"}
              </button>
            </div>

            <div className="info-card">
              <label>Gateway URL</label>
              <a href={result.ipfsUrl} target="_blank" rel="noreferrer">
                Open Uploaded File
              </a>
            </div>

            <div className="qr-box">
              <QRCodeCanvas value={result.ipfsUrl} size={170} />
              <p>Scan QR To Open</p>
            </div>
          </div>
        </section>
      )}

      <section className="features" id="features">
        <div className="feature-card">
          <span>🔐</span>
          <h3>Secure Upload</h3>
          <p>Files are uploaded through a backend API and pinned safely to IPFS.</p>
        </div>

        <div className="feature-card">
          <span>🌍</span>
          <h3>Decentralized Access</h3>
          <p>Every uploaded file gets a unique CID for content-based access.</p>
        </div>

        <div className="feature-card">
          <span>⚡</span>
          <h3>Instant Sharing</h3>
          <p>Share files using gateway links and automatically generated QR codes.</p>
        </div>
      </section>
    </div>
  );
}

export default App;