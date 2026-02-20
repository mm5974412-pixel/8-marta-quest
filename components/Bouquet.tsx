'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface BouquetProps {
  compliments: string[];
}

export default function Bouquet({ compliments }: BouquetProps) {
  const [openedPetals, setOpenedPetals] = useState<Set<number>>(new Set());

  const togglePetal = (idx: number) => {
    const newSet = new Set(openedPetals);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setOpenedPetals(newSet);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl text-center font-bold text-purple-700">
        Букет комплиментов 🌹
      </h3>

      {/* Animated Bouquet */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {compliments.map((compliment, idx) => (
          <motion.button
            key={idx}
            onClick={() => togglePetal(idx)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative h-32 sm:h-40 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full"
            aria-label={`Лепесток ${idx + 1}: ${compliment}`}
          >
            {/* Petal Flower */}
            <div className={`
              absolute inset-0 rounded-full transition-all duration-500
              bg-gradient-to-br flex items-center justify-center text-center p-3
              text-xs sm:text-sm font-semibold text-white cursor-pointer
              shadow-lg border-2
              ${
                openedPetals.has(idx)
                  ? 'from-pink-400 to-purple-500 border-purple-600'
                  : 'from-pink-300 to-pink-400 border-pink-400 hover:from-pink-400 hover:to-purple-400'
              }
            `}>
              <span className="text-xs sm:text-sm leading-tight break-words line-clamp-4">
                {openedPetals.has(idx) ? compliment : '🌸'}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1">
        {compliments.map((_, idx) => (
          <motion.div
            key={idx}
            animate={
              openedPetals.has(idx)
                ? { scale: 1.2 }
                : { scale: 1 }
            }
            className={`w-2 h-2 rounded-full transition-colors ${
              openedPetals.has(idx) ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
