# Business Lab Implementation Guide

## ✅ Completed Features

### 1. Database Schema & Migrations
**File:** `migrations/business_lab_schema.sql`

Created 13 tables with RLS policies:
- `lab_tracks` - 6 tracks (Discover, Validate, Build, Launch, Grow, Pitch)
- `lab_steps` - Steps within each track
- `lab_checklists` - User checklist items per step
- `lab_templates` - Reusable templates (Lean Canvas, Persona, etc.)
- `lab_artifacts` - User-generated outputs
- `lab_experiments` - Validation experiments
- `lab_scores` - Investment readiness scores
- `lab_sim_inputs` - Simulator inputs
- `lab_sim_outputs` - Simulator results
- `lab_ai_jobs` - AI tool execution logs
- `lab_mentors` - Mentor profiles
- `mentor_sessions` - Mentor-founder sessions
- `lab_step_progress` - Track completion status

### 2. Seed Data
**File:** `seed/business-lab-seed.sql`

- 6 tracks with Spanish content
- 30 steps (5 per track) with goals and descriptions
- 8 templates (Persona, Lean Canvas, Experiment, Interview Script, Value Prop, MVP Spec, Pitch Outline, One Pager)

### 3. Library Functions

#### Database Utilities (`src/lib/lab/db.ts`)
- `getTracksWithSteps()` - Fetch all tracks with steps
- `getTrackByKey(key)` - Get single track by key
- `getStepById(stepId, userId)` - Get step with user data
- `getUserLabProgress(userId)` - Get user's overall progress
- `getTemplates()` - Get all templates
- `getUserScore(userId)` - Get investment readiness score
- `getNextRecommendedStep(userId)` - Calculate next step

#### Simulators (`src/lib/lab/simulators.ts`)
Mathematical calculators:
- **Cashflow** - Monthly cash projection, runway, burn rate
- **Breakeven** - Units needed to break even, margin analysis
- **Pricing** - Good-Better-Best pricing tiers with margins
- **Funnel** - Conversion metrics, CAC, LTV calculations
- **Unit Economics** - LTV:CAC ratio, payback period

#### AI Helpers (`src/lib/lab/ai.ts`)
9 AI tools using OpenAI:
1. **Idea Map** - Refine problem & value prop
2. **Interview Coach** - Generate customer interview scripts
3. **Lean Canvas** - Complete Lean Canvas generation
4. **Survey Design** - Create validation surveys
5. **Pricing Tester** - Pricing strategy recommendations
6. **Copy Genie** - Marketing copy generation
7. **Pitch Coach** - Pitch feedback and Q&A preparation
8. **Risk Checker** - Business risks (Mexico focus)
9. **Mentor Match** - Mentor recommendations

### 4. API Routes

#### Core Routes
- `GET /api/lab/tracks` - List all tracks with progress
- `GET /api/lab/steps/[id]` - Get step details
- `GET/POST/PATCH/DELETE /api/lab/checklists` - Manage checklists
- `GET/POST/PATCH/DELETE /api/lab/artifacts` - Manage artifacts
- `GET/POST/PATCH/DELETE /api/lab/experiments` - Manage experiments
- `GET/PATCH /api/lab/score` - Investment readiness score

#### Simulator Routes
All with POST method, Zod validation, and data persistence:
- `/api/lab/sim/cashflow`
- `/api/lab/sim/breakeven`
- `/api/lab/sim/pricing`
- `/api/lab/sim/funnel`

#### AI Routes
All with POST method, rate limiting, and job logging:
- `/api/ai/idea-map`
- `/api/ai/interview-coach`
- `/api/ai/lean-canvas`
- `/api/ai/survey-design`
- `/api/ai/pricing-tester`
- `/api/ai/copy-genie`
- `/api/ai/pitch-coach`
- `/api/ai/risk-checker`
- `/api/ai/mentor-match`

### 5. UI Components

Created reusable components in `src/components/lab/`:
- **ProgressBar** - Visual progress indicator
- **ChecklistItem** - Interactive checkbox with toggle
- **ArtifactCard** - Display saved artifacts
- **AIButton** - Animated AI action button
- **TrackCard** - Track overview with progress
- **StepCard** - Step with completion status

### 6. Pages

#### Completed:
- `/lab` - Main dashboard (✅ Done)
  - Overall progress
  - Next recommended step
  - Quick links (templates, simulators, score)
  - All tracks overview

#### To Complete:
- `/lab/track/[key]` - Track view with all steps
- `/lab/step/[id]` - Step detail with checklists, artifacts, AI helpers
- `/lab/templates` - Template library
- `/lab/simulators` - Simulator hub
- `/lab/simulators/cashflow` - Cashflow calculator
- `/lab/simulators/breakeven` - Breakeven calculator
- `/lab/simulators/pricing` - Pricing calculator
- `/lab/simulators/funnel` - Funnel calculator
- `/lab/score` - Investment readiness dashboard
- `/lab/pitch` - Pitch preparation tools
- `/lab/mentor` - Mentor matching

## 🚀 Setup Instructions

### 1. Run Database Migrations

