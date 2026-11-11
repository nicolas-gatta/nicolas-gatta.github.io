import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = (process.env.TEST_URL || 'http://127.0.0.1:4173/').replace(/\/?$/, '/');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH }
    : process.platform === 'win32' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }
      : { channel: 'chrome' }),
  args: ['--enable-unsafe-swiftshader'],
});
await mkdir('.qa', { recursive: true });
const results = [];
const check = async (name, run) => {
  await run();
  results.push(name);
  console.log(`PASS ${name}`);
};

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  const failures = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });

  await check('Hero entrance is readable and garage assets stay lazy', async () => {
    await page.goto(base);
    const entrance = page.getByTestId('garage-entrance');
    await entrance.waitFor();
    await page.locator('[data-testid="garage-entrance"][data-city-integrated="true"]').waitFor();
    assert.match(await entrance.innerText(), /Love car \? Click here/);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.waitForFunction(() => {
        const box = document.querySelector('[data-testid="garage-entrance"]')?.getBoundingClientRect();
        return box && box.left >= 0 && box.right <= innerWidth + .1;
      });
      const bounds = await entrance.boundingBox();
      const replay = await page.getByRole('button', { name: 'Replay intro' }).boundingBox();
      assert(bounds.x >= -0.1 && bounds.x + bounds.width <= width + 0.1, `${width}px: ${JSON.stringify(bounds)}`);
      assert(bounds.y >= replay.y + replay.height || bounds.x >= replay.x + replay.width,
        `Garage overlaps replay at ${width}px`);
      assert(await entrance.isVisible());
      assert.equal(await entrance.getAttribute('data-city-integrated'), 'true');
      const sign = await entrance.locator('span').first().boundingBox();
      assert(sign.width >= 150 && sign.height >= 24, `Garage sign is too small at ${width}px`);
    }
    assert(!requests.some((url) => /\.glb|GarageScene|textures\/garage/.test(url)));
    await page.getByRole('button', { name: 'Replay intro' }).click();
    await entrance.waitFor({ state: 'hidden' });
    await page.locator('[data-testid="garage-entrance"][data-city-integrated="true"]').waitFor();
    await page.screenshot({ path: '.qa/garage-entry-desktop.png' });
    await entrance.click();
  });

  const garage = page.getByTestId('garage');
  await check('All three local models and workshop maps render', async () => {
    await page.locator('[data-testid="garage"][data-ready="true"]').waitFor({ timeout: 90000 });
    assert.equal(await garage.getAttribute('data-mode'), '3d');
    assert.equal(await page.locator('canvas').count(), 1);
    assert.equal(new Set(requests.filter((url) => /\.glb(?:\?|$)/.test(url))).size, 3);
    assert.equal(new Set(requests.filter((url) => /textures\/garage\/.*\.jpg/.test(url))).size, 6);
    assert(requests.filter((url) => /\.glb|textures\/garage/.test(url)).every((url) => url.startsWith(base)));
    await page.screenshot({ path: '.qa/garage-desktop.png' });
  });

  await check('The actual 3D car and diagnostic screen open details', async () => {
    await page.mouse.click(720, 610);
    await page.getByRole('region', { name: 'Mazda RX-7 details' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Close vehicle details' }).evaluate((button) => button === document.activeElement), true);
    await page.keyboard.press('Escape');
    await page.mouse.click(958, 475);
    await page.getByRole('region', { name: 'Mazda RX-7 details' }).waitFor();
    await page.keyboard.press('Escape');
  });

  await check('Carousel selection, keyboard navigation and vehicle files', async () => {
    await page.getByRole('button', { name: 'Select next vehicle' }).click();
    assert.equal(await garage.getAttribute('data-selected'), 'supra');
    await page.getByRole('button', { name: 'Inspect car', exact: true }).click();
    const details = page.getByRole('region', { name: 'Toyota Supra details' });
    assert.match(await details.innerText(), /2JZ-GTE/);
    assert(await details.getByRole('img').evaluate((img) => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: '.qa/garage-inspect.png' });
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button', { name: 'Inspect car', exact: true }).evaluate((button) => button === document.activeElement), true);
    await page.getByRole('button', { name: 'Select Toyota Supra', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await garage.getAttribute('data-selected'), 'skyline');
    assert.equal(await page.getByRole('button', { name: 'Select Nissan Skyline GT-R', exact: true }).getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', { name: 'Select next vehicle' }).click();
    assert.equal(await garage.getAttribute('data-selected'), 'rx7');
    await page.getByRole('button', { name: 'Workshop view' }).click();
    assert.equal(await page.getByRole('button', { name: 'Workshop view' }).getAttribute('aria-pressed'), 'true');
    await page.waitForTimeout(250);
    await page.screenshot({ path: '.qa/garage-workshop.png' });
    await page.getByRole('button', { name: 'Workshop view' }).click();
  });

  await check('Credits and fullscreen preserve return navigation', async () => {
    await page.getByRole('button', { name: 'Model & photo credits' }).click();
    const credits = page.getByRole('region', { name: 'Garage asset credits' });
    assert.equal(await credits.getByRole('heading').count(), 4);
    assert.equal(await credits.locator('a[href*="sketchfab.com"]').count(), 3);
    await page.keyboard.press('Escape');
    if (await page.evaluate(() => document.fullscreenEnabled)) {
      await page.getByRole('button', { name: 'Enter fullscreen garage' }).click();
      await page.getByRole('button', { name: 'Exit fullscreen garage' }).waitFor();
      const back = garage.getByRole('link', { name: 'Back to home', exact: true });
      assert(await back.isVisible());
      await back.click();
      await page.getByTestId('garage-entrance').waitFor();
      assert.equal(await page.evaluate(() => !!document.fullscreenElement), false);
      await page.getByTestId('garage-entrance').click();
      await page.locator('[data-testid="garage"][data-ready="true"]').waitFor({ timeout: 90000 });
    }
  });

  await check('Mobile layout, horizontal selection and persistent back', async () => {
    for (const [width, height] of [[320, 568], [390, 844], [768, 1024]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.getByRole('button', { name: 'Select Nissan Skyline GT-R', exact: true }).click();
      await page.getByRole('button', { name: 'Inspect car', exact: true }).click();
      const panel = page.getByRole('region', { name: 'Nissan Skyline GT-R details' });
      const rect = await panel.boundingBox();
      assert(rect.x >= 0 && rect.x + rect.width <= width);
      assert(await page.locator('[data-back-navigation]').getByRole('link').isVisible());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `.qa/garage-mobile-${width}.png` });
      await page.keyboard.press('Escape');
    }
  });

  await check('Context loss retains photos, selection and vehicle information', async () => {
    await page.locator('canvas').evaluate((canvas) => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
    await page.locator('[data-testid="garage"][data-mode="photo"]').waitFor();
    await page.getByRole('button', { name: 'Select Toyota Supra', exact: true }).click();
    await page.getByRole('button', { name: 'Inspect car', exact: true }).click();
    await page.getByRole('region', { name: 'Toyota Supra details' }).waitFor();
    assert.equal(await page.locator('canvas').count(), 0);
    assert(await page.getByRole('img', { name: 'Toyota Supra photographed in real life' }).isVisible());
    await page.screenshot({ path: '.qa/garage-photo-fallback.png' });
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
  });
  await context.close();

  await check('A browser without WebGL can still enter and explore', async () => {
    const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await fallbackContext.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return /^webgl/.test(type) ? null : getContext.call(this, type, ...args);
      };
    });
    const fallbackPage = await fallbackContext.newPage();
    await fallbackPage.goto(`${base}#/garage`);
    await fallbackPage.locator('[data-testid="garage"][data-mode="photo"][data-ready="true"]').waitFor();
    await fallbackPage.getByRole('button', { name: 'Select next vehicle' }).click();
    await fallbackPage.getByRole('button', { name: 'Inspect car', exact: true }).click();
    await fallbackPage.getByRole('region', { name: 'Toyota Supra details' }).waitFor();
    await fallbackPage.locator('[data-back-navigation]').getByRole('link').click();
    await fallbackPage.getByTestId('garage-entrance').waitFor();
    await fallbackContext.close();
  });
  await writeFile('.qa/garage-results.json', JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
