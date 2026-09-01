import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ncxcmzuqhndzuzbskfxf.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_kM4a_hsiZ9Xm6X90r4ILGQ_BaWZIG_S";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
