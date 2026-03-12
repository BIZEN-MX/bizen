'use client';

/**
 * Simple Loan / Microcredit Simulator
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NumberField } from './NumberField';
import { ResultsCard } from './ResultsCard';
import { SaveRunButton } from './SaveRunButton';
import { Alert } from './Alert';
import {
  simpleLoanSchema,
  type SimpleLoanInput,
  type SimpleLoanOutput,
  PRESET_VALUES,
} from '@/lib/simulators/schemas';
import { calculateSimpleLoan } from '@/lib/simulators/engines';
import { currencyMXN, pct } from '@/lib/simulators';

export function SimpleLoanSimulator() {
  const [result, setResult] = React.useState<SimpleLoanOutput | null>(null);
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SimpleLoanInput>({
    resolver: zodResolver(simpleLoanSchema) as any,
    defaultValues: {
      principal: 0,
      apr: 0,
      termMonths: 12,
      upfrontFees: 0,
      monthlyFees: 0,
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

  function onSubmit(data: SimpleLoanInput) {
    const output = calculateSimpleLoan(data);
    setResult(output);
  }

  function loadPreset() {
    const preset = PRESET_VALUES.simpleLoan;
    Object.entries(preset).forEach(([key, value]) => {
      setValue(key as any, value);
    });
  }

  React.useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit as any)());
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
              label="Monto del Préstamo"
              value={watch('principal')}
              onChange={(val) => setValue('principal', val)}
              currency
              error={errors.principal?.message}
            />

            <NumberField
              label="Tasa Anual (APR %)"
              value={watch('apr')}
              onChange={(val) => setValue('apr', val)}
              percentage
              hint="Tasa de interés anual"
              error={errors.apr?.message}
            />

            <NumberField
              label="Plazo (Meses)"
              value={watch('termMonths')}
              onChange={(val) => setValue('termMonths', Math.round(val))}
              error={errors.termMonths?.message}
            />

            <NumberField
              label="Comisiones por Apertura"
              value={watch('upfrontFees')}
              onChange={(val) => setValue('upfrontFees', val)}
              currency
              hint="Pago único al inicio"
              error={errors.upfrontFees?.message}
            />

            <NumberField
              label="Comisiones Mensuales"
              value={watch('monthlyFees')}
              onChange={(val) => setValue('monthlyFees', val)}
              currency
              hint="Costo adicional cada mes"
              error={errors.monthlyFees?.message}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right: Results */}
      <div className="space-y-4">
        {result ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultsCard
                title="Pago Mensual"
                value={currencyMXN(result.monthlyPayment)}
                variant="info"
                icon="💵"
              />
              <ResultsCard
                title="CAT Aproximado"
                value={pct(result.cat)}
                variant="warning"
                hint="Costo Anual Total"
              />
              <ResultsCard
                title="Intereses Totales"
                value={currencyMXN(result.totalInterest)}
              />
              <ResultsCard
                title="Costo Total"
                value={currencyMXN(result.totalCost)}
                variant="danger"
                hint="Incluye capital + intereses + comisiones"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tabla de Amortización</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Mes</th>
                        <th className="p-2 text-right">Pago</th>
                        <th className="p-2 text-right">Interés</th>
                        <th className="p-2 text-right">Capital</th>
                        <th className="p-2 text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortizationTable.slice(0, 12).map((row) => (
                        <tr key={row.month} className="border-b hover:bg-gray-50">
                          <td className="p-2">{row.month}</td>
                          <td className="p-2 text-right">{currencyMXN(row.payment, 0)}</td>
                          <td className="p-2 text-right text-red-600">
                            {currencyMXN(row.interest, 0)}
                          </td>
                          <td className="p-2 text-right text-green-600">
                            {currencyMXN(row.principal, 0)}
                          </td>
                          <td className="p-2 text-right font-semibold">
                            {currencyMXN(row.balance, 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.amortizationTable.length > 12 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Mostrando primeros 12 meses de {result.amortizationTable.length} total
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Alert variant="info">
              <strong>¿Qué es el CAT?</strong> El Costo Anual Total (CAT) incluye intereses y
              comisiones, mostrando el costo real del crédito. Entre menor CAT, mejor para ti.
            </Alert>

            <SaveRunButton
              simulatorSlug="simple-loan"
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
