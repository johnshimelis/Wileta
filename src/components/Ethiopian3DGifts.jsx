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
            '🌼 የመስከረም ወር አደይ አበባ ብሩህ ተስፋና አዲስ ድል ይዞልዎት ይምጣ!',
            '🌼 እንደ ቢጫው አደይ አበባ በፈጠራ ስራዎ ሁሌም ፈክተው ይታዩ!',
            '🌼 Blooming highland beauty and fresh blessings for your incredible journey!',
            '🌼 A bright bouquet of Adey Abeba to honor your inspiring work!'
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
            '🌹 የደጋው ውብ ጽጌረዳ ፍቅርና የከበረ ምስጋናዬ መግለጫ ይሁንልኝ!',
            '🌹 ውብ እና ያማረ የፈጠራ ስራዎ ሁሌም እንደ ጽጌረዳ ይፈካል!',
            '🌹 Fresh highland rose blooming with love for your inspiring craft!',
            '🌹 Heartfelt appreciation and fragrant wishes for your bright future!'
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
            '☕ ባህላዊው ትኩስ ሲኒ ቡና አዕምሮዎን አድሶ ለአዳዲስ ፈጠራዎች ያነሳሳዎት!',
            '☕ ቡና በረከታችሁ ይብዛ! በስራዎ ሁሌም ደስ እያለን ነው በርቱልን!',
            '☕ A hot, freshly brewed cup of Ethiopian highland coffee to fuel your brilliance!',
            '☕ Enjoying your content with a sweet cup of buna—keep inspiring us!'
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
            '🫖 በሸክላ ጀበና የተፈላውን ጣፋጭ የኢትዮጵያ ቡና እየጠጡ ስራዎን ይቀጥሉ!',
            '🫖 የጀበና ቡና ፈልቶ እንደሚጣፍጠው ሁሉ፣ የርስዎም ጥበብና ፈጠራ ልብ ያሞቃል!',
            '🫖 Pouring rich traditional Jebena coffee and endless love for your journey!',
            '🫖 Authentic clay Jebena brew in honor of your outstanding dedication!'
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
            '🧺 የሐበሻ ባህላዊ መሶብ ማዕድ ይባረክ! የፍቅርና የወንድማማችነት አንድነታችን ይለምልም!',
            '🧺 በመሶባችን ዙሪያ ተሰባስበን በጥበብዎ እንደምንደሰተው ሁሉ፣ በረከቱ ይብዛልዎት!',
            '🧺 Traditional woven Mesob table filled with warmth, feast, and friendship!',
            '🧺 The sacred dining table of Ethiopian hospitality celebrating your craft!'
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
            '🍲 የጉርሻ ባህላችን አንድነትን እንደሚያጠነክረው፣ ለርስዎም ፍቅርና ጉርሻዬ ይድረስዎ!',
            '🍲 በማዕዳችን ላይ የሚቀርበው ማዕድ ይባረክ! በጋራ እንድንደሰት ስላደረጉን እናመሰግናለን!',
            '🍲 Generous Gursha feast of unity, brotherhood, and shared celebration!',
            '🍲 Sharing the finest feast of gratitude for your generous contributions!'
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
            '☕ በደመቀው ረከቦት ዙሪያ ተቀምጠን ቡና ስንጠጣ፣ በስራዎ ልባችን ይሞቃል!',
            '☕ ባህላዊውን የቡና ረከቦት አዘጋጅተን በክብር እያመሰገንንዎት ነው!',
            '☕ Elegantly arranged Rekebot coffee ceremony honoring your bright presence!',
            '☕ Traditional hospitality and sweet gathering blessings for our creator!'
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
            '📖 የእግዚአብሔር ቃልና ጥበብ ሁሌም መንገዶትን ያብራ፣ በበረከት ይጎብኙ!',
            '📖 የሰላም፣ የፍቅርና የእምነት በረከት ከርስዎና ከስራዎ ጋር ይሁን!',
            '📖 Divine wisdom, peace, and heavenly grace guiding all your endeavors!',
            '📖 Sacred gift of scripture in honor of your good heart and hard work!'
        ]
    },
    { 
        id: 'quran', 
        nameEn: 'Holy Quran', 
        nameAm: 'ቅዱስ ቁርዓን', 
        emoji: '📗', 
        etb: '250', 
        coins: 2500, 
        category: 'culture', 
        shortAm: 'የተቀደሰ ቁርዓን', 
        description: 'Embossed Arabic sacred Quran', 
        animationType: 'book',
        quickMessages: [
            '📗 አላህ መልካም ስራዎትን ይቀበልዎት፣ በበረከትና በስኬት ያድምቅዎት!',
            '📗 በቅዱሱ ቁርዓን ብርሃን ህይወትዎና ስራዎ ሁሌም የተባረከ ይሁን!',
            '📗 May Allah bless your efforts with abundant barakah, wisdom, and peace!',
            '📗 Sacred tribute of divine peace and honor for your inspiring talent!'
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
        shortAm: 'የጥልፍ ቀሚስ', 
        description: 'Handspun cotton with golden embroidery', 
        animationType: 'kemis',
        quickMessages: [
            '👗 ባህላዊው የሐበሻ ቀሚስ ጥልፍ እንደሚደምቀው፣ ስራዎም በኢትዮጵያዊ ውበት ያሸበረቀ ነው!',
            '👗 የጥበብ ልብስ ለብሰው ባህላችንን በክብር ስላደመቁልን ትልቅ ክብር አለን!',
            '👗 Elegant Habesha Kemis woven with cultural pride and graceful artistry!',
            '👗 Shining with the timeless golden embroidery of Ethiopian heritage!'
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
        shortAm: 'የአድዋ ጋሻ', 
        description: 'Adwa hero leather & brass shield', 
        animationType: 'shield',
        quickMessages: [
            '🛡️ የዓድዋ ጀግኖች ጋሻና ጦር ወኔ ሁሌም ከስራዎ ጋር ይሁን! አሸናፊ ነዎት!',
            '🛡️ ጠንካራ ጋሻ ሆነው ጥበብንና ባህልን ስለሚያስከብሩልን ከልብ እናመሰግናለን!',
            '🛡️ Warrior Shield of heritage and unbreakable resilience for our champion!',
            '🛡️ Victorious defense and enduring strength for your creative journey!'
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
        shortAm: 'የንጉሠ ነገሥት ዘውድ', 
        description: 'Imperial Ethiopian royal crown', 
        animationType: 'regal',
        quickMessages: [
            '👑 ለታታሪውና ለተዋጣለት ፈጣሪ ንጉሣዊ የክብር ዘውድ ይገባዎታል!',
            '👑 በስራዎ ንጉሥ ነዎት! ይህ የንጉሥ ዘውድ የላቀ ክብርና አድናቆቴ መግለጫዬ ነው!',
            '👑 Crowning your brilliance! You rule your creative craft with pure excellence!',
            '👑 Royal tribute to the master of content—wear your crown with pride!'
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
        shortAm: 'የላቀ የሀገር ክብር', 
        description: 'Highest Ethiopian civilian medal', 
        animationType: 'regal',
        quickMessages: [
            '🏅 ለሀገርና ለወገን በፈጠራ ስራዎ ላበረከቱት አስተዋፅዖ የከበረ የሀገር ሜዳልያ ይገባዎታል!',
            '🏅 በስራዎ ሀገራችንን በኩራት ስላስጠሩልን ታላቅ የክብር ሰላምታ እናቀርባለን!',
            '🏅 Conferred with highest National Honor and heartfelt gratitude from Ethiopia!',
            '🏅 The supreme golden medal of civic achievement for an outstanding creator!'
        ]
    },

    // 🪘 Traditional Music
    { 
        id: 'kebero', 
        nameEn: 'Kebero Drum', 
        nameAm: 'ባህላዊ ከበሮ', 
        emoji: '🪘', 
        etb: '300', 
        coins: 3000, 
        category: 'music', 
        shortAm: 'የበዓል ከበሮ', 
        description: 'Double-headed ceremonial wooden drum', 
        animationType: 'kebero',
        quickMessages: [
            '🪘 የከበሮው ምት የኢትዮጵያን ደስታ እንደሚቀሰቅስ፣ የርስዎም ፈጠራ ደስታችን ነው!',
            '🪘 በደመቀው የከበሮ ድምፅና እስክስታ በስራዎ እንደሰታለን! በርቱልን!',
            '🪘 Ceremonial Kebero rhythm beating with joy and energy for your art!',
            '🪘 The joyful heartbeat of Ethiopian culture cheering for your success!'
        ]
    },
    { 
        id: 'masenqo', 
        nameEn: 'Masenqo', 
        nameAm: 'ማሲንቆ', 
        emoji: '🎻', 
        etb: '500', 
        coins: 5000, 
        category: 'music', 
        shortAm: 'የአዝማሪ ማሲንቆ', 
        description: 'Single-string diamond-shaped bowed lute', 
        animationType: 'masenqo',
        quickMessages: [
            '🎻 የአዝማሪው ማሲንቆ ቃና ልብ እንደሚነካ፣ የርስዎም የፈጠራ ስራ ነፍስ ያድሳል!',
            '🎻 አንድ ክር ሆኖ ውብ ዜማ በሚያወጣው ማሲንቆ ስም ጥበብዎ ይባረክ!',
            '🎻 Soulful single-string Masenqo melody celebrating your artistic spirit!',
            '🎻 The authentic voice of Ethiopian highlands singing praises for your craft!'
        ]
    },
    { 
        id: 'krar', 
        nameEn: 'Traditional Krar', 
        nameAm: 'ባህላዊ ክራር', 
        emoji: '🎸', 
        etb: '800', 
        coins: 8000, 
        category: 'music', 
        shortAm: 'ባለ 6 ክር ክራር', 
        description: 'Six-string Ethiopian bowl lyre', 
        animationType: 'krar',
        quickMessages: [
            '🎸 የአባቶች ክራር ቃና እንደሚያስደስተን ሁሉ፣ የርስዎም ጥበብ ልዩ ትውስታ ያኖራል!',
            '🎸 በባህላዊው ክራር ዜማ ለታታሪው ስራዎ ያለንን ክብርና ፍቅር እንገልጻለን!',
            '🎸 Vibrant highland Krar strings strumming with inspiration for you!',
            '🎸 Resonating with ancient acoustic energy and modern creative flair!'
        ]
    },

    // 🏛️ Historical Landmarks
    { 
        id: 'axum', 
        nameEn: 'Axum Obelisk', 
        nameAm: 'የአክሱም ሐውልት', 
        emoji: '🏛️', 
        etb: '3000', 
        coins: 30000, 
        category: 'places', 
        shortAm: 'የጥንቱ አክሱም', 
        description: 'Ancient monolithic granite stele', 
        animationType: 'monument',
        quickMessages: [
            '🏛️ እንደ ጥንታዊው የአክሱም ሐውልት በጽናትና በክብር ሺህ ዓመታት ዘልቀው ይኑሩ!',
            '🏛️ የታሪካችንና የኩራታችን መገለጫ በሆነው አክሱም ስም ታላቅ ክብር አለን!',
            '🏛️ Standing tall, unbreakable, and monumental like the granite of Axum!',
            '🏛️ Ancient stone heritage honoring your lasting legacy in the digital era!'
        ]
    },
    { 
        id: 'lalibela', 
        nameEn: 'Bet Giyorgis', 
        nameAm: 'ቤተ ጊዮርጊስ', 
        emoji: '⛪', 
        etb: '4000', 
        coins: 40000, 
        category: 'places', 
        shortAm: 'የላሊበላ ፍልፍል', 
        description: 'Cross-shaped monolithic rock church', 
        animationType: 'monument',
        quickMessages: [
            '⛪ ከድንጋይ እንደተፈለፈለው የላሊበላ ድንቅ ህንፃ፣ የርስዎም ጥበብ ድንቅ ተአምር ነው!',
            '⛪ በቅዱሱ የላሊበላ አብያተ ክርስቲያናት ጥበብና በረከት ስራዎ ይደምቅ!',
            '⛪ Rock-hewn Lalibela wonder honoring your devotion, faith, and patience!',
            '⛪ Architectural masterpiece of the highlands dedicated to your genius!'
        ]
    },
    { 
        id: 'gondar', 
        nameEn: 'Fasil Ghebbi', 
        nameAm: 'ፋሲል ግቢ', 
        emoji: '🏰', 
        etb: '5000', 
        coins: 50000, 
        category: 'places', 
        shortAm: 'የጎንደር ቤተ-መንግሥት', 
        description: 'Royal stone castle fortress', 
        animationType: 'gondar',
        quickMessages: [
            '🏰 እንደ ፋሲል ግቢ ቤተ-መንግሥት የፈጠራ ማማዎ የፀናና ግርማ ሞገስ ያለው ይሁን!',
            '🏰 የጎንደር ነገሥታት የጥበብ ታሪክ ለስራዎ ታላቅ ክብርና መነሳሳት ይሁንልን!',
            '🏰 Imperial Gondar Castle majesty for a creator building an empire of greatness!',
            '🏰 Royal stone fortress of excellence guarding your continuous success!'
        ]
    },
    { 
        id: 'erta_ale', 
        nameEn: 'Erta Ale Volcano', 
        nameAm: 'ኤርታ አሌ', 
        emoji: '🌋', 
        etb: '6000', 
        coins: 60000, 
        category: 'places', 
        shortAm: 'የዳሎል እሳተ ጎመራ', 
        description: 'Active bubbling basaltic lava lake', 
        animationType: 'volcano',
        quickMessages: [
            '🌋 እንደ ኤርታ አሌ እሳተ ጎመራ የፈጠራ ወኔዎ ሁሌም እየፈላ ወደ ዓለም ይፍሰስ!',
            '🌋 የሚያንቦገቡግ የእሳት ሃይልና ፅናት ለታላቅ ስራዎ ይሁንልዎ!',
            '🌋 Boiling magma passion and volcanic creative brilliance erupting forward!',
            '🌋 The eternal fire of Erta Ale fueling your unstoppable ambition!'
        ]
    },

    // 🦁 Endemic Wildlife
    { 
        id: 'walia', 
        nameEn: 'Walia Ibex', 
        nameAm: 'ዋልያ አይቤክስ', 
        emoji: '🐐', 
        etb: '2500', 
        coins: 25000, 
        category: 'nature', 
        shortAm: 'የስሜን ተራራ ዋልያ', 
        description: 'Rare endemic Simien ibex', 
        animationType: 'walia',
        quickMessages: [
            '🐐 እንደ ዋልያ በሰሜን ተራሮች ገደላማ ጫፍ ላይ በፅናትና በቅልጥፍና ይብረሩ!',
            '🐐 ብርቅዬው የኢትዮጵያ ሀብት ዋልያ እንደሆነው፣ ርስዎም ለጥበብ ዓለም ብርቅዬ ነዎት!',
            '🐐 Rare Simien Walia agility conquering the highest highland peaks!',
            '🐐 Majestic mountain spirit of endurance and highland distinction!'
        ]
    },
    { 
        id: 'horse', 
        nameEn: 'Oromo Horse', 
        nameAm: 'የፈረሰኛ ፈረስ', 
        emoji: '🏇', 
        etb: '3500', 
        coins: 35000, 
        category: 'nature', 
        shortAm: 'የጀግና ፈረስ', 
        description: 'Majestic ceremonial war steed', 
        animationType: 'horse',
        quickMessages: [
            '🏇 እንደ አበው የፈረስ ጉልበት በድልና በጀግንነት ወደፊት ይጋልቡ! ማንም አያስቆምዎትም!',
            '🏇 የዓድዋ ፈረሰኞች ወኔና ብርታት ሁሌም በስራዎ ላይ ይንፀባረቅ!',
            '🏇 Galloping with thunderous speed and noble courage towards victory!',
            '🏇 Unstoppable equestrian power and heroic stride for our leader!'
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
        shortAm: 'ግርማ ሞገስ', 
        description: 'Black-maned Ethiopian lion', 
        animationType: 'lion',
        quickMessages: [
            '🦁 እንደ ይሁዳ አንበሳ በግርማ ሞገስና በጽናት ሁሌም በሙያዎ አሸናፊ ይሁኑ!',
            '🦁 የአንበሳ ልብና ጥንካሬ ይስጥዎት! ሁሌም ከጎንዎ ነን ጀግናችን!',
            '🦁 True Lion of Judah energy and regal pride for an extraordinary creator!',
            '🦁 Roaring with unstoppable Ethiopian strength and supreme creativity!'
        ]
    },

    // 🚀 Modern Aspirations
    { 
        id: 'diamond', 
        nameEn: 'African Diamond', 
        nameAm: 'አልማዝ', 
        emoji: '💎', 
        etb: '7000', 
        coins: 70000, 
        category: 'modern', 
        shortAm: 'የከበረ ዕንቁ', 
        description: 'Brilliant cut gemstone', 
        animationType: 'diamond',
        quickMessages: [
            '💎 በከበረ አልማዝ ጥንካሬና ውበት ጥበብዎ በደመቀ አንፀባራቂ ብርሃን ይብራ!',
            '💎 እውነተኛ አልማዝ የሆነ ፈጣሪ ነዎት! በዋጋ የማይተመን ስራዎን እናደንቃለን!',
            '💎 Flawless crystalline brilliance and unmatched sparkle for your genius!',
            '💎 Shining through every facet with radiant elegance and distinction!'
        ]
    },
    { 
        id: 'car', 
        nameEn: 'Addis Supercar', 
        nameAm: 'ስፖርት መኪና', 
        emoji: '🏎️', 
        etb: '15000', 
        coins: 150000, 
        category: 'modern', 
        shortAm: 'ፈጣን መኪና', 
        description: 'High-speed luxury sports car', 
        animationType: 'car',
        quickMessages: [
            '🏎️ በአዲስ አበባ ጎዳናዎች በከፍተኛ ፍጥነት እንደሚበር ስፖርት መኪና ወደፊት ይንደፉ!',
            '🏎️ በፈጣን ጉዞና በከፍተኛ ብቃት ወደ ስኬት ማማ ይብረሩ! ማንም አይቀድምዎትም!',
            '🏎️ Shifting into top gear! You are unstoppable on the fast track of success!',
            '🏎️ Addis Supercar horsepower for your incredible talent and work ethic!'
        ]
    },
    { 
        id: 'plane', 
        nameEn: 'Boeing 787', 
        nameAm: 'የኢትዮጵያ አውሮፕላን', 
        emoji: '✈️', 
        etb: '25000', 
        coins: 250000, 
        category: 'modern', 
        shortAm: 'የበረራ ንግሥት', 
        description: 'Ethiopian Airlines flagship jet', 
        animationType: 'plane',
        quickMessages: [
            '✈️ እንደ ታላቁ የኢትዮጵያ አየር መንገድ አውሮፕላን ከአድማስ ማዶ ወደ ዓለም ከፍታ ይብረሩ!',
            '✈️ ጥበብዎ ድንበር ተሻግሮ ዓለምን እንዲያዳርስ ምኞቴ ነው! ወደፊት ይብረሩ!',
            '✈️ Flying first-class to global horizons! The sky is not the limit for you!',
            '✈️ Boeing 787 altitude for your soaring dreams and unstoppable ambition!'
        ]
    },
    { 
        id: 'satellite', 
        nameEn: 'ETRSS-1 Satellite', 
        nameAm: 'ኢትዮጵያ ሳተላይት', 
        emoji: '🛰️', 
        etb: '50000', 
        coins: 500000, 
        category: 'modern', 
        shortAm: 'የጠፈር መንኮራኩር', 
        description: 'Ethiopian Earth observation satellite', 
        animationType: 'satellite',
        quickMessages: [
            '🛰️ የመጀመርያዋ የኢትዮጵያ ሳተላይት ETRSS-1 በጠፈር እንደምትበረው፣ ወደ ጠፈር ከፍታ ይብረሩ!',
            '🛰️ የቴክኖሎጂና የፈጠራ ድንበር ሰባሪ ሆነው ስለሚያበሩልን ትልቅ ክብር አለን!',
            '🛰️ Orbiting in outer space with high-tech vision and Ethiopian ambition!',
            '🛰️ ETRSS-1 telemetry sending cosmic applause to our innovative star!'
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
                background: 'transparent',
                overflow: 'visible'
            }}
        >
            {/* Background Ambient Light Aura Behind Sacred Books & Lion */}
            {(id === 'bible' || id === 'quran') && (
                <div className={`book-sacred-glow ${id === 'quran' ? 'emerald' : 'gold'}`} />
            )}
            {id === 'anbessa' && (
                <div className="lion-mane-glow" />
            )}

            {/* Visual Frame for PNG/JPG Image or Fallback Emoji */}
            <div 
                className="eth-gift-image-frame"
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    position: 'relative',
                    zIndex: 2
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

            {/* FOREGROUND LIVING GRAPHICAL MOTION & PARTICLE OVERLAYS (zIndex: 10) */}
            {/* 1. Addis Supercar: Drifting Tire Smoke Billowing Clouds */}
            {animated && id === 'car' && (
                <div className={`gift-fx-car-smoke ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="smoke-puff p1" />
                    <span className="smoke-puff p2" />
                    <span className="smoke-puff p3" />
                </div>
            )}

            {/* 2. Ethiopian Jet: High-Altitude Contrail Streams & Cloud Wisps */}
            {animated && id === 'plane' && (
                <div className={`gift-fx-plane-clouds ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="contrail-stream c1" />
                    <span className="contrail-stream c2" />
                    <span className="flight-cloud f1" />
                </div>
            )}

            {/* 3. Clay Jebena: Coffee Pouring Liquid Stream & Steam Curls */}
            {animated && id === 'jebena' && (
                <div className={`gift-fx-pour ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <svg className="pour-stream-svg" viewBox="0 0 32 38" fill="none">
                        <path className="coffee-flow-path" d="M10 6 C 14 16, 17 24, 21 34" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" />
                        <path className="coffee-flow-highlight" d="M10 6 C 14 16, 17 24, 21 34" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="pour-drop d1" />
                    <div className="gift-fx-steam in-jebena">
                        <svg className="steam-svg" viewBox="0 0 36 36" fill="none">
                            <path d="M12 24C10 18 14 14 12 8" stroke="rgba(160,174,192,0.75)" strokeWidth="2" strokeLinecap="round" className="steam-path p1" />
                            <path d="M19 26C17 19 21 15 19 9" stroke="rgba(160,174,192,0.85)" strokeWidth="2.2" strokeLinecap="round" className="steam-path p2" />
                        </svg>
                    </div>
                </div>
            )}

            {/* 4. Sini Buna, Rekebot & Enjera: Continuous Aromatic Steam Wisps */}
            {animated && ['buna', 'rekebot', 'enjera'].includes(id) && (
                <div className={`gift-fx-steam ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <svg className="steam-svg" viewBox="0 0 36 36" fill="none">
                        <path d="M10 26C8 20 12 15 10 10C8 7 11 3 10 1" stroke="rgba(160,174,192,0.7)" strokeWidth="2" strokeLinecap="round" className="steam-path p1" />
                        <path d="M18 28C16 21 20 16 18 11C16 7 19 4 18 1" stroke="rgba(160,174,192,0.8)" strokeWidth="2.2" strokeLinecap="round" className="steam-path p2" />
                        <path d="M26 26C24 20 28 15 26 10C24 7 27 3 26 1" stroke="rgba(160,174,192,0.7)" strokeWidth="2" strokeLinecap="round" className="steam-path p3" />
                    </svg>
                </div>
            )}

            {/* 5. Adey Abeba & Highland Rose: Blooming Golden Pollen & Sparkles */}
            {animated && ['adey_abeba', 'rose'].includes(id) && (
                <div className={`gift-fx-bloom-pollen ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="pollen-dot p1" />
                    <span className="pollen-dot p2" />
                    <span className="pollen-dot p3" />
                    <span className="pollen-sparkle s1">✧</span>
                </div>
            )}

            {/* 6. Kebero Drum: Rhythmic Radiating Sonic Acoustic Rings */}
            {animated && id === 'kebero' && (
                <div className={`gift-fx-kebero-wave ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="sonic-ring ring1" />
                    <span className="sonic-ring ring2" />
                </div>
            )}

            {/* 7. Masenqo & Krar: Harmonic Strings Vibration & Floating Notes */}
            {animated && ['masenqo', 'krar'].includes(id) && (
                <div className={`gift-fx-string-waves ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="vibe-line v1" />
                    <span className="vibe-line v2" />
                    <span className="music-note n1">♪</span>
                </div>
            )}

            {/* 8. Axum, Lalibela & Gondar: Sunlit Golden Sheen Beam Sweep */}
            {animated && ['axum', 'lalibela', 'gondar'].includes(id) && (
                <div className={`gift-fx-golden-sheen ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <div className="sheen-sweep-bar" />
                </div>
            )}

            {/* 9. Diamond, Crown & National Honor: Crystalline Star Sparkles */}
            {animated && ['diamond', 'crown', 'national_honor'].includes(id) && (
                <div className={`gift-fx-sparkle-stars ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="sparkle-star s1">✦</span>
                    <span className="sparkle-star s2">✧</span>
                    <span className="sparkle-star s3">✦</span>
                </div>
            )}

            {/* 10. ETRSS-1 Satellite: Radar Telemetry Waves */}
            {animated && id === 'satellite' && (
                <div className={`gift-fx-satellite-signal ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="sat-ping p1" />
                    <span className="sat-ping p2" />
                </div>
            )}

            {/* 11. Erta Ale Volcano: Bubbling Magma Glow & Floating Embers */}
            {animated && id === 'erta_ale' && (
                <div className={`gift-fx-volcano-embers ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="ember-spark e1" />
                    <span className="ember-spark e2" />
                    <span className="ember-spark e3" />
                </div>
            )}

            {/* 12. Warrior Shield: Metallic Gleam Flash */}
            {animated && id === 'shield' && (
                <div className={`gift-fx-shield-sheen ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <div className="shield-gleam-bar" />
                </div>
            )}

            {/* 13. Habesha Kemis & Mesob: Golden Embroidery Shimmer */}
            {animated && ['kemis', 'mesob'].includes(id) && (
                <div className={`gift-fx-kemis-shimmer ${isSelected ? 'is-selected' : 'in-place'}`} aria-hidden="true">
                    <span className="kemis-sparkle k1">✦</span>
                    <span className="kemis-sparkle k2">✧</span>
                </div>
            )}
        </div>
    );
};


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
