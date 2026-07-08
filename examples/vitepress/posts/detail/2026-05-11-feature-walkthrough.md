---
title: "inkpaper: Feature Walkthrough"
date: 2026-05-09
order: 2
tags:
  - features
  - VitePress
  - configuration
---

# inkpaper: Feature Walkthrough

inkpaper doesn't have many features, but each one was thought through before being built. This post breaks them down one by one.

## Sidebar Configuration

The sidebar is the most-used navigation element, so it has fine-grained configuration.

`generateSidebar` takes two arguments: the posts directory path and an options object.

```ts
import { generateSidebar } from '@inkpaper/vitepress/config'

generateSidebar(postsDir, {
  home:    { show: true, tree: 'directory' },
  archive: { show: true, tree: 'date' },
  tags:    { show: false },
  article: { show: true, tree: 'directory' },
})
```

Four page types, each independently configurable:

| Page Type | Path Prefix | Default show | Default tree |
|-----------|-------------|-------------|-------------|
| home | `/` | true | directory |
| archive | `/archive/` | true | date |
| tags | `/tags` | false | — |
| article | `/posts/` | true | directory |

`show: false` emits an empty array to VitePress, preventing it from falling back to another path's sidebar config.

Two tree types:

- **directory**: organized by filesystem directory structure. Directory names become group headings, files sorted by date descending. Good when posts have clear categories.
- **date**: organized as a year → month timeline. Good for archive browsing.

Trees are generated lazily — if no page type uses the date tree, the filesystem is only scanned once for the directory tree.

Omitting the second argument gives you the defaults shown in the table above.

## Home Page Component

`HomeLayout` displays four sections:

1. **Title and tagline**: read from VitePress config's `title` and `description`. Change the config, change the home page — no need to touch component code.
2. **Stats bar**: total post count, total tag count, last update date. Laid out in a single row, information-dense.
3. **Tag cloud**: top 10 tags by frequency. Clicking a tag navigates to the tags page with the filter pre-applied.
4. **Recent posts**: the latest 10 articles, showing title, date, and tags. List items have staggered fadeInUp animations.

The home page uses `layout: doc` instead of VitePress's default `home` layout, because we need the standard sidebar + content layout structure.

## Archive Component

`ArchivePage` groups all posts by year in reverse chronological order. Each year heading shows the article count.

Implementation is straightforward: take the posts data, group by `date.slice(0, 4)`, sort, render. No pagination — personal blogs rarely have thousands of posts, and full rendering actually provides a better search experience.

## Tags Component

`TagsPage` has two areas:

The top section is a tag cloud showing all tags with their post counts. Click a tag to filter, click again to deselect. The active tag is highlighted in vermillion.

Below is the post list, filtered in real time based on the selected tag. With no tag selected, all posts are shown.

The tags page supports URL query parameters: visiting `/tags?tag=CSS` auto-selects the CSS tag. The home page tag cloud links use this mechanism.

## Article Aside

Each article's right sidebar (below the outline section) shows three blocks of information:

**Word count and reading time**: implemented via DOM text node counting. It reads `textContent` from the `.content-container .vp-doc` element, strips whitespace, and counts characters. Reading time is calculated at 400 characters per minute, with a minimum of 1 min.

The count recalculates on route change, with a 100ms `setTimeout` to wait for DOM updates.

**Current article tags**: read from frontmatter, each linking to the tags page.

**Related articles**: the recommendation logic has two tiers. It first looks for a user-provided `related.json` containing pre-computed article mappings. If absent, it falls back to tag intersection: iterate all posts, score by shared tag count with the current article, take the top 5.

`related.json` format:

```json
{
  "/posts/some-article": [
    { "link": "/posts/another-article", "title": "Another Article" }
  ]
}
```

## Video Embedding

Markdown's native `![](url)` image syntax can be used to embed videos. When the URL ends with a video extension (`.mp4`, `.webm`, `.mov`, `.avi`, `.mkv`), the markdown renderer automatically outputs a `<video>` element with `controls` enabled instead of an `<img>` tag.

```md
![](demo.mp4)
```

To use this feature, enable the video plugin in your VitePress config:

```ts
import { videoPlugin } from '@inkpaper/vitepress/markdown'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(videoPlugin)
    }
  }
})
```

The `alt` text or `title` attribute is used as the video's `title` attribute:

```md
![A walkthrough of the ink effect](demo.mp4)
```

Both image and video elements share the same responsive styling (max-width, border-radius) defined in `@inkpaper/core`.

## Content Loader

The theme provides `createPostsLoader`, imported from `@inkpaper/vitepress/loader`:

```ts
import { createPostsLoader } from '@inkpaper/vitepress/loader'

export default createPostsLoader()
```

It wraps VitePress's `createContentLoader`, scanning `posts/**/*.md` by default, extracting `title`, `date`, `tags`, and `order` from frontmatter, sorted by date descending. Pass a custom glob to change the scan path.

## Scaffolding Tool

`@inkpaper/create-for-vitepress` is a standalone npm package for quick project initialization:

```bash
npx @inkpaper/create-for-vitepress my-blog
```

It generates a complete project structure in the target directory: `package.json`, VitePress config, theme entry, three pages, content loader, and a sample post. Existing files are never overwritten.

## Package Structure

The theme is split into three npm packages:

**@inkpaper/core** is pure CSS. It defines design tokens, font loading, paper texture, and shared component styles (post list, tags, aside blocks). No framework dependency — it can technically be used in any HTML page.

**@inkpaper/vitepress** depends on core and adds Vue components, Layout, data injection (provide/inject), the sidebar config function, and the content loader. All VitePress-specific style overrides (`--vp-*` variable mappings, `.VPSidebarItem` rules, etc.) live in this package.

**@inkpaper/create-for-vitepress** is the scaffolding tool for generating project templates. Installed independently, no dependency on the other two packages.

Users only need to install `@inkpaper/vitepress`; core comes along as a dependency.

This split is designed for future expansion. To build an Astro version, create a new `@inkpaper/astro` package, import core's CSS, and rewrite the page logic with Astro components. Colors, textures, and typography all carry over.
