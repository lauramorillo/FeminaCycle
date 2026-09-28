/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
  Heart,
  Droplet
} from 'lucide-react';
import { DailyLog, UserSettings, CycleSummary } from '../types/cycle';
import {
  calculateCycleHistory,
  formatSpanishDate,
  diffDays
} from '../utils/cycleCalculations';

interface CycleHistoryProps {
  logs: DailyLog[];
  settings: UserSettings;
  onSelectCycleForBBT: (cycleIdx: number) => void;
  onOpenLogModal: (date?: string) => void;
}

export const CycleHistory: React.FC<CycleHistoryProps> = ({
  logs,
  settings,
  onSelectCycleForBBT,
  onOpenLogModal,
}) => {
  const cycles = calculateCycleHistory(logs, settings);

  // Completed cycles
  const completed = cycles.filter(c => !c.isCurrent);
  const avgCycleLength = completed.length > 0
    ? Math.round(completed.reduce((acc, c) => acc + c.lengthDays, 0) / completed.length)
    : settings.averageCycleLength;

  const avgPeriodLength = completed.length > 0
    ? Math.round(completed.reduce((acc, c) => acc + c.periodDays, 0) / completed.length)
    : settings.averagePeriodLength;

  // Variation in completed cycles
  let variationDays = 0;
  if (completed.length >= 2) {
    const lengths = completed.map(c => c.lengthDays);
    variationDays = Math.max(...lengths) - Math.min(...lengths);
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 mb-1">
          Estadísticas e Historial de Ciclos
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Patrones de duración, sangrado y regularidad basados en tus registros reales
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">
              Duración media del ciclo
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold font-serif text-slate-900 tabular-nums">
                {avgCycleLength}
              </span>
              <span className="text-xs font-semibold text-slate-500">días</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {completed.length > 0 ? `Calculado con ${completed.length} ciclos anteriores` : 'Valor inicial configurado'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">
              Duración media de la regla
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold font-serif text-rose-600 tabular-nums">
                {avgPeriodLength}
              </span>
              <span className="text-xs font-semibold text-slate-500">días</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Días de sangrado activo por ciclo
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">
              Regularidad del ciclo
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {variationDays <= 2 ? 'Muy regular' : variationDays <= 5 ? 'Regular' : 'Variable'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Variación de ±{variationDays} días entre ciclos
            </span>
          </div>
        </div>
      </div>

      {/* Cycles Timeline List */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6">
        <h3 className="text-base font-serif font-bold text-slate-900 pb-3 border-b border-slate-100">
          Línea de Tiempo de Ciclos
        </h3>

        <div className="pt-4 space-y-4">
          {cycles.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <Calendar className="w-8 h-8 mx-auto text-rose-300 mb-2" />
              <p className="font-semibold text-slate-700">No hay ciclos registrados todavía</p>
              <p className="text-slate-400 mt-0.5">Anota tus días de regla para ir construyendo tu historial y estadísticas.</p>
              <button
                onClick={() => onOpenLogModal()}
                className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Registrar regla
              </button>
            </div>
          ) : (
            cycles.slice().reverse().map((cycle, reverseIdx) => {
            const originalIdx = cycles.length - 1 - reverseIdx;
            return (
              <div
                key={cycle.startDate}
                className={`p-4 rounded-xl border transition-all ${
                  cycle.isCurrent
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 font-serif">
                        {cycle.isCurrent ? 'Ciclo Actual' : `Ciclo ${cycle.cycleNumber}`}
                      </span>
                      {cycle.isCurrent && (
                        <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                          En curso
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {formatSpanishDate(cycle.startDate)}
                      {cycle.endDate ? ` — ${formatSpanishDate(cycle.endDate)}` : ' (hasta hoy)'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Duración
                      </span>
                      <span className="font-bold text-slate-800">
                        {cycle.lengthDays} días
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Regla
                      </span>
                      <span className="font-bold text-rose-600">
                        {cycle.periodDays} días
                      </span>
                    </div>

                    {cycle.ovulationDate && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Ovulación
                        </span>
                        <span className="font-bold text-emerald-700">
                          {formatSpanishDate(cycle.ovulationDate)}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => onSelectCycleForBBT(originalIdx)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-900 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver gráfica</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};
