# MASTER ROADMAP

This roadmap documents the implementation status of all workspace directories, files, and core development phases. It classifies each item as follows:
- **`[Complete]`** — Fully implemented and matching roadmap specifications.
- **`[Incomplete]`** — Present in the repository but lacks required logic, validation, or authentication checks.
- **`[Missing]`** — Expected in the roadmap but not found in the repository.
- **`[Extra]`** — Exists in the repository but was not in the original roadmap specifications.

---

## 📂 Folder & File Registry

### Root Directory
- `package.json` **`[Complete]`**
- `tsconfig.json` **`[Complete]`**
- `next.config.ts` **`[Complete]`**
- `tailwind.config.ts` **`[Complete]`**
- `postcss.config.js` **`[Complete]`**
- `.env.local` **`[Complete]`**
- `.env.local.example` **`[Complete]`** *(Fully populated with environment credentials templates)*
- `.eslintrc.json` **`[Complete]`**
- `.gitignore` **`[Complete]`**
- `MASTER_ROADMAP.txt` **`[Extra]`** *(Duplicate text copy of the roadmap)*
- `PROJECT_CONTEXT.txt` **`[Extra]`** *(System configuration overview document)*
- `README.md` **`[Extra]`** *(Generic default workspace readme)*
- `next-env.d.ts` **`[Extra]`** *(TypeScript build parameters declarations)*
- `package-lock.json` **`[Extra]`** *(NPM dependency lock file)*

---

### `src/app/`
- `layout.tsx` **`[Complete]`**
- `not-found.tsx` **`[Complete]`** *(Themed 404 page)*

#### `(portfolio)/` (Public Surface)
- `layout.tsx` **`[Complete]`**
- `page.tsx` **`[Complete]`** *(Retrieves data in parallel and coordinates layouts)*
- `components/` **`[Complete]`** *(Actual repository uses `components/` instead of `_components/`)*
  - `about/AboutSection.tsx` **`[Complete]`**
  - `achievements/AchievementsSection.tsx` **`[Complete]`**
  - `certifications/CertificationSection.tsx` **`[Complete]`** *(Spelled `CertificationSection` singular in repo versus `CertificationsSection` in roadmap)*
  - `chat/ChatMessage.tsx` **`[Complete]`**
  - `chat/ChatWidget.tsx` **`[Complete]`** *(Floating AI chatbot widget interface)*
  - `coding/CodingDashboard.tsx` **`[Complete]`**
  - `coding/ContributionHeatmap.tsx` **`[Complete]`**
  - `coding/StatsCard.tsx` **`[Complete]`**
  - `coding/LanguageBar.tsx` **`[Complete]`**
  - `contact/ContactSection.tsx` **`[Complete]`**
  - `hero/AudioPlayer.tsx` **`[Complete]`** *(Custom timeline audio player with subtitle transcripts)*
  - `hero/FloatingCards.tsx` **`[Complete]`**
  - `hero/HeroSection.tsx` **`[Complete]`**
  - `hero/SocialLinks.tsx` **`[Complete]`**
  - `projects/ProjectsSection.tsx` **`[Complete]`**
  - `shared/AudioPlayer.tsx` **`[Extra]`** *(Boilerplate native control audio player)*
  - `shared/Navbar.tsx` **`[Complete]`**
  - `shared/ParticleCanvas.tsx` **`[Complete]`** *(Background canvas rendering connection dots)*
  - `shared/SectionLoader.tsx` **`[Complete]`**
  - `shared/SectionWrapper.tsx` **`[Complete]`**
  - `shared/SplashScreen.tsx` **`[Extra]`** *(Session-stored intro loading animation screen)*
  - `shared/VideoAvatar.tsx` **`[Extra]`** *(Corner floating looping MP4 video avatar bubble)*
  - `skills/SkillsSection.tsx` **`[Complete]`**
  - `timeline/TimeLineSection.tsx` **`[Complete]`** *(Capital "L" spelling mismatch `TimeLineSection.tsx` in repo)*
  - `timeline/TimelineItem.tsx` **`[Complete]`**

---

