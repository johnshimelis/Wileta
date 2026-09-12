import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. 27 AUTHENTIC ETHIOPIAN CULTURAL VIRTUAL GIFTS CATALOG (10:1 COIN RATIO)
// =========================================================================

export const ETHIOPIAN_GIFTS_CATALOG = [
    // 🌼 Nature & Flora
    { 
        id: 'adey_abeba', 
        nameEn: 'Adey Flower', 
        nameAm: 'አደይ አበባ', 
        emoji: '🌼', 
        etb: '10', 
        coins: 100, 
        category: 'nature', 
        shortAm: 'የአዲስ ዓመት አበባ', 
        description: 'Highland yellow New Year bloom', 
        animationType: 'flower',
        quickMessages: [
            '🌼 መልካም አዲስ ዓመት!',
            '🌼 Blooming with highland beauty!',
            '🌼 Yellow flower of joy for you!',
            '🌼 በርታ አበባችን!'
        ]
    },
    { 
        id: 'rose', 
        nameEn: 'Highland Rose', 
        nameAm: 'ጽጌረዳ', 
        emoji: '🌹', 
        etb: '25', 
        coins: 250, 
        category: 'nature', 
        shortAm: 'የደጋ ጽጌረዳ', 
        description: 'Fresh Ethiopian highland red rose', 
        animationType: 'flower',
        quickMessages: [
            '🌹 ትልቅ ክብርና ፍቅር አለኝ!',
            '🌹 Highland rose for your dedication!',
            '🌹 ውብ ሥራህን እወዳለሁ!',
            '🌹 Keep blossoming!'
        ]
    },
    
    // ☕ Food & Hospitality
    { 
        id: 'buna', 
        nameEn: 'Sini Buna', 
        nameAm: 'ሲኒ ቡና', 
        emoji: '☕', 
        etb: '50', 
        coins: 500, 
        category: 'food', 
        shortAm: 'ትኩስ ሲኒ ቡና', 
        description: 'Freshly brewed Ethiopian coffee', 
        animationType: 'steam',
        quickMessages: [
            '☕ ቡና በረከታችሁ ይብዛ!',
            '☕ Buna on me! Keep creating!',
            '☕ Enjoy a fresh highland coffee!',
            '☕ ትኩስ ቡና ጠጡልኝ!'
        ]
    },
    { 
        id: 'jebena', 
        nameEn: 'Clay Jebena', 
        nameAm: 'የሸክላ ጀበና', 
        emoji: '🫖', 
        etb: '100', 
        coins: 1000, 
        category: 'food', 
        shortAm: 'ባህላዊ ጀበና', 
        description: 'Authentic clay coffee pot', 
        animationType: 'pour',
        quickMessages: [
            '🫖 የሸክላ ጀበና ቡና ለምወደው ፈጣሪ!',
            '🫖 Authentic Jebena brew for you!',
            '🫖 ባህላዊ ጀበና ይጣፍጣል!',
            '🫖 Brewing greatness every day!'
        ]
    },
    { 
        id: 'mesob', 
        nameEn: 'Mesob Basket', 
        nameAm: 'ባህላዊ መሶብ', 
        emoji: '🧺', 
        etb: '150', 
        coins: 1500, 
        category: 'food', 
        shortAm: 'የሐረር መሶብ', 
        description: 'Handcrafted woven dining table', 
        animationType: 'mesob',
        quickMessages: [
            '🧺 የሐበሻ መሶብ ማዕድ ይባረክ!',
            '🧺 Blessed table of friendship!',
            '🧺 ማዕዳችንን ስላደመቅክ እናመሰግናለን!',
            '🧺 Sharing the feast of creativity!'
        ]
    },
    { 
        id: 'enjera', 
        nameEn: 'Gursha Feast', 
        nameAm: 'የሀበሻ ማዕድ', 
        emoji: '🍲', 
        etb: '200', 
        coins: 2000, 
        category: 'food', 
        shortAm: 'በያይነቱ ማዕድ', 
        description: 'Beyaynetu feast with Doro Wot', 
        animationType: 'feast',
        quickMessages: [
            '🍲 ጉርሻ ለወዳጄ! በያይነቱ ማዕድ!',
            '🍲 Authentic Habesha Gursha for you!',
            '🍲 ጣፋጭ የሀበሻ ማዕድ ይሁንልህ!',
            '🍲 Big Gursha love!'
        ]
    },
    { 
        id: 'rekebot', 
        nameEn: 'Rekebot Set', 
        nameAm: 'ረከቦትና ዕጣን', 
        emoji: '☕', 
        etb: '2000', 
        coins: 20000, 
        category: 'food', 
        shortAm: 'የቡና ሥነ-ስርዓት', 
        description: 'Complete coffee ceremony service', 
        animationType: 'rekebot',
        quickMessages: [
            '☕ ረከቦትና ዕጣን ለሙሉ ክብርህ!',
            '☕ Complete coffee ceremony of honor!',
            '☕ በዕጣን የደመቀ ቡና ይሁንልህ!',
            '☕ Highland hospitality for you!'
        ]
    },

    // 📖 Culture & Tradition
    { 
        id: 'bible', 
        nameEn: 'Holy Bible', 
        nameAm: 'መጽሐፍ ቅዱስ', 
        emoji: '📖', 
        etb: '250', 
        coins: 2500, 
        category: 'culture', 
        shortAm: 'ብራና መጽሐፍ', 
        description: 'Leatherbound Ge’ez scriptures', 
        animationType: 'book',
        quickMessages: [
            '📖 ቃሉ መንገድህን ያብራው!',
            '📖 Divine grace and blessings upon you!',
            '📖 ሰላም እና በረከት ይብዛልህ!',
            '📖 May God bless your journey!'
        ]
    },
    { 
        id: 'quran', 
        nameEn: 'Holy Quran', 
        nameAm: 'ቅዱስ ቁርኣን', 
        emoji: '📗', 
        etb: '250', 
        coins: 2500, 
        category: 'culture', 
        shortAm: 'ክቡር ቁርኣን', 
        description: 'Gilded sacred scriptures', 
        animationType: 'book',
        quickMessages: [
            '📗 ቅዱስ ቁርኣን እና በረከት!',
            '📗 May Allah grant you success and peace!',
            '📗 ሰላም ለሁላችን ይሁን!',
            '📗 Ramadan & eternal blessings!'
        ]
    },
    { 
        id: 'kemis', 
        nameEn: 'Habesha Kemis', 
        nameAm: 'የሐበሻ ቀሚስ', 
        emoji: '👗', 
        etb: '1000', 
        coins: 10000, 
        category: 'culture', 
        shortAm: 'ጥልፍ የሐበሻ ቀሚስ', 
        description: 'Handspun cotton dress with Tibeb', 
        animationType: 'kemis',
        quickMessages: [
            '👗 የሐበሻ ውበትና ጥበብ ይብራልህ!',
            '👗 Pure cultural elegance and pride!',
            '👗 ጥልፍ የሐበሻ ቀሚስ ውበት!',
            '👗 Honoring your artistic grace!'
        ]
    },
    { 
        id: 'shield', 
        nameEn: 'Warrior Shield', 
        nameAm: 'ጋሻና ጦር', 
        emoji: '🛡️', 
        etb: '1500', 
        coins: 15000, 
        category: 'culture', 
        shortAm: 'የጀግና ጋሻና ጦር', 
        description: 'Embossed leather shield & spears', 
        animationType: 'shield',
        quickMessages: [
            '🛡️ የጀግና ጋሻና ጦር! አይዞህ በርታ!',
            '🛡️ Fearless warrior of your craft!',
            '🛡️ በፅናት ተራመድ!',
            '🛡️ Unbreakable resilience!'
        ]
    },
    { 
        id: 'crown', 
        nameEn: 'Negus Crown', 
        nameAm: 'የንጉሥ ዘውድ', 
        emoji: '👑', 
        etb: '10000', 
        coins: 100000, 
        category: 'culture', 
        shortAm: 'የኢትዮጵያ ንጉሥ ዘውድ', 
        description: 'Imperial 24K solid gold crown', 
        animationType: 'crown',
        quickMessages: [
            '👑 ንጉሥ ነህ! ዘውድ ይገባሃል!',
            '👑 Royal respect for your incredible craft!',
            '👑 You dropped this crown, king!',
            '👑 ታላቅ ክብር ለፈጣሪያችን!'
        ]
    },
    { 
        id: 'national_honor', 
        nameEn: 'National Honor', 
        nameAm: 'የክብር ሜዳሊያ', 
        emoji: '🏅', 
        etb: '100000', 
        coins: 1000000, 
        category: 'culture', 
        shortAm: 'ታላቅ ብሔራዊ ክብር', 
        description: 'Order of the Star of Ethiopia', 
        animationType: 'honor',
        quickMessages: [
            '🏅 ታላቅ ብሔራዊ ክብር ይገባሃል!',
            '🏅 Order of Ethiopian Excellence!',
            '🏅 ኩራታችን ነህ! ለሀገር ኩራት!',
            '🏅 Highest honor for your work!'
        ]
    },

    // 🎶 Music & Performing Arts
    { 
        id: 'kebero', 
        nameEn: 'Kebero Drum', 
        nameAm: 'ባህላዊ ከበሮ', 
        emoji: '🪘', 
        etb: '350', 
        coins: 3500, 
        category: 'music', 
        shortAm: 'የበዓል ከበሮ', 
        description: 'Traditional ceremonial drum', 
        animationType: 'kebero',
        quickMessages: [
            '🪘 ደስታ ይሙላህ! የበዓል ከበሮ!',
            '🪘 Rhythm of our highland pride!',
            '🪘 በከበሮ ድምፅ ደስታ ይብዛ!',
            '🪘 Celebration beat for you!'
        ]
    },
    { 
        id: 'masenqo', 
        nameEn: 'Masenqo Lute', 
        nameAm: 'ማሲንቆ', 
        emoji: '🎻', 
        etb: '500', 
        coins: 5000, 
        category: 'music', 
        shortAm: 'ባህላዊ ማሲንቆ', 
        description: 'Single-string bowed lute', 
        animationType: 'masenqo',
        quickMessages: [
            '🎻 ማሲንቆው ድምፅህ ነው! ዜማህ ይማርካል!',
            '🎻 Sweet acoustic melodies of heritage!',
            '🎻 ባህላችንን በዜማ አድምቅ!',
            '🎻 Pure Ethiopian strings!'
        ]
    },
    { 
        id: 'krar', 
        nameEn: 'Acoustic Krar', 
        nameAm: 'ባህላዊ ክራር', 
        emoji: '🎸', 
        etb: '750', 
        coins: 7500, 
        category: 'music', 
        shortAm: 'ባለ አምስት ክር ክራር', 
        description: 'Traditional five-string lyre', 
        animationType: 'krar',
        quickMessages: [
            '🎸 ባለ አምስት ክር ክራር! ድንቅ ዜማ!',
            '🎸 Plucking the chords of greatness!',
            '🎸 ባህላዊ ክራር ለምትወደው ፈጣሪ!',
            '🎸 Beautiful harmony!'
        ]
    },

    // 🦁 Nature & Wildlife
    { 
        id: 'walia', 
        nameEn: 'Walia Ibex', 
        nameAm: 'ዋሊያ አይቤክስ', 
        emoji: '🐐', 
        etb: '2500', 
        coins: 25000, 
        category: 'nature', 
        shortAm: 'የሰሜን ተራሮች ዋሊያ', 
        description: 'Endemic Simien mountain ibex', 
        animationType: 'walia',
        quickMessages: [
            '🐐 የሰሜን ተራሮች ዋሊያ ጀግና!',
            '🐐 Simien Mountain strength and pride!',
            '🐐 ወደ ተራራው ጫፍ ውጣ!',
            '🐐 Endemic greatness!'
        ]
    },
    { 
        id: 'horse', 
        nameEn: 'Gadaa Horse', 
        nameAm: 'የኦሮሞ ፈረስ', 
        emoji: '🏇', 
        etb: '3000', 
        coins: 30000, 
        category: 'nature', 
        shortAm: 'የገዳ ሥርዓት ፈረስ', 
        description: 'Ceremonial Oromo war steed', 
        animationType: 'horse',
        quickMessages: [
            '🏇 የገዳ ፈረስ! ወደ ድል ተጓዝ!',
            '🏇 Galloping toward legendary victory!',
            '🏇 የኦሮሞ ፈረስ ጀግንነት!',
            '🏇 Ride with honor and courage!'
        ]
    },
    { 
        id: 'anbessa', 
        nameEn: 'Lion of Judah', 
        nameAm: 'የይሁዳ አንበሳ', 
        emoji: '🦁', 
        etb: '5000', 
        coins: 50000, 
        category: 'nature', 
        shortAm: 'ግርማ ሞገስ አንበሳ', 
        description: 'Imperial Ethiopian lion', 
        animationType: 'lion',
        quickMessages: [
            '🦁 የይሁዳ አንበሳ! አንበሳ ሁን ሁሌም!',
            '🦁 Majestic Lion of Judah power!',
            '🦁 ጀግናችን ነህ! ግርማ ሞገስ ይሁንልህ!',
            '🦁 Roar with pride, brother!'
        ]
    },

    // 🏛️ Historical Landmarks
    { 
        id: 'axum', 
        nameEn: 'Axum Obelisk', 
        nameAm: 'የአክሱም ሐውልት', 
        emoji: '🏛️', 
        etb: '35000', 
        coins: 350000, 
        category: 'places', 
        shortAm: 'ጥንታዊ የአክሱም ሐውልት', 
        description: 'Monolithic carved granite stela', 
        animationType: 'axum',
        quickMessages: [
            '🏛️ ጥንታዊ የአክሱም ሐውልት ፅናት!',
            '🏛️ Standing tall and timeless like Axum!',
            '🏛️ የታሪካችን ምልክት ነህ!',
            '🏛️ Monolithic greatness!'
        ]
    },
    { 
        id: 'gondar', 
        nameEn: 'Gondar Castle', 
        nameAm: 'ፋሲል ግቢ', 
        emoji: '🏰', 
        etb: '40000', 
        coins: 400000, 
        category: 'places', 
        shortAm: 'የአፄ ፋሲል ቤተ-መንግሥት', 
        description: 'Medieval imperial stone castle', 
        animationType: 'gondar',
        quickMessages: [
            '🏰 የነገሥታት ፋሲል ግቢ ክብር!',
            '🏰 Castle of legends and royal heritage!',
            '🏰 የታሪክ ገድልህ ይቀጥል!',
            '🏰 Imperial fortress strength!'
        ]
    },
    { 
        id: 'lalibela', 
        nameEn: 'Lalibela Church', 
        nameAm: 'ላሊበላ ቤተ ጊዮርጊስ', 
        emoji: '⛪', 
        etb: '50000', 
        coins: 500000, 
        category: 'places', 
        shortAm: 'ከአንድ አለት የተፈለፈለው', 
        description: 'Rock-hewn Bete Giyorgis church', 
        animationType: 'lalibela',
        quickMessages: [
            '⛪ ከአንድ አለት የተፈለፈለው ድንቅ ቅርስ!',
            '⛪ Monumental wonder of faith & genius!',
            '⛪ ቅዱስ ላሊበላ ይባርክህ!',
            '⛪ Masterpiece of dedication!'
        ]
    },
    { 
        id: 'erta_ale', 
        nameEn: 'Erta Ale', 
        nameAm: 'ኤርታሌ እሳተ ጎመራ', 
        emoji: '🌋', 
        etb: '60000', 
        coins: 600000, 
        category: 'places', 
        shortAm: 'የዳናኪል እሳተ ጎመራ', 
        description: 'Active molten basaltic shield volcano', 
        animationType: 'volcano',
        quickMessages: [
            '🌋 የዳናኪል እሳተ ጎመራ ጉልበት!',
            '🌋 Unstoppable molten basaltic passion!',
            '🌋 ተቀጣጣይ እሳት ሁን በርታ!',
            '🌋 Pure explosive energy!'
        ]
    },

    // 🚀 Modern Ethiopia
    { 
        id: 'diamond', 
        nameEn: 'Precious Gem', 
        nameAm: 'ቴሌብር አልማዝ', 
        emoji: '💎', 
        etb: '15000', 
        coins: 150000, 
        category: 'modern', 
        shortAm: 'ደማቅ አልማዝ', 
        description: 'Brilliant-cut radiant gemstone', 
        animationType: 'diamond',
        quickMessages: [
            '💎 አንተ ውድ የኢትዮጵያ አልማዝ ነህ!',
            '💎 Brilliant cut pure diamond quality!',
            '💎 ብሩህ አልማዝ ሁን አብራ!',
            '💎 Shining bright forever!'
        ]
    },
    { 
        id: 'car', 
        nameEn: 'Addis Supercar', 
        nameAm: 'ስፖርት መኪና', 
        emoji: '🏎️', 
        etb: '25000', 
        coins: 250000, 
        category: 'modern', 
        shortAm: 'ዘመናዊ ስፖርት መኪና', 
        description: 'High-performance luxury supercar', 
        animationType: 'car',
        quickMessages: [
            '🏎️ የአዲስ ስፖርት መኪና! ጋዝ ጨምርበት!',
            '🏎️ Accelerate your dream on the fast lane!',
            '🏎️ በከፍተኛ ፍጥነት ወደ ስኬት!',
            '🏎️ Addis drift champion!'
        ]
    },
    { 
        id: 'plane', 
        nameEn: 'Ethiopian Jet', 
        nameAm: 'የኢትዮጵያ አየር መንገድ', 
        emoji: '✈️', 
        etb: '75000', 
        coins: 750000, 
        category: 'modern', 
        shortAm: 'ቦይንግ 787 ድሪምላይነር', 
        description: 'Boeing 787 Dreamliner flagship', 
        animationType: 'plane',
        quickMessages: [
            '✈️ የኢትዮጵያ አየር መንገድ ድሪምላይነር!',
            '✈️ Flying our flag high in the skies!',
            '✈️ ወደ ሰማይ ውጣ! Sky is not the limit!',
            '✈️ Flagship Ethiopian wings!'
        ]
    },
    { 
        id: 'satellite', 
        nameEn: 'ETRSS-1 Satellite', 
        nameAm: 'የኢትዮጵያ ሳተላይት', 
        emoji: '🛰️', 
        etb: '90000', 
        coins: 900000, 
        category: 'modern', 
        shortAm: 'የመጀመሪያዋ ሳተላይት', 
        description: 'Remote sensing satellite in orbit', 
        animationType: 'satellite',
        quickMessages: [
            '🛰️ የመጀመርያዋ ሳተላይት ETRSS-1!',
            '🛰️ Reaching the cosmos from Ethiopia!',
            '🛰️ የጠፈር ጉዞ ወደፊት!',
            '🛰️ Orbiting with innovation!'
        ]
    }
];

