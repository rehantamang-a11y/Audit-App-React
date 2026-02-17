# Bathroom Safety Audit App

A React-based form application for conducting bathroom safety audits. Auditors can inspect and document 8 key areas of bathroom safety, add photos, save drafts, and export reports as PDF.

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
│   ├── ActionBar/       # Save Draft / Export PDF buttons
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
│   └── storage.js       # localStorage helpers for draft save/load
├── styles/
│   └── variables.css    # CSS custom properties (design tokens)
├── App.js               # Root component, section config, layout
├── App.css              # Container & content layout styles
├── index.js             # Entry point
└── index.css            # Global styles, field styles, print styles
```

---

## Improvements Roadmap

### User Experience (UX) Improvements

1. **Form Validation & Completion Tracking**
   - Show per-section completion percentage (not just "opened")
   - Highlight required fields that are empty on export
   - Add visual indicators (green check) for fully completed sections

2. **Auto-Save**
   - Automatically save the draft every 30-60 seconds instead of requiring manual save
   - Show a "last saved at" timestamp

3. **Better PDF / Report Export**
   - Use a proper PDF library (e.g., `react-pdf`, `jsPDF`, or `html2pdf.js`) instead of `window.print()`
   - Include a cover page with audit metadata, summary scores, and date
   - Generate a risk summary section automatically based on the selected values

4. **Risk Score Dashboard**
   - Compute a safety risk score based on field selections (e.g., high-risk items, missing anti-skid mats)
   - Show a visual summary dashboard at the top or as a final section

5. **Offline / PWA Support**
   - Make the app installable as a Progressive Web App
   - Full offline support using service workers so auditors can use it in the field without internet

6. **Multi-Audit Management**
   - Allow saving and managing multiple audits (list of past audits)
   - Each audit linked to a specific property/address
   - Export history and comparison between audits

7. **Photo Annotations**
   - Allow auditors to draw on uploaded photos to circle problem areas
   - Add captions/labels to each photo

8. **Dark Mode**
   - Add a dark mode toggle for low-light environments

9. **Accessibility**
   - Add proper ARIA labels to all form controls
   - Ensure keyboard navigation works for all interactive elements
   - Screen reader compatibility

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

6. **Backend Integration**
   - Connect to a backend API (Node/Express, Firebase, Supabase) to:
     - Store audits in a database
     - Upload photos to cloud storage (S3, Cloudinary)
     - Enable multi-device sync
   - Add user authentication for auditor accounts

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
