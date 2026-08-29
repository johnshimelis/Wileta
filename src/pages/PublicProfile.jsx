import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Smartphone, CheckCircle, AlertCircle, MessageSquare, ShieldCheck,
    Heart, Sparkles, Share2, Copy, Send, Coffee, Award, ExternalLink,
    Clock, RefreshCw, Check, ArrowRight, Lock, User, QrCode, Download,
    CreditCard, Building, X
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

// Verified Blue Tick SVG Emblem
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

    // Tipping amount state
    const [amount, setAmount] = useState('100');
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [tipperPhone, setTipperPhone] = useState('');
    const [tipperName, setTipperName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [shoutOutMessage, setShoutOutMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('telebirr'); // telebirr | chapa_checkout
    const [tippingState, setTippingState] = useState('idle'); // idle | processing | pin_prompt | success | error
    const [txRef, setTxRef] = useState('');
    const [alert, setAlert] = useState(null);
    const [copiedShare, setCopiedShare] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);

    const { t } = useLanguage();

    const quickMessages = [
        '☕ Gursha on me! Keep creating!',
        '🚀 Keep pushing quality in Ethiopia!',
        '🔥 Best content in the space!',
        '❤️ Proud supporter since day one!'
    ];

    const presetAmounts = [
        { count: 1, etb: '50', emoji: '☕', label: '50 ETB' },
        { count: 2, etb: '100', emoji: '🥐', label: '100 ETB' },
        { count: 5, etb: '250', emoji: '🚀', label: '250 ETB' },
        { count: 10, etb: '500', emoji: '👑', label: '500 ETB' },
        { count: 20, etb: '1000', emoji: '💎', label: '1,000 ETB' }
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

                // Set SEO Open Graph Metadata
                const creatorName = res.data.name || cleanUsername;
                document.title = `${creatorName} — Support on GurshaPay`;

                // Update meta tags dynamically
                const updateMeta = (name, content) => {
                    let element = document.querySelector(`meta[property="${name}"]`) || document.querySelector(`meta[name="${name}"]`);
                    if (!element) {
                        element = document.createElement('meta');
                        if (name.startsWith('og:')) {
                            element.setAttribute('property', name);
                        } else {
                            element.setAttribute('name', name);
                        }
                        document.head.appendChild(element);
                    }
                    element.setAttribute('content', content);
                };

                updateMeta('og:title', `${creatorName} — Support on GurshaPay`);
                updateMeta('og:description', `Support ${creatorName} directly through GurshaPay.`);
                updateMeta('og:url', `https://gurshapay.com/@${cleanUsername}`);
                updateMeta('description', `Support ${creatorName} directly through GurshaPay.`);

            } catch (err) {
                setError("We couldn't find this creator profile. Please check the handle and try again.");
            }
            setLoading(false);
        };
        fetchProfile();
    }, [username, api]);

    // Polling for Telebirr PIN completion
    useEffect(() => {
        let intervalId;
        if (tippingState === 'pin_prompt' && txRef) {
            intervalId = setInterval(async () => {
                try {
                    const res = await api.get('/payments/status/' + txRef);
                    if (res.data && res.data.success) {
                        if (res.data.status === 'SUCCESS' || res.data.status === 'success') {
                            setTippingState('success');
                            clearInterval(intervalId);
                        } else if (res.data.status === 'FAILED' || res.data.status === 'failed') {
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
        if (paymentMethod === 'telebirr' && !phoneRegex.test(tipperPhone)) {
            showAlert("Please enter a valid 10-digit Ethiopian mobile number (09XXXXXXXX or 07XXXXXXXX)", "error");
            return;
        }
        setTippingState('processing');

        const finalAmount = isCustom ? customAmount : amount;
        if (!finalAmount || Number(finalAmount) < 10) {
            showAlert("Minimum tip amount is 10 ETB.", "error");
            setTippingState('idle');
            return;
        }

        try {
            const finalMessage = (isAnonymous ? '[Anonymous Supporter] ' : (tipperName ? '[' + tipperName + '] ' : '')) + shoutOutMessage;
            const response = await api.post('/payments/initialize-tip', {
                creatorId: creator.id,
                creatorUsername: creator.username,
                tipperPhone: tipperPhone || '0900000000',
                supporterName: isAnonymous ? 'Anonymous' : (tipperName || 'Fan'),
                isAnonymous,
                amount: finalAmount,
                message: finalMessage,
                paymentMethod
            });

            if (response.data && response.data.success) {
                setTxRef(response.data.tx_ref);

                if (response.data.paymentMethod === 'chapa_checkout' && response.data.checkout_url) {
                    // Redirect to Chapa hosted checkout
                    window.location.href = response.data.checkout_url;
                    return;
                }

                setTippingState('pin_prompt');
                showAlert(response.data.message || "USSD PIN prompt sent! Please confirm on your mobile.", "success");
            } else {
                setTippingState('error');
                showAlert(response.data.error || "Failed to initialize payment", "error");
            }
        } catch (err) {
            setTippingState('error');
            showAlert(err.response?.data?.error || "Error connecting to payment provider.", "error");
        }
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopiedShare(true);
        showAlert("Tip page link copied to clipboard!", "success");
        setTimeout(() => setCopiedShare(false), 3000);
    };

    const handleNativeShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: `Support ${creator?.name || 'Creator'} on GurshaPay`,
            text: `Send a Gursha tip directly to ${creator?.name || 'this creator'} on GurshaPay!`,
            url
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (e) {}
        } else {
            handleCopyLink();
        }
    };

    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`Support ${creator?.name || 'this creator'} on GurshaPay! ☕🇪🇹`);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '480px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'var(--border-color)', margin: '0 auto 1.5rem', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    <div style={{ height: '24px', width: '60%', background: 'var(--border-color)', margin: '0 auto 1rem', borderRadius: '6px' }}></div>
                    <div style={{ height: '16px', width: '80%', background: 'var(--border-color)', margin: '0 auto', borderRadius: '6px' }}></div>
                </div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ maxWidth: '460px', width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                        <AlertCircle size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Creator Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                        {error || "The handle you entered doesn't exist or is no longer active."}
                    </p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" style={{ width: '100%' }}>Explore GurshaPay Creators</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 1rem', boxSizing: 'border-box' }}>
            {alert && <TopAlert message={alert.message} type={alert.type} />}

            {/* Top Navigation Controls */}
            <div style={{ width: '100%', maxWidth: '520px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <Logo size="small" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => setShowQrModal(true)}
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '0.45rem 0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                        }}
                    >
                        <QrCode size={15} /> QR Code
                    </button>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Creator Card */}
            <div style={{
                width: '100%',
                maxWidth: '520px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2rem 1.75rem',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
                boxSizing: 'border-box'
            }}>
                {/* Creator Header Profile */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 1rem' }}>
                        {creator.profilePicUrl ? (
                            <img
                                src={creator.profilePicUrl}
                                alt={creator.name}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, border: '3px solid var(--primary)' }}>
                                {creator.name ? creator.name.charAt(0).toUpperCase() : 'G'}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                            {creator.name}
                        </h1>
                        {creator.isVerified && <VerifiedBlueTick size={20} />}
                    </div>

                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                        @{creator.username}
                    </span>

                    {creator.bio && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginTop: '0.75rem', marginBottom: 0 }}>
                            {creator.bio}
                        </p>
                    )}

                    {/* Social Media Links */}
                    {creator.socialLinks && creator.socialLinks.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                            {creator.socialLinks.map((s, idx) => (
                                <a
                                    key={idx}
                                    href={s.username.startsWith('http') ? s.username : `https://${s.platform}.com/${s.username.replace('@', '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        background: 'var(--bg-color)',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border-color)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <span>{s.platform}</span>
                                    <ExternalLink size={11} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* SUCCESS STATE CELEBRATION */}
                {tippingState === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '2px solid #10B981' }}>
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                            Tip sent successfully ❤️
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
                            You sent <strong>{isCustom ? customAmount : amount} ETB</strong> to <strong>{creator.name}</strong>.
                        </p>
                        <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                                <span style={{ fontWeight: 700, color: '#10B981' }}>COMPLETED ✓</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Reference</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{txRef || 'GP-TIP'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Payment Rail</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{paymentMethod === 'telebirr' ? 'Telebirr USSD' : 'Chapa Gateway'}</span>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            style={{ width: '100%', marginBottom: '0.75rem' }}
                            onClick={() => {
                                setTippingState('idle');
                                setShoutOutMessage('');
                            }}
                        >
                            Send Another Gursha
                        </Button>
                    </div>
                ) : tippingState === 'pin_prompt' ? (
                    /* PIN PROMPT STATE */
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Smartphone size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                            Check your mobile phone! 📱
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            A Telebirr USSD PIN prompt has been sent to <strong>{tipperPhone}</strong>. Please enter your PIN on your phone to complete your tip of <strong>{isCustom ? customAmount : amount} ETB</strong>.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            <RefreshCw size={16} style={{ animation: 'spin 2s linear infinite' }} /> Waiting for PIN confirmation...
                        </div>
                        <Button
                            variant="outline"
                            style={{ width: '100%' }}
                            onClick={() => setTippingState('idle')}
                        >
                            Cancel / Modify Tip
                        </Button>
                    </div>
                ) : (
                    /* INTERACTIVE TIPPING FORM */
                    <form onSubmit={handleTip}>
                        {/* Preset Amount Grid */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Select Tip Amount
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.65rem' }}>
                                {presetAmounts.map((p, idx) => {
                                    const selected = !isCustom && amount === p.etb;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setAmount(p.etb);
                                                setIsCustom(false);
                                            }}
                                            style={{
                                                padding: '0.75rem 0.5rem',
                                                border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border-color)'}`,
                                                borderRadius: '10px',
                                                background: selected ? 'var(--primary-light)' : 'var(--bg-color)',
                                                color: selected ? 'var(--primary)' : 'var(--text-main)',
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.2rem',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.1rem' }}>{p.emoji}</span>
                                            <span>{p.label}</span>
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => setIsCustom(true)}
                                    style={{
                                        padding: '0.75rem 0.5rem',
                                        border: `1.5px solid ${isCustom ? 'var(--primary)' : 'var(--border-color)'}`,
                                        borderRadius: '10px',
                                        background: isCustom ? 'var(--primary-light)' : 'var(--bg-color)',
                                        color: isCustom ? 'var(--primary)' : 'var(--text-main)',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.2rem',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <span>✍️</span>
                                    <span>Custom</span>
                                </button>
                            </div>

                            {/* Custom Amount Field */}
                            {isCustom && (
                                <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>ETB</span>
                                    <input
                                        type="number"
                                        min="10"
                                        max="50000"
                                        placeholder="Enter custom ETB amount (min 10)"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 3.5rem',
                                            border: '1.5px solid var(--primary)',
                                            borderRadius: '8px',
                                            background: 'var(--bg-color)',
                                            color: 'var(--text-main)',
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            boxSizing: 'border-box'
                                        }}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* Supporter Name & Anonymous Checkbox */}
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Your Name (Optional)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
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
                                    placeholder="e.g. Dawit from Addis"
                                    value={tipperName}
                                    onChange={(e) => setTipperName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        background: 'var(--bg-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            )}
                        </div>

                        {/* Shoutout Message */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Shoutout Message (Optional)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Say something nice to support this creator..."
                                value={shoutOutMessage}
                                onChange={(e) => setShoutOutMessage(e.target.value)}
                                maxLength={200}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    background: 'var(--bg-color)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.9rem',
                                    resize: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {/* Quick Message Chips */}
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                                {quickMessages.map((msg, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setShoutOutMessage(msg)}
                                        style={{
                                            background: 'var(--bg-color)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '6px',
                                            padding: '0.25rem 0.5rem',
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {msg}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Payment Method
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div
                                    onClick={() => setPaymentMethod('telebirr')}
                                    style={{
                                        padding: '0.75rem',
                                        border: `1.5px solid ${paymentMethod === 'telebirr' ? 'var(--primary)' : 'var(--border-color)'}`,
                                        borderRadius: '10px',
                                        background: paymentMethod === 'telebirr' ? 'var(--primary-light)' : 'var(--bg-color)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Smartphone size={20} color="var(--primary)" />
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Telebirr</div>
                                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>USSD Push</div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('chapa_checkout')}
                                    style={{
                                        padding: '0.75rem',
                                        border: `1.5px solid ${paymentMethod === 'chapa_checkout' ? 'var(--primary)' : 'var(--border-color)'}`,
                                        borderRadius: '10px',
                                        background: paymentMethod === 'chapa_checkout' ? 'var(--primary-light)' : 'var(--bg-color)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <CreditCard size={20} color="var(--primary)" />
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>Bank / Cards</div>
                                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>CBE & Telebirr</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phone Number Field for Telebirr */}
                        {paymentMethod === 'telebirr' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Your Telebirr Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        🇪🇹 +251
                                    </span>
                                    <input
                                        type="tel"
                                        placeholder="09XXXXXXXX"
                                        value={tipperPhone}
                                        onChange={(e) => setTipperPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength={10}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 5.5rem',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            background: 'var(--bg-color)',
                                            color: 'var(--text-main)',
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            boxSizing: 'border-box'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Send Gursha Button CTA */}
                        <button
                            type="submit"
                            disabled={tippingState === 'processing'}
                            style={{
                                width: '100%',
                                height: '50px',
                                background: '#059669',
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
                                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {tippingState === 'processing' ? (
                                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>
                                    <Coffee size={20} />
                                    <span>Send {isCustom ? (customAmount || '0') : amount} ETB Gursha</span>
                                </>
                            )}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            <Lock size={12} />
                            <span>256-bit encrypted checkout &bull; Operated by Birana Labs</span>
                        </div>
                    </form>
                )}
            </div>

            {/* Social Share & QR Code Strip */}
            <div style={{ width: '100%', maxWidth: '520px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Share Page</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                        onClick={handleCopyLink}
                        title="Copy Link"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.6rem', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                        {copiedShare ? <Check size={14} color="#10B981" /> : <Copy size={14} />} Link
                    </button>

                    <a
                        href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Share on Telegram"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.6rem', color: '#0088CC', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                        Telegram
                    </a>

                    <a
                        href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Share on WhatsApp"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.6rem', color: '#25D366', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                        WhatsApp
                    </a>

                    <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Share on X"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.6rem', color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                        X
                    </a>

                    <button
                        onClick={handleNativeShare}
                        title="More Sharing Options"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.6rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <Share2 size={14} />
                    </button>
                </div>
            </div>

            {/* QR CODE MODAL */}
            {showQrModal && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                    onClick={() => setShowQrModal(false)}
                >
                    <div
                        style={{ maxWidth: '380px', width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>Creator Tip QR Code</h3>
                            <button onClick={() => setShowQrModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.25rem', border: '1px solid #E2E8F0' }}>
                            {/* QR Code SVG / API Image */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://gurshapay.com/@${creator.username}&color=059669`}
                                alt="Creator Tip QR Code"
                                style={{ width: '180px', height: '180px', display: 'block' }}
                            />
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
                            Scan to support <strong>@{creator.username}</strong> directly on GurshaPay
                        </p>

                        <a
                            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://gurshapay.com/@${creator.username}&color=059669`}
                            download={`${creator.username}-gurshapay-qr.png`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button variant="primary" icon={Download} style={{ width: '100%' }}>
                                Download High-Res QR
                            </Button>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
