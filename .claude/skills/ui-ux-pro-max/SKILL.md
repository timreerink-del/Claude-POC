# UI/UX Pro Max Skill
## React Native / Expo — 99 Guidelines across 10 Priority Categories

Read this file before ANY design, UI, or component task.
Priority order: **Accessibility → Touch → Performance → Style → Layout → Typography → Animation → Forms → Navigation → Charts**

---

## CATEGORY 1 — ACCESSIBILITY (Rules 1–10)

**Rule 1 — Contrast ratio minimum 4.5:1**
All body text must meet WCAG AA contrast ratio of 4.5:1 against its background. Large text (18px+ regular or 14px+ bold) requires 3:1. Use a contrast checker before finalising any color pair. Never rely on color alone to convey meaning.

**Rule 2 — Touch target minimum 44×44pt**
Every interactive element (button, icon, link, toggle) must have a minimum tappable area of 44×44pt. Use `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}` on Pressable/Touchable when the visual element is smaller. This applies to close buttons, icon-only buttons, and list row chevrons.

**Rule 3 — Focus indicators**
Interactive elements must have visible focus states for keyboard/switch access. In React Native Web, ensure `:focus-visible` outlines are not suppressed. Never `outline: none` without providing an alternative focus indicator.

**Rule 4 — Accessible labels on icon-only controls**
Every icon-only button must have `accessibilityLabel` prop. Example: `<Pressable accessibilityLabel="Close profile">`. Screen readers announce the label, not the icon glyph.

**Rule 5 — Semantic roles**
Use `accessibilityRole` correctly: `button` for tappable actions, `link` for navigation, `header` for section titles, `image` for decorative/informational images. This enables screen reader navigation by element type.

**Rule 6 — No color-only status indicators**
Never use color as the sole differentiator for status. Always pair color with an icon, label, or pattern. Example: error state needs both red border AND error icon AND error text — not just a red border.

**Rule 7 — Text scaling support**
Do not use fixed pixel heights on containers that hold text. Use `minHeight` instead of `height` when text must fit. Test at 200% font size (iOS accessibility settings). Avoid `numberOfLines` on critical content.

**Rule 8 — Reduced motion respect**
Wrap non-essential animations in a check for `AccessibilityInfo.isReduceMotionEnabled()`. Decorative animations (shimmer, parallax, blob) should be skipped or simplified when reduce motion is on.

**Rule 9 — Error messages are descriptive**
Form validation errors must state what went wrong AND how to fix it. "Invalid email" is bad. "Enter a valid email address like name@example.com" is good. Place error text directly below the offending field.

**Rule 10 — Sufficient tap spacing between adjacent controls**
Adjacent interactive elements (e.g. two buttons side by side) must have at least 8pt of space between their tappable areas to prevent mis-taps. In lists, ensure rows have enough vertical padding (minimum 12pt top+bottom) to be reliably tapped.

---

## CATEGORY 2 — TOUCH & INTERACTION (Rules 11–20)

**Rule 11 — Press feedback on every interactive element**
Every Pressable must provide tactile feedback. Use `withSpring` scale (0.95–0.97) on press-in and release, or use RN's built-in `android_ripple`. Silent, non-responding buttons feel broken.

**Rule 12 — Swipe-to-dismiss for modals and sheets**
Bottom sheets and modals should support swipe-down-to-dismiss using `PanGestureHandler`. Include a visual drag handle (32×4pt pill, `colors.border`). Never trap users in a modal with only a close button.

**Rule 13 — Long press for secondary actions**
Destructive or secondary actions (delete, archive, share) should live behind a long press or swipe-left, not primary tap. This prevents accidental destructive actions.

**Rule 14 — Scroll momentum feels native**
Use `decelerationRate="normal"` (iOS) or `"fast"` for paginated content. Never block momentum scrolling. Avoid `nestedScrollEnabled` hacks when structure can be flattened.

