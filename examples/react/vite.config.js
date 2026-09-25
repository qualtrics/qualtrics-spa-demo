import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Binds both IPv4 and IPv6. Vite's default follows whatever "localhost"
    // resolves to, which on macOS is often IPv6 only, so a browser that prefers
    // IPv4 gets connection refused while the server is actually running.
    host: true,
  },
});
