import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. HIGH-DEFINITION REALISTIC 3D ETHIOPIAN CULTURAL GIFT ASSETS
// =========================================================================

export const Gift3DIcon = ({ id, size = 48, animated = true }) => {
    const s = size;

    switch (id) {
        case 'adey_abeba':
            // 🌼 Adey Flower (10 ETB / 100 Coins) - Ethiopian Highland Sunshine Bloom
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(245, 158, 11, 0.6))' }}>
                    <defs>
                        <linearGradient id="adeyP1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFF59D" />
                            <stop offset="40%" stopColor="#FDD835" />
                            <stop offset="100%" stopColor="#F57F17" />
                        </linearGradient>
                        <radialGradient id="adeyCore" cx="45%" cy="45%" r="55%">
                            <stop offset="0%" stopColor="#8D6E63" />
                            <stop offset="60%" stopColor="#4E342E" />
                            <stop offset="100%" stopColor="#27150C" />
                        </radialGradient>
                        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4CAF50" />
                            <stop offset="100%" stopColor="#1B5E20" />
                        </linearGradient>
                    </defs>
                    <path d="M50 72 Q48 88 44 96" stroke="#2E7D32" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M48 80 Q32 76 28 68 Q40 68 48 76" fill="url(#leafGrad)" />
                    <path d="M50 84 Q66 80 72 72 Q60 72 50 80" fill="url(#leafGrad)" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                        <g key={i} transform={`rotate(${deg} 50 48)`}>
                            <path d="M50 48 C44 32 42 16 50 8 C58 16 56 32 50 48 Z" fill="url(#adeyP1)" stroke="#E65100" strokeWidth="0.6" />
                            <path d="M50 12 L50 40" stroke="#F57F17" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                        </g>
                    ))}
                    <circle cx="50" cy="48" r="13" fill="url(#adeyCore)" stroke="#FFA000" strokeWidth="1.5" />
                    <circle cx="47" cy="45" r="4.5" fill="#FFE082" opacity="0.6" />
                </svg>
            );

        case 'rose':
            // 🌹 Highland Rose (25 ETB / 250 Coins) - Deep Velvet Red Rose
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(220, 38, 38, 0.6))' }}>
                    <defs>
                        <radialGradient id="roseCore" cx="40%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#FF8A80" />
                            <stop offset="40%" stopColor="#D50000" />
                            <stop offset="100%" stopColor="#4A0000" />
                        </radialGradient>
                    </defs>
                    <path d="M50 70 L50 94" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 78 Q30 74 24 64 Q38 64 50 74" fill="#388E3C" />
                    <path d="M50 84 Q70 80 76 70 Q62 70 50 80" fill="#2E7D32" />
                    <path d="M50 18 C30 18 20 36 24 54 C28 72 48 76 50 76 C52 76 72 72 76 54 C80 36 70 18 50 18 Z" fill="url(#roseCore)" />
                    <path d="M34 42 C36 30 52 26 62 34 C68 40 68 54 58 60 C46 64 36 54 34 42 Z" fill="#B71C1C" />
                    <path d="M42 40 C44 34 54 32 58 38 C60 44 54 50 48 48 C44 46 42 44 42 40 Z" fill="#FF5252" />
                </svg>
            );

        case 'buna':
            // ☕ Sini Buna Cup (50 ETB / 500 Coins) - Authentic Traditional Ceramic Sini
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 6px 16px rgba(180, 83, 9, 0.6))' }}>
                    <defs>
                        <linearGradient id="siniPorcelain" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="70%" stopColor="#FFF8E1" />
                            <stop offset="100%" stopColor="#FFE082" />
                        </linearGradient>
                        <radialGradient id="bunaCrema" cx="45%" cy="45%" r="55%">
                            <stop offset="0%" stopColor="#5D4037" />
                            <stop offset="50%" stopColor="#3E2723" />
                            <stop offset="100%" stopColor="#1A0C08" />
                        </radialGradient>
                    </defs>
                    <path d="M40 20 Q36 12 42 6" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                    <path d="M50 18 Q54 10 48 4" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
                    <path d="M60 20 Q64 12 58 6" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                    <ellipse cx="50" cy="80" rx="34" ry="8" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                    <path d="M22 34 L78 34 C74 66 62 76 50 76 C38 76 26 66 22 34 Z" fill="url(#siniPorcelain)" stroke="#D97706" strokeWidth="2" />
                    <ellipse cx="50" cy="34" rx="27" ry="8" fill="url(#bunaCrema)" stroke="#D97706" strokeWidth="1.5" />
                    <path d="M28 46 Q50 56 72 46" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M31 54 Q50 64 69 54" stroke="#EAB308" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M35 62 Q50 70 65 62" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
            );

        case 'mesob':
            // 🧺 Mesob Basket (100 ETB / 1,000 Coins) - Woven Harari Handcrafted Mesob
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 18px rgba(217, 119, 6, 0.6))' }}>
                    <defs>
                        <linearGradient id="mesobCone" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D97706" />
                            <stop offset="50%" stopColor="#FEF08A" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="12" r="6" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
                    <path d="M50 14 L18 52 L82 52 Z" fill="url(#mesobCone)" stroke="#78350F" strokeWidth="1.5" />
                    <path d="M36 30 L64 30" stroke="#16A34A" strokeWidth="3.5" />
                    <path d="M28 40 L72 40" stroke="#2563EB" strokeWidth="3.5" />
                    <path d="M20 50 L80 50" stroke="#DC2626" strokeWidth="3.5" />
                    <path d="M22 52 L28 84 L72 84 L78 52 Z" fill="url(#mesobCone)" stroke="#78350F" strokeWidth="1.5" />
                    <path d="M25 64 L75 64" stroke="#DC2626" strokeWidth="3.5" />
                    <path d="M27 74 L73 74" stroke="#16A34A" strokeWidth="3.5" />
                    <ellipse cx="50" cy="85" rx="24" ry="6" fill="#78350F" />
                </svg>
            );

        case 'bible':
            // 📖 Holy Bible (150 ETB / 1,500 Coins) - Gilded Leatherbound Ethiopian Orthodox Bible
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 22px rgba(234, 179, 8, 0.7))' }}>
                    <defs>
                        <linearGradient id="bibleLeather" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#831843" />
                            <stop offset="60%" stopColor="#4A044E" />
                            <stop offset="100%" stopColor="#1E1B4B" />
                        </linearGradient>
                        <radialGradient id="bibleHalo" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="42" fill="url(#bibleHalo)" opacity="0.45" />
                    <rect x="22" y="16" width="56" height="68" rx="6" fill="url(#bibleLeather)" stroke="#F59E0B" strokeWidth="2.5" />
                    <rect x="76" y="20" width="5" height="60" fill="#FDE047" rx="1" />
                    <path d="M50 26 L50 72" stroke="#FDE047" strokeWidth="5" strokeLinecap="round" />
                    <path d="M36 42 L64 42" stroke="#FDE047" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="50" cy="42" r="6" fill="#F59E0B" stroke="#FEF08A" strokeWidth="2" />
                    <circle cx="50" cy="26" r="3" fill="#FEF08A" />
                    <circle cx="50" cy="72" r="3" fill="#FEF08A" />
                    <circle cx="36" cy="42" r="3" fill="#FEF08A" />
                    <circle cx="64" cy="42" r="3" fill="#FEF08A" />
                </svg>
            );

        case 'quran':
            // 📗 Holy Quran (150 ETB / 1,500 Coins) - Gilded Emerald Holy Quran
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 22px rgba(16, 185, 129, 0.7))' }}>
                    <defs>
                        <linearGradient id="quranCover" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#065F46" />
                            <stop offset="60%" stopColor="#047857" />
                            <stop offset="100%" stopColor="#022C22" />
                        </linearGradient>
                        <radialGradient id="quranHalo" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="42" fill="url(#quranHalo)" opacity="0.45" />
                    <rect x="22" y="16" width="56" height="68" rx="6" fill="url(#quranCover)" stroke="#F59E0B" strokeWidth="2.5" />
                    <rect x="76" y="20" width="5" height="60" fill="#FDE047" rx="1" />
                    <rect x="28" y="22" width="44" height="56" rx="4" fill="none" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M53 38 C44 40 44 56 53 58 C46 56 46 42 53 38 Z" fill="#FDE047" />
                    <polygon points="56,44 57.5,47.5 61,48 58.5,50.5 59,54 56,52 53,54 53.5,50.5 51,48 54.5,47.5" fill="#FDE047" transform="scale(0.85) translate(11, 6)" />
                </svg>
            );

        case 'jebena':
            // 🫖 Clay Jebena (250 ETB / 2,500 Coins) - Traditional Smoked Clay Jebena
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 18px rgba(67, 20, 7, 0.7))' }}>
                    <defs>
                        <radialGradient id="jebenaBody" cx="40%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#6B3410" />
                            <stop offset="50%" stopColor="#2E1204" />
                            <stop offset="100%" stopColor="#100501" />
                        </radialGradient>
                    </defs>
                    <path d="M46 14 L54 14 L52 38 L48 38 Z" fill="#2E1204" stroke="#F59E0B" strokeWidth="1.5" />
                    <path d="M52 30 Q74 22 78 16" stroke="#3D1A04" strokeWidth="4.5" strokeLinecap="round" />
                    <circle cx="50" cy="60" r="26" fill="url(#jebenaBody)" />
                    <rect x="46" y="32" width="8" height="5" fill="#F59E0B" rx="1" />
                    <path d="M28 46 C16 52 16 72 28 74" stroke="#3D1A04" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                    <ellipse cx="50" cy="85" rx="18" ry="6" fill="#D97706" stroke="#92400E" strokeWidth="1" />
                </svg>
            );

        case 'enjera':
            // 🍲 Gursha Feast (350 ETB / 3,500 Coins) - Colorful Beyaynetu Platter
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 18px rgba(220, 38, 38, 0.6))' }}>
                    <circle cx="50" cy="50" r="42" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="37" fill="#D7CCC8" stroke="#BCAAA4" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="12" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="4" fill="#FEF08A" />
                    <circle cx="34" cy="38" r="9" fill="#16A34A" />
                    <circle cx="66" cy="38" r="9" fill="#EAB308" />
                    <circle cx="34" cy="62" r="9" fill="#EA580C" />
                    <circle cx="66" cy="62" r="9" fill="#9333EA" />
                    <rect x="18" y="46" width="10" height="6" rx="3" fill="#EFEBE9" stroke="#BCAAA4" />
                    <rect x="72" y="46" width="10" height="6" rx="3" fill="#EFEBE9" stroke="#BCAAA4" />
                </svg>
            );

        case 'kemis':
            // 👗 Habesha Kemis (500 ETB / 5,000 Coins) - Woven Dress with Gold Tibeb
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 20px rgba(245, 158, 11, 0.6))' }}>
                    <defs>
                        <linearGradient id="kemisFabric" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#F1F5F9" />
                        </linearGradient>
                    </defs>
                    <path d="M38 18 L62 18 L68 40 L84 84 L16 84 L32 40 Z" fill="url(#kemisFabric)" stroke="#CBD5E1" strokeWidth="1.5" />
                    <path d="M36 32 L64 32" stroke="#F59E0B" strokeWidth="4" />
                    <path d="M38 36 L62 36" stroke="#DC2626" strokeWidth="2" />
                    <rect x="18" y="74" width="64" height="6" fill="#F59E0B" />
                    <rect x="18" y="80" width="64" height="3" fill="#16A34A" />
                    <rect x="18" y="71" width="64" height="3" fill="#DC2626" />
                    <rect x="36" y="44" width="28" height="4" fill="#D97706" rx="2" />
                </svg>
            );

        case 'anbessa':
            // 🦁 Lion of Judah (1,000 ETB / 10,000 Coins) - Majestic Photorealistic 3D Golden Lion
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 24px rgba(245, 158, 11, 0.8))' }}>
                    <defs>
                        <radialGradient id="lionMane" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FDE047" />
                            <stop offset="60%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#78350F" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="52" r="34" fill="url(#lionMane)" />
                    <path d="M34 22 L42 34 L50 18 L58 34 L66 22 L64 38 L36 38 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="2" />
                    <circle cx="50" cy="17" r="2.5" fill="#EF4444" />
                    <circle cx="34" cy="21" r="2" fill="#3B82F6" />
                    <circle cx="66" cy="21" r="2" fill="#10B981" />
                    <circle cx="50" cy="56" r="21" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                    <ellipse cx="42" cy="50" rx="3" ry="4" fill="#FEF08A" stroke="#18181B" strokeWidth="1.2" />
                    <circle cx="42" cy="50" r="1.8" fill="#18181B" />
                    <ellipse cx="58" cy="50" rx="3" ry="4" fill="#FEF08A" stroke="#18181B" strokeWidth="1.2" />
                    <circle cx="58" cy="50" r="1.8" fill="#18181B" />
                    <polygon points="50,59 45,64 55,64" fill="#78350F" />
                    <path d="M45 64 Q50 72 55 64" stroke="#78350F" strokeWidth="2.5" fill="#18181B" />
                    <path d="M38 60 L24 58 M38 63 L24 65 M62 60 L76 58 M62 63 L76 65" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            );

        case 'crown':
            // 👑 Negus Gold Crown (2,500 ETB / 25,000 Coins) - Imperial 24K Emperor Crown
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 24px rgba(234, 179, 8, 0.85))' }}>
                    <defs>
                        <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FEF08A" />
                            <stop offset="50%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="#CA8A04" />
                        </linearGradient>
                    </defs>
                    <path d="M26 68 C26 38 74 38 74 68 Z" fill="#831843" />
                    <path d="M14 42 L28 72 L72 72 L86 42 L66 56 L50 26 L34 56 Z" fill="url(#goldCrownGrad)" stroke="#B45309" strokeWidth="2.5" />
                    <circle cx="50" cy="24" r="5" fill="#EF4444" stroke="#FEF08A" strokeWidth="1.5" />
                    <circle cx="14" cy="40" r="4.5" fill="#3B82F6" stroke="#FEF08A" strokeWidth="1.5" />
                    <circle cx="86" cy="40" r="4.5" fill="#10B981" stroke="#FEF08A" strokeWidth="1.5" />
                    <rect x="24" y="68" width="52" height="8" rx="4" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                    <circle cx="34" cy="72" r="2.5" fill="#EF4444" />
                    <circle cx="50" cy="72" r="2.5" fill="#3B82F6" />
                    <circle cx="66" cy="72" r="2.5" fill="#10B981" />
                </svg>
            );

        case 'diamond':
            // 💎 Telebirr Diamond (5,000 ETB / 50,000 Coins) - Brilliant Cut 3D Cyan Gem
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 26px rgba(6, 182, 212, 0.9))' }}>
                    <defs>
                        <linearGradient id="diaFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E0F2FE" />
                            <stop offset="50%" stopColor="#38BDF8" />
                            <stop offset="100%" stopColor="#0369A1" />
                        </linearGradient>
                    </defs>
                    <polygon points="18,36 34,16 66,16 82,36 50,86" fill="url(#diaFacet)" stroke="#A5F3FC" strokeWidth="2" />
                    <polygon points="34,16 66,16 50,36" fill="#E0F2FE" opacity="0.85" />
                    <polygon points="18,36 34,16 50,36" fill="#7DD3FC" opacity="0.8" />
                    <polygon points="82,36 66,16 50,36" fill="#0284C7" opacity="0.75" />
                    <polygon points="18,36 50,86 50,36" fill="#38BDF8" opacity="0.9" />
                    <polygon points="82,36 50,86 50,36" fill="#0369A1" opacity="0.95" />
                </svg>
            );

        case 'car':
            // 🏎️ Addis Supercar (10,000 ETB / 100,000 Coins) - Exotic Aerodynamic Hypercar
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 25px rgba(239, 68, 68, 0.85))' }}>
                    <defs>
                        <linearGradient id="supercarBody" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="50%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#991B1B" />
                        </linearGradient>
                    </defs>
                    <path d="M10 60 L24 44 L48 40 L68 42 L88 52 L94 64 L8 64 Z" fill="url(#supercarBody)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <path d="M36 44 L48 42 L64 44 L60 52 L32 52 Z" fill="#09090B" stroke="#10B981" strokeWidth="1.5" />
                    <circle cx="26" cy="65" r="10" fill="#18181B" stroke="#10B981" strokeWidth="2.5" />
                    <circle cx="26" cy="65" r="4.5" fill="#E2E8F0" />
                    <circle cx="76" cy="65" r="10" fill="#18181B" stroke="#10B981" strokeWidth="2.5" />
                    <circle cx="76" cy="65" r="4.5" fill="#E2E8F0" />
                    <ellipse cx="50" cy="76" rx="38" ry="4" fill="#10B981" opacity="0.75" />
                </svg>
            );

        case 'lalibela':
            // ⛪ Lalibela Bet Giyorgis (25,000 ETB / 250,000 Coins) - Exact Monolithic Cross Church
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 10px 30px rgba(217, 119, 6, 0.9))' }}>
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
                    <circle cx="50" cy="50" r="42" fill="url(#laliSun)" opacity="0.5" />
                    <rect x="12" y="20" width="76" height="70" rx="6" fill="#451A03" stroke="#F59E0B" strokeWidth="1.5" />
                    <path d="M38 22 L62 22 L62 38 L78 38 L78 62 L62 62 L62 78 L38 78 L38 62 L22 62 L22 38 L38 38 Z" fill="url(#laliStone)" stroke="#FDE047" strokeWidth="2.5" />
                    <path d="M44 28 L56 28 L56 44 L72 44 L72 56 L56 56 L56 72 L44 72 L44 56 L28 56 L28 44 L44 44 Z" fill="#78350F" stroke="#FEF08A" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="5" fill="#FDE047" />
                </svg>
            );

        case 'plane':
            // ✈️ Ethiopian Dreamliner Jet (50,000 ETB / 500,000 Coins) - Flagship Boeing 787
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 8px 25px rgba(59, 130, 246, 0.85))' }}>
                    <defs>
                        <linearGradient id="jetFuselage" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F8FAFC" />
                            <stop offset="50%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#CBD5E1" />
                        </linearGradient>
                    </defs>
                    <path d="M50 10 C44 22 42 66 44 86 L56 86 C58 66 56 22 50 10 Z" fill="url(#jetFuselage)" stroke="#94A3B8" strokeWidth="1.5" />
                    <path d="M46 40 L6 64 L14 70 L46 56 Z" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
                    <path d="M54 40 L94 64 L86 70 L54 56 Z" fill="#DC2626" stroke="#B91C1C" strokeWidth="1" />
                    <path d="M44 78 L24 88 L28 92 L46 86 Z" fill="#F59E0B" />
                    <path d="M56 78 L76 88 L72 92 L54 86 Z" fill="#F59E0B" />
                    <rect x="47" y="24" width="6" height="2.5" fill="#16A34A" />
                    <rect x="47" y="27" width="6" height="2.5" fill="#FACC15" />
                    <rect x="47" y="30" width="6" height="2.5" fill="#DC2626" />
                </svg>
            );

        case 'national_honor':
            // 🏆 Grand National Honor (100,000 ETB / 1,000,000 Coins) - 24K Champion Medallion
            return (
                <svg width={s} height={s} viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0 10px 35px rgba(234, 179, 8, 1))' }}>
                    <defs>
                        <radialGradient id="honorSunburst" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FEF08A" />
                            <stop offset="60%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <linearGradient id="goldCup" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FEF08A" />
                            <stop offset="50%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="44" fill="url(#honorSunburst)" opacity="0.6" />
                    <circle cx="50" cy="50" r="30" fill="url(#goldCup)" stroke="#FEF08A" strokeWidth="3" />
                    <path d="M28 50 C28 34 40 26 50 26 C60 26 72 34 72 50" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                    <polygon points="50,38 53,46 61,46 55,51 57,59 50,54 43,59 45,51 39,46 47,46" fill="#78350F" />
                    <circle cx="50" cy="50" r="6" fill="#FEF08A" />
                </svg>
            );

        default:
            return <span style={{ fontSize: size * 0.7 }}>🎁</span>;
    }
};

