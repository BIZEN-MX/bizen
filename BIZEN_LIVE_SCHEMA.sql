-- ============================================================
--  BIZEN LIVE — Sesiones de Quiz en Tiempo Real (tipo Kahoot)
--  Ejecutar en Supabase SQL Editor
--  Requiere: extensión pgcrypto (gen_random_uuid)
-- ============================================================

-- ============================================================
-- 1. LIVE_SESSIONS — La sesión maestra creada por el Host
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id         TEXT NOT NULL,                    -- user_id del docente/host (references profiles.user_id)
  pin             VARCHAR(6) NOT NULL UNIQUE,       -- PIN de 6 dígitos para unirse
  title           TEXT NOT NULL DEFAULT 'Quiz en vivo',
  status          VARCHAR(20) NOT NULL DEFAULT 'lobby',
  -- status: 'lobby' | 'in_question' | 'showing_results' | 'leaderboard' | 'finished'
  current_question_index  INT DEFAULT 0,
  question_started_at     TIMESTAMPTZ,             -- Para calcular el tiempo de respuesta
  time_limit_seconds      INT DEFAULT 20,          -- Límite de tiempo por pregunta
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  started_at      TIMESTAMPTZ,
  finished_at     TIMESTAMPTZ,
  settings        JSONB DEFAULT '{}'::JSONB
  -- settings: { showLeaderboardAfterEach: true, allowLateJoin: false, music: true }
);

-- Índices para live_sessions
CREATE INDEX IF NOT EXISTS idx_live_sessions_pin ON public.live_sessions(pin);
CREATE INDEX IF NOT EXISTS idx_live_sessions_host ON public.live_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON public.live_sessions(status);


-- ============================================================
-- 2. LIVE_QUESTIONS — Las preguntas de la sesión
--    Pueden importarse de lecciones existentes (lesson_steps)
--    o crearse ad-hoc para la sesión
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  order_index     INT NOT NULL,
  question_text   TEXT NOT NULL,
  question_type   VARCHAR(20) NOT NULL DEFAULT 'mcq',
  -- question_type: 'mcq' | 'true_false' | 'poll'
  time_limit      INT DEFAULT 20,                  -- Puede tener tiempo diferente al default
  points_base     INT DEFAULT 1000,                -- Puntos máximos por respuesta correcta
  options         JSONB NOT NULL DEFAULT '[]',     -- [{id, text, isCorrect}]
  image_url       TEXT,
  -- Campo opcional: si viene de una lección existente
  source_lesson_step_id TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para live_questions
CREATE INDEX IF NOT EXISTS idx_live_questions_session ON public.live_questions(session_id, order_index);


-- ============================================================
-- 3. LIVE_PARTICIPANTS — Los jugadores que se unieron (Presence)
--    Se gestiona en tiempo real pero también se persiste en BD
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_participants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id         TEXT,                            -- NULL si es invitado sin cuenta
  nickname        TEXT NOT NULL,                   -- Nombre que aparece en el podio
  avatar          JSONB,                           -- El objeto avatar de BIZEN {style, color, ...}
  total_score     INT DEFAULT 0,
  current_streak  INT DEFAULT 0,                   -- Racha de respuestas correctas consecutivas
  rank            INT,                             -- Posición en el leaderboard (se actualiza)
  is_host         BOOLEAN DEFAULT FALSE,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  left_at         TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE
);

-- Índices para live_participants
CREATE INDEX IF NOT EXISTS idx_live_participants_session ON public.live_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_live_participants_user ON public.live_participants(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_participants_unique ON public.live_participants(session_id, user_id) WHERE user_id IS NOT NULL;


-- ============================================================
-- 4. LIVE_ANSWERS — Respuestas individuales por pregunta
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES public.live_questions(id) ON DELETE CASCADE,
  participant_id  UUID NOT NULL REFERENCES public.live_participants(id) ON DELETE CASCADE,
  selected_option_id  TEXT,                        -- ID de la opción elegida
  is_correct      BOOLEAN,
  answer_time_ms  INT,                             -- Tiempo en ms que tardó en responder
  score_earned    INT DEFAULT 0,
  -- Fórmula: score = points_base * (time_remaining / time_limit) * streak_multiplier
  streak_at_answer INT DEFAULT 0,                  -- Racha en el momento de responder
  answered_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para live_answers
CREATE INDEX IF NOT EXISTS idx_live_answers_session ON public.live_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_live_answers_question ON public.live_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_live_answers_participant ON public.live_answers(participant_id);
-- Evitar respuestas duplicadas por pregunta
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_answers_unique ON public.live_answers(question_id, participant_id);


-- ============================================================
-- 5. LIVE_LEADERBOARD_SNAPSHOTS — Historial del leaderboard
--    Se guarda al final de cada pregunta para análisis posterior
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_leaderboard_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  question_index  INT NOT NULL,
  snapshot        JSONB NOT NULL,
  -- [{rank, participant_id, nickname, avatar, score, streak}]
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_snapshots_session ON public.live_leaderboard_snapshots(session_id, question_index);


-- ============================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_leaderboard_snapshots ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 7. RLS POLICIES
-- ============================================================

-- live_sessions: todos pueden leer (para unirse con PIN), solo el host puede crear/editar
CREATE POLICY "live_sessions_select_all" ON public.live_sessions
  FOR SELECT USING (true);

CREATE POLICY "live_sessions_insert_auth" ON public.live_sessions
  FOR INSERT WITH CHECK (auth.uid()::TEXT = host_id);

CREATE POLICY "live_sessions_update_host" ON public.live_sessions
  FOR UPDATE USING (auth.uid()::TEXT = host_id);

CREATE POLICY "live_sessions_delete_host" ON public.live_sessions
  FOR DELETE USING (auth.uid()::TEXT = host_id);


-- live_questions: todos pueden leer, solo el host puede crear/editar
CREATE POLICY "live_questions_select_all" ON public.live_questions
  FOR SELECT USING (true);

CREATE POLICY "live_questions_insert_host" ON public.live_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.live_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "live_questions_update_host" ON public.live_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.live_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()::TEXT
    )
  );


