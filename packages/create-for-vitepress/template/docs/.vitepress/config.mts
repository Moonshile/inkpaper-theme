import { defineConfig } from 'vitepress'
import path from 'node:path'
// @ts-ignore — .mjs export
import { generateSidebar } from '@inkpaper/vitepress/config'
import { videoPlugin } from '@inkpaper/vitepress/markdown'

const postsDir = path.resolve(import.meta.dirname, '..', 'posts')

export default defineConfig({
  title: 'My Blog',
  description: 'Powered by inkpaper',
  markdown: {
    config(md) {
      md.use(videoPlugin)
    }
  },
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
