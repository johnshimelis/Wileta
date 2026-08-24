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
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className="public-navbar" 
            style={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 'var(--z-sticky)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                background: scrolled ? 'rgba(var(--card-bg-rgb, 255, 255, 255), 0.85)' : 'var(--bg-color)',
                borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
                transition: 'all 0.25s ease'
            }}
        >
            <div className="public-navbar-inner" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <Logo size="small" />
                    <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                        <a href="#how-it-works" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>How It Works</a>
                        <a href="#simulator" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>Live Demo</a>
                        <a href="#calculator" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>Earnings Calculator</a>
                        <a href="#payouts" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>Banks & Telebirr</a>
                        <a href="#faq" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.15s' }}>FAQ</a>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                            Creator Dashboard
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Link 
                                to="/login" 
                                className="desktop-only" 
                                style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)' }}
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
                                Claim Your Link
                            </Button>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-only-btn"
                        style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.25rem' }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div style={{
                    padding: '1.25rem 1.5rem',
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <a href="#how-it-works" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>How It Works</a>
                    <a href="#simulator" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Live Demo</a>
                    <a href="#calculator" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Earnings Calculator</a>
                    <a href="#payouts" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Banks & Telebirr</a>
                    <a href="#faq" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>FAQ</a>
                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </header>
    );
}
