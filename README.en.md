# inkpaper

White paper, black ink, vermillion accents.

inkpaper is a blog theme that supports both VitePress and Astro. Designed for personal journals and blogs — quiet, readable, textured. Opening a page feels like unrolling a sheet of rice paper.

[中文](./README.md) | Live Demo: [VitePress](https://inkpaper.vercel.app/) · [Astro](https://inkpaper-astro.vercel.app/)

## Quick Start

### VitePress

```bash
npx @inkpaper/create-for-vitepress my-blog
cd my-blog
npm install
npm run dev
```

### Astro

1. Install:

```bash
npm install @inkpaper/astro
```

2. Configure `astro.config.mjs`:

```ts
import { defineConfig } from 'astro/config'
import inkpaper from '@inkpaper/astro'

export default defineConfig({
  integrations: [
    inkpaper({
      title: 'My Blog',
      description: 'A personal journal',
    }),
  ],
})
```

3. Create `src/content/config.ts`:

```ts
import { defineCollection } from 'astro:content'
import { postSchema } from '@inkpaper/astro/content'

export const collections = {
  posts: defineCollection({ type: 'content', schema: postSchema }),
}
```

4. Write posts under `src/content/posts/` and run `npm run dev`.

The integration automatically injects routes for home, archive, tags, and article pages — no page files needed.

See the example site source for detailed configuration: [examples/vitepress](./examples/vitepress) | [examples/astro](./examples/astro)

## Features

- **Rice paper texture** — SVG noise texture + vermillion top line for a paper-like feel
- **Ink / Paper / Vermillion color system** — full light and dark mode support
- **Configurable sidebar** — per-page-type control over visibility and tree type (directory or date)
- **Home / Archive / Tags** — three ready-to-use page components
- **Article aside** — word count, reading time, tags, related article recommendations
- **Video embedding** — `![](video.mp4)` markdown syntax automatically renders as `<video>` tags, supports mp4/webm/mov
- **Shared design system** — `@inkpaper/core` provides unified colors, typography, and texture across both framework implementations
- **Astro automatic route injection** — integration injects default page routes, no scaffolding needed
- **VitePress scaffolding tool** — `npx @inkpaper/create-for-vitepress` for one-command VitePress project initialization

## Package Structure

| Package | Description |
|---------|-------------|
| `@inkpaper/core` | Pure CSS design tokens, texture, typography, and shared component styles — framework-agnostic |
| `@inkpaper/vitepress` | VitePress theme: Vue components, Layout, sidebar config, content loader |
| `@inkpaper/astro` | Astro theme: integration (auto route & type injection), Astro components, sidebar config |
| `@inkpaper/create-for-vitepress` | VitePress project scaffolding tool |

Install `@inkpaper/vitepress` or `@inkpaper/astro` — core comes along as a dependency.

## License

[MIT](./LICENSE)
