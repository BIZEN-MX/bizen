import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function extractInsertAndUpdateStatements(sql: string): string[] {
  // Simple state machine to extract full statements
  const statements: string[] = [];
  let currentStmt = '';
  let inString = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    
    if (char === "'" && sql[i-1] !== '\\') {
      inString = !inString;
    }
    
    currentStmt += char;
    
    if (char === ';' && !inString) {
      const cleanStmt = currentStmt.trim();
      if (cleanStmt.toUpperCase().startsWith('INSERT') || cleanStmt.toUpperCase().startsWith('UPDATE')) {
        statements.push(cleanStmt);
      }
      currentStmt = '';
    }
  }
  
  return statements;
}

async function runFile(filename: string) {
  console.log(`Processing ${filename}...`);
  const filepath = path.join(__dirname, '..', 'database_seeds', filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`File not found: ${filepath}`);
    return;
  }
  const sql = fs.readFileSync(filepath, 'utf8');
  
  // Remove single line comments
  const noComments = sql.replace(/--.*$/gm, '');
  
  const statements = extractInsertAndUpdateStatements(noComments);
  console.log(`Found ${statements.length} INSERT/UPDATE statements.`);
  
  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch (e: any) {
      console.error(`Error executing statement: ${stmt.substring(0, 50)}...`);
      console.error(e.message);
    }
  }
}

async function main() {
  console.log('🌱 Seeding Cashflow Simulator Data...');
  
  // 1. Insert professions (English base)
  await runFile('CASHFLOW_GAME_SCHEMA.sql');
  
  // 2. Update professions to Spanish
  await runFile('CASHFLOW_UPDATE_PROFESSIONS_SPANISH.sql');
  
  // 3. Insert base opportunity cards (Spanish)
  await runFile('CASHFLOW_OPPORTUNITY_CARDS.sql');
  
  // 4. Insert fast track cards
  await runFile('CASHFLOW_FAST_TRACK_CARDS.sql');
  
  // 5. Insert doodads
  await runFile('CASHFLOW_DOODADS.sql');

  console.log('✅ Cashflow Database Seeding Complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
