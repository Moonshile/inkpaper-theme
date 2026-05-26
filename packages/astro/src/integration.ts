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
    inkEffect: config.inkEffect ?? '',
    inkEffectOpacity: config.inkEffectOpacity ?? 1,
  }

  return {
    name: '@inkpaper/astro',
    hooks: {
      'astro:config:setup'({ injectRoute, updateConfig }) {
        injectRoute({
          pattern: '/',
          entrypoint: '@inkpaper/astro/pages/index.astro',
        })
        injectRoute({
          pattern: '/archive',
          entrypoint: '@inkpaper/astro/pages/archive/index.astro',
        })
        injectRoute({
          pattern: '/archive/[...period]',
          entrypoint: '@inkpaper/astro/pages/archive/[...period].astro',
        })
        injectRoute({
          pattern: '/tags',
          entrypoint: '@inkpaper/astro/pages/tags.astro',
        })
        injectRoute({
          pattern: '/posts/[...slug]',
          entrypoint: '@inkpaper/astro/pages/posts/[...slug].astro',
        })
        injectRoute({
          pattern: '/category/[...dir]',
          entrypoint: '@inkpaper/astro/pages/category/[...dir].astro',
        })

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
      'astro:config:done'({ injectTypes }) {
        injectTypes({
          filename: 'inkpaper.d.ts',
          content: `declare module 'virtual:inkpaper-config' {\n  const config: Required<import('@inkpaper/astro').InkpaperConfig>\n  export default config\n}`,
        })
      },
    },
  }
}
