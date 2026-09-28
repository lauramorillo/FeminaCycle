/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyLog, UserSettings, ReminderItem } from '../types/cycle';
import { formatDateISO, addDays } from './cycleCalculations';

const SETTINGS_KEY = 'feminacycle_settings_v1';
const LOGS_KEY = 'feminacycle_logs_v1';
const PIN_SESSION_KEY = 'feminacycle_pin_unlocked';
const DEMO_CLEARED_KEY = 'feminacycle_demo_cleared';

export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-bbt',
    type: 'bbt',
    title: 'Medir Temperatura Basal',
    description: 'Recordatorio para medir la temperatura antes de salir de la cama',
    enabled: true,
    time: '07:30',
    message: 'Buenos días: recuerda medir tu temperatura basal en reposo antes de levantarte.',
  },
  {
    id: 'rem-symptoms',
    type: 'symptoms',
    title: 'Registro de Síntomas y Ánimo',
    description: 'Anota cómo te has sentido a lo largo del día',
    enabled: true,
    time: '21:00',
    message: '¿Cómo ha ido tu día? Registra tus síntomas, nivel de energía y estado de ánimo.',
  },
  {
    id: 'rem-fertile',
    type: 'fertile_window',
    title: 'Aviso de Días Fértiles',
    description: 'Notificación al inicio de tu ventana de máxima fertilidad',
    enabled: true,
    time: '09:00',
    daysBefore: 1,
    message: 'Tu ventana fértil está comenzando. Recuerda registrar el moco cervical y protección.',
  },
  {
    id: 'rem-period',
    type: 'period_soon',
    title: 'Aviso de Próxima Regla',
    description: 'Alerta previa antes del día estimado de menstruación',
    enabled: true,
    time: '09:00',
    daysBefore: 2,
    message: 'Tu regla está prevista en 2 días según tu ciclo habitual. Prepara tus productos de cuidado.',
  },
  {
    id: 'rem-sex',
    type: 'sex',
    title: 'Registro de Relaciones y Protección',
    description: 'Lleva el control de tu salud sexual y métodos anticonceptivos',
    enabled: false,
    time: '22:30',
    message: 'Recuerda anotar si hubo relaciones y el tipo de protección utilizada hoy.',
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lutealPhaseLength: 14,
  tempUnit: 'C',
  pinEnabled: false,
  pinCode: '1234',
  discreteMode: false,
  reminders: DEFAULT_REMINDERS,
};

/**
 * Generate realistic demonstration data anchored to the current date
 */
