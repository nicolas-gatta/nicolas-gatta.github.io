import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = (process.env.TEST_URL || 'http://127.0.0.1:4173/').replace(
  /\/?$/,
  '/'
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : process.platform === 'win32'
      ? {
          executablePath:
            'C:/Program Files/Google/Chrome/Application/chrome.exe',
        }
      : { channel: 'chrome' }),
});
const results = [];
const errors = [];
await mkdir('.qa/intro', { recursive: true });

function watch(page) {
  page.on('pageerror', (error) => errors.push(error.message));
  return page;
}
async function trackVoice(context) {
  await context.addInitScript(() => {
    window.__introVoiceEvents = [];
    const start = AudioBufferSourceNode.prototype.start;
    const stop = AudioBufferSourceNode.prototype.stop;
    AudioBufferSourceNode.prototype.start = function (...args) {
      if (this.buffer && !this.loop) {
        const record = {
          duration: this.buffer.duration,
          ended: false,
          stopped: false,
        };
        this.__introVoiceRecord = record;
        window.__introVoiceEvents.push(record);
        this.addEventListener('ended', () => { record.ended = true; });
      }
      return start.apply(this, args);
    };
    AudioBufferSourceNode.prototype.stop = function (...args) {
      if (this.__introVoiceRecord) this.__introVoiceRecord.stopped = true;
      return stop.apply(this, args);
    };
  });
}
async function check(name, run) {
  await run();
  results.push(name);
  console.log(`PASS ${name}`);
}
const activeHero = '[data-testid="digital-hero"][data-intro-active="true"]';
const completeHero = '[data-testid="digital-hero"][data-intro-active="false"]';
const introDialog = (page) =>
  page.getByRole('dialog', { name: 'Optional portfolio introduction' });
const skipButton = (page) =>
  page.getByRole('button', { name: 'Skip intro and explore the portfolio' });
async function waitForCompletedHero(page) {
  await page.locator(completeHero).waitFor({ timeout: 12000 });
  await page
    .getByRole('heading', { name: 'NICOLAS GATTA.', exact: true })
    .waitFor();
  assert.equal(await page.locator('dialog[open]').count(), 0);
}
async function worldPixels(page) {
  return page.getByTestId('digital-world').evaluate((canvas) => {
    const context = canvas.getContext('2d');
    if (!context) return null;
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let samples = 0;
    let dark = 0;
    let cyan = 0;
    for (let index = 0; index < data.length; index += 64) {
      samples++;
      const [red, green, blue] = data.subarray(index, index + 3);
      if (Math.max(red, green, blue) < 32) dark++;
      if (green > 45 && blue > 50 && red < green * 0.7) cyan++;
    }
    return { darkFraction: dark / samples, cyanFraction: cyan / samples };
  });
}

