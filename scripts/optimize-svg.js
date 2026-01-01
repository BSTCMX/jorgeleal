import { optimize } from 'svgo';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const svgPath = './public/mapachermoso.svg';

/**
 * Optimize SVG logo using svgo
 * Reduces file size by 50-70% while maintaining visual quality
 */
async function optimizeSVG() {
  if (!existsSync(svgPath)) {
    console.log('⚠️  SVG logo not found, skipping...');
    return;
  }

  console.log('\n🎨 Optimizing SVG logo...\n');

  try {
    // Read original SVG
    const originalSVG = readFileSync(svgPath, 'utf8');
    const originalSize = statSync(svgPath).size;
    
    console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KiB`);

    // Configure svgo with aggressive optimization
    const result = optimize(originalSVG, {
      multipass: true, // Multiple optimization passes for better results
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // Remove DOCTYPE and XML declaration
              removeDoctype: true,
              removeXMLProcInst: true,
              // Remove comments
              removeComments: true,
              // Remove metadata
              removeMetadata: true,
              // Remove empty attributes
              removeEmptyAttrs: true,
              // Remove hidden elements
              removeHiddenElems: true,
              // Remove empty containers
              removeEmptyContainers: true,
              // Preserve xmlns for Safari iOS compatibility
              // DO NOT remove xmlns - Safari iOS requires it for SVG rendering
              removeUnusedNS: false,
              // Remove editor namespaces
              removeEditorsNSData: true,
              // Remove empty text
              removeEmptyText: true,
              // Minify styles
              minifyStyles: true,
              // Convert path data with reduced precision
              convertPathData: {
                floatPrecision: 2, // Reduce precision (2 decimals is usually enough)
                transformPrecision: 2,
              },
              // Convert shapes to paths
              convertShapeToPath: true,
              // Merge paths
              mergePaths: {
                force: false,
                noSpaceAfterFlags: false,
              },
              // Remove unused IDs
              removeUselessDefs: true,
              // Clean up numeric values
              cleanupNumericValues: {
                floatPrecision: 2,
              },
            },
          },
        },
      ],
    });

    if (result.error) {
      console.error(`  ❌ Error optimizing SVG:`, result.error);
      process.exit(1);
    }

    // Post-process: Ensure xmlns is present for Safari iOS compatibility
    let optimizedSVG = result.data;
    
    // Check if xmlns is missing and add it if needed
    if (!optimizedSVG.includes('xmlns=') && !optimizedSVG.includes('xmlns:')) {
      // Add xmlns to the root <svg> element
      optimizedSVG = optimizedSVG.replace(
        /<svg([^>]*)>/,
        '<svg$1 xmlns="http://www.w3.org/2000/svg">'
      );
      console.log('  ⚠️  Added missing xmlns attribute for Safari iOS compatibility');
    } else if (!optimizedSVG.includes('xmlns="http://www.w3.org/2000/svg"')) {
      // Ensure the standard SVG xmlns is present
      optimizedSVG = optimizedSVG.replace(
        /<svg([^>]*?)(\sxmlns="[^"]*")?([^>]*)>/,
        (match, before, existingXmlns, after) => {
          if (existingXmlns) {
            // Replace existing xmlns with standard one
            return `<svg${before} xmlns="http://www.w3.org/2000/svg"${after}>`;
          }
          // Add xmlns if missing
          return `<svg${before} xmlns="http://www.w3.org/2000/svg"${after}>`;
        }
      );
      console.log('  ⚠️  Ensured standard xmlns attribute for Safari iOS compatibility');
    }

    // Write optimized SVG
    writeFileSync(svgPath, optimizedSVG);
    
    const optimizedSize = statSync(svgPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`  ✓ Optimized size: ${(optimizedSize / 1024).toFixed(2)} KiB`);
    console.log(`  ✓ Reduction: ${reduction}% (${((originalSize - optimizedSize) / 1024).toFixed(2)} KiB saved)`);
    console.log('\n✅ SVG optimization complete!\n');
  } catch (error) {
    console.error('❌ Error optimizing SVG:', error);
    process.exit(1);
  }
}

optimizeSVG().catch(console.error);

