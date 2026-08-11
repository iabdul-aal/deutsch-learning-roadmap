const fs = require('fs');
const path = require('path');

function walkAndSanitize(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkAndSanitize(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      // 1. Replace dashes
      content = content.replace(/[\u2013\u2014]/g, '-');

      // 2. Remove emojis (except flags in country selector if any, but prompt says remove all emojis)
      content = content.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '');

      // 3. Replace ampersands in text string literals (e.g. "A & B" -> "A and B")
      // Careful not to touch && or URL params like &rel=0 or HTML entities
      content = content.replace(/(\b[A-Za-z0-9_]+)\s*&\s*([A-Za-z0-9_]+\b)/g, '$1 and $2');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Sanitized: ${fullPath}`);
      }
    }
  });
}

walkAndSanitize('src');
console.log('Sanitization complete.');
