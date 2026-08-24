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

export default function Profile() {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{t('myProfile')}</h1>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900, overflow: 'hidden', flexShrink: 0, border: '3px solid var(--card-bg-subtle)' }}>
                                {user?.profilePicUrl ? (
                                    <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user?.name?.charAt(0) || '?'
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h2>
                                    <Badge variant={user?.kycStatus === 'approved' ? 'success' : 'warning'} size="sm" icon={ShieldCheck}>
                                        {user?.kycStatus === 'approved' ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </div>
                                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.15rem' }}>
                                    @{user?.username}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
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
                    </Card>

                    {/* Tipping Page Card */}
                    <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Public Tipping Page</h3>
                                <Badge variant="primary" size="sm">Live</Badge>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                                Your public page is live and ready to receive Telebirr support from fans.
                            </p>
                            <div style={{ background: 'var(--card-bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem', wordBreak: 'break-all' }}>
                                {window.location.origin}/{user?.username}
                            </div>
                        </div>
                        <a href={`/${user?.username}`} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" icon={ExternalLink} iconPosition="right" className="btn-full">
                                {t('viewPublicPage')}
                            </Button>
                        </a>
                    </Card>
                </div>
            </main>
        </div>
    );
}
