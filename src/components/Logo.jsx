import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'medium', className = '' }) {
    const sizeConfig = {
        compact: { height: '36px', fontSize: '1.2rem' },
        small: { height: '42px', fontSize: '1.35rem' },
        medium: { height: '50px', fontSize: '1.55rem' },
        large: { height: '64px', fontSize: '1.9rem' }
    }[size] || { height: '50px', fontSize: '1.55rem' };

    return (
        <Link 
            to="/" 
            className={'logo-brand ' + className} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.75rem',
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
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))'
                }} 
            />
            <span style={{ 
                fontSize: sizeConfig.fontSize, 
                fontWeight: 900, 
                letterSpacing: '-0.035em', 
                color: 'var(--text-main)',
                display: 'inline-flex',
                alignItems: 'center'
            }}>
                Gursha<span style={{ color: 'var(--primary)' }}>Pay</span>
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--secondary)', marginLeft: '3px', marginBottom: '5px' }}></span>
            </span>
        </Link>
    );
}
