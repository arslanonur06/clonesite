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

const additions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '123', '777', '888', '999', 'net', 'official', 'tr', 'best', 'top', 'pro', 'vip', 'new', 'live', 'bet', 'win', 'play', 'game', 'casino', 'slot', 'bonus', 'app'];

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

  // 10) Prefix additions - common prefixes for clones
  const prefixes = ['the', 'my', 'get', 'try', 'new', 'real', 'true', 'official', 'go'];
  for (const pre of prefixes) {
    add(pre + label, `prefix '${pre}'`);
  }

  // 11) Middle insertions - add numbers or letters in the middle
  const middleInserts = ['24', '365', 'bet', 'win'];
  const mid = Math.floor(label.length / 2);
  for (const ins of middleInserts) {
    add(label.slice(0, mid) + ins + label.slice(mid), `middle insertion '${ins}'`);
  }

  // 12) Hyphen variations
  if (label.length > 3) {
    for (let i = 1; i < label.length - 1; i += 2) {
      add(label.slice(0, i) + '-' + label.slice(i), `hyphen at position ${i}`);
    }
  }

  // 13) Common misspellings - swap similar letters
  const similarPairs: [string, string][] = [
    ['b', 'd'], ['m', 'n'], ['v', 'w'], ['c', 'k'], 
    ['s', 'z'], ['i', 'y']
  ];
  
  for (let i = 0; i < label.length; i++) {
    const ch = label[i];
    for (const [a, b] of similarPairs) {
      if (ch === a) {
        const variant = label.slice(0, i) + b + label.slice(i + 1);
        add(variant, `similar letter ${a}->${b}`);
      } else if (ch === b) {
        const variant = label.slice(0, i) + a + label.slice(i + 1);
        add(variant, `similar letter ${b}->${a}`);
      }
    }
  }

  return Array.from(candidates).map((d) => ({ domain: d, reason: reasons.get(d) ?? 'variant' }));
}

