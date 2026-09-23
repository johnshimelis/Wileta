import React from 'react';

/**
 * Traditional Ethiopian Meskel (Cross) Geometric Motif SVG
 * Intricate interwoven geometry, radial glow, and ceremonial accents.
 */
export const MeskelPattern = ({ size = 120, color = "#F59E0B", className = "", style = {} }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
    >
        <defs>
            <filter id="meskelGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <radialGradient id="meskelAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#D97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
        </defs>

        {/* Outer Aura Halo */}
        <circle cx="100" cy="100" r="90" fill="url(#meskelAura)" />

        {/* Concentric Decorative Rings */}
        <circle cx="100" cy="100" r="76" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" />
        <circle cx="100" cy="100" r="82" stroke="#10B981" strokeWidth="1" strokeDasharray="2 8" opacity="0.5" />

        {/* Central Interlocking Cross Arms */}
        <g filter="url(#meskelGlow)">
            {/* Vertical Arm */}
            <path 
                d="M93 20 L107 20 L112 36 L124 36 L124 50 L110 50 L110 90 L130 90 L130 76 L144 76 L144 88 L160 93 L160 107 L144 112 L144 124 L130 124 L130 110 L110 110 L110 150 L124 150 L124 164 L112 164 L107 180 L93 180 L88 164 L76 164 L76 150 L90 150 L90 110 L70 110 L70 124 L56 124 L56 112 L40 107 L40 93 L56 88 L56 76 L70 76 L70 90 L90 90 L90 50 L76 50 L76 36 L88 36 Z" 
                fill="url(#goldGradient)"
                stroke="#FFFBEB"
                strokeWidth="1.5"
            />
            {/* Center Core Diamond */}
            <polygon points="100,75 125,100 100,125 75,100" fill="#064E3B" stroke="url(#goldGradient)" strokeWidth="2.5" />
            <polygon points="100,85 115,100 100,115 85,100" fill="url(#goldGradient)" />
            <circle cx="100" cy="100" r="4" fill="#FFFFFF" />

            {/* Corner Decorative Finials */}
            <circle cx="100" cy="20" r="4.5" fill="#FDE68A" />
            <circle cx="100" cy="180" r="4.5" fill="#FDE68A" />
            <circle cx="40" cy="100" r="4.5" fill="#FDE68A" />
            <circle cx="160" cy="100" r="4.5" fill="#FDE68A" />
            <circle cx="65" cy="65" r="3.5" fill="#10B981" />
            <circle cx="135" cy="65" r="3.5" fill="#10B981" />
            <circle cx="65" cy="135" r="3.5" fill="#10B981" />
            <circle cx="135" cy="135" r="3.5" fill="#10B981" />
        </g>
    </svg>
);

/**
 * Traditional Axum Obelisk (Stele of Axum) Vector Motif
 * Stylized monolithic granite stele with crescent apex and chevron false-windows.
 */
