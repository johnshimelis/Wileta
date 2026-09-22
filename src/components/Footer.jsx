import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, Mail, Phone, Lock, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../utils/soundFx';

export default function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', padding: '4.5rem 1.5rem 2.5rem', position: 'relative' }}>
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
                    {/* Brand column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <Logo size="medium" />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: '320px' }}>
                            {t('footerTagline')}
                        </p>
                        
                        {/* Live Rail Status */}
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.55rem', 
                            color: 'var(--primary)', 
                            fontWeight: 700, 
                            fontSize: '0.8125rem', 
                            background: 'var(--primary-light)', 
                            padding: '0.45rem 0.85rem', 
                            borderRadius: 'var(--radius-full)', 
                            border: '1px solid var(--border-glow)',
                            width: 'fit-content' 
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}></span>
                            <span>{t('bankingRailsOperational')}</span>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)' }}>
                            {t('platform')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <li><a href="#simulator" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('liveDemo')}</a></li>
                            <li><a href="#calculator" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('revenueCalculator')}</a></li>
                            <li><a href="#payouts" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('bankRails')}</a></li>
                            <li><a href="#obs-alerts" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('obsAlerts')}</a></li>
                            <li><a href="#how-it-works" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('howItWorks')}</a></li>
                        </ul>
                    </div>

                    {/* Compliance & Trust */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)' }}>
                            {t('trustAndSecurity')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <li><Link to="/privacy-policy" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('privacyPolicy')}</Link></li>
                            <li><Link to="/data-deletion" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>Data Protection & Deletion</Link></li>
                            <li><Link to="/kyc" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('kycTitle')}</Link></li>
                            <li><a href="#faq" onClick={() => soundFx.playClick()} style={{ transition: 'color 0.15s ease' }}>{t('faq')}</a></li>
                        </ul>
                    </div>

                    {/* Get Started */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-main)' }}>
                            {t('getStarted')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <li><Link to="/login" onClick={() => soundFx.playClick()} style={{ fontWeight: 600 }}>{t('signIn')}</Link></li>
                            <li><Link to="/signup" onClick={() => soundFx.playPop()} style={{ fontWeight: 800, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>{t('getStarted')} →</Link></li>
                            <li style={{ marginTop: '0.5rem' }}>
                                <a href="mailto:support@gurshapay.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)' }}>
                                    <Mail size={14} /> support@gurshapay.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>© {currentYear} GurshaPay Inc. {t('rightsReserved')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600 }}>
                        <Link to="/privacy-policy" onClick={() => soundFx.playClick()}>{t('privacyPolicy')}</Link>
                        <Link to="/data-deletion" onClick={() => soundFx.playClick()}>Data Policy</Link>
                        <Link to="/login" onClick={() => soundFx.playClick()}>{t('signIn')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
