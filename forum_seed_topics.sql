-- Seed Forum Topics
-- Run this to add default forum categories

INSERT INTO "forum_topics" ("id", "name", "slug", "description", "icon", "order_index", "created_at")
VALUES 
  ('topic-1', 'Ideas & Validation', 'ideas-validation', 'Comparte y valida ideas de negocio', NULL, 1, NOW()),
  ('topic-2', 'Producto & MVP', 'producto-mvp', 'Desarrollo de producto y MVP', NULL, 2, NOW()),
  ('topic-3', 'Marketing & Ventas', 'marketing-ventas', 'Estrategias de marketing y ventas', NULL, 3, NOW()),
  ('topic-4', 'Financiamiento', 'financiamiento', 'Obtener inversión y gestión financiera', NULL, 4, NOW()),
  ('topic-5', 'Legal & Impuestos', 'legal-impuestos', 'Aspectos legales y fiscales', NULL, 5, NOW()),
  ('topic-6', 'Equipo & Talento', 'equipo-talento', 'Contratación y gestión de equipo', NULL, 6, NOW()),
  ('topic-7', 'Operaciones', 'operaciones', 'Escalamiento y operaciones diarias', NULL, 7, NOW()),
  ('topic-8', 'Otros', 'otros', 'Temas generales y preguntas variadas', NULL, 8, NOW())
ON CONFLICT ("id") DO UPDATE SET "icon" = NULL;

-- Remove emojis from existing topics (run this to update existing categories)
UPDATE "forum_topics" SET "icon" = NULL WHERE "icon" IS NOT NULL;

