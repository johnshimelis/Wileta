import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, RefreshCw, ArrowRight } from 'lucide-react';

// Crisp Telegram Paper Airplane Icon
const TelegramIcon = ({ size = 16, color = "#FFFFFF" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
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

    // 1. Ultra-compact Connected State Bar (Height ~38px)
    if (isConnected) {
        return (
            <div 
                style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(34, 158, 217, 0.06) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '12px',
                    padding: '0.45rem 0.85rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    minHeight: '38px',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, overflow: 'hidden' }}>
                    <div 
                        style={{ 
                            width: '26px', 
                            height: '26px', 
                            borderRadius: '8px', 
                            background: 'linear-gradient(135deg, #0088cc 0%, #29b6f6 100%)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <TelegramIcon size={14} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, overflow: 'hidden' }}>
                        <span style={{ 
                            fontSize: '0.84rem', 
                            fontWeight: 800, 
                            color: 'var(--text-main)', 
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {t('telegramConnectedTitle') || 'Telegram Alerts Connected'}
                        </span>
                        <span 
                            style={{ 
                                background: 'rgba(16, 185, 129, 0.15)', 
                                color: '#10B981', 
                                fontSize: '0.68rem', 
                                fontWeight: 800, 
                                padding: '1px 6px', 
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                flexShrink: 0,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981' }}></span>
                            {t('telegramBadgeConnected') || 'Connected'}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <a
                        href="https://t.me/GurshaPayNotificationBot"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: 'var(--card-bg-subtle, rgba(255,255,255,0.06))',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <span>{t('telegramOpenBotBtn') || 'Open Bot'}</span>
                        <ExternalLink size={11} />
                    </a>
                </div>
            </div>
        );
    }

    // 2. Ultra-compact Disconnected State Bar (Height ~42px, NO stretching description)
    return (
        <div
            style={{
                background: 'linear-gradient(135deg, rgba(0, 136, 204, 0.09) 0%, rgba(41, 182, 246, 0.06) 100%)',
                border: '1px solid rgba(0, 136, 204, 0.28)',
                borderRadius: '12px',
                padding: '0.45rem 0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                minHeight: '42px',
                boxSizing: 'border-box'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, overflow: 'hidden' }}>
                <div
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #0088cc 0%, #29b6f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <TelegramIcon size={15} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ 
                        margin: 0, 
                        fontSize: '0.84rem', 
                        fontWeight: 800, 
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {waitingForHandshake
                            ? (t('amharic') === 'English' ? 'ቴሌግራም ተከፍቷል! START የሚለውን ይጫኑ' : 'Telegram opened! Tap START in bot')
                            : (t('telegramBannerTitle') || 'Connect Telegram for instant tip alerts')}
                    </span>
                    <span 
                        style={{
                            background: 'rgba(0, 136, 204, 0.15)',
                            color: '#0088cc',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            flexShrink: 0,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        ⚡ {t('telegramBadgeInstant') || 'Free'}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {waitingForHandshake ? (
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.35rem', 
                        background: 'rgba(0, 136, 204, 0.12)', 
                        padding: '0.3rem 0.65rem', 
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#0088cc',
                        whiteSpace: 'nowrap'
                    }}>
                        <RefreshCw size={12} style={{ animation: 'spin 1.5s linear infinite', color: '#0088cc' }} />
                        <span>{t('amharic') === 'English' ? 'በመጠበቅ ላይ...' : 'Waiting...'}</span>
                    </div>
                ) : (
                    <button
                        onClick={handleConnectTelegram}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #0088cc 0%, #00a2ff 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: loading ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(0, 136, 204, 0.25)',
                            outline: 'none'
                        }}
                    >
                        {loading ? (
                            <>
                                <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                                <span>{t('telegramConnecting') || 'Connecting...'}</span>
                            </>
                        ) : (
                            <>
                                <TelegramIcon size={13} />
                                <span>{t('telegramConnectBtn') || 'Connect'}</span>
                                <ArrowRight size={12} />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
