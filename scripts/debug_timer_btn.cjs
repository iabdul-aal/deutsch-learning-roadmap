const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.evaluate(() => {
    localStorage.setItem('deutsch_learning_os_state_v1', JSON.stringify({ hasSeenWelcome: true, userName: 'Adham' }));
  });
  await page.reload();
  await page.waitForTimeout(1000);

  const loc = page.locator('button:has-text("Timer")');
  const count = await loc.count();
  console.log('Total Timer buttons on page:', count);
  for (let i = 0; i < count; i++) {
    const isVis = await loc.nth(i).isVisible();
    console.log(`Button ${i}: visible = ${isVis}`);
  }
  await browser.close();
})();
