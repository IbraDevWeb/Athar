// Athar Pro — données pédagogiques du module Transmission
// Les liens représentent soit un enseignement direct, soit une filiation de transmission explicitement signalée.

const SILSILA_THEMES = {
    pre: {
        label: 'Fondations',
        shortLabel: 'Fondations',
        color: 'text-slate-700',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        btn: 'bg-slate-700',
        accent: '#475569',
        icon: 'landmark'
    },
    fiqh: {
        label: 'Fiqh & écoles',
        shortLabel: 'Fiqh',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        btn: 'bg-emerald-700',
        accent: '#047857',
        icon: 'scale'
    },
    hadith: {
        label: 'Hadith & critique',
        shortLabel: 'Hadith',
        color: 'text-violet-700',
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        btn: 'bg-violet-700',
        accent: '#6d28d9',
        icon: 'scroll-text'
    },
    quran: {
        label: 'Qirāʾāt & riwāyāt',
        shortLabel: 'Lectures',
        color: 'text-amber-800',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        btn: 'bg-amber-700',
        accent: '#b45309',
        icon: 'book-open'
    }
};

const makeScholar = (id, label, arabicName, group, details = {}) => ({
    id,
    label,
    arabicName,
    group,
    type: 'scholar',
    role: 'Savant',
    dates: 'Dates à préciser',
    region: '',
    city: '',
    era: '',
    bio: '',
    legacy: '',
    contributions: [],
    works: [],
    keywords: [],
    sources: [],
    relations: { teachers: {} },
    ...details
});

