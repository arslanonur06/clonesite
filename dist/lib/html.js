import * as cheerio from 'cheerio';
export function extractDomFeatures(html) {
    const $ = cheerio.load(html);
    const tagHistogram = {};
    const classHistogram = {};
    $('*').each((_, el) => {
        const tag = el.tagName?.toLowerCase() || 'unknown';
        tagHistogram[tag] = (tagHistogram[tag] ?? 0) + 1;
        const classes = ($(el).attr('class') ?? '').split(/\s+/).filter(Boolean);
        for (const c of classes)
            classHistogram[c] = (classHistogram[c] ?? 0) + 1;
    });
    const idCount = $('[id]').length;
    const linkCount = $('a[href]').length;
    const scriptCount = $('script').length;
    const stylesheetCount = $('link[rel="stylesheet"]').length;
    return { tagHistogram, classHistogram, idCount, linkCount, scriptCount, stylesheetCount };
}
export function cosineSimilarity(vecA, vecB) {
    const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dot = 0;
    let a2 = 0;
    let b2 = 0;
    for (const k of keys) {
        const a = vecA[k] ?? 0;
        const b = vecB[k] ?? 0;
        dot += a * b;
        a2 += a * a;
        b2 += b * b;
    }
    const denom = Math.sqrt(a2) * Math.sqrt(b2);
    return denom === 0 ? 0 : dot / denom;
}
