import React from 'react';
import { soundFx } from '../../utils/soundFx';

export default function Button({
    children,
    variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size = 'md',         // 'sm' | 'md' | 'lg'
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    style = {},
    ...props
}) {
    const handleClick = (e) => {
        if (loading || disabled) return;
        soundFx.playClick();
        if (onClick) onClick(e);
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={handleClick}
            className={`btn btn-${variant} btn-${size} ${className}`}
            style={style}
            {...props}
        >
            {loading ? (
                <span className="spinner" />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
                </>
            )}
        </button>
    );
}
