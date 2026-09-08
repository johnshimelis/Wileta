import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RotateCcw, Play, Award, ChevronRight, Gamepad2 } from 'lucide-react';

// ============================================================================
// HABESHA TRIVIA DATA
// ============================================================================
const TRIVIA_QUESTIONS = [
    {
        question: "Where was Coffee Arabica originally discovered?",
        options: ["Kaffa Province, Ethiopia", "Yemen", "Brazil", "Kenya"],
        correctIndex: 0,
        explanation: "Legend tells of Kaldi, an Ethiopian goat herder from the ancient Kaffa province, who noticed his goats energized after eating coffee cherries around 850 AD."
    },
    {
        question: "How many monolithic rock-hewn churches are located in Lalibela?",
        options: ["7 Churches", "11 Churches", "13 Churches", "9 Churches"],
        correctIndex: 1,
        explanation: "King Lalibela commissioned the 11 magnificent rock-hewn monolithic churches in the 12th century, carved directly from solid volcanic rock."
    },
    {
        question: "What is the name of the traditional clay pot used to brew authentic Ethiopian coffee?",
        options: ["Rekebot", "Mesob", "Jebena", "Krar"],
        correctIndex: 2,
        explanation: "The Jebena is the iconic handcrafted clay coffee pot used in traditional Ethiopian coffee ceremonies (Bunna Tetu)."
    },
    {
        question: "How many months are in the Ethiopian calendar year?",
        options: ["12 Months", "13 Months", "10 Months", "14 Months"],
        correctIndex: 1,
        explanation: "The Ethiopian calendar consists of 12 months of 30 days each, plus a 13th month called Pagumē (5 or 6 days), leading to the famous tourism motto '13 Months of Sunshine'."
    },
    {
        question: "What is the nickname of the 3.2-million-year-old hominid fossil discovered in Ethiopia in 1974?",
        options: ["Ardi", "Selam", "Lucy (Dinknesh)", "Taung"],
        correctIndex: 2,
        explanation: "Discovered in Hadar in the Afar Depression, her Amharic name 'Dinknesh' means 'you are marvelous'."
    },
    {
        question: "Which ancient Ethiopian empire was praised as one of the 4 greatest powers alongside Rome, Persia, and China?",
        options: ["Kingdom of Aksum", "Zagwe Dynasty", "Gondar Empire", "Shewa Realm"],
        correctIndex: 0,
        explanation: "The 3rd-century Persian prophet Mani described the Kingdom of Aksum as one of the four great empires of the civilized world."
    },
    {
        question: "What is Ethiopia's national digital identification system called?",
        options: ["Kebele ID", "Fayda", "EthioPass", "AddisCard"],
        correctIndex: 1,
        explanation: "Fayda (ፋይዳ) is Ethiopia's foundational National Digital Identity system, integrated directly into fintech platforms like GurshaPay for creator verification."
    },
    {
        question: "Which majestic Ethiopian national park is home to the rare Walia Ibex and Ethiopian Wolf?",
        options: ["Bale Mountains", "Simien Mountains", "Awash National Park", "Omo National Park"],
        correctIndex: 1,
        explanation: "The Simien Mountains National Park, a UNESCO World Heritage site, features Ras Dejen, the highest peak in Ethiopia (4,550m)."
    },
    {
        question: "What is the woven, conical straw basket table used to serve Injera feast dishes?",
        options: ["Mesob", "Sifet", "Safet", "Kebero"],
        correctIndex: 0,
        explanation: "The Mesob is a vibrant handcrafted Ethiopian wicker dining table woven from seasoned grasses, symbolizing communal togetherness."
    },
    {
        question: "What is Ethiopia's unique status among African nations regarding colonial history?",
        options: [
            "It was the first colony to gain independence",
            "It defeated European colonial powers and remained uncolonized",
            "It was a British protectorate",
            "It adopted European laws in 1900"
        ],
        correctIndex: 1,
        explanation: "At the historic Battle of Adwa in 1896, Ethiopian forces led by Emperor Menelik II and Empress Taytu decisively defeated the Italian invading army, preserving Ethiopia's sovereignty."
    }
];