#### `admin/` (Private Surface)
- `layout.tsx` **`[Extra]`** *(Top level admin verification checks layout)*
- `(auth)/layout.tsx` **`[Complete]`**
- `(auth)/login/page.tsx` **`[Complete]`**
- `(dashboard)/layout.tsx` **`[Complete]`**
- `(dashboard)/components/` **`[Complete]`** *(Actual repository uses `components/` instead of `_components/`)*
  - `ConfirmDialog.tsx` **`[Complete]`**
  - `DataTable.tsx` **`[Complete]`** *(Searchable grid table. Note: has a minor next-page button snapping bug)*
  - `MediaUploader.tsx` **`[Complete]`**
  - `RichTextEditor.tsx` **`[Complete]`** *(Markdown editor with instant preview tab toggle)*
  - `Sidebar.tsx` **`[Complete]`**
  - `StatCard.tsx` **`[Complete]`**
  - `Topbar.tsx` **`[Complete]`**
- `(dashboard)/dashboard/page.tsx` **`[Complete]`** *(Compiles metrics and renders area/bar charts)*
- `(dashboard)/profile/page.tsx` **`[Complete]`**
- `(dashboard)/skills/page.tsx` **`[Complete]`**
- `(dashboard)/projects/page.tsx` **`[Complete]`**
- `(dashboard)/certifications/page.tsx` **`[Complete]`**
- `(dashboard)/achievements/page.tsx` **`[Complete]`**
- `(dashboard)/timeline/page.tsx` **`[Complete]`**
- `(dashboard)/coding-profiles/page.tsx` **`[Complete]`**
- `(dashboard)/messages/page.tsx` **`[Complete]`** *(Inbox manager page allowing operators to reply to logs)*
- `(dashboard)/media/page.tsx` **`[Complete]`**
- `(dashboard)/settings/page.tsx` **`[Complete]`** *(Manages site identity metadata, chatbot settings, and splash screen toggles)*

---

#### `api/` (Backend Handlers)
- `auth/[...nextauth]/route.ts` **`[Complete]`**
- `profile/route.ts` **`[Complete]`**
- `skills/route.ts` **`[Complete]`**
- `skills/[id]/route.ts` **`[Extra]`** *(Handles individual skill GET / PUT / DELETE)*
- `projects/route.ts` **`[Complete]`**
- `projects/[id]/route.ts` **`[Extra]`** *(Handles individual project GET / PUT / DELETE)*
- `projects/[id]/view/route.ts` **`[Extra]`** *(Increments project view count statistic)*
- `certifications/route.ts` **`[Complete]`** *(Note: missing custom certification `[id]` endpoints for edit and deletion)*
- `achievements/route.ts` **`[Complete]`**
- `achievements/[id]/route.ts` **`[Extra]`** *(Handles individual achievement GET / PUT / DELETE)*
- `timeline/route.ts` **`[Complete]`**
- `timeline/[id]/route.ts` **`[Extra]`** *(Handles individual timeline event GET / PUT / DELETE)*
- `coding-profiles/route.ts` **`[Complete]`**
- `coding-profiles/[id]/route.ts` **`[Extra]`** *(Handles individual coding profile GET / PUT / DELETE)*
- `coding-profiles/[id]/sync/route.ts` **`[Extra]`** *(Synchronizes profile stats metrics from external endpoints)*
- `messages/route.ts` **`[Incomplete]`** *(Note: the GET message index endpoint runs without a `requireAdmin()` gatekeeper check, exposing private messaging records publicly)*
- `messages/[id]/reply/route.ts` **`[Extra]`** *(Transmits HTML responses via Nodemailer transporter)*
- `chat/route.ts` **`[Complete]`** *(Feeds context variables to Claude AI and saves session messages)*
- `analytics/route.ts` **`[Complete]`** *(Tracks visitor clicks and serves 14-day chart aggregates)*
- `media/route.ts` **`[Complete]`**
- `media/[id]/route.ts` **`[Extra]`** *(Deletes target images/audio from Cloudinary storage nodes and DB)*
- `settings/route.ts` **`[Complete]`**
- `admin/users/route.ts` **`[Complete]`**
- `admin/users/[id]/route.ts` **`[Extra]`** *(Manages individual admin account configuration settings)*

