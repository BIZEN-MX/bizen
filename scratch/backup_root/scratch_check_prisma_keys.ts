import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const keys = Object.keys(prisma).filter(k => !k.startsWith('_'));
console.log(keys.filter(k => k.includes('market') || k.includes('sim')));
