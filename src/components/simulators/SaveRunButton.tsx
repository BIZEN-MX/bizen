'use client';

/**
 * SaveRunButton Component
 * Premium BIZEN UI — Button to save simulator run with a sleek dialog
 */

import * as React from 'react';
import { 
  Save, 
  X, 
  Check, 
  Loader2, 
  PlusCircle, 
  Tag, 
  FileText,
  Bookmark
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const router = useRouter();

  const handleSave = async () => {
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
      setSaveSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSaveSuccess(false);
        setRunName('');
        setNotes('');
        onSaved?.();
        // Optional: refresh history if in background
        router.refresh();
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  };

  const BLUE = '#0B71FE';
  const NAVY = '#0F172A';
  const BG = '#FBFAF5';
  const MUTED = '#64748B';

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '16px 24px',
          background: 'white',
          border: `2.5px solid ${BLUE}`,
          borderRadius: 16,
          color: BLUE,
          fontSize: 15,
          fontWeight: 800,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: disabled ? 0.6 : 1,
          marginTop: 20,
          boxShadow: '0 4px 12px rgba(11, 113, 254, 0.1)',
        }}
        onMouseEnter={e => { if(!disabled) { e.currentTarget.style.background = BLUE; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
        onMouseLeave={e => { if(!disabled) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = BLUE; e.currentTarget.style.transform = 'translateY(0)'; } }}
      >
        <Bookmark size={18} strokeWidth={2.5} />
        Guardar Simulación en Historial
      </button>

      {/* Custom Dialog Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: 460,
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <style>{`
              @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                width: 36, height: 36, borderRadius: '50%',
                background: '#F1F5F9', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748B', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
              onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: 28 }}>
              <div style={{ 
                width: 54, height: 54, borderRadius: 16, background: `${BLUE}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: BLUE, marginBottom: 16
              }}>
                <Save size={26} strokeWidth={2} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Guardar Simulación
              </h2>
              <p style={{ fontSize: 15, color: MUTED, margin: 0, lineHeight: 1.5 }}>
                Dale un nombre a este análisis para que puedas encontrarlo fácilmente en tu historial.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
                  <Tag size={14} color={BLUE} />
                  NOMBRE DE LA SIMULACIÓN
                </label>
                <input 
                  type="text"
                  placeholder="Ej: Mi presupuesto 2025"
                  value={runName}
                  onChange={e => setRunName(e.target.value)}
                  maxLength={100}
                  style={{
                    width: '100%', height: 48, padding: '0 16px',
                    background: BG, border: '1.5px solid #E2E8F0',
                    borderRadius: 14, fontSize: 15, color: NAVY,
                    outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.boxShadow = `0 0 0 4px ${BLUE}15`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
                  <FileText size={14} color={BLUE} />
                  NOTAS (OPCIONAL)
                </label>
                <textarea 
                  placeholder="Agrega comentarios o detalles extra..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  maxLength={500}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: BG, border: '1.5px solid #E2E8F0',
                    borderRadius: 14, fontSize: 15, color: NAVY,
                    outline: 'none', transition: 'all 0.2s', resize: 'none'
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.boxShadow = `0 0 0 4px ${BLUE}15`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {error && (
              <div style={{ 
                padding: '12px 16px', borderRadius: 12, background: '#fef2f2', 
                border: '1px solid #fee2e2', color: '#dc2626', fontSize: 14, marginBottom: 20
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                style={{
                  flex: 1, height: 50, borderRadius: 16, background: 'white',
                  border: '1.5px solid #E2E8F0', color: NAVY, fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                style={{
                  flex: 2, height: 50, borderRadius: 16, background: saveSuccess ? '#059669' : BLUE,
                  border: 'none', color: 'white', fontSize: 15, fontWeight: 700,
                  cursor: (isSaving || saveSuccess) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'all 0.2s',
                  boxShadow: saveSuccess ? '0 4px 12px rgba(5, 150, 105, 0.3)' : `0 4px 12px rgba(11, 113, 254, 0.3)`
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Guardando...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check size={20} />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    Confirmar Guardado
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
