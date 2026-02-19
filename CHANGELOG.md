# Changelog — Bathroom Safety Audit App

All changes to this project are documented here in reverse chronological order.
Updated by the Docs Agent after every completed task or session.

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
