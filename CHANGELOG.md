# Changelog — Bathroom Safety Audit App

All changes to this project are documented here in reverse chronological order.
Updated by the Docs Agent after every completed task or session.

---

## [2026-02-20] — PWA / Offline Support

**Agent:** Architect Agent (planning) + Implementation Agent (build) + QA Agent (review and approval)
**Files changed:**
- `package.json` / `package-lock.json` — new npm dependencies
- `src/utils/generatePdf.js` — removed CDN guard; switched to ESM imports
- `public/index.html` — removed jsPDF CDN script tags
- `public/manifest.json` — replaced CRA defaults with real app identity and PWA metadata
- `src/service-worker.js` (new) — Workbox-powered service worker
- `src/serviceWorkerRegistration.js` (new) — production-only SW registration utility
- `src/index.js` — registered the service worker on app startup

**What changed:**

`package.json` / `package-lock.json` — Installed `jspdf@2.5.1` and `jspdf-autotable@3.8.2` as explicit npm dependencies so they are bundled at build time rather than fetched from a CDN at runtime. Also installed Workbox packages explicitly at `^6.5.4`: `workbox-core`, `workbox-expiration`, `workbox-precaching`, `workbox-routing`, `workbox-strategies`, and `workbox-cacheable-response`. These are the modules imported by the new service worker.

`src/utils/generatePdf.js` — Removed the CDN guard (`if (!window.jspdf)` throw) and the `const { jsPDF } = window.jspdf` destructure that depended on a globally injected `window.jspdf` object. Added ESM imports at the top of the file: `import { jsPDF } from 'jspdf'` and `import 'jspdf-autotable'`. Updated the file-level JSDoc comment to reflect that jsPDF is now bundled via npm rather than loaded from CDN. All existing PDF generation logic is unchanged.

`public/index.html` — Removed the two CDN `<script>` tags that loaded jsPDF 2.5.1 and jspdf-autotable 3.8.2 from cdnjs.cloudflare.com. These tags are no longer needed because both libraries are now bundled.

`public/manifest.json` — Replaced all Create React App placeholder values with real app identity: `name` changed from "Create React App Sample" to "Bathroom Safety Audit"; `short_name` changed from "React App" to "Safety Audit"; added `description`: "Field audit tool for assessing bathroom safety risks"; `theme_color` changed from `#000000` to `#cc0000` (brand red); `start_url` changed from `"."` to `"/Audit-App-React/"` to match the GitHub Pages subdirectory path; added `scope`: `"/Audit-App-React/"` for the same reason; added `orientation`: `"portrait"`; added `categories`: `["health", "utilities"]`; added `"purpose": "maskable any"` to the 512×512 icon entry so the icon can be adapted to circular and squircle shapes on Android.

`src/service-worker.js` (new) — A Workbox-powered service worker using Create React App's InjectManifest pattern. Precaches all JS, CSS, and HTML build assets via `self.__WB_MANIFEST` (the list is injected at build time by the CRA Workbox plugin). Includes a SPA navigation fallback: all navigate requests that do not match a precached URL are served the cached `index.html` so client-side routing works offline. Google Fonts stylesheets are cached with a StaleWhileRevalidate strategy; Google Fonts font files are cached with CacheFirst with a 1-year expiry and a CacheableResponsePlugin restricted to HTTP 0 and 200 responses. Includes a `SKIP_WAITING` message handler so a waiting service worker can be activated immediately — the infrastructure for a future "update available" toast.

`src/serviceWorkerRegistration.js` (new) — Production-only service worker registration utility copied from the CRA template and adapted for this project. Registers the service worker only when `process.env.NODE_ENV === 'production'` and the app is served from a valid origin. Handles localhost registration separately from production with a `checkValidServiceWorker` path for local testing. Accepts `onUpdate` and `onReady` callbacks so a future UI can respond to SW lifecycle events (e.g. showing a "New version available — reload" banner). Includes comments explaining the production gate and how to test offline behaviour locally using `npm run build && npx serve -s build`.

`src/index.js` — Added `import * as serviceWorkerRegistration from './serviceWorkerRegistration'` and called `serviceWorkerRegistration.register()` after the React render. This activates service worker registration in production builds.

