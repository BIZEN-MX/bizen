'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrendingUp, Wallet, Calendar, Zap, BarChart2, Trophy, Shield, Rocket, CircleDollarSign, Loader2, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { SaveRunButton } from './SaveRunButton';
import { Chart } from './Chart';
import { investmentComparisonSchema, type InvestmentComparisonInput, type InvestmentComparisonOutput, PRESET_VALUES } from '@/lib/simulators/schemas';
import { calculateInvestmentComparison } from '@/lib/simulators/engines';
import { currencyMXN } from '@/lib/simulators';

const BLUE = '#0B71FE', NAVY = '#0f172a', SUCCESS = '#059669', WARNING = '#d97706';
const PURPLE = '#7c3aed', BORDER = '#e8ecf1', MUTED = '#64748B', BG = '#FBFAF5';
const OPTION_COLORS = { A: BLUE, B: SUCCESS, C: WARNING };
const OPTION_ICONS  = { A: Shield, B: Rocket, C: Trophy };

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
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

function OptionCard({ label, name, futureValue, totalInterest, isWinner, color, Icon }: { label: string; name: string; futureValue: number; totalInterest: number; isWinner: boolean; color: string; Icon: any }) {
  return (
    <div style={{ background: isWinner ? `${color}06` : 'white', border: `${isWinner ? 2 : 1.5}px solid ${isWinner ? color : BORDER}`, borderRadius: 18, overflow: 'hidden', boxShadow: isWinner ? `0 4px 20px ${color}18` : '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isWinner ? `${color}20` : BORDER}`, background: isWinner ? `${color}08` : '#fafbfc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}12`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={16} color={color} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{name}</div>
          </div>
        </div>
        {isWinner && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 99, padding: '4px 10px' }}>
            <Trophy size={11} color={color} strokeWidth={2.5} />
            <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ganador</span>
          </div>
        )}
      </div>
      <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Valor Final</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: isWinner ? color : NAVY, letterSpacing: '-0.02em' }}>{currencyMXN(futureValue)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Intereses</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: SUCCESS, letterSpacing: '-0.02em' }}>{currencyMXN(totalInterest)}</div>
        </div>
      </div>
    </div>
  );
}

function InlineInput({ label, value, onChange, accent }: { label: string; value: string; onChange: (v: string) => void; accent: string }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Ej: CETES, Fondo de Inversión..." style={{ width: '100%', height: 42, padding: '0 14px', boxSizing: 'border-box', background: BG, border: `1.5px solid ${focused ? accent : BORDER}`, borderRadius: 12, fontSize: 13, fontWeight: 500, color: NAVY, outline: 'none', boxShadow: focused ? `0 0 0 3px ${accent}18` : 'none', transition: 'all 0.2s', fontFamily: "inherit" }} />
    </div>
  );
}

