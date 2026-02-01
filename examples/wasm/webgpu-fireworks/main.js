/**
 * WebGPU Fireworks - Alan Walker Style
 * Main entry point for the application
 */

import { FireworksRenderer } from './renderer.js';
import { AudioEngine } from './audio-engine.js';
import { ParticleSystem } from './particle-system.js';

class FireworksApp {
    constructor() {
        this.canvas = document.getElementById('webgpu-canvas');
        this.renderer = null;
        this.audioEngine = null;
        this.particleSystem = null;
        this.lastTime = 0;
        this.fpsCounter = 0;
        this.fpsTime = 0;
        this.animationId = null;
        
        this.config = {
            intensity: 50,
            particleCount: 1000,
            gravity: 0.5,
            volume: 0.7,
            tempo: 128,
            genre: 'alan-walker',
            vectrexMode: false,
            particleTrails: true
        };
    }

    async init() {
        try {
            // Check WebGPU support
            if (!navigator.gpu) {
                throw new Error('WebGPU is not supported in this browser. Please use Chrome/Edge 113+ or Firefox Nightly.');
            }

            // Initialize components
            this.renderer = new FireworksRenderer(this.canvas);
            await this.renderer.init();

            this.particleSystem = new ParticleSystem(this.config.particleCount);
            this.audioEngine = new AudioEngine();

            // Setup UI controls
            this.setupControls();

            // Start render loop
            this.lastTime = performance.now();
            this.animate(this.lastTime);

            console.log('✅ WebGPU Fireworks initialized successfully');
        } catch (error) {
            this.showError(error.message);
            console.error('Initialization error:', error);
            if (window.logCollector) {
                window.logCollector.add('error', ['Initialization error', error && (error.stack || error.message || error)]);
                // Immediately download logs for critical init errors
                window.logCollector.download('init-error');
            }
        }
    }

