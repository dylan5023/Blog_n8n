# Feature Specification: Notion Blog with CMS Integration

**Feature Branch**: `001-notion-blog`
**Created**: 2026-02-04
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View Published Blog Posts (Priority: P1)

As a blog visitor, I want to see a list of published blog posts on the homepage so that I can discover and read content.

The system fetches published posts from a Notion database, filters them by publication status, and displays them in a responsive grid layout. Each post card shows essential metadata (title, summary, date, category, thumbnail) to help visitors decide what to read.

**Why this priority**: This is the core MVP feature. Without a functional blog homepage, the system has no value. It's the primary entry point for all visitors.

**Independent Test**: Can be fully tested by navigating to homepage (`/`) with a Notion database containing published posts, and validating that posts appear in correct layout with all required fields displayed.

**Acceptance Scenarios**:

1. **Given** a Notion database with 5 posts marked as Published=true, **When** visiting the homepage, **Then** all 5 posts display in a grid layout sorted by Published Date (newest first)
2. **Given** a post with all fields populated (Name, Summary, Published Date, Category, Files), **When** viewing the post card, **Then** each field displays correctly with proper formatting
3. **Given** a desktop viewport (1024px+), **When** viewing the post list, **Then** posts display in a 3-column grid layout
4. **Given** a tablet viewport (768px), **When** viewing the post list, **Then** posts display in a 2-column grid layout
5. **Given** a mobile viewport (320px), **When** viewing the post list, **Then** posts display in a 1-column grid layout
6. **Given** posts with different Published Date values, **When** viewing the list, **Then** posts are sorted with most recent date first
7. **Given** a Notion database with 2 Published posts and 3 Draft posts, **When** viewing the homepage, **Then** only the 2 Published posts appear

---

### User Story 2 - Read Individual Blog Post (Priority: P1)

As a blog visitor, I want to click on a blog post and read its full content on a dedicated page so that I can engage with the full article.

The system retrieves the full post content from Notion, renders it as readable HTML, and displays it with proper metadata (title, date, category, thumbnail image). The URL uses the post's slug for clean, SEO-friendly links.

**Why this priority**: This is essential MVP functionality. Visitors must be able to read the content they selected. Without this, the blog is non-functional.

**Independent Test**: Can be fully tested by clicking a post from the homepage, verifying the URL contains the post slug (`/blog/[slug]`), and validating that the full post content, metadata, and hero image display correctly.

**Acceptance Scenarios**:

1. **Given** a published post with slug "getting-started", **When** visiting `/blog/getting-started`, **Then** the post content displays with correct title, body, and metadata
2. **Given** a post with a Files/Media property, **When** opening the post detail page, **Then** the first image displays as a hero image at full width above the title
3. **Given** a post detail page, **When** viewing the page, **Then** the post title, published date, and category display prominently below the hero image
4. **Given** Notion content with various block types (text, headings, lists, code blocks), **When** rendering the post, **Then** all content renders correctly as readable HTML
5. **Given** an invalid slug (e.g., `/blog/nonexistent`), **When** visiting that URL, **Then** a 404 error page displays
6. **Given** a post detail page, **When** scrolling, **Then** a navigation link to return to the homepage remains accessible
7. **Given** a post with metadata (title, summary, date, category), **When** viewing the page source, **Then** proper meta tags are included for SEO (title, description, og:image)

---

### User Story 3 - Search for Blog Posts (Priority: P4)

As a blog visitor, I want to search for blog posts by keyword so that I can quickly find relevant content.

The system provides a search interface that filters published posts by title and summary content. Results update dynamically as the user types.

**Why this priority**: This is a nice-to-have feature that improves discoverability. It's not essential for MVP but becomes valuable as the blog grows.

**Independent Test**: Can be fully tested by entering search terms in a search box and validating that only matching posts are displayed in the results.

**Acceptance Scenarios**:

1. **Given** a search interface, **When** typing a keyword, **Then** the post list filters to show only matching posts
2. **Given** a search that matches no posts, **When** viewing results, **Then** a "no results" message displays
3. **Given** a blog with posts, **When** clearing the search field, **Then** all posts are shown again

---

### User Story 4 - Filter Posts by Category (Priority: P4)

As a blog visitor, I want to filter posts by category so that I can browse content within my interests.

