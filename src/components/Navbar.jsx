import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import Button from './ui/Button';
import { soundFx } from '../utils/soundFx';

export default function Navbar() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [soundActive, setSoundActive] = useState(soundFx.isSoundEnabled());
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileOpen]);

    const handleSoundToggle = () => {
        const nextState = soundFx.toggleSound();
        setSoundActive(nextState);
    };

    const navLinks = [
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Live Demo', href: '#simulator' },
        { label: 'Revenue Calculator', href: '#calculator' },
        { label: 'Bank Rails', href: '#payouts' },
        { label: 'OBS Alerts', href: '#obs-alerts' },
        { label: 'FAQ', href: '#faq' }
    ];

    return (
        <header 
            className="public-navbar" 
            style={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 'var(--z-sticky)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: scrolled ? 'var(--card-glass)' : 'var(--bg-color)',
                borderBottom: '1px solid ' + (scrolled ? 'var(--border-color)' : 'transparent'),
                boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
                width: '100%'
            }}
        >
            <div style={{ 
                maxWidth: '1280px', 
                margin: '0 auto', 
                padding: '0.85rem 1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '1rem'
            }}>
                {/* Brand Logo & Desktop Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
                    <Logo size="small" />

                    <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'nowrap' }}>
                        {navLinks.map((link, idx) => (
                            <a 
                                key={idx}
                                href={link.href} 
                                onClick={() => soundFx.playClick()}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: 'var(--text-secondary)', 
                                    fontWeight: 600, 
                                    fontSize: '0.875rem', 
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '6px',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block',
                                    lineHeight: 1,
                                    transition: 'all 0.15s ease' 
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--text-main)';
                                    e.currentTarget.style.background = 'var(--card-bg-subtle)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Right Toolstrip: Controls & CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                            type="button"
                            onClick={handleSoundToggle}
                            title={soundActive ? "Mute sound" : "Enable sound"}
                            style={{
                                background: soundActive ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                border: '1px solid ' + (soundActive ? 'rgba(4, 120, 87, 0.3)' : 'var(--border-color)'),
                                color: soundActive ? 'var(--primary)' : 'var(--text-muted)',
                                padding: '0.45rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </button>

                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    {user ? (
                        <Button
                            variant="primary"
                            size="sm"
                            icon={LayoutDashboard}
                            onClick={() => {
                                soundFx.playPop();
                                navigate('/dashboard');
                            }}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
                            <Link 
                                to="/login" 
                                className="desktop-only" 
                                onClick={() => soundFx.playClick()}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: 'var(--text-main)', 
                                    fontWeight: 700, 
                                    fontSize: '0.875rem', 
                                    padding: '0.5rem 0.85rem', 
                                    borderRadius: '8px',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block',
                                    lineHeight: 1,
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg-subtle)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                Log in
                            </Link>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => {
                                    soundFx.playPop();
                                    navigate('/signup');
                                }}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                Claim Link
                            </Button>
                        </div>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            display: 'none'
                        }}
                        className="mobile-toggle-btn"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Drawer */}
            {mobileOpen && (
                <div 
                    style={{
                        position: 'fixed',
                        top: '64px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--bg-color)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        zIndex: 9999,
                        overflowY: 'auto'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.href}
                                onClick={() => {
                                    soundFx.playClick();
                                    setMobileOpen(false);
                                }}
                                style={{
                                    textDecoration: 'none',
                                    color: 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    background: 'var(--card-bg-subtle)'
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                        {!user && (
                            <Link to="/login" onClick={() => setMobileOpen(false)}>
                                <Button variant="secondary" size="md" className="btn-full">Log in</Button>
                            </Link>
                        )}
                        <Button 
                            variant="primary" 
                            size="md" 
                            className="btn-full"
                            onClick={() => {
                                setMobileOpen(false);
                                navigate(user ? '/dashboard' : '/signup');
                            }}
                        >
                            {user ? 'Go to Dashboard' : 'Claim Your Link'}
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
