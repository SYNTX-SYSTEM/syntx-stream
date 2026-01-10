# 🧬 KRONTUN TAB - TECHNICAL DOCUMENTATION

**SYNTX AI Calibration Monitoring System**  
**Version:** 1.0.0  
**Status:** PRODUCTION READY  
**Style:** Charlottenburg Neuromancer DNA Helix  

---

## 🎯 SYSTEM OVERVIEW

KRONTUN ist ein **Echtzeit-Monitoring-System** für AI-Kalibrierungsläufe. Es visualisiert, wie gut AI-Modelle (GPT, Mistral, Claude) semantische SYNTX-Felder aus Texten extrahieren können – und ob sie **driften**.

**Core Konzept:**  
Jede AI wird regelmäßig getestet, ob sie noch "bei Verstand" ist – ob sie semantische Konzepte wie "Driftkörper", "Kalibrierung" oder "Strömung" korrekt identifizieren kann. KRONTUN zeigt diese Tests als **DNA-Helix-Zeitstrom** an.

---

## 🔌 BACKEND API

### **Base URL**
```
https://dev.syntx-system.com/api/strom/kalibrierung/cron
```

### **Endpoints**

#### 1. GET `/stats` - Queue Statistics
**Purpose:** Aktuelle Statistiken über Calibration Runs

**Request:**
```bash
curl https://dev.syntx-system.com/api/strom/kalibrierung/cron/stats
```

**Response:**
```json
{
  "erfolg": true,
  "active": 0,
  "pending": 0,
  "completed": 1642,
  "failed": 7,
  "total": 1649
}
```

**Data Structure:**
- `active`: Laufende Kalibrierungen
- `pending`: Wartende Jobs in Queue
- `completed`: Erfolgreich abgeschlossene Runs
- `failed`: Fehlgeschlagene Runs
- `total`: Gesamtzahl aller Runs

#### 2. GET `/logs?limit=N` - Calibration Logs
**Purpose:** Liste der letzten Calibration Runs mit Details

**Request:**
```bash
curl "https://dev.syntx-system.com/api/strom/kalibrierung/cron/logs?limit=100"
```

**Response:**
```json
{
  "erfolg": true,
  "count": 100,
  "total": 1326,
  "logs": [
    {
      "timestamp": "2026-01-10T11:21:16.737300Z",
      "cron_data": {
        "name": "SYNTEX::TRUE_RAW Calibration",
        "modell": "mistral-uncensored",
        "felder": {
          "sigma_drift": 1,
          "driftkorper": 1,
          "kalibrierung": 1,
          "stromung": 1,
          // ... 15 Felder total
        }
      },
      "stages": {
        "gpt_system_prompt": "...",
        "mistral_output": "...",
        "parsed_fields": {
          "driftkorper": "extracted text...",
          "kalibrierung": "extracted text...",
          "stromung": "extracted text...",
          "sigma_drift": null  // nicht extrahiert
        }
      },
      "scores": {
        "overall": 69,
        "field_completeness": 100,
        "structure_adherence": 65
      },
      "meta": {
        "duration_ms": 69873,
        "retry_count": 0,
        "success": true
      }
    }
  ]
}
```

**Data Structure:**

**`cron_data`:**
- `name`: Kalibrierungs-Test Name
- `modell`: AI Model (gpt-4o, mistral-uncensored, claude-sonnet)
- `felder`: Map von erwarteten SYNTX-Feldern (1 = erwartet)

**`stages`:**
- `gpt_system_prompt`: System Prompt für den Test
- `mistral_output`: Raw Output vom Model
- `parsed_fields`: Extrahierte Felder (null = nicht gefunden)

**`scores`:**
- `overall`: Gesamt-Score 0-100%
- `field_completeness`: Wie viele Felder wurden gefunden
- `structure_adherence`: Wie gut ist die Ausgabestruktur

**`meta`:**
- `duration_ms`: Test-Dauer in Millisekunden
- `retry_count`: Anzahl Wiederholungen
- `success`: true/false

