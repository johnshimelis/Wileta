import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'small', className = '' }) {
    const heights = {
        compact: '28px',
        small: '38px',
        medium: '48px',
        large: '60px'
    };

    const h = heights[size] || '38px';

    return (
        <Link 
            to="/" 
            className={`logo-link ${className}`} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.65rem',
                textDecoration: 'none', 
                cursor: 'pointer',
                height: h
            }}
        >
            <img 
                src="/system-logo.png" 
                alt="GurshaPay" 
                style={{ 
                    height: '100%', 
                    width: 'auto', 
                    objectFit: 'contain',
                    pointerEvents: 'none'
                }} 
            />
        </Link>
    );
}
