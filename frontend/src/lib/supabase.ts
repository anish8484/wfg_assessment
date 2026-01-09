import { createClient } from '@supabase/supabase-js'

// These should be env variables. For assessment I will use placeholders.
// User will need to replace them.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
