import { transformNotionPageToPost } from '../notion';

describe('transformNotionPageToPost', () => {
  it('should transform Notion page with all fields', () => {
    const mockPage = {
      id: 'test-id-123',
      properties: {
        Name: {
          type: 'title',
          title: [{ plain_text: 'Test Post' }],
        },
        Slug: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'test-post' }],
        },
        Published: {
          type: 'checkbox',
          checkbox: true,
        },
        'Published Date': {
          type: 'date',
          date: { start: '2026-02-04' },
        },
        Summary: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'This is a test summary' }],
        },
        Category: {
          type: 'select',
          select: { name: 'Tech', color: 'blue' },
        },
        Files: {
          type: 'files',
          files: [
            {
              type: 'file',
              name: 'image.jpg',
              file: { url: 'https://example.com/image.jpg', expiry_time: '' },
            },
          ],
        },
        seo: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'SEO description' }],
        },
      },
    };

    const result = transformNotionPageToPost(mockPage);

    expect(result).toEqual({
      id: 'test-id-123',
      title: 'Test Post',
      slug: 'test-post',
      publishedDate: '2026-02-04',
      summary: 'This is a test summary',
      category: 'Tech',
      thumbnailUrl: 'https://example.com/image.jpg',
      seoDescription: 'SEO description',
    });
  });

  it('should handle missing Category as "Uncategorized"', () => {
    const mockPage = {
      id: 'test-id-456',
      properties: {
        Name: {
          type: 'title',
          title: [{ plain_text: 'Uncategorized Post' }],
        },
        Slug: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'uncategorized-post' }],
        },
        Published: {
          type: 'checkbox',
          checkbox: true,
        },
        'Published Date': {
          type: 'date',
          date: { start: '2026-02-04' },
        },
        Summary: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'Summary text' }],
        },
        Category: {
          type: 'select',
          select: null,
        },
        Files: {
          type: 'files',
          files: [],
        },
      },
    };

    const result = transformNotionPageToPost(mockPage);

    expect(result.category).toBe('Uncategorized');
    expect(result.thumbnailUrl).toBeNull();
  });

  it('should handle missing thumbnail as null', () => {
    const mockPage = {
      id: 'test-id-789',
      properties: {
        Name: {
          type: 'title',
          title: [{ plain_text: 'No Image Post' }],
        },
        Slug: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-image-post' }],
        },
        Published: {
          type: 'checkbox',
          checkbox: true,
        },
        'Published Date': {
          type: 'date',
          date: { start: '2026-02-04' },
        },
        Summary: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'Summary' }],
        },
        Category: {
          type: 'select',
          select: { name: 'Life', color: 'green' },
        },
        Files: {
          type: 'files',
          files: [],
        },
      },
    };

    const result = transformNotionPageToPost(mockPage);

    expect(result.thumbnailUrl).toBeNull();
  });
});
