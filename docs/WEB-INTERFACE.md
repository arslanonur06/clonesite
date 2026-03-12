# Web Interface Documentation

## 🌐 React Dashboard for Brand Protection

The web interface provides a user-friendly way to monitor any brand or domain using all 8 advanced protection features through a beautiful React dashboard.

## 🚀 Getting Started

### Quick Start
```bash
# Clone and setup
git clone <repository>
cd clonesite

# Start web interface (handles all setup)
./start-web.sh

# Visit dashboard
open http://localhost:3000
```

### Manual Setup
```bash
# Install dependencies
npm install

# Build frontend
cd frontend && npm install && npm run build && cd ..

# Start server
tsx src/web-server.ts
```

## 📱 Interface Overview

### 1. Dashboard Home
- **Overview metrics**: Total scans, active threats, risk scores
- **Feature showcase**: All 8 protection capabilities explained
- **Quick actions**: Start new scans, view analytics, manage alerts
- **Connection status**: Real-time WebSocket connection indicator

### 2. Scan Form
**Universal Brand Input**: Works with ANY brand or domain
- **Brand Information**: Name and official website URL
- **Advanced Options**: Sequence patterns, CT log days, logo URL
- **Feature Selection**: Choose from 8 monitoring types:
  - 🌐 Domain Typosquatting (2-5 min)
  - 👁️ Visual AI Detection (5-10 min)  
  - 📱 Mobile App Monitoring (3-7 min)
  - ₿ Cryptocurrency Threats (2-4 min)
  - 🕵️ Dark Web Monitoring (5-15 min)
  - 🔍 Threat Intelligence (1-3 min)
  - 📺 Social Media Threats (2-5 min)
  - ⚖️ Legal Automation (1-2 min)

### 3. Results Dashboard
- **Real-time progress**: Live scan updates via WebSocket
- **Summary metrics**: Domains found, clones detected, risk levels
- **Detailed results**: Expandable threat categories
- **Interactive tables**: Sortable, filterable threat data
- **Export options**: PDF reports, JSON data

## 🔧 Technical Architecture

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── ScanForm.tsx       # Universal scan form
│   │   └── Results.tsx        # Results display
│   ├── hooks/
│   │   └── useWebSocket.tsx   # Real-time updates
│   ├── types/
│   │   └── index.ts           # TypeScript definitions
│   └── App.tsx                # Main app component
├── public/                    # Static assets
└── package.json               # Frontend dependencies
```

### Backend (Node.js + Express)
```
src/
├── web-server.ts              # Express server + WebSocket
├── lib/                       # All monitoring libraries
└── cli.ts                     # CLI commands (still available)
```

## 🌐 API Endpoints

### Scan Management
- `POST /api/scan/start` - Start new scan
- `GET /api/scan/:scanId` - Get scan details
- `GET /api/scans` - List all scans

### WebSocket Events
- `scan_progress` - Real-time progress updates
- `scan_complete` - Scan completion notification
- `scan_error` - Error notifications
- `metrics_update` - Dashboard metrics updates

## 📊 Example Usage

### 1. Monitor Any Brand
```typescript
// Example scan request
{
  "brand": "microsoft",
  "baseUrl": "https://microsoft.com",
  "features": ["typosquatting", "mobile-apps", "crypto"],
  "sequence": "microsoft365.com",
  "range": 5,
  "ctDays": 30,
  "logoUrl": "https://microsoft.com/logo.png"
}
```

### 2. Real-Time Updates
```javascript
// WebSocket connection
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === 'scan_progress') {
    updateProgressBar(data.progress);
  }
};
```

## 🎨 UI Components

### Responsive Design
- **Desktop**: Full-featured dashboard with side navigation
- **Tablet**: Collapsible menus, touch-friendly controls
- **Mobile**: Single-column layout, optimized forms

### Visual Elements
- **Progress Bars**: Real-time scan progress indication
- **Risk Badges**: Color-coded threat level indicators
- **Interactive Charts**: Threat distribution visualization
- **Status Icons**: Connection status, scan status
- **Feature Cards**: Monitoring capability showcase

## 🔍 Monitoring Features

### Universal Brand Support
The web interface works with **any brand or domain**:

**Examples**:
- `google` + `https://google.com`
- `apple` + `https://apple.com`  
- `yourstartup` + `https://yourstartup.io`
- `localbusiness` + `https://localbusiness.com`

