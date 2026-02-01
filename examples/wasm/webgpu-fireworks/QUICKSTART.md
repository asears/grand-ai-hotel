# WebGPU Fireworks - Quick Start

## Install & Run (Windows PowerShell)

```powershell
# Navigate to project
cd C:\projects\ai\copilot\examples\wasm\webgpu-fireworks

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open **Chrome 113+** or **Edge 113+** and visit: `http://localhost:5173/`

---

## What You Get

✨ **GPU-accelerated fireworks** with up to 5000 particles at 60 FPS  
🎵 **Alan Walker-style music** synthesized in real-time  
🎮 **Interactive controls** for intensity, gravity, and particle count  
🎯 **Beat-synchronized** firework spawning  

---

## Browser Requirement

**⚠️ IMPORTANT:** Requires **Chrome 113+** or **Edge 113+** for WebGPU support.

Check support: Open browser console and type:
```javascript
navigator.gpu ? '✅ Supported' : '❌ Not Supported'
```

---

## Controls

- **Intensity Slider**: Control spawn rate (1-100)
- **Particle Count Slider**: Total particles (100-5000)
- **Gravity Slider**: Particle fall speed (0-2)
- **Start Music Button**: Toggle procedural music
- **Volume Slider**: Audio level (0-100)
- **Reset Button**: Clear and restart simulation

---

## Troubleshooting

**Music not playing?**
- Click "Start Music" button
- Check browser isn't muted
- Refresh the page

**Low FPS?**
- Reduce particle count to 1000-2000
- Lower intensity to 25-50
- Update GPU drivers

**WebGPU error?**
- Use Chrome 113+ or Edge 113+
- Enable hardware acceleration in browser settings
- Update to latest browser version

---

**For complete documentation, see [SETUP.md](./SETUP.md)**
