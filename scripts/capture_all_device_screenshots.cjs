const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.join(__dirname, '..', 'artifacts');

const DEVICES = [
  { id: 'desktop_1080p', viewport: { width: 1920, height: 1080 }, isMobile: false, label: 'Desktop 1080p (1920x1080)' },
  { id: 'macbook_14', viewport: { width: 1440, height: 900 }, isMobile: false, label: 'MacBook Pro 14" (1440x900)' },
  { id: 'laptop_13', viewport: { width: 1280, height: 800 }, isMobile: false, label: 'Laptop 13" (1280x800)' },
  { id: 'ipad_landscape', viewport: { width: 1024, height: 768 }, isMobile: false, label: 'iPad Landscape (1024x768)' },
  { id: 'ipad_portrait', viewport: { width: 768, height: 1024 }, isMobile: false, label: 'iPad Portrait (768x1024)' },
  { id: 'mobile_samsung', viewport: { width: 412, height: 915 }, isMobile: true, label: 'Samsung Galaxy / Pixel (412x915)' },
  { id: 'mobile_iphone15', viewport: { width: 390, height: 844 }, isMobile: true, label: 'iPhone 15 / 14 (390x844)' },
  { id: 'mobile_android_mid', viewport: { width: 360, height: 740 }, isMobile: true, label: 'Android Mid-Tier (360x740)' },
  { id: 'mobile_iphone_se', viewport: { width: 320, height: 568 }, isMobile: true, label: 'iPhone SE Compact (320x568)' }
];

async function captureAllDevices() {
  console.log('=======================================================');
  console.log('STARTING FULL MULTI-DEVICE RESPONSIVE SCREENSHOT PASS');
  console.log('=======================================================\n');

  const browser = await chromium.launch({ headless: true });

  for (const dev of DEVICES) {
    console.log(`📸 Capturing ${dev.label}...`);
    const context = await browser.newContext({
      viewport: dev.viewport,
      isMobile: dev.isMobile,
      hasTouch: dev.isMobile,
    });
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });

      // Populate valid, complete app state in localStorage
      await page.evaluate(() => {
        const fullState = {
          mode: 'standard',
          activeView: 'dashboard',
          currentTrackId: 'german-a1-ar',
          completedTasks: {},
          completedDays: [],
          vocabStatus: {},
          grammarStatus: {},
          weakTopics: [],
          manualListeningMinutes: 0,
          manualSpeakingMinutes: 0,
          manualWritingTasksCompleted: 0,
          streakDays: 1,
          selectedDayByTrack: { 'german-a1-ar': 1, 'german-a2-ar': 1, 'german-b1-ar': 1 },
          userName: 'Adham',
          hasSeenWelcome: true
        };
        localStorage.setItem('deutsch_survival_app_state_v4', JSON.stringify(fullState));
        localStorage.setItem('deutsch_onboarding_completed', 'true');
      });

      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(800);

      // Check horizontal overflow
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (hasHorizontalOverflow) {
        console.warn(`   ⚠️ WARNING: Horizontal scroll detected on ${dev.id}!`);
      } else {
        console.log(`   ✅ Zero horizontal overflow on ${dev.id}`);
      }

      // Capture Dashboard Screenshot
      const dashPath = path.join(ARTIFACT_DIR, `dev_${dev.id}_dashboard.png`);
      await page.screenshot({ path: dashPath, fullPage: true });

      // Navigate to Roadmap / Curriculum
      const navRoadmap = page.locator('button:has-text("Roadmap")').first();
      if (await navRoadmap.isVisible()) {
        await navRoadmap.click();
        await page.waitForTimeout(800);

        // Expand Day 1
        const day1 = page.locator('text=Day 1').first();
        if (await day1.isVisible()) {
          await day1.click();
          await page.waitForTimeout(800);
        }

        const roadmapPath = path.join(ARTIFACT_DIR, `dev_${dev.id}_roadmap.png`);
        await page.screenshot({ path: roadmapPath, fullPage: true });
        console.log(`   Saved dev_${dev.id}_dashboard.png & roadmap.png`);
      }

    } catch (err) {
      console.error(`   ❌ Error capturing ${dev.id}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\n=======================================================');
  console.log('✅ ALL MULTI-DEVICE SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('=======================================================');
}

captureAllDevices().catch(err => {
  console.error('Multi-device capture script failed:', err);
  process.exit(1);
});
