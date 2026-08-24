import React from 'react';
import Button from './Button';

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    actionIcon,
    className = '',
    style = {}
}) {
    return (
        <div className={`empty-state ${className}`} style={style}>
            {Icon && (
                <div className="empty-state-icon">
                    <Icon size={28} />
                </div>
            )}
            {title && <h3 className="empty-state-title">{title}</h3>}
            {description && <p className="empty-state-desc">{description}</p>}
            {actionLabel && onAction && (
                <div className="empty-state-action">
                    <Button variant="primary" size="sm" icon={actionIcon} onClick={onAction}>
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}
