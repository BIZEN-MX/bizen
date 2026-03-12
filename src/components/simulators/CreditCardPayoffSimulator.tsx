'use client';

/**
 * Credit Card Payoff: Minimum vs Fixed Simulator
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { ResultsCard } from './ResultsCard';
import { SaveRunButton } from './SaveRunButton';
import { Alert } from './Alert';
import { Chart } from './Chart';
import {
  creditCardPayoffSchema,
  type CreditCardPayoffInput,
  type CreditCardPayoffOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateCreditCardPayoff } from '@/lib/simulators/engines';
import { currencyMXN, formatMonths } from '@/lib/simulators';

export function CreditCardPayoffSimulator() {
  const [result, setResult] = React.useState<CreditCardPayoffOutput | null>(null);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreditCardPayoffInput>({
    resolver: zodResolver(creditCardPayoffSchema),
    defaultValues: {
      balance: 0,
      apr: 0,
      minPercent: 5,
      minFloor: 200,
      fixedPayment: 0,
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
  
  function onSubmit(data: CreditCardPayoffInput) {
    const output = calculateCreditCardPayoff(data);
    setResult(output);
  }
  
  function loadPreset() {
    const preset = PRESET_VALUES.creditCardPayoff;
    Object.entries(preset).forEach(([key, value]) => {
      setValue(key as any, value);
    });
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
              <FileText className="w-4 h-4 mr-2" /> Cargar Valores de Prueba
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField
              label="Saldo Actual de la Tarjeta"
              value={watch('balance')}
              onChange={(val) => setValue('balance', val)}
              currency
              error={errors.balance?.message}
            />
            
            <NumberField
              label="Tasa Anual (APR %)"
              value={watch('apr')}
              onChange={(val) => setValue('apr', val)}
              percentage
              hint="Tasa de interés anual de la tarjeta"
              error={errors.apr?.message}
            />
            
            <NumberField
              label="Porcentaje de Pago Mínimo (%)"
              value={watch('minPercent')}
              onChange={(val) => setValue('minPercent', val)}
              percentage
              hint="Típicamente 5%"
              error={errors.minPercent?.message}
            />
            
            <NumberField
              label="Pago Mínimo Base (MXN)"
              value={watch('minFloor')}
              onChange={(val) => setValue('minFloor', val)}
              currency
              hint="Pago mínimo absoluto"
              error={errors.minFloor?.message}
            />
            
            <NumberField
              label="Pago Fijo Propuesto"
              value={watch('fixedPayment')}
              onChange={(val) => setValue('fixedPayment', val)}
              currency
              hint="Pago mensual constante mayor al mínimo"
              error={errors.fixedPayment?.message}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Right: Results */}
      <div className="space-y-4">
        {result ? (
          <>
            {(result.minimumStrategy.error || result.fixedStrategy.error) && (
              <Alert variant="danger">
                {result.minimumStrategy.error || result.fixedStrategy.error}
              </Alert>
            )}
            
            <Card className="border-2 border-yellow-300 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-900">Estrategia: Pago Mínimo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultsCard
                  title="Tiempo de Pago"
                  value={formatMonths(result.minimumStrategy.months)}
                  variant="warning"
                />
                <ResultsCard
                  title="Intereses Totales"
                  value={currencyMXN(result.minimumStrategy.totalInterest)}
                  variant="warning"
                />
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-300 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900">Estrategia: Pago Fijo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultsCard
                  title="Tiempo de Pago"
                  value={formatMonths(result.fixedStrategy.months)}
                  variant="success"
                />
                <ResultsCard
                  title="Intereses Totales"
                  value={currencyMXN(result.fixedStrategy.totalInterest)}
                  variant="success"
                />
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Ahorro con Pago Fijo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultsCard
                  title="Meses Ahorrados"
                  value={result.savings.monthsSaved}
                  variant="info"
                />
                <ResultsCard
                  title="Intereses Ahorrados"
                  value={currencyMXN(result.savings.interestSaved)}
                  variant="info"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comparación de Saldos</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={result.chartData}
                  type="line"
                  xAxisKey="month"
                  xAxisLabel="Mes"
                  lines={[
                    { dataKey: 'minimumBalance', name: 'Pago Mínimo', color: '#f59e0b' },
                    { dataKey: 'fixedBalance', name: 'Pago Fijo', color: '#10b981' },
                  ]}
                  formatYAxis="currency"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <SaveRunButton
              simulatorSlug="credit-card-payoff"
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
