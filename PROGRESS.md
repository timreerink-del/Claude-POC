# PROGRESS.md — DMP Prototype

Last updated: 2026-03-24

## What Has Been Built

### Core Screens (Implemented)
- **OnboardingScreen** — 4-step first-time carousel (find jobs, manage schedule, connect, build profile). Animated with Reanimated springs. Persists completion via AsyncStorage. Reset via triple-tap on tab bar.
- **HomeScreen (Discovery)** — Full-featured discovery tab with job type toggle (Work Now / Vacancies), search bar with sticky scroll behavior, engagement card carousel, photo/horizontal/compact job cards, date selector filter, staggered FadeIn animations.
- **FilterBottomSheet** (inline in HomeScreen) — Animated slide-up filter panel with spring animation + backdrop fade. Sections: Type of work, Location (navigates to LocationSearchScreen), Distance, Minimum Wage (slider), Minimum Rating (slider), Employer (navigates to EmployerSearchScreen), Availability (time chips, day preference), Languages.
- **ShiftDetailScreen** — Full job detail view with hero image, info rows, description, requirements, employer card, sticky CTA bar.
- **MapViewScreen** — Location map with React Leaflet (web) / React Native Maps (native). Spring-animated job preview card at bottom.
- **LocationSearchScreen** — Full-screen city search with "Use your location" (expo-location), mock Dutch cities, selected state with checkmark.
- **EmployerSearchScreen** — Full-screen employer search, 25 mock companies, text-only rows.
- **ConnectScreen** — Chat-style onboarding placeholder with animated entrance.
- **PlanningScreen / ProfileScreen** — Placeholder tabs.
- **ComponentDemoScreen** — Debug showcase of all UI components.

### UI Components
- **Button** — 3 variants (primary/secondary/ghost) × 3 sizes (sm/md/lg)
- **Card** — Animated pressable container with shadows
- **Icon** — Feather icon wrapper (16/20/24/32px)
- **Chip** — Inline badge/label
- **DatePill** — Date display badge with Reanimated
- **CollapsibleSection** — Expandable content
- **MeshGradient** — Skia-based animated blob gradient background (Proposal B "Breath": 15-18% opacity, day/night color sets)
- **JobCard** — 3 layout variants (compact/horizontal/photo) with video support, bookmark animation
- **EngagementCard** — Onboarding CTA cards with gradient backgrounds and pill selections
- **DateSelectorFilter** — Horizontal scrollable date picker

