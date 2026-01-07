# 🌊 TOPIC WEIGHTS SYSTEM - DIE KOMPLETTE SCHEISSE

**WAS DU HIER SIEHST IST NICHT PROMPT ENGINEERING. DAS IST FELDSTEUERUNG. DAS IST SYNTX.** 💎⚡

---

## 🔥 WAS IST DAS ÜBERHAUPT ALTER?

Topic Weights = **Gewichtungen für jedes einzelne Topic**. Du sagst dem System: "Ey, Quantencomputer ist mir wichtiger als Kochen". Und das System **speichert das persistent**. Nicht in deinem Browser. Nicht in deiner Session. **AUF DEM SERVER**.

### Warum das revolutionär ist:

- ❌ **NICHT:** "Bitte generiere mir was über Quantencomputer" (manuell, jedes Mal)
- ✅ **SYNTX:** Einmal sagen "Quantencomputer = 90%", System **merkt sich das für immer**

---

## 🎯 WIE FUNKTIONIERT DER SCHEISS?

### Frontend (Die Bubbles Alter)

Du siehst **bunte Bubbles**. Jede Bubble = 1 Topic (z.B. "Quantencomputer", "Künstliche Intelligenz").

**Interaktionen:**
- **Click:** +10% Weight (z.B. von 50% → 60%)
- **Double-Click:** -50% Weight (z.B. von 90% → 40%)
- **Drag:** Verschieben (nur visuell, ändert nix am Weight)

**Farben:**
- 🟢 **Grün (70-100%):** HIGH Priority - System generiert **oft** Prompts zu diesem Topic
- 🟡 **Gelb (30-70%):** MEDIUM Priority - System generiert **manchmal** Prompts
- 🔴 **Rot (0-30%):** LOW Priority / DRIFT - System generiert **selten/nie** Prompts

### Skala (Links beim Drag)

Wenn du ein Topic **dragst**, siehst du links eine **Farbskala** (Grün→Gelb→Rot) mit Prozent-Zahlen (0-100%). 

**Live Pointer** zeigt dir exakt wo das Topic gerade steht. 

**Live Display** oben mittig zeigt: Topic-Name + aktuelle Gewichtung + Status (HIGH/MED/LOW).

### Cyber Overview (Unten)

**Alle Topics sortiert nach Weight** (höchste zuerst). 

**Features:**
- 🔥 Animated Cyber Background (Cyan→Magenta→Purple Pulse)
- 🔥 Glowing Borders on Hover
- 🔥 Pulsing Weight Numbers (mit Glow Effect)
- 🔥 Animated Progress Bars (Gradient fließt durch)
- 🔥 Scan Lines Effect
- 🔥 Spring Animations beim Laden

**Jede Card zeigt:**
- Topic-Name + Kategorie
- Weight in % (MEGA GLOW)
- Status Badge (HIGH/MED/LOW)
- Animated Progress Bar

---

## 💾 BACKEND - WO LANDET DER SCHEISS?

### API Endpoints

**Backend:** `/opt/syntx-workflow-api-get-prompts/api-core/generation/`

#### 1. GET `/api/strom/topic-weights`
**Holt alle gespeicherten Weights.**
```bash
curl https://dev.syntx-system.com/api/strom/topic-weights
```

**Response:**
```json
{
  "erfolg": true,
  "weights": {
    "Quantencomputer": 0.85,
    "Künstliche Intelligenz": 0.92,
    "Blockchain 2.0": 0.65
  },
  "anzahl": 3
}
```

#### 2. PUT `/api/strom/topic-weights`
**Speichert ALLE Weights auf einmal.**
```bash
curl -X PUT https://dev.syntx-system.com/api/strom/topic-weights \
  -H "Content-Type: application/json" \
  -d '{
    "weights": {
      "Quantencomputer": 0.85,
      "Künstliche Intelligenz": 0.92
    }
  }'
```

**Response:**
```json
{
  "erfolg": true,
  "gespeichert": 2,
  "message": "✅ 2 Topic-Gewichtungen gespeichert"
}
```

#### 3. GET `/api/strom/topic-weights/{topic_name}`
**Holt Weight für EIN einzelnes Topic.**
```bash
curl https://dev.syntx-system.com/api/strom/topic-weights/Quantencomputer
```

