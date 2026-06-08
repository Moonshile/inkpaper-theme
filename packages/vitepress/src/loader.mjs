import { createContentLoader } from 'vitepress'
import { countWords } from '@inkpaper/core/count-words'

/**
 * Create a VitePress content loader for blog posts.
 * @param {string} [pattern='posts/**\/*.md'] - Glob pattern for post files
 */
export function createPostsLoader(pattern = 'posts/**/*.md') {
  return createContentLoader(pattern, {
    includeSrc: true,
    transform(raw) {
      return raw
        .filter(({ frontmatter }) => frontmatter.date)
        .map(({ url, frontmatter, src }) => ({
          title: frontmatter.title || url.split('/').pop()?.replace('.html', '') || '',
          url,
          date: new Date(frontmatter.date).toISOString().slice(0, 10),
          tags: frontmatter.tags || [],
          order: frontmatter.order ?? 0,
          wordCount: countWords(src)
        }))
        .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order)
    }
  })
}
