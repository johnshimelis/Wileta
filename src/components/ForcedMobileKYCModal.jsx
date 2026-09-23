import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Copy, RefreshCw, X, QrCode, Smartphone } from 'lucide-react';
import Button from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

// High-fidelity Official Google Play Store Vector Icon
export const GooglePlayIcon = ({ size = 20, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" style={{ flexShrink: 0, ...style }}>
        <path fill="#4285F4" d="M47.5 35.7C44.7 41.5 43 48.7 43 57.1v397.8c0 8.4 1.7 15.6 4.5 21.4l230.1-220.3L47.5 35.7z"/>
        <path fill="#EA4335" d="M47.5 35.7l230.1 220.3 74.9-71.7-279.9-147.7c-9.7-5.4-18.4-4.6-25.1-0.9z"/>
        <path fill="#FBBC05" d="M352.5 321.4l-74.9-71.7-230.1 220.3c6.7 3.7 15.4 4.5 25.1-0.9l279.9-147.7z"/>
        <path fill="#34A853" d="M451.9 238.1l-99.4-52.4-74.9 70.3 74.9 71.7 99.4-52.4c16.1-8.5 16.1-28.7 0-37.2z"/>
    </svg>
);

export default function ForcedMobileKYCModal({ isOpen, onClose, user, onRefreshStatus }) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showQrOnMobile, setShowQrOnMobile] = useState(false);
    const [isMobileView, setIsMobileView] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 640);

    // Track window resize for mobile layout
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 640);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Intercept phone hardware/browser back button:
    // Pushes modal state on open, closes modal on popstate so the user stays on dashboard!
    useEffect(() => {
        if (isOpen) {
            window.history.pushState({ modal: 'forced-kyc' }, '');

            const handlePopState = () => {
                if (onClose) onClose();
            };

            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.gursha.pay';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(playStoreUrl)}`;

    const handleClose = () => {
        if (window.history.state?.modal === 'forced-kyc') {
            window.history.back();
        } else if (onClose) {
            onClose();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(playStoreUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        if (onRefreshStatus) {
            await onRefreshStatus();
        }
        setTimeout(() => setRefreshing(false), 800);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem',
                background: 'rgba(9, 9, 11, 0.78)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                overflowY: 'auto'
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '24px',
                    maxWidth: '520px',
                    width: '100%',
                    maxHeight: 'min(92dvh, 680px)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    margin: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* 1. PINNED HEADER (Never cropped, always visible) */}
                <div style={{
                    padding: '1.2rem 1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: 'rgba(217, 119, 6, 0.12)',
                            border: '1px solid rgba(217, 119, 6, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D97706',
                            flexShrink: 0
                        }}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                                {t('mobileKycTitle', 'Mobile ID Verification')}
                            </h2>
                            <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
                                🔒 {t('faydaComplianceBadge', 'Fayda Biometric Compliance')}
                            </span>
                        </div>
                    </div>

                    {/* Clean Pinned Close Button */}
                    <button
                        onClick={handleClose}
                        aria-label="Close modal"
                        style={{
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            transition: 'all 0.15s ease',
                            flexShrink: 0
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* 2. SCROLLABLE BODY (Fits comfortably on all mobile screens) */}
                <div style={{
                    padding: '1.25rem 1.4rem',
                    overflowY: 'auto',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                        {t('biometricNotice', 'To comply with National Bank regulations and protect creator earnings, Fayda National ID and Facial Liveness verification must be completed securely via the GurshaPay Mobile App using on-device hardware biometrics.')}
                    </p>

                    {/* Step-by-Step Instructions & App Info */}
                    <div style={{
                        background: 'var(--card-bg-subtle)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '1rem 1.15rem'
                    }}>
                        {/* Desktop View: Side-by-Side QR Code */}
                        {!isMobileView ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{
                                    background: '#FFFFFF',
                                    padding: '6px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <img 
                                        src={qrCodeUrl} 
                                        alt="Scan to download GurshaPay on Google Play" 
                                        style={{ width: '108px', height: '108px', display: 'block', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        {t('step1GetApp', 'Quick 3-Step Verification:')}
                                    </div>
                                    <ol style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        <li>{t('step1GetAppDesc', 'Scan QR with your phone or click below')}</li>
                                        <li>{t('step2ScanOrOpenDesc', 'Sign in & complete the 60-second Fayda scan')}</li>
                                        <li>{t('instantPayoutsUnlocked', 'Instant approval unlocks all Telebirr & Bank payouts')}</li>
                                    </ol>
                                </div>
                            </div>
                        ) : (
                            /* Mobile View: Direct In-Device App Instructions (No wasted vertical QR space) */
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                                    <div style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '10px',
                                        background: 'var(--primary-light)',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Smartphone size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                            {t('verifyOnAndroidPhone', 'Verify on your Android Phone')}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {t('cameraBioRequired', 'Hardware camera & biometrics required')}
                                        </div>
                                    </div>
                                </div>

                                <ol style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                                    <li>{t('step1GetAppDesc', 'Install the official GurshaPay app directly from Google Play or download the verified APK.')}</li>
                                    <li>{t('step2ScanOrOpenDesc', 'Log into your account and complete verification')}</li>
                                    <li>{t('instantPayoutsUnlocked', 'Instant approval unlocks all Telebirr & Bank payouts')}</li>
                                </ol>

                                {/* Optional QR Code toggle for mobile */}
                                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-color)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowQrOnMobile(!showQrOnMobile)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--primary)',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: 0
                                        }}
                                    >
                                        <QrCode size={15} />
                                        {showQrOnMobile ? t('hideQrCode', 'Hide QR Code') : t('scanAnotherPhone', 'Scan with another phone (Show QR)')}
                                    </button>

                                    {showQrOnMobile && (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                                                <img 
                                                    src={qrCodeUrl} 
                                                    alt="Scan to download GurshaPay" 
                                                    style={{ width: '120px', height: '120px', display: 'block' }} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. PINNED FOOTER (Action Buttons always visible at bottom) */}
                <div style={{
                    padding: '1rem 1.4rem',
                    borderTop: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                }}>
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <a 
                            href={playStoreUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ flex: 1, textDecoration: 'none', minWidth: '170px' }}
                        >
                            <Button 
                                variant="primary" 
                                size="md" 
                                style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', height: '48px' }}
                            >
                                <GooglePlayIcon size={18} />
                                <span>{t('openInGooglePlay', 'Open Google Play Store')}</span>
                            </Button>
                        </a>

                        <Button 
                            variant="outline" 
                            size="md" 
                            icon={copied ? Check : Copy}
                            onClick={handleCopyLink}
                            style={{ minWidth: '120px', height: '48px' }}
                        >
                            {copied ? t('copiedDownloadLink', 'Copied!') : t('copyDownloadLink', 'Copy Link')}
                        </Button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {t('statusLabel', 'Status:')} <strong style={{ color: user?.kycStatus === 'pending' ? 'var(--info)' : '#D97706' }}>
                                {user?.kycStatus === 'pending' ? t('verificationInReview', 'Verification in Review ⏳') : t('verificationRequired', 'Verification Required 🔒')}
                            </strong>
                        </span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={RefreshCw} 
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            {refreshing ? t('checkingStatus', 'Checking...') : t('checkStatusBtn', 'Check Status')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
