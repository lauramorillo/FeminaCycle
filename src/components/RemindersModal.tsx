/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Bell,
  Check,
  Clock,
  Calendar,
  Thermometer,
  Heart,
  Smile,
  AlertCircle,
  Volume2,
  Sparkles
} from 'lucide-react';
import { ReminderItem, UserSettings } from '../types/cycle';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [reminders, setReminders] = useState<ReminderItem[]>(settings.reminders || []);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [testToast, setTestToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setReminders(
      reminders.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleTimeChange = (id: string, time: string) => {
    setReminders(
      reminders.map(r => (r.id === id ? { ...r, time } : r))
    );
  };

  const handleDaysChange = (id: string, daysBefore: number) => {
    setReminders(
      reminders.map(r => (r.id === id ? { ...r, daysBefore } : r))
    );
  };

  const handleMessageChange = (id: string, message: string) => {
    setReminders(
      reminders.map(r => (r.id === id ? { ...r, message } : r))
    );
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
      } catch (err) {
        console.error('Error requesting notification permission', err);
      }
    }
  };

  const triggerTestNotification = (item: ReminderItem) => {
    // Show in-app toast
    setTestToast(item.message);
    setTimeout(() => setTestToast(null), 4000);

    // If browser notification supported and permitted, trigger it
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`FeminaCycle · ${item.title}`, {
          body: item.message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.log('Browser notification fallback to in-app toast');
      }
    }
  };

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      reminders,
    });
    onClose();
  };

  const getTypeIcon = (type: ReminderItem['type']) => {
    switch (type) {
      case 'bbt':
        return <Thermometer className="w-4 h-4 text-rose-500" />;
      case 'symptoms':
        return <Smile className="w-4 h-4 text-amber-500" />;
      case 'fertile_window':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'period_soon':
        return <Calendar className="w-4 h-4 text-rose-600" />;
      case 'sex':
        return <Heart className="w-4 h-4 text-pink-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">
                Recordatorios y Notificaciones
              </h2>
              <p className="text-xs text-slate-500">
                Configura alertas personalizadas para no olvidar tus registros clave
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Banner */}
        {notificationPermission !== 'granted' && (
          <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Activa las notificaciones del navegador para recibir avisos aunque la pestaña no esté activa.</span>
            </div>
            <button
              onClick={requestBrowserPermission}
              className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Permitir
            </button>
          </div>
        )}

        {/* Test Toast Alert */}
        {testToast && (
          <div className="px-5 py-3 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Simulación de Alerta: "{testToast}"</span>
            </div>
            <button onClick={() => setTestToast(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Reminders List */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {reminders.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.enabled ? 'bg-white border-rose-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                    item.enabled ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Expanded Settings when Enabled */}
              {item.enabled && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Time Input */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-600">Hora del aviso:</span>
                      <input
                        type="time"
                        value={item.time}
                        onChange={e => handleTimeChange(item.id, e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5 font-bold font-mono text-slate-800 focus:outline-none"
                      />
                    </div>

                    {/* Days Before Input (for period or fertile window) */}
                    {item.daysBefore !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-600">Avisar:</span>
                        <select
                          value={item.daysBefore}
                          onChange={e => handleDaysChange(item.id, Number(e.target.value))}
                          className="bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5 text-xs font-semibold text-slate-800 focus:outline-none"
                        >
                          <option value={1}>1 día antes</option>
                          <option value={2}>2 días antes</option>
                          <option value={3}>3 días antes</option>
                        </select>
                      </div>
                    )}

                    {/* Test Button */}
                    <button
                      type="button"
                      onClick={() => triggerTestNotification(item)}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      Probar aviso
                    </button>
                  </div>

                  {/* Customizable message */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                      Mensaje de la notificación:
                    </label>
                    <input
                      type="text"
                      value={item.message}
                      onChange={e => handleMessageChange(item.id, e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Guardar recordatorios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
