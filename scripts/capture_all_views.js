import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const views = [
  'dashboard',
  'curriculum',
  'survival',
  'pronunciation',
  'vocabulary',
  'grammar',
  'trackers',
  'assessments',
  'resources',
  'mobile_apps'
];

async function main() {
  const browser = await chromium.launch();
  
  // Mobile Context: Xiaomi Redmi Note 10S (393 x 851)
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 851 },
    deviceScaleFactor: 2.75
  });
  
  // Desktop Context: 1280 x 800
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const mobilePage = await mobileContext.newPage();
  const desktopPage = await desktopContext.newPage();

  const artifactsDir = path.resolve(process.cwd(), 'artifacts/screenshots');
  if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

  const liveUrl = 'https://iabdul-aal.github.io/deutsch-learning-roadmap/';
  console.log(`Navigating to ${liveUrl}...`);

  await mobilePage.goto(liveUrl);
  await desktopPage.goto(liveUrl);
  await mobilePage.waitForTimeout(1000);
  await desktopPage.waitForTimeout(1000);

  for (const view of views) {
    console.log(`Capturing view: ${view}...`);
    
    // Inject state or click navigation item
    await mobilePage.evaluate((v) => {
      const state = JSON.parse(localStorage.getItem('deutsch_survival_app_state_v1') || '{}');
      state.activeView = v;
      localStorage.setItem('deutsch_survival_app_state_v1', JSON.stringify(state));
      window.location.reload();
    }, view);
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: path.join(artifactsDir, `mobile_${view}.png`), fullPage: false });

    await desktopPage.evaluate((v) => {
      const state = JSON.parse(localStorage.getItem('deutsch_survival_app_state_v1') || '{}');
      state.activeView = v;
      localStorage.setItem('deutsch_survival_app_state_v1', JSON.stringify(state));
      window.location.reload();
    }, view);
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({ path: path.join(artifactsDir, `desktop_${view}.png`), fullPage: false });
  }

  await browser.close();
  console.log('All 10 workspace view screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
