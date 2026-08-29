// Kopiert eigene Dateien (Logo, Fotos) aus /assets nach /public/assets,
// damit sie im Portfolio unter /assets/... erreichbar sind.
// Einfach Logo + Fotos in den /assets-Ordner legen und neu bauen.
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'assets');
const dest = join(root, 'public', 'assets');

mkdirSync(dest, { recursive: true });
if (existsSync(src)) {
  cpSync(src, dest, { recursive: true });
  console.log('[sync-assets] /assets -> /public/assets kopiert.');
} else {
  console.log('[sync-assets] Kein /assets-Ordner gefunden – übersprungen.');
}
