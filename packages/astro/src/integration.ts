import type { AstroIntegration } from 'astro'
import type { InkpaperConfig } from './types.ts'

const RESOLVED_VIRTUAL_ID = '\0virtual:inkpaper-config'
const VIRTUAL_ID = 'virtual:inkpaper-config'

export default function inkpaper(config: InkpaperConfig = {}): AstroIntegration {
  const resolved: Required<InkpaperConfig> = {
    title: config.title ?? 'inkpaper',
    description: config.description ?? '',
    postsBase: config.postsBase ?? '/posts',
    nav: config.nav ?? [
      { text: 'Home', link: '/' },
      { text: 'Archive', link: '/archive' },
      { text: 'Tags', link: '/tags' },
    ],
    sidebar: config.sidebar ?? {},
    related: config.related ?? {},
  }

  return {
    name: '@inkpaper/astro',
    hooks: {
      'astro:config:setup'({ updateConfig }) {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'inkpaper-virtual-config',
                resolveId(id: string) {
                  if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
                },
                load(id: string) {
                  if (id === RESOLVED_VIRTUAL_ID) {
                    return `export default ${JSON.stringify(resolved)}`
                  }
                },
              },
            ],
          },
        })
      },
    },
  }
}
