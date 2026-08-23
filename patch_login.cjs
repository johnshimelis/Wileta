const fs = require('fs');

let code = fs.readFileSync('src/pages/Login.jsx', 'utf8');

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

// Remove the old Top Right Actions and Logo since we moved them to the header of the left pane
code = code.replace(/\{\/\* Top Right Actions \*\/\}[\s\S]*?<div className="auth-card"[^>]*>[\s\S]*?\{\/\* Logo \*\/\}[\s\S]*?<\/div>/, '<div className="auth-card-inner">');

// Add the closing tags and the right pane
const oldClose = `        </motion.div>
    );
}`;

const newClose = `                    </div>
                </div>
            </div>
            <div className="auth-split-right">
                <div className="auth-split-pattern"></div>
                <div className="auth-split-content">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>Receive Tips & Support from Ethiopia and Beyond</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', lineHeight: 1.6 }}>Wileta makes it incredibly simple for creators, developers, and professionals to get paid directly to their local Ethiopian bank accounts.</p>
                    
                    <div className="auth-feature">
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Mail size={24} color="#10B981" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Instant Notifications</h4>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Get alerts via SMS and Email the moment you receive a tip.</p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Phone size={24} color="#3B82F6" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Telebirr Integration</h4>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Seamless direct charge payments right from users' phones.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}`;

code = code.replace(oldClose, newClose);

fs.writeFileSync('src/pages/Login.jsx', code);
