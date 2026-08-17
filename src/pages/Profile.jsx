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
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

export default function Profile() {
    const { user, logout } = useAuth();
    const { t, language } = useLanguage();
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
                    <Logo size="small" />
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
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{t('myProfile')}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{t('profileSubtitle')}</p>
                </header>

                <div className="dashboard-card animate-fade-in profile-card">
                    <div className="creator-avatar profile-avatar-container">
                        {user?.profilePicUrl ? (
                            <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            user?.name?.charAt(0) || user?.phone?.charAt(0) || '?'
                        )}
                    </div>

                    <div className="profile-info-container">
                        <div className="profile-header-row">
                            <div className="profile-name-container">
                                <h2 className="profile-name-text">{user?.name}</h2>
                                <p className="profile-username-text">@{user?.username}</p>
                            </div>
                            <Link to="/settings" className="btn-primary profile-edit-btn">
                                {t('editProfile')}
                            </Link>
                        </div>

                        <div className="profile-details-grid">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Mail size={18} />
                                <span>{user?.email || t('noEmailSet')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Phone size={18} />
                                <span>{user?.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <ShieldCheck size={18} color={user?.kycStatus === 'approved' ? 'var(--primary)' : 'var(--text-muted)'} />
                                <span style={{ fontWeight: 600, color: user?.kycStatus === 'approved' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                    {user?.kycStatus === 'approved' ? t('verifiedStatus') : t('unverifiedStatus')}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Calendar size={18} />
                                <span>{t('joined')} {new Date(user?.createdAt || Date.now()).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>{t('tippingPagePreview')}</h3>
                    <div className="dashboard-card" style={{ background: 'var(--card-bg)', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('tippingPageLiveNotice')}</p>
                        <a href={`/${user?.username}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
                            {t('viewPublicPage')}
                        </a>
                    </div>
                </div>
            </main >
        </div >
    );
}
