const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const srcFiles = getAllFiles(path.resolve('src'));
const urlRegex = /(https?:\/\/[^\s"'`<>]+)/g;

const foundUrls = new Map(); // url -> Array of locations

srcFiles.forEach(filePath => {
  const relPath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    let cleanUrl = match[1].replace(/[,;.)\]}'"]+$/, '');
    if (!foundUrls.has(cleanUrl)) {
      foundUrls.set(cleanUrl, []);
    }
    foundUrls.get(cleanUrl).push(relPath);
  }
});

console.log(`Found ${foundUrls.size} unique URLs across ${srcFiles.length} source files.`);

// Check HTTP status for each URL
async function checkUrl(url) {
  return new Promise(resolve => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', err => {
      resolve({ url, status: 0, error: err.message });
    });
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ url, status: 408, error: 'Timeout' });
    });
  });
}

async function runAudit() {
  const results = [];
  const entries = Array.from(foundUrls.entries());
  console.log('Auditing HTTP status of all extracted URLs...');

  for (const [url, locations] of entries) {
    const res = await checkUrl(url);
    results.push({ ...res, locations });
    if (res.status === 200 || res.status === 301 || res.status === 302) {
      console.log(`[OK ${res.status}] ${url}`);
    } else {
      console.error(`[BAD ${res.status}] ${url} (used in ${locations.join(', ')})`);
    }
  }

  const badUrls = results.filter(r => r.status !== 200 && r.status !== 301 && r.status !== 302);
  console.log('\n==================================================');
  console.log(`AUDIT COMPLETE: ${results.length - badUrls.length} OK | ${badUrls.length} BAD`);
  console.log('==================================================');

  fs.writeFileSync('link_check_report.json', JSON.stringify({ results, badUrls }, null, 2));
}

runAudit();
