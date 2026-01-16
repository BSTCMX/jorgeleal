# PixMinder Integration - JorgeLeal

## Resumen de Implementación

Integración completa de PixMinder con JorgeLeal siguiendo Clean Architecture y patrones modulares.

## Archivos Modificados

1. **`src/lib/assets.ts`** - Extendido con nuevas funciones:
   - `getPixMinderConfig()` - Lee configuración de env vars
   - `buildPixMinderUrl()` - Construye URLs de PixMinder
   - `getOptimizedImage()` - Función principal con fallback
   - `getOptimizedLCP()` - Optimización para imágenes LCP
   - `getOptimizedPoster()` - Optimización para posters

2. **`src/components/Hero.astro`** - Actualizado para usar `getOptimizedLCP()`

3. **`src/components/ProjectCard.astro`** - Actualizado para usar `getOptimizedPoster()`

## Configuración

### Variables de Entorno

```bash
# URL del servicio PixMinder (default: https://pixminder.fly.dev)
PUBLIC_PIXMINDER_URL=https://pixminder.fly.dev

# Feature flag (default: true en production, false en dev)
PUBLIC_ENABLE_PIXMINDER=true

# Calidad por defecto (0-100, default: 80)
PUBLIC_PIXMINDER_DEFAULT_QUALITY=80

# Formato por defecto (auto, webp, avif, jpeg, png, default: auto)
PUBLIC_PIXMINDER_DEFAULT_FORMAT=auto
```

## Funcionalidad

- **Hybrid Approach**: Usa PixMinder si está habilitado, fallback automático a imágenes estáticas
- **Backward Compatible**: Todas las funciones antiguas siguen funcionando
- **Graceful Degradation**: Si PixMinder falla, usa imágenes estáticas automáticamente
- **Responsive**: Mantiene `srcset` y `sizes` para imágenes responsivas

## Mejoras Esperadas

- LCP: 3.3s → < 2.5s (reducción ~25%)
- Tamaño de imágenes: -7.3 KiB en poster (reducción ~40%)
- Formatos modernos: AVIF cuando el navegador lo soporte
- Caché automático: PixMinder cachea automáticamente (L1 + L2)

## Backups

Los archivos originales están en `backups/pixminder-integration/`:
- `assets.ts.backup`
- `Hero.astro.backup`
- `ProjectCard.astro.backup`
