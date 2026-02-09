# Notion Blog Project Constitution

<!--
  Sync Impact Report (v1.0.0 → v1.0.0 - Initial Ratification)
  - Status: Initial constitution ratified with 5 core principles
  - Principles Defined: Performance, SEO, Accessibility, UX, Code Quality
  - Sections: Core Principles, Performance Standards, SEO Requirements,
              Accessibility Standards, UX Requirements, Code Quality & Testing, Governance
  - All dependent templates require review for alignment
-->

## Core Principles

### I. Performance First

All pages must achieve Core Web Vitals in the "Good" range:
- **Largest Contentful Paint (LCP)**: ≤ 2.5 seconds
- **First Input Delay (FID)**: ≤ 100 milliseconds
- **Cumulative Layout Shift (CLS)**: ≤ 0.1
- **Page load time**: < 2 seconds on 3G networks
- **Time to Interactive (TTI)**: < 3.5 seconds
- **First Contentful Paint (FCP)**: < 1.8 seconds

Performance is non-negotiable. Every new feature must be evaluated for performance impact. Images must be optimized (WebP with JPEG fallback, lazy-loaded). Code splitting and dynamic imports required for route-based chunks. No third-party scripts without performance justification.

### II. SEO Optimization

Search engine optimization is mandatory for all content:
- **Semantic HTML**: article, header, footer, nav, section tags required (not divs)
- **Image optimization**: Every image MUST have descriptive alt attributes
- **Meta tags**: Dynamic generation of title, description, og:image per page
- **Robots & Sitemap**: robots.txt and sitemap.xml auto-generated and updated
- **Structured Data**: JSON-LD schema (BlogPosting, Organization) required for all blog posts
- **URL structure**: Clean, descriptive, lowercase with hyphens (no underscores)

All blog posts must include open graph metadata and canonical tags. Heading hierarchy must be logical (no skipped levels). Ensure proper link text and anchor relationships.

### III. Accessibility (WCAG 2.1 AA)

Accessibility compliance is non-optional:
- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard navigation**: Full keyboard support without mouse requirement
- **Screen reader compatibility**: Proper ARIA labels, roles, and live regions
- **Focus management**: Visible focus indicators on all interactive elements
- **Motion**: Respect prefers-reduced-motion; no auto-playing animations
- **Forms**: Labels properly associated with inputs; error messages explicit

All interactive components must support keyboard navigation. Testing with screen readers (NVDA, JAWS, VoiceOver) required before merge.

### IV. User Experience (UX)

User experience drives adoption and retention:
- **Responsive design**: Mobile-first approach; full support for 320px to 4K displays
- **Loading states**: Skeleton screens or spinners for async operations
- **Error handling**: Clear, friendly error messages; actionable remediation
- **Empty states**: Guidance when no content available (empty blog, no results)
- **Visual feedback**: Button states (hover, active, disabled) clearly indicated
- **Performance perception**: Fast perceived performance through progressive rendering

Mobile experience is primary; desktop is enhanced. All interactive elements must have hover and focus states. Loading times should be visually communicated.

### V. Code Quality & Testing

High code quality ensures maintainability and reliability:
- **TypeScript**: Strict mode mandatory; no `any` types without justification
- **Testing strategy**: Unit + integration + E2E tests for critical paths
- **Unit tests**: Component rendering, utility functions, data transformations
- **Integration tests**: Notion API calls (mocked), data flows, error scenarios
- **Error coverage**: API failures, invalid slugs, network timeouts, 404s
- **Code review**: Two reviewers required; constitution compliance is blocking

Tests must verify both happy path and error cases. Notion API calls must use mocks (no live API in tests). Critical user flows require E2E test coverage. Test files must be collocated with source files.

## Performance Standards

Performance metrics are measured continuously:

- Use Lighthouse CI to enforce performance budgets in CI/CD pipeline
- Monitor Core Web Vitals via Next.js Analytics or similar
- All assets must be optimized: images (WebP), fonts (subset), CSS (purged)
- Server-side rendering for blog pages to maximize FCP
- Static generation preferred; incremental static regeneration (ISR) for dynamic content
- No unused dependencies; regular audits via `npm audit`

Violations of performance thresholds block deployment. Performance regressions require mitigation strategy before merge.

## SEO Requirements

SEO implementation is verified per post:

- Blog post template generates all required meta tags dynamically
- Sitemap includes all blog posts with lastmod and priority
- robots.txt disallows admin routes, allows public content
- JSON-LD schema includes author, datePublished, dateModified, mainEntityOfPage
- Image optimization pipeline converts to WebP, sets proper dimensions
- Internal linking strategy documented; cross-references encouraged
- No duplicate content; canonical tags prevent pagination issues

SEO audits required for new features or content changes. Tools: Google Search Console integration, Lighthouse SEO checks in CI.

## Accessibility Standards

Accessibility is verified through automated and manual testing:

- Automated: axe DevTools in CI pipeline for violations
- Manual: Screen reader testing (NVDA on Windows, VoiceOver on macOS)
- Contrast verification: Use WebAIM contrast checker for all color combinations
- Keyboard testing: Tab through entire application; ensure logical order
- Focus indicators: Visible outline (min 2px) on all interactive elements
- ARIA labels: Use aria-label where visual labels insufficient

All new features must pass accessibility audit before merge. Accessibility issues are treated as bugs, not enhancements.

## UX Requirements

User experience decisions are guided by usability principles:

- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- Touch targets: Minimum 44x44px for interactive elements on mobile
- Typography: Readable sizes (min 16px body), appropriate line-height (1.5-1.6)
- Navigation: Clear primary navigation; breadcrumbs for deep content
- Feedback: Every action produces immediate visual feedback
- Accessibility: Every UX decision must support accessibility standards (III)

Form validation should provide real-time feedback. Error recovery should be obvious. "Happy path" should require no documentation.

## Development Workflow

Implementation must follow this process:

1. **Specification**: Feature must be spec'd with acceptance criteria linked to constitution principles
2. **Planning**: Implementation plan created; constitution compliance identified
3. **Implementation**: Code written with principle compliance as acceptance criteria
4. **Testing**: Unit, integration, and (for critical paths) E2E tests written; all pass
5. **Review**: Minimum two reviewers; explicit constitution compliance verification
6. **Deployment**: Automated checks pass (Lighthouse, accessibility audit, type checking)

No feature bypasses testing or review. Constitution violations are blocking feedback, not suggestions. Performance regressions are treated as critical bugs.

## Governance

This Constitution supersedes all other practices and guidelines. All pull requests, feature approvals, and code reviews must verify compliance with these principles.

**Amendment Process**:
- Proposed amendments require written rationale explaining principle change or addition
- Amendments require approval from project lead and at least one other maintainer
- Amendment document must specify version bump rationale (MAJOR/MINOR/PATCH)
- All affected templates (.specify/templates/) must be reviewed and updated
- Migration plan required if amendment affects existing implementations

**Compliance Verification**:
- Code reviews must explicitly check constitution compliance
- Non-compliance is blocking feedback; no exceptions without amendment
- Performance violations are treated as critical issues
- SEO and accessibility requirements are non-optional; not style preferences

**Version Policy**:
- MAJOR: Principle removal or fundamental redefinition (backward incompatible)
- MINOR: New principle addition or materially expanded principle guidance
- PATCH: Clarifications, wording improvements, metric refinements (no semantic change)

Use [README.md](README.md) for runtime development guidance. Reference this Constitution in code review checklists and deployment gates.

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
