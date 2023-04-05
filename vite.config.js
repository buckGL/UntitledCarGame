import { defineConfig } from "vite";

// vite.config.js
export default defineConfig({
    root: './',
    base: '/',
    build: {
        outDir: 'dist', 
        publicDir: 'assets'
    }
})