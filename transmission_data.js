// ==========================================
// Fichier: js/data/transmission_data.js
// ==========================================

// 1. DÉFINITION DES THÈMES VISUELS
// Ces couleurs guident l'œil pour distinguer les disciplines instantanément.
const SILSILA_THEMES = {
    hadith: { 
        label: "Hadiths", 
        color: "text-purple-700", 
        bg: "bg-purple-50", 
        border: "border-purple-200", 
        btn: "bg-purple-600",
        icon: "scroll"
    },
    fiqh: { 
        label: "Fiqh (Droit)", 
        color: "text-emerald-700", 
        bg: "bg-emerald-50", 
        border: "border-emerald-200", 
        btn: "bg-emerald-600",
        icon: "scale"
    },
    quran: { 
        label: "Lectures (Qira'at)", 
        color: "text-amber-700", 
        bg: "bg-amber-50", 
        border: "border-amber-200", 
        btn: "bg-amber-600",
        icon: "book-open"
    },
    pre: { 
        label: "Salaf (Anciens)", 
        color: "text-slate-600", 
        bg: "bg-slate-50", 
        border: "border-slate-200", 
        btn: "bg-slate-500",
        icon: "history"
    }
};

// 2. DONNÉES DE TRANSMISSION (Arbre Généalogique du Savoir)
const SILSILA_DATA = {
    nodes: [
        // ==========================================
        // GÉNÉRATION 0 : LA SOURCE & LES COMPAGNONS
        // ==========================================
        { 
            id: 1, 
            label: 'Le Prophète (ﷺ)', 
            arabicName: 'محمد رسول الله',
            group: 'pre', 
            role: "Sceau des Prophètes", 
            bio: "La source unique de la Révélation (Coran) et de la Sagesse (Sunnah). Tous les chaînes de transmission remontent à sa noble personne." 
        },
        { 
            id: 2, 
            label: 'Abdullah Ibn Omar', 
            arabicName: 'عبد الله بن عمر',
            group: 'pre', 
            role: "Sahabi (Compagnon)", 
            bio: "Le plus rigoureux des Compagnons dans le suivi des traces du Prophète. Il est le pilier de l'école de Médine." 
        },
        { 
            id: 3, 
            label: 'Abdullah Ibn Masoud', 
            arabicName: 'عبد الله بن مسعود',
            group: 'pre', 
            role: "Sahabi (Compagnon)", 
            bio: "Envoyé à Koufa (Irak) par Omar ibn al-Khattab pour enseigner. Il est le père spirituel de l'école Hanafite et des lecteurs de Koufa." 
        },
        { 
            id: 4, 
            label: 'Ibn Abbas', 
            arabicName: 'عبد الله بن عباس',
            group: 'pre', 
            role: "Hibr al-Ummah", 
            bio: "L'interprète du Coran par excellence et l'océan de savoir de cette communauté." 
        },

        // ==========================================
        // GÉNÉRATION 1 : LES TABI'UN (SUIVANTS)
        // ==========================================
        { 
            id: 20, 
            label: 'Nafi', 
            arabicName: 'نافع المدني',
            group: 'pre', 
            role: "L'Affranchi", 
            bio: "L'élève principal d'Ibn Omar. Malik disait : 'Si j'entends Nafi d'après Ibn Omar, je ne me soucie pas de ne pas l'avoir entendu d'un autre'. C'est la Chaîne d'Or." 
        },
        { 
            id: 21, 
            label: 'Al-Zuhri', 
            arabicName: 'ابن شهاب الزهري',
            group: 'hadith', 
            role: "Le Compilateur", 
            bio: "Le premier à avoir officiellement compilé les Hadiths sous l'ordre du calife Omar ibn Abdul-Aziz." 
        },
        { 
            id: 22, 
            label: 'Al-Nakha\'i', 
            arabicName: 'إبراهيم النخعي',
            group: 'fiqh', 
            role: "Faqih de Koufa", 
            bio: "Le grand juriste de l'Irak qui a structuré l'enseignement d'Ibn Masoud." 
        },
        { 
            id: 23, 
            label: 'Hammad b. Abi Sulayman', 
            arabicName: 'حماد بن أبي سليمان',
            group: 'fiqh', 
            role: "Cheikh al-Iraq", 
            bio: "Le maître qui a formé Abu Hanifa pendant 18 ans. Il enseignait par la méthode du débat participatif." 
        },

        // ==========================================
        // BRANCHE 1 : LES IMAMS DU FIQH (JURISPRUDENCE)
        // ==========================================
        { 
            id: 10, 
            label: 'Imam Abu Hanifa', 
            arabicName: 'أبو حنيفة النعمان',
            group: 'fiqh', 
            role: "Imam Al-A'zam", 
            bio: "Le fondateur de l'école de la Raison (Ahl al-Ra'y). Connu pour son intelligence aiguë, son usage de l'analogie (Qiyas) et sa piété scrupuleuse dans le commerce." 
        },
        { 
            id: 11, 
            label: 'Imam Malik', 
            arabicName: 'مالك بن أنس',
            group: 'fiqh', 
            role: "Imam Dar al-Hijrah", 
            bio: "L'Imam de Médine. Il ne donnait jamais cours de Hadith sans avoir fait ses ablutions et mis ses plus beaux vêtements par respect pour la parole du Prophète." 
        },
        { 
            id: 12, 
            label: 'Imam Shafi\'i', 
            arabicName: 'محمد بن إدريس الشافعي',
            group: 'fiqh', 
            role: "Nasir al-Sunnah", 
            bio: "L'architecte des fondements du droit (Usul al-Fiqh). Il a réuni l'école du Hadith (Malik) et l'école de la Raison (Élèves d'Abu Hanifa)." 
        },
        { 
            id: 13, 
            label: 'Imam Ahmad', 
            arabicName: 'أحمد بن حنبل',
            group: 'fiqh', 
            role: "Imam Ahl al-Sunnah", 
            bio: "Le héros de l'épreuve (Mihna). Il a mémorisé un million de hadiths et a refusé de céder sur le dogme malgré la torture." 
        },
        { 
            id: 14, 
            label: 'Abu Yusuf', 
            arabicName: 'أبو يوسف',
            group: 'fiqh', 
            role: "Qadi al-Qudat", 
            bio: "Le premier Grand Juge de l'histoire de l'Islam et le plus grand élève d'Abu Hanifa. Il a codifié l'école hanafite." 
        },
        { 
            id: 15, 
            label: 'Al-Shaybani', 
            arabicName: 'محمد بن الحسن الشيباني',
            group: 'fiqh', 
            role: "Le Scribe", 
            bio: "L'élève d'Abu Hanifa et professeur de Shafi'i. Ses livres (Zahir al-Riwaya) sont la référence absolue du Hanafisme." 
        },

        // ==========================================
        // BRANCHE 2 : LES MONTAGNES DU HADITH
        // ==========================================
        { 
            id: 41, 
            label: 'Al-Bukhari', 
            arabicName: 'محمد بن إسماعيل البخاري',
            group: 'hadith', 
            role: "Amir al-Mu'minin", 
            bio: "L'auteur du livre le plus authentique après le Coran. Il voyageait des milliers de kilomètres pour vérifier un seul hadith." 
        },
        { 
            id: 42, 
            label: 'Muslim', 
            arabicName: 'مسلم بن الحجاج',
            group: 'hadith', 
            role: "L'Élève Fidèle", 
            bio: "Disciple de Bukhari, son Sahih est réputé pour sa structure exceptionnelle et la rigueur de ses chaînes." 
        },
        { 
            id: 43, 
            label: 'Abu Dawud', 
            arabicName: 'أبو داود السجستاني',
            group: 'hadith', 
            role: "Maître des Sunan", 
            bio: "Il s'est concentré sur les hadiths juridiques (Ahkam). Son livre est indispensable aux juristes." 
        },
        { 
            id: 44, 
            label: 'At-Tirmidhi', 
            arabicName: 'أبو عيسى الترمذي',
            group: 'hadith', 
            role: "Le Critique", 
            bio: "Son Jami' est célèbre pour expliquer les avis des juristes après chaque hadith et classer la fiabilité des narrateurs." 
        },
        { 
            id: 45, 
            label: 'An-Nasa\'i', 
            arabicName: 'أحمد بن شعيب النسائي',
            group: 'hadith', 
            role: "Le Rigoureux", 
            bio: "Ses conditions d'acceptation des hadiths étaient, selon certains savants, encore plus strictes que celles de Muslim." 
        },
        { 
            id: 46, 
            label: 'Ibn Majah', 
            arabicName: 'ابن ماجه',
            group: 'hadith', 
            role: "Le Sixième", 
            bio: "Son livre complète les 'Six Mères' (Kutub as-Sitta) avec des hadiths rares (Zawa'id) d'une grande valeur." 
        },
        { 
            id: 47, 
            label: 'Ishaq ibn Rahwayh', 
            arabicName: 'إسحاق بن راهويه',
            group: 'hadith', 
            role: "L'Inspirateur", 
            bio: "Le maître qui a suggéré à Bukhari l'idée de compiler un livre contenant uniquement des hadiths authentiques." 
        },
        { 
            id: 48, 
            label: 'Yahya ibn Ma\'in', 
            arabicName: 'يحيى بن معين',
            group: 'hadith', 
            role: "L'Expert", 
            bio: "Le spécialiste incontesté de la critique des hommes (Jarh wa Ta'dil) et ami intime de l'Imam Ahmad." 
        },

        // ==========================================
        // BRANCHE 3 : LES LECTEURS DU CORAN (QURRA)
        // ==========================================
        { 
            id: 60, 
            label: 'Nafi Al-Madani', 
            arabicName: 'نافع المدني',
            group: 'quran', 
            role: "Imam de Médine", 
            bio: "Le lecteur de la ville du Prophète. On sentait le musc sortir de sa bouche quand il récitait, car le Prophète lui avait postillonné dans la bouche en rêve." 
        },
        { 
            id: 61, 
            label: 'Warsh', 
            arabicName: 'ورش',
            group: 'quran', 
            role: "L'Égyptien", 
            bio: "Othman al-Misri, surnommé 'Warsh' par son maître Nafi pour sa blancheur. Sa lecture est répandue au Maghreb." 
        },
        { 
            id: 62, 
            label: 'Qalun', 
            arabicName: 'قالون',
            group: 'quran', 
            role: "Le Médinois", 
            bio: "Beau-fils de Nafi et son élève principal. Il était sourd mais entendait miraculeusement la récitation du Coran pour la corriger." 
        },
        { 
            id: 63, 
            label: 'Asim', 
            arabicName: 'عاصم بن أبي النجود',
            group: 'quran', 
            role: "Imam de Koufa", 
            bio: "Sa chaîne de transmission est considérée comme l'une des plus nobles, passant par Ali ibn Abi Talib et Ibn Masoud." 
        },
        { 
            id: 64, 
            label: 'Hafs', 
            arabicName: 'حفص بن سليمان',
            group: 'quran', 
            role: "Le Transmetteur", 
            bio: "Beau-fils d'Asim. Sa transmission est la plus répandue dans le monde musulman aujourd'hui." 
        },
        { 
            id: 65, 
            label: 'Shu\'ba', 
            arabicName: 'شعبة',
            group: 'quran', 
            role: "Le Premier Élève", 
            bio: "L'autre grand transmetteur de la lecture d'Asim, connu pour son ascétisme." 
        }
    ],

    edges: [
        // --- CONNEXIONS FIQH ---
        { from: 1, to: 2 }, // Prophète -> Ibn Omar
        { from: 1, to: 3 }, // Prophète -> Ibn Masoud
        
        // Chaîne Irakienne (Hanafi)
        { from: 3, to: 22 }, // Ibn Masoud -> Nakha'i
        { from: 22, to: 23 }, // Nakha'i -> Hammad
        { from: 23, to: 10 }, // Hammad -> Abu Hanifa
        { from: 10, to: 14 }, // Abu Hanifa -> Abu Yusuf
        { from: 10, to: 15 }, // Abu Hanifa -> Shaybani
        
        // Chaîne Médinoise (Maliki / Shafi'i)
        { from: 2, to: 20 }, // Ibn Omar -> Nafi
        { from: 20, to: 11 }, // Nafi -> Malik
        { from: 21, to: 11 }, // Zuhri -> Malik
        { from: 11, to: 12 }, // Malik -> Shafi'i
        { from: 15, to: 12 }, // Shaybani -> Shafi'i (Le pont Irak-Médine)
        { from: 12, to: 13 }, // Shafi'i -> Ahmad

        // --- CONNEXIONS HADITH ---
        { from: 13, to: 41 }, // Ahmad -> Bukhari
        { from: 13, to: 43 }, // Ahmad -> Abu Dawud
        { from: 47, to: 41 }, // Ishaq -> Bukhari (L'idée du Sahih)
        { from: 48, to: 41 }, // Yahya -> Bukhari
        { from: 41, to: 42 }, // Bukhari -> Muslim
        { from: 41, to: 44 }, // Bukhari -> Tirmidhi
        { from: 41, to: 45 }, // Bukhari -> Nasai

        // --- CONNEXIONS CORAN ---
        { from: 2, to: 60 }, // Ibn Omar -> Nafi (Lecture)
        { from: 60, to: 61 }, // Nafi -> Warsh
        { from: 60, to: 62 }, // Nafi -> Qalun
        
        { from: 3, to: 63 }, // Ibn Masoud -> Asim (Via Zirr, simplifié ici)
        { from: 63, to: 64 }, // Asim -> Hafs
        { from: 63, to: 65 }  // Asim -> Shu'ba
    ]
};