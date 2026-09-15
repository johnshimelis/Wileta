import React from 'react';

/**
 * Pixel-perfect vector Ethiopian National Flag
 * Renders identically across Windows desktop, macOS, iOS, Android, and Linux.
 * Completely replaces Unicode emoji flags that render as "ET" on Windows desktop browsers.
 */
export const EthiopianFlag = ({ width = 20, height = 14, className = '', style = {} }) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 24 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Ethiopian Flag"
        role="img"
        style={{ 
            borderRadius: '2px', 
            overflow: 'hidden', 
            flexShrink: 0, 
            display: 'inline-block', 
            verticalAlign: 'middle',
            boxShadow: '0 0.5px 2px rgba(0,0,0,0.25)',
            border: '0.5px solid rgba(0,0,0,0.12)',
            ...style 
        }}
    >
        {/* Top green stripe */}
        <rect width="24" height="5.333" fill="#078930" />
        {/* Middle yellow stripe */}
        <rect y="5.333" width="24" height="5.334" fill="#FCDD09" />
        {/* Bottom red stripe */}
        <rect y="10.667" width="24" height="5.333" fill="#DA121A" />
        {/* Central emblem: blue circle */}
        <circle cx="12" cy="8" r="3.2" fill="#0F47AF" />
        {/* Central emblem: yellow 5-point radiant star */}
        <polygon 
            points="12,5.5 12.8,7.3 14.8,7.3 13.2,8.4 13.8,10.2 12,9.1 10.2,10.2 10.8,8.4 9.2,7.3 11.2,7.3" 
            fill="#FCDD09" 
        />
        {/* Radiant rays between star points */}
        <line x1="12" y1="5.6" x2="12" y2="10.4" stroke="#FCDD09" strokeWidth="0.35" />
        <line x1="9.7" y1="6.8" x2="14.3" y2="9.2" stroke="#FCDD09" strokeWidth="0.35" />
        <line x1="14.3" y1="6.8" x2="9.7" y2="9.2" stroke="#FCDD09" strokeWidth="0.35" />
        <circle cx="12" cy="8" r="0.8" fill="#0F47AF" />
    </svg>
);

export default EthiopianFlag;
