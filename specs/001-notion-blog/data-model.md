# Data Model: Notion Blog

**Feature**: 001-notion-blog
**Date**: 2026-02-04

## Overview

This document defines the data model for the Notion Blog system. The blog uses Notion as a Content Management System (CMS), storing all blog posts in a Notion database. No local database is required; all data is fetched from Notion via the Notion API.

## Entities

### 1. BlogPost

Represents a published blog article stored in the Notion database.

**Source**: Notion Database (external)

#### Properties (Notion Database Schema)

| Property Name | Notion Type | Required | Description | Validation Rules |
|--------------|-------------|----------|-------------|------------------|
| Name | Title | ✅ Yes | Blog post title | Max 256 characters; displayed as H1 on detail page |
| Slug | Text | ✅ Yes | URL-safe identifier | Lowercase, hyphens only, no spaces/special chars; must be unique |
| Published | Checkbox | ✅ Yes | Publication status | Only posts with Published=true appear on site |
| Published Date | Date | ✅ Yes | Publication date | Used for sorting (newest first); ISO 8601 format |
| Summary | Text | ✅ Yes | Short description | Max 300 characters; used in post cards and meta description |
| Category | Select | ⚠️ Optional | Topic classification | If empty, display "Uncategorized"; predefined options |
| Files | Files & Media | ⚠️ Optional | Thumbnail images | First image used as thumbnail; if empty, use placeholder |
| seo | Text | ⚠️ Optional | SEO meta description | If present, overrides Summary in meta description; max 160 chars |

#### Page Content

In addition to database properties, each BlogPost has a **Notion page body** containing blocks:

- **Block Types Supported**:
  - Heading 1, 2, 3 (h1, h2, h3)
  - Paragraph
  - Bulleted list
  - Numbered list
  - Code block (with syntax highlighting)
  - Quote
  - Image (with caption)
  - Callout
  - Divider

**Rendering**: Notion blocks are converted to Markdown via `notion-to-md`, then rendered to HTML via `react-markdown`.

#### TypeScript Type Definition

```typescript
// src/types/notion.ts

export interface NotionDatabaseProperties {
  Name: {
    type: 'title';
    title: Array<{ plain_text: string }>;
  };
  Slug: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
  };
  Published: {
    type: 'checkbox';
    checkbox: boolean;
  };
  'Published Date': {
    type: 'date';
    date: { start: string } | null;
  };
  Summary: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
  };
  Category: {
    type: 'select';
    select: { name: string } | null;
  };
  Files: {
    type: 'files';
    files: Array<{
      type: 'file' | 'external';
      file?: { url: string };
      external?: { url: string };
      name: string;
    }>;
  };
  seo?: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
  };
}

export interface BlogPost {
  id: string;                    // Notion page ID
  title: string;                 // Extracted from Name
  slug: string;                  // Extracted from Slug
  publishedDate: string;         // ISO 8601 date string
  summary: string;               // Extracted from Summary
  category: string;              // Extracted from Category (or "Uncategorized")
  thumbnailUrl: string | null;   // First image from Files (or null)
  seoDescription: string | null; // Extracted from seo (or null)
  content?: string;              // Markdown content (only for detail page)
}
```

#### Relationships

- **BlogPost → Category**: Many-to-one (each post has 0 or 1 category)
- **Category is a simple string value** (not a separate entity); predefined in Notion Select property

#### State Transitions

**Lifecycle States**:
1. **Draft** (Published = false) → Not visible on blog
2. **Published** (Published = true) → Visible on blog homepage and accessible via `/blog/[slug]`

**State Changes**:
- Draft → Published: User checks "Published" checkbox in Notion
- Published → Draft: User unchecks "Published" checkbox (post disappears from blog)

**No soft-delete or archive state required** - unpublished posts simply don't appear in queries.

---

### 2. Category

Represents a topic classification for blog posts.

**Source**: Notion Select Property (predefined options)

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| name | string | Category display name (e.g., "Tech", "Life", "Review") |

**Note**: Categories are **not a separate entity**. They are predefined values in the Notion database's "Category" Select property. No dynamic category creation is required.

#### TypeScript Type Definition

```typescript
// src/types/notion.ts

export type CategoryName = string; // e.g., "Tech", "Life", "Uncategorized"
```

---

## Data Flow

### Homepage (Post List)

