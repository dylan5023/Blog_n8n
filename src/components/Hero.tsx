'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog';
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Welcome to my blog';
  const { t } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-blue-50/40 via-white to-amber-50/40">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {siteName}
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
            {siteDescription}
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#posts"
              className="inline-flex items-center px-6 py-3 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t('포스트 둘러보기', 'Explore Posts')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
    </div>
  );
}
