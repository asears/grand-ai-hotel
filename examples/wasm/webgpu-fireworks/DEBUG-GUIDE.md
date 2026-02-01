# WebGPU Fireworks Debug Guide

## 🔍 Diagnostic Tools Overview

This document describes the debug and diagnostic tools available for troubleshooting the WebGPU fireworks renderer.

---

## 1️⃣ Particle Logic Test (Node.js)

**File:** `test-particle-logic.js`

**Purpose:** Verify particle spawning logic WITHOUT rendering

**Run:**
```bash
node test-particle-logic.js
```

**What it tests:**
- ✅ Particles spawn correctly
- ✅ Particles have velocity
- ✅ Pool utilization and exhaustion
- ✅ Normal vs Vectrex mode differences

**Expected output:**
```
✅ PASS: Fireworks are spawning correctly
✅ PASS: Particles have velocity (will move when rendered)
✅ PASS: Particle system logic is working
```

---

## 2️⃣ Simple Render Test (Canvas2D)

**File:** `test-render-debug.html`

**Purpose:** Verify basic rendering with Canvas2D (fallback test)

**Open:** `http://localhost:5175/test-render-debug.html`

**What it shows:**
- Green particles spawning and animating
- Real-time debug console
- Click to spawn fireworks
- Auto-spawn every 2 seconds

**Expected behavior:**
- See green dots moving on black background
- Console shows particle counts
- Clicking spawns bursts at mouse position

---

## 3️⃣ WebGPU Debug Console (Browser)

**File:** `main.js` (exposes `window.debugFireworks`)

**Open main app, then use browser console:**

### Available Commands:

#### Get Particle Statistics
```javascript
debugFireworks.getParticleStats()
```
Shows:
- Total particles
- Alive vs dead
- Vectrex vs regular
- Pool utilization %
- Emitters count
- Music notes count

#### Take Manual Screenshot
```javascript
debugFireworks.screenshot('my-test')
// Downloads: webgpu-my-test-particles123.png
```

#### Enable Auto Screenshots
```javascript
debugFireworks.enableAutoScreenshots(60, 10)
// Every 60 frames (1 sec), max 10 screenshots
```

#### Disable Auto Screenshots
```javascript
debugFireworks.disableAutoScreenshots()
```

#### Spawn Test Firework
```javascript
debugFireworks.spawnTestFirework()
// Spawns firework + auto-screenshot after 100ms
```

#### Dump Particle Data
```javascript
debugFireworks.dumpParticles(10)
// Shows first 10 alive particles in console table
```

---

## 4️⃣ UI Debug Buttons

**Location:** Bottom of control panel (left side of screen)

### 📸 Screenshot Now
- Takes immediate screenshot
- Filename: `webgpu-manual-TIMESTAMP-particlesN.png`
- Downloads automatically

### 🎬 Auto Screenshots (1/sec)
- Toggle button (green when active, red when recording)
- Captures 1 frame per second
- Max 10 screenshots
- Auto-downloads to Downloads folder

### 🎆 Spawn Test Firework
- Forces firework spawn at screen center
- Takes screenshot 200ms later
- Logs spawn details to console

---

## 5️⃣ Enhanced FPS Display

**Location:** Top of control panel

**Shows:**
```
FPS: 60 | Particles: 547 (V:183 R:364)
```

- `FPS`: Frames per second
- `Particles`: Total alive
- `V`: Vectrex mode particles (green phosphor)
- `R`: Regular colored particles

---

## 🧪 Diagnostic Workflow

### Problem: "Fireworks not showing"

1. **Check particle logic:**
   ```bash
   node test-particle-logic.js
   ```
   Expected: ✅ All tests pass

2. **Check basic rendering:**
   Open `http://localhost:5175/test-render-debug.html`
   Expected: ✅ See green particles moving

3. **Check WebGPU particle counts:**
   ```javascript
   debugFireworks.getParticleStats()
   ```
   Expected: `alive > 0` after a few seconds

