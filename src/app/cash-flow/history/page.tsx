'use client';

/**
 * Page: /cash-flow/history
 * Premium BIZEN UI — View and manage saved simulator runs
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Calendar,
  Filter,
  Inbox,
  ArrowRight,
  Calculator,
  Wallet,
  Target,
  CreditCard,
  TrendingUp,
  History,
  Search
} from 'lucide-react';
import { currencyMXN } from '@/lib/simulators';
import PageLoader from '@/components/PageLoader';
import ReturnButton from '@/components/ReturnButton';

/* ─────────────────────────────────── types ── */
interface SimulatorRun {
  id: string;
  simulator_slug: string;
  run_name: string | null;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  notes: string | null;
  created_at: string;
}

const simulatorConfig: Record<string, { name: string; icon: any; color: string; bg: string }> = {
  'savings-goal': { 
    name: 'BIZEN Saver (Ahorro)', 
    icon: Target, 
    color: '#0B71FE', 
    bg: '#eff6ff' 
  },
  'credit-card-payoff': { 
    name: 'BIZEN Card (Liquidación)', 
    icon: CreditCard, 
    color: '#7c3aed', 
    bg: '#f5f3ff' 
  },
  'simple-loan': { 
    name: 'BIZEN Loan (Préstamo)', 
    icon: Calculator, 
    color: '#ea580c', 
    bg: '#fff7ed' 
  },
  'investment-comparison': { 
    name: 'BIZEN Invest (Inversión)', 
    icon: TrendingUp, 
    color: '#0891b2', 
    bg: '#ecfeff' 
  },
  'inflation-calculator': { 
    name: 'BIZEN Power (Inflación)', 
    icon: Clock, 
    color: '#64748b', 
    bg: '#f8fafc' 
  },
  'credit': { 
    name: 'BIZEN Score', 
    icon: CreditCard, 
    color: '#6366f1', 
    bg: '#f0f4ff' 
  },
  'stocks': { 
    name: 'BIZEN Market', 
    icon: TrendingUp, 
    color: '#10b981', 
    bg: '#f0fdf4' 
  },
};

/* ─────────────────────────────────── components ── */