export const AxumObelisk = ({ width = 160, height = 480, className = "", style = {} }) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 200 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
    >
        <defs>
            <linearGradient id="obeliskBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(14, 165, 233, 0.25)" />
                <stop offset="35%" stopColor="rgba(56, 189, 248, 0.55)" />
                <stop offset="65%" stopColor="rgba(245, 158, 11, 0.45)" />
                <stop offset="100%" stopColor="rgba(14, 165, 233, 0.2)" />
            </linearGradient>
            <linearGradient id="obeliskGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.6" />
            </linearGradient>
            <filter id="neonBlueGlow" x="-30%" y="-10%" width="160%" height="120%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        <g filter="url(#neonBlueGlow)">
            {/* Monument Base Pedestal */}
            <path d="M40 580 L160 580 L150 540 L50 540 Z" fill="rgba(15, 23, 42, 0.9)" stroke="#38BDF8" strokeWidth="2.5" />
            <rect x="30" y="580" width="140" height="15" rx="3" fill="#0369A1" stroke="#F59E0B" strokeWidth="1.5" />

            {/* Stele Main Shaft (Tapering Monolith) */}
            <path 
                d="M50 540 L70 90 L85 45 L100 30 L115 45 L130 90 L150 540 Z" 
                fill="url(#obeliskBody)" 
                stroke="url(#obeliskGlow)" 
                strokeWidth="2.5" 
            />

            {/* Top Semi-Circular Apex (Crescent & Sun Disc Emblem of Ancient Aksum) */}
            <path d="M85 45 Q100 15 115 45 Z" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />
            <circle cx="100" cy="38" r="5" fill="#38BDF8" />
            <circle cx="100" cy="38" r="8" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 3" />

            {/* Multi-Story Stele False Windows & Floor Beam Ends ("Monkey Heads") */}
            {[120, 170, 220, 270, 320, 370, 420, 470].map((y, idx) => {
                const widthAtY = 70 + (y / 540) * 60;
                const leftX = 100 - widthAtY / 2 + 8;
                const windowWidth = widthAtY - 16;

                return (
                    <g key={y} opacity={0.85}>
                        {/* Floor Beam Divider */}
                        <line x1={leftX - 4} y1={y} x2={leftX + windowWidth + 4} y2={y} stroke="#38BDF8" strokeWidth="1.8" />
                        
                        {/* Aksumite Corner Projections ("Monkey Heads") */}
                        <circle cx={leftX - 1} cy={y} r="2.5" fill="#F59E0B" />
                        <circle cx={leftX + windowWidth + 1} cy={y} r="2.5" fill="#F59E0B" />

                        {/* Recessed Window Aperture */}
                        <rect 
                            x={leftX + 6} 
                            y={y + 6} 
                            width={windowWidth - 12} 
                            height="24" 
                            rx="3" 
                            fill="rgba(3, 105, 161, 0.4)" 
                            stroke="#F59E0B" 
                            strokeWidth="1.2" 
                        />
                        {/* Window Cross Mullion */}
                        <line x1={leftX + windowWidth / 2} y1={y + 6} x2={leftX + windowWidth / 2} y2={y + 30} stroke="#38BDF8" strokeWidth="1" />
                        <line x1={leftX + 6} y1={y + 18} x2={leftX + windowWidth - 6} y2={y + 18} stroke="#38BDF8" strokeWidth="1" />
                    </g>
                );
            })}

            {/* Stele Base Portal (Carved False Door at Bottom) */}
            <rect x="80" y="490" width="40" height="48" rx="2" fill="rgba(2, 132, 199, 0.35)" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="94" cy="514" r="2.5" fill="#FDE68A" />
            <circle cx="106" cy="514" r="2.5" fill="#FDE68A" />
        </g>
    </svg>
);

/**
 * Fasil Ghebbi (Royal Gonderian Castle) Architectural Silhouette
 * High-tier imperial majesty: battlements, domed towers, and arched portals.
 */
