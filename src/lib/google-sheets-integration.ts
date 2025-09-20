interface GoogleSheetsCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface GoogleSheetsConfig {
  credentials: GoogleSheetsCredentials;
  spreadsheetId: string;
  scopes: string[];
}

interface SpreadsheetTemplate {
  id: string;
  name: string;
  description: string;
  headers: string[];
  sampleData: any[];
}

interface ImportResult {
  success: boolean;
  rowsImported: number;
  errors: string[];
  spreadsheetUrl?: string;
}

export class GoogleSheetsManager {
  private config: GoogleSheetsConfig;
  private templates: Map<string, SpreadsheetTemplate> = new Map();

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Brand Protection Scan Results Template
    this.templates.set('brand-protection-scan', {
      id: 'brand-protection-scan',
      name: 'Brand Protection Scan Results',
      description: 'Template for brand protection scan results',
      headers: [
        'Domain',
        'Status',
        'Risk Level',
        'Registration Date',
        'Registrar',
        'Name Servers',
        'Similarity Score',
        'Is Clone',
        'Threat Type',
        'Notes'
      ],
      sampleData: [
        [
          'example-clone.com',
          'Active',
          'High',
          '2024-01-15',
          'Example Registrar',
          'ns1.example.com, ns2.example.com',
          '0.85',
          'Yes',
          'Visual Clone',
          'High visual similarity detected'
        ]
      ]
    });

    // iGaming Affiliate Monitoring Template
    this.templates.set('igaming-affiliates', {
      id: 'igaming-affiliates',
      name: 'iGaming Affiliate Monitoring',
      description: 'Template for monitoring iGaming affiliate activities',
      headers: [
        'Affiliate ID',
        'Affiliate Name',
        'Domain',
        'Status',
        'Traffic Volume',
        'Conversion Rate',
        'Commission Rate',
        'Last Activity',
        'Compliance Status',
        'Risk Level'
      ],
      sampleData: [
        [
          'AFF001',
          'Example Affiliate',
          'affiliate.example.com',
          'Active',
          '1000',
          '2.5%',
          '25%',
          '2024-01-20',
          'Compliant',
          'Low'
        ]
      ]
    });

    // Threat Intelligence Template
    this.templates.set('threat-intelligence', {
      id: 'threat-intelligence',
      name: 'Threat Intelligence Report',
      description: 'Template for threat intelligence data',
      headers: [
        'Threat ID',
        'Threat Type',
        'Source',
        'Target Domain',
        'Severity',
        'First Seen',
        'Last Seen',
        'Status',
        'Description',
        'Mitigation Actions'
      ],
      sampleData: [
        [
          'THREAT001',
          'Phishing',
          'Security Feed',
          'target.example.com',
          'High',
          '2024-01-15',
          '2024-01-20',
          'Active',
          'Phishing campaign targeting brand',
          'Domain takedown requested'
        ]
      ]
    });

