# Jorge Leal - Portfolio

Portfolio personal construido con [Astro](https://astro.build), Tailwind CSS y TypeScript. Bilingüe (ES/EN), optimizado para performance (98/100 Lighthouse), con sistema de proyectos dinámicos y deploy automatizado en Fly.io.

🌐 **Live:** [jorgelealdev.com](https://jorgelealdev.com)

## 🚀 Características

- ⚡ **Performance optimizado**: 98/100 en Lighthouse
- 🌍 **Bilingüe**: Español e Inglés con sistema i18n
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos
- 🎨 **UI Moderna**: Gradientes, animaciones y dark mode
- 📊 **Proyectos dinámicos**: Sistema de contenido con Astro Collections
- 🚀 **Deploy automatizado**: Docker + Fly.io con Nginx
- ♿ **Accesible**: 100/100 en accesibilidad
- 🔍 **SEO optimizado**: 98/100 en SEO

## 🛠️ Stack Tecnológico

- **Framework**: [Astro](https://astro.build) 5.14.4
- **Styling**: Tailwind CSS 4.1.14
- **Language**: TypeScript
- **Deployment**: Docker + Fly.io
- **Web Server**: Nginx Alpine

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## 🏗️ Estructura del Proyecto

```
/
├── public/          # Assets estáticos (imágenes, videos, CVs)
├── src/
│   ├── components/  # Componentes Astro
│   ├── content/     # Contenido dinámico (proyectos)
│   ├── i18n/        # Traducciones ES/EN
│   ├── layouts/     # Layouts base
│   ├── lib/         # Utilidades
│   ├── pages/       # Páginas
│   └── styles/      # Estilos globales
├── Dockerfile       # Configuración Docker
├── fly.toml        # Configuración Fly.io
└── astro.config.mjs # Configuración Astro
```

## 🚢 Deploy

El proyecto está configurado para deploy automático en Fly.io:

```bash
fly deploy
```

El Dockerfile realiza un build multi-stage:
1. Build de Astro con Node.js
2. Servir estáticos con Nginx

### Nginx smoke (G1)

Tras cambios en nginx del `Dockerfile`, validar producción sin Docker:

```bash
pnpm test:nginx
```

Flujo pre-G1 / post-G1, backups y rollback: [`scripts/nginx-smoke/README.md`](scripts/nginx-smoke/README.md).

Indexación Google (Change of Address, sitemap): [`docs/search-console-site-move.md`](docs/search-console-site-move.md).

## 📊 Métricas de Performance

- **Performance**: 98/100
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 98/100

### Métricas Core Web Vitals

- **FCP**: 0.9s
- **LCP**: 1.7s
- **TBT**: 0ms
- **CLS**: 0
- **Speed Index**: 4.0s

## 📝 Licencia

Este proyecto es privado y personal.

## 👤 Autor

**Jorge Leal**
- GitHub: [@BSTCMX](https://github.com/BSTCMX)
- Portfolio: [jorgelealdev.com](https://jorgelealdev.com)

---

Built with ❤️ using Astro