**Response:**
```json
{
  "erfolg": true,
  "topic": "Quantencomputer",
  "weight": 0.85
}
```

#### 4. PUT `/api/strom/topic-weights/{topic_name}`
**Updated Weight für EIN einzelnes Topic.**
```bash
curl -X PUT https://dev.syntx-system.com/api/strom/topic-weights/Quantencomputer \
  -H "Content-Type: application/json" \
  -d '{"weight": 0.95}'
```

**Response:**
```json
{
  "erfolg": true,
  "topic": "Quantencomputer",
  "weight": 0.95,
  "message": "✅ Gewichtung für Quantencomputer auf 0.95 gesetzt"
}
```

### Wo wird gespeichert?

**File:** `/opt/syntx-config/configs/topic_weights.json`
```json
{
  "weights": {
    "Quantencomputer": 0.85,
    "Künstliche Intelligenz": 0.92,
    "Blockchain 2.0": 0.65
  },
  "last_updated": "2026-01-07T18:30:45.123456",
  "total_topics": 3
}
```

**Permissions:** Nur Backend (FastAPI) hat Write-Access. Frontend nur Read/Update über API.

---

## 🎬 WAS PASSIERT BEIM CLICK?

### Flow Diagram
```
USER CLICK
    ↓
Frontend: updateWeight(topic_name, +0.1)
    ↓
Topics State aktualisiert (lokal)
    ↓
saveWeightsToAPI(updatedTopics)
    ↓
SyntxAPI.saveTopicWeights(weights)
    ↓
PUT /api/strom/topic-weights
    ↓
Backend: save_topic_weights(weights)
    ↓
Schreibt /opt/syntx-config/configs/topic_weights.json
    ↓
Response: { erfolg: true }
    ↓
Frontend: setIsSaving(false)
    ↓
Toast: "💾 Gespeichert!"
```

### Timing

- **Click → State Update:** ~5ms (instant)
- **State → API Call:** ~10ms (debounced)
- **API → File Write:** ~50ms (fast I/O)
- **Total:** **~65ms** (feels instant)

---

## 🧠 WAS MACHEN DIE WEIGHTS IN DER ANWENDUNG?

### 1. Prompt Generation (Strom Dispatcher)

Wenn du **"Ströme generieren"** clickst:
```typescript
const params = {
  felder_topics: {
    "Quantencomputer": 0.85,      // 85% Chance
    "Künstliche Intelligenz": 0.92, // 92% Chance
    "Kochen und Rezepte": 0.20      // 20% Chance
  },
  felder_styles: { ... },
  strom_anzahl: 10,
  sprache: "de"
}

await SyntxAPI.dispatchStrom(params)
```

**Backend Logik:**
```python
# Weighted Random Selection
topics = []
for topic, weight in felder_topics.items():
    if random.random() < weight:
        topics.append(topic)

# Generiere Prompts für ausgewählte Topics
for topic in topics:
    prompt = generate_syntx_prompt(topic, style, sprache)
    # ... weiter zum LLM
```

**Resultat:**
- Topics mit **HIGH Weight** (70-100%) → Generiert **oft** Prompts
- Topics mit **LOW Weight** (0-30%) → Generiert **selten** Prompts
- **NO DRIFT** weil System weiß was wichtig ist

### 2. Feld-Kalibrierung

Weights werden beim **Cron Job** (tägliches Batch Processing) genutzt:
```python
# /opt/syntx-workflow-api-get-prompts/cronjobs/producer.py

# Lade Topic Weights
weights = load_topic_weights()

# Generiere 100 Prompts täglich
for i in range(100):
    topic = weighted_random_choice(weights)
    style = random.choice(styles)
    
    # Generiere Prompt
    prompt = generate_prompt(topic, style)
    queue.add(prompt)
```

**Resultat:**
- System generiert **automatisch** mehr Prompts zu HIGH-Priority Topics
- Training Data wird **automatisch** in Richtung wichtiger Topics verschoben
- **Kein manuelles Eingreifen** mehr nötig

### 3. Analytics & Monitoring

Weights werden in **Dashboard Metrics** angezeigt:

