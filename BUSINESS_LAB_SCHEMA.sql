-- ============================================
-- BUSINESS LAB DATABASE SCHEMA
-- ============================================
-- This creates all tables needed for the Business Lab feature
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. LAB TRACKS (Learning paths)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'lab_tracks' AND column_name = 'is_active') THEN
    ALTER TABLE lab_tracks ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'lab_tracks' AND column_name = 'icon') THEN
    ALTER TABLE lab_tracks ADD COLUMN icon TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'lab_tracks' AND column_name = 'color') THEN
    ALTER TABLE lab_tracks ADD COLUMN color TEXT;
  END IF;
END $$;

-- ============================================
-- 2. LAB STEPS (Individual steps in each track)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES lab_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  required BOOLEAN DEFAULT true,
  estimated_time TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'lab_steps' AND column_name = 'estimated_time') THEN
    ALTER TABLE lab_steps ADD COLUMN estimated_time TEXT;
  END IF;
END $$;

-- ============================================
-- 3. LAB STEP PROGRESS (User progress on steps)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  step_id UUID REFERENCES lab_steps(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, step_id)
);

-- ============================================
-- 4. LAB CHECKLISTS (Task lists for each step)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES lab_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(step_id, user_id, text)
);

-- ============================================
-- 5. LAB ARTIFACTS (User-created content)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES lab_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'canvas', 'document', 'pitch', etc.
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  metadata JSONB,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. LAB TEMPLATES (Pre-built templates)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'canvas', 'pitch', 'financial', etc.
  schema JSONB,
  sample TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'lab_templates' AND column_name = 'icon') THEN
    ALTER TABLE lab_templates ADD COLUMN icon TEXT;
  END IF;
END $$;

-- ============================================
-- 7. LAB EXPERIMENTS (Hypothesis testing)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES lab_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  hypothesis TEXT NOT NULL,
  metric TEXT,
  target_value TEXT,
  result TEXT,
  decision TEXT, -- 'pivot', 'persevere', 'iterate'
  status TEXT DEFAULT 'planning', -- 'planning', 'running', 'completed', 'cancelled'
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 8. LAB SCORES (Investment readiness scores)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_scores (
  user_id UUID PRIMARY KEY,
  readiness_score INTEGER DEFAULT 0,
  breakdown JSONB,
  notes TEXT,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 9. LAB AI JOBS (AI-generated content tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tool TEXT NOT NULL, -- 'lean-canvas', 'pitch-coach', 'idea-map', etc.
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  input JSONB,
  output JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- 10. LAB SIM INPUTS (Simulator inputs)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_sim_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  kind TEXT NOT NULL, -- 'pricing', 'runway', 'valuation', etc.
  params JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 11. LAB SIM OUTPUTS (Simulator results)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_sim_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_id TEXT REFERENCES lab_sim_inputs(id) ON DELETE CASCADE,
  results JSONB NOT NULL,
  charts JSONB,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add input_id column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'lab_sim_outputs' AND column_name = 'input_id') THEN
    ALTER TABLE lab_sim_outputs ADD COLUMN input_id TEXT REFERENCES lab_sim_inputs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- 12. LAB MENTORS (Mentor marketplace)
-- ============================================
CREATE TABLE IF NOT EXISTS lab_mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bio TEXT,
  expertise TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10,2),
  availability TEXT,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lab_steps_track_id ON lab_steps(track_id);
