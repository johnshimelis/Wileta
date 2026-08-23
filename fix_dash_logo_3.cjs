const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const target = `                                      ))}
                                      <button`;

const replaceWith = `                                              <div style={{ marginTop: '0.75rem' }}>
                                                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.05)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px dashed var(--primary)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                                                          <Upload size={16} />
                                                          {account.logoUrl ? 'Change Bank Logo' : 'Upload Bank Logo (Optional)'}
                                                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
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
                                                          }} />
                                                      </label>
                                                      {account.logoUrl && (
                                                          <div style={{ marginTop: '0.5rem', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                                                              <img src={account.logoUrl} alt="Bank Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
                                                          </div>
                                                      )}
                                                  </div>
                                          </div>
                                      ))}
                                      <button`;

if(code.includes(target)) {
    code = code.replace(target, replaceWith);
    fs.writeFileSync('src/pages/Dashboard.jsx', code);
    console.log("Replaced Dashboard bank input with logo uploader");
} else {
    console.log("Still could not find the target string.");
}
