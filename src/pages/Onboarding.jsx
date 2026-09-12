import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Smartphone, Check, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

export default function Onboarding() {
    const { user, onboard, requestTelebirrOtp, verifyTelebirrOtp } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

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

    // Send OTP Handler
    const handleSendOtp = async () => {
        setError('');
        setSuccessMsg('');
        const cleanDigits = telebirrInfo.replace(/[^0-9]/g, '');
        if (cleanDigits.length !== 9 || (!cleanDigits.startsWith('9') && !cleanDigits.startsWith('7'))) {
            setError('Please enter a valid Ethiopian Telebirr number (e.g. 911000000 or 711000000).');
            return;
        }

        setOtpSending(true);
        const res = await requestTelebirrOtp(`0${cleanDigits}`);
        setOtpSending(false);

        if (res.success) {
            setOtpSent(true);
            setResendCooldown(60);
            setSuccessMsg(res.message || t('telebirrOtpSentNotice') || 'Verification code sent to your phone via SMS');
            if (res.devOtp) setDevOtp(res.devOtp);
        } else {
            setError(res.error || 'Failed to send verification code. Please try again.');
        }
    };

    // Verify OTP Handler
    const handleVerifyOtp = async () => {
        setError('');
        setSuccessMsg('');
        const cleanDigits = telebirrInfo.replace(/[^0-9]/g, '');
        if (cleanDigits.length !== 9) {
            setError('Invalid phone number.');
            return;
        }
        if (!otp || otp.trim().length !== 6) {
            setError('Please enter the complete 6-digit verification code.');
            return;
        }

        setVerifying(true);
        const res = await verifyTelebirrOtp(`0${cleanDigits}`, otp.trim());
        setVerifying(false);

        if (res.success) {
            setIsVerified(true);
            setSuccessMsg('Telebirr phone number verified successfully!');
        } else {
            setError(res.error || 'Invalid verification code. Please check and try again.');
        }
    };

    // Onboard Submit Handler
    const handleOnboard = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!username.trim()) {
            setError('Please choose your username handle.');
            return;
        }

        const cleanDigits = telebirrInfo.replace(/[^0-9]/g, '');
        if (cleanDigits.length !== 9 || (!cleanDigits.startsWith('9') && !cleanDigits.startsWith('7'))) {
            setError('Please enter a valid Ethiopian Telebirr number (e.g. 911000000 or 711000000).');
            return;
        }

        if (!isVerified) {
            if (!otpSent) {
                setError(t('verifyTelebirrFirst') || 'Please click "Send OTP" and verify your Telebirr number before proceeding.');
            } else {
                setError('Please enter the 6-digit verification code and click "Verify" before proceeding.');
            }
            return;
        }

        setLoading(true);

        const res = await onboard({
            username: username.trim().toLowerCase(),
            telebirr_number: `0${cleanDigits}`,
            otp: otp || undefined
        });

        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error || 'Failed to complete profile setup');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 1.25rem', boxSizing: 'border-box' }}>
            {/* Top Bar with Language & Theme Controls */}
            <div style={{ width: '100%', maxWidth: '460px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {/* Centered Modal Card */}
            <div style={{
                width: '100%',
                maxWidth: '460px',
                margin: 'auto 0',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
                boxSizing: 'border-box'
            }}>
                {/* Logo INSIDE Card */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Logo size="large" />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        {t('onboardingTitle')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {t('onboardingDesc2')}
                    </p>
                </div>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {successMsg && !error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#059669', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                        <Check size={16} style={{ flexShrink: 0 }} />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleOnboard}>
                    {/* Choose Username */}
                    <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                        <label className="form-label">{t('chooseUsernameLabel')}</label>
                        <div className="input-group">
                            <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>@</span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="yourname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                            {t('yourTipLink')}: gurshapay.com/@{username || 'yourname'}
                        </p>
                    </div>

                    {/* Telebirr Number with Send OTP Button */}
                    <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                        <label className="form-label">{t('yourTelebirrNumber')}</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <span>🇪🇹</span> +251
                                </span>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="911000000"
                                    value={telebirrInfo}
                                    disabled={isVerified}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                        if (val.startsWith('0')) val = val.substring(1);
                                        setTelebirrInfo(val.slice(0, 9));
                                        if (isVerified) setIsVerified(false);
                                        if (otpSent) setOtpSent(false);
                                    }}
                                    maxLength={9}
                                    style={{ paddingLeft: '5.5rem' }}
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpSending || resendCooldown > 0 || isVerified || telebirrInfo.length !== 9}
                                style={{
                                    padding: '0 1rem',
                                    height: '46px',
                                    background: isVerified
                                        ? '#10B981'
                                        : (resendCooldown > 0 || telebirrInfo.length !== 9 ? 'var(--border-color)' : 'var(--primary)'),
                                    color: isVerified || (resendCooldown === 0 && telebirrInfo.length === 9) ? '#FFFFFF' : 'var(--text-muted)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.825rem',
                                    cursor: isVerified || resendCooldown > 0 || telebirrInfo.length !== 9 ? 'not-allowed' : 'pointer',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0
                                }}
                            >
                                {isVerified ? (
                                    <><Check size={16} /> {t('telebirrVerifiedBadge') || 'Verified'}</>
                                ) : otpSending ? (
                                    <span className="spinner"></span>
                                ) : resendCooldown > 0 ? (
                                    `${t('resendIn') || 'Resend in'} ${resendCooldown}s`
                                ) : otpSent ? (
                                    t('resendOtp') || 'Resend Code'
                                ) : (
                                    t('sendOtp') || 'Send OTP'
                                )}
                            </button>
                        </div>

                        {/* Verified Status Banner */}
                        {isVerified && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '8px',
                                color: '#059669',
                                fontSize: '0.825rem',
                                fontWeight: 700
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <ShieldCheck size={16} />
                                    <span>{t('telebirrVerifiedBadge') || 'Telebirr Verified'} (+251 {telebirrInfo})</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsVerified(false);
                                        setOtpSent(false);
                                        setOtp('');
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Additional OTP Box and Verify Button (Shown after OTP is sent) */}
                    {otpSent && !isVerified && (
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label">{t('otpCodeLabel') || 'Verification Code (OTP)'}</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Smartphone size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder={t('otpPlaceholder') || "Enter 6-digit code"}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                        maxLength={6}
                                        style={{
                                            paddingLeft: '2.5rem',
                                            letterSpacing: otp ? '4px' : 'normal',
                                            fontWeight: 700,
                                            fontSize: '1rem'
                                        }}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={verifying || otp.length !== 6}
                                    style={{
                                        padding: '0 1.25rem',
                                        height: '46px',
                                        background: otp.length === 6 ? 'var(--primary)' : 'var(--border-color)',
                                        color: otp.length === 6 ? '#FFFFFF' : 'var(--text-muted)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        cursor: otp.length === 6 && !verifying ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        boxShadow: otp.length === 6 ? '0 2px 8px rgba(5, 150, 105, 0.25)' : 'none',
                                        transition: 'all 0.15s ease',
                                        flexShrink: 0
                                    }}
                                >
                                    {verifying ? <span className="spinner"></span> : <><Check size={16} /> {t('verifyOtp') || 'Verify'}</>}
                                </button>
                            </div>

                            {devOtp && (
                                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                                    ℹ️ Test Verification Code: {devOtp}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Complete Setup Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '46px',
                            background: isVerified ? 'var(--primary)' : 'var(--primary)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                            transition: 'all 0.15s ease',
                            marginTop: '0.5rem'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? <span className="spinner"></span> : (t('completeSetup') || 'Complete Setup')}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 Secured by GurshaPay Financial Compliance • 🇪🇹 Ethiopia
            </div>
        </div>
    );
}