```
User → Homepage (/)
  ↓
Next.js Server Component (page.tsx)
  ↓
lib/notion.ts → getPublishedPosts()
  ↓
Notion API → Database Query
  Filter: Published = true
  Sort: Published Date (descending)
  ↓
Response: Array<NotionDatabaseProperties>
  ↓
Transform to Array<BlogPost>
  ↓
Render: PostCard components in grid
```

### Post Detail Page

```
User → /blog/[slug]
  ↓
Next.js Server Component ([slug]/page.tsx)
  ↓
lib/notion.ts → getPostBySlug(slug)
  ↓
Notion API → Database Query (filter by Slug)
  ↓
Notion API → Retrieve Page Blocks
  ↓
notion-to-md → Convert blocks to Markdown
  ↓
Response: BlogPost (with content field)
  ↓
Render: Hero image + metadata + PostContent component
```

---

## Validation Rules

### Slug Uniqueness

**Assumption**: Slugs are unique in the Notion database (enforced manually by content editors).

**Handling Duplicates** (per clarification session):
- If multiple posts share the same slug, display **only the first post found**
- Log a warning to console: `⚠️ Duplicate slug detected: {slug}`
- Recommend: Notion database should have a unique constraint (manual enforcement)

### Missing Fields

**Category**: If empty → Display "Uncategorized"

**Thumbnail (Files)**: If empty → Use default placeholder image (`/public/images/placeholder.jpg`)

**seo**: If empty → Fallback to Summary for meta description

**Published Date**: Required field; posts without a date will not be fetched (filtered out in query)

---

## Caching & Performance

### ISR (Incremental Static Regeneration)

**Strategy**: Static generation with on-demand revalidation

- **Revalidation Period**: 3600 seconds (1 hour)
- **Stale-While-Revalidate**: Serve cached version while fetching fresh data in background
- **Cache Key**: Based on Notion database query + slug

**Implementation**:
```typescript
// In page.tsx
export const revalidate = 3600; // 1 hour

// Notion API fetch with Next.js fetch cache
const response = await fetch(notionApiUrl, {
  next: { revalidate: 3600 }
});
```

### Notion Image Expiry

**Issue**: Notion-hosted images expire after 1 hour (signed URLs).

**Solution Options** (from research.md):
1. **Recommended**: Upload images to S3/Cloudinary during build; store permanent URLs
2. **Alternative**: Accept expiry and re-fetch images on ISR revalidation (simpler but less reliable)

**Decision**: For MVP (P1-P3), accept Notion expiry and rely on ISR. For production, implement S3 upload.

---

## Error Handling

### API Failure

**Scenario**: Notion API is unavailable or times out.

**Response** (per clarification session):
- **If cached data exists**: Display cached data with banner: "⚠️ Data may not be current"
- **If no cache**: Display error message: "Unable to load blog posts. Please try again." + Retry button

### Invalid Slug

**Scenario**: User accesses `/blog/nonexistent-slug`

**Response**: Return 404 page with link to homepage

### Missing Required Fields

**Scenario**: Post has no title, slug, or published date.

**Response**: Skip post (do not display); log error to console

---

## Data Volume & Scale

**Initial Scale**: 10-100 blog posts
**Expected Growth**: 500+ posts over 1 year
**Notion API Rate Limit**: 3 requests/second (with exponential backoff retry)

**Optimization**:
- Fetch only required properties (not full page content for list view)
- Use pagination for large result sets (100+ posts)
- Cache database queries via ISR

---

## Security & Privacy

### API Key Management

**Storage**: Environment variable `NOTION_API_KEY` in `.env.local` (Git ignored)

**Scope**: Read-only access to Notion database (no write/update permissions)

### Data Exposure

**Public Data**: All published posts (Published = true) are publicly accessible

**Private Data**: Draft posts (Published = false) are never exposed via API

**No PII**: Blog posts do not contain personally identifiable information

---

## Testing Strategy

### Unit Tests

**Test Cases**:
- Parse Notion database properties → BlogPost object
- Handle missing optional fields (Category, Files, seo)
- Transform Notion blocks → Markdown

### Integration Tests (Mocked)

**Test Cases**:
- Fetch published posts (mock Notion API response)
- Fetch post by slug (mock Notion API response)
- Handle API errors (404, 500, timeout)
- Verify duplicate slug warning

### Contract Tests

**Verify Notion API responses match expected schema**:
- Database query response structure
- Page block response structure
- Error response formats

---

## Related Documents

- [Notion API Contract](./contracts/notion-api.md) - Detailed API request/response schemas
- [Research](./research.md) - Technology decisions and best practices
- [Quickstart](./quickstart.md) - Local development setup guide
