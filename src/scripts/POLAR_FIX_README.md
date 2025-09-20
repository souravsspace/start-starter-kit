# Polar Integration Fix

## Issue Description

The `@convex-dev/polar` package version 0.6.4 has a module resolution issue where the polyfill module exists but is not properly exported in the package.json exports field. This causes `ERR_MODULE_NOT_FOUND` errors when using TanStack Start with Vite.

### Error Details
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/path/to/node_modules/@convex-dev/polar/dist/esm/client/polyfill' imported from /path/to/node_modules/@convex-dev/polar/dist/esm/client/index.js
```

## Root Cause

The `@convex-dev/polar/dist/esm/client/index.js` file imports `"./polyfill"` but the package.json exports field doesn't include the polyfill module export, causing module resolution to fail.

## Solution Implemented

We've implemented a multi-layered fix:

### 1. Custom Vite Plugin (`src/scripts/vite-polar-polyfill-plugin.ts`)
- Intercepts polyfill imports and redirects them to our local polyfill
- Handles both relative (`./polyfill`) and absolute imports
- Written in TypeScript with proper type definitions

### 2. Local Polyfill (`src/scripts/polar-polyfill.ts`)
- Provides a compatible polyfill replacement
- Ensures the module resolution succeeds
- Converted to TypeScript for better type safety

### 3. Vite Configuration Updates (`vite.config.ts`)
- Added custom plugin to the plugin chain
- Configured aliases for different import patterns
- Added SSR and optimization configurations for better compatibility

### 4. Package Management
- Added `patch-package` for future package fixes
- Added postinstall script to apply patches automatically

## Files Modified

1. `vite.config.ts` - Added plugin and configuration
2. `src/scripts/vite-polar-polyfill-plugin.ts` - Custom Vite plugin (new, TypeScript)
3. `src/scripts/vite-polar-polyfill-plugin.d.ts` - TypeScript declarations (new)
4. `src/scripts/polar-polyfill.ts` - Local polyfill (new, TypeScript)
5. `package.json` - Added postinstall script and patch-package dependency

## Testing

To verify the fix works:

1. Run `npm run dev` - should start without module resolution errors
2. Check that Polar integration functions work properly
3. Verify subscription checkout links can be generated

## Environment Variables Required

Make sure these Convex environment variables are set:

```bash
npx convex env set POLAR_ORGANIZATION_TOKEN your_token
npx convex env set POLAR_WEBHOOK_SECRET your_secret
npx convex env set POLAR_SERVER sandbox
```

## Future Updates

When `@convex-dev/polar` fixes this issue in a future version, you can:
1. Remove the custom plugin from `vite.config.ts`
2. Delete the entire `src/scripts/` directory (or just the polar-related files)
3. Remove the resolve aliases from `vite.config.ts`
4. Update to the fixed version of `@convex-dev/polar`
