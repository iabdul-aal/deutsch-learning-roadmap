/**
 * Full live site test — captures screenshots, console errors,
 * and tests all major flows: onboarding fast start, onboarding
 * diagnostic, dashboard, navigation, mobile viewport.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const SITE   = 'https://iabdul-aal.github.io/deutsch-learning-roadmap/';
const OUT    = 'C:/Users/adham/.gemini/antigravity/brain/95bdf9ab-bb46-494d-abc5-aa0661ee9d71';
const ISSUES = [];

function log(msg) { console.log(`[TEST] ${msg}`); }
function issue(msg) { ISSUES.push(msg); console.error(`[ISSUE] ${msg}`); }

async function ss(page, name) {
  const file = path.join(OUT, `live_${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  log(`Screenshot: ${name}`);
}

async function getConsoleErrors(page) {
  return new Promise(resolve => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    setTimeout(() => resolve(errors), 500);
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx     = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page    = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => issue(`JS error: ${err.message}`));

  // ── 1. Initial load ──────────────────────────────────────────────
  log('Test 1: Initial page load');
  await page.goto(SITE, { waitUntil: 'networkidle', timeout: 30000 });
  await ss(page, '01_initial');

  const title = await page.title();
  log(`Title: ${title}`);

  // Check for onboarding chooser
  const hasOnboarding = await page.locator('text=Fast Start').isVisible().catch(() => false);
  const hasDiagnostic = await page.locator('text=Full Diagnostic').isVisible().catch(() => false);
  log(`Onboarding Fast Start visible: ${hasOnboarding}`);
  log(`Onboarding Full Diagnostic visible: ${hasDiagnostic}`);
  if (!hasOnboarding) issue('Onboarding chooser Fast Start button not visible on load');
  if (!hasDiagnostic) issue('Onboarding chooser Diagnostic button not visible on load');

  // ── 2. Fast Start flow ──────────────────────────────────────────
  log('Test 2: Fast Start flow');
  await page.locator('text=Fast Start').first().click();
  await page.waitForTimeout(400);
  await ss(page, '02_fast_start_step1');

  // Step 1: Name
  const nameInput = page.locator('input[placeholder="Your name"]');
  const nameVisible = await nameInput.isVisible().catch(() => false);
  if (!nameVisible) issue('Name input not visible in Fast Start step 1');
  else {
    await nameInput.fill('Adham');
    await ss(page, '02b_fast_name_filled');
  }

  // Continue button
  const continueBtn = page.locator('button:has-text("Continue")').first();
  const contEnabled = await continueBtn.isEnabled().catch(() => false);
  if (!contEnabled) issue('Continue button disabled after filling name');
  else await continueBtn.click();

  await page.waitForTimeout(300);
  await ss(page, '03_fast_step2_goal');

  // Step 2: Goal - click "Live in Germany"
  const liveBtn = page.locator('button:has-text("Live and integrate")').first();
  const liveVisible = await liveBtn.isVisible().catch(() => false);
  if (!liveVisible) issue('Live in Germany goal option not visible');
  else await liveBtn.click();

  await page.locator('button:has-text("Continue")').first().click();
  await page.waitForTimeout(300);
  await ss(page, '04_fast_step3_level');

  // Step 3: Level
  const beginnerBtn = page.locator('button:has-text("Complete beginner")').first();
  const beginnerVisible = await beginnerBtn.isVisible().catch(() => false);
  if (!beginnerVisible) issue('Complete beginner level option not visible');
  else await beginnerBtn.click();

  await page.locator('button:has-text("Continue")').first().click();
  await page.waitForTimeout(300);
  await ss(page, '05_fast_step4_time');

  // Step 4: Time
  const timeBtn = page.locator('button:has-text("30 to 40 minutes")').first();
  const timeVisible = await timeBtn.isVisible().catch(() => false);
  if (!timeVisible) issue('30 min daily option not visible');
  else await timeBtn.click();

  // Build roadmap
  const buildBtn = page.locator('button:has-text("Build My Roadmap")').first();
  const buildVisible = await buildBtn.isVisible().catch(() => false);
  if (!buildVisible) issue('Build My Roadmap button not visible on last step');
  else await buildBtn.click();

  await page.waitForTimeout(1500);
  await ss(page, '06_dashboard_after_onboarding');

  // ── 3. Dashboard checks ─────────────────────────────────────────
  log('Test 3: Dashboard elements');

  const dashboardId = await page.locator('#learning-os-main').isVisible().catch(() => false);
  if (!dashboardId) issue('#learning-os-main not found — dashboard may not have rendered');

  const nbaCard = await page.locator('text=Next Best Action').isVisible().catch(() => false);
  if (!nbaCard) issue('Next Best Action card not visible on dashboard');

  const studyStack = await page.locator('text=Today\'s Study Stack').isVisible().catch(() => false);
  if (!studyStack) issue('Today\'s Study Stack section not visible');

  const skillMastery = await page.locator('text=Skill Mastery').isVisible().catch(() => false);
  if (!skillMastery) issue('Skill Mastery section not visible');

  const quickNav = await page.locator('button:has-text("Grammar")').isVisible().catch(() => false);
  if (!quickNav) issue('Quick nav Grammar button not visible');

  const topResources = await page.locator('text=Top Resources').isVisible().catch(() => false);
  if (!topResources) issue('Top Resources section not visible');

  // Check for any Arabic in visible UI chrome (should only be in educational content)
  const arabicInChrome = await page.evaluate(() => {
    const arabicRegex = /[\u0600-\u06FF]/;
    const allText = [...document.querySelectorAll('h1, h2, h3, label, button, [role="button"], .font-black, .font-bold')]
      .map(el => el.textContent ?? '')
      .filter(t => arabicRegex.test(t));
    return allText;
  });
  if (arabicInChrome.length > 0) {
    issue(`Arabic text found in UI chrome elements: ${arabicInChrome.slice(0, 5).join(' | ')}`);
  }

  // ── 4. Navigation test ──────────────────────────────────────────
  log('Test 4: Navigation between views');
  const navViews = [
    { btn: 'Grammar',    expect: 'Grammar' },
    { btn: 'SRS Cards',  expect: 'Vocabulary' },
    { btn: 'Resources',  expect: 'Resources' },
    { btn: 'Roadmap',    expect: '' },  // curriculum view
    { btn: 'Progress',   expect: '' },  // trackers view
  ];

  for (const nav of navViews) {
    const navBtn = page.locator(`button:has-text("${nav.btn}")`).first();
    const visible = await navBtn.isVisible().catch(() => false);
    if (!visible) {
      issue(`Quick nav button "${nav.btn}" not visible`);
      continue;
    }
    await navBtn.click();
    await page.waitForTimeout(600);
    await ss(page, `07_nav_${nav.btn.toLowerCase().replace(/\s/g, '_')}`);
    // Go back to dashboard
    const dashBtn = page.locator('button:has-text("Dashboard"), [data-view="dashboard"], button:has-text("Today")').first();
    if (await dashBtn.isVisible().catch(() => false)) await dashBtn.click();
    else {
      // Try sidebar
      const sidebarDash = page.locator('[id*="sidebar"] button, nav button').first();
      // just go back via sidebar today link
    }
    await page.waitForTimeout(300);
  }

  // ── 5. Mobile viewport test ─────────────────────────────────────
  log('Test 5: Mobile viewport (375px)');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await ss(page, '08_mobile_dashboard');

  // Check for horizontal scroll
  const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (hasHScroll) issue('Horizontal scroll detected on mobile (375px) — layout overflow');

  // Sidebar on mobile
  const menuBtn = page.locator('[aria-label="Open menu"], button[aria-label*="menu"], button[aria-label*="sidebar"]').first();
  const menuVisible = await menuBtn.isVisible().catch(() => false);
  log(`Mobile menu button visible: ${menuVisible}`);

  // ── 6. Second page load — returning user ─────────────────────────
  log('Test 6: Returning user — should skip onboarding');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await ss(page, '09_returning_user');

  const onboardingAgain = await page.locator('text=Fast Start').isVisible().catch(() => false);
  if (onboardingAgain) issue('Onboarding shown again to returning user — localStorage not persisting hasSeenWelcome');

  // ── 7. Console error summary ────────────────────────────────────
  log(`\nConsole errors captured: ${consoleErrors.length}`);
  for (const err of consoleErrors) {
    issue(`Console error: ${err.slice(0, 200)}`);
  }

  await browser.close();

  // ── Report ───────────────────────────────────────────────────────
  console.log('\n========================================');
  console.log(`TOTAL ISSUES FOUND: ${ISSUES.length}`);
  console.log('========================================');
  ISSUES.forEach((iss, i) => console.log(`${i + 1}. ${iss}`));

  const report = {
    timestamp: new Date().toISOString(),
    url: SITE,
    issues: ISSUES,
    screenshotDir: OUT,
  };
  fs.writeFileSync(path.join(OUT, 'test_report.json'), JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${OUT}/test_report.json`);
})();
