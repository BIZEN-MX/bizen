-- =====================================================
-- CASHFLOW GAME - ADDITIONAL OPPORTUNITY CARDS
-- 50+ diverse investment opportunities
-- =====================================================

-- Clear existing sample cards (optional - comment out if you want to keep them)
-- DELETE FROM opportunity_cards;

-- =====================================================
-- REAL ESTATE INVESTMENTS (30 cards)
-- =====================================================

-- Small Houses (Starter Deals)
INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES 
  ('real_estate', '1Br/1Ba Condo', 'Small studio condo in decent neighborhood. Good starter investment.', 2000, 25000, 23000, 50, 1, 28000, 35000, 'common'),
  ('real_estate', '2Br/1Ba House', 'Small starter home in working-class area.', 3000, 45000, 42000, 100, 2, 50000, 65000, 'common'),
  ('real_estate', '2Br/1Ba Condo', 'Waterfront condo with good rental demand.', 4000, 40000, 36000, 120, 2, 45000, 60000, 'common'),
  ('real_estate', '3Br/1Ba House', 'Family home in suburbs, steady renters.', 4500, 55000, 50500, 130, 3, 60000, 75000, 'common'),
  ('real_estate', '3Br/2Ba House', 'Well-maintained home with garage.', 5000, 65000, 60000, 140, 3, 70000, 85000, 'common'),
  ('real_estate', '2Br/2Ba Townhouse', 'Modern townhouse in growing area.', 5500, 60000, 54500, 160, 2, 68000, 82000, 'common');

-- Medium Houses
INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES
  ('real_estate', '4Br/2Ba House', 'Spacious family home with basement. High demand area.', 7000, 85000, 78000, 220, 4, 95000, 120000, 'uncommon'),
  ('real_estate', '3Br/2Ba Ranch', 'Ranch style home on large lot. Room to expand.', 6500, 75000, 68500, 180, 3, 85000, 105000, 'uncommon'),
  ('real_estate', '4Br/3Ba Colonial', 'Classic colonial in established neighborhood.', 8000, 95000, 87000, 250, 4, 110000, 135000, 'uncommon'),
  ('real_estate', 'Lake House', 'Vacation rental property near popular lake. Seasonal income.', 12000, 120000, 108000, 400, 3, 140000, 180000, 'uncommon');

-- Multi-Unit Properties
INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES
  ('real_estate', 'Duplex', 'Side-by-side duplex. Two income streams.', 8000, 120000, 112000, 380, 4, 130000, 155000, 'uncommon'),
  ('real_estate', 'Triplex', 'Three-unit building in college town. Student renters.', 12000, 180000, 168000, 650, 6, 200000, 240000, 'uncommon'),
  ('real_estate', '4-Plex', 'Four units, professionally managed. Stable income.', 15000, 220000, 205000, 800, 8, 250000, 295000, 'rare'),
  ('real_estate', '6-Plex Apartment', 'Six-unit apartment building in urban area.', 20000, 280000, 260000, 1050, 12, 310000, 365000, 'rare'),
  ('real_estate', '8-Plex Apartment', 'Eight units with on-site laundry. Great cash flow.', 25000, 300000, 275000, 1200, 16, 320000, 370000, 'rare'),
  ('real_estate', '12-Plex Complex', 'Large apartment complex with parking lot.', 35000, 450000, 415000, 2000, 24, 490000, 580000, 'rare'),
  ('real_estate', '20-Plex Apartment', 'Major apartment building. Professional management required.', 50000, 650000, 600000, 3500, 40, 700000, 850000, 'rare'),
  ('real_estate', '30-Plex Complex', 'Large residential complex with amenities.', 75000, 950000, 875000, 5200, 60, 1050000, 1250000, 'rare');

-- Commercial Real Estate
INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES
  ('real_estate', 'Retail Strip Mall', 'Small strip mall with 5 retail spaces. Multiple tenants.', 40000, 380000, 340000, 1800, 0, 420000, 520000, 'rare'),
  ('real_estate', 'Office Building', 'Three-story office building downtown. Long-term leases.', 60000, 580000, 520000, 3200, 0, 650000, 780000, 'rare'),
  ('real_estate', 'Warehouse', 'Industrial warehouse near highway. E-commerce boom.', 35000, 320000, 285000, 1500, 0, 360000, 440000, 'rare'),
  ('real_estate', 'Storage Units', 'Self-storage facility with 50 units. Low maintenance.', 30000, 280000, 250000, 1400, 0, 320000, 390000, 'uncommon'),
  ('real_estate', 'Mobile Home Park', '25-pad mobile home park. Land lease income.', 45000, 420000, 375000, 2200, 0, 480000, 580000, 'rare');

-- Fixer-Uppers & Special Deals
INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES
  ('real_estate', 'Foreclosure House', 'Bank foreclosure. Needs work but great location.', 3000, 35000, 32000, 80, 3, 55000, 75000, 'uncommon'),
  ('real_estate', 'Fixer-Upper', 'Distressed property. Low buy, high potential.', 2500, 30000, 27500, 60, 2, 50000, 70000, 'uncommon'),
  ('real_estate', 'Estate Sale House', 'Inherited property, motivated seller. Quick deal.', 4000, 48000, 44000, 110, 3, 65000, 85000, 'common'),
  ('real_estate', 'Tax Lien Property', 'Purchased at tax auction. Immediate positive cash flow.', 5000, 55000, 50000, 180, 3, 70000, 90000, 'uncommon');

