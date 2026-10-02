import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playLowTierAudio, playMidTierAudio, playHighTierAudio } from '../../assets/AlertAssets/alertAudio';

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
    'holy quran': 'Holy Quran (ቁርኣን)',
    'kebero drum': 'Kebero Drum (ከበሮ)',
    'kebero': 'Kebero Drum (ከበሮ)',
    'masenqo lute': 'Masenqo Lute (ማሲንቆ)',
    'masinqo': 'Masenqo Lute (ማሲንቆ)',
    'acoustic krar': 'Acoustic Krar (ክራር)',
    'kirar': 'Acoustic Krar (ክራር)',
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

/**
 * GiftVideoAlert Component (GurshaPay Live Gift Overlay)
 * Matches screenshot media_1790888306403.png:
 * - Floating golden-bordered dark translucent capsule pill with [🎁] Donor ★, sent [Emoji] [Gift], [+Amount ETB]
 * - Bottom-anchored frameless transparent gift video animation
 * - 100% CEF / OBS / TikTok LIVE Studio compatible:
 *   1. Guaranteed muted HTML5 video autoplay (CEF blocks unmuted autoplay without user gesture)
 *   2. Standard alpha compositing without mixBlendMode (avoids 0-alpha invisibility in CEF OSR)
 *   3. Absolute canonical CDN URLs with multi-tier fallback (bypasses 301 redirects)
 */
export default function GiftVideoAlert({ alert, giftInfo, onComplete, isExiting }) {
    const videoRef = useRef(null);
    const [videoFailed, setVideoFailed] = useState(false);
    const [retryIndex, setRetryIndex] = useState(0);
    const hasCompletedRef = useRef(false);

    const rawGiftName = (giftInfo?.name || alert?.giftName || alert?.gift || 'Adey Flower').trim();
    const giftKey = rawGiftName.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const formattedGiftName = AMHARIC_GIFT_NAMES[giftKey] || rawGiftName;
    const giftEmoji = giftInfo?.emoji || '🎁';
    const rawVideoSrc = giftInfo?.videoSrc || '/animations/adey_flower.mp4';
    const donorName = alert?.senderName || alert?.supporterName || alert?.sender || alert?.name || 'A Supporter';
    const amount = alert?.amount || '1';
    const currency = alert?.currency || 'ETB';

    // Build resilient list of fallback URLs
    const cleanPath = rawVideoSrc.startsWith('/') ? rawVideoSrc : `/${rawVideoSrc}`;
    const sourceCandidates = [
        `https://www.gurshapay.com${cleanPath}`,
        `https://wileta-backend.onrender.com${cleanPath}`,
        cleanPath
    ];

    const [currentSrc, setCurrentSrc] = useState(sourceCandidates[0]);

    const safeComplete = () => {
        if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            if (onComplete) onComplete();
        }
    };

    // Play appropriate celebratory audio chime for OBS on mount
    useEffect(() => {
        const tier = alert?.tier || giftInfo?.tier || 'tier1_sparkle';
        if (tier === 'tier3_lion' || tier === 'tier_high') {
            playHighTierAudio();
        } else if (tier === 'tier2_obelisk' || tier === 'tier_mid') {
            playMidTierAudio();
        } else {
            playLowTierAudio();
        }
    }, [alert?.tier, giftInfo?.tier]);

    // Fast-start video playback with guaranteed muted autoplay in CEF / TikTok LIVE Studio
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.defaultMuted = true;
            video.muted = true;
            video.currentTime = 0;
            video.playbackRate = 1.0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('[GiftVideoAlert] Autoplay retry with explicit muted:', err?.message || err);
                    video.defaultMuted = true;
                    video.muted = true;
                    video.play().catch((e) => console.error('[GiftVideoAlert] Muted autoplay retry failed:', e));
                });
            }
        }
    }, [currentSrc]);

    // Handle normal video completion
    const handleVideoEnded = () => {
        console.log(`[GiftVideoAlert] Video ended for gift: ${formattedGiftName} (${alert?.id})`);
        setTimeout(() => {
            safeComplete();
        }, 200);
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
            setTimeout(() => {
                safeComplete();
            }, 3500);
        }
    };

    // Safety timeout in case video stalls (12s max)
    useEffect(() => {
        const safetyTimer = setTimeout(() => {
            console.log('[GiftVideoAlert] Max safety duration reached, advancing queue.');
            safeComplete();
        }, 12000);

        return () => clearTimeout(safetyTimer);
    }, []);

    return (
        <div
            className="gift-video-alert-wrapper"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: 0,
                margin: 0,
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 9999,
                overflow: 'hidden',
                background: 'transparent',
                backgroundColor: 'transparent'
            }}
        >
            {/* Broadcast Pill Capsule (Matching media_1790888306403.png) */}
            <motion.div
                initial={{ opacity: 0, y: -25, scale: 0.92 }}
                animate={{ 
                    opacity: isExiting ? 0 : 1, 
                    y: isExiting ? -15 : 0, 
                    scale: isExiting ? 0.92 : 1 
                }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300, duration: 0.4 }}
                style={{
                    position: 'absolute',
                    top: '38vh',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 18px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '9999px',
                    border: '1.5px solid #F59E0B',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.35)',
                    maxWidth: '92vw'
                }}
            >
                {/* Left: Golden Circular Gift Icon */}
                <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    🎁
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
                    padding: '5px 14px',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    flexShrink: 0,
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
                }}>
                    +{amount} {currency}
                </div>
            </motion.div>

            {/* Frameless Transparent Video Container with 36px Top Radius and Higher Height reaching Middle of Device */}
            <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 30 }}
                animate={{ 
                    scale: isExiting ? 0.95 : 1, 
                    opacity: isExiting ? 0 : 1, 
                    y: isExiting ? 20 : 0 
                }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ 
                    type: 'spring', 
                    damping: 24, 
                    stiffness: 280,
                    duration: 0.45 
                }}
                style={{
                    position: 'relative',
                    width: '100vw',
                    maxWidth: '100vw',
                    height: '80vh',
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    zIndex: 2,
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: 0,
                    margin: 0,
                    borderTopLeftRadius: '36px',
                    borderTopRightRadius: '36px',
                    overflow: 'hidden'
                }}
            >
                {!videoFailed ? (
                    <video
                        ref={videoRef}
                        key={currentSrc}
                        src={currentSrc}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100vw',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                            objectPosition: 'bottom center',
                            pointerEvents: 'none',
                            background: 'transparent',
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                            borderTopLeftRadius: '36px',
                            borderTopRightRadius: '36px'
                        }}
                    />
                ) : (
                    /* Fallback Icon Glow if all video sources fail */
                    <div style={{
                        fontSize: '140px',
                        filter: 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.75))',
                        marginBottom: '30px'
                    }}>
                        {giftEmoji}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
