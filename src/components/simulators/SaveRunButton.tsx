'use client';

/**
 * SaveRunButton Component
 * Button to save simulator run to database
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface SaveRunButtonProps {
  simulatorSlug: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  onSaved?: () => void;
  disabled?: boolean;
}

export function SaveRunButton({
  simulatorSlug,
  inputs,
  outputs,
  onSaved,
  disabled = false,
}: SaveRunButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [runName, setRunName] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  
  async function handleSave() {
    setIsSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/simuladores/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulator_slug: simulatorSlug,
          run_name: runName || undefined,
          inputs,
          outputs,
          notes: notes || undefined,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar');
      }
      
      // Success
      setIsOpen(false);
      setRunName('');
      setNotes('');
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="default">
          💾 Guardar Simulación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guardar Simulación</DialogTitle>
          <DialogDescription>
            Dale un nombre a esta simulación para encontrarla fácilmente más tarde.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="run-name" className="text-sm font-medium">
              Nombre (opcional)
            </label>
            <Input
              id="run-name"
              placeholder="Ej: Mi presupuesto 2025"
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              placeholder="Agrega comentarios o detalles..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-[#FBFAF5] px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

