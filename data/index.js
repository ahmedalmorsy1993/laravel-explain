/**
 * Merges every reference file into one lookup table.
 *
 * Key formats:
 *  - 'name'           method called with -> (or statically on a model)        e.g. 'where'
 *  - 'Class::name'    static / facade call                                    e.g. 'Route::get'
 *  - '$var->name'     method on a specific variable                           e.g. '$request->input'
 *  - 'name()'         global helper function                                  e.g. 'now()'
 *  - 'rule:name'      validation rule inside a rules string/array             e.g. 'rule:required'
 *  - '@name'          Blade directive                                         e.g. '@foreach'
 *
 * Entry fields: what (required), example (required), docs (required), tip, also, since.
 */
const collections = require('./collections');

/** @type {Array<[string, Record<string, object>]>} */
const sources = [
  ['Eloquent & Query Builder', require('./eloquent')],
  ['Collections', collections.entries],
  ['Migrations', require('./migrations')],
  ['Routes, Requests & Validation', require('./http')],
  ['Str, Arr, Dates & Helpers', require('./helpers')],
  ['Blade', require('./blade')],
];

const reference = {};
for (const [category, source] of sources) {
  for (const [key, entry] of Object.entries(source)) {
    if (reference[key]) {
      throw new Error(`Laravel Explain: duplicate key "${key}" (in ${category} and ${reference[key].category})`);
    }
    reference[key] = { ...entry, category };
  }
}

for (const [key, note] of Object.entries(collections.also)) {
  if (!reference[key]) {
    throw new Error(`Laravel Explain: collections.also["${key}"] has no matching entry`);
  }
  reference[key] = { ...reference[key], also: reference[key].also ? `${reference[key].also} ${note}` : note };
}

module.exports = reference;
