import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Settings as SettingsIcon, LogOut, ShieldCheck, ExternalLink, LifeBuoy } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { t } = useLanguage();

    const NavItem = ({ to, icon: Icon, label, target, badge }) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                target={target}
                className={`sidebar-link ${active ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>
                        {badge}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <>
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {/* Brand Header */}
                <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Logo size="small" />
                </div>

                {/* Nav Links */}
                <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    <NavItem to="/dashboard" icon={LayoutDashboard} label={t('dashboardTitle')} />
                    <NavItem to="/profile" icon={User} label={t('profile')} />
                    <NavItem to="/settings" icon={SettingsIcon} label={t('settings')} />
                    <NavItem to="/support" icon={LifeBuoy} label="Support & Help" />
                    {user?.kycStatus !== 'approved' && (
                        <NavItem
                            to="/kyc"
                            icon={ShieldCheck}
                            label="Verify KYC"
                            badge={user?.kycStatus === 'pending' ? 'Reviewing' : 'Action Req'}
                        />
                    )}
                    <NavItem to="/privacy-policy" icon={ShieldCheck} label="Privacy & Terms" target="_blank" />
                </nav>

                {/* Footer Controls */}
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Appearance</span>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* User Quick Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', background: 'var(--card-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0, overflow: 'hidden' }}>
                            {user?.profilePicUrl ? (
                                <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.name?.charAt(0) || '?'
                            )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'Creator'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                @{user?.username || 'user'}
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            title="Sign out"
                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', padding: '0.25rem', opacity: 0.8 }}
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