    setupControls() {
        // Helper to safely get elements and log missing ones
        const el = (id) => {
            const node = document.getElementById(id);
            if (!node) {
                console.warn(`UI element #${id} not found`);
                if (window.logCollector) window.logCollector.add('warn', [`Missing UI element: ${id}`]);
            }
            return node;
        };

        // Intensity control
        const intensitySlider = el('intensity');
        const intensityValue = el('intensity-value');
        if (intensitySlider) {
            intensitySlider.addEventListener('input', (e) => {
                this.config.intensity = parseInt(e.target.value);
                if (intensityValue) intensityValue.textContent = this.config.intensity;
            });
        }

        // Particle count control
        const particlesSlider = el('particles');
        const particlesValue = el('particles-value');
        if (particlesSlider) {
            particlesSlider.addEventListener('input', (e) => {
                this.config.particleCount = parseInt(e.target.value);
                if (particlesValue) particlesValue.textContent = this.config.particleCount;
                if (this.particleSystem) this.particleSystem.resize(this.config.particleCount);
            });
        }

        // Gravity control
        const gravitySlider = el('gravity');
        const gravityValue = el('gravity-value');
        if (gravitySlider) {
            gravitySlider.addEventListener('input', (e) => {
                this.config.gravity = parseFloat(e.target.value);
                if (gravityValue) gravityValue.textContent = this.config.gravity.toFixed(1);
            });
        }

        // Tempo control
        const tempoSlider = el('tempo');
        const tempoValue = el('tempo-value');
        if (tempoSlider) {
            tempoSlider.addEventListener('input', (e) => {
                this.config.tempo = parseInt(e.target.value);
                if (tempoValue) tempoValue.textContent = this.config.tempo;
                if (this.audioEngine) this.audioEngine.setTempo(this.config.tempo);
            });
        }

        // Genre control
        const genreSelect = el('genre');
        const genreValue = el('genre-value');
        if (genreSelect) {
            genreSelect.addEventListener('change', (e) => {
                this.config.genre = e.target.value;
                if (genreValue) genreValue.textContent = e.target.options[e.target.selectedIndex].text;
                if (this.audioEngine && this.audioEngine.isPlaying) this.audioEngine.setGenre(this.config.genre);
            });
        }

        // Volume control
        const volumeSlider = el('volume');
        const volumeValue = el('volume-value');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.config.volume = parseInt(e.target.value) / 100;
                if (volumeValue) volumeValue.textContent = parseInt(e.target.value);
                if (this.audioEngine) this.audioEngine.setVolume(this.config.volume);
            });
        }

        // Audio toggle
        const toggleAudio = el('toggle-audio');
        if (toggleAudio) {
            toggleAudio.addEventListener('click', async () => {
                if (!this.audioEngine.isPlaying) {
                    await this.audioEngine.start(this.config.tempo, this.config.genre);
                    toggleAudio.textContent = '🔇 Stop Music';
                } else {
                    this.audioEngine.stop();
                    toggleAudio.textContent = '🎵 Start Music';
                }
            });
        }

        // Vectrex mode toggle
        const vectrexMode = el('vectrex-mode');
        if (vectrexMode) {
            vectrexMode.addEventListener('change', (e) => {
                this.config.vectrexMode = e.target.checked;
            });
        }

        // Particle trails toggle
        const particleTrails = el('particle-trails');
        if (particleTrails) {
            particleTrails.addEventListener('change', (e) => {
                this.config.particleTrails = e.target.checked;
            });
        }

        // Reset button
        const resetButton = el('reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (this.particleSystem) this.particleSystem.reset();
            });
        }

        // Run Render Test button (draws a full-screen green triangle for 1.5s)
        const runRenderTest = el('run-render-test');
        if (runRenderTest) {
            runRenderTest.addEventListener('click', () => {
                if (this.renderer) {
                    console.log('🔧 Running renderer test (full-screen green triangle)');
                    this.renderer.setForceTest(true);
                    setTimeout(() => this.renderer.setForceTest(false), 1500);
                } else {
                    console.warn('Renderer is not initialized yet');
                }
            });
        }

        // Spawn test firework button for debugging particle rendering
        const spawnTestFirework = el('spawn-test-firework');
        if (spawnTestFirework) {
            spawnTestFirework.addEventListener('click', () => {
                if (this.particleSystem && this.particleSystem.emitters[0]) {
                    const emitter = this.particleSystem.emitters[0];
                    emitter.x = window.innerWidth / 2;
                    emitter.y = window.innerHeight * 0.7;
                    const spawned = this.particleSystem.spawnFirework(emitter, this.config, { beat: true });
                    console.log(`🎆 Test firework spawned: ${spawned} particles at (${emitter.x.toFixed(0)}, ${emitter.y.toFixed(0)})`);
                } else {
                    console.warn('Particle system not initialized');
                }
            });
        }

        // Download logs button
        const downloadLogsButton = el('download-logs');
        if (downloadLogsButton) {
            downloadLogsButton.addEventListener('click', () => {
                if (window.logCollector) {
                    window.logCollector.download('manual');
                } else {
                    console.warn('LogCollector not available');
                }
            });
        }

        // Toggle auto-download logs on error
        const toggleAutoLogsButton = el('toggle-auto-logs');
        if (toggleAutoLogsButton) {
            let autoLogsEnabled = false;
            toggleAutoLogsButton.addEventListener('click', () => {
                autoLogsEnabled = !autoLogsEnabled;
                toggleAutoLogsButton.textContent = `Auto Download Logs: ${autoLogsEnabled ? 'ON' : 'OFF'}`;
                if (window.logCollector) {
                    window.logCollector.setAutoDownload(autoLogsEnabled);
                }
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.renderer) this.renderer.resize();
        });

        // Handle canvas clicks for musical notes
        const canvas = el('webgpu-canvas');
        if (canvas) canvas.addEventListener('click', this.handleCanvasClick);
    }

    animate(currentTime) {
        this.animationId = requestAnimationFrame((time) => this.animate(time));

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update FPS counter
        this.fpsCounter++;
        this.fpsTime += deltaTime;
        if (this.fpsTime >= 1.0) {
            document.getElementById('fps').textContent = `FPS: ${this.fpsCounter}`;
            this.fpsCounter = 0;
            this.fpsTime = 0;
        }

        // Get audio data for synchronization
        const audioData = this.audioEngine ? this.audioEngine.getAudioData() : null;
        
        // Update beat indicator
        if (audioData && audioData.beat) {
            const indicator = document.getElementById('beat-indicator');
            indicator.classList.add('pulse');
            setTimeout(() => indicator.classList.remove('pulse'), 300);
        }

        // Update particle system - catch errors so render test can still run
        try {
            this.particleSystem.update(deltaTime, this.config, audioData);
        } catch (err) {
            console.error('ParticleSystem.update error:', err && (err.stack || err.message || err));
            if (window.logCollector) window.logCollector.add('error', ['ParticleSystem.update error', err && (err.stack || err.message || err)]);
        }

        // Render - catch errors from renderer to allow debug tests to run
        try {
            this.renderer.render(this.particleSystem.particles, this.config);
        } catch (err) {
            console.error('Renderer.render error:', err && (err.stack || err.message || err));
            if (window.logCollector) window.logCollector.add('error', ['Renderer.render error', err && (err.stack || err.message || err)]);
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.innerHTML = `
            <div style="font-weight:bold; margin-bottom:8px;">❌ Error: ${String(message)}</div>
            <div style="margin-bottom:8px; font-size:12px; color:#fff;">You can download a diagnostic log for this error.</div>
            <button id="error-download-logs" style="padding:8px 12px; margin-right:8px;">Download Logs</button>
            <button id="error-close" style="padding:8px 12px;">Close</button>
        `;
        errorDiv.style.display = 'block';

        const downloadBtn = document.getElementById('error-download-logs');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                if (window.logCollector) {
                    window.logCollector.download('error-overlay');
                } else {
                    console.warn('LogCollector not available');
                }
            });
        }

        const closeBtn = document.getElementById('error-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                errorDiv.style.display = 'none';
            });
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.audioEngine) {
            this.audioEngine.stop();
        }
        if (this.renderer) {
            this.renderer.destroy();
        }
    }
}

