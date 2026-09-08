import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function TopAlert({ message, type = 'success', onClose, duration = 4000 }) {
    useEffect(() => {
        if (!message || !onClose) return;
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, onClose, duration]);

    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: type === 'success' ? 'var(--success, #10B981)' : 'var(--danger, #EF4444)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            animation: 'slide-down-spring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            width: 'calc(100% - 2rem)',
            maxWidth: '420px',
            fontWeight: 700,
            overflow: 'hidden'
        }}>
            {type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                }}
            >
                <X size={18} />
            </button>
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: 'rgba(255, 255, 255, 0.45)',
                width: '100%',
                animation: `toast-progress ${duration}ms linear forwards`,
                transformOrigin: 'left'
            }} />
            <style>{`
                @keyframes slide-down-spring {
                    from { transform: translate(-50%, -100%) scale(0.95); opacity: 0; }
                    to { transform: translate(-50%, 0) scale(1); opacity: 1; }
                }
                @keyframes toast-progress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
}
