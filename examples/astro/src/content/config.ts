import { defineCollection } from 'astro:content'
import { postSchema } from '@inkpaper/astro/content'

export const collections = {
  posts: defineCollection({ type: 'content', schema: postSchema }),
}
