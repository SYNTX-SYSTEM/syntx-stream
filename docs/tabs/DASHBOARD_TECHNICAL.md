# 🌌 DASHBOARD TAB - TECHNICAL DOCUMENTATION

**SYNTX SYSTEM v2.1 - Galaxy Flow Visualization**

---

## 🎯 OVERVIEW

Der Dashboard Tab ist der **Haupt-Monitoring-Screen** für das SYNTX System. Er zeigt **Echtzeit-Daten** aus 4 API-Endpunkten und visualisiert sie als **lebenden Organismus** mit Neuronalen Netzen, Digital Streams und Galaxy Flow.

**File:** `components/syntx/tabs/DashboardTab.tsx`

---

## 🔌 API INTEGRATION

### Endpoints Called
```typescript
const API_BASE = 'https://dev.syntx-system.com/api/strom';

// 4 parallel fetches on mount + every 30 seconds
Promise.all([
  fetch(`${API_BASE}/analytics/complete-dashboard`),  // System health
  fetch(`${API_BASE}/monitoring/live-queue`),         // Queue + recent jobs
  fetch(`${API_BASE}/analytics/topics`),              // Topic statistics
  fetch(`${API_BASE}/compare/wrappers`),              // Wrapper comparison
]);
```

### Data Structure
```typescript
interface DashboardData {
  system_health: {
    total_prompts: number;
    avg_score: number;
    perfect_scores: number;
    success_rate: number;
  };
  queue: {
    incoming: number;
    processing: number;
    processed: number;
    errors: number;
  };
  topics: Record<string, {
    count: number;
    avg_score: number;
  }>;
  wrappers: Record<string, {
    total_jobs: number;
    avg_score: number;
    success_rate: number;
  }>;
  wrapper_signatures: Record<string, {
    colors: string[];
    pattern: string;
    avg_score: number;
  }>;
  recent_completed: Array<{
    job_id: string;
    filename: string;
    wrapper: string;
    score: number;
    duration_ms: number;
    completed_at?: string;
    topic?: string;
    rating?: string;
  }>;
}
```

---

## 🎨 COMPONENT ARCHITECTURE

### Main Structure
```
DashboardTab
├── LoadingOrganism (initial load)
├── ErrorField (on error)
└── Main View
    ├── NeuronalField (background grid + particles)
    ├── HeaderCore
    │   ├── Logo (pulsing)
    │   └── HealthNodes (3x)
    ├── PulseWave (on data refresh)
    ├── QueueOrganism (4 cores)
    ├── TopicsField (dynamic nodes)
    ├── WrapperField (signature cards)
    └── GalaxyStream
        ├── NeuronalNetworkBackground
        │   ├── Digital Streams (20x)
        │   ├── Neuronal Network (50 neurons)
        │   └── Hexagonal Grid
        └── CelestialBody (per recent job)
            ├── Orbital Rings (for planets)
            ├── Star Rays (for stars)
            ├── Score Display
            ├── Tooltip (on hover)
            └── Trailing Particles
```

---

## 🌈 SYNTX CHROMATIK (Color System)
```typescript
const SYNTX_CHROMATIK = {
  FIELD_CORE: '#06b6d4',    // Neonblau - Primary field color
  DRIFT_ZONE: '#a855f7',    // Lila - Drift/uncertainty
  NORMAL_AREA: '#ef4444',   // Signalrot - Errors/low scores
  NEURON_PATH: '#22c55e',   // Türkisgrün - Success/high scores
  OUTPUT_CORE: '#ec4899',   // Weißlila - Output/results
  WARNING: '#eab308',       // Gelb - Processing/medium scores
};
```

### Score-Based Color Mapping
```typescript
const getScoreColor = (score: number) => {
  if (score > 70) return SYNTX_CHROMATIK.NEURON_PATH;  // Green - High performer
  if (score > 40) return SYNTX_CHROMATIK.WARNING;      // Yellow - Medium
  return SYNTX_CHROMATIK.NORMAL_AREA;                  // Red - Low
};
```

---

## 🔮 WRAPPER SIGNATURES (Dynamic Generation)

