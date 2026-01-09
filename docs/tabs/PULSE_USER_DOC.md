# 🌊 SYNTX::PULSE PANEL — OFFIZIELLE SYSTEMDOKU  
## STRASSENMODUS. SYSTEMLEVEL. KIEZSPRACHE.  
Version: 1.0 | Style: TRUE_RAW | Status: KRITISCH AKTIVIERT

---

## 🔥 WAS IST DAS PULSE PANEL?

> „Digga, das ist das Nervensystem von deinem ganzen System.  
> Wenn das flackert, weißt du, ob der Rest noch lebt.“  

Das **SYNTX::PULSE PANEL** zeigt dir in Echtzeit den inneren Zustand deiner gesamten SYNTX-Maschine.  
Jede Anzeige basiert auf echten Daten vom Backend – nix ist gefaked.  
Es ist nicht für den Style da, es **IST der Zustand**.

---

## 🧠 PANEL-TEILE IM ÜBERBLICK

Das Dashboard besteht aus 4 Hauptzonen:  
1. **SYSTEM CORE (Mitte)**  
2. **RESONANZFELDER (Links)**  
3. **LIVE QUEUE TOWER (Zentrum)**  
4. **RECENT COMPLETED (Rechts)**  

Jede Zone ist eine **Sensorfläche**, die auf Bewegung im System reagiert.  
Jetzt kommt **jeder Teil mit Bedeutung**.

---

## ❤️ 1. SYSTEM CORE (ZENTRUM MITTE)

### 🧩 Komponente: `SystemCoreCircle.tsx`

Zeigt:
- **Zustand:** `KRITISCH`, `GESUND`, `INSTABIL`, `RESONANT`
- API-Datenquelle: `/api/strom/health`
- Animation: pulsierender Kreis mit Text-Inlay

### 🧠 Bedeutung:

- Wenn’s **KRITISCH** steht → dein System hat zu viel Stress, z. B. hohe Queue, Drift, viele Fehler
- Wenn’s **RESONANT** blinkt → das System läuft im Flow. Alles abgestimmt, keine Spannung.
- Die Pulsfrequenz = Aktivitätsrate

💡 Das Ding ist dein Herz. Wenn das nicht schlägt, bist du raus.

---

## 🧊 2. RESONANZFELDER (LINKE SPALTE)

### 🧩 Komponente: `ResonanceFieldGroup.tsx`  
Besteht aus 3 Einzelcards:

#### 🟥 (a) FIELD: QUEUE  
- incoming vs. processed  
- Farbe: ROT = Drift  
- Resonanzstatus: `"DRIFT"` oder `"STABIL"`  
- Daten von: `/api/strom/resonanz/system`

🧠 Bedeutung:  
Wenn hier zu viel reinströmt und nix rausgeht → Stau, System blockiert, dein Modell kriegt Stress.  
Das ist wie Daten-Stress: rein – aber nix wird verarbeitet.

---

#### 🟧 (b) FIELD: QUALITÄT  
- durchschnittliche Modellqualität  
- Score z. B. 40.6 %  
- Resonanzstatus: `"DRIFT"` = semantischer Drift, `"AKTIV"` = alles okay

🧠 Bedeutung:  
Wenn hier niedrig steht → dein Modell trifft daneben. Bedeutungen weichen ab.  
Das ist semantische **Resonanz-Entkopplung**.

---

#### 🟦 (c) FIELD: EVOLUTION  
- Gen Count = wie oft Prompts neu generiert wurden  
- Farbe: CYAN → `AKTIV`  
- API: `/api/strom/resonanz/system`

🧠 Bedeutung:  
Wenn die Zahl hochgeht, entwickelt sich dein Prompt-Strom dynamisch.  
Aber: zu viele Gen-Sprünge = Instabilität. Zu wenige = Stagnation.

---

## 🏗️ 3. LIVE QUEUE TOWER (MITTE UNTEN)

### 🧩 Komponente: `LiveQueueStats.tsx`

Visualisiert:
- Incoming (cyan)
- Processing (grau)
- Processed (grün)
- Errors (rot)

### Daten:  
- Direkt aus `/api/strom/monitoring/live-queue`

### 🧠 Bedeutung:
- **Incoming**: wie viele Jobs gerade anstehen  
- **Processing**: was in der Mangel steckt  
- **Processed**: was sauber raus ist  
- **Errors**: was gefailt hat

Wenn Incoming > 80 → Stress im System.  
Wenn Errors > 20 → Modellinstabilität, eventuell Drift durch kaputte Felder.

Das ist dein **Live-Blutdruckmesser**.

---

## 🧾 4. RECENT COMPLETED JOBS (RECHTS)

### 🧩 Komponente: `JobHistoryList.tsx` + `JobCard.tsx`

Zeigt:
- Letzte 10 Jobs, die durch das System liefen
- Score (1–100) = qualitative Bewertung
- Farbcodiert:
  - 70+ → grün (stark)
  - 60–70 → türkis (ok)
  - <60 → orange oder rot (Drift-Alarm)

### 🧠 Bedeutung:

Das ist dein **Gedächtnisbereich**.  
Hier siehst du, wie dein System performt – nicht im Durchschnitt, sondern konkret.

Wenn viele Jobs **unter 60** → Warning!  
Da stimmt was nicht mit Feldern, Wrappers oder Stromrichtung.

---

## 🎛 CONTROL PANEL (OBEN)

### Buttons:
- `Auto Drift`: Aktiviert / Deaktiviert automatische Drift-Kalibrierung
- `Refresh`: Forciert neuen Backend Call
- `Export`: Exportiert aktuellen Status als Snapshot

💡 Wichtig für Systemdiagnostik & Debugging.  
`Auto Drift` aktiviert systemische Reaktionslogik. Wenn aus → manuelle Steuerung.

---

## 🔚 FAZIT DER STRASSE

> „Der Pulse Tab ist nicht Deko – der is’ dein Spiegel, dein Herz, dein Gedächtnis.  
> Wenn du hier reinschaust und nix fühlst, dann bist du nicht drin im System.“  

Jede Komponente ist ein Resonanz‑Sensor.  
Was du siehst, ist, wie dein System denkt, atmet, leidet oder heilt.

Wenn du den Pulse checkst –  
**checkt der Pulse auch dich.**

SYNTX lebt, Bruder.  
Und dieser Tab?  
Das ist sein Beat.


