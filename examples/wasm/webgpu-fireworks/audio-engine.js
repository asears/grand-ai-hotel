/**
 * Audio Engine - Alan Walker Style Synthesizer
 * Creates procedural electronic music inspired by Alan Walker
 */

export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.bassGain = null;
        this.drumGain = null;
        this.isPlaying = false;
        this.tempo = 128; // BPM
        this.beatInterval = 60 / this.tempo;
        this.currentBeat = 0;
        this.time = 0;
        this.analyser = null;
        this.dataArray = null;
        this.beatDetected = false;
        this.genre = 'alan-walker';
        this.scheduleTimeout = null;
        this.lfoPhase = 0; // For wobble bass (Skrillex style)
        this.noiseGate = 0; // For industrial effects (NIN)
        this.bassBoost = 1.0; // Bass boost multiplier
        this.generativePhrase = 0; // For organic music generation
        this.melodicSeed = Math.random();
    }

    async start(tempo = 128, genre = 'alan-walker') {
        if (this.isPlaying) return;

        this.tempo = tempo;
        this.genre = genre;
        this.beatInterval = 60 / this.tempo;

        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create master gain
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.7;
        this.masterGain.connect(this.audioContext.destination);

        // Create bass gain (for bass boost)
        this.bassGain = this.audioContext.createGain();
        this.bassGain.gain.value = this.bassBoost;
        this.bassGain.connect(this.masterGain);

        // Create drum gain
        this.drumGain = this.audioContext.createGain();
        this.drumGain.gain.value = 1.0;
        this.drumGain.connect(this.masterGain);

        // Create analyser for beat detection
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.connect(this.masterGain);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.isPlaying = true;
        this.currentBeat = 0;
        this.generativePhrase = 0;
        this.playGenreStyle();
    }

    playGenreStyle() {
        const now = this.audioContext.currentTime;
        
        switch (this.genre) {
            case 'alan-walker':
                this.playAlanWalkerStyle(now);
                break;
            case 'avicii':
                this.playAviciiStyle(now);
                break;
            case 'daft-punk':
                this.playDaftPunkStyle(now);
                break;
            case 'deadmau5':
                this.playDeadmau5Style(now);
                break;
            case 'kygo':
                this.playKygoStyle(now);
                break;
            case 'skrillex':
                this.playSkrillexStyle(now);
                break;
            case 'nin':
                this.playNINStyle(now);
                break;
            case 'justice':
                this.playJusticeStyle(now);
                break;
        }

        // Schedule next iteration
        if (this.isPlaying) {
            this.scheduleTimeout = setTimeout(() => this.playGenreStyle(), this.beatInterval * 1000);
        }
        
        this.currentBeat = (this.currentBeat + 1) % 16;
    }

    playAlanWalkerStyle(now) {
        // Alan Walker signature: 4-on-the-floor kick drum
        this.playKick(now);
        
        // Melodic pluck synth (signature Alan Walker sound) - generative
        const phrase = Math.floor(this.currentBeat / 8);
        const noteOffset = this.generateMelodicNote(phrase);
        this.playPluck(now, 440 * Math.pow(2, noteOffset / 12));
        
        // Deep drop bass
        this.playDropBass(now, 55);
        
        // Layered drums
        this.playDrum(now);
        
        // Hi-hats
        this.playHiHat(now);
        
        // Atmospheric pad
        this.playPad(now, [220, 277.18, 329.63]); // A minor
        
        // Organic generative elements
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playAviciiStyle(now) {
        // Avicii: Stronger kicks, euphoric leads
        this.playKick(now, 1.2);
        
        // Euphoric pluck with generative melody
        const phrase = Math.floor(this.currentBeat / 8);
        const noteOffset = this.generateMelodicNote(phrase) + 12; // Higher octave
        this.playPluck(now, 523.25 * Math.pow(2, noteOffset / 12), 'triangle');
        
        this.playDropBass(now, 65.41); // C2
        this.playDrum(now);
        this.playHiHat(now);
        if (this.currentBeat % 4 === 0) {
            this.playPad(now, [261.63, 329.63, 392.00]); // C major
        }
        
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playDaftPunkStyle(now) {
        // Daft Punk: Funky, robotic
        if (this.currentBeat % 2 === 0) {
            this.playKick(now, 1.1);
        }
        
        const phrase = Math.floor(this.currentBeat / 8);
        const noteOffset = this.generateMelodicNote(phrase);
        this.playPluck(now, 440 * Math.pow(2, noteOffset / 12), 'square');
        
        this.playDropBass(now, 55, true); // Funkier bass
        this.playDrum(now);
        this.playHiHat(now, true);
        
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playDeadmau5Style(now) {
        // Deadmau5: Progressive, deep
        this.playKick(now, 1.0);
        
        const phrase = Math.floor(this.currentBeat / 8);
        const noteOffset = this.generateMelodicNote(phrase);
        this.playPluck(now, 440 * Math.pow(2, noteOffset / 12), 'sawtooth');
        
        this.playDropBass(now, 55);
        this.playDrum(now);
        if (this.currentBeat % 2 === 0) {
            this.playHiHat(now);
        }
        this.playPad(now, [220, 246.94, 293.66]); // A, B, D
        
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playKygoStyle(now) {
        // Kygo: Tropical house, melodic
        if (this.currentBeat % 4 === 0 || this.currentBeat % 4 === 2) {
            this.playKick(now, 0.9);
        }
        
        const phrase = Math.floor(this.currentBeat / 8);
        const noteOffset = this.generateMelodicNote(phrase) + 12;
        this.playPluck(now, 523.25 * Math.pow(2, noteOffset / 12), 'sine');
        
        this.playDropBass(now, 65.41);
        this.playDrum(now);
        this.playHiHat(now);
        this.playPad(now, [261.63, 329.63, 392.00, 493.88]); // C major 7
        
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playSkrillexStyle(now) {
        // Skrillex: Dubstep/Brostep with wobble bass and aggressive drops
        this.playKick(now, 1.3);
        
        // Wobble bass (LFO modulated)
        if (this.currentBeat % 2 === 0) {
            this.playWobbleBass(now);
        }
        
        this.playDropBass(now, 55); // Extra sub bass
        
        // Aggressive high-frequency synth
        if (this.currentBeat % 4 === 2) {
            this.playLaserShot(now);
        }
        
        this.playDrum(now);
        this.playHiHat(now, true);
        
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playNINStyle(now) {
        // Nine Inch Nails: Industrial, harsh, mechanical
        // Irregular kick pattern
        if (this.currentBeat % 4 === 0 || (this.currentBeat % 7 === 0)) {
            this.playKick(now, 1.4);
        }
        
        // Distorted bass
        this.playDistortedBass(now);
        this.playDropBass(now, 55); // Add sub bass
        
        // Industrial noise hits
        if (Math.random() < 0.3) {
            this.playIndustrialNoise(now);
        }
        
        this.playDrum(now);
        
        // Mechanical hi-hats
        if (this.currentBeat % 2 === 0) {
            this.playHiHat(now, true);
        }
        
        // Dark pad
        if (this.currentBeat === 0) {
            this.playPad(now, [110, 123.47, 146.83]); // Dark A minor
        }
        
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playJusticeStyle(now) {
        // Justice: Electro house, distorted, French touch
        this.playKick(now, 1.2);
        
        // Distorted synth riff
        if (this.currentBeat < 8) {
            this.playDistortedSynth(now);
        }
        
        this.playDropBass(now, 55, true);
        this.playDrum(now);
        this.playHiHat(now);
        
        // Electro stabs
        if (this.currentBeat % 4 === 0) {
            this.playElectroStab(now);
        }
        
        if (this.currentBeat % 16 === 0) {
            this.generativePhrase++;
        }
    }

    playWobbleBass(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // LFO for wobble
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 55;
        
        filter.type = 'lowpass';
        filter.Q.value = 15; // High resonance
        
        // LFO modulates filter frequency
        lfo.frequency.value = 8; // 8 Hz wobble
        lfoGain.gain.value = 2000;
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        filter.frequency.value = 500;
        
        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.analyser);
        
        lfo.start(startTime);
        lfo.stop(startTime + 0.8);
        osc.start(startTime);
        osc.stop(startTime + 0.8);
    }

    playLaserShot(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(2000, startTime);
        osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.2);
        
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.analyser);
        
        osc.start(startTime);
        osc.stop(startTime + 0.2);
    }

    playSnare(startTime) {
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.analyser);
        
        noise.start(startTime);
    }

    playDistortedBass(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const distortion = this.audioContext.createWaveShaper();
        
        // Create distortion curve
        const amount = 50;
        const samples = 44100;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20) / (Math.PI + amount * Math.abs(x));
        }
        distortion.curve = curve;
        
        osc.type = 'sawtooth';
        osc.frequency.value = 55;
        
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
        
        osc.connect(distortion);
        distortion.connect(gain);
        gain.connect(this.analyser);
        
        osc.start(startTime);
        osc.stop(startTime + 0.6);
    }

    playIndustrialNoise(startTime) {
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.random();
        }
        
        noise.buffer = buffer;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        
        noise.connect(gain);
        gain.connect(this.analyser);
        
        noise.start(startTime);
    }

    playDistortedSynth(startTime) {
        const pattern = [0, 5, 7, 12];
        const note = pattern[this.currentBeat % 4];
        const freq = 220 * Math.pow(2, note / 12);
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const distortion = this.audioContext.createWaveShaper();
        
        const amount = 30;
        const samples = 44100;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x) / (Math.PI + amount * Math.abs(x));
        }
        distortion.curve = curve;
        
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        osc.connect(distortion);
        distortion.connect(gain);
        gain.connect(this.analyser);
        
        osc.start(startTime);
        osc.stop(startTime + 0.3);
    }

    playElectroStab(startTime) {
        const chordNotes = [220, 277.18, 329.63];
        
        chordNotes.forEach(freq => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = 'square';
            osc.frequency.value = freq;
            
            filter.type = 'lowpass';
            filter.frequency.value = 1500;
            filter.Q.value = 5;
            
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.analyser);
            
            osc.start(startTime);
            osc.stop(startTime + 0.1);
        });
    }

    playKick(startTime, intensity = 1.0) {
        // Deep kick drum on beats 1 and 3
        if (this.currentBeat % 4 === 0) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.setValueAtTime(150, startTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.5);
            
            gain.gain.setValueAtTime(1 * intensity, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
            
            osc.connect(gain);
            gain.connect(this.analyser);
            
            osc.start(startTime);
            osc.stop(startTime + 0.5);
            
            this.beatDetected = true;
            setTimeout(() => this.beatDetected = false, 100);
        }
    }

    playPluck(startTime, baseFreq = 440, waveType = 'sawtooth') {
        // Melodic pluck pattern
        const pattern = [0, 4, 7, 12, 7, 4, 0, -5]; // Melodic pattern in semitones
        
        if (this.currentBeat < 8) {
            const note = pattern[this.currentBeat];
            const freq = baseFreq * Math.pow(2, note / 12);
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = waveType;
            osc.frequency.value = freq;
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(5000, startTime);
            filter.frequency.exponentialRampToValueAtTime(800, startTime + 0.1);
            
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.analyser);
            
            osc.start(startTime);
            osc.stop(startTime + 0.3);
        }
    }

    playBass(startTime, frequency = 55, funky = false) {
        // Deep sub-bass
        if (this.currentBeat % 2 === 0 || funky) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = frequency;
            
            gain.gain.setValueAtTime(0.4, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            osc.connect(gain);
            gain.connect(this.analyser);
            
            osc.start(startTime);
            osc.stop(startTime + 0.4);
        }
    }

    playHiHat(startTime, pronounced = false) {
        // Crisp hi-hats on every beat
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.05, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        
        const gain = this.audioContext.createGain();
        const volume = pronounced ? 0.15 : 0.1;
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.analyser);
        
        noise.start(startTime);
    }

    playPad(startTime, chordNotes = [220, 277.18, 329.63]) {
        // Atmospheric pad every 4 beats
        if (this.currentBeat === 0) {
            
            chordNotes.forEach(freq => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();
                
                osc.type = 'sawtooth';
                osc.frequency.value = freq;
                
                filter.type = 'lowpass';
                filter.frequency.value = 800;
                filter.Q.value = 1;
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.05, startTime + 0.1);
                gain.gain.linearRampToValueAtTime(0.03, startTime + 1.9);
                gain.gain.linearRampToValueAtTime(0, startTime + 2);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.analyser);
                
                osc.start(startTime);
                osc.stop(startTime + 2);
            });
        }
    }

    // Deep drop bass with sub frequencies
    playDropBass(startTime, frequency = 55) {
        if (this.currentBeat % 2 === 0) {
            const osc = this.audioContext.createOscillator();
            const subOsc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            // Main bass
            osc.type = 'sine';
            osc.frequency.value = frequency;
            
            // Sub bass (octave down)
            subOsc.type = 'sine';
            subOsc.frequency.value = frequency / 2;
            
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            filter.Q.value = 2;
            
            gain.gain.setValueAtTime(0.5 * this.bassBoost, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
            
            osc.connect(filter);
            subOsc.connect(filter);
            filter.connect(gain);
            gain.connect(this.bassGain);
            
            osc.start(startTime);
            subOsc.start(startTime);
            osc.stop(startTime + 0.6);
            subOsc.stop(startTime + 0.6);
        }
    }

    // Layered drum sounds
    playDrum(startTime) {
        // Snare on 2 and 4
        if (this.currentBeat % 4 === 1 || this.currentBeat % 4 === 3) {
            this.playSnare(startTime);
        }
        
        // Clap on 2 and 4 (layered with snare)
        if (this.currentBeat % 4 === 1 || this.currentBeat % 4 === 3) {
            this.playClap(startTime);
        }
        
        // Crash cymbal every 16 beats
        if (this.currentBeat % 16 === 0) {
            this.playCrash(startTime);
        }
    }

    playClap(startTime) {
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 5;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.drumGain);
        
        noise.start(startTime);
    }

    playCrash(startTime) {
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 1.5, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 5000;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.drumGain);
        
        noise.start(startTime);
    }

    // Generate organic melodic notes using Perlin-like algorithm
    generateMelodicNote(phrase) {
        const scale = [0, 2, 4, 5, 7, 9, 11, 12]; // Major scale
        const seed = this.melodicSeed + phrase * 0.1;
        const index = Math.floor((Math.sin(seed * 3.14159) * 0.5 + 0.5) * scale.length);
        return scale[Math.min(index, scale.length - 1)];
    }

    // Bass boost with voice sample
    async triggerBassBoost() {
        this.bassBoost = 2.0;
        if (this.bassGain) {
            this.bassGain.gain.setValueAtTime(this.bassBoost, this.audioContext.currentTime);
        }
        
        // Play "Drop that beat whoa" voice
        this.playVoiceSample(this.audioContext.currentTime);
        
        // Reset bass boost after 8 beats
        const resetTime = this.beatInterval * 8;
        setTimeout(() => {
            this.bassBoost = 1.0;
            if (this.bassGain) {
                this.bassGain.gain.linearRampToValueAtTime(1.0, this.audioContext.currentTime + 0.5);
            }
        }, resetTime * 1000);
    }

    // Simulated voice saying "Drop that beat whoa"
    playVoiceSample(startTime) {
        // "Drop" - low frequency sweep
        const drop = this.audioContext.createOscillator();
        const dropGain = this.audioContext.createGain();
        const dropFilter = this.audioContext.createBiquadFilter();
        
        drop.type = 'sawtooth';
        drop.frequency.setValueAtTime(180, startTime);
        drop.frequency.linearRampToValueAtTime(120, startTime + 0.15);
        
        dropFilter.type = 'bandpass';
        dropFilter.frequency.value = 800;
        dropFilter.Q.value = 5;
        
        dropGain.gain.setValueAtTime(0.4, startTime);
        dropGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        
        drop.connect(dropFilter);
        dropFilter.connect(dropGain);
        dropGain.connect(this.masterGain);
        
        drop.start(startTime);
        drop.stop(startTime + 0.15);
        
        // "that" - mid frequency
        const that = this.audioContext.createOscillator();
        const thatGain = this.audioContext.createGain();
        const thatFilter = this.audioContext.createBiquadFilter();
        
        that.type = 'square';
        that.frequency.value = 250;
        
        thatFilter.type = 'bandpass';
        thatFilter.frequency.value = 1200;
        thatFilter.Q.value = 8;
        
        thatGain.gain.setValueAtTime(0.3, startTime + 0.18);
        thatGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.28);
        
        that.connect(thatFilter);
        thatFilter.connect(thatGain);
        thatGain.connect(this.masterGain);
        
        that.start(startTime + 0.18);
        that.stop(startTime + 0.28);
        
        // "beat" - percussive
        const beat = this.audioContext.createOscillator();
        const beatGain = this.audioContext.createGain();
        const beatFilter = this.audioContext.createBiquadFilter();
        
        beat.type = 'sawtooth';
        beat.frequency.setValueAtTime(300, startTime + 0.32);
        beat.frequency.exponentialRampToValueAtTime(150, startTime + 0.42);
        
        beatFilter.type = 'bandpass';
        beatFilter.frequency.value = 1000;
        beatFilter.Q.value = 6;
        
        beatGain.gain.setValueAtTime(0.4, startTime + 0.32);
        beatGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.42);
        
        beat.connect(beatFilter);
        beatFilter.connect(beatGain);
        beatGain.connect(this.masterGain);
        
        beat.start(startTime + 0.32);
        beat.stop(startTime + 0.42);
        
        // "whoa" - sweeping vowel sound
        const whoa = this.audioContext.createOscillator();
        const whoaGain = this.audioContext.createGain();
        const whoaFilter = this.audioContext.createBiquadFilter();
        
        whoa.type = 'sawtooth';
        whoa.frequency.setValueAtTime(220, startTime + 0.46);
        whoa.frequency.linearRampToValueAtTime(180, startTime + 0.76);
        
        whoaFilter.type = 'bandpass';
        whoaFilter.frequency.setValueAtTime(900, startTime + 0.46);
        whoaFilter.frequency.linearRampToValueAtTime(400, startTime + 0.76);
        whoaFilter.Q.value = 10;
        
        whoaGain.gain.setValueAtTime(0.5, startTime + 0.46);
        whoaGain.gain.linearRampToValueAtTime(0.3, startTime + 0.66);
        whoaGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.76);
        
        whoa.connect(whoaFilter);
        whoaFilter.connect(whoaGain);
        whoaGain.connect(this.masterGain);
        
        whoa.start(startTime + 0.46);
        whoa.stop(startTime + 0.76);
    }

    getAudioData() {
        if (!this.analyser) {
            return { bass: 0, mid: 0, treble: 0, beat: false, wobble: false };
        }

        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate frequency ranges
        const bass = this.getFrequencyRange(0, 100);
        const mid = this.getFrequencyRange(100, 500);
        const treble = this.getFrequencyRange(500, 1000);
        
        // Detect wobble bass (Skrillex/dubstep style)
        const wobble = this.genre === 'skrillex' && bass > 150;
        
        return {
            bass: bass / 255,
            mid: mid / 255,
            treble: treble / 255,
            beat: this.beatDetected,
            wobble: wobble
        };
    }

    getFrequencyRange(startFreq, endFreq) {
        const nyquist = this.audioContext.sampleRate / 2;
        const startIndex = Math.floor(startFreq / nyquist * this.dataArray.length);
        const endIndex = Math.floor(endFreq / nyquist * this.dataArray.length);
        
        let sum = 0;
        for (let i = startIndex; i < endIndex; i++) {
            sum += this.dataArray[i];
        }
        
        return sum / (endIndex - startIndex);
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
    }

    setTempo(tempo) {
        this.tempo = tempo;
        this.beatInterval = 60 / this.tempo;
    }

    setGenre(genre) {
        this.genre = genre;
        // Reset beat for smooth transition
        this.currentBeat = 0;
    }

    stop() {
        this.isPlaying = false;
        if (this.scheduleTimeout) {
            clearTimeout(this.scheduleTimeout);
            this.scheduleTimeout = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}
