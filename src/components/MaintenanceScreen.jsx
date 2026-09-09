import React, { useState } from 'react';
import { RefreshCw, Mail, Phone, Gamepad2, CheckCircle2, AlertCircle } from 'lucide-react';
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
                    message: 'Platform is back online! Redirecting you now...'
                });
                setTimeout(() => {
                    if (typeof onRefresh === 'function') {
                        onRefresh();
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            } else {
                setStatusToast({
                    type: 'info',
                    message: 'Maintenance is still in progress. Please check back shortly.'
                });
            }
        } catch (_) {
            setStatusToast({
                type: 'info',
                message: 'System upgrade in progress. We will be back online shortly.'
            });
        } finally {
            setTimeout(() => setCheckingStatus(false), 500);
            setTimeout(() => setStatusToast(null), 5000);
        }
    };

    const cleanPhone = (supportPhone || '').replace(/\s+/g, '');

    return (
        <main className="gp-maint-wrapper" role="main" aria-label="GurshaPay Maintenance Hub">
            <div className="gp-maint-container">
                {/* Brand Header */}
                <header className="gp-maint-header">
                    <Logo size="medium" />
                </header>

                {/* Main Card */}
                <section className="gp-maint-card">
                    {/* Status Pill */}
                    <div className="gp-status-pill">
                        <span className="gp-status-dot" />
                        <span>System Maintenance</span>
                    </div>

                    <h1 className="gp-maint-title">
                        We'll be right back
                    </h1>

                    <p className="gp-maint-subtitle">
                        {message || "GurshaPay is currently undergoing scheduled infrastructure updates to improve performance and reliability. All creator balances, transactions, and scheduled payouts remain fully secure."}
                    </p>

                    {/* Actions */}
                    <div className="gp-maint-actions">
                        <button
                            type="button"
                            onClick={handleCheckStatus}
                            disabled={checkingStatus}
                            className="gp-btn-primary"
                            aria-label="Check system status"
                        >
                            <RefreshCw size={15} className={`gp-btn-icon ${checkingStatus ? 'gp-spin' : ''}`} />
                            <span>{checkingStatus ? 'Checking...' : 'Check Status'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setArcadeOpen(!arcadeOpen)}
                            className={`gp-btn-secondary ${arcadeOpen ? 'active' : ''}`}
                            aria-label="Toggle Waiting Games"
                        >
                            <Gamepad2 size={16} />
                            <span>{arcadeOpen ? 'Hide Mini-Games' : 'Play Addis Hopper'}</span>
                        </button>
                    </div>

                    {/* Status Message */}
                    {statusToast && (
                        <div className={`gp-status-msg gp-status-${statusToast.type}`}>
                            {statusToast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
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

                {/* Clean Footer Support */}
                <footer className="gp-maint-footer">
                    <div className="gp-support-links">
                        <span className="gp-support-text">Need urgent assistance?</span>
                        <a href={`mailto:${supportEmail}`} className="gp-support-link">
                            <Mail size={13} />
                            <span>{supportEmail}</span>
                        </a>
                        <span className="gp-dot-sep">•</span>
                        <a href={`tel:${cleanPhone}`} className="gp-support-link">
                            <Phone size={13} />
                            <span>{supportPhone}</span>
                        </a>
                    </div>
                    <p className="gp-copyright">
                        &copy; 2026 GurshaPay Fintech Ltd. All rights reserved.
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
                    background: #090D16;
                    color: #F1F5F9;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                    padding: 2.5rem 1.25rem;
                    box-sizing: border-box;
                }

                .gp-maint-container {
                    width: 100%;
                    max-width: 580px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .gp-maint-header {
                    display: flex;
                    justify-content: center;
                }

                .gp-maint-card {
                    width: 100%;
                    background: #111827;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 2.5rem 2rem;
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                }

                .gp-status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.25);
                    padding: 4px 12px;
                    border-radius: 999px;
                    font-size: 0.775rem;
                    font-weight: 600;
                    color: #FBBF24;
                    margin-bottom: 1.1rem;
                    letter-spacing: 0.01em;
                }

                .gp-status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #F59E0B;
                }

                .gp-maint-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #FFFFFF;
                    margin: 0 0 0.65rem 0;
                    letter-spacing: -0.025em;
                }

                .gp-maint-subtitle {
                    font-size: 0.925rem;
                    color: #94A3B8;
                    line-height: 1.6;
                    max-width: 480px;
                    margin: 0 0 1.75rem 0;
                }

                .gp-maint-actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                    width: 100%;
                }

                .gp-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    background: #059669;
                    color: #FFFFFF;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0 1.25rem;
                    height: 42px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    transition: background 0.15s ease, transform 0.1s ease;
                }

                .gp-btn-primary:hover:not(:disabled) {
                    background: #047857;
                }

                .gp-btn-primary:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .gp-btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .gp-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    background: rgba(255, 255, 255, 0.05);
                    color: #E2E8F0;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0 1.25rem;
                    height: 42px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .gp-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.09);
                    border-color: rgba(255, 255, 255, 0.18);
                    color: #FFFFFF;
                }

                .gp-btn-secondary.active {
                    background: rgba(5, 150, 105, 0.15);
                    border-color: rgba(16, 185, 129, 0.35);
                    color: #34D399;
                }

                .gp-spin {
                    animation: gpSpin 1s linear infinite;
                }

                @keyframes gpSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .gp-status-msg {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    border-radius: 8px;
                    font-size: 0.825rem;
                    margin-top: 1.25rem;
                    max-width: 90%;
                    line-height: 1.4;
                }

                .gp-status-success {
                    background: rgba(16, 185, 129, 0.12);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #34D399;
                }

                .gp-status-info {
                    background: rgba(148, 163, 184, 0.08);
                    border: 1px solid rgba(148, 163, 184, 0.18);
                    color: #CBD5E1;
                }

                .gp-maint-footer {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    text-align: center;
                }

                .gp-support-links {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    justify-content: center;
                    font-size: 0.8rem;
                    color: #64748B;
                }

                .gp-support-text {
                    color: #94A3B8;
                }

                .gp-support-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    color: #CBD5E1;
                    text-decoration: none;
                    transition: color 0.15s ease;
                }

                .gp-support-link:hover {
                    color: #FFFFFF;
                    text-decoration: underline;
                }

                .gp-dot-sep {
                    color: #475569;
                }

                .gp-copyright {
                    font-size: 0.75rem;
                    color: #475569;
                    margin: 0;
                }

                @media (max-width: 480px) {
                    .gp-maint-card {
                        padding: 2rem 1.25rem;
                    }
                    .gp-maint-title {
                        font-size: 1.4rem;
                    }
                    .gp-maint-actions {
                        flex-direction: column;
                        width: 100%;
                    }
                    .gp-btn-primary, .gp-btn-secondary {
                        width: 100%;
                    }
                }
            `}</style>
        </main>
    );
}