export function generateSeedLogs(): DailyLog[] {
  const today = new Date();
  const todayStr = formatDateISO(today);

  // We anchor the current cycle to start 25 days before today (in the luteal phase, close to next period)
  const currentCycleStart = addDays(todayStr, -25);
  const cycle2Start = addDays(currentCycleStart, -28);
  const cycle1Start = addDays(cycle2Start, -29);

  const logs: DailyLog[] = [];

  // Helper to add day
  const addDayRecord = (date: string, partial: Partial<DailyLog>) => {
    logs.push({
      date,
      flow: partial.flow || 'none',
      symptoms: partial.symptoms || {},
      bbt: partial.bbt,
      bbtTime: partial.bbtTime || '07:30',
      mucus: partial.mucus,
      energy: partial.energy || 'medium',
      moods: partial.moods || ['calm'],
      sex: partial.sex,
      notes: partial.notes,
      updatedAt: new Date().toISOString(),
    });
  };

  // --- CYCLE 1: 29 days ---
  // Period (days 1-5)
  addDayRecord(cycle1Start, { flow: 'heavy', bbt: 36.32, energy: 'low', symptoms: { cramps: 'severe', pelvic_pain: 'moderate' }, moods: ['sensitive', 'sad'] });
  addDayRecord(addDays(cycle1Start, 1), { flow: 'heavy', bbt: 36.30, energy: 'low', symptoms: { cramps: 'moderate', headache: 'mild' }, moods: ['calm', 'sensitive'] });
  addDayRecord(addDays(cycle1Start, 2), { flow: 'medium', bbt: 36.28, energy: 'medium', symptoms: { cramps: 'mild', back_pain: 'mild' }, moods: ['calm'] });
  addDayRecord(addDays(cycle1Start, 3), { flow: 'light', bbt: 36.31, energy: 'medium', moods: ['energetic'] });
  addDayRecord(addDays(cycle1Start, 4), { flow: 'spotting', bbt: 36.35, energy: 'medium', mucus: 'sticky', moods: ['happy'] });
  
  // Follicular (days 6-12)
  for (let i = 5; i <= 11; i++) {
    const d = addDays(cycle1Start, i);
    const temp = Number((36.25 + (i % 3) * 0.04).toFixed(2));
    addDayRecord(d, {
      bbt: temp,
      mucus: i > 8 ? 'creamy' : 'dry',
      energy: i > 8 ? 'high' : 'medium',
      moods: ['happy', 'energetic'],
    });
  }

  // Fertile & Ovulation (days 13-16)
  addDayRecord(addDays(cycle1Start, 12), { bbt: 36.28, energy: 'high', mucus: 'egg_white', sex: { hadSex: true, protection: ['condom'], libido: 'high' }, moods: ['happy', 'energetic'] });
  addDayRecord(addDays(cycle1Start, 13), { bbt: 36.22, energy: 'high', mucus: 'egg_white', symptoms: { ovulation_pain: 'mild' }, moods: ['energetic'] });
  addDayRecord(addDays(cycle1Start, 14), { bbt: 36.35, energy: 'high', mucus: 'egg_white', sex: { hadSex: true, protection: ['condom'], orgasm: true, libido: 'high' }, moods: ['happy'] }); // Ovulation
  addDayRecord(addDays(cycle1Start, 15), { bbt: 36.62, energy: 'medium', mucus: 'creamy', moods: ['calm'] }); // Thermal shift!
  addDayRecord(addDays(cycle1Start, 16), { bbt: 36.68, energy: 'medium', moods: ['calm'] });

  // Luteal phase
  for (let i = 17; i < 28; i++) {
    const d = addDays(cycle1Start, i);
    const temp = Number((36.65 + (i % 4) * 0.03).toFixed(2));
    addDayRecord(d, {
      bbt: temp,
      mucus: 'sticky',
      energy: i > 24 ? 'low' : 'medium',
      symptoms: i > 24 ? { breast_tenderness: 'moderate', bloating: 'mild' } : {},
      moods: i > 25 ? ['sensitive', 'irritable'] : ['calm'],
    });
  }

  // --- CYCLE 2: 28 days ---
  // Period
  addDayRecord(cycle2Start, { flow: 'medium', bbt: 36.30, energy: 'low', symptoms: { cramps: 'moderate', back_pain: 'moderate' }, moods: ['sensitive'] });
  addDayRecord(addDays(cycle2Start, 1), { flow: 'heavy', bbt: 36.28, energy: 'low', symptoms: { cramps: 'severe', pelvic_pain: 'moderate' }, moods: ['sad'] });
  addDayRecord(addDays(cycle2Start, 2), { flow: 'heavy', bbt: 36.26, energy: 'medium', symptoms: { cramps: 'mild', headache: 'mild' }, moods: ['calm'] });
  addDayRecord(addDays(cycle2Start, 3), { flow: 'medium', bbt: 36.29, energy: 'medium', moods: ['calm'] });
  addDayRecord(addDays(cycle2Start, 4), { flow: 'light', bbt: 36.32, energy: 'medium', moods: ['happy'] });
  addDayRecord(addDays(cycle2Start, 5), { flow: 'spotting', bbt: 36.34, energy: 'medium', mucus: 'sticky', moods: ['calm'] });

  // Follicular & Ovulation
  for (let i = 6; i <= 11; i++) {
    const d = addDays(cycle2Start, i);
    addDayRecord(d, {
      bbt: Number((36.24 + (i % 3) * 0.04).toFixed(2)),
      mucus: i > 9 ? 'creamy' : 'dry',
      energy: i > 8 ? 'high' : 'medium',
      moods: ['energetic', 'happy'],
    });
  }
  // Fertile & Ovulation
  addDayRecord(addDays(cycle2Start, 12), { bbt: 36.25, energy: 'high', mucus: 'egg_white', sex: { hadSex: true, protection: ['pill', 'condom'], libido: 'high' }, moods: ['happy'] });
  addDayRecord(addDays(cycle2Start, 13), { bbt: 36.20, energy: 'high', mucus: 'egg_white', symptoms: { ovulation_pain: 'moderate' }, moods: ['energetic'] }); // Dip
  addDayRecord(addDays(cycle2Start, 14), { bbt: 36.55, energy: 'medium', mucus: 'creamy', moods: ['calm'] }); // Shift up
  addDayRecord(addDays(cycle2Start, 15), { bbt: 36.68, energy: 'medium', moods: ['calm'] });
  addDayRecord(addDays(cycle2Start, 16), { bbt: 36.72, energy: 'medium', moods: ['calm'] });

  for (let i = 17; i < 28; i++) {
    const d = addDays(cycle2Start, i);
    addDayRecord(d, {
      bbt: Number((36.66 + (i % 3) * 0.03).toFixed(2)),
      mucus: 'sticky',
      energy: i >= 25 ? 'low' : 'medium',
      symptoms: i >= 25 ? { breast_tenderness: 'mild', acne: 'mild' } : {},
      moods: i >= 26 ? ['irritable', 'anxious'] : ['calm'],
    });
  }

  // --- CURRENT CYCLE: Started 25 days ago ---
  // Period (days 1-5)
  addDayRecord(currentCycleStart, {
    flow: 'medium',
    bbt: 36.32,
    energy: 'low',
    symptoms: { cramps: 'moderate', pelvic_pain: 'mild', back_pain: 'moderate' },
    moods: ['sensitive'],
    notes: 'Primer día de la regla. Tomé infusión caliente de manzanilla.',
  });
  addDayRecord(addDays(currentCycleStart, 1), {
    flow: 'heavy',
    bbt: 36.30,
    energy: 'low',
    symptoms: { cramps: 'severe', pelvic_pain: 'moderate', headache: 'mild' },
    moods: ['sensitive'],
  });
  addDayRecord(addDays(currentCycleStart, 2), {
    flow: 'heavy',
    bbt: 36.27,
    energy: 'medium',
    symptoms: { cramps: 'moderate', back_pain: 'mild' },
    moods: ['calm'],
  });
  addDayRecord(addDays(currentCycleStart, 3), {
    flow: 'medium',
    bbt: 36.29,
    energy: 'medium',
    symptoms: { cramps: 'mild' },
    moods: ['calm', 'energetic'],
  });
  addDayRecord(addDays(currentCycleStart, 4), {
    flow: 'light',
    bbt: 36.31,
    energy: 'medium',
    mucus: 'dry',
    moods: ['happy', 'energetic'],
  });
  addDayRecord(addDays(currentCycleStart, 5), {
    flow: 'spotting',
    bbt: 36.33,
    energy: 'medium',
    mucus: 'sticky',
    moods: ['energetic'],
  });

  // Follicular phase (days 6-10)
  addDayRecord(addDays(currentCycleStart, 6), { bbt: 36.26, energy: 'high', mucus: 'sticky', moods: ['happy'] });
  addDayRecord(addDays(currentCycleStart, 7), { bbt: 36.29, energy: 'high', mucus: 'sticky', moods: ['energetic'] });
  addDayRecord(addDays(currentCycleStart, 8), { bbt: 36.25, energy: 'high', mucus: 'creamy', moods: ['calm'] });
  addDayRecord(addDays(currentCycleStart, 9), { bbt: 36.28, energy: 'high', mucus: 'creamy', moods: ['happy'] });
  addDayRecord(addDays(currentCycleStart, 10), {
    bbt: 36.24,
    energy: 'high',
    mucus: 'watery',
    sex: { hadSex: true, protection: ['condom'], libido: 'medium' },
    moods: ['happy', 'energetic'],
  });

  // Fertile window & Ovulation (days 11-15)
  addDayRecord(addDays(currentCycleStart, 11), {
    bbt: 36.22,
    energy: 'high',
    mucus: 'egg_white',
    moods: ['energetic', 'happy'],
    notes: 'Flujo claro, muy elástico (clara de huevo). Días fértiles.',
  });
  addDayRecord(addDays(currentCycleStart, 12), {
    bbt: 36.20,
    energy: 'high',
    mucus: 'egg_white',
    sex: { hadSex: true, protection: ['condom'], orgasm: true, libido: 'high' },
    moods: ['happy'],
  });
  addDayRecord(addDays(currentCycleStart, 13), {
    bbt: 36.18, // Slight dip right before ovulation surge
    energy: 'high',
    mucus: 'egg_white',
    symptoms: { ovulation_pain: 'moderate' },
    moods: ['energetic'],
    notes: 'Pinchazo en el ovario derecho sobre el mediodía.',
  });
  addDayRecord(addDays(currentCycleStart, 14), { // Day 15 (estimated ovulation)
    bbt: 36.42,
    energy: 'high',
    mucus: 'egg_white',
    sex: { hadSex: true, protection: ['condom'], libido: 'high' },
    moods: ['calm', 'happy'],
  });
  addDayRecord(addDays(currentCycleStart, 15), { // First day post-ovulation shift
    bbt: 36.64,
    energy: 'medium',
    mucus: 'creamy',
    moods: ['calm'],
    notes: 'Subida clara de temperatura (+0.22°C). Progesterona activa.',
  });

  // Luteal phase up to today (days 16-25)
  addDayRecord(addDays(currentCycleStart, 16), { bbt: 36.68, energy: 'medium', mucus: 'sticky', moods: ['calm'] });
  addDayRecord(addDays(currentCycleStart, 17), { bbt: 36.71, energy: 'medium', mucus: 'sticky', moods: ['happy'] });
  addDayRecord(addDays(currentCycleStart, 18), { bbt: 36.69, energy: 'medium', mucus: 'dry', moods: ['calm'] });
  addDayRecord(addDays(currentCycleStart, 19), {
    bbt: 36.74,
    energy: 'medium',
    mucus: 'dry',
    sex: { hadSex: true, protection: ['condom'], libido: 'medium' },
    moods: ['calm'],
  });
  addDayRecord(addDays(currentCycleStart, 20), { bbt: 36.70, energy: 'medium', symptoms: { breast_tenderness: 'mild' }, moods: ['sensitive'] });
  addDayRecord(addDays(currentCycleStart, 21), { bbt: 36.75, energy: 'medium', symptoms: { breast_tenderness: 'moderate', bloating: 'mild' }, moods: ['calm'] });
  addDayRecord(addDays(currentCycleStart, 22), { bbt: 36.72, energy: 'low', symptoms: { breast_tenderness: 'moderate', fatigue: 'mild' }, moods: ['sensitive'] });
  addDayRecord(addDays(currentCycleStart, 23), { bbt: 36.68, energy: 'low', symptoms: { bloating: 'moderate', acne: 'mild' }, moods: ['irritable'] });
  addDayRecord(addDays(currentCycleStart, 24), { bbt: 36.65, energy: 'low', symptoms: { breast_tenderness: 'mild', back_pain: 'mild' }, moods: ['anxious'] });
  
  // Today's entry (Day 25 of current cycle)
  addDayRecord(todayStr, {
    bbt: 36.66,
    bbtTime: '07:20',
    energy: 'low',
    symptoms: { breast_tenderness: 'mild', bloating: 'mild' },
    moods: ['sensitive', 'irritable'],
    notes: 'Fase lútea tardía. Próxima regla prevista en unos 3 días.',
  });

  return logs;
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      reminders: Array.isArray(parsed?.reminders) && parsed.reminders.length > 0 ? parsed.reminders : DEFAULT_SETTINGS.reminders,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function loadLogs(): DailyLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    const wasCleared = localStorage.getItem(DEMO_CLEARED_KEY) === 'true';

    if (!raw) {
      if (wasCleared) {
        return [];
      }
      const seed = generateSeedLogs();
      saveLogs(seed);
      return seed;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return wasCleared ? [] : generateSeedLogs();
    }

    // If it's an empty array and user cleared it, keep it empty!
    if (parsed.length === 0 && wasCleared) {
      return [];
    }

    if (parsed.length === 0 && !wasCleared) {
      const seed = generateSeedLogs();
      saveLogs(seed);
      return seed;
    }

    return parsed;
  } catch {
    return [];
  }
}

