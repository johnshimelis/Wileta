const fs = require('fs');

let code = fs.readFileSync('src/pages/Signup.jsx', 'utf8');

// Replace the outer motion.div 
const oldContainer = `<motion.div 
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="auth-container"
        >`;

const newContainer = `<motion.div 
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="auth-split-container"
        >
            <div className="auth-split-left">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <Logo size="medium" />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
                <div className="auth-split-form-wrapper">
                    <div className="auth-split-card">`;

code = code.replace(oldContainer, newContainer);

code = code.replace(/\{\/\* Top Right Actions \*\/\}[\s\S]*?<div className="auth-card"[^>]*>[\s\S]*?\{\/\* Logo \*\/\}[\s\S]*?<\/div>/, '<div className="auth-card-inner">');

const oldClose = `        </motion.div>
    );
}`;

const newClose = `                    </div>
                </div>
            </div>
            <div className="auth-split-right">
                <div className="auth-split-pattern"></div>
                <div className="auth-split-content">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>Join Wileta Today</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', lineHeight: 1.6 }}>Start receiving tips and support from your audience directly to your Ethiopian bank account.</p>
                    
                    <div className="auth-feature">
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Mail size={24} color="#10B981" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>No Hidden Fees</h4>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Transparent pricing so you keep more of what you earn.</p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Phone size={24} color="#3B82F6" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Lightning Fast Setup</h4>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Create your profile and start accepting tips in minutes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}`;

code = code.replace(oldClose, newClose);

fs.writeFileSync('src/pages/Signup.jsx', code);
