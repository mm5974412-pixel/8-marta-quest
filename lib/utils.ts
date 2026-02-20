export const generateQuizSeed = (): number => {
  return Math.floor(Math.random() * 10000);
};

export const getQuizAnswerByIndex = (seed: number, optionCount: number): number => {
  const rng = Math.sin(seed) * 10000;
  return Math.floor((rng - Math.floor(rng)) * optionCount);
};

export const hashSecretWord = (word: string): string => {
  // Simple hash for secret word verification
  return word.toLowerCase().trim();
};

export const validateCompliments = (compliments: string[]): boolean => {
  return Array.isArray(compliments) && compliments.length === 8 && compliments.every(c => typeof c === 'string' && c.trim().length > 0);
};

export const validateMessage = (message: string): boolean => {
  return typeof message === 'string' && message.trim().length > 0;
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getThemeColors = (theme: string) => {
  const themes: Record<string, { bg: string; primary: string; secondary: string; accent: string }> = {
    pastel: {
      bg: 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100',
      primary: 'from-pink-400 to-purple-400',
      secondary: 'bg-white/80',
      accent: 'text-purple-600',
    },
    cats: {
      bg: 'bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100',
      primary: 'from-orange-400 to-pink-400',
      secondary: 'bg-white/90',
      accent: 'text-orange-600',
    },
    corporate: {
      bg: 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50',
      primary: 'from-green-400 to-blue-400',
      secondary: 'bg-gray-50/90',
      accent: 'text-blue-700',
    },
    'meme-lite': {
      bg: 'bg-gradient-to-br from-lime-100 via-cyan-100 to-fuchsia-100',
      primary: 'from-lime-400 to-fuchsia-400',
      secondary: 'bg-white/95',
      accent: 'text-fuchsia-600',
    },
  };
  return themes[theme] || themes.pastel;
};
