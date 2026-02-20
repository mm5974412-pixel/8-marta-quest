'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Загрузка...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
        className="text-6xl"
      >
        🌸
      </motion.div>
      <p className="text-lg text-gray-600 font-medium">{message}</p>
    </div>
  );
}
