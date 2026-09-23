import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import {
    Gift3DIcon,
    playAudioEffect,
    TikTokLiveGiftShowcase,
    ETHIOPIAN_GIFTS_CATALOG,
    GIFT_CATEGORIES
} from '../components/Ethiopian3DGifts';
import EthiopianFlag from '../components/EthiopianFlag';
import './PublicProfile.css';

const RESERVED_ROUTES = [
    'reset-password', 'forgot-password', 'login', 'signup', 'register',
    'dashboard', 'settings', 'profile', 'kyc', 'support', 'privacy',
    'privacy-policy', 'data-deletion', 'terms', 'terms-of-service',
    'admin', 'api', 'verify', 'auth', 'onboarding'
];

// Verified Blue Tick SVG Emblem
const VerifiedBlueTick = ({ size = 18, title = "Verified Creator" }) => (
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
    const navigate = useNavigate();
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Virtual Gift & Coin Tipping State (27 Cultural Gifts Catalog)
    const [selectedGift, setSelectedGift] = useState(ETHIOPIAN_GIFTS_CATALOG[0]); // Default Adey Flower (10 ETB)
    const [giftCategory, setGiftCategory] = useState('all'); // 'all' | 'food' | 'culture' | 'nature' | 'music' | 'places' | 'modern' | 'custom'
    const [amount, setAmount] = useState('10');
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
    const [copiedRef, setCopiedRef] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);

    const handleCopyRef = () => {
        if (!txRef) return;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(txRef);
            setCopiedRef(true);
            setTimeout(() => setCopiedRef(false), 2000);
        }
    };

    // Live Celebration State
    const [showCelebrationModal, setShowCelebrationModal] = useState(false);
    const [celebrationGift, setCelebrationGift] = useState(null);
    const [comboCount, setComboCount] = useState(1);

    const { language, t } = useLanguage();

    const defaultQuickMessagesEn = [
        '☕ Gursha on me! Keep creating!',
        '🌼 Great work! Proud supporter!',
        '🦁 Big respect for your talent!',
        '👑 Keep inspiring Ethiopia!'
    ];
    const defaultQuickMessagesAm = [
        '☕ ጉርሻ ከኔ! በርትተህ ቀጥል!',
        '🌼 ድንቅ ስራ ነው! ኩራት ይሰማኛል!',
        '🦁 ለተሰጥኦህ ትልቅ አክብሮት አለኝ!',
        '👑 ሁሌም ሀገርን በስራህ አነቃቃ!'
    ];

    const activeQuickMessages = (!isCustom && selectedGift?.quickMessages)
        ? (language === 'am'
            ? selectedGift.quickMessages.filter(m => /[\u1200-\u137F]/.test(m)).concat(defaultQuickMessagesAm).slice(0, 4)
            : selectedGift.quickMessages.filter(m => !/[\u1200-\u137F]/.test(m)).concat(defaultQuickMessagesEn).slice(0, 4)
          )
        : (language === 'am' ? defaultQuickMessagesAm : defaultQuickMessagesEn);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    const handleSelectGift = (gift) => {
        setSelectedGift(gift);
        setAmount(gift.etb);
        setIsCustom(false);
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
            try { window.navigator.vibrate(12); } catch (e) {}
        }
        try {
            if (gift.id === 'car') {
                playAudioEffect('car_rev');
            } else if (gift.id === 'anbessa') {
                playAudioEffect('lion_roar');
            } else if (gift.id === 'plane') {
                playAudioEffect('jet_flyby');
            } else if (['bible', 'quran', 'axum', 'lalibela', 'gondar', 'crown', 'national_honor'].includes(gift.id)) {
                playAudioEffect('sacred_chime');
            } else {
                playAudioEffect('chime');
            }
        } catch (e) {}
    };

    const handleMultiplier = (mult) => {
        if (!selectedGift) return;
        const newAmount = String(Number(selectedGift.etb) * mult);
        setAmount(newAmount);
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
            try { window.navigator.vibrate(15); } catch (e) {}
        }
        try { playAudioEffect('chime'); } catch (e) {}
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const cleanUsername = username?.startsWith('@') ? username.slice(1) : username;
                if (!cleanUsername) return;
                
                if (RESERVED_ROUTES.includes(cleanUsername.toLowerCase())) {
                    navigate(`/${cleanUsername.toLowerCase()}`, { replace: true });
                    return;
                }

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
                            try { playAudioEffect('sacred_chime'); } catch (e) {}
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
    }, [tippingState, txRef, api, selectedGift]);

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
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
            try { window.navigator.vibrate([15, 20, 15]); } catch (e) {}
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
            <div className="tipping-page-wrapper">
                <div className="tipping-main-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--border-color)', margin: '0 auto 1.25rem', opacity: 0.6 }} />
                    <div style={{ height: '20px', width: '50%', background: 'var(--border-color)', margin: '0 auto 0.75rem', borderRadius: '4px', opacity: 0.5 }} />
                    <div style={{ height: '14px', width: '70%', background: 'var(--border-color)', margin: '0 auto', borderRadius: '4px', opacity: 0.4 }} />
                </div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div className="tipping-page-wrapper">
                <div className="tipping-main-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <AlertCircle size={26} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>{t('creatorNotFound')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
                        {error || t('creatorNotFoundDesc')}
                    </p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" style={{ width: '100%' }}>{t('exploreCreators')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentEtb = isCustom ? customAmount : amount;
    const currentCoins = isCustom 
        ? Number(customAmount || 0) * 10 
        : (selectedGift ? Number(selectedGift.coins * (Number(amount || 10) / Number(selectedGift.etb || 1))) : 100);

    return (
        <div className="tipping-page-wrapper">
            {alert && <TopAlert message={alert.message} type={alert.type} />}

            {/* Top Navigation Controls */}
            <header className="tipping-top-nav">
                <Logo size="small" />
                <div className="tipping-nav-actions">
                    <button
                        type="button"
                        onClick={() => setShowQrModal(true)}
                        className="tipping-nav-btn"
                        title={language === 'am' ? 'የQR ኮድ አሳይ' : 'Show QR Code'}
                    >
                        <QrCode size={14} />
                        <span>QR</span>
                    </button>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Single Card Container */}
            <div className="tipping-main-card">

                {/* ========================================================= */}
                {/* 1. SUCCESS STATE CELEBRATION RECEIPT                      */}
                {/* ========================================================= */}
                {tippingState === 'success' ? (
                    <div className="tip-success-container">
                        <div className="status-card-header">
                            {creator.profilePicUrl ? (
                                <img
                                    src={creator.profilePicUrl}
                                    alt={creator.name}
                                    className="status-card-avatar"
                                />
                            ) : (
                                <div className="status-card-avatar-fallback">
                                    {creator.name ? creator.name.charAt(0).toUpperCase() : 'G'}
                                </div>
                            )}
                            <div className="status-card-creator-info">
                                <div className="status-card-creator-name">
                                    {creator.name} {creator.isVerified && <VerifiedBlueTick size={16} />}
                                </div>
                                <span className="status-card-creator-handle">@{creator.username}</span>
                            </div>
                        </div>

                        <div className="tip-success-emblem-wrap">
                            <div className="success-confetti-sparkles" aria-hidden="true">
                                <span className="confetti c1">✦</span>
                                <span className="confetti c2">●</span>
                                <span className="confetti c3">▲</span>
                                <span className="confetti c4">✦</span>
                                <span className="confetti c5">●</span>
                                <span className="confetti c6">✧</span>
                            </div>
                            <div className="tip-success-emblem-ring">
                                <Check size={26} strokeWidth={3} />
                            </div>
                        </div>

                        <h2 className="tip-success-title">{t('tipSentSuccessfully')}</h2>
                        <p className="tip-success-subtitle">
                            {t('thankYouForSupportingCreator')} <strong>{creator.name}</strong>
                        </p>

                        <div className="tip-order-summary-box">
                            <div className="tip-order-gift-left">
                                <div className="tip-order-gift-icon">
                                    {!isCustom && selectedGift ? (
                                        <Gift3DIcon id={selectedGift.id} size={40} animated={false} />
                                    ) : (
                                        <span className="tip-order-coin-emoji">🪙</span>
                                    )}
                                </div>
                                <div className="tip-order-gift-details">
                                    <div className="tip-order-gift-name">
                                        {!isCustom && selectedGift ? (language === 'am' ? `${selectedGift.nameAm} (${selectedGift.nameEn})` : `${selectedGift.nameEn} (${selectedGift.nameAm})`) : t('customGurshaTip')}
                                    </div>
                                    <div className="tip-order-gift-sub">
                                        {language === 'am' ? 'ደጋፊ፡ ' : 'From '} {isAnonymous ? t('anonymousSupporter') : (tipperName || t('anonymousFan'))}
                                    </div>
                                </div>
                            </div>
                            <div className="tip-order-amount-col">
                                <div className="tip-order-amount-etb">{currentEtb} {language === 'am' ? 'ብር' : 'ETB'}</div>
                                <div className="tip-order-coins-sub">🪙 {currentCoins.toLocaleString()} {t('coinsLabel')}</div>
                            </div>
                        </div>

                        <div className="compact-receipt-card">
                            <div className="compact-receipt-row">
                                <span className="receipt-label">{t('statusHeaderLabel')}</span>
                                <span className="receipt-status-pill">
                                    <Check size={11} strokeWidth={3} /> {t('completedStatus')}
                                </span>
                            </div>
                            <div className="compact-receipt-row">
                                <span className="receipt-label">{t('referenceLabel')}</span>
                                <div 
                                    className="receipt-ref-badge" 
                                    onClick={handleCopyRef} 
                                    title={t('clickToCopyRef')}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <span className="receipt-ref-mono">{txRef || 'GP-TIP'}</span>
                                    {copiedRef ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                                </div>
                            </div>
                            <div className="compact-receipt-row">
                                <span className="receipt-label">{t('paymentMethod')}</span>
                                <span className="receipt-method-pill">
                                    <span className={`receipt-method-dot ${paymentMethod === 'telebirr' ? 'telebirr' : 'chapa'}`} />
                                    {paymentMethod === 'telebirr' ? `${t('telebirrTitle')} USSD` : 'Chapa Gateway'}
                                </span>
                            </div>
                            <div className="compact-receipt-row">
                                <span className="receipt-label">{t('dateLabel')}</span>
                                <span className="receipt-date-val">
                                    {new Date().toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="tip-cta-button"
                            onClick={() => {
                                setTippingState('idle');
                                setShoutOutMessage('');
                            }}
                        >
                            {t('sendAnotherGursha')}
                        </Button>

                        <div className="compact-share-section">
                            <span className="compact-share-title">{t('sharePageLabel')}</span>
                            <div className="compact-share-row">
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="compact-share-pill"
                                    title={t('shareLink')}
                                >
                                    {copiedShare ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                                    <span>{copiedShare ? t('copiedBadge') : t('shareLink')}</span>
                                </button>
                                <a
                                    href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="compact-share-pill telegram"
                                    title="Share on Telegram"
                                >
                                    <span>Telegram</span>
                                </a>
                                <a
                                    href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="compact-share-pill whatsapp"
                                    title="Share on WhatsApp"
                                >
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                ) : tippingState === 'pin_prompt' ? (
                    /* 2. TELEBIRR USSD LIVE PIN PROMPT STATE */
                    <div style={{ textAlign: 'center' }}>
                        <div className="status-card-header">
                            {creator.profilePicUrl ? (
                                <img
                                    src={creator.profilePicUrl}
                                    alt={creator.name}
                                    className="status-card-avatar"
                                />
                            ) : (
                                <div className="status-card-avatar-fallback">
                                    {creator.name ? creator.name.charAt(0).toUpperCase() : 'G'}
                                </div>
                            )}
                            <div className="status-card-creator-info">
                                <div className="status-card-creator-name">
                                    {creator.name} {creator.isVerified && <VerifiedBlueTick size={16} />}
                                </div>
                                <span className="status-card-creator-handle">@{creator.username}</span>
                            </div>
                        </div>

                        <div className="tip-order-summary-box">
                            <div className="tip-order-gift-left">
                                <div className="tip-order-gift-icon">
                                    {!isCustom && selectedGift ? (
                                        <Gift3DIcon id={selectedGift.id} size={40} animated={true} />
                                    ) : (
                                        <span style={{ fontSize: '1.6rem' }}>🪙</span>
                                    )}
                                </div>
                                <div className="tip-order-gift-details">
                                    <span className="tip-order-gift-name">
                                        {!isCustom && selectedGift ? (language === 'am' ? `${selectedGift.nameAm} (${selectedGift.nameEn})` : `${selectedGift.nameEn} (${selectedGift.nameAm})`) : t('customTip')}
                                    </span>
                                    <span className="tip-order-gift-sub">{t('supportTo')} @{creator.username}</span>
                                </div>
                            </div>
                            <div className="tip-order-amount-col">
                                <div className="tip-order-amount-etb">{currentEtb} {language === 'am' ? 'ብር' : 'ETB'}</div>
                                <div className="tip-order-coins-sub">🪙 {currentCoins.toLocaleString()} {t('coinsLabel')}</div>
                            </div>
                        </div>

                        <div className="telebirr-flow-card">
                            <div className="telebirr-flow-header">
                                <div className="telebirr-flow-title">
                                    <span className="telebirr-radar-ring" />
                                    <span>{t('telebirrAuthorization')}</span>
                                </div>
                                <div className="telebirr-phone-pill">
                                    +251 {tipperPhone}
                                </div>
                            </div>

                            <div className="telebirr-step-tracker">
                                <div className="telebirr-step-item">
                                    <span className="telebirr-step-bullet completed">✓</span>
                                    <span className="telebirr-step-text">{t('ussdPromptSent')}</span>
                                </div>
                                <div className="telebirr-step-item">
                                    <span className="telebirr-step-bullet active">2</span>
                                    <span className="telebirr-step-text active">{t('enter4DigitPin')}</span>
                                </div>
                                <div className="telebirr-step-item">
                                    <span className="telebirr-step-bullet pending">3</span>
                                    <span className="telebirr-step-text pending">{t('instantConfirmation')}</span>
                                </div>
                            </div>

                            <p className="telebirr-flow-note">
                                💡 {t('telebirrPromptAppeared')} <strong>{currentEtb} {language === 'am' ? 'ብር' : 'ETB'}</strong>.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            style={{ width: '100%', height: '42px', fontWeight: 600, fontSize: '0.875rem' }}
                            onClick={() => setTippingState('idle')}
                        >
                            {t('cancelModifyTip')}
                        </Button>
                    </div>

                ) : (
                    /* 3. CLEAN CREATOR PROFILE & INTERACTIVE TIPPING FORM */
                    <>
                        {/* Clean Creator Profile at Top */}
                        <div className="creator-profile-header">
                            <div className="creator-avatar-ring">
                                {creator.profilePicUrl ? (
                                    <img
                                        src={creator.profilePicUrl}
                                        alt={creator.name}
                                        className="creator-avatar-photo"
                                    />
                                ) : (
                                    <div className="creator-avatar-placeholder">
                                        {creator.name ? creator.name.charAt(0).toUpperCase() : 'G'}
                                    </div>
                                )}
                            </div>

                            <div className="creator-info-block">
                                <div className="creator-name-row">
                                    <h1 className="creator-display-name">
                                        <span className="creator-name-text">{creator.name}</span>
                                        {creator.isVerified && <VerifiedBlueTick size={20} />}
                                    </h1>
                                </div>

                                {creator.customCommissionRate === 0 && (
                                    <div className="creator-tier-wrapper">
                                        <span className="creator-tier-badge badge-vip" title={t('vipGenesisTitle')}>
                                            {t('vipGenesisBadge')}
                                        </span>
                                    </div>
                                )}
                                {creator.customCommissionRate === 0.05 && (
                                    <div className="creator-tier-wrapper">
                                        <span className="creator-tier-badge badge-growth" title={t('growthTierTitle')}>
                                            {t('growthTierBadge')}
                                        </span>
                                    </div>
                                )}

                                <span className="creator-handle-tag">@{creator.username}</span>
                            </div>

                            {creator.bio && (
                                <p className="creator-bio-text">
                                    {creator.bio}
                                </p>
                            )}

                            {/* Social Media Links */}
                            {creator.socialLinks && creator.socialLinks.length > 0 && (
                                <div className="creator-social-pills">
                                    {creator.socialLinks.map((s, idx) => (
                                        <a
                                            key={idx}
                                            href={s.username.startsWith('http') ? s.username : `https://${s.platform}.com/${s.username.replace('@', '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="creator-social-pill"
                                        >
                                            <span>{s.platform}</span>
                                            <ExternalLink size={9} />
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Creator Active Goal Widget (Clean & Subtle) */}
                            {creator.goal && (
                                <div className="creator-clean-goal">
                                    <div className="goal-row-top">
                                        <span className="goal-label">
                                            <span>🎯</span> {creator.goal.title}
                                        </span>
                                        <span className="goal-pct">{creator.goal.progressPercentage}%</span>
                                    </div>
                                    <div className="goal-bar-track">
                                        <div
                                            className="goal-bar-fill"
                                            style={{ width: `${Math.min(100, creator.goal.progressPercentage)}%` }}
                                        />
                                    </div>
                                    <div className="goal-row-bottom">
                                        <span><strong>{(creator.goal.raisedAmount || 0).toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}</strong> {t('raised')}</span>
                                        <span>{t('target')} {creator.goal.targetAmount.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Tipping Form */}
                        <form onSubmit={handleTip} className="tipping-form-body">

                            {/* Gift Selection Section */}
                            <div className="gift-section-block">
                                <div className="section-title-row">
                                    <span className="clean-section-title">{t('selectGift')}</span>
                                </div>

                                {/* Category Navigation Tabs (Clean Horizontal Tabs) */}
                                <div className="clean-category-tabs">
                                    {GIFT_CATEGORIES.map(tab => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            className={`clean-cat-tab ${giftCategory === tab.key ? 'active' : ''}`}
                                            onClick={() => {
                                                setGiftCategory(tab.key);
                                                if (tab.key === 'custom') {
                                                    setIsCustom(true);
                                                } else {
                                                    setIsCustom(false);
                                                }
                                                if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                                                    try { window.navigator.vibrate(8); } catch (e) {}
                                                }
                                                try { playAudioEffect('chime'); } catch (e) {}
                                            }}
                                        >
                                            <span className="cat-tab-icon">
                                                {tab.key === 'culture' ? <EthiopianFlag width={18} height={12} /> : tab.icon}
                                            </span>
                                            <span className="cat-tab-label">{language === 'am' ? tab.labelAm : tab.labelEn}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* 3D Gift Grid */}
                                {!isCustom && (
                                    <div key={giftCategory} className="clean-gift-grid">
                                        {ETHIOPIAN_GIFTS_CATALOG
                                            .filter(g => giftCategory === 'all' || g.category === giftCategory)
                                            .sort((a, b) => Number(a.etb) - Number(b.etb))
                                            .map((gift) => {
                                                const isSelected = selectedGift?.id === gift.id;
                                                return (
                                                    <button
                                                        key={gift.id}
                                                        type="button"
                                                        className={`clean-gift-card ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => handleSelectGift(gift)}
                                                    >
                                                        {isSelected && (
                                                            <div className="gift-selected-tick">
                                                                <Check size={11} strokeWidth={3.5} />
                                                            </div>
                                                        )}

                                                        <div className="gift-icon-box">
                                                            <Gift3DIcon 
                                                                id={gift.id} 
                                                                size={46} 
                                                                animated={true} 
                                                                isSelected={isSelected} 
                                                            />
                                                        </div>

                                                        <div className="gift-text-wrap">
                                                            <span className="gift-name-primary">{language === 'am' ? gift.nameAm : gift.nameEn}</span>
                                                            <span className="gift-name-secondary">{language === 'am' ? (gift.shortAm || gift.nameEn) : gift.nameAm}</span>
                                                            <div className="gift-price-badge">
                                                                <span className="price-etb">{gift.etb} {language === 'am' ? 'ብር' : 'ETB'}</span>
                                                                <span className="price-coins">🪙 {gift.coins.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                )}

                                {/* Custom Amount Input Field */}
                                {isCustom && (
                                    <div className="clean-custom-box">
                                        <div className="custom-input-label-row">
                                            <span>{t('customAmountLabel')}</span>
                                            <span className="custom-rate-hint">1 {language === 'am' ? 'ብር' : 'ETB'} = 10 {t('coinsLabel')} 🪙</span>
                                        </div>
                                        <div className="custom-field-container">
                                            <span className="custom-prefix">{language === 'am' ? 'ብር' : 'ETB'}</span>
                                            <input
                                                type="number"
                                                min="10"
                                                max="100000"
                                                placeholder={t('enterAmountMin')}
                                                value={customAmount}
                                                onChange={(e) => setCustomAmount(e.target.value)}
                                                className="clean-custom-input"
                                                required
                                            />
                                        </div>
                                        {customAmount && Number(customAmount) >= 10 && (
                                            <div className="custom-conversion-text">
                                                = 🪙 {(Number(customAmount) * 10).toLocaleString()} {t('gurshaCoins')}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Selected Gift Multiplier Strip (The Red-Circled Component) */}
                                {!isCustom && selectedGift && (
                                    <div key={selectedGift.id} className="clean-multiplier-strip">
                                        <div className="multiplier-strip-top">
                                            <div className="multiplier-strip-gift">
                                                <div className="multiplier-gift-thumb">
                                                    <Gift3DIcon id={selectedGift.id} size={42} animated={true} isSelected={false} />
                                                </div>
                                                <div className="multiplier-gift-meta">
                                                    <div className="multiplier-title-row">
                                                        <span className="multiplier-name-am">{language === 'am' ? selectedGift.nameAm : selectedGift.nameEn}</span>
                                                        <span className="multiplier-name-en">({language === 'am' ? selectedGift.nameEn : selectedGift.nameAm})</span>
                                                    </div>
                                                    <div className="multiplier-cost-row">
                                                        <span key={amount} className="cost-etb-val">
                                                            {(Number(amount || selectedGift.etb)).toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                                                        </span>
                                                        <span className="cost-dot">•</span>
                                                        <span key={currentCoins} className="cost-coins-val">
                                                            🪙 {currentCoins.toLocaleString()} {t('coinsLabel')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="clean-preview-btn"
                                                title={t('previewCelebration')}
                                                onClick={() => {
                                                    setCelebrationGift(selectedGift);
                                                    setComboCount(1);
                                                    setShowCelebrationModal(true);
                                                    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                                                        try { window.navigator.vibrate(15); } catch (e) {}
                                                    }
                                                    try { playAudioEffect('sacred_chime'); } catch (e) {}
                                                }}
                                            >
                                                <span>✨</span>
                                                <span>{t('previewCelebration')}</span>
                                            </button>
                                        </div>

                                        <div className="multiplier-strip-bottom">
                                            <span className="multiplier-pills-label">{t('multiplier')}</span>
                                            <div className="multiplier-pills-group">
                                                {[1, 2, 5, 10].map(mult => {
                                                    const multAmount = String(Number(selectedGift.etb) * mult);
                                                    const isActive = amount === multAmount;
                                                    return (
                                                        <button
                                                            key={mult}
                                                            type="button"
                                                            className={`clean-mult-btn ${isActive ? 'active' : ''}`}
                                                            onClick={() => handleMultiplier(mult)}
                                                        >
                                                            {mult}x
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Supporter Name & Anonymous Checkbox */}
                            <div className="clean-field-group">
                                <div className="clean-field-header">
                                    <label className="clean-field-label">{t('yourNameOptional')}</label>
                                    <label className="clean-anon-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                        />
                                        <span>{t('tipAnonymously')}</span>
                                    </label>
                                </div>
                                {!isAnonymous && (
                                    <input
                                        type="text"
                                        placeholder={t('namePlaceholder')}
                                        value={tipperName}
                                        onChange={(e) => setTipperName(e.target.value)}
                                        className="clean-text-input"
                                    />
                                )}
                            </div>

                            {/* Shoutout Message */}
                            <div className="clean-field-group">
                                <div className="clean-field-header">
                                    <label className="clean-field-label">{t('saySomethingNice')}</label>
                                    <span className="clean-char-counter">{shoutOutMessage.length}/200</span>
                                </div>
                                <textarea
                                    rows={2}
                                    placeholder={t('encouragingMsgPlaceholder')}
                                    value={shoutOutMessage}
                                    onChange={(e) => setShoutOutMessage(e.target.value)}
                                    maxLength={200}
                                    className="clean-textarea-input"
                                />
                                <div className="clean-quick-messages">
                                    {activeQuickMessages.map((msg, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setShoutOutMessage(msg);
                                                if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                                                    try { window.navigator.vibrate(10); } catch (e) {}
                                                }
                                                try { playAudioEffect('chime'); } catch (e) {}
                                            }}
                                            className={`clean-msg-chip ${shoutOutMessage === msg ? 'active' : ''}`}
                                        >
                                            {msg}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="clean-field-group">
                                <label className="clean-field-label">{t('paymentMethodLabel')}</label>
                                <div className="clean-payment-grid">
                                    <button
                                        type="button"
                                        className={`clean-payment-tile ${paymentMethod === 'telebirr' ? 'active' : ''}`}
                                        onClick={() => {
                                            setPaymentMethod('telebirr');
                                            if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                                                try { window.navigator.vibrate(10); } catch (e) {}
                                            }
                                        }}
                                    >
                                        <div className="payment-tile-icon telebirr">
                                            <Smartphone size={18} />
                                        </div>
                                        <div className="payment-tile-meta">
                                            <span className="tile-title">{t('telebirrTitle')}</span>
                                            <span className="tile-sub">{t('telebirrUssdPush')}</span>
                                        </div>
                                        {paymentMethod === 'telebirr' && (
                                            <div className="payment-tile-check">
                                                <Check size={11} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className={`clean-payment-tile ${paymentMethod === 'chapa_checkout' ? 'active' : ''}`}
                                        onClick={() => {
                                            setPaymentMethod('chapa_checkout');
                                            if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                                                try { window.navigator.vibrate(10); } catch (e) {}
                                            }
                                        }}
                                    >
                                        <div className="payment-tile-icon chapa">
                                            <CreditCard size={18} />
                                        </div>
                                        <div className="payment-tile-meta">
                                            <span className="tile-title">{t('bankCardsTitle')}</span>
                                            <span className="tile-sub">{t('cbeAndChapa')}</span>
                                        </div>
                                        {paymentMethod === 'chapa_checkout' && (
                                            <div className="payment-tile-check">
                                                <Check size={11} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Telebirr Phone Number Field */}
                            {paymentMethod === 'telebirr' && (
                                <div className="clean-field-group">
                                    <label className="clean-field-label">{t('telebirrMobileNumber')}</label>
                                    <div 
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '44px',
                                            background: 'var(--card-bg)',
                                            border: '1.5px solid var(--border-color)',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                                        }}
                                        className="phone-input-field"
                                    >
                                        <div style={{
                                             display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            padding: '0 0.75rem',
                                            height: '100%',
                                            background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.03))',
                                            borderRight: '1px solid var(--border-color)',
                                            flexShrink: 0,
                                            userSelect: 'none'
                                        }}>
                                            <EthiopianFlag width={20} height={14} />
                                            <span style={{
                                                fontWeight: 800,
                                                fontSize: '0.88rem',
                                                color: 'var(--text-main)',
                                                letterSpacing: '0.5px'
                                            }}>
                                                +251
                                            </span>
                                        </div>
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            placeholder="967432143"
                                            value={tipperPhone}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/[^0-9]/g, '');
                                                if (val.startsWith('0')) val = val.substring(1);
                                                setTipperPhone(val.slice(0, 9));
                                            }}
                                            maxLength={9}
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                background: 'transparent',
                                                padding: '0 0.75rem',
                                                fontSize: '0.98rem',
                                                fontWeight: 700,
                                                letterSpacing: '1px',
                                                color: 'var(--text-main)',
                                                boxSizing: 'border-box'
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Main Send Tip CTA Button (Solid, Prominent & Clear) */}
                            <button
                                type="submit"
                                disabled={tippingState === 'processing'}
                                className="clean-send-btn"
                            >
                                {tippingState === 'processing' ? (
                                    <>
                                        <RefreshCw size={18} className="clean-spin" />
                                        <span>{t('connecting')}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="clean-send-icon">{isCustom ? '🪙' : (selectedGift?.emoji || '☕')}</span>
                                        <span key={`${isCustom ? customAmount : amount}-${selectedGift?.id}`} className="send-btn-amount-pulse">
                                            {t('sendTipWithAmount')} {isCustom ? `${Number(customAmount || 0).toLocaleString()} ${language === 'am' ? 'ብር' : 'ETB'}` : `${(language === 'am' ? selectedGift?.nameAm : selectedGift?.nameEn) || 'Gursha'} (${Number(amount || 0).toLocaleString()} ${language === 'am' ? 'ብር' : 'ETB'})`}
                                        </span>
                                    </>
                                )}
                            </button>

                            <div className="clean-security-footnote">
                                <Lock size={12} />
                                <span>{t('encryptedCheckout')}</span>
                            </div>
                        </form>
                    </>
                )}
            </div>

            {/* Share Page Strip (Clean & Compact) */}
            {tippingState === 'idle' && (
                <div className="clean-share-bar">
                    <span className="clean-share-label">{t('sharePageLabel')}</span>
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="clean-share-link-btn"
                    >
                        {copiedShare ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                        <span>{copiedShare ? t('copiedBadge') : t('shareLink')}</span>
                    </button>
                    <a
                        href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="clean-share-link-btn"
                    >
                        Telegram
                    </a>
                    <a
                        href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="clean-share-link-btn"
                    >
                        WhatsApp
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="clean-share-link-btn"
                    >
                        X
                    </a>
                    <button
                        type="button"
                        onClick={handleNativeShare}
                        className="clean-share-link-btn icon-only"
                        title={t('moreOptions')}
                    >
                        <Share2 size={13} />
                    </button>
                </div>
            )}

            {/* QR CODE MODAL */}
            {showQrModal && (
                <div
                    className="clean-modal-backdrop"
                    onClick={() => setShowQrModal(false)}
                >
                    <div
                        className="clean-modal-box"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="clean-modal-header">
                            <h3 className="clean-modal-title">{t('creatorTipQrCode')}</h3>
                            <button
                                type="button"
                                onClick={() => setShowQrModal(false)}
                                className="clean-modal-close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="clean-qr-image-wrapper">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://gurshapay.com/@${creator.username}&color=047857`}
                                alt="Creator Tip QR Code"
                                className="clean-qr-img"
                            />
                        </div>

                        <p className="clean-qr-caption">
                            {t('scanWithPhoneOrTelebirr')} <strong>@{creator.username}</strong>
                        </p>

                        <a
                            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://gurshapay.com/@${creator.username}&color=047857`}
                            download={`${creator.username}-gurshapay-qr.png`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button variant="primary" icon={Download} style={{ width: '100%', height: '42px', fontWeight: 600 }}>
                                {t('downloadHighResQr')}
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
                    amount={currentEtb}
                    coins={currentCoins}
                    comboCount={comboCount}
                    onComboClick={() => {
                        setComboCount(prev => prev + 1);
                    }}
                    onClose={() => setShowCelebrationModal(false)}
                />
            )}
        </div>
    );
}
