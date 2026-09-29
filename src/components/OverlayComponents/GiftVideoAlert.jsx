import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLowTierAudio, playMidTierAudio, playHighTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * GiftVideoAlert Component
 * Plays the exact video assigned to the given gift for OBS Studio and TikTok LIVE Studio.
 * 
 * Features:
 * - HTML5 <video> element with autoplay, playsinline, preload="auto"
 * - Does NOT loop, plays once and signals onComplete()
 * - Preserves aspect ratio with object-fit: contain and transparent background
 * - Creator's camera remains visible (does not cover full screen unnecessarily)
 * - Restarts cleanly from the beginning for every tip
 * - Leaves NO black rectangle or paused frame upon completion
 * - Includes safety timeout so consecutive tips in the queue never get stuck
 * - Preserves OBS audio capture with celebratory chime
 */
export default function GiftVideoAlert({ alert, giftInfo, onComplete, isExiting }) {
    const videoRef = useRef(null);
    const [videoFailed, setVideoFailed] = useState(false);
    const [showText, setShowText] = useState(false);
    const hasCompletedRef = useRef(false);

    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Supporter';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const giftName = giftInfo?.name || alert?.giftName || alert?.gift || 'Gursha Gift';
    const giftEmoji = giftInfo?.emoji || '🎁';
    const message = alert?.message;
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

    // Fast-start video playback & 3D text entrance
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.playbackRate = 1.0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('[GiftVideoAlert] Autoplay warning (OBS/Browser policy):', err?.message || err);
                    // If blocked by browser autoplay policy, retry unmuted or proceed
                    video.play().catch(() => {});
                });
            }
        }

        // Show typography at climax (350ms after video starts)
        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 350);

        return () => clearTimeout(textTimer);
    }, [videoSrc]);

    // Handle normal video completion
    const handleVideoEnded = () => {
        console.log(`[GiftVideoAlert] Video ended for gift: ${giftName} (${alert?.id})`);
        // Smooth exit delay before unmounting and advancing queue
        setTimeout(() => {
            safeComplete();
        }, 350);
    };

    // Fallback if video file fails to load or is missing in environment
    const handleVideoError = (e) => {
        console.warn(`[GiftVideoAlert] Video source (${videoSrc}) error, using procedural fallback:`, e?.target?.error);
        setVideoFailed(true);
        setShowText(true);

        // Fallback duration (6.5s) so the queue always advances
        setTimeout(() => {
            safeComplete();
        }, 6500);
    };

    // Safety timeout in case video stalls or fails to fire onEnded (14s max)
    useEffect(() => {
        const safetyTimer = setTimeout(() => {
            console.log('[GiftVideoAlert] Max safety duration reached, advancing queue.');
            safeComplete();
        }, 14000);

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
                justifyContent: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 9999,
                overflow: 'hidden',
                background: 'transparent',
                backgroundColor: 'transparent'
            }}
        >
            {/* Cinematic Stage Ambient Glow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isExiting ? 0 : [0, 0.45, 0.25, 0.45] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 6, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    width: '650px',
                    height: '650px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(16, 185, 129, 0.12) 40%, transparent 70%)',
                    filter: 'blur(60px)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />

            {/* Video Container (Preserves Aspect Ratio above creator camera) */}
            <motion.div
                initial={{ scale: 0.65, opacity: 0, y: 30 }}
                animate={{ 
                    scale: isExiting ? 0.9 : 1, 
                    opacity: isExiting ? 0 : 1, 
                    y: isExiting ? -20 : 0 
                }}
                exit={{ scale: 0.8, opacity: 0, y: -30 }}
                transition={{ 
                    type: 'spring', 
                    damping: 24, 
                    stiffness: 280,
                    duration: 0.5 
                }}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '680px',
                    maxHeight: '52vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    background: 'transparent',
                    backgroundColor: 'transparent'
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
                            maxWidth: '100%',
                            maxHeight: '48vh',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            background: 'transparent',
                            backgroundColor: 'transparent',
                            filter: 'drop-shadow(0 12px 36px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 28px rgba(245, 158, 11, 0.45))'
                        }}
                    />
                ) : (
                    /* Fallback Icon Glow if video fails */
                    <div style={{
                        fontSize: '110px',
                        filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.7))',
                        margin: '20px 0'
                    }}>
                        {giftEmoji}
                    </div>
                )}

                {/* Floating Gift Info Banner (Donor, Gift Name & Amount) */}
                <AnimatePresence>
                    {showText && !isExiting && (
                        <motion.div
                            initial={{ opacity: 0, y: 25, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 320 }}
                            style={{
                                marginTop: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px',
                                textAlign: 'center',
                                padding: '12px 28px',
                                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '24px',
                                border: '1.5px solid rgba(245, 158, 11, 0.55)',
                                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), 0 0 30px rgba(245, 158, 11, 0.28)',
                                maxWidth: '90vw'
                            }}
                        >
                            {/* Supporter Name */}
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 900,
                                color: '#FFFFFF',
                                letterSpacing: '-0.3px',
                                textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(253, 224, 71, 0.4)'
                            }}>
                                {senderName}
                            </div>

                            {/* Gift Badge & Amount */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 14px',
                                background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.22) 0%, rgba(16, 185, 129, 0.22) 100%)',
                                borderRadius: '12px',
                                border: '1px solid rgba(245, 158, 11, 0.45)'
                            }}>
                                <span style={{ fontSize: '18px' }}>{giftEmoji}</span>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: 800,
                                    color: '#FDE047',
                                    letterSpacing: '0.2px'
                                }}>
                                    sent {giftName}
                                </span>
                                <span style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    color: '#10B981',
                                    marginLeft: '4px'
                                }}>
                                    • {amount} ETB
                                </span>
                            </div>

                            {/* Supporter Message (if present) */}
                            {message && message.trim() && (
                                <div style={{
                                    marginTop: '4px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#E2E8F0',
                                    fontStyle: 'italic',
                                    maxWidth: '460px',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.35,
                                    textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                                }}>
                                    "{message}"
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
