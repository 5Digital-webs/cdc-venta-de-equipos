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
      format: { data: true },
      schema: {
        title: fields.slug({ name: { label: 'Título / Slug' } }),
        description: fields.text({ label: 'Descripción SEO', multiline: true }),
        published: fields.checkbox({ label: 'Publicado', defaultValue: true }),
        serviceName: fields.text({ label: 'Nombre del servicio (badge)' }),
        heroTitle: fields.text({ label: 'Título del hero', multiline: true }),
        heroSubtitle: fields.text({ label: 'Subtítulo del hero', multiline: true }),
        heroImage: fields.image({
          label: 'Imagen del hero',
          directory: 'src/assets/images/images-servicios',
          publicPath: '@assets/images/images-servicios/',
        }),
        heroImageAlt: fields.text({ label: 'Texto alternativo del hero' }),
        highlights: fields.array(
          fields.object({
            value: fields.text({ label: 'Valor' }),
            label: fields.text({ label: 'Etiqueta' }),
            counterTarget: fields.integer({ label: 'Target animación (opcional)' }),
            counterPrefix: fields.text({ label: 'Prefijo animación (opcional)' }),
            counterSuffix: fields.text({ label: 'Sufijo animación (opcional)' }),
          }),
          { label: 'Métricas', itemLabel: (props) => props.fields.label.value || 'Métrica' },
        ),
        sections: fields.array(
          fields.object({
            title: fields.text({ label: 'Título de sección' }),
            description: fields.text({ label: 'Descripción (opcional)', multiline: true }),
            items: fields.array(fields.text({ label: 'Ítem' }), { label: 'Ítems' }),
          }),
          { label: 'Secciones', itemLabel: (props) => props.fields.title.value || 'Sección' },
        ),
        ctaText: fields.text({ label: 'Texto del CTA', multiline: true }),
        ctaButtonText: fields.text({ label: 'Texto del botón CTA', defaultValue: 'Solicitar asesoría' }),
        ctaHref: fields.text({ label: 'Enlace del CTA', defaultValue: '/cotizar' }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        order: fields.integer({ label: 'Orden de visualización' }),
        publishedAt: fields.date({ label: 'Fecha de Publicación' }),
        updatedAt: fields.date({ label: 'Fecha de Actualización' }),
      },
    }),

    products: collection({
      label: 'Productos',
      slugField: 'titulo',
      path: 'src/content/products/*',
      format: { contentField: 'content' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        descripcion: fields.text({ label: 'Descripción', multiline: true }),
        sku: fields.text({ label: 'SKU' }),
        marca: fields.text({ label: 'Marca' }),
        categoria: fields.text({ label: 'Categoría' }),
        ano: fields.text({ label: 'Año' }),
        precio: fields.text({ label: 'Precio' }),
        published: fields.checkbox({ label: 'Publicado', defaultValue: true }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        image: fields.image({
          label: 'Imagen',
          directory: 'src/assets/images/images-equipos',
          publicPath: '@assets/images/images-equipos/',
        }),
        whatsappMessage: fields.text({ label: 'Mensaje de WhatsApp' }),
        publishedAt: fields.date({ label: 'Fecha de Publicación' }),
        updatedAt: fields.date({ label: 'Fecha de Actualización' }),
        content: fields.markdoc({
          label: 'Contenido',
          options: {
            image: {
              directory: 'src/assets/images/images-equipos',
              publicPath: '@assets/images/images-equipos/',
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

    marcas: collection({
      label: 'Marcas',
      slugField: 'title',
      path: 'src/content/marcas/*',
      format: { data: true },
      schema: {
        title: fields.slug({ name: { label: 'Título / Slug' } }),
        description: fields.text({ label: 'Descripción SEO', multiline: true }),
        published: fields.checkbox({ label: 'Publicado', defaultValue: true }),
        brandName: fields.text({ label: 'Nombre de la marca' }),
        brandLogo: fields.image({
          label: 'Logo de la marca',
          directory: 'src/assets/images/images-marcas',
          publicPath: '@assets/images/images-marcas/',
        }),
        heroTitle: fields.text({ label: 'Título del hero', multiline: true }),
        heroImage: fields.image({
          label: 'Imagen del hero',
          directory: 'src/assets/images/images-marcas',
          publicPath: '@assets/images/images-marcas/',
        }),
        heroImageAlt: fields.text({ label: 'Texto alternativo del hero' }),
        originTitle: fields.text({ label: 'Título de procedencia' }),
        originText: fields.text({ label: 'Texto de procedencia', multiline: true }),
        originFlag: fields.text({
          label: 'Código de bandera (ISO)',
          description: 'Código de país de 2 letras: us, cl, be, it, gb',
        }),
        sections: fields.array(
          fields.object({
            title: fields.text({ label: 'Título de sección' }),
            items: fields.array(fields.text({ label: 'Ítem' }), { label: 'Ítems' }),
          }),
          { label: 'Secciones', itemLabel: (props) => props.fields.title.value || 'Sección' },
        ),
        ctaText: fields.text({ label: 'Texto del CTA', multiline: true }),
        ctaButtonText: fields.text({ label: 'Texto del botón CTA', defaultValue: 'Solicitar asesoría' }),
        ctaHref: fields.text({ label: 'Enlace del CTA', defaultValue: '/cotizar' }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        order: fields.integer({ label: 'Orden de visualización' }),
        publishedAt: fields.date({ label: 'Fecha de Publicación' }),
        updatedAt: fields.date({ label: 'Fecha de Actualización' }),
      },
    }),

    soluciones: collection({
      label: 'Soluciones por Sector',
      slugField: 'title',
      path: 'src/content/soluciones/*',
      format: { data: true },
      schema: {
        title: fields.slug({ name: { label: 'Título / Slug' } }),
        description: fields.text({ label: 'Descripción SEO', multiline: true }),
        published: fields.checkbox({ label: 'Publicado', defaultValue: true }),
        badge: fields.text({ label: 'Etiqueta del sector' }),
        heroTitle: fields.text({ label: 'Título del hero', multiline: true }),
        heroDescription: fields.text({ label: 'Descripción del hero', multiline: true }),
        heroImage: fields.image({
          label: 'Imagen del hero',
          directory: 'src/assets/images/images-soluciones',
          publicPath: '@assets/images/images-soluciones/',
        }),
        heroImageAlt: fields.text({ label: 'Texto alternativo del hero' }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Valor' }),
            label: fields.text({ label: 'Etiqueta' }),
          }),
          { label: 'Métricas', itemLabel: (props) => props.fields.value.value || 'Métrica' },
        ),
        challengesTitle: fields.text({ label: 'Título de desafíos' }),
        challenges: fields.array(fields.text({ label: 'Desafío' }), { label: 'Desafíos del sector' }),
        solutionTitle: fields.text({ label: 'Título de la solución' }),
        solutionIntro: fields.text({ label: 'Introducción de la solución', multiline: true }),
        solutionItems: fields.array(
          fields.object({
            title: fields.text({ label: 'Título' }),
            description: fields.text({ label: 'Descripción', multiline: true }),
          }),
          { label: 'Equipos / soluciones', itemLabel: (props) => props.fields.title.value || 'Ítem' },
        ),
        benefitsTitle: fields.text({ label: 'Título de beneficios' }),
        benefits: fields.array(fields.text({ label: 'Beneficio' }), { label: 'Beneficios' }),
        ctaTitle: fields.text({ label: 'Título del CTA', multiline: true }),
        ctaButtonText: fields.text({ label: 'Texto del botón CTA', defaultValue: 'Solicitar asesoría técnica' }),
        ctaHref: fields.text({ label: 'Enlace del CTA', defaultValue: '/cotizar' }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        order: fields.integer({ label: 'Orden de visualización' }),
        publishedAt: fields.date({ label: 'Fecha de Publicación' }),
        updatedAt: fields.date({ label: 'Fecha de Actualización' }),
      },
    }),
  },
});

