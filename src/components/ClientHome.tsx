'use client';

import { BlogPost } from '@/types/notion';
import { useLanguage } from '@/contexts/LanguageContext';
import BlogGrid from './BlogGrid';

interface ClientHomeProps {
  posts: BlogPost[];
}

export default function ClientHome({ posts }: ClientHomeProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-6 opacity-50">📝</div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">
            {t('아직 포스트가 없습니다', 'No posts yet')}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('곧 새로운 콘텐츠가 올라올 예정입니다!', 'Check back later for new content!')}
          </p>
        </div>
      ) : (
        <BlogGrid posts={posts} />
      )}
    </div>
  );
}
