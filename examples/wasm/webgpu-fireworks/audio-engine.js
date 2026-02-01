/**
 * Audio Engine - Alan Walker Style Synthesizer
 * Creates procedural electronic music inspired by Alan Walker
 */

export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
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

        // Create analyser for beat detection
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.connect(this.masterGain);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.isPlaying = true;
        this.currentBeat = 0;
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
        
        // Melodic pluck synth (signature Alan Walker sound)
        this.playPluck(now, 440);
        
        // Bass line
        this.playBass(now, 55);
        
        // Hi-hats
        this.playHiHat(now);
        
        // Atmospheric pad
        this.playPad(now, [220, 277.18, 329.63]); // A minor
    }

    playAviciiStyle(now) {
        // Avicii: Stronger kicks, euphoric leads
        this.playKick(now, 1.2);
        this.playPluck(now, 523.25, 'triangle'); // C5, more euphoric
        this.playBass(now, 65.41); // C2
        this.playHiHat(now);
        if (this.currentBeat % 4 === 0) {
            this.playPad(now, [261.63, 329.63, 392.00]); // C major
        }
    }

    playDaftPunkStyle(now) {
        // Daft Punk: Funky, robotic
        if (this.currentBeat % 2 === 0) {
            this.playKick(now, 1.1);
        }
        this.playPluck(now, 440, 'square'); // Square wave for robotic sound
        this.playBass(now, 55, true); // Funkier bass
        this.playHiHat(now, true); // More pronounced hats
    }

    playDeadmau5Style(now) {
        // Deadmau5: Progressive, deep
        this.playKick(now, 1.0);
        this.playPluck(now, 440, 'sawtooth');
        this.playBass(now, 55);
        if (this.currentBeat % 2 === 0) {
            this.playHiHat(now);
        }
        this.playPad(now, [220, 246.94, 293.66]); // A, B, D
    }

    playKygoStyle(now) {
        // Kygo: Tropical house, melodic
        if (this.currentBeat % 4 === 0 || this.currentBeat % 4 === 2) {
            this.playKick(now, 0.9);
        }
        this.playPluck(now, 523.25, 'sine'); // Softer, melodic
        this.playBass(now, 65.41);
        this.playHiHat(now);
        this.playPad(now, [261.63, 329.63, 392.00, 493.88]); // C major 7
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

    getAudioData() {
        if (!this.analyser) {
            return { bass: 0, mid: 0, treble: 0, beat: false };
        }

        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate frequency ranges
        const bass = this.getFrequencyRange(0, 100);
        const mid = this.getFrequencyRange(100, 500);
        const treble = this.getFrequencyRange(500, 1000);
        
        return {
            bass: bass / 255,
            mid: mid / 255,
            treble: treble / 255,
            beat: this.beatDetected
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
