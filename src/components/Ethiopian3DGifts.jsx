import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. 24 EXPANDED ETHIOPIAN CULTURAL VIRTUAL GIFTS CATALOG (10:1 COIN RATIO)
// =========================================================================

export const ETHIOPIAN_GIFTS_CATALOG = [
    // 🌼 Cultural Heritage Tiers (10 ETB / 100 Coins to 3,000 ETB / 30,000 Coins)
    { id: 'adey_abeba', nameEn: 'Adey Flower', nameAm: 'አደይ አበባ', emoji: '🌼', etb: '10', coins: 100, category: 'cultural', badge: 'Highland', animationType: 'flower', description: 'Fresh Ethiopian highland Adey bloom with golden petals' },
    { id: 'rose', nameEn: 'Highland Rose', nameAm: 'ጽጌረዳ', emoji: '🌹', etb: '25', coins: 250, category: 'cultural', animationType: 'flower', description: 'Fragrant velvety Ethiopian highland red rose' },
    { id: 'buna', nameEn: 'Sini Buna Cup', nameAm: 'ሲኒ ቡና', emoji: '☕', etb: '50', coins: 500, category: 'cultural', badge: 'Popular', animationType: 'steam', description: 'Freshly roasted dark coffee in gold-rim Sini with crema' },
    { id: 'jebena', nameEn: 'Clay Jebena', nameAm: 'የሸክላ ጀበና', emoji: '🫖', etb: '100', coins: 1000, category: 'cultural', badge: 'Aroma', animationType: 'steam', description: 'Traditional smoked black-clay coffee brewing Jebena' },
    { id: 'mesob', nameEn: 'Mesob Basket', nameAm: 'ባህላዊ መሶብ', emoji: '🧺', etb: '150', coins: 1500, category: 'cultural', badge: 'Heritage', animationType: 'cultural', description: 'Handcrafted Harari colorful woven dining basket' },
    { id: 'enjera', nameEn: 'Gursha Feast', nameAm: 'የሀበሻ ማዕድ', emoji: '🍲', etb: '200', coins: 2000, category: 'cultural', badge: 'Delicious', animationType: 'cultural', description: 'Deluxe Beyaynetu platter feast with spicy Doro Wot' },
    { id: 'bible', nameEn: 'Holy Bible', nameAm: 'መጽሐፍ ቅዱስ', emoji: '📖', etb: '250', coins: 2500, category: 'cultural', badge: 'Sacred', animationType: 'sacred', description: 'Embossed leatherbound Ethiopian Ge’ez Bible with Cross' },
    { id: 'quran', nameEn: 'Holy Quran', nameAm: 'ቁርኣን', emoji: '📗', etb: '250', coins: 2500, category: 'cultural', badge: 'Sacred', animationType: 'sacred', description: 'Emerald gilded Holy Quran with celestial divine illumination' },
    { id: 'kebero', nameEn: 'Kebero Drum', nameAm: 'ባህላዊ ከበሮ', emoji: '🪘', etb: '350', coins: 3500, category: 'cultural', badge: 'Rhythm', animationType: 'cultural', description: 'Double-headed festive Ethiopian church & celebration drum' },
    { id: 'masenqo', nameEn: 'Masenqo Lute', nameAm: 'ማሲንቆ', emoji: '🎻', etb: '500', coins: 5000, category: 'cultural', badge: 'Music', animationType: 'cultural', description: 'Single-stringed diamond soundbox bowed acoustic lute' },
    { id: 'krar', nameEn: 'Acoustic Krar', nameAm: 'ባህላዊ ክራር', emoji: '🎸', etb: '750', coins: 7500, category: 'cultural', badge: 'Melody', animationType: 'cultural', description: 'Five-stringed traditional Ethiopian acoustic bowl lyre' },
    { id: 'kemis', nameEn: 'Habesha Kemis', nameAm: 'የሐበሻ ቀሚስ', emoji: '👗', etb: '1000', coins: 10000, category: 'cultural', badge: 'Fashion', animationType: 'cultural', description: 'Embroidered royal white cotton dress with gold Tilf' },
    { id: 'shield', nameEn: 'Warrior Shield', nameAm: 'ጋሻና ጦር', emoji: '🛡️', etb: '1500', coins: 15000, category: 'cultural', badge: 'Valor', animationType: 'cultural', description: 'Embossed warrior leather shield and twin golden spears' },
    { id: 'walia', nameEn: 'Walia Ibex', nameAm: 'ዋሊያ አይቤክስ', emoji: '🐐', etb: '2000', coins: 20000, category: 'cultural', badge: 'Wild', animationType: 'cultural', description: 'Majestic Semien Mountain Walia Ibex on rocky cliff' },
    { id: 'horse', nameEn: 'Gadaa Horse', nameAm: 'የኦሮሞ ፈረስ', emoji: '🏇', etb: '3000', coins: 30000, category: 'cultural', badge: 'Warrior', animationType: 'cultural', description: 'Galloping Ethiopian steed with traditional battle saddle' },

    // 👑 VIP & Supreme Luxury Tiers (5,000 ETB / 50,000 Coins to 100,000 ETB / 1,000,000 Coins)
    { id: 'anbessa', nameEn: 'Lion of Judah', nameAm: 'የይሁዳ አንበሳ', emoji: '🦁', etb: '5000', coins: 50000, category: 'vip', badge: 'King', animationType: 'lion', description: 'Photorealistic 3D Roaring Barbary Lion with Imperial Crown' },
    { id: 'crown', nameEn: 'Negus Crown', nameAm: 'የንጉሥ ዘውድ', emoji: '👑', etb: '10000', coins: 100000, category: 'vip', badge: 'Imperial', animationType: 'gem', description: 'Imperial 24K solid gold crown with ruby & emerald gems' },
    { id: 'diamond', nameEn: 'Telebirr Gem', nameAm: 'ቴሌብር አልማዝ', emoji: '💎', etb: '15000', coins: 150000, category: 'vip', badge: 'Precious', animationType: 'gem', description: 'Sparkling brilliant-cut diamond with prismatic reflections' },
    { id: 'car', nameEn: 'Addis Supercar', nameAm: 'ስፖርት መኪና', emoji: '🏎️', etb: '25000', coins: 250000, category: 'vip', badge: 'Speed', animationType: 'car', description: 'Exotic red & gold hypercar drifting with tire smoke' },
    { id: 'axum', nameEn: 'Axum Obelisk', nameAm: 'የአክሱም ሐውልት', emoji: '🏛️', etb: '35000', coins: 350000, category: 'vip', badge: 'Monument', animationType: 'sacred', description: 'Ancient monolithic granite Stelae of Axum with sunbeams' },
    { id: 'lalibela', nameEn: 'Lalibela Church', nameAm: 'ላሊበላ ቤተ ጊዮርጊስ', emoji: '⛪', etb: '50000', coins: 500000, category: 'vip', badge: 'Heritage', animationType: 'sacred', description: 'Exact Monolithic Bet Giyorgis rock-carved cross church' },
    { id: 'plane', nameEn: 'Ethiopian Jet', nameAm: 'ቦይንግ ጄት', emoji: '✈️', etb: '75000', coins: 750000, category: 'vip', badge: 'Aviation', animationType: 'plane', description: 'Flagship Boeing 787 Dreamliner with flag vapor trail' },
    { id: 'satellite', nameEn: 'ETRSS-1 Satellite', nameAm: 'የኢትዮጵያ ሳተላይት', emoji: '🛰️', etb: '90000', coins: 900000, category: 'vip', badge: 'Space', animationType: 'satellite', description: '3D Ethiopian satellite orbiting Earth with solar flares' },
    { id: 'national_honor', nameEn: 'National Honor', nameAm: 'ታላቅ ክብር', emoji: '🏆', etb: '100000', coins: 1000000, category: 'vip', badge: 'Legendary', animationType: 'gem', description: 'Supreme 24K Grand Ethiopian National Gold Trophy' }
];

