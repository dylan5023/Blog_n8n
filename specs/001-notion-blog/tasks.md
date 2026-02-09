# Tasks: Notion Blog with CMS Integration

**Input**: Design documents from `/specs/001-notion-blog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included as this is a production-grade blog with Constitution requirements for 80% coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Project structure per plan.md:
- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/lib/` - Utility libraries
- `src/types/` - TypeScript type definitions
- `.env.local` - Environment variables (Git ignored)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 15 project with TypeScript and Tailwind CSS in repository root
- [x] T002 [P] Install dependencies: @notionhq/client, notion-to-md, react-markdown, react-syntax-highlighter, date-fns, clsx
- [x] T003 [P] Install dev dependencies: Jest, React Testing Library, Playwright, @types packages
- [x] T004 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T005 [P] Configure Tailwind CSS in tailwind.config.ts with responsive breakpoints (320px, 768px, 1024px, 1440px)
- [x] T006 [P] Configure ESLint and Prettier for code quality
- [x] T007 [P] Create .env.example with required environment variables (NOTION_API_KEY, NOTION_DATABASE_ID, NEXT_PUBLIC_BASE_URL, etc.)
- [x] T008 [P] Configure next.config.mjs with remotePatterns for Notion images (amazonaws.com, notion.so)
- [x] T009 [P] Create public/images/placeholder.jpg for default thumbnails
- [x] T010 [P] Setup Jest configuration with React Testing Library in jest.config.js
- [x] T011 [P] Setup Playwright configuration for E2E tests in playwright.config.ts

**Checkpoint**: ✅ Project structure ready, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Create TypeScript types for Notion database schema in src/types/notion.ts
- [x] T013 [P] Initialize Notion client in src/lib/notion.ts with API key authentication
- [x] T014 [P] Implement Notion API retry logic with exponential backoff in src/lib/notion.ts
- [x] T015 [P] Create utility functions for date formatting in src/lib/utils.ts using date-fns
- [x] T016 [P] Create SEO metadata generation utilities in src/lib/seo.ts
- [x] T017 [P] Setup globals.css with Tailwind directives and custom styles in src/app/globals.css
- [x] T018 Create root layout with metadata and fonts in src/app/layout.tsx
- [x] T019 [P] Create Header component in src/components/Header.tsx
- [x] T020 [P] Create Footer component in src/components/Footer.tsx
- [x] T021 [P] Create LoadingSpinner component in src/components/LoadingSpinner.tsx
- [x] T022 [P] Create ErrorMessage component in src/components/ErrorMessage.tsx

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Published Blog Posts (Priority: P1) 🎯 MVP

**Goal**: Display a list of published blog posts on the homepage with responsive grid layout

**Independent Test**: Navigate to homepage (`/`), verify posts display in correct grid layout (1-col mobile, 2-col tablet, 3-col desktop) with all metadata (title, summary, date, category, thumbnail)

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T023 [P] [US1] Unit test for transformNotionPageToPost() in src/lib/__tests__/notion.test.ts
- [ ] T024 [P] [US1] Integration test for getPublishedPosts() with mocked Notion API in src/lib/__tests__/notion.integration.test.ts
- [x] T025 [P] [US1] Component test for PostCard with sample data in src/components/__tests__/PostCard.test.tsx
- [ ] T026 [P] [US1] E2E test for homepage post list in tests/e2e/homepage.spec.ts

### Implementation for User Story 1

