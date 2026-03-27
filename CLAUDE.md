# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills Available
- **UI/UX Pro Max**: `.claude/skills/ui-ux-pro-max/SKILL.md`
  Read this before ANY design, UI, or component task.
  Priority order: Accessibility → Touch → Performance → Style → Layout → Typography → Animation → Forms → Navigation → Charts
  Run `/ux-check` to audit any screen against all 99 rules.

## Rules
- Run `./scripts/guardian.sh` at the start of every session and fix all errors before starting new work.
- After every approved feature, run: `./scripts/restore-point.sh "[feature-name]"`
- Never start a new feature without a restore point first.
- To list all restore points: `./scripts/restore.sh`
- To restore to a point: `git checkout [tag-name]`

## Build & Dev Commands

```bash
npm start          # Expo CLI interactive menu
npm run web        # Web dev server (localhost:8081)
npm run ios        # iOS simulator
npm run android    # Android emulator
npx expo export --platform web   # Build web to dist/
```

Preview server config lives in `.claude/launch.json` (port 3456, serves `dist/`).

No test runner or linter is configured.

## Architecture

**Stack:** React Native + Expo SDK 55, TypeScript strict, React Navigation 7, Reanimated 4, NativeWind/Tailwind.

**Entry flow:** `App.tsx` loads Noto Sans fonts + Feather icon font → wraps `RootNavigator` in `GestureHandlerRootView` + `SafeAreaProvider` + `NavigationContainer`.

### Navigation (`src/navigation/index.tsx`)

```
Root (Native Stack)
├── Onboarding → 4-step internal carousel (first launch only, gated by AsyncStorage key @dmp_onboarding_complete)
├── Main → Bottom Tab Navigator (4 tabs: Discovery, Planning, Connect, Profile)
└── Modal screens: ShiftDetail, MapView, FilterSheet, LocationSearch, EmployerSearch
```

Planning, Connect, and Profile tabs are placeholders. Discovery (HomeScreen) is the main implemented screen.

### Screen Organization

- `src/screens/HomeScreen.tsx` — The largest file. Contains the Discovery feed AND an inline `FilterBottomSheet` component with its own animated slide-up/backdrop. Job type toggle (Work Now / Vacancies), engagement card carousel, job card grid, date filter, sticky search bar.
- `src/screens/filterState.ts` — Module-level pub/sub store for sharing filter selections (location, employer) between FilterBottomSheet and the search screens without prop drilling.
- `src/screens/LocationSearchScreen.tsx` / `EmployerSearchScreen.tsx` — Full-screen search pages that navigate back with selected values via `filterState`.

### Components

- `src/components/ui/` — Reusable primitives: `Button` (3 variants × 3 sizes), `Card`, `Icon` (Feather wrapper, sizes 16/20/24/32), `Chip`, `DatePill`, `MeshGradient` (Skia blobs), `CollapsibleSection`. Barrel-exported from `index.ts`.
- `src/components/features/` — Domain components: `JobCard` (3 variants: compact/horizontal/photo with video support), `EngagementCard`, `DateSelectorFilter`.
- `src/components/navigation/BottomNavBar.tsx` — Custom animated tab bar with spring icon pop.

### Design System (`src/tokens/index.ts`)

Single source of truth — **Peppercorn** brand tokens from Figma (`amLMUl0QJ1LCFErsiE4hkg`):

- `colors` — Brand blue `#0058E0`, Abyss `#0A2A57`, surfaces, semantic status colors, gradients
- `spacing` — xxs(4) through xxl(32)
- `radius` — s(8) through pill(999)
- `fontFamilies` — regular/medium/semibold (Noto Sans)
- `typeScale` — xs(10px) through 4xl(45px) with lineHeight
- `typography` — Presets combining family+scale+color: `h1`–`h5` (medium, Abyss blue), `body`, `bodySmall`, `label`, `emphasis`, `emphasisLarge`, `emphasisSmall`, `caption`, `nav`. Use `...typography.h4` spread in StyleSheet.
- `shadows` — card/dropdown/modal presets
- `gradients` — LinearGradient color arrays

### Mock Data (`src/data/`)

- `mockJobs.ts` — Arrays `WORK_NOW_JOBS`, `VACANCY_JOBS`, `PICKED_FOR_YOU` with 15+ job objects (title, company, rate, rating, image/video assets in `assets/images/jobs/` and `assets/videos/jobs/`).
- `engagementCards.ts` — 4 onboarding engagement cards.

## Key Conventions

- **Typography:** Always use `typography` presets from tokens (e.g., `...typography.h4`). Headings = medium weight + Abyss blue. Never hardcode font sizes.
- **Colors:** Always reference `colors.*` tokens, never hex literals in components.
- **Icons:** Use the `<Icon>` wrapper (`src/components/ui/Icon.tsx`) which wraps Feather from `@expo/vector-icons`. On web, the Feather font loads via CSS `@font-face` in `global.css`.
- **Animations:** Use Reanimated `withSpring` for tactile interactions (press scale 0.93–0.97, bounce 1.2–1.3), `withTiming` for opacity/position transitions, `FadeIn`/`FadeOut` for mount/unmount. Spring constants: stiffness 200–400, damping 8–28.
- **Web font loading:** Fonts load via CSS `@font-face` rules in `global.css` on web; `useFonts` hook on native. The `Platform.OS !== 'web'` gate in `App.tsx` skips JS font loading on web.
- **Styling:** Components use `StyleSheet.create()` with token spreads. NativeWind/Tailwind is configured but most styling is via StyleSheet + tokens.

## Platform Gotchas

- **Web fixed positioning:** Use `Platform.OS === 'web' ? { position: 'fixed' as any } : StyleSheet.absoluteFillObject` for overlays.
- **Require cycles:** `navigation/index.tsx ↔ HomeScreen.tsx` and `navigation/index.tsx ↔ OnboardingScreen.tsx` have known require cycles (warnings are expected, not bugs).
- **Feather "bell" icon:** The `<Icon name="bell">` component doesn't render on web; HomeScreen uses a direct `<Text>` with `fontFamily: 'feather'` + `String.fromCharCode(61726)` as a workaround.
- **Maps:** Web uses React Leaflet, native uses React Native Maps — check platform before importing.

## Deployment

```bash
npx expo export --platform web        # Build to dist/
vercel deploy --prod --yes dist       # Deploy to Vercel
```

Live URL: https://dist-eight-sigma-60.vercel.app
