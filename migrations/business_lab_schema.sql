-- ========================================
-- BUSINESS LAB SCHEMA
-- ========================================
-- Migration for Business Lab feature
-- Creates all tables, indexes, and RLS policies

-- ========================================
-- 1. LAB TRACKS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_tracks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_tracks_order ON lab_tracks("order");

-- RLS for lab_tracks (public read)
ALTER TABLE lab_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lab tracks"
  ON lab_tracks FOR SELECT
  USING (true);

-- ========================================
-- 2. LAB STEPS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_steps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  track_id TEXT NOT NULL REFERENCES lab_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  required BOOLEAN DEFAULT true,
  goal TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_steps_track ON lab_steps(track_id);
CREATE INDEX idx_lab_steps_order ON lab_steps("order");

-- RLS for lab_steps (public read)
ALTER TABLE lab_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lab steps"
  ON lab_steps FOR SELECT
  USING (true);

-- ========================================
-- 3. LAB CHECKLISTS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_checklists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  step_id TEXT NOT NULL REFERENCES lab_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_checklists_step ON lab_checklists(step_id);
CREATE INDEX idx_lab_checklists_user ON lab_checklists(user_id);
CREATE INDEX idx_lab_checklists_user_step ON lab_checklists(user_id, step_id);

-- RLS for lab_checklists (users can only access their own)
ALTER TABLE lab_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checklists"
  ON lab_checklists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklists"
  ON lab_checklists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklists"
  ON lab_checklists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklists"
  ON lab_checklists FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 4. LAB TEMPLATES
-- ========================================

CREATE TABLE IF NOT EXISTS lab_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  schema JSONB,
  sample TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_templates_code ON lab_templates(code);
CREATE INDEX idx_lab_templates_category ON lab_templates(category);

-- RLS for lab_templates (public read)
ALTER TABLE lab_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lab templates"
  ON lab_templates FOR SELECT
  USING (true);

-- ========================================
-- 5. LAB ARTIFACTS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_artifacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  step_id TEXT NOT NULL REFERENCES lab_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  metadata JSONB,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_artifacts_step ON lab_artifacts(step_id);
CREATE INDEX idx_lab_artifacts_user ON lab_artifacts(user_id);
CREATE INDEX idx_lab_artifacts_user_step ON lab_artifacts(user_id, step_id);
CREATE INDEX idx_lab_artifacts_type ON lab_artifacts(type);

-- RLS for lab_artifacts (users can only access their own)
ALTER TABLE lab_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own artifacts"
  ON lab_artifacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own artifacts"
  ON lab_artifacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own artifacts"
  ON lab_artifacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own artifacts"
  ON lab_artifacts FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 6. LAB EXPERIMENTS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_experiments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  step_id TEXT NOT NULL REFERENCES lab_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hypothesis TEXT NOT NULL,
  metric TEXT,
  target_value TEXT,
  result TEXT,
  decision TEXT,
  status TEXT DEFAULT 'planned', -- 'planned', 'running', 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_experiments_step ON lab_experiments(step_id);
CREATE INDEX idx_lab_experiments_user ON lab_experiments(user_id);
CREATE INDEX idx_lab_experiments_user_step ON lab_experiments(user_id, step_id);
CREATE INDEX idx_lab_experiments_status ON lab_experiments(status);

-- RLS for lab_experiments (users can only access their own)
ALTER TABLE lab_experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own experiments"
  ON lab_experiments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiments"
  ON lab_experiments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiments"
  ON lab_experiments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiments"
  ON lab_experiments FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 7. LAB SCORES (Investment Readiness)
-- ========================================

CREATE TABLE IF NOT EXISTS lab_scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  readiness_score INTEGER DEFAULT 0,
  notes TEXT,
  breakdown JSONB, -- store score breakdown by category
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for lab_scores (users can only access their own)
ALTER TABLE lab_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores"
  ON lab_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON lab_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores"
  ON lab_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- 8. LAB SIMULATOR INPUTS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_sim_inputs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, -- 'cashflow', 'breakeven', 'pricing', 'funnel'
  input JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_sim_inputs_user ON lab_sim_inputs(user_id);
CREATE INDEX idx_lab_sim_inputs_kind ON lab_sim_inputs(kind);
CREATE INDEX idx_lab_sim_inputs_user_kind ON lab_sim_inputs(user_id, kind);

-- RLS for lab_sim_inputs (users can only access their own)
ALTER TABLE lab_sim_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sim inputs"
  ON lab_sim_inputs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sim inputs"
  ON lab_sim_inputs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sim inputs"
  ON lab_sim_inputs FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 9. LAB SIMULATOR OUTPUTS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_sim_outputs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sim_input_id TEXT NOT NULL REFERENCES lab_sim_inputs(id) ON DELETE CASCADE,
  output JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_sim_outputs_input ON lab_sim_outputs(sim_input_id);

-- RLS for lab_sim_outputs (users can access outputs linked to their inputs)
ALTER TABLE lab_sim_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view outputs of own sim inputs"
  ON lab_sim_outputs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lab_sim_inputs
      WHERE lab_sim_inputs.id = lab_sim_outputs.sim_input_id
      AND lab_sim_inputs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert outputs for own sim inputs"
  ON lab_sim_outputs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lab_sim_inputs
      WHERE lab_sim_inputs.id = sim_input_id
      AND lab_sim_inputs.user_id = auth.uid()
    )
  );

