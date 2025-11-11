import React from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getTemplates } from '@/lib/lab/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Templates | Business Lab',
  description: 'Plantillas reutilizables para tu startup'
};

export default async function TemplatesPage() {
  const supabase = await createSupabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  const templates = await getTemplates();
  
  // Group by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const category = template.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  const categoryNames: Record<string, string> = {
    discovery: 'Descubrimiento',
    validation: 'Validación',
    planning: 'Planificación',
    build: 'Construcción',
    pitch: 'Pitch',
    other: 'Otros'
  };

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
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Templates
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Plantillas probadas para acelerar el desarrollo de tu startup
          </p>
        </div>

        {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{categoryNames[category] || category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{template.code}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {template.sample && (
                      <p className="text-sm text-gray-600 italic mb-4">
                        "{template.sample}"
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Ver Ejemplo
                      </Button>
                      <Button size="sm">
                        Usar Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

