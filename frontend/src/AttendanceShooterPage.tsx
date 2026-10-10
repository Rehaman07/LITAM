import React, { useState } from "react";
import { motion } from "framer-motion";
import litamLogo from "../images/logo.png";
import { Link } from "react-router-dom";

interface AttendanceShooterPageProps {
  theme: string;
  onToggleTheme: () => void;
}

export default function AttendanceShooterPage({ theme, onToggleTheme }: AttendanceShooterPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Please upload a spreadsheet first.' });
      return;
    }
    
    setProcessing(true);
    setStatus({ type: 'info', message: 'Parsing spreadsheet and triggering communications...' });
    
    // Simulate API call for shooting SMS/Voice calls
    setTimeout(() => {
      setProcessing(false);
      setStatus({ type: 'success', message: 'Successfully sent voice calls and SMS to parents of absent students.' });
      setFile(null);
    }, 3000);
  };

  return (
    <motion.main
      className="site site-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="site-header scrolled">
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
        <div className="glass" style={{ maxWidth: "500px", width: "100%", padding: "2.5rem", borderRadius: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📢</div>
          <h2 className="gradient-text" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Attendance Shooter</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Upload an attendance spreadsheet to automatically notify parents of absent students via Voice Call and SMS.
          </p>

          {status && (
            <div style={{ 
              backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
              color: status.type === 'error' ? '#ef4444' : status.type === 'success' ? '#10b981' : '#3b82f6', 
              padding: "1rem", 
              borderRadius: "8px", 
              marginBottom: "1.5rem", 
              fontSize: "0.95rem",
              fontWeight: "500"
            }}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleProcess} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text)" }}>Select Spreadsheet (.xlsx, .csv)</label>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                style={{ 
                  padding: "0.8rem", 
                  borderRadius: "8px", 
                  border: "1px dashed var(--line-strong)", 
                  background: "var(--surface)", 
                  color: "var(--text)",
                  cursor: "pointer"
                }}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={processing || !file}
              style={{ 
                width: "100%", 
                padding: "1rem", 
                fontSize: "1.05rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                opacity: (processing || !file) ? 0.7 : 1
              }}
            >
              {processing ? (
                <>
                  <span className="spinner" style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  Processing...
                </>
              ) : (
                <>
                  🚀 Shoot SMS & Calls
                </>
              )}
            </button>
          </form>
          
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </section>
    </motion.main>
  );
}
