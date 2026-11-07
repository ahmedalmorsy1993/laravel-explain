/**
 * Laravel method reference shown on hover.
 * Keys are method names; `docs` is the path after https://laravel.com/docs/{version}/.
 *
 * @type {Record<string, {what: string, tip?: string, example: string, docs: string}>}
 */
module.exports = {
  // ---------------------------------------------------------------- selecting
  select: {
    what: 'Chooses **which columns** come back from the query (`SELECT title, body ...`). Replaces any columns selected before.',
    tip: 'Use `addSelect()` to add columns without removing the ones already selected.',
    example: "Post::query()->select('id', 'title')->get();",
    docs: 'queries#select-statements',
  },
  addSelect: {
    what: '**Adds** extra columns to the SELECT without removing existing ones. Pass `[alias => subquery]` to add a **subquery column** — a value computed from another table for every row.',
    tip: 'The subquery must return one column and one row, so use `select()` + `limit(1)` inside it. The result is available as `$user->alias`.',
    example: "User::query()->addSelect([\n    'last_post_title' => Post::query()\n        ->select('title')\n        ->whereColumn('user_id', 'users.id')\n        ->latest()\n        ->limit(1),\n])->get();",
    docs: 'eloquent#subquery-selects',
  },
  selectRaw: {
    what: 'Writes part of the SELECT as **raw SQL**. Use `?` placeholders for values so they are escaped safely.',
    tip: 'Never put user input directly into the string — pass it in the bindings array.',
    example: "Order::query()->selectRaw('price * ? as price_with_tax', [1.14])->get();",
    docs: 'queries#raw-methods',
  },
  distinct: {
    what: 'Removes **duplicate rows** from the result (`SELECT DISTINCT`).',
    example: "User::query()->select('country')->distinct()->get();",
    docs: 'queries#select-statements',
  },

  // ---------------------------------------------------------------- where
  where: {
    what: 'Filters rows (`WHERE column operator value`). With two arguments the operator is `=`. Multiple `where()` calls are joined with **AND**.',
    tip: 'Pass a closure to group conditions in parentheses: `where(fn ($q) => $q->where(...)->orWhere(...))`.',
    example: "User::query()->where('is_admin', true)->where('age', '>', 18)->get();",
    docs: 'queries#where-clauses',
  },
  orWhere: {
    what: 'Adds a condition joined with **OR** instead of AND.',
    tip: 'Mixing `where` and `orWhere` without grouping can match more rows than you expect — wrap them in a closure.',
    example: "User::query()->where('role', 'admin')->orWhere('role', 'editor')->get();",
    docs: 'queries#or-where-clauses',
  },
  whereNot: {
    what: 'Negates a group of conditions (`WHERE NOT (...)`).',
    example: "Product::query()->whereNot(fn ($q) => $q->where('clearance', true)->orWhere('price', '<', 10))->get();",
    docs: 'queries#where-not-clauses',
  },
  whereColumn: {
    what: 'Compares **two columns** with each other instead of a column with a value. Inside a subquery it links the inner table to the outer one (e.g. `posts.user_id = users.id`).',
    tip: "The second argument is treated as a column name, not a string value — that's the difference from `where()`.",
    example: "Post::query()->whereColumn('user_id', 'users.id');\nUser::query()->whereColumn('updated_at', '>', 'created_at')->get();",
    docs: 'queries#additional-where-clauses',
  },
  whereIn: {
    what: 'Keeps rows whose column value is **in a list** (`WHERE id IN (1, 2, 3)`).',
    example: "User::query()->whereIn('id', [1, 2, 3])->get();",
    docs: 'queries#additional-where-clauses',
  },
  whereNotIn: {
    what: 'Keeps rows whose column value is **not in a list**.',
    example: "User::query()->whereNotIn('status', ['banned', 'deleted'])->get();",
    docs: 'queries#additional-where-clauses',
  },
  whereBetween: {
    what: 'Keeps rows where the column is **between two values** (inclusive).',
    example: "Order::query()->whereBetween('total', [100, 500])->get();",
    docs: 'queries#additional-where-clauses',
  },
  whereNull: {
    what: 'Keeps rows where the column **is NULL** (empty).',
    example: "User::query()->whereNull('email_verified_at')->get();",
    docs: 'queries#additional-where-clauses',
  },
  whereNotNull: {
    what: 'Keeps rows where the column **has a value** (IS NOT NULL).',
    example: "User::query()->whereNotNull('email_verified_at')->get();",
    docs: 'queries#additional-where-clauses',
  },
  whereDate: {
    what: 'Compares only the **date part** of a datetime column. Siblings: `whereMonth`, `whereDay`, `whereYear`, `whereTime`.',
    example: "Post::query()->whereDate('created_at', '2026-11-07')->get();",
    docs: 'queries#additional-where-clauses',
  },
  whereLike: {
    since: '11',
    what: 'Pattern search (`LIKE`). `%` means "anything". Case-insensitive by default.',
    example: "User::query()->whereLike('name', '%ahmed%')->get();",
    docs: 'queries#where-clauses',
  },
  whereAny: {
    since: '10.47',
    what: 'Matches if **any** of the given columns satisfies the condition (OR across columns). `whereAll` requires all of them.',
    example: "User::query()->whereAny(['name', 'email'], 'like', '%ahmed%')->get();",
    docs: 'queries#where-any-all-none-clauses',
  },
  whereExists: {
    what: 'Keeps rows for which the given **subquery returns at least one row**.',
    example: "User::query()->whereExists(fn ($q) => $q->select(DB::raw(1))->from('orders')->whereColumn('orders.user_id', 'users.id'))->get();",
    docs: 'queries#where-exists-clauses',
  },
  whereRaw: {
    what: 'Adds a **raw SQL** WHERE condition. Use `?` placeholders for values.',
    tip: 'Never concatenate user input into the SQL string.',
    example: "Order::query()->whereRaw('price > IF(state = \"TX\", ?, 100)', [200])->get();",
    docs: 'queries#raw-methods',
  },

  // ---------------------------------------------------------------- conditional
  when: {
    what: 'Runs the callback **only if the first argument is truthy**; otherwise runs the optional third callback. Lets you build a query conditionally without `if` blocks.',
    tip: 'The callback receives the query and the value: `fn ($query, $value) => ...`.',
    example: "User::query()\n    ->when($request->role, fn ($q, $role) => $q->where('role', $role))\n    ->get();",
    docs: 'queries#conditional-clauses',
  },
  unless: {
    what: 'The opposite of `when()`: runs the callback only if the value is **falsy**.',
    example: "User::query()->unless($showAll, fn ($q) => $q->where('active', true))->get();",
    docs: 'queries#conditional-clauses',
  },
  tap: {
    what: 'Passes the query to a callback (e.g. to apply a reusable filter) and returns the same query to keep chaining.',
    example: "Post::query()->tap(new PublishedFilter)->get();",
    docs: 'queries#conditional-clauses',
  },

  // ---------------------------------------------------------------- ordering / limits
  orderBy: {
    what: 'Sorts the results by a column. Second argument: `asc` (default) or `desc`.',
    example: "Post::query()->orderBy('created_at', 'desc')->get();",
    docs: 'queries#ordering-grouping-limit-and-offset',
  },
  orderByDesc: {
    what: 'Shortcut for `orderBy($column, \'desc\')`.',
    example: "Post::query()->orderByDesc('likes')->get();",
    docs: 'queries#ordering-grouping-limit-and-offset',
  },
  latest: {
    what: 'Sorts **newest first** — by `created_at` unless you pass another column.',
    example: "Post::query()->latest()->first();\nPost::query()->latest('published_at')->get();",
    docs: 'queries#latest-oldest',
  },
  oldest: {
    what: 'Sorts **oldest first** — by `created_at` unless you pass another column.',
    example: "Post::query()->oldest()->get();",
    docs: 'queries#latest-oldest',
  },
  inRandomOrder: {
    what: 'Returns results in **random order**.',
    example: "Quote::query()->inRandomOrder()->first();",
    docs: 'queries#random-ordering',
  },
  limit: {
    what: 'Returns at most **N rows**. Alias: `take()`.',
    example: "Post::query()->latest()->limit(5)->get();",
    docs: 'queries#limit-and-offset',
  },
  take: {
    what: 'Returns at most **N rows** (alias of `limit()`). On a collection, takes the first N items.',
    example: "User::query()->take(10)->get();",
    docs: 'queries#limit-and-offset',
  },
  skip: {
    what: 'Skips the first **N rows** (alias of `offset()`). Usually combined with `take()`.',
    example: "User::query()->skip(20)->take(10)->get();",
    docs: 'queries#limit-and-offset',
  },
  offset: {
    what: 'Skips the first **N rows**. Usually combined with `limit()`.',
    example: "User::query()->offset(20)->limit(10)->get();",
    docs: 'queries#limit-and-offset',
  },
  groupBy: {
    what: 'Groups rows that share a value so you can aggregate them (`COUNT`, `SUM`...) per group.',
    example: "Order::query()->selectRaw('user_id, sum(total) as spent')->groupBy('user_id')->get();",
    docs: 'queries#grouping',
  },
  having: {
    what: 'Filters **groups** after `groupBy()` (like `where`, but for aggregated values).',
    example: "Order::query()->selectRaw('user_id, sum(total) as spent')->groupBy('user_id')->having('spent', '>', 1000)->get();",
    docs: 'queries#grouping',
  },

  // ---------------------------------------------------------------- joins
  join: {
    what: '**INNER JOIN**: combines rows from two tables, keeping only rows that match on both sides.',
    example: "User::query()->join('posts', 'users.id', '=', 'posts.user_id')->select('users.*', 'posts.title')->get();",
    docs: 'queries#joins',
  },
  leftJoin: {
    what: '**LEFT JOIN**: keeps all rows of the main table, even when the other table has no match (those columns become NULL).',
    example: "User::query()->leftJoin('posts', 'users.id', '=', 'posts.user_id')->get();",
    docs: 'queries#left-join-right-join-clause',
  },
  joinSub: {
    what: 'Joins against a **subquery** as if it were a table.',
    example: "$latest = Post::query()->select('user_id', DB::raw('MAX(created_at) as last_post_at'))->groupBy('user_id');\nUser::query()->joinSub($latest, 'latest_posts', fn ($join) => $join->on('users.id', '=', 'latest_posts.user_id'))->get();",
    docs: 'queries#subquery-joins',
  },

  // ---------------------------------------------------------------- executing
  get: {
    what: '**Runs the query** and returns a Collection of all matching models. Until you call `get()` (or `first`, `count`...) nothing hits the database.',
    example: "$users = User::query()->where('active', true)->get();",
    docs: 'eloquent#retrieving-models',
  },
  first: {
    what: 'Runs the query and returns **the first matching model**, or `null` if none.',
    tip: 'Use `firstOrFail()` to throw a 404 instead of getting `null`.',
    example: "$user = User::query()->where('email', $email)->first();",
    docs: 'eloquent#retrieving-single-models',
  },
  firstOrFail: {
    what: 'Like `first()` but throws `ModelNotFoundException` (→ **404 page**) when nothing matches.',
    example: "$post = Post::query()->where('slug', $slug)->firstOrFail();",
    docs: 'eloquent#not-found-exceptions',
  },
  find: {
    what: 'Finds a model by its **primary key** (`id`). Returns `null` if not found. Pass an array to get several.',
    example: "$user = User::find(1);\n$users = User::find([1, 2, 3]);",
    docs: 'eloquent#retrieving-single-models',
  },
  findOrFail: {
    what: 'Finds by primary key or throws `ModelNotFoundException` (→ **404 page**).',
    example: "$user = User::findOrFail($id);",
    docs: 'eloquent#not-found-exceptions',
  },
  sole: {
    what: 'Returns the **only** matching row. Throws if there are zero rows or more than one.',
    example: "$admin = User::query()->where('is_owner', true)->sole();",
    docs: 'eloquent#retrieving-single-models',
  },
  value: {
    what: 'Returns a **single column value** from the first matching row (not a model).',
    example: "$email = User::query()->where('name', 'Ahmed')->value('email');",
    docs: 'queries#retrieving-a-single-row-column-from-a-table',
  },
  pluck: {
    what: 'Returns a collection of **just one column**. With a second argument, that column becomes the keys.',
    example: "User::query()->pluck('name');          // ['Ahmed', 'Sara']\nUser::query()->pluck('name', 'id');    // [1 => 'Ahmed', 2 => 'Sara']",
    docs: 'queries#retrieving-a-list-of-column-values',
  },
  exists: {
    what: 'Returns `true` if **at least one** row matches (faster than `count() > 0`). Opposite: `doesntExist()`.',
    example: "if (User::query()->where('email', $email)->exists()) { /* ... */ }",
    docs: 'queries#determining-if-records-exist',
  },
  count: {
    what: 'Returns **how many** rows match (runs `SELECT COUNT(*)`). On a collection, counts items in memory.',
    example: "$total = User::query()->where('active', true)->count();",
    docs: 'queries#aggregates',
  },
  sum: {
    what: 'Returns the **total** of a column for matching rows. Siblings: `avg`, `min`, `max`.',
    example: "$revenue = Order::query()->where('paid', true)->sum('total');",
    docs: 'queries#aggregates',
  },
  avg: {
    what: 'Returns the **average** of a column.',
    example: "$avgPrice = Product::query()->avg('price');",
    docs: 'queries#aggregates',
  },
  max: {
    what: 'Returns the **largest** value of a column.',
    example: "$highest = Order::query()->max('total');",
    docs: 'queries#aggregates',
  },
  min: {
    what: 'Returns the **smallest** value of a column.',
    example: "$lowest = Product::query()->min('price');",
    docs: 'queries#aggregates',
  },
  paginate: {
    what: 'Returns one **page** of results plus pagination info (total, links). Reads `?page=` from the URL automatically.',
    tip: 'In Blade: `{{ $users->links() }}` renders the page links. `simplePaginate()` skips the total count (faster).',
    example: "$users = User::query()->latest()->paginate(15);",
    docs: 'pagination#paginating-query-builder-results',
  },
  simplePaginate: {
    what: 'Like `paginate()` but only "Next / Previous" — no total count query, so it is faster on big tables.',
    example: "$posts = Post::query()->simplePaginate(20);",
    docs: 'pagination#simple-pagination',
  },
  cursorPaginate: {
    what: 'Pagination using a cursor instead of page numbers — fastest for huge tables and infinite scroll.',
    example: "$posts = Post::query()->orderBy('id')->cursorPaginate(20);",
    docs: 'pagination#cursor-pagination',
  },
  chunk: {
    what: 'Processes results **in batches** (e.g. 500 at a time) so thousands of rows don\'t fill memory.',
    tip: 'If you update the column you filter on inside the loop, use `chunkById()` to avoid skipping rows.',
    example: "User::query()->chunk(500, function ($users) {\n    foreach ($users as $user) { /* ... */ }\n});",
    docs: 'eloquent#chunking-results',
  },
  chunkById: {
    what: 'Like `chunk()` but pages by `id`, so it is safe when you update rows while looping.',
    example: "User::query()->where('active', false)->chunkById(200, fn ($users) => $users->each->delete());",
    docs: 'eloquent#chunking-results',
  },
  lazy: {
    what: 'Streams models one by one (fetched in chunks behind the scenes) — use it in a `foreach` over large tables.',
    example: "foreach (User::query()->lazy() as $user) { /* ... */ }",
    docs: 'eloquent#chunking-using-lazy-collections',
  },
  cursor: {
    what: 'Streams models one at a time with a single query — lowest memory, but cannot eager load relations.',
    example: "foreach (User::query()->cursor() as $user) { /* ... */ }",
    docs: 'eloquent#cursors',
  },
  toSql: {
    what: '**Debug**: returns the SQL string the query would run (with `?` placeholders). `toRawSql()` fills in the values.',
    example: "dd(User::query()->where('active', true)->toRawSql());",
    docs: 'queries#debugging',
  },
  toRawSql: {
    since: '10.15',
    what: '**Debug**: returns the SQL with the real values filled in, ready to paste into a DB client.',
    example: "dd(User::query()->where('active', true)->toRawSql());",
    docs: 'queries#debugging',
  },
  dd: {
    what: '**Debug**: dumps the SQL and its bindings, then stops the script. `dump()` does the same without stopping.',
    example: "User::query()->where('active', true)->dd();",
    docs: 'queries#debugging',
  },

  // ---------------------------------------------------------------- relations: loading
  with: {
    what: '**Eager loads** relations: loads them in one extra query up front instead of one query per model (avoids the **N+1 problem**).',
    tip: "Constrain what is loaded: `with(['posts' => fn ($q) => $q->where('likes', '>', 50)])`.",
    example: "$users = User::query()->with('posts')->get();\n$users = User::query()->with(['posts', 'posts.comments'])->get();",
    docs: 'eloquent-relationships#eager-loading',
  },
  load: {
    what: 'Eager loads relations on models **you already fetched** (lazy eager loading).',
    example: "$users = User::all();\n$users->load('posts');",
    docs: 'eloquent-relationships#lazy-eager-loading',
  },
  loadMissing: {
    what: 'Like `load()` but only loads relations that are **not loaded yet**.',
    example: "$user->loadMissing('posts');",
    docs: 'eloquent-relationships#lazy-eager-loading',
  },
  withCount: {
    what: 'Adds a `{relation}_count` attribute with **how many related rows** each model has — without loading them.',
    example: "$users = User::query()->withCount('posts')->get();\necho $users[0]->posts_count;",
    docs: 'eloquent-relationships#counting-related-models',
  },
  withSum: {
    what: 'Adds a `{relation}_sum_{column}` attribute with the **sum** of a related column. Siblings: `withAvg`, `withMin`, `withMax`, `withExists`.',
    example: "User::query()->withSum('orders', 'total')->get(); // ->orders_sum_total",
    docs: 'eloquent-relationships#other-aggregate-functions',
  },

  // ---------------------------------------------------------------- relations: filtering
  has: {
    what: 'Keeps only models that **have at least one** related record (optionally a minimum count).',
    example: "User::query()->has('posts')->get();\nUser::query()->has('posts', '>=', 3)->get();",
    docs: 'eloquent-relationships#querying-relationship-existence',
  },
  whereHas: {
    what: 'Keeps only models that have related records **matching a condition**.',
    tip: 'This filters the parents only — the relation is not loaded. Combine with `with()` (or use `withWhereHas()`) to also load the matching children.',
    example: "User::query()->whereHas('posts', fn ($q) => $q->where('likes', '>', 50))->get();",
    docs: 'eloquent-relationships#querying-relationship-existence',
  },
  withWhereHas: {
    what: 'Filters parents with `whereHas()` **and** eager loads only the matching children, in one call.',
    example: "User::query()->withWhereHas('posts', fn ($q) => $q->where('featured', true))->get();",
    docs: 'eloquent-relationships#constraining-eager-loads-with-relationship-existence',
  },
  doesntHave: {
    what: 'Keeps only models that have **no** related records.',
    example: "User::query()->doesntHave('posts')->get();",
    docs: 'eloquent-relationships#querying-relationship-absence',
  },
  whereDoesntHave: {
    what: 'Keeps only models that have **no related records matching** a condition.',
    example: "User::query()->whereDoesntHave('posts', fn ($q) => $q->where('banned', true))->get();",
    docs: 'eloquent-relationships#querying-relationship-absence',
  },
  whereRelation: {
    what: 'Short form of `whereHas()` for a single simple condition.',
    example: "User::query()->whereRelation('posts', 'likes', '>', 50)->get();",
    docs: 'eloquent-relationships#inline-relationship-existence-queries',
  },
  whereBelongsTo: {
    what: 'Filters by a parent model without writing the foreign key yourself.',
    example: "Post::query()->whereBelongsTo($user)->get(); // where user_id = $user->id",
    docs: 'eloquent-relationships#querying-belongs-to-relationships',
  },

  // ---------------------------------------------------------------- relations: defining
  hasOne: {
    what: 'Defines a **one-to-one** relation: this model has one related model (foreign key is on the other table).',
    example: "public function profile(): HasOne\n{\n    return $this->hasOne(Profile::class);\n}",
    docs: 'eloquent-relationships#one-to-one',
  },
  hasMany: {
    what: 'Defines a **one-to-many** relation: this model has many related models (e.g. a user has many posts).',
    example: "public function posts(): HasMany\n{\n    return $this->hasMany(Post::class);\n}",
    docs: 'eloquent-relationships#one-to-many',
  },
  belongsTo: {
    what: 'Defines the **inverse** side: this model holds the foreign key (e.g. a post belongs to a user via `user_id`).',
    example: "public function user(): BelongsTo\n{\n    return $this->belongsTo(User::class);\n}",
    docs: 'eloquent-relationships#one-to-many-inverse',
  },
  belongsToMany: {
    what: 'Defines a **many-to-many** relation through a pivot table (e.g. users ↔ roles via `role_user`).',
    example: "public function roles(): BelongsToMany\n{\n    return $this->belongsToMany(Role::class)->withTimestamps();\n}",
    docs: 'eloquent-relationships#many-to-many',
  },
  hasManyThrough: {
    what: 'Reaches distant records **through an intermediate model** (e.g. country → users → posts).',
    example: "public function posts(): HasManyThrough\n{\n    return $this->hasManyThrough(Post::class, User::class);\n}",
    docs: 'eloquent-relationships#has-many-through',
  },
  morphTo: {
    what: 'Polymorphic parent: this model can belong to **different model types** (uses `*_id` + `*_type` columns).',
    example: "public function commentable(): MorphTo\n{\n    return $this->morphTo();\n}",
    docs: 'eloquent-relationships#polymorphic-relationships',
  },
  morphMany: {
    what: 'Polymorphic one-to-many: this model has many children that can also belong to other model types.',
    example: "public function comments(): MorphMany\n{\n    return $this->morphMany(Comment::class, 'commentable');\n}",
    docs: 'eloquent-relationships#one-to-many-polymorphic-relations',
  },

  // ---------------------------------------------------------------- relations: writing
  attach: {
    what: 'Many-to-many: **adds** rows to the pivot table linking the models.',
    example: "$user->roles()->attach($roleId);\n$user->roles()->attach([1, 2], ['expires_at' => now()->addYear()]);",
    docs: 'eloquent-relationships#attaching-detaching',
  },
  detach: {
    what: 'Many-to-many: **removes** pivot rows. With no argument it removes all of them.',
    example: "$user->roles()->detach($roleId);",
    docs: 'eloquent-relationships#attaching-detaching',
  },
  sync: {
    what: 'Many-to-many: makes the pivot table contain **exactly** the given IDs — adds missing ones and removes the rest.',
    tip: 'Use `syncWithoutDetaching()` to only add.',
    example: "$user->roles()->sync([1, 2, 3]);",
    docs: 'eloquent-relationships#syncing-associations',
  },
  toggle: {
    what: 'Many-to-many: attaches IDs that are missing and detaches IDs that are present.',
    example: "$user->favorites()->toggle([$postId]);",
    docs: 'eloquent-relationships#toggling-associations',
  },
  associate: {
    what: 'BelongsTo: sets the foreign key to point at the given parent (then call `save()`).',
    example: "$post->user()->associate($user);\n$post->save();",
    docs: 'eloquent-relationships#updating-belongs-to-relationships',
  },

  // ---------------------------------------------------------------- creating / updating / deleting
  create: {
    what: '**Inserts** a new row from an array and returns the model. Only fields listed in `$fillable` / `#[Fillable]` are accepted.',
    example: "$post = Post::create(['title' => 'Hello', 'body' => '...']);\n$post = $user->posts()->create(['title' => 'Hello']); // sets user_id",
    docs: 'eloquent#mass-assignment',
  },
  firstOrCreate: {
    what: 'Finds the first row matching the attributes, or **creates it** if none exists.',
    example: "$tag = Tag::firstOrCreate(['name' => 'laravel'], ['color' => 'red']);",
    docs: 'eloquent#retrieving-or-creating-models',
  },
  firstOrNew: {
    what: 'Finds the first matching row, or returns a **new unsaved** model (call `save()` yourself).',
    example: "$user = User::firstOrNew(['email' => $email]);",
    docs: 'eloquent#retrieving-or-creating-models',
  },
  updateOrCreate: {
    what: 'Updates the row matching the first array, or **creates** it with both arrays merged.',
    example: "Flight::updateOrCreate(\n    ['departure' => 'Cairo', 'destination' => 'Dubai'],\n    ['price' => 99],\n);",
    docs: 'eloquent#upserts',
  },
  upsert: {
    what: 'Inserts many rows at once, **updating** the ones that already exist (matched by unique columns). One query.',
    example: "Flight::upsert(\n    [['departure' => 'Cairo', 'destination' => 'Dubai', 'price' => 99]],\n    uniqueBy: ['departure', 'destination'],\n    update: ['price'],\n);",
    docs: 'eloquent#upserts',
  },
  update: {
    what: 'Updates columns. On a model: updates that row. On a query: updates **every matching row** in one query (no model events).',
    example: "$post->update(['title' => 'New']);\nPost::query()->where('draft', true)->update(['draft' => false]);",
    docs: 'eloquent#updates',
  },
  save: {
    what: 'Saves the model — **INSERT** if new, **UPDATE** if it exists. Fires model events.',
    example: "$post = new Post;\n$post->title = 'Hello';\n$post->save();",
    docs: 'eloquent#inserts',
  },
  delete: {
    what: 'Deletes the model (or every matching row on a query). With `SoftDeletes` it only sets `deleted_at`.',
    example: "$post->delete();\nPost::query()->where('spam', true)->delete();",
    docs: 'eloquent#deleting-models',
  },
  destroy: {
    what: 'Deletes models **by primary key** without loading them first yourself.',
    example: "Post::destroy([1, 2, 3]);",
    docs: 'eloquent#deleting-an-existing-model-by-its-primary-key',
  },
  increment: {
    what: 'Adds to a numeric column in one query (no read needed). Opposite: `decrement()`.',
    example: "$post->increment('likes');\n$post->increment('views', 5);",
    docs: 'queries#increment-and-decrement',
  },
  fresh: {
    what: 'Re-fetches the model from the database and returns a **new** instance (original unchanged). `refresh()` reloads in place.',
    example: "$fresh = $post->fresh();",
    docs: 'eloquent#refreshing-models',
  },
  replicate: {
    what: 'Makes an **unsaved copy** of the model (without the primary key and timestamps).',
    example: "$copy = $post->replicate()->fill(['title' => 'Copy']);\n$copy->save();",
    docs: 'eloquent#replicating-models',
  },

  // ---------------------------------------------------------------- soft deletes
  withTrashed: {
    what: 'Includes **soft-deleted** rows in the results (normally hidden).',
    example: "Post::query()->withTrashed()->get();",
    docs: 'eloquent#including-soft-deleted-models',
  },
  onlyTrashed: {
    what: 'Returns **only soft-deleted** rows.',
    example: "Post::query()->onlyTrashed()->get();",
    docs: 'eloquent#retrieving-only-soft-deleted-models',
  },
  restore: {
    what: 'Un-deletes soft-deleted rows (sets `deleted_at` back to NULL).',
    example: "$post->restore();",
    docs: 'eloquent#restoring-soft-deleted-models',
  },
  forceDelete: {
    what: '**Permanently** deletes a soft-deletable model from the database.',
    example: "$post->forceDelete();",
    docs: 'eloquent#permanently-deleting-models',
  },

  // ---------------------------------------------------------------- scopes / misc
  query: {
    what: 'Starts a **new query builder** for the model. Same as calling `where()` etc. statically, but gives your editor full autocomplete.',
    example: "User::query()->where('active', true)->get();",
    docs: 'eloquent#building-queries',
  },
  withoutGlobalScopes: {
    what: 'Runs the query **without** the model\'s global scopes (all, or the ones you list).',
    example: "Post::query()->withoutGlobalScopes()->get();",
    docs: 'eloquent#removing-global-scopes',
  },
  lockForUpdate: {
    what: 'Locks the selected rows until the **transaction** ends so nobody else can change them meanwhile.',
    example: "DB::transaction(function () {\n    $account = Account::query()->lockForUpdate()->find(1);\n});",
    docs: 'queries#pessimistic-locking',
  },

  // ---------------------------------------------------------------- collections (after get())
  map: {
    what: 'Collection: transforms **each item** and returns a new collection.',
    example: "$names = $users->map(fn (User $user) => strtoupper($user->name));",
    docs: 'collections#method-map',
  },
  filter: {
    what: 'Collection: keeps items for which the callback returns `true` (in memory, not SQL).',
    example: "$admins = $users->filter(fn (User $user) => $user->is_admin);",
    docs: 'collections#method-filter',
  },
  each: {
    what: 'Collection: runs a callback for **each item** (return `false` to stop).',
    example: "$users->each(fn (User $user) => $user->notify(new Welcome));",
    docs: 'collections#method-each',
  },
  keyBy: {
    what: 'Collection: re-keys items by a field, so you can look them up by that value.',
    example: "$byEmail = $users->keyBy('email');\n$byEmail['a@b.com'];",
    docs: 'collections#method-keyby',
  },
  sortBy: {
    what: 'Collection: sorts items by a field or callback (in memory). `sortByDesc()` for reverse.',
    example: "$sorted = $users->sortBy('name');",
    docs: 'collections#method-sortby',
  },
  toArray: {
    what: 'Converts the model/collection (and loaded relations) into a plain **PHP array**.',
    example: "$array = $users->toArray();",
    docs: 'eloquent-serialization#serializing-to-arrays',
  },
  toJson: {
    what: 'Converts the model/collection into a **JSON string** (respects `$hidden` / `$appends`).',
    example: "return $user->toJson();",
    docs: 'eloquent-serialization#serializing-to-json',
  },
};