```bash
# Connect to your Supabase project
# Run these in order:

# 1. Create tables and RLS policies
psql $DATABASE_URL < migrations/business_lab_schema.sql

# 2. Seed initial data
psql $DATABASE_URL < seed/business-lab-seed.sql
```

### 2. Environment Variables

Ensure `.env.local` has:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url

# OpenAI (for AI helpers)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4
```

### 3. Install Dependencies

Ensure you have:
- `zod` - Schema validation
- `lucide-react` - Icons
- Your existing UI libraries (shadcn/ui)

## 📋 Next Steps

### To Complete Implementation:

1. **Track Page** (`/lab/track/[key]`) - Show all steps in a track
2. **Step Detail Page** (`/lab/step/[id]`) - Full step interface with:
   - Checklists
   - Templates
   - Artifacts
   - AI helpers
   - "Ask the forum" button

3. **Templates Page** (`/lab/templates`) - Browse and use templates

4. **Simulator Pages** - 4 interactive calculators with:
   - Input forms
   - Real-time calculations
   - Charts/visualizations
   - Save scenarios

5. **Score Page** (`/lab/score`) - Investment readiness dashboard

6. **Pitch Page** (`/lab/pitch`) - Deck builder & practice

7. **Mentor Page** (`/lab/mentor`) - Find mentors

### Features to Add:

- Forum integration ("Ask the forum" button with prefilled context)
- Template editor/viewer
- Export artifacts as PDF
- Share artifacts with mentors
- Progress notifications
- Achievement badges
- Collaborative features

## 🔐 Security Features

- ✅ RLS policies on all tables
- ✅ User-scoped data access
- ✅ Rate limiting on AI endpoints (5 req/min)
- ✅ Zod validation on all API routes
- ✅ Pseudonym display (no PII)
- ✅ Safe for minors (content guidelines)

## 🎨 UI/UX Patterns

- Gradient backgrounds (blue-purple-pink)
- Progress indicators on everything
- Clear next steps
- AI buttons with sparkle icon
- Completed items show checkmarks
- Locked items show lock icon
- Hover effects and transitions
- Mobile responsive (Tailwind)

## 📊 Data Flow

### User Journey:
1. Land on `/lab` → See overall progress
2. Click track → See steps (`/lab/track/[key]`)
3. Click step → Work on step (`/lab/step/[id]`)
4. Complete checklist items
5. Use AI helpers to create artifacts
6. Save artifacts to profile
7. Move to next step

### AI Tool Usage:
1. User clicks "Use AI" button
2. Frontend calls `/api/ai/[tool]`
3. API validates input (Zod)
4. Creates `lab_ai_jobs` record (status: processing)
5. Calls OpenAI API
6. Updates job with result
7. Returns structured JSON
8. Frontend displays result
9. User can save as artifact

### Simulator Usage:
1. User enters values in form
2. Frontend calls `/api/lab/sim/[type]`
3. API validates and calculates
4. Saves input + output to DB
5. Returns results with charts
6. User can view history

## 🧪 Testing Checklist

- [ ] Run migrations successfully
- [ ] Seed data loads correctly
- [ ] User can see tracks and steps
- [ ] Progress saves correctly
- [ ] Checklists toggle properly
- [ ] Artifacts save and display
- [ ] AI tools return valid JSON
- [ ] Simulators calculate correctly
- [ ] RLS blocks unauthorized access
- [ ] Rate limiting works
- [ ] Forum link prefills context

## 💰 Cost Estimates

### OpenAI API:
- **gpt-3.5-turbo**: ~$0.002 per AI request
- Estimated 50 AI requests per user = $0.10
- For 100 active users/month = $10/month

### Infrastructure:
- Supabase (existing) - No additional cost
- Next.js hosting (existing) - No additional cost

### Recommendations:
- Start with gpt-3.5-turbo (cheap)
- Add caching for common queries
- Consider Ollama (free) for high volume
- Monitor usage with job logs

## 🐛 Known Limitations

1. **No file uploads** - Text and links only (MVP scope)
2. **Simple rate limiting** - In-memory (upgrade to DB later)
3. **No streaming AI** - Full response only
4. **No collaborative editing** - Single user per artifact
5. **Basic simulator UIs** - Need more visualization
6. **No email notifications** - Manual check progress

## 📚 Resources

- Prisma Schema: `prisma/schema.prisma`
- Migration File: `migrations/business_lab_schema.sql`
- Seed File: `seed/business-lab-seed.sql`
- Library Files: `src/lib/lab/`
- Components: `src/components/lab/`
- API Routes: `src/app/api/lab/` and `src/app/api/ai/`
- Pages: `src/app/lab/`

## 🎯 Success Metrics

Track these to measure success:
- User completion rate per track
- Average time per step
- AI tool usage rates
- Simulator usage rates
- Artifact creation rate
- Forum cross-posting rate
- Investment score distribution

## 🔄 Future Enhancements

- Export pitch deck as PPTX
- Video tutorials per step
- Community showcase of artifacts
- Mentor directory with booking
- Live cohorts with deadlines
- Certificate upon completion
- Integration with external tools
- Multi-language support

