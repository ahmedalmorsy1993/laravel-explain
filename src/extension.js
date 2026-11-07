const vscode = require('vscode');
const reference = require('../data');
const { resolve, titleFor, WORD_PATTERN } = require('./resolve');
const { frameworkVersionFromLock, docsVersionFor } = require('./docsVersion');
const { renderMarkdown, docsUrl, plainText } = require('./render');

const SELECTOR = [{ language: 'php' }, { language: 'blade' }];

/** @type {Map<string, Promise<{major: number, minor: number, raw: string}|undefined>>} */
const versionCache = new Map();

/**
 * Laravel version of the project that owns the document (read from composer.lock, cached per folder).
 *
 * @param {vscode.Uri|undefined} uri
 */
function projectVersion(uri) {
  const folder = uri && vscode.workspace.getWorkspaceFolder(uri);
  if (!folder) {
    return Promise.resolve(undefined);
  }

  const cacheKey = folder.uri.toString();
  if (!versionCache.has(cacheKey)) {
    const lockUri = vscode.Uri.joinPath(folder.uri, 'composer.lock');
    versionCache.set(
      cacheKey,
      Promise.resolve(vscode.workspace.fs.readFile(lockUri)).then(
        (bytes) => frameworkVersionFromLock(Buffer.from(bytes).toString('utf8')),
        () => undefined
      )
    );
  }

  return versionCache.get(cacheKey);
}

/**
 * Docs version + project version for rendering, honouring the `laravelExplain.docsVersion` setting.
 *
 * @param {vscode.Uri|undefined} uri
 */
async function renderContext(uri) {
  const setting = vscode.workspace.getConfiguration('laravelExplain', uri).get('docsVersion', 'auto');
  const version = await projectVersion(uri);
  return {
    projectVersion: version,
    docsVersion: setting && setting !== 'auto' ? setting : docsVersionFor(version),
  };
}

function activeUri() {
  return vscode.window.activeTextEditor?.document.uri ?? vscode.workspace.workspaceFolders?.[0]?.uri;
}

/** @type {vscode.WebviewPanel|undefined} */
let panel;

/**
 * Shows an entry in a side panel (used by the search command).
 */
async function showEntry(key) {
  const entry = reference[key];
  const context = await renderContext(activeUri());
  const markdown = renderMarkdown(key, entry, context);
  const html = await vscode.commands.executeCommand('markdown.api.render', markdown);

  if (!panel) {
    panel = vscode.window.createWebviewPanel('laravelExplain', 'Laravel Explain', vscode.ViewColumn.Beside, {
      enableScripts: false,
      enableFindWidget: true,
    });
    panel.onDidDispose(() => {
      panel = undefined;
    });
  }

  panel.title = `Laravel Explain: ${titleFor(key)}`;
  panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
<style>
  body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size); color: var(--vscode-foreground); padding: 8px 20px; line-height: 1.6; max-width: 820px; }
  code { font-family: var(--vscode-editor-font-family); background: var(--vscode-textCodeBlock-background); padding: 1px 4px; border-radius: 3px; }
  pre { background: var(--vscode-textCodeBlock-background); padding: 12px; border-radius: 6px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  a { color: var(--vscode-textLink-foreground); }
</style>
</head>
<body>${html}</body>
</html>`;
  panel.reveal(vscode.ViewColumn.Beside, true);
}

/**
 * Inserts an entry's example at the cursor (or copies it when no editor is open).
 */
async function insertExample(key) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    await vscode.env.clipboard.writeText(reference[key].example);
    vscode.window.showInformationMessage('Laravel Explain: no open editor — example copied to clipboard.');
    return;
  }
  await editor.edit((builder) => {
    for (const selection of editor.selections) {
      builder.replace(selection, reference[key].example);
    }
  });
}

/**
 * Command: fuzzy search every reference entry.
 */
async function search() {
  const openDocs = { iconPath: new vscode.ThemeIcon('link-external'), tooltip: 'Open Laravel docs' };
  const insert = { iconPath: new vscode.ThemeIcon('insert'), tooltip: 'Insert example at cursor' };

  const quickPick = vscode.window.createQuickPick();
  quickPick.items = Object.entries(reference)
    .map(([key, entry]) => ({
      key,
      label: titleFor(key),
      description: entry.category,
      detail: plainText(entry.what),
      buttons: [insert, openDocs],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  quickPick.placeholder = 'Search Laravel methods, helpers, validation rules, Blade directives… (e.g. "where", "slug", "@foreach")';
  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;

  quickPick.onDidTriggerItemButton(async ({ item, button }) => {
    if (button === openDocs) {
      const context = await renderContext(activeUri());
      vscode.env.openExternal(vscode.Uri.parse(docsUrl(reference[item.key], context.docsVersion)));
      return;
    }
    quickPick.hide();
    insertExample(item.key);
  });
  quickPick.onDidAccept(() => {
    const [selected] = quickPick.selectedItems;
    quickPick.hide();
    if (selected) {
      showEntry(selected.key);
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

function activate(context) {
  const hoverProvider = {
    async provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position, WORD_PATTERN);
      if (!range) {
        return undefined;
      }

      const line = document.lineAt(position.line).text;
      const found = resolve(
        reference,
        document.getText(range),
        line.slice(0, range.start.character),
        line.slice(range.end.character),
        document.languageId
      );
      if (!found) {
        return undefined;
      }

      const markdown = renderMarkdown(found.key, found.entry, await renderContext(document.uri));
      return new vscode.Hover(new vscode.MarkdownString(markdown), range);
    },
  };

  const lockWatcher = vscode.workspace.createFileSystemWatcher('**/composer.lock');
  const clearCache = () => versionCache.clear();

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(SELECTOR, hoverProvider),
    vscode.commands.registerCommand('laravelExplain.search', search),
    lockWatcher,
    lockWatcher.onDidChange(clearCache),
    lockWatcher.onDidCreate(clearCache),
    lockWatcher.onDidDelete(clearCache),
    vscode.workspace.onDidChangeWorkspaceFolders(clearCache)
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
