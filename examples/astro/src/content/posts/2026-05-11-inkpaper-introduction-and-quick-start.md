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

### 3. Page Files

Astro uses file-based routing — no `.astro` file means no URL. The theme provides components but can't register routes automatically. You need to create the corresponding page files to mount them.

`src/pages/index.astro`:

```astro
---
import BaseLayout from '@inkpaper/astro/components/BaseLayout.astro'
import HomeLayout from '@inkpaper/astro/components/HomeLayout.astro'
import { getSortedPosts } from '@inkpaper/astro/utils/posts.ts'
import { getSidebarItems } from '@inkpaper/astro/utils/sidebar.ts'
import config from 'virtual:inkpaper-config'

const posts = await getSortedPosts(config.postsBase)
const sidebarItems = await getSidebarItems('home', config.sidebar, config.postsBase)
---

<BaseLayout title={config.title} description={config.description} nav={config.nav} sidebarItems={sidebarItems} currentPath={Astro.url.pathname}>
  <HomeLayout posts={posts} title={config.title} description={config.description} />
</BaseLayout>
```

Archive and tags pages follow the same pattern with their respective components. Article pages use a dynamic route at `src/pages/posts/[...slug].astro`.

That's it. Run `npm run dev`, open the browser, and you should see your site with the inkpaper theme applied.

## Source Code

GitHub: [Moonshile/inkpaper-theme](https://github.com/Moonshile/inkpaper-theme)
