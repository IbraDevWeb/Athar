// Couche de lecture des notices 1 à 40.
// Les formulations et degrés originaux restent intacts dans biographies_data.js
// et biography_sources_data.js ; cette couche n'authentifie aucune transmission.
const ATHAR_READING_PRESENTATION = (() => {
    const corrections = {
        1: {
            quote: '« Je pourrais adresser des reproches à certains, sauf à Abou Oubayda. »',
            timeline: { 6: { year: '17 ou 18 H', desc: "Décède lors de la peste d’{Amwas}, à 58 ans selon la notice." } },
            citations: { 1: { text: "« J'aurais aimé être un ovin que ma famille égorge, afin qu'ils mangent sa chair. »" } }
        },
        2: { quote: '« Qui souhaite voir un martyr marcher sur terre regarde Talha. »' },
        3: {
            timeline: {
                0: { desc: "Se convertit très jeune. Un autre épisode de sa jeunesse est associé au port du glaive." },
                1: { desc: "À {Badr}, il est décrit portant un turban jaune." }
            }
        },
        4: { citations: { 1: { text: '« Tu es digne de confiance pour les habitants du ciel et de la terre. »', narrator: 'Parole attribuée au Prophète ﷺ' } } },
        6: { timeline: { 4: { year: '51 ou 52 H', desc: "Décède à {Al-Aqiq} et est inhumé à Médine, selon Al-Wâqidî." } } },
        8: { timeline: { 3: { year: '3 ou 4 H', desc: 'Décès d’Abou Salama après son expédition à {Qatane}, selon les récits biographiques.' } } },
        9: { timeline: { 0: { desc: 'Quatorzième converti, selon Abou ‘Oumar.' } } },
        11: {
            intro: "Oubayda ibn Al-Hârith ibn Al-Mouttalib participa aux premiers détachements militaires et au duel de Badr.",
            timeline: { 0: { desc: 'Reçoit une bannière lors des premiers détachements, selon Ibn Ishâq.' } }
        },
        12: { timeline: { 0: { desc: "Dirige l'expédition de Nakhla ; l'incident du mois sacré est rapproché du verset 2:217." } } },
        13: { timeline: { 1: { desc: "À {Badr}, il invite son père ‘Outba à combattre en duel, selon Abou az-Zinâd." } } },
        15: { timeline: { 3: { desc: 'Funérailles des martyrs d’{Ouhoud}.' } } },
        16: {
            intro: "‘Aqil, anciennement appelé Ghâfil selon Ibn Sa‘d, appartient à une fratrie de quatre compagnons présents à Badr. Il se convertit, émigre et meurt à Badr, à 34 ans selon sa notice.",
            citations: { 0: { text: '‘Aqil fut associé à un compagnon des Ansâr dans la fraternité médinoise.' } }
        },
        19: { timeline: { 1: { desc: 'Meurt à Al-Yamâma.' } } },
        20: {
            timeline: {
                1: { year: 'Date non fixée', desc: "Mistah est cité dans l'affaire de l'Ifk, rapportée par ‘Â’isha." },
                2: { year: 'Décès (date non fixée)', desc: 'Décès de Mistah ibn Outhatha.' }
            }
        },
        21: { timeline: { 2: { desc: "Abou ‘Abs est cité parmi les hommes ayant accompagné Muhammad ibn Maslama contre Ka‘b ibn al-Ashraf dans un récit." } } },
        22: {
            intro: "Mâlik ibn at-Tayihân, connu comme Abou al-Haytham, figure parmi les Ansâr et les représentants d'al-‘Aqaba. Les récits relatent son activité autour des récoltes de Khaybar.",
            quote: '« Celui qui est consulté est dépositaire d’une confiance. »',
            timeline: { 2: { desc: "Des récits lui attribuent l'estimation des récoltes de Khaybar." } }
        },
        24: { quote: "‘Abd-Allah ibn Souhayl mourut à Al-Yamâma." },
        25: {
            intro: "Souhayl ibn ‘Amr fut capturé à Badr, négocia le traité d'al-Houdaybiya pour Quraysh puis se convertit lors de la conquête de La Mecque. Il joua ensuite un rôle auprès des Mecquois après le décès du Prophète ﷺ.",
            timeline: { 3: { year: 'Décès au Shâm (date non fixée)', desc: 'Décède au Shâm.' } }
        },
        26: { quote: "Le Prophète ﷺ cite Al-Barâ’ parmi ceux dont Allah exauce le serment." },
        27: { timeline: { 3: { year: '15 ou 20 H', desc: 'Décès de Nawfal ibn al-Hârith.' } } },
        28: { timeline: { 2: { desc: "Décès d'Al-Hârith après une longue vie." } } },
        29: { timeline: {
            0: { year: 'Enfance', desc: "Sa mère le présente nourrisson au Prophète ﷺ, qui invoque pour lui." },
            2: { year: '83 ou 84 H', desc: 'Décède à Oman.' }
        } },
        35: {
            intro: "‘Aqîl ibn Abou Tâlib, frère de ‘Alî et Ja‘far, fut capturé à Badr puis se rapprocha du Prophète ﷺ. Les chroniques relatent sa parenté, ses scrupules et son parcours.",
            quote: '« Je t’aime de deux amours… »',
            timeline: {
                1: { year: 'Autour de 8 H', desc: "Se rapproche de l'islam vers la conquête de La Mecque." },
                2: { year: 'Après 8 H', desc: "Siyar rapporte des revenus en dattes liés à Khaybar." },
                3: { desc: 'Décède sous le califat de Mou‘âwiya.' }
            }
        },
        36: { timeline: { 0: { year: 'Enfance', desc: "Les biographies retracent l'enfance de Zayd, son enlèvement, sa vente puis son affranchissement." } } },
        37: {
            intro: "‘Abd-Allah ibn Rawâha, poète des Ansâr, participa à Badr, fut chargé d'estimer les récoltes de Khaybar et fut désigné troisième commandant à Mou’ta.",
            timeline: { 2: { desc: "À Khaybar, Ibn Rawâha participe à l'estimation des récoltes." } }
        },
        38: {
            timeline: { 0: { desc: 'À Qoubâ, Koulthoum accueille le Prophète ﷺ selon Ibn Ishâq.' } },
            citations: { 0: { text: 'Selon Ibn Ishâq, le Prophète ﷺ séjourna chez Koulthoum à Qoubâ.' } }
        },
        39: { timeline: { 0: { desc: "À {Ouhoud}, reçoit l'épée du Prophète ﷺ et s'engage à en respecter les droits." } } },
        40: { timeline: { 1: { year: 'Vers 4 H', desc: "Khoubayb est capturé lors de l'expédition d'Ar-Rajî‘." } } },
        33: { timeline: { 1: { desc: 'Décède au milieu du califat de Mou‘âwiya.' } } }
    };

    const allowed = chapter => Number.isInteger(chapter?.id) && chapter.id >= 1 && chapter.id <= 40;
    const changesFor = chapter => allowed(chapter) ? (corrections[chapter.id] || {}) : {};
    const quote = chapter => changesFor(chapter).quote || chapter.heroQuote || '';
    const intro = chapter => changesFor(chapter).intro || chapter.intro || '';
    const timeline = (chapter, event, index) => {
        const edit = changesFor(chapter).timeline?.[index];
        return {
            ...event,
            readingYear: edit?.year || event.year,
            readingDesc: edit?.desc || event.desc,
            readingContext: edit ? [event.year, event.desc].filter(Boolean).join(' — ') : ''
        };
    };
    const citation = (chapter, item, index) => {
        const edit = changesFor(chapter).citations?.[index];
        return {
            ...item,
            readingText: edit?.text || item.text,
            readingNarrator: edit?.narrator || item.narrator,
            readingContext: edit ? item.text : ''
        };
    };
    return Object.freeze({
        scope: Object.freeze(Array.from({ length: 40 }, (_, index) => index + 1)),
        corrections: Object.freeze(corrections),
        quote, intro, timeline, citation
    });
})();
