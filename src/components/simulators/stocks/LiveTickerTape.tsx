"use client";

import React, { useEffect, useState } from "react";
import { TickerTape } from "./TickerTape";

type Quote = {
  symbol: string;
  price: number | null;
  changePercent: number;
};

export function LiveTickerTape() {
  const [data, setData] = useState<Quote[]>([]);

  useEffect(() => {
    fetch("/api/ticker")
      .then((r) => r.json())
      .then((d: Quote[]) => setData(d))
      .catch(() => setData([])); // falls back to TICKER_STOCKS inside TickerTape
  }, []);

  return <TickerTape marketData={data} />;
}
