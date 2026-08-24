import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Smartphone, CheckCircle, AlertCircle, MessageSquare, ShieldCheck, Heart, Sparkles } from 'lucide-react';
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

    const [amount, setAmount] = useState('50');
    const [customAmount, setCustomAmount] = useState('');
    const [tipperPhone, setTipperPhone] = useState('');
    const [shoutOutMessage, setShoutOutMessage] = useState('');
    const [tippingState, setTippingState] = useState('idle'); // idle | processing | pin_prompt | success | error
    const [txRef, setTxRef] = useState('');
    const [alert, setAlert] = useState(null);

    const { t } = useLanguage();

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const cleanUsername = username?.startsWith('@') ? username.slice(1) : username;
                const res = await api.get(`/public/${cleanUsername}`);
                setCreator(res.data);
            } catch (err) {
                setError("We couldn't find this creator. The link might be broken or expired.");
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
                    const res = await api.get(`/payments/status/${txRef}`);
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
            showAlert("Please enter a valid Ethiopian phone number (e.g. 0911000000 or 0711000000)", "error");
            return;
        }
        setTippingState('processing');

        const finalAmount = amount === 'custom' ? customAmount : amount;
        if (!finalAmount || Number(finalAmount) <= 0) {
            showAlert("Please enter a valid tip amount", "error");
            setTippingState('idle');
            return;
        }

        try {
            const response = await api.post('/payments/initialize-tip', {
                creatorId: creator.id,
                tipperPhone,
                amount: finalAmount,
                message: shoutOutMessage
            });

            if (response.data && response.data.success) {
                if (response.data.tx_ref) {
                    setTxRef(response.data.tx_ref);
                }
                setTippingState('pin_prompt');
            } else {
                setTippingState('error');
            }
        } catch (err) {
            console.error('Tipping Error:', err);
            setTippingState('error');
        }
    };

    const selectAmount = (val) => {
        setAmount(val);
        if (val !== 'custom') setCustomAmount('');
    };

    if (loading) {
        return (
            <div className="auth-container">
                <div className="spinner" style={{ width: '40px', height: '40px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div className="auth-container">
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
                <Card padding="lg" style={{ maxWidth: '440px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--card-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '2rem' }}>🔍</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Creator Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>{error}</p>
                    <Link to="/">
                        <Button variant="primary" className="btn-full">
                            Explore GurshaPay
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const effectiveAmount = amount === 'custom' ? (customAmount || '0') : amount;

    return (
        <div className="public-tipping-container">
            {/* Top Bar Controls */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="tipping-card animate-fade-in">
                {/* Creator Cover Header */}
                <div style={{
                    height: '110px',
                    background: 'linear-gradient(135deg, #064E3B 0%, #0A5C36 50%, #047857 100%)',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1.25rem' }}>
                        <Logo size="small" />
                    </div>
                </div>

                <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
                    {/* Creator Avatar */}
                    <div style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        border: '4px solid var(--card-bg)',
                        background: 'var(--primary)',
                        margin: '-42px auto 1rem',
                        position: 'relative',
                        zIndex: 2,
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '2rem',
                        overflow: 'hidden'
                    }}>
                        {creator.profilePicUrl ? (
                            <img
                                src={creator.profilePicUrl?.startsWith('http') ? creator.profilePicUrl : 'https://wileta-backend.onrender.com' + creator.profilePicUrl}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            creator.name.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.25rem 0' }}>
                            {creator.name}
                        </h1>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            @{creator.username} <CheckCircle size={15} color="var(--primary)" />
                        </div>
                        <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {t('supportJourney')}
                        </p>
                    </div>

                    {/* SUCCESS STATE */}
                    {tippingState === 'success' ? (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={36} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.35rem' }}>{t('tipSuccessful')}</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
                                {t('contributionDelivered')} <strong style={{ color: 'var(--text-main)' }}>{effectiveAmount} ETB</strong>
                            </p>
                            <Button
                                variant="primary"
                                className="btn-full"
                                onClick={() => { setTippingState('idle'); setAmount('50'); setTipperPhone(''); setShoutOutMessage(''); }}
                            >
                                {t('sendAnotherTip')}
                            </Button>
                        </div>
                    ) : tippingState === 'pin_prompt' ? (
                        /* TELEBIRR PIN PROMPT STATE */
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.35rem' }}>{t('checkYourPhone')}</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                {t('telebirrPromptNotice')} <strong style={{ color: 'var(--text-main)' }}>{tipperPhone}</strong>
                            </p>
                            <div style={{ background: 'var(--card-bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div className="spinner" style={{ width: '22px', height: '22px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{t('awaitingConfirmation')}</span>
                            </div>
                            <button
                                onClick={() => setTippingState('idle')}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                {t('cancelAndGoBack')}
                            </button>
                        </div>
                    ) : (
                        /* TIPPING FORM */
                        <form onSubmit={handleTip} className="animate-fade-in">
                            {/* Amount Selector */}
                            <div style={{ background: 'var(--card-bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{t('amountLabel')}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ETB</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    {['25', '50', '100'].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => selectAmount(val)}
                                            style={{
                                                padding: '0.75rem 0',
                                                borderRadius: 'var(--radius-md)',
                                                border: amount === val ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                                                background: amount === val ? 'var(--primary-light)' : 'var(--card-bg)',
                                                color: amount === val ? 'var(--primary)' : 'var(--text-main)',
                                                fontWeight: 800,
                                                fontSize: '1.05rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Amount Input */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'var(--card-bg)',
                                        border: '1px solid ' + (amount === 'custom' ? 'var(--border-focus)' : 'var(--input-border)'),
                                        boxShadow: amount === 'custom' ? '0 0 0 3px var(--input-focus)' : 'none',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.6rem 0.875rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => { selectAmount('custom'); document.getElementById('customAmountInput')?.focus(); }}
                                >
                                    <span style={{ fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem', fontSize: '0.9rem' }}>ETB</span>
                                    <input
                                        id="customAmountInput"
                                        type="number"
                                        min="1"
                                        placeholder={t('customAmountPlaceholder')}
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        onFocus={() => selectAmount('custom')}
                                        required={amount === 'custom'}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            width: '100%',
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            color: 'var(--text-main)',
                                            background: 'transparent'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="form-group">
                                <label className="form-label">{t('yourTelebirrNumber')}</label>
                                <div className="input-group">
                                    <Smartphone size={18} />
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={tipperPhone}
                                        onChange={(e) => setTipperPhone(e.target.value)}
                                        placeholder="09... or 07..."
                                        required
                                        pattern="0[79][0-9]{8}"
                                    />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                    A Telebirr PIN prompt will be sent to this number.
                                </span>
                            </div>

                            {/* Shoutout Message */}
                            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                <label className="form-label">{t('messageLabel')}</label>
                                <div className="input-group" style={{ alignItems: 'flex-start' }}>
                                    <MessageSquare size={18} style={{ top: '0.85rem' }} />
                                    <textarea
                                        className="form-textarea"
                                        value={shoutOutMessage}
                                        onChange={(e) => setShoutOutMessage(e.target.value)}
                                        placeholder={t('messagePlaceholder')}
                                        rows="2"
                                        style={{ paddingLeft: '2.75rem', resize: 'none' }}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="btn-full"
                                loading={tippingState === 'processing'}
                                icon={Smartphone}
                            >
                                {tippingState === 'processing' ? t('initiatingTip') : `Send ${effectiveAmount} ETB with Telebirr`}
                            </Button>
                        </form>
                    )}

                    {/* Trust Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <ShieldCheck size={14} color="var(--primary)" />
                        <span>Secured via Telebirr Payment Gateway</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Powered by <strong style={{ color: 'var(--primary)' }}>GurshaPay</strong>
                </Link>
            </div>
        </div>
    );
}