export function isDemoDataActive(): boolean {
  try {
    const wasCleared = localStorage.getItem(DEMO_CLEARED_KEY) === 'true';
    if (wasCleared) return false;
    const current = loadLogs();
    return current.length > 0;
  } catch {
    return false;
  }
}

export function clearAllLogs(): DailyLog[] {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
    localStorage.setItem(DEMO_CLEARED_KEY, 'true');
  } catch (e) {
    console.error('Error clearing logs', e);
  }
  return [];
}

export function restoreDemoData(): DailyLog[] {
  try {
    localStorage.removeItem(DEMO_CLEARED_KEY);
    const seed = generateSeedLogs();
    saveLogs(seed);
    return seed;
  } catch (e) {
    console.error('Error restoring demo data', e);
    return [];
  }
}

export function saveLogs(logs: DailyLog[]): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving logs', e);
  }
}

export function upsertLog(log: DailyLog): DailyLog[] {
  const currentLogs = loadLogs();
  const existingIdx = currentLogs.findIndex(l => l.date === log.date);
  
  let updated: DailyLog[];
  if (existingIdx >= 0) {
    updated = [...currentLogs];
    updated[existingIdx] = { ...log, updatedAt: new Date().toISOString() };
  } else {
    updated = [...currentLogs, { ...log, updatedAt: new Date().toISOString() }];
  }

  // Keep sorted by date
  updated.sort((a, b) => a.date.localeCompare(b.date));
  saveLogs(updated);
  return updated;
}

export function deleteLog(date: string): DailyLog[] {
  const currentLogs = loadLogs();
  const updated = currentLogs.filter(l => l.date !== date);
  saveLogs(updated);
  return updated;
}

export function checkPinUnlocked(): boolean {
  return sessionStorage.getItem(PIN_SESSION_KEY) === 'true';
}

export function setPinUnlocked(unlocked: boolean): void {
  if (unlocked) {
    sessionStorage.setItem(PIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(PIN_SESSION_KEY);
  }
}

export function exportBackup(): string {
  const data = {
    app: 'FeminaCycle',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    settings: loadSettings(),
    logs: loadLogs(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackup(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.logs)) {
      return { success: false, message: 'El archivo no contiene un formato de copia válido.' };
    }
    if (data.settings) {
      saveSettings(data.settings);
    }
    saveLogs(data.logs);
    return { success: true, message: `Se importaron ${data.logs.length} registros correctamente.` };
  } catch (err) {
    return { success: false, message: 'Error al procesar el archivo JSON.' };
  }
}

export function resetAllData(): void {
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(LOGS_KEY);
  sessionStorage.removeItem(PIN_SESSION_KEY);
}
