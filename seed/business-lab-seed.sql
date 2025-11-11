-- ========================================
-- BUSINESS LAB SEED DATA
-- ========================================
-- Seeds initial tracks, steps, and templates for the Business Lab

-- ========================================
-- 1. SEED LAB TRACKS
-- ========================================

INSERT INTO lab_tracks (id, key, title, description, "order") VALUES
('trk_discover', 'discover', 'Descubrir', 'Identifica problemas reales, valida tu idea inicial y define tu propuesta de valor.', 1),
('trk_validate', 'validate', 'Validar', 'Prueba tu idea con usuarios reales, ejecuta experimentos y valida tu mercado.', 2),
('trk_build', 'build', 'Construir MVP', 'Construye tu producto mínimo viable y prepara tu modelo de negocio.', 3),
('trk_launch', 'launch', 'Lanzar', 'Prepara y ejecuta el lanzamiento de tu startup al mercado.', 4),
('trk_grow', 'grow', 'Crecer', 'Escala tu negocio, optimiza procesos y aumenta tu alcance.', 5),
('trk_pitch', 'pitch', 'Pitch', 'Prepara tu presentación para inversionistas y practica tu discurso.', 6)
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- 2. SEED LAB STEPS - DISCOVER TRACK
-- ========================================

INSERT INTO lab_steps (id, track_id, title, description, "order", required, goal) VALUES
-- Discover track
('step_discover_1', 'trk_discover', 'Identifica un Problema', 'Encuentra un problema real que afecte a un grupo específico de personas.', 1, true, 'Definir claramente el problema que vas a resolver'),
('step_discover_2', 'trk_discover', 'Define tu Cliente', 'Crea perfiles detallados de tus clientes ideales (buyer personas).', 2, true, 'Conocer profundamente a quién le vas a vender'),
('step_discover_3', 'trk_discover', 'Propuesta de Valor', 'Define qué hace única tu solución y por qué alguien pagaría por ella.', 3, true, 'Articular tu propuesta de valor única'),
('step_discover_4', 'trk_discover', 'Investiga el Mercado', 'Analiza tu competencia, tamaño de mercado y oportunidades.', 4, true, 'Entender el panorama competitivo'),
('step_discover_5', 'trk_discover', 'Lean Canvas', 'Completa tu primer Lean Canvas con todo lo aprendido.', 5, true, 'Tener una visión clara del modelo de negocio'),

-- Validate track
('step_validate_1', 'trk_validate', 'Entrevistas a Clientes', 'Diseña y ejecuta entrevistas con clientes potenciales.', 1, true, 'Validar hipótesis con usuarios reales'),
('step_validate_2', 'trk_validate', 'Experimentos de Validación', 'Crea y ejecuta experimentos para probar tu idea.', 2, true, 'Obtener datos reales del mercado'),
('step_validate_3', 'trk_validate', 'Landing Page Test', 'Crea una landing page y mide el interés real.', 3, true, 'Probar demanda antes de construir'),
('step_validate_4', 'trk_validate', 'Define Métricas Clave', 'Identifica los KPIs que medirán el éxito de tu negocio.', 4, true, 'Saber qué medir para tomar decisiones'),
('step_validate_5', 'trk_validate', 'Análisis de Resultados', 'Analiza datos y decide: pivotar, perseverar o parar.', 5, true, 'Tomar decisión informada sobre siguiente paso'),

-- Build MVP track
('step_build_1', 'trk_build', 'Funcionalidades Clave', 'Define las funcionalidades mínimas esenciales para tu MVP.', 1, true, 'Priorizar qué construir primero'),
('step_build_2', 'trk_build', 'Diseño de Experiencia', 'Diseña la experiencia de usuario (UX) de tu producto.', 2, true, 'Crear una experiencia simple y efectiva'),
('step_build_3', 'trk_build', 'Modelo de Ingresos', 'Define cómo vas a generar ingresos (precios, planes, etc.).', 3, true, 'Establecer estrategia de monetización'),
('step_build_4', 'trk_build', 'Plan de Construcción', 'Crea un plan realista de desarrollo con tiempos y recursos.', 4, true, 'Tener una ruta clara de ejecución'),
('step_build_5', 'trk_build', 'MVP Listo', 'Construye y prueba tu MVP con primeros usuarios.', 5, true, 'Tener un producto funcional mínimo'),

-- Launch track
('step_launch_1', 'trk_launch', 'Estrategia de Lanzamiento', 'Planea cómo y dónde lanzarás tu producto.', 1, true, 'Definir plan de lanzamiento'),
('step_launch_2', 'trk_launch', 'Material de Marketing', 'Crea copys, imágenes y contenido para tu lanzamiento.', 2, true, 'Preparar materiales de comunicación'),
('step_launch_3', 'trk_launch', 'Canales de Adquisición', 'Identifica y prepara tus canales de adquisición de clientes.', 3, true, 'Saber dónde encontrar tus clientes'),
('step_launch_4', 'trk_launch', 'Primeras Ventas', 'Ejecuta tu lanzamiento y consigue tus primeros clientes pagando.', 4, true, 'Obtener tracción inicial'),
('step_launch_5', 'trk_launch', 'Feedback y Ajustes', 'Recolecta feedback de primeros usuarios y optimiza.', 5, true, 'Iterar basado en feedback real'),

