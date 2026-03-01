import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Database schema type (will be auto-generated in production)
interface Database {
  public: {
    Tables: {
      daily_foods: {
        Row: {
          id: string;
          day_of_week: string;
          category: string;
          food_name: string;
          quantity: string | null;
          checked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: string;
          category: string;
          food_name: string;
          quantity?: string | null;
          checked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          day_of_week?: string;
          category?: string;
          food_name?: string;
          quantity?: string | null;
          checked?: boolean;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          notification_frequency: string;
          notification_time: string;
          notification_types: string[];
          custom_message: string | null;
          theme: string;
          locale: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_frequency: string;
          notification_time: string;
          notification_types: string[];
          custom_message?: string | null;
          theme?: string;
          locale?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notification_frequency?: string;
          notification_time?: string;
          notification_types?: string[];
          custom_message?: string | null;
          theme?: string;
          locale?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      weekly_aggregated: {
        Row: {
          food_name: string;
          occurrences: number;
          days: string[];
        };
      };
    };
  };
}