---

### `src/components/ui/` (Shadcn Elements)
- `button.tsx` **`[Complete]`**
- `input.tsx` **`[Complete]`**
- `textarea.tsx` **`[Complete]`**
- `label.tsx` **`[Complete]`**
- `card.tsx` **`[Complete]`**
- `badge.tsx` **`[Complete]`**
- `dialog.tsx` **`[Complete]`**
- `select.tsx` **`[Complete]`**
- `switch.tsx` **`[Complete]`**
- `tabs.tsx` **`[Complete]`**
- `toast.tsx` **`[Complete]`**
- `toaster.tsx` **`[Complete]`**
- `progress.tsx` **`[Complete]`**
- `separator.tsx` **`[Complete]`**
- `dropdown-menu.tsx` **`[Complete]`**
- `tooltip.tsx` **`[Complete]`**
- `avatar.tsx` **`[Complete]`**
- `skeleton.tsx` **`[Complete]`**
- `accordion.tsx` **`[Complete]`**

---

### `src/hooks/`
- `useToast.ts` **`[Complete]`**
- `useAnalytics.ts` **`[Missing]`** *(Expected in roadmap specifications but not present)*

---

### `src/lib/`
- `db.ts` **`[Complete]`**
- `auth.ts` **`[Complete]`**
- `cloudinary.ts` **`[Complete]`**
- `api.ts` **`[Complete]`**
- `seed.ts` **`[Complete]`**
- `validation.ts` **`[Complete]`** *(Spelled `validation.ts` singular in repo versus `validations.ts` plural in roadmap)*
- `coding-fetchers.ts` **`[Complete]`**
- `utils.ts` **`[Complete]`**
- `site-settings.ts` **`[Extra]`** *(Site setting helpers)*

---

### `src/models/`
- `index.ts` **`[Complete]`**

---

### `src/store/`
- `useAppStore.ts` **`[Complete]`**
- `usePortfolioStore.ts` **`[Complete]`**
- `useAdminStore.ts` **`[Complete]`**
- `useMediaStore.ts` **`[Complete]`**
- `useChatStore.ts` **`[Complete]`**

---

### `src/styles/`
- `global.css` **`[Complete]`** *(Spelled `global.css` singular in repo versus `globals.css` plural in roadmap)*

---

### `src/types/`
- `index.ts` **`[Complete]`**

---

### `public/`
- `fonts/` **`[Missing]`** *(Google Fonts are loaded dynamically via App Router `next/font/google` directly inside layouts, rendering physical files obsolete)*
- `favicon.ico` **`[Complete]`**
- `placeholders/placeholder-cert.png` **`[Complete]`**
- `placeholders/placeholder-project.png` **`[Complete]`**
- `audio/intro.mp3` **`[Extra]`** *(Introductory oral speech file)*
- `videos/avatar.mp4` **`[Extra]`** *(Looping video avatar MP4 element)*

---

## 🛠️ Roadmap Phases Audit Summary

- **Phase 1 — Setup**: **`[Complete]`**
  - PostCSS, validation schema, seed utilities, database connections, and auth hooks are fully established.

- **Phase 2 — Public Portfolio**: **`[Complete]`**
  - Home layouts, dynamic section loaders, particles canvas animations, interactive Claude chatbot widget, speech subtitles synchronization, and third-party coding syncs are fully functional.

- **Phase 3 — API Layer**: **`[Complete / Incomplete]`**
  - All requested endpoint nodes are implemented. The dynamic endpoints (`[id]` paths for CRUD) are added as extra features. However, the message inbox list (`GET /api/messages`) is incomplete due to missing admin checks.

- **Phase 4 — Admin Dashboard CMS**: **`[Complete]`**
  - Auth walls, topbar breadcrumbs formatting, Sidebar routers, Recharts analytics, drag-and-drop file uploaders, and markdown previews are fully compiled.

- **Phase 5 — Polish**: **`[Complete]`**
  - Custom 404 views, Toast alert states, env settings, and public image resources are fully implemented.
