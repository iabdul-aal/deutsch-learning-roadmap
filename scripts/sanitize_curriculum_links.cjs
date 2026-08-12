const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/tracks/german-a1-ar/curriculum.ts');
let content = fs.readFileSync(curriculumPath, 'utf8');

const lines = content.split('\n');
let replacedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('WMvCXVorOsg&t=')) {
    // Find task title from preceding lines
    let title = '';
    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
      if (lines[j].includes('"title":')) {
        title = lines[j];
        break;
      }
    }

    const titleLower = title.toLowerCase();
    let newLink = 'https://www.youtube.com/@FrauHendTaha/videos';

    if (titleLower.includes('akkusativ') || titleLower.includes('accusative')) {
      newLink = 'https://www.youtube.com/watch?v=F3a7cI2g_sM';
    } else if (titleLower.includes('dativ') || titleLower.includes('dative')) {
      newLink = 'https://www.youtube.com/watch?v=oV9gP4-g-e8';
    } else if (titleLower.includes('separable') || titleLower.includes('trennbare')) {
      newLink = 'https://www.youtube.com/watch?v=g9o6q5x8sRk';
    } else if (titleLower.includes('modal')) {
      newLink = 'https://www.youtube.com/watch?v=e_0kU4M0d0U';
    } else if (titleLower.includes('routine') || titleLower.includes('tagesablauf')) {
      newLink = 'https://www.youtube.com/watch?v=OFSHdj_2FQA';
    } else if (titleLower.includes('alphabet') || titleLower.includes('phonetic') || titleLower.includes('number') || titleLower.includes('lesson 1')) {
      newLink = 'https://www.youtube.com/watch?v=WMvCXVorOsg';
    }

    lines[i] = line.replace(/https:\/\/www\.youtube\.com\/watch\?v=WMvCXVorOsg&t=[0-9]+s/g, newLink);
    replacedCount++;
    console.log(`Line ${i+1}: ${title.trim()} -> ${newLink}`);
  }
}

fs.writeFileSync(curriculumPath, lines.join('\n'), 'utf8');
console.log(`\nSuccessfully sanitized ${replacedCount} links in curriculum.ts`);
