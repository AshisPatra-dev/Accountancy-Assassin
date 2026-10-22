// Icon generator script — run with: node scripts/gen-icons.mjs
// Generates PWA icons (192x192, 512x512, 180x180 apple-touch) from the
// official Accountancy Assassin logo PNG.

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, '..');
const src   = join(root, 'public', 'logo.png');
const dest  = join(root, 'public', 'icons');

mkdirSync(dest, { recursive: true });

const icons = [
  { file: 'icon-192.png',        size: 192 },
  { file: 'icon-512.png',        size: 512 },
  { file: 'icon-maskable-512.png', size: 512, pad: true },  // maskable: add teal bg + 10% safe-zone padding
  { file: 'apple-touch-icon.png',  size: 180 },
];

for (const { file, size, pad } of icons) {
  let pipeline = sharp(src).resize(size, size, { fit: 'contain', background: { r: 7, g: 28, b: 27, alpha: 1 } });

  if (pad) {
    // Maskable icons need the logo inside the safe zone (80% of canvas)
    const padded = Math.round(size * 0.1);
    const inner  = size - padded * 2;
    pipeline = sharp(src)
      .resize(inner, inner, { fit: 'contain', background: { r: 7, g: 28, b: 27, alpha: 1 } })
      .extend({ top: padded, bottom: padded, left: padded, right: padded,
                background: { r: 7, g: 28, b: 27, alpha: 1 } });
  }

  await pipeline.toFile(join(dest, file));
  console.log(`✓ ${file}`);
}

// Also write a small 32x32 favicon PNG
await sharp(src)
  .resize(32, 32, { fit: 'contain', background: { r: 7, g: 28, b: 27, alpha: 1 } })
  .toFile(join(root, 'public', 'favicon-32.png'));

console.log('✓ favicon-32.png');
console.log('All icons generated.');