function RunCard({ 
  run, 
  onDelete 
}: { 
  run: SimulatorRun; 
  onDelete: (id: string) => void 
}) {
  const config = simulatorConfig[run.simulator_slug] || { 
    name: run.simulator_slug, 
    icon: History, 
    color: '#0B71FE', 
    bg: '#f8fafc' 
  };
  const Icon = config.icon;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const [hovered, setHovered] = React.useState(false);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: 20,
        border: `1px solid ${hovered ? '#0B71FE30' : '#E8ECF1'}`,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: hovered ? '0 8px 32px rgba(11, 113, 254, 0.08)' : '0 2px 12px rgba(0,0,0,0.02)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: hovered ? config.color : `${config.color}20`,
        transition: 'all 0.3s'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: config.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: config.color, border: `1px solid ${config.color}20`
          }}>
            <Icon size={22} strokeWidth={2} />
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: config.color, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {config.name}
            </h4>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {run.run_name || 'Simulación sin nombre'}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onDelete(run.id)}
            style={{
              width: 38, height: 38, borderRadius: 12,
              border: '1px solid #fee2e2', background: '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#dc2626', transition: 'all 0.2s'
            }}
            title="Eliminar"
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: 12,
        borderTop: '1px solid #F1F5F9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13 }}>
            <Calendar size={14} />
            {formatDate(run.created_at)}
          </div>
          {run.notes && (
             <div style={{ fontSize: 13, color: '#64748B', fontStyle: 'italic', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
               "{run.notes}"
             </div>
          )}
        </div>

        <Link 
          href={
            (run.simulator_slug === 'credit' || run.simulator_slug === 'stocks')
              ? `/simulators/${run.simulator_slug}?runId=${run.id}`
              : `/cash-flow/${run.simulator_slug}?runId=${run.id}`
          }
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 12,
            background: '#0B71FE', color: 'white',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(11, 113, 254, 0.2)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(11, 113, 254, 0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 113, 254, 0.2)'; }}
        >
          Cargar Simulación
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────── main page ── */

export default function HistoryPage() {
  const [runs, setRuns] = React.useState<SimulatorRun[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [filterSlug, setFilterSlug] = React.useState<string>('all');
  const router = useRouter();

  const loadRuns = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = filterSlug !== 'all'
        ? `/api/simuladores/runs?slug=${filterSlug}`
        : '/api/simuladores/runs';

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al cargar');
      setRuns(data.runs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [filterSlug]);

  React.useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta simulación?')) return;

    try {
      const response = await fetch(`/api/simuladores/runs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');
      loadRuns();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  const uniqueSlugs = Array.from(new Set(runs.map((r) => r.simulator_slug)));

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#FBFAF5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
      color: '#0F172A',
      paddingBottom: 80
    }}>
      <style>{`
        .history-container {
          width: 100%;
          margin: 0 auto;
          padding: 40px;
          box-sizing: border-box;
        }
        @media (max-width: 767px) {
          .history-container { padding: 20px 16px 80px; }
        }
        @media (min-width: 768px) {
          .history-container { width: 100% !important; }
        }

        .category-chip {
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid #E2E8F0;
          background: white;
          color: #64748B;
          white-space: nowrap;
        }
        .category-chip:hover { border-color: #0B71FE; color: #0B71FE; }
        .category-chip.active { background: #0B71FE; color: white; border-color: #0B71FE; box-shadow: 0 4px 12px rgba(11, 113, 254, 0.2); }
      `}</style>

      <div className="history-container">
        {/* Header Section */}
        <div style={{ marginBottom: 40 }}>
          <ReturnButton href="/cash-flow" label="Volver a Simuladores" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h1 style={{ 
                fontSize: 'clamp(32px, 5vw, 42px)', 
                fontWeight: 800, 
                margin: '0 0 12px',
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #0F172A 0%, #0B71FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Mis Simulaciones
              </h1>
              <p style={{ fontSize: 17, color: '#64748B', margin: 0, fontWeight: 500 }}>
                Recupera tus análisis guardados y sigue planificando tu futuro financiero.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        {!loading && (runs.length > 0 || filterSlug !== 'all') && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 12, 
            marginBottom: 32, overflowX: 'auto', padding: '4px 0',
            scrollbarWidth: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B', marginRight: 8, flexShrink: 0 }}>
              <Filter size={16} />
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filtrar:</span>
            </div>
            
            <button 
              className={`category-chip ${filterSlug === 'all' ? 'active' : ''}`}
              onClick={() => setFilterSlug('all')}
            >
              Todas
            </button>
            {uniqueSlugs.map(slug => (
              <button 
                key={slug}
                className={`category-chip ${filterSlug === slug ? 'active' : ''}`}
                onClick={() => setFilterSlug(slug)}
              >
                {simulatorConfig[slug]?.name.split(' ')[0] || slug}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <PageLoader />
          </div>
        ) : error ? (
          <div style={{ 
            padding: 32, borderRadius: 24, background: '#fef2f2', border: '1px solid #fee2e2',
            textAlign: 'center', color: '#dc2626'
          }}>
            <h3 style={{ margin: '0 0 8px' }}>Error al cargar</h3>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        ) : runs.length === 0 ? (
          <div style={{ 
            background: 'white', borderRadius: 32, border: '1px solid #E8ECF1',
            padding: '80px 40px', textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24
          }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: 28, background: '#F8FAFC',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' 
            }}>
              <Inbox size={40} strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
                Aún no tienes simulaciones guardadas
              </h2>
              <p style={{ fontSize: 16, color: '#64748B', maxWidth: 450, margin: '0 auto', lineHeight: 1.6 }}>
                Prueba cualquiera de nuestros simuladores financieros y guarda tus resultados para verlos aquí más tarde.
              </p>
            </div>
            <Link href="/cash-flow" style={{ 
              padding: '14px 32px', borderRadius: 16, background: '#0B71FE', color: 'white',
              fontSize: 16, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 8px 16px rgba(11, 113, 254, 0.25)',
              transition: 'all 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Explorar Simuladores
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', 
            gap: 24 
          }}>
            {runs.map(run => (
              <RunCard key={run.id} run={run} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
