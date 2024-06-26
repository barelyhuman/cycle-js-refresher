import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  esbuild: {
    jsx: "transform",
    jsxFactory: "jsx",
    jsxFragment: "Fragment",
  },
  plugins: [],
});