**Rule 15 — Pull-to-refresh where data can change**
Any list of data that can be refreshed externally (jobs, messages, notifications) must implement `RefreshControl` pull-to-refresh. Position the spinner within the safe area.

**Rule 16 — Keyboard avoidance on forms**
Wrap forms in `KeyboardAvoidingView` with `behavior="padding"` on iOS and `"height"` on Android. Ensure the active input is always visible above the keyboard. Use `ScrollView` with `keyboardShouldPersistTaps="handled"` in lists.

**Rule 17 — Haptic feedback for confirmations**
Use `expo-haptics` `impactAsync(ImpactFeedbackStyle.Light)` on primary actions, `notificationAsync(NotificationFeedbackType.Success)` on completed tasks, and `notificationAsync(NotificationFeedbackType.Error)` on failures.

**Rule 18 — Gesture conflict resolution**
When a scroll view contains horizontally swipeable cards, the inner gesture must have priority in the horizontal axis. Use `simultaneousHandlers` or `activeOffsetX` on the outer scroll to prevent fighting gestures.

**Rule 19 — No double-tap accidents**
Disable a button for 300ms after first tap using a ref or `disabled` prop flip. This prevents duplicate API calls from fast double-taps, especially on submit/confirm buttons.

**Rule 20 — Drag handles on resizable panels**
Any component the user can resize or reorder must have a visible drag handle icon (`grip-vertical` or `more-vertical`). The handle itself must be at least 44×44pt.

---

## CATEGORY 3 — PERFORMANCE (Rules 21–30)

**Rule 21 — FlatList for any list > 8 items**
Never render a static array of more than 8 items directly in a ScrollView. Use `FlatList` with `keyExtractor`, `getItemLayout` (when item heights are fixed), and `removeClippedSubviews={true}` on Android.

**Rule 22 — Image optimisation**
All images must be served as `.webp`. Use `<Image>` with explicit `width` and `height` to prevent layout shift. Implement `fadeDuration={200}` for graceful loading. Avoid `resizeMode="contain"` in performance-critical lists; prefer `cover`.

**Rule 23 — Memoize expensive components**
Wrap list item components in `React.memo`. Use `useCallback` on functions passed as props to list items. Use `useMemo` for derived data (filtered lists, sorted arrays) that would otherwise recompute on every render.

**Rule 24 — Avoid inline style objects**
Never write `style={{ color: 'red' }}` inline in JSX — it creates a new object reference every render, causing unnecessary re-renders in child components. Always use `StyleSheet.create()` and reference the named style.

**Rule 25 — Lazy load off-screen tabs**
Tab content that is not visible should not be mounted. Use `lazy={true}` on Tab.Navigator or conditionally render tab content only when `isFocused` is true.

**Rule 26 — Skeleton screens over spinners**
Show skeleton placeholders (grey rounded rectangles at the expected content dimensions) instead of full-screen spinners. This reduces perceived loading time and prevents layout shift when content arrives.

**Rule 27 — Video autoplay only when visible**
Video elements must not autoplay until they enter the viewport (use `onViewableItemsChanged` in FlatList). Mute autoplay videos by default. Provide a tap-to-unmute affordance.

**Rule 28 — Avoid setState in scroll handlers**
onScroll handlers that call setState on every frame will cause jank. Use `Animated.event` with `useNativeDriver: true` for scroll-driven animations. Only setState for discrete events (reached bottom, pulled past threshold).

**Rule 29 — Batch API calls on mount**
Do not fire N separate API calls in a useEffect loop. Batch into a single call or use Promise.all. Show a single loading state, not N individual spinners.

**Rule 30 — Navigation transition performance**
Heavy screens (with many images, videos, or Skia components) should defer their expensive renders until after the navigation animation completes. Use `InteractionManager.runAfterInteractions` for post-transition work.

---

## CATEGORY 4 — STYLE & COLOR (Rules 31–40)

**Rule 31 — Always use design tokens**
Never write hex color literals in component files. Always reference `colors.*` from `src/tokens/index.ts`. If a color is needed and no token exists, add it to the token file first, then use it. This ensures brand consistency and enables theming.

