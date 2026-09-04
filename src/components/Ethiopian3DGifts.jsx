import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. 26 EXPANDED ETHIOPIAN CULTURAL VIRTUAL GIFTS CATALOG (10:1 COIN RATIO)
// =========================================================================

export const ETHIOPIAN_GIFTS_CATALOG = [
    // 🌼 Cultural Heritage Tiers (10 ETB / 100 Coins to 3,000 ETB / 30,000 Coins)
    { id: 'adey_abeba', nameEn: 'Adey Flower', nameAm: 'አደይ አበባ', emoji: '🌼', etb: '10', coins: 100, category: 'cultural', badge: 'Highland', animationType: 'flower', description: 'Fresh Ethiopian highland Adey bloom with unfurling golden petals' },
    { id: 'rose', nameEn: 'Highland Rose', nameAm: 'ጽጌረዳ', emoji: '🌹', etb: '25', coins: 250, category: 'cultural', animationType: 'flower', description: 'Velvety Ethiopian highland red rose with dew drops' },
    { id: 'buna', nameEn: 'Sini Buna Cup', nameAm: 'ሲኒ ቡና', emoji: '☕', etb: '50', coins: 500, category: 'cultural', badge: 'Popular', animationType: 'steam', description: 'Freshly brewed coffee in gold-trim Sini with rising aromatic steam' },
    { id: 'jebena', nameEn: 'Clay Jebena', nameAm: 'የሸክላ ጀበና', emoji: '🫖', etb: '100', coins: 1000, category: 'cultural', badge: 'Pouring', animationType: 'pour', description: 'Authentic clay Jebena pouring fresh steaming coffee into a Sini' },
    { id: 'mesob', nameEn: 'Mesob Basket', nameAm: 'ባህላዊ መሶብ', emoji: '🧺', etb: '150', coins: 1500, category: 'cultural', badge: 'Heritage', animationType: 'mesob', description: 'Harari woven Mesob basket with opening lid revealing hot Injera' },
    { id: 'enjera', nameEn: 'Gursha Feast', nameAm: 'የሀበሻ ማዕድ', emoji: '🍲', etb: '200', coins: 2000, category: 'cultural', badge: 'Delicious', animationType: 'feast', description: 'Deluxe Beyaynetu feast with spicy Doro Wot and steaming Shiro' },
    { id: 'bible', nameEn: 'Holy Bible', nameAm: 'መጽሐፍ ቅዱስ', emoji: '📖', etb: '250', coins: 2500, category: 'cultural', badge: 'Sacred', animationType: 'book', description: 'Leatherbound Ethiopian Ge’ez Bible opening with glowing sacred light' },
    { id: 'quran', nameEn: 'Holy Quran', nameAm: 'ቁርኣን', emoji: '📗', etb: '250', coins: 2500, category: 'cultural', badge: 'Sacred', animationType: 'book', description: 'Emerald gilded Holy Quran opening with divine celestial rays' },
    { id: 'kebero', nameEn: 'Kebero Drum', nameAm: 'ባህላዊ ከበሮ', emoji: '🪘', etb: '350', coins: 3500, category: 'cultural', badge: 'Rhythm', animationType: 'kebero', description: 'Festive Ethiopian church drum with animated rhythmic beats' },
    { id: 'masenqo', nameEn: 'Masenqo Lute', nameAm: 'ማሲንቆ', emoji: '🎻', etb: '500', coins: 5000, category: 'cultural', badge: 'Music', animationType: 'masenqo', description: 'Single-stringed diamond soundbox lute with gliding bow & notes' },
    { id: 'krar', nameEn: 'Acoustic Krar', nameAm: 'ባህላዊ ክራር', emoji: '🎸', etb: '750', coins: 7500, category: 'cultural', badge: 'Melody', animationType: 'krar', description: 'Five-stringed traditional Ethiopian lyre with vibrating acoustic strings' },
    { id: 'kemis', nameEn: 'Habesha Kemis', nameAm: 'የሐበሻ ቀሚስ', emoji: '👗', etb: '1000', coins: 10000, category: 'cultural', badge: 'Fashion', animationType: 'kemis', description: 'Royal white cotton dress with gold embroidered Tilf shimmer' },
    { id: 'shield', nameEn: 'Warrior Shield', nameAm: 'ጋሻና ጦር', emoji: '🛡️', etb: '1500', coins: 15000, category: 'cultural', badge: 'Valor', animationType: 'shield', description: 'Embossed warrior leather shield with clashing golden spears' },
    { id: 'rekebot', nameEn: 'Rekebot Set', nameAm: 'ረከቦትና ዕጣን', emoji: '☕', etb: '2000', coins: 20000, category: 'cultural', badge: 'Ceremony', animationType: 'rekebot', description: 'Full Ethiopian coffee ceremony table with burning Itan incense smoke' },
    { id: 'walia', nameEn: 'Walia Ibex', nameAm: 'ዋሊያ አይቤክስ', emoji: '🐐', etb: '2500', coins: 25000, category: 'cultural', badge: 'Wild', animationType: 'walia', description: 'Majestic Semien Mountain Walia Ibex standing in mountain mist' },
    { id: 'horse', nameEn: 'Gadaa Horse', nameAm: 'የኦሮሞ ፈረስ', emoji: '🏇', etb: '3000', coins: 30000, category: 'cultural', badge: 'Warrior', animationType: 'horse', description: 'Galloping Ethiopian steed with traditional war saddle' },

    // 👑 VIP & Supreme Luxury Tiers (5,000 ETB / 50,000 Coins to 100,000 ETB / 1,000,000 Coins)
    { id: 'anbessa', nameEn: 'Lion of Judah', nameAm: 'የይሁዳ አንበሳ', emoji: '🦁', etb: '5000', coins: 50000, category: 'vip', badge: 'King', animationType: 'lion', description: 'Photorealistic 3D Roaring Lion with Imperial Crown & sound shockwaves' },
    { id: 'crown', nameEn: 'Negus Crown', nameAm: 'የንጉሥ ዘውድ', emoji: '👑', etb: '10000', coins: 100000, category: 'vip', badge: 'Imperial', animationType: 'crown', description: 'Imperial 24K solid gold crown levitating with ruby & emerald sparkles' },
    { id: 'diamond', nameEn: 'Telebirr Gem', nameAm: 'ቴሌብር አልማዝ', emoji: '💎', etb: '15000', coins: 150000, category: 'vip', badge: 'Precious', animationType: 'diamond', description: 'Brilliant-cut diamond with continuous 3D rotation and rainbow caustics' },
    { id: 'car', nameEn: 'Addis Supercar', nameAm: 'ስፖርት መኪና', emoji: '🏎️', etb: '25000', coins: 250000, category: 'vip', badge: 'Speed', animationType: 'car', description: 'Exotic red & gold hypercar drifting with tire smoke and neon glow' },
    { id: 'axum', nameEn: 'Axum Obelisk', nameAm: 'የአክሱም ሐውልት', emoji: '🏛️', etb: '35000', coins: 350000, category: 'vip', badge: 'Monument', animationType: 'axum', description: 'Monolithic granite Stelae of Axum with rotating 360° golden sunbeams' },
    { id: 'gondar', nameEn: 'Gondar Castle', nameAm: 'ፋሲል ግቢ', emoji: '🏰', etb: '40000', coins: 400000, category: 'vip', badge: 'Castle', animationType: 'gondar', description: 'Ancient stone castle of Emperor Fasilides with waving banner' },
    { id: 'lalibela', nameEn: 'Lalibela Church', nameAm: 'ላሊበላ ቤተ ጊዮርጊስ', emoji: '⛪', etb: '50000', coins: 500000, category: 'vip', badge: 'Heritage', animationType: 'lalibela', description: 'Monolithic Bet Giyorgis rock church with sunset clouds & holy light' },
    { id: 'erta_ale', nameEn: 'Erta Ale Volcano', nameAm: 'ኤርታሌ እሳተ ጎመራ', emoji: '🌋', etb: '60000', coins: 600000, category: 'vip', badge: 'Volcano', animationType: 'volcano', description: 'Bubbling molten lava lake of Danakil with glowing fire embers' },
    { id: 'plane', nameEn: 'Ethiopian Jet', nameAm: 'ቦይንግ ጄት', emoji: '✈️', etb: '75000', coins: 750000, category: 'vip', badge: 'Aviation', animationType: 'plane', description: 'Boeing 787 Dreamliner flying through clouds with tricolor smoke trails' },
    { id: 'satellite', nameEn: 'ETRSS-1 Satellite', nameAm: 'የኢትዮጵያ ሳተላይት', emoji: '🛰️', etb: '90000', coins: 900000, category: 'vip', badge: 'Space', animationType: 'satellite', description: 'High-tech satellite in Earth orbit with pulsing radio signals' },
    { id: 'national_honor', nameEn: 'National Honor', nameAm: 'ታላቅ ክብር', emoji: '🏆', etb: '100000', coins: 1000000, category: 'vip', badge: 'Legendary', animationType: 'honor', description: 'Supreme 24K Grand Ethiopian Gold Trophy with fireworks & confetti' }
];

