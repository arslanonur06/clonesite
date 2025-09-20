import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
export async function generateIGamingPdfReport(reportData, outPdfPath) {
    await fs.mkdir(path.dirname(outPdfPath), { recursive: true });
    // Create professional iGaming-focused HTML template
    const html = generateIGamingReportHTML(reportData);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const tmpHtml = path.resolve(outPdfPath.replace(/\.pdf$/, '.html'));
    await fs.writeFile(tmpHtml, html, 'utf8');
    try {
        await page.goto('file://' + tmpHtml, { waitUntil: 'load' });
        await page.pdf({
            path: path.resolve(outPdfPath),
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            }
        });
    }
    finally {
        await browser.close();
        // Clean up temp HTML file
        await fs.unlink(tmpHtml).catch(() => { });
    }
    return outPdfPath;
}
function generateIGamingReportHTML(data) {
    const riskColor = (level) => {
        switch (level) {
            case 'critical': return '#dc2626';
            case 'high': return '#ea580c';
            case 'medium': return '#d97706';
            case 'low': return '#65a30d';
            default: return '#6b7280';
        }
    };
    const riskBadge = (level) => `
    <span style="background: ${riskColor(level)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
      ${level.toUpperCase()}
    </span>
  `;
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Brand Protection Report - ${data.brand}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #374151;
          margin: 0;
          padding: 0;
        }
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; }
        .container { padding: 0 30px; }
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
        .summary-card h3 { margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; }
        .summary-card .number { font-size: 32px; font-weight: 700; color: #1e40af; margin: 0; }
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section h2 { 
          color: #1e40af; 
          border-bottom: 2px solid #e2e8f0; 
          padding-bottom: 10px; 
          margin-bottom: 20px;
          font-size: 24px;
        }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        th { background: #f1f5f9; font-weight: 600; color: #475569; }
        .domain-cell { font-family: 'Monaco', 'Menlo', monospace; font-size: 12px; }
        .footer {
          background: #f8fafc;
          padding: 20px 30px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
          margin-top: 40px;
        }
        .igaming-notice {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .igaming-notice h3 {
          color: #92400e;
          margin: 0 0 10px 0;
          display: flex;
          align-items: center;
        }
        .igaming-notice p { margin: 0; color: #78350f; }
        .threat-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          page-break-inside: avoid;
        }
        .threat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .executive-summary {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .risk-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        .risk-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
        }
        @media print {
          .section { page-break-inside: avoid; }
          .threat-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛡️ Brand Protection Report</h1>
        <p>Comprehensive Security Analysis for ${data.brand}</p>
        <p style="font-size: 14px; margin-top: 20px;">Generated on ${new Date(data.timestamp).toLocaleDateString()} at ${new Date(data.timestamp).toLocaleTimeString()}</p>
      </div>

      <div class="container">
        <div class="executive-summary">
          <h3 style="color: #0369a1; margin: 0 0 15px 0;">📊 Executive Summary</h3>
          <p><strong>Brand:</strong> ${data.brand}</p>
          <p><strong>Base URL:</strong> ${data.baseUrl}</p>
          <p><strong>Scan Completed:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
          <p><strong>Risk Assessment:</strong> ${(data.summary?.highRisk || 0) > 5 ? 'HIGH RISK' : (data.summary?.highRisk || 0) > 2 ? 'MEDIUM RISK' : 'LOW RISK'}</p>
        </div>

        <div class="igaming-notice">
          <h3>🎰 iGaming Industry Security Alert</h3>
          <p>This report provides comprehensive brand protection analysis specifically designed for iGaming operators. 
          Domain spoofing and brand impersonation pose significant regulatory and financial risks in the gaming industry.</p>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Domains Scanned</h3>
            <p class="number">${data.summary?.totalDomains || 0}</p>
          </div>
          <div class="summary-card">
            <h3>Active Threats</h3>
            <p class="number">${data.summary?.activeDomains || 0}</p>
          </div>
          <div class="summary-card">
            <h3>Potential Clones</h3>
            <p class="number">${data.summary?.clones || 0}</p>
          </div>
          <div class="summary-card">
            <h3>High Risk</h3>
            <p class="number">${data.summary?.highRisk || 0}</p>
          </div>
        </div>

        <div class="section">
          <h2>⚠️ Risk Assessment Matrix</h2>
          <div class="risk-matrix">
            <div class="risk-item">
              <strong>Domain Threats:</strong> ${(data.domains || []).filter((d) => d.riskLevel === 'high').length} High Risk
            </div>
            <div class="risk-item">
              <strong>Mobile Threats:</strong> ${(data.mobile || []).filter((m) => m.riskLevel === 'high').length} High Risk Apps
            </div>
            <div class="risk-item">
              <strong>Crypto Threats:</strong> ${(data.crypto || []).filter((c) => c.riskLevel === 'high').length} High Risk
            </div>
            <div class="risk-item">
              <strong>Overall Status:</strong> ${(data.summary?.highRisk || 0) === 0 ? '🟢 Secure' : (data.summary?.highRisk || 0) > 5 ? '🔴 Critical' : '🟡 Monitoring Required'}
            </div>
          </div>
        </div>

        ${data.domains && data.domains.length > 0 ? `
        <div class="section">
          <h2>🌐 Domain Threats Analysis</h2>
          <p><strong>Total Domains Found:</strong> ${data.domains.length} | <strong>High Risk:</strong> ${data.domains.filter((d) => d.riskLevel === 'high').length}</p>
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Registrar</th>
                <th>Creation Date</th>
                <th>Action Required</th>
              </tr>
            </thead>
            <tbody>
              ${data.domains.slice(0, 50).map((domain) => `
                <tr>
                  <td class="domain-cell">${domain.domain}</td>
                  <td>${riskBadge(domain.riskLevel)}</td>
                  <td>${domain.isRegistered ? '🟢 Registered' : '⚪ Available'}</td>
                  <td>${domain.whois?.registrar || 'N/A'}</td>
                  <td>${domain.whois?.creationDate || 'N/A'}</td>
                  <td>${domain.riskLevel === 'high' ? '🚨 Investigate' : domain.riskLevel === 'medium' ? '👀 Monitor' : '✅ Safe'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${data.domains.length > 50 ? `<p><em>Showing top 50 results. Total found: ${data.domains.length}</em></p>` : ''}
        </div>
        ` : ''}

        ${data.mobile && data.mobile.length > 0 ? `
        <div class="section">
          <h2>📱 Mobile App Security Threats</h2>
          <p><strong>Suspicious Apps Found:</strong> ${data.mobile.length}</p>
          ${data.mobile.map((app) => `
            <div class="threat-card">
              <div class="threat-header">
                <strong>📱 ${app.name}</strong>
                ${riskBadge(app.riskLevel)}
              </div>
              <p><strong>Platform:</strong> ${app.platform.toUpperCase()}</p>
              <p><strong>Developer:</strong> ${app.developer}</p>
              <p><strong>Store URL:</strong> <span style="font-family: monospace; font-size: 12px;">${app.storeUrl || 'N/A'}</span></p>
              <p><strong>Suspicious Indicators:</strong> ${app.suspiciousReasons.join(', ')}</p>
              <p><strong>Recommended Action:</strong> ${app.riskLevel === 'high' ? '🚨 Report to app store immediately' : '👀 Continue monitoring'}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${data.crypto && data.crypto.length > 0 ? `
        <div class="section">
          <h2>₿ Cryptocurrency & Blockchain Threats</h2>
          <p><strong>Crypto Threats Detected:</strong> ${data.crypto.length}</p>
          ${data.crypto.map((threat) => `
            <div class="threat-card">
              <div class="threat-header">
                <strong>₿ ${threat.domain}</strong>
                ${riskBadge(threat.riskLevel)}
              </div>
              <p><strong>Threat Type:</strong> ${threat.type.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Risk Indicators:</strong> ${threat.indicators.join(', ')}</p>
              <p><strong>Impact:</strong> ${threat.type === 'fake_exchange' ? 'Player funds at risk' : threat.type === 'phishing_wallet' ? 'Credential theft risk' : 'Investment fraud risk'}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${data.threats && data.threats.length > 0 ? `
        <div class="section">
          <h2>🔍 Threat Intelligence Analysis</h2>
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Reputation</th>
                <th>Risk Score</th>
                <th>Intelligence Sources</th>
                <th>Categories</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${data.threats.map((threat) => `
                <tr>
                  <td class="domain-cell">${threat.domain}</td>
                  <td>${threat.reputation === 'malicious' ? '🔴 Malicious' : threat.reputation === 'suspicious' ? '🟡 Suspicious' : '🟢 Clean'}</td>
                  <td><strong>${threat.riskScore}/100</strong></td>
                  <td>${threat.sources.join(', ')}</td>
                  <td>${threat.categories.join(', ')}</td>
                  <td>${threat.reputation === 'malicious' ? '🚨 Block immediately' : threat.reputation === 'suspicious' ? '⚠️ Investigate' : '✅ No action needed'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="section">
          <h2>📋 Actionable Recommendations for iGaming Operators</h2>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #0369a1; margin: 0 0 15px 0;">🚨 Immediate Actions Required</h4>
            <ul style="line-height: 1.8; margin: 0;">
              ${(data.summary?.highRisk || 0) > 0 ? '<li><strong>High Priority:</strong> Review and investigate all high-risk domains immediately</li>' : ''}
              <li><strong>Legal Review:</strong> Consult legal counsel for trademark infringement cases</li>
              <li><strong>Regulatory Reporting:</strong> Report suspicious gambling domains to relevant gaming commissions</li>
              <li><strong>Player Communication:</strong> Issue security alerts to players about legitimate vs. fraudulent sites</li>
            </ul>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
            <h4 style="color: #166534; margin: 0 0 15px 0;">🛡️ Long-term Protection Strategy</h4>
            <ul style="line-height: 1.8; margin: 0;">
              <li><strong>Domain Portfolio:</strong> Register defensive domain variations in key markets and TLDs</li>
              <li><strong>Monitoring Setup:</strong> Implement automated domain monitoring and alert systems</li>
              <li><strong>Brand Guidelines:</strong> Establish clear brand usage guidelines and enforcement procedures</li>
              <li><strong>Industry Cooperation:</strong> Share threat intelligence with other iGaming operators</li>
              <li><strong>Technical Measures:</strong> Implement DNS monitoring and certificate transparency tracking</li>
              <li><strong>Regular Audits:</strong> Schedule monthly brand protection audits and reviews</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h2>📞 Incident Response Contacts</h2>
          <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px;">
            <h4 style="color: #dc2626; margin: 0 0 15px 0;">Emergency Contacts for High-Risk Threats</h4>
            <ul style="margin: 0;">
              <li><strong>Legal Department:</strong> For trademark violations and UDRP filings</li>
              <li><strong>Compliance Team:</strong> For regulatory reporting requirements</li>
              <li><strong>IT Security:</strong> For technical countermeasures and blocking</li>
              <li><strong>Marketing Team:</strong> For player communications and damage control</li>
              <li><strong>Domain Registrar:</strong> For urgent domain takedown requests</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h2>⚠️ Legal Disclaimer & Compliance</h2>
          <div style="font-size: 14px; color: #64748b; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 15px 0;"><strong>Important Notice:</strong> This report is provided for informational and security purposes only.</p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>The presence of a domain in this report does not constitute legal advice or determination of trademark infringement</li>
              <li>iGaming operators should consult with qualified legal counsel before taking any legal action</li>
              <li>All domain analysis is automated and may contain false positives requiring manual verification</li>
              <li>This report should be used in conjunction with other security and legal assessment tools</li>
              <li>Operators must comply with local gambling regulations and licensing requirements when addressing threats</li>
            </ul>
            <p style="margin: 15px 0 0 0;"><strong>Data Protection:</strong> This report contains sensitive business information and should be handled according to your organization's data protection policies.</p>
          </div>
        </div>
      </div>

      <div class="footer">
        <p><strong>Brand Protection Suite for iGaming</strong> | Enterprise Security Monitoring Platform</p>
        <p>Report ID: ${data.scanId} | Generated: ${new Date(data.timestamp).toLocaleString()}</p>
        <p style="font-size: 12px; margin-top: 10px;">This report is confidential and intended solely for the use of ${data.brand} management team.</p>
      </div>
    </body>
    </html>
  `;
}

