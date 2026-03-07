import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Settings as SettingsIcon, LogOut, Moon, Sun } from 'lucide-react';
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
                    <img src="/logo.jpg" alt="Wileta Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span className="sidebar-logo-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Wileta</span>
                </div>

                <nav className="sidebar-nav">
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/profile" icon={User} label="Profile" />
                    <NavItem to="/settings" icon={SettingsIcon} label="Settings" />
                </nav>

                <div className="sidebar-footer" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', width: '100%' }}>
                    <div className="theme-toggle-container" style={{ marginBottom: '0.5rem' }}>
                        <span className="nav-text" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Appearance</span>
                        <ThemeToggle />
                    </div>

                    <button onClick={logout} className="nav-item" style={{ width: '100%', border: 'none', background: 'none', color: 'var(--danger)', display: 'flex', alignItems: 'center', padding: '0.875rem 1.25rem' }}>
                        <LogOut size={20} />
                        <span className="nav-text">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
