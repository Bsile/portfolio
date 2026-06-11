// Cache-busting : ajoute ?v=<hash-du-contenu> aux assets .min dans les HTML.
// Le hash ne change que si le fichier change -> pas de diff superflu, et le cache
// navigateur est invalidé automatiquement après déploiement.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const assets = [
  'assets/css/style.min.css',
  'assets/script/script.min.js',
  'assets/barba/barba-transition.min.js',
];

const hashes = {};
for (const p of assets) {
  hashes[p] = createHash('md5').update(readFileSync(p)).digest('hex').slice(0, 8);
}

const htmlFiles = readdirSync('.').filter((f) => f.endsWith('.html'));
for (const f of htmlFiles) {
  let c = readFileSync(f, 'utf8');
  let changed = false;
  for (const p of assets) {
    const esc = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc + '(\\?v=[a-f0-9]+)?', 'g');
    const next = c.replace(re, `${p}?v=${hashes[p]}`);
    if (next !== c) { c = next; changed = true; }
  }
  if (changed) writeFileSync(f, c);
}
console.log('cache-bust:', Object.entries(hashes).map(([p, h]) => `${p.split('/').pop()}=${h}`).join(' '));
