# Quickstart Guide: Notion Blog

**Feature**: 001-notion-blog
**Date**: 2026-02-04

## Overview

This guide walks you through setting up the Notion Blog locally for development. Follow these steps to get the blog running on your machine.

**Prerequisites**:
- Node.js 18.17 or higher
- npm, yarn, or pnpm package manager
- Notion account with a workspace
- Git (for cloning the repository)

**Estimated Setup Time**: 15-20 minutes

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/notion-blog.git
cd notion-blog

# Checkout the feature branch
git checkout 001-notion-blog
```

---

## Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Key Dependencies Installed**:
- Next.js 15.x (or 14.2.0+)
- @notionhq/client (Notion SDK)
- notion-to-md (Markdown converter)
- react-markdown (Markdown renderer)
- react-syntax-highlighter (Code syntax highlighting)
- Tailwind CSS 3.4+
- TypeScript 5.0+
- date-fns (Date formatting)

---

## Step 3: Create Notion Integration

### 3.1 Create a New Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the form:
   - **Name**: "Blog CMS Integration" (or any name)
   - **Associated workspace**: Select your workspace
   - **Type**: Internal
   - **Capabilities**:
     - ✅ **Read content**
     - ⬜ Update content (uncheck)
     - ⬜ Insert content (uncheck)
     - ⬜ Comment (uncheck)
4. Click **"Submit"**

### 3.2 Copy the Integration Secret

After creating the integration, you'll see the **Internal Integration Secret**.

- **Format**: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Copy this value** - you'll need it for the `.env.local` file

**Security Note**: Keep this secret private! Never commit it to Git.

---

## Step 4: Create Notion Database

### 4.1 Create a New Page

1. Open Notion
2. Create a new page named **"Blog Posts"** (or any name)

### 4.2 Create a Database

1. In the new page, type `/database`
2. Select **"Table - Full page"**
3. This creates a database view

### 4.3 Add Required Properties

Click the **"+"** button at the top right to add properties. Create the following:

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Name** | Title | (Default, already exists) |
| **Slug** | Text | - |
| **Published** | Checkbox | - |
| **Published Date** | Date | Date only (no time) |
| **Summary** | Text | - |
| **Category** | Select | Add options: Tech, Life, Review, etc. |
| **Files** | Files & media | - |
| **seo** | Text | (Optional) |

**Visual Guide**:
```
┌─────────────┬──────┬───────────┬────────────────┬─────────┬──────────┬───────┬─────┐
│ Name (Title)│ Slug │ Published │ Published Date │ Summary │ Category │ Files │ seo │
├─────────────┼──────┼───────────┼────────────────┼─────────┼──────────┼───────┼─────┤
│ My First... │ my...│ ☑         │ 2026-02-04     │ This... │ Tech     │ 📎    │ ... │
└─────────────┴──────┴───────────┴────────────────┴─────────┴──────────┴───────┴─────┘
```

### 4.4 Connect Integration to Database

1. Click the **"..."** (three dots) at the top right of the database page
2. Scroll down and click **"Add connections"**
3. Select **"Blog CMS Integration"** (the integration you created)
4. Click **"Confirm"**

**Important**: The integration MUST be connected to the database to read it.

### 4.5 Copy Database ID

1. Open the database as a full page
2. Look at the URL in your browser:
   ```
   https://www.notion.so/{workspace}/{database_id}?v={view_id}
   ```
3. Copy the **`database_id`** part (32-character string)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

---

## Step 5: Configure Environment Variables

### 5.1 Create `.env.local` File

In the project root, create a file named `.env.local`:

```bash
# In the project root
touch .env.local
```

### 5.2 Add Environment Variables

Open `.env.local` and add:

```env
# Notion Integration Secret (from Step 3.2)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Notion Database ID (from Step 4.5)
NOTION_DATABASE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Site Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_TITLE=My Notion Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A blog powered by Notion and Next.js

# Revalidation Time (seconds) - 1 hour = 3600
REVALIDATE_TIME=3600
```

**Replace**:
- `secret_xxx...` with your actual Notion Integration Secret
- `a1b2c3...` with your actual Notion Database ID

### 5.3 Verify `.gitignore`

Ensure `.env.local` is in `.gitignore` (it should be by default):

```bash
# Check if .env.local is ignored
cat .gitignore | grep .env.local
```

If not present, add it:

```bash
echo ".env.local" >> .gitignore
```

---

## Step 6: Add Test Blog Posts

### 6.1 Create Your First Post

In the Notion database, add a new row:

| Field | Value |
|-------|-------|
| **Name** | Getting Started with Notion Blog |
| **Slug** | getting-started |
| **Published** | ☑ (checked) |
| **Published Date** | 2026-02-04 |
| **Summary** | Learn how to set up and use this Notion-powered blog |
| **Category** | Tech |
| **Files** | (Upload a thumbnail image) |

### 6.2 Add Post Content

1. Click on the post title to open the page
2. Add content using Notion blocks:
   - Headings (type `/h1`, `/h2`, `/h3`)
   - Paragraphs (just type)
   - Lists (type `-` for bullets, `1.` for numbers)
   - Code blocks (type `/code`)
   - Images (type `/image`)
   - Quotes (type `/quote`)

**Example Content**:
```
# Welcome to My Blog

This is my first blog post powered by Notion!

## Features

- Easy content management in Notion
- Automatic SEO optimization
- Fast page loads with Next.js
- Responsive design

## Code Example

