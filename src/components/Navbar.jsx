import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import Button from './ui/Button';

export default function Navbar() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

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

    return (
        <header 
            className="public-navbar" 
            style={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 'var(--z-sticky)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                background: scrolled ? 'rgba(var(--card-bg-rgb, 255, 255, 255), 0.92)' : 'var(--bg-color)',
                borderBottom: '1px solid ' + (scrolled ? 'var(--border-color)' : 'transparent'),
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Logo size="small" />
                    <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <a href="#how-it-works" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>How It Works</a>
                        <a href="#simulator" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>Live Demo</a>
                        <a href="#calculator" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>Calculator</a>
                        <a href="#payouts" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>Banks & Telebirr</a>
                        <a href="#faq" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>FAQ</a>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    {user ? (
                        <Button
                            variant="primary"
                            size="sm"
                            icon={LayoutDashboard}
                            onClick={() => navigate('/dashboard')}
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link 
                                to="/login" 
                                className="desktop-only" 
                                style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.875rem', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)' }}
                            >
                                Log in
                            </Link>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => navigate('/signup')}
                            >
                                Claim Link
                            </Button>
                        </div>
                    )}

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-hamburger-btn"
                        style={{
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            padding: '0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center'
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
                        gap: '1rem',
                        boxShadow: 'var(--shadow-xl)'
                    }}
                >
                    <a href="#how-it-works" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', padding: '0.4rem 0' }}>How It Works</a>
                    <a href="#simulator" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', padding: '0.4rem 0' }}>Live Demo</a>
                    <a href="#calculator" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', padding: '0.4rem 0' }}>Earnings Calculator</a>
                    <a href="#payouts" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', padding: '0.4rem 0' }}>Banks & Telebirr</a>
                    <a href="#faq" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', padding: '0.4rem 0' }}>FAQ</a>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Preferences</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    {!user && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <Link to="/login" onClick={() => setMobileOpen(false)}>
                                <Button variant="outline" size="md" className="btn-full">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup" onClick={() => setMobileOpen(false)}>
                                <Button variant="primary" size="md" className="btn-full" icon={ArrowRight} iconPosition="right">
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
