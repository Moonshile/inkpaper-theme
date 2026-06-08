import { getCollection } from 'astro:content'
import type { Post } from '../types.ts'
import { countWords } from '@inkpaper/core/count-words'

export async function getSortedPosts(postsBase = '/posts'): Promise<Post[]> {
  const entries = await getCollection('posts')
  return entries
    .filter((e: any) => e.data.date)
    .map((e: any) => ({
      title: e.data.title || e.slug.split('/').pop() || '',
      slug: e.slug,
      url: `${postsBase}/${e.slug}`,
      date: new Date(e.data.date).toISOString().slice(0, 10),
      tags: e.data.tags || [],
      order: e.data.order ?? 0,
      wordCount: countWords(e.body || ''),
    }))
    .sort((a: Post, b: Post) => b.date.localeCompare(a.date) || a.order - b.order)
}
