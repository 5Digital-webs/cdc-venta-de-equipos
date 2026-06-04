import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({
    pattern: 'content/servicios/**/*.mdoc',
    base: './src',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.boolean().default(true),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    price: z.string().optional(),
    duration: z.string().optional(),
    featured: z.boolean().optional(),
    image: z.string().optional(),
    whatsappMessage: z.string().optional(),
    publishedAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
  }),
});

const productos = defineCollection({
  loader: glob({
    pattern: '**/*.mdoc',
    base: './src/content/products',
  }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    sku: z.string(),
    marca: z.string(),
    categoria: z.string(),
    ano: z.string(),
    precio: z.string().optional(),
    published: z.boolean().default(true),
    featured: z.boolean().optional(),
    image: z.string().optional(),
    whatsappMessage: z.string().optional(),
    publishedAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    publishedAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
  }),
});

export const collections = {
  servicios,
  productos,
  blog,
};
