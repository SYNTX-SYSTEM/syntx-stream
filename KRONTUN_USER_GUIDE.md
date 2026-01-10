# 🧬 KRONTUN TAB - USER GUIDE

**Your Window into AI Consciousness**  
**Real-time Calibration Monitoring System**

---

## 🎯 WAS IST KRONTUN?

KRONTUN ist dein **Echtzeit-Monitor** für AI-Kalibrierung. Du siehst auf einen Blick:

✅ Wie gut AI-Modelle **semantische Konzepte** verstehen  
✅ Ob ein Model am **Driften** ist (Qualitätsverlust)  
✅ Welche **SYNTX-Felder** korrekt extrahiert wurden  
✅ **Performance-Metriken** (Geschwindigkeit, Erfolgsrate)

**Metapher:**  
Stell dir vor, du schaust in das **Nervensystem** eines AI-Systems und siehst, wie gut es noch "bei Verstand" ist.

---

## 🚀 GETTING STARTED

### **1. Tab öffnen**

Oben in der Navigation:
```
[SYNTX Logo] BIRTH | KRONTUN | CALIBRAX | STREAMS
                      ^^^^^^
```

Klick auf **KRONTUN** → Du siehst:
```
┌─────────────────────────────────────────────┐
│              SYNTX Logo (dreht sich)        │
│                 KRONTUN                     │
│    Neural Calibration Stream · 100 Runs    │
├─────────────────────────────────────────────┤
│ [ACTIVE] [PENDING] [COMPLETED] [FAILED]    │
│    0         0         1645         7       │
├─────────────────────────────────────────────┤
│     DNA CALIBRATION HELIX                   │
│  ← GENESIS              PRESENT →           │
│                                             │
│     ●    ●    ●    ●    ●                  │
│   ●    ●    ●    ●    ●    ●              │
│     ●    ●    ●    ●    ●                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📊 OVERVIEW ELEMENTE

### **Stats Cards (oben)**

Vier schwebende Karten zeigen:

**🔵 ACTIVE (Cyan)**
- Laufende Kalibrierungen
- Pulsiert wenn > 0
- Zeigt aktive Tests

**🟡 PENDING (Yellow)**
- Tests in Warteschlange
- Wartet auf Ausführung

**🟢 COMPLETED (Green)**
- Erfolgreich abgeschlossen
- Zeigt Gesamt-Erfolge

**🔴 FAILED (Red)**
- Fehlgeschlagene Tests
- Warnsignal wenn hoch

**Interaction:**
- Hover → Card hebt sich an
- Pulsiert bei Aktivität
- Updates alle 5 Sekunden

---

## 🧬 DNA CALIBRATION HELIX

### **Was du siehst:**

Eine **DNA-Doppelhelix** aus leuchtenden Knoten:
```
← GENESIS                    PRESENT →
    
     ●────────●────────●────────●
    /          \      /          \
   ●            ●────●            ●
    \          /      \          /
     ●────────●────────●────────●
