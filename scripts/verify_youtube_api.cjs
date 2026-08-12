const fs = require('fs');
const https = require('https');

// Extract all YouTube Video IDs from codebase
const contentRankingText = fs.readFileSync('src/data/contentRanking.ts', 'utf8');
const videoLibraryText = fs.readFileSync('src/data/videoLibrary.ts', 'utf8');

const combined = contentRankingText + '\n' + videoLibraryText;
const videoIdMatches = [...combined.matchAll(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/g)];
const embedIdMatches = [...combined.matchAll(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/g)];
const rawIdMatches = [...combined.matchAll(/id:\s*['"]([A-Za-z0-9_-]{11})['"]/g)];

const uniqueVideoIds = new Set();
videoIdMatches.forEach(m => uniqueVideoIds.add(m[1]));
embedIdMatches.forEach(m => uniqueVideoIds.add(m[1]));
rawIdMatches.forEach(m => {
  // Only 11-char YouTube IDs
  if (/^[A-Za-z0-9_-]{11}$/.test(m[1])) {
    uniqueVideoIds.add(m[1]);
  }
});

console.log(`Found ${uniqueVideoIds.size} unique YouTube video IDs to test via YouTube oEmbed API...`);

function checkYouTubeOEmbed(videoId) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            resolve({ videoId, ok: true, status: 200, title: data.title, author: data.author_name });
          } catch (e) {
            resolve({ videoId, ok: true, status: 200, title: 'Unknown Title' });
          }
        } else {
          resolve({ videoId, ok: false, status: res.statusCode });
        }
      });
    }).on('error', (err) => {
      resolve({ videoId, ok: false, status: 500, error: err.message });
    });
  });
}

async function runAudit() {
  const results = [];
  const ids = Array.from(uniqueVideoIds);

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const res = await checkYouTubeOEmbed(id);
    results.push(res);
    if (res.ok) {
      console.log(`[${i + 1}/${ids.length}] OK (${res.status}): ID ${id} -> "${res.title}" by ${res.author}`);
    } else {
      console.log(`[${i + 1}/${ids.length}] FAIL (${res.status}): ID ${id} is NOT playable or deleted!`);
    }
  }

  const failed = results.filter(r => !r.ok);
  console.log('\n==================================================');
  console.log(`YOUTUBE API OEMBED VERIFICATION COMPLETE:`);
  console.log(`TOTAL TESTED: ${ids.length}`);
  console.log(`PLAYABLE & ACTIVE (200 OK): ${results.length - failed.length}`);
  console.log(`BROKEN / UNPLAYABLE: ${failed.length}`);
  console.log('==================================================');

  if (failed.length > 0) {
    console.log('BROKEN VIDEO IDs:');
    failed.forEach(f => console.log(`- ${f.videoId} (HTTP ${f.status})`));
  }

  fs.writeFileSync('youtube_api_report.json', JSON.stringify({ results, failed }, null, 2));
}

runAudit();
