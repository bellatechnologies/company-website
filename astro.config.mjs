// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://bellatechnologies.in',
  output: 'server',
  security: {
    checkOrigin: false,
    // Nginx sets Origin to $scheme://$host so CSRF check passes behind proxy
    allowedDomains: [
      { hostname: 'bellatechnologies.in', protocol: 'https' },
      { hostname: 'www.bellatechnologies.in', protocol: 'https' },
    ],
  },
  adapter: node({ mode: 'standalone' }),
  integrations: [expressiveCode()],
  trailingSlash: 'always',
  devToolbar: {
    enabled: false,
  },
});
