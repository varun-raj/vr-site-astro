// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import expressiveCode from "astro-expressive-code";

import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'


// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    expressiveCode({
      plugins: [pluginLineNumbers()],
    }),
    mdx(),
    sitemap(),
    tailwind(),
    react(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});