// ============================================================================
// MAIN COMPONENT: MAINTENANCE GAMES DRAWER
// ============================================================================
export default function MaintenanceGames() {
    const [activeTab, setActiveTab] = useState('runner'); // 'runner' | 'trivia'

    return (
        <div className="gp-arcade-card">
            <div className="gp-arcade-header">
                <div className="gp-arcade-title-group">
                    <div className="gp-arcade-icon-badge">
                        <Gamepad2 size={20} />
                    </div>
                    <div>
                        <h2 className="gp-arcade-title">Addis Arcade & Trivia</h2>
                        <p className="gp-arcade-sub">Enjoy a quick high-score run or test your knowledge while waiting!</p>
                    </div>
                </div>

                {/* Game Tabs */}
                <div className="gp-arcade-tabs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('runner')}
                        className={'gp-tab-btn ' + (activeTab === 'runner' ? 'active' : '')}
                    >
                        <span>☕ Addis Hopper</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('trivia')}
                        className={'gp-tab-btn ' + (activeTab === 'trivia' ? 'active' : '')}
                    >
                        <span>🧠 Habesha Trivia</span>
                    </button>
                </div>
            </div>

            {/* Active Game View */}
            <div className="gp-arcade-body">
                {activeTab === 'runner' ? <AddisHopperGame /> : <HabeshaTriviaGame />}
            </div>

            <style>{`
                .gp-arcade-card {
                    width: 100%;
                    background: #161B22;
                    border: 1px solid rgba(48, 54, 61, 0.9);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-sizing: border-box;
                    box-shadow: 0 16px 35px rgba(0, 0, 0, 0.5);
                    animation: gpFadeUp 0.35s ease-out;
                    margin-top: 1.5rem;
                }

                .gp-arcade-header {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding-bottom: 1.25rem;
                    border-bottom: 1px solid #21262D;
                    margin-bottom: 1.25rem;
                }

                .gp-arcade-title-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .gp-arcade-icon-badge {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(16, 185, 129, 0.15);
                    color: #10B981;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .gp-arcade-title {
                    font-size: 1.15rem;
                    font-weight: 800;
                    margin: 0;
                    color: #FFFFFF;
                }

                .gp-arcade-sub {
                    font-size: 0.8rem;
                    color: #8B949E;
                    margin: 3px 0 0 0;
                }

                .gp-arcade-tabs {
                    display: flex;
                    background: #0D1117;
                    border: 1px solid #30363D;
                    border-radius: 10px;
                    padding: 3px;
                    gap: 4px;
                }

                .gp-tab-btn {
                    background: transparent;
                    border: none;
                    color: #8B949E;
                    font-size: 0.85rem;
                    font-weight: 700;
                    padding: 7px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .gp-tab-btn.active {
                    background: #21262D;
                    color: #10B981;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                }

                .gp-arcade-body {
                    width: 100%;
                    min-height: 280px;
                }

                @keyframes gpFadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

// ============================================================================
// SUB-GAME 1: ADDIS HOPPER (COFFEE & COIN RUNNER)
// ============================================================================
function AddisHopperGame() {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem('gp_arcade_hopper_high') || '0', 10);
    });

    const stateRef = useRef({
        playerY: 0,
        velocityY: 0,
        jumpCount: 0,
        score: 0,
        obstacles: [],
        collectibles: [],
        particles: [],
        groundOffset: 0,
        speed: 4.8,
        lastSpawn: 0,
        lastCollectSpawn: 0,
        isPlaying: false
    });

    const playTone = (type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'jump') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
            } else if (type === 'collect') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(580, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.18);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
                osc.start();
                osc.stop(ctx.currentTime + 0.18);
            } else if (type === 'hit') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            }
        } catch (_) {}
    };

    const triggerJump = useCallback(() => {
        const s = stateRef.current;
        if (!s.isPlaying) return;
        if (s.jumpCount < 2) {
            s.velocityY = -11.5;
            s.jumpCount++;
            playTone('jump');
            for (let i = 0; i < 6; i++) {
                s.particles.push({
                    x: 60 + Math.random() * 20,
                    y: 175,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 2,
                    alpha: 1,
                    color: '#D97706'
                });
            }
        }
    }, []);

    const startGame = () => {
        const s = stateRef.current;
        s.playerY = 0;
        s.velocityY = 0;
        s.jumpCount = 0;
        s.score = 0;
        s.obstacles = [];
        s.collectibles = [];
        s.particles = [];
        s.speed = 4.8;
        s.isPlaying = true;
        setScore(0);
        setGameState('playing');
        triggerJump();
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (gameState !== 'playing') {
                    startGame();
                } else {
                    triggerJump();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, triggerJump]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const groundY = 175;
        const gravity = 0.65;

        const loop = (timestamp) => {
            const s = stateRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = '#161B22';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
            skyGrad.addColorStop(0, '#0F172A');
            skyGrad.addColorStop(1, '#1E293B');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvas.width, groundY);

            // Entoto hills silhouette
            ctx.fillStyle = '#111827';
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(80, 110);
            ctx.lineTo(190, 135);
            ctx.lineTo(310, 95);
            ctx.lineTo(440, 140);
            ctx.lineTo(540, 115);
            ctx.lineTo(620, groundY);
            ctx.closePath();
            ctx.fill();

            // Ground line
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(canvas.width, groundY);
            ctx.stroke();

            // Subground fill
            ctx.fillStyle = '#0B0F17';
            ctx.fillRect(0, groundY + 2, canvas.width, canvas.height - groundY);

            // Ground stripes
            s.groundOffset = (s.groundOffset + (s.isPlaying ? s.speed : 1)) % 40;
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
            ctx.lineWidth = 2;
            for (let x = -s.groundOffset; x < canvas.width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, groundY + 2);
                ctx.lineTo(x - 15, canvas.height);
                ctx.stroke();
            }

            if (s.isPlaying) {
                s.velocityY += gravity;
                s.playerY += s.velocityY;
                if (s.playerY >= 0) {
                    s.playerY = 0;
                    s.velocityY = 0;
                    s.jumpCount = 0;
                }

                s.score += 0.15;
                s.speed = 4.8 + Math.min(s.score * 0.004, 5.2);
                setScore(Math.floor(s.score));

                if (timestamp - s.lastSpawn > Math.max(1400 - s.score * 2.5, 800) && Math.random() < 0.6) {
                    s.lastSpawn = timestamp;
                    const isTall = Math.random() > 0.6;
                    s.obstacles.push({
                        x: canvas.width,
                        y: groundY - (isTall ? 36 : 24),
                        w: 20,
                        h: isTall ? 36 : 24,
                        color: isTall ? '#EF4444' : '#F59E0B'
                    });
                }

                if (timestamp - s.lastCollectSpawn > 1800 && Math.random() < 0.5) {
                    s.lastCollectSpawn = timestamp;
                    const isJebena = Math.random() > 0.4;
                    s.collectibles.push({
                        x: canvas.width,
                        y: groundY - (35 + Math.random() * 55),
                        type: isJebena ? 'coffee' : 'coin',
                        points: isJebena ? 15 : 25,
                        size: 16
                    });
                }
            }

            // Collectibles
            for (let i = s.collectibles.length - 1; i >= 0; i--) {
                const c = s.collectibles[i];
                if (s.isPlaying) c.x -= s.speed;

                ctx.font = '16px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(c.type === 'coffee' ? '☕' : '🪙', c.x, c.y);

                const playerX = 60;
                const playerYPos = groundY - 32 + s.playerY;
                if (
                    playerX + 26 > c.x - c.size &&
                    playerX < c.x + c.size &&
                    playerYPos + 32 > c.y - c.size &&
                    playerYPos < c.y + c.size
                ) {
                    playTone('collect');
                    s.score += c.points;
                    for (let p = 0; p < 8; p++) {
                        s.particles.push({
                            x: c.x,
                            y: c.y,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5,
                            alpha: 1,
                            color: '#FBBF24'
                        });
                    }
                    s.collectibles.splice(i, 1);
                    continue;
                }

                if (c.x < -20) s.collectibles.splice(i, 1);
            }

            // Obstacles
            for (let i = s.obstacles.length - 1; i >= 0; i--) {
                const o = s.obstacles[i];
                if (s.isPlaying) o.x -= s.speed;

                ctx.fillStyle = o.color;
                ctx.shadowColor = o.color;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.roundRect(o.x, o.y, o.w, o.h, 4);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(o.x + 3, o.y + 4, o.w - 6, 3);

                const playerX = 60;
                const playerYPos = groundY - 30 + s.playerY;
                if (
                    playerX + 22 > o.x &&
                    playerX + 4 < o.x + o.w &&
                    playerYPos + 28 > o.y
                ) {
                    playTone('hit');
                    s.isPlaying = false;
                    setGameState('gameover');
                    const finalScore = Math.floor(s.score);
                    if (finalScore > highScore) {
                        setHighScore(finalScore);
                        localStorage.setItem('gp_arcade_hopper_high', finalScore.toString());
                    }
                    for (let p = 0; p < 18; p++) {
                        s.particles.push({
                            x: playerX + 12,
                            y: playerYPos + 14,
                            vx: (Math.random() - 0.5) * 7,
                            vy: (Math.random() - 0.5) * 7,
                            alpha: 1,
                            color: Math.random() > 0.5 ? '#10B981' : '#EF4444'
                        });
                    }
                }

                if (o.x < -30) s.obstacles.splice(i, 1);
            }

            // Particles
            for (let i = s.particles.length - 1; i >= 0; i--) {
                const p = s.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.035;
                if (p.alpha <= 0) {
                    s.particles.splice(i, 1);
                    continue;
                }
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            // Player character
            const playerX = 60;
            const playerYPos = groundY - 32 + s.playerY;

            ctx.fillStyle = '#10B981';
            ctx.shadowColor = '#10B981';
            ctx.shadowBlur = s.jumpCount > 0 ? 12 : 6;
            ctx.beginPath();
            ctx.roundRect(playerX, playerYPos, 24, 30, 6);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Ethiopian headband accent
            ctx.fillStyle = '#F59E0B';
            ctx.fillRect(playerX + 2, playerYPos + 4, 20, 3);
            ctx.fillStyle = '#EF4444';
            ctx.fillRect(playerX + 2, playerYPos + 7, 20, 2);

            // Visor
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(playerX + 14, playerYPos + 12, 6, 4);

            // Legs
            if (s.playerY === 0 && s.isPlaying) {
                const legOffset = Math.sin(Date.now() * 0.02) * 5;
                ctx.fillStyle = '#065F46';
                ctx.fillRect(playerX + 4, playerYPos + 28, 5, 5 + legOffset);
                ctx.fillRect(playerX + 14, playerYPos + 28, 5, 5 - legOffset);
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [highScore]);

    return (
        <div className="gp-runner-container">
            <div className="gp-runner-topbar">
                <div className="gp-runner-scores">
                    <span className="gp-score-badge">
                        Score: <strong>{score}</strong>
                    </span>
                    <span className="gp-highscore-badge">
                        <Trophy size={13} /> High: <strong>{highScore}</strong>
                    </span>
                </div>
                <span className="gp-runner-hint">
                    Press <strong>SPACE / UP</strong> or <strong>TAP SCREEN</strong> to Jump!
                </span>
            </div>

            <div 
                className="gp-canvas-wrapper" 
                onClick={gameState === 'playing' ? triggerJump : startGame}
                style={{ cursor: 'pointer' }}
            >
                <canvas 
                    ref={canvasRef} 
                    width={620} 
                    height={210} 
                    className="gp-runner-canvas"
                />

                {gameState === 'idle' && (
                    <div className="gp-runner-overlay">
                        <div className="gp-overlay-card">
                            <Play size={28} className="gp-play-icon" />
                            <h3>Ready to Run Addis?</h3>
                            <p>Jump hurdles and grab coffee (☕) & coins (🪙)! Double-jump supported.</p>
                            <button type="button" onClick={startGame} className="gp-runner-start-btn">
                                Start Running (Space/Tap)
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="gp-runner-overlay">
                        <div className="gp-overlay-card">
                            <RotateCcw size={28} className="gp-over-icon" />
                            <h3>Good Run!</h3>
                            <div className="gp-over-scores">
                                <div>Score: <strong>{score}</strong></div>
                                <div>Best: <strong>{highScore}</strong></div>
                            </div>
                            <button type="button" onClick={startGame} className="gp-runner-start-btn">
                                Play Again (Space/Tap)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Jump Touch Button */}
            <div className="gp-mobile-jump-bar">
                <button 
                    type="button" 
                    onClick={gameState === 'playing' ? triggerJump : startGame}
                    className="gp-jump-touch-btn"
                >
                    {gameState === 'playing' ? '⚡ TAP TO JUMP (DOUBLE JUMP OK)' : 'START GAME'}
                </button>
            </div>

            <style>{`
                .gp-runner-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }

                .gp-runner-topbar {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .gp-runner-scores {
                    display: flex;
                    gap: 8px;
                }

                .gp-score-badge {
                    background: #21262D;
                    color: #F0F6FC;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                }

                .gp-highscore-badge {
                    background: rgba(245, 158, 11, 0.15);
                    color: #FBBF24;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 700;
                }

                .gp-runner-hint {
                    font-size: 0.75rem;
                    color: #8B949E;
                }

                .gp-canvas-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 620px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                    border: 1px solid #30363D;
                }

                .gp-runner-canvas {
                    display: block;
                    width: 100%;
                    height: auto;
                    background: #0D1117;
                }

                .gp-runner-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(13, 17, 23, 0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }

                .gp-overlay-card {
                    background: #161B22;
                    border: 1px solid #30363D;
                    border-radius: 14px;
                    padding: 1.5rem;
                    text-align: center;
                    max-width: 320px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6);
                }

                .gp-play-icon { color: #10B981; }
                .gp-over-icon { color: #F59E0B; }

                .gp-overlay-card h3 {
                    margin: 0;
                    font-size: 1.15rem;
                    color: #FFFFFF;
                }

                .gp-overlay-card p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: #8B949E;
                    line-height: 1.4;
                }

                .gp-over-scores {
                    display: flex;
                    gap: 16px;
                    font-size: 0.9rem;
                    color: #C9D1D9;
                    margin: 4px 0;
                }

                .gp-runner-start-btn {
                    background: #10B981;
                    color: #042416;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 6px;
                    transition: transform 0.15s ease;
                }

                .gp-runner-start-btn:hover {
                    transform: scale(1.04);
                }

                .gp-mobile-jump-bar {
                    display: none;
                    width: 100%;
                    margin-top: 10px;
                }

                .gp-jump-touch-btn {
                    width: 100%;
                    padding: 12px;
                    background: #21262D;
                    border: 1px solid #10B981;
                    color: #10B981;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                }

                @media (max-width: 640px) {
                    .gp-mobile-jump-bar { display: block; }
                    .gp-runner-hint { display: none; }
                }
            `}</style>
        </div>
    );
}

// ============================================================================
// SUB-GAME 2: HABESHA TRIVIA & BRAIN TEASER
// ============================================================================
function HabeshaTriviaGame() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const q = TRIVIA_QUESTIONS[currentIdx];

    const handleSelectOption = (idx) => {
        if (selectedIdx !== null) return;
        setSelectedIdx(idx);
        setShowExplanation(true);
        if (idx === q.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIdx < TRIVIA_QUESTIONS.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedIdx(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentIdx(0);
        setSelectedIdx(null);
        setScore(0);
        setShowExplanation(false);
        setIsFinished(false);
    };

    if (isFinished) {
        let badge = "Cultural Enthusiast 🌿";
        if (score >= 9) badge = "🏆 Master Habesha Scholar!";
        else if (score >= 7) badge = "⭐ Addis Connoisseur!";

        return (
            <div className="gp-trivia-result-card">
                <Award size={40} className="gp-icon-amber" />
                <h3 className="gp-result-title">Quiz Completed!</h3>
                <div className="gp-result-score">
                    <span>Your Score:</span>
                    <strong>{score} / {TRIVIA_QUESTIONS.length}</strong>
                </div>
                <div className="gp-result-badge">{badge}</div>
                <p className="gp-result-sub">
                    You know Ethiopian heritage well! Thanks for playing while GurshaPay finishes upgrading.
                </p>
                <button type="button" onClick={handleRestart} className="gp-trivia-btn-restart">
                    <RotateCcw size={16} /> Play Again
                </button>

                <style>{`
                    .gp-trivia-result-card {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        padding: 2rem 1rem;
                        gap: 10px;
                    }
                    .gp-icon-amber { color: #F59E0B; }
                    .gp-result-title { font-size: 1.4rem; color: #FFFFFF; margin: 0; }
                    .gp-result-score { font-size: 1.1rem; color: #8B949E; display: flex; gap: 8px; align-items: center; }
                    .gp-result-score strong { color: #10B981; font-size: 1.3rem; }
                    .gp-result-badge {
                        background: rgba(245, 158, 11, 0.15);
                        border: 1px solid rgba(245, 158, 11, 0.4);
                        color: #FBBF24;
                        padding: 6px 14px;
                        border-radius: 999px;
                        font-size: 0.85rem;
                        font-weight: 700;
                    }
                    .gp-result-sub { font-size: 0.85rem; color: #8B949E; max-width: 420px; margin: 4px 0 12px 0; line-height: 1.4; }
                    .gp-trivia-btn-restart {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        background: #21262D;
                        color: #F0F6FC;
                        border: 1px solid #30363D;
                        padding: 10px 20px;
                        border-radius: 10px;
                        font-size: 0.9rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.15s ease;
                    }
                    .gp-trivia-btn-restart:hover {
                        background: #30363D;
                        color: #10B981;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="gp-trivia-container">
            <div className="gp-trivia-topbar">
                <span className="gp-trivia-qnum">
                    Question <strong>{currentIdx + 1}</strong> of {TRIVIA_QUESTIONS.length}
                </span>
                <span className="gp-trivia-score">
                    Score: <strong>{score}</strong>
                </span>
            </div>

            <div className="gp-trivia-progress-bar">
                <div 
                    className="gp-trivia-progress-fill" 
                    style={{ width: `${((currentIdx + 1) / TRIVIA_QUESTIONS.length) * 100}%` }}
                />
            </div>

            <h3 className="gp-trivia-question">{q.question}</h3>

            <div className="gp-trivia-options-grid">
                {q.options.map((opt, i) => {
                    let optClass = 'gp-opt-btn';
                    if (selectedIdx !== null) {
                        if (i === q.correctIndex) optClass += ' correct';
                        else if (i === selectedIdx) optClass += ' wrong';
                        else optClass += ' disabled';
                    }
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleSelectOption(i)}
                            disabled={selectedIdx !== null}
                            className={optClass}
                        >
                            <span className="gp-opt-letter">{String.fromCharCode(65 + i)}</span>
                            <span className="gp-opt-text">{opt}</span>
                        </button>
                    );
                })}
            </div>

            {showExplanation && (
                <div className="gp-trivia-feedback">
                    <p className="gp-feedback-text">
                        <strong>{selectedIdx === q.correctIndex ? '✅ Correct! ' : '💡 Fact: '}</strong>
                        {q.explanation}
                    </p>
                    <button type="button" onClick={handleNext} className="gp-trivia-next-btn">
                        <span>{currentIdx < TRIVIA_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <style>{`
                .gp-trivia-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 620px;
                    margin: 0 auto;
                }

                .gp-trivia-topbar {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: #8B949E;
                    margin-bottom: 6px;
                }

                .gp-trivia-progress-bar {
                    width: 100%;
                    height: 5px;
                    background: #21262D;
                    border-radius: 999px;
                    overflow: hidden;
                    margin-bottom: 1.25rem;
                }

                .gp-trivia-progress-fill {
                    height: 100%;
                    background: #10B981;
                    transition: width 0.3s ease;
                }

                .gp-trivia-question {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #FFFFFF;
                    margin: 0 0 1.25rem 0;
                    line-height: 1.4;
                }

                .gp-trivia-options-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                    margin-bottom: 1.25rem;
                }

                .gp-opt-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #21262D;
                    border: 1px solid #30363D;
                    padding: 12px 16px;
                    border-radius: 10px;
                    color: #F0F6FC;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.15s ease;
                }

                .gp-opt-btn:hover:not(:disabled) {
                    background: #30363D;
                    border-color: #10B981;
                    transform: translateX(4px);
                }

                .gp-opt-letter {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 26px;
                    height: 26px;
                    border-radius: 6px;
                    background: #0D1117;
                    color: #8B949E;
                    font-size: 0.8rem;
                    font-weight: 800;
                }

                .gp-opt-btn.correct {
                    background: rgba(16, 185, 129, 0.2);
                    border-color: #10B981;
                    color: #34D399;
                }

                .gp-opt-btn.correct .gp-opt-letter {
                    background: #10B981;
                    color: #042416;
                }

                .gp-opt-btn.wrong {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #EF4444;
                    color: #F87171;
                }

                .gp-opt-btn.wrong .gp-opt-letter {
                    background: #EF4444;
                    color: #FFFFFF;
                }

                .gp-opt-btn.disabled {
                    opacity: 0.55;
                    cursor: default;
                }

                .gp-trivia-feedback {
                    background: #0D1117;
                    border: 1px solid #30363D;
                    border-radius: 10px;
                    padding: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    animation: gpFadeUp 0.25s ease-out;
                }

                .gp-feedback-text {
                    font-size: 0.82rem;
                    color: #C9D1D9;
                    line-height: 1.5;
                    margin: 0;
                }

                .gp-trivia-next-btn {
                    align-self: flex-end;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #10B981;
                    color: #042416;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.15s ease;
                }

                .gp-trivia-next-btn:hover {
                    transform: translateX(2px);
                }
            `}</style>
        </div>
    );
}
