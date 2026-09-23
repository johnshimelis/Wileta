import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playLowTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * Tier 1 Alert (Sparkle, < 50 ETB)
 * Completely frameless: A sudden burst of golden confetti across the bottom third of the screen.
 * The text "[Name] sent [Amount] ETB!" floats directly over the stream with NO background box.
 */
export default function Tier1Alert({ alert }) {
    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Supporter';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const message = alert?.message;

    useEffect(() => {
        playLowTierAudio();

        // Sudden burst of golden/emerald confetti across the bottom third of the screen
        const end = Date.now() + 1800;
        const frame = () => {
            confetti({
                particleCount: 12,
                angle: 60,
                spread: 75,
                origin: { x: 0.1, y: 0.85 },
                colors: ['#F59E0B', '#FDE68A', '#10B981', '#34D399', '#FFFFFF'],
                disableForReducedMotion: true,
                zIndex: 99999
            });
            confetti({
                particleCount: 12,
                angle: 120,
                spread: 75,
                origin: { x: 0.9, y: 0.85 },
                colors: ['#F59E0B', '#FDE68A', '#10B981', '#34D399', '#FFFFFF'],
                disableForReducedMotion: true,
                zIndex: 99999
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    return (
        <div 
            className="frameless-tier1-container"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: '120px',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 9999
            }}
        >
            {/* Frameless Glowing Headline (Zero Box) */}
            <motion.div
                initial={{ y: 80, scale: 0.7, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: -60, scale: 0.85, opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    textAlign: 'center',
                    textShadow: '0 0 35px rgba(245, 158, 11, 0.9), 0 0 15px rgba(16, 185, 129, 0.8), 0 4px 16px rgba(0, 0, 0, 0.95)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
            >
                {/* Floating Ethereal Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: '#FDE68A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginBottom: '0.35rem',
                        textShadow: '0 0 12px rgba(245, 158, 11, 0.9), 0 2px 8px rgba(0, 0, 0, 0.9)'
                    }}
                >
                    <span>✨</span>
                    <span>GURSHA SPARKLE</span>
                    <span>✨</span>
                </motion.div>

                {/* Bold, Glowing Text - NO Box Background */}
                <div style={{
                    fontSize: '3rem',
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: '-0.03em',
                    color: '#FFFFFF'
                }}>
                    <span style={{ color: '#FFFBEB' }}>{senderName}</span>
                    <span style={{ color: '#E2E8F0', fontWeight: 700, margin: '0 0.45rem' }}>sent</span>
                    <span style={{ 
                        color: '#10B981',
                        textShadow: '0 0 40px rgba(16, 185, 129, 0.95), 0 0 15px #34D399, 0 4px 14px rgba(0, 0, 0, 0.9)' 
                    }}>
                        {amount} ETB!
                    </span>
                </div>

                {/* Supporter Message (Frameless Glowing Floating Text) */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        style={{
                            marginTop: '0.75rem',
                            fontSize: '1.45rem',
                            fontWeight: 700,
                            color: '#F8FAFC',
                            fontStyle: 'italic',
                            maxWidth: '750px',
                            marginInline: 'auto',
                            textShadow: '0 0 20px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.9)'
                        }}
                    >
                        "{message}"
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