The system displays an available categories list and allows visitors to view posts in only selected categories. This complements the main post list view.

**Why this priority**: This enhances navigation and content discovery but is not required for MVP. It becomes important as the blog expands with multiple content categories.

**Independent Test**: Can be fully tested by clicking on a category filter and validating that only posts with that category are displayed.

**Acceptance Scenarios**:

1. **Given** posts with different Category values, **When** selecting a category filter, **Then** only posts with that category are displayed
2. **Given** an active category filter, **When** clicking the filter again, **Then** the filter is removed and all posts are shown

---

### User Story 5 - Optimize SEO with Structured Data (Priority: P2)

As a website owner, I want the blog to include proper SEO markup and sitemap so that search engines can properly index and rank the content.

The system automatically generates SEO metadata, structured data (JSON-LD), sitemap.xml, and robots.txt files. Each blog post includes appropriate metadata for search engine discovery.

**Why this priority**: SEO is important for organic traffic and aligns with the constitution's SEO optimization principle. It should be implemented early to maximize long-term discoverability.

**Independent Test**: Can be fully tested by verifying sitemap.xml contains all published posts, checking that meta tags are present in page HTML, validating JSON-LD schema structure, and confirming robots.txt is accessible.

**Acceptance Scenarios**:

1. **Given** the blog has 10 published posts, **When** visiting `/sitemap.xml`, **Then** all 10 posts are listed with correct URLs, lastmod dates, and priority values
2. **Given** any blog page, **When** viewing the page source, **Then** proper meta tags are present (title, description, og:image, canonical)
3. **Given** a blog post page, **When** inspecting the HTML head, **Then** a BlogPosting JSON-LD schema is present with author, datePublished, dateModified, and mainEntityOfPage
4. **Given** the blog root, **When** requesting `/robots.txt`, **Then** a robots.txt file is served that allows all crawlers and specifies the sitemap location
5. **Given** a Notion post with a custom "seo" field, **When** rendering the page, **Then** that content is used in the meta description instead of Summary

---

### User Story 6 - Handle Loading and Error States (Priority: P1)

As a blog visitor, I want to see clear feedback about what's happening (loading, errors, empty state) so that I understand the system status.

The system provides visual feedback during data loading (skeleton UI), displays user-friendly error messages when issues occur, and shows helpful guidance when no content is available.

**Why this priority**: This is essential for user experience. Without proper feedback, users will be confused during loading and frustrated by errors. It's part of MVP completeness.

**Independent Test**: Can be fully tested by triggering various states: simulating slow API responses (skeleton UI), API failures (error message), and an empty database (empty state message).

**Acceptance Scenarios**:

1. **Given** the homepage is loading blog posts, **When** the Notion API request is in progress, **Then** skeleton UI elements appear in place of post cards
2. **Given** the Notion API fails or returns an error, **When** the homepage loads, **Then** a user-friendly error message appears with suggestions to retry
3. **Given** a Notion database with no published posts, **When** viewing the homepage, **Then** an empty state message guides the user
4. **Given** a post detail page with an invalid slug, **When** the page loads, **Then** a 404 page displays with a link back to the homepage
5. **Given** a post detail page loading, **When** content is being fetched, **Then** a loading indicator appears

---

### User Story 7 - Optimize Performance (Priority: P2)

As a blog visitor, I want pages to load quickly regardless of network speed or image sizes so that I can access content without long wait times.

The system optimizes images (WebP format, proper dimensions), caches blog post listings, and uses static generation to minimize server load and improve perceived performance.

**Why this priority**: Performance aligns with the constitution's performance-first principle and directly impacts user experience. It should be built in from the start, not added later.

**Independent Test**: Can be fully tested by measuring Core Web Vitals metrics, verifying image optimization in network requests, checking that pages load within target time thresholds, and validating that caching reduces API calls.

**Acceptance Scenarios**:

1. **Given** a blog post with images, **When** loading the post on a 3G connection, **Then** the page becomes interactive in under 3.5 seconds (TTI target)
2. **Given** blog post images in the Notion database, **When** rendering on the frontend, **Then** images are served in WebP format with JPEG fallback
3. **Given** a visitor accessing the blog, **When** the homepage is initially cached, **Then** subsequent visits in the same session reuse cached data without new API calls
4. **Given** homepage access, **When** measuring Core Web Vitals, **Then** LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1
5. **Given** a blog post with a large hero image, **When** loading the page, **Then** the image is responsive and properly sized for the device viewport

