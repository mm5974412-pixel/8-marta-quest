'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { getPostcard } from '@/lib/supabaseClient';
import { getThemeColors, hashSecretWord } from '@/lib/utils';
import { SECRET_WORD } from '@/lib/memes';

import QuestFlow from '@/components/QuestFlow';
import Bouquet from '@/components/Bouquet';
import StickerReactions from '@/components/StickerReactions';
import DownloadButton from '@/components/DownloadButton';
import Confetti from '@/components/Confetti';
import LoadingSpinner from '@/components/LoadingSpinner';
import Footer from '@/components/Footer';

type pageState = 'loading' | 'hero' | 'quest' | 'reveal' | 'secret' | 'notfound';

export default function CardPage() {
  const params = useParams();
  const cardId = params.id as string;

  const [pageState, setPageState] = useState<pageState>('loading');
  const [postcard, setPostcard] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [error, setError] = useState('');

  // Load postcard
  useEffect(() => {
    const loadPostcard = async () => {
      try {
        if (!cardId) {
          setPageState('notfound');
          return;
        }

        const data = await getPostcard(cardId);
        setPostcard(data);
        setPageState('hero');
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки открытки');
        setPageState('notfound');
      }
    };

    loadPostcard();
  }, [cardId]);

  const handleQuestComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setPageState('reveal');
  };

  const handleSecretSubmit = () => {
    if (hashSecretWord(secretInput) === hashSecretWord(SECRET_WORD)) {
      setSecretUnlocked(true);
      setPageState('secret');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const colors = postcard ? getThemeColors(postcard.theme) : getThemeColors('pastel');

  if (pageState === 'loading') {
    return <LoadingSpinner message="🌸 Открываю открытку..." />;
  }

  if (pageState === 'notfound') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 space-y-4">
        <div className="text-6xl">😕</div>
        <h1 className="text-3xl font-bold text-gray-800">Открытка не найдена</h1>
        <p className="text-gray-600">{error || 'Проверь ссылку и попробуй снова'}</p>
        <a
          href="/"
          className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
        >
          ← На главную
        </a>
      </main>
    );
  }

  if (!postcard) return <LoadingSpinner />;

  return (
    <main className={`min-h-screen ${colors.bg} transition-colors`}>
      <Confetti trigger={showConfetti} />

      <AnimatePresence mode="wait">
        {/* Hero Screen */}
        {pageState === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-4 py-12"
          >
            <div className="text-center space-y-8 max-w-2xl">
              {/* Animated Flowers */}
              <motion.div className="text-6xl sm:text-8xl space-y-2">
                <motion.span
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mx-2"
                >
                  🌸
                </motion.span>
                <motion.span
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  className="inline-block mx-2"
                >
                  💐
                </motion.span>
                <motion.span
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  className="inline-block mx-2"
                >
                  🌹
                </motion.span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl font-bold text-gray-800"
              >
                {postcard.recipient_name
                  ? `${postcard.recipient_name}! 🎉`
                  : 'Открытка для тебя! 🎉'}
              </motion.h1>

              {/* From Text */}
              {postcard.sender_name && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-gray-700 italic"
                >
                  От: <span className="font-semibold">{postcard.sender_name}</span>
                </motion.p>
              )}

              {/* Quest CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <p className="text-xl text-gray-700 font-semibold">
                  Но сначала— пройди мини-квест! 🎮
                </p>
                <motion.button
                  onClick={() => setPageState('quest')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold rounded-full hover:shadow-lg transition-all"
                  aria-label="Начать квест"
                >
                  Начать! ⚡
                </motion.button>
              </motion.div>

              {/* Secret Hint */}
              {postcard.secret_word && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-xs text-gray-600 italic"
                >
                  💡 Подсказка: в конце есть секрет...
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Quest Section */}
        {pageState === 'quest' && (
          <motion.div
            key="quest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-4 py-12"
          >
            <div className="w-full max-w-2xl">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Квест из 3 заданий ✨
              </motion.h2>
              <QuestFlow seed={postcard.quiz_seed} onComplete={handleQuestComplete} />
            </div>
          </motion.div>
        )}

        {/* Reveal Section */}
        {pageState === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center px-4 py-12"
          >
            <div className="w-full max-w-4xl space-y-8">
              {/* Main Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`${colors.secondary} rounded-2xl p-6 sm:p-10 backdrop-blur text-center shadow-xl border-2 border-white/20`}
              >
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">
                  Поздравление! 💝
                </h2>
                <p className="text-gray-700 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap break-words">
                  {postcard.message}
                </p>
              </motion.div>

              {/* Bouquet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Bouquet compliments={postcard.compliments} />
              </motion.div>

              {/* Reactions */}
              {postcard.mode === 'cute_meme' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <StickerReactions mode={postcard.mode} show={true} />
                </motion.div>
              )}

              {/* Download & Secret */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-6"
              >
                <DownloadButton
                  message={postcard.message}
                />

                {/* Secret Word Input */}
                {postcard.secret_word && !secretUnlocked && (
                  <div className="text-center space-y-3 pt-6 border-t-2 border-white/30">
                    <p className="text-sm text-gray-600">
                      Знаешь секретное слово? 🔐
                    </p>
                    <div className="flex gap-2 max-w-sm mx-auto">
                      <input
                        type="text"
                        value={secretInput}
                        onChange={(e) => setSecretInput(e.target.value)}
                        placeholder="Введи слово..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSecretSubmit()}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                        maxLength={30}
                      />
                      <button
                        onClick={handleSecretSubmit}
                        className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors text-sm"
                        aria-label="Проверить секретное слово"
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Secret Unlocked */}
        {pageState === 'secret' && (
          <motion.div
            key="secret"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4 py-12 text-center space-y-6"
          >
            <div className="space-y-8 max-w-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'loop' }}
                className="text-8xl inline-block"
              >
                🔓
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-bold text-purple-700"
              >
                Секрет разгадан! 🌟
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`${colors.secondary} rounded-2xl p-8 space-y-4 shadow-xl`}
              >
                <p className="text-2xl font-bold text-gray-800">
                  Ты добрая! 💖
                </p>
                <p className="text-lg text-gray-700">
                  Это самый мемный экран в приложении, потому что ты нашла пароль 😹
                </p>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl"
                >
                  ✨
                </motion.div>
              </motion.div>

              <motion.button
                onClick={() => setPageState('reveal')}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg"
              >
                ← Вернуться
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
