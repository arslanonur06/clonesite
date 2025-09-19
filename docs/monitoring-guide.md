## Monitoring Guide

This guide explains how to detect typosquatting domains and identify visually or structurally similar clone sites.

### 1) Typosquatting Variants

Command:
```bash
npm run dev -- check yourbrand.com -e com.tr,bet,top -c 20
```

What it does:
- Generates variants via substitution, deletion, duplication, transposition, homographs, and suffixes.
- Checks WHOIS/DNS A/MX to flag possibly registered variants.

### 2) Visual Similarity and Content Analysis

Compare a suspected URL with your canonical site:
```bash
npm run dev -- monitor https://yourbrand.com https://suspect.com -o monitor-artifacts --threshold 0.1
```

Artifacts per run:
- base.png, variant.png: full-page screenshots
- diff.png: pixel-level diff
- report.json: metrics

Metrics:
- visual.diffRatio (0..1): lower = more visually similar
- dom.tagCosine, dom.classCosine (0..1): higher = more structurally similar
- text.hamming (integer): lower = more similar content

Suggested heuristic to flag as potential clone:
- diffRatio <= 0.1 and (tagCosine > 0.8 or classCosine > 0.6 or hamming < 16)

### 3) Automated Monitoring of Registered Variants

Run analysis on discovered registered variants and store results in SQLite:
```bash
npm run dev -- monitor-variants yourbrand.com https://yourbrand.com \
  --db data/monitor.db -o monitor-artifacts --limit 50
```

This will:
1. Generate variants and resolve A/MX/WHOIS
2. For registered ones, take screenshots, compute diffs and similarity metrics
3. Save JSON reports to `monitor-artifacts/` and rows to `data/monitor.db`

### 4) Scheduling

Run daily at a specified hour (24h):
```bash
npm run dev -- schedule yourbrand.com https://yourbrand.com --hour 8 \
  --db data/monitor.db -o monitor-artifacts
```

The process will keep running until you stop it.

### 5) Optional Telegram Alerts

Enable Telegram alerts only when ready:
```bash
export TG_BOT_TOKEN=123456:abcdef
export TG_CHAT_ID=123456789
export ENABLE_TG_ALERT=1
```

### 6) Tuning

- Adjust `--threshold` in `monitor` to be more/less strict visually.
- You can tweak variant generation patterns in `src/lib/variants.ts`.
- For larger coverage, add more TLDs via `-e` flag in `check`.

### 7) Comprehensive Brand Protection

The ultimate scanning command:
```bash
npm run dev -- comprehensive-scan https://www.kalebet.com/ kalebet \
  --sequence kalebet1256.com --range 10 --ct-days 30 -o comprehensive-reports
```

This combines:
- **Letter games**: kaleebet, kalebett, vowel swaps (kalibet, kolubet)
- **50+ TLD coverage**: .xyz, .me, .app, .bet, .casino, .poker, .games, .win, etc.
- **Numeric sequences**: kalebet1254.com through kalebet1258.com
- **Certificate Transparency**: newly registered domains with "kalebet" in last 30 days
- **Visual analysis**: screenshots, pixel diffs, DOM structure, text similarity

Output: comprehensive PDF with WHOIS, DNS, similarity metrics, and clone flagging.

### 8) Limitations

- WHOIS data varies by registry; creation dates may be missing.
- Some pages may use dynamic content; visuals can differ between runs.
- Headless rendering uses Chromium; if a site blocks bots, screenshots may fail.
- CT log searches may timeout or be rate-limited; results are best-effort.

