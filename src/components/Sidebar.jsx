import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Settings as SettingsIcon, LogOut, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const location = useLocation();
    const { logout } = useAuth();
    const { t } = useLanguage();

    const NavItem = ({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <Icon size={20} />
                <span className="nav-text">{label}</span>
            </Link>
        );
    };

    return (
        <>
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="desktop-logo-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                    <Logo size="large" />
                </div>

                <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <NavItem to="/dashboard" icon={LayoutDashboard} label={t('dashboardTitle')} />
                        <NavItem to="/profile" icon={User} label={t('profile')} />
                        <NavItem to="/settings" icon={SettingsIcon} label={t('settings')} />
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="nav-item theme-toggle-container" style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="nav-text" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('appearance')}</span>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <LanguageToggle />
                                <ThemeToggle />
                            </div>
                        </div>

                        <button onClick={logout} className="nav-item" style={{ width: '100%', border: 'none', background: 'none', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                            <LogOut size={20} />
                            <span className="nav-text" style={{ fontWeight: 600 }}>{t('logout')}</span>
                        </button>

                        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                            <Link to="/privacy-policy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s', padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 700 }} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ShieldCheck size={14} />
                                <span>{t('privacyPolicy')}</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
}
