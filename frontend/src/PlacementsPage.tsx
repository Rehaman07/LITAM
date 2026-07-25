import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchStudentPlacements } from "./api";
import litamLogo from "../images/logo.png";
import { Link } from "react-router-dom";

export default function PlacementsPage({ theme, onToggleTheme }) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Scroll to top when landing on page
    window.scrollTo(0, 0);
    fetchStudentPlacements()
      .then((data) => {
        setPlacements(data);
      })
      .catch((err) => {
        console.error("Failed to load placements", err);
      })
      .finally(() => {
        setLoading(false);
      });
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
          <Link to="/" className="brand-lockup" style={{ textDecoration: 'none' }}>
            <div className="brand-mark">
              <img src={litamLogo} alt="LITAM Logo" />
            </div>
            <div className="brand-copy">
              <strong>LITAM</strong>
              <small>Loyola Institute of Technology & Management</small>
            </div>
          </Link>
          <div className="header-actions">
            <Link to="/" className="nav-list" style={{ marginRight: '20px', textDecoration: 'none', fontWeight: 'bold', color: 'var(--text)' }}>
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

      <section className="section" style={{ paddingTop: '150px', minHeight: '100vh' }}>
        <div className="section-heading" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span className="eyebrow">Placements</span>
          <h2 className="gradient-text">Our Top Placements</h2>
          <p>Discover the success stories of our students who secured roles at top companies.</p>
        </div>

        <div className="updates-feed" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Loading placements...</p>
          ) : placements.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No placements data available at the moment.</p>
          ) : (
            placements.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="update-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  background: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--line)',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'center'
                }}
              >
                <div
                  className="update-avatar"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    cursor: post.photo ? 'pointer' : 'default',
                    border: '3px solid var(--primary)',
                    background: '#fff'
                  }}
                  onClick={() => post.photo && setSelectedImage(post.photo)}
                >
                  <img
                    src={post.photo || litamLogo}
                    alt={post.student_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: 'var(--text)' }}>
                  {post.student_name}
                </h3>
                <p style={{ margin: '0 0 4px 0', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  {post.company_name}
                </p>
                <span style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  marginTop: '8px'
                }}>
                  {post.package_lpa} LPA
                </span>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {selectedImage && (
        <div 
          className="image-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Full screen placement" 
            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} 
          />
          <button 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </motion.main>
  );
}
