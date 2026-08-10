import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("=== TESTING DIRECT FAU DAF & DICT.CC ARABIC LINKS ===");

  // 1. Test FAU Sprachenzentrum DaF German Course direct page
  const fauUrls = [
    'https://www.sz.fau.de/abteilung-daf/',
    'https://www.sz.fau.de/abteilungen/deutsch-als-fremdsprache/',
    'https://www.sz.fau.de/deutsch-als-fremdsprache/'
  ];

  for (const u of fauUrls) {
    try {
      await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 8000 });
      console.log(`FAU DaF Link [OK]: ${u}`);
      await page.screenshot({ path: 'artifacts/fau_daf_direct.png' });
      break;
    } catch (e) {
      console.log(`FAU DaF Link try next: ${u}`);
    }
  }

  // 2. Test Dict.cc German-Arabic direct page
  const dictUrls = [
    'https://dear.dict.cc/',
    'https://dict.cc/?s=ar-de',
    'https://www.dict.cc/?s=deutsch-arabisch'
  ];

  for (const u of dictUrls) {
    try {
      await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 8000 });
      console.log(`Dict.cc German-Arabic Link [OK]: ${u}`);
      await page.screenshot({ path: 'artifacts/dict_arabic_direct.png' });
      break;
    } catch (e) {
      console.log(`Dict.cc Link try next: ${u}`);
    }
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
