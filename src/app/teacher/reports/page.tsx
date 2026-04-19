'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, Filter, Calendar, Users, 
  BarChart, Activity, CheckSquare, FileSpreadsheet,
  ChevronDown
} from 'lucide-react';
import PageLoader from '@/components/PageLoader';

type ReportType = 'executive' | 'detailed' | 'growth';

export default function TeacherReportsPage() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState<ReportType | null>(null);

  const handleGenerateReport = (type: ReportType, format: 'pdf' | 'excel') => {
    setGenerating(type);
    
    // Simulate generation time
    setTimeout(() => {
      setGenerating(null);
      // Logic would go here to actually download the file
      alert(`Reporte ${type} generado en formato ${format.toUpperCase()}`);
    }, 2000);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50 px-5 md:px-8 lg:px-11 py-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-[fadeSlideUp_0.4s_ease_both]">
          <div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
              <span className="w-8 h-[2px] bg-indigo-500 rounded-full" />
              Centro de Reportes
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight m-0">
              Métricas e <span className="text-indigo-600">Informes</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Genera documentos ejecutivos sobre el progreso de tu grupo, desempeño en simuladores y áreas de oportunidad.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <Calendar size={16} className="text-slate-400" />
              Este Mes
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Todos los Grados
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reporte Ejecutivo */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col animate-[fadeSlideUp_0.5s_ease_both]">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <BarChart size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Reporte Ejecutivo</h2>
            <p className="text-sm text-slate-500 mb-8 flex-1">
              Resumen gerencial de 1-2 páginas con los KPIs principales: alumnos activos, promedio general y alertas de riesgo. Ideal para directivos.
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => handleGenerateReport('executive', 'pdf')}
                disabled={generating !== null}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              >
                {generating === 'executive' ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <FileText size={16} />}
                Descargar PDF
              </button>
            </div>
          </div>

          {/* Reporte Detallado de Alumnos */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col animate-[fadeSlideUp_0.6s_ease_both]">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
              <Users size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sábana de Alumnos</h2>
            <p className="text-sm text-slate-500 mb-8 flex-1">
              Desglose individual y granular de cada estudiante. Incluye resultados del diagnóstico, progreso por módulo y desempeño en simuladores.
            </p>

            <div className="space-y-3">
               <button 
                onClick={() => handleGenerateReport('detailed', 'excel')}
                disabled={generating !== null}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              >
                {generating === 'detailed' ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <FileSpreadsheet size={16} />}
                Exportar Excel (CSV)
              </button>
            </div>
          </div>

          {/* Reporte de Crecimiento & Simulador */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col animate-[fadeSlideUp_0.7s_ease_both]">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6">
              <Activity size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">ROI y Crecimiento</h2>
            <p className="text-sm text-slate-500 mb-8 flex-1">
              Análisis específico del "BIZEN Market". Visualiza el retorno de inversión promedio y los mejores portafolios de tu institución.
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => handleGenerateReport('growth', 'pdf')}
                disabled={generating !== null}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              >
                {generating === 'growth' ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <Download size={16} />}
                Descargar Reporte PDF
              </button>
            </div>
          </div>
        </div>

        {/* Historial Reciente */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-[fadeSlideUp_0.8s_ease_both]">
          <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 m-0">Historial de Descargas</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Documento</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Formato</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">Reporte Ejecutivo Institucional</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase">PDF</span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-500">Hoy, 10:24 AM</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">Sábana Completa de Alumnos</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase">Excel</span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-500">Ayer, 16:45 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