// Simple log collector to capture console output, uncaught errors, and unhandled rejections
class LogCollector {
    constructor(maxEntries = 2000) {
        this.entries = [];
        this.maxEntries = maxEntries;
        this.autoDownload = false;
        this.hasAutoDownloaded = false;

        // Keep original console methods
        this.orig = {
            log: console.log.bind(console),
            info: console.info.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console)
        };

        // Wrap console methods
        ['log', 'info', 'warn', 'error'].forEach((level) => {
            console[level] = (...args) => {
                this.add(level, args);
                this.orig[level](...args);
            };
        });

        // Capture global errors
        window.addEventListener('error', (ev) => {
            try {
                const msg = ev && ev.message ? ev.message : String(ev);
                const loc = ev && ev.filename ? `${ev.filename}:${ev.lineno || 0}` : '';
                this.add('error', [`UncaughtError: ${msg} ${loc}`, ev.error && ev.error.stack]);
                if (this.autoDownload && !this.hasAutoDownloaded) {
                    this.download();
                    this.hasAutoDownloaded = true;
                }
            } catch (e) { this.orig.error('LogCollector error (window.error handler):', e); }
        });

        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (ev) => {
            try {
                this.add('error', ['UnhandledRejection', ev.reason && (ev.reason.stack || ev.reason)]);
                if (this.autoDownload && !this.hasAutoDownloaded) {
                    this.download();
                    this.hasAutoDownloaded = true;
                }
            } catch (e) { this.orig.error('LogCollector error (unhandledrejection handler):', e); }
        });
    }

    add(level, args) {
        try {
            const text = args.map(a => {
                try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch { return String(a); }
            }).join(' ');
            const entry = { ts: new Date().toISOString(), level, text };
            this.entries.push(entry);
            if (this.entries.length > this.maxEntries) this.entries.shift();

            // If an error was logged and autoDownload is enabled, trigger a single download
            if (level === 'error' && this.autoDownload && !this.hasAutoDownloaded) {
                try {
                    this.download('auto');
                    this.hasAutoDownloaded = true;
                } catch (e) {
                    this.orig.error('LogCollector.autoDownload error:', e);
                }
            }
        } catch (e) {
            this.orig.error('LogCollector.add error:', e);
        }
    }

    download(label = '') {
        try {
            const meta = {
                ts: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                url: window.location.href,
                webgpuSupported: !!navigator.gpu
            };

            // Add particle stats if available
            let particleStats = null;
            try {
                if (window.app && app.particleSystem) {
                    const total = app.particleSystem.particles.length;
                    const alive = app.particleSystem.particles.filter(p => p.life > 0).length;
                    particleStats = { total, alive };
                }
            } catch (e) { /* ignore */ }

            // Sample last active particles from renderer if available
            let sampleParticles = [];
            try {
                if (window.app && app.renderer && app.renderer.getLastActiveParticles) {
                    sampleParticles = app.renderer.getLastActiveParticles();
                }
            } catch (e) { /* ignore */ }

            // Attempt to capture a canvas screenshot data URL if available
            let screenshotDataUrl = null;
            try {
                if (window.app && app.canvas && typeof app.canvas.toDataURL === 'function') {
                    screenshotDataUrl = app.canvas.toDataURL('image/png');
                }
            } catch (e) {
                /* ignore screenshot failures */
            }
        
            const payload = { meta, particleStats, sampleParticles, screenshotDataUrl, logs: this.entries };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            const ts = new Date().toISOString().replace(/:/g, '-');
            a.href = URL.createObjectURL(blob);
            a.download = label ? `webgpu-logs-${label}-${ts}.json` : `webgpu-logs-${ts}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(a.href);
        } catch (e) {
            this.orig.error('LogCollector.download error:', e);
        }
    }

    setAutoDownload(on) {
        this.autoDownload = !!on;
        if (!on) this.hasAutoDownloaded = false;
    }
}

// Initialize the application
// Ensure the LogCollector is available BEFORE init so it can capture early errors
window.logCollector = new LogCollector();
// Enable auto-download on first uncaught error by default for easier debugging
window.logCollector.setAutoDownload(true);
const app = new FireworksApp();
app.init();

// Expose minimal debug hooks for quick testing
window.app = app;
window.enableRendererForceTest = (enabled = true) => {
    if (app.renderer) {
        app.renderer.setForceTest(!!enabled);
    } else {
        console.warn('Renderer not initialized yet');
    }
};
window.getParticleStats = () => {
    if (!app.particleSystem) return null;
    const particles = app.particleSystem.particles;
    const alive = particles.filter(p => p.life > 0).length;
    console.log(`Particles alive: ${alive} / ${particles.length}`);
    return { alive, total: particles.length };
};
window.dumpRendererParticles = (count = 10) => {
    if (!app.renderer) {
        console.warn('Renderer not initialized');
        return;
    }
    const sample = app.renderer.getLastActiveParticles();
    if (!sample || sample.length === 0) {
        console.warn('No active particles sampled yet');
        return;
    }
    console.table(sample.slice(0, count).map(p => ({
        x: p.x.toFixed(1),
        y: p.y.toFixed(1),
        vx: p.vx.toFixed(1),
        vy: p.vy.toFixed(1),
        life: (p.life || 0).toFixed(2),
        maxLife: (p.maxLife || 0).toFixed(2),
        size: (p.size || 0).toFixed(1),
        r: (p.r || 0).toFixed(2),
        g: (p.g || 0).toFixed(2),
        b: (p.b || 0).toFixed(2)
    })));
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    app.destroy();
});
