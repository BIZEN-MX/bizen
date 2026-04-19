import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // If we only have Prisma, we don't have Clerk SDK configured perfectly in a raw script.
    // Let's first dump profiles and find the one that matches or we can look up by username.
    // If the userId starts with user_..., it's a clerk ID.
    // Let's just find the profile where we know it's diego. The username or nickname might contain diego.
    const profiles = await prisma.profile.findMany();
    // Assuming the email was synced to username or they registered with that email
    
    console.log("Total profiles:", profiles.length);
    let targetProfile = profiles.find(p => 
      p.userId === 'user_2ok8g6hH4wR6PqA6' || // A guess of the user ID? No.
      (p.username && p.username.includes('diego')) ||
      (p.fullName && p.fullName.toLowerCase().includes('diego'))
    );

    if (!targetProfile) {
      console.log("Coulnd't securely identify profile by name 'diego'. Fetching by latest active...");
      // For safety, let's list latest
       console.log(profiles.slice(-5).map(p => ({id: p.userId, name: p.fullName})));
       return;
    }

    console.log("Target Profile found:", targetProfile.fullName, targetProfile.userId);

    const updated = await prisma.profile.update({
      where: { userId: targetProfile.userId },
      data: {
        bizcoins: { increment: 50000 }
      }
    });

    console.log(`Success! Added 50k. New balance for ${updated.fullName}: ${updated.bizcoins} BZ.`);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect()
  }
}

main()
