"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Check, 
  ChevronDown, 
  ArrowUpDown,
  Package,
} from "lucide-react";
import { copyToClipboard, categorizeFoodItem } from "@/lib/utils";
import type { WeeklyAggregated, FoodCategory } from "@/types";

interface WeeklyAggregatedListProps {
  aggregatedData: WeeklyAggregated[];
}

type SortMode = 'alphabetical' | 'frequency';

export function WeeklyAggregatedList({ aggregatedData }: WeeklyAggregatedListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('frequency');
  const [copied, setCopied] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<FoodCategory>>(
    new Set(['Frutta', 'Verdure', 'Proteine', 'Carboidrati', 'Latticini'])
  );

  // Categorize and sort data
  const categorizedData = categorizeData(aggregatedData, sortMode);

  const handleCopyList = async () => {
    const listText = generateListText(categorizedData);
    const success = await copyToClipboard(listText);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleCategory = (category: FoodCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const toggleSortMode = () => {
    setSortMode((prev) => prev === 'alphabetical' ? 'frequency' : 'alphabetical');
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleSortMode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-primary)]/50 transition-colors text-sm"
        >
          <ArrowUpDown size={16} />
          <span className="text-[var(--foreground-muted)]">
            {sortMode === 'alphabetical' ? 'Alfabetico' : 'Per frequenza'}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyList}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-black font-semibold hover:opacity-90 transition-opacity"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copiato!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copia Lista</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Total Items Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--accent-primary)]/20">
            <Package size={24} className="text-[var(--accent-primary)]" />
          </div>
          <div>
            <p className="text-2xl font-bold gradient-text">
              {aggregatedData.length}
            </p>
            <p className="text-sm text-[var(--foreground-muted)]">
              alimenti unici questa settimana
            </p>
          </div>
        </div>
      </div>

      {/* Category Groups */}
      <div className="space-y-3">
        {categorizedData.map((group, index) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CategoryCard
              group={group}
              isExpanded={expandedCategories.has(group.category)}
              onToggle={() => toggleCategory(group.category)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface CategoryGroup {
  category: FoodCategory;
  items: WeeklyAggregated[];
  totalCount: number;
}

interface CategoryCardProps {
  group: CategoryGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

function CategoryCard({ group, isExpanded, onToggle }: CategoryCardProps) {
  const categoryEmoji = getCategoryEmoji(group.category);
  const categoryColor = getCategoryColor(group.category);

  return (
    <div className="gradient-border overflow-hidden">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--card-border)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryEmoji}</span>
          <div className="text-left">
            <h3 className="font-semibold text-[var(--foreground)]">
              {group.category}
            </h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              {group.items.length} alimenti
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor 
            }}
          >
            {group.totalCount}x
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-[var(--foreground-muted)]" />
          </motion.div>
        </div>
      </button>

      {/* Category Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2">
              {group.items.map((item, index) => (
                <motion.div
                  key={item.food_name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--background-secondary)]"
                >
                  <span className="text-[var(--foreground)]">
                    {item.food_name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        backgroundColor: `${categoryColor}15`,
                        color: categoryColor 
                      }}
                    >
                      {item.occurrences}x
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">
                      {item.days.join(', ')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper functions

function categorizeData(
  data: WeeklyAggregated[],
  sortMode: SortMode
): CategoryGroup[] {
  // Add category to each item
  const itemsWithCategories = data.map((item) => ({
    ...item,
    category: categorizeFoodItem(item.food_name),
  }));

  // Group by category
  const grouped = itemsWithCategories.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<FoodCategory, WeeklyAggregated[]>);

  // Sort items within each category
  Object.keys(grouped).forEach((category) => {
    const cat = category as FoodCategory;
    grouped[cat].sort((a, b) => {
      if (sortMode === 'alphabetical') {
        return a.food_name.localeCompare(b.food_name);
      } else {
        return b.occurrences - a.occurrences;
      }
    });
  });

  // Convert to array and calculate totals
  const categoryOrder: FoodCategory[] = [
    'Frutta',
    'Verdure',
    'Proteine',
    'Carboidrati',
    'Latticini',
    'Bevande',
    'Condimenti',
    'Altro',
  ];

  return categoryOrder
    .filter((category) => grouped[category]?.length > 0)
    .map((category) => ({
      category,
      items: grouped[category],
      totalCount: grouped[category].reduce((sum, item) => sum + item.occurrences, 0),
    }));
}

function generateListText(categorizedData: CategoryGroup[]): string {
  let text = '🛒 Lista Spesa Settimanale - DietaVitto\n\n';
  
  categorizedData.forEach((group) => {
    text += `${getCategoryEmoji(group.category)} ${group.category.toUpperCase()}\n`;
    group.items.forEach((item) => {
      text += `  • ${item.food_name} (${item.occurrences}x)\n`;
    });
    text += '\n';
  });
  
  return text;
}

function getCategoryEmoji(category: FoodCategory): string {
  const emojis: Record<FoodCategory, string> = {
    Frutta: '🍎',
    Verdure: '🥬',
    Proteine: '🍖',
    Carboidrati: '🍞',
    Latticini: '🥛',
    Bevande: '☕',
    Condimenti: '🧂',
    Altro: '📦',
  };
  return emojis[category];
}

function getCategoryColor(category: FoodCategory): string {
  const colors: Record<FoodCategory, string> = {
    Frutta: '#ff6b6b',
    Verdure: '#51cf66',
    Proteine: '#ff922b',
    Carboidrati: '#ffd43b',
    Latticini: '#74c0fc',
    Bevande: '#a78bfa',
    Condimenti: '#f783ac',
    Altro: '#94a3b8',
  };
  return colors[category];
}
