export interface Post {
  title: string
  slug: string
  url: string
  date: string
  tags: string[]
  order: number
}

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
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

export interface InkpaperConfig {
  title?: string
  description?: string
  postsBase?: string
  nav?: { text: string; link: string }[]
  sidebar?: SidebarOptions
  related?: Record<string, { link: string; title: string }[]>
}
