import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    User, LayoutDashboard, ShieldCheck, Settings as SettingsIcon,
    LogOut, TrendingUp, Bell, Lock, Globe, Smartphone,
    Save, CheckCircle, ChevronRight, Mail, Camera, Upload, Menu, X, AlertTriangle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import TopAlert from '../components/TopAlert';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

export default function Settings() {
    const { user, setUser, api, logout } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState(null);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Modals state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [showDeactivateModal, setShowDeactivateModal] = useState(false);

    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    // Sync local state when user data is loaded/updated
    React.useEffect(() => {
        if (user) {
            setName(user.name || '');
            setUsername(user.username || '');
        }
    }, [user]);

    const NavItem = ({ to, icon: Icon, label, active }) => (
        <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon size={20} />
            <span className="nav-text">{label}</span>
        </Link>
    );

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const res = await api.post('/auth/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data);
            showAlert(t('changesSaved'));
        } catch (error) {
            showAlert(error.response?.data?.error || "Upload failed", "error");
        }
        setUploading(false);
    };

    const handleSave = async () => {
        if (!name || !username) {
            showAlert(`${t('nameRequired')} & ${t('usernameRequired')}`, "error");
            return;
        }
        setSaving(true);
        try {
            const res = await api.post('/auth/update-profile', { name, username });
            setUser(res.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            showAlert(error.response?.data?.error || "Update failed", "error");
        }
        setSaving(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordLoading(true);
        try {
            await api.post('/auth/update-password', { currentPassword, newPassword });
            showAlert('Password updated successfully!', 'success');
            setShowPasswordModal(false);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setPasswordError(error.response?.data?.error || 'Failed to update password');
        }
        setPasswordLoading(false);
    };

    const SettingRow = ({ icon: Icon, title, description, badge, onClick, isToggle, checked }) => (
        <div
            onClick={onClick}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-color)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} />
                </div>
                <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{description}</p>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {badge && <span className="badge" style={{ margin: 0 }}>{badge}</span>}
                {isToggle ? (
                    <div style={{ width: '40px', height: '22px', background: checked ? 'var(--primary)' : 'var(--border-color)', borderRadius: '11px', position: 'relative', transition: '0.3s' }}>
                        <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: checked ? '20px' : '2px', transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </div>
                ) : (
                    <ChevronRight size={20} color="var(--text-muted)" />
                )}
            </div>
        </div>
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
                {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{t('settingsTitle')}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{t('settingsSubtitle')}</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ width: 'auto', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                        disabled={saving}
                    >
                        {saved ? <><CheckCircle size={18} /> {t('changesSavedShort')}</> : (saving ? <span className="spinner"></span> : <><Save size={18} /> {t('saveSettings')}</>)}
                    </button>
                </header>

                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                    <motion.section 
                        initial="hidden" 
                        animate="visible" 
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <motion.h3 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '-0.5rem' }}>{t('generalSettings')}</motion.h3>
                        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ position: 'relative' }}>
                                    <div className="creator-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: 0, overflow: 'hidden' }}>
                                        {user?.profilePicUrl ? (
                                            <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            user?.name?.charAt(0) || '?'
                                        )}
                                    </div>
                                    <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid var(--card-bg)', transition: 'transform 0.2s' }}>
                                        <Camera size={16} />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{t('profilePicture')}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('profilePictureLimit')}</p>
                                    {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem' }}>{t('saving')}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>{t('displayName')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('fullNamePlaceholder')}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>{t('usernameLabelWithAt')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                    placeholder={t('username')}
                                />
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Smartphone size={20} color="var(--primary)" />
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{t('linkedTelebirr')}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.phone}</p>
                                </div>
                                <span className="badge" style={{ marginLeft: 'auto' }}>{t('verifiedText')}</span>
                            </div>
                        </motion.div>

                        <motion.h3 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '-0.5rem', marginTop: '1.5rem' }}>{t('language')}</motion.h3>
                        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="premium-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('language')}</span>
                            <div className="segmented-control" style={{ marginBottom: 0, width: '200px' }}>
                                <div 
                                    className="segmented-indicator"
                                    style={{
                                        left: language === 'en' ? '4px' : 'calc(50% + 2px)',
                                        width: 'calc(50% - 6px)'
                                    }}
                                />
                                {[{ id: 'en', label: 'English' }, { id: 'am', label: 'አማርኛ' }].map(m => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setLanguage(m.id)}
                                        className={`segmented-btn ${language === m.id ? 'active' : ''}`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.h3 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '-0.5rem', marginTop: '1.5rem' }}>{t('securityTitle')}</motion.h3>
                        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <SettingRow
                                icon={Lock}
                                title={t('passwordTitle')}
                                description={t('passwordDesc')}
                                onClick={() => setShowPasswordModal(true)}
                            />
                            <SettingRow
                                icon={ShieldCheck}
                                title={t('twoFactorTitle')}
                                description={t('twoFactorDesc')}
                                badge={twoFactorEnabled ? 'On' : 'Off'}
                                isToggle={true}
                                checked={twoFactorEnabled}
                                onClick={() => {
                                    setTwoFactorEnabled(!twoFactorEnabled);
                                    showAlert(`Two-Factor Authentication ${!twoFactorEnabled ? 'Enabled' : 'Disabled'}`, 'success');
                                }}
                            />
                        </motion.div>
                    </motion.section >

                    <motion.section 
                        initial="hidden" 
                        animate="visible" 
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <motion.h3 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '-0.5rem' }}>{t('notificationsTitle')}</motion.h3>
                        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <SettingRow
                                icon={Bell}
                                title={t('pushNotifications')}
                                description={t('pushNotificationsDesc')}
                                isToggle={true}
                                checked={pushEnabled}
                                onClick={() => {
                                    setPushEnabled(!pushEnabled);
                                    showAlert(`Push Notifications ${!pushEnabled ? 'Enabled' : 'Disabled'}`, 'success');
                                }}
                            />
                            <SettingRow
                                icon={Mail}
                                title={t('emailReports')}
                                description={t('emailReportsDesc')}
                                isToggle={true}
                                checked={emailEnabled}
                                onClick={() => {
                                    setEmailEnabled(!emailEnabled);
                                    showAlert(`Email Reports ${!emailEnabled ? 'Enabled' : 'Disabled'}`, 'success');
                                }}
                            />
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="premium-card" style={{ marginTop: 'auto', border: '1px solid var(--border-color)', opacity: 0.9 }}>
                            <h4 style={{ color: 'var(--danger)', fontWeight: 800, marginBottom: '0.5rem' }}>{t('dangerZone')}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('deleteNotice2')}</p>
                            <button 
                                onClick={() => setShowDeactivateModal(true)}
                                className="btn-primary" 
                                style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', boxShadow: 'none', fontSize: '0.9rem', padding: '0.5rem 1rem', width: 'auto' }}
                            >
                                {t('deactivateAccount')}
                            </button>
                        </motion.div>
                    </motion.section>
                </div >

                {/* Password Update Modal */}
                {showPasswordModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="premium-card" style={{ width: '90%', maxWidth: '400px', position: 'relative' }}>
                            <button onClick={() => setShowPasswordModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={24} />
                            </button>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Update Password</h3>
                            {passwordError && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{passwordError}</div>}
                            <form onSubmit={handleUpdatePassword}>
                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Current Password <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>(Leave blank if you signed in via Google/Phone)</span></label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        value={currentPassword} 
                                        onChange={e => setCurrentPassword(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        value={newPassword} 
                                        onChange={e => setNewPassword(e.target.value)} 
                                        required 
                                        minLength={6}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} disabled={passwordLoading}>
                                    {passwordLoading ? 'Updating...' : 'Save Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Deactivate Account Modal */}
                {showDeactivateModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="premium-card" style={{ width: '90%', maxWidth: '420px', position: 'relative', textAlign: 'center', padding: '2.5rem 2rem' }}>
                            <button onClick={() => setShowDeactivateModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={24} />
                            </button>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <AlertTriangle size={32} color="var(--danger)" />
                            </div>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '1rem' }}>Deactivate Account</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Are you sure you want to permanently deactivate your account? 
                                <br/><br/>
                                This action cannot be undone, and all your data will be permanently removed.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setShowDeactivateModal(false)} className="btn-primary" style={{ flex: 1, background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                                    Cancel
                                </button>
                                <button onClick={() => {
                                    setShowDeactivateModal(false);
                                    showAlert('Account deactivated successfully.', 'success');
                                    setTimeout(() => logout(), 1500);
                                }} className="btn-primary" style={{ flex: 1, background: 'var(--danger)', border: 'none' }}>
                                    Deactivate
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main >
        </div >
    );
}
