'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEME_REACTIONS } from '@/lib/memes';

interface StickerReactionsProps {
  mode: string;
  show: boolean;
}

export default function StickerReactions({ mode, show }: StickerReactionsProps) {
  if (mode !== 'cute_meme' || !show) return null;

  const [activeReaction, setActiveReaction] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-wrap gap-2 justify-center mt-6"
    >
      {MEME_REACTIONS.slice(0, 4).map((reaction, idx) => (
        <motion.button
          key={idx}
          onClick={() => {
            setActiveReaction(idx);
            setTimeout(() => setActiveReaction(null), 1500);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="text-3xl sm:text-4xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 rounded-full p-2"
          aria-label={reaction.text}
        >
          {reaction.emoji}
        </motion.button>
      ))}

      {/* Reaction Popup */}
      <AnimatePresence>
        {activeReaction !== null && (
          <motion.div
            key={`reaction-${activeReaction}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-800 whitespace-nowrap">
              {MEME_REACTIONS[activeReaction].text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
