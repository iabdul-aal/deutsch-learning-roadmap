const fs = require('fs');
const path = require('path');

const compDir = 'src/components';
const files = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(compDir, file), 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    if (/[\u0600-\u06FF]/.test(line)) {
      const isPedagogical = 
        line.includes('titleAR') || 
        line.includes('explanationAR') || 
        line.includes('exampleAR') || 
        line.includes('arabicNotes') || 
        line.includes('arabicSource') || 
        line.includes('arabic:') || 
        line.includes('dir="rtl"') || 
        line.includes("dir='rtl'") || 
        line.includes('labelAR') || 
        line.includes('font-arabic') ||
        line.includes('mnemonicAR') ||
        line.includes('problem') ||
        line.includes('fix');

      if (!isPedagogical) {
        console.log(`${file}:${idx + 1}: ${line.trim()}`);
      }
    }
  });
});
