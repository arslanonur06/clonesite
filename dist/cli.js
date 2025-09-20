#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { z } from 'zod';
import isValidDomain from 'is-valid-domain';
import { generateDomainVariants } from './lib/variants.js';
import { checkDomains } from './lib/check.js';
import { runVisualAndContentComparison } from './lib/monitor.js';
import { openDb, upsertVariant, insertReport } from './lib/db.js';
import { scheduleDaily } from './lib/scheduler.js';
import { sendTelegram } from './lib/alerts.js';
import { generateSequenceDomains, parsePattern } from './lib/sequence.js';
import { writePdfReport } from './lib/report.js';
import { searchCTLogs } from './lib/ct-logs.js';
import { runSocialMonitoring } from './lib/social-monitor.js';
import { monitorMobileApps } from './lib/mobile-monitor.js';
import { runDarkWebMonitoring } from './lib/darkweb-monitor.js';
import { runLegalAutomation } from './lib/legal-automation.js';
import { batchThreatIntelligence } from './lib/threat-intel.js';
import { startDashboard } from './lib/dashboard.js';
import { runCryptoMonitoring } from './lib/crypto-monitor.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config';
const program = new Command();
const domainSchema = z.string().min(1);
program
    .name('domain-monitor')
    .description('Typosquatting detector: generate variants and check registrations')
    .version('0.1.0');
