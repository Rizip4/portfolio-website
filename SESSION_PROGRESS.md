# Rizip Portfolio - Session Progress

## Current State: ✅ Fully Working

### Repo: https://github.com/Rizip4/portfolio-website
### Backend API: https://portfolio-backend-hazel-two.vercel.app
### Admin Login: admin@portfolio.com (credentials set in Firebase)

---

## Vercel Setup (2 projects only)

| Project | Root Directory | Purpose |
|---------|---------------|---------|
| portfolio-frontend | `/` | Main site + Admin panel |
| portfolio-backend | `backend` | API serverless functions |

**Delete portfolio-admin** — admin is part of frontend (routes at `/admin/*`).

---

## Changes Made This Session

### 1. Rename "Rijip" → "Rizip"
- `index.html` — page title
- `src/components/sections/HeroSection.tsx` — hero heading
- `src/pages/Home.tsx` — footer copyright

### 2. YouTube Embed Support
- `src/components/sections/ProjectsSection.tsx`
- Added `extractYouTubeId()` helper
- Project cards show embedded YouTube player when `videoUrl` exists
- "Watch on YouTube" button links to video
- Fallback project #2 has demo YouTube link

### 3. Light Rays Visibility Fix
- `src/components/sections/HeroSection.tsx`
- Removed `bg-[#0C0C0C]` from section (was covering rays)
- Boosted values: intensity 8→40, rays 24→50, reach 12→40

### 4. Admin Security Fixes
- **Removed** public default credentials from login page
- **Backend**: Default credentials only work when Firebase is NOT configured
- **Backend**: Added `/api/v1/auth/refresh` endpoint for token refresh
- **Backend**: Added rate limiting (5 attempts per 15 minutes) on login
- **Frontend**: Added automatic token refresh interceptor in `src/services/api.ts`

### 5. PWA (Auto-Update)
- Installed `vite-plugin-pwa`
- `vite.config.ts` — PWA config with stale-while-revalidate
- `src/lib/usePwaUpdate.ts` — update hook
- `src/components/PwaUpdateBanner.tsx` — update notification banner
- `vercel.json` — cache headers for assets

### 6. Hero Portrait Media (Admin Control)
- `src/services/settings.ts` — settings service
- `backend/api/index.js` — added `/api/v1/settings` GET/PUT endpoints
- `src/pages/admin/Settings.tsx` — Hero media section (image/YouTube URL)
- `src/components/sections/HeroSection.tsx` — fetches and displays admin media

### 7. Admin Panel Full Redesign
**Updated UI components to match main website style (#0C0C0C, #D7E2EA, orange accents):**
- `src/components/admin/ui/Button.tsx` — gradient primary, glass secondary
- `src/components/admin/ui/Input.tsx` — dark inputs, orange focus ring
- `src/components/admin/ui/Textarea.tsx` — matching style
- `src/components/admin/ui/Modal.tsx` — rounded, backdrop blur
- `src/components/admin/ui/Toast.tsx` — glass effect, colored borders
- `src/components/admin/Sidebar.tsx` — logo, View Site link, orange active
- `src/components/admin/Header.tsx` — sticky, blur backdrop
- `src/pages/admin/Layout.tsx` — matching background
- `src/pages/admin/Login.tsx` — centered card with logo
- `src/pages/admin/Dashboard.tsx` — stat cards, recent projects, skills
- `src/pages/admin/Projects.tsx` — matching card style
- `src/pages/admin/Skills.tsx` — matching style
- `src/pages/admin/Socials.tsx` — matching style
- `src/pages/admin/Messages.tsx` — matching style

### 8. More Admin Controls
**Settings page now has collapsible sections:**
- Hero Section — name, tagline, portrait image/video URL, preview
- About Section — about text
- Footer — copyright text
- Change Password

All settings sync to live site via API.

### 9. Dynamic Content
- `src/components/sections/HeroSection.tsx` — uses settings for name/tagline/media
- `src/components/sections/AboutSection.tsx` — uses settings for about text
- `src/pages/Home.tsx` — uses settings for footer copyright + page title

---

## Build Command

```bash
npm run build
```

Uses `tsc -b && vite build` (not `npx tsc` — that was causing Vercel errors).

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/api/index.js` | All API endpoints (Firebase + mock fallback) |
| `src/services/api.ts` | Axios instance with token refresh |
| `src/services/settings.ts` | Site settings service |
| `src/services/projects.ts` | Projects CRUD |
| `src/services/skills.ts` | Skills CRUD |
| `src/services/socials.ts` | Social links CRUD |
| `src/services/auth.ts` | Login, profile, password change |
| `vite.config.ts` | Vite + PWA config |
| `vercel.json` | Deploy config + cache headers |

---

## Environment Variables (Backend)

| Variable | Purpose |
|----------|---------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase admin SDK JSON |
| `JWT_SECRET` | JWT signing secret |
| `RESEND_API_KEY` | Email sending (optional) |

---

## TODO / Next Steps

- [ ] Fix Vercel deploy (Root Directory `/`)
- [ ] Add real project images/videos (currently using picsum placeholders)
- [ ] Add real YouTube links to projects
- [ ] Configure Firebase if not done
- [ ] Set JWT_SECRET env var on Vercel
- [ ] Test admin login with Firebase credentials