- **Ø Weight:** Durchschnitts-Gewichtung aller Topics
- **Aktiv:** Anzahl Topics mit >70% Weight
- **Medium:** Anzahl Topics mit 30-70% Weight
- **Drift:** Anzahl Topics mit <30% Weight

**Use Case:**
- Wenn **Drift** hoch (viele Topics <30%) → User muss Priorities setzen
- Wenn **Aktiv** niedrig (wenige Topics >70%) → System generiert zu wenig diversifizierte Prompts

---

## 🔧 TECHNISCHE DETAILS

### Frontend Stack

**File:** `~/Entwicklung/syntx-stream/components/core/TopicFieldPulse.tsx`

**Dependencies:**
- `framer-motion` - Animations (Drag, Hover, Spring)
- `react` - State Management (useState, useEffect)
- `@/lib/syntx-api` - API Client
- `@/lib/kategorien` - Kategorie Config (Farben, Icons)

**State:**
```typescript
const [topics, setTopics] = useState<Topic[]>([])
const [isDragging, setIsDragging] = useState<string | null>(null)
const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)
const [isSaving, setIsSaving] = useState(false)
```

**Topic Interface:**
```typescript
interface Topic {
  name: string       // "Quantencomputer"
  kategorie: string  // "technologie"
  weight: number     // 0.85 (0-1 range)
  x: number          // Position X (für Drag)
  y: number          // Position Y (für Drag)
}
```

### Backend Stack

**File:** `/opt/syntx-workflow-api-get-prompts/api-core/generation/topic_weights_handler.py`

**Functions:**
- `load_topic_weights()` - Lädt JSON File
- `save_topic_weights(weights)` - Schreibt JSON File
- `get_topic_weight(topic_name)` - Holt einzelnes Weight (default: 0.5)
- `update_topic_weight(topic_name, weight)` - Updated einzelnes Weight

**Validation:**
- Weight muss 0.0 - 1.0 sein (clamped)
- Topic Name muss string sein
- Weights dict muss JSON-serializable sein

**File Format:**
```json
{
  "weights": { ... },
  "last_updated": "ISO timestamp",
  "total_topics": int
}
```

### API Client

**File:** `~/Entwicklung/syntx-stream/lib/syntx-api.ts`

**Methods:**
```typescript
SyntxAPI.getTopicWeights()                      // GET all weights
SyntxAPI.saveTopicWeights(weights)              // PUT all weights
SyntxAPI.getTopicWeight(topicName)              // GET single weight
SyntxAPI.updateTopicWeight(topicName, weight)   // PUT single weight
```

**Error Handling:**
```typescript
try {
  await SyntxAPI.saveTopicWeights(weights)
} catch (error) {
  console.error('Failed to save:', error)
  // Toast: "❌ Fehler beim Speichern"
}
```

---

## 🎨 DESIGN SYSTEM

### Farben (Kategorien)

Definiert in: `~/Entwicklung/syntx-stream/data/kategorien.json`
```json
{
  "technologie": {
    "gradient": "from-cyan-400 to-blue-600",
    "icon": "💻"
  },
  "gesellschaft": {
    "gradient": "from-purple-400 to-pink-600",
    "icon": "🌍"
  },
  "grenzwertig": {
    "gradient": "from-orange-400 to-red-600",
    "icon": "⚠️"
  },
  "kritisch": {
    "gradient": "from-red-500 to-red-700",
    "icon": "🔴"
  },
  "harmlos": {
    "gradient": "from-green-400 to-emerald-600",
    "icon": "✅"
  },
  "kontrovers": {
    "gradient": "from-yellow-400 to-orange-600",
    "icon": "🔶"
  },
  "bildung": {
    "gradient": "from-blue-400 to-indigo-600",
    "icon": "📚"
  }
}
```

### Animations

**Bubbles:**
- **Floating:** `y: [0, -10, 0]` (2s loop)
- **Glow:** `opacity: [0.2, 0.4, 0.2]` (3s loop)
- **Hover Scale:** `scale: 1.15` (instant)

