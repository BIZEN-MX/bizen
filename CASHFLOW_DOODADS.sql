-- =====================================================
-- CASHFLOW GAME - DOODADS (Luxury Temptations)
-- These are expenses that drain cash with NO return
-- They teach players not to waste money on luxuries
-- =====================================================

-- Create doodads table (if not exists)
CREATE TABLE IF NOT EXISTS doodads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  cost INTEGER NOT NULL,
  category VARCHAR(50), -- toys, entertainment, fashion, travel, food
  rarity VARCHAR(20) DEFAULT 'common',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing doodads if any
DELETE FROM doodads;

-- Insert doodads (luxury temptations from the original game and more)
INSERT INTO doodads (name, description, cost, category, rarity)
VALUES
  -- Original Cashflow Doodads
  ('Big Screen TV', 'Nueva televisión 65 pulgadas 4K. ¡Perfecta para ver el fútbol!', 2000, 'entertainment', 'common'),
  ('Golf Clubs', 'Set premium de palos de golf. ¿Quién sabe? Podrías conocer inversores en el campo.', 1500, 'toys', 'common'),
  ('Boat', 'Lancha deportiva 20 pies. Fines de semana en el lago con la familia.', 5000, 'toys', 'uncommon'),
  ('Jet Ski', 'Moto acuática. ¡Diversión garantizada en el verano!', 3500, 'toys', 'uncommon'),
  ('Vacation to Hawaii', 'Dos semanas en Hawaii todo incluido. Te lo mereces después de tanto trabajo.', 4000, 'travel', 'uncommon'),
  ('Designer Watch', 'Reloj Rolex. Una inversión en tu imagen profesional, ¿verdad?', 7000, 'fashion', 'rare'),
  ('Luxury Car Upgrade', 'Cambiar tu auto por un BMW nuevo. Impresiona a los vecinos.', 15000, 'toys', 'rare'),
  
  -- Modern Doodads
  ('Gaming Console + Setup', 'PlayStation 5, TV, y juegos. Para "relajarte" después del trabajo.', 1800, 'entertainment', 'common'),
  ('Smart Home System', 'Alexa, Google Home, cámaras, termostatos inteligentes. ¡Tu casa del futuro!', 3000, 'toys', 'uncommon'),
  ('iPhone Pro Max', 'El último iPhone con todas las cámaras. Tu teléfono actual funciona bien pero...', 1500, 'toys', 'common'),
  ('Designer Sneakers', 'Zapatillas de edición limitada. Aumentarán de valor, ¿no? (Spoiler: no lo harán)', 800, 'fashion', 'common'),
  ('Expensive Dinner', 'Cena en restaurante 5 estrellas con vino. Celebra tu "éxito".', 500, 'food', 'common'),
  ('Gaming PC', 'PC gaming de alta gama. RGB por todas partes. Para "productividad".', 4000, 'entertainment', 'uncommon'),
  ('Concert VIP Tickets', 'Entradas VIP para ver a tu artista favorito. Incluye meet & greet.', 1200, 'entertainment', 'common'),
  
  -- Expensive Doodads
  ('Motorcycle', 'Harley Davidson. Crisis de mediana edad starter pack.', 8000, 'toys', 'rare'),
  ('Hot Tub', 'Jacuzzi para el patio. Para "terapia" y entretenimiento.', 6000, 'toys', 'uncommon'),
  ('Home Theater', 'Sistema de cine en casa completo. Proyector 4K, sonido surround 7.1.', 5500, 'entertainment', 'uncommon'),
  ('Luxury Vacation', 'Crucero por el Caribe, 10 días todo incluido. Suite con balcón.', 8000, 'travel', 'rare'),
  ('ATV/Quad', 'Cuatrimoto para "aventuras de fin de semana". Usada 2 veces al año.', 7500, 'toys', 'rare'),
  
  -- Small Temptations
  ('Expensive Coffee Habit', 'Suscripción anual a cafetería gourmet. Café de $6 diario.', 2200, 'food', 'common'),
  ('Gym Membership Premium', 'Membresía de gimnasio de lujo que nunca usarás completamente.', 1200, 'toys', 'common'),
  ('Designer Handbag', 'Bolsa de marca de diseñador. Está en descuento (todavía carísima).', 3000, 'fashion', 'uncommon'),
  ('Fancy Grill', 'Parrilla de gas premium con todos los accesorios. Para ser el rey del BBQ.', 2500, 'toys', 'common'),
  ('Wine Collection', 'Colección de vinos finos. Para "inversión" (te los beberás).', 3500, 'food', 'uncommon'),
  
  -- Modern Tech Doodads
  ('Drone with Camera', 'Drone profesional 4K. Úsalo una vez, luego junta polvo.', 2000, 'toys', 'common'),
  ('VR Headset', 'Realidad virtual de última generación. El futuro está aquí.', 1000, 'entertainment', 'common'),
  ('Electric Bike', 'E-bike premium. Está de moda y es "eco-friendly".', 4500, 'toys', 'uncommon'),
  ('Smartwatch Collection', 'Apple Watch Ultra + accesorios. Porque uno no es suficiente.', 1800, 'fashion', 'common'),
  ('Professional Camera', 'Cámara DSLR profesional. Convertirte en "fotógrafo".', 3500, 'toys', 'uncommon'),
  
  -- Social Status Doodads
  ('Country Club Membership', 'Membresía anual en club exclusivo. Networking... o esnobismo.', 5000, 'toys', 'rare'),
  ('Season Tickets', 'Boletos de temporada para tu equipo favorito. Todos los partidos en casa.', 4000, 'entertainment', 'uncommon'),
  ('Luxury Furniture', 'Muebles de diseñador para la sala. Tus amigos quedarán impresionados.', 6000, 'toys', 'uncommon'),
  ('Art Piece', 'Pintura "de inversión". Probablemente no aumente de valor.', 10000, 'toys', 'rare'),
  ('Pet Purebred', 'Perro o gato de raza pura. Adorable pero costoso de mantener.', 2000, 'toys', 'common');

-- Enable RLS (skip if already enabled)
DO $$ 
BEGIN
  ALTER TABLE doodads ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view doodads" ON doodads;

-- Create policy
CREATE POLICY "Anyone can view doodads"
  ON doodads FOR SELECT
  USING (true);

-- Grant permissions (skip errors if already granted)
DO $$ 
BEGIN
  GRANT ALL ON doodads TO authenticated;
  GRANT ALL ON SEQUENCE doodads_id_seq TO authenticated;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- =====================================================
-- TOTAL: 33 Doodads
-- =====================================================

