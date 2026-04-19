'use client';

/**
 * Credit Card Payoff: Minimum vs Fixed Payment Simulator
 * Premium BIZEN UI — matches MonthlyBudgetSimulator design language
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  Percent,
  Zap,
  BarChart2,
  TrendingDown,
  TrendingUp,
  Clock,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  ShieldCheck,
  Flame,
  ArrowRight,
  Target,
  Info,
  Sparkles,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { SaveRunButton } from './SaveRunButton';
import { Chart } from './Chart';
import {
  creditCardPayoffSchema,
  type CreditCardPayoffInput,
  type CreditCardPayoffOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateCreditCardPayoff } from '@/lib/simulators/engines';
import { currencyMXN, formatMonths } from '@/lib/simulators';

/* ─────────────────────────────────── design tokens ── */
const BLUE    = '#0B71FE';
const NAVY    = '#0f172a';
const SUCCESS = '#059669';
const WARNING = '#d97706';
const DANGER  = '#dc2626';
const BORDER  = '#e8ecf1';
const MUTED   = '#64748B';
const BG      = '#FBFAF5';

/* ─────────────────────────────────── SectionCard ── */
function SectionCard({
  children, title, subtitle, accent = BLUE, icon,
}: {
  children: React.ReactNode; title: string; subtitle?: string;
  accent?: string; icon: React.ReactNode;
}) {
  return (
    <div style={{
      background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`,
      overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', marginBottom: 20,
    }}>
      <div style={{
        padding: '18px 24px', borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', gap: 14, background: 'white',
      }}>
        <div style={{ width: 4, height: 40, background: `linear-gradient(180deg, ${accent}, ${accent}88)`, borderRadius: 4, flexShrink: 0 }} />
        <div style={{ width: 38, height: 38, borderRadius: 12, background: `${accent}12`, border: `1px solid ${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────── StrategyCard ── */
function StrategyCard({
  title, badgeLabel, months, totalInterest, totalPaid,
  accent, bgColor, borderColor, icon: Icon, isWorse,
}: {
  title: string; badgeLabel: string; months: number;
  totalInterest: number; totalPaid: number;
  accent: string; bgColor: string; borderColor: string;
  icon: any; isWorse?: boolean;
}) {
  return (
    <div style={{
      background: bgColor, border: `2px solid ${borderColor}`,
      borderRadius: 20, overflow: 'hidden',
      boxShadow: isWorse ? '0 4px 20px rgba(220,38,38,0.08)' : '0 4px 20px rgba(5,150,105,0.08)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: `1px solid ${borderColor}`,
        background: `${accent}08`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${accent}25` }}>
            <Icon size={18} color={accent} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{title}</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.07em', background: `${accent}12`, border: `1px solid ${accent}25`, borderRadius: 99, padding: '4px 10px' }}>{badgeLabel}</span>
      </div>
      {/* Metrics */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '12px 14px', background: 'white', borderRadius: 14, border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Tiempo de Pago</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>{formatMonths(months)}</div>
        </div>
        <div style={{ padding: '12px 14px', background: 'white', borderRadius: 14, border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Intereses Totales</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>{currencyMXN(totalInterest)}</div>
        </div>
        <div style={{ padding: '12px 14px', background: 'white', borderRadius: 14, border: `1px solid ${borderColor}`, gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Total Pagado (deuda + intereses)</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: NAVY, letterSpacing: '-0.02em' }}>{currencyMXN(totalPaid)}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────── Main Component ── */
export function CreditCardPayoffSimulator() {
  const [result, setResult] = React.useState<CreditCardPayoffOutput | null>(null);
  const [loadingRun, setLoadingRun] = React.useState(false);
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const { handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<CreditCardPayoffInput>({
    resolver: zodResolver(creditCardPayoffSchema) as any,
    defaultValues: {
      balance: 1000,
      apr: 10,
      minPercent: 5,
      minFloor: 200,
      fixedPayment: 100,
    },
  });

  // Load saved run
  React.useEffect(() => {
    async function fetchRun() {
      if (!runId) return;
      setLoadingRun(true);
      try {
        const response = await fetch(`/api/simuladores/runs/${runId}`);
        const data = await response.json();
        if (response.ok && data.run) reset(data.run.inputs);
      } catch (err) {
        console.error('Error loading run:', err);
      } finally {
        setLoadingRun(false);
      }
    }
    fetchRun();
  }, [runId, reset]);

  function onSubmit(data: any) {
    setResult(calculateCreditCardPayoff(data));
  }

  function loadPreset() {
    const preset = PRESET_VALUES.creditCardPayoff;
    Object.entries(preset).forEach(([key, value]) => setValue(key as any, value));
  }

  async function handleAskBilly() {
    if (!result) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulatorName: 'Pago de Tarjeta de Crédito',
          data: {
            inputs: watch(),
            outputs: result
          }
        })
      });
      const data = await response.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error analyzing debt:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  React.useEffect(() => {
    const sub = watch(() => handleSubmit(onSubmit)());
    return () => sub.unsubscribe();
  }, [handleSubmit, watch]);

  if (loadingRun) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 20 }}>
        <Loader2 className="animate-spin" size={42} color={BLUE} />
        <p style={{ color: MUTED, fontWeight: 500 }}>Cargando tu simulación guardada...</p>
      </div>
    );
  }

  const balance     = watch('balance') || 0;
  const fixedPayment = watch('fixedPayment') || 0;
  const hasError    = result && (result.minimumStrategy.error || result.fixedStrategy.error);

  return (
    <div>

      {/* ── HERO STRIP ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 32,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(220,38,38,0.05) 0%, rgba(11,113,254,0.03) 100%)',
        border: `1px solid rgba(220,38,38,0.12)`,
        borderRadius: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${DANGER}12`, border: `1px solid ${DANGER}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={22} color={DANGER} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: DANGER, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Pago Mínimo vs. Pago Fijo</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>Descubre cuánto te cuesta pagar solo el mínimo</div>
          </div>
        </div>
        <button
          type="button"
          onClick={loadPreset}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: BLUE, border: 'none', borderRadius: 14, color: 'white',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: `0 4px 14px ${BLUE}40`, transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${BLUE}50`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = `0 4px 14px ${BLUE}40`; }}
        >
          <Zap size={15} strokeWidth={2.5} />
          Cargar Ejemplo Práctico
        </button>
      </div>

      {/* ── 2-COLUMN GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>

        {/* ──── LEFT: INPUTS ──── */}
        <div>

          {/* Balance */}
          <SectionCard
            title="Saldo Actual de la Tarjeta"
            subtitle="¿Cuánto debes hoy?"
            accent={DANGER}
            icon={<CreditCard size={18} color={DANGER} strokeWidth={2} />}
          >
            <NumberField
              value={balance}
              onChange={(val) => setValue('balance', val)}
              currency
              error={errors.balance?.message}
              hint="El total adeudado en tu tarjeta de crédito actualmente"
            />
            {balance > 0 && (
              <div style={{ marginTop: 14, padding: '12px 14px', background: `${DANGER}06`, border: `1px solid ${DANGER}18`, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Flame size={14} color={DANGER} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: '#7f1d1d', lineHeight: 1.55 }}>
                  Esta deuda genera intereses <strong>todos los días</strong>. Cada mes que tardas en pagarla, crece.
                </span>
              </div>
            )}
          </SectionCard>

          {/* APR */}
          <SectionCard
            title="Tasa Anual (APR)"
            subtitle="Tasa de interés que cobra tu tarjeta"
            accent={WARNING}
            icon={<Percent size={18} color={WARNING} strokeWidth={2} />}
          >
            <NumberField
              value={watch('apr')}
              onChange={(val) => setValue('apr', val)}
              percentage
              error={errors.apr?.message}
              hint="En México las tasas típicas van de 30% a 90% anual (CAT)"
            />
          </SectionCard>

          {/* Minimum payment rules */}
          <SectionCard
            title="Reglas del Pago Mínimo"
            subtitle="Cómo calcula tu banco el mínimo mensual"
            accent={MUTED}
            icon={<Info size={18} color={MUTED} strokeWidth={2} />}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <NumberField
                  value={watch('minPercent')}
                  onChange={(val) => setValue('minPercent', val)}
                  percentage
                  error={errors.minPercent?.message}
                  hint="% del saldo (típicamente 5%)"
                />
              </div>
              <div>
                <NumberField
                  value={watch('minFloor')}
                  onChange={(val) => setValue('minFloor', val)}
                  currency
                  error={errors.minFloor?.message}
                  hint="Mínimo absoluto en $"
                />
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '12px 14px', background: '#f8fafc', border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.6 }}>
                Tu banco cobra el <strong>mayor</strong> de los dos valores: {watch('minPercent') || 5}% del saldo o ${watch('minFloor') || 200} fijos.
              </p>
            </div>
          </SectionCard>

          {/* Fixed Payment */}
          <SectionCard
            title="Tu Pago Fijo Propuesto"
            subtitle="¿Cuánto puedes pagar cada mes de forma constante?"
            accent={SUCCESS}
            icon={<ShieldCheck size={18} color={SUCCESS} strokeWidth={2} />}
          >
            <NumberField
              value={fixedPayment}
              onChange={(val) => setValue('fixedPayment', val)}
              currency
              error={errors.fixedPayment?.message}
              hint="Entre más alto, menos intereses pagas y más rápido terminas"
            />
            {fixedPayment > 0 && balance > 0 && fixedPayment > balance * 0.05 && (
              <div style={{ marginTop: 14, padding: '12px 14px', background: `${SUCCESS}08`, border: `1px solid ${SUCCESS}20`, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={14} color={SUCCESS} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: '#065f46', lineHeight: 1.55 }}>
                  Estás pagando <strong>{currencyMXN(fixedPayment)}</strong>/mes. Eso es más que el mínimo — ¡excelente decisión!
                </span>
              </div>
            )}
          </SectionCard>

        </div>

        {/* ──── RIGHT: RESULTS ──── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result ? (
            <>
              {hasError && (
                <div style={{ padding: '14px 18px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color={DANGER} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.6 }}>{result.minimumStrategy.error || result.fixedStrategy.error}</span>
                </div>
              )}

              {/* Head-to-head strategy comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 14 }}>
                <StrategyCard
                  title="Pago Mínimo"
                  badgeLabel="Costoso"
                  months={result.minimumStrategy.months}
                  totalInterest={result.minimumStrategy.totalInterest}
                  totalPaid={result.minimumStrategy.totalPaid}
                  accent={WARNING}
                  bgColor="#fffbeb"
                  borderColor="#fde68a"
                  icon={TrendingDown}
                  isWorse
                />
                <StrategyCard
                  title="Pago Fijo"
                  badgeLabel="Recomendado"
                  months={result.fixedStrategy.months}
                  totalInterest={result.fixedStrategy.totalInterest}
                  totalPaid={result.fixedStrategy.totalPaid}
                  accent={SUCCESS}
                  bgColor="#f0fdf4"
                  borderColor="#bbf7d0"
                  icon={ShieldCheck}
                />
              </div>

              {/* Savings Hero Panel */}
              {(result.savings.monthsSaved > 0 && result.savings.interestSaved > 0) && (
                <div style={{ background: 'linear-gradient(135deg,#0B71FE,#1e40af)', borderRadius: 20, padding: '22px 24px', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Target size={16} color="rgba(255,255,255,0.8)" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Tu Ahorro con Pago Fijo</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 16px' }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Meses Ahorrados</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{result.savings.monthsSaved}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 16px' }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Intereses Ahorrados</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{currencyMXN(result.savings.interestSaved)}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.65 }}>
                    Pagando <strong>{currencyMXN(fixedPayment)}/mes</strong> en lugar del mínimo te ahorras <strong>{currencyMXN(result.savings.interestSaved)}</strong> en intereses y terminas <strong>{result.savings.monthsSaved}</strong> antes.
                  </p>
                </div>
              )}

              {/* Danger insight for minimum-only payers */}
              {result.minimumStrategy.totalInterest > 0 && (
                <div style={{ background: `${DANGER}08`, border: `1.5px solid ${DANGER}20`, borderRadius: 18, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <AlertTriangle size={15} color={DANGER} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: DANGER, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Costo Real del Pago Mínimo</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 10px', lineHeight: 1.65 }}>
                    Pagando solo el mínimo, tus <strong>{currencyMXN(balance)}</strong> de deuda te costarán en total <strong>{currencyMXN(result.minimumStrategy.totalPaid)}</strong> — pagando <strong>{currencyMXN(result.minimumStrategy.totalInterest)}</strong> solo en intereses.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: DANGER, fontWeight: 600 }}>
                    <ArrowRight size={12} />
                    Tip: aumentar tu pago mensual es la mejor inversión que puedes hacer hoy.
                  </div>
                </div>
              )}

              {/* Balance comparison chart */}
              {result.chartData && result.chartData.length > 0 && (
                <div style={{ background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 4, height: 36, background: `linear-gradient(180deg, ${BLUE}, ${BLUE}88)`, borderRadius: 4 }} />
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: `${BLUE}10`, border: `1px solid ${BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart2 size={18} color={BLUE} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Comparación de Saldos</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Mínimo vs. Pago Fijo — mes a mes</div>
                    </div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <Chart
                      data={result.chartData}
                      type="line"
                      xAxisKey="month"
                      xAxisLabel="Mes"
                      lines={[
                        { dataKey: 'minimumBalance', name: 'Pago Mínimo', color: WARNING },
                        { dataKey: 'fixedBalance',   name: 'Pago Fijo',   color: SUCCESS },
                      ]}
                      formatYAxis="currency"
                      height={300}
                    />
                  </div>
                </div>
              )}

              {/* Summary comparison table */}
              <div style={{ background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 4, height: 32, background: `linear-gradient(180deg, ${MUTED}, ${MUTED}88)`, borderRadius: 4 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Resumen Comparativo</span>
                </div>
                <div style={{ padding: '0 22px' }}>
                  {[
                    { label: 'Tiempo de pago', min: formatMonths(result.minimumStrategy.months), fix: formatMonths(result.fixedStrategy.months) },
                    { label: 'Intereses totales', min: currencyMXN(result.minimumStrategy.totalInterest), fix: currencyMXN(result.fixedStrategy.totalInterest) },
                    { label: 'Total pagado', min: currencyMXN(result.minimumStrategy.totalPaid), fix: currencyMXN(result.fixedStrategy.totalPaid) },
                  ].map(({ label, min, fix }, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '14px 0', borderBottom: i < 2 ? `1px solid ${BORDER}` : 'none', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e', textAlign: 'center' }}>{min}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#065f46', textAlign: 'right' }}>{fix}</span>
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '10px 0 14px' }}>
                    <span style={{ fontSize: 11, color: MUTED }}></span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: WARNING, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mínimo</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: SUCCESS, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fijo</span>
                  </div>
                  </div>
                </div>

              {/* Billy AI Analysis */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                padding: '24px 32px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
                overflow: 'hidden',
                marginTop: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Image src="/billy_chatbot.png" alt="Billy" width={48} height={48} style={{ objectPosition: 'top' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Análisis de Billy</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>IA Mentor Financiero</div>
                    </div>
                  </div>
                  <button
                    onClick={handleAskBilly}
                    disabled={isAnalyzing}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      padding: '10px 20px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      opacity: isAnalyzing ? 0.7 : 1,
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {aiAnalysis ? 'Actualizar Análisis' : 'Analizar mi Deuda'}
                  </button>
                </div>

                {aiAnalysis ? (
                  <div style={{
                    fontSize: 15,
                    color: '#1e293b',
                    lineHeight: 1.6,
                    fontWeight: 500,
                    whiteSpace: 'pre-wrap',
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: 16,
                    border: '1px solid #e2e8f0'
                  }}>
                    {aiAnalysis}
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', margin: '10px 0' }}>
                    Billy puede ayudarte a planear la mejor estrategia para liquidar esta tarjeta. ¡Pruébalo!
                  </p>
                )}
              </div>

              <SaveRunButton
                simulatorSlug="credit-card-payoff"
                inputs={watch()}
                outputs={result || {}}
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
              <div style={{ width: 72, height: 72, borderRadius: 24, background: `${DANGER}10`, border: `1px solid ${DANGER}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircleDollarSign size={32} color={DANGER} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10 }}>La comparación aparecerá aquí</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 300 }}>
                  Ingresa tu saldo, la tasa APR y tu pago fijo propuesto para ver cuánto ahorras respecto al pago mínimo.
                </div>
              </div>
              <button
                type="button"
                onClick={loadPreset}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px',
                  background: BLUE, color: 'white', border: 'none', borderRadius: 14,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 4px 14px ${BLUE}40`, transition: 'all 0.25s',
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
