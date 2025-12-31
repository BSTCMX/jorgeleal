import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

async function convertToWebP(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    
    if (statSync(filePath).isDirectory()) {
      await convertToWebP(filePath);
      continue;
    }
    
    if (!file.match(/\.(png|jpg|jpeg)$/i)) continue;
    
    const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    console.log(`Converting ${file}...`);
    
    await sharp(filePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    console.log(`✓ Created ${outputPath}`);
  }
}

console.log('Converting images to WebP...');
await convertToWebP('./public/images');
console.log('✨ Done!');
