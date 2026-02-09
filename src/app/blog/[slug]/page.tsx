import { notFound } from 'next/navigation';
import { getPostBySlug, getPublishedPosts } from '@/lib/notion';
import BlogPostClient from '@/components/BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for all published posts
export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.seoDescription || post.summary,
    openGraph: {
      title: post.title,
      description: post.seoDescription || post.summary,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  console.log('📝 Requested slug:', slug);
  console.log('📝 Decoded slug:', decodedSlug);

  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    console.log('❌ Post not found for slug:', decodedSlug);
    notFound();
  }

  return <BlogPostClient post={post} />;
}
