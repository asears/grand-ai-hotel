/**
 * Particle System for Fireworks
 * Manages particle physics and spawning
 */

export class ParticleSystem {
    constructor(maxParticles) {
        this.maxParticles = maxParticles;
        this.particles = [];
        this.emitters = [];
        this.time = 0;
        
        this.init();
    }

    init() {
        // Initialize particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }

        // Create initial emitters
        this.createEmitter();
    }

    createParticle() {
        return {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            r: 1,
            g: 1,
            b: 1,
            a: 1,
            life: 0,
            maxLife: 1,
            size: 2,
            trail: [],
            isVectrex: false,
            trailPositions: []
        };
    }

    createEmitter() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.emitters.push({
            x: Math.random() * width,
            y: height * 0.7 + Math.random() * height * 0.2,
            active: true,
            timer: 0,
            interval: 0.3 + Math.random() * 0.7, // Faster spawning
            burstSize: 80 + Math.random() * 120 // More particles
        });
    }

    update(deltaTime, config, audioData) {
        this.time += deltaTime;

        // Update emitters
        for (let emitter of this.emitters) {
            if (emitter.active) {
                emitter.timer += deltaTime;
                
                // Spawn fireworks on beat or timer
                const shouldSpawn = emitter.timer >= emitter.interval || 
                    (audioData && audioData.beat && Math.random() < 0.7);
                
                if (shouldSpawn) {
                    this.spawnFirework(emitter, config, audioData);
                    emitter.timer = 0;
                    emitter.interval = 0.3 + Math.random() * 1.2;
                    
                    // Move emitter to new position
                    emitter.x = Math.random() * window.innerWidth;
                }
            }
        }

        // Update particles
        const gravity = config.gravity * 100;
        
        for (let particle of this.particles) {
            if (particle.life > 0) {
                // Store trail positions
                if (config.particleTrails && particle.trailPositions) {
                    particle.trailPositions.push({ x: particle.x, y: particle.y, life: particle.life });
                    // Keep only last 10 positions
                    if (particle.trailPositions.length > 10) {
                        particle.trailPositions.shift();
                    }
                }

                // Apply physics
                particle.vy += gravity * deltaTime;
                particle.x += particle.vx * deltaTime;
                particle.y += particle.vy * deltaTime;
                
                // Apply air resistance (less for Vectrex mode)
                const resistance = particle.isVectrex ? 0.995 : 0.99;
                particle.vx *= resistance;
                particle.vy *= resistance;
                
                // Update life
                particle.life -= deltaTime;
                
                // Fade out (Vectrex stays brighter longer)
                if (particle.isVectrex) {
                    particle.a = Math.max(0.3, particle.life / particle.maxLife);
                } else {
                    particle.a = Math.max(0, particle.life / particle.maxLife);
                }
                
                // Audio reactive size and effects
                if (audioData) {
                    if (audioData.bass > 0.5) {
                        particle.size = 2 + audioData.bass * 3;
                    }
                    // Wobble effect for dubstep
                    if (audioData.wobble) {
                        particle.size *= 1 + Math.sin(this.time * 20) * 0.3;
                    }
                }
            } else if (particle.trailPositions) {
                particle.trailPositions = [];
            }
        }

        // Spawn new emitters periodically
        if (this.emitters.length < 3 && Math.random() < deltaTime * 0.5) {
            this.createEmitter();
        }

        // Remove old emitters
        this.emitters = this.emitters.filter(e => 
            this.time - e.timer < 10 || e.active
        );
    }

    spawnFirework(emitter, config, audioData) {
        const burstSize = Math.floor(emitter.burstSize * (config.intensity / 100));
        const colors = this.getGenreColors(config.genre, audioData);
        
        // Random chance for Vectrex mode firework (super bright, vector-style)
        const isVectrexBurst = config.vectrexMode || Math.random() < 0.15;
        
        let particlesSpawned = 0;
        
        for (let particle of this.particles) {
            if (particle.life <= 0 && particlesSpawned < burstSize) {
                const angle = (Math.PI * 2 * particlesSpawned) / burstSize;
                const speed = 100 + Math.random() * 200;
                
                // Choose color from palette
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                particle.x = emitter.x;
                particle.y = emitter.y;
                particle.vx = Math.cos(angle) * speed;
                particle.vy = Math.sin(angle) * speed - 200; // Launch upward
                
                // Vectrex mode: super bright, pure colors
                if (isVectrexBurst) {
                    particle.r = Math.round(color.r) * 2; // Boost to super bright
                    particle.g = Math.round(color.g) * 2;
                    particle.b = Math.round(color.b) * 2;
                    particle.isVectrex = true;
                    particle.size = 3 + Math.random() * 4;
                    particle.life = 2.5 + Math.random() * 2;
                } else {
                    particle.r = color.r;
                    particle.g = color.g;
                    particle.b = color.b;
                    particle.isVectrex = false;
                    particle.size = 2 + Math.random() * 3;
                    particle.life = 1.5 + Math.random() * 1.5;
                }
                
                particle.a = 1;
                particle.maxLife = particle.life;
                particle.trailPositions = [];
                
                particlesSpawned++;
            }
        }

        return particlesSpawned;
    }

    getGenreColors(genre, audioData) {
        switch ((genre || '').toLowerCase()) {
            case 'justice':
                return this.getJusticeColors(audioData);
            case 'nin':
            case 'nine-inch-nails':
                return this.getNINColors(audioData);
            case 'alan-walker':
            default:
                return this.getAlanWalkerColors(audioData);
        }
    }

    getAlanWalkerColors(audioData) {
        // Alan Walker signature colors: cyan, blue, purple, neon green
        const baseColors = [
            { r: 0.0, g: 0.83, b: 1.0 },  // Cyan
            { r: 0.0, g: 0.4, b: 1.0 },   // Blue
            { r: 0.6, g: 0.0, b: 1.0 },   // Purple
            { r: 1.0, g: 0.0, b: 0.8 },   // Magenta
            { r: 0.0, g: 1.0, b: 0.5 },   // Neon green
            { r: 1.0, g: 1.0, b: 1.0 },   // White
        ];

        // Audio reactive color selection
        if (audioData) {
            if (audioData.bass > 0.7) {
                return baseColors.slice(0, 3); // Cooler colors on bass
            } else if (audioData.treble > 0.7) {
                return baseColors.slice(3, 6); // Warmer colors on treble
            }
        }

        return baseColors;
    }

    getJusticeColors(audioData) {
        // Justice: strong neon orange/red palette
        const base = [
            { r: 1.0, g: 0.4, b: 0.0 },
            { r: 1.0, g: 0.2, b: 0.1 },
            { r: 0.8, g: 0.1, b: 0.6 },
            { r: 0.2, g: 0.0, b: 0.8 }
        ];
        if (audioData && audioData.bass > 0.7) return base.slice(0,2);
        return base;
    }

    getNINColors(audioData) {
        // Nine Inch Nails: industrial grayscale with red accents
        const base = [
            { r: 0.2, g: 0.2, b: 0.2 },
            { r: 0.5, g: 0.5, b: 0.5 },
            { r: 0.9, g: 0.1, b: 0.1 },
            { r: 1.0, g: 1.0, b: 1.0 }
        ];
        if (audioData && audioData.treble > 0.8) return base.slice(2);
        return base;
    }

    resize(newCount) {
        if (newCount > this.particles.length) {
            // Add more particles
            for (let i = this.particles.length; i < newCount; i++) {
                this.particles.push(this.createParticle());
            }
        } else {
            // Remove particles
            this.particles = this.particles.slice(0, newCount);
        }
        this.maxParticles = newCount;
    }

    reset() {
        for (let particle of this.particles) {
            particle.life = 0;
        }
        this.emitters = [];
        this.createEmitter();
    }
}
