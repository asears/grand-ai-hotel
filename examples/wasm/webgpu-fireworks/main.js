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

        // Handle window resize
        window.addEventListener('resize', () => {
            this.renderer.resize();
        });
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
    }
}

// Initialize the application
const app = new FireworksApp();
app.init();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    app.destroy();
});
