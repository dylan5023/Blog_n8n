import { BlogPost } from '@/types/notion';
import { Metadata } from 'next';

export function generatePostMetadata(post: BlogPost): Metadata {
  const title = `${post.title} | ${process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog'}`;
  const description = post.seoDescription || post.summary;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`;
  const imageUrl = post.thumbnailUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/images/placeholder.jpg`;

  return {
    title,
    description,
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateBlogPostingSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.thumbnailUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/images/placeholder.jpg`,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: {
      '@type': 'Person',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Author',
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/placeholder.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
    },
  };
}
