-- =====================================================
-- CASHFLOW GAME - DATABASE SCHEMA
-- Digital version of Robert Kiyosaki's Cashflow board game
-- =====================================================

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS game_events CASCADE;
DROP TABLE IF EXISTS player_investments CASCADE;
DROP TABLE IF EXISTS player_liabilities CASCADE;
DROP TABLE IF EXISTS player_doodads CASCADE;
DROP TABLE IF EXISTS opportunity_cards CASCADE;
DROP TABLE IF EXISTS market_cards CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS professions CASCADE;

-- =====================================================
-- PROFESSIONS (Starting careers with different income/expense ratios)
-- =====================================================
CREATE TABLE professions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Income Statement
  salary INTEGER NOT NULL,
  
  -- Expenses
  taxes INTEGER NOT NULL,
  home_mortgage_payment INTEGER NOT NULL,
  school_loan_payment INTEGER NOT NULL,
  car_loan_payment INTEGER NOT NULL,
  credit_card_payment INTEGER NOT NULL,
  retail_payment INTEGER NOT NULL,
  other_expenses INTEGER NOT NULL,
  child_expense INTEGER NOT NULL, -- per child
  
  -- Liabilities
  home_mortgage INTEGER NOT NULL,
  school_loans INTEGER NOT NULL,
  car_loans INTEGER NOT NULL,
  credit_cards INTEGER NOT NULL,
  retail_debt INTEGER NOT NULL,
  
  -- Starting assets
  starting_cash INTEGER NOT NULL,
  starting_savings INTEGER NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default professions from the original game
INSERT INTO professions (name, description, salary, taxes, home_mortgage_payment, school_loan_payment, 
  car_loan_payment, credit_card_payment, retail_payment, other_expenses, child_expense,
  home_mortgage, school_loans, car_loans, credit_cards, retail_debt, starting_cash, starting_savings) 
VALUES 
  ('Janitor', 'Humble beginnings, lowest income but also lowest expenses', 
    1600, 280, 200, 0, 60, 60, 50, 140, 60,
    20000, 0, 4000, 2000, 1000, 560, 0),
  
  ('Secretary', 'Administrative professional with moderate income',
    2500, 460, 400, 0, 100, 90, 50, 230, 110,
    38000, 0, 6000, 3000, 2000, 710, 0),
  
  ('Teacher', 'Educator with steady income and moderate debt',
    3300, 630, 500, 60, 140, 120, 50, 310, 150,
    50000, 12000, 9000, 4000, 3000, 400, 0),
  
  ('Truck Driver', 'Blue collar worker with good income',
    2500, 460, 300, 0, 100, 90, 50, 230, 110,
    30000, 0, 6000, 4000, 2000, 750, 0),
  
  ('Mechanic', 'Skilled trade professional',
    2000, 360, 300, 0, 100, 60, 50, 180, 90,
    31000, 0, 6000, 2000, 1000, 670, 0),
  
  ('Nurse', 'Healthcare professional with moderate income and debt',
    3100, 600, 400, 30, 100, 90, 50, 300, 140,
    47000, 6000, 5000, 3000, 1000, 480, 0),
  
  ('Police Officer', 'Public servant with steady income',
    3000, 580, 400, 0, 100, 60, 50, 280, 140,
    46000, 0, 5000, 2000, 1000, 520, 0),
  
  ('Engineer', 'Technical professional with higher income and debt',
    4900, 1050, 700, 60, 140, 120, 50, 390, 240,
    75000, 12000, 7000, 4000, 3000, 400, 0),
  
  ('Lawyer', 'High income professional with significant debt',
    7500, 1830, 1100, 390, 220, 180, 50, 650, 380,
    115000, 78000, 11000, 6000, 4000, 400, 0),
  
  ('Doctor', 'Highest income but also highest expenses and debt',
    13200, 3420, 1900, 750, 380, 270, 50, 1050, 640,
    202000, 150000, 19000, 10000, 7000, 400, 0),
  
  ('Airline Pilot', 'High income with significant expenses',
    9500, 2350, 1000, 0, 300, 660, 50, 700, 480,
    143000, 0, 15000, 22000, 6000, 400, 0),
  
  ('Business Manager', 'Corporate professional with good income',
    4600, 910, 700, 0, 120, 120, 50, 390, 240,
    75000, 0, 6000, 4000, 3000, 400, 0);

