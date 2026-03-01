"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, Save, Send, Check } from "lucide-react";
import { sendTestNotification, scheduleNotification } from "@/lib/notifications";
import type { UserPreferences, NotificationFrequency, NotificationType } from "@/types";

interface NotificationSettingsProps {
  preferences: UserPreferences;
  onSave: (prefs: Partial<UserPreferences>) => Promise<void>;
}

export function NotificationSettings({ preferences, onSave }: NotificationSettingsProps) {
  const [frequency, setFrequency] = useState<NotificationFrequency>(
    preferences.notification_frequency
  );
  const [time, setTime] = useState(preferences.notification_time);
  const [types, setTypes] = useState<NotificationType[]>(preferences.notification_types);
  const [customMessage, setCustomMessage] = useState(preferences.custom_message || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        notification_frequency: frequency,
        notification_time: time,
        notification_types: types,
        custom_message: customMessage || null,
      });
      
      // Schedule notification with new settings
      if (types.length > 0) {
        scheduleNotification(time, frequency, types[0], customMessage);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Errore nel salvataggio delle preferenze');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      await sendTestNotification(
        types[0] || 'motivational',
        customMessage || undefined
      );
      alert('Notifica di test inviata!');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      alert('Errore nell\'invio della notifica di test. Assicurati di aver dato i permessi.');
    } finally {
      setTesting(false);
    }
  };

  const toggleType = (type: NotificationType) => {
    setTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-[var(--accent-primary)]/20">
          <Bell size={24} className="text-[var(--accent-primary)]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text">Notifiche</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            Configura i tuoi promemoria
          </p>
        </div>
      </div>

      {/* Frequency */}
      <div className="gradient-border p-6">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-[var(--accent-primary)] uppercase tracking-wide">
            Frequenza
          </span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['daily', 'alternate', 'weekly'] as NotificationFrequency[]).map((freq) => (
            <motion.button
              key={freq}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFrequency(freq)}
              className={`
                p-3 rounded-xl border-2 transition-all text-sm font-medium
                ${frequency === freq
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                  : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground-muted)] hover:border-[var(--accent-primary)]/50'
                }
              `}
            >
              {freq === 'daily' && 'Giornaliera'}
              {freq === 'alternate' && 'A giorni alterni'}
              {freq === 'weekly' && 'Settimanale'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="gradient-border p-6">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-[var(--accent-primary)] uppercase tracking-wide">
            Orario
          </span>
        </label>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--card-bg)]">
            <Clock size={20} className="text-[var(--accent-primary)]" />
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>
      </div>

      {/* Notification Types */}
      <div className="gradient-border p-6">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-[var(--accent-primary)] uppercase tracking-wide">
            Tipo di Notifica
          </span>
        </label>
        <div className="space-y-2">
          {(['shopping', 'prep', 'motivational'] as NotificationType[]).map((type) => (
            <motion.label
              key={type}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${types.includes(type)
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                  : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent-primary)]/50'
                }
              `}
            >
              <input
                type="checkbox"
                checked={types.includes(type)}
                onChange={() => toggleType(type)}
                className="custom-checkbox"
              />
              <div className="flex-1">
                <div className="font-medium text-[var(--foreground)]">
                  {type === 'shopping' && '🛒 Promemoria Spesa'}
                  {type === 'prep' && '👨‍🍳 Preparazione Cucina'}
                  {type === 'motivational' && '💪 Messaggio Motivazionale'}
                </div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">
                  {type === 'shopping' && 'Lista cibi del giorno'}
                  {type === 'prep' && 'Cibi da preparare oggi'}
                  {type === 'motivational' && 'Messaggio personalizzato'}
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="gradient-border p-6">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-[var(--accent-primary)] uppercase tracking-wide">
            Messaggio Personalizzato
          </span>
          <span className="ml-2 text-xs text-[var(--foreground-muted)] normal-case">
            (opzionale)
          </span>
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Scrivi un messaggio personalizzato per le notifiche..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent-primary)] transition-colors resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTest}
          disabled={testing || types.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
          <span>{testing ? 'Invio...' : 'Test Notifica'}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving || types.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {saved ? (
            <>
              <Check size={18} />
              <span>Salvato!</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>{saving ? 'Salvataggio...' : 'Salva Preferenze'}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Info Note */}
      <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          💡 <strong>Nota:</strong> Le notifiche push richiedono i permessi del browser. 
          Se non funzionano, controlla le impostazioni del tuo dispositivo.
        </p>
      </div>
    </div>
  );
}
