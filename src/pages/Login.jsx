import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const { login, api } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!phone) {
            setError('Please enter your phone number first');
            return;
        }
        setError('');
        setSendingOtp(true);
        try {
            await api.post('/auth/request-otp', { phone });
            setOtpSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        }
        setSendingOtp(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        let res;
        if (loginMethod === 'email') {
            if (!email || !password) {
                setError('Email and password are required');
                setLoading(false);
                return;
            }
            res = await login({ email, password });
        } else {
            if (!phone || !otp) {
                setError('Phone and OTP are required');
                setLoading(false);
                return;
            }
            res = await login({ phone, otp });
        }

        if (res.success) {
            if (res.user.isOnboarded) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        } else {
            setError(res.error);
        }
        setLoading(false);
    };



    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, rgba(15, 157, 88, 0.08), transparent 500px), radial-gradient(circle at bottom left, rgba(66, 133, 244, 0.08), transparent 500px), var(--bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
        }}>
            <div className="animate-slide-up" style={{
                width: '100%',
                maxWidth: '500px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(226, 232, 240, 0.5)',
                padding: '2.5rem 3rem',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', justifyContent: 'center' }}>
                    <img src="/logo.jpg" alt="Wileta Logo" style={{ width: '44px', height: '44px', borderRadius: '1rem', objectFit: 'cover' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Wileta</span>
                </div>

                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Welcome back</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Sign in to manage your tips and earnings.</p>

                {/* Method Switcher */}
                <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: '1rem', padding: '4px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                    {[{ id: 'email', label: 'Email & Password' }, { id: 'phone', label: 'Phone & OTP' }].map(m => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => { setLoginMethod(m.id); setError(''); }}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: loginMethod === m.id ? 'var(--card-bg)' : 'transparent',
                                color: loginMethod === m.id ? 'var(--primary)' : 'var(--text-muted)',
                                boxShadow: loginMethod === m.id ? 'var(--shadow-sm)' : 'none',
                                fontFamily: 'inherit',
                            }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    {loginMethod === 'email' ? (
                        <>
                            <div className="input-group">
                                <Mail size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <Lock size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-group">
                                <Phone size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                <input
                                    type="tel"
                                    placeholder="Phone number (09...)"
                                    value={phone}
                                    onChange={e => { setPhone(e.target.value); setError(''); setOtpSent(false); }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp || !phone}
                                    style={{
                                        background: otpSent ? '#059669' : 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        padding: '0.3rem 0.6rem',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: (sendingOtp || !phone) ? 'not-allowed' : 'pointer',
                                        opacity: (sendingOtp || !phone) ? 0.7 : 1,
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {sendingOtp ? '...' : (otpSent ? 'Sent!' : 'Get OTP')}
                                </button>
                            </div>
                            {otpSent && (
                                <div className="animate-fade-in delay-1 input-group">
                                    <Lock size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                    <input
                                        type="text"
                                        placeholder="6-digit OTP code"
                                        value={otp}
                                        onChange={e => { setOtp(e.target.value); setError(''); }}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            )}
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', marginTop: '-0.5rem' }}>
                                {!otpSent ? 'Click "Get OTP" to receive a code via SMS' : 'A code was sent to your phone!'}
                            </p>
                        </>
                    )}

                    {(loginMethod === 'email' || (loginMethod === 'phone' && otpSent)) && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.25rem', borderRadius: '1rem' }}
                        >
                            {loading ? <span className="spinner"></span> : 'Sign In'}
                        </button>
                    )}
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
