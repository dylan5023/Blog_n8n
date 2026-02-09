'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BlogPost } from '@/types/notion';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const { t } = useLanguage();

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-10">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-600 rounded-full border border-blue-100">
            {post.category}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={post.publishedDate}>
            {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
          </time>
        </div>
        {post.summary && (
          <p className="mt-6 text-xl text-gray-600 leading-relaxed border-l-4 border-blue-400 pl-6 py-3 bg-amber-50/50 rounded-r">
            {post.summary}
          </p>
        )}
      </header>

      {/* Thumbnail */}
      {post.thumbnailUrl && (
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            code(props) {
              const { children, className } = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus as Record<string, React.CSSProperties>}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content || ''}
        </ReactMarkdown>
      </div>

      {/* Back to home link */}
      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group transition-colors"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('모든 포스트 보기', 'View all posts')}
        </Link>
      </div>
    </article>
  );
}
