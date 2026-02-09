# Implementation Plan: Notion Blog with CMS Integration

**Branch**: `001-notion-blog` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-notion-blog/spec.md`

## Summary

Build a public-facing blog system that uses Notion as a CMS. The blog fetches published posts from a Notion database, displays them in a responsive grid on the homepage, and renders full post content on individual pages using clean slug-based URLs. The system includes SEO optimization (sitemap.xml, robots.txt, JSON-LD), performance optimization (image optimization, lazy loading, caching), accessibility compliance (WCAG 2.1 AA), and graceful error handling.

**Technical Approach**: Next.js 14 App Router with TypeScript, Tailwind CSS for styling, Notion SDK for content fetching, static generation with ISR for performance, and WebP image optimization via next/image.

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode), Node.js 18.17+
**Primary Dependencies**: Next.js 14.2.0+, @notionhq/client (Notion SDK), notion-to-md, react-markdown, react-syntax-highlighter, Tailwind CSS 3.4+, date-fns, clsx
**Storage**: Notion database (external CMS); no local database required
**Testing**: Jest + React Testing Library (unit), Playwright (E2E for critical paths)
**Target Platform**: Web (SSG/ISR deployed to Vercel or similar hosting)
**Project Type**: Web application (frontend-only, JAMstack)
**Performance Goals**: LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1, TTI < 3.5s, FCP < 1.8s (per Constitution)
**Constraints**: Core Web Vitals "Good" range mandatory, WCAG 2.1 AA compliance, semantic HTML required, Notion API rate limits (3 requests/second)
**Scale/Scope**: ~10-100 blog posts initially, expected growth to 500+ posts; mobile-first responsive design (320px to 4K)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Performance First (Principle I)
✅ **PASS** - Static generation with ISR meets performance targets. Next.js Image optimization ensures WebP conversion and lazy loading. Notion API caching via `revalidate` reduces latency.

**Verification Strategy**:
- Lighthouse CI enforces LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1
- next/image automatically handles WebP conversion, responsive sizing, lazy loading
- ISR caching (revalidate: 3600) minimizes Notion API calls

### SEO Optimization (Principle II)
✅ **PASS** - Semantic HTML tags (article, header, nav), dynamic meta tags via generateMetadata, sitemap.xml and robots.txt auto-generation, BlogPosting JSON-LD schema.

**Verification Strategy**:
- All blog posts use `<article>` tag with proper heading hierarchy
- generateMetadata() generates title, description, og:image per post
- Sitemap includes all published posts with lastmod and priority
- JSON-LD schema includes author, datePublished, dateModified
- Alt attributes mandatory on all images (enforced in testing)

### Accessibility (Principle III)
✅ **PASS** - WCAG 2.1 AA compliance: 4.5:1 color contrast, full keyboard navigation, semantic HTML, ARIA labels where needed, screen reader testing required.

**Verification Strategy**:
- axe DevTools integration in Jest tests
- Manual screen reader testing (VoiceOver, NVDA) before deployment
- Focus indicators visible on all interactive elements (Tailwind focus-visible)
- Keyboard navigation tested via E2E tests (Tab order validation)

### UX Requirements (Principle IV)
✅ **PASS** - Mobile-first responsive design (320px to 4K), skeleton UI for loading states, user-friendly error messages, empty state guidance, cached data fallback.

**Verification Strategy**:
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
- Loading states tested via simulated slow network (Playwright)
- Error states tested via mocked API failures
- Touch targets ≥ 44x44px on mobile (verified in Figma/manual testing)

### Code Quality & Testing (Principle V)
✅ **PASS** - TypeScript strict mode, no `any` types without justification, unit tests for components/utilities, integration tests for Notion API (mocked), E2E tests for critical user flows.

**Verification Strategy**:
- TypeScript strict mode enabled in tsconfig.json
- Unit tests: Component rendering, utility functions, data transformations
- Integration tests: Notion API calls (mocked), error scenarios, cache behavior
- E2E tests: Homepage → post list → post detail → 404 page flow
- Test coverage target: 80% for critical paths

### Gates Summary
**Status**: ✅ ALL GATES PASS
**Proceed to Phase 0**: YES

## Project Structure

### Documentation (this feature)

```text
specs/001-notion-blog/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (current)
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (to be generated)
│   └── notion-api.md    # Notion API integration contract
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
/
├── .env.local                    # Environment variables (Git ignored)
├── .env.example                  # Environment variable template
├── .gitignore
├── next.config.mjs               # Next.js configuration
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
│
├── public/                       # Static assets
│   └── images/
│       └── placeholder.jpg       # Default thumbnail placeholder
│
└── src/
    ├── app/                      # Next.js App Router
    │   ├── layout.tsx            # Root layout (global metadata, fonts)
    │   ├── page.tsx              # Homepage (blog post list)
    │   ├── globals.css           # Global styles (Tailwind + custom)
    │   ├── loading.tsx           # Global loading UI
    │   ├── error.tsx             # Global error boundary
    │   │
    │   ├── robots.ts             # robots.txt generation (Route Handler)
    │   ├── sitemap.ts            # sitemap.xml generation (Route Handler)
    │   │
    │   └── blog/
    │       └── [slug]/
    │           ├── page.tsx      # Blog post detail page
    │           ├── loading.tsx   # Post detail loading UI
    │           └── not-found.tsx # 404 page
    │
    ├── components/               # React components
    │   ├── Header.tsx            # Blog header (navigation)
    │   ├── Footer.tsx            # Blog footer (copyright, links)
    │   ├── PostCard.tsx          # Post card component (list view)
    │   ├── PostContent.tsx       # Post content renderer (Markdown → HTML)
    │   ├── LoadingSpinner.tsx    # Loading spinner UI
    │   └── ErrorMessage.tsx      # Error message component
    │
    ├── lib/                      # Utility libraries
    │   ├── notion.ts             # Notion API client + fetch functions
    │   ├── markdown.ts           # Markdown conversion utilities
    │   ├── seo.ts                # SEO metadata generation
    │   └── utils.ts              # General utilities (date formatting, etc.)
    │
    └── types/                    # TypeScript type definitions
        └── notion.ts             # Notion database schema types
