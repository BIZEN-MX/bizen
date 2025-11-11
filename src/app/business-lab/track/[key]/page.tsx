import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getTrackByKey, getUserLabProgress } from '@/lib/lab/db';
import { StepCard } from '@/components/lab/StepCard';
import { ProgressBar } from '@/components/lab/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: {
    key: string;
  };
}

export default async function TrackPage({ params }: Props) {
  const supabase = await createSupabaseServer();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  // Fetch track data
  let track;
  try {
    track = await getTrackByKey(params.key);
  } catch (error) {
    notFound();
  }

  // Fetch user progress
  const progress = await getUserLabProgress(user.id);
  const progressMap = new Map(progress.map(p => [p.step_id, p]));
  
  // Enrich steps with progress
  const stepsWithProgress = track.steps.map(step => ({
    ...step,
    isCompleted: progressMap.get(step.id)?.is_completed || false
  }));
  
  const completedCount = stepsWithProgress.filter(s => s.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link href="/business-lab">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Lab
          </Button>
        </Link>

        {/* Track Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {track.title}
            </h1>
          </div>
          {track.description && (
            <p className="text-gray-600 text-lg">{track.description}</p>
          )}
        </div>

        {/* Progress Card */}
        <Card className="mb-8 border-2 border-blue-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Progreso en esta Ruta</CardTitle>
            <CardDescription>
              Has completado {completedCount} de {track.steps.length} pasos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar
              current={completedCount}
              total={track.steps.length}
              showNumbers={false}
            />
          </CardContent>
        </Card>

        {/* Steps List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Pasos de esta Ruta</h2>
          {stepsWithProgress.map((step) => (
            <StepCard
              key={step.id}
              id={step.id}
              title={step.title}
              description={step.description}
              order={step.order}
              required={step.required}
              isCompleted={step.isCompleted}
            />
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === track.steps.length && (
          <Card className="mt-8 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700">
                🎉 ¡Felicidades! Has completado esta ruta
              </CardTitle>
              <CardDescription>
                Estás listo para avanzar a la siguiente ruta o explorar herramientas adicionales.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Link href="/business-lab">
                  <Button variant="outline">Ver todas las rutas</Button>
                </Link>
                <Link href="/business-lab/simulators">
                  <Button>Explorar Simuladores</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

