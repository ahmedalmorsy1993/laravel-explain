/**
 * Pure helpers for picking the Laravel docs version (no `vscode` import).
 */

const FALLBACK_DOCS_VERSION = '13.x';

/**
 * Reads the installed laravel/framework version from composer.lock contents.
 *
 * @param {string} composerLockText
 * @returns {{major: number, minor: number, raw: string}|undefined}
 */
function frameworkVersionFromLock(composerLockText) {
  let lock;
  try {
    lock = JSON.parse(composerLockText);
  } catch {
    return undefined;
  }

  const packages = [...(lock.packages || []), ...(lock['packages-dev'] || [])];
  const framework = packages.find((pkg) => pkg.name === 'laravel/framework');
  if (!framework || typeof framework.version !== 'string') {
    return undefined;
  }

  const match = /^v?(\d+)\.(\d+)/.exec(framework.version);
  if (!match) {
    return undefined;
  }

  return { major: Number(match[1]), minor: Number(match[2]), raw: framework.version };
}

/**
 * Docs path segment for a framework version: Laravel 6+ uses `{major}.x`, older uses `{major}.{minor}`.
 *
 * @param {{major: number, minor: number}|undefined} version
 * @returns {string}
 */
function docsVersionFor(version) {
  if (!version) {
    return FALLBACK_DOCS_VERSION;
  }
  return version.major >= 6 ? `${version.major}.x` : `${version.major}.${version.minor}`;
}

/**
 * `true` when the project's version is older than an entry's `since` (e.g. "11" or "10.15").
 *
 * @param {{major: number, minor: number}|undefined} version
 * @param {string|undefined} since
 * @returns {boolean}
 */
function isOlderThan(version, since) {
  if (!version || !since) {
    return false;
  }
  const [major, minor = 0] = String(since).split('.').map(Number);
  return version.major < major || (version.major === major && version.minor < minor);
}

module.exports = { frameworkVersionFromLock, docsVersionFor, isOlderThan, FALLBACK_DOCS_VERSION };