### Feature Selection
Users can choose any combination of the 8 monitoring types:

1. **Domain Typosquatting**: 50+ TLD coverage, 2000+ patterns
2. **Visual AI Detection**: Logo similarity, design analysis
3. **Mobile App Monitoring**: iOS/Android app store scanning
4. **Cryptocurrency Threats**: Fake exchanges, wallet phishing
5. **Dark Web Monitoring**: Underground forums, credential leaks
6. **Threat Intelligence**: Multi-source reputation analysis
7. **Social Media Threats**: Twitter, Telegram monitoring
8. **Legal Automation**: Evidence collection, takedown prep

## 📈 Performance

### Optimizations
- **Parallel Processing**: Multiple features run concurrently
- **Progress Streaming**: Real-time updates via WebSocket
- **Result Caching**: Avoid duplicate API calls
- **Lazy Loading**: Components load as needed

### Scalability
- **Concurrent Scans**: Multiple brands can be monitored simultaneously
- **Background Processing**: Non-blocking scan execution
- **Memory Management**: Efficient resource usage
- **Error Recovery**: Graceful failure handling

## 🔐 Security

### Data Protection
- **Input Validation**: All form inputs sanitized
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure API key management

### Privacy
- **No Data Persistence**: Scan results stored temporarily
- **Optional Logging**: Configurable audit trails
- **Local Processing**: No external data sharing

## 🛠️ Development

### Local Development
```bash
# Start backend server
tsx src/web-server.ts

# Start frontend dev server (in another terminal)
cd frontend && npm run dev
```

### Building for Production
```bash
# Build everything
npm run build

# Start production server
npm start
```

### Environment Configuration
```bash
# Required for full functionality
TWITTER_API_KEY=your_twitter_key
VIRUSTOTAL_API_KEY=your_virustotal_key
URLVOID_API_KEY=your_urlvoid_key
SHODAN_API_KEY=your_shodan_key

# Optional for alerts
TG_BOT_TOKEN=your_telegram_bot
TG_CHAT_ID=your_chat_id
ENABLE_TG_ALERT=1
```

## 🚀 Deployment Options

### Local Deployment
```bash
./start-web.sh
```

### Docker Deployment
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Heroku**: Direct deployment support
- **Vercel**: Frontend + serverless functions
- **AWS/GCP**: Container or VM deployment
- **DigitalOcean**: App platform deployment

## 📚 Additional Resources

- **[API Reference](API-REFERENCE.md)**: Complete API documentation
- **[Feature Guide](FEATURES.md)**: Detailed feature explanations
- **[CLI Usage](monitoring-guide.md)**: Command-line interface guide
- **[Changelog](CHANGELOG.md)**: Version history and updates

## 🎯 Use Cases

### Enterprise Security Teams
- Monitor corporate brand across all platforms
- Generate executive reports with visual evidence
- Automate legal takedown processes
- Track threat trends over time

### Brand Protection Agencies
- Offer monitoring services to multiple clients
- Provide real-time threat detection
- Generate professional client reports
- Scale monitoring across many brands

### Individual Businesses
- Protect personal or business brand
- Monitor competitors and market threats
- Detect phishing and fraud attempts
- Maintain online reputation

The web interface makes advanced brand protection accessible to anyone, regardless of technical expertise.

---

## Brand Note
This documentation is configured for **suratbet** with official redirect URL **https://t2m.io/telg**.
Brand owner/agency: **jelibon marketing**.
