import React from 'react';

// =========================================================================
// HIGH-FIDELITY 3D ETHIOPIAN CULTURAL GIFT ASSETS
// =========================================================================

export const Gift3DIcon = ({ id, size = 44, animated = true }) => {
    const s = size;

    switch (id) {
        case 'adey_abeba':
            // 🌼 Adey Abeba (10 ETB) - Ethiopian Yellow Flower
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 4px 10px rgba(245, 158, 11, 0.4))' }}>
                    <circle cx="50" cy="50" r="14" fill="url(#adeyCenter)" />
                    {/* 8 Golden Petals in 3D Array */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <g key={i} transform={`rotate(${angle} 50 50)`}>
                            <ellipse cx="50" cy="22" rx="11" ry="20" fill="url(#adeyPetal)" />
                            <path d="M50 8 C48 18 52 18 50 28" stroke="#D97706" strokeWidth="1.2" opacity="0.6" />
                        </g>
                    ))}
                    {/* Center Pollen Texture */}
                    <circle cx="50" cy="50" r="10" fill="#78350F" />
                    <circle cx="48" cy="48" r="4" fill="#F59E0B" opacity="0.7" />
                    <defs>
                        <linearGradient id="adeyPetal" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FDE047" />
                            <stop offset="50%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="#EAB308" />
                        </linearGradient>
                        <radialGradient id="adeyCenter" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#B45309" />
                            <stop offset="100%" stopColor="#78350F" />
                        </radialGradient>
                    </defs>
                </svg>
            );

        case 'rose':
            // 🌹 Highland Rose (25 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 4px 10px rgba(239, 68, 68, 0.4))' }}>
                    <path d="M50 78 C40 68 30 52 32 38 C34 26 48 24 50 34 C52 24 66 26 68 38 C70 52 60 68 50 78 Z" fill="url(#roseGrad)" />
                    <path d="M42 42 C45 36 55 36 58 42 C56 50 44 50 42 42 Z" fill="#991B1B" />
                    <circle cx="50" cy="42" r="6" fill="#F87171" opacity="0.8" />
                    {/* Green Leaves */}
                    <path d="M30 65 C20 60 18 50 26 48 C32 52 34 60 30 65 Z" fill="#15803D" />
                    <path d="M70 65 C80 60 82 50 74 48 C68 52 66 60 70 65 Z" fill="#16A34A" />
                    <defs>
                        <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="50%" stopColor="#DC2626" />
                            <stop offset="100%" stopColor="#991B1B" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case 'buna':
            // ☕ Buna Cup & Sini (50 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 4px 12px rgba(180, 83, 9, 0.45))' }}>
                    {/* Steam Rings */}
                    <path d="M42 22 C40 16 46 12 44 6" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                    <path d="M50 20 C48 14 54 10 52 4" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                    <path d="M58 22 C56 16 62 12 60 6" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                    {/* Ceramic Sini Cup */}
                    <path d="M26 34 L74 34 C72 62 60 72 50 72 C40 72 28 62 26 34 Z" fill="url(#siniBody)" stroke="#D97706" strokeWidth="1.5" />
                    {/* Hot Black Coffee Pool */}
                    <ellipse cx="50" cy="34" rx="24" ry="7" fill="url(#coffeePool)" />
                    {/* Sini Traditional Green & Red Trim */}
                    <path d="M30 48 Q50 56 70 48" stroke="#15803D" strokeWidth="2.5" fill="none" />
                    <path d="M34 56 Q50 64 66 56" stroke="#DC2626" strokeWidth="2" fill="none" />
                    {/* Sini Base Saucer */}
                    <ellipse cx="50" cy="74" rx="28" ry="6" fill="#F59E0B" />
                    <defs>
                        <linearGradient id="siniBody" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFBEB" />
                            <stop offset="100%" stopColor="#FEF3C7" />
                        </linearGradient>
                        <radialGradient id="coffeePool" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#78350F" />
                            <stop offset="100%" stopColor="#291102" />
                        </radialGradient>
                    </defs>
                </svg>
            );

        case 'mesob':
            // 🧺 Mesob (100 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(217, 119, 6, 0.45))' }}>
                    {/* Mesob Top Crown Finial */}
                    <circle cx="50" cy="14" r="5" fill="#DC2626" />
                    {/* Conical Lid with Colorful Harari Weaves */}
                    <path d="M50 16 L22 52 L78 52 Z" fill="url(#mesobLid)" />
                    <path d="M36 34 L64 34" stroke="#15803D" strokeWidth="3" />
                    <path d="M28 44 L72 44" stroke="#2563EB" strokeWidth="3" />
                    {/* Mesob Base Cylinder / Drum */}
                    <path d="M24 52 L30 82 L70 82 L76 52 Z" fill="url(#mesobBase)" />
                    <path d="M27 64 L73 64" stroke="#DC2626" strokeWidth="3" />
                    <path d="M29 74 L71 74" stroke="#D97706" strokeWidth="3" />
                    {/* Bottom Pedestal */}
                    <ellipse cx="50" cy="83" rx="22" ry="5" fill="#78350F" />
                    <defs>
                        <linearGradient id="mesobLid" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="50%" stopColor="#FDE047" />
                            <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="mesobBase" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D97706" />
                            <stop offset="50%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case 'bible':
            // 📖 Holy Bible / Metsehaf Qeddus (150 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 16px rgba(234, 179, 8, 0.55))' }}>
                    {/* Glowing Divine Halo Backing */}
                    <circle cx="50" cy="50" r="38" fill="url(#bibleHalo)" opacity="0.4" />
                    {/* Leather Book Cover */}
                    <rect x="24" y="20" width="52" height="64" rx="6" fill="url(#leatherBook)" stroke="#F59E0B" strokeWidth="2" />
                    {/* Gold Leaf Edges */}
                    <rect x="74" y="24" width="4" height="56" fill="#FDE047" />
                    {/* Ornate Ethiopian Cross on Cover */}
                    <path d="M50 30 L50 68" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M38 44 L62 44" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
                    <circle cx="50" cy="44" r="5" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.5" />
                    {/* Cross Finials */}
                    <circle cx="50" cy="30" r="2.5" fill="#FEF08A" />
                    <circle cx="50" cy="68" r="2.5" fill="#FEF08A" />
                    <circle cx="38" cy="44" r="2.5" fill="#FEF08A" />
                    <circle cx="62" cy="44" r="2.5" fill="#FEF08A" />
                    <defs>
                        <linearGradient id="leatherBook" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7F1D1D" />
                            <stop offset="100%" stopColor="#450A0A" />
                        </linearGradient>
                        <radialGradient id="bibleHalo" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                </svg>
            );

        case 'quran':
            // 📗 Holy Quran / Al-Quran (150 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 16px rgba(16, 185, 129, 0.55))' }}>
                    {/* Glowing Emerald Halo */}
                    <circle cx="50" cy="50" r="38" fill="url(#quranHalo)" opacity="0.4" />
                    {/* Emerald Leather Cover */}
                    <rect x="24" y="20" width="52" height="64" rx="6" fill="url(#quranLeather)" stroke="#F59E0B" strokeWidth="2" />
                    {/* Gold Leaf Edges */}
                    <rect x="74" y="24" width="4" height="56" fill="#FDE047" />
                    {/* Ornate Gold Filigree Border */}
                    <rect x="28" y="24" width="44" height="56" rx="4" fill="none" stroke="#FDE047" strokeWidth="1.2" strokeDasharray="3 2" />
                    {/* Center Gold Crescent & Star */}
                    <path d="M52 38 C44 40 44 54 52 56 C46 54 46 42 52 38 Z" fill="#FDE047" />
                    <polygon points="56,44 57.5,47.5 61,48 58.5,50.5 59,54 56,52 53,54 53.5,50.5 51,48 54.5,47.5" fill="#FDE047" transform="scale(0.8) translate(14, 8)" />
                    <defs>
                        <linearGradient id="quranLeather" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#065F46" />
                            <stop offset="100%" stopColor="#022C22" />
                        </linearGradient>
                        <radialGradient id="quranHalo" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                </svg>
            );

        case 'jebena':
            // 🫖 Clay Jebena (250 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(67, 20, 7, 0.5))' }}>
                    {/* Tall Neck & Gold Lip */}
                    <path d="M46 16 L54 16 L52 38 L48 38 Z" fill="#291102" stroke="#F59E0B" strokeWidth="1.2" />
                    {/* Spout */}
                    <path d="M52 30 Q70 24 74 18" stroke="#3D1A04" strokeWidth="4" strokeLinecap="round" />
                    {/* Large Spherical Clay Body */}
                    <circle cx="50" cy="58" r="24" fill="url(#jebenaGrad)" />
                    {/* Traditional Gold/Silver Wicker Neck Band */}
                    <rect x="46" y="32" width="8" height="4" fill="#F59E0B" />
                    {/* Handle */}
                    <path d="M30 46 C18 50 18 68 30 70" stroke="#3D1A04" strokeWidth="4" strokeLinecap="round" fill="none" />
                    {/* Matat Base Ring */}
                    <ellipse cx="50" cy="82" rx="16" ry="5" fill="#D97706" />
                    <defs>
                        <radialGradient id="jebenaGrad" cx="40%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#572608" />
                            <stop offset="50%" stopColor="#291102" />
                            <stop offset="100%" stopColor="#120601" />
                        </radialGradient>
                    </defs>
                </svg>
            );

        case 'anbessa':
            // 🦁 Lion of Judah (500 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 18px rgba(245, 158, 11, 0.6))' }}>
                    {/* Golden Mane Aura */}
                    <circle cx="50" cy="52" r="32" fill="url(#maneGold)" />
                    {/* Imperial Crown on Lion */}
                    <path d="M36 24 L42 34 L50 22 L58 34 L64 24 L62 38 L38 38 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
                    {/* Lion Face */}
                    <circle cx="50" cy="56" r="20" fill="#F59E0B" />
                    {/* Eyes & Snout */}
                    <ellipse cx="43" cy="52" rx="2.5" ry="3.5" fill="#18181B" />
                    <ellipse cx="57" cy="52" rx="2.5" ry="3.5" fill="#18181B" />
                    <polygon points="50,60 46,65 54,65" fill="#78350F" />
                    <path d="M46 65 Q50 70 54 65" stroke="#78350F" strokeWidth="2" />
                    <defs>
                        <radialGradient id="maneGold" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FDE047" />
                            <stop offset="70%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#92400E" />
                        </radialGradient>
                    </defs>
                </svg>
            );

        case 'crown':
            // 👑 Negus Gold Crown (1,000 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 18px rgba(234, 179, 8, 0.7))' }}>
                    <path d="M16 42 L30 74 L70 74 L84 42 L64 56 L50 30 L36 56 Z" fill="url(#crownGold)" stroke="#B45309" strokeWidth="2" />
                    <circle cx="50" cy="28" r="4" fill="#EF4444" />
                    <circle cx="16" cy="40" r="3.5" fill="#3B82F6" />
                    <circle cx="84" cy="40" r="3.5" fill="#10B981" />
                    {/* Base Gems */}
                    <rect x="28" y="70" width="44" height="6" rx="3" fill="#D97706" />
                    <circle cx="38" cy="73" r="2" fill="#EF4444" />
                    <circle cx="50" cy="73" r="2" fill="#3B82F6" />
                    <circle cx="62" cy="73" r="2" fill="#10B981" />
                    <defs>
                        <linearGradient id="crownGold" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FEF08A" />
                            <stop offset="50%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="#CA8A04" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case 'diamond':
            // 💎 Telebirr Diamond (2,500 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 20px rgba(6, 182, 212, 0.75))' }}>
                    <polygon points="20,38 35,18 65,18 80,38 50,84" fill="url(#diaGrad)" stroke="#67E8F9" strokeWidth="2" />
                    <polygon points="35,18 65,18 50,38" fill="#A5F3FC" opacity="0.8" />
                    <polygon points="20,38 35,18 50,38" fill="#38BDF8" opacity="0.7" />
                    <polygon points="80,38 65,18 50,38" fill="#0284C7" opacity="0.7" />
                    <polygon points="20,38 50,84 50,38" fill="#0EA5E9" opacity="0.9" />
                    <polygon points="80,38 50,84 50,38" fill="#0369A1" opacity="0.9" />
                    <defs>
                        <linearGradient id="diaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E0F2FE" />
                            <stop offset="100%" stopColor="#0369A1" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case 'car':
            // 🏎️ Addis Supercar (5,000 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 20px rgba(239, 68, 68, 0.7))' }}>
                    {/* Aerodynamic Chassis */}
                    <path d="M12 60 L24 46 L46 42 L66 44 L88 54 L92 64 L10 64 Z" fill="url(#carBody)" />
                    {/* Cockpit / Tinted Glass */}
                    <path d="M38 46 L48 44 L62 46 L58 52 L34 52 Z" fill="#09090B" stroke="#00C675" strokeWidth="1" />
                    {/* Wheels */}
                    <circle cx="28" cy="65" r="9" fill="#18181B" stroke="#00C675" strokeWidth="2" />
                    <circle cx="28" cy="65" r="4" fill="#E2E8F0" />
                    <circle cx="74" cy="65" r="9" fill="#18181B" stroke="#00C675" strokeWidth="2" />
                    <circle cx="74" cy="65" r="4" fill="#E2E8F0" />
                    {/* Neon Underglow */}
                    <ellipse cx="50" cy="74" rx="36" ry="3" fill="#00C675" opacity="0.6" />
                    <defs>
                        <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="50%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#B91C1C" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case 'lalibela':
            // ⛪ Exact Monolithic Rock-Hewn Church of Lalibela (Bet Giyorgis) (10,000 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 25px rgba(217, 119, 6, 0.8))' }}>
                    {/* Golden Sunbeam Background */}
                    <circle cx="50" cy="50" r="36" fill="url(#laliSun)" opacity="0.4" />
                    {/* Monolithic Volcanic Tuff Trench */}
                    <rect x="14" y="24" width="72" height="64" rx="4" fill="#451A03" opacity="0.7" />
                    {/* Greek Cross Roof Structure (Exact Bet Giyorgis Top View in Isometric 3D) */}
                    <path d="M40 22 L60 22 L60 38 L76 38 L76 58 L60 58 L60 74 L40 74 L40 58 L24 58 L24 38 L40 38 Z" fill="url(#laliStone)" stroke="#F59E0B" strokeWidth="2" />
                    {/* Nested Relief Cross Carvings */}
                    <path d="M45 28 L55 28 L55 42 L69 42 L69 52 L55 52 L55 66 L45 66 L45 52 L31 52 L31 42 L45 42 Z" fill="#78350F" stroke="#FEF08A" strokeWidth="1" />
                    {/* Cross Center Accent */}
                    <circle cx="50" cy="47" r="4" fill="#F59E0B" />
                    <defs>
                        <linearGradient id="laliStone" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D97706" />
                            <stop offset="50%" stopColor="#B45309" />
                            <stop offset="100%" stopColor="#78350F" />
                        </linearGradient>
                        <radialGradient id="laliSun" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FDE047" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                </svg>
            );

        case 'plane':
            // ✈️ Ethiopian Dreamliner Jet (25,000 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 20px rgba(59, 130, 246, 0.7))' }}>
                    {/* Fuselage */}
                    <path d="M50 12 C44 24 42 66 44 84 L56 84 C58 66 56 24 50 12 Z" fill="url(#planeBody)" stroke="#E2E8F0" strokeWidth="1" />
                    {/* Wings */}
                    <path d="M46 42 L8 64 L16 70 L46 56 Z" fill="#059669" />
                    <path d="M54 42 L92 64 L84 70 L54 56 Z" fill="#DC2626" />
                    {/* Tail Wings */}
                    <path d="M44 76 L26 86 L30 90 L46 84 Z" fill="#F59E0B" />
                    <path d="M56 76 L74 86 L70 90 L54 84 Z" fill="#F59E0B" />
                    {/* Ethiopian Flag Cockpit Stripe */}
                    <rect x="47" y="24" width="6" height="2" fill="#059669" />
                    <rect x="47" y="27" width="6" height="2" fill="#F59E0B" />
                    <rect x="47" y="30" width="6" height="2" fill="#DC2626" />
                    <defs>
                        <linearGradient id="planeBody" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F8FAFC" />
                            <stop offset="50%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#CBD5E1" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        case 'national_honor':
            // 🏆 Grand Ethiopian National Honor (100,000 ETB)
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 30px rgba(234, 179, 8, 0.9))' }}>
                    {/* Sunburst Rays */}
                    <circle cx="50" cy="50" r="38" fill="url(#honorRays)" opacity="0.6" />
                    {/* Grand Gold Medallion */}
                    <circle cx="50" cy="50" r="28" fill="url(#medallionGrad)" stroke="#FEF08A" strokeWidth="3" />
                    {/* Laurel Wreath */}
                    <path d="M28 50 C28 36 40 28 50 28 C60 28 72 36 72 50" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" fill="none" />
                    {/* Center Star & Crown */}
                    <polygon points="50,38 53,46 61,46 55,51 57,59 50,54 43,59 45,51 39,46 47,46" fill="#78350F" />
                    <circle cx="50" cy="50" r="6" fill="#FEF08A" />
                    <defs>
                        <radialGradient id="honorRays" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FEF08A" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <linearGradient id="medallionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FDE047" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                    </defs>
                </svg>
            );

        default:
            return <span style={{ fontSize: size * 0.7 }}>🎁</span>;
    }
};