**Why:** jsPDF was previously loaded from a public CDN at runtime. If an auditor opened the app for the first time without an internet connection, the CDN scripts would fail to load and PDF export would throw a runtime error. Moving to npm-bundled jsPDF means the PDF library is included in the production build and available offline. The Workbox service worker precaches all build assets on first load, so subsequent visits and all app functionality — including PDF export — work without any network connection. The manifest update enables "Add to Home Screen" installation on iOS and Android so the app can be launched like a native app without a browser address bar.

---

## [2026-02-20] — Risk Score Dashboard & PDF risk summary

**Agent:** Form Agent (with QA pass)
**Files changed:**
- `src/utils/riskEngine.js` (new)
- `src/components/RiskDashboard/RiskDashboard.jsx` (new)
- `src/components/RiskDashboard/RiskDashboard.css` (new)
- `src/App.js`
- `src/utils/generatePdf.js`
- `src/App.css`

**What changed:**

`src/utils/riskEngine.js` — New pure function `computeRiskScore(formFields)` returning `{ score, level, sectionScores, flags, hasAnyData }`. Score 0–100 (higher = safer). Declarative `RULES` array covers sections 1–4, 7–8 with weighted deductions per field value. Section 5 handled dynamically: user age drives an age multiplier (1.3× for age ≥70, 1.15× for age ≥60) that amplifies critical and high-severity deductions. Section sub-scores computed as a 0–100 ratio of actual vs maximum deductions per section. Flags deduplicated and sorted by severity (critical → high → medium).

`src/components/RiskDashboard/RiskDashboard.jsx` — Dashboard component rendered after the 8 audit sections, just above the ActionBar. Displays: empty-state placeholder when no audit data entered; large score number with colour matching the risk level; animated level badge (Safe / Caution / At Risk / High Risk); animated score progress bar; section breakdown sub-scores in a responsive 2-column grid; prioritised flags list with coloured severity badges (Critical / High / Medium).

`src/components/RiskDashboard/RiskDashboard.css` — Responsive styles using existing CSS variables. 2-column section grid collapses to 1-column on mobile (≤560px). Section name column set to 96px — wide enough to display "Infrastructure" without truncation. Score number colour adapts per risk level (green → amber → orange → red).

`src/App.js` — Added `computeRiskScore` import from `./utils/riskEngine`. Added `RiskDashboard` import. Added `riskScore = useMemo(() => computeRiskScore(formData.fields), [formData.fields])`. Rendered `<RiskDashboard risk={riskScore} />` between the sections `.content` div and `<ActionBar>`.

`src/utils/generatePdf.js` — Added `computeRiskScore` import. Computes `riskScore` inside `generatePdf()`. Added `drawRiskSummary()` function drawing a safety summary block on page 1 after the header: charcoal heading strip, score number + coloured level badge, score bar, 2-column section sub-score mini-bars with coloured fills, and a flags list (max 8 with overflow note). State reset (font/color) added at function end to prevent bleed into subsequent section tables.

`src/App.css` — Removed bottom padding from `.content` so sections sit flush above the dashboard.

**QA fixes applied this session:**
- H-4: Reduced PDF bullet dot radius 1.5 → 1.2 for cleaner flag list spacing
- M-1: Widened `.risk-section-name` from 80px → 96px; "Infrastructure" no longer truncates
- Q-2: Added font/color state reset at end of `drawRiskSummary` to prevent style bleed into section tables
- A-4: Added `role="img"` + `aria-label` to each section sub-score bar container for screen reader context

**Why:** Auditors needed a quick, visual summary of overall bathroom safety at-a-glance, and the PDF needed to lead with a risk overview rather than jumping straight to section tables. The scoring engine is declarative so future rule changes require only adding entries to the `RULES` array.

**QA outcome:** One QA pass. All 4 issues resolved. Passed on second build.

---

## [2026-02-20] — Mobile overflow fixes, accessibility pass, and inline confirmation banner

**Agent:** Form Agent (with QA + Architect passes)
**Files changed:**
- `src/index.css`
- `src/App.css`
- `src/components/Section/Section.css`
- `src/components/Section/Section.jsx`
- `src/components/Header/Header.jsx`
- `src/App.js`
- `src/components/ActionBar/ActionBar.jsx`
- `src/components/ActionBar/ActionBar.css`

**What changed:**

`src/index.css` — Added `overflow-x: hidden` to both `html` and `body` to prevent horizontal scroll on mobile when any child element overflows the viewport width.

`src/App.css` — Added `width: 100%` to `.container` so it fills its parent on narrow viewports where `max-width: 760px` would not constrain it.

