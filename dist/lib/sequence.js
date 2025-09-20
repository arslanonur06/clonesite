export function parsePattern(patternDomain) {
    const m = patternDomain.trim().toLowerCase().match(/^([a-z0-9-]*?)(\d+)\.(.+)$/);
    if (!m)
        return null;
    const [, prefix, numStr, tld] = m;
    return { prefix, number: parseInt(numStr, 10), tld: tld.startsWith('.') ? tld.slice(1) : tld };
}
export function generateSequenceDomains(cfg) {
    const parsed = parsePattern(cfg.patternDomain);
    if (!parsed)
        return [];
    const { prefix, number, tld } = parsed;
    const domains = [];
    for (let n = number - cfg.range; n <= number + cfg.range; n++) {
        if (n === number)
            continue; // skip the exact original
        const label = `${prefix}${n}`;
        const d = `${label}.${tld}`;
        domains.push(d);
        if (cfg.includeWWW)
            domains.push(`www.${d}`);
    }
    return domains;
}
