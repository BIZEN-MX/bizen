import React from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Presentation, FileText, HelpCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pitch | Business Lab',
  description: 'Prepara tu presentación para inversionistas'
};

export default async function PitchPage() {
  const supabase = await createSupabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  const pitchSections = [
    { title: 'Problema', time: '1 min', completed: false },
    { title: 'Solución', time: '1 min', completed: false },
    { title: 'Oportunidad de Mercado', time: '1 min', completed: false },
    { title: 'Producto/Demo', time: '2 min', completed: false },
    { title: 'Tracción', time: '1 min', completed: false },
    { title: 'Modelo de Negocio', time: '1 min', completed: false },
    { title: 'Competencia', time: '1 min', completed: false },
    { title: 'Equipo', time: '1 min', completed: false },
    { title: 'Financiamiento', time: '30 seg', completed: false },
    { title: 'Visión', time: '30 seg', completed: false }
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
            <Presentation className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prepara tu Pitch
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Herramientas para crear y practicar tu presentación de inversionistas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pitch Deck */}
          <Card className="lg:col-span-2 border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Presentation className="w-5 h-5" />
                    Estructura de Pitch (10 min)
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Cubre estos 10 elementos esenciales en tu presentación
                  </CardDescription>
                </div>
                <Badge variant="outline">0/10</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pitchSections.map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        section.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500">{section.time}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar con AI
                </Button>
                <Button variant="outline">
                  Ver Ejemplo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* One Pager */}
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  One Pager
                </CardTitle>
                <CardDescription>
                  Resumen ejecutivo de 1 página
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Crear One Pager
                </Button>
              </CardContent>
            </Card>

            {/* Q&A Prep */}
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Preparación Q&A
                </CardTitle>
                <CardDescription>
                  Preguntas frecuentes de inversionistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Ver Preguntas
                </Button>
              </CardContent>
            </Card>

            {/* AI Coach */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Pitch Coach AI
                </CardTitle>
                <CardDescription>
                  Recibe feedback inteligente sobre tu pitch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Analizar Pitch
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">💡 Tips para un Pitch Efectivo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Cuenta una historia: Conecta emocionalmente con tu audiencia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Muestra tracción: Los números reales convencen más que las proyecciones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Practica, practica, practica: Debes poder dar tu pitch sin slides</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Sé claro con "el pedido": ¿Cuánto necesitas y para qué?</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

