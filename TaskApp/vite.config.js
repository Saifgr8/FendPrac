import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcsc from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcsc()],
});
