import sharp from 'sharp';

async function optimizeLCPImage() {
  try {
    // Crear versión ultra-optimizada para LCP
    await sharp('public/images/fotocvdev-min.png')
      .resize(256, 256)
      .webp({ 
        quality: 75,
        effort: 6,
        smartSubsample: true
      })
      .toFile('public/images/fotocvdev-lcp.webp');
    
    console.log('✅ LCP image optimized: public/images/fotocvdev-lcp.webp');
    
    // Ver tamaño resultante
    const stats = await sharp('public/images/fotocvdev-lcp.webp').metadata();
    console.log(`📊 Dimensions: ${stats.width}x${stats.height}`);
  } catch (error) {
    console.error('❌ Error optimizing LCP image:', error);
  }
}

optimizeLCPImage();
