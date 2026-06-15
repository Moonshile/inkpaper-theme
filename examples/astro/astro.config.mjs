import { defineConfig } from 'astro/config'
import inkpaper from '@inkpaper/astro'

export default defineConfig({
  integrations: [
    inkpaper({
      title: 'inkpaper',
      description: 'An ink-and-paper style Astro theme',
      // excludeDirs: ['drafts', 'notes'],  // Directories to hide from homepage recent posts
      // maxRecentPosts: 10,  // Max recent posts on homepage (default 10)
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
