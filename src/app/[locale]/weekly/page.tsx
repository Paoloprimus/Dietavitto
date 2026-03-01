"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { WeeklyAggregatedList } from "@/components/WeeklyAggregatedList";
import type { WeeklyAggregated } from "@/types";
import { supabase } from "@/lib/supabase";

export default function WeeklyPage() {
  const router = useRouter();
  const [aggregatedData, setAggregatedData] = useState<WeeklyAggregated[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAggregatedData();
  }, []);

  const loadAggregatedData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weekly_aggregated')
        .select('*');

      if (error) throw error;

      setAggregatedData(data || []);
    } catch (error) {
      console.error('Error loading aggregated data:', error);
      alert('Errore nel caricamento della lista settimanale');
    } finally {
      setLoading(false);
    }
  };

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
                Lista Settimanale
              </h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                Tutti i cibi della settimana aggregati
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <WeeklyAggregatedList aggregatedData={aggregatedData} />
      </main>
    </div>
  );
}
