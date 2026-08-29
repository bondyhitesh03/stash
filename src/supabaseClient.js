import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  console.warn(
    'Stash: Supabase environment variables are missing. Copy .env.example to .env, ' +
    'fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
  );
}

// Guard against createClient throwing on undefined args during local dev before .env is set up.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
