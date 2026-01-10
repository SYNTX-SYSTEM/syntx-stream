# 🔌 CALIBRAX - BACKEND DOCUMENTATION

**SYNTX Field Matrix System - Backend Architecture**  
*API Endpoints, Data Structures, Integration Guide*

---

## 🎯 OVERVIEW

Das CALIBRAX Backend liefert **Calibration Run Data** vom KRONTUN Kalibrierungssystem. Jeder Run durchläuft eine **Multi-Stage Pipeline** (GPT → Mistral → Parsing) und wird mit **Scores** und **Metadata** versehen.

**Base URL:** `https://dev.syntx-system.com/api/strom`

---

## 🔌 API ENDPOINTS

### 1. GET /kalibrierung/cron/logs

**Purpose:** Lädt Calibration Runs (paginiert)

**Request:**
```bash
curl "https://dev.syntx-system.com/api/strom/kalibrierung/cron/logs?limit=100"
```

**Query Parameters:**
```typescript
{
  limit?: number;     // Default: 20, Max: 100
  offset?: number;    // Default: 0
  sort?: 'asc' | 'desc';  // Default: 'desc' (newest first)
}
```

**Response Schema:**
```json
{
  "erfolg": true,
  "count": 20,
  "total": 1689,
  "logs": [
    {
      "timestamp": "2026-01-10T17:09:37.032360Z",
      "cron_data": {
        "name": "SYNTEX::TRUE_RAW Calibration",
        "modell": "mistral-uncensored",
        "felder": {
          "sigma_drift": 1,
          "sigma_mechanismus": 1,
          "sigma_frequenz": 1,
          "sigma_dichte": 1,
          "sigma_strome": 1,
          "sigma_extrakt": 1,
          "drift": 1,
          "driftkorper": 1,
          "hintergrund_muster": 1,
          "druckfaktoren": 1,
          "tiefe": 1,
          "wirkung": 1,
          "klartext": 1,
          "kalibrierung": 1,
          "stromung": 1
        }
      },
      "scores": {
        "overall": 70,
        "field_completeness": 100,
        "structure_adherence": 100
      },
      "meta": {
        "duration_ms": 134707,
        "retry_count": 0,
        "success": true
      },
      "stages": {
        "gpt_system_prompt": "SYNTEX::TRUE_RAW",
        "gpt_user_prompt": null,
        "gpt_output_meta_prompt": "Klar, gerne! Stell dir Yoga und Meditation wie zwei richtig gute Freunde vor, die beide darauf abzielen, dir zu helfen, ein bisschen entspannter und gelassener durchs Leben zu gehen...",
        "mistral_input": "...",
        "mistral_output": "### Driftkorperanalyse: **T**\n\nDer Begriff \"Driftkorper\" verweist auf eine zentrale Metapher...",
        "parsed_fields": {
          "sigma_drift": "...",
          "driftkorper": "..."
        }
      }
    }
  ]
}
```

**TypeScript Types:**
```typescript
interface CalibrationLogsResponse {
  erfolg: boolean;
  count: number;
  total: number;
  logs: CalibrationRun[];
}

interface CalibrationRun {
  timestamp: string;              // ISO 8601 datetime
  cron_data: CronData;
  stages?: CalibrationStages;
  scores: CalibrationScores;
  meta: CalibrationMeta;
}

interface CronData {
  name: string;                   // Run identifier
  modell: string;                 // AI model used
  felder: Record<string, number>; // Field weights
}

interface CalibrationStages {
  gpt_system_prompt?: string;
  gpt_user_prompt?: string | null;
  gpt_output_meta_prompt?: string;
  mistral_input?: string;
  mistral_output?: string;
  parsed_fields?: Record<string, any>;
}

interface CalibrationScores {
  overall: number;                // 0-100 score
  field_completeness: number;     // 0-100 percentage
  structure_adherence: number;    // 0-100 percentage
}

interface CalibrationMeta {
  duration_ms: number;            // Processing time
  retry_count: number;            // Number of retries
  success: boolean;               // Run status
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Backend error

---

### 2. GET /kalibrierung/cron/stats

**Purpose:** Lädt aggregierte Statistiken

**Request:**
```bash
curl "https://dev.syntx-system.com/api/strom/kalibrierung/cron/stats"
```

**Response:**
```json
{
  "total_runs": 1689,
  "completed": 1682,
  "failed": 7,
  "avg_duration_ms": 125430,
  "success_rate": 0.996
}
```

**TypeScript Type:**
```typescript
interface CalibrationStats {
  total_runs: number;
  completed: number;
  failed: number;
  avg_duration_ms: number;
  success_rate: number;
}
```

---

### 3. GET /formats/{format}/fields

**Purpose:** Lädt Field Definitions für dynamische Klassifikation

**Request:**
```bash
curl "https://dev.syntx-system.com/api/strom/formats/syntex_system/fields"
```

**Response:**
```json
{
  "fields": {
    "sigma_drift": {
      "description": "Bewegung im semantischen Feld",
      "keywords": ["drift", "bewegung", "fluss"],
      "examples": ["Der Drift zeigt...", "Bewegung ist..."]
    },
    "driftkorper": {
      "description": "Essenz und Tiefe des Systems",
      "keywords": ["körper", "essenz", "tiefe", "wurzel"],
      "examples": ["Der Driftkörper ist..."]
    },
    "sigma_frequenz": {
      "description": "Rhythmus und Pulsschlag",
      "keywords": ["frequenz", "rhythmus", "puls", "herz"],
      "examples": []
    }
  }
}
```

**TypeScript Type:**
```typescript
interface FieldDefinitionsResponse {
  fields: Record<string, FieldDefinition>;
}

