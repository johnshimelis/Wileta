import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lottie } from 'lottie-react';
import TransparentVideoCanvas from './TransparentVideoCanvas';
import { playLowTierAudio, playMidTierAudio, playHighTierAudio } from '../../assets/AlertAssets/alertAudio';
import adeyFlowerJson from '../../assets/animations/adey_flower.json';
import highlandRoseJson from '../../assets/animations/highland_rose.json';

const AMHARIC_GIFT_NAMES = {
    'sini buna cup': 'Sini Buna Cup (ሲኒ ቡና)',
    'buna': 'Sini Buna Cup (ሲኒ ቡና)',
    'coffee': 'Sini Buna Cup (ሲኒ ቡና)',
    'adey flower': 'Adey Flower (አደይ አበባ)',
    'adey abeba': 'Adey Flower (አደይ አበባ)',
    'highland rose': 'Highland Rose (ጽጌረዳ)',
    'clay jebena': 'Clay Jebena (ሸክላ ጀበና)',
    'jebena': 'Clay Jebena (ሸክላ ጀበና)',
    'mesob basket': 'Mesob Basket (መሶብ)',
    'mesob': 'Mesob Basket (መሶብ)',
    'gursha feast': 'Gursha Feast (የበየነት ጉርሻ)',
    'holy bible': 'Holy Bible (መጽሐፍ ቅዱስ)',
    'bible': 'Holy Bible (መጽሐፍ ቅዱስ)',
    'holy quran': 'Holy Quran (ቁርኣን)',
    'quran': 'Holy Quran (ቁርኣን)',
    'kebero drum': 'Kebero Drum (ከበሮ)',
    'kebero': 'Kebero Drum (ከበሮ)',
    'masenqo lute': 'Masenqo Lute (ማሲንቆ)',
    'masenqo': 'Masenqo Lute (ማሲንቆ)',
    'masinqo': 'Masenqo Lute (ማሲንቆ)',
    'acoustic krar': 'Acoustic Krar (ክራር)',
    'kirar': 'Acoustic Krar (ክራር)',
    'krar': 'Acoustic Krar (ክራር)',
    'habesha kemis': 'Habesha Kemis (ሐበሻ ቀሚስ)',
    'warrior shield': 'Warrior Shield (የጦር ጋሻ)',
    'walia ibex': 'Walia Ibex (ዋሊያ)',
    'gadaa horse': 'Gadaa Horse (የገዳ ፈረስ)',
    'lion of judah': 'Lion of Judah (የይሁዳ አንበሳ)',
    'negus crown': 'Negus Crown (የንጉሥ ዘውድ)',
    'telebirr gem': 'Telebirr Gem (ቴሌብር አልማዝ)',
    'addis supercar': 'Addis Supercar (አዲስ ሱፐርካር)',
    'axum obelisk': 'Axum Obelisk (የአክሱም ሐውልት)',
    'lalibela church': 'Lalibela Church (የላሊበላ ቤተክርስቲያን)',
    'ethiopian jet': 'Ethiopian Jet (የኢትዮጵያ ጄት)'
};

const GIFT_EMOJIS = {
    'holy bible': '📖',
    'bible': '📖',
    'holy quran': '📗',
    'quran': '📗',
    'masenqo lute': '🎻',
    'masenqo': '🎻',
    'masinqo': '🎻',
    'acoustic krar': '🪕',
    'kirar': '🪕',
    'krar': '🪕',
    'clay jebena': '🫖',
    'jebena': '🫖',
    'sini buna cup': '☕',
    'coffee': '☕',
    'buna': '☕',
    'adey flower': '🌼',
    'adey': '🌼',
    'highland rose': '🌹',
    'rose': '🌹',
    'mesob basket': '🧺',
    'mesob': '🧺',
    'gursha feast': '🍲',
    'gursha': '🍲',
    'kebero drum': '🪘',
    'kebero': '🪘',
    'habesha kemis': '👗',
    'kemis': '👗',
    'warrior shield': '🛡️',
    'shield': '🛡️',
    'walia ibex': '🐐',
    'walia': '🐐',
    'gadaa horse': '🐎',
    'horse': '🐎',
    'lion of judah': '🦁',
    'lion': '🦁',
    'negus crown': '👑',
    'crown': '👑',
    'telebirr gem': '💎',
    'gem': '💎',
    'addis supercar': '🏎️',
    'supercar': '🏎️',
    'axum obelisk': '🏛️',
    'obelisk': '🏛️',
    'lalibela church': '⛪',
    'lalibela': '⛪',
    'ethiopian jet': '✈️',
    'jet': '✈️'
};