CREATE INDEX IF NOT EXISTS idx_lab_step_progress_user_id ON lab_step_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_step_progress_step_id ON lab_step_progress(step_id);
CREATE INDEX IF NOT EXISTS idx_lab_checklists_step_user ON lab_checklists(step_id, user_id);
CREATE INDEX IF NOT EXISTS idx_lab_artifacts_user_id ON lab_artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_artifacts_step_id ON lab_artifacts(step_id);
CREATE INDEX IF NOT EXISTS idx_lab_experiments_user_id ON lab_experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_experiments_step_id ON lab_experiments(step_id);
CREATE INDEX IF NOT EXISTS idx_lab_ai_jobs_user_id ON lab_ai_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_sim_inputs_user_id ON lab_sim_inputs(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE lab_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_sim_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_sim_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_mentors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view tracks" ON lab_tracks;
DROP POLICY IF EXISTS "Anyone can view steps" ON lab_steps;
DROP POLICY IF EXISTS "Anyone can view templates" ON lab_templates;
DROP POLICY IF EXISTS "Users can view own progress" ON lab_step_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON lab_step_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON lab_step_progress;
DROP POLICY IF EXISTS "Users can view own checklists" ON lab_checklists;
DROP POLICY IF EXISTS "Users can insert own checklists" ON lab_checklists;
DROP POLICY IF EXISTS "Users can update own checklists" ON lab_checklists;
DROP POLICY IF EXISTS "Users can delete own checklists" ON lab_checklists;
DROP POLICY IF EXISTS "Users can view own artifacts" ON lab_artifacts;
DROP POLICY IF EXISTS "Users can view shared artifacts" ON lab_artifacts;
DROP POLICY IF EXISTS "Users can insert own artifacts" ON lab_artifacts;
DROP POLICY IF EXISTS "Users can update own artifacts" ON lab_artifacts;
DROP POLICY IF EXISTS "Users can delete own artifacts" ON lab_artifacts;
DROP POLICY IF EXISTS "Users can view own experiments" ON lab_experiments;
DROP POLICY IF EXISTS "Users can insert own experiments" ON lab_experiments;
DROP POLICY IF EXISTS "Users can update own experiments" ON lab_experiments;
DROP POLICY IF EXISTS "Users can view own score" ON lab_scores;
DROP POLICY IF EXISTS "Users can insert own score" ON lab_scores;
DROP POLICY IF EXISTS "Users can update own score" ON lab_scores;
DROP POLICY IF EXISTS "Users can view own ai jobs" ON lab_ai_jobs;
DROP POLICY IF EXISTS "Users can insert own ai jobs" ON lab_ai_jobs;
DROP POLICY IF EXISTS "Users can view own sim inputs" ON lab_sim_inputs;
DROP POLICY IF EXISTS "Users can insert own sim inputs" ON lab_sim_inputs;
DROP POLICY IF EXISTS "Users can view own sim outputs" ON lab_sim_outputs;
DROP POLICY IF EXISTS "Anyone can view active mentors" ON lab_mentors;

-- Tracks and Steps (public read)
CREATE POLICY "Anyone can view tracks" ON lab_tracks FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view steps" ON lab_steps FOR SELECT USING (true);
CREATE POLICY "Anyone can view templates" ON lab_templates FOR SELECT USING (true);

-- Progress (user-specific)
CREATE POLICY "Users can view own progress" ON lab_step_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON lab_step_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON lab_step_progress FOR UPDATE USING (auth.uid() = user_id);

-- Checklists (user-specific)
CREATE POLICY "Users can view own checklists" ON lab_checklists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checklists" ON lab_checklists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checklists" ON lab_checklists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checklists" ON lab_checklists FOR DELETE USING (auth.uid() = user_id);

-- Artifacts (user-specific + shared view)
CREATE POLICY "Users can view own artifacts" ON lab_artifacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view shared artifacts" ON lab_artifacts FOR SELECT USING (is_shared = true);
CREATE POLICY "Users can insert own artifacts" ON lab_artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own artifacts" ON lab_artifacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own artifacts" ON lab_artifacts FOR DELETE USING (auth.uid() = user_id);

-- Experiments (user-specific)
CREATE POLICY "Users can view own experiments" ON lab_experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experiments" ON lab_experiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiments" ON lab_experiments FOR UPDATE USING (auth.uid() = user_id);

-- Scores (user-specific)
CREATE POLICY "Users can view own score" ON lab_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own score" ON lab_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own score" ON lab_scores FOR UPDATE USING (auth.uid() = user_id);

-- AI Jobs (user-specific)
CREATE POLICY "Users can view own ai jobs" ON lab_ai_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai jobs" ON lab_ai_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Simulator (user-specific)
CREATE POLICY "Users can view own sim inputs" ON lab_sim_inputs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sim inputs" ON lab_sim_inputs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own sim outputs" ON lab_sim_outputs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM lab_sim_inputs 
    WHERE lab_sim_inputs.id = lab_sim_outputs.input_id 
    AND lab_sim_inputs.user_id = auth.uid()
  )
);

