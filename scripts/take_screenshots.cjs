const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch({ headless: true });
  const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  // Write valid app state with correct field names (activeView not currentView)
  await page.evaluate(() => {
    const state = {
      activeView: 'curriculum',
      currentTrackId: 'german-a1-ar',
      completedTasks: {},
      completedDays: [],
      srsCards: [],
      weeklyGoalMinutes: 300,
      selectedWeekNum: 1,
      hasSeenWelcome: true,
      userName: 'Ahmed',
      mode: 'standard',
      vocabStatus: {},
      grammarStatus: {},
      weakTopics: [],
      manualListeningMinutes: 0,
      manualSpeakingMinutes: 0,
      manualWritingTasksCompleted: 0,
      streakDays: 3,
      selectedDayByTrack: { 'german-a1-ar': 1 }
    };
    localStorage.setItem('deutsch_survival_app_state_v4', JSON.stringify(state));
  });

  // Use hash routing to go directly to curriculum
  await page.goto('http://localhost:5173/#curriculum');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'artifacts/verify_roadmap_full.png' });
  console.log('Screenshot 1: roadmap');

  // Try to expand Day 1
  const allButtons = await page.$$('button');
  for (const btn of allButtons) {
    const txt = await btn.textContent().catch(() => '');
    if (txt && txt.includes('Day 1')) {
      await btn.click();
      await page.waitForTimeout(1200);
      console.log('Clicked Day 1');
      break;
    }
  }

  await page.screenshot({ path: 'artifacts/verify_day1_tasks.png' });
  console.log('Screenshot 2: Day 1 expanded');

  // Also take mobile screenshot
  await ctx.close();
  const mobileCtx = await br.newContext({ viewport: { width: 375, height: 812 } });
  const mobile = await mobileCtx.newPage();
  await mobile.goto('http://localhost:5173');
  await mobile.evaluate(() => {
    const state = {
      activeView: 'curriculum',
      currentTrackId: 'german-a1-ar',
      completedTasks: {},
      completedDays: [],
      srsCards: [],
      hasSeenWelcome: true,
      userName: 'Ahmed',
      mode: 'standard',
      vocabStatus: {},
      grammarStatus: {},
      weakTopics: [],
      manualListeningMinutes: 0,
      manualSpeakingMinutes: 0,
      manualWritingTasksCompleted: 0,
      streakDays: 3,
      selectedDayByTrack: { 'german-a1-ar': 1 }
    };
    localStorage.setItem('deutsch_survival_app_state_v4', JSON.stringify(state));
  });
  await mobile.goto('http://localhost:5173/#curriculum');
  await mobile.waitForTimeout(2500);
  await mobile.screenshot({ path: 'artifacts/verify_roadmap_mobile.png' });
  console.log('Screenshot 3: mobile');

  await br.close();
  console.log('Done');
})();
