/**
 * Минимальный клиент Chrome DevTools Protocol на встроенном в Node WebSocket.
 * Нужен, чтобы снимать скриншоты и мерить вёрстку без puppeteer/playwright:
 * поднимаем системный Chrome в headless и общаемся с ним напрямую.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME =
  process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : process.platform === 'win32'
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      : 'google-chrome';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launchChrome() {
  const dir = await mkdtemp(path.join(tmpdir(), 'sb-cdp-'));
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    '--remote-debugging-port=0',
    `--user-data-dir=${dir}`,
    'about:blank',
  ]);

  const portFile = path.join(dir, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const [port] = (await readFile(portFile, 'utf8')).split('\n');
      if (port) {
        const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        const page = targets.find((target) => target.type === 'page');
        if (page) return { chrome, dir, page };
      }
    } catch {
      /* Chrome ещё поднимается */
    }
    await sleep(100);
  }
  throw new Error('не удалось подключиться к Chrome');
}

export class Session {
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

  static async open(page) {
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });
    return new Session(ws);
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async evaluate(expression) {
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.text);
    return result.value;
  }

  /** Отключить анимации: появление секций сделано на scroll-driven анимациях,
   *  и на статичном снимке блоки ниже сгиба остались бы прозрачными. */
  async freezeAnimations() {
    await this.evaluate(`(() => {
      const style = document.createElement('style');
      style.textContent = '*, *::before, *::after { animation-name: none !important; transition: none !important; }';
      document.head.append(style);
      return true;
    })()`);
  }

  /**
   * Дождаться картинок перед снимком. Быстрая программная прокрутка не всегда
   * успевает запустить loading="lazy" (браузер решает это по кадрам), поэтому
   * недогруженным картинкам сначала переключаем loading в eager — это стартует
   * загрузку сразу — и только потом ждём.
   */
  async waitForImages(timeout = 10000) {
    return this.evaluate(`(async () => {
      const deadline = Date.now() + ${timeout};
      const pending = () => [...document.images].filter((img) => !img.complete);
      pending().forEach((img) => { img.loading = 'eager'; });
      while (pending().length > 0 && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 150));
      }
      return { total: document.images.length, pending: pending().length };
    })()`);
  }

  /** Открыть страницу на заданной ширине и прокрутить её целиком
   *  (ленивые картинки успевают загрузиться). */
  async openPage(url, width) {
    this.events.length = 0;
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await this.send('Page.navigate', { url });
    await sleep(2200);
    await this.evaluate(`(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 70));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
      return true;
    })()`);
  }

  close() {
    this.ws.close();
  }
}

export async function withChrome(run) {
  const { chrome, dir, page } = await launchChrome();
  const session = await Session.open(page);
  try {
    await session.send('Runtime.enable');
    await session.send('Log.enable');
    await session.send('Page.enable');
    return await run(session);
  } finally {
    session.close();
    chrome.kill();
    /* профиль иногда ещё дописывается — уборка не должна ронять отчёт */
    await rm(dir, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
  }
}