-- ========================================
-- 10. LAB AI JOBS
-- ========================================

CREATE TABLE IF NOT EXISTS lab_ai_jobs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool TEXT NOT NULL, -- 'idea-map', 'interview-coach', etc.
  input JSONB NOT NULL,
  output JSONB,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_lab_ai_jobs_user ON lab_ai_jobs(user_id);
CREATE INDEX idx_lab_ai_jobs_tool ON lab_ai_jobs(tool);
CREATE INDEX idx_lab_ai_jobs_status ON lab_ai_jobs(status);
CREATE INDEX idx_lab_ai_jobs_created ON lab_ai_jobs(created_at);

-- RLS for lab_ai_jobs (users can only access their own)
ALTER TABLE lab_ai_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI jobs"
  ON lab_ai_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI jobs"
  ON lab_ai_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI jobs"
  ON lab_ai_jobs FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- 11. LAB MENTORS (Optional)
-- ========================================

CREATE TABLE IF NOT EXISTS lab_mentors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topics TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_mentors_user ON lab_mentors(user_id);
CREATE INDEX idx_lab_mentors_active ON lab_mentors(is_active);
CREATE INDEX idx_lab_mentors_topics ON lab_mentors USING GIN(topics);

-- RLS for lab_mentors (public read active mentors, users can edit own)
ALTER TABLE lab_mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active mentors"
  ON lab_mentors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert own mentor profile"
  ON lab_mentors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mentor profile"
  ON lab_mentors FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- 12. MENTOR SESSIONS (Optional)
-- ========================================

CREATE TABLE IF NOT EXISTS mentor_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  mentor_id TEXT NOT NULL REFERENCES lab_mentors(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mentor_sessions_mentor ON mentor_sessions(mentor_id);
CREATE INDEX idx_mentor_sessions_founder ON mentor_sessions(founder_id);
CREATE INDEX idx_mentor_sessions_status ON mentor_sessions(status);

-- RLS for mentor_sessions (users can access sessions they're part of)
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their sessions"
  ON mentor_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lab_mentors
      WHERE lab_mentors.id = mentor_sessions.mentor_id
      AND lab_mentors.user_id = auth.uid()
    )
  );

CREATE POLICY "Founders can view their sessions"
  ON mentor_sessions FOR SELECT
  USING (auth.uid() = founder_id);

CREATE POLICY "Founders can create sessions"
  ON mentor_sessions FOR INSERT
  WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Participants can update sessions"
  ON mentor_sessions FOR UPDATE
  USING (
    auth.uid() = founder_id OR
    EXISTS (
      SELECT 1 FROM lab_mentors
      WHERE lab_mentors.id = mentor_sessions.mentor_id
      AND lab_mentors.user_id = auth.uid()
    )
  );

-- ========================================
-- 13. LAB STEP PROGRESS (track completion)
-- ========================================

CREATE TABLE IF NOT EXISTS lab_step_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL REFERENCES lab_steps(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, step_id)
);

CREATE INDEX idx_lab_step_progress_user ON lab_step_progress(user_id);
CREATE INDEX idx_lab_step_progress_step ON lab_step_progress(step_id);
CREATE INDEX idx_lab_step_progress_user_completed ON lab_step_progress(user_id, is_completed);

-- RLS for lab_step_progress (users can only access their own)
ALTER TABLE lab_step_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON lab_step_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON lab_step_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON lab_step_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_lab_checklists_updated_at
  BEFORE UPDATE ON lab_checklists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_artifacts_updated_at
  BEFORE UPDATE ON lab_artifacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_experiments_updated_at
  BEFORE UPDATE ON lab_experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_scores_updated_at
  BEFORE UPDATE ON lab_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_mentors_updated_at
  BEFORE UPDATE ON lab_mentors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_step_progress_updated_at
  BEFORE UPDATE ON lab_step_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE lab_tracks IS 'Business Lab tracks (Discover, Validate, Build, Launch, Grow, Pitch)';
COMMENT ON TABLE lab_steps IS 'Steps within each track';
COMMENT ON TABLE lab_checklists IS 'User checklist items for each step';
COMMENT ON TABLE lab_templates IS 'Reusable templates (Lean Canvas, Persona, etc.)';
COMMENT ON TABLE lab_artifacts IS 'User-generated outputs (personas, canvases, etc.)';
COMMENT ON TABLE lab_experiments IS 'User experiments and validation tests';
COMMENT ON TABLE lab_scores IS 'Investment readiness scores per user';
COMMENT ON TABLE lab_sim_inputs IS 'Simulator input data (cashflow, breakeven, etc.)';
COMMENT ON TABLE lab_sim_outputs IS 'Simulator computed outputs';
COMMENT ON TABLE lab_ai_jobs IS 'AI tool execution logs';
COMMENT ON TABLE lab_mentors IS 'Mentor profiles for matching';
COMMENT ON TABLE mentor_sessions IS 'Mentor-founder session records';
COMMENT ON TABLE lab_step_progress IS 'Track user completion of steps';

