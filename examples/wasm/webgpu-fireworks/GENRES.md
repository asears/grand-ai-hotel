# 🎵 Genre Quick Reference

## Quick Comparison

| Artist | BPM | Energy | Bass | Style | Best For |
|--------|-----|--------|------|-------|----------|
| 🎹 Alan Walker | 128 | ⭐⭐⭐⭐ | Medium | Melodic EDM | Emotional moments |
| 🌅 Avicii | 125 | ⭐⭐⭐⭐⭐ | Medium | Festival | Celebrations |
| 🤖 Daft Punk | 120 | ⭐⭐⭐ | Funky | Robotic | Retro vibes |
| 🐭 Deadmau5 | 127 | ⭐⭐⭐ | Deep | Progressive | Hypnotic |
| 🌴 Kygo | 110 | ⭐⭐ | Soft | Tropical | Chill sessions |
| 💥 Skrillex | 140 | ⭐⭐⭐⭐⭐ | HEAVY | Dubstep | Maximum energy |
| 🔩 NIN | 120 | ⭐⭐⭐⭐⭐ | Harsh | Industrial | Dark/intense |
| ⚡ Justice | 125 | ⭐⭐⭐⭐ | Distorted | Electro | Party mode |

---

## Sound Characteristics

### 🎹 Alan Walker (Progressive House)
**Signature Sound:**
- Pluck synth leads with filter sweeps
- Emotional chord progressions (minor keys)
- Atmospheric pads and reverb
- Clean, polished production

**Key Elements:**
- BPM: 128
- Key: Usually minor (A minor, E minor)
- Drums: 4-on-the-floor kick, crisp hats
- Bass: Deep sub-bass (sine wave)

**Recommended Settings:**
- Intensity: 50-70
- Particles: 1500-2500
- Gravity: 0.5-0.7

---

### 🌅 Avicii (Euphoric House)
**Signature Sound:**
- Uplifting melodies and major chords
- Triangle wave for smooth, warm leads
- High energy, festival-ready
- Emotional builds and drops

**Key Elements:**
- BPM: 125
- Key: Major scales (C major, G major)
- Drums: Strong kick, 1.2x intensity
- Bass: C2 root note (65.41 Hz)

**Recommended Settings:**
- Intensity: 70-90
- Particles: 2000-3000
- Gravity: 0.4-0.6

---

### 🤖 Daft Punk (French House)
**Signature Sound:**
- Square wave synthesizers (robotic)
- Funky, groovy basslines
- Talk box simulation
- Retro 80s influence

**Key Elements:**
- BPM: 120
- Drums: Funky patterns, half-time kicks
- Bass: Funky, syncopated
- Leads: Square wave, filtered

**Recommended Settings:**
- Intensity: 40-60
- Particles: 1000-2000
- Gravity: 0.3-0.5

---

### 🐭 Deadmau5 (Progressive)
**Signature Sound:**
- Long, progressive builds
- Minimal percussion
- Deep, hypnotic basslines
- Clean, precise production

**Key Elements:**
- BPM: 127
- Drums: Minimal, sparse hats
- Bass: Deep sub-bass
- Progression: Slow chord changes

**Recommended Settings:**
- Intensity: 30-50
- Particles: 1500-2500
- Gravity: 0.6-0.8

---

### 🌴 Kygo (Tropical House)
**Signature Sound:**
- Soft sine wave melodies
- Tropical vibes, steel drums simulation
- Warm, summery atmosphere
- Relaxed tempo

**Key Elements:**
- BPM: 110
- Key: Major 7th chords (warm)
- Drums: Soft kick, laid-back
- Bass: Smooth C2 bass

**Recommended Settings:**
- Intensity: 30-50
- Particles: 1000-1500
- Gravity: 0.3-0.5

---

### 💥 Skrillex (Dubstep/Brostep)
**Signature Sound:**
- **WOBBLE BASS** (8 Hz LFO, Q=15)
- Laser shot frequency sweeps
- Aggressive drops and builds
- Neon green branding

**Key Elements:**
- BPM: 140
- LFO: 8 Hz wobble modulation
- Filter: Lowpass with extreme Q
- Drums: Heavy kick (1.3x), snare on 2 & 4

**VST Effects:**
```javascript
Wobble Bass:
  - LFO rate: 8 Hz
  - Filter Q: 15 (high resonance)
  - Frequency: 500 Hz ± 2000 Hz

Laser Shots:
  - Frequency: 2000 Hz → 100 Hz
  - Duration: 0.2 seconds
  - Wave: Square
```

**Recommended Settings:**
- Intensity: 80-100
- Particles: 3000-5000
- Gravity: 0.8-1.2
- **Enable Vectrex Mode for full effect**

