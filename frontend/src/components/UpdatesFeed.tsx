import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUpdates } from "../api";
import litamLogo from "../../images/logo.png";
import { Link } from "react-router-dom";
import type { UpdateItem } from "../types/api";

interface UpdatesFeedProps {
  limit?: number;
  showViewAll?: boolean;
  showSearchFilter?: boolean;
}

export default function UpdatesFeed({
  limit,
  showViewAll = false,
  showSearchFilter = false,
}: UpdatesFeedProps) {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Touch handling for mobile swiping in modal viewer
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUpdates({
      search: search || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      limit,
    })
      .then((data) => {
        setUpdates(limit ? data.slice(0, limit) : data);
      })
      .catch((err) => {
        console.error("Failed to load updates feed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, selectedCategory, limit]);

  // Modal navigation & keyboard controls
  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : updates.length - 1));
  }, [selectedIndex, updates.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < updates.length - 1 ? prev + 1 : 0));
  }, [selectedIndex, updates.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

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

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="updates-feed-wrapper" style={{ width: "100%" }}>
      {showSearchFilter && (
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto 30px auto",
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <input
            type="text"
            placeholder="Search updates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 240px",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: "0.95rem",
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: "0.95rem",
            }}
          >
            <option value="all">All Categories</option>
            <option value="notice">Notices</option>
            <option value="event">Events</option>
            <option value="placement">Placements</option>
            <option value="course">Courses</option>
          </select>
        </div>
      )}

      <div
        className="updates-feed"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "var(--text-muted)" }}>Loading updates...</p>
          </div>
        ) : updates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--line)",
            }}
          >
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              No updates available at the moment.
            </p>
          </div>
        ) : (
          updates.map((post, idx) => {
            const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const imgSrc = post.image || litamLogo;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="update-card"
                style={{
                  display: "flex",
                  gap: "20px",
                  padding: "20px",
                  background: "var(--surface)",
                  borderRadius: "16px",
                  border: "1px solid var(--line)",
                  boxShadow: "var(--shadow-sm)",
                  alignItems: "flex-start",
                }}
              >
                {/* Fluid-based Image Thumbnail with Date Badge */}
                <div
                  className="update-image-wrapper"
                  style={{
                    position: "relative",
                    width: "clamp(80px, 18vw, 96px)",
                    height: "clamp(80px, 18vw, 96px)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    flexShrink: 0,
                    cursor: "pointer",
                    border: "1.5px solid var(--line)",
                    background: "var(--surface-hover, #f8fafc)",
                  }}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <img
                    src={imgSrc}
                    alt={post.title || "Update Image"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: post.image ? "cover" : "contain",
                      padding: post.image ? "0" : "8px",
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(15, 23, 42, 0.85)",
                      backdropFilter: "blur(4px)",
                      color: "#ffffff",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {formattedDate}
                  </span>
                </div>

                {/* Content with Correct Hierarchy */}
                <div
                  className="update-content"
                  style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "0.82rem",
                      color: "var(--primary, #2563eb)",
                      fontWeight: 600,
                    }}
                  >
                    <span>{formattedDate}</span>
                    {post.section && (
                      <span
                        style={{
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          background: "var(--line, rgba(37,99,235,0.1))",
                        }}
                      >
                        {post.section}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--text)" }}>
                    {post.title || "Update"}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text-muted)",
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                      fontSize: "0.95rem",
                    }}
                  >
                    {post.message}
                  </p>

                  {post.attachment && (
                    <div style={{ marginTop: "8px" }}>
                      <a
                        href={post.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          background: "rgba(37, 99, 235, 0.08)",
                          color: "var(--primary, #2563eb)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          border: "1px solid rgba(37, 99, 235, 0.2)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span>View / Download Attachment (PDF)</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {showViewAll && (
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link
            to="/updates"
            className="button button-outline"
            style={{
              padding: "12px 28px",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-block",
            }}
          >
            View All Updates &rarr;
          </Link>
        </div>
      )}

      {/* Google Photos Style Image Viewer Modal */}
      <AnimatePresence>
        {selectedIndex !== null && updates[selectedIndex] && (
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
                  {updates[selectedIndex].title || "Update Photo"}
                </strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
                  {new Date(updates[selectedIndex].created_at).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {updates[selectedIndex].attachment && (
                  <a
                    href={updates[selectedIndex].attachment!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>📄 View PDF</span>
                  </a>
                )}
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
                src={updates[selectedIndex].image || litamLogo}
                alt={updates[selectedIndex].title || "Full size photo"}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
              />
            </motion.div>

            {/* Previous & Next Navigation Buttons */}
            {updates.length > 1 && (
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
    </div>
  );
}