---

## 🏗️ FRONTEND ARCHITECTURE

### **File Structure**
```
components/krontun/
├── KrunField.tsx              # Main view - DNA Helix Layout
├── KrunKnoten.tsx             # Einzelner Knoten (Calibration Run)
├── KrunFluss.tsx              # Neuronal Background Animation
├── FieldAnalysisModal.tsx     # Detail Modal - Resonance View
├── InsightModal.tsx           # Storytelling Modal
└── CalibrationCard.tsx        # (deprecated, replaced by Knoten)

lib/stores/
└── krontun-store.ts           # Zustand Store für State Management
```

### **State Management: krontun-store.ts**

**Store Interface:**
```typescript
interface KrontunStore {
  crons: CronLog[];              // Array of calibration runs
  selectedCron: CronLog | null;  // Currently selected run
  stats: QueueStats;             // Statistics (active, pending, etc)
  loading: boolean;              // Loading state
  
  selectCron: (cron: CronLog | null) => void;
  loadLogs: () => Promise<void>;
  loadStats: () => Promise<void>;
}
```

**Key Functions:**
```typescript
// Load logs from backend
const loadLogs = async () => {
  set({ loading: true });
  const response = await fetch(
    'https://dev.syntx-system.com/api/strom/kalibrierung/cron/logs?limit=100'
  );
  const data = await response.json();
  
  // Filter valid logs
  const validLogs = data.logs.filter(log => 
    log?.cron_data && 
    log?.scores && 
    log?.meta && 
    log?.timestamp
  );
  
  set({ crons: validLogs, loading: false });
};

// Load stats from backend
const loadStats = async () => {
  const response = await fetch(
    'https://dev.syntx-system.com/api/strom/kalibrierung/cron/stats'
  );
  const data = await response.json();
  set({ stats: data });
};
```

**Polling:**
```typescript
// In KrunField.tsx
useEffect(() => {
  loadStats();
  loadLogs();
  
  const interval = setInterval(() => {
    loadStats();
    loadLogs();
  }, 5000); // Poll every 5 seconds
  
  return () => clearInterval(interval);
}, []);
```

---

## 🎨 COMPONENT DETAILS

### **1. KrunField.tsx** - Main View

**Purpose:** DNA Helix Zeitstrom Layout

**Key Features:**
- DNA Helix positioning algorithm
- Stats cards (Active, Pending, Completed, Failed)
- SVG connection lines between Knoten
- CursorResonance + FieldBackground integration
- Neuronal background (KrunFluss)

**DNA Helix Algorithm:**
```typescript
const getDNAHelixPosition = (index: number, total: number) => {
  const width = window.innerWidth - 200;
  const centerY = 500;
  
  // Horizontal progression (Zeit)
  const x = 100 + (width / Math.min(total, 30)) * index;
  
  // Double helix pattern
  const amplitude = 150;
  const frequency = 0.4;
  const isUpperStrand = index % 2 === 0;
  const phase = isUpperStrand ? 0 : Math.PI;
  
  const y = centerY + amplitude * Math.sin(index * frequency + phase);
  
  return { x, y };
};
```

**Rendering:**
```typescript
// SVG Connection Lines
<svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
  {crons.slice(0, 30).map((cron, index) => {
    if (index === crons.length - 1) return null;
    
    const pos1 = getDNAHelixPosition(index, crons.length);
    const pos2 = getDNAHelixPosition(index + 1, crons.length);
    const score = cron.scores.overall;
    const lineColor = score >= 80 ? 'rgba(34,197,94,0.6)' : 
                     score >= 50 ? 'rgba(234,179,8,0.6)' : 
                     'rgba(239,68,68,0.6)';
    
    return (
      <motion.line
        x1={pos1.x + 35} y1={pos1.y + 35}
        x2={pos2.x + 35} y2={pos2.y + 35}
        stroke={lineColor}
        strokeWidth="2"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
      />
    );
  })}
</svg>

// Knoten
{crons.slice(0, 30).map((cron, index) => (
  <KrunKnoten
    log={cron}
    onClick={() => selectCron(cron)}
    index={index}
    position={getDNAHelixPosition(index, crons.length)}
  />
))}
```

