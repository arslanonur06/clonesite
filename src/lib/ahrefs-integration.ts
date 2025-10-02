import axios from 'axios';

interface AhrefsConfig {
  apiKey: string;
  baseUrl?: string;
}

interface BacklinkData {
  domain: string;
  backlinks: number;
  domainRating: number;
  urlRating: number;
  organicKeywords: number;
  organicTraffic: number;
  paidKeywords: number;
  paidTraffic: number;
}

interface DomainInfo {
  domain: string;
  domainRating: number;
  backlinks: number;
  referringDomains: number;
  organicKeywords: number;
  organicTraffic: number;
  paidKeywords: number;
  paidTraffic: number;
}

interface AhrefsError {
  error: string;
  message: string;
}

class AhrefsIntegration {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: AhrefsConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://apiv2.ahrefs.com';
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await axios.get(url, {
        params: {
          token: this.apiKey,
          ...params
        },
        timeout: 30000
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Ahrefs API Error: ${error.response.data?.error || error.message}`);
      } else if (error.request) {
        throw new Error('Ahrefs API request timeout or network error');
      } else {
        throw new Error(`Ahrefs API Error: ${error.message}`);
      }
    }
  }

  /**
   * Get domain information including domain rating, backlinks, and traffic data
   */
  async getDomainInfo(domain: string): Promise<DomainInfo> {
    try {
      const response = await this.makeRequest('/', {
        target: domain,
        mode: 'domain_rating',
        output: 'json'
      });

      if (!response || !response.domains || response.domains.length === 0) {
        throw new Error(`No data found for domain: ${domain}`);
      }

      const domainData = response.domains[0];

      return {
        domain: domainData.domain || domain,
        domainRating: parseInt(domainData.domain_rating) || 0,
        backlinks: parseInt(domainData.backlinks) || 0,
        referringDomains: parseInt(domainData.refdomains) || 0,
        organicKeywords: parseInt(domainData.organic_keywords) || 0,
        organicTraffic: parseInt(domainData.organic_traffic) || 0,
        paidKeywords: parseInt(domainData.paid_keywords) || 0,
        paidTraffic: parseInt(domainData.paid_traffic) || 0
      };
    } catch (error) {
      console.warn(`Failed to get Ahrefs data for ${domain}:`, error);
      // Return empty data instead of throwing
      return {
        domain,
        domainRating: 0,
        backlinks: 0,
        referringDomains: 0,
        organicKeywords: 0,
        organicTraffic: 0,
        paidKeywords: 0,
        paidTraffic: 0
      };
    }
  }

  /**
   * Get backlink data for a domain
   */
  async getBacklinks(domain: string, limit: number = 100): Promise<BacklinkData[]> {
    try {
      const response = await this.makeRequest('/', {
        target: domain,
        mode: 'backlinks',
        output: 'json',
        limit: Math.min(limit, 1000)
      });

      if (!response || !response.backlinks) {
        return [];
      }

      return response.backlinks.map((link: any) => ({
        domain: link.domain_from || 'Unknown',
        backlinks: 1,
        domainRating: parseInt(link.domain_rating_from) || 0,
        urlRating: parseInt(link.url_rating_from) || 0,
        organicKeywords: parseInt(link.organic_keywords_from) || 0,
        organicTraffic: parseInt(link.organic_traffic_from) || 0,
        paidKeywords: parseInt(link.paid_keywords_from) || 0,
        paidTraffic: parseInt(link.paid_traffic_from) || 0
      }));
    } catch (error) {
      console.warn(`Failed to get backlinks for ${domain}:`, error);
      return [];
    }
  }

  /**
   * Get organic keywords for a domain
   */
  async getOrganicKeywords(domain: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await this.makeRequest('/', {
        target: domain,
        mode: 'organic_keywords',
        output: 'json',
        limit: Math.min(limit, 1000)
      });

      return response?.organic_keywords || [];
    } catch (error) {
      console.warn(`Failed to get organic keywords for ${domain}:`, error);
      return [];
    }
  }

  /**
   * Get paid keywords for a domain
   */
  async getPaidKeywords(domain: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await this.makeRequest('/', {
        target: domain,
        mode: 'paid_keywords',
        output: 'json',
        limit: Math.min(limit, 1000)
      });

      return response?.paid_keywords || [];
    } catch (error) {
      console.warn(`Failed to get paid keywords for ${domain}:`, error);
      return [];
    }
  }

  /**
   * Analyze domain for SEO and backlink profile
   */
  async analyzeDomain(domain: string): Promise<{
    domain: string;
    domainRating: number;
    backlinks: number;
    referringDomains: number;
    organicKeywords: number;
    organicTraffic: number;
    paidKeywords: number;
    paidTraffic: number;
    topBacklinks: BacklinkData[];
    riskLevel: 'low' | 'medium' | 'high';
    indicators: string[];
  }> {
    try {
      // Get domain info
      const domainInfo = await this.getDomainInfo(domain);

      // Get top backlinks
      const backlinks = await this.getBacklinks(domain, 50);

      // Analyze risk level based on metrics
      const riskLevel = this.calculateRiskLevel(domainInfo, backlinks);
      const indicators = this.generateRiskIndicators(domainInfo, backlinks);

      return {
        ...domainInfo,
        topBacklinks: backlinks.slice(0, 10),
        riskLevel,
        indicators
      };
    } catch (error) {
      console.error(`Failed to analyze domain ${domain}:`, error);
      throw error;
    }
  }

  private calculateRiskLevel(domainInfo: DomainInfo, backlinks: BacklinkData[]): 'low' | 'medium' | 'high' {
    const { domainRating, backlinks: totalBacklinks, organicTraffic } = domainInfo;

    // High risk indicators
    if (domainRating >= 70 || totalBacklinks >= 10000 || organicTraffic >= 100000) {
      return 'high';
    }

    // Medium risk indicators
    if (domainRating >= 40 || totalBacklinks >= 1000 || organicTraffic >= 10000) {
      return 'medium';
    }

    return 'low';
  }

  private generateRiskIndicators(domainInfo: DomainInfo, backlinks: BacklinkData[]): string[] {
    const indicators: string[] = [];
    const { domainRating, backlinks: totalBacklinks, organicTraffic, referringDomains } = domainInfo;

    if (domainRating >= 70) {
      indicators.push(`High domain authority (${domainRating})`);
    }

    if (totalBacklinks >= 10000) {
      indicators.push(`Extensive backlink profile (${totalBacklinks.toLocaleString()} backlinks)`);
    }

    if (organicTraffic >= 100000) {
      indicators.push(`High organic traffic (${organicTraffic.toLocaleString()} monthly visits)`);
    }

    if (referringDomains >= 1000) {
      indicators.push(`Diverse backlink sources (${referringDomains.toLocaleString()} referring domains)`);
    }

    if (backlinks.some(bl => bl.domainRating >= 60)) {
      indicators.push('Backlinks from high-authority domains');
    }

    if (indicators.length === 0) {
      indicators.push('Limited online presence detected');
    }

    return indicators;
  }
}

// Factory function to create Ahrefs integration with config from environment
export function createAhrefsIntegration(): AhrefsIntegration | null {
  const apiKey = process.env.AHREFS_API_KEY;

  if (!apiKey) {
    console.warn('Ahrefs API key not found. Ahrefs integration will be disabled.');
    return null;
  }

  return new AhrefsIntegration({
    apiKey,
    baseUrl: process.env.AHREFS_BASE_URL || 'https://apiv2.ahrefs.com'
  });
}

export { AhrefsIntegration };
export type { BacklinkData, DomainInfo, AhrefsError };