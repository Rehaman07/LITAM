import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  icon = "📭",
  title = "No data found",
  subtitle = "Check back later for updates.",
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 32px",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "480px",
        margin: "40px auto",
      }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontSize: "3rem", lineHeight: 1, marginBottom: "16px" }}
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      <h3
        style={{
          margin: "0 0 8px 0",
          fontSize: "1.25rem",
          color: "var(--text)",
          fontWeight: 700,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "var(--text-muted)",
          fontSize: "0.95rem",
          lineHeight: 1.5,
          maxWidth: "320px",
        }}
      >
        {subtitle}
      </p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          style={{
            marginTop: "24px",
            padding: "10px 24px",
            borderRadius: "50px",
            border: "none",
            background: "var(--primary)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {action.label}
        </motion.button>
      )}
    </div>
  );
}
