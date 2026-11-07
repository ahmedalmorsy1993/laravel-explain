const test = require('node:test');
const assert = require('node:assert/strict');
const reference = require('../data');
const { frameworkVersionFromLock, docsVersionFor, isOlderThan } = require('../src/docsVersion');
const { renderMarkdown, docsUrl, plainText } = require('../src/render');

const lock = (version) => JSON.stringify({ packages: [{ name: 'laravel/framework', version }], 'packages-dev': [] });

test('reads laravel/framework version from composer.lock', () => {
  assert.deepEqual(frameworkVersionFromLock(lock('v13.2.1')), { major: 13, minor: 2, raw: 'v13.2.1' });
  assert.deepEqual(frameworkVersionFromLock(lock('11.44.0')), { major: 11, minor: 44, raw: '11.44.0' });
  assert.equal(frameworkVersionFromLock(lock('dev-master')), undefined);
  assert.equal(frameworkVersionFromLock('{not json'), undefined);
  assert.equal(frameworkVersionFromLock(JSON.stringify({ packages: [] })), undefined);
});

test('docs version per framework version', () => {
  assert.equal(docsVersionFor({ major: 13, minor: 2 }), '13.x');
  assert.equal(docsVersionFor({ major: 10, minor: 48 }), '10.x');
  assert.equal(docsVersionFor({ major: 5, minor: 8 }), '5.8');
  assert.equal(docsVersionFor(undefined), '13.x');
});

test('since comparison', () => {
  assert.equal(isOlderThan({ major: 10, minor: 14 }, '10.15'), true);
  assert.equal(isOlderThan({ major: 10, minor: 15 }, '10.15'), false);
  assert.equal(isOlderThan({ major: 10, minor: 99 }, '11'), true);
  assert.equal(isOlderThan({ major: 12, minor: 0 }, '11'), false);
  assert.equal(isOlderThan(undefined, '11'), false);
});

test('docs URL uses the docs version', () => {
  assert.equal(docsUrl({ docs: 'queries#joins' }, '11.x'), 'https://laravel.com/docs/11.x/queries#joins');
  assert.equal(docsUrl({ docs: 'https://carbon.nesbot.com/docs/' }, '11.x'), 'https://carbon.nesbot.com/docs/');
});

test('hover markdown contains explanation, example and docs link', () => {
  const markdown = renderMarkdown('addSelect', reference.addSelect, { docsVersion: '13.x' });
  assert.match(markdown, /^\*\*addSelect\(\)\*\* · _Laravel Explain_/);
  assert.match(markdown, /subquery column/);
  assert.match(markdown, /```php\n/);
  assert.match(markdown, /\[📖 Docs\]\(https:\/\/laravel\.com\/docs\/13\.x\/eloquent#subquery-selects\)/);
});

test('warns when the project is too old for an entry', () => {
  const old = renderMarkdown('whereLike', reference.whereLike, {
    docsVersion: '10.x',
    projectVersion: { major: 10, minor: 48, raw: 'v10.48.0' },
  });
  assert.match(old, /⚠️ Needs \*\*Laravel 11\+\*\* — this project uses v10\.48\.0/);

  const current = renderMarkdown('whereLike', reference.whereLike, {
    docsVersion: '13.x',
    projectVersion: { major: 13, minor: 0, raw: 'v13.0.0' },
  });
  assert.match(current, /_Available since Laravel 11\._/);
});

test('Blade examples are highlighted as blade', () => {
  assert.match(renderMarkdown('@foreach', reference['@foreach'], { docsVersion: '13.x' }), /```blade\n/);
});

test('plain text strips markdown', () => {
  assert.equal(plainText('**Adds** `select` columns'), 'Adds select columns');
});
