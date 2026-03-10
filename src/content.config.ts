import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
  }),
});

const newsletter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletter' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { blog, newsletter, gallery };
```