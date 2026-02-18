/**
 * Section Schema — defines every field across all 8 audit sections.
 * Field types: 'select', 'text', 'textarea', 'radio', 'checkgroup'
 * Layout types: 'grid' (2-col), 'subsection' (heading), 'accessory-row' (avail+condition pair)
 */

const conditionOptions = [
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const sectionSchema = {
  // ─── Section 1: Physical Civil Infrastructure ───
  1: {
    title: 'Physical Civil Infrastructure',
    badge: 'Floor · Walls · Light',
    hint: 'Inspect the floor surface, wall finishing, and overall lighting quality.',
    fields: [
      { type: 'subsection', label: 'Floor' },
      {
        key: '1-floor-type', type: 'select', label: 'Surface Type', required: true,
        options: [
          { value: 'ceramic-tiles', label: 'Ceramic Tiles' },
          { value: 'vitrified-tiles', label: 'Vitrified Tiles' },
          { value: 'mosaic', label: 'Mosaic' },
          { value: 'marble', label: 'Marble' },
          { value: 'granite', label: 'Granite' },
          { value: 'anti-skid-tiles', label: 'Anti-Skid Tiles' },
          { value: 'vinyl', label: 'Vinyl' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        type: 'grid', fields: [
          {
            key: '1-floor-avail', type: 'select', label: 'Availability', required: true,
            options: [
              { value: 'yes', label: 'Present' },
              { value: 'no', label: 'Missing / Broken' },
            ],
          },
          {
            key: '1-floor-quality', type: 'select', label: 'Quality / Condition', required: true,
            options: [
              { value: 'excellent', label: 'Excellent' },
              { value: 'good', label: 'Good' },
              { value: 'fair', label: 'Fair' },
              { value: 'poor', label: 'Poor' },
              { value: 'needs-replacement', label: 'Needs Replacement' },
            ],
          },
        ],
      },
      {
        key: '1-floor-color', type: 'text', label: 'Floor Color',
        placeholder: 'e.g., White, Beige, Grey', wrapStyle: { marginTop: 12 },
      },

      { type: 'subsection', label: 'Walls' },
      {
        type: 'grid', fields: [
          {
            key: '1-wall-type', type: 'select', label: 'Wall Type', required: true,
            options: [
              { value: 'ceramic-tiles', label: 'Ceramic Tiles' },
              { value: 'vitrified-tiles', label: 'Vitrified Tiles' },
              { value: 'paint', label: 'Paint' },
              { value: 'waterproof-paint', label: 'Waterproof Paint' },
              { value: 'pvc-panels', label: 'PVC Panels' },
              { value: 'glass', label: 'Glass' },
              { value: 'other', label: 'Other' },
            ],
          },
          {
            key: '1-wall-color', type: 'text', label: 'Wall Color',
            placeholder: 'e.g., White, Cream',
          },
        ],
      },

      { type: 'subsection', label: 'Lighting' },
      {
        key: '1-washroom-light', type: 'select', label: 'Washroom Light Adequacy', required: true,
        options: [
          { value: 'bright', label: 'Bright — No issues' },
          { value: 'adequate', label: 'Adequate' },
          { value: 'dim', label: 'Dim — Improvement needed' },
          { value: 'insufficient', label: 'Insufficient — Risk for elderly' },
        ],
      },
    ],
  },

  // ─── Section 2: Accessories ───
  2: {
    title: 'Accessories',
    badge: 'Mats · Racks · Hooks',
    hint: 'Anti-skid mat and outdoor PVC mat are critical safety items — flag if missing or worn.',
    fields: [
      { type: 'accessory', label: 'Bucket', prefix: '2-bucket', required: true },
      { type: 'accessory', label: 'Round Tub', prefix: '2-tub' },
      { type: 'accessory', label: 'Plastic Stool', prefix: '2-stool' },
      { type: 'accessory', label: 'Racks', prefix: '2-racks' },
      { type: 'accessory', label: 'Wiper', prefix: '2-wiper' },
      { type: 'accessory', label: 'Wiper Wall Stand', prefix: '2-wiperstand' },
      { type: 'accessory', label: 'Towel Hanger', prefix: '2-towel' },
      {
        type: 'accessory', label: 'Anti-Skid Mat', prefix: '2-antiskid', required: true,
        availOptions: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No — Recommend immediately' },
        ],
        condOptions: [
          { value: 'good', label: 'Good' },
          { value: 'fair', label: 'Fair' },
          { value: 'poor', label: 'Poor — Replace' },
        ],
      },
      { type: 'accessory', label: 'PVC Floor Outdoor Mat', prefix: '2-pvcmat', required: true },
    ],
  },

  // ─── Section 3: Washroom Fixtures ───
  3: {
    title: 'Washroom Fixtures',
    badge: 'Commode · Taps · Shower',
    hint: 'Check each fixture for availability, working condition, leaks, or pressure issues.',
    fields: [
      {
        type: 'labeled-grid', label: 'WC Commode', fields: [
          {
            key: '3-commode-type', type: 'select', label: 'Type', required: true,
            options: [
              { value: 'western', label: 'Western' },
              { value: 'indian', label: 'Indian' },
              { value: 'both', label: 'Both' },
            ],
          },
          {
            key: '3-commode-cond', type: 'select', label: 'Condition', required: true,
            options: conditionOptions,
          },
        ],
      },
      {
        key: '3-flush', type: 'select', label: 'Flush', required: true,
        options: [
          { value: 'working-good', label: 'Working — Good pressure' },
          { value: 'working-weak', label: 'Working — Weak pressure' },
          { value: 'not-working', label: 'Not Working' },
          { value: 'leaking', label: 'Leaking' },
        ],
      },
      {
        type: 'avail-condition', label: 'Bidet / Health Faucet',
        availKey: '3-bidet-avail', condKey: '3-bidet-cond',
        condOptions: [
          { value: 'good', label: 'Good' },
          { value: 'fair', label: 'Fair' },
          { value: 'leaking', label: 'Leaking' },
        ],
      },
      {
        key: '3-washbasin', type: 'select', label: 'Washbasin', required: true,
        options: [
          { value: 'good', label: 'Good condition' },
          { value: 'cracked', label: 'Cracked' },
          { value: 'stained', label: 'Stained' },
          { value: 'drainage-issue', label: 'Drainage issue' },
        ],
      },
      {
        type: 'avail-condition', label: 'Shower Panel',
        availKey: '3-shower-avail', condKey: '3-shower-cond',
        condOptions: [
          { value: 'good', label: 'Good' },
          { value: 'low-pressure', label: 'Low Pressure' },
          { value: 'leaking', label: 'Leaking' },
        ],
      },
      {
        key: '3-faucets', type: 'select', label: 'Faucets', required: true,
        options: [
          { value: 'working-good', label: 'Working — Good' },
          { value: 'dripping', label: 'Dripping' },
          { value: 'stiff', label: 'Stiff / Hard to operate' },
          { value: 'not-working', label: 'Not Working' },
        ],
      },
      {
        type: 'avail-condition', label: 'Utility Tap',
        availKey: '3-utility-avail', condKey: '3-utility-cond',
        condOptions: [
          { value: 'good', label: 'Good' },
          { value: 'leaking', label: 'Leaking' },
          { value: 'not-working', label: 'Not Working' },
        ],
      },
      {
        key: '3-water-mix', type: 'select', label: 'Hot & Cold Water Mixture',
        options: [
          { value: 'available-working', label: 'Available & Working' },
          { value: 'available-not-working', label: 'Available — Not Working' },
          { value: 'not-available', label: 'Not Available' },
        ],
      },
      {
        type: 'labeled-grid', label: 'Shaft / Window', fields: [
          {
            key: '3-shaft-type', type: 'select', label: 'Type',
            options: [
              { value: 'window', label: 'Window' },
              { value: 'shaft', label: 'Shaft' },
              { value: 'both', label: 'Both' },
              { value: 'none', label: 'None' },
            ],
          },
          {
            key: '3-shaft-cond', type: 'select', label: 'Condition',
            condition: { field: '3-shaft-type', hideValue: 'none' },
            options: [
              { value: 'good', label: 'Good' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'damaged', label: 'Damaged' },
            ],
          },
        ],
      },
      {
        key: '3-exhaust', type: 'select', label: 'Exhaust Fan',
        options: [
          { value: 'available-working', label: 'Available & Working' },
          { value: 'available-not-working', label: 'Available — Not Working' },
          { value: 'noisy', label: 'Noisy' },
          { value: 'not-available', label: 'Not Available' },
        ],
      },
    ],
  },

  // ─── Section 4: Sharp Edges & Plumbing ───
  4: {
    title: 'Sharp Edges & Plumbing',
    badge: 'Hazards · Drains',
    hint: 'Rate each hazard. Flag any High Risk items for immediate action in your comments.',
    fields: [
      { type: 'subsection', label: 'Sharp Edges & Hazards' },
      {
        key: '4-slab-corner', type: 'select', label: 'Slab Corner', required: true,
        options: [
          { value: 'no-risk', label: 'No Risk — Rounded / Protected' },
          { value: 'low-risk', label: 'Low Risk' },
          { value: 'medium-risk', label: 'Medium Risk' },
          { value: 'high-risk', label: 'High Risk — Immediate action needed' },
        ],
      },
      {
        key: '4-bidet-edges', type: 'select', label: 'Bidet Edges', required: true,
        options: [
          { value: 'no-risk', label: 'No Risk' },
          { value: 'low-risk', label: 'Low Risk' },
          { value: 'medium-risk', label: 'Medium Risk' },
          { value: 'high-risk', label: 'High Risk' },
        ],
      },
      {
        key: '4-protruding', type: 'select', label: 'Protruding Objects', required: true,
        options: [
          { value: 'none', label: 'None' },
          { value: 'hooks-safe', label: 'Hooks — Safely rounded' },
          { value: 'hooks-sharp', label: 'Hooks — Sharp' },
          { value: 'pipes', label: 'Exposed pipes' },
          { value: 'fixtures', label: 'Sharp fixtures' },
        ],
      },
      {
        key: '4-electric-risk', type: 'select', label: 'Electric Shock Risk', required: true,
        options: [
          { value: 'no-risk', label: 'No Risk — Properly insulated' },
          { value: 'low-risk', label: 'Low Risk' },
          { value: 'medium-risk', label: 'Medium Risk — Check needed' },
          { value: 'high-risk', label: 'High Risk — Exposed wiring' },
        ],
      },

      { type: 'subsection', label: 'Plumbing Drainage' },
      {
        key: '4-shower-drain', type: 'select', label: 'Shower Drain', required: true,
        options: [
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'clogged', label: 'Clogged / Blocked' },
          { value: 'overflowing', label: 'Overflowing' },
          { value: 'no-drain', label: 'No drain' },
        ],
      },
      {
        key: '4-utility-drain', type: 'select', label: 'Utility Drain',
        options: [
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'clogged', label: 'Clogged / Blocked' },
          { value: 'not-available', label: 'Not available' },
        ],
      },
      {
        key: '4-wc-drain', type: 'select', label: 'WC Drain',
        options: [
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'frequent-clog', label: 'Frequent clogging' },
          { value: 'odor', label: 'Odour issues' },
        ],
      },
      {
        key: '4-sink-drain', type: 'select', label: 'Sink Drain',
        options: [
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'clogged', label: 'Clogged' },
          { value: 'leaking', label: 'Leaking' },
        ],
      },
    ],
  },

  // ─── Section 5: User Profiles (dynamic, handled separately) ───
  5: {
    title: 'User Profiles',
    badge: 'Multiple users supported',
    hint: 'Add a profile for each person who uses this bathroom. More users = more personalised safety assessment.',
    dynamic: true, // handled by UserProfiles component
    userFields: [
      {
        type: 'grid', fields: [
          { key: '{prefix}-age', type: 'text', label: 'Age', placeholder: 'e.g., 65', inputType: 'number', min: 0, max: 120, required: true },
          { key: '{prefix}-weight', type: 'text', label: 'Weight (kg)', placeholder: 'e.g., 70', inputType: 'number' },
        ],
      },
      {
        type: 'grid', fields: [
          { key: '{prefix}-height', type: 'text', label: 'Height (cm)', placeholder: 'e.g., 165', inputType: 'number' },
          {
            key: '{prefix}-relation', type: 'select', label: 'Relationship', required: true,
            options: [
              { value: 'self', label: 'Self' },
              { value: 'spouse', label: 'Spouse / Partner' },
              { value: 'parent', label: 'Parent' },
              { value: 'child', label: 'Child' },
              { value: 'other', label: 'Other' },
            ],
          },
        ],
      },
      {
        key: '{prefix}-conditions', type: 'checkgroup', label: 'Known Conditions',
        items: [
          { fieldKey: '{prefix}-cond-bp', label: 'Blood Pressure' },
          { fieldKey: '{prefix}-cond-diabetes', label: 'Diabetes' },
          { fieldKey: '{prefix}-cond-heart', label: 'Heart' },
          { fieldKey: '{prefix}-cond-mobility', label: 'Mobility Issues' },
        ],
      },
      {
        key: '{prefix}-conditions-other', type: 'textarea', label: 'Other Conditions / Medications',
        placeholder: 'Other conditions or medications...', minHeight: '56px',
      },
      {
        type: 'grid', fields: [
          {
            key: '{prefix}-wake-time', type: 'select', label: 'Wake Time',
            options: [
              { value: 'before-5am', label: 'Before 5 AM' },
              { value: '5am-6am', label: '5-6 AM' },
              { value: '6am-7am', label: '6-7 AM' },
              { value: '7am-8am', label: '7-8 AM' },
              { value: 'after-8am', label: 'After 8 AM' },
            ],
          },
          {
            key: '{prefix}-sleep-time', type: 'select', label: 'Sleep Time',
            options: [
              { value: 'before-9pm', label: 'Before 9 PM' },
              { value: '9pm-10pm', label: '9-10 PM' },
              { value: '10pm-11pm', label: '10-11 PM' },
              { value: '11pm-12am', label: '11 PM-12 AM' },
              { value: 'after-12am', label: 'After 12 AM' },
            ],
          },
        ],
      },
      {
        type: 'grid', fields: [
          {
            key: '{prefix}-dinner', type: 'select', label: 'Dinner Time',
            options: [
              { value: 'before-7pm', label: 'Before 7 PM' },
              { value: '7pm-8pm', label: '7-8 PM' },
              { value: '8pm-9pm', label: '8-9 PM' },
              { value: '9pm-10pm', label: '9-10 PM' },
              { value: 'after-10pm', label: 'After 10 PM' },
            ],
          },
          {
            key: '{prefix}-water-habit', type: 'select', label: 'Water Before Bed',
            options: [
              { value: 'none', label: 'None' },
              { value: 'sips', label: 'Few sips' },
              { value: 'one-glass', label: 'One glass' },
              { value: 'two-plus', label: 'Two+ glasses' },
            ],
          },
        ],
      },
      {
        key: '{prefix}-path-access', type: 'select', label: 'Bathroom Path Access',
        options: [
          { value: 'direct', label: 'Direct from bedroom' },
          { value: 'hallway', label: 'Through hallway' },
          { value: 'stairs', label: 'Includes stairs' },
          { value: 'difficult', label: 'Difficult access' },
        ],
      },
      {
        key: '{prefix}-sleep-notes', type: 'textarea', label: 'Sleep Habits / Notes',
        placeholder: 'e.g., Light sleeper, wakes frequently, uses walking aid...', minHeight: '56px',
      },
    ],
  },

  // ─── Section 6: Washroom Configuration ───
  6: {
    title: 'Washroom Configuration',
    badge: 'Type · Layout',
    hint: "Select the bathroom type that best describes this space's layout.",
    fields: [
      {
        key: '6-config-type', type: 'select', label: 'Configuration Type', required: true,
        options: [
          { value: 'powder-room', label: 'Powder Room (Half Bath)' },
          { value: 'full-bath', label: 'Full Bath' },
          { value: 'three-quarter', label: 'Three-Quarter Bath' },
          { value: 'en-suite', label: 'En Suite Bathroom' },
          { value: 'jack-jill', label: 'Jack-and-Jill Bathroom' },
          { value: 'wet-room', label: 'Wet Room' },
          { value: 'family', label: 'Family Bathroom' },
          { value: 'split', label: 'Split Bathroom' },
          { value: 'master', label: 'Master Bathroom' },
          { value: 'compact', label: 'Compact / Corner Bathroom' },
          { value: 'laundry-combo', label: 'Laundry-Bathroom Combo' },
        ],
      },
    ],
  },

  // ─── Section 7: Electrical, Lighting & Heating ───
  7: {
    title: 'Electrical, Lighting & Heating',
    badge: 'Power · Geyser · Pipes',
    hint: 'Verify power sources, backup availability, geyser function, and pipe condition.',
    fields: [
      { type: 'subsection', label: 'Power & Lighting' },
      {
        key: '7-power-source', type: 'select', label: 'Power Supply Source', required: true,
        options: [
          { value: 'grid', label: 'Main Grid' },
          { value: 'grid-backup', label: 'Grid + Backup' },
          { value: 'solar', label: 'Solar' },
          { value: 'mixed', label: 'Mixed Sources' },
        ],
      },
      {
        key: '7-switchboard', type: 'select', label: 'Switchboard Location', required: true,
        options: [
          { value: 'inside-safe', label: 'Inside — Safe position' },
          { value: 'inside-risk', label: 'Inside — Near water' },
          { value: 'outside', label: 'Outside bathroom' },
        ],
      },
      {
        type: 'grid', fields: [
          {
            key: '7-light-points', type: 'text', label: 'No. of Light Points',
            placeholder: 'e.g., 2', inputType: 'number', min: 0,
          },
          {
            key: '7-ceiling-light', type: 'select', label: 'Ceiling Light Type',
            options: [
              { value: 'led', label: 'LED' },
              { value: 'cfl', label: 'CFL' },
              { value: 'tube', label: 'Tube Light' },
              { value: 'incandescent', label: 'Incandescent' },
              { value: 'none', label: 'None' },
            ],
          },
        ],
      },
      {
        type: 'grid', wrapStyle: { marginTop: 12 }, fields: [
          {
            key: '7-light-color', type: 'select', label: 'Light Color',
            options: [
              { value: 'warm-white', label: 'Warm White' },
              { value: 'cool-white', label: 'Cool White' },
              { value: 'daylight', label: 'Daylight' },
              { value: 'yellow', label: 'Yellow' },
            ],
          },
          {
            key: '7-light-lumen', type: 'select', label: 'Brightness',
            options: [
              { value: 'bright', label: 'Bright (>800 lm)' },
              { value: 'adequate', label: 'Adequate (400-800 lm)' },
              { value: 'dim', label: 'Dim (<400 lm)' },
            ],
          },
        ],
      },

      { type: 'subsection', label: 'Backup' },
      {
        type: 'grid', fields: [
          {
            key: '7-dg', type: 'radio', label: 'DG Backup', required: true,
            options: yesNo,
          },
          {
            key: '7-inv', type: 'radio', label: 'Inverter Backup', required: true,
            options: yesNo,
          },
        ],
      },

      { type: 'subsection', label: 'Heating & Pipes' },
      {
        key: '7-geyser', type: 'select', label: 'Geyser', required: true,
        options: [
          { value: 'electric-working', label: 'Electric — Working' },
          { value: 'electric-not-working', label: 'Electric — Not Working' },
          { value: 'solar', label: 'Solar' },
          { value: 'instant', label: 'Instant Heater' },
          { value: 'none', label: 'None' },
        ],
      },
      {
        type: 'grid', fields: [
          {
            key: '7-pipe-status', type: 'select', label: 'Pipe Status', required: true,
            options: [
              { value: 'good-insulated', label: 'Good — Insulated' },
              { value: 'good-exposed', label: 'Good — Exposed' },
              { value: 'leaking', label: 'Leaking' },
              { value: 'damaged', label: 'Damaged' },
              { value: 'rusted', label: 'Rusted' },
            ],
          },
          {
            key: '7-thermostat', type: 'select', label: 'Thermostat Status',
            options: [
              { value: 'available-working', label: 'Available & Working' },
              { value: 'available-not-working', label: 'Not Working' },
              { value: 'not-available', label: 'Not Available' },
            ],
          },
        ],
      },
    ],
  },

  // ─── Section 8: Access & Exit ───
  8: {
    title: 'Access & Exit',
    badge: 'Door · Steps · Path',
    hint: 'Steps, floor transitions, and door type are critical for fall risk — especially for night-time bathroom visits.',
    fields: [
      {
        key: '8-step', type: 'select', label: 'Step on Floor (Threshold)', required: true,
        options: [
          { value: 'none', label: 'No Step — Level entry' },
          { value: 'small', label: 'Small Step (<2 inches)' },
          { value: 'medium', label: 'Medium Step (2-4 inches)' },
          { value: 'large', label: 'Large Step (>4 inches)' },
        ],
      },
      {
        type: 'grid', fields: [
          {
            key: '8-level-variation', type: 'select', label: 'Level Variation', required: true,
            options: [
              { value: 'none', label: 'None — Level floor' },
              { value: 'slight', label: 'Slight variation' },
              { value: 'significant', label: 'Significant' },
              { value: 'tripping-hazard', label: 'Tripping hazard' },
            ],
          },
          {
            key: '8-floor-variation', type: 'select', label: 'Floor Variation Inside', required: true,
            options: [
              { value: 'level', label: 'Level throughout' },
              { value: 'slight-slope', label: 'Slight slope (drainage)' },
              { value: 'uneven', label: 'Uneven' },
              { value: 'hazardous', label: 'Hazardous' },
            ],
          },
        ],
      },
      {
        key: '8-outside-lighting', type: 'select', label: 'Lighting Outside Bathroom Door',
        wrapStyle: { marginTop: 12 }, required: true,
        options: [
          { value: 'bright', label: 'Bright' },
          { value: 'adequate', label: 'Adequate' },
          { value: 'dim', label: 'Dim' },
          { value: 'none', label: 'None / Dark' },
          { value: 'motion-sensor', label: 'Motion Sensor Light' },
        ],
      },
      {
        type: 'grid', fields: [
          {
            key: '8-door-type', type: 'select', label: 'Door Type', required: true,
            options: [
              { value: 'hinged-outward', label: 'Hinged — Opens Outward' },
              { value: 'hinged-inward', label: 'Hinged — Opens Inward' },
              { value: 'sliding', label: 'Sliding' },
              { value: 'folding', label: 'Folding' },
            ],
          },
          {
            key: '8-door-width', type: 'select', label: 'Door Width', required: true,
            options: [
              { value: 'wide', label: 'Wide (>32 inches)' },
              { value: 'standard', label: 'Standard (30-32 in)' },
              { value: 'narrow', label: 'Narrow (<30 inches)' },
            ],
          },
        ],
      },
    ],
  },
};

