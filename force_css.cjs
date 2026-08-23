const fs = require('fs');
const files = ['src/pages/Dashboard.jsx', 'src/pages/Profile.jsx', 'src/pages/Settings.jsx', 'src/index.css'];

const premiumCardCSS = `
.premium-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.premium-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}
[data-theme="dark"] .premium-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
`;

for (let f of files) {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/dashboard-card/g, 'premium-card');
        
        if (f === 'src/index.css' && !content.includes('.premium-card')) {
            content += premiumCardCSS;
        }
        
        fs.writeFileSync(f, content);
    }
}
console.log("Renamed dashboard-card to premium-card.");