### Design System
- **Peppercorn tokens** in `src/tokens/index.ts` — colors, spacing, radius, shadows, sizes, gradients
- **Typography presets** — `typography.h1`–`h5` (medium weight, Abyss blue #0A2A57), `body`, `bodySmall`, `label`, `emphasis`, `emphasisLarge`, `emphasisSmall`, `caption`, `nav`. All screens use spread syntax: `...typography.h4`.
- **Font loading** — Noto Sans via Google Fonts CDN (@font-face in global.css) + expo-font useFonts on native. Feather icon font via jsDelivr CDN (@font-face).

### Navigation
- Root native stack: Onboarding → Main (bottom tabs) with modal overlays
- Bottom tabs: CustomTabBar with spring icon pop animation
- Modal screens: ShiftDetail (slide right), MapView (slide bottom), LocationSearch/EmployerSearch (slide right)
- FilterSheet presented inline in HomeScreen with custom animation

### Animations
- Filter sheet: spring slide-up (stiffness 280, damping 28) + backdrop fade
- Filter/distance chips: scale 0.93 spring press feedback
- Tab toggle: spring horizontal indicator slide
- Job cards: staggered FadeIn (50ms delay per card)
- Tab bar icons: spring pop (1.2× → 1×)
- Job card press: scale 0.97 spring
- Bookmark: scale 1.3× bounce
- Onboarding: multi-stage fade + spring slide between steps
- Map preview card: spring SlideInDown/SlideOutDown

### Deployment
- **Vercel**: https://dist-eight-sigma-60.vercel.app
- Built with `npx expo export --platform web`, deployed with `vercel deploy --prod --yes dist`

## Current File Structure (Key Files)

```
App.tsx                          — Entry: font loading, navigation wrapper
global.css                       — Tailwind + @font-face (Noto Sans CDN, Feather CDN)
web/index.html                   — Dev template (not used in prod build)
assets/fonts/Feather.ttf         — Local copy (dev only, prod uses CDN)
src/
├── tokens/index.ts              — Peppercorn design system + typography presets
├── navigation/
│   ├── index.tsx                — RootNavigator, AsyncStorage onboarding gate
│   ├── BottomTabNavigator.tsx   — 4-tab navigator
│   └── CustomTabBar.tsx         — Animated tab bar with triple-tap reset
├── screens/
│   ├── HomeScreen.tsx           — Discovery + inline FilterBottomSheet (~1500 lines)
│   ├── OnboardingScreen.tsx     — 4-step carousel
│   ├── ShiftDetailScreen.tsx    — Job detail view
│   ├── MapViewScreen.tsx        — Map with job preview
│   ├── LocationSearchScreen.tsx — City search
│   ├── EmployerSearchScreen.tsx — Employer search
│   ├── ConnectScreen.tsx        — Chat placeholder
│   ├── filterState.ts           — Pub/sub store for filter selections
│   └── FilterSheet.tsx          — (navigation-based, not actively used)
├── components/
│   ├── ui/                      — Button, Card, Icon, Chip, DatePill, MeshGradient, CollapsibleSection
│   ├── features/                — JobCard, EngagementCard, DateSelectorFilter
│   └── navigation/              — BottomNavBar
└── data/
    ├── mockJobs.ts              — 15+ jobs with images/videos
    └── engagementCards.ts       — 4 engagement card configs
```

## What's Working
- ✅ Full discovery feed with job cards, engagement cards, date filter
- ✅ Onboarding flow with persistence (first-time only)
- ✅ Filter sheet with all sections and animated open/close
- ✅ Location and employer search screens
- ✅ Shift detail screen
- ✅ Map view
- ✅ All animations (springs, fades, staggered entrances)
- ✅ Typography preset system (h1–h5, body, label, emphasis, caption, nav)
- ✅ Noto Sans fonts loading on web (Google Fonts CDN)
- ✅ Feather icons loading on web (jsDelivr CDN)
- ✅ Bell icon workaround (direct glyph character rendering)
- ✅ Vercel deployment

## Known Issues
- **Require cycles**: `navigation/index.tsx ↔ HomeScreen.tsx` and `navigation/index.tsx ↔ OnboardingScreen.tsx` produce warnings (not bugs)
- **Bell icon**: Uses direct `<Text>` glyph workaround instead of `<Icon name="bell">` (Feather component doesn't render bell on web)
- **Onboarding illustrations**: Only 2 of 4 steps have Sally library illustrations (rocket, clipboard); remaining steps use fallback icon circles
- **Placeholder tabs**: Planning, Connect (partially), Profile are not implemented
- **No backend**: All data is mock

## Last Decisions Made
1. **Typography presets**: All headings use medium weight + Abyss blue (#0A2A57). Created `typography` object in tokens with h1–h5, body, label, emphasis, caption, nav presets.
2. **Font loading strategy**: Web uses CSS @font-face with CDN URLs (Google Fonts for Noto Sans, jsDelivr for Feather). Native uses expo-font useFonts hook. Platform gate skips JS loading on web.
3. **Filter animation**: Inline FilterBottomSheet in HomeScreen with spring slide-up + backdrop fade (not navigation-based FilterSheet).
4. **Vercel deployment**: Export to dist/ with `expo export`, deploy with `vercel deploy --prod`.

## Resume Prompt (copy-paste into a new Claude Code session)

```
I'm continuing work on a React Native + Expo prototype for a staffing/gig-work app called DMP.

Read PROGRESS.md and CLAUDE.md in /Users/mac/Documents/Claude POC/dmp-prototype/ for full context.

Key facts:
- Expo 55 + React Navigation 7 + Reanimated 4 + NativeWind
- Design tokens in src/tokens/index.ts (Peppercorn brand, Noto Sans fonts, Abyss blue headings)
- Main screen: HomeScreen.tsx (~1500 lines) with inline FilterBottomSheet
- Onboarding: 4-step carousel gated by AsyncStorage
- Web fonts: CSS @font-face in global.css (Google CDN for Noto Sans, jsDelivr for Feather icons)
- Deployed to Vercel: https://dist-eight-sigma-60.vercel.app
- Preview server config in .claude/launch.json (port 3456)

Pending work:
- Onboarding illustrations: only 2 of 4 have Sally library images (need to source from Figma node 232-3818)
- Placeholder tabs: Planning, Connect, Profile not yet implemented
- All data is mock (no backend)

Start by reading PROGRESS.md, then ask me what to work on next.
```
