import React from 'react';
import { ShieldCheck } from 'lucide-react';
import EthiopianFlag from './EthiopianFlag';
import { useLanguage } from '../context/LanguageContext';

/**
 * Universal Financial Compliance Badge
 * Renders an elegant, organized, single-line fintech security pill.
 * Fully responsive, localized (EN/AM), with zero line wrapping or awkward layout breaks.
 */
export default function ComplianceBadge({ className = '', style = {} }) {
    const { t } = useLanguage();

    return (
        <div
            className={`compliance-badge-wrapper ${className}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginTop: '0.85rem',
                marginBottom: '0.25rem',
                ...style
            }}
        >
            <div
                className="compliance-badge-pill"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.38rem 0.85rem',
                    background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.03))',
                    border: '1px solid var(--border-color)',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    userSelect: 'none',
                    letterSpacing: '0.01em'
                }}
            >
                <ShieldCheck size={14} style={{ color: '#10B981', flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap' }}>
                    {t('securedByGurshaPay') || 'Secured by GurshaPay Financial Compliance'}
                </span>
                <span style={{ opacity: 0.35, fontSize: '0.7rem', flexShrink: 0 }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    <EthiopianFlag width={15} height={10} style={{ borderRadius: '2px' }} />
                    <span>{t('ethiopia') || 'Ethiopia'}</span>
                </span>
            </div>
        </div>
    );
}
