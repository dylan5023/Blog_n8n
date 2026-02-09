# Notion API Integration Contract

**Feature**: 001-notion-blog
**Date**: 2026-02-04
**API Version**: Notion API v2022-06-28 (stable)
**SDK**: @notionhq/client v5.6.0+

## Overview

This contract defines the integration between the Notion Blog system and the Notion API. It specifies request/response formats, error handling, rate limiting, and authentication patterns.

## Authentication

### API Key

**Method**: Bearer token authentication

**Configuration**:
```typescript
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
```

**Environment Variable**:
- **Name**: `NOTION_API_KEY`
- **Format**: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (starts with "secret_")
- **Storage**: `.env.local` (Git ignored)
- **Scope**: Read-only access to shared Notion database

**Security**:
- API key MUST be stored server-side only (never exposed to client)
- Used in React Server Components or API routes (not client components)

---

## Rate Limiting

**Limit**: 3 requests per second (sustained average)

**Response Headers**:
- `retry-after`: Seconds to wait before retrying (if rate limited)

**Retry Strategy** (Exponential Backoff):
```typescript
async function notionApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  const maxRetries = 3;
  let retries = 0;
  let delay = 1000; // Start with 1 second

  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error: any) {
      if (error.code === 'rate_limited') {
        const retryAfter = error.response?.headers?.['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;

        console.warn(`Rate limited. Retrying after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        retries++;
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Re-throw non-rate-limit errors
      }
    }
  }

  throw new Error('Max retries exceeded');
}
```

---

## Endpoints

### 1. Query Database (Get Published Posts)

**Purpose**: Fetch all published blog posts for homepage display.

**Request**:
```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  filter: {
    property: 'Published',
    checkbox: {
      equals: true,
    },
  },
  sorts: [
    {
      property: 'Published Date',
      direction: 'descending',
    },
  ],
  page_size: 100, // Max 100 results per request
});
```

**Response Schema**:
```typescript
interface QueryDatabaseResponse {
  object: 'list';
  results: Array<{
    id: string; // Page ID
    created_time: string; // ISO 8601
    last_edited_time: string; // ISO 8601
    properties: {
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
        date: { start: string } | null; // ISO 8601 date
      };
      Summary: {
        type: 'rich_text';
        rich_text: Array<{ plain_text: string }>;
      };
      Category: {
        type: 'select';
        select: { name: string; color: string } | null;
      };
      Files: {
        type: 'files';
        files: Array<{
          type: 'file' | 'external';
          name: string;
          file?: { url: string; expiry_time: string };
          external?: { url: string };
        }>;
      };
      seo?: {
        type: 'rich_text';
        rich_text: Array<{ plain_text: string }>;
      };
    };
  }>;
  next_cursor: string | null; // For pagination
  has_more: boolean;
}
```

**Success Response**:
- **Status**: 200 OK
- **Body**: Array of page objects matching filter

**Error Responses**:
- **401 Unauthorized**: Invalid API key
- **404 Not Found**: Database ID not found or not shared with integration
- **429 Too Many Requests**: Rate limit exceeded (use retry-after header)
- **500 Internal Server Error**: Notion API server error

**Pagination**:
```typescript
let allResults = [];
let hasMore = true;
let startCursor = undefined;

while (hasMore) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: { ... },
    start_cursor: startCursor,
  });

  allResults.push(...response.results);
  hasMore = response.has_more;
  startCursor = response.next_cursor;
}
```

---

### 2. Query Database by Slug (Get Single Post)

**Purpose**: Fetch a specific blog post by its slug for detail page.

**Request**:
```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  filter: {
    and: [
      {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      {
        property: 'Slug',
        rich_text: {
          equals: slug, // e.g., "getting-started"
        },
      },
    ],
  },
  page_size: 1, // Expect only one result
});
```

**Response Schema**: Same as Query Database response, but `results` array should contain 0 or 1 items.

**Success Response**:
- **Status**: 200 OK
- **Body**: Array with 0 or 1 page object

**Handling**:
```typescript
if (response.results.length === 0) {
  return null; // Slug not found → trigger 404
}

