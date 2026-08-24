import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, Smartphone, Wallet, ShieldCheck, Zap,
    CheckCircle, MessageSquare, Heart, Video, Sparkles,
    ChevronDown, ChevronUp, Copy, Users, Play, Volume2,
    DollarSign, Sliders, ExternalLink, Award, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // ── 1. Interactive Hero Creator Simulator ─────────────────────────────
    const sampleCreators = [
        { name: 'Hana Tadesse', handle: 'hanacreates', role: 'Tech & Lifestyle YouTuber', avatar: '👩🏾‍💻', preset: '100' },
        { name: 'Dawit Getachew', handle: 'dawitgaming', role: 'Live Streamer & Esports', avatar: '🎮', preset: '250' },
        { name: 'Selamawit Bekele', handle: 'selampodcast', role: 'Podcaster & Storyteller', avatar: '🎙️', preset: '50' }
    ];
    const [selectedCreatorIdx, setSelectedCreatorIdx] = useState(0);
    const activeCreator = sampleCreators[selectedCreatorIdx];

    const [simAmount, setSimAmount] = useState('100');
    const [customSimAmount, setCustomSimAmount] = useState('');
    const [isCustomAmt, setIsCustomAmt] = useState(false);
    const [simMessage, setSimMessage] = useState('Loved your latest video! Gursha on me ☕');
    const [simState, setSimState] = useState('idle'); // 'idle' | 'ussd_prompt' | 'success'

    // Preset emoji message chips
    const quickReactions = [
        '☕ Gursha on me!',
        '🚀 Keep pushing quality!',
        '🔥 Best content in Ethiopia!',
        '❤️ Proud of your work!'
    ];

    const handleSendSimTip = (e) => {
        e.preventDefault();
        setSimState('ussd_prompt');
        setTimeout(() => {
            setSimState('success');
        }, 1600);
    };

    // ── 2. Interactive Handle Availability Checker ───────────────────────
    const [claimUsername, setClaimUsername] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [claimStatus, setClaimStatus] = useState(null); // null | 'available' | 'invalid'

    const handleCheckUsername = (val) => {
        const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
        setClaimUsername(clean);
        if (clean.length >= 3) {
            setIsChecking(true);
            setTimeout(() => {
                setIsChecking(false);
                setClaimStatus('available');
            }, 300);
        } else {
            setClaimStatus(null);
        }
    };

    // ── 3. Interactive Earnings Calculator ────────────────────────────────
    const [fanCount, setFanCount] = useState(150);
    const [avgTip, setAvgTip] = useState(100);
    const monthlyEstimate = (fanCount * avgTip);
    const annualEstimate = monthlyEstimate * 12;

    // ── 4. Interactive OBS Stream Alert Simulator ────────────────────────
    const [obsAlertActive, setObsAlertActive] = useState(false);
    const triggerObsAlertDemo = () => {
        setObsAlertActive(true);
        setTimeout(() => setObsAlertActive(false), 4500);
    };

    // ── 5. FAQ Accordion ──────────────────────────────────────────────────
    const [openFaq, setOpenFaq] = useState(0);
    const faqs = [
        {
            q: "How do Ethiopian creators withdraw their earnings?",
            a: "Directly to your verified Telebirr number or linked Ethiopian commercial bank account (CBE, Bank of Abyssinia, Awash, Dashen, Wegagen, Cooperative Bank of Oromia, Nib). Withdrawals are processed with 0% hidden exchange fees."
        },
        {
            q: "How does the live OBS Stream Alert overlay work?",
            a: "You get a private Browser Source URL in your dashboard. Paste it into OBS Studio or Streamlabs. When any supporter sends a tip, an animated banner pops up on stream in real-time with sound effects and the supporter's shoutout message."
        },
        {
            q: "What are the transaction fees?",
            a: "Creating an account, setting up your profile, and generating OBS overlays is 100% free. We deduct only a transparent 5% platform fee on tips received to cover Telebirr gateway charges and server maintenance."
        },
        {
            q: "Is GurshaPay compliant with Ethiopian banking regulations?",
            a: "Yes. All payouts are executed in Ethiopian Birr (ETB) through licensed financial institutions and Telebirr wallets with national KYC identity verification standards."
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', overflowX: 'hidden' }}>
            <Navbar />

            {/* ── HERO SECTION ────────────────────────────────────────── */}
            <section style={{ position: 'relative', padding: '4rem 1.5rem 5rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
                    {/* Left: Value Proposition */}
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid rgba(10, 92, 54, 0.15)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                            Ethiopia's #1 Creator Monetization Platform
                        </div>

                        <h1 className="heading-display" style={{ marginBottom: '1.25rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                            Turn Support Into <br />
                            <span className="text-gradient">Real Income.</span>
                        </h1>

                        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '540px' }}>
                            The modern, high-speed tipping platform for Ethiopian YouTubers, streamers, podcasters, and educators to accept instant tips via Telebirr and local banks.
                        </p>

                        {/* Interactive Handle Claim Bar */}
                        <div style={{ background: 'var(--card-bg)', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '0.4rem 0.5rem 0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '480px', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.95rem' }}>gurshapay.com/@</span>
                            <input
                                type="text"
                                placeholder="yourname"
                                value={claimUsername}
                                onChange={(e) => handleCheckUsername(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', flex: 1, minWidth: 0 }}
                            />
                            <Button
                                variant="primary"
                                size="md"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => navigate('/signup' + (claimUsername ? '?username=' + claimUsername : ''))}
                            >
                                Claim Link
                            </Button>
                        </div>

                        {claimStatus === 'available' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', marginTop: '-0.75rem' }}>
                                <CheckCircle size={15} /> @{claimUsername} is available! Claim it now before someone else does.
                            </div>
                        )}

                        {/* Quick Trust Pillars */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', maxWidth: '480px' }}>
                            <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>0% Fee</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To create account</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>Instant</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Telebirr payout</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--secondary)' }}>OBS Ready</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live sound alerts</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: INTERACTIVE LIVE TIPPING PLAYGROUND */}
                    <div id="simulator">
                        {/* Creator Switcher Tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', background: 'var(--card-bg-subtle)', padding: '0.3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                            {sampleCreators.map((c, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCreatorIdx(i);
                                        setSimAmount(c.preset);
                                        setIsCustomAmt(false);
                                        setSimState('idle');
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        background: selectedCreatorIdx === i ? 'var(--card-bg)' : 'transparent',
                                        color: selectedCreatorIdx === i ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        boxShadow: selectedCreatorIdx === i ? 'var(--shadow-xs)' : 'none',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {c.avatar} {c.name.split(' ')[0]}
                                </button>
                            ))}
                        </div>

                        {/* Interactive Card */}
                        <Card padding="none" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', position: 'relative' }}>
                            {/* Card Header */}
                            <div style={{ background: 'linear-gradient(135deg, #0A5C36 0%, #064E3B 100%)', padding: '1.25rem 1.5rem', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                            {activeCreator.avatar}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{activeCreator.name}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>@{activeCreator.handle} • {activeCreator.role}</div>
                                        </div>
                                    </div>
                                    <Badge variant="success" size="sm" icon={CheckCircle} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
                                        Verified
                                    </Badge>
                                </div>
                            </div>

                            {/* Card Body with State Machine */}
                            <div style={{ padding: '1.5rem' }}>
                                {simState === 'idle' && (
                                    <form onSubmit={handleSendSimTip}>
                                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Select Support Amount</span>
                                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                                {isCustomAmt ? (customSimAmount || '0') : simAmount} ETB
                                            </span>
                                        </label>

                                        {/* Amount Chips */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                            {['50', '100', '250', '500'].map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => {
                                                        setSimAmount(amt);
                                                        setIsCustomAmt(false);
                                                    }}
                                                    style={{
                                                        padding: '0.65rem 0',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: (!isCustomAmt && simAmount === amt) ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                        background: (!isCustomAmt && simAmount === amt) ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                        color: (!isCustomAmt && simAmount === amt) ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: 800,
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                >
                                                    {amt} ETB
                                                </button>
                                            ))}
                                        </div>

                                        {/* Quick Reaction message buttons */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label className="form-label" style={{ marginBottom: '0.35rem' }}>Quick Message</label>
                                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                {quickReactions.map((q, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setSimMessage(q)}
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.6rem',
                                                            borderRadius: '9999px',
                                                            border: '1px solid var(--border-color)',
                                                            background: simMessage === q ? 'var(--primary-light)' : 'var(--bg-color)',
                                                            color: simMessage === q ? 'var(--primary)' : 'var(--text-muted)',
                                                            fontWeight: 600,
                                                            cursor: 'pointer'
                                                        }}
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
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            icon={Smartphone}
                                            className="btn-full"
                                        >
                                            Simulate Telebirr Payment
                                        </Button>
                                    </form>
                                )}

                                {simState === 'ussd_prompt' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                            <Smartphone size={28} />
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                            Telebirr Push Prompt Received
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                            Simulating USSD PIN authorization on your phone...
                                        </p>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg-subtle)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <span>PIN: ••••</span>
                                            <span style={{ color: 'var(--primary)' }}>Authorized ✓</span>
                                        </div>
                                    </div>
                                )}

                                {simState === 'success' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                            <CheckCircle size={28} />
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                                            {isCustomAmt ? customSimAmount : simAmount} ETB Sent to {activeCreator.name}!
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                                            "{simMessage}"
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                            <Badge variant="success" size="sm">Telebirr Payout Complete</Badge>
                                            <Badge variant="warning" size="sm">OBS Alert Popped ⚡</Badge>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setSimState('idle')}
                                        >
                                            Try Another Amount / Creator
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ── FINANCIAL SERVICES & BANK INTEGRATIONS ───────────────── */}
            <section id="payouts" style={{ padding: '3.5rem 1.5rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                            National Financial Rails
                        </p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Direct Settlement with Leading Ethiopian Banks</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        {[
                            { name: 'Telebirr', tag: 'Instant Push & USSD', color: '#0072CE', badge: 'Fastest' },
                            { name: 'Commercial Bank (CBE)', tag: 'CBE Birr & Accounts', color: '#5C2D91', badge: 'Popular' },
                            { name: 'Bank of Abyssinia', tag: 'Apollo & IBAN Support', color: '#E5A91E', badge: 'Direct' },
                            { name: 'Awash Bank', tag: 'Awash Birr Pro Settlement', color: '#00539F', badge: 'Direct' },
                            { name: 'Dashen Bank', tag: 'Amole & Transfer', color: '#F37021', badge: 'Direct' },
                            { name: 'Coop Bank Oromia', tag: 'CoopPay Verified', color: '#00AEEF', badge: 'Direct' }
                        ].map((bank, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--card-bg-subtle)',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: bank.color }}></div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '9999px', background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                                        {bank.badge}
                                    </span>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{bank.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bank.tag}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INTERACTIVE REVENUE ESTIMATOR ───────────────────────── */}
            <section id="calculator" style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                <Card style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <Badge variant="primary" style={{ marginBottom: '0.5rem' }}>Earnings Calculator</Badge>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>How Much Could You Earn on GurshaPay?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Adjust the sliders below to estimate your monthly creator income from loyal Ethiopian supporters.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem', alignItems: 'center' }}>
                        {/* Sliders */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Monthly Supporters</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{fanCount} fans</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="2000"
                                    step="10"
                                    value={fanCount}
                                    onChange={(e) => setFanCount(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    <span>10 supporters</span>
                                    <span>2,000 supporters</span>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Average Tip Amount</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{avgTip} ETB</span>
                                </div>
                                <input
                                    type="range"
                                    min="25"
                                    max="500"
                                    step="25"
                                    value={avgTip}
                                    onChange={(e) => setAvgTip(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    <span>25 ETB</span>
                                    <span>500 ETB</span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Result Box */}
                        <div style={{ background: 'linear-gradient(135deg, #0A5C36 0%, #064E3B 100%)', padding: '2rem', borderRadius: 'var(--radius-lg)', color: 'white', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                Estimated Monthly Earnings
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                                {monthlyEstimate.toLocaleString()} <span style={{ fontSize: '1.1rem', opacity: 0.8 }}>ETB</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                                ≈ {annualEstimate.toLocaleString()} ETB / year
                            </div>
                            <Button
                                variant="secondary"
                                size="md"
                                className="btn-full"
                                style={{ background: 'white', color: 'var(--primary)', fontWeight: 800 }}
                                onClick={() => navigate('/signup')}
                            >
                                Start Earning Today
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>

            {/* ── INTERACTIVE OBS LIVE STREAM OVERLAY SHOWCASE ─────────── */}
            <section style={{ padding: '5rem 1.5rem', background: 'var(--card-bg-subtle)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <Badge variant="primary" icon={Sparkles} style={{ marginBottom: '0.75rem' }}>Streamers & Gamers</Badge>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>
                                Live On-Screen Alerts for OBS Studio & TikTok
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Never miss a tip while streaming. Connect GurshaPay to OBS, Streamlabs, or vMix in 10 seconds with a transparent Browser Source link.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                    <CheckCircle size={18} color="var(--primary)" /> 1080p Crystal-clear transparent web layer
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                    <CheckCircle size={18} color="var(--primary)" /> Animated supporter messages & ETB badges
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                    <CheckCircle size={18} color="var(--primary)" /> Custom sound alerts triggered on Telebirr confirmation
                                </li>
                            </ul>
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
                        <div style={{ position: 'relative', background: '#0F172A', borderRadius: 'var(--radius-xl)', padding: '1.5rem', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                            <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase' }}>Live Stream 1080p</span>
                            </div>

                            {obsAlertActive ? (
                                <div className="animate-fade-in" style={{ background: 'linear-gradient(135deg, #0A5C36 0%, #064E3B 100%)', border: '2px solid #10B981', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.75rem', color: 'white', textAlign: 'center', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)', maxWidth: '90%' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                                        🎉 Abebe tipped 250 ETB!
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9, fontStyle: 'italic' }}>
                                        "Insane clutch gameplay on stream! Keep grinding 🚀"
                                    </p>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#64748B' }}>
                                    <Video size={40} style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>OBS Browser Source Preview</div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click "Test Live Alert Banner" to simulate a real-time tip</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW GURSHAPAY WORKS (3-STEP TIMELINE) ────────────────── */}
            <section id="how-it-works" style={{ padding: '6rem 1.5rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <Badge variant="primary" style={{ marginBottom: '0.75rem' }}>Simple 3-Step Flow</Badge>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>How GurshaPay Works</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0.5rem auto 0' }}>
                        Start receiving tips in under 2 minutes with zero technical friction.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                            1
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>1. Claim Your @handle</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Sign up in 30 seconds and secure your unique profile URL (e.g. <code>gurshapay.com/@yourname</code>).
                        </p>
                    </Card>

                    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                            2
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>2. Share with Your Fans</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Drop your link in YouTube descriptions, TikTok bio, Telegram channel, or embed the OBS overlay in your live streams.
                        </p>
                    </Card>

                    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                            3
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>3. Instant Cash Out</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Receive automated SMS notifications for every tip and cash out instantly to your Telebirr wallet or CBE bank account.
                        </p>
                    </Card>
                </div>
            </section>

            {/* ── FAQ SECTION ─────────────────────────────────────────── */}
            <section id="faq" style={{ padding: '5rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Badge variant="neutral" style={{ marginBottom: '0.5rem' }}>Got Questions?</Badge>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>Frequently Asked Questions</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {faqs.map((faq, index) => (
                        <Card
                            key={index}
                            padding="none"
                            style={{ overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        >
                            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{faq.q}</span>
                                {openFaq === index ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                            </div>
                            {openFaq === index && (
                                <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                                    {faq.a}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            {/* ── FINAL HIGH-CONVERTING CTA BANNER ────────────────────── */}
            <section style={{ padding: '3rem 1.5rem 6rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div
                    style={{
                        background: 'linear-gradient(135deg, #0A5C36 0%, #064E3B 100%)',
                        color: 'white',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-xl)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
                        <Badge variant="success" size="sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', marginBottom: '1rem' }}>
                            Join 1,000+ Ethiopian Creators
                        </Badge>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                            Ready to Start Receiving Support?
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: 1.5 }}>
                            Claim your custom link today and start accepting direct Telebirr & bank tips in minutes.
                        </p>
                        <Button
                            variant="secondary"
                            size="lg"
                            icon={ArrowRight}
                            iconPosition="right"
                            onClick={() => navigate('/signup')}
                            style={{ background: 'white', color: 'var(--primary)', fontWeight: 900 }}
                        >
                            Claim Your Free Link Now
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
