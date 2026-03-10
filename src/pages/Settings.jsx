import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, LayoutDashboard, ShieldCheck, Settings as SettingsIcon,
    LogOut, TrendingUp, Bell, Lock, Globe, Smartphone,
    Save, CheckCircle, ChevronRight, Mail, Camera, Upload, Menu, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import TopAlert from '../components/TopAlert';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';

export default function Settings() {
    const { user, setUser, api, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState(null);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            showAlert("Profile picture updated!");
        } catch (error) {
            showAlert(error.response?.data?.error || "Upload failed", "error");
        }
        setUploading(false);
    };

    const handleSave = async () => {
        if (!name || !username) {
            showAlert("Name and Username are required", "error");
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

    const SettingRow = ({ icon: Icon, title, description, badge }) => (
        <div
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
                <ChevronRight size={20} color="var(--text-muted)" />
            </div>
        </div>
    );

    return (
        <div className="app-layout">
            <div className="mobile-header-container mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.jpg" alt="Wileta Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Wileta</span>
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
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Settings</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Customize your experience and account security</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ width: 'auto', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                        disabled={saving}
                    >
                        {saved ? <><CheckCircle size={18} /> Changes Saved</> : (saving ? <span className="spinner"></span> : <><Save size={18} /> Save Changes</>)}
                    </button>
                </header>

                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '-0.5rem' }}>General Settings</h3>
                        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                                    <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Profile Picture</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PNG or JPG. Max 5MB.</p>
                                    {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem' }}>Uploading...</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Display Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Username (@)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                    placeholder="username"
                                />
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Smartphone size={20} color="var(--primary)" />
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Linked Telebirr</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.phone}</p>
                                </div>
                                <span className="badge" style={{ marginLeft: 'auto' }}>Verified</span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '-0.5rem', marginTop: '1.5rem' }}>Security</h3>
                        <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <SettingRow
                                icon={Lock}
                                title="Password"
                                description="Update your account password"
                            />
                            <SettingRow
                                icon={ShieldCheck}
                                title="Two-Factor"
                                description="Secure your account with 2FA"
                                badge="Off"
                            />
                        </div>
                    </section>

                    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '-0.5rem' }}>Notifications</h3>
                        <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <SettingRow
                                icon={Bell}
                                title="Push Notifications"
                                description="Notify when you receive a new tip"
                            />
                            <SettingRow
                                icon={Mail}
                                title="Email Reports"
                                description="Weekly summary of your earnings"
                            />
                        </div>

                        <div className="dashboard-card" style={{ marginTop: 'auto', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <h4 style={{ color: 'var(--danger)', fontWeight: 800, marginBottom: '0.5rem' }}>Danger Zone</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
                            <button className="btn-primary" style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', boxShadow: 'none', fontSize: '0.9rem', padding: '0.5rem 1rem', width: 'auto' }}>
                                Deactivate Account
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
