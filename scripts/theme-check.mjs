import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = (process.env.TEST_URL || 'http://127.0.0.1:4173/').replace(/\/?$/, '/');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : process.platform === 'win32'
      ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }
      : { channel: 'chrome' }),
});
await mkdir('.qa', { recursive: true });
const errors = [];
const watch = (page) => {
  page.on('pageerror', (error) => errors.push(error.message));
  return page;
};
const check = async (name, run) => {
  await run();
  console.log(`PASS ${name}`);
};
const canvasCorner = (page) => page.getByTestId('digital-world').evaluate(
  (canvas) => [...canvas.getContext('2d').getImageData(0, 0, 1, 1).data]
);
const canvasPixels = (page) => page.getByTestId('digital-world').evaluate((canvas) => {
  // The foreground road, below the skyline: captures cars moving through the city.
  const data = canvas.getContext('2d').getImageData(
    Math.floor(canvas.width * 0.6), Math.floor(canvas.height * 0.7),
    Math.floor(canvas.width * 0.22), Math.floor(canvas.height * 0.2)
  ).data;
  return [...data.filter((_, index) => index % 16 === 0)];
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce',
  });
  const page = watch(await context.newPage());
  await page.goto(base);
  await page.getByTestId('digital-world').waitFor();
  await page.evaluate(() => document.fonts.ready);

  await check('Dark default, light city redraw and persistent theme across routes', async () => {
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    assert((await canvasCorner(page))[0] < 20);
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await page.waitForFunction(() => {
      const canvas = document.querySelector('[data-testid="digital-world"]');
      return canvas.getContext('2d').getImageData(0, 0, 1, 1).data[0] > 230;
    });
    assert.equal(await page.getByRole('button', { name: 'Switch to dark mode' }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => localStorage.getItem('ng:theme')), 'light');
    await page.screenshot({ path: '.qa/city-light.png' });
    await page.reload();
    await page.getByTestId('digital-world').waitFor();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    for (const [route, heading] of [
      ['projects', /Built with/], ['projects/dermatrack', 'DermaTrack'],
      ['cv', /Engineering,/], ['contact', /LET’S BUILD/],
    ]) {
      await page.goto(`${base}#/${route}`);
      await page.getByRole('heading', { level: 1, name: heading }).waitFor();
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(243, 245, 244)');
      await page.screenshot({ path: `.qa/light-${route.replace('/', '-')}.png` });
    }
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  });

  await check('All menu links align content below the header in both themes and on phones', async () => {
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ['dark', 'light']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme)
          await page.getByRole('button', { name: `Switch to ${theme} mode` }).click();
        for (const [id, label] of [
          ['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'],
          ['cv', 'CV'], ['contact', 'Contact'],
        ]) {
          if (width <= 760)
            await page.getByRole('button', { name: 'Open navigation' }).click();
          await page.locator('nav').getByRole('link', { name: label, exact: true }).click();
          await page.waitForFunction((id) => {
            const section = document.getElementById(id);
            if (!section || document.activeElement?.id !== id) return false;
            const contentTop = section.getBoundingClientRect().top +
              parseFloat(getComputedStyle(section).paddingTop);
            const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
            const desired = window.scrollY + contentTop - headerBottom - 18;
            const clamped = Math.min(desired, document.documentElement.scrollHeight - innerHeight);
            return Math.abs(window.scrollY - clamped) < 2;
          }, id);
          await page.waitForFunction((label) =>
            document.querySelector('nav a[aria-current]')?.textContent === label,
          label, { timeout: 3000 });
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow: ${width} ${theme} ${id}`);
          if (width <= 760)
            assert.equal(await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'), 'false');
        }
      }
    }
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button', { name: 'Open navigation' }).evaluate((el) => el === document.activeElement), true);
  });

  await check('Reduced motion freezes traffic while the normal city stays alive', async () => {
    await page.goto(base);
    await page.getByTestId('digital-world').waitFor();
    const still = await canvasPixels(page);
    await page.waitForTimeout(300);
    assert.deepEqual(await canvasPixels(page), still);
    const animated = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const city = watch(await animated.newPage());
    await city.goto(base);
    await city.getByRole('button', { name: 'Skip intro and explore the portfolio' }).click();
    await city.getByTestId('digital-world').waitFor();
    await city.waitForTimeout(150);
    const before = await canvasPixels(city);
    await city.waitForTimeout(600);
    const after = await canvasPixels(city);
    assert(before.filter((value, index) => Math.abs(value - after[index]) > 3).length > 20, 'Traffic should move visibly on the foreground road.');
    await city.screenshot({ path: '.qa/city-traffic-dark.png' });
    await city.getByRole('button', { name: 'Switch to light mode' }).click();
    await city.waitForTimeout(100);
    assert((await canvasCorner(city))[0] > 230);
    // A saved light preference keeps the cinematic dark, then restores daylight.
    await city.reload();
    await city.locator('[data-intro-active="true"]').waitFor();
    await city.getByTestId('digital-world').waitFor();
    assert((await canvasCorner(city))[0] < 20);
    await city.waitForFunction(() => {
      const canvas = document.querySelector('[data-testid="digital-world"]');
      return canvas?.getContext('2d').getImageData(0, 0, 1, 1).data[0] > 230;
    });
    await animated.close();
  });

  await check('Theme switching still works when local storage is blocked', async () => {
    const blocked = await browser.newContext({ reducedMotion: 'reduce' });
    await blocked.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
    });
    const simple = watch(await blocked.newPage());
    await simple.goto(base);
    await simple.getByRole('button', { name: 'Switch to light mode' }).click();
    await simple.getByRole('button', { name: 'Switch to dark mode' }).click();
    assert.equal(await simple.locator('html').getAttribute('data-theme'), 'dark');
    await blocked.close();
  });
  assert.deepEqual(errors, []);
  await context.close();
} finally {
  await browser.close();
}
