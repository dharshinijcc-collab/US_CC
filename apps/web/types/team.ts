// ── Team Member Types ────────────────────────────────────────

export type TeamCategory = 'Founder' | 'Partner' | 'Advisor' | 'Team Member';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  category: TeamCategory;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberInput {
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  category: TeamCategory;
  display_order?: number;
  is_active?: boolean;
}

export interface ReorderPayload {
  updates: { id: string; display_order: number }[];
}
