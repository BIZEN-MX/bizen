import React from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, DollarSign, Calculator, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Simuladores | Business Lab',
  description: 'Calculadoras financieras para tu startup'
};

export default async function SimulatorsPage() {
  const supabase = await createSupabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  const simulators = [
    {
      id: 'cashflow',
      title: 'Proyección de Cashflow',
      description: 'Calcula tu runway, burn rate y proyección de efectivo mensual',
      icon: DollarSign,
      color: 'blue'
    },
    {
      id: 'breakeven',
      title: 'Punto de Equilibrio',
      description: 'Determina cuántas unidades necesitas vender para ser rentable',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'pricing',
      title: 'Estrategia de Precios',
      description: 'Crea planes Good-Better-Best con márgenes calculados',
      icon: Calculator,
      color: 'purple'
    },
    {
      id: 'funnel',
      title: 'Embudo de Conversión',
      description: 'Analiza tus métricas de adquisición y CAC/LTV',
      icon: BarChart3,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/business-lab">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Lab
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simuladores Financieros
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Herramientas para modelar y validar los números de tu startup
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulators.map((simulator) => {
            const Icon = simulator.icon;
            return (
              <Card key={simulator.id} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg bg-${simulator.color}-100`}>
                      <Icon className={`w-6 h-6 text-${simulator.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{simulator.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {simulator.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/lab/simulators/${simulator.id}`}>
                    <Button className="w-full">
                      Abrir Simulador
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">💡 Tip</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              Todos tus cálculos se guardan automáticamente. Puedes volver a revisar
              escenarios anteriores en cualquier momento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

