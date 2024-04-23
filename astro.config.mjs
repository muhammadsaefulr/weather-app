import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import node from '@astrojs/node';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000
  },
  integrations: [tailwind(),  react({
    include: ['**/react/*'],
  })],
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    ssr: {
      external: ['xml2js']
    }
  },
  output: "server"
});