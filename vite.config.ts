import { defineConfig } from "vite";
// Intentionally not loading a React plugin to avoid native binding / peer
// dependency issues on this environment. Vite's default esbuild transform
// will handle TSX during development.
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "127.0.0.1",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
