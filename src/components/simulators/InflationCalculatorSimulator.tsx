'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrendingUp, Banknote, Calendar, Wallet, Zap, BarChart2, AlertTriangle, CircleDollarSign, Loader2, ArrowUp } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { SaveRunButton } from './SaveRunButton';
import { Chart } from './Chart';
import { inflationCalculatorSchema, type InflationCalculatorInput, type InflationCalculatorOutput, PRESET_VALUES } from '@/lib/simulators/schemas';
import { calculateInflation } from '@/lib/simulators/engines';
import { currencyMXN, pct } from '@/lib/simulators';

const BLUE = '#0B71FE', NAVY = '#0f172a', SUCCESS = '#059669', WARNING = '#d97706';
const DANGER = '#dc2626', BORDER = '#e8ecf1', MUTED = '#64748B';

function SectionCard({ children, title, subtitle, accent = BLUE, icon }: { children: React.ReactNode; title: string; subtitle?: string; accent?: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', marginBottom: 20 }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 4, height: 40, background: `linear-gradient(180deg,${accent},${accent}88)`, borderRadius: 4, flexShrink: 0 }} />
        <div style={{ width: 38, height: 38, borderRadius: 12, background: `${accent}12`, border: `1px solid ${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <div className="section-card-content" style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info';
function MetricCard({ label, value, sub, variant = 'default', icon, large }: { label: string; value: string; sub?: string; variant?: Variant; icon: React.ReactNode; large?: boolean }) {
  const cfgs: Record<Variant, { bg: string; border: string; val: string; lbl: string; iconBg: string; iconColor: string }> = {
    default: { bg: '#f8fafc', border: BORDER,    val: NAVY,    lbl: MUTED,    iconBg: '#f1f5f9', iconColor: NAVY    },
    success: { bg: '#f0fdf4', border: '#bbf7d0', val: '#065f46', lbl: '#16a34a', iconBg: '#dcfce7', iconColor: SUCCESS },
    warning: { bg: '#fffbeb', border: '#fde68a', val: '#92400e', lbl: WARNING,  iconBg: '#fef3c7', iconColor: WARNING },
    danger:  { bg: '#fff1f2', border: '#fecdd3', val: '#9f1239', lbl: DANGER,   iconBg: '#ffe4e6', iconColor: DANGER  },
    info:    { bg: '#eff6ff', border: '#bfdbfe', val: '#1e40af', lbl: BLUE,     iconBg: '#dbeafe', iconColor: BLUE    },
  };
  const c = cfgs[variant];
  return (
    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 18, padding: large ? '20px 22px' : '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ width: large ? 52 : 44, height: large ? 52 : 44, borderRadius: large ? 16 : 14, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {React.cloneElement(icon as React.ReactElement, { size: large ? 24 : 20, color: c.iconColor, strokeWidth: 2 } as any)}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.lbl, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
        <div className="metric-card-val" style={{ fontSize: large ? 26 : 22, fontWeight: 800, color: c.val, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function InflationCalculatorSimulator() {
  const [result, setResult] = React.useState<InflationCalculatorOutput | null>(null);
  const [loadingRun, setLoadingRun] = React.useState(false);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const { handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<InflationCalculatorInput>({
    resolver: zodResolver(inflationCalculatorSchema),
    defaultValues: { currentPrice: 0, inflationAnnual: 0, years: 1, currentIncome: undefined },
  });

  React.useEffect(() => {
    async function fetchRun() {
      if (!runId) return; setLoadingRun(true);
      try { const r = await fetch(`/api/simuladores/runs/${runId}`); const d = await r.json(); if (r.ok && d.run) reset(d.run.inputs); }
      catch (e) { console.error(e); } finally { setLoadingRun(false); }
    }
    fetchRun();
  }, [runId, reset]);

  function onSubmit(data: InflationCalculatorInput) { setResult(calculateInflation(data)); }
  function loadPreset() { const p = PRESET_VALUES.inflationCalculator; Object.entries(p).forEach(([k, v]) => setValue(k as any, v)); }
  React.useEffect(() => { const sub = watch(() => handleSubmit(onSubmit)()); return () => sub.unsubscribe(); }, [handleSubmit, watch]);

  if (loadingRun) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 20 }}>
      <Loader2 className="animate-spin" size={42} color={BLUE} />
      <p style={{ color: MUTED, fontWeight: 500 }}>Cargando simulación...</p>
    </div>
  );

  const incomeValue = watch('currentIncome');
  const hasIncome = !!incomeValue && incomeValue > 0;
  const years = watch('years') || 1;
  const yearLabel = years === 1 ? 'año' : 'años';

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

      {/* Hero strip */}
      <div className="hero-strip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg,rgba(220,38,38,0.05) 0%,rgba(217,119,6,0.03) 100%)', border: `1px solid rgba(220,38,38,0.12)`, borderRadius: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${DANGER}12`, border: `1px solid ${DANGER}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} color={DANGER} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: DANGER, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Poder Adquisitivo</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>Descubre cómo la inflación erosiona el valor de tu dinero</div>
          </div>
        </div>
        <button type="button" onClick={loadPreset} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: BLUE, border: 'none', borderRadius: 14, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: `0 4px 14px ${BLUE}40`, transition: 'all 0.25s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${BLUE}50`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${BLUE}40`; }}>
          <Zap size={15} strokeWidth={2.5} /> Cargar Ejemplo Práctico
        </button>
      </div>

      <div className="simulator-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {/* LEFT */}
        <div>
          <SectionCard title="Precio Actual" subtitle="¿Cuánto cuesta hoy el bien o servicio?" accent={WARNING} icon={<Banknote size={18} color={WARNING} strokeWidth={2} />}>
            <NumberField value={watch('currentPrice')} onChange={v => setValue('currentPrice', v)} currency error={errors.currentPrice?.message} hint="Puede ser el precio de un producto, renta, colegiatura, etc." />
          </SectionCard>

          <SectionCard title="Tasa de Inflación Anual" subtitle="¿Cuánto sube el costo de vida cada año?" accent={DANGER} icon={<ArrowUp size={18} color={DANGER} strokeWidth={2} />}>
            <NumberField value={watch('inflationAnnual')} onChange={v => setValue('inflationAnnual', v)} percentage error={errors.inflationAnnual?.message} hint="Meta de Banxico: ~3%. Inflación reciente en México: 4–6% anual" />
          </SectionCard>

          <SectionCard title="Horizonte de Tiempo" subtitle="¿Cuántos años en el futuro quieres proyectar?" accent={BLUE} icon={<Calendar size={18} color={BLUE} strokeWidth={2} />}>
            <NumberField value={watch('years')} onChange={v => setValue('years', Math.round(v))} error={errors.years?.message} hint="Ej: 1 año, 5 años, 10 años, 20 años" />
          </SectionCard>

          <SectionCard title="Tu Ingreso Actual (Opcional)" subtitle="Para calcular el sueldo que necesitas en el futuro" accent={SUCCESS} icon={<Wallet size={18} color={SUCCESS} strokeWidth={2} />}>
            <NumberField value={watch('currentIncome') || 0} onChange={v => setValue('currentIncome', v > 0 ? v : undefined)} currency hint="Si ingresas tu sueldo actual, calculamos cuánto necesitarás ganar" />
            <div style={{ marginTop: 14, padding: '12px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: '#1e40af', margin: 0, lineHeight: 1.55 }}>
                <strong>Tip:</strong> Si ganas lo mismo pero todo sube de precio, tu poder adquisitivo baja. Este campo te muestra cuánto necesitas ganar para mantener tu nivel de vida.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result ? (
            <>
              {/* Hero metric */}
              <MetricCard label={`Precio en ${years} ${yearLabel}`} value={currencyMXN(result.futurePrice)} sub={`Vs. ${currencyMXN(watch('currentPrice'))} hoy`} variant="warning" icon={<Banknote />} large />

              {/* Supporting metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                <MetricCard label="Aumento de Precio" value={currencyMXN(result.priceIncrease)} sub={`+${pct(result.priceIncreasePercent)}`} variant="danger" icon={<TrendingUp />} />
                <MetricCard label="Inflación Aplicada" value={pct(watch('inflationAnnual'))} sub={`Por ${years} ${yearLabel}`} variant="default" icon={<ArrowUp />} />
                {result.requiredIncome && (
                  <>
                    <MetricCard label="Ingreso Necesario" value={currencyMXN(result.requiredIncome)} sub="Para mantener poder adquisitivo" variant="info" icon={<Wallet />} />
                    <MetricCard label="Aumento Requerido" value={currencyMXN(result.incomeIncrease || 0)} sub="En tu ingreso actual" variant="warning" icon={<ArrowUp />} />
                  </>
                )}
              </div>

              {/* Narrative insight */}
              <div style={{ background: `${DANGER}08`, border: `1.5px solid ${DANGER}20`, borderRadius: 18, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <AlertTriangle size={15} color={DANGER} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: DANGER, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Ejemplo Práctico</span>
                </div>
                <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 8px', lineHeight: 1.65 }}>
                  Hoy un producto cuesta <strong>{currencyMXN(watch('currentPrice'))}</strong>. En <strong>{years} {yearLabel}</strong>, ese mismo producto costará <strong>{currencyMXN(result.futurePrice)}</strong> — un aumento de <strong>{currencyMXN(result.priceIncrease)} (+{pct(result.priceIncreasePercent)})</strong>.
                </p>
                {result.requiredIncome && (
                  <p style={{ fontSize: 13, color: '#1e40af', margin: 0, lineHeight: 1.65 }}>
                    Si hoy ganas <strong>{currencyMXN(incomeValue || 0)}</strong>, necesitarás ganar al menos <strong>{currencyMXN(result.requiredIncome)}</strong> en {years} {yearLabel} para mantener el mismo nivel de vida.
                  </p>
                )}
              </div>

              {/* Growth chart */}
              <div style={{ background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 36, background: `linear-gradient(180deg,${DANGER},${DANGER}88)`, borderRadius: 4 }} />
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: `${DANGER}10`, border: `1px solid ${DANGER}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart2 size={18} color={DANGER} strokeWidth={2} /></div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Proyección{hasIncome ? ' de Precios e Ingresos' : ' de Precios'}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Evolución año a año</div>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <Chart
                    data={result.chartData}
                    type="line"
                    xAxisKey="year"
                    xAxisLabel="Año"
                    lines={[
                      { dataKey: 'price', name: 'Precio', color: DANGER },
                      ...(hasIncome ? [{ dataKey: 'income', name: 'Ingreso Necesario', color: BLUE }] : []),
                    ]}
                    formatYAxis="currency"
                    height={300}
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ padding: '14px 18px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertTriangle size={16} color={WARNING} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
                  <strong>Importante:</strong> Estas proyecciones asumen una tasa de inflación constante. En la realidad, la inflación varía año con año.
                </span>
              </div>

              <SaveRunButton simulatorSlug="inflation-calculator" inputs={watch()} outputs={result} />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 32px', textAlign: 'center', background: 'white', borderRadius: 24, border: `1px solid ${BORDER}`, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', minHeight: 340 }}>
              <div style={{ width: 72, height: 72, borderRadius: 24, background: `${DANGER}10`, border: `1px solid ${DANGER}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircleDollarSign size={32} color={DANGER} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10 }}>La proyección aparecerá aquí</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 300 }}>Ingresa el precio actual, la tasa de inflación y el plazo para ver cómo crece el costo en el tiempo.</div>
              </div>
              <button type="button" onClick={loadPreset} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: BLUE, color: 'white', border: 'none', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${BLUE}40`, transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <Zap size={15} strokeWidth={2.5} /> Ver un ejemplo práctico
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
