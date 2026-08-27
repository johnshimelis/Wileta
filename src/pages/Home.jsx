import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, Smartphone, Wallet, ShieldCheck, Zap,
    CheckCircle, MessageSquare, Heart, Video, Sparkles,
    ChevronDown, ChevronUp, Copy, Users, Play, Volume2,
    DollarSign, Sliders, ExternalLink, Award, Check, RefreshCw,
    TrendingUp, Star, Bell, Gift, ArrowUpRight, Lock, CheckCircle2,
    Radio, Flame, Coffee, Rocket, Crown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // ── 1. Interactive Hero Creator Simulator ─────────────────────────────
    const sampleCreators = [
        {
            name: 'Hana Tadesse',
            handle: 'hanacreates',
            role: 'Tech & Lifestyle YouTuber',
            avatar: '👩🏾‍💻',
            preset: '100',
            supporters: 1420,
            recentSupporter: 'Natnael T.',
            note: 'Loved your latest video! Gursha on me ☕'
        },
        {
            name: 'Dawit Getachew',
            handle: 'dawitgaming',
            role: 'Live Streamer & Esports',
            avatar: '🎮',
            preset: '250',
            supporters: 2890,
            recentSupporter: 'Kidus M.',
            note: 'Insane clutch in the tournament bro! 🚀'
        },
        {
            name: 'Selamawit Bekele',
            handle: 'selampodcast',
            role: 'Podcaster & Storyteller',
            avatar: '🎙️',
            preset: '50',
            supporters: 860,
            recentSupporter: 'Bethlehem A.',
            note: 'Keep inspiring our community with great stories ❤️'
        }
    ];

    const [selectedCreatorIdx, setSelectedCreatorIdx] = useState(0);
    const activeCreator = sampleCreators[selectedCreatorIdx];

    const [simAmount, setSimAmount] = useState('100');
    const [simCustomMode, setSimCustomMode] = useState(false);
    const [simCustomVal, setSimCustomVal] = useState('');
    const [simMessage, setSimMessage] = useState('Loved your latest video! Gursha on me ☕');
    const [simState, setSimState] = useState('idle'); // 'idle' | 'ussd_prompt' | 'pin_entering' | 'success'
    const [simPin, setSimPin] = useState('');
    const [simAlertToast, setSimAlertToast] = useState(false);

    const quickReactions = [
        '☕ Gursha on me!',
        '🚀 Keep pushing quality!',
        '🔥 Best content in Ethiopia!',
        '❤️ Proud supporter!',
        '💡 Invaluable tutorials!'
    ];

    const handleSendSimTip = (e) => {
        if (e) e.preventDefault();
        const effectiveAmount = simCustomMode && simCustomVal ? simCustomVal : simAmount;
        setSimState('ussd_prompt');
        setSimPin('');
        setTimeout(() => {
            setSimState('pin_entering');
            setSimPin('• • • •');
            setTimeout(() => {
                setSimState('success');
                setSimAlertToast(true);
                setTimeout(() => setSimAlertToast(false), 4500);
            }, 1200);
        }, 1000);
    };

    // ── 2. Handle Availability Checker ────────────────────────────────────
    const [claimUsername, setClaimUsername] = useState('');
    const [claimStatus, setClaimStatus] = useState(null);

    const handleCheckUsername = (val) => {
        const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
        setClaimUsername(clean);
        if (clean.length >= 3) {
            setClaimStatus('available');
        } else {
            setClaimStatus(null);
        }
    };

    // ── 3. Earnings Calculator ────────────────────────────────────────────
    const [fanCount, setFanCount] = useState(150);
    const [avgTip, setAvgTip] = useState(100);
    const monthlyEstimate = fanCount * avgTip;
    const annualEstimate = monthlyEstimate * 12;

    const setTier = (fans, tip) => {
        setFanCount(fans);
        setAvgTip(tip);
    };

    // ── 4. OBS Stream Alert Simulator ─────────────────────────────────────
    const [obsAlertActive, setObsAlertActive] = useState(false);
    const [obsCustomTip, setObsCustomTip] = useState(250);
    const [obsCustomName, setObsCustomName] = useState('Abebe K.');
    const [obsCustomNote, setObsCustomNote] = useState('Insane clutch gameplay on stream! Keep grinding 🚀');

    const triggerObsAlertDemo = () => {
        setObsAlertActive(true);
        setTimeout(() => setObsAlertActive(false), 4500);
    };

    // ── 5. FAQ Accordion ──────────────────────────────────────────────────
    const [openFaq, setOpenFaq] = useState(0);
    const faqs = [
        {
            q: "How do Ethiopian creators withdraw their earnings?",
            a: "Directly to your verified Telebirr number or linked Ethiopian commercial bank account (CBE, Bank of Abyssinia, Awash, Dashen, Wegagen, Cooperative Bank of Oromia, Nib). Withdrawals are processed with 0% hidden exchange fees and deposited instantly."
        },
        {
            q: "How does the live OBS Stream Alert overlay work?",
            a: "You get a private Browser Source URL in your dashboard. Paste it into OBS Studio, Streamlabs, or TikTok Live Studio. When any supporter sends a tip via Telebirr, an animated banner pops up on your stream in real-time with sound effects and the supporter's custom shoutout message."
        },
        {
            q: "What are the platform and transaction fees?",
            a: "Creating an account, customizing your tipping link, and generating OBS overlays is 100% free with no monthly subscription. We deduct only a transparent 5% platform fee on tips received to cover Telebirr payment gateway charges, automated USSD routing, and server infrastructure."
        },
        {
            q: "Is GurshaPay compliant with Ethiopian financial regulations?",
            a: "Yes. All payouts are executed in Ethiopian Birr (ETB) through licensed financial institutions and Telebirr wallets with national KYC identity verification standards."
        }
    ];

    const effectiveTipDisplay = simCustomMode && simCustomVal ? simCustomVal : simAmount;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', overflowX: 'hidden' }}>
            <Navbar />

            {/* Live Global Toast Simulation when tip completes */}
            {simAlertToast && (
                <div 
                    className="animate-fade-in"
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: '#0F172A',
                        color: '#FFFFFF',
                        border: '1px solid #334155',
                        borderRadius: '14px',
                        padding: '1rem 1.25rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        maxWidth: '380px'
                    }}
                >
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bell size={18} color="#FFFFFF" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>🔔 Live Stream Alert Fired!</span>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: '#94A3B8' }}>
                            {activeCreator.name} received +{effectiveTipDisplay} ETB via Telebirr USSD.
                        </div>
                    </div>
                </div>
            )}

            {/* ── HERO SECTION ────────────────────────────────────────── */}
            <section style={{ position: 'relative', padding: '4rem 1.25rem 5rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
                    
                    {/* Left: Value Proposition */}
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }}></span>
                            Ethiopia's #1 Creator Monetization Platform
                        </div>

                        <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.12, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                            Turn Support Into <br />
                            <span style={{ color: 'var(--primary)' }}>Real Income.</span>
                        </h1>

                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '520px' }}>
                            The modern, high-speed tipping platform for Ethiopian YouTubers, streamers, podcasters, and educators to accept instant tips via Telebirr and local banks.
                        </p>

                        {/* Interactive Handle Claim Bar */}
                        <div style={{ 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '12px', 
                            padding: '0.45rem 0.45rem 0.45rem 1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            maxWidth: '460px', 
                            marginBottom: '0.75rem', 
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.15s ease'
                        }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>gurshapay.com/@</span>
                            <input
                                type="text"
                                placeholder="yourname"
                                value={claimUsername}
                                onChange={(e) => handleCheckUsername(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', flex: 1, minWidth: 0 }}
                            />
                            <Button
                                variant="primary"
                                size="sm"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => navigate('/signup' + (claimUsername ? '?username=' + claimUsername : ''))}
                            >
                                Claim Link
                            </Button>
                        </div>

                        {claimStatus === 'available' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.825rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                                <CheckCircle size={14} /> @{claimUsername} is available! Claim it today.
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Free custom URL • Instant Telebirr setup in 30 seconds
                            </div>
                        )}

                        {/* Trust Pillars */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>0% Fee</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To create account</div>
                            </div>
                            <div style={{ width: '1px', height: '28px', background: 'var(--border-color)' }}></div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>Instant</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Telebirr payout</div>
                            </div>
                            <div style={{ width: '1px', height: '28px', background: 'var(--border-color)' }}></div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--secondary)' }}>OBS 1080p</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stream sound alerts</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: INTERACTIVE TIPPING WIDGET SIMULATOR */}
                    <div id="simulator">
                        {/* Creator Switcher Tabs */}
                        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem', background: 'var(--card-bg-subtle)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            {sampleCreators.map((c, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCreatorIdx(i);
                                        setSimAmount(c.preset);
                                        setSimCustomMode(false);
                                        setSimMessage(c.note);
                                        setSimState('idle');
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem 0.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: selectedCreatorIdx === i ? 'var(--card-bg)' : 'transparent',
                                        color: selectedCreatorIdx === i ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 700,
                                        fontSize: '0.8125rem',
                                        cursor: 'pointer',
                                        boxShadow: selectedCreatorIdx === i ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={e => { if (selectedCreatorIdx !== i) e.currentTarget.style.color = 'var(--text-main)'; }}
                                    onMouseLeave={e => { if (selectedCreatorIdx !== i) e.currentTarget.style.color = 'var(--text-muted)'; }}
                                >
                                    {c.avatar} {c.name.split(' ')[0]}
                                </button>
                            ))}
                        </div>

                        {/* Interactive Card */}
                        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)', overflow: 'hidden' }}>
                            {/* Card Top Profile Header */}
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '2px solid var(--border-color)' }}>
                                        {activeCreator.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.975rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            {activeCreator.name}
                                            <CheckCircle size={15} color="var(--primary)" />
                                        </div>
                                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                                            @{activeCreator.handle} • {activeCreator.role}
                                        </div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.25rem 0.65rem', borderRadius: '9999px', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                                    {activeCreator.supporters.toLocaleString()} fans
                                </span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '1.5rem' }}>
                                {simState === 'idle' && (
                                    <form onSubmit={handleSendSimTip}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                            <label className="form-label" style={{ margin: 0, fontSize: '0.825rem' }}>Select Tip Amount</label>
                                            <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>
                                                {effectiveTipDisplay} ETB <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>({Math.max(1, Math.round(Number(effectiveTipDisplay) / 50))} Gurshas ☕)</span>
                                            </span>
                                        </div>

                                        {/* Amount Chips */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            {[
                                                { val: '50', icon: '☕' },
                                                { val: '100', icon: '🍕' },
                                                { val: '250', icon: '🚀' },
                                                { val: '500', icon: '👑' }
                                            ].map((item) => (
                                                <button
                                                    key={item.val}
                                                    type="button"
                                                    onClick={() => {
                                                        setSimAmount(item.val);
                                                        setSimCustomMode(false);
                                                    }}
                                                    style={{
                                                        padding: '0.65rem 0',
                                                        borderRadius: '8px',
                                                        border: (!simCustomMode && simAmount === item.val) ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                        background: (!simCustomMode && simAmount === item.val) ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                        color: (!simCustomMode && simAmount === item.val) ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: 800,
                                                        fontSize: '0.875rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (simCustomMode || simAmount !== item.val) {
                                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (simCustomMode || simAmount !== item.val) {
                                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                                        }
                                                    }}
                                                >
                                                    {item.val} ETB {item.icon}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Quick Reaction Message Chips */}
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                {quickReactions.slice(0, 4).map((q, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setSimMessage(q)}
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.55rem',
                                                            borderRadius: '9999px',
                                                            border: '1px solid var(--border-color)',
                                                            background: simMessage === q ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                            color: simMessage === q ? 'var(--primary)' : 'var(--text-muted)',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                        onMouseLeave={e => { if (simMessage !== q) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={simMessage}
                                                onChange={(e) => setSimMessage(e.target.value)}
                                                placeholder="Add a custom note..."
                                                style={{ fontSize: '0.875rem' }}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            icon={Smartphone}
                                            className="btn-full"
                                            style={{ height: '48px', fontSize: '0.95rem', fontWeight: 800 }}
                                        >
                                            Send {effectiveTipDisplay} ETB with Telebirr ⚡
                                        </Button>
                                    </form>
                                )}

                                {simState === 'ussd_prompt' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.75rem 0' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(0, 114, 206, 0.12)', color: '#0072CE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem' }}>
                                            <Smartphone size={26} />
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                                            Telebirr USSD Push Prompt
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '1rem' }}>
                                            Transferring {effectiveTipDisplay} ETB to {activeCreator.name}...
                                        </p>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--card-bg-subtle)', padding: '0.45rem 0.95rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 700, color: '#0072CE', border: '1px solid var(--border-color)' }}>
                                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0072CE' }}></span>
                                            <span>Pushing USSD Request...</span>
                                        </div>
                                    </div>
                                )}

                                {simState === 'pin_entering' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.75rem 0' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem' }}>
                                            <ShieldCheck size={26} />
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                                            Telebirr PIN Verification
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '1rem' }}>
                                            Entering Telebirr PIN on device:
                                        </p>
                                        <div style={{ fontSize: '1.75rem', letterSpacing: '0.35em', fontWeight: 900, color: 'var(--primary)' }}>
                                            {simPin}
                                        </div>
                                    </div>
                                )}

                                {simState === 'success' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.25rem 0' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                            <CheckCircle size={28} />
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                                            {effectiveTipDisplay} ETB Received! 🎉
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                                            "{simMessage}"
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px', background: 'var(--success-light)', color: 'var(--success)' }}>
                                                Telebirr Settled ✓
                                            </span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px', background: 'rgba(217, 119, 6, 0.12)', color: 'var(--secondary)' }}>
                                                OBS Alert Fired ⚡
                                            </span>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setSimState('idle')}
                                        >
                                            Test Another Tip
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FINANCIAL SERVICES & BANK INTEGRATIONS ───────────────── */}
            <section id="payouts" style={{ padding: '4.5rem 1.25rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.775rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '0.35rem' }}>
                            National Financial Rails
                        </p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Direct Settlement with Ethiopian Banks</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.15rem' }}>
                        {[
                            { name: 'Telebirr', tag: 'Instant Push USSD', color: '#0072CE', badge: 'Fastest', initial: 'TB' },
                            { name: 'Commercial Bank (CBE)', tag: 'CBE Birr & Accounts', color: '#5C2D91', badge: 'Popular', initial: 'CBE' },
                            { name: 'Bank of Abyssinia', tag: 'Apollo Direct', color: '#E5A91E', badge: 'Direct', initial: 'BOA' },
                            { name: 'Awash Bank', tag: 'Awash Birr Pro', color: '#00539F', badge: 'Direct', initial: 'AWB' },
                            { name: 'Dashen Bank', tag: 'Amole Settlement', color: '#F37021', badge: 'Direct', initial: 'DSH' },
                            { name: 'Coop Bank Oromia', tag: 'CoopPay Verified', color: '#00AEEF', badge: 'Direct', initial: 'CBO' }
                        ].map((bank, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '1.25rem 1.15rem',
                                    borderRadius: '12px',
                                    background: 'var(--card-bg-subtle)',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.45rem',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px -2px rgba(15, 23, 42, 0.08)';
                                    e.currentTarget.style.borderColor = bank.color;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: bank.color, color: '#FFFFFF', fontWeight: 900, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {bank.initial}
                                    </div>
                                    <span style={{ fontSize: '0.675rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '9999px', background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                                        {bank.badge}
                                    </span>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{bank.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bank.tag}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EARNINGS ESTIMATOR CALCULATOR ───────────────────────── */}
            <section id="calculator" style={{ padding: '5rem 1.25rem', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.75rem 2rem', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.06em' }}>Revenue Estimator</span>
                        <h2 style={{ fontSize: '1.95rem', fontWeight: 900, marginTop: '0.35rem' }}>How Much Could You Earn on GurshaPay?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>Select a preset tier or slide to match your Ethiopian audience</p>
                    </div>

                    {/* Preset Tiers */}
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                        {[
                            { fans: 50, tip: 50, label: '🌱 Starter Creator (50 fans)' },
                            { fans: 250, tip: 100, label: '🚀 Growing YouTuber (250 fans)' },
                            { fans: 1000, tip: 200, label: '👑 Top Streamer (1,000 fans)' }
                        ].map((tier, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setTier(tier.fans, tier.tip)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    border: (fanCount === tier.fans && avgTip === tier.tip) ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                    background: (fanCount === tier.fans && avgTip === tier.tip) ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                    color: (fanCount === tier.fans && avgTip === tier.tip) ? 'var(--primary)' : 'var(--text-secondary)',
                                    fontWeight: 700,
                                    fontSize: '0.8125rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => { if (fanCount !== tier.fans || avgTip !== tier.tip) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                onMouseLeave={e => { if (fanCount !== tier.fans || avgTip !== tier.tip) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                            >
                                {tier.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
                        {/* Sliders */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Monthly Supporters</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{fanCount} fans</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="2000"
                                    step="10"
                                    value={fanCount}
                                    onChange={(e) => setFanCount(Number(e.target.value))}
                                    style={{ accentColor: 'var(--primary)', width: '100%', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    <span>10 fans</span>
                                    <span>2,000 fans</span>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Average Tip</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{avgTip} ETB</span>
                                </div>
                                <input
                                    type="range"
                                    min="25"
                                    max="500"
                                    step="25"
                                    value={avgTip}
                                    onChange={(e) => setAvgTip(Number(e.target.value))}
                                    style={{ accentColor: 'var(--primary)', width: '100%', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    <span>25 ETB</span>
                                    <span>500 ETB</span>
                                </div>
                            </div>
                        </div>

                        {/* Result Container */}
                        <div style={{ background: 'linear-gradient(145deg, #059669 0%, #047857 100%)', padding: '2.25rem 2rem', borderRadius: '14px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.4)' }}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                                Estimated Monthly Earnings
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem', color: '#FFFFFF' }}>
                                {monthlyEstimate.toLocaleString()} <span style={{ fontSize: '1.1rem', opacity: 0.85 }}>ETB</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                                ≈ {annualEstimate.toLocaleString()} ETB per year
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#FFFFFF',
                                    color: 'var(--primary)',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Start Earning Today →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── OBS LIVE STREAM OVERLAY SHOWCASE ─────────────────────── */}
            <section style={{ padding: '4.5rem 1.25rem', background: 'var(--card-bg-subtle)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.06em' }}>OBS & Streamlabs</span>
                            <h2 style={{ fontSize: '1.95rem', fontWeight: 900, margin: '0.35rem 0 1rem' }}>
                                Real-Time On-Screen Alerts for Streamers
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Connect GurshaPay to OBS Studio, Streamlabs, or TikTok in 10 seconds. When any supporter sends a tip, an animated banner pops up on screen with sound and customized text.
                            </p>
                            <Button
                                variant="primary"
                                size="md"
                                icon={Play}
                                onClick={triggerObsAlertDemo}
                            >
                                Test Live Alert Banner
                            </Button>
                        </div>

                        {/* Interactive OBS Preview Screen */}
                        <div style={{ position: 'relative', background: '#090D14', borderRadius: '16px', padding: '1.75rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid #1E293B', overflow: 'hidden', boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.4)' }}>
                            <div style={{ position: 'absolute', top: '14px', left: '18px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OBS Live Stream 1080p</span>
                            </div>

                            {obsAlertActive ? (
                                <div className="animate-fade-in" style={{ background: 'var(--primary)', border: '2px solid #10B981', borderRadius: '12px', padding: '1.25rem 1.75rem', color: '#FFFFFF', textAlign: 'center', maxWidth: '90%', boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                                        🎉 {obsCustomName} tipped {obsCustomTip} ETB!
                                    </div>
                                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', opacity: 0.95, fontStyle: 'italic' }}>
                                        "{obsCustomNote}"
                                    </p>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#64748B' }}>
                                    <Video size={40} style={{ opacity: 0.35, margin: '0 auto 0.65rem' }} />
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#E2E8F0' }}>OBS Browser Source Preview</div>
                                    <div style={{ fontSize: '0.775rem', marginTop: '0.25rem' }}>Click "Test Live Alert Banner" to simulate an alert</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW GURSHAPAY WORKS ─────────────────────────────────── */}
            <section id="how-it-works" style={{ padding: '5rem 1.25rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.06em' }}>3-Step Simplicity</span>
                    <h2 style={{ fontSize: '1.95rem', fontWeight: 900, marginTop: '0.35rem' }}>How GurshaPay Works</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
                    <div 
                        style={{ padding: '1.75rem', borderRadius: '14px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.15rem' }}>
                            1
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>1. Claim Your @handle</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                            Sign up in 30 seconds and secure your customized profile link (e.g. <code>gurshapay.com/@yourname</code>).
                        </p>
                    </div>

                    <div 
                        style={{ padding: '1.75rem', borderRadius: '14px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--secondary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.12)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.15rem' }}>
                            2
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>2. Share with Your Fans</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                            Add your link to your YouTube descriptions, TikTok bio, Telegram channel, or embed the OBS overlay in your streams.
                        </p>
                    </div>

                    <div 
                        style={{ padding: '1.75rem', borderRadius: '14px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--success)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.15rem' }}>
                            3
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>3. Instant Cash Out</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                            Get notified for every tip and withdraw funds directly to your Telebirr wallet or linked Ethiopian commercial bank account.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── FAQ ACCORDION ───────────────────────────────────────── */}
            <section id="faq" style={{ padding: '4.5rem 1.25rem', maxWidth: '780px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Got Questions?</span>
                    <h2 style={{ fontSize: '1.95rem', fontWeight: 900, marginTop: '0.35rem' }}>Frequently Asked Questions</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            style={{ 
                                background: 'var(--card-bg)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '10px', 
                                overflow: 'hidden', 
                                cursor: 'pointer', 
                                transition: 'all 0.15s ease' 
                            }}
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => { if (openFaq !== index) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                        >
                            <div style={{ padding: '1.15rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                <h3 style={{ fontSize: '0.975rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                    {faq.q}
                                </h3>
                                {openFaq === index ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                            </div>
                            {openFaq === index && (
                                <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HIGH CONVERSION FOOTER CTA ──────────────────────────── */}
            <section style={{ padding: '5rem 1.25rem', background: 'linear-gradient(145deg, #059669 0%, #047857 100%)', color: '#FFFFFF', textAlign: 'center' }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '1rem' }}>
                        Ready to Monetize Your Ethiopian Audience?
                    </h2>
                    <p style={{ fontSize: '1.05rem', opacity: 0.95, lineHeight: 1.6, marginBottom: '2rem' }}>
                        Join thousands of Ethiopian creators earning direct tips via Telebirr and local banks today.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        style={{
                            padding: '0.85rem 2rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#FFFFFF',
                            color: 'var(--primary)',
                            fontWeight: 800,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Claim Your Free Link →
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
