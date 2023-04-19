import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  define: {
    VITE_APP_NAME: JSON.stringify(process.env.npm_package_name),
    VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
