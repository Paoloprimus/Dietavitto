import type { DayOfWeek, FoodCategory } from '@/types';

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Get current day of week in Italian
 */
export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ];
  return days[new Date().getDay()];
}

/**
 * Get date for specific day of current week
 */
export function getDateForDay(dayOfWeek: DayOfWeek): Date {
  const days: DayOfWeek[] = [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ];
  
  const targetDay = days.indexOf(dayOfWeek);
  const today = new Date();
  const currentDay = today.getDay();
  const diff = targetDay - currentDay;
  
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return result;
}

/**
 * Categorize food item based on name
 */
export function categorizeFoodItem(foodName: string): FoodCategory {
  const normalized = foodName.toLowerCase().trim();
  
  // Frutta
  const fruits = ['mela', 'mele', 'pera', 'pere', 'banana', 'banane', 'melone', 'limone'];
  if (fruits.some(f => normalized.includes(f))) return 'Frutta';
  
  // Verdure
  const vegetables = [
    'insalata', 'lattuga', 'broccolo', 'broccoli', 'erbette', 'cipolla',
    'peperone', 'peperoni', 'finocchi', 'finocchio', 'pomodor', 'carota', 'carote',
    'indivia', 'valeriana', 'scalogno', 'porro', 'zucchine', 'fagiolini'
  ];
  if (vegetables.some(v => normalized.includes(v))) return 'Verdure';
  
  // Proteine
  const proteins = [
    'pollo', 'merluzzo', 'platessa', 'tonno', 'salmone', 'trota', 'tacchino',
    'manzo', 'bistecca', 'prosciutto', 'uova', 'uovo'
  ];
  if (proteins.some(p => normalized.includes(p))) return 'Proteine';
  
  // Carboidrati
  const carbs = [
    'pane', 'fette biscottate', 'biscotti', 'cus cus', 'couscous'
  ];
  if (carbs.some(c => normalized.includes(c))) return 'Carboidrati';
  
  // Latticini
  const dairy = [
    'latte', 'mozzarella', 'ricotta', 'yogurt', 'parmigiano',
    'crescenza', 'formaggio'
  ];
  if (dairy.some(d => normalized.includes(d))) return 'Latticini';
  
  // Bevande
  if (normalized.includes('caffè') || normalized.includes('acqua')) return 'Bevande';
  
  // Condimenti
  const condiments = [
    'olio', 'aceto', 'curry', 'prezzemolo', 'marmellata'
  ];
  if (condiments.some(c => normalized.includes(c))) return 'Condimenti';
  
  // Frutta secca / Altro
  const nuts = ['noci', 'nocciole', 'mandorle'];
  if (nuts.some(n => normalized.includes(n))) return 'Altro';
  
  return 'Altro';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        console.error('Fallback: Could not copy text', error);
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard', error);
    return false;
  }
}

/**
 * Generate notification body based on type
 */
export function generateNotificationMessage(
  type: string,
  customMessage?: string,
  foodList?: string[]
): string {
  if (customMessage) return customMessage;
  
  switch (type) {
    case 'shopping':
      if (foodList && foodList.length > 0) {
        return `🛒 Lista spesa di oggi:\n${foodList.join(', ')}`;
      }
      return '🛒 Ricordati di fare la spesa!';
      
    case 'prep':
      return '👨‍🍳 È ora di preparare i pasti di oggi!';
      
    case 'motivational':
      return '💪 Continua così! La tua dieta sta andando alla grande! 🎉';
      
    default:
      return '🔔 Promemoria DietaVitto';
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show browser notification
 */
export async function showNotification(
  title: string,
  body: string,
  icon: string = '/icons/icon-192x192.png'
): Promise<void> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }
  
  if (Notification.permission === 'granted') {
    // Use service worker if available
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200],
        tag: 'dietavitto-notification',
      });
    } else {
      // Fallback to regular notification
      new Notification(title, { body, icon });
    }
  }
}

/**
 * Format time to HH:MM
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse time string HH:MM to Date
 */
export function parseTime(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Class names helper (simple version of clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
