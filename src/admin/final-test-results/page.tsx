"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, FileText, Download, Mail, User, XCircle, Shield } from 'lucide-react';

interface FinalTestResult {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  score_percentage: number;
  answers: any;
  student_name: string | null;
  evaluator_notes: string | null;
  completed_at: string;
  user_email?: string;
  user_name?: string;
}

export default function FinalTestResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<FinalTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/admin/final-test-results');
      
      if (response.status === 401) {
        window.open('/login', '_blank');
        return;
      }

      if (response.status === 403) {
        setError('Acceso denegado - Solo administradores pueden ver esta página');
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
      } else {
        setError(data.error || 'Error al cargar los resultados');
      }
    } catch (error) {
      console.error('Error fetching final test results:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#10B981'; // Green
    if (percentage >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 80) return 'Muy Bueno';
    if (percentage >= 70) return 'Bueno';
    if (percentage >= 60) return 'Satisfactorio';
    return 'Necesita Mejora';
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Resultados del Examen Final - Cargando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Resultados del Examen Final</h1>
        <div style={{ 
          padding: '20px', 
          background: '#FEF2F2', 
          border: '1px solid #FECACA', 
          borderRadius: '8px',
          color: '#DC2626',
          margin: '20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <XCircle size={20} /> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-root" style={{ 
      minHeight: "100vh", 
      background: "#f8fafc",
      fontFamily: 'inherit'
    }}>
      <style>{`
        .admin-page-root { padding-left: 280px !important; }
        @media (max-width: 1160px) { .admin-page-root { padding-left: 220px !important; } }
        @media (max-width: 767px) { .admin-page-root { padding-left: 0 !important; padding-bottom: 100px !important; } }
      `}</style>
      <div style={{ padding: "clamp(24px, 4vw, 48px)", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px', color: '#0F62FE', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Trophy size={32} /> Resultados del Examen Final
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Resultados de todos los estudiantes que completaron el examen final
        </p>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>Total de exámenes completados:</strong> {results.length}
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
            <div>
              <strong>Promedio:</strong> {results.length > 0 ? (results.reduce((sum, r) => sum + r.score_percentage, 0) / results.length).toFixed(1) : 0}%
            </div>
            <div>
              <strong>Mejor puntaje:</strong> {results.length > 0 ? Math.max(...results.map(r => r.score_percentage)) : 0}%
            </div>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <FileText size={48} />
          </div>
          <h3>No hay resultados aún</h3>
          <p>Los resultados aparecerán aquí cuando los estudiantes completen el examen final.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {results.map((result, index) => (
            <div
              key={result.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              {/* Ranking Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#0F62FE',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500
              }}>
                #{index + 1}
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ flex: 1, marginRight: '20px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '20px' }}>
                      {result.student_name || 'Estudiante Anónimo'}
                    </h3>
                    <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={14} color="#666" />
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          {result.user_email || 'sin-email@ejemplo.com'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} color="#666" />
                        <span style={{ fontSize: '12px', color: '#999', }}>
                          {result.user_id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Display */}
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: 500,
                      color: getScoreColor(result.score_percentage),
                      marginBottom: '4px'
                    }}>
                      {result.score_percentage}%
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: getScoreColor(result.score_percentage),
                      fontWeight: 500
                    }}>
                      {getScoreLabel(result.score_percentage)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {result.score}/{result.total_questions} preguntas
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ margin: '16px 0' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${result.score_percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${getScoreColor(result.score_percentage)}, ${getScoreColor(result.score_percentage)}80)`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px', color: '#666' }}>
                  <div>
                    <strong>Fecha de finalización:</strong><br />
                    {formatDate(result.completed_at)}
                  </div>
                  <div>
                    <strong>Preguntas correctas:</strong><br />
                    {result.score} de {result.total_questions}
                  </div>
                  <div>
                    <strong>Porcentaje:</strong><br />
                    {result.score_percentage}%
                  </div>
                  <div>
                    <strong>Calificación:</strong><br />
                    <span style={{ color: getScoreColor(result.score_percentage), fontWeight: 500 }}>
                      {getScoreLabel(result.score_percentage)}
                    </span>
                  </div>
                </div>

                {/* Evaluator Notes */}
                {result.evaluator_notes && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    borderLeft: '4px solid #0F62FE'
                  }}>
                    <strong style={{ color: '#333' }}>Notas del evaluador:</strong>
                    <p style={{ margin: '8px 0 0 0', color: '#555' }}>
                      {result.evaluator_notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        const answersText = JSON.stringify(result.answers, null, 2);
                        const blob = new Blob([answersText], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `respuestas_${result.student_name || 'anonimo'}_${result.id}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#059669';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#10B981';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <FileText size={16} /> Ver Respuestas
                    </button>
                  
                    <button
                      onClick={() => {
                        const summary = `
RESUMEN DEL EXAMEN FINAL
========================
Estudiante: ${result.student_name || 'Anónimo'}
Email: ${result.user_email || 'N/A'}
Fecha: ${formatDate(result.completed_at)}
Puntaje: ${result.score}/${result.total_questions} (${result.score_percentage}%)
Calificación: ${getScoreLabel(result.score_percentage)}
${result.evaluator_notes ? `Notas: ${result.evaluator_notes}` : ''}
                      `.trim();
                        
                        const blob = new Blob([summary], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `resumen_${result.student_name || 'anonimo'}_${result.id}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#0F62FE',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#0842A0';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0F62FE';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Download size={16} /> Descargar Resumen
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
