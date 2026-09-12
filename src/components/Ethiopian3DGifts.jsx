import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. 27 AUTHENTIC ETHIOPIAN CULTURAL VIRTUAL GIFTS CATALOG (10:1 COIN RATIO)
// =========================================================================

export const ETHIOPIAN_GIFTS_CATALOG = [
    // 🌼 Nature & Flora
    { id: 'adey_abeba', nameEn: 'Adey Flower', nameAm: 'አደይ አበባ', emoji: '🌼', etb: '10', coins: 100, category: 'nature', shortAm: 'የአዲስ ዓመት አበባ', description: 'Highland yellow New Year bloom', animationType: 'flower' },
    { id: 'rose', nameEn: 'Highland Rose', nameAm: 'ጽጌረዳ', emoji: '🌹', etb: '25', coins: 250, category: 'nature', shortAm: 'የደጋ ጽጌረዳ', description: 'Fresh Ethiopian highland red rose', animationType: 'flower' },
    
    // ☕ Food & Hospitality
    { id: 'buna', nameEn: 'Sini Buna', nameAm: 'ሲኒ ቡና', emoji: '☕', etb: '50', coins: 500, category: 'food', shortAm: 'ትኩስ ሲኒ ቡና', description: 'Freshly brewed Ethiopian coffee', animationType: 'steam' },
    { id: 'jebena', nameEn: 'Clay Jebena', nameAm: 'የሸክላ ጀበና', emoji: '🫖', etb: '100', coins: 1000, category: 'food', shortAm: 'ባህላዊ ጀበና', description: 'Authentic clay coffee pot', animationType: 'pour' },
    { id: 'mesob', nameEn: 'Mesob Basket', nameAm: 'ባህላዊ መሶብ', emoji: '🧺', etb: '150', coins: 1500, category: 'food', shortAm: 'የሐረር መሶብ', description: 'Handcrafted woven dining table', animationType: 'mesob' },
    { id: 'enjera', nameEn: 'Gursha Feast', nameAm: 'የሀበሻ ማዕድ', emoji: '🍲', etb: '200', coins: 2000, category: 'food', shortAm: 'በያይነቱ ማዕድ', description: 'Beyaynetu feast with Doro Wot', animationType: 'feast' },
    { id: 'rekebot', nameEn: 'Rekebot Set', nameAm: 'ረከቦትና ዕጣን', emoji: '☕', etb: '2000', coins: 20000, category: 'food', shortAm: 'የቡና ሥነ-ስርዓት', description: 'Complete coffee ceremony service', animationType: 'rekebot' },

    // 📖 Culture & Tradition
    { id: 'bible', nameEn: 'Holy Bible', nameAm: 'መጽሐፍ ቅዱስ', emoji: '📖', etb: '250', coins: 2500, category: 'culture', shortAm: 'ብራና መጽሐፍ', description: 'Leatherbound Ge’ez scriptures', animationType: 'book' },
    { id: 'quran', nameEn: 'Holy Quran', nameAm: 'ቅዱስ ቁርኣን', emoji: '📗', etb: '250', coins: 2500, category: 'culture', shortAm: 'ክቡር ቁርኣን', description: 'Gilded sacred scriptures', animationType: 'book' },
    { id: 'kemis', nameEn: 'Habesha Kemis', nameAm: 'የሐበሻ ቀሚስ', emoji: '👗', etb: '1000', coins: 10000, category: 'culture', shortAm: 'ጥልፍ የሐበሻ ቀሚስ', description: 'Handspun cotton dress with Tibeb', animationType: 'kemis' },
    { id: 'shield', nameEn: 'Warrior Shield', nameAm: 'ጋሻና ጦር', emoji: '🛡️', etb: '1500', coins: 15000, category: 'culture', shortAm: 'የጀግና ጋሻና ጦር', description: 'Embossed leather shield & spears', animationType: 'shield' },
    { id: 'crown', nameEn: 'Negus Crown', nameAm: 'የንጉሥ ዘውድ', emoji: '👑', etb: '10000', coins: 100000, category: 'culture', shortAm: 'የኢትዮጵያ ንጉሥ ዘውድ', description: 'Imperial 24K solid gold crown', animationType: 'crown' },
    { id: 'national_honor', nameEn: 'National Honor', nameAm: 'የክብር ሜዳሊያ', emoji: '🏅', etb: '100000', coins: 1000000, category: 'culture', shortAm: 'ታላቅ ብሔራዊ ክብር', description: 'Order of the Star of Ethiopia', animationType: 'honor' },

    // 🎶 Music & Performing Arts
    { id: 'kebero', nameEn: 'Kebero Drum', nameAm: 'ባህላዊ ከበሮ', emoji: '🪘', etb: '350', coins: 3500, category: 'music', shortAm: 'የበዓል ከበሮ', description: 'Traditional ceremonial drum', animationType: 'kebero' },
    { id: 'masenqo', nameEn: 'Masenqo Lute', nameAm: 'ማሲንቆ', emoji: '🎻', etb: '500', coins: 5000, category: 'music', shortAm: 'ባህላዊ ማሲንቆ', description: 'Single-string bowed lute', animationType: 'masenqo' },
    { id: 'krar', nameEn: 'Acoustic Krar', nameAm: 'ባህላዊ ክራር', emoji: '🎸', etb: '750', coins: 7500, category: 'music', shortAm: 'ባለ አምስት ክር ክራር', description: 'Traditional five-string lyre', animationType: 'krar' },

    // 🦁 Nature & Wildlife
    { id: 'walia', nameEn: 'Walia Ibex', nameAm: 'ዋሊያ አይቤክስ', emoji: '🐐', etb: '2500', coins: 25000, category: 'nature', shortAm: 'የሰሜን ተራሮች ዋሊያ', description: 'Endemic Simien mountain ibex', animationType: 'walia' },
    { id: 'horse', nameEn: 'Gadaa Horse', nameAm: 'የኦሮሞ ፈረስ', emoji: '🏇', etb: '3000', coins: 30000, category: 'nature', shortAm: 'የገዳ ሥርዓት ፈረስ', description: 'Ceremonial Oromo war steed', animationType: 'horse' },
    { id: 'anbessa', nameEn: 'Lion of Judah', nameAm: 'የይሁዳ አንበሳ', emoji: '🦁', etb: '5000', coins: 50000, category: 'nature', shortAm: 'ግርማ ሞገስ አንበሳ', description: 'Imperial Ethiopian lion', animationType: 'lion' },

    // 🏛️ Historical Landmarks
    { id: 'axum', nameEn: 'Axum Obelisk', nameAm: 'የአክሱም ሐውልት', emoji: '🏛️', etb: '35000', coins: 350000, category: 'places', shortAm: 'ጥንታዊ የአክሱም ሐውልት', description: 'Monolithic carved granite stela', animationType: 'axum' },
    { id: 'gondar', nameEn: 'Gondar Castle', nameAm: 'ፋሲል ግቢ', emoji: '🏰', etb: '40000', coins: 400000, category: 'places', shortAm: 'የአፄ ፋሲል ቤተ-መንግሥት', description: 'Medieval imperial stone castle', animationType: 'gondar' },
    { id: 'lalibela', nameEn: 'Lalibela Church', nameAm: 'ላሊበላ ቤተ ጊዮርጊስ', emoji: '⛪', etb: '50000', coins: 500000, category: 'places', shortAm: 'ከአንድ አለት የተፈለፈለው', description: 'Rock-hewn Bete Giyorgis church', animationType: 'lalibela' },
    { id: 'erta_ale', nameEn: 'Erta Ale', nameAm: 'ኤርታሌ እሳተ ጎመራ', emoji: '🌋', etb: '60000', coins: 600000, category: 'places', shortAm: 'የዳናኪል እሳተ ጎመራ', description: 'Active molten basaltic shield volcano', animationType: 'volcano' },

    // 🚀 Modern Ethiopia
    { id: 'diamond', nameEn: 'Precious Gem', nameAm: 'ቴሌብር አልማዝ', emoji: '💎', etb: '15000', coins: 150000, category: 'modern', shortAm: 'ደማቅ አልማዝ', description: 'Brilliant-cut radiant gemstone', animationType: 'diamond' },
    { id: 'car', nameEn: 'Addis Supercar', nameAm: 'ስፖርት መኪና', emoji: '🏎️', etb: '25000', coins: 250000, category: 'modern', shortAm: 'ዘመናዊ ስፖርት መኪና', description: 'High-performance luxury supercar', animationType: 'car' },
    { id: 'plane', nameEn: 'Ethiopian Jet', nameAm: 'የኢትዮጵያ አየር መንገድ', emoji: '✈️', etb: '75000', coins: 750000, category: 'modern', shortAm: 'ቦይንግ 787 ድሪምላይነር', description: 'Boeing 787 Dreamliner flagship', animationType: 'plane' },
    { id: 'satellite', nameEn: 'ETRSS-1 Satellite', nameAm: 'የኢትዮጵያ ሳተላይት', emoji: '🛰️', etb: '90000', coins: 900000, category: 'modern', shortAm: 'የመጀመሪያዋ ሳተላይት', description: 'Remote sensing satellite in orbit', animationType: 'satellite' }
];

