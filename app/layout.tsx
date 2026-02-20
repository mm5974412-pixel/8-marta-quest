import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Открытка-Квест на 8 марта 🌸',
  description: 'Создай персональную открытку с мини-квестом для любимой!',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
