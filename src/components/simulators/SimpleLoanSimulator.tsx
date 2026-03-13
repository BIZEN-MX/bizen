'use client';

/**
 * Simple Loan / Microcredit Simulator
 * Premium BIZEN UI — matches MonthlyBudgetSimulator design language
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Banknote,
  Percent,
  Calendar,
  Receipt,
  Zap,
  BarChart2,
  TrendingDown,
  CircleDollarSign,
  Loader2,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wallet,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { SaveRunButton } from './SaveRunButton';
import {
  simpleLoanSchema,
  type SimpleLoanInput,
  type SimpleLoanOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateSimpleLoan } from '@/lib/simulators/engines';
import { currencyMXN, pct } from '@/lib/simulators';

/* ─── design tokens ── */
const BLUE    = '#0B71FE';
const NAVY    = '#0f172a';
const SUCCESS = '#059669';
const WARNING = '#d97706';
const DANGER  = '#dc2626';
const PURPLE  = '#7c3aed';
const BORDER  = '#e8ecf1';
const MUTED   = '#64748B';
const BG      = '#FBFAF5';

/* ─── SectionCard ── */
function SectionCard({ children, title, subtitle, accent = BLUE, icon }: {
  children: React.ReactNode; title: string; subtitle?: string;
  accent?: string; icon: React.ReactNode;
}) {
  return (
    <div style={{ background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', marginBottom: 20 }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14, background: 'white' }}>
        <div style={{ width: 4, height: 40, background: `linear-gradient(180deg, ${accent}, ${accent}88)`, borderRadius: 4, flexShrink: 0 }} />
        <div style={{ width: 38, height: 38, borderRadius: 12, background: `${accent}12`, border: `1px solid ${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

/* ─── MetricCard ── */
type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
function MetricCard({ label, value, sub, variant = 'default', icon, large }: {
  label: string; value: string; sub?: string; variant?: Variant;
  icon: React.ReactNode; large?: boolean;
}) {
  const cfgs: Record<Variant, { bg: string; border: string; val: string; lbl: string; iconBg: string; iconColor: string }> = {
    default: { bg: '#f8fafc', border: BORDER,    val: NAVY,    lbl: MUTED,    iconBg: '#f1f5f9', iconColor: NAVY    },
    success: { bg: '#f0fdf4', border: '#bbf7d0', val: '#065f46', lbl: '#16a34a', iconBg: '#dcfce7', iconColor: SUCCESS },
    warning: { bg: '#fffbeb', border: '#fde68a', val: '#92400e', lbl: WARNING,  iconBg: '#fef3c7', iconColor: WARNING },
    danger:  { bg: '#fff1f2', border: '#fecdd3', val: '#9f1239', lbl: DANGER,   iconBg: '#ffe4e6', iconColor: DANGER  },
    info:    { bg: '#eff6ff', border: '#bfdbfe', val: '#1e40af', lbl: BLUE,     iconBg: '#dbeafe', iconColor: BLUE    },
    purple:  { bg: '#faf5ff', border: '#e9d5ff', val: '#6b21a8', lbl: PURPLE,   iconBg: '#f3e8ff', iconColor: PURPLE  },
  };
  const c = cfgs[variant];
  return (
    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 18, padding: large ? '20px 22px' : '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ width: large ? 52 : 44, height: large ? 52 : 44, borderRadius: large ? 16 : 14, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {React.cloneElement(icon as React.ReactElement, { size: large ? 24 : 20, color: c.iconColor, strokeWidth: 2 })}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.lbl, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: large ? 26 : 22, fontWeight: 800, color: c.val, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Main Component ── */
export function SimpleLoanSimulator() {
  const [result, setResult] = React.useState<SimpleLoanOutput | null>(null);
  const [loadingRun, setLoadingRun] = React.useState(false);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const { handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<SimpleLoanInput>({
      resolver: zodResolver(simpleLoanSchema) as any,
      defaultValues: { principal: 0, apr: 0, termMonths: 12, upfrontFees: 0, monthlyFees: 0 },
    });

  React.useEffect(() => {
    async function fetchRun() {
      if (!runId) return;
      setLoadingRun(true);
      try {
        const res = await fetch(`/api/simuladores/runs/${runId}`);
        const data = await res.json();
        if (res.ok && data.run) reset(data.run.inputs);
      } catch (err) { console.error(err); }
      finally { setLoadingRun(false); }
    }
    fetchRun();
  }, [runId, reset]);

  function onSubmit(data: SimpleLoanInput) { setResult(calculateSimpleLoan(data as any)); }
  function loadPreset() {
    const p = PRESET_VALUES.simpleLoan;
    Object.entries(p).forEach(([k, v]) => setValue(k as any, v));
  }

  React.useEffect(() => {
    const sub = watch(() => handleSubmit(onSubmit as any)());
    return () => sub.unsubscribe();
  }, [handleSubmit, watch]);

  if (loadingRun) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 20 }}>
      <Loader2 className="animate-spin" size={42} color={BLUE} />
      <p style={{ color: MUTED, fontWeight: 500 }}>Cargando tu simulación guardada...</p>
    </div>
  );

  const catColor = result ? (result.cat > 60 ? DANGER : result.cat > 30 ? WARNING : SUCCESS) : BLUE;
  const catVariant: Variant = result ? (result.cat > 60 ? 'danger' : result.cat > 30 ? 'warning' : 'success') : 'info';

  return (
    <div>
      {/* Hero strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg,rgba(11,113,254,0.05) 0%,rgba(124,58,237,0.03) 100%)', border: `1px solid rgba(11,113,254,0.12)`, borderRadius: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${BLUE}12`, border: `1px solid ${BLUE}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Banknote size={22} color={BLUE} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Amortización Francesa</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>Calcula el costo real de cualquier préstamo o microcrédito</div>
          </div>
        </div>
        <button type="button" onClick={loadPreset} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: BLUE, border: 'none', borderRadius: 14, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: `0 4px 14px ${BLUE}40`, transition: 'all 0.25s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${BLUE}50`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${BLUE}40`; }}>
          <Zap size={15} strokeWidth={2.5} /> Cargar Ejemplo Práctico
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {/* LEFT */}
        <div>
          <SectionCard title="Monto del Préstamo" subtitle="¿Cuánto dinero vas a solicitar?" accent={BLUE} icon={<Banknote size={18} color={BLUE} strokeWidth={2} />}>
            <NumberField value={watch('principal')} onChange={val => setValue('principal', val)} currency error={errors.principal?.message} hint="El capital que recibirás en tu cuenta" />
          </SectionCard>

          <SectionCard title="Tasa Anual (APR)" subtitle="Interés anual que cobra el prestamista" accent={WARNING} icon={<Percent size={18} color={WARNING} strokeWidth={2} />}>
            <NumberField value={watch('apr')} onChange={val => setValue('apr', val)} percentage error={errors.apr?.message} hint="Tasas típicas: bancos 20–40%, microcréditos 60–120%" />
          </SectionCard>

          <SectionCard title="Plazo del Préstamo" subtitle="¿En cuántos meses lo pagarás?" accent={PURPLE} icon={<Calendar size={18} color={PURPLE} strokeWidth={2} />}>
            <NumberField value={watch('termMonths')} onChange={val => setValue('termMonths', Math.round(val))} error={errors.termMonths?.message} hint="Ej: 6, 12, 24 o 36 meses" />
          </SectionCard>

          <SectionCard title="Comisiones y Cargos" subtitle="Costos adicionales del préstamo" accent={DANGER} icon={<Receipt size={18} color={DANGER} strokeWidth={2} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <NumberField value={watch('upfrontFees')} onChange={val => setValue('upfrontFees', val)} currency error={errors.upfrontFees?.message} hint="Comisión única al inicio" />
              </div>
              <div>
                <NumberField value={watch('monthlyFees')} onChange={val => setValue('monthlyFees', val)} currency error={errors.monthlyFees?.message} hint="Cargo adicional por mes" />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result ? (
            <>
              {/* Hero KPI */}
              <MetricCard label="Pago Mensual" value={currencyMXN(result.monthlyPayment)} sub="Cuota fija que pagarás cada mes" variant="info" icon={<Wallet />} large />

              {/* 2x2 grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                <MetricCard label="CAT Aproximado" value={pct(result.cat)} sub="Costo Anual Total" variant={catVariant} icon={<Percent />} />
                <MetricCard label="Intereses Totales" value={currencyMXN(result.totalInterest)} sub="Solo intereses" variant="warning" icon={<TrendingDown />} />
                <MetricCard label="Costo Total" value={currencyMXN(result.totalCost)} sub="Capital + intereses + comisiones" variant="danger" icon={<Receipt />} />
                <MetricCard label="Plazo" value={`${watch('termMonths')} meses`} sub="Duración del crédito" variant="default" icon={<Clock />} />
              </div>

              {/* CAT insight */}
              <div style={{ background: `${catColor}08`, border: `1.5px solid ${catColor}22`, borderRadius: 18, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  {result.cat > 30 ? <AlertTriangle size={15} color={catColor} /> : <CheckCircle2 size={15} color={catColor} />}
                  <span style={{ fontSize: 11, fontWeight: 700, color: catColor, textTransform: 'uppercase', letterSpacing: '0.07em' }}>¿Qué significa el CAT?</span>
                </div>
                <p style={{ fontSize: 13, color: NAVY, margin: '0 0 8px', lineHeight: 1.65 }}>
                  El <strong>Costo Anual Total ({pct(result.cat)})</strong> incluye intereses y comisiones, mostrando el costo real del crédito.
                  {result.cat > 60 ? ' Esta tasa es muy alta — compara con otras opciones antes de firmar.' :
                   result.cat > 30 ? ' Esta tasa es moderada para el mercado mexicano.' :
                   ' ¡Esta es una tasa competitiva!'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: catColor, fontWeight: 600 }}>
                  <Info size={12} /> Entre menor CAT, mejor para ti.
                </div>
              </div>

              {/* Amortization table */}
              {result.amortizationTable && result.amortizationTable.length > 0 && (
                <div style={{ background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 4, height: 36, background: `linear-gradient(180deg, ${BLUE}, ${BLUE}88)`, borderRadius: 4 }} />
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: `${BLUE}10`, border: `1px solid ${BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart2 size={18} color={BLUE} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Tabla de Amortización</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Desglose mes a mes de cada pago</div>
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg,#f1f5f9,#e8edf5)' }}>
                          {['Mes', 'Pago', 'Interés', 'Capital', 'Saldo'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Mes' ? 'left' : 'right' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortizationTable.slice(0, 12).map((row, i) => (
                          <tr key={row.month} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? 'white' : '#fafbfc' }}>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: NAVY }}>{row.month}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: NAVY, textAlign: 'right' }}>{currencyMXN(row.payment, 0)}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: DANGER, textAlign: 'right' }}>{currencyMXN(row.interest, 0)}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: SUCCESS, textAlign: 'right' }}>{currencyMXN(row.principal, 0)}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, color: MUTED, textAlign: 'right' }}>{currencyMXN(row.balance, 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.amortizationTable.length > 12 && (
                      <div style={{ padding: '12px 14px', textAlign: 'center', fontSize: 12, color: MUTED, borderTop: `1px solid ${BORDER}` }}>
                        Mostrando primeros 12 de {result.amortizationTable.length} meses
                      </div>
                    )}
                  </div>
                </div>
              )}

              <SaveRunButton simulatorSlug="simple-loan" inputs={watch()} outputs={result} />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 32px', textAlign: 'center', background: 'white', borderRadius: 24, border: `1px solid ${BORDER}`, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', minHeight: 340 }}>
              <div style={{ width: 72, height: 72, borderRadius: 24, background: `${BLUE}10`, border: `1px solid ${BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircleDollarSign size={32} color={BLUE} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10 }}>El análisis del préstamo aparecerá aquí</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 300 }}>Ingresa el monto, la tasa APR y el plazo para ver tu pago mensual, CAT y la tabla de amortización.</div>
              </div>
              <button type="button" onClick={loadPreset} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: BLUE, color: 'white', border: 'none', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${BLUE}40`, transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <Zap size={15} strokeWidth={2.5} /> Ver un ejemplo práctico
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
