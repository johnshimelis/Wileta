/**
 * Multi-Tier Audio Dispatcher for GurshaPay Live Stream Overlay
 * Uses Web Audio API synthesis (100% reliable across OBS, TikTok LIVE Studio, Safari, Chrome)
 * with optional HTML5 audio fallbacks.
 */

// Helper: safe AudioContext initialization
function getAudioContext() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        if (!window._gpOverlayAudioCtx || window._gpOverlayAudioCtx.state === 'closed') {
            window._gpOverlayAudioCtx = new AudioContextClass();
        }
        if (window._gpOverlayAudioCtx.state === 'suspended') {
            window._gpOverlayAudioCtx.resume().catch(() => {});
        }
        return window._gpOverlayAudioCtx;
    } catch {
        return null;
    }
}

/**
 * Low Tier Sound (1 - 50 ETB): Modern quick cash register chime
 */
export function playLowTierAudio() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const t = ctx.currentTime;
        const playTone = (freq, start, duration, gainVal = 0.25, type = 'sine') => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(gainVal, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration);
        };

        // Crisp double cash register bell "ting-ting!"
        playTone(987.77, t, 0.22, 0.28, 'triangle');       // B5
        playTone(1318.51, t + 0.08, 0.45, 0.32, 'triangle'); // E6
        playTone(1975.53, t + 0.12, 0.55, 0.20, 'sine');     // B6
    } catch (e) {
        console.warn('[Audio] Low tier sound synthesis error:', e);
    }
}

/**
 * Mid Tier Sound (51 - 200 ETB): The Axum Obelisk Construct
 * Mystical crystalline stela chime with ascending harmonic resonance.
 */
export function playMidTierAudio() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const t = ctx.currentTime;
        const playHarmonic = (freq, start, duration, gainVal = 0.25) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);
            // Slight pitch shimmer for ancient ethereal crystal feel
            osc.frequency.exponentialRampToValueAtTime(freq * 1.015, start + duration * 0.5);
            gain.gain.setValueAtTime(gainVal, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration);
        };

        // Ascending pentatonic stela chords (Aksumite crystal progression)
        playHarmonic(440.00, t, 0.6, 0.22);          // A4
        playHarmonic(554.37, t + 0.12, 0.7, 0.25);   // C#5
        playHarmonic(659.25, t + 0.24, 0.8, 0.28);   // E5
        playHarmonic(880.00, t + 0.36, 1.1, 0.32);   // A5
        playHarmonic(1108.73, t + 0.48, 1.3, 0.30);  // C#6
        playHarmonic(1318.51, t + 0.60, 1.6, 0.35);  // E6
    } catch (e) {
        console.warn('[Audio] Mid tier sound synthesis error:', e);
    }
}

/**
 * High Tier Sound (201+ ETB): The Ethereal Gonderian Castle
 * Powerful celebratory imperial fanfare + deep bass impact + multi-coin cascade.
 */
export function playHighTierAudio() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const t = ctx.currentTime;

        // 1. Imperial Bass Impact Boom
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(110, t);
        bassOsc.frequency.exponentialRampToValueAtTime(42, t + 0.8);
        bassGain.gain.setValueAtTime(0.45, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + 1.2);

        // 2. Brass / Trumpet Fanfare Chords (Majestic Imperial Anthem)
        const playHorn = (freq, start, duration, gainVal = 0.22) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            // Soft lowpass filter to mimic warm brass
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1800, start);

            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.01, start);
            gain.gain.linearRampToValueAtTime(gainVal, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration);
        };

        // Regal brass fanfare phrase
        playHorn(392.00, t + 0.05, 0.45, 0.20); // G4
        playHorn(523.25, t + 0.18, 0.45, 0.24); // C5
        playHorn(659.25, t + 0.30, 0.50, 0.26); // E5
        playHorn(783.99, t + 0.44, 0.85, 0.32); // G5 (sustained crown note)
        playHorn(1046.50, t + 0.58, 1.4, 0.35); // C6 (triumphant climax)

        // 3. Multi-Coin Cascade ("Cha-Ching" cascade)
        const coinTimes = [0.85, 0.95, 1.05, 1.15, 1.25, 1.35, 1.5];
        const coinFreqs = [2400, 2900, 3200, 2600, 3500, 3800, 4200];
        coinTimes.forEach((ct, i) => {
            const coinOsc = ctx.createOscillator();
            const coinGain = ctx.createGain();
            coinOsc.type = 'triangle';
            coinOsc.frequency.setValueAtTime(coinFreqs[i], t + ct);
            coinGain.gain.setValueAtTime(0.18, t + ct);
            coinGain.gain.exponentialRampToValueAtTime(0.0001, t + ct + 0.22);
            coinOsc.connect(coinGain);
            coinGain.connect(ctx.destination);
            coinOsc.start(t + ct);
            coinOsc.stop(t + ct + 0.25);
        });
    } catch (e) {
        console.warn('[Audio] High tier sound synthesis error:', e);
    }
}
