import { Suspense } from "react";
import { StockSimulatorContent } from "../../page";

export default async function TradeTerminalPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense>
      <StockSimulatorContent tradeSymbol={resolvedParams.symbol} />
    </Suspense>
  );
}
