# BIZEN Educational Simulators

## 1. Stock Market Simulator
A simple End-of-Day (EOD) market simulator allowing students to buy and sell stocks and ETFs using virtual currency.

### Running Locally
The user interface is accessible at:
`http://localhost:3004/simulators/stocks`

The simulator relies on two API endpoints:
- `GET /api/simulators/stocks/portfolio`: Fetches the user's cash balance, current holdings, and order history. Initializes an account with $10,000 USD if it doesn't exist.
- `POST /api/simulators/stocks/orders`: Endpoint to place market or limit orders. (Example payload: `{ "symbol": "VOO", "side": "buy", "order_type": "market", "quantity": 10 }`)

### How to Seed Sample EOD Prices
The simulator execution engine relies on the `market_prices_eod` table. You should create a cron job or scheduled edge function to fetch real EOD prices (e.g., from Yahoo Finance or Polygon.io) each day after market close.

To insert dummy data to test the execution engine:

```sql
INSERT INTO market_prices_eod (symbol, date, open, high, low, close, volume)
VALUES 
('VOO', '2026-03-11', 450.00, 455.00, 448.00, 452.50, 1000000),
('AAPL', '2026-03-11', 170.00, 172.50, 169.00, 171.00, 50000000);
```

### Order Execution
The `api/simulators/stocks/execute` endpoint acts as the transaction engine. It should be triggered once daily:
```bash
curl -X POST http://localhost:3004/api/simulators/stocks/execute \
     -H "Authorization: Bearer dev-secret-key"
```
It will process all pending rows in `simulator_orders` based on the most recent EOD prices.

---

## 2. Credit Simulator
An interactive tool teaching the mechanics of Credit Cards, Personal Loans, and Installments (MSI).

### Running Locally
Accessible at:
`http://localhost:3004/simulators/credit`

Calculations are deterministic and happen purely via utility functions exported from `src/lib/creditSimulator.ts`. There are no required database reads/writes for the simulation execution itself, making it highly responsive.

---

## 3. BIZEN Readiness Score
A comprehensive score tracking the student's holistic financial preparation.

- **Logging events:** Call `logReadinessEvent()` from `src/lib/readinessScore.ts` whenever the user passes a diagnostic quiz, completes a simulator challenge, or makes a good decision.
- **Reading score:** `GET /api/user/readiness` calculates the score on the fly and returns an explainable JSON with reasons for each change.
