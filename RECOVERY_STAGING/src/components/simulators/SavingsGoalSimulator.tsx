'use client';

/**
 * Savings Goal & Compound Interest Simulator
 * Premium BIZEN UI — matches MonthlyBudgetSimulator design language
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PiggyBank,
  TrendingUp,
  Clock,
  Target,
  Zap,
  BarChart2,
  Lightbulb,
  CircleDollarSign,
  Wallet,
  Calendar,
  Percent,
  Sparkles,
  CheckCircle2,
  Info,
  LayoutGrid,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { SaveRunButton } from './SaveRunButton';
import { Chart } from './Chart';
import {
  savingsGoalSchema,
  type SavingsGoalInput,
  type SavingsGoalOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateSavingsGoal } from '@/lib/simulators/engines';
import { currencyMXN, formatMonths } from '@/lib/simulators';

/* ─────────────────────────────────── design tokens ── */
const BLUE    = '#0B71FE';
const NAVY    = '#0f172a';
const SUCCESS = '#059669';
const WARNING = '#d97706';
const BORDER  = '#e8ecf1';
const MUTED   = '#64748B';
const PURPLE  = '#7c3aed';
const BG      = '#FBFAF5';

/* ─────────────────────────────────── SectionCard ── */
function SectionCard({
  children,
  title,
  subtitle,
  accent = BLUE,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
  icon: React.ReactNode;
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: `1px solid ${BORDER}`,
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
      marginBottom: 20,
    }}>
      <div style={{
        padding: '18px 24px',
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'white',
      }}>
        <div style={{
          width: 4, height: 40,
          background: `linear-gradient(180deg, ${accent}, ${accent}88)`,
          borderRadius: 4, flexShrink: 0,
        }} />
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: `${accent}12`,
          border: `1px solid ${accent}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <div className="section-card-content" style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────── MetricCard ── */
type MetricVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

function MetricCard({
  label,
  value,
  sub,
  variant = 'default',
  icon,
  large,
}: {
  label: string;
  value: string;
  sub?: string;
  variant?: MetricVariant;
  icon: React.ReactNode;
  large?: boolean;
}) {
  const configs: Record<MetricVariant, {
    bg: string; border: string; val: string; label: string; iconBg: string; iconColor: string;
  }> = {
    default: { bg: '#f8fafc',  border: BORDER,    val: NAVY,    label: MUTED,    iconBg: '#f1f5f9',  iconColor: NAVY    },
    success: { bg: '#f0fdf4',  border: '#bbf7d0', val: '#065f46', label: '#16a34a', iconBg: '#dcfce7', iconColor: SUCCESS },
    warning: { bg: '#fffbeb',  border: '#fde68a', val: '#92400e', label: WARNING,  iconBg: '#fef3c7',  iconColor: WARNING },
    danger:  { bg: '#fff1f2',  border: '#fecdd3', val: '#9f1239', label: '#dc2626', iconBg: '#ffe4e6', iconColor: '#dc2626' },
    info:    { bg: '#eff6ff',  border: '#bfdbfe', val: '#1e40af', label: BLUE,     iconBg: '#dbeafe',  iconColor: BLUE    },
    purple:  { bg: '#faf5ff',  border: '#e9d5ff', val: '#6b21a8', label: PURPLE,   iconBg: '#f3e8ff',  iconColor: PURPLE  },
  };
  const c = configs[variant];
  return (
    <div className={`metric-card metric-variant-${variant}`} style={{
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: 18, padding: large ? '20px 22px' : '18px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        width: large ? 52 : 44, height: large ? 52 : 44, borderRadius: large ? 16 : 14,
        background: c.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {React.cloneElement(icon as React.ReactElement, { size: large ? 24 : 20, color: c.iconColor, strokeWidth: 2 } as any)}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.label, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
        <div className="metric-card-val" style={{ fontSize: large ? 26 : 22, fontWeight: 800, color: c.val, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────── SelectField ── */
function SelectField({
  label,
  hint,
  children,
  ...selectProps
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 8 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          {...selectProps}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 48, padding: '0 44px 0 16px',
            background: BG,
            border: `1.5px solid ${focused ? BLUE : BORDER}`,
            borderRadius: 14,
            fontSize: 14, fontWeight: 600, color: NAVY,
            outline: 'none', cursor: 'pointer',
            appearance: 'none', WebkitAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            transition: 'all 0.2s ease',
            boxShadow: focused ? `0 0 0 3px ${BLUE}18` : 'none',
            fontFamily: "var(--font-family)",
          }}
        >
          {children}
        </select>
      </div>
      {hint && <div style={{ fontSize: 12, color: MUTED, marginTop: 6, lineHeight: 1.5 }}>{hint}</div>}
    </div>
  );
}

/* ─────────────────────────────────── MilestoneBar ── */
function MilestoneBar({
  label, value, total, color, icon: Icon,
}: { label: string; value: number; total: number; color: string; icon: any }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} color={color} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color }}>{pct.toFixed(0)}%</span>
          <span style={{ fontSize: 12, color: MUTED }}>{currencyMXN(value)}</span>
        </div>
      </div>
      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: 99,
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────── Main Component ── */
export function SavingsGoalSimulator() {
  const [result, setResult] = React.useState<SavingsGoalOutput | null>(null);
  const [loadingRun, setLoadingRun] = React.useState(false);
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<SavingsGoalInput>({
      resolver: zodResolver(savingsGoalSchema),
      defaultValues: {
        initial: 0,
        monthlyContribution: 0,
        annualRate: 0,
        mode: 'forecast',
        months: 12,
      },
    });

  // Load saved run if runId exists
  React.useEffect(() => {
    async function fetchRun() {
      if (!runId) return;
      setLoadingRun(true);
      try {
        const response = await fetch(`/api/simuladores/runs/${runId}`);
        const data = await response.json();
        if (response.ok && data.run) {
          reset(data.run.inputs);
        }
      } catch (err) {
        console.error('Error loading run:', err);
      } finally {
        setLoadingRun(false);
      }
    }
    fetchRun();
  }, [runId, reset]);

  const mode = watch('mode');

  function onSubmit(data: SavingsGoalInput) {
    const output = calculateSavingsGoal(data);
    setResult(output);
    setAiAnalysis(null);
  }

  async function handleAnalyze() {
    if (!result) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const resp = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulatorName: 'Meta de Ahorro e Interés Compuesto',
          inputs: watch(),
          outputs: result
        })
      });
      const data = await resp.json();
      if (resp.ok && data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function loadPreset() {
    const preset = PRESET_VALUES.savingsGoal;
    setValue('initial', preset.initial);
    setValue('monthlyContribution', preset.monthlyContribution);
    setValue('annualRate', preset.annualRate);
    setValue('months', preset.months);
    setValue('mode', preset.mode);
  }

  React.useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  if (loadingRun) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 20 }}>
        <Loader2 className="animate-spin" size={42} color={BLUE} />
        <p style={{ color: MUTED, fontWeight: 500 }}></p>
      </div>
    );
  }

  const initial = watch('initial') || 0;
  const monthlyContribution = watch('monthlyContribution') || 0;

  // Breakdown for bar chart
  const totalContributions = result?.totalContributions ?? 0;
  const totalInterest      = result?.totalInterest ?? 0;
  const futureValue        = result?.futureValue ?? 0;

  return (
    <div className="simulator-container">
      <style>{`
        @media (max-width: 768px) {
          .simulator-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .section-card-content {
            padding: 16px !important;
          }
          .metric-card {
            padding: 14px !important;
            gap: 10px !important;
          }
          .metric-card-val {
            font-size: 18px !important;
          }
          .hero-strip {
             padding: 16px !important;
          }
          .hero-strip button {
            width: 100% !important;
          }
        }
      `}</style>

      {/* ── HERO STRIP ── */}
      <div className="hero-strip" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 32,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(5,150,105,0.05) 0%, rgba(11,113,254,0.03) 100%)',
        border: `1px solid rgba(5,150,105,0.15)`,
        borderRadius: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${SUCCESS}12`, border: `1px solid ${SUCCESS}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PiggyBank size={22} color={SUCCESS} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: SUCCESS, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Interés Compuesto</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>Simula el crecimiento real de tu ahorro en el tiempo</div>
          </div>
        </div>
        <button
          type="button"
          onClick={loadPreset}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: BLUE, border: 'none', borderRadius: 14,
            color: 'white', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: `0 4px 14px ${BLUE}40`,
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${BLUE}50`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = `0 4px 14px ${BLUE}40`; }}
        >
          <Zap size={15} strokeWidth={2.5} />
          Cargar Ejemplo Práctico
        </button>
      </div>

      {/* ── 2-COLUMN GRID ── */}
      <div className="simulator-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>

        {/* ──── LEFT: INPUTS ──── */}
        <div>

          {/* Initial Amount */}
          <SectionCard
            title="Capital Inicial"
            subtitle="El dinero con que empiezas hoy"
            accent={BLUE}
            icon={<Wallet size={18} color={BLUE} strokeWidth={2} />}
          >
            <NumberField
              value={initial}
              onChange={(val) => setValue('initial', val)}
              currency
              error={errors.initial?.message}
              hint="Puede ser $0 si apenas estás comenzando"
            />
          </SectionCard>

          {/* Monthly Contribution */}
          <SectionCard
            title="Aportación Mensual"
            subtitle="Cuánto depositas cada mes"
            accent={SUCCESS}
            icon={<Calendar size={18} color={SUCCESS} strokeWidth={2} />}
          >
            <NumberField
              value={monthlyContribution}
              onChange={(val) => setValue('monthlyContribution', val)}
              currency
              error={errors.monthlyContribution?.message}
              hint="La constancia es el secreto del interés compuesto"
            />

            {/* Quick tip when user enters a value */}
            {monthlyContribution > 0 && (
              <div style={{
                marginTop: 14, padding: '12px 14px',
                background: `${SUCCESS}08`, border: `1px solid ${SUCCESS}20`,
                borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <Lightbulb size={14} color={SUCCESS} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: '#065f46', lineHeight: 1.55 }}>
                  Al año aportarás <strong>{currencyMXN(monthlyContribution * 12)}</strong>. El interés compuesto multiplica ese esfuerzo.
                </span>
              </div>
            )}
          </SectionCard>

          {/* Annual Rate */}
          <SectionCard
            title="Tasa de Rendimiento"
            subtitle="Rendimiento anual esperado de tu inversión"
            accent={PURPLE}
            icon={<Percent size={18} color={PURPLE} strokeWidth={2} />}
          >
            <NumberField
              value={watch('annualRate')}
              onChange={(val) => setValue('annualRate', val)}
              percentage
              error={errors.annualRate?.message}
              hint="CETES ~10%, S&P500 histórico ~10%, CETES 28d actual ~10-11%"
            />
          </SectionCard>

          {/* Mode + Time */}
          <SectionCard
            title="Modo de Cálculo"
            subtitle="¿Cuánto acumularás o cuándo llegarás a tu meta?"
            accent={BLUE}
            icon={<LayoutGrid size={18} color={BLUE} strokeWidth={2} />}
          >
            <div style={{ marginBottom: 20 }}>
              <SelectField
                label="Modo"
                hint="Elige si quieres proyectar un monto o calcular el tiempo para llegar a tu meta"
                {...register('mode')}
              >
                <option value="forecast">Pronóstico — ¿cuánto tendré en X meses?</option>
                <option value="time-to-goal">Tiempo a Meta — ¿cuándo lo lograré?</option>
              </SelectField>
            </div>

            {mode === 'forecast' && (
              <NumberField
                value={watch('months') || 0}
                onChange={(val) => setValue('months', val)}
                error={errors.months?.message}
                hint="Plazo en meses (ej: 12 = 1 año, 60 = 5 años, 120 = 10 años)"
              />
            )}

            {mode === 'time-to-goal' && (
              <NumberField
                value={watch('targetAmount') || 0}
                onChange={(val) => setValue('targetAmount', val)}
                currency
                error={errors.targetAmount?.message}
                hint="¿Cuánto dinero quieres tener ahorrado?"
              />
            )}
          </SectionCard>
        </div>

        {/* ──── RIGHT: RESULTS ──── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result ? (
            <>
              {result.error && (
                <div style={{
                  padding: '14px 18px', background: '#fffbeb',
                  border: '1px solid #fde68a', borderRadius: 16,
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <Info size={16} color={WARNING} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>{result.error}</span>
                </div>
              )}

              {/* KPI row — large hero metric + supporting */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                <MetricCard
                  label="Valor Futuro Estimado"
                  value={currencyMXN(futureValue)}
                  sub="Capital inicial + aportaciones + intereses"
                  variant="success"
                  icon={<Sparkles />}
                  large
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                <MetricCard
                  label="Total Aportado"
                  value={currencyMXN(totalContributions)}
                  sub="Tu capital real"
                  variant="info"
                  icon={<Wallet />}
                />
                <MetricCard
                  label="Interés Generado"
                  value={currencyMXN(totalInterest)}
                  sub="El dinero que trabajó por ti"
                  variant="purple"
                  icon={<TrendingUp />}
                />
                {result.months !== undefined && (
                  <MetricCard
                    label="Plazo"
                    value={formatMonths(result.months)}
                    sub="Tiempo para llegar a tu meta"
                    variant="default"
                    icon={<Clock />}
                  />
                )}
                {futureValue > 0 && totalContributions > 0 && (
                  <MetricCard
                    label="Multiplicador"
                    value={`${(futureValue / Math.max(totalContributions, 1)).toFixed(2)}x`}
                    sub="Tu dinero creció esta cantidad"
                    variant="warning"
                    icon={<Target />}
                  />
                )}
              </div>

              {/* Composition bars */}
              {futureValue > 0 && (
                <div style={{
                  background: 'white', borderRadius: 20,
                  border: `1px solid ${BORDER}`, padding: 24,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 4, height: 32, background: `linear-gradient(180deg, ${SUCCESS}, ${SUCCESS}88)`, borderRadius: 4 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Composición del Ahorro</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Cómo se forma tu valor futuro</div>
                    </div>
                  </div>
                  <MilestoneBar label="Aportaciones Totales" value={totalContributions} total={futureValue} color={BLUE}    icon={Wallet}    />
                  <MilestoneBar label="Intereses Ganados"    value={totalInterest}      total={futureValue} color={PURPLE}  icon={TrendingUp} />
                </div>
              )}

              {/* Growth Chart */}
              {result.chartData && result.chartData.length > 0 && (
                <div style={{
                  background: 'white', borderRadius: 20,
                  border: `1px solid ${BORDER}`, overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 4, height: 36, background: `linear-gradient(180deg, ${BLUE}, ${BLUE}88)`, borderRadius: 4 }} />
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: `${BLUE}10`, border: `1px solid ${BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart2 size={18} color={BLUE} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Crecimiento del Ahorro</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Mes a mes — Saldo, Aportaciones e Intereses</div>
                    </div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <Chart
                      data={result.chartData}
                      type="line"
                      xAxisKey="month"
                      xAxisLabel="Mes"
                      lines={[
                        { dataKey: 'balance',       name: 'Saldo Total',   color: BLUE    },
                        { dataKey: 'contributions', name: 'Aportaciones',  color: SUCCESS },
                        { dataKey: 'interest',      name: 'Intereses',     color: PURPLE  },
                      ]}
                      formatYAxis="currency"
                      height={300}
                    />
                  </div>
                </div>
              )}

              {/* Billy AI Insight */}
              <div style={{ background: 'linear-gradient(135deg, #0B71FE08, #7c3aed08)', border: `1.5px solid ${BLUE}22`, borderRadius: 18, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${BLUE}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={14} color="white" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Análisis de Billy AI</span>
                  </div>
                  {!aiAnalysis && !isAnalyzing && (
                    <button onClick={handleAnalyze} style={{ border: 'none', background: 'transparent', color: BLUE, fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                      Generar Análisis
                    </button>
                  )}
                  {aiAnalysis && (
                    <button onClick={handleAnalyze} style={{ border: 'none', background: 'transparent', color: MUTED, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={10} /> Recalcular
                    </button>
                  )}
                </div>

                {isAnalyzing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                    <Loader2 size={16} className="animate-spin" color={BLUE} />
                    <span style={{ fontSize: 13, color: MUTED }}>Analizando tu plan de ahorro...</span>
                  </div>
                ) : aiAnalysis ? (
                  <p style={{ fontSize: 13, color: NAVY, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {aiAnalysis}
                  </p>
                ) : (
                  <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6 }}>
                    ¿Quieres saber si vas por buen camino con tu meta? Billy puede analizar estos números por ti.
                  </p>
                )}
              </div>

              {/* Insight panel */}
              {futureValue > 0 && totalInterest > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg,#0B71FE,#1e40af)',
                  borderRadius: 18, padding: '20px 22px', color: 'white',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <CheckCircle2 size={16} color="rgba(255,255,255,0.8)" />
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Poder del Interés Compuesto</p>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.92)', margin: 0, lineHeight: 1.7 }}>
                    Por cada <strong>{currencyMXN(totalContributions)}</strong> que aportas,
                    el interés compuesto genera <strong>{currencyMXN(totalInterest)}</strong> adicionales
                    — eso es <strong>{((totalInterest / Math.max(totalContributions, 1)) * 100).toFixed(0)}%</strong> más dinero sin esfuerzo extra.
                  </p>
                </div>
              )}

              <SaveRunButton
                simulatorSlug="savings-goal"
                inputs={watch()}
                outputs={result}
              />
            </>
          ) : (
            /* ── Empty state ── */
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 20, padding: '60px 32px', textAlign: 'center',
              background: 'white', borderRadius: 24, border: `1px solid ${BORDER}`,
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)', minHeight: 340,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 24,
                background: `linear-gradient(135deg, ${SUCCESS}15, ${SUCCESS}08)`,
                border: `1px solid ${SUCCESS}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CircleDollarSign size={32} color={SUCCESS} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Tu proyección aparecerá aquí</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 300 }}>
                  Ingresa tu capital inicial, aportación mensual y tasa de rendimiento para ver cómo crece tu dinero mes a mes.
                </div>
              </div>
              <button
                type="button"
                onClick={loadPreset}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 24px',
                  background: BLUE, color: 'white',
                  border: 'none', borderRadius: 14,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 4px 14px ${BLUE}40`,
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Zap size={15} strokeWidth={2.5} />
                Ver un ejemplo práctico
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
