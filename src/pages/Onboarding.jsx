import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Sparkles, Smartphone, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

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
        <div className="auth-container" style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '2rem 1.5rem' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Logo size="small" />
                </div>

                <Card padding="lg" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <UserPlus size={28} />
                        </div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.35rem' }}>{t('onboardingTitle')}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {t('onboardingDesc2')}
                        </p>
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleOnboard}>
                        <div className="form-group">
                            <label className="form-label">{t('fullName')}</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder={t('fullNamePlaceholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('chooseUsernameLabel')}</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder={t('usernamePlaceholder')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                required
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                                {t('yourTipLink')}: gurshapay.com/{username || 'username'}
                            </p>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">{t('yourTelebirrNumber')}</label>
                            <input
                                type="tel"
                                className="form-input"
                                placeholder={t('telebirrPlaceholderOnboard')}
                                value={telebirrInfo}
                                onChange={(e) => setTelebirrInfo(e.target.value)}
                                required
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                                Used for receiving direct payouts from supporter tips.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="btn-full"
                            loading={loading}
                        >
                            {t('finishSetup')}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