export const GIFT_CATEGORIES = [
    { key: 'all', labelEn: 'All Gifts', labelAm: 'ሁሉም', icon: '🎁' },
    { key: 'food', labelEn: 'Food & Buna', labelAm: 'ምግብና ቡና', icon: '☕' },
    { key: 'music', labelEn: 'Music', labelAm: 'ሙዚቃ', icon: '🪘' },
    { key: 'culture', labelEn: 'Culture', labelAm: 'ባህል', icon: '🇪🇹' },
    { key: 'nature', labelEn: 'Nature', labelAm: 'ተፈጥሮ', icon: '🌼' },
    { key: 'places', labelEn: 'Landmarks', labelAm: 'ቦታዎች', icon: '🏛️' },
    { key: 'modern', labelEn: 'Modern', labelAm: 'ዘመናዊ', icon: '🚀' },
    { key: 'custom', labelEn: 'Custom', labelAm: 'ብጁ', icon: '✍️' }
];

// =========================================================================
// 2. TACTILE ETHIOPIAN GIFT VISUAL COMPONENT WITH OBJECT-SPECIFIC ANIMATIONS
// =========================================================================

export const Gift3DIcon = ({ id, size = 56, animated = true, isHero = false, isSelected = false }) => {
    const s = size;
    const [imgStep, setImgStep] = useState(0); // 0 = png, 1 = jpg, 2 = emoji

    useEffect(() => {
        setImgStep(0);
    }, [id]);

    const handleImgError = () => {
        setImgStep(prev => prev + 1);
    };

    const imgSrc = imgStep === 0 ? `/gifts/${id}.png` : `/gifts/${id}.jpg`;

    // Object-specific motion class
    const getMovementClass = () => {
        if (!animated) return '';
        switch (id) {
            case 'jebena': return 'eth-anim-jebena';
            case 'buna': return 'eth-anim-buna';
            case 'rekebot': return 'eth-anim-rekebot';
            case 'kebero': return 'eth-anim-kebero';
            case 'masenqo': return 'eth-anim-masenqo';
            case 'krar': return 'eth-anim-krar';
            case 'bible':
            case 'quran': return 'eth-anim-book';
            case 'adey_abeba':
            case 'rose': return 'eth-anim-flower';
            case 'shield': return 'eth-anim-shield';
            case 'anbessa': return 'eth-anim-lion';
            case 'walia': return 'eth-anim-walia';
            case 'horse': return 'eth-anim-horse';
            case 'plane': return 'eth-anim-plane';
            case 'car': return 'eth-anim-car';
            case 'satellite': return 'eth-anim-satellite';
            case 'axum':
            case 'lalibela': return 'eth-anim-monument';
            case 'gondar': return 'eth-anim-gondar';
            case 'mesob': return 'eth-anim-mesob';
            case 'enjera': return 'eth-anim-feast';
            case 'crown':
            case 'national_honor': return 'eth-anim-regal';
            case 'diamond': return 'eth-anim-diamond';
            case 'kemis': return 'eth-anim-kemis';
            case 'erta_ale': return 'eth-anim-volcano';
            default: return 'eth-anim-calm';
        }
    };

    return (
        <div 
            className={`eth-gift-art-box ${getMovementClass()} ${isSelected ? 'gift-is-selected' : ''} ${isHero ? 'eth-gift-hero' : ''}`}
            data-gift-id={id}
            style={{ 
                width: `${s}px`, 
                height: `${s}px`,
                minWidth: `${s}px`,
                minHeight: `${s}px`,
                maxWidth: `${s}px`,
                maxHeight: `${s}px`,
                aspectRatio: '1 / 1',
                flexShrink: 0,
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
            }}
        >
            {/* Sacred Ambient Light Aura Behind Books */}
            {(id === 'bible' || id === 'quran') && (
                <div className={`book-sacred-glow ${id === 'quran' ? 'emerald' : 'gold'}`} />
            )}

            {/* Addis Supercar: Tire Drift Smoke Puffs */}
            {animated && id === 'car' && (
                <div className={`gift-fx-car-smoke ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="smoke-puff p1" />
                    <span className="smoke-puff p2" />
                    <span className="smoke-puff p3" />
                </div>
            )}

            {/* Ethiopian Jet: High-Altitude Contrail Streams & Cloud Wisps */}
            {animated && id === 'plane' && (
                <div className={`gift-fx-plane-clouds ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="contrail-stream c1" />
                    <span className="contrail-stream c2" />
                    <span className="flight-cloud f1" />
                </div>
            )}

            {/* Clay Jebena: Coffee Pouring Stream + Rising Steam */}
            {animated && id === 'jebena' && (
                <div className={`gift-fx-pour ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <svg className="pour-stream-svg" viewBox="0 0 32 38" fill="none">
                        <path className="coffee-flow-path" d="M10 6 C 14 16, 17 24, 21 34" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
                        <path className="coffee-flow-highlight" d="M10 6 C 14 16, 17 24, 21 34" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    <span className="pour-drop d1" />
                    <div className="gift-fx-steam in-jebena">
                        <svg className="steam-svg" viewBox="0 0 36 36" fill="none">
                            <path d="M12 24C10 18 14 14 12 8" stroke="rgba(160,174,192,0.7)" strokeWidth="2" strokeLinecap="round" className="steam-path p1" />
                            <path d="M19 26C17 19 21 15 19 9" stroke="rgba(160,174,192,0.8)" strokeWidth="2.2" strokeLinecap="round" className="steam-path p2" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Sini Buna, Rekebot & Enjera: Continuous Aromatic Steam Wisps */}
            {animated && ['buna', 'rekebot', 'enjera'].includes(id) && (
                <div className={`gift-fx-steam ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <svg className="steam-svg" viewBox="0 0 36 36" fill="none">
                        <path d="M10 26C8 20 12 15 10 10C8 7 11 3 10 1" stroke="rgba(160,174,192,0.65)" strokeWidth="2" strokeLinecap="round" className="steam-path p1" />
                        <path d="M18 28C16 21 20 16 18 11C16 7 19 4 18 1" stroke="rgba(160,174,192,0.75)" strokeWidth="2.2" strokeLinecap="round" className="steam-path p2" />
                        <path d="M26 26C24 20 28 15 26 10C24 7 27 3 26 1" stroke="rgba(160,174,192,0.65)" strokeWidth="2" strokeLinecap="round" className="steam-path p3" />
                    </svg>
                </div>
            )}

            {/* Adey Abeba & Highland Rose: Blooming Golden Pollen & Sparkles */}
            {animated && ['adey_abeba', 'rose'].includes(id) && (
                <div className={`gift-fx-bloom-pollen ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="pollen-dot p1" />
                    <span className="pollen-dot p2" />
                    <span className="pollen-dot p3" />
                    <span className="pollen-sparkle s1">✧</span>
                </div>
            )}

            {/* Kebero Drum: Rhythmic Radiating Sonic Acoustic Rings */}
            {animated && id === 'kebero' && (
                <div className={`gift-fx-kebero-wave ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="sonic-ring ring1" />
                    <span className="sonic-ring ring2" />
                </div>
            )}

            {/* Masenqo & Krar: Harmonic Strings Vibration & Floating Notes */}
            {animated && ['masenqo', 'krar'].includes(id) && (
                <div className={`gift-fx-string-waves ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="vibe-line v1" />
                    <span className="vibe-line v2" />
                    <span className="music-note n1">♪</span>
                </div>
            )}

            {/* Axum, Lalibela & Gondar: Sunlit Golden Sheen Beam Sweep */}
            {animated && ['axum', 'lalibela', 'gondar'].includes(id) && (
                <div className={`gift-fx-golden-sheen ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <div className="sheen-sweep-bar" />
                </div>
            )}

            {/* Diamond, Crown & National Honor: Crystalline Star Sparkles */}
            {animated && ['diamond', 'crown', 'national_honor'].includes(id) && (
                <div className={`gift-fx-sparkle-stars ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="sparkle-star s1">✦</span>
                    <span className="sparkle-star s2">✧</span>
                    <span className="sparkle-star s3">✦</span>
                </div>
            )}

            {/* ETRSS-1 Satellite: Radar Telemetry Waves */}
            {animated && id === 'satellite' && (
                <div className={`gift-fx-satellite-signal ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="sat-ping p1" />
                    <span className="sat-ping p2" />
                </div>
            )}

            {/* Erta Ale Volcano: Bubbling Magma Glow & Floating Embers */}
            {animated && id === 'erta_ale' && (
                <div className={`gift-fx-volcano-embers ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="ember-spark e1" />
                    <span className="ember-spark e2" />
                    <span className="ember-spark e3" />
                </div>
            )}

            {/* Visual Frame */}
            <div 
                className="eth-gift-image-frame"
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent'
                }}
            >
                {imgStep < 2 ? (
                    <img 
                        src={imgSrc} 
                        alt={id}
                        className={`eth-gift-real-img ${id === 'bible' || id === 'quran' ? 'eth-book-real-img' : ''}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            aspectRatio: '1 / 1',
                            display: 'block'
                        }}
                        onError={handleImgError}
                        loading="eager"
                    />
                ) : (
                    <div 
                        className="eth-gift-fallback-emoji"
                        style={{ 
                            fontSize: `${Math.max(22, Math.round(s * 0.52))}px`,
                            lineHeight: 1,
                            userSelect: 'none'
                        }}
                    >
                        {id === 'adey_abeba' ? '🌼' :
                         id === 'rose' ? '🌹' :
                         id === 'buna' ? '☕' :
                         id === 'jebena' ? '🫖' :
                         id === 'mesob' ? '🧺' :
                         id === 'enjera' ? '🍲' :
                         id === 'bible' ? '📖' :
                         id === 'quran' ? '📗' :
                         id === 'kebero' ? '🪘' :
                         id === 'masenqo' ? '🎻' :
                         id === 'krar' ? '🎸' :
                         id === 'kemis' ? '👗' :
                         id === 'shield' ? '🛡️' :
                         id === 'rekebot' ? '☕' :
                         id === 'walia' ? '🐐' :
                         id === 'horse' ? '🏇' :
                         id === 'anbessa' ? '🦁' :
                         id === 'crown' ? '👑' :
                         id === 'diamond' ? '💎' :
                         id === 'car' ? '🏎️' :
                         id === 'axum' ? '🏛️' :
                         id === 'gondar' ? '🏰' :
                         id === 'lalibela' ? '⛪' :
                         id === 'erta_ale' ? '🌋' :
                         id === 'plane' ? '✈️' :
                         id === 'satellite' ? '🛰️' :
                         id === 'national_honor' ? '🏅' : '🎁'}
                    </div>
                )}
            </div>
        </div>
    );
};

// =========================================================================
// 3. SUBTLE NATIVE WEB AUDIO EFFECTS (OPTIONAL & DISCREET)
// =========================================================================

export const playAudioEffect = (type = 'chime') => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (type === 'lion_roar') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(75, now + 1.1);
            osc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.linearRampToValueAtTime(700, now + 0.5);
            filter.frequency.exponentialRampToValueAtTime(120, now + 1.8);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.85);

        } else if (type === 'car_rev') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(380, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(260, now + 1.2);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.25);

        } else if (type === 'jet_flyby') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(480, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 1.4);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3, now + 0.25);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.45);

        } else if (type === 'sacred_chime') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.09);

                gain.gain.setValueAtTime(0, now + i * 0.09);
                gain.gain.linearRampToValueAtTime(0.2, now + i * 0.09 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.1);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.09);
                osc.stop(now + i * 0.09 + 1.15);
            });

        } else {
            // Soft warm melodic chime
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.07);

                gain.gain.setValueAtTime(0, now + idx * 0.07);
                gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.07);
                osc.stop(now + idx * 0.07 + 0.45);
            });
        }
    } catch (e) {}
};

