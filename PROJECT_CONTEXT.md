# Project Context

This document provides a comprehensive overview of the architecture, technical stack, folder hierarchy, and implementation status for the Next.js 15 portfolio + admin CMS monorepo.

---

## 1. Overview

This project is a full-stack web application built in a single Next.js monorepo. It serves two distinct interfaces using Next.js App Router route groups:
1. **Public Portfolio (`yourdomain.com`)**: Open to the public, showcasing bios, education, skills, projects, and an interactive AI chatbot helper. Served from the `(portfolio)` route group.
2. **Admin CMS (`admin.yourdomain.com` or `/admin`)**: Private dashboard allowing the owner to manage content dynamically (create/edit projects, certifications, sync coding stats, upload media to Cloudinary, and reply to messages). Served from the `admin` route group.

---

## 2. Tech Stack

The workspace leverages the following technologies and integrations:
- **Framework**: Next.js App Router 15.x
- **Language**: TypeScript 5.x (Strict mode)
- **Styling**: Tailwind CSS 3.x
- **Component Library**: Shadcn UI (Radix primitives)
- **Animations**: Framer Motion 11.x
- **Database**: MongoDB via Mongoose 8.x (Cached connections pool)
- **Authentication**: NextAuth.js 4.x (JWT session tokens with 24-hour expiration)
- **File Storage**: Cloudinary (SDK v2 for image, video, and audio management)
- **AI Integration**: Anthropic SDK (Claude Opus for chatbot responses)
- **Forms**: React Hook Form (RHF) + Zod schemas for admin validator gates
- **Charts**: Recharts 2.x (Analytics data visualization)
- **Integrations**: Nodemailer (Gmail transporter connection for notifications and email replies)
- **Password Hashing**: bcryptjs 2.x

---

## 3. Folder Structure

The repository conforms to the following folder structure layout:
```
c:\Portfolio/
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
├── package-lock.json
├── .env.local
├── .env.local.example
├── .eslintrc.json
├── .gitignore
├── MASTER_ROADMAP.md
├── PROJECT_CONTEXT.md
├── FUNCTION_MAP.md
├── public/                       # Static public assets
│   ├── favicon.ico
│   ├── audio/                    # Speech files (intro.mp3)
│   ├── placeholders/             # PNG project and certification templates
│   └── videos/                   # Loop video backgrounds (avatar.mp4)
└── src/                          # Main source container
    ├── app/                      # Next.js app routes
    │   ├── layout.tsx            # Global layout wrapper
    │   ├── not-found.tsx          # Custom 404 view
    │   ├── (portfolio)/          # Public portfolio route group
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── components/       # Portfolio visual sections
    │   │       ├── about/, achievements/, certifications/, chat/, coding/, contact/, hero/, projects/, shared/, skills/, timeline/
    │   ├── admin/                # Private admin route group
    │   │   ├── layout.tsx        # Base admin security checks
    │   │   ├── (auth)/           # Credentials authentication pages
    │   │   │   ├── layout.tsx
    │   │   │   └── login/page.tsx
    │   │   └── (dashboard)/      # Protected CMS dashboard interfaces
    │   │       ├── layout.tsx
    │   │       ├── components/   # DataTable, RichTextEditor, MediaUploader, Topbar, Sidebar, etc.
    │   │       └── dashboard/, profile/, skills/, projects/, certifications/, achievements/, timeline/, coding-profiles/, messages/, media/, settings/
    │   └── api/                  # Backend CRUD and sync API handlers
    │       ├── auth/, profile/, skills/, projects/, certifications/, achievements/, timeline/, coding-profiles/, messages/, chat/, analytics/, media/, settings/, admin/users/
    ├── components/ui/            # Shadcn primitives
    ├── hooks/                    # Custom react hooks (useToast.ts)
    ├── lib/                      # Base helper scripts and credentials configs
    ├── models/                   # Mongoose models schemas (index.ts)
    ├── store/                    # Zustand stores
    ├── styles/                   # Global styles sheets (global.css)
    └── types/                    # TypeScript interfaces files (index.ts)
```

---

## 4. File Status

Files currently in the repository are classified by implementation status:

### Root Files
- `package.json` **`[Complete]`**
- `tsconfig.json` **`[Complete]`**
- `next.config.ts` **`[Complete]`**
- `tailwind.config.ts` **`[Complete]`**
- `postcss.config.js` **`[Complete]`**
- `.env.local` **`[Complete]`**
- `.env.local.example` **`[Complete]`**
- `.eslintrc.json` **`[Complete]`**
- `.gitignore` **`[Complete]`**
- `MASTER_ROADMAP.md` **`[Extra]`**
- `PROJECT_CONTEXT.md` **`[Extra]`**
- `FUNCTION_MAP.md` **`[Extra]`**