`src/components/Section/Section.css` — Added `overflow: hidden`, `text-overflow: ellipsis`, `min-width: 0`, and `flex-shrink: 1` to `.section-title` so long section titles truncate with ellipsis instead of overflowing the section header row on narrow screens.

`src/components/Section/Section.jsx` — Added `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space), `aria-expanded`, and `aria-controls` to the section header div for full keyboard and screen reader accessibility. Added `id={contentId}` to the section content div (paired with `aria-controls`). Added `aria-hidden={!expanded}` to the section content div so collapsed content is hidden from the accessibility tree. Added `aria-hidden="true"` to the section number span, section badge span, and expand icon span to remove decorative/redundant content from the accessible button name. Added `title={title}` to the section title span for a tooltip when the title is truncated. Added `aria-label` to all three StatusChip variants (complete, partial, error) and wrapped visible characters (✓, !, X/Y) in `aria-hidden="true"` inner spans to prevent double-announcement.

`src/components/Header/Header.jsx` — Added `role="progressbar"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}`, and `aria-label` to the progress bar div. Added `aria-hidden="true"` to the header emoji icon div. Added a division-by-zero guard: `progressPercent` now uses `totalSections > 0 ? ... : 0`.

`src/App.js` — Added `confirmNewAuditBanner` state (boolean) to replace `window.confirm` in the "Start New Audit" flow. `onNewAudit` now sets `confirmNewAuditBanner = true` and clears `validationBanner` instead of calling `window.confirm`. Added `onConfirmNewAudit`: resets form, photos, expandedSections, highlightErrors, erroredSections, validationBanner, and confirmNewAuditBanner in one handler. Added `onCancelNewAudit`: sets `confirmNewAuditBanner = false`. Updated `onFixFirst`: now also expands the first incomplete section into `expandedSections` before closing the validation banner, so the auditor lands directly on the section they need to fix. Passed `confirmNewAuditBanner`, `onConfirmNewAudit`, `onCancelNewAudit` as new props to `ActionBar`.

`src/components/ActionBar/ActionBar.jsx` — Added `role="alert"` to the existing validation banner div so screen readers announce it when it appears. Added inline "Start New Audit" confirmation banner: rendered when `confirmNewAuditBanner` is true, replaces the "Start New Audit" button, shows "Clear all form data and photos? This cannot be undone." with "Cancel" and "Yes, clear everything" buttons.

`src/components/ActionBar/ActionBar.css` — Added styles for `.banner-confirm .validation-banner-title` (neutral colour for confirm banner title vs red for validation) and `.validation-banner-subtitle` (muted secondary text below the confirm banner title).

**Why:** Field employees reported the app content going beyond the screen edge on mobile — horizontal overflow was caused by missing `overflow-x` clamping and no `width: 100%` on the container. QA audit flagged that `window.confirm` is unreliable in mobile/PWA contexts and that all interactive elements lacked keyboard and screen reader accessibility. Section header had no `role`, `tabIndex`, or ARIA attributes — inaccessible to keyboard users and screen readers. Progress bar had no ARIA progressbar role — invisible to assistive technology. Emoji and decorative spans were being read aloud by screen readers unnecessarily.

**QA outcome:** Three QA passes required. All Critical and High issues resolved. Passed on third pass.

**Known issues carried forward (not fixed this session):**
- **NEW-2 (Low):** `role="button"` div has no explicit `aria-label` fallback — accessible name depends on text content descendants; advisory only.
- **NEW-4 (Low/cosmetic):** "Yes, clear everything" and "Fix first" share a CSS class despite different semantic roles.

---

## [2026-02-19] — Form Agent — Form validation & completion tracking

**Agent:** Form Agent
**Files changed:**
- `src/data/sectionSchema.js`
- `src/App.js`
- `src/components/Header/Header.jsx`
- `src/components/Section/Section.jsx`
- `src/components/Section/Section.css`

### What changed and why

**`src/data/sectionSchema.js` — Added completion-computation helpers**
Added two new exported functions:
- `getDynamicRequiredKeys(sectionNum, formFields)` — builds the full list of required field keys for a given section. Section 5 is handled specially: instead of a static list, the function reads the stored `5-userIds` array and expands the per-user field templates (e.g. `u{id}-age`, `u{id}-weight`) for every active user ID, so required-field counts scale correctly with the number of user profiles added.
- `computeSectionCompletion(sectionNum, formFields)` — calls `getDynamicRequiredKeys` and counts how many of those keys have a non-empty value in `formFields`. Returns `{ filled, total, complete }`. Used by `App.js` to compute one completion object per section on every render.

**`src/App.js` — Completion map, error state, pre-export validation**
- Added `useMemo`-computed `sectionCompletions` map: one `{ filled, total, complete }` entry per section, recalculated whenever `formData.fields` changes.
- Added `completedCount` derived value: count of sections where `complete === true`.
- Added `highlightErrors` state (boolean, default `false`): set to `true` when the auditor attempts to export with incomplete sections; auto-resets to `false` when any field value changes so error chips clear themselves as the auditor fills in the gaps.
- Modified `onExportPdf`: before triggering PDF generation, checks all 8 sections. If any are incomplete, shows a `window.confirm` dialog that lists the names of every incomplete section by number and title. The auditor can proceed anyway or cancel to go back and fill in missing fields.
- Passes `completion` and `hasError` as new props down to each `<Section>` component.

**`src/components/Header/Header.jsx` — Progress bar reflects real completion**
- Removed `expandedCount` prop (which tracked sections *opened*).
- Added `completedCount` prop (sections with all required fields filled).
- Progress bar percentage and label now derived from `completedCount`. Label reads "X / 8 sections complete" when partially done and "All sections complete" when all 8 are done.

**`src/components/Section/Section.jsx` — Per-section status chip**
Added a `StatusChip` sub-component rendered inside each section's header row. Behaviour:
- No chip shown if the section has not been touched at all (0 filled, 0 total, or total is 0).
- Green chip with a "✓" checkmark when all required fields in the section are filled (`complete === true`).
- Amber chip showing "X/Y" when the section is partially filled.
- Red chip showing "! X/Y" when the auditor attempted export and this section was still incomplete (`hasError` prop is true and the section is not complete). Error appearance is driven by the `highlightErrors` flag passed from `App.js`.

**`src/components/Section/Section.css` — Status chip styles**
Added `.section-status` pill base class and three state variants:
- `.status-complete` — green background, white text
- `.status-partial` — amber background, dark text
- `.status-error` — red background, white text

### Known issues logged (not fixed this session)
- **C-2:** `highlightErrors` resets on any field change, which can dismiss error chips before the auditor has filled in all flagged sections.
- **H-3:** `window.confirm` pre-export dialog may be suppressed in some mobile browsers and PWA fullscreen contexts.
- **H-4:** `StatusChip` `<span>` elements have no `aria-label`; section header `<div>` has no `role="button"` or `tabIndex` for keyboard accessibility.
- **H-5:** Progress bar in `Header.jsx` has no `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` attributes.
- **L-2:** `.section-title` uses `white-space: nowrap` which may overflow on narrow screens.
- **L-4:** Header emoji icon is missing `aria-hidden="true"`.

---

## [2026-02-19] — PDF Agent — Findings PDF report (replaces window.print())

**Agent:** PDF Agent
**Branch:** `feature/pdf-findings-report`
**QA review:** Completed — all issues resolved before commit
**Files changed:**
- `public/index.html` — CDN scripts added
- `src/utils/pdfDataBuilder.js` (new)
- `src/utils/generatePdf.js` (new)
- `src/App.js` — replaced `onExportPdf`, added `isExporting` state
- `src/components/ActionBar/ActionBar.jsx` — loading state on Export button

### What changed and why

**`public/index.html` — jsPDF loaded via CDN**
Added jsPDF 2.5.1 and jsPDF-autoTable 3.8.2 as CDN `<script>` tags before the closing `</body>` tag. npm install is unavailable in the sandbox environment; CDN loading also reduces the main bundle size. Scripts are cached by the browser after first load.

**`src/utils/pdfDataBuilder.js` — Form data → PDF data transformer (new file)**
Walks `sectionSchema` to transform raw `formData.fields` into a clean, display-ready array of section objects. Handles all 8 field types: `select`, `text`, `textarea`, `radio`, `checkgroup`, `grid`, `accessory`, and `avail-condition`. Resolves all raw values (e.g. `'ceramic-tiles'`) to human-readable labels (e.g. `'Ceramic Tiles'`) using the schema's `options` arrays. Strips internal management keys `5-userIds` and `5-nextId`. Handles Section 5 dynamic user profiles by reading active IDs and building one sub-block per user. If no user profiles were recorded, returns a single "No user profiles recorded" placeholder row instead of a ghost blank user.

**`src/utils/generatePdf.js` — Designed Findings PDF generator (new file)**
Replaces `window.print()` with a programmatic jsPDF document. Layout:
- First-page header: brand-red stripe (3mm) + dark charcoal band + "Bathroom Safety Audit / FINDINGS REPORT" title + 3-column meta row (Auditor, Date, Location). Long meta values are truncated with `…`.
- Per section (1–8): red-accented charcoal heading strip with section number chip; two-column autoTable (Field | Value) with grey subheading rows and alternating row shading; high-risk field values rendered in red bold; comments block with left red accent border (handles page overflow by splitting across pages); photos in a 2-column grid (handles page overflow per row). Photo format detected from data URI prefix (PNG vs JPEG) rather than hardcoded.
- Every page: footer with "Bathroom Safety Audit — Confidential" and "Page X of Y".
- Filename: `Findings_[Location]_[Date].pdf`, special characters sanitised.
- Guard on `doc.lastAutoTable?.finalY` — safe fallback if autoTable fails internally.

**`src/App.js` — Replace onExportPdf**
- Removed `window.print()` and the `setExpandedSections` expand-all call
- Added `generatePdf` import from `./utils/generatePdf`
- `photos` (raw object) now destructured from `usePhotoContext()` and passed directly to `generatePdf`
- Added `isExporting` state — set true before PDF generation, false in `finally`
- Short `setTimeout(80ms)` before generating allows the "Generating PDF…" toast to render before the synchronous jsPDF work blocks the thread
- Toast shows "Generating PDF…" → "PDF saved!" on success, or the error message on failure
- `isExporting` passed to `ActionBar`

**`src/components/ActionBar/ActionBar.jsx` — Loading state**
- `isExporting` prop added
- Export button label switches to "Generating…" while exporting
- All three buttons (`Save Draft`, `Export as PDF`, `Start New Audit`) disabled during export to prevent double-tap

### QA issues resolved this session
- (High) `doc.lastAutoTable` unguarded — fixed with `?.finalY ?? currentY`
- (Medium) `drawComments` page overflow for long comments — fixed with chunked while-loop
- (Medium) Photo format hardcoded as JPEG — fixed with data URI prefix detection
- (Low) Section 5 empty state rendered ghost "User 1" — fixed with early return placeholder row
- (Low) Silent meta value truncation — fixed with `…` suffix

### Known limitations carried forward
- jsPDF CDN requires internet on first app load. If an auditor opens the app for the first time without internet, PDF export will fail with a user-visible error toast. Addressed when PWA/offline support is implemented (roadmap item 5).

---

## [2026-02-18] — Agent team setup & Phase 1 audit

**Agent:** Architect Agent
**Files changed:** AGENTS.md (created), CHANGELOG.md (created)
**What changed:** Conducted a full Phase 1 status review of the codebase. Identified 3 critical bugs and 3 secondary issues. Established the agent team structure in AGENTS.md.
**Why:** To establish a clear picture of the current state before any further development, and to set up a structured workflow for all future changes.

**Issues identified:**
- (Critical) FormContext and PhotoContext built but not wired into App.js — old hooks still in use
- (Critical) Photos lost on page refresh — usePhotos stores in component state only
- (Critical) Draft silently deleted after PDF export due to clearDraft() in window.print() callback
- (High) User profile count not persisted to localStorage — lost on draft restore
- (High) Progress bar tracks sections opened, not fields completed
- (High) No required-field validation before PDF export

**Decisions pending:**
- FieldRenderer/sectionSchema migration — complete or cut?
- window.print() vs html2pdf.js for PDF generation — needs real device test

---

## [2026-02-18] — Form Agent — Wire context providers, fix export bug, persist user profile count

**Agent:** Form Agent
**Files changed:** `src/index.js`, `src/App.js`, `src/sections/UserProfiles.jsx`
**QA review:** Completed (see QA Agent report)

### What changed and why

**`src/index.js` — Activated FormContext and PhotoContext**
Wrapped `<App />` in `<FormProvider>` and `<PhotoProvider>` at the root. Both context providers were fully built but had never been mounted — the app was still running off the old `useFormData` and `usePhotos` hooks. This change activates:
- Auto-save every 30 seconds (FormContext) — draft is saved automatically when any field or meta data is present
- Photo persistence across page refresh (PhotoContext) — photos are written to `localStorage` under a separate key (`bathroomAuditPhotos`) and restored on load
- Image compression before storage — photos are resized to max 1200px wide and re-encoded as JPEG at 70% quality

**`src/App.js` — Swapped hooks for context; removed clearDraft from export**
- Replaced `useFormData` import with `useFormContext`; replaced `usePhotos` import with `usePhotoContext`
- Old hooks are retained on disk but are no longer called anywhere in the app
- Removed `clearDraft()` call from inside the `setTimeout` that wraps `window.print()`. Previously, triggering PDF export — and then cancelling the browser print dialog — would silently delete the entire draft with no warning or confirmation. The draft now survives any export action. A deliberate "clear" action (with user confirmation) is deferred to a future task.
- Removed the now-unused `clearDraft` import from `utils/storage`

**`src/sections/UserProfiles.jsx` — Persisted user profile count via form state**
- `userIds` and `nextId` were stored in local `useState` and were not included in the draft save. On page refresh or draft restore, the UI always reverted to one user card even if multiple profiles had been added.
- Replaced with form-field-derived state: `userIds` is read from `getField('5-userIds')` (stored as a JSON array string) and `nextId` from `getField('5-nextId')` (stored as an integer string)
- `addUser` and `removeUser` now call `updateField` instead of local `setState`, so profile count flows into the draft automatically via both manual save and auto-save
- Removed `useState` import — no longer needed in this component

### Known issues flagged by QA (not yet fixed)
- `savePhotos` silently swallows `QuotaExceededError` — no user-visible feedback when a photo fails to save because localStorage is full
- No "Start New Audit" workflow exists — form data and photos from a previous audit persist on the device for the next session
- `5-userIds` and `5-nextId` are internal management keys mixed into `formData.fields` alongside real audit data — PDF Agent must strip or ignore these when building the report
- `loadDraft()` is called on every FormProvider re-render rather than in a lazy initializer — performance concern on low-end mobile devices
- Removed user profile field data (`u{n}-age`, etc.) is not cleaned up from `formData.fields` when a user card is removed

---

## [2026-02-18] — Form Agent — JSON.parse safety, lazy draft load, data contract documentation

**Agent:** Form Agent
**Files changed:** `src/sections/UserProfiles.jsx`, `src/context/FormContext.js`, `AGENTS.md`

### What changed and why

**`src/sections/UserProfiles.jsx` — Hardened JSON.parse and parseInt for corrupt localStorage data**
- `JSON.parse(rawIds)` had no error boundary — a corrupt value in `localStorage` (e.g. truncated write, manual edit) would throw an unhandled exception and crash the entire UserProfiles section
- Wrapped in `try/catch` with fallback to `[1]` (single default user)
- `parseInt(rawNext, 10)` returns `NaN` when the stored string is empty or non-numeric. `NaN` is falsy in a boolean context but not caught by a simple `||` fallback. Replaced the ternary guard with an explicit `Number.isNaN(parsedNext) ? 2 : parsedNext` check so the fallback fires correctly

**`src/context/FormContext.js` — Moved loadDraft() into a useReducer lazy initializer**
- `loadDraft()` was being called on every render of `FormProvider`, meaning localStorage was read on every keystroke and every auto-save dispatch. On low-end mobile devices this creates avoidable I/O on the hot path.
- Moved to `useReducer`'s third-argument lazy initializer: `useReducer(formReducer, null, () => { const draft = loadDraft(); return draft ? { ...draft, lastSaved: draft.timestamp } : initialState; })`. The initializer runs exactly once, when the component mounts.
- Updated `hasDraft` derivation from `useRef(!!draft)` (where `draft` was in scope) to `useRef(state.timestamp !== null)` since the draft variable is no longer accessible outside the initializer

**`AGENTS.md` — Fully documented the Form → PDF data contract**
- The data contract section in AGENTS.md was a placeholder stub. Replaced with the complete contract:
  - `meta` shape documented with field types and empty-string semantics
  - `fields` object documented with section prefix conventions (`1-*` through `8-*`)
  - User profile field naming pattern documented (`u{id}-age`, `u{id}-weight`, etc.)
  - `5-userIds` and `5-nextId` flagged as **INTERNAL KEYS** — UI state only, not audit data, must be stripped by PDF Agent before rendering
  - Ghost field behaviour documented: when a user card is removed, its field data remains in the object; PDF Agent must parse `5-userIds` and filter to only render `u{id}-*` fields for IDs in the active list
  - Photos documented as separate from `formData.fields` — stored in `localStorage` under `bathroomAuditPhotos` and accessed via PhotoContext

---

## [2026-02-18] — Form Agent — Surface photo errors, add Start New Audit

**Agent:** Form Agent
**Files changed:** `src/context/PhotoContext.js`, `src/context/FormContext.js`, `src/App.js`, `src/components/ActionBar/ActionBar.jsx`, `src/components/ActionBar/ActionBar.css`

### What changed and why

**`src/context/PhotoContext.js` — Surface QuotaExceededError to the user**
- `savePhotos()` previously caught all exceptions silently. When localStorage was full, a photo appeared to save but was silently dropped — the employee had no way to know.
- Removed the try/catch from `savePhotos` so it throws on failure
- Added `photoError` state (`useState(null)`) to `PhotoProvider`
- The `useEffect` that calls `savePhotos(photos)` now wraps it in try/catch; on failure it sets `photoError` to a user-readable message: `"Storage full — the last photo was not saved. Please remove some photos and try again."`
- Added `clearPhotoError` callback and exposed `photoError` and `clearPhotoError` in the context value

**`src/App.js` — Wire photo error to Toast; add Start New Audit**
- Added `useEffect` watching `photoError`: when it becomes non-null, forwards the message to `setToast` and calls `clearPhotoError()`. This routes photo storage failures through the same Toast mechanism used for other user notifications.
- Added `hasActiveData` boolean: true when `formData.fields` has any keys, or when `meta.auditor` or `meta.location` is non-empty. Used to conditionally show the "Start New Audit" button only when there is data to clear.
- Added `onNewAudit` handler: shows `window.confirm` before calling `resetForm()`, `resetPhotos()`, and clearing `expandedSections`. Prevents accidental data loss.
- Passed `onNewAudit` and `hasActiveData` as new props to `ActionBar`

**`src/context/FormContext.js` — Add RESET action and resetForm**
- Added `RESET` case to `formReducer`: returns a clean initial state with today's date recalculated at dispatch time (not stale from component mount)
- Added `resetForm` callback: calls `clearDraft()` then dispatches `RESET`
- Exposed `resetForm` in the context value
- Added `clearDraft` to the storage imports

**`src/context/PhotoContext.js` — Add resetPhotos**
- Added `resetPhotos` callback: calls `clearPhotos()` then sets `photos` to `{}`
- Exposed `resetPhotos` in the context value

**`src/components/ActionBar/ActionBar.jsx` — Add Start New Audit button**
- Added `onNewAudit` and `hasActiveData` props
- When `hasActiveData` is true, renders a "Start New Audit" button above the main Save/Export row
- Existing Save Draft and Export as PDF buttons wrapped in a `.actions-row` div for layout control

**`src/components/ActionBar/ActionBar.css` — Layout for new button**
- Changed `.actions` to `flex-direction: column` with `gap: 10px` to stack the new button above the main row
- Added `.actions-row` with `display: flex; gap: 12px` for the side-by-side Save/Export layout
- Added `.btn-new-audit` styles: full width, transparent background, muted border and text colour to visually de-emphasise it relative to the primary actions
- Updated mobile breakpoint (`max-width: 560px`): `.actions-row` stacks to `flex-direction: column`

---

## [2026-02-19] — GitHub Pages deploy setup

**Agent:** Git Agent / Docs Agent
**Files changed:** `package.json`, `package-lock.json`
**What changed:** Added `gh-pages` as a dev dependency and configured the project for GitHub Pages deployment.
**Why:** To make the app publicly accessible for real-world testing by field employees without requiring a local development environment.

**Changes made:**
- Installed `gh-pages@6.3.0` as a dev dependency (`npm install gh-pages --save-dev`)
- Added `"homepage": "https://rehantamang-a11y.github.io/Audit-App-React"` to `package.json` — required by Create React App to set the correct asset base path for the subdirectory deployment
- Added `"predeploy": "npm run build"` script — automatically runs a production build before every deploy
- Added `"deploy": "gh-pages -d build"` script — publishes the `build/` folder to the `gh-pages` branch on origin

**Deploy command:** `npm run deploy`
**Live URL:** https://rehantamang-a11y.github.io/Audit-App-React

---

*Future entries will be added here by the Docs Agent after each completed session.*
