import React from 'react';

export default function Card({
    children,
    className = '',
    style = {},
    padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
    hover = false,
    ...props
}) {
    const padClass = padding !== 'md' ? `card-pad-${padding}` : '';
    const hoverClass = hover ? 'card-hover' : '';
    const combined = `card ${padClass} ${hoverClass} ${className}`.trim();

    return (
        <div className={combined} style={style} {...props}>
            {children}
        </div>
    );
}
