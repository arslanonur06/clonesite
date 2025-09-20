# 🛡️ iGaming Brand Protection Platform

**Enterprise-grade brand monitoring and protection system specifically designed for the iGaming industry**

<div align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-100%25-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Status-Production_Ready-success" alt="Status">
</div>

## 🎯 Overview

The iGaming Brand Protection Platform is a comprehensive security solution that monitors, detects, and helps mitigate brand threats across multiple channels. Built specifically for online casinos, sports betting platforms, and gaming operators, it provides real-time threat detection and automated response capabilities.

## ✨ Key Features

### 🔍 **8 Core Protection Modules**

1. **Domain Typosquatting Detection** - 2000+ pattern variations across 50+ TLDs
2. **Visual AI Analysis** - Logo and website clone detection using computer vision
3. **Mobile App Monitoring** - iOS and Android app store surveillance
4. **Cryptocurrency Threat Detection** - Fake exchanges and wallet phishing
5. **Dark Web Monitoring** - Underground forums and credential leak detection
6. **Threat Intelligence** - Multi-source reputation and malware analysis
7. **Social Media Monitoring** - Twitter/X and Telegram threat detection
8. **Legal Automation** - Automated takedown request generation

### 🎰 **26 iGaming-Specific Tools**

Professional tools designed for gaming operators, including:
- Affiliate link monitoring
- Gaming license verification
- Payment method analysis
- Responsible gaming compliance
- Bonus abuse detection
- Geo-blocking compliance
- Odds manipulation detection
- And 19 more specialized tools...

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Chrome/Chromium browser (auto-installed)
- Optional: API keys for enhanced features (see [Configuration](#configuration))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd igaming-protection

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Build the project
npm run build
```

### Running the Platform

#### Web Interface (Recommended)

```bash
# Start the web server
npm run web

# Or use the start script
./start-web.sh

# Access the dashboard
open http://localhost:3000
```

#### Command Line Interface

```bash
# Basic domain check
npm run dev check example.com

# Comprehensive scan
npm run dev ultimate-scan https://example.com example

# View all commands
npm run dev --help
```

## 📊 Web Dashboard

The modern React-based dashboard provides:

- **Real-time Monitoring** - Live threat detection with WebSocket updates
- **Universal Brand Input** - Monitor any brand or domain
- **Interactive Results** - Visual threat analysis and reporting
- **Professional Reports** - Export detailed PDF reports
- **Responsive Design** - Works on desktop, tablet, and mobile

### Dashboard Features

- **Overview Dashboard** - Key metrics and threat summary
- **Brand Scanner** - Comprehensive brand protection analysis
- **iGaming Tools** - Access to all 26 professional tools
- **Report Generation** - Professional PDF reports for stakeholders

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required for full functionality
TWITTER_API_KEY=your_key
VIRUSTOTAL_API_KEY=your_key
URLVOID_API_KEY=your_key
SHODAN_API_KEY=your_key

# Optional
TG_BOT_TOKEN=your_bot_token
TG_CHAT_ID=your_chat_id
DASHBOARD_SECRET=your_secret
```

### API Keys

While the platform works without API keys, certain features require them:

| Service | Purpose | Required For |
|---------|---------|--------------|
| Twitter API | Social media monitoring | Social threats detection |
| VirusTotal | Malware detection | Threat intelligence |
| URLVoid | URL reputation | Domain analysis |
| Shodan | Infrastructure analysis | Security assessment |

## 📖 Documentation

- [API Reference](docs/API-REFERENCE.md) - Complete API documentation
- [Features Guide](docs/FEATURES.md) - Detailed feature descriptions
- [Monitoring Guide](docs/monitoring-guide.md) - Best practices
- [Web Interface Guide](docs/WEB-INTERFACE.md) - Dashboard usage
- [Changelog](docs/CHANGELOG.md) - Version history

## 🎮 Use Cases

### Online Casinos
- Monitor for fake casino sites
- Detect unauthorized use of game content
- Track affiliate fraud
- Ensure regulatory compliance

### Sports Betting
- Detect odds manipulation
- Monitor for fake betting apps
- Track unauthorized live streams
- Protect brand reputation

### Gaming Software Providers
- Protect game IP and content
- Monitor partner compliance
- Detect pirated games
- Track brand usage

## 🏗️ Project Structure

```
igaming-protection/
├── src/                  # Source code
│   ├── cli.ts           # CLI interface
│   ├── web-server.ts    # Web server
│   └── lib/             # Core libraries
├── frontend/            # React dashboard
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # React hooks
│       └── types/       # TypeScript types
├── docs/                # Documentation
├── data/                # Database files
└── dist/                # Build output
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

For security issues, please email security@example.com instead of using the issue tracker.

## 🙏 Acknowledgments

- Built with TypeScript, React, and Node.js
- Uses Playwright for web automation
- Powered by various threat intelligence APIs

## 📞 Support

- **Documentation**: [Full Docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourrepo/issues)
- **Email**: support@example.com

---

<div align="center">
  <strong>Built for the iGaming Industry</strong><br>
  Protecting brands, players, and revenue
</div>