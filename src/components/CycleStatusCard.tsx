/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Thermometer,
  Heart,
  Sparkles,
  ChevronRight,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Activity,
  Zap,
  Smile,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { DailyLog, UserSettings, CyclePhase } from '../types/cycle';
import {
  getCurrentCycleMetrics,
  formatSpanishDate,
  SPANISH_PHASE_INFO,
  SPANISH_SYMPTOM_LABELS,
  SPANISH_PROTECTION_LABELS,
  SPANISH_FLOW_LABELS,
  SPANISH_MUCUS_LABELS,
  SPANISH_MOOD_LABELS,
  SPANISH_ENERGY_LABELS,
  celsiusToFahrenheit
} from '../utils/cycleCalculations';

interface CycleStatusCardProps {
  logs: DailyLog[];
  settings: UserSettings;
  todayLog?: DailyLog;
  onOpenLogModal: (date?: string) => void;
  onViewBBT: () => void;
  onViewFertility: () => void;
  onClearAllLogs?: () => void;
  onRestoreDemo?: () => void;
  isDemoActive?: boolean;
}

export const CycleStatusCard: React.FC<CycleStatusCardProps> = ({
  logs,
  settings,
  todayLog,
  onOpenLogModal,
  onViewBBT,
  onViewFertility,
  onClearAllLogs,
  onRestoreDemo,
  isDemoActive,
}) => {
  const metrics = getCurrentCycleMetrics(logs, settings);
  const phaseInfo = SPANISH_PHASE_INFO[metrics.phase];

  // Calculate circular progress percentage (0 - 100)
  const currentDay = metrics.cycleDay;
  const totalDays = metrics.effectiveCycleLength;
  const progressPct = Math.min(100, Math.round((currentDay / totalDays) * 100));

  // Circumference for r=70: 2 * PI * 70 ≈ 439.8
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPct) / 100;

  // Format today's temperature
  const tempDisplay = todayLog?.bbt
    ? settings.tempUnit === 'F'
      ? `${celsiusToFahrenheit(todayLog.bbt)}°F`
      : `${todayLog.bbt.toFixed(2)}°C`
    : null;

  return (
    <div className="space-y-6">
      {/* Demo Data Banner if active */}
      {isDemoActive && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 bg-amber-200/70 text-amber-800 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-900 block">
                Visualizando datos de demostración
              </span>
              <span className="text-amber-800/80">
                Estos datos son de prueba para ilustrar las gráficas y fases. Puedes borrarlos en cualquier momento para registrar tu propio ciclo.
              </span>
            </div>
          </div>
          {onClearAllLogs && (
            <button
              onClick={onClearAllLogs}
              className="w-full sm:w-auto px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar datos de prueba</span>
            </button>
          )}
        </div>
      )}

      {/* When no cycle has been recorded yet (empty state) */}
      {!metrics.hasRecordedCycles ? (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6 md:p-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              ¡Comienza a registrar tu ciclo!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Actualmente tu aplicación está completamente limpia y privada. Para que FeminaCycle pueda calcular la duración de tu ciclo, predecir con exactitud el día de tu próxima regla y avisarte de tus días más fértiles, anota cuándo comenzó tu última menstruación.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenLogModal()}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar primer día de regla</span>
            </button>
            {onRestoreDemo && (
              <button
                onClick={onRestoreDemo}
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Cargar datos de prueba</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Hero Card: Cycle Gauge & Main Status */
        <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Circular Phase Gauge */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Background circle track */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-rose-50"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-rose-500 transition-all duration-700 ease-out"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Central Information */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-rose-500">
                    Ciclo actual
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight my-0.5">
                    Día {metrics.cycleDay}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    de {metrics.effectiveCycleLength} días
                  </span>
                </div>
              </div>

              {/* Current Phase Tag */}
              <div className="mt-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${phaseInfo.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {phaseInfo.name}
                </span>
              </div>
            </div>

          {/* Key Cycle Metrics & Predictive Alerts */}
          <div className="md:col-span-7 space-y-4">
            {/* Countdown Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50/50 border border-rose-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500 text-white rounded-lg shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                    {metrics.statusHeadline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {metrics.statusDetail}
                  </p>
                </div>
              </div>
            </div>

            {/* 2-Column Grid: Fertility & Temperature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Fertility Card */}
              <button
                onClick={onViewFertility}
                className="text-left p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium">Fertilidad de hoy</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    metrics.fertilityToday === 'peak'
                      ? 'bg-emerald-500 animate-pulse'
                      : metrics.fertilityToday === 'high'
                      ? 'bg-emerald-400'
                      : metrics.fertilityToday === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-slate-300'
                  }`} />
                  <span className="text-sm font-semibold text-slate-800">
                    {metrics.fertilityToday === 'peak'
                      ? 'Pico Máximo (Ovulación)'
                      : metrics.fertilityToday === 'high'
                      ? 'Alta Fertilidad'
                      : metrics.fertilityToday === 'medium'
                      ? 'Fertilidad Media'
                      : 'Baja probabilidad'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {metrics.fertilityToday === 'peak' || metrics.fertilityToday === 'high'
                    ? 'Día clave para concebir o protegerse'
                    : 'Fase de baja probabilidad de concepción'}
                </p>
              </button>

              {/* Temperature Card */}
              <button
                onClick={onViewBBT}
                className="text-left p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-rose-50/40 hover:border-rose-200 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium">Temperatura Basal</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-semibold text-slate-800 tabular-nums">
                    {tempDisplay || 'Sin registrar hoy'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {todayLog?.bbt ? 'Registrada a las ' + (todayLog.bbtTime || '07:30') : 'Tómatela al despertar antes de levantarte'}
                </p>
              </button>
            </div>

            {/* Biological Insight Tip */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100/80 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900/90 leading-relaxed">
                <span className="font-semibold">{phaseInfo.desc} </span>
                <span>{phaseInfo.tip}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Today's Logged Summary / Action Section */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Registro del día de hoy
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatSpanishDate(new Date().toISOString().split('T')[0], { showDayOfWeek: true, showYear: true })}
            </p>
          </div>
          <button
            onClick={() => onOpenLogModal()}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {todayLog ? 'Editar registro' : '+ Completar día'}
          </button>
        </div>

        {/* Symptoms, Flow & Sexual Activity Pills/Details */}
        <div className="pt-4 space-y-4">
          {todayLog ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Flow */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Sangrado menstrual
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {SPANISH_FLOW_LABELS[todayLog.flow || 'none'].label}
                </span>
              </div>

              {/* Energy Level */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Nivel de energía
                </span>
                {todayLog.energy ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{SPANISH_ENERGY_LABELS[todayLog.energy].icon}</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {SPANISH_ENERGY_LABELS[todayLog.energy].label}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400">No registrada</span>
                )}
              </div>

              {/* Moods */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Estado de ánimo
                </span>
                {todayLog.moods && todayLog.moods.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {todayLog.moods.map(m => (
                      <span
                        key={m}
                        className="text-[11px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-800 flex items-center gap-1"
                      >
                        <span>{SPANISH_MOOD_LABELS[m]?.emoji}</span>
                        <span>{SPANISH_MOOD_LABELS[m]?.label || m}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400">No registrado</span>
                )}
              </div>

              {/* Mucus */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Moco cervical
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {todayLog.mucus ? SPANISH_MUCUS_LABELS[todayLog.mucus].label : 'No registrado'}
                </span>
              </div>

              {/* Sex & Protection (Masked if discreteMode is active) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Relaciones sexuales
                </span>
                {settings.discreteMode ? (
                  <span className="text-xs font-medium text-slate-400 italic">
                    [Oculto por modo discreto]
                  </span>
                ) : todayLog.sex?.hadSex ? (
                  <div>
                    <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      Sí tuvo relaciones
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {todayLog.sex.protection?.length > 0
                        ? todayLog.sex.protection.map(p => SPANISH_PROTECTION_LABELS[p]?.badge || p).join(', ')
                        : 'Sin método registrado'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-600">
                    No registradas
                  </span>
                )}
              </div>

              {/* Symptoms count */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Síntomas físicos
                </span>
                {settings.discreteMode ? (
                  <span className="text-xs font-medium text-slate-400 italic">
                    [Oculto por modo discreto]
                  </span>
                ) : todayLog.symptoms && Object.keys(todayLog.symptoms).length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {Object.entries(todayLog.symptoms).map(([k, sev]) => (
                      <span
                        key={k}
                        className="text-[11px] font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200"
                      >
                        {SPANISH_SYMPTOM_LABELS[k as keyof typeof SPANISH_SYMPTOM_LABELS]?.name || k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-500">
                    Sin molestias registradas
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-rose-50/30 rounded-xl border border-dashed border-rose-200">
              <Sparkles className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">
                Aún no has registrado tus síntomas o temperatura de hoy
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Registra tu temperatura basal nada más despertar y anota si sientes cólicos, cambios de humor o actividad sexual.
              </p>
              <button
                onClick={() => onOpenLogModal()}
                className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Registrar datos de hoy
              </button>
            </div>
          )}

          {/* Notes if available */}
          {todayLog?.notes && !settings.discreteMode && (
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-slate-700">
              <span className="font-semibold text-amber-900 block mb-0.5">Notas personales:</span>
              <p className="italic text-slate-600">"{todayLog.notes}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
