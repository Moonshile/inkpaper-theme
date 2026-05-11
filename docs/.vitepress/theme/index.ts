import theme, { themeEnhance } from '@inkpaper/vitepress'
import type { Theme } from 'vitepress'
import { data as posts } from '../../posts.data'

export default {
  ...theme,
  enhanceApp(ctx) {
    theme.enhanceApp?.(ctx)
    themeEnhance({ posts })(ctx)
  }
} satisfies Theme
