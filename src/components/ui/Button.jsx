import React from 'react';

export default function Button({
    children,
    variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size = 'md', // 'sm' | 'md' | 'lg'
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    style = {},
    type = 'button',
    onClick,
    ...props
}) {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';
    const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

    return (
        <button
            type={type}
            className={combinedClassName}
            disabled={disabled || loading}
            onClick={onClick}
            style={style}
            {...props}
        >
            {loading ? (
                <span className="spinner" aria-hidden="true"></span>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
                </>
            )}
        </button>
    );
}
