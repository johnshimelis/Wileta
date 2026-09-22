import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, ExternalLink, RefreshCw, Send, Sparkles, Bell, ArrowRight } from 'lucide-react';

// Official Telegram Paper Airplane Icon
const TelegramIcon = ({ size = 20, color = "#FFFFFF" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M21.6 3.6L2.4 11.2C1.1 11.7 1.1 13.5 2.4 14L7.3 15.6L18.1 7.2C18.6 6.8 19.2 7.5 18.7 7.9L9.9 16.2L9.5 20.3C9.9 20.3 10.1 20.1 10.3 19.9L12.7 17.5L17.7 21.2C18.6 21.7 19.5 21.2 19.7 20.1L22.8 4.9C23.1 3.7 22.3 2.8 21.6 3.6Z"
            fill={color}
        />
    </svg>
);

export default function TelegramConnectBanner({ onConnected }) {
    const { user, api, setUser } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [waitingForHandshake, setWaitingForHandshake] = useState(false);
    const [error, setError] = useState(null);
    const [testAlertSent, setTestAlertSent] = useState(false);

    const isConnected = !!(user?.telegramChatId);

    // Handle 1-Click Telegram Deep Link Connection
    const handleConnectTelegram = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/user/telegram-link');
            const targetUrl = res.data?.url || res.data?.deepLink;

            if (targetUrl) {
                // Check if mobile browser to launch native Telegram app directly
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (isMobile) {
                    window.location.href = targetUrl;
                } else {
                    window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }
                setWaitingForHandshake(true);

                // Start active polling to detect when /start handshake completes
                let attempts = 0;
                const interval = setInterval(async () => {
                    attempts++;
                    try {
                        const meRes = await api.get('/auth/me');
                        const updatedUser = meRes.data;
                        if (updatedUser?.telegramChatId) {
                            setUser(prev => ({ ...prev, ...updatedUser }));
                            setWaitingForHandshake(false);
                            clearInterval(interval);
                            if (onConnected) onConnected();
                        }
                    } catch (_) {}

                    if (attempts > 15) {
                        clearInterval(interval);
                        setWaitingForHandshake(false);
                    }
                }, 3000);
            } else {
                setError('Failed to generate Telegram linking URL.');
            }
        } catch (err) {
            console.error('[TelegramBanner] Connection error:', err);
            setError(err.response?.data?.error || 'Unable to connect to Telegram right now.');
        } finally {
            setLoading(false);
        }
    };

    // Quick Test Alert trigger for connected creators
    const handleSendTestAlert = async () => {
        try {
            setTestAlertSent(true);
            await api.post('/notifications/test-telegram', {
                message: '👋 Testing your GurshaPay Telegram Alerts! Everything is configured properly.'
            }).catch(() => {});
            setTimeout(() => setTestAlertSent(false), 3000);
        } catch (_) {
            setTestAlertSent(false);
        }
    };

    if (isConnected) {
        return (
            <div 
                style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(34, 158, 217, 0.06) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '16px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(8px)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #0088cc 0%, #29b6f6 100%)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 136, 204, 0.25)'
                        }}
                    >
                        <TelegramIcon size={22} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                {t('telegramConnectedTitle') || 'Telegram Alerts Connected'}
                            </span>
                            <span 
                                style={{ 
                                    background: 'rgba(16, 185, 129, 0.15)', 
                                    color: '#10B981', 
                                    fontSize: '0.72rem', 
                                    fontWeight: 800, 
                                    padding: '2px 8px', 
                                    borderRadius: '20px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                }}
                            >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                                {t('telegramBadgeConnected') || 'Connected'}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {t('telegramConnectedDesc') || 'You will receive instant alerts via @GurshaPayNotificationBot when fans tip you.'}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <a
                        href="https://t.me/GurshaPayNotificationBot"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'var(--card-bg-subtle, rgba(255,255,255,0.06))',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        Open Bot <ExternalLink size={13} />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(0, 136, 204, 0.12) 0%, rgba(41, 182, 246, 0.08) 50%, rgba(16, 185, 129, 0.07) 100%)',
                border: '1.5px solid rgba(41, 182, 246, 0.3)',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 24px rgba(0, 136, 204, 0.08)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
        >
            {/* Ambient background glow */}
            <div 
                style={{ 
                    position: 'absolute', 
                    top: '-30px', 
                    right: '-30px', 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    background: 'radial-gradient(circle, rgba(0, 136, 204, 0.25) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} 
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 320px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #0088cc 0%, #29b6f6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 6px 16px rgba(0, 136, 204, 0.3)',
                            flexShrink: 0
                        }}
                    >
                        <TelegramIcon size={26} />
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                                {t('telegramBannerTitle') || 'Never miss a tip! Connect Telegram to get instant, free alerts.'}
                            </h3>
                            <span 
                                style={{
                                    background: 'rgba(0, 136, 204, 0.15)',
                                    color: '#0088cc',
                                    border: '1px solid rgba(0, 136, 204, 0.3)',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                }}
                            >
                                <Sparkles size={11} /> {t('telegramBadgeInstant') || 'Instant & Free'}
                            </span>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.835rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {waitingForHandshake 
                                ? '📱 Telegram opened! Tap the START button at the bottom of the bot to activate notifications.'
                                : (t('telegramBannerDesc') || 'Get free, real-time push alerts on Telegram whenever fans send you tips or withdrawals clear.')}
                        </p>

                        {error && (
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#EF4444', fontWeight: 600 }}>
                                ⚠️ {error}
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {waitingForHandshake ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 136, 204, 0.1)', padding: '0.55rem 1rem', borderRadius: '12px', border: '1px solid rgba(0, 136, 204, 0.2)' }}>
                            <RefreshCw size={15} style={{ animation: 'spin 1.5s linear infinite', color: '#0088cc' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0088cc' }}>Waiting for START tap...</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnectTelegram}
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg, #0088cc 0%, #00a2ff 100%)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.7rem 1.35rem',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                                cursor: loading ? 'wait' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.55rem',
                                boxShadow: '0 6px 20px rgba(0, 136, 204, 0.35)',
                                transition: 'all 0.18s ease',
                                outline: 'none'
                            }}
                            onMouseEnter={e => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 136, 204, 0.45)';
                                }
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 136, 204, 0.35)';
                            }}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    <span>{t('telegramConnecting') || 'Connecting...'}</span>
                                </>
                            ) : (
                                <>
                                    <TelegramIcon size={18} />
                                    <span>{t('telegramConnectBtn') || 'Connect Telegram'}</span>
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