-- =====================================================
-- GAME SESSIONS (for single or multiplayer games)
-- =====================================================
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Game state
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, paused, completed, abandoned
  current_phase VARCHAR(20) DEFAULT 'rat_race', -- rat_race, fast_track
  
  -- Timestamps
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Game statistics
  total_turns INTEGER DEFAULT 0,
  duration_minutes INTEGER, -- calculated when game ends
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  CONSTRAINT valid_phase CHECK (current_phase IN ('rat_race', 'fast_track'))
);

-- =====================================================
-- PLAYERS (one per game session for single-player, multiple for multiplayer)
-- =====================================================
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  game_session_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profession_id INTEGER NOT NULL REFERENCES professions(id),
  
  -- Current financial position
  cash_on_hand INTEGER NOT NULL,
  savings INTEGER DEFAULT 0,
  
  -- Number of children (affects expenses)
  num_children INTEGER DEFAULT 0,
  
  -- Game progress
  current_position INTEGER DEFAULT 0, -- position on board (0-based)
  is_on_fast_track BOOLEAN DEFAULT FALSE,
  has_escaped_rat_race BOOLEAN DEFAULT FALSE,
  escaped_at TIMESTAMP,
  
  -- Turn tracking
  current_turn INTEGER DEFAULT 1,
  
  -- Calculated fields (updated after each action)
  total_income INTEGER, -- salary + passive income
  total_expenses INTEGER, -- all monthly expenses
  passive_income INTEGER DEFAULT 0, -- income from assets
  cash_flow INTEGER, -- total_income - total_expenses
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(game_session_id, user_id)
);

-- =====================================================
-- OPPORTUNITY CARDS (investments available to players)
-- =====================================================
CREATE TABLE opportunity_cards (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- real_estate, stock, business, limited_partnership
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Purchase details
  down_payment INTEGER, -- for real estate
  cost INTEGER NOT NULL, -- full purchase price or stock price per share
  mortgage INTEGER, -- for real estate
  
  -- Income generation
  cash_flow INTEGER, -- monthly cash flow (can be negative)
  
  -- For stocks and businesses
  shares INTEGER, -- number of shares (for stocks)
  
  -- Sale conditions
  min_sale_price INTEGER, -- minimum price to sell
  max_sale_price INTEGER, -- maximum price to sell
  
  -- For real estate
  bedrooms INTEGER, -- for house type
  
  -- Metadata
  rarity VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_type CHECK (type IN ('real_estate', 'stock', 'business', 'limited_partnership')),
  CONSTRAINT valid_rarity CHECK (rarity IN ('common', 'uncommon', 'rare'))
);

-- Sample opportunity cards (Real Estate examples)
INSERT INTO opportunity_cards (type, name, description, down_payment, cost, mortgage, cash_flow, bedrooms, min_sale_price, max_sale_price, rarity)
VALUES 
  ('real_estate', '3Br/2Ba House', 'Small family home with positive cash flow', 5000, 65000, 60000, 140, 3, 70000, 85000, 'common'),
  ('real_estate', '2Br/1Ba House', 'Starter home investment', 3000, 45000, 42000, 100, 2, 50000, 65000, 'common'),
  ('real_estate', 'Duplex', 'Multi-unit property with good returns', 8000, 120000, 112000, 380, 4, 130000, 155000, 'uncommon'),
  ('real_estate', '8-Plex Apartment', 'Large apartment building', 25000, 300000, 275000, 1200, 8, 320000, 370000, 'rare'),
  ('real_estate', '20-Plex Apartment', 'Major apartment complex', 50000, 650000, 600000, 3500, 20, 700000, 850000, 'rare');

