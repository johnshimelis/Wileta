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
                    console.warn('[GiftVideoAlert] Autoplay policy prevented unmuted video playback, retrying muted:', err?.message || err);
                    video.muted = true;
                    video.play().catch((e) => console.error('[GiftVideoAlert] Muted autoplay retry failed:', e));
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
                justifyContent: 'flex-end',
                paddingBottom: '24px',
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
                    bottom: 0,
                    width: '750px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at bottom, rgba(245, 158, 11, 0.26) 0%, rgba(16, 185, 129, 0.14) 40%, transparent 75%)',
                    filter: 'blur(50px)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />

            {/* Frameless Transparent Video Container Anchored to Bottom */}
            <motion.div
                initial={{ scale: 0.75, opacity: 0, y: 50 }}
                animate={{ 
                    scale: isExiting ? 0.92 : 1, 
                    opacity: isExiting ? 0 : 1, 
                    y: isExiting ? 20 : 0 
                }}
                exit={{ scale: 0.85, opacity: 0, y: 50 }}
                transition={{ 
                    type: 'spring', 
                    damping: 24, 
                    stiffness: 280,
                    duration: 0.5 
                }}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '850px',
                    maxHeight: '75vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
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
                            maxHeight: '72vh',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            background: 'transparent',
                            backgroundColor: 'transparent',
                            filter: 'drop-shadow(0 16px 40px rgba(0, 0, 0, 0.60)) drop-shadow(0 0 32px rgba(245, 158, 11, 0.40))'
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
