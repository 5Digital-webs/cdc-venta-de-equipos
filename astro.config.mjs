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

// Prefijo público opcional (opt-in). Sin SITE_BASE_PATH el sitio se sirve en "/"
// exactamente como antes. Ejemplo: SITE_BASE_PATH=/cdcequiposlavanderia
const rawBase = (process.env.SITE_BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
if (rawBase && !/^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/.test(rawBase)) {
  throw new Error(`SITE_BASE_PATH inválido: "${process.env.SITE_BASE_PATH}"`);
}
const base = rawBase ? `/${rawBase}` : undefined;

// URL pública opcional (solo origen, sin ruta). Si no se declara se conserva el
// valor histórico del repositorio; no se decide aquí el dominio oficial.
const declaredSite = (process.env.SITE_URL ?? "").trim();
if (declaredSite && new URL(declaredSite).pathname !== "/") {
  throw new Error("SITE_URL debe ser solo el origen (sin ruta); el prefijo va en SITE_BASE_PATH");
}
const site = declaredSite || "https://medicalmasalud.cl";

// https://astro.build/config
export default defineConfig({
  site,
  ...(base ? { base } : {}),
  output:  'static',
  adapter: node({
    mode: 'standalone',
  }),
  // Astro antepone `base` al origen de cada redirección pero no al destino.
  redirects: {
    '/servicio': `${base ?? ""}/servicios/proyectos-llave-en-mano`,
    '/instalacion-y-puesta-en-marcha': `${base ?? ""}/servicios/instalacion`,
    '/lavanderias-autoservicios': `${base ?? ""}/servicios/autoservicio`,
    '/mantencion-preventiva': `${base ?? ""}/servicios/mantencion`,
  },
  image: {
    // Enable modern image formats
    domains: [],
    remotePatterns: [],
    // Service configuration is handled automatically by Astro
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      // true solo cuando SITE_URL se declaró al compilar (ver Layout.astro)
      "import.meta.env.PUBLIC_SITE_URL_DECLARED": JSON.stringify(Boolean(declaredSite)),
    },
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
