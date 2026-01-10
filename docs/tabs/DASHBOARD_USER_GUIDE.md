# 🌌 DASHBOARD TAB - USER GUIDE

**Dein Fenster in die SYNTX Galaxy**

---

## 🎯 WAS IST DAS DASHBOARD?

Das Dashboard ist der **Haupt-Screen** vom SYNTX System. Hier siehst du **live**, was gerade passiert:

- 💓 **System Health**: Wie gesund ist das System?
- 🔄 **Queue Status**: Was läuft gerade?
- 📊 **Topics**: Welche Themen performen gut?
- 🎨 **Wrapper**: Welche Wrapper liefern die besten Scores?
- 🌌 **Galaxy Flow**: Die letzten 10 Jobs als **Sterne & Planeten**

---

## 🖥️ BILDSCHIRM-AUFBAU

### 1️⃣ HEADER (Oben)
```
         🔵 [SYNTX LOGO]
              
         DASHBOARD
    LEBENDER ORGANISMUS · ECHTZEIT STROM

   486          34%         0%
 PROMPTS     AVG SCORE    SUCCESS
```

**Was bedeutet das?**
- **PROMPTS**: Wie viele Jobs insgesamt gelaufen sind
- **AVG SCORE**: Durchschnittlicher Qualitäts-Score
- **SUCCESS**: Prozent der perfekten Scores (>80%)

💡 **Tipp**: Die Zahlen **pulsen** und **glühen** - das zeigt, dass das System **lebt**.

---

### 2️⃣ QUEUE STATUS (Mitte-Oben)
```
  140           0           486          26
INCOMING    PROCESSING    PROCESSED    ERRORS
  🟣           🟡           🟢          🔴
```

**Was bedeutet das?**
- **INCOMING** (Lila): Jobs, die warten
- **PROCESSING** (Gelb, pulsierend): Jobs, die **jetzt gerade** laufen
- **PROCESSED** (Grün): Fertige Jobs
- **ERRORS** (Rot): Fehlerhafte Jobs

💡 **Tipp**: Wenn **PROCESSING pulsiert**, arbeitet das System gerade.

---

### 3️⃣ TOPIC FIELD (Mitte)
```
 TECHNOLOGIE     KONTROVERS    GESELLSCHAFT
  79 runs          49 runs       82 runs
    38%             37%            34%
   🟡              🔴             🔴
```

**Was bedeutet das?**
- Jedes **Topic** hat eine **Farbe**:
  - 🟢 **Grün** (>70%): Sehr gut!
  - 🟡 **Gelb** (40-70%): Okay
  - 🔴 **Rot** (<40%): Schwach
- Die Zahl zeigt, wie oft das Topic gelaufen ist
- Der Prozentsatz ist der **Durchschnittsscore**

💡 **Tipp**: Hover drauf, um mehr Details zu sehen!

---

### 4️⃣ WRAPPER SIGNATURES (Mitte-Unten)
```
╔════════════╗  ╔════════════╗  ╔════════════╗
║ DEEPSWEEP  ║  ║ SYNTEX     ║  ║   SIGMA    ║
║            ║  ║  SYSTEM    ║  ║            ║
║ 143 jobs   ║  ║ 112 jobs   ║  ║ 163 jobs   ║
║  44% avg   ║  ║  54% avg   ║  ║  25% avg   ║
╚════════════╝  ╚════════════╝  ╚════════════╝
   🟡              🟢              🔴
```

**Was bedeutet das?**
- Jeder **Wrapper** hat eine **Farbe** (basierend auf avg_score)
- Jeder **Wrapper** hat ein **Puls-Muster**:
  - **SYNTEX_SYSTEM**: Pulsing Depth (tief pulsierend)
  - **SIGMA**: Heartbeat (schnell pulsierend)
  - **DEEPSWEEP**: Water Lines (wellenförmig)

💡 **Tipp**: Die Farbe zeigt die **Performance** des Wrappers.

---

### 5️⃣ GALAXY FLOW (Unten - DER HAMMER! 🌌)
```
    🌠                    🪐        ⭐           🪐
   ⭐         🪐                          ⭐        🪐
      🪐              ⭐         🪐            ⭐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GALAXY FLOW
    10 CELESTIAL BODIES IN STREAM
```

**Was bedeutet das?**

#### ⭐ STERNE (Score > 60%)
- **Hellgelb/Grün leuchtend**
- **8 Strahlen** die pulsieren
- Große Größe (basierend auf Score)
- Labeled "HIGH PERFORMER"

#### 🪐 PLANETEN (Score ≤ 60%)
- **Rot/Orange/Gelb**
- **Orbitalringe** die rotieren
- Kleinere Größe
- Labeled "STANDARD"

💡 **Tipp**: Je **heller** und **größer**, desto **besser der Score**!

---

## 🖱️ INTERAKTIONEN

### Hover über einen Stern/Planeten

**Was passiert?**
1. Der Körper **wächst** auf 130% Größe
2. Ein **Tooltip** erscheint **oben**
3. Der Körper bekommt höhere **Z-Index** (kommt nach vorne)

**Was steht im Tooltip?**
```
╔═══════════════════════════════╗
║           ⭐ STAR              ║
║═══════════════════════════════║
║ FILENAME:            📋 COPY  ║
║ 20260110_040259_256206__to... ║
║───────────────────────────────║
║ Wrapper:    SIGMA             ║
║ Score:      73%       🟢      ║
║ Time:       17:10:06          ║
║ Topic:      GESELLSCHAFT      ║
║ Type:       HIGH PERFORMER    ║
╚═══════════════════════════════╝
```

### Filename kopieren

**2 Wege:**
1. **📋 COPY Button**: Klick → Filename in Clipboard
2. **Click auf Filename Text**: Auto-select → Strg+C

