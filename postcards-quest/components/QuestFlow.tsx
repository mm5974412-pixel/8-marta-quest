'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SPRING_OPTIONS, MOOD_QUIZ } from '@/lib/memes';
import { getQuizAnswerByIndex } from '@/lib/utils';

interface QuestFlowProps {
  seed: number;
  onComplete: () => void;
}

type TaskType = 'spring' | 'mood' | 'clicks';

export default function QuestFlow({ seed, onComplete }: QuestFlowProps) {
  const [currentTask, setCurrentTask] = useState<TaskType>('spring');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [clicks, setClicks] = useState(0);

  // Predetermine correct answers based on seed
  const correctMood = getQuizAnswerByIndex(seed, 4);
  const springOption = SPRING_OPTIONS[0];

  const handleSpringAnswer = (option: string) => {
    setSelectedAnswer(option);
    if (option === springOption.correct) {
      setTimeout(() => {
        setCurrentTask('mood');
        setSelectedAnswer(null);
      }, 500);
    }
  };

  const handleMoodAnswer = (idx: number) => {
    setSelectedAnswer(String(idx));
    if (idx === correctMood) {
      setTimeout(() => {
        setCurrentTask('clicks');
        setSelectedAnswer(null);
        setClicks(0);
      }, 500);
    }
  };

  const handleHeartClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= 8) {
      if (newClicks >= 8) {
        onComplete();
      }
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {currentTask === 'spring' && (
          <motion.div
            key="spring"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-center text-gray-800">
              {springOption.label}
            </h3>
            <div className="flex justify-around items-center gap-2">
              {springOption.images.map((img, idx) => (
                <motion.span
                  key={idx}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                  className="text-4xl"
                >
                  {img}
                </motion.span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {springOption.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSpringAnswer(option)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                    selectedAnswer === option
                      ? 'bg-green-400 text-white'
                      : option === springOption.correct
                        ? 'bg-red-400 text-white'
                        : 'bg-white border-2 border-purple-300 text-gray-700 hover:border-purple-500'
                  }`}
                  aria-label={option}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {currentTask === 'mood' && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-center text-gray-800">
              {MOOD_QUIZ.question}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {MOOD_QUIZ.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleMoodAnswer(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-3 px-2 rounded-lg font-medium transition-all text-sm ${
                    selectedAnswer === String(idx)
                      ? 'bg-green-400 text-white'
                      : idx === correctMood
                        ? 'bg-red-400 text-white'
                        : 'bg-white border-2 border-pink-300 text-gray-700 hover:border-pink-500'
                  }`}
                  aria-label={option}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {currentTask === 'clicks' && (
          <motion.div
            key="clicks"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="space-y-4 text-center"
          >
            <h3 className="text-lg font-bold text-gray-800">
              Нажми на сердечко 8 раз! ❤️
            </h3>
            <div className="flex justify-center">
              <motion.button
                onClick={handleHeartClick}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                className="text-7xl focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-4"
                aria-label={`Нажми на сердечко, осталось ${8 - clicks} раз`}
              >
                ❤️
              </motion.button>
            </div>
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  animate={
                    idx < clicks
                      ? { scale: [1, 1.2, 1], opacity: 1 }
                      : { opacity: 0.3 }
                  }
                  className="w-2 h-2 rounded-full bg-red-400"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {clicks} / 8
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