// =========================================================================
// 2. NATIVE WEB AUDIO SYNTHESIZER FOR LIVE TIKTOK SOUND EFFECTS
// =========================================================================

export const playAudioEffect = (type = 'chime') => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (type === 'lion_roar') {
            // Ferocious Lion Roar: Low Frequency Sawtooth Formant + Filtered White Noise Growl
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(55, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(80, now + 1.2);
            osc.frequency.exponentialRampToValueAtTime(40, now + 1.8);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(380, now);
            filter.frequency.linearRampToValueAtTime(750, now + 0.5);
            filter.frequency.exponentialRampToValueAtTime(150, now + 1.8);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.6, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.85);

        } else if (type === 'car_rev') {
            // Supercar Accelerating Engine Rev & Tire Screech
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.8);
            osc.frequency.exponentialRampToValueAtTime(320, now + 1.4);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.45);

        } else if (type === 'jet_flyby') {
            // Commercial Jet Doppler Flyby
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 1.5);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.55);

        } else if (type === 'sacred_chime') {
            // Heavenly Angelic Chimes for Bible & Quran
            [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);

                gain.gain.setValueAtTime(0, now + i * 0.1);
                gain.gain.linearRampToValueAtTime(0.35, now + i * 0.1 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.2);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 1.25);
            });

        } else {
            // Melodic Fanfare Chime (Default Celebration)
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0, now + idx * 0.08);
                gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.08 + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.45);
            });
        }
    } catch (e) {}
};

