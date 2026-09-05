import React, { useState } from 'react';
import { RefreshCw, Mail, Phone } from 'lucide-react';
import Logo from './Logo';

export default function MaintenanceScreen({
    message,
    supportEmail = 'biranalabs@gmail.com',
    supportPhone = '+251 967 432 143',
    onRefresh
}) {
    const [checking, setChecking] = useState(false);

    const handleTryAgain = async () => {
        setChecking(true);
        try {
            if (typeof onRefresh === 'function') {
                await onRefresh();
            } else {
                window.location.reload();
            }
        } catch (_) {
            window.location.reload();
        } finally {
            setTimeout(() => setChecking(false), 800);
        }
    };

    // Normalized clean phone for tel: link
    const cleanPhone = (supportPhone || '').replace(/\s+/g, '');

    return (
        <main className="maintenance-container" role="main" aria-label="Maintenance Page">
            {/* Ambient Subtle Background Highlight */}
            <div className="maintenance-bg-accent" aria-hidden="true" />

            <div className="maintenance-content">
                {/* Top Brand Logo */}
                <header className="maintenance-header">
                    <Logo size="small" />
                </header>

                {/* Central Maintenance Card / Body */}
                <section className="maintenance-body">
                    {/* Minimalist Visual Symbol */}
                    <div className="maintenance-symbol" aria-hidden="true">
                        <svg 
                            width="28" 
                            height="28" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1.75" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </div>

                    {/* Main Headings & Copy */}
                    <h1 className="maintenance-heading">
                        We'll Be Back Soon
                    </h1>

                    <p className="maintenance-description">
                        {message || "GurshaPay is temporarily unavailable while we make a few improvements. We're working to get everything back up and running shortly."}
                    </p>

                    {/* Understated Status Indicator */}
                    <div className="maintenance-status-badge" role="status">
                        <span className="status-dot" aria-hidden="true" />
                        <span>Maintenance in progress</span>
                    </div>

                    {/* Primary CTA Button */}
                    <div className="maintenance-action">
                        <button
                            type="button"
                            onClick={handleTryAgain}
                            disabled={checking}
                            className="maintenance-btn"
                            aria-label="Try refreshing the page"
                        >
                            <RefreshCw 
                                size={16} 
                                className={`btn-icon ${checking ? 'icon-spinning' : ''}`} 
                                aria-hidden="true" 
                            />
                            <span>{checking ? 'Checking...' : 'Try Again'}</span>
                        </button>
                    </div>
                </section>

                {/* Bottom Support Contact & Footer */}
                <footer className="maintenance-footer">
                    <div className="maintenance-support">
                        <span className="support-title">Need help?</span>
                        <div className="support-links">
                            <a 
                                href={`tel:${cleanPhone}`} 
                                className="support-link"
                                aria-label={`Call support at ${supportPhone}`}
                            >
                                <Phone size={14} className="support-icon" aria-hidden="true" />
                                <span>{supportPhone}</span>
                            </a>
                            <span className="support-divider" aria-hidden="true">·</span>
                            <a 
                                href={`mailto:${supportEmail}`} 
                                className="support-link"
                                aria-label={`Email support at ${supportEmail}`}
                            >
                                <Mail size={14} className="support-icon" aria-hidden="true" />
                                <span>{supportEmail}</span>
                            </a>
                        </div>
                    </div>

                    <p className="maintenance-copyright">
                        &copy; 2026 GurshaPay. All rights reserved.
                    </p>
                </footer>
            </div>

            <style>{`
                .maintenance-container {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--bg-color, #FAFAFA);
                    color: var(--text-main, #09090B);
                    position: relative;
                    overflow-x: hidden;
                    padding: 2.5rem 1.5rem;
                    box-sizing: border-box;
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .maintenance-bg-accent {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, var(--primary-light, rgba(4, 120, 87, 0.06)) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 0;
                }

                .maintenance-content {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 520px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    animation: maintenanceFadeUp 0.4s ease-out forwards;
                }

                @keyframes maintenanceFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Header */
                .maintenance-header {
                    margin-bottom: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Center Body */
                .maintenance-body {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .maintenance-symbol {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: var(--card-bg, #FFFFFF);
                    border: 1px solid var(--border-color, #E4E4E7);
                    color: var(--primary, #047857);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.75rem;
                    box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05));
                }

                .maintenance-heading {
                    font-size: 1.875rem;
                    font-weight: 800;
                    letter-spacing: -0.025em;
                    color: var(--text-main, #09090B);
                    margin: 0 0 0.875rem 0;
                    line-height: 1.25;
                }

                .maintenance-description {
                    font-size: 1rem;
                    color: var(--text-secondary, #52525B);
                    line-height: 1.6;
                    margin: 0 0 1.5rem 0;
                    max-width: 440px;
                }

                /* Status Badge */
                .maintenance-status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: var(--radius-full, 9999px);
                    background: var(--card-bg, #FFFFFF);
                    border: 1px solid var(--border-color, #E4E4E7);
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-secondary, #52525B);
                    margin-bottom: 2rem;
                    box-shadow: var(--shadow-xs, 0 1px 2px rgba(0, 0, 0, 0.04));
                }

                .status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #F59E0B;
                    flex-shrink: 0;
                }

                /* Primary Button */
                .maintenance-action {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 3.5rem;
                }

                .maintenance-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-width: 150px;
                    padding: 0.75rem 1.75rem;
                    background-color: var(--primary, #047857);
                    color: #FFFFFF;
                    font-size: 0.9375rem;
                    font-weight: 700;
                    border: none;
                    border-radius: var(--radius-md, 8px);
                    cursor: pointer;
                    transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
                    box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08));
                }

                .maintenance-btn:hover:not(:disabled) {
                    background-color: var(--primary-hover, #065F46);
                    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
                }

                .maintenance-btn:active:not(:disabled) {
                    background-color: var(--primary-active, #064E3B);
                    transform: translateY(1px);
                }

                .maintenance-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-icon {
                    flex-shrink: 0;
                }

                .icon-spinning {
                    animation: maintenanceSpin 0.7s linear infinite;
                }

                @keyframes maintenanceSpin {
                    to { transform: rotate(360deg); }
                }

                /* Footer & Support */
                .maintenance-footer {
                    width: 100%;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-color, #E4E4E7);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.25rem;
                }

                .maintenance-support {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .support-title {
                    font-size: 0.8125rem;
                    font-weight: 700;
                    color: var(--text-muted, #71717A);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .support-links {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                .support-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-secondary, #52525B);
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: color 0.15s ease;
                }

                .support-link:hover {
                    color: var(--primary, #047857);
                    text-decoration: underline;
                }

                .support-icon {
                    color: var(--text-muted, #71717A);
                    flex-shrink: 0;
                }

                .support-link:hover .support-icon {
                    color: var(--primary, #047857);
                }

                .support-divider {
                    color: var(--text-muted, #71717A);
                    font-weight: bold;
                    user-select: none;
                }

                .maintenance-copyright {
                    font-size: 0.8125rem;
                    color: var(--text-muted, #71717A);
                    margin: 0;
                }

                /* Mobile Adjustments */
                @media (max-width: 640px) {
                    .maintenance-container {
                        padding: 2rem 1.25rem;
                    }

                    .maintenance-header {
                        margin-bottom: 2rem;
                    }

                    .maintenance-heading {
                        font-size: 1.5rem;
                    }

                    .maintenance-description {
                        font-size: 0.9375rem;
                        margin-bottom: 1.25rem;
                    }

                    .maintenance-status-badge {
                        margin-bottom: 1.75rem;
                    }

                    .maintenance-action {
                        margin-bottom: 2.5rem;
                    }

                    .maintenance-btn {
                        width: 100%;
                        max-width: 280px;
                    }

                    .support-links {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .support-divider {
                        display: none;
                    }
                }
            `}</style>
        </main>
    );
}
