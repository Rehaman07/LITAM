/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="light"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        "surface-hover": "var(--surface-hover)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-faint": "var(--text-faint)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        success: "var(--success)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--border-radius-sm)",
        md: "var(--border-radius-md)",
        lg: "var(--border-radius-lg)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      animation: {
        "marquee-infinite": "marquee 24s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
}