```

**Structure Decision**: Single web application using Next.js App Router. No backend API required; Notion SDK is used directly in React Server Components for data fetching. Static generation (SSG) with Incremental Static Regeneration (ISR) for performance.

## Complexity Tracking

No violations. All Constitution principles are satisfied without exceptions.

---

## Phase 0: Research & Technology Validation

**Status**: Ready to generate

**Research Topics**:
1. **Next.js 14 App Router best practices** - Verify generateMetadata, ISR, Route Handlers
2. **Notion SDK integration patterns** - Database queries, block retrieval, error handling
3. **notion-to-md usage** - Markdown conversion, block type support, image handling
4. **Image optimization strategy** - next/image configuration, WebP conversion, remote patterns
5. **Caching strategy** - ISR revalidate values, cache-control headers, stale-while-revalidate
6. **SEO implementation** - Sitemap generation, JSON-LD schema, meta tag structure
7. **Error handling patterns** - API failure recovery, cached data fallback, retry logic

**Output**: `research.md` with all findings and decisions

---

## Phase 1: Design & Contracts

**Status**: Pending (depends on Phase 0)

**Deliverables**:
1. **data-model.md** - Notion database schema, Post entity, Category entity
2. **contracts/notion-api.md** - Notion API integration contract (queries, error responses)
3. **quickstart.md** - Local setup guide (Notion Integration setup, env vars, npm commands)

**Output**: Design artifacts ready for task breakdown

---

## Phase 2: Task Breakdown

**Status**: Not started (requires /speckit.tasks command)

**Note**: Task breakdown is generated by the `/speckit.tasks` command after Phase 1 completion. This plan establishes the foundation for task generation.

---

## Next Steps

1. **Run Phase 0**: Generate `research.md` (automatic via this command)
2. **Run Phase 1**: Generate `data-model.md`, `contracts/`, `quickstart.md` (automatic via this command)
3. **Review artifacts**: Validate research findings and design decisions
4. **Run `/speckit.tasks`**: Generate task breakdown for implementation
5. **Run `/speckit.implement`**: Execute task-based implementation
