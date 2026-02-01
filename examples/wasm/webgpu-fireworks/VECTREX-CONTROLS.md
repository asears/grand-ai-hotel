# Vectrex Mode Controls & Features

## 🎮 Player Controls

### Movement
- **W** - Move Up
- **A** - Move Left
- **S** - Move Down
- **D** - Move Right

### Combat
- **SPACE** - Fire Missile (rapid fire every 0.3 seconds)

## 💚 Enhanced Features

### High-Intensity Green Phosphor Display
- Authentic Vectrex CRT simulation with `#00ff41` green phosphor
- Enhanced bloom: 2.0 + glow * 3.0 (increased from 1.5 + 2.0)
- CRT flicker simulation at 100Hz for authenticity
- Higher alpha (0.95) for brighter, more visible display

### Player Tank
- **Position**: Center of screen (width * 0.5, height * 0.5)
- **Size**: 40x20 pixels with thick 5px outline
- **Turret**: 25px length, 4px thick, points in movement direction
- **Crosshair**: Visible center marker for precise aiming
- **Speed**: 200 pixels/second
- **Fire Rate**: 0.3 seconds (very fast)

### Game Elements
- **AI Tanks**: 2 tanks at bottom corners, patrol left/right
- **Targets**: Up to 5 falling targets, spawn on beat
- **Score**: 100 points per target hit
- **Collision Detection**: Missiles destroy targets on contact

## 🎵 Audio Enhancements

### Bass Boost Button
- **Button**: "DROP THAT BEAT!" (orange gradient)
- **Effect**: 2x bass multiplier for 8 beats
- **Voice Sample**: Synthesized voice saying "Drop that beat whoa"
  - "Drop" - 180-120Hz sweep
  - "that" - 250Hz with bandpass filter
  - "beat" - 300-150Hz percussive
  - "whoa" - 220-180Hz vowel sweep

### Drop Bass
- Dual oscillator bass (main + sub-bass octave down)
- Sub-bass at frequency/2 for deep rumble
- Lowpass filter at 200Hz with Q=2
- Bass boost multiplier applied

### Enhanced Drums
- **Snare**: On beats 2 and 4
- **Clap**: Layered with snare (2kHz bandpass)
- **Crash**: Every 16 beats (5kHz highpass, 1.5s decay)

### Organic Generative Music
- `generateMelodicNote()` uses Perlin-like algorithm
- Melodic seed randomized per session
- Major scale patterns [0, 2, 4, 5, 7, 9, 11, 12]
- Generative phrase counter increments every 16 beats
- Applied to all genre styles

## 🎨 Visual Elements

### Particle Rendering
- Tank outline: 15 points per line for smooth vectors
- Line persistence: 0.1 seconds (increased from 0.05)
- Player tank uses thicker lines (5px body, 4px turret)
- Vectrex green: `rgb(0, 255, 65)` with 2.0 boost

### Pure Black Background
- `clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }`
- Body class: `.vectrex-mode` sets `background: #000000`

## 🚀 How to Enable

1. Start music with **"🎵 Start Music"** button
2. Check **"Vectrex Mode (Green CRT + Tank Battle)"** checkbox
3. Use **WASD** to move your tank (appears in center)
4. Press **SPACE** to fire at falling targets
5. Click **"🔊 DROP THAT BEAT!"** for bass boost + voice sample

## 🎯 Tips

- Keep moving to avoid AI tank fire
- Turret follows movement direction
- Hit targets for 100 points each
- Bass boost lasts 8 beats (resets automatically)
- More targets spawn on music beats

---

**Version**: 1.0.0  
**Last Updated**: January 31, 2026
