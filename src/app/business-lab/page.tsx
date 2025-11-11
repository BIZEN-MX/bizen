'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TrackCard } from '@/components/lab/TrackCard';
import { ProgressBar } from '@/components/lab/ProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, ArrowRight, Lightbulb, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LabPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tracks, setTracks] = useState<any[]>([]);
  const [nextStep, setNextStep] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/lab/tracks');
      if (!response.ok) throw new Error('Failed to fetch tracks');
      const data = await response.json();
      setTracks(data.data || []);
      
      // Find next recommended step
      const allSteps = data.data.flatMap((track: any) => 
        track.steps.map((step: any) => ({ ...step, trackKey: track.key, trackTitle: track.title }))
      );
      const nextIncomplete = allSteps.find((step: any) => !step.progress?.is_completed);
      setNextStep(nextIncomplete || null);
    } catch (error) {
      console.error('Error fetching lab data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Business Lab...</p>
        </div>
      </div>
    );
  }

  // Calculate progress stats
  const totalSteps = tracks.reduce((sum, track) => sum + (track.totalSteps || 0), 0);
  const completedSteps = tracks.reduce((sum, track) => sum + (track.completedSteps || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Business Lab
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Construye tu startup desde la idea hasta el lanzamiento con herramientas y guías paso a paso.
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 border-2 border-blue-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Tu Progreso General
            </CardTitle>
            <CardDescription>
              Has completado {completedSteps} de {totalSteps} pasos en el programa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar current={completedSteps} total={totalSteps} showNumbers={false} />
          </CardContent>
        </Card>

        {/* Next Step Card */}
        {nextStep && (
          <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Siguiente Paso Recomendado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{nextStep.title}</h3>
                  <p className="text-gray-600 mb-3">{nextStep.description}</p>
                  {nextStep.goal && (
                    <p className="text-sm text-blue-600">🎯 {nextStep.goal}</p>
                  )}
                </div>
                <Link href={`/business-lab/step/${nextStep.id}`}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Comenzar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/business-lab/templates">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📄 Templates
                </CardTitle>
                <CardDescription>Lean Canvas, Personas, Pitch</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/business-lab/simulators">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  🧮 Simuladores
                </CardTitle>
                <CardDescription>Cashflow, Breakeven, Pricing</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/business-lab/score">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Investment Score
                </CardTitle>
                <CardDescription>Evalúa tu preparación</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Tracks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Rutas de Aprendizaje
          </h2>
          <p className="text-gray-600 mb-6">
            Sigue estas 6 rutas para construir tu startup de forma estructurada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                id={track.id}
                keyName={track.key}
                title={track.title}
                description={track.description}
                order={track.order}
                completedSteps={track.completedSteps}
                totalSteps={track.totalSteps}
              />
            ))}
          </div>
        </div>

        {/* Content Guidelines */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm">⚠️ Normas de Uso</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <ul className="list-disc list-inside space-y-1">
              <li>Mantén un lenguaje respetuoso en todos los espacios</li>
              <li>Los datos que compartas son privados por defecto</li>
              <li>Usa los simuladores y herramientas AI con responsabilidad</li>
              <li>Reporta cualquier problema a soporte@bizen.mx</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

