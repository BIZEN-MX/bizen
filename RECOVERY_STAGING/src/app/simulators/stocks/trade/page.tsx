import { Suspense } from "react";
import { StockSimulatorContent } from "../page";

export default async function TradeTerminalPage({ searchParams }: { searchParams: Promise<{ symbol?: string }> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense>
      <StockSimulatorContent tradeSymbol={resolvedSearchParams.symbol} />
    </Suspense>
  );
}
