import type { CollectionEntry } from 'astro:content';

type ProductoEntry = CollectionEntry<'productos'>;

export function getContentSlug(id: string): string {
  const segment = id.split('/').filter(Boolean).pop() ?? id;
  return segment.replace(/\.(yaml|yml|mdoc)$/i, '');
}

export function normalizeProductoParam(param: string): string {
  return decodeURIComponent(param.replace(/\+/g, ' ')).trim();
}

export function resolveProductoTituloFromSku(
  sku: string,
  entries: ProductoEntry[],
): string | undefined {
  if (!sku) return undefined;

  const normalizedSku = normalizeProductoParam(sku).toLowerCase();
  const match = entries.find(
    (entry) => entry.data.sku.toLowerCase() === normalizedSku,
  );

  return match?.data.titulo;
}

export function resolveProductoTituloFromParam(
  param: string,
  entries: ProductoEntry[],
): string | undefined {
  if (!param) return undefined;

  const normalized = normalizeProductoParam(param);
  const normalizedLower = normalized.toLowerCase();

  const match = entries.find((entry) => {
    const titulo = entry.data.titulo;
    const slug = getContentSlug(entry.id);
    return (
      titulo === normalized ||
      titulo.toLowerCase() === normalizedLower ||
      entry.data.sku.toLowerCase() === normalizedLower ||
      slug === normalized ||
      slug.toLowerCase() === normalizedLower
    );
  });

  return match?.data.titulo;
}

export function resolveProductoTituloFromQuery(
  searchParams: URLSearchParams,
  entries: ProductoEntry[],
): string | undefined {
  const sku = searchParams.get('sku') ?? '';
  const producto = searchParams.get('producto') ?? '';

  return (
    resolveProductoTituloFromSku(sku, entries) ??
    resolveProductoTituloFromParam(producto, entries)
  );
}