program
    .command('check')
    .argument('<domain>', 'original domain, e.g., kalebet.com')
    .option('-c, --concurrency <n>', 'concurrent checks', '10')
    .option('-e, --extensions <csv>', 'extra TLDs CSV to consider')
    .action(async (domainArg, options) => {
    const domain = domainSchema.parse(domainArg.trim().toLowerCase());
    if (!isValidDomain(domain, { subdomain: false, allowUnicode: true })) {
        console.error(chalk.red(`Invalid domain: ${domain}`));
        process.exit(1);
    }
    const extraExts = options.extensions
        ? options.extensions
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((e) => (e.startsWith('.') ? e : `.${e}`))
        : undefined;
    const variants = generateDomainVariants(domain, { extensions: extraExts });
    const variantDomains = variants.map((v) => v.domain);
    console.log(chalk.cyan(`Generated ${variantDomains.length} variants. Checking...`));
    const results = await checkDomains(variantDomains, parseInt(options.concurrency, 10));
    const found = results.filter((r) => r.isRegistered || r.hasARecord || r.hasMxRecord);
    if (found.length === 0) {
        console.log(chalk.green('No registered variants found.'));
        return;
    }
    console.log(chalk.yellow(`Found ${found.length} potentially registered variants:`));
    for (const r of found) {
        const reason = variants.find((v) => v.domain === r.domain)?.reason ?? 'variant';
        const rec = [r.hasARecord ? 'A' : '', r.hasMxRecord ? 'MX' : ''].filter(Boolean).join(',');
        console.log(`${chalk.bold(r.domain)} ${chalk.gray(`(${reason})`)} -> ` +
            `${r.isRegistered ? chalk.red('REGISTERED') : chalk.gray('unknown')} ` +
            `${rec ? chalk.blue(`[${rec}]`) : ''}`);
    }
});
program
    .command('monitor-variants')
    .argument('<domain>', 'base domain e.g., kalebet.com')
    .argument('<baseUrl>', 'canonical site url, e.g., https://kalebet.com')
    .option('-o, --out <dir>', 'output dir', 'monitor-artifacts')
    .option('--db <path>', 'sqlite path', 'data/monitor.db')
    .option('--limit <n>', 'max variants to monitor', '50')
    .action(async (domain, baseUrl, opts) => {
    const db = openDb(opts.db);
    const { generateDomainVariants } = await import('./lib/variants.js');
    const { checkDomains } = await import('./lib/check.js');
    const variants = generateDomainVariants(domain);
    const results = await checkDomains(variants.map((v) => v.domain), 10);
    const nowIso = new Date().toISOString();
    const registered = variants.filter((v) => {
        const r = results.find((x) => x.domain === v.domain);
        return r && (r.isRegistered || r.hasARecord || r.hasMxRecord);
    });
    const slice = registered.slice(0, parseInt(opts.limit, 10));
    await fs.mkdir(opts.out, { recursive: true });
    for (const v of slice) {
        upsertVariant(db, { domain: v.domain, reason: v.reason, firstSeen: nowIso, lastChecked: nowIso, status: 'registered' });
        const runDir = path.join(opts.out, `${Date.now()}_${v.domain.replace(/[^a-z0-9]+/gi, '_')}`);
        try {
            const report = await runVisualAndContentComparison(baseUrl, `http://${v.domain}`, runDir);
            insertReport(db, { domain: v.domain, timestamp: report.timestamp, diffRatio: report.visual.diffRatio, tagCos: report.dom.tagCosine, classCos: report.dom.classCosine, hamming: report.text.hamming, reportPath: path.join(runDir, 'report.json') });
            const msg = `Clone check for ${v.domain}: diff=${(report.visual.diffRatio * 100).toFixed(2)}% tagCos=${report.dom.tagCosine.toFixed(2)} classCos=${report.dom.classCosine.toFixed(2)} ham=${report.text.hamming}`;
            if (process.env.TG_BOT_TOKEN && process.env.TG_CHAT_ID && process.env.ENABLE_TG_ALERT === '1') {
                await sendTelegram(process.env.TG_BOT_TOKEN, process.env.TG_CHAT_ID, msg);
            }
        }
        catch (e) {
            console.error(chalk.yellow(`Monitor failed for ${v.domain}: ${e.message}`));
        }
    }
});
program
    .command('schedule')
    .argument('<domain>', 'base domain e.g., kalebet.com')
    .argument('<baseUrl>', 'canonical site url, e.g., https://kalebet.com')
    .option('-o, --out <dir>', 'output dir', 'monitor-artifacts')
    .option('--db <path>', 'sqlite path', 'data/monitor.db')
    .option('--hour <h>', 'hour of day (0-23)', '8')
    .action(async (domain, baseUrl, opts) => {
    await fs.mkdir(opts.out, { recursive: true });
    scheduleDaily(domain, baseUrl, opts.out, opts.db, parseInt(opts.hour, 10));
    console.log(chalk.green(`Scheduled daily monitoring at ${opts.hour}:00 for ${domain}`));
    console.log(chalk.gray('Process will keep running. Press Ctrl+C to exit.'));
});
program
    .command('ultimate-scan')
    .argument('<baseUrl>', 'original site url, e.g., https://www.kalebet.com/')
    .argument('<brand>', 'brand name, e.g., kalebet')
    .option('--sequence <pattern>', 'sequence pattern like kalebet1256.com')
    .option('--range <n>', '+/- range for sequence scan', '10')
    .option('--ct-days <n>', 'CT log search days back', '30')
    .option('--logo <url>', 'original logo URL for visual comparison')
    .option('-o, --out <dir>', 'output dir', 'ultimate-reports')
    .action(async (baseUrl, brand, opts) => {
    const allCandidates = new Map();
    const allThreats = [];
    // 1) Generate typosquatting variants with letter games
    console.log(chalk.gray('1. Generating typosquatting variants...'));
    const variants = generateDomainVariants(brand);
    console.log(chalk.cyan(`Generated ${variants.length} typosquatting variants`));
    // 1.5) Social media monitoring
    console.log(chalk.gray('1.5. Monitoring social media threats...'));
    try {
        const socialData = await runSocialMonitoring(brand);
        console.log(chalk.cyan(`Found ${socialData.social.length} social media threats`));
        allThreats.push(...socialData.social);
    }
    catch (e) {
        console.error(chalk.yellow(`Social monitoring failed: ${e.message}`));
    }
    // 2) Sequence scan if pattern provided
    if (opts.sequence) {
        console.log(chalk.gray('2. Scanning numeric sequences...'));
        const parsed = parsePattern(opts.sequence);
        if (parsed) {
            const seqDomains = generateSequenceDomains({
                patternDomain: opts.sequence,
                range: parseInt(opts.range, 10),
                includeWWW: true
            });
            console.log(chalk.cyan(`Generated ${seqDomains.length} sequence variants`));
            for (const d of seqDomains) {
                allCandidates.set(d, { domain: d, reason: 'sequence variant' });
            }
        }
    }
    // 3) Certificate Transparency logs for new registrations
    console.log(chalk.gray('3. Searching Certificate Transparency logs...'));
    try {
        const ctEntries = await searchCTLogs(brand, parseInt(opts.ctDays, 10));
        console.log(chalk.cyan(`Found ${ctEntries.length} new certificates containing "${brand}"`));
        for (const entry of ctEntries) {
            allCandidates.set(entry.domain, {
                domain: entry.domain,
                reason: `new cert ${entry.timestamp.slice(0, 10)}`
            });
        }
    }
    catch (e) {
        console.error(chalk.yellow(`CT log search failed: ${e.message}`));
    }
    // Add typosquatting variants
    for (const v of variants) {
        allCandidates.set(v.domain, v);
    }
    const domains = Array.from(allCandidates.keys());
    console.log(chalk.cyan(`Total unique domains to check: ${domains.length}`));
    // 4) DNS/WHOIS check
    console.log(chalk.gray('4. Checking DNS/WHOIS...'));
    const { checkDomains } = await import('./lib/check.js');
    const dnsResults = await checkDomains(domains, 15);
    const registered = dnsResults.filter((r) => r.isRegistered || r.hasARecord || r.hasMxRecord);
    console.log(chalk.cyan(`Found ${registered.length} registered/active domains`));
    // 5) Visual/content analysis
    console.log(chalk.gray('5. Analyzing visual/content similarity...'));
    const findings = [];
    const pLimit = (await import('p-limit')).default;
    const limit = pLimit(3);
    await Promise.all(registered.slice(0, 50).map((r) => limit(async () => {
        const variantUrl = r.domain.startsWith('www.') ? `http://${r.domain}` : `http://${r.domain}`;
        const runDir = path.join(opts.out, `${Date.now()}_${r.domain.replace(/[^a-z0-9]+/gi, '_')}`);
        try {
            console.log(chalk.gray(`Analyzing ${r.domain}...`));
            const { runVisualAndContentComparison } = await import('./lib/monitor.js');
            const rep = await runVisualAndContentComparison(baseUrl, variantUrl, runDir);
            const candidate = allCandidates.get(r.domain);
            findings.push({
                domain: r.domain,
                url: variantUrl,
                whoisCreationDate: r.whoisCreationDate ?? null,
                whoisRegistrar: r.whoisRegistrar ?? null,
                whoisNameServers: r.whoisNameServers ?? null,
                aRecords: r.aRecords,
                mxRecords: r.mxRecords,
                metrics: {
                    diffRatio: rep.visual.diffRatio,
                    tagCosine: rep.dom.tagCosine,
                    classCosine: rep.dom.classCosine,
                    hamming: rep.text.hamming,
                },
                artifacts: rep.artifacts,
            });
            const similarity = rep.visual.diffRatio < 0.1 && (rep.dom.tagCosine > 0.8 || rep.text.hamming < 16);
            const icon = similarity ? '🚨' : '✓';
            console.log(chalk[similarity ? 'red' : 'green'](`${icon} ${r.domain} - diff: ${(rep.visual.diffRatio * 100).toFixed(1)}% (${candidate?.reason})`));
        }
        catch (e) {
            console.error(chalk.yellow(`✗ Skip ${r.domain}: ${e.message.slice(0, 80)}`));
        }
    })));
    // 6) Generate comprehensive PDF report
    const pdfPath = path.join(opts.out, `comprehensive-report-${brand}-${Date.now()}.pdf`);
    await writePdfReport(`Comprehensive Brand Protection Report - ${brand}`, baseUrl, findings, pdfPath);
    // Summary
    const clones = findings.filter(f => f.metrics.diffRatio < 0.1 && (f.metrics.tagCosine > 0.8 || f.metrics.hamming < 16));
    console.log(chalk.green(`\n📊 Scan complete:`));
    console.log(chalk.cyan(`• Total domains scanned: ${domains.length}`));
    console.log(chalk.cyan(`• Registered/active: ${registered.length}`));
    console.log(chalk.cyan(`• Analyzed: ${findings.length}`));
    console.log(chalk[clones.length > 0 ? 'red' : 'green'](`• Potential clones: ${clones.length}`));
    console.log(chalk.green(`• Report saved: ${pdfPath}`));
});
program
    .command('dashboard')
    .option('-p, --port <port>', 'dashboard port', '3000')
    .action(async (opts) => {
    console.log(chalk.cyan('🌐 Starting Brand Protection Dashboard...'));
    const dashboard = await startDashboard(parseInt(opts.port, 10));
    console.log(chalk.green(`Dashboard running at http://localhost:${opts.port}`));
    console.log(chalk.gray('Press Ctrl+C to stop'));
    // Keep process running
    process.on('SIGINT', async () => {
        console.log(chalk.yellow('\nShutting down dashboard...'));
        await dashboard.stop();
        process.exit(0);
    });
});
program
    .command('mobile-scan')
    .argument('<brand>', 'brand name to search for')
    .option('--logo <url>', 'original app icon URL for comparison')
    .option('-o, --out <file>', 'output JSON file', 'mobile-threats.json')
    .action(async (brand, opts) => {
    console.log(chalk.cyan(`📱 Scanning mobile app stores for: ${brand}`));
    const apps = await monitorMobileApps(brand, opts.logo);
    await fs.writeFile(opts.out, JSON.stringify(apps, null, 2));
    console.log(chalk.green(`Found ${apps.length} suspicious apps, saved to ${opts.out}`));
});
program
    .command('crypto-scan')
    .argument('<brand>', 'brand name to search for')
    .option('-o, --out <file>', 'output JSON file', 'crypto-threats.json')
    .action(async (brand, opts) => {
    console.log(chalk.cyan(`₿ Scanning cryptocurrency threats for: ${brand}`));
    const result = await runCryptoMonitoring(brand);
    await fs.writeFile(opts.out, JSON.stringify(result, null, 2));
    console.log(chalk.green(`Found ${result.threats.length} crypto threats and ${result.blockchainDomains.length} blockchain domains`));
});
program
    .command('darkweb-scan')
    .argument('<brand>', 'brand name to search for')
    .option('-o, --out <file>', 'output JSON file', 'darkweb-threats.json')
    .action(async (brand, opts) => {
    console.log(chalk.cyan(`🕵️ Scanning dark web and underground sources for: ${brand}`));
    const result = await runDarkWebMonitoring(brand);
    await fs.writeFile(opts.out, JSON.stringify(result, null, 2));
    console.log(chalk.green(`Found ${result.threats.length} dark web threats and ${result.leaks.length} credential leaks`));
});
program
    .command('threat-intel')
    .argument('<domains...>', 'domains to analyze')
    .option('-o, --out <file>', 'output JSON file', 'threat-intel.json')
    .action(async (domains, opts) => {
    console.log(chalk.cyan(`🔍 Running threat intelligence analysis on ${domains.length} domains...`));
    const intelligence = await batchThreatIntelligence(domains);
    await fs.writeFile(opts.out, JSON.stringify(intelligence, null, 2));
    const malicious = intelligence.filter(i => i.reputation === 'malicious').length;
    console.log(chalk.green(`Analysis complete: ${malicious} malicious, ${intelligence.length - malicious} clean/suspicious`));
});
program
    .command('legal-takedown')
    .argument('<brand>', 'brand name')
    .argument('[domains...]', 'domains to create takedown requests for')
    .option('--artifacts <dir>', 'directory containing evidence artifacts', '.')
    .option('-o, --out <file>', 'output report file', 'takedown-report.json')
    .action(async (brand, domains = [], opts) => {
    console.log(chalk.cyan(`⚖️ Creating takedown requests for ${domains.length} domains...`));
    const requests = await runLegalAutomation(domains, brand, opts.artifacts);
    await fs.writeFile(opts.out, JSON.stringify(requests, null, 2));
    console.log(chalk.green(`Created ${requests.length} takedown requests, saved to ${opts.out}`));
});
program
    .command('monitor')
    .argument('<baseUrl>', 'canonical site url, e.g., https://kalebet.com')
    .argument('<url>', 'target url to compare')
    .option('-o, --out <dir>', 'output dir for artifacts', 'monitor-artifacts')
    .option('--threshold <r>', 'diff ratio threshold 0..1', '0.1')
    .action(async (baseUrl, url, options) => {
    const outDir = path.resolve(options.out);
    await fs.mkdir(outDir, { recursive: true });
    const safeName = url.replace(/[^a-z0-9]+/gi, '_').slice(0, 100);
    const runDir = path.join(outDir, `${Date.now()}_${safeName}`);
    const result = await runVisualAndContentComparison(baseUrl, url, runDir);
    const reportPath = path.join(runDir, 'report.json');
    await fs.writeFile(reportPath, JSON.stringify(result, null, 2), 'utf8');
    const threshold = parseFloat(options.threshold);
    const flagged = result.visual.diffRatio <= threshold
        ? (result.dom.tagCosine > 0.8 || result.classCosine > 0.6 || result.text.hamming < 16)
        : false;
    console.log(chalk.cyan(`Report saved: ${reportPath}`));
    if (flagged) {
        console.log(chalk.red('Potential clone detected based on visual/DOM/text similarity.'));
    }
    else {
        console.log(chalk.green('No strong similarity detected.'));
    }
});
program.parseAsync();

