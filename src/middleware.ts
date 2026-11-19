import { defineMiddleware } from 'astro:middleware';
import { basePath, isUnderBase } from '@/lib/paths';

/**
 * Con prefijo configurado (SITE_BASE_PATH), las rutas servidas bajo demanda
 * (contacto, acciones, panel) solo responden dentro de ese árbol. El adaptador
 * standalone las resolvería también sin prefijo; aquí se devuelve 404 para no
 * reclamar rutas de la raíz del host ni de otras divisiones.
 * Sin prefijo no hace nada. No reemplaza el límite del ingress.
 */
export const onRequest = defineMiddleware((context, next) => {
  if (basePath && !context.isPrerendered && !isUnderBase(context.url.pathname)) {
    return new Response('Not found', { status: 404 });
  }
  return next();
});