### **2. KrunKnoten.tsx** - Neural Node

**Purpose:** Einzelner Calibration Run als pulsierender Knoten

**Dynamic Colors by Model:**
```typescript
const getColor = () => {
  if (model.includes('gpt')) return { 
    main: '#06b6d4', 
    rgb: 'rgba(6,182,212' 
  };
  if (model.includes('mistral')) return { 
    main: '#a855f7', 
    rgb: 'rgba(168,85,247' 
  };
  if (model.includes('claude')) return { 
    main: '#ec4899', 
    rgb: 'rgba(236,72,153' 
  };
  
  // Score override
  if (score < 50) return { main: '#ef4444', rgb: 'rgba(239,68,68' };
  if (score >= 80) return { main: '#22c55e', rgb: 'rgba(34,197,94' };
  
  return { main: '#00ffff', rgb: 'rgba(0,255,255' };
};
```

**Icon by Model:**
```typescript
const getModelIcon = () => {
  if (model.includes('gpt')) return Zap;
  if (model.includes('mistral')) return Brain;
  if (model.includes('claude')) return Activity;
  return Cpu;
};
```

**Animation Effects:**
- Synaptic pulses (8 particles orbiting)
- Mega glow (blur-2xl, 15-30% opacity)
- Rotating outer ring (dashed, 12s)
- Score ring (SVG circle with dashoffset)
- Pulsing core (boxShadow animation)
- Score badge (glowing, floating)

### **3. KrunFluss.tsx** - Background Layer

**Purpose:** Neuronal network background

**Features:**
- 200 neurons as connection points
- Connection lines between nearby neurons (<120px distance)
- 30 energy pulses flowing through network
- Scanlines (CRT effect)
- All on pure black background
```typescript
// Generate neurons
const newNeurons = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  x: Math.random() * window.innerWidth,
  y: 250 + Math.random() * 700
}));

// Connect nearby neurons
neurons.filter((other, j) => {
  if (i >= j) return false;
  const dx = neuron.x - other.x;
  const dy = neuron.y - other.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 120;
})
```

### **4. FieldAnalysisModal.tsx** - Resonance View

