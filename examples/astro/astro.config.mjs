import { defineConfig } from 'astro/config'
import inkpaper from '@inkpaper/astro'

export default defineConfig({
  integrations: [
    inkpaper({
      title: 'inkpaper',
      description: 'An ink-and-paper style Astro theme',
      inkEffect: 'bleedEdge',
      inkEffectOpacity: 0.8,
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
