/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  Sparkles,
  Calendar as CalendarIcon,
  Plus,
  Zap,
  Smile
} from 'lucide-react';
import { DailyLog, UserSettings } from '../types/cycle';
import {
  getDayPrediction,
  formatSpanishDate,
  formatDateISO,
  parseDateISO,
  SPANISH_FLOW_LABELS,
  SPANISH_SYMPTOM_LABELS,
  SPANISH_PROTECTION_LABELS,
  SPANISH_MUCUS_LABELS,
  SPANISH_MOOD_LABELS,
  SPANISH_ENERGY_LABELS,
  SPANISH_PHASE_INFO,
  celsiusToFahrenheit
} from '../utils/cycleCalculations';

interface CalendarViewProps {
  logs: DailyLog[];
  settings: UserSettings;
  onOpenLogModal: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  settings,
  onOpenLogModal,
}) => {
  const todayISO = formatDateISO(new Date());
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentMonthDate(new Date());
    setSelectedDate(todayISO);
  };

  // Build calendar matrix
  // Month name
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week for 1st day (0=Sunday, 1=Monday in JS -> we want 0=Monday, 6=Sunday)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const totalDaysInMonth = lastDayOfMonth.getDate();

  // Selected date details
  const selectedLog = logs.find(l => l.date === selectedDate);
  const selectedPrediction = getDayPrediction(selectedDate, logs, settings);

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-4 sm:p-6">
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={handleGoToday}
              className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Ir a hoy
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              aria-label="Mes anterior"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Mes siguiente"
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-center mb-2">
          {daysOfWeek.map((day, idx) => (
            <div
              key={day}
              className={`text-xs font-semibold py-1.5 ${
                idx >= 5 ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: startDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 sm:h-20 bg-slate-50/40 rounded-xl" />
          ))}

          {/* Month Days */}
          {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = formatDateISO(new Date(year, month, dayNum));
            const log = logs.find(l => l.date === dateStr);
            const prediction = getDayPrediction(dateStr, logs, settings);

            const isToday = dateStr === todayISO;
            const isSelected = dateStr === selectedDate;

            // Background styles depending on biological status
            let bgClass = 'bg-white hover:bg-rose-50/50 text-slate-800';
            let borderClass = 'border-slate-100';

            if (prediction.isPeriod) {
              // Active period logged
              bgClass = 'bg-rose-500 text-white hover:bg-rose-600';
              borderClass = 'border-rose-600';
            } else if (prediction.isPredictedPeriod) {
              // Future predicted period
              bgClass = 'bg-rose-50 text-rose-800 hover:bg-rose-100 border-dashed border-rose-300';
              borderClass = 'border-rose-300';
            } else if (prediction.isOvulation) {
              // Ovulation day
              bgClass = 'bg-emerald-600 text-white hover:bg-emerald-700';
              borderClass = 'border-emerald-600';
            } else if (prediction.isFertile) {
              // Fertile window
              bgClass = 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100';
              borderClass = 'border-emerald-200';
            }

            // Ring for selected day
            const ringClass = isSelected ? 'ring-2 ring-rose-500 ring-offset-2' : '';

            // Sex indicator
            const hadSex = log?.sex?.hadSex;
            const isProtected = hadSex && log?.sex?.protection?.some(p => p !== 'none');

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-16 sm:h-20 p-1 sm:p-1.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative text-left ${bgClass} ${borderClass} ${ringClass}`}
              >
                {/* Top row: day number & today dot */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      prediction.isPeriod || prediction.isOvulation
                        ? 'text-white'
                        : isToday
                        ? 'text-rose-600 font-bold'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isToday && (
                    <span
                      title="Hoy"
                      className={`w-1.5 h-1.5 rounded-full ${
                        prediction.isPeriod || prediction.isOvulation ? 'bg-white' : 'bg-rose-500'
                      }`}
                    />
                  )}
                </div>

                {/* Middle: Ovulation / Fertility / Period micro-label */}
                <div className="min-h-[14px]">
                  {prediction.isOvulation ? (
                    <span className="text-[9px] sm:text-[10px] font-bold block truncate tracking-tight text-white/90">
                      Ovulación
                    </span>
                  ) : prediction.isPredictedPeriod ? (
                    <span className="text-[9px] sm:text-[10px] font-medium block truncate text-rose-600">
                      Regla prev.
                    </span>
                  ) : prediction.isFertile ? (
                    <span className="text-[9px] sm:text-[10px] font-medium block truncate text-emerald-700">
                      Fértil
                    </span>
                  ) : log?.bbt ? (
                    <span className="text-[9px] sm:text-[10px] tabular-nums block font-mono opacity-80">
                      {settings.tempUnit === 'F' ? celsiusToFahrenheit(log.bbt) : log.bbt.toFixed(1)}°
                    </span>
                  ) : null}
                </div>

                {/* Bottom row: indicators (Sex heart, Symptoms dot) */}
                <div className="flex items-center gap-1 justify-end min-h-[12px]">
                  {/* Sex icon */}
                  {hadSex && !settings.discreteMode && (
                    <span
                      title={isProtected ? 'Relaciones con protección' : 'Relaciones sin protección'}
                      className="inline-flex items-center"
                    >
                      <Heart
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                          prediction.isPeriod || prediction.isOvulation
                            ? 'text-white fill-white'
                            : isProtected
                            ? 'text-rose-500 fill-rose-500'
                            : 'text-amber-500 fill-amber-500'
                        }`}
                      />
                    </span>
                  )}

                  {/* Symptoms dot */}
                  {log?.symptoms && Object.keys(log.symptoms).length > 0 && !settings.discreteMode && (
                    <span
                      title="Síntomas registrados"
                      className={`w-1.5 h-1.5 rounded-full ${
                        prediction.isPeriod || prediction.isOvulation ? 'bg-white/80' : 'bg-amber-400'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Regla registrada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-dashed border-rose-400" />
            <span>Regla esperada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300" />
            <span>Ventana fértil</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Día de ovulación</span>
          </div>
          {!settings.discreteMode && (
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Relaciones sexuales</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Day Inspection & Action Card */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {formatSpanishDate(selectedDate, { showDayOfWeek: true, showYear: true })}
              </h3>
              {selectedDate === todayISO && (
                <span className="text-xs bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">
                  Hoy
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedPrediction.cycleDay
                ? `Día ${selectedPrediction.cycleDay} del ciclo · ${SPANISH_PHASE_INFO[selectedPrediction.phase].name}`
                : SPANISH_PHASE_INFO[selectedPrediction.phase].name}
            </p>
          </div>

          <button
            onClick={() => onOpenLogModal(selectedDate)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{selectedLog ? 'Editar este día' : 'Registrar en este día'}</span>
          </button>
        </div>

        {/* Selected Day Content */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Cycle & Fertility */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Estado del ciclo
            </span>
            <div className="text-sm font-medium text-slate-800">
              {selectedPrediction.isPeriod ? (
                <span className="text-rose-600 font-semibold">🩸 Menstruación activa</span>
              ) : selectedPrediction.isPredictedPeriod ? (
                <span className="text-rose-600">📅 Predicción de menstruación</span>
              ) : selectedPrediction.isOvulation ? (
                <span className="text-emerald-700 font-semibold">🌟 Día estimado de ovulación</span>
              ) : selectedPrediction.isFertile ? (
                <span className="text-emerald-700">🌱 Ventana fértil</span>
              ) : (
                <span>Fase ordinaria ({SPANISH_PHASE_INFO[selectedPrediction.phase].name})</span>
              )}
            </div>

            <div className="pt-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Probabilidad de embarazo: </span>
              {selectedPrediction.fertilityLevel === 'peak'
                ? 'Máxima (Pico ovulatorio)'
                : selectedPrediction.fertilityLevel === 'high'
                ? 'Alta'
                : selectedPrediction.fertilityLevel === 'medium'
                ? 'Media'
                : 'Baja'}
            </div>
          </div>

          {/* Column 2: Basal Temp & Mucus */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Temperatura & Flujo
            </span>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-bold text-slate-800 tabular-nums">
                {selectedLog?.bbt
                  ? settings.tempUnit === 'F'
                    ? `${celsiusToFahrenheit(selectedLog.bbt)} °F`
                    : `${selectedLog.bbt.toFixed(2)} °C`
                  : 'Sin temperatura'}
              </span>
              {selectedLog?.bbtTime && (
                <span className="text-xs text-slate-400 font-mono">({selectedLog.bbtTime})</span>
              )}
            </div>

            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Moco cervical: </span>
              {selectedLog?.mucus ? SPANISH_MUCUS_LABELS[selectedLog.mucus].label : 'No registrado'}
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Sangrado: </span>
              {selectedLog?.flow ? SPANISH_FLOW_LABELS[selectedLog.flow].label : 'Ninguno'}
            </div>
            {selectedLog?.energy && (
              <div className="text-xs text-slate-600 flex items-center gap-1 pt-0.5">
                <span className="font-semibold text-slate-700">Energía: </span>
                <span className="font-bold text-slate-800">
                  {SPANISH_ENERGY_LABELS[selectedLog.energy]?.icon} {SPANISH_ENERGY_LABELS[selectedLog.energy]?.label}
                </span>
              </div>
            )}
          </div>

          {/* Column 3: Sex & Protection */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Relaciones & Protección
            </span>
            {settings.discreteMode ? (
              <p className="text-xs text-slate-400 italic">
                Información íntima oculta por el Modo Discreto
              </p>
            ) : selectedLog?.sex?.hadSex ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Relaciones sexuales registradas</span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Protección: </span>
                  {selectedLog.sex.protection?.length > 0
                    ? selectedLog.sex.protection
                        .map(p => SPANISH_PROTECTION_LABELS[p]?.label || p)
                        .join(', ')
                    : 'Sin especificar'}
                </div>
                {selectedLog.sex.orgasm !== undefined && (
                  <div className="text-xs text-slate-500">
                    Orgasmo: {selectedLog.sex.orgasm ? 'Sí' : 'No'}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No se registraron relaciones sexuales en este día.
              </p>
            )}
          </div>
        </div>

        {/* Symptoms and Moods */}
        {!settings.discreteMode && selectedLog && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            {/* Symptoms list */}
            {selectedLog.symptoms && Object.keys(selectedLog.symptoms).length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Síntomas físicos registrados:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedLog.symptoms).map(([type, sev]) => {
                    const info = SPANISH_SYMPTOM_LABELS[type as keyof typeof SPANISH_SYMPTOM_LABELS];
                    return (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-lg font-medium"
                      >
                        <span>{info?.icon || '•'}</span>
                        <span>{info?.name || type}</span>
                        <span className="text-[10px] text-rose-600 font-normal">
                          ({sev === 'mild' ? 'Leve' : sev === 'moderate' ? 'Moderado' : 'Fuerte'})
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Moods */}
            {selectedLog.moods && selectedLog.moods.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Estado emocional:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLog.moods.map(m => {
                    const moodInfo = SPANISH_MOOD_LABELS[m];
                    return (
                      <span
                        key={m}
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
                      >
                        <span>{moodInfo?.emoji}</span>
                        <span>{moodInfo?.label || m}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedLog.notes && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-slate-700">
                <span className="font-semibold text-amber-900 block mb-0.5">Notas del día:</span>
                <p className="italic">{selectedLog.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
