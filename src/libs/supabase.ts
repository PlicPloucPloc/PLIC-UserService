import { createClient } from '@supabase/supabase-js';

const { supabase_url, supabase_key } = process.env;
console.log("Supabase URL:", supabase_url);
if (!supabase_url || !supabase_key) {
  throw new Error('Supabase URL and Service Role Key must be provided');
}
export const supabase = createClient(supabase_url, supabase_key)