-- Grow track
('step_grow_1', 'trk_grow', 'Optimiza tu Embudo', 'Analiza y optimiza tu funnel de conversión.', 1, true, 'Mejorar tasas de conversión'),
('step_grow_2', 'trk_grow', 'Estrategia de Crecimiento', 'Define tu estrategia de crecimiento (viral, pagado, contenido).', 2, true, 'Establecer plan de escalamiento'),
('step_grow_3', 'trk_grow', 'Operaciones y Procesos', 'Documenta y optimiza tus procesos operativos clave.', 3, true, 'Crear sistemas escalables'),
('step_grow_4', 'trk_grow', 'Construye tu Equipo', 'Identifica roles clave y empieza a formar tu equipo.', 4, true, 'Preparar estructura de equipo'),
('step_grow_5', 'trk_grow', 'Análisis Financiero', 'Crea proyecciones financieras y analiza unit economics.', 5, true, 'Entender la salud financiera'),

-- Pitch track
('step_pitch_1', 'trk_pitch', 'Estructura tu Pitch', 'Crea la estructura de tu presentación para inversionistas.', 1, true, 'Tener narrativa clara y convincente'),
('step_pitch_2', 'trk_pitch', 'Deck de Presentación', 'Diseña tu pitch deck con las slides esenciales.', 2, true, 'Preparar presentación visual'),
('step_pitch_3', 'trk_pitch', 'One Pager', 'Crea un documento de una página que resuma tu negocio.', 3, true, 'Tener resumen ejecutivo listo'),
('step_pitch_4', 'trk_pitch', 'Practica tu Pitch', 'Practica tu presentación y prepara respuestas a preguntas.', 4, true, 'Dominar tu discurso'),
('step_pitch_5', 'trk_pitch', 'Análisis de Riesgos', 'Identifica y prepara respuestas para posibles objeciones.', 5, true, 'Anticipar y mitigar objeciones')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. SEED LAB TEMPLATES
-- ========================================

INSERT INTO lab_templates (id, code, title, description, schema, sample, category) VALUES
('tpl_persona', 'persona', 'Perfil de Cliente (Buyer Persona)', 'Template para crear perfiles detallados de tus clientes ideales.', 
'{
  "fields": [
    {"name": "nombre", "type": "text", "label": "Nombre"},
    {"name": "edad", "type": "number", "label": "Edad"},
    {"name": "ocupacion", "type": "text", "label": "Ocupación"},
    {"name": "ingresos", "type": "text", "label": "Nivel de ingresos"},
    {"name": "objetivos", "type": "textarea", "label": "Objetivos y motivaciones"},
    {"name": "frustraciones", "type": "textarea", "label": "Frustraciones y dolores"},
    {"name": "canales", "type": "textarea", "label": "Canales que usa"},
    {"name": "comportamiento", "type": "textarea", "label": "Comportamiento de compra"}
  ]
}'::jsonb,
'María, 32 años, emprendedora digital. Busca herramientas simples que le ahorren tiempo. Se frustra con plataformas complejas.',
'discovery'),

('tpl_lean_canvas', 'lean-canvas', 'Lean Canvas', 'Template del Lean Canvas para modelar tu negocio.',
'{
  "fields": [
    {"name": "problema", "type": "textarea", "label": "Problema"},
    {"name": "segmentos", "type": "textarea", "label": "Segmentos de clientes"},
    {"name": "propuesta_valor", "type": "textarea", "label": "Propuesta única de valor"},
    {"name": "solucion", "type": "textarea", "label": "Solución"},
    {"name": "canales", "type": "textarea", "label": "Canales"},
    {"name": "ingresos", "type": "textarea", "label": "Fuentes de ingreso"},
    {"name": "costos", "type": "textarea", "label": "Estructura de costos"},
    {"name": "metricas", "type": "textarea", "label": "Métricas clave"},
    {"name": "ventaja", "type": "textarea", "label": "Ventaja competitiva"}
  ]
}'::jsonb,
'Un canvas completo que visualiza tu modelo de negocio en una página.',
'planning'),

('tpl_experiment', 'experiment', 'Plan de Experimento', 'Template para diseñar experimentos de validación.',
'{
  "fields": [
    {"name": "hipotesis", "type": "textarea", "label": "Hipótesis a validar"},
    {"name": "metrica", "type": "text", "label": "Métrica de éxito"},
    {"name": "objetivo", "type": "text", "label": "Objetivo numérico"},
    {"name": "metodo", "type": "textarea", "label": "Método de validación"},
    {"name": "recursos", "type": "textarea", "label": "Recursos necesarios"},
    {"name": "duracion", "type": "text", "label": "Duración del experimento"},
    {"name": "criterio_exito", "type": "textarea", "label": "Criterio de éxito"}
  ]
}'::jsonb,
'Creo que el 10% de visitantes se registrarán si ofrezco una prueba gratis de 7 días.',
'validation'),

