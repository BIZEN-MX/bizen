# Arquitectura del Módulo de Simuladores Financieros

De acuerdo al Backlog Técnico (ÉPICA 3), una vez que el usuario consume el contenido teórico (LMS), necesita aplicar el conocimiento. BIZEN provee tres motores de simulación asilados pero integrados con el perfil del usuario.

Este documento detalla la estructura y modelos relacionales para el equipo de Ingeniería.

---

## 1. Engine de Renta Variable (Simulador de Bolsa de Valores)
El simulador más complejo. Permite a los usuarios transaccionar con activos simulados basándose en cotizaciones reales o pre-cargadas (`market_symbols`, `market_prices_eod`).

### 1.1 Esquema de Base de Datos (Prisma)
Los modelos subyacentes mapean exactamente el comportamiento de un Broker tradicional:
*   **`simulator_portfolios`:** Contenedor maestro ligado al `Profile`. Lleva el registro del saldo líquido virtual (`cash_balance`), el valor total invertido y el retorno histórico de la cuenta (`roi`).
*   **`simulator_holdings`:** Representa las posiciones activas (ej. "Tengo 10 acciones de AAPL a un precio promedio de $150"). Se actualiza atómicamente cuando una orden se ejecuta.
*   **`simulator_orders`:** Registro inmutable de cada transacción. Tipos de órdenes: `BUY`, `SELL`. Estado: `PENDING`, `EXECUTED`, `REJECTED`.
*   **`simulator_dividend_payments`:** Registro de inyecciones de liquidez derivadas del pago de dividendos de las empresas.

### 1.2 Flujo de Ejecución (API de Trading)
El endpoint central es `/api/simulators/stocks/execute`.
1.  **Validación:** Revisa que el portafolio del usuario tenga `cash_balance >= (qty * price)` para compras, o que en `simulator_holdings` existan suficientes acciones para ventas.
2.  **Transacción Prisma:** Ejecuta la operación en bloque (ACID). Resta el dinero del portafolio, crea el registro en `simulator_orders` y crea/actualiza/elimina el `simulator_holding` correspondiente.
3.  **Real-Time Data:** El cliente (React) hace polling o utiliza websockets (si aplica) para actualizar la gráfica del portafolio basándose en el "Mark-to-Market" (precio actual x cantidad = valor).

---

## 2. Engine de Renta Fija (Simulador CETES)
Un simulador temporal donde el dinero queda bloqueado a cambio de un rendimiento predecible, replicando el modelo gubernamental mexicano.

### 2.1 Esquema de Base de Datos
*   **`cetes_portfolios`:** Análogo al portafolio de bolsa, pero exclusivo para instrumentos de deuda gubernamental.
*   **`cetes_positions`:** Contrato específico. Guarda:
    *   Monto Invertido (Principal).
    *   Tasa de Rendimiento (Yield % anualizado).
    *   Fecha de Inicio y Fecha de Vencimiento (`maturity_date`).

### 2.2 Lógica de Resolución
A diferencia de la Bolsa (que depende de decisiones del usuario), CETES depende del tiempo.
1.  **Bloqueo de Capital:** Al invertir, el capital se resta de la billetera virtual.
2.  **Devengo:** Se calcula el interés compuesto o simple según las reglas de la plataforma (`src/lib/simulators/...`).
3.  **Maturity (Vencimiento):** Un proceso en background (Cron / API de resolución) revisa diariamente los `cetes_positions`. Si `hoy >= maturity_date`, el principal + rendimiento se libera de regreso al saldo líquido del usuario y el contrato se cierra.

---

## 3. Simulador de Flujo de Caja y Crédito
Enfocado en la salud financiera diaria (Presupuestos, Gastos Hormiga y Deudas).

### 3.1 Esquema de Base de Datos
*   **`WalletTransaction`:** Registro universal de entradas y salidas de la economía del usuario (gastos, salarios, recompensas).
*   **`SavingsGoal`:** Metas de ahorro establecidas por el usuario (ej. "Comprar una laptop"), permitiendo congelar fondos virtuales temporalmente.
*   **`credit_sim_profiles` y `credit_sim_scenarios`:** Generador de casos de estudio donde el usuario se enfrenta a decisiones de crédito (ej. pagar mínimo de tarjeta vs total, adquirir un préstamo automotriz con tasa abusiva vs tasa preferencial).
*   **`credit_sim_results`:** Evaluación del desempeño del usuario en el escenario para otorgar XP y Bizcoins.

### 3.2 El Sistema GameToast
Para el flujo de caja diario, BIZEN inyecta componentes emergentes (Notificaciones In-Game) que simulan la vida real.
*   *Ejemplo:* El usuario está navegando por la app y le salta un GameToast: *"Se ha cobrado la suscripción de Netflix por $200"*. Esto afecta su `WalletTransaction` en tiempo real y reduce su saldo, forzándolo a aprender a presupuestar.
