import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ijfjuezgvroyhtwcnlrx.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZmp1ZXpndnJveWh0d2NubHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjIzNzQsImV4cCI6MjEwNTg5ODM3NH0.cbzToWOHT5DeYbtXDqG_lt_Lfxsb3Y-eJaQkC5UJW40';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Using offline mock store. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable live PostgreSQL sync.',
    };
  }

  try {
    const { error } = await supabase.from('events').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { connected: true, message: 'Connected to Supabase PostgreSQL database.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Failed to connect to Supabase.' };
  }
}
