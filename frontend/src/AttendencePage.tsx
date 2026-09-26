import React from "react";
import { motion } from "framer-motion";
import litamLogo from "../images/logo.png";
import { Link } from "react-router-dom";

interface AttendencePageProps {
  theme: string;
  onToggleTheme: () => void;
}

export default function AttendencePage({ theme, onToggleTheme }: AttendencePageProps) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      <section className="section" style={{ paddingTop: "150px", minHeight: "100vh" }}>
        <div className="section-heading" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="eyebrow">Student Portal</span>
          <h2 className="gradient-text">LITAM Attendence</h2>
          <p>Track your attendance records and check your eligibility for exams.</p>
        </div>
        
        <div className="glass" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", borderRadius: "12px", textAlign: "center" }}>
          <h3>Student Attendence System</h3>
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Please log in to view your attendence dashboard.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block", textDecoration: "none" }}>
            Login to Portal
          </Link>
        </div>
      </section>
    </motion.main>
  );
}
