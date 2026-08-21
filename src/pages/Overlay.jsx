import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Overlay() {
    const { creatorId } = useParams();
    const [alert, setAlert] = useState(null);
    const [confetti, setConfetti] = useState([]);
    const alertTimeoutRef = useRef(null);

    // Play a premium sound arpeggio using the browser's Web Audio API
    const playAlertSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const playNote = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                // Use triangle/sine wave for a warm, sweet chime sound
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startTime);
                
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            const now = ctx.currentTime;
            // E.g., arpeggio: C5 -> E5 -> G5 -> C6
            playNote(523.25, now, 0.4);       // C5
            playNote(659.25, now + 0.1, 0.4); // E5
            playNote(783.99, now + 0.2, 0.4); // G5
            playNote(1046.50, now + 0.3, 0.6); // C6
        } catch (err) {
            console.error('Audio synthesis failed:', err);
        }
    };

    // Generate random confetti particles
    const triggerConfetti = () => {
        const particles = [];
        const colors = ['#0F9D58', '#4285F4', '#FBBC05', '#EA4335', '#a855f7', '#ec4899'];
        for (let i = 0; i < 100; i++) {
            particles.push({
                id: i,
                x: Math.random() * 100, // percentage width
                y: -10 - Math.random() * 20, // start above screen
                size: 5 + Math.random() * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 3,
                rotation: Math.random() * 360,
                horizontalSpeed: -15 + Math.random() * 30
            });
        }
        setConfetti(particles);
    };

    useEffect(() => {
        const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000'
            : 'https://wileta-backend.onrender.com';

        console.log(`[Overlay] Connecting to Socket.io server at ${socketUrl}`);
        const socket = io(socketUrl, {
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log(`[Overlay] Connected to socket server! Joining room for creator: ${creatorId}`);
            socket.emit('join', creatorId);
        });

        socket.on('tip_alert', (data) => {
            console.log('[Overlay] Received tip_alert:', data);
            
            // Clear any active timeouts
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }

            // Trigger sound, confetti, and show the notification card
            playAlertSound();
            triggerConfetti();
            setAlert(data);

            // Hide alert after 6 seconds
            alertTimeoutRef.current = setTimeout(() => {
                setAlert(null);
                setConfetti([]);
            }, 6000);
        });

        socket.on('disconnect', () => {
            console.log('[Overlay] Disconnected from socket server.');
        });

        return () => {
            socket.disconnect();
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, [creatorId]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'transparent',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            pointerEvents: 'none' // Transparent, click-through overlay for stream OBS
        }}>
            {/* Confetti canvas simulation using divs */}
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
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `fall ${p.duration}s linear ${p.delay}s forwards`,
                        opacity: 0.8
                    }}
                />
            ))}

            {/* Alert Card */}
            {alert && (
                <div 
                    className="alert-card"
                    style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid #0F9D58',
                        boxShadow: '0 0 30px rgba(15, 157, 88, 0.4), inset 0 0 15px rgba(15, 157, 88, 0.2)',
                        borderRadius: '2rem',
                        padding: '2.5rem 4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'alert-slide-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                        textAlign: 'center',
                        color: 'white',
                        maxWidth: '85%',
                        zIndex: 9999
                    }}
                >
                    {/* Animated Pulsing Gift Icon */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(15, 157, 88, 0.3) 0%, transparent 70%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        border: '1px dashed #0F9D58',
                        animation: 'pulse-icon 1.5s infinite alternate'
                    }}>
                        <img 
                            src="/gurshapay-logo-new.png" 
                            alt="Gursha Logo" 
                            style={{ 
                                width: '54px', 
                                height: 'auto',
                                objectFit: 'contain'
                            }} 
                        />
                    </div>

                    <h2 style={{
                        margin: 0,
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: '#E2E8F0'
                    }}>
                        New Gursha Received!
                    </h2>
                    
                    <h1 style={{
                        margin: '0.5rem 0',
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        color: '#0F9D58',
                        textShadow: '0 0 10px rgba(15, 157, 88, 0.5)',
                        animation: 'sparkle-text 1s ease-in-out infinite alternate'
                    }}>
                        {alert.amount} ETB
                    </h1>

                    <p style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#94A3B8'
                    }}>
                        from <span style={{ color: '#F1F5F9', fontWeight: 800 }}>{alert.tipperPhone}</span>
                    </p>

                    {alert.message && (
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem 1.5rem',
                            background: 'rgba(15, 157, 88, 0.1)',
                            borderLeft: '4px solid #0F9D58',
                            borderRadius: '0 1rem 1rem 0',
                            maxWidth: '400px',
                            wordWrap: 'break-word',
                            fontStyle: 'italic',
                            color: '#E2E8F0',
                            fontSize: '1.1rem',
                            lineHeight: 1.5,
                            boxShadow: 'inset 0 0 20px rgba(15, 157, 88, 0.05)'
                        }}>
                            "{alert.message}"
                        </div>
                    )}

                    <div style={{
                        marginTop: '1rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        fontSize: '0.85rem',
                        color: '#64748B',
                        fontFamily: 'monospace'
                    }}>
                        Ref: {alert.tx_ref}
                    </div>
                </div>
            )}

            {/* Custom Animations injected directly inside the component style */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) rotate(720deg);
                        opacity: 0;
                    }
                }
                @keyframes alert-slide-in {
                    0% {
                        transform: scale(0.6) translateY(100px);
                        opacity: 0;
                    }
                    70% {
                        transform: scale(1.05) translateY(-5px);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes pulse-icon {
                    0% {
                        transform: scale(0.9);
                        box-shadow: 0 0 0 0px rgba(15, 157, 88, 0.4);
                    }
                    100% {
                        transform: scale(1.1);
                        box-shadow: 0 0 20px 10px rgba(15, 157, 88, 0);
                    }
                }
                @keyframes sparkle-text {
                    0% {
                        transform: scale(0.98);
                        filter: drop-shadow(0 0 2px rgba(15, 157, 88, 0.3));
                    }
                    100% {
                        transform: scale(1.02);
                        filter: drop-shadow(0 0 15px rgba(15, 157, 88, 0.8));
                    }
                }
            `}} />
        </div>
    );
}
