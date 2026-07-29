import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
          updates.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="update-card"
              style={{
                display: "flex",
                gap: "16px",
                padding: "20px",
                background: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="update-avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  cursor: post.image ? "pointer" : "default",
                  border: "2px solid var(--primary)",
                  background: "#fff",
                }}
                onClick={() => post.image && setSelectedImage(post.image)}
              >
                <img
                  src={post.image || litamLogo}
                  alt={post.title || "Update Logo"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div
                className="update-content"
                style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--text)" }}>
                    {post.title || "Update"}
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}>
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {post.message}
                </p>
              </div>
            </motion.div>
          ))
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

      {selectedImage && (
        <div
          className="image-modal"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full screen update"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
            }}
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