**Rule 32 — Primary actions use `colors.primary`**
The single most important action on a screen gets `colors.primary` (`#0058E0`). Secondary actions use outlined or ghost styles. Destructive actions use `colors.errorText` background. Never use primary color for decorative elements.

**Rule 33 — Surface hierarchy: background → card → elevated**
Use `colors.background` (`#FAF9F6`) for the page base, `colors.card` (`#FFFFFF`) for raised content surfaces, and `shadows.card` or `shadows.modal` for elevation. Never use white as a page background — it feels harsh.

**Rule 34 — Status colors are semantic, not decorative**
`colors.successSurface/Text/Icon` is for positive states only. `colors.errorSurface/Text` is for failures only. `colors.warningSurface/Text` is for caution. Do not repurpose status colors for branding or decoration.

**Rule 35 — Opacity for disabled states, not grey**
Disabled elements should use `opacity: 0.4` on the existing component rather than switching to a hardcoded grey color. This preserves component structure and is easier to maintain.

**Rule 36 — Gradient blobs are decoration only**
`MeshGradient` is a background decoration. Never place it behind text that relies on contrast for readability unless you have verified the contrast ratio. Use it only in hero areas with sufficient text contrast (white text on blue/purple gradients).

**Rule 37 — Dark surfaces use `colors.primaryContrast`**
`#0A2A57` (Abyss) is used for headings, strong text on light surfaces, and dark pill/chip backgrounds (active tab, selected state). It provides a premium, brand-aligned alternative to pure black.

**Rule 38 — Tint surfaces with 5% opacity, not solid fills**
When adding background tint to a card or row for status (e.g. selected, active, highlighted), use `colors.primary` at `opacity: 0.05` — not a solid light-blue. Solid tints feel heavy; tinted whites feel clean.

**Rule 39 — Consistent border radius per element type**
- `radius.s` (8px): row cards, input fields, tags, chips
- `radius.m` (12px): small modals, tooltips
- `radius.l` (16px): large cards, bottom sheets, modals
- `radius.pill` (999px): buttons, pills, badges, toggles
Never mix these arbitrarily. Consistency creates visual rhythm.

**Rule 40 — Shadow usage is contextual**
Use `shadows.card` for flat cards that need separation. Use `shadows.dropdown` for floating menus. Use `shadows.modal` for bottom sheets and dialogs. Never apply shadows to backgrounds or full-bleed sections.

---

## CATEGORY 5 — LAYOUT (Rules 41–50)

**Rule 41 — 16pt horizontal page margin is the minimum**
All page content must sit within at least 16pt horizontal padding (`spacing.m`). Full-bleed images and gradients are exempt. Never let text touch the screen edge.

**Rule 42 — 8pt grid for all spacing**
All padding, margin, and gap values must be multiples of 4 (using spacing tokens: 4, 8, 12, 16, 20, 24, 32). Avoid arbitrary values like 7, 11, or 15. Use the closest token.

**Rule 43 — Section titles have 8pt bottom margin**
Every section title (`sectionTitle` style) must have `marginBottom: spacing.xs` (8pt) before the first content item. This creates visual grouping between label and content.

**Rule 44 — List rows minimum 48pt height**
Every tappable row in a list must be at least 48pt tall (`minHeight: 48`). This covers the 44pt touch target plus 2pt top and 2pt bottom breathing room.

**Rule 45 — Content max-width on tablets**
On screens wider than 600pt, constrain content to `maxWidth: 600` centered with `alignSelf: 'center'`. App layouts designed for 375pt phones look broken stretched to 1024pt tablets.

**Rule 46 — Safe area insets are always respected**
Wrap all screens in `SafeAreaView` from `react-native-safe-area-context`. Pass `edges={['top']}` or `edges={['bottom']}` contextually — not always all edges. Never hardcode top padding to compensate for notches.

