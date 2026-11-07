#!/usr/bin/env node
/**
 * Checks that every Laravel docs link ("page#anchor") exists in the official docs.
 *
 * Usage: node scripts/check-links.js [docs-branch]   (default: 13.x)
 */
const reference = require('../data');

const branch = process.argv[2] || '13.x';
const base = `https://raw.githubusercontent.com/laravel/docs/${branch}`;

async function main() {
  const links = new Map();
  for (const [key, entry] of Object.entries(reference)) {
    if (entry.docs.startsWith('http')) {
      continue;
    }
    const [page, anchor] = entry.docs.split('#');
    if (!links.has(page)) {
      links.set(page, []);
    }
    links.get(page).push({ key, anchor });
  }

  const problems = [];
  await Promise.all(
    [...links.entries()].map(async ([page, uses]) => {
      const response = await fetch(`${base}/${page}.md`);
      if (!response.ok) {
        problems.push(`page "${page}" not found (HTTP ${response.status}) — used by ${uses.map((u) => u.key).join(', ')}`);
        return;
      }
      const markdown = await response.text();
      for (const { key, anchor } of uses) {
        if (anchor && !markdown.includes(`name="${anchor}"`)) {
          problems.push(`"${key}": anchor "${page}#${anchor}" does not exist`);
        }
      }
    })
  );

  const total = [...links.values()].reduce((sum, uses) => sum + uses.length, 0);
  if (problems.length) {
    console.error(`✗ ${problems.length} broken docs link(s) against laravel/docs@${branch}:\n  - ${problems.sort().join('\n  - ')}`);
    process.exit(1);
  }
  console.log(`✓ ${total} docs links across ${links.size} pages exist in laravel/docs@${branch}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
