const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

// Credentials from .env
const supabaseUrl = 'https://api.bizen.mx';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

async function recovery() {
  console.log('📡 Starting Data Recovery from Supabase...');

  try {
    // 1. Recover Simulators
    console.log('🔍 Fetching Simulators...');
    const { data: sims, error: simErr } = await supabase.from('simulators').select('*');
    if (simErr) {
        console.warn('⚠️ Could not fetch simulators from Supabase:', simErr.message);
    } else if (sims && sims.length > 0) {
        console.log(`✅ Found ${sims.length} simulators. Syncing to Prisma...`);
        for (const s of sims) {
            await prisma.simulator.upsert({
                where: { slug: s.slug },
                update: {
                    title: s.title || s.name,
                    description: s.description,
                    category: s.category,
                    iconName: s.icon_name || s.icon,
                    buttonColor: s.button_color,
                    isActive: s.is_active,
                    sortOrder: s.sort_order
                },
                create: {
                    slug: s.slug,
                    title: s.title || s.name,
                    description: s.description,
                    category: s.category,
                    iconName: s.icon_name || s.icon,
                    buttonColor: s.button_color,
                    isActive: s.is_active,
                    sortOrder: s.sort_order
                }
            });
        }
    }

    // 2. Recover Market Symbols
    console.log('🔍 Fetching Market Symbols...');
    const { data: syms, error: symErr } = await supabase.from('market_symbols').select('*');
    if (symErr) {
        console.warn('⚠️ Could not fetch symbols from Supabase:', symErr.message);
    } else if (syms && syms.length > 0) {
        console.log(`✅ Found ${syms.length} symbols. Syncing to Prisma...`);
        for (const s of syms) {
            await prisma.market_symbols.upsert({
                where: { symbol: s.symbol },
                update: {
                    name: s.name,
                    type: s.type,
                    is_active: s.is_active
                },
                create: {
                    symbol: s.symbol,
                    name: s.name,
                    type: s.type,
                    is_active: s.is_active
                }
            });
        }
    }

    // 3. Recover Topics & Courses (Basic)
    console.log('🔍 Fetching Topics...');
    const { data: topics, error: topErr } = await supabase.from('topics').select('*, courses(*)');
    if (topErr) {
        console.warn('⚠️ Could not fetch topics from Supabase:', topErr.message);
    } else if (topics && topics.length > 0) {
        console.log(`✅ Found ${topics.length} topics. Syncing to Prisma...`);
        for (const t of topics) {
            const upsertedTopic = await prisma.topic.upsert({
                where: { id: t.id },
                update: {
                    title: t.title,
                    description: t.description,
                    level: t.level || 'Beginner',
                    isActive: t.is_active ?? true,
                    displayOrder: t.display_order || 0
                },
                create: {
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    level: t.level || 'Beginner',
                    isActive: t.is_active ?? true,
                    displayOrder: t.display_order || 0
                }
            });

            if (t.courses) {
                for (const c of t.courses) {
                    await prisma.course.upsert({
                        where: { id: c.id },
                        update: {
                            topicId: upsertedTopic.id,
                            title: c.title,
                            description: c.description,
                            order: c.order || 0,
                            isLocked: c.is_locked || false,
                            isActive: c.is_active ?? true
                        },
                        create: {
                            id: c.id,
                            topicId: upsertedTopic.id,
                            title: c.title,
                            description: c.description,
                            order: c.order || 0,
                            isLocked: c.is_locked || false,
                            isActive: c.is_active ?? true
                        }
                    });
                }
            }
        }
    }

    console.log('🚀 Recovery Operation Finished Successfully!');
  } catch (err) {
    console.error('❌ Fatal error during recovery:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

recovery();