**Rule 47 — Sticky headers use zIndex layering**
Sticky/fixed elements (header bars, FABs, tab bars) must use `zIndex` values from a defined scale: content=1, sticky=10, overlay=20, modal=30, toast=40. Never use arbitrary z-index values.

**Rule 48 — Card content padding is consistent**
Cards use `padding: spacing.m` (16pt) internally. Card groups have `gap: spacing.xs` (8pt) between items. Section groups have `gap: spacing.s` (12pt). Never mix padding and margin for internal card spacing.

**Rule 49 — Empty states are centred with vertical offset**
Empty state illustrations/messages should be vertically centred with `paddingBottom: 80` to account for the bottom nav bar, so they appear optically centred to the user, not mathematically centred.

**Rule 50 — Scroll views never have fixed height children**
Children inside a ScrollView must not have `flex: 1` — this produces 0-height content. Use explicit heights or `alignSelf: 'stretch'` where needed. The ScrollView itself should have `flexGrow: 1`.

---

## CATEGORY 6 — TYPOGRAPHY (Rules 51–60)

**Rule 51 — Always use typography presets**
Use the `typography.*` spread from tokens: `...typography.h1` through `...typography.h5`, `...typography.body`, `...typography.caption`, etc. Never manually combine font family, size, and line height outside the token system.

**Rule 52 — Heading hierarchy is strict**
H1 for screen titles, H2 for major sections, H3 for card titles, H4 for row labels. Never skip levels for visual size — adjust the token instead. Consistent hierarchy enables screen readers to navigate by heading.

**Rule 53 — Line height must be set**
Never set `fontSize` without `lineHeight`. Minimum line height ratio is 1.4× for body text (15px font → 21px line height), 1.2× for headings. Missing line height causes text collision on multi-line strings.

**Rule 54 — Semibold for emphasis, not bold**
The Peppercorn brand uses `fontFamilies.semibold` (600 weight) for emphasis. `bold` (700+) should only be used for numbers/data display. Never use `fontWeight: 'bold'` string — always reference `fontFamilies.*`.

**Rule 55 — Max line length for body text: 75 characters**
Body text paragraphs should be constrained to ~75 characters per line for optimal readability. On 375pt wide screens this is approximately 320pt wide content area. Use `maxWidth` on text containers if needed.

**Rule 56 — No all-caps except labels/tags**
ALL CAPS should only be used for short labels, status tags, or navigation items (max 3 words). Never use all-caps for body text or headings — it degrades readability by ~13%.

**Rule 57 — Truncation with ellipsis, never clipping**
Long text that must fit a single line must use `numberOfLines={1}` with `ellipsizeMode="tail"`. Never allow text to overflow its container without truncation. Always test with the longest realistic content.

**Rule 58 — Number display uses tabular figures**
Numeric values in tables, stats, or lists should use monospaced/tabular numbers when available. This prevents number columns from shifting width as values change. In Noto Sans, use `fontVariant: ['tabular-nums']`.

**Rule 59 — Link text is descriptive**
Linked text must describe the destination, not say "click here" or "more". Use "See all reviews" not "See more". Linked text colour must be `colors.primary` and visually distinguishable (underline or weight change on hover/focus).

**Rule 60 — Italic is for quotes and emphasis only**
Use `fontStyle: 'italic'` only for quoted text or genuine editorial emphasis. Never use italic for UI labels, section titles, or navigation. It signals "secondary content" to users and screen readers.

---

## CATEGORY 7 — ANIMATION (Rules 61–70)

**Rule 61 — Duration sweet spot: 150–400ms**
Micro-interactions (button press, toggle): 150ms. Screen transitions: 300ms. Modal entrance: 350ms. Loading/skeleton fade-in: 400ms. Never exceed 500ms for UI transitions — it feels sluggish.

**Rule 62 — Spring physics over linear easing**
Use `withSpring` for tactile, physical interactions (button press, card drag, bounce). Use `withTiming` with `Easing.out(Easing.cubic)` for entrance/exit animations. Never use linear easing for user-facing transitions.