// =========================================================================
// 4. AUTHENTIC ETHIOPIAN CELEBRATION SHOWCASE MODAL
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
    useEffect(() => {
        if (!gift) return;
        if (gift.id === 'anbessa') {
            playAudioEffect('lion_roar');
        } else if (gift.id === 'car') {
            playAudioEffect('car_rev');
        } else if (gift.id === 'plane') {
            playAudioEffect('jet_flyby');
        } else if (['bible', 'quran', 'lalibela', 'axum', 'gondar'].includes(gift.id)) {
            playAudioEffect('sacred_chime');
        } else {
            playAudioEffect('chime');
        }
    }, [gift]);

    if (!gift) return null;

    return (
        <div className="eth-celebration-backdrop" onClick={onClose}>
            {/* Top Right Close Button */}
            <button className="eth-celebration-close-icon" onClick={onClose} title="Close">
                ✕
            </button>

            {/* Ambient Animated Sparkle Particles */}
            <div className="eth-celebration-particles" style={{ pointerEvents: 'none' }}>
                <span className="p-star p1">✦</span>
                <span className="p-star p2">✧</span>
                <span className="p-star p3">✦</span>
                <span className="p-star p4">✧</span>
                <span className="p-star p5">✦</span>
                <span className="p-star p6">✧</span>
            </div>

            {/* Top Supporter Live Banner */}
            <div className="eth-celebration-banner" onClick={e => e.stopPropagation()}>
                <div className="eth-celebration-supporter-card">
                    <div className="supporter-avatar-circle">
                        {supporterName ? supporterName.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div className="supporter-details-col">
                        <div className="supporter-headline">
                            <span className="supporter-name-bold">{supporterName}</span>
                            <span className="action-tag">sent a Gursha</span>
                        </div>
                        <div className="supporter-target">
                            to <strong className="creator-highlight">@{creatorName}</strong>
                        </div>
                    </div>
                    <div className="supporter-gift-badge">
                        <span>{gift.emoji || '🎁'}</span>
                    </div>
                </div>
            </div>

            {/* Central Celebration Hero Stage */}
            <div className="eth-celebration-stage" onClick={e => e.stopPropagation()}>
                <div className="eth-celebration-hero-art">
                    <div className="hero-art-spotlight" />
                    <Gift3DIcon id={gift.id} size={155} isHero={true} animated={true} isSelected={true} />
                </div>

                <div className="eth-celebration-info">
                    <h1 className="hero-name-geez">{gift.nameAm}</h1>
                    <div className="hero-name-en-tag">{gift.nameEn}</div>
                    <div className="hero-value-pill">
                        <span className="hero-etb-val">{Number(amount).toLocaleString()} ETB</span>
                        <span className="hero-divider">&bull;</span>
                        <span className="hero-coin-val">🪙 {Number(coins).toLocaleString()} Coins</span>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="eth-celebration-bottom-bar" onClick={e => e.stopPropagation()}>
                {onComboClick && (
                    <button
                        className="eth-celebration-love-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onComboClick();
                            if (gift.id === 'anbessa') playAudioEffect('lion_roar');
                            else if (gift.id === 'car') playAudioEffect('car_rev');
                            else if (gift.id === 'plane') playAudioEffect('jet_flyby');
                            else playAudioEffect('chime');
                        }}
                    >
                        <span className="love-icon">❤️</span>
                        <span className="love-text">Send Love</span>
                        <span className="combo-count-badge">x{comboCount}</span>
                    </button>
                )}

                <button className="eth-celebration-dismiss-btn" onClick={onClose}>
                    Done
                </button>
            </div>
        </div>
    );
};

export const EthiopianGiftCelebrationModal = TikTokLiveGiftShowcase;
