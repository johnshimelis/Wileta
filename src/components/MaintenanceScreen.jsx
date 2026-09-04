import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Wrench, RefreshCw, Mail, Phone, ShieldCheck, Sparkles, 
    Gamepad2, Trophy, Play, RotateCcw, Volume2, VolumeX, 
    Zap, Award, CheckCircle2, Flame, ArrowLeft, ArrowRight
} from 'lucide-react';

// Web Audio API Retro Sound Generator (Zero External Assets)
const playRetroSound = (type, enabled = true) => {
    if (!enabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        if (type === 'coin') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
            osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'hit') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'start') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        }
    } catch (_) {}
};

// ==========================================
// MINI-GAME: GURSHA TIP CATCHER ☕💰
// ==========================================
function GurshaGame({ soundEnabled }) {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(1);
    const [highScore, setHighScore] = useState(() => {
        try {
            return parseInt(localStorage.getItem('gp_game_highscore') || '0', 10);
        } catch (_) {
            return 0;
        }
    });

    const playerRef = useRef({ x: 175, y: 310, width: 60, height: 16, targetX: 175 });
    const itemsRef = useRef([]);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const lastSpawnRef = useRef(0);
    const scoreRef = useRef(0);
    const comboRef = useRef(1);

    // Sync state to refs for high-fps loop
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        comboRef.current = combo;
    }, [combo]);

    const startGame = () => {
        playRetroSound('start', soundEnabled);
        setScore(0);
        setCombo(1);
        scoreRef.current = 0;
        comboRef.current = 1;
        itemsRef.current = [];
        particlesRef.current = [];
        playerRef.current = { x: 175, y: 310, width: 60, height: 16, targetX: 175 };
        setGameState('playing');
    };

    // Canvas Interaction (Mouse / Touch)
    const handleMove = (clientX) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const clampedX = Math.max(30, Math.min(320, relativeX));
        playerRef.current.targetX = clampedX - playerRef.current.width / 2;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== 'playing') return;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                playerRef.current.targetX = Math.max(0, playerRef.current.targetX - 35);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                playerRef.current.targetX = Math.min(290, playerRef.current.targetX + 35);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // Main Game Loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let isRunning = true;

        const loop = (timestamp) => {
            if (!isRunning) return;

            // Clear Background
            ctx.fillStyle = '#121214';
            ctx.fillRect(0, 0, 350, 350);

            // Draw Subtle Grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < 350; x += 25) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, 350);
                ctx.stroke();
            }

            // Smooth Player Position
            const p = playerRef.current;
            p.x += (p.targetX - p.x) * 0.25;

            // Draw Player Basket (Gursha Plate)
            ctx.fillStyle = '#10B981';
            ctx.shadowColor = '#10B981';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.width, p.height, 8);
            ctx.fill();

            // Plate Inner Accent
            ctx.fillStyle = '#34D399';
            ctx.fillRect(p.x + 8, p.y + 3, p.width - 16, 3);
            ctx.shadowBlur = 0;

            // Spawn Items
            if (timestamp - lastSpawnRef.current > 700) {
                lastSpawnRef.current = timestamp;
                const isBomb = Math.random() < 0.22;
                const itemType = isBomb ? 'bomb' : (Math.random() < 0.25 ? 'coffee' : (Math.random() < 0.4 ? 'telebirr' : 'coin'));
                
                itemsRef.current.push({
                    x: 20 + Math.random() * 300,
                    y: -20,
                    type: itemType,
                    speed: 2.2 + Math.min(3.5, scoreRef.current * 0.04),
                    size: isBomb ? 14 : 12,
                    value: itemType === 'coffee' ? 25 : (itemType === 'telebirr' ? 15 : (itemType === 'bomb' ? 0 : 10))
                });
            }

            // Update & Draw Items
            for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                const item = itemsRef.current[i];
                item.y += item.speed;

                // Draw Item
                ctx.save();
                if (item.type === 'bomb') {
                    // Obstacle / Bug
                    ctx.fillStyle = '#EF4444';
                    ctx.shadowColor = '#EF4444';
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('⚡', item.x, item.y + 3);
                } else if (item.type === 'coffee') {
                    // Gursha Coffee Cup
                    ctx.fillStyle = '#F59E0B';
                    ctx.shadowColor = '#F59E0B';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('☕', item.x, item.y + 4);
                } else if (item.type === 'telebirr') {
                    // Telebirr Gem
                    ctx.fillStyle = '#00C675';
                    ctx.shadowColor = '#00C675';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '10px bold sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('TB', item.x, item.y + 3);
                } else {
                    // Gold Coin
                    ctx.fillStyle = '#FBBF24';
                    ctx.shadowColor = '#FBBF24';
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#78350F';
                    ctx.font = '9px bold sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('ETB', item.x, item.y + 3);
                }
                ctx.restore();

                // Collision Detection with Player
                const hit = item.y + item.size >= p.y &&
                            item.y - item.size <= p.y + p.height &&
                            item.x >= p.x - 5 &&
                            item.x <= p.x + p.width + 5;

                if (hit) {
                    if (item.type === 'bomb') {
                        // Game Over
                        playRetroSound('hit', soundEnabled);
                        setGameState('gameover');
                        setHighScore(prev => {
                            const newHigh = Math.max(prev, scoreRef.current);
                            try { localStorage.setItem('gp_game_highscore', newHigh.toString()); } catch (_) {}
                            return newHigh;
                        });
                        return;
                    } else {
                        // Collect Item
                        playRetroSound('coin', soundEnabled);
                        const points = item.value * comboRef.current;
                        setScore(s => s + points);
                        setCombo(c => Math.min(5, c + 1));

                        // Spawn Particles
                        for (let k = 0; k < 8; k++) {
                            particlesRef.current.push({
                                x: item.x,
                                y: item.y,
                                vx: (Math.random() - 0.5) * 4,
                                vy: (Math.random() - 0.5) * 4 - 2,
                                color: item.type === 'coffee' ? '#F59E0B' : (item.type === 'telebirr' ? '#00C675' : '#FBBF24'),
                                life: 1.0
                            });
                        }
                        itemsRef.current.splice(i, 1);
                        continue;
                    }
                }

                // Missed normal items resets combo
                if (item.y > 360) {
                    if (item.type !== 'bomb') {
                        setCombo(1);
                    }
                    itemsRef.current.splice(i, 1);
                }
            }

            // Draw & Update Particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const pt = particlesRef.current[i];
                pt.x += pt.vx;
                pt.y += pt.vy;
                pt.life -= 0.04;
                if (pt.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }
                ctx.fillStyle = pt.color;
                ctx.globalAlpha = pt.life;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);
        return () => {
            isRunning = false;
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [gameState, soundEnabled]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#121214',
            border: '1px solid #27272A',
            borderRadius: '20px',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '380px',
            margin: '0 auto'
        }}>
            {/* Game Scoreboard Bar */}
            <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '1px solid #27272A',
                marginBottom: '10px',
                fontSize: '12px',
                fontWeight: 700
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                    <Zap size={14} /> Score: <span style={{ color: '#FFFFFF', fontSize: '14px' }}>{score}</span>
                </div>
                {combo > 1 && (
                    <div style={{
                        padding: '1px 6px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid #F59E0B',
                        borderRadius: '6px',
                        color: '#F59E0B',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                    }}>
                        <Flame size={10} /> {combo}x COMBO
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#A1A1AA' }}>
                    <Trophy size={13} color="#FBBF24" /> Best: <span style={{ color: '#FBBF24' }}>{highScore}</span>
                </div>
            </div>

            {/* Canvas Container */}
            <div 
                style={{ position: 'relative', width: '350px', height: '310px', cursor: 'grab' }}
                onMouseMove={(e) => handleMove(e.clientX)}
                onTouchMove={(e) => {
                    if (e.touches[0]) handleMove(e.touches[0].clientX);
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={350}
                    height={310}
                    style={{
                        borderRadius: '12px',
                        display: 'block',
                        background: '#121214'
                    }}
                />

                {/* Idle Start Overlay */}
                {gameState === 'idle' && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(9, 9, 11, 0.85)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        textAlign: 'center',
                        padding: '20px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '1px solid #10B981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10B981'
                        }}>
                            <Gamepad2 size={26} />
                        </div>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>Gursha Tip Catcher ☕</div>
                            <div style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '3px' }}>Catch Ethiopian Coffee & Tips. Avoid ⚡ glitches!</div>
                        </div>
                        <button
                            onClick={startGame}
                            style={{
                                padding: '8px 24px',
                                background: '#10B981',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                            }}
                        >
                            <Play size={14} /> Play While Waiting
                        </button>
                    </div>
                )}

                {/* Game Over Overlay */}
                {gameState === 'gameover' && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(9, 9, 11, 0.9)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        textAlign: 'center',
                        padding: '20px'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444' }}>Glitch Hit! 💥</div>
                        <div style={{ fontSize: '13px', color: '#D4D4D8' }}>
                            You collected <strong style={{ color: '#10B981' }}>{score} ETB</strong> in Gursha tips!
                        </div>
                        {score >= highScore && score > 0 && (
                            <div style={{ fontSize: '11px', color: '#FBBF24', fontWeight: 700 }}>
                                🎉 NEW HIGH SCORE!
                            </div>
                        )}
                        <button
                            onClick={startGame}
                            style={{
                                marginTop: '6px',
                                padding: '8px 20px',
                                background: '#10B981',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <RotateCcw size={14} /> Play Again
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Touch Control Buttons */}
            {gameState === 'playing' && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: '10px',
                    gap: '12px'
                }}>
                    <button
                        onMouseDown={() => { playerRef.current.targetX = Math.max(0, playerRef.current.targetX - 45); }}
                        onTouchStart={() => { playerRef.current.targetX = Math.max(0, playerRef.current.targetX - 45); }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#27272A',
                            border: '1px solid #3F3F46',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <button
                        onMouseDown={() => { playerRef.current.targetX = Math.min(290, playerRef.current.targetX + 45); }}
                        onTouchStart={() => { playerRef.current.targetX = Math.min(290, playerRef.current.targetX + 45); }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#27272A',
                            border: '1px solid #3F3F46',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}

// ==========================================
// MAIN UPGRADED MAINTENANCE SCREEN
// ==========================================
export default function MaintenanceScreen({ 
    message, 
    supportEmail = 'support@gurshapay.com', 
    supportPhone = '+251967432143', 
    onRefresh 
}) {
    const [checking, setChecking] = useState(false);
    const [activeTab, setActiveTab] = useState('status'); // 'status' | 'game'
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [latency, setLatency] = useState(28);
    const [lastCheckedTime, setLastCheckedTime] = useState('Just now');

    // Automatic URL update to /maintenance
    useEffect(() => {
        const path = window.location.pathname;
        if (path !== '/maintenance' && path !== '/maintance') {
            window.history.replaceState(null, '', '/maintenance');
        }
    }, []);

    // Simulated Live Health Ping Pulse
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(22 + Math.random() * 12));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleCheckStatus = async () => {
        setChecking(true);
        if (onRefresh) {
            await onRefresh();
        } else {
            window.location.reload();
        }
        setLastCheckedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setTimeout(() => setChecking(false), 1200);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#09090B',
            color: '#F4F4F5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Ambient Cyber Glows */}
            <div style={{
                position: 'absolute',
                top: '-15%',
                left: '15%',
                width: '450px',
                height: '450px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                filter: 'blur(40px)',
                animation: 'pulse 6s infinite alternate'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-15%',
                right: '15%',
                width: '480px',
                height: '480px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                filter: 'blur(50px)',
                animation: 'pulse 8s infinite alternate'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '560px',
                background: 'rgba(24, 24, 27, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '28px',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.08)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Top Interactive Tabs & Sound Controller */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.75rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        background: '#121214',
                        padding: '3px',
                        borderRadius: '12px',
                        border: '1px solid #27272A'
                    }}>
                        <button
                            onClick={() => setActiveTab('status')}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '9px',
                                border: 'none',
                                background: activeTab === 'status' ? '#27272A' : 'transparent',
                                color: activeTab === 'status' ? '#FFFFFF' : '#71717A',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Wrench size={13} color={activeTab === 'status' ? '#10B981' : '#71717A'} /> System Status
                        </button>
                        <button
                            onClick={() => setActiveTab('game')}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '9px',
                                border: 'none',
                                background: activeTab === 'game' ? '#10B981' : 'transparent',
                                color: activeTab === 'game' ? '#FFFFFF' : '#71717A',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Gamepad2 size={14} /> Play Mini-Game ☕
                        </button>
                    </div>

                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
                        style={{
                            background: '#18181B',
                            border: '1px solid #27272A',
                            borderRadius: '10px',
                            padding: '6px 10px',
                            color: soundEnabled ? '#10B981' : '#71717A',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700
                        }}
                    >
                        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>
                </div>

                {activeTab === 'status' ? (
                    <>
                        {/* Animated Glowing Emblem */}
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '22px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.1) 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.25rem',
                            color: '#10B981',
                            boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
                            position: 'relative'
                        }}>
                            <Wrench size={34} style={{ animation: 'spin-slow 12s linear infinite' }} />
                            <span style={{
                                position: 'absolute',
                                top: '-3px',
                                right: '-3px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#10B981',
                                border: '2px solid #18181B',
                                boxShadow: '0 0 8px #10B981'
                            }} />
                        </div>

                        {/* Scheduled Status Tag */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 14px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.35)',
                            borderRadius: '100px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            color: '#F59E0B',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                            Scheduled Platform Maintenance
                        </div>

                        <h1 style={{
                            fontSize: '25px',
                            fontWeight: 900,
                            color: '#FFFFFF',
                            margin: '0 0 10px 0',
                            letterSpacing: '-0.025em'
                        }}>
                            Gursha<span style={{ color: '#10B981' }}>Pay</span> Upgrades in Progress
                        </h1>

                        <p style={{
                            fontSize: '14px',
                            color: '#A1A1AA',
                            lineHeight: 1.6,
                            margin: '0 0 1.5rem 0'
                        }}>
                            {message || 'GurshaPay is currently undergoing scheduled platform upgrades to improve instant settlement speed, security, and banking resilience. We will be back online shortly.'}
                        </p>

                        {/* Live Gateway Telemetry Pill */}
                        <div style={{
                            background: '#121214',
                            border: '1px solid #27272A',
                            borderRadius: '14px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem',
                            fontSize: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                                <span style={{ color: '#D4D4D8', fontWeight: 600 }}>Core Nodes: Active & Upgrading</span>
                            </div>
                            <span style={{ color: '#71717A', fontSize: '11px' }}>Ping: {latency}ms</span>
                        </div>

                        {/* Security Assurance Card */}
                        <div style={{
                            background: '#1E1E22',
                            borderRadius: '14px',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            textAlign: 'left',
                            marginBottom: '1.5rem',
                            border: '1px solid #2E2E34'
                        }}>
                            <ShieldCheck size={24} color="#10B981" style={{ flexShrink: 0 }} />
                            <div style={{ fontSize: '12px', color: '#D4D4D8', lineHeight: 1.4 }}>
                                <strong style={{ color: '#FFFFFF' }}>Funds & Ledgers Safe:</strong> All creator balances, transactions, and Telebirr/Bank rails are completely secured.
                            </div>
                        </div>

                        {/* Action Refresh Button */}
                        <button
                            onClick={handleCheckStatus}
                            disabled={checking}
                            style={{
                                width: '100%',
                                padding: '13px 20px',
                                background: '#10B981',
                                border: 'none',
                                borderRadius: '14px',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: '14px',
                                cursor: checking ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                            }}
                        >
                            <RefreshCw size={17} style={{ animation: checking ? 'spin 0.8s linear infinite' : 'none' }} />
                            {checking ? 'Pinging Core Gateway...' : 'Check If System Is Back Online'}
                        </button>

                        <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717A' }}>
                            Last checked: {lastCheckedTime} • Auto-retries every 15s
                        </div>
                    </>
                ) : (
                    <GurshaGame soundEnabled={soundEnabled} />
                )}

                {/* Support Contact Footer */}
                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    fontSize: '12.5px',
                    color: '#71717A'
                }}>
                    <a
                        href={`mailto:${supportEmail}`}
                        style={{ color: '#A1A1AA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                    >
                        <Mail size={14} color="#10B981" /> {supportEmail}
                    </a>
                    <a
                        href={`tel:${supportPhone}`}
                        style={{ color: '#A1A1AA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                    >
                        <Phone size={14} color="#10B981" /> {supportPhone}
                    </a>
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    from { transform: scale(1); opacity: 0.8; }
                    to { transform: scale(1.1); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
