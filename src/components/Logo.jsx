import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'medium', className = '' }) {
    const [isHovered, setIsHovered] = useState(false);
    const logoRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!logoRef.current) return;
        const rect = logoRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePos({ x, y });
    };

    const dimensions = {
        small: { height: '60px', textSize: '1.2rem' },
        medium: { height: '140px', textSize: '2.2rem' },
        large: { height: '180px', textSize: '2.8rem' },
        xlarge: { height: '220px', textSize: '3.5rem' }
    }[size];

    return (
        <Link 
            to="/" 
            className={`logo-container animate-fade-in ${className}`} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textDecoration: 'none', 
                cursor: 'pointer',
                perspective: '1000px',
                height: dimensions.height
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMousePos({ x: 0, y: 0 });
            }}
            onMouseMove={handleMouseMove}
            ref={logoRef}
        >
            <div 
                style={{ 
                    height: '100%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.4s ease',
                    transform: isHovered 
                        ? `scale(1.1) rotateX(${mousePos.y * -0.2}deg) rotateY(${mousePos.x * 0.2}deg)` 
                        : 'scale(1) rotateX(0) rotateY(0)',
                    filter: isHovered ? 'drop-shadow(0 15px 25px rgba(10, 92, 54, 0.3))' : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.05))',
                    transformStyle: 'preserve-3d'
                }}
            >
                <img 
                    src="/system-logo.png" 
                    alt="GurshaPay Logo" 
                    style={{ 
                        height: '100%', 
                        width: 'auto', 
                        objectFit: 'contain',
                        pointerEvents: 'none'
                    }} 
                />
            </div>
        </Link>
    );
}
