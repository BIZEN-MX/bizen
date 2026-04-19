import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function updateRoles() {
    try {
        const result = await prisma.profile.updateMany({
            data: {
                role: 'school_admin',
                schoolId: 'sch_1' // Also ensure they have a school linked
            }
        });
        console.log(`Successfully updated ${result.count} profiles to school_admin`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

updateRoles();
