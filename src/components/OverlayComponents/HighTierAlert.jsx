import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GonderCastleMotif, TibebBorder } from '../../assets/AlertAssets/EthiopianPatterns';
import { playHighTierAudio } from '../../assets/AlertAssets/alertAudio';

/**
 * High Tier Alert (201+ ETB)
 * Theme: The Ethereal Gonderian Castle (Hero-Level Full-Screen Constructive Motion)
 * Full-screen light particles build a stylized Gonder castle across layout,
 * with fireworks particle explosions, triumphant fanfare, and 12-second timeout.
 */
export default function HighTierAlert({ alert, isExiting }) {
    const senderName = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Hero Supporter';
    const amount = Number(alert?.amount || 0).toLocaleString();
    const message = alert?.message;
    const canvasRef = useRef(null);

    useEffect(() => {
        playHighTierAudio();
    }, []);

    // Full-screen dynamic canvas fireworks particle engine
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let rockets = [];

        canvas.width = window.innerWidth || 1920;
        canvas.height = window.innerHeight || 1080;

        const colors = [
            '#F59E0B', '#FDE68A', '#10B981', '#34D399',
            '#EF4444', '#F87171', '#38BDF8', '#FFFFFF'
        ];

        class Rocket {
            constructor(targetX, targetY) {
                this.x = targetX + (Math.random() - 0.5) * 200;
                this.y = canvas.height;
                this.targetY = targetY;
                this.speed = 10 + Math.random() * 6;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.exploded = false;
            }
            update() {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.exploded = true;
                    this.explode();
                }
            }
            explode() {
                const count = 45 + Math.floor(Math.random() * 30);
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 2 + Math.random() * 8;
                    particles.push({
                        x: this.x,
                        y: this.y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        alpha: 1,
                        decay: 0.012 + Math.random() * 0.015,
                        color: this.color,
                        size: 2.5 + Math.random() * 3.5
                    });
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Spawn firework volleys
        let timer = 0;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            timer++;
            // Launch rockets periodically
            if (timer % 24 === 0 && timer < 380) {
                const tx = 300 + Math.random() * (canvas.width - 600);
                const ty = 120 + Math.random() * 300;
                rockets.push(new Rocket(tx, ty));
            }

            // Update rockets
            for (let i = rockets.length - 1; i >= 0; i--) {
                rockets[i].update();
                rockets[i].draw();
                if (rockets[i].exploded) {
                    rockets.splice(i, 1);
                }
            }

            // Update explosion particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.08; // gravity
                p.vx *= 0.98; // air drag
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.restore();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        // Launch initial triple volley immediately
        rockets.push(new Rocket(canvas.width * 0.3, 200));
        rockets.push(new Rocket(canvas.width * 0.5, 160));
        rockets.push(new Rocket(canvas.width * 0.7, 220));

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="tier-high-wrapper" style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
            userSelect: 'none',
            overflow: 'hidden'
        }}>
            {/* 1. Full-Screen Canvas Fireworks Layer */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />

            {/* 2. Ethereal Gonderian Castle Silhouette Materialization */}
            <motion.div
                initial={{ y: 220, opacity: 0, scale: 0.85 }}
                animate={{ 
                    y: 0, 
                    opacity: 1, 
                    scale: 1 
                }}
                exit={{ y: 140, opacity: 0, filter: 'blur(12px)' }}
                transition={{ 
                    duration: 1.1, 
                    ease: [0.16, 1, 0.3, 1] 
                }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}
            >
                {/* Radiant Light Beam Pillar Behind Castle */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '700px',
                    height: '420px',
                    background: 'radial-gradient(ellipse at bottom, rgba(245, 158, 11, 0.45) 0%, rgba(16, 185, 129, 0.25) 50%, transparent 80%)',
                    filter: 'blur(24px)',
                    zIndex: -1
                }} />

                <GonderCastleMotif width={980} height={380} />
            </motion.div>

            {/* 3. Hero Royal Announcement Plaque (Center Stage) */}
            <motion.div
                initial={{ scale: 0.6, y: -40, opacity: 0 }}
                animate={{ 
                    scale: 1, 
                    y: 0, 
                    opacity: 1 
                }}
                exit={{ scale: 0.85, y: -30, opacity: 0, filter: 'blur(10px)' }}
                transition={{ 
                    duration: 0.85, 
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1] 
                }}
                style={{
                    background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.96) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(180, 83, 9, 0.94) 100%)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '3px solid #F59E0B',
                    boxShadow: '0 0 65px rgba(245, 158, 11, 0.7), 0 0 35px rgba(16, 185, 129, 0.5), 0 30px 70px rgba(0, 0, 0, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
                    borderRadius: '32px',
                    padding: '2.5rem 4rem',
                    textAlign: 'center',
                    maxWidth: '820px',
                    width: '90%',
                    color: '#FFFFFF',
                    position: 'relative',
                    zIndex: 10,
                    marginBottom: '160px'
                }}
            >
                {/* Traditional Ethiopian Tibeb Ribbon along edges */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <TibebBorder height={9} color="#F59E0B" />
                </div>

                {/* Imperial Crown Emblem Header */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.35) 0%, rgba(16, 185, 129, 0.35) 100%)',
                    border: '1.5px solid #FDE68A',
                    padding: '0.45rem 1.4rem',
                    borderRadius: '9999px',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: '#FFFBEB',
                    textTransform: 'uppercase',
                    marginBottom: '1.25rem',
                    boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>👑</span>
                    GONDER ROYAL IMPERIAL GURSHA
                    <span style={{ fontSize: '1.2rem' }}>👑</span>
                </div>

                {/* Monumental Headline: "🎉 [SenderName] tipped [Amount] ETB!" */}
                <div style={{
                    fontSize: '2.85rem',
                    fontWeight: 900,
                    lineHeight: 1.2,
                    letterSpacing: '-0.03em',
                    color: '#FFFFFF',
                    textShadow: '0 0 35px rgba(255, 255, 255, 0.6), 0 4px 16px rgba(0, 0, 0, 0.9)',
                    marginBottom: message ? '1rem' : '0.25rem'
                }}>
                    <span>🎉 </span>
                    <span style={{
                        color: '#FFFBEB',
                        textShadow: '0 0 25px rgba(245, 158, 11, 0.9)'
                    }}>
                        {senderName}
                    </span>
                    <span style={{ color: '#E2E8F0', fontWeight: 700, margin: '0 0.5rem' }}>tipped</span>
                    <span style={{
                        color: '#10B981',
                        fontWeight: 900,
                        textShadow: '0 0 35px rgba(16, 185, 129, 0.9), 0 0 15px #34D399'
                    }}>
                        {amount} ETB!
                    </span>
                </div>

                {/* Supporter Royal Proclamation Bubble */}
                {message && (
                    <div style={{
                        marginTop: '0.9rem',
                        padding: '1rem 1.8rem',
                        background: 'rgba(0, 0, 0, 0.55)',
                        borderLeft: '5px solid #F59E0B',
                        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '0 16px 16px 0',
                        fontSize: '1.25rem',
                        lineHeight: 1.5,
                        color: '#F8FAFC',
                        fontStyle: 'italic',
                        boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.5)',
                        wordBreak: 'break-word'
                    }}>
                        "{message}"
                    </div>
                )}
            </motion.div>
        </div>
    );
}