**Rule 63 — `useNativeDriver: true` wherever possible**
Any animation of `transform` (scale, translate, rotate) or `opacity` must use `useNativeDriver: true`. Animating `width`, `height`, `padding`, or `backgroundColor` runs on the JS thread and may cause dropped frames.

**Rule 64 — Entrance animations are subtle**
New content entering the screen should fade in (`FadeIn` from Reanimated) or slide in by ≤20px. Large slide distances (full screen height) feel jarring for content — reserve for modal presentations.

**Rule 65 — Icon press animation: scale 1→1.2→1**
When an icon button is tapped, animate scale with `withSequence(withSpring(1.2), withSpring(1))` for a "pop" feel. This provides immediate feedback and feels premium. Used in BottomNavBar tab icons.

**Rule 66 — Shimmer direction is left-to-right**
Skeleton loading shimmer animations always travel left-to-right, matching the natural reading direction. Shimmer should have a soft gradient edge (not sharp), and repeat every 1.5s.

**Rule 67 — Stagger list item entrances**
When a list loads, stagger each item's `FadeInDown` animation by 50ms per item (capped at 5 items worth of stagger = 250ms total). Beyond 5 items, all remaining items enter simultaneously. This communicates "batch loading" without feeling endless.

**Rule 68 — Exit animations are faster than entrances**
Elements leave 30% faster than they enter. If entrance is 300ms, exit is 200ms. Users have already registered the element and need less time to process its departure.

**Rule 69 — Shared element transitions for detail screens**
When navigating from a list card to a detail screen, use a shared element transition (hero animation) for the main image. This preserves spatial context and makes the navigation feel connected.

**Rule 70 — Never animate layout properties in a list**
Animating `height`, `flex`, or `margin` of list items while the list is scrolling causes severe jank. Use opacity or transform-only animations for in-list animations. For height changes (expand/collapse), use `LayoutAnimation.configureNext`.

---

## CATEGORY 8 — FORMS (Rules 71–80)

**Rule 71 — One primary action per form**
Every form screen must have exactly one primary CTA button. Secondary actions (save draft, cancel) are text buttons or ghost buttons. The primary button is always at the bottom of the form, full-width.

**Rule 72 — Input labels are above the field, always**
Labels must be placed above (not inside) input fields. Placeholder text inside an input disappears on focus, leaving the user with no label context. Use floating label animation only if the label is always visible when text is entered.

**Rule 73 — Input height: 48pt minimum**
All text inputs must have `minHeight: 48`. This provides the minimum touch target and looks proportionate. Multi-line inputs start at 96pt and grow with content.

**Rule 74 — Validation on blur, not on keystroke**
Show validation errors when a field loses focus (`onBlur`), not on every keystroke. Real-time keystroke validation (except password strength meters) is annoying and premature.

**Rule 75 — Required fields marked with asterisk**
Mark required fields with a red asterisk (*) next to the label. Provide a legend: "* required" near the form title. Never mark optional fields — mark required ones instead.

**Rule 76 — Input autocomplete hints**
Set `autoComplete` and `textContentType` on all relevant inputs. Email: `autoComplete="email" textContentType="emailAddress"`. Password: `textContentType="password"`. Phone: `keyboardType="phone-pad" textContentType="telephoneNumber"`. This enables autofill and the correct keyboard.

**Rule 77 — Submit button shows loading state**
After form submission, replace the button label with an `ActivityIndicator` and disable the button. Never leave the user wondering if their tap registered. Restore the button on error.

**Rule 78 — Multi-step forms show a progress indicator**
Forms with more than 2 steps must show a progress indicator (step dots, numbered steps, or progress bar). Users must always know where they are and how many steps remain.

**Rule 79 — Destructive form actions require confirmation**
Any action that deletes, cancels, or irreversibly modifies data requires a confirmation step — either a bottom sheet, an alert dialog, or a type-to-confirm input for high-risk actions. Never make destructive actions single-tap.

