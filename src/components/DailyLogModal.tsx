/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Thermometer,
  Heart,
  Droplet,
  Calendar,
  Sparkles,
  Trash2,
  Check,
  Clock,
  Shield,
  Plus,
  Minus
} from 'lucide-react';
import {
  DailyLog,
  FlowIntensity,
  SymptomType,
  SymptomSeverity,
  CervicalMucus,
  ProtectionType,
  MoodType,
  EnergyLevel,
  UserSettings
} from '../types/cycle';
import {
  formatDateISO,
  formatSpanishDate,
  addDays,
  SPANISH_SYMPTOM_LABELS,
  SPANISH_FLOW_LABELS,
  SPANISH_MUCUS_LABELS,
  SPANISH_PROTECTION_LABELS,
  SPANISH_MOOD_LABELS,
  SPANISH_ENERGY_LABELS,
  celsiusToFahrenheit,
  fahrenheitToCelsius
} from '../utils/cycleCalculations';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  existingLogs: DailyLog[];
  settings: UserSettings;
  onSaveLog: (log: DailyLog) => void;
  onDeleteLog: (date: string) => void;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  existingLogs,
  settings,
  onSaveLog,
  onDeleteLog,
}) => {
  const todayStr = formatDateISO(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);

  // Form states
  const [flow, setFlow] = useState<FlowIntensity>('none');
  const [bbt, setBbt] = useState<string>('');
  const [bbtTime, setBbtTime] = useState<string>('07:30');
  const [mucus, setMucus] = useState<CervicalMucus | ''>('');
  const [hadSex, setHadSex] = useState<boolean>(false);
  const [protection, setProtection] = useState<ProtectionType[]>([]);
  const [orgasm, setOrgasm] = useState<boolean | undefined>(undefined);
  const [libido, setLibido] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<Partial<Record<SymptomType, SymptomSeverity>>>({});
  const [energy, setEnergy] = useState<EnergyLevel | undefined>('medium');
  const [moods, setMoods] = useState<MoodType[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Load existing log whenever date changes or modal opens
  useEffect(() => {
    if (!isOpen) return;
    const targetDate = initialDate || todayStr;
    setSelectedDate(targetDate);
    loadDateData(targetDate);
  }, [isOpen, initialDate]);

  const loadDateData = (date: string) => {
    const existing = existingLogs.find(l => l.date === date);
    if (existing) {
      setFlow(existing.flow || 'none');
      setBbt(existing.bbt ? existing.bbt.toFixed(2) : '');
      setBbtTime(existing.bbtTime || '07:30');
      setMucus(existing.mucus || '');
      setHadSex(!!existing.sex?.hadSex);
      setProtection(existing.sex?.protection || []);
      setOrgasm(existing.sex?.orgasm);
      setLibido(existing.sex?.libido);
      setSymptoms(existing.symptoms || {});
      setEnergy(existing.energy || 'medium');
      setMoods(existing.moods || []);
      setNotes(existing.notes || '');
    } else {
      // Clean slate for new day
      setFlow('none');
      setBbt('');
      setBbtTime('07:30');
      setMucus('');
      setHadSex(false);
      setProtection([]);
      setOrgasm(undefined);
      setLibido(undefined);
      setSymptoms({});
      setEnergy('medium');
      setMoods([]);
      setNotes('');
    }
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    loadDateData(newDate);
  };

  const toggleProtection = (type: ProtectionType) => {
    if (protection.includes(type)) {
      setProtection(protection.filter(p => p !== type));
    } else {
      setProtection([...protection, type]);
    }
  };

  const toggleSymptom = (type: SymptomType) => {
    if (symptoms[type]) {
      const next = { ...symptoms };
      delete next[type];
      setSymptoms(next);
    } else {
      setSymptoms({ ...symptoms, [type]: 'moderate' });
    }
  };

  const setSymptomSeverity = (type: SymptomType, severity: SymptomSeverity) => {
    setSymptoms({ ...symptoms, [type]: severity });
  };

  const toggleMood = (mood: MoodType) => {
    if (moods.includes(mood)) {
      setMoods(moods.filter(m => m !== mood));
    } else {
      setMoods([...moods, mood]);
    }
  };

  const handleBbtAdjust = (delta: number) => {
    const current = parseFloat(bbt) || 36.4;
    const adjusted = Number((current + delta).toFixed(2));
    if (adjusted >= 35.0 && adjusted <= 38.5) {
      setBbt(adjusted.toFixed(2));
    }
  };

  const handleSave = () => {
    const numBbt = bbt ? parseFloat(bbt) : undefined;
    const newLog: DailyLog = {
      date: selectedDate,
      flow,
      bbt: numBbt && !isNaN(numBbt) ? numBbt : undefined,
      bbtTime: numBbt ? bbtTime : undefined,
      mucus: mucus || undefined,
      energy,
      sex: hadSex
        ? {
            hadSex: true,
            protection,
            orgasm,
            libido,
          }
        : undefined,
      symptoms,
      moods,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onSaveLog(newLog);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('¿Segura que deseas eliminar los datos registrados para este día?')) {
      onDeleteLog(selectedDate);
      onClose();
    }
  };

  if (!isOpen) return null;

  const existingCurrentDay = existingLogs.find(l => l.date === selectedDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-600 block">
              Registro Diario
            </span>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              {formatSpanishDate(selectedDate, { showDayOfWeek: true, showYear: true })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Date Selector Navigation Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleDateChange(addDays(selectedDate, -1))}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ← Día anterior
            </button>
            <button
              onClick={() => handleDateChange(todayStr)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedDate === todayStr
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => handleDateChange(addDays(selectedDate, 1))}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Día siguiente →
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={e => e.target.value && handleDateChange(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* SECTION 1: Sangrado / Flujo Menstrual */}
          <section className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Sangrado Menstrual</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['none', 'spotting', 'light', 'medium', 'heavy'] as FlowIntensity[]).map(val => {
                const info = SPANISH_FLOW_LABELS[val];
                const active = flow === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFlow(val)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-semibold">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: Temperatura Basal (TB) */}
          <section className="space-y-2 p-4 bg-rose-50/40 rounded-2xl border border-rose-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-600" />
                <span>Temperatura Basal Corporal (TB)</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Al despertar en reposo
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Temp Input & Buttons */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleBbtAdjust(-0.05)}
                  title="-0.05°C"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="number"
                  step="0.01"
                  min="35.0"
                  max="38.5"
                  value={bbt}
                  onChange={e => setBbt(e.target.value)}
                  placeholder="36.45"
                  className="w-20 text-center text-base font-bold font-mono text-slate-900 focus:outline-none"
                />

                <span className="text-xs font-bold text-slate-500 pr-1">°C</span>

                <button
                  type="button"
                  onClick={() => handleBbtAdjust(0.05)}
                  title="+0.05°C"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Measurement Time */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="time"
                  value={bbtTime}
                  onChange={e => setBbtTime(e.target.value)}
                  className="text-xs font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              {bbt && (
                <button
                  type="button"
                  onClick={() => setBbt('')}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Borrar temp.
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Registra 2 decimales para que el sistema trace la línea base y confirme el salto de ovulación.
            </p>
          </section>

          {/* SECTION 3: Moco Cervical (Fertilidad) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Moco Cervical</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-medium">Indicador de fertilidad</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['dry', 'sticky', 'creamy', 'egg_white', 'watery'] as CervicalMucus[]).map(val => {
                const info = SPANISH_MUCUS_LABELS[val];
                const active = mucus === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMucus(active ? '' : val)}
                    className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-semibold">{info.label}</span>
                    <span className={`block text-[10px] mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {info.fertility}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: Relaciones Sexuales & Protección */}
          <section className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Relaciones Sexuales</span>
              </label>
              <button
                type="button"
                onClick={() => setHadSex(!hadSex)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  hadSex ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hadSex ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {hadSex && (
              <div className="pt-2 space-y-3 border-t border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Tipo de protección utilizada:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(
                      [
                        'condom',
                        'none',
                        'pill',
                        'iud',
                        'withdrawal',
                        'emergency_pill',
                        'other',
                      ] as ProtectionType[]
                    ).map(pType => {
                      const active = protection.includes(pType);
                      const info = SPANISH_PROTECTION_LABELS[pType];
                      return (
                        <button
                          key={pType}
                          type="button"
                          onClick={() => toggleProtection(pType)}
                          className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                            active
                              ? pType === 'none'
                                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                                : 'bg-rose-100 border-rose-300 text-rose-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Shield className={`w-3 h-3 shrink-0 ${active ? 'text-current' : 'text-slate-400'}`} />
                          <span className="truncate">{info.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Libido & Orgasmo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Deseo / Libido:
                    </span>
                    <div className="flex gap-1.5">
                      {(['low', 'medium', 'high'] as const).map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLibido(libido === l ? undefined : l)}
                          className={`flex-1 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                            libido === l
                              ? 'bg-rose-500 text-white border-rose-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {l === 'low' ? 'Baja' : l === 'medium' ? 'Normal' : 'Alta'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      ¿Hubo orgasmo?
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOrgasm(orgasm === true ? undefined : true)}
                        className={`flex-1 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                          orgasm === true
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrgasm(orgasm === false ? undefined : false)}
                        className={`flex-1 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                          orgasm === false
                            ? 'bg-slate-700 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 5: Síntomas Físicos Diarios */}
          <section className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Síntomas Físicos (Calambres, Dolor de vientre, Pecho, etc.)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(SPANISH_SYMPTOM_LABELS) as SymptomType[]).map(type => {
                const info = SPANISH_SYMPTOM_LABELS[type];
                const isSelected = !!symptoms[type];
                const currentSeverity = symptoms[type] || 'moderate';

                return (
                  <div
                    key={type}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleSymptom(type)}
                        className="flex items-center gap-2 text-left cursor-pointer flex-1"
                      >
                        <span className="text-base">{info.icon}</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {info.name}
                        </span>
                      </button>

                      {isSelected && (
                        <div className="flex items-center gap-1 shrink-0">
                          {(['mild', 'moderate', 'severe'] as SymptomSeverity[]).map(sev => (
                            <button
                              key={sev}
                              type="button"
                              onClick={() => setSymptomSeverity(type, sev)}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer ${
                                currentSeverity === sev
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {sev === 'mild' ? 'L' : sev === 'moderate' ? 'M' : 'F'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 6: Nivel de Energía */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Nivel de Energía
              </label>
              <span className="text-[11px] text-slate-500">Correlacionado con las hormonas</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as EnergyLevel[]).map(lvl => {
                const info = SPANISH_ENERGY_LABELS[lvl];
                const active = energy === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergy(lvl)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{info.icon}</span>
                    <span className="font-bold">{info.label}</span>
                    <span className={`text-[10px] hidden sm:block ${active ? 'text-slate-300' : 'text-slate-400'}`}>
                      {info.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 7: Estado de Ánimo */}
          <section className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Estado de Ánimo (Selecciona uno o varios)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(SPANISH_MOOD_LABELS) as MoodType[]).map(m => {
                const info = SPANISH_MOOD_LABELS[m];
                const active = moods.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMood(m)}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      active
                        ? 'bg-rose-500 text-white border-rose-600 shadow-2xs font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{info.emoji}</span>
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 8: Notas Personales */}
          <section className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Notas Personales del Día
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anota cualquier sensación particular, medicamentos tomados o detalles para recordar..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
            />
          </section>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            {existingCurrentDay && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar registro</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
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
              <span>Guardar registro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
