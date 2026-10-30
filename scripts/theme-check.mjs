import { chromium } from 'playwright-core';

const base = process.env.TEST_URL;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});

await page.goto(`${base}#/`, { waitUntil: 'networkidle' });
await page.evaluate(() => sessionStorage.setItem('ng:world-intro-seen:v1', '1'));
await page.reload({ waitUntil: 'networkidle' });
const skip = page.getByRole('button', { name: 'Skip introduction' });
if (await skip.isVisible()) await skip.click();
await page.getByRole('heading', { name: 'NICOLAS GATTA.' }).waitFor();
if (await page.getByRole('link', { name: 'Lab', exact: true }).count()) {
  throw new Error('Lab is still exposed in the primary interface.');
}
await page.screenshot({ path: '.qa/hero-title-rework.png' });

await page.locator('#about').scrollIntoViewIfNeeded();
await page.screenshot({ path: '.qa/about-dark.png' });

await page.locator('#main-navigation').getByRole('link', { name: 'Projects' }).click();
await page.waitForTimeout(300);
if (!page.url().includes('section=projects')) throw new Error('Projects menu did not target its homepage section.');
const projectsTop = await page.locator('#projects').evaluate((element) => element.getBoundingClientRect().top);
if (projectsTop > 280) throw new Error(`Projects section is not in view (${projectsTop}px).`);

await page.goto(`${base}#/cv`, { waitUntil: 'networkidle' });
await page.locator('#main-navigation').getByRole('link', { name: 'CV', exact: true }).click();
await page.waitForTimeout(300);
if (!page.url().includes('section=cv')) throw new Error('CV menu did not target its homepage section.');
const cvTop = await page.locator('#cv').evaluate((element) => element.getBoundingClientRect().top);
if (cvTop > 280) throw new Error(`CV section is not in view (${cvTop}px).`);

await page.goto(`${base}#/projects`, { waitUntil: 'networkidle' });
await page.locator('#main-navigation').getByRole('link', { name: 'Contact', exact: true }).click();
await page.waitForTimeout(300);
if (!page.url().includes('section=contact')) throw new Error('Contact menu did not target its homepage section.');
const contactTop = await page.locator('#contact').evaluate((element) => element.getBoundingClientRect().top);
if (contactTop > 280) throw new Error(`Contact section is not in view (${contactTop}px).`);

await browser.close();
if (errors.length) throw new Error(errors.join('\n'));
console.log('PASS hero title, dark About, Lab removal and homepage section navigation including Contact');
