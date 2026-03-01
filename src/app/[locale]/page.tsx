"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, List, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { DailyFoodList } from "@/components/DailyFoodList";
import type { DayData, MealData, DayOfWeek } from "@/types";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeekData();
  }, []);

  const loadWeekData = async () => {
    setLoading(true);
    try {
      // Carica tutti i cibi dal DB
      const { data, error } = await supabase
        .from('daily_foods')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        alert(`Errore nel caricamento: ${error.message}`);
        return;
      }

      // Genera 7 giorni partendo da oggi
      const today = new Date();
      const dayNames: DayOfWeek[] = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
      
      const days: DayData[] = [];
      
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        const dayIndex = currentDate.getDay(); // 0 = Domenica, 1 = Lunedì, ...
        const dayName = dayNames[dayIndex];
        
        // Trova i cibi per questo giorno della settimana
        const dayFoods = data?.filter((f) => f.day_of_week === dayName) || [];
        
        const meals: MealData[] = [
          'Colazione',
          'Pranzo',
          'Cena',
        ].map((category) => ({
          category: category as any,
          items: dayFoods
            .filter((f) => f.category === category)
            .map((f) => ({
              id: f.id,
              name: f.food_name,
              quantity: f.quantity || undefined,
              checked: f.checked,
            })),
        })).filter((meal) => meal.items.length > 0);

        days.push({
          day: dayName,
          date: formatDate(currentDate),
          meals,
        });
      }

      setWeekData(days);
    } catch (error) {
      console.error('Error loading week data:', error);
      alert('Errore nella connessione al database');
    } finally {
      setLoading(false);
    }
  };

  const handleFoodCheck = async (foodId: string, checked: boolean) => {
    console.log('Updating food:', foodId, 'to:', checked);
    
    // Update local state immediately
    setWeekData((prev) =>
      prev.map((day) => ({
        ...day,
        meals: day.meals.map((meal) => ({
          ...meal,
          items: meal.items.map((item) =>
            item.id === foodId ? { ...item, checked } : item
          ),
        })),
      }))
    );

    // Then update database
    try {
      const { data, error } = await supabase
        .from('daily_foods')
        .update({ checked })
        .eq('id', foodId);

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        // Revert on error
        setWeekData((prev) =>
          prev.map((day) => ({
            ...day,
            meals: day.meals.map((meal) => ({
              ...meal,
              items: meal.items.map((item) =>
                item.id === foodId ? { ...item, checked: !checked } : item
              ),
            })),
          }))
        );
        alert(`Errore: ${error.message}`);
      }
    } catch (error) {
      console.error('Catch error:', error);
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
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black gradient-text"
            >
              DietaVitto
            </motion.h1>

            {/* Navigation */}
            <nav className="flex gap-2">
              <NavButton
                icon={<Calendar size={20} />}
                label="Giornaliero"
                isActive={true}
                onClick={() => {}}
              />
              <NavButton
                icon={<List size={20} />}
                label="Settimanale"
                isActive={false}
                onClick={() => router.push('/it/weekly')}
              />
              <NavButton
                icon={<Settings size={20} />}
                label="Impostazioni"
                isActive={false}
                onClick={() => router.push('/it/settings')}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <DailyFoodList
          weekData={weekData}
          onFoodCheck={handleFoodCheck}
          currentDayIndex={0}
        />
      </main>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        p-3 rounded-xl transition-colors relative group
        ${
          isActive
            ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)]"
        }
      `}
      title={label}
    >
      {icon}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[var(--card-bg)] border border-[var(--card-border)] text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </motion.button>
  );
}