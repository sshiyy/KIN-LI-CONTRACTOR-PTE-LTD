import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/KIN-LI-CONTRACTOR-PTE-LTD/",
  build: {
    outDir: "docs",
  },
});