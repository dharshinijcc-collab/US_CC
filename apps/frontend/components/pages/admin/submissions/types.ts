export interface Submission {
  id: string;
  form_type: string;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  payload: any;
  assigned_reviewer: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface HistoryItem {
  id: string;
  previous_status: string | null;
  current_status: string;
  changed_by: string;
  changed_at: string;
  internal_notes: string | null;
}
