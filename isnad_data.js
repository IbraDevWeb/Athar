// Athar Pro — données pédagogiques du module La Chaîne d’Or
// Le module distingue la chaîne complète d’un hadith de son « noyau » étudié ici.

window.GOLDEN_CHAIN_DATA = {
    meta: {
        title: 'La Chaîne d’Or',
        arabic: 'سلسلة الإسناد',
        subtitle: 'Suivre la parole, rencontrer les transmetteurs, comprendre la méthode.',
        editorialNote: 'Les itinéraires présentés sont des noyaux de chaînes célèbres. Une même parole peut être transmise par plusieurs voies et l’authentification ne dépend jamais d’un simple dessin : continuité, rencontre possible, précision, intégrité et comparaison des versions doivent être examinées ensemble.',
        sourcePolicy: 'Les exemples renvoient vers les notices des collections ou des narrateurs. Les appréciations sont formulées avec prudence et n’attribuent pas à toutes les chaînes le titre technique de « chaîne d’or ».',
        direction: 'Lecture de gauche à droite : transmetteur tardif vers source ancienne.'
    },
    generations: [
        { id: 'collector', label: 'Compilation', short: 'Recueil' },
        { id: 'atba', label: 'Successeurs des Successeurs', short: 'Atbāʿ' },
        { id: 'tabii', label: 'Successeurs', short: 'Tābiʿūn' },
        { id: 'companion', label: 'Compagnons', short: 'Ṣaḥāba' },
        { id: 'prophet', label: 'Source prophétique', short: 'Prophète ﷺ' }
    ],
    narrators: [
        {
            id: 'prophet',
            name: 'Le Prophète Muḥammad ﷺ',
            arabic: 'محمد رسول الله ﷺ',
            dates: 'env. 570–632 / 11 H.',
            city: 'La Mecque · Médine',
            generation: 'prophet',
            role: 'Source de la Sunna',
            monogram: 'ﷺ',
            summary: 'La chaîne remonte à l’enseignement prophétique rapporté par les Compagnons.',
            transmission: 'Parole, acte, approbation ou description transmis aux Compagnons.',
            appraisal: 'Le travail critique porte sur la transmission jusqu’à cette source.'
        },
        {
            id: 'malik',
            name: 'Mālik ibn Anas',
            arabic: 'مالك بن أنس',
            dates: '93–179 H.',
            city: 'Médine',
            generation: 'atba',
            role: 'Imam · compilateur du Muwaṭṭaʾ',
            monogram: 'م',
            summary: 'Imam médinois dont la transmission d’après Nāfiʿ est devenue l’un des itinéraires les plus célèbres du hadith.',
            transmission: 'Reçoit de Nāfiʿ et consigne de nombreuses traditions dans le Muwaṭṭaʾ.',
            appraisal: 'Figure majeure de la transmission médinoise.'
        },
        {
            id: 'nafi',
            name: 'Nāfiʿ, mawlā d’Ibn ʿUmar',
            arabic: 'نافع مولى ابن عمر',
            dates: 'm. 117 H.',
            city: 'Médine',
            generation: 'tabii',
            role: 'Tābiʿī · transmetteur',
            monogram: 'ن',
            summary: 'Affranchi et élève proche d’Ibn ʿUmar, il transmet sa pratique et ses récits.',
            transmission: 'Longue fréquentation d’Ibn ʿUmar et transmission à Mālik ainsi qu’à d’autres élèves.',
            appraisal: 'Maillon central de l’école médinoise.'
        },
        {
            id: 'ibn-umar',
            name: 'ʿAbd Allāh ibn ʿUmar',
            arabic: 'عبد الله بن عمر',
            dates: 'env. 10 av. H.–73 H.',
            city: 'Médine',
            generation: 'companion',
            role: 'Compagnon · juriste',
            monogram: 'ع',
            summary: 'Compagnon connu pour son attention minutieuse à la pratique prophétique.',
            transmission: 'Rapporte ce qu’il a entendu ou observé du Prophète ﷺ.',
            appraisal: 'Référence majeure du hadith et du fiqh médinois.'
        },
        {
            id: 'zuhri',
            name: 'Ibn Shihāb al-Zuhrī',
            arabic: 'ابن شهاب الزهري',
            dates: 'env. 51–124 H.',
            city: 'Médine · Syrie',
            generation: 'tabii',
            role: 'Tābiʿī · traditionniste',
            monogram: 'ز',
            summary: 'Grand transmetteur des premières générations, actif dans la collecte et l’enseignement du hadith.',
            transmission: 'Transmet notamment d’après Sālim ibn ʿAbd Allāh.',
            appraisal: 'Route médinoise très étudiée dans les collections.'
        },
        {
            id: 'salim',
            name: 'Sālim ibn ʿAbd Allāh',
            arabic: 'سالم بن عبد الله',
            dates: 'm. env. 106 H.',
            city: 'Médine',
            generation: 'tabii',
            role: 'Tābiʿī · juriste',
            monogram: 'س',
            summary: 'Fils d’Ibn ʿUmar et l’un des grands juristes médinois.',
            transmission: 'Transmet directement de son père ʿAbd Allāh ibn ʿUmar.',
            appraisal: 'Chaîne familiale et savante de Médine.'
        },
        {
            id: 'hisham',
            name: 'Hishām ibn ʿUrwa',
            arabic: 'هشام بن عروة',
            dates: '61–146 H.',
            city: 'Médine · Irak',
            generation: 'atba',
            role: 'Transmetteur',
            monogram: 'هـ',
            summary: 'Transmetteur prolifique de l’enseignement de son père ʿUrwa.',
            transmission: 'Rapporte de son père des récits provenant notamment de ʿĀʾisha.',
            appraisal: 'Noyau familial très présent dans les collections.'
        },
        {
            id: 'urwa',
            name: 'ʿUrwa ibn al-Zubayr',
            arabic: 'عروة بن الزبير',
            dates: 'env. 23–94 H.',
            city: 'Médine',
            generation: 'tabii',
            role: 'Tābiʿī · juriste et historien',
            monogram: 'ع',
            summary: 'Neveu de ʿĀʾisha et l’un des sept juristes de Médine.',
            transmission: 'Interroge sa tante ʿĀʾisha sur la vie domestique, le pèlerinage et la Sīra.',
            appraisal: 'Proximité familiale et apprentissage savant.'
        },
        {
            id: 'aisha',
            name: 'ʿĀʾisha, Mère des croyants',
            arabic: 'عائشة أم المؤمنين',
            dates: 'm. 58 H.',
            city: 'Médine',
            generation: 'companion',
            role: 'Compagne · juriste',
            monogram: 'ع',
            summary: 'Source essentielle pour la vie familiale du Prophète ﷺ, le droit et l’interprétation des récits.',
            transmission: 'Rapporte directement paroles, actes et pratiques du Prophète ﷺ.',
            appraisal: 'Autorité majeure parmi les Compagnons.'
        },
        {
            id: 'amash',
            name: 'Sulaymān al-Aʿmash',
            arabic: 'سليمان الأعمش',
            dates: 'env. 60–148 H.',
            city: 'Koufa',
            generation: 'atba',
            role: 'Traditionniste et lecteur',
            monogram: 'أ',
            summary: 'Grand transmetteur koufien, connu pour sa mémoire et sa maîtrise des récits irakiens.',
            transmission: 'Transmet l’école d’Ibrāhīm al-Nakhaʿī.',
            appraisal: 'Figure centrale de la transmission koufienne.'
        },
        {
            id: 'ibrahim',
            name: 'Ibrāhīm al-Nakhaʿī',
            arabic: 'إبراهيم النخعي',
            dates: 'env. 47–96 H.',
            city: 'Koufa',
            generation: 'tabii',
            role: 'Tābiʿī · juriste',
            monogram: 'إ',
            summary: 'Juriste de Koufa, héritier de l’enseignement des élèves d’Ibn Masʿūd.',
            transmission: 'Reçoit notamment de ʿAlqama et structure l’héritage juridique koufien.',
            appraisal: 'Point de passage majeur entre deux générations de Koufa.'
        },
        {
            id: 'alqama-qays',
            name: 'ʿAlqama ibn Qays',
            arabic: 'علقمة بن قيس',
            dates: 'm. env. 62 H.',
            city: 'Koufa',
            generation: 'tabii',
            role: 'Tābiʿī · élève d’Ibn Masʿūd',
            monogram: 'ع',
            summary: 'Élève proche d’Ibn Masʿūd, réputé lui ressembler dans sa conduite et son enseignement.',
            transmission: 'Conserve et enseigne le fiqh, la récitation et les récits d’Ibn Masʿūd.',
            appraisal: 'Maillon emblématique de l’école koufienne.'
        },
        {
            id: 'ibn-masud',
            name: 'ʿAbd Allāh ibn Masʿūd',
            arabic: 'عبد الله بن مسعود',
            dates: 'm. 32 H.',
            city: 'Médine · Koufa',
            generation: 'companion',
            role: 'Compagnon · lecteur et juriste',
            monogram: 'م',
            summary: 'Compagnon et grand enseignant du Coran envoyé à Koufa.',
            transmission: 'Rapporte l’enseignement prophétique et forme une école savante durable.',
            appraisal: 'Fondation de nombreuses routes irakiennes.'
        },
        {
            id: 'yahya-ansari',
            name: 'Yaḥyā ibn Saʿīd al-Anṣārī',
            arabic: 'يحيى بن سعيد الأنصاري',
            dates: 'm. 143 H.',
            city: 'Médine',
            generation: 'atba',
            role: 'Traditionniste et juge',
            monogram: 'ي',
            summary: 'Transmetteur médinois célèbre, notamment pour la route du hadith des intentions.',
            transmission: 'Reçoit de Muḥammad ibn Ibrāhīm al-Taymī.',
            appraisal: 'Maillon diffusé ensuite par de nombreux élèves.'
        },
        {
            id: 'muhammad-taymi',
            name: 'Muḥammad ibn Ibrāhīm al-Taymī',
            arabic: 'محمد بن إبراهيم التيمي',
            dates: 'm. env. 120 H.',
            city: 'Médine',
            generation: 'tabii',
            role: 'Tābiʿī · transmetteur',
            monogram: 'م',
            summary: 'Transmet le hadith des intentions d’après ʿAlqama ibn Waqqāṣ.',
            transmission: 'Lien médinois entre ʿAlqama ibn Waqqāṣ et Yaḥyā al-Anṣārī.',
            appraisal: 'Route célèbre par sa diffusion ultérieure.'
        },
        {
            id: 'alqama-waqqas',
            name: 'ʿAlqama ibn Waqqāṣ al-Laythī',
            arabic: 'علقمة بن وقاص الليثي',
            dates: 'Ier siècle H.',
            city: 'Médine',
            generation: 'tabii',
            role: 'Tābiʿī · transmetteur',
            monogram: 'ع',
            summary: 'Transmet le hadith des intentions d’après ʿUmar ibn al-Khaṭṭāb.',
            transmission: 'Écoute le récit de ʿUmar et le transmet à Muḥammad al-Taymī.',
            appraisal: 'Maillon ancien de la route médinoise.'
        },
        {
            id: 'umar',
            name: 'ʿUmar ibn al-Khaṭṭāb',
            arabic: 'عمر بن الخطاب',
            dates: 'm. 23 H.',
            city: 'La Mecque · Médine',
            generation: 'companion',
            role: 'Compagnon · calife',
            monogram: 'ع',
            summary: 'Compagnon et deuxième calife bien guidé.',
            transmission: 'Rapporte le principe selon lequel les actes valent selon les intentions.',
            appraisal: 'Compagnon source de cette route célèbre.'
        }
    ],
    chains: [
        {
            id: 'malik-nafi',
            title: 'La chaîne médinoise emblématique',
            arabic: 'مالك عن نافع عن ابن عمر',
            badge: 'Souvent appelée « chaîne d’or »',
            region: 'Médine',
            collection: 'al-Muwaṭṭaʾ de Mālik',
            reference: 'Muwaṭṭaʾ, livre 54, hadith 17',
            sourceUrl: 'https://sunnah.com/malik/54/17',
            color: '#b89243',
            summary: 'Une route courte, médinoise et fondée sur une fréquentation directe entre chaque génération.',
            scholarlyNote: 'Cette formulation est fréquemment citée parmi les itinéraires les plus solides. Le titre ne dispense jamais d’étudier le texte, les variantes et l’ensemble des voies.',
            route: ['malik', 'nafi', 'ibn-umar', 'prophet'],
            linkLabels: ['enseignement à Médine', 'fréquentation directe', 'compagnonnage'],
            sample: {
                theme: 'Respect de la propriété',
                arabic: 'لاَ يَحْتَلِبَنَّ أَحَدٌ مَاشِيَةَ أَحَدٍ إِلاَّ بِإِذْنِهِ',
                french: 'Personne ne doit traire le bétail d’autrui sans son autorisation.',
                note: 'Extrait court du récit transmis dans le Muwaṭṭaʾ.'
            }
        },
        {
            id: 'zuhri-salim',
            title: 'L’autre grande route d’Ibn ʿUmar',
            arabic: 'الزهري عن سالم عن ابن عمر',
            badge: 'Route médinoise familiale',
            region: 'Médine · Syrie',
            collection: 'Jāmiʿ al-Tirmidhī',
            reference: 'al-Tirmidhī 1244',
            sourceUrl: 'https://sunnah.com/tirmidhi:1244',
            color: '#557f77',
            summary: 'Une chaîne où Sālim transmet de son père Ibn ʿUmar, puis al-Zuhrī diffuse cet héritage.',
            scholarlyNote: 'Les maîtres du hadith ont comparé cette route à celle de Nāfiʿ. La préférence peut varier selon le récit précis et la formulation conservée.',
            route: ['zuhri', 'salim', 'ibn-umar', 'prophet'],
            linkLabels: ['enseignement médinois', 'filiation et étude', 'compagnonnage'],
            sample: {
                theme: 'Vente et condition',
                arabic: 'مَنْ بَاعَ نَخْلًا قَدْ أُبِّرَتْ فَثَمَرَتُهَا لِلْبَائِعِ إِلَّا أَنْ يَشْتَرِطَ الْمُبْتَاعُ',
                french: 'Lorsqu’un palmier déjà pollinisé est vendu, son fruit reste au vendeur, sauf condition posée par l’acheteur.',
                note: 'Le commentaire de la notice compare explicitement les routes d’al-Zuhrī et de Nāfiʿ.'
            }
        },
        {
            id: 'hisham-urwa',
            title: 'Une chaîne familiale de Médine',
            arabic: 'هشام عن أبيه عن عائشة',
            badge: 'Mémoire familiale et savoir',
            region: 'Médine',
            collection: 'Ṣaḥīḥ al-Bukhārī',
            reference: 'al-Bukhārī 1579',
            sourceUrl: 'https://sunnah.com/bukhari:1579',
            color: '#8a6b91',
            summary: 'Hishām transmet de son père ʿUrwa, qui interroge sa tante ʿĀʾisha sur la vie et les pratiques prophétiques.',
            scholarlyNote: 'La proximité familiale explique l’accès au savoir ; elle ne remplace pas l’analyse critique de chaque transmission et de chaque période de narration.',
            route: ['hisham', 'urwa', 'aisha', 'prophet'],
            linkLabels: ['enseignement du père', 'neveu et élève', 'vie auprès du Prophète ﷺ'],
            sample: {
                theme: 'Entrée à La Mecque',
                arabic: 'أَنَّ النَّبِيَّ ﷺ دَخَلَ عَامَ الْفَتْحِ مِنْ كَدَاءٍ أَعْلَى مَكَّةَ',
                french: 'L’année de l’ouverture de La Mecque, le Prophète ﷺ entra par Kadāʾ, dans la partie haute de la ville.',
                note: 'Exemple rapporté par Hishām, de son père, d’après ʿĀʾisha.'
            }
        },
        {
            id: 'kufa-school',
            title: 'L’école de Koufa',
            arabic: 'الأعمش عن إبراهيم عن علقمة عن ابن مسعود',
            badge: 'Transmission d’une école savante',
            region: 'Koufa',
            collection: 'Notices de transmetteurs et recueils irakiens',
            reference: 'Route biographique koufienne',
            sourceUrl: 'https://sunnah.com/narrator/5715',
            color: '#687da1',
            summary: 'Cette route montre comment l’enseignement d’Ibn Masʿūd devient une école durable à travers ʿAlqama, Ibrāhīm et al-Aʿmash.',
            scholarlyNote: 'Le module présente ici une filiation d’enseignement célèbre. Tous les récits attribués à cette école ne suivent pas nécessairement chaque maillon sous cette forme exacte.',
            route: ['amash', 'ibrahim', 'alqama-qays', 'ibn-masud', 'prophet'],
            linkLabels: ['héritage koufien', 'élève et héritier', 'élève proche', 'compagnonnage'],
            sample: {
                theme: 'Une école de récitation et de fiqh',
                arabic: 'كان أصحاب عبد الله يقرئون الناس القرآن ويعلمونهم السنة',
                french: 'Les élèves d’Ibn Masʿūd enseignaient aux gens le Coran et la Sunna.',
                note: 'Repère biographique : cette carte explique une école de transmission, non l’isnād complet d’un hadith unique.'
            }
        },
        {
            id: 'intentions',
            title: 'La route du hadith des intentions',
            arabic: 'يحيى عن محمد عن علقمة عن عمر',
            badge: 'Une route devenue universelle',
            region: 'Médine',
            collection: 'Ṣaḥīḥ al-Bukhārī',
            reference: 'al-Bukhārī 1',
            sourceUrl: 'https://sunnah.com/bukhari:1',
            color: '#9a6755',
            summary: 'Un récit transmis par une route médinoise étroite à ses débuts, puis largement diffusé par les élèves de Yaḥyā al-Anṣārī.',
            scholarlyNote: 'La célébrité ultérieure d’un hadith ne signifie pas qu’il possède de nombreuses routes à chaque génération. La diffusion doit être lue niveau par niveau.',
            route: ['yahya-ansari', 'muhammad-taymi', 'alqama-waqqas', 'umar', 'prophet'],
            linkLabels: ['enseignement direct', 'enseignement direct', 'écoute de ʿUmar', 'compagnonnage'],
            sample: {
                theme: 'L’intention',
                arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
                french: 'Les actes ne valent que selon les intentions.',
                note: 'Le Ṣaḥīḥ d’al-Bukhārī s’ouvre par ce hadith.'
            }
        }
    ],
    lessons: [
        {
            id: 'read-isnad',
            title: 'Lire un isnād sans se perdre',
            duration: '4 min',
            steps: [
                { title: 'Identifier la direction', text: 'Le compilateur cite son maître, puis chaque transmetteur cite la personne dont il a reçu le récit. On remonte ainsi vers le Compagnon puis vers le Prophète ﷺ.' },
                { title: 'Observer les générations', text: 'Une chaîne courte n’est pas automatiquement authentique. Il faut vérifier que les personnes ont pu se rencontrer et que la formulation indique bien une transmission.' },
                { title: 'Revenir au texte', text: 'L’isnād protège le trajet du récit, mais le matn doit lui aussi être comparé aux autres versions et compris dans son contexte.' }
            ]
        },
        {
            id: 'compare-routes',
            title: 'Comparer deux routes',
            duration: '5 min',
            steps: [
                { title: 'Même Compagnon, deux élèves', text: 'Ibn ʿUmar est transmis par Nāfiʿ et par son fils Sālim. Ces routes peuvent se confirmer, préciser ou parfois conserver des formulations différentes.' },
                { title: 'Comparer les mots', text: 'Le critique examine les ajouts, les omissions, les inversions et la manière dont chaque élève rapporte le même événement.' },
                { title: 'Éviter le classement mécanique', text: 'Une réputation générale ne suffit pas : l’examen porte sur un récit précis, dans une voie précise, à travers des témoins précis.' }
            ]
        },
        {
            id: 'city-schools',
            title: 'Voir circuler le savoir',
            duration: '4 min',
            steps: [
                { title: 'Médine', text: 'La ville réunit des Compagnons, leurs familles et de grands juristes. Plusieurs chaînes courtes y prennent forme.' },
                { title: 'Koufa', text: 'L’enseignement d’Ibn Masʿūd devient une véritable école, transmise par des générations d’élèves et de juristes.' },
                { title: 'Diffusion', text: 'Les transmetteurs voyagent, enseignent et sont à leur tour cités dans des collections composées parfois très loin de la ville d’origine.' }
            ]
        }
    ],
    glossary: [
        { term: 'Isnād', definition: 'La chaîne des personnes qui transmettent un récit.' },
        { term: 'Matn', definition: 'Le contenu verbal du récit transmis.' },
        { term: 'Rāwī', definition: 'Un narrateur ou transmetteur dans la chaîne.' },
        { term: 'Samāʿ', definition: 'L’audition directe d’un maître, selon les usages de transmission.' },
        { term: 'Ṭabaqa', definition: 'Une génération ou couche chronologique de transmetteurs.' }
    ]
};
