import cron from 'node-cron';
import { generateDomainVariants } from './variants.js';
import { checkDomains } from './check.js';
import { openDb, upsertVariant, insertReport } from './db.js';
import { runVisualAndContentComparison } from './monitor.js';
import path from 'node:path';
export function scheduleDaily(baseDomain, baseUrl, outDir, dbPath, hour = 8) {
    const spec = `0 ${hour} * * *`;
    cron.schedule(spec, async () => {
        const db = openDb(dbPath);
        const variants = generateDomainVariants(baseDomain);
        const domains = variants.map((v) => v.domain);
        const results = await checkDomains(domains, 10);
        const nowIso = new Date().toISOString();
        for (const v of variants) {
            const r = results.find((x) => x.domain === v.domain);
            const status = r && (r.isRegistered || r.hasARecord || r.hasMxRecord) ? 'registered' : 'unknown';
            upsertVariant(db, { domain: v.domain, reason: v.reason, firstSeen: nowIso, lastChecked: nowIso, status });
            if (status === 'registered') {
                const runDir = path.join(outDir, `${Date.now()}_${v.domain.replace(/[^a-z0-9]+/gi, '_')}`);
                try {
                    const report = await runVisualAndContentComparison(baseUrl, `http://${v.domain}`, runDir);
                    insertReport(db, {
                        domain: v.domain,
                        timestamp: report.timestamp,
                        diffRatio: report.visual.diffRatio,
                        tagCos: report.dom.tagCosine,
                        classCos: report.dom.classCosine,
                        hamming: report.text.hamming,
                        reportPath: path.join(runDir, 'report.json'),
                    });
                }
                catch {
                    // ignore failures for unreachable sites
                }
            }
        }
    });
}
