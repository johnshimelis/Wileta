import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function Signup() {
    const { api } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
            return setError('All fields are required');
        }
        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (form.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/signup', form);
            localStorage.setItem('token', res.data.token);
            navigate('/onboarding');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
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
                maxWidth: '580px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(226, 232, 240, 0.5)',
                padding: '2.5rem 3rem',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', justifyContent: 'center' }}>
                    <img src="/gurshapay-logo.png" alt="GurshaPay Logo" style={{ width: '44px', height: '44px', borderRadius: '1rem', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>GurshaPay</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', marginTop: '0.15rem' }}>ጎርሻፒይ</span>
                    </div>
                </div>

                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Create an account</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Start accepting tips from your audience today.</p>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {/* Row 1: Name */}
                    <div className="input-group">
                        <User size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Row 2: Email & Phone responsive grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        <div className="input-group">
                            <Mail size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email address"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <Phone size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Phone number"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: Password & Confirm responsive grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        <div className="input-group">
                            <Lock size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <div className="input-group">
                            <CheckCircle size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            <input
                                name="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.25rem', borderRadius: '1rem' }}
                    >
                        {loading ? <span className="spinner"></span> : 'Create Account'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    <span style={{ padding: '0 0.75rem' }}>or sign up with</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                        type="button"
                        onClick={() => {
                            const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                ? 'http://localhost:5000'
                                : 'https://wileta-backend.onrender.com';
                            window.location.href = `${backendUrl}/api/auth/google`;
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border-color)',
                            background: 'white',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
