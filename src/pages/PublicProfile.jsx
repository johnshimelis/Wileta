import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Smartphone, CheckCircle, AlertCircle, MessageSquare, ShieldCheck,
    Heart, Sparkles, Share2, Copy, Send, Coffee, Award, ExternalLink,
    Clock, RefreshCw, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import TopAlert from '../components/TopAlert';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
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
    const [activeTab, setActiveTab] = useState('tip'); // 'tip' | 'supporters'

    const { t } = useLanguage();

    const quickMessages = [
        '☕ Gursha on me! Love your content!',
        '🚀 Keep pushing quality in Ethiopia!',
        '🔥 Best creator in the space!',
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
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
                    <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Loading creator profile...</div>
                </div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '1.5rem' }}>
                <Card style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                        <AlertCircle size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Creator Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
                    <Link to="/">
                        <Button variant="primary" size="md" className="btn-full">
                            Go to GurshaPay Home
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const currentTipVal = isCustom ? (customAmount || '0') : amount;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            {/* Top Navigation */}
            <header style={{ padding: '0.85rem 1.5rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Logo size="compact" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Button variant="ghost" size="sm" icon={copiedShare ? Check : Share2} onClick={handleShareLink}>
                            {copiedShare ? 'Copied Link!' : 'Share'}
                        </Button>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Profile Hero & Tipping Container */}
            <main style={{ flex: 1, maxWidth: '580px', width: '100%', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
                {/* Creator Header Card */}
                <Card padding="none" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', marginBottom: '1.5rem' }}>
                    {/* Cover Banner */}
                    <div style={{ height: '90px', background: 'linear-gradient(135deg, #0A5C36 0%, #064E3B 100%)', position: 'relative' }}></div>

                    {/* Creator Identity */}
                    <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-36px', marginBottom: '0.85rem' }}>
                            <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'var(--primary)', color: 'white', border: '4px solid var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900, boxShadow: 'var(--shadow-md)', overflow: 'hidden', flexShrink: 0 }}>
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

                        <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.15rem' }}>
                            {creator.name}
                        </h1>
                        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            @{creator.username}
                        </div>
                        {creator.bio && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                                {creator.bio}
                            </p>
                        )}
                    </div>
                </Card>

                {/* State-Based Checkout Experience */}
                {tippingState === 'idle' && (
                    <Card style={{ borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
                        <form onSubmit={handleTip}>
                            {/* Gursha Units Preset Chips */}
                            <label className="form-label" style={{ marginBottom: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800 }}>Send Gursha (ETB)</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1rem' }}>
                                    {currentTipVal} ETB
                                </span>
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
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
                                                padding: '0.65rem 0.25rem',
                                                borderRadius: 'var(--radius-md)',
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
                                                gap: '0.2rem'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.1rem' }}>{p.emoji}</span>
                                            <span>{p.etb} ETB</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Amount Button / Input */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                {!isCustom ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustom(true);
                                            setCustomAmount('');
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px dashed var(--border-color)',
                                            background: 'transparent',
                                            color: 'var(--text-muted)',
                                            fontWeight: 700,
                                            fontSize: '0.825rem',
                                            cursor: 'pointer'
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
                                            placeholder="Enter amount (e.g. 300)"
                                            className="form-input"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            style={{ paddingLeft: '3.25rem' }}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Tipper Name & Anonymous Checkbox */}
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
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
                                        placeholder="E.g. Abebe K."
                                        value={tipperName}
                                        onChange={(e) => setTipperName(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Telebirr Phone Input */}
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Telebirr Mobile Number</label>
                                <div className="input-group">
                                    <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <span>🇪🇹</span> +251
                                    </span>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="09XXXXXXXX or 07XXXXXXXX"
                                        value={tipperPhone}
                                        onChange={(e) => setTipperPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength={10}
                                        style={{ paddingLeft: '5.25rem' }}
                                        required
                                    />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                                    A USSD payment prompt will be sent directly to this Telebirr number.
                                </span>
                            </div>

                            {/* Quick Reaction Message Chips */}
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ marginBottom: '0.35rem' }}>Shout-out Message (Optional)</label>
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
                                                background: shoutOutMessage === msg ? 'var(--primary-light)' : 'var(--bg-color)',
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
                                    rows={2}
                                    placeholder="Leave an encouraging message for the stream overlay..."
                                    value={shoutOutMessage}
                                    onChange={(e) => setShoutOutMessage(e.target.value)}
                                    maxLength={250}
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                icon={Smartphone}
                                className="btn-full"
                                style={{ padding: '0.9rem', fontSize: '1rem' }}
                            >
                                Send {currentTipVal} ETB with Telebirr
                            </Button>
                        </form>
                    </Card>
                )}

                {/* Processing State */}
                {tippingState === 'processing' && (
                    <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.25rem' }}></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>Connecting to Telebirr...</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Initializing secure payment request to {tipperPhone}</p>
                    </Card>
                )}

                {/* PIN Prompt State */}
                {tippingState === 'pin_prompt' && (
                    <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Smartphone size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.35rem' }}>Check Your Phone!</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            A Telebirr USSD payment prompt has been sent to <strong>{tipperPhone}</strong>.
                            <br />Please enter your PIN on your mobile device to complete the {currentTipVal} ETB tip.
                        </p>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg-subtle)', padding: '0.6rem 1.2rem', borderRadius: '9999px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }}></span>
                            Waiting for Telebirr Confirmation...
                        </div>

                        <div>
                            <Button variant="ghost" size="sm" onClick={() => setTippingState('idle')}>
                                Cancel / Change Details
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Success Receipt State */}
                {tippingState === 'success' && (
                    <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <CheckCircle size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.35rem' }}>Tip Successfully Sent! 🎉</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Your {currentTipVal} ETB tip was received by <strong>{creator.name}</strong>.
                        </p>

                        <div style={{ background: 'var(--card-bg-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-color)', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Amount</span>
                                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{currentTipVal} ETB</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Recipient</span>
                                <span style={{ fontWeight: 700 }}>@{creator.username}</span>
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
                    </Card>
                )}

                {/* Error State */}
                {tippingState === 'error' && (
                    <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>Payment Cancelled or Failed</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            The Telebirr payment could not be completed. Please ensure you have sufficient balance and try again.
                        </p>
                        <Button variant="primary" size="md" className="btn-full" onClick={() => setTippingState('idle')}>
                            Try Again
                        </Button>
                    </Card>
                )}

                {/* Platform Trust Footer */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={14} color="var(--primary)" />
                    <span>Powered by GurshaPay • Encrypted Ethiopian Telebirr Payouts</span>
                </div>
            </main>
        </div>
    );
}
