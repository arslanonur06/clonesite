import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { extractDomFeatures, cosineSimilarity } from './html.js';
import { normalizeText, simHash, hammingDistance } from './text.js';

export type MonitorTarget = {
  url: string;
};

export type MonitorResult = {
  url: string;
  timestamp: string;
  visual: { diffRatio: number };
  dom: { tagCosine: number; classCosine: number };
  text: { hamming: number };
  artifacts: { baseShot: string; variantShot: string; diff: string };
};

export async function runVisualAndContentComparison(baseUrl: string, variantUrl: string, outDir: string): Promise<MonitorResult> {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  // Base
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 15000 });
  const baseHtml = await page.content();
  const baseShot = path.join(outDir, 'base.png');
  await page.screenshot({ path: baseShot, fullPage: true });

  // Variant
  await page.goto(variantUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
  const variantHtml = await page.content();
  const variantShot = path.join(outDir, 'variant.png');
  await page.screenshot({ path: variantShot, fullPage: true });

  await browser.close();

  // Image diff
  const [bBuf, vBuf] = await Promise.all([fs.readFile(baseShot), fs.readFile(variantShot)]);
  const b = PNG.sync.read(bBuf);
  const v = PNG.sync.read(vBuf);
  const w = Math.min(b.width, v.width);
  const h = Math.min(b.height, v.height);
  const bC = new PNG({ width: w, height: h });
  const vC = new PNG({ width: w, height: h });
  PNG.bitblt(b, bC, 0, 0, w, h, 0, 0);
  PNG.bitblt(v, vC, 0, 0, w, h, 0, 0);
  const diffPng = new PNG({ width: w, height: h });
  const diffPx = pixelmatch(bC.data, vC.data, diffPng.data, w, h, { threshold: 0.1 });
  const diffPath = path.join(outDir, 'diff.png');
  await fs.writeFile(diffPath, PNG.sync.write(diffPng));
  const diffRatio = (w * h) ? diffPx / (w * h) : 0;

  // DOM features
  const baseDom = extractDomFeatures(baseHtml);
  const varDom = extractDomFeatures(variantHtml);
  const tagCos = cosineSimilarity(baseDom.tagHistogram, varDom.tagHistogram);
  const classCos = cosineSimilarity(baseDom.classHistogram, varDom.classHistogram);

  // Text simhash
  const baseText = normalizeText(baseHtml.replace(/<[^>]*>/g, ' '));
  const varText = normalizeText(variantHtml.replace(/<[^>]*>/g, ' '));
  const baseHash = simHash(baseText);
  const varHash = simHash(varText);
  const ham = hammingDistance(baseHash, varHash);

  return {
    url: variantUrl,
    timestamp: new Date().toISOString(),
    visual: { diffRatio },
    dom: { tagCosine: tagCos, classCosine: classCos },
    text: { hamming: ham },
    artifacts: { baseShot, variantShot, diff: diffPath },
  };
}

