/**
 * Pure lookup logic (no `vscode` import) so it can be unit tested with `node --test`.
 */

/**
 * Classes whose static methods only match their own `Class::method` entries,
 * so `Route::delete()` never shows the Eloquent `delete()` explanation.
 */
const STRICT_CLASSES = new Set([
  'Route', 'Schema', 'Str', 'Arr', 'Carbon', 'Date', 'Cache', 'DB', 'Auth', 'Storage', 'Hash',
  'Gate', 'Validator', 'Log', 'Http', 'Mail', 'Config', 'Session', 'Request', 'Response', 'Rule',
]);

/**
 * Variables whose methods only match their own `$var->method` entries.
 */
const STRICT_RECEIVERS = new Set(['$request', '$table']);

const RECEIVER_ALIASES = { 'request()': '$request', '$blueprint': '$table' };

/**
 * Regex used to pick the word under the cursor (a leading `@` is kept for Blade directives).
 */
const WORD_PATTERN = /@?[A-Za-z_][A-Za-z0-9_]*/;

/**
 * Finds the reference entry for a word, using the text around it:
 * `@directive` (Blade), `Class::name`, `$var->name`, `->name`, a quoted
 * validation rule, or a global helper call like `now()`.
 *
 * @param {Record<string, object>} reference
 * @param {string} word    The word under the cursor (may start with `@`).
 * @param {string} before  Line text before the word.
 * @param {string} after   Line text after the word.
 * @param {string} [languageId]
 * @returns {{key: string, entry: object}|undefined}
 */
function resolve(reference, word, before, after, languageId = 'php') {
  const hit = (key) => (reference[key] ? { key, entry: reference[key] } : undefined);

  if (word.startsWith('@')) {
    if (languageId !== 'blade' || /[\w@]$/.test(before)) {
      return undefined;
    }
    return hit(word);
  }

  const name = word;
  const isCall = /^\s*\(/.test(after);

  const staticCall = /(\\?[A-Za-z_][\w\\]*)\s*::\s*$/.exec(before);
  if (staticCall && isCall) {
    const cls = staticCall[1].split('\\').pop();
    if (!['self', 'static', 'parent'].includes(cls)) {
      const specific = hit(`${cls}::${name}`);
      if (specific) {
        return specific;
      }
      if (STRICT_CLASSES.has(cls)) {
        return undefined;
      }
    }
    return hit(name);
  }

  const instanceCall = /(\$\w+|\b\w+\(\))\s*\??->\s*$/.exec(before);
  if (instanceCall && isCall) {
    const receiver = RECEIVER_ALIASES[instanceCall[1]] || instanceCall[1];
    const specific = hit(`${receiver}->${name}`);
    if (specific) {
      return specific;
    }
    if (STRICT_RECEIVERS.has(receiver)) {
      return undefined;
    }
    return hit(name);
  }

  if (/\??->\s*$/.test(before) && isCall) {
    return hit(name);
  }

  const quotes = (before.match(/'/g) || []).length + (before.match(/"/g) || []).length;
  if (quotes % 2 === 1 && /=>|validate\(|rules\(/.test(before) && /^[|:'",]/.test(after)) {
    return hit(`rule:${name}`);
  }

  if (isCall && !/(->|::|\$|\w|\\)$/.test(before) && !/\b(function|new)\s+$/.test(before)) {
    return hit(`${name}()`);
  }

  return undefined;
}

/**
 * Human title for a reference key, e.g. `Route::get()`, `'required' validation rule`, `@foreach`.
 *
 * @param {string} key
 * @returns {string}
 */
function titleFor(key) {
  if (key.startsWith('rule:')) {
    return `'${key.slice(5)}' validation rule`;
  }
  if (key.startsWith('@') || key.endsWith('()')) {
    return key;
  }
  return `${key}()`;
}

module.exports = { resolve, titleFor, WORD_PATTERN, STRICT_CLASSES, STRICT_RECEIVERS };
