/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Download, Apple } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { IPhoneInstallModal } from './IPhoneInstallModal';

interface PWAInstallButtonProps {
  variant?: 'topbar' | 'settings' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'topbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running in standalone mode on mobile / installed, we don't need the prompt button
  if (isInstalled && variant === 'topbar') {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === 'settings') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full px-3.5 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 text-rose-900 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-rose-600" />
            <div className="text-left">
              <span className="block font-bold">Instalar en iPhone</span>
              <span className="text-[10px] text-rose-700/80">
                Añadir a la pantalla de inicio en 4 pasos
              </span>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 bg-white text-rose-600 font-bold rounded-lg border border-rose-200">
            Ver guía
          </span>
        </button>

        <IPhoneInstallModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        title="Instalar en iPhone o dispositivo móvil"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/80 hover:bg-rose-100/80 text-rose-800 text-xs font-semibold transition-colors cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5 text-rose-600" />
        <span className="hidden sm:inline">Instalar en iPhone</span>
      </button>

      <IPhoneInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
