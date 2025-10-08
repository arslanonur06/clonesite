import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    companyName: string;
  };
}

export interface ReportData {
  brand: string;
  baseUrl: string;
  scanId: string;
  timestamp: string;
  summary: {
    totalDomains: number;
    activeDomains: number;
    clones: number;
    highRisk: number;
  };
  domains?: any[];
  threats?: any[];
  mobile?: any[];
  crypto?: any[];
  darkweb?: any[];
  social?: any[];
  whois?: any[];
  ahrefs?: any[];
}

class EnhancedReportGenerator {
  private templates: Map<string, ReportTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Executive Summary Template
    this.templates.set('executive-summary', {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level overview for management and executives',
      sections: ['summary', 'risk-overview', 'key-findings', 'recommendations'],
      branding: {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        companyName: 'Brand Protection Suite'
      }
    });

    // Technical Details Template
    this.templates.set('technical-details', {
      id: 'technical-details',
      name: 'Technical Analysis',
      description: 'Detailed technical analysis for security teams',
      sections: ['summary', 'domain-analysis', 'whois-details', 'ahrefs-metrics', 'threat-intelligence'],
      branding: {
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        companyName: 'Security Operations'
      }
    });

    // Compliance Template
    this.templates.set('compliance-report', {
      id: 'compliance-report',
      name: 'Compliance Report',
      description: 'Regulatory compliance and audit documentation',
      sections: ['summary', 'regulatory-overview', 'domain-compliance', 'legal-actions', 'audit-trail'],
      branding: {
        primaryColor: '#7c3aed',
        secondaryColor: '#8b5cf6',
        companyName: 'Compliance & Legal'
      }
    });

