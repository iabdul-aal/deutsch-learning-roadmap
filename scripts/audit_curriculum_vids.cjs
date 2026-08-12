const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/tracks/german-a1-ar/curriculum.ts');
const content = fs.readFileSync(curriculumPath, 'utf8');

const matches = content.match(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g) || [];
const counts = {};

matches.forEach(m => {
  const vid = m.split('v=')[1];
  counts[vid] = (counts[vid] || 0) + 1;
});

console.log('YouTube Video ID distribution in A1 curriculum.ts:');
console.log(counts);
