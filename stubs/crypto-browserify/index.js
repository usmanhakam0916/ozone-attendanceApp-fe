// Deliberate no-op stub for crypto-browserify.
//
// WHY THIS EXISTS
// ---------------
// webpack 4 (via node-libs-browser) wires a Node `crypto` polyfill into every
// build unconditionally, whether or not the application uses it. That polyfill
// pulls in elliptic, whose advisory "Uses a Cryptographic Primitive with a
// Risky Implementation" applies to EVERY published version (affected range: *).
// 6.6.1 is the latest release and is still affected, so there is nothing to
// upgrade to and no fix is expected upstream.
//
// This application imports no Node builtins at all - verified: zero matches for
// crypto / querystring / path / fs / stream / buffer / util / os across src/ -
// so the polyfill is dead weight. Replacing it removes elliptic,
// browserify-sign and create-ecdh from the dependency tree entirely.
//
// webpack 5 stopped auto-polyfilling Node builtins for exactly this reason.
// This restores that behaviour on webpack 4.
//
// SAFETY
// ------
// node-libs-browser only calls require.resolve() on this package in order to
// build webpack's alias map; it never executes it. Since nothing imports
// 'crypto', this module is never loaded. If that ever changes, it throws
// loudly at import time rather than failing silently or shipping broken crypto.
//
// TO REVERT
// ---------
// Remove the "crypto-browserify" entry from `overrides` in package.json,
// delete this directory, and run `npm install`. That restores the real
// polyfill and reintroduces the 8 low-severity elliptic advisories.

throw new Error(
  "[ozone] Node's 'crypto' module is not polyfilled in browser builds. " +
    'Something imported it, directly or transitively. Either remove that import, ' +
    'or drop the crypto-browserify override in package.json to restore the real ' +
    'polyfill (which reintroduces the unfixable elliptic advisory).',
);
