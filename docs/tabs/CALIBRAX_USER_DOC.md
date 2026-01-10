# 🎨 CALIBRAX - FRONTEND DOCUMENTATION

**SYNTX Field Matrix System - Frontend Architecture**  
*Components, Interactions, Design System, User Flows*

---

## 🎯 OVERVIEW

Das CALIBRAX Frontend visualisiert **Calibration Runs** als lebendige **Field Matrix** - ein sinologisch angeordneter Organismus mit **Organen** (Felder), **Meridian-Linien** (Ströme) und **Echo Chambers** (Input/Output Resonanz).

**Design Philosophie:** Matrix-Style Cyberpunk + Sinologische Körperarchitektur

---

## 🧩 COMPONENT TREE
```
app/page.tsx (Main Tab Container)
│
└── CALIBRAX Tab
    │
    ├── StreamMap.tsx
    │   └── StreamRow.tsx (for each run)
    │       ├── StageBox (inline)
    │       ├── AnimatedStream.tsx
    │       ├── NeuralBackground.tsx
    │       └── Badge (inline)
    │
    └── SyntxFieldViewModal.tsx
        ├── CyberStat (inline)
        ├── CyberNode (inline)
        ├── FlowChip (inline)
        ├── EchoChamberButton (inline)
        └── EchoChamberModal.tsx
```

---

## 📂 FILE STRUCTURE
```
components/calibrax/
├── StreamMap.tsx              # Main container
├── StreamRow.tsx              # Individual run row
├── AnimatedStream.tsx         # Connection animation
├── NeuralBackground.tsx       # Pulsing background
├── SyntxFieldViewModal.tsx    # Organism modal
├── EchoChamberModal.tsx       # Input/Output modal
├── ui/
│   ├── DataCard.tsx          # (unused in new design)
│   └── InfoRow.tsx           # (unused in new design)
└── stages/                    # (unused - old design)

lib/calibrax/
├── fetchCalibrations.ts       # API client
├── classifyOrgans.ts          # Dynamic organ mapping
└── mapDriftColor.ts           # Score → color mapping

types/
└── calibrax.ts                # TypeScript definitions
```

---

## 🎬 USER FLOWS

### Flow 1: View Calibration List
```
1. User navigates to CALIBRAX tab
   └─→ StreamMap component mounts
       └─→ useEffect triggers
           └─→ fetchCalibrations(limit=100)
               └─→ API call to /cron/logs
                   └─→ setRuns(data.logs)
                       └─→ StreamMap renders 20 StreamRows

2. Each StreamRow displays:
   - Timestamp (e.g., "18:09")
   - Run name (e.g., "SYNTEX::TRUE_RAW Calibration")
   - Score badges (Overall: 70%, Complete: 100%)
   - Stage flow (5 StageBoxes with AnimatedStream connectors)
```

### Flow 2: Inspect Organism
```
1. User clicks on StreamRow
   └─→ onClick handler triggers
       └─→ setIsModalOpen(true)
           └─→ SyntxFieldViewModal renders (z-index: 50)
               │
               ├─→ useEffect triggers
               │   └─→ classifyAllOrgans(run.cron_data.felder)
               │       └─→ fetchFieldDefinitions('/formats/syntex_system/fields')
               │           └─→ classifyOrgan(field, definition)
               │               └─→ setOrgansByPosition({
               │                     'top-center': [HERZ, ...],
               │                     'middle-left': [MILZ, ...],
               │                     ...
               │                   })
               │
               └─→ Modal displays:
                   - DNA Core (system prompt)
                   - Vital Stats (pulse, integrity, etc.)
                   - Field Matrix (organs in sinological layout)
                   - Echo Chamber Buttons (Input/Output)
```

