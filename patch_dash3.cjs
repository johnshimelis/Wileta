const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// The exact block for the bank logo initials for mapped accounts:
const mappedLogoInitials = `
                                                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                                          {getBankInitials(account.bankName)}
                                                      </div>`;

const newMappedLogoInitials = `
                                                      <label style={{ cursor: 'pointer', position: 'relative' }}>
                                                          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => { if(e.target.files[0]) handleLogoUpload(e.target.files[0], index); }} />
                                                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundImage: account.logoUrl ? \`url(\${account.logoUrl})\` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                                              {!account.logoUrl && getBankInitials(account.bankName)}
                                                          </div>
                                                          <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'white', borderRadius: '50%', padding: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                          </div>
                                                      </label>`;

code = code.replace(mappedLogoInitials, newMappedLogoInitials);

// Remove the "Bank Logo (Optional)" block completely from the mapped accounts
// We'll use a regex that safely matches that entire flex container
code = code.replace(/<div style=\{\{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba\(0,0,0,0\.02\)', borderRadius: '0\.75rem', border: '1px dashed var\(--border-color\)' \}\}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');

fs.writeFileSync('src/pages/Dashboard.jsx', code);
