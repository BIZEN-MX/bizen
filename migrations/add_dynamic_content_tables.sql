-- Migración: Añadir tablas para Lecciones Dinámicas, Recursos, Reseñas y Notas
-- Nota: Omitiendo tabla de Entregas (Assignments) por petición del usuario.

-- 1. Tabla de Pasos de Lección (Dynamic Content)
CREATE TABLE IF NOT EXISTS public.lesson_steps (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    title TEXT,
    body TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Recursos de Lección (Descargas)
CREATE TABLE IF NOT EXISTS public.lesson_resources (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Reseñas de Cursos
CREATE TABLE IF NOT EXISTS public.course_reviews (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- 4. Tabla de Notas de Usuario
CREATE TABLE IF NOT EXISTS public.user_notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- 5. Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_lesson_steps_lesson ON public.lesson_steps(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson ON public.lesson_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON public.course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_lesson ON public.user_notes(user_id, lesson_id);

-- 6. Habilitar RLS (Row Level Security) - Ejemplo básico
-- ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
