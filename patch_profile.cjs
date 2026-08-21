const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicProfile.jsx', 'utf8');

const newLayout = `
        <div className="public-layout" style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="profile-card-container animate-fade-in" style={{
                maxWidth: '440px',
                width: '100%',
                background: 'var(--card-bg)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                overflow: 'hidden',
                position: 'relative',
                marginTop: '40px'
            }}>
                {/* Header Pattern / Cover */}
                <div style={{
                    height: '100px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)',
                    position: 'relative'
                }}>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.1, position: 'absolute', mixBlendMode: 'overlay' }}>
                        <defs><pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="white"/></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#p)"/>
                    </svg>
                </div>

                <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '50%',
                        border: '4px solid var(--card-bg)',
                        background: 'var(--primary)',
                        margin: '-44px auto 1rem',
                        position: 'relative',
                        zIndex: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '2rem',
                        overflow: 'hidden'
                    }}>
                        {creator.profilePicUrl ? (
                            <img src={creator.profilePicUrl?.startsWith('http') ? creator.profilePicUrl : 'https://wileta-backend.onrender.com' + creator.profilePicUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            creator.name.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                            {creator.name}
                        </h1>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            @{creator.username} <CheckCircle size={14} color="var(--primary)" />
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.5, opacity: 0.85 }}>
                            {t('supportJourney')}
                        </p>
                    </div>

                    {tippingState === 'success' ? (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('tipSuccessful')}</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
                                {t('contributionDelivered')} <strong style={{ color: 'var(--text-main)' }}>{amount === 'custom' ? customAmount : amount} ETB</strong>
                            </p>
                            <button
                                onClick={() => { setTippingState('idle'); setAmount('50'); setTipperPhone(''); }}
                                className="btn-primary"
                                style={{ width: '100%', padding: '0.875rem', borderRadius: '1rem', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
                            >
                                {t('sendAnotherTip')}
                            </button>
                        </div>
                    ) : tippingState === 'pin_prompt' || tippingState === 'processing_pin' ? (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('checkYourPhone')}</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                {t('telebirrPromptNotice')} <strong style={{ color: 'var(--text-main)' }}>{tipperPhone}</strong>
                            </p>
                            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{t('awaitingConfirmation')}</span>
                            </div>
                            <button
                                onClick={() => setTippingState('idle')}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                {t('cancelAndGoBack')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleTip} className="animate-fade-in">
                            <div style={{ background: 'var(--bg-color)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>☕</span> Buy {creator.name.split(' ')[0]} a coffee
                                </h3>
                               
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    {['25', '50', '100'].map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => selectAmount(val)}
                                            style={{
                                                flex: 1,
                                                minWidth: '60px',
                                                padding: '0.75rem 0',
                                                borderRadius: '0.75rem',
                                                border: amount === val ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                background: amount === val ? 'var(--primary-light)' : 'white',
                                                color: amount === val ? 'var(--primary)' : 'var(--text-main)',
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'white',
                                    border: amount === 'custom' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                    borderRadius: '0.75rem',
                                    padding: '0.5rem 1rem',
                                    transition: 'all 0.2s ease',
                                    boxShadow: amount === 'custom' ? '0 0 0 3px var(--primary-light)' : 'none'
                                }}
                                onClick={() => { selectAmount('custom'); document.getElementById('customAmountInput')?.focus(); }}>
                                    <span style={{ fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem' }}>ETB</span>
                                    <input
                                        id="customAmountInput"
                                        type="number"
                                        min="1"
                                        placeholder="Custom amount"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        onFocus={() => selectAmount('custom')}
                                        required={amount === 'custom'}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            width: '100%',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            color: 'var(--text-main)',
                                            background: 'transparent'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{t('yourTelebirrNumber')}</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                                        <Smartphone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={tipperPhone}
                                        onChange={(e) => setTipperPhone(e.target.value)}
                                        placeholder="09... or 07..."
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 2.75rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--card-bg)',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.2s',
                                            outline: 'none'
                                        }}
                                        required
                                        pattern="^(09|07)\d{8}$"
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{t('shoutOutMessage')} (Optional)</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }}>
                                        <MessageSquare size={18} />
                                    </div>
                                    <textarea
                                        value={shoutOutMessage}
                                        onChange={(e) => setShoutOutMessage(e.target.value)}
                                        placeholder="Add a message..."
                                        rows="2"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 2.75rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--card-bg)',
                                            fontSize: '0.95rem',
                                            fontFamily: 'inherit',
                                            resize: 'none',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={tippingState === 'processing'}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    cursor: tippingState === 'processing' ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 14px rgba(10, 92, 54, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tippingState === 'processing' ? <span className="spinner" style={{ width: '20px', height: '20px' }}></span> : "Support " + (amount === 'custom' ? (customAmount || '0') : amount) + " ETB"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
`;

code = code.replace(/<div className="public-layout"[\s\S]*<\/div>\s*\)\s*;\s*}\s*$/m, newLayout + '\n    );\n}\n');
fs.writeFileSync('src/pages/PublicProfile.jsx', code);
