# inkpaper

White paper, black ink, vermillion accents.

inkpaper is a VitePress blog theme designed for personal journals and blogs. Quiet, readable, textured — opening a page feels like unrolling a sheet of rice paper.

[中文](./README.md)

## Quick Start

```bash
npx @inkpaper/create-for-vitepress my-blog
cd my-blog
npm install
npm run dev
```

One command generates a complete project structure, ready to go.

## Manual Installation

```bash
npm install @inkpaper/vitepress
```

See the [Introduction and Quick Start](https://github.com/Moonshile/inkpaper-theme/blob/main/docs/posts/2026-05-11-inkpaper-introduction-and-quick-start.md) for detailed configuration.

## Features

- **Rice paper texture** — SVG noise texture + vermillion top line for a paper-like feel
- **Ink / Paper / Vermillion color system** — full light and dark mode support
- **Configurable sidebar** — per-page-type control over visibility and tree type (directory or date)
- **Home / Archive / Tags** — three ready-to-use page components
- **Article aside** — word count, reading time, tags, related article recommendations
- **Scaffolding tool** — `npx @inkpaper/create-for-vitepress` for one-command initialization

## Package Structure

| Package | Description |
|---------|-------------|
| `@inkpaper/core` | Pure CSS design tokens, texture, and shared styles — framework-agnostic |
| `@inkpaper/vitepress` | Vue components, Layout, data injection, sidebar config, content loader |
| `@inkpaper/create-for-vitepress` | Project scaffolding tool |

Install `@inkpaper/vitepress` only — core comes along as a dependency. The split is designed for future expansion to frameworks like Astro.

## License

[MIT](./LICENSE)
