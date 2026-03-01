// =============================================
// DietaVitto Types
// =============================================

export type Locale = 'it' | 'en' | 'de';

export type Theme = 'light' | 'dark';

export type DayOfWeek = 'Lunedì' | 'Martedì' | 'Mercoledì' | 'Giovedì' | 'Venerdì' | 'Sabato' | 'Domenica';

export type MealCategory = 'Colazione' | 'Pranzo' | 'Cena';

export type FoodCategory = 
  | 'Frutta'
  | 'Verdure'
  | 'Proteine'
  | 'Carboidrati'
  | 'Latticini'
  | 'Bevande'
  | 'Condimenti'
  | 'Altro';

export type NotificationFrequency = 'daily' | 'alternate' | 'weekly';

export type NotificationType = 'shopping' | 'prep' | 'motivational';

// =============================================
// Database Models
// =============================================

export interface DailyFood {
  id: string;
  day_of_week: DayOfWeek;
  category: MealCategory;
  food_name: string;
  quantity?: string | null;
  checked: boolean;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  notification_frequency: NotificationFrequency;
  notification_time: string; // HH:MM format
  notification_types: NotificationType[];
  custom_message?: string | null;
  theme: Theme;
  locale: Locale;
  updated_at: string;
}

export interface WeeklyAggregated {
  food_name: string;
  occurrences: number;
  days: DayOfWeek[];
  category?: FoodCategory;
}

// =============================================
// UI Models
// =============================================

export interface DayData {
  day: DayOfWeek;
  date: string; // DD/MM/YYYY format
  meals: MealData[];
}

export interface MealData {
  category: MealCategory;
  items: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  quantity?: string;
  checked: boolean;
}

export interface Session {
  userId: string;
  preferences: UserPreferences;
}

// =============================================
// API Request/Response Types
// =============================================

export interface CreateFoodRequest {
  day_of_week: DayOfWeek;
  category: MealCategory;
  food_name: string;
  quantity?: string;
}

export interface UpdateFoodRequest {
  checked?: boolean;
  quantity?: string;
}

export interface UpdatePreferencesRequest {
  notification_frequency?: NotificationFrequency;
  notification_time?: string;
  notification_types?: NotificationType[];
  custom_message?: string;
  theme?: Theme;
  locale?: Locale;
}

export interface TestNotificationRequest {
  message: string;
  type: NotificationType;
}

// =============================================
// Component Props Types
// =============================================

export interface DailyFoodListProps {
  weekData: DayData[];
  onFoodCheck: (foodId: string, checked: boolean) => void;
  currentDayIndex: number;
  onDayChange: (index: number) => void;
}

export interface WeeklyAggregatedListProps {
  aggregatedData: WeeklyAggregated[];
  sortBy: 'alphabetical' | 'frequency';
  onSortChange: (sortBy: 'alphabetical' | 'frequency') => void;
  onCopyList: () => void;
}

export interface NotificationSettingsProps {
  preferences: UserPreferences;
  onSave: (prefs: UpdatePreferencesRequest) => Promise<void>;
  onTestNotification: () => Promise<void>;
}

export interface FoodCardProps {
  food: FoodItem;
  onCheck: (checked: boolean) => void;
  category: MealCategory;
}

export interface DayCardProps {
  dayData: DayData;
  onFoodCheck: (foodId: string, checked: boolean) => void;
  isActive: boolean;
}

// =============================================
// Utility Types
// =============================================

export type SortOrder = 'alphabetical' | 'frequency';

export interface CategoryGroup {
  category: FoodCategory;
  items: WeeklyAggregated[];
  totalCount: number;
}
