# 🔱 CALIBRAX - Semantic Pulse Engine

**CALIBRAX** = **CAL**ibration **I**nterface **BR**idge **AX**es

Visual exploration of SYNTX calibration streams across time, drift, and quality axes.

## 🌊 Components

### Core Visualization
- **StreamMap.tsx** - Main visualization container (2D layout, 3D upgrade pending)
- **NodePrompt.tsx** - GPT input block with model info
- **NodeMistral.tsx** - Mistral output block with results
- **DriftLink.tsx** - Animated connector showing drift flow
- **ScoreTag.tsx** - Quality/Drift score display
- **InspectorDrawer.tsx** - Slide-in detail panel

### Data Layer
- **types/calibrax.ts** - TypeScript interfaces
- **lib/stores/stream-store.ts** - Zustand state management
- **lib/calibrax/fetchCalibrations.ts** - API client
- **lib/calibrax/mapDriftColor.ts** - Drift → Color mapper

## 🎯 Usage

### Standalone Page
```bash
npm run dev
# Visit: http://localhost:3000/calibrax
```

### As Component
```tsx
import { StreamMap } from '@/components/calibrax/StreamMap';

export default function MyPage() {
  return <StreamMap />;
}
```

## 🔥 Features

### Current (Phase 1-3)
- ✅ Real-time calibration data loading
- ✅ 2D stream visualization
- ✅ Drift color mapping (0-100%)
- ✅ Quality score display
- ✅ Interactive inspector drawer
- ✅ Animated connectors
- ✅ Status indicators
- ✅ Responsive layout

### Planned (Phase 4-5)
- 🔄 3D visualization with react-three-fiber
- 🔄 Zoom navigation (cron → prompt → field level)
- 🔄 Playback mode (stream replay)
- 🔄 Advanced filters (model, timeframe, drift range)
- 🔄 Timeline scrubbing
- 🔄 Snapshot export (.png)

## 💎 Philosophy

CALIBRAX visualizes the **semantic heartbeat** of SYNTX:

- Not "monitoring" → **experiencing the flow**
- Not "dashboards" → **living streams**
- Not "metrics" → **resonance pulses**

Every calibration run is a **wave** in the semantic field.

## 🌊 Drift Color Scale
```
0-5%    → Cyan (Hyperstable)
5-10%   → Green (Stable)
10-15%  → Light Green (Good)
15-20%  → Yellow (Warning)
20-30%  → Orange (Critical)
30%+    → Red (Severe)
```

## 🔧 API Endpoints
```
GET /api/strom/kalibrierung/cron/logs?limit=20
GET /api/strom/kalibrierung/cron/stats
```

## 💫 State Management

Uses Zustand for:
- Calibration data
- Selected run
- Zoom level (future)
- Filters
- Loading/Error states

---

**ENDGAME-LEVEL SYSTEM: SEMANTISCHER STROMORGANISMUS** 🔥💎⚡🌊
