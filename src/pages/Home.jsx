import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, Smartphone, Wallet, ShieldCheck, Zap,
    CheckCircle, MessageSquare, Heart, Video, Sparkles,
    ChevronDown, ChevronUp, Copy, Users, Play, Volume2,
    DollarSign, Sliders, ExternalLink, Award, Check, RefreshCw,
    TrendingUp, Star, Bell, Gift, ArrowUpRight, Lock, CheckCircle2,
    Radio, Flame, Coffee, Rocket, Crown, Eye, Info, Search, HelpCircle,
    Music, Laptop, Send, Layers, ThumbsUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../utils/soundFx';
import { triggerConfetti } from '../utils/confettiFx';

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
        soundFx.playPop();
        setSimState('ussd_prompt');
        setSimPin('');

        // USSD Ping Audio
        setTimeout(() => {
            soundFx.playUssdPing();
        }, 200);

        setTimeout(() => {
            setSimState('pin_entering');
            soundFx.playKeypad();
            setSimPin('• • • •');
            
            setTimeout(() => {
                setSimState('success');
                soundFx.playSuccessFanfare();
                triggerConfetti({ count: 70 });
                setSimAlertToast(true);
                setTimeout(() => setSimAlertToast(false), 5000);
            }, 1300);
        }, 1100);
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

    // ── 3. Live Supporter Simulated Feed Ticker ────────────────────────────
    const tickerItems = [
        { name: 'Natnael T.', amount: '100 ETB', creator: 'Hana Tadesse', time: '2m ago', emoji: '☕' },
        { name: 'Kidus M.', amount: '250 ETB', creator: 'Dawit Gaming', time: '4m ago', emoji: '🚀' },
        { name: 'Bethlehem A.', amount: '50 ETB', creator: 'Selamawit', time: '7m ago', emoji: '❤️' },
        { name: 'Yared B.', amount: '500 ETB', creator: 'Tech Addis', time: '11m ago', emoji: '👑' },
        { name: 'Liya K.', amount: '150 ETB', creator: 'Ethiopian Pod', time: '15m ago', emoji: '🍕' }
    ];
    const [currentTickerIdx, setCurrentTickerIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTickerIdx((prev) => (prev + 1) % tickerItems.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [tickerItems.length]);

    // ── 4. Financial Rails & Banks Section ────────────────────────────────
    const [bankFilter, setBankFilter] = useState('all'); // 'all' | 'wallets' | 'banks'
    const [selectedBankModal, setSelectedBankModal] = useState(null);

    const bankPartners = [
        {
            id: 'telebirr',
            type: 'wallet',
            name: 'Telebirr',
            tag: 'Instant Push USSD',
            color: '#0072CE',
            badge: 'Fastest',
            initial: 'TB',
            speed: '1.8s instant push',
            limit: 'Up to 50,000 ETB/day',
            ussd: '*127# Push Notification',
            desc: 'Seamless direct USSD prompt sent straight to any Ethiopian mobile subscriber phone.'
        },
        {
            id: 'cbe',
            type: 'bank',
            name: 'Commercial Bank (CBE)',
            tag: 'CBE Birr & Account Direct',
            color: '#5C2D91',
            badge: 'Popular',
            initial: 'CBE',
            speed: 'Direct settlement',
            limit: 'Up to 100,000 ETB/day',
            ussd: '*847# CBE Birr Direct',
            desc: 'Direct cash out to 30+ million CBE accounts and CBE Birr digital wallets.'
        },
        {
            id: 'boa',
            type: 'bank',
            name: 'Bank of Abyssinia',
            tag: 'Apollo Direct Rails',
            color: '#E5A91E',
            badge: 'Direct',
            initial: 'BOA',
            speed: 'Instant transfer',
            limit: 'No platform cap',
            ussd: 'Apollo Open Banking API',
            desc: 'Direct electronic transfer via Bank of Abyssinia modern Apollo banking gateway.'
        },
        {
            id: 'awash',
            type: 'bank',
            name: 'Awash Bank',
            tag: 'Awash Birr Pro Verified',
            color: '#00539F',
            badge: 'Direct',
            initial: 'AWB',
            speed: 'Real-time clearing',
            limit: 'Standard Bank Limits',
            ussd: '*901# Awash Birr',
            desc: 'Reliable settlement into Awash Bank retail and merchant commercial accounts.'
        },
        {
            id: 'dashen',
            type: 'bank',
            name: 'Dashen Bank',
            tag: 'Amole Settlement Rail',
            color: '#F37021',
            badge: 'Direct',
            initial: 'DSH',
            speed: 'Instant push',
            limit: 'Up to 75,000 ETB/day',
            ussd: '*996# Amole Direct',
            desc: 'Seamless integration with Dashen Amole electronic payment ecosystem.'
        },
        {
            id: 'cbo',
            type: 'bank',
            name: 'Coop Bank Oromia',
            tag: 'CoopPay Verified Gateway',
            color: '#00AEEF',
            badge: 'Direct',
            initial: 'CBO',
            speed: 'Instant webhook',
            limit: 'Standard Bank Limits',
            ussd: '*841# CoopPay',
            desc: 'Fast digital payouts via Coop Bank of Oromia CoopPay financial rails.'
        }
    ];

    const filteredBanks = bankPartners.filter(b => {
        if (bankFilter === 'wallets') return b.type === 'wallet';
        if (bankFilter === 'banks') return b.type === 'bank';
        return true;
    });

    // ── 5. Revenue Estimator Calculator ──────────────────────────────────
    const [fanCount, setFanCount] = useState(150);
    const [avgTip, setAvgTip] = useState(100);
    const [isYearlyView, setIsYearlyView] = useState(false);

    const monthlyGross = fanCount * avgTip;
    const monthlyNet = Math.round(monthlyGross * 0.95);
    const annualNet = monthlyNet * 12;

    const setTier = (fans, tip) => {
        soundFx.playPop();
        setFanCount(fans);
        setAvgTip(tip);
    };

    const getLifestyleMilestone = (monthly) => {
        if (monthly < 8000) {
            return { icon: '☕', text: 'Covers Addis coffee, 4G/Fiber internet & creator tools' };
        } else if (monthly < 35000) {
            return { icon: '🎥', text: 'Upgrades studio mic, 4K camera, lighting & video editing PC' };
        } else if (monthly < 90000) {
            return { icon: '🏠', text: 'Pays apartment rent in Addis Ababa (Bole/CMC) + production crew' };
        } else {
            return { icon: '🚀', text: 'Full-time creative freedom & independent Ethiopian media studio!' };
        }
    };

    const milestone = getLifestyleMilestone(monthlyNet);

    // ── 6. OBS Stream Alert Simulator ─────────────────────────────────────
    const [obsAlertActive, setObsAlertActive] = useState(false);
    const [obsCustomTip, setObsCustomTip] = useState('250');
    const [obsCustomName, setObsCustomName] = useState('Abebe Kebede');
    const [obsCustomNote, setObsCustomNote] = useState('Insane clutch gameplay on stream! Keep grinding 🚀');
    const [obsSoundTheme, setObsSoundTheme] = useState('chime'); // 'chime' | 'arcade' | 'victory'
    const [obsVisualTheme, setObsVisualTheme] = useState('emerald'); // 'emerald' | 'gold' | 'neon' | 'glass'

    const triggerObsAlertDemo = () => {
        soundFx.playAlertTone(obsSoundTheme);
        setObsAlertActive(true);
        triggerConfetti({ count: 45 });
        setTimeout(() => setObsAlertActive(false), 5000);
    };

    const previewSoundTone = (theme) => {
        setObsSoundTheme(theme);
        soundFx.playAlertTone(theme);
    };

    // ── 7. FAQ Accordion with Search & Category Filter ────────────────────
    const [openFaq, setOpenFaq] = useState(0);
    const [faqSearch, setFaqSearch] = useState('');
    const [faqCategory, setFaqCategory] = useState('all');

    const faqs = [
        {
            cat: 'payouts',
            q: "How do Ethiopian creators withdraw their earnings?",
            a: "Directly to your verified Telebirr number or linked Ethiopian commercial bank account (CBE, Bank of Abyssinia, Awash, Dashen, Wegagen, Cooperative Bank of Oromia, Nib). Withdrawals are processed with 0% hidden exchange fees and deposited instantly."
        },
        {
            cat: 'obs',
            q: "How does the live OBS Stream Alert overlay work?",
            a: "You get a private Browser Source URL in your dashboard. Paste it into OBS Studio, Streamlabs, or TikTok Live Studio. When any supporter sends a tip via Telebirr, an animated banner pops up on your stream in real-time with sound effects and the supporter's custom shoutout message."
        },
        {
            cat: 'fees',
            q: "What are the platform and transaction fees?",
            a: "Creating an account, customizing your tipping link, and generating OBS overlays is 100% free with no monthly subscription. We deduct only a transparent 5% platform fee on tips received to cover Telebirr payment gateway charges, automated USSD routing, and server infrastructure."
        },
        {
            cat: 'security',
            q: "Is GurshaPay compliant with Ethiopian financial regulations?",
            a: "Yes. All payouts are executed in Ethiopian Birr (ETB) through licensed financial institutions and Telebirr wallets with national KYC identity verification standards."
        },
        {
            cat: 'payouts',
            q: "How fast do tips appear in my Telebirr wallet?",
            a: "Tips sent by supporters trigger automated Telebirr USSD webhooks. Funds are credited to your creator balance in real-time (< 3 seconds), and you can initiate instant cashout anytime."
        },
        {
            cat: 'obs',
            q: "Can I customize the OBS alert sound and colors?",
            a: "Yes! In your dashboard OBS settings, you can customize the popup colors, upload your own sound effect or choose from Ethiopian melodies, set minimum tip amounts to trigger alerts, and enable text-to-speech (TTS)."
        }
    ];

    const filteredFaqs = faqs.filter(item => {
        const matchesCat = faqCategory === 'all' || item.cat === faqCategory;
        const matchesSearch = item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const effectiveTipDisplay = simCustomMode && simCustomVal ? simCustomVal : simAmount;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', overflowX: 'hidden', position: 'relative' }}>
            {/* Ambient Background Glow Effect */}
            <div className="hero-glow-bg" />

            <Navbar />

            {/* Global Live Toast Notification Simulation */}
            {simAlertToast && (
                <div 
                    className="animate-pop-in"
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        border: '2px solid var(--primary)',
                        borderRadius: '16px',
                        padding: '1.15rem 1.35rem',
                        boxShadow: 'var(--shadow-xl)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.95rem',
                        maxWidth: '400px'
                    }}
                >
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)' }}>
                        <Bell size={20} color="#FFFFFF" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>🔔 Live Telebirr Alert Fired!</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            <strong>{activeCreator.name}</strong> received <strong>+{effectiveTipDisplay} ETB</strong> via instant push!
                        </div>
                    </div>
                </div>
            )}

            {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
            <section style={{ position: 'relative', padding: '3.5rem 1.25rem 5rem', maxWidth: 'var(--container-max)', margin: '0 auto', zIndex: 1 }}>
                
                {/* Live Supporter Ticker Pill */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
                    <div 
                        className="animate-fade-in"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.4rem 1rem',
                            borderRadius: '9999px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.825rem',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}></span>
                            LIVE TIP:
                        </span>
                        <span>
                            <strong>{tickerItems[currentTickerIdx].name}</strong> sent <strong style={{ color: 'var(--primary)' }}>{tickerItems[currentTickerIdx].amount}</strong> {tickerItems[currentTickerIdx].emoji} to {tickerItems[currentTickerIdx].creator}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({tickerItems[currentTickerIdx].time})</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
                    
                    {/* Left: Value Proposition */}
                    <div>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0.4rem 0.95rem', 
                            borderRadius: '9999px', 
                            background: 'var(--primary-light)', 
                            color: 'var(--primary)', 
                            fontWeight: 800, 
                            fontSize: '0.85rem', 
                            marginBottom: '1.35rem', 
                            border: '1px solid var(--border-glow)' 
                        }}>
                            <Sparkles size={15} />
                            Ethiopia's #1 Creator Monetization Platform
                        </div>

                        <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.35rem', color: 'var(--text-main)' }}>
                            Turn Support Into <br />
                            <span style={{ background: 'var(--primary-gradient-bright)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                                Real Income.
                            </span>
                        </h1>

                        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2.25rem', lineHeight: 1.6, maxWidth: '520px' }}>
                            The high-speed tipping and live streaming monetization platform for Ethiopian YouTubers, streamers, podcasters, and educators to accept instant tips via Telebirr and local commercial banks.
                        </p>

                        {/* Interactive Handle Claim Bar */}
                        <div style={{ 
                            background: 'var(--card-bg)', 
                            border: '1.5px solid ' + (claimStatus === 'available' ? 'var(--primary)' : 'var(--border-color)'), 
                            borderRadius: '14px', 
                            padding: '0.45rem 0.45rem 0.45rem 1.15rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            maxWidth: '480px', 
                            marginBottom: '0.85rem', 
                            boxShadow: claimStatus === 'available' ? 'var(--shadow-glow-primary)' : 'var(--shadow-md)',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>gurshapay.com/@</span>
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
                                className="btn-interactive"
                                onClick={() => {
                                    soundFx.playPop();
                                    navigate('/signup' + (claimUsername ? '?username=' + claimUsername : ''));
                                }}
                            >
                                Claim Link
                            </Button>
                        </div>

                        {claimStatus === 'available' ? (
                            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.75rem' }}>
                                <CheckCircle size={16} /> @{claimUsername} is available! Claim your custom link now.
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                                Free custom URL • Instant Telebirr push setup in 30 seconds
                            </div>
                        )}

                        {/* Trust Pillars */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                            <div style={{ cursor: 'default', transition: 'transform 0.18s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>0% Fee</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>To create account</div>
                            </div>
                            <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }}></div>
                            <div style={{ cursor: 'default', transition: 'transform 0.18s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)' }}>Instant</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Telebirr payout</div>
                            </div>
                            <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }}></div>
                            <div style={{ cursor: 'default', transition: 'transform 0.18s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--secondary)' }}>OBS 1080p</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Stream sound alerts</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: INTERACTIVE TIPPING WIDGET SIMULATOR */}
                    <div id="simulator" style={{ position: 'relative' }}>
                        {/* Creator Switcher Tabs */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '0.4rem', 
                            marginBottom: '0.85rem', 
                            background: 'var(--card-bg-subtle)', 
                            padding: '0.35rem', 
                            borderRadius: '14px', 
                            border: '1px solid var(--border-color)' 
                        }}>
                            {sampleCreators.map((c, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        soundFx.playPop();
                                        setSelectedCreatorIdx(i);
                                        setSimAmount(c.preset);
                                        setSimCustomMode(false);
                                        setSimMessage(c.note);
                                        setSimState('idle');
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.6rem 0.5rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: selectedCreatorIdx === i ? 'var(--card-bg)' : 'transparent',
                                        color: selectedCreatorIdx === i ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        boxShadow: selectedCreatorIdx === i ? 'var(--shadow-sm)' : 'none',
                                        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                    onMouseEnter={e => { if (selectedCreatorIdx !== i) e.currentTarget.style.color = 'var(--text-main)'; }}
                                    onMouseLeave={e => { if (selectedCreatorIdx !== i) e.currentTarget.style.color = 'var(--text-muted)'; }}
                                >
                                    <span style={{ marginRight: '0.3rem' }}>{c.avatar}</span>
                                    <span>{c.name.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Interactive Simulator Card */}
                        <div style={{ 
                            background: 'var(--card-bg)', 
                            borderRadius: '20px', 
                            border: '1.5px solid var(--border-color)', 
                            boxShadow: 'var(--shadow-xl)', 
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {/* Card Top Profile Header */}
                            <div style={{ padding: '1.35rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--card-bg-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', border: '2px solid var(--border-glow)', boxShadow: 'var(--shadow-sm)' }}>
                                        {activeCreator.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            {activeCreator.name}
                                            <CheckCircle2 size={16} color="var(--primary)" />
                                        </div>
                                        <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                                            @{activeCreator.handle} • {activeCreator.role}
                                        </div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--border-glow)' }}>
                                    {activeCreator.supporters.toLocaleString()} fans
                                </span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '1.75rem 1.5rem' }}>
                                {simState === 'idle' && (
                                    <form onSubmit={handleSendSimTip}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <label className="form-label" style={{ margin: 0, fontSize: '0.85rem' }}>Select Tip Amount</label>
                                            <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.05rem' }}>
                                                {effectiveTipDisplay} ETB <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>({Math.max(1, Math.round(Number(effectiveTipDisplay) / 50))} Gurshas ☕)</span>
                                            </span>
                                        </div>

                                        {/* Amount Chips */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.55rem', marginBottom: '0.85rem' }}>
                                            {[
                                                { val: '50', icon: '☕' },
                                                { val: '100', icon: '🍕' },
                                                { val: '250', icon: '🚀' },
                                                { val: '500', icon: '👑' }
                                            ].map((item) => {
                                                const isSelected = !simCustomMode && simAmount === item.val;
                                                return (
                                                    <button
                                                        key={item.val}
                                                        type="button"
                                                        onClick={() => {
                                                            soundFx.playPop();
                                                            setSimAmount(item.val);
                                                            setSimCustomMode(false);
                                                        }}
                                                        style={{
                                                            padding: '0.75rem 0',
                                                            borderRadius: '12px',
                                                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                            background: isSelected ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                            color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                                            fontWeight: 800,
                                                            fontSize: '0.9rem',
                                                            cursor: 'pointer',
                                                            boxShadow: isSelected ? '0 0 12px var(--primary-glow)' : 'none',
                                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                                            transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                                        }}
                                                        onMouseEnter={e => {
                                                            if (!isSelected) {
                                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                            }
                                                        }}
                                                        onMouseLeave={e => {
                                                            if (!isSelected) {
                                                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                            }
                                                        }}
                                                    >
                                                        {item.val} ETB {item.icon}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Quick Reaction Message Chips */}
                                        <div style={{ marginBottom: '1.35rem' }}>
                                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                                                {quickReactions.slice(0, 4).map((q, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            soundFx.playClick();
                                                            setSimMessage(q);
                                                        }}
                                                        style={{
                                                            fontSize: '0.775rem',
                                                            padding: '0.3rem 0.65rem',
                                                            borderRadius: '9999px',
                                                            border: simMessage === q ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                                            background: simMessage === q ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                            color: simMessage === q ? 'var(--primary)' : 'var(--text-secondary)',
                                                            fontWeight: 700,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                                        }}
                                                        onMouseLeave={e => {
                                                            if (simMessage !== q) e.currentTarget.style.borderColor = 'var(--border-color)';
                                                            e.currentTarget.style.transform = 'translateY(0)';
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
                                                placeholder="Add a custom note or shoutout..."
                                                style={{ fontSize: '0.9rem' }}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            icon={Smartphone}
                                            className="btn-full btn-interactive"
                                            style={{ height: '52px', fontSize: '1rem', fontWeight: 900 }}
                                        >
                                            Send {effectiveTipDisplay} ETB with Telebirr ⚡
                                        </Button>
                                    </form>
                                )}

                                {simState === 'ussd_prompt' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <div className="animate-radar" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 114, 206, 0.14)', color: '#0072CE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.15rem' }}>
                                            <Smartphone size={32} />
                                        </div>
                                        <div style={{ fontWeight: 900, fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                                            Telebirr USSD Push Prompt
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                                            Pushing *127# payment request of <strong>{effectiveTipDisplay} ETB</strong> to your device...
                                        </p>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'var(--card-bg-subtle)', padding: '0.5rem 1.1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800, color: '#0072CE', border: '1px solid var(--border-color)' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0072CE', animation: 'pulse 1s infinite' }}></span>
                                            <span>Connecting to Ethio Telecom Gateway...</span>
                                        </div>
                                    </div>
                                )}

                                {simState === 'pin_entering' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.15rem' }}>
                                            <ShieldCheck size={34} />
                                        </div>
                                        <div style={{ fontWeight: 900, fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                                            Telebirr PIN Verification
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.15rem' }}>
                                            Entering Telebirr 4-digit PIN on device:
                                        </p>
                                        <div style={{ fontSize: '2rem', letterSpacing: '0.4em', fontWeight: 900, color: 'var(--primary)', background: 'var(--card-bg-subtle)', padding: '0.5rem 1rem', borderRadius: '12px', display: 'inline-block' }}>
                                            {simPin}
                                        </div>
                                    </div>
                                )}

                                {simState === 'success' && (
                                    <div className="animate-pop-in" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)' }}>
                                            <CheckCircle size={36} />
                                        </div>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.35rem' }}>
                                            {effectiveTipDisplay} ETB Received! 🎉
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                                            "{simMessage}"
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.775rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                                                Telebirr Settled ✓
                                            </span>
                                            <span style={{ fontSize: '0.775rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'rgba(217, 119, 6, 0.14)', color: 'var(--secondary)', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
                                                OBS Alert Fired ⚡
                                            </span>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            className="btn-interactive"
                                            onClick={() => {
                                                soundFx.playClick();
                                                setSimState('idle');
                                            }}
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

            {/* ── 2. FINANCIAL SERVICES & BANK INTEGRATIONS ───────────────── */}
            <section id="payouts" style={{ padding: '5rem 1.25rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                            National Financial Rails
                        </p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Direct Settlement with Ethiopian Banks & Telebirr</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.4rem' }}>
                            Zero delay, automated push USSD, and instant withdrawal to your preferred account
                        </p>

                        {/* Category Filter Pills */}
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                            {[
                                { id: 'all', label: 'All Rail Partners (6)' },
                                { id: 'wallets', label: '📱 Mobile Wallets (Telebirr)' },
                                { id: 'banks', label: '🏦 Commercial Banks (CBE, BOA, Awash, Dashen, CBO)' }
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => {
                                        soundFx.playClick();
                                        setBankFilter(f.id);
                                    }}
                                    style={{
                                        padding: '0.45rem 1rem',
                                        borderRadius: '9999px',
                                        border: bankFilter === f.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                        background: bankFilter === f.id ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                        color: bankFilter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontWeight: 700,
                                        fontSize: '0.8125rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                        {filteredBanks.map((bank, i) => (
                            <div
                                key={bank.id}
                                onClick={() => {
                                    soundFx.playPop();
                                    setSelectedBankModal(bank);
                                }}
                                style={{
                                    padding: '1.35rem 1.25rem',
                                    borderRadius: '16px',
                                    background: 'var(--card-bg-subtle)',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.borderColor = bank.color;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bank.color, color: '#FFFFFF', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                        {bank.initial}
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '9999px', background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                                        {bank.badge}
                                    </span>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.975rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>{bank.name}</div>
                                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{bank.tag}</div>
                                <div style={{ marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 700 }}>
                                    <span>⚡ {bank.speed}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Details →</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bank Details Interactive Modal */}
                    {selectedBankModal && (
                        <div 
                            className="animate-fade-in" 
                            style={{ 
                                position: 'fixed', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                bottom: 0, 
                                background: 'rgba(0, 0, 0, 0.65)', 
                                backdropFilter: 'blur(8px)', 
                                zIndex: 99999, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                padding: '1rem' 
                            }}
                            onClick={() => setSelectedBankModal(null)}
                        >
                            <div 
                                className="animate-pop-in"
                                style={{ 
                                    background: 'var(--card-bg)', 
                                    borderRadius: '20px', 
                                    padding: '2rem', 
                                    maxWidth: '460px', 
                                    width: '100%', 
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-xl)' 
                                }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: selectedBankModal.color, color: '#FFFFFF', fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {selectedBankModal.initial}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>{selectedBankModal.name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedBankModal.tag}</p>
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                    {selectedBankModal.desc}
                                </p>

                                <div style={{ background: 'var(--card-bg-subtle)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Settlement Protocol:</span>
                                        <strong>{selectedBankModal.ussd}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Transfer Speed:</span>
                                        <strong style={{ color: 'var(--primary)' }}>{selectedBankModal.speed}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Transaction Limit:</span>
                                        <strong>{selectedBankModal.limit}</strong>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    size="md"
                                    className="btn-full btn-interactive"
                                    onClick={() => setSelectedBankModal(null)}
                                >
                                    Close Details
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── 3. EARNINGS ESTIMATOR CALCULATOR ───────────────────────── */}
            <section id="calculator" style={{ padding: '5.5rem 1.25rem', maxWidth: '980px', margin: '0 auto' }}>
                <div style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border-color)', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: 'var(--shadow-xl)', position: 'relative' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.08em' }}>Revenue Estimator</span>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.4rem' }}>How Much Could You Earn on GurshaPay?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.4rem' }}>Select a preset tier or slide to match your Ethiopian audience</p>
                    </div>

                    {/* Preset Tiers */}
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                        {[
                            { fans: 50, tip: 50, label: '🌱 Starter Creator (50 fans)' },
                            { fans: 250, tip: 100, label: '🚀 Growing YouTuber (250 fans)' },
                            { fans: 1000, tip: 200, label: '👑 Top Streamer (1,000 fans)' },
                            { fans: 3500, tip: 300, label: '🔥 Viral Ethiopian Star (3,500 fans)' }
                        ].map((tier, idx) => {
                            const isActive = fanCount === tier.fans && avgTip === tier.tip;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setTier(tier.fans, tier.tip)}
                                    style={{
                                        padding: '0.55rem 1.15rem',
                                        borderRadius: '9999px',
                                        border: isActive ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                                        background: isActive ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontWeight: 800,
                                        fontSize: '0.825rem',
                                        cursor: 'pointer',
                                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                >
                                    {tier.label}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                        {/* Sliders */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                    <span style={{ fontSize: '0.925rem', fontWeight: 800 }}>Monthly Supporters</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>{fanCount} fans</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="5000"
                                    step="10"
                                    value={fanCount}
                                    onChange={(e) => {
                                        setFanCount(Number(e.target.value));
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                    <span>10 fans</span>
                                    <span>2,500 fans</span>
                                    <span>5,000 fans</span>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                    <span style={{ fontSize: '0.925rem', fontWeight: 800 }}>Average Tip Amount</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>{avgTip} ETB <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>({Math.round(avgTip / 50)} Gurshas ☕)</span></span>
                                </div>
                                <input
                                    type="range"
                                    min="25"
                                    max="1000"
                                    step="25"
                                    value={avgTip}
                                    onChange={(e) => {
                                        setAvgTip(Number(e.target.value));
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                    <span>25 ETB</span>
                                    <span>500 ETB</span>
                                    <span>1,000 ETB</span>
                                </div>
                            </div>

                            {/* Dynamic Real-Life Milestone Card */}
                            <div style={{ background: 'var(--card-bg-subtle)', borderRadius: '14px', padding: '1rem 1.25rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <div style={{ fontSize: '1.75rem' }}>{milestone.icon}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700, lineHeight: 1.4 }}>
                                    {milestone.text}
                                </div>
                            </div>
                        </div>

                        {/* Result Gradient Container */}
                        <div style={{ 
                            background: 'linear-gradient(145deg, #059669 0%, #047857 60%, #065F46 100%)', 
                            padding: '2.5rem 2.25rem', 
                            borderRadius: '20px', 
                            color: '#FFFFFF', 
                            textAlign: 'center', 
                            boxShadow: 'var(--shadow-glow-primary)',
                            position: 'relative'
                        }}>
                            {/* Monthly vs Annual Toggle */}
                            <div style={{ display: 'inline-flex', background: 'rgba(0, 0, 0, 0.2)', padding: '0.25rem', borderRadius: '9999px', marginBottom: '1.25rem' }}>
                                <button
                                    type="button"
                                    onClick={() => { soundFx.playClick(); setIsYearlyView(false); }}
                                    style={{
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: !isYearlyView ? '#FFFFFF' : 'transparent',
                                        color: !isYearlyView ? '#059669' : '#FFFFFF',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { soundFx.playClick(); setIsYearlyView(true); }}
                                    style={{
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: isYearlyView ? '#FFFFFF' : 'transparent',
                                        color: isYearlyView ? '#059669' : '#FFFFFF',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Yearly (12x)
                                </button>
                            </div>

                            <div style={{ fontSize: '0.85rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                                Estimated Net Take-Home (95%)
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.25rem', color: '#FFFFFF' }}>
                                {(isYearlyView ? annualNet : monthlyNet).toLocaleString()} <span style={{ fontSize: '1.2rem', opacity: 0.85 }}>ETB</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.85, marginBottom: '1.75rem' }}>
                                Gross tips: {(isYearlyView ? monthlyGross * 12 : monthlyGross).toLocaleString()} ETB • 5% Telebirr gateway fee
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    soundFx.playPop();
                                    navigate('/signup');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#FFFFFF',
                                    color: 'var(--primary)',
                                    fontWeight: 900,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                    transition: 'all 0.18s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                            >
                                Start Earning This Month →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. OBS LIVE STREAM OVERLAY SHOWCASE ─────────────────────── */}
            <section id="obs-alerts" style={{ padding: '5.5rem 1.25rem', background: 'var(--card-bg-subtle)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.08em' }}>OBS & Streamlabs Integration</span>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.4rem 0 1rem' }}>
                                Real-Time On-Screen Alerts for Streamers
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                                Connect GurshaPay to OBS Studio, Streamlabs, or TikTok Live Studio in 10 seconds. When any supporter sends a tip, an animated banner pops up on screen with sound effects and custom shoutout text.
                            </p>

                            {/* Sound & Theme Customizer Pills */}
                            <div style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                                    TEST ALERT SOUND THEME:
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {[
                                        { id: 'chime', label: '💎 Crystal Chime' },
                                        { id: 'arcade', label: '🕹️ 8-Bit Arcade' },
                                        { id: 'victory', label: '🎺 Victory Fanfare' }
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => previewSoundTone(s.id)}
                                            style={{
                                                padding: '0.4rem 0.85rem',
                                                borderRadius: '8px',
                                                border: obsSoundTheme === s.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                                background: obsSoundTheme === s.id ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                color: obsSoundTheme === s.id ? 'var(--primary)' : 'var(--text-secondary)',
                                                fontWeight: 700,
                                                fontSize: '0.785rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                icon={Play}
                                className="btn-interactive"
                                onClick={triggerObsAlertDemo}
                            >
                                Test Live Alert Banner
                            </Button>
                        </div>

                        {/* Interactive OBS Preview Screen with Simulated Live Stream Feed */}
                        <div style={{ 
                            position: 'relative', 
                            background: '#070B12', 
                            borderRadius: '20px', 
                            padding: '1.5rem', 
                            minHeight: '340px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            border: '2px solid #1E293B', 
                            overflow: 'hidden', 
                            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)' 
                        }}>
                            {/* Live Header Status */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', zIndex: 2 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.2s infinite' }}></span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>LIVE 1080p 60FPS</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.725rem', color: '#E2E8F0' }}>
                                    <Eye size={12} />
                                    <span>2,480 viewers</span>
                                </div>
                            </div>

                            {/* Simulated Stream Gameplay Background Pattern */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                {obsAlertActive ? (
                                    <div 
                                        className="animate-pop-in" 
                                        style={{ 
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
                                            border: '2px solid #34D399', 
                                            borderRadius: '16px', 
                                            padding: '1.35rem 2rem', 
                                            color: '#FFFFFF', 
                                            textAlign: 'center', 
                                            maxWidth: '92%', 
                                            boxShadow: '0 12px 30px rgba(5, 150, 105, 0.5)',
                                            zIndex: 3 
                                        }}
                                    >
                                        <div style={{ fontSize: '1.35rem', fontWeight: 900 }}>
                                            🎉 {obsCustomName} tipped {obsCustomTip} ETB!
                                        </div>
                                        <p style={{ margin: '0.45rem 0 0', fontSize: '0.9rem', opacity: 0.95, fontStyle: 'italic' }}>
                                            "{obsCustomNote}"
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#64748B', zIndex: 1 }}>
                                        <Video size={48} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#E2E8F0' }}>OBS Browser Source Overlay</div>
                                        <div style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>Click "Test Live Alert Banner" to simulate a real-time tip popup</div>
                                    </div>
                                )}
                            </div>

                            {/* Simulated Stream Chat Feed */}
                            <div style={{ borderTop: '1px solid #1E293B', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                                <div><strong style={{ color: '#38BDF8' }}>@natnael_99:</strong> W stream bro! 🔥</div>
                                <div><strong style={{ color: '#A855F7' }}>@abeni_addis:</strong> Just sent a Gursha on Telebirr! ☕</div>
                                {obsAlertActive && (
                                    <div className="animate-fade-in" style={{ color: '#34D399', fontWeight: 800 }}>
                                        🤖 <strong>GurshaBot:</strong> @{obsCustomName} supported with {obsCustomTip} ETB!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. HOW GURSHAPAY WORKS ─────────────────────────────────── */}
            <section id="how-it-works" style={{ padding: '5.5rem 1.25rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.08em' }}>3-Step Simplicity</span>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.4rem' }}>How GurshaPay Works</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {[
                        {
                            step: '1',
                            title: '1. Claim Your @handle',
                            desc: 'Sign up in 30 seconds and secure your customized profile link (e.g. gurshapay.com/@yourname).',
                            badgeColor: 'var(--primary-light)',
                            textColor: 'var(--primary)'
                        },
                        {
                            step: '2',
                            title: '2. Share with Your Fans',
                            desc: 'Add your link to your YouTube descriptions, TikTok bio, Telegram channel, or embed the OBS overlay in your live streams.',
                            badgeColor: 'rgba(217, 119, 6, 0.14)',
                            textColor: 'var(--secondary)'
                        },
                        {
                            step: '3',
                            title: '3. Instant Cash Out',
                            desc: 'Get notified for every tip and withdraw funds directly to your Telebirr wallet or linked Ethiopian commercial bank account.',
                            badgeColor: 'var(--success-light)',
                            textColor: 'var(--success)'
                        }
                    ].map((item, idx) => (
                        <div 
                            key={idx}
                            style={{ 
                                padding: '2rem 1.75rem', 
                                borderRadius: '18px', 
                                background: 'var(--card-bg)', 
                                border: '1px solid var(--border-color)', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '1rem', 
                                boxShadow: 'var(--shadow-sm)', 
                                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)', 
                                cursor: 'pointer' 
                            }}
                            onMouseEnter={e => { 
                                e.currentTarget.style.transform = 'translateY(-5px)'; 
                                e.currentTarget.style.borderColor = item.textColor;
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={e => { 
                                e.currentTarget.style.transform = 'translateY(0)'; 
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: item.badgeColor, color: item.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                                {item.step}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 6. FAQ ACCORDION (With Category Filters & Search) ───────── */}
            <section id="faq" style={{ padding: '5rem 1.25rem', maxWidth: '840px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Got Questions?</span>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.4rem' }}>Frequently Asked Questions</h2>
                </div>

                {/* Category Pills & Search */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {[
                        { id: 'all', label: 'All Questions' },
                        { id: 'payouts', label: '💳 Payouts & Telebirr' },
                        { id: 'obs', label: '🎥 OBS Streaming' },
                        { id: 'fees', label: '⚡ Fees' },
                        { id: 'security', label: '🛡️ Security & KYC' }
                    ].map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                                soundFx.playClick();
                                setFaqCategory(c.id);
                            }}
                            style={{
                                padding: '0.45rem 0.95rem',
                                borderRadius: '9999px',
                                border: faqCategory === c.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                background: faqCategory === c.id ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                color: faqCategory === c.id ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {filteredFaqs.map((faq, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div
                                key={index}
                                style={{ 
                                    background: 'var(--card-bg)', 
                                    border: isOpen ? '1.5px solid var(--primary)' : '1px solid var(--border-color)', 
                                    borderRadius: '14px', 
                                    overflow: 'hidden', 
                                    cursor: 'pointer', 
                                    boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                                    transition: 'all 0.18s ease' 
                                }}
                                onClick={() => {
                                    soundFx.playClick();
                                    setOpenFaq(isOpen ? null : index);
                                }}
                                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                            >
                                <div style={{ padding: '1.25rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                        {faq.q}
                                    </h3>
                                    {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                                </div>
                                {isOpen && (
                                    <div className="animate-fade-in" style={{ padding: '0 1.4rem 1.35rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, borderTop: '1px solid var(--border-color)', paddingTop: '0.95rem' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── 7. HIGH CONVERSION FOOTER CTA ──────────────────────────── */}
            <section style={{ padding: '5.5rem 1.25rem', background: 'linear-gradient(145deg, #059669 0%, #047857 60%, #064E3B 100%)', color: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.825rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                        <Sparkles size={15} /> 100% Free Setup • 0% Subscription Fee
                    </div>
                    <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: '#FFFFFF', marginBottom: '1.15rem' }}>
                        Ready to Monetize Your Ethiopian Audience?
                    </h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.95, lineHeight: 1.65, marginBottom: '2.25rem' }}>
                        Join thousands of Ethiopian YouTubers, live streamers, educators, and creators earning direct tips via Telebirr and local banks today.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            soundFx.playPop();
                            navigate('/signup');
                        }}
                        style={{
                            padding: '1rem 2.25rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#FFFFFF',
                            color: 'var(--primary)',
                            fontWeight: 900,
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                            transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                    >
                        Claim Your Free Link Today →
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
