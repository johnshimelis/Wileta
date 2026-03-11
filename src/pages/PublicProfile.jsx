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
                const res = await axios.get(`https://gurshapay-backend.onrender.com/api/public/${username}`);
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
            // Using local URL
            const response = await axios.post('https://gurshapay-backend.onrender.com/api/payments/initialize-tip', {
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
            const response = await axios.post('https://gurshapay-backend.onrender.com/api/payments/verify-test-pin', {
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
        <div className="public-layout">
            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            <div className="auth-card animate-fade-in" style={{ padding: '1.5rem 2rem', maxWidth: '700px', width: '100%', zIndex: 1, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.92)' }}>

                {/* Creator Header */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div className="creator-avatar" style={{ border: 'none', background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', width: '60px', height: '60px', fontSize: '1.8rem', overflow: 'hidden', margin: '0 auto 0.5rem' }}>
                        {creator.profilePicUrl ? (
                            <img src={creator.profilePicUrl?.startsWith('http') ? creator.profilePicUrl : `https://gurshapay-backend.onrender.com${creator.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            creator.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                        {creator.name}
                    </h1>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>@{creator.username}</p>
                    <div style={{ width: '30px', height: '2px', background: 'var(--primary)', margin: '0.5rem auto', borderRadius: '2px', opacity: 0.3 }}></div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4, maxWidth: '400px', margin: '0 auto' }}>
                        Support my work by leaving a tip! Every contribution is deeply appreciated.
                    </p>
                </div>

                {tippingState === 'success' ? (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#10B981', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 10px rgba(220, 252, 231, 0.5)' }}>
                            <CheckCircle size={30} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#064e3b' }}>Payment Received!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            Your tip of <strong style={{ color: 'var(--text-main)' }}>{amount === 'custom' ? customAmount : amount} ETB</strong> has been successfully sent. Thank you!
                        </p>
                        <button
                            onClick={() => { setTippingState('idle'); setAmount('50'); setTipperPhone(''); setPin(''); }}
                            className="btn-primary"
                            style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none', padding: '1rem', height: '54px' }}
                        >
                            Send Another Tip
                        </button>
                    </div>
                ) : tippingState === 'pin_prompt' || tippingState === 'processing_pin' ? (
                    <form onSubmit={handlePinSubmit} className="animate-fade-in" style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 10px rgba(254, 243, 199, 0.5)' }}>
                            <Smartphone size={30} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#92400e' }}>Enter Telebirr PIN</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            Please enter your Telebirr PIN to authorize the <strong style={{ color: 'var(--text-main)' }}>{amount === 'custom' ? customAmount : amount} ETB</strong> tip.
                        </p>

                        <div style={{ marginBottom: '1.5rem', maxWidth: '250px', margin: '0 auto 1.5rem' }}>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    letterSpacing: '0.5em',
                                    fontWeight: 800,
                                    color: '#0f172a',
                                    height: '56px',
                                    background: '#fff'
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={tippingState === 'processing_pin'}
                            style={{
                                padding: '1rem',
                                fontSize: '1.1rem',
                                borderRadius: '1rem',
                                boxShadow: '0 12px 30px -8px rgba(16, 185, 129, 0.4)',
                                height: '56px',
                                width: '100%'
                            }}
                        >
                            {tippingState === 'processing_pin' ? (
                                <><span className="spinner"></span> Verifying...</>
                            ) : (
                                "Authorize Payment"
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleTip} className="animate-fade-in">
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Amount (ETB)</label>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                                {['10', '50', '100'].map(val => (
                                    <div
                                        key={val}
                                        className={`tip-amount-btn ${amount === val ? 'active' : ''}`}
                                        onClick={() => selectAmount(val)}
                                        style={{ textAlign: 'center', padding: '0.6rem', fontSize: '1rem' }}
                                    >
                                        {val}
                                    </div>
                                ))}
                                <div
                                    className={`tip-amount-btn ${amount === 'custom' ? 'active' : ''}`}
                                    onClick={() => selectAmount('custom')}
                                    style={{ textAlign: 'center', padding: '0.6rem', display: 'flex', alignItems: 'center' }}
                                >
                                    <input
                                        type="number"
                                        placeholder="Custom"
                                        onFocus={() => selectAmount('custom')}
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        style={{
                                            flex: 1,
                                            border: 'none',
                                            background: 'transparent',
                                            padding: '0',
                                            fontSize: '1rem',
                                            fontWeight: 800,
                                            outline: 'none',
                                            color: '#0f172a',
                                            width: '100%',
                                            textAlign: 'center'
                                        }}
                                        required={amount === 'custom'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Telebirr Number</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '0.8rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Smartphone size={16} />
                                </div>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="09... or 07..."
                                    value={tipperPhone}
                                    onChange={(e) => setTipperPhone(e.target.value)}
                                    style={{
                                        paddingLeft: '2.5rem',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: '#0f172a', /* Explicit black color */
                                        height: '48px',
                                        background: '#fff'
                                    }}
                                    required
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', gap: '0.4rem', alignItems: 'flex-start', lineHeight: 1.3, padding: '0 0.2rem' }}>
                                <AlertCircle size={12} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                                You'll receive a Telebirr PIN prompt to authorize securely.
                            </p>
                        </div>

                        {tippingState === 'error' && (
                            <div className="error-message" style={{ marginBottom: '0.8rem', padding: '0.6rem', fontSize: '0.85rem' }}>
                                <AlertCircle size={14} /> Payment initiation failed. Please try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={tippingState === 'processing'}
                            style={{
                                padding: '0.8rem',
                                fontSize: '1.05rem',
                                borderRadius: '0.8rem',
                                boxShadow: '0 4px 12px -4px rgba(16, 185, 129, 0.4)',
                                height: '50px'
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

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px dotted var(--border-color)', paddingTop: '0.8rem' }}>
                    Powered by <strong style={{ color: 'var(--text-main)', fontWeight: 800 }}>GurshaPay</strong>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '0.8rem', left: '0', right: '0', textAlign: 'center', zIndex: 0 }}>
                <Link to="/login" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>Create your own tipping page &rarr;</Link>
            </div>
        </div>
    );
}
