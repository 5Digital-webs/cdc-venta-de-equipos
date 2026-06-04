import type { CollectionEntry } from 'astro:content';

type ServicioEntry = CollectionEntry<'servicios'>;

const PRODUCTS_PATH_RE = /[\\/]products[\\/]/;

export function isProductEntry(entry: ServicioEntry): boolean {
  return (
    entry.data.tags?.includes('productos') === true ||
    PRODUCTS_PATH_RE.test(entry.filePath ?? '')
  );
}

export function getContentSlug(id: string): string {
  return id.split('/').filter(Boolean).pop() ?? id;
}

export function normalizeProductoParam(param: string): string {
  return decodeURIComponent(param.replace(/\+/g, ' ')).trim();
}

export function resolveProductoTitleFromParam(
  param: string,
  entries: ServicioEntry[],
): string | undefined {
  if (!param) return undefined;

  const normalized = normalizeProductoParam(param);
  const normalizedLower = normalized.toLowerCase();

  const match = entries.find((entry) => {
    const title = entry.data.title;
    const slug = getContentSlug(entry.id);
    return (
      title === normalized ||
      title.toLowerCase() === normalizedLower ||
      slug === normalized ||
      slug.toLowerCase() === normalizedLower
    );
  });

  return match?.data.title;
}