    // Mobile App Monitoring Template
    this.templates.set('mobile-apps', {
      id: 'mobile-apps',
      name: 'Mobile App Monitoring',
      description: 'Template for mobile app monitoring results',
      headers: [
        'App Name',
        'Package ID',
        'Store',
        'Developer',
        'Version',
        'Risk Level',
        'Similarity Score',
        'Download Count',
        'Rating',
        'Last Updated',
        'Is Clone'
      ],
      sampleData: [
        [
          'Brand Clone App',
          'com.example.clone',
          'Google Play',
          'Unknown Developer',
          '1.0.0',
          'High',
          '0.92',
          '1000',
          '4.2',
          '2024-01-18',
          'Yes'
        ]
      ]
    });
  }

  static getTemplates(): SpreadsheetTemplate[] {
    const manager = new GoogleSheetsManager({
      credentials: {} as GoogleSheetsCredentials,
      spreadsheetId: '',
      scopes: []
    });
    return Array.from(manager.templates.values());
  }

  async createFormFromTemplate(templateId: string): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    try {
      // In a real implementation, you would use the Google Sheets API
      // For now, we'll simulate the creation
      console.log(`📊 Creating Google Sheets form from template: ${template.name}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const spreadsheetId = `spreadsheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
      
      console.log(`✅ Created spreadsheet: ${spreadsheetUrl}`);
      return spreadsheetId;
    } catch (error) {
      console.error('Failed to create Google Sheets form:', error);
      throw new Error(`Failed to create form: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async importData(data: any[], templateId: string): Promise<ImportResult> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    try {
      console.log(`📥 Importing ${data.length} rows to Google Sheets...`);
      
      // Validate data structure
      const errors: string[] = [];
      let validRows = 0;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!Array.isArray(row)) {
          errors.push(`Row ${i + 1}: Expected array, got ${typeof row}`);
          continue;
        }
        
        if (row.length !== template.headers.length) {
          errors.push(`Row ${i + 1}: Expected ${template.headers.length} columns, got ${row.length}`);
          continue;
        }
        
        validRows++;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result: ImportResult = {
        success: errors.length === 0,
        rowsImported: validRows,
        errors,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${this.config.spreadsheetId}/edit`
      };

      console.log(`✅ Imported ${validRows} rows successfully`);
      if (errors.length > 0) {
        console.warn(`⚠️ ${errors.length} rows had errors`);
      }

      return result;
    } catch (error) {
      console.error('Failed to import data:', error);
      return {
        success: false,
        rowsImported: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async exportToCSV(range: string): Promise<string> {
    try {
      console.log(`📤 Exporting range ${range} to CSV...`);
      
      // In a real implementation, you would fetch data from Google Sheets API
      // For now, we'll return sample CSV data
      const sampleData = [
        'Domain,Status,Risk Level,Similarity Score',
        'example1.com,Active,High,0.85',
        'example2.com,Inactive,Low,0.25',
        'example3.com,Active,Medium,0.65'
      ].join('\n');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('✅ CSV export completed');
      return sampleData;
    } catch (error) {
      console.error('Failed to export CSV:', error);
      throw new Error(`Failed to export CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility methods for specific data types
  async exportBrandProtectionResults(scanResults: any[]): Promise<string> {
    const csvData = [
      'Domain,Status,Risk Level,Registration Date,Registrar,Similarity Score,Is Clone,Threat Type',
      ...scanResults.map(result => [
        result.domain || '',
        result.isRegistered ? 'Active' : 'Inactive',
        result.riskLevel || 'Unknown',
        result.whois?.creationDate || '',
        result.whois?.registrar || '',
        result.similarity?.visual || '0',
        result.isClone ? 'Yes' : 'No',
        result.threatType || ''
      ].join(','))
    ].join('\n');

    return csvData;
  }

  async exportAffiliateData(affiliateData: any[]): Promise<string> {
    const csvData = [
      'Affiliate ID,Affiliate Name,Domain,Status,Traffic Volume,Conversion Rate,Risk Level',
      ...affiliateData.map(affiliate => [
        affiliate.id || '',
        affiliate.name || '',
        affiliate.domain || '',
        affiliate.status || '',
        affiliate.trafficVolume || '0',
        affiliate.conversionRate || '0',
        affiliate.riskLevel || 'Unknown'
      ].join(','))
    ].join('\n');

    return csvData;
  }

  async exportThreatIntelligence(threats: any[]): Promise<string> {
    const csvData = [
      'Threat ID,Threat Type,Source,Target Domain,Severity,First Seen,Status,Description',
      ...threats.map(threat => [
        threat.id || '',
        threat.type || '',
        threat.source || '',
        threat.target || '',
        threat.severity || '',
        threat.firstSeen || '',
        threat.status || '',
        threat.description || ''
      ].join(','))
    ].join('\n');

    return csvData;
  }
}
