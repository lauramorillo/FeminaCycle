/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Share2,
  PlusSquare,
  CheckCircle2,
  Copy,
  Check,
  Apple,
  Globe
} from 'lucide-react';

interface IPhoneInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IPhoneInstallModal: React.FC<IPhoneInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-100 overflow-hidden my-auto max-h-[92vh] flex flex-col relative z-[101]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Apple className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900 leading-tight">
                Instalar en iPhone
              </h2>
              <p className="text-xs text-slate-500">
                Añade FeminaCycle a tu pantalla de inicio en 4 pasos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Pasos claros para la usuaria */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-600" />
                <span>Abre este enlace en Safari</span>
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                En tu iPhone, asegúrate de estar utilizando el navegador <strong>Safari</strong> (Apple únicamente permite instalar aplicaciones desde Safari).
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">¡Enlace copiado! Pégalo en Safari</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar enlace para abrirlo en Safari</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1 flex-1">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Toca el botón Compartir</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-300">
                  <Share2 className="w-3 h-3 inline mr-1 text-sky-600" /> Compartir
                </span>
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                En la barra inferior de Safari, pulsa el icono de compartir (el cuadrado con una flecha vertical hacia arriba <strong>↑</strong>).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1 flex-1">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Selecciona «Añadir a la pantalla de inicio»</span>
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                En el menú que se despliega, desliza hacia abajo y pulsa en la opción <span className="inline-flex items-center gap-1 font-semibold text-slate-800"><PlusSquare className="w-3.5 h-3.5 text-rose-600 inline" /> «Añadir a la pantalla de inicio»</span>.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </div>
            <div className="space-y-1 flex-1">
              <p className="text-xs font-bold text-slate-900">
                Pulsa «Añadir» para confirmar
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verás el icono y nombre de <strong>FeminaCycle</strong>. Pulsa en <strong>«Añadir»</strong> (arriba a la derecha).
              </p>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>¡Listo!</strong> Ya tendrás el icono de FeminaCycle en la pantalla de inicio de tu iPhone, lista para abrir a pantalla completa.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