export const GIFT_CATEGORIES = [
    { key: 'all', labelEn: 'All Gifts', labelAm: 'ሁሉም', icon: '🎁' },
    { key: 'food', labelEn: 'Food & Buna', labelAm: 'ምግብና ቡና', icon: '☕' },
    { key: 'music', labelEn: 'Music', labelAm: 'ሙዚቃ', icon: '🪘' },
    { key: 'culture', labelEn: 'Culture', labelAm: 'ባህል', icon: '🇪🇹' },
    { key: 'nature', labelEn: 'Nature', labelAm: 'ተፈጥሮ', icon: '🌼' },
    { key: 'places', labelEn: 'Landmarks', labelAm: 'ቦታዎች', icon: '🏛️' },
    { key: 'modern', labelEn: 'Modern', labelAm: 'ዘመናዊ', icon: '🚀' },
    { key: 'custom', labelEn: 'Custom', labelAm: 'ብጁ', icon: '✍️' }
];

// =========================================================================
// 2. TACTILE ETHIOPIAN GIFT VISUAL COMPONENT WITH OBJECT-SPECIFIC ANIMATIONS
// =========================================================================

export const Gift3DIcon = ({ id, size = 56, animated = true, isHero = false }) => {
    const s = size;
    const [imgError, setImgError] = useState(false);
    const [imgSrc, setImgSrc] = useState(`/gifts/${id}.png`);

    useEffect(() => {
        setImgSrc(`/gifts/${id}.png`);
        setImgError(false);
    }, [id]);

    // Object-specific motion class
    const getMovementClass = () => {
        if (!animated) return '';
        switch (id) {
            case 'jebena': return 'eth-anim-jebena';
            case 'buna': return 'eth-anim-buna';
            case 'rekebot': return 'eth-anim-rekebot';
            case 'kebero': return 'eth-anim-kebero';
            case 'masenqo': return 'eth-anim-masenqo';
            case 'krar': return 'eth-anim-krar';
            case 'bible':
            case 'quran': return 'eth-anim-book';
            case 'adey_abeba':
            case 'rose': return 'eth-anim-flower';
            case 'shield': return 'eth-anim-shield';
            case 'anbessa': return 'eth-anim-lion';
            case 'walia': return 'eth-anim-walia';
            case 'horse': return 'eth-anim-horse';
            case 'plane': return 'eth-anim-plane';
            case 'car': return 'eth-anim-car';
            case 'satellite': return 'eth-anim-satellite';
            case 'axum':
            case 'lalibela': return 'eth-anim-monument';
            case 'gondar': return 'eth-anim-gondar';
            case 'mesob': return 'eth-anim-mesob';
            case 'enjera': return 'eth-anim-feast';
            case 'crown':
            case 'national_honor': return 'eth-anim-regal';
            case 'diamond': return 'eth-anim-diamond';
            case 'kemis': return 'eth-anim-kemis';
            case 'erta_ale': return 'eth-anim-volcano';
            default: return 'eth-anim-calm';
        }
    };

    return (
        <div 
            className={`eth-gift-art-box ${getMovementClass()} ${isHero ? 'eth-gift-hero' : ''}`}
            data-gift-id={id}
            style={{ 
                width: `${s}px`, 
                height: `${s}px`,
                minWidth: `${s}px`,
                minHeight: `${s}px`,
                maxWidth: `${s}px`,
                maxHeight: `${s}px`,
                aspectRatio: '1 / 1',
                flexShrink: 0,
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
            }}
        >
            {/* Sacred Ambient Light Aura Behind Books */}
            {(id === 'bible' || id === 'quran') && (
                <div className={`book-sacred-glow ${id === 'quran' ? 'emerald' : 'gold'}`} />
            )}

            {/* Visual Frame */}
            <div 
                className="eth-gift-image-frame"
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent'
                }}
            >
                {!imgError ? (
                    <img 
                        src={imgSrc} 
                        alt={id}
                        className={`eth-gift-real-img ${id === 'bible' || id === 'quran' ? 'eth-book-real-img' : ''}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            aspectRatio: '1 / 1',
                            display: 'block'
                        }}
                        onError={() => {
                            setImgError(true);
                        }}
                        loading="lazy"
                    />
                ) : (
                    <div 
                        className="eth-gift-fallback-emoji"
                        style={{ 
                            fontSize: `${Math.max(22, Math.round(s * 0.52))}px`,
                            lineHeight: 1,
                            userSelect: 'none'
                        }}
                    >
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
                         id === 'national_honor' ? '🏅' : '🎁'}
                    </div>
                )}
            </div>
        </div>
    );
};

// =========================================================================
// 3. SUBTLE NATIVE WEB AUDIO EFFECTS (OPTIONAL & DISCREET)
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
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(75, now + 1.1);
            osc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.linearRampToValueAtTime(700, now + 0.5);
            filter.frequency.exponentialRampToValueAtTime(120, now + 1.8);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.85);

        } else if (type === 'car_rev') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(380, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(260, now + 1.2);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.25);

        } else if (type === 'jet_flyby') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(480, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 1.4);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3, now + 0.25);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.45);

        } else if (type === 'sacred_chime') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.09);

                gain.gain.setValueAtTime(0, now + i * 0.09);
                gain.gain.linearRampToValueAtTime(0.2, now + i * 0.09 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.1);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.09);
                osc.stop(now + i * 0.09 + 1.15);
            });

        } else {
            // Soft warm melodic chime
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.07);

                gain.gain.setValueAtTime(0, now + idx * 0.07);
                gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.07);
                osc.stop(now + idx * 0.07 + 0.45);
            });
        }
    } catch (e) {}
};

// =========================================================================
// 4. AUTHENTIC ETHIOPIAN CELEBRATION SHOWCASE MODAL
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
    useEffect(() => {
        if (!gift) return;
        if (gift.id === 'anbessa') {
            playAudioEffect('lion_roar');
        } else if (gift.id === 'car') {
            playAudioEffect('car_rev');
        } else if (gift.id === 'plane') {
            playAudioEffect('jet_flyby');
        } else if (['bible', 'quran', 'lalibela', 'axum', 'gondar'].includes(gift.id)) {
            playAudioEffect('sacred_chime');
        } else {
            playAudioEffect('chime');
        }
    }, [gift]);

    if (!gift) return null;

    return (
        <div className="eth-celebration-backdrop" onClick={onClose}>
            {/* Top Right Close Button */}
            <button className="eth-celebration-close-icon" onClick={onClose} title="Close">
                ✕
            </button>

            {/* Ambient Animated Sparkle Particles */}
            <div className="eth-celebration-particles" pointer-events="none">
                <span className="p-star p1">✦</span>
                <span className="p-star p2">✧</span>
                <span className="p-star p3">✦</span>
                <span className="p-star p4">✧</span>
                <span className="p-star p5">✦</span>
                <span className="p-star p6">✧</span>
            </div>

            {/* Top Supporter Live Banner */}
            <div className="eth-celebration-banner" onClick={e => e.stopPropagation()}>
                <div className="eth-celebration-supporter-card">
                    <div className="supporter-avatar-circle">
                        {supporterName ? supporterName.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div className="supporter-details-col">
                        <div className="supporter-headline">
                            <span className="supporter-name-bold">{supporterName}</span>
                            <span className="action-tag">sent a Gursha</span>
                        </div>
                        <div className="supporter-target">
                            to <strong className="creator-highlight">@{creatorName}</strong>
                        </div>
                    </div>
                    <div className="supporter-gift-badge">
                        <span>{gift.emoji || '🎁'}</span>
                    </div>
                </div>
            </div>

            {/* Central Celebration Hero Stage */}
            <div className="eth-celebration-stage" onClick={e => e.stopPropagation()}>
                <div className="eth-celebration-hero-art">
                    <div className="hero-art-spotlight" />
                    <Gift3DIcon id={gift.id} size={155} isHero={true} animated={true} />
                </div>

                <div className="eth-celebration-info">
                    <h1 className="hero-name-geez">{gift.nameAm}</h1>
                    <div className="hero-name-en-tag">{gift.nameEn}</div>
                    <div className="hero-value-pill">
                        <span className="hero-etb-val">{Number(amount).toLocaleString()} ETB</span>
                        <span className="hero-divider">&bull;</span>
                        <span className="hero-coin-val">🪙 {Number(coins).toLocaleString()} Coins</span>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="eth-celebration-bottom-bar" onClick={e => e.stopPropagation()}>
                {onComboClick && (
                    <button
                        className="eth-celebration-love-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onComboClick();
                            if (gift.id === 'anbessa') playAudioEffect('lion_roar');
                            else if (gift.id === 'car') playAudioEffect('car_rev');
                            else if (gift.id === 'plane') playAudioEffect('jet_flyby');
                            else playAudioEffect('chime');
                        }}
                    >
                        <span className="love-icon">❤️</span>
                        <span className="love-text">Send Love</span>
                        <span className="combo-count-badge">x{comboCount}</span>
                    </button>
                )}

                <button className="eth-celebration-dismiss-btn" onClick={onClose}>
                    Done
                </button>
            </div>
        </div>
    );
};

export const EthiopianGiftCelebrationModal = TikTokLiveGiftShowcase;
