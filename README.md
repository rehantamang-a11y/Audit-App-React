# Bathroom Safety Audit App

A React-based form application for conducting bathroom safety audits. Auditors can inspect and document 8 key areas of bathroom safety, add photos, save drafts, compute a dynamic risk score, export reports as PDF, and submit audit data to a Firebase backend. Works completely offline; syncs to the cloud when connectivity is restored.

**Current phase:** Phase 2 (Backend sync & offline submission) — in progress

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## Environment Variables

The app requires Firebase credentials to enable backend sync. If environment variables are not set, the app functions in offline-only mode with a console warning (sync features disabled).

Create a `.env` file in the project root:

```
REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
REACT_APP_FIREBASE_PROJECT_ID=<your-firebase-project-id>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your-firebase-project>.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=<your-firebase-project>.appspot.com
REACT_APP_AUDIT_API_URL=https://us-central1-<your-firebase-project>.cloudfunctions.net
```

**Note:** The `REACT_APP_AUDIT_API_URL` should point to the Cloud Function endpoint deployed via the `eyeagle-backend` repository. See [Backend Setup](#backend-setup) below.

## Backend Setup

This app has two separate repositories:

1. **`Audit app/`** (this repository) — React frontend
2. **`eyeagle-backend/`** (separate repository, same parent directory) — Firebase Cloud Functions backend

To enable backend sync:

1. Set up the Firebase project and deploy the Cloud Functions:
   ```bash
   cd ../eyeagle-backend
   # Follow BACKEND_SETUP.md for detailed instructions
   firebase deploy
   ```

2. Copy the Cloud Function HTTP trigger URL (output by `firebase deploy`) and add it to the `.env` file as `REACT_APP_AUDIT_API_URL`.

3. The frontend will then be able to submit audits to the backend. Submissions are queued offline and synced automatically when connectivity is restored.

For deployment details, see `eyeagle-backend/BACKEND_SETUP.md`.

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header/          # App header with progress bar
│   ├── MetaBar/         # Auditor name, date, location fields
│   ├── Section/         # Collapsible section card + comments
│   ├── PhotoUpload/     # Photo upload with preview & removal
│   ├── UserProfile/     # Individual user profile card
│   ├── Toast/           # Toast notification
│   ├── ActionBar/       # Save Draft / Send Report / Export PDF buttons
│   ├── RiskDashboard/   # Safety score dashboard (score, sub-scores, flags)
│   └── fields/          # Reusable form field components
│       ├── SelectField
│       ├── TextField
│       ├── TextAreaField
│       ├── RadioGroup
│       ├── CheckGroup
│       ├── ConditionalField
│       └── FieldGrid
├── sections/            # Each audit section's form content
│   ├── PhysicalInfrastructure.jsx
│   ├── Accessories.jsx
│   ├── WashroomFixtures.jsx
│   ├── SharpEdgesPlumbing.jsx
│   ├── UserProfiles.jsx
│   ├── WashroomConfiguration.jsx
│   ├── ElectricalLightingHeating.jsx
│   └── AccessExit.jsx
├── hooks/               # Custom React hooks
│   ├── useFormData.js   # Form state management & draft persistence
│   └── usePhotos.js     # Photo upload state management
├── utils/
│   ├── riskEngine.js    # Pure scoring engine (0–100 safety score)
│   ├── generatePdf.js   # jsPDF-based PDF export (bundled, not CDN)
│   └── storage.js       # localStorage helpers for draft save/load
├── service-worker.js    # Workbox service worker (precaches all build assets)
├── serviceWorkerRegistration.js  # Production-only SW registration utility
├── styles/
│   └── variables.css    # CSS custom properties (design tokens)
├── App.js               # Root component, section config, layout
├── App.css              # Container & content layout styles
├── index.js             # Entry point
└── index.css            # Global styles, field styles, print styles
```

---

## Known Issues

Issues logged by QA that have not yet been fixed. Severity labels: **(H)** High, **(M)** Medium, **(L)** Low, **(C)** Code quality.

| ID | Severity | Description | Logged | Status |
|----|----------|-------------|--------|--------|
| C-2 | (C) | `highlightErrors` resets on any field change — error chips in section headers may clear before the auditor has filled all flagged sections | 2026-02-19 | Resolved 2026-02-20 |
| H-3 | (H) | `window.confirm` pre-export validation dialog may be suppressed on some mobile browsers and PWA fullscreen contexts | 2026-02-19 | Resolved 2026-02-20 — replaced with inline confirmation banner |
| H-4 | (H) | `StatusChip` spans have no `aria-label`; section header `<div>` has no `role="button"` or `tabIndex` — keyboard and screen reader users cannot interact with section headers | 2026-02-19 | Resolved 2026-02-20 |
| H-5 | (H) | Progress bar in `Header.jsx` has no `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` attributes | 2026-02-19 | Resolved 2026-02-20 |
| L-2 | (L) | `.section-title` uses `white-space: nowrap` — section titles may overflow and be clipped on narrow screens | 2026-02-19 | Resolved 2026-02-20 — ellipsis truncation added |
| L-4 | (L) | Header emoji icon is missing `aria-hidden="true"` — may be read aloud unnecessarily by screen readers | 2026-02-19 | Resolved 2026-02-20 |
| M-1 | (M) | `savePhotos` silently swallows `QuotaExceededError` — no user-visible feedback when a photo fails to save because localStorage is full | 2026-02-18 | Open |
| L-1 | (L) | Removed user profile field data (`u{n}-age`, etc.) is not cleaned up from `formData.fields` when a user card is deleted — stale data persists in the draft | 2026-02-18 | Open |
| M-2 | (M) | jsPDF loaded via CDN — PDF export will fail if the auditor opens the app for the first time without an internet connection | 2026-02-19 | Resolved 2026-02-20 — jsPDF is now bundled via npm; CDN script tags removed |
| PWA-1 | (L) | No user-facing "new version available" banner — SKIP_WAITING infrastructure is in place in the service worker but not wired to a UI toast or banner | 2026-02-20 | Open |
| PWA-2 | (L) | App icons are still the default CRA React logo — branded artwork has not yet been created | 2026-02-20 | Open |
| PWA-3 | (L) | Google Fonts will not render on a true first offline load — the font is only cached after the first online visit; the service worker caches it on subsequent visits | 2026-02-20 | Open |
| NEW-2 | (L) | `role="button"` section header div has no explicit `aria-label` fallback — accessible name is derived from text content descendants; advisory only | 2026-02-20 | Open |
| NEW-4 | (L) | "Yes, clear everything" and "Fix first" buttons share a CSS class despite different semantic roles — cosmetic concern | 2026-02-20 | Open |

---

## Improvements Roadmap

### Phase 2 — Backend Sync & Offline Submission ✅ *Completed 2026-02-24*

**Completed in this phase:**

- **Backend API & Firebase integration** — Cloud Functions endpoint validates and stores audit submissions in Firestore, keyed by authenticated user ID
- **Offline-first submission** — frontend checks device online status and queues submissions locally if offline
- **Graceful retry** — pending submissions saved to localStorage with a restore timestamp; users can retry manually or wait for auto-retry when online
- **Send Report UI** — new "Send Report" button in ActionBar with five states (idle, syncing, success, error, offline) and helpful status messages
- **Sync status tracking** — form context now tracks sync state and audit ID; shows "Edits made after sync" notice when form is modified after successful submission

### User Experience (UX) Improvements

1. **Form Validation & Completion Tracking** ✅ *Implemented 2026-02-19*
   - ~~Show per-section completion percentage (not just "opened")~~ — progress bar now reflects required-field completion, not sections opened
   - ~~Highlight required fields that are empty on export~~ — pre-export `window.confirm` dialog lists every incomplete section by name; section chips turn red
   - ~~Add visual indicators (green check) for fully completed sections~~ — green/amber/red status chips in each section header
   - Section 5 (User Profiles) completion scales dynamically with the number of user profiles added
   - Known limitations: error chips clear on any field change (C-2); confirm dialog may be suppressed in some PWA/mobile contexts (H-3); status chips and progress bar are missing ARIA attributes (H-4, H-5)

2. **Auto-Save**
   - Automatically save the draft every 30-60 seconds instead of requiring manual save
   - Show a "last saved at" timestamp

3. **Better PDF / Report Export** ✅ *Implemented 2026-02-19*
   - ~~Use a proper PDF library instead of `window.print()`~~ — replaced with jsPDF via CDN
   - Designed "Findings" report: cover header, 8-section field tables, comments blocks, inline photos, page footers
   - High-risk values highlighted in red; filename is dynamic (`Findings_[Location]_[Date].pdf`)
   - Works on mobile — triggers a direct file download with no print dialog
   - Pending: risk summary section (roadmap item 4)

4. **Risk Score Dashboard** ✅ *Implemented 2026-02-20*
   - ~~Compute a safety risk score based on field selections~~ — implemented as a declarative rule engine in `riskEngine.js` covering sections 1–4, 7–8 with weighted deductions and an age multiplier (1.3× for age ≥70, 1.15× for age ≥60) for Section 5
   - ~~Show a visual summary dashboard~~ — live dashboard rendered after all 8 sections with animated score bar, per-section sub-scores, and a prioritised flags list (Critical / High / Medium)
   - Risk score integrated into PDF as a summary block on page 1 (score number, level badge, coloured bar, section sub-scores, and flags)

5. **Offline / PWA Support** ✅ *Implemented 2026-02-20*
   - ~~Make the app installable as a Progressive Web App~~ — `manifest.json` updated with real app name, description, brand colour (`#cc0000`), correct `start_url` and `scope` for the GitHub Pages subdirectory, and `"purpose": "maskable any"` on the 512×512 icon. The app can be installed via "Add to Home Screen" on iOS and Android.
   - ~~Full offline support using service workers~~ — a Workbox-powered service worker (`src/service-worker.js`) precaches all JS, CSS, and HTML build assets on first load. All app functionality, including PDF export, works without a network connection after the first visit. SPA navigation fallback serves the cached `index.html` for all navigate requests so client-side routing works offline.
   - jsPDF is now bundled via npm (`jspdf@2.5.1`, `jspdf-autotable@3.8.2`) — no longer fetched from a CDN at runtime. PDF export works offline.
   - Google Fonts stylesheets cached with StaleWhileRevalidate; font files cached CacheFirst with a 1-year expiry.
   - Known limitations: no "new version available" banner yet (PWA-1); app icons are still the default CRA logo (PWA-2); Google Fonts will not render on a true first offline load — only cached after the first online visit (PWA-3).

6. **Multi-Audit Management**
   - Allow saving and managing multiple audits (list of past audits)
   - Each audit linked to a specific property/address
   - Export history and comparison between audits

7. **Photo Annotations**
   - Allow auditors to draw on uploaded photos to circle problem areas
   - Add captions/labels to each photo

8. **Dark Mode**
   - Add a dark mode toggle for low-light environments

9. **Accessibility** — *Partially in progress (2026-02-20)*
   - ~~Section header div: added `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space), `aria-expanded`, `aria-controls`~~ — keyboard and screen reader users can now activate section headers
   - ~~StatusChip: added `aria-label` to all three variants; decorative characters wrapped in `aria-hidden="true"`~~ — chip state is announced without double-reading visible characters
   - ~~Progress bar: added `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`~~ — completion progress now visible to assistive technology
   - ~~Header emoji icon: added `aria-hidden="true"`~~ — no longer read aloud by screen readers
   - ~~Collapsed section content: added `aria-hidden={!expanded}`~~ — hidden content excluded from the accessibility tree when collapsed
   - ~~Section number, badge, and expand icon spans: added `aria-hidden="true"`~~ — decorative elements removed from the accessible button name
   - Add proper ARIA labels to all remaining form controls (field-level labels, checkgroups, grids)
   - Full screen reader compatibility audit still pending
   - Known remaining gaps: NEW-2 (no explicit `aria-label` fallback on section header button), NEW-4 (shared CSS class on semantically distinct buttons)

10. **Localization / Multi-Language**
    - Support Hindi, regional languages, or other languages for field auditors

### Code & Maintenance Improvements

1. **TypeScript Migration**
   - Add TypeScript for type safety across all components, hooks, and data structures
   - Define interfaces for form data, section config, user profiles, etc.

2. **State Management**
   - Move to a context-based or reducer-based state management (React Context + useReducer or Zustand)
   - Currently the form state is passed through many prop levels — a global store would simplify this

3. **Data-Driven Section Config**
   - Move all field definitions (options, labels, keys) into a JSON/config file
   - Each section component could be a generic renderer instead of hand-coded JSX
   - This would make it easy to add/remove/reorder audit fields without touching components

4. **Testing**
   - Add unit tests for hooks (`useFormData`, `usePhotos`) with React Testing Library
   - Add integration tests for form fill, save draft, restore draft flow
   - Add snapshot tests for section components

5. **Form Library Integration**
   - Consider using a form library like `react-hook-form` or `formik` for:
     - Built-in validation
     - Better performance (fewer re-renders)
     - Easier error handling

6. **Backend Integration** ✅ *Implemented 2026-02-24*
   - ~~Connect to a backend API~~ — Firebase Cloud Functions deployed, audits stored in Firestore
   - ~~Store audits in a database~~ — every submission saved to Firestore under `/audits/{userId}/{auditId}`
   - Anonymous user authentication — Firebase Auth handles anonymous auth; ID token included in sync requests
   - Pending: Photo upload to cloud storage (photos currently stored inline in Firestore documents); multi-device sync (audit data isolated per user account)

7. **Component Library / Design System**
   - Extract the field components into a shared design system
   - Use CSS Modules or styled-components for scoped styles (avoiding global CSS conflicts)

8. **Performance**
   - Memoize section components with `React.memo` to prevent unnecessary re-renders
   - Lazy load section components that aren't yet expanded
   - Compress uploaded photos before storing in state (they are currently stored as full base64)

9. **Error Boundaries**
   - Add React error boundaries around sections so one section crashing doesn't break the whole app

10. **CI/CD Pipeline**
    - Set up GitHub Actions for linting, testing, and deployment
    - Add ESLint + Prettier for code consistency
    - Auto-deploy to Vercel/Netlify on push
