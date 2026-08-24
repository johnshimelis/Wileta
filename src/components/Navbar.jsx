import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, User, ShieldCheck } from 'lucide-react';
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
    const navigate = useNavigate();

    return (
        <header className="public-navbar">
            <div className="public-navbar-inner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Logo size="small" />
                    <nav className="nav-links desktop-only">
                        <a href="#how-it-works" className="nav-link">How It Works</a>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#payouts" className="nav-link">Payouts</a>
                        <a href="#security" className="nav-link">Security</a>
                        <a href="#faq" className="nav-link">FAQ</a>
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
                            Dashboard
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Link to="/login" className="nav-link desktop-only" style={{ fontWeight: 700, padding: '0.5rem 0.75rem' }}>
                                Log in
                            </Link>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => navigate('/signup')}
                            >
                                Get Started
                            </Button>
                        </div>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'none' }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            {mobileOpen && (
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <a href="#how-it-works" className="nav-link" onClick={() => setMobileOpen(false)}>How It Works</a>
                    <a href="#features" className="nav-link" onClick={() => setMobileOpen(false)}>Features</a>
                    <a href="#payouts" className="nav-link" onClick={() => setMobileOpen(false)}>Payouts</a>
                    <a href="#faq" className="nav-link" onClick={() => setMobileOpen(false)}>FAQ</a>
                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </header>
    );
}
