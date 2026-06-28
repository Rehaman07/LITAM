// @ts-nocheck
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "./api";
import litamLogo from "../images/logo.png";
import { Link } from "react-router-dom";

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.updates)) return data.updates;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export default function UpdatesPage({ theme, onToggleTheme }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Scroll to top when landing on page
    window.scrollTo(0, 0);
    api.get("/updates/")
      .then((res) => {
        setUpdates(normalizeListResponse(res.data));
      })
      .catch((err) => {
        console.error("Failed to load updates", err);
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
      {/* Basic header mimicking SiteHeader for consistency */}
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
          <span className="eyebrow">Stay Informed</span>
          <h2 className="gradient-text">Latest Updates & Events</h2>
          <p>Get the latest news and updates from Loyola Institute of Technology & Management.</p>
        </div>

        <div className="updates-feed" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading updates...</p>
          ) : updates.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No updates available at the moment.</p>
          ) : (
            updates.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="update-card"
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '20px',
                  background: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--line)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div
                  className="update-avatar"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    cursor: post.image ? 'pointer' : 'default',
                    border: '2px solid var(--primary)',
                    background: '#fff'
                  }}
                  onClick={() => post.image && setSelectedImage(post.image)}
                >
                  <img
                    src={post.image || litamLogo}
                    alt={"Update Logo"}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="update-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>
                      Update
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {post.message}
                  </p>
                </div>
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
            alt="Full screen update" 
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
