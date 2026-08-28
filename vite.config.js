import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill global Node.js variables for minecraft-data in the browser
    __dirname: JSON.stringify(""),
    process: { env: {} },
  },
});
