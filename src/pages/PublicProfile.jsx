import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Smartphone, CheckCircle, AlertCircle, MessageSquare, ShieldCheck,
    Heart, Sparkles, Share2, Copy, Send, Coffee, Award, ExternalLink,
    Clock, RefreshCw, Check, ArrowRight, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import TopAlert from '../components/TopAlert';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import './PublicProfile.css';

export default function PublicProfile() {
    const { api } = useAuth();
    const { username } = useParams();
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Tipping state
    const [amount, setAmount] = useState('50');
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [tipperPhone, setTipperPhone] = useState('');
    const [tipperName, setTipperName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [shoutOutMessage, setShoutOutMessage] = useState('');
    const [tippingState, setTippingState] = useState('idle'); // idle | processing | pin_prompt | success | error
    const [txRef, setTxRef] = useState('');
    const [alert, setAlert] = useState(null);
    const [copiedShare, setCopiedShare] = useState(false);

    const { t } = useLanguage();

    const quickMessages = [
        '☕ Gursha on me! Keep creating!',
        '🚀 Keep pushing quality in Ethiopia!',
        '🔥 Best content in the space!',
        '❤️ Proud supporter since day one!'
    ];

    const presetGurshas = [
        { count: 1, etb: '50', emoji: '☕', label: '1 Gursha' },
        { count: 3, etb: '150', emoji: '🍕', label: '3 Gurshas' },
        { count: 5, etb: '250', emoji: '🚀', label: '5 Gurshas' },
        { count: 10, etb: '500', emoji: '👑', label: '10 Gurshas' }
    ];

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const cleanUsername = username?.startsWith('@') ? username.slice(1) : username;
                const res = await api.get('/public/' + cleanUsername);
                setCreator(res.data);
            } catch (err) {
                setError("We couldn't find this creator profile. Please check the handle and try again.");
            }
            setLoading(false);
        };
        fetchProfile();
    }, [username, api]);

    useEffect(() => {
        let intervalId;
        if (tippingState === 'pin_prompt' && txRef) {
            intervalId = setInterval(async () => {
                try {
                    const res = await api.get('/payments/status/' + txRef);
                    if (res.data && res.data.success) {
                        if (res.data.status === 'success') {
                            setTippingState('success');
                            clearInterval(intervalId);
                        } else if (res.data.status === 'failed') {
                            setTippingState('error');
                            clearInterval(intervalId);
                        }
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 3000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [tippingState, txRef, api]);

    const handleTip = async (e) => {
        e.preventDefault();
        const phoneRegex = /^(09|07)d{8}$/;
        if (!phoneRegex.test(tipperPhone)) {
            showAlert("Please enter a valid 10-digit Ethiopian mobile number (09XXXXXXXX or 07XXXXXXXX)", "error");
            return;
        }
        setTippingState('processing');

        const finalAmount = isCustom ? customAmount : amount;
        if (!finalAmount || Number(finalAmount) <= 0) {
            showAlert("Please enter a valid tip amount", "error");
            setTippingState('idle');
            return;
        }

        try {
            const finalMessage = (isAnonymous ? '[Anonymous Supporter] ' : (tipperName ? '[' + tipperName + '] ' : '')) + shoutOutMessage;
            const response = await api.post('/payments/initialize-tip', {
                creatorId: creator.id,
                tipperPhone,
                amount: finalAmount,
                message: finalMessage
            });

            if (response.data && response.data.success) {
                setTxRef(response.data.txRef);
                setTippingState('pin_prompt');
            } else {
                showAlert(response.data?.message || "Failed to initialize Telebirr payment", "error");
                setTippingState('idle');
            }
        } catch (err) {
            showAlert(err.response?.data?.error || err.response?.data?.message || "Payment initialization failed", "error");
            setTippingState('idle');
        }
    };

    const handleShareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
                    <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading creator profile...</div>
                </div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '1.5rem' }}>
                <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '2.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                        <AlertCircle size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Creator Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
                    <Link to="/">
                        <Button variant="primary" size="md" className="btn-full">
                            Go to GurshaPay Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentTipVal = isCustom ? (customAmount || '0') : amount;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            {/* Top Navigation Bar */}
            <header style={{ padding: '0.75rem 1.25rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: '580px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Logo size="compact" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Button variant="ghost" size="sm" icon={copiedShare ? Check : Share2} onClick={handleShareLink}>
                            {copiedShare ? 'Copied!' : 'Share'}
                        </Button>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Single-Column Flow: Creator -> Amount -> Message -> Pay */}
            <main style={{ flex: 1, maxWidth: '540px', width: '100%', margin: '0 auto', padding: '1.75rem 1.25rem 3.5rem', boxSizing: 'border-box' }}>
                
                {/* 1. CREATOR PRESENTATION CARD */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                }}>
                    {/* Cover Banner with Ethiopian Emerald */}
                    <div style={{ height: '80px', background: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)', position: 'relative' }}></div>

                    {/* Creator Info */}
                    <div style={{ padding: '0 1.5rem 1.25rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-36px', marginBottom: '0.75rem' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', border: '3.5px solid var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(0,0,0,0.12)', overflow: 'hidden', flexShrink: 0 }}>
                                {creator.profilePicUrl ? (
                                    <img
                                        src={creator.profilePicUrl.startsWith('http') ? creator.profilePicUrl : ('https://wileta-backend.onrender.com' + creator.profilePicUrl)}
                                        alt={creator.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    creator.name?.charAt(0) || '?'
                                )}
                            </div>

                            <Badge variant={creator.kycStatus === 'approved' ? 'success' : 'primary'} size="sm" icon={ShieldCheck}>
                                {creator.kycStatus === 'approved' ? 'Verified Creator' : 'Creator'}
                            </Badge>
                        </div>

                        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.15rem', letterSpacing: '-0.025em' }}>
                            {creator.name}
                        </h1>
                        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            @{creator.username}
                        </div>
                        {creator.bio && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                                {creator.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. TIPPING CHECKOUT INTERACTION CONTAINER */}
                {tippingState === 'idle' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '1.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }}>
                        <form onSubmit={handleTip}>
                            {/* Step A: Amount Selection */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Select Gursha Amount
                                    </label>
                                    <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.15rem' }}>
                                        {currentTipVal} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ETB</span>
                                    </span>
                                </div>

                                {/* 4 Tactile Preset Chips */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.65rem' }}>
                                    {presetGurshas.map((p) => {
                                        const active = !isCustom && amount === p.etb;
                                        return (
                                            <button
                                                key={p.etb}
                                                type="button"
                                                onClick={() => {
                                                    setAmount(p.etb);
                                                    setIsCustom(false);
                                                }}
                                                style={{
                                                    padding: '0.75rem 0.25rem',
                                                    borderRadius: '10px',
                                                    border: active ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                    background: active ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                    color: active ? 'var(--primary)' : 'var(--text-main)',
                                                    fontWeight: 800,
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.2rem',
                                                    boxShadow: active ? '0 2px 6px rgba(5, 150, 105, 0.15)' : 'none'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.15rem' }}>{p.emoji}</span>
                                                <span style={{ fontWeight: 800 }}>{p.etb} ETB</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Amount Switcher */}
                                {!isCustom ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustom(true);
                                            setCustomAmount('');
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem',
                                            borderRadius: '8px',
                                            border: '1px dashed var(--border-color)',
                                            background: 'transparent',
                                            color: 'var(--text-muted)',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        + Enter Custom ETB Amount
                                    </button>
                                ) : (
                                    <div className="input-group">
                                        <span style={{ position: 'absolute', left: '1rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>ETB</span>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Enter custom amount (e.g. 350)"
                                            className="form-input"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            style={{ paddingLeft: '3.5rem' }}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Step B: Supporter Details */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Your Name (Optional)</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            style={{ accentColor: 'var(--primary)' }}
                                        />
                                        Tip Anonymously
                                    </label>
                                </div>
                                {!isAnonymous && (
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Abebe K."
                                        value={tipperName}
                                        onChange={(e) => setTipperName(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Step C: Telebirr Mobile Number */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Telebirr Mobile Number</label>
                                <div className="input-group">
                                    <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <span>🇪🇹</span> +251
                                    </span>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="09XXXXXXXX or 07XXXXXXXX"
                                        value={tipperPhone}
                                        onChange={(e) => setTipperPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength={10}
                                        style={{ paddingLeft: '5.5rem' }}
                                        required
                                    />
                                </div>
                                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                                    A direct Telebirr USSD payment prompt will be pushed to this device.
                                </span>
                            </div>

                            {/* Step D: Shout-out Message & Quick Chips */}
                            <div style={{ marginBottom: '1.75rem' }}>
                                <label className="form-label" style={{ marginBottom: '0.35rem' }}>Encouraging Message (Optional)</label>
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    {quickMessages.map((msg, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setShoutOutMessage(msg)}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.55rem',
                                                borderRadius: '9999px',
                                                border: '1px solid var(--border-color)',
                                                background: shoutOutMessage === msg ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                color: shoutOutMessage === msg ? 'var(--primary)' : 'var(--text-muted)',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {msg}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="form-input"
                                    rows={2}
                                    placeholder="Say something nice for the livestream alert..."
                                    value={shoutOutMessage}
                                    onChange={(e) => setShoutOutMessage(e.target.value)}
                                    maxLength={250}
                                />
                            </div>

                            {/* Step E: Primary Payment CTA */}
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    background: 'var(--primary)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Smartphone size={20} />
                                <span>Send {currentTipVal} ETB with Telebirr</span>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <Lock size={12} color="var(--primary)" />
                                <span>Secure instant Telebirr settlement • Zero fan processing fee</span>
                            </div>
                        </form>
                    </div>
                )}

                {/* 3. PROCESSING STATE */}
                {tippingState === 'processing' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '3rem 1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.25rem' }}></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Connecting to Telebirr...</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Pushing secure payment request to {tipperPhone}</p>
                    </div>
                )}

                {/* 4. PIN PROMPT / WAITING STATE */}
                {tippingState === 'pin_prompt' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '2.5rem 1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Smartphone size={30} />
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Check Your Phone!</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            A Telebirr USSD payment prompt has been pushed to <strong>{tipperPhone}</strong>.
                            <br />Enter your Telebirr PIN to confirm the <strong>{currentTipVal} ETB</strong> tip.
                        </p>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg-subtle)', padding: '0.6rem 1.25rem', borderRadius: '9999px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }}></span>
                            Waiting for Telebirr PIN Confirmation...
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setTippingState('idle')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel / Change Details
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. SUCCESS RECEIPT STATE */}
                {tippingState === 'success' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '2.5rem 1.75rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <CheckCircle size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Gursha Sent Successfully! 🎉</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Your {currentTipVal} ETB tip was received by <strong>{creator.name}</strong>.
                        </p>

                        <div style={{ background: 'var(--card-bg-subtle)', borderRadius: '12px', padding: '1.15rem', border: '1px solid var(--border-color)', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Amount</span>
                                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{currentTipVal} ETB</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Recipient</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>@{creator.username}</span>
                            </div>
                            {shoutOutMessage && (
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                    "{shoutOutMessage}"
                                </div>
                            )}
                        </div>

                        <Button variant="primary" size="md" className="btn-full" onClick={() => {
                            setTippingState('idle');
                            setShoutOutMessage('');
                        }}>
                            Send Another Tip
                        </Button>
                    </div>
                )}

                {/* 6. ERROR / FAILED STATE */}
                {tippingState === 'error' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '2.5rem 1.75rem',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <AlertCircle size={30} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Payment Could Not Be Completed</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            The Telebirr payment prompt timed out or was cancelled. Please check your Telebirr wallet balance and try again.
                        </p>
                        <Button variant="primary" size="md" className="btn-full" onClick={() => setTippingState('idle')}>
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Platform Trust Footer */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={14} color="var(--primary)" />
                    <span>Secured by GurshaPay Financial Compliance • 🇪🇹 Ethiopia</span>
                </div>
            </main>
        </div>
    );
}
