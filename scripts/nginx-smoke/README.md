# Nginx smoke — G1 (vivo, sin Docker)

Comprueba el comportamiento de nginx en **producción** (`https://jorgelealdev.com`) con `curl`. No hace falta Docker en la máquina local.

## Estado

| Fase | Smoke vivo | `validate:nginx` |
|------|------------|------------------|
| Pre-G1 (FASE 1) | exit 1, G1 FAIL | `validate.json` PASS |
| Post-G1 (FASE 2) | exit 0, all checks | `validate-post-g1.json` PASS |

FASE 1 cerrada ([PR #1](https://github.com/BSTCMX/jorgeleal/pull/1)). FASE 2: nginx apex (`sitemap.xml` 301 + `try_files =404`) + deploy.

Antes del deploy en producción, el smoke **debe fallar** en G1 (soft-200 del SPA):

- `/sitemap.xml` → 200 HTML igual que `/`
- Ruta basura → 200 HTML, no 404

Regresiones (home, `robots.txt`, sitemaps XML reales, `/health`, favicon blanco) deben **pasar**.

## Comandos

```bash
# Smoke completo (exit 1 = G1 aún no cumplido; exit 0 = listo post-fix)
pnpm test:nginx

# Pre-G1: smoke + backup + Dockerfile con /index.html fallback
# Post-G1 (Dockerfile parcheado): smoke exit 0 → validate-post-g1.json
pnpm validate:nginx

# Otra URL (staging, etc.)
BASE=https://jorgelealdev.com pnpm test:nginx
```

Reintentos: Fly auto-stop (`MAX_ATTEMPTS`, `SLEEP_SEC` en el script).

## Git: commit, push, merge (FASE 1)

1. Rama `test/nginx-smoke-pre-g1` — cambios ya commiteados (script, backup, reportes, `package.json`).
2. **Push** (si hay commits nuevos): `git push origin test/nginx-smoke-pre-g1`
3. **Merge PR A** a `main` — solo añade herramientas de test al repo; **no cambia lo desplegado en Fly**.
4. **`fly deploy` no es obligatorio** tras merge de PR A: producción sigue igual hasta que edites el `Dockerfile` (FASE 2).

No commitear: `Sin título/`, `public/cv/~$*.docx`.

## FASE 2 — fix G1 + deploy (solo con GO explícito)

**No hacer en PR A.** Cuando autorices G1:

1. Editar nginx en `Dockerfile` (p. ej. redirect `location = /sitemap.xml` → `/sitemap-index.xml` y `try_files` con `=404` en lugar de caer siempre en `/index.html`).
2. Backup de referencia: `scripts/nginx-smoke/00-originales/Dockerfile` (intocable).
3. `fly deploy -a jorgeleal`
4. `pnpm test:nginx` → **exit 0** (“all checks passed”).
5. Si algo sale mal: restaurar `Dockerfile` desde `00-originales/` y redeploy.

## Carpetas

```
scripts/nginx-smoke/
├── 00-originales/     # Snapshot Dockerfile, fly.toml, live-baseline.json
├── 03-reportes/       # preflight.json, validate.json
├── MANIFEST.sha256    # Hashes de 00-originales (verificar desde esa carpeta)
└── run-validate.sh    # Gate D
```

Verificar MANIFEST:

```bash
cd scripts/nginx-smoke/00-originales && shasum -a 256 -c ../MANIFEST.sha256
```

## Causa raíz G1

En el server apex, `location / { try_files $uri $uri/ /index.html; }` sirve el HTML del home para rutas inexistentes (incl. `/sitemap.xml`). Los sitemaps reales son `sitemap-index.xml` y `sitemap-0.xml` (Astro). `/favicon.ico` sigue 404 real (location `.ico`); fuera del alcance de G1.
