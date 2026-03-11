import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck as VerificationIcon, Settings as SettingsIcon, LogOut, TrendingUp, Menu, X } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import TopAlert from '../components/TopAlert';
import NotificationDrawer from '../components/NotificationDrawer';
import Sidebar from '../components/Sidebar';
import { useLocation } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const NavItem = ({ to, icon: Icon, label, active }) => (
        <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon size={20} />
            <span className="nav-text">{label}</span>
        </Link>
    );

    return (
        <div className="app-layout">
            <div className="mobile-header-container mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/gurshapay-logo.png" alt="GurshaPay Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>GurshaPay</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', marginTop: '0.15rem' }}>ጎርሻፒይ</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <NotificationDrawer />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="main-content">
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>My Profile</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and tipping page</p>
                </header>

                <div className="dashboard-card animate-fade-in" style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div className="creator-avatar" style={{ width: '120px', height: '120px', fontSize: '3rem', margin: 0, flexShrink: 0, overflow: 'hidden' }}>
                        {user?.profilePicUrl ? (
                            <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            user?.name?.charAt(0) || user?.phone?.charAt(0) || '?'
                        )}
                    </div>

                    <div style={{ flex: 1, minWidth: '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', wordBreak: 'break-word' }}>{user?.name}</h2>
                                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', wordBreak: 'break-word' }}>@{user?.username}</p>
                            </div>
                            <Link to="/settings" className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem', background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none', flexShrink: 0 }}>
                                Edit Profile
                            </Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Mail size={18} />
                                <span>{user?.email || 'No email set'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Phone size={18} />
                                <span>{user?.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <ShieldCheck size={18} color={user?.kycStatus === 'approved' ? 'var(--primary)' : 'var(--text-muted)'} />
                                <span style={{ fontWeight: 600, color: user?.kycStatus === 'approved' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                    {user?.kycStatus === 'approved' ? 'Identity Verified' : 'Verification Needed'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Calendar size={18} />
                                <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Tipping Page Preview</h3>
                    <div className="dashboard-card" style={{ background: 'var(--card-bg)', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your public tipping page is live and ready to receive support.</p>
                        <a href={`/${user?.username}`} target="_blank" className="btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
                            View Public Page
                        </a>
                    </div>
                </div>
            </main >
        </div >
    );
}
