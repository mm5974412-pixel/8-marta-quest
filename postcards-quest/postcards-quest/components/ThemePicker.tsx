'use client';

import { Theme } from '@/lib/types';

interface ThemePickerProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

const themes: { value: Theme; label: string; emoji: string }[] = [
  { value: 'pastel', label: 'Пастель', emoji: '🌸' },
  { value: 'cats', label: 'Киськи', emoji: '😺' },
  { value: 'corporate', label: 'Минимал', emoji: '✨' },
  { value: 'meme-lite', label: 'Мемас', emoji: '😹' },
];

export default function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">Выбери тему</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onChange(theme.value)}
            className={`p-3 rounded-lg transition-all border-2 ${
              value === theme.value
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-400'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
            aria-label={`Выбрать тему ${theme.label}`}
          >
            <div className="text-2xl mb-1">{theme.emoji}</div>
            <div className="text-xs font-medium text-gray-700">{theme.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
