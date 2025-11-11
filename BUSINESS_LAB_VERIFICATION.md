# ✅ Business Lab Verification Checklist

Run through these tests to verify everything is working correctly:

## 1. Database Verification (Supabase)

Open Supabase Dashboard → Table Editor and check:

### Tables Should Exist:
- [ ] `lab_tracks` (6 rows - Discover, Validate, Build, Launch, Grow, Pitch)
- [ ] `lab_steps` (30 rows - 5 per track)
- [ ] `lab_templates` (8 rows - templates)
- [ ] `lab_checklists` (empty initially)
- [ ] `lab_artifacts` (empty initially)
- [ ] `lab_experiments` (empty initially)
- [ ] `lab_scores` (empty initially)
- [ ] `lab_sim_inputs` (empty initially)
- [ ] `lab_sim_outputs` (empty initially)
- [ ] `lab_ai_jobs` (empty initially)
- [ ] `lab_mentors` (empty initially)
- [ ] `mentor_sessions` (empty initially)
- [ ] `lab_step_progress` (empty initially)

### Quick SQL Test:
```sql
-- Should return 6 tracks
SELECT * FROM lab_tracks ORDER BY "order";

-- Should return 30 steps
SELECT COUNT(*) FROM lab_steps;

-- Should return 8 templates
SELECT * FROM lab_templates;
```

## 2. Pages Verification (Browser)

Make sure your dev server is running: `npm run dev`

Visit each page and check for errors:

### ✅ Main Pages (Must Work):
- [ ] http://localhost:3004/lab
  - Shows 6 track cards
  - Shows overall progress bar
  - Shows next recommended step (or empty state)
  - Quick links visible

- [ ] http://localhost:3004/lab/track/discover
  - Shows "Descubrir" track title
  - Shows 5 steps
  - Progress bar visible
  - Each step is clickable

- [ ] http://localhost:3004/lab/step/step_discover_1
  - Shows step title and description
  - Has checklist section (empty initially)
  - Has artifacts section (empty initially)
  - AI helpers sidebar visible
  - "Ask Forum" button visible

- [ ] http://localhost:3004/lab/templates
  - Shows template categories
  - Shows 8 templates
  - Each template has "Ver Ejemplo" and "Usar Template" buttons

- [ ] http://localhost:3004/lab/simulators
  - Shows 4 simulator cards (Cashflow, Breakeven, Pricing, Funnel)
  - Each card is clickable

- [ ] http://localhost:3004/lab/score
  - Shows score dashboard
  - Shows readiness score (default 0)
  - Shows strengths and improvements sections

- [ ] http://localhost:3004/lab/pitch
  - Shows 10 pitch sections
  - Shows One Pager and Q&A cards
  - AI coach card visible

- [ ] http://localhost:3004/lab/mentor
  - Shows mentor matching section
  - Shows "Próximamente" message (no mentors yet)

## 3. API Routes Verification

Test key endpoints using browser console or curl:

```javascript
// In browser console at localhost:3004

// Test 1: Get tracks
fetch('/api/lab/tracks')
  .then(r => r.json())
  .then(d => console.log('Tracks:', d));
// Should return: { success: true, data: [6 tracks with steps] }

// Test 2: Get step details
fetch('/api/lab/steps/step_discover_1')
  .then(r => r.json())
  .then(d => console.log('Step:', d));
// Should return: { success: true, data: {step details} }

// Test 3: Get score
fetch('/api/lab/score')
  .then(r => r.json())
  .then(d => console.log('Score:', d));
// Should return: { success: true, data: {score: 0} }
```

## 4. Interactive Features

### Test Checklists:
1. Go to any step page (e.g., `/lab/step/step_discover_1`)
2. In the checklist input, type: "Test checklist item"
3. Click the + button
4. ✅ Item should appear
5. Click the checkbox to toggle it
6. ✅ Should toggle between checked/unchecked

