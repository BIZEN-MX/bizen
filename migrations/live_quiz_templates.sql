-- ============================================================
--  BIZEN LIVE — Quiz Templates (Admin/Teacher saved quizzes)
--  Ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.live_quiz_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      TEXT NOT NULL,          -- user_id del docente/admin que lo creó
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT DEFAULT 'Custom',  -- 'Básico' | 'Intermedio' | 'Avanzado' | 'Custom'
  difficulty    INT DEFAULT 1,          -- 1=Básico, 2=Intermedio, 3=Avanzado
  question_count INT GENERATED ALWAYS AS (jsonb_array_length(questions)) STORED,
  questions     JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- [{question_text, question_type, time_limit, points_base, image_url, options:[{id,text,isCorrect}]}]
  times_used    INT DEFAULT 0,          -- cuántas sesiones se lanzaron desde esta plantilla
  is_public     BOOLEAN DEFAULT FALSE,  -- si otros admins del mismo school pueden verla
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_live_quiz_templates_owner ON public.live_quiz_templates(owner_id);
CREATE INDEX IF NOT EXISTS idx_live_quiz_templates_public ON public.live_quiz_templates(is_public) WHERE is_public = TRUE;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_live_quiz_template_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_live_quiz_templates_updated_at ON public.live_quiz_templates;
CREATE TRIGGER trg_live_quiz_templates_updated_at
  BEFORE UPDATE ON public.live_quiz_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_live_quiz_template_timestamp();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.live_quiz_templates ENABLE ROW LEVEL SECURITY;

-- Propietario puede ver todas sus propias plantillas
CREATE POLICY "templates_select_own" ON public.live_quiz_templates
  FOR SELECT USING (auth.uid()::TEXT = owner_id OR is_public = TRUE);

-- Solo el propietario puede crear
CREATE POLICY "templates_insert_own" ON public.live_quiz_templates
  FOR INSERT WITH CHECK (auth.uid()::TEXT = owner_id);

-- Solo el propietario puede editar
CREATE POLICY "templates_update_own" ON public.live_quiz_templates
  FOR UPDATE USING (auth.uid()::TEXT = owner_id);

-- Solo el propietario puede eliminar
CREATE POLICY "templates_delete_own" ON public.live_quiz_templates
  FOR DELETE USING (auth.uid()::TEXT = owner_id);
