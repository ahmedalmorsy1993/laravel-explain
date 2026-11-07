/**
 * Collection methods — what you work with after ->get(), ->all(), collect([...]).
 * `entries` are new keys; `also` adds a collection note to names that already
 * have a query-builder meaning in eloquent.js.
 */
const entries = {
  all: {
    what: 'On a **model**: `User::all()` fetches **every row** of the table as a collection. On a **collection**: returns the underlying plain PHP array.',
    tip: 'On big tables prefer `query()->where(...)->get()` or `paginate()` — `all()` loads everything into memory.',
    example: "$users = User::all();\n$array = collect([1, 2, 3])->all();",
    docs: 'eloquent#retrieving-models',
  },
  contains: {
    what: 'Collection: returns `true` if the collection has the given value / a matching item.',
    example: "$users->contains('email', 'a@b.com');\n$users->contains(fn (User $u) => $u->is_admin);\ncollect([1, 2, 3])->contains(2); // true",
    docs: 'collections#method-contains',
  },
  doesntContain: {
    what: 'Collection: the opposite of `contains()`.',
    example: "$roles->doesntContain('admin');",
    docs: 'collections#method-doesntcontain',
  },
  firstWhere: {
    what: 'Collection: returns the **first item** where a field equals a value (in memory).',
    example: "$admin = $users->firstWhere('role', 'admin');",
    docs: 'collections#method-first-where',
  },
  last: {
    what: 'Collection: returns the **last item** (optionally the last matching a callback).',
    example: "$latest = $posts->last();",
    docs: 'collections#method-last',
  },
  reject: {
    what: 'Collection: the opposite of `filter()` — **removes** items for which the callback returns `true`.',
    example: "$active = $users->reject(fn (User $u) => $u->is_banned);",
    docs: 'collections#method-reject',
  },
  flatMap: {
    what: 'Collection: maps each item to an array/collection and **flattens** the result one level.',
    example: "$allTags = $posts->flatMap(fn (Post $p) => $p->tags);",
    docs: 'collections#method-flatmap',
  },
  flatten: {
    what: 'Collection: turns a nested (multi-level) collection into a **single flat** list.',
    example: "collect([[1, 2], [3, [4]]])->flatten(); // [1, 2, 3, 4]",
    docs: 'collections#method-flatten',
  },
  collapse: {
    what: 'Collection: merges a collection of arrays into **one flat collection** (one level).',
    example: "collect([[1, 2], [3, 4]])->collapse(); // [1, 2, 3, 4]",
    docs: 'collections#method-collapse',
  },
  mapWithKeys: {
    what: 'Collection: builds a **key => value** collection — the callback returns `[key => value]`.',
    example: "$emails = $users->mapWithKeys(fn (User $u) => [$u->id => $u->email]);",
    docs: 'collections#method-mapwithkeys',
  },
  sortByDesc: {
    what: 'Collection: sorts by a field or callback, **largest first** (in memory).',
    example: "$top = $posts->sortByDesc('likes');",
    docs: 'collections#method-sortbydesc',
  },
  unique: {
    what: 'Collection: removes **duplicate** values (optionally by a field).',
    also: 'In a **migration** (`$table->string(\'email\')->unique()`): adds a **unique index** so the database rejects duplicate values in that column.',
    example: "$countries = $users->pluck('country')->unique();\n$table->string('email')->unique();",
    docs: 'collections#method-unique',
  },
  values: {
    what: 'Collection: **re-numbers the keys** 0, 1, 2... (useful after `filter()` / `unique()` left gaps).',
    example: "$users->filter(...)->values();",
    docs: 'collections#method-values',
  },
  keys: {
    what: 'Collection: returns only the **keys**.',
    example: "collect(['a' => 1, 'b' => 2])->keys(); // ['a', 'b']",
    docs: 'collections#method-keys',
  },
  implode: {
    what: 'Collection: joins values into **one string** with a separator.',
    example: "$users->pluck('name')->implode(', '); // 'Ahmed, Sara'",
    docs: 'collections#method-implode',
  },
  partition: {
    what: 'Collection: splits into **two collections** — items that pass the test and items that fail.',
    example: "[$adults, $minors] = $users->partition(fn (User $u) => $u->age >= 18);",
    docs: 'collections#method-partition',
  },
  countBy: {
    what: 'Collection: counts **how many times** each value (or callback result) appears.',
    example: "$users->countBy('country'); // ['EG' => 10, 'US' => 3]",
    docs: 'collections#method-countBy',
  },
  reduce: {
    what: 'Collection: reduces the collection to **a single value** by carrying a result through each item.',
    example: "$total = $orders->reduce(fn (int $carry, Order $o) => $carry + $o->total, 0);",
    docs: 'collections#method-reduce',
  },
  isEmpty: {
    what: 'Collection: `true` if there are **no items**. Opposite: `isNotEmpty()`.',
    example: "if ($users->isEmpty()) { /* show 'no users' */ }",
    docs: 'collections#method-isempty',
  },
  isNotEmpty: {
    what: 'Collection: `true` if there is **at least one** item.',
    example: "if ($posts->isNotEmpty()) { /* ... */ }",
    docs: 'collections#method-isnotempty',
  },
  push: {
    what: 'Collection: **appends** an item to the end (changes the collection).',
    example: "$names->push('Omar');",
    docs: 'collections#method-push',
  },
  merge: {
    what: 'Collection: **merges** another array/collection in. String keys overwrite, numeric keys are appended.',
    example: "$all = $admins->merge($editors);",
    docs: 'collections#method-merge',
  },
  diff: {
    what: 'Collection: returns the values that are **not** in the other array.',
    example: "collect([1, 2, 3])->diff([2]); // [1, 3]",
    docs: 'collections#method-diff',
  },
  intersect: {
    what: 'Collection: returns only the values that are **also** in the other array.',
    example: "collect([1, 2, 3])->intersect([2, 3, 4]); // [2, 3]",
    docs: 'collections#method-intersect',
  },
  every: {
    what: 'Collection: `true` if **every** item passes the test.',
    example: "$allPaid = $orders->every(fn (Order $o) => $o->paid);",
    docs: 'collections#method-every',
  },
  search: {
    what: 'Collection: returns the **key** of the given value, or `false` if not found.',
    example: "collect(['a', 'b'])->search('b'); // 1",
    docs: 'collections#method-search',
  },
  random: {
    what: 'Collection: returns a **random item** (or N random items).',
    example: "$winner = $users->random();",
    docs: 'collections#method-random',
  },
  shuffle: {
    what: 'Collection: returns the items in **random order**.',
    example: "$questions->shuffle();",
    docs: 'collections#method-shuffle',
  },
  reverse: {
    what: 'Collection: reverses the order (keeps the original keys).',
    example: "$posts->reverse()->values();",
    docs: 'collections#method-reverse',
  },
  slice: {
    what: 'Collection: returns a **portion** starting at an index (optionally with a length).',
    example: "collect([1, 2, 3, 4, 5])->slice(2, 2); // [3, 4]",
    docs: 'collections#method-slice',
  },
  transform: {
    what: 'Collection: like `map()` but **changes the collection itself** instead of returning a new one.',
    example: "$names->transform(fn (string $n) => ucfirst($n));",
    docs: 'collections#method-transform',
  },
  pipe: {
    what: 'Collection: passes the **whole collection** to a callback and returns its result.',
    example: "$total = $orders->pipe(fn ($c) => $c->sum('total'));",
    docs: 'collections#method-pipe',
  },
  only: {
    what: 'Collection: keeps **only the given keys**.',
    example: "collect(['name' => 'Ahmed', 'role' => 'admin', 'age' => 30])->only(['name', 'role']);",
    docs: 'collections#method-only',
  },
  except: {
    what: 'Collection: returns everything **except the given keys**.',
    example: "collect(['name' => 'Ahmed', 'password' => 'secret'])->except(['password']);",
    docs: 'collections#method-except',
  },
  sortKeys: {
    what: 'Collection: sorts by the **keys** instead of the values.',
    example: "collect(['b' => 2, 'a' => 1])->sortKeys();",
    docs: 'collections#method-sortkeys',
  },
};

