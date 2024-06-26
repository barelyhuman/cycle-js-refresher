import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import babel from "vite-plugin-babel";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  esbuild: {
    jsx: "transform",
    jsxFactory: "jsx",
    jsxFragment: "Fragment",
  },
  plugins: [
    // babel(),
    // preact()
  ],
});
