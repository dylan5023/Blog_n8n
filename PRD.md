당신은 Next.js, TypeScript, Notion API 연동에 매우 능숙한 전문 풀스택 개발자입니다. 지금부터 Notion 데이터베이스를 CMS(콘텐츠 관리 시스템)로 사용하는 완전한 기능의 블로그 프로젝트를 생성할 것입니다.

아래의 모든 요구사항을 반영하여, 필요한 모든 파일의 전체 코드를 생성해 주세요. 코드에는 각 부분의 역할을 설명하는 주석을 상세히 달아주세요.

---

### **1. 프로젝트 목표**

Notion 데이터베이스를 기반으로 작동하는 SEO에 최적화된 블로그를 구축합니다. 사용자는 Notion에서 글을 작성하고 'Published' 체크박스를 켜는 것만으로 블로그에 글을 게시할 수 있습니다.

### **2. 기술 스택**

- **프레임워크**: Next.js 14+ (App Router 사용)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **Notion 연동**: `@notionhq/client` (공식 Notion SDK)
- **Notion 페이지 렌더링**: `notion-to-md` 를 사용하여 Notion 블록을 Markdown으로 변환하고, `react-markdown`으로 렌더링합니다.

### **3. Notion 데이터베이스 구조**

아래와 같은 구조의 Notion 데이터베이스를 사용합니다. 이 속성(Property)들을 기반으로 코드를 작성해 주세요.

| 속성 이름 (Property Name) | 타입 (Type)             | 설명 (Description)                                         |
| ------------------------- | ----------------------- | ---------------------------------------------------------- |
| `Name`                    | `제목 (Title)`          | 게시글의 제목입니다.                                       |
| `Slug`                    | `텍스트 (Text)`         | URL에 사용될 고유 값입니다. (예: `how-to-use-notion-blog`) |
| `Published`               | `체크박스 (Checkbox)`   | 이 항목이 체크되어야 블로그에 게시글이 노출됩니다.         |
| `Published Date`          | `날짜 (Date)`           | 게시글 발행일입니다. 정렬의 기준이 됩니다.                 |
| `Summary`                 | `텍스트 (Text)`         | 게시글 목록에 표시될 간단한 요약입니다.                    |
| `Category`                | `선택 (Select)`         | 게시글의 카테고리입니다.                                   |
| `Files`                   | `파일과 미디어 (files)` | 게시글의 썸네일 입니다.                                    |
| `seo`                     | `텍스트 (Text)`         | 게시글의 내용 입니다.                                    |
### **4. 필수 기능**

1. **게시글 목록 페이지 (`/`)**:
   - `Published`가 체크된 게시글만 목록에 표시합니다.
   - `Published Date`를 기준으로 최신순으로 정렬합니다.
   - 각 게시글의 `Name`, `Summary`, `Published Date`, `Category`, `Files`를 표시합니다.
2. **게시글 상세 페이지 (`/blog/[slug]`)**:
   - `Slug` 값을 기반으로 동적 라우팅을 구현합니다.
   - Notion 페이지의 콘텐츠를 HTML로 렌더링하여 보여줍니다. (코드 블록, 인용, 이미지 등 포함)
   - 각 페이지에 동적으로 `<title>`과 `<meta description>` 태그를 설정하여 SEO를 최적화합니다.
   - 상세 페이지의 가장 상단에 `Files` 속성에 있는 이미지를 표시합니다.
3. **SEO 최적화**:
   - `robots.txt` 및 `sitemap.xml`을 동적으로 생성합니다.
   - 시맨틱 HTML 태그를 사용합니다.
4. **반응형 디자인**: 모바일, 태블릿, 데스크톱 환경을 모두 지원합니다.

### **5. 환경 변수**

프로젝트 루트에 `.env.local` 파일을 생성하여 아래와 같이 환경 변수를 관리합니다. 이 키(key)들을 코드에 직접 사용해 주세요.

```
# Notion
NOTION_API_KEY="your_notion_integration_secret_here"
NOTION_DATABASE_ID="your_notion_database_id_here"

# 사이트 정보 (Sitemap 등에서 사용)
NEXT_PUBLIC_BASE_URL="your_blog_domain"

```

---

### **6. 프로젝트 파일 구조 및 코드 생성**

아래의 파일 구조에 따라 각 파일의 전체 코드를 생성해 주세요.

```
.
├── .env.local
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
│
└── src/
    ├── app/
    │   ├── layout.tsx                # 루트 레이아웃
    │   ├── page.tsx                  # 게시글 목록 페이지
    │   ├── globals.css
    │   ├── robots.txt/route.ts       # robots.txt 생성
    │   └── sitemap.xml/route.ts      # sitemap.xml 생성
    │   │
    │   └── blog/[slug]/
    │       └── page.tsx              # 게시글 상세 페이지
    │
    ├── components/
    │   ├── Header.tsx                # 블로그 헤더
    │   └── Footer.tsx                # 블로그 푸터
    │
    └── lib/
        └── notion.ts                 # Notion API 호출 및 데이터 가공 로직

```

---

**이제 위 요구사항을 모두 만족하는 전체 프로젝트 코드를 생성해 주세요.**

1. `package.json` 의존성 목록부터 시작해서,
2. 위 파일 구조에 명시된 모든 파일(`src/app/layout.tsx`, `src/app/page.tsx` 등)의 코드를 순서대로 작성해 주세요.
3. 마지막으로, 사용자가 이 프로젝트를 설정하고 실행하기 위한 단계별 가이드를 마크다운 형식으로 제공해주세요.
   1. Notion 연동 설정
   2. 프로젝트 클론 및 의존성 설치
   3. `.env.local` 파일 설정
   4. 로컬 실행 및 배포를 마크다운 형식으로 제공해주세요.
