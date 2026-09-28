/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Eye, EyeOff, Lock, Settings as SettingsIcon, Plus, Bell, BookOpen } from 'lucide-react';
import { UserSettings } from '../types/cycle';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  activeTab: 'today' | 'calendar' | 'bbt' | 'fertility' | 'articles' | 'history';
  setActiveTab: (tab: 'today' | 'calendar' | 'bbt' | 'fertility' | 'articles' | 'history') => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onOpenSettings: () => void;
  onOpenReminders: () => void;
  onOpenLogModal: () => void;
  onLockApp: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenReminders,
  onOpenLogModal,
  onLockApp,
}) => {
  const toggleDiscrete = () => {
    onUpdateSettings({
      ...settings,
      discreteMode: !settings.discreteMode,
    });
  };

  const activeRemindersCount = settings.reminders?.filter(r => r.enabled).length || 0;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('today')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-rose-950 group-hover:text-rose-700 transition-colors">
              FeminaCycle
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'today'
                ? 'bg-rose-100/80 text-rose-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-rose-100/80 text-rose-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Calendario
          </button>
          <button
            onClick={() => setActiveTab('bbt')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'bbt'
                ? 'bg-rose-100/80 text-rose-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Temperatura Basal
          </button>
          <button
            onClick={() => setActiveTab('fertility')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'fertility'
                ? 'bg-rose-100/80 text-rose-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Fertilidad
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-rose-100/80 text-rose-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Consejos & Guías
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-rose-100/80 text-rose-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Historial
          </button>
        </nav>

        {/* Zone 3: Actions & Privacy Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="topbar" />

          {/* Reminders Button */}
          <button
            onClick={onOpenReminders}
            title="Configurar recordatorios y avisos"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {activeRemindersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeRemindersCount}
              </span>
            )}
          </button>

          {/* Discrete Mode Toggle */}
          <button
            onClick={toggleDiscrete}
            title={settings.discreteMode ? 'Modo discreto activado (datos íntimos ocultos). Clic para mostrar.' : 'Activar modo discreto (ocultar intimidad)'}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
              settings.discreteMode
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {settings.discreteMode ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-600" />
                <span className="hidden lg:inline font-medium">Discreto</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden lg:inline text-slate-500">Visible</span>
              </>
            )}
          </button>

          {/* PIN Lock button if enabled */}
          {settings.pinEnabled && (
            <button
              onClick={onLockApp}
              title="Bloquear aplicación con PIN"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Quick Log CTA */}
          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Ajustes del ciclo y base de datos local"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