('tpl_pitch_outline', 'pitch-outline', 'Estructura de Pitch', 'Outline para tu presentación de inversionistas.',
'{
  "fields": [
    {"name": "problema", "type": "textarea", "label": "El Problema (1 min)"},
    {"name": "solucion", "type": "textarea", "label": "Tu Solución (1 min)"},
    {"name": "mercado", "type": "textarea", "label": "Oportunidad de Mercado (1 min)"},
    {"name": "producto", "type": "textarea", "label": "Producto/Demo (2 min)"},
    {"name": "traccion", "type": "textarea", "label": "Tracción (1 min)"},
    {"name": "modelo_negocio", "type": "textarea", "label": "Modelo de Negocio (1 min)"},
    {"name": "competencia", "type": "textarea", "label": "Competencia (1 min)"},
    {"name": "equipo", "type": "textarea", "label": "Equipo (1 min)"},
    {"name": "financiamiento", "type": "textarea", "label": "Financiamiento (30 seg)"},
    {"name": "vision", "type": "textarea", "label": "Visión (30 seg)"}
  ]
}'::jsonb,
'Una estructura de 10 minutos para presentar tu startup a inversionistas.',
'pitch'),

('tpl_one_pager', 'one-pager', 'One Pager', 'Resumen ejecutivo de una página de tu startup.',
'{
  "fields": [
    {"name": "nombre", "type": "text", "label": "Nombre de la Startup"},
    {"name": "tagline", "type": "text", "label": "Tagline"},
    {"name": "problema", "type": "textarea", "label": "Problema"},
    {"name": "solucion", "type": "textarea", "label": "Solución"},
    {"name": "mercado", "type": "textarea", "label": "Tamaño de Mercado"},
    {"name": "traccion", "type": "textarea", "label": "Tracción Actual"},
    {"name": "modelo", "type": "textarea", "label": "Modelo de Negocio"},
    {"name": "equipo", "type": "textarea", "label": "Equipo Fundador"},
    {"name": "pedido", "type": "textarea", "label": "El Pedido"}
  ]
}'::jsonb,
'Un documento conciso que resume tu startup para inversionistas y stakeholders.',
'pitch'),

('tpl_interview_script', 'interview-script', 'Guión de Entrevista', 'Template para entrevistar clientes potenciales.',
'{
  "fields": [
    {"name": "objetivo", "type": "textarea", "label": "Objetivo de la entrevista"},
    {"name": "introduccion", "type": "textarea", "label": "Introducción"},
    {"name": "preguntas_contexto", "type": "textarea", "label": "Preguntas de contexto"},
    {"name": "preguntas_problema", "type": "textarea", "label": "Preguntas sobre el problema"},
    {"name": "preguntas_solucion", "type": "textarea", "label": "Preguntas sobre soluciones actuales"},
    {"name": "cierre", "type": "textarea", "label": "Cierre y próximos pasos"}
  ]
}'::jsonb,
'Un guión estructurado para extraer insights valiosos de tus entrevistas.',
'validation'),

('tpl_value_prop', 'value-prop', 'Propuesta de Valor', 'Canvas de propuesta de valor (Value Proposition Canvas).',
'{
  "fields": [
    {"name": "trabajos_cliente", "type": "textarea", "label": "Trabajos del cliente"},
    {"name": "frustraciones", "type": "textarea", "label": "Frustraciones"},
    {"name": "ganancias", "type": "textarea", "label": "Ganancias deseadas"},
    {"name": "productos_servicios", "type": "textarea", "label": "Productos y servicios"},
    {"name": "aliviadores", "type": "textarea", "label": "Aliviadores de frustraciones"},
    {"name": "creadores_ganancia", "type": "textarea", "label": "Creadores de ganancia"}
  ]
}'::jsonb,
'Mapea cómo tu producto alivia frustraciones y crea ganancias para tu cliente.',
'discovery'),

('tpl_mvp_spec', 'mvp-spec', 'Especificación de MVP', 'Define las funcionalidades de tu MVP.',
'{
  "fields": [
    {"name": "vision", "type": "textarea", "label": "Visión del producto"},
    {"name": "usuario_objetivo", "type": "textarea", "label": "Usuario objetivo"},
    {"name": "problema_core", "type": "textarea", "label": "Problema central"},
    {"name": "funcionalidades_must", "type": "textarea", "label": "Funcionalidades esenciales (Must Have)"},
    {"name": "funcionalidades_nice", "type": "textarea", "label": "Funcionalidades deseables (Nice to Have)"},
    {"name": "fuera_scope", "type": "textarea", "label": "Fuera del scope (v1)"},
    {"name": "criterio_exito", "type": "textarea", "label": "Criterios de éxito"}
  ]
}'::jsonb,
'Define claramente qué incluir y qué NO incluir en tu primera versión.',
'build')
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'Business Lab seed data inserted successfully!';
  RAISE NOTICE 'Created 6 tracks, 30 steps, and 8 templates.';
END $$;

