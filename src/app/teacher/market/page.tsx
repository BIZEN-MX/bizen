'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Activity, Users, DollarSign, 
  BarChart2, ArrowUpRight, ArrowDownRight, 
  Target, ShieldCheck, PieChart, ShieldAlert
} from 'lucide-react';
import PageLoader from '@/components/PageLoader';

// Tipos de métricas para la UI (Mocks iniciales para la estructura)
type StudentMarketData = {
  id: string;
  name: string;
  level: number;
  cash: number;
  portfolioValue: number;
  totalValue: number;
  roi: number;
  trades: number;
};

export default function TeacherMarketMetricsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentMarketData[]>([]);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const res = await fetch('/api/school-admin/market');
        if (!res.ok) throw new Error('Falló al consultar los datos');
        
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setData(json.data);
        } else {
          // Fallback a datos simulados para propósitos de demostración o si la institución aún no tiene participantes activos
          setData([
             { id: '1', name: 'Diego Peña', level: 5, cash: 1250, portfolioValue: 8500, totalValue: 9750, roi: 12.5, trades: 14 },
             { id: '2', name: 'Laura Martínez', level: 4, cash: 4000, portfolioValue: 3200, totalValue: 7200, roi: -3.2, trades: 8 },
             { id: '3', name: 'Carlos Díaz', level: 6, cash: 500, portfolioValue: 12500, totalValue: 13000, roi: 24.1, trades: 32 },
             { id: '4', name: 'Ana Gómez', level: 3, cash: 6000, portfolioValue: 500, totalValue: 6500, roi: 1.5, trades: 2 },
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMarketData();
  }, []);

  if (loading) return <PageLoader />;

  // Cálculos agregados
  const totalStudentsWithPortfolios = data.length;
  const totalGroupLiquidity = data.reduce((acc, curr) => acc + curr.cash, 0);
  const totalGroupInvested = data.reduce((acc, curr) => acc + curr.portfolioValue, 0);
  const averageROI = data.reduce((acc, curr) => acc + curr.roi, 0) / (totalStudentsWithPortfolios || 1);
  const totalTrades = data.reduce((acc, curr) => acc + curr.trades, 0);

  // Ordenar para el Leaderboard
  const sortedByROI = [...data].sort((a, b) => b.roi - a.roi);

  return (
    <div className="min-h-screen bg-slate-50 px-5 md:px-8 lg:px-11 py-10 pb-20">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Encabezado */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-[fadeSlideUp_0.4s_ease_both]">
          <div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
              <span className="w-8 h-[2px] bg-purple-500 rounded-full" />
              BIZEN Market Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight m-0">
              Rendimiento en <span className="text-purple-600">Simuladores</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-2xl">
              Monitorea en tiempo real las decisiones de inversión de tus alumnos. 
              Los datos se filtran automáticamente usando el <strong className="text-slate-700">School ID</strong> de tu institución.
            </p>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.5s_ease_both]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity size={20} />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${averageROI >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                Promedio
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              {averageROI > 0 ? '+' : ''}{averageROI.toFixed(1)}%
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">ROI Grupal</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.55s_ease_both]">
            <div className="flex items-center gap-3 mb-4 text-slate-400">
              <BarChart2 size={24} />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              {totalTrades}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Órdenes Ejecutadas</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.6s_ease_both]">
            <div className="flex items-center gap-3 mb-4 text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1 flex items-baseline">
              <span className="text-xl font-bold text-slate-400 mr-1">$</span>
              {totalGroupInvested.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Invertido</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.65s_ease_both]">
            <div className="flex items-center gap-3 mb-4 text-blue-500">
              <DollarSign size={24} />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-1 flex items-baseline">
              <span className="text-xl font-bold text-slate-400 mr-1">$</span>
              {totalGroupLiquidity.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Liquidez Restante</div>
          </div>
        </div>

        {/* Tableros Detallados */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          
          {/* Tabla de Alumnos */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-[fadeSlideUp_0.7s_ease_both]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 m-0">Desglose de Portafolios</h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                {totalStudentsWithPortfolios} Alumnos Activos
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Alumno</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Invertido</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Liquidez</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                        <div className="text-xs font-medium text-slate-500">Lv. {student.level}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="font-bold text-slate-900 text-sm">${student.portfolioValue.toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="font-medium text-slate-500 text-sm">${student.cash.toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className={`inline-flex items-center gap-1 font-bold text-sm px-2.5 py-1 rounded-md ${
                          student.roi >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                        }`}>
                          {student.roi >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {Math.abs(student.roi).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leaderboard Lateral */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.75s_ease_both]">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center justify-between">
                Top Rendimientos
                <Target size={16} className="text-purple-500" />
              </h3>
              <div className="space-y-4">
                {sortedByROI.slice(0, 3).map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                        index === 0 ? 'bg-amber-100 text-amber-600' :
                        index === 1 ? 'bg-slate-200 text-slate-600' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.trades} órdenes</div>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-black text-sm">
                      +{student.roi}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl animate-[fadeSlideUp_0.8s_ease_both] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <ShieldCheck size={100} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">
                Monitoreo Seguro
              </h3>
              <p className="text-xs text-slate-300 mb-0 relative z-10 leading-relaxed">
                Tus alumnos no pueden ver los portafolios de sus compañeros a menos que compartan sus resultados en el foro. Tú tienes visibilidad completa garantizada por el School ID.
              </p>
            </div>

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