### Application Views & Layouts (`src/app/`)
- `src/app/layout.tsx` **`[Complete]`**
- `src/app/not-found.tsx` **`[Complete]`**
- `src/app/(portfolio)/layout.tsx` **`[Complete]`**
- `src/app/(portfolio)/page.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/about/AboutSection.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/achievements/AchievementsSection.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/certifications/CertificationSection.tsx` **`[Complete]`** *(Note: Spelled `CertificationSection.tsx` in repo versus `CertificationsSection.tsx` in roadmap)*
- `src/app/(portfolio)/components/chat/ChatMessage.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/chat/ChatWidget.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/coding/CodingDashboard.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/coding/ContributionHeatmap.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/coding/StatsCard.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/coding/LanguageBar.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/contact/ContactSection.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/hero/AudioPlayer.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/hero/FloatingCards.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/hero/HeroSection.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/hero/SocialLinks.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/projects/ProjectsSection.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/shared/AudioPlayer.tsx` **`[Extra]`**
- `src/app/(portfolio)/components/shared/Navbar.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/shared/ParticleCanvas.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/shared/SectionLoader.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/shared/SectionWrapper.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/shared/SplashScreen.tsx` **`[Extra]`**
- `src/app/(portfolio)/components/shared/VideoAvatar.tsx` **`[Extra]`**
- `src/app/(portfolio)/components/skills/SkillsSection.tsx` **`[Complete]`**
- `src/app/(portfolio)/components/timeline/TimeLineSection.tsx` **`[Complete]`** *(Note: Capital "L" naming discrepancy `TimeLineSection.tsx`)*
- `src/app/(portfolio)/components/timeline/TimelineItem.tsx` **`[Complete]`**
- `src/app/admin/layout.tsx` **`[Extra]`** *(Implicit layout at admin route base)*
- `src/app/admin/(auth)/layout.tsx` **`[Complete]`**
- `src/app/admin/(auth)/login/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/layout.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/dashboard/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/profile/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/skills/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/projects/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/certifications/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/achievements/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/timeline/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/coding-profiles/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/messages/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/media/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/settings/page.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/components/ConfirmDialog.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/components/DataTable.tsx` **`[Complete]`** *(Note: Has a minor bug snapping to final page on Next click)*
- `src/app/admin/(dashboard)/components/MediaUploader.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/components/RichTextEditor.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/components/Sidebar.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/components/StatCard.tsx` **`[Complete]`**
- `src/app/admin/(dashboard)/components/Topbar.tsx` **`[Complete]`**

### APIs routes (`src/app/api/`)
- `src/app/api/auth/[...nextauth]/route.ts` **`[Complete]`**
- `src/app/api/profile/route.ts` **`[Complete]`**
- `src/app/api/skills/route.ts` **`[Complete]`**
- `src/app/api/skills/[id]/route.ts` **`[Extra]`**
- `src/app/api/projects/route.ts` **`[Complete]`**
- `src/app/api/projects/[id]/route.ts` **`[Extra]`**
- `src/app/api/projects/[id]/view/route.ts` **`[Extra]`**
- `src/app/api/certifications/route.ts` **`[Complete]`** *(Note: Missing certification dynamic edit/deletion [id] endpoints)*
- `src/app/api/achievements/route.ts` **`[Complete]`**
- `src/app/api/achievements/[id]/route.ts` **`[Extra]`**
- `src/app/api/timeline/route.ts` **`[Complete]`**
- `src/app/api/timeline/[id]/route.ts` **`[Extra]`**
- `src/app/api/coding-profiles/route.ts` **`[Complete]`**
- `src/app/api/coding-profiles/[id]/route.ts` **`[Extra]`**
- `src/app/api/coding-profiles/[id]/sync/route.ts` **`[Extra]`**
- `src/app/api/messages/route.ts` **`[Incomplete]`** *(Note: GET message listing endpoint misses standard `requireAdmin()` auth checks)*
- `src/app/api/messages/[id]/reply/route.ts` **`[Extra]`**
- `src/app/api/chat/route.ts` **`[Complete]`**
- `src/app/api/analytics/route.ts` **`[Complete]`**
- `src/app/api/media/route.ts` **`[Complete]`**
- `src/app/api/media/[id]/route.ts` **`[Extra]`**
- `src/app/api/settings/route.ts` **`[Complete]`**
- `src/app/api/admin/users/route.ts` **`[Complete]`**
- `src/app/api/admin/users/[id]/route.ts` **`[Extra]`**

### Shared components (`src/components/ui/`)
- All 19 standard Shadcn component primitive files are **`[Complete]`**.

### Hooks (`src/hooks/`)
- `src/hooks/useToast.ts` **`[Complete]`**
- `src/hooks/useAnalytics.ts` **`[Missing]`** *(Expected in roadmap specifications but not present)*

### Utilities & Database Helpers (`src/lib/`)
- `src/lib/db.ts` **`[Complete]`**
- `src/lib/auth.ts` **`[Complete]`**
- `src/lib/cloudinary.ts` **`[Complete]`**
- `src/lib/api.ts` **`[Complete]`**
- `src/lib/seed.ts` **`[Complete]`**
- `src/lib/validation.ts` **`[Complete]`** *(Note: Spelled `validation.ts` singular in repo versus `validations.ts` plural in roadmap)*
- `src/lib/coding-fetchers.ts` **`[Complete]`**
- `src/lib/utils.ts` **`[Complete]`**
- `src/lib/site-settings.ts` **`[Extra]`**

### Models schemas (`src/models/`)
- `src/models/index.ts` **`[Complete]`**

### Zustand stores (`src/store/`)
- `src/store/useAppStore.ts` **`[Complete]`**
- `src/store/usePortfolioStore.ts` **`[Complete]`**
- `src/store/useAdminStore.ts` **`[Complete]`**
- `src/store/useMediaStore.ts` **`[Complete]`**
- `src/store/useChatStore.ts` **`[Complete]`**

### CSS styles (`src/styles/`)
- `src/styles/global.css` **`[Complete]`** *(Note: Spelled `global.css` singular in repo versus `globals.css` plural in roadmap)*

### Types (`src/types/`)
- `src/types/index.ts` **`[Complete]`**

### Static assets (`public/`)
- `public/fonts/` **`[Missing]`** *(Google Fonts are loaded dynamically via App Router `next/font/google` directly inside layouts, rendering physical files obsolete)*
- `public/favicon.ico` **`[Complete]`**
- `public/placeholders/placeholder-cert.png` **`[Complete]`**
- `public/placeholders/placeholder-project.png` **`[Complete]`**
- `public/audio/intro.mp3` **`[Extra]`**
- `public/videos/avatar.mp4` **`[Extra]`**
