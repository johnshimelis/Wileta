import React from 'react';

export default function Badge({
    children,
    variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'
    size = 'md', // 'sm' | 'md'
    icon: Icon,
    className = '',
    style = {},
    ...props
}) {
    const baseClass = 'badge';
    const variantClass = `badge-${variant}`;
    const sizeClass = size === 'sm' ? 'badge-sm' : '';
    const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

    return (
        <span className={combinedClassName} style={style} {...props}>
            {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
            {children}
        </span>
    );
}
