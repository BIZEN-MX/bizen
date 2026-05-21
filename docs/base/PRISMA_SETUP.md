# Prisma + Supabase Integration Setup

This project now uses Prisma as an ORM to interact with your Supabase PostgreSQL database.

## 🚀 Quick Setup

1. **Run the setup script:**
   ```bash
   node scripts/setup-prisma.js
   ```

2. **Configure your environment variables:**
   - Update `.env.local` with your Supabase PostgreSQL connection string
   - Get your connection string from Supabase Dashboard → Settings → Database

3. **Sync your database schema:**
   ```bash
   npx prisma db push
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Start your development server:**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The Prisma schema includes the following models:

- **UserSectionCompletion**: Tracks section completion by users
- **UserModuleProgress**: Tracks overall module progress
- **Progress**: General progress tracking
- **Course**: Course information
- **Module**: Module information within courses
- **Section**: Section information within modules

## 🔧 Available Commands

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply migrations (if using migrations)

## 📝 API Routes

- `GET /api/curriculum` - Fetch curriculum data using Prisma
- `POST /api/progress/complete` - Mark sections as completed using Prisma

## 🔄 Migration from Direct Supabase Queries

The following files have been updated to use Prisma:

- `src/lib/prisma.ts` - Prisma client configuration
- `src/app/api/curriculum/route.ts` - New API route using Prisma
- `src/app/api/progress/complete/route.ts` - Updated to use Prisma
- `src/app/dashboard/page.tsx` - Updated to use new API routes

## 🛠️ Development

When you make changes to the Prisma schema:

1. Update `prisma/schema.prisma`
2. Run `npx prisma generate` to update the client
3. Run `npx prisma db push` to sync with your database

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase + Prisma Guide](https://supabase.com/docs/guides/integrations/prisma)
- [Next.js + Prisma](https://www.prisma.io/docs/getting-started/quickstart)