💡 **Pro-Tipp**: Der Filename ist **selectable** - einfach draufklicken und alles wird markiert!

---

## 🎨 FARBEN & BEDEUTUNG

### Score-Farben
- **🟢 Grün** (#22c55e): Score > 70% - EXCELLENT!
- **🟡 Gelb** (#eab308): Score 40-70% - OK
- **🔴 Rot** (#ef4444): Score < 40% - SCHWACH

### Wrapper-Farben
- **🔵 Neonblau** (#06b6d4): Field Core / SYNTEX
- **🟣 Lila** (#a855f7): Drift Zone / Uncertainty
- **🩷 Pink** (#ec4899): Output Core / Human

---

## 🌊 BACKGROUND EFFECTS

### Was siehst du im Hintergrund?

#### 1. Neuronales Netz
- **50 Neuronen** (kleine leuchtende Punkte)
- **Verbindungslinien** die pulsieren
- Zeigt: "Das System **denkt**"

#### 2. Digital Streams
- **20 vertikale Linien**
- **Binary Numbers** (0 und 1) fließen runter
- Zeigt: "Daten **fließen** durchs System"

#### 3. Hexagonal Grid
- **Sechseck-Muster** im Hintergrund
- Subtil und transparent
- Zeigt: "Strukturierte **Architektur**"

💡 **Warum?**: Das ist **SYNTX Aesthetik** - alles ist ein **lebender Organismus**, kein statisches UI.

---

## ⏱️ AUTO-REFRESH

**Alle 30 Sekunden:**
1. Dashboard fetcht **neue Daten** von 4 APIs
2. Du siehst eine **leuchtende Welle** über den Bildschirm (= Pulse Wave)
3. Alle Zahlen **updaten** sich
4. Neue Galaxien erscheinen (wenn neue Jobs fertig sind)

💡 **Tipp**: Die Pulse Wave zeigt dir, dass gerade **fresh data** geladen wurde.

---

## 🚨 ERROR STATES

### Wenn was schiefgeht:
```
      ⚠️
  (rotierend)
  
  FELD BRUCH
  
  Failed to fetch dashboard data
```

**Was tun?**
1. Refresh die Page (F5)
2. Check deine Internet-Verbindung
3. Check ob die API noch läuft

---

## 💡 PRO-TIPPS

### 1. Schnell-Übersicht
**Schau auf die Queue-Zahlen:**
- Viel **INCOMING**? → System ist busy
- Viel **ERRORS**? → Check die Logs
- **PROCESSING pulsiert**? → System arbeitet jetzt

### 2. Performance-Check
**Schau auf die Wrapper-Farben:**
- Viel **Grün**? → System läuft gut!
- Viel **Rot**? → Wrapper brauchen Tuning

### 3. Topic-Trends
**Schau auf die Topic-Scores:**
- **Welche Topics performen gut?** (Grün)
- **Welche Topics strugglen?** (Rot)
- → Hilft bei der **Prompt-Optimierung**

### 4. Galaxy-Analyse
**Schau auf die Sterne/Planeten:**
- **Viele Sterne?** → Recent Jobs waren gut!
- **Viele Planeten?** → Recent Jobs brauchen Verbesserung
- **Größe der Körper** → Je größer, desto besser der Score

---

## 🎭 SYNTX PHILOSOPHIE

**"Everything is a living organism, not a UI."**

Das Dashboard ist **kein normales Admin-Panel**. Es ist ein **lebender Organismus**:

- **Panels atmen** (pulsieren)
- **Daten fließen** (streams)
- **Felder resonieren** (connections)
- **Galaxien rotieren** (continuous motion)

💎 **Das ist SYNTX**: Nicht klicken, sondern **spüren**. Nicht lesen, sondern **fühlen**.

---

## 🚀 SHORTCUTS & TRICKS

### Keyboard Shortcuts
- **F5**: Refresh (force neue Daten)
- **Strg+C**: Filename kopieren (nach click-to-select)

### Hidden Features
- **Hover länger**: Tooltip bleibt stabil
- **Quick-scan Mode**: Nur auf die **Farben** achten, nicht die Zahlen
- **Zen Mode**: Nur auf die **Galaxy** starren und den Flow spüren 🧘

---

## ❓ FAQ

**Q: Warum sehe ich keine Galaxien?**  
A: Es gibt keine recent completed jobs. Warte 30s für Refresh.

**Q: Warum sind die Zahlen so niedrig?**  
A: Das System braucht noch mehr Training/Kalibrierung.

**Q: Kann ich auf Sterne klicken?**  
A: Noch nicht - kommt in der nächsten Version!

**Q: Warum ist alles so "perverse"?**  
A: Das ist **SYNTX Aesthetik**. Embrace the chaos! 🔥

**Q: Was bedeutet "Feld Bruch"?**  
A: Das ist SYNTX-Slang für "Error" - das **Feld** (System) ist **gebrochen**.

---

## 🎓 SYNTX SLANG GUIDE

- **Feld**: Das System / Die Architektur
- **Strom**: Datenfluss / Stream
- **Drift**: Unschärfe / Uncertainty
- **Resonanz**: Verbindung / Coherence
- **Kohärenz**: Klarheit / Consistency
- **Neuron**: Knotenpunkt / Node
- **Galaxy**: Visualisierung / Job-Strom
- **Wrapper**: Analyse-Modul
- **Score**: Qualitäts-Metrik
- **Feld Bruch**: System-Error

---

**VERSION:** 2.1.0  
**CREATED:** 2026-01-10  
**FOR:** SYNTX System Users  
**STYLE:** Charlottenburger Syntx Slang meets Technical Storytelling 🔥💎⚡
