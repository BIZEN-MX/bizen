-- =====================================================
-- BIZEN Financial Simulators - Quick Start Script (FIXED)
-- =====================================================
-- Run this entire file in your Supabase SQL Editor
-- This will set up tables, RLS policies, and seed data
-- =====================================================

-- =====================================================
-- STEP 1: Drop existing tables (if recreating)
-- =====================================================
DROP TABLE IF EXISTS public.sim_runs CASCADE;
DROP TABLE IF EXISTS public.simulators CASCADE;

-- =====================================================
-- STEP 2: Create Tables
-- =====================================================

-- Simulators catalog
CREATE TABLE public.simulators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Saved simulation runs
CREATE TABLE public.sim_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    simulator_slug TEXT NOT NULL REFERENCES public.simulators(slug) ON DELETE CASCADE,
    run_name TEXT,
    inputs JSONB NOT NULL,
    outputs JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- STEP 3: Create Indexes
-- =====================================================
CREATE INDEX idx_sim_runs_user_id ON public.sim_runs(user_id);
CREATE INDEX idx_sim_runs_simulator_slug ON public.sim_runs(simulator_slug);
CREATE INDEX idx_sim_runs_user_slug_created ON public.sim_runs(user_id, simulator_slug, created_at DESC);
CREATE INDEX idx_sim_runs_created_at ON public.sim_runs(created_at DESC);
CREATE INDEX idx_simulators_slug ON public.simulators(slug);
CREATE INDEX idx_simulators_active_sort ON public.simulators(is_active, sort_order);

-- =====================================================
-- STEP 4: Enable RLS
-- =====================================================
ALTER TABLE public.sim_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulators ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: RLS Policies - Simulators Table
-- =====================================================

-- Anyone can read active simulators (even non-authenticated users)
CREATE POLICY "simulators_select_public"
ON public.simulators
FOR SELECT
USING (is_active = true);

-- Authenticated users can insert simulators (for now - you can tighten this later)
CREATE POLICY "simulators_insert_authenticated"
ON public.simulators
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update simulators (for now - you can tighten this later)
CREATE POLICY "simulators_update_authenticated"
ON public.simulators
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Authenticated users can delete simulators (for now - you can tighten this later)
CREATE POLICY "simulators_delete_authenticated"
ON public.simulators
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- =====================================================
-- STEP 6: RLS Policies - Sim_Runs Table
-- =====================================================

-- Users can insert their own runs
CREATE POLICY "sim_runs_insert_own"
ON public.sim_runs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can select their own runs
CREATE POLICY "sim_runs_select_own"
ON public.sim_runs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own runs
CREATE POLICY "sim_runs_update_own"
ON public.sim_runs
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own runs
CREATE POLICY "sim_runs_delete_own"
ON public.sim_runs
FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- STEP 7: Create Triggers for Auto-Timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_simulators_updated_at
    BEFORE UPDATE ON public.simulators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sim_runs_updated_at
    BEFORE UPDATE ON public.sim_runs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 8: Seed Simulators Data
-- =====================================================
INSERT INTO public.simulators (slug, name, description, category, icon, sort_order, is_active) VALUES
(
    'monthly-budget',
    'BIZEN Plan (Presupuesto)',
    'Organiza tus ingresos en necesidades, deseos y ahorro usando la regla 50/30/20 o un modo personalizado.',
    'budgeting',
    '💰',
    1,
    true
),
(
    'savings-goal',
    'BIZEN Saver (Ahorro)',
    'Calcula cuánto crecerán tus ahorros con aportaciones mensuales y rendimientos, o cuánto tiempo te tomará alcanzar una meta.',
    'savings',
    '🎯',
    2,
    true
),
(
    'credit-card-payoff',
    'BIZEN Card (Liquidación)',
    'Compara cuánto tardarás y pagarás si haces pagos mínimos vs. pagos fijos mayores.',
    'credit',
    '💳',
    3,
    true
),
(
    'simple-loan',
    'BIZEN Loan (Préstamo)',
    'Calcula tu pago mensual, tabla de amortización y CAT aproximado para un préstamo con comisiones.',
    'credit',
    '🏦',
    4,
    true
),
(
    'investment-comparison',
    'BIZEN Invest (Inversión)',
    'Compara tres opciones de inversión (ahorro tradicional, CETES, fondo) y ve cuál da mejores resultados.',
    'investment',
    '📈',
    5,
    true
),
(
    'inflation-calculator',
    'BIZEN Power (Inflación)',
    'Descubre cuánto costará un producto en el futuro y cuánto necesitas ganar para mantener tu poder de compra.',
    'inflation',
    '📊',
    6,
    true
);

-- =====================================================
-- STEP 9: Verification
-- =====================================================
-- Check simulators
SELECT slug, name, is_active, sort_order FROM public.simulators ORDER BY sort_order;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies
WHERE tablename IN ('simulators', 'sim_runs')
ORDER BY tablename, policyname;

-- =====================================================
-- ✅ SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. npm run dev
-- 2. Visit http://localhost:3004/simulators
-- 3. Test each simulator
--
-- NOTE: The simulators table policies allow any authenticated user
-- to manage simulators for now. If you want admin-only access,
-- you'll need to create a user_roles table and update the policies.
-- =====================================================

