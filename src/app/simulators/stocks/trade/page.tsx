import { Suspense } from "react";
import { StockSimulatorContent } from "../page";

export default function TradeTerminalPage({ searchParams }: { searchParams: { symbol?: string } }) {
  return (
    <Suspense>
      <StockSimulatorContent tradeSymbol={searchParams.symbol} />
    </Suspense>
  );
}
