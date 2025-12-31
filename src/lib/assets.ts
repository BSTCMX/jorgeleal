/**
 * Asset versioning utility for cache busting
 * Generates URLs with version query parameters to ensure fresh content
 */

import { readFileSync, statSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

/**
 * Get file hash for versioning (based on file content)
 * Uses first 8 characters of MD5 hash for brevity
 */
function getFileHash(filePath: string): string | null {
  try {
    const fullPath = join(process.cwd(), 'public', filePath);
    const fileContent = readFileSync(fullPath);
    const hash = crypto.createHash('md5').update(fileContent).digest('hex');
    return hash.substring(0, 8);
  } catch (error) {
    // If file doesn't exist or can't be read, return null
    return null;
  }
}

/**
 * Get file modification time as version (fallback)
 */
function getFileTimestamp(filePath: string): string | null {
  try {
    const fullPath = join(process.cwd(), 'public', filePath);
    const stats = statSync(fullPath);
    return stats.mtime.getTime().toString(36);
  } catch (error) {
    return null;
  }
}

/**
 * Generate versioned asset URL with cache busting
 * 
 * @param assetPath - Path to asset relative to public folder (e.g., "/videos/data1.webm")
 * @param useHash - Whether to use content hash (true) or timestamp (false). Default: true
 * @returns URL with version query parameter
 * 
 * @example
 * getVersionedAsset("/videos/data1.webm") // "/videos/data1.webm?v=a1b2c3d4"
 * getVersionedAsset("/images/logo.png", false) // "/images/logo.png?v=abc123"
 */
export function getVersionedAsset(assetPath: string, useHash: boolean = true): string {
  // Remove leading slash if present for file system operations
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  
  // Get version based on strategy
  const version = useHash 
    ? getFileHash(cleanPath) 
    : getFileTimestamp(cleanPath);
  
  // If versioning fails, return original path (graceful degradation)
  if (!version) {
    return assetPath;
  }
  
  // Append version as query parameter
  const separator = assetPath.includes('?') ? '&' : '?';
  return `${assetPath}${separator}v=${version}`;
}

/**
 * Generate versioned asset URL for video files
 * Specifically optimized for video assets with cache busting
 * 
 * @param videoPath - Path to video relative to public folder
 * @returns URL with version query parameter
 */
export function getVersionedVideo(videoPath: string): string {
  return getVersionedAsset(videoPath, true);
}

/**
 * Generate versioned asset URL for image files
 * 
 * @param imagePath - Path to image relative to public folder
 * @returns URL with version query parameter
 */
export function getVersionedImage(imagePath: string): string {
  return getVersionedAsset(imagePath, true);
}

