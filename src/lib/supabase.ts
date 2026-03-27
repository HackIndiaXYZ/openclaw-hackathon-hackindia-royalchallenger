import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Issue = {
  id: string;
  issue_code: string | null;
  user_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  severity: string | null;
  department: string | null;
  ai_summary: string | null;
  ai_confidence: number | null;
  status: string;
  upvotes: number;
  image_url: string | null;
  latitude: number;
  longitude: number;
  area_name: string | null;
  created_at: string;
  updated_at: string;
};

export type AreaScore = {
  id: string;
  area_name: string;
  score: number;
  open_count: number;
  resolved_count: number;
  updated_at: string;
};
