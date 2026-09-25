import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './index.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = config.supabase.url;
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;

  if (url && key) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      return supabaseClient;
    } catch (error) {
      console.warn('⚠️ Could not initialize Supabase client:', error);
      return null;
    }
  }

  return null;
}
