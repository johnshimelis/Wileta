import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'medium', className = '', showText = true, forceWhite = false, textColor }) {
    const sizeConfig = {
        compact: { height: '34px', fontSize: '1.25rem' },
        small: { height: '40px', fontSize: '1.4rem' },
        medium: { height: '48px', fontSize: '1.6rem' },
        large: { height: '58px', fontSize: '1.85rem' }
    }[size] || { height: '48px', fontSize: '1.6rem' };

    const resolvedColor = textColor || (forceWhite ? '#FFFFFF' : 'var(--text-main)');

    return (
        <Link 
            to="/" 
            className={'logo-brand ' + className} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.12rem',
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
                    objectFit: 'contain'
                }} 
                onError={(e) => {
                    e.currentTarget.src = '/gp-logo-transparent.png';
                }}
            />
            {showText && (
                <span style={{ 
                    fontSize: sizeConfig.fontSize, 
                    fontWeight: 900, 
                    letterSpacing: '-0.035em', 
                    color: resolvedColor,
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                    marginLeft: '-1px'
                }}>
                    Gursha<span style={{ color: 'var(--primary, #10B981)' }}>Pay</span>
                    <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--secondary, #F59E0B)', marginLeft: '2px', marginBottom: '3px' }}></span>
                </span>
            )}
        </Link>
    );
}
