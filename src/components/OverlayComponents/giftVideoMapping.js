/**
 * GurshaPay Live Stream Overlay - Canonical Gift to Video Mapping
 * Reuses the exact video assets from mobile/assets/animations mirrored in /animations/
 * Matches by:
 * 1. giftId / animationId (e.g. "jebena", "lion", "kebero", "masinqo", "walia_ibex", "axum_obelisk", "lalibela", "ethiopian_jet", "supercar")
 * 2. Gift name keywords in English and Amharic
 * 3. Exact tier amounts (Tiers 1-27 and standard catalog ETB amounts)
 */

export const GIFT_VIDEOS = {
    // 1. Jebena (Clay Jebena)
    jebena: {
        id: 'jebena',
        name: 'Clay Jebena',
        videoSrc: '/animations/jebena.mp4',
        emoji: '🫖',
        tier: 'tier1_sparkle'
    },
    // 2. Lion (Lion of Judah)
    lion: {
        id: 'lion',
        name: 'Lion of Judah',
        videoSrc: '/animations/lion_of_judha.mp4',
        emoji: '🦁',
        tier: 'tier3_lion'
    },
    // 3. Kebero (Kebero Drum)
    kebero: {
        id: 'kebero',
        name: 'Kebero Drum',
        videoSrc: '/animations/kebero.mp4',
        emoji: '🪘',
        tier: 'tier2_obelisk'
    },
    // 4. Masinqo (Masenqo Lute)
    masinqo: {
        id: 'masinqo',
        name: 'Masenqo Lute',
        videoSrc: '/animations/masinqo.mp4',
        emoji: '🎻',
        tier: 'tier2_obelisk'
    },
    // 5. Walia (Walia Ibex)
    walia_ibex: {
        id: 'walia_ibex',
        name: 'Walia Ibex',
        videoSrc: '/animations/walia_ibex.mp4',
        emoji: '🐐',
        tier: 'tier3_lion'
    },
    // 6. Axum Obelisk (Axum Hawulet)
    axum_obelisk: {
        id: 'axum_obelisk',
        name: 'Axum Obelisk',
        videoSrc: '/animations/axum_hawulet.mp4',
        emoji: '🏛️',
        tier: 'tier2_obelisk'
    },
    // 7. Lalibela (Lalibela Church)
    lalibela: {
        id: 'lalibela',
        name: 'Lalibela Church',
        videoSrc: '/animations/lalibela_chrchu.mp4',
        emoji: '⛪',
        tier: 'tier3_lion'
    },
    // 8. Ethiopian Jet (Boeing 787)
    ethiopian_jet: {
        id: 'ethiopian_jet',
        name: 'Ethiopian Jet',
        videoSrc: '/animations/ethiopian_jet.mp4',
        emoji: '✈️',
        tier: 'tier3_lion'
    },
    // 9. Addis Supercar
    supercar: {
        id: 'supercar',
        name: 'Addis Supercar',
        videoSrc: '/animations/supercar.mp4',
        emoji: '🏎️',
        tier: 'tier3_lion'
    },
    // 10. Adey Flower (Adey Abeba)
    adey_flower: {
        id: 'adey_flower',
        name: 'Adey Flower',
        videoSrc: '/animations/adey_flower.mp4',
        emoji: '🌼',
        tier: 'tier1_sparkle'
    },
    // 11. Highland Rose
    highland_rose: {
        id: 'highland_rose',
        name: 'Highland Rose',
        videoSrc: '/animations/highland_rose.mp4',
        emoji: '🌹',
        tier: 'tier1_sparkle'
    },
    // 12. Sini Buna Cup (Coffee)
    coffee: {
        id: 'coffee',
        name: 'Sini Buna Cup',
        videoSrc: '/animations/coffee.mp4',
        emoji: '☕',
        tier: 'tier1_sparkle'
    },
    // 13. Mesob Basket
    habesh_mesob: {
        id: 'habesh_mesob',
        name: 'Mesob Basket',
        videoSrc: '/animations/habesh_mesob.mp4',
        emoji: '🧺',
        tier: 'tier2_obelisk'
    },
    // 14. Gursha Feast (Beyaynetu)
    beyaynet_gursha: {
        id: 'beyaynet_gursha',
        name: 'Gursha Feast',
        videoSrc: '/animations/beyaynet_gursha.mp4',
        emoji: '🍲',
        tier: 'tier2_obelisk'
    },
    // 15. Holy Bible
    bible: {
        id: 'bible',
        name: 'Holy Bible',
        videoSrc: '/animations/bible.mp4',
        emoji: '📖',
        tier: 'tier2_obelisk'
    },
    // 16. Holy Quran
    quran: {
        id: 'quran',
        name: 'Holy Quran',
        videoSrc: '/animations/quran.mp4',
        emoji: '📗',
        tier: 'tier2_obelisk'
    },
    // 17. Acoustic Krar
    kirar: {
        id: 'kirar',
        name: 'Acoustic Krar',
        videoSrc: '/animations/kirar.mp4',
        emoji: '🎸',
        tier: 'tier2_obelisk'
    },
    // 18. Habesha Kemis
    habesha_kemis: {
        id: 'habesha_kemis',
        name: 'Habesha Kemis',
        videoSrc: '/animations/habesha_kemis.mp4',
        emoji: '👗',
        tier: 'tier2_obelisk'
    },
    // 19. Warrior Shield
    warrior_shield: {
        id: 'warrior_shield',
        name: 'Warrior Shield',
        videoSrc: '/animations/warrior_shield.mp4',
        emoji: '🛡️',
        tier: 'tier2_obelisk'
    },
    // 20. Gadaa Horse
    gadda_horse: {
        id: 'gadda_horse',
        name: 'Gadaa Horse',
        videoSrc: '/animations/gadda_horse.mp4',
        emoji: '🏇',
        tier: 'tier3_lion'
    },
    // 21. Negus Crown
    negus_crown: {
        id: 'negus_crown',
        name: 'Negus Crown',
        videoSrc: '/animations/negus_crown.mp4',
        emoji: '👑',
        tier: 'tier3_lion'
    },
    // 22. Telebirr Gem
    telebirr_gem: {
        id: 'telebirr_gem',
        name: 'Telebirr Gem',
        videoSrc: '/animations/telebirr_gem.mp4',
        emoji: '💎',
        tier: 'tier3_lion'
    }
};

