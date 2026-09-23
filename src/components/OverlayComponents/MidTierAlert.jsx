import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AxumObelisk, TibebBorder } from '../../assets/AlertAssets/EthiopianPatterns';
import { playMidTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * Mid Tier Alert (51 - 200 ETB)
 * Theme: The Axum Obelisk Construct
 * Premium vertical motion: An ethereal, transparent blue/gold obelisk of light
 * rises vertically from the bottom of the screen with fan's name & amount carved into the construct.
 */
export default function MidTierAlert({ alert, isExiting }) {
    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Supporter';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const message = alert?.message;

    // Upward-drifting light sparks along the stele
    const [sparks] = useState(() => {
        const arr = [];
        for (let i = 0; i < 24; i++) {
            arr.push({
                id: i,
                x: 30 + Math.random() * 40,
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 1.5,
                size: 3 + Math.random() * 5
            });
        }
        return arr;
    });

    useEffect(() => {
        playMidTierAudio();
    }, []);

    return (
        <div className="tier-mid-wrapper" style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2rem',
            zIndex: 9999,
            pointerEvents: 'none',
            userSelect: 'none'
        }}>
            {/* 1. Rising Axum Obelisk Light Construct */}
            <motion.div
                initial={{ y: 550, scaleY: 0.1, opacity: 0 }}
                animate={{ 
                    y: 0, 
                    scaleY: 1, 
                    opacity: 1 
                }}
                exit={{ y: 550, opacity: 0, filter: 'blur(10px)' }}
                transition={{ 
                    duration: 0.9, 
                    ease: [0.16, 1, 0.3, 1] 
                }}
                style={{
                    position: 'relative',
                    width: '180px',
                    height: '560px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    transformOrigin: 'bottom center'
                }}
            >
                {/* Floating Light Sparks */}
                {sparks.map(s => (
                    <motion.div
                        key={s.id}
                        initial={{ y: 0, opacity: 0.8 }}
                        animate={{ 
                            y: -480, 
                            opacity: [0.2, 0.9, 0] 
                        }}
                        transition={{ 
                            duration: s.duration, 
                            repeat: Infinity, 
                            delay: s.delay,
                            ease: 'linear'
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: `${s.x}%`,
                            width: `${s.size}px`,
                            height: `${s.size}px`,
                            borderRadius: '50%',
                            backgroundColor: '#38BDF8',
                            boxShadow: '0 0 10px #38BDF8, 0 0 20px #F59E0B',
                            pointerEvents: 'none'
                        }}
                    />
                ))}

                {/* Vertical Light Beam aura */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '120px',
                    height: '600px',
                    background: 'radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.45) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 80%)',
                    filter: 'blur(16px)',
                    zIndex: -1
                }} />

                <AxumObelisk width={170} height={540} />
            </motion.div>

            {/* 2. Carved Inscription Stela Plaque */}
            <motion.div
                initial={{ x: -60, y: 40, opacity: 0, scale: 0.92 }}
                animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                exit={{ x: -40, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(3, 105, 161, 0.92) 50%, rgba(15, 23, 42, 0.98) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '2.5px solid #38BDF8',
                    boxShadow: '0 0 45px rgba(56, 189, 248, 0.5), 0 0 25px rgba(245, 158, 11, 0.35), 0 20px 45px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
                    borderRadius: '24px',
                    padding: '1.85rem 2.4rem',
                    minWidth: '420px',
                    maxWidth: '540px',
                    color: '#FFFFFF',
                    position: 'relative',
                    marginBottom: '60px'
                }}
            >
                {/* Traditional Decorative Ribbon */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TibebBorder height={8} color="#38BDF8" />
                </div>

                {/* Ancient Aksumite Light Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.5)',
                    padding: '0.35rem 0.95rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.09em',
                    color: '#BAE6FD',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
                }}>
                    <span>🏛️</span>
                    AKSUM STELE BOOST
                </div>

                {/* Carved Rune Typography: "🎉 [SenderName] tipped [Amount] ETB!" */}
                <div style={{
                    fontSize: '1.9rem',
                    fontWeight: 900,
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    marginBottom: '0.5rem',
                    textShadow: '0 0 20px rgba(56, 189, 248, 0.8), 0 4px 12px rgba(0, 0, 0, 0.9)'
                }}>
                    <span style={{ marginRight: '0.4rem' }}>🎉</span>
                    <span style={{
                        color: '#F0F9FF',
                        borderBottom: '2px solid #38BDF8',
                        paddingBottom: '2px'
                    }}>
                        {senderName}
                    </span>
                    <span style={{ color: '#93C5FD', fontWeight: 600, margin: '0 0.4rem' }}>tipped</span>
                    <span style={{
                        color: '#F59E0B',
                        fontWeight: 900,
                        textShadow: '0 0 25px rgba(245, 158, 11, 0.9), 0 0 10px #FDE68A'
                    }}>
                        {amount} ETB!
                    </span>
                </div>

                {/* Supporter Message Plaque */}
                {message && (
                    <div style={{
                        marginTop: '0.8rem',
                        padding: '0.75rem 1.2rem',
                        background: 'rgba(0, 0, 0, 0.45)',
                        borderLeft: '4px solid #38BDF8',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0 12px 12px 0',
                        fontSize: '1.05rem',
                        color: '#E0F2FE',
                        fontStyle: 'italic',
                        lineHeight: 1.45,
                        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.4)'
                    }}>
                        "{message}"
                    </div>
                )}
            </motion.div>
        </div>
    );
}