function getGiftEmoji(name, fallbackEmoji) {
    if (!name) return fallbackEmoji || '🎁';
    const key = name.toLowerCase().replace(/[^\w\s]/g, '').trim();
    return GIFT_EMOJIS[key] || fallbackEmoji || '🎁';
}

/**
 * GiftVideoAlert Component (GurshaPay Live Gift Overlay for TikTok LIVE Studio & OBS)
 * 
 * Perfect alignment with native mobile overlay (Image 2) and TikTok Live standard (Image 3):
 * 1. Bottom Anchoring: Gift animation rests at the very bottom of the broadcast (bottom: 0, height: 65vh).
 * 2. Alert Pill: Anchored directly above the bottom animation (bottom: calc(65vh - 20px)), leaving streamer header clear.
 * 3. 100% Genuine Transparency:
 *    - For Lottie gifts (Adey Flower, Highland Rose): Crisp, transparent vector bloom with glowing particles.
 *    - For 3D Video gifts (Holy Bible, Lion, Supercar, Masinqo, Jebena, etc.): Hardware-accelerated WebGL Luma-Key canvas
 *      converts black background to 0-alpha pixels, outputting genuine transparent frames to OBS Studio & TikTok LIVE Studio.
 * 4. 100% Synchronized Playback: Alert pill, animation, and celebratory audio fanfare fire simultaneously.
 */