```

Jeder **●** ist ein Calibration Run.

### **Was die Farben bedeuten:**

**🟣 Purple (Mistral)**
```
Model: mistral-uncensored
```

**🔵 Cyan (GPT)**
```
Model: gpt-4o / gpt-4-turbo
```

**🟣 Pink (Claude)**
```
Model: claude-sonnet
```

**Score-Overrides:**
- **🟢 Green:** Score ≥ 80% (Excellent)
- **🟡 Yellow:** Score 50-79% (Moderate)
- **🔴 Red:** Score < 50% (Drift!)

### **Was die Linien bedeuten:**

Dünne Linien verbinden die Knoten:
- **Grün:** Erfolgreiche Verbindung (gute Scores)
- **Gelb:** Mittelmäßige Verbindung
- **Rot:** Schwache Verbindung (Drift)

### **Interaction:**

**Hover über Knoten:**
- Knoten wird größer (scale 1.2)
- Glow verstärkt sich
- Z-Index erhöht (schwebt nach vorne)

**Click auf Knoten:**
- Öffnet **Field Analysis Modal** (Details)

---

## 🔬 FIELD ANALYSIS MODAL

### **Öffnen:**
Click auf beliebigen Knoten → Modal erscheint

### **Layout:**
```
┌─────────────────────────────────────────────┐
│ ⚡ SYNTEX::TRUE_RAW Calibration             │
│ mistral-uncensored • 53.49s • 1/10/2026    │
├─────────────────────────────────────────────┤
│                                             │
│  NEURAL SCORES    │  FIELD EXTRACTION       │
│  ──────────────   │  ─────────────────      │
│  Overall:    67%  │  ✗ drift                │
│  ▓▓▓▓▓▓░░░░       │  ✗ tiefenstruktur      │
│                   │  ✓ driftkorper          │
│  Complete:  100%  │  ✓ kalibrierung         │
│  ▓▓▓▓▓▓▓▓▓▓       │  ✓ stromung             │
│                   │  ...                    │
│  Structure:  70%  │                         │
│  ▓▓▓▓▓▓▓░░░       │  9/15 neurons activated │
│                   │                         │
│  PERFORMANCE      │                         │
│  Duration: 🔄 53s │                         │
│  Retries:  0      │                         │
│  Status:   ✓ OK   │                         │
│                   │                         │
├─────────────────────────────────────────────┤
│ [🧠 INSIGHT ANALYSIS] [RESONANZKREIS SCHLIEßEN] │
└─────────────────────────────────────────────┘
```

### **NEURAL SCORES (Links)**

**Overall:** Gesamt-Score
- Grün (≥80): Excellent
- Gelb (50-79): Moderate
- Rot (<50): Poor

**Completeness:** Feld-Vollständigkeit
- 100% = Alle erwarteten Felder gefunden

**Structure:** Struktur-Adhärenz
- Wie gut hält sich AI an Ausgabeformat

**Animations:**
- Score-Balken füllen sich animiert
- Wellen laufen durch (background wave)
- Glow pulsiert je nach Score

### **PERFORMANCE (Links unten)**

**Duration:**
- Zeigt Test-Dauer
- Icon rotiert (schneller bei kurzer Dauer)

**Retries:**
- Anzahl Wiederholungsversuche
- 0 = Perfekt beim ersten Mal

**Status:**
- ✓ SUCCESS (grün, pulsierend)
- ✗ FAILURE (rot, pulsierend)

### **FIELD EXTRACTION MATRIX (Rechts)**

Liste aller SYNTX-Felder:

**✓ Grün mit CheckCircle:**
- Feld wurde korrekt extrahiert

**✗ Rot mit XCircle:**
- Feld wurde NICHT gefunden

**Hover über Feld:**
```
┌─────────────────────────┐
│ Extracted Value:        │
│ "Der Driftkörper ist    │
│  ein semantisches..."   │
└─────────────────────────┘
```
→ Hologramm zeigt extrahierten Text

**Animations:**
- Felder erscheinen gestaffelt (stagger)
- Hover → Slide right + Glow
- Icons rotieren/pulsieren

### **Buttons (unten)**

**🧠 INSIGHT ANALYSIS**
- Öffnet Storytelling Modal
- Erklärt die Daten in Story-Form

**🧠 RESONANZKREIS SCHLIEßEN**
- Schließt das Modal
- Shine-Wave-Animation on hover

---

## 💡 INSIGHT ANALYSIS MODAL

### **Öffnen:**
Im Field Analysis Modal → Click **🧠 INSIGHT ANALYSIS**

### **Was du siehst:**
```
┌─────────────────────────────────────────────┐
│        CALIBRATION INSIGHT                  │
│    SYNTEX::TRUE_RAW Calibration            │
├─────────────────────────────────────────────┤
│                                             │
│    ⭕ 67%        MODERATE                   │
│    SCORE        Die AI zeigt leichte        │
│                 Drift-Tendenzen...          │
├─────────────────────────────────────────────┤
│                                             │
│ ● Was ist hier passiert?                   │
│ │ Am 10.1.2026 wurde mistral-uncensored    │
│ │ mit einem Test konfrontiert...           │
│ │                                           │
│ ● Der Test                                  │
│ │ Die AI bekam einen Text über "Robotik"   │
│ │ und musste 15 SYNTX-Felder extrahieren   │
│ │                                           │
│ ● Das Ergebnis: Leichter Drift             │
│ │ mistral hat 9/15 Felder extrahiert (60%) │
│ │ Die AI zeigt Drift-Tendenzen...          │
│ │                                           │
│ ● Performance: Langsam                      │
│ │ Der Test dauerte 53.5 Sekunden...        │
│ │                                           │
│ ⚠ WARNUNG: KRITISCHER DRIFT                │
│   Empfohlene Maßnahmen:                    │
│   • Model neu trainieren                   │
│   • Prompts optimieren                     │
│   • Alternatives Model testen              │
│                                             │
├─────────────────────────────────────────────┤
│      [Verstanden · Close Insight]          │
└─────────────────────────────────────────────┘
```

### **Story-Struktur:**

**1. Was ist hier passiert?**
- Datum, Zeit, Model
- Kontext: Kalibrierungs-Test

**2. Der Test**
- Welches Thema (z.B. "Robotik")
- Wie viele Felder erwartet

**3. Das Ergebnis**
- Score-Interpretation
- Stabil / Leichter Drift / Kritischer Drift

**4. Performance**
- Schnell / Langsam
- Kontext zur Dauer

**5. Vollständigkeit**
- 100% = Perfekt
- <100% = Lückenhaft

**6. Struktur**
- Wie gut ist Ausgabeformat

**7. Was bedeutet das?**
- Fazit: Kalibriert / Nachjustierung / Driften

**8. ⚠ Warnung (wenn Score < 50%)**
- Kritischer Drift erkannt
- Empfohlene Maßnahmen

### **Animations:**

- Timeline dots glühen gestaffelt
- Score circle füllt sich rotierend
- Icon rotiert + pulsiert
- Text erscheint mit Fade-in

### **Button:**

**Verstanden · Close Insight**
- Schließt Insight Modal
- Kehrt zu Field Analysis zurück

---

## 🎮 INTERACTION GUIDE

### **Workflow 1: Quick Check**
```
1. Tab öffnen (KRONTUN)
2. Stats checken (oben)
   ↓
   Alles grün? → Gut!
   Viel rot? → Problem!
