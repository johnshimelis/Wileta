import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, Mail, Phone, Lock, Sparkles, CheckCircle } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', padding: '4.5rem 1.5rem 2.5rem' }}>
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
                    {/* Brand column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <Logo size="medium" />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
                            The premier Ethiopian creator monetization platform. Empowering digital creators, streamers, and educators with instant Telebirr & commercial bank payouts.
                        </p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8125rem', background: 'var(--primary-light)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', width: 'fit-content' }}>
                            <ShieldCheck size={16} />
                            <span>Secured via Telebirr & National Banks</span>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)' }}>
                            Product
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <li><a href="#simulator" style={{ transition: 'color 0.15s ease' }}>Live Tipping Simulator</a></li>
                            <li><a href="#calculator" style={{ transition: 'color 0.15s ease' }}>Earnings Estimator</a></li>
                            <li><a href="#payouts" style={{ transition: 'color 0.15s ease' }}>Telebirr & Local Banks</a></li>
                            <li><a href="#how-it-works" style={{ transition: 'color 0.15s ease' }}>OBS Studio Alert Overlay</a></li>
                        </ul>
                    </div>

                    {/* Compliance & Trust */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)' }}>
                            Compliance & Trust
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <li><Link to="/privacy-policy" style={{ transition: 'color 0.15s ease' }}>Privacy Policy</Link></li>
                            <li><Link to="/data-deletion" style={{ transition: 'color 0.15s ease' }}>Data Deletion</Link></li>
                            <li><Link to="/kyc" style={{ transition: 'color 0.15s ease' }}>KYC Identity Verification</Link></li>
                            <li><a href="#faq" style={{ transition: 'color 0.15s ease' }}>Security Standards</a></li>
                        </ul>
                    </div>

                    {/* Get Started */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)' }}>
                            Get Started
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <li><Link to="/login" style={{ fontWeight: 600 }}>Creator Sign In</Link></li>
                            <li><Link to="/signup" style={{ fontWeight: 800, color: 'var(--primary)' }}>Create Account Free →</Link></li>
                            <li>
                                <a href="mailto:support@gurshapay.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                                    <Mail size={14} /> support@gurshapay.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <div>
                        © {currentYear} GurshaPay Inc. All rights reserved. Built with pride for Ethiopian digital creators.
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600 }}>
                        <Link to="/privacy-policy">Privacy</Link>
                        <Link to="/data-deletion">Data Policy</Link>
                        <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
