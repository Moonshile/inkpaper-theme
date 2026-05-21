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

function buildDirectoryTree(posts: RawPost[], postsBase: string, baseDir = ''): SidebarItem[] {
  const dirs = new Set<string>()
  const directPosts: RawPost[] = []

  for (const p of posts) {
    const rel = baseDir ? p.slug.slice(baseDir.length + 1) : p.slug
    if (!baseDir && p.slug.includes('/') || baseDir && p.slug.startsWith(baseDir + '/') && rel.includes('/')) {
      const firstDir = baseDir
        ? baseDir + '/' + rel.split('/')[0]
        : p.slug.split('/')[0]
      dirs.add(firstDir)
    } else if (!baseDir && !p.slug.includes('/')) {
      directPosts.push(p)
    } else if (baseDir && p.slug.startsWith(baseDir + '/') && !rel.includes('/')) {
      directPosts.push(p)
    }
  }

  const items: SidebarItem[] = []

  for (const dir of Array.from(dirs).sort()) {
    const dirPosts = posts.filter(p => p.slug.startsWith(dir + '/'))
    const directChildren = dirPosts.filter(p => !p.slug.slice(dir.length + 1).includes('/'))
    const childDirs = new Set<string>()
    for (const p of dirPosts) {
      const rel = p.slug.slice(dir.length + 1)
      if (rel.includes('/')) {
        childDirs.add(dir + '/' + rel.split('/')[0])
      }
    }

    const childItems: SidebarItem[] = []
    for (const childDir of Array.from(childDirs).sort()) {
      const name = childDir.split('/').pop()!
      childItems.push({
        text: name,
        link: `/category/${childDir}`,
        collapsed: false,
        items: posts.filter(p => p.slug.startsWith(childDir + '/') && !p.slug.slice(childDir.length + 1).includes('/')).map(p => ({
          text: `${p.date} ${p.title}`,
          link: `${postsBase}/${p.slug}`,
        })),
      })
    }
    for (const p of directChildren) {
      childItems.push({
        text: `${p.date} ${p.title}`,
        link: `${postsBase}/${p.slug}`,
      })
    }

    const dirName = baseDir ? dir.split('/').pop()! : dir
    items.push({
      text: dirName,
      link: `/category/${dir}`,
      collapsed: false,
      items: childItems,
    })
  }

  for (const p of directPosts) {
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
      link: `/archive/${year}`,
      collapsed: false,
      items: Object.keys(yearMap[year])
        .sort((a, b) => b.localeCompare(a))
        .map(month => ({
          text: month,
          link: `/archive/${month}`,
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
