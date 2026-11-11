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
  await check('Airship logos, controls and experience link', async () => {
    const airship = page.getByTestId('experience-airship');
    await airship.waitFor();
    assert.equal(await airship.getAttribute('data-running'), 'false');
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="experience-airship"] img')]
      .every((image) => image.complete && image.naturalWidth > 0));
    for (const name of ['IBM', 'Google', 'Takeda Pharmaceuticals']) {
      await airship.getByRole('button', { name: `Show ${name} logo`, exact: true }).click();
      assert.equal(await airship.getByRole('button', { name: `Show ${name} logo`, exact: true }).getAttribute('aria-pressed'), 'true');
      assert.equal(await airship.getByRole('img', { name, exact: true }).count(), 1);
    }
    await airship.getByRole('button', { name: 'Pause company logos' }).click();
    await airship.getByRole('button', { name: 'Play company logos' }).click();
    await airship.getByRole('link', { name: 'View professional experience: Takeda Pharmaceuticals' }).click();
    await page.waitForFunction(() => document.activeElement?.id === 'experience');
    await page.getByRole('link', { name: /Nicolas Gatta.*home/ }).click();
    await page.getByTestId('digital-hero').waitFor();
  });
  await check('Timeline and section navigation', async () => {
    await page.getByRole('link', { name: 'Experience', exact: true }).click();
    await page.waitForFunction(() => {
      const section = document.getElementById('experience');
      const contentTop = section.getBoundingClientRect().top +
        parseFloat(getComputedStyle(section).paddingTop);
      return Math.abs(contentTop - document.querySelector('header').getBoundingClientRect().bottom - 18) < 2;
    });
    await page.getByRole('button', { name: /2026/ }).click();
    assert.equal(await page.locator('#experience-details').count(), 1);
    assert.equal(
      await page
        .getByRole('button', { name: /2026/ })
        .getAttribute('aria-expanded'),
      'true'
    );
    const gap = await page.locator('#experience').evaluate((section) => {
      const contentTop = section.getBoundingClientRect().top +
        parseFloat(getComputedStyle(section).paddingTop);
      return contentTop - document.querySelector('header').getBoundingClientRect().bottom;
    });
    assert(Math.abs(gap - 18) < 2, `Unexpected section gap: ${gap}px`);
  });
  await check('Menu follows scrolling, repeated links and dedicated routes', async () => {
    for (const [id, name] of [['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['cv', 'CV'], ['contact', 'Contact'], ['experience', 'Experience']]) {
      await page.locator(`#${id}`).evaluate((section) => section.scrollIntoView({ behavior: 'instant' }));
      await page.waitForFunction((name) => document.querySelector('nav a[aria-current]')?.textContent === name, name);
      assert.equal(await page.locator('nav a[aria-current]').count(), 1);
    }
    // The URL still points to Experience: clicking it again must scroll back.
    await page.getByRole('link', { name: 'Experience', exact: true }).click();
    await page.locator('#contact').evaluate((section) => section.scrollIntoView({ behavior: 'instant' }));
    await page.getByRole('link', { name: 'Experience', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('nav a[aria-current]')?.textContent === 'Experience');
    for (const [route, name] of [['projects/dermatrack', 'Projects'], ['cv', 'CV'], ['contact', 'Contact']]) {
      await page.goto(`${base}#/${route}`);
      await page.getByRole('heading', { level: 1 }).waitFor();
      await page.waitForFunction((name) => document.querySelector('nav a[aria-current="page"]')?.textContent === name, name);
      assert.equal(await page.getByRole('link', { name, exact: true }).getAttribute('aria-current'), 'page');
    }
  });
  await check('Experience connects on view, reveals without layout shifts and stays connected', async () => {
    for (const [width, theme] of [[1440, 'dark'], [390, 'light']]) {
      const animated = await browser.newContext({
        viewport: { width, height: 1000 }, reducedMotion: 'no-preference',
      });
      await animated.addInitScript((theme) => localStorage.setItem('ng:theme', theme), theme);
      const scene = await animated.newPage();
      scene.on('pageerror', (error) => errors.push(error.message));
      await scene.goto(base);
      await scene.getByRole('button', { name: 'Skip intro and explore the portfolio' }).click();
      const connection = scene.locator('#experience [aria-busy]');
      assert.equal(await connection.getAttribute('data-state'), 'pending');
      await scene.locator('#experience').evaluate((section) => section.scrollIntoView({ behavior: 'instant' }));
      await scene.getByRole('status').filter({ hasText: 'CONNECTING EXPERIENCE' }).waitFor();
      await scene.waitForFunction(() => document.querySelector('#experience [aria-busy]')?.dataset.state === 'loading');
      const started = Date.now();
      const bounds = await connection.boundingBox();
      assert.equal(await scene.getByRole('button', { name: /2026/ }).count(), 0);
      // Let the existing section materialization finish before capturing the loader.
      await scene.waitForTimeout(700);
      await scene.screenshot({ path: `.qa/experience-loading-${width}-${theme}.png` });
      await scene.waitForFunction(() => document.querySelector('#experience [aria-busy]')?.dataset.state === 'ready');
      assert(Date.now() - started >= 2000, 'Connection should take a few seconds');
      assert.equal(await connection.getAttribute('aria-busy'), 'false');
      assert.equal((await connection.boundingBox()).height, bounds.height);
      await scene.getByRole('button', { name: /2026/ }).click();
      await scene.locator('#experience-details').getByRole('heading', { name: 'IBM FutureNow Center' }).waitFor();
      await scene.screenshot({ path: `.qa/experience-ready-${width}-${theme}.png` });
      assert(await scene.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await scene.getByRole('link', { name: 'Full CV', exact: true }).click();
      await scene.getByRole('link', { name: /Nicolas Gatta.*home/ }).click();
      await scene.getByTestId('digital-hero').waitFor();
      assert.equal(await connection.getAttribute('data-state'), 'ready');
      await animated.close();
    }
    // A preference change during the connection should reveal content immediately.
    const animated = await browser.newContext({ reducedMotion: 'no-preference' });
    const scene = await animated.newPage();
    await scene.goto(`${base}#/?section=experience`);
    await scene.waitForFunction(() => document.querySelector('#experience [aria-busy]')?.dataset.state === 'loading');
    await scene.emulateMedia({ reducedMotion: 'reduce' });
    await scene.waitForFunction(() => document.querySelector('#experience [aria-busy]')?.dataset.state === 'ready');
    await animated.close();
  });
  await check('Section trails build once, including after leaving Home', async () => {
    const animated = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    const scene = await animated.newPage();
    scene.on('pageerror', (error) => errors.push(error.message));
    await scene.goto(base);
    await scene.getByRole('button', { name: 'Skip intro and explore the portfolio' }).click();
    assert.equal(await scene.getByRole('link', { name: 'Explore my work', exact: true }).count(), 0);
    assert.equal(await scene.getByRole('link', { name: 'View CV', exact: true }).count(), 0);
    await scene.evaluate(() => {
      window.sectionBuilds = {};
      new MutationObserver((records) => {
        for (const record of records) {
          if (record.target.dataset.construction === 'drawing' && record.oldValue === 'pending') {
            const id = record.target.id;
            window.sectionBuilds[id] = (window.sectionBuilds[id] || 0) + 1;
          }
        }
      }).observe(document.getElementById('main-content'), { subtree: true, attributes: true, attributeFilter: ['data-construction'], attributeOldValue: true });
    });
    for (const id of ['about', 'experience', 'projects', 'cv', 'contact']) {
      await scene.locator(`#${id}`).evaluate((section) => section.scrollIntoView({ behavior: 'instant' }));
      await scene.waitForFunction((id) => document.getElementById(id)?.dataset.construction === 'ready', id);
    }
    const builds = await scene.evaluate(() => window.sectionBuilds);
    assert.deepEqual(builds, { about: 1, experience: 1, projects: 1, cv: 1, contact: 1 });
    await scene.locator('#about').evaluate((section) => section.scrollIntoView({ behavior: 'instant' }));
    await scene.waitForTimeout(150);
    assert.deepEqual(await scene.evaluate(() => window.sectionBuilds), builds);
    await scene.getByRole('link', { name: 'All projects', exact: true }).click();
    await scene.getByRole('heading', { level: 1, name: /Built with/ }).waitFor();
    await scene.getByRole('link', { name: /Nicolas Gatta.*home/ }).click();
    await scene.getByTestId('digital-hero').waitFor();
    assert.deepEqual(await scene.locator('[data-construction]').evaluateAll((sections) => sections.map((section) => section.dataset.construction)), Array(5).fill('ready'));
    await animated.close();
  });
  await check('Compact projects, technology filters, expansion and return navigation', async () => {
    await page.goto(`${base}#/projects`);
    await page.getByRole('heading', { level: 1, name: /Built with/ }).waitFor();
    const cards = page.locator('[id^="project-card-"]');
    const expectCards = async (count) => {
      await page.waitForFunction((expected) =>
        document.querySelectorAll('[id^="project-card-"]').length === expected, count);
      assert.equal(await cards.count(), count);
    };
    const technology = page.getByRole('combobox', { name: 'Filter by technology' });
    await expectCards(6);
    await page.getByRole('button', { name: /^Expand/ }).click();
    await expectCards(8);
    await page.getByRole('button', { name: 'Collapse projects' }).click();
    await expectCards(6);
    await technology.selectOption('Python');
    await expectCards(3);
    assert.equal(await page.getByRole('link', { name: 'C-3BOT', exact: true }).count(), 1);
    assert.equal(await page.getByRole('link', { name: 'Cronario', exact: true }).count(), 0);
    await page.getByRole('link', { name: 'DermaTrack', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: 'DermaTrack', exact: true }).waitFor();
    for (const position of [0, 0.5, 1]) {
      await page.evaluate((position) => window.scrollTo({
        top: (document.documentElement.scrollHeight - innerHeight) * position,
        behavior: 'instant',
      }), position);
      assert(await page.getByRole('link', { name: 'Back to projects', exact: true }).evaluate((link) => {
        const bounds = link.getBoundingClientRect();
        return bounds.y >= innerHeight - 100 && bounds.bottom <= innerHeight - 12 &&
          link.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
      }), 'Back to projects must remain within reach throughout the page');
    }
    await page.reload();
    await page.getByRole('heading', { level: 1, name: 'DermaTrack', exact: true }).waitFor();
    await page.getByRole('link', { name: 'Back to projects', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.id === 'project-card-dermatrack');
    assert.equal(await technology.inputValue(), 'Python');
    await expectCards(3);
    await page.getByRole('button', { name: 'Clear filter', exact: true }).click();
    await page.getByRole('link', { name: 'Back to home', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.id === 'projects');
    await expectCards(3);
    await technology.selectOption('Dart');
    assert.equal(await page.getByRole('link', { name: 'Tune Taker', exact: true }).count(), 1);
    await expectCards(1);
    await page.getByRole('button', { name: 'Clear filter', exact: true }).click();
    await page.getByRole('button', { name: /^Expand/ }).click();
    await expectCards(8);
    await page.getByRole('link', { name: 'Energo-Sphere', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: 'Energo-Sphere', exact: true }).waitFor();
    await page.getByRole('link', { name: 'Back to projects', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.id === 'project-card-energo-sphere');
    await expectCards(8);
    assert.equal(await page.getByRole('button', { name: 'Collapse projects' }).getAttribute('aria-expanded'), 'true');
    await page.getByRole('button', { name: 'Collapse projects' }).click();
    await expectCards(3);
    await page.goto(`${base}#/projects/dermatrack`);
    await page.getByRole('link', { name: 'Back to projects', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: /Built with/ }).waitFor();
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
  await check('Lab is removed from the public application', async () => {
    await page.goto(`${base}#/lab`);
    await page.getByRole('heading', { name: /YOU DIED/ }).waitFor();
    assert.equal(await page.getByRole('link', { name: 'Lab', exact: true }).count(), 0);
    assert(!requests.some((url) => /LabHubScene|DeskScene|GarageScene/.test(url)));
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
        await page.locator('#cv').waitFor();
        assert(page.url().includes('section=cv'));
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
      await intro.getByRole('link', { name: 'Projects', exact: true }).click();
      await intro.getByRole('link', { name: 'All projects', exact: true }).click();
      await intro
        .getByRole('heading', { name: /Built with/, level: 1 })
        .waitFor();
      await intro.getByRole('link', { name: /Nicolas Gatta.*home/ }).click();
      await intro.getByRole('heading', { name: 'NICOLAS GATTA.' }).waitFor();
      assert.equal(await hero.getAttribute('data-intro-active'), 'false');
      await first.close();
    }
  );
  await writeFile(
    '.qa/smoke-results.json',
    JSON.stringify({ base, checks: results }, null, 2)
  );
  await context.close();
} finally {
  await browser.close();
}