-- Mentors (public read for active)
CREATE POLICY "Anyone can view active mentors" ON lab_mentors FOR SELECT USING (is_active = true);

-- ============================================
-- SAMPLE DATA: Initial Tracks
-- ============================================
INSERT INTO lab_tracks (key, title, description, icon, color, "order") VALUES
  ('ideation', 'Ideación', 'Valida y refina tu idea de negocio', '💡', '#10b981', 1),
  ('planning', 'Planificación', 'Crea tu plan de negocio y modelo canvas', '📋', '#3b82f6', 2),
  ('validation', 'Validación', 'Prueba tu concepto con clientes reales', '✅', '#8b5cf6', 3),
  ('funding', 'Financiamiento', 'Prepara tu pitch y busca inversión', '💰', '#f59e0b', 4),
  ('launch', 'Lanzamiento', 'Lanza tu MVP y escala tu negocio', '🚀', '#ef4444', 5)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SAMPLE DATA: Initial Steps for Ideation Track
-- ============================================
DO $$
DECLARE
  v_ideation_track_id UUID;
BEGIN
  -- Get the ideation track ID
  SELECT id INTO v_ideation_track_id FROM lab_tracks WHERE key = 'ideation';
  
  IF v_ideation_track_id IS NOT NULL THEN
    -- Insert steps for ideation track
    INSERT INTO lab_steps (track_id, title, description, goal, "order", required, estimated_time) VALUES
      (v_ideation_track_id, 'Identifica el Problema', 'Define claramente qué problema estás resolviendo', 'Documentar el problema principal que enfrentan tus clientes', 1, true, '30 min'),
      (v_ideation_track_id, 'Investiga el Mercado', 'Analiza tu mercado objetivo y competencia', 'Completar análisis de mercado inicial', 2, true, '1-2 horas'),
      (v_ideation_track_id, 'Define tu Solución', 'Describe cómo tu producto resuelve el problema', 'Crear una propuesta de valor clara', 3, true, '45 min'),
      (v_ideation_track_id, 'Mapa de Idea', 'Crea un mapa visual de tu concepto de negocio', 'Completar mapa de idea con componentes clave', 4, false, '30 min')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- SAMPLE DATA: Initial Steps for Planning Track
-- ============================================
DO $$
DECLARE
  v_planning_track_id UUID;
BEGIN
  SELECT id INTO v_planning_track_id FROM lab_tracks WHERE key = 'planning';
  
  IF v_planning_track_id IS NOT NULL THEN
    INSERT INTO lab_steps (track_id, title, description, goal, "order", required, estimated_time) VALUES
      (v_planning_track_id, 'Lean Canvas', 'Completa tu Lean Canvas de negocio', 'Llenar los 9 bloques del Lean Canvas', 1, true, '1 hora'),
      (v_planning_track_id, 'Modelo de Ingresos', 'Define cómo generarás ingresos', 'Documentar 3+ fuentes de ingreso potenciales', 2, true, '45 min'),
      (v_planning_track_id, 'Proyección Financiera', 'Crea proyecciones básicas a 12 meses', 'Completar modelo financiero simple', 3, true, '1-2 horas'),
      (v_planning_track_id, 'Estrategia Go-to-Market', 'Planifica cómo llegarás a tus clientes', 'Definir canales de adquisición y estrategia de marketing', 4, true, '1 hora')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- SAMPLE DATA: Templates