try {
  await check(
    'Full world construction retains one real hero and finishes without a page cut',
    async () => {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'no-preference',
      });
      // Visitors who saw the replaced boot sequence still get this new opening once.
      await context.addInitScript(() =>
        sessionStorage.setItem('ng:intro-seen', 'true')
      );
      const page = watch(await context.newPage());
      const requests = [];
      page.on('request', (request) => requests.push(request.url()));
      await page.goto(base);
      await page.locator(`${activeHero}[data-intro-variant="full"]`).waitFor();
      await introDialog(page).waitFor();
      const firstHero = await page.getByTestId('digital-hero').elementHandle();
      const started = Date.now();
      const visualStats = [];
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(
        await page
          .getByRole('button', { name: 'Enable sound', exact: true })
          .getAttribute('aria-pressed'),
        'false'
      );
      const fullText = await page.locator('body').innerText();
      assert(
        !/INITIALIZING|SYSTEM\s+READY/.test(fullText),
        'The cinematic should not show software boot messages.'
      );

      for (const [time, phase] of [
        [800, 'point'],
        [1900, 'horizon'],
        [3500, 'architecture'],
        [5200, 'identity'],
      ]) {
        const wait = time - (Date.now() - started);
        if (wait > 0) await page.waitForTimeout(wait);
        await page.screenshot({ path: `.qa/intro/desktop-${phase}.png` });
        visualStats.push({ phase, pixels: await worldPixels(page) });
      }
      await waitForCompletedHero(page);
      assert(
        await firstHero.evaluate((element) => element.isConnected),
        'The same hero should survive the transition.'
      );
      assert.equal(await page.locator('h1').count(), 1);
      assert(
        !requests.some((url) =>
          /DeskScene|GarageScene|useSceneVisibility/.test(url)
        ),
        'The cinematic should not request Lab WebGL chunks.'
      );
      await page.screenshot({ path: '.qa/intro/desktop-complete.png' });
      visualStats.push({ phase: 'complete', pixels: await worldPixels(page) });
      await writeFile(
        '.qa/intro/pixel-stats.json',
        JSON.stringify(visualStats, null, 2)
      );
      await page.evaluate(() =>
        window.scrollTo({ top: 170, behavior: 'instant' })
      );
      await page.waitForTimeout(350);
      assert(await firstHero.evaluate((element) => element.isConnected));
      assert(
        (await page.evaluate(() => window.scrollY)) > 100,
        'The completed hero must allow ordinary scrolling.'
      );
      await page.screenshot({ path: '.qa/intro/desktop-first-scroll.png' });
      await page.getByRole('link', { name: 'View my CV', exact: true }).click();
      await page
        .getByRole('link', { name: 'Download PDF', exact: true })
        .waitFor();
      await context.close();
    }
  );

  await check(
    'Skip, Escape and the two intro controls stay keyboard accessible',
    async () => {
      const context = await browser.newContext({
        reducedMotion: 'no-preference',
      });
      const page = watch(await context.newPage());
      await page.goto(base);
      await skipButton(page).waitFor();
      const focused = new Set();
      for (let index = 0; index < 4; index++) {
        await page.keyboard.press('Tab');
        focused.add(
          await page.evaluate(() =>
            document.activeElement?.getAttribute('aria-label')
          )
        );
        assert(
          await page.evaluate(
            () => !!document.activeElement?.closest('dialog')
          ),
          'Tab must stay inside the cinematic controls.'
        );
      }
      assert(
        focused.has('Enable sound') &&
          focused.has('Skip intro and explore the portfolio')
      );
      await page.keyboard.press('Escape');
      await waitForCompletedHero(page);
      assert.notEqual(
        await page.evaluate(() => document.body.style.overflow),
        'hidden'
      );
      assert.equal(await page.evaluate(() => window.scrollY), 0);
      await context.close();
    }
  );

  await check(
    'Session return uses a short pulse and internal navigation does not replay it',
    async () => {
      const context = await browser.newContext({
        reducedMotion: 'no-preference',
      });
      const page = watch(await context.newPage());
      await page.goto(base);
      await skipButton(page).click();
      await waitForCompletedHero(page);
      const started = Date.now();
      await page.reload();
      await page
        .locator('[data-testid="digital-hero"][data-intro-variant="short"]')
        .waitFor();
      await waitForCompletedHero(page);
      assert(
        Date.now() - started < 4000,
        'Returning visitors should get only the brief version.'
      );
      await page
        .getByRole('link', { name: 'Projects', exact: true })
        .click();
      await page.getByRole('link', { name: 'All projects', exact: true }).click();
      await page
        .getByRole('heading', { name: /Built with/, level: 1 })
        .waitFor();
      await page.getByRole('link', { name: /Nicolas Gatta.*home/ }).click();
      await waitForCompletedHero(page);
      assert.equal(
        await page
          .getByTestId('digital-hero')
          .getAttribute('data-intro-variant'),
        'still'
      );
      await context.close();
    }
  );

  await check(
    'Reduced motion and direct section links bypass the cinematic',
    async () => {
      const reduced = await browser.newContext({ reducedMotion: 'reduce' });
      const simple = watch(await reduced.newPage());
      await simple.goto(base);
      await waitForCompletedHero(simple);
      assert.equal(
        await simple
          .getByTestId('digital-hero')
          .getAttribute('data-intro-variant'),
        'still'
      );
      await simple.screenshot({ path: '.qa/intro/reduced-motion.png' });
      await reduced.close();

      const direct = await browser.newContext({
        reducedMotion: 'no-preference',
      });
      const section = watch(await direct.newPage());
      await section.goto(`${base}#/?section=about`);
      await waitForCompletedHero(section);
      await section.locator('#about').waitFor();
      await section.waitForFunction(() => {
        const top = document
          .querySelector('#about')
          ?.getBoundingClientRect().top;
        return (
          top >= 0 &&
          top < innerHeight * 0.6 &&
          document.activeElement?.id === 'about'
        );
      });
      await direct.close();
    }
  );

  await check(
    'Phone resizing keeps the world and skip controls within the viewport',
    async () => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: 'no-preference',
      });
      const page = watch(await context.newPage());
      await page.goto(base);
      await introDialog(page).waitFor();
      await page.waitForTimeout(2500);
      await page.screenshot({ path: '.qa/intro/mobile-construction.png' });
      await page.setViewportSize({ width: 320, height: 740 });
      const bounds = await skipButton(page).boundingBox();
      assert(
        bounds.x >= 0 && bounds.x + bounds.width <= 320,
        'Skip must stay inside a narrow phone screen.'
      );
      assert(bounds.y >= 0 && bounds.y + bounds.height <= 740);
      await skipButton(page).click();
      await waitForCompletedHero(page);
      const size = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      assert(
        size.scroll <= size.width + 1,
        `Narrow hero overflow: ${JSON.stringify(size)}`
      );
      await page.screenshot({
        path: '.qa/intro/mobile-complete.png',
        fullPage: true,
      });
      await context.close();
    }
  );

  await check(
    'Canvas failure preserves the actual hero, CV and skip action',
    async () => {
      const context = await browser.newContext({
        reducedMotion: 'no-preference',
      });
      await context.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
          return kind === '2d' ? null : original.call(this, kind, ...args);
        };
      });
      const page = watch(await context.newPage());
      await page.goto(base);
      await skipButton(page).click();
      await waitForCompletedHero(page);
      await page.getByRole('link', { name: 'View my CV', exact: true }).click();
      await page
        .getByRole('link', { name: 'Download PDF', exact: true })
        .waitFor();
      await context.close();
    }
  );

  await check(
    'Audio remains uninitialized until an explicit sound toggle',
    async () => {
      const context = await browser.newContext({
        reducedMotion: 'no-preference',
      });
      await trackVoice(context);
      await context.addInitScript(() => {
        window.__introAudioContexts = 0;
        const Original = window.AudioContext || window.webkitAudioContext;
        if (Original) {
          const Tracked = new Proxy(Original, {
            construct(Target, args, NewTarget) {
              window.__introAudioContexts++;
              return Reflect.construct(Target, args, NewTarget);
            },
          });
          window.AudioContext = Tracked;
          if (window.webkitAudioContext) window.webkitAudioContext = Tracked;
        }
      });
      const page = watch(await context.newPage());
      const voiceRequests = [];
      page.on('request', (request) => {
        if (request.url().endsWith('/audio/connection-voice.wav'))
          voiceRequests.push(request.url());
      });
      await page.goto(base);
      const sound = page.getByRole('button', {
        name: 'Enable sound',
        exact: true,
      });
      await sound.waitFor();
      assert.equal(await page.evaluate(() => window.__introAudioContexts), 0);
      assert.equal(voiceRequests.length, 0, 'Muted intros must not download speech.');
      await sound.click();
      await page
        .getByRole('button', { name: 'Mute sound', exact: true })
        .waitFor();
      assert.equal(await page.evaluate(() => window.__introAudioContexts), 1);
      await page.waitForFunction(() => window.__introVoiceEvents.length === 1);
      assert.equal(voiceRequests.length, 1);
      assert(await page.evaluate(() => window.__introVoiceEvents[0].duration > 3));
      await page
        .getByRole('button', { name: 'Mute sound', exact: true })
        .click();
      await page
        .getByRole('button', { name: 'Enable sound', exact: true })
        .waitFor();
      assert(await page.evaluate(() => window.__introVoiceEvents[0].stopped));
      await page.keyboard.press('Escape');
      await waitForCompletedHero(page);
      await context.close();
    }
  );

  await check(
    'The connection voice completes once, while skipping stops it immediately',
    async () => {
      for (const skip of [false, true]) {
        const context = await browser.newContext({ reducedMotion: 'no-preference' });
        await trackVoice(context);
        const page = watch(await context.newPage());
        await page.goto(base);
        await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
        await page.waitForFunction(() => window.__introVoiceEvents.length === 1);
        if (skip) {
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => window.__introVoiceEvents[0].stopped);
        } else {
          await page.waitForFunction(() => window.__introVoiceEvents[0].ended);
          assert.equal(await page.evaluate(() => window.__introVoiceEvents[0].stopped), false);
        }
        await waitForCompletedHero(page);
        assert.equal(await page.evaluate(() => window.__introVoiceEvents.length), 1);
        await context.close();
      }
    }
  );

  await check(
    'A hidden tab does not consume the construction sequence',
    async () => {
      const context = await browser.newContext({
        reducedMotion: 'no-preference',
      });
      const page = watch(await context.newPage());
      await page.goto(base);
      await page.locator(activeHero).waitFor();
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(6300);
      assert.equal(
        await page
          .getByTestId('digital-hero')
          .getAttribute('data-intro-active'),
        'true'
      );
      await page.evaluate(() => {
        delete document.hidden;
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.keyboard.press('Escape');
      await waitForCompletedHero(page);
      await context.close();
    }
  );

  await check(
    'No unexpected JavaScript errors during cinematic scenarios',
    async () => {
      assert.deepEqual(errors, []);
    }
  );
  await writeFile(
    '.qa/intro/results.json',
    JSON.stringify({ base, checks: results }, null, 2)
  );
} finally {
  await browser.close();
}
