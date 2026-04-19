const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function normalizeFonts(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // For TSX inline styles (fontFamily)
  content = content.replace(/fontFamily:\s*['"]([^'"]+)['"]/g, (match, p1) => {
    if (p1.toLowerCase().includes('outfit')) {
      return `fontFamily: "var(--font-educational)"`;
    } else if (p1.toLowerCase().includes('monospace')) {
      return `fontFamily: "monospace"`;
    } else if (p1 === 'inherit') {
      return `fontFamily: "inherit"`;
    } else if (p1.startsWith('var(')) {
      return match; // Already standardized
    } else {
      return `fontFamily: "var(--font-family)"`;
    }
  });

  // For CSS/Tailwind (font-family)
  if (filePath.endsWith('.css')) {
    content = content.replace(/font-family:\s*([^;!}]+)/g, (match, p1) => {
      if (p1.includes('var(') || p1 === 'inherit' || p1 === 'monospace') return match;
      if (p1.toLowerCase().includes('outfit')) return `font-family: var(--font-educational)`;
      return `font-family: var(--font-family)`;
    });
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated fonts in ${filePath}`);
  }
}

walkDir('./src', normalizeFonts);
console.log("Done standardizing fonts.");
