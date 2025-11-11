-- =====================================================
-- CASHFLOW GAME - FAST TRACK OPPORTUNITIES
-- Big deals for players who escaped the rat race
-- Goal: Reach $50,000 in passive income
-- =====================================================

-- =====================================================
-- MEGA REAL ESTATE DEALS
-- =====================================================

INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES
  -- Luxury Properties
  ('real_estate', 'Beachfront Resort Condo', 'Premium oceanfront condo in tourist destination. Peak season rates.', 80000, 800000, 720000, 4500, 3, 900000, 1200000, 'rare'),
  ('real_estate', 'Penthouse Suite', 'Top floor penthouse in downtown high-rise. Executive clientele.', 120000, 1200000, 1080000, 7000, 4, 1350000, 1600000, 'rare'),
  ('real_estate', 'Mountain Resort Lodge', 'Ski resort property with 6 units. Winter season gold mine.', 150000, 1500000, 1350000, 9000, 12, 1700000, 2100000, 'rare'),
  
  -- Mega Apartment Complexes
  ('real_estate', '50-Unit Apartment Complex', 'Major complex with pool, gym, parking. Professional property management.', 150000, 1800000, 1650000, 12000, 100, 2000000, 2500000, 'rare'),
  ('real_estate', '75-Unit Student Housing', 'Purpose-built student apartments near major university. Guaranteed occupancy.', 200000, 2500000, 2300000, 16000, 150, 2800000, 3500000, 'rare'),
  ('real_estate', '100-Unit High-Rise', 'Downtown high-rise apartment tower. Premium rents.', 300000, 3500000, 3200000, 22000, 200, 3900000, 4800000, 'rare'),
  
  -- Commercial Mega Deals
  ('real_estate', 'Shopping Center', 'Suburban shopping center with 15 retail spaces and anchor tenant.', 250000, 2800000, 2550000, 18000, 0, 3200000, 4000000, 'rare'),
  ('real_estate', 'Office Tower', '10-story downtown office building. Multiple corporate tenants.', 400000, 4500000, 4100000, 28000, 0, 5000000, 6200000, 'rare'),
  ('real_estate', 'Industrial Park', 'Business park with 8 warehouse units. E-commerce boom.', 180000, 2200000, 2020000, 14000, 0, 2500000, 3100000, 'rare'),
  ('real_estate', 'Hotel Property', '120-room hotel near airport. Established business.', 500000, 5500000, 5000000, 35000, 0, 6000000, 7500000, 'rare');

-- =====================================================
-- MAJOR BUSINESS ACQUISITIONS
-- =====================================================

INSERT INTO opportunity_cards (type, name, description, cost, cash_flow, rarity)
VALUES
  ('business', 'Restaurant Chain (5 locations)', 'Established restaurant franchise with 5 profitable locations.', 450000, 15000, 'rare'),
  ('business', 'Car Dealership', 'Auto dealership with service center. Established customer base.', 800000, 28000, 'rare'),
  ('business', 'Manufacturing Business', 'Small manufacturing company with contracts. Equipment included.', 650000, 22000, 'rare'),
  ('business', 'Distribution Company', 'Wholesale distribution with delivery fleet and warehouses.', 550000, 18000, 'rare'),
  ('business', 'Tech Startup (Exit)', 'Buy out successful tech startup. Proven product, growing users.', 900000, 35000, 'rare'),
  ('business', 'Apartment Management Co', 'Property management firm managing 500+ units. Recurring revenue.', 380000, 12000, 'rare'),
  ('business', 'Medical Practice', 'Established dental practice with 3 dentists. Patient base included.', 420000, 14000, 'rare'),
  ('business', 'Construction Company', 'General contractor business. Backlog of projects.', 520000, 17000, 'rare'),
  ('business', 'Logistics Company', 'Trucking and logistics with 20 trucks and contracts.', 750000, 25000, 'rare'),
  ('business', 'Solar Installation Co', 'Growing solar panel installation business. Government incentives.', 480000, 16000, 'rare');

-- =====================================================
-- MEGA STOCK DEALS
-- =====================================================

INSERT INTO opportunity_cards (type, name, description, cost, shares, cash_flow, min_sale_price, max_sale_price, rarity)
VALUES
  ('stock', 'Blue Chip Portfolio', 'Diversified portfolio of Fortune 500 stocks. Strong dividends.', 100, 2000, 200, 120, 180, 'rare'),
  ('stock', 'REIT Portfolio', 'Real Estate Investment Trust portfolio. Commercial properties.', 80, 1500, 150, 95, 140, 'rare'),
  ('stock', 'Dividend Aristocrats', 'Portfolio of companies with 25+ years of dividend growth.', 120, 1000, 180, 135, 190, 'rare'),
  ('stock', 'Tech Giant Stock', 'Major tech company stock. Growth plus dividends.', 150, 500, 100, 180, 280, 'rare'),
  ('stock', 'International Fund', 'Emerging markets fund. High growth potential.', 60, 2500, 120, 75, 150, 'rare');

-- =====================================================
-- LIMITED PARTNERSHIPS (Big Deals)
-- =====================================================

INSERT INTO opportunity_cards (type, name, description, cost, cash_flow, rarity)
VALUES
  ('limited_partnership', 'Commercial Development', 'New shopping center development. 5-year project.', 100000, 8000, 'rare'),
  ('limited_partnership', 'Tech Venture Capital', 'VC fund investing in startups. High risk, huge potential.', 150000, 0, 'rare'),
  ('limited_partnership', 'Hotel Development', 'New hotel construction project. Opens in 2 years.', 200000, 12000, 'rare'),
  ('limited_partnership', 'Renewable Energy Farm', 'Solar/wind farm investment. Government contracts.', 180000, 10000, 'rare'),
  ('limited_partnership', 'Medical Real Estate', 'Medical office building development. Long-term leases.', 140000, 9000, 'rare');

-- =====================================================
-- Mark Fast Track cards (add is_fast_track column if needed)
-- =====================================================

-- Add column for Fast Track identification
ALTER TABLE opportunity_cards 
ADD COLUMN IF NOT EXISTS is_fast_track BOOLEAN DEFAULT FALSE;

-- Mark all expensive cards as Fast Track (cost > $200K or cash flow > $5K)
UPDATE opportunity_cards 
SET is_fast_track = TRUE 
WHERE cost > 200000 OR (cash_flow IS NOT NULL AND cash_flow > 5000);

-- =====================================================
-- TOTALS FOR FAST TRACK
-- =====================================================
-- Real Estate: 10 mega properties
-- Businesses: 10 major acquisitions
-- Stocks: 5 large portfolios
-- Limited Partnerships: 5 major deals
-- TOTAL: 30 Fast Track opportunities

-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================

