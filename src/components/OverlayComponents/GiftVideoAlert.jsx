import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLowTierAudio, playMidTierAudio, playHighTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * GiftVideoAlert Component (GurshaPay Live Gift Overlay)
 * Plays the exact video assigned to the given gift for OBS Studio and TikTok LIVE Studio.
 * Matches TikTok live gift animation aesthetic:
 * - Huge 3D animation anchored strictly at the bottom (covering lower ~65-75% of stream canvas)
 * - 100% transparent background (zero cards, zero donor badges, zero ambient glow or border boxes)
 * - Streamer camera remains 100% visible in the upper half
 * - Auto-plays once, never loops, disappears completely on finish with no black frame
 * - Supports screen blending so black background MP4s become 100% transparent over the camera
 * - Preserves OBS audio capture with celebratory chime
 */
export default function GiftVideoAlert({ alert, giftInfo, onComplete, isExiting }) {
    const videoRef = useRef(null);
    const [videoFailed, setVideoFailed] = useState(false);
    const hasCompletedRef = useRef(false);

    const giftName = giftInfo?.name || alert?.giftName || alert?.gift || 'Gursha Gift';
    const giftEmoji = giftInfo?.emoji || '🎁';
    const videoSrc = giftInfo?.videoSrc || '/animations/adey_flower.mp4';

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

    // Fast-start video playback from frame 0
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.playbackRate = 1.0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('[GiftVideoAlert] Autoplay policy prevented unmuted video playback, retrying muted:', err?.message || err);
                    video.muted = true;
                    video.play().catch((e) => console.error('[GiftVideoAlert] Muted autoplay retry failed:', e));
                });
            }
        }
    }, [videoSrc]);

    // Handle normal video completion
    const handleVideoEnded = () => {
        console.log(`[GiftVideoAlert] Video ended for gift: ${giftName} (${alert?.id})`);
        setTimeout(() => {
            safeComplete();
        }, 200);
    };

    // Fallback if video file fails to load or is missing in environment
    const handleVideoError = (e) => {
        console.warn(`[GiftVideoAlert] Video source (${videoSrc}) error:`, e?.target?.error);
        setVideoFailed(true);
        setTimeout(() => {
            safeComplete();
        }, 3500);
    };

    // Safety timeout in case video stalls or fails to fire onEnded (12s max)
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
            {/* Frameless Transparent Video Container Anchored strictly to the Bottom */}
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 40 }}
                animate={{ 
                    scale: isExiting ? 0.95 : 1, 
                    opacity: isExiting ? 0 : 1, 
                    y: isExiting ? 20 : 0 
                }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
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
                    height: '72vh',
                    maxHeight: '72vh',
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
                    margin: 0
                }}
            >
                {!videoFailed ? (
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        autoPlay
                        playsInline
                        preload="auto"
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100vw',
                            maxHeight: '72vh',
                            objectFit: 'contain',
                            objectPosition: 'bottom center',
                            pointerEvents: 'none',
                            background: 'transparent',
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                            mixBlendMode: 'screen'
                        }}
                    />
                ) : (
                    /* Fallback Icon Glow if video fails */
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
