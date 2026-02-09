import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';
import { BlogPost } from '@/types/notion';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('PostCard', () => {
  const mockPost: BlogPost = {
    id: 'test-id',
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    publishedDate: '2026-02-04',
    summary: 'This is a test summary for the blog post.',
    category: 'Tech',
    thumbnailUrl: 'https://example.com/image.jpg',
    seoDescription: null,
  };

  it('should render post card with all information', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test summary for the blog post.')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('February 4, 2026')).toBeInTheDocument();
  });

  it('should link to correct blog post URL', () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-blog-post');
  });

  it('should use placeholder image when thumbnailUrl is null', () => {
    const postWithoutImage = { ...mockPost, thumbnailUrl: null };
    render(<PostCard post={postWithoutImage} />);

    const image = screen.getByAlt('Test Blog Post');
    expect(image).toHaveAttribute('src', '/images/placeholder.jpg');
  });

  it('should display category badge', () => {
    render(<PostCard post={mockPost} />);

    const categoryBadge = screen.getByText('Tech');
    expect(categoryBadge).toBeInTheDocument();
  });
});
