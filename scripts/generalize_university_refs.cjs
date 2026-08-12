const fs = require('fs');
const path = require('path');

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkAndReplace(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      // Replace FAU specific strings with universal academic German terms
      content = content.replaceAll('FAU Erlangen-Nürnberg', 'German University');
      content = content.replaceAll('FAU Erlangen-Nurnberg', 'German University');
      content = content.replaceAll('FAU Erlangen', 'German University');
      content = content.replaceAll('FAU Sprachenzentrum', 'University Language Center');
      content = content.replaceAll('FAU DaF', 'Academic DaF');
      content = content.replaceAll('FAU campus', 'university campus');
      content = content.replaceAll('FAU library', 'university library');
      content = content.replaceAll('FAU', 'University');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Generalized university references in: ${fullPath}`);
      }
    }
  });
}

walkAndReplace('src');
console.log('University generalization complete.');
