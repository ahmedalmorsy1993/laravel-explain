/**
 * Blade directives (hover in .blade.php files). Keys start with `@`.
 */
const d = (what, example, anchor, tip) => ({ what, example, docs: anchor.includes('#') ? anchor : `blade#${anchor}`, ...(tip ? { tip } : {}) });

module.exports = {
  // ---------------------------------------------------------------- conditionals
  '@if': d('Shows the block **only if** the condition is true. Use `@elseif` / `@else`, close with `@endif`.', "@if ($posts->isEmpty())\n    <p>No posts yet.</p>\n@elseif ($posts->count() === 1)\n    <p>One post.</p>\n@else\n    <p>{{ $posts->count() }} posts.</p>\n@endif", 'if-statements'),
  '@unless': d('Shows the block **unless** the condition is true (an inverted `@if`).', "@unless (auth()->user()->is_admin)\n    <p>You are not an admin.</p>\n@endunless", 'if-statements'),
  '@isset': d('Shows the block if the variable **is defined and not null**.', "@isset($title)\n    <h1>{{ $title }}</h1>\n@endisset", 'if-statements'),
  '@empty': d('Shows the block if the variable is **empty** (`null`, `[]`, `""`, `0`). Inside `@forelse` it is the "no items" part.', "@empty($posts)\n    <p>No posts.</p>\n@endempty", 'if-statements'),
  '@auth': d('Shows the block only for **logged-in** users. Optional guard: `@auth(\'admin\')`.', "@auth\n    <a href=\"{{ route('dashboard') }}\">Dashboard</a>\n@endauth", 'authentication-directives'),
  '@guest': d('Shows the block only for **guests** (not logged in).', "@guest\n    <a href=\"{{ route('login') }}\">Log in</a>\n@endguest", 'authentication-directives'),
  '@can': d('Shows the block if the user is **authorized** (policy / gate). Siblings: `@cannot`, `@canany`.', "@can('update', $post)\n    <a href=\"{{ route('posts.edit', $post) }}\">Edit</a>\n@endcan", 'authorization#via-blade-templates'),
  '@cannot': d('Shows the block if the user is **not authorized**.', "@cannot('delete', $post)\n    <p>You can't delete this post.</p>\n@endcannot", 'authorization#via-blade-templates'),
  '@canany': d('Shows the block if the user is authorized for **any** of the abilities.', "@canany(['update', 'delete'], $post)\n    <div class=\"actions\">...</div>\n@endcanany", 'authorization#via-blade-templates'),
  '@production': d('Shows the block only when `APP_ENV=production`.', "@production\n    <script src=\"analytics.js\"></script>\n@endproduction", 'environment-directives'),
  '@env': d('Shows the block only in the given environment(s).', "@env(['local', 'staging'])\n    <div class=\"debug-bar\">...</div>\n@endenv", 'environment-directives'),
  '@session': d('Shows the block if a **session value** exists (e.g. a flash message); `$value` holds it inside.', "@session('status')\n    <div class=\"alert\">{{ $value }}</div>\n@endsession", 'session-directives'),
  '@hasSection': d('`true` if a child view filled the given **section**.', "@hasSection('sidebar')\n    <aside>@yield('sidebar')</aside>\n@endif", 'section-directives'),
  '@switch': d('A `switch` statement. Use `@case`, `@break`, `@default`, close with `@endswitch`.', "@switch($status)\n    @case('draft')\n        <span>Draft</span>\n        @break\n    @default\n        <span>Published</span>\n@endswitch", 'switch-statements'),

  // ---------------------------------------------------------------- loops
  '@foreach': d('Loops over an array/collection. Inside, `$loop` gives `index`, `iteration`, `first`, `last`, `count`, `even`/`odd`.', "@foreach ($users as $user)\n    <li @class(['font-bold' => $loop->first])>{{ $loop->iteration }}. {{ $user->name }}</li>\n@endforeach", 'loops', 'Use `@forelse` when you also need an "empty" message.'),
  '@forelse': d('Like `@foreach` but with an `@empty` part shown when there are **no items**.', "@forelse ($posts as $post)\n    <li>{{ $post->title }}</li>\n@empty\n    <li>No posts yet.</li>\n@endforelse", 'loops'),
  '@for': d('A classic counting `for` loop.', "@for ($i = 1; $i <= 5; $i++)\n    <span>{{ $i }}</span>\n@endfor", 'loops'),
  '@while': d('Loops **while** the condition is true.', "@while ($queue->isNotEmpty())\n    {{ $queue->shift() }}\n@endwhile", 'loops'),
  '@continue': d('Skips to the **next** loop iteration (optionally with a condition).', "@foreach ($users as $user)\n    @continue($user->is_banned)\n    <li>{{ $user->name }}</li>\n@endforeach", 'loops'),
  '@break': d('**Stops** the loop (optionally with a condition). Also ends a `@case` in `@switch`.', "@foreach ($posts as $post)\n    @break($loop->iteration > 5)\n    <li>{{ $post->title }}</li>\n@endforeach", 'loops'),

  // ---------------------------------------------------------------- attributes
  '@class': d('Builds a `class="..."` attribute from an array — keys with a `true` value are included.', "<span @class(['p-4', 'font-bold' => $isActive, 'text-red-500' => $hasError])></span>", 'conditional-classes'),
  '@style': d('Builds a `style="..."` attribute from an array — entries with a `true` value are included.', "<span @style(['background-color: red', 'font-weight: bold' => $isActive])></span>", 'conditional-classes'),
  '@checked': d('Adds `checked` to a checkbox/radio when the condition is true.', "<input type=\"checkbox\" name=\"active\" @checked(old('active', $user->active))>", 'additional-attributes'),
  '@selected': d('Adds `selected` to an `<option>` when the condition is true.', "<option value=\"{{ $v }}\" @selected(old('version') == $v)>{{ $v }}</option>", 'additional-attributes'),
  '@disabled': d('Adds `disabled` when the condition is true.', "<button type=\"submit\" @disabled($errors->isNotEmpty())>Save</button>", 'additional-attributes'),
  '@readonly': d('Adds `readonly` when the condition is true.', "<input name=\"email\" value=\"{{ $user->email }}\" @readonly(! $user->is_admin)>", 'additional-attributes'),
  '@required': d('Adds `required` when the condition is true.', "<input name=\"title\" @required($user->is_admin)>", 'additional-attributes'),

  // ---------------------------------------------------------------- including views
  '@include': d('Inserts another Blade view here. It sees the parent\'s variables; pass more as an array.', "@include('partials.alert', ['type' => 'success'])", 'including-subviews'),
  '@includeIf': d('Includes the view **only if it exists** (no error otherwise).', "@includeIf('partials.ads')", 'including-subviews'),
  '@includeWhen': d('Includes the view **when** the condition is true. Opposite: `@includeUnless`.', "@includeWhen($user->is_admin, 'partials.admin-menu')", 'including-subviews'),
  '@includeFirst': d('Includes the **first view that exists** from a list.', "@includeFirst(['custom.header', 'header'])", 'including-subviews'),
  '@includeIsolated': d('Includes a view that **does not inherit** the parent\'s variables — only what you pass.', "@includeIsolated('partials.card', ['post' => $post])", 'including-subviews'),
  '@each': d('Renders a view **for each item** of a collection in one line (optional view for "empty").', "@each('posts.item', $posts, 'post', 'posts.empty')", 'rendering-views-for-collections'),

  // ---------------------------------------------------------------- layouts
  '@extends': d('Makes this view use a **layout**. Fill the layout\'s `@yield` slots with `@section`.', "@extends('layouts.app')\n\n@section('title', 'Home')\n\n@section('content')\n    <h1>Welcome</h1>\n@endsection", 'extending-a-layout'),
  '@section': d('Defines content for a layout slot (`@yield`). Short form: `@section(\'title\', \'Home\')`.', "@section('content')\n    <p>Page body</p>\n@endsection", 'extending-a-layout'),
  '@yield': d('In a **layout**: the place where a child view\'s `@section` content is shown (optional default).', "<title>@yield('title', 'My App')</title>\n<main>@yield('content')</main>", 'defining-a-layout'),
  '@parent': d('Inside a `@section`: inserts the **layout\'s original** content of that section, so you add instead of replace.', "@section('sidebar')\n    @parent\n    <p>Extra sidebar item</p>\n@endsection", 'extending-a-layout'),
  '@stack': d('In a layout: outputs everything pushed to a named **stack** (e.g. page-specific scripts).', "<head>\n    @stack('scripts')\n</head>", 'stacks'),
  '@push': d('Adds content to a named **stack** (`@stack`) in the layout — e.g. a script only this page needs.', "@push('scripts')\n    <script src=\"/chart.js\"></script>\n@endpush", 'stacks', 'Use `@pushOnce` inside components that render many times.'),
  '@prepend': d('Adds content to the **start** of a stack.', "@prepend('scripts')\n    <script src=\"/first.js\"></script>\n@endprepend", 'stacks'),
  '@pushOnce': d('Pushes to a stack **only once** per page, even if the view renders many times.', "@pushOnce('scripts')\n    <script src=\"/datepicker.js\"></script>\n@endPushOnce", 'the-once-directive'),
  '@once': d('Renders the block **only once** per page (e.g. inside a component used in a loop).', "@once\n    <style>.card { ... }</style>\n@endonce", 'the-once-directive'),

  // ---------------------------------------------------------------- forms
  '@csrf': d('Adds the hidden **CSRF token** field. Every POST/PUT/PATCH/DELETE form needs it (otherwise **419 Page Expired**).', "<form method=\"POST\" action=\"{{ route('posts.store') }}\">\n    @csrf\n    ...\n</form>", 'csrf-field'),
  '@method': d('HTML forms only send GET/POST — this adds a hidden field so Laravel treats it as **PUT / PATCH / DELETE**.', "<form method=\"POST\" action=\"{{ route('posts.destroy', $post) }}\">\n    @csrf\n    @method('DELETE')\n    <button>Delete</button>\n</form>", 'method-field'),
  '@error': d('Shows the block if the field has a **validation error**; `$message` holds the error text.', "<input name=\"title\" @class(['border-red-500' => $errors->has('title')])>\n@error('title')\n    <p class=\"text-red-500\">{{ $message }}</p>\n@enderror", 'validation-errors'),

  // ---------------------------------------------------------------- components
  '@props': d('In an **anonymous component**: declares which attributes are data props (with defaults). Others land in `$attributes`.', "{{-- resources/views/components/alert.blade.php --}}\n@props(['type' => 'info', 'message'])\n\n<div {{ $attributes->merge(['class' => 'alert-'.$type]) }}>{{ $message }}</div>", 'data-properties-attributes'),
  '@aware': d('In a child component: reads a prop from the **parent component** without passing it again.', "@aware(['color' => 'gray'])\n<li class=\"text-{{ $color }}\">{{ $slot }}</li>", 'accessing-parent-data'),

  // ---------------------------------------------------------------- php / misc
  '@php': d('Runs **raw PHP** inside the view. Keep logic in controllers when you can.', "@php\n    $total = $items->sum('price');\n@endphp", 'raw-php'),
  '@use': d('Imports a PHP class into the view (like a `use` statement).', "@use('App\\Models\\Post')\n\n{{ Post::count() }} posts", 'raw-php'),
  '@inject': d('Gets a **service from the container** into a variable in the view.', "@inject('metrics', 'App\\Services\\MetricsService')\n\n{{ $metrics->monthlyRevenue() }}", 'service-injection'),
  '@verbatim': d('Shows `{{ }}` **as-is** (not processed by Blade) — for JavaScript frameworks like Vue.', "@verbatim\n    <div>Hello, {{ name }}.</div>\n@endverbatim", 'the-at-verbatim-directive'),
  '@fragment': d('Marks part of the view so it can be rendered **alone** (e.g. for htmx / Turbo partial updates).', "@fragment('user-list')\n    <ul>...</ul>\n@endfragment\n\n// controller: view('dashboard')->fragment('user-list')", 'rendering-blade-fragments'),
  '@vite': d('Adds the `<script>` / `<link>` tags for your **Vite** assets (hot reload in dev, built files in production).', "<head>\n    @vite(['resources/css/app.css', 'resources/js/app.js'])\n</head>", 'vite#loading-your-scripts-and-styles', 'Seeing "Unable to locate file in Vite manifest"? Run `npm run dev` or `npm run build`.'),
  '@fonts': d('Renders font **preload links and CSS** for fonts configured with Vite font optimization. Put it in `<head>`.', "<head>\n    @fonts\n    @vite('resources/js/app.js')\n</head>", 'fonts'),
};
