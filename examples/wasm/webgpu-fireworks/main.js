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
        
        // Bind this for event handlers
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
    }

    handleCanvasClick(e) {
        // Play a musical note sound
        if (this.audioEngine && this.audioEngine.audioContext) {
            this.playClickNote(e);
        }
    }

    playClickNote(e) {
        const ctx = this.audioEngine.audioContext;
        const now = ctx.currentTime;
        
        // Use mouse Y position to determine pitch (higher = higher pitch)
        const canvas = document.getElementById('webgpu-canvas');
        const rect = canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const normalizedY = 1 - (y / rect.height); // 0 at bottom, 1 at top
        
        // Map to musical scale (C4 to C6)
        const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]; // Two octave major scale
        const noteIndex = Math.floor(normalizedY * scale.length);
        const semitone = scale[Math.min(noteIndex, scale.length - 1)];
        const frequency = 261.63 * Math.pow(2, semitone / 12); // C4 base
        
        // Create a musical pluck sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.value = frequency;
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.5);
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
            
            // Connect particle system octave changes to audio engine
            this.particleSystem.onOctaveChange = (octave) => {
                if (this.audioEngine) {
                    this.audioEngine.setOctaveShift(octave);
                    console.log(`Octave shifted to: ${octave === 0 ? 'normal' : octave > 0 ? '+1 octave' : '-1 octave'}`);
                    
                    // Show visual feedback
                    const indicator = document.getElementById('beat-indicator');
                    const octaveDisplay = document.getElementById('octave-display');
                    
                    if (octave === 0) {
                        indicator.style.backgroundColor = '#00d4ff';
                        octaveDisplay.textContent = 'Normal';
                        octaveDisplay.style.color = '#00d4ff';
                    } else if (octave > 0) {
                        indicator.style.backgroundColor = '#ff00ff';
                        octaveDisplay.textContent = '+1 Octave (Higher)';
                        octaveDisplay.style.color = '#ff00ff';
                    } else {
                        indicator.style.backgroundColor = '#00ff00';
                        octaveDisplay.textContent = '-1 Octave (Lower)';
                        octaveDisplay.style.color = '#00ff00';
                    }
                }
            };

            // Start render loop
            this.lastTime = performance.now();
            this.animate(this.lastTime);

            console.log('✅ WebGPU Fireworks initialized successfully');
        } catch (error) {
            this.showError(error.message);
            console.error('Initialization error:', error);
        }
    }

    setupControls() {
        // Intensity control
        const intensitySlider = document.getElementById('intensity');
        const intensityValue = document.getElementById('intensity-value');
        intensitySlider.addEventListener('input', (e) => {
            this.config.intensity = parseInt(e.target.value);
            intensityValue.textContent = this.config.intensity;
        });

        // Particle count control
        const particlesSlider = document.getElementById('particles');
        const particlesValue = document.getElementById('particles-value');
        particlesSlider.addEventListener('input', (e) => {
            this.config.particleCount = parseInt(e.target.value);
            particlesValue.textContent = this.config.particleCount;
            this.particleSystem.resize(this.config.particleCount);
        });

        // Gravity control
        const gravitySlider = document.getElementById('gravity');
        const gravityValue = document.getElementById('gravity-value');
        gravitySlider.addEventListener('input', (e) => {
            this.config.gravity = parseFloat(e.target.value);
            gravityValue.textContent = this.config.gravity.toFixed(1);
        });

        // Tempo control
        const tempoSlider = document.getElementById('tempo');
        const tempoValue = document.getElementById('tempo-value');
        tempoSlider.addEventListener('input', (e) => {
            this.config.tempo = parseInt(e.target.value);
            tempoValue.textContent = this.config.tempo;
            if (this.audioEngine) {
                this.audioEngine.setTempo(this.config.tempo);
            }
        });

        // Genre control
        const genreSelect = document.getElementById('genre');
        const genreValue = document.getElementById('genre-value');
        genreSelect.addEventListener('change', (e) => {
            this.config.genre = e.target.value;
            genreValue.textContent = e.target.options[e.target.selectedIndex].text;
            if (this.audioEngine && this.audioEngine.isPlaying) {
                this.audioEngine.setGenre(this.config.genre);
            }
        });

        // Volume control
        const volumeSlider = document.getElementById('volume');
        const volumeValue = document.getElementById('volume-value');
        volumeSlider.addEventListener('input', (e) => {
            this.config.volume = parseInt(e.target.value) / 100;
            volumeValue.textContent = parseInt(e.target.value);
            if (this.audioEngine) {
                this.audioEngine.setVolume(this.config.volume);
            }
        });

        // Audio toggle
        const toggleAudio = document.getElementById('toggle-audio');
        toggleAudio.addEventListener('click', async () => {
            if (!this.audioEngine.isPlaying) {
                await this.audioEngine.start(this.config.tempo, this.config.genre);
                toggleAudio.textContent = '🔇 Stop Music';
            } else {
                this.audioEngine.stop();
                toggleAudio.textContent = '🎵 Start Music';
            }
        });

        // Bass boost button
        const bassBoost = document.getElementById('bass-boost');
        bassBoost.addEventListener('click', () => {
            if (this.audioEngine && this.audioEngine.isPlaying) {
                this.audioEngine.triggerBassBoost();
                
                // Visual feedback
                bassBoost.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    bassBoost.style.transform = 'scale(1)';
                }, 200);
            }
        });

        // Vectrex mode toggle
        const vectrexMode = document.getElementById('vectrex-mode');
        vectrexMode.addEventListener('change', (e) => {
            this.config.vectrexMode = e.target.checked;
            
            // Toggle body class for background
            if (e.target.checked) {
                document.body.classList.add('vectrex-mode');
            } else {
                document.body.classList.remove('vectrex-mode');
            }
            
            // Reset particle system when toggling
            this.particleSystem.reset();
        });

        // Particle trails toggle
        const particleTrails = document.getElementById('particle-trails');
        particleTrails.addEventListener('change', (e) => {
            this.config.particleTrails = e.target.checked;
        });

        // Reset button
        const resetButton = document.getElementById('reset');
        resetButton.addEventListener('click', () => {
            this.particleSystem.reset();
        });
        
        // Debug: Screenshot now button
        const screenshotButton = document.getElementById('screenshot-now');
        screenshotButton.addEventListener('click', () => {
            const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            this.renderer.takeScreenshot(`manual-${timestamp}`, this.particleSystem.particles, this.config);
        });
        
        // Debug: Enable auto screenshots button
        const autoScreenshotButton = document.getElementById('enable-auto-screenshots');
        let autoScreenshotsEnabled = false;
        autoScreenshotButton.addEventListener('click', () => {
            autoScreenshotsEnabled = !autoScreenshotsEnabled;
            this.renderer.setDebugMode(autoScreenshotsEnabled, 60, 10);
            autoScreenshotButton.textContent = autoScreenshotsEnabled 
                ? '⏹️ Stop Auto Screenshots' 
                : '🎬 Auto Screenshots (1/sec)';
            autoScreenshotButton.style.background = autoScreenshotsEnabled
                ? 'rgba(255, 0, 0, 0.3)'
                : 'rgba(255, 200, 0, 0.2)';
        });
        
        // Debug: Spawn test firework button
        const spawnTestButton = document.getElementById('spawn-test-firework');
        spawnTestButton.addEventListener('click', () => {
            if (this.particleSystem && this.particleSystem.emitters[0]) {
                const emitter = this.particleSystem.emitters[0];
                emitter.x = window.innerWidth / 2; // Center
                emitter.y = window.innerHeight * 0.7; // Lower third
                const spawned = this.particleSystem.spawnFirework(emitter, this.config, { beat: true });
                console.log(`🎆 Test firework spawned: ${spawned} particles at (${emitter.x.toFixed(0)}, ${emitter.y.toFixed(0)})`);
                
                // Take screenshot after 200ms to capture the burst
                setTimeout(() => {
                    this.renderer.takeScreenshot('test-firework', this.particleSystem.particles, this.config);
                }, 200);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.renderer.resize();
        });
        
        // Handle canvas clicks for musical notes
        const canvas = document.getElementById('webgpu-canvas');
        canvas.addEventListener('click', this.handleCanvasClick);
    }

    animate(currentTime) {
        this.animationId = requestAnimationFrame((time) => this.animate(time));

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update FPS counter
        this.fpsCounter++;
        this.fpsTime += deltaTime;
        if (this.fpsTime >= 1.0) {
            // Count alive particles for debugging
            const aliveParticles = this.particleSystem.particles.filter(p => p.life > 0).length;
            const vectrexParticles = this.particleSystem.particles.filter(p => p.life > 0 && p.isVectrex).length;
            const regularParticles = this.particleSystem.particles.filter(p => p.life > 0 && !p.isVectrex).length;
            
            document.getElementById('fps').textContent = 
                `FPS: ${this.fpsCounter} | Particles: ${aliveParticles} (V:${vectrexParticles} R:${regularParticles})`;
            
            // Log to console every second for debugging
            if (this.fpsCounter % 60 < 2) {
                console.log(`🎆 Particle Stats: Total=${aliveParticles}, Vectrex=${vectrexParticles}, Regular=${regularParticles}, Dead=${this.particleSystem.particles.length - aliveParticles}`);
            }
            
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

        // Update particle system
        this.particleSystem.update(deltaTime, this.config, audioData);

        // Render
        this.renderer.render(this.particleSystem.particles, this.config);
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = `❌ Error: ${message}`;
        errorDiv.style.display = 'block';
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
        
        // Remove event listeners
        const canvas = document.getElementById('webgpu-canvas');
        if (canvas) {
            canvas.removeEventListener('click', this.handleCanvasClick);
        }
    }
}

