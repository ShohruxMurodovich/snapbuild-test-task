/**
 * Уменьшает растровые ассеты до разумной для лендинга ширины.
 * Часть картинок исходного сайта отдаётся в 5760px — на 1440px-макете
 * это лишние мегабайты и лишняя работа декодера.
 *
 * Запуск: node scripts/optimize-images.mjs
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'public/assets/images';
const MAX_WIDTH = 1920; // хватает для 1440-макета на 2x-экранах
const RASTER = new Set(['.webp', '.jpg', '.jpeg', '.png']);

const files = await readdir(DIR);
let saved = 0;

for (const name of files) {
  const ext = path.extname(name).toLowerCase();
  if (!RASTER.has(ext) || name.startsWith('favicon') || name.startsWith('apple-touch')) continue;

  const file = path.join(DIR, name);
  const before = (await stat(file)).size;
  const image = sharp(file);
  const { width } = await image.metadata();
  if (!width || width <= MAX_WIDTH) continue;

  const pipeline = sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const buffer = await (ext === '.png'
    ? pipeline.png({ compressionLevel: 9 }).toBuffer()
    : ext === '.webp'
      ? pipeline.webp({ quality: 82 }).toBuffer()
      : pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer());

  await sharp(buffer).toFile(file + '.tmp');
  const { renameSync } = await import('node:fs');
  renameSync(file + '.tmp', file);

  const after = (await stat(file)).size;
  saved += before - after;
  console.log(`${name}: ${width}px → ${MAX_WIDTH}px, ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
}

console.log(`\nосвободилось ${(saved / 1024 / 1024).toFixed(2)} MB`);
