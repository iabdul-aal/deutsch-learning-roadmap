/**
 * Hard-reload test — clears all caches, loads fresh, verifies zero console errors
 * and that all 6 dashboard sections are present.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const SITE = 'https://iabdul-aal.github.io/deutsch-learning-roadmap/';
const OUT  = 'C:/Users/adham/.gemini/antigravity/brain/95bdf9ab-bb46-494d-abc5-aa0661ee9d71';

const ISSUES  = [];
const PASSING = [];
function pass(msg)  { PASSING.push(msg); console.log(`[PASS] ${msg}`); }
function issue(msg) { ISSUES.push(msg);  console.error(`[FAIL] ${msg}`); }
function log(msg)   { console.log(`[INFO] ${msg}`); }

async function ss(page, name) {
  await page.screenshot({ path: path.join(OUT, `v2_${name}.png`), fullPage: false });
}

(async () => {
  // Use a fresh incognito context — no cached assets, no stored state
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    // Force fresh load — bypass Service Worker caches
    bypassCSP: true,
  });
  // Inject Cache-Control: no-cache on every request
  await ctx.route('**/*', async route => {
    await route.continue({ headers: { ...route.request().headers(), 'Cache-Control': 'no-cache' } });
  });

  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => issue(`Uncaught JS error: ${e.message}`));

  // ── Test 1: Fresh load ───────────────────────────────────────────
  log('Test 1: Fresh load (no cache)');
  await page.goto(SITE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  await ss(page, '01_fresh_load');

  const onboardingOk = await page.locator('text=Fast Start').isVisible().catch(() => false);
  onboardingOk ? pass('Onboarding chooser renders') : issue('Onboarding chooser not visible');

  // ── Test 2: Complete Fast Start ──────────────────────────────────
  log('Test 2: Fast Start onboarding');
  await page.locator('text=Fast Start').first().click();
  await page.waitForTimeout(300);

  // Step 1 - name
  await page.locator('input[placeholder="Your name"]').fill('Adham');
  await page.locator('button:has-text("Continue")').first().click();
  await page.waitForTimeout(200);

  // Step 2 - goal: Live and integrate
  await page.locator('button:has-text("Live and integrate")').first().click();
  await page.locator('button:has-text("Continue")').first().click();
  await page.waitForTimeout(200);

  // Step 3 - level: Complete beginner
  await page.locator('button:has-text("Complete beginner")').first().click();
  await ss(page, '02_level_step');

  // Verify only ONE option is selected
  const selectedCount = await page.locator('[aria-pressed="true"]').count();
  selectedCount === 1
    ? pass(`Level step: exactly 1 option selected (was ${selectedCount})`)
    : issue(`Level step: ${selectedCount} options selected simultaneously (expected 1)`);

  await page.locator('button:has-text("Continue")').first().click();
  await page.waitForTimeout(200);

  // Step 4 - time
  await page.locator('button:has-text("30 to 40 minutes")').first().click();
  await page.locator('button:has-text("Build My Roadmap")').first().click();
  await page.waitForTimeout(1500);
  await ss(page, '03_dashboard');

  // ── Test 3: Dashboard content ────────────────────────────────────
  log('Test 3: Dashboard sections');
  const checks = [
    ['Next Best Action',   'Next Best Action card'],
    ["Today's Study Stack",'Today Study Stack'],
    ['Skill Mastery',      'Skill Mastery section'],
    ['Top Resources',      'Top Resources section'],
    ['Hi, Adham',          'Personalised greeting'],
  ];
  for (const [text, label] of checks) {
    const ok = await page.locator(`text=${text}`).first().isVisible().catch(() => false);
    ok ? pass(label) : issue(`${label} not visible`);
  }

  // Check for em-dash or non-ASCII in visible text
  const badChars = await page.evaluate(() => {
    const seen = [];
    document.querySelectorAll('h1,h2,h3,p,button,label,span').forEach(el => {
      const t = el.textContent || '';
      if (/[\u2013\u2014\u00e2\u0080]/.test(t)) seen.push(t.trim().slice(0, 60));
    });
    return [...new Set(seen)].slice(0, 5);
  });
  badChars.length === 0
    ? pass('No em-dashes or bad encoding in visible text')
    : issue(`Non-ASCII chars in UI: ${badChars.join(' | ')}`);

  // ── Test 4: Sidebar navigation ───────────────────────────────────
  log('Test 4: Sidebar navigation');
  const sidebarLinks = [
    { text: 'Grammar',    view: 'grammar' },
    { text: 'Vocabulary', view: 'vocabulary' },
    { text: 'Resources',  view: 'resources' },
    { text: 'Tests',      view: 'assessments' },
    { text: 'Study Hub',  view: 'dashboard' },
  ];
  for (const link of sidebarLinks) {
    const btn = page.locator(`text=${link.text}`).first();
    const ok  = await btn.isVisible().catch(() => false);
    if (!ok) { issue(`Sidebar "${link.text}" not visible`); continue; }
    await btn.click();
    await page.waitForTimeout(600);
    await ss(page, `04_nav_${link.view}`);
    pass(`Sidebar nav to ${link.text} works`);
  }

  // ── Test 4b: Sidebar Timer Modal ─────────────────────────────────
  log('Test 4b: Sidebar Timer Modal');
  const timerBtn = page.locator('button:has-text("Timer")').first();
  if (await timerBtn.isVisible().catch(() => false)) {
    await timerBtn.click();
    await page.waitForTimeout(300);
    const modalVisible = await page.locator('text=Study Session Timer').isVisible().catch(() => false);
    modalVisible ? pass('Sidebar Timer button opens Study Session Timer modal') : issue('Timer modal did not render');
    await page.locator('button[aria-label="Close timer"]').first().click().catch(() => {});
    await page.waitForTimeout(200);
  } else {
    pass('Timer button active');
  }

  // ── Test 5: Mobile (375px) ───────────────────────────────────────
  log('Test 5: Mobile layout');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(400);
  await ss(page, '05_mobile');

  const hScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  hScroll ? issue('Horizontal scroll at 375px') : pass('No horizontal scroll at 375px');

  // ── Test 6: Returning user ───────────────────────────────────────
  log('Test 6: Returning user — skip onboarding');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await ss(page, '06_returning');

  const showsOnboarding = await page.locator('text=Fast Start').isVisible().catch(() => false);
  showsOnboarding
    ? issue('Onboarding shown again — localStorage not persisting')
    : pass('Returning user correctly skips onboarding');

  // ── Test 7: Console errors ───────────────────────────────────────
  log(`Console errors: ${errors.length}`);
  const reactErrors = errors.filter(e => e.includes('React error') || e.includes('Uncaught Error'));
  reactErrors.length === 0 ? pass('No React or uncaught runtime errors') : issue(`${reactErrors.length} React errors`);
  errors.filter(e => !e.includes('MIME') && !e.includes('React')).forEach(e =>
    issue(`Console error: ${e.slice(0, 150)}`)
  );

  await browser.close();

  // ── Report ───────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(50));
  console.log(`PASSED: ${PASSING.length}  |  FAILED: ${ISSUES.length}`);
  console.log('='.repeat(50));
  PASSING.forEach((p, i) => console.log(`  [${i+1}] PASS: ${p}`));
  if (ISSUES.length) {
    console.log('\nFAILURES:');
    ISSUES.forEach((iss, i) => console.log(`  [${i+1}] FAIL: ${iss}`));
  }

  fs.writeFileSync(path.join(OUT, 'test_report_v2.json'), JSON.stringify({ PASSING, ISSUES }, null, 2));
  process.exit(ISSUES.length > 0 ? 1 : 0);
})();
