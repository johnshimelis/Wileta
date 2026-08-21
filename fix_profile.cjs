const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicProfile.jsx', 'utf8');

// Fix pattern
code = code.replace(/pattern="\^\(09\|07\)d\{8\}\$"/, 'pattern="0[79][0-9]{8}"');

// Add hover effects and better interactivity
// Amount buttons
code = code.replace(
    /border: amount === val \? '2px solid var\(--primary\)' : '1px solid var\(--border-color\)',/g,
    `border: amount === val ? '2px solid var(--primary)' : '2px solid transparent',
boxShadow: amount === val ? '0 4px 12px rgba(10, 92, 54, 0.15)' : '0 2px 5px rgba(0,0,0,0.05)',
transform: amount === val ? 'translateY(-2px)' : 'none',`
);

code = code.replace(
    /onFocus={\(e\) => e.target.style.borderColor = 'var\(--primary\)'}/g,
    `onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px var(--primary-light)'; }}`
);

code = code.replace(
    /onBlur={\(e\) => e.target.style.borderColor = 'var\(--border-color\)'}/g,
    `onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}`
);

code = code.replace(
    `boxShadow: '0 4px 14px rgba(10, 92, 54, 0.3)',
                                    transition: 'all 0.2s'`,
    `boxShadow: '0 4px 14px rgba(10, 92, 54, 0.3)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: 'translateY(0)'`
);

code = code.replace(
    `                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>`,
    `                                <style>{'.amount-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; } .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(10, 92, 54, 0.4) !important; }'}</style>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>`
);

// Add className to amount buttons
code = code.replace(/<button\s+key=\{val\}\s+type="button"\s+onClick=\{\(\) => selectAmount\(val\)\}/g, '<button className="amount-btn" key={val} type="button" onClick={() => selectAmount(val)}');

// Add className to submit button
code = code.replace(/<button\s+type="submit"\s+disabled=\{tippingState === 'processing'\}/g, '<button className="submit-btn" type="submit" disabled={tippingState === \'processing\'}');

fs.writeFileSync('src/pages/PublicProfile.jsx', code);
