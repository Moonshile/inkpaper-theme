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