Wrapper Signatures werden **dynamisch** aus den Wrapper-Daten generiert:
```typescript
// Pattern detection based on wrapper name
let pattern = 'DEFAULT';
if (name.includes('syntex') || name.includes('system')) 
  pattern = 'PULSING_DEPTH';
else if (name.includes('sigma')) 
  pattern = 'HEARTBEAT';
else if (name.includes('deep')) 
  pattern = 'WATER_LINES';
else if (name.includes('human')) 
  pattern = 'FLOW';

// Color based on avg_score
const baseColor = getScoreColor(avg_score);

wrapper_signatures[name] = {
  colors: [baseColor, SYNTX_CHROMATIK.DRIFT_ZONE],
  pattern,
  avg_score
};
```

### Animation Patterns

- **PULSING_DEPTH**: Scale + blur pulsing (2s cycle)
- **HEARTBEAT**: Fast pulse (1s cycle)
- **WATER_LINES**: Oscillating like water (2s cycle)
- **FLOW**: Smooth gradient flow (2s cycle)
- **DEFAULT**: Standard pulse (2s cycle)

---

## 🌌 GALAXY FLOW VISUALIZATION

### Concept

Recent completed jobs werden als **Sterne** oder **Planeten** visualisiert, die in einem **horizontalen Strom** von links nach rechts fließen.

### Star vs. Planet Logic
```typescript
const isStar = item.score > 60;

// Size: 20-80px based on score
const size = 20 + (item.score / 100) * 60;
```

**Stars (score > 60%):**
- ⭐ Icon
- Radial gradient with score color
- 8 animated rays
- Stronger glow effect
- Labeled "HIGH PERFORMER"

**Planets (score ≤ 60%):**
- 🪐 Icon
- Wrapper-based gradient
- Orbital rings (rotating)
- Softer glow
- Labeled "STANDARD"

### Positioning
```typescript
// Horizontal positioning (5% to 95% across screen)
const xPos = (i / (items.length - 1)) * 90 + 5;

// Vertical variation (sine wave)
const yVariation = Math.sin(i * 0.8) * 80;
```

### Tooltip Features

**Hover to show:**
- 📄 Filename (copyable)
- 📋 COPY button (clipboard.writeText)
- Click-to-select text
- Wrapper, Score, Time, Topic
- Type classification

---

## 🧠 NEURONAL NETWORK BACKGROUND

### Components

**1. Digital Streams (20 vertical lines)**
```typescript
{[...Array(20)].map((_, i) => (
  <motion.div
    style={{
      width: '2px',
      background: `linear-gradient(180deg, transparent, ${color}80, transparent)`,
      boxShadow: `0 0 10px ${color}`,
    }}
    animate={{
      opacity: [0.4, 0.9, 0.4],
      scaleY: [0.7, 1, 0.7],
    }}
  >
    {/* Binary numbers flowing down */}
  </motion.div>
))}
```

**2. Neuronal Network (50 neurons)**
```typescript
const neurons = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

const connections = neurons.flatMap((neuron, i) => 
  neurons.slice(i + 1, i + 4)  // Connect to 3 neighbors
    .filter(conn => conn.distance < 25)  // Only if close enough
);
```

**3. Hexagonal Grid**
```typescript
<pattern id="hexagons-galaxy">
  <polygon points="30,0 45,13 45,39 30,52 15,39 15,13" />
</pattern>
```

---

## ⚡ ANIMATIONS & EFFECTS

### Framer Motion Usage

**Entry Animations:**
```typescript
initial={{ opacity: 0, scale: 0 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: index * 0.15, duration: 0.8 }}
```

**Continuous Animations:**
```typescript
animate={{
  scale: [1, 1.1, 1],
  boxShadow: [
    `0 0 30px ${color}`,
    `0 0 50px ${color}`,
    `0 0 30px ${color}`
  ]
}}
transition={{ duration: 2, repeat: Infinity }}
```

**Hover Effects:**
```typescript
whileHover={{ scale: 1.3, zIndex: 100 }}
```

### Pulse Wave

Triggered on successful data fetch (every 30s):
```typescript
setPulseWave(true);
setTimeout(() => setPulseWave(false), 2000);
```

---

## 🔄 DATA REFRESH CYCLE
```typescript
useEffect(() => {
  const fetchDashboard = async () => {
    // Fetch 4 endpoints
    // Map data
    // Set state
    setPulseWave(true);
  };

  fetchDashboard();  // Initial
  const interval = setInterval(fetchDashboard, 30000);  // Every 30s
  return () => clearInterval(interval);
}, []);
```

---