/**
 * Collection meaning for names that also exist on the query builder.
 */
const also = {
  first: 'On a **collection**: returns the first item (or the first passing a callback) — no SQL.',
  pluck: 'On a **collection**: same idea, but in memory on items you already loaded.',
  where: 'On a **collection**: filters loaded items by a field (`$users->where(\'active\', true)`) — no SQL. On a **route**: `->where(\'id\', \'[0-9]+\')` restricts a URL parameter with a regex.',
  whereIn: 'On a **collection**: keeps loaded items whose field is in the list — no SQL.',
  take: 'On a **collection**: takes the first N items (negative N = last N).',
  skip: 'On a **collection**: skips the first N items.',
  groupBy: 'On a **collection**: groups loaded items into sub-collections by a field (`$users->groupBy(\'country\')`).',
  sum: 'On a **collection**: totals a field of the loaded items (`$orders->sum(\'total\')`).',
  avg: 'On a **collection**: averages a field of the loaded items.',
  max: 'On a **collection**: largest value of a field. Also a **validation rule** (`max:255`).',
  min: 'On a **collection**: smallest value of a field. Also a **validation rule** (`min:8`).',
  chunk: 'On a **collection**: splits items into smaller collections of N (`$users->chunk(3)` → rows of 3 for a grid).',
  join: 'On a **collection**: joins values into a string with a final glue (`->join(\', \', \' and \')`).',
  get: 'On a **collection** / config / cache: returns the item at a key (`$collection->get(\'name\', \'default\')`).',
  with: 'On a **redirect**: flashes a one-time **session message** (`redirect()->route(\'posts.index\')->with(\'status\', \'Saved!\')`, read it in Blade with `session(\'status\')`). On a **view**: passes data to Blade.',
  has: 'On a **collection**: `true` if the key exists (`collect([\'a\' => 1])->has(\'a\')`).',
  count: 'On a **collection**: counts loaded items (no SQL). Tip: `$user->posts()->count()` counts in SQL, `$user->posts->count()` loads all posts first.',
};

module.exports = { entries, also };
