import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lottie } from 'lottie-react';
import { obeliskLottieData } from '../../assets/AlertAssets/lottieAssets';
import { playMidTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * Tier 2 Alert (Obelisk / Satellite, 50 - 199 ETB)
 * Completely frameless: Cinematic Lottie player loading the Axum Celestial Beacon,
 * with framer-motion text dynamically following the stela energy core. Zero boxes.
 */
export default function Tier2Alert({ alert }) {
    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Supporter';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const message = alert?.message;

    useEffect(() => {
        playMidTierAudio();
    }, []);

    return (
        <div 
            className="frameless-tier2-container"
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
                zIndex: 9999
            }}
        >
            {/* 1. Cinematic Lottie Obelisk / Satellite Beacon */}
            <motion.div
                initial={{ scale: 0, y: 150, opacity: 0, rotate: -20 }}
                animate={{ 
                    scale: 1, 
                    y: 0, 
                    opacity: 1, 
                    rotate: 0 
                }}
                exit={{ scale: 0.7, y: -120, opacity: 0, filter: 'blur(12px)' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '380px',
                    height: '380px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: 'drop-shadow(0 0 45px rgba(56, 189, 248, 0.85)) drop-shadow(0 0 25px rgba(245, 158, 11, 0.6))'
                }}
            >
                <Lottie 
                    animationData={obeliskLottieData} 
                    loop={true} 
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                />

                {/* Vertical Ethereal Light Sweep Pillar */}
                <div style={{
                    position: 'absolute',
                    top: '-60px',
                    bottom: '-60px',
                    width: '4px',
                    background: 'linear-gradient(to bottom, transparent, #38BDF8, #F59E0B, transparent)',
                    boxShadow: '0 0 20px #38BDF8, 0 0 40px #F59E0B',
                    zIndex: -1
                }} />
            </motion.div>

            {/* 2. Frameless Floating Glowing Typography (No background card) */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    textAlign: 'center',
                    marginTop: '-20px',
                    textShadow: '0 0 35px rgba(56, 189, 248, 0.95), 0 0 15px rgba(245, 158, 11, 0.8), 0 4px 20px rgba(0, 0, 0, 0.95)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
            >
                {/* Floating Rune Subtitle */}
                <div style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    letterSpacing: '0.18em',
                    color: '#BAE6FD',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                }}>
                    🏛️ AXUM CELESTIAL BEACON 🏛️
                </div>

                {/* Monumental Headline */}
                <div style={{
                    fontSize: '3.2rem',
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: '-0.03em',
                    color: '#FFFFFF'
                }}>
                    <span style={{ 
                        color: '#F0F9FF',
                        textShadow: '0 0 30px rgba(56, 189, 248, 0.9)'
                    }}>
                        {senderName}
                    </span>
                    <span style={{ color: '#E0F2FE', fontWeight: 600, margin: '0 0.5rem' }}>sent</span>
                    <span style={{ 
                        color: '#F59E0B',
                        textShadow: '0 0 40px rgba(245, 158, 11, 0.95), 0 0 15px #FDE68A'
                    }}>
                        {amount} ETB!
                    </span>
                </div>

                {/* Floating Supporter Message */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        style={{
                            marginTop: '0.85rem',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#E0F2FE',
                            fontStyle: 'italic',
                            maxWidth: '820px',
                            marginInline: 'auto',
                            textShadow: '0 0 25px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.9)'
                        }}
                    >
                        "{message}"
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
