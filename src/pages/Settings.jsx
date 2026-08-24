import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, Settings as SettingsIcon, Bell, Lock, Globe, Smartphone,
    Save, CheckCircle, Mail, Camera, Upload, Menu, X, AlertCircle
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import TopAlert from '../components/TopAlert';

export default function Settings() {
    const { user, setUser, api } = useAuth();
    const { t } = useLanguage();
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);

    // Password state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setUsername(user.username || '');
        }
    }, [user]);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 4000);
    };

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
            showAlert('Profile picture updated successfully!');
        } catch (error) {
            showAlert(error.response?.data?.error || "Upload failed", "error");
        }
        setUploading(false);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!name || !username) {
            showAlert("Name and username are required", "error");
            return;
        }
        setSaving(true);
        try {
            const res = await api.post('/auth/update-profile', { name, username });
            setUser(res.data);
            setSaved(true);
            showAlert('Settings saved successfully!');
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
                {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{t('settingsTitle')}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('settingsSubtitle')}</p>
                    </div>
                    <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <NotificationDrawer />
                        <Button
                            variant="primary"
                            size="sm"
                            icon={Save}
                            onClick={handleSave}
                            loading={saving}
                        >
                            {saved ? 'Saved!' : t('saveSettings')}
                        </Button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                    {/* Left Column: Profile Info */}
                    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('generalSettings')}</h3>

                        {/* Avatar Picker */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, overflow: 'hidden' }}>
                                    {user?.profilePicUrl ? (
                                        <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        user?.name?.charAt(0) || '?'
                                    )}
                                </div>
                                <label
                                    title="Upload photo"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-2px',
                                        right: '-2px',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        border: '2px solid var(--card-bg)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                >
                                    <Camera size={12} />
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                                </label>
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('profilePicture')}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{uploading ? 'Uploading...' : t('profilePictureLimit')}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">{t('displayName')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('usernameLabelWithAt')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={username}
                                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Linked Telebirr</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={user?.telebirr_number || user?.phone || 'Not configured'}
                                    disabled
                                    style={{ background: 'var(--card-bg-subtle)', opacity: 0.8 }}
                                />
                            </div>

                            <Button type="submit" variant="primary" size="md" loading={saving} style={{ marginTop: '0.5rem' }}>
                                {t('saveSettings')}
                            </Button>
                        </form>
                    </Card>

                    {/* Right Column: Preferences & Security */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Notifications Card */}
                        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('notificationsTitle')}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('pushNotifications')}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('pushNotificationsDesc')}</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={pushEnabled}
                                    onChange={e => setPushEnabled(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--border-color)' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('emailReports')}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('emailReportsDesc')}</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailEnabled}
                                    onChange={e => setEmailEnabled(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                            </div>
                        </Card>

                        {/* Security Card */}
                        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('securityTitle')}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('passwordDesc')}</p>
                            <Button variant="outline" size="sm" icon={Lock} onClick={() => setShowPasswordModal(true)}>
                                Change Password
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <div className="auth-card" style={{ maxWidth: '420px', width: '90%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>Change Password</h2>

                            {passwordError && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.875rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    <AlertCircle size={16} /> {passwordError}
                                </div>
                            )}

                            <form onSubmit={handleUpdatePassword}>
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                    <Button type="button" variant="secondary" size="md" className="btn-full" onClick={() => setShowPasswordModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" size="md" className="btn-full" loading={passwordLoading}>
                                        Update
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
