import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },

  optimizeDeps: {
    include: ["redux-persist"],
  },

  build: {
    outDir: "build",
  },
});
