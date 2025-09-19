import Jimp from 'jimp';
import { PNG } from 'pngjs';
import fs from 'node:fs/promises';

export type VisualFeatures = {
  dominantColors: string[];
  logoRegions: { x: number; y: number; width: number; height: number }[];
  textRegions: { x: number; y: number; width: number; height: number; text?: string }[];
  layoutGrid: number[][];
  colorHistogram: Record<string, number>;
};

export type LogoSimilarity = {
  similarity: number;
  matchedRegions: number;
  colorMatch: number;
  shapeMatch: number;
};

// Extract dominant colors from image
export async function extractDominantColors(imagePath: string, count = 5): Promise<string[]> {
  try {
    const image = await Jimp.read(imagePath);
    const colorCounts: Record<string, number> = {};
    
    // Sample every 10th pixel for performance
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      if (x % 10 === 0 && y % 10 === 0) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        const alpha = this.bitmap.data[idx + 3];
        
        if (alpha > 128) { // Skip transparent pixels
          const color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      }
    });
    
    return Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([color]) => color);
  } catch (error) {
    console.error('Color extraction failed:', error);
    return [];
  }
}

// Detect logo regions using edge detection
export async function detectLogoRegions(imagePath: string): Promise<{ x: number; y: number; width: number; height: number }[]> {
  try {
    const image = await Jimp.read(imagePath);
    
    // Convert to grayscale and apply edge detection
    image.greyscale().convolute([
      [-1, -1, -1],
      [-1,  8, -1],
      [-1, -1, -1]
    ]);
    
    // Simple region detection (in real implementation, would use more sophisticated algorithms)
    const regions: { x: number; y: number; width: number; height: number }[] = [];
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Check common logo positions
    const logoAreas = [
      { x: 0, y: 0, width: Math.floor(width * 0.3), height: Math.floor(height * 0.2) }, // Top-left
      { x: Math.floor(width * 0.35), y: 0, width: Math.floor(width * 0.3), height: Math.floor(height * 0.2) }, // Top-center
      { x: Math.floor(width * 0.7), y: 0, width: Math.floor(width * 0.3), height: Math.floor(height * 0.2) }, // Top-right
    ];
    
    for (const area of logoAreas) {
      let edgePixels = 0;
      let totalPixels = 0;
      
      for (let y = area.y; y < area.y + area.height && y < height; y++) {
        for (let x = area.x; x < area.x + area.width && x < width; x++) {
          const idx = (width * y + x) << 2;
          const gray = image.bitmap.data[idx];
          if (gray > 128) edgePixels++;
          totalPixels++;
        }
      }
      
      const edgeRatio = edgePixels / totalPixels;
      if (edgeRatio > 0.1) { // Threshold for logo detection
        regions.push(area);
      }
    }
    
    return regions;
  } catch (error) {
    console.error('Logo detection failed:', error);
    return [];
  }
}

// Compare two images for logo similarity
export async function compareLogos(originalPath: string, suspiciousPath: string): Promise<LogoSimilarity> {
  try {
    const [originalColors, suspiciousColors] = await Promise.all([
      extractDominantColors(originalPath),
      extractDominantColors(suspiciousPath)
    ]);
    
    const [originalRegions, suspiciousRegions] = await Promise.all([
      detectLogoRegions(originalPath),
      detectLogoRegions(suspiciousPath)
    ]);
    
    // Color similarity
    const commonColors = originalColors.filter(color => 
      suspiciousColors.some(sColor => colorDistance(color, sColor) < 50)
    );
    const colorMatch = commonColors.length / Math.max(originalColors.length, 1);
    
    // Shape similarity (region overlap)
    const matchedRegions = Math.min(originalRegions.length, suspiciousRegions.length);
    const shapeMatch = matchedRegions / Math.max(originalRegions.length, 1);
    
    // Overall similarity
    const similarity = (colorMatch * 0.6) + (shapeMatch * 0.4);
    
    return {
      similarity,
      matchedRegions,
      colorMatch,
      shapeMatch
    };
  } catch (error) {
    console.error('Logo comparison failed:', error);
    return { similarity: 0, matchedRegions: 0, colorMatch: 0, shapeMatch: 0 };
  }
}

// Calculate color distance in RGB space
function colorDistance(color1: string, color2: string): number {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
}

// Analyze favicon similarity
export async function analyzeFavicon(originalUrl: string, suspiciousUrl: string): Promise<number> {
  try {
    const faviconUrls = [
      `${originalUrl}/favicon.ico`,
      `${suspiciousUrl}/favicon.ico`
    ];
    
    // Download and compare favicons
    const [original, suspicious] = await Promise.all([
      Jimp.read(faviconUrls[0]),
      Jimp.read(faviconUrls[1])
    ]);
    
    // Resize to standard size
    original.resize(32, 32);
    suspicious.resize(32, 32);
    
    // Calculate pixel difference
    const diff = Jimp.diff(original, suspicious);
    return 1 - diff.percent; // Return similarity
  } catch (error) {
    return 0; // No similarity if comparison fails
  }
}
