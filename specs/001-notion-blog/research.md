# Next.js 14 Blog with Notion CMS - Technical Research

**Research Date:** February 4, 2026
**Project:** Next.js 14 App Router Blog with Notion CMS Integration

---

## Executive Summary

This document provides comprehensive technical research for building a production-ready blog using Next.js App Router with Notion as a headless CMS. All recommendations prioritize 2026 current best practices, stable versions, and proven patterns for performance, SEO, and maintainability.

**Key Version Recommendations:**
- **Next.js:** Version 15+ (recommended for new projects in 2026)
- **@notionhq/client:** Version 5.6.0 (latest stable)
- **notion-to-md:** Version 3.1.9 (stable) or 4.x (modular architecture)

---

## 1. Next.js Version & App Router Best Practices

### Decision: Use Next.js 15 for Production

**Rationale:**
- Next.js 14 reached end-of-life on October 26, 2025
- Next.js 15 is officially stable and production-ready as of 2026
- Provides React 19 support, Turbopack stability, and significant performance improvements
- Better developer experience with explicit caching control

**Key Features in Next.js 15:**
- **React 19 Support:** Enhanced performance and hydration error improvements
- **Turbopack:** Stable and much faster for both development and production builds
- **Explicit Caching:** No longer caches fetch requests by default, giving developers more control
- **Partial Pre-Rendering (PPR):** Combines static and dynamic content on the same page

**Migration Considerations:**
```typescript
// Next.js 15 requires explicit caching
export const revalidate = 3600; // Revalidate every hour

// Or per-request
fetch(url, {
  next: { revalidate: 3600 }
});
```

**Alternatives Considered:**
- Next.js 14: End-of-life, not recommended for new projects
- Next.js 16: Latest version but may have breaking changes; stick with 15 for stability

### generateMetadata for Dynamic SEO

**Decision:** Use Server Component-based generateMetadata

**Implementation:**
```typescript
import { Metadata } from 'next';
import { notionClient } from '@/lib/notion';

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await notionClient.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Slug',
      rich_text: { equals: params.slug }
    }
  });

  const page = post.results[0];
  const title = page.properties.Title.title[0]?.plain_text;
  const description = page.properties.Description.rich_text[0]?.plain_text;
  const coverUrl = page.cover?.external?.url || page.cover?.file?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: coverUrl }],
      type: 'article',
      publishedTime: page.created_time,
      authors: ['Your Name'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverUrl],
    },
  };
}
```

**Rationale:**
- Fetch requests are automatically memoized across generateMetadata and page components
- Server-side rendering ensures bots receive metadata without JavaScript
- Type-safe with TypeScript
- Supports streaming metadata separately from UI for better performance

**Key Benefits:**
- No duplicate API calls (automatic deduplication)
- SEO-optimized with server-rendered metadata
- Dynamic OG images for social sharing
- Proper meta tag structure for search engines

### ISR (Incremental Static Regeneration) Configuration

**Decision:** Use revalidate with 3600 seconds (1 hour)

**Implementation:**
```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  const post = await getNotionPage(params.slug);
  return <Article post={post} />;
}
```

**Rationale:**
- 1 hour (3600s) balances content freshness with performance
- Reduces Notion API calls (stays under 3 req/s rate limit)
- Stale-while-revalidate pattern ensures fast responses
- First visitor after revalidation period gets cached content while background regeneration occurs

**Cache-Control Headers:**
```
Cache-Control: s-maxage=3600, stale-while-revalidate=3600
```

**Alternatives Considered:**
- **Lower revalidate (60s-300s):** Too frequent for blog content, wastes API calls
- **Higher revalidate (86400s/24h):** Content may feel stale
- **On-demand revalidation:** Requires webhook setup, more complex

### Route Handlers for sitemap.xml and robots.txt

**Decision:** Use Next.js metadata file conventions

