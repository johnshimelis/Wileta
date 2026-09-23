import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLowTierAudio, playMidTierAudio, playHighTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * CinematicAlert Component
 * Broadcast-grade transparent WebM video player with synchronized 3D typography for OBS / TikTok LIVE Studio.
 * - Plays pre-rendered .webm videos with native alpha channel transparency
 * - Triggers 3D spring-physics typography at the video's climax
 * - Automatically signals onComplete() when <video> fires onEnded
 */
export default function CinematicAlert({ alert, config, onComplete }) {
    const videoRef = useRef(null);
    const [showText, setShowText] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);
    const hasCompletedRef = useRef(false);

    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Supporter';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const message = alert?.message;

    const safeComplete = () => {
        if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            if (onComplete) onComplete();
        }
    };

    // Play synchronized audio on mount
    useEffect(() => {
        if (config.audioTier === 'high') {
            playHighTierAudio();
        } else if (config.audioTier === 'mid') {
            playMidTierAudio();
        } else {
            playLowTierAudio();
        }
    }, [config.audioTier]);

    // Synchronize 3D typography to video climax timing
    const handleVideoPlay = () => {
        const delay = config.climaxDelay || 600;
        setTimeout(() => {
            setShowText(true);
        }, delay);
    };

    // Video playback ended -> unmount alert and advance queue
    const handleVideoEnded = () => {
        console.log(`[CinematicAlert] Video ended for alert ${alert.id}`);
        // Allow brief exit grace period
        setTimeout(() => {
            safeComplete();
        }, 300);
    };

    // Fallback if video file is missing or unsupported in the environment
    const handleVideoError = (e) => {
        console.warn(`[CinematicAlert] Video source (${config.videoSrc}) could not load, using procedural fallback:`, e?.target?.error);
        setVideoFailed(true);
        setShowText(true);

        // Safety fallback duration so queue always advances
        const fallbackDuration = config.fallbackDuration || 6000;
        setTimeout(() => {
            safeComplete();
        }, fallbackDuration);
    };

    // Safety timeout in case video stalls or fails to trigger onEnded
    useEffect(() => {
        const maxSafetyDuration = (config.fallbackDuration || 10000) + 3000;
        const safetyTimer = setTimeout(() => {
            console.log('[CinematicAlert] Max safety duration reached, advancing queue.');
            safeComplete();
        }, maxSafetyDuration);

        return () => clearTimeout(safetyTimer);
    }, [config.fallbackDuration]);

    return (
        <div 
            className="cinematic-alert-wrapper"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: config.placement === 'lower_third' ? 'flex-end' : 'center',
                paddingBottom: config.placement === 'lower_third' ? '120px' : '0',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 9999,
                overflow: 'hidden',
                background: 'transparent'
            }}
        >
            {/* 1. Optional Dramatic Stream Dimming Overlay for Hero Tiers */}
            {config.enableStageDimming && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0.5, 0.7, 0] }}
                    transition={{ duration: 10, times: [0, 0.08, 0.5, 0.88, 1], ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.45) 45%, rgba(0, 0, 0, 0.88) 100%)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* 2. Transparent WebM 3D Video Element */}
            {!videoFailed ? (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    onPlay={handleVideoPlay}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: config.objectFit || 'contain',
                        pointerEvents: 'none',
                        background: 'transparent',
                        backgroundColor: 'transparent',
                        zIndex: 2,
                        filter: config.videoFilter || 'drop-shadow(0 0 45px rgba(245, 158, 11, 0.75))'
                    }}
                >
                    <source src={config.videoSrc} type="video/webm" />
                </video>
            ) : (
                /* Elegant Procedural Fallback Glow when local WebM file is not yet present */
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        width: '420px',
                        height: '420px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.55) 0%, rgba(16, 185, 129, 0.35) 45%, transparent 75%)',
                        filter: 'blur(35px)',
                        zIndex: 2
                    }}
                />
            )}

            {/* 3. Synchronized 3D Frameless Typography (No Box Background) */}
            <AnimatePresence>
                {showText && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.85, rotateX: -45, filter: 'blur(16px)' }}
                        transition={{ 
                            type: 'spring', 
                            stiffness: 100, 
                            damping: 14, 
                            mass: 1 
                        }}
                        style={{
                            position: 'relative',
                            zIndex: 10,
                            textAlign: 'center',
                            perspective: '1000px',
                            transformStyle: 'preserve-3d',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            marginTop: config.placement === 'center' ? '220px' : '0'
                        }}
                    >
                        {/* Floating 3D Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: config.badgeSize || '1.15rem',
                            fontWeight: 900,
                            color: '#FFFBEB',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            textShadow: '0 0 25px rgba(245, 158, 11, 1), 0 0 40px rgba(245, 158, 11, 0.8), 0 4px 14px rgba(0, 0, 0, 1)',
                            marginBottom: '0.4rem'
                        }}>
                            <span>{config.badgeIcon || '✨'}</span>
                            <span>{config.badgeText || 'LIVE GURSHA ALERT'}</span>
                            <span>{config.badgeIcon || '✨'}</span>
                        </div>

                        {/* Bold Glowing Text - NO Background Box */}
                        <div style={{
                            fontSize: config.titleSize || '3.5rem',
                            fontWeight: 900,
                            lineHeight: 1.15,
                            letterSpacing: '-0.03em',
                            color: '#FFFFFF',
                            textShadow: '0 0 45px rgba(255, 255, 255, 0.85), 0 0 90px rgba(245, 158, 11, 0.95), 0 6px 28px rgba(0, 0, 0, 1)'
                        }}>
                            <span style={{ color: '#FFFBEB' }}>{senderName}</span>
                            <span style={{ color: '#E2E8F0', fontWeight: 700, margin: '0 0.55rem' }}>sent</span>
                            <span style={{ 
                                color: '#10B981',
                                textShadow: '0 0 50px rgba(16, 185, 129, 1), 0 0 85px rgba(16, 185, 129, 0.8), 0 4px 18px #064E3B'
                            }}>
                                {amount} ETB!
                            </span>
                        </div>

                        {/* Supporter Message (Floating 3D Glow) */}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    marginTop: '0.85rem',
                                    fontSize: config.messageSize || '1.65rem',
                                    fontWeight: 800,
                                    color: '#F8FAFC',
                                    fontStyle: 'italic',
                                    maxWidth: '880px',
                                    marginInline: 'auto',
                                    textShadow: '0 0 30px rgba(0, 0, 0, 1), 0 0 15px rgba(245, 158, 11, 0.7), 0 4px 12px rgba(0, 0, 0, 0.95)',
                                    wordBreak: 'break-word'
                                }}
                            >
                                "{message}"
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
