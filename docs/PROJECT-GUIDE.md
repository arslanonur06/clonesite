# iGaming Brand Protection Platform - Project Guide

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Development Guide](#development-guide)
5. [Features](#features)
6. [API Documentation](#api-documentation)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Project Overview

The iGaming Brand Protection Platform is an enterprise-grade security solution designed specifically for the online gaming industry. It provides comprehensive brand monitoring, threat detection, and automated response capabilities.

### Key Capabilities

- **8 Core Protection Modules**: Domain monitoring, visual AI, mobile apps, crypto threats, dark web, threat intel, social media, and legal automation
- **26 iGaming-Specific Tools**: Professional tools for gaming operators
- **Real-time Dashboard**: Modern React-based interface with WebSocket updates
- **Automated Reporting**: Professional PDF reports for stakeholders

## Architecture

### Technology Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: SQLite with Better-SQLite3
- **Real-time**: WebSocket (ws)
- **Web Automation**: Playwright
- **Build Tools**: Vite, TSC

### Project Structure

```
igaming-protection/
├── src/                      # Backend source code
│   ├── cli.ts               # Command-line interface
│   ├── web-server.ts        # Express web server
│   ├── config/              # Configuration management
│   │   └── index.ts         # Centralized config
│   └── lib/                 # Core libraries
│       ├── variants.ts      # Domain variant generation
│       ├── monitor.ts       # Visual monitoring
│       ├── performance.ts   # Performance utilities
│       └── ...             # Other modules
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── MainDashboard.tsx
│   │   │   ├── BrandScanner.tsx
│   │   │   └── ...
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript types
│   └── dist/               # Frontend build output
├── docs/                    # Documentation
├── data/                    # Database files
└── dist/                    # Backend build output
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Chrome/Chromium (auto-installed by Playwright)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd igaming-protection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Build the project**
   ```bash
   ./build-production.sh
   ```

### Quick Start

**Development Mode:**
```bash
./start-dev.sh
```

**Production Mode:**
```bash
npm start
```

**Web Interface Only:**
```bash
npm run web
```

## Development Guide

### Running in Development

1. **Start the development server**
   ```bash
   ./start-dev.sh
   ```
   This starts both backend and frontend with hot reloading.

2. **Access the application**
   - Dashboard: http://localhost:3000
   - Scanner: http://localhost:3000/scanner
   - Tools: http://localhost:3000/igaming-tools

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS with utility-first approach
- **Linting**: ESLint configuration included

### Testing

```bash
# Run tests (when implemented)
npm test

# Run specific test
npm test -- --grep "domain variants"
```

### Building for Production

```bash
# Full production build
./build-production.sh

# Backend only
npm run build

# Frontend only
cd frontend && npm run build
```

## Features

### 1. Domain Monitoring

Detects typosquatting and domain variants using advanced algorithms:

- **Pattern Generation**: 2000+ variations
- **TLD Coverage**: 50+ extensions
- **Real-time Checking**: DNS and WHOIS verification

```typescript
// Example usage
import { generateDomainVariants } from './lib/variants';

const variants = generateDomainVariants('yourbrand.com');
```

### 2. Visual AI Detection

Computer vision for logo and website similarity:

- **Screenshot Comparison**: Pixel-level analysis
- **Logo Detection**: AI-powered similarity scoring
- **DOM Analysis**: Structure comparison

### 3. Mobile App Monitoring

Surveillance of app stores for brand impersonation:

- **iOS App Store**: Automated searching
- **Google Play**: Package analysis
- **Icon Comparison**: Visual similarity detection

### 4. Threat Intelligence

Multi-source reputation and threat analysis:

- **VirusTotal**: Malware detection
- **URLVoid**: URL reputation
- **Shodan**: Infrastructure analysis

### 5. Social Media Monitoring

Real-time social platform surveillance:

- **Twitter/X**: API integration
- **Telegram**: Public channel monitoring
- **Email Security**: DMARC/SPF verification

### 6. Dark Web Monitoring

Underground threat detection:

- **Credential Leaks**: Breach database monitoring
- **Forums**: Cybercrime discussion tracking
- **Tor Network**: Dark web searching

### 7. Cryptocurrency Threats

Blockchain and crypto-related threat detection:

- **Fake Exchanges**: Fraudulent platform detection
- **Wallet Phishing**: Seed phrase scams
- **Blockchain Domains**: .crypto, .eth monitoring

### 8. Legal Automation

Automated takedown and evidence collection:

- **DMCA Notices**: Automated generation
- **Evidence Collection**: Screenshot archival
- **Abuse Contacts**: WHOIS extraction

## API Documentation

### REST Endpoints

#### Start Scan
```http
POST /api/scan/start
Content-Type: application/json

{
  "brand": "example",
  "baseUrl": "https://example.com",
  "features": ["typosquatting", "visual-ai"],
  "sequence": "example123.com",
  "logoUrl": "https://example.com/logo.png"
}
```

#### Get Scan Status
```http
GET /api/scan/:scanId
```

#### Export Report
```http
GET /api/scan/:scanId/export
```

#### Get Metrics
```http
GET /api/metrics
```

### WebSocket Events

Connect to `ws://localhost:3000` for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle scan_progress, scan_complete, etc.
};
```

## Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/web-server.js"]
```

### Environment Variables

Required for production:

```env
NODE_ENV=production
PORT=3000
DB_PATH=./data/monitor.db

# API Keys (optional but recommended)
TWITTER_API_KEY=xxx
VIRUSTOTAL_API_KEY=xxx
URLVOID_API_KEY=xxx
SHODAN_API_KEY=xxx
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### Database Lock Error
```bash
# Remove lock files
rm data/*.db-shm data/*.db-wal
```

#### Playwright Installation
```bash
# Manual installation
npx playwright install chromium
```

#### Memory Issues
```bash
# Run with increased memory
node --max-old-space-size=4096 dist/web-server.js
```

### Performance Optimization

1. **Limit concurrent operations**
   ```env
   DEFAULT_SCAN_CONCURRENCY=25
   MAX_DOMAINS_PER_SCAN=250
   ```

2. **Enable caching**
   - Results are cached for 60 seconds by default
   - Adjust cache TTL in config

3. **Use production build**
   - Always use `npm run build` for production
   - Enable NODE_ENV=production

### Logging

Enable debug logging:
```bash
DEBUG=* npm start
```

View logs:
```bash
tail -f logs/app.log
```

## Support

For issues and questions:

1. Check the [documentation](./docs/)
2. Review [common issues](#troubleshooting)
3. Open an issue on GitHub
4. Contact support@example.com

## License

MIT License - see [LICENSE](../LICENSE) for details