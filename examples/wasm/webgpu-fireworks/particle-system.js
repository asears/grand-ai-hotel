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
        
        // Vectrex game state
        this.vectrexGame = {
            tanks: [],
            missiles: [],
            targets: [],
            score: 0,
            enabled: false,
            playerTank: null,
            playerKeys: {
                w: false,
                a: false,
                s: false,
                d: false,
                space: false
            }
        };
        
        this.init();
        this.setupKeyboardControls();
    }

    init() {
        // Initialize particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }

        // Create initial emitters
        this.createEmitter();
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            
            // Handle WASD keys
            if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
                this.vectrexGame.playerKeys[key] = true;
                e.preventDefault();
            }
            
            // Handle space key
            if (key === ' ' || e.code === 'Space') {
                this.vectrexGame.playerKeys.space = true;
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            
            // Handle WASD keys
            if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
                this.vectrexGame.playerKeys[key] = false;
                e.preventDefault();
            }
            
            // Handle space key
            if (key === ' ' || e.code === 'Space') {
                this.vectrexGame.playerKeys.space = false;
                e.preventDefault();
            }
        });
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

        // Update Vectrex game if in Vectrex mode
        if (config.vectrexMode) {
            this.updateVectrexGame(deltaTime, config, audioData);
        }

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
                    // Vectrex green phosphor CRT effect
                    particle.r = 0.0;
                    particle.g = 2.0; // Boosted to signal shader (will render as green)
                    particle.b = 0.25;
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
    }

    getGenreColors(genre, audioData) {
        let colors;
        
        switch (genre) {
            case 'alan-walker':
                colors = [
                    { r: 0.0, g: 0.83, b: 1.0 },  // Signature cyan
                    { r: 0.0, g: 0.4, b: 1.0 },   // Deep blue
                    { r: 0.6, g: 0.0, b: 1.0 },   // Purple
                    { r: 1.0, g: 1.0, b: 1.0 },   // White
                ];
                break;
                
            case 'avicii':
                colors = [
                    { r: 1.0, g: 0.84, b: 0.0 },  // Gold (Levels)
                    { r: 1.0, g: 0.5, b: 0.0 },   // Orange
                    { r: 1.0, g: 1.0, b: 0.0 },   // Bright yellow
                    { r: 1.0, g: 0.2, b: 0.4 },   // Pink
                ];
                break;
                
            case 'daft-punk':
                colors = [
                    { r: 1.0, g: 0.84, b: 0.0 },  // Gold
                    { r: 0.9, g: 0.9, b: 0.9 },   // Silver
                    { r: 0.0, g: 0.0, b: 0.0 },   // Black (rendered as dark)
                    { r: 1.0, g: 0.0, b: 0.0 },   // Red
                ];
                break;
                
            case 'deadmau5':
                colors = [
                    { r: 1.0, g: 0.0, b: 0.0 },   // Red (mau5head)
                    { r: 0.0, g: 1.0, b: 0.0 },   // Green
                    { r: 1.0, g: 1.0, b: 1.0 },   // White
                    { r: 0.5, g: 0.0, b: 0.5 },   // Dark purple
                ];
                break;
                
            case 'kygo':
                colors = [
                    { r: 1.0, g: 0.75, b: 0.5 },  // Tropical sunset
                    { r: 0.0, g: 0.8, b: 0.8 },   // Tropical cyan
                    { r: 1.0, g: 0.5, b: 0.7 },   // Pink
                    { r: 1.0, g: 1.0, b: 0.6 },   // Warm yellow
                ];
                break;
                
            case 'skrillex':
                colors = [
                    { r: 0.0, g: 1.0, b: 0.0 },   // Neon green (signature)
                    { r: 1.0, g: 0.0, b: 1.0 },   // Magenta
                    { r: 0.0, g: 1.0, b: 1.0 },   // Cyan
                    { r: 1.0, g: 1.0, b: 0.0 },   // Yellow
                    { r: 1.0, g: 0.0, b: 0.0 },   // Red
                ];
                break;
                
            case 'nin':
                colors = [
                    { r: 0.1, g: 0.1, b: 0.1 },   // Almost black
                    { r: 0.5, g: 0.0, b: 0.0 },   // Dark red
                    { r: 0.8, g: 0.8, b: 0.8 },   // Grey
                    { r: 1.0, g: 1.0, b: 1.0 },   // White
                    { r: 0.3, g: 0.0, b: 0.3 },   // Dark purple
                ];
                break;
                
            case 'justice':
                colors = [
                    { r: 1.0, g: 0.0, b: 0.0 },   // Red (Cross)
                    { r: 0.0, g: 0.0, b: 0.0 },   // Black
                    { r: 1.0, g: 1.0, b: 1.0 },   // White
                    { r: 1.0, g: 0.84, b: 0.0 },  // Gold
                ];
                break;
                
            default:
                colors = [
                    { r: 1.0, g: 1.0, b: 1.0 },
                    { r: 0.0, g: 0.83, b: 1.0 },
                ];
        }

        // Audio reactive color selection
        if (audioData) {
            if (audioData.bass > 0.7) {
                return colors.slice(0, Math.min(3, colors.length));
            } else if (audioData.treble > 0.7) {
                return colors.slice(-3);
            }
        }

        return colors;
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
        
        // Reset Vectrex game completely
        this.vectrexGame = {
            tanks: [],
            missiles: [],
            targets: [],
            score: 0,
            enabled: false,
            playerTank: null,
            playerKeys: {
                w: false,
                a: false,
                s: false,
                d: false,
                space: false
            }
        };
    }

    // Vectrex-style tank battle game
    updateVectrexGame(deltaTime, config, audioData) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Initialize game on first run
        if (!this.vectrexGame.enabled) {
            this.vectrexGame.enabled = true;
            this.initVectrexGame();
        }

        // Update player tank
        if (this.vectrexGame.playerTank) {
            const player = this.vectrexGame.playerTank;
            player.timer += deltaTime;
            
            // WASD movement
            let moveX = 0;
            let moveY = 0;
            
            if (this.vectrexGame.playerKeys.w) moveY = -1;
            if (this.vectrexGame.playerKeys.s) moveY = 1;
            if (this.vectrexGame.playerKeys.a) moveX = -1;
            if (this.vectrexGame.playerKeys.d) moveX = 1;
            
            // Normalize diagonal movement
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            if (magnitude > 0) {
                moveX /= magnitude;
                moveY /= magnitude;
            }
            
            // Apply movement
            player.x += moveX * player.speed * deltaTime;
            player.y += moveY * player.speed * deltaTime;
            
            // Clamp to screen bounds
            player.x = Math.max(50, Math.min(width - 50, player.x));
            player.y = Math.max(50, Math.min(height - 50, player.y));
            
            // Update turret angle based on movement
            if (magnitude > 0) {
                player.angle = Math.atan2(moveY, moveX);
            }
            
            // Fire with space
            if (this.vectrexGame.playerKeys.space && player.timer >= player.fireRate) {
                this.firePlayerMissile(player);
                player.timer = 0;
            }
        }

        // Update AI tanks
        for (let tank of this.vectrexGame.tanks) {
            tank.timer += deltaTime;
            
            // Tank movement (simple patrol)
            tank.x += tank.vx * deltaTime;
            if (tank.x < 100 || tank.x > width - 100) {
                tank.vx *= -1;
            }
            
            // Fire missiles
            if (tank.timer >= tank.fireRate) {
                this.fireVectrexMissile(tank);
                tank.timer = 0;
            }
        }

        // Update missiles
        for (let missile of this.vectrexGame.missiles) {
            missile.x += missile.vx * deltaTime;
            missile.y += missile.vy * deltaTime;
            missile.life -= deltaTime;
            
            // Create trail particles (Vectrex green)
            this.spawnVectrexTrail(missile.x, missile.y, missile.size);
            
            // Check collision with targets (player missiles only)
            if (missile.isPlayer) {
                for (let i = this.vectrexGame.targets.length - 1; i >= 0; i--) {
                    const target = this.vectrexGame.targets[i];
                    const dx = missile.x - target.x;
                    const dy = missile.y - target.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 30) {
                        // Hit!
                        this.spawnVectrexExplosion(target.x, target.y);
                        this.vectrexGame.targets.splice(i, 1);
                        this.vectrexGame.score += 100;
                        missile.life = 0;
                        break;
                    }
                }
            }
            
            // Explode at end of life
            if (missile.life <= 0) {
                this.spawnVectrexExplosion(missile.x, missile.y);
            }
        }

        // Remove dead missiles
        this.vectrexGame.missiles = this.vectrexGame.missiles.filter(m => m.life > 0);

        // Spawn targets on beat
        if (audioData && audioData.beat && this.vectrexGame.targets.length < 5) {
            this.spawnVectrexTarget();
        }

        // Update targets
        for (let target of this.vectrexGame.targets) {
            target.y += target.vy * deltaTime;
            if (target.y > height) {
                target.y = -50;
                target.x = Math.random() * width;
            }
        }

        // Draw game elements as particles
        this.drawVectrexGameElements();
    }

    initVectrexGame() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Create player-controlled tank in the MIDDLE of the screen
        this.vectrexGame.playerTank = {
            x: width * 0.5,
            y: height * 0.5,
            vx: 0,
            vy: 0,
            speed: 200,
            timer: 0,
            fireRate: 0.3,
            width: 40,
            height: 20,
            angle: -Math.PI / 2, // Pointing up
            isPlayer: true
        };
        
        // Create 2 AI tanks at bottom corners
        this.vectrexGame.tanks = [
            {
                x: width * 0.25,
                y: height - 100,
                vx: 50,
                timer: 0,
                fireRate: 1.5,
                width: 40,
                height: 20
            },
            {
                x: width * 0.75,
                y: height - 100,
                vx: -50,
                timer: 0,
                fireRate: 2.0,
                width: 40,
                height: 20
            }
        ];

        // Create initial targets
        for (let i = 0; i < 3; i++) {
            this.spawnVectrexTarget();
        }
    }

    fireVectrexMissile(tank) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5; // Mostly up
        const speed = 300;
        
        this.vectrexGame.missiles.push({
            x: tank.x,
            y: tank.y - 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 3.0,
            size: 3,
            isPlayer: false
        });
    }

    firePlayerMissile(player) {
        const speed = 400;
        
        this.vectrexGame.missiles.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(player.angle) * speed,
            vy: Math.sin(player.angle) * speed,
            life: 3.0,
            size: 4,
            isPlayer: true
        });
    }

    spawnVectrexTarget() {
        const width = window.innerWidth;
        
        this.vectrexGame.targets.push({
            x: Math.random() * width,
            y: Math.random() * 200,
            vy: 30 + Math.random() * 50,
            width: 30,
            height: 30
        });
    }

    spawnVectrexTrail(x, y, size) {
        // Find available particle
        for (let particle of this.particles) {
            if (particle.life <= 0) {
                particle.x = x;
                particle.y = y;
                particle.vx = 0;
                particle.vy = 0;
                
                // Vectrex green phosphor (boosted green channel as marker)
                particle.r = 0.0;
                particle.g = 2.0; // Boosted to signal Vectrex mode in shader
                particle.b = 0.25;
                particle.a = 1.0;
                
                particle.life = 0.3; // Short trail
                particle.maxLife = 0.3;
                particle.size = size;
                particle.isVectrex = true;
                particle.trailPositions = [];
                break;
            }
        }
    }

    spawnVectrexExplosion(x, y) {
        const burstSize = 40;
        let spawned = 0;
        
        for (let particle of this.particles) {
            if (particle.life <= 0 && spawned < burstSize) {
                const angle = (Math.PI * 2 * spawned) / burstSize;
                const speed = 100 + Math.random() * 100;
                
                particle.x = x;
                particle.y = y;
                particle.vx = Math.cos(angle) * speed;
                particle.vy = Math.sin(angle) * speed;
                
                // Vectrex green phosphor
                particle.r = 0.0;
                particle.g = 2.0; // Boosted
                particle.b = 0.25;
                particle.a = 1.0;
                
                particle.life = 1.0 + Math.random() * 0.5;
                particle.maxLife = particle.life;
                particle.size = 2 + Math.random() * 3;
                particle.isVectrex = true;
                particle.trailPositions = [];
                
                spawned++;
            }
        }
    }

    drawVectrexGameElements() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Draw player tank (brighter, different style)
        if (this.vectrexGame.playerTank) {
            const player = this.vectrexGame.playerTank;
            
            // Draw tank body (larger and brighter for visibility)
            this.drawVectrexRect(player.x - player.width/2, player.y - player.height/2, 
                                 player.width, player.height, 5);
            
            // Draw turret in direction of angle (thicker)
            const turretLength = 25;
            const turretX = player.x + Math.cos(player.angle) * turretLength;
            const turretY = player.y + Math.sin(player.angle) * turretLength;
            this.drawVectrexLine(player.x, player.y, turretX, turretY, 4);
            
            // Draw crosshair at center for visibility
            this.drawVectrexLine(player.x - 10, player.y, player.x + 10, player.y, 3);
            this.drawVectrexLine(player.x, player.y - 10, player.x, player.y + 10, 3);
            
            // Draw score
            this.drawVectrexText(10, 30, `SCORE: ${this.vectrexGame.score}`);
        }
        
        // Draw AI tanks (as vector lines)
        for (let tank of this.vectrexGame.tanks) {
            this.drawVectrexRect(tank.x - tank.width/2, tank.y - tank.height/2, 
                                 tank.width, tank.height, 2);
            // Draw turret
            this.drawVectrexLine(tank.x, tank.y, tank.x, tank.y - 15, 2);
        }

        // Draw targets (as vector lines)
        for (let target of this.vectrexGame.targets) {
            this.drawVectrexRect(target.x - target.width/2, target.y - target.height/2,
                                 target.width, target.height, 2);
            // Draw X inside
            this.drawVectrexLine(target.x - 10, target.y - 10, target.x + 10, target.y + 10, 2);
            this.drawVectrexLine(target.x + 10, target.y - 10, target.x - 10, target.y + 10, 2);
        }

        // Draw ground line
        this.drawVectrexLine(0, height - 50, width, height - 50, 2);
    }

    drawVectrexLine(x1, y1, x2, y2, width) {
        const points = 15; // More points for better visibility
        for (let i = 0; i < points; i++) {
            const t = i / points;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            // Find available particle
            for (let particle of this.particles) {
                if (particle.life <= 0) {
                    particle.x = x;
                    particle.y = y;
                    particle.vx = 0;
                    particle.vy = 0;
                    
                    // Vectrex green phosphor
                    particle.r = 0.0;
                    particle.g = 2.0; // Boosted
                    particle.b = 0.25;
                    particle.a = 1.0;
                    
                    particle.life = 0.1; // Longer persistence for visibility
                    particle.maxLife = 0.1;
                    particle.size = width;
                    particle.isVectrex = true;
                    particle.trailPositions = [];
                    break;
                }
            }
        }
    }

    drawVectrexRect(x, y, w, h, lineWidth) {
        this.drawVectrexLine(x, y, x + w, y, lineWidth);         // Top
        this.drawVectrexLine(x + w, y, x + w, y + h, lineWidth); // Right
        this.drawVectrexLine(x + w, y + h, x, y + h, lineWidth); // Bottom
        this.drawVectrexLine(x, y + h, x, y, lineWidth);         // Left
    }

    drawVectrexText(x, y, text) {
        // Simple block text rendering using particles
        const charWidth = 8;
        const charHeight = 12;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charX = x + i * charWidth;
            
            // Simple character shapes (just vertical lines for now)
            this.drawVectrexLine(charX, y, charX, y + charHeight, 2);
            if (char !== ' ' && char !== 'I') {
                this.drawVectrexLine(charX + 3, y, charX + 3, y + charHeight, 2);
            }
        }
    }
}
