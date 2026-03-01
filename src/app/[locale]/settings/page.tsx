"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationSettings } from "@/components/NotificationSettings";
import type { UserPreferences } from "@/types";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      // For demo, use a hardcoded user_id
      // In production, get from auth session
      const userId = '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        const defaultPrefs = {
          user_id: userId,
          notification_frequency: 'daily' as const,
          notification_time: '08:00:00',
          notification_types: ['shopping'] as const,
          custom_message: null,
          theme: 'dark' as const,
          locale: 'it' as const,
        };

        const { data: newData, error: insertError } = await supabase
          .from('user_preferences')
          .insert(defaultPrefs)
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newData);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      // Set default preferences even on error
      setPreferences({
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        notification_frequency: 'daily',
        notification_time: '08:00:00',
        notification_types: ['shopping'],
        custom_message: null,
        theme: 'dark',
        locale: 'it',
        updated_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updates: Partial<UserPreferences>) => {
    if (!preferences) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', preferences.user_id);

      if (error) throw error;

      // Update local state
      setPreferences({ ...preferences, ...updates });
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  };

  // const handleTestNotification = async () => {
    // Notification test is handled in the component
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[var(--foreground-muted)]">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--foreground-muted)]">
            Errore nel caricamento delle impostazioni
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--background)]/80 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-[var(--card-bg)] transition-colors"
            >
              <ArrowLeft size={24} className="text-[var(--foreground)]" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Impostazioni
              </h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Configura notifiche e preferenze
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <NotificationSettings
          preferences={preferences}
          onSave={handleSave}
        //  onTestNotification={handleTestNotification}
        />
      </main>
    </div>
  );
}
