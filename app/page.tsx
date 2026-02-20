import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl text-center space-y-8">
          {/* Animated Title */}
          <div className="space-y-4">
            <div className="text-5xl sm:text-7xl font-bold space-y-2">
              <span className="block text-pink-600">Открытка</span>
              <span className="block text-purple-600">Квест</span>
              <span className="block text-gray-700 text-4xl sm:text-6xl">к 8 марта</span>
            </div>
            <p className="text-2xl text-yellow-500 animate-pulse">🌸 💖 ✨</p>
          </div>

          {/* Description */}
          <div className="space-y-3 text-gray-700">
            <p className="text-lg sm:text-xl">
              📝 Создай персональную открытку с поздравлением и комплиментами
            </p>
            <p className="text-lg sm:text-xl">
              🎮 Отправь ссылку и получатель пройдёт мини-квест из 3 заданий
            </p>
            <p className="text-lg sm:text-xl">
              🎁 После квеста её ждёт поздравление и букет комплиментов
            </p>
          </div>

          {/* Emoji Showcase */}
          <div className="text-4xl sm:text-5xl flex justify-center gap-4 flex-wrap">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>
              🌷
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              💐
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
              🌹
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>
              🌺
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>
              🌻
            </span>
          </div>

          {/* CTA Button */}
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg sm:text-xl font-bold rounded-full hover:shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            Создать открытку
            <span className="text-2xl">💌</span>
          </Link>

          {/* Secondary CTA */}
          <p className="text-sm text-gray-600">
            Уже есть ссылка?{' '}
            <span className="text-gray-400">
              (вставь её в адресную строку или получишь её автоматически)
            </span>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
