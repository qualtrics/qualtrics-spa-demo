import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    // Binds both IPv4 and IPv6. Vite's default follows whatever "localhost"
    // resolves to, which on macOS is often IPv6 only, so a browser that prefers
    // IPv4 gets connection refused while the server is actually running.
    host: true,
  },
});
