/**
 * Business Lab Database Utilities
 * Helper functions for interacting with lab tables
 */

import { createSupabaseServer } from '@/lib/supabase/server';

export interface LabTrack {
  id: string;
  key: string;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
}

export interface LabStep {
  id: string;
  track_id: string;
  title: string;
  description: string | null;
  order: number;
  required: boolean;
  goal: string | null;
  created_at: string;
}

export interface LabChecklist {
  id: string;
  step_id: string;
  user_id: string;
  text: string;
  done: boolean;
  order: number;
  updated_at: string;
}

export interface LabArtifact {
  id: string;
  step_id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  url: string | null;
  metadata: Record<string, any> | null;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabTemplate {
  id: string;
  code: string;
  title: string;
  description: string | null;
  schema: Record<string, any> | null;
  sample: string | null;
  category: string | null;
  created_at: string;
}

export interface LabExperiment {
  id: string;
  step_id: string;
  user_id: string;
  hypothesis: string;
  metric: string | null;
  target_value: string | null;
  result: string | null;
  decision: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LabScore {
  user_id: string;
  readiness_score: number;
  notes: string | null;
  breakdown: Record<string, any> | null;
  updated_at: string;
}

export interface LabStepProgress {
  id: string;
  user_id: string;
  step_id: string;
  is_completed: boolean;
  completed_at: string | null;
  updated_at: string;
}

/**
 * Get all tracks with their steps
 */
export async function getTracksWithSteps() {
  const supabase = await createSupabaseServer();
  
  const { data: tracks, error: tracksError } = await supabase
    .from('lab_tracks')
    .select('*')
    .order('order', { ascending: true });

  if (tracksError) throw tracksError;

  const { data: steps, error: stepsError } = await supabase
    .from('lab_steps')
    .select('*')
    .order('order', { ascending: true });

  if (stepsError) throw stepsError;

  return tracks.map(track => ({
    ...track,
    steps: steps.filter(step => step.track_id === track.id)
  }));
}

/**
 * Get a single track by key with its steps
 */
export async function getTrackByKey(key: string) {
  const supabase = await createSupabaseServer();
  
  const { data: track, error: trackError } = await supabase
    .from('lab_tracks')
    .select('*')
    .eq('key', key)
    .single();

  if (trackError) throw trackError;

  const { data: steps, error: stepsError } = await supabase
    .from('lab_steps')
    .select('*')
    .eq('track_id', track.id)
    .order('order', { ascending: true });

  if (stepsError) throw stepsError;

  return {
    ...track,
    steps
  };
}

/**
 * Get a single step by ID with related data
 */
export async function getStepById(stepId: string, userId: string) {
  const supabase = await createSupabaseServer();
  
  const { data: step, error: stepError } = await supabase
    .from('lab_steps')
    .select('*, lab_tracks(*)')
    .eq('id', stepId)
    .single();

  if (stepError) throw stepError;

  // Get user's checklists for this step
  const { data: checklists } = await supabase
    .from('lab_checklists')
    .select('*')
    .eq('step_id', stepId)
    .eq('user_id', userId)
    .order('order', { ascending: true });

  // Get user's artifacts for this step
  const { data: artifacts } = await supabase
    .from('lab_artifacts')
    .select('*')
    .eq('step_id', stepId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Get user's experiments for this step
  const { data: experiments } = await supabase
    .from('lab_experiments')
    .select('*')
    .eq('step_id', stepId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Get user's progress for this step
  const { data: progress } = await supabase
    .from('lab_step_progress')
    .select('*')
    .eq('step_id', stepId)
    .eq('user_id', userId)
    .maybeSingle();

  return {
    ...step,
    checklists: checklists || [],
    artifacts: artifacts || [],
    experiments: experiments || [],
    progress: progress || null
  };
}

/**
 * Get user's overall lab progress
 */
export async function getUserLabProgress(userId: string) {
  const supabase = await createSupabaseServer();
  
  const { data: progress, error } = await supabase
    .from('lab_step_progress')
    .select('*, lab_steps(*, lab_tracks(*))')
    .eq('user_id', userId);

  if (error) throw error;

  return progress;
}

/**
 * Get all templates
 */
export async function getTemplates() {
  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('lab_templates')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;

  return data as LabTemplate[];
}

/**
 * Get template by code
 */
export async function getTemplateByCode(code: string) {
  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('lab_templates')
    .select('*')
    .eq('code', code)
    .single();

  if (error) throw error;

  return data as LabTemplate;
}

/**
 * Get user's investment readiness score
 */
export async function getUserScore(userId: string) {
  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('lab_scores')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return data as LabScore | null;
}

/**
 * Get user's recent AI jobs
 */
export async function getUserAIJobs(userId: string, limit: number = 10) {
  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('lab_ai_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data;
}

/**
 * Get user's simulator history
 */
export async function getUserSimHistory(userId: string, kind?: string) {
  const supabase = await createSupabaseServer();
  
  let query = supabase
    .from('lab_sim_inputs')
    .select('*, lab_sim_outputs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (kind) {
    query = query.eq('kind', kind);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}

/**
 * Get active mentors
 */
export async function getActiveMentors() {
  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('lab_mentors')
    .select('*, profiles(nickname, reputation)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Calculate next recommended step for a user
 */
export async function getNextRecommendedStep(userId: string) {
  const supabase = await createSupabaseServer();
  
  // Get all completed steps
  const { data: completedProgress } = await supabase
    .from('lab_step_progress')
    .select('step_id')
    .eq('user_id', userId)
    .eq('is_completed', true);

  const completedStepIds = new Set(completedProgress?.map(p => p.step_id) || []);

  // Get all steps ordered
  const { data: allSteps } = await supabase
    .from('lab_steps')
    .select('*, lab_tracks(*)')
    .order('lab_tracks.order', { ascending: true })
    .order('order', { ascending: true });

  // Find first incomplete step
  const nextStep = allSteps?.find(step => !completedStepIds.has(step.id));

  return nextStep || null;
}

