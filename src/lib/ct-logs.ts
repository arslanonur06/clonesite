import https from 'node:https';

export type CertificateEntry = {
  domain: string;
  timestamp: string;
  issuer: string;
};

// Certificate Transparency log search for new domain registrations
export async function searchCTLogs(brand: string, days = 7): Promise<CertificateEntry[]> {
  const query = encodeURIComponent(`%.${brand}.%`);
  const url = `https://crt.sh/?q=${query}&output=json`;
  
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const entries = JSON.parse(data) as Array<{
            name_value: string;
            not_before: string;
            issuer_name: string;
          }>;
          
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          
          const results: CertificateEntry[] = [];
          for (const entry of entries) {
            const domains = entry.name_value.split('\n').filter(Boolean);
            for (const domain of domains) {
              const cleanDomain = domain.replace(/^\*\./, '').toLowerCase();
              if (cleanDomain.includes(brand) && new Date(entry.not_before) > cutoff) {
                results.push({
                  domain: cleanDomain,
                  timestamp: entry.not_before,
                  issuer: entry.issuer_name
                });
              }
            }
          }
          
          // Deduplicate by domain
          const unique = new Map<string, CertificateEntry>();
          for (const r of results) {
            if (!unique.has(r.domain)) unique.set(r.domain, r);
          }
          
          resolve(Array.from(unique.values()));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => reject(new Error('CT log search timeout')));
  });
}
