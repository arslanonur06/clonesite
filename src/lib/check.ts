// @ts-ignore
import whoisCb from 'whois';
import dns from 'node:dns/promises';
import pLimit from 'p-limit';

export type DomainCheckResult = {
  domain: string;
  isRegistered: boolean;
  whoisCreationDate?: string | number | Date | null;
  whoisRegistrar?: string | null;
  whoisNameServers?: string[] | null;
  hasARecord: boolean;
  hasMxRecord: boolean;
  aRecords?: string[];
  mxRecords?: { exchange: string; priority: number }[];
  error?: string;
};

async function resolveRecord(domain: string, type: 'A' | 'MX'): Promise<boolean | string[] | { exchange: string; priority: number }[]> {
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
  } catch {
    return false;
  }
}

export async function checkDomain(domain: string): Promise<DomainCheckResult> {
  try {
    const [aRes, mxRes] = await Promise.all([
      resolveRecord(domain, 'A'),
      resolveRecord(domain, 'MX'),
    ]);

    let isRegistered = false;
    let creation: DomainCheckResult['whoisCreationDate'] = null;
    let registrar: string | null = null;
    let nameServers: string[] | null = null;
    try {
      const raw = await new Promise<string>((resolve, reject) => {
        whoisCb(domain, (err: any, data: any) => {
          if (err) return reject(err);
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
          .filter(Boolean) as string[];
        nameServers = nsLines.length ? nsLines : null;
      }
    } catch {
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
      aRecords: Array.isArray(aRes) ? (aRes as string[]) : undefined,
      mxRecords: Array.isArray(mxRes) ? (mxRes as { exchange: string; priority: number }[]) : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { domain, isRegistered: false, hasARecord: false, hasMxRecord: false, error: message };
  }
}

export async function checkDomains(domains: string[], concurrency = 10): Promise<DomainCheckResult[]> {
  const limit = pLimit(concurrency);
  return Promise.all(domains.map((d) => limit(() => checkDomain(d))));
}

