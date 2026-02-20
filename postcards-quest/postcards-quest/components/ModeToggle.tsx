'use client';

import { Mode } from '@/lib/types';

interface ModeToggleProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">Стиль открытки</label>
      <div className="flex gap-3">
        <button
          onClick={() => onChange('cute')}
          className={`flex-1 py-3 px-4 rounded-lg transition-all border-2 font-medium ${
            value === 'cute'
              ? 'border-pink-500 bg-pink-50 text-pink-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
          }`}
          aria-label="Мило"
        >
          💕 Мило
        </button>
        <button
          onClick={() => onChange('cute_meme')}
          className={`flex-1 py-3 px-4 rounded-lg transition-all border-2 font-medium ${
            value === 'cute_meme'
              ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-fuchsia-300'
          }`}
          aria-label="Мило с мемами"
        >
          😹 Мило+Мемы
        </button>
      </div>
    </div>
  );
}
