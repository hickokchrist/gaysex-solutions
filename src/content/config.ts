import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
  }),
});

const newsletter = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { blog, newsletter };