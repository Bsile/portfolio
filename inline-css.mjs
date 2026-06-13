// Inline le CSS critique (style.min.css) directement dans le <head> de chaque HTML,
// pour supprimer la requête bloquant le rendu (gain FCP/LCP).
// Idempotent : au 1er passage remplace le <link>, ensuite met à jour le contenu du <style id="critical-css">.
// Les url() relatives au fichier CSS (../fonts, ../images) sont réécrites pour résoudre depuis la racine HTML.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

let css = readFileSync('assets/css/style.min.css', 'utf8');
// Le CSS, servi auparavant depuis assets/css/, utilisait des chemins relatifs à ce dossier.
// Inliné dans un HTML à la racine, on les rebase sur la racine.
css = css.replace(/\.\.\/fonts\//g, 'assets/fonts/').replace(/\.\.\/images\//g, 'assets/images/');
const leftover = css.match(/\.\.\/[^)"'\s]*/g);
if (leftover) {
  console.error('⚠️ inline-css: chemins relatifs non rebasés, abandon :', leftover);
  process.exit(1);
}

const styleBlock = `<style id="critical-css">${css}</style>`;
const linkRe = /<link rel="stylesheet" href="assets\/css\/style\.min\.css(?:\?v=[a-f0-9]+)?">/;
const styleRe = /<style id="critical-css">[\s\S]*?<\/style>/;

const report = {};
for (const f of readdirSync('.').filter((f) => f.endsWith('.html'))) {
  const before = readFileSync(f, 'utf8');
  let c = before;
  if (styleRe.test(c)) c = c.replace(styleRe, () => styleBlock);          // maj
  else if (linkRe.test(c)) c = c.replace(linkRe, () => styleBlock);       // 1er inline
  else { report[f] = 'AUCUNE CIBLE'; continue; }
  if (c !== before) { writeFileSync(f, c); report[f] = 'ok'; }
}
console.log('inline-css:', JSON.stringify(report));
