const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Find ampersands in string literals or text
      const ampersands = content.match(/['"`>][^'"`<]*&[^'"`<]*['"`<]/g) || [];
      const cleanAmp = ampersands.filter(a => 
        !a.includes('&&') && 
        !a.includes('&amp;') && 
        !a.includes('&nbsp;') && 
        !a.includes('&lt;') && 
        !a.includes('&gt;') &&
        !a.includes('&color') &&
        !a.includes('&modestbranding') &&
        !a.includes('&rel')
      );

      // Find emojis
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;
      const emojis = content.match(emojiRegex) || [];

      // Find em-dash or en-dash
      const dashes = content.match(/[\u2013\u2014]/g) || [];

      if (cleanAmp.length > 0 || emojis.length > 0 || dashes.length > 0) {
        console.log(`\nFILE: ${fullPath}`);
        if (cleanAmp.length > 0) console.log('  Ampersands:', cleanAmp.slice(0, 5));
        if (emojis.length > 0) console.log('  Emojis:', [...new Set(emojis)]);
        if (dashes.length > 0) console.log('  Dashes:', dashes.length);
      }
    }
  });
}

scanDirectory('src');
