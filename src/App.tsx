/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Thermometer,
  Sparkles,
  History,
  Home,
  Plus,
  BookOpen,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { UserSettings, DailyLog } from './types/cycle';
import {
  loadSettings,
  saveSettings,
  loadLogs,
  upsertLog,
  deleteLog,
  checkPinUnlocked,
  setPinUnlocked,
  clearAllLogs,
  restoreDemoData,
  isDemoDataActive
} from './utils/storage';
import { formatDateISO, getCurrentCycleMetrics } from './utils/cycleCalculations';

import { TopBar } from './components/TopBar';
import { CycleStatusCard } from './components/CycleStatusCard';
import { CalendarView } from './components/CalendarView';
import { BBTChart } from './components/BBTChart';
import { FertilityInsights } from './components/FertilityInsights';
import { EducationalSection } from './components/EducationalSection';
import { CycleHistory } from './components/CycleHistory';
import { DailyLogModal } from './components/DailyLogModal';
import { SettingsModal } from './components/SettingsModal';
import { RemindersModal } from './components/RemindersModal';
import { PinLockScreen } from './components/PinLockScreen';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [logs, setLogs] = useState<DailyLog[]>(() => loadLogs());
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'bbt' | 'fertility' | 'articles' | 'history'>('today');

  // Modal controls
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalDate, setLogModalDate] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);

  // Security Lock
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const s = loadSettings();
    return s.pinEnabled && !checkPinUnlocked();
  });

  const todayISO = formatDateISO(new Date());
  const todayLog = logs.find(l => l.date === todayISO);
  const cycleMetrics = getCurrentCycleMetrics(logs, settings);

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSaveLog = (newLog: DailyLog) => {
    const updated = upsertLog(newLog);
    setLogs(updated);
  };

  const handleDeleteLog = (date: string) => {
    const updated = deleteLog(date);
    setLogs(updated);
  };

  const handleOpenLogModal = (date?: string) => {
    setLogModalDate(date || todayISO);
    setIsLogModalOpen(true);
  };

  const handleDataReload = () => {
    setSettings(loadSettings());
    setLogs(loadLogs());
  };

  const handleClearAllLogs = () => {
    if (window.confirm('¿Deseas borrar todos los datos de muestra y comenzar a registrar tu ciclo desde cero?')) {
      const emptyLogs = clearAllLogs();
      setLogs(emptyLogs);
    }
  };

  const handleRestoreDemo = () => {
    const demoLogs = restoreDemoData();
    setLogs(demoLogs);
  };

  const handleUnlock = () => {
    setPinUnlocked(true);
    setIsLocked(false);
  };

  const handleLock = () => {
    setPinUnlocked(false);
    setIsLocked(true);
  };

  if (isLocked && settings.pinEnabled) {
    return <PinLockScreen correctPin={settings.pinCode} onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-rose-50/30 text-slate-800 flex flex-col pb-24 md:pb-12">
      {/* Top Bar Contract (1 row, 3 zones, wordmark brand) */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenLogModal={() => handleOpenLogModal()}
        onLockApp={handleLock}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'today' && (
          <CycleStatusCard
            logs={logs}
            settings={settings}
            todayLog={todayLog}
            onOpenLogModal={handleOpenLogModal}
            onViewBBT={() => setActiveTab('bbt')}
            onViewFertility={() => setActiveTab('fertility')}
            onClearAllLogs={handleClearAllLogs}
            onRestoreDemo={handleRestoreDemo}
            isDemoActive={isDemoDataActive()}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            logs={logs}
            settings={settings}
            onOpenLogModal={handleOpenLogModal}
          />
        )}

        {activeTab === 'bbt' && (
          <BBTChart
            logs={logs}
            settings={settings}
            onOpenLogModal={handleOpenLogModal}
          />
        )}

        {activeTab === 'fertility' && (
          <FertilityInsights
            logs={logs}
            settings={settings}
            onOpenLogModal={handleOpenLogModal}
            onViewBBT={() => setActiveTab('bbt')}
          />
        )}

        {activeTab === 'articles' && (
          <EducationalSection currentPhase={cycleMetrics.phase} />
        )}

        {activeTab === 'history' && (
          <CycleHistory
            logs={logs}
            settings={settings}
            onSelectCycleForBBT={() => setActiveTab('bbt')}
            onOpenLogModal={handleOpenLogModal}
          />
        )}

        {/* Local-First Secure Database Banner */}
        <div className="mt-10 mb-4 p-3.5 bg-white/70 backdrop-blur-xs rounded-xl border border-rose-100/70 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Base de datos 100% local en tu dispositivo</span>
          </div>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span>Tus datos íntimos nunca se suben a servidores externos ni requieren conexión</span>
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-lg">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
          <button
            onClick={() => setActiveTab('today')}
            className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
              activeTab === 'today' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Hoy</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
              activeTab === 'calendar' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Calendario</span>
          </button>

          <button
            onClick={() => setActiveTab('bbt')}
            className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
              activeTab === 'bbt' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Thermometer className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Gráfica</span>
          </button>

          <button
            onClick={() => setActiveTab('fertility')}
            className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
              activeTab === 'fertility' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Fertilidad</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
              activeTab === 'articles' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Consejos</span>
          </button>
        </div>
      </nav>

      {/* Floating Action Button for Mobile Quick Log */}
      <button
        onClick={() => handleOpenLogModal()}
        aria-label="Registrar síntomas o temperatura"
        className="md:hidden fixed bottom-20 right-4 z-40 w-12 h-12 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Daily Log Modal */}
      <DailyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        initialDate={logModalDate}
        existingLogs={logs}
        settings={settings}
        onSaveLog={handleSaveLog}
        onDeleteLog={handleDeleteLog}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onDataReload={handleDataReload}
      />

      {/* Reminders Modal */}
      <RemindersModal
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
