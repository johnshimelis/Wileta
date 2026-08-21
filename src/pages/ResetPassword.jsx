import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. The link might be expired.');
        }
        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, y: -20 }}
            className="auth-container"
        >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
                <ThemeToggle />
            </div>

            <div className="auth-card" style={{ padding: '1rem 2.5rem 2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'center' }}>
                    <Logo size="medium" />
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Set New Password</h1>

                {success ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <CheckCircle size={32} color="var(--success)" />
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your password has been successfully reset.</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Redirecting to login...</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleReset}>
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Please enter your new password below.</p>
                        
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <Lock size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <Lock size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? <span className="spinner" style={{width: 20, height: 20}}></span> : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </motion.div>
    );
}
