// Athar Pro — Le Ciel des Anciens
// Données pédagogiques locales : représentation simplifiée, non destinée aux calculs astronomiques.
window.ANCIENT_SKY_DATA = Object.freeze({
    meta: {
        title: 'Le Ciel des Anciens',
        subtitle: 'Observer · s’orienter · mémoriser',
        methodology: "Planisphère pédagogique inspiré des interfaces de planétarium. Les positions sont illustratives : elles ne remplacent ni des éphémérides, ni un logiciel d’observation, ni un calcul d’horaires de prière.",
        sources: [
            'Stellarium — principes d’interface : horizon, temps, constellations et cultures célestes',
            'Nomenclature astronomique arabe transmise dans les usages modernes et historiques',
            'Coran 16:16 — les étoiles comme repères ; Coran 53:49 — ash-Shiʿrā'
        ]
    },
    seasons: [
        { id: 'winter', label: 'Hiver', title: 'Le grand ciel d’hiver', note: 'Orion, ash-Shiʿrā et ath-Thurayyā forment des repères très lisibles.', accent: '#9cccf3' },
        { id: 'spring', label: 'Printemps', title: 'Le ciel du printemps', note: 'As-Simāk ar-Rāmiḥ et as-Simāk al-Aʿzal structurent la lecture du ciel.', accent: '#8fd1b5' },
        { id: 'summer', label: 'Été', title: 'Le triangle de l’été', note: 'An-Nasr al-Wāqiʿ, Dhanab ad-Dajājah et an-Nasr aṭ-Ṭāʾir dessinent un grand triangle.', accent: '#e5c680' },
        { id: 'autumn', label: 'Automne', title: 'Le ciel de l’automne', note: 'Fam al-Ḥūt apparaît comme un repère solitaire tandis que le triangle d’été décline.', accent: '#c6a5e7' }
    ],
    moments: [
        { id: 0, label: 'Crépuscule', offset: -16 },
        { id: 1, label: 'Début de nuit', offset: -8 },
        { id: 2, label: 'Milieu de nuit', offset: 0 },
        { id: 3, label: 'Avant l’aube', offset: 9 },
        { id: 4, label: 'Aube', offset: 17 }
    ],
    categories: [
        { id: 'all', label: 'Tous les repères' },
        { id: 'orientation', label: 'S’orienter' },
        { id: 'season', label: 'Lire les saisons' },
        { id: 'memory', label: 'Noms à retenir' }
    ],
    guides: [
        {
            id: 'north', icon: 'compass', title: 'Trouver le nord', short: 'Partir d’al-Judayy, l’étoile polaire.',
            steps: [
                { objectId: 'polaris', title: 'Repère fixe', text: 'Al-Judayy reste proche du pôle nord céleste et semble peu se déplacer au fil de la nuit.' },
                { objectId: 'dubhe', title: 'La Grande Ourse', text: 'Les étoiles Dubhe et Merak servent de pointeurs visuels vers l’étoile polaire.' },
                { objectId: 'polaris', title: 'Projeter vers l’horizon', text: 'Une verticale imaginaire depuis l’étoile polaire indique approximativement le nord sur l’horizon.' }
            ]
        },
        {
            id: 'winter', icon: 'snowflake', title: 'Reconnaître l’hiver', short: 'Ath-Thurayyā, al-Jawzāʾ et ash-Shiʿrā.',
            steps: [
                { objectId: 'pleiades', title: 'La petite grappe', text: 'Ath-Thurayyā se reconnaît comme un petit groupe serré de points lumineux.' },
                { objectId: 'rigel', title: 'La figure d’al-Jawzāʾ', text: 'Rijl al-Jawzāʾ et Yad al-Jawzāʾ encadrent la ceinture d’Orion.' },
                { objectId: 'sirius', title: 'La plus brillante', text: 'Ash-Shiʿrā est l’étoile la plus brillante du ciel nocturne et se trouve sous Orion.' }
            ]
        },
        {
            id: 'summer', icon: 'triangle', title: 'Lire le triangle d’été', short: 'Trois étoiles, une forme immédiatement mémorisable.',
            steps: [
                { objectId: 'vega', title: 'An-Nasr al-Wāqiʿ', text: 'Vega est souvent le sommet le plus éclatant du triangle.' },
                { objectId: 'deneb', title: 'Dhanab ad-Dajājah', text: 'Deneb marque la queue du Cygne et forme le second sommet.' },
                { objectId: 'altair', title: 'An-Nasr aṭ-Ṭāʾir', text: 'Altaïr, encadrée de deux étoiles plus faibles, ferme le triangle.' }
            ]
        }
    ],
    objects: [
        { id: 'polaris', name: 'Polaris', arabic: 'الجُدَيّ', transliteration: 'al-Judayy', latin: 'α Ursae Minoris', type: 'Étoile', category: 'orientation', magnitude: '1,98', color: '#f9efc8', size: 2.4, summary: 'Le repère le plus simple pour retrouver le nord.', story: 'Située près du pôle nord céleste, elle semble presque immobile tandis que le reste du ciel tourne autour d’elle.', memory: 'Cherche le point calme du ciel du nord.', source: 'Repère astronomique d’orientation', positions: { winter: [63, 0], spring: [63, 0], summer: [63, 0], autumn: [63, 0] } },
        { id: 'dubhe', name: 'Dubhe', arabic: 'ظَهْر الدُّبّ الأَكْبَر', transliteration: 'ẓahr ad-dubb al-akbar', latin: 'α Ursae Majoris', type: 'Étoile', category: 'orientation', magnitude: '1,79', color: '#f4ddb1', size: 2.2, summary: 'L’un des deux pointeurs de la Grande Ourse.', story: 'Avec Merak, Dubhe permet de prolonger une ligne imaginaire en direction de Polaris.', memory: 'Dubhe → Merak → Polaris.', source: 'Grande Ourse', positions: { winter: [54, 337], spring: [70, 318], summer: [55, 292], autumn: [38, 320] } },
        { id: 'merak', name: 'Merak', arabic: 'المَرَاقّ', transliteration: 'al-Marāqq', latin: 'β Ursae Majoris', type: 'Étoile', category: 'orientation', magnitude: '2,37', color: '#e8efff', size: 1.9, summary: 'Le second pointeur vers l’étoile polaire.', story: 'La ligne Merak–Dubhe, prolongée vers le nord, conduit à proximité de Polaris.', memory: 'Le point de départ de la ligne des pointeurs.', source: 'Grande Ourse', positions: { winter: [48, 331], spring: [64, 311], summer: [49, 286], autumn: [33, 314] } },
        { id: 'pleiades', name: 'Les Pléiades', arabic: 'الثُّرَيَّا', transliteration: 'ath-Thurayyā', latin: 'M45', type: 'Amas ouvert', category: 'memory', magnitude: '1,6', color: '#b7ddff', size: 3.0, summary: 'Une petite grappe lumineuse facile à reconnaître.', story: 'Ath-Thurayyā occupe une place majeure dans la mémoire du ciel arabe et dans l’observation saisonnière.', memory: 'Une petite poignée d’étoiles serrées.', source: 'Amas des Pléiades', positions: { winter: [58, 112], spring: [18, 280], summer: [7, 38], autumn: [42, 77] } },
        { id: 'aldebaran', name: 'Aldébaran', arabic: 'الدَّبَرَان', transliteration: 'ad-Dabarān', latin: 'α Tauri', type: 'Étoile', category: 'season', magnitude: '0,87', color: '#f4ae70', size: 2.5, summary: 'Une étoile orangée qui semble suivre les Pléiades.', story: 'Son nom évoque « celui qui suit », parce qu’elle vient après ath-Thurayyā dans le mouvement apparent du ciel.', memory: 'Le regard orangé du Taureau.', source: 'Constellation du Taureau', positions: { winter: [51, 126], spring: [13, 293], summer: [5, 50], autumn: [35, 89] } },
        { id: 'betelgeuse', name: 'Bételgeuse', arabic: 'يَد الجَوْزَاء', transliteration: 'Yad al-Jawzāʾ', latin: 'α Orionis', type: 'Supergéante rouge', category: 'season', magnitude: 'variable', color: '#ef8c68', size: 3.1, summary: 'L’épaule rougeâtre de la grande figure d’hiver.', story: 'Sa teinte chaude contraste avec Rigel et aide à reconnaître la silhouette d’Orion.', memory: 'Rouge en haut, bleue en bas : Bételgeuse et Rigel.', source: 'Constellation d’Orion', positions: { winter: [45, 145], spring: [9, 315], summer: [0, 62], autumn: [26, 107] } },
        { id: 'rigel', name: 'Rigel', arabic: 'رِجْل الجَوْزَاء', transliteration: 'Rijl al-Jawzāʾ', latin: 'β Orionis', type: 'Supergéante bleue', category: 'season', magnitude: '0,13', color: '#c8e8ff', size: 2.8, summary: 'Le pied lumineux d’Orion.', story: 'Rigel et Bételgeuse forment deux angles opposés de la figure d’al-Jawzāʾ.', memory: 'La lumière froide au pied d’Orion.', source: 'Constellation d’Orion', positions: { winter: [35, 157], spring: [5, 328], summer: [0, 72], autumn: [18, 118] } },
        { id: 'sirius', name: 'Sirius', arabic: 'الشِّعْرَى', transliteration: 'ash-Shiʿrā', latin: 'α Canis Majoris', type: 'Étoile', category: 'memory', magnitude: '−1,46', color: '#ffffff', size: 3.5, summary: 'L’étoile la plus brillante du ciel nocturne.', story: 'Ash-Shiʿrā est mentionnée dans le Coran, sourate an-Najm, verset 49.', memory: 'Sous Orion, cherche l’éclat le plus fort.', source: 'Coran 53:49', positions: { winter: [28, 172], spring: [2, 344], summer: [0, 82], autumn: [11, 132] } },
        { id: 'canopus', name: 'Canopus', arabic: 'سُهَيْل', transliteration: 'Suhayl', latin: 'α Carinae', type: 'Étoile', category: 'orientation', magnitude: '−0,74', color: '#fff1c7', size: 3.0, summary: 'Un grand repère du ciel méridional.', story: 'Suhayl est l’un des noms d’étoiles les plus célèbres dans la culture arabe, associé aux voyages et aux horizons du sud.', memory: 'Très basse au sud depuis les latitudes nord.', source: 'Navigation céleste traditionnelle', positions: { winter: [9, 191], spring: [0, 220], summer: [0, 250], autumn: [3, 166] } },
        { id: 'arcturus', name: 'Arcturus', arabic: 'السِّمَاك الرَّامِح', transliteration: 'as-Simāk ar-Rāmiḥ', latin: 'α Boötis', type: 'Géante orange', category: 'season', magnitude: '−0,05', color: '#f2ba7c', size: 2.8, summary: 'Le grand phare orangé du printemps.', story: 'On peut la retrouver en prolongeant la courbe du manche de la Grande Ourse.', memory: 'Suis l’arc de la Grande Ourse vers Arcturus.', source: 'Constellation du Bouvier', positions: { winter: [14, 72], spring: [57, 163], summer: [36, 257], autumn: [10, 20] } },
        { id: 'spica', name: 'Spica', arabic: 'السِّمَاك الأَعْزَل', transliteration: 'as-Simāk al-Aʿzal', latin: 'α Virginis', type: 'Étoile double', category: 'season', magnitude: '0,98', color: '#cae5ff', size: 2.3, summary: 'Un repère bleu-blanc du printemps.', story: 'Après Arcturus, la même grande courbe visuelle mène vers Spica.', memory: 'Arc vers Arcturus, puis poursuis vers Spica.', source: 'Constellation de la Vierge', positions: { winter: [6, 98], spring: [43, 193], summer: [24, 279], autumn: [5, 36] } },
        { id: 'vega', name: 'Vega', arabic: 'النَّسْر الوَاقِع', transliteration: 'an-Nasr al-Wāqiʿ', latin: 'α Lyrae', type: 'Étoile', category: 'memory', magnitude: '0,03', color: '#dff3ff', size: 3.0, summary: 'Le sommet le plus éclatant du triangle d’été.', story: 'Vega domine souvent le ciel estival et sert de point d’entrée vers le Triangle d’été.', memory: 'La plus brillante des trois.', source: 'Constellation de la Lyre', positions: { winter: [11, 312], spring: [27, 48], summer: [73, 122], autumn: [38, 264] } },
        { id: 'deneb', name: 'Deneb', arabic: 'ذَنَب الدَّجَاجَة', transliteration: 'Dhanab ad-Dajājah', latin: 'α Cygni', type: 'Supergéante', category: 'memory', magnitude: '1,25', color: '#eef7ff', size: 2.6, summary: 'La queue du Cygne et le second sommet du triangle.', story: 'Deneb paraît moins brillante que Vega mais occupe une vaste région de la Voie lactée.', memory: 'Le sommet le plus éloigné du triangle.', source: 'Constellation du Cygne', positions: { winter: [20, 329], spring: [32, 30], summer: [68, 87], autumn: [48, 249] } },
        { id: 'altair', name: 'Altaïr', arabic: 'النَّسْر الطَّائِر', transliteration: 'an-Nasr aṭ-Ṭāʾir', latin: 'α Aquilae', type: 'Étoile', category: 'memory', magnitude: '0,76', color: '#fff2d5', size: 2.7, summary: 'Le troisième sommet du triangle d’été.', story: 'Altaïr se reconnaît grâce aux deux étoiles plus faibles qui l’encadrent.', memory: 'Trois étoiles alignées, la plus brillante au centre.', source: 'Constellation de l’Aigle', positions: { winter: [6, 299], spring: [15, 54], summer: [59, 147], autumn: [27, 237] } },
        { id: 'fomalhaut', name: 'Fomalhaut', arabic: 'فَم الحُوت', transliteration: 'Fam al-Ḥūt', latin: 'α Piscis Austrini', type: 'Étoile', category: 'season', magnitude: '1,16', color: '#e7f4ff', size: 2.5, summary: 'Un phare solitaire dans le ciel de l’automne.', story: 'Son isolement relatif la rend facile à identifier lorsque le ciel automnal est dégagé.', memory: 'Une étoile brillante presque seule au sud.', source: 'Poisson austral', positions: { winter: [0, 241], spring: [0, 290], summer: [16, 212], autumn: [35, 186] } },
        { id: 'moon', name: 'La Lune', arabic: 'القَمَر', transliteration: 'al-Qamar', latin: 'Luna', type: 'Satellite', category: 'memory', magnitude: 'variable', color: '#f7e9ad', size: 5.0, summary: 'Le repère calendaire le plus familier.', story: 'Son cycle structure les mois lunaires. Sa position illustrée ici est volontairement symbolique.', memory: 'Observe sa forme, puis sa position de nuit en nuit.', source: 'Cycle lunaire', positions: { winter: [56, 232], spring: [61, 254], summer: [47, 202], autumn: [52, 220] } }
    ],
    links: [
        { id: 'pointers', season: 'all', objects: ['merak', 'dubhe', 'polaris'], label: 'Pointeurs du nord' },
        { id: 'winter-shape', season: 'winter', objects: ['betelgeuse', 'rigel', 'sirius'], label: 'Repères d’hiver' },
        { id: 'taurus', season: 'winter', objects: ['pleiades', 'aldebaran'], label: 'Taureau' },
        { id: 'spring-arc', season: 'spring', objects: ['dubhe', 'arcturus', 'spica'], label: 'Arc du printemps' },
        { id: 'summer-triangle', season: 'summer', objects: ['vega', 'deneb', 'altair', 'vega'], label: 'Triangle d’été' },
        { id: 'autumn-remnant', season: 'autumn', objects: ['deneb', 'altair', 'fomalhaut'], label: 'Repères d’automne' }
    ]
});