/** Extract all required field keys for a section */
export function getRequiredFields(sectionNum) {
  const section = sectionSchema[sectionNum];
  if (!section) return [];
  const required = [];

  function extractFromFields(fields) {
    for (const field of fields) {
      if (field.required && field.key) required.push(field.key);
      if (field.fields) extractFromFields(field.fields);
      if (field.type === 'accessory' && field.required) {
        required.push(`${field.prefix}-avail`);
      }
    }
  }

  if (section.fields) extractFromFields(section.fields);
  return required;
}

/** Extract all field keys for a section (for completion tracking) */
export function getAllFieldKeys(sectionNum) {
  const section = sectionSchema[sectionNum];
  if (!section) return [];
  const keys = [];

  function extractFromFields(fields) {
    for (const field of fields) {
      if (field.key) keys.push(field.key);
      if (field.fields) extractFromFields(field.fields);
      if (field.type === 'accessory') {
        keys.push(`${field.prefix}-avail`);
        keys.push(`${field.prefix}-cond`);
      }
      if (field.type === 'avail-condition') {
        keys.push(field.availKey);
        keys.push(field.condKey);
      }
    }
  }

  if (section.fields) extractFromFields(section.fields);
  // Add comments key
  keys.push(`${sectionNum}-comments`);
  return keys;
}

/** Get section comment placeholder */
export const commentPlaceholders = {
  1: 'Note observations, defects, or recommendations for this section...',
  2: 'Missing items, urgent replacements, or general observations...',
  3: 'Leaks, pressure issues, repair recommendations...',
  4: 'Describe sharp edges, immediate risks, or drain issues that need urgent attention...',
  5: 'Overall notes on user needs, mobility concerns, special requirements...',
  6: 'Layout concerns, space constraints, or special features...',
  7: 'Electrical safety concerns, heating issues, pipe conditions...',
  8: 'Tripping hazards, poor lighting on path, door concerns...',
};
