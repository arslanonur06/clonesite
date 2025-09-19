export type DomainVariant = {
  domain: string;
  reason: string;
};

const DEFAULT_EXTENSIONS = [
  '.com', '.net', '.org', '.info', '.biz', '.co', '.io', '.app', '.site', '.xyz',
  '.me', '.tv', '.cc', '.ws', '.mobi', '.name', '.pro', '.travel', '.museum',
  '.bet', '.casino', '.poker', '.games', '.win', '.top', '.click', '.online',
  '.store', '.shop', '.tech', '.digital', '.email', '.money', '.finance',
  '.live', '.news', '.media', '.blog', '.website', '.space', '.cloud',
  '.ai', '.ml', '.tk', '.ga', '.cf', '.gq', '.pw', '.buzz', '.today',
  '.com.tr', '.net.tr', '.org.tr', '.info.tr', '.biz.tr'
];

const substitutions: Record<string, string[]> = {
  a: ['e', 'o'],
  e: ['a', 'i'],
  o: ['a', 'u'],
  i: ['l', '1'],
  l: ['1', 'i'],
  s: ['5', 'z'],
};

const homographs: Record<string, string[]> = {
  a: ['а'],
  e: ['е'],
  o: ['о'],
  c: ['с'],
  p: ['р'],
  x: ['х'],
};

const additions = ['1', '2', '123', 'net', 'official', 'tr'];

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function splitDomain(domain: string): { label: string; tld: string } {
  const parts = domain.split('.');
  if (parts.length < 2) return { label: domain, tld: '' };
  const tld = '.' + parts.slice(1).join('.');
  return { label: parts[0], tld };
}

export function generateDomainVariants(
  originalDomain: string,
  options?: { extensions?: string[] }
): DomainVariant[] {
  const { label, tld } = splitDomain(originalDomain.trim().toLowerCase());
  const extensions = options?.extensions ?? (tld ? [tld, ...DEFAULT_EXTENSIONS] : DEFAULT_EXTENSIONS);

  const candidates = new Set<string>();
  const reasons = new Map<string, string>();

  function add(labelVariant: string, reason: string) {
    for (const ext of extensions) {
      const d = `${labelVariant}${ext}`;
      if (!candidates.has(d)) {
        candidates.add(d);
        reasons.set(d, reason);
      }
    }
  }

  // 1) Original with other TLDs
  add(label, 'original-label with alternate TLD');

  // 2) Character substitution
  for (let i = 0; i < label.length; i++) {
    const ch = label[i];
    const subs = substitutions[ch];
    if (!subs) continue;
    for (const s of subs) {
      const variant = label.slice(0, i) + s + label.slice(i + 1);
      add(variant, `substitution ${ch}->${s}`);
    }
  }

  // 3) Character deletion
  if (label.length > 1) {
    for (let i = 0; i < label.length; i++) {
      const variant = label.slice(0, i) + label.slice(i + 1);
      add(variant, `deletion at ${i}`);
    }
  }

  // 4) Character duplication
  for (let i = 0; i < label.length; i++) {
    const variant = label.slice(0, i + 1) + label[i] + label.slice(i + 1);
    add(variant, `duplication of '${label[i]}' at ${i}`);
  }

  // 5) Adjacent transposition
  for (let i = 0; i < label.length - 1; i++) {
    const variant =
      label.slice(0, i) + label[i + 1] + label[i] + label.slice(i + 2);
    add(variant, `transposition at ${i}-${i + 1}`);
  }

  // 6) Additions (suffixes)
  for (const suffix of additions) {
    add(label + suffix, `suffix '${suffix}'`);
  }

  // 7) Letter games - double letters (kalebet -> kaleebet, kalebett)
  for (let i = 0; i < label.length; i++) {
    const ch = label[i];
    if (/[aeiou]/.test(ch)) {
      // Double vowels
      const variant = label.slice(0, i) + ch + ch + label.slice(i + 1);
      add(variant, `double vowel '${ch}' at ${i}`);
    }
    if (/[bcdfghjklmnpqrstvwxyz]/.test(ch)) {
      // Double consonants
      const variant = label.slice(0, i) + ch + ch + label.slice(i + 1);
      add(variant, `double consonant '${ch}' at ${i}`);
    }
  }

  // 8) Vowel swaps (kalebet -> kalibet, kolubet)
  const vowelSwaps: Record<string, string[]> = {
    a: ['e', 'i', 'o', 'u'],
    e: ['a', 'i', 'o', 'u'],
    i: ['a', 'e', 'o', 'u'],
    o: ['a', 'e', 'i', 'u'],
    u: ['a', 'e', 'i', 'o']
  };
  for (let i = 0; i < label.length; i++) {
    const ch = label[i];
    const swaps = vowelSwaps[ch];
    if (!swaps) continue;
    for (const s of swaps) {
      const variant = label.slice(0, i) + s + label.slice(i + 1);
      add(variant, `vowel swap ${ch}->${s} at ${i}`);
    }
  }

  // 9) Homograph replacements
  for (let i = 0; i < label.length; i++) {
    const ch = label[i];
    const homog = homographs[ch];
    if (!homog) continue;
    for (const h of homog) {
      const variant = label.slice(0, i) + h + label.slice(i + 1);
      add(variant, `homograph ${ch}->${h}`);
    }
  }

  return Array.from(candidates).map((d) => ({ domain: d, reason: reasons.get(d) ?? 'variant' }));
}

