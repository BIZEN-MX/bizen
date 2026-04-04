const fs = require('fs');
const path = require('path');

const lessonsDir = '/Users/diegopenasanchez/BIZEN/src/data/lessons';
const publicDir = '/Users/diegopenasanchez/BIZEN/public';

const files = fs.readdirSync(lessonsDir);
let missingImages = new Set();
let checkedImages = new Set();

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const content = fs.readFileSync(path.join(lessonsDir, file), 'utf8');
    const matches = content.match(/imageUrl:\s*["']([^"']+)["']/g);
    if (matches) {
      matches.forEach(match => {
        const url = match.match(/["']([^"']+)["']/)[1];
        if (!url.startsWith('http')) {
          const filePath = path.join(publicDir, url.startsWith('/') ? url.slice(1) : url);
          if (!fs.existsSync(filePath)) {
            missingImages.add(url);
          }
          checkedImages.add(url);
        }
      });
    }
  }
});

console.log('Checked', checkedImages.size, 'unique local images.');
console.log('Missing images:', Array.from(missingImages));
