import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await chromium.launch();
  
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 851 },
    deviceScaleFactor: 2.75
  });
  
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const mobilePage = await mobileContext.newPage();
  const desktopPage = await desktopContext.newPage();

  const artifactsDir = path.resolve(process.cwd(), 'artifacts/reference_views');
  if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

  const refUrl = 'https://deutschroad-bs6pmgvj.manus.space/';
  console.log(`Navigating to ${refUrl}...`);

  await mobilePage.goto(refUrl);
  await desktopPage.goto(refUrl);
  await mobilePage.waitForTimeout(2000);
  await desktopPage.waitForTimeout(2000);

  // Capture Landing / Login state
  await mobilePage.screenshot({ path: path.join(artifactsDir, 'ref_mobile_home.png'), fullPage: false });
  await desktopPage.screenshot({ path: path.join(artifactsDir, 'ref_desktop_home.png'), fullPage: false });

  // Find all sidebar buttons or links on desktopPage
  const sidebarLinks = await desktopPage.$$('aside button, aside a, nav button, nav a');
  console.log(`Found ${sidebarLinks.length} sidebar items in reference site.`);

  for (let i = 0; i < sidebarLinks.length; i++) {
    try {
      const text = await sidebarLinks[i].innerText();
      const cleanName = text.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      console.log(`Clicking reference sidebar item ${i}: "${text.trim()}"...`);
      await sidebarLinks[i].click({ timeout: 2000 });
      await desktopPage.waitForTimeout(1000);
      await desktopPage.screenshot({ path: path.join(artifactsDir, `ref_desktop_${cleanName || i}.png`), fullPage: false });
    } catch (e) {
      console.log(`Could not click item ${i}:`, e.message);
    }
  }

  await browser.close();
  console.log('Reference site views captured!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
