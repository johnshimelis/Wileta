import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Lock, Eye, EyeOff, CheckCircle, AlertCircle,
    ArrowLeft, Send, Phone, Mail, Smartphone, KeyRound,
    RefreshCw, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import EthiopianFlag from '../components/EthiopianFlag';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import ComplianceBadge from '../components/ComplianceBadge';

export default function ResetPassword() {
    const { token: urlToken } = useParams();
    const { api } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const locationIdentifier = location.state?.identifier || '';
    const locationMethod = location.state?.method || (locationIdentifier.includes('@') ? 'email' : 'phone');
    const cleanPhone = locationMethod === 'phone' ? locationIdentifier.replace(/^(\+251|251|0)/, '') : '';
    const cleanEmail = locationMethod === 'email' ? locationIdentifier : '';

    // Reset channel selection: 'phone' (SMS + Telegram) vs 'email'
    const [resetMethod, setResetMethod] = useState(locationMethod);
    
    // Step state: 1 = Request Code, 2 = Enter Code & New Password, 3 = Success
    const [step, setStep] = useState((urlToken || locationIdentifier) ? 2 : 1);

    // Form inputs
    const [phone, setPhone] = useState(cleanPhone);
    const [email, setEmail] = useState(cleanEmail);
    const [otpCode, setOtpCode] = useState(urlToken || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Status states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(locationIdentifier ? 'Verification code sent to your linked channels.' : '');
    const [deliveredInfo, setDeliveredInfo] = useState(null);
    const [resendCountdown, setResendCountdown] = useState(locationIdentifier ? 60 : 0);

    // Synchronize urlToken or location state if present
    useEffect(() => {
        if (urlToken) {
            setOtpCode(urlToken);
            setStep(2);
        } else if (location.state?.identifier) {
            const id = location.state.identifier;
            const m = location.state.method || (id.includes('@') ? 'email' : 'phone');
            setResetMethod(m);
            if (m === 'phone') {
                setPhone(id.replace(/^(\+251|251|0)/, ''));
            } else {
                setEmail(id);
            }
            setStep(2);
            if (!successMessage) {
                setSuccessMessage('Verification code sent to your linked channels.');
            }
        }
    }, [urlToken, location.state]);

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    // Step 1: Request Password Reset Code (Dispatches to SMS + Telegram + Email)
    const handleRequestCode = async (e) => {
        e?.preventDefault();
        setError('');
        setSuccessMessage('');

        const identifier = resetMethod === 'phone' ? phone : email;
        if (!identifier) {
            setError(resetMethod === 'phone' ? 'Please enter your registered phone number' : 'Please enter your registered email');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                identifier,
                channel: resetMethod === 'phone' ? 'sms' : 'email'
            };

            const res = await api.post('/auth/forgot-password', payload);
            setDeliveredInfo(res.data);
            setSuccessMessage(res.data.message || 'Reset code sent successfully!');
            setResendCountdown(60);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset code. Please check your input and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Submit New Password with 6-digit OTP or Token
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (!otpCode || !otpCode.trim()) {
            setError('Please enter the 6-digit verification code');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const identifier = resetMethod === 'phone' ? (phone ? `0${phone}` : undefined) : (email || undefined);
            
            // Send payload with token/code
            if (urlToken) {
                await api.post(`/auth/reset-password/${urlToken}`, { password });
            } else {
                await api.post('/auth/reset-password', {
                    identifier,
                    code: otpCode.trim(),
                    token: otpCode.trim(),
                    password
                });
            }

            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Code may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.75rem 1.25rem',
            boxSizing: 'border-box',
            width: '100%'
        }}>
            {/* Top Navigation Bar */}
            <div style={{
                width: '100%',
                maxWidth: '460px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    aria-label="Back to Sign In"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.2s ease'
                    }}
                    title="Back to Sign In"
                >
                    <ArrowLeft size={19} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Card Container */}
            <div style={{
                width: '100%',
                maxWidth: '460px',
                margin: 'auto 0',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '2rem 1.75rem',
                boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.08)',
                boxSizing: 'border-box'
            }}>
                {/* Brand Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Logo size="large" />
                </div>

                {/* STEP 3: SUCCESS STATE */}
                {step === 3 ? (
                    <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            border: '2px solid rgba(16, 185, 129, 0.3)'
                        }}>
                            <CheckCircle size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                            Password Reset Successful!
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                            Your password has been securely updated. You can now sign in to your GurshaPay account with your new password.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            className="btn-full"
                            onClick={() => navigate('/login')}
                            style={{ height: '48px', fontWeight: 700 }}
                        >
                            Sign In to GurshaPay
                        </Button>
                    </div>
                ) : (
                    <div>
                        {/* Header Title */}
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(5, 150, 105, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '0.65rem'
                            }}>
                                <KeyRound size={13} /> Account Recovery
                            </div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                                {step === 1 ? 'Reset Your Password' : 'Set New Password'}
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.45 }}>
                                {step === 1
                                    ? 'Select how you want to receive your 6-digit verification code:'
                                    : 'Enter the 6-digit code sent to your linked channels and your new password.'
                                }
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'var(--danger-light, rgba(239, 68, 68, 0.1))',
                                border: '1px solid var(--danger, #EF4444)',
                                color: 'var(--danger, #EF4444)',
                                borderRadius: '10px',
                                padding: '0.75rem 1rem',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                marginBottom: '1.25rem'
                            }}>
                                <AlertCircle size={17} style={{ flexShrink: 0 }} />
                                <div>{error}</div>
                            </div>
                        )}

                        {/* Success Notification Alert */}
                        {successMessage && step === 2 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid #10B981',
                                color: '#059669',
                                borderRadius: '10px',
                                padding: '0.75rem 1rem',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                marginBottom: '1.25rem'
                            }}>
                                <CheckCircle size={17} style={{ flexShrink: 0 }} />
                                <div>{successMessage}</div>
                            </div>
                        )}

                        {/* STEP 1: REQUEST CODE (Method Selection) */}
                        {step === 1 && (
                            <div>
                                {/* Channel Tabs */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.35rem',
                                    background: 'var(--card-bg-subtle, rgba(0,0,0,0.04))',
                                    padding: '0.3rem',
                                    borderRadius: '10px',
                                    marginBottom: '1.5rem',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => { setResetMethod('phone'); setError(''); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.45rem',
                                            padding: '0.65rem 0.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: resetMethod === 'phone' ? 'var(--card-bg)' : 'transparent',
                                            color: resetMethod === 'phone' ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: 700,
                                            fontSize: '0.825rem',
                                            cursor: 'pointer',
                                            boxShadow: resetMethod === 'phone' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <Smartphone size={16} /> SMS & Telegram
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setResetMethod('email'); setError(''); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.45rem',
                                            padding: '0.65rem 0.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: resetMethod === 'email' ? 'var(--card-bg)' : 'transparent',
                                            color: resetMethod === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: 700,
                                            fontSize: '0.825rem',
                                            cursor: 'pointer',
                                            boxShadow: resetMethod === 'email' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <Mail size={16} /> Email Link
                                    </button>
                                </div>

                                <form onSubmit={handleRequestCode}>
                                    {resetMethod === 'phone' ? (
                                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Registered Phone Number</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>SMS + Telegram</span>
                                            </label>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: '46px',
                                                background: 'var(--card-bg)',
                                                border: '1.5px solid var(--border-color)',
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                transition: 'all 0.15s ease'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0 0.85rem',
                                                    height: '100%',
                                                    background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.03))',
                                                    borderRight: '1px solid var(--border-color)',
                                                    userSelect: 'none'
                                                }}>
                                                    <EthiopianFlag width={20} height={14} />
                                                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>+251</span>
                                                </div>
                                                <input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    placeholder="911000000"
                                                    value={phone}
                                                    onChange={e => {
                                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                                        if (val.startsWith('0')) val = val.substring(1);
                                                        setPhone(val.slice(0, 9));
                                                        setError('');
                                                    }}
                                                    maxLength={9}
                                                    style={{
                                                        flex: 1,
                                                        height: '100%',
                                                        border: 'none',
                                                        outline: 'none',
                                                        background: 'transparent',
                                                        padding: '0 0.85rem',
                                                        fontSize: '1rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '1px',
                                                        color: 'var(--text-main)'
                                                    }}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: 0 }}>
                                                We'll send the 6-digit code via SMS and directly to Telegram if linked.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                            <label className="form-label">{t('emailAddress') || 'Email Address'}</label>
                                            <div className="input-group">
                                                <Mail size={18} />
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: 0 }}>
                                                We'll send a password reset code and direct link to your inbox.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="btn-full"
                                        loading={loading}
                                        icon={Send}
                                        style={{ height: '46px', fontWeight: 700 }}
                                    >
                                        Send Verification Code
                                    </Button>

                                    {/* Link for users who already have an OTP */}
                                    <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => { setStep(2); setError(''); }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--primary)',
                                                fontSize: '0.825rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            Already have a 6-digit code? Enter it here
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* STEP 2: ENTER OTP & NEW PASSWORD */}
                        {step === 2 && (
                            <form onSubmit={handleResetPassword}>
                                {!urlToken && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1.25rem'
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => { setStep(1); setError(''); }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                color: 'var(--text-muted)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <ArrowLeft size={14} /> Change phone/email
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleRequestCode}
                                            disabled={resendCountdown > 0 || loading}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                color: resendCountdown > 0 ? 'var(--text-muted)' : 'var(--primary)',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <RefreshCw size={13} className={loading ? 'spin' : ''} />
                                            {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code'}
                                        </button>
                                    </div>
                                )}

                                {/* 6-Digit OTP Input */}
                                {!urlToken && (
                                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>6-Digit Verification Code</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Check SMS / Telegram / Email</span>
                                        </label>
                                        <div className="input-group">
                                            <KeyRound size={18} />
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="form-input"
                                                placeholder="123456"
                                                value={otpCode}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    setOtpCode(val.slice(0, 6));
                                                    setError('');
                                                }}
                                                maxLength={6}
                                                style={{ letterSpacing: '4px', fontWeight: 800, fontSize: '1.1rem' }}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* New Password Field */}
                                <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                                    <label className="form-label">New Password</label>
                                    <div className="input-group">
                                        <Lock size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-input"
                                            placeholder="At least 6 characters"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '0.85rem',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex'
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label">Confirm New Password</label>
                                    <div className="input-group">
                                        <Lock size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-input"
                                            placeholder="Repeat new password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="btn-full"
                                    loading={loading}
                                    style={{ height: '46px', fontWeight: 700 }}
                                >
                                    Update Password
                                </Button>
                            </form>
                        )}
                    </div>
                )}
            </div>

            <ComplianceBadge />
        </div>
    );
}