**sitemap.ts Implementation:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { notionClient } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const database = await notionClient.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Published',
      checkbox: { equals: true }
    },
    sorts: [
      { property: 'Date', direction: 'descending' }
    ]
  });

  const posts = database.results.map((page: any) => ({
    url: `https://yourdomain.com/blog/${page.properties.Slug.rich_text[0].plain_text}`,
    lastModified: page.last_edited_time,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://yourdomain.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...posts,
  ];
}
```

**robots.ts Implementation:**
```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://yourdomain.com/sitemap.xml',
  };
}
```

**Rationale:**
- File-based metadata API is simpler than manual route handlers
- Automatically generates proper XML format
- Cached by default for performance
- Type-safe with TypeScript
- Dynamic sitemap updates automatically when new posts are published

---

## 2. Notion SDK (@notionhq/client) Integration

### Version: 5.6.0 (Latest Stable)

**Installation:**
```bash
npm install @notionhq/client
```

### Database Query Patterns

**Decision:** Filter by Published checkbox with proper typing

**Implementation:**
```typescript
// lib/notion.ts
import { Client } from '@notionhq/client';

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getPublishedPosts() {
  const response = await notionClient.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: 'Published',
          checkbox: { equals: true }
        },
        {
          property: 'Date',
          date: { on_or_before: new Date().toISOString() }
        }
      ]
    },
    sorts: [
      { property: 'Date', direction: 'descending' }
    ],
  });

  return response.results;
}
```

**Rationale:**
- Checkbox filter is simple and reliable
- Compound filters (and/or) enable complex queries
- Sorting by date ensures chronological order
- Future-dated posts can be scheduled by filtering dates

**Filter Types Available:**
- `checkbox`: `{ equals: true/false }`
- `rich_text`: `{ equals: string }`, `{ contains: string }`
- `date`: `{ on_or_before: ISO string }`, `{ after: ISO string }`
- `select`: `{ equals: string }`

### Retrieving Page Blocks for Full Content

**Decision:** Recursive block retrieval with pagination

**Implementation:**
```typescript
// lib/notion.ts
export async function getPageBlocks(pageId: string) {
  const blocks: any[] = [];

  async function fetchBlocks(blockId: string) {
    let cursor: string | undefined = undefined;

    while (true) {
      const response = await notionClient.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });

      blocks.push(...response.results);

      // Recursively fetch child blocks
      for (const block of response.results) {
        if (block.has_children) {
          await fetchBlocks(block.id);
        }
      }

      if (!response.has_more) break;
      cursor = response.next_cursor!;
    }
  }

  await fetchBlocks(pageId);
  return blocks;
}
```

**Rationale:**
- Notion doesn't return nested blocks by default (performance optimization)
- `has_children: true` indicates blocks need recursive fetching
- Pagination handling prevents missing content
- Recursive approach mirrors Notion's block structure

### Error Handling and Rate Limiting

**Decision:** Respect 429 responses with exponential backoff

**Rate Limit:** 3 requests per second (average)

**Implementation:**
```typescript
// lib/notion.ts
async function notionFetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Handle rate limiting (HTTP 429)
      if (error.code === 'notionhq_client_response_error' &&
          error.status === 429) {
        const retryAfter = error.headers?.['retry-after'];
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, i) * 1000; // Exponential backoff

        console.log(`Rate limited. Retrying after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Handle transient errors
      if (error.status >= 500) {
        const waitTime = Math.pow(2, i) * 1000;
        console.log(`Server error. Retrying after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Non-retryable error
      throw error;
    }
  }

  throw lastError!;
}

// Usage
export async function getPublishedPostsWithRetry() {
  return notionFetchWithRetry(() =>
    notionClient.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: { property: 'Published', checkbox: { equals: true } }
    })
  );
}
```

**Rationale:**
- Respects `Retry-After` header from 429 responses
- Exponential backoff prevents overwhelming the API
- Retries transient 5xx errors
- Fails fast on client errors (4xx except 429)

**Rate Limit Strategy:**
- Use ISR with 3600s revalidate to minimize requests
- Batch operations when possible
- Cache aggressively in production

### Authentication via API Key

**Decision:** Environment variable with secret management

**Setup:**
```bash
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Security Best Practices:**
- Never commit API keys to version control
- Use Vercel/platform environment variables in production
- Restrict integration permissions to minimum required
- Use read-only access when possible

