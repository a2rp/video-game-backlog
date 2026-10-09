import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/video-game-backlog/",
    build: { sourcemap: false },
    plugins: [react()],
});