/**
 * Migrations: Schema facade, $table-> column types / indexes, and chained column modifiers.
 */
const col = (what, example, anchor, tip) => ({ what, example, docs: `migrations#${anchor}`, ...(tip ? { tip } : {}) });

module.exports = {
  // ---------------------------------------------------------------- Schema facade
  'Schema::create': col('Creates a **new table**. The closure receives `$table` (a Blueprint) where you define the columns.', "Schema::create('posts', function (Blueprint $table) {\n    $table->id();\n    $table->string('title');\n    $table->timestamps();\n});", 'creating-tables'),
  'Schema::table': col('**Changes an existing table** — add, modify or drop columns and indexes.', "Schema::table('users', function (Blueprint $table) {\n    $table->boolean('is_admin')->default(false);\n});", 'updating-tables'),
  'Schema::dropIfExists': col('Deletes the table if it exists. Usually the body of `down()` for a `create` migration.', "Schema::dropIfExists('posts');", 'renaming-and-dropping-tables'),
  'Schema::drop': col('Deletes the table (fails if it does not exist).', "Schema::drop('posts');", 'renaming-and-dropping-tables'),
  'Schema::rename': col('Renames a table.', "Schema::rename('posts', 'articles');", 'renaming-and-dropping-tables'),
  'Schema::hasTable': col('Returns `true` if the table exists.', "if (Schema::hasTable('users')) { /* ... */ }", 'determining-table-column-existence'),
  'Schema::hasColumn': col('Returns `true` if the table has the column.', "Schema::hasColumn('users', 'email');", 'determining-table-column-existence'),

  // ---------------------------------------------------------------- column types
  '$table->id': col('Auto-incrementing **primary key** column named `id` (unsigned BIGINT).', "$table->id();", 'column-method-id'),
  '$table->string': col('**VARCHAR** column for short text (default max 255 characters).', "$table->string('title');\n$table->string('code', 10);", 'column-method-string'),
  '$table->text': col('**TEXT** column for long text (~65 KB). Bigger: `mediumText()`, `longText()`.', "$table->text('body');", 'column-method-text'),
  '$table->longText': col('**LONGTEXT** column for very long text (up to 4 GB).', "$table->longText('content');", 'column-method-longText'),
  '$table->char': col('Fixed-length **CHAR** column.', "$table->char('country_code', 2);", 'column-method-char'),
  '$table->integer': col('**INTEGER** column. Variants: `tinyInteger`, `smallInteger`, `bigInteger`, `unsignedInteger`.', "$table->integer('likes')->default(0);", 'column-method-integer'),
  '$table->bigInteger': col('**BIGINT** column for very large whole numbers.', "$table->bigInteger('views');", 'column-method-bigInteger'),
  '$table->unsignedBigInteger': col('**Unsigned BIGINT** (no negatives) — the type used by `id()` and foreign keys.', "$table->unsignedBigInteger('user_id');", 'column-method-unsignedBigInteger', 'For foreign keys prefer `foreignId()`, which does this and more.'),
  '$table->tinyInteger': col('**TINYINT** column (-128..127, or 0..255 unsigned).', "$table->tinyInteger('rating');", 'column-method-tinyInteger'),
  '$table->boolean': col('**BOOLEAN** column (stored as 0/1).', "$table->boolean('is_admin')->default(false);", 'column-method-boolean', "Add `'is_admin' => 'boolean'` to the model's casts() to get real true/false."),
  '$table->decimal': col('Exact **DECIMAL** number — use for **money**. Arguments: total digits, digits after the point.', "$table->decimal('price', 10, 2); // 99999999.99", 'column-method-decimal', 'Avoid float/double for money — they round.'),
  '$table->float': col('Approximate **FLOAT** number (may round). Use `decimal()` for money.', "$table->float('rating');", 'column-method-float'),
  '$table->double': col('Approximate **DOUBLE** number (more precision than float).', "$table->double('latitude');", 'column-method-double'),
  '$table->date': col('**DATE** column (no time).', "$table->date('birthday')->nullable();", 'column-method-date'),
  '$table->dateTime': col('**DATETIME** column (date + time).', "$table->dateTime('starts_at');", 'column-method-dateTime'),
  '$table->time': col('**TIME** column (no date).', "$table->time('opens_at');", 'column-method-time'),
  '$table->timestamp': col('**TIMESTAMP** column (date + time).', "$table->timestamp('published_at')->nullable();", 'column-method-timestamp'),
  '$table->timestamps': col('Adds `created_at` and `updated_at` — Eloquent fills them **automatically**.', "$table->timestamps();", 'column-method-timestamps'),
  '$table->softDeletes': col('Adds a nullable `deleted_at` column for **soft deletes** (also add `use SoftDeletes` to the model).', "$table->softDeletes();", 'column-method-softDeletes'),
  '$table->json': col('**JSON** column. Cast it to `array` / `collection` in the model.', "$table->json('settings')->nullable();", 'column-method-json'),
  '$table->enum': col('**ENUM** column — only the listed values are allowed.', "$table->enum('status', ['draft', 'published', 'archived'])->default('draft');", 'column-method-enum', 'Often better: a `string` column + a PHP enum cast — easier to add values later.'),
  '$table->uuid': col('**UUID** column (36-char unique id). Use `$table->uuid(\'id\')->primary()` for UUID primary keys.', "$table->uuid('uuid')->unique();", 'column-method-uuid'),
  '$table->ulid': col('**ULID** column — like UUID but sortable by time.', "$table->ulid('id')->primary();", 'column-method-ulid'),
  '$table->year': col('**YEAR** column.', "$table->year('graduation_year');", 'column-method-year'),
  '$table->ipAddress': col('Column sized for an **IP address** (IPv4 or IPv6).', "$table->ipAddress('last_login_ip')->nullable();", 'column-method-ipAddress'),
  '$table->rememberToken': col('Adds the nullable `remember_token` column used by "Remember me" login.', "$table->rememberToken();", 'column-method-rememberToken'),
  '$table->morphs': col('Adds `{name}_id` + `{name}_type` columns (and an index) for a **polymorphic** relation.', "$table->morphs('commentable'); // commentable_id, commentable_type", 'column-method-morphs'),
  '$table->nullableMorphs': col('Like `morphs()` but both columns are nullable.', "$table->nullableMorphs('taggable');", 'column-method-nullableMorphs'),

  // ---------------------------------------------------------------- foreign keys
  '$table->foreignId': col('Creates an **unsigned BIGINT** column for a foreign key (e.g. `user_id`). Chain `->constrained()` to add the actual foreign key constraint.', "$table->foreignId('user_id')->constrained()->cascadeOnDelete();", 'foreign-key-constraints'),
  '$table->foreignIdFor': col('Like `foreignId()` but takes the **model class** and figures out the column name (`User::class` → `user_id`).', "$table->foreignIdFor(User::class)->constrained();", 'foreign-key-constraints'),
  '$table->foreign': col('Adds a foreign key constraint to an **existing** column (long form). Chain `->references(\'id\')->on(\'users\')`.', "$table->foreign('user_id')->references('id')->on('users');", 'foreign-key-constraints'),
  '$table->dropForeign': col('Removes a foreign key constraint. Pass an array of columns to let Laravel build the name.', "$table->dropForeign(['user_id']);", 'dropping-foreign-keys'),
  '$table->dropConstrainedForeignId': col('Drops the foreign key **and** its column in one call.', "$table->dropConstrainedForeignId('user_id');", 'dropping-foreign-keys'),

  // ---------------------------------------------------------------- indexes / changing
  '$table->index': col('Adds an **index** to speed up WHERE / ORDER BY on the column(s).', "$table->index('email');\n$table->index(['user_id', 'created_at']);", 'creating-indexes'),
  '$table->unique': col('Adds a **unique index** — the database rejects duplicate values.', "$table->unique('email');\n$table->unique(['user_id', 'post_id']);", 'creating-indexes'),
  '$table->primary': col('Sets the **primary key** (one or more columns).', "$table->primary(['user_id', 'role_id']);", 'creating-indexes'),
  '$table->dropColumn': col('Removes column(s) from the table.', "$table->dropColumn('votes');\n$table->dropColumn(['votes', 'avatar']);", 'dropping-columns'),
  '$table->renameColumn': col('Renames a column.', "$table->renameColumn('from', 'to');", 'renaming-columns'),
  '$table->dropTimestamps': col('Removes `created_at` and `updated_at`.', "$table->dropTimestamps();", 'dropping-columns'),
  '$table->dropSoftDeletes': col('Removes the `deleted_at` column.', "$table->dropSoftDeletes();", 'dropping-columns'),

  // ---------------------------------------------------------------- chained modifiers
  nullable: col('Column modifier: the column **may be empty (NULL)**. Without it the column is required.', "$table->string('phone')->nullable();", 'column-modifiers'),
  default: col('Column modifier: the **value used when none is given** on insert.', "$table->boolean('active')->default(true);\n$table->integer('likes')->default(0);", 'column-modifiers'),
  constrained: col('Foreign key modifier: adds the **foreign key constraint**, guessing the table from the column name (`user_id` → `users.id`).', "$table->foreignId('user_id')->constrained();\n$table->foreignId('author_id')->constrained('users');", 'foreign-key-constraints'),
  cascadeOnDelete: col('Foreign key modifier: when the parent row is deleted, **delete these rows too** (e.g. delete a user → delete their posts).', "$table->foreignId('user_id')->constrained()->cascadeOnDelete();", 'foreign-key-constraints'),
  nullOnDelete: col('Foreign key modifier: when the parent is deleted, **set this column to NULL** (column must be `nullable()`).', "$table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();", 'foreign-key-constraints'),
  restrictOnDelete: col('Foreign key modifier: **block deleting** the parent while child rows exist.', "$table->foreignId('user_id')->constrained()->restrictOnDelete();", 'foreign-key-constraints'),
  cascadeOnUpdate: col('Foreign key modifier: if the parent id changes, update this column too.', "$table->foreignId('user_id')->constrained()->cascadeOnUpdate();", 'foreign-key-constraints'),
  references: col('Foreign key (long form): the **column** in the parent table.', "$table->foreign('user_id')->references('id')->on('users');", 'foreign-key-constraints'),
  on: col('Foreign key (long form): the **parent table**. In a join closure, `$join->on(a, \'=\', b)` sets the join condition.', "$table->foreign('user_id')->references('id')->on('users');", 'foreign-key-constraints'),
  after: col('Column modifier (MySQL/MariaDB): place the new column **after** another column.', "$table->string('nickname')->nullable()->after('name');", 'column-modifiers'),
  unsigned: col('Column modifier: integer **cannot be negative** (doubles the positive range).', "$table->integer('stock')->unsigned();", 'column-modifiers'),
  comment: col('Column modifier: adds a **comment** to the column in the database.', "$table->string('status')->comment('draft|published');", 'column-modifiers'),
  useCurrent: col('Timestamp modifier: default to **CURRENT_TIMESTAMP**.', "$table->timestamp('joined_at')->useCurrent();", 'column-modifiers'),
  change: col('Modifier: **change an existing column** (type/length/nullable) instead of adding a new one. Repeat every attribute you want to keep.', "$table->string('name', 100)->nullable()->change();", 'modifying-columns'),
  index: col('Column modifier: add an **index** on this column.', "$table->string('slug')->index();", 'creating-indexes'),
};
