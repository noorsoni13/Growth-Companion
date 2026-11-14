const SUPABASE_URL = 'https://wepyjfwadcnfojcgzrly.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PagyEBEpSZdBJ1Jliy2aLw_ofR0krk5';

if (typeof window !== 'undefined' && window.supabase) {
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
}

const supabaseClient = window.supabaseClient;