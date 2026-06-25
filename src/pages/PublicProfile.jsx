import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Coffee, Smartphone, HeartPulse, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TopAlert from '../components/TopAlert';
import './PublicProfile.css'; // I'll create this for specific animations

export default function PublicProfile() {
    const { api } = useAuth();
    const { username } = useParams();
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [amount, setAmount] = useState('50');
    const [customAmount, setCustomAmount] = useState('');
    const [tipperPhone, setTipperPhone] = useState('');
    const [tippingState, setTippingState] = useState('idle'); // idle | processing | pin_prompt | processing_pin | success | error
    const [pin, setPin] = useState('');
    const [txRef, setTxRef] = useState('');
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/public/${username}`);
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
            const response = await api.post('/payments/initialize-tip', {
                creatorId: creator.id,
                tipperPhone,
                amount: finalAmount
            });

            if (response.data && response.data.success) {
                setTxRef(response.data.tx_ref);
                setTippingState('pin_prompt');
            } else {
                setTippingState('error');
            }
        } catch (err) {
            console.error('Tipping Error:', err);
            setTippingState('error');
        }
    };

    const handlePinSubmit = async (e) => {
        e.preventDefault();
        if (pin.length < 4) {
            showAlert("Please enter a valid PIN", "error");
            return;
        }

        setTippingState('processing_pin');

        try {
            const response = await api.post('/payments/verify-test-pin', {
                tx_ref: txRef,
                pin: pin
            });

            if (response.data && response.data.success) {
                setTippingState('success');
            } else {
                setTippingState('error');
            }
        } catch (err) {
            console.error('PIN Verification Error:', err);
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
        <div className="public-layout" style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.08) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.05) 0%, transparent 40%), #f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem 1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decorative elements */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.03)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '5%', left: '2%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.03)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }}></div>

            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="auth-card animate-fade-in" style={{
                padding: '2.5rem',
                maxWidth: '480px',
                width: '100%',
                zIndex: 1,
                border: '1px solid rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                borderRadius: '2rem'
            }}>

                {/* Creator Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.25rem' }}>
                        <div style={{
                            position: 'absolute',
                            inset: '-4px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
                            borderRadius: '50%',
                            padding: '4px',
                            opacity: 0.15
                        }}></div>
                        <div className="creator-avatar" style={{
                            border: '4px solid #fff',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)',
                            width: '100px',
                            height: '100px',
                            fontSize: '2.5rem',
                            overflow: 'hidden',
                            margin: '0',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {creator.profilePicUrl ? (
                                <img src={creator.profilePicUrl?.startsWith('http') ? creator.profilePicUrl : `https://wileta-backend.onrender.com${creator.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                creator.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>

                    <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>
                        {creator.name}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>
                        <span>@{creator.username}</span>
                        <CheckCircle size={16} fill="var(--primary)" color="white" />
                    </div>

                    <div style={{ width: '40px', height: '3px', background: 'var(--primary)', margin: '1rem auto', borderRadius: '4px', opacity: 0.2 }}></div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto', fontWeight: 500 }}>
                        Support my creative journey with a quick tip. Every <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>"Gursha"</span> counts!
                    </p>
                </div>

                {tippingState === 'success' ? (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#10B981', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 35px -5px rgba(16, 185, 129, 0.25)' }}>
                            <CheckCircle size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', color: '#064e3b', letterSpacing: '-0.02em' }}>Tip Successful!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, fontSize: '1rem', fontWeight: 500 }}>
                            Your contribution of <strong style={{ color: 'var(--text-main)', fontWeight: 900 }}>{amount === 'custom' ? customAmount : amount} ETB</strong> has been delivered.
                        </p>
                        <button
                            onClick={() => { setTippingState('idle'); setAmount('50'); setTipperPhone(''); setPin(''); }}
                            className="btn-primary"
                            style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none', padding: '1rem', height: '58px', borderRadius: '1.25rem', fontWeight: 800 }}
                        >
                            Send Another Tip
                        </button>
                    </div>
                ) : tippingState === 'pin_prompt' || tippingState === 'processing_pin' ? (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 35px -5px rgba(59, 130, 246, 0.15)' }}>
                            <Smartphone size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Check Your Phone</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '1rem', fontWeight: 500 }}>
                            We've sent a Telebirr prompt to <strong style={{ color: 'var(--text-main)' }}>{tipperPhone}</strong>. Please enter your PIN on your phone to complete the tip.
                        </p>

                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px dashed rgba(16, 185, 129, 0.3)', marginBottom: '2rem' }}>
                            <div className="spinner" style={{ width: '24px', height: '24px', margin: '0 auto 0.75rem', borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Awaiting confirmation...</span>
                        </div>

                        <button
                            onClick={() => setTippingState('idle')}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Cancel and go back
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleTip} className="animate-fade-in">
                        <div style={{ marginBottom: '1.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <label style={{ fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Select Tip Amount</label>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>ETB</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                {['25', '50', '100'].map(val => (
                                    <div
                                        key={val}
                                        className={`tip-amount-btn ${amount === val ? 'active' : ''}`}
                                        onClick={() => selectAmount(val)}
                                        style={{
                                            textAlign: 'center',
                                            padding: '0.8rem 0',
                                            fontSize: '1.1rem',
                                            borderRadius: '1rem',
                                            fontWeight: 900,
                                            height: '52px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {val}
                                    </div>
                                ))}
                                <div
                                    className={`tip-amount-btn ${amount === 'custom' ? 'active' : ''}`}
                                    onClick={() => selectAmount('custom')}
                                    style={{
                                        textAlign: 'center',
                                        borderRadius: '1rem',
                                        height: '52px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 0.5rem'
                                    }}
                                >
                                    <input
                                        type="number"
                                        placeholder="+"
                                        onFocus={() => selectAmount('custom')}
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            padding: '0',
                                            fontSize: '1.1rem',
                                            fontWeight: 900,
                                            outline: 'none',
                                            color: 'inherit',
                                            width: '100%',
                                            textAlign: 'center'
                                        }}
                                        required={amount === 'custom'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Telebirr Number</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1.25rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.5 }}>
                                    <Smartphone size={20} />
                                </div>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="09... or 07..."
                                    value={tipperPhone}
                                    onChange={(e) => setTipperPhone(e.target.value)}
                                    style={{
                                        paddingLeft: '3.25rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 800,
                                        height: '60px',
                                        borderRadius: '1.25rem',
                                        background: '#fff',
                                        border: '1.5px solid var(--border-color)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                    required
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '0.6rem',
                                background: 'rgba(0,0,0,0.03)',
                                padding: '0.8rem 1rem',
                                borderRadius: '1rem',
                                marginTop: '1rem'
                            }}>
                                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem', color: 'var(--text-muted)' }} />
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0, fontWeight: 500 }}>
                                    We'll send a <strong style={{ color: 'var(--text-main)' }}>secure PIN prompt</strong> to your phone via Telebirr.
                                </p>
                            </div>
                        </div>

                        {tippingState === 'error' && (
                            <div className="error-message animate-shake" style={{ marginBottom: '1.25rem', borderRadius: '1rem' }}>
                                <AlertCircle size={18} /> Payment initiation failed. Please check your number.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={tippingState === 'processing'}
                            style={{
                                padding: '1rem',
                                fontSize: '1.15rem',
                                borderRadius: '1.25rem',
                                boxShadow: '0 20px 40px -12px rgba(16, 185, 129, 0.35)',
                                height: '64px',
                                fontWeight: 900
                            }}
                        >
                            {tippingState === 'processing' ? (
                                <><span className="spinner" style={{ width: '20px', height: '20px' }}></span> Initiating...</>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                    Send Tip
                                </div>
                            )}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Secured by</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>GurshaPay</span>
                            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>ጎርሻፒይ</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2.5rem', textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Link to="/signup" style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#fff',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '100px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid var(--border-color)'
                }}>
                    <span>Create your own page</span>
                    <span style={{ color: 'var(--primary)' }}>&rarr;</span>
                </Link>
                
                <a href="/privacy.html" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.78rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Privacy Policy</a>
            </div>
        </div>
    );
}