Here's some TypeScript:

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

Enjoy exploring the blog!
```

### 6.3 Add More Posts (Optional)

Repeat Step 6.1-6.2 to add 2-3 more test posts with different categories.

---

## Step 7: Run the Development Server

```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev

# Or with pnpm
pnpm dev
```

**Output**:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.3s
```

---

## Step 8: Verify the Blog

### 8.1 Open Homepage

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You should see:
   - Blog header with site title
   - Grid of blog post cards (showing your test posts)
   - Each card displays: thumbnail, title, summary, date, category

**Troubleshooting**:
- **No posts appear**: Check that **Published** checkbox is checked in Notion
- **Error message**: Verify `NOTION_API_KEY` and `NOTION_DATABASE_ID` in `.env.local`
- **"Database not found"**: Ensure integration is connected to the database (Step 4.4)

### 8.2 Open Post Detail Page

1. Click on a post card
2. URL should be `/blog/getting-started` (using the slug)
3. You should see:
   - Hero image at full width
   - Post title, date, category
   - Full post content rendered from Notion blocks

**Troubleshooting**:
- **404 page**: Check that the slug in Notion matches the URL
- **Content not rendering**: Verify Notion blocks are supported types (headings, paragraphs, lists)

### 8.3 Test SEO Files

1. Open [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)
   - Should show XML with all published post URLs
2. Open [http://localhost:3000/robots.txt](http://localhost:3000/robots.txt)
   - Should show:
     ```
     User-agent: *
     Allow: /
     Sitemap: http://localhost:3000/sitemap.xml
     ```

### 8.4 Test Responsive Design

1. Open browser DevTools (F12)
2. Enable Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test layouts:
   - **Mobile (375px)**: 1-column grid
   - **Tablet (768px)**: 2-column grid
   - **Desktop (1024px+)**: 3-column grid

---

## Step 9: Run Tests (Optional)

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests (if configured)
npm run test:e2e
```

---

## Common Issues & Solutions

### Issue: "Invalid API key"

**Cause**: Incorrect `NOTION_API_KEY` in `.env.local`

**Solution**:
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click on your integration
3. Copy the **Internal Integration Secret** again
4. Update `.env.local`
5. Restart the dev server (`npm run dev`)

---

### Issue: "Database not found"

**Cause**: Integration not connected to database, or incorrect `NOTION_DATABASE_ID`

**Solution**:
1. Open your Notion database page
2. Click **"..." → Add connections → Select your integration**
3. Verify the database ID in the URL matches `.env.local`
4. Restart the dev server

---

### Issue: Images not loading

**Cause**: Next.js Image remote patterns not configured for Notion URLs

**Solution**:
Add to `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Notion S3 images
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // If using Unsplash images
      },
    ],
  },
};

export default nextConfig;
```

Restart the dev server.

---

### Issue: TypeScript errors

**Cause**: TypeScript strict mode violations

**Solution**:
1. Check `tsconfig.json` has `"strict": true`
2. Fix type errors (no `any` types without justification)
3. Run `npm run type-check` to verify

---

### Issue: Styles not applying

**Cause**: Tailwind CSS not properly configured

**Solution**:
1. Verify `tailwind.config.ts` includes correct paths:
   ```typescript
   content: [
     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   ```
2. Ensure `globals.css` includes:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart the dev server

---

## Next Steps

✅ **You're all set!** Your Notion Blog is running locally.

**Recommended Next Steps**:
1. **Customize Styling**: Edit Tailwind config and components in `src/components/`
2. **Add More Posts**: Create more content in Notion to test pagination and filtering
3. **Deploy to Vercel**: See deployment guide in `README.md`
4. **Set Up Analytics**: Add Vercel Analytics or Google Analytics
5. **Configure Custom Domain**: Point your domain to the deployed site

---

## Development Workflow

### Making Changes

1. **Edit Components**: Modify files in `src/components/`, `src/app/`, `src/lib/`
2. **Hot Reload**: Changes appear automatically in the browser (no restart needed)
3. **Test**: Run `npm test` to verify unit tests pass
4. **Commit**: Use meaningful commit messages (follow project conventions)

### Adding New Features

1. **Create Spec**: Use `/speckit.specify` to document the feature
2. **Plan**: Use `/speckit.plan` to generate implementation plan
3. **Tasks**: Use `/speckit.tasks` to break down into tasks
4. **Implement**: Use `/speckit.implement` to execute tasks
5. **Test**: Write unit/integration tests
6. **Review**: Submit pull request for code review

### Notion Content Updates

**No code changes needed!** Just edit content in Notion:
- Add new posts: Create rows in the database
- Publish posts: Check the **Published** checkbox
- Update content: Edit the Notion page directly
- Changes appear on the blog within 1 hour (ISR revalidation)

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build locally

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests (if configured)

# Linting & Formatting
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types

# Deployment
vercel               # Deploy to Vercel (requires vercel CLI)
```

---

## Related Documents

- [Implementation Plan](./plan.md) - Technical architecture and design decisions
- [Data Model](./data-model.md) - Entity definitions and relationships
- [Notion API Contract](./contracts/notion-api.md) - API integration details
- [Research](./research.md) - Technology choices and best practices

---

## Support

**Issues or Questions?**
- Check the [troubleshooting section](#common-issues--solutions) above
- Review the [Notion API documentation](https://developers.notion.com/)
- Open an issue on GitHub
- Contact the development team

**Happy blogging! 🎉**