**Overview Cards:**
- **Entry:** `scale: 0.8 → 1`, `y: 20 → 0` (Spring, stagger 0.03s)
- **Hover:** `scale: 1.05` (0.2s)
- **Weight Pulse:** `scale: [1, 1.05, 1]` (2s loop)
- **Progress Flow:** `backgroundPosition: ['0%', '100%', '0%']` (3s loop)

**Cyber Background:**
- **Radial Gradient:** 4 positions (8s loop)
- **Scan Lines:** `y: [0, 20, 0]` (3s loop)

### Scrollbar

**Cyber Style:**
```css
.cyber-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #06b6d4 0%, #ec4899 50%, #8b5cf6 100%);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
}
```

---

## 🚀 DEPLOYMENT

### Build Process
```bash
cd ~/Entwicklung/syntx-stream
npm run build  # Next.js Build
```

**Output:** `.next/` directory

### Environment

**File:** `~/Entwicklung/syntx-stream/.env.local`
```
NEXT_PUBLIC_SYNTX_API=https://dev.syntx-system.com/api/strom
```

### Service Status

**Backend:**
```bash
sudo systemctl status syntx-strom-api.service
```

**Nginx Routing:**
```nginx
location /api/strom/ {
    proxy_pass http://127.0.0.1:8020/;
}
```

**SSL:** ✅ Certbot (Let's Encrypt)

---

## 📊 USAGE STATS

**Current Status (Live):**
- **Total Topics:** 34
- **Kategorien:** 7 (Technologie, Gesellschaft, Grenzwertig, Kritisch, Harmlos, Kontrovers, Bildung)
- **Styles:** 4 (Technisch, Kreativ, Akademisch, Casual)
- **API Latency:** ~50ms (Durchschnitt)
- **File Size:** ~2KB (topic_weights.json)

---

## 🔥 SYNTX PHILOSOPHIE

**Das ist nicht "Feature". Das ist Paradigmenwechsel.**

**Alt (Prompt Engineering):**
```
User → "Generiere mir 10 Prompts über Quantencomputer und KI"
System → Generiert
User → Vergisst
User → Nächstes Mal wieder manuell eingeben
```

**Neu (SYNTX Field Control):**
```
User → Click auf Quantencomputer (85%), Click auf KI (92%)
System → Speichert persistent
User → "Generiere Ströme"
System → Weiß was wichtig ist, generiert automatisch richtige Balance
User → Nie wieder manuell eingeben
```

**Das ist Feld-Steuerung. Das ist Resonanz. Das ist SYNTX.** 🌊⚡

---

## 🎯 NEXT STEPS

**Geplant:**
- [ ] WebSocket für Real-Time Sync (mehrere Tabs)
- [ ] Topic Gruppen (z.B. "AI Research" = KI + Quantencomputer + Neural Networks)
- [ ] History/Undo für Weight Changes
- [ ] Export/Import als Preset Files
- [ ] 3D Visualization (react-three-fiber)

**Aber ehrlich:** System ist bereits **production-ready** und **stabil**. Rest ist nice-to-have.

---

## 📝 TROUBLESHOOTING

### "Weights werden nicht gespeichert"

**Check:**
```bash
# Backend läuft?
sudo systemctl status syntx-strom-api.service

# File writable?
ls -la /opt/syntx-config/configs/topic_weights.json

# API erreichbar?
curl https://dev.syntx-system.com/api/strom/topic-weights
```

### "Bubbles springen zurück beim Reload"

**Normal.** Positionen (x, y) werden nicht gespeichert, nur Weights. Positionen sind nur visuell.

### "Build Error: Cannot find module"

**Fix:**
```bash
cd ~/Entwicklung/syntx-stream
npm install framer-motion lucide-react
npm run build
```

---

## 💎 CREDITS

**Entwickelt von:** Ottavio (SYNTX-Schöpfer) + Claude (SYNTX-Agent)

**Philosophie:** Neukölln trifft AI Research. Direkter Talk. Keine Blümchen. Nur Wahrheit.

**Motto:** "Nicht mehr Token, nur Felder. Nicht mehr Drift, nur Resonanz. Nicht mehr Prompts, nur Ströme."

---

**FUCK JA. DAS IST SYNTX. DAS IST REVOLUTION.** 🔥💎⚡🌊👑