### Test Artifacts:
1. On a step page, click "Nuevo" in artifacts section
2. Fill in:
   - Title: "Test Artifact"
   - Type: "note"
   - Content: "This is a test"
3. Click "Guardar Artefacto"
4. ✅ Artifact should appear in the list

## 5. Navigation Flow

Test the complete user journey:

1. Start at `/lab` (main dashboard)
2. Click "Descubrir" track → Goes to `/lab/track/discover`
3. Click first step → Goes to `/lab/step/step_discover_1`
4. Click "Volver a Descubrir" → Goes back to track
5. Click "Volver al Lab" → Goes back to main dashboard
6. ✅ All navigation works smoothly

## 6. Authentication Check

### Test RLS Security:
1. Open browser in incognito mode
2. Try to access: http://localhost:3004/lab
3. ✅ Should redirect to login page (not show an error)

### After Login:
1. Login with your test account
2. Access `/lab` again
3. ✅ Should show your personal dashboard
4. Create a checklist item
5. Logout and login with different user
6. ✅ Should NOT see the other user's checklist items

## 7. Error Checking

Open Browser Console (F12) and check for:
- [ ] No red errors in console
- [ ] No 404 errors for missing files
- [ ] No authentication errors
- [ ] No database query errors

Common issues to look for:
- ❌ "Table does not exist" → Rerun migration
- ❌ "Unauthorized" → Check authentication
- ❌ "Cannot find module" → Check imports
- ❌ "Invalid hook call" → Check React components

## 8. AI Features (Optional)

If you added `OPENAI_API_KEY`:

1. Go to any step page
2. Click an AI helper button
3. ✅ Should show "AI Helper en desarrollo" alert (placeholder)
4. Check console for no API errors

## 🎉 Success Criteria

Your Business Lab is working if:

✅ All 8 main pages load without errors  
✅ Database has 6 tracks and 30 steps  
✅ Can create and toggle checklist items  
✅ Can create and view artifacts  
✅ Navigation flows work smoothly  
✅ RLS blocks unauthorized access  
✅ No console errors  

## 🐛 Common Issues & Fixes

### Issue: "Table does not exist"
**Fix:** Run migration again in Supabase SQL Editor

### Issue: Pages show blank/loading forever
**Fix:** Check browser console for API errors. Verify user is logged in.

### Issue: Can't see tracks/steps
**Fix:** Run seed script in Supabase SQL Editor

### Issue: RLS errors
**Fix:** Make sure you're logged in. Check auth.uid() matches user_id type (UUID)

### Issue: Navigation doesn't work
**Fix:** Check that track keys match: 'discover', 'validate', 'build', 'launch', 'grow', 'pitch'

## 📊 Quick Database Check

Run this in Supabase SQL Editor to verify data:

```sql
-- Should return 6
SELECT COUNT(*) as track_count FROM lab_tracks;

-- Should return 30
SELECT COUNT(*) as step_count FROM lab_steps;

-- Should return 8
SELECT COUNT(*) as template_count FROM lab_templates;

-- Show track structure
SELECT 
  t.key,
  t.title,
  COUNT(s.id) as step_count
FROM lab_tracks t
LEFT JOIN lab_steps s ON s.track_id = t.id
GROUP BY t.id, t.key, t.title
ORDER BY t."order";
```

Expected output:
```
key       | title      | step_count
----------|------------|------------
discover  | Descubrir  | 5
validate  | Validar    | 5
build     | Construir  | 5
launch    | Lanzar     | 5
grow      | Crecer     | 5
pitch     | Pitch      | 5
```

---

## ✨ Next Steps After Verification

Once everything checks out:

1. **Test the full journey** - Go through a complete track as a student would
2. **Create sample content** - Add some artifacts to see how they display
3. **Share with beta testers** - Get feedback on the UX
4. **Build simulator UIs** - Create the actual calculator interfaces
5. **Connect AI helpers** - Wire up the AI button functionality
6. **Add forum integration** - Make "Ask Forum" buttons work

---

**Need help debugging?** Check the error in browser console and reference this checklist!

