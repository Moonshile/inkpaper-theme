import { defineConfig } from 'vitepress'
import path from 'node:path'
// @ts-ignore — .mjs export
import { generateSidebar } from '@inkpaper/vitepress/config'

const postsDir = path.resolve(import.meta.dirname, '..', 'posts')

export default defineConfig({
  title: 'inkpaper',
  description: 'An ink-and-paper style VitePress theme',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Archive', link: '/archive' },
      { text: 'Tags', link: '/tags' }
    ],
    sidebar: generateSidebar(postsDir),
    outline: { level: [2, 3], label: 'On this page' },
    search: {
      provider: 'local'
    }
  }
})