    // Brand Protection Template
    this.templates.set('brand-protection', {
      id: 'brand-protection',
      name: 'Brand Protection Report',
      description: 'Comprehensive brand protection analysis',
      sections: ['summary', 'domain-threats', 'clone-detection', 'social-media', 'mobile-apps'],
      branding: {
        primaryColor: '#dc2626',
        secondaryColor: '#ef4444',
        companyName: 'Brand Protection'
      }
    });
  }

  async generateReport(
    data: ReportData,
    templateId: string = 'executive-summary',
    format: 'pdf' | 'html' | 'csv' = 'pdf'
  ): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    switch (format) {
      case 'pdf':
        return this.generatePdfReport(data, template);
      case 'html':
        return this.generateReportHTML(data, template);
      case 'csv':
        return this.generateCsvReport(data, template);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async generatePdfReport(data: ReportData, template: ReportTemplate): Promise<string> {
    const outputPath = `./temp-reports/${data.brand}-${template.id}-${Date.now()}.pdf`;
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const html = this.generateReportHTML(data, template);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const tmpHtml = outputPath.replace(/\.pdf$/, '.html');
    await fs.writeFile(tmpHtml, html, 'utf8');

    try {
      await page.goto('file://' + tmpHtml, { waitUntil: 'load' });
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });
    } finally {
      await browser.close();
      await fs.unlink(tmpHtml).catch(() => {});
    }

    return outputPath;
  }

  private generateReportHTML(data: ReportData, template: ReportTemplate): string {
    const sections = template.sections.map(section => this.generateSectionHTML(section, data, template)).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${template.name} - ${data.brand}</title>
        <style>
          ${this.getReportStyles(template)}
        </style>
      </head>
      <body>
        ${this.generateHeaderHTML(data, template)}
        <div class="container">
          ${sections}
        </div>
        ${this.generateFooterHTML(data, template)}
      </body>
      </html>
    `;
  }

  private generateSectionHTML(section: string, data: ReportData, template: ReportTemplate): string {
    switch (section) {
      case 'summary':
        return this.generateSummarySection(data, template);
      case 'risk-overview':
        return this.generateRiskOverviewSection(data, template);
      case 'domain-analysis':
        return this.generateDomainAnalysisSection(data, template);
      case 'whois-details':
        return this.generateWhoisDetailsSection(data, template);
      case 'ahrefs-metrics':
        return this.generateAhrefsMetricsSection(data, template);
      case 'threat-intelligence':
        return this.generateThreatIntelligenceSection(data, template);
      case 'key-findings':
        return this.generateKeyFindingsSection(data, template);
      case 'recommendations':
        return this.generateRecommendationsSection(data, template);
      case 'regulatory-overview':
        return this.generateRegulatoryOverviewSection(data, template);
      case 'domain-compliance':
        return this.generateDomainComplianceSection(data, template);
      case 'legal-actions':
        return this.generateLegalActionsSection(data, template);
      case 'audit-trail':
        return this.generateAuditTrailSection(data, template);
      case 'domain-threats':
        return this.generateDomainThreatsSection(data, template);
      case 'clone-detection':
        return this.generateCloneDetectionSection(data, template);
      case 'social-media':
        return this.generateSocialMediaSection(data, template);
      case 'mobile-apps':
        return this.generateMobileAppsSection(data, template);
      default:
        return '';
    }
  }

  private generateSummarySection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>📊 Executive Summary</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Domains</h3>
            <div class="metric-value">${data.summary.totalDomains}</div>
          </div>
          <div class="summary-card">
            <h3>Active Threats</h3>
            <div class="metric-value">${data.summary.activeDomains}</div>
          </div>
          <div class="summary-card">
            <h3>High Risk</h3>
            <div class="metric-value high-risk">${data.summary.highRisk}</div>
          </div>
          <div class="summary-card">
            <h3>Risk Score</h3>
            <div class="metric-value">${Math.round((data.summary.highRisk / Math.max(data.summary.totalDomains, 1)) * 100)}%</div>
          </div>
        </div>
      </div>
    `;
  }

  private generateRiskOverviewSection(data: ReportData, template: ReportTemplate): string {
    const riskLevel = data.summary.highRisk > 5 ? 'Critical' : data.summary.highRisk > 2 ? 'High' : 'Low';

    return `
      <div class="section">
        <h2>⚠️ Risk Assessment</h2>
        <div class="risk-overview">
          <div class="risk-level ${riskLevel.toLowerCase()}">
            <h3>Overall Risk Level: ${riskLevel}</h3>
            <p>${this.getRiskDescription(riskLevel)}</p>
          </div>
        </div>
      </div>
    `;
  }

  private generateDomainAnalysisSection(data: ReportData, template: ReportTemplate): string {
    if (!data.domains || data.domains.length === 0) return '';

    return `
      <div class="section">
        <h2>🌐 Domain Analysis</h2>
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Risk Level</th>
                <th>Registrar</th>
                <th>Creation Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.domains.slice(0, 20).map(domain => `
                <tr>
                  <td>${domain.domain}</td>
                  <td><span class="risk-badge ${domain.riskLevel}">${domain.riskLevel}</span></td>
                  <td>${domain.whois?.registrar || 'N/A'}</td>
                  <td>${domain.whois?.creationDate || 'N/A'}</td>
                  <td>${domain.isRegistered ? 'Active' : 'Available'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private generateWhoisDetailsSection(data: ReportData, template: ReportTemplate): string {
    if (!data.whois || data.whois.length === 0) return '';

    return `
      <div class="section">
        <h2>📋 WHOIS Analysis</h2>
        ${data.whois.map(whois => `
          <div class="whois-card">
            <h3>${whois.domain}</h3>
            <div class="whois-details">
              <p><strong>Risk Level:</strong> <span class="risk-badge ${whois.riskLevel}">${whois.riskLevel}</span></p>
              <p><strong>Registrar:</strong> ${whois.registrar || 'N/A'}</p>
              <p><strong>Creation Date:</strong> ${whois.creationDate || 'N/A'}</p>
              ${whois.riskIndicators ? `<p><strong>Risk Indicators:</strong> ${whois.riskIndicators.join(', ')}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private generateAhrefsMetricsSection(data: ReportData, template: ReportTemplate): string {
    if (!data.ahrefs || data.ahrefs.length === 0) return '';

    return `
      <div class="section">
        <h2>📈 Ahrefs SEO Analysis</h2>
        ${data.ahrefs.map(ahrefs => `
          <div class="ahrefs-card">
            <h3>${ahrefs.domain}</h3>
            <div class="metrics-grid">
              <div class="metric">
                <span class="metric-label">Domain Rating</span>
                <span class="metric-value">${ahrefs.domainRating}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Backlinks</span>
                <span class="metric-value">${ahrefs.backlinks?.toLocaleString() || 0}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Organic Traffic</span>
                <span class="metric-value">${ahrefs.organicTraffic?.toLocaleString() || 0}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Referring Domains</span>
                <span class="metric-value">${ahrefs.referringDomains?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private generateThreatIntelligenceSection(data: ReportData, template: ReportTemplate): string {
    if (!data.threats || data.threats.length === 0) return '';

    return `
      <div class="section">
        <h2>🔍 Threat Intelligence</h2>
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Reputation</th>
                <th>Risk Score</th>
                <th>Categories</th>
              </tr>
            </thead>
            <tbody>
              ${data.threats.map(threat => `
                <tr>
                  <td>${threat.domain}</td>
                  <td><span class="reputation-badge ${threat.reputation}">${threat.reputation}</span></td>
                  <td>${threat.riskScore}/100</td>
                  <td>${threat.categories?.join(', ') || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private generateKeyFindingsSection(data: ReportData, template: ReportTemplate): string {
    const findings = this.extractKeyFindings(data);

    return `
      <div class="section">
        <h2>🔑 Key Findings</h2>
        <div class="findings-list">
          ${findings.map(finding => `
            <div class="finding-item">
              <div class="finding-title">${finding.title}</div>
              <div class="finding-description">${finding.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private generateRecommendationsSection(data: ReportData, template: ReportTemplate): string {
    const recommendations = this.generateRecommendations(data);

    return `
      <div class="section">
        <h2>💡 Recommendations</h2>
        <div class="recommendations">
          ${recommendations.map(rec => `
            <div class="recommendation-item priority-${rec.priority}">
              <div class="recommendation-header">
                <span class="priority-badge ${rec.priority}">${rec.priority.toUpperCase()}</span>
                <h4>${rec.title}</h4>
              </div>
              <p>${rec.description}</p>
              ${rec.actions ? `<ul>${rec.actions.map((action: string) => `<li>${action}</li>`).join('')}</ul>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private getReportStyles(template: ReportTemplate): string {
    return `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        line-height: 1.6;
        color: #374151;
        margin: 0;
        padding: 0;
      }
      .header {
        background: linear-gradient(135deg, ${template.branding.primaryColor} 0%, ${template.branding.secondaryColor} 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
      .header p { margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; }
      .container { padding: 0 30px; }
      .section { margin-bottom: 40px; page-break-inside: avoid; }
      .section h2 {
        color: ${template.branding.primaryColor};
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 10px;
        margin-bottom: 20px;
        font-size: 24px;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 40px;
      }
      .summary-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
      }
      .summary-card h3 {
        margin: 0 0 10px 0;
        color: #64748b;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
      }
      .metric-value {
        font-size: 32px;
        font-weight: 700;
        color: ${template.branding.primaryColor};
        margin: 0;
      }
      .high-risk { color: #dc2626; }
      .risk-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }
      .risk-badge.high { background: #fef2f2; color: #dc2626; }
      .risk-badge.medium { background: #fffbeb; color: #d97706; }
      .risk-badge.low { background: #f0fdf4; color: #059669; }
      .data-table table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .data-table th,
      .data-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
        font-size: 13px;
      }
      .data-table th {
        background: #f1f5f9;
        font-weight: 600;
        color: #475569;
      }
      .footer {
        background: #f8fafc;
        padding: 20px 30px;
        text-align: center;
        color: #64748b;
        font-size: 14px;
        margin-top: 40px;
      }
      @media print {
        .section { page-break-inside: avoid; }
      }
    `;
  }

  private generateHeaderHTML(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="header">
        <h1>${template.name}</h1>
        <p>Brand Protection Analysis for ${data.brand}</p>
        <p style="font-size: 14px; margin-top: 20px;">
          Generated on ${new Date(data.timestamp).toLocaleDateString()} at ${new Date(data.timestamp).toLocaleTimeString()}
        </p>
      </div>
    `;
  }

  private generateFooterHTML(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="footer">
        <p><strong>${template.branding.companyName}</strong> | Report ID: ${data.scanId}</p>
        <p>Generated: ${new Date(data.timestamp).toLocaleString()}</p>
        <p style="font-size: 12px; margin-top: 10px;">This report is confidential and intended for authorized personnel only.</p>
      </div>
    `;
  }

  private generateCsvReport(data: ReportData, template: ReportTemplate): Promise<string> {
    const csvData = this.prepareCsvData(data, template);
    const outputPath = `./temp-reports/${data.brand}-${template.id}-${Date.now()}.csv`;

    // Convert to CSV format
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    return fs.writeFile(outputPath, csvContent, 'utf8').then(() => outputPath);
  }

  private prepareCsvData(data: ReportData, template: ReportTemplate): any[] {
    const csvData: any[] = [];

    // Add domain data
    if (data.domains) {
      data.domains.forEach(domain => {
        csvData.push({
          Type: 'Domain',
          Domain: domain.domain,
          'Risk Level': domain.riskLevel,
          Registrar: domain.whois?.registrar || '',
          'Creation Date': domain.whois?.creationDate || '',
          Status: domain.isRegistered ? 'Registered' : 'Available'
        });
      });
    }

    // Add WHOIS data
    if (data.whois) {
      data.whois.forEach(whois => {
        csvData.push({
          Type: 'WHOIS',
          Domain: whois.domain,
          'Risk Level': whois.riskLevel,
          Registrar: whois.registrar || '',
          'Creation Date': whois.creationDate || '',
          'Risk Indicators': whois.riskIndicators?.join('; ') || ''
        });
      });
    }

    // Add Ahrefs data
    if (data.ahrefs) {
      data.ahrefs.forEach(ahrefs => {
        csvData.push({
          Type: 'Ahrefs',
          Domain: ahrefs.domain,
          'Domain Rating': ahrefs.domainRating,
          Backlinks: ahrefs.backlinks,
          'Organic Traffic': ahrefs.organicTraffic,
          'Referring Domains': ahrefs.referringDomains
        });
      });
    }

    return csvData;
  }

  private extractKeyFindings(data: ReportData): any[] {
    const findings = [];

    if (data.summary.highRisk > 0) {
      findings.push({
        title: 'High-Risk Threats Detected',
        description: `${data.summary.highRisk} high-risk domains require immediate attention.`
      });
    }

    if (data.domains && data.domains.length > data.summary.activeDomains) {
      findings.push({
        title: 'Inactive Domains Identified',
        description: `${data.domains.length - data.summary.activeDomains} domains are available for registration.`
      });
    }

    if (data.threats && data.threats.some(t => t.reputation === 'malicious')) {
      findings.push({
        title: 'Malicious Domains Found',
        description: 'One or more domains have been identified as malicious by threat intelligence sources.'
      });
    }

    return findings;
  }

  private generateRecommendations(data: ReportData): any[] {
    const recommendations = [];

    if (data.summary.highRisk > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Investigate High-Risk Domains',
        description: 'Immediately investigate and take action on all high-risk domains identified in this report.',
        actions: [
          'Review domain ownership and legitimacy',
          'Check for trademark infringement',
          'Consider legal action if necessary'
        ]
      });
    }

    recommendations.push({
      priority: 'medium',
      title: 'Implement Monitoring',
      description: 'Set up automated monitoring for new domain registrations and changes.',
      actions: [
        'Configure domain monitoring alerts',
        'Set up regular scan schedules',
        'Monitor for new suspicious domains'
      ]
    });

    recommendations.push({
      priority: 'low',
      title: 'Enhance Brand Protection',
      description: 'Strengthen overall brand protection strategy.',
      actions: [
        'Register defensive domain variations',
        'Implement DNS monitoring',
        'Establish brand usage guidelines'
      ]
    });

    return recommendations;
  }

  private getRiskDescription(level: string): string {
    switch (level) {
      case 'Critical':
        return 'Immediate action required. Multiple high-risk threats detected that pose significant risk to brand reputation and security.';
      case 'High':
        return 'Several concerning indicators detected. Enhanced monitoring and investigation recommended.';
      case 'Low':
        return 'No significant threats detected. Continue regular monitoring as part of standard security practices.';
      default:
        return 'Risk level assessment in progress.';
    }
  }

  // Placeholder methods for other sections
  private generateRegulatoryOverviewSection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>📋 Regulatory Compliance</h2>
        <p>This section would contain regulatory compliance information for iGaming operators.</p>
      </div>
    `;
  }

  private generateDomainComplianceSection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>🔒 Domain Compliance</h2>
        <p>Detailed compliance analysis for domain registrations and usage.</p>
      </div>
    `;
  }

  private generateLegalActionsSection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>⚖️ Legal Actions</h2>
        <p>Recommended legal actions and procedures for identified threats.</p>
      </div>
    `;
  }

  private generateAuditTrailSection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>📝 Audit Trail</h2>
        <p>Complete audit trail of all scans and actions taken.</p>
      </div>
    `;
  }

  private generateDomainThreatsSection(data: ReportData, template: ReportTemplate): string {
    return this.generateDomainAnalysisSection(data, template);
  }

  private generateCloneDetectionSection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>🔍 Clone Detection</h2>
        <p>Analysis of website cloning and content similarity threats.</p>
      </div>
    `;
  }

  private generateSocialMediaSection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>📱 Social Media Monitoring</h2>
        <p>Social media brand protection and threat monitoring results.</p>
      </div>
    `;
  }

  private generateMobileAppsSection(data: ReportData, template: ReportTemplate): string {
    return `
      <div class="section">
        <h2>📱 Mobile App Security</h2>
        <p>Mobile application security analysis and threat assessment.</p>
      </div>
    `;
  }
}

export function createEnhancedReportGenerator(): EnhancedReportGenerator {
  return new EnhancedReportGenerator();
}

export { EnhancedReportGenerator };

