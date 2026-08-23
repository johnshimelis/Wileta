const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css += `
/* Enhanced Interactivity */
.nav-item {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--primary);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 4px 4px 0;
}

.nav-item:hover::before, .nav-item.active::before {
    transform: scaleY(1);
}

.nav-item:hover {
    background: rgba(16, 185, 129, 0.08) !important;
    transform: translateX(6px);
}

.nav-item.active {
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, transparent 100%) !important;
    font-weight: 800;
}

.nav-item svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover svg, .nav-item.active svg {
    transform: scale(1.15) rotate(-5deg);
    color: var(--primary) !important;
}

.premium-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    z-index: 1;
}

.premium-card:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 2px rgba(16, 185, 129, 0.2) inset !important;
    z-index: 10;
}

.premium-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0) inset;
    transition: box-shadow 0.4s ease;
    pointer-events: none;
}

.premium-card:hover::after {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.05) inset;
}

button, .btn-primary {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active, .btn-primary:active {
    transform: scale(0.95);
}

input:focus, select:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
    border-color: var(--primary) !important;
}
`;

fs.writeFileSync('src/index.css', css);
console.log("Enhanced CSS interactivity.");
