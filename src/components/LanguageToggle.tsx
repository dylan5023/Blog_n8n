'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
      className="relative inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 hover:border-blue-400 transition-all duration-200"
      aria-label="언어 전환"
    >
      <span className={`text-sm font-medium transition-colors ${language === 'ko' ? 'text-blue-600' : 'text-gray-400'}`}>
        한
      </span>
      <div className="relative w-10 h-5 bg-gray-200 rounded-full transition-colors">
        <div 
          className={`absolute top-0.5 w-4 h-4 bg-blue-500 rounded-full transition-transform duration-200 ${
            language === 'en' ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>
      <span className={`text-sm font-medium transition-colors ${language === 'en' ? 'text-blue-600' : 'text-gray-400'}`}>
        EN
      </span>
    </button>
  );
}
