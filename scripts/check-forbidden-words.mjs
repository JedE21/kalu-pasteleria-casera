import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const forbiddenTablePatterns = [
  /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?sales\b/i,
  /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?orders\b/i,
  /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?products\b/i,
  /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?inventory\b/i,
  /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?customers\b/i,
  /\.from\(['"`](sales|orders|products|inventory|customers)['"`]\)/i,
];
const ignored = new Set(['node_modules', 'dist', '.git']);
const files = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (/\.(sql|ts|tsx|js|jsx|md|html)$/.test(entry)) files.push(path);
  }
}

walk(root);

const hits = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const pattern of forbiddenTablePatterns) {
    if (pattern.test(text)) hits.push(file);
  }
}

if (hits.length) {
  console.error('Forbidden table usage found:');
  for (const hit of [...new Set(hits)]) console.error(`- ${hit}`);
  process.exit(1);
}

console.log('No forbidden table usage found.');
