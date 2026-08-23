const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldModalBankRender = `<div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getBankColor(bank.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                                        {getBankInitials(bank.bankName)}
                                    </div>`;

const newModalBankRender = `{bank.logoUrl ? (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}>
                                            <img src={bank.logoUrl} alt={bank.bankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                    ) : (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getBankColor(bank.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                                            {getBankInitials(bank.bankName)}
                                        </div>
                                    )}`;

code = code.replace(oldModalBankRender, newModalBankRender);

fs.writeFileSync('src/pages/Dashboard.jsx', code);
console.log("Updated WithdrawModal to show bank logos.");
