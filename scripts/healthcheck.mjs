// Healthcheck del contenedor. Consulta la portada en la ruta con la que se
// compiló el sitio: "/" por defecto, o el prefijo si el build usó SITE_BASE_PATH
// (el build deja ese valor en dist/base-path; ver astro.config.mjs).
import { readFileSync } from 'node:fs';
import http from 'node:http';

let base = '';
try {
  base = readFileSync(new URL('../dist/base-path', import.meta.url), 'utf8').trim();
} catch {
  // Sin archivo: build sin prefijo.
}

const port = process.env.PORT || 4321;
http
  .get(`http://localhost:${port}${base}/`, (res) => {
    process.exit(res.statusCode === 200 ? 0 : 1);
  })
  .on('error', () => process.exit(1));