interface FieldDefinition {
  description: string;
  keywords: string[];
  examples?: string[];
}
```

---

## 📊 DATA STRUCTURES

### Calibration Pipeline Flow
```
┌─────────────────────────────────────────────────────────┐
│                  CALIBRATION PIPELINE                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. CRON TRIGGER                                         │
│     - name: "SYNTEX::TRUE_RAW Calibration"              │
│     - modell: "mistral-uncensored"                       │
│     - felder: { sigma_drift: 1, ... }                   │
│                                                          │
│  2. GPT-4 STAGE                                          │
│     Input:                                               │
│       - system: "SYNTEX::TRUE_RAW"                       │
│       - user: null (optional)                            │
│     Output:                                              │
│       - gpt_output_meta_prompt: "Klar, gerne!..."       │
│                                                          │
│  3. MISTRAL STAGE                                        │
│     Input:                                               │
│       - mistral_input: GPT output + instructions         │
│     Output:                                              │
│       - mistral_output: "### Driftkorperanalyse..."     │
│                                                          │
│  4. PARSING STAGE                                        │
│     - Extract fields from mistral_output                 │
│     - parsed_fields: { sigma_drift: "...", ... }        │
│                                                          │
│  5. SCORING                                              │
│     - overall: 0-100 (quality score)                     │
│     - field_completeness: 0-100 (% fields found)         │
│     - structure_adherence: 0-100 (format compliance)     │
│                                                          │
│  6. STORAGE                                              │
│     - Save to database                                   │
│     - Timestamp: ISO 8601                                │
│     - Meta: duration_ms, retry_count, success            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 INTEGRATION GUIDE

### Frontend Integration

**1. Install Dependencies:**
```bash
npm install
```

**2. Create API Client:**
```typescript
// lib/calibrax/fetchCalibrations.ts

export async function fetchCalibrations(limit: number = 20) {
  const response = await fetch(
    `https://dev.syntx-system.com/api/strom/kalibrierung/cron/logs?limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.logs;
}
```

**3. Use in Component:**
```typescript
import { useState, useEffect } from 'react';
import { fetchCalibrations } from '@/lib/calibrax/fetchCalibrations';

export function StreamMap() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalibrations(100)
      .then(setRuns)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return <div>{/* Render runs */}</div>;
}
```

---

## 🔐 AUTHENTICATION

**Current Status:** No authentication required (public API)

**Future:** API key authentication planned
```typescript
// Future implementation
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});
```

---

## ⚡ RATE LIMITS

**Current:** No rate limits  
**Recommended:** Max 100 requests/minute per client

---

## 🐛 ERROR HANDLING

### Common Errors

**1. Invalid Limit Parameter:**
```json
{
  "erfolg": false,
  "error": "Limit must be between 1 and 100"
}
```

**2. Database Connection Error:**
```json
{
  "erfolg": false,
  "error": "Database connection failed"
}
```

**3. Empty Result Set:**
```json
{
  "erfolg": true,
  "count": 0,
  "total": 0,
  "logs": []
}
```

**Frontend Error Handling:**
```typescript
try {
  const runs = await fetchCalibrations(100);
  setRuns(runs);
} catch (error) {
  if (error.response?.status === 500) {
    setError('Backend error - please try again later');
  } else {
    setError('Failed to load calibrations');
  }
}
```

---

## 📈 PERFORMANCE

### Response Times

| Endpoint | Avg Response Time | Max Response Time |
|----------|-------------------|-------------------|
| `/cron/logs?limit=20` | 150ms | 300ms |
| `/cron/logs?limit=100` | 400ms | 800ms |
| `/cron/stats` | 50ms | 100ms |
| `/formats/*/fields` | 80ms | 150ms |

### Caching Strategy

**Frontend:**
- Field definitions cached in memory (`classifyOrgans.ts`)
- Runs fetched on-demand (no caching)

**Backend:**
- Database queries optimized with indexes
- No caching layer (data changes frequently)

---

## 🔮 FUTURE ENHANCEMENTS

1. **WebSocket Support:**
```typescript
   const ws = new WebSocket('wss://dev.syntx-system.com/api/strom/calibrations/live');
   ws.onmessage = (event) => {
     const newRun = JSON.parse(event.data);
     setRuns(prev => [newRun, ...prev]);
   };
```

2. **Filtering:**
```
   GET /cron/logs?model=mistral-uncensored&score_min=80&date_from=2026-01-01
```

3. **Pagination Cursor:**
```json
   {
     "logs": [...],
     "next_cursor": "eyJ0aW1lc3RhbXAiOiIyMDI2LTAxLTEwIn0=",
     "has_more": true
   }
```

---

*Backend Documentation v1.0*  
*Last Updated: 2026-01-10*
