export type ProductType = 'landing' | 'marketing' | 'saas' | 'marketplace' | 'mobile' | 'ai_product' | 'internal' | 'enterprise' | 'other';
export type AILevel = 'none' | 'assistant' | 'report_gen' | 'ocr' | 'ai_core';
export type TeamPref = 'solo' | 'small' | 'dedicated';

export interface Answers {
  productType: ProductType | null;
  assets: string[];
  platforms: string[];
  features: string[];
  aiLevel: AILevel[];
  integrations: string[];
  teamPref: TeamPref | null;
}

export interface EstimateResult {
  minDays: number;
  maxDays: number;
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  complexityReason: string;
  team: { role: string; icon: string }[];
  drivers: string[];
  phases: { name: string; duration: string; tasks: string[] }[];
  risks: { title: string; detail: string; severity: 'medium' | 'high' }[];
  costDrivers: string[];
  mvpScope: { include: string[]; defer: string[] };
}
