import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';

export type ScreenshotResult = {
  url: string;
  screenshotPath: string;
  width: number;
  height: number;
};

export type ImageDiffResult = {
  basePath: string;
  comparePath: string;
  diffPath: string;
  totalPixels: number;
  diffPixels: number;
  diffRatio: number; // 0..1
};

export async function takeScreenshot(url: string, outPath: string, viewport = { width: 1366, height: 768 }): Promise<ScreenshotResult> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: outPath, fullPage: true });
  const size = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
  await browser.close();
  return { url, screenshotPath: outPath, width: size.width, height: size.height };
}

export function compareImages(basePngBuffer: Buffer, comparePngBuffer: Buffer, diffOutPath: string): ImageDiffResult {
  const img1 = PNG.sync.read(basePngBuffer);
  const img2 = PNG.sync.read(comparePngBuffer);
  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);
  const img1Resized = new PNG({ width, height });
  const img2Resized = new PNG({ width, height });
  // naive crop to match dims
  PNG.bitblt(img1, img1Resized, 0, 0, width, height, 0, 0);
  PNG.bitblt(img2, img2Resized, 0, 0, width, height, 0, 0);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(img1Resized.data, img2Resized.data, diff.data, width, height, { threshold: 0.1 });
  const buffer = PNG.sync.write(diff);
  fs.mkdirSync(path.dirname(diffOutPath), { recursive: true });
  fs.writeFileSync(diffOutPath, buffer);
  const total = width * height;
  return { basePath: '', comparePath: '', diffPath: diffOutPath, totalPixels: total, diffPixels, diffRatio: total ? diffPixels / total : 0 };
}

