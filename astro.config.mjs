import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import react from "@astrojs/react";

import vercelServerless from "@astrojs/vercel/serverless";
import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
  },
  integrations: [
    tailwind(),
    react({
      include: ["**/react/*"],
    }),
    AstroPWA({
      mode: "development",
      base: "/",
      scope: "/",
      includeAssets: ["favicon.svg"],
      registerType: "autoUpdate",
      manifest: {
        name: "Astro PWA",
        short_name: "Astro PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "hw-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "hw-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "hw-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\//],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  adapter: vercelServerless({
    webAnalytics: {
      enabled: true,
    },
    maxDuration: 8,
  }),
  output: "server",
});
