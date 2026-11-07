# Contributing to Laravel Explain

Thanks for helping! The most valuable contributions are **new entries** and **clearer explanations**. No build step, no TypeScript — just edit a data file and run the tests.

## Setup

```bash
git clone https://github.com/ahmedalmorsy1993/laravel-explain.git
cd laravel-explain
npm install
npm test
```

To try your change in VS Code, open the folder and press **F5** — a new window opens with the extension loaded. Open any Laravel project in it and hover.

## Where entries live

| File | Contains |
|---|---|
| `data/eloquent.js` | Eloquent & Query Builder methods, relations, soft deletes |
| `data/collections.js` | Collection methods (`entries`), plus `also` notes for names shared with the query builder |
| `data/migrations.js` | `Schema::`, `$table->` columns/indexes, column modifiers |
| `data/http.js` | `Route::`, chained route methods, `$request->`, responses, validation rules |
| `data/helpers.js` | `Str::`, `Arr::`, Carbon dates, global helpers like `now()` |
| `data/blade.js` | Blade directives |

## Entry format

```js
'$request->boolean': {
  what: 'Gets input as **true/false** — understands "1", "true", "on", "yes" (checkboxes).', // required
  example: "$remember = $request->boolean('remember');",                                  // required
  docs: 'requests#retrieving-boolean-input-values',                                         // required
  tip: 'Optional extra advice or a common mistake.',                                        // optional
  since: '10.47',                                                                           // optional: first Laravel version
},
```

### Keys — how hovering finds an entry

| Key | Matches | Example |
|---|---|---|
| `name` | `->name(` or a model's `Model::name(` | `where` |
| `Class::name` | static / facade calls | `Route::get`, `Str::slug` |
| `$var->name` | a method on a specific variable (`request()->` counts as `$request->`) | `$request->input`, `$table->string` |
| `name()` | global helper functions | `now()`, `route()` |
| `rule:name` | a validation rule inside a rules string or array | `rule:required` |
| `@name` | Blade directives (in `.blade.php` files) | `@foreach` |

Facades like `Route`, `Str`, `Schema` and the `$request` / `$table` variables are **strict**: they only match their own entries, so `Route::delete()` never shows the Eloquent `delete()` text. If a name means different things in different places, keep one entry and add the other meaning to `also` in `data/collections.js`.

### Writing guidelines

- **Explain what it does and when to use it**, in plain English, for someone new to Laravel. One or two sentences; put extra detail in `tip`.
- Use `**bold**` for the key idea. Keep `what` under 400 characters.
- Examples must be **valid, modern Laravel** (no `$dates`, no `Model::where` without `query()` where it matters, use typed closures where helpful). Prefer realistic names (`Post`, `User`, `$request`).
- `docs` is `page#anchor` from `https://laravel.com/docs/13.x/page#anchor`. Copy the anchor from the URL after clicking a heading on laravel.com. Non-Laravel docs may use a full `https://` URL.
- Add `since` only when you're sure of the version that introduced the feature.

## Checks

```bash
npm test             # validates every entry + hover matching
npm run check-links  # verifies every docs link exists in laravel/docs (needs internet)
```

Both run automatically on every pull request. If you add a new kind of match, add a case to `test/resolve.test.js`.

## Pull requests

1. Fork and create a branch (`add-collection-methods`, `fix-where-explanation`).
2. Make your change and run `npm test && npm run check-links`.
3. Open a PR describing what you added or changed. Small focused PRs get merged fastest.

By contributing you agree that your contribution is licensed under the MIT License.
