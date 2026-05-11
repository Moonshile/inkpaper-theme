import { inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export interface Post {
  title: string
  url: string
  date: string
  tags: string[]
  order: number
}

export const postsKey: InjectionKey<Ref<Post[]>> = Symbol('inkpaper-posts')
export const relatedKey: InjectionKey<Ref<Record<string, { link: string; title: string }[]>>> = Symbol('inkpaper-related')

export function usePosts(): Post[] {
  const posts = inject(postsKey)
  if (!posts) {
    throw new Error('[inkpaper] Posts data not provided. Did you call themeEnhance?')
  }
  return posts.value
}

export function useRelated(): Record<string, { link: string; title: string }[]> {
  const related = inject(relatedKey)
  return related?.value ?? {}
}