-- live_participants: todos pueden leer (for leaderboard), usuarios crean su propio registro
CREATE POLICY "live_participants_select_all" ON public.live_participants
  FOR SELECT USING (true);

CREATE POLICY "live_participants_insert_auth" ON public.live_participants
  FOR INSERT WITH CHECK (
    auth.uid()::TEXT = user_id OR user_id IS NULL
  );

CREATE POLICY "live_participants_update_own" ON public.live_participants
  FOR UPDATE USING (auth.uid()::TEXT = user_id);


-- live_answers: participante solo ve y crea sus propias respuestas
CREATE POLICY "live_answers_select_own" ON public.live_answers
  FOR SELECT USING (
    participant_id IN (
      SELECT id FROM public.live_participants
      WHERE user_id = auth.uid()::TEXT
    )
    OR EXISTS (
      SELECT 1 FROM public.live_sessions s WHERE s.id = session_id AND s.host_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "live_answers_insert_own" ON public.live_answers
  FOR INSERT WITH CHECK (
    participant_id IN (
      SELECT id FROM public.live_participants
      WHERE user_id = auth.uid()::TEXT AND session_id = live_answers.session_id
    )
  );


-- live_leaderboard_snapshots: todos pueden leer
CREATE POLICY "live_snapshots_select_all" ON public.live_leaderboard_snapshots
  FOR SELECT USING (true);

CREATE POLICY "live_snapshots_insert_host" ON public.live_leaderboard_snapshots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.live_sessions s
      WHERE s.id = session_id AND s.host_id = auth.uid()::TEXT
    )
  );


-- ============================================================
-- 8. ENABLE REALTIME para las tablas que lo necesitan
--    Ejecutar en Supabase Dashboard > Database > Replication
--    O con estas instrucciones:
-- ============================================================
-- Nota: En Supabase, el Realtime se habilita desde el Dashboard
-- Database > Replication > Realtime
-- Habilitar para: live_sessions, live_participants, live_answers
-- 
-- Alternativamente con SQL (si la extensión supabase_realtime está disponible):
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.live_participants;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.live_answers;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.live_leaderboard_snapshots;


-- ============================================================
-- 9. FUNCIÓN AUXILIAR: Generar PIN único de 6 dígitos
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_live_pin()
RETURNS VARCHAR(6) AS $$
DECLARE
  new_pin VARCHAR(6);
  pin_exists BOOLEAN := TRUE;
BEGIN
  WHILE pin_exists LOOP
    -- Genera PIN numérico de 6 dígitos (100000 - 999999)
    new_pin := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
    SELECT EXISTS(
      SELECT 1 FROM public.live_sessions
      WHERE pin = new_pin
      AND status NOT IN ('finished')
      AND created_at > NOW() - INTERVAL '24 hours'
    ) INTO pin_exists;
  END LOOP;
  RETURN new_pin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 10. FUNCIÓN AUXILIAR: Calcular puntaje con racha y velocidad
-- ============================================================
CREATE OR REPLACE FUNCTION public.calculate_live_score(
  p_base_points INT,
  p_time_limit_ms INT,
  p_answer_time_ms INT,
  p_streak INT
)
RETURNS INT AS $$
DECLARE
  time_factor FLOAT;
  streak_multiplier FLOAT;
  raw_score FLOAT;
BEGIN
  -- Factor de tiempo: entre 0.5 y 1.0 (mínimo 50% si contesta al final)
  time_factor := 0.5 + (0.5 * GREATEST(0, (p_time_limit_ms - p_answer_time_ms)::FLOAT / p_time_limit_ms));

  -- Multiplicador por racha: cada 3 correctas +10%
  streak_multiplier := 1.0 + (FLOOR(p_streak / 3) * 0.1);
  streak_multiplier := LEAST(streak_multiplier, 2.0); -- Máximo x2

  raw_score := p_base_points * time_factor * streak_multiplier;

  RETURN GREATEST(10, ROUND(raw_score)); -- Mínimo 10 puntos si acierta
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ============================================================
-- LISTO: Schema de BIZEN Live creado exitosamente
-- 
-- Próximos pasos:
-- 1. Ejecutar este script en Supabase SQL Editor
-- 2. Habilitar Realtime para: live_sessions, live_participants,
--    live_answers, live_leaderboard_snapshots
-- 3. Implementar las rutas Next.js:
--    - /live/host → Panel del Host
--    - /live/join → Pantalla de unirse con PIN
--    - /live/play → Mando del jugador
-- ============================================================
