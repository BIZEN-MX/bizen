import { Suspense } from "react";
import { StockSimulatorContent } from "../../page";

export default function TradeTerminalPage({ params }: { params: { symbol: string } }) {
  return (
    <Suspense>
      <StockSimulatorContent tradeSymbol={params.symbol} />
    </Suspense>
  );
}