**Rule 80 — Keyboard return key advances focus**
On multi-field forms, `returnKeyType="next"` should move focus to the next field. `returnKeyType="done"` on the last field should submit the form or dismiss the keyboard. Never leave the user pressing the return key with no result.

---

## CATEGORY 9 — NAVIGATION (Rules 81–90)

**Rule 81 — Bottom nav for 3–5 top-level destinations**
Use a bottom tab bar for 3–5 primary app destinations. Fewer than 3 may not need tabs. More than 5 items should use a drawer or nested navigation. Tab labels must be 1–2 words, lowercase, and match the screen's H1.

**Rule 82 — Back navigation is always available**
Every non-root screen must have a back/close affordance. Stack screens: back chevron (top-left) or close X (top-right for modals). Bottom sheets: drag-to-dismiss + close button. Never leave users stranded.

**Rule 83 — Active tab is always clearly indicated**
The active tab must use `colors.primary` for icon and label. Inactive tabs use `colors.textMuted`. Never rely solely on bold weight to indicate active state — color change is the primary indicator.

**Rule 84 — Navigation transition matches direction**
Pushing a new screen: `slide_from_right`. Going back: `slide_from_left` (automatic). Presenting a modal: `slide_from_bottom`. Dismissing: `slide_to_bottom`. Showing a full-screen overlay: `fade`. Consistency trains spatial memory.

**Rule 85 — Deep links resolve gracefully**
All navigable screens must handle being launched directly via deep link. Check for required data before rendering. If data is missing, redirect to the root screen with an error toast — never crash.

**Rule 86 — Search is a distinct screen, not a floating bar**
Full-text search belongs in its own screen (`slide_from_right` transition). The search bar on the main screen is a button that navigates to the search screen — not an inline input that expands in-place. This preserves layout stability.

**Rule 87 — Breadcrumbs for 3+ level depth**
If users can navigate more than 3 levels deep (e.g. App → Category → Subcategory → Detail), provide breadcrumb navigation or a clear "up" affordance beyond the back button.

**Rule 88 — Persist tab state on switch**
Switching tabs must not reset scroll position or clear filter state. Each tab maintains its own navigation stack. Use `React.memo` or `lazy` tab rendering to preserve state without re-mounting.

**Rule 89 — FAB (floating action button) follows thumb zone**
The primary FAB is positioned in the bottom-right, 16pt from the right edge and 16pt above the bottom nav bar. This is within the natural thumb reach zone. Never place FABs in the top corners.

**Rule 90 — onboarding is first-launch only**
Show onboarding screens only on the very first app launch (gated by AsyncStorage). Never show onboarding again unless the user explicitly requests it (e.g. "Replay tutorial" in settings). Respect users' time.

---

## CATEGORY 10 — CHARTS & DATA DISPLAY (Rules 91–99)

**Rule 91 — Charts have visible axes and gridlines**
All chart types (bar, line, area) must display labelled axes. Y-axis: numeric values. X-axis: dates or categories. Gridlines should be `colors.input` (subtle) at 1pt weight. Never show a chart without axis context.

**Rule 92 — Empty chart states are informative**
When a chart has no data, show an illustrated empty state with an explanation ("No shifts recorded yet") and a CTA ("Log your first shift"). Never show an empty chart with only axes — it looks broken.

**Rule 93 — Tooltip on data point tap**
Tapping a data point on a chart must show a tooltip with the exact value, formatted for the data type (currency: €14.50, hours: 7.5h, date: Mar 27). Tooltips appear above the data point and auto-dismiss on tap-away.

**Rule 94 — Color-blind safe palettes for multi-series charts**
Multi-series charts must use a color-blind safe palette. Never use red/green as the sole differentiators. Use shape + color: circles for series A, squares for series B, combined with distinct colors.

