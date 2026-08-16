import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

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

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <motion.div 
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="auth-container"
        >
            {/* Top Right Actions */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="auth-card">
                <div className="auth-header" style={{ marginBottom: '2.5rem' }}>
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        style={{
                            width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '1.25rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem',
                            color: 'white', boxShadow: '0 10px 20px -5px var(--primary-glow)',
                            transform: 'rotate(-5deg)'
                        }}
                    >
                        <UserPlus size={32} />
                    </motion.div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>{t('onboardingTitle')}</h2>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                        {t('onboardingDesc2')}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleOnboard}>
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
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 600 }}>
                            {t('yourTipLink')}: gurshapay.com/{username || 'username'}
                        </p>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                        <label htmlFor="telebirr" className="form-label">{t('yourTelebirrNumber')}</label>
                        <input
                            id="telebirr"
                            type="tel"
                            className="form-input"
                            placeholder={t('telebirrPlaceholderOnboard')}
                            value={telebirrInfo}
                            onChange={(e) => setTelebirrInfo(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner"></span> : t('finishSetup')}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
