'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog';

  return (
    <footer className="border-t border-amber-100 mt-auto bg-gradient-to-b from-white/50 to-amber-50/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Next.js
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://notion.so"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Notion
              </a>
            </div>
            <p className="text-sm text-gray-500">
              © {currentYear} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