// =========================================================================
// 2. REALISTIC 3D GRAPHICAL GIFT VISUAL WITH ACTIVE MOTION GRAPHICS
// =========================================================================

export const Gift3DIcon = ({ id, size = 56, animated = true, isHero = false }) => {
    const s = size;
    const [imgError, setImgError] = useState(false);

    const imgSrc = `/gifts/${id}.jpg`;

    // Specialized motion class
    const getMovementClass = () => {
        if (!animated) return '';
        switch (id) {
            case 'plane': return 'inplace-jet-flying';
            case 'car': return 'inplace-supercar-drift';
            case 'anbessa': return 'inplace-lion-roaring';
            case 'jebena': return 'inplace-jebena-pouring';
            case 'buna':
            case 'rekebot': return 'inplace-buna-steam';
            case 'bible':
            case 'quran': return 'inplace-book-opening';
            case 'adey_abeba':
            case 'rose': return 'inplace-flower-blooming';
            case 'mesob': return 'inplace-mesob-opening';
            case 'enjera': return 'inplace-feast-steam';
            case 'kebero': return 'inplace-kebero-beating';
            case 'masenqo': return 'inplace-masenqo-bowing';
            case 'krar': return 'inplace-krar-strumming';
            case 'shield': return 'inplace-shield-clash';
            case 'walia': return 'inplace-walia-cliff';
            case 'horse': return 'inplace-horse-galloping';
            case 'diamond': return 'inplace-gem-spinning';
            case 'crown': return 'inplace-crown-levitation';
            case 'axum': return 'inplace-axum-sunbeams';
            case 'gondar': return 'inplace-gondar-banner';
            case 'lalibela': return 'inplace-lalibela-clouds';
            case 'erta_ale': return 'inplace-erta-lava';
            case 'satellite': return 'inplace-satellite-orbit';
            case 'national_honor': return 'inplace-trophy-celebration';
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
            {/* Ambient Radial Glow Aura */}
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
                    <div className="gift-orb-fallback-emoji">
                        {id === 'adey_abeba' ? '🌼' :
                         id === 'rose' ? '🌹' :
                         id === 'buna' ? '☕' :
                         id === 'jebena' ? '🫖' :
                         id === 'mesob' ? '🧺' :
                         id === 'enjera' ? '🍲' :
                         id === 'bible' ? '📖' :
                         id === 'quran' ? '📗' :
                         id === 'kebero' ? '🪘' :
                         id === 'masenqo' ? '🎻' :
                         id === 'krar' ? '🎸' :
                         id === 'kemis' ? '👗' :
                         id === 'shield' ? '🛡️' :
                         id === 'rekebot' ? '☕' :
                         id === 'walia' ? '🐐' :
                         id === 'horse' ? '🏇' :
                         id === 'anbessa' ? '🦁' :
                         id === 'crown' ? '👑' :
                         id === 'diamond' ? '💎' :
                         id === 'car' ? '🏎️' :
                         id === 'axum' ? '🏛️' :
                         id === 'gondar' ? '🏰' :
                         id === 'lalibela' ? '⛪' :
                         id === 'erta_ale' ? '🌋' :
                         id === 'plane' ? '✈️' :
                         id === 'satellite' ? '🛰️' :
                         id === 'national_honor' ? '🏆' : '🎁'}
                    </div>
                )}
            </div>

            {/* DYNAMIC IN-PLACE MOTION GRAPHICS OVERLAYS */}
            {animated && (
                <div className="gift-motion-graphics-overlay">

                    {/* 📖 BIBLE & 📗 QURAN: Animated Opening Book Cover & Golden Turning Pages */}
                    {(id === 'bible' || id === 'quran') && (
                        <div className="motion-book-wrapper">
                            <div className="book-sacred-rays" />
                            <div className="book-page-turning page-1" />
                            <div className="book-page-turning page-2" />
                            <span className="book-floating-glyph">✨</span>
                        </div>
                    )}

                    {/* 🫖 CLAY JEBENA: Animated Pouring Coffee Stream & Steaming Cup */}
                    {id === 'jebena' && (
                        <div className="motion-jebena-wrapper">
                            <div className="pouring-coffee-stream" />
                            <div className="mini-sini-cup">
                                <span className="sini-ripple" />
                            </div>
                            <div className="jebena-steam-cloud">
                                <span className="steam-particle st-1" />
                                <span className="steam-particle st-2" />
                            </div>
                        </div>
                    )}

                    {/* ☕ SINI BUNA & REKEBOT: Steaming Aroma & Popping Beans */}
                    {(id === 'buna' || id === 'rekebot') && (
                        <div className="motion-buna-wrapper">
                            <div className="buna-steam-curls">
                                <span className="curl curl-1" />
                                <span className="curl curl-2" />
                                <span className="curl curl-3" />
                            </div>
                            <span className="floating-bean fb-1">☕</span>
                        </div>
                    )}

                    {/* 🏎️ ADDIS SUPERCAR: Drift Tire Smoke & Glowing Neon Underlight */}
                    {id === 'car' && (
                        <div className="motion-car-wrapper">
                            <div className="drift-tire-smoke left-smoke" />
                            <div className="drift-tire-smoke right-smoke" />
                            <div className="car-neon-glow" />
                            <div className="headlight-beam" />
                        </div>
                    )}

                    {/* ✈️ ETHIOPIAN BOEING JET: Flight Through Clouds with Tricolor Trails */}
                    {id === 'plane' && (
                        <div className="motion-jet-wrapper">
                            <div className="jet-tricolor-exhaust">
                                <span className="tricolor-trail t-green" />
                                <span className="tricolor-trail t-yellow" />
                                <span className="tricolor-trail t-red" />
                            </div>
                            <div className="flying-cloud-puff cp-1" />
                            <div className="flying-cloud-puff cp-2" />
                        </div>
                    )}

                    {/* 🦁 LION OF JUDAH: Roaring Jaw, Golden Eyes & Shockwave Rings */}
                    {id === 'anbessa' && (
                        <div className="motion-lion-wrapper">
                            <div className="lion-roar-shockwave ring-1" />
                            <div className="lion-roar-shockwave ring-2" />
                            <span className="lion-crown-glint">👑</span>
                            <span className="lion-eye-flash" />
                        </div>
                    )}

                    {/* 🌼 ADEY FLOWER & 🌹 ROSE: Unfurling Petals & Pollen Sparks */}
                    {(id === 'adey_abeba' || id === 'rose') && (
                        <div className="motion-flower-wrapper">
                            <span className="falling-petal fp-1">{id === 'rose' ? '🌹' : '🌼'}</span>
                            <span className="falling-petal fp-2">✨</span>
                            <div className="pollen-glow-ring" />
                        </div>
                    )}

                    {/* 🧺 MESOB: Conical Lid Lifting Revealing Hot Steam Inside */}
                    {id === 'mesob' && (
                        <div className="motion-mesob-wrapper">
                            <div className="mesob-lid-lift" />
                            <div className="mesob-steam-puff" />
                        </div>
                    )}

                    {/* 🍲 GURSHA FEAST: Steaming Doro Wot & Berbere Sparks */}
                    {id === 'enjera' && (
                        <div className="motion-feast-wrapper">
                            <span className="berbere-sparkle bs-1">🌶️</span>
                            <div className="feast-steam-wisp" />
                        </div>
                    )}

                    {/* 🪘 KEBERO DRUM: Animated Drumstick Rhythm & Acoustic Soundwaves */}
                    {id === 'kebero' && (
                        <div className="motion-kebero-wrapper">
                            <div className="acoustic-soundwave sw-1" />
                            <div className="acoustic-soundwave sw-2" />
                            <span className="music-rhythm-dot">🥁</span>
                        </div>
                    )}

                    {/* 🎻 MASENQO & 🎸 KRAR: Bow Gliding & Floating Musical Notes */}
                    {(id === 'masenqo' || id === 'krar') && (
                        <div className="motion-music-wrapper">
                            <span className="floating-note fn-1">♪</span>
                            <span className="floating-note fn-2">♫</span>
                            <span className="floating-note fn-3">♬</span>
                        </div>
                    )}

                    {/* 🛡️ WARRIOR SHIELD: Clashing Golden Spears & Lens Flare */}
                    {id === 'shield' && (
                        <div className="motion-shield-wrapper">
                            <div className="shield-clash-spark" />
                            <span className="spear-glint">⚔️</span>
                        </div>
                    )}

                    {/* 🐐 WALIA IBEX & 🏇 HORSE: Mountain Mist & Galloping Dust */}
                    {(id === 'walia' || id === 'horse') && (
                        <div className="motion-beast-wrapper">
                            <div className="motion-dust-cloud dc-1" />
                            <div className="motion-dust-cloud dc-2" />
                        </div>
                    )}

                    {/* 💎 DIAMOND & 👑 CROWN: Multi-Faceted Rainbow Sparkles */}
                    {(id === 'diamond' || id === 'crown' || id === 'national_honor') && (
                        <div className="motion-gem-wrapper">
                            <div className="gem-starburst-ray" />
                            <span className="gem-sparkle-speck sp-1">✨</span>
                            <span className="gem-sparkle-speck sp-2">🌟</span>
                        </div>
                    )}

                    {/* 🏛️ AXUM & ⛪ LALIBELA & 🏰 GONDAR: Rotating Sunbeam Halo */}
                    {(id === 'axum' || id === 'lalibela' || id === 'gondar') && (
                        <div className="motion-heritage-wrapper">
                            <div className="heritage-sunbeam-wheel" />
                            <span className="heritage-divine-star">⭐</span>
                        </div>
                    )}

                    {/* 🌋 ERTA ALE: Bubbling Molten Lava & Fire Embers */}
                    {id === 'erta_ale' && (
                        <div className="motion-volcano-wrapper">
                            <span className="fire-ember fe-1" />
                            <span className="fire-ember fe-2" />
                            <div className="lava-heat-pulse" />
                        </div>
                    )}

                    {/* 🛰️ SATELLITE: Orbital Signal Pulses & Solar Flares */}
                    {id === 'satellite' && (
                        <div className="motion-satellite-wrapper">
                            <div className="radio-pulse-circle rc-1" />
                            <div className="radio-pulse-circle rc-2" />
                            <span className="satellite-solar-flare" />
                        </div>
                    )}

                </div>
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
    const [animationPhase, setAnimationPhase] = useState('running');

    useEffect(() => {
        if (gift?.id === 'anbessa') {
            playAudioEffect('lion_roar');
            const timer = setTimeout(() => setAnimationPhase('roaring'), 900);
            return () => clearTimeout(timer);
        } else if (gift?.id === 'car') {
            playAudioEffect('car_rev');
        } else if (gift?.id === 'plane') {
            playAudioEffect('jet_flyby');
        } else if (gift?.id === 'bible' || gift?.id === 'quran' || gift?.id === 'lalibela' || gift?.id === 'axum' || gift?.id === 'gondar') {
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
                    <span className="live-pulse-dot" />
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
                        <div className="savanna-dust-storm" />
                        <div className="lion-graphic-body">
                            <Gift3DIcon id="anbessa" size={240} isHero={true} />
                        </div>

                        {animationPhase === 'roaring' && (
                            <>
                                <div className="roar-shockwave wave-1" />
                                <div className="roar-shockwave wave-2" />
                                <div className="roar-shockwave wave-3" />
                                <div className="roar-text-banner">🦁 ROAAARRR! የይሁዳ አንበሳ 👑</div>
                            </>
                        )}
                    </div>
                )}

                {/* 🏎️ ADDIS SUPERCAR: High-Speed Burnout & Drift */}
                {gift.id === 'car' && (
                    <div className="supercar-motion-wrapper">
                        <div className="tire-burnout-smoke" />
                        <div className="supercar-graphic-body">
                            <Gift3DIcon id="car" size={240} isHero={true} />
                        </div>
                        <div className="speed-lines" />
                        <div className="roar-text-banner">🏎️ VROOOOM! አዲስ ሱፐርካር ⚡</div>
                    </div>
                )}

                {/* ✈️ ETHIOPIAN JET: Sky Flyby with Tricolor Vapor Trail */}
                {gift.id === 'plane' && (
                    <div className="jet-flyby-wrapper">
                        <div className="jet-tricolor-trail" />
                        <div className="jet-graphic-body">
                            <Gift3DIcon id="plane" size={260} isHero={true} />
                        </div>
                        <div className="sonic-boom-ring" />
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

                {/* 📖 BIBLE / 📗 QURAN / ⛪ LALIBELA / 🏛️ AXUM / 🏰 GONDAR: Divine Heavenly Beams */}
                {(gift.id === 'bible' || gift.id === 'quran' || gift.id === 'lalibela' || gift.id === 'axum' || gift.id === 'gondar') && (
                    <div className="sacred-light-wrapper">
                        <div className="heavenly-sunbeams" />
                        <div className="sacred-center-object">
                            <Gift3DIcon id={gift.id} size={230} isHero={true} />
                        </div>
                        <div className="roar-text-banner">✨ SACRED ETHIOPIAN HERITAGE 🙏</div>
                    </div>
                )}

                {/* 🫖 JEBENA / ☕ BUNA / 🧺 MESOB / 👑 CROWN / 💎 DIAMOND / 🏆 HONOR: Radiant Celebration */}
                {(!['anbessa', 'car', 'plane', 'adey_abeba', 'rose', 'bible', 'quran', 'lalibela', 'axum', 'gondar'].includes(gift.id)) && (
                    <div className="radiant-celebration-wrapper">
                        <div className="golden-burst-particles" />
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
