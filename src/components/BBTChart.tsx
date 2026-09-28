/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import {
  TrendingUp,
  Info,
  Calendar,
  Thermometer,
  Sparkles,
  HelpCircle,
  Heart,
  ChevronDown,
  Zap,
  Smile,
  Activity,
  Layers
} from 'lucide-react';
import { DailyLog, UserSettings, EnergyLevel, MoodType, SymptomType } from '../types/cycle';
import {
  calculateCycleHistory,
  calculateBBTMetrics,
  formatSpanishDate,
  celsiusToFahrenheit,
  SPANISH_MUCUS_LABELS,
  SPANISH_PROTECTION_LABELS,
  SPANISH_SYMPTOM_LABELS,
  SPANISH_MOOD_LABELS,
  SPANISH_ENERGY_LABELS,
  SPANISH_FLOW_LABELS,
  diffDays,
  addDays
} from '../utils/cycleCalculations';

interface BBTChartProps {
  logs: DailyLog[];
  settings: UserSettings;
  onOpenLogModal: (date?: string) => void;
}

export const BBTChart: React.FC<BBTChartProps> = ({
  logs,
  settings,
  onOpenLogModal,
}) => {
  const chartId = useId();
  const cycles = calculateCycleHistory(logs, settings);

  // Default to the current cycle (last one in list)
  const [selectedCycleIndex, setSelectedCycleIndex] = useState<number>(
    cycles.length > 0 ? cycles.length - 1 : 0
  );

  // Layer Visibility Toggles
  const [showEnergyTrack, setShowEnergyTrack] = useState(true);
  const [showMoodTrack, setShowMoodTrack] = useState(true);
  const [showSymptomsTrack, setShowSymptomsTrack] = useState(true);

  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    dayNum: number;
    bbt?: number;
    bbtTime?: string;
    mucus?: string;
    energy?: EnergyLevel;
    moods?: MoodType[];
    hadSex?: boolean;
    protection?: string[];
    symptoms?: Partial<Record<SymptomType, string>>;
    x: number;
    y: number;
  } | null>(null);

  const selectedCycle = cycles[selectedCycleIndex];

  if (!selectedCycle) {
    return (
      <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center">
        <Thermometer className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-serif font-bold text-slate-900">
          Aún no hay suficientes datos de temperatura
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Registra tu temperatura basal durante varios días para que el sistema trace la curva térmica y detecte tu patrón de ovulación.
        </p>
        <button
          onClick={() => onOpenLogModal()}
          className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          Registrar temperatura hoy
        </button>
      </div>
    );
  }

  // Filter logs for selected cycle
  const cycleLogs = logs
    .filter(l => l.date >= selectedCycle.startDate && (!selectedCycle.endDate || l.date <= selectedCycle.endDate))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Compute BBT metrics (coverline, thermal shift)
  const bbtMetrics = calculateBBTMetrics(logs, selectedCycle.startDate, selectedCycle.endDate);

  // SVG Chart Geometry
  const svgWidth = 860;
  const svgHeight = 360;
  const paddingLeft = 55;
  const paddingRight = 40;
  const paddingTop = 36;
  const paddingBottom = 50;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Max days to show on x-axis
  const totalDays = Math.max(selectedCycle.lengthDays, 28);
  const minTemp = bbtMetrics.minTemp;
  const maxTemp = bbtMetrics.maxTemp;
  const tempRange = Math.max(maxTemp - minTemp, 0.8);

  const getX = (dayIndex: number) => paddingLeft + (dayIndex / (totalDays - 1)) * chartWidth;
  const getY = (temp: number) => paddingTop + chartHeight - ((temp - minTemp) / tempRange) * chartHeight;

  // Map temperatures and full daily details
  const pointsWithData: Array<{
    dayNum: number;
    date: string;
    bbt?: number;
    bbtTime?: string;
    mucus?: string;
    energy?: EnergyLevel;
    moods?: MoodType[];
    hadSex?: boolean;
    protection?: string[];
    symptoms?: Partial<Record<SymptomType, string>>;
    x: number;
    y: number;
  }> = [];

  for (let d = 0; d < totalDays; d++) {
    const curDate = addDays(selectedCycle.startDate, d);
    const log = cycleLogs.find(l => l.date === curDate);
    if (log && typeof log.bbt === 'number' && log.bbt > 35 && log.bbt < 38.5) {
      pointsWithData.push({
        dayNum: d + 1,
        date: curDate,
        bbt: log.bbt,
        bbtTime: log.bbtTime,
        mucus: log.mucus ? SPANISH_MUCUS_LABELS[log.mucus]?.label : undefined,
        energy: log.energy,
        moods: log.moods,
        hadSex: log.sex?.hadSex,
        protection: log.sex?.protection,
        symptoms: log.symptoms,
        x: getX(d),
        y: getY(log.bbt),
      });
    }
  }

  // Generate SVG polyline path string
  const polylinePoints = pointsWithData.map(p => `${p.x},${p.y}`).join(' ');

  // Y-axis ticks
  const yTicks: number[] = [];
  const startTick = Math.ceil(minTemp * 10) / 10;
  for (let t = startTick; t <= maxTemp; t = Number((t + 0.2).toFixed(1))) {
    yTicks.push(t);
  }

  // Pre vs post shift temps
  const preShiftTemps = bbtMetrics.shiftDate
    ? pointsWithData.filter(p => p.date < bbtMetrics.shiftDate!)
    : pointsWithData.slice(0, Math.floor(pointsWithData.length / 2));
  const postShiftTemps = bbtMetrics.shiftDate
    ? pointsWithData.filter(p => p.date >= bbtMetrics.shiftDate!)
    : pointsWithData.slice(Math.floor(pointsWithData.length / 2));

  const avgPre = preShiftTemps.length > 0
    ? (preShiftTemps.reduce((acc, p) => acc + (p.bbt || 0), 0) / preShiftTemps.length).toFixed(2)
    : '--';
  const avgPost = postShiftTemps.length > 0
    ? (postShiftTemps.reduce((acc, p) => acc + (p.bbt || 0), 0) / postShiftTemps.length).toFixed(2)
    : '--';

  return (
    <div className="space-y-6">
      {/* Header & Cycle Switcher */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-rose-500" />
              <h2 className="text-xl font-serif font-bold text-slate-900">
                Gráfica Detallada y Correlación de Fases
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlaciona tu temperatura basal, niveles de energía, estados de ánimo y síntomas a lo largo del ciclo
            </p>
          </div>

          {/* Cycle Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Ciclo:</span>
            <div className="relative">
              <select
                value={selectedCycleIndex}
                onChange={e => setSelectedCycleIndex(Number(e.target.value))}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                {cycles.map((c, idx) => (
                  <option key={c.startDate} value={idx}>
                    {c.isCurrent ? `Ciclo Actual (Día ${c.lengthDays})` : `Ciclo ${c.cycleNumber} (${formatSpanishDate(c.startDate)})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Statistical KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block font-medium">Media fase folicular</span>
            <span className="text-base font-bold text-slate-800 font-mono tabular-nums">
              {avgPre} °C
            </span>
            <span className="text-[10px] text-slate-400 block">Pre-ovulación (Estrógenos)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block font-medium">Media fase lútea</span>
            <span className="text-base font-bold text-rose-600 font-mono tabular-nums">
              {avgPost} °C
            </span>
            <span className="text-[10px] text-slate-400 block">Post-ovulación (Progesterona)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block font-medium">Línea base (Coverline)</span>
            <span className="text-base font-bold text-indigo-600 font-mono tabular-nums">
              {bbtMetrics.coverline ? `${bbtMetrics.coverline} °C` : 'Calculando...'}
            </span>
            <span className="text-[10px] text-slate-400 block">Regla de 3 sobre 6</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block font-medium">Patrón bifásico</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${bbtMetrics.hasShift ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span className="text-xs font-bold text-slate-800">
                {bbtMetrics.hasShift ? 'Confirmado' : 'En progreso'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              {bbtMetrics.hasShift ? 'Salto térmico detectado' : 'Registra más días'}
            </span>
          </div>
        </div>

        {/* Layer Visibility Toggle Bar */}
        <div className="mt-5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Capas sincronizadas:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowEnergyTrack(!showEnergyTrack)}
              className={`px-2.5 py-1 rounded-lg border font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                showEnergyTrack
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <Zap className="w-3 h-3 text-emerald-600" />
              <span>Nivel de Energía</span>
            </button>

            <button
              onClick={() => setShowMoodTrack(!showMoodTrack)}
              className={`px-2.5 py-1 rounded-lg border font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                showMoodTrack
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <Smile className="w-3 h-3 text-amber-600" />
              <span>Estado de Ánimo</span>
            </button>

            <button
              onClick={() => setShowSymptomsTrack(!showSymptomsTrack)}
              className={`px-2.5 py-1 rounded-lg border font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                showSymptomsTrack
                  ? 'bg-rose-100 border-rose-300 text-rose-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <Activity className="w-3 h-3 text-rose-600" />
              <span>Síntomas Físicos</span>
            </button>
          </div>
        </div>

        {/* Main Temperature SVG Chart */}
        <div className="mt-4 w-full overflow-x-auto">
          <div className="min-w-[720px] relative select-none">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible"
            >
              <defs>
                <linearGradient id={`${chartId}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Phase Background Shading */}
              {/* Menstrual Phase (Days 1 - 5) */}
              <rect
                x={getX(0)}
                y={paddingTop}
                width={getX(Math.min(4, totalDays - 1)) - getX(0)}
                height={chartHeight}
                fill="#ffe4e6"
                opacity="0.35"
              />

              {/* Fertile Window Band (around estimated ovulation: day 10 - 15) */}
              {selectedCycle.ovulationDate && (
                <rect
                  x={getX(Math.max(0, 9))}
                  y={paddingTop}
                  width={getX(Math.min(15, totalDays - 1)) - getX(9)}
                  height={chartHeight}
                  fill="#d1fae5"
                  opacity="0.45"
                />
              )}

              {/* Post-ovulation Luteal Phase Band */}
              <rect
                x={getX(Math.min(15, totalDays - 1))}
                y={paddingTop}
                width={getX(totalDays - 1) - getX(Math.min(15, totalDays - 1))}
                height={chartHeight}
                fill="#e0e7ff"
                opacity="0.25"
              />

              {/* Y-Axis Horizontal Grid Lines & Labels */}
              {yTicks.map(t => {
                const y = getY(t);
                return (
                  <g key={`y-${t}`}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-mono tabular-nums"
                    >
                      {t.toFixed(1)}°
                    </text>
                  </g>
                );
              })}

              {/* Coverline (Línea Base) if calculated */}
              {bbtMetrics.coverline && (
                <g>
                  <line
                    x1={paddingLeft}
                    y1={getY(bbtMetrics.coverline)}
                    x2={svgWidth - paddingRight}
                    y2={getY(bbtMetrics.coverline)}
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={svgWidth - paddingRight + 5}
                    y={getY(bbtMetrics.coverline) + 3}
                    className="text-[9px] font-semibold fill-indigo-600 font-mono"
                  >
                    Línea base ({bbtMetrics.coverline}°)
                  </text>
                </g>
              )}

              {/* Polyline Path */}
              {polylinePoints && (
                <polyline
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                />
              )}

              {/* Data Points */}
              {pointsWithData.map(p => {
                const isHovered = hoveredPoint?.dayNum === p.dayNum;
                const isAboveCoverline = bbtMetrics.coverline && (p.bbt || 0) > bbtMetrics.coverline;

                return (
                  <g key={p.date}>
                    {/* Outer glow circle on hover */}
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="#e11d48"
                        opacity="0.2"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? '5' : '3.5'}
                      fill={isAboveCoverline ? '#e11d48' : '#fda4af'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onClick={() => setHoveredPoint(p)}
                    />
                  </g>
                );
              })}

              {/* X-Axis Cycle Days and Guides */}
              {Array.from({ length: totalDays }).map((_, d) => {
                const x = getX(d);
                const dayNum = d + 1;

                return (
                  <g key={`x-${d}`}>
                    <line
                      x1={x}
                      y1={paddingTop + chartHeight}
                      x2={x}
                      y2={paddingTop + chartHeight + 5}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />

                    {/* Cycle day number */}
                    <text
                      x={x}
                      y={paddingTop + chartHeight + 18}
                      textAnchor="middle"
                      className={`text-[10px] font-semibold ${
                        dayNum === 14 ? 'fill-emerald-600 font-bold' : 'fill-slate-500'
                      }`}
                    >
                      D{dayNum}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredPoint && (
              <div
                className="absolute z-20 bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 min-w-[200px]"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${hoveredPoint.y - 10}px`,
                }}
              >
                <div className="font-semibold text-rose-300 pb-1 border-b border-slate-700">
                  Día {hoveredPoint.dayNum} · {formatSpanishDate(hoveredPoint.date)}
                </div>
                <div className="pt-1.5 space-y-1">
                  {hoveredPoint.bbt && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temperatura:</span>
                      <span className="font-bold text-white tabular-nums font-mono">
                        {hoveredPoint.bbt.toFixed(2)} °C
                      </span>
                    </div>
                  )}

                  {hoveredPoint.energy && (
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Energía:</span>
                      <span className="text-emerald-300 font-semibold">
                        {SPANISH_ENERGY_LABELS[hoveredPoint.energy]?.icon} {SPANISH_ENERGY_LABELS[hoveredPoint.energy]?.label}
                      </span>
                    </div>
                  )}

                  {hoveredPoint.moods && hoveredPoint.moods.length > 0 && (
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Ánimo:</span>
                      <span className="text-amber-300">
                        {hoveredPoint.moods.map(m => SPANISH_MOOD_LABELS[m]?.label || m).join(', ')}
                      </span>
                    </div>
                  )}

                  {hoveredPoint.symptoms && Object.keys(hoveredPoint.symptoms).length > 0 && !settings.discreteMode && (
                    <div className="text-[11px] pt-0.5 border-t border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Síntomas:</span>
                      <span className="text-slate-200">
                        {Object.keys(hoveredPoint.symptoms).map(s => SPANISH_SYMPTOM_LABELS[s as SymptomType]?.name || s).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Synchronized Multi-Track Strip (Correlating Energy, Moods, Symptoms & Sex) */}
          <div className="min-w-[720px] mt-2 border-t border-slate-100 pt-3 select-none">
            {/* Energy Level Track */}
            {showEnergyTrack && (
              <div className="flex items-center mb-2">
                <div className="w-[55px] text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>Energía</span>
                </div>
                <div className="flex-1 flex justify-between pr-[40px]">
                  {Array.from({ length: totalDays }).map((_, d) => {
                    const curDate = addDays(selectedCycle.startDate, d);
                    const log = cycleLogs.find(l => l.date === curDate);
                    const eLevel = log?.energy;

                    return (
                      <div
                        key={`energy-${d}`}
                        className="flex-1 flex items-center justify-center"
                        title={eLevel ? `Día ${d+1}: Energía ${SPANISH_ENERGY_LABELS[eLevel]?.label}` : undefined}
                      >
                        {eLevel === 'high' ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                            ⚡
                          </span>
                        ) : eLevel === 'medium' ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[9px] font-bold">
                            •
                          </span>
                        ) : eLevel === 'low' ? (
                          <span className="w-3 h-3 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[8px]">
                            -
                          </span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mood Track */}
            {showMoodTrack && (
              <div className="flex items-center mb-2">
                <div className="w-[55px] text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                  <Smile className="w-3 h-3 text-amber-600" />
                  <span>Ánimo</span>
                </div>
                <div className="flex-1 flex justify-between pr-[40px]">
                  {Array.from({ length: totalDays }).map((_, d) => {
                    const curDate = addDays(selectedCycle.startDate, d);
                    const log = cycleLogs.find(l => l.date === curDate);
                    const primaryMood = log?.moods?.[0];

                    return (
                      <div
                        key={`mood-${d}`}
                        className="flex-1 flex items-center justify-center text-xs"
                        title={primaryMood ? `Día ${d+1}: ${SPANISH_MOOD_LABELS[primaryMood]?.label}` : undefined}
                      >
                        {primaryMood ? (
                          <span>{SPANISH_MOOD_LABELS[primaryMood]?.emoji || '•'}</span>
                        ) : (
                          <span className="text-slate-200">·</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Physical Symptoms Track */}
            {showSymptomsTrack && !settings.discreteMode && (
              <div className="flex items-center mb-2">
                <div className="w-[55px] text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                  <Activity className="w-3 h-3 text-rose-600" />
                  <span>Síntomas</span>
                </div>
                <div className="flex-1 flex justify-between pr-[40px]">
                  {Array.from({ length: totalDays }).map((_, d) => {
                    const curDate = addDays(selectedCycle.startDate, d);
                    const log = cycleLogs.find(l => l.date === curDate);
                    const symCount = log?.symptoms ? Object.keys(log.symptoms).length : 0;
                    const hasCramps = log?.symptoms?.cramps || log?.symptoms?.pelvic_pain;
                    const hasBreast = log?.symptoms?.breast_tenderness;
                    const hasHeadache = log?.symptoms?.headache;

                    return (
                      <div
                        key={`sym-${d}`}
                        className="flex-1 flex items-center justify-center text-xs"
                        title={symCount > 0 ? `Día ${d+1}: ${symCount} síntomas registrados` : undefined}
                      >
                        {hasCramps ? (
                          <span title="Cólicos/calambres">⚡</span>
                        ) : hasBreast ? (
                          <span title="Dolor de pecho">🌸</span>
                        ) : hasHeadache ? (
                          <span title="Dolor de cabeza">💆</span>
                        ) : symCount > 0 ? (
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                        ) : (
                          <span className="text-slate-200">·</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sex Activity Track */}
            {!settings.discreteMode && (
              <div className="flex items-center mb-1">
                <div className="w-[55px] text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
                  <span>Relaciones</span>
                </div>
                <div className="flex-1 flex justify-between pr-[40px]">
                  {Array.from({ length: totalDays }).map((_, d) => {
                    const curDate = addDays(selectedCycle.startDate, d);
                    const log = cycleLogs.find(l => l.date === curDate);
                    const hadSex = log?.sex?.hadSex;
                    const isProtected = hadSex && log?.sex?.protection?.some(pr => pr !== 'none');

                    return (
                      <div
                        key={`sex-${d}`}
                        className="flex-1 flex items-center justify-center text-xs"
                        title={hadSex ? `Día ${d+1}: Relaciones ${isProtected ? 'con protección' : 'sin protección'}` : undefined}
                      >
                        {hadSex ? (
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isProtected ? 'text-rose-500 fill-rose-500' : 'text-amber-500 fill-amber-500'
                            }`}
                          />
                        ) : (
                          <span className="text-slate-200">·</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Phase Color Bands Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-100 border border-rose-200" />
              <span>Fase Menstrual (Días 1-5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-100 border border-emerald-200" />
              <span>Ventana Fértil & Ovulación</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-100 border border-indigo-200" />
              <span>Fase Lútea (Progesterona alta)</span>
            </div>
            {bbtMetrics.coverline && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-indigo-600" />
                <span>Línea base ({bbtMetrics.coverline}°C)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Energía Alta</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Media</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Baja</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hormonal & Emotional Correlation Card */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Correlación Biológica: Cómo interactúan las Hormonas, el Ánimo y la Energía
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Tus niveles de energía y estado emocional están íntimamente ligados a las fluctuaciones de estrógenos y progesterona a lo largo del ciclo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {/* Phase 1 */}
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800">1. Menstrual</span>
              <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold">🪫 Baja</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Estrógeno y progesterona en mínimos. Predominan calambres y necesidad de descanso e introspección.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">2. Folicular</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">⚡ Alta</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              El estrógeno sube rápidamente. Mayor energía, claridad mental, optimismo y motivación.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">3. Ovulatoria</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">⚡ Pico</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pico de LH y estrógenos. Máxima libido, sociabilidad y moco elástico. Salto de temperatura inminente.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">4. Lútea</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">🔋 Media/Baja</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Progesterona alta eleva la temperatura. Al final del ciclo puede aparecer hipersensibilidad mamaria o irritabilidad premenstrual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
