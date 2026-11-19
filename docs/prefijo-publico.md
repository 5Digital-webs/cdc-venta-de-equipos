# Prefijo público opcional (`SITE_BASE_PATH`)

El sitio puede compilarse para servirse bajo un prefijo de ruta
(por ejemplo `/cdcequiposlavanderia`) en un host compartido con otras
aplicaciones. Es **opt-in**: sin variables el sitio se construye y se sirve en
`/` exactamente como antes.

Este documento no fija el dominio oficial, ni aprueba un corte, redirecciones
legadas o cambios de contacto. Los valores de ejemplo usan un host `.invalid`.

## Variables (no sensibles, solo de compilación)

| Variable | Valor | Efecto |
|---|---|---|
| `SITE_BASE_PATH` | vacío (por defecto) o `/segmento[/segmento]` con letras, números, `-` y `_` | Activa `base` de Astro. Enlaces, CTA, CSS/JS, fuentes, imágenes, iconos, sitemap, robots, redirecciones y la URL de la acción de contacto quedan bajo el prefijo. Un valor inválido detiene el build. |
| `SITE_URL` | vacío (por defecto) o un origen sin ruta (`https://host`) | Origen de canonical, Open Graph, sitemap y robots. Vacío: se conserva el valor de `astro.config.mjs`. Con valor, el canonical de las páginas bajo demanda deja de depender del `Host` de la petición. |

Ambas se leen **solo al compilar**. Definirlas al arrancar el servidor no cambia
nada: el prefijo y el origen quedan dentro del artefacto. Cambiarlos exige
recompilar.

## Comandos

```bash
# Por defecto (sin prefijo)
npm run build
HOST=127.0.0.1 PORT=4321 node dist/server/entry.mjs

# Con prefijo (valores de prueba)
SITE_BASE_PATH=/cdcequiposlavanderia SITE_URL=https://ejemplo.invalid npm run build
HOST=127.0.0.1 PORT=4321 node dist/server/entry.mjs
# → http://127.0.0.1:4321/cdcequiposlavanderia/

# Docker: las variables son ARG de la etapa de build
docker build -t sitio .
docker build -t sitio-prefijo \
  --build-arg SITE_BASE_PATH=/cdcequiposlavanderia \
  --build-arg SITE_URL=https://ejemplo.invalid .
```

El build con prefijo escribe `dist/base-path`; el `HEALTHCHECK` del contenedor
(`scripts/healthcheck.mjs`) lo usa para consultar `<prefijo>/`. Sin prefijo
consulta `/` como antes.

## En el código

- `src/lib/paths.ts`: `withBase("/ruta")` para todo enlace interno o archivo de
  `public/`; `stripBase()` para comparar la ruta actual. Los enlaces nuevos
  deben usarlo; un `href="/algo"` literal apunta a la raíz del host.
- Los `ctaHref` del contenido (Keystatic) se siguen escribiendo sin prefijo
  (`/cotizar`); la plantilla lo agrega.
- `src/middleware.ts`: con prefijo, las rutas bajo demanda fuera del árbol del
  prefijo responden 404.

## Superficie con prefijo `P`

| Ruta | Tipo | Nota |
|---|---|---|
| `P/` y páginas de contenido, `P/_astro/*`, `P/images/*`, `P/robots.txt`, `P/sitemap-*.xml` | Estático, GET/HEAD | Público. |
| `P/contacto` | Bajo demanda (SSR), GET | Público. |
| `P/_image` | Bajo demanda, GET | Imágenes optimizadas de las páginas bajo demanda (la foto del pie en contacto). Solo sirve imágenes locales. |
| `P/_actions/sendContactEmail/` | Acción, POST | Formulario de contacto; envía correo si hay SMTP configurado. Valida Turnstile. |
| `P/keystatic/*`, `P/api/keystatic/*`, `P/admin` | Panel de contenidos | No debería publicarse en el host compartido sin una decisión expresa. |

## Límites conocidos: lo que debe garantizar el proxy/ingress

1. **El servidor standalone sirve los archivos estáticos también fuera del
   prefijo.** Con prefijo, `/`, `/equipos`, `/robots.txt`, `/images/*`, `/admin`
   e incluso `/<prefijo>X/` responden 200 desde el origen (comportamiento de
   `@astrojs/node` 9.x en modo `standalone`). Evitarlo en la aplicación exige un
   servidor propio (modo `middleware`); no se hizo. El proxy debe enrutar
   **solo** la ruta exacta `P` y el árbol `P/`, conservando el prefijo hacia la
   aplicación, sin `startsWith` abierto ni catch-all por dominio.
2. **Panel:** bloquear en el proxy `P/keystatic`, `P/api/keystatic` y `P/admin`
   salvo que se decida publicarlos. Keystatic bajo prefijo no está validado.
   Las reglas deben compararse sobre la ruta decodificada y normalizada: la
   aplicación también responde a variantes como `P/%6beystatic` o `P//keystatic`.
3. **Acción de contacto:** el proxy debe dejar pasar `POST` solo a
   `P/_actions/sendContactEmail/`. Astro compara el `Origin` de los POST con la
   URL que ve el servidor; el proxy debe conservar `Host` y protocolo
   (`X-Forwarded-*`) o la acción responderá 403. Sin probar con envíos reales.
4. **Cookies:** el sitio público no usa cookies propias. Si en el mismo host
   hay otras aplicaciones con cookies `Path=/`, el navegador las enviará también
   a este prefijo; la aplicación no las lee.
5. **`robots.txt`:** queda en `P/robots.txt`. Los buscadores solo leen el de la
   raíz del host, que pertenece a otra aplicación.
6. **Rutas antiguas del sitio anterior:** no se agregan redirecciones legadas.
   Las cuatro redirecciones existentes se conservan bajo el prefijo.