/**
 * Resolves the assigned gift video from any incoming payload.
 * Supports:
 * - giftId (e.g. "jebena", "lion", "kebero", "masinqo", "walia_ibex", "axum_obelisk", "lalibela", "ethiopian_jet", "supercar")
 * - giftName / gift string (English & Amharic)
 * - animationId
 * - amount (ETB test amount or catalog amount)
 *
 * @param {Object|string} input - Payload object or gift identifier
 * @param {number|string} [amountFallback] - Optional amount fallback
 * @returns {Object|null} { id, name, videoSrc, emoji, tier } or null if none
 */
export function getGiftVideo(input, amountFallback) {
    if (!input) return null;

    let giftId = '';
    let giftName = '';
    let animationId = '';
    let amount = 0;

    if (typeof input === 'string') {
        giftId = input;
        giftName = input;
        amount = Number(amountFallback) || 0;
    } else if (typeof input === 'object') {
        giftId = String(input.giftId || input.id || '').trim();
        giftName = String(input.giftName || input.gift || input.title || '').trim();
        animationId = String(input.animationId || input.tier || '').trim();
        amount = Number(input.amount || amountFallback || 0);
    }

    const idLower = giftId.toLowerCase().replace(/[\s-]/g, '_');
    const nameLower = giftName.toLowerCase();
    const animLower = animationId.toLowerCase().replace(/[\s-]/g, '_');

    // 1. Direct ID / Key matching
    const directMatches = [idLower, animLower];
    for (const key of directMatches) {
        if (GIFT_VIDEOS[key]) return GIFT_VIDEOS[key];
    }

    // 2. Exact aliases mapping
    const ALIAS_MAP = {
        'clay_jebena': 'jebena',
        'jebena_coffee': 'jebena',
        'anbessa': 'lion',
        'lion_of_judah': 'lion',
        'lion_of_judha': 'lion',
        'lion_roar': 'lion',
        'tier3_lion': 'lion',
        'kebero_drum': 'kebero',
        'masenqo': 'masinqo',
        'masenqo_lute': 'masinqo',
        'walia': 'walia_ibex',
        'waliaibex': 'walia_ibex',
        'axum': 'axum_obelisk',
        'axum_hawulet': 'axum_obelisk',
        'axum_hawult': 'axum_obelisk',
        'tier2_obelisk': 'axum_obelisk',
        'lalibela_church': 'lalibela',
        'lalibela_chrchu': 'lalibela',
        'bet_giyorgis': 'lalibela',
        'jet': 'ethiopian_jet',
        'plane': 'ethiopian_jet',
        'boeing': 'ethiopian_jet',
        'boeing_787': 'ethiopian_jet',
        'satellite': 'ethiopian_jet',
        'etrss_1': 'ethiopian_jet',
        'car': 'supercar',
        'addis_supercar': 'supercar',
        'sports_car': 'supercar',
        'adey': 'adey_flower',
        'adey_abeba': 'adey_flower',
        'flower': 'adey_flower',
        'tier1_sparkle': 'adey_flower',
        'rose': 'highland_rose',
        'buna': 'coffee',
        'sini_buna': 'coffee',
        'mesob': 'habesh_mesob',
        'gursha': 'beyaynet_gursha',
        'enjera': 'beyaynet_gursha',
        'beyaynet': 'beyaynet_gursha',
        'holy_bible': 'bible',
        'holy_quran': 'quran',
        'krar': 'kirar',
        'kemis': 'habesha_kemis',
        'shield': 'warrior_shield',
        'horse': 'gadda_horse',
        'crown': 'negus_crown',
        'gem': 'telebirr_gem',
        'diamond': 'telebirr_gem',
        'erta_ale': 'axum_obelisk',
        'gondar': 'lalibela',
        'fasil': 'lalibela',
        'rekebot': 'coffee',
        'national_honor': 'negus_crown'
    };

    if (ALIAS_MAP[idLower] && GIFT_VIDEOS[ALIAS_MAP[idLower]]) {
        return GIFT_VIDEOS[ALIAS_MAP[idLower]];
    }
    if (ALIAS_MAP[animLower] && GIFT_VIDEOS[ALIAS_MAP[animLower]]) {
        return GIFT_VIDEOS[ALIAS_MAP[animLower]];
    }

    // 3. Match by Name Keywords (English & Amharic)
    const combinedStr = `${nameLower} ${idLower} ${animLower}`;
    
    if (combinedStr.includes('jebena') || combinedStr.includes('ጀበና')) {
        return GIFT_VIDEOS.jebena;
    }
    if (combinedStr.includes('lion') || combinedStr.includes('anbessa') || combinedStr.includes('judah') || combinedStr.includes('judha') || combinedStr.includes('አንበሳ')) {
        return GIFT_VIDEOS.lion;
    }
    if (combinedStr.includes('kebero') || combinedStr.includes('ከበሮ') || combinedStr.includes('drum')) {
        return GIFT_VIDEOS.kebero;
    }
    if (combinedStr.includes('masinqo') || combinedStr.includes('masenqo') || combinedStr.includes('ማሲንቆ') || combinedStr.includes('lute')) {
        return GIFT_VIDEOS.masinqo;
    }
    if (combinedStr.includes('walia') || combinedStr.includes('ibex') || combinedStr.includes('ዋሊያ')) {
        return GIFT_VIDEOS.walia_ibex;
    }
    if (combinedStr.includes('axum') || combinedStr.includes('obelisk') || combinedStr.includes('hawulet') || combinedStr.includes('hawult') || combinedStr.includes('ሐውልት') || combinedStr.includes('አክሱም')) {
        return GIFT_VIDEOS.axum_obelisk;
    }
    if (combinedStr.includes('lalibela') || combinedStr.includes('chrchu') || combinedStr.includes('church') || combinedStr.includes('ላሊበላ') || combinedStr.includes('ጊዮርጊስ')) {
        return GIFT_VIDEOS.lalibela;
    }
    if (combinedStr.includes('jet') || combinedStr.includes('plane') || combinedStr.includes('boeing') || combinedStr.includes('flight') || combinedStr.includes('ጄት') || combinedStr.includes('አውሮፕላን') || combinedStr.includes('satellite') || combinedStr.includes('ሳተላይት')) {
        return GIFT_VIDEOS.ethiopian_jet;
    }
    if (combinedStr.includes('supercar') || combinedStr.includes('car') || combinedStr.includes('sport') || combinedStr.includes('መኪና')) {
        return GIFT_VIDEOS.supercar;
    }
    if (combinedStr.includes('adey') || combinedStr.includes('flower') || combinedStr.includes('አደይ')) {
        return GIFT_VIDEOS.adey_flower;
    }
    if (combinedStr.includes('rose') || combinedStr.includes('highland') || combinedStr.includes('ጽጌረዳ')) {
        return GIFT_VIDEOS.highland_rose;
    }
    if (combinedStr.includes('buna') || combinedStr.includes('coffee') || combinedStr.includes('sini') || combinedStr.includes('ቡና')) {
        return GIFT_VIDEOS.coffee;
    }
    if (combinedStr.includes('mesob') || combinedStr.includes('መሶብ')) {
        return GIFT_VIDEOS.habesh_mesob;
    }
    if (combinedStr.includes('gursha') || combinedStr.includes('feast') || combinedStr.includes('beyaynet') || combinedStr.includes('enjera') || combinedStr.includes('ማዕድ')) {
        return GIFT_VIDEOS.beyaynet_gursha;
    }
    if (combinedStr.includes('bible') || combinedStr.includes('መጽሐፍ ቅዱስ')) {
        return GIFT_VIDEOS.bible;
    }
    if (combinedStr.includes('quran') || combinedStr.includes('ቁርኣን')) {
        return GIFT_VIDEOS.quran;
    }
    if (combinedStr.includes('kirar') || combinedStr.includes('krar') || combinedStr.includes('ክራር')) {
        return GIFT_VIDEOS.kirar;
    }
    if (combinedStr.includes('kemis') || combinedStr.includes('ቀሚስ') || combinedStr.includes('dress')) {
        return GIFT_VIDEOS.habesha_kemis;
    }
    if (combinedStr.includes('shield') || combinedStr.includes('ጋሻ') || combinedStr.includes('ጦር') || combinedStr.includes('warrior')) {
        return GIFT_VIDEOS.warrior_shield;
    }
    if (combinedStr.includes('horse') || combinedStr.includes('gadaa') || combinedStr.includes('ፈረስ')) {
        return GIFT_VIDEOS.gadda_horse;
    }
    if (combinedStr.includes('crown') || combinedStr.includes('negus') || combinedStr.includes('ዘውድ') || combinedStr.includes('ንጉሥ')) {
        return GIFT_VIDEOS.negus_crown;
    }
    if (combinedStr.includes('gem') || combinedStr.includes('diamond') || combinedStr.includes('telebirr') || combinedStr.includes('አልማዝ')) {
        return GIFT_VIDEOS.telebirr_gem;
    }

    // 4. Exact Amount Matching (Tiers 1 - 27 matching mobile/overlay_view.dart & backend/routes/webhook.js)
    const exactAmount = Math.round(amount);
    const AMOUNT_MAP = {
        1: GIFT_VIDEOS.adey_flower,
        2: GIFT_VIDEOS.highland_rose,
        3: GIFT_VIDEOS.coffee,
        4: GIFT_VIDEOS.jebena,
        5: GIFT_VIDEOS.habesh_mesob,
        6: GIFT_VIDEOS.beyaynet_gursha,
        7: GIFT_VIDEOS.bible,
        8: GIFT_VIDEOS.quran,
        9: GIFT_VIDEOS.kebero,
        10: GIFT_VIDEOS.masinqo,
        11: GIFT_VIDEOS.kirar,
        12: GIFT_VIDEOS.habesha_kemis,
        13: GIFT_VIDEOS.warrior_shield,
        14: GIFT_VIDEOS.walia_ibex,
        15: GIFT_VIDEOS.gadda_horse,
        16: GIFT_VIDEOS.lion,
        17: GIFT_VIDEOS.negus_crown,
        18: GIFT_VIDEOS.telebirr_gem,
        19: GIFT_VIDEOS.supercar,
        20: GIFT_VIDEOS.axum_obelisk,
        21: GIFT_VIDEOS.lalibela,
        22: GIFT_VIDEOS.ethiopian_jet,
        23: GIFT_VIDEOS.ethiopian_jet,
        24: GIFT_VIDEOS.negus_crown,
        25: GIFT_VIDEOS.highland_rose,
        50: GIFT_VIDEOS.coffee,
        100: GIFT_VIDEOS.jebena,
        150: GIFT_VIDEOS.habesh_mesob,
        200: GIFT_VIDEOS.beyaynet_gursha,
        250: GIFT_VIDEOS.bible,
        300: GIFT_VIDEOS.kebero,
        500: GIFT_VIDEOS.masinqo,
        800: GIFT_VIDEOS.kirar,
        1000: GIFT_VIDEOS.habesha_kemis,
        1500: GIFT_VIDEOS.warrior_shield,
        2000: GIFT_VIDEOS.coffee,
        2500: GIFT_VIDEOS.walia_ibex,
        3000: GIFT_VIDEOS.axum_obelisk,
        3500: GIFT_VIDEOS.gadda_horse,
        4000: GIFT_VIDEOS.lalibela,
        5000: GIFT_VIDEOS.lion,
        6000: GIFT_VIDEOS.axum_obelisk,
        7000: GIFT_VIDEOS.telebirr_gem,
        10000: GIFT_VIDEOS.negus_crown,
        15000: GIFT_VIDEOS.supercar,
        25000: GIFT_VIDEOS.ethiopian_jet,
        50000: GIFT_VIDEOS.ethiopian_jet,
        100000: GIFT_VIDEOS.negus_crown
    };

    if (AMOUNT_MAP[exactAmount]) {
        return AMOUNT_MAP[exactAmount];
    }

    // 5. Tier fallback
    if (animLower.includes('tier3') || animLower.includes('high')) {
        return GIFT_VIDEOS.lion;
    }
    if (animLower.includes('tier2') || animLower.includes('mid')) {
        return GIFT_VIDEOS.axum_obelisk;
    }
    if (animLower.includes('tier1') || animLower.includes('low') || animLower.includes('sparkle')) {
        return GIFT_VIDEOS.adey_flower;
    }

    // Guaranteed fallback: ALWAYS return a valid video so overlay ONLY plays the gift video animation
    return GIFT_VIDEOS.adey_flower;
}
