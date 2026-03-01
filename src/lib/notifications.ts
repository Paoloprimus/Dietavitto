import { 
  requestNotificationPermission, 
  showNotification,
  generateNotificationMessage 
} from './utils';

/**
 * Initialize push notifications
 */
export async function initializePushNotifications(): Promise<boolean> {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    console.log('Notification permission denied');
    return false;
  }
  
  // Register service worker if not already registered
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }
  
  return true;
}

/**
 * Schedule notification based on user preferences
 */
export function scheduleNotification(
  time: string, // HH:MM format
  frequency: string,
  type: string,
  customMessage?: string,
  foodList?: string[]
): void {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return;
  }
  
  // Parse time
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // If the time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const delay = scheduledTime.getTime() - now.getTime();
  
  // Store in localStorage for service worker to use
  const notificationData = {
    type,
    customMessage,
    foodList,
    frequency,
    nextNotification: scheduledTime.toISOString(),
  };
  
  localStorage.setItem('dietavitto_notification_schedule', JSON.stringify(notificationData));
  
  // Schedule using setTimeout (this is simplified - in production use service worker background sync)
  setTimeout(() => {
    const message = generateNotificationMessage(type, customMessage, foodList);
    showNotification('DietaVitto', message);
    
    // Reschedule based on frequency
    if (frequency === 'daily') {
      scheduleNotification(time, frequency, type, customMessage, foodList);
    } else if (frequency === 'alternate') {
      const nextTime = new Date(scheduledTime);
      nextTime.setDate(nextTime.getDate() + 2);
      const nextDelay = nextTime.getTime() - Date.now();
      setTimeout(() => {
        scheduleNotification(time, frequency, type, customMessage, foodList);
      }, nextDelay);
    } else if (frequency === 'weekly') {
      const nextTime = new Date(scheduledTime);
      nextTime.setDate(nextTime.getDate() + 7);
      const nextDelay = nextTime.getTime() - Date.now();
      setTimeout(() => {
        scheduleNotification(time, frequency, type, customMessage, foodList);
      }, nextDelay);
    }
  }, delay);
}

/**
 * Send test notification
 */
export async function sendTestNotification(
  type: string,
  customMessage?: string,
  foodList?: string[]
): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    throw new Error('Notification permission not granted');
  }
  
  const message = generateNotificationMessage(type, customMessage, foodList);
  await showNotification('Test DietaVitto', message);
}

/**
 * Cancel scheduled notifications
 */
export function cancelScheduledNotifications(): void {
  localStorage.removeItem('dietavitto_notification_schedule');
}

/**
 * Get notification schedule status
 */
export function getNotificationSchedule(): {
  scheduled: boolean;
  nextNotification?: string;
  type?: string;
  frequency?: string;
} {
  const stored = localStorage.getItem('dietavitto_notification_schedule');
  
  if (!stored) {
    return { scheduled: false };
  }
  
  try {
    const data = JSON.parse(stored);
    return {
      scheduled: true,
      nextNotification: data.nextNotification,
      type: data.type,
      frequency: data.frequency,
    };
  } catch (error) {
    console.error('Failed to parse notification schedule', error);
    return { scheduled: false };
  }
}
