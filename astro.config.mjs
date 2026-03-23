// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@5digital/keystatic-astro";

import icon from "astro-icon";

import playformInline from "@playform/inline";

// https://astro.build/config
export default defineConfig({
  site: "https://medicalmasalud.cl",
  output:  'static',
  adapter: node({
    mode: 'standalone',
  }),
  // Example redirects (uncomment and adapt as needed):
  // redirects: {
  //   '/old-path': '/new-path/',
  //   '/old-path/': '/new-path/',
  //   '/category/blog': '/blog/',
  // },
  image: {
    // Enable modern image formats
    domains: [],
    remotePatterns: [],
    // Service configuration is handled automatically by Astro
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['../..'],
      },
    },
    build: {
      // Optimize images during build
      assetsInlineLimit: 4096, // Inline small assets (< 4KB)
    },
  },

  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      weights: [300, 400, 500, 600, 700, 800],
      styles: ["normal"],
      subsets: ["latin"],
      display: "optional", // Prevents layout shift by using fallback if font not ready
    }]
  },

  integrations: [
    alpinejs(),
    icon(),
    sitemap(),
    react(),
    markdoc(),
    keystatic(),
    playformInline({
      Beasties: {
        // Inline styles from external stylesheets (default: true)
        external: true,
        // Inline external stylesheets smaller than 50KB
        inlineThreshold: 100000,
        // If non-critical external stylesheet would be below 10KB, just inline it
        minimumExternalSize: 10000,
        // Evaluate inline styles for critical CSS
        reduceInlineStyles: true,
        // Merge inlined stylesheets into a single style tag
        mergeStylesheets: true,
        // Remove inlined rules from external stylesheet to avoid duplication
        pruneSource: true,
        // Preload non-critical CSS with swap strategy
        preload: 'swap',
        // Inline critical @font-face rules
        inlineFonts: true,
        // Preload critical fonts
        preloadFonts: true,
        // Include critical keyframes
        keyframes: 'critical',
        // Compress critical CSS
        compress: true,
        // Log level for debugging
        logLevel: 'info',
      },
    }),
  ],
});
