'use client';

/**
 * Investment Comparison Simulator
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Rocket, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { ResultsCard } from './ResultsCard';
import { SaveRunButton } from './SaveRunButton';
import { Alert } from './Alert';
import { Label } from './Label';
import { Chart } from './Chart';
import {
  investmentComparisonSchema,
  type InvestmentComparisonInput,
  type InvestmentComparisonOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateInvestmentComparison } from '@/lib/simulators/engines';
import { currencyMXN } from '@/lib/simulators';

export function InvestmentComparisonSimulator() {
  const [result, setResult] = React.useState<InvestmentComparisonOutput | null>(null);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InvestmentComparisonInput>({
    resolver: zodResolver(investmentComparisonSchema),
    defaultValues: {
      initial: 0,
      monthlyContribution: 0,
      months: 12,
      rateA: 5,
      rateB: 8,
      rateC: 12,
      labelA: 'Ahorro Tradicional',
      labelB: 'CETES',
      labelC: 'Fondo de Inversión',
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
  
  function onSubmit(data: InvestmentComparisonInput) {
    const output = calculateInvestmentComparison(data);
    setResult(output);
  }
  
  function loadPreset() {
    const preset = PRESET_VALUES.investmentComparison;
    Object.entries(preset).forEach(([key, value]) => {
      setValue(key as any, value);
    });
  }
  
  function loadPresetConservative() {
    setValue('rateA', 3);
    setValue('rateB', 5);
    setValue('rateC', 7);
  }
  
  function loadPresetOptimistic() {
    setValue('rateA', 6);
    setValue('rateB', 10);
    setValue('rateC', 15);
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
            <div className="flex gap-2 flex-wrap">
              <Button onClick={loadPreset} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" /> Valores de Prueba
              </Button>
              <Button onClick={loadPresetConservative} variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" /> Conservador
              </Button>
              <Button onClick={loadPresetOptimistic} variant="outline" size="sm">
                <Rocket className="w-4 h-4 mr-2" /> Optimista
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField
              label="Inversión Inicial"
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
              label="Plazo (Meses)"
              value={watch('months')}
              onChange={(val) => setValue('months', Math.round(val))}
              error={errors.months?.message}
            />
            
            <hr className="my-4" />
            
            <div>
              <Label>Opción A</Label>
              <Input
                {...register('labelA')}
                placeholder="Nombre de la opción"
                className="mb-2"
              />
              <NumberField
                label="Tasa Anual (%)"
                value={watch('rateA')}
                onChange={(val) => setValue('rateA', val)}
                percentage
                error={errors.rateA?.message}
              />
            </div>
            
            <div>
              <Label>Opción B</Label>
              <Input
                {...register('labelB')}
                placeholder="Nombre de la opción"
                className="mb-2"
              />
              <NumberField
                label="Tasa Anual (%)"
                value={watch('rateB')}
                onChange={(val) => setValue('rateB', val)}
                percentage
                error={errors.rateB?.message}
              />
            </div>
            
            <div>
              <Label>Opción C</Label>
              <Input
                {...register('labelC')}
                placeholder="Nombre de la opción"
                className="mb-2"
              />
              <NumberField
                label="Tasa Anual (%)"
                value={watch('rateC')}
                onChange={(val) => setValue('rateC', val)}
                percentage
                error={errors.rateC?.message}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right: Results */}
      <div className="space-y-4">
        {result ? (
          <>
            <Alert variant="success">
              <Trophy className="w-5 h-5 mr-2 inline" />
              <strong>Ganador:</strong> Opción {result.winner} -{' '}
              {(result[`option${result.winner}` as keyof typeof result] as any).label}
            </Alert>
            
            <Card className={result.winner === 'A' ? 'border-2 border-green-400' : ''}>
              <CardHeader>
                <CardTitle>{result.optionA.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultsCard
                  title="Valor Final"
                  value={currencyMXN(result.optionA.futureValue)}
                  variant={result.winner === 'A' ? 'success' : 'default'}
                />
                <ResultsCard
                  title="Intereses Ganados"
                  value={currencyMXN(result.optionA.totalInterest)}
                />
              </CardContent>
            </Card>
            
            <Card className={result.winner === 'B' ? 'border-2 border-green-400' : ''}>
              <CardHeader>
                <CardTitle>{result.optionB.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultsCard
                  title="Valor Final"
                  value={currencyMXN(result.optionB.futureValue)}
                  variant={result.winner === 'B' ? 'success' : 'default'}
                />
                <ResultsCard
                  title="Intereses Ganados"
                  value={currencyMXN(result.optionB.totalInterest)}
                />
              </CardContent>
            </Card>
            
            <Card className={result.winner === 'C' ? 'border-2 border-green-400' : ''}>
              <CardHeader>
                <CardTitle>{result.optionC.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ResultsCard
                  title="Valor Final"
                  value={currencyMXN(result.optionC.futureValue)}
                  variant={result.winner === 'C' ? 'success' : 'default'}
                />
                <ResultsCard
                  title="Intereses Ganados"
                  value={currencyMXN(result.optionC.totalInterest)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comparación de Crecimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={result.chartData}
                  type="line"
                  xAxisKey="month"
                  xAxisLabel="Mes"
                  lines={[
                    { dataKey: 'optionA', name: result.optionA.label, color: '#3b82f6' },
                    { dataKey: 'optionB', name: result.optionB.label, color: '#10b981' },
                    { dataKey: 'optionC', name: result.optionC.label, color: '#f59e0b' },
                  ]}
                  formatYAxis="currency"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <SaveRunButton
              simulatorSlug="investment-comparison"
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