if (response.results.length > 1) {
  console.warn(`⚠️ Duplicate slug detected: ${slug}`);
  // Return first result
}

const page = response.results[0];
```

**Error Responses**: Same as Query Database

---

### 3. Retrieve Page Blocks (Get Post Content)

**Purpose**: Fetch the full content blocks of a blog post for rendering.

**Request**:
```typescript
const blocks = await notion.blocks.children.list({
  block_id: pageId, // From database query result
  page_size: 100,
});
```

**Response Schema**:
```typescript
interface BlocksResponse {
  object: 'list';
  results: Array<Block>;
  next_cursor: string | null;
  has_more: boolean;
}

// Simplified Block type (full schema is extensive)
interface Block {
  id: string;
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' |
        'bulleted_list_item' | 'numbered_list_item' | 'code' |
        'quote' | 'image' | 'divider' | 'callout' | ...;
  [type]: {
    // Block-specific properties
    rich_text?: Array<{
      type: 'text';
      text: { content: string; link: { url: string } | null };
      annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
      };
      plain_text: string;
    }>;
  };
  has_children: boolean; // True if nested blocks exist
}
```

**Success Response**:
- **Status**: 200 OK
- **Body**: Array of block objects

**Recursive Retrieval** (for nested blocks):
```typescript
async function getAllBlocks(blockId: string): Promise<Block[]> {
  const allBlocks: Block[] = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: 100,
    });

    for (const block of response.results) {
      allBlocks.push(block);

      // Recursively fetch nested blocks
      if (block.has_children) {
        const children = await getAllBlocks(block.id);
        allBlocks.push(...children);
      }
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  return allBlocks;
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid API key
- **404 Not Found**: Page ID not found or not shared
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Notion API server error

---

## Error Handling Contract

### Error Types

**Notion API Errors**:
```typescript
interface NotionAPIError {
  object: 'error';
  status: number; // HTTP status code
  code: string; // Error code (e.g., 'unauthorized', 'rate_limited')
  message: string; // Human-readable error message
}
```

**Error Codes**:
- `unauthorized`: Invalid or missing API key
- `restricted_resource`: Database not shared with integration
- `object_not_found`: Database or page ID not found
- `rate_limited`: Rate limit exceeded
- `internal_server_error`: Notion server error
- `service_unavailable`: Notion temporarily unavailable

### Client-Side Error Handling

**Strategy** (per clarification session):

1. **Transient Errors (rate limit, timeout, 500)**:
   - Retry with exponential backoff (max 3 retries)
   - If all retries fail → fallback to cached data (if available)
   - If no cache → display user-friendly error with retry button

2. **Permanent Errors (401, 404)**:
   - No retry (these won't resolve automatically)
   - Log error to console (server-side)
   - Display error message: "Unable to load blog posts. Please check configuration."

3. **Cached Data Fallback**:
   ```typescript
   try {
     const posts = await getPublishedPosts();
     return posts;
   } catch (error) {
     console.error('Notion API error:', error);

     // ISR automatically serves stale cache if available
     // Display banner: "⚠️ Data may not be current"
     return []; // Empty array if no cache
   }
   ```

---

## Data Transformation

### Notion Properties → BlogPost

**Transformation Function**:
```typescript
function transformNotionPageToPost(page: any): BlogPost {
  const properties = page.properties;

  return {
    id: page.id,
    title: properties.Name.title[0]?.plain_text || 'Untitled',
    slug: properties.Slug.rich_text[0]?.plain_text || '',
    publishedDate: properties['Published Date'].date?.start || '',
    summary: properties.Summary.rich_text[0]?.plain_text || '',
    category: properties.Category.select?.name || 'Uncategorized',
    thumbnailUrl: properties.Files.files[0]?.file?.url ||
                  properties.Files.files[0]?.external?.url ||
                  null,
    seoDescription: properties.seo?.rich_text[0]?.plain_text || null,
  };
}
```

**Validation**:
- If required fields are missing (title, slug, publishedDate), skip post
- Log warning: `⚠️ Invalid post: missing required fields (ID: ${page.id})`

### Notion Blocks → Markdown

**Using notion-to-md**:
```typescript
import { NotionToMarkdown } from 'notion-to-md';

const n2m = new NotionToMarkdown({ notionClient: notion });

async function getPostContent(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const markdown = n2m.toMarkdownString(mdBlocks);
  return markdown.parent; // Full markdown string
}
```

**Supported Block Types**:
- Heading 1, 2, 3 → `# ## ###`
- Paragraph → Plain text
- Bulleted list → `- item`
- Numbered list → `1. item`
- Code → ` ```language\ncode\n``` `
- Quote → `> quote text`
- Image → `![alt](url)`
- Callout → `> 💡 callout text`

---

## Performance Considerations

### Caching Strategy

**ISR Configuration**:
```typescript
// In page.tsx (homepage)
export const revalidate = 3600; // 1 hour

// In [slug]/page.tsx (detail page)
export const revalidate = 3600; // 1 hour
```

**Cache Behavior**:
- First request: Fetch from Notion API, generate static HTML, cache for 1 hour
- Subsequent requests (within 1 hour): Serve cached HTML (no API call)
- After 1 hour: First request triggers background revalidation; serve stale cache immediately
- On API failure during revalidation: Continue serving stale cache

### Notion Image Expiry

**Issue**: Notion-hosted image URLs expire after 1 hour (signed URLs).

**Mitigation** (for MVP):
- Accept expiry; images re-fetch on ISR revalidation
- ISR interval (1 hour) aligns with Notion expiry

**Production Solution** (post-MVP):
- Upload images to S3/Cloudinary during build
- Store permanent URLs in data transformation

### Request Batching

**Optimization**: Fetch only required properties for list view.

```typescript
// List view: NO block content (faster)
const posts = await getPublishedPosts(); // Only database properties

// Detail view: WITH block content (slower)
const post = await getPostBySlug(slug); // Database + blocks
```

---

## Testing Contract

### Mocked API Responses

**Unit/Integration Tests**: Use mocked Notion API responses (no live API calls in tests).

**Mock Data**:
```typescript
// tests/mocks/notion.ts

export const mockDatabaseQueryResponse = {
  object: 'list',
  results: [
    {
      id: 'mock-page-id-1',
      properties: {
        Name: { type: 'title', title: [{ plain_text: 'Test Post' }] },
        Slug: { type: 'rich_text', rich_text: [{ plain_text: 'test-post' }] },
        Published: { type: 'checkbox', checkbox: true },
        'Published Date': { type: 'date', date: { start: '2026-02-04' } },
        Summary: { type: 'rich_text', rich_text: [{ plain_text: 'Test summary' }] },
        Category: { type: 'select', select: { name: 'Tech' } },
        Files: { type: 'files', files: [] },
      },
    },
  ],
  next_cursor: null,
  has_more: false,
};

export const mockBlocksResponse = {
  object: 'list',
  results: [
    {
      id: 'block-1',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ plain_text: 'This is a test paragraph.' }],
      },
    },
  ],
  next_cursor: null,
  has_more: false,
};
```

**Mocking Strategy**:
```typescript
// Using jest.mock
jest.mock('@notionhq/client', () => ({
  Client: jest.fn(() => ({
    databases: {
      query: jest.fn().mockResolvedValue(mockDatabaseQueryResponse),
    },
    blocks: {
      children: {
        list: jest.fn().mockResolvedValue(mockBlocksResponse),
      },
    },
  })),
}));
```

---

## Related Documents

- [Data Model](../data-model.md) - Entity definitions and relationships
- [Research](../research.md) - Notion SDK best practices
- [Quickstart](../quickstart.md) - Notion Integration setup guide