---

## 3. notion-to-md Library

### Version Decision: 3.1.9 (Stable) or 4.x (Advanced)

**Installation:**
```bash
npm install notion-to-md
```

### Markdown Conversion from Notion Blocks

**Decision:** Use NotionToMarkdown with custom transformers

**Implementation:**
```typescript
// lib/notion-to-md.ts
import { NotionToMarkdown } from 'notion-to-md';
import { notionClient } from './notion';

const n2m = new NotionToMarkdown({ notionClient });

export async function convertPageToMarkdown(pageId: string) {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const markdown = n2m.toMarkdownString(mdBlocks);
  return markdown.parent;
}
```

**Rationale:**
- Handles complex Notion block structures automatically
- Supports nested blocks and formatting
- Customizable output via transformers
- Well-maintained with active community

### Supported Block Types

**Fully Supported Blocks:**
- **Text blocks:** paragraph, heading_1, heading_2, heading_3
- **Lists:** bulleted_list_item, numbered_list_item, to_do
- **Code:** code blocks with language syntax
- **Media:** image, video, embed
- **Special:** quote, callout, divider, table_of_contents
- **Rich text:** bold, italic, strikethrough, code, links
- **Database:** synced_block, column_list, column

**Custom Transformer Example:**
```typescript
// Custom callout transformer
n2m.setCustomTransformer('callout', async (block) => {
  const { callout } = block as any;
  const emoji = callout.icon?.emoji || '💡';
  const text = callout.rich_text[0]?.plain_text || '';
  return `> ${emoji} **Note:** ${text}`;
});
```

### Image Handling and External URLs

**Decision:** Use Upload Strategy for production (S3/Cloudinary)

**Problem:** Notion-hosted images expire after 1 hour

**Solution Options:**

#### 1. Direct Strategy (Not Recommended)
```typescript
// Don't use - URLs expire!
const markdown = n2m.toMarkdownString(mdBlocks);
```

#### 2. Upload Strategy (Recommended)
```typescript
// lib/notion-to-md.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });

n2m.setCustomTransformer('image', async (block) => {
  const { image } = block as any;
  const imageUrl = image.file?.url || image.external?.url;

  // Download and upload to S3
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const key = `blog-images/${Date.now()}-${block.id}.jpg`;

  await s3Client.send(new PutObjectCommand({
    Bucket: 'your-bucket',
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: 'image/jpeg',
  }));

  const permanentUrl = `https://your-bucket.s3.amazonaws.com/${key}`;
  return `![](${permanentUrl})`;
});
```

**Rationale:**
- Notion URLs expire in 1 hour (security feature)
- External URLs (already hosted) never expire
- Upload strategy creates permanent, CDN-backed URLs
- S3/Cloudinary provides better performance and control

**Image Handling in notion-to-md v4:**
```typescript
import { NotionToMD, UploadStrategy } from 'notion-to-md';

const n2m = new NotionToMD({
  notionClient,
  mediaHandler: new UploadStrategy({
    uploadHandler: async (buffer, filename) => {
      // Upload to S3, Cloudinary, etc.
      return uploadToS3(buffer, filename);
    },
    preserveExternalUrls: true, // Keep external URLs as-is
  }),
});
```

---

## 4. next/image Optimization

### Remote Image Patterns Configuration

**Decision:** Configure remotePatterns for Notion S3 and your CDN

**next.config.ts:**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/secure.notion-static.com/**',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-bucket.s3.amazonaws.com',
        pathname: '/blog-images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
```

**Rationale:**
- `remotePatterns` is more secure than deprecated `domains`
- Specific pathnames prevent malicious usage
- Multiple patterns support Notion's various S3 buckets
- AVIF and WebP provide 25-70% smaller file sizes

**Security Note:** Never use wildcard domains in production

### WebP/AVIF Conversion and Lazy Loading

**Decision:** Use Next.js automatic optimization (built-in)

