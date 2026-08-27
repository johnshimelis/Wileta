import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, Sparkles, ChevronRight, Volume2, VolumeX } from 'lucide-react';
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
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
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
        { label: 'Banks & Telebirr', href: '#payouts' },
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
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                background: scrolled ? 'var(--card-glass)' : 'var(--bg-color)',
                borderBottom: '1px solid ' + (scrolled ? 'var(--border-color)' : 'transparent'),
                boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <Logo size="small" />
                    <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    transition: 'all 0.18s ease' 
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--text-main)';
                                    e.currentTarget.style.background = 'var(--card-bg-subtle)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {/* Audio FX Interactive Toggle */}
                        <button
                            type="button"
                            onClick={handleSoundToggle}
                            title={soundActive ? "Mute interactive sound effects" : "Enable interactive sound effects"}
                            style={{
                                background: soundActive ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                border: '1px solid ' + (soundActive ? 'var(--border-glow)' : 'var(--border-color)'),
                                color: soundActive ? 'var(--primary)' : 'var(--text-muted)',
                                padding: '0.45rem',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.18s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
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
                            className="btn-interactive"
                            onClick={() => {
                                soundFx.playPop();
                                navigate('/dashboard');
                            }}
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link 
                                to="/login" 
                                className="desktop-only" 
                                onClick={() => soundFx.playClick()}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: 'var(--text-main)', 
                                    fontWeight: 700, 
                                    fontSize: '0.875rem', 
                                    padding: '0.5rem 0.95rem', 
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all 0.18s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'var(--card-bg-subtle)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Log in
                            </Link>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={ArrowRight}
                                iconPosition="right"
                                className="btn-interactive"
                                onClick={() => {
                                    soundFx.playPop();
                                    navigate('/signup');
                                }}
                            >
                                Claim Link
                            </Button>
                        </div>
                    )}

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        onClick={() => {
                            soundFx.playClick();
                            setMobileOpen(!mobileOpen);
                        }}
                        className="mobile-hamburger-btn"
                        style={{
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                        }}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown / Slide-Down Menu */}
            {mobileOpen && (
                <div 
                    className="animate-fade-in"
                    style={{
                        padding: '1.25rem 1.5rem 2rem',
                        background: 'var(--card-bg)',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        boxShadow: 'var(--shadow-xl)'
                    }}
                >
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
                                fontSize: '0.95rem', 
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'var(--card-bg-subtle)'
                            }}
                        >
                            <span>{link.label}</span>
                            <ChevronRight size={16} color="var(--text-muted)" />
                        </a>
                    ))}
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Preferences</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={handleSoundToggle}
                                style={{
                                    background: soundActive ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                    border: '1px solid var(--border-color)',
                                    color: soundActive ? 'var(--primary)' : 'var(--text-muted)',
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 700
                                }}
                            >
                                {soundActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
                                <span>{soundActive ? 'Sound On' : 'Muted'}</span>
                            </button>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    {!user && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <Link to="/login" onClick={() => { soundFx.playClick(); setMobileOpen(false); }}>
                                <Button variant="outline" size="md" className="btn-full btn-interactive">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup" onClick={() => { soundFx.playPop(); setMobileOpen(false); }}>
                                <Button variant="primary" size="md" className="btn-full btn-interactive" icon={ArrowRight} iconPosition="right">
                                    Create Free Account
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
