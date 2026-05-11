import { z } from 'astro/zod'

export const postSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  order: z.number().default(0),
})