- [x] T027 [US1] Implement getPublishedPosts() function in src/lib/notion.ts (query database, filter Published=true, sort by Published Date desc)
- [x] T028 [US1] Implement transformNotionPageToPost() in src/lib/notion.ts (handle missing Category → "Uncategorized", missing Files → null)
- [x] T029 [P] [US1] Create PostCard component in src/components/PostCard.tsx with thumbnail, title, summary, date, category
- [x] T030 [P] [US1] Implement responsive image handling in PostCard with default placeholder fallback
- [x] T031 [US1] Implement homepage in src/app/page.tsx fetching posts via getPublishedPosts() with ISR revalidate=3600
- [x] T032 [US1] Implement responsive grid layout in src/app/page.tsx (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- [x] T033 [US1] Implement empty state message in src/app/page.tsx when no posts exist
- [x] T034 [US1] Add skeleton loading state in src/app/loading.tsx for homepage

**Checkpoint**: ✅ Homepage displays published posts in responsive grid; empty state and loading states work correctly

---

## Phase 4: User Story 2 - Read Individual Blog Post (Priority: P1) 🎯 MVP

**Goal**: Render full blog post content on dedicated page with clean slug-based URL

**Independent Test**: Click post from homepage, verify URL is `/blog/[slug]`, full content renders with hero image, metadata, and Markdown formatting

### Tests for User Story 2

- [ ] T035 [P] [US2] Unit test for getPostBySlug() in src/lib/__tests__/notion.test.ts
- [ ] T036 [P] [US2] Unit test for Markdown conversion in src/lib/__tests__/markdown.test.ts
- [ ] T037 [P] [US2] Component test for PostContent renderer in src/components/__tests__/PostContent.test.tsx
- [ ] T038 [P] [US2] E2E test for post detail page in tests/e2e/post-detail.spec.ts
- [ ] T039 [P] [US2] E2E test for 404 page with invalid slug in tests/e2e/post-detail.spec.ts

### Implementation for User Story 2

- [ ] T040 [US2] Implement getPostBySlug() function in src/lib/notion.ts (query by slug, retrieve page blocks, handle duplicates with console warning)
- [ ] T041 [US2] Implement Notion blocks to Markdown conversion in src/lib/markdown.ts using notion-to-md
- [ ] T042 [P] [US2] Create PostContent component in src/components/PostContent.tsx rendering Markdown with react-markdown
- [ ] T043 [P] [US2] Configure code syntax highlighting in PostContent using react-syntax-highlighter
- [ ] T044 [P] [US2] Implement lazy loading for images in PostContent (loading="lazy" attribute)
- [ ] T045 [US2] Implement post detail page in src/app/blog/[slug]/page.tsx with hero image and metadata
- [ ] T046 [US2] Implement generateMetadata() in src/app/blog/[slug]/page.tsx for dynamic SEO (title, description, og:image)
- [ ] T047 [US2] Implement 404 handling in src/app/blog/[slug]/not-found.tsx with link to homepage
- [ ] T048 [US2] Add loading state in src/app/blog/[slug]/loading.tsx
- [ ] T049 [US2] Add ISR configuration (revalidate=3600) to post detail page

**Checkpoint**: Post detail pages render correctly with all content types; 404 works for invalid slugs; SEO meta tags present

---

## Phase 5: User Story 6 - Handle Loading and Error States (Priority: P1) 🎯 MVP

**Goal**: Provide clear feedback about loading, errors, and empty states

**Independent Test**: Simulate slow network (skeleton UI), API failure (error message), empty database (empty state message)

### Tests for User Story 6

- [ ] T050 [P] [US6] Integration test for API error handling with cached fallback in src/lib/__tests__/notion.integration.test.ts
- [ ] T051 [P] [US6] E2E test for skeleton UI during loading in tests/e2e/loading-states.spec.ts
- [ ] T052 [P] [US6] E2E test for error state with retry button in tests/e2e/error-states.spec.ts

### Implementation for User Story 6

- [ ] T053 [US6] Implement error boundary in src/app/error.tsx with user-friendly message and retry button
- [ ] T054 [US6] Implement cached data fallback in src/lib/notion.ts with banner message for stale data
- [ ] T055 [US6] Add error handling for API failures in getPublishedPosts() and getPostBySlug()
- [ ] T056 [US6] Enhance skeleton UI in src/app/loading.tsx and src/app/blog/[slug]/loading.tsx

**Checkpoint**: Loading states, error states, and empty states all display correctly; cached fallback works

---

## Phase 6: User Story 7 - Optimize Performance (Priority: P2)

**Goal**: Meet Core Web Vitals targets (LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1)

**Independent Test**: Measure Core Web Vitals via Lighthouse; verify image optimization in network tab; confirm caching reduces API calls

### Tests for User Story 7

- [ ] T057 [P] [US7] Lighthouse CI test for performance metrics in tests/lighthouse/performance.test.js
- [ ] T058 [P] [US7] E2E test for image lazy loading in tests/e2e/performance.spec.ts

### Implementation for User Story 7

- [ ] T059 [P] [US7] Configure next/image optimization with sizes attribute in PostCard and post detail page
- [ ] T060 [P] [US7] Add priority attribute to above-the-fold images (hero image)
- [ ] T061 [P] [US7] Verify ISR caching is active (revalidate=3600) on homepage and post pages
- [ ] T062 [P] [US7] Implement stale-while-revalidate headers in fetch calls
- [ ] T063 [P] [US7] Optimize Tailwind CSS by purging unused styles (postcss.config.js)

**Checkpoint**: Lighthouse score ≥90 Performance, Core Web Vitals in "Good" range, images optimized to WebP

---

## Phase 7: User Story 5 - Optimize SEO with Structured Data (Priority: P2)

**Goal**: Generate sitemap.xml, robots.txt, and JSON-LD structured data for search engines

**Independent Test**: Verify `/sitemap.xml` contains all posts, `/robots.txt` accessible, JSON-LD schema present in page HTML

### Tests for User Story 5

- [ ] T064 [P] [US5] Unit test for sitemap generation in src/app/__tests__/sitemap.test.ts
- [ ] T065 [P] [US5] Unit test for JSON-LD schema structure in src/lib/__tests__/seo.test.ts
- [ ] T066 [P] [US5] E2E test for sitemap.xml content in tests/e2e/seo.spec.ts

### Implementation for User Story 5

- [ ] T067 [P] [US5] Implement sitemap.xml generation in src/app/sitemap.ts including all published posts with lastmod and priority
- [ ] T068 [P] [US5] Implement robots.txt generation in src/app/robots.ts allowing all crawlers
- [ ] T069 [US5] Implement JSON-LD BlogPosting schema generator in src/lib/seo.ts
- [ ] T070 [US5] Add JSON-LD script tag to post detail page in src/app/blog/[slug]/page.tsx
- [ ] T071 [US5] Verify all meta tags (title, description, og:image, canonical) in generateMetadata()
- [ ] T072 [US5] Implement SEO field override (seo property overrides Summary in meta description)

**Checkpoint**: Sitemap.xml lists all posts, robots.txt accessible, JSON-LD schema validates, all meta tags present

---

## Phase 8: User Story 3 - Search for Blog Posts (Priority: P4) ⚠️ Post-MVP

**Goal**: Client-side search filtering posts by title and summary

**Independent Test**: Type keyword in search box, verify only matching posts display; clear search shows all posts

### Tests for User Story 3

- [ ] T073 [P] [US3] Component test for SearchBar in src/components/__tests__/SearchBar.test.tsx
- [ ] T074 [P] [US3] E2E test for search functionality in tests/e2e/search.spec.ts

### Implementation for User Story 3

- [ ] T075 [P] [US3] Create SearchBar component in src/components/SearchBar.tsx with controlled input
- [ ] T076 [US3] Implement client-side filter logic in src/app/page.tsx filtering posts by title/summary
- [ ] T077 [US3] Add "no results" message when search returns empty
- [ ] T078 [US3] Add clear search button to reset filter

**Checkpoint**: Search filters posts correctly, "no results" message appears when appropriate

---

## Phase 9: User Story 4 - Filter Posts by Category (Priority: P4) ⚠️ Post-MVP

**Goal**: Filter posts by category selection

**Independent Test**: Click category filter, verify only posts with that category display; click again to remove filter

### Tests for User Story 4

- [ ] T079 [P] [US4] Component test for CategoryFilter in src/components/__tests__/CategoryFilter.test.tsx
- [ ] T080 [P] [US4] E2E test for category filtering in tests/e2e/category-filter.spec.ts

### Implementation for User Story 4

- [ ] T081 [P] [US4] Create CategoryFilter component in src/components/CategoryFilter.tsx listing all categories
- [ ] T082 [US4] Implement category filter logic in src/app/page.tsx
- [ ] T083 [US4] Add active state styling for selected category
- [ ] T084 [US4] Implement "clear filter" functionality

**Checkpoint**: Category filtering works, active states visible, clear filter works

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T085 [P] Run Lighthouse audit and fix any remaining issues
- [ ] T086 [P] Run axe DevTools accessibility audit and fix violations
- [ ] T087 [P] Verify WCAG 2.1 AA color contrast (4.5:1 minimum)
- [ ] T088 [P] Test keyboard navigation (Tab through all interactive elements)
- [ ] T089 [P] Test screen reader compatibility (VoiceOver/NVDA)
- [ ] T090 [P] Verify all images have descriptive alt attributes
- [ ] T091 [P] Create comprehensive README.md with setup instructions
- [ ] T092 [P] Update .env.example with all required variables
- [ ] T093 [P] Code cleanup and refactoring (remove console.logs, unused imports)
- [ ] T094 Run all tests (unit, integration, E2E) and ensure 80%+ coverage
- [ ] T095 Validate quickstart.md by following all steps from scratch
- [ ] T096 [P] Add TypeScript strict mode violations check (no `any` without justification)

**Checkpoint**: All Constitution requirements met, all tests passing, documentation complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1 (P1): Homepage post list - No story dependencies
  - US2 (P1): Post detail page - No story dependencies (independent)
  - US6 (P1): Error/loading states - Enhances US1 & US2
  - US7 (P2): Performance - Optimizes US1 & US2
  - US5 (P2): SEO - Enhances US1 & US2
  - US3 (P4): Search - Adds to US1
  - US4 (P4): Category filter - Adds to US1
- **Polish (Phase 10)**: Depends on all P1-P2 user stories being complete

### User Story Dependencies

**MVP (P1) - Must Complete First**:
- **User Story 1**: Homepage - Can start after Foundational
- **User Story 2**: Post detail - Can start after Foundational (independent from US1)
- **User Story 6**: Error handling - Can start after US1 & US2 implementation

**Post-MVP (P2) - Complete After MVP**:
- **User Story 7**: Performance - Depends on US1 & US2 being functional
- **User Story 5**: SEO - Depends on US1 & US2 being functional

**Future Enhancements (P4) - Optional**:
- **User Story 3**: Search - Depends on US1 (homepage)
- **User Story 4**: Category filter - Depends on US1 (homepage)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- TypeScript types before functions
- Utilities before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- All tasks T002-T011 can run in parallel (different files)

**Foundational Phase (Phase 2)**:
- All tasks T013-T022 can run in parallel (different files)

**User Story 1**:
- Tests T023-T026 can run in parallel
- Components T029-T030 can run in parallel

**User Story 2**:
- Tests T035-T039 can run in parallel
- Components T042-T044 can run in parallel

**Performance (US7)**:
- All tasks T059-T063 can run in parallel

**SEO (US5)**:
- Tasks T067-T068 can run in parallel

**Once Foundational completes**: US1, US2 can be developed in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for transformNotionPageToPost() in src/lib/__tests__/notion.test.ts"
Task: "Integration test for getPublishedPosts() in src/lib/__tests__/notion.integration.test.ts"
Task: "Component test for PostCard in src/components/__tests__/PostCard.test.tsx"
Task: "E2E test for homepage in tests/e2e/homepage.spec.ts"

# Launch all components for User Story 1 together:
Task: "Create PostCard component in src/components/PostCard.tsx"
Task: "Implement responsive image handling in PostCard"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Unit test for getPostBySlug() in src/lib/__tests__/notion.test.ts"
Task: "Unit test for Markdown conversion in src/lib/__tests__/markdown.test.ts"
Task: "Component test for PostContent in src/components/__tests__/PostContent.test.tsx"
Task: "E2E test for post detail in tests/e2e/post-detail.spec.ts"

# Launch all components for User Story 2 together:
Task: "Create PostContent component in src/components/PostContent.tsx"
Task: "Configure code syntax highlighting in PostContent"
Task: "Implement lazy loading for images in PostContent"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 6 Only - P1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Homepage)
4. Complete Phase 4: User Story 2 (Post detail)
5. Complete Phase 5: User Story 6 (Error/loading states)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Run Lighthouse and verify Core Web Vitals
8. Deploy/demo MVP

