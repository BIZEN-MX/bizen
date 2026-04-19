const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const keys = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
console.log('All Prisma keys:', JSON.stringify(keys, null, 2));
process.exit(0);