// =========================================================================
// 2. REALISTIC 3D GRAPHICAL GIFT VISUAL COMPONENT WITH IN-PLACE MOVEMENT
// =========================================================================

export const Gift3DIcon = ({ id, size = 56, animated = true, isHero = false }) => {
    const s = size;
    const [imgError, setImgError] = useState(false);

    // Get asset image URL
    const imgSrc = `/gifts/${id}.jpg`;

    // Specialized in-place movement class based on gift id
    const getMovementClass = () => {
        if (!animated) return '';
        switch (id) {
            case 'plane': return 'inplace-jet-banking';
            case 'car': return 'inplace-supercar-drift';
            case 'anbessa': return 'inplace-lion-breathe';
            case 'buna':
            case 'jebena': return 'inplace-steam-waft';
            case 'adey_abeba':
            case 'rose': return 'inplace-flower-sway';
            case 'bible':
            case 'quran':
            case 'lalibela':
            case 'axum': return 'inplace-sacred-float';
            case 'diamond':
            case 'crown':
            case 'national_honor': return 'inplace-gem-shimmer';
            case 'satellite': return 'inplace-satellite-orbit';
            case 'horse': return 'inplace-horse-gallop';
            default: return 'inplace-cultural-pulse';
        }
    };

    return (
        <div 
            className={`gift-3d-orb-container ${getMovementClass()} ${isHero ? 'gift-hero-mode' : ''}`}
            style={{ 
                width: s, 
                height: s, 
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '800px'
            }}
        >
            {/* Ambient Radial Glow Halo */}
            <div className="gift-orb-glow-aura" />

            {/* Specular Holographic Lens */}
            <div className="gift-orb-lens">
                {!imgError ? (
                    <img 
                        src={imgSrc} 
                        alt={id}
                        className="gift-orb-real-image"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    // Graceful fallback emoji icon
                    <div className="gift-orb-fallback-emoji">
                        {id === 'adey_abeba' ? '🌼' :
                         id === 'rose' ? '🌹' :
                         id === 'buna' ? '☕' :
                         id === 'jebena' ? '🫖' :
                         id === 'mesob' ? '🧺' :
                         id === 'enjera' ? '🍲' :
                         id === 'bible' ? '📖' :
                         id === 'quran' ? '📗' :
                         id === 'anbessa' ? '🦁' :
                         id === 'crown' ? '👑' :
                         id === 'diamond' ? '💎' :
                         id === 'car' ? '🏎️' :
                         id === 'lalibela' ? '⛪' :
                         id === 'plane' ? '✈️' :
                         id === 'satellite' ? '🛰️' :
                         id === 'national_honor' ? '🏆' : '🎁'}
                    </div>
                )}
            </div>

            {/* Dynamic In-Place Particle Embellishments */}
            {animated && (
                <>
                    {/* Jet Trail Particles */}
                    {id === 'plane' && (
                        <div className="inplace-jet-trail">
                            <span className="trail-dot t-green"></span>
                            <span className="trail-dot t-yellow"></span>
                            <span className="trail-dot t-red"></span>
                        </div>
                    )}

                    {/* Supercar Smoke Particles */}
                    {id === 'car' && (
                        <div className="inplace-drift-smoke">
                            <span className="smoke-puff sp-1"></span>
                            <span className="smoke-puff sp-2"></span>
                            <span className="smoke-neon-underglow"></span>
                        </div>
                    )}

                    {/* Rising Steam for Coffee & Jebena */}
                    {(id === 'buna' || id === 'jebena') && (
                        <div className="inplace-steam-wisps">
                            <span className="steam-line st-1"></span>
                            <span className="steam-line st-2"></span>
                            <span className="steam-line st-3"></span>
                        </div>
                    )}

                    {/* Sacred Light Beams */}
                    {(id === 'bible' || id === 'quran' || id === 'lalibela' || id === 'axum') && (
                        <div className="inplace-sacred-rays" />
                    )}

                    {/* Gem Shimmer Sparkles */}
                    {(id === 'diamond' || id === 'crown' || id === 'national_honor' || id === 'anbessa') && (
                        <div className="inplace-sparkle-star" />
                    )}
                </>
            )}
        </div>
    );
};

