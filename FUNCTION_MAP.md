# Function Map & Audit Report

This document contains a comprehensive map of all functions defined across the codebase, categorized by their layer (Utilities/Helpers, Backend API Routes, Pages/Frontend Components, and Boilerplate UI Components).

## Summary of Audit Findings
- **Unused Utilities**: Several generic helper functions inside [utils.ts](file:///c:/Portfolio/src/lib/utils.ts) (such as `debounce`, `isValidEmail`, `getInitials`, `calculateReadingTime`, `groupBy`, `deepClone`, `getQueryParams`, `sleep`) and `safeParse` in [validation.ts](file:///c:/Portfolio/src/lib/validation.ts) are defined but not called anywhere.
- **Security Check on API Route**: The `GET` handler in [messages/route.ts](file:///c:/Portfolio/src/app/api/messages/route.ts) is missing a `requireAdmin()` check, allowing public access to the inbox, which is marked as a security/incomplete concern in the code comments.
- **Certifications Actions**: The `/api/certifications` routes only support `GET` and `POST`, missing individual `PUT`/`DELETE` controllers for management (which is instead done for other collections under dynamic `[id]/route.ts` setups).
- **Next Page Pagination Bug**: In [DataTable.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/DataTable.tsx), the next page button triggers `Math.max(prev + 1, totalPages)` which snaps to the final page on click rather than advancing incrementally with `Math.min`.

---

## 1. Core Utilities & Helper Functions

| Function Name | File Path | Description | Status |
| :--- | :--- | :--- | :--- |
| `rateLimit` | [src/lib/api.ts](file:///c:/Portfolio/src/lib/api.ts#L11-L30) | In-memory rate limiting check based on request client identifiers. | Complete |
| `requireAdmin` | [src/lib/api.ts](file:///c:/Portfolio/src/lib/api.ts#L35-L41) | Authenticates session operator credentials, returning NextAuth session metadata or a 401 error. | Complete |
| `successResponse` | [src/lib/api.ts](file:///c:/Portfolio/src/lib/api.ts#L46-L49) | Standardizes successful API return payloads. | Complete |
| `errorResponse` | [src/lib/api.ts](file:///c:/Portfolio/src/lib/api.ts#L51-L54) | Standardizes API failure messages and status codes. | Complete |
| `getClientIp` | [src/lib/api.ts](file:///c:/Portfolio/src/lib/api.ts#L59-L65) | Parses client remote IP address values from request headers. | Complete |
| `generateSlug` | [src/lib/api.ts](file:///c:/Portfolio/src/lib/api.ts#L70-L75) | Generates URL-safe slugs from raw titles. | Complete |
| `trackEvent` | [src/lib/api.ts](file:///c:/Portfolio/src/lib/api.ts#L80-L102) | Asynchronously saves page/CTA logs to MongoDB. | Complete |
| `authorize` | [src/lib/auth.ts](file:///c:/Portfolio/src/lib/auth.ts#L16-L41) | Verifies email and password using bcrypt comparison on sign-in attempts. | Complete |
| `jwt` | [src/lib/auth.ts](file:///c:/Portfolio/src/lib/auth.ts#L47-L53) | NextAuth token creation/enrichment callback hook. | Complete |
| `session` | [src/lib/auth.ts](file:///c:/Portfolio/src/lib/auth.ts#L54-L60) | NextAuth session creation/enrichment callback hook. | Complete |
| `uploadToCloudinary` | [src/lib/cloudinary.ts](file:///c:/Portfolio/src/lib/cloudinary.ts#L17-L51) | Uploads binary buffers or base64 streams to Cloudinary folders. | Complete |
| `deleteFromCloudinary` | [src/lib/cloudinary.ts](file:///c:/Portfolio/src/lib/cloudinary.ts#L53-L55) | Deletes remote files from Cloudinary storage nodes. | Complete |
| `getOptimizedImageUrl` | [src/lib/cloudinary.ts](file:///c:/Portfolio/src/lib/cloudinary.ts#L57-L66) | Returns dynamic transformation URLs for Cloudinary images. | Unused |
| `fetchGitHubStats` | [src/lib/coding-fetchers.ts](file:///c:/Portfolio/src/lib/coding-fetchers.ts#L17-L37) | Query public repo numbers and followers from GitHub API with mock fallbacks. | Complete |
| `fetchLeetCodeStats` | [src/lib/coding-fetchers.ts](file:///c:/Portfolio/src/lib/coding-fetchers.ts#L39-L62) | Query solved stats from LeetCode stats API. | Complete |
| `syncCodingProfile` | [src/lib/coding-fetchers.ts](file:///c:/Portfolio/src/lib/coding-fetchers.ts#L64-L94) | Coordinates statistics fetching based on platform parameter. | Complete |
| `connectDB` | [src/lib/db.ts](file:///c:/Portfolio/src/lib/db.ts#L25-L46) | Established or returns cached connection pools to MongoDB. | Complete |
| `seed` | [src/lib/seed.ts](file:///c:/Portfolio/src/lib/seed.ts#L5-L143) | Executable database seeding script setting up defaults. | Complete |
| `getSiteSettings` | [src/lib/site-settings.ts](file:///c:/Portfolio/src/lib/site-settings.ts#L4-L14) | Queries settings data from Mongoose. | Complete |
| `cn` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L4-L6) | Combines CSS class names and overrides Tailwind directives. | Complete |
| `formatDate` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L11-L24) | Converts timestamps to short or long readable dates. | Complete |
| `formatNumber` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L29-L31) | Formats numbers with localized separator commas. | Complete |
| `truncate` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L36-L39) | Slices text to character limits with trailing ellipses. | Complete |
| `debounce` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L44-L54) | Yields debounced wrapper models for handlers. | Unused |
| `isValidEmail` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L59-L62) | Basic regex email pattern checks. | Unused |
| `getInitials` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L67-L74) | Resolves initials from space-separated name strings. | Unused |
| `calculateReadingTime` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L79-L83) | Evaluates approximate reading duration for text. | Unused |
| `groupBy` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L88-L101) | Groups list elements by dynamic property keys. | Unused |
| `deepClone` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L106-L108) | Deep clones instances via JSON parse mappings. | Unused |
| `getQueryParams` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L113-L120) | Parses URL searches into key-value parameter sets. | Unused |
| `sleep` | [src/lib/utils.ts](file:///c:/Portfolio/src/lib/utils.ts#L125-L127) | Delay runner returning timed promises. | Unused |
| `safeParse` | [src/lib/validation.ts](file:///c:/Portfolio/src/lib/validation.ts#L121-L128) | Validates payload data against zod schemas, returning errors mapping. | Unused |
| `genId` | [src/hooks/useToast.ts](file:///c:/Portfolio/src/hooks/useToast.ts#L29-L32) | Returns incremental ID counts. | Complete |
| `addToRemoveQueue` | [src/hooks/useToast.ts](file:///c:/Portfolio/src/hooks/useToast.ts#L60-L74) | Registers remove timeout markers for active toasts. | Complete |
| `reducer` | [src/hooks/useToast.ts](file:///c:/Portfolio/src/hooks/useToast.ts#L76-L128) | Adjusts toast state configurations based on action types. | Complete |
| `dispatch` | [src/hooks/useToast.ts](file:///c:/Portfolio/src/hooks/useToast.ts#L134-L139) | Modifies active toast state lists and triggers listeners. | Complete |
| `toast` | [src/hooks/useToast.ts](file:///c:/Portfolio/src/hooks/useToast.ts#L143-L170) | Registers a new toast notice with update and dismiss controllers. | Complete |
| `useToast` | [src/hooks/useToast.ts](file:///c:/Portfolio/src/hooks/useToast.ts#L172-L190) | Custom React toast subscription state hook. | Complete |
| `useAdminStore` | [src/store/useAdminStore.ts](file:///c:/Portfolio/src/store/useAdminStore.ts#L17-L48) | Custom React hook to bind dashboard tab, edit indices and saving overlays state. | Complete |
| `useAppStore` | [src/store/useAppStore.ts](file:///c:/Portfolio/src/store/useAppStore.ts#L19-L50) | Custom React hook toggling main theme settings, chatbots and sidebar layouts. | Complete |
| `useChatStore` | [src/store/useChatStore.ts](file:///c:/Portfolio/src/store/useChatStore.ts#L18-L55) | Custom React hook keeping track of visitors chat messages and loadings. | Complete |
| `useMediaStore` | [src/store/useMediaStore.ts](file:///c:/Portfolio/src/store/useMediaStore.ts#L16-L41) | Custom React hook binding lists of media asset selections. | Complete |
| `usePortfolioStore` | [src/store/usePortfolioStore.ts](file:///c:/Portfolio/src/store/usePortfolioStore.ts#L18-L49) | Custom React hook managing frontend active categories filters, projects, and skills. | Complete |

---

## 2. Backend & API Route Handlers

| Endpoint / Function Name | File Path | Description | Status |
| :--- | :--- | :--- | :--- |
| `GET` | [src/app/api/achievements/route.ts](file:///c:/Portfolio/src/app/api/achievements/route.ts#L6-L15) | Queries achievements sorted by order from database. | Complete |
| `POST` | [src/app/api/achievements/route.ts](file:///c:/Portfolio/src/app/api/achievements/route.ts#L17-L30) | Validates and inserts a new achievement document. | Complete |
| `GET` | [src/app/api/achievements/[id]/route.ts](file:///c:/Portfolio/src/app/api/achievements/[id]/route.ts#L7-L30) | Retrieves details for a single achievement by ID. | Complete |
| `PUT` | [src/app/api/achievements/[id]/route.ts](file:///c:/Portfolio/src/app/api/achievements/[id]/route.ts#L32-L59) | Validates input parameters and modifies an existing achievement. | Complete |
| `DELETE` | [src/app/api/achievements/[id]/route.ts](file:///c:/Portfolio/src/app/api/achievements/[id]/route.ts#L61-L86) | Deletes achievement document from database collections. | Complete |
| `GET` | [src/app/api/admin/users/route.ts](file:///c:/Portfolio/src/app/api/admin/users/route.ts#L7-L20) | Lists workspace administrator accounts. | Complete |
| `POST` | [src/app/api/admin/users/route.ts](file:///c:/Portfolio/src/app/api/admin/users/route.ts#L22-L63) | Hashes inputs and registers a new administrator account (requires super_admin role). | Complete |
| `GET` | [src/app/api/admin/users/[id]/route.ts](file:///c:/Portfolio/src/app/api/admin/users/[id]/route.ts#L8-L33) | Returns user info by ID (excluding passwords). | Complete |
| `PUT` | [src/app/api/admin/users/[id]/route.ts](file:///c:/Portfolio/src/app/api/admin/users/[id]/route.ts#L35-L102) | Updates settings and details for administrator accounts (self-edit or super_admin permissions). | Complete |
| `DELETE` | [src/app/api/admin/users/[id]/route.ts](file:///c:/Portfolio/src/app/api/admin/users/[id]/route.ts#L104-L142) | Deletes target administrator account by ID (prevents self-deletion). | Complete |
| `POST` | [src/app/api/analytics/route.ts](file:///c:/Portfolio/src/app/api/analytics/route.ts#L6-L17) | Logs visitor CTA click/page access events to MongoDB. | Complete |
| `GET` | [src/app/api/analytics/route.ts](file:///c:/Portfolio/src/app/api/analytics/route.ts#L19-L78) | Compiles and formats 30-day analytics dynamic chart data. | Complete |
| `GET` | [src/app/api/certifications/route.ts](file:///c:/Portfolio/src/app/api/certifications/route.ts#L6-L15) | Queries list of certifications. | Complete |
| `POST` | [src/app/api/certifications/route.ts](file:///c:/Portfolio/src/app/api/certifications/route.ts#L17-L30) | Deploys new certification entry. | Complete |
| `POST` | [src/app/api/chat/route.ts](file:///c:/Portfolio/src/app/api/chat/route.ts#L11-L97) | Integrates Anthropic Claude API to chat with visitors, tracking contexts. | Complete |
| `GET` | [src/app/api/coding-profiles/route.ts](file:///c:/Portfolio/src/app/api/coding-profiles/route.ts#L7-L16) | Fetches coding platform profiles. | Complete |
| `POST` | [src/app/api/coding-profiles/route.ts](file:///c:/Portfolio/src/app/api/coding-profiles/route.ts#L18-L31) | Appends a new coding platform connection profile. | Complete |
| `GET` | [src/app/api/coding-profiles/[id]/route.ts](file:///c:/Portfolio/src/app/api/coding-profiles/[id]/route.ts#L7-L30) | Retrieves single coding profile entry. | Complete |
| `PUT` | [src/app/api/coding-profiles/[id]/route.ts](file:///c:/Portfolio/src/app/api/coding-profiles/[id]/route.ts#L32-L59) | Modifies profile properties (enabled status / platform). | Complete |
| `DELETE` | [src/app/api/coding-profiles/[id]/route.ts](file:///c:/Portfolio/src/app/api/coding-profiles/[id]/route.ts#L61-L86) | Removes coding profile connector. | Complete |
| `POST` | [src/app/api/coding-profiles/[id]/sync/route.ts](file:///c:/Portfolio/src/app/api/coding-profiles/[id]/sync/route.ts#L8-L47) | Synchronizes profile analytics metrics from external services. | Complete |
| `GET` | [src/app/api/media/route.ts](file:///c:/Portfolio/src/app/api/media/route.ts#L7-L24) | Lists media documents uploaded to workspace. | Complete |
| `POST` | [src/app/api/media/route.ts](file:///c:/Portfolio/src/app/api/media/route.ts#L26-L82) | Receives multipart form data files, forwards to Cloudinary, and registers references. | Complete |
| `DELETE` | [src/app/api/media/[id]/route.ts](file:///c:/Portfolio/src/app/api/media/[id]/route.ts#L8-L51) | Purges images/audio from Cloudinary storage nodes and database. | Complete |
| `POST` | [src/app/api/messages/route.ts](file:///c:/Portfolio/src/app/api/messages/route.ts#L7-L81) | Saves visitor contact form inputs, logs page views, and notifies admin. | Complete |
| `GET` | [src/app/api/messages/route.ts](file:///c:/Portfolio/src/app/api/messages/route.ts#L83-L93) | Lists user message transmissions logged in database. | Incomplete (Missing standard `requireAdmin()` check) |
| `POST` | [src/app/api/messages/[id]/reply/route.ts](file:///c:/Portfolio/src/app/api/messages/[id]/reply/route.ts#L8-L66) | Submits HTML reply emails via Nodemailer Gmail transporter and flags messages as read. | Complete |
| `GET` | [src/app/api/profile/route.ts](file:///c:/Portfolio/src/app/api/profile/route.ts#L6-L20) | Queries portfolio bio profile. | Complete |
| `PUT` | [src/app/api/profile/route.ts](file:///c:/Portfolio/src/app/api/profile/route.ts#L22-L44) | Adjusts and saves user bio fields. | Complete |
| `GET` | [src/app/api/projects/route.ts](file:///c:/Portfolio/src/app/api/projects/route.ts#L6-L25) | Retrieves public projects list. | Complete |
| `POST` | [src/app/api/projects/route.ts](file:///c:/Portfolio/src/app/api/projects/route.ts#L27-L40) | registers a new project catalog item. | Complete |
| `GET` | [src/app/api/projects/[id]/route.ts](file:///c:/Portfolio/src/app/api/projects/[id]/route.ts#L7-L33) | Returns single project details by ID. | Complete |
| `PUT` | [src/app/api/projects/[id]/route.ts](file:///c:/Portfolio/src/app/api/projects/[id]/route.ts#L35-L62) | Modifies cover images, stack, titles, and descriptions. | Complete |
| `DELETE` | [src/app/api/projects/[id]/route.ts](file:///c:/Portfolio/src/app/api/projects/[id]/route.ts#L64-L89) | Purges project item from collection databases. | Complete |
| `POST` | [src/app/api/projects/[id]/view/route.ts](file:///c:/Portfolio/src/app/api/projects/[id]/view/route.ts#L7-L34) | Increments viewCount indicator stats for projects. | Complete |
| `GET` | [src/app/api/settings/route.ts](file:///c:/Portfolio/src/app/api/settings/route.ts#L6-L29) | Returns configuration settings (creates default data if blank). | Complete |
| `PUT` | [src/app/api/settings/route.ts](file:///c:/Portfolio/src/app/api/settings/route.ts#L31-L53) | Modifies global settings variables. | Complete |
| `GET` | [src/app/api/skills/route.ts](file:///c:/Portfolio/src/app/api/skills/route.ts#L6-L15) | Queries list of skills sorted by order. | Complete |
| `POST` | [src/app/api/skills/route.ts](file:///c:/Portfolio/src/app/api/skills/route.ts#L17-L30) | Inserts new skill parameters. | Complete |
| `GET` | [src/app/api/skills/[id]/route.ts](file:///c:/Portfolio/src/app/api/skills/[id]/route.ts#L7-L30) | Returns skill details. | Complete |
| `PUT` | [src/app/api/skills/[id]/route.ts](file:///c:/Portfolio/src/app/api/skills/[id]/route.ts#L32-L59) | Modifies category, level, and featured properties of skills. | Complete |
| `DELETE` | [src/app/api/skills/[id]/route.ts](file:///c:/Portfolio/src/app/api/skills/[id]/route.ts#L61-L86) | Deletes target skill item. | Complete |
| `GET` | [src/app/api/timeline/route.ts](file:///c:/Portfolio/src/app/api/timeline/route.ts#L6-L15) | Fetches chronological journey items sorted by order. | Complete |
| `POST` | [src/app/api/timeline/route.ts](file:///c:/Portfolio/src/app/api/timeline/route.ts#L17-L30) | Registers new chronological timeline event. | Complete |
| `GET` | [src/app/api/timeline/[id]/route.ts](file:///c:/Portfolio/src/app/api/timeline/[id]/route.ts#L7-L30) | Returns dynamic timeline event attributes. | Complete |
| `PUT` | [src/app/api/timeline/[id]/route.ts](file:///c:/Portfolio/src/app/api/timeline/[id]/route.ts#L32-L59) | Updates timeline details. | Complete |
| `DELETE` | [src/app/api/timeline/[id]/route.ts](file:///c:/Portfolio/src/app/api/timeline/[id]/route.ts#L61-L86) | Deletes chronological event record. | Complete |

---

## 3. Page Views & Frontend Components (Layouts & Pages)

| Function / Component Name | File Path | Description | Status |
| :--- | :--- | :--- | :--- |
| `RootLayout` | [src/app/layout.tsx](file:///c:/Portfolio/src/app/layout.tsx#L38-L56) | Base wrapper loading fonts, global CSS styles, Toast notifications and site settings context. | Complete |
| `NotFound` | [src/app/not-found.tsx](file:///c:/Portfolio/src/app/not-found.tsx#L6-L25) | Renders futuristic themed 404 views. | Complete |
| `getData` | [src/app/(portfolio)/page.tsx](file:///c:/Portfolio/src/app/(portfolio)/page.tsx#L17-L55) | Serves concurrent server-side data fetching for portfolio databases. | Complete |
| `PortfolioPage` | [src/app/(portfolio)/page.tsx](file:///c:/Portfolio/src/app/(portfolio)/page.tsx#L57-L107) | Orchestrator page loading frontend sections inside Suspense boundaries. | Complete |
| `AboutSection` | [src/app/(portfolio)/components/about/AboutSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/about/AboutSection.tsx#L12-L159) | Displays details on bios, learning journeys, career goals, and Stanford education dates. | Complete |
| `AchievementsSection` | [src/app/(portfolio)/components/achievements/AchievementsSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/achievements/AchievementsSection.tsx#L21-L74) | Grid list for awards, hackathons, and competitions. | Complete |
| `AchievementCard` | [src/app/(portfolio)/components/achievements/AchievementsSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/achievements/AchievementsSection.tsx#L76-L148) | Renders detailed card visualizations for featured recognitions. | Complete |
| `AchievementRow` | [src/app/(portfolio)/components/achievements/AchievementsSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/achievements/AchievementsSection.tsx#L150-L205) | Draws compact rows for secondary award items. | Complete |
| `CertificationsSection` | [src/app/(portfolio)/components/certifications/CertificationSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/certifications/CertificationSection.tsx#L12-L47) | Draws credentials list sections. | Complete |
| `CertificationCard` | [src/app/(portfolio)/components/certifications/CertificationSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/certifications/CertificationSection.tsx#L49-L106) | Cards displaying qualification metadata and links. | Complete |
| `ChatMessage` | [src/app/(portfolio)/components/chat/ChatMessage.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/chat/ChatMessage.tsx#L8-L23) | Styled dialog bubble representing chatbot message contents. | Complete |
| `ChatWidget` | [src/app/(portfolio)/components/chat/ChatWidget.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/chat/ChatWidget.tsx#L14-L187) | Floating chatbot panel communicating via `/api/chat`. | Complete |
| `CodingDashboard` | [src/app/(portfolio)/components/coding/CodingDashboard.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/coding/CodingDashboard.tsx#L15-L196) | Dashboard panels rendering solved problems stats and language stacks. | Complete |
| `ContributionHeatmap` | [src/app/(portfolio)/components/coding/ContributionHeatmap.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/coding/ContributionHeatmap.tsx#L11-L100) | Heatmap block aggregating contribution logs across weeks. | Complete |
| `LanguageBar` | [src/app/(portfolio)/components/coding/LanguageBar.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/coding/LanguageBar.tsx#L12-L36) | Styled progress bars mapping code language percentages. | Complete |
| `StatsCard` | [src/app/(portfolio)/components/coding/StatsCard.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/coding/StatsCard.tsx#L13-L37) | Stats numerical highlights panel wrapper. | Complete |
| `ContactSection` | [src/app/(portfolio)/components/contact/ContactSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/contact/ContactSection.tsx#L7-L217) | Renders contact forms, handles changes, and posts submissions to `/api/messages`. | Complete |
| `ContactMethod` | [src/app/(portfolio)/components/contact/ContactSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/contact/ContactSection.tsx#L219-L246) | Clickable visual item representing mail/social contacts. | Complete |
| `AudioPlayer` | [src/app/(portfolio)/components/hero/AudioPlayer.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/hero/AudioPlayer.tsx#L13-L87) | Custom audio story player with interactive timeline track subtitles. | Complete |
| `FloatingCards` | [src/app/(portfolio)/components/hero/FloatingCards.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/hero/FloatingCards.tsx#L10-L100) | Framer-motion floating cards visual decoration layer. | Complete |
| `HeroSection` | [src/app/(portfolio)/components/hero/HeroSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/hero/HeroSection.tsx#L13-L184) | Premium hero panel with mouse coordinates listeners and video backgrounds. | Complete |
| `SocialLinks` | [src/app/(portfolio)/components/hero/SocialLinks.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/hero/SocialLinks.tsx#L43-L73) | Renders row lists of social profile anchors. | Complete |
| `ProjectsSection` | [src/app/(portfolio)/components/projects/ProjectsSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/projects/ProjectsSection.tsx#L12-L110) | Searchable catalog grid showing featured and minor projects. | Complete |
| `ProjectCard` | [src/app/(portfolio)/components/projects/ProjectsSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/projects/ProjectsSection.tsx#L112-L219) | Item cards displaying cover images, categories, technologies, and URLs. | Complete |
| `ProjectModal` | [src/app/(portfolio)/components/projects/ProjectsSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/projects/ProjectsSection.tsx#L221-L296) | Overlay popup explaining long descriptions, challenges, features, and lessons. | Complete |
| `AudioPlayer` (Simple) | [src/app/(portfolio)/components/shared/AudioPlayer.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/shared/AudioPlayer.tsx#L3-L12) | Renders standard floating native controls audio elements. | Complete |
| `Navbar` | [src/app/(portfolio)/components/shared/Navbar.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/shared/Navbar.tsx#L15-L121) | Headers banner utilizing IntersectionObserver to active sections. | Complete |
| `ParticleCanvas` | [src/app/(portfolio)/components/shared/ParticleCanvas.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/shared/ParticleCanvas.tsx#L17-L155) | Canvas animation processing interactive node connection physics. | Complete |
| `SectionLoader` | [src/app/(portfolio)/components/shared/SectionLoader.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/shared/SectionLoader.tsx#L1-L15) | Pulse placeholder loading visual cue. | Complete |
| `SectionWrapper` | [src/app/(portfolio)/components/shared/SectionWrapper.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/shared/SectionWrapper.tsx#L15-L56) | Base container setting boundaries and animations. | Complete |
| `SplashScreen` | [src/app/(portfolio)/components/shared/SplashScreen.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/shared/SplashScreen.tsx#L10-L62) | Fullscreen intro seen once per session. | Complete |
| `VideoAvatar` | [src/app/(portfolio)/components/shared/VideoAvatar.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/shared/VideoAvatar.tsx#L3-L16) | Renders floating looping video avatar bubble. | Complete |
| `SkillsSection` | [src/app/(portfolio)/components/skills/SkillsSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/skills/SkillsSection.tsx#L41-L164) | Highlights technical stacks by categorized groupings. | Complete |
| `TimelineSection` | [src/app/(portfolio)/components/timeline/TimeLineSection.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/timeline/TimeLineSection.tsx#L28-L86) | Renders chronological milestone timelines. | Complete |
| `TimelineItem` | [src/app/(portfolio)/components/timeline/TimelineItem.tsx](file:///c:/Portfolio/src/app/(portfolio)/components/timeline/TimelineItem.tsx#L25-L95) | Individual milestone card visualization. | Complete |
| `AdminRootLayout` | [src/app/admin/layout.tsx](file:///c:/Portfolio/src/app/admin/layout.tsx#L5-L12) | Top level layout for admin panels. | Complete |
| `AuthLayout` | [src/app/admin/(auth)/layout.tsx](file:///c:/Portfolio/src/app/admin/(auth)/layout.tsx#L3-L12) | Layout wrapper centering auth pages. | Complete |
| `LoginPage` | [src/app/admin/(auth)/login/page.tsx](file:///c:/Portfolio/src/app/admin/(auth)/login/page.tsx#L12-L141) | Decryption access key input page submitting credentials via NextAuth. | Complete |
| `DashboardLayout` | [src/app/admin/(dashboard)/layout.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/layout.tsx#L10-L24) | Layout containing admin sidebar and topbars. | Complete |
| `ConfirmDialog` | [src/app/admin/(dashboard)/components/ConfirmDialog.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/ConfirmDialog.tsx#L25-L72) | Safe popup confirming purges. | Complete |
| `DataTable` | [src/app/admin/(dashboard)/components/DataTable.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/DataTable.tsx#L23-L160) | Searchable paginated data table grid viewer. | Complete (Next page snaps to final page due to `Math.max` bug) |
| `MediaUploader` | [src/app/admin/(dashboard)/components/MediaUploader.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/MediaUploader.tsx#L14-L232) | Drag-drop receiver sending uploads to `/api/media`. | Complete |
| `RichTextEditor` | [src/app/admin/(dashboard)/components/RichTextEditor.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/RichTextEditor.tsx#L15-L160) | Markdown formatter with preview viewer. | Complete |
| `Sidebar` | [src/app/admin/(dashboard)/components/Sidebar.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/Sidebar.tsx#L37-L147) | Left sidebar list containing system navigation anchors. | Complete |
| `StatCard` | [src/app/admin/(dashboard)/components/StatCard.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/StatCard.tsx#L14-L44) | Dashboard stats preview box. | Complete |
| `Topbar` | [src/app/admin/(dashboard)/components/Topbar.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/components/Topbar.tsx#L7-L73) | Top bar formatting page titles from navigation path segments. | Complete |
| `DashboardPage` | [src/app/admin/(dashboard)/dashboard/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/dashboard/page.tsx#L39-L265) | Compiles analytical logs and formats page traffic area/bar charts. | Complete |
| `AchievementsPage` | [src/app/admin/(dashboard)/achievements/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/achievements/page.tsx#L35-L382) | CRUD database card manager panel for achievements. | Complete |
| `CertificationsPage` | [src/app/admin/(dashboard)/certifications/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/certifications/page.tsx#L28-L383) | CRUD database card manager panel for certifications. | Complete |
| `CodingProfilesPage` | [src/app/admin/(dashboard)/coding-profiles/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/coding-profiles/page.tsx#L43-L373) | CRUD dashboard connections manager page for coding profiles. | Complete |
| `MediaPage` | [src/app/admin/(dashboard)/media/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/media/page.tsx#L31-L242) | Cloudinary assets inventory catalog grid. | Complete |
| `MessagesPage` | [src/app/admin/(dashboard)/messages/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/messages/page.tsx#L21-L344) | Reads incoming operator inbox posts, marks read logs, and sends replies. | Complete |
| `ProfilePage` | [src/app/admin/(dashboard)/profile/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/profile/page.tsx#L15-L330) | Main editor updating Stanford education dates, bio details, and resumes. | Complete |
| `ProjectsPage` | [src/app/admin/(dashboard)/projects/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/projects/page.tsx#L34-L479) | CRUD workspace project parameters and sluggifies titles. | Complete |
| `SettingsPage` | [src/app/admin/(dashboard)/settings/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/settings/page.tsx#L34-L391) | Updates global configurations variables, feature flags, and copyright texts. | Complete |
| `SkillsPage` | [src/app/admin/(dashboard)/skills/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/skills/page.tsx#L39-L344) | CRUD skill cards manager. | Complete |
| `TimelinePage` | [src/app/admin/(dashboard)/timeline/page.tsx](file:///c:/Portfolio/src/app/admin/(dashboard)/timeline/page.tsx#L35-L352) | CRUD chronologies timeline card manager. | Complete |

---

## 4. Shared UI Elements (Boilerplate Shadcn Components)

These elements represent standard boilerplate component exports generated by Shadcn UI:

| Component Name | File Path | Description | Status |
| :--- | :--- | :--- | :--- |
| `Accordion`, `AccordionItem`, etc. | [src/components/ui/accordion.tsx](file:///c:/Portfolio/src/components/ui/accordion.tsx) | Collapsible disclosure layout components. | Complete |
| `Avatar`, `AvatarImage`, etc. | [src/components/ui/avatar.tsx](file:///c:/Portfolio/src/components/ui/avatar.tsx) | User image avatar wrappers. | Complete |
| `Badge` | [src/components/ui/badge.tsx](file:///c:/Portfolio/src/components/ui/badge.tsx#L31-L37) | Simple status inline pills. | Complete |
| `Button` | [src/components/ui/button.tsx](file:///c:/Portfolio/src/components/ui/button.tsx#L44-L56) | Interactive button element containing multiple style variants. | Complete |
| `Card`, `CardTitle`, etc. | [src/components/ui/card.tsx](file:///c:/Portfolio/src/components/ui/card.tsx) | Styled boundary panel wraps. | Complete |
| `Dialog`, `DialogContent`, etc. | [src/components/ui/dialog.tsx](file:///c:/Portfolio/src/components/ui/dialog.tsx) | Base modal popups layouts. | Complete |
| `DropdownMenu`, etc. | [src/components/ui/dropdown-menu.tsx](file:///c:/Portfolio/src/components/ui/dropdown-menu.tsx) | Navigation option dropdown selects. | Complete |
| `Input` | [src/components/ui/input.tsx](file:///c:/Portfolio/src/components/ui/input.tsx) | Text form input fields. | Complete |
| `Label` | [src/components/ui/label.tsx](file:///c:/Portfolio/src/components/ui/label.tsx) | Text field accessibility descriptors. | Complete |
| `Progress` | [src/components/ui/progress.tsx](file:///c:/Portfolio/src/components/ui/progress.tsx) | Bar indicating download or upload completion percent. | Complete |
| `Select`, `SelectItem`, etc. | [src/components/ui/select.tsx](file:///c:/Portfolio/src/components/ui/select.tsx) | Selection dropdown triggers. | Complete |
| `Separator` | [src/components/ui/separator.tsx](file:///c:/Portfolio/src/components/ui/separator.tsx) | Horizontal line divider. | Complete |
| `Skeleton` | [src/components/ui/skeleton.tsx](file:///c:/Portfolio/src/components/ui/skeleton.tsx#L3-L9) | Shimmer animations representing content loading. | Complete |
| `Switch` | [src/components/ui/switch.tsx](file:///c:/Portfolio/src/components/ui/switch.tsx) | Boolean toggle slider. | Complete |
| `Tabs`, `TabsTrigger`, etc. | [src/components/ui/tabs.tsx](file:///c:/Portfolio/src/components/ui/tabs.tsx) | Pane switcher layouts. | Complete |
| `Textarea` | [src/components/ui/textarea.tsx](file:///c:/Portfolio/src/components/ui/textarea.tsx) | Multiline inputs text field. | Complete |
| `ToastProvider`, `Toast`, etc. | [src/components/ui/toast.tsx](file:///c:/Portfolio/src/components/ui/toast.tsx) | Popup notification alert layers. | Complete |
| `Toaster` | [src/components/ui/toaster.tsx](file:///c:/Portfolio/src/components/ui/toaster.tsx#L13-L41) | Global toaster viewport renderer mapping active alerts. | Complete |
| `Tooltip`, `TooltipTrigger`, etc. | [src/components/ui/tooltip.tsx](file:///c:/Portfolio/src/components/ui/tooltip.tsx) | Small context overlay bubbles. | Complete |
