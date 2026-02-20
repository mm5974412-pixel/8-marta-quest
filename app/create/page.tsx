'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ThemePicker from '@/components/ThemePicker';
import ModeToggle from '@/components/ModeToggle';
import CardPreview from '@/components/CardPreview';
import { Theme, Mode } from '@/lib/types';
import { generateQuizSeed, validateCompliments, validateMessage, cn } from '@/lib/utils';
import { selectRandomCompliments } from '@/lib/compliments';
import { createPostcard } from '@/lib/supabaseClient';
import Footer from '@/components/Footer';

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [compliments, setCompliments] = useState<string[]>(() =>
    selectRandomCompliments(8, generateQuizSeed())
  );
  const [theme, setTheme] = useState<Theme>('pastel');
  const [mode, setMode] = useState<Mode>('cute');
  const [secretWord, setSecretWord] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Validate form
  const isFormValid =
    validateMessage(message) &&
    validateCompliments(compliments);

  // Handle compliment edit
  const handleComplimentChange = (idx: number, value: string) => {
    const newCompliments = [...compliments];
    newCompliments[idx] = value;
    setCompliments(newCompliments);
  };

  // Regenerate compliments
  const regenerateCompliments = () => {
    const seed = generateQuizSeed();
    setCompliments(selectRandomCompliments(8, seed));
  };

  // Create postcard
  const handleCreate = async () => {
    if (!isFormValid) {
      setError('Заполни основное поздравление и все 8 комплиментов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const quizSeed = generateQuizSeed();
      const newPostcard = await createPostcard({
        sender_name: senderName || null,
        recipient_name: recipientName || null,
        message: message.trim(),
        compliments,
        theme,
        mode,
        quiz_seed: quizSeed,
        secret_word: secretWord || null,
      });

      // Redirect to card view
      router.push(`/card/${newPostcard.id}`);
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании открытки');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-800"
        >
          Создай открытку 💌
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-800 font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Names */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  От кого (опционально)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Твоё имя"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Кому (опционально)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Имя получателя"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                  maxLength={50}
                />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Основное поздравление *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напиши сердечное поздравление..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors resize-none h-28"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500">{message.length}/1000</p>
            </div>

            {/* Compliments (8 Petals) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">
                  8 комплиментов (лепестков) *
                </label>
                <button
                  onClick={regenerateCompliments}
                  className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                  aria-label="Сгенерировать новые комплименты"
                >
                  🔄 Новые
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {compliments.map((comp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <input
                      type="text"
                      value={comp}
                      onChange={(e) => handleComplimentChange(idx, e.target.value)}
                      className="w-full px-3 py-2 text-sm border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 transition-colors"
                      maxLength={100}
                      placeholder={`Комплимент ${idx + 1}`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Theme Picker */}
            <ThemePicker value={theme} onChange={setTheme} />

            {/* Mode Toggle */}
            <ModeToggle value={mode} onChange={setMode} />

            {/* Secret Word */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                🔐 Секретное слово (пасхалка, опционально)
              </label>
              <input
                type="text"
                value={secretWord}
                onChange={(e) => setSecretWord(e.target.value)}
                placeholder="Например: весна"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                maxLength={30}
              />
            </div>

            {/* Buttons */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 border-2 border-purple-400 text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {showPreview ? '✓ Скрыть' : '👁️ Предпросмотр'}
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !isFormValid}
                className={cn(
                  'px-6 py-3 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 disabled:opacity-50',
                  isFormValid
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                {loading ? '⏳ Создаю...' : '🎁 Создать'}
              </button>
            </div>
          </motion.div>

          {/* Preview Section */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <CardPreview
                senderName={senderName}
                recipientName={recipientName}
                message={message}
                compliments={compliments}
                theme={theme}
                mode={mode}
              />
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
