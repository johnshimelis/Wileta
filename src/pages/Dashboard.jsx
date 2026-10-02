import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Copy, CheckCircle, Wallet, History, ArrowUpRight, ArrowDownRight,
    TrendingUp, AlertTriangle, ShieldCheck, XCircle, User,
    ExternalLink, Menu, X, Smartphone, Upload, Edit2, AlertCircle, Sparkles,
    Search, Filter, ArrowRight, Share2, DollarSign, Building, RefreshCw, QrCode,
    Zap, Check, Eye, EyeOff, ChevronDown, Lock, Clock
} from 'lucide-react';
import TopAlert from '../components/TopAlert';
import NotificationDrawer from '../components/NotificationDrawer';
import DirectChatDrawer from '../components/DirectChatDrawer';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ForcedMobileKYCModal from '../components/ForcedMobileKYCModal';
import EthiopianFlag from '../components/EthiopianFlag';
import TelegramConnectBanner from '../components/TelegramConnectBanner';

// Official Verified Blue Tick SVG Emblem
const VerifiedBlueTick = ({ size = 24, title = "Verified Creator" }) => (
    <span 
        title={title}
        style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            verticalAlign: 'middle',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
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

const getBankLogo = (name) => {
    if (!name) return null;
    const n = name.toLowerCase();
    if (n.includes('telebirr')) return '/banks/telebirr.jpg';
    if (n.includes('commercial') || n.includes('cbe')) return '/banks/cbe.jpg';
    if (n.includes('abyssinia') || n.includes('boa')) return '/banks/abyssinia.png';
    if (n.includes('awash')) return '/banks/awash.png';
    if (n.includes('dashen')) return '/banks/dashen.png';
    if (n.includes('coop') || n.includes('oromia')) return '/banks/coop.png';
    return null;
};

const getBankColor = (name) => {
    const colors = {
        'Commercial Bank of Ethiopia (CBE)': '#5C2D91',
        'Awash International Bank': '#00539F',
        'Dashen Bank': '#F89B2B',
        'Bank of Abyssinia': '#FFC20E',
        'Wegagen Bank': '#F37021',
        'Nib International Bank': '#795548',
        'Cooperative Bank of Oromia': '#00AEEF'
    };
    return colors[name] || 'var(--primary)';
};

const getBankInitials = (name) => {
    if (!name) return 'BK';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const ChangeTelebirrModal = ({ show, onClose, user, onSuccess, onReturnToWithdraw }) => {
    const { t } = useLanguage();
    const { requestChangeTelebirrOtp, verifyChangeTelebirrOtp, setUser } = useAuth();
    const [step, setStep] = useState(1); // 1: Enter new phone, 2: Enter OTP sent to old phone
    const [newPhone, setNewPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [maskedOldPhone, setMaskedOldPhone] = useState('');
    const [devOtp, setDevOtp] = useState(null);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (show) {
            setStep(1);
            setNewPhone('');
            setOtp('');
            setError('');
            setDevOtp(null);
            setCountdown(0);
        }
    }, [show]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    if (!show) return null;

    const currentPhoneRaw = (user?.telebirr_number || user?.phone || user?.telebirrAccount?.phoneNumber || '').toString();
    const formatPhone = (val) => {
        if (!val) return '';
        if (val.startsWith('+251')) return val;
        if (val.startsWith('0') && val.length === 10) return `+251 ${val.substring(1)}`;
        if (val.length === 9) return `+251 ${val}`;
        return val;
    };

    const handleSendCode = async (e) => {
        if (e) e.preventDefault();
        setError('');
        let clean = newPhone.trim().replace(/[^0-9]/g, '');
        if (clean.startsWith('251') && clean.length === 12) clean = clean.substring(3);
        else if (clean.startsWith('0') && clean.length === 10) clean = clean.substring(1);

        if (clean.length !== 9 || (!clean.startsWith('9') && !clean.startsWith('7'))) {
            setError(t('invalidPhoneNumber') || 'Please enter a valid Ethiopian mobile number (09... or 07...).');
            return;
        }

        const currentClean = currentPhoneRaw.replace(/[^0-9]/g, '');
        if (currentClean.endsWith(clean)) {
            setError('The new phone number must be different from your current number.');
            return;
        }

        const normalizedNew = `0${clean}`;
        setLoading(true);
        try {
            const res = await requestChangeTelebirrOtp(normalizedNew);
            if (res.success) {
                setMaskedOldPhone(res.oldPhoneMasked || formatPhone(currentPhoneRaw) || 'your current phone');
                if (res.devOtp) setDevOtp(res.devOtp);
                setStep(2);
                setCountdown(60);
            } else {
                setError(res.error || 'Failed to send verification code');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        if (!otp.trim() || otp.trim().length < 4) {
            setError(t('enterOldPhoneOtp') || 'Please enter the 6-digit verification code sent to your old phone.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            let clean = newPhone.trim().replace(/[^0-9]/g, '');
            if (clean.startsWith('251') && clean.length === 12) clean = clean.substring(3);
            else if (clean.startsWith('0') && clean.length === 10) clean = clean.substring(1);
            const normalizedNew = `0${clean}`;

            const res = await verifyChangeTelebirrOtp(normalizedNew, otp.trim());
            if (res.success) {
                if (res.user) {
                    setUser(res.user);
                    localStorage.setItem('gp_cached_user', JSON.stringify(res.user));
                }
                if (onSuccess) onSuccess(res.user || { telebirr_number: normalizedNew, phone: normalizedNew });
                onClose();
                if (onReturnToWithdraw) onReturnToWithdraw();
            } else {
                setError(res.error || 'Invalid or expired verification code');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(9, 9, 11, 0.75)',
                zIndex: 9500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    maxWidth: '480px',
                    width: '100%',
                    padding: '2rem 1.75rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Smartphone size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                            {step === 1 ? (t('changeTelebirrNumber') || 'Change Telebirr Number') : (t('verifyAndUpdatePhone') || 'Security Verification')}
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                        <X size={20} />
                    </button>
                </div>

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
                        fontWeight: 700,
                        marginBottom: '1rem'
                    }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendCode}>
                        {currentPhoneRaw && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                background: 'var(--card-bg-subtle)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                marginBottom: '1.25rem',
                                fontSize: '0.825rem'
                            }}>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
                                    Current Linked Number:
                                </span>
                                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                                    {formatPhone(currentPhoneRaw)}
                                </span>
                            </div>
                        )}

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                {t('newTelebirrPhone') || 'New Telebirr Phone Number'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '0.85rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    +251
                                </span>
                                <input
                                    type="tel"
                                    placeholder="09... or 07..."
                                    className="form-input"
                                    value={newPhone}
                                    onChange={e => {
                                        setNewPhone(e.target.value);
                                        if (error) setError('');
                                    }}
                                    style={{ paddingLeft: '3.6rem', width: '100%', boxSizing: 'border-box' }}
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            background: 'rgba(59, 130, 246, 0.08)',
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                            borderRadius: '10px',
                            marginBottom: '1.5rem',
                            fontSize: '0.775rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.4
                        }}>
                            <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>
                                {t('oldPhoneSecurityNotice') || 'For security, an authorization code will be sent via SMS to your current phone to approve this change.'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                loading={loading}
                                disabled={!newPhone.trim() || loading}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    whiteSpace: 'normal',
                                    lineHeight: 1.3,
                                    padding: '0.75rem 1rem',
                                    textAlign: 'center',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {t('sendVerificationCode') || t('sendCodeToCurrentPhone') || 'Send Verification Code'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={onClose}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {t('cancel') || 'Cancel'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{
                            padding: '0.85rem 1rem',
                            background: 'rgba(234, 179, 8, 0.08)',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            borderRadius: '10px',
                            marginBottom: '1.25rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-main)',
                            lineHeight: 1.45
                        }}>
                            <div style={{ fontWeight: 800, color: 'var(--warning, #D97706)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <ShieldCheck size={15} />
                                GurshaPay Security Alert
                            </div>
                            <div>
                                Someone is trying to change your withdrawal phone to <strong>{newPhone}</strong>. If this was you, enter the 6-digit verification code sent to <strong>{maskedOldPhone}</strong>.
                            </div>
                        </div>

                        {devOtp && (
                            <div
                                onClick={() => setOtp(devOtp)}
                                style={{
                                    marginBottom: '1rem',
                                    padding: '0.5rem 0.75rem',
                                    background: 'var(--primary-light)',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontWeight: 700,
                                    color: 'var(--primary)'
                                }}
                            >
                                <span>[Test Mode] Dev OTP: {devOtp}</span>
                                <span style={{ textDecoration: 'underline', fontSize: '0.75rem' }}>Click to fill</span>
                            </div>
                        )}

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                {t('enterOldPhoneOtp') || 'Enter 6-Digit Code'}
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="• • • • • •"
                                className="form-input"
                                value={otp}
                                onChange={e => {
                                    setOtp(e.target.value.replace(/[^0-9]/g, ''));
                                    if (error) setError('');
                                }}
                                style={{
                                    textAlign: 'center',
                                    letterSpacing: '0.4em',
                                    fontSize: '1.2rem',
                                    fontWeight: 800,
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                                autoFocus
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                            >
                                Change number
                            </button>
                            {countdown > 0 ? (
                                <span style={{ color: 'var(--text-muted)' }}>Resend in {countdown}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline', padding: 0 }}
                                >
                                    Resend code
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                loading={loading}
                                disabled={!otp.trim() || loading}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    whiteSpace: 'normal',
                                    lineHeight: 1.3,
                                    padding: '0.75rem 1rem',
                                    textAlign: 'center',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {t('verifyAndUpdatePhone') || 'Confirm & Update'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={onClose}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {t('cancel') || 'Cancel'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const WithdrawModal = ({
    show, onClose, withdrawType, setWithdrawType, balance,
    customAmount, setCustomAmount, onConfirm, user,
    onRequestChangeTelebirr
}) => {
    const { t } = useLanguage();
    const [selectedBankIndex, setSelectedBankIndex] = useState(0);
    const [modalError, setModalError] = useState('');
    const [isConfirmingTelebirr, setIsConfirmingTelebirr] = useState(false);

    useEffect(() => {
        if (show) {
            setModalError('');
            setIsConfirmingTelebirr(false);
        }
    }, [show, withdrawType]);

    if (!show) return null;

    const banks = user?.bankAccounts?.length > 0 ? user.bankAccounts : (user?.bankDetails?.bankName ? [user.bankDetails] : []);
    const isBank = user?.payoutMethod === 'bank';
    const availableBal = Number(balance || 0);
    const amountVal = withdrawType === 'all' ? availableBal : Number(customAmount || 0);

    const formattedTelebirrPhone = (() => {
        const raw = (user?.telebirr_number || user?.telebirrAccount?.phoneNumber || user?.phone || '').toString();
        if (!raw) return t('noTelebirrConfigured') || 'No Telebirr number configured';
        if (raw.startsWith('+251')) return raw;
        if (raw.startsWith('0') && raw.length === 10) return `+251 ${raw.substring(1)}`;
        if (raw.length === 9) return `+251 ${raw}`;
        return raw;
    })();

    const handleConfirmClick = () => {
        if (availableBal <= 0) {
            setModalError(t('noBalanceAvailable') || 'You have no withdrawable balance.');
            return;
        }
        if (amountVal <= 0 || isNaN(amountVal)) {
            setModalError(t('enterValidAmount') || 'Please enter a valid withdrawal amount.');
            return;
        }
        if (amountVal > availableBal) {
            setModalError(
                (t('amountExceedsBalance') || 'Amount exceeds available balance') +
                ` (${availableBal.toFixed(2)} ETB)`
            );
            return;
        }
        if (isBank && banks.length === 0) {
            setModalError(t('noBankConfigured') || 'Please configure a bank account first.');
            return;
        }
        setModalError('');

        // If withdrawing to Telebirr, show explicit confirmation prompt first!
        if (!isBank) {
            setIsConfirmingTelebirr(true);
            return;
        }

        onConfirm(banks[selectedBankIndex]);
    };

    const handleCustomAmountChange = (e) => {
        const val = e.target.value;
        setCustomAmount(val);
        const num = Number(val);
        if (num > availableBal) {
            setModalError(
                (t('amountExceedsBalance') || 'Amount exceeds available balance') +
                ` (${availableBal.toFixed(2)} ETB)`
            );
        } else if (modalError) {
            setModalError('');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(9, 9, 11, 0.7)',
                zIndex: 9000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    maxWidth: '480px',
                    width: '100%',
                    padding: '2rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wallet size={22} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                {isConfirmingTelebirr ? (t('confirmPayout') || 'Confirm Payout') : (t('withdrawFunds') || 'Withdraw Funds')}
                            </h3>
                            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                {t('available') || 'Available'}: {availableBal.toFixed(2)} ETB
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Inline Modal Error Message */}
                {modalError && (
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
                        fontWeight: 700,
                        marginBottom: '1rem',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{modalError}</span>
                    </div>
                )}

                {isConfirmingTelebirr ? (
                    <div>
                        <div style={{ textAlign: 'center', padding: '0.5rem 0 1.25rem' }}>
                            <div style={{
                                width: '54px',
                                height: '54px',
                                borderRadius: '14px',
                                background: 'var(--primary-light)',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 0.85rem'
                            }}>
                                <Smartphone size={26} />
                            </div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                {t('confirmWithdrawToPhone') || 'You want to withdraw to this Telebirr phone number'}?
                            </h4>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                                {t('telebirrWithdrawNotice') || 'Withdrawals will automatically route to your verified onboarded Telebirr number'}:
                            </p>
                        </div>

                        {/* Confirmation Details Card */}
                        <div style={{
                            padding: '1rem',
                            background: 'var(--card-bg-subtle)',
                            border: '1.5px solid var(--primary)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                                    <img src="/banks/telebirr.jpg" alt="Telebirr" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                        {formattedTelebirrPhone}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                                        ✓ {t('telebirrVerifiedBadge') || 'Verified Telebirr'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                                    {t('withdrawalAmount') || 'Amount'}
                                </span>
                                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                                    {amountVal.toFixed(2)} ETB
                                </span>
                            </div>
                        </div>

                        {/* Confirmation Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            <Button
                                variant="primary"
                                size="md"
                                style={{ width: '100%', justifyContent: 'center', fontWeight: 800 }}
                                onClick={() => {
                                    setIsConfirmingTelebirr(false);
                                    onConfirm(null);
                                }}
                            >
                                {t('yesProceed') || 'Yes, Proceed'}
                            </Button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsConfirmingTelebirr(false);
                                    onClose();
                                    if (onRequestChangeTelebirr) onRequestChangeTelebirr();
                                }}
                                style={{
                                    background: 'none',
                                    border: '1px dashed var(--border-color)',
                                    borderRadius: '10px',
                                    padding: '0.75rem',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.825rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.color = 'var(--primary)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }}
                            >
                                {t('changeTelebirrNumber') || 'Want to change Telebirr phone number?'}
                            </button>

                            <Button
                                variant="secondary"
                                size="sm"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => setIsConfirmingTelebirr(false)}
                            >
                                {t('back') || 'Back'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Destination */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('payoutDestination') || 'Payout Destination'}
                            </label>
                            {isBank ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {banks.length > 0 ? banks.map((bank, index) => {
                                        const logo = bank.logoUrl || getBankLogo(bank.bankName);
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => setSelectedBankIndex(index)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.85rem 1rem',
                                                    border: '1.5px solid ' + (selectedBankIndex === index ? 'var(--primary)' : 'var(--border-color)'),
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    background: selectedBankIndex === index ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                                                    {logo ? (
                                                        <img src={logo} alt={bank.bankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', borderRadius: '6px', background: getBankColor(bank.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                                                            {getBankInitials(bank.bankName)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bank.bankName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {bank.accountNumber} {bank.accountHolderName ? `• ${bank.accountHolderName}` : ''}
                                                    </div>
                                                </div>
                                                {selectedBankIndex === index && <CheckCircle size={18} color="var(--primary)" />}
                                            </div>
                                        );
                                    }) : (
                                        <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{t('noBankAccounts') || 'No bank accounts configured.'}</p>
                                    )}
                                </div>
                            ) : (
                                <div style={{ padding: '0.85rem 1rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                                            <img src="/banks/telebirr.jpg" alt="Telebirr" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{t('telebirrWallet') || 'Telebirr Wallet'}</div>
                                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                                                {formattedTelebirrPhone}
                                            </div>
                                        </div>
                                    </div>
                                    {onRequestChangeTelebirr && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                onRequestChangeTelebirr();
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--primary)',
                                                fontSize: '0.775rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                padding: '4px 6px'
                                            }}
                                        >
                                            {t('changeTelebirr') || 'Change'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Amount Option */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('withdrawalAmount') || 'Withdrawal Amount'}
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setWithdrawType('all');
                                        setModalError('');
                                    }}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1.5px solid ' + (withdrawType === 'all' ? 'var(--primary)' : 'var(--border-color)'),
                                        background: withdrawType === 'all' ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                        color: withdrawType === 'all' ? 'var(--primary)' : 'var(--text-main)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {t('fullBalance') || 'Full Balance'} ({availableBal.toFixed(2)} ETB)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWithdrawType('custom')}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1.5px solid ' + (withdrawType === 'custom' ? 'var(--primary)' : 'var(--border-color)'),
                                        background: withdrawType === 'custom' ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                        color: withdrawType === 'custom' ? 'var(--primary)' : 'var(--text-main)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {t('customAmount') || 'Custom Amount'}
                                </button>
                            </div>

                            {withdrawType === 'custom' && (
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>ETB</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={availableBal}
                                        placeholder="0.00"
                                        className="form-input"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        style={{
                                            paddingLeft: '3.5rem',
                                            border: (Number(customAmount) > availableBal) ? '1.5px solid var(--danger, #EF4444)' : undefined
                                        }}
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
                            <Button
                                variant="primary"
                                size="md"
                                style={{ width: '100%', justifyContent: 'center', fontWeight: 800, whiteSpace: 'normal', padding: '0.75rem 1rem' }}
                                onClick={handleConfirmClick}
                            >
                                {t('confirmPayout') || 'Confirm Payout'}
                            </Button>
                            <Button
                                variant="secondary"
                                size="md"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={onClose}
                            >
                                {t('cancel') || 'Cancel'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PasswordModal = ({ show, onClose, onConfirm, loading }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (show) {
            setPassword('');
            setShowPassword(false);
        }
    }, [show]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim()) return;
        onConfirm(password);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(9, 9, 11, 0.75)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    maxWidth: '420px',
                    width: '100%',
                    padding: '2rem 1.75rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Lock size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                            Confirm Password
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter account password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                            autoFocus
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            style={{ width: '100%', justifyContent: 'center', fontWeight: 800 }}
                            loading={loading}
                            disabled={!password.trim() || loading}
                        >
                            Confirm
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const WithdrawSuccessModal = ({ data, onClose, user }) => {
    const { t } = useLanguage();
    if (!data) return null;
    return (
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 9, 11, 0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '1rem' }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    maxWidth: '460px',
                    width: '100%',
                    padding: '2.25rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ width: '60px', height: '60px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <CheckCircle size={32} />
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>{t('transferRequested')}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{t('pendingAdminReview')}</p>

                <div style={{ background: 'var(--card-bg-subtle)', borderRadius: '12px', padding: '1.15rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Amount Requested</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>{Number(data?.amount || 0).toFixed(2)} ETB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Payout Method</span>
                        <span style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-main)' }}>{data?.payoutMethod || user?.payoutMethod || 'telebirr'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Remaining Balance</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{Number(data?.newBalance || 0).toFixed(2)} ETB</span>
                    </div>
                </div>

                <Button variant="primary" size="md" className="btn-full" onClick={onClose}>
                    {t('greatThanks')}
                </Button>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { user, api, setUser } = useAuth();
    const { triggerNotification } = useNotification();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [metrics, setMetrics] = useState(() => {
        try {
            const cached = localStorage.getItem('gp_cached_metrics');
            if (cached) return JSON.parse(cached);
        } catch (_) {}
        const cachedUser = (() => {
            try {
                const u = localStorage.getItem('gp_cached_user');
                return u ? JSON.parse(u) : null;
            } catch (_) { return null; }
        })();
        const initialBal = user?.walletBalance ?? user?.wallet_balance ?? cachedUser?.walletBalance ?? cachedUser?.wallet_balance ?? 0;
        return {
            total_earned: initialBal,
            pending_balance: 0,
            walletBalance: initialBal,
            availableBalance: initialBal
        };
    });
    const [transactions, setTransactions] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(() => !localStorage.getItem('gp_cached_metrics'));
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [copied, setCopied] = useState(false);
    const [obsCopied, setObsCopied] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showChangeTelebirrModal, setShowChangeTelebirrModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showForcedKYCModal, setShowForcedKYCModal] = useState(false);
    const [pendingWithdrawBank, setPendingWithdrawBank] = useState(null);
    const [withdrawType, setWithdrawType] = useState('all');
    const [customAmount, setCustomAmount] = useState('');
    const [withdrawSuccessData, setWithdrawSuccessData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Transaction filter tab: 'all' | 'tips' | 'withdrawals'
    const [txFilter, setTxFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [txPageSize, setTxPageSize] = useState(10);
    const [visibleTxCount, setVisibleTxCount] = useState(10);

    useEffect(() => {
        setVisibleTxCount(txPageSize);
    }, [txFilter, txPageSize]);

    // Payout settings
    const [payoutMethod, setPayoutMethod] = useState(user?.payoutMethod || 'telebirr');
    const initialBankAccounts = user?.bankAccounts?.length > 0
        ? user.bankAccounts
        : (user?.bankDetails?.bankName ? [user.bankDetails] : [{ bankName: '', accountNumber: '', accountHolderName: '', logoUrl: '' }]);
    const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
    const [savingPayout, setSavingPayout] = useState(false);

    useEffect(() => {
        if (user) {
            setPayoutMethod(user.payoutMethod || 'telebirr');
            if (user.bankAccounts?.length > 0) {
                setBankAccounts(user.bankAccounts);
            } else if (user.bankDetails?.bankName) {
                setBankAccounts([user.bankDetails]);
            }
        }
    }, [user]);

    const fetchMetrics = useCallback(async () => {
        try {
            const res = await api.get('/dashboard/metrics');
            if (res.data) {
                setMetrics(res.data);
                localStorage.setItem('gp_cached_metrics', JSON.stringify(res.data));
            }
        } catch (err) {
            console.warn('[Dashboard] Metrics fetch error (using cached):', err.message);
        }
    }, [api]);

    const fetchDashboardData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        setIsRefreshing(true);
        try {
            await fetchMetrics();

            const [meRes, txRes, leaderboardRes] = await Promise.all([
                api.get('/auth/me').catch(() => null),
                api.get('/dashboard/transactions').catch(err => {
                    console.warn('[Dashboard] Tx fetch error:', err.message);
                    return { data: [] };
                }),
                api.get('/dashboard/leaderboard').catch(() => ({ data: [] }))
            ]);

            if (meRes?.data) {
                setUser(meRes.data);
                localStorage.setItem('gp_cached_user', JSON.stringify(meRes.data));
            }

            const txList = Array.isArray(txRes.data) 
                ? txRes.data 
                : (txRes.data?.transactions || []);
            setTransactions(txList);
            const lbList = Array.isArray(leaderboardRes.data) 
                ? leaderboardRes.data 
                : (leaderboardRes.data?.leaderboard || []);
            setLeaderboard(lbList);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [api, fetchMetrics]);

    useEffect(() => {
        fetchDashboardData(true);

        // Mobile lifecycle: Auto-refresh balance and user state when returning to tab/app without requiring reload
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchMetrics();
                api.get('/auth/me').then(res => {
                    if (res?.data) setUser(res.data);
                }).catch(() => {});
            }
        };

        const handleFocus = () => {
            fetchMetrics();
            api.get('/auth/me').then(res => {
                if (res?.data) setUser(res.data);
            }).catch(() => {});
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        // Background polling for mobile/desktop every 25 seconds
        const pollInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchMetrics();
            }
        }, 25000);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
            clearInterval(pollInterval);
        };
    }, [fetchDashboardData, fetchMetrics]);

    const handleRequestPassword = (bankAccount) => {
        setPendingWithdrawBank(bankAccount);
        setShowWithdrawModal(false);
        setShowPasswordModal(true);
    };

    const handleWithdraw = async (bankAccount, password) => {
        setIsWithdrawing(true);
        try {
            if (user?.payoutLocked || user?.accountStatus === 'suspended') {
                setShowPasswordModal(false);
                setShowWithdrawModal(false);
                const msg = user?.payoutLockReason
                    ? `Withdrawals are locked for your account: ${user.payoutLockReason}. Please contact support at https://gurshapay.com/support.`
                    : "Withdrawals are locked on your account. Please contact support at https://gurshapay.com/support.";
                setAlert({ message: msg, type: "error" });
                setIsWithdrawing(false);
                return;
            }

            const availableBal = Number(metrics.availableBalance || metrics.walletBalance || metrics.wallet_balance || metrics.pending_balance || 0);
            const withdrawAmount = withdrawType === 'all' ? availableBal : Number(customAmount);

            if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
                setAlert({ message: "Please specify a valid withdrawal amount.", type: "error" });
                setIsWithdrawing(false);
                return;
            }

            if (withdrawAmount > availableBal) {
                setAlert({ message: `Insufficient balance. Available: ${availableBal.toFixed(2)} ETB.`, type: "error" });
                setIsWithdrawing(false);
                return;
            }

            const activePayoutMethod = bankAccount ? 'bank' : (user?.payoutMethod || 'telebirr');
            const payload = {
                amount: withdrawAmount,
                type: withdrawType,
                payoutMethod: activePayoutMethod,
                password: password
            };
            if (bankAccount) {
                payload.bankAccount = bankAccount;
            }
            const res = await api.post('/dashboard/withdraw', payload);
            setShowPasswordModal(false);
            setPendingWithdrawBank(null);
            setWithdrawSuccessData({
                amount: withdrawAmount,
                newBalance: res.data.newBalance !== undefined ? res.data.newBalance : Math.max(0, availableBal - withdrawAmount),
                payoutMethod: activePayoutMethod
            });
            setCustomAmount('');
            fetchDashboardData();
        } catch (error) {
            console.error("Withdrawal error:", error);
            setShowPasswordModal(false);
            const errData = error.response?.data;
            const errMsg = errData?.error || error.message || "Withdrawal failed";
            setAlert({ message: errMsg, type: "error" });
        }
        setIsWithdrawing(false);
    };

    const handleLogoUpload = async (file, accountIndex) => {
        try {
            const formData = new FormData();
            formData.append('logo', file);
            const res = await api.post('/auth/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.logoUrl) {
                const newAccounts = [...bankAccounts];
                newAccounts[accountIndex].logoUrl = res.data.logoUrl;
                setBankAccounts(newAccounts);

                const saveRes = await api.post('/auth/update-profile', {
                    payoutMethod,
                    bankAccounts: newAccounts
                });
                setUser(saveRes.data);
                triggerNotification({
                    title: 'Logo Updated',
                    message: 'Bank logo saved successfully.',
                    type: 'success'
                });
            }
        } catch (error) {
            setAlert({ message: "Failed to upload bank logo", type: "error" });
        }
    };

    const handleSavePayoutSettings = async (e) => {
        e.preventDefault();
        setSavingPayout(true);
        try {
            const res = await api.post('/auth/update-profile', {
                payoutMethod,
                bankAccounts: payoutMethod === 'bank' ? bankAccounts : undefined
            });
            setUser(res.data);
            setAlert({ message: t('changesSavedShort'), type: 'success' });
        } catch (error) {
            setAlert({ message: error.response?.data?.error || "Failed to save payout settings", type: "error" });
        }
        setSavingPayout(false);
    };

    const canonicalOrigin = (typeof window !== 'undefined' && window.location.hostname.includes('gurshapay.com'))
        ? 'https://www.gurshapay.com'
        : window.location.origin;
    const tipUrl = window.location.origin + '/' + (user?.username || '');
    const obsUrl = canonicalOrigin + '/overlay/' + (user?.username || user?._id || '');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tipUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyObsUrl = () => {
        navigator.clipboard.writeText(obsUrl);
        setObsCopied(true);
        setTimeout(() => setObsCopied(false), 2000);
    };

    const maskPhone = (phone) => {
        if (!phone) return 'Supporter';
        if (phone.length >= 10) return phone.slice(0, 4) + '****' + phone.slice(-2);
        return phone;
    };

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        const list = Array.isArray(transactions) 
            ? transactions 
            : (transactions?.transactions || []);
        return list.filter(tx => {
            if (txFilter === 'tips' && tx.type !== 'tip') return false;
            if (txFilter === 'withdrawals' && tx.type === 'tip') return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const phone = tx.tipperPhone ? tx.tipperPhone.toLowerCase() : '';
                const msg = tx.message ? tx.message.toLowerCase() : '';
                return phone.includes(q) || msg.includes(q);
            }
            return true;
        });
    }, [transactions, txFilter, searchQuery]);

    const currentKycStatus = (user?.kycStatus || metrics?.kycStatus || 'none').toLowerCase();
    const isVerified = (currentKycStatus === 'approved' || currentKycStatus === 'verified') && currentKycStatus !== 'rejected' && user?.isVerified !== false;
    const isKycRejected = currentKycStatus === 'rejected';
    const isKycPending = currentKycStatus === 'pending' || currentKycStatus === 'under_review';

    // Resolve Active Payout Rail Logo
    const activeBankName = user?.payoutMethod === 'bank' ? bankAccounts[0]?.bankName : 'Telebirr';
    const activeRailLogo = user?.payoutMethod === 'bank'
        ? (bankAccounts[0]?.logoUrl || getBankLogo(activeBankName))
        : '/banks/telebirr.jpg';

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

                {/* Telegram 1-Click Deep-Link Connect Banner */}
                <TelegramConnectBanner />

                {/* Dashboard Executive Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 1.75rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                <span>{t('welcome')}, {user?.name?.split(' ')[0] || 'Creator'}</span>
                                {isVerified && <VerifiedBlueTick size={22} title="GurshaPay Verified Creator" />}
                                {user?.customCommissionRate === 0 && (
                                    <span className="badge badge-vip" title="VIP Genesis Creator (0% Platform Fee)">👑 VIP (0% Fee)</span>
                                )}
                                {user?.customCommissionRate === 0.05 && (
                                    <span className="badge badge-growth" title="Growth Tier Creator (5% Platform Fee)">⚡ Growth (5% Fee)</span>
                                )}
                            </h1>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: 0 }}>
                            {t('dashboardSubtitle') || 'Real-time overview of your monetization and incoming Telebirr support.'}
                        </p>
                    </div>

                    <div className="desktop-only" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <DirectChatDrawer />
                        <NotificationDrawer />
                        <a href={tipUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <Button variant="outline" size="sm" icon={ExternalLink} iconPosition="right">
                                {t('viewPublicPage')}
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Handshake-Style Action Checklist */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '1.25rem', marginTop: '0.5rem', marginBottom: '2rem',
                    boxShadow: 'var(--shadow-xs)',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                Creator Monetization Checklist
                            </h3>
                            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                                {t('checklistSubtitle') || 'Complete these steps to maximize your tip conversion'}
                            </span>
                        </div>
                        <span style={{ fontSize: '0.725rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                            {isVerified ? (t('threeOfThreeCompleted') || '3 of 3 Completed') : (t('twoOfThreeCompleted') || '2 of 3 Completed')}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem', width: '100%' }}>
                        {/* Item 1: Payout Method */}
                        <div 
                            onClick={() => {
                                const el = document.getElementById('payout-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} color="var(--primary)" />
                                <div>
                                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>{t('setupPayoutRail') || 'Set up payout rail'}</div>
                                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t('telebirrBankConnected') || 'Telebirr / Bank connected'}</div>
                                </div>
                            </div>
                            <Badge variant="success" size="sm">{t('active') || 'Active'}</Badge>
                        </div>

                        {/* Item 2: KYC Identity */}
                        <div 
                            onClick={() => { if (!isVerified) setShowForcedKYCModal(true); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1.5px solid ' + (isKycRejected ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'), cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = isKycRejected ? 'var(--danger, #EF4444)' : 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = isKycRejected ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {isVerified ? (
                                    <CheckCircle size={16} color="var(--primary)" />
                                ) : isKycRejected ? (
                                    <AlertTriangle size={16} color="var(--danger, #EF4444)" />
                                ) : isKycPending ? (
                                    <Clock size={16} color="var(--info, #3B82F6)" />
                                ) : (
                                    <ShieldCheck size={16} color="var(--warning)" />
                                )}
                                <div>
                                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: isKycRejected ? 'var(--danger, #EF4444)' : 'var(--text-main)' }}>
                                        {t('verifyNationalId') || 'Verify National ID'}
                                    </div>
                                    <div style={{ fontSize: '0.725rem', color: isKycRejected ? 'var(--danger, #EF4444)' : 'var(--text-muted)' }}>
                                        {isKycRejected 
                                            ? (t('kycRejectedNotice') || 'Verification Rejected • Tap to Resubmit') 
                                            : isKycPending 
                                            ? (t('kycUnderReview') || 'Under Review') 
                                            : (t('faydaIdPassport') || 'Fayda ID / Passport')}
                                    </div>
                                </div>
                            </div>
                            <Badge variant={isVerified ? 'success' : isKycRejected ? 'danger' : isKycPending ? 'info' : 'warning'} size="sm">
                                {isVerified 
                                    ? (t('verified') || 'Verified') 
                                    : isKycRejected 
                                    ? (t('rejected') || 'Rejected') 
                                    : isKycPending 
                                    ? (t('reviewing') || 'Reviewing') 
                                    : (t('required') || 'Required')}
                            </Badge>
                        </div>

                        {/* Item 3: Public Page */}
                        <div 
                            onClick={copyToClipboard}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} color="var(--primary)" />
                                <div>
                                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>{t('shareYourLink') || 'Share your link'}</div>
                                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>gurshapay.com/@{user?.username}</div>
                                </div>
                            </div>
                            <Badge variant="primary" size="sm">{t('ready') || 'Ready'}</Badge>
                        </div>
                    </div>
                </div>

                {/* KYC Warning Banner if needed */}
                {!isVerified && (
                    <div style={{
                        background: 'rgba(217, 119, 6, 0.08)',
                        border: '1px solid var(--warning)',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '1.75rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <AlertTriangle size={20} color="var(--warning)" style={{ flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    {user?.kycStatus === 'pending' ? 'Identity verification in review' : 'National ID Verification Required'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {user?.kycStatus === 'pending' ? 'Our compliance team is verifying your Fayda ID / Passport. Direct payouts unlock upon approval.' : 'Verify your national ID to unlock instant Telebirr & Multi-Bank withdrawals.'}
                                </div>
                            </div>
                        </div>
                        {user?.kycStatus !== 'pending' && (
                            <Button variant="primary" size="sm" onClick={() => setShowForcedKYCModal(true)}>
                                Verify on Mobile
                            </Button>
                        )}
                    </div>
                )}

                {/* 4 HIGH-FIDELITY TOP METRIC CARDS */}
                <div className="dashboard-metrics-grid" style={{ marginBottom: '1.75rem' }}>
                    {/* Card 1: WITHDRAWABLE BALANCE */}
                    <div
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            padding: '1.4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        Withdrawable Balance
                                    </span>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                                    <button
                                        type="button"
                                        title="Refresh balance"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fetchMetrics();
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '2px 4px',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            opacity: 0.7
                                        }}
                                    >
                                        <RefreshCw size={12} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                                    </button>
                                </div>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Wallet size={16} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    {isLoading ? '...' : Number(metrics?.availableBalance ?? metrics?.walletBalance ?? metrics?.wallet_balance ?? 0).toFixed(2)}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>ETB</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={ArrowUpRight}
                                iconPosition="right"
                                disabled={Number(metrics?.availableBalance ?? metrics?.walletBalance ?? metrics?.wallet_balance ?? 0) <= 0 || !isVerified}
                                onClick={() => {
                                    if (user?.payoutLocked || user?.accountStatus === 'suspended') {
                                        setAlert({
                                            message: user?.payoutLockReason
                                                ? `Withdrawals are locked: ${user.payoutLockReason}. Please contact support at https://gurshapay.com/support.`
                                                : "Withdrawals are locked on your account. Please contact support at https://gurshapay.com/support.",
                                            type: "error"
                                        });
                                        return;
                                    }
                                    if (!isVerified) {
                                        setShowForcedKYCModal(true);
                                    } else {
                                        setShowWithdrawModal(true);
                                    }
                                }}
                            >
                                {t('withdrawFunds')}
                            </Button>
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                                {user?.payoutLocked ? ('🔒 ' + (t('payoutsLocked') || 'Payouts locked')) : isKycRejected ? ('⚠️ ' + (t('rejected') || 'KYC Rejected')) : isVerified ? ('⚡ ' + (t('instantPayout') || 'Instant payout')) : ('🔒 ' + (t('kycRequiredNotice') || 'KYC required'))}
                            </span>
                        </div>

                        {user?.payoutLocked && (
                            <div style={{
                                marginTop: '10px',
                                fontSize: '11.5px',
                                color: '#EF4444',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '8px',
                                padding: '6px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Lock size={12} color="#EF4444" style={{ flexShrink: 0 }} />
                                <span>
                                    Withdrawals locked{user?.payoutLockReason ? `: ${user.payoutLockReason}` : ''}.{' '}
                                    <a 
                                        href="https://gurshapay.com/support" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'underline' }}
                                    >
                                        Contact support
                                    </a>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Card 2: PENDING BALANCE (24H LIQUIDITY LOCK) */}
                    <div
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            padding: '1.4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = '#D97706';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        Pending Balance
                                    </span>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
                                </div>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Clock size={16} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    {isLoading ? '...' : Number(metrics?.pendingBalance ?? metrics?.pending_balance ?? 0).toFixed(2)}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#D97706' }}>ETB</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Lock size={12} color="#D97706" />
                            <span>Matures in 24h liquidity lock</span>
                        </div>
                    </div>

                    {/* Card 3: TOTAL TIPS */}
                    <div
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            padding: '1.4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {t('totalTips')}
                                </span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(4, 120, 87, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TrendingUp size={16} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    {isLoading ? '...' : Number(metrics?.total_earned || 0).toFixed(2)}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)' }}>ETB</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Sparkles size={12} color="#D97706" />
                            <span>Lifetime total received from audience</span>
                        </div>
                    </div>

                    {/* Card 4: PAYOUT RAIL (WITH REAL BANK LOGO) */}
                    <div
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            padding: '1.4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                        onClick={() => {
                            const el = document.getElementById('payout-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Payout Rail
                                </span>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                                    {activeRailLogo ? (
                                        <img src={activeRailLogo} alt={activeBankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <Building size={16} color="var(--primary)" />
                                    )}
                                </div>
                            </div>

                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.payoutMethod === 'bank' ? (bankAccounts[0]?.bankName || 'Bank Transfer') : 'Telebirr Wallet'}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.725rem' }}>
                            <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.payoutMethod === 'bank' ? (bankAccounts[0]?.accountNumber || 'Configured') : (user?.telebirr_number || user?.telebirrAccount?.phoneNumber || 'Not Configured')}
                            </span>
                            <Badge variant="primary" size="sm">Active Rail</Badge>
                        </div>
                    </div>
                </div>

                {/* QUICK INTEGRATIONS & SHARING TOOLSTRIP */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                    {/* Share Tipping Handle */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                {t('tippingLinkTitle')}
                            </span>
                            <Badge variant="primary" size="sm">Public Link</Badge>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                            {t('tippingLinkDesc')}
                        </p>
                        <div
                            onClick={copyToClipboard}
                            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg-subtle)', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            title="Click to copy link"
                        >
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', paddingLeft: '0.25rem' }}>
                                {tipUrl}
                            </span>
                            <Button variant="primary" size="sm" icon={copied ? CheckCircle : Copy} onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}>
                                {copied ? t('copied') : t('copy')}
                            </Button>
                        </div>
                    </div>

                    {/* Stream Overlay (OBS & TikTok LIVE Studio) */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Sparkles size={16} color="#10B981" /> Stream Overlay
                            </span>
                            <Badge variant="success" size="sm">OBS & TikTok LIVE</Badge>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.45, marginBottom: '0.5rem' }}>
                            Paste this URL into TikTok LIVE Studio or OBS as a 'Webpage' or 'Browser Source' to see live tip alerts on your stream.
                        </p>
                        <div style={{ fontSize: '0.73rem', color: '#10B981', fontWeight: 600, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '6px', padding: '0.35rem 0.6rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>💡 Recommended Size:</span>
                            <span style={{ color: 'var(--text-main)' }}><strong>TikTok LIVE Studio:</strong> 1080 × 1920 (Portrait) • <strong>OBS:</strong> 1920 × 1080</span>
                        </div>
                        <div
                            onClick={copyObsUrl}
                            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg-subtle)', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease', marginBottom: '0.75rem' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            title="Click to copy Stream Overlay URL"
                        >
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
                                {obsUrl}
                            </span>
                            <Button variant="primary" size="sm" icon={obsCopied ? CheckCircle : Copy} onClick={(e) => { e.stopPropagation(); copyObsUrl(); }}>
                                {obsCopied ? t('copied') : 'Copy Link'}
                            </Button>
                        </div>

                        {/* Interactive Multi-Tier Test Preview Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
                                Test Alert:
                            </span>
                            <a href={`${obsUrl}?test=masinqo`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                                    🎻 10 ETB (Masenqo)
                                </Button>
                            </a>
                            <a href={`${obsUrl}?test=bible`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                                    📖 7 ETB (Bible)
                                </Button>
                            </a>
                            <a href={`${obsUrl}?test=lion`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                                    🦁 5000 ETB (Lion)
                                </Button>
                            </a>
                            <a href={`${obsUrl}?test=queue`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                                    ⚡ Test Queue
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2-COLUMN SECTION: RECENT TRANSACTIONS & TOP SUPPORTERS */}
                <div className="dashboard-two-col-grid" style={{ marginBottom: '2rem' }}>
                    {/* Recent Transactions List with Tab Filter */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xs)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                    {t('recentTransactions')}
                                </h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {filteredTransactions.length} activity records
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {/* Show items count selector */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--card-bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                    <span>Show:</span>
                                    {[10, 20, 30, 50].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => {
                                                setTxPageSize(num);
                                                setVisibleTxCount(num);
                                            }}
                                            style={{
                                                border: 'none',
                                                background: txPageSize === num ? 'var(--card-bg)' : 'transparent',
                                                color: txPageSize === num ? 'var(--primary)' : 'var(--text-muted)',
                                                padding: '0.2rem 0.45rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                boxShadow: txPageSize === num ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                                transition: 'all 0.12s ease'
                                            }}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                {/* Filter Tabs */}
                                <div style={{ display: 'flex', background: 'var(--card-bg-subtle)', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                    <button
                                        onClick={() => setTxFilter('all')}
                                        style={{
                                            border: 'none',
                                            background: txFilter === 'all' ? 'var(--card-bg)' : 'transparent',
                                            color: txFilter === 'all' ? 'var(--primary)' : 'var(--text-muted)',
                                            padding: '0.3rem 0.7rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: txFilter === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                            transition: 'all 0.12s ease'
                                        }}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setTxFilter('tips')}
                                        style={{
                                            border: 'none',
                                            background: txFilter === 'tips' ? 'var(--card-bg)' : 'transparent',
                                            color: txFilter === 'tips' ? 'var(--primary)' : 'var(--text-muted)',
                                            padding: '0.3rem 0.7rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: txFilter === 'tips' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                            transition: 'all 0.12s ease'
                                        }}
                                    >
                                        Tips
                                    </button>
                                    <button
                                        onClick={() => setTxFilter('withdrawals')}
                                        style={{
                                            border: 'none',
                                            background: txFilter === 'withdrawals' ? 'var(--card-bg)' : 'transparent',
                                            color: txFilter === 'withdrawals' ? 'var(--primary)' : 'var(--text-muted)',
                                            padding: '0.3rem 0.7rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: txFilter === 'withdrawals' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                            transition: 'all 0.12s ease'
                                        }}
                                    >
                                        Payouts
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.75rem' }} />
                                <div>Loading transaction history...</div>
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <History size={32} style={{ opacity: 0.35, margin: '0 auto 0.75rem' }} />
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('noTransactionsYet')}</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Your incoming tips and withdrawals will appear here automatically.</div>
                            </div>
                        ) : (
                            <div className="table-responsive-wrapper" style={{ border: 'none' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Supporter / Method</th>
                                            <th style={{ textAlign: 'right' }}>Amount</th>
                                            <th style={{ textAlign: 'right' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.slice(0, visibleTxCount).map((tx) => {
                                            const isWithdrawal = tx.type === 'withdrawal';
                                            const rawStatus = (tx.rawStatus || tx.status || '').toUpperCase();
                                            const isSuccess = rawStatus === 'SUCCESS' || rawStatus === 'COMPLETED';
                                            const isPending = rawStatus === 'PENDING' || rawStatus === 'REQUESTED' || rawStatus === 'PROCESSING';
                                            const isRefunded = rawStatus === 'REFUNDED' || rawStatus === 'REJECTED' || rawStatus === 'FAILED' || rawStatus === 'CANCELLED';

                                            let methodLabel = '';
                                            if (isWithdrawal) {
                                                const destName = tx.bankName || (tx.payoutMethod === 'bank' ? 'Bank Account' : 'Telebirr');
                                                const destAcc = tx.accountNumberMasked || tx.accountNumber || '';
                                                methodLabel = `${destName}${destAcc ? ` (${destAcc})` : ''}`;
                                            } else {
                                                methodLabel = tx.supporterName && tx.supporterName !== 'Fan' ? tx.supporterName : (tx.tipperPhone ? maskPhone(tx.tipperPhone) : 'Supporter Tip');
                                            }

                                            return (
                                                <tr key={tx._id || tx.id} style={{ transition: 'background 0.12s ease' }}>
                                                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                        {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                            <div style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '50%',
                                                                background: isWithdrawal ? (isRefunded ? 'rgba(239, 68, 68, 0.12)' : (isPending ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)')) : 'var(--success-light)',
                                                                color: isWithdrawal ? (isRefunded ? 'var(--danger)' : (isPending ? '#D97706' : 'var(--success)')) : 'var(--success)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                {isWithdrawal ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                                                    {isWithdrawal ? `Withdrawal • ${methodLabel}` : methodLabel}
                                                                </div>
                                                                {tx.message && (
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        "{tx.message}"
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '0.9rem', color: isWithdrawal ? 'var(--text-main)' : 'var(--success)', whiteSpace: 'nowrap' }}>
                                                        {isWithdrawal ? '-' : '+'}{Number(tx.amount || tx.grossAmount || 0).toFixed(2)} ETB
                                                    </td>
                                                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                        <Badge
                                                            variant={isSuccess ? 'success' : isPending ? 'warning' : 'danger'}
                                                            size="sm"
                                                        >
                                                            {isSuccess ? 'Completed' : isPending ? 'Pending' : (rawStatus === 'REFUNDED' || rawStatus === 'REJECTED' ? 'Rejected & Refunded' : 'Failed')}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {visibleTxCount < filteredTransactions.length && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                        <button
                                            onClick={() => setVisibleTxCount(prev => Math.min(filteredTransactions.length, prev + txPageSize))}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.55rem 1.25rem',
                                                background: 'var(--card-bg-subtle)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                color: 'var(--text-main)',
                                                fontWeight: 700,
                                                fontSize: '0.825rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <span>See More ({filteredTransactions.length - visibleTxCount} remaining)</span>
                                            <ChevronDown size={15} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Top Fans Leaderboard */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xs)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                    {t('leaderboardTitle')}
                                </h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top supporters by total ETB</span>
                            </div>
                            <Badge variant="primary" size="sm">Top 5</Badge>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.75rem' }} />
                                <div>Loading leaderboard...</div>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <User size={32} style={{ opacity: 0.35, margin: '0 auto 0.75rem' }} />
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('noTipsYet')}</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{t('noTipsSubtitle')}</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {leaderboard.map((fan, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 0.95rem',
                                            background: 'var(--card-bg-subtle)',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            transition: 'all 0.15s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                    >
                                        <div
                                            style={{
                                                width: '26px',
                                                height: '26px',
                                                borderRadius: '50%',
                                                background: idx === 0 ? '#FBBC05' : idx === 1 ? '#94A3B8' : idx === 2 ? '#D97706' : 'var(--border-color)',
                                                color: '#FFFFFF',
                                                fontWeight: 900,
                                                fontSize: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {maskPhone(fan._id)}
                                            </div>
                                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                                                {fan.count || 1} support payments
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 900, fontSize: '0.925rem', color: 'var(--primary)' }}>
                                            {Number(fan?.totalContributed || fan?.totalTipped || fan?.total || 0).toFixed(2)} ETB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* PAYOUT ROUTING & MULTI-BANK MANAGER */}
                <div id="payout-section" style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '1.75rem',
                    marginBottom: '2rem',
                    boxShadow: 'var(--shadow-xs)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                {t('payoutDetailsTitle')}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                                {t('payoutDetailsDesc')}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSavePayoutSettings}>
                        {/* Payout Method Toggle */}
                        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--card-bg-subtle)', padding: '0.25rem', borderRadius: '8px', marginBottom: '1.5rem', width: 'fit-content', border: '1px solid var(--border-color)' }}>
                            <button
                                type="button"
                                onClick={() => setPayoutMethod('telebirr')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: payoutMethod === 'telebirr' ? 'var(--card-bg)' : 'transparent',
                                    color: payoutMethod === 'telebirr' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: payoutMethod === 'telebirr' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                Telebirr Wallet
                            </button>
                            <button
                                type="button"
                                onClick={() => setPayoutMethod('bank')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: payoutMethod === 'bank' ? 'var(--card-bg)' : 'transparent',
                                    color: payoutMethod === 'bank' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: payoutMethod === 'bank' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                Bank Accounts
                            </button>
                        </div>

                        {payoutMethod === 'telebirr' ? (
                            <div style={{ background: 'var(--card-bg-subtle)', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                                        <img src="/banks/telebirr.jpg" alt="Telebirr" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                            {t('telebirrWithdrawNotice')}{' '}
                                            <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>
                                                {user?.telebirr_number || user?.telebirrAccount?.phoneNumber || 'Not Configured'}
                                            </strong>
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            ✓ Verified automatic payout rail
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    icon={Edit2}
                                    onClick={() => setShowChangeTelebirrModal(true)}
                                    style={{ fontWeight: 700, borderColor: 'var(--border-color)' }}
                                >
                                    {t('changeTelebirrNumber') || 'Change Number'}
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                {bankAccounts.map((account, index) => {
                                    const logo = account.logoUrl || getBankLogo(account.bankName);
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '1.25rem',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--card-bg-subtle)',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <label
                                                        title="Upload / Change logo"
                                                        style={{ position: 'relative', width: '38px', height: '38px', cursor: 'pointer', flexShrink: 0 }}
                                                    >
                                                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                                                            {logo ? (
                                                                <img src={logo} alt={account.bankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            ) : (
                                                                <div style={{ width: '100%', height: '100%', borderRadius: '6px', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                                    {getBankInitials(account.bankName)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#10B981', color: 'white', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card-bg)' }}>
                                                            <Edit2 size={8} />
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    handleLogoUpload(e.target.files[0], index);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                    <div>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Bank Account {index + 1}</span>
                                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                                                            <Upload size={10} style={{ display: 'inline', marginRight: '3px' }} />
                                                            {account.logoUrl ? 'Change Custom Logo' : 'Upload Custom Logo'}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        handleLogoUpload(e.target.files[0], index);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                {bankAccounts.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))}
                                                        style={{ background: 'var(--danger-light)', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '6px' }}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                                <select
                                                    className="form-select"
                                                    value={account.bankName}
                                                    onChange={e => {
                                                        const newAccounts = [...bankAccounts];
                                                        newAccounts[index].bankName = e.target.value;
                                                        setBankAccounts(newAccounts);
                                                    }}
                                                    required
                                                >
                                                    <option value="">{t('selectBank')}</option>
                                                    <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                                                    <option value="Awash International Bank">Awash International Bank</option>
                                                    <option value="Dashen Bank">Dashen Bank</option>
                                                    <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                                                    <option value="Wegagen Bank">Wegagen Bank</option>
                                                    <option value="Nib International Bank">Nib International Bank</option>
                                                    <option value="Cooperative Bank of Oromia">Cooperative Bank of Oromia</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder={t('accountNumber')}
                                                    value={account.accountNumber}
                                                    onChange={e => {
                                                        const newAccounts = [...bankAccounts];
                                                        newAccounts[index].accountNumber = e.target.value;
                                                        setBankAccounts(newAccounts);
                                                    }}
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder={t('accountHolder')}
                                                    value={account.accountHolderName}
                                                    onChange={e => {
                                                        const newAccounts = [...bankAccounts];
                                                        newAccounts[index].accountHolderName = e.target.value;
                                                        setBankAccounts(newAccounts);
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => setBankAccounts([...bankAccounts, { bankName: '', accountNumber: '', accountHolderName: '', logoUrl: '' }])}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--primary)',
                                        border: '1px dashed var(--border-color)',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    + Add Another Bank Account
                                </button>
                            </div>
                        )}

                        <Button type="submit" variant="primary" size="md" loading={savingPayout}>
                            {t('savePayoutDetails')}
                        </Button>
                    </form>
                </div>

                {/* Withdraw Modal */}
                <WithdrawModal
                    show={showWithdrawModal}
                    onClose={() => setShowWithdrawModal(false)}
                    withdrawType={withdrawType}
                    setWithdrawType={setWithdrawType}
                    balance={metrics?.availableBalance || metrics?.walletBalance || metrics?.wallet_balance || metrics?.pending_balance || 0}
                    customAmount={customAmount}
                    setCustomAmount={setCustomAmount}
                    onConfirm={handleRequestPassword}
                    user={user}
                    onRequestChangeTelebirr={() => setShowChangeTelebirrModal(true)}
                />

                {/* Change Telebirr Number Modal */}
                <ChangeTelebirrModal
                    show={showChangeTelebirrModal}
                    onClose={() => setShowChangeTelebirrModal(false)}
                    user={user}
                    onSuccess={(updatedUser) => {
                        if (updatedUser) setUser(prev => ({ ...prev, ...updatedUser }));
                        setAlert({
                            message: t('phoneUpdatedSuccess') || 'Telebirr payout number updated successfully!',
                            type: 'success'
                        });
                        fetchDashboardData(true);
                    }}
                    onReturnToWithdraw={() => setShowWithdrawModal(true)}
                />

                {/* Password Modal Prompt */}
                <PasswordModal
                    show={showPasswordModal}
                    onClose={() => {
                        setShowPasswordModal(false);
                        setPendingWithdrawBank(null);
                    }}
                    onConfirm={(pwd) => handleWithdraw(pendingWithdrawBank, pwd)}
                    loading={isWithdrawing}
                />

                {/* Withdraw Success Modal */}
                <WithdrawSuccessModal
                    data={withdrawSuccessData}
                    onClose={() => setWithdrawSuccessData(null)}
                    user={user}
                />

                {/* Forced Mobile KYC Verification Modal */}
                <ForcedMobileKYCModal
                    isOpen={showForcedKYCModal}
                    onClose={() => setShowForcedKYCModal(false)}
                    user={user}
                    onRefreshStatus={fetchDashboardData}
                />
            </main>
        </div>
    );
}