-- ============================================
INSERT INTO lab_templates (code, title, description, category, icon) VALUES
  ('lean-canvas', 'Lean Canvas', 'Plantilla de modelo de negocio Lean', 'canvas', '📊'),
  ('business-model-canvas', 'Business Model Canvas', 'Canvas tradicional de modelo de negocio', 'canvas', '📋'),
  ('pitch-deck', 'Pitch Deck', 'Presentación para inversionistas (10 slides)', 'pitch', '🎯'),
  ('financial-model', 'Modelo Financiero', 'Proyecciones financieras a 3 años', 'financial', '💰'),
  ('value-proposition', 'Propuesta de Valor', 'Canvas de propuesta de valor', 'canvas', '💎'),
  ('customer-personas', 'Customer Personas', 'Perfiles de clientes ideales', 'research', '👥'),
  ('competitive-analysis', 'Análisis Competitivo', 'Matriz de análisis de competencia', 'research', '🔍'),
  ('swot-analysis', 'Análisis SWOT', 'Fortalezas, Oportunidades, Debilidades, Amenazas', 'planning', '⚡'),
  ('roadmap', 'Roadmap de Producto', 'Planificación de desarrollo de producto', 'planning', '🗺️'),
  ('okrs', 'OKRs', 'Objetivos y Resultados Clave', 'planning', '🎯')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- TRIGGERS for updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ 
BEGIN
  -- Drop triggers if they exist
  DROP TRIGGER IF EXISTS update_lab_tracks_updated_at ON lab_tracks;
  DROP TRIGGER IF EXISTS update_lab_steps_updated_at ON lab_steps;
  DROP TRIGGER IF EXISTS update_lab_step_progress_updated_at ON lab_step_progress;
  DROP TRIGGER IF EXISTS update_lab_checklists_updated_at ON lab_checklists;
  DROP TRIGGER IF EXISTS update_lab_artifacts_updated_at ON lab_artifacts;
  DROP TRIGGER IF EXISTS update_lab_templates_updated_at ON lab_templates;
  DROP TRIGGER IF EXISTS update_lab_experiments_updated_at ON lab_experiments;
  DROP TRIGGER IF EXISTS update_lab_scores_updated_at ON lab_scores;
  DROP TRIGGER IF EXISTS update_lab_mentors_updated_at ON lab_mentors;
END $$;

-- Create triggers
CREATE TRIGGER update_lab_tracks_updated_at BEFORE UPDATE ON lab_tracks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_steps_updated_at BEFORE UPDATE ON lab_steps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_step_progress_updated_at BEFORE UPDATE ON lab_step_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_checklists_updated_at BEFORE UPDATE ON lab_checklists 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_artifacts_updated_at BEFORE UPDATE ON lab_artifacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_templates_updated_at BEFORE UPDATE ON lab_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_experiments_updated_at BEFORE UPDATE ON lab_experiments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_scores_updated_at BEFORE UPDATE ON lab_scores 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_mentors_updated_at BEFORE UPDATE ON lab_mentors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
DO $$ 
BEGIN
  -- Grant permissions (wrap in exception handler)
  BEGIN
    GRANT ALL ON lab_tracks TO authenticated;
    GRANT ALL ON lab_steps TO authenticated;
    GRANT ALL ON lab_step_progress TO authenticated;
    GRANT ALL ON lab_checklists TO authenticated;
    GRANT ALL ON lab_artifacts TO authenticated;
    GRANT ALL ON lab_templates TO authenticated;
    GRANT ALL ON lab_experiments TO authenticated;
    GRANT ALL ON lab_scores TO authenticated;
    GRANT ALL ON lab_ai_jobs TO authenticated;
    GRANT ALL ON lab_sim_inputs TO authenticated;
    GRANT ALL ON lab_sim_outputs TO authenticated;
    GRANT ALL ON lab_mentors TO authenticated;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore if roles don't exist yet
  END;
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify setup:

-- Check tables created:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'lab_%' ORDER BY tablename;

-- Check sample data:
-- SELECT * FROM lab_tracks ORDER BY "order";
-- SELECT * FROM lab_steps ORDER BY track_id, "order";
-- SELECT * FROM lab_templates ORDER BY category, title;

-- ============================================
-- SUCCESS!
-- ============================================
-- All Business Lab tables created successfully!
-- Next steps:
-- 1. Run: npx prisma db pull
-- 2. Run: npx prisma generate
-- 3. Restart your dev server
-- 4. Visit: http://localhost:3004/business-lab

