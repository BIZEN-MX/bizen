'use client';

/**
 * Monthly Budget 50/30/20 Simulator
 * Premium BIZEN UI — light spatial theme, icon-based (no emojis)
 */

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Wallet,
  LayoutGrid,
  Home,
  Sparkles,
  Target,
  BarChart2,
  Lightbulb,
  Plus,
  X,
  Zap,
  PieChart,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Save,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Info,
  CreditCard,
  PiggyBank,
  Loader2,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { SaveRunButton } from './SaveRunButton';
import { Chart } from './Chart';
import {
  monthlyBudgetSchema,
  type MonthlyBudgetInput,
  type MonthlyBudgetOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateMonthlyBudget } from '@/lib/simulators/engines';
import { currencyMXN } from '@/lib/simulators';

/* ─────────────────────────────────── design tokens ── */
const BLUE = '#0B71FE';
const NAVY = '#0f172a';
const SUCCESS = '#059669';
const WARNING = '#d97706';
const DANGER = '#dc2626';
const BG = '#FBFAF5';
const BORDER = '#e8ecf1';
const MUTED = '#64748B';
const PURPLE = '#7c3aed';

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
        {/* Accent bar */}
        <div style={{
          width: 4, height: 40,
          background: `linear-gradient(180deg, ${accent}, ${accent}88)`,
          borderRadius: 4, flexShrink: 0,
        }} />
        {/* Icon bubble */}
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
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────── ExpenseRow ── */
function ExpenseRow({
  nameProps,
  amount,
  onAmountChange,
  onRemove,
  placeholder,
}: {
  nameProps: React.InputHTMLAttributes<HTMLInputElement>;
  amount: number;
  onAmountChange: (v: number) => void;
  onRemove: () => void;
  placeholder: string;
}) {
  const [nameFocused, setNameFocused] = React.useState(false);
  const [amtFocused, setAmtFocused] = React.useState(false);
  const [displayVal, setDisplayVal] = React.useState(
    amount > 0 ? new Intl.NumberFormat('es-MX').format(amount) : ''
  );

  const inputBase: React.CSSProperties = {
    height: 44,
    padding: '0 14px',
    background: BG,
    border: `1.5px solid ${BORDER}`,
    borderRadius: 12,
    fontSize: 14,
    color: NAVY,
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  };

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
      {/* Name field */}
      <input
        {...nameProps}
        placeholder={placeholder}
        onFocus={() => setNameFocused(true)}
        onBlur={(e) => { setNameFocused(false); (nameProps as any).onBlur?.(e); }}
        style={{
          ...inputBase,
          flex: 1,
          border: `1.5px solid ${nameFocused ? BLUE : BORDER}`,
          boxShadow: nameFocused ? `0 0 0 3px ${BLUE}20` : 'none',
        }}
      />
      {/* Amount field */}
      <div style={{ position: 'relative', width: 130, flexShrink: 0 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 14, fontWeight: 600,
          color: amtFocused ? BLUE : MUTED,
          pointerEvents: 'none', transition: 'color 0.2s',
        }}>$</span>
        <input
          type="text"
          inputMode="decimal"
          value={displayVal}
          onFocus={() => {
            setAmtFocused(true);
            setDisplayVal(amount > 0 ? amount.toString() : '');
          }}
          onBlur={() => {
            setAmtFocused(false);
            const parsed = parseFloat(displayVal.replace(/[,\s]/g, ''));
            const val = isNaN(parsed) ? 0 : parsed;
            onAmountChange(val);
            setDisplayVal(val > 0 ? new Intl.NumberFormat('es-MX').format(val) : '');
          }}
          onChange={(e) => {
            setDisplayVal(e.target.value);
            const parsed = parseFloat(e.target.value.replace(/[,\s]/g, ''));
            if (!isNaN(parsed)) onAmountChange(parsed);
          }}
          style={{
            ...inputBase,
            width: '100%',
            paddingLeft: 28,
            paddingRight: 10,
            fontWeight: 600,
            border: `1.5px solid ${amtFocused ? BLUE : BORDER}`,
            boxShadow: amtFocused ? `0 0 0 3px ${BLUE}20` : 'none',
          }}
        />
      </div>
      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        style={{
          width: 36, height: 36, flexShrink: 0,
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; }}
      >
        <X size={14} color={DANGER} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────── AddButton ── */
function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 18px',
        background: hov ? `${BLUE}12` : `${BLUE}08`,
        border: `1.5px dashed ${hov ? BLUE : `${BLUE}60`}`,
        borderRadius: 12,
        color: BLUE,
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: 6,
      }}
    >
      <Plus size={15} strokeWidth={2.5} />
      {label}
    </button>
  );
}

