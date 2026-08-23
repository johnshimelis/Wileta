const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const targetStr = `                                                      />
                                                  </div>
                                              </div>
                                          </div>`;

const replaceStr = `                                                      />
                                                  </div>
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '0.75rem', border: '1px dashed var(--border-color)' }}>
                                                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-color)', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                          {account.logoUrl ? (
                                                              <img src={account.logoUrl} alt="Bank Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                          ) : (
                                                              <Upload size={20} color="var(--text-muted)" />
                                                          )}
                                                      </div>
                                                      <div style={{ flex: 1 }}>
                                                          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Bank Logo (Optional)</p>
                                                          <label style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                              <Upload size={14} /> Upload Custom Logo
                                                              <input 
                                                                  type="file" 
                                                                  accept="image/*" 
                                                                  style={{ display: 'none' }}
                                                                  onChange={(e) => {
                                                                      const file = e.target.files[0];
                                                                      if (file) {
                                                                          const reader = new FileReader();
                                                                          reader.onloadend = () => {
                                                                              const newAccounts = [...bankAccounts];
                                                                              newAccounts[index].logoUrl = reader.result;
                                                                              setBankAccounts(newAccounts);
                                                                          };
                                                                          reader.readAsDataURL(file);
                                                                      }
                                                                  }}
                                                              />
                                                          </label>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>`;

// Check if we need to replace it:
if (code.includes(targetStr) && !code.includes('Bank Logo (Optional)')) {
    code = code.split(targetStr).join(replaceStr);
    
    // Also update the empty account template
    const emptyAccountStr = `{ bankName: '', accountNumber: '', accountHolderName: '' }`;
    const emptyAccountReplace = `{ bankName: '', accountNumber: '', accountHolderName: '', logoUrl: '' }`;
    code = code.split(emptyAccountStr).join(emptyAccountReplace);

    fs.writeFileSync('src/pages/Dashboard.jsx', code);
    console.log("SUCCESS");
} else {
    console.log("FAILED to find target string or already modified.");
}
