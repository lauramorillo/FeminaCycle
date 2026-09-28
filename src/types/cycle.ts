/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export type SymptomType =
  | 'cramps'            // Calambres / cólicos
  | 'pelvic_pain'       // Dolor en el vientre / pelvis
  | 'back_pain'         // Dolor en la espalda
  | 'breast_tenderness' // Dolor de pecho / mamas sensibles
  | 'headache'          // Dolor de cabeza / migraña
  | 'bloating'          // Hinchazón abdominal
  | 'fatigue'           // Fatiga / cansancio
  | 'acne'              // Acné / brotes
  | 'nausea'            // Náuseas
  | 'ovulation_pain';   // Dolor de ovulación (pinchazo)

export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export type CervicalMucus =
  | 'dry'        // Seco / Sin flujo
  | 'sticky'     // Pegajoso (poco fértil)
  | 'creamy'     // Cremoso / lechoso
  | 'egg_white'  // Clara de huevo (máxima fertilidad, elástico)
  | 'watery';    // Acuoso / fluido

export type MoodType =
  | 'happy'       // Feliz
  | 'calm'        // Tranquila
  | 'energetic'   // Enérgica / motivada
  | 'sensitive'   // Sensible
  | 'irritable'   // Irritable
  | 'anxious'     // Ansiosa
  | 'sad'         // Triste / decaída
  | 'overwhelmed'; // Abrumada / estresada

export type EnergyLevel = 'high' | 'medium' | 'low';

export type ProtectionType =
  | 'condom'         // Con preservativo / condón
  | 'none'           // Sin protección
  | 'pill'           // Píldora anticonceptiva
  | 'iud'            // DIU
  | 'withdrawal'     // Marcha atrás
  | 'emergency_pill' // Píldora del día después
  | 'other';         // Otro método

export type LibidoLevel = 'low' | 'medium' | 'high';

export interface SexRecord {
  hadSex: boolean;
  protection: ProtectionType[];
  orgasm?: boolean;
  libido?: LibidoLevel;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  flow: FlowIntensity;
  symptoms: Partial<Record<SymptomType, SymptomSeverity>>;
  bbt?: number; // In Celsius, e.g. 36.45
  bbtTime?: string; // HH:mm
  mucus?: CervicalMucus;
  energy?: EnergyLevel;
  moods: MoodType[];
  sex?: SexRecord;
  notes?: string;
  updatedAt: string;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type FertilityLevel = 'low' | 'medium' | 'high' | 'peak';

export interface DayPrediction {
  date: string;
  isPeriod: boolean;
  isPredictedPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  fertilityLevel: FertilityLevel;
  cycleDay?: number;
  phase: CyclePhase;
}

export interface CycleSummary {
  cycleNumber: number;
  startDate: string;
  endDate?: string;
  lengthDays: number;
  periodDays: number;
  ovulationDate?: string;
  isCurrent: boolean;
}

export interface ReminderItem {
  id: string;
  type: 'bbt' | 'symptoms' | 'sex' | 'fertile_window' | 'period_soon';
  title: string;
  description: string;
  enabled: boolean;
  time: string; // HH:mm
  daysBefore?: number; // e.g. 1 or 2 days before event
  message: string;
}

export interface UserSettings {
  averageCycleLength: number; // e.g. 28 days
  averagePeriodLength: number; // e.g. 5 days
  lutealPhaseLength: number; // e.g. 14 days
  tempUnit: 'C' | 'F';
  pinEnabled: boolean;
  pinCode: string;
  discreteMode: boolean; // Masks sensitive data for public viewing
  reminders: ReminderItem[];
}