**Implementation:**
```tsx
// components/BlogImage.tsx
import Image from 'next/image';

export function BlogImage({
  src,
  alt,
  priority = false
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority={priority} // For hero images
      className="rounded-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />
  );
}
```

**Automatic Features:**
- **WebP/AVIF conversion:** Automatic based on browser Accept headers
- **Lazy loading:** Default behavior (loading="lazy")
- **Blur placeholder:** Add `placeholder="blur"` for better UX
- **Responsive images:** Generates multiple sizes via srcset

**Priority Prop:**
```tsx
// Hero image - load immediately
<BlogImage src={coverImage} alt="Cover" priority />

// Content images - lazy load
<BlogImage src={contentImage} alt="Content" />
```

**Rationale:**
- Chrome gets WebP, modern browsers get AVIF
- Lazy loading improves page speed metrics
- Priority for above-the-fold images (LCP optimization)
- No manual image optimization needed

### Responsive Sizing with sizes Attribute

**Decision:** Use media query-based sizes

**Responsive Sizing Pattern:**
```tsx
<Image
  src={image}
  alt={alt}
  width={1200}
  height={630}
  sizes="(max-width: 640px) 100vw,
         (max-width: 768px) 90vw,
         (max-width: 1024px) 80vw,
         (max-width: 1280px) 70vw,
         1200px"
/>
```

**Rationale:**
- Browser selects optimal image size from srcset
- Reduces bandwidth on mobile devices
- Improves Core Web Vitals (LCP, CLS)
- Matches Tailwind breakpoints

**Tailwind Integration:**
```tsx
// Container-based sizing
<div className="container mx-auto px-4 max-w-4xl">
  <Image
    src={image}
    alt={alt}
    width={896} // max-w-4xl = 896px
    height={504}
    sizes="(max-width: 896px) 100vw, 896px"
  />
</div>
```

**Common Sizes Patterns:**
- Full width: `sizes="100vw"`
- Constrained: `sizes="(max-width: 768px) 100vw, 768px"`
- Grid item: `sizes="(max-width: 768px) 100vw, 50vw"`

---

## 5. Caching Strategy

### ISR Revalidate Values

**Decision:** 3600 seconds (1 hour) for blog content

**Configuration:**
```typescript
// Blog post page
export const revalidate = 3600; // 1 hour

// Blog index (more dynamic)
export const revalidate = 1800; // 30 minutes

// Static pages
export const revalidate = 86400; // 24 hours
```

**Rationale:**
- Blog content doesn't change frequently
- 1 hour balances freshness with performance
- Reduces Notion API calls (rate limit: 3 req/s)
- CDN can cache stale content during regeneration

**Revalidate Value Guide:**
- **Homepage/Blog index:** 1800s (30 min) - more frequently updated
- **Individual posts:** 3600s (1 hour) - less frequently changed
- **About/Static pages:** 86400s (24 hours) - rarely updated
- **On-demand:** Use `revalidatePath()` for immediate updates

### Cache-Control Headers

**Decision:** Leverage stale-while-revalidate pattern

**Implementation:**
```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600;

// Results in header:
// Cache-Control: s-maxage=3600, stale-while-revalidate=3600
```

**How It Works:**
1. First request generates static page
2. Subsequent requests serve cached version (fast)
3. After 3600s, next visitor gets stale cache (still fast)
4. Background regeneration starts
5. Fresh content replaces cache
6. Future visitors get new version

**Manual Headers (if needed):**
```typescript
// app/api/blog/route.ts
export async function GET() {
  const posts = await getPublishedPosts();

  return Response.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
```

**Rationale:**
- Users always get fast responses
- Never see loading states during revalidation
- CDN efficiency maximized
- Origin server load minimized

### Stale-While-Revalidate Patterns

**Decision:** SWR for optimal user experience

**Pattern Breakdown:**
```
Cache-Control: s-maxage=3600, stale-while-revalidate=3600
                    ↓                      ↓
              Fresh period          Stale period
              (0-3600s)            (3600-7200s)
```

**Timeline Example:**
- **0s:** Page generated, cached
- **0-3600s:** All users get cached version (fresh)
- **3601s:** User request triggers:
  - Immediate: Serve stale cache (fast!)
  - Background: Regenerate new version