**Rule 95 — Numbers > 9999 use K/M abbreviation**
Display large numbers as: 10,000 → 10K, 1,500,000 → 1.5M. Always use consistent number formatting in the same screen. Currency: use locale-aware formatting (€1.234,56 for NL, €1,234.56 for EN).

**Rule 96 — Progress indicators show both value and context**
Progress bars must show the current value AND the maximum (e.g. "7 of 10 shifts completed", not just "70%"). Ring/radial charts always display the percentage or value in the centre.

**Rule 97 — Tables have alternating row shading or clear separators**
Data tables must use either 1pt `colors.input` dividers between rows OR alternating `colors.background` / `colors.card` row fills. Never render a table with no row delineation — rows blur together.

**Rule 98 — Real-time data refreshes gracefully**
Live data (e.g. earnings counter, shift status) must update without re-mounting the chart component. Use animation to transition between old and new values (`withTiming` on the value, not a flash). Show a "last updated" timestamp.

**Rule 99 — Stat cards follow a consistent anatomy**
Every stat card contains: (1) a large primary number in `typeScale.xl` semibold `colors.primaryContrast`, (2) a short label in `typeScale.xs` regular `colors.primaryContrast`, (3) optional contextual icon or trend indicator. Width is fixed (100pt for 3-col, 155pt for 2-col). Height: 68pt minimum.

---

## PRE-DELIVERY CHECKLIST

Before marking any UI task as complete, verify:

### Accessibility
- [ ] All interactive elements ≥ 44×44pt touch target
- [ ] Contrast ratio ≥ 4.5:1 for all text
- [ ] `accessibilityLabel` on all icon-only buttons
- [ ] `accessibilityRole` set correctly on interactive elements
- [ ] No color-only status indicators

### Touch & Interaction
- [ ] Press feedback (scale animation) on all Pressables
- [ ] No hardcoded `disabled` states without visual indication
- [ ] Keyboard avoidance on all forms
- [ ] No double-tap vulnerabilities on submit buttons

### Performance
- [ ] FlatList used for all lists > 8 items
- [ ] No inline style objects
- [ ] `useNativeDriver: true` on all transform/opacity animations
- [ ] Images explicitly sized with `width` and `height`

### Style
- [ ] No hardcoded hex colors (only `colors.*` tokens)
- [ ] No hardcoded font sizes (only `typeScale.*` tokens)
- [ ] `radius.*` tokens used (not arbitrary px values)
- [ ] `shadows.*` tokens used (not custom shadow values)

### Layout
- [ ] 16pt minimum horizontal page margin
- [ ] Safe area insets respected
- [ ] All text containers have `minHeight`, not `height`
- [ ] Empty states designed and implemented

### Typography
- [ ] All text uses `typography.*` presets or explicit token references
- [ ] No text without `lineHeight`
- [ ] Truncation implemented for all potentially long strings

---

## REACT NATIVE / EXPO SPECIFIC NOTES

- **Platform differences**: Use `Platform.select` or `Platform.OS` checks for shadow (iOS uses `shadowColor/Offset/Opacity/Radius`, Android uses `elevation`). The `shadows.*` token handles this.
- **Web fixed positioning**: `position: 'fixed' as any` for sticky elements on web; `position: 'absolute'` on native. Always use `Platform.OS === 'web'` guard.
- **Feather icons on web**: The `bell` icon does not render via `<Icon>` on web. Use `Text` with `fontFamily: 'feather'` + `String.fromCharCode()` as fallback.
- **Reanimated 4**: Use `useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`, `withSequence`. Import from `react-native-reanimated`. Don't mix old Animated API with Reanimated in the same component.
- **SafeAreaView**: Always import from `react-native-safe-area-context`, never from `react-native`. Pass `edges` explicitly.
- **LinearGradient**: Import from `expo-linear-gradient`. The `gradients.*` tokens provide `colors`, `start`, and `end` props.
- **Skia/MeshGradient**: `<MeshGradient>` uses `@shopify/react-native-skia`. It is a decorative overlay only — position absolutely and never over interactive content.
