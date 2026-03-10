'use client';

/**
 * Inflation & Purchasing Power Simulator
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { ResultsCard } from './ResultsCard';
import { SaveRunButton } from './SaveRunButton';
import { Alert } from './Alert';
import { Chart } from './Chart';
import {
  inflationCalculatorSchema,
  type InflationCalculatorInput,
  type InflationCalculatorOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateInflation } from '@/lib/simulators/engines';
import { currencyMXN, pct } from '@/lib/simulators';

export function InflationCalculatorSimulator() {
  const [result, setResult] = React.useState<InflationCalculatorOutput | null>(null);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InflationCalculatorInput>({
    resolver: zodResolver(inflationCalculatorSchema),
    defaultValues: {
      currentPrice: 0,
      inflationAnnual: 0,
      years: 1,
      currentIncome: undefined,
    },
  });

  // Load saved run if runId exists
  React.useEffect(() => {
    async function fetchRun() {
      if (!runId) return;
      try {
        const response = await fetch(`/api/simuladores/runs/${runId}`);
        const data = await response.json();
        if (response.ok && data.run) {
          reset(data.run.inputs);
        }
      } catch (err) {
        console.error('Error loading run:', err);
      }
    }
    fetchRun();
  }, [runId, reset]);

  function onSubmit(data: InflationCalculatorInput) {
    const output = calculateInflation(data);
    setResult(output);
  }

  function loadPreset() {
    const preset = PRESET_VALUES.inflationCalculator;
    Object.entries(preset).forEach(([key, value]) => {
      setValue(key as any, value);
    });
  }

  React.useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  const incomeValue = watch('currentIncome');
  const hasIncome = incomeValue !== undefined && incomeValue > 0;

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
              label="Precio Actual"
              value={watch('currentPrice')}
              onChange={(val) => setValue('currentPrice', val)}
              currency
              hint="¿Cuánto cuesta hoy?"
              error={errors.currentPrice?.message}
            />

            <NumberField
              label="Inflación Anual (%)"
              value={watch('inflationAnnual')}
              onChange={(val) => setValue('inflationAnnual', val)}
              percentage
              hint="Ej: 5 para 5% anual. Meta de Banxico es ~3%"
              error={errors.inflationAnnual?.message}
            />

            <NumberField
              label="Años a Proyectar"
              value={watch('years')}
              onChange={(val) => setValue('years', Math.round(val))}
              hint="¿Cuántos años en el futuro?"
              error={errors.years?.message}
            />

            <hr className="my-4" />

            <NumberField
              label="Ingreso Actual (Opcional)"
              value={watch('currentIncome') || 0}
              onChange={(val) => setValue('currentIncome', val > 0 ? val : undefined)}
              currency
              hint="Para calcular el ingreso necesario"
            />
          </CardContent>
        </Card>

        <Alert variant="info">
          <strong>💡 Tip:</strong> La inflación reduce tu poder adquisitivo. Si ganas lo mismo
          pero todo sube de precio, puedes comprar menos.
        </Alert>
      </div>

      {/* Right: Results */}
      <div className="space-y-4">
        {result ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultsCard
                title="Precio Futuro"
                value={currencyMXN(result.futurePrice)}
                variant="warning"
                icon="💸"
              />
              <ResultsCard
                title="Aumento"
                value={currencyMXN(result.priceIncrease)}
                subtitle={`+${pct(result.priceIncreasePercent)}`}
                variant="danger"
              />
              {result.requiredIncome && (
                <>
                  <ResultsCard
                    title="Ingreso Necesario"
                    value={currencyMXN(result.requiredIncome)}
                    variant="info"
                    hint="Para mantener poder adquisitivo"
                  />
                  <ResultsCard
                    title="Aumento Requerido"
                    value={currencyMXN(result.incomeIncrease || 0)}
                    variant="warning"
                  />
                </>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Proyección de Precios{hasIncome && ' e Ingresos'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={result.chartData}
                  type="line"
                  xAxisKey="year"
                  xAxisLabel="Año"
                  lines={[
                    { dataKey: 'price', name: 'Precio', color: '#ef4444' },
                    ...(hasIncome
                      ? [{ dataKey: 'income', name: 'Ingreso Necesario', color: '#3b82f6' }]
                      : []),
                  ]}
                  formatYAxis="currency"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ejemplo Práctico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Hoy:</strong> Un producto cuesta {currencyMXN(watch('currentPrice'))}.
                </p>
                <p>
                  <strong>En {watch('years')} {watch('years') === 1 ? 'año' : 'años'}:</strong>{' '}
                  El mismo producto costará {currencyMXN(result.futurePrice)}.
                </p>
                <p className="text-gray-600 italic">
                  Es un aumento de {currencyMXN(result.priceIncrease)} (
                  {pct(result.priceIncreasePercent)}).
                </p>
                {result.requiredIncome && (
                  <p className="mt-4 font-medium text-blue-700">
                    Si hoy ganas {currencyMXN(watch('currentIncome') || 0)}, necesitarás ganar al
                    menos {currencyMXN(result.requiredIncome)} en {watch('years')}{' '}
                    {watch('years') === 1 ? 'año' : 'años'} para mantener el mismo nivel de vida.
                  </p>
                )}
              </CardContent>
            </Card>

            <Alert variant="warning">
              <strong>📌 Importante:</strong> Estas proyecciones asumen una tasa de inflación
              constante. En la realidad, la inflación varía año con año.
            </Alert>

            <SaveRunButton
              simulatorSlug="inflation-calculator"
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
