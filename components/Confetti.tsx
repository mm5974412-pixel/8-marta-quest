'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 1, x: `${piece.x}%`, y: `${piece.y}%`, rotate: 0 }}
          animate={{
            opacity: 0,
            x: `${piece.x + (Math.random() - 0.5) * 30}%`,
            y: '110%',
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="fixed pointer-events-none text-2xl"
        >
          {['🌸', '💖', '✨', '🎉', '💐'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </>
  );
}
