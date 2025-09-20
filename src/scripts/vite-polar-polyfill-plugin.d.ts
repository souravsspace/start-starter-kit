import { Plugin } from 'vite';

/**
 * Custom Vite plugin to resolve @convex-dev/polar polyfill module
 * This fixes the module resolution issue where the polyfill exists but isn't exported
 */
export declare function polarPolyfillPlugin(): Plugin;