- **3602s:** New users get fresh version
- **7200s+:** Cache expired, blocking regeneration

**Best Practices:**
```typescript
// Long fresh period, short stale period
export const revalidate = 3600;
// Header: s-maxage=3600, stale-while-revalidate=3600

// Short fresh period, long stale period (high traffic)
headers: {
  'Cache-Control': 's-maxage=300, stale-while-revalidate=86400'
}
```

**Rationale:**
- Zero perceived latency for end users
- Graceful degradation under high traffic
- Background regeneration prevents blocking
- CDN hits increase dramatically

---

## 6. SEO Implementation

### Sitemap.xml Generation

**Decision:** Dynamic file-based sitemap

**Implementation:** (See Section 1 - Route Handlers)

**Best Practices:**
- Include all published posts
- Update `lastModified` from Notion
- Set appropriate `changeFrequency` and `priority`
- Submit to Google Search Console

**Multiple Sitemaps (Large Sites):**
```typescript
// app/sitemap.ts (index)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourdomain.com/blog-sitemap.xml',
      lastModified: new Date(),
    },
  ];
}

// app/blog-sitemap.ts
export default async function blogSitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return posts.map(post => ({
    url: `https://yourdomain.com/blog/${post.slug}`,
    lastModified: post.lastEditedTime,
  }));
}
```

### JSON-LD BlogPosting Schema

**Decision:** Inline JSON-LD in page component

**Implementation:**
```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getNotionPage(params.slug);

  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.publishedDate,
    dateModified: post.lastEditedTime,
    author: {
      '@type': 'Person',
      name: 'Your Name',
      url: 'https://yourdomain.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/blog/${params.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      <article>{/* Post content */}</article>
    </>
  );
}
```

**Rationale:**
- Server-rendered for bot visibility
- Rich results in Google search
- Improved click-through rates
- Article cards in social platforms

**Required Fields:**
- `headline` (post title)
- `image` (cover image URL)
- `datePublished` (first published date)
- `author` (person or organization)

**Validation:**
- Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Validate schema at [Schema.org validator](https://validator.schema.org/)

### Meta Tag Structure

**Decision:** Use generateMetadata API

**Complete Meta Tag Example:**
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getNotionPage(params.slug);

  const url = `https://yourdomain.com/blog/${params.slug}`;
  const title = `${post.title} | Your Blog`;
  const description = post.description || post.excerpt;

  return {
    title,
    description,

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedDate,
      modifiedTime: post.lastEditedTime,
      authors: ['Your Name'],
      siteName: 'Your Blog',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: '@yourhandle',
      creator: '@yourhandle',
      title,
      description,
      images: [post.coverImage],
    },

    // Additional
    keywords: post.tags,
    authors: [{ name: 'Your Name', url: 'https://yourdomain.com/about' }],
    category: post.category,

    // Alternate languages (if applicable)
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
      },
    },
  };
}
```

**OG Image Dimensions:**
- Optimal: 1200x630px (1.91:1 ratio)
- Minimum: 600x315px
- Format: JPG or PNG
- File size: <1MB

**Rationale:**
- Complete social sharing support
- SEO-optimized metadata
- Rich previews in messaging apps
- Proper canonicalization

---

## 7. Error Handling Patterns

### API Failure Recovery with Cached Data

**Decision:** Leverage ISR stale data on error

**Implementation:**
```typescript
// lib/notion.ts
export async function getPublishedPosts() {
  try {
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: { property: 'Published', checkbox: { equals: true } },
    });

    return response.results;
  } catch (error) {
    console.error('Notion API error:', error);

    // ISR will serve stale cache on error
    // Re-throw to trigger error boundary if needed
    throw error;
  }
}

// app/blog/page.tsx
export const revalidate = 3600;

