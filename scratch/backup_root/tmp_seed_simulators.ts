
import { createSupabaseServer } from './src/lib/supabase/server';

async function seed() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.from('simulators').upsert([
    {
      slug: 'vision',
      name: 'Vision Canvas',
      description: 'Tablero de visión financiera interactivo con IA.',
      category: 'budgeting',
      icon: '🎯',
      is_active: true,
      sort_order: 10
    },
    {
      slug: 'monthly-budget',
      name: 'Smart Budget Pro',
      description: 'Planificador de presupuesto inteligente con análisis de IA.',
      category: 'budgeting',
      icon: '💰',
      is_active: true,
      sort_order: 11
    }
  ], { onConflict: 'slug' });

  if (error) {
    console.error('Error seeding simulators:', error);
  } else {
    console.log('Simulators seeded successfully!');
  }
}

seed();
