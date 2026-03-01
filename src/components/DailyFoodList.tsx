"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { DayData, FoodItem, MealCategory } from "@/types";

interface DailyFoodListProps {
  weekData: DayData[];
  onFoodCheck: (foodId: string, checked: boolean) => void;
  currentDayIndex?: number;
}

export function DailyFoodList({ 
  weekData, 
  onFoodCheck,
  currentDayIndex: initialDayIndex = 0 
}: DailyFoodListProps) {
  const [currentIndex, setCurrentIndex] = useState(initialDayIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const handleScroll = () => {
    if (scrollContainerRef.current && !isScrollingRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < weekData.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div className="relative">
      {/* Day Header */}
      <div className="text-center mb-6">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold gradient-text"
        >
          {weekData[currentIndex]?.day}
        </motion.p>
        <motion.p
          key={`date-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[var(--foreground-muted)] mt-1"
        >
          {weekData[currentIndex]?.date}
        </motion.p>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex">
          {weekData.map((dayData, index) => (
            <div
              key={dayData.day}
              className="w-full flex-shrink-0 px-4 snap-center"
            >
              <DayCard
                dayData={dayData}
                onFoodCheck={onFoodCheck}
                isActive={index === currentIndex}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {weekData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (scrollContainerRef.current) {
                isScrollingRef.current = true;
                const container = scrollContainerRef.current;
                const cardWidth = container.clientWidth;
                container.scrollTo({
                  left: index * cardWidth,
                  behavior: 'smooth'
                });
                setCurrentIndex(index);
                setTimeout(() => {
                  isScrollingRef.current = false;
                }, 500);
              }
            }}
            className={`
              h-2 rounded-full transition-all duration-300
              ${index === currentIndex 
                ? 'w-8 bg-[var(--accent-primary)]' 
                : 'w-2 bg-[var(--card-border)] hover:bg-[var(--foreground-muted)]'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}

interface DayCardProps {
  dayData: DayData;
  onFoodCheck: (foodId: string, checked: boolean) => void;
  isActive: boolean;
}

function DayCard({ dayData, onFoodCheck, isActive }: DayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        y: 0,
        scale: isActive ? 1 : 0.95
      }}
      transition={{ duration: 0.3 }}
      className="gradient-border p-6 min-h-[500px]"
    >
      {/* Meals */}
      <div className="space-y-6">
        {dayData.meals.map((meal, mealIndex) => (
          <motion.div
            key={meal.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: mealIndex * 0.1 }}
          >
            <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-3 uppercase tracking-wide">
              {meal.category}
            </h3>
            <div className="space-y-2">
              {meal.items.map((food, foodIndex) => (
                <FoodCheckbox
                  key={food.id}
                  food={food}
                  onCheck={(checked) => onFoodCheck(food.id, checked)}
                  delay={mealIndex * 0.1 + foodIndex * 0.05}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface FoodCheckboxProps {
  food: FoodItem;
  onCheck: (checked: boolean) => void;
  delay: number;
}

function FoodCheckbox({ food, onCheck, delay }: FoodCheckboxProps) {
  return (
    <motion.label
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`
        flex items-center gap-3 p-3 rounded-lg 
        bg-[var(--card-bg)] border border-[var(--card-border)]
        hover:border-[var(--accent-primary)]/50
        cursor-pointer transition-all duration-200
        ${food.checked ? 'opacity-60' : ''}
      `}
    >
      <input
        type="checkbox"
        checked={food.checked}
        onChange={(e) => onCheck(e.target.checked)}
        className="custom-checkbox"
      />
      <div className="flex-1">
        <span className={`
          ${food.checked ? 'line-through text-[var(--foreground-muted)]' : 'text-[var(--foreground)]'}
        `}>
          {food.name}
        </span>
        {food.quantity && (
          <span className="ml-2 text-xs text-[var(--foreground-muted)]">
            ({food.quantity})
          </span>
        )}
      </div>
    </motion.label>
  );
}