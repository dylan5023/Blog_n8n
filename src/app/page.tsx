import { getPublishedPosts, getAllPostsDebug } from '@/lib/notion';
import Hero from '@/components/Hero';
import BlogGrid from '@/components/BlogGrid';
import ClientHome from '@/components/ClientHome';

export const revalidate = 3600; // Revalidate every 1 hour

export default async function Home() {
  // Debug: Check all posts
  await getAllPostsDebug();

  const posts = await getPublishedPosts();

  return (
    <>
      <Hero />
      <ClientHome posts={posts} />
    </>
  );
}
