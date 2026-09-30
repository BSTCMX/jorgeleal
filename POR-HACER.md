# Por hacer — Jorge Leal (sitio + CV)

Última actualización: 2026-09-30

## Dominio / CV PDF

- **Promovido 2026-09-30:** `02-salida/` → `public/cv/` + deploy. Backup previo: `cv-jorgelealdev-update/00-originales/public-cv-before-promote-20260930/`.
- Links clicables `https://jorgelealdev.com/` en CV diseñados (Resume sin dominio viejo en strings).
- **Opcional después:** limpiar metadata/struct `@jorgeleal.site` en PDFs diseñados; cajita blanca / tipografía Resume (sandbox).

## Contenido sitio + CV (repos han cambiado)

Actualizar en **sitio** (`src/content/projects/`) y luego alinear **Resume/CV**:

4. **Kidyland** — Renombrar ficha `Kidyboard` → `Kidyland`; reescribir descripción desde `/Users/Jorge/Documents/kidyland`.
5. **Databoard** — Actualizar ficha desde `/Users/Jorge/Documents/databoard`.
6. **PixMinder** — Actualizar ficha desde `/Users/Jorge/Documents/pixminder`.
7. **Beat Catalogue** — Actualizar ficha desde `/Users/Jorge/Documents/beatcatalogue`.
8. **LaZalza** — Actualizar ficha (localizar repo / fuente vigente).
9. **Resume/CV** — Tras fichas del sitio, sincronizar textos de proyectos en DOCX/PDF.

## Nginx G1 (soft-200 / sitemap.xml)

- **FASE 1 + FASE 2 (hecho):** [PR #2](https://github.com/BSTCMX/jorgeleal/pull/2), deploy Fly, `pnpm test:nginx` exit 0, `validate-post-g1.json` PASS. Rollback de referencia: `scripts/nginx-smoke/00-originales/Dockerfile`.

## Ya hecho (dominio sitio)

- `astro.config.mjs` / `robots.txt` / `README` → `jorgelealdev.com`
- Nginx redirects `www` + `jorgeleal.site` → apex
- Deploy Fly con dominio nuevo en vivo
