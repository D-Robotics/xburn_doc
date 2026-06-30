// 检查 docs/ 下每个 .md/.mdx 是否有 frontmatter title + description
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs'; // Node 22+，或用 fast-glob

const files = globSync('docs/**/*.{md,mdx}');
let missing = [];

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) { missing.push(`${f}: 无 frontmatter`); continue; }
  const fm = m[1];
  if (!/^title:\s*\S/m.test(fm))  missing.push(`${f}: 缺 title`);
  if (!/^description:\s*\S/m.test(fm)) missing.push(`${f}: 缺 description`);
}

if (missing.length) {
  console.error('❌ frontmatter 覆盖不全：');
  missing.forEach(x => console.error('  ' + x));
  process.exit(1);
}
console.log(`✅ frontmatter 覆盖率 100%（${files.length} 文件）`);
