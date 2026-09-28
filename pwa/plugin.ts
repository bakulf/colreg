import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Emits sw.js with the list of every file the build produced — the bundle and
 * the public directory — and a version derived from their contents.
 *
 * Hand-written rather than a PWA plugin: the whole job is "cache these files",
 * the list is known exactly at build time, and the worker it produces is short
 * enough to read in full (pwa/sw.js).
 */

const TEMPLATE = new URL('./sw.js', import.meta.url);

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export function precache(): Plugin {
  let publicDir = '';
  return {
    name: 'colreg-precache',
    apply: 'build',
    // After Vite has emitted index.html, which it does late in the same hook.
    enforce: 'post',
    configResolved(config) {
      publicDir = config.publicDir;
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const files = new Map<string, string | Uint8Array>();
        for (const [name, item] of Object.entries(bundle)) {
          if (name.endsWith('.map')) continue;
          files.set(name, item.type === 'chunk' ? item.code : item.source);
        }
        for (const full of walk(publicDir)) {
          files.set(relative(publicDir, full).split(sep).join('/'), readFileSync(full));
        }

        const names = [...files.keys()].sort();
        if (!names.includes('index.html')) {
          throw new Error('precache: index.html was not in the bundle');
        }
        const template = readFileSync(TEMPLATE, 'utf8');
        // The worker's own code counts too: changing the caching strategy
        // alone must still produce a new cache.
        const hash = createHash('sha256').update(template);
        for (const name of names) {
          hash.update(name);
          hash.update(files.get(name) as string | Uint8Array);
        }
        const version = hash.digest('hex').slice(0, 12);

        const source = template
          .replace('__VERSION__', JSON.stringify(version))
          .replace('__PRECACHE__', JSON.stringify(names));
        this.emitFile({ type: 'asset', fileName: 'sw.js', source });
      },
    },
  };
}