## 🎭 STATE MANAGEMENT
```typescript
const [data, setData] = useState<DashboardData | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [pulseWave, setPulseWave] = useState(false);

// Per CelestialBody
const [showTooltip, setShowTooltip] = useState(false);
```

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### Applied

- ✅ Slice `recent_completed` to max 10 items
- ✅ Filter undefined items before rendering
- ✅ GPU-accelerated properties (transform, opacity)
- ✅ AnimatePresence for smooth tooltip transitions
- ✅ Conditional rendering (only if data exists)

### Future Enhancements

- ⏳ useMemo for expensive calculations
- ⏳ useCallback for event handlers
- ⏳ Virtual scrolling if item count grows
- ⏳ WebSocket for true real-time updates (replace 30s polling)

---

## 🐛 ERROR HANDLING
```typescript
try {
  // Fetch data
} catch (err: any) {
  console.error('❌ Dashboard fetch error:', err);
  setError(err.message || 'Failed to fetch dashboard data');
} finally {
  setLoading(false);
}
```

**Error States:**
- `LoadingOrganism`: Pulsing rings + rotating logo
- `ErrorField`: ⚠️ icon + "FELD BRUCH" message

---

## 📊 COMPONENT BREAKDOWN

### LoadingOrganism
- 4 expanding rings
- Rotating SYNTX logo (360° in 4s)
- Pulsing opacity

### HeaderCore
- Pulsing logo with glow
- 3 HealthNodes: PROMPTS, AVG SCORE, SUCCESS

### QueueOrganism
- 4 QueueCores with different colors
- 3 expanding rings per core
- PROCESSING core has extra pulse

### TopicsField
- Dynamic nodes from API
- Color based on avg_score
- Pulsing box-shadow
- Hover scale + lift

### WrapperField
- Grid of wrapper signature cards
- Gradient background (wrapper colors)
- Pattern-based animation speed
- Dot indicator (top-right)

### GalaxyStream
- Horizontal flow visualization
- Stars & Planets based on score
- Sine wave vertical positioning
- Trailing particles
- Hover tooltip with all details

---

## 📁 FILE STRUCTURE
```
components/syntx/tabs/
└── DashboardTab.tsx (1318 lines)
    ├── Types & Interfaces (40 lines)
    ├── Main Component (200 lines)
    ├── Loading & Error (100 lines)
    ├── Header & Queue (200 lines)
    ├── Topics & Wrappers (150 lines)
    └── Galaxy Stream (628 lines)
        ├── GalaxyStream
        ├── NeuronalNetworkBackground
        └── CelestialBody
```

---

## 🔑 KEY TECHNICAL DECISIONS

### Why Galaxy Flow?
- Matches SYNTX philosophy: "living organism, not UI"
- Each job = celestial body with own signature
- Position in stream = temporal/spatial relationship
- Rotation = continuous flow

### Why Horizontal Layout?
- Natural reading direction (left to right)
- Clear temporal progression
- Better use of screen width
- Avoids grid rigidity

### Why Neuronal Network Background?
- Matches SYNTX login aesthetic
- Creates depth and movement
- Binary streams = data flow metaphor
- Neurons = system thinking

### Why Dynamic Wrapper Signatures?
- No hardcoding = flexible
- Color reflects performance
- Pattern reflects wrapper type
- Instant visual identification

---

## 🛠️ DEVELOPMENT NOTES

### Dependencies
```json
{
  "framer-motion": "^11.x",
  "next": "16.0.10",
  "react": "^19.x"
}
```

### Build Time
- ~9.7s (TypeScript compilation)
- ~10s total build

### Browser Compatibility
- Modern browsers only (ES2020+)
- CSS Grid, Flexbox
- SVG animations
- Clipboard API

---

## 🎯 FUTURE ROADMAP

### Planned Features
- [ ] Click to filter by wrapper
- [ ] Click to filter by topic
- [ ] Expandable galaxy details
- [ ] Export current view as image
- [ ] Custom time range selector
- [ ] Real-time WebSocket updates
- [ ] Galaxy zoom/pan controls
- [ ] Dark/Light theme toggle

### Known Limitations
- 30s refresh (not true real-time)
- Max 10 recent items displayed
- No historical data visualization
- No drill-down functionality

---

**LAST UPDATED:** 2026-01-10  
**VERSION:** 2.1.0  
**STATUS:** ✅ PRODUCTION READY
