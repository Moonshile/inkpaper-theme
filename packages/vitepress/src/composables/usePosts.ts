import { inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export interface Post {
  title: string
  url: string
  date: string
  tags: string[]
  order: number
  wordCount?: number
}

export const postsKey: InjectionKey<Ref<Post[]>> = Symbol.for('inkpaper-posts')
export const relatedKey: InjectionKey<Ref<Record<string, { link: string; title: string }[]>>> = Symbol.for('inkpaper-related')

export function usePosts(): Post[] {
  const posts = inject(postsKey)
  return posts?.value ?? []
}

export function useRelated(): Record<string, { link: string; title: string }[]> {
  const related = inject(relatedKey)
  return related?.value ?? {}
}
