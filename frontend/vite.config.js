import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 4174,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/media": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4175,
  },
  build: {
    target: "es2022",
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["framer-motion"],
          three: ["three"],
        },
      },
    },
  },
});
