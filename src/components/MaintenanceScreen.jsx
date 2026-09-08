import React, { useState } from 'react';
import { 
    RefreshCw, Mail, Phone, Gamepad2, ShieldCheck, 
    Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';
import axios from 'axios';
import Logo from './Logo';
import MaintenanceGames from './MaintenanceGames';

export default function MaintenanceScreen({
    message,
    supportEmail = 'biranalabs@gmail.com',
    supportPhone = '+251 967 432 143',
    onRefresh
}) {
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [statusToast, setStatusToast] = useState(null);
    const [arcadeOpen, setArcadeOpen] = useState(false);

    const handleCheckStatus = async () => {
        setCheckingStatus(true);
        setStatusToast(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${apiUrl}/system/status`, { timeout: 6000 });
            
            if (res.data?.maintenance === false || res.data?.status === 'online') {
                setStatusToast({
                    type: 'success',
                    message: '🎉 Platform is back online! Redirecting you now...'
                });
                setTimeout(() => {
                    if (typeof onRefresh === 'function') {
                        onRefresh();
                    } else {
                        window.location.reload();
                    }
                }, 1200);
            } else {
                setStatusToast({
                    type: 'info',
                    message: 'System upgrade in progress. Balances & payouts are 100% secure.'
                });
            }
        } catch (_) {
            setStatusToast({
                type: 'info',
                message: 'Platform optimization in progress. Our team is finalizing the update.'
            });
        } finally {
            setTimeout(() => setCheckingStatus(false), 600);
            setTimeout(() => setStatusToast(null), 6000);
        }
    };

    const cleanPhone = (supportPhone || '').replace(/\s+/g, '');

    return (
        <main className="gp-maint-wrapper" role="main" aria-label="GurshaPay Maintenance Hub">
            {/* Ambient Background Aura */}
            <div className="gp-maint-glow" aria-hidden="true" />

            <div className="gp-maint-container">
                {/* Brand Header */}
                <header className="gp-maint-header">
                    <Logo size="medium" />
                </header>

                {/* Hero Card */}
                <section className="gp-maint-hero-card">
                    <div className="gp-maint-badge">
                        <span className="gp-maint-pulse-dot" />
                        <span className="gp-maint-badge-text">Scheduled Platform Maintenance</span>
                    </div>

                    <h1 className="gp-maint-title">
                        Upgrading GurshaPay for You
                    </h1>

                    <p className="gp-maint-subtitle">
                        {message || "We are currently conducting scheduled infrastructure upgrades and security enhancements. All creator balances, transactions, and withdrawal records remain completely safe and encrypted."}
                    </p>

                    {/* Key Reassurances */}
                    <div className="gp-maint-highlights">
                        <div className="gp-maint-highlight-item">
                            <ShieldCheck size={16} className="gp-icon-green" />
                            <span>Creator Funds & Wallets 100% Safe</span>
                        </div>
                        <div className="gp-maint-highlight-item">
                            <Sparkles size={16} className="gp-icon-amber" />
                            <span>Enhanced 3D Gifting & Instant CBE Payouts</span>
                        </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="gp-maint-actions">
                        <button
                            type="button"
                            onClick={handleCheckStatus}
                            disabled={checkingStatus}
                            className="gp-maint-btn-primary"
                            aria-label="Check if platform is back online"
                        >
                            <RefreshCw size={16} className={`gp-btn-icon ${checkingStatus ? 'gp-spin' : ''}`} />
                            <span>{checkingStatus ? 'Checking Live Status...' : 'Check System Status'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setArcadeOpen(!arcadeOpen)}
                            className={`gp-maint-btn-secondary ${arcadeOpen ? 'active' : ''}`}
                            aria-label="Toggle Waiting Games"
                        >
                            <Gamepad2 size={16} />
                            <span>{arcadeOpen ? 'Hide Waiting Games' : '🎮 Play While You Wait'}</span>
                        </button>
                    </div>

                    {/* Toast Alert */}
                    {statusToast && (
                        <div className={`gp-maint-toast gp-toast-${statusToast.type}`}>
                            {statusToast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <span>{statusToast.message}</span>
                        </div>
                    )}
                </section>

                {/* Interactive Waiting Games Drawer */}
                {arcadeOpen && (
                    <section style={{ width: '100%' }}>
                        <MaintenanceGames />
                    </section>
                )}

                {/* Footer Support */}
                <footer className="gp-maint-footer">
                    <div className="gp-support-container">
                        <span className="gp-support-label">Need direct support from our engineering desk?</span>
                        <div className="gp-support-links">
                            <a href={`tel:${cleanPhone}`} className="gp-support-chip" aria-label={`Call ${supportPhone}`}>
                                <Phone size={14} />
                                <span>{supportPhone}</span>
                            </a>
                            <a href={`mailto:${supportEmail}`} className="gp-support-chip" aria-label={`Email ${supportEmail}`}>
                                <Mail size={14} />
                                <span>{supportEmail}</span>
                            </a>
                        </div>
                    </div>
                    <p className="gp-copyright">
                        &copy; 2026 GurshaPay Fintech Ltd. • Addis Ababa, Ethiopia • Powered by Birana Labs
                    </p>
                </footer>
            </div>

            <style>{`
                .gp-maint-wrapper {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #0D1117;
                    color: #F0F6FC;
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 2.5rem 1.25rem;
                    box-sizing: border-box;
                    position: relative;
                    overflow-x: hidden;
                }

                .gp-maint-glow {
                    position: absolute;
                    top: -15%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 650px;
                    height: 450px;
                    background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.05) 50%, transparent 80%);
                    pointer-events: none;
                    z-index: 0;
                }

                .gp-maint-container {
                    width: 100%;
                    max-width: 760px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 1;
                    gap: 1.75rem;
                }

                .gp-maint-header {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 0.25rem;
                }

                .gp-maint-hero-card {
                    width: 100%;
                    background: rgba(22, 27, 34, 0.85);
                    border: 1px solid rgba(48, 54, 61, 0.85);
                    backdrop-filter: blur(16px);
                    border-radius: 20px;
                    padding: 2.5rem 2rem;
                    box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.65);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                }

                .gp-maint-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(16, 185, 129, 0.12);
                    border: 1px solid rgba(16, 185, 129, 0.35);
                    padding: 6px 14px;
                    border-radius: 999px;
                    margin-bottom: 1.25rem;
                }

                .gp-maint-pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #10B981;
                    box-shadow: 0 0 10px #10B981;
                    animation: gpPulse 1.8s infinite ease-in-out;
                }

                @keyframes gpPulse {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 14px #10B981; }
                    100% { transform: scale(0.9); opacity: 0.8; }
                }

                .gp-maint-badge-text {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #10B981;
                    letter-spacing: 0.03em;
                    text-transform: uppercase;
                }

                .gp-maint-title {
                    font-size: 2.2rem;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: #FFFFFF;
                    margin: 0 0 0.85rem 0;
                    line-height: 1.2;
                }

                .gp-maint-subtitle {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #8B949E;
                    max-width: 580px;
                    margin: 0 0 1.75rem 0;
                }

                .gp-maint-highlights {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 2rem;
                }

                .gp-maint-highlight-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(33, 38, 45, 0.7);
                    border: 1px solid rgba(48, 54, 61, 0.6);
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #C9D1D9;
                }

                .gp-icon-green { color: #10B981; }
                .gp-icon-amber { color: #F59E0B; }

                .gp-maint-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    justify-content: center;
                    width: 100%;
                }

                .gp-maint-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: #10B981;
                    color: #042416;
                    border: none;
                    padding: 11px 22px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
                }

                .gp-maint-btn-primary:hover:not(:disabled) {
                    background: #059669;
                    color: #FFFFFF;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
                }

                .gp-maint-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: rgba(33, 38, 45, 0.85);
                    color: #F0F6FC;
                    border: 1px solid rgba(48, 54, 61, 0.9);
                    padding: 11px 20px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .gp-maint-btn-secondary:hover, .gp-maint-btn-secondary.active {
                    background: rgba(48, 54, 61, 0.9);
                    border-color: rgba(16, 185, 129, 0.5);
                    color: #10B981;
                }

                .gp-spin {
                    animation: gpSpin 1s linear infinite;
                }

                @keyframes gpSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .gp-maint-toast {
                    margin-top: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    animation: gpFadeUp 0.3s ease-out;
                }

                .gp-toast-success {
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid #10B981;
                    color: #34D399;
                }

                .gp-toast-info {
                    background: rgba(59, 130, 246, 0.12);
                    border: 1px solid rgba(59, 130, 246, 0.4);
                    color: #93C5FD;
                }

                @keyframes gpFadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .gp-maint-footer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    text-align: center;
                    width: 100%;
                }

                .gp-support-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .gp-support-label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #8B949E;
                }

                .gp-support-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    justify-content: center;
                }

                .gp-support-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(33, 38, 45, 0.7);
                    border: 1px solid rgba(48, 54, 61, 0.6);
                    color: #C9D1D9;
                    text-decoration: none;
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 6px 12px;
                    border-radius: 8px;
                    transition: all 0.15s ease;
                }

                .gp-support-chip:hover {
                    color: #10B981;
                    border-color: #10B981;
                }

                .gp-copyright {
                    font-size: 0.75rem;
                    color: #6E7681;
                    margin: 0;
                }

                @media (max-width: 640px) {
                    .gp-maint-title { font-size: 1.7rem; }
                    .gp-maint-hero-card { padding: 1.75rem 1.25rem; }
                    .gp-maint-actions { flex-direction: column; }
                    .gp-maint-btn-primary, .gp-maint-btn-secondary { width: 100%; }
                }
            `}</style>
        </main>
    );
}
