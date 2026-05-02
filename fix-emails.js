const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // For 'email' context
    content = content.replace(/\|\|\s*userEmail\s*===\s*'diegopenita31@gmail\.com'/g, "|| (typeof userEmail !== 'undefined' && userEmail === 'diegopenita31@gmail.com') || (typeof email !== 'undefined' && email === 'diegopenita31@gmail.com') || (typeof val !== 'undefined' && val === 'diegopenita31@gmail.com')");
    // For 'emailForRole' context in OnboardingModal
    content = content.replace(/\|\|\s*userEmail\s*===\s*'diegopenita31@gmail\.com'/g, ""); // fallback if any other format
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log("Done fixing emails.");
