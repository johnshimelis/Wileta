import React, { useState } from 'react';
import { Wrench, RefreshCw, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export default function MaintenanceScreen({ message, supportEmail, supportPhone, onRefresh }) {
    const [checking, setChecking] = useState(false);

    const handleCheckStatus = async () => {
        setChecking(true);
        if (onRefresh) {
            await onRefresh();
        } else {
            window.location.reload();
        }
        setTimeout(() => setChecking(false), 1200);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#09090B',
            color: '#F4F4F5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Ambient Glows */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '20%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '20%',
                width: '450px',
                height: '450px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '520px',
                background: '#18181B',
                border: '1px solid #27272A',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Brand Icon Badge */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: '#10B981',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                }}>
                    <Wrench size={30} />
                </div>

                {/* Status Indicator */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#F59E0B',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                    Scheduled System Maintenance
                </div>

                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.02em'
                }}>
                    GurshaPay Upgrades in Progress
                </h1>

                <p style={{
                    fontSize: '14px',
                    color: '#A1A1AA',
                    lineHeight: 1.6,
                    margin: '0 0 1.75rem 0'
                }}>
                    {message || 'GurshaPay is currently undergoing scheduled platform upgrades to improve stability and payment speed. We will be back online shortly.'}
                </p>

                {/* Security Assurance Pill */}
                <div style={{
                    background: '#27272A',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    marginBottom: '1.75rem',
                    border: '1px solid #3F3F46'
                }}>
                    <ShieldCheck size={22} color="#10B981" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '12px', color: '#D4D4D8' }}>
                        <strong style={{ color: '#FFFFFF' }}>Funds & Ledgers Secure:</strong> All creator balances, transactions, and payment data are safeguarded in our banking vaults.
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleCheckStatus}
                    disabled={checking}
                    style={{
                        width: '100%',
                        padding: '12px 20px',
                        background: '#10B981',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: checking ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                    }}
                >
                    <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
                    {checking ? 'Checking System Status...' : 'Check If System Is Back Online'}
                </button>

                {/* Support Contact Footer */}
                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid #27272A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    fontSize: '12px',
                    color: '#71717A'
                }}>
                    {supportEmail && (
                        <a
                            href={`mailto:${supportEmail}`}
                            style={{ color: '#A1A1AA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <Mail size={13} /> {supportEmail}
                        </a>
                    )}
                    {supportPhone && (
                        <a
                            href={`tel:${supportPhone}`}
                            style={{ color: '#A1A1AA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <Phone size={13} /> {supportPhone}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
