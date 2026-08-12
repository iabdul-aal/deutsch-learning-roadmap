const fs = require('fs');

const files = [
  'src/data/contentRanking.ts',
  'src/data/videoLibrary.ts',
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a1-ar/resources.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replaceAll('https://www.youtube.com/watch?v=s23J8-k17-E://', '');
    c = c.replaceAll('https://www.youtube.com/watch?v=s23J8-k17-E:', '');
    fs.writeFileSync(f, c);
  }
});

console.log('Double URL prefix cleanup finished.');