### Edge Cases

- **Notion API Unavailable**: When Notion database is temporarily unavailable or network times out, display cached data with "Data may not be current" banner; if no cache, show error message with retry button
- **Many Images in Post**: When a post contains 10+ images, use lazy loading to load images only when they enter the viewport (loading="lazy" attribute)
- **Missing Category**: Posts without a Category value display "Uncategorized" in the category field
- **Missing Thumbnail**: Posts without an image in the Files property display a default placeholder image (blog logo or default image)
- **Duplicate Slugs**: When multiple posts have the same slug value, display only the first post found and log a warning to the console
- How does the system handle a post with missing or invalid slug values?
- What happens when a user accesses an archived or unpublished post directly via URL?
- How does the system handle posts with extremely long titles or summaries?
- What happens when the Notion database schema changes (e.g., missing Category or Summary fields)?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST retrieve published blog posts from a Notion database where the Published checkbox is marked as true
- **FR-002**: System MUST display blog posts sorted by Published Date in descending order (newest first)
- **FR-003**: System MUST render a responsive grid layout showing blog posts with 1 column on mobile (320px), 2 columns on tablet (768px), and 3 columns on desktop (1024px+)
- **FR-004**: Each blog post card MUST display the post title (Name), summary (Summary), published date (Published Date), category (Category or "Uncategorized" if empty), and thumbnail image (first image from Files property, or default placeholder image if Files is empty)
- **FR-005**: System MUST render each blog post at a unique URL using the post's slug: `/blog/[slug-value]`
- **FR-006**: Blog post detail page MUST display a hero image (full width) using the first image from the Files property, or a default placeholder image if Files is empty
- **FR-007**: Blog post detail page MUST display the post title, published date, and category prominently below the hero image
- **FR-008**: System MUST render the full Notion page content as readable HTML on the blog post detail page, preserving formatting and structure
- **FR-009**: Blog post detail page MUST include a navigation link or button to return to the homepage
- **FR-010**: System MUST generate a sitemap.xml file listing all published blog posts with URLs, lastmod dates, and priority values
- **FR-011**: System MUST generate a robots.txt file allowing all search engine crawlers and specifying the sitemap.xml location
- **FR-012**: Each blog post page MUST include BlogPosting JSON-LD structured data with author, datePublished, dateModified, and mainEntityOfPage fields
- **FR-013**: Each page MUST include dynamic meta tags for title, description, and og:image
- **FR-014**: If a post contains a "seo" field in Notion, that content MUST be used as the meta description; otherwise, use the Summary field
- **FR-015**: System MUST display a skeleton UI loading state while fetching blog posts from the Notion API
- **FR-016**: When Notion API fails or times out, system MUST display cached data (if available) with a banner stating "Data may not be current"; if no cache exists, display a user-friendly error message with a retry button
- **FR-017**: System MUST display an empty state message when the blog has no published posts
- **FR-018**: System MUST return a 404 page when accessing a blog post URL with an invalid or non-existent slug
- **FR-019**: System MUST optimize images by converting to WebP format with JPEG fallback, properly sizing for responsive display, and using lazy loading (loading="lazy") to load images only when they enter the viewport
- **FR-020**: System MUST cache blog post listing data to minimize Notion API calls within the same session
- **FR-021**: System SHOULD provide a search interface to filter posts by keyword in title and summary (P4 feature)
- **FR-022**: System SHOULD provide category filtering to display only posts with selected categories (P4 feature)
- **FR-023**: Blog images MUST include alt attributes for accessibility
- **FR-024**: All text MUST have sufficient color contrast (4.5:1 minimum) to meet WCAG 2.1 AA standards
- **FR-025**: Blog navigation MUST be fully accessible via keyboard navigation without requiring a mouse

### Key Entities

