import React, { useState } from "react";
import { motion } from "framer-motion";
import litamLogo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

interface LoginPageProps {
  theme: string;
  onToggleTheme: () => void;
}

export default function LoginPage({ theme, onToggleTheme }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (result.user) navigate("/");
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) navigate("/");
      }
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === "auth/invalid-api-key") {
        setError("Firebase API Key is missing. Please check your firebase config.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("I guess you need some will power , try logging in using your email.");
      } else {
        setError(`Failed to sign in: ${err.message} (${err.code})`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      className="site site-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className={`site-header scrolled`}>
        <div className="header-inner">
          <Link to="/" className="brand-lockup" style={{ textDecoration: "none" }}>
            <div className="brand-mark">
              <img src={litamLogo} alt="LITAM Logo" />
            </div>
            <div className="brand-copy">
              <strong>LITAM</strong>
              <small>Loyola Institute of Technology & Management</small>
            </div>
          </Link>
          <div className="header-actions">
            <Link
              to="/"
              className="nav-list"
              style={{
                marginRight: "20px",
                textDecoration: "none",
                fontWeight: "bold",
                color: "var(--text)",
              }}
            >
              &larr; Back to Home
            </Link>
            <button
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <div className="sun-icon theme-icon" />
              ) : (
                <div className="moon-icon theme-icon" />
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="section" style={{ paddingTop: "150px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass" style={{ maxWidth: "450px", width: "100%", padding: "2.5rem", borderRadius: "16px", textAlign: "center" }}>
          <img src={litamLogo} alt="LITAM" style={{ width: "80px", marginBottom: "1rem" }} />
          <h2 className="gradient-text" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Sign in to access the LITAM Student Portal</p>

          {error && (
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)" }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "0.8rem", fontSize: "1.05rem" }}
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div style={{ marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", padding: 0, fontSize: "inherit", fontWeight: "bold" }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--line)" }}></div>
            OR
            <div style={{ flex: 1, height: "1px", background: "var(--line)" }}></div>
          </div>

          <button
            className="btn btn-secondary"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontSize: "1.05rem", padding: "0.8rem" }}
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                  <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.64 12 18.64C9.13 18.64 6.71 16.7 5.84 14.1H2.16V16.95C3.97 20.53 7.68 23 12 23Z" fill="#34A853" />
                  <path d="M5.84 14.1C5.62 13.44 5.49 12.74 5.49 12C5.49 11.26 5.62 10.56 5.84 9.9V7.05H2.16C1.42 8.52 1 10.2 1 12C1 13.8 1.42 15.48 2.16 16.95L5.84 14.1Z" fill="#FBBC05" />
                  <path d="M12 5.36C13.62 5.36 15.06 5.92 16.2 7.01L19.36 3.85C17.46 2.08 14.97 1 12 1C7.68 1 3.97 3.47 2.16 7.05L5.84 9.9C6.71 7.3 9.13 5.36 12 5.36Z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </section>
    </motion.main>
  );
}
