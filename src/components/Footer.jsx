import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="public-footer">
            <div className="public-footer-inner">
                <div>
                    <Logo size="small" />
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                        The premier Ethiopian creator support platform. Empowering digital creators, streamers, and educators with instant local payouts.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <ShieldCheck size={16} color="var(--primary)" />
                        <span>Secured via Telebirr & National Banks</span>
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>Product</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                        <a href="#features" className="nav-link">OBS Stream Overlay</a>
                        <a href="#payouts" className="nav-link">Telebirr Integration</a>
                        <a href="#how-it-works" className="nav-link">How It Works</a>
                        <Link to="/signup" className="nav-link">Claim Your Link</Link>
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>Compliance & Trust</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                        <Link to="/privacy-policy" className="nav-link">Privacy Policy</Link>
                        <Link to="/data-deletion" className="nav-link">Data Deletion</Link>
                        <a href="#security" className="nav-link">KYC Verification</a>
                        <a href="#faq" className="nav-link">Security Standards</a>
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>Get Started</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                        <Link to="/login" className="nav-link">Creator Sign In</Link>
                        <Link to="/signup" className="nav-link">Create Account</Link>
                        <a href="#faq" className="nav-link">Creator FAQ</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} GurshaPay Technologies. All rights reserved.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Made with pride in Ethiopia</span>
                    <span style={{ color: 'var(--primary)' }}>🇪🇹</span>
                </div>
            </div>
        </footer>
    );
}