-- Luxury Properties
INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES
  ('real_estate', 'Beachfront Condo', 'Luxury condo with ocean views. Vacation rental hotspot.', 25000, 250000, 225000, 1000, 2, 290000, 350000, 'rare'),
  ('real_estate', 'Mountain Cabin', 'Ski resort rental. High season income.', 18000, 180000, 162000, 700, 3, 210000, 270000, 'rare'),
  ('real_estate', 'Downtown Loft', 'Modern loft in trendy district. Young professionals love it.', 22000, 220000, 198000, 900, 2, 260000, 320000, 'rare');

-- =====================================================
-- STOCKS (15 cards)
-- =====================================================

INSERT INTO opportunity_cards (type, name, description, cost, shares, cash_flow, min_sale_price, max_sale_price, rarity)
VALUES
  -- Tech Stocks
  ('stock', 'MYT4U Tech Stock', 'Growing tech startup. High risk, high reward.', 5, 1000, 0, 10, 40, 'common'),
  ('stock', 'GRO4US Software', 'Established software company with dividends.', 10, 500, 20, 15, 45, 'common'),
  ('stock', 'OK4U Systems', 'Stable IT services company. Reliable dividends.', 20, 200, 10, 25, 40, 'common'),
  ('stock', 'TechFlow Inc', 'Cloud computing pioneer. No dividends yet.', 8, 800, 0, 12, 50, 'common'),
  ('stock', 'DataMine Corp', 'Big data analytics. Growing sector.', 15, 400, 15, 20, 60, 'uncommon'),
  
  -- Blue Chip Stocks
  ('stock', 'BigCo Industries', 'Fortune 500 company. Steady dividends.', 40, 100, 30, 45, 65, 'uncommon'),
  ('stock', 'MegaCorp Global', 'International conglomerate. Reliable returns.', 50, 80, 40, 55, 75, 'uncommon'),
  ('stock', 'Utility Power Co', 'Electric utility. Boring but stable.', 30, 150, 35, 35, 50, 'common'),
  
  -- Dividend Stocks
  ('stock', 'DividendKing Inc', 'REIT with high dividends. Consistent payout.', 25, 200, 50, 28, 45, 'uncommon'),
  ('stock', 'Income Trust', 'High-yield dividend stock. 6% annual yield.', 35, 120, 60, 38, 55, 'uncommon'),
  
  -- Growth Stocks
  ('stock', 'RocketStart Inc', 'Hyper-growth company. Volatile but promising.', 3, 2000, 0, 1, 60, 'rare'),
  ('stock', 'BioTech Pharma', 'Pharmaceutical research. FDA approvals pending.', 12, 600, 0, 5, 80, 'rare'),
  ('stock', 'GreenEnergy Corp', 'Renewable energy leader. Government subsidies.', 18, 300, 25, 22, 70, 'uncommon'),
  
  -- Penny Stocks
  ('stock', 'Penny Gold Mining', 'Speculative mining stock. High risk.', 1, 5000, 0, 0, 25, 'common'),
  ('stock', 'StartupVenture Co', 'New IPO. Could be next big thing or bust.', 6, 1200, 0, 2, 50, 'uncommon');

-- =====================================================
-- BUSINESSES (10 cards)
-- =====================================================

INSERT INTO opportunity_cards (type, name, description, cost, cash_flow, rarity)
VALUES
  ('business', 'Car Wash', 'Automated car wash. Low maintenance, steady income.', 50000, 1000, 'uncommon'),
  ('business', 'Laundromat', 'Self-service laundry. Cash business in dense neighborhood.', 45000, 950, 'uncommon'),
  ('business', 'Vending Machine Route', '20 vending machines in office buildings.', 30000, 600, 'common'),
  ('business', 'ATM Business', '10 ATMs in high-traffic locations.', 35000, 700, 'common'),
  ('business', 'Food Truck', 'Popular food truck with established route.', 40000, 800, 'uncommon'),
  ('business', 'Franchise Restaurant', 'Fast food franchise. Brand recognition.', 150000, 5000, 'rare'),
  ('business', 'Gas Station', 'Convenience store and gas pumps. 24/7 operation.', 200000, 8000, 'rare'),
  ('business', 'Fitness Center', 'Small gym with 200 members. Recurring revenue.', 120000, 4000, 'rare'),
  ('business', 'Online Store', 'E-commerce business. Dropshipping model.', 25000, 500, 'common'),
  ('business', 'Rental Car Fleet', '15 vehicles for airport rentals.', 180000, 6500, 'rare');

-- =====================================================
-- LIMITED PARTNERSHIPS (5 cards)
-- =====================================================

INSERT INTO opportunity_cards (type, name, description, cost, cash_flow, rarity)
VALUES
  ('limited_partnership', 'Oil Drilling Partnership', 'Speculative oil venture in Texas. High risk, high reward.', 5000, 500, 'rare'),
  ('limited_partnership', 'Real Estate Syndication', 'Pool investment in commercial property.', 10000, 800, 'uncommon'),
  ('limited_partnership', 'Private Equity Fund', 'Limited partner in startup fund. 5-year lockup.', 15000, 1200, 'rare'),
  ('limited_partnership', 'Wind Farm Investment', 'Green energy project. Tax benefits included.', 12000, 900, 'rare'),
  ('limited_partnership', 'Movie Production', 'Independent film funding. Could be a hit!', 8000, 0, 'rare');

-- =====================================================
-- TOTALS
-- =====================================================
-- Real Estate: 30 cards
-- Stocks: 15 cards
-- Businesses: 10 cards
-- Limited Partnerships: 5 cards
-- TOTAL: 60 new opportunity cards

-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================

