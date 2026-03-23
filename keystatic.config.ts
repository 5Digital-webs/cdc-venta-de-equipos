import { config, fields, collection } from '@5digital/keystatic-core';

export default config({
  storage:
    process.env.NODE_ENV === 'production'
      ? {
          kind: 'github',
          repo: {
            owner: '5Digital-webs',
            name: 'base',
          },
          internalAuth: true,
        }
      : {
          kind: 'local',
        },
  locale: 'es-ES',

  ui: {
    brand: {
      name: 'Base',
    },
  },

  collections: {
    servicios: collection({
      label: 'Servicios',
      slugField: 'title',
      path: 'src/content/servicios/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descripción' }),
        published: fields.checkbox({ label: 'Publicado', defaultValue: true }),
        category: fields.text({ label: 'Categoría' }),
        tags: fields.array(fields.text({ label: 'Etiqueta' }), { label: 'Etiquetas' }),
        price: fields.text({ label: 'Precio' }),
        duration: fields.text({ label: 'Duración' }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        image: fields.image({ 
          label: 'Imagen',
          directory: 'src/assets/images/servicios',
          publicPath: '@assets/images/servicios/',
        }),
        whatsappMessage: fields.text({ label: 'Mensaje de WhatsApp' }),
        publishedAt: fields.date({ label: 'Fecha de Publicación' }),
        updatedAt: fields.date({ label: 'Fecha de Actualización' }),
        content: fields.markdoc({
          label: 'Contenido',
          options: {
            image: {
              directory: 'src/assets/images/servicios',
              publicPath: '@assets/images/servicios/',
            },
          },
        }),
      },
    }),

    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descripción' }),
        published: fields.checkbox({ label: 'Publicado', defaultValue: true }),
        tags: fields.array(fields.text({ label: 'Etiqueta' }), { label: 'Etiquetas' }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        image: fields.image({ 
          label: 'Imagen',
          directory: 'src/assets/images/blog',
          publicPath: '@assets/images/blog/',
        }),
        author: fields.text({ label: 'Autor' }),
        publishedAt: fields.date({ label: 'Fecha de Publicación' }),
        updatedAt: fields.date({ label: 'Fecha de Actualización' }),
        content: fields.markdoc({
          label: 'Contenido',
          options: {
            image: {
              directory: 'src/assets/images/blog',
              publicPath: '@assets/images/blog/',
            },
          },
        }),
      },
    }),
  },
});

