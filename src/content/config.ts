import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    descriptionEs: z.string(),
    descriptionEn: z.string(),
    image: z.string().optional(),
    video: z.string().optional(),
    poster: z.string().optional(),
    link: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(0)
  })
});

export const collections = {
  'projects': projectsCollection
};
