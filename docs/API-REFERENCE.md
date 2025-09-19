# API Reference Documentation

## 🔌 Brand Protection System API

Complete API documentation for programmatic access to all brand protection features.

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Core Monitoring APIs](#core-monitoring-apis)
3. [Social Media APIs](#social-media-apis)
4. [Mobile Monitoring APIs](#mobile-monitoring-apis)
5. [Threat Intelligence APIs](#threat-intelligence-apis)
6. [Dashboard APIs](#dashboard-apis)
7. [Legal Automation APIs](#legal-automation-apis)
8. [WebSocket Events](#websocket-events)
9. [Error Handling](#error-handling)
10. [Rate Limits](#rate-limits)

---

## 🔐 Authentication

### Environment Variables
```bash
# Required for full functionality
TWITTER_API_KEY=your_twitter_bearer_token
VIRUSTOTAL_API_KEY=your_virustotal_key
URLVOID_API_KEY=your_urlvoid_key
SHODAN_API_KEY=your_shodan_key
SECURITYTRAILS_API_KEY=your_securitytrails_key

# Optional for alerts
TG_BOT_TOKEN=your_telegram_bot_token
TG_CHAT_ID=your_chat_id
ENABLE_TG_ALERT=1

# Dashboard security (optional)
DASHBOARD_SECRET=your_secret_key
```

### API Key Usage
Most external integrations require API keys. The system gracefully degrades when keys are missing, logging warnings for unavailable features.

---

## 🔍 Core Monitoring APIs

### Domain Variant Generation
**Function**: `generateDomainVariants(originalDomain, options?)`

```typescript
import { generateDomainVariants } from './lib/variants.js';

const variants = generateDomainVariants('kalebet.com', {
  extensions: ['.bet', '.casino', '.xyz'] // Optional custom TLDs
});

// Returns: DomainVariant[]
// {
//   domain: string;
//   reason: string; // e.g., "substitution a->e", "double vowel 'e' at 3"
// }
```

**Patterns Generated**:
- Character substitution, deletion, duplication
- Adjacent transposition
- Letter games (double letters, vowel swaps)
- Homograph attacks
- Suffix additions

### Domain Health Check
**Function**: `checkDomains(domains, concurrency?)`

```typescript
import { checkDomains } from './lib/check.js';

const results = await checkDomains(['suspicious1.com', 'suspicious2.com'], 10);

// Returns: DomainCheckResult[]
// {
//   domain: string;
//   isRegistered: boolean;
//   whoisCreationDate?: string | number | Date | null;
//   whoisRegistrar?: string | null;
//   whoisNameServers?: string[] | null;
//   hasARecord: boolean;
//   hasMxRecord: boolean;
//   aRecords?: string[];
//   mxRecords?: { exchange: string; priority: number }[];
//   error?: string;
// }
```

### Visual Comparison
**Function**: `runVisualAndContentComparison(baseUrl, variantUrl, outDir)`

```typescript
import { runVisualAndContentComparison } from './lib/monitor.js';

const result = await runVisualAndContentComparison(
  'https://original.com',
  'http://suspicious.com',
  './artifacts'
);

// Returns: MonitorResult
// {
//   url: string;
//   timestamp: string;
//   visual: { diffRatio: number };
//   dom: { tagCosine: number; classCosine: number };
//   text: { hamming: number };
//   artifacts: { baseShot: string; variantShot: string; diff: string };
// }
```

---

## 📱 Social Media APIs

### Social Media Monitoring
**Function**: `runSocialMonitoring(brand)`

```typescript
import { runSocialMonitoring } from './lib/social-monitor.js';

const result = await runSocialMonitoring('kalebet');

// Returns: { social: SocialThreat[]; email: EmailThreat }
// SocialThreat: {
//   platform: string;
//   url: string;
//   content: string;
//   timestamp: string;
//   riskLevel: 'low' | 'medium' | 'high';
//   brandMentions: string[];
// }
```

### Individual Platform Monitoring
```typescript
import { monitorTwitter, monitorTelegram, monitorEmailSecurity } from './lib/social-monitor.js';

// Twitter monitoring (requires API key)
const twitterThreats = await monitorTwitter('kalebet', process.env.TWITTER_API_KEY);

// Telegram public channel monitoring
const telegramThreats = await monitorTelegram('kalebet');

// Email security assessment
const emailThreat = await monitorEmailSecurity('kalebet.com');
```

---

## 📱 Mobile Monitoring APIs

### App Store Scanning
**Function**: `monitorMobileApps(brand, originalIconUrl?)`

```typescript
import { monitorMobileApps } from './lib/mobile-monitor.js';

const suspiciousApps = await monitorMobileApps('kalebet', 'https://kalebet.com/icon.png');

// Returns: MobileApp[]
// {
//   platform: 'ios' | 'android';
//   appId: string;
//   name: string;
//   developer: string;
//   iconUrl: string;
//   storeUrl: string;
//   riskLevel: 'low' | 'medium' | 'high';
//   suspiciousReasons: string[];
// }
```

### Individual Store Scanning
```typescript
import { searchAppStore, compareAppIcons } from './lib/mobile-monitor.js';

// iOS App Store
const iosApps = await searchAppStore('kalebet', 'ios');

// Google Play Store
const androidApps = await searchAppStore('kalebet', 'android');

// Icon similarity
const similarity = await compareAppIcons(
  'https://original.com/icon.png',
  'https://suspicious.com/icon.png'
); // Returns: number (0-1)
```

---

## 🤖 AI Visual Detection APIs

### Logo Analysis
**Function**: `compareLogos(originalPath, suspiciousPath)`

```typescript
import { compareLogos, extractDominantColors, detectLogoRegions } from './lib/ai-visual.js';

const similarity = await compareLogos('./original-logo.png', './suspicious-logo.png');

// Returns: LogoSimilarity
// {
//   similarity: number;
//   matchedRegions: number;
//   colorMatch: number;
//   shapeMatch: number;
// }

// Individual analysis functions
const colors = await extractDominantColors('./image.png', 5);
const regions = await detectLogoRegions('./image.png');
const faviconSimilarity = await analyzeFavicon('https://original.com', 'https://suspicious.com');
```

---

## 🕵️ Dark Web Monitoring APIs

### Underground Threat Monitoring
**Function**: `runDarkWebMonitoring(brand)`

```typescript
import { runDarkWebMonitoring } from './lib/darkweb-monitor.js';

const result = await runDarkWebMonitoring('kalebet');

// Returns: { threats: DarkWebThreat[]; leaks: CredentialLeak[] }
// DarkWebThreat: {
//   source: 'tor' | 'forum' | 'marketplace' | 'leak';
//   url: string;
//   title: string;
//   content: string;
//   riskLevel: 'low' | 'medium' | 'high' | 'critical';
//   threatType: 'credential_leak' | 'phishing_kit' | 'malware' | 'marketplace_listing';
// }
```

### Individual Monitoring Functions
```typescript
import { 
  checkCredentialLeaks,
  monitorCybercrimeForums,
  monitorMalwareFeeds,
  monitorTorNetwork 
} from './lib/darkweb-monitor.js';

const leaks = await checkCredentialLeaks('kalebet.com');
const forumThreats = await monitorCybercrimeForums('kalebet');
const malwareThreats = await monitorMalwareFeeds('kalebet');
const torThreats = await monitorTorNetwork('kalebet');
```

---

## 🔍 Threat Intelligence APIs

### Comprehensive Threat Analysis
**Function**: `getThreatIntelligence(domain)` | `batchThreatIntelligence(domains)`

```typescript
import { getThreatIntelligence, batchThreatIntelligence } from './lib/threat-intel.js';

// Single domain analysis
const intel = await getThreatIntelligence('suspicious.com');

// Batch analysis
const batchIntel = await batchThreatIntelligence(['domain1.com', 'domain2.com']);

// Returns: ThreatIntelligence
// {
//   domain: string;
//   reputation: 'clean' | 'suspicious' | 'malicious' | 'unknown';
//   riskScore: number; // 0-100
//   categories: string[];
//   sources: string[];
//   details: {
//     virusTotal?: { positives: number; total: number };
//     urlVoid?: { engines: number; detections: string[] };
//     shodan?: { ports: number[]; services: string[]; country: string };
//     passiveDns?: { ips: string[]; firstSeen: string; lastSeen: string };
//   };
// }
```

### Individual Intelligence Sources
```typescript
import { 
  checkVirusTotal,
  checkUrlVoid,
  checkShodan,
  checkPassiveDns 
} from './lib/threat-intel.js';

const vtResult = await checkVirusTotal('suspicious.com');
const urlvoidResult = await checkUrlVoid('suspicious.com');
const shodanResult = await checkShodan('suspicious.com');
const dnsResult = await checkPassiveDns('suspicious.com');
```

---

## ⚖️ Legal Automation APIs

### Takedown Request Management
**Function**: `runLegalAutomation(domains, brand, artifactDir)`

```typescript
import { 
  createTakedownRequest,
  sendTakedownRequest,
  runLegalAutomation 
} from './lib/legal-automation.js';

// Automated takedown for multiple domains
const requests = await runLegalAutomation(
  ['suspicious1.com', 'suspicious2.com'],
  'kalebet',
  './evidence-artifacts'
);

// Manual takedown request creation
const request = await createTakedownRequest(
  'suspicious.com',
  'phishing',
  ['./screenshot.png', './whois.txt']
);

const sent = await sendTakedownRequest(request, 'kalebet');
```

**Request Types**: `'phishing' | 'trademark' | 'copyright' | 'malware'`

### Evidence Collection
```typescript
import { collectEvidence, extractAbuseContacts } from './lib/legal-automation.js';

const evidence = await collectEvidence('suspicious.com', [
  './screenshots/suspicious.png',
  './reports/similarity.json'
]);

const abuseContacts = await extractAbuseContacts('suspicious.com');
```

---

## ₿ Cryptocurrency Monitoring APIs

### Crypto Threat Detection
**Function**: `runCryptoMonitoring(brand)`

```typescript
import { runCryptoMonitoring } from './lib/crypto-monitor.js';

const result = await runCryptoMonitoring('kalebet');

// Returns: { threats: CryptoThreat[]; blockchainDomains: BlockchainDomain[] }
// CryptoThreat: {
//   type: 'fake_exchange' | 'phishing_wallet' | 'ico_scam' | 'blockchain_domain';
//   domain: string;
//   riskLevel: 'low' | 'medium' | 'high' | 'critical';
//   indicators: string[];
//   walletAddresses?: string[];
// }
```

### Individual Crypto Monitoring
```typescript
import { 
  monitorFakeExchanges,
  monitorPhishingWallets,
  monitorIcoScams,
  monitorBlockchainDomains 
} from './lib/crypto-monitor.js';

const fakeExchanges = await monitorFakeExchanges('kalebet');
const phishingWallets = await monitorPhishingWallets('kalebet');
const icoScams = await monitorIcoScams('kalebet');
const blockchainDomains = await monitorBlockchainDomains('kalebet');
```

---

## 📊 Dashboard APIs

### REST Endpoints

#### GET `/api/metrics`
Returns real-time system metrics.

```typescript
// Response: DashboardMetrics
{
  totalDomains: number;
  activeDomains: number;
  cloneCount: number;
  riskDistribution: { low: number; medium: number; high: number; critical: number };
  recentAlerts: Array<{
    domain: string;
    type: string;
    severity: string;
    timestamp: string;
  }>;
  geographicDistribution: Record<string, number>;
  trendData: Array<{
    date: string;
    newDomains: number;
    clones: number;
    threats: number;
  }>;
}
```

#### GET `/api/domains`
Returns monitored domain data.

```typescript
// Response: VariantRow[]
{
  domain: string;
  reason: string;
  firstSeen: string;
  lastChecked: string | null;
  status: string;
}[]
```

#### GET `/api/threats`
Returns threat intelligence data.

```typescript
// Response: ThreatIntelligence[]
```

#### POST `/api/takedown`
Triggers takedown request.

```typescript
// Request body
{
  domain: string;
  type: 'phishing' | 'trademark' | 'copyright' | 'malware';
}

// Response
{
  success: boolean;
  request?: TakedownRequest;
  error?: string;
}
```

### Dashboard Class API
```typescript
import { BrandProtectionDashboard } from './lib/dashboard.js';

const dashboard = new BrandProtectionDashboard(3000);
await dashboard.start();

// Update metrics
dashboard.updateMetrics({
  totalDomains: 1500,
  cloneCount: 12
});

// Add alert
dashboard.addAlert({
  domain: 'suspicious.com',
  type: 'clone_detected',
  severity: 'high',
  timestamp: new Date().toISOString()
});

await dashboard.stop();
```

---

## 🔌 WebSocket Events

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => console.log('Connected to dashboard');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  handleMessage(message);
};
```

### Event Types

#### Metrics Update
```typescript
{
  type: 'metrics';
  data: DashboardMetrics;
}
```

#### New Alert
```typescript
{
  type: 'alert';
  data: {
    domain: string;
    type: string;
    severity: string;
    timestamp: string;
  };
}
```

#### Scan Complete
```typescript
{
  type: 'scan_complete';
  data: {
    brand: string;
    results: number;
  };
}
```

### Client Messages
```typescript
// Subscribe to updates
ws.send(JSON.stringify({ type: 'subscribe' }));

// Trigger scan
ws.send(JSON.stringify({ 
  type: 'scan', 
  brand: 'kalebet' 
}));

// Trigger takedown
ws.send(JSON.stringify({ 
  type: 'takedown', 
  domain: 'suspicious.com',
  type: 'phishing'
}));
```

---

## 📊 Database APIs

### SQLite Integration
```typescript
import { openDb, upsertVariant, insertReport, listVariants } from './lib/db.js';

const db = openDb('data/monitor.db');

// Insert/update variant
upsertVariant(db, {
  domain: 'suspicious.com',
  reason: 'typosquatting',
  firstSeen: new Date().toISOString(),
  lastChecked: new Date().toISOString(),
  status: 'registered'
});

// Insert monitoring report
insertReport(db, {
  domain: 'suspicious.com',
  timestamp: new Date().toISOString(),
  diffRatio: 0.05,
  tagCos: 0.95,
  classCos: 0.92,
  hamming: 8,
  reportPath: './reports/suspicious.json'
});

// List all variants
const variants = listVariants(db);
```

---

## ❌ Error Handling

### Standard Error Format
```typescript
{
  error: string;
  code?: string;
  details?: any;
}
```

### Common Error Codes
- `INVALID_DOMAIN`: Domain format validation failed
- `API_KEY_MISSING`: Required API key not provided
- `RATE_LIMIT_EXCEEDED`: API rate limit hit
- `NETWORK_ERROR`: Network connectivity issue
- `TIMEOUT`: Operation timed out
- `PERMISSION_DENIED`: Insufficient permissions

### Error Handling Patterns
```typescript
try {
  const result = await monitorDomain('example.com');
} catch (error) {
  if (error.code === 'API_KEY_MISSING') {
    console.warn('API key missing, skipping external checks');
    // Graceful degradation
  } else if (error.code === 'TIMEOUT') {
    console.error('Operation timed out, retrying...');
    // Retry logic
  } else {
    throw error; // Re-throw unexpected errors
  }
}
```

---

## ⏱️ Rate Limits

### External API Limits
- **Twitter API**: 300 requests/15min window
- **VirusTotal**: 4 requests/min (free tier)
- **URLVoid**: 1000 requests/month (free tier)
- **Shodan**: 1 request/second (free tier)

### Built-in Rate Limiting
```typescript
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent requests

const results = await Promise.all(
  domains.map(domain => limit(() => checkDomain(domain)))
);
```

### Retry Logic
```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## 🔧 Configuration

### Environment Configuration
```typescript
// Load configuration
import 'dotenv/config';

const config = {
  twitter: {
    apiKey: process.env.TWITTER_API_KEY,
    enabled: !!process.env.TWITTER_API_KEY
  },
  virustotal: {
    apiKey: process.env.VIRUSTOTAL_API_KEY,
    enabled: !!process.env.VIRUSTOTAL_API_KEY
  },
  dashboard: {
    port: parseInt(process.env.DASHBOARD_PORT || '3000', 10),
    secret: process.env.DASHBOARD_SECRET
  }
};
```

### Runtime Configuration
```typescript
// Custom TLD list
const customTlds = ['.bet', '.casino', '.poker'];
const variants = generateDomainVariants('brand.com', { 
  extensions: customTlds 
});

// Custom similarity thresholds
const isClone = result.visual.diffRatio < 0.1 && 
               (result.dom.tagCosine > 0.8 || result.text.hamming < 16);
```

This API reference provides complete programmatic access to all brand protection features with TypeScript type definitions and practical examples.
