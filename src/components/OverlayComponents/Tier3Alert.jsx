import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lottie } from 'lottie-react';
import confetti from 'canvas-confetti';
import { lionHeroLottieData } from '../../assets/AlertAssets/lottieAssets';
import { playHighTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * Tier 3 Alert (The Hero Animation - Lion of Judah / Royal Gonder Castle, 200+ ETB)
 * Completely frameless: Massive full-screen Lottie hero animation,
 * dark semi-transparent radial gradient lighting change on stream,
 * 3D transformed glowing monumental text, fireworks bursts, and powerful audio.
 */
export default function Tier3Alert({ alert }) {
    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Legendary Hero';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const message = alert?.message;

    useEffect(() => {
        playHighTierAudio();

        // Massive multi-angle fireworks barrage across the screen
        const duration = 5000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 35 * (timeLeft / duration);

            confetti({
                particleCount,
                startVelocity: 45,
                spread: 360,
                origin: { x: Math.random(), y: Math.random() * 0.5 },
                colors: ['#F59E0B', '#FDE68A', '#10B981', '#34D399', '#EF4444', '#FFFFFF'],
                disableForReducedMotion: true,
                zIndex: 99999
            });
        }, 350);

        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            className="frameless-tier3-container"
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
                overflow: 'hidden'
            }}
        >
            {/* 1. Dramatic Pulsing Stage Lighting Overlay (Simulates Stream Dimming) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: [0, 0.75, 0.55, 0.7, 0] 
                }}
                transition={{ 
                    duration: 11.5, 
                    times: [0, 0.08, 0.5, 0.88, 1],
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.45) 45%, rgba(0, 0, 0, 0.88) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />

            {/* 2. Massive Full-Screen Lottie Hero Animation (Lion of Judah / Supernova) */}
            <motion.div
                initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
                animate={{ 
                    scale: [0.3, 1.25, 1],
                    opacity: 1, 
                    rotate: 0 
                }}
                exit={{ scale: 0.6, opacity: 0, filter: 'blur(20px)' }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'absolute',
                    width: '750px',
                    height: '750px',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: 'drop-shadow(0 0 60px rgba(245, 158, 11, 0.9)) drop-shadow(0 0 35px rgba(16, 185, 129, 0.7))'
                }}
            >
                <Lottie 
                    animationData={lionHeroLottieData} 
                    loop={true} 
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </motion.div>

            {/* 3. 3D-Transformed Glowing Monumental Typography (Zero Boxes) */}
            <motion.div
                initial={{ y: 80, scale: 0.7, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: -80, scale: 0.85, opacity: 0, filter: 'blur(16px)' }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    perspective: '1200px',
                    transformStyle: 'preserve-3d',
                    marginTop: '260px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
            >
                {/* 3D Tilted Crown Banner */}
                <motion.div
                    animate={{ rotateX: [12, -4, 12] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        color: '#FFFBEB',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        textShadow: '0 0 25px rgba(245, 158, 11, 1), 0 0 50px rgba(245, 158, 11, 0.8), 0 4px 18px rgba(0, 0, 0, 1)',
                        marginBottom: '0.5rem',
                        transform: 'rotateX(10deg)'
                    }}
                >
                    <span>👑</span>
                    <span>ROYAL LION HERO GURSHA</span>
                    <span>👑</span>
                </motion.div>

                {/* Massive 3D Glowing Text */}
                <div style={{
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: '-0.04em',
                    color: '#FFFFFF',
                    transform: 'perspective(900px) rotateX(8deg)',
                    textShadow: '0 0 45px rgba(255, 255, 255, 0.8), 0 0 90px rgba(245, 158, 11, 0.9), 0 6px 30px rgba(0, 0, 0, 1)'
                }}>
                    <span style={{ 
                        color: '#FFFBEB',
                        textShadow: '0 0 40px rgba(245, 158, 11, 1), 0 0 80px rgba(245, 158, 11, 0.6)'
                    }}>
                        {senderName}
                    </span>
                    <span style={{ color: '#E2E8F0', fontWeight: 700, margin: '0 0.65rem' }}>sent</span>
                    <span style={{ 
                        color: '#10B981',
                        fontWeight: 900,
                        textShadow: '0 0 50px rgba(16, 185, 129, 1), 0 0 90px rgba(16, 185, 129, 0.8), 0 4px 20px #064E3B'
                    }}>
                        {amount} ETB!
                    </span>
                </div>

                {/* Supporter Royal Message (Floating 3D Glow) */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            marginTop: '1.25rem',
                            fontSize: '1.9rem',
                            fontWeight: 800,
                            color: '#F8FAFC',
                            fontStyle: 'italic',
                            maxWidth: '960px',
                            marginInline: 'auto',
                            transform: 'perspective(900px) rotateX(6deg)',
                            textShadow: '0 0 35px rgba(0, 0, 0, 1), 0 0 15px rgba(245, 158, 11, 0.6), 0 4px 14px rgba(0, 0, 0, 0.95)'
                        }}
                    >
                        "{message}"
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
