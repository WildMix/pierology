import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const passed = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && new URL(response.url()).origin === new URL(base).origin) errors.push(`${response.status()} ${response.url()}`); });
  const visit = async path => {
    await page.goto(`${base}/${path ? `#${path}` : ''}`);
    await page.locator('main h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
  };
  const noOverflow = async () => {
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
    assert.ok(dimensions.content <= dimensions.viewport, JSON.stringify(dimensions));
  };

  await visit('');
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.screenshot({ path: 'test-results/home-desktop-viewport.png' });
  await noOverflow();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.screenshot({ path: 'test-results/home-mobile-viewport.png' });
  await noOverflow();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Next featured story' }).click();
  assert.match(await page.locator('#hero-story').innerText(), /extraordinary unease/);
  await page.getByRole('button', { name: 'Previous featured story' }).click();
  assert.match(await page.locator('#hero-story').innerText(), /way of life/);
  passed.push('Homepage and featured-story controls');

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Pierology Today' }).click();
  await page.locator('.journal-card').first().waitFor();
  assert.equal(await page.locator('.journal-card').count(), 6);
  await page.getByRole('navigation', { name: 'Filter news' }).getByRole('link', { name: 'Belvito accounts', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('.journal-card').length === 2);
  await page.getByRole('heading', { name: 'The question at dusk: another reported appearance of Vito Belvito' }).getByRole('link').click();
  await page.locator('.article-copy').waitFor();
  assert.match(await page.locator('.article-copy').innerText(), /Have you been to lunch/);
  await page.screenshot({ path: 'test-results/article-desktop.png', fullPage: true });
  passed.push('News category filtering and full article navigation');

  await page.getByRole('button', { name: 'Search Pierology' }).click();
  await page.getByRole('searchbox', { name: 'Search the world of Pierology' }).fill('KPF57APQ4');
  await page.locator('#search-form').getByRole('button', { name: 'Search', exact: false }).click();
  await page.locator('.search-summary').waitFor();
  assert.ok(await page.locator('.search-results .news-row').count() > 0);
  await page.locator('#results-query').fill('no-such-story-12345');
  await page.locator('#results-search').getByRole('button', { name: 'Search' }).click();
  await page.getByRole('heading', { name: 'No stories found.' }).waitFor();
  passed.push('Search matches and empty state');

  await visit('/faq');
  await page.locator('summary').filter({ hasText: 'Who is Vito Belvito?' }).click();
  assert.equal(await page.locator('.faq-list details').nth(3).getAttribute('open'), '');
  passed.push('Accessible FAQ disclosure');

  await visit('/events');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Add to calendar' }).first().click();
  const calendar = await downloaded;
  const calendarText = await readFile(await calendar.path(), 'utf8');
  assert.match(calendarText, /BEGIN:VCALENDAR/);
  assert.match(calendarText, /DTSTART:20261004T090000Z/);
  assert.match(calendarText, /The Sunday Contemplation/);
  passed.push('Calendar file download with correct event and UTC time');

  await visit('/photos');
  await page.getByRole('button', { name: 'View photograph: A landscape for contemplation' }).click();
  assert.equal(await page.locator('dialog').evaluate(d => d.open), true);
  await page.getByRole('button', { name: 'Next photograph' }).click();
  assert.equal(await page.locator('#dialog-title').innerText(), 'In the quiet of the hills');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#dialog-title').innerText(), 'Where the stories begin');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').evaluate(d => d.open), false);
  passed.push('Photo lightbox, navigation, keyboard controls, and dismissal');

  await visit('/media?tab=music');
  await page.getByRole('button', { name: 'Play the Piero refrain' }).click();
  await page.waitForFunction(() => document.querySelector('#refrain').currentTime > .05);
  assert.equal(await page.locator('#refrain').evaluate(a => a.loop), true);
  await page.getByRole('button', { name: 'Pause the Piero refrain' }).click();
  assert.equal(await page.locator('#refrain').evaluate(a => a.paused), true);
  await page.locator('#audio-volume').focus();
  await page.keyboard.press('Home');
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#refrain').evaluate(a => a.volume), .3);
  passed.push('Real audio playback, pause, continuous-loop setting, and volume');

  await visit('/media');
  assert.equal(await page.locator('.video-card').count(), 1);
  assert.equal(await page.locator('a[href$=".mp4"], video').count(), 0);
  await page.screenshot({ path: 'test-results/film-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Watch the ten-hour contemplation', exact: true }).click();
  const embed = page.getByTitle('Piero — Ten hours of contemplation on YouTube');
  assert.equal(await embed.getAttribute('src'), 'https://www.youtube-nocookie.com/embed/4GpNXT_PuXU?autoplay=1&rel=0');
  assert.equal(await embed.getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin');
  assert.equal(await page.getByRole('link', { name: 'Watch on YouTube' }).getAttribute('href'), 'https://www.youtube.com/watch?v=4GpNXT_PuXU');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await embed.waitFor({ state: 'detached' });
  assert.equal(await page.locator('dialog iframe').count(), 0);
  passed.push('Single YouTube film, correct embed and fallback URLs, and dialog cleanup');

  await page.setViewportSize({ width: 390, height: 844 });
  await visit('');
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.screenshot({ path: 'test-results/home-mobile-viewport.png' });
  await noOverflow();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Gatherings & Events' }).click();
  await page.locator('.events-list').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'), 'false');
  for (const path of ['/news', '/beliefs', '/piero', '/symbol', '/events', '/media', '/media?tab=music', '/photos', '/faq', '/article/the-eternal-question', '/credits']) {
    await visit(path);
    await noOverflow();
  }
  await visit('/beliefs');
  await page.screenshot({ path: 'test-results/beliefs-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 720 });
  for (const path of ['/', '/symbol', '/beliefs', '/events', '/media?tab=music']) { await visit(path); await noOverflow(); }
  passed.push('Mobile navigation and all layouts at 390px, key pages at 320px');

  const normalRange = await fetch(`${base}/piero-loop.wav`, { headers: { Range: 'bytes=0-99' } });
  assert.equal(normalRange.status, 206);
  assert.equal((await normalRange.arrayBuffer()).byteLength, 100);
  const invalidRange = await fetch(`${base}/piero-loop.wav`, { headers: { Range: 'bytes=9999999999-' } });
  assert.equal(invalidRange.status, 416);
  assert.equal((await fetch(`${base}/package.json`)).status, 404);
  assert.equal((await fetch(`${base}/assets/%2e%2e%2fpackage.json`)).status, 404);
  assert.equal((await fetch(`${base}/piero-10-hours.mp4`)).status, 404);
  assert.equal((await fetch(`${base}/piero-preview-30s.mp4`)).status, 404);
  passed.push('Small-audio range requests, private-file protection, and local video exclusion');
  assert.deepEqual(errors, []);
  await writeFile('test-results/checks.json', JSON.stringify({ passed, browserErrors: errors }, null, 2));
  console.log(`${passed.length} checks passed:\n${passed.map(s => `- ${s}`).join('\n')}`);
} finally {
  await browser.close();
}
