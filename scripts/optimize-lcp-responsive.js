import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const sourceImage = './public/images/fotocvdev-min.png';
const outputDir = './public/images';

/**
 * Generate responsive versions of LCP image
 * Creates 256x256 (mobile) and 512x512 (desktop) versions
 */
async function optimizeLCPResponsive() {
  if (!existsSync(sourceImage)) {
    console.log('⚠️  Source LCP image not found, skipping...');
    return;
  }

  console.log('\n🖼️  Optimizing LCP image with responsive versions...\n');

  try {
    // Generate 256x256 version (mobile)
    const mobilePath = join(outputDir, 'fotocvdev-lcp-256.webp');
    await sharp(sourceImage)
      .resize(256, 256, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 75,
        effort: 6,
        smartSubsample: true
      })
      .toFile(mobilePath);
    
    const mobileStats = await sharp(mobilePath).metadata();
    const mobileSize = statSync(mobilePath).size;
    console.log(`  ✓ fotocvdev-lcp-256.webp: ${mobileStats.width}x${mobileStats.height} (${(mobileSize / 1024).toFixed(1)} KiB)`);

    // Generate 512x512 version (desktop)
    const desktopPath = join(outputDir, 'fotocvdev-lcp-512.webp');
    await sharp(sourceImage)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 75,
        effort: 6,
        smartSubsample: true
      })
      .toFile(desktopPath);
    
    const desktopStats = await sharp(desktopPath).metadata();
    const desktopSize = statSync(desktopPath).size;
    console.log(`  ✓ fotocvdev-lcp-512.webp: ${desktopStats.width}x${desktopStats.height} (${(desktopSize / 1024).toFixed(1)} KiB)`);

    // Keep original optimized version for fallback
    const originalPath = join(outputDir, 'fotocvdev-lcp.webp');
    if (!existsSync(originalPath)) {
      await sharp(sourceImage)
        .resize(256, 256)
        .webp({
          quality: 75,
          effort: 6,
          smartSubsample: true
        })
        .toFile(originalPath);
      console.log(`  ✓ fotocvdev-lcp.webp: (fallback version)`);
    }

    console.log('\n✅ LCP responsive optimization complete!\n');
  } catch (error) {
    console.error('❌ Error optimizing LCP image:', error);
    process.exit(1);
  }
}

optimizeLCPResponsive().catch(console.error);

