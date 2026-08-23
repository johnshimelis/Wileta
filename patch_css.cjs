const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const splitAuthCss = `
/* Modern Split Screen Auth Layout */
.auth-split-container {
  min-height: 100vh;
  display: flex;
  background: var(--bg-color);
  position: relative;
  overflow: hidden;
}

.auth-split-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  padding: 2rem;
}

.auth-split-form-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.auth-split-card {
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
  background: var(--card-bg);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.auth-split-right {
  flex: 1.2;
  background: linear-gradient(135deg, #0A5C36 0%, #064E3B 100%);
  position: relative;
  display: none; /* hidden on mobile */
  align-items: center;
  justify-content: center;
  color: white;
  padding: 4rem;
  overflow: hidden;
}

@media (min-width: 900px) {
  .auth-split-right {
    display: flex;
  }
  .auth-split-card {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
}

.auth-split-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0);
  background-size: 32px 32px;
}

.auth-split-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
}

.auth-feature {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
}
`;

css += splitAuthCss;
fs.writeFileSync('src/index.css', css);

