
export type SidebarTree = 'directory' | 'date'

export interface PageSidebarConfig {
  show?: boolean
  tree?: SidebarTree
}

export interface SidebarOptions {
  home?: PageSidebarConfig
  archive?: PageSidebarConfig
  tags?: PageSidebarConfig
  article?: PageSidebarConfig
}

export interface SidebarItem {
  text: string
  date?: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

export interface Post {
  title: string
  slug: string
  url: string
  date: string
  tags: string[]
  order: number
  wordCount?: number
}

export interface InkpaperConfig {
  title?: string
  description?: string
  postsBase?: string
  nav?: { text: string; link: string }[]
  sidebar?: SidebarOptions
  related?: Record<string, { link: string; title: string }[]>
  inkEffect?: string
  inkEffectOpacity?: number
}
