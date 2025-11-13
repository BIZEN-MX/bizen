/**
 * Seed Script: Financial Simulators
 * Run with: npx tsx scripts/seed-simulators.ts
 * 
 * Populates the simulators table with the 6 initial simulators
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const simulators = [
  {
    slug: 'monthly-budget',
    name: 'Presupuesto Mensual Inteligente',
    description: 'Toma el control total de tus finanzas personales. Descubre cómo distribuir tu ingreso de forma óptima entre necesidades, deseos y ahorro. Utiliza la probada regla 50/30/20 o personaliza tu estrategia. Recibe recomendaciones específicas para mejorar tu salud financiera y alcanzar tus metas.',
    category: 'budgeting',
    icon: '💰',
    sort_order: 1,
    is_active: true,
  },
  {
    slug: 'savings-goal',
    name: 'Meta de Ahorro e Interés Compuesto',
    description: 'Calcula cuánto crecerán tus ahorros con aportaciones mensuales y rendimientos, o cuánto tiempo te tomará alcanzar una meta.',
    category: 'savings',
    icon: '🎯',
    sort_order: 2,
    is_active: true,
  },
  {
    slug: 'credit-card-payoff',
    name: 'Liquidación de Tarjeta de Crédito',
    description: 'Compara cuánto tardarás y pagarás si haces pagos mínimos vs. pagos fijos mayores.',
    category: 'credit',
    icon: '💳',
    sort_order: 3,
    is_active: true,
  },
  {
    slug: 'simple-loan',
    name: 'Préstamo Simple / Microcrédito',
    description: 'Calcula tu pago mensual, tabla de amortización y CAT aproximado para un préstamo con comisiones.',
    category: 'credit',
    icon: '🏦',
    sort_order: 4,
    is_active: true,
  },
  {
    slug: 'investment-comparison',
    name: 'Comparación de Inversiones',
    description: 'Compara tres opciones de inversión (ahorro tradicional, CETES, fondo) y ve cuál da mejores resultados.',
    category: 'investment',
    icon: '📈',
    sort_order: 5,
    is_active: true,
  },
  {
    slug: 'inflation-calculator',
    name: 'Inflación y Poder Adquisitivo',
    description: 'Descubre cuánto costará un producto en el futuro y cuánto necesitas ganar para mantener tu poder de compra.',
    category: 'inflation',
    icon: '📊',
    sort_order: 6,
    is_active: true,
  },
];

async function seedSimulators() {
  console.log('🌱 Starting seed process...\n');
  
  try {
    // First, check if simulators already exist
    const { data: existing, error: checkError } = await supabase
      .from('simulators')
      .select('slug');
    
    if (checkError) {
      throw new Error(`Error checking existing simulators: ${checkError.message}`);
    }
    
    const existingSlugs = new Set(existing?.map((s) => s.slug) || []);
    
    // Insert or update each simulator
    for (const simulator of simulators) {
      if (existingSlugs.has(simulator.slug)) {
        console.log(`⏭️  Skipping "${simulator.name}" (already exists)`);
        
        // Update existing simulator
        const { error: updateError } = await supabase
          .from('simulators')
          .update({
            name: simulator.name,
            description: simulator.description,
            category: simulator.category,
            icon: simulator.icon,
            sort_order: simulator.sort_order,
            is_active: simulator.is_active,
          })
          .eq('slug', simulator.slug);
        
        if (updateError) {
          console.error(`❌ Error updating "${simulator.name}":`, updateError.message);
        } else {
          console.log(`✅ Updated "${simulator.name}"`);
        }
      } else {
        // Insert new simulator
        const { error: insertError } = await supabase
          .from('simulators')
          .insert(simulator);
        
        if (insertError) {
          console.error(`❌ Error inserting "${simulator.name}":`, insertError.message);
        } else {
          console.log(`✅ Inserted "${simulator.name}"`);
        }
      }
    }
    
    console.log('\n✨ Seed process completed successfully!');
    
    // Display summary
    const { data: allSimulators, error: summaryError } = await supabase
      .from('simulators')
      .select('slug, name, is_active')
      .order('sort_order');
    
    if (!summaryError && allSimulators) {
      console.log('\n📊 Current simulators in database:');
      allSimulators.forEach((sim) => {
        console.log(`   ${sim.is_active ? '✅' : '❌'} ${sim.name} (${sim.slug})`);
      });
    }
  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedSimulators();

