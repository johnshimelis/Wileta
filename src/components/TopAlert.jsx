import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function TopAlert({ message, type = 'success', onClose }) {
    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: type === 'success' ? 'var(--success)' : 'var(--danger)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            animation: 'slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: '320px',
            fontWeight: 700
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
            <style>{`
                @keyframes slide-down {
                    from { transform: translate(-50%, -100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
