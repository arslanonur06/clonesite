export type SequenceConfig = {
  patternDomain: string; // e.g., suratbet1256.com
  range: number; // +/- range, e.g., 20
  includeWWW?: boolean;
};

export function parsePattern(patternDomain: string): { prefix: string; number: number; tld: string } | null {
  const m = patternDomain.trim().toLowerCase().match(/^([a-z0-9-]*?)(\d+)\.(.+)$/);
  if (!m) return null;
  const [, prefix, numStr, tld] = m;
  return { prefix, number: parseInt(numStr, 10), tld: tld.startsWith('.') ? tld.slice(1) : tld };
}

export function generateSequenceDomains(cfg: SequenceConfig): string[] {
  const parsed = parsePattern(cfg.patternDomain);
  if (!parsed) return [];
  const { prefix, number, tld } = parsed;
  const domains: string[] = [];
  for (let n = number - cfg.range; n <= number + cfg.range; n++) {
    if (n === number) continue; // skip the exact original
    const label = `${prefix}${n}`;
    const d = `${label}.${tld}`;
    domains.push(d);
    if (cfg.includeWWW) domains.push(`www.${d}`);
  }
  return domains;
}

