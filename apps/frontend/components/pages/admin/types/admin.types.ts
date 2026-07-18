// ─── Shared Admin Types ───────────────────────────────────────────────────────

export type TabType =
  | 'people'
  | 'faqs'
  | 'open_positions'
  | 'milestones'
  | 'partner_products'
  | 'tool_config'
  | 'submissions';

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  is_active: boolean;
  display_order: number;
}

export interface OpenPosition {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  category: string;
  apply_link: string;
  application_email: string;
  is_active: boolean;
  display_order: number;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  image_url: string | null;
  display_order: number;
}

export interface PartnerProduct {
  id: string;
  name: string;
  status_type: string;
  status_text: string;
  status_subtext: string | null;
  tagline: string;
  subtitle: string;
  stat_value: string;
  stat_subtext: string;
  what_we_did: string;
  industry: string;
  duration: string;
  team_size: string;
  tech_stack: string[];
  features: Array<{ text: string }>;
  gallery_images: string[];
  website_url: string | null;
  logo_url: string | null;
  is_active: boolean;
  display_order: number;
}
