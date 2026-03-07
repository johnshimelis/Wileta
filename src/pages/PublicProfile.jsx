import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Coffee, Smartphone, HeartPulse, CheckCircle, AlertCircle } from 'lucide-react';
import TopAlert from '../components/TopAlert';

export default function PublicProfile() {
    const { username } = useParams();
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [amount, setAmount] = useState('50');
    const [customAmount, setCustomAmount] = useState('');
    const [tipperPhone, setTipperPhone] = useState('');
    const [tippingState, setTippingState] = useState('idle'); // idle | processing | success | error
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`https://wileta-backend.onrender.com/api/public/${username}`);
                setCreator(res.data);
            } catch (err) {
                setError("We couldn't find this creator. The link might be broken.");
            }
            setLoading(false);
        };
        fetchProfile();
    }, [username]);

    const handleTip = async (e) => {
        e.preventDefault();
        const phoneRegex = /^(09|07)\d{8}$/;
        if (!phoneRegex.test(tipperPhone)) {
            showAlert("Please enter a valid phone number", "error");
            return;
        }
        setTippingState('processing');

        const finalAmount = amount === 'custom' ? customAmount : amount;

        try {
            await axios.post('https://wileta-backend.onrender.com/api/payments/tip', {
                creatorUsername: username,
                tipperPhone,
                amount: finalAmount
            });
            setTippingState('success');
        } catch (err) {
            setTippingState('error');
        }
    };

    const selectAmount = (val) => {
        setAmount(val);
        if (val !== 'custom') setCustomAmount('');
    };

    if (loading) {
        return (
            <div className="auth-container">
                <div className="spinner" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent', width: '50px', height: '50px' }}></div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div className="auth-container">
                <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🤔</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Oops!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>{error}</p>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Homepage</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="public-layout">
            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            <div className="auth-card animate-fade-in" style={{ padding: '3rem 2.5rem', maxWidth: '500px', width: '100%', zIndex: 1, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.92)' }}>

                {/* Creator Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="creator-avatar" style={{ border: 'none', background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', width: '100px', height: '100px', fontSize: '2.8rem', overflow: 'hidden' }}>
                        {creator.profilePicUrl ? (
                            <img src={`https://wileta-backend.onrender.com${creator.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            creator.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                        {creator.name}
                    </h1>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>@{creator.username}</p>
                    <div style={{ width: '40px', height: '3px', background: 'var(--primary)', margin: '1.5rem auto', borderRadius: '2px', opacity: 0.3 }}></div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto' }}>
                        Support my work by leaving a tip. Every contribution is directly received and deeply appreciated.
                    </p>
                </div>

                {tippingState === 'success' ? (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#10B981', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 15px rgba(220, 252, 231, 0.5)' }}>
                            <CheckCircle size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', color: '#064e3b' }}>Payment Received!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            Your tip of <strong style={{ color: 'var(--text-main)' }}>{amount === 'custom' ? customAmount : amount} ETB</strong> has been successfully sent. Thank you!
                        </p>
                        <button
                            onClick={() => { setTippingState('idle'); setAmount('50'); setTipperPhone(''); }}
                            className="btn-primary"
                            style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
                        >
                            Send Another Tip
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleTip} className="animate-fade-in">
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Amount (ETB)</label>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {['10', '50', '100'].map(val => (
                                    <div
                                        key={val}
                                        className={`tip-amount-btn ${amount === val ? 'active' : ''}`}
                                        onClick={() => selectAmount(val)}
                                        style={{ textAlign: 'center', padding: '0.8rem' }}
                                    >
                                        {val}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '0.75rem' }}>
                                <div
                                    className={`tip-amount-btn ${amount === 'custom' ? 'active' : ''}`}
                                    onClick={() => selectAmount('custom')}
                                    style={{ textAlign: 'left', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center' }}
                                >
                                    <span style={{ color: amount === 'custom' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>Custom:</span>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        onFocus={() => selectAmount('custom')}
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        style={{
                                            flex: 1,
                                            border: 'none',
                                            background: 'transparent',
                                            padding: '0 0.5rem',
                                            fontSize: '1.1rem',
                                            fontWeight: 800,
                                            outline: 'none',
                                            color: '#0f172a', /* Explicit black color */
                                            width: '100%'
                                        }}
                                        required={amount === 'custom'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Telebirr Number</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1.25rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Smartphone size={20} />
                                </div>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="09... or 07..."
                                    value={tipperPhone}
                                    onChange={(e) => setTipperPhone(e.target.value)}
                                    style={{
                                        paddingLeft: '3.2rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: '#0f172a', /* Explicit black color */
                                        height: '56px',
                                        background: '#fff'
                                    }}
                                    required
                                />
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.8rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start', lineHeight: 1.5, padding: '0 0.5rem' }}>
                                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                                You'll receive a Telebirr PIN prompt on your phone to authorize this payment securely.
                            </p>
                        </div>

                        {tippingState === 'error' && (
                            <div className="error-message" style={{ marginBottom: '1.5rem' }}>
                                <AlertCircle size={18} /> Payment initiation failed. Please try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={tippingState === 'processing'}
                            style={{
                                padding: '1.2rem',
                                fontSize: '1.2rem',
                                borderRadius: '1rem',
                                boxShadow: '0 12px 30px -8px rgba(16, 185, 129, 0.4)',
                                height: '64px'
                            }}
                        >
                            {tippingState === 'processing' ? (
                                <><span className="spinner"></span> Processing...</>
                            ) : (
                                <><Coffee size={24} /> Support {creator.name}</>
                            )}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px dotted var(--border-color)', paddingTop: '2rem' }}>
                    Powered by <strong style={{ color: 'var(--text-main)', fontWeight: 800 }}>Wileta</strong>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', left: '0', right: '0', textAlign: 'center', zIndex: 0 }}>
                <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>Create your own tipping page &rarr;</Link>
            </div>
        </div>
    );
}