-- Sample opportunity cards (Stocks)
INSERT INTO opportunity_cards (type, name, description, cost, shares, cash_flow, min_sale_price, max_sale_price, rarity)
VALUES 
  ('stock', 'MYT4U Stock', 'Growing tech company', 5, 1000, 0, 10, 40, 'common'),
  ('stock', 'GRO4US Stock', 'Dividend-paying stock', 10, 500, 20, 15, 45, 'common'),
  ('stock', 'OK4U Stock', 'Stable blue chip stock', 20, 200, 10, 25, 40, 'common');

-- Sample opportunity cards (Business)
INSERT INTO opportunity_cards (type, name, description, cost, cash_flow, rarity)
VALUES 
  ('business', 'Car Wash', 'Automated car wash business', 50000, 1000, 'uncommon'),
  ('business', 'Laundromat', 'Self-service laundry facility', 45000, 950, 'uncommon'),
  ('business', 'Franchise', 'Fast food franchise opportunity', 150000, 5000, 'rare');

-- Sample opportunity cards (Limited Partnerships)
INSERT INTO opportunity_cards (type, name, description, cost, cash_flow, rarity)
VALUES 
  ('limited_partnership', 'Oil Drilling Partnership', 'High-risk, high-reward oil venture', 5000, 500, 'rare'),
  ('limited_partnership', 'Real Estate Partnership', 'Pooled real estate investment', 10000, 800, 'uncommon');