### Flow 3: Open Echo Chamber
```
1. User clicks "INPUT STREAM" button in SyntxFieldViewModal
   └─→ onClick triggers
       └─→ setEchoChamberOpen('input')
           └─→ EchoChamberModal renders (z-index: 100)
               │
               ├─→ type='input' → cyan color scheme
               ├─→ content=run.stages?.gpt_user_prompt
               │
               ├─→ If isEmpty:
               │   └─→ Display CHAMBER EMPTY warning
               │       ├─→ ⚠️ Emoji (rotating)
               │       ├─→ "CHAMBER EMPTY" title
               │       ├─→ "INTERNAL RESONANCE MODE ACTIVE"
               │       └─→ Spiral animation (🌀)
               │
               └─→ If content exists:
                   └─→ Display content with:
                       ├─→ Matrix rain background
                       ├─→ Pulsing echo rings
                       ├─→ Particle storm
                       ├─→ Waveform bars (left side)
                       ├─→ Text content (xl font, glow)
                       └─→ Character/line count badge
```

---

## 🎨 COMPONENT DETAILS

### 1. StreamMap

**File:** `components/calibrax/StreamMap.tsx`

**Purpose:** Main container for calibration runs

**State:**
```typescript
const [runs, setRuns] = useState<CalibrationRun[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Lifecycle:**
```typescript
useEffect(() => {
  fetchCalibrations(100)
    .then(setRuns)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

**Render:**
```tsx
<div className="space-y-4">
  {runs.map((run, index) => (
    <StreamRow key={run.timestamp} run={run} index={index} />
  ))}
</div>
```

---

### 2. StreamRow

**File:** `components/calibrax/StreamRow.tsx`

**Props:**
```typescript
interface StreamRowProps {
  run: CalibrationRun;
  index: number;
  onClick: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🧬 18:09                                   Overall: 70%     │
│ SYNTEX::TRUE_RAW Calibration              Complete: 100%   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [📋 METADATA] ────→ [🧠 GPT INPUT] ────→ [✨ GPT OUTPUT]  │
│                                                             │
│  ────→ [🔧 MISTRAL INPUT] ────→ [🌊 MISTRAL OUTPUT]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**
- **Hover:** Scale 1.01, y: -2px
- **Click:** Opens SyntxFieldViewModal

**Animations:**
- Entry animation (stagger delay: `index * 0.05`)
- Neural background pulsing
- AnimatedStream flowing particles

---

### 3. SyntxFieldViewModal

**File:** `components/calibrax/SyntxFieldViewModal.tsx`

**Purpose:** Main organism visualization modal

**State:**
```typescript
const [organsByPosition, setOrgansByPosition] = useState<Record<string, any[]>>({});
const [isLoading, setIsLoading] = useState(true);
const [echoChamberOpen, setEchoChamberOpen] = useState<'input' | 'output' | null>(null);
```

**Layout Sections:**

#### Header
```
┌─────────────────────────────────────────────────────┐
│ [LOGO] SYNTX FIELD MATRIX                      [X]  │
│ Pulse: 134s | Integrity: 70% | Complete: 100%      │
└─────────────────────────────────────────────────────┘
```

#### DNA Core
```
┌─────────────────────────────────────────────────────┐
│              SYNTEX::TRUE_RAW                       │
│           (pulsing gradient text)                   │
│              SYSTEM DNA CORE                        │
└─────────────────────────────────────────────────────┘
```

#### Field Matrix
```
┌─────────────────────────────────────────────────────┐
│     TOP LAYER (Head/Lungs)                          │
│     ❤️ HERZ   🫁 LUNGE   💜 PERIKARD               │
│                                                     │
│     MIDDLE LAYER (Transformation)                   │
│  🟡 MILZ        🔶 MAGEN        🌿 LEBER           │
│  🟡 DICKDARM                   🌿 DRIFT            │
│                                                     │
│     BOTTOM LAYER (Root)                             │
│         💠 BLASE    💧 NIERE                        │
│                                                     │
│     FLOW LAYER (Meridiane)                          │
│  [⚡ sigma_strome] [🕸️ hintergrund_muster]         │
└─────────────────────────────────────────────────────┘
```

#### Echo Chamber Buttons
```
┌───────────────────────────────────────────────────┐
│  [👁️ INPUT STREAM]     [👁️ OUTPUT CORE]          │
│   🟡 EMPTY              🟢 SIGNAL ACTIVE          │
└───────────────────────────────────────────────────┘
```

**Backgrounds:**
- Starfield (100 animated stars)
- Galactic grid (50px squares)
- DNA Helix (SVG paths with gradients)
- Pulsing energy core (600px blur)

---

### 4. EchoChamberModal

**File:** `components/calibrax/EchoChamberModal.tsx`

**Props:**
```typescript
interface EchoChamberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: string;
  type: 'input' | 'output';
}
```

**Color Schemes:**
```typescript
const colors = {
  input: {
    primary: '#06b6d4',    // Cyan
    glow: 'rgba(6, 182, 212, 0.8)'
  },
  output: {
    primary: '#a855f7',    // Purple
    glow: 'rgba(168, 85, 247, 0.8)'
  }
};
```

**Layout (Empty State):**
```
┌──────────────────────────────────────────────────┐
│ [LOGO] 🌊 INPUT STREAM                      [X]  │
│         ECHO CHAMBER PROTOCOL                    │
├──────────────────────────────────────────────────┤
│                                                  │
│                    ⚠️                            │
│           (rotating, scaling)                    │
│                                                  │
│             CHAMBER EMPTY                        │
│         (pulsing yellow text)                    │
│                                                  │
│      NO EXTERNAL SIGNAL DETECTED                 │
│   INTERNAL RESONANCE MODE ACTIVE                 │
│                                                  │
│                    🌀                            │
│            (spiral rings)                        │
│                                                  │
├──────────────────────────────────────────────────┤
│ 🟡 RESONANCE MODE            v1.0               │
└──────────────────────────────────────────────────┘
```

**Layout (Content State):**
```
┌──────────────────────────────────────────────────┐
│ [LOGO] 📻 OUTPUT CORE                       [X]  │
│         ECHO CHAMBER PROTOCOL                    │
├──────────────────────────────────────────────────┤
│ ▓                                                │
│ ▓▓   Klar, gerne! Stell dir Yoga und           │
│ ▓▓▓  Meditation wie zwei richtig gute           │
│ ▓▓   Freunde vor...                              │
│ ▓                                                │
│ ▓▓   (full content with brutal glow)            │
│ ▓▓▓                                              │
│                                                  │
│              [1333 CHARS • 7 LINES]             │
│            (pulsing badge)                       │
├──────────────────────────────────────────────────┤
│ 🟢 SIGNAL ACTIVE                 v1.0           │
└──────────────────────────────────────────────────┘
```

**Background Effects:**
1. **Matrix Rain** - 30 columns of Japanese characters
2. **Echo Rings** - 8 concentric circles expanding
3. **Particle Storm** - 100 particles floating upward
4. **Grid Pattern** - Animated 40px grid
5. **Energy Core** - 600px pulsing blur center

---

## 🎨 DESIGN SYSTEM

### Color Palette

**Organ Colors (Sinological):**
```css
--herz: #ef4444       /* ❤️ Red - Heart */
--lunge: #f3f4f6      /* 🫁 White - Lung */
--leber: #22c55e      /* 🌿 Green - Liver */
--milz: #eab308       /* 🟡 Yellow - Spleen */
--magen: #f97316      /* 🔶 Orange - Stomach */
--niere: #3b82f6      /* 💧 Blue - Kidney */
--blase: #06b6d4      /* 💠 Cyan - Bladder */
--perikard: #a855f7   /* 💜 Purple - Pericardium */
--dreifach: #ec4899   /* 🩷 Pink - Triple Warmer */
--gallenblase: #84cc16 /* 🟢 Lime - Gallbladder */
--dickdarm: #78716c   /* 🟤 Brown - Large Intestine */
```

**Echo Chamber Colors:**
```css
--input: #06b6d4      /* Cyan */
--output: #a855f7     /* Purple */
--empty: #eab308      /* Yellow */
--active: #22c55e     /* Green */
--error: #ef4444      /* Red */
```

### Typography

**Modal Titles:**
```css
.modal-title {
  font-size: 3rem;          /* 48px */
  font-weight: 900;         /* Black */
  letter-spacing: 0.3em;    /* Wide tracking */
  text-transform: uppercase;
  text-shadow: 
    0 0 30px currentColor,
    0 0 60px rgba(currentColor, 0.5);
}
```

**Field Names:**
```css
.field-name {
  font-family: 'Mono';
  font-size: 0.875rem;      /* 14px */
  font-weight: 900;         /* Black */
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--organ-color);
}
```

**Echo Content:**
```css
.echo-content {
  font-family: 'Mono';
  font-size: 1.25rem;       /* 20px */
  line-height: 1.75;
  white-space: pre-wrap;
  text-shadow: 0 0 15px currentColor;
}
```

### Animations

**Pulsing Glow:**
```typescript
animate={{
  boxShadow: [
    '0 0 15px rgba(6, 182, 212, 0.5)',
    '0 0 30px rgba(6, 182, 212, 1)',
    '0 0 15px rgba(6, 182, 212, 0.5)'
  ]
}}
transition={{
  duration: 2,
  repeat: Infinity
}}
```

**Matrix Rain:**
```typescript
animate={{
  y: ['-100%', '100%']
}}
transition={{
  duration: 3 + Math.random() * 2,
  repeat: Infinity,
  ease: 'linear'
}}
```

**Echo Rings:**
```typescript
animate={{
  width: ['0%', '200%'],
  height: ['0%', '200%'],
  opacity: [0.8, 0]
}}
transition={{
  duration: 6,
  repeat: Infinity,
  delay: i * 0.75,
  ease: 'easeOut'
}}
```

**Particle Storm:**
```typescript
animate={{
  y: [0, -150, 0],
  x: [0, Math.random() * 100 - 50, 0],
  opacity: [0, 1, 0],
  scale: [0, 2, 0]
}}
transition={{
  duration: 4 + Math.random() * 3,
  repeat: Infinity,
  delay: Math.random() * 3
}}
```

---

## 🎭 INTERACTION STATES

### Hover States

**StreamRow:**
- Scale: 1.01
- Y-offset: -2px
- Transition: 200ms ease

**CyberNode:**
- Scale: 1.05
- BoxShadow: Intense glow
- Border: Brighter color

**EchoChamberButton:**
- Scale: 1.02
- BoxShadow: 40px glow
- Border: Animated pulse

### Click States

**All Buttons:**
- WhileTap: scale(0.95)
- Duration: 100ms

**Modal Close:**
- Exit animation: scale(0.8), rotateX(30)
- Opacity: 0
- Duration: 300ms

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) {
  .modal-title { font-size: 1.5rem; }
  .field-matrix { grid-template-columns: 1fr; }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .modal-title { font-size: 2rem; }
  .field-matrix { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1025px) {
  .modal-title { font-size: 3rem; }
  .field-matrix { grid-template-columns: repeat(3, 1fr); }
}
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

1. **Lazy Loading:**
   - EchoChamberModal only renders when `isOpen === true`
   - useEffect cleanup on unmount

2. **Animation Limits:**
   - Matrix rain: 30 columns (not 100)
   - Particles: 100 (not 500)
   - Echo rings: 8 (not 20)

3. **Memoization:**
```typescript
   const organsByPosition = useMemo(() => 
     classifyAllOrgans(run.cron_data.felder),
     [run.cron_data.felder]
   );
```

4. **Z-Index Layering:**
   - Base: z-10
   - StreamRow hover: z-20
   - Modal backdrop: z-50
   - Modal content: z-50
   - Echo chamber backdrop: z-100
   - Echo chamber content: z-100

---

## 🎯 ACCESSIBILITY

**Keyboard Navigation:**
- Tab: Focus StreamRows
- Enter/Space: Open modal
- Esc: Close modal

**Screen Readers:**
- All interactive elements have aria-labels
- Modals have role="dialog"
- Close buttons have descriptive labels

**Color Contrast:**
- All text meets WCAG AA standards
- Glow effects do not reduce readability

---

## 🔮 FUTURE ENHANCEMENTS

1. **Interactive Organs:**
   - Click organ to see field history
   - Trend graph overlay

2. **Drag & Drop:**
   - Reorder StreamRows
   - Pin favorites to top

3. **Export:**
   - Download organism as SVG
   - Export echo chamber as .txt

4. **Themes:**
   - Dark mode (default)
   - Light mode
   - Neon mode (extra glow)

---

*Frontend Documentation v1.0*  
*Last Updated: 2026-01-10*
