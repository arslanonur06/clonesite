import whoisCb from 'whois';
import dns from 'node:dns/promises';
import pLimit from 'p-limit';
async function resolveRecord(domain, type) {
    try {
        if (type === 'A') {
            const res = await dns.resolve4(domain);
            return res;
        }
        if (type === 'MX') {
            const res = await dns.resolveMx(domain);
            return res.map((m) => ({ exchange: m.exchange, priority: m.priority }));
        }
        return false;
    }
    catch {
        return false;
    }
}
export async function checkDomain(domain) {
    try {
        const [aRes, mxRes] = await Promise.all([
            resolveRecord(domain, 'A'),
            resolveRecord(domain, 'MX'),
        ]);
        let isRegistered = false;
        let creation = null;
        let registrar = null;
        let nameServers = null;
        try {
            const raw = await new Promise((resolve, reject) => {
                whoisCb.lookup(domain, (err, data) => {
                    if (err)
                        return reject(err);
                    resolve(String(data ?? ''));
                });
            });
            const flat = raw.toLowerCase();
            if (flat.trim().length > 0) {
                isRegistered = true;
                const match = flat.match(/creation date\s*[:]?\s*(.+)/);
                creation = match ? match[1]?.slice(0, 40) : null;
                const reg = flat.match(/registrar\s*[:]?\s*(.+)/);
                registrar = reg ? reg[1]?.slice(0, 80) : null;
                const nsLines = raw
                    .split(/\r?\n/)
                    .filter((l) => /name server\s*:|nserver\s*:/.test(l.toLowerCase()))
                    .map((l) => l.split(/:\s*/)[1]?.trim())
                    .filter(Boolean);
                nameServers = nsLines.length ? nsLines : null;
            }
        }
        catch {
            // WHOIS can fail for rate limits or unsupported TLDs; fall back to DNS
            isRegistered = (Array.isArray(aRes) && aRes.length > 0) || (Array.isArray(mxRes) && mxRes.length > 0);
        }
        return {
            domain,
            isRegistered,
            whoisCreationDate: creation,
            whoisRegistrar: registrar,
            whoisNameServers: nameServers,
            hasARecord: Array.isArray(aRes) ? aRes.length > 0 : false,
            hasMxRecord: Array.isArray(mxRes) ? mxRes.length > 0 : false,
            aRecords: Array.isArray(aRes) ? aRes : undefined,
            mxRecords: Array.isArray(mxRes) ? mxRes : undefined,
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { domain, isRegistered: false, hasARecord: false, hasMxRecord: false, error: message };
    }
}
export async function checkDomains(domains, concurrency = 10) {
    const limit = pLimit(concurrency);
    return Promise.all(domains.map((d) => limit(() => checkDomain(d))));
}