export const GonderCastleMotif = ({ width = 800, height = 360, className = "", style = {} }) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 1000 450" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
    >
        <defs>
            <linearGradient id="castleWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.35)" />
                <stop offset="60%" stopColor="rgba(15, 23, 42, 0.95)" />
                <stop offset="100%" stopColor="rgba(6, 78, 59, 0.98)" />
            </linearGradient>
            <linearGradient id="castleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <filter id="royalGoldGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        <g filter="url(#royalGoldGlow)">
            {/* Ground Bastion Foundation */}
            <rect x="60" y="400" width="880" height="40" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="url(#castleGlow)" strokeWidth="2.5" />

            {/* Central Royal Keep (Emperor Fasilides Palace) */}
            <rect x="330" y="160" width="340" height="240" fill="url(#castleWallGrad)" stroke="url(#castleGlow)" strokeWidth="3" />
            
            {/* Central Keep Crenellations (Battlements) */}
            {[340, 380, 420, 460, 500, 540, 580, 620].map((x) => (
                <rect key={x} x={x} y="138" width="26" height="24" rx="2" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.5" />
            ))}

            {/* Central Grand Imperial Dome */}
            <path d="M430 140 Q500 50 570 140 Z" fill="rgba(245, 158, 11, 0.45)" stroke="#F59E0B" strokeWidth="2.5" />
            {/* Imperial Ethiopian Cross / Finial on Central Dome */}
            <line x1="500" y1="40" x2="500" y2="70" stroke="#FDE68A" strokeWidth="3" />
            <line x1="490" y1="52" x2="510" y2="52" stroke="#FDE68A" strokeWidth="2.5" />
            <circle cx="500" cy="38" r="4.5" fill="#FDE68A" />

            {/* Left Circular Flanking Tower */}
            <rect x="180" y="210" width="160" height="190" rx="4" fill="url(#castleWallGrad)" stroke="url(#castleGlow)" strokeWidth="2.5" />
            {/* Left Tower Crenellations */}
            {[188, 224, 260, 296].map(x => (
                <rect key={x} x={x} y="192" width="22" height="20" rx="2" fill="#10B981" stroke="#34D399" strokeWidth="1.2" />
            ))}
            {/* Left Tower Egg-Shaped Dome (Distinctive Gonderian Domed Turret) */}
            <path d="M210 194 Q260 120 310 194 Z" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="2" />
            <circle cx="260" cy="116" r="4" fill="#F59E0B" />

            {/* Right Circular Flanking Tower */}
            <rect x="660" y="210" width="160" height="190" rx="4" fill="url(#castleWallGrad)" stroke="url(#castleGlow)" strokeWidth="2.5" />
            {/* Right Tower Crenellations */}
            {[668, 704, 740, 776].map(x => (
                <rect key={x} x={x} y="192" width="22" height="20" rx="2" fill="#10B981" stroke="#34D399" strokeWidth="1.2" />
            ))}
            {/* Right Tower Dome */}
            <path d="M690 194 Q740 120 790 194 Z" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="2" />
            <circle cx="740" cy="116" r="4" fill="#F59E0B" />

            {/* Far Left Rampart Tower */}
            <rect x="80" y="260" width="110" height="140" fill="url(#castleWallGrad)" stroke="#F59E0B" strokeWidth="2" />
            {[86, 114, 142, 170].map(x => (
                <rect key={x} x={x} y="244" width="18" height="18" fill="#F59E0B" />
            ))}

            {/* Far Right Rampart Tower */}
            <rect x="810" y="260" width="110" height="140" fill="url(#castleWallGrad)" stroke="#F59E0B" strokeWidth="2" />
            {[816, 844, 872, 900].map(x => (
                <rect key={x} x={x} y="244" width="18" height="18" fill="#F59E0B" />
            ))}

            {/* Grand Arched Gateways (Traditional Gonder Brown Sandstone Keystones) */}
            <path d="M450 400 L450 310 Q500 270 550 310 L550 400 Z" fill="rgba(0, 0, 0, 0.75)" stroke="url(#castleGlow)" strokeWidth="3" />
            <path d="M465 400 L465 325 Q500 295 535 325 L535 400 Z" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 4" />

            {/* Upper Palace Balcony Arches */}
            {[380, 440, 500, 560].map(x => (
                <g key={x}>
                    <path d={`M${x} 235 L${x} 190 Q${x+20} 175 ${x+40} 190 L${x+40} 235 Z`} fill="rgba(16, 185, 129, 0.25)" stroke="#F59E0B" strokeWidth="1.8" />
                    <line x1={x} y1="235" x2={x+40} y2="235" stroke="#FDE68A" strokeWidth="2" />
                </g>
            ))}

            {/* Flanking Tower Arch Windows */}
            <path d="M240 290 L240 250 Q260 235 280 250 L280 290 Z" fill="rgba(245, 158, 11, 0.2)" stroke="#34D399" strokeWidth="1.5" />
            <path d="M720 290 L720 250 Q740 235 760 250 L760 290 Z" fill="rgba(245, 158, 11, 0.2)" stroke="#34D399" strokeWidth="1.5" />
        </g>
    </svg>
);

/**
 * Traditional Ethiopian Tibeb Border Trim (Geometric diamond ribbon)
 */
export const TibebBorder = ({ width = "100%", height = 18, color = "#10B981" }) => (
    <svg width={width} height={height} viewBox="0 0 600 18" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="tibebPattern" width="30" height="18" patternUnits="userSpaceOnUse">
            <polygon points="15,2 28,9 15,16 2,9" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            <polygon points="15,5 22,9 15,13 8,9" fill={color} opacity="0.8" />
            <circle cx="15" cy="9" r="1.5" fill="#FFFFFF" />
        </pattern>
        <rect width="600" height="18" fill="url(#tibebPattern)" />
    </svg>
);
