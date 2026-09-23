/**
 * Built-in High-Definition Lottie Animation Data & Asset Configuration
 * 
 * Provides production-ready vector Lottie animations out-of-the-box,
 * with drop-in slots for custom Lottie JSON files or WebM files downloaded
 * from LottieFiles.com or commissioned from 3D artists.
 */

// 1. Obelisk / Celestial Satellite (Tier 2) - Rotating celestial stela with radiant energy rings
export const obeliskLottieData = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 180,
    w: 500,
    h: 500,
    nm: "Axum Celestial Beacon",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Energy Ring Outer",
            sr: 1,
            ks: {
                o: { a: 1, k: [{ t: 0, s: [30] }, { t: 90, s: [90] }, { t: 180, s: [30] }] },
                r: { a: 1, k: [{ t: 0, s: [0] }, { t: 180, s: [360] }] },
                p: { a: 0, k: [250, 250, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 1, k: [{ t: 0, s: [90, 90] }, { t: 90, s: [110, 110] }, { t: 180, s: [90, 90] }] }
            },
            shapes: [
                {
                    ty: "el",
                    p: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [220, 220] }
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.22, 0.74, 0.97, 1] }, // #38BDF8 cyan
                    w: { a: 0, k: 3 },
                    d: [{ n: "d", v: { a: 0, k: 12 } }, { n: "g", v: { a: 0, k: 12 } }]
                }
            ]
        },
        {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: "Energy Ring Gold",
            sr: 1,
            ks: {
                o: { a: 1, k: [{ t: 0, s: [80] }, { t: 90, s: [40] }, { t: 180, s: [80] }] },
                r: { a: 1, k: [{ t: 0, s: [0] }, { t: 180, s: [-360] }] },
                p: { a: 0, k: [250, 250, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 0, k: [75, 75] }
            },
            shapes: [
                {
                    ty: "el",
                    p: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [170, 170] }
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.96, 0.62, 0.07, 1] }, // #F59E0B gold
                    w: { a: 0, k: 4 }
                }
            ]
        },
        {
            ddd: 0,
            ind: 3,
            ty: 4,
            nm: "Core Monolith Beacon",
            sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                r: { a: 0, k: 0 },
                p: { a: 1, k: [{ t: 0, s: [250, 260, 0] }, { t: 90, s: [250, 240, 0] }, { t: 180, s: [250, 260, 0] }] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 0, k: [100, 100] }
            },
            shapes: [
                {
                    ty: "rc",
                    p: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [46, 160] },
                    r: { a: 0, k: 6 }
                },
                {
                    ty: "fl",
                    c: { a: 0, k: [0.96, 0.62, 0.07, 0.85] }
                },
                {
                    ty: "st",
                    c: { a: 0, k: [1, 1, 1, 1] },
                    w: { a: 0, k: 2 }
                }
            ]
        }
    ]
};

// 2. Hero Lion / Royal Imperial Beast (Tier 3) - Majestic glowing lion emblem & expanding radiant shockwaves
export const lionHeroLottieData = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 240,
    w: 800,
    h: 800,
    nm: "Hero Imperial Lion",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Supernova Shockwave",
            sr: 1,
            ks: {
                o: { a: 1, k: [{ t: 0, s: [100] }, { t: 120, s: [0] }, { t: 240, s: [100] }] },
                r: { a: 0, k: 0 },
                p: { a: 0, k: [400, 400, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 1, k: [{ t: 0, s: [20, 20] }, { t: 120, s: [140, 140] }, { t: 240, s: [20, 20] }] }
            },
            shapes: [
                {
                    ty: "el",
                    p: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [500, 500] }
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.96, 0.62, 0.07, 1] },
                    w: { a: 0, k: 5 }
                }
            ]
        },
        {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: "Emerald Crown Radiance",
            sr: 1,
            ks: {
                o: { a: 0, k: 90 },
                r: { a: 1, k: [{ t: 0, s: [0] }, { t: 240, s: [360] }] },
                p: { a: 0, k: [400, 400, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 1, k: [{ t: 0, s: [90, 90] }, { t: 120, s: [105, 105] }, { t: 240, s: [90, 90] }] }
            },
            shapes: [
                {
                    ty: "sr",
                    p: { a: 0, k: [0, 0] },
                    ir: { a: 0, k: 180 },
                    is: { a: 0, k: 0 },
                    or: { a: 0, k: 250 },
                    os: { a: 0, k: 0 },
                    pt: { a: 0, k: 8 } // 8-pointed royal star
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.06, 0.72, 0.51, 0.9] }, // #10B981 emerald
                    w: { a: 0, k: 3 }
                }
            ]
        },
        {
            ddd: 0,
            ind: 3,
            ty: 4,
            nm: "Imperial Lion Crest",
            sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                r: { a: 0, k: 0 },
                p: { a: 1, k: [{ t: 0, s: [400, 410, 0] }, { t: 120, s: [400, 390, 0] }, { t: 240, s: [400, 410, 0] }] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 1, k: [{ t: 0, s: [95, 95] }, { t: 120, s: [105, 105] }, { t: 240, s: [95, 95] }] }
            },
            shapes: [
                {
                    ty: "el",
                    p: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [190, 190] }
                },
                {
                    ty: "fl",
                    c: { a: 0, k: [0.96, 0.62, 0.07, 0.95] }
                },
                {
                    ty: "st",
                    c: { a: 0, k: [1, 1, 1, 1] },
                    w: { a: 0, k: 4 }
                }
            ]
        }
    ]
};
