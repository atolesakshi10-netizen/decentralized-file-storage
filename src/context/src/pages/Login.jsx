import { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Database,
  Cloud,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://ipfs-vault-backend.onrender.com/login";

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
     const response = await axios.post(
  "https://ipfs-vault-backend.onrender.com/login",
  form
);

      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowBlue}></div>
      <div style={styles.glowGreen}></div>
      <div style={styles.gridOverlay}></div>

      <section style={styles.leftSection}>
        <div style={styles.brand}>
          <div style={styles.logoBox}>
            <ShieldCheck size={34} />
          </div>

          <div>
            <h2 style={styles.logoText}>IPFS Vault</h2>
            <p style={styles.logoSub}>Enterprise Web3 Storage Platform</p>
          </div>
        </div>

        <div style={styles.badge}>
          <Sparkles size={16} />
          Secure • Decentralized • Authenticated
        </div>

        <h1 style={styles.title}>
          Manage Your Files With Secure Decentralized Storage
        </h1>

        <p style={styles.description}>
          Login to access your private dashboard, upload files to IPFS, manage
          metadata in MongoDB, and share files using secure public links.
        </p>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <Cloud size={30} color="#38bdf8" />
            <h3>IPFS Uploads</h3>
            <p>Store files using decentralized content addressing.</p>
          </div>

          <div style={styles.featureCard}>
            <Database size={30} color="#10b981" />
            <h3>MongoDB Records</h3>
            <p>Track file metadata, owner, type, and upload history.</p>
          </div>

          <div style={styles.featureCard}>
            <Fingerprint size={30} color="#818cf8" />
            <h3>JWT Security</h3>
            <p>Protect dashboards and user-specific file access.</p>
          </div>
        </div>
      </section>

      <section style={styles.rightSection}>
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <div style={styles.lockCircle}>
              <Lock size={30} />
            </div>

            <h2 style={styles.cardTitle}>Welcome Back</h2>
            <p style={styles.cardSub}>
              Sign in to continue to your IPFS Vault dashboard.
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>

            <div style={styles.inputWrapper}>
              <Mail size={19} color="#94a3b8" />
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>

            <div style={styles.inputWrapper}>
              <Lock size={19} color="#94a3b8" />
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                style={styles.input}
              />
            </div>
          </div>

          <button style={styles.loginBtn} onClick={handleLogin}>
            Access Dashboard
            <ArrowRight size={19} />
          </button>

          <div style={styles.divider}>
            <span></span>
            <p>New to IPFS Vault?</p>
            <span></span>
          </div>

          <Link to="/register" style={styles.createBtn}>
            Create New Account
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(56,189,248,0.20), transparent 30%), radial-gradient(circle at bottom right, rgba(16,185,129,0.13), transparent 30%), #020617",
    color: "white",
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    position: "relative",
    overflow: "hidden",
  },

  glowBlue: {
    position: "fixed",
    width: "520px",
    height: "520px",
    background: "rgba(37,99,235,0.28)",
    borderRadius: "50%",
    filter: "blur(130px)",
    top: "-180px",
    left: "-160px",
  },

  glowGreen: {
    position: "fixed",
    width: "420px",
    height: "420px",
    background: "rgba(16,185,129,0.14)",
    borderRadius: "50%",
    filter: "blur(120px)",
    right: "-130px",
    bottom: "-150px",
  },

  gridOverlay: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
    backgroundSize: "70px 70px",
    maskImage: "radial-gradient(circle, black 35%, transparent 78%)",
  },

  leftSection: {
    position: "relative",
    zIndex: 1,
    padding: "70px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "45px",
  },

  logoBox: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 0 45px rgba(56,189,248,0.45)",
  },

  logoText: {
    margin: 0,
    fontSize: "31px",
  },

  logoSub: {
    marginTop: "6px",
    color: "#94a3b8",
  },

  badge: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "rgba(56,189,248,0.12)",
    border: "1px solid rgba(56,189,248,0.32)",
    color: "#7dd3fc",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "28px",
  },

  title: {
    fontSize: "64px",
    lineHeight: 1.05,
    maxWidth: "820px",
    margin: 0,
    letterSpacing: "-1.5px",
  },

  description: {
    marginTop: "26px",
    maxWidth: "760px",
    color: "#cbd5e1",
    fontSize: "18px",
    lineHeight: 1.8,
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
    marginTop: "46px",
    maxWidth: "880px",
  },

  featureCard: {
    background: "rgba(17,24,39,0.68)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "24px",
    backdropFilter: "blur(18px)",
    boxShadow: "0 12px 45px rgba(0,0,0,0.28)",
  },

  rightSection: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    placeItems: "center",
    padding: "44px",
  },

  card: {
    width: "470px",
    maxWidth: "100%",
    background: "rgba(15,23,42,0.78)",
    border: "1px solid rgba(255,255,255,0.11)",
    borderRadius: "34px",
    padding: "40px",
    backdropFilter: "blur(24px)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.48)",
  },

  cardTop: {
    textAlign: "center",
    marginBottom: "34px",
  },

  lockCircle: {
    width: "68px",
    height: "68px",
    margin: "0 auto 18px",
    borderRadius: "22px",
    display: "grid",
    placeItems: "center",
    background: "rgba(56,189,248,0.12)",
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.25)",
  },

  cardTitle: {
    fontSize: "32px",
    margin: 0,
  },

  cardSub: {
    color: "#94a3b8",
    marginTop: "10px",
    lineHeight: 1.6,
  },

  formGroup: {
    marginBottom: "21px",
  },

  label: {
    display: "block",
    marginBottom: "9px",
    color: "#e5e7eb",
    fontWeight: "700",
    fontSize: "14px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "rgba(2,6,23,0.85)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "0 16px",
  },

  input: {
    flex: 1,
    padding: "16px 0",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "15px",
  },

  loginBtn: {
    width: "100%",
    marginTop: "8px",
    padding: "16px",
    border: "none",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "white",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 16px 35px rgba(56,189,248,0.28)",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "28px 0 20px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  createBtn: {
    display: "block",
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#38bdf8",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: "800",
  },
};

export default Login;
