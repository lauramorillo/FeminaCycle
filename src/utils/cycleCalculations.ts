/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DailyLog,
  UserSettings,
  CycleSummary,
  DayPrediction,
  CyclePhase,
  FertilityLevel,
  FlowIntensity,
  SymptomType,
  CervicalMucus,
  ProtectionType,
  MoodType,
  EnergyLevel
} from '../types/cycle';

export const SPANISH_SYMPTOM_LABELS: Record<SymptomType, { name: string; description: string; icon: string }> = {
  cramps: { name: 'Calambres / Cólicos', description: 'Espasmos en la zona pélvica', icon: '⚡' },
  pelvic_pain: { name: 'Dolor en el vientre', description: 'Molestias o presión abdominal baja', icon: '🩹' },
  back_pain: { name: 'Dolor de espalda', description: 'Tensión en la zona lumbar', icon: '🦴' },
  breast_tenderness: { name: 'Dolor de pecho', description: 'Hipersensibilidad o hinchazón mamaria', icon: '🌸' },
  headache: { name: 'Dolor de cabeza', description: 'Cefalea o sensación pulsátil', icon: '💆‍♀️' },
  bloating: { name: 'Hinchazón abdominal', description: 'Retención de líquidos o gases', icon: '🫧' },
  fatigue: { name: 'Cansancio / Fatiga', description: 'Baja energía o somnolencia', icon: '😴' },
  acne: { name: 'Acné / Brotes', description: 'Granitos o cambios cutáneos', icon: '✨' },
  nausea: { name: 'Náuseas', description: 'Malestar digestivo matutino o general', icon: '🍃' },
  ovulation_pain: { name: 'Dolor de ovulación', description: 'Pinchazo ovárico unilateral (Mittelschmerz)', icon: '🎯' },
};

export const SPANISH_FLOW_LABELS: Record<FlowIntensity, { label: string; color: string; desc: string }> = {
  none: { label: 'Sin sangrado', color: 'bg-slate-100 text-slate-600', desc: 'Día limpio sin flujo menstrual' },
  spotting: { label: 'Manchado', color: 'bg-rose-100 text-rose-800', desc: 'Gotas o flujo amarronado tenue' },
  light: { label: 'Flujo ligero', color: 'bg-rose-200 text-rose-900', desc: 'Sangrado suave (1-2 compresas/tampones)' },
  medium: { label: 'Flujo medio', color: 'bg-rose-500 text-white', desc: 'Sangrado regular típico' },
  heavy: { label: 'Flujo abundante', color: 'bg-rose-700 text-white', desc: 'Sangrado intenso que requiere cambio frecuente' },
};

export const SPANISH_MUCUS_LABELS: Record<CervicalMucus, { label: string; fertility: string; desc: string }> = {
  dry: { label: 'Seco / Ausente', fertility: 'Infértil', desc: 'Poco o ningún flujo perceptible' },
  sticky: { label: 'Pegajoso / Denso', fertility: 'Baja fertilidad', desc: 'Blanquecino y grumoso, retiene espermatozoides' },
  creamy: { label: 'Cremoso / Lechoso', fertility: 'Fertilidad intermedia', desc: 'Textura de loción suave' },
  egg_white: { label: 'Clara de huevo', fertility: 'Máxima fertilidad', desc: 'Transparente, muy resbaladizo y elástico' },
  watery: { label: 'Acuoso / Fluido', fertility: 'Alta fertilidad', desc: 'Líquido claro y húmedo' },
};

export const SPANISH_PROTECTION_LABELS: Record<ProtectionType, { label: string; badge: string; desc: string }> = {
  condom: { label: 'Preservativo / Condón', badge: 'Preservativo', desc: 'Barrera eficaz contra embarazo e ITS' },
  none: { label: 'Sin protección', badge: 'Sin protección', desc: 'Coito vaginal sin método anticonceptivo' },
  pill: { label: 'Píldora anticonceptiva', badge: 'Píldora', desc: 'Anticonceptivo hormonal diario' },
  iud: { label: 'DIU (Cobre u Hormonal)', badge: 'DIU', desc: 'Dispositivo intrauterino de larga duración' },
  withdrawal: { label: 'Marcha atrás', badge: 'Marcha atrás', desc: 'Coitus interruptus (método de baja fiabilidad)' },
  emergency_pill: { label: 'Píldora de emergencia', badge: 'Píldora del día después', desc: 'Uso puntual tras coito de riesgo' },
  other: { label: 'Otro método', badge: 'Otro', desc: 'Anillo, parche, diafragma, etc.' },
};

