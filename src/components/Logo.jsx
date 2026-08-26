import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'medium', className = '', showText = true }) {
    const sizeConfig = {
        compact: { height: '30px', fontSize: '1.15rem' },
        small: { height: '36px', fontSize: '1.25rem' },
        medium: { height: '44px', fontSize: '1.45rem' },
        large: { height: '52px', fontSize: '1.7rem' }
    }[size] || { height: '44px', fontSize: '1.45rem' };

    return (
        <Link 
            to="/" 
            className={'logo-brand ' + className} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.28rem',
                textDecoration: 'none', 
                cursor: 'pointer',
                userSelect: 'none',
                height: sizeConfig.height
            }}
        >
            <img 
                src="/gp-logo-transparent.png" 
                alt="GurshaPay" 
                className="brand-logo-img"
                style={{ 
                    height: '100%', 
                    width: 'auto', 
                    objectFit: 'contain'
                }} 
            />
            {showText && (
                <span style={{ 
                    fontSize: sizeConfig.fontSize, 
                    fontWeight: 900, 
                    letterSpacing: '-0.035em', 
                    color: 'var(--text-main)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1
                }}>
                    Gursha<span style={{ color: 'var(--primary)' }}>Pay</span>
                    <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--secondary)', marginLeft: '2px', marginBottom: '3px' }}></span>
                </span>
            )}
        </Link>
    );
}
