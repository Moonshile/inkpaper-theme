import fs from 'node:fs'
import path from 'node:path'

/** @typedef {'directory' | 'date'} SidebarTree */
/** @typedef {{ show?: boolean, tree?: SidebarTree }} PageSidebarConfig */
/** @typedef {{ home?: PageSidebarConfig, archive?: PageSidebarConfig, tags?: PageSidebarConfig, article?: PageSidebarConfig }} SidebarOptions */

const DEFAULTS = {
  home:    { show: true, tree: 'directory' },
  archive: { show: true, tree: 'date' },
  tags:    { show: false },
  article: { show: true, tree: 'directory' },
}

const PAGE_PREFIX = {
  archive: '/archive/',
  tags:    '/tags',
  article: '/posts/',
  home:    '/',
}

function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const fm = match[1]
  return {
    title: fm.match(/title:\s*(.+)/)?.[1]?.trim() || '',
    date: fm.match(/date:\s*(.+)/)?.[1]?.trim() || '',
    order: Number(fm.match(/order:\s*(\d+)/)?.[1] || '0')
  }
}

function scanDir(dir, urlPrefix, categoryPrefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const items = []
  const groups = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (entry.isDirectory()) {
      const childCategory = categoryPrefix ? `${categoryPrefix}/${entry.name}` : entry.name
      const children = scanDir(path.join(dir, entry.name), `${urlPrefix}/${entry.name}`, childCategory)
      if (children.length) {
        groups.push({ text: entry.name, link: `/category/${childCategory}`, collapsed: false, items: children })
      }
    } else if (entry.name.endsWith('.md')) {
      const fm = parseFrontmatter(path.join(dir, entry.name))
      if (!fm || !fm.date) continue
      const slug = entry.name.replace('.md', '')
      const datePrefix = fm.date.slice(0, 10)
      items.push({
        text: `${datePrefix} ${fm.title || slug}`,
        link: `${urlPrefix}/${slug}`,
        _date: fm.date,
        _order: fm.order
      })
    }
  }

  items.sort((a, b) => b._date.localeCompare(a._date) || a._order - b._order)
  return [...groups, ...items]
}

function collectPosts(dir, urlPrefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const items = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (entry.isDirectory()) {
      items.push(...collectPosts(path.join(dir, entry.name), `${urlPrefix}/${entry.name}`))
    } else if (entry.name.endsWith('.md')) {
      const fm = parseFrontmatter(path.join(dir, entry.name))
      if (!fm || !fm.date) continue
      const slug = entry.name.replace('.md', '')
      items.push({
        text: fm.title || slug,
        link: `${urlPrefix}/${slug}`,
        date: fm.date.slice(0, 10),
        order: fm.order
      })
    }
  }

  return items
}

function buildDateTree(postsDir) {
  if (!fs.existsSync(postsDir)) return []

  const posts = collectPosts(postsDir, '/posts')
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order)

  const yearMap = {}
  for (const p of posts) {
    const year = p.date.slice(0, 4)
    const month = p.date.slice(0, 7)
    if (!yearMap[year]) yearMap[year] = {}
    if (!yearMap[year][month]) yearMap[year][month] = []
    yearMap[year][month].push({ text: `${p.date} ${p.text}`, link: p.link })
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
          items: yearMap[year][month]
        }))
    }))
}

/**
 * Generate VitePress sidebar config.
 * @param {string} postsDir - Absolute path to the posts directory
 * @param {SidebarOptions} [options] - Per-page sidebar configuration
 * @returns {Record<string, any[]>}
 */
export function generateSidebar(postsDir, options) {
  if (!fs.existsSync(postsDir)) return {}

  const opts = {
    home:    { ...DEFAULTS.home,    ...options?.home },
    archive: { ...DEFAULTS.archive, ...options?.archive },
    tags:    { ...DEFAULTS.tags,    ...options?.tags },
    article: { ...DEFAULTS.article, ...options?.article },
  }

  let dirTree = null
  let dateTree = null

  function getTree(type) {
    if (type === 'directory') {
      if (!dirTree) dirTree = scanDir(postsDir, '/posts')
      return dirTree
    } else {
      if (!dateTree) dateTree = buildDateTree(postsDir)
      return dateTree
    }
  }

  const sidebar = {}

  for (const [pageType, prefix] of Object.entries(PAGE_PREFIX)) {
    const config = opts[pageType]
    if (config.show === false) {
      sidebar[prefix] = []
    } else if (config.tree) {
      sidebar[prefix] = getTree(config.tree)
    }
  }

  if (opts.home.show !== false && opts.home.tree) {
    sidebar['/category/'] = getTree(opts.home.tree)
  }

  return sidebar
}

