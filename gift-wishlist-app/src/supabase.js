import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'VOTRE_URL_SUPABASE';
const supabaseKey = 'VOTRE_CLE_API_PUBLIQUE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
