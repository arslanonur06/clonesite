import fs from 'node:fs';
import path from 'node:path';
import { checkDomains } from '../dist/lib/check.js';
import { generateDomainVariants } from '../dist/lib/variants.js';

const prefix = 'suratbet';
const base = 'suratbet332.com';
const baseNum = '332';

const domains = new Set();

// Numeric sequence sweep: suratbet0..999 + www variants
for (let n = 0; n <= 999; n++) {
  domains.add(`${prefix}${n}.com`);
  domains.add(`www.${prefix}${n}.com`);
}

// Number position changes/permutations for current number
const perms = new Set([baseNum]);
const digits = baseNum.split('');
for (let i = 0; i < digits.length; i++) {
  for (let j = 0; j < digits.length; j++) {
    for (let k = 0; k < digits.length; k++) {
      if (i !== j && j !== k && i !== k) {
        perms.add(`${digits[i]}${digits[j]}${digits[k]}`);
      }
    }
  }
}
for (const p of perms) {
  domains.add(`${prefix}${p}.com`);
  domains.add(`www.${prefix}${p}.com`);
}

// Letter-typo/homograph/suffix variants based on current domain
for (const variant of generateDomainVariants(base)) {
  domains.add(variant.domain);
}

const allCandidates = [...domains];
console.log(`Total candidates: ${allCandidates.length}`);

const results = await checkDomains(allCandidates, 40);
const active = results.filter((r) => r.isRegistered || r.hasARecord || r.hasMxRecord);

active.sort((a, b) => {
  const sa = Number(Boolean(a.isRegistered)) + Number(Boolean(a.hasARecord)) + Number(Boolean(a.hasMxRecord));
  const sb = Number(Boolean(b.isRegistered)) + Number(Boolean(b.hasARecord)) + Number(Boolean(b.hasMxRecord));
  return sb - sa;
});

fs.mkdirSync('reports', { recursive: true });
const outPath = path.join('reports', 'suratbet332-domain-scan.json');
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      baseDomain: 'https://www.suratbet332.com/',
      checked: allCandidates.length,
      activeCount: active.length,
      generatedAt: new Date().toISOString(),
      active,
    },
    null,
    2
  )
);

console.log(`Active domains: ${active.length}`);
console.log(`Saved report: ${outPath}`);
console.log('Top active sample:');
for (const row of active.slice(0, 20)) {
  console.log(
    `- ${row.domain} | reg: ${Boolean(row.isRegistered)} | A: ${Boolean(row.hasARecord)} | MX: ${Boolean(row.hasMxRecord)}`
  );
}
