import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server', // Para renderizado en el servidor
  adapter: vercel({
    // Configuración adicional si necesitas
    edgeMiddleware: true,
  }),
  experimental: {
    clientPrerender: false
  }
});