export const SPANISH_MOOD_LABELS: Record<MoodType, { label: string; emoji: string; color: string }> = {
  happy: { label: 'Feliz / Positiva', emoji: '😊', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  calm: { label: 'Tranquila / Serena', emoji: '🧘‍♀️', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  energetic: { label: 'Enérgica', emoji: '✨', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  sensitive: { label: 'Sensible / Emotiva', emoji: '🥺', color: 'text-pink-700 bg-pink-50 border-pink-200' },
  irritable: { label: 'Irritable', emoji: '😤', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  anxious: { label: 'Ansiosa / Inquieta', emoji: '😟', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  sad: { label: 'Triste / Desanimada', emoji: '😢', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  overwhelmed: { label: 'Abrumada / Estresada', emoji: '🤯', color: 'text-purple-700 bg-purple-50 border-purple-200' },
};

export const SPANISH_ENERGY_LABELS: Record<EnergyLevel, { label: string; desc: string; icon: string; score: number; color: string }> = {
  high: { label: 'Alta', desc: 'Vigorosa, motivada y con fuerza', icon: '⚡', score: 3, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  medium: { label: 'Media', desc: 'Equilibrada y funcional', icon: '🔋', score: 2, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  low: { label: 'Baja', desc: 'Fatigada o necesitada de descanso', icon: '🪫', score: 1, color: 'text-slate-700 bg-slate-100 border-slate-200' },
};

export const SPANISH_PHASE_INFO: Record<CyclePhase, { name: string; desc: string; tip: string; color: string }> = {
  menstrual: {
    name: 'Fase Menstrual',
    desc: 'Desprendimiento del endometrio. Los niveles de estrógeno y progesterona están bajos.',
    tip: 'Descansa, hidrátate bien y aplica calor suave en el bajo vientre si sientes calambres.',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  follicular: {
    name: 'Fase Folicular',
    desc: 'Los folículos se desarrollan y el estrógeno comienza a subir gradualmente.',
    tip: 'Sueles notar aumento de energía, creatividad y lucidez mental.',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  ovulation: {
    name: 'Fase Ovulatoria (Ventana Fértil)',
    desc: 'Pico de hormona LH y liberación del óvulo maduro. Máxima fertilidad.',
    tip: 'Momento óptimo si buscas embarazo, o extrema precaución si deseas evitarlo.',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  luteal: {
    name: 'Fase Lútea',
    desc: 'El cuerpo lúteo produce progesterona para preparar el útero. La temperatura basal sube.',
    tip: 'Prioriza el descanso, reduce la cafeína y atiende a los posibles síntomas premenstruales (SPM).',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
};

/** Date string utilities YYYY-MM-DD */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateISO(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDateISO(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateISO(date);
}

export function diffDays(dateStrA: string, dateStrB: string): number {
  const a = parseDateISO(dateStrA).getTime();
  const b = parseDateISO(dateStrB).getTime();
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

export function formatSpanishDate(dateStr: string, options?: { showYear?: boolean; showDayOfWeek?: boolean }): string {
  const date = parseDateISO(dateStr);
  const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const dayName = weekdays[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  let res = `${dayNum} de ${monthName}`;
  if (options?.showYear) res += ` de ${year}`;
  if (options?.showDayOfWeek) res = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${res}`;
  return res;
}

export function celsiusToFahrenheit(c: number): number {
  return Number(((c * 9) / 5 + 32).toFixed(2));
}

export function fahrenheitToCelsius(f: number): number {
  return Number((((f - 32) * 5) / 9).toFixed(2));
}

/**
 * Detect cycle start dates from daily logs.
 * A new cycle starts when there is active bleeding ('light', 'medium', 'heavy')
 * after at least 10 days of non-bleeding or beginning of tracking.
 */
export function extractCycleStarts(logs: DailyLog[]): string[] {
  const activeBleedingDays = logs
    .filter(l => l.flow === 'light' || l.flow === 'medium' || l.flow === 'heavy')
    .map(l => l.date)
    .sort();

  if (activeBleedingDays.length === 0) return [];

  const starts: string[] = [activeBleedingDays[0]];

  for (let i = 1; i < activeBleedingDays.length; i++) {
    const prevDate = activeBleedingDays[i - 1];
    const currDate = activeBleedingDays[i];
    const diff = diffDays(currDate, prevDate);

    // If more than 10 days passed between bleeding episodes, it's a new cycle start
    if (diff >= 12) {
      starts.push(currDate);
    }
  }

  return starts;
}

/**
 * Summarize cycles history and stats
 */
export function calculateCycleHistory(logs: DailyLog[], settings: UserSettings): CycleSummary[] {
  const starts = extractCycleStarts(logs);
  if (starts.length === 0) return [];

  const summaries: CycleSummary[] = [];

  for (let i = 0; i < starts.length; i++) {
    const startDate = starts[i];
    const isCurrent = i === starts.length - 1;
    const nextStart = isCurrent ? undefined : starts[i + 1];

    let lengthDays: number;
    let endDate: string | undefined;

    if (nextStart) {
      lengthDays = diffDays(nextStart, startDate);
      endDate = addDays(nextStart, -1);
    } else {
      // Current in-progress cycle
      const today = formatDateISO(new Date());
      const currentDaysElapsed = Math.max(1, diffDays(today, startDate) + 1);
      lengthDays = Math.max(currentDaysElapsed, settings.averageCycleLength);
    }

    // Count period days in this cycle
    const periodDays = logs.filter(l => {
      const inCycle = l.date >= startDate && (!endDate || l.date <= endDate);
      const isBleeding = l.flow === 'light' || l.flow === 'medium' || l.flow === 'heavy';
      return inCycle && isBleeding;
    }).length;

    const estimatedOvulationDay = Math.max(1, (nextStart ? lengthDays : settings.averageCycleLength) - settings.lutealPhaseLength);
    const ovulationDate = addDays(startDate, estimatedOvulationDay - 1);

    summaries.push({
      cycleNumber: i + 1,
      startDate,
      endDate,
      lengthDays,
      periodDays: periodDays || settings.averagePeriodLength,
      ovulationDate,
      isCurrent
    });
  }

  return summaries;
}

/**
 * Calculates current cycle status:
 * - Current cycle day (e.g. Día 14)
 * - Current phase (Menstrual, Folicular, Ovulación, Lútea)
 * - Next period predicted date
 * - Days remaining (or delay days)
 * - Today's fertility status
 */
export function getCurrentCycleMetrics(logs: DailyLog[], settings: UserSettings) {
  const starts = extractCycleStarts(logs);
  const today = formatDateISO(new Date());
  const hasRecordedCycles = starts.length > 0;

  if (!hasRecordedCycles) {
    return {
      hasRecordedCycles: false,
      lastCycleStart: today,
      effectiveCycleLength: settings.averageCycleLength,
      cycleDay: 0,
      nextPeriodDate: '',
      daysUntilNextPeriod: 0,
      ovulationCycleDay: 0,
      estimatedOvulationDate: '',
      fertileStart: '',
      fertileEnd: '',
      phase: 'follicular' as CyclePhase,
      fertilityToday: 'low' as FertilityLevel,
      statusHeadline: 'Sin ciclo registrado todavía',
      statusDetail: 'Registra el primer día de tu última regla para que podamos calcular tu ciclo, días fértiles y la fecha estimada de tu próxima regla.'
    };
  }

  const lastCycleStart = starts[starts.length - 1];

  // Calculate user's empirical average cycle length from past completed cycles
  const completedCycles = calculateCycleHistory(logs, settings).filter(c => !c.isCurrent);
  let effectiveCycleLength = settings.averageCycleLength;
  if (completedCycles.length >= 2) {
    const sum = completedCycles.reduce((acc, c) => acc + c.lengthDays, 0);
    effectiveCycleLength = Math.round(sum / completedCycles.length);
  }

  const cycleDay = Math.max(1, diffDays(today, lastCycleStart) + 1);
  const nextPeriodDate = addDays(lastCycleStart, effectiveCycleLength);
  const daysUntilNextPeriod = diffDays(nextPeriodDate, today);

  // Ovulation prediction
  const ovulationCycleDay = Math.max(1, effectiveCycleLength - settings.lutealPhaseLength);
  const estimatedOvulationDate = addDays(lastCycleStart, ovulationCycleDay - 1);

  // Fertile window: 5 days before ovulation up to 1 day after ovulation
  const fertileStart = addDays(estimatedOvulationDate, -5);
  const fertileEnd = addDays(estimatedOvulationDate, 1);

  // Determine current phase
  let phase: CyclePhase = 'follicular';
  if (cycleDay <= settings.averagePeriodLength) {
    phase = 'menstrual';
  } else if (today >= fertileStart && today <= fertileEnd) {
    phase = 'ovulation';
  } else if (cycleDay > ovulationCycleDay + 1) {
    phase = 'luteal';
  } else {
    phase = 'follicular';
  }

  // Determine fertility level for today
  let fertilityToday: FertilityLevel = 'low';
  if (today === estimatedOvulationDate) {
    fertilityToday = 'peak';
  } else if (today === addDays(estimatedOvulationDate, -1) || today === addDays(estimatedOvulationDate, -2)) {
    fertilityToday = 'high';
  } else if (today >= fertileStart && today <= fertileEnd) {
    fertilityToday = 'medium';
  } else {
    fertilityToday = 'low';
  }

  // Status message
  let statusHeadline = '';
  let statusDetail = '';

  if (daysUntilNextPeriod > 1) {
    statusHeadline = `Faltan ${daysUntilNextPeriod} días para tu próxima regla`;
    statusDetail = `Prevista para el ${formatSpanishDate(nextPeriodDate, { showDayOfWeek: true })}`;
  } else if (daysUntilNextPeriod === 1) {
    statusHeadline = `Tu próxima regla se espera mañana`;
    statusDetail = `Prevista para el ${formatSpanishDate(nextPeriodDate, { showDayOfWeek: true })}`;
  } else if (daysUntilNextPeriod === 0) {
    statusHeadline = `Hoy es el día previsto de tu regla`;
    statusDetail = `Día 1 del nuevo ciclo o final de tu ciclo habitual`;
  } else {
    const daysLate = Math.abs(daysUntilNextPeriod);
    statusHeadline = `Retraso de ${daysLate} ${daysLate === 1 ? 'día' : 'días'}`;
    statusDetail = `Respecto a tu duración media de ${effectiveCycleLength} días (prevista el ${formatSpanishDate(nextPeriodDate)})`;
  }

  return {
    hasRecordedCycles: true,
    lastCycleStart,
    effectiveCycleLength,
    cycleDay,
    nextPeriodDate,
    daysUntilNextPeriod,
    estimatedOvulationDate,
    fertileStart,
    fertileEnd,
    phase,
    fertilityToday,
    statusHeadline,
    statusDetail
  };
}

/**
 * Predict details for a specific day for calendar rendering
 */
export function getDayPrediction(dateStr: string, logs: DailyLog[], settings: UserSettings): DayPrediction {
  const log = logs.find(l => l.date === dateStr);
  const isPeriod = !!log && (log.flow === 'light' || log.flow === 'medium' || log.flow === 'heavy');

  const metrics = getCurrentCycleMetrics(logs, settings);

  if (!metrics.hasRecordedCycles) {
    return {
      date: dateStr,
      isPeriod,
      isPredictedPeriod: false,
      isOvulation: false,
      isFertile: false,
      fertilityLevel: 'low',
      phase: isPeriod ? 'menstrual' : 'follicular',
      cycleDay: undefined,
    };
  }

  const { lastCycleStart, effectiveCycleLength, estimatedOvulationDate, fertileStart, fertileEnd, nextPeriodDate } = metrics;

  // Day relative to current cycle
  const diffFromStart = diffDays(dateStr, lastCycleStart);
  const cycleDay = diffFromStart >= 0 ? diffFromStart + 1 : undefined;

  // Future predicted periods:
  // Check if date falls in predicted period windows (next period or following month)
  const isPredictedPeriod =
    !isPeriod &&
    ((dateStr >= nextPeriodDate && dateStr < addDays(nextPeriodDate, settings.averagePeriodLength)) ||
     (dateStr >= addDays(nextPeriodDate, effectiveCycleLength) &&
      dateStr < addDays(addDays(nextPeriodDate, effectiveCycleLength), settings.averagePeriodLength)));

  const isOvulation = dateStr === estimatedOvulationDate ||
    dateStr === addDays(estimatedOvulationDate, effectiveCycleLength);

  const isFertile = (dateStr >= fertileStart && dateStr <= fertileEnd) ||
    (dateStr >= addDays(fertileStart, effectiveCycleLength) && dateStr <= addDays(fertileEnd, effectiveCycleLength));

  let fertilityLevel: FertilityLevel = 'low';
  if (isOvulation) {
    fertilityLevel = 'peak';
  } else if (dateStr === addDays(estimatedOvulationDate, -1) || dateStr === addDays(estimatedOvulationDate, -2) ||
             dateStr === addDays(estimatedOvulationDate, effectiveCycleLength - 1) || dateStr === addDays(estimatedOvulationDate, effectiveCycleLength - 2)) {
    fertilityLevel = 'high';
  } else if (isFertile) {
    fertilityLevel = 'medium';
  }

  // Phase computation
  let phase: CyclePhase = 'follicular';
  if (isPeriod || isPredictedPeriod) {
    phase = 'menstrual';
  } else if (isOvulation || isFertile) {
    phase = 'ovulation';
  } else if (diffFromStart > effectiveCycleLength - settings.lutealPhaseLength) {
    phase = 'luteal';
  }

  return {
    date: dateStr,
    isPeriod,
    isPredictedPeriod,
    isFertile,
    isOvulation,
    fertilityLevel,
    cycleDay,
    phase
  };
}

/**
 * BBT (Basal Body Temperature) Coverline & shift calculation
 * For a given cycle, find temperatures before estimated ovulation and post-shift
 */
export function calculateBBTMetrics(logs: DailyLog[], cycleStartDate: string, cycleEndDate?: string) {
  const cycleLogs = logs
    .filter(l => l.date >= cycleStartDate && (!cycleEndDate || l.date <= cycleEndDate))
    .filter(l => typeof l.bbt === 'number' && l.bbt > 35.0 && l.bbt < 38.5)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (cycleLogs.length < 5) {
    return {
      hasShift: false,
      coverline: undefined,
      minTemp: 36.0,
      maxTemp: 37.2,
      shiftDate: undefined
    };
  }

  // Search for the 3-over-6 rule (thermal shift)
  let bestShiftIdx = -1;
  let computedCoverline: number | undefined;

  for (let i = 6; i < cycleLogs.length; i++) {
    // 6 prior temps
    const prior6 = cycleLogs.slice(i - 6, i).map(l => l.bbt!);
    const maxPrior6 = Math.max(...prior6);

    // Current and next 2 temps
    const candidate3 = cycleLogs.slice(i, i + 3).map(l => l.bbt!);
    if (candidate3.length === 3) {
      const allHigher = candidate3.every(t => t > maxPrior6);
      const thirdIsHighEnough = candidate3[2] >= maxPrior6 + 0.15; // At least ~0.2°C jump

      if (allHigher && thirdIsHighEnough) {
        bestShiftIdx = i;
        // Standard sympto-thermal coverline is drawn 0.05°C above the highest of the 6 prior temperatures
        computedCoverline = Number((maxPrior6 + 0.05).toFixed(2));
        break;
      }
    }
  }

  const allTemps = cycleLogs.map(l => l.bbt!);
  const minTemp = Number((Math.min(...allTemps) - 0.15).toFixed(2));
  const maxTemp = Number((Math.max(...allTemps) + 0.15).toFixed(2));

  return {
    hasShift: bestShiftIdx !== -1,
    coverline: computedCoverline,
    minTemp: Math.min(36.0, minTemp),
    maxTemp: Math.max(37.2, maxTemp),
    shiftDate: bestShiftIdx !== -1 ? cycleLogs[bestShiftIdx].date : undefined
  };
}
