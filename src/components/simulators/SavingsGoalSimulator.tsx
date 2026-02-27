'use client';

/**
 * Savings Goal & Compound Interest Simulator
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberField } from './NumberField';
import { ResultsCard } from './ResultsCard';
import { SaveRunButton } from './SaveRunButton';
import { Alert } from './Alert';
import { Label } from './Label';
import { Chart } from './Chart';
import {
  savingsGoalSchema,
  type SavingsGoalInput,
  type SavingsGoalOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateSavingsGoal } from '@/lib/simulators/engines';
import { currencyMXN, formatMonths } from '@/lib/simulators';

export function SavingsGoalSimulator() {
  const [result, setResult] = React.useState<SavingsGoalOutput | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SavingsGoalInput>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      initial: 0,
      monthlyContribution: 0,
      annualRate: 0,
      mode: 'forecast',
      months: 12,
    },
  });

  const mode = watch('mode');

  function onSubmit(data: SavingsGoalInput) {
    const output = calculateSavingsGoal(data);
    setResult(output);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Input Form */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Datos de Entrada</CardTitle>
            <Button onClick={loadPreset} variant="outline" size="sm">
              📝 Cargar Valores de Prueba
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField
              label="Monto Inicial"
              value={watch('initial')}
              onChange={(val) => setValue('initial', val)}
              currency
              error={errors.initial?.message}
            />

            <NumberField
              label="Aportación Mensual"
              value={watch('monthlyContribution')}
              onChange={(val) => setValue('monthlyContribution', val)}
              currency
              error={errors.monthlyContribution?.message}
            />

            <NumberField
              label="Tasa Anual (%)"
              value={watch('annualRate')}
              onChange={(val) => setValue('annualRate', val)}
              percentage
              hint="Ej: 8 para 8% anual"
              error={errors.annualRate?.message}
            />

            <div>
              <Label>Modo de Cálculo</Label>
              <select
                {...register('mode')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-[#FBFAF5] px-3 py-2 text-sm"
              >
                <option value="forecast">Pronóstico (calcular valor futuro)</option>
                <option value="time-to-goal">Tiempo a Meta (calcular meses)</option>
              </select>
            </div>

            {mode === 'forecast' && (
              <NumberField
                label="Número de Meses"
                value={watch('months') || 0}
                onChange={(val) => setValue('months', val)}
                error={errors.months?.message}
              />
            )}

            {mode === 'time-to-goal' && (
              <NumberField
                label="Meta a Alcanzar"
                value={watch('targetAmount') || 0}
                onChange={(val) => setValue('targetAmount', val)}
                currency
                error={errors.targetAmount?.message}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Results */}
      <div className="space-y-4">
        {result ? (
          <>
            {result.error && (
              <Alert variant="warning">{result.error}</Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultsCard
                title="Valor Futuro"
                value={currencyMXN(result.futureValue)}
                variant="success"
                icon="💰"
              />
              <ResultsCard
                title="Total Aportado"
                value={currencyMXN(result.totalContributions)}
              />
              <ResultsCard
                title="Interés Ganado"
                value={currencyMXN(result.totalInterest)}
                variant="info"
                icon="📈"
              />
              {result.months !== undefined && (
                <ResultsCard
                  title="Tiempo"
                  value={formatMonths(result.months)}
                  icon="⏱️"
                />
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Crecimiento del Ahorro</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={result.chartData}
                  type="line"
                  xAxisKey="month"
                  xAxisLabel="Mes"
                  lines={[
                    { dataKey: 'balance', name: 'Saldo Total', color: '#3b82f6' },
                    { dataKey: 'contributions', name: 'Aportaciones', color: '#10b981' },
                    { dataKey: 'interest', name: 'Intereses', color: '#f59e0b' },
                  ]}
                  formatYAxis="currency"
                  height={300}
                />
              </CardContent>
            </Card>

            <SaveRunButton
              simulatorSlug="savings-goal"
              inputs={watch()}
              outputs={result}
            />
          </>
        ) : (
          <Alert variant="info">
            Completa los campos de entrada para ver los resultados.
          </Alert>
        )}
      </div>
    </div>
  );
}

