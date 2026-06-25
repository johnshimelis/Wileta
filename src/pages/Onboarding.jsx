import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function Onboarding() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [telebirrInfo, setTelebirrInfo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { onboard } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleOnboard = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await onboard(name, username, telebirrInfo);

        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container" style={{ position: 'relative' }}>
            {/* Top Right Actions */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-icon animate-fade-in delay-1">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="auth-title animate-fade-in delay-1">{t('onboardingTitle')}</h2>
                    <p className="auth-subtitle animate-fade-in delay-2">
                        {t('onboardingDesc2')}
                    </p>
                </div>

                <form onSubmit={handleOnboard} className="animate-fade-in delay-2">
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">{t('fullName')}</label>
                        <input
                            id="name"
                            type="text"
                            className="form-input"
                            placeholder={t('fullNamePlaceholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username" className="form-label">{t('chooseUsernameLabel')}</label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            placeholder={t('usernamePlaceholder')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                            required
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 500 }}>
                            {t('yourTipLink')}: gurshapay.com/{username || 'username'}
                        </p>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label htmlFor="telebirr" className="form-label">{t('yourTelebirrNumber')}</label>
                        <input
                            id="telebirr"
                            type="tel"
                            className="form-input"
                            placeholder={t('telebirrPlaceholderOnboard')}
                            value={telebirrInfo}
                            onChange={(e) => setTelebirrInfo(e.target.value)}
                            style={{ color: '#0f172a' }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner"></span> : t('finishSetup')}
                    </button>
                </form>
            </div>
        </div>
    );
}
