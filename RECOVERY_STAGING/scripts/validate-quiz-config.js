/**
 * Validate Quiz Configuration
 * 
 * This script checks that QUIZ_PAGES configuration is consistent across all three files:
 * 1. src/app/module/[moduleId]/section/[section]/page/[page]/page.tsx
 * 2. src/app/api/sections/complete/route.ts
 * 3. src/app/api/progress/quiz-submit/route.ts
 * 
 * Run this before deploying to catch configuration mismatches.
 */

import fs from 'fs';
import path from 'path';

const files = [
  'src/app/module/[moduleId]/section/[section]/page/[page]/page.tsx',
  'src/app/api/sections/complete/route.ts',
  'src/app/api/progress/quiz-submit/route.ts',
];

// Extract QUIZ_PAGES from a file
function extractQuizConfig(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find QUIZ_PAGES definition
  const quizPagesMatch = content.match(/const QUIZ_PAGES[^=]*=\s*({[\s\S]*?});/);
  if (!quizPagesMatch) {
    return null;
  }
  
  // Parse the configuration (very basic parsing, might need improvement)
  const configStr = quizPagesMatch[1];
  
  // Extract quiz counts per module/section
  const config = {};
  
  // Match module definitions: 1: { ... }, 2: { ... }
  const moduleMatches = [...configStr.matchAll(/(\d+):\s*{([^}]*?)}/g)];
  
  for (const moduleMatch of moduleMatches) {
    const moduleId = parseInt(moduleMatch[1]);
    const moduleContent = moduleMatch[2];
    
    config[moduleId] = {};
    
    // Match section definitions within module
    const sectionMatches = [...moduleContent.matchAll(/(\d+):\s*{([^}]*?)}/g)];
    
    for (const sectionMatch of sectionMatches) {
      const sectionId = parseInt(sectionMatch[1]);
      const sectionContent = sectionMatch[2];
      
      // Count number of page quizzes (e.g., "3: { type:", "4: { type:")
      const quizMatches = [...sectionContent.matchAll(/\d+:\s*{[^}]*type:/g)];
      config[moduleId][sectionId] = quizMatches.length;
    }
  }
  
  return config;
}

// Compare two configurations
function compareConfigs(config1, config2, file1, file2) {
  const differences = [];
  
  // Check all modules in config1
  for (const moduleId in config1) {
    if (!config2[moduleId]) {
      differences.push(`Module ${moduleId} exists in ${file1} but not in ${file2}`);
      continue;
    }
    
    // Check all sections in this module
    for (const sectionId in config1[moduleId]) {
      const count1 = config1[moduleId][sectionId];
      const count2 = config2[moduleId]?.[sectionId];
      
      if (count2 === undefined) {
        differences.push(
          `M${moduleId}S${sectionId}: exists in ${file1} but not in ${file2}`
        );
      } else if (count1 !== count2) {
        differences.push(
          `M${moduleId}S${sectionId}: ${file1} has ${count1} quizzes, ${file2} has ${count2} quizzes`
        );
      }
    }
  }
  
  // Check for modules/sections in config2 but not in config1
  for (const moduleId in config2) {
    if (!config1[moduleId]) {
      differences.push(`Module ${moduleId} exists in ${file2} but not in ${file1}`);
      continue;
    }
    
    for (const sectionId in config2[moduleId]) {
      if (config1[moduleId][sectionId] === undefined) {
        differences.push(
          `M${moduleId}S${sectionId}: exists in ${file2} but not in ${file1}`
        );
      }
    }
  }
  
  return differences;
}

// Pretty print configuration
function printConfig(config, title) {
  console.log(`\n${title}:`);
  console.log('─'.repeat(50));
  
  for (const moduleId in config) {
    console.log(`\nModule ${moduleId}:`);
    for (const sectionId in config[moduleId]) {
      const count = config[moduleId][sectionId];
      const emoji = count === 0 ? '⭕' : count === 1 ? '1️⃣' : '2️⃣';
      console.log(`  ${emoji} Section ${sectionId}: ${count} quiz${count !== 1 ? 'zes' : ''}`);
    }
  }
}

// Main validation
async function validateQuizConfig() {
  console.log('🔍 Validating Quiz Configuration Across Files...\n');
  
  const configs = {};
  
  // Extract configurations from all files
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${file}`);
      continue;
    }
    
    const config = extractQuizConfig(filePath);
    
    if (!config) {
      console.error(`❌ Could not extract QUIZ_PAGES from: ${file}`);
      continue;
    }
    
    configs[file] = config;
    printConfig(config, file);
  }
  
  console.log('\n\n📊 Comparing Configurations...\n');
  console.log('═'.repeat(70));
  
  // Compare all files with each other
  const fileNames = Object.keys(configs);
  let allMatch = true;
  let totalDifferences = 0;
  
  for (let i = 0; i < fileNames.length; i++) {
    for (let j = i + 1; j < fileNames.length; j++) {
      const file1 = fileNames[i];
      const file2 = fileNames[j];
      
      const differences = compareConfigs(
        configs[file1],
        configs[file2],
        path.basename(file1),
        path.basename(file2)
      );
      
      if (differences.length > 0) {
        allMatch = false;
        totalDifferences += differences.length;
        
        console.log(`\n❌ Differences between ${path.basename(file1)} and ${path.basename(file2)}:`);
        differences.forEach(diff => console.log(`   • ${diff}`));
      }
    }
  }
  
  console.log('\n' + '═'.repeat(70));
  
  if (allMatch) {
    console.log('\n✅ SUCCESS! All quiz configurations match perfectly! 🎉\n');
    return true;
  } else {
    console.log(`\n❌ FAILED! Found ${totalDifferences} differences across files.\n`);
    console.log('⚠️  Please update all QUIZ_PAGES configurations to match.\n');
    console.log('💡 Tip: Consider creating a shared config file to avoid this issue.\n');
    console.log('   See HOW_TO_ADD_QUIZ.md for details.\n');
    return false;
  }
}

// Run validation
validateQuizConfig()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Validation failed with error:', error);
    process.exit(1);
  });

