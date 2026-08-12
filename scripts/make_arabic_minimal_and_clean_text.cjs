const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace em-dashes and en-dashes
  content = content.replaceAll('—', '-');
  content = content.replaceAll('–', '-');

  // Replace ampersands in string literals (not JSX syntax like && or &nbsp;)
  // Match & between letters or spaces
  content = content.replace(/([A-Za-z0-9])\s*&\s*([A-Za-z0-9])/g, '$1 and $2');
  content = content.replace(/(['"`])([^'"`]*?)\s+&\s+([^'"`]*?)(['"`])/g, '$1$2 and $3$4');

  // Minimize duplicate Arabic subtitle blocks in UI header components if present
  if (filePath.endsWith('.tsx')) {
    // Remove redundant Arabic subtitle paragraphs directly under English headings in headers
    content = content.replace(/<p[^>]*dir=["']rtl["'][^>]*>[\u0600-\u06FF\s،.!-]+<\/p>/g, '');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Cleaned and minimized text in: ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir);
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

walk('src');
console.log('Arabic minimization and text cleaning complete.');
