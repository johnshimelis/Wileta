import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Overlay() {
    const { username, creatorId } = useParams();
    const targetIdentifier = username || creatorId;
    const [searchParams] = useSearchParams();
    const [alert, setAlert] = useState(null);
    const [isExiting, setIsExiting] = useState(false);
    const [confetti, setConfetti] = useState([]);
    
    const audioRef = useRef(null);
    const alertTimeoutRef = useRef(null);
    const exitTimeoutRef = useRef(null);

    // Audio chime synthesis fallback via Web Audio API (OBS / TikTok LIVE Studio browser compatible)
    const playSynthChime = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const playTone = (freq, start, duration, gainVal = 0.3) => {
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
            // Celebratory high-resonance cash register / fintech chime chord
            playTone(523.25, t, 0.35);        // C5
            playTone(659.25, t + 0.10, 0.35); // E5
            playTone(783.99, t + 0.20, 0.35); // G5
            playTone(1046.50, t + 0.30, 0.55); // C6
            playTone(1318.51, t + 0.40, 0.75); // E6
        } catch (err) {
            console.warn('[Overlay Audio] Synthesis failed:', err);
        }
    };

    // Trigger audio alert with HTML5 Audio element + Web Audio fallback
    const playAlertSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((e) => {
                    console.log('[Overlay Audio] HTML5 audio error/autoplay restricted, playing Web Audio synthesis:', e?.message);
                    playSynthChime();
                });
            }
        } else {
            playSynthChime();
        }
    };

    // Confetti particles generator
    const triggerConfetti = () => {
        const particles = [];
        const colors = ['#10B981', '#059669', '#34D399', '#F59E0B', '#FBBF24', '#3B82F6', '#EC4899'];
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

        // Start smooth exit fade at 7.2 seconds
        exitTimeoutRef.current = setTimeout(() => {
            setIsExiting(true);
        }, 7200);

        // Completely unmount/remove alert from DOM after exactly 8.0 seconds
        alertTimeoutRef.current = setTimeout(() => {
            setAlert(null);
            setIsExiting(false);
            setConfetti([]);
        }, 8000);
    };

    useEffect(() => {
        // Enforce 100% transparent background and zero scrollbars for OBS & TikTok LIVE Studio
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
            console.log(`[Overlay] Socket connected (${socket.id}). Joining room: ${targetIdentifier}`);
            if (targetIdentifier) {
                socket.emit('join_overlay', targetIdentifier);
                socket.emit('join', targetIdentifier);
            }
        });

        // Listen for new tip events
        socket.on('new_tip', (data) => {
            console.log('[Overlay] Received new_tip alert:', data);
            triggerTipAlert(data);
        });

        socket.on('tip_alert', (data) => {
            console.log('[Overlay] Received tip_alert:', data);
            triggerTipAlert(data);
        });

        socket.on('disconnect', () => {
            console.log('[Overlay] Disconnected from socket server.');
        });

        // Listen for local test events triggered by Dashboard
        const handleWindowMessage = (e) => {
            if (e.data === 'test_overlay' || e.data?.type === 'test_overlay') {
                triggerTipAlert({
                    senderName: 'Selamawit T.',
                    amount: 250,
                    message: 'Gobez nesh! Keep inspiring us on live! ☕️🚀🇪🇹',
                    tx_ref: 'GP-TEST-' + Date.now()
                });
            }
        };
        window.addEventListener('message', handleWindowMessage);

        // Test preview trigger via URL query param: /overlay/:username?preview=true or ?test=true
        if (searchParams.get('preview') === 'true' || searchParams.get('test') === 'true') {
            setTimeout(() => {
                triggerTipAlert({
                    senderName: 'Dawit Bekele',
                    amount: 150,
                    message: 'Great livestream! Keep making awesome content ☕️🇪🇹',
                    tx_ref: 'GP-SAMPLE-PREVIEW'
                });
            }, 800);
        }

        return () => {
            window.removeEventListener('message', handleWindowMessage);
            socket.disconnect();
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
            if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
        };
    }, [targetIdentifier, searchParams]);

    const senderDisplay = alert?.senderName || alert?.supporterName || alert?.tipperPhone || 'A Supporter';
    const amountDisplay = Number(alert?.amount || 0).toLocaleString();

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
            {/* HTML5 Audio element for crisp cash chime */}
            <audio 
                ref={audioRef} 
                src="https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3" 
                preload="auto" 
            />

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
                        opacity: 0.9,
                        zIndex: 9998
                    }}
                />
            ))}

            {/* Radiant Glassmorphism / Neon Ethiopian Aesthetic Alert Box */}
            {alert && (
                <div 
                    className={`obs-alert-card ${isExiting ? 'obs-exiting' : 'obs-entering'}`}
                    style={{
                        background: 'linear-gradient(140deg, rgba(6, 78, 59, 0.96) 0%, rgba(15, 23, 42, 0.97) 55%, rgba(20, 83, 45, 0.94) 100%)',
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                        border: '2.5px solid #10B981',
                        boxShadow: '0 0 55px rgba(16, 185, 129, 0.65), 0 0 25px rgba(245, 158, 11, 0.4), 0 25px 60px rgba(0, 0, 0, 0.85), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                        borderRadius: '26px',
                        padding: '2.2rem 3.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        maxWidth: '620px',
                        width: '92%',
                        zIndex: 9999,
                        position: 'relative'
                    }}
                >
                    {/* Ethiopian Flag / Gursha Glowing Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(16, 185, 129, 0.22)',
                        border: '1px solid rgba(16, 185, 129, 0.55)',
                        padding: '0.35rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        color: '#34D399',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
                    }}>
                        <span style={{ fontSize: '1rem' }}>🇪🇹</span>
                        <span>LIVE GURSHA ALERT</span>
                    </div>

                    {/* Glowing Logo Icon */}
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(15, 23, 42, 0.85) 75%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        border: '2px solid #10B981',
                        boxShadow: '0 0 30px rgba(16, 185, 129, 0.65)',
                        animation: 'obsPulse 1.8s ease-in-out infinite'
                    }}>
                        <img 
                            src="/gp-official-logo.png" 
                            alt="Gursha Logo" 
                            style={{ 
                                width: '44px', 
                                height: 'auto',
                                objectFit: 'contain'
                            }} 
                            onError={(e) => {
                                e.currentTarget.src = '/gurshapay-logo-new.png';
                            }}
                        />
                    </div>

                    {/* Exciting Large Typography Headline: "🎉 [SenderName] tipped [Amount] ETB!" */}
                    <div style={{
                        fontSize: '2.1rem',
                        fontWeight: 900,
                        lineHeight: 1.25,
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                        textShadow: '0 2px 14px rgba(0, 0, 0, 0.8)',
                        marginBottom: alert.message ? '0.85rem' : '0.25rem',
                        textAlign: 'center'
                    }}>
                        <span style={{ marginRight: '0.35rem' }}>🎉</span>
                        <span style={{
                            color: '#FFFFFF',
                            textShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
                        }}>
                            {senderDisplay}
                        </span>
                        {' '}
                        <span style={{ color: '#E2E8F0', fontWeight: 700 }}>tipped</span>
                        {' '}
                        <span style={{
                            color: '#10B981',
                            fontWeight: 900,
                            textShadow: '0 0 28px rgba(16, 185, 129, 0.85), 0 2px 8px rgba(0, 0, 0, 0.9)'
                        }}>
                            {amountDisplay} ETB!
                        </span>
                    </div>

                    {/* Supporter's Custom Message */}
                    {alert.message && (
                        <div style={{
                            marginTop: '0.4rem',
                            padding: '0.85rem 1.4rem',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderLeft: '4px solid #10B981',
                            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '0 14px 14px 0',
                            maxWidth: '480px',
                            wordWrap: 'break-word',
                            color: '#F1F5F9',
                            fontSize: '1.1rem',
                            lineHeight: 1.45,
                            fontStyle: 'italic',
                            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.35)'
                        }}>
                            "{alert.message}"
                        </div>
                    )}
                </div>
            )}

            {/* Embedded CSS Animations & Transparent Overrides */}
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
                    animation: obsPopIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .obs-exiting {
                    animation: obsFadeOut 0.75s cubic-bezier(0.7, 0, 0.84, 0) forwards;
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
                        box-shadow: 0 0 22px rgba(16, 185, 129, 0.45);
                    }
                    50% {
                        transform: scale(1.08);
                        box-shadow: 0 0 38px rgba(16, 185, 129, 0.9);
                    }
                }
            `}} />
        </div>
    );
}
