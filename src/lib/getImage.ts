import type { ImageMetadata } from 'astro';

// Pre-load all images once
const imageCache = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpeg,jpg,png,gif,webp}');

/**
 * Get an image from the assets directory
 * Expects paths in format: @assets/images/...
 */
export async function getImage(imagePath: string | undefined): Promise<ImageMetadata | null> {
  if (!imagePath) return null;
  
  // Convert @assets/... to /src/assets/...
  const filePath = imagePath.replace('@assets/', '/src/assets/');
  
  // Look up in cache
  const imageLoader = imageCache[filePath];
  if (!imageLoader) return null;
  
  return (await imageLoader()).default;
}