- **Blog Post**: Represents a published article in the Notion database with properties: Name (title), Slug (URL identifier), Published (boolean), Published Date (timestamp), Summary (short description), Category (select), Files (images), seo (optional description), and Notion page content (body)
- **Category**: Represents a topic classification for posts, used for filtering and organization

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Homepage loads and displays blog posts within 2 seconds on 3G networks, achieving a Time to Interactive (TTI) under 3.5 seconds
- **SC-002**: First Contentful Paint (FCP) is achieved within 1.8 seconds on 3G networks
- **SC-003**: Blog post detail pages achieve Largest Contentful Paint (LCP) within 2.5 seconds
- **SC-004**: All images are delivered in optimized format (WebP) with proper responsive sizing
- **SC-005**: Core Web Vitals metrics (LCP, FID, CLS) meet "Good" thresholds as defined in the Constitution
- **SC-006**: 100% of published blog posts appear in the generated sitemap.xml
- **SC-007**: All blog pages include valid, SEO-optimized meta tags and JSON-LD structured data
- **SC-008**: Users can navigate the entire blog (homepage, post list, individual posts) using only keyboard
- **SC-009**: All images have descriptive alt attributes and proper color contrast meets WCAG 2.1 AA (4.5:1 minimum)
- **SC-010**: Notion API failures trigger graceful error handling with user-friendly messaging
- **SC-011**: 95% of page loads show loading states within 500ms for slow connections
- **SC-012**: Blog post list data is successfully cached, reducing repeat API calls by 80% in same-session returns
- **SC-013**: Invalid post slugs return 404 pages instead of error states or blank pages

## Assumptions

1. **Notion Database Structure**: The Notion database has the required properties (Name, Slug, Published, Published Date, Summary, Category, Files). Optional properties (seo) are implemented only if present in the database.

2. **Authentication**: Notion API access is configured via environment variables (NOTION_API_KEY and NOTION_DATABASE_ID). The blog assumes authenticated, read-only access to the database.

3. **Static Generation Preference**: Posts are generated statically at build time or via Incremental Static Regeneration (ISR), not dynamically fetched on every request. The blog operates in a JAMstack paradigm.

4. **Image Storage**: Images are hosted in Notion Files property or external URLs that are accessible to the frontend. The system can fetch and optimize these images.

5. **URL Slugs**: Post slugs are unique and valid URL-safe values (lowercase, hyphens, no special characters). If duplicate slugs exist, the system displays only the first post found and logs a warning.

6. **Category Taxonomy**: Categories are predefined in the Notion Select property and don't require dynamic management. Users select from existing category options.

7. **Author Information**: For JSON-LD structured data, the blog author is configured globally (not per-post) via environment variables or a configuration file.

8. **Mobile-First Design**: The blog is designed mobile-first and enhanced for larger screens. Touch targets are at least 44x44px on mobile.

9. **No User Authentication**: This is a public-facing blog. No user login, comments, or user-specific functionality is required (can be added later).

10. **Internationalization**: Content is assumed to be in a single language. Multi-language support is not required for MVP.

## Constraints & Dependencies

- **External Dependency**: Notion API for content management (stable, documented API required)
- **Performance Budget**: Must meet Core Web Vitals targets as defined in Constitution (LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1)
- **SEO Requirements**: Full compliance with SEO optimization principle from Constitution (semantic HTML, meta tags, JSON-LD, sitemap)
- **Accessibility Requirement**: WCAG 2.1 AA compliance mandatory per Constitution
- **Build Performance**: Static generation or ISR strategy required to meet page load targets
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) supporting ES6+ JavaScript

## Out of Scope

- User authentication or login functionality
- Comment system or user interactions
- Admin panel for content management (Notion is the CMS)
- Email subscriptions or newsletters
- Social media sharing widgets
- Custom domain management (assumes domain is already configured)
- Multi-language or internationalization support
- Advanced analytics beyond standard web metrics
- Dark mode support
- RSS feed generation (can be added post-MVP)

## Clarifications

### Session 2026-02-04

- Q: When Notion API fails or times out, how should the system respond? → A: Display cached data if available with a banner indicating "Data may not be current". If no cache exists, show a user-friendly error message with a retry button.
- Q: How should the system optimize performance when a blog post has many images (10+)? → A: Use lazy loading to load images only when they enter the viewport (loading="lazy" attribute).
- Q: How should posts without a Category value be displayed? → A: Display as "Uncategorized".
- Q: How should posts without a thumbnail image in the Files property be displayed? → A: Use a default placeholder image (e.g., blog logo or default image).
- Q: How should duplicate slug values in the Notion database be handled? → A: Display only the first post found and log a warning to the console.
