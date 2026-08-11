/**
 * Deep Link Checker
 * Extracts every link across all tracks, data files, content engines, and mobile apps.
 * Checks each link individually and reports status.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const FILES = [
  'src/data/contentRanking.ts',
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a1-ar/resources.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-a2-ar/resources.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/resources.ts',
  'src/data/mobileApps.ts',
  'src/data/missions.ts',
];

// Helper to extract URLs and resourceIds
function extractUrls(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return [];
  const content = fs.readFileSync(fullPath, 'utf8');

  const links = [];
  
  // Direct HTTP/HTTPS regex
  const httpMatches = content.match(/https?:\/\/[^\s"'`>)]+/g) || [];
  httpMatches.forEach(url => {
    // Clean trailing punctuation
    const clean = url.replace(/[,;)]+$/, '');
    links.push({ file: filePath, url: clean, type: 'HTTP_URL' });
  });

  // Resource IDs in contentRanking (YouTube IDs or playlist links)
  const resourceIdMatches = content.match(/resourceId:\s*['"]([^'"]+)['"]/g) || [];
  resourceIdMatches.forEach(match => {
    const raw = match.replace(/resourceId:\s*['"]/, '').replace(/['"]$/, '');
    if (raw.startsWith('http')) {
      links.push({ file: filePath, url: raw, type: 'DIRECT_URL' });
    } else if (raw.startsWith('videoseries?list=')) {
      const listId = raw.replace('videoseries?list=', '');
      links.push({ file: filePath, url: `https://www.youtube.com/playlist?list=${listId}`, type: 'YOUTUBE_PLAYLIST' });
    } else if (raw.startsWith('PL')) {
      links.push({ file: filePath, url: `https://www.youtube.com/playlist?list=${raw}`, type: 'YOUTUBE_PLAYLIST' });
    } else {
      links.push({ file: filePath, url: `https://www.youtube.com/watch?v=${raw}`, type: 'YOUTUBE_VIDEO' });
    }
  });

  return links;
}

// Deduplicate links
const allLinksRaw = FILES.flatMap(extractUrls);
const uniqueMap = new Map();
allLinksRaw.forEach(item => {
  if (!uniqueMap.has(item.url)) {
    uniqueMap.set(item.url, item);
  }
});

const uniqueLinks = Array.from(uniqueMap.values());

console.log(`\n==================================================`);
console.log(`TOTAL UNIQUE LINKS FOUND TO CHECK: ${uniqueLinks.length}`);
console.log(`==================================================\n`);

function checkUrl(item) {
  return new Promise((resolve) => {
    const urlStr = item.url;
    try {
      const parsed = new URL(urlStr);
      const client = parsed.protocol === 'https:' ? https : http;
      
      const req = client.request(parsed, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        const code = res.statusCode || 0;
        const ok = code >= 200 && code < 400;
        resolve({ ...item, statusCode: code, ok, error: null });
      });

      req.on('error', (err) => {
        // Fallback to GET if HEAD failed
        const reqGet = client.request(parsed, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (resGet) => {
          const code = resGet.statusCode || 0;
          const ok = code >= 200 && code < 400;
          resolve({ ...item, statusCode: code, ok, error: null });
        });
        reqGet.on('error', (e) => {
          resolve({ ...item, statusCode: 0, ok: false, error: e.message });
        });
        reqGet.setTimeout(8000, () => {
          reqGet.destroy();
          resolve({ ...item, statusCode: 0, ok: false, error: 'Timeout (8s)' });
        });
        reqGet.end();
      });

      req.setTimeout(8000, () => {
        req.destroy();
        resolve({ ...item, statusCode: 0, ok: false, error: 'Timeout (8s)' });
      });

      req.end();
    } catch (e) {
      resolve({ ...item, statusCode: 0, ok: false, error: e.message });
    }
  });
}

(async () => {
  const results = [];
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < uniqueLinks.length; i++) {
    const item = uniqueLinks[i];
    const res = await checkUrl(item);
    results.push(res);

    const num = `[${i + 1}/${uniqueLinks.length}]`;
    if (res.ok) {
      passed++;
      console.log(`${num} OK (${res.statusCode}): ${res.url}`);
    } else {
      failed++;
      console.log(`${num} FAIL (${res.statusCode || 'ERR'}): ${res.url} -- ${res.error || 'HTTP ' + res.statusCode}`);
    }
  }

  console.log(`\n==================================================`);
  console.log(`LINK CHECK SUMMARY: ${passed} PASSED, ${failed} FAILED / OUT OF ${uniqueLinks.length}`);
  console.log(`==================================================\n`);

  fs.writeFileSync('C:/Users/adham/.gemini/antigravity/brain/95bdf9ab-bb46-494d-abc5-aa0661ee9d71/link_check_report.json', JSON.stringify({ passed, failed, results }, null, 2));
})();
