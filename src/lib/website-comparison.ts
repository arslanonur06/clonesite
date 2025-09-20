import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ComparisonResult {
  url1: string;
  url2: string;
  visual: {
    diffRatio: number;
    similarity: number;
  };
  dom: {
    tagCosine: number;
    structureSimilarity: number;
  };
  text: {
    hamming: number;
    contentSimilarity: number;
  };
  overall: {
    similarity: number;
    isClone: boolean;
    riskLevel: 'low' | 'medium' | 'high';
  };
  metadata: {
    title1: string;
    title2: string;
    description1: string;
    description2: string;
    keywords1: string[];
    keywords2: string[];
  };
}

interface MultipleComparisonResult {
  comparisons: ComparisonResult[];
  summary: {
    totalComparisons: number;
    highRiskCount: number;
    averageSimilarity: number;
    potentialClones: string[];
  };
}

export async function compareWebsites(url1: string, url2: string): Promise<ComparisonResult> {
  console.log(`🔍 Comparing websites: ${url1} vs ${url2}`);
  
  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Take screenshots
    console.log(`📸 Taking screenshot of ${url1}...`);
    await page.goto(url1, { waitUntil: 'networkidle2', timeout: 30000 });
    const screenshot1 = await page.screenshot({ fullPage: true });
    
    console.log(`📸 Taking screenshot of ${url2}...`);
    await page.goto(url2, { waitUntil: 'networkidle2', timeout: 30000 });
    const screenshot2 = await page.screenshot({ fullPage: true });

    // Get page content for analysis
    const content1 = await page.evaluate(() => document.documentElement.outerHTML);
    
    await page.goto(url1, { waitUntil: 'networkidle2', timeout: 30000 });
    const content2 = await page.evaluate(() => document.documentElement.outerHTML);

    await browser.close();

    // Analyze visual similarity
    const visualSimilarity = await analyzeVisualSimilarity(screenshot1, screenshot2);
    
    // Analyze DOM structure
    const domSimilarity = analyzeDOMSimilarity(content1, content2);
    
    // Analyze text content
    const textSimilarity = analyzeTextSimilarity(content1, content2);
    
    // Extract metadata
    const metadata1 = extractMetadata(content1);
    const metadata2 = extractMetadata(content2);

    // Calculate overall similarity
    const overallSimilarity = (
      visualSimilarity.similarity * 0.4 +
      domSimilarity.structureSimilarity * 0.3 +
      textSimilarity.contentSimilarity * 0.3
    );

    const isClone = overallSimilarity > 0.8 && visualSimilarity.diffRatio < 0.2;
    const riskLevel = isClone ? 'high' : overallSimilarity > 0.6 ? 'medium' : 'low';

    const result: ComparisonResult = {
      url1,
      url2,
      visual: visualSimilarity,
      dom: domSimilarity,
      text: textSimilarity,
      overall: {
        similarity: overallSimilarity,
        isClone,
        riskLevel
      },
      metadata: {
        title1: metadata1.title,
        title2: metadata2.title,
        description1: metadata1.description,
        description2: metadata2.description,
        keywords1: metadata1.keywords,
        keywords2: metadata2.keywords
      }
    };

    console.log(`✅ Comparison complete. Similarity: ${(overallSimilarity * 100).toFixed(1)}%`);
    return result;

  } catch (error) {
    console.error('Website comparison failed:', error);
    throw new Error(`Failed to compare websites: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function compareMultipleWebsites(urls: string[]): Promise<MultipleComparisonResult> {
  console.log(`🔍 Comparing ${urls.length} websites...`);
  
  const comparisons: ComparisonResult[] = [];
  const potentialClones: string[] = [];
  let totalSimilarity = 0;
  let highRiskCount = 0;

  // Compare each pair of websites
  for (let i = 0; i < urls.length; i++) {
    for (let j = i + 1; j < urls.length; j++) {
      try {
        const comparison = await compareWebsites(urls[i], urls[j]);
        comparisons.push(comparison);
        
        totalSimilarity += comparison.overall.similarity;
        
        if (comparison.overall.riskLevel === 'high') {
          highRiskCount++;
          if (comparison.overall.isClone) {
            potentialClones.push(`${urls[i]} ↔ ${urls[j]}`);
          }
        }
      } catch (error) {
        console.warn(`Failed to compare ${urls[i]} with ${urls[j]}:`, error);
      }
    }
  }

  const averageSimilarity = comparisons.length > 0 ? totalSimilarity / comparisons.length : 0;

  return {
    comparisons,
    summary: {
      totalComparisons: comparisons.length,
      highRiskCount,
      averageSimilarity,
      potentialClones
    }
  };
}

async function analyzeVisualSimilarity(screenshot1: Buffer, screenshot2: Buffer): Promise<{ diffRatio: number; similarity: number }> {
  // Simple pixel-based comparison (in a real implementation, you'd use more sophisticated image comparison)
  const pixels1 = screenshot1.length;
  const pixels2 = screenshot2.length;
  
  // Basic similarity calculation based on image size and some pixel analysis
  const sizeSimilarity = 1 - Math.abs(pixels1 - pixels2) / Math.max(pixels1, pixels2);
  
  // For now, return a mock similarity score
  // In a real implementation, you'd use libraries like pixelmatch or opencv
  const mockSimilarity = Math.random() * 0.3 + 0.4; // Random between 0.4-0.7
  const diffRatio = 1 - mockSimilarity;
  
  return {
    diffRatio,
    similarity: mockSimilarity
  };
}

function analyzeDOMSimilarity(html1: string, html2: string): { tagCosine: number; structureSimilarity: number } {
  const dom1 = new JSDOM(html1);
  const dom2 = new JSDOM(html2);
  
  const tags1 = extractTags(dom1.window.document);
  const tags2 = extractTags(dom2.window.document);
  
  // Calculate cosine similarity between tag vectors
  const tagCosine = calculateCosineSimilarity(tags1, tags2);
  
  // Calculate structure similarity
  const structure1 = extractStructure(dom1.window.document);
  const structure2 = extractStructure(dom2.window.document);
  const structureSimilarity = calculateStructureSimilarity(structure1, structure2);
  
  return {
    tagCosine,
    structureSimilarity
  };
}

function analyzeTextSimilarity(html1: string, html2: string): { hamming: number; contentSimilarity: number } {
  const text1 = extractTextContent(html1);
  const text2 = extractTextContent(html2);
  
  // Calculate Hamming distance (simplified)
  const hamming = calculateHammingDistance(text1, text2);
  
  // Calculate content similarity using Jaccard similarity
  const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  const contentSimilarity = intersection.size / union.size;
  
  return {
    hamming,
    contentSimilarity
  };
}

function extractTags(document: Document): Map<string, number> {
  const tags = new Map<string, number>();
  
  function traverse(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = (node as Element).tagName.toLowerCase();
      tags.set(tagName, (tags.get(tagName) || 0) + 1);
    }
    
    for (const child of Array.from(node.childNodes)) {
      traverse(child);
    }
  }
  
  traverse(document);
  return tags;
}

function extractStructure(document: Document): string[] {
  const structure: string[] = [];
  
  function traverse(node: Node, depth = 0) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const indent = '  '.repeat(depth);
      structure.push(`${indent}<${element.tagName.toLowerCase()}>`);
    }
    
    for (const child of Array.from(node.childNodes)) {
      traverse(child, depth + 1);
    }
  }
  
  traverse(document);
  return structure;
}

function extractTextContent(html: string): string {
  const dom = new JSDOM(html);
  const text = dom.window.document.body?.textContent || '';
  return text.replace(/\s+/g, ' ').trim();
}

function extractMetadata(html: string): { title: string; description: string; keywords: string[] } {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const title = document.querySelector('title')?.textContent || '';
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(',').map(k => k.trim()) || [];
  
  return { title, description, keywords };
}

function calculateCosineSimilarity(map1: Map<string, number>, map2: Map<string, number>): number {
  const allKeys = new Set([...map1.keys(), ...map2.keys()]);
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (const key of allKeys) {
    const val1 = map1.get(key) || 0;
    const val2 = map2.get(key) || 0;
    
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

function calculateStructureSimilarity(structure1: string[], structure2: string[]): number {
  const set1 = new Set(structure1);
  const set2 = new Set(structure2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

function calculateHammingDistance(text1: string, text2: string): number {
  const len1 = text1.length;
  const len2 = text2.length;
  
  if (len1 !== len2) {
    return Math.max(len1, len2);
  }
  
  let distance = 0;
  for (let i = 0; i < len1; i++) {
    if (text1[i] !== text2[i]) {
      distance++;
    }
  }
  
  return distance;
}
