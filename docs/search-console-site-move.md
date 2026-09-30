# Google Search Console — migración jorgeleal.site → jorgelealdev.com

Pasos manuales (Gate 0 del plan SEO). Sin esto, el código solo prepara el sitio; Google sigue mostrando el dominio viejo.

## 1. Propiedades

1. Abre [Google Search Console](https://search.google.com/search-console).
2. Añade propiedad **Dominio** `jorgelealdev.com` (DNS TXT) si aún no está.
3. Verifica también `jorgeleal.site` (misma cuenta) si tienes acceso.

## 2. Sitemap (dominio nuevo)

En la propiedad **jorgelealdev.com**:

- Sitemaps → enviar: `https://jorgelealdev.com/sitemap-index.xml`

## 3. Change of Address (dominio viejo)

En la propiedad **jorgeleal.site**:

- Configuración → **Cambio de dirección** (Change of address).
- Destino: `https://jorgelealdev.com/`
- Requisitos: 301 en vivo (nginx ya redirige), sitemap en el sitio nuevo, propiedades verificadas.

Google mantiene la señal ~180 días; deja los 301 activos **al menos 1 año**.

## 4. Indexación inicial

En **jorgelealdev.com**:

- Inspección de URLs → `https://jorgelealdev.com/` → Solicitar indexación.
- Repite para 1–2 URLs de proyecto, p. ej. `/proyectos/databoard/`.

## 5. Perfiles externos

Actualiza el campo **Sitio web** a `https://jorgelealdev.com/` en:

- [LinkedIn](https://www.linkedin.com/in/jorgelealcornejo)
- [GitHub BSTCMX](https://github.com/BSTCMX) (bio / perfil)

## 6. Comprobar (2–6 semanas)

- `site:jorgelealdev.com` muestra páginas.
- Búsqueda `Jorge Leal portafolio` o `Jorge Leal software`: resultado canónico en **jorgelealdev.com**.

Bing: ya tienes `msvalidate.01` en el layout; opcional repetir sitemap en Bing Webmaster.
