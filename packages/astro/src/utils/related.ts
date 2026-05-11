import type { Post } from '../types.ts'

export function findRelated(
  currentUrl: string,
  currentTags: string[],
  allPosts: Post[],
  relatedMap?: Record<string, { link: string; title: string }[]>,
): { link: string; title: string }[] {
  const fromMap = relatedMap?.[currentUrl]
  if (fromMap && fromMap.length > 0) return fromMap.slice(0, 5)

  if (!currentTags.length) return []

  return allPosts
    .filter(p => p.url !== currentUrl)
    .map(p => ({
      link: p.url,
      title: p.title,
      score: p.tags.filter(t => currentTags.includes(t)).length,
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}
