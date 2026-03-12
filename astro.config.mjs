// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify(),
  output: 'hybrid',
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});