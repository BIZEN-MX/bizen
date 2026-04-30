# BIZEN - Technical Product Backlog & Strategic Roadmap

Este documento detalla el estado y proyección del repositorio de BIZEN para el equipo de Ingeniería, estructurado estratégicamente en Fases de despliegue.
**Desglose Técnico: Épica > Historia de Usuario (HU) > Tarea Técnica (TT).**

---

# 🚀 FASE 1: CORE PLATFORM (MVP Operativo)
*Los pilares fundamentales que permiten que BIZEN sea funcional el día de hoy.*

## 🛠️ ÉPICA 1: Infraestructura Base, Identity & Multi-Tenancy
*   **HU 1.1: Identity Provider Integration & DB Sync**
    *   **TT 1.1.1:** Configurar `<ClerkProvider>` en Root Layout (`layout.tsx`).
    *   **TT 1.1.2:** Crear Webhook en `/api/webhook/clerk` para evento `user.created`.
    *   **TT 1.1.3:** Insertar usuario atómicamente en el modelo `Profile` de Prisma.
*   **HU 1.2: RBAC (Role-Based Access Control) & Edge Routing**
    *   **TT 1.2.1:** Configurar `src/middleware.ts` para proteger rutas con `auth.protect()`.
    *   **TT 1.2.2:** Validar `Profile.role` (admin, teacher) en Server Layouts antes de renderizar la vista.
*   **HU 1.3: Multi-Tenant Skins**
    *   **TT 1.3.1:** Hook en `AuthContext.tsx` que evalúe si el correo `.endsWith('@anahuac.mx')`.
    *   **TT 1.3.2:** Inyectar clase `.theme-anahuac` en `document.documentElement` para variables CSS HSL.

## 🧠 ÉPICA 2: Core LMS (Learning Management System Engine)
*   **HU 2.1: Esquema Relacional de Currículum**
    *   **TT 2.1.1:** Migrar esquema Prisma con cascada: `Course` -> `Topic` -> `Lesson` -> `LessonStep`.
    *   **TT 2.1.2:** Configurar campo JSONB (`LessonStep.data`) para esquemas de minijuegos.
*   **HU 2.2: Motor de Renderizado Interactivo (Player)**
    *   **TT 2.2.1:** Crear Factory Component en `src/app/learn` que monte submódulos según `step.type`.
    *   **TT 2.2.2:** Desarrollar componentes React: `<MCQ>`, `<SwipeSorter>`, `<MatchColumn>`.
*   **HU 2.3: Admin Curriculum Builder**
    *   **TT 2.3.1:** Crear UI Drag & Drop en `/admin/curriculum/page.tsx`.
    *   **TT 2.3.2:** Endpoint `/api/admin/curriculum` con validación estricta de `SUPER_ADMINS` y tipado Prisma (Int vs String).
*   **HU 2.4: BIZEN Bites (Microlearning)**
    *   **TT 2.4.1:** Reproductor de video tipo Reels con `IntersectionObserver`.
    *   **TT 2.4.2:** Integración de Google Cloud Storage (GCS) para streaming de URLs.

## 📈 ÉPICA 3: Simulation Engine
*   **HU 3.1: Broker Virtual de Renta Variable**
    *   **TT 3.1.1:** Modelos en Prisma: `simulator_portfolios`, `simulator_orders`, `simulator_holdings`.
    *   **TT 3.1.2:** Endpoint transaccional `/api/simulators/stocks/execute` que evalúe `cash_balance`.
*   **HU 3.2: Motor de Renta Fija / CETES**
    *   **TT 3.2.1:** Creación de `cetes_positions` con tracking de `maturity_date`.
    *   **TT 3.2.2:** Función pura para cálculo de interés compuesto y devengo diario.
*   **HU 3.3: Flujo de Caja Vitalicio**
    *   **TT 3.3.1:** Setup del modelo base `WalletTransaction` y cálculos de saldo vivo.
    *   **TT 3.3.2:** Trigger system (GameToasts) que inserte gastos aleatorios en tiempo real.

## 🎮 ÉPICA 4: Economy, Gamification & Social Graphs
*   **HU 4.1: Mutaciones Atómicas de Economía**
    *   **TT 4.1.1:** Endpoint `/api/lessons/[id]/complete` con operación `{ increment: xp }` en Prisma.
    *   **TT 4.1.2:** Lógica comparativa `lastActive` vs hoy para reset o incremento de rachas (Streaks).
*   **HU 4.2: Motor de Misiones Diarias**
    *   **TT 4.2.1:** Modelo `DailyMission` y job de asignación basado en `objectiveType`.
*   **HU 4.3: Leaderboards y Filtros Institucionales**
    *   **TT 4.3.1:** Endpoint `/api/rankings` con `orderBy: { xp: 'desc' }`.
    *   **TT 4.3.2:** Query Join con modelo `School` para acotar rankings por universidad.

## 🤖 ÉPICA 5: Billy AI Service
*   **HU 5.1: Conversational Proxy API**
    *   **TT 5.1.1:** Route handler Edge para conexión con LLMs.
    *   **TT 5.1.2:** Inyección del System Prompt en tiempo real leyendo estado de Base de Datos.
*   **HU 5.2: In-Lesson AI Integration**
    *   **TT 5.2.1:** Componente React `type: billy_talks` para el Lesson Engine.

## 📡 ÉPICA 6: Telemetry & Dashboards
*   **HU 6.1: School Admin Analytics**
    *   **TT 6.1.1:** Queries de agregación en Prisma para `avgAttemptsPerQuiz` y retención.
    *   **TT 6.1.2:** Layout restringido `/school-admin` validando rol `school_admin`.
*   **HU 6.2: Super Admin System Control**
    *   **TT 6.2.1:** Endpoint protegido por arrays estáticos de correos.

---

# 🔭 FASE 2: SCALE & EXPANSION (Roadmap Futuro)
*Pilares modelados en base de datos, pendientes de desarrollo intensivo.*

## ⚡ ÉPICA 7: Sistema Multiplayer en Vivo (Live Events)
*   **HU 7.1: Gestión de Sesiones Síncronas**
    *   **TT 7.1.1:** Implementar WebSockets (o Supabase Realtime) para `live_sessions`.
    *   **TT 7.1.2:** UI host/profesor para iniciar y detener el quiz.
*   **HU 7.2: Tablas de posiciones instantáneas**
    *   **TT 7.2.1:** Cálculo y broadcast en tiempo real hacia `live_leaderboard_snapshots`.

## 🌍 ÉPICA 8: Impacto Social y Responsabilidad (ESG)
*   **HU 8.1: Rastreo de Metas Institucionales**
    *   **TT 8.1.1:** ABM de `SchoolCycleGoal` en el panel de administrador de escuela.
*   **HU 8.2: Auditoría de Donaciones**
    *   **TT 8.2.1:** Flujo de carga de PDFs y fotos para `DonationEvidence`.

## 🛍️ ÉPICA 9: E-Commerce, Ligas y Recompensas
*   **HU 9.1: Sistema de Ascenso de Ligas**
    *   **TT 9.1.1:** Cronjob semanal que evalúe XP relativo y actualice `LeagueMember` de bronce a plata.
*   **HU 9.2: Tienda y Canje**
    *   **TT 9.2.1:** Checkout virtual descontando Bizcoins de `Profile` para adquirir `UserInventoryItem`.
