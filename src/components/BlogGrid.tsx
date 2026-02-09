'use client';

import { useState, useMemo } from 'react';
import PostCard from './PostCard';
import { BlogPost } from '@/types/notion';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { t } = useLanguage();

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category));
    return ['all', ...Array.from(cats)];
  }, [posts]);

  // Filter posts by date
  const filterByDate = (post: BlogPost) => {
    const postDate = parseISO(post.publishedDate);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return format(postDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return isAfter(postDate, weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return isAfter(postDate, monthAgo);
      case 'custom':
        if (startDate && endDate) {
          const start = startOfDay(parseISO(startDate));
          const end = endOfDay(parseISO(endDate));
          return isAfter(postDate, start) && isBefore(postDate, end);
        }
        if (startDate) {
          const start = startOfDay(parseISO(startDate));
          return isAfter(postDate, start);
        }
        if (endDate) {
          const end = endOfDay(parseISO(endDate));
          return isBefore(postDate, end);
        }
        return true;
      default:
        return true;
    }
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = filterByDate(post);
      return matchesCategory && matchesSearch && matchesDate;
    });
  }, [posts, selectedCategory, searchQuery, dateFilter, startDate, endDate]);

  return (
    <div id="posts">
      {/* Search and Filter Section */}
      <div className="mb-12 space-y-6">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder={t('포스트 검색...', 'Search posts...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {(['all', 'today', 'week', 'month', 'custom'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                dateFilter === filter
                  ? 'bg-purple-500 text-white shadow-md scale-105'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {filter === 'all' && t('전체 기간', 'All Time')}
              {filter === 'today' && t('오늘', 'Today')}
              {filter === 'week' && t('최근 7일', 'Last 7 Days')}
              {filter === 'month' && t('최근 30일', 'Last 30 Days')}
              {filter === 'custom' && t('기간 선택', 'Custom Range')}
            </button>
          ))}
        </div>

        {/* Custom Date Range Inputs */}
        {dateFilter === 'custom' && (
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">{t('시작일', 'From')}:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <span className="text-gray-400">~</span>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">{t('종료일', 'To')}:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                {t('초기화', 'Reset')}
              </button>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-md scale-105'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {category === 'all' ? t('전체', 'All') : category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-center text-gray-500">
          {t(
            `총 ${filteredPosts.length}개의 포스트`,
            `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''} found`
          )}
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-50">🔍</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {t('검색 결과가 없습니다', 'No results found')}
          </h3>
          <p className="text-gray-600">
            {t('다른 조건으로 검색해보세요', 'Try different filters')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
