// vite.config.ts — Configuration file for the Vite build tool.
// Vite is the development server and bundler that compiles the React app.

// defineConfig gives TypeScript type hints when writing the config object
import { defineConfig } from "vite";

// The official Vite plugin for React — enables JSX, Fast Refresh (HMR), etc.
import react from "@vitejs/plugin-react";

// Tailwind CSS v4 Vite plugin — processes Tailwind utility classes during build
import tailwindcss from "@tailwindcss/vite";

// Node.js built-in path module — used to resolve filesystem paths
import path from "path";

// Export the Vite configuration object
export default defineConfig({
  // base: "/" means the app is served from the root URL (e.g., https://amaan.vercel.app/)
  base: "/",

  // plugins[] registers build-time transformations
  plugins: [
    react(),       // Process JSX and enable React Fast Refresh in dev mode
    tailwindcss(), // Scan files for Tailwind classes and generate the CSS
  ],

  // resolve.alias sets up import shortcuts
  resolve: {
    alias: {
      // "@" maps to the "src" directory
      // So "@/components/Foo" resolves to "src/components/Foo"
      "@": path.resolve(__dirname, "src"),
    },
  },

  // build settings for production output
  build: {
    outDir: "dist",      // Place the compiled output in a "dist" folder
    emptyOutDir: true,   // Clear the dist folder before each new build
  },
});
