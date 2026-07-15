import { SCORING_WEIGHTS, VERDICT_BANDS } from '../config';

function sigmoidNormalize(value: number, midpoint = 50.0, steepness = 0.05): number {
  return 1 / (1 + Math.exp(-steepness * (value - midpoint)));
}

function clamp(value: number, lo = 0.0, hi = 1.0): number {
  return Math.max(lo, Math.min(hi, value));
}

function scorePainPointFrequency(painPoints: any[]): number {
  if (!painPoints || painPoints.length === 0) return 0.0;
  const weighted = painPoints.reduce((sum, pp) => {
    return sum + (pp.mentions || 0) * (pp.severity || 3) / 5;
  }, 0);
  return clamp(sigmoidNormalize(weighted, 50, 0.04));
}

function scoreBuyingIntent(sentiment: any): number {
  const total = sentiment.total_tagged || 0;
  if (total === 0) return 0.1; // slight baseline
  const bi = sentiment.buying_intent_count || 0;
  const active = sentiment.active_search_count || 0;
  const ratio = (bi + 0.5 * active) / total;
  return clamp(ratio);
}

function scoreCompetitorWeakness(painPoints: any[], competitors: any[]): number {
  if (!competitors || competitors.length === 0) {
    return 0.5; // Neutral
  }

  const allCompetitorFeatures = new Set<string>();
  for (const c of competitors) {
    const missing = c.missing_features || [];
    for (const f of missing) {
      allCompetitorFeatures.add(f.toLowerCase());
    }
  }

  const painLabels = painPoints.map(pp => (pp.pain_point || '').toLowerCase());
  if (painLabels.length === 0) return 0.3;

  // Enforce gap analysis: count pain points that ARE mentioned in missing features
  // (meaning competitors are missing a solution for this pain point)
  let uncovered = 0;
  for (const label of painLabels) {
    const isUncovered = Array.from(allCompetitorFeatures).some(cf => {
      return cf.includes(label) || label.includes(cf);
    });
    if (isUncovered) {
      uncovered++;
    }
  }

  const gapRatio = uncovered / painLabels.length;
  return clamp(gapRatio);
}

function scoreFeatureDemand(features: any[]): number {
  if (!features || features.length === 0) return 0.1;
  const total = features.reduce((sum, f) => sum + (f.mentions || 0), 0);
  return clamp(sigmoidNormalize(total, 30, 0.08));
}

function scoreMarketActivity(sources: any[]): number {
  if (!sources || sources.length === 0) return 0.0;
  const volumeScore = clamp(sigmoidNormalize(sources.length, 100, 0.02));

  // Recency: fraction of posts in last 180 days
  const cutoff = Date.now() - 180 * 24 * 60 * 60 * 1000;
  let recent = 0;
  for (const s of sources) {
    const posted = s.posted_at;
    if (posted) {
      try {
        const ts = new Date(posted).getTime();
        if (ts > cutoff) recent++;
      } catch {}
    }
  }

  const recencyScore = recent / sources.length;
  return clamp(0.6 * volumeScore + 0.4 * recencyScore);
}

function getVerdictFromScore(score: number): string {
  for (const [lo, hi, label] of VERDICT_BANDS) {
    if (score >= lo && score <= hi) {
      return label;
    }
  }
  return "Weak signal";
}

export function computeValidationScore(
  painPoints: any[],
  sentiment: any,
  competitors: any[],
  features: any[],
  sources: any[]
): { validation_score: number; verdict: string; reasoning: string } {
  const f1 = scorePainPointFrequency(painPoints);
  const f2 = scoreBuyingIntent(sentiment);
  const f3 = scoreCompetitorWeakness(painPoints, competitors);
  const f4 = scoreFeatureDemand(features);
  const f5 = scoreMarketActivity(sources);

  const w = SCORING_WEIGHTS;
  const rawScore =
    f1 * w.pain_point_frequency +
    f2 * w.buying_intent +
    f3 * w.competitor_weakness +
    f4 * w.feature_demand +
    f5 * w.market_activity;

  const validationScore = Math.round(clamp(rawScore) * 100);
  const verdict = getVerdictFromScore(validationScore);

  const biPct = Math.round((sentiment.buying_intent_count || 0) / Math.max(sentiment.total_tagged || 1, 1) * 100);

  const reasoning = `Score: ${validationScore}/100 — ${verdict}.\n\n` +
    `Pain-point frequency (${Math.round(w.pain_point_frequency * 100)}% weight, sub-score ${Math.round(f1 * 100)}/100): ` +
    `${painPoints.length} distinct pain points found across ${sources.length} posts.\n` +
    `Buying intent (${Math.round(w.buying_intent * 100)}% weight, sub-score ${Math.round(f2 * 100)}/100): ` +
    `${biPct}% of tagged posts show explicit buying intent or active tool-searching.\n` +
    `Competitor weakness (${Math.round(w.competitor_weakness * 100)}% weight, sub-score ${Math.round(f3 * 100)}/100): ` +
    `${competitors.length} competitor(s) found; gap analysis shows ${f3 > 0.6 ? 'significant' : f3 > 0.3 ? 'moderate' : 'limited'} unmet demand.\n` +
    `Feature demand (${Math.round(w.feature_demand * 100)}% weight, sub-score ${Math.round(f4 * 100)}/100): ` +
    `${features.length} distinct feature request(s) surfaced from competitor reviews.\n` +
    `Market activity (${Math.round(w.market_activity * 100)}% weight, sub-score ${Math.round(f5 * 100)}/100): ` +
    `${sources.length} posts collected from Reddit.`;

  return {
    validation_score: validationScore,
    verdict,
    reasoning
  };
}
