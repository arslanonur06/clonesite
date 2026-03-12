## 🛡️ Advanced Brand Protection System

**Enterprise-grade brand monitoring with AI-powered threat detection, real-time analytics, and automated legal response.**

### 🚀 Ultimate Brand Protection Features
- **8 Detection Methods**: Typosquatting, social media, mobile apps, dark web, crypto, visual AI, threat intel, legal automation
- **Real-time Dashboard**: Live monitoring with WebSocket updates
- **50+ TLD Coverage**: Complete domain landscape monitoring  
- **AI Visual Detection**: Logo similarity and design clone detection
- **Legal Automation**: Automated takedown requests and evidence collection
- **Multi-platform**: Web, mobile, social media, blockchain monitoring

### Setup

```bash
pnpm install # or npm install / yarn
```

### Build

```bash
pnpm build
```

### Run (dev)

```bash
pnpm dev check https://t2m.io/telg
```

### Run (built)

```bash
pnpm start check https://t2m.io/telg
```

### Options

- `-c, --concurrency <n>`: number of concurrent checks (default 10)
- `-e, --extensions <csv>`: extra TLDs to consider, e.g. `-e com.tr,bet,top`

### What it does

- Generates variants via:
  - substitution, deletion, duplication, transposition
  - homograph replacements (limited set)
  - suffix additions (e.g., `official`, `tr`, `123`)
  - original label across alternate TLDs
- Resolves A and MX via DNS-over-HTTPS
- Queries WHOIS (best-effort; falls back to DNS signals if rate-limited)

### Scheduling daily checks

Use `cron` (macOS/Linux) to run daily:

```bash
crontab -e
# Run every day at 08:00
0 8 * * * cd /Users/oa/Documents/gitdosyam/clonesite && pnpm start check https://t2m.io/telg | tee -a logs/monitor.log
```

Ensure the `logs/` directory exists, and adjust domain/TLDs as needed.

### Notes

- WHOIS responses vary by registry; creation dates may be missing. A/MX records are a strong signal of activity even if WHOIS is rate-limited.
- Add or modify patterns in `src/lib/variants.ts` to expand coverage.

### Visual and Content Similarity Monitoring

Compare a suspected URL against your canonical site:

```bash
npm run dev -- monitor https://your-base.com https://suspect.com -o monitor-artifacts --threshold 0.1
```

Artifacts: `base.png`, `variant.png`, `diff.png`, and `report.json` with:
- visual.diffRatio (0..1), dom.tagCosine, dom.classCosine, text.hamming

### Automated Monitoring of Discovered Variants

Persist results to SQLite and alert when similarity is high:

```bash
# monitor top registered variants against your base URL
npm run dev -- monitor-variants https://t2m.io/telg https://t2m.io/telg \
  --db data/monitor.db -o monitor-artifacts --limit 50

# schedule daily at hour 8
npm run dev -- schedule https://t2m.io/telg https://t2m.io/telg \
  --db data/monitor.db -o monitor-artifacts --hour 8
```

Environment variables for alerts (optional, Telegram only; Slack disabled):

```bash
TG_BOT_TOKEN=123456:abcdef
TG_CHAT_ID=123456789
ENABLE_TG_ALERT=1
```

## 🌐 Web Interface (NEW!)

**Beautiful React dashboard for any brand monitoring:**

```bash
# Start the web interface
./start-web.sh
# Visit: http://localhost:3000
```

### ✨ Web Interface Features
- **Universal Brand Input**: Monitor ANY brand or domain
- **Feature Selection**: Choose from 8 monitoring types  
- **Real-Time Progress**: Live scan progress with WebSocket updates
- **Interactive Results**: Visual threat analysis and reporting
- **Responsive Design**: Works on desktop, tablet, and mobile

## ✅ Complete Feature Verification

Run the comprehensive verification script:
```bash
./verify-features.sh
```

This verifies all 8 advanced features, CLI commands, web interface, documentation, and dependencies.

## 🎯 Quick Start Commands

### Ultimate Brand Protection Scan
```bash
# Complete brand protection analysis
npm run dev -- ultimate-scan https://t2m.io/telg suratbet \
  --sequence suratbet1256.com --range 10 --ct-days 30 --logo https://t2m.io/telg
```

### Real-Time Dashboard
```bash
# Start monitoring dashboard
npm run dev -- dashboard --port 3000
# Visit: http://localhost:3000
```

### Specialized Scans
```bash
# Mobile app monitoring
npm run dev -- mobile-scan suratbet --logo https://t2m.io/telg

# Cryptocurrency threats
npm run dev -- crypto-scan suratbet

# Dark web monitoring  
npm run dev -- darkweb-scan suratbet

# Social media threats
npm run dev -- social-monitor suratbet

# Threat intelligence analysis
npm run dev -- threat-intel suspicious1.com suspicious2.com

# Legal takedown automation
npm run dev -- legal-takedown suspicious1.com suspicious2.com suratbet
```

## 📊 What Gets Detected

### 🔍 Domain Threats
- **Typosquatting**: kaleebet.com, suratbett.xyz, kalibet.me (2000+ patterns)
- **Sequence Domains**: suratbet1254.com, suratbet1257.com, suratbet1258.com  
- **New Registrations**: Certificate Transparency monitoring
- **50+ TLDs**: .bet, .casino, .xyz, .me, .app, .crypto, .eth

### 📱 Mobile Threats  
- **Fake Apps**: iOS App Store and Google Play impersonation
- **Icon Clones**: AI-powered visual similarity detection
- **Developer Analysis**: Unofficial brand usage detection

### 💰 Cryptocurrency Threats
- **Fake Exchanges**: Fraudulent trading platforms
- **Phishing Wallets**: Seed phrase theft sites  
- **ICO Scams**: Token fraud detection
- **Blockchain Domains**: .crypto, .eth, .nft monitoring

### 🕵️ Underground Threats
- **Credential Leaks**: Breach database monitoring
- **Dark Web**: Tor network brand mentions
- **Malware**: VirusTotal/URLVoid integration
- **Forums**: Cybercrime discussion tracking

### 📺 Social Media Threats
- **Twitter/X**: Phishing and scam tweets
- **Telegram**: Public channel monitoring  
- **Email Security**: DMARC/SPF verification

## 📈 Advanced Analytics

- **Risk Scoring**: 0-100 automated threat assessment
- **Visual Similarity**: Pixel-level website comparison
- **AI Logo Detection**: Computer vision brand analysis  
- **Geographic Mapping**: Threat source visualization
- **Trend Analysis**: Historical threat evolution

## ⚖️ Legal Automation

- **Evidence Collection**: Automated screenshot and data archival
- **Takedown Requests**: DMCA, trademark, and phishing notices
- **Abuse Contacts**: Automatic registrar contact extraction
- **Legal Templates**: Jurisdiction-compliant notice generation

## 📚 Documentation

- **[Complete Features](docs/FEATURES.md)**: Detailed feature documentation
- **[API Reference](docs/API-REFERENCE.md)**: Programmatic access guide
- **[Changelog](docs/CHANGELOG.md)**: Version history and updates
- **[Monitoring Guide](docs/monitoring-guide.md)**: Best practices and workflows

See the detailed guide: `docs/monitoring-guide.md`.

---

## Brand Note
This documentation is configured for **suratbet** with official redirect URL **https://t2m.io/telg**.
Brand owner/agency: **jelibon marketing**.
