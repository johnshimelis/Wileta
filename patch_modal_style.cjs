const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldModalStyle = `<div className="drawer" style={{ 
                  width: '100%', 
                  maxWidth: '480px', 
                  height: '100%', 
                  background: 'var(--bg-color)', 
                  boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  animation: 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
              }} onClick={e => e.stopPropagation()}>`;

const newModalStyle = `<div className="drawer" style={{ 
                  width: '100%', 
                  maxWidth: '520px', 
                  height: '100dvh', 
                  maxHeight: '100dvh',
                  background: 'var(--bg-color)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  animation: 'slide-in-bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  margin: '0 auto',
                  position: 'relative'
              }} onClick={e => e.stopPropagation()}>`;

const oldModalOverlay = `<div
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(5px)', animation: 'fade-in 0.3s ease-out' }}
              onClick={onClose}
          >`;

const newModalOverlay = `<div
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)', animation: 'fade-in 0.3s ease-out' }}
              onClick={onClose}
          >
          <style>{\`
            @keyframes slide-in-bottom { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @media (min-width: 600px) {
                .drawer { height: 90vh !important; max-height: 800px !important; border-radius: 24px; overflow: hidden; animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important; }
            }
            @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          \`}</style>`;

code = code.replace(oldModalStyle, newModalStyle);
code = code.replace(oldModalOverlay, newModalOverlay);

fs.writeFileSync('src/pages/Dashboard.jsx', code);
console.log("Updated Modal Styles.");
