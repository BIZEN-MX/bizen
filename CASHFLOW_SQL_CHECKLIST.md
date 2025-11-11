# 📋 CASHFLOW SQL FILES - Setup Checklist

## ✅ Status Check

Copy this checklist and mark what you've run:

---

### File 1: Main Schema
**File:** `CASHFLOW_GAME_SCHEMA.sql`  
**Status:** ✅ ALREADY RUN (you mentioned you ran this)  
**What it does:**
- Creates all 9 tables (professions, game_sessions, players, etc.)
- Inserts 12 professions
- Sets up triggers and RLS policies
- Sample opportunity cards (small set)

**Action:** ✅ SKIP - Already done

---

### File 2: Opportunity Cards
**File:** `CASHFLOW_OPPORTUNITY_CARDS.sql`  
**Status:** ❌ NEED TO RUN  
**What it does:**
- Adds 60 investment opportunities
- Real estate: 30 properties ($25K-$950K)
- Stocks: 15 different stocks
- Businesses: 10 businesses
- Limited partnerships: 5 deals

**Action:** 🔴 **RUN THIS NEXT** (Run #1)

---

### File 3: Doodads
**File:** `CASHFLOW_DOODADS.sql`  
**Status:** ❌ NEED TO RUN  
**What it does:**
- Creates doodads table
- Adds 33 luxury temptations
- Categories: toys, entertainment, fashion, travel, food
- Teaches financial discipline

**Action:** 🔴 **RUN THIS** (Run #2)

---

### File 4: Doodad Column Fix
**File:** `CASHFLOW_ADD_DOODAD_COLUMN.sql`  
**Status:** ❌ NEED TO RUN  
**What it does:**
- Adds doodad_id column to player_doodads
- Links purchased doodads to catalog
- Creates index for performance

**Action:** 🔴 **RUN THIS** (Run #3)

---

### File 5: Fast Track Cards
**File:** `CASHFLOW_FAST_TRACK_CARDS.sql`  
**Status:** ❌ NEED TO RUN  
**What it does:**
- Adds 30 mega-deal opportunities
- Luxury properties ($800K-$5.5M)
- Major businesses ($380K-$900K)
- Large stock portfolios
- Adds is_fast_track column
- Marks expensive cards as Fast Track

**Action:** 🔴 **RUN THIS LAST** (Run #4)

---

## 🚀 Quick Setup Steps

1. Open **Supabase Dashboard** → **SQL Editor**
2. Open `CASHFLOW_OPPORTUNITY_CARDS.sql` → Copy all → Paste → **Run**
3. Open `CASHFLOW_DOODADS.sql` → Copy all → Paste → **Run**
4. Open `CASHFLOW_ADD_DOODAD_COLUMN.sql` → Copy all → Paste → **Run**
5. Open `CASHFLOW_FAST_TRACK_CARDS.sql` → Copy all → Paste → **Run**
6. ✅ **DONE!** Your game is fully loaded with content!

---

## 🎮 After Running All SQL Files

You'll have:
- ✅ 12 professions
- ✅ 90 total opportunity cards (60 rat race + 30 fast track)
- ✅ 33 doodads
- ✅ Complete game experience

Then visit: `http://localhost:3004/cash-flow` and play! 🎉

---

## ⚠️ Important Notes

- **Order matters!** Run files 2-5 in the order listed
- If you get errors, make sure File 1 (CASHFLOW_GAME_SCHEMA.sql) was run first
- Each file should complete successfully before moving to the next
- You can re-run any file safely (they use INSERT, not CREATE TABLE)

---

## 📊 Summary

**Already Complete:**
- ✅ Main schema and tables
- ✅ All game code and UI

**Need to Run (4 files):**
- ❌ CASHFLOW_OPPORTUNITY_CARDS.sql
- ❌ CASHFLOW_DOODADS.sql
- ❌ CASHFLOW_ADD_DOODAD_COLUMN.sql
- ❌ CASHFLOW_FAST_TRACK_CARDS.sql

**Time to run:** ~2-3 minutes total

🎮 **Ready to play after running these 4 files!**

