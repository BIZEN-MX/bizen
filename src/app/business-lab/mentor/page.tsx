import React from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getActiveMentors } from '@/lib/lab/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Star, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Mentores | Business Lab',
  description: 'Encuentra mentores que te ayuden con tu startup'
};

export default async function MentorPage() {
  const supabase = await createSupabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  const mentors = await getActiveMentors();

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
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Encuentra un Mentor
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Conecta con emprendedores experimentados que pueden guiarte
          </p>
        </div>

        {/* AI Match */}
        <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Encuentra tu Mentor Ideal con AI
            </CardTitle>
            <CardDescription>
              Responde algunas preguntas y te recomendaremos mentores perfectos para ti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Comenzar Match AI
            </Button>
          </CardContent>
        </Card>

        {/* Mentors List */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Mentores Disponibles</h2>
          <p className="text-gray-600">
            {mentors.length} mentores activos en la comunidad
          </p>
        </div>

        {mentors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Próximamente</h3>
              <p className="text-gray-600 mb-4">
                Estamos reclutando mentores experimentados para ayudarte en tu startup.
              </p>
              <Button variant="outline">
                Quiero ser mentor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor: any) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {mentor.profiles?.nickname || 'Mentor'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {mentor.profiles?.reputation || 0} reputación
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {mentor.bio && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {mentor.bio}
                    </p>
                  )}
                  {mentor.topics && mentor.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.topics.slice(0, 3).map((topic: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Solicitar Sesión
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Become Mentor */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>¿Quieres ser mentor?</CardTitle>
            <CardDescription>
              Si tienes experiencia emprendiendo, puedes ayudar a otros en su camino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              Aplicar como Mentor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

