  const renderBizenTerminal = () => {
    return (
      <>
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          
          /* Bloqueo total de scroll cuando el terminal está activo */
          html, body {
            overflow: hidden !important;
            height: 100% !important;
            position: fixed !important;
            width: 100% !important;
          }
        `}</style>
                
                <AnimatePresence>
                  {orderForm.symbol && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100dvh",
                        backgroundColor: "#060d1f",
                        backdropFilter: "none",
                        zIndex: 99999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        margin: 0,
                        overflow: "hidden",
                      }}
                      onClick={() => {
                        if (tradeSymbol) { router.push("/simulators/stocks"); }
                        else { setOrderForm((f) => ({ ...f, symbol: "" })); }
                      }}
                    >
                      <motion.div
                        ref={orderFormRef}
                        className="order-panel"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ type: "spring", stiffness: 280, damping: 30 }}
                        style={{
                          width: "100vw",
                          height: "100%",
                          maxHeight: "100%",
                          background: "#060d1f",
                          display: "flex",
                          overflow: "hidden",
                          position: "relative",
                          margin: 0,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* ── CLOSE BUTTON ─────────────────────────── */}
                        <button
                          onClick={() => {
                            if (tradeSymbol) { router.push("/simulators/stocks"); }
                            else { setOrderForm((f) => ({ ...f, symbol: "" })); }
                          }}
                          style={{
                            position: "absolute",
                            top: 18,
                            right: 22,
                            zIndex: 100,
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.7)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                        >
                          <X size={16} />
                        </button>

                        {/* ── LEFT COLUMN: Market Data ─────────────── */}
                        <div
                          style={{
                            flex: "1 1 60%",
                            overflowY: "auto",
                            overscrollBehavior: "contain",
                            padding: "28px 32px",
                            borderRight: "1px solid rgba(255,255,255,0.07)",
                          }}
                          className="no-scrollbar"
                        >

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 28,
                          }}
                        >
                          {/* BIZEN Terminal branding */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>BIZEN Terminal</span>
                          </div>
                          <div style={{ flex: 1 }} />
                          {/* Stock badge */}
                          {orderForm.symbol && (() => {
                            const s = processedMarketData.find((st: any) => st.symbol === orderForm.symbol);
                            if (!s) return null;
                            const chg = s.changePercent ?? 0;
                            return (
                              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", padding: "8px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                                <StockLogo symbol={s.symbol} size={22} />
                                <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{s.symbol}</span>
                                <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.03em" }}>
                                  bz {(s.price * 1).toFixed(0)}
                                </span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: chg >= 0 ? "#10b981" : "#ef4444", padding: "3px 8px", background: chg >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", borderRadius: 6 }}>
                                  {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
                                </span>
                              </div>
                            );
                          })()}
                        </div>


                        {orderForm.symbol && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              background: "rgba(255,255,255,0.05)",
                              padding: "10px 16px",
                              borderRadius: 16,
                              border: "1px solid rgba(255,255,255,0.1)",
                              marginBottom: 24,
                            }}
                          >
                        {(() => {
                          const s = processedMarketData.find(
                            (st) => st.symbol === orderForm.symbol,
                          );
                          if (!s) return null;
                          return (
                            <>
                              <StockLogo symbol={s.symbol} size={28} />
                              <span
                                style={{
                                  fontSize: 13,
                                  color: "rgba(255,255,255,0.6)",
                                }}
                              >
                                {s.name}
                              </span>
                              <span
                                style={{
                                  fontSize: 18,
                                  fontWeight: 700,
                                  color: "#10b981",
                                }}
                              >
                                    bz {(s.price * 1).toFixed(0)} <BizcoinIcon size={18} style={{ marginLeft: 4 }} />
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}

                  {/* ====== PILAR 2: ANÁLISIS FUNDAMENTAL ====== */}
                  <FundamentalAnalysisPanel 
                    symbol={orderForm.symbol} 
                    currentPrice={processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0} 
                  />
                  {/* ====== END PILAR 2 ====== */}

                  {/* ====== PROFESSIONAL CHART PANEL ====== */}
                  <div
                    style={{
                      marginBottom: 24,
                      background: "#0f172a",
                      borderRadius: 20,
                      padding: 20,
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* Chart Header Controls */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                      {/* Time Range */}
                      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3 }}>
                        {["1d", "5d", "1m", "6m", "max"].map((r) => (
                          <button
                            key={r}
                            onClick={() => setHistoryRange(r)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 7,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                              border: "none",
                              textTransform: "uppercase" as const,
                              background: historyRange === r ? "#10b981" : "transparent",
                              color: historyRange === r ? "white" : "rgba(255,255,255,0.4)",
                              transition: "all 0.2s",
                              fontFamily: "inherit",
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>

                      {/* Chart Type + Indicators */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {/* Area / Candle toggle */}
                        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 2 }}>
                          {(["area", "candle"] as const).map(type => (
                            <button
                              key={type}
                              onClick={() => setChartType(type)}
                              style={{
                                padding: "4px 12px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                                border: "none",
                                fontFamily: "inherit",
                                background: chartType === type ? "rgba(59,130,246,0.3)" : "transparent",
                                color: chartType === type ? "#93c5fd" : "rgba(255,255,255,0.35)",
                              }}
                            >
                              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                {type === "area" ? <LineChart size={12} /> : <CandlestickChart size={12} />}
                                {type === "area" ? "Área" : "Velas"}
                              </span>
                            </button>
                          ))}
                        </div>
                        {/* SMA Toggle */}
                        <button
                          onClick={() => setShowSMA(v => !v)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: `1px solid ${showSMA ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.1)"}`,
                            background: showSMA ? "rgba(251,191,36,0.15)" : "transparent",
                            color: showSMA ? "#fbbf24" : "rgba(255,255,255,0.4)",
                            fontFamily: "inherit",
                          }}
                        >
                          SMA 20
                        </button>
                        {/* EMA Toggle */}
                        <button
                          onClick={() => setShowEMA(v => !v)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: `1px solid ${showEMA ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.1)"}`,
                            background: showEMA ? "rgba(167,139,250,0.15)" : "transparent",
                            color: showEMA ? "#a78bfa" : "rgba(255,255,255,0.4)",
                            fontFamily: "inherit",
                          }}
                        >
                          EMA 14
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    {(showSMA || showEMA) && (
                      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        {showSMA && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 24, height: 2, background: "#fbbf24", borderRadius: 2 }} />
                            <span style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700 }}>SMA 20</span>
                          </div>
                        )}
                        {showEMA && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 24, height: 2, background: "#a78bfa", borderRadius: 2 }} />
                            <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700 }}>EMA 14</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chart */}
                    <div style={{ height: 220, width: "100%", opacity: fetchingHistory ? 0.3 : 1, transition: "opacity 0.2s" }}>
                      {enrichedHistory.length > 0 && (
                        <TradingViewChart 
                          data={enrichedHistory} 
                          chartType={chartType} 
                          showSMA={showSMA} 
                          showEMA={showEMA} 
                        />
                      )}
                    </div>
                  </div>
                  {/* ====== END CHART PANEL ====== */}



                  {/* ====== PILAR 3: ORDER BOOK ====== */}
                  {orderBook.length > 0 && <OrderBookPanel orderBook={orderBook} />}
                  {/* ====== END PILAR 3 ====== */}

                  {/* Company News Section */}
                  <CompanyNewsPanel symbol={orderForm.symbol} fetchingStockNews={fetchingStockNews} stockNews={stockNews} />
                        </div>

                        {/* ── RIGHT COLUMN: Order Form ─────────────── */}
                        <div
                          style={{
                            flex: "0 0 420px",
                            overflowY: "auto",
                            overscrollBehavior: "contain",
                            padding: "28px 28px",
                            background: "linear-gradient(180deg,#0a1628 0%,#0d1b2e 100%)",
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: 0,
                          }}
                          className="no-scrollbar"
                        >
                          {/* Right column header */}
                          <div style={{ marginBottom: 24, paddingRight: 44 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 6 }}>Nueva Orden</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>
                              {orderForm.symbol || "—"}
                              {(() => {
                                const d = processedMarketData.find((s: any) => s.symbol === orderForm.symbol);
                                if (!d) return null;
                                const chg = d.changePercent ?? 0;
                                return (
                                  <span style={{ fontSize: 13, fontWeight: 600, color: chg >= 0 ? "#10b981" : "#ef4444", marginLeft: 10 }}>
                                    {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
                                  </span>
                                );
                              })()}
                            </div>
                            {(() => {
                              const d = processedMarketData.find((s: any) => s.symbol === orderForm.symbol);
                              if (!d) return null;
                              return <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{d.name}</div>;
                            })()}
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
                              gap: 16,
                              marginBottom: 20,
                            }}
                          >
                    {/* Symbol */}

                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#64748b",
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Símbolo
                      </label>
                      <select
                        value={orderForm.symbol}
                        onChange={(e) =>
                          setOrderForm((f) => ({
                            ...f,
                            symbol: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          height: 48,
                          padding: "0 14px",
                          background: "rgba(255,255,255,0.07)",
                          border: "1.5px solid rgba(255,255,255,0.12)",
                          borderRadius: 12,
                          color: "white",
                          fontSize: 15,
                          fontWeight: 500,
                          fontFamily: "inherit",
                          outline: "none",
                          cursor: "pointer",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#10b981")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            "rgba(255,255,255,0.12)")
                        }
                      >
                        {processedMarketData.map((s) => (
                          <option
                            key={s.symbol}
                            value={s.symbol}
                            style={{ background: "#1e293b", color: "white" }}
                          >
                            {s.symbol} — {s.name?.slice(0, 22)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Side */}
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#64748b",
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Dirección
                      </label>
                      <div style={{ display: "flex", gap: 8, height: 48 }}>
                        {(["buy", "sell"] as const).map((side) => (
                          <button
                            key={side}
                            onClick={() =>
                              setOrderForm((f) => ({ ...f, side }))
                            }
                            style={{
                              flex: 1,
                              border: "none",
                              borderRadius: 12,
                              fontWeight: 500,
                              fontSize: 13,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              height: "100%",
                              transition: "all 0.2s",
                              background:
                                orderForm.side === side
                                  ? side === "buy"
                                    ? "linear-gradient(135deg,#10b981,#059669)"
                                    : "linear-gradient(135deg,#ef4444,#dc2626)"
                                  : "rgba(255,255,255,0.07)",
                              color:
                                orderForm.side === side ? "white" : "#64748b",
                              boxShadow:
                                orderForm.side === side
                                  ? side === "buy"
                                    ? "0 4px 12px rgba(16,185,129,0.4)"
                                    : "0 4px 12px rgba(239,68,68,0.4)"
                                  : "none",
                            }}
                          >
                            {side === "buy" ? "▲ Comprar" : "▼ Vender"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount to Invest */}
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#64748b",
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.07em",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        {orderForm.side === "buy"
                          ? "Monto a Invertir (bz)"
                          : "Monto a Vender (equiv. bz)"}
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          min={1}
                          step={100}
                          value={orderForm.amount}
                          onChange={(e) =>
                            setOrderForm((f) => ({
                              ...f,
                              amount: Number(e.target.value),
                            }))
                          }
                          style={{
                            width: "100%",
                            boxSizing: "border-box" as const,
                            height: 48,
                            padding: "0 14px",
                            background: "rgba(255,255,255,0.07)",
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            borderRadius: 12,
                            color: "white",
                            fontSize: 18,
                            fontWeight: 700,
                            fontFamily: "inherit",
                            outline: "none",
                            transition: "all 0.2s",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#10b981";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(16,185,129,0.15)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor =
                              "rgba(255,255,255,0.12)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "rgba(255,255,255,0.3)",
                            pointerEvents: "none",
                            fontWeight: 800,
                          }}
                        >
                          bz
                        </div>
                      </div>

                      {/* Quick preset buttons */}
                      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                        {[{ label: "25%", pct: 0.25 }, { label: "50%", pct: 0.5 }, { label: "75%", pct: 0.75 }, { label: "Máx", pct: 1.0 }].map(({ label, pct }) => (
                          <button
                            key={label}
                            onClick={() => setOrderForm(f => ({ ...f, amount: Math.floor(cash * pct) }))}
                            style={{
                              flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11, fontWeight: 700,
                              cursor: "pointer", fontFamily: "inherit",
                              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)",
                              transition: "all 0.15s"
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Live cost estimator */}
                      {orderForm.qty > 0 && (() => {
                        const stockPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;
                        const totalCost = orderForm.amount * 1.001;
                        return (
                          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Recibirás ~</span>
                              <span style={{ fontSize: 14, fontWeight: 800, color: "#10b981" }}>{orderForm.qty.toFixed(4)} {orderForm.symbol}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Total con comisión (0.1%)</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>bz {totalCost.toFixed(0)}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* ====== STOP-LOSS / TAKE-PROFIT PANEL ====== */}
                  {orderForm.side === "buy" && (() => {
                    const currentPrice = processedMarketData.find(s => s.symbol === orderForm.symbol)?.price ?? 0;
                    const slVal = parseFloat(stopLoss);
                    const tpVal = parseFloat(takeProfit);
                    const slPct = currentPrice > 0 && slVal > 0 ? ((slVal - currentPrice) / currentPrice * 100).toFixed(1) : null;
                    const tpPct = currentPrice > 0 && tpVal > 0 ? ((tpVal - currentPrice) / currentPrice * 100).toFixed(1) : null;
                    return (
                      <div style={{ marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                          <Shield size={14} color="#94a3b8" />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                            Protección: Stop-Loss / Take-Profit
                          </span>
                          <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>(Opcional)</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          {/* Stop-Loss */}
                          <div>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase" as const, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                              <AlertCircle size={11} /> Stop-Loss (bz)
                            </label>
                            <div style={{ position: "relative" }}>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                placeholder={currentPrice > 0 ? `ej. ${(currentPrice * 0.95).toFixed(0)}` : "Precio"}
                                value={stopLoss}
                                onChange={e => setStopLoss(e.target.value)}
                                style={{
                                  width: "100%", boxSizing: "border-box" as const, height: 44, padding: "0 12px",
                                  background: stopLoss ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                                  border: stopLoss ? "1.5px solid rgba(239,68,68,0.4)" : "1.5px solid rgba(255,255,255,0.1)",
                                  borderRadius: 10, color: "white", fontSize: 14, fontWeight: 600,
                                  fontFamily: "inherit", outline: "none",
                                }}
                              />
                            </div>
                            {slPct && (
                              <div style={{ fontSize: 10, color: parseFloat(slPct) < 0 ? "#ef4444" : "#f59e0b", marginTop: 5, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                {parseFloat(slPct) < 0
                                  ? <><ArrowDown size={10} /> Pérdida máx: {slPct}%</>
                                  : <><AlertTriangle size={10} /> S/L está por encima del precio actual</>
                                }
                              </div>
                            )}
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 5 }}>
                              <Info size={10} style={{ flexShrink: 0, marginTop: 1 }} /> Venta automática si el precio cae para limitar pérdidas
                            </div>
                          </div>
                          {/* Take-Profit */}
                          <div>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "#10b981", textTransform: "uppercase" as const, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                              <Target size={11} /> Take-Profit (bz)
                            </label>
                            <div style={{ position: "relative" }}>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                placeholder={currentPrice > 0 ? `ej. ${(currentPrice * 1.10).toFixed(0)}` : "Precio"}
                                value={takeProfit}
                                onChange={e => setTakeProfit(e.target.value)}
                                style={{
                                  width: "100%", boxSizing: "border-box" as const, height: 44, padding: "0 12px",
                                  background: takeProfit ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.05)",
                                  border: takeProfit ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid rgba(255,255,255,0.1)",
                                  borderRadius: 10, color: "white", fontSize: 14, fontWeight: 600,
                                  fontFamily: "inherit", outline: "none",
                                }}
                              />
                            </div>
                            {tpPct && (
                              <div style={{ fontSize: 10, color: parseFloat(tpPct) > 0 ? "#10b981" : "#f59e0b", marginTop: 5, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                {parseFloat(tpPct) > 0
                                  ? <><ArrowUp size={10} /> Ganancia objetivo: +{tpPct}%</>
                                  : <><AlertTriangle size={10} /> T/P está por debajo del precio actual</>
                                }
                              </div>
                            )}
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 5 }}>
                              <Info size={10} style={{ flexShrink: 0, marginTop: 1 }} /> Venta automática al alcanzar tu objetivo de ganancia
                            </div>
                          </div>
                        </div>
                        {/* Risk/Reward Ratio */}
                        {slVal > 0 && tpVal > 0 && currentPrice > 0 && (
                          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Ratio Riesgo/Beneficio</span>
                              <span style={{ fontSize: 13, fontWeight: 800, color: (() => {
                                const risk = Math.abs(currentPrice - slVal);
                                const reward = Math.abs(tpVal - currentPrice);
                                const ratio = risk > 0 ? reward / risk : 0;
                                return ratio >= 2 ? "#10b981" : ratio >= 1 ? "#f59e0b" : "#ef4444";
                              })() }}>
                                1 : {(() => {
                                  const risk = Math.abs(currentPrice - slVal);
                                  const reward = Math.abs(tpVal - currentPrice);
                                  return risk > 0 ? (reward / risk).toFixed(2) : "—";
                                })()}
                              </span>
                            </div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                              Los profesionales buscan un ratio mínimo de 1:2 (ganar el doble de lo que arrriesgan)
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {/* ====== END SL/TP PANEL ====== */}

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 1.5,
                          background: "currentColor",
                        }}
                      />
                      Paso Final: Confirma tu operación
                    </div>
                    {/* Journal Note */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Info size={11} /> Bitácora — ¿Por qué haces esta operación? (opcional)
                      </label>
                      <textarea
                        value={journalNote}
                        onChange={e => setJournalNote(e.target.value)}
                        placeholder="Ej: NVDA tiene catalizadores de IA, el P/E bajó a 54x y el soporte técnico aguantó…"
                        rows={2}
                        style={{
                          width: "100%", boxSizing: "border-box" as const,
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10, color: "rgba(255,255,255,0.8)", fontSize: 12,
                          padding: "10px 14px", fontFamily: "inherit", outline: "none",
                          resize: "vertical" as const, lineHeight: 1.5,
                        }}
                      />
                    </div>

                    <button
                      onClick={placeOrder}

                      disabled={placing}
                      className={
                        !placing && orderForm.qty > 0 ? "pulsing-order-btn" : ""
                      }
                      style={{
                        width: "100%",
                        padding: "18px 32px",
                        background: placing
                          ? "#334155"
                          : orderForm.side === "buy"
                            ? "linear-gradient(135deg,#10b981,#059669)"
                            : "linear-gradient(135deg,#ef4444,#dc2626)",
                        color: "white",
                        border: "none",
                        borderRadius: 16,
                        fontWeight: 800,
                        cursor: placing ? "not-allowed" : "pointer",
                        fontSize: 16,
                        fontFamily: "inherit",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        boxShadow: placing
                          ? "none"
                          : orderForm.side === "buy"
                            ? "0 10px 25px rgba(16,185,129,0.35)"
                            : "0 10px 25px rgba(239,68,68,0.35)",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!placing) {
                          (e.currentTarget as HTMLElement).style.transform =
                            "translateY(-2px)";
                          (e.currentTarget as HTMLElement).style.filter =
                            "brightness(1.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform =
                          "translateY(0)";
                        (e.currentTarget as HTMLElement).style.filter = "none";
                      }}
                    >
                      {placing ? (
                        <>
                          <RefreshCw
                            size={20}
                            style={{ animation: "spin 1s linear infinite" }}
                          />{" "}
                          Enviando orden...
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          {orderForm.side === "buy"
                            ? `Confirmar Compra de ${orderForm.symbol} ahora`
                            : `Confirmar Venta de ${orderForm.symbol} ahora`}
                        </>
                      )}
                    </button>
                  </div>

                  {orderMsg && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: "14px 18px",
                        borderRadius: 12,
                        background:
                          orderMsg.type === "ok"
                            ? "rgba(16,185,129,0.12)"
                            : "rgba(239,68,68,0.12)",
                        border: `1.5px solid ${orderMsg.type === "ok" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      {orderMsg.type === "ok" ? (
                        <CheckCircle2
                          size={16}
                          color="#10b981"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />
                      ) : (
                        <AlertTriangle
                          size={16}
                          color="#ef4444"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />
                      )}
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: orderMsg.type === "ok" ? "#6ee7b7" : "#fca5a5",
                          lineHeight: 1.6,
                        }}
                      >
                        {orderMsg.text}
                      </p>
                    </div>
                  )}
                        </div>
                      </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Card Animation Overlay (Duplicate for Terminal) */}
          <AnimatePresence>
            {showCardAnim && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0B1E5E]/40 backdrop-blur-md flex items-center justify-center z-[9999] p-6"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 1.1, y: -40, opacity: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-full max-w-[460px] relative"
                >
                  <div className="absolute -top-[100px] left-0 right-0 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/10 border border-white/20 shadow-md rounded-2xl px-6 py-3 inline-flex items-center gap-3 backdrop-blur-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Zap size={22} className="text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <p className="m-0 text-[13px] font-extrabold text-emerald-500 uppercase tracking-wide">
                          Transacción en Proceso
                        </p>
                        <p className="m-0 text-[16px] font-bold text-white">
                          {animOrder?.side === "buy" ? "Comprando" : "Vendiendo"}{" "}
                          {animOrder?.qty} {animOrder?.symbol}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <BizenVirtualCard
                    bizcoins={Number(dbProfile?.bizcoins || 0)}
                    holderName={
                      dbProfile?.fullName ||
                      user?.user_metadata?.full_name ||
                      "Usuario Bizen"
                    }
                    colorTheme={(dbProfile?.cardTheme as any) || "blue"}
                    level={dbProfile?.level || 1}
                    hideButtons={true}
                  />

                  {/* Deduction Value Float */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [-20, -120] }}
                    transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[48px] font-black drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap z-20 ${animOrder?.side === "buy" ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {animOrder?.side === "buy" ? "-" : "+"}
                    {Math.floor(animOrder?.cost || 0).toLocaleString()} bz
                  </motion.div>

                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => setShowCardAnim(false)}
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-12 py-4 rounded-[20px] text-[16px] font-bold cursor-pointer backdrop-blur-md transition-all duration-200"
                    >
                      Entendido
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    };

  if (tradeSymbol) return renderBizenTerminal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

        /* ── Base Reset ─────────────────────────────── */
        * { box-sizing: border-box; }

        /* ── Keyframes ──────────────────────────────── */
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes staggerFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes numberGlow { 0%,100%{opacity:1} 50%{opacity:0.6;filter:brightness(1.3)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .bizen-ticker-track { animation: tickerScroll 90s linear infinite; display:flex; gap:0; will-change:transform; }
        .bizen-ticker-track:hover { animation-play-state: paused; }
        .bizen-ticker-bar { overflow:hidden; position:relative; }
        .bizen-ticker-bar::before, .bizen-ticker-bar::after {
          content:''; position:absolute; top:0; bottom:0; width:48px; z-index:2; pointer-events:none;
        }
        .bizen-ticker-bar::before { left:0;  background: linear-gradient(to right,  #0B1E5E, transparent); }
        .bizen-ticker-bar::after  { right:0; background: linear-gradient(to left,   #0B1E5E, transparent); }

        /* Price flash: green up */
        @keyframes priceUp {
          0%  { background: rgba(16,185,129,0); color: inherit; }
          20% { background: rgba(16,185,129,0.18); color: #10b981; transform: scale(1.04); }
          100%{ background: rgba(16,185,129,0); color: inherit; transform: scale(1); }
        }
        /* Price flash: red down */
        @keyframes priceDown {
          0%  { background: rgba(239,68,68,0); color: inherit; }
          20% { background: rgba(239,68,68,0.18); color: #ef4444; transform: scale(1.04); }
          100%{ background: rgba(239,68,68,0); color: inherit; transform: scale(1); }
        }
        .price-flash-up   { animation: priceUp   0.7s ease; border-radius: 6px; }
        .price-flash-down { animation: priceDown  0.7s ease; border-radius: 6px; }

        /* Live badge breathe */
        @keyframes liveBreathe {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50%     { opacity:0.85; box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }
        .live-badge { animation: liveBreathe 2s ease-in-out infinite; }

        /* Order book row micro-flash */
        @keyframes bookFlicker {
          0%  { opacity:1; }
          35% { opacity:0.55; }
          100%{ opacity:1; }
        }
        .book-row-update { animation: bookFlicker 0.5s ease; }

        /* Tab entrance */
        @keyframes tabEnter {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .tab-content-enter { animation: tabEnter 0.28s cubic-bezier(0.22,1,0.36,1) both; }

        /* Stat card shimmer on hover */
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        /* Crisis pulse */
        @keyframes crisisPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70%     { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
        }

        /* Neon & pulse glow */
        @keyframes neonPulse {
          0%,100% { box-shadow: 0 0 8px rgba(249,115,22,0.4), 0 0 20px rgba(249,115,22,0.2); }
          50%     { box-shadow: 0 0 16px rgba(249,115,22,0.7), 0 0 40px rgba(249,115,22,0.4); }
        }
        @keyframes pulseGlow {
          0%   { transform: scale(1);    box-shadow: 0 0 10px rgba(249,115,22,0.5), 0 4px 14px rgba(249,115,22,0.3); }
          50%  { transform: scale(1.03); box-shadow: 0 0 24px rgba(249,115,22,0.8), 0 6px 25px rgba(249,115,22,0.5); }
          100% { transform: scale(1);    box-shadow: 0 0 10px rgba(249,115,22,0.5), 0 4px 14px rgba(249,115,22,0.3); }
      `}</style>
      <div style={{ padding: 20, color: "white" }}>Terminal Trade Panel Missing Rest of File</div>
    </>
  );
}