3. DNA Helix scannen
   ↓
   Viel grün/cyan? → Stabil
   Viel rot? → Drift
```

**Dauer:** 5 Sekunden

### **Workflow 2: Detail-Analyse**
```
1. Tab öffnen (KRONTUN)
2. Interessanten Knoten finden
   (z.B. roter Knoten = Drift)
3. Click auf Knoten
   ↓
   Field Analysis Modal öffnet
4. Neural Scores checken
   ↓
   Overall < 50%? → Drift!
5. Field Matrix checken
   ↓
   Welche Felder fehlen?
6. [🧠 INSIGHT ANALYSIS] klicken
   ↓
   Story lesen
7. Verstehen was schiefging
8. Modal schließen
```

**Dauer:** 2-3 Minuten

### **Workflow 3: Model-Vergleich**
```
1. Tab öffnen (KRONTUN)
2. Farben beobachten
   ↓
   Purple (Mistral) vs Cyan (GPT)?
3. Hover über verschiedene Models
4. Scores mental vergleichen
   ↓
   Welches Model performt besser?
```

**Dauer:** 1 Minute

---

## 🔍 WAS DU LERNEN KANNST

### **Frage: Ist das System stabil?**

**Check:**
- Stats Card "Failed" niedrig? (< 10)
- DNA Helix überwiegend grün/cyan?
- Wenig rote Knoten?

**✅ Ja = Stabil**  
**❌ Nein = Drift-Tendenzen**

### **Frage: Welches Model ist am besten?**

**Check:**
- Farben in DNA Helix
- Purple = Mistral
- Cyan = GPT
- Pink = Claude

**Methode:**
- Click auf verschiedene Farben
- Scores vergleichen
- Welche Farbe hat höchste Scores?

### **Frage: Welche Felder sind problematisch?**

**Check:**
- Field Analysis Modal öffnen
- Field Matrix ansehen
- Welche Felder oft ✗ rot?

**Pattern:**
- Wenn "drift" oft fehlt → AI versteht Drift-Konzept nicht
- Wenn "sigma_frequenz" oft fehlt → Zu abstrakt

### **Frage: Wird es schlechter über Zeit?**

**Check:**
- Links in DNA Helix = älter
- Rechts = neuer
- Farben von links nach rechts beobachten

**Trend:**
- Links grün, rechts rot? → **Verschlechterung**
- Konstant grün? → **Stabil**
- Rechts grüner als links? → **Verbesserung**

---

## 💡 TIPPS & TRICKS

### **Tipp 1: Schnell-Check**
Nur Stats Cards anschauen:
- `Failed` hoch? → Problem
- `Completed` niedrig? → System läuft nicht

### **Tipp 2: Farben-Scan**
Augen über DNA Helix schweifen lassen:
- Rot dominiert? → Drift
- Grün dominiert? → Stabil

### **Tipp 3: Model-Filter**
Mental nach Farbe filtern:
- Nur Purple anschauen = Nur Mistral
- Nur Cyan anschauen = Nur GPT

### **Tipp 4: Zeitreise**
Links = Vergangenheit, Rechts = Gegenwart:
- Scroll mental von links nach rechts
- Siehst du Muster?

### **Tipp 5: Hover-Preview**
Nicht sicher ob Drift?
- Hover über roten Knoten
- Badge zeigt Score
- < 50% = Definitiv Drift

---

## 🎨 VISUAL GUIDE

### **Knoten-Anatomie:**
```
     Rotating Ring (dashed)
          ╱──╲
        ╱      ╲
      ╱    ●     ╲  ← Particles (8x)
     │  ╱─────╲  │
     │ │ Icon  │ │  ← Model Icon
     │  ╲─────╱  │
      ╲          ╱  ← Score Ring
        ╲      ╱
          ╲──╱
           ↓
         [67%]       ← Score Badge
