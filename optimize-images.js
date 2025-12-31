import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const imagesDir = './public/images';

async function optimizeImages() {
  const files = readdirSync(imagesDir);
  
  for (const file of files) {
    const filePath = join(imagesDir, file);
    
    if (statSync(filePath).isDirectory()) continue;
    if (!file.match(/\.(png|jpg|jpeg)$/i)) continue;
    
    const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    console.log(`Optimizing ${file}...`);
    
    await sharp(filePath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    console.log(`✓ Created ${outputPath}`);
  }
}

optimizeImages().catch(console.error);
