import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
const newsletter = defineCollection({
	type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
  }),
});
const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
const photospheres = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    location: z.string(),
    date: z.coerce.date(),
    cloudinaryId: z.string(),
    cloudinaryCloud: z.string().default("dyjznbnvw"),
  }),
});
export const collections = { blog, newsletter, gallery, photospheres };
