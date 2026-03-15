import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { BlogPost, NotionDatabaseProperties } from '@/types/notion';

// Get Notion client (lazy initialization)
function getNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    throw new Error(
      'NOTION_API_KEY is not set. Please add it to your .env.local file.'
    );
  }

  return new Client({
    auth: apiKey,
  });
}

// Get NotionToMarkdown instance
function getN2M() {
  const notion = getNotionClient();
  return new NotionToMarkdown({ notionClient: notion });
}

// Retry logic with exponential backoff
async function notionApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let retries = 0;
  let delay = 1000;

  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error: any) {
      if (error.code === 'rate_limited') {
        const retryAfter = error.response?.headers?.['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;

        console.warn(`Rate limited. Retrying after ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        retries++;
        delay *= 2;
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}

// Transform Notion page to BlogPost
export function transformNotionPageToPost(page: any): BlogPost {
  const properties = page.properties as NotionDatabaseProperties;

  try {
    // Extract thumbnail URL with multiple fallbacks
    let thumbnailUrl = null;
    
    // Check if Files property is a URL type (direct URL)
    if (properties.Files?.type === 'url' && properties.Files?.url) {
      thumbnailUrl = properties.Files.url;
      console.log('✅ Using URL from Files property:', thumbnailUrl);
    }
    // Check if Files property has files array (file uploads)
    else if (properties.Files?.files && properties.Files.files.length > 0) {
      const file = properties.Files.files[0];
      
      // Try external URL first (for image URLs you paste)
      if (file.external?.url) {
        thumbnailUrl = file.external.url;
        console.log('✅ Using external URL from files array:', thumbnailUrl);
      }
      // Then try file URL (for uploaded files)
      else if (file.file?.url) {
        thumbnailUrl = file.file.url;
        console.log('✅ Using file URL from files array:', thumbnailUrl);
      }
    }
    
    // Extract content URL
    const contentUrl = properties.Content?.url || null;
    
    if (thumbnailUrl && thumbnailUrl.startsWith('http://')) {
      thumbnailUrl = thumbnailUrl.replace('http://', 'https://');
    }

    const post = {
      id: page.id,
      title: properties.Name?.title?.[0]?.plain_text || 'Untitled',
      slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
      publishedDate: properties['Published Date']?.date?.start || '',
      summary: properties.Summary?.rich_text?.[0]?.plain_text || '',
      category: properties.Category?.select?.name || 'Uncategorized',
      thumbnailUrl,
      contentUrl,
      seoDescription: properties.seo?.rich_text?.[0]?.plain_text || null,
    };

    console.log('🔄 Transformed post:', {
      title: post.title,
      slug: post.slug,
      thumbnailUrl: post.thumbnailUrl,
      contentUrl: post.contentUrl,
      published: properties.Published?.checkbox,
    });

    return post;
  } catch (error) {
    console.error('❌ Error transforming page:', page.id, error);
    throw error;
  }
}

// Fetch content from external URL (returns null on failure to allow fallback)
async function fetchContentFromUrl(url: string): Promise<string | null> {
  try {
    console.log('🌐 Fetching content from URL:', url);
    
    if (url.includes('docs.google.com/spreadsheets')) {
      return await fetchGoogleSheetsContent(url);
    }
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return data.content || data.text || JSON.stringify(data);
    }
    
    const text = await response.text();
    console.log('✅ Content fetched successfully, length:', text.length);
    return text;
  } catch (error) {
    console.error('❌ Error fetching content from URL:', url, error);
    return null;
  }
}

// Fetch content from Google Sheets
async function fetchGoogleSheetsContent(url: string): Promise<string> {
  try {
    console.log('📊 Fetching Google Sheets content from:', url);
    
    // Extract spreadsheet ID from URL
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid Google Sheets URL');
    }
    
    const spreadsheetId = match[1];
    
    // Extract gid (sheet ID) if present
    const gidMatch = url.match(/gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    
    // Extract range if present
    const rangeMatch = url.match(/range=([A-Z0-9:]+)/);
    const range = rangeMatch ? rangeMatch[1] : '';
    
    // Convert to CSV export URL
    let csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    if (range) {
      csvUrl += `&range=${range}`;
    }
    
    // Add cache busting timestamp
    csvUrl += `&_=${Date.now()}`;
    
    console.log('📥 Fetching CSV from:', csvUrl);
    
    const response = await fetch(csvUrl, {
      cache: 'no-store', // Disable Next.js caching
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      console.warn(`⚠️ Google Sheets not accessible (${response.status}), will use Notion content instead`);
      return null;
    }
    
    const csvText = await response.text();
    
    console.log('📝 CSV text length:', csvText.length);
    console.log('📝 CSV preview:', csvText.substring(0, 200));
    
    // Parse CSV to Markdown
    const markdown = convertCsvToMarkdown(csvText);
    
    console.log('✅ Google Sheets content converted to Markdown, length:', markdown.length);
    return markdown;
  } catch (error) {
    console.error('❌ Error fetching Google Sheets:', error);
    return null;
  }
}

// Convert CSV to Markdown
function convertCsvToMarkdown(csv: string): string {
  const lines = csv.trim().split('\n');
  
  if (lines.length === 0) {
    return 'No content available';
  }
  
  let markdown = '';
  
  // Parse CSV properly
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };
  
  // Parse all rows
  const rows = lines.map(line => parseCsvLine(line));
  
  // Check if first row looks like a header
  const hasHeader = rows[0] && rows[0].length > 0 && rows[0][0].toLowerCase().includes('title');
  
  // If has header, use it as title
  if (hasHeader && rows.length > 1) {
    markdown += `# ${rows[0][0]}\n\n`;
    
    // Process content rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      if (row.length >= 2) {
        const keyword = row[0];
        const description = row.slice(1).filter(cell => cell).join(' ');
        
        if (keyword && description) {
          markdown += `## ${keyword}\n\n${description}\n\n`;
        }
      }
    }
  } else {
    // No header, treat all rows as content
    markdown += '# Content\n\n';
    
    rows.forEach(row => {
      if (row.length >= 2) {
        const keyword = row[0];
        const description = row.slice(1).filter(cell => cell).join(' ');
        
        if (keyword && description) {
          markdown += `## ${keyword}\n\n${description}\n\n`;
        }
      } else if (row.length === 1 && row[0]) {
        markdown += `${row[0]}\n\n`;
      }
    });
  }
  
  return markdown || '# No content available';
}

