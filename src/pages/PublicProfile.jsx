import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Smartphone, MessageSquare, CheckCircle, Share2, Coffee, Shield } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import TopAlert from '../components/TopAlert';
import { useAuth } from '../context/AuthContext';

const PublicProfile = () => {
    const { username } = useParams();
    const { t } = useLanguage();
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [amount, setAmount] = useState('50');
    const [customAmount, setCustomAmount] = useState('');
    const [tipperPhone, setTipperPhone] = useState('');
    const [shoutOutMessage, setShoutOutMessage] = useState('');
    const [tippingState, setTippingState] = useState('idle');
    const [alert, setAlert] = useState(null);
    const [txRef, setTxRef] = useState('');

    useEffect(() => {
        const fetchCreator = async () => {
            try {
                const res = await api.get(`/creators/${username}`);
                setCreator(res.data);
            } catch (err) {
                console.error("Fetch creator error:", err);
                setAlert({ message: 'Creator not found', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchCreator();
    }, [username, api]);

    useEffect(() => {
        let intervalId;
        if (tippingState === 'pin_prompt' && txRef) {
            intervalId = setInterval(async () => {
                try {
                    const res = await api.get(`/payments/status/${txRef}`);
                    if (res.data.status === 'success') {
                        setTippingState('success');
                        clearInterval(intervalId);
                    } else if (res.data.status === 'failed' || res.data.status === 'abandoned') {
                        setTippingState('idle');
                        setAlert({ message: 'Payment failed or was cancelled.', type: 'error' });
                        clearInterval(intervalId);
                    }
                } catch (err) {
                    console.error("Status polling error:", err);
                }
            }, 3000);
        }
        return () => clearInterval(intervalId);
    }, [tippingState, txRef, api]);

    const handleTip = async (e) => {
        e.preventDefault();
        const finalAmount = amount === 'custom' ? customAmount : amount;
        
        if (!finalAmount || parseFloat(finalAmount) < 1) {
            setAlert({ message: 'Please enter a valid amount (Min 1 ETB)', type: 'error' });
            return;
        }

        setTippingState('processing');
        try {
            const res = await api.post('/payments/initialize-tip', {
                creatorId: creator._id,
                amount: finalAmount,
                tipperPhone: tipperPhone,
                message: shoutOutMessage,
                paymentType: 'telebirr'
            });

            if (res.data.status === 'success' || res.data.status === 'pending') {
                setTxRef(res.data.tx_ref);
                setTippingState('pin_prompt');
            } else {
                setAlert({ message: 'Failed to initialize tip', type: 'error' });
                setTippingState('idle');
            }
        } catch (err) {
            console.error("Tip initialization error:", err);
            setAlert({ message: err.response?.data?.error || 'Payment failed to initiate', type: 'error' });
            setTippingState('idle');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    if (!creator) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Creator not found</h2>
                    <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    const selectAmount = (val) => {
        setAmount(val);
        if (val !== 'custom') setCustomAmount('');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', fontFamily: "'Outfit', sans-serif" }}>
            <style>{`
                .bmc-container { max-width: 960px; margin: 0 auto; padding: 4rem 1.5rem; display: flex; gap: 4rem; align-items: flex-start; }
                @media (max-width: 768px) { .bmc-container { flexDirection: column; padding: 2rem 1rem; gap: 2rem; } }
                .bmc-left { flex: 1; }
                .bmc-right { flex: 1; max-width: 480px; width: 100%; }
                .bmc-card { background: var(--card-bg); border-radius: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03); padding: 2.5rem; border: 1px solid rgba(0,0,0,0.04); }
                .bmc-avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,0.08); margin-bottom: 1.5rem; }
                .bmc-name { font-size: 2.5rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.5rem 0; letter-spacing: -0.02em; line-height: 1.1; }
                .bmc-username { font-size: 1.1rem; font-weight: 600; color: var(--text-muted); display: flex; alignItems: center; gap: 0.25rem; margin-bottom: 1.5rem; }
                .bmc-bio { font-size: 1.15rem; line-height: 1.6; color: var(--text-main); opacity: 0.85; margin-bottom: 2rem; }
                
                .bmc-amount-btn { 
                    flex: 1; padding: 1rem 0; border-radius: 16px; font-size: 1.25rem; font-weight: 800; 
                    background: transparent; border: 2px solid var(--border-color); color: var(--text-main);
                    cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .bmc-amount-btn.active { 
                    border-color: var(--primary); background: rgba(10, 92, 54, 0.05); color: var(--primary); 
                    box-shadow: 0 4px 14px rgba(10, 92, 54, 0.1); transform: translateY(-2px);
                }
                .bmc-amount-btn:hover:not(.active) { border-color: rgba(10, 92, 54, 0.3); background: rgba(10, 92, 54, 0.02); }
                
                .bmc-input { 
                    width: 100%; padding: 1rem 1.25rem; border-radius: 12px; font-size: 1.05rem; font-weight: 500;
                    background: rgba(0,0,0,0.02); border: 1.5px solid transparent; color: var(--text-main);
                    transition: all 0.2s; outline: none; font-family: inherit;
                }
                .bmc-input:hover { background: rgba(0,0,0,0.04); }
                .bmc-input:focus { background: var(--bg-color); border-color: var(--primary); box-shadow: 0 0 0 4px rgba(10, 92, 54, 0.1); }
                
                .bmc-submit {
                    width: 100%; padding: 1.25rem; border-radius: 100px; background: var(--primary); color: white;
                    font-size: 1.2rem; font-weight: 800; border: none; cursor: pointer; transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(10, 92, 54, 0.2); display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                }
                .bmc-submit:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(10, 92, 54, 0.3); }
                .bmc-submit:disabled { opacity: 0.7; cursor: not-allowed; }
            `}</style>

            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="bmc-container">
                {/* Left Side: Creator Profile */}
                <div className="bmc-left">
                    {creator.profilePicUrl ? (
                        <img src={creator.profilePicUrl?.startsWith('http') ? creator.profilePicUrl : 'https://wileta-backend.onrender.com' + creator.profilePicUrl} alt="Avatar" className="bmc-avatar" />
                    ) : (
                        <div className="bmc-avatar" style={{ background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 800 }}>
                            {creator.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h1 className="bmc-name">{creator.name}</h1>
                    <div className="bmc-username">
                        @{creator.username} <CheckCircle size={16} color="var(--primary)" style={{ fill: 'rgba(10, 92, 54, 0.1)' }} />
                    </div>
                    <p className="bmc-bio">{t('supportJourney')}</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <Shield size={16} /> Secure Payment
                        </div>
                    </div>
                </div>

                {/* Right Side: Tipping Card */}
                <div className="bmc-right">
                    <div className="bmc-card">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                            <Coffee size={28} color="var(--primary)" />
                            Buy {creator.name.split(' ')[0]} a coffee
                        </h2>

                        {tippingState === 'success' ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>{t('tipSuccessful')}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                                    {t('contributionDelivered')} <strong>{amount === 'custom' ? customAmount : amount} ETB</strong>
                                </p>
                                <button onClick={() => { setTippingState('idle'); setAmount('50'); }} className="bmc-submit" style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                                    {t('sendAnotherTip')}
                                </button>
                            </div>
                        ) : tippingState === 'pin_prompt' || tippingState === 'processing_pin' ? (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Smartphone size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{t('checkYourPhone')}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
                                    {t('telebirrPromptNotice')} <strong style={{ color: 'var(--text-main)' }}>{tipperPhone}</strong>
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                                    <div className="spinner" style={{ width: '32px', height: '32px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
                                </div>
                                <button onClick={() => setTippingState('idle')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
                                    {t('cancelAndGoBack')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleTip}>
                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    {['25', '50', '100'].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`bmc-amount-btn ${amount === val ? 'active' : ''}`}
                                            onClick={() => selectAmount(val)}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ 
                                    display: 'flex', alignItems: 'center', padding: '0.5rem 1.25rem', borderRadius: '12px', marginBottom: '2rem',
                                    background: amount === 'custom' ? 'var(--bg-color)' : 'rgba(0,0,0,0.02)', 
                                    border: `1.5px solid ${amount === 'custom' ? 'var(--primary)' : 'transparent'}`,
                                    boxShadow: amount === 'custom' ? '0 0 0 4px rgba(10, 92, 54, 0.1)' : 'none',
                                    transition: 'all 0.2s'
                                }} onClick={() => selectAmount('custom')}>
                                    <span style={{ fontWeight: 800, color: 'var(--text-muted)', marginRight: '0.5rem', fontSize: '1.1rem' }}>ETB</span>
                                    <input
                                        type="number" min="1" placeholder="Custom Amount"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        onFocus={() => selectAmount('custom')}
                                        required={amount === 'custom'}
                                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Your Telebirr Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            <Smartphone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            className="bmc-input"
                                            style={{ paddingLeft: '3rem' }}
                                            placeholder="09... or 07..."
                                            value={tipperPhone}
                                            onChange={(e) => setTipperPhone(e.target.value)}
                                            required
                                            pattern="0[79][0-9]{8}"
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Message (Optional)</label>
                                    <textarea
                                        className="bmc-input"
                                        placeholder="Say something nice..."
                                        rows="3"
                                        value={shoutOutMessage}
                                        onChange={(e) => setShoutOutMessage(e.target.value)}
                                        style={{ resize: 'none' }}
                                    />
                                </div>

                                <button type="submit" className="bmc-submit" disabled={tippingState === 'processing'}>
                                    {tippingState === 'processing' ? (
                                        <span className="spinner" style={{ width: '24px', height: '24px' }}></span>
                                    ) : (
                                        `Support ${amount === 'custom' ? (customAmount || '0') : amount} ETB`
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