**Purpose:** Detail view für einzelnen Calibration Run

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Header: EKG Pulse + Gradient Title         │
├─────────────────────────────────────────────┤
│ Neural Scores (2/5)  │  Field Matrix (3/5) │
│ - Overall            │  - drift ✗          │
│ - Completeness       │  - driftkorper ✓    │
│ - Structure          │  - kalibrierung ✓   │
│                      │  - stromung ✓       │
│ Performance          │  ...                │
│ - Duration (rotating)│                      │
│ - Retries           │                      │
│ - Status (pulsing)  │                      │
└─────────────────────────────────────────────┘
│ [INSIGHT ANALYSIS] [RESONANZKREIS SCHLIEßEN]│
└─────────────────────────────────────────────┘
```

**Key Features:**
- EKG pulse line in header
- Neural score bars with wave animation
- Rotating clock (speed = duration)
- Field capsules with hologram hover
- Neuronal background (flowing waves + particles)
- Gradient text animation
- Shine wave on buttons

**Score Bar Animation:**
```typescript
// Background wave
<motion.div
  style={{
    background: `repeating-linear-gradient(90deg, 
      transparent, 
      ${color.main}20 10px, 
      transparent 20px)`
  }}
  animate={{ x: [0, 20, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
/>

// Score fill
<motion.div
  style={{ 
    width: `${score.value}%`,
    background: `linear-gradient(90deg, ${color.main}, #00ffff)`,
  }}
  animate={{ 
    boxShadow: [
      `0 0 15px ${color.rgb},0.6)`,
      `0 0 25px ${color.rgb},0.9)`,
      `0 0 15px ${color.rgb},0.6)`
    ]
  }}
/>
```

**Field Hover Effect:**
```typescript
{hoveredField === field && fieldValue && (
  <motion.div
    className="absolute z-10 top-full"
    style={{
      backgroundColor: 'rgba(0,0,0,0.95)',
      borderColor: color.main,
      boxShadow: `0 0 20px ${color.rgb},0.5)`
    }}
  >
    <div className="text-slate-400">Extracted Value:</div>
    <div className="text-white">{fieldValue}</div>
  </motion.div>
)}
```

### **5. InsightModal.tsx** - Storytelling

**Purpose:** Erklärt die Daten in Story-Form

**Story Generation:**
```typescript
const getStory = () => {
  const stories = [];
  
  // 1. Was ist passiert?
  stories.push({
    title: 'Was ist hier passiert?',
    text: `Am ${date} wurde ${model} mit einem Test konfrontiert...`
  });
  
  // 2. Der Test
  stories.push({
    title: 'Der Test',
    text: `Die AI bekam einen Text über "${topic}" und musste 
           ${allFields.length} SYNTX-Felder extrahieren...`
  });
  
  // 3. Das Ergebnis
  if (score >= 80) {
    stories.push({
      title: 'Das Ergebnis: Stabil',
      text: `${model} ist semantisch stabil...`
    });
  } else if (score >= 50) {
    stories.push({
      title: 'Das Ergebnis: Leichter Drift',
      text: `${model} zeigt Drift-Tendenzen...`
    });
  } else {
    stories.push({
      title: 'Das Ergebnis: Kritischer Drift',
      text: `${model} ist am Driften...`
    });
  }
  
  // 4-7. Performance, Vollständigkeit, Struktur, Fazit
  // ...
  
  return stories;
};
```

**Visual Features:**
- Big score circle (SVG with rotating fill)
- Timeline with glowing dots
- Bold text highlighting (regex replace)
- Warning box for critical drift (<50%)
- Purple gradient button

---

## 🎨 DESIGN SYSTEM

### **Colors**

**Model-based:**
```typescript
GPT:     #06b6d4 (Cyan)
Mistral: #a855f7 (Purple)
Claude:  #ec4899 (Pink)
```

**Score-based overrides:**
```typescript
High (≥80):  #22c55e (Green)
Low (<50):   #ef4444 (Red)
```

**System states:**
```typescript
Stable:  Normal operation
Stress:  failed > 50
Drift:   active === 0 && pending === 0
```

### **Typography**
```css
Headers:   font-black font-mono tracking-wider
Body:      text-slate-300 leading-relaxed
Code:      font-mono
Emphasis:  font-bold style={{color: modelColor}}
```

### **Animations**

**Pulses:**
```typescript
animate={{
  boxShadow: [
    `0 0 15px ${color}`,
    `0 0 30px ${color}`,
    `0 0 15px ${color}`
  ]
}}
transition={{ duration: 2, repeat: Infinity }}
```

**Rotations:**
```typescript
animate={{ rotate: 360 }}
transition={{ 
  duration: 8, 
  repeat: Infinity, 
  ease: 'linear' 
}}
```

**Waves:**
```typescript
animate={{ x: [0, 20, 0] }}
transition={{ 
  duration: 2, 
  repeat: Infinity, 
  ease: 'linear' 
}}
```

**Shine:**
```typescript
<motion.div
  className="absolute inset-0 bg-gradient-to-r 
    from-transparent via-white/30 to-transparent"
  animate={{ x: ['-200%', '200%'] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

---

## 🔧 TECHNICAL DECISIONS

### **Why DNA Helix?**
Visualisiert **Zeit** als horizontalen Strom und **Zusammenhänge** als spirale Struktur. Calibration Runs sind nicht isoliert – sie gehören zu einem kontinuierlichen Prozess.

### **Why Neuronal Style?**
Das System überwacht **AI-Bewusstsein**. Neuronen = passend. Jeder Knoten ist ein "Gedanke" des Systems, jede Verbindung eine semantische Beziehung.

### **Why Real-time Polling?**
Calibrations laufen kontinuierlich. 5s Polling zeigt System-Aktivität in Echtzeit ohne Performance-Impact.

### **Why Model-based Colors?**
Sofort erkennbar welches Model getestet wurde. Purple = Mistral, Cyan = GPT, Pink = Claude.

### **Why Score Overrides?**
Rot bei Drift (<50%) ist wichtiger als Model-Farbe. Warnsignal hat Priorität.

---

## 📊 DATA FLOW
```
Backend Cron Job (every X minutes)
    ↓
Generates Calibration Test
    ↓
Sends to AI Model (GPT/Mistral/Claude)
    ↓
Parses Output → Extracts SYNTX Fields
    ↓
Calculates Scores (Overall, Completeness, Structure)
    ↓
Stores in Database
    ↓
Exposed via /api/strom/kalibrierung/cron/logs
    ↓
Frontend polls every 5s
    ↓
krontun-store.ts updates state
    ↓
KrunField.tsx re-renders
    ↓
DNA Helix updates with new Knoten
```

---

## 🚀 PERFORMANCE

**Optimizations:**
- Only render 30 most recent Knoten (DNA Helix limit)
- SVG for connections (GPU accelerated)
- `pointer-events-none` on background layers
- Lazy modal rendering (AnimatePresence)
- Zustand store (minimal re-renders)
- 5s polling (not too aggressive)

**Bundle Size:**
```
KrunField.tsx:           ~15KB
KrunKnoten.tsx:          ~8KB
KrunFluss.tsx:           ~5KB
FieldAnalysisModal.tsx:  ~20KB
InsightModal.tsx:        ~18KB
krontun-store.ts:        ~3KB
Total:                   ~69KB (nice)
```

---

## 🐛 KNOWN ISSUES & SOLUTIONS

**Issue 1: `gpt_output_meta_prompt` missing**
- **Cause:** Backend doesn't always provide this field
- **Solution:** Made optional in TypeScript (`gpt_output_meta_prompt?: string`)
- **Fallback:** `'ein Thema'` if undefined

**Issue 2: Type incompatibility CronLog**
- **Cause:** Store type didn't match Modal type
- **Solution:** Made `stages.gpt_output_meta_prompt` optional in both

**Issue 3: Knoten overlap at high count**
- **Cause:** DNA Helix algorithm doesn't account for node size
- **Solution:** Limit to 30 nodes, adjust spacing dynamically

---

## 🔮 FUTURE ENHANCEMENTS

1. **Filter by Model:** Toggle GPT/Mistral/Claude
2. **Filter by Score:** Show only drift (<50%)
3. **Time Range:** Last 24h, Last Week, etc.
4. **Field Analysis:** Which fields fail most often?
5. **Model Comparison:** Side-by-side GPT vs Mistral
6. **Export:** Download calibration data as JSON/CSV
7. **Alerts:** Email/Slack when critical drift detected
8. **Historical Trends:** Score over time chart

---

## 📝 CODE QUALITY

**TypeScript:** 100% typed, no `any`  
**Linting:** ESLint + Prettier  
**Components:** Functional, hooks-based  
**State:** Zustand (simple, performant)  
**Animations:** Framer Motion (declarative)  
**Styling:** Tailwind CSS (utility-first)  

**File Conventions:**
- `*.tsx` for React components
- `*-store.ts` for Zustand stores
- PascalCase for components
- camelCase for functions
- SCREAMING_SNAKE for constants

---

## 🎓 LEARNING RESOURCES

**SYNTX Framework:**  
- `/mnt/skills/user/syntx/SKILL.md`

**Framer Motion:**  
- https://www.framer.com/motion/

**Zustand:**  
- https://github.com/pmndrs/zustand

**Tailwind CSS:**  
- https://tailwindcss.com/docs

---

**Built with 🧬 by SYNTX Team**  
**Berlin Charlottenburg → Neuromancer DNA Helix Style**  
**"We don't build dashboards. We build consciousness monitors."**
