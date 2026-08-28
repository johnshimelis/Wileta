import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, ShieldCheck, ExternalLink, Edit3, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// Verified Blue Tick Emblem
const VerifiedBlueTick = ({ size = 22, title = "Verified Creator" }) => (
    <span 
        title={title}
        style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            verticalAlign: 'middle',
            cursor: 'pointer'
        }}
    >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M10.5 2.5C11.3 1.8 12.7 1.8 13.5 2.5L14.7 3.6C15.2 4.1 15.9 4.3 16.6 4.3L18.2 4.2C19.3 4.1 20.3 5.0 20.2 6.1L20.1 7.7C20.1 8.4 20.4 9.1 20.8 9.6L22.0 10.8C22.7 11.6 22.7 12.9 22.0 13.7L20.8 14.9C20.4 15.4 20.1 16.1 20.1 16.8L20.2 18.4C20.3 19.5 19.3 20.4 18.2 20.3L16.6 20.2C15.9 20.2 15.2 20.4 14.7 20.9L13.5 22.0C12.7 22.7 11.3 22.7 10.5 22.0L9.3 20.9C8.8 20.4 8.1 20.2 7.4 20.2L5.8 20.3C4.7 20.4 3.7 19.5 3.8 18.4L3.9 16.8C3.9 16.1 3.6 15.4 3.2 14.9L2.0 13.7C1.3 12.9 1.3 11.6 2.0 10.8L3.2 9.6C3.6 9.1 3.9 8.4 3.9 7.7L3.8 6.1C3.7 5.0 4.7 4.1 5.8 4.2L7.4 4.3C8.1 4.3 8.8 4.1 9.3 3.6L10.5 2.5Z" 
                fill="#1D9BF0" 
            />
            <path 
                d="M8.5 12.5L10.8 14.8L15.8 9.5" 
                stroke="#FFFFFF" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    </span>
);

export default function Profile() {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const isVerified = user?.kycStatus === 'approved' || user?.isVerified;

    return (
        <div className="app-layout">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="mobile-header">
                <Logo size="small" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <NotificationDrawer />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="main-content">
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>{t('myProfile')}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('profileSubtitle')}</p>
                    </div>
                    <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <NotificationDrawer />
                        <Link to="/settings">
                            <Button variant="primary" size="sm" icon={Edit3}>
                                {t('editProfile')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Profile Info Card */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900, overflow: 'hidden', flexShrink: 0, border: '3px solid var(--card-bg-subtle)' }}>
                                {user?.profilePicUrl ? (
                                    <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : ('https://wileta-backend.onrender.com' + user.profilePicUrl)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user?.name?.charAt(0) || '?'
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{user?.name}</h2>
                                    {isVerified && <VerifiedBlueTick size={22} title="Verified Creator" />}
                                </div>
                                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                                    @{user?.username}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <Mail size={16} color="var(--text-muted)" />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'No email set'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <Phone size={16} color="var(--text-muted)" />
                                <span>{user?.phone || user?.telebirr_number || 'No phone set'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <Calendar size={16} color="var(--text-muted)" />
                                <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { month: 'short', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tipping Page Card */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Public Tipping Page</h3>
                                <Badge variant="primary" size="sm">Live</Badge>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                                Your public page is live and ready to receive Telebirr support from fans.
                            </p>
                            <div style={{ background: 'var(--card-bg-subtle)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem', wordBreak: 'break-all' }}>
                                {window.location.origin}/{user?.username}
                            </div>
                        </div>
                        <a href={`/${user?.username}`} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" icon={ExternalLink} iconPosition="right" className="btn-full">
                                {t('viewPublicPage')}
                            </Button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