const SILSILA_DATA = {
    nodes: [
        // ─────────────────────────────────────────────
        // FONDATIONS : Prophète et Compagnons
        // ─────────────────────────────────────────────
        makeScholar(1, 'Le Prophète Muḥammad ﷺ', 'محمد رسول الله ﷺ', 'pre', {
            type: 'prophet',
            role: 'Messager d’Allah',
            dates: 'env. 570–632 / 53 av. H.–11 H.',
            region: 'Arabie',
            city: 'La Mecque · Médine',
            era: 'Ier siècle H.',
            bio: 'Les sciences islamiques de la récitation, de la Sunna et du droit se rattachent à l’enseignement transmis par le Prophète ﷺ. Le graphe commence ici comme repère pédagogique, sans réduire la transmission religieuse à un seul schéma linéaire.',
            legacy: 'Transmission du Coran, explication de la Révélation et enseignement de la pratique religieuse à ses Compagnons.',
            contributions: ['Transmission du Coran', 'Enseignement de la Sunna', 'Formation des Compagnons'],
            keywords: ['Révélation', 'Sunna', 'Coran'],
            sources: ['Coran', 'Collections de hadith', 'Ouvrages de sīra']
        }),
        makeScholar(2, 'ʿAbd Allāh ibn ʿUmar', 'عبد الله بن عمر', 'pre', {
            type: 'companion',
            role: 'Compagnon · juriste de Médine',
            dates: 'env. 10 av. H.–73 H. / 610–693',
            region: 'Ḥijāz',
            city: 'Médine',
            era: 'Ier siècle H.',
            bio: 'Fils de ʿUmar ibn al-Khaṭṭāb, il fut connu pour son attachement minutieux à la pratique prophétique. De nombreux juristes et transmetteurs médinois ont étudié auprès de lui.',
            legacy: 'Figure majeure du hadith et du fiqh médinois, notamment à travers Nāfiʿ et Sālim.',
            contributions: ['Transmission de nombreux hadiths', 'Fiqh de Médine', 'Formation de Nāfiʿ'],
            keywords: ['Compagnon', 'Médine', 'Hadith'],
            sources: ['Ibn Saʿd, al-Ṭabaqāt', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ', 'Ibn Ḥajar, al-Iṣāba'],
            relations: { teachers: { 1: 'Compagnonnage et enseignement prophétique' } }
        }),
        makeScholar(3, 'ʿAbd Allāh ibn Masʿūd', 'عبد الله بن مسعود', 'pre', {
            type: 'companion',
            role: 'Compagnon · lecteur et juriste',
            dates: 'm. 32 H. / 652–653',
            region: 'Ḥijāz · Irak',
            city: 'Médine · Koufa',
            era: 'Ier siècle H.',
            bio: 'Parmi les premiers musulmans et les grands lecteurs du Coran. Son enseignement à Koufa a profondément marqué les traditions juridiques et coraniques de l’Irak.',
            legacy: 'Une référence centrale pour l’école savante de Koufa, transmise notamment par ʿAlqama.',
            contributions: ['Lecture du Coran', 'Fiqh de Koufa', 'Transmission de hadiths'],
            keywords: ['Compagnon', 'Koufa', 'Qirāʾa'],
            sources: ['Ibn Saʿd, al-Ṭabaqāt', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ', 'Ibn Ḥajar, al-Iṣāba'],
            relations: { teachers: { 1: 'Compagnonnage et enseignement prophétique' } }
        }),
        makeScholar(4, 'ʿAbd Allāh ibn ʿAbbās', 'عبد الله بن عباس', 'pre', {
            type: 'companion',
            role: 'Compagnon · exégète',
            dates: '3 av. H.–68 H. / 619–687',
            region: 'Ḥijāz',
            city: 'La Mecque · Médine',
            era: 'Ier siècle H.',
            bio: 'Cousin du Prophète ﷺ, reconnu pour sa connaissance du Coran, de la langue arabe et de l’exégèse. Il forma une importante génération d’élèves à La Mecque.',
            legacy: 'Une des principales références anciennes du tafsīr et du fiqh.',
            contributions: ['Tafsīr', 'Langue arabe', 'Fiqh'],
            keywords: ['Compagnon', 'Tafsīr', 'La Mecque'],
            sources: ['Ibn Saʿd, al-Ṭabaqāt', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ', 'Ibn Ḥajar, al-Iṣāba'],
            relations: { teachers: { 1: 'Compagnonnage et enseignement prophétique' } }
        }),
        makeScholar(5, 'ʿAlī ibn Abī Ṭālib', 'علي بن أبي طالب', 'pre', {
            type: 'companion',
            role: 'Compagnon · calife · juriste',
            dates: 'env. 23 av. H.–40 H. / 600–661',
            region: 'Ḥijāz · Irak',
            city: 'Médine · Koufa',
            era: 'Ier siècle H.',
            bio: 'Cousin et gendre du Prophète ﷺ, quatrième calife bien guidé. Il occupe une place majeure dans les traditions juridiques, spirituelles et coraniques.',
            legacy: 'Son enseignement est présent dans plusieurs chaînes de lecture et traditions juridiques de Koufa.',
            contributions: ['Fiqh', 'Lecture du Coran', 'Transmission de hadiths'],
            keywords: ['Ahl al-Bayt', 'Koufa', 'Calife'],
            sources: ['Ibn Saʿd, al-Ṭabaqāt', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ', 'Ibn Ḥajar, al-Iṣāba'],
            relations: { teachers: { 1: 'Compagnonnage et enseignement prophétique' } }
        }),
        makeScholar(6, 'Ubayy ibn Kaʿb', 'أبي بن كعب', 'pre', {
            type: 'companion',
            role: 'Compagnon · maître de récitation',
            dates: 'm. entre 19 et 35 H.',
            region: 'Ḥijāz',
            city: 'Médine',
            era: 'Ier siècle H.',
            bio: 'Compagnon médinois compté parmi les grands connaisseurs du Coran. Les ouvrages de qirāʾāt rattachent à son enseignement plusieurs lignées de lecture.',
            legacy: 'Repère majeur dans l’histoire de l’enseignement coranique à Médine.',
            contributions: ['Mémorisation du Coran', 'Enseignement de la récitation', 'Transmission'],
            keywords: ['Coran', 'Médine', 'Qirāʾāt'],
            sources: ['Ibn Saʿd, al-Ṭabaqāt', 'Ibn al-Jazarī, Ghāyat al-Nihāya', 'Ibn Ḥajar, al-Iṣāba'],
            relations: { teachers: { 1: 'Compagnonnage et récitation auprès du Prophète ﷺ' } }
        }),
        makeScholar(7, 'Zayd ibn Thābit', 'زيد بن ثابت', 'pre', {
            type: 'companion',
            role: 'Compagnon · scribe et lecteur',
            dates: 'env. 11 av. H.–45 H. / 611–665',
            region: 'Ḥijāz',
            city: 'Médine',
            era: 'Ier siècle H.',
            bio: 'Scribe de la Révélation et juriste médinois. Il participa aux travaux de collecte du texte coranique sous Abū Bakr puis ʿUthmān.',
            legacy: 'Figure centrale de la transmission écrite et orale du Coran à Médine.',
            contributions: ['Écriture de la Révélation', 'Collecte du muṣḥaf', 'Fiqh des successions'],
            keywords: ['Scribe', 'Muṣḥaf', 'Médine'],
            sources: ['al-Bukhārī, Ṣaḥīḥ', 'Ibn Saʿd, al-Ṭabaqāt', 'Ibn Ḥajar, al-Iṣāba'],
            relations: { teachers: { 1: 'Compagnonnage et enseignement prophétique' } }
        }),
        makeScholar(8, 'Abū al-Dardāʾ', 'أبو الدرداء', 'pre', {
            type: 'companion',
            role: 'Compagnon · enseignant du Coran',
            dates: 'm. 32 H. / 652',
            region: 'Ḥijāz · Syrie',
            city: 'Médine · Damas',
            era: 'Ier siècle H.',
            bio: 'Compagnon connu pour son enseignement du Coran à Damas. La tradition syrienne de récitation se rattache à son école par plusieurs intermédiaires.',
            legacy: 'Un des fondements de l’enseignement coranique ancien en Syrie.',
            contributions: ['Enseignement du Coran', 'Transmission de hadiths', 'Formation de lecteurs syriens'],
            keywords: ['Damas', 'Coran', 'Compagnon'],
            sources: ['Ibn Saʿd, al-Ṭabaqāt', 'Ibn al-Jazarī, Ghāyat al-Nihāya', 'Ibn Ḥajar, al-Iṣāba'],
            relations: { teachers: { 1: 'Compagnonnage et enseignement prophétique' } }
        }),

        // ─────────────────────────────────────────────
        // FIQH : Médine, Koufa et écoles juridiques
        // ─────────────────────────────────────────────
        makeScholar(20, 'Nāfiʿ, mawlā d’Ibn ʿUmar', 'نافع مولى ابن عمر', 'fiqh', {
            type: 'successor',
            role: 'Tābiʿī · transmetteur médinois',
            dates: 'm. 117 H. / 735',
            region: 'Ḥijāz',
            city: 'Médine',
            era: 'Ier–IIe siècle H.',
            bio: 'Affranchi et élève d’Ibn ʿUmar. Sa transmission d’après Ibn ʿUmar, notamment par Mālik, est devenue l’un des itinéraires les plus célèbres du hadith médinois.',
            legacy: 'Maillon central entre le fiqh des Compagnons et l’enseignement de Mālik.',
            contributions: ['Hadith médinois', 'Fiqh', 'Formation de Mālik'],
            keywords: ['Chaîne d’or', 'Médine', 'Tābiʿī'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 2: 'Élève direct et transmetteur d’Ibn ʿUmar' } }
        }),
        makeScholar(21, 'Ibn Shihāb al-Zuhrī', 'ابن شهاب الزهري', 'hadith', {
            type: 'successor',
            role: 'Tābiʿī · traditionniste',
            dates: 'env. 51–124 H. / 671–742',
            region: 'Ḥijāz · Syrie',
            city: 'Médine · Damas',
            era: 'Ier–IIe siècle H.',
            bio: 'Grand savant des premières générations, actif dans la collecte et l’enseignement du hadith. Son rôle dans l’essor des compilations écrites est majeur, même si l’écriture du hadith lui est antérieure.',
            legacy: 'Une source importante pour Mālik et de nombreux traditionnistes du IIe siècle H.',
            contributions: ['Collecte du hadith', 'Isnād', 'Histoire des premières générations'],
            keywords: ['Hadith', 'Médine', 'Compilation'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ']
        }),
        makeScholar(24, 'ʿAlqama ibn Qays', 'علقمة بن قيس', 'fiqh', {
            type: 'successor',
            role: 'Tābiʿī · juriste de Koufa',
            dates: 'm. 62 H. / 681',
            region: 'Irak',
            city: 'Koufa',
            era: 'Ier siècle H.',
            bio: 'Élève proche d’Ibn Masʿūd et l’une des grandes figures de son école à Koufa. Son enseignement relie le fiqh des Compagnons à Ibrāhīm al-Nakhaʿī.',
            legacy: 'Maillon essentiel de la lignée juridique koufienne.',
            contributions: ['Fiqh de Koufa', 'Transmission d’Ibn Masʿūd', 'Formation d’al-Nakhaʿī'],
            keywords: ['Koufa', 'Tābiʿī', 'Fiqh'],
            sources: ['Ibn Saʿd, al-Ṭabaqāt', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 3: 'Élève direct d’Ibn Masʿūd' } }
        }),
        makeScholar(22, 'Ibrāhīm al-Nakhaʿī', 'إبراهيم النخعي', 'fiqh', {
            type: 'successor',
            role: 'Juriste de Koufa',
            dates: 'env. 46–96 H. / 666–715',
            region: 'Irak',
            city: 'Koufa',
            era: 'Ier siècle H.',
            bio: 'Juriste majeur de Koufa, héritier de l’école d’Ibn Masʿūd par ʿAlqama et d’autres maîtres. Son raisonnement juridique a fortement influencé Ḥammād.',
            legacy: 'Une référence structurante du fiqh irakien avant Abū Ḥanīfa.',
            contributions: ['Fiqh de Koufa', 'Analyse des cas', 'Transmission des avis des Compagnons'],
            keywords: ['Koufa', 'Fiqh', 'Tābiʿī'],
            sources: ['al-Dhahabī, Siyar Aʿlām al-Nubalāʾ', 'al-Mizzī, Tahdhīb al-Kamāl'],
            relations: { teachers: { 24: 'Transmission de l’école d’Ibn Masʿūd' } }
        }),
        makeScholar(23, 'Ḥammād ibn Abī Sulaymān', 'حماد بن أبي سليمان', 'fiqh', {
            type: 'successor',
            role: 'Juriste et maître d’Abū Ḥanīfa',
            dates: 'm. 120 H. / 738',
            region: 'Irak',
            city: 'Koufa',
            era: 'Ier–IIe siècle H.',
            bio: 'Juriste de Koufa et principal maître juridique d’Abū Ḥanīfa. Il transmit l’héritage d’Ibrāhīm al-Nakhaʿī et forma un cercle de discussion juridique.',
            legacy: 'Pont direct entre l’école ancienne de Koufa et le développement du madhhab hanafite.',
            contributions: ['Enseignement juridique', 'Fiqh hypothétique', 'Formation d’Abū Ḥanīfa'],
            keywords: ['Koufa', 'Hanafisme', 'Fiqh'],
            sources: ['al-Khaṭīb al-Baghdādī, Tārīkh Baghdād', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 22: 'Élève et continuateur de son enseignement' } }
        }),
        makeScholar(10, 'Abū Ḥanīfa al-Nuʿmān', 'أبو حنيفة النعمان', 'fiqh', {
            type: 'imam',
            role: 'Imam du madhhab hanafite',
            dates: '80–150 H. / 699–767',
            region: 'Irak',
            city: 'Koufa · Bagdad',
            era: 'IIe siècle H.',
            bio: 'Juriste de Koufa autour duquel s’est formée l’école hanafite. Son enseignement collectif accordait une place importante au raisonnement analogique, à la cohérence des principes et à l’examen de cas nouveaux.',
            legacy: 'Le madhhab hanafite fut systématisé et diffusé principalement par ses élèves.',
            contributions: ['Raisonnement juridique', 'Formation d’une école', 'Fiqh des transactions'],
            works: ['Enseignement transmis par ses élèves', 'al-Fiqh al-Akbar — attribution et recensions discutées'],
            keywords: ['Hanafite', 'Koufa', 'Qiyās'],
            sources: ['al-Khaṭīb al-Baghdādī, Tārīkh Baghdād', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 23: 'Principal maître de fiqh' } }
        }),
        makeScholar(14, 'Abū Yūsuf', 'أبو يوسف يعقوب بن إبراهيم', 'fiqh', {
            type: 'imam',
            role: 'Juriste hanafite · grand juge',
            dates: '113–182 H. / 731–798',
            region: 'Irak',
            city: 'Koufa · Bagdad',
            era: 'IIe siècle H.',
            bio: 'Élève majeur d’Abū Ḥanīfa. Son activité de juge et ses écrits contribuèrent fortement à la diffusion institutionnelle du fiqh hanafite.',
            legacy: 'Il adapta et transmit l’enseignement de son maître dans le contexte judiciaire abbasside.',
            contributions: ['Jurisprudence', 'Justice', 'Fiscalité publique'],
            works: ['Kitāb al-Kharāj', 'Ikhtilāf Abī Ḥanīfa wa-Ibn Abī Laylā'],
            keywords: ['Hanafite', 'Qāḍī', 'Bagdad'],
            sources: ['al-Khaṭīb al-Baghdādī, Tārīkh Baghdād', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 10: 'Élève majeur d’Abū Ḥanīfa' } }
        }),
        makeScholar(15, 'Muḥammad al-Shaybānī', 'محمد بن الحسن الشيباني', 'fiqh', {
            type: 'imam',
            role: 'Juriste hanafite · auteur',
            dates: 'env. 132–189 H. / 749–805',
            region: 'Irak',
            city: 'Koufa · Bagdad',
            era: 'IIe siècle H.',
            bio: 'Élève d’Abū Ḥanīfa et d’Abū Yūsuf, il étudia également auprès de Mālik. Ses ouvrages constituent la base textuelle classique du madhhab hanafite.',
            legacy: 'Il joua un rôle de pont entre les milieux de Koufa, Médine et l’enseignement d’al-Shāfiʿī.',
            contributions: ['Codification du fiqh hanafite', 'Droit international ancien', 'Transmission inter-écoles'],
            works: ['al-Aṣl', 'al-Jāmiʿ al-Kabīr', 'al-Siyar al-Kabīr'],
            keywords: ['Hanafite', 'Auteur', 'Siyar'],
            sources: ['al-Khaṭīb al-Baghdādī, Tārīkh Baghdād', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 10: 'Élève d’Abū Ḥanīfa', 14: 'Étudia également auprès d’Abū Yūsuf' } }
        }),
        makeScholar(11, 'Mālik ibn Anas', 'مالك بن أنس', 'fiqh', {
            type: 'imam',
            role: 'Imam du madhhab malikite',
            dates: '93–179 H. / 711–795',
            region: 'Ḥijāz',
            city: 'Médine',
            era: 'IIe siècle H.',
            bio: 'Juriste et traditionniste de Médine. Son Muwaṭṭaʾ associe hadiths, avis de Compagnons et pratique juridique médinoise.',
            legacy: 'Son enseignement devint la base du madhhab malikite, diffusé notamment en Égypte, au Maghreb et en al-Andalus.',
            contributions: ['Muwaṭṭaʾ', 'Pratique des gens de Médine', 'Hadith et fiqh'],
            works: ['al-Muwaṭṭaʾ'],
            keywords: ['Malikite', 'Médine', 'Muwaṭṭaʾ'],
            sources: ['Qāḍī ʿIyāḍ, Tartīb al-Madārik', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 20: 'Hadith et fiqh médinois', 21: 'Transmission du hadith' } }
        }),
        makeScholar(16, 'ʿAbd al-Raḥmān ibn al-Qāsim', 'عبد الرحمن بن القاسم', 'fiqh', {
            type: 'imam',
            role: 'Grand transmetteur du fiqh malikite',
            dates: '132–191 H. / 750–806',
            region: 'Égypte · Ḥijāz',
            city: 'Fusṭāṭ · Médine',
            era: 'IIe siècle H.',
            bio: 'Élève égyptien de Mālik durant de longues années. Ses réponses et transmissions constituent la matière principale de la Mudawwana.',
            legacy: 'Une figure déterminante dans la formation du malikisme nord-africain.',
            contributions: ['Transmission de Mālik', 'Fiqh des nawāzil', 'Diffusion en Égypte et au Maghreb'],
            works: ['Réponses transmises dans al-Mudawwana'],
            keywords: ['Malikite', 'Égypte', 'Mudawwana'],
            sources: ['Qāḍī ʿIyāḍ, Tartīb al-Madārik', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 11: 'Élève majeur de Mālik' } }
        }),
        makeScholar(12, 'Muḥammad ibn Idrīs al-Shāfiʿī', 'محمد بن إدريس الشافعي', 'fiqh', {
            type: 'imam',
            role: 'Imam du madhhab shafiite',
            dates: '150–204 H. / 767–820',
            region: 'Ḥijāz · Irak · Égypte',
            city: 'La Mecque · Bagdad · Fusṭāṭ',
            era: 'IIe–IIIe siècle H.',
            bio: 'Juriste voyageur formé auprès de Mālik puis des juristes irakiens. Son œuvre systématise le raisonnement sur les sources du droit et la preuve juridique.',
            legacy: 'Fondateur du madhhab shafiite et auteur majeur des uṣūl al-fiqh.',
            contributions: ['Uṣūl al-fiqh', 'Synthèse hadith–raisonnement', 'Méthode de la preuve'],
            works: ['al-Risāla', 'al-Umm'],
            keywords: ['Shafiite', 'Uṣūl', 'Égypte'],
            sources: ['al-Bayhaqī, Manāqib al-Shāfiʿī', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 11: 'Étudia le Muwaṭṭaʾ et le fiqh auprès de Mālik', 15: 'Étudia le fiqh irakien auprès d’al-Shaybānī' } }
        }),
        makeScholar(18, 'Ismāʿīl al-Muzanī', 'إسماعيل المزني', 'fiqh', {
            type: 'imam',
            role: 'Juriste shafiite',
            dates: '175–264 H. / 791–878',
            region: 'Égypte',
            city: 'Fusṭāṭ',
            era: 'IIe–IIIe siècle H.',
            bio: 'Élève majeur d’al-Shāfiʿī en Égypte. Son Mukhtaṣar joua un rôle central dans la transmission et l’organisation du madhhab shafiite.',
            legacy: 'Il contribua à rendre l’enseignement de son maître accessible aux générations suivantes.',
            contributions: ['Résumé doctrinal', 'Diffusion du shafiisme', 'Débat juridique'],
            works: ['Mukhtaṣar al-Muzanī'],
            keywords: ['Shafiite', 'Égypte', 'Mukhtaṣar'],
            sources: ['al-Subkī, Ṭabaqāt al-Shāfiʿiyya', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 12: 'Élève égyptien d’al-Shāfiʿī' } }
        }),
        makeScholar(13, 'Aḥmad ibn Ḥanbal', 'أحمد بن حنبل', 'fiqh', {
            type: 'imam',
            role: 'Imam du madhhab hanbalite',
            dates: '164–241 H. / 780–855',
            region: 'Irak',
            city: 'Bagdad',
            era: 'IIe–IIIe siècle H.',
            bio: 'Traditionniste et juriste de Bagdad, élève d’al-Shāfiʿī parmi de nombreux maîtres. Il est particulièrement associé à la collecte du hadith et à son endurance durant la miḥna.',
            legacy: 'Son enseignement et ses réponses furent organisés par ses élèves et les générations hanbalites suivantes.',
            contributions: ['Musnad', 'Hadith', 'Fiqh fondé sur les textes'],
            works: ['al-Musnad', 'al-ʿIlal wa-Maʿrifat al-Rijāl'],
            keywords: ['Hanbalite', 'Bagdad', 'Musnad'],
            sources: ['Ibn Abī Yaʿlā, Ṭabaqāt al-Ḥanābila', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 12: 'Étudia auprès d’al-Shāfiʿī', 51: 'Étudia le hadith auprès de ʿAbd al-Razzāq' } }
        }),
        makeScholar(19, 'Abū Bakr al-Khallāl', 'أبو بكر الخلال', 'fiqh', {
            type: 'imam',
            role: 'Organisateur du madhhab hanbalite',
            dates: 'env. 235–311 H. / 849–923',
            region: 'Irak',
            city: 'Bagdad',
            era: 'IIIe–IVe siècle H.',
            bio: 'Il parcourut de nombreuses régions pour recueillir les réponses d’Aḥmad auprès de ses élèves. Son travail contribua à structurer le corpus ancien du madhhab hanbalite.',
            legacy: 'Une étape majeure dans la conservation et l’organisation des avis d’Aḥmad.',
            contributions: ['Collecte des masāʾil', 'Organisation du madhhab', 'Transmission'],
            works: ['al-Jāmiʿ — vaste compilation aujourd’hui partiellement conservée'],
            keywords: ['Hanbalite', 'Compilation', 'Bagdad'],
            sources: ['Ibn Abī Yaʿlā, Ṭabaqāt al-Ḥanābila', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 13: 'Transmission indirecte par les élèves d’Aḥmad' } }
        }),

        // ─────────────────────────────────────────────
        // HADITH : maîtres, critique et grands recueils
        // ─────────────────────────────────────────────
        makeScholar(51, 'ʿAbd al-Razzāq al-Ṣanʿānī', 'عبد الرزاق الصنعاني', 'hadith', {
            type: 'muhaddith',
            role: 'Traditionniste de Ṣanʿāʾ',
            dates: '126–211 H. / 744–827',
            region: 'Yémen',
            city: 'Ṣanʿāʾ',
            era: 'IIe–IIIe siècle H.',
            bio: 'Auteur d’un des grands muṣannaf anciens. De nombreux savants voyagèrent jusqu’au Yémen pour étudier auprès de lui.',
            legacy: 'Son Muṣannaf conserve un vaste ensemble de hadiths et d’avis des premières générations.',
            contributions: ['Muṣannaf', 'Hadith ancien', 'Formation de voyageurs du savoir'],
            works: ['al-Muṣannaf', 'Tafsīr ʿAbd al-Razzāq'],
            keywords: ['Yémen', 'Muṣannaf', 'Hadith'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ']
        }),
        makeScholar(47, 'Isḥāq ibn Rāhawayh', 'إسحاق بن راهويه', 'hadith', {
            type: 'muhaddith',
            role: 'Traditionniste et juriste',
            dates: '161–238 H. / 778–853',
            region: 'Khurāsān',
            city: 'Nishapur',
            era: 'IIe–IIIe siècle H.',
            bio: 'Grand maître du Khurāsān, versé dans le hadith et le fiqh. Al-Bukhārī, Muslim et d’autres compilateurs ont bénéficié de son enseignement.',
            legacy: 'Une figure charnière entre les grands maîtres voyageurs et les compilateurs du IIIe siècle H.',
            contributions: ['Hadith', 'Fiqh', 'Formation d’al-Bukhārī et Muslim'],
            works: ['Musnad Isḥāq ibn Rāhawayh — partiellement conservé'],
            keywords: ['Nishapur', 'Hadith', 'Khurāsān'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 51: 'Étudia auprès de ʿAbd al-Razzāq' } }
        }),
        makeScholar(48, 'Yaḥyā ibn Maʿīn', 'يحيى بن معين', 'hadith', {
            type: 'critic',
            role: 'Critique des transmetteurs',
            dates: '158–233 H. / 775–848',
            region: 'Irak',
            city: 'Bagdad',
            era: 'IIe–IIIe siècle H.',
            bio: 'Spécialiste majeur du jarḥ wa-l-taʿdīl, consacré à l’étude des transmetteurs, de leurs rencontres et de leur fiabilité.',
            legacy: 'Ses jugements sont continuellement cités dans les grands ouvrages biographiques du hadith.',
            contributions: ['Critique des transmetteurs', 'Chronologie des narrateurs', 'Hadith'],
            works: ['al-Tārīkh — transmissions multiples'],
            keywords: ['Jarḥ wa-taʿdīl', 'Bagdad', 'Rijāl'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ']
        }),
        makeScholar(49, 'ʿAlī ibn al-Madīnī', 'علي بن المديني', 'hadith', {
            type: 'critic',
            role: 'Maître des ʿilal',
            dates: '161–234 H. / 778–849',
            region: 'Irak · Ḥijāz',
            city: 'Bassora · Bagdad',
            era: 'IIe–IIIe siècle H.',
            bio: 'Maître d’al-Bukhārī et spécialiste des défauts subtils des chaînes de transmission. Il associait connaissance des narrateurs, itinéraires et variantes.',
            legacy: 'Une référence fondatrice de la critique technique du hadith.',
            contributions: ['Science des ʿilal', 'Étude des isnāds', 'Formation d’al-Bukhārī'],
            works: ['al-ʿIlal', 'Maʿrifat al-Rijāl — œuvres connues par fragments et citations'],
            keywords: ['ʿIlal', 'Hadith', 'Bassora'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ']
        }),
        makeScholar(50, 'ʿAbd Allāh al-Dārimī', 'عبد الله الدارمي', 'hadith', {
            type: 'muhaddith',
            role: 'Traditionniste de Samarqand',
            dates: '181–255 H. / 797–869',
            region: 'Transoxiane',
            city: 'Samarqand',
            era: 'IIe–IIIe siècle H.',
            bio: 'Traditionniste voyageur, auteur d’un recueil ancien généralement appelé Sunan ou Musnad al-Dārimī. Plusieurs grands compilateurs étudièrent auprès de lui.',
            legacy: 'Son recueil occupe une place importante parmi les premières compilations organisées par chapitres.',
            contributions: ['Compilation du hadith', 'Enseignement', 'Voyages scientifiques'],
            works: ['Sunan al-Dārimī'],
            keywords: ['Samarqand', 'Sunan', 'Hadith'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ']
        }),
        makeScholar(41, 'Muḥammad al-Bukhārī', 'محمد بن إسماعيل البخاري', 'hadith', {
            type: 'compiler',
            role: 'Auteur du Ṣaḥīḥ',
            dates: '194–256 H. / 810–870',
            region: 'Asie centrale · Khurāsān',
            city: 'Boukhara · Nishapur',
            era: 'IIIe siècle H.',
            bio: 'Traditionniste voyageur et auteur d’al-Jāmiʿ al-Ṣaḥīḥ. Son œuvre se distingue par son organisation juridique, la sélection des transmissions et l’usage des titres de chapitres.',
            legacy: 'Son Ṣaḥīḥ est devenu, dans la tradition sunnite, l’un des recueils de hadith les plus prestigieux.',
            contributions: ['Ṣaḥīḥ al-Bukhārī', 'Critique des narrateurs', 'Fiqh des titres de chapitres'],
            works: ['al-Jāmiʿ al-Ṣaḥīḥ', 'al-Adab al-Mufrad', 'al-Tārīkh al-Kabīr'],
            keywords: ['Boukhara', 'Ṣaḥīḥ', 'Hadith'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 13: 'Étudia le hadith auprès d’Aḥmad', 47: 'Élève d’Isḥāq ibn Rāhawayh', 48: 'Étudia auprès de Yaḥyā ibn Maʿīn', 49: 'Maître majeur des ʿilal', 50: 'Étudia auprès d’al-Dārimī' } }
        }),
        makeScholar(42, 'Muslim ibn al-Ḥajjāj', 'مسلم بن الحجاج', 'hadith', {
            type: 'compiler',
            role: 'Auteur du Ṣaḥīḥ Muslim',
            dates: 'env. 206–261 H. / 821–875',
            region: 'Khurāsān',
            city: 'Nishapur',
            era: 'IIIe siècle H.',
            bio: 'Traditionniste de Nishapur. Son Ṣaḥīḥ rassemble les différentes chaînes et formulations d’un même hadith avec une organisation particulièrement méthodique.',
            legacy: 'Son recueil forme avec celui d’al-Bukhārī les deux Ṣaḥīḥ les plus reconnus de la tradition sunnite.',
            contributions: ['Ṣaḥīḥ Muslim', 'Regroupement des variantes', 'Science de l’isnād'],
            works: ['Ṣaḥīḥ Muslim', 'al-Tamyīz', 'al-Kunā wa-l-Asmāʾ'],
            keywords: ['Nishapur', 'Ṣaḥīḥ', 'Isnād'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 41: 'Étudia et échangea avec al-Bukhārī', 47: 'Étudia auprès d’Isḥāq', 48: 'Étudia auprès de Yaḥyā', 50: 'Étudia auprès d’al-Dārimī' } }
        }),
        makeScholar(43, 'Abū Dāwūd al-Sijistānī', 'أبو داود السجستاني', 'hadith', {
            type: 'compiler',
            role: 'Auteur des Sunan',
            dates: '202–275 H. / 817–889',
            region: 'Sijistān · Irak',
            city: 'Bassora',
            era: 'IIIe siècle H.',
            bio: 'Compilateur spécialisé dans les hadiths à portée juridique. Ses Sunan indiquent fréquemment les variantes, les défauts et l’usage des juristes.',
            legacy: 'Un des six recueils canoniques de hadith dans la tradition sunnite.',
            contributions: ['Hadiths juridiques', 'Sunan', 'Indication des défauts'],
            works: ['Sunan Abī Dāwūd', 'al-Marāsīl'],
            keywords: ['Sunan', 'Aḥkām', 'Bassora'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 13: 'Étudia auprès d’Aḥmad ibn Ḥanbal' } }
        }),
        makeScholar(44, 'Abū ʿĪsā al-Tirmidhī', 'أبو عيسى الترمذي', 'hadith', {
            type: 'compiler',
            role: 'Auteur du Jāmiʿ',
            dates: '209–279 H. / 824–892',
            region: 'Transoxiane · Khurāsān',
            city: 'Tirmidh',
            era: 'IIIe siècle H.',
            bio: 'Son Jāmiʿ combine hadiths, évaluations de transmission et présentation des avis juridiques. Il étudia notamment auprès d’al-Bukhārī.',
            legacy: 'Son vocabulaire critique et ses remarques de fiqh rendent son recueil particulièrement pédagogique.',
            contributions: ['Jāmiʿ al-Tirmidhī', 'Terminologie du hadith', 'Comparaison des avis juridiques'],
            works: ['al-Jāmiʿ', 'al-Shamāʾil al-Muḥammadiyya', 'al-ʿIlal al-Kabīr'],
            keywords: ['Tirmidh', 'Jāmiʿ', 'Shamāʾil'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ'],
            relations: { teachers: { 41: 'Étudia auprès d’al-Bukhārī', 50: 'Étudia auprès d’al-Dārimī' } }
        }),
        makeScholar(45, 'Aḥmad al-Nasāʾī', 'أحمد بن شعيب النسائي', 'hadith', {
            type: 'compiler',
            role: 'Auteur des Sunan',
            dates: '215–303 H. / 829–915',
            region: 'Khurāsān · Égypte · Syrie',
            city: 'Nasā · Fusṭāṭ · Damas',
            era: 'IIIe–IVe siècle H.',
            bio: 'Traditionniste voyageur et critique exigeant. Son al-Sunan al-Ṣughrā, sélection de son grand recueil, est compté parmi les six livres.',
            legacy: 'Une référence importante pour le hadith juridique et la critique des transmetteurs.',
            contributions: ['Sunan al-Nasāʾī', 'Critique des narrateurs', 'Hadith juridique'],
            works: ['al-Sunan al-Kubrā', 'al-Mujtabā', 'al-Ḍuʿafāʾ wa-l-Matrūkūn'],
            keywords: ['Nasāʾī', 'Sunan', 'Critique'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ']
        }),
        makeScholar(46, 'Ibn Mājah al-Qazwīnī', 'ابن ماجه القزويني', 'hadith', {
            type: 'compiler',
            role: 'Auteur des Sunan Ibn Mājah',
            dates: '209–273 H. / 824–887',
            region: 'Iran · Irak · Ḥijāz',
            city: 'Qazvin',
            era: 'IIIe siècle H.',
            bio: 'Traditionniste et voyageur originaire de Qazvin. Ses Sunan furent progressivement intégrées au groupe des six livres, notamment pour leurs transmissions supplémentaires.',
            legacy: 'Son recueil complète le panorama des grands Sunan, tout en contenant des hadiths de degrés variés.',
            contributions: ['Sunan Ibn Mājah', 'Voyage pour le hadith', 'Zawāʾid'],
            works: ['Sunan Ibn Mājah', 'Tafsīr — non conservé', 'Tārīkh — non conservé'],
            keywords: ['Qazvin', 'Sunan', 'Hadith'],
            sources: ['al-Mizzī, Tahdhīb al-Kamāl', 'al-Dhahabī, Siyar Aʿlām al-Nubalāʾ']
        }),

        // ─────────────────────────────────────────────
        // QIRĀʾĀT : dix lecteurs et leurs transmetteurs
        // ─────────────────────────────────────────────
        makeScholar(60, 'Nāfiʿ al-Madanī', 'نافع المدني', 'quran', {
            type: 'reader', role: 'Imam de lecture de Médine', dates: '70–169 H. / 689–785', region: 'Ḥijāz', city: 'Médine', era: 'Ier–IIe siècle H.',
            bio: 'L’un des dix lecteurs canoniques. Sa lecture médinoise est principalement connue par les transmissions de Qālūn et Warsh.',
            legacy: 'La riwāya de Warsh est largement pratiquée au Maghreb et en Afrique de l’Ouest ; celle de Qālūn demeure vivante notamment en Libye et en Tunisie.',
            contributions: ['Lecture médinoise', 'Formation de Qālūn et Warsh', 'Transmission orale'], works: ['Lecture transmise par Qālūn et Warsh'], keywords: ['Médine', 'Warsh', 'Qālūn'],
            sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya', 'al-Dānī, al-Taysīr'], relations: { teachers: { 6: 'Filiation de lecture par plusieurs intermédiaires', 7: 'Filiation médinoise de lecture' } }
        }),
        makeScholar(62, 'Qālūn', 'قالون', 'quran', {
            type: 'transmitter', role: 'Rāwī de Nāfiʿ', dates: '120–220 H. / 738–835', region: 'Ḥijāz', city: 'Médine', era: 'IIe–IIIe siècle H.',
            bio: 'ʿĪsā ibn Mīnā, surnommé Qālūn. Il transmit une des deux riwāyāt principales de la lecture de Nāfiʿ.', legacy: 'Sa transmission reste pratiquée dans plusieurs régions d’Afrique du Nord.',
            contributions: ['Riwāyat Qālūn ʿan Nāfiʿ', 'Enseignement médinois'], works: ['Transmission orale de Nāfiʿ'], keywords: ['Qālūn', 'Nāfiʿ', 'Médine'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 60: 'Rāwī canonique de Nāfiʿ' } }
        }),
        makeScholar(61, 'Warsh', 'ورش', 'quran', {
            type: 'transmitter', role: 'Rāwī de Nāfiʿ', dates: '110–197 H. / 728–812', region: 'Égypte · Ḥijāz', city: 'Fusṭāṭ · Médine', era: 'IIe siècle H.',
            bio: 'ʿUthmān ibn Saʿīd al-Miṣrī, connu sous le surnom de Warsh. Il voyagea de l’Égypte à Médine pour étudier la lecture auprès de Nāfiʿ.', legacy: 'Sa transmission est aujourd’hui particulièrement répandue au Maghreb et en Afrique de l’Ouest.',
            contributions: ['Riwāyat Warsh ʿan Nāfiʿ', 'Diffusion en Égypte et à l’Ouest musulman'], works: ['Transmission orale de Nāfiʿ'], keywords: ['Warsh', 'Nāfiʿ', 'Maghreb'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 60: 'Rāwī canonique de Nāfiʿ' } }
        }),
        makeScholar(69, 'Ibn Kathīr al-Makkī', 'ابن كثير المكي', 'quran', {
            type: 'reader', role: 'Imam de lecture de La Mecque', dates: '45–120 H. / 665–738', region: 'Ḥijāz', city: 'La Mecque', era: 'Ier–IIe siècle H.',
            bio: 'Lecteur de La Mecque parmi les dix lecteurs canoniques. Sa lecture est principalement transmise par al-Bazzī et Qunbul.', legacy: 'Représente la grande tradition mecquoise de récitation.',
            contributions: ['Lecture mecquoise', 'Transmission à al-Bazzī et Qunbul'], works: ['Lecture transmise par al-Bazzī et Qunbul'], keywords: ['La Mecque', 'Qirāʾa'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 5: 'Filiation de lecture par plusieurs intermédiaires', 6: 'Filiation de lecture par plusieurs intermédiaires', 7: 'Filiation de lecture par plusieurs intermédiaires' } }
        }),
        makeScholar(70, 'Al-Bazzī', 'البزي', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Ibn Kathīr', dates: '170–250 H. / 786–864', region: 'Ḥijāz', city: 'La Mecque', era: 'IIe–IIIe siècle H.',
            bio: 'Aḥmad ibn Muḥammad al-Bazzī, l’un des deux transmetteurs canoniques de la lecture d’Ibn Kathīr.', legacy: 'Sa voie conserve une branche majeure de la lecture mecquoise.', contributions: ['Riwāyat al-Bazzī', 'Transmission mecquoise'], works: ['Transmission orale d’Ibn Kathīr'], keywords: ['Bazzī', 'Ibn Kathīr'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 69: 'Rāwī canonique d’Ibn Kathīr' } }
        }),
        makeScholar(71, 'Qunbul', 'قنبل', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Ibn Kathīr', dates: '195–291 H. / 810–904', region: 'Ḥijāz', city: 'La Mecque', era: 'IIe–IIIe siècle H.',
            bio: 'Muḥammad ibn ʿAbd al-Raḥmān al-Makhzūmī, connu comme Qunbul, transmetteur canonique de la lecture d’Ibn Kathīr.', legacy: 'Une des deux voies de référence de la lecture mecquoise.', contributions: ['Riwāyat Qunbul', 'Transmission mecquoise'], works: ['Transmission orale d’Ibn Kathīr'], keywords: ['Qunbul', 'Ibn Kathīr'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 69: 'Rāwī canonique d’Ibn Kathīr' } }
        }),
        makeScholar(66, 'Abū ʿAmr al-Baṣrī', 'أبو عمرو البصري', 'quran', {
            type: 'reader', role: 'Imam de lecture de Bassora', dates: '68–154 H. / 687–771', region: 'Irak', city: 'Bassora', era: 'Ier–IIe siècle H.',
            bio: 'Lecteur, grammairien et savant de Bassora. Sa lecture est principalement transmise par al-Dūrī et al-Sūsī.', legacy: 'Une tradition de récitation historiquement influente à Bassora et dans plusieurs régions d’Afrique.', contributions: ['Lecture basrienne', 'Langue arabe', 'Formation de transmetteurs'], works: ['Lecture transmise par al-Dūrī et al-Sūsī'], keywords: ['Bassora', 'Grammaire', 'Qirāʾa'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 5: 'Filiation de lecture par plusieurs intermédiaires', 6: 'Filiation de lecture par plusieurs intermédiaires', 7: 'Filiation de lecture par plusieurs intermédiaires' } }
        }),
        makeScholar(67, 'Al-Dūrī', 'الدوري', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Abū ʿAmr et d’al-Kisāʾī', dates: 'm. 246 H. / 860–861', region: 'Irak', city: 'Bagdad', era: 'IIe–IIIe siècle H.',
            bio: 'Ḥafṣ ibn ʿUmar al-Dūrī transmit deux lectures canoniques : celle d’Abū ʿAmr et celle d’al-Kisāʾī.', legacy: 'Cas remarquable d’un même rāwī associé à deux imams lecteurs.', contributions: ['Riwāya d’Abū ʿAmr', 'Riwāya d’al-Kisāʾī'], works: ['Transmission orale de deux lectures'], keywords: ['Dūrī', 'Abū ʿAmr', 'Kisāʾī'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 66: 'Rāwī canonique d’Abū ʿAmr', 78: 'Rāwī canonique d’al-Kisāʾī' } }
        }),
        makeScholar(68, 'Al-Sūsī', 'السوسي', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Abū ʿAmr', dates: 'm. 261 H. / 874', region: 'Irak', city: 'Raqqa', era: 'IIIe siècle H.',
            bio: 'Ṣāliḥ ibn Ziyād al-Sūsī, l’un des deux transmetteurs canoniques de la lecture d’Abū ʿAmr.', legacy: 'Sa voie forme avec celle d’al-Dūrī la référence de la lecture d’Abū ʿAmr.', contributions: ['Riwāyat al-Sūsī', 'Transmission basrienne'], works: ['Transmission orale d’Abū ʿAmr'], keywords: ['Sūsī', 'Abū ʿAmr'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 66: 'Rāwī canonique d’Abū ʿAmr' } }
        }),
        makeScholar(72, 'Ibn ʿĀmir al-Dimashqī', 'ابن عامر الدمشقي', 'quran', {
            type: 'reader', role: 'Imam de lecture de Damas', dates: '21–118 H. / 642–736', region: 'Syrie', city: 'Damas', era: 'Ier–IIe siècle H.',
            bio: 'Lecteur de Damas parmi les dix lecteurs canoniques. Sa lecture est transmise par Hishām et Ibn Dhakwān.', legacy: 'Il représente la grande tradition syrienne de récitation.', contributions: ['Lecture damascène', 'Transmission syrienne'], works: ['Lecture transmise par Hishām et Ibn Dhakwān'], keywords: ['Damas', 'Qirāʾa'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 8: 'Filiation syrienne de lecture par plusieurs intermédiaires' } }
        }),
        makeScholar(73, 'Hishām ibn ʿAmmār', 'هشام بن عمار', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Ibn ʿĀmir', dates: '153–245 H. / 770–859', region: 'Syrie', city: 'Damas', era: 'IIe–IIIe siècle H.',
            bio: 'Lecteur et traditionniste de Damas, transmetteur canonique de la lecture d’Ibn ʿĀmir.', legacy: 'Une des deux voies principales de la lecture damascène.', contributions: ['Riwāyat Hishām', 'Enseignement à Damas'], works: ['Transmission orale d’Ibn ʿĀmir'], keywords: ['Hishām', 'Damas'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 72: 'Rāwī canonique d’Ibn ʿĀmir' } }
        }),
        makeScholar(74, 'Ibn Dhakwān', 'ابن ذكوان', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Ibn ʿĀmir', dates: '173–242 H. / 789–857', region: 'Syrie', city: 'Damas', era: 'IIe–IIIe siècle H.',
            bio: 'ʿAbd Allāh ibn Aḥmad ibn Dhakwān, transmetteur canonique de la lecture d’Ibn ʿĀmir.', legacy: 'Avec Hishām, il porte les deux voies de référence de la lecture syrienne.', contributions: ['Riwāyat Ibn Dhakwān', 'Transmission damascène'], works: ['Transmission orale d’Ibn ʿĀmir'], keywords: ['Ibn Dhakwān', 'Damas'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 72: 'Rāwī canonique d’Ibn ʿĀmir' } }
        }),
        makeScholar(63, 'ʿĀṣim al-Kūfī', 'عاصم الكوفي', 'quran', {
            type: 'reader', role: 'Imam de lecture de Koufa', dates: 'm. 127 H. / 745', region: 'Irak', city: 'Koufa', era: 'Ier–IIe siècle H.',
            bio: 'Lecteur de Koufa parmi les dix lecteurs canoniques. Sa lecture est principalement transmise par Shuʿba et Ḥafṣ.', legacy: 'La riwāya de Ḥafṣ ʿan ʿĀṣim est aujourd’hui la plus largement imprimée et enseignée.', contributions: ['Lecture koufienne', 'Formation de Shuʿba et Ḥafṣ'], works: ['Lecture transmise par Shuʿba et Ḥafṣ'], keywords: ['Koufa', 'Ḥafṣ', 'Shuʿba'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 3: 'Filiation de lecture par plusieurs intermédiaires', 5: 'Filiation de lecture par plusieurs intermédiaires', 6: 'Filiation de lecture par plusieurs intermédiaires' } }
        }),
        makeScholar(65, 'Shuʿba ibn ʿAyyāsh', 'شعبة بن عياش', 'quran', {
            type: 'transmitter', role: 'Rāwī de ʿĀṣim', dates: '95–193 H. / 714–809', region: 'Irak', city: 'Koufa', era: 'IIe siècle H.',
            bio: 'Abū Bakr Shuʿba ibn ʿAyyāsh, transmetteur canonique de la lecture de ʿĀṣim. Il ne doit pas être confondu avec Shuʿba ibn al-Ḥajjāj, le traditionniste.', legacy: 'Une des deux voies principales de la lecture de ʿĀṣim.', contributions: ['Riwāyat Shuʿba', 'Transmission koufienne'], works: ['Transmission orale de ʿĀṣim'], keywords: ['Shuʿba', 'ʿĀṣim', 'Koufa'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 63: 'Rāwī canonique de ʿĀṣim' } }
        }),
        makeScholar(64, 'Ḥafṣ ibn Sulaymān', 'حفص بن سليمان', 'quran', {
            type: 'transmitter', role: 'Rāwī de ʿĀṣim', dates: '90–180 H. / 709–796', region: 'Irak', city: 'Koufa', era: 'IIe siècle H.',
            bio: 'Transmetteur canonique de la lecture de ʿĀṣim. Sa précision en qirāʾa est distinguée, dans les sources spécialisées, de son évaluation comme transmetteur de hadith.', legacy: 'La riwāya Ḥafṣ ʿan ʿĀṣim est la plus diffusée dans les éditions contemporaines du muṣḥaf.', contributions: ['Riwāyat Ḥafṣ', 'Transmission koufienne'], works: ['Transmission orale de ʿĀṣim'], keywords: ['Ḥafṣ', 'ʿĀṣim', 'Muṣḥaf'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 63: 'Rāwī canonique de ʿĀṣim' } }
        }),
        makeScholar(75, 'Ḥamza al-Zayyāt', 'حمزة الزيات', 'quran', {
            type: 'reader', role: 'Imam de lecture de Koufa', dates: '80–156 H. / 699–773', region: 'Irak', city: 'Koufa', era: 'Ier–IIe siècle H.',
            bio: 'Lecteur de Koufa parmi les dix lecteurs canoniques. Sa lecture est transmise par Khalaf et Khallād.', legacy: 'Une tradition koufienne connue pour des règles de performance précises.', contributions: ['Lecture de Ḥamza', 'Formation de Khalaf et Khallād'], works: ['Lecture transmise par Khalaf et Khallād'], keywords: ['Ḥamza', 'Koufa', 'Qirāʾa'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 3: 'Filiation de lecture par plusieurs intermédiaires', 5: 'Filiation de lecture par plusieurs intermédiaires' } }
        }),
        makeScholar(77, 'Khallād', 'خلاد', 'quran', {
            type: 'transmitter', role: 'Rāwī de Ḥamza', dates: 'm. 220 H. / 835', region: 'Irak', city: 'Koufa · Bagdad', era: 'IIe–IIIe siècle H.',
            bio: 'Khallād ibn Khālid, l’un des deux transmetteurs canoniques de la lecture de Ḥamza.', legacy: 'Sa voie complète celle de Khalaf pour la lecture de Ḥamza.', contributions: ['Riwāyat Khallād', 'Transmission de Ḥamza'], works: ['Transmission orale de Ḥamza'], keywords: ['Khallād', 'Ḥamza'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 75: 'Rāwī canonique de Ḥamza' } }
        }),
        makeScholar(78, 'Al-Kisāʾī', 'الكسائي', 'quran', {
            type: 'reader', role: 'Imam de lecture de Koufa · grammairien', dates: '119–189 H. / 737–805', region: 'Irak', city: 'Koufa · Bagdad', era: 'IIe siècle H.',
            bio: 'Lecteur canonique et grande figure de la grammaire koufienne. Sa lecture est transmise par Abū al-Ḥārith et al-Dūrī.', legacy: 'Il réunit étude linguistique et transmission coranique dans le milieu savant abbasside.', contributions: ['Lecture d’al-Kisāʾī', 'Grammaire koufienne', 'Formation de transmetteurs'], works: ['Maʿānī al-Qurʾān — attribution connue par la tradition bibliographique'], keywords: ['Kisāʾī', 'Grammaire', 'Koufa'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 3: 'Filiation de lecture par plusieurs intermédiaires', 6: 'Filiation de lecture par plusieurs intermédiaires' } }
        }),
        makeScholar(79, 'Abū al-Ḥārith', 'أبو الحارث', 'quran', {
            type: 'transmitter', role: 'Rāwī d’al-Kisāʾī', dates: 'm. 240 H. / 854', region: 'Irak', city: 'Bagdad', era: 'IIe–IIIe siècle H.',
            bio: 'Al-Layth ibn Khālid, transmetteur canonique de la lecture d’al-Kisāʾī.', legacy: 'Une des deux voies principales de la lecture d’al-Kisāʾī.', contributions: ['Riwāyat Abī al-Ḥārith', 'Transmission d’al-Kisāʾī'], works: ['Transmission orale d’al-Kisāʾī'], keywords: ['Abū al-Ḥārith', 'Kisāʾī'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 78: 'Rāwī canonique d’al-Kisāʾī' } }
        }),
        makeScholar(81, 'Abū Jaʿfar al-Madanī', 'أبو جعفر المدني', 'quran', {
            type: 'reader', role: 'Imam de lecture de Médine', dates: 'm. 130 H. / 747', region: 'Ḥijāz', city: 'Médine', era: 'Ier–IIe siècle H.',
            bio: 'Yazīd ibn al-Qaʿqāʿ, l’un des trois lecteurs complétant les sept pour former les dix lectures canoniques. Sa lecture est transmise par Ibn Wardān et Ibn Jammāz.', legacy: 'Une ancienne tradition médinoise de récitation.', contributions: ['Lecture d’Abū Jaʿfar', 'Formation d’Ibn Wardān et Ibn Jammāz'], works: ['Lecture transmise par ses deux rāwīs'], keywords: ['Médine', 'Abū Jaʿfar'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 6: 'Filiation de lecture médinoise par plusieurs intermédiaires' } }
        }),
        makeScholar(82, 'Ibn Wardān', 'ابن وردان', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Abū Jaʿfar', dates: 'm. 160 H. / 777', region: 'Ḥijāz', city: 'Médine', era: 'IIe siècle H.',
            bio: 'ʿĪsā ibn Wardān, transmetteur canonique de la lecture d’Abū Jaʿfar.', legacy: 'Une des deux voies de référence de cette lecture médinoise.', contributions: ['Riwāyat Ibn Wardān'], works: ['Transmission orale d’Abū Jaʿfar'], keywords: ['Ibn Wardān', 'Abū Jaʿfar'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 81: 'Rāwī canonique d’Abū Jaʿfar' } }
        }),
        makeScholar(83, 'Ibn Jammāz', 'ابن جماز', 'quran', {
            type: 'transmitter', role: 'Rāwī d’Abū Jaʿfar', dates: 'm. vers 170 H. / 786', region: 'Ḥijāz', city: 'Médine', era: 'IIe siècle H.',
            bio: 'Sulaymān ibn Muslim ibn Jammāz, transmetteur canonique de la lecture d’Abū Jaʿfar.', legacy: 'Avec Ibn Wardān, il porte les deux voies principales d’Abū Jaʿfar.', contributions: ['Riwāyat Ibn Jammāz'], works: ['Transmission orale d’Abū Jaʿfar'], keywords: ['Ibn Jammāz', 'Abū Jaʿfar'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 81: 'Rāwī canonique d’Abū Jaʿfar' } }
        }),
        makeScholar(84, 'Yaʿqūb al-Ḥaḍramī', 'يعقوب الحضرمي', 'quran', {
            type: 'reader', role: 'Imam de lecture de Bassora', dates: '117–205 H. / 735–820', region: 'Irak', city: 'Bassora', era: 'IIe–IIIe siècle H.',
            bio: 'Lecteur canonique de Bassora et savant de la langue. Sa lecture est transmise par Ruways et Rawḥ.', legacy: 'Une des trois lectures qui complètent les sept lectures célèbres.', contributions: ['Lecture de Yaʿqūb', 'Langue arabe', 'Formation de Ruways et Rawḥ'], works: ['Lecture transmise par Ruways et Rawḥ'], keywords: ['Yaʿqūb', 'Bassora'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 3: 'Filiation de lecture par plusieurs intermédiaires', 5: 'Filiation de lecture par plusieurs intermédiaires', 6: 'Filiation de lecture par plusieurs intermédiaires', 7: 'Filiation de lecture par plusieurs intermédiaires' } }
        }),
        makeScholar(85, 'Ruways', 'رويس', 'quran', {
            type: 'transmitter', role: 'Rāwī de Yaʿqūb', dates: 'm. 238 H. / 853', region: 'Irak', city: 'Bassora', era: 'IIe–IIIe siècle H.',
            bio: 'Muḥammad ibn al-Mutawakkil, dit Ruways, transmetteur canonique de la lecture de Yaʿqūb.', legacy: 'Une des deux voies principales de la lecture de Yaʿqūb.', contributions: ['Riwāyat Ruways'], works: ['Transmission orale de Yaʿqūb'], keywords: ['Ruways', 'Yaʿqūb'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 84: 'Rāwī canonique de Yaʿqūb' } }
        }),
        makeScholar(86, 'Rawḥ', 'روح', 'quran', {
            type: 'transmitter', role: 'Rāwī de Yaʿqūb', dates: 'm. 234 H. / 849', region: 'Irak', city: 'Bassora', era: 'IIe–IIIe siècle H.',
            bio: 'Rawḥ ibn ʿAbd al-Muʾmin, transmetteur canonique de la lecture de Yaʿqūb.', legacy: 'Sa voie complète celle de Ruways.', contributions: ['Riwāyat Rawḥ'], works: ['Transmission orale de Yaʿqūb'], keywords: ['Rawḥ', 'Yaʿqūb'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 84: 'Rāwī canonique de Yaʿqūb' } }
        }),
        makeScholar(87, 'Khalaf al-ʿĀshir', 'خلف العاشر', 'quran', {
            type: 'reader', role: 'Dixième lecteur · rāwī de Ḥamza', dates: '150–229 H. / 767–844', region: 'Irak', city: 'Bagdad', era: 'IIe–IIIe siècle H.',
            bio: 'Khalaf ibn Hishām occupe une double place : transmetteur canonique de Ḥamza et imam d’une lecture canonique propre, dite Khalaf al-ʿĀshir.', legacy: 'Sa lecture propre est transmise par Isḥāq al-Warrāq et Idrīs al-Ḥaddād.', contributions: ['Riwāya de Ḥamza', 'Lecture de Khalaf al-ʿĀshir'], works: ['Lecture transmise par Isḥāq et Idrīs'], keywords: ['Khalaf', 'Bagdad', 'Dixième lecture'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 75: 'Rāwī canonique de Ḥamza et lecteur indépendant', 3: 'Filiation koufienne par plusieurs intermédiaires' } }
        }),
        makeScholar(88, 'Isḥāq al-Warrāq', 'إسحاق الوراق', 'quran', {
            type: 'transmitter', role: 'Rāwī de Khalaf al-ʿĀshir', dates: 'm. 286 H. / 899', region: 'Irak', city: 'Bagdad', era: 'IIIe siècle H.',
            bio: 'Isḥāq ibn Ibrāhīm al-Warrāq, transmetteur canonique de la lecture propre de Khalaf.', legacy: 'Une des deux voies principales de Khalaf al-ʿĀshir.', contributions: ['Riwāyat Isḥāq'], works: ['Transmission orale de Khalaf'], keywords: ['Isḥāq', 'Khalaf'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 87: 'Rāwī canonique de Khalaf al-ʿĀshir' } }
        }),
        makeScholar(89, 'Idrīs al-Ḥaddād', 'إدريس الحداد', 'quran', {
            type: 'transmitter', role: 'Rāwī de Khalaf al-ʿĀshir', dates: '189–292 H. / 805–905', region: 'Irak', city: 'Bagdad', era: 'IIe–IIIe siècle H.',
            bio: 'Idrīs ibn ʿAbd al-Karīm al-Ḥaddād, transmetteur canonique de la lecture propre de Khalaf.', legacy: 'Sa voie complète celle d’Isḥāq al-Warrāq.', contributions: ['Riwāyat Idrīs'], works: ['Transmission orale de Khalaf'], keywords: ['Idrīs', 'Khalaf'], sources: ['Ibn al-Jazarī, Ghāyat al-Nihāya'], relations: { teachers: { 87: 'Rāwī canonique de Khalaf al-ʿĀshir' } }
        })
    ],

    edges: [
        // Fondations et fiqh
        { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 1, to: 5 }, { from: 1, to: 6 }, { from: 1, to: 7 }, { from: 1, to: 8 },
        { from: 2, to: 20 }, { from: 3, to: 24 }, { from: 24, to: 22 }, { from: 22, to: 23 }, { from: 23, to: 10 },
        { from: 10, to: 14 }, { from: 10, to: 15 }, { from: 14, to: 15 },
        { from: 20, to: 11 }, { from: 21, to: 11 }, { from: 11, to: 16 }, { from: 11, to: 12 }, { from: 15, to: 12 }, { from: 12, to: 18 }, { from: 12, to: 13 }, { from: 13, to: 19 },

        // Hadith
        { from: 51, to: 47 }, { from: 51, to: 13 },
        { from: 13, to: 41 }, { from: 13, to: 43 },
        { from: 47, to: 41 }, { from: 47, to: 42 },
        { from: 48, to: 41 }, { from: 48, to: 42 },
        { from: 49, to: 41 }, { from: 50, to: 41 }, { from: 50, to: 42 }, { from: 50, to: 44 },
        { from: 41, to: 42 }, { from: 41, to: 44 },

        // Qirāʾāt : les liens depuis les Compagnons désignent une filiation de lecture avec intermédiaires
        { from: 6, to: 60 }, { from: 7, to: 60 }, { from: 60, to: 61 }, { from: 60, to: 62 },
        { from: 5, to: 69 }, { from: 6, to: 69 }, { from: 7, to: 69 }, { from: 69, to: 70 }, { from: 69, to: 71 },
        { from: 5, to: 66 }, { from: 6, to: 66 }, { from: 7, to: 66 }, { from: 66, to: 67 }, { from: 66, to: 68 },
        { from: 8, to: 72 }, { from: 72, to: 73 }, { from: 72, to: 74 },
        { from: 3, to: 63 }, { from: 5, to: 63 }, { from: 6, to: 63 }, { from: 63, to: 64 }, { from: 63, to: 65 },
        { from: 3, to: 75 }, { from: 5, to: 75 }, { from: 75, to: 87 }, { from: 75, to: 77 },
        { from: 3, to: 78 }, { from: 6, to: 78 }, { from: 78, to: 79 }, { from: 78, to: 67 },
        { from: 6, to: 81 }, { from: 81, to: 82 }, { from: 81, to: 83 },
        { from: 3, to: 84 }, { from: 5, to: 84 }, { from: 6, to: 84 }, { from: 7, to: 84 }, { from: 84, to: 85 }, { from: 84, to: 86 },
        { from: 3, to: 87 }, { from: 87, to: 88 }, { from: 87, to: 89 }
    ]
};

