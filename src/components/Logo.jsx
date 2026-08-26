import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'medium', className = '', showText = true }) {
    const sizeConfig = {
        compact: { height: '32px', fontSize: '1.15rem' },
        small: { height: '38px', fontSize: '1.3rem' },
        medium: { height: '46px', fontSize: '1.5rem' },
        large: { height: '56px', fontSize: '1.8rem' }
    }[size] || { height: '46px', fontSize: '1.5rem' };

    return (
        <Link 
            to="/" 
            className={'logo-brand ' + className} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.65rem',
                textDecoration: 'none', 
                cursor: 'pointer',
                userSelect: 'none',
                height: sizeConfig.height
            }}
        >
            <img 
                src="/gp-official-logo.png" 
                alt="GurshaPay" 
                className="brand-logo-img"
                style={{ 
                    height: '100%', 
                    width: 'auto', 
                    objectFit: 'contain',
                    mixBlendMode: 'multiply'
                }} 
            />
            {showText && (
                <span style={{ 
                    fontSize: sizeConfig.fontSize, 
                    fontWeight: 900, 
                    letterSpacing: '-0.035em', 
                    color: 'var(--text-main)',
                    display: 'inline-flex',
                    alignItems: 'center'
                }}>
                    Gursha<span style={{ color: 'var(--primary)' }}>Pay</span>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)', marginLeft: '3px', marginBottom: '4px' }}></span>
                </span>
            )}
        </Link>
    );
}