export default async function BlogIndex() {
  try {
    const posts = await getPublishedPosts();
    return <PostList posts={posts} />;
  } catch (error) {
    // If revalidation fails, ISR serves stale cache
    // Users see last successful version
    return <ErrorBoundary />;
  }
}
```

**Rationale:**
- ISR automatically serves stale cache if revalidation fails
- Users never see broken pages
- Next revalidation attempt may succeed
- Graceful degradation

**ISR Error Behavior:**
> "If an error is thrown while attempting to revalidate data, the last successfully generated data will continue to be served from the cache."

### Retry Logic for Transient Errors

**Decision:** Exponential backoff with max retries

**Implementation:** (See Section 2 - Error Handling and Rate Limiting)

**Retry Strategy:**
```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options = { maxRetries: 3, baseDelay: 1000 }
): Promise<T> {
  const { maxRetries, baseDelay } = options;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;
      const shouldRetry = isRetryableError(error);

      if (isLastAttempt || !shouldRetry) {
        throw error;
      }

      const delay = calculateBackoff(attempt, baseDelay, error);
      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }

  throw new Error('Max retries exceeded');
}

function isRetryableError(error: any): boolean {
  return (
    error.status === 429 ||           // Rate limit
    error.status >= 500 ||            // Server error
    error.code === 'ECONNRESET' ||    // Network error
    error.code === 'ETIMEDOUT'        // Timeout
  );
}