// =========================================================================
// 3. NATIVE WEB AUDIO SYNTHESIZER FOR LIVE TIKTOK SOUND EFFECTS
// =========================================================================

export const playAudioEffect = (type = 'chime') => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (type === 'lion_roar') {
            // Ferocious Lion Roar: Low Frequency Sawtooth Formant + Filtered White Noise Growl
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(55, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(85, now + 1.2);
            osc.frequency.exponentialRampToValueAtTime(35, now + 1.9);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(420, now);
            filter.frequency.linearRampToValueAtTime(800, now + 0.5);
            filter.frequency.exponentialRampToValueAtTime(140, now + 1.9);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.65, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.95);

        } else if (type === 'car_rev') {
            // Supercar Accelerating Engine Rev & Tire Screech
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(85, now);
            osc.frequency.exponentialRampToValueAtTime(520, now + 0.75);
            osc.frequency.exponentialRampToValueAtTime(340, now + 1.4);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.45, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.45);

        } else if (type === 'jet_flyby') {
            // Commercial Jet Doppler Flyby
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(640, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 1.6);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.55, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.65);

        } else if (type === 'sacred_chime') {
            // Heavenly Angelic Chimes for Bible, Quran, Lalibela & Axum
            [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);

                gain.gain.setValueAtTime(0, now + i * 0.1);
                gain.gain.linearRampToValueAtTime(0.35, now + i * 0.1 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.3);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 1.35);
            });

        } else {
            // Melodic Fanfare Chime (Default Celebration)
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0, now + idx * 0.08);
                gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.08 + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.5);
            });
        }
    } catch (e) {}
};

