/**
 * Проверка страницы на трёх контрольных ширинах: горизонтальный скролл,
 * высоты секций, ошибки в консоли и битые картинки.
 *
 * Запуск: node scripts/audit.mjs [url]
 * По умолчанию: http://127.0.0.1:4173/
 *
 * Работает без зависимостей: поднимает системный Chrome с远 remote debugging
 * и общается с ним по Chrome DevTools Protocol через встроенный в Node
 * WebSocket.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const URL_TO_TEST = process.argv[2] ?? 'http://127.0.0.1:4173/';
const WIDTHS = [1280, 768, 375];

const CHROME =
  process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function launchChrome() {
  const dir = await mkdtemp(path.join(tmpdir(), 'sb-audit-'));
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--remote-debugging-port=0',
    `--user-data-dir=${dir}`,
    'about:blank',
  ]);

  const portFile = path.join(dir, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const [port] = (await readFile(portFile, 'utf8')).split('\n');
      if (port) return { chrome, dir, port: Number(port) };
    } catch {
      /* файл ещё не создан */
    }
    await sleep(100);
  }
  throw new Error('Chrome не отдал порт отладки');
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        message.error ? reject(new Error(message.error.message)) : resolve(message.result);
      } else if (message.method) {
        this.events.push(message);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async evaluate(expression) {
    const { result } = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return result.value;
  }
}

const MEASURE = `(() => {
  const sections = {};
  document.querySelectorAll('section[id]').forEach((section) => {
    sections[section.id] = Math.round(section.getBoundingClientRect().height);
  });
  const wide = [...document.querySelectorAll('body *')]
    .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
    .slice(0, 5)
    .map((el) => (el.className || el.tagName).toString().slice(0, 60));
  const brokenImages = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src);
  const tiny = [...document.querySelectorAll('p, span, li, a, button, label')]
    .filter((el) => el.textContent.trim() && parseFloat(getComputedStyle(el).fontSize) < 12)
    .slice(0, 5)
    .map((el) => (el.className || el.tagName).toString().slice(0, 40) + ' ' + getComputedStyle(el).fontSize);
  return {
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    pageHeight: document.body.scrollHeight,
    sections,
    overflowing: wide,
    brokenImages,
    tinyText: tiny,
  };
})()`;

const { chrome, dir, port } = await launchChrome();

try {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find((item) => item.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  const cdp = new Cdp(ws);
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Page.enable');

  for (const width of WIDTHS) {
    cdp.events.length = 0;
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await cdp.send('Page.navigate', { url: URL_TO_TEST });
    await sleep(2500);
    /* Прокручиваем страницу, чтобы сработали IntersectionObserver'ы. */
    await cdp.evaluate(`(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));
      return true;
    })()`);

    const result = await cdp.evaluate(MEASURE);
    const problems = cdp.events
      .filter((event) => event.method === 'Log.entryAdded' && event.params.entry.level === 'error')
      .map((event) => event.params.entry.text);

    console.log(`\n=== ${width}px ===`);
    console.log(
      `скролл: ${result.scrollWidth} / клиент: ${result.clientWidth} → ${
        result.scrollWidth > result.clientWidth ? 'ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ' : 'ок'
      }`,
    );
    console.log(`высота страницы: ${result.pageHeight}`);
    console.log('секции:', JSON.stringify(result.sections));
    if (result.overflowing.length) console.log('выходит за край:', result.overflowing);
    if (result.brokenImages.length) console.log('битые картинки:', result.brokenImages);
    if (result.tinyText.length) console.log('текст меньше 12px:', result.tinyText);
    if (problems.length) console.log('ошибки консоли:', problems);
  }

  ws.close();
} finally {
  chrome.kill();
  /* Профиль Chrome иногда ещё дописывается — не роняем отчёт из-за уборки. */
  await rm(dir, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
