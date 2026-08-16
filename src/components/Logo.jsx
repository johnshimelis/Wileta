import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'medium', className = '' }) {
    const [isHovered, setIsHovered] = useState(false);

    // Using slightly larger height since we have text next to it
    const dimensions = {
        small: { height: '40px', textSize: '1.4rem' },
        medium: { height: '56px', textSize: '1.8rem' },
        large: { height: '80px', textSize: '2.5rem' },
        xlarge: { height: '120px', textSize: '3.5rem' }
    }[size];

    return (
        <Link 
            to="/" 
            className={`logo-container animate-fade-in ${className}`} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.85rem', // Gap between image and text
                textDecoration: 'none', 
                cursor: 'pointer',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img 
                src="/gurshapay-logo-new.png" 
                alt="GurshaPay Logo" 
                style={{ 
                    height: dimensions.height,
                    width: 'auto',
                    objectFit: 'contain',
                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: isHovered ? 'scale(1.08) rotate(-3deg)' : 'scale(1) rotate(0deg)',
                    filter: isHovered ? 'drop-shadow(0 8px 16px rgba(10, 92, 54, 0.2))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))'
                }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ 
                    fontSize: dimensions.textSize, 
                    fontWeight: 900, 
                    letterSpacing: isHovered ? '0.02em' : '-0.02em', 
                    lineHeight: 1,
                    fontFamily: "'Playfair Display', 'Outfit', serif", // Adding elegant serif font
                    color: isHovered ? 'var(--primary)' : 'var(--text-main)', // Simple color transition
                    transition: 'all 0.4s ease'
                }}>
                    GurshaPay
                </span>
                <span style={{ 
                    fontSize: `calc(${dimensions.textSize} * 0.45)`, 
                    fontWeight: 800, 
                    letterSpacing: isHovered ? '0.15em' : '0.05em', 
                    marginTop: '0.2rem',
                    color: 'var(--primary)',
                    transition: 'all 0.4s ease',
                    opacity: isHovered ? 1 : 0.8
                }}>
                    ጎርሻፒይ
                </span>
            </div>
        </Link>
    );
}
