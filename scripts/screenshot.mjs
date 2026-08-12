/**
 * Скриншоты страницы целиком на трёх контрольных ширинах — ими я сверял
 * вёрстку с исходным лендингом.
 *
 * Запуск: node scripts/screenshot.mjs [url] [outDir]
 * По умолчанию: http://127.0.0.1:4173/ → .screenshots/
 *
 * Перед снимком страница прокручивается до конца, иначе секции с появлением
 * при скролле останутся прозрачными.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { withChrome } from './lib/cdp.mjs';

const url = process.argv[2] ?? 'http://127.0.0.1:4173/';
const outDir = process.argv[3] ?? '.screenshots';
const widths = [1280, 768, 375];

await mkdir(outDir, { recursive: true });

await withChrome(async (session) => {
  for (const width of widths) {
    await session.openPage(url, width);
    const images = await session.waitForImages();
    await session.freezeAnimations();
    const { data } = await session.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    const file = `${outDir}/page-${width}.png`;
    await writeFile(file, Buffer.from(data, 'base64'));
    const height = await session.evaluate('document.body.scrollHeight');
    console.log(
      `${width}×${height} → ${file} (картинок ${images.total}, не загрузилось ${images.pending})`,
    );
  }
});
