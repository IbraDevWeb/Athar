(() => {
    const data = window.SCHOLAR_ATLAS_DATA;
    if (!data || !Array.isArray(data.scholars)) throw new Error('Atlas Savants : base absente avant enrichissement.');

    const cityById = new Map(data.cities.map((city) => [city.id, city]));
    const label = (discipline) => ({
        Hadith: 'hadith', Fiqh: 'droit', Qiraat: 'lectures coraniques', Tafsir: 'exégèse', Theology: 'théologie',
        Usul: 'fondements du droit', Arabic: 'langue arabe', History: 'histoire', Biography: 'biographie',
        Spiritualité: 'éthique spirituelle', Philosophy: 'philosophie', Mathematics: 'mathématiques', Astronomy: 'astronomie',
        Geography: 'géographie', Medicine: 'médecine', Optics: 'optique', Sciences: 'sciences', Adab: 'adab', Poetry: 'poésie',
        Education: 'éducation', Administration: 'administration', Literacy: 'culture écrite', Calligraphy: 'calligraphie',
        Library: 'histoire du livre', Patronage: 'patronage', Activism: 'engagement associatif', Engineering: 'ingénierie',
        Mechanics: 'mécanique', Hydraulics: 'hydraulique', Botany: 'botanique', Chemistry: 'chimie', Anatomy: 'anatomie',
        InternationalLaw: 'relations internationales', 'International Law': 'relations internationales',
        'Legal Theory': 'théorie juridique', 'Asbab al-Nuzul': 'circonstances de révélation'
    }[discipline] || discipline);

    const networks = {
        aisha: { teachers: ['Le Prophète Muḥammad', 'Abū Bakr al-Ṣiddīq'], students: ['ʿUrwa ibn al-Zubayr', 'al-Qāsim ibn Muḥammad', 'ʿAmra bint ʿAbd al-Raḥmān', 'Masrūq'], institutions: ['Maison prophétique à Médine', 'Cercles privés et consultations juridiques'], keyTerms: ['fiqh familial', 'sunna domestique', 'critique des récits'] },
        amra: { teachers: ['ʿĀʾisha bint Abī Bakr'], students: ['Abū Bakr ibn Ḥazm', 'Yaḥyā ibn Saʿīd al-Anṣārī', 'Fāṭima bint al-Mundhir'], institutions: ['Réseaux médinois de hadith'], keyTerms: ['transmission féminine', 'droit médinois', 'mémoire de ʿĀʾisha'] },
        abu-hanifa: { teachers: ['Ḥammād ibn Abī Sulaymān', 'ʿAṭāʾ ibn Abī Rabāḥ'], students: ['Abū Yūsuf', 'Muḥammad al-Shaybānī', 'Zufar ibn al-Hudhayl'], institutions: ['Cercle juridique de Koufa'], keyTerms: ['qiyās', 'istiḥsān', 'fiqh hypothétique'] },
        malik: { teachers: ['Nāfiʿ', 'Ibn Shihāb al-Zuhrī', 'Rabīʿa al-Raʾy'], students: ['al-Shāfiʿī', 'Ibn al-Qāsim', 'Ibn Wahb', 'Ashhab'], institutions: ['Mosquée du Prophète', 'Cercles de Médine'], keyTerms: ['ʿamal ahl al-Madīna', 'Muwaṭṭaʾ', 'fatwā médinoise'] },
        shafii: { teachers: ['Mālik ibn Anas', 'Muḥammad al-Shaybānī', 'Sufyān ibn ʿUyayna'], students: ['Aḥmad ibn Ḥanbal', 'al-Muzanī', 'al-Buwayṭī'], institutions: ['Cercles de La Mecque', 'Bagdad', 'Fusṭāṭ'], keyTerms: ['bayān', 'khabar', 'qiyās', 'uṣūl al-fiqh'] },
        ahmad: { teachers: ['Sufyān ibn ʿUyayna', 'Wakīʿ ibn al-Jarrāḥ', 'ʿAbd al-Razzāq'], students: ['al-Bukhārī', 'Muslim', 'Abū Dāwūd', 'ses fils Ṣāliḥ et ʿAbd Allāh'], institutions: ['Cercles de hadith à Bagdad'], keyTerms: ['Musnad', 'miḥna', 'athar'] },
        bukhari: { teachers: ['ʿAlī ibn al-Madīnī', 'Aḥmad ibn Ḥanbal', 'Isḥāq ibn Rāhawayh'], students: ['Muslim ibn al-Ḥajjāj', 'al-Tirmidhī', 'al-Firabrī'], institutions: ['Rihla du hadith', 'Cercles de Boukhara et Nishapur'], keyTerms: ['tarājim al-abwāb', 'rijāl', 'ʿilal'] },
        muslim: { teachers: ['Yaḥyā ibn Yaḥyā', 'Isḥāq ibn Rāhawayh', 'al-Bukhārī'], students: ['al-Tirmidhī', 'Ibn Khuzayma'], institutions: ['Nishapur', 'Rihla du hadith'], keyTerms: ['regroupement des voies', 'muqaddima', 'critique des narrateurs'] },
        tabari: { teachers: ['Muḥammad ibn Ḥumayd', 'Ibn Bashshār', 'écoles de Bagdad, Koufa et Fusṭāṭ'], students: ['Savants de son cercle bagdadien'], institutions: ['Bagdad abbasside'], keyTerms: ['tafsīr bi-l-maʾthūr', 'ikhtilāf', 'chronique universelle'] },
        ghazali: { teachers: ['Imām al-Ḥaramayn al-Juwaynī'], students: ['Muḥammad ibn Yaḥyā al-Ghazālī', 'cercles de Tus'], institutions: ['Niẓāmiyya de Bagdad', 'Retraite à Damas', 'École de Tus'], keyTerms: ['iḥyāʾ', 'maqāṣid', 'critique de la philosophie'] },
        ibn-taymiyya: { teachers: ['ʿAbd al-Ḥalīm ibn Taymiyya', 'Zaynab bint Makkī et d’autres traditionnistes'], students: ['Ibn Qayyim al-Jawziyya', 'Ibn Kathīr', 'al-Dhahabī'], institutions: ['Mosquée des Omeyyades', 'Madrasas de Damas'], keyTerms: ['naql et ʿaql', 'fatwā', 'siyāsa sharʿiyya'] },
        nawawi: { teachers: ['Isḥāq al-Maghribī', 'ʿAbd al-Raḥmān al-Anbārī'], students: ['Ibn al-ʿAṭṭār'], institutions: ['Dār al-Ḥadīth al-Ashrafiyya'], keyTerms: ['Riyāḍ al-ṣāliḥīn', 'Minhāj', 'commentaire du Ṣaḥīḥ'] },
        ibn-hajar: { teachers: ['Zayn al-Dīn al-ʿIrāqī', 'ʿĀʾisha bint ʿAbd al-Hādī'], students: ['al-Sakhāwī', 'Ibn Taghrībirdī'], institutions: ['Madrasas et judicature du Caire'], keyTerms: ['Fatḥ al-bārī', 'rijāl', 'takhrīj'] },
        khalil: { teachers: ['Traditions linguistiques de Bassora'], students: ['Sībawayh', 'al-Naḍr ibn Shumayl'], institutions: ['École de Bassora'], keyTerms: ['ʿarūḍ', 'lexicographie', 'racines phonétiques'] },
        sibawayh: { teachers: ['al-Khalīl ibn Aḥmad', 'Yūnus ibn Ḥabīb'], students: ['al-Akhfash al-Awsaṭ'], institutions: ['École de Bassora'], keyTerms: ['al-Kitāb', 'iʿrāb', 'analogie grammaticale'] },
        biruni: { teachers: ['Abū Naṣr Manṣūr ibn ʿIrāq'], students: ['Collaborateurs des cours de Khwarazm et Ghazni'], institutions: ['Cour de Khwarazm', 'Cour de Ghazni'], keyTerms: ['mesure', 'chronologie comparée', 'Inde'] },
        ibn-sina: { teachers: ['Abū ʿAbd Allāh al-Nātilī', 'médecins de Boukhara'], students: ['al-Jūzjānī', 'Bahmanyār'], institutions: ['Cours de Boukhara, Rayy, Hamadan et Ispahan'], keyTerms: ['Qānūn', 'Shifāʾ', 'médecine philosophique'] },
        ibn-haytham: { teachers: ['Traditions mathématiques de Bassora et Bagdad'], students: ['Lecteurs et commentateurs de l’optique'], institutions: ['Milieux scientifiques du Caire'], keyTerms: ['expérience', 'vision', 'chambre obscure'] },
        ibn-khaldun: { teachers: ['Savants de Tunis et du Maghreb'], students: ['Étudiants des madrasas du Caire'], institutions: ['Zaytūna', 'Cours maghrébines', 'Madrasas du Caire'], keyTerms: ['ʿumrān', 'ʿaṣabiyya', 'critique des récits'] },
        nana-asmau: { teachers: ['ʿUthmān dan Fodio', 'Muḥammad Bello et le réseau familial'], students: ['Enseignantes jajis et communautés féminines'], institutions: ['Réseau éducatif du califat de Sokoto'], keyTerms: ['éducation itinérante', 'poésie didactique', 'multilinguisme'] },
        aisha-abd-rahman: { teachers: ['Amīn al-Khūlī', 'Université Fuʾād Ier'], students: ['Étudiants des universités arabes'], institutions: ['Université du Caire', 'Universités du Maroc'], keyTerms: ['tafsīr bayānī', 'littérature arabe', 'femmes de la Sīra'] },
        abu-yusuf: { teachers: ['Abū Ḥanīfa'], students: ['Muḥammad al-Shaybānī', 'juristes de la judicature abbasside'], institutions: ['Cercle de Koufa', 'Grande judicature abbasside'], keyTerms: ['kharāj', 'qaḍāʾ', 'politique fiscale'] },
        shaybani: { teachers: ['Abū Ḥanīfa', 'Abū Yūsuf', 'Mālik ibn Anas'], students: ['al-Shāfiʿī', 'juristes hanafites de Transoxiane'], institutions: ['Koufa', 'Bagdad', 'Rayy'], keyTerms: ['ẓāhir al-riwāya', 'siyar', 'codification'] },
        yahya-main: { teachers: ['Sufyān ibn ʿUyayna', 'Wakīʿ ibn al-Jarrāḥ'], students: ['al-Bukhārī', 'Muslim', 'Abū Dāwūd'], institutions: ['Rihla du hadith', 'Bagdad'], keyTerms: ['jarḥ wa-taʿdīl', 'rijāl', 'comparaison des versions'] },
        ali-madini: { teachers: ['Sufyān ibn ʿUyayna', 'Yaḥyā al-Qaṭṭān'], students: ['al-Bukhārī', 'Abū Dāwūd'], institutions: ['Bassora et Bagdad'], keyTerms: ['ʿilal', 'ṭuruq', 'biographie des transmetteurs'] },
        warsh: { teachers: ['Nāfiʿ al-Madanī'], students: ['Transmetteurs égyptiens et maghrébins'], institutions: ['Cercles de Médine et du Caire'], keyTerms: ['riwāyat Warsh', 'adāʾ', 'diffusion maghrébine'] },
        jamshid-kashi: { teachers: ['Traditions mathématiques de Kashan'], students: ['Collaborateurs de l’observatoire de Samarcande'], institutions: ['Observatoire et madrasa de Samarcande'], keyTerms: ['fractions décimales', 'π', 'trigonométrie'] },
        ibn-nafis: { teachers: ['Médecins du Nūrī de Damas'], students: ['Médecins du Caire'], institutions: ['Bīmāristān al-Nūrī', 'Hôpital al-Manṣūrī'], keyTerms: ['circulation pulmonaire', 'anatomie critique', 'commentaire médical'] }
    };

    const genericMilestones = (scholar, city) => {
        const routeNames = scholar.routes.map((id) => cityById.get(id)?.name).filter(Boolean);
        const first = routeNames[0] || city?.name || 'son milieu d’origine';
        const last = routeNames[routeNames.length - 1] || city?.name || 'son principal foyer';
        return [
            { label: 'Formation', text: `Premiers apprentissages à ${first}, dans des cercles où l’oral, la lecture contrôlée et la relation maître-élève structuraient l’acquisition du savoir.` },
            { label: 'Maturité', text: `Développement d’une autorité en ${scholar.disciplines.slice(0, 3).map(label).join(', ')}, par l’enseignement, la rédaction ou la transmission.` },
            { label: 'Héritage', text: `Réception de son travail depuis ${last}, avec des usages qui varient selon les régions, les écoles et les périodes.` }
        ];
    };

    for (const scholar of data.scholars) {
        const city = cityById.get(scholar.city);
        const firstDiscipline = label(scholar.disciplines[0] || 'savoir');
        const disciplines = scholar.disciplines.map(label).join(', ');
        const network = networks[scholar.id] || {};
        scholar.formation = scholar.formation || `Sa formation s’inscrit dans les réseaux de ${city?.name || 'son milieu'}, où l’apprentissage reposait sur la fréquentation de maîtres, la lecture de textes, la mémorisation et la vérification des transmissions. Son profil associe principalement ${disciplines}.`;
        scholar.method = scholar.method || `Son travail peut être étudié à partir de quatre gestes : recueillir les matériaux disponibles, les comparer, les organiser selon une finalité pédagogique ou juridique, puis transmettre une méthode autant qu’un résultat. Dans le domaine de ${firstDiscipline}, il faut distinguer ses formulations propres des développements de ses élèves et commentateurs.`;
        scholar.context = scholar.context || `Cette carrière prend place dans le contexte de ${city?.region || 'plusieurs régions du monde islamique'} et de l’essor d’institutions, de bibliothèques, de mosquées ou de cercles privés. Les déplacements indiqués sur la carte donnent des repères, mais ne reconstituent pas chaque voyage ni chaque séjour.`;
        scholar.debates = scholar.debates || `Les notices biographiques peuvent diverger sur certaines dates, affiliations, œuvres ou rencontres. L’attribution d’un texte, la portée exacte d’une influence et les catégories d’école utilisées ici doivent donc être contrôlées dans les sources spécialisées.`;
        scholar.teachers = scholar.teachers || network.teachers || [];
        scholar.students = scholar.students || network.students || [];
        scholar.institutions = scholar.institutions || network.institutions || [city ? `Cercles savants de ${city.name}` : 'Cercles savants régionaux'];
        scholar.keyTerms = scholar.keyTerms || network.keyTerms || [firstDiscipline, scholar.school, city?.name].filter(Boolean);
        scholar.milestones = scholar.milestones || genericMilestones(scholar, city);
        scholar.studyQuestions = scholar.studyQuestions || [
            `Quelle méthode de ${firstDiscipline} peut-on identifier dans ses œuvres ou dans les récits de ses élèves ?`,
            `Comment son ancrage à ${city?.name || 'son principal foyer'} et ses déplacements ont-ils influencé la diffusion de son héritage ?`,
            `Quels éléments de sa biographie sont solidement documentés, et lesquels demandent une lecture plus prudente ?`
        ];
        scholar.workNotes = scholar.workNotes || scholar.works.map((work) => ({
            title: work,
            note: `Titre associé à cette figure. Son état de conservation, son attribution et son usage pédagogique peuvent varier ; consulter une édition critique ou une étude spécialisée.`
        }));
    }

    const byId = new Map(data.scholars.map((scholar) => [scholar.id, scholar]));
    const appendJourney = (journey) => {
        if (!data.journeys.some((item) => item.id === journey.id)) data.journeys.push(journey);
    };

    const womenJourney = data.journeys.find((journey) => journey.id === 'women-scholars');
    if (womenJourney) {
        womenJourney.scholarIds = ['aisha','umm-salama','amra','hafsa-sirin','muadha-adawiyya','karima-marwaziyya','shuhda-katiba','fatima-samarqandiyya','zaynab-makki','aisha-abd-hadi','aisha-bauniyya','nana-asmau','aisha-abd-rahman'].filter((id) => byId.has(id));
    }
    appendJourney({ id: 'women-hadith-networks', title: 'Réseaux féminins du hadith', subtitle: 'De Médine à Damas et au Caire', description: 'Suivre les enseignantes, leurs familles savantes, leurs auditions et les mécanismes de l’ijāza sur plusieurs siècles.', icon: 'users-round', accent: '#be185d', scholarIds: ['aisha','amra','fatima-mundhir','karima-marwaziyya','shuhda-katiba','zaynab-shari','zaynab-makki','aisha-abd-hadi','umm-hani-huriniyya'].filter((id) => byId.has(id)) });
    appendJourney({ id: 'hanafi-formation', title: 'Formation du droit hanafite', subtitle: 'Koufa, Bagdad et la Transoxiane', description: 'Comparer le cercle fondateur, la mise par écrit de la doctrine et ses grandes synthèses orientales.', icon: 'scale', accent: '#a16207', scholarIds: ['abu-hanifa','abu-yusuf','shaybani','zufar','tahawi','sarakhsi','kasani','marghinani'].filter((id) => byId.has(id)) });
    appendJourney({ id: 'hadith-criticism', title: 'L’atelier critique du hadith', subtitle: 'Comparer les chaînes, les narrateurs et les variantes', description: 'Découvrir comment la critique technique s’est développée avant et autour des grands recueils.', icon: 'scan-search', accent: '#0f766e', scholarIds: ['yahya-main','ali-madini','ahmad','bukhari','muslim','daraqutni','khatib-baghdadi','ibn-salah','ibn-hajar'].filter((id) => byId.has(id)) });
    appendJourney({ id: 'modern-women-education', title: 'Femmes et réforme de l’éducation', subtitle: 'Afrique de l’Ouest, Indonésie et Égypte', description: 'Trois contextes modernes où des femmes ont créé, transmis ou renouvelé des formes d’éducation islamique.', icon: 'graduation-cap', accent: '#7c3aed', scholarIds: ['nana-asmau','rahmah-yunusiyah','aisha-abd-rahman','zaynab-ghazali'].filter((id) => byId.has(id)) });
    appendJourney({ id: 'science-observation', title: 'Observer, calculer, expérimenter', subtitle: 'De Bagdad à Samarcande', description: 'Explorer les pratiques de mesure, de clinique, d’ingénierie et d’observation astronomique.', icon: 'microscope', accent: '#0369a1', scholarIds: ['kindi','razi-physician','ibn-haytham','biruni','ibn-sina','ibn-nafis','jazari-engineer','battani','jamshid-kashi','ulugh-beg'].filter((id) => byId.has(id)) });

    data.meta.version = '2.0.0';
    data.meta.scope = 'Atlas pédagogique étendu des savantes et savants, de leurs œuvres, méthodes, réseaux, foyers et itinéraires.';
    data.meta.methodology.push('Les rubriques Formation, Méthode, Réseau et Questions d’étude servent à apprendre activement ; elles signalent les zones à approfondir plutôt que de clore l’enquête.');
})();
