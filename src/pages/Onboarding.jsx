import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle, Smartphone, Check, ShieldCheck,
    ArrowLeft, User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import EthiopianFlag from '../components/EthiopianFlag';

export default function Onboarding() {
    const { user, setUser, onboard, requestTelebirrOtp, verifyTelebirrOtp, logout, api } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Step state: 2 = Creator Profile (Username & Telebirr), 1 = Edit Account Details (Name, Email, Password)
    const [step, setStep] = useState(2);

    // Step 1: Account Details editing state
    const [accountName, setAccountName] = useState(user?.name || '');
    const [accountEmail, setAccountEmail] = useState(user?.email || '');
    const [accountPassword, setAccountPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [savingAccount, setSavingAccount] = useState(false);

    // Step 2: Creator Profile & Telebirr state
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

    // Keep state in sync with loaded user
    useEffect(() => {
        if (user) {
            if (!accountName && user.name) setAccountName(user.name);
            if (!accountEmail && user.email) setAccountEmail(user.email);
            if (!username && user.username) setUsername(user.username);
        }
    }, [user]);

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

    // Save edited account details (Step 1 -> Step 2)
    const handleSaveAccountDetails = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!accountName.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!accountEmail.trim()) {
            setError('Please enter your email address.');
            return;
        }

        if (accountPassword && accountPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setSavingAccount(true);
        try {
            const payload = {
                name: accountName.trim(),
                email: accountEmail.trim().toLowerCase()
            };
            if (accountPassword) {
                payload.password = accountPassword;
            }

            const res = await api.post('/auth/update-profile', payload);
            if (res.data) {
                if (typeof setUser === 'function') setUser(res.data);
                localStorage.setItem('gp_cached_user', JSON.stringify(res.data));
                setSuccessMsg('Account details updated successfully!');
                setAccountPassword('');
                setTimeout(() => {
                    setSuccessMsg('');
                    setStep(2);
                }, 800);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update account credentials');
        } finally {
            setSavingAccount(false);
        }
    };

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

    // Onboard Submit Handler (Finalizes Step 2)
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
                setError(t('verifyTelebirrFirst') || 'Please click "Send Verification Code" and verify your Telebirr number before proceeding.');
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

    const handleRestartSignup = async () => {
        if (window.confirm('Do you want to log out and create another account from scratch?')) {
            await logout();
            navigate('/signup');
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
            padding: '1.25rem 1rem',
            boxSizing: 'border-box'
        }}>
            {/* Top Navigation Bar with Back Action & Controls */}
            <div style={{
                width: '100%',
                maxWidth: '480px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
            }}>
                {step === 2 ? (
                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setSuccessMsg('');
                            setStep(1);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '10px',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: 'var(--shadow-xs)'
                        }}
                        title="Go back to Step 1 to change Name, Email, or Password"
                    >
                        <ArrowLeft size={16} />
                        <span>Step 1: Edit Account</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setSuccessMsg('');
                            setStep(2);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '10px',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: 'var(--shadow-xs)'
                        }}
                    >
                        <ArrowLeft size={16} />
                        <span>Return to Step 2</span>
                    </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Centered Card */}
            <div style={{
                width: '100%',
                maxWidth: '480px',
                margin: 'auto 0',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2rem 1.75rem',
                boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
                boxSizing: 'border-box',
                position: 'relative'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Logo size="large" />
                </div>

                {/* 2-Step Progress Indicator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    padding: '0.4rem 0.6rem',
                    background: 'var(--card-bg-subtle, rgba(255, 255, 255, 0.04))',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                }}>
                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setSuccessMsg('');
                            setStep(1);
                        }}
                        style={{
                            background: step === 1 ? 'var(--primary)' : 'transparent',
                            color: step === 1 ? '#FFFFFF' : 'var(--text-muted)',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        1. Account Credentials
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>➔</span>
                    <button
                        type="button"
                        onClick={() => {
                            setError('');
                            setSuccessMsg('');
                            setStep(2);
                        }}
                        style={{
                            background: step === 2 ? 'var(--primary)' : 'transparent',
                            color: step === 2 ? '#FFFFFF' : 'var(--text-muted)',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        2. Creator Profile
                    </button>
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
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
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
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        marginBottom: '1.25rem'
                    }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* ============================================================== */}
                {/* STEP 1: EDIT ACCOUNT DETAILS (NAME, EMAIL, PASSWORD) */}
                {/* ============================================================== */}
                {step === 1 && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                Edit Account Details
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.45 }}>
                                Correct any mistake in your full name, email address, or update your password before finalizing your creator setup.
                            </p>
                        </div>

                        <form onSubmit={handleSaveAccountDetails}>
                            {/* Full Name */}
                            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                    Full Name
                                </label>
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <User size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. John Shimelis"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        style={{ width: '100%', height: '48px', paddingLeft: '2.5rem', fontSize: '0.95rem', fontWeight: 600, boxSizing: 'border-box' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                    Email Address
                                </label>
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="your.email@example.com"
                                        value={accountEmail}
                                        onChange={(e) => setAccountEmail(e.target.value)}
                                        style={{ width: '100%', height: '48px', paddingLeft: '2.5rem', fontSize: '0.95rem', fontWeight: 600, boxSizing: 'border-box' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                    Change Password <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.75rem' }}>(Leave blank to keep unchanged)</span>
                                </label>
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="Enter new password (min. 6 characters)"
                                        value={accountPassword}
                                        onChange={(e) => setAccountPassword(e.target.value)}
                                        style={{ width: '100%', height: '48px', paddingLeft: '2.5rem', paddingRight: '2.5rem', fontSize: '0.95rem', fontWeight: 600, boxSizing: 'border-box' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '0.85rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                disabled={savingAccount}
                                style={{
                                    width: '100%',
                                    height: '48px',
                                    background: 'var(--primary)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    cursor: savingAccount ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                                    transition: 'all 0.15s ease',
                                    marginBottom: '0.75rem'
                                }}
                            >
                                {savingAccount ? <span className="spinner"></span> : (
                                    <>Save & Continue to Profile (Step 2) <ArrowRight size={18} /></>
                                )}
                            </button>

                            {/* Log out / Switch Account */}
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={handleRestartSignup}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Wrong account? Log out and start sign up over
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ============================================================== */}
                {/* STEP 2: CREATOR PROFILE & TELEBIRR (NO CROPPING!) */}
                {/* ============================================================== */}
                {step === 2 && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                {t('onboardingTitle')}
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.45 }}>
                                {t('onboardingDesc2')}
                            </p>
                            
                            {/* Fast-switch back to Step 1 hint badge */}
                            <div style={{ marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    Signed in as <strong>{user?.name || 'Creator'}</strong> ({user?.email || ''}) •{' '}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError('');
                                        setSuccessMsg('');
                                        setStep(1);
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--primary)',
                                        fontSize: '0.78rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        padding: 0
                                    }}
                                >
                                    Change Credentials ✏️
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleOnboard}>
                            {/* Choose Username */}
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                    {t('chooseAUsername')}
                                </label>
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                                        @
                                    </span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                        style={{ width: '100%', height: '48px', paddingLeft: '2.5rem', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
                                        required
                                    />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.35rem', fontWeight: 700 }}>
                                    {t('yourTipLink')}: gurshapay.com/@{username || 'yourname'}
                                </p>
                            </div>

                            {/* Telebirr Number Section (100% Full Width - NEVER Cropped!) */}
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                                    <label className="form-label" style={{ marginBottom: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                                        {t('yourTelebirrNumber')}
                                    </label>
                                    {isVerified && (
                                        <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <ShieldCheck size={16} /> {t('telebirrVerifiedBadge') || 'Verified'}
                                        </span>
                                    )}
                                </div>

                                {/* Full 100% Width Phone Input Box */}
                                <div className="input-group" style={{ position: 'relative', width: '100%', marginBottom: isVerified ? '0' : '0.65rem' }}>
                                    <span style={{
                                        position: 'absolute',
                                        left: '0.9rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontWeight: 800,
                                        color: 'var(--text-muted)',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        pointerEvents: 'none',
                                        zIndex: 2
                                    }}>
                                        <EthiopianFlag width={22} height={15} /> +251
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
                                        style={{
                                            width: '100%',
                                            height: '52px',
                                            paddingLeft: '5.4rem',
                                            fontSize: '1.15rem',
                                            fontWeight: 800,
                                            letterSpacing: telebirrInfo ? '2px' : 'normal',
                                            boxSizing: 'border-box',
                                            borderRadius: '12px'
                                        }}
                                        required
                                    />
                                </div>

                                {/* Send / Resend OTP Action Button (Full Width on its own row) */}
                                {!isVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpSending || resendCooldown > 0 || telebirrInfo.length !== 9}
                                        style={{
                                            width: '100%',
                                            height: '46px',
                                            background: resendCooldown > 0 || telebirrInfo.length !== 9
                                                ? 'var(--border-color)'
                                                : 'var(--primary)',
                                            color: (resendCooldown === 0 && telebirrInfo.length === 9) ? '#FFFFFF' : 'var(--text-muted)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            cursor: resendCooldown > 0 || telebirrInfo.length !== 9 ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.45rem',
                                            transition: 'all 0.15s ease',
                                            boxShadow: (resendCooldown === 0 && telebirrInfo.length === 9) ? '0 3px 10px rgba(5, 150, 105, 0.25)' : 'none'
                                        }}
                                    >
                                        {otpSending ? (
                                            <span className="spinner"></span>
                                        ) : resendCooldown > 0 ? (
                                            `${t('resendIn') || 'Resend in'} ${resendCooldown}s`
                                        ) : otpSent ? (
                                            `↻ ${t('resendOtp') || 'Resend Verification Code'}`
                                        ) : (
                                            `📲 ${t('sendOtp') || 'Send Verification Code (OTP)'}`
                                        )}
                                    </button>
                                )}

                                {/* Verified Status Banner */}
                                {isVerified && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: '0.5rem',
                                        padding: '0.65rem 0.85rem',
                                        background: 'rgba(16, 185, 129, 0.12)',
                                        border: '1px solid rgba(16, 185, 129, 0.35)',
                                        borderRadius: '10px',
                                        color: '#059669',
                                        fontSize: '0.85rem',
                                        fontWeight: 800
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                            <ShieldCheck size={18} />
                                            <span>Telebirr Verified (+251 {telebirrInfo})</span>
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
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
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
                                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                        {t('otpCodeLabel') || 'Verification Code (OTP)'}
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div className="input-group" style={{ position: 'relative', width: '100%' }}>
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

                            {/* Complete Setup Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    background: 'var(--primary)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 900,
                                    fontSize: '1rem',
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
                )}
            </div>

            {/* Bottom Compliance Badge */}
            <div style={{
                textAlign: 'center',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                marginTop: '1rem'
            }}>
                <span>🔒 Secured by GurshaPay Financial Compliance •</span>
                <EthiopianFlag width={18} height={12} />
                <span>Ethiopia</span>
            </div>
        </div>
    );
}
