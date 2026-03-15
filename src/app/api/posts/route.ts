import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html, title, date, category = 'MLB Analysis' } = body;

    if (!html || !title) {
      return NextResponse.json(
        { error: 'HTML and title are required' },
        { status: 400 }
      );
    }

    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      return NextResponse.json(
        { error: 'NOTION_DATABASE_ID is not configured' },
        { status: 500 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const publishedDate = date || new Date().toISOString();

    console.log('📝 Creating Notion page:', { title, slug, category });

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: slug,
              },
            },
          ],
        },
        Category: {
          select: {
            name: category,
          },
        },
        'Published Date': {
          date: {
            start: publishedDate.split('T')[0],
          },
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: `AI-generated MLB daily brief with analysis and insights`,
              },
            },
          ],
        },
        Published: {
          checkbox: true,
        },
      },
      children: [
        {
          object: 'block',
          type: 'code',
          code: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: html,
                },
              },
            ],
            language: 'html',
          },
        },
      ],
    });

    console.log('✅ Notion page created:', response.id);

    // Construct blog URL
    const blogUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`;

    return NextResponse.json({
      success: true,
      pageId: response.id,
      blogUrl: blogUrl,
      slug: slug,
      message: 'Post created successfully',
    });
  } catch (error: any) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to create post',
        details: error.body || error,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST /api/posts endpoint',
    usage: {
      method: 'POST',
      body: {
        html: 'HTML content (required)',
        title: 'Post title (required)',
        date: 'YYYY-MM-DD (optional, defaults to today)',
        category: 'Category name (optional, defaults to MLB Analysis)',
      },
    },
  });
}
