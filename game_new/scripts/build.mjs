import { webcrypto as nodeWebCrypto } from 'node:crypto';

// Полифилл webcrypto для Node 18
if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.getRandomValues !== 'function') {
  globalThis.crypto = nodeWebCrypto;
}

const { build } = await import('vite');

await build();
