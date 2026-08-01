window.ROOT_TREE_DATA = {
    meta: {
        title: "L’Arbre des Racines",
        arabic: "شَجَرَةُ الجُذُور",
        subtitle: "Comprendre comment une idée se déploie dans la langue arabe",
        editorialNote: "Cette section propose une lecture pédagogique des familles de mots. Une racine indique un champ de sens, mais le sens précis d’un mot dépend toujours de sa forme, de sa phrase et de son contexte.",
        sources: [
            { label: "Quranic Arabic Corpus — dictionnaire morphologique", url: "https://corpus.quran.com/qurandictionary.jsp" },
            { label: "Lane’s Arabic-English Lexicon — consultation numérique", url: "https://lexicon.quranic-research.net/" }
        ]
    },
    categories: [
        { id: "all", label: "Toutes", icon: "layers-3" },
        { id: "revelation", label: "Révélation", icon: "book-open" },
        { id: "guidance", label: "Orientation", icon: "compass" },
        { id: "worship", label: "Adoration", icon: "heart-handshake" },
        { id: "character", label: "Caractère", icon: "sparkles" }
    ],
    roots: [
        {
            id: "rahma",
            root: "ر ح م",
            letters: ["ر", "ح", "م"],
            transliteration: "R-Ḥ-M",
            title: "Miséricorde et lien protecteur",
            category: "character",
            color: "#c58c6a",
            core: "La famille évoque la miséricorde, la tendresse protectrice et le lien qui enveloppe et préserve.",
            nuance: "La parenté entre raḥma, al-Raḥmān et raḥim rappelle qu’une même racine peut relier une qualité divine, une action et une relation humaine.",
            memory: "Imagine une protection qui entoure avant même qu’on la demande.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=rHm",
            derivatives: [
                { id: "rahma-noun", word: "رَحْمَة", transliteration: "raḥma", label: "miséricorde", form: "nom", note: "Une faveur, une compassion ou une protection accordée." },
                { id: "rahman", word: "الرَّحْمٰن", transliteration: "al-Raḥmān", label: "Le Tout Miséricordieux", form: "nom divin", note: "Forme intensive évoquant une miséricorde immense et universelle." },
                { id: "rahim", word: "رَحِيم", transliteration: "raḥīm", label: "miséricordieux", form: "adjectif", note: "Qualité stable de celui qui fait miséricorde." },
                { id: "yarham", word: "يَرْحَم", transliteration: "yarḥam", label: "il fait miséricorde", form: "verbe", note: "L’action concrète de faire preuve de miséricorde." },
                { id: "arham", word: "أَرْحَام", transliteration: "arḥām", label: "liens de parenté", form: "nom pluriel", note: "Les liens familiaux, associés à l’idée de proximité et de protection." }
            ],
            verses: [
                { reference: "Al-Fātiḥa 1:1", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", translation: "Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.", focus: "الرَّحْمَنِ الرَّحِيمِ" },
                { reference: "Al-Aʿrāf 7:56", arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِنَ الْمُحْسِنِينَ", translation: "La miséricorde d’Allah est proche des bienfaisants.", focus: "رَحْمَتَ" },
                { reference: "Yūsuf 12:64", arabic: "فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ", translation: "Allah est le meilleur gardien et le plus miséricordieux des miséricordieux.", focus: "أَرْحَمُ الرَّاحِمِينَ" }
            ]
        },
        {
            id: "ilm",
            root: "ع ل م",
            letters: ["ع", "ل", "م"],
            transliteration: "ʿ-L-M",
            title: "Savoir, signe et reconnaissance",
            category: "revelation",
            color: "#6f9ca8",
            core: "Cette famille relie le savoir, l’apprentissage et ce qui rend une chose reconnaissable.",
            nuance: "Le mot ʿalam, signe ou repère, appartient à la même famille : savoir, c’est aussi distinguer clairement.",
            memory: "Une connaissance devient un repère qui permet de reconnaître.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=Elm",
            derivatives: [
                { id: "ilm-noun", word: "عِلْم", transliteration: "ʿilm", label: "savoir", form: "nom", note: "Connaissance acquise ou possédée." },
                { id: "alim", word: "عَلِيم", transliteration: "ʿalīm", label: "parfaitement savant", form: "adjectif", note: "Forme intensive décrivant un savoir complet." },
                { id: "allama", word: "عَلَّمَ", transliteration: "ʿallama", label: "il a enseigné", form: "verbe causatif", note: "Faire parvenir un savoir à quelqu’un." },
                { id: "yaalam", word: "يَعْلَم", transliteration: "yaʿlam", label: "il sait", form: "verbe", note: "Le fait de connaître ou de reconnaître." },
                { id: "ulama", word: "عُلَمَاء", transliteration: "ʿulamāʾ", label: "savants", form: "nom pluriel", note: "Ceux dont le savoir est devenu une qualité reconnue." }
            ],
            verses: [
                { reference: "Al-Baqara 2:31", arabic: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا", translation: "Il enseigna à Adam tous les noms.", focus: "عَلَّمَ" },
                { reference: "Al-Baqara 2:29", arabic: "وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "Et Il est parfaitement savant de toute chose.", focus: "عَلِيمٌ" },
                { reference: "Al-ʿAlaq 96:5", arabic: "عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ", translation: "Il enseigna à l’être humain ce qu’il ne savait pas.", focus: "عَلَّمَ / يَعْلَمْ" }
            ]
        },
        {
            id: "kitab",
            root: "ك ت ب",
            letters: ["ك", "ت", "ب"],
            transliteration: "K-T-B",
            title: "Écrire, rassembler et prescrire",
            category: "revelation",
            color: "#9c7b5f",
            core: "La racine relie l’écriture à l’idée de réunir des éléments, de fixer une parole et d’établir une prescription.",
            nuance: "Dans le Coran, kataba peut signifier écrire, décréter ou prescrire selon le contexte.",
            memory: "Écrire, c’est réunir des signes pour fixer un sens.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=ktb",
            derivatives: [
                { id: "kitab-book", word: "كِتَاب", transliteration: "kitāb", label: "livre / écrit", form: "nom", note: "Un texte rassemblé et fixé." },
                { id: "kataba", word: "كَتَبَ", transliteration: "kataba", label: "il a écrit / prescrit", form: "verbe", note: "Écrire ou établir fermement selon le contexte." },
                { id: "kutiba", word: "كُتِبَ", transliteration: "kutiba", label: "il a été prescrit", form: "passif", note: "Une obligation fixée pour les destinataires." },
                { id: "katib", word: "كَاتِب", transliteration: "kātib", label: "scribe", form: "participe actif", note: "Celui qui écrit." },
                { id: "maktub", word: "مَكْتُوب", transliteration: "maktūb", label: "écrit", form: "participe passif", note: "Ce qui a été mis par écrit." }
            ],
            verses: [
                { reference: "Al-Baqara 2:2", arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", translation: "Voilà le Livre au sujet duquel il n’y a aucun doute.", focus: "الْكِتَابُ" },
                { reference: "Al-Baqara 2:183", arabic: "كُتِبَ عَلَيْكُمُ الصِّيَامُ", translation: "Le jeûne vous a été prescrit.", focus: "كُتِبَ" },
                { reference: "Al-Baqara 2:282", arabic: "وَلْيَكْتُبْ بَيْنَكُمْ كَاتِبٌ بِالْعَدْلِ", translation: "Qu’un scribe écrive entre vous avec justice.", focus: "يَكْتُبْ / كَاتِبٌ" }
            ]
        },
        {
            id: "huda",
            root: "ه د ي",
            letters: ["ه", "د", "ي"],
            transliteration: "H-D-Y",
            title: "Guider vers une destination",
            category: "guidance",
            color: "#789b7a",
            core: "Cette famille exprime l’orientation douce et claire vers une voie ou une destination juste.",
            nuance: "La guidance ne désigne pas seulement une information : elle implique une direction et un chemin à suivre.",
            memory: "Un chemin devient lisible et conduit vers son but.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=hdy",
            derivatives: [
                { id: "huda-noun", word: "هُدًى", transliteration: "hudā", label: "guidance", form: "nom", note: "Orientation qui montre la bonne voie." },
                { id: "hada", word: "هَدَى", transliteration: "hadā", label: "il a guidé", form: "verbe", note: "Conduire ou montrer la direction." },
                { id: "yahdi", word: "يَهْدِي", transliteration: "yahdī", label: "il guide", form: "verbe", note: "Action présente ou renouvelée de guider." },
                { id: "ihtada", word: "اهْتَدَى", transliteration: "ihtadā", label: "il s’est laissé guider", form: "verbe réfléchi", note: "Recevoir et suivre la guidance." },
                { id: "hadi", word: "هَادٍ", transliteration: "hādin", label: "guide", form: "participe actif", note: "Celui qui oriente vers une voie." }
            ],
            verses: [
                { reference: "Al-Fātiḥa 1:6", arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide-nous sur la voie droite.", focus: "اهْدِنَا" },
                { reference: "Al-Baqara 2:2", arabic: "هُدًى لِلْمُتَّقِينَ", translation: "Une guidance pour les pieux.", focus: "هُدًى" },
                { reference: "Yūnus 10:25", arabic: "وَاللَّهُ يَدْعُو إِلَى دَارِ السَّلَامِ وَيَهْدِي مَنْ يَشَاءُ", translation: "Allah appelle à la demeure de la paix et guide qui Il veut.", focus: "يَهْدِي" }
            ]
        },
        {
            id: "salam",
            root: "س ل م",
            letters: ["س", "ل", "م"],
            transliteration: "S-L-M",
            title: "Paix, intégrité et remise confiante",
            category: "guidance",
            color: "#6f9b91",
            core: "La famille unit la paix, l’intégrité, la sécurité et l’acte de se remettre sincèrement à Allah.",
            nuance: "Salām, islām et muslim ne sont pas interchangeables, mais ils partagent une idée d’intégrité et de remise sans duplicité.",
            memory: "Ce qui est entier et préservé peut entrer en paix.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=slm",
            derivatives: [
                { id: "salam-peace", word: "سَلَام", transliteration: "salām", label: "paix", form: "nom", note: "Paix, sécurité ou salutation de paix." },
                { id: "islam", word: "إِسْلَام", transliteration: "islām", label: "soumission à Allah", form: "nom verbal", note: "Remise sincère et volontaire à Allah." },
                { id: "muslim", word: "مُسْلِم", transliteration: "muslim", label: "musulman", form: "participe actif", note: "Celui qui se remet à Allah." },
                { id: "aslama", word: "أَسْلَمَ", transliteration: "aslama", label: "il s’est soumis", form: "verbe", note: "Remettre son être ou son affaire à Allah." },
                { id: "salim", word: "سَلِيم", transliteration: "salīm", label: "sain / intact", form: "adjectif", note: "Préservé d’un défaut ou d’une corruption." }
            ],
            verses: [
                { reference: "Yā-Sīn 36:58", arabic: "سَلَامٌ قَوْلًا مِنْ رَبٍّ رَحِيمٍ", translation: "Paix — parole d’un Seigneur miséricordieux.", focus: "سَلَامٌ" },
                { reference: "Al-Baqara 2:131", arabic: "إِذْ قَالَ لَهُ رَبُّهُ أَسْلِمْ قَالَ أَسْلَمْتُ لِرَبِّ الْعَالَمِينَ", translation: "Quand son Seigneur lui dit : “Soumets-toi”, il répondit : “Je me soumets au Seigneur des mondes.”", focus: "أَسْلِمْ / أَسْلَمْتُ" },
                { reference: "Ash-Shuʿarāʾ 26:89", arabic: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ", translation: "Sauf celui qui vient à Allah avec un cœur sain.", focus: "سَلِيمٍ" }
            ]
        },
        {
            id: "ghafr",
            root: "غ ف ر",
            letters: ["غ", "ف", "ر"],
            transliteration: "Gh-F-R",
            title: "Couvrir, protéger et pardonner",
            category: "character",
            color: "#927aa0",
            core: "Cette famille évoque le pardon comme couverture protectrice d’une faute et préservation de ses conséquences.",
            nuance: "Le sens ne se limite pas à ignorer une faute : il comporte l’idée de couvrir et de protéger.",
            memory: "Une faute est couverte afin qu’elle ne détruise plus.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=gfr",
            derivatives: [
                { id: "maghfira", word: "مَغْفِرَة", transliteration: "maghfira", label: "pardon", form: "nom", note: "Pardon protecteur accordé après la faute." },
                { id: "ghafur", word: "غَفُور", transliteration: "ghafūr", label: "Très Pardonneur", form: "adjectif intensif", note: "Celui dont le pardon est immense et répété." },
                { id: "ghafar", word: "غَفَرَ", transliteration: "ghafara", label: "il a pardonné", form: "verbe", note: "Couvrir et pardonner une faute." },
                { id: "istaghfara", word: "اسْتَغْفَرَ", transliteration: "istaghfara", label: "il a demandé pardon", form: "verbe de demande", note: "Chercher activement le pardon." },
                { id: "ighfir", word: "اغْفِرْ", transliteration: "ighfir", label: "pardonne", form: "impératif", note: "Invocation demandant le pardon." }
            ],
            verses: [
                { reference: "Nūḥ 71:10", arabic: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا", translation: "J’ai dit : demandez pardon à votre Seigneur, car Il est Grand Pardonneur.", focus: "اسْتَغْفِرُوا / غَفَّارًا" },
                { reference: "Āl ʿImrān 3:133", arabic: "وَسَارِعُوا إِلَى مَغْفِرَةٍ مِنْ رَبِّكُمْ", translation: "Empressez-vous vers un pardon de votre Seigneur.", focus: "مَغْفِرَةٍ" },
                { reference: "Al-Baqara 2:173", arabic: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", translation: "Allah est Très Pardonneur et Très Miséricordieux.", focus: "غَفُورٌ" }
            ]
        },
        {
            id: "sabr",
            root: "ص ب ر",
            letters: ["ص", "ب", "ر"],
            transliteration: "Ṣ-B-R",
            title: "Tenir fermement avec maîtrise",
            category: "character",
            color: "#b18a55",
            core: "La racine exprime la retenue, l’endurance et la capacité à demeurer ferme sans abandonner la juste direction.",
            nuance: "Le ṣabr n’est pas une passivité : il peut être patience dans l’épreuve, constance dans l’obéissance ou maîtrise face à l’interdit.",
            memory: "Rester à son poste intérieur sans céder à la panique.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=Sbr",
            derivatives: [
                { id: "sabr-noun", word: "صَبْر", transliteration: "ṣabr", label: "patience / endurance", form: "nom", note: "Fermeté et maîtrise dans la durée." },
                { id: "sabir", word: "صَابِر", transliteration: "ṣābir", label: "patient", form: "participe actif", note: "Celui qui pratique la patience." },
                { id: "sabirin", word: "صَابِرِين", transliteration: "ṣābirīn", label: "les patients", form: "pluriel", note: "Ceux qui demeurent fermes." },
                { id: "isbir", word: "اصْبِرْ", transliteration: "iṣbir", label: "patiente", form: "impératif", note: "Ordre de tenir fermement." },
                { id: "sabara", word: "صَبَرَ", transliteration: "ṣabara", label: "il a patienté", form: "verbe", note: "Supporter et persévérer avec maîtrise." }
            ],
            verses: [
                { reference: "Al-Baqara 2:153", arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "Allah est avec les patients.", focus: "الصَّابِرِينَ" },
                { reference: "Āl ʿImrān 3:200", arabic: "اصْبِرُوا وَصَابِرُوا وَرَابِطُوا", translation: "Soyez patients, rivalisez de patience et demeurez fermes.", focus: "اصْبِرُوا / صَابِرُوا" },
                { reference: "Yūsuf 12:18", arabic: "فَصَبْرٌ جَمِيلٌ", translation: "Une belle patience est donc de mise.", focus: "صَبْرٌ" }
            ]
        },
        {
            id: "shukr",
            root: "ش ك ر",
            letters: ["ش", "ك", "ر"],
            transliteration: "Sh-K-R",
            title: "Reconnaître et faire fructifier un bienfait",
            category: "character",
            color: "#a28f4e",
            core: "Cette famille exprime la reconnaissance d’un bienfait par le cœur, la parole et l’usage juste de ce qui a été reçu.",
            nuance: "Le shukr ne se limite pas à dire merci : il rend visible le bienfait en l’employant correctement.",
            memory: "Reconnaître un don puis le faire porter du fruit.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=$kr",
            derivatives: [
                { id: "shukr-noun", word: "شُكْر", transliteration: "shukr", label: "gratitude", form: "nom", note: "Reconnaissance active d’un bienfait." },
                { id: "shakara", word: "شَكَرَ", transliteration: "shakara", label: "il a remercié", form: "verbe", note: "Reconnaître et remercier." },
                { id: "shakir", word: "شَاكِر", transliteration: "shākir", label: "reconnaissant", form: "participe actif", note: "Celui qui manifeste sa gratitude." },
                { id: "shakur", word: "شَكُور", transliteration: "shakūr", label: "très reconnaissant", form: "adjectif intensif", note: "Gratitude profonde et constante." },
                { id: "ushkur", word: "اشْكُرْ", transliteration: "ushkur", label: "remercie", form: "impératif", note: "Invitation à reconnaître le bienfait." }
            ],
            verses: [
                { reference: "Al-Baqara 2:152", arabic: "وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", translation: "Soyez reconnaissants envers Moi et ne soyez pas ingrats.", focus: "اشْكُرُوا" },
                { reference: "Ibrāhīm 14:7", arabic: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ", translation: "Si vous êtes reconnaissants, J’augmenterai certainement pour vous.", focus: "شَكَرْتُمْ" },
                { reference: "Al-Isrāʾ 17:3", arabic: "إِنَّهُ كَانَ عَبْدًا شَكُورًا", translation: "Il était vraiment un serviteur très reconnaissant.", focus: "شَكُورًا" }
            ]
        },
        {
            id: "dhikr",
            root: "ذ ك ر",
            letters: ["ذ", "ك", "ر"],
            transliteration: "Dh-K-R",
            title: "Se rappeler, mentionner et rendre présent",
            category: "worship",
            color: "#7d86a8",
            core: "La famille relie la mémoire intérieure, la mention par la parole et ce qui ravive une vérité dans le présent.",
            nuance: "Dhikr peut désigner l’acte de se rappeler, une mention, un rappel transmis ou le message révélé selon le contexte.",
            memory: "Faire revenir une vérité absente jusqu’à ce qu’elle redevienne présente.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=*kr",
            derivatives: [
                { id: "dhikr-noun", word: "ذِكْر", transliteration: "dhikr", label: "rappel / mention", form: "nom", note: "Acte de se rappeler ou rappel transmis." },
                { id: "dhakara", word: "ذَكَرَ", transliteration: "dhakara", label: "il a mentionné", form: "verbe", note: "Mentionner ou se rappeler." },
                { id: "udhkur", word: "اذْكُرْ", transliteration: "udhkur", label: "rappelle-toi", form: "impératif", note: "Invitation à rendre une vérité présente." },
                { id: "dhikra", word: "ذِكْرَى", transliteration: "dhikrā", label: "rappel bénéfique", form: "nom", note: "Ce qui réveille la mémoire et profite." },
                { id: "mudhakkir", word: "مُذَكِّر", transliteration: "mudhakkir", label: "celui qui rappelle", form: "participe actif", note: "Celui qui aide autrui à se souvenir." }
            ],
            verses: [
                { reference: "Al-Baqara 2:152", arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", translation: "Rappelez-vous de Moi, Je Me rappellerai de vous.", focus: "اذْكُرُونِي / أَذْكُرْكُمْ" },
                { reference: "Al-Ḥijr 15:9", arabic: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ", translation: "C’est Nous qui avons fait descendre le Rappel et c’est Nous qui le préservons.", focus: "الذِّكْرَ" },
                { reference: "Adh-Dhāriyāt 51:55", arabic: "وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ", translation: "Rappelle, car le rappel profite aux croyants.", focus: "ذَكِّرْ / الذِّكْرَى" }
            ]
        },
        {
            id: "ibada",
            root: "ع ب د",
            letters: ["ع", "ب", "د"],
            transliteration: "ʿ-B-D",
            title: "Servir avec humilité et attachement",
            category: "worship",
            color: "#8d7868",
            core: "Cette famille exprime la servitude, l’adoration et l’engagement humble envers celui que l’on sert.",
            nuance: "Dans le langage coranique, l’adoration d’Allah réunit amour, humilité, obéissance et sincérité.",
            memory: "Choisir à qui l’on appartient et orienter toute sa marche vers Lui.",
            sourceUrl: "https://corpus.quran.com/qurandictionary.jsp?q=Ebd",
            derivatives: [
                { id: "abd", word: "عَبْد", transliteration: "ʿabd", label: "serviteur", form: "nom", note: "Celui qui est au service et sous l’autorité d’un maître." },
                { id: "ibada-noun", word: "عِبَادَة", transliteration: "ʿibāda", label: "adoration", form: "nom verbal", note: "Ensemble des actes d’adoration et de servitude." },
                { id: "yaabud", word: "يَعْبُد", transliteration: "yaʿbud", label: "il adore", form: "verbe", note: "Servir et adorer." },
                { id: "ubudu", word: "اعْبُدُوا", transliteration: "uʿbudū", label: "adorez", form: "impératif pluriel", note: "Commandement adressé à plusieurs personnes." },
                { id: "ibad", word: "عِبَاد", transliteration: "ʿibād", label: "serviteurs", form: "pluriel", note: "Serviteurs, souvent dans un contexte honorifique lorsqu’ils sont attribués à Allah." }
            ],
            verses: [
                { reference: "Al-Baqara 2:21", arabic: "يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ", translation: "Ô hommes, adorez votre Seigneur.", focus: "اعْبُدُوا" },
                { reference: "Al-Isrāʾ 17:1", arabic: "سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا", translation: "Gloire à Celui qui fit voyager de nuit Son serviteur.", focus: "بِعَبْدِهِ" },
                { reference: "Al-Furqān 25:63", arabic: "وَعِبَادُ الرَّحْمَنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا", translation: "Les serviteurs du Tout Miséricordieux sont ceux qui marchent humblement sur terre.", focus: "عِبَادُ" }
            ]
        }
    ],
    guides: [
        {
            id: "read-family",
            title: "Lire une famille de mots",
            duration: "4 min",
            summary: "Apprendre à partir d’une idée centrale sans forcer tous les dérivés à avoir exactement le même sens.",
            steps: [
                { rootId: "kitab", derivativeId: "kitab-book", title: "Repérer les trois lettres", text: "Commence par distinguer ك ت ب. Les voyelles et lettres ajoutées construisent ensuite des mots différents." },
                { rootId: "kitab", derivativeId: "kataba", title: "Observer la forme", text: "Kataba est un verbe simple : l’idée d’écriture devient une action accomplie." },
                { rootId: "kitab", derivativeId: "kutiba", title: "Laisser le contexte décider", text: "Kutiba est au passif. Dans le verset du jeûne, le contexte conduit au sens de prescription." }
            ]
        },
        {
            id: "same-root-different-paths",
            title: "Une racine, plusieurs chemins",
            duration: "5 min",
            summary: "Voir comment une même racine peut produire un nom, un verbe, une qualité et une relation.",
            steps: [
                { rootId: "rahma", derivativeId: "rahma-noun", title: "L’idée", text: "Raḥma nomme la miséricorde elle-même." },
                { rootId: "rahma", derivativeId: "rahim", title: "La qualité", text: "Raḥīm décrit celui dont la miséricorde est une qualité stable." },
                { rootId: "rahma", derivativeId: "arham", title: "La relation", text: "Arḥām désigne les liens de parenté : la même famille de sens rejoint le lien qui protège et oblige." }
            ]
        },
        {
            id: "context-first",
            title: "Le contexte avant la traduction",
            duration: "4 min",
            summary: "Comprendre pourquoi une racine donne une direction, mais ne remplace jamais la lecture du verset.",
            steps: [
                { rootId: "salam", derivativeId: "salam-peace", title: "Paix", text: "Salām désigne ici une parole de paix et de sécurité." },
                { rootId: "salam", derivativeId: "aslama", title: "Remise", text: "Aslama décrit l’acte de se remettre à Allah." },
                { rootId: "salam", derivativeId: "salim", title: "Intégrité", text: "Salīm qualifie un cœur sain. La racine demeure reconnaissable, mais le sens précis vient de la forme et du contexte." }
            ]
        }
    ],
    glossary: [
        { term: "Racine", arabic: "جِذْر", definition: "Ensemble de consonnes, souvent trois, autour duquel se construit une famille de mots." },
        { term: "Dérivé", arabic: "مُشْتَقّ", definition: "Mot formé à partir d’une racine selon une structure déterminée." },
        { term: "Forme", arabic: "وَزْن", definition: "Patron morphologique qui ajoute une fonction ou une nuance aux lettres de la racine." },
        { term: "Contexte", arabic: "سِيَاق", definition: "Phrase, passage et situation qui déterminent le sens effectivement voulu." }
    ]
};
