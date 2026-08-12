const { chromium } = require('playwright');

const TEST_VIDEOS = [
  { name: 'DW Nicos Weg Movie', id: '4-eDoThe6qo' },
  { name: 'Easy German #1', id: 'r94aqLUO0wo' },
  { name: 'Easy German Restaurant', id: 'OFSHdj_2FQA' },
  { name: 'Learn German Anja', id: 'RrfgbBp6ScI' },
  { name: 'Deutsch mit Hend Single', id: 'WMvCXVorOsg' },
  { name: 'Hend A1 Playlist', id: 'PL-N_ooNpDdsNliG7czWGYvif1XJFe8Jzu' },
  { name: 'DW Nicos Weg Playlist', id: 'PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg' },
  { name: 'Easy German A1 Playlist', id: 'PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Testing YouTube Iframe Embed Availability in Playwright...');
  for (const item of TEST_VIDEOS) {
    let embedUrl = item.id.startsWith('PL')
      ? `https://www.youtube.com/embed/videoseries?list=${item.id}&rel=0`
      : `https://www.youtube.com/embed/${item.id}?rel=0`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Test</title></head>
      <body style="margin:0;background:#000;">
        <iframe id="yt" src="${embedUrl}" width="640" height="360" allowfullscreen></iframe>
      </body>
      </html>
    `;

    await page.setContent(html);
    await page.waitForTimeout(2500);

    // Frame content check for "Video unavailable"
    const frame = page.frame({ url: new RegExp('youtube.com/embed') });
    let isUnavailable = false;

    if (frame) {
      const bodyText = await frame.textContent('body').catch(() => '');
      if (bodyText.includes('Video unavailable') || bodyText.includes('This video is unavailable') || bodyText.includes('Playback on other websites has been disabled')) {
        isUnavailable = true;
      }
    }

    if (isUnavailable) {
      console.error(`❌ UNPLAYABLE EMBED: ${item.name} (${item.id}) -> "Video unavailable"`);
    } else {
      console.log(`✅ PLAYABLE EMBED: ${item.name} (${item.id})`);
    }
  }

  await browser.close();
})();
