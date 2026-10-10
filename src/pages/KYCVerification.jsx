import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import DirectChatDrawer from '../components/DirectChatDrawer';
import {
    ShieldCheck, Smartphone, CheckCircle, ArrowRight,
    Copy, Check, RefreshCw, Menu, X, ExternalLink, QrCode, Lock, AlertTriangle
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { GooglePlayIcon } from '../components/ForcedMobileKYCModal';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

export default function KYCVerification() {
    const { user, api, setUser } = useAuth();
    const { triggerNotification } = useNotification();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.gursha.pay';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(playStoreUrl)}`;

    const isVerified = user?.kycStatus === 'approved' || user?.isVerified;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(playStoreUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        triggerNotification({
            title: 'Link Copied',
            message: 'Google Play Store link copied to clipboard.',
            type: 'info'
        });
    };

    const handleCheckStatus = async () => {
        setRefreshing(true);
        try {
            const res = await api.get('/auth/me');
            if (res.data) {
                setUser(res.data);
                triggerNotification({
                    title: 'Status Updated',
                    message: res.data.kycStatus === 'approved' 
                        ? 'Congratulations! Your KYC is approved.' 
                        : `Current status: ${res.data.kycStatus || 'Action Required'}`,
                    type: res.data.kycStatus === 'approved' ? 'success' : 'info'
                });
            }
        } catch (err) {
            console.error('Failed to refresh KYC status:', err);
        } finally {
            setTimeout(() => setRefreshing(false), 600);
        }
    };

    return (
        <div className="app-layout">
            {/* Mobile Top Header */}
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

            <main className="main-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>National ID & KYC Verification</span>
                            <ShieldCheck size={26} color="var(--primary)" />
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
                            Secure compliance verification for instant Telebirr and CBE bank payouts.
                        </p>
                    </div>

                    <div className="desktop-only" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <DirectChatDrawer />
                        <NotificationDrawer />
                        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </div>

                {/* If already approved */}
                {isVerified ? (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1.5px solid var(--primary)',
                        borderRadius: '20px',
                        padding: '2.5rem',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.25rem'
                        }}>
                            <CheckCircle size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                            Account Fully Verified!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                            Your Fayda National ID and identity verification is active. You have full access to high-volume Telebirr, CBE, and multi-bank withdrawals.
                        </p>
                        <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                ) : (
                    /* Interactive Forced Mobile Experience */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Main Callout Hero Card */}
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1.5px solid var(--border-color)',
                            borderRadius: '24px',
                            padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                            boxShadow: 'var(--shadow-sm)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                                <Badge variant="warning" size="md">
                                    <Lock size={12} style={{ marginRight: '4px' }} />
                                    Mobile App Required
                                </Badge>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    National Bank of Ethiopia FinTech Standard
                                </span>
                            </div>

                            <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.6rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                                Verify Fayda National ID on GurshaPay Mobile App
                            </h2>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                To comply with national identity verification requirements, biometric verification and Fayda ID verification must be performed live through the camera in the <strong>GurshaPay Mobile App</strong>.
                            </p>

                            {/* Two Column Interactive Center: QR Code + Steps */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: '1.75rem',
                                background: 'var(--card-bg-subtle)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                marginBottom: '2rem'
                            }}>
                                {/* QR Code Box */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                                    <div style={{
                                        background: '#FFFFFF',
                                        padding: '10px',
                                        borderRadius: '16px',
                                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid var(--border-color)',
                                        marginBottom: '0.85rem'
                                    }}>
                                        <img 
                                            src={qrCodeUrl} 
                                            alt="Scan to download GurshaPay App" 
                                            style={{ width: '150px', height: '150px', display: 'block', borderRadius: '10px' }} 
                                        />
                                    </div>
                                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        Scan with Mobile Camera
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        Direct link to Google Play Store
                                    </span>
                                </div>

                                {/* Step-by-Step Flow */}
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                                            1
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)' }}>Download GurshaPay App</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available on Google Play Store & Direct APK.</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                                            2
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)' }}>Scan Fayda ID & Live Selfie</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick and secure camera verification in under 60 seconds.</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                                            3
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)' }}>Instant Payout Unlock</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct Telebirr and Commercial Bank transfers activated.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
                                    <a 
                                        href={playStoreUrl} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Button variant="primary" size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <GooglePlayIcon size={18} />
                                            <span>Get on Google Play</span>
                                        </Button>
                                    </a>

                                    <Button 
                                        variant="outline" 
                                        size="md" 
                                        icon={copied ? Check : Copy} 
                                        onClick={handleCopyLink}
                                    >
                                        {copied ? 'Link Copied!' : 'Copy Play Store Link'}
                                    </Button>
                                </div>

                                <Button 
                                    variant="ghost" 
                                    size="md" 
                                    icon={RefreshCw} 
                                    onClick={handleCheckStatus}
                                    disabled={refreshing}
                                >
                                    {refreshing ? 'Checking Verification...' : 'I completed on mobile (Refresh)'}
                                </Button>
                            </div>
                        </div>

                        {/* Status Check Helper */}
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '16px',
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <AlertTriangle size={20} color="#D97706" />
                                <div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        Current Verification Status:
                                    </span>
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', fontWeight: 800, color: user?.kycStatus === 'pending' ? 'var(--info)' : '#D97706' }}>
                                        {user?.kycStatus === 'pending' ? 'Verification In Review' : 'Action Required (Unverified)'}
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleCheckStatus} disabled={refreshing}>
                                <RefreshCw size={14} style={{ marginRight: '6px' }} />
                                Refresh Status
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
