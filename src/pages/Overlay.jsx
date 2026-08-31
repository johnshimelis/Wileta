import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Overlay() {
    const { creatorId } = useParams();
    const [searchParams] = useSearchParams();
    const [alert, setAlert] = useState(null);
    const [isExiting, setIsExiting] = useState(false);
    const [confetti, setConfetti] = useState([]);
    const alertTimeoutRef = useRef(null);
    const exitTimeoutRef = useRef(null);

    // Audio chime synthesis via Web Audio API (OBS browser compatible)
    const playAlertSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const playTone = (freq, start, duration, gainVal = 0.25) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(gainVal, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + duration);
            };

            const t = ctx.currentTime;
            // Upbeat celebratory fintech fanfare
            playTone(523.25, t, 0.35);        // C5
            playTone(659.25, t + 0.12, 0.35); // E5
            playTone(783.99, t + 0.24, 0.35); // G5
            playTone(1046.50, t + 0.36, 0.6); // C6
            playTone(1318.51, t + 0.48, 0.8); // E6
        } catch (err) {
            console.error('[Overlay Audio] Synthesis failed:', err);
        }
    };

    // Confetti particles generator
    const triggerConfetti = () => {
        const particles = [];
        const colors = ['#10B981', '#059669', '#34D399', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];
        for (let i = 0; i < 90; i++) {
            particles.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                size: 6 + Math.random() * 9,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.4,
                duration: 2.5 + Math.random() * 2.5,
                rotation: Math.random() * 360,
                shape: Math.random() > 0.4 ? 'circle' : 'square'
            });
        }
        setConfetti(particles);
    };

    const triggerTipAlert = (data) => {
        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);

        setIsExiting(false);
        setAlert(data);
        playAlertSound();
        triggerConfetti();

        // Start smooth exit transition at 9.2 seconds
        exitTimeoutRef.current = setTimeout(() => {
            setIsExiting(true);
        }, 9200);

        // Completely unmount/reset after exactly 10.0 seconds
        alertTimeoutRef.current = setTimeout(() => {
            setAlert(null);
            setIsExiting(false);
            setConfetti([]);
        }, 10000);
    };

    useEffect(() => {
        // Force transparent background for OBS Studio Browser Source
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';

        const socketBaseUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
            : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000'
                : 'https://wileta-backend.onrender.com');

        console.log(`[Overlay] Connecting to Socket server: ${socketBaseUrl}`);
        const socket = io(socketBaseUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            timeout: 10000
        });

        socket.on('connect', () => {
            console.log(`[Overlay] Connected! Joining creator room: ${creatorId}`);
            if (creatorId) {
                socket.emit('join', creatorId);
            }
        });

        // Listen to all possible tip notification events
        socket.on('tip_alert', (data) => {
            console.log('[Overlay] Received tip_alert:', data);
            triggerTipAlert(data);
        });

        socket.on('new_tip', (data) => {
            console.log('[Overlay] Received new_tip:', data);
            triggerTipAlert(data);
        });

        socket.on('disconnect', () => {
            console.log('[Overlay] Disconnected from socket server.');
        });

        // Test preview trigger via URL query param: /overlay/:id?preview=true
        if (searchParams.get('preview') === 'true' || searchParams.get('test') === 'true') {
            setTimeout(() => {
                triggerTipAlert({
                    amount: 50,
                    tipperPhone: '0912****78',
                    message: 'Keep making great content! Gursha from Addis Ababa ☕️🚀',
                    tx_ref: 'GP-SAMPLE-PREVIEW'
                });
            }, 1000);
        }

        return () => {
            socket.disconnect();
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
            if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
        };
    }, [creatorId, searchParams]);

    return (
        <div 
            id="obs-overlay-container"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                background: 'transparent',
                backgroundColor: 'transparent',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                pointerEvents: 'none',
                userSelect: 'none'
            }}
        >
            {/* Confetti Particle Layer */}
            {confetti.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        borderRadius: p.shape === 'circle' ? '50%' : '2px',
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `obsFall ${p.duration}s linear ${p.delay}s forwards`,
                        opacity: 0.85,
                        zIndex: 9998
                    }}
                />
            ))}

            {/* Radiant Alert Card */}
            {alert && (
                <div 
                    className={`obs-alert-card ${isExiting ? 'obs-exiting' : 'obs-entering'}`}
                    style={{
                        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(6, 78, 59, 0.94) 100%)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '2.5px solid #10B981',
                        boxShadow: '0 0 50px rgba(16, 185, 129, 0.55), 0 20px 40px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                        borderRadius: '28px',
                        padding: '2.25rem 3.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        maxWidth: '560px',
                        width: '90%',
                        zIndex: 9999,
                        position: 'relative'
                    }}
                >
                    {/* Top Shimmer Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.45)',
                        padding: '0.35rem 0.9rem',
                        borderRadius: '9999px',
                        fontSize: '0.825rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        color: '#34D399',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
                    }}>
                        <span style={{ fontSize: '0.95rem' }}>✨</span>
                        NEW GURSHA TIP RECEIVED!
                    </div>

                    {/* Glowing Logo / Gift Graphic */}
                    <div style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(15, 23, 42, 0.8) 70%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.75rem',
                        border: '2px solid #10B981',
                        boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)',
                        animation: 'obsPulse 1.8s ease-in-out infinite'
                    }}>
                        <img 
                            src="/gp-official-logo.png" 
                            alt="Gursha Logo" 
                            style={{ 
                                width: '46px', 
                                height: 'auto',
                                objectFit: 'contain'
                            }} 
                            onError={(e) => {
                                e.currentTarget.src = '/gurshapay-logo-new.png';
                            }}
                        />
                    </div>

                    {/* Huge Prominent Tip Amount */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        margin: '0.25rem 0 0.5rem'
                    }}>
                        <span style={{
                            fontSize: '4.25rem',
                            fontWeight: 900,
                            lineHeight: 1,
                            letterSpacing: '-0.04em',
                            color: '#10B981',
                            textShadow: '0 0 25px rgba(16, 185, 129, 0.75), 0 4px 12px rgba(0, 0, 0, 0.8)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}>
                            {Number(alert.amount || 0).toFixed(0)}
                        </span>
                        <span style={{
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            color: '#F59E0B',
                            textShadow: '0 0 15px rgba(245, 158, 11, 0.6)'
                        }}>
                            ETB
                        </span>
                    </div>

                    {/* Sender Identification */}
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#CBD5E1',
                        marginBottom: alert.message ? '1rem' : '0.5rem'
                    }}>
                        from <span style={{ color: '#F8FAFC', fontWeight: 800, textDecoration: 'underline', textDecorationColor: '#10B981' }}>
                            {alert.tipperPhone || alert.senderName || 'Anonymous Supporter'}
                        </span>
                    </div>

                    {/* Supporter's Message Bubble */}
                    {alert.message && (
                        <div style={{
                            padding: '0.85rem 1.4rem',
                            background: 'rgba(0, 0, 0, 0.4)',
                            borderLeft: '4px solid #10B981',
                            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '0 14px 14px 0',
                            maxWidth: '440px',
                            wordWrap: 'break-word',
                            color: '#F1F5F9',
                            fontSize: '1.05rem',
                            lineHeight: 1.45,
                            fontStyle: 'italic',
                            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)'
                        }}>
                            "{alert.message}"
                        </div>
                    )}
                </div>
            )}

            {/* Embedded CSS Animations */}
            <style dangerouslySetInnerHTML={{__html: `
                html, body, #root {
                    background: transparent !important;
                    background-color: transparent !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                }

                @keyframes obsFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(115vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                .obs-entering {
                    animation: obsPopIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .obs-exiting {
                    animation: obsFadeOut 0.8s cubic-bezier(0.7, 0, 0.84, 0) forwards;
                }

                @keyframes obsPopIn {
                    0% {
                        transform: scale(0.65) translateY(120px);
                        opacity: 0;
                    }
                    70% {
                        transform: scale(1.04) translateY(-8px);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes obsFadeOut {
                    0% {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0.85) translateY(80px);
                        opacity: 0;
                    }
                }

                @keyframes obsPulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
                    }
                    50% {
                        transform: scale(1.08);
                        box-shadow: 0 0 35px rgba(16, 185, 129, 0.85);
                    }
                }
            `}} />
        </div>
    );
}