-- =====================================================
-- PLAYER INVESTMENTS (assets owned by players)
-- =====================================================
CREATE TABLE player_investments (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  opportunity_card_id INTEGER NOT NULL REFERENCES opportunity_cards(id),
  
  -- Purchase details
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  purchase_price INTEGER NOT NULL,
  down_payment_paid INTEGER,
  mortgage_amount INTEGER,
  shares_owned INTEGER DEFAULT 1,
  
  -- Current status
  is_sold BOOLEAN DEFAULT FALSE,
  sold_at TIMESTAMP,
  sale_price INTEGER,
  
  -- Performance tracking
  current_cash_flow INTEGER, -- monthly income from this asset
  total_income_earned INTEGER DEFAULT 0, -- cumulative income
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PLAYER LIABILITIES (additional debts acquired during game)
-- =====================================================
CREATE TABLE player_liabilities (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- bank_loan, credit_card, margin_loan
  description VARCHAR(200),
  
  principal_amount INTEGER NOT NULL,
  remaining_balance INTEGER NOT NULL,
  interest_rate DECIMAL(5,2),
  monthly_payment INTEGER NOT NULL,
  
  acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_off_at TIMESTAMP,
  is_paid_off BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_liability_type CHECK (type IN ('bank_loan', 'credit_card', 'margin_loan', 'other'))
);

-- =====================================================
-- PLAYER DOODADS (luxury expenses that drain cash)
-- =====================================================
CREATE TABLE player_doodads (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL, -- boat, vacation, golf_clubs, big_screen_tv
  description TEXT,
  cost INTEGER NOT NULL, -- one-time cost
  
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MARKET CARDS (events that affect investments)
-- =====================================================
CREATE TABLE market_cards (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- stock_split, market_crash, property_appreciation, downsized, baby, charity
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  
  -- Effects
  affects_investment_type VARCHAR(50), -- which type of investment this affects
  multiplier DECIMAL(5,2), -- for splits, crashes, etc.
  cash_bonus INTEGER, -- direct cash effect
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_market_type CHECK (type IN ('stock_split', 'stock_increase', 'stock_decrease', 
    'property_damage', 'downsized', 'baby', 'charity', 'tax_audit', 'paycheck'))
);

-- Sample market cards
INSERT INTO market_cards (type, name, description, affects_investment_type, multiplier)
VALUES 
  ('stock_split', 'Stock Split 2:1', 'Your stock splits 2 for 1! Double your shares.', 'stock', 2.0),
  ('stock_increase', 'Stock Market Boom', 'Stock market rallies! Stock prices increase.', 'stock', 1.5),
  ('stock_decrease', 'Market Correction', 'Stock market drops! Stock prices decrease.', 'stock', 0.7);

INSERT INTO market_cards (type, name, description, cash_bonus)
VALUES 
  ('downsized', 'Downsized!', 'You lost your job! Lose 2 turns of income.', -1),
  ('baby', 'Baby Born!', 'Congratulations! Add one child (increases monthly expenses).', 0),
  ('charity', 'Charity Donation', 'Donate 10% of income, reduce taxes by 10% for 3 turns.', 0),
  ('paycheck', 'Paycheck Day', 'Receive your monthly income.', 0);

-- =====================================================
-- GAME EVENTS (log of all actions taken in the game)
-- =====================================================
CREATE TABLE game_events (
  id SERIAL PRIMARY KEY,
  game_session_id INTEGER NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  
  event_type VARCHAR(50) NOT NULL, -- opportunity_drawn, investment_purchased, investment_sold, 
                                    -- market_event, doodad_purchased, loan_taken, payday, etc.
  event_data JSONB, -- flexible storage for event-specific data
  
  -- Financial impact
  cash_change INTEGER, -- how much cash changed
  cash_flow_change INTEGER, -- how passive income changed
  
  turn_number INTEGER NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_event_type CHECK (event_type IN (
    'game_started', 'game_ended', 'turn_started', 'turn_ended',
    'opportunity_drawn', 'opportunity_passed', 'investment_purchased', 'investment_sold',
    'market_event', 'doodad_purchased', 'loan_taken', 'loan_paid',
    'payday', 'downsized', 'baby_born', 'charity_donated',
    'escaped_rat_race', 'won_game'
  ))
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_players_game_session_id ON players(game_session_id);
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_player_investments_player_id ON player_investments(player_id);
CREATE INDEX idx_player_investments_is_sold ON player_investments(is_sold);
CREATE INDEX idx_player_liabilities_player_id ON player_liabilities(player_id);
CREATE INDEX idx_player_doodads_player_id ON player_doodads(player_id);
CREATE INDEX idx_game_events_game_session_id ON game_events(game_session_id);
CREATE INDEX idx_game_events_player_id ON game_events(player_id);
CREATE INDEX idx_game_events_turn_number ON game_events(turn_number);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update player's calculated financial fields
CREATE OR REPLACE FUNCTION update_player_financials()
RETURNS TRIGGER AS $$
DECLARE
  v_profession professions%ROWTYPE;
  v_passive_income INTEGER;
  v_total_expenses INTEGER;
  v_child_expenses INTEGER;
BEGIN
  -- Get profession details
  SELECT * INTO v_profession FROM professions WHERE id = NEW.profession_id;
  
  -- Calculate passive income from investments
  SELECT COALESCE(SUM(current_cash_flow), 0) 
  INTO v_passive_income
  FROM player_investments
  WHERE player_id = NEW.id AND is_sold = FALSE;
  
  -- Calculate child expenses
  v_child_expenses := v_profession.child_expense * NEW.num_children;
  
  -- Calculate total expenses
  v_total_expenses := v_profession.taxes + 
                      v_profession.home_mortgage_payment +
                      v_profession.school_loan_payment +
                      v_profession.car_loan_payment +
                      v_profession.credit_card_payment +
                      v_profession.retail_payment +
                      v_profession.other_expenses +
                      v_child_expenses;
  
  -- Add additional liability payments
  v_total_expenses := v_total_expenses + COALESCE((
    SELECT SUM(monthly_payment)
    FROM player_liabilities
    WHERE player_id = NEW.id AND is_paid_off = FALSE
  ), 0);
  
  -- Update player
  NEW.passive_income := v_passive_income;
  NEW.total_income := v_profession.salary + v_passive_income;
  NEW.total_expenses := v_total_expenses;
  NEW.cash_flow := NEW.total_income - NEW.total_expenses;
  NEW.updated_at := CURRENT_TIMESTAMP;
  
  -- Check if player has escaped rat race
  IF NEW.passive_income > NEW.total_expenses AND NOT NEW.has_escaped_rat_race THEN
    NEW.has_escaped_rat_race := TRUE;
    NEW.is_on_fast_track := TRUE;
    NEW.escaped_at := CURRENT_TIMESTAMP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate player financials
CREATE TRIGGER trigger_update_player_financials
  BEFORE INSERT OR UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_player_financials();

-- Function to update last activity timestamp
CREATE OR REPLACE FUNCTION update_game_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE game_sessions 
  SET last_activity_at = CURRENT_TIMESTAMP
  WHERE id = NEW.game_session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update game session activity
CREATE TRIGGER trigger_update_game_activity
  AFTER INSERT ON game_events
  FOR EACH ROW
  EXECUTE FUNCTION update_game_session_activity();

-- =====================================================
-- VIEWS for easy querying
-- =====================================================

-- View: Player Financial Statement
CREATE OR REPLACE VIEW v_player_financial_statement AS
SELECT 
  p.id as player_id,
  p.game_session_id,
  pr.name as profession,
  
  -- INCOME
  pr.salary,
  p.passive_income,
  p.total_income,
  
  -- EXPENSES
  pr.taxes,
  pr.home_mortgage_payment,
  pr.school_loan_payment,
  pr.car_loan_payment,
  pr.credit_card_payment,
  pr.retail_payment,
  pr.other_expenses,
  (pr.child_expense * p.num_children) as child_expenses,
  p.total_expenses,
  
  -- CASH FLOW
  p.cash_flow,
  
  -- ASSETS
  p.cash_on_hand,
  p.savings,
  (SELECT COUNT(*) FROM player_investments WHERE player_id = p.id AND is_sold = FALSE) as num_investments,
  (SELECT COALESCE(SUM(purchase_price), 0) FROM player_investments WHERE player_id = p.id AND is_sold = FALSE) as total_investment_value,
  
  -- LIABILITIES
  pr.home_mortgage,
  pr.school_loans,
  pr.car_loans,
  pr.credit_cards,
  pr.retail_debt,
  (SELECT COALESCE(SUM(remaining_balance), 0) FROM player_liabilities WHERE player_id = p.id AND is_paid_off = FALSE) as additional_liabilities,
  
  -- PROGRESS
  p.has_escaped_rat_race,
  p.is_on_fast_track,
  p.current_turn
  
FROM players p
JOIN professions pr ON p.profession_id = pr.id;

-- View: Player Portfolio
CREATE OR REPLACE VIEW v_player_portfolio AS
SELECT 
  pi.player_id,
  oc.type as investment_type,
  oc.name as investment_name,
  pi.purchase_price,
  pi.current_cash_flow,
  pi.shares_owned,
  pi.purchased_at,
  pi.is_sold
FROM player_investments pi
JOIN opportunity_cards oc ON pi.opportunity_card_id = oc.id
ORDER BY pi.player_id, pi.purchased_at DESC;

-- View: Game Leaderboard
CREATE OR REPLACE VIEW v_game_leaderboard AS
SELECT 
  gs.id as game_session_id,
  u.email as player_email,
  pr.name as profession,
  p.cash_flow,
  p.passive_income,
  p.has_escaped_rat_race,
  p.escaped_at,
  p.current_turn,
  gs.status as game_status,
  gs.started_at
FROM game_sessions gs
JOIN players p ON gs.id = p.game_session_id
JOIN auth.users u ON p.user_id = u.id
JOIN professions pr ON p.profession_id = pr.id
ORDER BY p.has_escaped_rat_race DESC, p.passive_income DESC, p.current_turn ASC;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_doodads ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own game sessions
CREATE POLICY "Users can view own game sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Players policies
CREATE POLICY "Users can view own players"
  ON players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own players"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own players"
  ON players FOR UPDATE
  USING (auth.uid() = user_id);

-- Player investments policies
CREATE POLICY "Users can view own investments"
  ON player_investments FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can create own investments"
  ON player_investments FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own investments"
  ON player_investments FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Similar policies for liabilities, doodads, and events
CREATE POLICY "Users can view own liabilities"
  ON player_liabilities FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own liabilities"
  ON player_liabilities FOR ALL
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own doodads"
  ON player_doodads FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own doodads"
  ON player_doodads FOR ALL
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own game events"
  ON game_events FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can create own game events"
  ON game_events FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Public read access to professions and opportunity cards
ALTER TABLE professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professions"
  ON professions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view opportunity cards"
  ON opportunity_cards FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view market cards"
  ON market_cards FOR SELECT
  USING (true);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

