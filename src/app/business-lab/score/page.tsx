'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/lab/ProgressBar';
import { ArrowLeft, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ScoreData {
  readiness_score: number;
  notes: string | null;
  breakdown: Record<string, number> | null;
}

export default function ScorePage() {
  const router = useRouter();
  const [score, setScore] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScore();
  }, []);

  const fetchScore = async () => {
    try {
      const response = await fetch('/api/lab/score');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch score');
      }
      const data = await response.json();
      setScore(data.data);
    } catch (error) {
      console.error('Error fetching score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu score...</p>
        </div>
      </div>
    );
  }

  const scoreValue = score?.readiness_score || 0;
  const scoreColor = scoreValue >= 70 ? 'green' : scoreValue >= 40 ? 'yellow' : 'red';
  const scoreLabel = scoreValue >= 70 ? 'Excelente' : scoreValue >= 40 ? 'En Progreso' : 'Inicial';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/business-lab">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Lab
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Investment Readiness Score
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Evalúa qué tan preparado estás para buscar inversión
          </p>
        </div>

        {/* Main Score Card */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Tu Puntuación Actual</CardTitle>
            <CardDescription>
              Basada en tu progreso en el Business Lab
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {scoreValue}
              </div>
              <div className={`text-xl font-semibold text-${scoreColor}-600`}>
                {scoreLabel}
              </div>
            </div>
            <ProgressBar current={scoreValue} total={100} showNumbers={false} />
          </CardContent>
        </Card>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Fortalezas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Has validado tu problema con usuarios reales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Tienes un modelo de negocio claro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Has comenzado a trabajar en tu MVP</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Áreas de Mejora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">!</span>
                  <span>Completa tu análisis de mercado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">!</span>
                  <span>Define tu estrategia de crecimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">!</span>
                  <span>Prepara tu pitch deck</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle>Próximos Pasos para Mejorar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span>Completa la ruta "Validar"</span>
              <Link href="/business-lab/track/validate">
                <Button size="sm">Ver Ruta</Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span>Usa el simulador de Pricing</span>
              <Link href="/business-lab/simulators/pricing">
                <Button size="sm">Abrir</Button>
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span>Prepara tu pitch</span>
              <Link href="/business-lab/pitch">
                <Button size="sm">Comenzar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

