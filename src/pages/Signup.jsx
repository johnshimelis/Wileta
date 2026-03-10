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
            background: 'var(--bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
        }}>
            <div className="animate-slide-up" style={{
                width: '100%',
                maxWidth: '580px',
                background: 'var(--card-bg)',
                borderRadius: '1.5rem',
                boxShadow: 'var(--shadow-lg)',
                padding: '2.5rem 3rem',
                border: '1px solid var(--border-color)',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', justifyContent: 'center' }}>
                    <img src="/logo.jpg" alt="Wileta Logo" style={{ width: '44px', height: '44px', borderRadius: '1rem', objectFit: 'cover' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Wileta</span>
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
                                placeholder="09xxxxxxxx"
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

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
