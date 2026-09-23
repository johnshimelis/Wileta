import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MeskelPattern, TibebBorder } from '../../assets/AlertAssets/EthiopianPatterns';
import { playLowTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * Low Tier Alert (1 - 50 ETB)
 * Theme: Golden Meskel Pulse
 * Clean, elegant notification with pulsating gold Ethiopian cross and crisp slide-in box.
 */
export default function LowTierAlert({ alert, isExiting }) {
    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Supporter';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const message = alert?.message;

    useEffect(() => {
        playLowTierAudio();
    }, []);

    return (
        <div className="tier-low-wrapper" style={{
            position: 'absolute',
            top: '80px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            zIndex: 9999,
            pointerEvents: 'none',
            userSelect: 'none'
        }}>
            {/* 1. Pulsing Golden Meskel Light Emblem */}
            <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ 
                    scale: [0, 1.15, 1],
                    rotate: 0,
                    opacity: 1
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'relative',
                    width: '90px',
                    height: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}
            >
                {/* Radial Glow Waves */}
                <div className="meskel-pulse-ring-1" />
                <div className="meskel-pulse-ring-2" />
                <MeskelPattern size={88} color="#F59E0B" />
            </motion.div>

            {/* 2. Sleek Glassmorphism Notification Capsule */}
            <motion.div
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 80, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 78, 59, 0.92) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '2px solid #F59E0B',
                    boxShadow: '0 0 35px rgba(245, 158, 11, 0.35), 0 15px 35px rgba(0, 0, 0, 0.6)',
                    borderRadius: '20px',
                    padding: '1.25rem 1.75rem',
                    minWidth: '340px',
                    maxWidth: '480px',
                    color: '#FFFFFF',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Traditional Ethiopian Tibeb Accent Stripe at top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TibebBorder height={6} color="#10B981" />
                </div>

                {/* Subtitle Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#FDE68A',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                }}>
                    <span style={{ fontSize: '0.85rem' }}>☕</span>
                    GURSHA TIP RECEIVED
                </div>

                {/* Main Headline: "🎉 [SenderName] tipped [Amount] ETB!" */}
                <div style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.35rem'
                }}>
                    <span>🎉</span>
                    <span style={{ color: '#F8FAFC' }}>{senderName}</span>
                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>tipped</span>
                    <span style={{ color: '#10B981', textShadow: '0 0 15px rgba(16, 185, 129, 0.6)' }}>
                        {amount} ETB!
                    </span>
                </div>

                {/* Supporter Message (if present) */}
                {message && (
                    <div style={{
                        marginTop: '0.6rem',
                        padding: '0.5rem 0.85rem',
                        background: 'rgba(0, 0, 0, 0.35)',
                        borderLeft: '3px solid #F59E0B',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.95rem',
                        color: '#E2E8F0',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                        wordBreak: 'break-word'
                    }}>
                        "{message}"
                    </div>
                )}
            </motion.div>

            {/* Embedded Keyframes for Meskel Pulse */}
            <style dangerouslySetInnerHTML={{__html: `
                .meskel-pulse-ring-1 {
                    position: absolute;
                    inset: -10px;
                    border-radius: 50%;
                    border: 2px solid rgba(245, 158, 11, 0.6);
                    animation: meskelPulseWave 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
                    pointer-events: none;
                }
                .meskel-pulse-ring-2 {
                    position: absolute;
                    inset: -20px;
                    border-radius: 50%;
                    border: 1.5px solid rgba(16, 185, 129, 0.4);
                    animation: meskelPulseWave 2s cubic-bezier(0.25, 1, 0.5, 1) infinite 0.6s;
                    pointer-events: none;
                }
                @keyframes meskelPulseWave {
                    0% {
                        transform: scale(0.6);
                        opacity: 0.9;
                    }
                    100% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                }
            `}} />
        </div>
    );
}