// =========================================================================
// 4. FULL-SCREEN TIKTOK LIVE GRAPHICAL MOTION CELEBRATION SHOWCASE
// =========================================================================

export const TikTokLiveGiftShowcase = ({
    gift,
    supporterName = 'Generous Supporter',
    creatorName = 'Creator',
    amount = '10',
    coins = 100,
    comboCount = 1,
    onComboClick,
    onClose
}) => {
    const [animationPhase, setAnimationPhase] = useState('running'); // 'running' | 'roaring' | 'celebrating'

    useEffect(() => {
        // Trigger specific sound effect based on gift type
        if (gift?.id === 'anbessa') {
            playAudioEffect('lion_roar');
            const timer = setTimeout(() => setAnimationPhase('roaring'), 900);
            return () => clearTimeout(timer);
        } else if (gift?.id === 'car') {
            playAudioEffect('car_rev');
        } else if (gift?.id === 'plane') {
            playAudioEffect('jet_flyby');
        } else if (gift?.id === 'bible' || gift?.id === 'quran' || gift?.id === 'lalibela' || gift?.id === 'axum') {
            playAudioEffect('sacred_chime');
        } else {
            playAudioEffect('chime');
        }
    }, [gift]);

    if (!gift) return null;

    return (
        <div className="tiktok-cinematic-backdrop" onClick={onClose}>
            {/* Top Streamer & Gifter Live Banner */}
            <div className="tiktok-live-badge-container" onClick={e => e.stopPropagation()}>
                <div className="tiktok-live-avatar-pill">
                    <span className="live-pulse-dot"></span>
                    <span style={{ color: '#FDE047', fontWeight: 800 }}>{supporterName}</span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>sent</span>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>{gift.nameAm} ({gift.nameEn})</span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>to</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 800 }}>@{creatorName}</span>
                </div>
            </div>

            {/* FULL-SCREEN GRAPHICAL MOTION CINEMATIC STAGE */}
            <div className="tiktok-motion-stage" onClick={e => e.stopPropagation()}>
                
                {/* 🦁 LION OF JUDAH: Runs Across Screen -> Leaps -> Roars with Screen Shake */}
                {gift.id === 'anbessa' && (
                    <div className={`lion-animation-wrapper ${animationPhase}`}>
                        <div className="savanna-dust-storm"></div>
                        <div className="lion-graphic-body">
                            <Gift3DIcon id="anbessa" size={240} isHero={true} />
                        </div>

                        {animationPhase === 'roaring' && (
                            <>
                                <div className="roar-shockwave wave-1"></div>
                                <div className="roar-shockwave wave-2"></div>
                                <div className="roar-shockwave wave-3"></div>
                                <div className="roar-text-banner">🦁 ROAAARRR! የይሁዳ አንበሳ 👑</div>
                            </>
                        )}
                    </div>
                )}

                {/* 🏎️ ADDIS SUPERCAR: High-Speed Burnout & Drift */}
                {gift.id === 'car' && (
                    <div className="supercar-motion-wrapper">
                        <div className="tire-burnout-smoke"></div>
                        <div className="supercar-graphic-body">
                            <Gift3DIcon id="car" size={240} isHero={true} />
                        </div>
                        <div className="speed-lines"></div>
                        <div className="roar-text-banner">🏎️ VROOOOM! አዲስ ሱፐርካር ⚡</div>
                    </div>
                )}

                {/* ✈️ ETHIOPIAN JET: Sky Flyby with Tricolor Vapor Trail */}
                {gift.id === 'plane' && (
                    <div className="jet-flyby-wrapper">
                        <div className="jet-tricolor-trail"></div>
                        <div className="jet-graphic-body">
                            <Gift3DIcon id="plane" size={260} isHero={true} />
                        </div>
                        <div className="sonic-boom-ring"></div>
                        <div className="roar-text-banner">✈️ ETHIOPIAN DREAMLINER 787! 🇪🇹</div>
                    </div>
                )}

                {/* 🌼 ADEY FLOWER / ROSE: Sunflower Petal Rain Vortex */}
                {(gift.id === 'adey_abeba' || gift.id === 'rose') && (
                    <div className="flower-bloom-wrapper">
                        {[...Array(28)].map((_, i) => (
                            <span 
                                key={i} 
                                className="floating-petal"
                                style={{
                                    left: `${(i * 3.7) % 96}%`,
                                    animationDelay: `${(i * 0.12)}s`,
                                    animationDuration: `${2.2 + (i % 3)}s`
                                }}
                            >
                                {gift.id === 'rose' ? '🌹' : '🌼'}
                            </span>
                        ))}
                        <div className="flower-center-burst">
                            <Gift3DIcon id={gift.id} size={220} isHero={true} />
                        </div>
                        <div className="roar-text-banner">🌼 ENKUTATASH BLESSING! አደይ አበባ ✨</div>
                    </div>
                )}

                {/* 📖 BIBLE / 📗 QURAN / ⛪ LALIBELA / 🏛️ AXUM: Divine Heavenly Beams */}
                {(gift.id === 'bible' || gift.id === 'quran' || gift.id === 'lalibela' || gift.id === 'axum') && (
                    <div className="sacred-light-wrapper">
                        <div className="heavenly-sunbeams"></div>
                        <div className="sacred-center-object">
                            <Gift3DIcon id={gift.id} size={230} isHero={true} />
                        </div>
                        <div className="roar-text-banner">✨ SACRED ETHIOPIAN HERITAGE 🙏</div>
                    </div>
                )}

                {/* 🧺 MESOB / ☕ BUNA / 🫖 JEBENA / 👑 CROWN / 💎 DIAMOND / 🏆 HONOR: Radiant Celebration */}
                {(!['anbessa', 'car', 'plane', 'adey_abeba', 'rose', 'bible', 'quran', 'lalibela', 'axum'].includes(gift.id)) && (
                    <div className="radiant-celebration-wrapper">
                        <div className="golden-burst-particles"></div>
                        <div className="radiant-center-object">
                            <Gift3DIcon id={gift.id} size={220} isHero={true} />
                        </div>
                        <div className="roar-text-banner">🎉 {gift.nameAm} • {gift.nameEn} 🌟</div>
                    </div>
                )}

            </div>

            {/* Bottom Floating TikTok Combo & Dismiss Controls */}
            <div className="tiktok-combo-bottom-bar" onClick={e => e.stopPropagation()}>
                <div className="gift-value-pill">
                    <span>🪙 {Number(coins).toLocaleString()} Coins</span>
                    <span style={{ color: '#9CA3AF' }}>({Number(amount).toLocaleString()} ETB)</span>
                </div>

                <button
                    className="tiktok-combo-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onComboClick) onComboClick();
                        if (gift.id === 'anbessa') {
                            setAnimationPhase('roaring');
                            playAudioEffect('lion_roar');
                        } else if (gift.id === 'car') {
                            playAudioEffect('car_rev');
                        } else if (gift.id === 'plane') {
                            playAudioEffect('jet_flyby');
                        } else {
                            playAudioEffect('chime');
                        }
                    }}
                >
                    <span>🔥</span>
                    <span>x{comboCount} COMBO!</span>
                    <span className="tap-plus-one">TAP +1</span>
                </button>

                <button className="tiktok-dismiss-btn" onClick={onClose}>
                    Close &times;
                </button>
            </div>
        </div>
    );
};
