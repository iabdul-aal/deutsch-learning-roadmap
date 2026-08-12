import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.join(__dirname, '..', 'artifacts');

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const state = {
      mode: 'standard',
      activeView: 'curriculum',
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
    localStorage.setItem('deutsch_survival_app_state_v4', JSON.stringify(state));
    localStorage.setItem('deutsch_survival_app_state_v3', JSON.stringify(state));
  });

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Click Roadmap button in desktop sidebar nav
  await page.click('nav button:has-text("Roadmap")');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sidelisting_roadmap_desktop.png'), fullPage: true });
  console.log('Saved sidelisting_roadmap_desktop.png');

  await browser.close();
}

verify().catch(err => {
  console.error('Verify error:', err);
  process.exit(1);
});
