import removeAccents from 'remove-accents';
import stopword from 'stopword';

export function normalizeText(input: string): string {
  const lower = input.toLowerCase();
  const noAccents = removeAccents(lower);
  const tokens = noAccents.replace(/[^a-z0-9çğıöşü\s]/gi, ' ').split(/\s+/).filter(Boolean);
  const filtered = stopword.removeStopwords(tokens, [...(stopword.tr ?? []), ...(stopword.en ?? [])]);
  return filtered.join(' ');
}

// Simple SimHash implementation for near-duplicate detection
export function simHash(text: string, hashBits = 64): bigint {
  const tokens = text.split(/\s+/).filter(Boolean);
  const weights = new Array<number>(hashBits).fill(0);
  for (const token of tokens) {
    let h = murmurHash64(token);
    for (let i = 0n; i < BigInt(hashBits); i++) {
      const bit = (h >> i) & 1n;
      weights[Number(i)] += bit === 1n ? 1 : -1;
    }
  }
  let result = 0n;
  for (let i = 0; i < hashBits; i++) {
    if (weights[i] > 0) result |= 1n << BigInt(i);
  }
  return result;
}

export function hammingDistance(a: bigint, b: bigint): number {
  let x = a ^ b;
  let count = 0;
  while (x) {
    x &= x - 1n;
    count++;
  }
  return count;
}

function murmurHash64(key: string): bigint {
  // 64-bit FNV-1a as a simple stand-in (deterministic, fast)
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let i = 0; i < key.length; i++) {
    hash ^= BigInt(key.charCodeAt(i));
    hash *= prime;
  }
  return hash & ((1n << 64n) - 1n);
}

