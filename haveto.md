# Spec Kit으로 Notion 블로그 만들기 - 단계별 가이드

이 문서는 Spec Kit의 명세 기반 개발(SDD) 방식을 사용하여 Notion을 CMS로 활용하는 블로그를 구축하는 전체 과정을 안내합니다.

---

## 📋 목차

1. [사전 준비](#사전-준비)
2. [1단계: 프로젝트 초기화](#1단계-프로젝트-초기화)
3. [2단계: 프로젝트 헌법 수립](#2단계-프로젝트-헌법-수립)
4. [3단계: 기능 명세 작성](#3단계-기능-명세-작성)
5. [4단계: 명확화 (선택사항)](#4단계-명확화-선택사항)
6. [5단계: 기술 구현 계획](#5단계-기술-구현-계획)
7. [6단계: 작업 목록 생성](#6단계-작업-목록-생성)
8. [7단계: 구현 실행](#7단계-구현-실행)
9. [8단계: Notion 설정](#8단계-notion-설정)
10. [9단계: 배포](#9단계-배포)
11. [검증 및 테스트](#검증-및-테스트)

---

## 사전 준비

### 필요한 도구

1. **Python 3.11+** 및 **uv** 패키지 매니저
2. **Git**
3. **Node.js 18+** 및 **npm/yarn/pnpm**
4. **AI 코딩 에이전트** (Claude Code, GitHub Copilot, Cursor 등)
5. **Notion 계정** 및 워크스페이스

### Spec Kit 설치

```bash
# Specify CLI 전역 설치
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 설치 확인
specify --help
specify check
```

---

## 1단계: 프로젝트 초기화

### 1.1 새 프로젝트 생성

```bash
# 새 프로젝트 디렉토리 생성 및 초기화
specify init notion-blog --ai claude

# 프로젝트 디렉토리로 이동
cd notion-blog
```

**출력 예시**:
```
███████╗██████╗ ███████╗ ██████╗██╗███████╗██╗   ██╗
██╔════╝██╔══██╗██╔════╝██╔════╝██║██╔════╝╚██╗ ██╔╝
███████╗██████╔╝█████╗  ██║     ██║█████╗   ╚████╔╝
╚════██║██╔═══╝ ██╔══╝  ██║     ██║██╔══╝    ╚██╔╝
███████║██║     ███████╗╚██████╗██║██║        ██║
╚══════╝╚═╝     ╚══════╝ ╚═════╝╚═╝╚═╝        ╚═╝

GitHub Spec Kit - Spec-Driven Development Toolkit

Specify Project Setup

Project         notion-blog
Working Path    /Users/yourname/projects

✓ Prerequisites validated
✓ Selected AI assistant: claude
✓ Fetch latest release
✓ Download template
✓ Extract template
✓ Initialize git repository
✓ Project ready
```

### 1.2 AI 에이전트 실행

```bash
# Claude Code 실행 (또는 선택한 AI 에이전트)
claude
```

슬래시 명령어가 사용 가능한지 확인:
- `/speckit.constitution`
- `/speckit.specify`
- `/speckit.plan`
- `/speckit.tasks`
- `/speckit.implement`

---

## 2단계: 프로젝트 헌법 수립

### 2.1 Constitution 명령 실행

AI 에이전트 내에서 다음 명령을 입력합니다:

```
/speckit.constitution 다음 원칙을 중심으로 Notion 블로그 프로젝트의 헌법을 만들어주세요:

1. 성능 우선
   - Core Web Vitals 모든 지표 녹색 (Good) 달성
   - 페이지 로드 시간 < 2초 (3G 네트워크 기준)
   - Time to Interactive (TTI) < 3.5초
   - First Contentful Paint (FCP) < 1.8초

2. SEO 최적화
   - 시맨틱 HTML 필수 사용 (article, header, footer, nav, section)
   - 모든 이미지는 alt 속성 필수
   - 동적 메타 태그 생성 (title, description, og:image)
   - robots.txt 및 sitemap.xml 자동 생성
   - 구조화된 데이터 (JSON-LD) 포함

3. 접근성 (Accessibility)
   - WCAG 2.1 AA 준수
   - 키보드 네비게이션 완전 지원
   - 색상 대비비 최소 4.5:1
   - 스크린 리더 호환성

4. 사용자 경험 (UX)
   - 반응형 디자인 필수 (모바일 우선)
   - 로딩 상태 명확한 표시
   - 에러 상태 사용자 친화적 메시지
   - 빈 상태 (empty state) 안내

5. 코드 품질
   - TypeScript strict mode 사용
   - ESLint, Prettier 설정 필수
   - 컴포넌트는 단일 책임 원칙
   - 재사용 가능한 유틸리티 함수 작성

6. Notion 연동 원칙
   - Notion API 호출 최소화 (캐싱 활용)
   - API 호출 실패 시 graceful degradation
   - Notion 데이터 구조 변경에 대한 방어적 코드
   - 환경 변수로 민감 정보 관리

7. 보안
   - 환경 변수는 .env.local에만 저장
   - .env 파일은 절대 Git 커밋하지 않음
   - API 키는 서버 사이드에서만 사용
   - 사용자 입력 검증 및 sanitization

8. 테스트 전략
   - 주요 페이지 렌더링 테스트
   - Notion API 호출 모킹 테스트
   - 에러 케이스 테스트 (API 실패, 잘못된 Slug 등)

이 헌법은 프로젝트의 모든 의사결정에서 우선순위를 두고 준수해야 합니다.
헌법을 위반하는 코드는 리뷰에서 거부됩니다.
```

### 2.2 생성된 파일 확인

```bash
# 헌법 파일 확인
cat .specify/memory/constitution.md
```

**예상 출력**:
```markdown
# Notion 블로그 프로젝트 헌법

## 핵심 원칙

### I. 성능 우선
모든 페이지는 Core Web Vitals의 "Good" 기준을 충족해야 합니다.
- LCP (Largest Contentful Paint) < 2.5초
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

### II. SEO 최적화
검색 엔진 최적화는 필수입니다:
- 시맨틱 HTML 사용
- 동적 메타 태그 (title, description, Open Graph)
- robots.txt, sitemap.xml 자동 생성
- 구조화된 데이터 (Schema.org)

### III. 접근성
WCAG 2.1 AA 준수:
- 키보드만으로 모든 기능 접근 가능
- 스크린 리더 호환
- 색상 대비비 4.5:1 이상

...
```

---

## 3단계: 기능 명세 작성

### 3.1 Specify 명령 실행

AI 에이전트 내에서 다음 명령을 입력합니다:

> **중요**: 이 단계에서는 **기술 스택을 언급하지 않습니다**. "무엇을" 만들 것인지만 설명합니다.

```
/speckit.specify Notion 데이터베이스를 콘텐츠 관리 시스템(CMS)으로 사용하는 개인 블로그를 만듭니다.

사용자 시나리오 및 요구사항:

=== 우선순위 P1: 핵심 기능 (MVP) ===

1. 블로그 게시글 목록 페이지
   - Notion 데이터베이스에서 "Published" 체크박스가 활성화된 게시글만 표시
   - "Published Date" 기준으로 최신순 정렬
   - 각 게시글 카드에 다음 정보 표시:
     * 제목 (Name 속성)
     * 요약 (Summary 속성)
     * 발행일 (Published Date 속성)
     * 카테고리 (Category 속성)
     * 썸네일 이미지 (Files 속성의 첫 번째 이미지)
   - 반응형 그리드 레이아웃 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열)

2. 게시글 상세 페이지
   - URL 구조: `/blog/[slug]` (Slug 속성 값 사용)
   - 페이지 최상단에 썸네일 이미지 전체 폭으로 표시
   - 제목, 발행일, 카테고리 표시
   - Notion 페이지의 전체 콘텐츠를 HTML로 렌더링:
     * 제목 (H1, H2, H3)
     * 단락 (Paragraph)
     * 목록 (Bulleted, Numbered)
     * 코드 블록 (구문 강조 포함)
     * 인용구 (Quote)
     * 이미지 (Caption 포함)
     * 링크
   - 각 페이지에 고유한 제목(title)과 설명(meta description) 설정

3. SEO 기본 설정
   - 각 페이지 동적 메타 태그 (title, description)
   - Open Graph 메타 태그 (og:title, og:description, og:image)
   - 시맨틱 HTML 태그 사용 (article, header, footer, nav)

=== 우선순위 P2: 사용자 경험 개선 ===

4. 네비게이션
   - 블로그 헤더: 블로그 제목, 홈 링크
   - 블로그 푸터: 저작권 정보, 소셜 링크 (선택사항)

5. 로딩 및 에러 상태
   - 목록 페이지 로딩 중 스켈레톤 UI 표시
   - 게시글이 없을 때 빈 상태 메시지
   - 잘못된 slug 접근 시 404 페이지
   - Notion API 오류 시 사용자 친화적 에러 메시지

6. 성능 최적화
   - 이미지 최적화 (자동 리사이징, WebP 변환)
   - 게시글 목록 데이터 캐싱 (Notion API 호출 최소화)

=== 우선순위 P3: 고급 SEO ===

7. robots.txt 생성
   - 모든 검색 엔진 크롤러 허용
   - sitemap.xml 위치 명시

8. sitemap.xml 생성
   - 모든 게시글 URL 포함
   - 최종 수정일 (lastmod) 포함
   - 우선순위 (priority) 설정

9. 구조화된 데이터 (JSON-LD)
   - BlogPosting 스키마
   - 작성자 정보
   - 발행일/수정일

=== 우선순위 P4: 추가 기능 (선택사항) ===

10. 카테고리별 필터링
    - 특정 카테고리의 게시글만 표시
    - 카테고리 목록 네비게이션

11. 검색 기능
    - 제목 및 요약 기반 클라이언트 측 검색

12. 다크 모드
    - 시스템 설정에 따른 자동 전환
    - 사용자 선택 저장 (localStorage)

=== Notion 데이터베이스 구조 ===

다음 속성(Property)을 가진 Notion 데이터베이스를 사용합니다:

| 속성 이름        | 타입         | 설명                                              | 필수 |
|-----------------|--------------|---------------------------------------------------|------|
| Name            | Title        | 게시글 제목                                        | ✅   |
| Slug            | Text         | URL용 고유 식별자 (예: "how-to-code")              | ✅   |
| Published       | Checkbox     | 체크된 게시글만 블로그에 표시                       | ✅   |
| Published Date  | Date         | 발행일 (정렬 기준)                                 | ✅   |
| Summary         | Text         | 게시글 요약 (목록에 표시)                          | ✅   |
| Category        | Select       | 게시글 카테고리                                    | ⚠️   |
| Files           | Files/Media  | 썸네일 이미지                                      | ⚠️   |
| seo             | Text         | SEO 최적화용 설명 (meta description에 우선 사용)   | ⚠️   |

=== 독립 테스트 시나리오 ===

User Story 1 (P1 - 게시글 목록):
- Given: Notion 데이터베이스에 Published=true인 게시글 5개
- When: 블로그 홈페이지(/) 방문
- Then: 5개의 게시글이 카드 형식으로 표시되고, 각 카드에 제목/요약/날짜/카테고리/썸네일이 보임

User Story 2 (P1 - 게시글 상세):
- Given: slug="my-first-post"인 게시글 존재
- When: /blog/my-first-post 방문
- Then: 게시글 전체 내용이 HTML로 렌더링되고, 썸네일이 상단에 표시됨

User Story 3 (P2 - 404 처리):
- Given: 존재하지 않는 slug
- When: /blog/non-existent-post 방문
- Then: 404 페이지 표시 및 홈으로 돌아가는 링크 제공

User Story 4 (P3 - SEO):
- Given: 블로그에 게시글 10개
- When: /sitemap.xml 접근
- Then: 10개 게시글의 URL이 XML 형식으로 반환됨

이 명세는 Notion을 CMS로 사용하여 최소한의 설정으로 블로그를 운영할 수 있도록 하는 것이 목표입니다.
```

### 3.2 생성된 파일 확인

```bash
# 명세서 확인
cat .specify/specs/001-notion-blog/spec.md

# Git 브랜치 확인
git branch
# 출력: * 001-notion-blog
```

---

## 4단계: 명확화 (선택사항)

### 4.1 Clarify 명령 실행

AI 에이전트가 애매한 부분에 대해 질문을 하도록 합니다:

```
/speckit.clarify
```
/speckit.clarify
### 4.2 AI가 할 수 있는 질문 예시

**AI**: 몇 가지 명확히 하고 싶은 사항이 있습니다:

**Q1**: Notion API 호출 실패 시 어떻게 처리해야 하나요? (예: Notion 서버 다운, API 키 만료)
- A) 캐시된 데이터 표시 + 에러 배너
- B) 전체 페이지 에러
- C) 빈 상태 표시

**답변 입력**:
```
A) 캐시된 데이터가 있으면 표시하고, 페이지 상단에 "데이터가 최신이 아닐 수 있습니다"
배너를 표시합니다. 캐시도 없으면 사용자 친화적 에러 메시지와 함께 재시도 버튼을 제공합니다.
```

**Q2**: 게시글에 이미지가 많을 경우 (10개 이상) 성능 최적화는 어떻게 하나요?
- A) 모든 이미지 즉시 로드
- B) Lazy loading
- C) 페이지네이션

**답변 입력**:
```
B) Lazy loading을 사용합니다. 뷰포트에 진입할 때만 이미지를 로드하며,
loading="lazy" 속성을 사용합니다.
```

**Q3**: Notion 데이터베이스에 카테고리가 없는 게시글은 어떻게 표시하나요?

**답변 입력**:
```
"Uncategorized" 또는 "일반"으로 표시합니다.
```

**Q4**: 게시글 본문의 최대 길이 제한이 있나요?

**답변 입력**:
```
제한 없습니다. Notion의 페이지 블록 제한(최대 100,000 블록)까지 지원합니다.
```

**Q5**: 다크 모드(P4)는 이번 단계에서 구현하나요, 아니면 나중에 추가하나요?

**답변 입력**:
```
일단 P1~P3까지만 구현하고, 다크 모드는 향후 별도 기능으로 추가합니다.
```

### 4.3 명확화 내용 확인

```bash
# spec.md에 Clarifications 섹션이 추가됨
cat .specify/specs/001-notion-blog/spec.md | grep -A 20 "Clarifications"
```

---

## 5단계: 기술 구현 계획

### 5.1 Plan 명령 실행

이제 **"어떻게"** 만들 것인지 기술 스택을 지정합니다:

```
/speckit.plan 다음 기술 스택과 아키텍처로 Notion 블로그를 구현합니다:

=== 프레임워크 및 언어 ===
- Next.js 14.2.0 이상 (App Router 사용)
- TypeScript 5.0+ (strict mode)
- Node.js 18.17 이상

=== 스타일링 ===
- Tailwind CSS 3.4+
- PostCSS
- CSS Modules은 사용하지 않음 (Tailwind 유틸리티 클래스만 사용)

=== Notion 연동 ===
- @notionhq/client (공식 Notion SDK) - 최신 버전
- notion-to-md - Notion 블록을 Markdown으로 변환
- react-markdown - Markdown을 HTML로 렌더링
- react-syntax-highlighter - 코드 블록 구문 강조

=== 추가 라이브러리 ===
- next/image - 이미지 최적화
- date-fns - 날짜 포맷팅
- clsx - 조건부 클래스명 관리

=== 프로젝트 구조 ===

```
notion-blog/
├── .env.local                    # 환경 변수 (Git 제외)
├── .env.example                  # 환경 변수 예시
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
│
└── src/
    ├── app/
    │   ├── layout.tsx            # 루트 레이아웃
    │   ├── page.tsx              # 게시글 목록 페이지 (/)
    │   ├── globals.css           # 전역 스타일
    │   ├── robots.txt/
    │   │   └── route.ts          # robots.txt 생성
    │   ├── sitemap.xml/
    │   │   └── route.ts          # sitemap.xml 생성
    │   │
    │   └── blog/
    │       └── [slug]/
    │           ├── page.tsx      # 게시글 상세 페이지
    │           └── not-found.tsx # 404 페이지
    │
    ├── components/
    │   ├── Header.tsx            # 블로그 헤더
    │   ├── Footer.tsx            # 블로그 푸터
    │   ├── PostCard.tsx          # 게시글 카드 컴포넌트
    │   ├── PostContent.tsx       # Notion 콘텐츠 렌더러
    │   └── LoadingSpinner.tsx    # 로딩 스피너
    │
    ├── lib/
    │   ├── notion.ts             # Notion API 호출 로직
    │   ├── markdown.ts           # Markdown 변환 로직
    │   └── utils.ts              # 유틸리티 함수
    │
    └── types/
        └── notion.ts             # TypeScript 타입 정의
```

=== 데이터 흐름 ===

1. **게시글 목록 조회**:
   ```
   page.tsx → lib/notion.ts (getPublishedPosts)
            → Notion API (데이터베이스 쿼리)
            → 필터링 (Published=true)
            → 정렬 (Published Date 내림차순)
            → 반환
   ```

2. **게시글 상세 조회**:
   ```
   [slug]/page.tsx → lib/notion.ts (getPostBySlug)
                   → Notion API (데이터베이스 쿼리 + 페이지 블록 조회)
                   → notion-to-md (Notion 블록 → Markdown)
                   → react-markdown (Markdown → HTML)
                   → 렌더링
   ```

3. **SEO 데이터**:
   ```
   page.tsx → generateMetadata()
            → getPostBySlug()
            → 메타 태그 생성 (title, description, og:image)
   ```

=== API 호출 최적화 ===

- **캐싱 전략**:
  - Next.js의 `fetch` 캐싱 사용 (`revalidate: 3600` - 1시간)
  - 개발 환경에서는 캐싱 비활성화 (`cache: 'no-store'`)
  - 프로덕션에서는 ISR (Incremental Static Regeneration) 활용

- **에러 처리**:
  - Notion API 호출 실패 시 try-catch로 감싸기
  - 에러 로그 콘솔 출력
  - 사용자에게 친화적인 에러 메시지 표시
  - 빈 배열 또는 null 반환하여 앱 크래시 방지

=== 환경 변수 ===

`.env.local` 파일:
```env
# Notion Integration
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxx

# Site Configuration
NEXT_PUBLIC_BASE_URL=https://yourblog.com
NEXT_PUBLIC_SITE_TITLE=My Notion Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A blog powered by Notion

# Revalidation (초 단위)
REVALIDATE_TIME=3600
```

=== SEO 구현 상세 ===

1. **동적 메타데이터** (`generateMetadata` 사용):
   - title: 게시글 제목 + 사이트 제목
   - description: seo 속성 우선, 없으면 Summary 사용
   - openGraph: 썸네일 이미지, 제목, 설명
   - twitter: Card 타입, 이미지

2. **robots.txt**:
   ```
   User-agent: *
   Allow: /
   Sitemap: {NEXT_PUBLIC_BASE_URL}/sitemap.xml
   ```

3. **sitemap.xml**:
   - 모든 게시글의 URL
   - lastmod: Published Date
   - priority: 홈(1.0), 게시글(0.8)
   - changefreq: weekly

4. **구조화된 데이터 (JSON-LD)**:
   - BlogPosting 스키마
   - author, datePublished, dateModified
   - headline, image, articleBody (요약)

=== 성능 목표 ===

- **Lighthouse 점수**:
  - Performance: 90+ (모바일), 95+ (데스크톱)
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100

- **Core Web Vitals**:
  - LCP < 2.5초
  - FID < 100ms
  - CLS < 0.1

- **이미지 최적화**:
  - next/image로 자동 리사이징
  - WebP 포맷 자동 변환
  - 적절한 sizes 속성 설정
  - priority 속성 (above-the-fold 이미지)

=== 배포 전략 ===

- **플랫폼**: Vercel (권장) 또는 Netlify
- **빌드 명령**: `npm run build`
- **환경 변수**: Vercel 대시보드에서 설정
- **도메인**: 커스텀 도메인 연결

=== 테스트 계획 ===

구현 전 테스트 시나리오:
1. Notion API 연결 테스트
2. 게시글 목록 렌더링 (0개, 1개, 여러 개)
3. 게시글 상세 페이지 (정상, 존재하지 않는 slug)
4. 메타 태그 생성 확인
5. 이미지 로드 및 최적화
6. robots.txt, sitemap.xml 생성

이 계획에 따라 구현하면 성능, SEO, 접근성이 모두 우수한 Notion 블로그가 완성됩니다.
```

### 5.2 생성된 파일 확인

```bash
# 구현 계획 확인
cat .specify/specs/001-notion-blog/plan.md

# 연구 노트 확인 (AI가 최신 Next.js, Notion SDK 조사)
cat .specify/specs/001-notion-blog/research.md

# 데이터 모델 확인
cat .specify/specs/001-notion-blog/data-model.md

# API 계약 확인
ls .specify/specs/001-notion-blog/contracts/
```

**예상 research.md 내용**:
```markdown
# 기술 연구 노트

## Next.js 14 App Router

조사일: 2025-01-19

### 최신 버전
- 현재 안정 버전: 14.2.18
- App Router는 Next.js 13부터 도입, 14에서 안정화
- Pages Router 대비 장점:
  * 서버 컴포넌트 기본 지원
  * 레이아웃 공유 쉬움
  * 로딩/에러 상태 파일 기반 처리
  * 병렬 라우팅, 인터셉팅 라우팅 지원

### 메타데이터 API
- `generateMetadata` 함수로 동적 메타 태그 생성
- 서버 사이드에서 실행되므로 SEO 최적
- 타입 안전성 보장

...
```

---

## 6단계: 작업 목록 생성

### 6.1 Tasks 명령 실행

```
/speckit.tasks
```

AI가 `plan.md`를 분석하여 순서가 있는 작업 목록을 생성합니다.

### 6.2 생성된 tasks.md 확인

```bash
cat .specify/specs/001-notion-blog/tasks.md
```

**예상 tasks.md 내용** (축약):

```markdown
# Task Breakdown: Notion Blog

## Phase 0: 프로젝트 설정

### 0.1 Next.js 프로젝트 초기화
**File**: 프로젝트 루트
**Command**: `npx create-next-app@latest . --typescript --tailwind --app --no-src`
**Dependencies**: None

### 0.2 의존성 설치 [P]
**File**: `package.json`
**Command**:
```bash
npm install @notionhq/client notion-to-md react-markdown react-syntax-highlighter date-fns clsx
npm install -D @types/react-syntax-highlighter
```
**Dependencies**: 0.1 완료 후

### 0.3 환경 변수 설정 [P]
**File**: `.env.local`, `.env.example`
**Action**:
- `.env.local` 생성 (NOTION_API_KEY, NOTION_DATABASE_ID 등)
- `.env.example` 생성 (키 없이 템플릿만)
- `.gitignore`에 `.env.local` 추가 확인
**Dependencies**: None (0.1과 병렬 가능)

### 0.4 TypeScript 설정
**File**: `tsconfig.json`
**Action**: strict 모드 활성화, paths 설정
**Dependencies**: 0.1

### 0.5 Tailwind 설정
**File**: `tailwind.config.ts`
**Action**: 색상 팔레트, 폰트, 반응형 breakpoint 설정
**Dependencies**: 0.1

## Phase 1: Notion API 연동 (P1)

### 1.1 [TEST] TypeScript 타입 정의
**File**: `src/types/notion.ts`
**Description**: Notion 데이터베이스 속성 타입 정의
**Test**: 타입 체크 통과
**Dependencies**: 0.4

### 1.2 Notion 클라이언트 초기화
**File**: `src/lib/notion.ts`
**Description**:
- Notion Client 인스턴스 생성
- 환경 변수 검증
**Dependencies**: 1.1, 0.2

### 1.3 [TEST] getPublishedPosts 함수 테스트 작성
**File**: `src/lib/__tests__/notion.test.ts` (선택사항)
**Description**:
- Published=true 필터링 테스트
- 날짜 정렬 테스트
**Dependencies**: 1.2

### 1.4 getPublishedPosts 함수 구현
**File**: `src/lib/notion.ts`
**Description**:
- Notion 데이터베이스 쿼리
- Published=true 필터
- Published Date 내림차순 정렬
- 필요한 속성만 반환
**Dependencies**: 1.3 (테스트 먼저)

### 1.5 [TEST] getPostBySlug 함수 테스트
**File**: `src/lib/__tests__/notion.test.ts`
**Description**:
- slug 존재 시 데이터 반환
- slug 없을 시 null 반환
**Dependencies**: 1.4

### 1.6 getPostBySlug 함수 구현
**File**: `src/lib/notion.ts`
**Description**:
- slug로 데이터베이스 필터링
- 페이지 블록 조회
- notion-to-md로 Markdown 변환
**Dependencies**: 1.5

### Checkpoint: Phase 1 독립 검증
- [ ] `getPublishedPosts()` 호출 시 배열 반환
- [ ] `getPostBySlug('test-slug')` 호출 시 객체 또는 null
- [ ] Notion API 키 오류 시 에러 메시지 출력

## Phase 2: 게시글 목록 페이지 (P1)

### 2.1 [TEST] 목록 페이지 렌더링 테스트
**File**: `src/app/__tests__/page.test.tsx`
**Description**:
- 게시글 0개일 때 빈 상태 메시지
- 게시글 있을 때 카드 렌더링
**Dependencies**: 1.6

### 2.2 루트 레이아웃 구현
**File**: `src/app/layout.tsx`
**Description**:
- HTML 구조 (lang="ko", 시맨틱)
- 전역 메타데이터 (기본 title, description)
- 폰트 설정
- globals.css import
**Dependencies**: 0.5

### 2.3 전역 스타일 작성
**File**: `src/app/globals.css`
**Description**:
- Tailwind directives
- 기본 타이포그래피
- 커스텀 CSS 변수
**Dependencies**: 2.2

### 2.4 Header 컴포넌트 구현 [P]
**File**: `src/components/Header.tsx`
**Description**:
- 블로그 제목
- 홈 링크
- 반응형 네비게이션
**Dependencies**: 2.2 (layout과 병렬 가능)

### 2.5 Footer 컴포넌트 구현 [P]
**File**: `src/components/Footer.tsx`
**Description**:
- 저작권
- 소셜 링크 (선택사항)
**Dependencies**: 2.2 (layout과 병렬 가능)

### 2.6 PostCard 컴포넌트 구현
**File**: `src/components/PostCard.tsx`
**Description**:
- 썸네일, 제목, 요약, 날짜, 카테고리 표시
- 클릭 시 `/blog/[slug]` 이동
- 반응형 카드 레이아웃
**Dependencies**: 1.1 (타입 정의)

### 2.7 목록 페이지 구현
**File**: `src/app/page.tsx`
**Description**:
- getPublishedPosts() 호출
- PostCard 컴포넌트 매핑
- 그리드 레이아웃 (Tailwind)
- 빈 상태 처리
**Dependencies**: 2.1, 2.4, 2.5, 2.6

### Checkpoint: Phase 2 독립 검증
- [ ] 브라우저에서 http://localhost:3000 접근
- [ ] 게시글 카드 정상 표시
- [ ] 반응형 확인 (모바일/태블릿/데스크톱)
- [ ] 카드 클릭 시 상세 페이지로 이동

## Phase 3: 게시글 상세 페이지 (P1)

### 3.1 PostContent 컴포넌트 구현
**File**: `src/components/PostContent.tsx`
**Description**:
- react-markdown으로 Markdown 렌더링
- 코드 블록 구문 강조 (react-syntax-highlighter)
- 이미지 최적화 (next/image)
- 스타일링 (Tailwind prose)
**Dependencies**: 1.6

### 3.2 [TEST] 상세 페이지 렌더링 테스트
**File**: `src/app/blog/[slug]/__tests__/page.test.tsx`
**Description**:
- 정상 slug → 콘텐츠 렌더링
- 잘못된 slug → 404
**Dependencies**: 3.1

### 3.3 상세 페이지 구현
**File**: `src/app/blog/[slug]/page.tsx`
**Description**:
- getPostBySlug() 호출
- 썸네일 이미지 표시 (전체 폭)
- 제목, 날짜, 카테고리 표시
- PostContent 컴포넌트 렌더링
- slug 없으면 notFound() 호출
**Dependencies**: 3.2

### 3.4 generateMetadata 구현
**File**: `src/app/blog/[slug]/page.tsx`
**Description**:
- 동적 title (게시글 제목 + 사이트 제목)
- description (seo 속성 우선, Summary 대체)
- openGraph (이미지, 제목, 설명)
**Dependencies**: 3.3

### 3.5 404 페이지 구현
**File**: `src/app/blog/[slug]/not-found.tsx`
**Description**:
- 사용자 친화적 메시지
- 홈으로 돌아가기 링크
**Dependencies**: 3.3

### Checkpoint: Phase 3 독립 검증
- [ ] /blog/[실제-slug] 접근 시 콘텐츠 정상 표시
- [ ] 썸네일, 제목, 날짜, 카테고리 표시
- [ ] Markdown 렌더링 (제목, 목록, 코드, 이미지)
- [ ] 잘못된 slug 접근 시 404 페이지
- [ ] 브라우저 개발자 도구에서 메타 태그 확인

## Phase 4: SEO 최적화 (P3)

### 4.1 robots.txt 생성
**File**: `src/app/robots.txt/route.ts`
**Description**:
- User-agent: *
- Allow: /
- Sitemap 위치
**Dependencies**: None

### 4.2 sitemap.xml 생성
**File**: `src/app/sitemap.xml/route.ts`
**Description**:
- 모든 게시글 URL
- lastmod, priority, changefreq
**Dependencies**: 1.4 (getPublishedPosts 필요)

### 4.3 구조화된 데이터 추가 (JSON-LD)
**File**: `src/app/blog/[slug]/page.tsx`
**Description**:
- BlogPosting 스키마
- <script type="application/ld+json"> 삽입
**Dependencies**: 3.4

### Checkpoint: Phase 4 독립 검증
- [ ] /robots.txt 접근 시 올바른 형식
- [ ] /sitemap.xml 접근 시 모든 게시글 URL 포함
- [ ] 구글 Rich Results Test 통과

## Phase 5: 성능 최적화 및 마무리 (P2)

### 5.1 이미지 최적화
**File**: `src/components/PostCard.tsx`, `src/app/blog/[slug]/page.tsx`
**Description**:
- next/image 사용
- sizes 속성 설정
- priority 속성 (above-the-fold)
- loading="lazy" (below-the-fold)
**Dependencies**: 2.6, 3.3

### 5.2 로딩 스피너 컴포넌트
**File**: `src/components/LoadingSpinner.tsx`
**Description**:
- Tailwind로 스피너 애니메이션
**Dependencies**: None

### 5.3 로딩 상태 페이지
**File**: `src/app/loading.tsx`, `src/app/blog/[slug]/loading.tsx`
**Description**:
- 스켈레톤 UI 또는 스피너 표시
**Dependencies**: 5.2

### 5.4 에러 경계 설정
**File**: `src/app/error.tsx`
**Description**:
- 에러 발생 시 친화적 메시지
- 재시도 버튼
**Dependencies**: None

### 5.5 README.md 작성
**File**: `README.md`
**Description**:
- 프로젝트 설명
- 설치 및 실행 가이드
- Notion 설정 가이드
- 환경 변수 설명
- 배포 가이드
**Dependencies**: None

### Checkpoint: Phase 5 독립 검증
- [ ] Lighthouse 점수: Performance 90+, SEO 100
- [ ] 이미지 로드 최적화 확인 (Network 탭)
- [ ] 로딩 상태 정상 작동
- [ ] 에러 던지기 테스트 시 에러 페이지 표시

## 최종 검증

### 전체 시스템 테스트
1. [ ] 로컬 실행: `npm run dev`
2. [ ] Notion 데이터베이스 연동 확인
3. [ ] 게시글 0개 → 빈 상태 메시지
4. [ ] 게시글 추가 → 목록에 표시
5. [ ] Published 체크 해제 → 목록에서 사라짐
6. [ ] 상세 페이지 콘텐츠 렌더링
7. [ ] SEO 메타 태그 확인
8. [ ] robots.txt, sitemap.xml 확인
9. [ ] 반응형 디자인 확인 (모바일/태블릿/데스크톱)
10. [ ] 빌드 성공: `npm run build`
11. [ ] 프로덕션 실행: `npm start`

### 성능 테스트
- [ ] Lighthouse 점수 확인
- [ ] Core Web Vitals 측정
- [ ] 이미지 최적화 확인
```

---

## 7단계: 구현 실행

### 7.1 Implement 명령 실행

```
/speckit.implement
```

AI가 `tasks.md`의 작업을 순서대로 자동 실행합니다.

### 7.2 실행 과정 모니터링

AI가 다음과 같이 작업을 진행합니다:

```
✓ Prerequisites validated
✓ Parsed 45 tasks from tasks.md

[1/45] 0.1 Next.js 프로젝트 초기화
  → Running: npx create-next-app@latest . --typescript --tailwind --app --no-src
  ✓ Complete

[2/45] 0.2 의존성 설치 [PARALLEL]
  → Running: npm install @notionhq/client notion-to-md react-markdown ...
  ✓ Complete (23.4s)

[3/45] 0.3 환경 변수 설정 [PARALLEL]
  → Creating .env.local
  → Creating .env.example
  ✓ Complete

[4/45] 1.1 TypeScript 타입 정의
  → Creating src/types/notion.ts
  ✓ Complete

...

[15/45] 2.7 목록 페이지 구현
  → Creating src/app/page.tsx
  → Importing getPublishedPosts from lib/notion
  → Mapping PostCard components
  ✓ Complete

[16/45] Checkpoint: Phase 2 독립 검증
  → Running: npm run dev
  → Opening: http://localhost:3000
  ⚠ Manual verification required:
    - [ ] 게시글 카드 정상 표시
    - [ ] 반응형 확인

계속하시겠습니까? (y/n)
```

**사용자 입력**: `y`

### 7.3 구현 중 에러 처리

AI가 에러를 만나면 보고하고 수정합니다:

```
[25/45] 3.3 상세 페이지 구현
  → Creating src/app/blog/[slug]/page.tsx
  → Error: Module not found: Can't resolve 'date-fns'

  → Diagnosing...
  → Installing missing dependency: npm install date-fns
  → Retrying...
  ✓ Complete
```

### 7.4 최종 완료

```
[45/45] 최종 검증
  → All tasks completed successfully!
  → Running final build: npm run build
  ✓ Build successful

=== 구현 완료 요약 ===
✓ 45개 작업 완료
✓ 0개 실패
✓ 소요 시간: 12분 34초

다음 단계:
1. Notion 설정 (데이터베이스 생성, Integration 연결)
2. .env.local에 API 키 입력
3. 로컬 테스트
4. Vercel 배포
```

---

## 8단계: Notion 설정

### 8.1 Notion Integration 생성

1. **Notion Developers 페이지 접속**:
   - https://www.notion.so/my-integrations

2. **New Integration 클릭**:
   - Name: "My Blog Integration"
   - Associated workspace: 본인 워크스페이스 선택
   - Type: Internal
   - Capabilities:
     - ✅ Read content
     - ⬜ Update content
     - ⬜ Insert content

3. **Secret 복사**:
   - Integration이 생성되면 "Internal Integration Secret" 복사
   - 형식: `secret_xxxxxxxxxxxxxxxxxxxxx`

### 8.2 Notion 데이터베이스 생성

1. **Notion에서 새 페이지 생성**:
   - "Blog Posts"라는 이름의 페이지

2. **데이터베이스 생성**:
   - `/database` 입력하여 "Table - Full page" 선택

3. **속성(Property) 추가**:

   | 속성 이름 | 타입 | 설정 |
   |----------|------|------|
   | Name | Title | (기본값) |
   | Slug | Text | - |
   | Published | Checkbox | - |
   | Published Date | Date | - |
   | Summary | Text | - |
   | Category | Select | 옵션: Tech, Life, Review 등 |
   | Files | Files & media | - |
   | seo | Text | - |

4. **데이터베이스 ID 복사**:
   - 데이터베이스 페이지 URL: `https://www.notion.so/{database_id}?v=...`
   - `{database_id}` 부분 복사 (32자리 문자열)

### 8.3 Integration 연결

1. **데이터베이스 페이지 우상단 `...` 클릭**
2. **"Add connections" 클릭**
3. **생성한 Integration 선택** ("My Blog Integration")

### 8.4 테스트 게시글 작성

| Name | Slug | Published | Published Date | Summary | Category | Files | seo |
|------|------|-----------|----------------|---------|----------|-------|-----|
| 첫 번째 게시글 | my-first-post | ✅ | 2025-01-19 | 블로그 첫 게시글입니다. | Tech | (썸네일 업로드) | Next.js와 Notion으로 만든 블로그 |
| 두 번째 게시글 | second-post | ✅ | 2025-01-18 | 두 번째 테스트 글 | Life | - | 일상 이야기 |

게시글 본문도 작성 (Notion 페이지 내용):
- 제목, 단락, 목록, 코드 블록, 이미지 등 다양하게

### 8.5 환경 변수 설정

프로젝트 루트의 `.env.local` 파일 편집:

```bash
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_TITLE=My Notion Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A blog powered by Notion and Next.js

REVALIDATE_TIME=3600
```

---

## 9단계: 배포

### 9.1 로컬 실행 및 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

**확인 사항**:
- ✅ 게시글 목록 표시
- ✅ 카드 클릭 → 상세 페이지
- ✅ 썸네일 이미지 로드
- ✅ Markdown 렌더링
- ✅ 반응형 디자인

### 9.2 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 실행
npm start

# http://localhost:3000
```

### 9.3 Vercel 배포

#### GitHub 리포지토리 생성

```bash
# Git 초기화 (이미 되어있음)
git add .
git commit -m "Initial commit: Notion blog with Spec Kit"

# GitHub 리포지토리 생성 후
git remote add origin https://github.com/yourusername/notion-blog.git
git push -u origin main
```

#### Vercel 배포

1. **Vercel 계정 로그인**: https://vercel.com

2. **New Project 클릭**

3. **GitHub 리포지토리 Import**:
   - "notion-blog" 선택

4. **환경 변수 설정**:
   - `NOTION_API_KEY`: Notion Integration Secret
   - `NOTION_DATABASE_ID`: 데이터베이스 ID
   - `NEXT_PUBLIC_BASE_URL`: Vercel 도메인 (예: `https://your-blog.vercel.app`)
   - `NEXT_PUBLIC_SITE_TITLE`: 블로그 제목
   - `NEXT_PUBLIC_SITE_DESCRIPTION`: 블로그 설명
   - `REVALIDATE_TIME`: 3600

5. **Deploy 클릭**

6. **배포 완료 후 URL 접속**:
   - `https://your-blog.vercel.app`

### 9.4 커스텀 도메인 연결 (선택사항)

1. **Vercel 프로젝트 → Settings → Domains**
2. **도메인 입력** (예: `blog.yourdomain.com`)
3. **DNS 레코드 추가**:
   - Type: CNAME
   - Name: blog
   - Value: cname.vercel-dns.com
4. **환경 변수 업데이트**:
   - `NEXT_PUBLIC_BASE_URL`: `https://blog.yourdomain.com`

---

## 검증 및 테스트

### 기능 테스트

- [ ] **홈페이지 (`/`)**:
  - [ ] 게시글 목록 표시
  - [ ] Published=true인 글만 표시
  - [ ] 최신순 정렬
  - [ ] 카드에 썸네일/제목/요약/날짜/카테고리 표시

- [ ] **상세 페이지 (`/blog/[slug]`)**:
  - [ ] 올바른 slug → 콘텐츠 표시
  - [ ] 잘못된 slug → 404 페이지
  - [ ] Markdown 렌더링 (제목, 목록, 코드, 이미지)
  - [ ] 썸네일 이미지 상단 표시

- [ ] **SEO**:
  - [ ] `/robots.txt` 접근 가능
  - [ ] `/sitemap.xml` 접근 가능
  - [ ] 브라우저 개발자 도구에서 `<title>`, `<meta>` 확인
  - [ ] Open Graph 이미지 확인 (링크 공유 시)

### 성능 테스트

```bash
# Lighthouse 실행
npm install -g lighthouse

# 프로덕션 빌드 후
npm run build
npm start

# Lighthouse 테스트
lighthouse http://localhost:3000 --view
```

**목표 점수**:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### 반응형 테스트

브라우저 개발자 도구 (F12) → Device Toolbar (Ctrl+Shift+M)

- [ ] **모바일** (375px): 1열 그리드
- [ ] **태블릿** (768px): 2열 그리드
- [ ] **데스크톱** (1280px): 3열 그리드

---

## 🎉 완료!

Spec Kit의 명세 기반 개발 방식으로 Notion 블로그를 성공적으로 구축했습니다!

### 프로젝트 구조 요약

```
notion-blog/
├── .specify/                      # Spec Kit 관리 폴더
│   ├── memory/constitution.md     # 프로젝트 헌법
│   └── specs/001-notion-blog/
│       ├── spec.md                # 기능 명세
│       ├── plan.md                # 기술 계획
│       ├── tasks.md               # 작업 목록
│       └── research.md            # 연구 노트
│
├── src/
│   ├── app/                       # Next.js App Router
│   ├── components/                # React 컴포넌트
│   ├── lib/                       # 유틸리티 함수
│   └── types/                     # TypeScript 타입
│
├── .env.local                     # 환경 변수 (Git 제외)
└── README.md                      # 프로젝트 문서
```

### 다음 단계

1. **게시글 작성**: Notion에서 글 작성 → Published 체크
2. **기능 추가**:
   - P4 기능 구현 (카테고리 필터, 검색, 다크 모드)
   - 새 기능은 `/speckit.specify`부터 다시 시작
3. **모니터링**: Vercel Analytics로 방문자 추적
4. **SEO 개선**: Google Search Console 등록

### Spec Kit의 장점 체감

- ✅ **체계적인 개발**: 헌법 → 명세 → 계획 → 작업 → 구현
- ✅ **문서화 자동**: 모든 결정 과정이 `.specify/`에 기록됨
- ✅ **AI 협업**: AI가 요구사항 이해하고 자동으로 코드 생성
- ✅ **품질 보장**: 헌법의 원칙이 자동으로 준수됨
- ✅ **재현 가능**: 언제든 `tasks.md`를 다시 실행 가능

---

## 문제 해결

### Notion API 오류

**증상**: "API token is invalid"

**해결**:
```bash
# .env.local 확인
cat .env.local | grep NOTION_API_KEY

# Integration Secret 다시 복사
# https://www.notion.so/my-integrations
```

**증상**: "database_id is invalid"

**해결**:
- 데이터베이스 URL에서 ID 정확히 복사
- Integration이 데이터베이스에 연결되었는지 확인

### 빌드 오류

**증상**: "Module not found: Can't resolve 'notion-to-md'"

**해결**:
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### 이미지 로드 실패

**증상**: Next.js Image Optimization 오류

**해결**:
```js
// next.config.mjs
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Notion S3
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
    ],
  },
};
```

---

<div align="center">
  <p><strong>Spec Kit으로 만든 Notion 블로그 완성!</strong></p>
  <p>Made with ❤️ using Spec-Driven Development</p>
</div>
