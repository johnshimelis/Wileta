import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, Settings as SettingsIcon, Bell, Lock, Globe, Smartphone,
    Save, CheckCircle, Mail, Camera, Upload, Menu, X, AlertCircle,
    Eye, EyeOff, Shield, ShieldCheck, Key, RefreshCw, ArrowRight, Check
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import DirectChatDrawer from '../components/DirectChatDrawer';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import TopAlert from '../components/TopAlert';

export default function Settings() {
    const { user, setUser, api, requestTelebirrOtp, verifyTelebirrOtp } = useAuth();
    const { t } = useLanguage();
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);

    // Multi-Factor Password Modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordStep, setPasswordStep] = useState(1); // 1 = inputs & channel, 2 = otp, 3 = success
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [otpChannel, setOtpChannel] = useState(user?.email ? 'email' : 'sms');
    const [otp, setOtp] = useState('');
    const [recipientMasked, setRecipientMasked] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Telebirr Wallet & Verification state
    const isTelebirrVerified = Boolean(
        (user?.telebirrAccount?.status === 'VERIFIED' || user?.phoneVerified) &&
        (user?.telebirr_number || user?.telebirrAccount?.phoneNumber || user?.phone)
    );

    const getCleanPhone = (phoneStr) => {
        let clean = (phoneStr || '').toString().replace(/[^0-9]/g, '');
        if (clean.startsWith('251')) clean = clean.substring(3);
        else if (clean.startsWith('0')) clean = clean.substring(1);
        return clean.slice(0, 9);
    };

    const currentTelebirrNumber = getCleanPhone(user?.telebirr_number || user?.telebirrAccount?.phoneNumber || user?.phone);

    const [isEditingTelebirr, setIsEditingTelebirr] = useState(!isTelebirrVerified);
    const [tbPhoneInput, setTbPhoneInput] = useState(currentTelebirrNumber);
    const [tbOtp, setTbOtp] = useState('');
    const [tbOtpSent, setTbOtpSent] = useState(false);
    const [tbSendingOtp, setTbSendingOtp] = useState(false);
    const [tbVerifying, setTbVerifying] = useState(false);
    const [tbCooldown, setTbCooldown] = useState(0);
    const [tbDevOtp, setTbDevOtp] = useState('');
    const [tbError, setTbError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setUsername(user.username || '');
            const clean = getCleanPhone(user?.telebirr_number || user?.telebirrAccount?.phoneNumber || user?.phone);
            setTbPhoneInput(clean);
            if (!isTelebirrVerified) {
                setIsEditingTelebirr(true);
            }
            if (user.email) setOtpChannel('email');
            else if (user.phone) setOtpChannel('sms');
        }
    }, [user, isTelebirrVerified]);

    // Telebirr Resend countdown timer
    useEffect(() => {
        let timer;
        if (tbCooldown > 0) {
            timer = setInterval(() => {
                setTbCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [tbCooldown]);

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleSendTelebirrOtp = async () => {
        setTbError('');
        const cleanDigits = tbPhoneInput.replace(/[^0-9]/g, '');
        if (cleanDigits.length !== 9 || (!cleanDigits.startsWith('9') && !cleanDigits.startsWith('7'))) {
            setTbError('Please enter a valid Ethiopian Telebirr number (e.g. 911000000 or 711000000).');
            return;
        }

        setTbSendingOtp(true);
        const res = await requestTelebirrOtp(`0${cleanDigits}`);
        setTbSendingOtp(false);

        if (res.success) {
            setTbOtpSent(true);
            setTbCooldown(60);
            showAlert(res.message || 'Verification code sent via SMS!', 'success');
            if (res.devOtp) setTbDevOtp(res.devOtp);
        } else {
            setTbError(res.error || 'Failed to send verification code.');
        }
    };

    const handleVerifyTelebirr = async () => {
        setTbError('');
        const cleanDigits = tbPhoneInput.replace(/[^0-9]/g, '');
        if (cleanDigits.length !== 9) {
            setTbError('Invalid phone number.');
            return;
        }
        if (!tbOtp || tbOtp.trim().length !== 6) {
            setTbError('Please enter the complete 6-digit verification code.');
            return;
        }

        setTbVerifying(true);
        const res = await verifyTelebirrOtp(`0${cleanDigits}`, tbOtp.trim());
        setTbVerifying(false);

        if (res.success) {
            showAlert('Telebirr phone number verified successfully!', 'success');
            setIsEditingTelebirr(false);
            setTbOtpSent(false);
            setTbOtp('');
        } else {
            setTbError(res.error || 'Invalid verification code. Please try again.');
        }
    };

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 4000);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const res = await api.post('/auth/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data);
            showAlert('Profile picture updated successfully!');
        } catch (error) {
            showAlert(error.response?.data?.error || "Upload failed", "error");
        }
        setUploading(false);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!name || !username) {
            showAlert("Name and username are required", "error");
            return;
        }
        setSaving(true);
        try {
            const res = await api.post('/auth/update-profile', { name, username });
            setUser(res.data);
            setSaved(true);
            showAlert('Settings saved successfully!');
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            showAlert(error.response?.data?.error || "Update failed", "error");
        }
        setSaving(false);
    };

    // Calculate password strength
    const getPasswordStrength = (pass) => {
        if (!pass) return { level: 0, text: '', color: '#E2E8F0' };
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 1) return { level: 1, text: 'Weak', color: '#EF4444' };
        if (score === 2) return { level: 2, text: 'Fair', color: '#F59E0B' };
        if (score === 3) return { level: 3, text: 'Good', color: '#3B82F6' };
        return { level: 4, text: 'Strong', color: '#10B981' };
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await api.post('/auth/send-password-otp', { channel: otpChannel });
            setRecipientMasked(res.data.recipientMasked || (otpChannel === 'email' ? user?.email : user?.phone));
            setPasswordStep(2);
            setResendCooldown(60);
            showAlert(res.data.message || 'Security verification code sent!', 'success');
        } catch (error) {
            setPasswordError(error.response?.data?.error || 'Failed to send verification code.');
        }
        setPasswordLoading(false);
    };

    // Step 2: Confirm OTP and update password
    const handleConfirmUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (!otp || otp.trim().length !== 6) {
            setPasswordError('Please enter the 6-digit verification code.');
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await api.post('/auth/update-password', {
                currentPassword,
                newPassword,
                otp: otp.trim()
            });

            setPasswordStep(3);
            showAlert(res.data.message || 'Password updated successfully!', 'success');
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordStep(1);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setOtp('');
            }, 2500);
        } catch (error) {
            setPasswordError(error.response?.data?.error || 'Failed to update password. Invalid verification code.');
        }
        setPasswordLoading(false);
    };

    const strength = getPasswordStrength(newPassword);

    return (
        <div className="app-layout">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="mobile-header">
                <Logo size="small" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <DirectChatDrawer />
                    <NotificationDrawer />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="main-content">
                {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{t('settingsTitle')}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('settingsSubtitle')}</p>
                    </div>
                    <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <DirectChatDrawer />
                        <NotificationDrawer />
                        <Button
                            variant="primary"
                            size="sm"
                            icon={Save}
                            onClick={handleSave}
                            loading={saving}
                        >
                            {saved ? 'Saved!' : t('saveSettings')}
                        </Button>
                    </div>
                </div>

                <div className="dashboard-two-col-grid">
                    {/* Left Column: Profile Info */}
                    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('generalSettings')}</h3>

                        {/* Avatar Picker */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, overflow: 'hidden' }}>
                                    {user?.profilePicUrl ? (
                                        <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        user?.name?.charAt(0) || '?'
                                    )}
                                </div>
                                <label
                                    title="Upload photo"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-2px',
                                        right: '-2px',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        border: '2px solid var(--card-bg)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                >
                                    <Camera size={12} />
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                                </label>
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('profilePicture')}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{uploading ? 'Uploading...' : t('profilePictureLimit')}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">{t('displayName')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('usernameLabelWithAt')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={username}
                                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Linked Account Email / Phone</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={user?.email || user?.phone || 'Not configured'}
                                    disabled
                                    style={{ background: 'var(--card-bg-subtle)', opacity: 0.8 }}
                                />
                            </div>

                            <Button type="submit" variant="primary" size="md" loading={saving} style={{ marginTop: '0.5rem' }}>
                                {t('saveSettings')}
                            </Button>
                        </form>
                    </Card>

                    {/* Right Column: Preferences & Security */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Telebirr Payout Destination & Verification Card */}
                        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: isTelebirrVerified ? 'rgba(5, 150, 105, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                        color: isTelebirrVerified ? '#059669' : '#D97706',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Smartphone size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                                            {t('telebirrPayoutTitle') || 'Telebirr Payout Destination'}
                                        </h3>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Direct wallet for creator payouts
                                        </span>
                                    </div>
                                </div>

                                <Badge variant={isTelebirrVerified ? 'success' : 'warning'}>
                                    {isTelebirrVerified ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            <ShieldCheck size={12} /> {t('telebirrWalletVerified') || 'VERIFIED'}
                                        </span>
                                    ) : (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            <AlertCircle size={12} /> {t('telebirrWalletNotVerified') || 'NOT VERIFIED'}
                                        </span>
                                    )}
                                </Badge>
                            </div>

                            {/* Display Verified Telebirr State */}
                            {isTelebirrVerified && !isEditingTelebirr ? (
                                <div style={{
                                    background: 'var(--bg-app)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Linked Telebirr Wallet
                                            </div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mono-num">
                                                <span>🇪🇹</span>
                                                <span>+251 {currentTelebirrNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingTelebirr(true);
                                                setTbPhoneInput(currentTelebirrNumber);
                                                setTbOtpSent(false);
                                                setTbOtp('');
                                                setTbError('');
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '6px',
                                                padding: '0.35rem 0.65rem',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                color: 'var(--text-main)',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                        >
                                            {t('changeTelebirr') || 'Change Number'}
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#059669', fontWeight: 600, background: 'rgba(16, 185, 129, 0.08)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                                        <Check size={15} style={{ flexShrink: 0 }} />
                                        <span>{t('telebirrVerifiedNotice') || 'Your Telebirr wallet is verified and active for instant payouts.'}</span>
                                    </div>

                                    {(user?.telebirrAccount?.accountHolderName || user?.name) && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Account Holder: <strong>{user?.telebirrAccount?.accountHolderName || user?.name}</strong>
                                            {user?.telebirrAccount?.verifiedAt && (
                                                <span> • Verified on {new Date(user.telebirrAccount.verifiedAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Verification Form State (When not verified or editing) */
                                <div style={{
                                    background: 'var(--bg-app)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1.15rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.85rem'
                                }}>
                                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                                        {t('telebirrUnverifiedNotice') || 'Verify your Ethiopian Telebirr number via SMS OTP to receive tips directly to your wallet.'}
                                    </p>

                                    {tbError && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 600 }}>
                                            <AlertCircle size={15} style={{ flexShrink: 0 }} />
                                            <span>{tbError}</span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                                            Telebirr Mobile Number
                                        </label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div className="input-group" style={{ flex: 1 }}>
                                                <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <span>🇪🇹</span> +251
                                                </span>
                                                <input
                                                    type="tel"
                                                    className="form-input"
                                                    placeholder="911000000"
                                                    value={tbPhoneInput}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                                        if (val.startsWith('0')) val = val.substring(1);
                                                        setTbPhoneInput(val.slice(0, 9));
                                                        if (tbOtpSent) setTbOtpSent(false);
                                                    }}
                                                    maxLength={9}
                                                    style={{ paddingLeft: '5.5rem' }}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleSendTelebirrOtp}
                                                disabled={tbSendingOtp || tbCooldown > 0 || tbPhoneInput.length !== 9}
                                                style={{
                                                    padding: '0 1rem',
                                                    height: '42px',
                                                    background: tbCooldown > 0 || tbPhoneInput.length !== 9 ? 'var(--border-color)' : 'var(--primary)',
                                                    color: tbCooldown === 0 && tbPhoneInput.length === 9 ? '#FFFFFF' : 'var(--text-muted)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: 700,
                                                    fontSize: '0.825rem',
                                                    cursor: tbCooldown > 0 || tbPhoneInput.length !== 9 ? 'not-allowed' : 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    transition: 'all 0.15s ease',
                                                    flexShrink: 0
                                                }}
                                            >
                                                {tbSendingOtp ? (
                                                    <span className="spinner"></span>
                                                ) : tbCooldown > 0 ? (
                                                    `${t('resendIn') || 'Resend in'} ${tbCooldown}s`
                                                ) : tbOtpSent ? (
                                                    t('resendOtp') || 'Resend Code'
                                                ) : (
                                                    t('sendOtp') || 'Send OTP'
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* OTP Input and Verify Button */}
                                    {tbOtpSent && (
                                        <div style={{ animation: 'fadeIn 0.2s ease-in', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                                                {t('otpCodeLabel') || 'Verification Code (OTP)'}
                                            </label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <div className="input-group" style={{ flex: 1 }}>
                                                    <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <Smartphone size={16} />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder={t('otpPlaceholder') || "Enter 6-digit code"}
                                                        value={tbOtp}
                                                        onChange={(e) => setTbOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                                        maxLength={6}
                                                        style={{
                                                            paddingLeft: '2.5rem',
                                                            letterSpacing: tbOtp ? '4px' : 'normal',
                                                            fontWeight: 700,
                                                            fontSize: '0.95rem'
                                                        }}
                                                        autoFocus
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={handleVerifyTelebirr}
                                                    disabled={tbVerifying || tbOtp.length !== 6}
                                                    style={{
                                                        padding: '0 1.2rem',
                                                        height: '42px',
                                                        background: tbOtp.length === 6 ? 'var(--primary)' : 'var(--border-color)',
                                                        color: tbOtp.length === 6 ? '#FFFFFF' : 'var(--text-muted)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontWeight: 700,
                                                        fontSize: '0.85rem',
                                                        cursor: tbOtp.length === 6 && !tbVerifying ? 'pointer' : 'not-allowed',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        boxShadow: tbOtp.length === 6 ? '0 2px 8px rgba(5, 150, 105, 0.25)' : 'none',
                                                        transition: 'all 0.15s ease',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    {tbVerifying ? <span className="spinner"></span> : <><Check size={16} /> {t('verifyTelebirrButton') || 'Verify Telebirr'}</>}
                                                </button>
                                            </div>

                                            {tbDevOtp && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                                                    ℹ️ Test Verification Code: {tbDevOtp}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isTelebirrVerified && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditingTelebirr(false);
                                                    setTbOtpSent(false);
                                                    setTbOtp('');
                                                    setTbError('');
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-muted)',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                {t('cancelChange') || 'Cancel'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* Notifications Card */}
                        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('notificationsTitle')}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('pushNotifications')}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('pushNotificationsDesc')}</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={pushEnabled}
                                    onChange={e => setPushEnabled(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--border-color)' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('emailReports')}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('emailReportsDesc')}</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailEnabled}
                                    onChange={e => setEmailEnabled(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                            </div>
                        </Card>

                        {/* Security Card with Interactive MFA Password Button */}
                        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Security & Authentication</h3>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                                    <ShieldCheck size={13} /> MFA Active
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                                Protect your account with encrypted passwords and 2-step verification codes sent to your verified email or SMS.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordModal(true);
                                    setPasswordStep(1);
                                    setPasswordError('');
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    background: 'var(--card-bg)',
                                    border: '1.5px solid var(--primary)',
                                    color: 'var(--primary)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'var(--primary)';
                                    e.currentTarget.style.color = '#FFFFFF';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'var(--card-bg)';
                                    e.currentTarget.style.color = 'var(--primary)';
                                }}
                            >
                                <Key size={16} />
                                <span>Change Account Password</span>
                            </button>
                        </Card>
                    </div>
                </div>

                {/* ELEGANT MULTI-FACTOR PASSWORD CHANGE MODAL */}
                {showPasswordModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(15, 23, 42, 0.65)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(8px)',
                            padding: '1rem'
                        }}
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <div
                            style={{
                                maxWidth: '460px',
                                width: '100%',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '20px',
                                padding: '2rem',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                                position: 'relative'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                            {passwordStep === 1 && 'Change Password'}
                                            {passwordStep === 2 && 'Security Verification'}
                                            {passwordStep === 3 && 'Success!'}
                                        </h2>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {passwordStep === 1 && 'Step 1 of 2: Create new password'}
                                            {passwordStep === 2 && 'Step 2 of 2: Confirm 6-digit OTP'}
                                            {passwordStep === 3 && 'Password successfully updated'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Error Banner */}
                            {passwordError && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                                    <span>{passwordError}</span>
                                </div>
                            )}

                            {/* STEP 1: Passwords + MFA Channel Selection */}
                            {passwordStep === 1 && (
                                <form onSubmit={handleSendOtp}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>Current Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                className="form-input"
                                                placeholder="Enter your current password"
                                                value={currentPassword}
                                                onChange={e => setCurrentPassword(e.target.value)}
                                                style={{ width: '100%', paddingRight: '2.75rem', boxSizing: 'border-box' }}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>New Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                className="form-input"
                                                placeholder="At least 6 characters"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                style={{ width: '100%', paddingRight: '2.75rem', boxSizing: 'border-box' }}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>

                                        {/* Strength Bar */}
                                        {newPassword && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: strength.color }}>
                                                    <span>Password Strength:</span>
                                                    <span>{strength.text}</span>
                                                </div>
                                                <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(strength.level / 4) * 100}%`, height: '100%', background: strength.color, transition: 'width 0.3s ease' }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            placeholder="Re-enter new password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            style={{ width: '100%', boxSizing: 'border-box' }}
                                            required
                                        />
                                    </div>

                                    {/* Security OTP Channel Option */}
                                    <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Send Verification Code via:
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.65rem 0.75rem',
                                                    border: `1.5px solid ${otpChannel === 'email' ? '#059669' : 'var(--border-color)'}`,
                                                    borderRadius: '8px',
                                                    background: otpChannel === 'email' ? 'rgba(5, 150, 105, 0.08)' : 'var(--card-bg)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="otpChannel"
                                                    value="email"
                                                    checked={otpChannel === 'email'}
                                                    onChange={() => setOtpChannel('email')}
                                                    style={{ accentColor: '#059669' }}
                                                />
                                                <Mail size={16} /> Email
                                            </label>

                                            <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.65rem 0.75rem',
                                                    border: `1.5px solid ${otpChannel === 'sms' ? '#059669' : 'var(--border-color)'}`,
                                                    borderRadius: '8px',
                                                    background: otpChannel === 'sms' ? 'rgba(5, 150, 105, 0.08)' : 'var(--card-bg)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="otpChannel"
                                                    value="sms"
                                                    checked={otpChannel === 'sms'}
                                                    onChange={() => setOtpChannel('sms')}
                                                    style={{ accentColor: '#059669' }}
                                                />
                                                <Smartphone size={16} /> SMS
                                            </label>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="md"
                                            className="btn-full"
                                            onClick={() => setShowPasswordModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            className="btn-full"
                                            loading={passwordLoading}
                                        >
                                            Send Security Code <ArrowRight size={16} />
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 2: 6-Digit OTP Verification */}
                            {passwordStep === 2 && (
                                <form onSubmit={handleConfirmUpdatePassword}>
                                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                            <Shield size={24} />
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                                            We sent a 6-digit verification code to <strong>{recipientMasked}</strong>.
                                        </p>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, textAlign: 'center', display: 'block' }}>
                                            Enter 6-Digit Code
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="------"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                fontSize: '1.75rem',
                                                fontWeight: 800,
                                                letterSpacing: '0.5rem',
                                                padding: '0.75rem',
                                                border: '2px solid var(--primary)',
                                                borderRadius: '12px',
                                                background: 'var(--bg-color)',
                                                color: 'var(--text-main)',
                                                boxSizing: 'border-box'
                                            }}
                                            autoFocus
                                            required
                                        />
                                    </div>

                                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                        {resendCooldown > 0 ? (
                                            <span style={{ color: 'var(--text-muted)' }}>Resend code in {resendCooldown}s</span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Resend verification code
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="md"
                                            className="btn-full"
                                            onClick={() => setPasswordStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            className="btn-full"
                                            loading={passwordLoading}
                                        >
                                            Confirm & Update
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 3: Success Confirmation */}
                            {passwordStep === 3 && (
                                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '2px solid #10B981' }}>
                                        <Check size={32} strokeWidth={3} />
                                    </div>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                                        Password Updated!
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                                        Your account is now secured with your new password. All other active sessions have been safely logged out.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
