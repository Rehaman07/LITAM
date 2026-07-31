import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchStudentPlacements, fetchPlacementStats } from "./api";
import litamLogo from "../images/logo.png";
import { Link } from "react-router-dom";
import type { StudentPlacement, PlacementStats } from "./types/api";
import { CardGridSkeleton } from "./components/LoadingSkeleton";
import EmptyState from "./components/EmptyState";

export default function PlacementsPage({ theme, onToggleTheme }: { theme: string; onToggleTheme: () => void }) {
  const [placements, setPlacements] = useState<StudentPlacement[]>([]);
  const [stats, setStats] = useState<PlacementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Touch handling for mobile swiping
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    Promise.all([
      fetchStudentPlacements(),
      fetchPlacementStats(),
    ])
      .then(([placementData, statsData]) => {
        setPlacements(placementData);
        setStats(statsData);
      })
      .catch((err) => {
        console.error("Failed to load placements", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Only images that exist for the viewer
  const viewableIndices = placements
    .map((p, idx) => (p.photo ? idx : -1))
    .filter((idx) => idx !== -1);

  // Modal navigation
  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    const currentPos = viewableIndices.indexOf(selectedIndex);
    const prevPos = currentPos > 0 ? currentPos - 1 : viewableIndices.length - 1;
    setSelectedIndex(viewableIndices[prevPos]);
  }, [selectedIndex, viewableIndices]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    const currentPos = viewableIndices.indexOf(selectedIndex);
    const nextPos = currentPos < viewableIndices.length - 1 ? currentPos + 1 : 0;
    setSelectedIndex(viewableIndices[nextPos]);
  }, [selectedIndex, viewableIndices]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) handleNext();
    if (distance < -40) handlePrev();
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <motion.main
      className="site site-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <header className="site-header scrolled">
        <div className="header-inner">
          <Link to="/" className="brand-lockup" style={{ textDecoration: "none" }}>
            <div className="brand-mark">
              <img src={litamLogo} alt="LITAM Logo" />
            </div>
            <div className="brand-copy">
              <strong>LITAM</strong>
              <small>Loyola Institute of Technology &amp; Management</small>
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
        <div
          className="section-heading"
          style={{ alignItems: "center", textAlign: "center" }}
        >
          <span className="eyebrow">Placements</span>
          <h2 className="gradient-text">Our Top Placements</h2>
          <p>
            Discover the success stories of our students who secured roles at
            top companies.
          </p>
        </div>

        {/* Placement Stats Row */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "16px",
              maxWidth: "900px",
              margin: "0 auto 40px auto",
            }}
          >
            {[
              { label: "Highest Package", value: `${stats.highest_package} LPA` },
              { label: "Average Package", value: `${stats.average_package} LPA` },
              { label: "Students Placed", value: `${stats.students_placed}+` },
              { label: "Recruiters", value: `${stats.recruiters}+` },
              { label: "Training Hours", value: `${stats.training_hours}+` },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  background: "var(--surface)",
                  borderRadius: "16px",
                  border: "1px solid var(--line)",
                  padding: "20px 16px",
                  textAlign: "center",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    marginTop: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Placements Grid */}
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {loading ? (
            <CardGridSkeleton cards={6} />
          ) : placements.length === 0 ? (
            <EmptyState
              icon="🎓"
              title="No placements data yet"
              subtitle="Placement records will appear here once available."
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {placements.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="update-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                    background: "var(--surface)",
                    borderRadius: "16px",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow-sm)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginBottom: "16px",
                      cursor: post.photo ? "pointer" : "default",
                      border: "3px solid var(--primary)",
                      background: "#fff",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => post.photo && setSelectedIndex(idx)}
                    onMouseOver={(e) => {
                      if (post.photo)
                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.08)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                    }}
                  >
                    <img
                      src={post.photo || litamLogo}
                      alt={post.student_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: post.photo ? "cover" : "contain",
                        padding: post.photo ? "0" : "10px",
                      }}
                    />
                  </div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "1.2rem",
                      color: "var(--text)",
                    }}
                  >
                    {post.student_name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      color: "var(--text-muted)",
                      fontWeight: "bold",
                    }}
                  >
                    {post.company_name}
                  </p>
                  {post.branch && (
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        marginBottom: "4px",
                      }}
                    >
                      {post.branch} {post.year ? `• ${post.year}` : ""}
                    </span>
                  )}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 14px",
                      borderRadius: "100px",
                      background: "var(--primary-glow)",
                      color: "var(--primary)",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      marginTop: "8px",
                    }}
                  >
                    {post.package_lpa} LPA
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Google Photos-style Image Viewer Modal */}
      <AnimatePresence>
        {selectedIndex !== null && placements[selectedIndex] && (
          <motion.div
            className="google-photos-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              userSelect: "none",
            }}
            onClick={handleClose}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Toolbar */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                right: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#fff",
                zIndex: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <strong style={{ fontSize: "1rem" }}>
                  {placements[selectedIndex].student_name}
                </strong>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {placements[selectedIndex].company_name} •{" "}
                  {placements[selectedIndex].package_lpa} LPA
                </p>
              </div>
              <button
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  color: "#fff",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handleClose}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Main Image Stage */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={placements[selectedIndex].photo || litamLogo}
                alt={placements[selectedIndex].student_name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
              />
            </motion.div>

            {/* Prev / Next Navigation */}
            {viewableIndices.length > 1 && (
              <>
                <button
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    color: "#fff",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous image"
                >
                  &#8249;
                </button>
                <button
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    color: "#fff",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next image"
                >
                  &#8250;
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
