const test = require('node:test');
const assert = require('node:assert/strict');
const reference = require('../data');

const KEY_FORMATS = [
  /^[a-z][A-Za-z0-9]*$/, // where
  /^[A-Z][A-Za-z]*::[a-zA-Z][A-Za-z0-9]*$/, // Route::get
  /^\$[a-z]+->[a-zA-Z][A-Za-z0-9]*$/, // $request->input
  /^[a-z_][a-z_]*\(\)$/, // now()
  /^rule:[a-z_]+$/, // rule:required
  /^@[a-zA-Z]+$/, // @foreach
];

const entries = Object.entries(reference);

test('reference has entries in every category', () => {
  const categories = new Set(entries.map(([, entry]) => entry.category));
  assert.ok(entries.length > 400, `only ${entries.length} entries`);
  assert.deepEqual([...categories].sort(), [
    'Blade',
    'Collections',
    'Eloquent & Query Builder',
    'Migrations',
    'Routes, Requests & Validation',
    'Str, Arr, Dates & Helpers',
  ]);
});

for (const [key, entry] of entries) {
  test(`entry "${key}" is valid`, () => {
    assert.ok(KEY_FORMATS.some((format) => format.test(key)), `key "${key}" does not match any key format (see data/index.js)`);

    for (const field of ['what', 'example', 'docs']) {
      assert.equal(typeof entry[field], 'string', `"${field}" must be a string`);
      assert.ok(entry[field].trim().length > 0, `"${field}" must not be empty`);
    }

    assert.ok(entry.what.length <= 400, `"what" is ${entry.what.length} chars — keep it under 400 (put extra detail in "tip")`);
    assert.ok(
      /^https:\/\//.test(entry.docs) || /^[a-z0-9-]+(#[A-Za-z0-9_-]+)?$/.test(entry.docs),
      `"docs" must be "page#anchor" (e.g. "queries#joins") or a full https URL, got "${entry.docs}"`
    );
    assert.ok(!/\t/.test(entry.example), 'use spaces, not tabs, in "example"');

    for (const optional of ['tip', 'also']) {
      if (optional in entry) {
        assert.equal(typeof entry[optional], 'string', `"${optional}" must be a string`);
      }
    }
    if ('since' in entry) {
      assert.match(entry.since, /^\d+(\.\d+)?$/, '"since" must look like "11" or "10.15"');
    }

    const allowed = new Set(['what', 'example', 'docs', 'tip', 'also', 'since', 'category']);
    for (const field of Object.keys(entry)) {
      assert.ok(allowed.has(field), `unknown field "${field}"`);
    }
  });
}
