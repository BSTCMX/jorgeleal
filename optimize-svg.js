import { readFileSync, writeFileSync } from 'fs';

// Optimizar SVG manualmente (sin dependencias externas)
const svgContent = readFileSync('public/mapachermoso.svg', 'utf8');

// Reducir viewBox y tamaño
const optimizedSvg = svgContent
  .replace('width="1024.000000pt" height="1024.000000pt"', 'width="48" height="48"')
  .replace('viewBox="0 0 1024.000000 1024.000000"', 'viewBox="0 0 48 48"');

writeFileSync('public/mapachermoso-optimized.svg', optimizedSvg);
console.log('✅ SVG optimizado: public/mapachermoso-optimized.svg');
