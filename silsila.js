/**
 * SILSILA_DATA
 * Base de données relationnelle des savants (Hadith, Fiqh, Coran).
 * Période : 1er - 3ème siècle de l'Hégire.
 */

const SILSILA_DATA = [

    // =========================================================================
    // SECTION 1 : HADITH (La Chaîne d'Or et les 6 Livres)
    // =========================================================================

    // --- GÉNÉRATION 1 : Les Piliers (Tabi'un Majeurs & Atba) ---
    {
        id: "zuhri",
        category: "hadith",
        chapterId: 0,
        name: "Ibn Shihab Al-Zuhri",
        arabicName: "محمد بن شهاب الزهري",
        role: "Le Pionnier",
        desc: "Le premier à avoir officiellement compilé les hadiths sur ordre du calife Umar II. Une mémoire photographique légendaire.",
        teachers: ["anas_malik", "ibn_umar"], // Sahaba (à créer si besoin)
        students: ["malik", "sufyan_thawri", "layth"]
    },
    {
        id: "sufyan_thawri",
        category: "hadith",
        chapterId: 0,
        name: "Sufyan At-Thawri",
        arabicName: "سفيان الثوري",
        role: "Amir al-Mu'minin fil Hadith",
        desc: "L'ascète de Kufa. Il a refusé les postes de juge pour préserver sa religion. Un océan de science et de piété.",
        teachers: ["zuhri"],
        students: ["shu_ba", "yahya_qattan"]
    },
    {
        id: "shu_ba",
        category: "hadith",
        chapterId: 0,
        name: "Shu'ba ibn al-Hajjaj",
        arabicName: "شعبة بن الحجاج",
        role: "Le Vérificateur",
        desc: "Le premier à avoir critiqué les rapporteurs en Irak. Il disait : 'Ce hadith vous détourne du souvenir d'Allah'.",
        teachers: ["sufyan_thawri", "qatada"],
        students: ["yahya_qattan", "wakie"]
    },
    {
        id: "yahya_qattan",
        category: "hadith",
        chapterId: 0,
        name: "Yahya Al-Qattan",
        arabicName: "يحيى بن سعيد القطان",
        role: "Le Critique de Basra",
        desc: "Le maître de la critique (Jarh wa Ta'dil). Ahmad Ibn Hanbal a dit : 'Je n'ai jamais vu quelqu'un comme lui'.",
        teachers: ["shu_ba", "malik"],
        students: ["ahmad", "ali_madini", "yahya_main"]
    },
    {
        id: "wakie",
        category: "hadith",
        chapterId: 0,
        name: "Waki' ibn al-Jarrah",
        arabicName: "وكيع بن الجراح",
        role: "La Mémoire de Kufa",
        desc: "Le célèbre maître de Shafi'i (cité dans le poème sur la mémoire). Il ne dormait pas sans avoir révisé ses hadiths.",
        teachers: ["shu_ba", "sufyan_thawri"],
        students: ["ahmad", "shafi", "ishaq"]
    },

    // --- GÉNÉRATION 2 : Les Maîtres des 6 Imams ---
    {
        id: "ali_madini",
        category: "hadith",
        chapterId: 0,
        name: "Ali Ibn al-Madini",
        arabicName: "علي بن المديني",
        role: "L'Expert des 'Ilal",
        desc: "Bukhari a dit : 'Je ne me suis jamais senti petit devant personne, sauf devant Ali Ibn al-Madini'.",
        teachers: ["yahya_qattan"],
        students: ["bukhari", "abu_dawud"]
    },
    {
        id: "yahya_main",
        category: "hadith",
        chapterId: 0,
        name: "Yahya ibn Ma'in",
        arabicName: "يحيى بن معين",
        role: "Le Censeur",
        desc: "Il a écrit plus d'un million de hadiths pour en authentifier quelques milliers. Son 'Non' brisait des réputations.",
        teachers: ["yahya_qattan"],
        students: ["bukhari", "muslim", "abu_dawud"]
    },
    {
        id: "ishaq",
        category: "hadith",
        chapterId: 0,
        name: "Ishaq Ibn Rahwayh",
        arabicName: "إسحاق بن راهويه",
        role: "Le Compagnon d'Ahmad",
        desc: "C'est lui qui a suggéré l'idée du Sahih à Bukhari lors d'une assise. Un géant de la mémorisation.",
        teachers: ["wakie"],
        students: ["bukhari", "muslim", "tirmidhi", "nasai"]
    },

    // --- GÉNÉRATION 3 : Les Auteurs des 6 Livres (Kutub as-Sittah) ---
    {
        id: "bukhari",
        category: "hadith",
        chapterId: 0, // À lier avec doto.js plus tard
        name: "Imam Al-Bukhari",
        arabicName: "محمد بن إسماعيل البخاري",
        role: "L'Imam des Muhaddithins",
        desc: "Auteur du 'Jami' as-Sahih', le livre le plus authentique après le Coran. Il a voyagé des milliers de kilomètres à pied.",
        teachers: ["ishaq", "ali_madini", "yahya_main", "ahmad"],
        students: ["muslim", "tirmidhi"]
    },
    {
        id: "muslim",
        category: "hadith",
        chapterId: 0,
        name: "Imam Muslim",
        arabicName: "مسلم بن الحجاج",
        role: "L'Élève Fidèle",
        desc: "Auteur du deuxième Sahih. Il a défendu Bukhari lors de la Fitna de Nishapur et ne l'a jamais quitté.",
        teachers: ["bukhari", "ahmad", "ishaq"],
        students: ["tirmidhi"] // (Collègue cadet)
    },
    {
        id: "abu_dawud",
        category: "hadith",
        chapterId: 0,
        name: "Abu Dawud",
        arabicName: "أبو داود السجستاني",
        role: "Le Faqih du Hadith",
        desc: "Son livre 'Sunan' se concentre sur les hadiths juridiques (Ahkam). Il a présenté son livre à l'Imam Ahmad qui l'a approuvé.",
        teachers: ["ahmad", "yahya_main", "ali_madini"],
        students: ["nasai"]
    },
    {
        id: "tirmidhi",
        category: "hadith",
        chapterId: 0,
        name: "At-Tirmidhi",
        arabicName: "أبو عيسى الترمذي",
        role: "Le Classificateur",
        desc: "Auteur du 'Jami' (Sunan) où il classe les hadiths par degré (Sahih, Hassan, Gharib). Il est devenu aveugle à force de pleurer Bukhari.",
        teachers: ["bukhari", "muslim", "ishaq"],
        students: []
    },
    {
        id: "nasai",
        category: "hadith",
        chapterId: 0,
        name: "An-Nasa'i",
        arabicName: "أحمد بن شعيب النسائي",
        role: "Le Critique Sévère",
        desc: "Auteur d'Al-Mujtaba. Ses conditions d'authentification étaient parfois plus strictes que celles de Muslim.",
        teachers: ["ishaq", "abu_dawud"],
        students: []
    },
    {
        id: "ibn_majah",
        category: "hadith",
        chapterId: 0,
        name: "Ibn Majah",
        arabicName: "ابن ماجه القزويني",
        role: "Le Sixième Imam",
        desc: "Son livre contient des hadiths rares (Zawa'id) absents des 5 autres livres. Il clôture le canon des 6 livres.",
        teachers: ["ali_madini"], // (Élève indirect via les shuyukh de Kufa)
        students: []
    },

    // =========================================================================
    // SECTION 2 : FIQH (Les Fondateurs et les Écoles)
    // =========================================================================

    // --- LE HIJAZ (Médine / La Mecque) ---
    {
        id: "malik",
        category: "fiqh",
        chapterId: 0,
        name: "Imam Malik",
        arabicName: "مالك بن أنس",
        role: "L'Imam de la Demeure",
        desc: "Il ne montait jamais une monture à Médine par respect pour le sol où repose le Prophète. Auteur d'Al-Muwatta.",
        teachers: ["zuhri", "nafi"],
        students: ["shafi", "ibn_qasim", "yahya_qattan"]
    },
    {
        id: "ibn_qasim",
        category: "fiqh",
        chapterId: 0,
        name: "Ibn al-Qasim",
        arabicName: "عبد الرحمن بن القاسم",
        role: "Le Transmetteur",
        desc: "C'est grâce à lui que le Madhab Maliki s'est répandu au Maghreb. Compilateur de la 'Mudawwana'.",
        teachers: ["malik"],
        students: ["sahnun"]
    },
    {
        id: "sahnun",
        category: "fiqh",
        chapterId: 0,
        name: "Imam Sahnun",
        arabicName: "سحنون بن سعيد",
        role: "Le Juge de Kairouan",
        desc: "Il a structuré l'école Malikite en Tunisie. Un juge (Qadi) connu pour sa justice inflexible.",
        teachers: ["ibn_qasim"],
        students: []
    },

    // --- L'IRAK (Kufa / Bagdad) ---
    {
        id: "abu_hanifa",
        category: "fiqh",
        chapterId: 0,
        name: "Abu Hanifa",
        arabicName: "أبو حنيفة النعمان",
        role: "Al-Imam Al-A'zam",
        desc: "Fondateur de l'école de la raison (Ra'y). Connu pour sa piété nocturne et son intelligence déductive (Qiyas).",
        teachers: ["hammad"], // Hammad ibn Abi Sulayman
        students: ["abu_yusuf", "shaybani", "zufar"]
    },
    {
        id: "abu_yusuf",
        category: "fiqh",
        chapterId: 0,
        name: "Abu Yusuf",
        arabicName: "يعقوب بن إبراهيم",
        role: "Le Juge des Juges",
        desc: "Premier 'Qadi al-Qudat' de l'histoire sous Harun al-Rashid. Il a codifié le Fiqh Hanafite dans l'état.",
        teachers: ["abu_hanifa"],
        students: ["ahmad"] // (Ahmad a étudié le fiqh chez lui avant le hadith)
    },
    {
        id: "shaybani",
        category: "fiqh",
        chapterId: 0,
        name: "Muhammad al-Shaybani",
        arabicName: "محمد بن الحسن الشيباني",
        role: "Le Compilateur",
        desc: "Il a écrit les livres fondateurs (Zahir al-Riwaya). Professeur de Shafi'i, il a fait le lien entre Kufa et Médine.",
        teachers: ["abu_hanifa", "abu_yusuf", "malik"],
        students: ["shafi"]
    },

    // --- LA SYNTHÈSE (Égypte / Bagdad) ---
    {
        id: "shafi",
        category: "fiqh",
        chapterId: 500, // ID exemple donné précédemment
        name: "Imam Ash-Shafi'i",
        arabicName: "محمد بن إدريس الشافعي",
        role: "Le Renouveau",
        desc: "Il a unifié les Gens du Hadith et les Gens de l'Opinion. Auteur de 'Al-Risala' (fondements du droit).",
        teachers: ["malik", "shaybani", "wakie"],
        students: ["ahmad", "muzani", "buwayti", "rabi_muradi"]
    },
    {
        id: "muzani",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Muzani",
        arabicName: "إسماعيل المزني",
        role: "Le Champion",
        desc: "Shafi'i disait : 'Il est le champion de mon école'. Son 'Mukhtasar' est la base de tout le fiqh Shafi'ite.",
        teachers: ["shafi"],
        students: ["tahawi"]
    },
    {
        id: "ahmad",
        category: "fiqh",
        chapterId: 0,
        name: "Ahmad Ibn Hanbal",
        arabicName: "أحمد بن حنبل",
        role: "L'Imam de la Sunnah",
        desc: "Il a mémorisé un million de hadiths. Torturé pour avoir défendu que le Coran est la parole d'Allah.",
        teachers: ["shafi", "abu_yusuf", "yahya_qattan", "wakie"],
        students: ["bukhari", "muslim", "abu_dawud", "abdullah_ahmad"]
    },
    {
        id: "tahawi",
        category: "fiqh",
        chapterId: 0,
        name: "Imam At-Tahawi",
        arabicName: "أبو جعفر الطحاوي",
        role: "L'Encyclopédie",
        desc: "Neveu de Muzani, il a débuté Shafi'ite puis est devenu la référence Hanafite en Égypte. Auteur de la 'Aqida Tahawiya'.",
        teachers: ["muzani"], // Puis transition vers Hanafi
        students: []
    },

    // =========================================================================
    // SECTION 3 : CORAN (Les 7 Qira'at et leurs Rawa)
    // =========================================================================

    // --- LECTURE 1 : MÉDINE (Nafi) ---
    {
        id: "nafi",
        category: "quran",
        chapterId: 0,
        name: "Imam Nafi'",
        arabicName: "نافع المدني",
        role: "Le Lecteur de Médine",
        desc: "D'origine persane, il a lu le Coran devant 70 Tabi'un. Sa lecture est la plus répandue en Afrique du Nord.",
        teachers: ["abu_jafar"],
        students: ["qalun", "warsh"]
    },
    {
        id: "qalun",
        category: "quran",
        chapterId: 0,
        name: "Qalun",
        arabicName: "قالون",
        role: "Rapporteur de Nafi",
        desc: "Surnommé 'Qalun' (Le Beau/Bien) par Nafi en raison de la qualité de sa récitation. Il était sourd mais entendait le Coran.",
        teachers: ["nafi"],
        students: []
    },
    {
        id: "warsh",
        category: "quran",
        chapterId: 0,
        name: "Warsh",
        arabicName: "ورش",
        role: "Rapporteur de Nafi",
        desc: "Il a voyagé d'Égypte à Médine pour corriger sa lecture. Il avait la peau très blanche, d'où son surnom 'Warsh' (colombe).",
        teachers: ["nafi"],
        students: []
    },

    // --- LECTURE 2 : LA MECQUE (Ibn Kathir) ---
    {
        id: "ibn_kathir_qari",
        category: "quran",
        chapterId: 0,
        name: "Ibn Kathir Al-Makki",
        arabicName: "عبد الله بن كثير المكي",
        role: "Le Lecteur de la Mecque",
        desc: "Il a rencontré des Compagnons comme Anas ibn Malik. Sa lecture est douce et fluide.",
        teachers: ["mujahid"],
        students: ["bazzi", "qunbul"] // Via intermédiaires, mais traditionnellement associés
    },
    {
        id: "bazzi",
        category: "quran",
        chapterId: 0,
        name: "Al-Bazzi",
        arabicName: "أحمد بن محمد البزي",
        role: "Rapporteur d'Ibn Kathir",
        desc: "Le Muezzin de la Grande Mosquée de la Mecque. Un homme de grande piété.",
        teachers: ["ibn_kathir_qari"],
        students: []
    },
    {
        id: "qunbul",
        category: "quran",
        chapterId: 0,
        name: "Qunbul",
        arabicName: "محمد بن عبد الرحمن قنبل",
        role: "Rapporteur d'Ibn Kathir",
        desc: "Chef des lecteurs du Hijaz à son époque.",
        teachers: ["ibn_kathir_qari"],
        students: []
    },

    // --- LECTURE 3 : BASRA (Abu Amr) ---
    {
        id: "abu_amr",
        category: "quran",
        chapterId: 0,
        name: "Abu Amr Al-Basri",
        arabicName: "أبو عمرو البصري",
        role: "Le Savant de la Langue",
        desc: "Le plus savant des lecteurs en langue arabe et poésie. Sa lecture est celle de la tristesse (Huzn).",
        teachers: ["mujahid", "saeed_jubayr"],
        students: ["duri", "susi"]
    },
    {
        id: "duri",
        category: "quran",
        chapterId: 0,
        name: "Ad-Duri",
        arabicName: "حفص بن عمر الدوري",
        role: "Le Transmetteur Universel",
        desc: "Le premier à avoir compilé les lectures. Il rapporte de Abu Amr ET de Kisa'i. Une figure centrale.",
        teachers: ["abu_amr", "kisai"],
        students: []
    },
    {
        id: "susi",
        category: "quran",
        chapterId: 0,
        name: "As-Susi",
        arabicName: "صالح بن زياد السوسي",
        role: "Rapporteur d'Abu Amr",
        desc: "Connu pour sa règle d'Idgham kabir (fusion des lettres) très spécifique.",
        teachers: ["abu_amr"],
        students: []
    },

    // --- LECTURE 4 : CHAM (Ibn Amir) ---
    {
        id: "ibn_amir",
        category: "quran",
        chapterId: 0,
        name: "Ibn Amir A-Shami",
        arabicName: "عبد الله بن عامر الشامي",
        role: "L'Imam de Damas",
        desc: "Il a vécu sous le califat des Omeyyades. Il a appris d'Abu Darda et de l'épouse du Prophète.",
        teachers: ["abu_darda"], // Sahabi
        students: ["hisham", "ibn_dhakwan"]
    },

    // --- LECTURE 5 : KUFA (Asim) ---
    {
        id: "asim",
        category: "quran",
        chapterId: 0,
        name: "Asim ibn Abi al-Najud",
        arabicName: "عاصم بن أبي النجود",
        role: "La Voix de Kufa",
        desc: "Sa chaîne remonte à Ali ibn Abi Talib et Ibn Mas'ud. C'est la lecture la plus répandue au monde aujourd'hui (Hafs).",
        teachers: ["zarr_hubaysh"],
        students: ["shu_ba_qari", "hafs"]
    },
    {
        id: "shu_ba_qari",
        category: "quran",
        chapterId: 0,
        name: "Shu'ba (Al-Ayyashi)",
        arabicName: "أبو بكر شعبة",
        role: "Rapporteur d'Asim",
        desc: "Il était plus savant que Hafs, mais sa lecture est plus difficile. Un grand ascète.",
        teachers: ["asim"],
        students: []
    },
    {
        id: "hafs",
        category: "quran",
        chapterId: 0,
        name: "Hafs",
        arabicName: "حفص بن سليمان",
        role: "Le Beau-fils d'Asim",
        desc: "Il a grandi dans la maison d'Asim. Bien que faible en Hadith, il était l'autorité absolue dans la précision du Coran.",
        teachers: ["asim"],
        students: []
    },

    // --- LECTURE 6 : KUFA (Hamzah) ---
    {
        id: "hamzah",
        category: "quran",
        chapterId: 0,
        name: "Hamzah Az-Zayyat",
        arabicName: "حمزة الزيات",
        role: "Le Rigoureux",
        desc: "Sa lecture est connue pour ses allongements (Madd) très longs et ses règles strictes. Il commerçait l'huile pour vivre.",
        teachers: ["amash"],
        students: ["khalaf", "khallad"]
    },

    // --- LECTURE 7 : KUFA (Al-Kisa'i) ---
    {
        id: "kisai",
        category: "quran",
        chapterId: 0,
        name: "Al-Kisa'i",
        arabicName: "علي بن حمزة الكسائي",
        role: "Le Grammairien",
        desc: "L'un des fondateurs de l'école de grammaire de Kufa. Il a choisi une lecture basée sur la pureté linguistique.",
        teachers: ["hamzah"],
        students: ["duri", "abul_harith"]
    },
// =========================================================================
    // EXTENSION : LES 7 FUQAHA DE MÉDINE (Les racines de l'école de Malik)
    // =========================================================================
    {
        id: "saeed_musayyib",
        category: "fiqh",
        chapterId: 0,
        name: "Sa'id ibn al-Musayyib",
        arabicName: "سعيد بن المسيب",
        role: "Le Chef des Tabi'un",
        desc: "Il a refusé de marier sa fille au fils du Calife pour la marier à un étudiant pauvre. La référence absolue à Médine.",
        teachers: ["ibn_umar", "abu_huraira"],
        students: ["zuhri", "qatada"]
    },
    {
        id: "urwah_zubayr",
        category: "fiqh",
        chapterId: 0,
        name: "Urwah ibn al-Zubayr",
        arabicName: "عروة بن الزبير",
        role: "Le Pilier de la Famille",
        desc: "Fils d'Asma bint Abi Bakr. Il a brûlé ses livres de poésie pour se consacrer au Fiqh. Il lisait 1/4 du Coran chaque jour.",
        teachers: ["aisha"],
        students: ["zuhri"]
    },
    {
        id: "qasim_muhammad",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Qasim ibn Muhammad",
        arabicName: "القاسم بن محمد",
        role: "Le Petit-fils d'Abu Bakr",
        desc: "L'un des 7 Fuqaha. Son savoir était si vaste que l'Imam Malik le citait constamment.",
        teachers: ["aisha", "ibn_abbas"],
        students: ["zuhri"]
    },
    {
        id: "kharijah_zayd",
        category: "fiqh",
        chapterId: 0,
        name: "Kharijah ibn Zayd",
        arabicName: "خارجة بن زيد",
        role: "L'Héritier des Fara'id",
        desc: "Il a hérité la science de l'héritage de son père Zayd ibn Thabit. Les contrats n'étaient valides que s'il les signait.",
        teachers: ["zayd_thabit"],
        students: []
    },

    // =========================================================================
    // EXTENSION : LES IMAMS DES ÉCOLES DISPARUES (3ème Siècle)
    // =========================================================================
    {
        id: "awzai",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Awza'i",
        arabicName: "الأوزاعي",
        role: "Imam des Gens du Cham",
        desc: "Son école était suivie en Syrie et en Andalousie avant d'être remplacée. Il a tenu tête aux Abbassides par la vérité.",
        teachers: ["zuhri"],
        students: []
    },
    {
        id: "layth_sad",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Layth ibn Sa'd",
        arabicName: "الليث بن سعد",
        role: "Le Lion d'Égypte",
        desc: "Shafi'i a dit : 'Layth était plus savant que Malik, mais ses élèves ne l'ont pas porté'. Il était immensément riche et généreux.",
        teachers: ["zuhri", "nafi"],
        students: []
    },
    {
        id: "ibn_jurayj",
        category: "fiqh",
        chapterId: 0,
        name: "Ibn Jurayj",
        arabicName: "ابن جريج",
        role: "Le Premier Auteur",
        desc: "Considéré comme le premier à avoir écrit des livres classifiés à la Mecque. L'Imam des lieux saints.",
        teachers: ["ata_abi_rabah"],
        students: []
    },

    // =========================================================================
    // EXTENSION : LES MAÎTRES DU HADITH (Le Pont entre Tabi'un et Bukhari)
    // =========================================================================
    {
        id: "ibn_mubarak",
        category: "hadith",
        chapterId: 0,
        name: "Abdullah Ibn al-Mubarak",
        arabicName: "عبد الله بن المبارك",
        role: "Le Savant du Jihad",
        desc: "Il partageait son année : un temps pour le commerce, un temps pour le Hajj, un temps pour le Jihad. L'élève prodige de Malik et Abu Hanifa.",
        teachers: ["malik", "abu_hanifa", "sufyan_thawri"],
        students: ["ishaq", "yahya_main"]
    },
    {
        id: "hhammad_zayd",
        category: "hadith",
        chapterId: 0,
        name: "Hammad ibn Zayd",
        arabicName: "حماد بن زيد",
        role: "L'Aveugle de Basra",
        desc: "Contrairement à son contemporain Hammad ibn Salamah, il était connu pour la précision extrême de sa mémoire sans livre.",
        teachers: ["ayyu_sakhtiyani"],
        students: ["ibn_mubarak", "yahya_qattan"]
    },
    {
        id: "fudayl_iyad",
        category: "hadith",
        chapterId: 0,
        name: "Al-Fudayl ibn Iyad",
        arabicName: "الفضيل بن عياض",
        role: "L'Adorateur des Deux Harams",
        desc: "Ancien brigand repenti, il est devenu l'un des plus grands ascètes. Ses hadiths sont lumière.",
        teachers: ["mansur"],
        students: ["ibn_mubarak", "shafi"]
    },
    {
        id: "abu_bakr_abi_shaybah",
        category: "hadith",
        chapterId: 0,
        name: "Ibn Abi Shaybah",
        arabicName: "أبو بكر بن أبي شيبة",
        role: "L'Auteur du Musannaf",
        desc: "Son 'Musannaf' est l'une des plus grandes encyclopédies de Hadith et d'Athar jamais écrites.",
        teachers: ["wakie"],
        students: ["bukhari", "muslim", "abu_dawud", "ibn_majah"]
    },
    {
        id: "qutaybah",
        category: "hadith",
        chapterId: 0,
        name: "Qutaybah ibn Sa'id",
        arabicName: "قتيبة بن سعيد",
        role: "Le Sheikh du Monde",
        desc: "Tous les auteurs des 6 livres (sauf Ibn Majah) ont rapporté directement de lui. Il a voyagé partout.",
        teachers: ["malik", "layth_sad"],
        students: ["bukhari", "muslim", "abu_dawud", "tirmidhi", "nasai"]
    },

    // =========================================================================
    // EXTENSION : LES CRITIQUES (JARH WA TA'DIL) - L'ÉPOQUE D'OR
    // =========================================================================
    {
        id: "abu_hatim",
        category: "hadith",
        chapterId: 0,
        name: "Abu Hatim Ar-Razi",
        arabicName: "أبو حاتم الرازي",
        role: "Le Juge des Hommes",
        desc: "Il a marché plus de 3000 km à pied pour collecter le hadith. Sa parole sur les rapporteurs faisait loi.",
        teachers: [],
        students: ["ibn_abi_hatim"]
    },
    {
        id: "abu_zurah",
        category: "hadith",
        chapterId: 0,
        name: "Abu Zur'ah Ar-Razi",
        arabicName: "أبو زرعة الرازي",
        role: "Le Mémorisateur de Rayy",
        desc: "Il a dit : 'Je connais 200 000 hadiths comme une personne connaît 'Qul Huwa Allahu Ahad''.",
        teachers: ["ibn_abi_shaybah"],
        students: []
    },
    {
        id: "ibn_abi_hatim",
        category: "hadith",
        chapterId: 0,
        name: "Ibn Abi Hatim",
        arabicName: "ابن أبي حاتم",
        role: "Le Fils du Maître",
        desc: "Auteur du livre monumental 'Al-Jarh wa Ta'dil'. Il interrogeait son père sur les défauts cachés des hadiths.",
        teachers: ["abu_hatim", "abu_zurah"],
        students: []
    },

    // =========================================================================
    // EXTENSION : ÉLÈVES MAJEURS DES ÉCOLES DE FIQH
    // =========================================================================

    // --- HANAFI ---
    {
        id: "zufar",
        category: "fiqh",
        chapterId: 0,
        name: "Zufar ibn al-Hudhayl",
        arabicName: "زفر بن الهذيل",
        role: "Le Maître de l'Analogie",
        desc: "Le premier élève d'Abu Hanifa. Il était le plus fort d'entre eux dans le Qiyas (analogie).",
        teachers: ["abu_hanifa"],
        students: []
    },
    {
        id: "hasan_ziyad",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Hasan ibn Ziyad",
        arabicName: "الحسن بن زياد",
        role: "Le Transmetteur Précis",
        desc: "Il a rapporté les opinions d'Abu Hanifa avec une précision littérale.",
        teachers: ["abu_hanifa"],
        students: []
    },

    // --- MALIKI ---
    {
        id: "ibn_wahb",
        category: "fiqh",
        chapterId: 0,
        name: "Abdullah Ibn Wahb",
        arabicName: "عبد الله بن وهب",
        role: "Le Diwan de la Science",
        desc: "Malik l'appelait 'Le Faqih'. Il a compilé le hadith et le fiqh égyptien.",
        teachers: ["malik", "layth_sad"],
        students: ["sahnun"]
    },
    {
        id: "ashhab",
        category: "fiqh",
        chapterId: 0,
        name: "Ashhab",
        arabicName: "أشهب بن عبد العزيز",
        role: "Le Successeur",
        desc: "Le plus grand Faqih d'Égypte après Ibn al-Qasim. Il avait des débats houleux avec Shafi'i.",
        teachers: ["malik"],
        students: []
    },

    // --- SHAFI'I ---
    {
        id: "buwayti",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Buwayti",
        arabicName: "يوسف البويطي",
        role: "Le Khalifa de Shafi'i",
        desc: "Shafi'i a dit : 'C'est ma langue par laquelle je parle'. Il est mort en prison durant l'inquisition (Mihna).",
        teachers: ["shafi"],
        students: []
    },
    {
        id: "rabi_muradi",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Rabi' al-Muradi",
        arabicName: "الربيع المرادي",
        role: "Le Muezzin",
        desc: "Le principal rapporteur des livres de Shafi'i (Kitab al-Umm). C'est par lui que l'école nous est parvenue.",
        teachers: ["shafi"],
        students: []
    },

    // --- HANBALI ---
    {
        id: "abdullah_ahmad",
        category: "fiqh",
        chapterId: 0,
        name: "Abdullah ibn Ahmad",
        arabicName: "عبد الله بن أحمد",
        role: "Le Fils Transmetteur",
        desc: "Il a compilé le 'Musnad' de son père et ajouté ses propres ajouts (Zawa'id).",
        teachers: ["ahmad"],
        students: []
    },
    {
        id: "al_khallal",
        category: "fiqh",
        chapterId: 0,
        name: "Abu Bakr Al-Khallal",
        arabicName: "أبو بكر الخلال",
        role: "Le Collecteur",
        desc: "Il a voyagé partout pour rassembler les fatwas dispersées de l'Imam Ahmad dans un grand recueil 'Al-Jami'.",
        teachers: ["abdullah_ahmad"], // Élève indirect (via Al-Marrudhi)
        students: []
    },
    {
        id: "barbahari",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Barbahari",
        arabicName: "البربهاري",
        role: "Le Chef des Hanbalites",
        desc: "Une figure d'autorité à Bagdad. Il défendait la Aqida des salafs avec une ferveur redoutée.",
        teachers: ["al_marrudhi"], // Élève direct d'Ahmad
        students: []
    },

    // =========================================================================
    // EXTENSION : LES 3 LECTEURS MANQUANTS (POUR LES 10 QIRA'AT)
    // =========================================================================

    // --- LECTURE 8 : MÉDINE (Abu Ja'far) ---
    // (Déjà présent comme teacher de Nafi, mais on l'officialise comme Qari majeur)
    {
        id: "ibn_wardan",
        category: "quran",
        chapterId: 0,
        name: "Ibn Wardan",
        arabicName: "ابن وردان",
        role: "Rapporteur d'Abu Ja'far",
        desc: "Le compagnon fidèle d'Abu Ja'far. Il ramenait la lecture ancienne de Médine.",
        teachers: ["abu_jafar"],
        students: []
    },
    {
        id: "ibn_jammaz",
        category: "quran",
        chapterId: 0,
        name: "Ibn Jammaz",
        arabicName: "ابن جماز",
        role: "Rapporteur d'Abu Ja'far",
        desc: "Un lecteur précis de Médine.",
        teachers: ["abu_jafar"],
        students: []
    },

    // --- LECTURE 9 : BASRA (Ya'qub) ---
    {
        id: "yaqub",
        category: "quran",
        chapterId: 0,
        name: "Ya'qub Al-Hadrami",
        arabicName: "يعقوب الحضرمي",
        role: "Le 9ème Imam",
        desc: "L'Imam de la grande mosquée de Basra. Sa lecture est un bijou de clarté.",
        teachers: ["salam_tawil"],
        students: ["ruways", "rawh"]
    },
    {
        id: "ruways",
        category: "quran",
        chapterId: 0,
        name: "Ruways",
        arabicName: "رويس",
        role: "Rapporteur de Ya'qub",
        desc: "Un ascète célèbre de Basra.",
        teachers: ["yaqub"],
        students: []
    },
    {
        id: "rawh",
        category: "quran",
        chapterId: 0,
        name: "Rawh",
        arabicName: "روح",
        role: "Rapporteur de Ya'qub",
        desc: "Il a rapporté la lecture de Ya'qub avec une grande fidélité.",
        teachers: ["yaqub"],
        students: []
    },

    // --- LECTURE 10 : KUFA (Khalaf) ---
    {
        id: "khalaf_bazzar",
        category: "quran",
        chapterId: 0,
        name: "Khalaf Al-Bazzar",
        arabicName: "خلف العاشر",
        role: "Le 10ème Imam",
        desc: "Il a commencé comme élève de Hamzah, puis sa propre sélection a été si forte qu'elle est devenue une lecture indépendante.",
        teachers: ["hamzah"],
        students: ["ishaq_warraq", "idris_haddad"]
    },
    {
        id: "ishaq_warraq",
        category: "quran",
        chapterId: 0,
        name: "Ishaq Al-Warraq",
        arabicName: "إسحاق الوراق",
        role: "Rapporteur de Khalaf",
        desc: "Il a copié et transmis la lecture de Khalaf.",
        teachers: ["khalaf_bazzar"],
        students: []
    },
    {
        id: "idris_haddad",
        category: "quran",
        chapterId: 0,
        name: "Idris Al-Haddad",
        arabicName: "إدريس الحداد",
        role: "Rapporteur de Khalaf",
        desc: "Un homme de grande confiance dans la transmission.",
        teachers: ["khalaf_bazzar"],
        students: []
    },

    // =========================================================================
    // EXTENSION : LES PIONNIERS (Génération Tabi'un Précoces)
    // =========================================================================
    {
        id: "hasan_basri",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Hasan Al-Basri",
        arabicName: "الحسن البصري",
        role: "Le Maître des Coeurs",
        desc: "Tabi'i légendaire. Sa parole ressemblait à celle des Prophètes. Une autorité en Tafsir, Fiqh et spiritualité.",
        teachers: ["anas_malik"],
        students: ["ayyu_sakhtiyani"]
    },
    {
        id: "tawus",
        category: "fiqh",
        chapterId: 0,
        name: "Tawus ibn Kaysan",
        arabicName: "طاووس بن كيسان",
        role: "Le Paon des Tabi'un",
        desc: "L'élève principal d'Ibn Abbas au Yémen et à la Mecque. Connu pour son ascétisme total.",
        teachers: ["ibn_abbas"],
        students: []
    },
    {
        id: "ata_abi_rabah",
        category: "fiqh",
        chapterId: 0,
        name: "Ata ibn Abi Rabah",
        arabicName: "عطاء بن أبي رباح",
        role: "Le Mufti du Hajj",
        desc: "Le crieur du Calife annonçait : 'Nul ne donne de Fatwa au Hajj sauf Ata'. Il était esclave noir, devenu le roi de la science.",
        teachers: ["ibn_abbas", "aisha"],
        students: ["ibn_jurayj", "abu_hanifa"]
    },
    {
        id: "mujahid",
        category: "quran",
        chapterId: 0,
        name: "Mujahid ibn Jabr",
        arabicName: "مجاهد بن جبر",
        role: "L'Interprète du Coran",
        desc: "Il a revu le Coran 3 fois entièrement avec Ibn Abbas, s'arrêtant à chaque verset pour en demander le sens.",
        teachers: ["ibn_abbas"],
        students: ["ibn_kathir_qari", "abu_amr"]
    },
    {
        id: "ikrimah",
        category: "hadith",
        chapterId: 0,
        name: "Ikrimah",
        arabicName: "عكرمة",
        role: "L'Esclave Savant",
        desc: "L'élève d'Ibn Abbas qui a voyagé jusqu'en Afrique du Nord pour enseigner. Bukhari s'appuie fortement sur lui.",
        teachers: ["ibn_abbas"],
        students: ["ayyu_sakhtiyani"]
    },
    {
        id: "shabi",
        category: "fiqh",
        chapterId: 0,
        name: "Al-Sha'bi",
        arabicName: "عامر الشعبي",
        role: "La Mémoire d'Irak",
        desc: "Il a rencontré 500 Compagnons. Il disait : 'Je n'ai jamais écrit noir sur blanc, tout est dans ma tête'.",
        teachers: ["aisha", "ibn_umar"],
        students: ["abu_hanifa"] // (Indirectement via Hammad)
    },
    {
        id: "nakhai",
        category: "fiqh",
        chapterId: 0,
        name: "Ibrahim Al-Nakha'i",
        arabicName: "إبراهيم النخعي",
        role: "Le Faqih de Kufa",
        desc: "Le véritable fondateur de la méthodologie irakienne avant Abu Hanifa. Il ne laissait aucun écrit.",
        teachers: ["masruq", "alqama"],
        students: ["hammad"]
    },
    {
        id: "hammad",
        category: "fiqh",
        chapterId: 0,
        name: "Hammad ibn Abi Sulayman",
        arabicName: "حماد بن أبي سليمان",
        role: "Le Maître d'Abu Hanifa",
        desc: "Le maillon essentiel entre Ibn Mas'ud et Abu Hanifa. Il était très généreux et nourrissait les pauvres au Ramadan.",
        teachers: ["nakhai"],
        students: ["abu_hanifa"]
    },
    {
        id: "ayyu_sakhtiyani",
        category: "hadith",
        chapterId: 0,
        name: "Ayyub As-Sakhtiyani",
        arabicName: "أيوب السختياني",
        role: "Le Sayyid de Basra",
        desc: "Malik disait : 'Je rapporte de Ayyub car il est le meilleur'. Il cachait ses pleurs quand on lisait le hadith.",
        teachers: ["hasan_basri", "nafi"],
        students: ["hhammad_zayd", "malik"]
    },
    {
        id: "salim_abdullah",
        category: "fiqh",
        chapterId: 0,
        name: "Salim ibn Abdullah",
        arabicName: "سالم بن عبد الله",
        role: "Le Fils d'Ibn Umar",
        desc: "Il ressemblait à son père (Umar) en caractère et en piété. L'un des 7 Fuqaha.",
        teachers: ["ibn_umar"],
        students: ["zuhri"]
    },
    {
        id: "abu_zuhayr",
        category: "hadith",
        chapterId: 0,
        name: "Abdurrahman ibn Mahdi",
        arabicName: "عبد الرحمن بن مهدي",
        role: "Le Critique",
        desc: "L'égal de Yahya al-Qattan. C'est lui qui a demandé à Shafi'i d'écrire la Risala.",
        teachers: ["shuba", "sufyan_thawri"],
        students: ["ahmad", "ali_madini"]
    },
    {
        id: "masruq",
        category: "fiqh",
        chapterId: 0,
        name: "Masruq ibn al-Ajda",
        arabicName: "مسروق بن الأجدع",
        role: "L'Élève d'Aisha",
        desc: "Il a été 'volé' (Masruq) enfant puis retrouvé. Il dormait en prosternation. Un grand Tabi'i.",
        teachers: ["aisha", "ibn_masud"],
        students: ["nakhai"]
    },
    {
        id: "alqama",
        category: "fiqh",
        chapterId: 0,
        name: "Alqama ibn Qays",
        arabicName: "علقمة بن قيس",
        role: "La Copie d'Ibn Mas'ud",
        desc: "Il ressemblait tellement à Ibn Mas'ud en savoir et en comportement qu'on disait qu'il ne manquait rien.",
        teachers: ["ibn_masud"],
        students: ["nakhai"]
    },
    {
        id: "zayd_thabit",
        category: "quran",
        chapterId: 0,
        name: "Zayd ibn Thabit",
        arabicName: "زيد بن ثابت",
        role: "Le Scribe de la Révélation",
        desc: "Le Compagnon chargé de compiler le Coran. La source de la science de l'héritage et de la lecture à Médine.",
        teachers: [],
        students: ["ibn_abbas", "ibn_umar"]
    },
    {
        id: "abu_darda",
        category: "quran",
        chapterId: 0,
        name: "Abu Darda",
        arabicName: "أبو الدرداء",
        role: "Le Sage de la Nation",
        desc: "Il a établi les cercles d'apprentissage du Coran à Damas (plus de 1600 étudiants en même temps).",
        teachers: [],
        students: ["ibn_amir"]
    }

];

// Configuration des thèmes visuels
const SILSILA_THEMES = {
    hadith: {
        color: 'text-amber-600',
        border: 'border-amber-500',
        bg: 'bg-amber-50',
        connector: 'bg-amber-300',
        btn: 'bg-brand-dark text-brand-gold hover:bg-brand-gold hover:text-white',
        icon: 'scroll-text'
    },
    fiqh: {
        color: 'text-indigo-600',
        border: 'border-indigo-500',
        bg: 'bg-indigo-50',
        connector: 'bg-indigo-300',
        btn: 'bg-indigo-600 text-white hover:bg-indigo-700',
        icon: 'scale'
    },
    quran: {
        color: 'text-emerald-600',
        border: 'border-emerald-500',
        bg: 'bg-emerald-50',
        connector: 'bg-emerald-300',
        btn: 'bg-emerald-600 text-white hover:bg-emerald-700',
        icon: 'book-open'
    }
};