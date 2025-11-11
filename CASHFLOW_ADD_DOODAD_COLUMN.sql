-- =====================================================
-- ADD doodad_id column to player_doodads table
-- This links purchased doodads to the doodads catalog
-- =====================================================

-- Add column if it doesn't exist
ALTER TABLE player_doodads 
ADD COLUMN IF NOT EXISTS doodad_id INTEGER REFERENCES doodads(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_player_doodads_doodad_id ON player_doodads(doodad_id);

-- =====================================================
-- Run this in Supabase SQL Editor after running
-- CASHFLOW_DOODADS.sql
-- =====================================================

