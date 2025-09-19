import axios from 'axios';
import dns from 'node:dns/promises';

export type ThreatIntelligence = {
  domain: string;
  reputation: 'clean' | 'suspicious' | 'malicious' | 'unknown';
  riskScore: number; // 0-100
  categories: string[];
  lastSeen: string;
  sources: string[];
  details: {
    virusTotal?: {
      positives: number;
      total: number;
      scanDate: string;
    };
    urlVoid?: {
      engines: number;
      detections: string[];
    };
    shodan?: {
      ports: number[];
      services: string[];
      country: string;
      asn: string;
    };
    passiveDns?: {
      firstSeen: string;
      lastSeen: string;
      ips: string[];
    };
  };
};

// VirusTotal integration
export async function checkVirusTotal(domain: string): Promise<ThreatIntelligence['details']['virusTotal']> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) return undefined;
  
  try {
    const response = await axios.get(`https://www.virustotal.com/vtapi/v2/domain/report`, {
      params: { apikey: apiKey, domain },
      timeout: 10000
    });
    
    const data = response.data;
    return {
      positives: data.positives || 0,
      total: data.total || 0,
      scanDate: data.scan_date || new Date().toISOString()
    };
  } catch (error) {
    console.error('VirusTotal check failed:', error);
    return undefined;
  }
}

// URLVoid integration
export async function checkUrlVoid(domain: string): Promise<ThreatIntelligence['details']['urlVoid']> {
  const apiKey = process.env.URLVOID_API_KEY;
  if (!apiKey) return undefined;
  
  try {
    const response = await axios.get(`http://api.urlvoid.com/1000/${apiKey}/host/${domain}/`, {
      timeout: 10000
    });
    
    // Parse XML response (simplified)
    const xmlData = response.data;
    const engines = (xmlData.match(/<engine>/g) || []).length;
    const detections = xmlData.match(/<engine[^>]*>([^<]+)<\/engine>/g) || [];
    
    return {
      engines,
      detections: detections.map((d: string) => d.replace(/<[^>]*>/g, ''))
    };
  } catch (error) {
    console.error('URLVoid check failed:', error);
    return undefined;
  }
}

// Shodan integration for infrastructure analysis
export async function checkShodan(domain: string): Promise<ThreatIntelligence['details']['shodan']> {
  const apiKey = process.env.SHODAN_API_KEY;
  if (!apiKey) return undefined;
  
  try {
    // First resolve domain to IP
    const ips = await dns.resolve4(domain);
    if (ips.length === 0) return undefined;
    
    const ip = ips[0];
    const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}`, {
      params: { key: apiKey },
      timeout: 10000
    });
    
    const data = response.data;
    return {
      ports: data.ports || [],
      services: data.data?.map((service: any) => service.product || service.transport) || [],
      country: data.country_name || 'Unknown',
      asn: data.asn || 'Unknown'
    };
  } catch (error) {
    console.error('Shodan check failed:', error);
    return undefined;
  }
}

// Passive DNS lookup
export async function checkPassiveDns(domain: string): Promise<ThreatIntelligence['details']['passiveDns']> {
  try {
    // Using free passive DNS services
    const sources = [
      `https://api.securitytrails.com/v1/domain/${domain}/subdomains`,
      `https://api.threatminer.org/v2/domain.php?q=${domain}&rt=5`
    ];
    
    const ips: string[] = [];
    let firstSeen = new Date().toISOString();
    let lastSeen = new Date().toISOString();
    
    for (const source of sources) {
      try {
        const response = await axios.get(source, {
          headers: { 'APIKEY': process.env.SECURITYTRAILS_API_KEY || '' },
          timeout: 10000
        });
        
        if (response.data && response.data.results) {
          // Parse IP addresses from response
          const sourceIps = response.data.results
            .filter((item: any) => item.ip)
            .map((item: any) => item.ip);
          ips.push(...sourceIps);
        }
      } catch (error) {
        console.error(`Passive DNS check failed for ${source}:`, error);
      }
    }
    
    return {
      firstSeen,
      lastSeen,
      ips: [...new Set(ips)] // Remove duplicates
    };
  } catch (error) {
    console.error('Passive DNS check failed:', error);
    return undefined;
  }
}

// IP geolocation and ASN lookup
export async function getIpGeolocation(ip: string): Promise<{ country: string; city: string; asn: string }> {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`, {
      timeout: 5000
    });
    
    const data = response.data;
    return {
      country: data.country || 'Unknown',
      city: data.city || 'Unknown',
      asn: data.as || 'Unknown'
    };
  } catch (error) {
    return { country: 'Unknown', city: 'Unknown', asn: 'Unknown' };
  }
}

// Comprehensive threat intelligence check
export async function getThreatIntelligence(domain: string): Promise<ThreatIntelligence> {
  const [virusTotal, urlVoid, shodan, passiveDns] = await Promise.all([
    checkVirusTotal(domain),
    checkUrlVoid(domain),
    checkShodan(domain),
    checkPassiveDns(domain)
  ]);
  
  // Calculate risk score based on available data
  let riskScore = 0;
  const sources: string[] = [];
  const categories: string[] = [];
  
  if (virusTotal) {
    sources.push('VirusTotal');
    if (virusTotal.positives > 0) {
      riskScore += (virusTotal.positives / virusTotal.total) * 50;
      categories.push('malware');
    }
  }
  
  if (urlVoid) {
    sources.push('URLVoid');
    if (urlVoid.engines > 0) {
      riskScore += Math.min(urlVoid.engines * 10, 30);
      categories.push('suspicious');
    }
  }
  
  if (shodan) {
    sources.push('Shodan');
    // High-risk ports
    const riskyPorts = [22, 23, 25, 53, 135, 139, 445, 1433, 3389];
    const hasRiskyPorts = shodan.ports.some(port => riskyPorts.includes(port));
    if (hasRiskyPorts) {
      riskScore += 20;
      categories.push('infrastructure');
    }
  }
  
  if (passiveDns) {
    sources.push('PassiveDNS');
  }
  
  // Determine reputation
  let reputation: ThreatIntelligence['reputation'] = 'unknown';
  if (riskScore === 0) reputation = 'clean';
  else if (riskScore < 30) reputation = 'suspicious';
  else reputation = 'malicious';
  
  return {
    domain,
    reputation,
    riskScore: Math.min(riskScore, 100),
    categories: [...new Set(categories)],
    lastSeen: new Date().toISOString(),
    sources,
    details: {
      virusTotal,
      urlVoid,
      shodan,
      passiveDns
    }
  };
}

// Batch threat intelligence check
export async function batchThreatIntelligence(domains: string[]): Promise<ThreatIntelligence[]> {
  const pLimit = (await import('p-limit')).default;
  const limit = pLimit(5); // Limit concurrent requests to avoid rate limiting
  
  return Promise.all(
    domains.map(domain => limit(() => getThreatIntelligence(domain)))
  );
}

// Generate threat intelligence report
export async function generateThreatReport(intelligence: ThreatIntelligence[], outputPath: string): Promise<void> {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: intelligence.length,
      clean: intelligence.filter(i => i.reputation === 'clean').length,
      suspicious: intelligence.filter(i => i.reputation === 'suspicious').length,
      malicious: intelligence.filter(i => i.reputation === 'malicious').length,
      avgRiskScore: intelligence.reduce((sum, i) => sum + i.riskScore, 0) / intelligence.length
    },
    highRiskDomains: intelligence
      .filter(i => i.riskScore > 50)
      .sort((a, b) => b.riskScore - a.riskScore),
    intelligence
  };
  
  const fs = await import('node:fs/promises');
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
}
