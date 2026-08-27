import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Smartphone, CheckCircle, AlertCircle, MessageSquare, ShieldCheck,
    Heart, Sparkles, Share2, Copy, Send, Coffee, Award, ExternalLink,
    Clock, RefreshCw, Check, ArrowRight, Lock, User
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

// Verified Blue Tick Emblem
const VerifiedBlueTick = ({ size = 22, title = "Verified Creator" }) => (
    <span 
        title={title}
        style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            verticalAlign: 'middle',
            cursor: 'pointer'
        }}
    >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M10.5 2.5C11.3 1.8 12.7 1.8 13.5 2.5L14.7 3.6C15.2 4.1 15.9 4.3 16.6 4.3L18.2 4.2C19.3 4.1 20.3 5.0 20.2 6.1L20.1 7.7C20.1 8.4 20.4 9.1 20.8 9.6L22.0 10.8C22.7 11.6 22.7 12.9 22.0 13.7L20.8 14.9C20.4 15.4 20.1 16.1 20.1 16.8L20.2 18.4C20.3 19.5 19.3 20.4 18.2 20.3L16.6 20.2C15.9 20.2 15.2 20.4 14.7 20.9L13.5 22.0C12.7 22.7 11.3 22.7 10.5 22.0L9.3 20.9C8.8 20.4 8.1 20.2 7.4 20.2L5.8 20.3C4.7 20.4 3.7 19.5 3.8 18.4L3.9 16.8C3.9 16.1 3.6 15.4 3.2 14.9L2.0 13.7C1.3 12.9 1.3 11.6 2.0 10.8L3.2 9.6C3.6 9.1 3.9 8.4 3.9 7.7L3.8 6.1C3.7 5.0 4.7 4.1 5.8 4.2L7.4 4.3C8.1 4.3 8.8 4.1 9.3 3.6L10.5 2.5Z" 
                fill="#1D9BF0" 
            />
            <path 
                d="M8.5 12.5L10.8 14.8L15.8 9.5" 
                stroke="#FFFFFF" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    </span>
);

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
        const phoneRegex = /^(09|07)\d{8}$/;
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
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.25rem' }}></div>
                    <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.925rem' }}>Loading creator profile...</div>
                </div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '1.5rem' }}>
                <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '2.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
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
    const isVerified = creator.kycStatus === 'approved' || creator.isVerified;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            {/* Top Navigation Bar */}
            <header style={{ padding: '0.85rem 1.25rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
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
            <main style={{ flex: 1, maxWidth: '540px', width: '100%', margin: '0 auto', padding: '2rem 1.25rem 4rem', boxSizing: 'border-box' }}>
                
                {/* 1. CREATOR PRESENTATION CARD */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {/* Cover Banner with Ethiopian Emerald */}
                    <div style={{ height: '90px', background: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)', position: 'relative' }}></div>

                    {/* Creator Info */}
                    <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-40px', marginBottom: '0.85rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', border: '4px solid var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, boxShadow: 'var(--shadow-md)', overflow: 'hidden', flexShrink: 0 }}>
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

                            {isVerified && <VerifiedBlueTick size={24} title="Verified GurshaPay Creator" />}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.025em' }}>
                                {creator.name}
                            </h1>
                            {isVerified && <VerifiedBlueTick size={20} title="Verified GurshaPay Creator" />}
                        </div>

                        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.65rem' }}>
                            @{creator.username}
                        </div>
                        {creator.bio && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>
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
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <form onSubmit={handleTip}>
                            {/* Step A: Amount Selection */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Select Gursha Amount
                                    </label>
                                    <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.15rem' }}>
                                        {currentTipVal} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ETB</span>
                                    </span>
                                </div>

                                {/* 4 Tactile Preset Chips */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
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
                                                    padding: '0.85rem 0.25rem',
                                                    borderRadius: '8px',
                                                    border: active ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                    background: active ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                    color: active ? 'var(--primary)' : 'var(--text-main)',
                                                    fontWeight: 800,
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    boxShadow: active ? '0 2px 6px rgba(5, 150, 105, 0.15)' : 'none'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.25rem' }}>{p.emoji}</span>
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
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--primary)',
                                            fontWeight: 700,
                                            fontSize: '0.825rem',
                                            cursor: 'pointer',
                                            padding: '0.25rem 0'
                                        }}
                                    >
                                        + Enter Custom Amount
                                    </button>
                                ) : (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <div className="input-group">
                                            <span style={{ position: 'absolute', left: '1rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                ETB
                                            </span>
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Custom amount (e.g. 300)"
                                                className="form-input"
                                                value={customAmount}
                                                onChange={(e) => setCustomAmount(e.target.value)}
                                                style={{ paddingLeft: '3.5rem' }}
                                                autoFocus
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsCustom(false)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                marginTop: '0.25rem'
                                            }}
                                        >
                                            ← Back to presets
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Step B: Supporter Name & Anonymous Option */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Your Name (Optional)</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
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
                                        placeholder="e.g. Natnael T."
                                        value={tipperName}
                                        onChange={(e) => setTipperName(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Step C: Telebirr Phone Number */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">
                                    Your Telebirr Mobile Number <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <div className="input-group">
                                    <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <span>🇪🇹</span> +251
                                    </span>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="0911000000"
                                        value={tipperPhone}
                                        onChange={(e) => setTipperPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength={10}
                                        style={{ paddingLeft: '5.5rem' }}
                                        required
                                    />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                                    A USSD payment prompt will pop up on this phone to enter your Telebirr PIN.
                                </span>
                            </div>

                            {/* Step D: Shout-Out Message */}
                            <div style={{ marginBottom: '1.75rem' }}>
                                <label className="form-label">Shout-Out Note (Optional)</label>
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    {quickMessages.map((msg, idx) => (
                                        <button
                                            key={idx}
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
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {msg}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="form-input"
                                    rows="2"
                                    placeholder="Leave an encouraging note for their stream or channel..."
                                    value={shoutOutMessage}
                                    onChange={(e) => setShoutOutMessage(e.target.value)}
                                    maxLength={200}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Step E: Primary CTA Button */}
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
                                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Smartphone size={18} />
                                Send {currentTipVal} ETB with Telebirr ⚡
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                <Lock size={12} /> Encrypted financial transaction • Direct to creator
                            </div>
                        </form>
                    </div>
                )}

                {/* 3. PAYMENT PROCESSING / USSD PROMPT STATE */}
                {tippingState === 'processing' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }}></div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                            Connecting to Telebirr Gateway...
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Securing your transaction session with Ethio Telecom rails.
                        </p>
                    </div>
                )}

                {tippingState === 'pin_prompt' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '2.5rem 2rem',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 114, 206, 0.12)', color: '#0072CE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Smartphone size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                            Check Your Phone 📱
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            A Telebirr USSD prompt has been sent to <strong>+251 {tipperPhone}</strong>. Enter your Telebirr PIN on your phone to complete the payment of <strong>{currentTipVal} ETB</strong>.
                        </p>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'var(--card-bg-subtle)', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.75rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }}></span>
                            Waiting for Telebirr PIN confirmation...
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setTippingState('idle')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Cancel / Change details
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. SUCCESS RECEIPT STATE */}
                {tippingState === 'success' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '2.5rem 2rem',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <CheckCircle size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                            Tip Sent Successfully! 🎉
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Your support has been transferred directly to <strong>{creator.name}</strong>.
                        </p>

                        {/* Itemized Receipt */}
                        <div style={{ background: 'var(--card-bg-subtle)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1.75rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Amount Sent</span>
                                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>{currentTipVal} ETB</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Recipient</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{creator.name} (@{creator.username})</span>
                            </div>
                            {shoutOutMessage && (
                                <div style={{ paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Your Note:</div>
                                    <div style={{ fontStyle: 'italic', color: 'var(--text-main)' }}>"{shoutOutMessage}"</div>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="primary"
                            size="md"
                            className="btn-full"
                            onClick={() => {
                                setTippingState('idle');
                                setShoutOutMessage('');
                                setTipperPhone('');
                            }}
                        >
                            Send Another Tip
                        </Button>
                    </div>
                )}

                {/* 5. ERROR / RETRY STATE */}
                {tippingState === 'error' && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '2.5rem 2rem',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <AlertCircle size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                            Payment Not Completed
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                            The Telebirr session timed out or was cancelled on the device. No funds were deducted.
                        </p>

                        <Button
                            variant="primary"
                            size="md"
                            className="btn-full"
                            onClick={() => setTippingState('idle')}
                        >
                            Try Again
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
