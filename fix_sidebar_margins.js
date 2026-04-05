#!/usr/bin/env node
/**
 * BIZEN — Replace sidebar margin-left offsets with top-nav padding-top offsets
 * Run: node fix_sidebar_margins.js
 */
const fs = require('fs');
const path = require('path');

const files = [
  'src/app/impacto-social/page.tsx',
  'src/app/account/settings/page.tsx',
  'src/app/comunidad/page.tsx',
  'src/app/mision-del-dia/page.tsx',
  'src/app/cash-flow/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/forum/tag/[slug]/page.tsx',
  'src/app/rankings/page.tsx',
  'src/app/rankings/escuela/[id]/page.tsx',
  'src/app/courses/page.tsx',
  'src/app/forum/following/page.tsx',
  'src/app/forum/thread/[id]/page.tsx',
  'src/app/forum/bookmarks/page.tsx',
  'src/app/forum/search/page.tsx',
  'src/app/forum/page.tsx',
  'src/app/forum/profile/[userId]/page.tsx',
  'src/app/configuracion/page.tsx',
  'src/app/forum/topic/[slug]/page.tsx',
  'src/app/forum/new/page.tsx',
  'src/app/tienda/page.tsx',
];

const ROOT = path.join(__dirname);

let totalFixed = 0;

for (const rel of files) {
  const fullPath = path.join(ROOT, rel);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Not found: ${rel}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Pattern replacements
  // 220px → 0 (tablet) + add padding-top to reach below nav
  // 280px → 0 (desktop) + add padding-top to reach below nav

  // Replace "margin-left: 220px !important;" 
  content = content.replace(/margin-left:\s*220px\s*!important;/g, 'margin-left: 0 !important;');
  content = content.replace(/margin-left:\s*280px\s*!important;/g, 'margin-left: 0 !important;');

  // Replace "margin-left:220px!important"
  content = content.replace(/margin-left:220px!important/g, 'margin-left:0!important');
  content = content.replace(/margin-left:280px!important/g, 'margin-left:0!important');

  // Remove "width: calc(100% - 220px)" → "width: 100%"
  content = content.replace(/width:\s*calc\(100%\s*-\s*220px\)\s*!important;/g, 'width: 100% !important;');
  content = content.replace(/width:\s*calc\(100%\s*-\s*280px\)\s*!important;/g, 'width: 100% !important;');
  content = content.replace(/max-width:\s*calc\(100%\s*-\s*220px\)\s*!important;/g, 'max-width: 100% !important;');
  content = content.replace(/max-width:\s*calc\(100%\s*-\s*280px\)\s*!important;/g, 'max-width: 100% !important;');

  // Also handle compact (no space) versions
  content = content.replace(/width:calc\(100%-220px\)!important/g, 'width:100%!important');
  content = content.replace(/width:calc\(100%-280px\)!important/g, 'width:100%!important');
  content = content.replace(/max-width:calc\(100%-220px\)!important/g, 'max-width:100%!important');
  content = content.replace(/max-width:calc\(100%-280px\)!important/g, 'max-width:100%!important');

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    totalFixed++;
    console.log(`✅ Fixed: ${rel}`);
  } else {
    console.log(`— No changes: ${rel}`);
  }
}

console.log(`\n✨ Done — fixed ${totalFixed} files.`);
