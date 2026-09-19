import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const OUT_DIR = path.resolve('public', 'screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Clean up old June 2026 screenshots if needed
const oldFiles = [
  'Screenshot 2026-06-16 205729.png',
  'Screenshot 2026-06-16 205812.png',
  'Screenshot 2026-06-16 205853.png',
  'hero-3d.png',
  'about-telemetry.png',
  'about-full.png'
];
for (const f of oldFiles) {
  const p = path.join(OUT_DIR, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
  }
}

async function run() {
  console.log('Launching browser for master portfolio screenshots...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    deviceScaleFactor: 1.5,
  });

  // Pre-seed preloaderDone so page renders immediately
  await context.addInitScript(() => {
    sessionStorage.setItem('preloaderDone', 'true');
  });

  const page = await context.newPage();

  console.log('1. Capturing 01-hero-accels.png...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500); // Allow WebGL raymarcher to stabilize
  await page.screenshot({ path: path.join(OUT_DIR, '01-hero-accels.png') });

  console.log('2. Capturing 02-engineering-telemetry.png...');
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollBy(0, 320));
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(OUT_DIR, '02-engineering-telemetry.png') });

  console.log('3. Capturing 03-evolution-roadmap.png...');
  const timelineEl = page.locator('#experience');
  await timelineEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(OUT_DIR, '03-evolution-roadmap.png') });

  console.log('4. Capturing 04-case-study-overview.png...');
  await page.goto('http://localhost:5173/work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const firstCard = page.locator('.project-card').first();
  await firstCard.click();
  await page.waitForSelector('.project-modal-panel', { state: 'visible' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '04-case-study-overview.png') });

  console.log('5. Capturing 05-distributed-architecture.png...');
  const archTab = page.locator('.project-modal-tab-btn', { hasText: 'SYSTEM ARCHITECTURE' });
  await archTab.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '05-distributed-architecture.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  console.log('6. Capturing 06-skills-360-deck.png...');
  await page.goto('http://localhost:5173/skills', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '06-skills-360-deck.png') });

  console.log('7. Capturing 07-contact-monolith.png...');
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(OUT_DIR, '07-contact-monolith.png') });

  await browser.close();
  console.log('All 7 high-fidelity screenshots successfully created and old screenshots cleaned up!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