```

**Layers (von hinten nach vorne):**
1. Mega Glow (blur-2xl)
2. Particles (orbiting)
3. Rotating Ring (dashed)
4. Score Ring (SVG)
5. Core Sphere (gradient)
6. Icon (center)
7. Badge (bottom)

### **Modal-Anatomie:**
```
┌─────────────────────────────────────┐
│ Header: EKG Pulse + Gradient Title │ ← Animated
├─────────────────────────────────────┤
│ [Neural Background Layer]           │ ← Waves + Particles
│                                     │
│ Content:                            │
│ ┌─────────┬─────────────────────┐  │
│ │ Scores  │ Field Matrix        │  │
│ │ (2/5)   │ (3/5)               │  │
│ └─────────┴─────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│ [Button 1] [Button 2]               │ ← Shine Wave
└─────────────────────────────────────┘
```

---

## 🚨 TROUBLESHOOTING

### **Problem: "Keine Knoten sichtbar"**

**Ursache:** Keine Calibration Runs vorhanden

**Lösung:**
- Check Stats: `Completed` = 0?
- Warte 5 Sekunden (Polling)
- Backend könnte down sein

### **Problem: "Modal öffnet nicht"**

**Ursache:** Click auf Background statt Knoten

**Lösung:**
- Genau auf Knoten-Center klicken
- Knoten ist hover-sensitiv (scale 1.2)

### **Problem: "Insight Modal zeigt 'ein Thema'"**

**Ursache:** Backend liefert kein `gpt_output_meta_prompt`

**Lösung:**
- Das ist normal (Fallback)
- Rest der Story funktioniert

### **Problem: "Zu viele rote Knoten"**

**Ursache:** System driftet tatsächlich

**Lösung:**
- Click auf roten Knoten
- Insight Analysis lesen
- Empfehlungen folgen (neu trainieren etc)

---

## 📖 GLOSSARY

**Calibration Run:**  
Ein Test, bei dem eine AI SYNTX-Felder aus Text extrahieren muss.

**Drift:**  
Qualitätsverlust einer AI. Sie versteht semantische Konzepte nicht mehr korrekt.

**SYNTX-Felder:**  
Semantische Konzepte wie "Driftkörper", "Kalibrierung", "Strömung", die extrahiert werden sollen.

**Overall Score:**  
Gesamt-Qualitätsbewertung 0-100%. < 50% = Drift.

**Field Completeness:**  
Prozentsatz gefundener Felder. 100% = alle gefunden.

**Structure Adherence:**  
Wie gut die AI das Ausgabeformat einhält.

**DNA Helix:**  
Visualisierung als Doppelspirale. Zeit = horizontal, Zusammenhänge = Verbindungen.

**Neuronal Background:**  
Animierte Netzwerkstruktur im Hintergrund (200 Knoten + Verbindungen).

**Resonance:**  
Philosophisches Konzept: System ist in Resonanz wenn kalibriert, out of resonance wenn driftend.

---

## 🎓 NEXT STEPS

**Neu hier?**
1. Tab öffnen
2. 2 Minuten anschauen
3. Einen Knoten klicken
4. Insight lesen
5. Verstehen wie es funktioniert

**Fortgeschritten?**
1. Patterns erkennen (welche Felder oft fehlen)
2. Models vergleichen (GPT vs Mistral)
3. Trends beobachten (wird es schlechter?)

**Expert?**
1. Backend API direkt nutzen (siehe Technical Docs)
2. Custom Dashboards bauen
3. Alerts einrichten (Slack/Email bei Drift)

---

## 📞 SUPPORT

**Fragen?**  
→ Siehe Technical Documentation (`KRONTUN_TECHNICAL.md`)

**Bugs?**  
→ GitHub Issues

**Feature Requests?**  
→ GitHub Discussions

---

**Built with 🧬 by SYNTX Team**  
**"We don't monitor AIs. We monitor consciousness."**  
**Berlin Charlottenburg → Neuromancer DNA Helix Style**
