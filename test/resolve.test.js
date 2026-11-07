const test = require('node:test');
const assert = require('node:assert/strict');
const reference = require('../data');
const { resolve, titleFor } = require('../src/resolve');

/**
 * Hover `word` (the `nth` occurrence, default first) inside `line` and return the resolved key.
 */
function hover(line, word, { nth = 1, languageId = 'php' } = {}) {
  let index = -1;
  for (let i = 0; i < nth; i++) {
    index = line.indexOf(word, index + 1);
  }
  assert.ok(index >= 0, `"${word}" not found in: ${line}`);
  const found = resolve(reference, word, line.slice(0, index), line.slice(index + word.length), languageId);
  return found ? found.key : null;
}

/** [description, line, word, expected key (null = no hover), options] */
const cases = [
  ['model static method', "User::addSelect(['x' => Post::query()->select('title')])->get();", 'addSelect', 'addSelect'],
  ['chained query method', "Post::query()->select('title')->whereColumn('user_id', 'users.id')", 'whereColumn', 'whereColumn'],
  ['Route::get is a route, not a query', "Route::get('/posts', [PostController::class, 'index'])->name('posts.index');", 'get', 'Route::get'],
  ['chained ->name() on a route', "Route::get('/posts', [PostController::class, 'index'])->name('posts.index');", 'name', 'name'],
  ['Route::delete is a route, not model delete', "Route::delete('/posts/{post}', [PostController::class, 'destroy']);", 'delete', 'Route::delete'],
  ['unknown facade method shows nothing', "Route::someUnknown('/x');", 'someUnknown', null],
  ['model delete', '$post->delete();', 'delete', 'delete'],
  ['$request->validate', "$request->validate(['title' => 'required|string|max:255']);", 'validate', '$request->validate'],
  ['validation rule in a string', "$request->validate(['title' => 'required|string|max:255']);", 'required', 'rule:required'],
  ['rule with parameter', "$request->validate(['title' => 'required|string|max:255']);", 'max', 'rule:max'],
  ['field name is not a rule', "$request->validate(['title' => 'required']);", 'title', null],
  ['rule in array syntax', "'email' => ['required', 'email', 'unique:users,email'],", 'unique', 'rule:unique'],
  ['$request->get has no entry (strict receiver)', "$request->get('x');", 'get', null],
  ['request() helper maps to $request', "request()->input('name');", 'input', '$request->input'],
  ['migration column type', "$table->foreignId('user_id')->constrained()->cascadeOnDelete();", 'foreignId', '$table->foreignId'],
  ['migration modifier', "$table->foreignId('user_id')->constrained()->cascadeOnDelete();", 'cascadeOnDelete', 'cascadeOnDelete'],
  ['$table->string', "$table->string('email')->unique();", 'string', '$table->string'],
  ['chained unique (collection + migration meanings)', "$table->string('email')->unique();", 'unique', 'unique'],
  ['column name string is not a rule', "$table->string('email')->unique();", 'email', null],
  ['Schema::create', "Schema::create('posts', function (Blueprint $table) {", 'create', 'Schema::create'],
  ['Model::create', "Post::create(['title' => 'x']);", 'create', 'create'],
  ['Str::slug', '$slug = Str::slug($title);', 'slug', 'Str::slug', { nth: 2 }],
  ['Arr::get', "Arr::get($data, 'a.b');", 'get', 'Arr::get'],
  ['helper function', '$expires = now()->addDays(7);', 'now', 'now()'],
  ['date method after helper', '$expires = now()->addDays(7);', 'addDays', 'addDays'],
  ['view() helper', "return view('welcome', compact('admins', 'users'));", 'view', 'view()'],
  ['method declaration is not a helper call', 'public function view(User $user): bool', 'view', null],
  ['$this->view has no generic entry', "$this->view('x');", 'view', null],
  ['property access shows nothing', '$user->name;', 'name', null],
  ['collection method', "$users->pluck('name')->unique()->implode(', ');", 'implode', 'implode'],
  ['date method in Blade echo', '{{ $post->created_at->diffForHumans() }}', 'diffForHumans', 'diffForHumans'],
  ['redirect ->with()', "return redirect()->route('posts.index')->with('status', 'Saved');", 'with', 'with'],
  ['Blade directive', '@foreach ($users as $user)', '@foreach', '@foreach', { languageId: 'blade' }],
  ['Blade directive mid-line', "<input type=\"checkbox\" @checked($user->active)>", '@checked', '@checked', { languageId: 'blade' }],
  ['Blade directive ignored in PHP files', '@foreach ($users as $user)', '@foreach', null],
  ['email address is not a directive', 'Contact: ahmed@csrf.test', '@csrf', null, { languageId: 'blade' }],
  ['unknown Blade directive', '@livewireStyles', '@livewireStyles', null, { languageId: 'blade' }],
];

for (const [description, line, word, expected, options] of cases) {
  test(description, () => {
    assert.equal(hover(line, word, options), expected);
  });
}

test('titles', () => {
  assert.equal(titleFor('where'), 'where()');
  assert.equal(titleFor('Route::get'), 'Route::get()');
  assert.equal(titleFor('$request->input'), '$request->input()');
  assert.equal(titleFor('now()'), 'now()');
  assert.equal(titleFor('rule:required'), "'required' validation rule");
  assert.equal(titleFor('@foreach'), '@foreach');
});
