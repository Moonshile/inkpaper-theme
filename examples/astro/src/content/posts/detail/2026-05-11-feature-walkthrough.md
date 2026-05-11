---
title: "inkpaper: Feature Walkthrough"
date: 2026-05-09
order: 2
tags:
  - features
  - Astro
  - configuration
---

# inkpaper: Feature Walkthrough

inkpaper doesn't have many features, but each one was thought through before being built. This post breaks them down one by one.

## Sidebar Configuration

The sidebar is the most-used navigation element, so it has fine-grained configuration.

The Astro version uses `getSidebarItems` to generate sidebar data. Configuration is aligned with the VitePress version:

```ts
inkpaper({
  sidebar: {
    home:    { show: true, tree: 'directory' },
    archive: { show: true, tree: 'date' },
    tags:    { show: false },
    article: { show: true, tree: 'directory' },
  },
})
```

Four page types, each independently configurable:

| Page Type | Default show | Default tree |
|-----------|-------------|-------------|
| home | true | directory |
| archive | true | date |
| tags | false | — |
| article | true | directory |

Two tree types:

- **directory**: organized by content collection directory structure. Directory names become group headings, files sorted by date descending. Good when posts have clear categories.
- **date**: organized as a year → month timeline. Good for archive browsing.

Omitting the `sidebar` config gives you the defaults shown in the table above.

## Home Page Component

`HomeLayout` displays four sections:

1. **Title and tagline**: read from the integration config's `title` and `description`. Change the config, change the home page — no need to touch component code.
2. **Stats bar**: total post count, total tag count, last update date. Laid out in a single row, information-dense.
3. **Tag cloud**: top 10 tags by frequency. Clicking a tag navigates to the tags page with the filter pre-applied.
4. **Recent posts**: the latest 10 articles, showing title, date, and tags. List items have staggered fadeInUp animations.

## Archive Component

`ArchivePage` groups all posts by year in reverse chronological order. Each year heading shows the article count.

Implementation is straightforward: take the posts data, group by `date.slice(0, 4)`, sort, render. No pagination — personal blogs rarely have thousands of posts, and full rendering actually provides a better search experience.

## Tags Component

`TagsPage` has two areas:

The top section is a tag cloud showing all tags with their post counts. Click a tag to filter, click again to deselect. The active tag is highlighted in vermillion.

Below is the post list, filtered in real time based on the selected tag. With no tag selected, all posts are shown.

The tags page supports URL query parameters: visiting `/tags?tag=CSS` auto-selects the CSS tag. The home page tag cloud links use this mechanism.

Interactivity is implemented with vanilla JS and `data-*` attributes — no additional frontend framework required.

## Article Aside

Each article's right sidebar shows three blocks of information:

**Word count and reading time**: computed at build time from the Markdown source, stripping frontmatter and markup syntax before counting characters. Reading time is calculated at 400 characters per minute, with a minimum of 1 min.

**Current article tags**: read from frontmatter, each linking to the tags page.

**Related articles**: the recommendation logic has two tiers. It first looks for a user-provided `related` map in the integration config. If absent, it falls back to tag intersection: iterate all posts, score by shared tag count with the current article, take the top 5.

`related` config format:

```ts
inkpaper({
  related: {
    '/posts/some-article': [
      { link: '/posts/another-article', title: 'Another Article' }
    ]
  }
})
```

## Content Collection

The Astro version uses Content Collections instead of VitePress's content loader. The theme provides `postSchema` (Zod schema) and `getSortedPosts` utility:

```ts
// src/content/config.ts
import { defineCollection } from 'astro:content'
import { postSchema } from '@inkpaper/astro/content'

export const collections = {
  posts: defineCollection({ type: 'content', schema: postSchema }),
}
```

`getSortedPosts` reads from the content collection, extracts `title`, `date`, `tags`, and `order` from frontmatter, sorted by date descending.

## Package Structure

The theme is split into four npm packages:

**@inkpaper/core** is pure CSS. It defines design tokens, font loading, paper texture, and shared component styles. No framework dependency.

**@inkpaper/vitepress** depends on core and adds Vue components, Layout, data injection, the sidebar config function, and the content loader.

**@inkpaper/astro** depends on core and adds Astro components, Layout, Astro integration, sidebar generation, and content collection schema.

**@inkpaper/create-for-vitepress** is the scaffolding tool for VitePress projects.

Both framework versions share all CSS from `@inkpaper/core`. Only the component layer is implemented separately.
