const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const scriptsDir = path.join(rootDir, 'scripts');
const prismaDir = path.join(rootDir, 'prisma');

// List of files in the root folder that we want to check
const filesToCheck = [
  '_check_col.cjs',
  '_test_upsert.cjs',
  'add-streaks.js',
  'check-git-push.sh',
  'check-rows.js',
  'check_db.ts',
  'check_env_direct.js',
  'check_prisma.js',
  'check_prisma_models.js',
  'check_prisma_names.ts',
  'check_tx.ts',
  'cloud-sql-proxy',
  'copy-to-bizen.sh',
  'debug_auth.js',
  'debug_auth_alive.js',
  'debug_counts.js',
  'delete-rows.js',
  'deploy.sh',
  'find-microcredential-files.sh',
  'fix-emails-clean.js',
  'fix-emails.js',
  'fix-schema.js',
  'fix_sidebar_margins.js',
  'investigate.ts',
  'list-models.js',
  'list_models.js',
  'migrate-steps.ts',
  'query_admins.js',
  'query_market.js',
  'refactor_nav.js',
  'remove_admin.js',
  'rewrite_sidebar.js',
  'rewrite_sidebar_v2.js',
  'safe-cleanup.sh',
  'scratch-test.ts',
  'scratch.js',
  'scratch.ts',
  'scratch_check_lessons.ts',
  'scratch_check_prisma_keys.ts',
  'scratch_inspect.js',
  'scratch_sync_lessons.ts',
  'scratch_update_topics.ts',
  'scratch_upsert_schools.ts',
  'test-achievements.js',
  'test-billi.js',
  'test-challenge.ts',
  'test-email-setup.js',
  'test-gemini.js',
  'test-models.js',
  'test-tsx.js',
  'test_dashboard_init.js',
  'test_net.js',
  'test_stats.js',
  'test_stats.ts',
  'tmp_seed_simulators.ts',
  'tmp_test.js',
  'update_config.js',
  'update_profile.js',
  'watchdog.sh',
  'bizen-email-template.html',
  'emojis.txt',
  'test-file.txt',
  'debug_purchase.log',
  'server.log',
  'Peña_Sánchez_Diego_Highschool_kardex.pdf'
];

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(getFilesRecursively(fullPath));
      }
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allProjectFiles = [
  ...getFilesRecursively(srcDir),
  ...getFilesRecursively(scriptsDir),
  ...getFilesRecursively(prismaDir)
];

console.log(`Checking ${filesToCheck.length} root files...`);

const exportsFound = {};
const references = {};

filesToCheck.forEach(f => {
  references[f] = [];
  exportsFound[f] = [];
});

filesToCheck.forEach(fileName => {
  const filePath = path.join(rootDir, fileName);
  if (!fs.existsSync(filePath)) return;
  if (fs.statSync(filePath).isDirectory()) return;

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for ES exports or CommonJS exports
  const exportLines = content.split('\n').filter(line => {
    return line.includes('export ') || line.includes('exports.') || line.includes('module.exports');
  });
  
  if (exportLines.length > 0) {
    exportsFound[fileName] = exportLines.map(l => l.trim());
  }

  const baseNameWithoutExt = path.parse(fileName).name;
  allProjectFiles.forEach(projFile => {
    // Skip if checking the same file
    if (projFile === filePath) return;
    
    const projContent = fs.readFileSync(projFile, 'utf8');
    
    const fileBaseEscaped = baseNameWithoutExt.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const exactNameEscaped = fileName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Check if the file name is explicitly referenced in an import or require
    // Note: We avoid matching partial words by boundary checks
    const importRegex = new RegExp(`(import|require|from)\\s*['"\`].*?\\b(${fileBaseEscaped}|${exactNameEscaped})\\b`, 'i');
    
    if (importRegex.test(projContent)) {
      references[fileName].push(projFile.replace(rootDir, ''));
    }
  });
});

console.log('\n--- EXPORTS DETECTED IN ROOT FILES ---');
Object.keys(exportsFound).forEach(f => {
  if (exportsFound[f].length > 0) {
    console.log(`File: ${f}`);
    exportsFound[f].forEach(exp => console.log(`  - ${exp}`));
  }
});

console.log('\n--- REFERENCE SEARCH RESULTS ---');
let referencedCount = 0;
let unreferencedCount = 0;

Object.keys(references).forEach(f => {
  if (references[f].length > 0) {
    console.log(`[REFERENCED] ${f} is referenced in:`);
    references[f].forEach(ref => console.log(`  - ${ref}`));
    referencedCount++;
  } else {
    unreferencedCount++;
  }
});

console.log(`\nSummary: ${referencedCount} referenced, ${unreferencedCount} unreferenced.`);

