'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChecklistItem } from '@/components/lab/ChecklistItem';
import { ArtifactCard } from '@/components/lab/ArtifactCard';
import { AIButton } from '@/components/lab/AIButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface StepData {
  id: string;
  title: string;
  description: string | null;
  goal: string | null;
  order: number;
  lab_tracks: {
    title: string;
    key: string;
  };
  checklists: Array<{
    id: string;
    text: string;
    done: boolean;
    order: number;
  }>;
  artifacts: Array<{
    id: string;
    type: string;
    title: string;
    content: string | null;
    url: string | null;
    created_at: string;
  }>;
  experiments: Array<any>;
  progress: {
    is_completed: boolean;
  } | null;
}

export default function StepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stepId = params.id as string;
  
  const [stepData, setStepData] = useState<StepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [showArtifactDialog, setShowArtifactDialog] = useState(false);
  const [newArtifact, setNewArtifact] = useState({
    title: '',
    type: 'note',
    content: ''
  });

  useEffect(() => {
    fetchStepData();
  }, [stepId]);

  const fetchStepData = async () => {
    try {
      const response = await fetch(`/api/lab/steps/${stepId}`);
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch step');
      }
      const data = await response.json();
      setStepData(data.data);
    } catch (error) {
      console.error('Error fetching step:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklist = async (id: string, currentDone: boolean) => {
    try {
      await fetch('/api/lab/checklists', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, done: !currentDone })
      });
      fetchStepData();
    } catch (error) {
      console.error('Error toggling checklist:', error);
    }
  };

  const addChecklist = async () => {
    if (!newChecklistText.trim()) return;
    
    try {
      await fetch('/api/lab/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_id: stepId,
          text: newChecklistText,
          order: stepData?.checklists.length || 0
        })
      });
      setNewChecklistText('');
      fetchStepData();
    } catch (error) {
      console.error('Error adding checklist:', error);
    }
  };

  const saveArtifact = async () => {
    if (!newArtifact.title.trim()) return;
    
    try {
      await fetch('/api/lab/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_id: stepId,
          ...newArtifact
        })
      });
      setNewArtifact({ title: '', type: 'note', content: '' });
      setShowArtifactDialog(false);
      fetchStepData();
    } catch (error) {
      console.error('Error saving artifact:', error);
    }
  };

  const markStepComplete = async () => {
    // Mark step as complete
    const allChecklistsDone = stepData?.checklists.every(c => c.done) ?? false;
    if (!allChecklistsDone) {
      alert('Por favor completa todos los items de la checklist primero');
      return;
    }
    
    // Call API to update step progress (you may need to create this endpoint)
    alert('¡Paso completado! Avanzando al siguiente...');
    router.push(`/lab/track/${stepData?.lab_tracks.key}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando paso...</p>
        </div>
      </div>
    );
  }

  if (!stepData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Paso no encontrado</h2>
          <Link href="/business-lab">
            <Button>Volver al Lab</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allChecklistsDone = stepData.checklists.every(c => c.done);
  const isCompleted = stepData.progress?.is_completed || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link href={`/lab/track/${stepData.lab_tracks.key}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a {stepData.lab_tracks.title}
          </Button>
        </Link>

        {/* Step Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {stepData.order}. {stepData.title}
          </h1>
          {stepData.description && (
            <p className="text-gray-600 text-lg mb-3">{stepData.description}</p>
          )}
          {stepData.goal && (
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              🎯 <span className="font-medium">Objetivo:</span> {stepData.goal}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Checklist</CardTitle>
                <CardDescription>
                  Completa estos items para avanzar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {stepData.checklists.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      text={item.text}
                      done={item.done}
                      onToggle={() => toggleChecklist(item.id, item.done)}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar nuevo item..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addChecklist()}
                  />
                  <Button onClick={addChecklist} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Artifacts */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mis Artefactos</CardTitle>
                    <CardDescription>
                      Outputs y documentos que has creado
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowArtifactDialog(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {stepData.artifacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aún no has creado ningún artefacto. Usa las herramientas AI o crea uno manualmente.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {stepData.artifacts.map((artifact) => (
                      <ArtifactCard
                        key={artifact.id}
                        title={artifact.title}
                        type={artifact.type}
                        content={artifact.content}
                        url={artifact.url}
                        createdAt={artifact.created_at}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mark Complete */}
            {allChecklistsDone && !isCompleted && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        ¿Listo para continuar?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Has completado todos los items. Marca este paso como completado.
                      </p>
                    </div>
                    <Button
                      onClick={markStepComplete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Marcar Completo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Helpers */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Herramientas AI
                </CardTitle>
                <CardDescription>
                  Asistentes inteligentes para este paso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <AIButton
                  label="Refinar Idea"
                  onClick={() => alert('AI Helper en desarrollo')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                />
                <AIButton
                  label="Generar Entrevista"
                  onClick={() => alert('AI Helper en desarrollo')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                />
                <AIButton
                  label="Crear Lean Canvas"
                  onClick={() => alert('AI Helper en desarrollo')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Ask Forum */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  ¿Necesitas ayuda?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Pregunta a la comunidad sobre este paso
                </p>
                <Link href={`/forum/new?context=business-lab-step-${stepId}`}>
                  <Button variant="outline" className="w-full">
                    Preguntar en el Foro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">📄 Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/business-lab/templates">
                  <Button variant="outline" className="w-full">
                    Ver Templates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Artifact Dialog */}
        <Dialog open={showArtifactDialog} onOpenChange={setShowArtifactDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Artefacto</DialogTitle>
              <DialogDescription>
                Guarda tu trabajo, ideas o documentos relacionados con este paso
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Título</label>
                <Input
                  value={newArtifact.title}
                  onChange={(e) => setNewArtifact({...newArtifact, title: e.target.value})}
                  placeholder="Ej: Mi Lean Canvas v1"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newArtifact.type}
                  onChange={(e) => setNewArtifact({...newArtifact, type: e.target.value})}
                >
                  <option value="note">Nota</option>
                  <option value="canvas">Canvas</option>
                  <option value="persona">Persona</option>
                  <option value="experiment">Experimento</option>
                  <option value="pitch">Pitch</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contenido</label>
                <Textarea
                  value={newArtifact.content}
                  onChange={(e) => setNewArtifact({...newArtifact, content: e.target.value})}
                  placeholder="Escribe tu contenido aquí..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowArtifactDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={saveArtifact}>
                Guardar Artefacto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

