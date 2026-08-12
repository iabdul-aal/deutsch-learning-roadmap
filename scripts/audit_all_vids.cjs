const fs = require('fs');
const path = require('path');

['german-a1-ar', 'german-a2-ar', 'german-b1-ar'].forEach(track => {
  const file = path.join(__dirname, `../src/data/tracks/${track}/curriculum.ts`);
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g) || [];
  const counts = {};
  matches.forEach(m => {
    const vid = m.split('v=')[1];
    counts[vid] = (counts[vid] || 0) + 1;
  });
  console.log(`\nYouTube Video ID distribution in ${track}/curriculum.ts:`);
  console.log(counts);
});
