export interface ProjectCreate {
  idea_text: string;
  idea_name?: string;
  target_audience?: string;
}

export interface ProjectRow {
  id: string;
  idea_text: string;
  idea_name?: string;
  target_audience?: string;
  status: string; // pending | done | failed
  failed_stage?: string;
  created_at: string;
  updated_at: string;
}

export interface SourceRow {
  id: string;
  project_id: string;
  platform: string; // reddit | hackernews | producthunt
  url: string;
  content: string;
  engagement: number;
  posted_at?: string;
  collected_at: string;
}

export interface PainPointRow {
  id: string;
  project_id: string;
  pain_point: string;
  mentions: number;
  severity?: number; // 1-5
  confidence?: number;
  created_at: string;
}

export interface CompetitorRow {
  id: string;
  project_id: string;
  name: string;
  website?: string;
  source_url: string;
  missing_features?: string[];
  positive_mentions?: number;
  negative_mentions?: number;
  confidence?: number;
  created_at: string;
}

export interface FeatureRow {
  id: string;
  project_id: string;
  feature_name: string;
  mentions: number;
  priority?: string; // low | medium | high
  created_at: string;
}

export interface ReportRow {
  id: string;
  project_id: string;
  validation_score?: number; // 0-100
  verdict?: string;
  reasoning?: string;
  created_at: string;
}

export interface PainPointOut {
  pain_point: string;
  mentions: number;
  severity?: number;
  confidence?: number;
  sources: string[];
}

export interface CompetitorOut {
  name: string;
  website?: string;
  source_url: string;
  missing_features: string[];
  confidence?: number;
}

export interface FeatureOut {
  feature_name: string;
  mentions: number;
  priority?: string;
}

export interface ValidationReport {
  idea: string;
  validation_score: number;
  verdict: string;
  reasoning: string;
  pain_points: PainPointOut[];
  competitors: CompetitorOut[];
  feature_requests: FeatureOut[];
}
