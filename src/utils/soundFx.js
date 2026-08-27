// Procedural Web Audio API sound synthesizer
// Lightweight, zero-dependency, and instantly responsive

class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        // Check localStorage preference if available
        try {
            const saved = localStorage.getItem('gurshapay_sound_enabled');
            if (saved !== null) {
                this.enabled = saved === 'true';
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
        try {
            localStorage.setItem('gurshapay_sound_enabled', String(this.enabled));
        } catch (e) {}
        if (this.enabled) {
            this.playClick();
        }
        return this.enabled;
    }

    isSoundEnabled() {
        return this.enabled;
    }

    // Gentle tactile click for buttons and chips
    playClick() {
        if (!this.enabled) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    // Melodic pop when selecting amounts or tabs
    playPop() {
        if (!this.enabled) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.07);
        } catch (e) {}
    }

    // USSD network connection chirp
    playUssdPing() {
        if (!this.enabled) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            [0, 0.09, 0.18].forEach((delay, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const startTime = now + delay;
                const freq = [520, 650, 780][idx];

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.06, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.06);
            });
        } catch (e) {}
    }

    // PIN key typing beep
    playKeypad() {
        if (!this.enabled) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(941, now);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    }

    // Celebration victory fanfare on tip success
    playSuccessFanfare() {
        if (!this.enabled) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const notes = [
                { f: 523.25, d: 0.1 },  // C5
                { f: 659.25, d: 0.1 },  // E5
                { f: 783.99, d: 0.12 }, // G5
                { f: 1046.50, d: 0.35 } // C6
            ];

            let timeOffset = 0;
            notes.forEach((n) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const startTime = now + timeOffset;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(n.f, startTime);

                gain.gain.setValueAtTime(0.12, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + n.d);

                timeOffset += n.d * 0.85;
            });
        } catch (e) {}
    }

    // Stream alert sounds by theme
    playAlertTone(type = 'chime') {
        if (!this.enabled) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            if (type === 'arcade') {
                // 8-bit retro arcade coin sound
                const notes = [987.77, 1318.51];
                notes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const start = now + idx * 0.08;

                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, start);

                    gain.gain.setValueAtTime(0.08, start);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(start);
                    osc.stop(start + 0.18);
                });
            } else if (type === 'victory') {
                // Energetic fanfare
                this.playSuccessFanfare();
            } else {
                // Crystal Ethiopian Emerald chime
                const chords = [587.33, 739.99, 880.00, 1174.66];
                chords.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const start = now + idx * 0.05;

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, start);

                    gain.gain.setValueAtTime(0.1, start);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(start);
                    osc.stop(start + 0.4);
                });
            }
        } catch (e) {}
    }
}

export const soundFx = new SoundFX();