const SILSILA_JOURNEYS = [
    {
        id: 'golden-chain',
        title: 'La chaîne médinoise',
        subtitle: 'D’Ibn ʿUmar à Mālik',
        icon: 'sparkles',
        group: 'fiqh',
        scholarIds: [1, 2, 20, 11],
        description: 'Un parcours court pour comprendre la célèbre transmission médinoise : le Prophète ﷺ, Ibn ʿUmar, Nāfiʿ puis Mālik.'
    },
    {
        id: 'kufa-fiqh',
        title: 'L’école de Koufa',
        subtitle: 'Du Compagnon au madhhab hanafite',
        icon: 'route',
        group: 'fiqh',
        scholarIds: [1, 3, 24, 22, 23, 10, 14],
        description: 'Suivez la construction progressive d’une tradition juridique : Ibn Masʿūd, ʿAlqama, al-Nakhaʿī, Ḥammād et Abū Ḥanīfa.'
    },
    {
        id: 'four-imams',
        title: 'Les quatre imams',
        subtitle: 'Comparer les grandes écoles sunnites',
        icon: 'columns-3',
        group: 'fiqh',
        scholarIds: [10, 11, 12, 13],
        description: 'Explorez les contextes, méthodes et héritages des quatre grandes écoles juridiques sunnites.'
    },
    {
        id: 'hadith-masters',
        title: 'L’atelier du hadith',
        subtitle: 'Maîtres, critique et compilation',
        icon: 'scan-search',
        group: 'hadith',
        scholarIds: [51, 47, 48, 49, 41, 42],
        description: 'Découvrez comment voyage, critique des transmetteurs et comparaison des chaînes précèdent les grands Ṣaḥīḥ.'
    },
    {
        id: 'six-books',
        title: 'Les six grands recueils',
        subtitle: 'Un répertoire, plusieurs méthodes',
        icon: 'library-big',
        group: 'hadith',
        scholarIds: [41, 42, 43, 44, 45, 46],
        description: 'Comparez les objectifs éditoriaux des deux Ṣaḥīḥ et des quatre Sunan/Jāmiʿ.'
    },
    {
        id: 'ten-readers',
        title: 'Les dix lecteurs',
        subtitle: 'Qirāʾa, riwāya et transmission',
        icon: 'book-open-check',
        group: 'quran',
        scholarIds: [60, 69, 66, 72, 63, 75, 78, 81, 84, 87],
        description: 'Identifiez les dix imams lecteurs et ouvrez chaque fiche pour retrouver leurs deux transmetteurs canoniques.'
    },
    {
        id: 'living-riwayat',
        title: 'Riwāyāt largement pratiquées',
        subtitle: 'Ḥafṣ, Warsh, Qālūn et al-Dūrī',
        icon: 'globe-2',
        group: 'quran',
        scholarIds: [64, 61, 62, 67],
        description: 'Un aperçu des transmissions encore très présentes dans différentes régions du monde musulman.'
    }
];
