/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Delete, ShieldCheck, Sparkles } from 'lucide-react';

interface PinLockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ correctPin, onUnlock }) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setError(false);

      if (next.length === 4) {
        if (next === correctPin) {
          setTimeout(() => {
            onUnlock();
          }, 150);
        } else {
          setTimeout(() => {
            setError(true);
            setEnteredPin('');
          }, 200);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(enteredPin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-rose-50/90 via-white to-pink-50/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-rose-100 shadow-xl p-6 sm:p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-500/20">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">
            FeminaCycle Protegido
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Introduce tu código PIN de 4 dígitos para acceder a tus datos privados
          </p>
        </div>

        {/* 4 PIN Dots */}
        <div className="flex items-center justify-center gap-4 py-2">
          {Array.from({ length: 4 }).map((_, idx) => {
            const isFilled = idx < enteredPin.length;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 animate-shake'
                    : isFilled
                    ? 'bg-rose-600 scale-110'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 animate-fade-in">
            Código PIN incorrecto. Inténtalo de nuevo.
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 active:scale-95 text-lg font-bold font-mono text-slate-800 transition-all cursor-pointer flex items-center justify-center border border-slate-100"
            >
              {num}
            </button>
          ))}

          <div className="h-14" />

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 active:scale-95 text-lg font-bold font-mono text-slate-800 transition-all cursor-pointer flex items-center justify-center border border-slate-100"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label="Borrar dígito"
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-500 hover:text-slate-800 transition-all cursor-pointer flex items-center justify-center border border-slate-100"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tus datos se guardan exclusivamente en tu dispositivo</span>
        </div>
      </div>
    </div>
  );
};
