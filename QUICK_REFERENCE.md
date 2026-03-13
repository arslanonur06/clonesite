# iGaming Security Suite - Quick Reference

## Access Points

| Page | URL | Features |
|------|-----|----------|
| **Main Dashboard** | `http://localhost:3000` | Overview, Stats, All Tool Navigation |
| **Turkey Market Dashboard** | `http://localhost:3000/turkey-dashboard.html` | BTK, Payments, Competitors, Regulatory |
| **Brand Protection** | `http://localhost:3000/brand-protection.html` | Clone Detection, WHOIS, Ahrefs |
| **Bonus Comparison** | `http://localhost:3000/bonus-comparison.html` | Competitor Bonus Analysis |
| **Player Analytics & CRM** | `http://localhost:3000/player-analytics.html` | Segments, VIP, Tournaments, Games |
| **Compliance Center** | `http://localhost:3000/compliance-center.html` | KVKK, BTK, License, Responsible Gaming |
| **Financial Monitoring** | `http://localhost:3000/financial-monitoring.html` | Fraud, AML, KYC, Transactions, Revenue |

## Turkey-Specific API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/turkey/market-dashboard` | POST | Turkey market overview + KPIs |
| `/api/turkey/btk-compliance` | POST | BTK/RTUK domain blocking status |
| `/api/turkey/payment-methods` | POST | Papara/Payfix/EFT/Crypto analysis |
| `/api/turkey/kvkk-compliance` | POST | Turkish GDPR compliance check |
| `/api/turkey/domain-monitoring` | POST | Domain rotation tracking |
| `/api/turkey/social-media` | POST | Telegram/Twitter/Instagram monitoring |
| `/api/turkey/market-analysis` | POST | Market size & competitor analysis |
| `/api/turkey/competitor-intelligence` | POST | Detailed competitor tracking |
| `/api/turkey/sports-betting` | POST | Super Lig & betting markets |
| `/api/turkey/revenue-intelligence` | POST | Revenue streams & projections |
| `/api/turkey/advertising-monitor` | POST | Turkish ad channel monitoring |
| `/api/turkey/player-behavior` | POST | Turkish player segment analysis |
| `/api/turkey/bonus-strategy` | POST | Bonus structure optimization |
| `/api/turkey/comprehensive-report` | POST | Full Turkey market report |
| `/api/turkey/regulatory-tracker` | GET | Regulatory change tracking |

## Core API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/scan/start` | POST | Start brand scan |
| `/api/igaming/bonus-comparison` | POST | Compare bonuses |
| `/api/brand-protection/fake-domain-check` | POST | Check fake domains |
| `/api/brand-protection/clone-detection` | POST | Detect clones |
| `/api/igaming/affiliate-monitor` | POST | Affiliate tracking |
| `/api/igaming/license-verify` | POST | Gaming license check |
| `/api/igaming/payment-analysis` | POST | Payment method analysis |
| `/api/igaming/responsible-gaming` | POST | RG compliance check |
| `/api/igaming/geo-compliance` | POST | Geo-blocking check |
| `/api/igaming/security-analysis` | POST | Security analysis |
| `/api/igaming/fraud-detection` | POST | Fraud alerts |
| `/api/igaming/aml-monitoring` | POST | AML alerts |
| `/api/igaming/kyc-verification` | POST | KYC status |
| `/api/igaming/transaction-monitoring` | POST | Transaction tracking |
| `/api/igaming/chargeback-prevention` | POST | Chargeback analytics |
| `/api/igaming/risk-assessment` | POST | Risk scoring |
| `/api/igaming/player-behavior` | POST | Player analytics |
| `/api/igaming/player-segmentation` | POST | Segment analysis |
| `/api/igaming/vip-players` | POST | VIP management |
| `/api/igaming/tournaments` | POST | Tournament system |
| `/api/igaming/loyalty-programs` | POST | Loyalty programs |
| `/api/igaming/game-performance` | POST | Game analytics |
| `/api/igaming/game-fairness` | POST | RTP verification |
| `/api/igaming/marketing-campaigns` | POST | Campaign analytics |
| `/api/igaming/compliance-monitor` | POST | Regulatory compliance |
| `/api/ahrefs/domain-analysis` | POST | SEO analysis |
| `/api/whois/enhanced-check` | POST | WHOIS lookup |
| `/api/reports/generate` | POST | Generate PDF |

## Complete Tool List (40+ Tools)

### Turkey-Specific (15 Tools)
1. BTK/RTUK Compliance Monitor
2. KVKK (Turkish GDPR) Checker
3. Turkish Payment Methods (Papara/Payfix/EFT)
4. Domain Rotation Tracker
5. Telegram Channel Monitor
6. Turkish Market Analysis
7. Competitor Intelligence
8. Super Lig Betting Monitor
9. Revenue Intelligence
10. Turkish Advertising Monitor
11. Turkish Player Behavior Analysis
12. Bonus Strategy Optimizer
13. Regulatory Change Tracker
14. Turkish Social Media Monitor
15. Comprehensive Turkey Report

### Brand Protection (10 Tools)
1. Domain Variant Detection (1000+ per brand)
2. Clone Site Detection (Visual + Content)
3. Enhanced WHOIS Analysis
4. Ahrefs SEO Analysis
5. Visual Comparison (AI-powered)
6. Certificate Transparency Logs
7. Dark Web Monitoring
8. Crypto Threat Monitoring
9. DMCA Takedown Automation
10. Threat Intelligence

### Financial & Compliance (15+ Tools)
1. Fraud Detection & Prevention
2. AML Monitoring
3. KYC Verification
4. Transaction Monitoring
5. Chargeback Prevention
6. Risk Assessment Engine
7. Payment Method Analysis
8. Gaming License Verification
9. Responsible Gaming Compliance
10. Geo-Blocking Compliance
11. Game Fairness (RTP Verification)
12. Affiliate Monitoring
13. Odds Manipulation Detection
14. Security Analysis
15. Customer Support Analysis

### Player & CRM Tools
1. Player Behavior Analytics
2. Player Segmentation
3. VIP Player Management
4. Tournament Management
5. Live Dealer Management
6. Loyalty Programs
7. Game Performance Analytics
8. Marketing Campaign Analytics

### Automation & Reporting
1. Scheduled Scanning
2. Alert Rules Engine
3. Telegram Integration
4. PDF Report Generation
5. Google Sheets Export
6. Batch Processing
7. WebSocket Real-time Updates

## Quick Start

```bash
# Start the server
npm run web

# Build the project
npm run build

# Run in development mode
npx tsx src/web-server.ts
```

## Level Bar Color Coding

| Range | Color | Meaning |
|-------|-------|---------|
| **90-100%** | Red | High Risk - Immediate Action |
| **80-89%** | Yellow | Medium Risk - Monitor |
| **0-79%** | Green | Low Risk - Safe |

## Brand Configuration
- Brand: **suratbet**
- Official redirect: **https://t2m.io/telg**
- Agency: **jelibon marketing**
- Target market: **Turkey**
