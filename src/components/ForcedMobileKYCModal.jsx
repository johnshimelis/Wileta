import React, { useState } from 'react';
import { ShieldCheck, Smartphone, QrCode, ExternalLink, Check, Copy, RefreshCw, X, Lock } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';

export default function ForcedMobileKYCModal({ isOpen, onClose, user, onRefreshStatus }) {
    const [copied, setCopied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    if (!isOpen) return null;

    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.gurshapay.app';
    const apkDirectUrl = 'https://gurshapay.com/app-release.apk';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(playStoreUrl)}`;

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
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            background: 'rgba(9, 9, 11, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div 
                style={{
                    background: 'var(--card-bg)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '24px',
                    maxWidth: '560px',
                    width: '100%',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '50%',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <X size={18} />
                    </button>
                )}

                {/* Header Icon & Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: 'rgba(217, 119, 6, 0.12)',
                        border: '1px solid rgba(217, 119, 6, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#D97706'
                    }}>
                        <ShieldCheck size={26} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                                Mobile Verification Required
                            </h2>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 700 }}>
                            🔒 National ID & Biometric Security
                        </span>
                    </div>
                </div>

                {/* Explanatory Banner */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                    To comply with National Bank regulations and protect creator earnings, <strong>Fayda National ID</strong> and <strong>Facial Liveness</strong> verification must be completed securely through the <strong>GurshaPay Mobile App</strong> using on-device hardware biometrics.
                </p>

                {/* Interactive QR Code & Download Box */}
                <div style={{
                    background: 'var(--card-bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    {/* Dynamic QR Code */}
                    <div style={{
                        background: '#FFFFFF',
                        padding: '8px',
                        borderRadius: '14px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <img 
                            src={qrCodeUrl} 
                            alt="Scan to download GurshaPay" 
                            style={{ width: '120px', height: '120px', display: 'block', borderRadius: '8px' }} 
                        />
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Quick 3-Step Verification:
                        </div>
                        <ol style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <li>Scan QR with your phone or tap <strong>Google Play</strong> below</li>
                            <li>Sign in & complete the 60-second Fayda scan</li>
                            <li>Instant approval unlocks all <strong>Telebirr & Bank</strong> payouts</li>
                        </ol>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <a 
                            href={playStoreUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ flex: 1, textDecoration: 'none', minWidth: '180px' }}
                        >
                            <Button 
                                variant="primary" 
                                size="md" 
                                style={{ width: '100%', justifyContent: 'center' }}
                                icon={Smartphone}
                            >
                                Get on Google Play
                            </Button>
                        </a>

                        <Button 
                            variant="outline" 
                            size="md" 
                            icon={copied ? Check : Copy}
                            onClick={handleCopyLink}
                            style={{ minWidth: '130px' }}
                        >
                            {copied ? 'Link Copied!' : 'Copy Link'}
                        </Button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                            Status: <strong style={{ color: user?.kycStatus === 'pending' ? 'var(--info)' : '#D97706' }}>
                                {user?.kycStatus === 'pending' ? 'Verification in Review ⏳' : 'Verification Required 🔒'}
                            </strong>
                        </span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={RefreshCw} 
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            {refreshing ? 'Checking...' : 'Check Status'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
