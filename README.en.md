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

```bash
npm install @inkpaper/astro
```

See the example site source for detailed configuration: [examples/vitepress](./examples/vitepress) | [examples/astro](./examples/astro)

## Features

- **Rice paper texture** — SVG noise texture + vermillion top line for a paper-like feel
- **Ink / Paper / Vermillion color system** — full light and dark mode support
- **Configurable sidebar** — per-page-type control over visibility and tree type (directory or date)
- **Home / Archive / Tags** — three ready-to-use page components
- **Article aside** — word count, reading time, tags, related article recommendations
- **Shared design system** — `@inkpaper/core` provides unified colors, typography, and texture across both framework implementations
- **Scaffolding tool** — `npx @inkpaper/create-for-vitepress` for one-command VitePress project initialization

## Package Structure

| Package | Description |
|---------|-------------|
| `@inkpaper/core` | Pure CSS design tokens, texture, typography, and shared component styles — framework-agnostic |
| `@inkpaper/vitepress` | VitePress theme: Vue components, Layout, sidebar config, content loader |
| `@inkpaper/astro` | Astro theme: Astro components, integration, sidebar config |
| `@inkpaper/create-for-vitepress` | VitePress project scaffolding tool |

Install `@inkpaper/vitepress` or `@inkpaper/astro` — core comes along as a dependency.

## License

[MIT](./LICENSE)