// =========================================================================
// NATIVE WEB AUDIO API FANFARE SOUND ENGINE (Zero External Dependencies)
// =========================================================================

export const playGiftFanfareSound = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        // TikTok-style Ascending Melodic Fanfare Chime: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz), E6 (1318Hz)
        const notes = [
            { f: 523.25, d: 0.12, v: 0.25 },
            { f: 659.25, d: 0.12, v: 0.28 },
            { f: 783.99, d: 0.15, v: 0.32 },
            { f: 1046.50, d: 0.25, v: 0.4 },
            { f: 1318.51, d: 0.45, v: 0.45 }
        ];

        notes.forEach((n, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, now + idx * 0.08);

            gain.gain.setValueAtTime(0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(n.v, now + idx * 0.08 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + n.d);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + n.d + 0.05);
        });
    } catch (e) {
        // Silently fail if audio context is blocked
    }
};

// =========================================================================
// TIKTOK-STYLE LIVE CELEBRATION OVERLAY COMPONENT
// =========================================================================

export const TikTokCelebrationOverlay = ({
    gift,
    supporterName = 'Supporter',
    creatorName = 'Creator',
    amount = '100',
    comboCount = 1,
    onComboClick,
    onClose
}) => {
    if (!gift) return null;

    return (
        <div className="tiktok-celebration-backdrop" onClick={onClose}>
            <div className="tiktok-celebration-card" onClick={e => e.stopPropagation()}>
                {/* Background Rotating Halo */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '320px',
                    height: '320px',
                    margin: '-160px 0 0 -160px',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'tiktok-halo-rotate 8s linear infinite',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                {/* Expanding Shockwave Rings */}
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    width: '180px',
                    height: '180px',
                    margin: '-90px 0 0 -90px',
                    border: '2px solid rgba(245, 158, 11, 0.8)',
                    borderRadius: '50%',
                    animation: 'tiktok-shockwave 2s infinite ease-out',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    width: '240px',
                    height: '240px',
                    margin: '-120px 0 0 -120px',
                    border: '2px solid rgba(16, 185, 129, 0.6)',
                    borderRadius: '50%',
                    animation: 'tiktok-shockwave 2s infinite 0.7s ease-out',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(255, 255, 255, 0.12)',
                        border: 'none',
                        color: '#FFFFFF',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        zIndex: 2,
                        transition: 'all 0.2s ease'
                    }}
                >
                    &times;
                </button>

                {/* Top Sender & Recipient Live Banner */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.25rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0, 0, 0, 0.65)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
                    }}>
                        <span style={{ fontSize: '1rem' }}>🎉</span>
                        <span style={{ color: '#FDE047', fontWeight: 800, fontSize: '0.85rem' }}>
                            {supporterName}
                        </span>
                        <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>sent to</span>
                        <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.85rem' }}>
                            {creatorName}
                        </span>
                    </div>
                </div>

                {/* Large 3D Rotating & Floating Gift Object */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'tiktok-3d-continuous-spin 4s ease-in-out infinite'
                }}>
                    <Gift3DIcon id={gift.id} size={110} />
                </div>

                {/* Gift Name & Coin Amount */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.25rem' }}>
                    <h3 style={{
                        color: '#FFFFFF',
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        margin: '0 0 4px 0',
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                    }}>
                        {gift.nameAm} • {gift.nameEn}
                    </h3>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#FDE047',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '12px'
                    }}>
                        <span>🪙 {parseInt(amount || gift.etb).toLocaleString()} Coins</span>
                        <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                            ({parseInt(amount || gift.etb).toLocaleString()} ETB)
                        </span>
                    </div>
                </div>

                {/* Interactive TikTok Combo Counter Button */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onComboClick) onComboClick();
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 50%, #10B981 100%)',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '10px 24px',
                            color: '#FFFFFF',
                            fontWeight: 900,
                            fontSize: '1.15rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 0 25px rgba(245, 158, 11, 0.6), 0 4px 15px rgba(0, 0, 0, 0.4)',
                            animation: 'tiktok-combo-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transformOrigin: 'center'
                        }}
                    >
                        <span>🔥</span>
                        <span>x{comboCount} COMBO!</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '10px' }}>TAP +1</span>
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            color: '#D1D5DB',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Dismiss Celebration
                    </button>
                </div>
            </div>
        </div>
    );
};
