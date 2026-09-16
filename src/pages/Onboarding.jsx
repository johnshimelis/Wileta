import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle, Smartphone, Check, ShieldCheck,
    ArrowLeft, CheckCircle2, User, Mail, Lock, Eye, EyeOff,
    ArrowRight, Send, Globe, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import EthiopianFlag from '../components/EthiopianFlag';
import ComplianceBadge from '../components/ComplianceBadge';

export default function Onboarding() {
    const { user, setUser, onboard, requestTelebirrOtp, verifyTelebirrOtp, logout, api } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // If user is already fully onboarded, redirect straight to dashboard
    useEffect(() => {
        if (user?.isOnboarded) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Step state: 2 = Creator Profile (Username & Telebirr), 1 = Account Credentials (Name, Email, Password)
    const [step, setStep] = useState(2);

    // Step 1: Account Credentials State
    const [accountName, setAccountName] = useState(() => {
        try {
            const cached = JSON.parse(localStorage.getItem('gp_temp_signup') || '{}');
            return user?.name || cached.name || '';
        } catch (_) {
            return user?.name || '';
        }
    });

    const [accountEmail, setAccountEmail] = useState(() => {
        try {
            const cached = JSON.parse(localStorage.getItem('gp_temp_signup') || '{}');
            return user?.email || cached.email || '';
        } catch (_) {
            return user?.email || '';
        }
    });

    const [accountPassword, setAccountPassword] = useState('');
    const [accountConfirmPassword, setAccountConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [savingAccount, setSavingAccount] = useState(false);

    // Step 2: Creator Profile State
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

    // Sync state when user loads
    useEffect(() => {
        if (user) {
            if (!accountName && user.name) setAccountName(user.name);
            if (!accountEmail && user.email) setAccountEmail(user.email);
            if (!username && user.username) setUsername(user.username);
        }
    }, [user]);

    // Resend cooldown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Clean back button handler
    const handleBack = () => {
        setError('');
        setSuccessMsg('');
        if (step === 2) {
            setStep(1);
        } else {
            if (typeof logout === 'function') logout();
            navigate('/signup', { replace: true });
        }
    };

    // Save edited Step 1 Account Credentials
    const handleSaveAccountCredentials = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!accountName.trim()) {
            setError(t('nameRequired') || 'Please enter your full name.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!accountEmail.trim() || !emailRegex.test(accountEmail.trim())) {
            setError('Please enter a valid email address.');
            return;
        }

        if (accountPassword) {
            if (accountPassword.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (accountPassword !== accountConfirmPassword) {
                setError('Passwords do not match. Please re-enter your password.');
                return;
            }
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
                if (typeof setUser === 'function') {
                    setUser(res.data);
                }
                localStorage.setItem('gp_cached_user', JSON.stringify(res.data));
            }

            localStorage.setItem('gp_temp_signup', JSON.stringify({
                name: accountName.trim(),
                email: accountEmail.trim().toLowerCase()
            }));

            setSuccessMsg('Account details saved successfully! 🎉');
            setTimeout(() => {
                setSuccessMsg('');
                setStep(2);
            }, 450);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update account details. Please try again.');
        } finally {
            setSavingAccount(false);
        }
    };

    // Clean Telebirr phone number input (9 digits)
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

    // Request Telebirr OTP
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

    // Verify Telebirr OTP
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
                setSuccessMsg(res.message || 'Phone number verified successfully! 🎉');
            } else {
                setError(res.error || 'Invalid verification code. Please check and try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    // Finalize Profile Setup & Onboard User
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
                localStorage.removeItem('gp_temp_signup');
                // Use { replace: true } so pressing hardware back button on phone NEVER goes back to onboarding!
                navigate('/dashboard', { replace: true });
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
            minHeight: '100dvh',
            width: '100%',
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* 1. STICKY TOP NAVIGATION BAR (Always visible, never scrolls out of screen) */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                width: '100%',
                background: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
            }}>
                <div style={{
                    maxWidth: '560px',
                    margin: '0 auto',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                }}>
                    {/* Clean round back icon button */}
                    <button
                        type="button"
                        onClick={handleBack}
                        aria-label="Back"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            flexShrink: 0
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        title={step === 2 ? "Go back to Step 1: Account Credentials" : "Back to Sign Up"}
                    >
                        <ArrowLeft size={19} />
                    </button>

                    {/* Step indicator pill */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        background: 'var(--card-bg-subtle)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        letterSpacing: '0.02em'
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: step === 2 ? '#10B981' : 'var(--primary)'
                        }}></span>
                        <span>{step === 2 ? 'STEP 2 OF 2 • PROFILE' : 'STEP 1 OF 2 • ACCOUNT'}</span>
                    </div>

                    {/* Controls: Language and Theme */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* 2. MAIN CENTERED CONTENT CONTAINER */}
            <main style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem 1rem 2.5rem',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '480px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '24px',
                    padding: '2rem 1.75rem',
                    boxShadow: '0 16px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.03)',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                }}>
                    {/* Centered Brand Emblem */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <Logo size="medium" />
                    </div>

                    {/* Success Alert Banner */}
                    {successMsg && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid #10B981',
                            color: '#10B981',
                            borderRadius: '14px',
                            padding: '0.85rem 1rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            marginBottom: '1.25rem',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <CheckCircle2 size={19} style={{ flexShrink: 0 }} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Error Alert Banner */}
                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            background: 'var(--danger-light, rgba(239, 68, 68, 0.12))',
                            border: '1px solid var(--danger, #EF4444)',
                            color: 'var(--danger, #EF4444)',
                            borderRadius: '14px',
                            padding: '0.85rem 1rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            marginBottom: '1.25rem',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <AlertCircle size={19} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* STEP 1: ACCOUNT CREDENTIALS (NAME, EMAIL, PASSWORD, CONFIRM)   */}
                    {/* ============================================================== */}
                    {step === 1 && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                                <h1 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 900,
                                    color: 'var(--text-main)',
                                    marginBottom: '0.4rem',
                                    letterSpacing: '-0.02em'
                                }}>
                                    {t('accountCredentialsTitle') || 'Account Credentials'}
                                </h1>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    margin: 0
                                }}>
                                    {t('accountCredentialsDesc') || 'Review or edit your account information before completing your profile.'}
                                </p>
                            </div>

                            <form onSubmit={handleSaveAccountCredentials}>
                                {/* Full Name */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
                                        {t('fullName') || 'Full Name'}
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            <User size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. Abebe Kebede"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                paddingLeft: '2.6rem',
                                                fontSize: '0.975rem',
                                                fontWeight: 600,
                                                borderRadius: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
                                        {t('emailAddress') || 'Email Address'}
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            <Mail size={18} />
                                        </span>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="name@example.com"
                                            value={accountEmail}
                                            onChange={(e) => setAccountEmail(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                paddingLeft: '2.6rem',
                                                fontSize: '0.975rem',
                                                fontWeight: 600,
                                                borderRadius: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                                        <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                                            {t('password') || 'Password'}
                                        </label>
                                        <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            (Leave blank to keep current)
                                        </span>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-input"
                                            placeholder="Enter new password (min. 6 characters)"
                                            value={accountPassword}
                                            onChange={(e) => setAccountPassword(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                paddingLeft: '2.6rem',
                                                paddingRight: '2.6rem',
                                                fontSize: '0.975rem',
                                                fontWeight: 600,
                                                borderRadius: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '0.9rem',
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

                                {/* Confirm Password */}
                                {accountPassword.length > 0 && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
                                            {t('confirmPassword') || 'Confirm Password'}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                                <Lock size={18} />
                                            </span>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                className="form-input"
                                                placeholder="Re-enter new password"
                                                value={accountConfirmPassword}
                                                onChange={(e) => setAccountConfirmPassword(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    height: '50px',
                                                    paddingLeft: '2.6rem',
                                                    paddingRight: '2.6rem',
                                                    fontSize: '0.975rem',
                                                    fontWeight: 600,
                                                    borderRadius: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                required={accountPassword.length > 0}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '0.9rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Save & Continue Button */}
                                <button
                                    type="submit"
                                    disabled={savingAccount}
                                    style={{
                                        width: '100%',
                                        height: '52px',
                                        background: 'var(--primary)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '14px',
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        cursor: savingAccount ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 16px rgba(5, 150, 105, 0.35)',
                                        transition: 'all 0.15s ease',
                                        marginTop: '1rem'
                                    }}
                                >
                                    {savingAccount ? <span className="spinner"></span> : (
                                        <>{t('continueToProfile') || 'Continue to Profile Setup'} <ArrowRight size={18} /></>
                                    )}
                                </button>

                                {/* Skip back to step 2 link */}
                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setError('');
                                            setSuccessMsg('');
                                            setStep(2);
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--primary)',
                                            fontSize: '0.85rem',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        {t('returnToProfile') || 'Return to profile setup'} →
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* STEP 2: CREATOR PROFILE SETUP (USERNAME, TELEBIRR, OTP)       */}
                    {/* ============================================================== */}
                    {step === 2 && (
                        <div>
                            {/* Header Titles */}
                            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                                <h1 style={{
                                    fontSize: '1.55rem',
                                    fontWeight: 900,
                                    color: 'var(--text-main)',
                                    marginBottom: '0.4rem',
                                    letterSpacing: '-0.02em'
                                }}>
                                    {t('onboardingTitle') || 'Complete Your Profile'}
                                </h1>
                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    margin: 0
                                }}>
                                    {t('onboardingDesc') || 'Set up your creator handle and verified phone number to receive tips instantly.'}
                                </p>
                            </div>

                            <form onSubmit={handleOnboard}>
                                {/* Choose Username Field */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
                                        {t('chooseAUsername') || 'Choose a Username'}
                                    </label>
                                    
                                    <div style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '52px',
                                        background: 'var(--card-bg-subtle, #F8FAFC)',
                                        border: '1.5px solid var(--border-color)',
                                        borderRadius: '14px',
                                        overflow: 'hidden',
                                        transition: 'border-color 0.2s, box-shadow 0.2s'
                                    }}>
                                        {/* Stylized @ badge prefix */}
                                        <div style={{
                                            padding: '0 0.9rem',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(5, 150, 105, 0.08)',
                                            borderRight: '1px solid var(--border-color)',
                                            color: 'var(--primary)',
                                            fontWeight: 900,
                                            fontSize: '1.1rem',
                                            userSelect: 'none',
                                            flexShrink: 0
                                        }}>
                                            @
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                            style={{
                                                flex: 1,
                                                height: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                background: 'transparent',
                                                padding: '0 0.85rem',
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: 'var(--text-main)',
                                                boxSizing: 'border-box'
                                            }}
                                            required
                                        />

                                        {username.length >= 3 && (
                                            <div style={{ paddingRight: '0.85rem', color: '#10B981', display: 'flex', alignItems: 'center' }}>
                                                <Check size={18} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Interactive Live Link Preview Card */}
                                    <div style={{
                                        marginTop: '0.5rem',
                                        padding: '0.55rem 0.85rem',
                                        background: 'rgba(5, 150, 105, 0.06)',
                                        border: '1px solid rgba(5, 150, 105, 0.2)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        fontSize: '0.82rem',
                                        color: 'var(--primary)',
                                        fontWeight: 700
                                    }}>
                                        <Globe size={14} style={{ flexShrink: 0 }} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            gurshapay.com/@{username || 'yourname'}
                                        </span>
                                    </div>
                                </div>

                                {/* Phone Number Section */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                                        <label style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                            {t('yourPhoneNumber') || 'Phone Number'}
                                        </label>
                                        {isVerified && (
                                            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <ShieldCheck size={16} /> {t('phoneVerifiedBadge') || t('verified') || 'Verified'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Full Width Phone Container */}
                                    <div style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '52px',
                                        background: 'var(--card-bg-subtle, #F8FAFC)',
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

                                    {/* Action button: Send OTP */}
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
                                            <><Check size={18} /> {t('phoneVerifiedBadge') || t('verified') || 'Phone Verified'}</>
                                        ) : otpSending ? (
                                            <span className="spinner"></span>
                                        ) : resendCooldown > 0 ? (
                                            <span>{t('resendIn') || 'Resend code in'} {resendCooldown}s</span>
                                        ) : (
                                            <><Send size={16} /> {t('sendOtp') || 'Send Verification Code'}</>
                                        )}
                                    </button>
                                </div>

                                {/* OTP Section when code is sent */}
                                {otpSent && !isVerified && (
                                    <div style={{
                                        marginBottom: '1.5rem',
                                        padding: '1.1rem',
                                        background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.02))',
                                        borderRadius: '16px',
                                        border: '1px dashed var(--border-color)'
                                    }}>
                                        <label style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
                                            {t('otpCodeLabel') || 'Verification Code (OTP)'}
                                        </label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                            <div style={{ position: 'relative' }}>
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
                                        boxShadow: '0 4px 18px rgba(5, 150, 105, 0.35)',
                                        transition: 'all 0.15s ease',
                                        marginTop: '0.75rem'
                                    }}
                                >
                                    {loading ? <span className="spinner"></span> : (
                                        <>{t('completeSetup') || 'Complete Setup'} <ArrowRight size={19} /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>

            {/* 3. PINNED COMPLIANCE FOOTER */}
            <footer style={{
                textAlign: 'center',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <ComplianceBadge style={{ marginTop: 0 }} />
            </footer>
        </div>
    );
}