export default function GiftVideoAlert({ alert, giftInfo, onComplete, isExiting }) {
    const [videoFailed, setVideoFailed] = useState(false);
    const [retryIndex, setRetryIndex] = useState(0);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const hasCompletedRef = useRef(false);
    const hasStartedPlaybackRef = useRef(false);

    const rawGiftName = (giftInfo?.name || alert?.giftName || alert?.gift || 'Adey Flower').trim();
    const giftKey = rawGiftName.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const formattedGiftName = AMHARIC_GIFT_NAMES[giftKey] || rawGiftName;
    const giftEmoji = getGiftEmoji(giftKey, giftInfo?.emoji);
    const rawVideoSrc = giftInfo?.videoSrc || '/animations/adey_flower.mp4';
    const donorName = alert?.senderName || alert?.supporterName || alert?.sender || alert?.name || 'A Supporter';
    const amount = alert?.amount || '1';
    const currency = alert?.currency || 'ETB';

    // Check if this gift has a dedicated transparent Lottie vector animation
    const isAdey = giftKey.includes('adey') || giftKey.includes('flower') || giftKey.includes('አደይ');
    const isRose = giftKey.includes('rose') || giftKey.includes('ጽጌረዳ');
    const isLottieGift = isAdey || isRose;
    const lottieData = isRose ? highlandRoseJson : adeyFlowerJson;

    // Prioritize relative path for instant local caching, then canonical fallbacks
    const cleanPath = rawVideoSrc.startsWith('/') ? rawVideoSrc : `/${rawVideoSrc}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const sourceCandidates = useMemo(() => [
        cleanPath,
        `${origin}${cleanPath}`,
        `https://www.gurshapay.com${cleanPath}`,
        `https://wileta-backend.onrender.com${cleanPath}`
    ], [cleanPath, origin]);

    const [currentSrc, setCurrentSrc] = useState(sourceCandidates[0]);

    const safeComplete = () => {
        if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            if (onComplete) onComplete();
        }
    };

    // Play appropriate celebratory audio chime synchronized with video start
    const triggerAudio = () => {
        const tier = alert?.tier || giftInfo?.tier || 'tier1_sparkle';
        if (tier === 'tier3_lion' || tier === 'tier_high') {
            playHighTierAudio();
        } else if (tier === 'tier2_obelisk' || tier === 'tier_mid') {
            playMidTierAudio();
        } else {
            playLowTierAudio();
        }
    };

    // Fast-start synchronized playback
    const startSynchronizedShow = () => {
        if (hasStartedPlaybackRef.current) return;
        hasStartedPlaybackRef.current = true;
        setIsVideoReady(true);
        triggerAudio();
    };

    // Attempt video playback once loaded or via timeout fallback
    useEffect(() => {
        hasStartedPlaybackRef.current = false;
        setIsVideoReady(false);

        // Immediate readiness timeout guard: start at latest 300ms so alert is never stalled
        const fallbackTimer = setTimeout(() => {
            startSynchronizedShow();
        }, 300);

        return () => clearTimeout(fallbackTimer);
    }, [currentSrc]);

    const handleCanPlay = () => {
        startSynchronizedShow();
    };

    // Handle normal video completion
    const handleVideoEnded = () => {
        console.log(`[GiftVideoAlert] Video completed for gift: ${formattedGiftName} (${alert?.id})`);
        setTimeout(() => {
            safeComplete();
        }, 250);
    };

    // Resilient fallback if initial source fails
    const handleVideoError = (e) => {
        console.warn(`[GiftVideoAlert] Video source error for (${currentSrc}), attempt ${retryIndex}:`, e?.target?.error);
        if (retryIndex < sourceCandidates.length - 1) {
            const nextIdx = retryIndex + 1;
            setRetryIndex(nextIdx);
            setCurrentSrc(sourceCandidates[nextIdx]);
        } else {
            console.error(`[GiftVideoAlert] All video sources exhausted for ${rawVideoSrc}`);
            setVideoFailed(true);
            setIsVideoReady(true);
            setTimeout(() => {
                safeComplete();
            }, 3500);
        }
    };

    // Safety duration timeout (12s max)
    useEffect(() => {
        const safetyTimer = setTimeout(() => {
            console.log('[GiftVideoAlert] Max safety duration reached, advancing queue.');
            safeComplete();
        }, 12000);

        return () => clearTimeout(safetyTimer);
    }, []);

    // 12 Sparkle particles matching Image 2
    const sparkles = useMemo(() => [
        { id: 1, left: '35%', top: '15px', delay: 0, size: 16 },
        { id: 2, left: '60%', top: '25px', delay: 0.2, size: 20 },
        { id: 3, left: '42%', top: '50px', delay: 0.1, size: 24 },
        { id: 4, left: '55%', top: '75px', delay: 0.35, size: 18 },
        { id: 5, left: '30%', top: '90px', delay: 0.15, size: 22 },
        { id: 6, left: '68%', top: '110px', delay: 0.4, size: 16 },
        { id: 7, left: '48%', top: '135px', delay: 0.25, size: 26 },
        { id: 8, left: '38%', top: '160px', delay: 0.05, size: 18 },
        { id: 9, left: '58%', top: '180px', delay: 0.3, size: 22 },
        { id: 10, left: '45%', top: '210px', delay: 0.45, size: 20 },
        { id: 11, left: '32%', top: '235px', delay: 0.2, size: 14 },
        { id: 12, left: '64%', top: '250px', delay: 0.5, size: 18 }
    ], []);

    return (
        <div
            className="gift-video-alert-wrapper"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 9999,
                overflow: 'hidden',
                background: 'transparent',
                backgroundColor: 'transparent'
            }}
        >
            {/* Layer 1: Expanding Luminous Shockwave Ring behind Pill */}
            <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                    scale: isVideoReady && !isExiting ? [0.6, 1.8] : 0.4,
                    opacity: isVideoReady && !isExiting ? [0.8, 0] : 0
                }}
                transition={{ duration: 1.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.8 }}
                style={{
                    position: 'absolute',
                    bottom: 'calc(65vh - 35px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '320px',
                    height: '70px',
                    borderRadius: '9999px',
                    border: '2px solid rgba(245, 158, 11, 0.7)',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
                    pointerEvents: 'none',
                    zIndex: 25
                }}
            />

            {/* Layer 2: Broadcast Pill Capsule (Anchored directly above the bottom video) */}
            <motion.div
                initial={{ opacity: 0, y: -25, scale: 0.90 }}
                animate={{ 
                    opacity: (isVideoReady && !isExiting) ? 1 : 0, 
                    y: (isVideoReady && !isExiting) ? 0 : -20, 
                    scale: (isVideoReady && !isExiting) ? 1 : 0.90 
                }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: 'spring', damping: 22, stiffness: 320, duration: 0.4 }}
                style={{
                    position: 'absolute',
                    bottom: 'calc(65vh - 20px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 18px',
                    background: 'rgba(15, 23, 42, 0.90)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '9999px',
                    border: '1.8px solid #F59E0B',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.65), 0 0 24px rgba(245, 158, 11, 0.45)',
                    maxWidth: '92vw',
                    whiteSpace: 'nowrap'
                }}
            >
                {/* Left: Golden Circular Gift Medallion */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FBBF24, #D97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                    boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)'
                }}>
                    {giftEmoji}
                </div>

                {/* Middle: Donor & Gift Sent Description */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '16px',
                        letterSpacing: '-0.2px'
                    }}>
                        <span>{donorName}</span>
                        <span style={{ color: '#F59E0B', fontSize: '13px' }}>★</span>
                    </div>
                    <div style={{
                        color: '#FDE047',
                        fontWeight: 600,
                        fontSize: '13px'
                    }}>
                        sent {giftEmoji} {formattedGiftName}
                    </div>
                </div>

                {/* Right: Emerald Green Amount Pill */}
                <div style={{
                    background: '#10B981',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    flexShrink: 0,
                    boxShadow: '0 2px 12px rgba(16, 185, 129, 0.5)'
                }}>
                    +{amount} {currency}
                </div>
            </motion.div>

            {/* Layer 3: Creative Golden Sparkle Particles cascading around bottom video */}
            {isVideoReady && !isExiting && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '65vh',
                    pointerEvents: 'none',
                    zIndex: 25,
                    overflow: 'hidden'
                }}>
                    {sparkles.map((sp) => (
                        <motion.div
                            key={sp.id}
                            initial={{ opacity: 0, scale: 0.5, y: -10 }}
                            animate={{
                                opacity: [0, 0.9, 0],
                                scale: [0.6, 1.2, 0.8],
                                y: [0, 220],
                                rotate: [0, 180]
                            }}
                            transition={{
                                duration: 2.2,
                                delay: sp.delay,
                                repeat: Infinity,
                                ease: 'easeOut'
                            }}
                            style={{
                                position: 'absolute',
                                left: sp.left,
                                top: sp.top,
                                color: '#FDE047',
                                fontSize: `${sp.size}px`,
                                textShadow: '0 0 10px rgba(253, 224, 71, 0.8)',
                                pointerEvents: 'none'
                            }}
                        >
                            ✦
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Layer 4: Transparent Bottom-Anchored Animation Container matching Image 2 & 3 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 25 }}
                animate={{ 
                    opacity: (isVideoReady && !isExiting) ? 1 : 0, 
                    scale: (isVideoReady && !isExiting) ? 1 : 0.95, 
                    y: (isVideoReady && !isExiting) ? 0 : 20 
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ 
                    type: 'spring', 
                    damping: 24, 
                    stiffness: 280,
                    duration: 0.45 
                }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100vw',
                    height: '65vh',
                    maxHeight: '65vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    zIndex: 20,
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: 0,
                    margin: 0,
                    overflow: 'hidden'
                }}
            >
                {isLottieGift ? (
                    /* 100% Transparent Vector Lottie Animation for Flowers */
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                    }}>
                        <Lottie
                            animationData={lottieData}
                            loop={false}
                            autoplay={true}
                            onComplete={handleVideoEnded}
                            style={{
                                width: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                ) : !videoFailed ? (
                    /* Hardware-Accelerated WebGL Luma-Key Transparent Video for 3D Gifts */
                    <TransparentVideoCanvas
                        src={currentSrc}
                        onCanPlay={handleCanPlay}
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxHeight: '100%'
                        }}
                    />
                ) : (
                    /* Fallback Icon Glow if video cannot load */
                    <div style={{
                        fontSize: '140px',
                        filter: 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.75))',
                        marginBottom: '40px',
                        zIndex: 2
                    }}>
                        {giftEmoji}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
