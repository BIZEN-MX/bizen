-- ============================================================
-- BIZEN: Seed Achievement Descriptions
-- Run this in your Supabase SQL Editor to update descriptions
-- for all achievements based on their title.
-- ============================================================

-- Aprendizaje / Learning
UPDATE public.achievements SET description = 'Completa tu primera lección en BIZEN. ¡El primer paso es el más importante!'
  WHERE title ILIKE '%primer%' OR title ILIKE '%primera%' OR (category = 'learning' AND threshold = 1);

UPDATE public.achievements SET description = 'Completa 5 lecciones en total. Estás construyendo el hábito de aprender.'
  WHERE category = 'learning' AND threshold = 5;

UPDATE public.achievements SET description = 'Completa 10 lecciones. Ya eres un estudiante serio de educación financiera.'
  WHERE category = 'learning' AND threshold = 10;

UPDATE public.achievements SET description = 'Completa 25 lecciones. Tu dedicación te pone por encima del 90% de los usuarios.'
  WHERE category = 'learning' AND threshold = 25;

UPDATE public.achievements SET description = 'Completa 50 lecciones. ¡Eres un verdadero experto en formación financiera!'
  WHERE category = 'learning' AND threshold = 50;

-- Racha / Streak
UPDATE public.achievements SET description = 'Mantén una racha de 3 días seguidos aprendiendo en BIZEN. Consejito: pon una alarma diaria.'
  WHERE category = 'streak' AND threshold = 3;

UPDATE public.achievements SET description = 'Mantén una racha de 7 días consecutivos. ¡Una semana completa aprendiendo!'
  WHERE category = 'streak' AND threshold = 7;

UPDATE public.achievements SET description = 'Mantén una racha de 30 días seguidos. La constancia es el secreto del éxito financiero.'
  WHERE category = 'streak' AND threshold = 30;

UPDATE public.achievements SET description = 'Mantén una racha de 100 días consecutivos. Eres una leyenda de la disciplina.'
  WHERE category = 'streak' AND threshold = 100;

-- Nivel / Level
UPDATE public.achievements SET description = 'Alcanza el nivel 5 acumulando XP. Completa lecciones y ejercicios para subir de nivel.'
  WHERE category = 'level' AND threshold = 5;

UPDATE public.achievements SET description = 'Alcanza el nivel 10. Ya llevas mucho camino recorrido en tu educación financiera.'
  WHERE category = 'level' AND threshold = 10;

UPDATE public.achievements SET description = 'Alcanza el nivel 20. Solo los más comprometidos llegan aquí. ¡Felicidades!'
  WHERE category = 'level' AND threshold = 20;

-- Monedas / Coins (Bizcoins)
UPDATE public.achievements SET description = 'Acumula 100 Bizcoins completando lecciones y actividades. Úsalos en la tienda.'
  WHERE category = 'coins' AND threshold = 100;

UPDATE public.achievements SET description = 'Acumula 500 Bizcoins. Eres todo un coleccionista de recompensas BIZEN.'
  WHERE category = 'coins' AND threshold = 500;

UPDATE public.achievements SET description = 'Acumula 1,000 Bizcoins. Con ellos puedes desbloquear artículos exclusivos en la tienda.'
  WHERE category = 'coins' AND threshold = 1000;

-- Foro / Community
UPDATE public.achievements SET description = 'Crea tu primera publicación en el foro de la comunidad BIZEN y empieza a conectar.'
  WHERE category = 'forum' AND threshold = 1;

UPDATE public.achievements SET description = 'Crea 5 publicaciones en el foro. Tu voz importa y enriquece la comunidad.'
  WHERE category = 'forum' AND threshold = 5;

UPDATE public.achievements SET description = 'Crea 20 publicaciones en el foro. Eres un pilar activo de la comunidad BIZEN.'
  WHERE category = 'forum' AND threshold = 20;

-- Fallback: si algún logro no tiene descripción aún, añadimos una genérica
UPDATE public.achievements 
  SET description = 'Sigue usando BIZEN para desbloquear este logro y conocer los detalles.'
  WHERE description IS NULL OR description = '';
