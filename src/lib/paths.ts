/**
 * Rutas internas bajo el prefijo público del sitio (`base` de Astro).
 *
 * El prefijo es opt-in: se declara con `SITE_BASE_PATH` al compilar
 * (ver `astro.config.mjs`). Sin esa variable `BASE_URL` es "/" y estas
 * funciones devuelven la ruta sin cambios.
 */
export const basePath: string = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Antepone el prefijo a una ruta interna absoluta ("/equipos", "/cotizar?sku=X"). */
export function withBase(path: string): string {
  if (!basePath) return path;
  // Solo rutas internas absolutas: no tocar "#", "mailto:", "https://", "//host", relativas.
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (path === basePath || /^[/?#]/.test(path.slice(basePath.length)) && path.startsWith(basePath)) {
    return path;
  }
  return `${basePath}${path}`;
}

/** Quita el prefijo de un pathname para compararlo con rutas internas. */
export function stripBase(pathname: string): string {
  if (!basePath) return pathname;
  if (pathname === basePath) return '/';
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length);
  return pathname;
}

/** Indica si un pathname pertenece al árbol del prefijo configurado. */
export function isUnderBase(pathname: string): boolean {
  if (!basePath) return true;
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}
