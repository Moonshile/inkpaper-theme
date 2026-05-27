import { getCollection } from 'astro:content'
import type { Post } from '../types.ts'

function countWords(body: string): number {
  const cleaned = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[#*`\[\]()>_~|{}\-=]/g, '')
    .replace(/\s+/g, '')
  return cleaned.length
}

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
