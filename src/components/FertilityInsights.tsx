/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Calendar,
  AlertCircle,
  HelpCircle,
  Shield,
  Heart,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { DailyLog, UserSettings } from '../types/cycle';
import {
  getCurrentCycleMetrics,
  formatSpanishDate,
  addDays,
  SPANISH_PROTECTION_LABELS
} from '../utils/cycleCalculations';

interface FertilityInsightsProps {
  logs: DailyLog[];
  settings: UserSettings;
  onOpenLogModal: (date?: string) => void;
  onViewBBT: () => void;
}

export const FertilityInsights: React.FC<FertilityInsightsProps> = ({
  logs,
  settings,
  onOpenLogModal,
  onViewBBT,
}) => {
  const metrics = getCurrentCycleMetrics(logs, settings);

  if (!metrics.hasRecordedCycles) {
    return (
      <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center max-w-lg mx-auto space-y-4 my-8 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-serif font-bold text-slate-900">
            Aún no hay ciclos para predecir fertilidad
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Para identificar tus días fértiles con precisión y la fecha estimada de tu próxima regla, anota cuándo comenzó tu última regla.
          </p>
        </div>
        <button
          onClick={() => onOpenLogModal()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Registrar regla ahora
        </button>
      </div>
    );
  }

  const {
    lastCycleStart,
    effectiveCycleLength,
    estimatedOvulationDate,
    fertileStart,
    fertileEnd,
    nextPeriodDate,
    daysUntilNextPeriod
  } = metrics;

  // Next month's forecasted dates
  const nextMonthStart = nextPeriodDate;
  const nextMonthOvulation = addDays(nextMonthStart, effectiveCycleLength - settings.lutealPhaseLength);
  const nextMonthFertileStart = addDays(nextMonthOvulation, -5);
  const nextMonthFertileEnd = addDays(nextMonthOvulation, 1);
  const monthAfterPeriod = addDays(nextMonthStart, effectiveCycleLength);

  // Check intercourse recorded in this cycle's fertile window
  const fertileIntercourse = logs.filter(
    l => l.date >= fertileStart && l.date <= fertileEnd && l.sex?.hadSex
  );

  return (
    <div className="space-y-6">
      {/* Hero Overview Card */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700">
            Predicción Biológica
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
          Días Más Fértiles y Pronóstico de la Regla
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Calculado en base a tu duración media de <span className="font-semibold text-slate-800">{effectiveCycleLength} días</span> y una fase lútea de <span className="font-semibold text-slate-800">{settings.lutealPhaseLength} días</span>. Los espermatozoides pueden sobrevivir hasta 5 días en moco cervical fértil, mientras que el óvulo tiene una vida útil de 12 a 24 horas.
        </p>

        {/* 2-Column Forecast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Current Cycle Forecast */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Ciclo Actual
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Inicio: {formatSpanishDate(lastCycleStart)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white/90 rounded-xl border border-emerald-200/60 shadow-2xs">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide block">
                  🌟 Día de Ovulación Estimado
                </span>
                <span className="text-base font-bold text-slate-900 font-serif">
                  {formatSpanishDate(estimatedOvulationDate, { showDayOfWeek: true })}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Día de máxima probabilidad de concepción
                </p>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-emerald-200/60 shadow-2xs">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide block">
                  🌱 Ventana Fértil Completa (6 días)
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Del {formatSpanishDate(fertileStart)} al {formatSpanishDate(fertileEnd)}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  5 días previos a la ovulación + 24h posteriores
                </p>
              </div>

              <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200/60 shadow-2xs">
                <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide block">
                  🩸 Próxima Regla Esperada
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatSpanishDate(nextPeriodDate, { showDayOfWeek: true })}
                </span>
                <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                  {daysUntilNextPeriod > 0
                    ? `Faltan ${daysUntilNextPeriod} días para que baje la regla`
                    : daysUntilNextPeriod === 0
                    ? 'Prevista para el día de hoy'
                    : `Retraso de ${Math.abs(daysUntilNextPeriod)} días`}
                </p>
              </div>
            </div>
          </div>

          {/* Next Month Forecast */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Siguiente Ciclo (Proyección)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Inicio est.: {formatSpanishDate(nextMonthStart)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide block">
                  Ovulación proyectada
                </span>
                <span className="text-base font-bold text-slate-900 font-serif">
                  {formatSpanishDate(nextMonthOvulation, { showDayOfWeek: true })}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Basado en tu ritmo cíclico habitual
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide block">
                  Ventana fértil del próximo mes
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Del {formatSpanishDate(nextMonthFertileStart)} al {formatSpanishDate(nextMonthFertileEnd)}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide block">
                  Regla subsiguiente
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {formatSpanishDate(monthAfterPeriod, { showDayOfWeek: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sexual Activity in Fertile Window Breakdown */}
      {!settings.discreteMode && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Relaciones Registradas en Días Fértiles
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Seguimiento de la protección en tus días de mayor probabilidad
              </p>
            </div>
          </div>

          <div className="pt-4">
            {fertileIntercourse.length > 0 ? (
              <div className="space-y-2.5">
                {fertileIntercourse.map(item => (
                  <div
                    key={item.date}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <div>
                        <span className="font-bold text-slate-800">
                          {formatSpanishDate(item.date, { showDayOfWeek: true })}
                        </span>
                        <span className="text-slate-500 ml-2">
                          (Ventana fértil)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Protección:</span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-medium text-slate-800">
                        {item.sex?.protection && item.sex.protection.length > 0
                          ? item.sex.protection
                              .map(p => SPANISH_PROTECTION_LABELS[p]?.badge || p)
                              .join(', ')
                          : 'No especificada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">
                No se han registrado relaciones sexuales durante los días fértiles del ciclo actual.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sympto-Thermal Method Deep Dive */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-serif font-bold text-slate-900">
          ¿Por qué combinar Temperatura Basal y Moco Cervical?
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          El método sintotérmico combina dos biomarcadores complementarios para determinar con precisión científica cuándo se abren y se cierran tus días fértiles:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
            <span className="text-xs font-bold text-emerald-900 block">
              1. El Moco Cervical avisa que la ventana se abre
            </span>
            <p className="text-xs text-emerald-950/80 leading-relaxed">
              Días antes de que el óvulo se libere, los estrógenos hacen que el moco cervical se vuelva elástico, resbaladizo y transparente (como clara de huevo cruda). Este moco nutre y transporta a los espermatozoides, abriendo la ventana fértil.
            </p>
          </div>

          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
            <span className="text-xs font-bold text-rose-900 block">
              2. La Temperatura Basal confirma que la ovulación ya ocurrió
            </span>
            <p className="text-xs text-rose-950/80 leading-relaxed">
              Inmediatamente después de que el óvulo se libera, la progesterona calienta el cuerpo (~0.2°C - 0.5°C). Cuando se observan 3 días seguidos por encima de la línea base, la ventana fértil ha quedado definitivamente cerrada.
            </p>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onViewBBT}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
          >
            Ver mi gráfica de temperatura y línea base →
          </button>
        </div>
      </div>
    </div>
  );
};
