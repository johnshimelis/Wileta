import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle, Smartphone, Check, ShieldCheck,
    ArrowLeft, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import EthiopianFlag from '../components/EthiopianFlag';

export default function Onboarding() {
    const { user, onboard, requestTelebirrOtp, verifyTelebirrOtp } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // State for username & Telebirr phone
    const [username, setUsername] = useState(user?.username || '');
    const [telebirrInfo, setTelebirrInfo] = useState(() => {
        const raw = user?.telebirr_number || user?.phone || '';
        let clean = raw.replace(/[^0-9]/g, '');
        if (clean.startsWith('251')) clean = clean.substring(3);
        else if (clean.startsWith('0')) clean = clean.substring(1);
        return clean.slice(0, 9);
    });

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [devOtp, setDevOtp] = useState('');

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Keep username in sync if loaded from user
    useEffect(() => {
        if (user?.username && !username) {
            setUsername(user.username);
        }
    }, [user, username]);

    // Cooldown countdown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Handle back button navigation
    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/signup');
        }
    };

    // Clean phone number input (enforce 9 digits starting with 9 or 7)
    const handlePhoneChange = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.startsWith('251')) val = val.substring(3);
        else if (val.startsWith('0')) val = val.substring(1);
        val = val.slice(0, 9);
        setTelebirrInfo(val);
        if (isVerified) setIsVerified(false);
        if (otpSent) setOtpSent(false);
        if (error) setError('');
    };

    // Send OTP to user's Telebirr number
    const handleSendOtp = async () => {
        setError('');
        setSuccessMsg('');

        if (!telebirrInfo || telebirrInfo.length !== 9) {
            setError(t('invalidTelebirrError') || 'Please enter a valid 9-digit Ethiopian phone number (e.g. 911000000).');
            return;
        }

        const fullNumber = `+251${telebirrInfo}`;
        setOtpSending(true);

        try {
            const res = await requestTelebirrOtp(fullNumber);
            if (res.success) {
                setOtpSent(true);
                setResendCooldown(60);
                setSuccessMsg(res.message || t('telebirrOtpSentNotice') || 'Verification code sent to your phone via SMS.');
                if (res.devOtp) setDevOtp(res.devOtp);
            } else {
                setError(res.error || 'Failed to send verification code. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send verification code. Please try again.');
        } finally {
            setOtpSending(false);
        }
    };

    // Verify OTP code
    const handleVerifyOtp = async () => {
        setError('');
        setSuccessMsg('');

        if (!otp || otp.length !== 6) {
            setError(t('invalidOtpError') || 'Please enter the complete 6-digit verification code.');
            return;
        }

        const fullNumber = `+251${telebirrInfo}`;
        setVerifying(true);

        try {
            const res = await verifyTelebirrOtp(fullNumber, otp);
            if (res.success) {
                setIsVerified(true);
                setSuccessMsg(res.message || 'Telebirr number verified successfully! 🎉');
            } else {
                setError(res.error || 'Invalid verification code. Please check and try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    // Complete Onboarding Setup
    const handleOnboard = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError(t('usernameRequired') || 'Please choose a username.');
            return;
        }

        if (!telebirrInfo || telebirrInfo.length !== 9) {
            setError('Please enter a valid 9-digit Ethiopian phone number.');
            return;
        }

        const formattedPhone = `+251${telebirrInfo}`;

        setLoading(true);
        try {
            const res = await onboard({
                username: username.trim().toLowerCase(),
                phone: formattedPhone,
                telebirr_number: formattedPhone,
                bio: ''
            });

            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.error || 'Failed to complete profile setup.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during onboarding.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            background: 'var(--bg-color)',
            padding: '1.25rem 1rem',
            boxSizing: 'border-box'
        }}>
            {/* Top Navigation Bar: Back Icon ONLY on the left, Controls on the right */}
            <div style={{
                width: '100%',
                maxWidth: '460px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                {/* Clean Back Icon Button ONLY (No text/words) */}
                <button
                    type="button"
                    onClick={handleBack}
                    aria-label="Back"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '42px',
                        height: '42px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Go Back"
                >
                    <ArrowLeft size={20} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Centered Card */}
            <div style={{
                width: '100%',
                maxWidth: '460px',
                margin: 'auto 0',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                padding: '2.25rem 2rem',
                boxShadow: '0 14px 34px -10px rgba(0, 0, 0, 0.12), 0 4px 14px -2px rgba(0, 0, 0, 0.05)',
                boxSizing: 'border-box'
            }}>
                {/* Centered Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Logo size="large" />
                </div>

                {/* Header Titles */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <h1 style={{
                        fontSize: '1.65rem',
                        fontWeight: 900,
                        color: 'var(--text-main)',
                        marginBottom: '0.45rem',
                        letterSpacing: '-0.3px'
                    }}>
                        {t('onboardingTitle') || 'Complete Your Profile'}
                    </h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        margin: 0
                    }}>
                        {t('onboardingDesc') || 'Set up your creator account to start receiving tips directly to your Telebirr.'}
                    </p>
                </div>

                {/* Success Banner */}
                {successMsg && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid #10B981',
                        color: '#10B981',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        marginBottom: '1.25rem'
                    }}>
                        <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--danger-light, rgba(239, 68, 68, 0.12))',
                        border: '1px solid var(--danger, #EF4444)',
                        color: 'var(--danger, #EF4444)',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        marginBottom: '1.25rem'
                    }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleOnboard}>
                    {/* Choose Username Field */}
                    <div className="form-group" style={{ marginBottom: '1.35rem' }}>
                        <label className="form-label" style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
                            {t('chooseAUsername') || 'Choose a Username'}
                        </label>
                        <div className="input-group" style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontWeight: 900,
                                color: 'var(--primary)',
                                fontSize: '1.15rem'
                            }}>
                                @
                            </span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    paddingLeft: '2.5rem',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: '14px',
                                    boxSizing: 'border-box'
                                }}
                                required
                            />
                        </div>
                        <p style={{
                            fontSize: '0.82rem',
                            color: 'var(--primary)',
                            marginTop: '0.4rem',
                            fontWeight: 700
                        }}>
                            {t('yourTipLink') || 'Your tip link'}: gurshapay.com/@{username || 'yourname'}
                        </p>
                    </div>

                    {/* Telebirr Number Field (100% Full Width, ZERO Cropping!) */}
                    <div className="form-group" style={{ marginBottom: '1.35rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                            <label className="form-label" style={{ marginBottom: 0, fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                {t('yourTelebirrNumber') || 'Your Telebirr Number'}
                            </label>
                            {isVerified && (
                                <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <ShieldCheck size={16} /> {t('telebirrVerifiedBadge') || 'Verified'}
                                </span>
                            )}
                        </div>

                        {/* Full Width Phone Input Container */}
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            height: '52px',
                            background: 'var(--bg-input, var(--card-bg))',
                            border: '1.5px solid var(--border-color)',
                            borderRadius: '14px',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}>
                            {/* Ethiopian Flag & +251 Country Code */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0 0.85rem',
                                height: '100%',
                                background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.03))',
                                borderRight: '1px solid var(--border-color)',
                                flexShrink: 0,
                                userSelect: 'none'
                            }}>
                                <EthiopianFlag width={22} height={15} />
                                <span style={{
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    color: 'var(--text-main)',
                                    letterSpacing: '0.5px'
                                }}>
                                    +251
                                </span>
                            </div>

                            {/* 9-digit Phone Input: Never Cropped! */}
                            <input
                                type="tel"
                                inputMode="numeric"
                                className="form-input"
                                placeholder="911000000"
                                value={telebirrInfo}
                                onChange={handlePhoneChange}
                                maxLength={9}
                                disabled={isVerified}
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    padding: '0 0.85rem',
                                    fontSize: '1.15rem',
                                    fontWeight: 800,
                                    letterSpacing: '2px',
                                    color: 'var(--text-main)',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Send / Resend OTP Action Button */}
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpSending || resendCooldown > 0 || isVerified || telebirrInfo.length !== 9}
                            style={{
                                width: '100%',
                                height: '46px',
                                marginTop: '0.65rem',
                                background: isVerified
                                    ? '#10B981'
                                    : (telebirrInfo.length === 9 && resendCooldown === 0
                                        ? 'var(--card-bg-subtle, #E2E8F0)'
                                        : 'var(--card-bg-subtle, #F1F5F9)'),
                                color: isVerified ? '#FFFFFF' : 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                cursor: (telebirrInfo.length === 9 && resendCooldown === 0 && !otpSending) ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {isVerified ? (
                                <><Check size={18} /> {t('telebirrVerifiedBadge') || 'Telebirr Verified'}</>
                            ) : otpSending ? (
                                <span className="spinner"></span>
                            ) : resendCooldown > 0 ? (
                                <span>{t('resendIn') || 'Resend code in'} {resendCooldown}s</span>
                            ) : (
                                <>📲 {t('sendOtp') || 'Send OTP'}</>
                            )}
                        </button>
                    </div>

                    {/* OTP Input & Verification Section */}
                    {otpSent && !isVerified && (
                        <div className="form-group" style={{
                            marginBottom: '1.35rem',
                            padding: '1rem',
                            background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.02))',
                            borderRadius: '16px',
                            border: '1px dashed var(--border-color)'
                        }}>
                            <label className="form-label" style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
                                {t('otpCodeLabel') || 'Verification Code (OTP)'}
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Smartphone size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                        maxLength={6}
                                        style={{
                                            width: '100%',
                                            height: '50px',
                                            paddingLeft: '2.5rem',
                                            letterSpacing: otp ? '6px' : 'normal',
                                            fontWeight: 800,
                                            fontSize: '1.2rem',
                                            textAlign: 'center',
                                            boxSizing: 'border-box',
                                            borderRadius: '12px'
                                        }}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={verifying || otp.length !== 6}
                                    style={{
                                        width: '100%',
                                        height: '46px',
                                        background: otp.length === 6 ? '#10B981' : 'var(--border-color)',
                                        color: otp.length === 6 ? '#FFFFFF' : 'var(--text-muted)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 800,
                                        fontSize: '0.95rem',
                                        cursor: otp.length === 6 && !verifying ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.45rem',
                                        boxShadow: otp.length === 6 ? '0 3px 10px rgba(16, 185, 129, 0.3)' : 'none',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {verifying ? <span className="spinner"></span> : <><Check size={18} /> {t('verifyOtp') || 'Verify Code'}</>}
                                </button>
                            </div>

                            {devOtp && (
                                <div style={{ marginTop: '0.45rem', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                                    ℹ️ Test Verification Code: {devOtp}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Complete Setup Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '52px',
                            background: 'var(--primary)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '14px',
                            fontWeight: 900,
                            fontSize: '1.05rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                            transition: 'all 0.15s ease',
                            marginTop: '0.75rem'
                        }}
                    >
                        {loading ? <span className="spinner"></span> : (t('completeSetup') || 'Complete Setup')}
                    </button>
                </form>
            </div>

            {/* Bottom Financial Compliance Badge */}
            <div style={{
                textAlign: 'center',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                marginTop: '1.25rem'
            }}>
                <span>🔒 Secured by GurshaPay Financial Compliance •</span>
                <EthiopianFlag width={18} height={12} />
                <span>Ethiopia</span>
            </div>
        </div>
    );
}
