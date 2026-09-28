/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Settings,
  Shield,
  Download,
  Upload,
  Lock,
  RotateCcw,
  Check,
  AlertTriangle,
  EyeOff,
  Trash2,
  Sparkles
} from 'lucide-react';
import { UserSettings } from '../types/cycle';
import { exportBackup, importBackup, resetAllData, clearAllLogs, restoreDemoData, isDemoDataActive } from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onDataReload: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onDataReload,
}) => {
  const [cycleLength, setCycleLength] = useState<number>(settings.averageCycleLength);
  const [periodLength, setPeriodLength] = useState<number>(settings.averagePeriodLength);
  const [lutealPhase, setLutealPhase] = useState<number>(settings.lutealPhaseLength);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(settings.tempUnit);
  const [pinEnabled, setPinEnabled] = useState<boolean>(settings.pinEnabled);
  const [pinCode, setPinCode] = useState<string>(settings.pinCode);
  const [discreteMode, setDiscreteMode] = useState<boolean>(settings.discreteMode);

  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      averageCycleLength: Number(cycleLength),
      averagePeriodLength: Number(periodLength),
      lutealPhaseLength: Number(lutealPhase),
      tempUnit,
      pinEnabled,
      pinCode: pinCode.padEnd(4, '0').slice(0, 4),
      discreteMode,
    });
    onClose();
  };

  const handleExport = () => {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feminacycle_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      const res = importBackup(content);
      if (res.success) {
        setImportStatus(res.message);
        onDataReload();
      } else {
        setImportStatus(`Error: ${res.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleClearLogs = () => {
    if (window.confirm('¿Deseas borrar todos los registros y dejar la aplicación limpia para empezar tu propio ciclo?')) {
      clearAllLogs();
      onDataReload();
      onClose();
    }
  };

  const handleLoadDemo = () => {
    if (window.confirm('¿Deseas cargar datos de prueba para explorar los gráficos y predicciones de demostración?')) {
      restoreDemoData();
      onDataReload();
      onClose();
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Segura que deseas reiniciar todos los datos y restaurar la demostración limpia?')) {
      resetAllData();
      onDataReload();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Ajustes y Privacidad
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Section: Parámetros del Ciclo */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Parámetros del Ciclo Menstrual
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 flex justify-between">
                  <span>Duración habitual de tu ciclo</span>
                  <span className="font-bold text-rose-600">{cycleLength} días</span>
                </label>
                <input
                  type="range"
                  min="21"
                  max="40"
                  value={cycleLength}
                  onChange={e => setCycleLength(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer mt-1"
                />
                <span className="text-[11px] text-slate-400">
                  Días promedio desde el primer día de sangrado hasta la víspera de la siguiente regla (típico: 28 días).
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 flex justify-between">
                  <span>Duración de la regla (sangrado activo)</span>
                  <span className="font-bold text-rose-600">{periodLength} días</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={periodLength}
                  onChange={e => setPeriodLength(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 flex justify-between">
                  <span>Fase lútea (post-ovulatoria)</span>
                  <span className="font-bold text-rose-600">{lutealPhase} días</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="16"
                  value={lutealPhase}
                  onChange={e => setLutealPhase(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer mt-1"
                />
                <span className="text-[11px] text-slate-400">
                  Días entre la ovulación y la siguiente menstruación (biológicamente estándar en 14 días).
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Unidad de Temperatura:</span>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setTempUnit('C')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      tempUnit === 'C' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    °C (Celsius)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnit('F')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      tempUnit === 'F' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    °F (Fahrenheit)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Seguridad & Privacidad */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Seguridad & Privacidad de tus Datos</span>
            </h3>

            {/* PIN Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Bloqueo con Código PIN
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Solicita un código de 4 dígitos cada vez que se abra la app
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPinEnabled(!pinEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    pinEnabled ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pinEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {pinEnabled && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Código PIN (4 dígitos):</span>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinCode}
                    onChange={e => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-24 text-center font-mono font-bold tracking-widest bg-white border border-slate-300 rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            {/* Modo Discreto Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Modo Discreto
                </span>
                <span className="text-[11px] text-slate-500">
                  Oculta síntomas íntimos y notas si estás en lugares públicos
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDiscreteMode(!discreteMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  discreteMode ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    discreteMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section: Instalación en iPhone / Móvil */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Instalación en iPhone / Móvil
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Puedes instalar FeminaCycle directamente en tu iPhone como una App independiente sin pasar por la App Store o empaquetarla con Capacitor para Xcode.
            </p>
            <PWAInstallButton variant="settings" />
          </div>

          {/* Section: Copia de Seguridad */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Copias de Seguridad (Exportar / Importar)
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Toda tu información está almacenada localmente en tu navegador. Puedes guardar una copia segura en tu ordenador o transferirla a otro dispositivo.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Descargar copia JSON</span>
              </button>

              <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Restaurar copia JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                {importStatus}
              </p>
            )}
          </div>

          {/* Section: Peligro / Reset */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Gestión de Datos y Reinicio
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleClearLogs}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Borrar todos los registros (Empezar de cero)</span>
              </button>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Cargar datos de demostración</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleResetData}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer toda la configuración y datos de fábrica</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
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
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
