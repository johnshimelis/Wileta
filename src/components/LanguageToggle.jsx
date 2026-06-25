import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'am' : 'en'));
    };

    return (
        <button
            onClick={toggleLanguage}
            className="language-toggle"
            title={`Switch to ${language === 'en' ? 'Amharic (አማርኛ)' : 'English'}`}
            style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.4rem 0.6rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: 'var(--shadow-sm)',
                backdropFilter: 'var(--glass-blur)',
                fontSize: '0.8rem',
                fontWeight: 800,
                fontFamily: 'inherit',
                minWidth: '40px'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            {language === 'en' ? 'EN' : 'አማ'}
        </button>
    );
}