**MVP Definition**: A functional blog that displays posts (US1), renders full content (US2), and handles errors gracefully (US6).

### Incremental Delivery

1. **Foundation** (Phase 1-2) → Infrastructure ready
2. **MVP** (Phase 3-5) → Basic blog functional → Deploy
3. **Performance** (Phase 6-7) → Optimized blog → Deploy
4. **Search** (Phase 8) → Enhanced discoverability → Deploy
5. **Category Filter** (Phase 9) → Complete feature set → Deploy

Each deployment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together**
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Homepage)
   - **Developer B**: User Story 2 (Post detail)
   - **Developer C**: User Story 6 (Error handling)
3. After MVP:
   - **Developer A**: User Story 7 (Performance)
   - **Developer B**: User Story 5 (SEO)
   - **Developer C**: User Story 3 (Search)
4. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 96
- **Phase 1 (Setup)**: 11 tasks
- **Phase 2 (Foundational)**: 11 tasks (CRITICAL BLOCKER)
- **Phase 3 (US1 - Homepage)**: 12 tasks (8 implementation + 4 tests)
- **Phase 4 (US2 - Post Detail)**: 15 tasks (10 implementation + 5 tests)
- **Phase 5 (US6 - Error States)**: 7 tasks (4 implementation + 3 tests)
- **Phase 6 (US7 - Performance)**: 7 tasks (5 implementation + 2 tests)
- **Phase 7 (US5 - SEO)**: 9 tasks (6 implementation + 3 tests)
- **Phase 8 (US3 - Search)**: 6 tasks (4 implementation + 2 tests) ⚠️ Post-MVP
- **Phase 9 (US4 - Category Filter)**: 6 tasks (4 implementation + 2 tests) ⚠️ Post-MVP
- **Phase 10 (Polish)**: 12 tasks

**MVP Scope**: Phases 1-5 (56 tasks) = User Stories 1, 2, 6 (P1 priorities)

**Parallel Opportunities**: 45 tasks marked [P] can run in parallel

**Independent Test Criteria**:
- US1: Homepage displays posts in responsive grid
- US2: Post detail page renders full content with SEO
- US6: Error states and loading states work correctly
- US7: Core Web Vitals in "Good" range
- US5: Sitemap.xml, robots.txt, JSON-LD present
- US3: Search filters posts by keyword
- US4: Category filter works

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliance (WCAG 2.1 AA, Core Web Vitals, SEO) enforced in Phase 10
- MVP = Phases 1-5 only (homepage + post detail + error handling)
- P4 priorities (Search, Category Filter) are optional enhancements
