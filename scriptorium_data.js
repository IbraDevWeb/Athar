// Athar Pro — corpus éditorial du Scriptorium.
window.SCRIPTORIUM_DATA = {
    meta: {
        title: 'Le Scriptorium',
        subtitle: 'Lire la page avant de lire le texte',
        editorialNote: "Les folios présentés sont des reconstitutions graphiques pédagogiques, jamais des fac-similés. Les descriptions s'appuient sur des notices de la Bibliothèque nationale de France et du Metropolitan Museum of Art.",
        sourcePolicy: "Chaque étape indique le manuscrit ou la synthèse institutionnelle qui fonde l'explication. Les datations et attributions restent formulées avec le degré de prudence des catalogues consultés."
    },
    folios: [
        {
            id: 'hijazi-origins',
            order: 1,
            title: 'Le geste hijâzî',
            arabic: 'الخط الحجازي',
            period: 'VIIe–VIIIe siècles',
            region: 'Arabie et Proche-Orient',
            script: 'Hijâzî',
            support: 'Parchemin',
            format: 'Vertical ou presque carré',
            lines: 14,
            accent: '#b98a52',
            summary: "Une écriture inclinée, encore proche du geste de copie quotidien, employée dans plusieurs des plus anciens témoins coraniques conservés.",
            insight: "Le format n'est pas encore fixé : la page verticale ou presque carrée précède la domination du grand codex oblong.",
            observations: [
                "Ductus souple et légèrement incliné",
                "Décor très réduit",
                "Signes auxiliaires encore rares",
                "Parchemin comme support principal"
            ],
            visual: {
                orientation: 'portrait',
                family: 'hijazi',
                ink: '#3b2c22',
                paper: '#d9c69b',
                lineCount: 13,
                gold: false,
                dots: 'sparse',
                frame: 'none'
            },
            source: {
                institution: 'Bibliothèque nationale de France',
                label: 'Les supports des livres arabes',
                note: "La BnF rappelle que les premiers corans en écriture hijâzî sont souvent verticaux ou presque carrés, avant l'essor du format oblong associé aux écritures coufiques.",
                url: 'https://essentiels.bnf.fr/fr/livres-et-ecritures/histoire-des-livres-extra-occidentaux/7a29e1a3-e15c-4a49-8f80-2c2ff59ba9bb-livre-en-terres-islam/article/19e9c2ea-e48b-4cd5-82de-7a2de7d454d9-supports-livres-arabes'
            }
        },
        {
            id: 'kufic-oblong',
            order: 2,
            title: 'Le souffle coufique',
            arabic: 'الخط الكوفي',
            period: 'Fin IXe–début Xe siècle',
            region: 'Probablement Syrie',
            script: 'Coufique ancien',
            support: 'Parchemin',
            format: 'Oblong',
            lines: 5,
            accent: '#a56d3e',
            summary: "La page s'élargit et les lettres s'étirent. L'écriture devient monumentale, espacée et profondément liée au format horizontal.",
            insight: "Les elongations horizontales ne sont pas seulement décoratives : elles organisent le rythme du texte dans un codex oblong.",
            observations: [
                "Lettres anguleuses et étirées",
                "Grandes marges silencieuses",
                "Points rouges et verts pour les voyelles",
                "Peu de lignes par page"
            ],
            visual: {
                orientation: 'landscape',
                family: 'kufic',
                ink: '#2d211b',
                paper: '#d4bd87',
                lineCount: 5,
                gold: true,
                dots: 'colored',
                frame: 'none'
            },
            source: {
                institution: 'The Metropolitan Museum of Art',
                label: 'Folio from a Qur’an Manuscript, 30.45',
                note: "Le Met décrit un folio sur parchemin, aux lettres largement étirées, écrit à l'encre noire avec des points rouges et verts pour les voyelles.",
                url: 'https://www.metmuseum.org/art/collection/search/448369'
            }
        },
        {
            id: 'eastern-kufic',
            order: 3,
            title: 'L’élan du coufique oriental',
            arabic: 'الكوفي الشرقي',
            period: '531 H / 1137',
            region: 'Zanjan, Iran',
            script: 'Coufique oriental avec éléments cursifs',
            support: 'Papier',
            format: 'Vertical',
            lines: 11,
            accent: '#496e69',
            summary: "Les hampes se redressent, les mots gagnent en mouvement et le décor géométrique dialogue avec une écriture devenue plus nerveuse.",
            insight: "La page associe déjà plusieurs langages : coufique oriental, éléments de naskh et illumination organisée.",
            observations: [
                "Verticales accentuées",
                "Mélange d'angulosité et de cursivité",
                "Papier plutôt que parchemin",
                "Rinceaux et entrelacs géométriques"
            ],
            visual: {
                orientation: 'portrait',
                family: 'eastern',
                ink: '#243b39',
                paper: '#d8cda9',
                lineCount: 11,
                gold: true,
                dots: 'full',
                frame: 'geometric'
            },
            source: {
                institution: 'The Metropolitan Museum of Art',
                label: 'Folio from a Qur’an Manuscript, 1996.238.1',
                note: "Le manuscrit signé par Muhammad al-Zanjani est daté de 531 H / 1137 et associe coufique oriental, éléments de naskh et illumination de rinceaux et d'entrelacs.",
                url: 'https://www.metmuseum.org/art/collection/search/453369'
            }
        },
        {
            id: 'muhaqqaq-baghdad',
            order: 4,
            title: 'Cinq lignes monumentales',
            arabic: 'خط المحقق',
            period: '588 H / 1192–1193',
            region: 'Bagdad, Irak',
            script: 'Muhaqqaq',
            support: 'Papier',
            format: 'Vertical',
            lines: 5,
            accent: '#8f5d78',
            summary: "Seulement cinq lignes occupent la page. Le muhaqqaq transforme la lecture en architecture et donne au codex une présence cérémonielle.",
            insight: "La monumentalité ne dépend pas de la taille seule : elle vient aussi de la rareté des lignes, du souffle des marges et des repères dorés.",
            observations: [
                "Cinq lignes seulement",
                "Titres en coufique doré",
                "Médaillons marginaux",
                "Disques d'or pour les fins de versets"
            ],
            visual: {
                orientation: 'portrait',
                family: 'muhaqqaq',
                ink: '#3f2430',
                paper: '#e2d6b7',
                lineCount: 5,
                gold: true,
                dots: 'full',
                frame: 'illuminated'
            },
            source: {
                institution: 'The Metropolitan Museum of Art',
                label: 'Section from a Qur’an Manuscript, 2004.89',
                note: "Le Met décrit une section copiée à Bagdad en 588 H, avec cinq lignes de muhaqqaq, des titres coufiques dorés, des cadres enluminés et des médaillons marginaux.",
                url: 'https://www.metmuseum.org/art/collection/search/454663'
            }
        },
        {
            id: 'naskh-legibility',
            order: 5,
            title: 'La page devient plus lisible',
            arabic: 'خط النسخ',
            period: 'Début XIVe siècle',
            region: 'Iran ou Irak',
            script: 'Naskh',
            support: 'Papier',
            format: 'Vertical',
            lines: 15,
            accent: '#4d6388',
            summary: "L'écriture cursive gagne les grands manuscrits. Plus régulière et accompagnée d'un système complet de signes, elle facilite la lecture continue.",
            insight: "Le passage au naskh ne supprime pas la beauté du codex : il déplace l'élégance vers la proportion, la régularité et la lisibilité.",
            observations: [
                "Formes plus rondes et continues",
                "Système diacritique complet",
                "Densité de texte plus élevée",
                "Décor intégré autour du bloc écrit"
            ],
            visual: {
                orientation: 'portrait',
                family: 'naskh',
                ink: '#26344f',
                paper: '#e4d8b9',
                lineCount: 15,
                gold: true,
                dots: 'full',
                frame: 'double'
            },
            source: {
                institution: 'The Metropolitan Museum of Art',
                label: 'Folio from a Qur’an Manuscript, 57.141',
                note: "Le Met souligne le développement du naskh cursif, plus lisible que le coufique cérémoniel, et l'emploi d'un ensemble complet de signes diacritiques.",
                url: 'https://www.metmuseum.org/art/collection/search/451455'
            }
        },
        {
            id: 'maghrebi-page',
            order: 6,
            title: 'La voix du Maghreb',
            arabic: 'الخط المغربي',
            period: 'Tradition médiévale et moderne',
            region: 'Maghreb et al-Andalus',
            script: 'Maghrébin',
            support: 'Papier',
            format: 'Vertical',
            lines: 13,
            accent: '#6c7d45',
            summary: "Dans l'Occident islamique, la page développe ses propres équilibres : formes amples, courbes ouvertes et conventions colorées distinctes.",
            insight: "Il n'existe pas une seule histoire graphique du Coran : les traditions régionales conservent des rythmes, des proportions et des signes particuliers.",
            observations: [
                "Courbes basses et généreuses",
                "Traits horizontaux souples",
                "Points et signes colorés",
                "Reliures et formats régionaux variés"
            ],
            visual: {
                orientation: 'portrait',
                family: 'maghrebi',
                ink: '#3f4d28',
                paper: '#d8caa0',
                lineCount: 13,
                gold: false,
                dots: 'colored',
                frame: 'simple'
            },
            source: {
                institution: 'Bibliothèque nationale de France — CCFr',
                label: 'Extrait du Coran, écriture maghrébine, Ms. 3',
                note: "La notice décrit un extrait coranique sur papier, copié en écriture maghrébine et conservé dans une reliure de cuir décorée.",
                url: 'https://ccfr.bnf.fr/portailccfr/ark:/16871/004b1924581'
            }
        }
    ],
    glossary: [
        { term: 'Ductus', definition: "Le mouvement et l'ordre des gestes qui construisent les lettres." },
        { term: 'Colophon', definition: "La note finale qui peut donner le nom du copiste, le lieu ou la date de copie." },
        { term: 'Réglure', definition: "Le système de lignes préparatoires qui organise le bloc de texte." },
        { term: 'Enluminure', definition: "Le décor peint ou doré qui structure et magnifie la page." },
        { term: 'Support', definition: "La matière qui reçoit l'écriture : parchemin, papyrus ou papier." }
    ],
    workshop: {
        scripts: [
            { id: 'hijazi', label: 'Hijâzî', description: 'Souple et incliné' },
            { id: 'kufic', label: 'Coufique', description: 'Anguleux et étiré' },
            { id: 'eastern', label: 'Coufique oriental', description: 'Vertical et nerveux' },
            { id: 'muhaqqaq', label: 'Muhaqqaq', description: 'Large et monumental' },
            { id: 'naskh', label: 'Naskh', description: 'Rond et lisible' },
            { id: 'maghrebi', label: 'Maghrébin', description: 'Ouvert et souple' }
        ],
        supports: [
            { id: 'parchment', label: 'Parchemin', color: '#d6bf8c' },
            { id: 'paper', label: 'Papier', color: '#e4d8b9' },
            { id: 'blue', label: 'Fond teinté', color: '#263b54' }
        ]
    }
};
