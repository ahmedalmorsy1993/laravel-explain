# Changelog

## 1.0.0

First public release.

- Hover explanations, examples and docs links for 450+ entries: Eloquent & Query Builder, collections, migrations, routes, requests, validation rules, `Str`, `Arr`, dates, global helpers and Blade directives.
- Context-aware matching (`Route::get` vs `->get()` vs `Arr::get`, strict `$request` / `$table` receivers, validation rules only inside rule strings).
- Docs links follow the project's Laravel version from `composer.lock` (`laravelExplain.docsVersion: auto`).
- "Available since" notes, with a warning when the project's Laravel version is too old.
- **Laravel Explain: Search Laravel reference** command — fuzzy search, side panel, insert example, open docs.
