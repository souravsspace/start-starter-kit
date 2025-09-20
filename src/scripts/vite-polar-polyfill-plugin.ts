import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Custom Vite plugin to resolve @convex-dev/polar polyfill module
 * This fixes the module resolution issue where the polyfill exists but isn't exported
 */
export function polarPolyfillPlugin(): Plugin {
  return {
    name: 'polar-polyfill-resolver',
    resolveId(id: string, importer?: string) {
      // Handle relative imports of polyfill from @convex-dev/polar
      if (id === './polyfill' && importer && importer.includes('@convex-dev/polar')) {
        // Return our local polyfill instead
        return path.resolve(__dirname, 'polar-polyfill.ts');
      }
      
      // Handle direct imports
      if (id.includes('@convex-dev/polar') && id.includes('polyfill')) {
        return path.resolve(__dirname, 'polar-polyfill.ts');
      }
      
      return null;
    }
  };
}
