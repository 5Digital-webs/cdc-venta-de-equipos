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

const solucionStatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const solucionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const soluciones = defineCollection({
  loader: glob({
    pattern: '**/*.{yaml,yml}',
    base: './src/content/soluciones',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.boolean().default(true),
    badge: z.string(),
    heroTitle: z.string(),
    heroDescription: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string().optional(),
    stats: z.array(solucionStatSchema),
    challengesTitle: z.string(),
    challenges: z.array(z.string()),
    solutionTitle: z.string(),
    solutionIntro: z.string(),
    solutionItems: z.array(solucionItemSchema),
    benefitsTitle: z.string(),
    benefits: z.array(z.string()),
    ctaTitle: z.string(),
    ctaButtonText: z.string().default('Solicitar asesoría técnica'),
    ctaHref: z.string().default('/cotizar'),
    featured: z.boolean().optional(),
    order: z.number().optional(),
    publishedAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
  }),
});

export const collections = {
  servicios,
  productos,
  blog,
  soluciones,
};