---

### 🔩 Nine Inch Nails (Industrial)
**Signature Sound:**
- Heavy distortion (wave shaping)
- Industrial noise bursts
- Harsh, mechanical textures
- Dark, aggressive atmosphere

**Key Elements:**
- BPM: 90-140 (irregular)
- Drums: Non-standard patterns (mod 7)
- Distortion: Amount = 50
- Noise: Gated bursts (30% chance)

**VST Effects:**
```javascript
Distortion:
  - Curve: ((3 + 50) * x * 20) / (π + 50 * |x|)
  - Type: Wave shaping

Industrial Noise:
  - Duration: 0.1 seconds
  - Gate: Random 30% trigger
  - Filter: None (raw noise)
```

**Recommended Settings:**
- Intensity: 60-80
- Particles: 2000-3000
- Gravity: 0.7-1.0
- Colors: Dark palette

---

### ⚡ Justice (Electro House)
**Signature Sound:**
- Distorted sawtooth synths
- Electro stabs (filtered chord hits)
- French electro groove
- Red/black aesthetic

**Key Elements:**
- BPM: 125
- Distortion: Amount = 30
- Electro Stabs: A minor chord, 0.1s duration
- Filter: Lowpass 1500 Hz, Q=5

**VST Effects:**
```javascript
Distorted Synth:
  - Wave: Sawtooth
  - Distortion: Amount = 30
  - Pattern: [0, 5, 7, 12] semitones

Electro Stabs:
  - Chord: A minor (220, 277.18, 329.63 Hz)
  - Filter: Lowpass 1500 Hz, Q=5
  - Duration: 0.1 seconds
```

**Recommended Settings:**
- Intensity: 70-90
- Particles: 2500-3500
- Gravity: 0.5-0.7

---

## Genre Switching Tips

### Smooth Transitions
1. **Lower Intensity** before switching genres
2. **Wait for current beat cycle** to complete (every 16 beats)
3. **Adjust tempo** gradually for BPM changes
4. **Reset simulation** for clean start

### Best Genre Combinations (DJ Set Style)

**Progressive Journey:**
```
Kygo (110) → Deadmau5 (127) → Alan Walker (128) → Avicii (125)
```

**High Energy Set:**
```
Daft Punk (120) → Justice (125) → Skrillex (140)
```

**Dark to Light:**
```
NIN (120) → Deadmau5 (127) → Alan Walker (128) → Kygo (110)
```

---

## Audio Reactive Features by Genre

| Genre | Beat Sync | Bass React | Wobble | Distortion |
|-------|-----------|------------|--------|------------|
| Alan Walker | ✅ High | Medium | ❌ | ❌ |
| Avicii | ✅ High | Medium | ❌ | ❌ |
| Daft Punk | ✅ Medium | High | ❌ | Low |
| Deadmau5 | ✅ Low | High | ❌ | ❌ |
| Kygo | ✅ Low | Low | ❌ | ❌ |
| Skrillex | ✅ High | EXTREME | ✅ | ❌ |
| NIN | ✅ Medium | High | ❌ | ✅ High |
| Justice | ✅ High | High | ❌ | ✅ Medium |

---

## Performance Impact

### CPU Usage (Audio Synthesis)
```
Kygo       ▁▁▁▁▁ 8%
Deadmau5   ▁▁▁▁▁ 8%
Alan Walker▂▂▂▂▂ 10%
Avicii     ▂▂▂▂▂ 10%
Daft Punk  ▃▃▃▃▃ 12%
Skrillex   ▅▅▅▅▅ 15% (LFO + filters)
Justice    ▆▆▆▆▆ 16% (distortion)
NIN        ▇▇▇▇▇ 18% (distortion + noise)
```

### GPU Usage (Visual Effects)
- All genres use same particle system
- Vectrex mode adds ~5% GPU load
- Trails add ~5-10% depending on count

---

## Easter Eggs

### Hidden Features
1. **Vectrex Random Mode**: Even without checkbox, 15% chance per burst
2. **Audio Wobble**: Particle size wobbles with Skrillex bass
3. **Beat Indicator**: Pulses on kick drum hits
4. **Genre Colors**: Change automatically based on frequency analysis

### Keyboard Shortcuts (If Implemented)
- `Space`: Pause/Resume
- `V`: Toggle Vectrex Mode
- `T`: Toggle Trails
- `R`: Reset Simulation
- `1-8`: Quick genre select

---

**Pro Tip:** For the most intense experience, select **Skrillex**, enable **Vectrex Mode**, set particles to **5000**, and intensity to **100**. Prepare for sensory overload! 💥

---

**Last Updated:** January 31, 2026  
**Total Genres:** 8  
**Total VST Effects:** 5