4. **Force spawn and capture:**
   ```javascript
   debugFireworks.spawnTestFirework()
   ```
   Expected: 
   - Console: "Manually spawned firework: 100 particles"
   - Download: Screenshot showing particles
   - If screenshot is BLACK → renderer issue
   - If screenshot has particles → working!

5. **Enable auto-capture for analysis:**
   ```javascript
   debugFireworks.enableAutoScreenshots(30, 5)
   ```
   Wait 5 seconds, check Downloads for 5 screenshots

6. **Analyze screenshots:**
   - All black → WebGPU not rendering
   - Particles visible → System working
   - Only tank/notes visible → Fireworks pool exhausted

---

## 📸 Screenshot Filename Format

```
webgpu-debug-frame180_particles547_vectrex183.png
         ^^^^^ ^^^^^^^ ^^^^^^^^^^^^ ^^^^^^^^^^
         |     |       |            |
         |     |       |            Vectrex particle count
         |     |       Total alive particles
         |     Frame number
         Prefix
```

**Manual screenshots:**
```
webgpu-manual-2026-02-01T14-30-45-particles123.png
webgpu-my-label-particles456.png
```

---

## 🐛 Common Issues & Solutions

### Issue: "No screenshots downloading"
**Solution:** Check browser download settings, allow pop-ups

### Issue: "All screenshots are black"
**Diagnosis:** WebGPU rendering pipeline broken
**Next step:** Check browser console for WebGPU errors

### Issue: "Very few particles alive"
**Diagnosis:** Pool exhaustion (tank/notes consuming all)
**Solution:** Check particle counts, reduce static element draw frequency

### Issue: "Particles alive but not moving"
**Diagnosis:** Velocity not being applied
**Next step:** Run `debugFireworks.dumpParticles(5)` to check vx/vy values

---

## 📊 Expected Particle Behavior

### Normal Mode (vectrexMode: false)
- Alive particles: 200-600
- Spawn rate: Every 0.3-1.2s
- Colors: Rainbow (various r/g/b values)

### Vectrex Mode (vectrexMode: true)
- Alive particles: 100-300
- Spawn rate: Every 2-4s (slower)
- Colors: Green only (r=0, g=2.0, b=0.25)

### With Tank + Music Notes
- Alive particles: 300-800 (higher due to static elements)
- Vectrex particles: Higher percentage
- Regular particles: May be lower (tank/notes consume pool)

---

## 🎯 Success Criteria

✅ **Logic test passes** (test-particle-logic.js)  
✅ **Canvas2D test shows particles** (test-render-debug.html)  
✅ **WebGPU stats show alive > 0** (debugFireworks.getParticleStats())  
✅ **Screenshots show visible particles** (not all black)  
✅ **FPS display shows particle counts** (FPS: 60 | Particles: 547)  
✅ **Test firework spawns correctly** (debugFireworks.spawnTestFirework())  

---

## 🔧 Developer Notes

**Particle pool size:** 1000-5000 (adjustable in UI)

**Frame skipping (optimization):**
- Tank elements: Drawn every 5 frames
- Music notes: Drawn every 3 frames
- Fireworks: Every frame (dynamic)

**Particle persistence:**
- Fireworks: 1.5-4.5s
- Tank lines: 0.5s
- Music notes: 0.4s

**Screenshot limits:**
- Auto-capture: Max 10 (prevent disk spam)
- Manual: Unlimited

---

## 📞 Quick Reference Commands

```javascript
// Basic diagnostics
debugFireworks.getParticleStats()        // Show stats
debugFireworks.dumpParticles(10)         // Show particle data

// Testing
debugFireworks.spawnTestFirework()       // Force spawn + screenshot
debugFireworks.screenshot('test-1')      // Manual screenshot

// Automated capture
debugFireworks.enableAutoScreenshots(30, 5)   // 30 frames, 5 max
debugFireworks.disableAutoScreenshots()       // Stop

// UI Buttons (click)
📸 Screenshot Now
🎬 Auto Screenshots (1/sec)
🎆 Spawn Test Firework
```

---

**Last Updated:** February 1, 2026  
**Version:** 1.0.0  
**Status:** Active Development
