import { getCollection } from 'astro:content'
import type { SidebarItem, SidebarOptions, PageSidebarConfig } from '../types.ts'

const DEFAULTS: Record<string, PageSidebarConfig> = {
  home:    { show: true,  tree: 'directory' },
  archive: { show: true,  tree: 'date' },
  tags:    { show: false },
  article: { show: true,  tree: 'directory' },
}

interface RawPost {
  slug: string
  title: string
  date: string
  order: number
}

async function loadPosts(postsBase: string): Promise<RawPost[]> {
  const entries = await getCollection('posts')
  return entries
    .filter((e: any) => e.data.date)
    .map((e: any) => ({
      slug: e.slug,
      title: e.data.title || e.slug.split('/').pop() || '',
      date: new Date(e.data.date).toISOString().slice(0, 10),
      order: e.data.order ?? 0,
    }))
    .sort((a: RawPost, b: RawPost) => b.date.localeCompare(a.date) || a.order - b.order)
}

function buildDirectoryTree(posts: RawPost[], postsBase: string): SidebarItem[] {
  const groups: Record<string, RawPost[]> = {}
  const topLevel: RawPost[] = []

  for (const p of posts) {
    const parts = p.slug.split('/')
    if (parts.length > 1) {
      const dir = parts.slice(0, -1).join('/')
      if (!groups[dir]) groups[dir] = []
      groups[dir].push(p)
    } else {
      topLevel.push(p)
    }
  }

  const items: SidebarItem[] = []

  for (const [dir, dirPosts] of Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))) {
    items.push({
      text: dir,
      collapsed: false,
      items: dirPosts.map(p => ({
        text: `${p.date} ${p.title}`,
        link: `${postsBase}/${p.slug}`,
      })),
    })
  }

  for (const p of topLevel) {
    items.push({
      text: `${p.date} ${p.title}`,
      link: `${postsBase}/${p.slug}`,
    })
  }

  return items
}

function buildDateTree(posts: RawPost[], postsBase: string): SidebarItem[] {
  const yearMap: Record<string, Record<string, RawPost[]>> = {}

  for (const p of posts) {
    const year = p.date.slice(0, 4)
    const month = p.date.slice(0, 7)
    if (!yearMap[year]) yearMap[year] = {}
    if (!yearMap[year][month]) yearMap[year][month] = []
    yearMap[year][month].push(p)
  }

  return Object.keys(yearMap)
    .sort((a, b) => b.localeCompare(a))
    .map(year => ({
      text: year,
      collapsed: false,
      items: Object.keys(yearMap[year])
        .sort((a, b) => b.localeCompare(a))
        .map(month => ({
          text: month,
          collapsed: false,
          items: yearMap[year][month].map(p => ({
            text: `${p.date} ${p.title}`,
            link: `${postsBase}/${p.slug}`,
          })),
        })),
    }))
}

export type PageType = 'home' | 'archive' | 'tags' | 'article'

export async function getSidebarItems(
  pageType: PageType,
  options?: SidebarOptions,
  postsBase = '/posts',
): Promise<SidebarItem[]> {
  const config: PageSidebarConfig = {
    ...DEFAULTS[pageType],
    ...options?.[pageType],
  }

  if (config.show === false) return []
  if (!config.tree) return []

  const posts = await loadPosts(postsBase)

  if (config.tree === 'date') return buildDateTree(posts, postsBase)
  return buildDirectoryTree(posts, postsBase)
}
