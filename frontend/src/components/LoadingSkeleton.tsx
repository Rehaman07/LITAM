import React from "react";

interface LoadingSkeletonProps {
  variant?: "card" | "text" | "circle" | "avatar";
  count?: number;
  width?: string;
  height?: string;
}

const shimmerKeyframes = `
@keyframes litam-shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes litam-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
`;

const variantStyles: Record<string, React.CSSProperties> = {
  text: { borderRadius: "8px", height: "16px", width: "100%" },
  card: { borderRadius: "16px", height: "180px", width: "100%" },
  circle: { borderRadius: "50%", width: "64px", height: "64px" },
  avatar: { borderRadius: "50%", width: "48px", height: "48px" },
};

export default function LoadingSkeleton({
  variant = "text",
  count = 1,
  width,
  height,
}: LoadingSkeletonProps) {
  const base = variantStyles[variant] || variantStyles.text;

  const itemStyle: React.CSSProperties = {
    ...base,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    background:
      "linear-gradient(90deg, var(--line) 25%, rgba(255,255,255,0.08) 50%, var(--line) 75%)",
    backgroundSize: "800px 100%",
    animation: "litam-shimmer 1.6s ease-in-out infinite, litam-pulse 2s ease-in-out infinite",
  };

  return (
    <>
      <style>{shimmerKeyframes}</style>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            ...itemStyle,
            animationDelay: `${i * 0.12}s`,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/** Pre-built skeleton for a placement/update card grid */
export function CardGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
        width: "100%",
      }}
    >
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--line)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <LoadingSkeleton variant="circle" width="100px" height="100px" />
          <LoadingSkeleton variant="text" width="60%" height="20px" />
          <LoadingSkeleton variant="text" width="40%" height="14px" />
          <LoadingSkeleton variant="text" width="30%" height="28px" />
        </div>
      ))}
    </div>
  );
}
