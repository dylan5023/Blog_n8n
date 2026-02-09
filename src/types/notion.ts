// Notion API types based on @notionhq/client

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
    select: { name: string; color: string } | null;
  };
  Files: {
    type: 'files' | 'url';
    url?: string;
    files?: Array<{
      type: 'file' | 'external';
      name: string;
      file?: { url: string; expiry_time: string };
      external?: { url: string };
    }>;
  };
  Content?: {
    type: 'url';
    url: string | null;
  };
  seo?: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedDate: string;
  summary: string;
  category: string;
  thumbnailUrl: string | null;
  seoDescription: string | null;
  contentUrl?: string | null;
  content?: string;
}

export type CategoryName = string;
