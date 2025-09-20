import https from 'node:https';
// Certificate Transparency log search for new domain registrations
export async function searchCTLogs(brand, days = 7) {
    const query = encodeURIComponent(`%.${brand}.%`);
    const url = `https://crt.sh/?q=${query}&output=json`;
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const entries = JSON.parse(data);
                    const cutoff = new Date();
                    cutoff.setDate(cutoff.getDate() - days);
                    const results = [];
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
                    const unique = new Map();
                    for (const r of results) {
                        if (!unique.has(r.domain))
                            unique.set(r.domain, r);
                    }
                    resolve(Array.from(unique.values()));
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(10000, () => reject(new Error('CT log search timeout')));
    });
}

