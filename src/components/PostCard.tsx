'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/notion';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const { t } = useLanguage();
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-blue-50 via-amber-50/50 to-orange-50">
        {post.thumbnailUrl ? (
          <>
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg 
                className="w-16 h-16 mx-auto text-blue-300 group-hover:scale-110 transition-transform duration-500"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
            {post.category}
          </span>
          <time className="text-sm text-gray-500 font-medium" dateTime={post.publishedDate}>
            {formatDate(post.publishedDate)}
          </time>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h2>
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {post.summary}
        </p>
        <div className="mt-4 flex items-center text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {t('더 읽기', 'Read more')}
          <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
