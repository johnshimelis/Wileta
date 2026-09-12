import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Smartphone, CheckCircle, AlertCircle, MessageSquare, ShieldCheck,
    Heart, Sparkles, Share2, Copy, Send, Coffee, Award, ExternalLink,
    Clock, RefreshCw, Check, ArrowRight, Lock, User, QrCode, Download,
    CreditCard, Building, X, Volume2, VolumeX, Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import TopAlert from '../components/TopAlert';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
    Gift3DIcon,
    playAudioEffect,
    TikTokLiveGiftShowcase,
    ETHIOPIAN_GIFTS_CATALOG,
    GIFT_CATEGORIES
} from '../components/Ethiopian3DGifts';
import './PublicProfile.css';

// Verified Blue Tick SVG Emblem
const VerifiedBlueTick = ({ size = 20, title = "Verified Creator" }) => (
    <span 
        title={title}
        style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            verticalAlign: 'middle',
            cursor: 'pointer',
            flexShrink: 0
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

    // Mode: 'gifts' | 'quick'
    const [tippingMode, setTippingMode] = useState('gifts');

    // Virtual Gift & Coin Tipping State (27 Cultural Gifts Catalog)
    const [selectedGift, setSelectedGift] = useState(ETHIOPIAN_GIFTS_CATALOG[0]); // Default Adey Flower (10 ETB)
    const [giftCategory, setGiftCategory] = useState('all');
    const [multiplier, setMultiplier] = useState(1);

    // Direct / Quick Tip State
    const [quickTipAmount, setQuickTipAmount] = useState('100');
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    // Supporter inputs
    const [tipperPhone, setTipperPhone] = useState('');
    const [tipperName, setTipperName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [shoutOutMessage, setShoutOutMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('telebirr'); // telebirr | chapa_checkout
    const [tippingState, setTippingState] = useState('idle'); // idle | processing | pin_prompt | success | error
    const [txRef, setTxRef] = useState('');
    const [alert, setAlert] = useState(null);
    const [copiedShare, setCopiedShare] = useState(false);
    const [copiedRef, setCopiedRef] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Live Celebration State
    const [showCelebrationModal, setShowCelebrationModal] = useState(false);
    const [celebrationGift, setCelebrationGift] = useState(null);
    const [comboCount, setComboCount] = useState(1);

    const { t } = useLanguage();

    const quickMessages = [
        '☕ Gursha on me! Keep creating!',
        '🌼 Adey Abeba for your hard work!',
        '🦁 Proud Ethiopian supporter!',
        '👑 Keep inspiring our community!'
    ];

    const quickTipPresets = ['50', '100', '250', '500', '1000', '2500'];

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    // Calculate current total amount in ETB
    const getCurrentTotalAmount = () => {
        if (tippingMode === 'quick') {
            if (isCustom) return customAmount || '0';
            return quickTipAmount;
        }
        // In gifts mode
        const baseEtb = Number(selectedGift?.etb || 10);
        return String(baseEtb * multiplier);
    };

    // Calculate total coins
    const getCurrentTotalCoins = () => {
        if (tippingMode === 'quick') {
            const etbVal = isCustom ? Number(customAmount || 0) : Number(quickTipAmount || 0);
            return etbVal * 10;
        }
        const baseCoins = Number(selectedGift?.coins || 100);
        return baseCoins * multiplier;
    };

    const handleSelectGift = (gift) => {
        setSelectedGift(gift);
        if (soundEnabled) {
            playAudioEffect('chime');
        }
    };

    const handleMultiplierChange = (m) => {
        setMultiplier(m);
        if (soundEnabled) {
            playAudioEffect('chime');
        }
    };

    const handleCopyRef = () => {
        if (!txRef) return;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(txRef);
            setCopiedRef(true);
            setTimeout(() => setCopiedRef(false), 2000);
        }
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
                            setCelebrationGift(selectedGift);
                            setComboCount(1);
                            setShowCelebrationModal(true);
                            if (soundEnabled) {
                                playAudioEffect('sacred_chime');
                            }
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
    }, [tippingState, txRef, api, selectedGift, soundEnabled]);

    const handleTip = async (e) => {
        e.preventDefault();
        let cleanPhone = (tipperPhone || '').replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
        if (cleanPhone.startsWith('251') && cleanPhone.length === 12) cleanPhone = cleanPhone.substring(3);

        const phoneRegex = /^[97]\d{8}$/;
        if (paymentMethod === 'telebirr' && !phoneRegex.test(cleanPhone)) {
            showAlert("Please enter a valid 9-digit Ethiopian mobile number starting with 9 (e.g. 967432143)", "error");
            return;
        }

        const finalAmount = getCurrentTotalAmount();
        if (!finalAmount || Number(finalAmount) < 10) {
            showAlert("Minimum tip amount is 10 ETB.", "error");
            return;
        }

        setTippingState('processing');

        try {
            const finalMessage = (isAnonymous ? '[Anonymous Supporter] ' : (tipperName ? '[' + tipperName + '] ' : '')) + shoutOutMessage;
            const response = await api.post('/payments/initialize-tip', {
                creatorId: creator.id,
                creatorUsername: creator.username,
                tipperPhone: cleanPhone || '900000000',
                supporterName: isAnonymous ? 'Anonymous' : (tipperName || 'Supporter'),
                isAnonymous,
                amount: finalAmount,
                message: finalMessage,
                paymentMethod
            });

            if (response.data && response.data.success) {
                setTxRef(response.data.tx_ref);

                if (response.data.paymentMethod === 'chapa_checkout' && response.data.checkout_url) {
                    window.location.href = response.data.checkout_url;
                    return;
                }

                setTippingState('pin_prompt');
                showAlert(response.data.message || "USSD prompt sent! Please enter your PIN on your mobile.", "success");
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
            text: `Send a Gursha tip directly to ${creator?.name || 'this creator'} on GurshaPay! ☕🇪🇹`,
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
            <div className="profile-loading-screen">
                <div className="profile-skeleton-card">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div className="profile-error-screen">
                <div className="profile-error-card">
                    <div className="profile-error-icon">
                        <AlertCircle size={32} />
                    </div>
                    <h2>Creator Not Found</h2>
                    <p>{error || "The creator handle you entered doesn't exist or is no longer active."}</p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" style={{ width: '100%' }}>Explore Creators</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentTotalETB = getCurrentTotalAmount();
    const currentTotalCoins = getCurrentTotalCoins();

    return (
        <div className="public-profile-root">
            {alert && <TopAlert message={alert.message} type={alert.type} />}

            {/* Top Navigation Bar */}
            <header className="public-profile-header">
                <div className="header-inner">
                    <Logo size="small" />
                    <div className="header-actions">
                        <button
                            type="button"
                            className="header-tool-btn"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
                        >
                            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </button>
                        <button
                            type="button"
                            className="header-tool-btn"
                            onClick={() => setShowQrModal(true)}
                            title="Show Tip QR Code"
                        >
                            <QrCode size={16} />
                            <span className="btn-label-desktop">QR Code</span>
                        </button>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Responsive Layout */}
            <main className="public-profile-container">
                <div className="public-profile-grid">

                    {/* ========================================================= */}
                    {/* LEFT COLUMN: CREATOR PROFILE SHOWCASE                      */}
                    {/* ========================================================= */}
                    <aside className="creator-profile-pane">
                        <div className="creator-card">
                            {/* Cover Banner */}
                            <div className="creator-cover-banner">
                                <div className="banner-pattern-overlay" />
                            </div>

                            {/* Creator Avatar & Basic Info */}
                            <div className="creator-card-body">
                                <div className="creator-avatar-wrap">
                                    {creator.profilePicUrl ? (
                                        <img
                                            src={creator.profilePicUrl}
                                            alt={creator.name}
                                            className="creator-avatar-img"
                                        />
                                    ) : (
                                        <div className="creator-avatar-fallback">
                                            {creator.name ? creator.name.charAt(0).toUpperCase() : 'G'}
                                        </div>
                                    )}
                                    <span className="creator-status-dot" title="Active on GurshaPay" />
                                </div>

                                <div className="creator-headline">
                                    <h1 className="creator-name">
                                        {creator.name}
                                        {creator.isVerified && <VerifiedBlueTick size={20} />}
                                    </h1>
                                    <span className="creator-handle">@{creator.username}</span>
                                </div>

                                {/* Verified Trust Pill */}
                                {creator.isVerified && (
                                    <div className="verified-trust-pill">
                                        <ShieldCheck size={14} />
                                        <span>Verified Ethiopian Creator</span>
                                    </div>
                                )}

                                {/* Creator Bio */}
                                {creator.bio && (
                                    <p className="creator-bio">
                                        {creator.bio}
                                    </p>
                                )}

                                {/* Social Links */}
                                {creator.socialLinks && creator.socialLinks.length > 0 && (
                                    <div className="creator-social-row">
                                        {creator.socialLinks.map((s, idx) => (
                                            <a
                                                key={idx}
                                                href={s.username.startsWith('http') ? s.username : `https://${s.platform}.com/${s.username.replace('@', '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="creator-social-pill"
                                                title={`Visit ${creator.name} on ${s.platform}`}
                                            >
                                                <span>{s.platform}</span>
                                                <ExternalLink size={11} />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Active Creator Funding Goal */}
                                {creator.goal && (
                                    <div className="creator-goal-card">
                                        <div className="goal-header">
                                            <span className="goal-title">
                                                <span>🎯</span> {creator.goal.title}
                                            </span>
                                            <span className="goal-percentage">
                                                {creator.goal.progressPercentage}%
                                            </span>
                                        </div>

                                        {creator.goal.description && (
                                            <p className="goal-desc">{creator.goal.description}</p>
                                        )}

                                        <div className="goal-progress-track">
                                            <div
                                                className="goal-progress-bar"
                                                style={{ width: `${Math.min(100, creator.goal.progressPercentage)}%` }}
                                            />
                                        </div>

                                        <div className="goal-meta">
                                            <span><strong>{(creator.goal.raisedAmount || 0).toLocaleString()} ETB</strong> raised</span>
                                            <span>Target: <strong>{creator.goal.targetAmount.toLocaleString()} ETB</strong></span>
                                        </div>
                                    </div>
                                )}

                                {/* Creator Share Strip */}
                                <div className="creator-share-strip">
                                    <span className="share-strip-title">Share Profile</span>
                                    <div className="share-strip-buttons">
                                        <button
                                            type="button"
                                            onClick={handleCopyLink}
                                            className="share-btn-item"
                                            title="Copy link to profile"
                                        >
                                            {copiedShare ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                                            <span>{copiedShare ? 'Copied' : 'Copy'}</span>
                                        </button>
                                        <a
                                            href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="share-btn-item telegram"
                                            title="Share on Telegram"
                                        >
                                            <span>Telegram</span>
                                        </a>
                                        <a
                                            href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="share-btn-item whatsapp"
                                            title="Share on WhatsApp"
                                        >
                                            <span>WhatsApp</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={handleNativeShare}
                                            className="share-btn-item more"
                                            title="More sharing options"
                                        >
                                            <Share2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="creator-trust-footnote">
                                    <Lock size={12} />
                                    <span>Direct Telebirr & CBE rails • Secured by Birana Labs</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ========================================================= */}
                    {/* RIGHT COLUMN: TIPPING & CHECKOUT INTERACTIVE EXPERIENCE   */}
                    {/* ========================================================= */}
                    <section className="tipping-checkout-pane">
                        <div className="tipping-card">

                            {/* SUCCESS STATE RECEIPT */}
                            {tippingState === 'success' ? (
                                <div className="tip-success-view">
                                    <div className="success-emblem-wrap">
                                        <div className="success-emblem-circle">
                                            <Check size={32} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <h2 className="success-view-title">Gursha Sent! ❤️</h2>
                                    <p className="success-view-subtitle">
                                        You successfully supported <strong>{creator.name}</strong>
                                    </p>

                                    {/* Tip Item Summary Card */}
                                    <div className="success-item-summary">
                                        <div className="summary-gift-left">
                                            <div className="summary-gift-icon">
                                                {tippingMode === 'gifts' && selectedGift ? (
                                                    <Gift3DIcon id={selectedGift.id} size={44} animated={false} />
                                                ) : (
                                                    <span className="summary-coin-icon">🪙</span>
                                                )}
                                            </div>
                                            <div className="summary-gift-info">
                                                <div className="summary-gift-name">
                                                    {tippingMode === 'gifts' && selectedGift
                                                        ? `${selectedGift.nameAm} (${selectedGift.nameEn})`
                                                        : 'Direct Gursha Tip'}
                                                </div>
                                                <div className="summary-supporter-name">
                                                    From {isAnonymous ? 'Anonymous Supporter' : (tipperName || 'Supporter')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="summary-amount-right">
                                            <div className="summary-etb-text">{currentTotalETB} ETB</div>
                                            <div className="summary-coins-text">🪙 {currentTotalCoins.toLocaleString()} Coins</div>
                                        </div>
                                    </div>

                                    {/* Digital Receipt */}
                                    <div className="success-digital-receipt">
                                        <div className="receipt-item-row">
                                            <span className="r-label">Status</span>
                                            <span className="r-badge-success">
                                                <Check size={11} strokeWidth={3} /> COMPLETED
                                            </span>
                                        </div>
                                        <div className="receipt-item-row">
                                            <span className="r-label">Reference</span>
                                            <button
                                                type="button"
                                                className="r-ref-pill"
                                                onClick={handleCopyRef}
                                                title="Click to copy transaction reference"
                                            >
                                                <code>{txRef || 'GP-TIP'}</code>
                                                {copiedRef ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                        <div className="receipt-item-row">
                                            <span className="r-label">Payment Method</span>
                                            <span className="r-method-text">
                                                <span className={`method-dot ${paymentMethod === 'telebirr' ? 'telebirr' : 'chapa'}`} />
                                                {paymentMethod === 'telebirr' ? 'Telebirr USSD' : 'Chapa Gateway'}
                                            </span>
                                        </div>
                                        <div className="receipt-item-row">
                                            <span className="r-label">Date & Time</span>
                                            <span className="r-date-text">
                                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="repeat-tip-btn"
                                        onClick={() => {
                                            setTippingState('idle');
                                            setShoutOutMessage('');
                                        }}
                                    >
                                        Send Another Gursha
                                    </Button>

                                    <div className="success-share-wrap">
                                        <span className="share-wrap-title">Share the love</span>
                                        <div className="share-wrap-buttons">
                                            <button
                                                type="button"
                                                onClick={handleCopyLink}
                                                className="share-pill-btn"
                                            >
                                                {copiedShare ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                                                <span>{copiedShare ? 'Copied' : 'Copy Link'}</span>
                                            </button>
                                            <a
                                                href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="share-pill-btn telegram"
                                            >
                                                <span>Telegram</span>
                                            </a>
                                            <a
                                                href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="share-pill-btn whatsapp"
                                            >
                                                <span>WhatsApp</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            ) : tippingState === 'pin_prompt' ? (

                                /* TELEBIRR USSD LIVE PIN PROMPT STATE */
                                <div className="tip-pin-prompt-view">
                                    <div className="pin-prompt-header">
                                        <div className="radar-ping-wrap">
                                            <span className="radar-ping" />
                                            <span className="radar-dot" />
                                        </div>
                                        <div>
                                            <h2 className="pin-prompt-title">Telebirr Authorization</h2>
                                            <p className="pin-prompt-sub">Approve transaction on your mobile</p>
                                        </div>
                                    </div>

                                    {/* Order Summary Strip */}
                                    <div className="pin-order-strip">
                                        <div className="pin-order-gift">
                                            {tippingMode === 'gifts' && selectedGift ? (
                                                <Gift3DIcon id={selectedGift.id} size={38} animated={true} />
                                            ) : (
                                                <span style={{ fontSize: '1.6rem' }}>🪙</span>
                                            )}
                                            <div>
                                                <div className="pin-order-name">
                                                    {tippingMode === 'gifts' && selectedGift
                                                        ? `${selectedGift.nameAm} (${selectedGift.nameEn})`
                                                        : 'Direct Gursha Tip'}
                                                </div>
                                                <div className="pin-order-phone">+251 {tipperPhone}</div>
                                            </div>
                                        </div>
                                        <div className="pin-order-total">
                                            <span className="pin-total-etb">{currentTotalETB} ETB</span>
                                            <span className="pin-total-coins">🪙 {currentTotalCoins.toLocaleString()} Coins</span>
                                        </div>
                                    </div>

                                    {/* 3-Step Live Status Tracker */}
                                    <div className="telebirr-stepper">
                                        <div className="stepper-step completed">
                                            <div className="stepper-icon"><Check size={12} strokeWidth={3} /></div>
                                            <div className="stepper-content">
                                                <span className="stepper-title">USSD Prompt Dispatched</span>
                                                <span className="stepper-desc">Request sent to +251 {tipperPhone}</span>
                                            </div>
                                        </div>

                                        <div className="stepper-step active">
                                            <div className="stepper-icon pulse">2</div>
                                            <div className="stepper-content">
                                                <span className="stepper-title">Enter Telebirr PIN</span>
                                                <span className="stepper-desc">Approve the prompt on your mobile screen</span>
                                            </div>
                                        </div>

                                        <div className="stepper-step pending">
                                            <div className="stepper-icon">3</div>
                                            <div className="stepper-content">
                                                <span className="stepper-title">Instant Verification</span>
                                                <span className="stepper-desc">Auto-confirmed within seconds</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pin-instruction-box">
                                        💡 A prompt has appeared on your phone screen. Please approve the tip of <strong>{currentTotalETB} ETB</strong>. If the screen timed out, open your Telebirr app.
                                    </div>

                                    <Button
                                        variant="outline"
                                        style={{ width: '100%', height: '46px', fontWeight: 700 }}
                                        onClick={() => setTippingState('idle')}
                                    >
                                        Cancel / Modify Tip
                                    </Button>
                                </div>

                            ) : (

                                /* INTERACTIVE TIPPING FORM (IDLE / PROCESSING) */
                                <form onSubmit={handleTip} className="tipping-form">

                                    {/* Tipping Mode Switcher */}
                                    <div className="tipping-mode-segmented">
                                        <button
                                            type="button"
                                            className={`segmented-tab ${tippingMode === 'gifts' ? 'active' : ''}`}
                                            onClick={() => setTippingMode('gifts')}
                                        >
                                            <span>🎁</span>
                                            <span>Cultural Gifts</span>
                                            <span className="tab-sub">ባህል ስጦታዎች</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`segmented-tab ${tippingMode === 'quick' ? 'active' : ''}`}
                                            onClick={() => setTippingMode('quick')}
                                        >
                                            <span>⚡</span>
                                            <span>Quick Tip</span>
                                            <span className="tab-sub">ቀጥታ ክፍያ</span>
                                        </button>
                                    </div>

                                    {/* ================================================= */}
                                    {/* TAB 1: CULTURAL 3D GIFTS CATALOG                 */}
                                    {/* ================================================= */}
                                    {tippingMode === 'gifts' && (
                                        <div className="gifts-catalog-section">
                                            {/* Category Filter Pills */}
                                            <div className="gift-categories-bar">
                                                {GIFT_CATEGORIES.filter(c => c.key !== 'custom').map(tab => (
                                                    <button
                                                        key={tab.key}
                                                        type="button"
                                                        className={`gift-category-chip ${giftCategory === tab.key ? 'active' : ''}`}
                                                        onClick={() => setGiftCategory(tab.key)}
                                                    >
                                                        <span className="cat-icon">{tab.icon}</span>
                                                        <span className="cat-name">{tab.labelAm}</span>
                                                        <span className="cat-en">({tab.labelEn})</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Responsive 3-Column Gift Grid */}
                                            <div className="tactile-gift-grid">
                                                {ETHIOPIAN_GIFTS_CATALOG
                                                    .filter(g => giftCategory === 'all' || g.category === giftCategory)
                                                    .map(gift => {
                                                        const isSelected = selectedGift?.id === gift.id;
                                                        return (
                                                            <button
                                                                key={gift.id}
                                                                type="button"
                                                                className={`tactile-gift-card ${isSelected ? 'selected' : ''}`}
                                                                onClick={() => handleSelectGift(gift)}
                                                            >
                                                                {isSelected && (
                                                                    <div className="card-selected-check">
                                                                        <Check size={11} strokeWidth={3.5} />
                                                                    </div>
                                                                )}

                                                                <div className="gift-card-3d-wrap">
                                                                    <Gift3DIcon id={gift.id} size={58} animated={true} />
                                                                </div>

                                                                <div className="gift-card-meta">
                                                                    <span className="gift-name-am">{gift.nameAm}</span>
                                                                    <span className="gift-name-en">{gift.nameEn}</span>
                                                                    <div className="gift-card-tag">
                                                                        <span className="tag-etb">{gift.etb} ETB</span>
                                                                        <span className="tag-coins">🪙 {gift.coins.toLocaleString()}</span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                            </div>

                                            {/* Selected Gift Multiplier Tray */}
                                            {selectedGift && (
                                                <div className="selected-gift-tray">
                                                    <div className="tray-left">
                                                        <div className="tray-icon-wrap">
                                                            <Gift3DIcon id={selectedGift.id} size={40} animated={false} />
                                                        </div>
                                                        <div className="tray-info">
                                                            <div className="tray-name">
                                                                {selectedGift.nameAm} <span className="tray-en">({selectedGift.nameEn})</span>
                                                            </div>
                                                            <div className="tray-sub">
                                                                <strong>{currentTotalETB} ETB</strong> &bull; 🪙 {currentTotalCoins.toLocaleString()} Coins
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tray-multipliers">
                                                        {[1, 2, 3, 5, 10].map(m => (
                                                            <button
                                                                key={m}
                                                                type="button"
                                                                className={`multiplier-chip ${multiplier === m ? 'active' : ''}`}
                                                                onClick={() => handleMultiplierChange(m)}
                                                            >
                                                                {m}x
                                                            </button>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            className="multiplier-chip preview"
                                                            title="Preview gift fanfare animation"
                                                            onClick={() => {
                                                                setCelebrationGift(selectedGift);
                                                                setComboCount(prev => prev + 1);
                                                                setShowCelebrationModal(true);
                                                                if (soundEnabled) {
                                                                    playAudioEffect('sacred_chime');
                                                                }
                                                            }}
                                                        >
                                                            ✨
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ================================================= */}
                                    {/* TAB 2: DIRECT / QUICK TIP PRESETS & CUSTOM INPUT */}
                                    {/* ================================================= */}
                                    {tippingMode === 'quick' && (
                                        <div className="quick-tip-section">
                                            <label className="section-label">Select Amount (መጠን ይምረጡ)</label>
                                            <div className="preset-amount-grid">
                                                {quickTipPresets.map(preset => {
                                                    const isSelected = !isCustom && quickTipAmount === preset;
                                                    return (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            className={`preset-amount-btn ${isSelected ? 'active' : ''}`}
                                                            onClick={() => {
                                                                setQuickTipAmount(preset);
                                                                setIsCustom(false);
                                                                if (soundEnabled) playAudioEffect('chime');
                                                            }}
                                                        >
                                                            <span className="preset-etb">{preset} ETB</span>
                                                            <span className="preset-coins">🪙 {(Number(preset) * 10).toLocaleString()} Coins</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Custom Amount Field */}
                                            <div className="custom-input-card">
                                                <div className="custom-input-header">
                                                    <span className="custom-title">Or enter custom amount</span>
                                                    <span className="custom-rate">1 ETB = 10 Coins 🪙</span>
                                                </div>
                                                <div className="custom-field-wrap">
                                                    <span className="currency-prefix">ETB</span>
                                                    <input
                                                        type="number"
                                                        min="10"
                                                        max="100000"
                                                        placeholder="Custom amount (10 - 100,000)"
                                                        value={customAmount}
                                                        onChange={(e) => {
                                                            setCustomAmount(e.target.value);
                                                            setIsCustom(true);
                                                        }}
                                                        className="custom-number-input"
                                                    />
                                                </div>
                                                {isCustom && customAmount && Number(customAmount) >= 10 && (
                                                    <div className="custom-coin-preview">
                                                        = 🪙 {(Number(customAmount) * 10).toLocaleString()} Gursha Coins
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Supporter Name & Anonymous Checkbox */}
                                    <div className="form-group">
                                        <div className="form-group-header">
                                            <label className="section-label">Your Name (Optional)</label>
                                            <label className="anon-checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={isAnonymous}
                                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                                    className="anon-checkbox"
                                                />
                                                <span>Tip anonymously</span>
                                            </label>
                                        </div>
                                        {!isAnonymous && (
                                            <div className="input-with-icon">
                                                <User size={16} className="input-icon" />
                                                <input
                                                    type="text"
                                                    placeholder="Your name or nickname (e.g. Dawit)"
                                                    value={tipperName}
                                                    onChange={(e) => setTipperName(e.target.value)}
                                                    className="text-input"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Shoutout Message */}
                                    <div className="form-group">
                                        <div className="form-group-header">
                                            <label className="section-label">Shoutout Message (Optional)</label>
                                            <span className="char-counter">{shoutOutMessage.length}/200</span>
                                        </div>
                                        <div className="input-with-icon message-wrap">
                                            <MessageSquare size={16} className="input-icon textarea-icon" />
                                            <textarea
                                                rows={2}
                                                placeholder="Say something inspiring to this creator..."
                                                value={shoutOutMessage}
                                                onChange={(e) => setShoutOutMessage(e.target.value)}
                                                maxLength={200}
                                                className="textarea-input"
                                            />
                                        </div>

                                        {/* One-tap Quick Reaction Message Chips */}
                                        <div className="quick-messages-row">
                                            {quickMessages.map((msg, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setShoutOutMessage(msg)}
                                                    className="quick-message-chip"
                                                >
                                                    {msg}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="form-group">
                                        <label className="section-label">Payment Method</label>
                                        <div className="payment-method-selector">
                                            <button
                                                type="button"
                                                className={`payment-option-card ${paymentMethod === 'telebirr' ? 'active' : ''}`}
                                                onClick={() => setPaymentMethod('telebirr')}
                                            >
                                                <div className="payment-icon telebirr-icon">
                                                    <Smartphone size={20} />
                                                </div>
                                                <div className="payment-texts">
                                                    <div className="payment-title">Telebirr</div>
                                                    <div className="payment-desc">Instant USSD PIN push</div>
                                                </div>
                                                {paymentMethod === 'telebirr' && (
                                                    <div className="payment-check-dot">
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                className={`payment-option-card ${paymentMethod === 'chapa_checkout' ? 'active' : ''}`}
                                                onClick={() => setPaymentMethod('chapa_checkout')}
                                            >
                                                <div className="payment-icon chapa-icon">
                                                    <CreditCard size={20} />
                                                </div>
                                                <div className="payment-texts">
                                                    <div className="payment-title">Bank / Cards</div>
                                                    <div className="payment-desc">CBE & Debit Cards</div>
                                                </div>
                                                {paymentMethod === 'chapa_checkout' && (
                                                    <div className="payment-check-dot">
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Telebirr Phone Number Input */}
                                    {paymentMethod === 'telebirr' && (
                                        <div className="form-group">
                                            <label className="section-label">Your Telebirr Phone Number</label>
                                            <div className="telebirr-input-wrapper">
                                                <span className="phone-prefix-pill">🇪🇹 +251</span>
                                                <input
                                                    type="tel"
                                                    placeholder="967432143"
                                                    value={tipperPhone}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                                        if (val.startsWith('0')) val = val.substring(1);
                                                        setTipperPhone(val.slice(0, 9));
                                                    }}
                                                    maxLength={9}
                                                    className="telebirr-phone-input"
                                                    required
                                                />
                                            </div>
                                            <span className="input-hint">A USSD prompt will appear on this phone for instant approval</span>
                                        </div>
                                    )}

                                    {/* Grand Action CTA Button */}
                                    <button
                                        type="submit"
                                        disabled={tippingState === 'processing'}
                                        className="grand-cta-button"
                                    >
                                        {tippingState === 'processing' ? (
                                            <>
                                                <RefreshCw size={20} className="spinner-icon" />
                                                <span>Connecting to payment rails...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="cta-icon">
                                                    {tippingMode === 'gifts' ? (selectedGift?.emoji || '🎁') : '⚡'}
                                                </span>
                                                <span className="cta-label">
                                                    {tippingMode === 'gifts' && selectedGift
                                                        ? `Send ${selectedGift.nameEn} • ${currentTotalETB} ETB`
                                                        : `Send ${currentTotalETB} ETB with ${paymentMethod === 'telebirr' ? 'Telebirr' : 'Card'}`}
                                                </span>
                                                <ArrowRight size={18} className="cta-arrow" />
                                            </>
                                        )}
                                    </button>

                                    <div className="secure-checkout-trust">
                                        <Lock size={13} />
                                        <span>256-bit encrypted checkout &bull; Operated by Birana Labs</span>
                                    </div>
                                </form>
                            )}
                        </div>
                    </section>

                </div>
            </main>

            {/* QR CODE MODAL */}
            {showQrModal && (
                <div
                    className="qr-modal-backdrop"
                    onClick={() => setShowQrModal(false)}
                >
                    <div
                        className="qr-modal-card"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="qr-modal-header">
                            <h3 className="qr-modal-title">Creator Tip QR Code</h3>
                            <button
                                type="button"
                                onClick={() => setShowQrModal(false)}
                                className="qr-modal-close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="qr-code-display-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://gurshapay.com/@${creator.username}&color=059669`}
                                alt="Creator Tip QR Code"
                                className="qr-code-img"
                            />
                        </div>

                        <p className="qr-code-caption">
                            Scan with camera or Telebirr to support <strong>@{creator.username}</strong>
                        </p>

                        <a
                            href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https://gurshapay.com/@${creator.username}&color=059669`}
                            download={`${creator.username}-gurshapay-qr.png`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button variant="primary" icon={Download} style={{ width: '100%', height: '44px' }}>
                                Download High-Res QR
                            </Button>
                        </a>
                    </div>
                </div>
            )}

            {/* TIKTOK LIVE CINEMATIC CELEBRATION SHOWCASE */}
            {showCelebrationModal && (
                <TikTokLiveGiftShowcase
                    gift={celebrationGift || selectedGift}
                    supporterName={isAnonymous ? 'Anonymous Fan' : (tipperName || 'Supporter')}
                    creatorName={creator?.name || creator?.username || 'Creator'}
                    amount={currentTotalETB}
                    coins={currentTotalCoins}
                    comboCount={comboCount}
                    onComboClick={() => {
                        setComboCount(prev => prev + 1);
                        if (soundEnabled) playAudioEffect('chime');
                    }}
                    onClose={() => setShowCelebrationModal(false)}
                />
            )}
        </div>
    );
}
