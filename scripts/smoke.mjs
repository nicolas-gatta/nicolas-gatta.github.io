import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

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
  args: ['--enable-unsafe-swiftshader'],
});
await mkdir('.qa', { recursive: true });
const results = [];
const check = async (name, test) => {
  await test();
  results.push(name);
  console.log(`PASS ${name}`);
};
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await check('Home, CV download and no eager Three.js', async () => {
    assert.equal((await page.goto(base)).status(), 200);
    await page.getByRole('heading', { name: 'NICOLAS GATTA.' }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: '.qa/home-desktop.png', fullPage: true });
    assert(
      !requests.some((url) =>
        /DeskScene|GarageScene|useSceneVisibility/.test(url)
      )
    );
    const pdf = await context.request.get(
      new URL('cv/Nicolas_Gatta_CV.pdf', base).href
    );
    assert.equal(pdf.status(), 200);
    assert((await pdf.body()).toString('ascii').startsWith('%PDF-'));
  });
  await check('Timeline and section navigation', async () => {
    await page.getByRole('link', { name: 'Experience', exact: true }).click();
    await page.getByRole('button', { name: /2026/ }).click();
    assert.equal(await page.locator('#experience-details').count(), 1);
    assert.equal(
      await page
        .getByRole('button', { name: /2026/ })
        .getAttribute('aria-expanded'),
      'true'
    );
    assert((await page.locator('#experience').boundingBox()).y >= 70);
  });
  await check('Project filters, search and detail refresh', async () => {
    await page.goto(`${base}#/projects`);
    await page.getByRole('heading', { level: 1 }).waitFor();
    const search = page.getByRole('searchbox');
    await page
      .getByRole('button', { name: 'Artificial Intelligence', exact: true })
      .click();
    assert.equal(
      await page
        .getByRole('button', { name: 'Artificial Intelligence', exact: true })
        .getAttribute('aria-pressed'),
      'true'
    );
    await search.fill('Unmonitarr');
    await page.getByRole('heading', { name: /No matching/ }).waitFor();
    await page.getByRole('button', { name: 'All work', exact: true }).click();
    assert.equal(
      await page.locator('a[href="#/projects/unmonitarr"]').count(),
      1
    );
    await search.fill('DermaTrack');
    assert.equal(
      await page.locator('a[href="#/projects/dermatrack"]').count(),
      1
    );
    await search.fill('no-such-project-000');
    await page.getByRole('heading', { name: /No matching/ }).waitFor();
    await search.fill('');
    await page.locator('a[href="#/projects/dermatrack"]').click();
    await page
      .getByRole('heading', { name: 'DermaTrack', exact: true })
      .waitFor();
    await page.reload();
    await page
      .getByRole('heading', { name: 'DermaTrack', exact: true })
      .waitFor();
  });
  await check('CV route and direct refresh', async () => {
    await page.goto(`${base}#/cv`);
    await page
      .getByRole('link', { name: 'Download PDF', exact: true })
      .waitFor();
    await page.reload();
    await page
      .getByRole('link', { name: 'Download PDF', exact: true })
      .waitFor();
    await page.screenshot({ path: '.qa/cv-desktop.png', fullPage: true });
  });
  await check('Computer works without loading 3D', async () => {
    await page.goto(`${base}#/lab/computer`);
    await page.getByRole('button', { name: 'Start NICO OS' }).click();
    await page.getByRole('button', { name: 'HOMELAB', exact: true }).click();
    await page
      .getByRole('heading', { name: 'The infrastructure playground.' })
      .waitFor();
    assert(
      !requests.some((url) =>
        /DeskScene|GarageScene|useSceneVisibility/.test(url)
      )
    );
    await page.screenshot({
      path: '.qa/computer-blueprint.png',
      fullPage: true,
    });
  });
  await check('Terminal commands, history and keyboard dismissal', async () => {
    await page.keyboard.press('Control+Backquote');
    const input = page.getByRole('textbox', { name: 'Terminal command' });
    await input.fill('whoami');
    await input.press('Enter');
    await page
      .getByRole('log')
      .getByText(/Probably debugging/)
      .waitFor();
    await input.press('ArrowUp');
    assert.equal(await input.inputValue(), 'whoami');
    await input.fill('neofetch');
    await input.press('Enter');
    await page
      .getByRole('log')
      .getByText(/Nicolas@portfolio/)
      .waitFor();
    await input.fill('cv');
    await input.press('Enter');
    await page
      .getByRole('link', { name: 'Download PDF', exact: true })
      .waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    await page.keyboard.press('Control+Backquote');
    await page.getByRole('textbox', { name: 'Terminal command' }).waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
  });
  await check('Garage selection and optional 3D render', async () => {
    await page.goto(`${base}#/lab/garage`);
    await page
      .getByRole('heading', { name: 'Mazda RX-7', exact: true })
      .waitFor();
    await page.getByRole('button', { name: 'Select next vehicle' }).click();
    await page
      .getByRole('heading', { name: 'Toyota Supra', exact: true })
      .waitFor();
    await page.screenshot({ path: '.qa/garage-blueprint.png', fullPage: true });
    await page.getByRole('button', { name: 'Enable 3D' }).click();
    await page.locator('canvas').waitFor();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '.qa/garage-3d.png', fullPage: true });
  });
  await check(
    'Desk render, monitor transition and context-loss recovery',
    async () => {
      await page.goto(`${base}#/lab/computer`);
      await page.getByRole('button', { name: 'Enable 3D' }).click();
      await page.locator('canvas').waitFor();
      await page.getByRole('button', { name: 'Start NICO OS' }).click();
      await page
        .getByRole('heading', { name: 'Make yourself at home.' })
        .waitFor();
      await page.waitForTimeout(300);
      await page.screenshot({ path: '.qa/computer-3d.png', fullPage: true });
      await page
        .locator('canvas')
        .evaluate((canvas) =>
          (canvas.getContext('webgl2') || canvas.getContext('webgl'))
            .getExtension('WEBGL_lose_context')
            .loseContext()
        );
      await page.getByRole('button', { name: /3D unavailable/ }).waitFor();
      await page.getByRole('button', { name: 'HOMELAB', exact: true }).click();
      await page
        .getByRole('heading', { name: 'The infrastructure playground.' })
        .waitFor();
    }
  );
  await check(
    'Matrix and Konami are optional, dismissible discoveries',
    async () => {
      await page.keyboard.press('Control+Backquote');
      const input = page.getByRole('textbox', { name: 'Terminal command' });
      await input.fill('system');
      await input.press('Enter');
      await page
        .getByRole('log')
        .getByText(/CHARACTER STATUS/)
        .waitFor();
      await input.fill('matrix');
      await input.press('Enter');
      await page
        .getByRole('heading', { name: "It's all connected." })
        .waitFor();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog[open]').count(), 0);
      await page.locator('#main-content').focus();
      for (const key of [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'b',
        'a',
      ])
        await page.keyboard.press(key);
      await page
        .getByRole('region', { name: 'Developer mode diagnostics' })
        .waitFor();
      await page
        .getByRole('button', { name: 'Disable developer mode' })
        .click();
      assert.equal(
        await page
          .getByRole('region', { name: 'Developer mode diagnostics' })
          .count(),
        0
      );
    }
  );
  await check('Responsive routes have no horizontal overflow', async () => {
    const headings = {
      '': 'NICOLAS GATTA.',
      '#/cv': /Engineering,/,
      '#/projects': /Built with/,
      '#/projects/dermatrack': 'DermaTrack',
      '#/lab': /The lab/i,
      '#/lab/computer': /A little closer/,
      '#/lab/garage': /Dream garage/,
      '#/contact': /LET’S BUILD/,
      '#/not-a-page': /YOU DIED/,
    };
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        '',
        '#/cv',
        '#/projects',
        '#/projects/dermatrack',
        '#/lab',
        '#/lab/computer',
        '#/lab/garage',
        '#/contact',
        '#/not-a-page',
      ]) {
        await page.goto(base + route);
        await page
          .getByRole('heading', { level: 1, name: headings[route] })
          .waitFor();
        await page.evaluate(() => document.fonts.ready);
        const overflow = await page.evaluate(() => ({
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        assert(
          overflow.scroll <= overflow.width + 1,
          `Overflow at ${width} ${route}: ${JSON.stringify(overflow)}`
        );
      }
      if (width === 390) {
        await page.goto(base);
        await page.getByRole('heading', { level: 1 }).waitFor();
        await page.screenshot({ path: '.qa/home-mobile.png', fullPage: true });
        await page.getByRole('button', { name: 'Open navigation' }).click();
        await page.getByRole('link', { name: 'CV', exact: true }).click();
        await page
          .getByRole('link', { name: 'Download PDF', exact: true })
          .waitFor();
        assert.equal(
          await page
            .getByRole('button', { name: 'Open navigation' })
            .getAttribute('aria-expanded'),
          'false'
        );
      }
    }
  });
  await check('No unexpected browser errors', async () => {
    assert.deepEqual(errors, []);
  });
  await check('No-JavaScript professional fallback', async () => {
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const simple = await nojs.newPage();
    await simple.goto(base);
    await simple.getByRole('heading', { name: 'Nicolas Gatta.' }).waitFor();
    await simple
      .getByRole('link', { name: 'Download CV', exact: true })
      .waitFor();
    await simple
      .getByRole('heading', { name: 'Experience, connected.' })
      .waitFor();
    await nojs.close();
  });
  await check(
    'Intro skips immediately and returning visits stay brief',
    async () => {
      const first = await browser.newContext({
        reducedMotion: 'no-preference',
      });
      const intro = await first.newPage();
      await intro.goto(base);
      const hero = intro.getByTestId('digital-hero');
      await intro.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="digital-hero"]')
            ?.getAttribute('data-intro-variant') === 'full'
      );
      await intro
        .getByRole('button', { name: 'Skip intro and explore the portfolio' })
        .waitFor();
      await intro.keyboard.press('Tab');
      assert(
        await intro.evaluate(() => !!document.activeElement?.closest('dialog'))
      );
      await intro.keyboard.press('Escape');
      assert.equal(await intro.locator('dialog[open]').count(), 0);
      assert.equal(await hero.getAttribute('data-intro-active'), 'false');
      await intro.reload();
      await intro.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="digital-hero"]')
            ?.getAttribute('data-intro-variant') === 'short'
      );
      await intro.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="digital-hero"]')
            ?.getAttribute('data-intro-active') === 'false'
      );
      assert.equal(await intro.locator('dialog[open]').count(), 0);
      await intro.getByRole('link', { name: 'Explore my work' }).click();
      await intro
        .getByRole('heading', { name: /Built with/, level: 1 })
        .waitFor();
      await intro.getByRole('link', { name: /N\.GATTA.*home/ }).click();
      await intro.getByRole('heading', { name: 'NICOLAS GATTA.' }).waitFor();
      assert.equal(await hero.getAttribute('data-intro-active'), 'false');
      await first.close();
    }
  );
  await check('WebGL failure preserves NICO OS controls', async () => {
    const blocked = await browser.newContext({ reducedMotion: 'reduce' });
    await blocked.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
        return /webgl/i.test(kind) ? null : original.call(this, kind, ...args);
      };
    });
    const fallback = await blocked.newPage();
    await fallback.goto(`${base}#/lab/computer`);
    await fallback.getByRole('button', { name: 'Enable 3D' }).click();
    await fallback.getByRole('button', { name: /3D unavailable/ }).waitFor();
    await fallback.getByRole('button', { name: 'Start NICO OS' }).click();
    await fallback
      .getByRole('heading', { name: 'Make yourself at home.' })
      .waitFor();
    await blocked.close();
  });
  await writeFile(
    '.qa/smoke-results.json',
    JSON.stringify({ base, checks: results }, null, 2)
  );
  await context.close();
} finally {
  await browser.close();
}
