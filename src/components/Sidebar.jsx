import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const location = useLocation();
    const { logout } = useAuth();

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
                <div className="desktop-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
                    <img src="/gurshapay-logo.png" alt="GurshaPay Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div className="sidebar-logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>GurshaPay</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', marginTop: '0.15rem' }}>ጎርሻፒይ</span>
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1 }}>
                        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem to="/profile" icon={User} label="Profile" />
                        <NavItem to="/settings" icon={SettingsIcon} label="Settings" />
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="nav-item theme-toggle-container" style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="nav-text" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Appearance</span>
                            <ThemeToggle />
                        </div>

                        <button onClick={logout} className="nav-item" style={{ width: '100%', border: 'none', background: 'none', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                            <LogOut size={20} />
                            <span className="nav-text" style={{ fontWeight: 600 }}>Logout</span>
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem' }}>
                            <a href="/privacy.html" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Privacy Policy</a>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
}
