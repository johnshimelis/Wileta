import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'small', className = '' }) {
    const sizeConfig = {
        compact: { iconSize: 26, fontSize: '1.05rem' },
        small: { iconSize: 32, fontSize: '1.2rem' },
        medium: { iconSize: 40, fontSize: '1.45rem' },
        large: { iconSize: 48, fontSize: '1.75rem' }
    }[size] || { iconSize: 32, fontSize: '1.2rem' };

    return (
        <Link 
            to="/" 
            className={`logo-brand ${className}`} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.6rem',
                textDecoration: 'none', 
                cursor: 'pointer',
                userSelect: 'none'
            }}
        >
            <div style={{
                width: sizeConfig.iconSize,
                height: sizeConfig.iconSize,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0A5C36 0%, #064E3B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(10, 92, 54, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <img 
                    src="/gp-logo.jpg" 
                    alt="Logo" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            </div>
            <span style={{ 
                fontSize: sizeConfig.fontSize, 
                fontWeight: 900, 
                letterSpacing: '-0.03em', 
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center'
            }}>
                Gursha<span style={{ color: 'var(--primary)' }}>Pay</span>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)', marginLeft: '3px', marginBottom: '4px' }}></span>
            </span>
        </Link>
    );
}
