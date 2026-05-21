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
    
    // Remove the complex typeof injection
    content = content.replace(/\|\|\s*\(typeof userEmail !== 'undefined' && userEmail === 'diegopenita31@gmail\.com'\)\s*\|\|\s*\(typeof email !== 'undefined' && email === 'diegopenita31@gmail\.com'\)\s*\|\|\s*\(typeof val !== 'undefined' && val === 'diegopenita31@gmail\.com'\)/g, "");
    
    // Remove any raw userEmail ===
    content = content.replace(/\|\|\s*userEmail\s*===\s*'diegopenita31@gmail\.com'/g, "");
    
    // Also remove in commented lines just in case
    content = content.replace(/\/\/\s*userEmail\s*===\s*'diegopenita31@gmail\.com'/g, "//");
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log("Cleaned all userEmail references safely.");