// DEBUG: Get all posts without filter
export async function getAllPostsDebug(): Promise<any[]> {
  try {
    const notion = getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not set.');
    }

    const response = await notionApiCall(() =>
      notion.databases.query({
        database_id: databaseId,
      })
    );

    console.log('🐛 DEBUG - All posts (no filter):', response.results.length);
    response.results.forEach((page: any, index: number) => {
      const props = (page as any).properties;
      console.log(`Post ${index + 1}:`, {
        title: props?.Name?.title?.[0]?.plain_text,
        published: props?.Published?.checkbox,
        allProperties: props ? Object.keys(props) : [],
      });
    });

    return response.results;
  } catch (error) {
    console.error('❌ Error in debug function:', error);
    return [];
  }
}

// Get all published posts
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const notion = getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error(
        'NOTION_DATABASE_ID is not set. Please add it to your .env.local file.'
      );
    }

    console.log('🔍 Fetching posts from database:', databaseId);

    const response = await notionApiCall(() =>
      notion.databases.query({
        database_id: databaseId,
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
      })
    );

    console.log('📊 Total results found:', response.results.length);

    if (response.results.length > 0) {
      const firstPage = response.results[0] as any;
      console.log('📄 First result properties:', JSON.stringify(firstPage.properties, null, 2));
    }

    const posts = response.results.map(transformNotionPageToPost);
    console.log('✅ Transformed posts:', posts.length);

    return posts;
  } catch (error) {
    console.error('❌ Error fetching published posts:', error);
    return [];
  }
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const notion = getNotionClient();
    const n2m = getN2M();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error(
        'NOTION_DATABASE_ID is not set. Please add it to your .env.local file.'
      );
    }

    console.log('🔍 Looking for post with slug:', slug);

    const response = await notionApiCall(() =>
      notion.databases.query({
        database_id: databaseId,
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
                equals: slug,
              },
            },
          ],
        },
      })
    );

    const results = response.results;

    console.log('📊 Found results:', results.length);

    if (results.length === 0) {
      // Fallback: Try to find by matching slug case-insensitively
      console.log('⚠️ No exact match, trying all published posts...');
      const allPosts = await getPublishedPosts();
      const matchedPost = allPosts.find(
        (post) => post.slug.toLowerCase() === slug.toLowerCase()
      );

      if (matchedPost) {
        console.log('✅ Found post via fallback search:', matchedPost.title);
        const pageResponse = await notionApiCall(() =>
          notion.databases.query({
            database_id: databaseId,
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
                    equals: matchedPost.slug,
                  },
                },
              ],
            },
          })
        );

        if (pageResponse.results.length > 0) {
          const page = pageResponse.results[0];
          const post = transformNotionPageToPost(page);
          
          if (post.contentUrl) {
            console.log('📄 Trying content from URL:', post.contentUrl);
            const externalContent = await fetchContentFromUrl(post.contentUrl);
            if (externalContent) {
              post.content = externalContent;
            } else {
              console.log('⚠️ External content failed, falling back to Notion page');
              const mdBlocks = await n2m.pageToMarkdown(page.id);
              const markdown = n2m.toMarkdownString(mdBlocks);
              post.content = markdown.parent;
            }
          } else {
            console.log('📄 Using content from Notion page');
            const mdBlocks = await n2m.pageToMarkdown(page.id);
            const markdown = n2m.toMarkdownString(mdBlocks);
            post.content = markdown.parent;
          }
          
          return post;
        }
      }

      return null;
    }

    if (results.length > 1) {
      console.warn(`⚠️ Duplicate slug detected: ${slug}`);
    }

    const page = results[0];
    const post = transformNotionPageToPost(page);

    if (post.contentUrl) {
      console.log('📄 Trying content from URL:', post.contentUrl);
      const externalContent = await fetchContentFromUrl(post.contentUrl);
      if (externalContent) {
        post.content = externalContent;
        console.log('📝 Content preview (first 500 chars):', post.content.substring(0, 500));
      } else {
        console.log('⚠️ External content failed, falling back to Notion page');
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const markdown = n2m.toMarkdownString(mdBlocks);
        post.content = markdown.parent;
      }
    } else {
      console.log('📄 Using content from Notion page');
      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const markdown = n2m.toMarkdownString(mdBlocks);
      post.content = markdown.parent;
    }

    return post;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}