// =========================================================================
// 3. FULL-SCREEN TIKTOK LIVE GRAPHICAL MOTION CELEBRATION ENGINE
// =========================================================================

export const TikTokLiveGiftShowcase = ({
    gift,
    supporterName = 'Generous Supporter',
    creatorName = 'Creator',
    amount = '10',
    coins = 100,
    comboCount = 1,
    onComboClick,
    onClose
}) => {
    const [animationPhase, setAnimationPhase] = useState('running'); // 'running' | 'roaring' | 'celebrating'

    useEffect(() => {
        // Trigger specific sound effect based on gift type
        if (gift?.id === 'anbessa') {
            playAudioEffect('lion_roar');
            const timer = setTimeout(() => setAnimationPhase('roaring'), 900);
            return () => clearTimeout(timer);
        } else if (gift?.id === 'car') {
            playAudioEffect('car_rev');
        } else if (gift?.id === 'plane') {
            playAudioEffect('jet_flyby');
        } else if (gift?.id === 'bible' || gift?.id === 'quran' || gift?.id === 'lalibela') {
            playAudioEffect('sacred_chime');
        } else {
            playAudioEffect('chime');
        }
    }, [gift]);

    if (!gift) return null;

    return (
        <div className="tiktok-cinematic-backdrop" onClick={onClose}>
            {/* Top Streamer & Gifter Live Banner */}
            <div className="tiktok-live-badge-container" onClick={e => e.stopPropagation()}>
                <div className="tiktok-live-avatar-pill">
                    <span className="live-pulse-dot"></span>
                    <span style={{ color: '#FDE047', fontWeight: 800 }}>{supporterName}</span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>sent</span>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>{gift.nameAm} ({gift.nameEn})</span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>to</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 800 }}>@{creatorName}</span>
                </div>
            </div>

            {/* FULL-SCREEN GRAPHICAL MOTION STAGE */}
            <div className="tiktok-motion-stage" onClick={e => e.stopPropagation()}>
                
                {/* 🦁 LION OF JUDAH: Runs Across Screen -> Leaps -> Roars with Screen Shake */}
                {gift.id === 'anbessa' && (
                    <div className={`lion-animation-wrapper ${animationPhase}`}>
                        <div className="savanna-dust-storm"></div>
                        <div className="lion-graphic-body">
                            <Gift3DIcon id="anbessa" size={180} />
                        </div>

                        {animationPhase === 'roaring' && (
                            <>
                                <div className="roar-shockwave wave-1"></div>
                                <div className="roar-shockwave wave-2"></div>
                                <div className="roar-shockwave wave-3"></div>
                                <div className="roar-text-banner">🦁 ROAAARRR! 👑</div>
                            </>
                        )}
                    </div>
                )}

                {/* 🏎️ ADDIS SUPERCAR: High-Speed Burnout & Drift */}
                {gift.id === 'car' && (
                    <div className="supercar-motion-wrapper">
                        <div className="tire-burnout-smoke"></div>
                        <div className="supercar-graphic-body">
                            <Gift3DIcon id="car" size={180} />
                        </div>
                        <div className="speed-lines"></div>
                        <div className="roar-text-banner">🏎️ VROOOOM! ⚡</div>
                    </div>
                )}

                {/* ✈️ ETHIOPIAN JET: Sky Flyby with Tricolor Vapor Trail */}
                {gift.id === 'plane' && (
                    <div className="jet-flyby-wrapper">
                        <div className="jet-tricolor-trail"></div>
                        <div className="jet-graphic-body">
                            <Gift3DIcon id="plane" size={200} />
                        </div>
                        <div className="sonic-boom-ring"></div>
                        <div className="roar-text-banner">✈️ DREAMLINER FLYBY! 🇪🇹</div>
                    </div>
                )}

                {/* 🌼 ADEY FLOWER / ROSE: Sunflower Petal Rain Vortex */}
                {(gift.id === 'adey_abeba' || gift.id === 'rose') && (
                    <div className="flower-bloom-wrapper">
                        {[...Array(24)].map((_, i) => (
                            <span 
                                key={i} 
                                className="floating-petal"
                                style={{
                                    left: `${(i * 4.2) % 96}%`,
                                    animationDelay: `${(i * 0.15)}s`,
                                    animationDuration: `${2 + (i % 3)}s`
                                }}
                            >
                                {gift.id === 'rose' ? '🌹' : '🌼'}
                            </span>
                        ))}
                        <div className="flower-center-burst">
                            <Gift3DIcon id={gift.id} size={160} />
                        </div>
                        <div className="roar-text-banner">🌼 ENKUTATASH BLOOM! ✨</div>
                    </div>
                )}

                {/* 📖 BIBLE / 📗 QURAN / ⛪ LALIBELA: Divine Heavenly Beams */}
                {(gift.id === 'bible' || gift.id === 'quran' || gift.id === 'lalibela') && (
                    <div className="sacred-light-wrapper">
                        <div className="heavenly-sunbeams"></div>
                        <div className="sacred-center-object">
                            <Gift3DIcon id={gift.id} size={170} />
                        </div>
                        <div className="roar-text-banner">✨ SACRED BLESSING 🙏</div>
                    </div>
                )}

                {/* 🧺 MESOB / ☕ BUNA / 🫖 JEBENA / 👑 CROWN / 💎 DIAMOND / 🏆 HONOR: Radiant Celebration */}
                {(!['anbessa', 'car', 'plane', 'adey_abeba', 'rose', 'bible', 'quran', 'lalibela'].includes(gift.id)) && (
                    <div className="radiant-celebration-wrapper">
                        <div className="golden-burst-particles"></div>
                        <div className="radiant-center-object">
                            <Gift3DIcon id={gift.id} size={170} />
                        </div>
                        <div className="roar-text-banner">🎉 {gift.nameAm} • {gift.nameEn} 🌟</div>
                    </div>
                )}

            </div>

            {/* Bottom Floating TikTok Combo & Dismiss Controls */}
            <div className="tiktok-combo-bottom-bar" onClick={e => e.stopPropagation()}>
                <div className="gift-value-pill">
                    <span>🪙 {Number(coins).toLocaleString()} Coins</span>
                    <span style={{ color: '#9CA3AF' }}>({Number(amount).toLocaleString()} ETB)</span>
                </div>

                <button
                    className="tiktok-combo-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onComboClick) onComboClick();
                        if (gift.id === 'anbessa') {
                            setAnimationPhase('roaring');
                            playAudioEffect('lion_roar');
                        } else if (gift.id === 'car') {
                            playAudioEffect('car_rev');
                        } else if (gift.id === 'plane') {
                            playAudioEffect('jet_flyby');
                        } else {
                            playAudioEffect('chime');
                        }
                    }}
                >
                    <span>🔥</span>
                    <span>x{comboCount} COMBO!</span>
                    <span className="tap-plus-one">TAP +1</span>
                </button>

                <button className="tiktok-dismiss-btn" onClick={onClose}>
                    Close &times;
                </button>
            </div>
        </div>
    );
};

