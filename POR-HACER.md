# Por hacer — Jorge Leal (sitio + CV)

Última actualización: 2026-09-30

## Dominio / CV PDF (sandbox)

Trabajo en: `/Users/Jorge/Documents/cv-jorgelealdev-update/`  
Candidatos: `02-salida/` (aún no están en `public/cv` ni en Fly).

1. **OK visual + promote** — Tras aprobar PDF: backup de `public/cv`, copiar `02-salida` → `public/cv`, re-validate, `fly deploy`.
2. **Pulir parche PDF** — Quitar cajita blanca en CV diseñados; igualar tamaño de tipografía del dominio en Resume.
3. Links clicables a `https://jorgelealdev.com/` ya reañadidos en sandbox; verificar en Preview antes de promover.

## Contenido sitio + CV (repos han cambiado)

Actualizar en **sitio** (`src/content/projects/`) y luego alinear **Resume/CV**:

4. **Kidyland** — Renombrar ficha `Kidyboard` → `Kidyland`; reescribir descripción desde `/Users/Jorge/Documents/kidyland`.
5. **Databoard** — Actualizar ficha desde `/Users/Jorge/Documents/databoard`.
6. **PixMinder** — Actualizar ficha desde `/Users/Jorge/Documents/pixminder`.
7. **Beat Catalogue** — Actualizar ficha desde `/Users/Jorge/Documents/beatcatalogue`.
8. **LaZalza** — Actualizar ficha (localizar repo / fuente vigente).
9. **Resume/CV** — Tras fichas del sitio, sincronizar textos de proyectos en DOCX/PDF.

## Nginx G1 (soft-200 / sitemap.xml)

- **FASE 1 (listo):** smoke en vivo, backup, `pnpm test:nginx` / `validate:nginx`, PR A → ver `scripts/nginx-smoke/README.md`.
- **Merge PR A** a `main` no exige `fly deploy` (solo scripts en repo).
- **FASE 2 (pendiente GO):** fix nginx en `Dockerfile` + `fly deploy` + `pnpm test:nginx` exit 0; rollback desde `scripts/nginx-smoke/00-originales/`.

## Ya hecho (dominio sitio)

- `astro.config.mjs` / `robots.txt` / `README` → `jorgelealdev.com`
- Nginx redirects `www` + `jorgeleal.site` → apex
- Deploy Fly con dominio nuevo en vivo
