const fs = require('fs');

const files = [
  'src/data/contentRanking.ts',
  'src/data/videoLibrary.ts',
  'src/data/tracks/german-a1-ar/curriculum.ts',
  'src/data/tracks/german-a1-ar/resources.ts',
  'src/data/tracks/german-a2-ar/curriculum.ts',
  'src/data/tracks/german-a2-ar/resources.ts',
  'src/data/tracks/german-b1-ar/curriculum.ts',
  'src/data/tracks/german-b1-ar/resources.ts',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replaceAll('https://www.youtube.com/watch?v=www.youtube.com/watch?v=', 'https://www.youtube.com/watch?v=');
    c = c.replaceAll('https://www.youtube.com/watch?v=https://www.youtube.com/watch?v=', 'https://www.youtube.com/watch?v=');
    fs.writeFileSync(f, c);
  }
});

console.log('Fixed double YT URLs');