// Initialize the application
const app = new FireworksApp();
app.init();

// Expose debug functions globally
window.debugFireworks = {
    // Enable automatic screenshots every N frames
    enableAutoScreenshots: (interval = 60, maxCount = 10) => {
        if (app.renderer) {
            app.renderer.setDebugMode(true, interval, maxCount);
        }
    },
    
    // Disable automatic screenshots
    disableAutoScreenshots: () => {
        if (app.renderer) {
            app.renderer.setDebugMode(false);
        }
    },
    
    // Take a single screenshot now
    screenshot: (label = '') => {
        if (app.renderer && app.particleSystem) {
            app.renderer.takeScreenshot(label, app.particleSystem.particles, app.config);
        }
    },
    
    // Get current particle stats
    getParticleStats: () => {
        if (!app.particleSystem) return null;
        
        const particles = app.particleSystem.particles;
        const alive = particles.filter(p => p.life > 0);
        const vectrex = alive.filter(p => p.isVectrex);
        const regular = alive.filter(p => !p.isVectrex);
        
        const stats = {
            total: particles.length,
            alive: alive.length,
            dead: particles.length - alive.length,
            vectrex: vectrex.length,
            regular: regular.length,
            utilization: ((alive.length / particles.length) * 100).toFixed(1) + '%',
            emitters: app.particleSystem.emitters.length,
            musicNotes: app.particleSystem.musicNotes.length,
            vectrexMode: app.config.vectrexMode
        };
        
        console.table(stats);
        return stats;
    },
    
    // Force spawn a firework for testing
    spawnTestFirework: () => {
        if (!app.particleSystem || !app.particleSystem.emitters[0]) return;
        
        const emitter = app.particleSystem.emitters[0];
        const spawned = app.particleSystem.spawnFirework(emitter, app.config, { beat: true });
        console.log(`🎆 Manually spawned firework: ${spawned} particles`);
        
        // Take screenshot after spawn
        setTimeout(() => {
            app.renderer.takeScreenshot('manual-firework', app.particleSystem.particles, app.config);
        }, 100);
    },
    
    // Dump particle data to console
    dumpParticles: (count = 10) => {
        if (!app.particleSystem) return;
        
        const alive = app.particleSystem.particles.filter(p => p.life > 0).slice(0, count);
        console.log(`📊 First ${alive.length} alive particles:`);
        console.table(alive.map(p => ({
            x: p.x.toFixed(1),
            y: p.y.toFixed(1),
            vx: p.vx.toFixed(1),
            vy: p.vy.toFixed(1),
            life: p.life.toFixed(2),
            size: p.size.toFixed(1),
            r: p.r.toFixed(2),
            g: p.g.toFixed(2),
            b: p.b.toFixed(2),
            a: p.a.toFixed(2),
            isVectrex: p.isVectrex
        })));
    }
};

console.log(`
🔍 WebGPU Fireworks Debug Console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available debug commands (use in browser console):

  debugFireworks.enableAutoScreenshots(60, 10)
    - Auto-capture screenshots every 60 frames (max 10)
  
  debugFireworks.disableAutoScreenshots()
    - Stop auto-capturing
  
  debugFireworks.screenshot('my-label')
    - Take a single screenshot with optional label
  
  debugFireworks.getParticleStats()
    - Show current particle statistics
  
  debugFireworks.spawnTestFirework()
    - Manually spawn a firework for testing
  
  debugFireworks.dumpParticles(10)
    - Show details of first 10 alive particles

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick test sequence:
  1. debugFireworks.getParticleStats()
  2. debugFireworks.spawnTestFirework()
  3. debugFireworks.screenshot('test')

Enable auto-debugging:
  debugFireworks.enableAutoScreenshots(30, 5)
  // Wait 5 seconds, check Downloads folder for screenshots
`);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    app.destroy();
});