function calculateBackoff(
  attempt: number,
  baseDelay: number,
  error: any
): number {
  // Respect Retry-After header
  if (error.status === 429 && error.headers?.['retry-after']) {
    return parseInt(error.headers['retry-after']) * 1000;
  }

  // Exponential backoff: 1s, 2s, 4s, 8s...
  return Math.min(baseDelay * Math.pow(2, attempt), 30000);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Rationale:**
- Handles transient network issues
- Respects rate limits
- Prevents overwhelming APIs
- Fails fast on non-retryable errors

**Error Classification:**
- **Retryable:** 429, 500-599, network errors
- **Non-retryable:** 400-499 (except 429), invalid auth
- **Max retries:** 3 attempts (configurable)

### User-Friendly Error Messages

**Decision:** Use error.tsx for graceful error UI

**Implementation:**
```tsx
// app/blog/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We're having trouble loading the blog posts.
          Please try again in a moment.
        </p>
        <button
          onClick={reset}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

**not-found.tsx (404 errors):**
```tsx
// app/blog/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4">404</h2>
        <p className="text-gray-600 mb-6">
          This blog post could not be found.
        </p>
        <Link
          href="/blog"
          className="text-blue-500 hover:underline"
        >
          Return to blog
        </Link>
      </div>
    </div>
  );
}
```

**Rationale:**
- Prevents white screen of death
- Provides reset functionality
- User-friendly messaging
- Maintains brand experience

**Error Boundary Hierarchy:**
```
app/
├── error.tsx           # Global error boundary
├── blog/
│   ├── error.tsx       # Blog section errors
│   ├── [slug]/
│   │   ├── error.tsx   # Individual post errors
│   │   └── not-found.tsx
```

---

## Additional Recommendations

### Environment Variables

**Required Variables:**
```bash
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-blog-images
```

### Database Schema (Notion)

**Recommended Properties:**
- **Title** (Title): Post title
- **Slug** (Text): URL-friendly slug
- **Description** (Text): Meta description / excerpt
- **Published** (Checkbox): Publish status
- **Date** (Date): Publication date
- **Tags** (Multi-select): Categories/tags
- **Cover** (Files): Cover image
- **Author** (Text/Person): Author name

### Performance Monitoring

**Recommended Tools:**
- Vercel Analytics (Web Vitals)
- Google Search Console (SEO)
- Sentry (Error tracking)
- Notion API rate limit monitoring

### Deployment Checklist

- [ ] Configure environment variables in Vercel
- [ ] Set up custom domain with HTTPS
- [ ] Submit sitemap to Google Search Console
- [ ] Test OG images with social media debuggers
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CDN caching rules
- [ ] Test on mobile devices
- [ ] Validate JSON-LD schema
- [ ] Set up uptime monitoring

---

## Sources

### Next.js Documentation & Features
- [Functions: generateMetadata | Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Managing Metadata in Next.js 14 for Enhanced SEO](https://blog.devarshi.dev/managing-metadata-in-nextjs14-for-seo)
- [Next.js SEO Optimization Guide (2026 Edition)](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition)
- [Incremental Static Regeneration (ISR) | Next.js](https://nextjs.org/docs/14/pages/building-your-application/data-fetching/incremental-static-regeneration)
- [Metadata Files: sitemap.xml | Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Metadata Files: robots.txt | Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js 15 | Next.js](https://nextjs.org/blog/next-15)
- [Next.js | endoflife.date](https://endoflife.date/nextjs)

### Notion API & SDK
- [Filter database entries - Notion Docs](https://developers.notion.com/reference/post-database-query-filter)
- [Retrieve block children - Notion Docs](https://developers.notion.com/reference/get-block-children)
- [Working with page content - Notion Docs](https://developers.notion.com/docs/working-with-page-content)
- [Request limits - Notion Docs](https://developers.notion.com/reference/request-limits)
- [@notionhq/client - npm](https://www.npmjs.com/package/@notionhq/client)
- [GitHub - makenotion/notion-sdk-js](https://github.com/makenotion/notion-sdk-js)
- [File - Notion Docs](https://developers.notion.com/reference/file-object)

### notion-to-md Library
- [GitHub - souvikinator/notion-to-md](https://github.com/souvikinator/notion-to-md)
- [Media Handling – Notion To MD](https://notionconvert.com/docs/v4/concepts/media-handler/)
- [Mastering Media Handling in notion-to-md v4](https://notionconvert.com/blog/mastering-media-handling-in-notion-to-md-v4/)

### Image Optimization
- [Components: Image Component | Next.js](https://nextjs.org/docs/app/api-reference/components/image)
- [Optimizing: Images | Next.js](https://nextjs.org/docs/14/app/building-your-application/optimizing/images)
- [next/image Un-configured Host | Next.js](https://nextjs.org/docs/messages/next-image-unconfigured-host)
- [Understanding the sizes Attribute and Next.js Image Component](https://morganfeeney.com/posts/sizes-attribute-nextjs-image)

### Caching & Performance
- [Guides: ISR | Next.js](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Getting Started: Caching and Revalidating | Next.js](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [revalidate's Cache-Control values · vercel/next.js · Discussion](https://github.com/vercel/next.js/discussions/35104)

### SEO & Schema
- [Guides: JSON-LD | Next.js](https://nextjs.org/docs/app/guides/json-ld)
- [Implementing JSON-LD in Next.js for SEO - Wisp CMS](https://www.wisp.blog/blog/implementing-json-ld-in-nextjs-for-seo)
- [How to Create a Dynamic Sitemap for Your Next.js 14 Blog](https://lev.engineer/blog/how-to-create-a-dynamic-sitemap-for-your-next-js-14-blog-a-comprehensive-guide-to-boost-seo)

### Error Handling
- [Getting Started: Error Handling | Next.js](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js Error Handling Patterns | Better Stack Community](https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/)

### Notion Image Handling
- [How to render images from the Notion API with Next.js](https://guillermodlpa.com/blog/how-to-render-images-from-the-notion-api-with-next-js-image-optimization)
- [Notion API File Request has expired](https://www.danvega.dev/blog/notion-api-file-expired)
- [Avoid over-optimization of Notion/AWS S3 images](https://github.com/vercel/next.js/discussions/36503)

---

## Conclusion

This research provides a comprehensive foundation for building a production-ready Next.js blog with Notion CMS. Key takeaways:

1. **Use Next.js 15** for latest features and long-term support
2. **Implement ISR with 3600s revalidate** for optimal performance/freshness balance
3. **Handle Notion image expiration** with upload strategy (S3/Cloudinary)
4. **Respect rate limits** with exponential backoff retry logic
5. **Prioritize SEO** with generateMetadata, JSON-LD, and dynamic sitemaps
6. **Leverage ISR error handling** for graceful degradation
7. **Optimize images** with next/image and proper responsive sizing

All recommendations follow 2026 current best practices and are production-tested patterns.
