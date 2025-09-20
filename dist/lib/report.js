import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
function renderHtml(title, baseUrl, findings) {
    const rows = findings
        .map((f) => `
      <tr>
        <td>${f.domain}</td>
        <td>${f.url}</td>
        <td>${(f.metrics.diffRatio * 100).toFixed(2)}%</td>
        <td>${f.metrics.tagCosine.toFixed(3)}/${f.metrics.classCosine.toFixed(3)}</td>
        <td>${f.metrics.hamming}</td>
        <td>${f.whoisRegistrar ?? ''}</td>
        <td>${f.whoisCreationDate ?? ''}</td>
        <td>${(f.whoisNameServers ?? []).join('<br/>')}</td>
      </tr>
      <tr>
        <td colspan="8">
          <div style="display:flex; gap:12px">
            <div>
              <div>Base</div>
              <img src="file://${f.artifacts.baseShot}" style="max-width:320px"/>
            </div>
            <div>
              <div>Variant</div>
              <img src="file://${f.artifacts.variantShot}" style="max-width:320px"/>
            </div>
            <div>
              <div>Diff</div>
              <img src="file://${f.artifacts.diff}" style="max-width:320px"/>
            </div>
          </div>
        </td>
      </tr>
    `)
        .join('\n');
    return `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>${title}</title>
    <style>
      body{font-family: ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:24px}
      table{width:100%; border-collapse:collapse}
      th,td{border:1px solid #ddd; padding:8px; vertical-align:top}
      th{background:#f5f5f5}
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>Base URL: ${baseUrl}</p>
    <table>
      <thead>
        <tr>
          <th>Domain</th>
          <th>URL</th>
          <th>Visual Diff</th>
          <th>DOM Cosine</th>
          <th>Text Ham</th>
          <th>Registrar</th>
          <th>Created</th>
          <th>NS</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
  </html>`;
}
export async function writePdfReport(title, baseUrl, findings, outPdfPath) {
    await fs.mkdir(path.dirname(outPdfPath), { recursive: true });
    const html = renderHtml(title, baseUrl, findings);
    const tmpHtml = path.resolve(outPdfPath.replace(/\.pdf$/, '.html'));
    await fs.writeFile(tmpHtml, html, 'utf8');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('file://' + tmpHtml, { waitUntil: 'load' });
    await page.pdf({ path: path.resolve(outPdfPath), format: 'A4', printBackground: true });
    await browser.close();
}

