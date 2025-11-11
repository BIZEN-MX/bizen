# 💰 CASHFLOW GAME - Complete Setup Guide

## 📋 SQL Files to Run (IN ORDER)

Run these in your **Supabase SQL Editor** in this exact order:

### ✅ 1. Main Schema (Already Done)
```
CASHFLOW_GAME_SCHEMA.sql
```
- Creates all 9 tables
- Adds 12 professions
- Sets up triggers and RLS policies

### ❌ 2. Opportunity Cards (NEED TO RUN)
```
CASHFLOW_OPPORTUNITY_CARDS.sql
```
- Adds 60 investment opportunities
- Real estate, stocks, businesses, limited partnerships
- For Rat Race phase

### ❌ 3. Doodads (NEED TO RUN)
```
CASHFLOW_DOODADS.sql
```
- Adds 33 luxury temptations
- Teaches financial discipline
- No return on investment

### ❌ 4. Doodad Column Migration (NEED TO RUN)
```
CASHFLOW_ADD_DOODAD_COLUMN.sql
```
- Adds doodad_id column to player_doodads
- Links purchases to catalog

### ❌ 5. Fast Track Cards (NEED TO RUN)
```
CASHFLOW_FAST_TRACK_CARDS.sql
```
- Adds 30 mega-deal opportunities
- For players who escaped rat race
- Million-dollar properties, major businesses
- Adds is_fast_track column

---

## 🎮 Game Features (100% Complete)

### Core Gameplay
- ✅ 12 Professions (Janitor to Doctor)
- ✅ 60 Rat Race opportunities
- ✅ 30 Fast Track mega-deals
- ✅ 33 Doodads (luxury traps)
- ✅ Buy/sell investment system
- ✅ Bank loans (take + pay off)
- ✅ Market events (baby, downsized, charity, paycheck)
- ✅ Turn-based mechanics

### Player Experience
- ✅ Win celebration (escape rat race)
- ✅ **Ultimate win (reach $50K passive income)** ⚡
- ✅ **Fast Track Phase** (bigger deals after winning)
- ✅ 5-step interactive tutorial
- ✅ Portfolio management
- ✅ Active games list (resume anytime)
- ✅ **Statistics dashboard** (track all performance)
- ✅ Full auto-save

### UI/UX
- ✅ Beautiful responsive design
- ✅ Help button (reopen tutorial)
- ✅ **Gold theme for Fast Track mode** ⚡
- ✅ Progress tracking
- ✅ Financial education quotes

---

## ⚡ How Fast Track Works

### Phase 1: Rat Race 🏃
- Start with chosen profession
- Draw regular opportunities ($1K-$650K)
- **Goal:** Passive income > Expenses
- **Win:** Escape to Fast Track!

### Phase 2: Fast Track ⚡ (NEW!)
- **Triggered:** When passive income > expenses
- **Visual:** Gold header, "⚡ FAST TRACK" title
- **New cards:** Mega-deals ($250K-$5.5M)
  - 10 luxury properties ($800K-$5.5M)
  - 10 major businesses ($380K-$900K)
  - 5 large stock portfolios
  - 5 major partnerships
- **Ultimate Goal:** Reach $50,000/month passive income
- **Ultimate Win:** Crown icon 👑, gold celebration

### Win Conditions
1. **First Win:** Passive income > Expenses → Escape rat race 🏆
2. **Ultimate Win:** $50,000 passive income → Game mastery 👑

---

## 🎯 Quick Start

1. **Run SQL files 2-5** in Supabase (in order)
2. Visit: `http://localhost:3004/cash-flow`
3. Select profession
4. Start playing!

---

## 📊 Statistics Tracked

- Total games played
- Win rate %
- Average turns to win
- Fastest win
- Best profession
- Total cash earned
- Total investments
- Doodads purchased (shame counter!)
- Recent games list

---

## 🎓 Educational Value

Teaches players:
- ✅ Income vs. Expenses
- ✅ Assets vs. Liabilities
- ✅ Passive income concept
- ✅ Investment diversification
- ✅ Leverage (using debt wisely)
- ✅ Financial discipline (resist doodads)
- ✅ Cash flow management
- ✅ When to buy/sell
- ✅ Risk vs. reward

---

## 🚀 Game is Production Ready!

All features implemented. Just run the SQL files and you're good to go!

Total development: **Fully functional digital Cashflow game** 🎉

