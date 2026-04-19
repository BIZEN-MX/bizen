import { prisma } from '@/lib/prisma';

export const READINESS_LABELS = {
  FINANCIAL_KNOWLEDGE: 'financial_knowledge',
  CREDIT_MANAGEMENT: 'credit_management',
  INVESTMENT_ACUMEN: 'investment_acumen',
  BUDGETING: 'budgeting',
} as const;

export type ReadinessLabel = typeof READINESS_LABELS[keyof typeof READINESS_LABELS];

export interface ReadinessSubScore {
  label: ReadinessLabel;
  score: number;
  reasons: string[];
}

export interface ReadinessScoreResult {
  overall_score: number;
  sub_scores: Record<ReadinessLabel, ReadinessSubScore>;
  confidence_level: 'low' | 'medium' | 'high';
}

export async function logReadinessEvent(
  userId: string,
  label: ReadinessLabel,
  eventType: 'diagnostic' | 'simulator_challenge' | 'good_decision' | 'bad_decision',
  scoreDelta: number,
  reason: string
) {
  try {
    await prisma.readiness_events.create({
      data: {
        user_id: userId,
        label,
        event_type: eventType,
        score_delta: scoreDelta,
        reason
      }
    });
  } catch (error) {
    console.error("Failed to log readiness event", error);
  }
}

export async function computeReadinessScore(userId: string): Promise<ReadinessScoreResult> {
  const events = await prisma.readiness_events.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'asc' }
  });

  const subScoreMap: Record<ReadinessLabel, ReadinessSubScore> = {
    [READINESS_LABELS.FINANCIAL_KNOWLEDGE]: { label: READINESS_LABELS.FINANCIAL_KNOWLEDGE, score: 0, reasons: [] },
    [READINESS_LABELS.CREDIT_MANAGEMENT]: { label: READINESS_LABELS.CREDIT_MANAGEMENT, score: 0, reasons: [] },
    [READINESS_LABELS.INVESTMENT_ACUMEN]: { label: READINESS_LABELS.INVESTMENT_ACUMEN, score: 0, reasons: [] },
    [READINESS_LABELS.BUDGETING]: { label: READINESS_LABELS.BUDGETING, score: 0, reasons: [] },
  };

  if (events.length === 0) {
    return {
      overall_score: 0,
      sub_scores: subScoreMap,
      confidence_level: 'low'
    };
  }

  // Calculate scores and collect reasons
  events.forEach(ev => {
    const sub = subScoreMap[ev.label as ReadinessLabel];
    if (sub) {
      sub.score += ev.score_delta;
      // Keep score within 0-100
      sub.score = Math.max(0, Math.min(100, sub.score));
      
      // Store the reason for explainability (keep last 5 reasons for brevity)
      if (ev.reason) {
         sub.reasons.push(`${ev.score_delta > 0 ? '+' : ''}${ev.score_delta}: ${ev.reason}`);
      }
    }
  });

  // Calculate confidence based on amount of data
  // < 5 events = low, 5-15 = medium, > 15 = high
  let confidence_level: 'low' | 'medium' | 'high' = 'low';
  if (events.length >= 15) confidence_level = 'high';
  else if (events.length >= 5) confidence_level = 'medium';

  const labels = Object.values(READINESS_LABELS);
  let totalScore = 0;
  
  labels.forEach(l => {
     const st = subScoreMap[l];
     totalScore += st.score;
     // Slice reasons to only keep latest 5 for the UI
     if (st.reasons.length > 5) {
        st.reasons = st.reasons.slice(-5);
     }
  });

  const overall_score = Math.round(totalScore / labels.length);

  return {
    overall_score,
    sub_scores: subScoreMap,
    confidence_level
  };
}
