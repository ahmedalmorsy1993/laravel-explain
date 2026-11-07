/**
 * Builds the Markdown shown in hovers and in the search panel (no `vscode` import).
 */
const { titleFor } = require('./resolve');
const { isOlderThan } = require('./docsVersion');

/**
 * Full docs URL for an entry: absolute URLs are kept, Laravel paths get the docs version.
 *
 * @param {{docs: string}} entry
 * @param {string} docsVersion  e.g. "13.x"
 * @returns {string}
 */
function docsUrl(entry, docsVersion) {
  return entry.docs.startsWith('http') ? entry.docs : `https://laravel.com/docs/${docsVersion}/${entry.docs}`;
}

/**
 * @param {string} key
 * @param {{what: string, example: string, docs: string, tip?: string, also?: string, since?: string}} entry
 * @param {{docsVersion: string, projectVersion?: {major: number, minor: number, raw: string}}} context
 * @returns {string}
 */
function renderMarkdown(key, entry, context) {
  const parts = [`**${titleFor(key)}** · _Laravel Explain_`];

  if (entry.since) {
    const tooOld = isOlderThan(context.projectVersion, entry.since);
    parts.push(
      tooOld
        ? `⚠️ Needs **Laravel ${entry.since}+** — this project uses ${context.projectVersion.raw}.`
        : `_Available since Laravel ${entry.since}._`
    );
  }

  parts.push(entry.what);
  if (entry.also) {
    parts.push(`**Also:** ${entry.also}`);
  }
  if (entry.tip) {
    parts.push(`💡 ${entry.tip}`);
  }

  const fence = entry.example.includes('```') ? '````' : '```';
  const language = key.startsWith('@') ? 'blade' : 'php';
  parts.push(`${fence}${language}\n${entry.example}\n${fence}`);
  parts.push(`[📖 Docs](${docsUrl(entry, context.docsVersion)})`);

  return parts.join('\n\n');
}

/**
 * Plain-text version of `what` for list labels (strips Markdown emphasis and code ticks).
 *
 * @param {string} text
 * @returns {string}
 */
function plainText(text) {
  return text.replace(/\*\*|__|`/g, '').replace(/\s+/g, ' ').trim();
}

module.exports = { renderMarkdown, docsUrl, plainText };
