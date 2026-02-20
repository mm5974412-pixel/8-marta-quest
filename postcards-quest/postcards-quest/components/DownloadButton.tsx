'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy } from 'lucide-react';

interface DownloadButtonProps {
  message: string;
}

export default function DownloadButton({
  message,
}: DownloadButtonProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fallback: window.print() for PDF export
      window.print();
    } catch (error) {
      console.error('Download error:', error);
    }
    setDownloading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {/* Copy Message Button */}
      <motion.button
        onClick={handleCopyMessage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        aria-label="Скопировать поздравление"
      >
        <Copy size={18} />
        {copied ? 'Скопировано! ✓' : 'Копировать'}
      </motion.button>

      {/* Download/Print Button */}
      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={downloading}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-all font-medium disabled:opacity-50"
        aria-label="Распечатать открытку"
      >
        <Download size={18} />
        {downloading ? 'Загрузка...' : 'Печать'}
      </motion.button>
    </div>
  );
}