export function InvestmentComparisonSimulator() {
  const [result, setResult] = React.useState<InvestmentComparisonOutput | null>(null);
  const [loadingRun, setLoadingRun] = React.useState(false);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<InvestmentComparisonInput>({
    resolver: zodResolver(investmentComparisonSchema),
    defaultValues: { initial: 0, monthlyContribution: 0, months: 12, rateA: 5, rateB: 8, rateC: 12, labelA: 'Ahorro Tradicional', labelB: 'CETES', labelC: 'Fondo de Inversión' },
  });

  React.useEffect(() => {
    async function fetchRun() {
      if (!runId) return; setLoadingRun(true);
      try { const r = await fetch(`/api/simuladores/runs/${runId}`); const d = await r.json(); if (r.ok && d.run) reset(d.run.inputs); }
      catch (e) { console.error(e); } finally { setLoadingRun(false); }
    }
    fetchRun();
  }, [runId, reset]);

  function onSubmit(data: InvestmentComparisonInput) { setResult(calculateInvestmentComparison(data)); }
  function loadPreset() { const p = PRESET_VALUES.investmentComparison; Object.entries(p).forEach(([k, v]) => setValue(k as any, v)); }
  function loadConservative() { setValue('rateA', 3); setValue('rateB', 5); setValue('rateC', 7); }
  function loadOptimistic()  { setValue('rateA', 6); setValue('rateB', 10); setValue('rateC', 15); }

  React.useEffect(() => { const sub = watch(() => handleSubmit(onSubmit)()); return () => sub.unsubscribe(); }, [handleSubmit, watch]);

  if (loadingRun) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 20 }}>
      <Loader2 className="animate-spin" size={42} color={BLUE} />
      <p style={{ color: MUTED, fontWeight: 500 }}>Cargando simulación...</p>
    </div>
  );

  const btnBase = (color: string): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: `${color}10`, border: `1.5px solid ${color}30`, borderRadius: 10, color, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' });

  return (
    <div>
      {/* Hero strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg,rgba(5,150,105,0.05) 0%,rgba(11,113,254,0.03) 100%)', border: `1px solid rgba(5,150,105,0.15)`, borderRadius: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${SUCCESS}12`, border: `1px solid ${SUCCESS}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} color={SUCCESS} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: SUCCESS, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>3 Opciones de Inversión</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>Compara rendimientos y elige la mejor opción para ti</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={loadPreset} style={btnBase(BLUE)}><Zap size={13} strokeWidth={2.5} /> Ejemplo</button>
          <button type="button" onClick={loadConservative} style={btnBase(MUTED)}><Shield size={13} strokeWidth={2} /> Conservador</button>
          <button type="button" onClick={loadOptimistic} style={btnBase(WARNING)}><Rocket size={13} strokeWidth={2} /> Optimista</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {/* LEFT */}
        <div>
          <SectionCard title="Capital Base" subtitle="Inversión inicial y aportación mensual" accent={BLUE} icon={<Wallet size={18} color={BLUE} strokeWidth={2} />}>
            <div style={{ marginBottom: 16 }}>
              <NumberField value={watch('initial')} onChange={v => setValue('initial', v)} currency error={errors.initial?.message} hint="Monto con el que comienzas" />
            </div>
            <NumberField value={watch('monthlyContribution')} onChange={v => setValue('monthlyContribution', v)} currency error={errors.monthlyContribution?.message} hint="Aportación adicional cada mes" />
          </SectionCard>

          <SectionCard title="Plazo de Inversión" subtitle="¿Cuántos meses quieres proyectar?" accent={PURPLE} icon={<Calendar size={18} color={PURPLE} strokeWidth={2} />}>
            <NumberField value={watch('months')} onChange={v => setValue('months', Math.round(v))} error={errors.months?.message} hint="Ej: 12 = 1 año, 60 = 5 años, 120 = 10 años" />
          </SectionCard>

          {(['A', 'B', 'C'] as const).map(opt => {
            const color = OPTION_COLORS[opt];
            const IconComp = OPTION_ICONS[opt];
            return (
              <SectionCard key={opt} title={`Opción ${opt}`} subtitle="Nombre e instrumento de inversión" accent={color} icon={<IconComp size={18} color={color} strokeWidth={2} />}>
                <InlineInput label="Nombre del instrumento" value={watch(`label${opt}` as any) || ''} onChange={v => setValue(`label${opt}` as any, v)} accent={color} />
                <NumberField value={watch(`rate${opt}` as any)} onChange={v => setValue(`rate${opt}` as any, v)} percentage error={(errors as any)[`rate${opt}`]?.message} hint="Tasa de rendimiento anual (%)" />
              </SectionCard>
            );
          })}
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result ? (
            <>
              <div style={{ background: 'linear-gradient(135deg,#0B71FE,#1e40af)', borderRadius: 20, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={24} color="white" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>🏆 Mejor Rendimiento</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Opción {result.winner} — {(result[`option${result.winner}` as keyof typeof result] as any).label}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Valor final: <strong>{currencyMXN((result[`option${result.winner}` as keyof typeof result] as any).futureValue)}</strong></div>
                </div>
              </div>

              {(['A', 'B', 'C'] as const).map(opt => {
                const option = result[`option${opt}` as keyof typeof result] as any;
                return <OptionCard key={opt} label={`Opción ${opt}`} name={option.label} futureValue={option.futureValue} totalInterest={option.totalInterest} isWinner={result.winner === opt} color={OPTION_COLORS[opt]} Icon={OPTION_ICONS[opt]} />;
              })}

              <div style={{ background: 'white', borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 36, background: `linear-gradient(180deg,${BLUE},${BLUE}88)`, borderRadius: 4 }} />
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: `${BLUE}10`, border: `1px solid ${BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart2 size={18} color={BLUE} strokeWidth={2} /></div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Comparación de Crecimiento</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Las 3 opciones mes a mes</div>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <Chart data={result.chartData} type="line" xAxisKey="month" xAxisLabel="Mes"
                    lines={[
                      { dataKey: 'optionA', name: result.optionA.label, color: BLUE    },
                      { dataKey: 'optionB', name: result.optionB.label, color: SUCCESS },
                      { dataKey: 'optionC', name: result.optionC.label, color: WARNING },
                    ]}
                    formatYAxis="currency" height={300}
                  />
                </div>
              </div>

              <SaveRunButton simulatorSlug="investment-comparison" inputs={watch()} outputs={result} />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 32px', textAlign: 'center', background: 'white', borderRadius: 24, border: `1px solid ${BORDER}`, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', minHeight: 340 }}>
              <div style={{ width: 72, height: 72, borderRadius: 24, background: `${SUCCESS}10`, border: `1px solid ${SUCCESS}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircleDollarSign size={32} color={SUCCESS} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10 }}>La comparación aparecerá aquí</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 300 }}>Configura tus 3 opciones de inversión para ver cuál genera más rendimiento.</div>
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