/* ─────────────────────────────────── MetricCard ── */
type MetricVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

function MetricCard({
  label,
  value,
  variant = 'default',
  icon,
}: {
  label: string;
  value: string;
  variant?: MetricVariant;
  icon: React.ReactNode;
}) {
  const configs: Record<MetricVariant, {
    bg: string; border: string; val: string; label: string; iconBg: string; iconColor: string;
  }> = {
    default: { bg: '#f8fafc', border: BORDER, val: NAVY, label: MUTED, iconBg: '#f1f5f9', iconColor: NAVY },
    success: { bg: '#f0fdf4', border: '#bbf7d0', val: '#065f46', label: '#16a34a', iconBg: '#dcfce7', iconColor: SUCCESS },
    warning: { bg: '#fffbeb', border: '#fde68a', val: '#92400e', label: WARNING, iconBg: '#fef3c7', iconColor: WARNING },
    danger:  { bg: '#fff1f2', border: '#fecdd3', val: '#9f1239', label: DANGER,  iconBg: '#ffe4e6', iconColor: DANGER  },
    info:    { bg: '#eff6ff', border: '#bfdbfe', val: '#1e40af', label: BLUE,    iconBg: '#dbeafe', iconColor: BLUE    },
  };
  const c = configs[variant];
  return (
    <div style={{
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: 18, padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: c.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {(React.cloneElement(icon as any, { size: 20, color: c.iconColor, strokeWidth: 2 }) as any)}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.label, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: c.val, letterSpacing: '-0.02em' }}>{value}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────── Main Component ── */
export function MonthlyBudgetSimulator() {
  const [result, setResult] = React.useState<MonthlyBudgetOutput | null>(null);
  const [loadingRun, setLoadingRun] = React.useState(false);
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<MonthlyBudgetInput>({
      resolver: zodResolver(monthlyBudgetSchema),
      defaultValues: {
        monthlyIncome: 0,
        fixedExpenses: [],
        variableExpenses: [],
        savingsGoal: 0,
        mode: '50/30/20',
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

  const { fields: fixedFields, append: appendFixed, remove: removeFixed } =
    useFieldArray({ control, name: 'fixedExpenses' });
  const { fields: variableFields, append: appendVariable, remove: removeVariable } =
    useFieldArray({ control, name: 'variableExpenses' });

  const monthlyIncome = watch('monthlyIncome');
  const mode = watch('mode');

  function onSubmit(data: MonthlyBudgetInput) {
    setResult(calculateMonthlyBudget(data));
  }

  function loadPreset() {
    const p = PRESET_VALUES.monthlyBudget;
    setValue('monthlyIncome', p.monthlyIncome);
    setValue('fixedExpenses', p.fixedExpenses);
    setValue('variableExpenses', p.variableExpenses);
    setValue('savingsGoal', p.savingsGoal);
    setValue('mode', p.mode);
  }

  async function handleAskBilly() {
    if (!result) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulatorName: 'Presupuesto Mensual 50/30/20',
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
      console.error('Error analyzing budget:', error);
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

  const chartData = result?.breakdown
    ? [
        { category: 'Esenciales', target: result.breakdown.essentialTarget || 0, actual: result.breakdown.essentialActual },
        { category: 'Deseos',     target: result.breakdown.wantsTarget    || 0, actual: result.breakdown.wantsActual    },
        { category: 'Ahorro',     target: result.breakdown.savingsTarget  || 0, actual: result.breakdown.savingsActual  },
      ]
    : [];

  const selectStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 44px 0 16px',
    background: BG,
    border: `1.5px solid ${BORDER}`,
    borderRadius: 14,
    fontSize: 14, fontWeight: 600, color: NAVY,
    outline: 'none', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    transition: 'all 0.2s ease',
  };

  return (
    <div>

      {/* ── HERO STRIP ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 32,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(11,113,254,0.04) 0%, rgba(11,113,254,0.01) 100%)',
        border: `1px solid rgba(11,113,254,0.1)`,
        borderRadius: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${BLUE}12`, border: `1px solid ${BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart size={22} color={BLUE} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Método 50/30/20</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NAVY }}>Analiza a dónde va cada peso de tu ingreso</div>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>

        {/* ──── LEFT: INPUTS ──── */}
        <div>

          {/* Income */}
          <SectionCard
            title="Ingreso Mensual"
            subtitle="Tu fuente principal de análisis"
            accent={SUCCESS}
            icon={<Wallet size={18} color={SUCCESS} strokeWidth={2} />}
          >
            <NumberField
              value={monthlyIncome}
              onChange={(val) => setValue('monthlyIncome', val)}
              currency
              error={errors.monthlyIncome?.message}
              hint="Incluye salario, ingresos extra y cualquier otra fuente mensual"
            />
          </SectionCard>

          {/* Mode */}
          <SectionCard
            title="Método de Presupuesto"
            subtitle="Elige cómo distribuir tu ingreso"
            accent={BLUE}
            icon={<LayoutGrid size={18} color={BLUE} strokeWidth={2} />}
          >
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 10, lineHeight: 1.6 }}>
              La regla <strong style={{ color: NAVY }}>50/30/20</strong> destina 50% a necesidades, 30% a deseos y 20% a ahorro
            </div>
            <div style={{ position: 'relative' }}>
              <select {...register('mode')} style={selectStyle}>
                <option value="50/30/20">Regla 50/30/20 (Recomendado)</option>
                <option value="custom">Personalizado (Tú decides)</option>
              </select>
            </div>
          </SectionCard>

          {/* Fixed Expenses */}
          <SectionCard
            title="Gastos Fijos"
            subtitle="Renta, comida, transporte, servicios"
            accent={PURPLE}
            icon={<Home size={18} color={PURPLE} strokeWidth={2} />}
          >
            {fixedFields.length === 0 && (
              <div style={{
                padding: '16px', background: '#f8f9fb', borderRadius: 14,
                border: '1.5px dashed #e2e8f0', textAlign: 'center',
                fontSize: 13, color: '#94a3b8', marginBottom: 14,
              }}>
                No hay gastos fijos. Agrega tus necesidades básicas.
              </div>
            )}
            {fixedFields.map((field, index) => (
              <ExpenseRow
                key={field.id}
                nameProps={register(`fixedExpenses.${index}.name`)}
                amount={watch(`fixedExpenses.${index}.amount`) || 0}
                onAmountChange={(val) => setValue(`fixedExpenses.${index}.amount`, val)}
                onRemove={() => removeFixed(index)}
                placeholder="Ej: Renta, Comida, Transporte"
              />
            ))}
            <AddButton onClick={() => appendFixed({ name: '', amount: 0 })} label="Agregar Gasto Fijo" />
          </SectionCard>

          {/* Variable Expenses */}
          <SectionCard
            title="Gastos Variables"
            subtitle="Entretenimiento, salidas, compras opcionales"
            accent={WARNING}
            icon={<ShoppingBag size={18} color={WARNING} strokeWidth={2} />}
          >
            {variableFields.length === 0 && (
              <div style={{
                padding: '16px', background: '#f8f9fb', borderRadius: 14,
                border: '1.5px dashed #e2e8f0', textAlign: 'center',
                fontSize: 13, color: '#94a3b8', marginBottom: 14,
              }}>
                No hay gastos variables. Añade tus deseos y diversión.
              </div>
            )}
            {variableFields.map((field, index) => (
              <ExpenseRow
                key={field.id}
                nameProps={register(`variableExpenses.${index}.name`)}
                amount={watch(`variableExpenses.${index}.amount`) || 0}
                onAmountChange={(val) => setValue(`variableExpenses.${index}.amount`, val)}
                onRemove={() => removeVariable(index)}
                placeholder="Ej: Netflix, Restaurantes, Ropa"
              />
            ))}
            <AddButton onClick={() => appendVariable({ name: '', amount: 0 })} label="Agregar Gasto Variable" />
          </SectionCard>

          {/* Savings Goal */}
          <SectionCard
            title="Meta de Ahorro Mensual"
            subtitle="¿Cuánto quieres guardar cada mes?"
            accent={SUCCESS}
            icon={<PiggyBank size={18} color={SUCCESS} strokeWidth={2} />}
          >
            <NumberField
              value={watch('savingsGoal')}
              onChange={(val) => setValue('savingsGoal', val)}
              currency
              error={errors.savingsGoal?.message}
              hint="La regla 50/30/20 sugiere el 20% de tus ingresos"
            />
          </SectionCard>
        </div>

        {/* ──── RIGHT: RESULTS ──── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result ? (
            <>
              {/* KPI 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <MetricCard
                  label="Gastos Totales"
                  value={currencyMXN(result.totalExpenses)}
                  variant={result.totalExpenses > monthlyIncome ? 'danger' : 'default'}
                  icon={<CreditCard />}
                />
                <MetricCard
                  label="Ahorro Real"
                  value={currencyMXN(result.actualSavings)}
                  variant={result.meetsGoal ? 'success' : 'warning'}
                  icon={result.meetsGoal ? <TrendingUp /> : <TrendingDown />}
                />
                <MetricCard
                  label="Necesidades"
                  value={currencyMXN(result.totalFixed)}
                  variant="info"
                  icon={<Home />}
                />
                <MetricCard
                  label="Deseos"
                  value={currencyMXN(result.totalVariable)}
                  variant="default"
                  icon={<ShoppingBag />}
                />
              </div>

              {/* Income distribution bars */}
              {monthlyIncome > 0 && (
                <div style={{
                  background: 'white', borderRadius: 20,
                  border: `1px solid ${BORDER}`, padding: 24,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 4, height: 32, background: `linear-gradient(180deg, ${BLUE}, ${BLUE}88)`, borderRadius: 4 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Distribución de Ingresos</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Dónde va cada peso</div>
                    </div>
                  </div>
                  {[
                    { label: 'Gastos Fijos',     value: result.totalFixed,    color: PURPLE,  Icon: Home       },
                    { label: 'Gastos Variables',  value: result.totalVariable, color: WARNING, Icon: ShoppingBag },
                    { label: 'Ahorro',            value: result.actualSavings, color: SUCCESS, Icon: PiggyBank  },
                  ].map(({ label, value, color, Icon }) => {
                    const pct = monthlyIncome > 0 ? Math.min(100, (value / monthlyIncome) * 100) : 0;
                    return (
                      <div key={label} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Icon size={14} color={color} strokeWidth={2} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color }}>{pct.toFixed(0)}%</span>
                            <span style={{ fontSize: 12, color: MUTED }}>{currencyMXN(value)}</span>
                          </div>
                        </div>
                        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`,
                            background: `linear-gradient(90deg, ${color}80, ${color})`,
                            borderRadius: 99,
                            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 50/30/20 Chart */}
              {mode === '50/30/20' && result.breakdown && (
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
                      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Comparación 50/30/20</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>Meta vs. gasto real</div>
                    </div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <Chart
                      data={chartData}
                      type="bar"
                      xAxisKey="category"
                      lines={[
                        { dataKey: 'target', name: 'Meta', color: BLUE },
                        { dataKey: 'actual', name: 'Real', color: SUCCESS },
                      ]}
                      formatYAxis="currency"
                      height={280}
                    />
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div style={{
                  background: 'white', borderRadius: 20,
                  border: `1px solid ${BORDER}`, overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 4, height: 36, background: 'linear-gradient(180deg, #f59e0b, #f59e0baa)', borderRadius: 4 }} />
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lightbulb size={18} color={WARNING} strokeWidth={2} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Recomendaciones</div>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.recommendations.map((rec, i) => {
                      const isWarning = rec.toLowerCase().includes('alerta') || rec.toLowerCase().includes('excede') || rec.toLowerCase().includes('superior') || rec.toLowerCase().includes('reducir') || rec.toLowerCase().includes('urgente');
                      const isSuccess = rec.toLowerCase().includes('felicidades') || rec.toLowerCase().includes('excelente') || rec.toLowerCase().includes('cumple') || rec.toLowerCase().includes('perfecto');
                      type RecVariant = 'warning' | 'success' | 'info';
                      const variant: RecVariant = isWarning ? 'warning' : isSuccess ? 'success' : 'info';
                      const cfgs: Record<RecVariant, { bg: string; border: string; color: string; Icon: typeof AlertTriangle }> = {
                        warning: { bg: '#fffbeb', border: '#fde68a', color: '#92400e', Icon: AlertTriangle  },
                        success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#065f46', Icon: CheckCircle2   },
                        info:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af', Icon: Info           },
                      };
                      const c = cfgs[variant];
                      const cleanText = rec;
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12,
                          padding: '14px 16px',
                          background: c.bg, border: `1px solid ${c.border}`,
                          borderRadius: 14,
                          fontSize: 13.5, color: c.color,
                          lineHeight: 1.6, fontWeight: 500,
                        }}>
                          <c.Icon size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{cleanText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                overflow: 'hidden'
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
                    {aiAnalysis ? 'Actualizar Análisis' : 'Analizar mi Presupuesto'}
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
                    Dale clic al botón para que Billy analice tu presupuesto y te de consejos de ahorro.
                  </p>
                )}
              </div>

              <SaveRunButton
                simulatorSlug="monthly-budget"
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
              <div style={{
                width: 72, height: 72, borderRadius: 24,
                background: `linear-gradient(135deg, ${BLUE}15, ${BLUE}08)`,
                border: `1px solid ${BLUE}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CircleDollarSign size={32} color={BLUE} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Tu análisis aparecerá aquí</div>
                <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 300 }}>
                  Ingresa tu salario mensual y tus gastos a la izquierda para obtener un desglose detallado y recomendaciones personalizadas.
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
