const fs = require('fs');
const path = require('path');

const dataFiles = [
  'src/data/contentRanking.ts',
  'src/data/videoLibrary.ts',
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a1-ar/resources.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-a2-ar/resources.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/resources.ts',
];

dataFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix concatenated URLs like https://www.youtube.com/watch?v=s23J8-k17-E://www.youtube.com/watch?v=...
  content = content.replace(/https:\/\/www\.youtube\.com\/watch\?v=[^"'`\s]+?:\/\/(https:\/\/www\.youtube\.com\/watch\?v=[^"'`\s]+)/g, '$1');
  
  // Fix double watch URLs
  content = content.replace(/https:\/\/www\.youtube\.com\/watch\?v=https:\/\/www\.youtube\.com\/watch\?v=/g, 'https://www.youtube.com/watch?v=');

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned double URLs in ${filePath}`);
});

console.log('Double URL cleanup complete.');
