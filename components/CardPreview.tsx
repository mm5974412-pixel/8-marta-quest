'use client';

import { Theme, Mode } from '@/lib/types';
import { getThemeColors } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardPreviewProps {
  senderName?: string;
  recipientName?: string;
  message: string;
  compliments: string[];
  theme: Theme;
  mode: Mode;
}

export default function CardPreview({
  senderName,
  recipientName,
  message,
  compliments,
  theme,
  mode,
}: CardPreviewProps) {
  const colors = getThemeColors(theme);

  return (
    <div className="rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg">
      {/* Preview Card */}
      <div
        className={`${colors.bg} p-6 sm:p-10 min-h-96 flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          {recipientName && (
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800"
            >
              {recipientName}! 🎉
            </motion.h2>
          )}
          {senderName && (
            <p className="text-xs sm:text-sm text-gray-600 italic">От: {senderName}</p>
          )}
        </div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`${colors.secondary} rounded-lg p-4 sm:p-6 text-center backdrop-blur`}
        >
          <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap break-words">
            {message}
          </p>
        </motion.div>

        {/* Compliments Preview (Petals) */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {compliments.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="text-2xl opacity-70"
            >
              🌸
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          {mode === 'cute_meme' && (
            <p className="text-xs text-gray-600 italic">✨ с мемами ✨</p>
          )}
        </div>
      </div>
    </div>
  );
}
