import DefaultTheme from 'vitepress/theme'
import type { Theme, EnhanceAppContext } from 'vitepress'
import { ref } from 'vue'
import Layout from './Layout.vue'
import { postsKey, relatedKey } from './composables/usePosts'
import type { Post } from './composables/usePosts'
import './styles/vitepress.css'

export type { Post }
export type { SidebarTree, PageSidebarConfig, SidebarOptions } from './types'
export { postsKey, relatedKey } from './composables/usePosts'

export { default as HomeLayout } from './components/HomeLayout.vue'
export { default as ArchivePage } from './components/ArchivePage.vue'
export { default as TagsPage } from './components/TagsPage.vue'
export { default as ArticleAside } from './components/ArticleAside.vue'

export interface ThemeEnhanceConfig {
  posts: Post[]
  related?: Record<string, { link: string; title: string }[]>
}

export function themeEnhance(config: ThemeEnhanceConfig) {
  return (ctx: EnhanceAppContext) => {
    ctx.app.provide(postsKey, ref(config.posts))
    ctx.app.provide(relatedKey, ref(config.related ?? {}))
  }
}

const theme: Theme = {
  extends: DefaultTheme,
  Layout
}

export default theme
