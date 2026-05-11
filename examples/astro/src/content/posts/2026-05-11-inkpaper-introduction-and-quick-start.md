---
title: "inkpaper: Introduction and Quick Start"
date: 2026-05-11
order: 2
tags:
  - theme
  - Astro
  - tutorial
---

# inkpaper: Introduction and Quick Start

inkpaper is a blog theme. The visual idea in one line: white paper, black ink, vermillion accents.

The motivation is straightforward — a personal journal doesn't need flashy design. It needs to be quiet, readable, and textured. Most blog themes are either over-engineered or visually noisy. What I wanted was opening a page that feels like unrolling a sheet of rice paper.

inkpaper ships both a VitePress and an Astro version, sharing the same design system (`@inkpaper/core`). This post covers the Astro version.

## Installation

```bash
npm install @inkpaper/astro
```

The theme peer-depends on Astro >= 4.0.0.

## Quick Start

### 1. Astro Config

`astro.config.mjs`:

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

`title` and `description` are displayed as the home page title and tagline.

The integration automatically injects routes for the home, archive, tags, and article pages — no need to create page files manually.

### 2. Content Collection

The Astro version uses Content Collections to manage posts. Define the schema in `src/content/config.ts`:

```ts
import { defineCollection } from 'astro:content'
import { postSchema } from '@inkpaper/astro/content'

export const collections = {
  posts: defineCollection({ type: 'content', schema: postSchema }),
}
```

Write articles under `src/content/posts/`. Frontmatter needs at least `title`, `date`, and `tags`:

```md
---
title: My First Post
date: 2026-05-11
tags:
  - essay
---

Post content goes here.
```

`date` determines sort order. `tags` are used for the tags page filter and related-article recommendations. Subdirectories for categorization are supported.

### 3. Start

```bash
npm run dev
```

Open the browser and you'll see your site with the inkpaper theme applied, including home, archive, tags, and article pages out of the box.

If you want to customize a specific page, create a `.astro` file with the same name under `src/pages/` to override the default route.

## Source Code

GitHub: [Moonshile/inkpaper-theme](https://github.com/Moonshile/inkpaper-theme)
