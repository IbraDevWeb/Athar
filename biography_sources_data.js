// Correspondances bibliographiques ciblées. Aucune reproduction de PDF.
// Un passage repéré ne certifie pas l'authenticité de la transmission.
const BIOGRAPHY_SOURCES = {
  "1": {
    "id": 1,
    "fascicle": "01",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "readUrl": "https://siyar.fr/livre/1/11",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Audit ciblé : citations, récits et voies de transmission documentés individuellement ; seuls les degrés attribués à une autorité identifiable sont indiqués. Ce travail ne certifie pas automatiquement la chaîne ni la notice entière.",
    "entries": [
      {
        "kind": "narrative",
        "id": 100,
        "pdfPage": 6,
        "printedPage": 5,
        "title": "Conversion avant Dâr al-Arqam",
        "note": "Le groupe des cinq convertis et la chronologie avant Dâr al-Arqam sont présents.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 101,
        "pdfPage": 6,
        "printedPage": 5,
        "title": "Deux maillons du casque à Ouhoud",
        "note": "Le récit des deux maillons et de la perte des incisives figure dans le fascicule.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 105,
        "pdfPage": 20,
        "printedPage": 19,
        "title": "Don transmis par ‘Oumar",
        "note": "L’ouvrage mentionne 400 ou 4 000 dinars : les deux montants doivent être conservés.",
        "status": "variant"
      },
      {
        "kind": "timeline",
        "id": 6,
        "pdfPage": 29,
        "printedPage": 28,
        "title": "Décès pendant la peste",
        "note": "La source mentionne 18 H et rapporte également une datation à 17 H.",
        "status": "variant"
      },
      {
        "kind": "hadith",
        "id": 0,
        "pdfPage": 9,
        "printedPage": 8,
        "title": "L'homme de confiance de la communauté",
        "note": "Sahîh al-Bukhârî 3744, Anas → Abou Qilâba → Khâlid → ‘Abd al-A‘lâ. Rapport prophétique présent dans un recueil authentique.",
        "status": "located",
        "grade": "sahih",
        "hadithRef": "Al-Bukhârî 3744",
        "externalUrl": "https://sunnah.com/bukhari:3744",
        "isnad": "Anas → Abou Qilâba → Khâlid → ‘Abd al-A‘lâ → ‘Amr ibn ‘Alî (voie citée)."
      },
      {
        "kind": "hadith",
        "id": 1,
        "pdfPage": 21,
        "printedPage": 20,
        "title": "Le souhait d'être un ovin",
        "note": "Parole attribuée à Abou Oubayda : Ma‘mar rapporte de Qatâda ; ce dernier ne pouvait avoir entendu directement Abou Oubayda, mort bien auparavant. Ce n'est pas une parole prophétique et sa chaîne est interrompue.",
        "status": "weak",
        "grade": "attribution_discontinue",
        "hadithRef": "Siyar, fasc. 01, p. imprimée 20",
        "isnad": "Ma‘mar → Qatâda → [intermédiaire absent] → Abou Oubayda"
      },
      {
        "kind": "hadith",
        "id": 2,
        "pdfPage": 24,
        "printedPage": 23,
        "title": "Le jeûne est une protection",
        "note": "An-Nasâ’î 2233 rapporte la version prophétique transmise par Abou Oubayda. La précision « par la médisance » est une explication et ne figure pas dans le texte arabe de cette voie.",
        "status": "located",
        "grade": "hasan",
        "hadithRef": "An-Nasâ’î 2233 — hasan (Darussalam)",
        "externalUrl": "https://sunnah.com/nasai:2233",
        "isnad": "Abou Oubayda → ‘Iyâd ibn Ghotayf → Al-Walîd ibn ‘Abd ar-Rahmân → Bachchâr ibn Abî Sayf → Wâsil → Hammâd"
      },
      {
        "kind": "narrative",
        "id": 102,
        "pdfPage": 19,
        "printedPage": 18,
        "title": "Dénuement et sobriété",
        "note": "Le dialogue avec ‘Oumar figure dans la notice ; sa chaîne spécifique n'est pas authentifiée indépendamment. Ne pas certifier l'inventaire précis de la maison.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 103,
        "pdfPage": 7,
        "printedPage": 6,
        "title": "Expédition de Dhât as-Salâsil",
        "note": "Épisode rapporté par Siyar au sujet du commandement et de la volonté d'éviter la division ; la formule française est une paraphrase, non une citation authentifiée mot à mot.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 104,
        "pdfPage": 21,
        "printedPage": 20,
        "title": "Lettre lors de la peste",
        "note": "Le fascicule donne le récit de la lettre attribuée à ‘Oumar ; le dialogue est une transmission historique à distinguer des hadiths des deux Sahîh.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 106,
        "pdfPage": 25,
        "printedPage": 24,
        "title": "Le grand poisson de l'expédition",
        "note": "Rapporté par Jâbir dans Al-Bukhârî 5493–5494. Selon ces versions, l'armée se nourrit de l'anbar environ une quinzaine de jours ; ne pas imposer « un mois » comme durée certaine.",
        "status": "located",
        "externalUrl": "https://sunnah.com/bukhari:5493",
        "hadithRef": "Al-Bukhârî 5493–5494"
      },
      {
        "kind": "quote",
        "id": 0,
        "pdfPage": 14,
        "printedPage": 13,
        "title": "Reproche impossible à Abou Oubayda",
        "note": "Attribué au Prophète par Al-Hasan al-Basrî, sans mention de Compagnon dans cette voie : transmission moursal. Citation non authentifiée comme parole prophétique.",
        "status": "weak",
        "grade": "mursal",
        "isnad": "Al-Hasan al-Basrî → [compagnon absent] → Prophète (attribution)"
      }
    ]
  },
  "2": {
    "id": 2,
    "fascicle": "02",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "readUrl": "https://siyar.fr/livre/1/29",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Audit ciblé : citations, récits et voies de transmission documentés individuellement ; seuls les degrés attribués à une autorité identifiable sont indiqués. Ce travail ne certifie pas automatiquement la chaîne ni la notice entière.",
    "entries": [
      {
        "kind": "narrative",
        "id": 201,
        "pdfPage": 6,
        "printedPage": 5,
        "title": "Défense du Prophète à Ouhoud",
        "note": "Le cri de douleur et la réponse rapportée au sujet de « Bismillah » figurent dans le récit.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": 14,
        "printedPage": 13,
        "title": "Vingt-quatre blessures à Ouhoud",
        "note": "Le nombre de blessures est attribué aux filles de Talha.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 204,
        "pdfPage": 27,
        "printedPage": 26,
        "title": "Récit relatif à sa sépulture",
        "note": "L’épisode est rapporté à partir d’un rêve, avec une variante sur l’identité du rêveur. Ne pas présenter le miracle comme certifié.",
        "status": "qualification"
      },
      {
        "kind": "hadith",
        "id": 0,
        "pdfPage": 10,
        "printedPage": 9,
        "title": "Talha et Zoubayr voisins au Paradis",
        "note": "At-Tirmidhî 3741 : hadith gharîb selon At-Tirmidhî ; classé hasan par Darussalam. Le rapport est transmis par ‘Alî, et non attribué directement à Talha.",
        "status": "variant",
        "grade": "hasan",
        "hadithRef": "At-Tirmidhî 3741 — gharîb / hasan (Darussalam)",
        "externalUrl": "https://sunnah.com/tirmidhi:3741",
        "isnad": "‘Alî → ‘Ouqba ibn ‘Alqama → Abou ‘Abd ar-Rahmân ibn Mansour → Al-Achajj"
      },
      {
        "kind": "hadith",
        "id": 1,
        "pdfPage": 5,
        "printedPage": 4,
        "title": "Le Paradis est acquis à Talha",
        "note": "At-Tirmidhî 3738 rapporte cet énoncé après le geste de Talha aidant le Prophète à monter sur un rocher ; hasan sahih gharîb selon At-Tirmidhî, hasan selon Darussalam.",
        "status": "located",
        "grade": "hasan",
        "hadithRef": "At-Tirmidhî 3738 — hasan (Darussalam)",
        "externalUrl": "https://sunnah.com/tirmidhi:3738",
        "isnad": "Zoubayr → ‘Abd-Allâh ibn Zoubayr → ‘Abbâd → Yahyâ ibn ‘Abbâd → Ibn Ishâq"
      },
      {
        "kind": "narrative",
        "id": 202,
        "pdfPage": 11,
        "printedPage": 10,
        "title": "Générosité : une somme rapportée",
        "note": "La notice rapporte la générosité de Talha et plusieurs évaluations. La scène et le montant doivent être attribués à leur transmission, sans certification indépendante de ce total.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 203,
        "pdfPage": 21,
        "printedPage": 20,
        "title": "Deuil d'‘Alî après Al-Jamal",
        "note": "Le récit du deuil d'‘Alî est cité ; la parole des « voisins au Paradis » est à référencer séparément à At-Tirmidhî 3741.",
        "status": "qualification",
        "externalUrl": "https://sunnah.com/tirmidhi:3741",
        "hadithRef": "At-Tirmidhî 3741 (citation distincte)"
      },
      {
        "kind": "quote",
        "id": 0,
        "pdfPage": 4,
        "printedPage": 3,
        "title": "Martyr marchant sur terre",
        "note": "At-Tirmidhî 3739 dit ce hadith gharîb et relève des critiques sur As-Salt ibn Dînâr et Sâlih ibn Moussa ; classé da‘îf (Darussalam).",
        "status": "weak",
        "grade": "daif",
        "hadithRef": "At-Tirmidhî 3739",
        "externalUrl": "https://sunnah.com/tirmidhi:3739",
        "isnad": "Jâbir → Abou Nadra → As-Salt ibn Dînâr → Sâlih ibn Moussa (rapporteurs critiqués)"
      }
    ]
  },
  "3": {
    "id": 3,
    "fascicle": "03",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "readUrl": "https://siyar.fr/livre/1/47",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Audit ciblé : citations, récits et voies de transmission documentés individuellement ; seuls les degrés attribués à une autorité identifiable sont indiqués. Ce travail ne certifie pas automatiquement la chaîne ni la notice entière.",
    "entries": [
      {
        "kind": "narrative",
        "id": 301,
        "pdfPage": 3,
        "printedPage": 2,
        "title": "Premier glaive",
        "note": "Le récit de la rumeur et du glaive est présent dans la source.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 0,
        "pdfPage": 3,
        "printedPage": 2,
        "title": "Âges rapportés",
        "note": "La source donne seize ans puis huit ans selon une transmission pour la conversion ; douze ans concerne l’épisode du glaive. Ne pas confondre les âges.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 302,
        "pdfPage": 9,
        "printedPage": 8,
        "title": "Turban jaune à Badr",
        "note": "Une voie mentionne Jibrîl, une autre les anges. Ces formulations doivent rester attribuées à leurs transmissions.",
        "status": "variant"
      },
      {
        "kind": "hadith",
        "id": 0,
        "pdfPage": 12,
        "printedPage": 11,
        "title": "L'apôtre du Prophète",
        "note": "La formulation sûre est « Chaque prophète a un hawârî, et le mien est Zoubayr », Sahîh al-Bukhârî 3719. La mention du lien de parenté existe par une autre voie dans Siyar et ne doit pas être soudée à la citation sans le préciser.",
        "status": "located",
        "grade": "sahih",
        "hadithRef": "Al-Bukhârî 3719",
        "externalUrl": "https://sunnah.com/bukhari:3719",
        "isnad": "Jâbir → Mouhammad ibn al-Mounkadir → ‘Abd al-‘Azîz ibn Abî Salama → Mâlik ibn Ismâ‘îl"
      },
      {
        "kind": "hadith",
        "id": 1,
        "pdfPage": 12,
        "printedPage": 11,
        "title": "Annonce à l'assassin de Zoubayr",
        "note": "Propos attribué à ‘Alî, non au Prophète. Rapporté dans Siyar via le Mousnad d'Ahmad ; l'isnâd de cette voie n'a pas reçu ici de classement indépendant fiable.",
        "status": "qualification",
        "grade": "ungraded",
        "hadithRef": "Siyar, fasc. 03, p. imprimée 11 ; Mousnad Ahmad (voie citée)",
        "isnad": "‘Alî → Zirr → ‘Âsim → Zâ’ida → Mou‘âwiya ibn ‘Amr"
      },
      {
        "kind": "narrative",
        "id": 303,
        "pdfPage": 38,
        "printedPage": 37,
        "title": "Dettes et invocation du Maître",
        "note": "Témoignage attribué à ‘Abd-Allâh ibn Zoubayr, transmis via Hichâm ibn ‘Ourwa. Les montants doivent rester ceux de cette version sans généraliser à d'autres inventaires.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 304,
        "pdfPage": 32,
        "printedPage": 31,
        "title": "Coup d'épieu à Badr",
        "note": "Cette scène est également rapportée dans Al-Bukhârî 3998 par ‘Ourwa d'après Zoubayr. Le combattant désigné est ‘Oubayda ibn Sa‘îd ibn al-‘Âs.",
        "status": "located",
        "externalUrl": "https://sunnah.com/bukhari:3998",
        "hadithRef": "Al-Bukhârî 3998"
      },
      {
        "kind": "quote",
        "id": 0,
        "pdfPage": 12,
        "printedPage": 11,
        "title": "Le hawârî de chaque prophète",
        "note": "Parole prophétique attestée dans Sahîh al-Bukhârî 3719, transmis de Jâbir par Ibn al-Mounkadir.",
        "status": "located",
        "grade": "sahih",
        "hadithRef": "Al-Bukhârî 3719",
        "externalUrl": "https://sunnah.com/bukhari:3719"
      }
    ]
  },
  "4": {
    "id": 4,
    "fascicle": "04",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "readUrl": "https://siyar.fr/livre/1/73",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Audit ciblé : citations, récits et voies de transmission documentés individuellement ; seuls les degrés attribués à une autorité identifiable sont indiqués. Ce travail ne certifie pas automatiquement la chaîne ni la notice entière.",
    "entries": [
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": 38,
        "printedPage": 37,
        "title": "Fraternisation et marché",
        "note": "La version avec Sa‘d ibn Rabî‘ figure p. 37 ; une autre version mentionnant ‘Outhmân figure p. 13 (PDF p. 14).",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 401,
        "pdfPage": 15,
        "printedPage": 14,
        "title": "Convoi de sept cents montures",
        "note": "Le récit concernant l’entrée au Paradis est explicitement qualifié de « munkar » (discordant) dans le fascicule.",
        "status": "weak"
      },
      {
        "kind": "hadith",
        "id": 0,
        "pdfPage": 23,
        "printedPage": 22,
        "title": "Interdiction d'insulter les compagnons",
        "note": "Sahîh Mouslim 2541a, selon Abou Sa‘îd. La version 2541b confirme la parole générale, mais certaines voies omettent le contexte de Khâlid et Abderrahman.",
        "status": "located",
        "grade": "sahih",
        "hadithRef": "Mouslim 2541a–b",
        "externalUrl": "https://sunnah.com/muslim:2541a",
        "isnad": "Abou Sa‘îd → Abou Sâlih → Al-A‘mach → Jarîr → ‘Outhmân ibn Abî Chayba"
      },
      {
        "kind": "hadith",
        "id": 1,
        "pdfPage": 31,
        "printedPage": 30,
        "title": "Digne de confiance des cieux et de la terre",
        "note": "La formule est rapportée par Ach-Châchî et citée dans Siyar, mais Dhahabî précise qu'Abou Mou‘allâ est un rapporteur faible. Attribution prophétique à présenter sous réserve.",
        "status": "weak",
        "grade": "weak_chain",
        "hadithRef": "Mousnad Ach-Châchî (repris dans Siyar, fasc. 04, p. 30)",
        "isnad": "‘Alî (propos attribués au Prophète) ; voie comportant Abou Mou‘allâ, critiqué par Dhahabî"
      },
      {
        "kind": "narrative",
        "id": 402,
        "pdfPage": 19,
        "printedPage": 18,
        "title": "Prière dirigée devant le Prophète",
        "note": "Épisode rapporté dans Siyar, également conservé dans Sahîh Mouslim. Une direction de prière ne constitue pas une validation de tous les détails secondaires.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 403,
        "pdfPage": 38,
        "printedPage": 37,
        "title": "Héritage : chiffres variables",
        "note": "Les parts attribuées aux épouses d'Abderrahman varient selon les transmissions. Ne pas figer le nombre de 80 000 comme unanimement rapporté.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 404,
        "pdfPage": 30,
        "printedPage": 29,
        "title": "La consultation et la désignation",
        "note": "Délibérations historiques de la choura rapportées avec plusieurs transmissions ; les dialogues sont des reformulations, non des transcriptions vérifiées mot pour mot.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 405,
        "pdfPage": 6,
        "printedPage": 5,
        "title": "Jizya des Mages de Hajar",
        "note": "Dhahabî rapporte le témoignage d'Abderrahman invoqué devant ‘Oumar pour le prélèvement de la jizya. Ne pas lui attribuer une exclusivité historique non établie.",
        "status": "qualification"
      },
      {
        "kind": "quote",
        "id": 0,
        "pdfPage": 15,
        "printedPage": 14,
        "title": "Indique-moi le marché",
        "note": "Parole d'Abderrahman ibn ‘Aouf à Sa‘d ibn Rabî‘ (ce n'est pas une parole prophétique). Scène rapportée par Anas dans Sahîh al-Bukhârî 2049.",
        "status": "located",
        "grade": "companion",
        "hadithRef": "Al-Bukhârî 2049",
        "externalUrl": "https://sunnah.com/bukhari:2049"
      }
    ]
  },
  "5": {
    "id": 5,
    "fascicle": "05",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "readUrl": "https://siyar.fr/livre/1/96",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Audit ciblé : citations, récits et voies de transmission documentés individuellement ; seuls les degrés attribués à une autorité identifiable sont indiqués. Ce travail ne certifie pas automatiquement la chaîne ni la notice entière.",
    "entries": [
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": 11,
        "printedPage": 10,
        "title": "Première flèche tirée",
        "note": "Le propos attribué à Sa‘d se trouve à la page indiquée ; une autre voie est également mentionnée ensuite.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 503,
        "pdfPage": 50,
        "printedPage": 49,
        "title": "Vieux manteau pour le linceul",
        "note": "Le récit du manteau conservé depuis Badr figure dans le fascicule.",
        "status": "located"
      },
      {
        "kind": "hadith",
        "id": 0,
        "pdfPage": 30,
        "printedPage": 29,
        "title": "Invocation pour Sa‘d",
        "note": "At-Tirmidhî 3751 ne contient que la demande d'exaucement de l'invocation de Sa‘d. At-Tirmidhî préfère une voie où Qays transmet directement la parole prophétique sans citer Sa‘d ; hasan selon Darussalam.",
        "status": "variant",
        "grade": "hasan",
        "hadithRef": "At-Tirmidhî 3751 — hasan (Darussalam)",
        "externalUrl": "https://sunnah.com/tirmidhi:3751",
        "isnad": "Sa‘d → Qays ibn Abî Hâzim → Ismâ‘îl ibn Abî Khâlid → Ja‘far ibn ‘Aoun ; autre voie : Qays attribue directement au Prophète"
      },
      {
        "kind": "hadith",
        "id": 1,
        "pdfPage": 28,
        "printedPage": 27,
        "title": "Voici mon oncle maternel",
        "note": "At-Tirmidhî 3752 le qualifie de hasan gharîb, mais l'évaluation Darussalam indique da‘îf. At-Tirmidhî dit connaître cette voie par Moujâlid, qui est discuté. Il s'agit d'un oncle par appartenance tribale maternelle, non de son oncle direct.",
        "status": "variant",
        "grade": "disputed",
        "hadithRef": "At-Tirmidhî 3752 — hasan gharîb / da‘îf (Darussalam)",
        "externalUrl": "https://sunnah.com/tirmidhi:3752",
        "isnad": "Jâbir → ‘Âmir ach-Cha‘bî → Moujâlid → Abou Ousâma"
      },
      {
        "kind": "narrative",
        "id": 501,
        "pdfPage": 27,
        "printedPage": 26,
        "title": "Désaccord de Sa‘d avec sa mère",
        "note": "Le récit de la grève de la faim et la persévérance de Sa‘d est transmis dans la notice ; la formulation exacte dépend de la version.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 502,
        "pdfPage": null,
        "printedPage": null,
        "title": "L'accusateur de Koufa",
        "note": "La scène détaillée a été retrouvée dans Sahîh al-Bukhârî 755 (Jâbir ibn Samoura), plutôt que dans les passages indexés de ce fascicule. Ne pas lui inventer une page PDF.",
        "status": "located",
        "externalUrl": "https://sunnah.com/bukhari:755",
        "hadithRef": "Al-Bukhârî 755",
        "isnad": "Jâbir ibn Samoura → ‘Abd al-Malik ibn ‘Oumayr → Abou ‘Awâna → Moussa"
      },
      {
        "kind": "narrative",
        "id": 504,
        "pdfPage": 43,
        "printedPage": 42,
        "title": "Retrait pendant la discorde",
        "note": "La notice cite le témoignage du fils de Sa‘d et la formule « Allah aime le serviteur pieux, effacé, doté d'une âme riche ». Le propos est à distinguer de l'explication narrative ajoutée.",
        "status": "located"
      },
      {
        "kind": "quote",
        "id": 0,
        "pdfPage": 12,
        "printedPage": 11,
        "title": "Tire, que mon père et ma mère te soient sacrifiés",
        "note": "Parole attribuée au Prophète dans Siyar par une chaîne aboutissant à Sa‘d. Aucun jugement indépendant n'est posé ici sur la chaîne exacte de cette version française.",
        "status": "qualification",
        "grade": "ungraded",
        "hadithRef": "Siyar, fascicule 05, PDF p. 12"
      }
    ]
  },
  "6": {
    "id": 6,
    "fascicle": "06",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/126",
    "entries": [
      {
        "kind": "narrative",
        "id": 601,
        "pdfPage": 28,
        "printedPage": 27,
        "title": "Les présents sur le mont Hirâ",
        "note": "Le texte rapporte la liste des présents sur le mont Hirâ et non la scène du « neuvième homme » à Koufa.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 602,
        "pdfPage": 26,
        "printedPage": 25,
        "title": "Le litige foncier",
        "note": "Le récit avec Arwa bint Ouways, la prière de Saïd et la chute d'Arwa dans un trou figure pages 24-25.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 603,
        "pdfPage": 24,
        "printedPage": 23,
        "title": "Mission précédant Badr",
        "note": "Talha et Saïd observent la caravane, arrivent trop tard et obtiennent leur part de butin.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Gouverneur de Damas",
        "note": "Abou Oubayda nomme Saïd gouverneur de Damas selon la notice.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 4,
        "pdfPage": 30,
        "printedPage": 29,
        "title": "Date du décès et variantes",
        "note": "L'an 51 H est retenu par Al-Waqidi, une transmission rapporte 52 H et une autre situe le décès à Koufa.",
        "status": "variant"
      },
      {
        "kind": "hadith",
        "id": 0,
        "title": "Truffes : parole prophétique",
        "hadithRef": "Al-Bukhârî 5708 ; Mouslim 2049a",
        "externalUrl": "https://sunnah.com/bukhari:5708",
        "isnad": "Al-Bukhârî : Saïd ibn Zayd rapporte du Prophète ﷺ. Mouslim 2049a : ‘Abd al-Malik ibn ‘Umayr → ‘Amr ibn Hurayth → Saïd ibn Zayd → le Prophète ﷺ.",
        "note": "Parole établie dans les deux recueils ; distinguer la transmission des conseils médicaux contemporains.",
        "status": "located",
        "pdfPage": null,
        "printedPage": null,
        "grade": "sahih"
      }
    ]
  },
  "7": {
    "id": 7,
    "fascicle": "07–14",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/150",
    "entries": [
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": 6,
        "printedPage": 5,
        "title": "Parmi les premiers émigrés",
        "note": "Al-Bara le présente comme premier Muhâjir accueilli : cela ne suffit pas à étayer la qualification de premier ambassadeur.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 701,
        "pdfPage": 7,
        "printedPage": 6,
        "title": "Linceul de Mouss’ab : source primaire",
        "note": "Al-Bukhârî 1276 rapporte le linceul trop court et l'idhkhir. Le témoignage est celui de Khabbâb.",
        "status": "located",
        "hadithRef": "Al-Bukhârî 1276",
        "externalUrl": "https://sunnah.com/bukhari:1276",
        "isnad": "Khabbâb → le récit des funérailles de Mouss’ab."
      },
      {
        "kind": "narrative",
        "id": 702,
        "pdfPage": 9,
        "printedPage": 8,
        "title": "Privations et amaigrissement",
        "note": "Saad ibn Malik décrit l'état physique de Mouss'ab à l'époque des privations.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 703,
        "pdfPage": 7,
        "printedPage": 6,
        "title": "Larmes devant un repas",
        "note": "Le début du témoignage d'Abderrahman et sa réflexion sur la récompense terrestre figurent ici.",
        "status": "located"
      }
    ]
  },
  "8": {
    "id": 8,
    "fascicle": "07–14",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/156",
    "entries": [
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 19,
        "printedPage": 18,
        "title": "Dates de décès divergentes",
        "note": "La notice avance 3 H puis un récit de 4 H après l'expédition de Qatane, en rappelant la version de 3 H.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 801,
        "pdfPage": 19,
        "printedPage": 18,
        "title": "Expédition de Qatane",
        "note": "La mission de 150 combattants et la récidive de la blessure d'Ouhoud sont rapportées.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 802,
        "pdfPage": 17,
        "printedPage": 16,
        "title": "Bonnes paroles au défunt",
        "note": "La notice cite le conseil de prononcer de bonnes paroles auxquelles les anges disent amîn, mais pas ici le détail des yeux.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 803,
        "pdfPage": 17,
        "printedPage": 16,
        "title": "Invocation de l'épreuve",
        "note": "L'invocation qu'Oum Salama prononce au décès de son mari est rapportée ici et à la page suivante.",
        "status": "located"
      },
      {
        "kind": "hadith",
        "id": 0,
        "title": "Invocation pour Abou Salama",
        "hadithRef": "Mouslim 920a",
        "externalUrl": "https://sunnah.com/muslim:920a",
        "isnad": "Oum Salama → récit de la visite du Prophète ﷺ à Abou Salama.",
        "note": "Mouslim 920a rapporte l'invocation, l'attention aux paroles de la famille et la mention des anges disant amîn.",
        "status": "located",
        "pdfPage": null,
        "printedPage": null,
        "grade": "sahih"
      }
    ]
  },
  "9": {
    "id": 9,
    "fascicle": "07–14",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/158",
    "entries": [
      {
        "kind": "timeline",
        "id": 0,
        "pdfPage": 22,
        "printedPage": 21,
        "title": "Abstinence du vin : transmission interrompue",
        "note": "Dhahabî dit que le récit n'est pas authentique en raison d'une chaîne discontinue et signale que l'interdiction vint après son décès.",
        "status": "weak"
      },
      {
        "kind": "narrative",
        "id": 901,
        "pdfPage": 25,
        "printedPage": 24,
        "title": "Refus du renoncement conjugal",
        "note": "Le Prophète interdit l'ascétisme extrême et encourage le modèle prophétique.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 902,
        "pdfPage": 27,
        "printedPage": 26,
        "title": "Larmes sur sa dépouille",
        "note": "La notice cite le récit de l'embrassade et indique qu'At-Tirmidhi l'a authentifié.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 903,
        "pdfPage": 20,
        "printedPage": 19,
        "title": "Pierre marquant la tombe",
        "note": "La chaîne du récit de la pierre est qualifiée de moursal (dernier maillon manquant).",
        "status": "weak"
      },
      {
        "kind": "narrative",
        "id": 904,
        "pdfPage": 28,
        "printedPage": 27,
        "title": "Réserve adressée à Oum Al-'Ala",
        "note": "Le dialogue entre Oum Al-'Ala et le Prophète à propos de l'honneur d'Outhman est rapporté.",
        "status": "located"
      },
      {
        "kind": "hadith",
        "id": 0,
        "title": "Embrassade funéraire et divergence de classement",
        "hadithRef": "At-Tirmidhî 989",
        "externalUrl": "https://sunnah.com/tirmidhi:989",
        "isnad": "Muhammad ibn Bashshâr → ‘Abd ar-Rahmân ibn Mahdî → Sufyân → ‘Âsim ibn ‘Ubayd Allah → al-Qâsim ibn Muhammad → ‘Â’isha.",
        "note": "At-Tirmidhî : hasan sahîh ; classement Darussalam : da‘îf. Ne pas effacer cette divergence.",
        "status": "variant",
        "pdfPage": null,
        "printedPage": null,
        "grade": "disputed"
      }
    ]
  },
  "10": {
    "id": 10,
    "fascicle": "07–14",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/165",
    "entries": [
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": 31,
        "printedPage": 30,
        "title": "Sanction et destitution",
        "note": "La sanction d'Oumar et la perte du poste de Bahreïn sont mentionnées.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 1001,
        "pdfPage": 31,
        "printedPage": 30,
        "title": "Argument du verset 5:93",
        "note": "Le passage cite le verset 5:93, la sanction et la destitution, mais pas l'explication ajoutée dans Athar.",
        "status": "qualification"
      }
    ]
  },
  "11": {
    "id": 11,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Fiche Athar n° 11 : même personne que la fiche n° 45 (Oubayda ibn Al-Harith). Le fascicule la numérote 45, et non 11. Les deux pages Athar restent distinctes à ce stade ; ce repérage ne certifie pas leurs récits.",
    "readUrl": "https://siyar.fr/livre/1/256",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 27,
        "printedPage": 26,
        "title": "Oubayda : doublon des fiches Athar 11 et 45",
        "note": "La source Siyar 38–54 identifie cette personne sous le numéro 45. Les fiches Athar 11 et 45 renvoient au même compagnon ; cela ne justifie pas une seconde biographie numérotée 11 dans Siyar.",
        "status": "located"
      }
    ]
  },
  "13": {
    "id": 13,
    "fascicle": "07–14",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/167",
    "entries": [
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": 38,
        "printedPage": 37,
        "title": "Mort à Al-Yamâma",
        "note": "La notice rapporte la mort comme martyr et l'âge de cinquante-trois ans.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 1301,
        "pdfPage": 35,
        "printedPage": 34,
        "title": "Défi adressé à son père",
        "note": "La notice rapporte l'appel au duel à Badr mais ne décrit pas d'ordre prophétique de s'asseoir.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 1302,
        "pdfPage": 42,
        "printedPage": 41,
        "title": "Dépouilles rapprochées",
        "note": "La proximité des corps d'Abou Houdhayfa et de Salim est rapportée dans le passage consacré à Salim.",
        "status": "located"
      }
    ]
  },
  "14": {
    "id": 14,
    "fascicle": "07–14",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/169",
    "entries": [
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": 39,
        "printedPage": 38,
        "title": "Allaitement de Salim : cas particulier",
        "note": "Les autres épouses du Prophète tiennent l'épisode pour une exception propre à Salim.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 1401,
        "pdfPage": 43,
        "printedPage": 42,
        "title": "Propos de succession sous réserve",
        "note": "L'attribution à Oumar d'une préférence pour Salim et Abou Oubayda est rapportée via Ali ibn Zayd, rapporteur critiqué.",
        "status": "weak"
      },
      {
        "kind": "narrative",
        "id": 1402,
        "pdfPage": 41,
        "printedPage": 40,
        "title": "Fermeté à Al-Yamâma",
        "note": "Une narration d'Al-Waqidi dit que Salim s'immobilisa dans un trou face aux combattants.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 1403,
        "pdfPage": 42,
        "printedPage": 41,
        "title": "Les deux cents dirhams",
        "note": "La somme issue des biens de Salim fut remise à sa mère en héritage, non en charité.",
        "status": "located"
      }
    ]
  },
  "15": {
    "id": 15,
    "fascicle": "15",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages citées correspondent au fascicule français fourni, et non à la pagination de l’édition actuellement en ligne sur Siyar.fr.",
    "reviewScope": "Passages localisés dans la traduction fournie ; ce repérage ne certifie ni l’authenticité des chaînes de transmission ni l’ensemble de la notice.",
    "readUrl": "https://siyar.fr/livre/1/175",
    "entries": [
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 17,
        "printedPage": 16,
        "title": "Prières funéraires : traditions divergentes",
        "note": "Dhahabî privilégie la version sans prière le jour d'Ouhoud et critique un autre récit ; une prière tardive est aussi rapportée.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 1501,
        "pdfPage": 7,
        "printedPage": 6,
        "title": "Récit de Wahchî",
        "note": "Le témoignage décrit le coup de javeline, Sibâ' et l'affrontement d'Ouhoud.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 1502,
        "pdfPage": 15,
        "printedPage": 14,
        "title": "Mutilation de Hamza",
        "note": "Un récit attribue à Wahchî le retrait du foie pour Hind ; il ne dit pas que Hind l'avait arraché elle-même.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 1503,
        "pdfPage": 10,
        "printedPage": 9,
        "title": "Linceul et couverture",
        "note": "La notice mentionne le vêtement trop court et, dans une autre transmission, des branches ; la citronnelle figure dans la notice Mouss'ab.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 1504,
        "pdfPage": 9,
        "printedPage": 8,
        "title": "Récit conditionnel de Wahchî",
        "note": "La mort de Moussaylima est racontée avec l'action d'un combattant ansâri, Wahchî formulant sa contribution sous condition.",
        "status": "qualification"
      }
    ]
  },
  "16": {
    "id": 16,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/186",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice n° 16",
        "note": "Le fascicule contient une notice consacrée à « 'Aqil ibn Al-Boukayr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "17": {
    "id": 17,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/187",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 4,
        "printedPage": 3,
        "title": "Identification de la notice n° 17",
        "note": "Le fascicule contient une notice consacrée à « Khalid ibn Al-Boukayr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "18": {
    "id": 18,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/188",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 4,
        "printedPage": 3,
        "title": "Identification de la notice n° 18",
        "note": "Le fascicule contient une notice consacrée à « Iyas ibn Al-Boukayr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "19": {
    "id": 19,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/188",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 5,
        "printedPage": 4,
        "title": "Identification de la notice n° 19",
        "note": "Le fascicule contient une notice consacrée à « 'Amir ibn Al-Boukayr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "20": {
    "id": 20,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/188",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 6,
        "printedPage": 5,
        "title": "Identification de la notice n° 20",
        "note": "Le fascicule contient une notice consacrée à « Mistah ibn Outhatha ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "21": {
    "id": 21,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/189",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 7,
        "printedPage": 6,
        "title": "Identification de la notice n° 21",
        "note": "Le fascicule contient une notice consacrée à « Abou 'Abs ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "22": {
    "id": 22,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/190",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 8,
        "printedPage": 7,
        "title": "Identification de la notice n° 22",
        "note": "Le fascicule contient une notice consacrée à « Malik ibn At-Tayihane ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 11,
        "printedPage": 10,
        "title": "Décès : témoignages divergents",
        "note": "Le fascicule rapporte un décès durant le califat d'Oumar (ou en 20 H) et une version alternative à Siffîn, jugée moins vraisemblable par Al-Waqidi.",
        "status": "variant"
      }
    ]
  },
  "23": {
    "id": 23,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/192",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 12,
        "printedPage": 11,
        "title": "Identification de la notice n° 23",
        "note": "Le fascicule contient une notice consacrée à « Abou Jandal ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "24": {
    "id": 24,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/193",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 13,
        "printedPage": 12,
        "title": "Identification de la notice n° 24",
        "note": "Le fascicule contient une notice consacrée à « Abd-Allah ibn Souhayl ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "25": {
    "id": 25,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/194",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 15,
        "printedPage": 14,
        "title": "Identification de la notice n° 25",
        "note": "Le fascicule contient une notice consacrée à « Souhayl ibn 'Amr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "26": {
    "id": 26,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/196",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 17,
        "printedPage": 16,
        "title": "Identification de la notice n° 26",
        "note": "Le fascicule contient une notice consacrée à « Al-Bara ibn Malik ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "identity",
        "id": 1,
        "pdfPage": 21,
        "printedPage": 20,
        "title": "Quatre-vingt-dix-neuf duels : déclaration attribuée",
        "note": "Dans le récit d'Anas, Al-Bara affirme avoir abattu quatre-vingt-dix-neuf adversaires en duel, et non exactement cent.",
        "status": "qualification"
      }
    ]
  },
  "27": {
    "id": 27,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/199",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 22,
        "printedPage": 21,
        "title": "Identification de la notice n° 27",
        "note": "Le fascicule contient une notice consacrée à « Nawfal ibn Al-Harith ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 24,
        "printedPage": 23,
        "title": "Date du décès de Nawfal",
        "note": "Le fascicule indique l'an 20 et rapporte également l'an 25 pour son décès.",
        "status": "variant"
      }
    ]
  },
  "28": {
    "id": 28,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/200",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 24,
        "printedPage": 23,
        "title": "Identification de la notice n° 28",
        "note": "Le fascicule contient une notice consacrée à « Al-Harith ibn Nawfal ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "29": {
    "id": 29,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/200",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 25,
        "printedPage": 24,
        "title": "Identification de la notice n° 29",
        "note": "Le fascicule contient une notice consacrée à « Abd-Allah ibn Al-Harith ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "identity",
        "id": 1,
        "pdfPage": 25,
        "printedPage": 24,
        "title": "Abd-Allah, fils d'Al-Harith fils de Nawfal",
        "note": "Cette notice concerne Abd-Allah ibn Al-Harith ibn Nawfal, surnommé Baba, distinct d'Abd-Allah ibn Al-Harith ibn Abdelmoutalib (notice 47).",
        "status": "located"
      }
    ]
  },
  "30": {
    "id": 30,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/202",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 27,
        "printedPage": 26,
        "title": "Identification de la notice n° 30",
        "note": "Le fascicule contient une notice consacrée à « Abd-Allah ibn Abd-Allah ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "31": {
    "id": 31,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/203",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 28,
        "printedPage": 27,
        "title": "Identification de la notice n° 31",
        "note": "Le fascicule contient une notice consacrée à « Saïd ibn Al-Harith ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "32": {
    "id": 32,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/203",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 29,
        "printedPage": 28,
        "title": "Identification de la notice n° 32",
        "note": "Le fascicule contient une notice consacrée à « Abou Soufiane ibn Al-Harith ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "33": {
    "id": 33,
    "fascicle": "16–33",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/207",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 34,
        "printedPage": 33,
        "title": "Identification de la notice n° 33",
        "note": "Le fascicule contient une notice consacrée à « Jafar ibn Abou Soufiane ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "34": {
    "id": 34,
    "fascicle": "34",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/207",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice n° 34",
        "note": "Le fascicule contient une notice consacrée à « Jafar ibn Abou Talib ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "35": {
    "id": 35,
    "fascicle": "35–37",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/219",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice n° 35",
        "note": "Le fascicule contient une notice consacrée à « 'Aqil ibn Abou Talib ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 353,
        "pdfPage": 3,
        "printedPage": 2,
        "title": "Paroles échangées après Badr",
        "note": "Dans ce récit, 'Aqil demande au Prophète quels chefs ont été tués, apprend la mort d'Abou Jahl, puis déclare lui-même que la voie est ouverte ; les rôles étaient inversés dans Athar.",
        "status": "qualification"
      }
    ]
  },
  "36": {
    "id": 36,
    "fascicle": "35–37",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/221",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 5,
        "printedPage": 4,
        "title": "Identification de la notice n° 36",
        "note": "Le fascicule contient une notice consacrée à « Zayd ibn Haritha ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "37": {
    "id": 37,
    "fascicle": "35–37",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/230",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 20,
        "printedPage": 19,
        "title": "Identification de la notice n° 37",
        "note": "Le fascicule contient une notice consacrée à « Abd-Allah ibn Rawaha ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "38": {
    "id": 38,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/242",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 5,
        "printedPage": 4,
        "title": "Identification de la notice n° 38",
        "note": "Le fascicule contient une notice consacrée à « Koulthoum ibn Al-Hidm ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "39": {
    "id": 39,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/244",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 7,
        "printedPage": 6,
        "title": "Identification de la notice n° 39",
        "note": "Le fascicule contient une notice consacrée à « Abou Doujana ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 0,
        "pdfPage": 7,
        "printedPage": 6,
        "title": "Turban rouge",
        "note": "La notice mentionne son turban rouge le jour d'Ouhoud, sans généraliser ce signe à toutes les batailles.",
        "status": "qualification"
      }
    ]
  },
  "40": {
    "id": 40,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/246",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 10,
        "printedPage": 9,
        "title": "Identification de la notice n° 40",
        "note": "Le fascicule contient une notice consacrée à « Khoubayb ibn 'Adi ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "41": {
    "id": 41,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/249",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 15,
        "printedPage": 14,
        "title": "Identification de la notice n° 41",
        "note": "Le fascicule contient une notice consacrée à « Mouadh ibn 'Amr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 411,
        "pdfPage": 16,
        "printedPage": 15,
        "title": "Main blessée au combat",
        "note": "La notice rapporte que Mouadh ibn 'Amr eut la main frappée par Ikrima, puis se dégagea de son bras presque détaché.",
        "status": "located"
      }
    ]
  },
  "42": {
    "id": 42,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/252",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 20,
        "printedPage": 19,
        "title": "Identification de la notice n° 42",
        "note": "Le fascicule contient une notice consacrée à « Mouawidh ibn 'Amr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "43": {
    "id": 43,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/252",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 20,
        "printedPage": 19,
        "title": "Identification de la notice n° 43",
        "note": "Le fascicule contient une notice consacrée à « Khallad ibn 'Amr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "44": {
    "id": 44,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/252",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 21,
        "printedPage": 20,
        "title": "Identification de la notice n° 44",
        "note": "Le fascicule contient une notice consacrée à « 'Amr ibn Al-Jamouh ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "45": {
    "id": 45,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/256",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 27,
        "printedPage": 26,
        "title": "Identification de la notice n° 45",
        "note": "Le fascicule contient une notice consacrée à « Oubayda ibn Al-Harith ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "46": {
    "id": 46,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/259",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 31,
        "printedPage": 30,
        "title": "Identification de la notice n° 46",
        "note": "Le fascicule contient une notice consacrée à « Rabi'a ibn Al-Harith ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "47": {
    "id": 47,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/261",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 35,
        "printedPage": 34,
        "title": "Identification de la notice n° 47",
        "note": "Le fascicule contient une notice consacrée à « Abd-Allah ibn Al-Harith ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "48": {
    "id": 48,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/262",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 36,
        "printedPage": 35,
        "title": "Identification de la notice n° 48",
        "note": "Le fascicule contient une notice consacrée à « Khalid ibn Saïd ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "49": {
    "id": 49,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/263",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 38,
        "printedPage": 37,
        "title": "Identification de la notice n° 49",
        "note": "Le fascicule contient une notice consacrée à « Abane ibn Saïd ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 492,
        "pdfPage": 41,
        "printedPage": 40,
        "title": "Martyre des trois frères : lieu et dates",
        "note": "Le texte indique que les trois frères quittèrent leurs fonctions et moururent au Sham. Une autre page mentionne Yarmouk ou Ajnadayne pour 'Amr : ne pas assigner aux trois une seule bataille avec certitude.",
        "status": "variant"
      }
    ]
  },
  "50": {
    "id": 50,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/265",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 40,
        "printedPage": 39,
        "title": "Identification de la notice n° 50",
        "note": "Le fascicule contient une notice consacrée à « 'Amr ibn Saïd ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "51": {
    "id": 51,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/266",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 41,
        "printedPage": 40,
        "title": "Identification de la notice n° 51",
        "note": "Le fascicule contient une notice consacrée à « Al-'Ala ibn Al-Hadrami ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 511,
        "pdfPage": 43,
        "printedPage": 42,
        "title": "La traversée : deux versions du récit",
        "note": "Une version attribuée à 'Ourwa parle d'une traversée à pied d'un gué ; une autre, rapportée d'Abou Hourayra, évoque la mer franchie à cheval. Il s'agit de récits historiques transmis, non d'une observation vérifiée.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 512,
        "pdfPage": 46,
        "printedPage": 45,
        "title": "L'eau du désert : récit attribué",
        "note": "Le témoignage attribué à Abou Hourayra décrit de l'eau après une invocation, mais le texte rapporte une narration et non une vérification indépendante.",
        "status": "qualification"
      }
    ]
  },
  "52": {
    "id": 52,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/269",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 47,
        "printedPage": 46,
        "title": "Identification de la notice n° 52",
        "note": "Le fascicule contient une notice consacrée à « Saad ibn Khaythama ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "53": {
    "id": 53,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/270",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 48,
        "printedPage": 47,
        "title": "Identification de la notice n° 53",
        "note": "Le fascicule contient une notice consacrée à « Al-Bara ibn Marour ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "54": {
    "id": 54,
    "fascicle": "38–54",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/273",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 53,
        "printedPage": 52,
        "title": "Identification de la notice n° 54",
        "note": "Le fascicule contient une notice consacrée à « Bishr ibn Al-Bara ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "55": {
    "id": 55,
    "fascicle": "55–56",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/274",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice n° 55",
        "note": "Le fascicule contient une notice consacrée à « Saad ibn Oubada ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 4,
        "pdfPage": 14,
        "printedPage": 13,
        "title": "Mort au Hauran : dates et causalité disputées",
        "note": "Plusieurs dates de décès sont rapportées (notamment 14 et 16 H), et un récit attribue la mort aux djinns. Ces narrations doivent être présentées comme telles, non comme des faits établis.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 553,
        "pdfPage": 14,
        "printedPage": 13,
        "title": "La mort attribuée aux djinns",
        "note": "Ibn Sirine, Abou Raja et d'autres rapporteurs transmettent des versions de cette mort ; le fascicule ne démontre pas la causalité surnaturelle.",
        "status": "qualification"
      }
    ]
  },
  "56": {
    "id": 56,
    "fascicle": "55–56",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/282",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 16,
        "printedPage": 15,
        "title": "Identification de la notice n° 56",
        "note": "Le fascicule contient une notice consacrée à « Saad ibn Mouadh ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 564,
        "pdfPage": 46,
        "printedPage": 45,
        "title": "Étreinte de la tombe : chaîne discontinue",
        "note": "Dhahabî précise que la version mentionnant les éclaboussures d'urine possède une chaîne discontinue. Ne pas l'adopter comme explication établie.",
        "status": "weak"
      }
    ]
  },
  "57": {
    "id": 57,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/302",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice n° 57",
        "note": "Le fascicule contient une notice consacrée à « Zayd ibn Al-Khattab ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "58": {
    "id": 58,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/304",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 5,
        "printedPage": 4,
        "title": "Identification de la notice n° 58",
        "note": "Le fascicule contient une notice consacrée à « As'ad ibn Zourara ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "59": {
    "id": 59,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/309",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 13,
        "printedPage": 12,
        "title": "Identification de la notice n° 59",
        "note": "Le fascicule contient une notice consacrée à « Outba ibn Ghazouane ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "60": {
    "id": 60,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/312",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 18,
        "printedPage": 17,
        "title": "Identification de la notice n° 60",
        "note": "Le fascicule contient une notice consacrée à « Oukacha ibn Mihssane ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": 19,
        "printedPage": 18,
        "title": "Décès à Bouzakha : 11 ou 12 H",
        "note": "Une narration donne l'an 12, mais Dhahabî indique explicitement que la version la plus authentique est 11 H.",
        "status": "variant"
      }
    ]
  },
  "61": {
    "id": 61,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/314",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 20,
        "printedPage": 19,
        "title": "Identification de la notice n° 61",
        "note": "Le fascicule contient une notice consacrée à « Thabit ibn Qays ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "62": {
    "id": 62,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/322",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 34,
        "printedPage": 33,
        "title": "Identification de la notice n° 62",
        "note": "Le fascicule contient une notice consacrée à « Toulayha ibn Khouwaylid ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "63": {
    "id": 63,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/323",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 36,
        "printedPage": 35,
        "title": "Identification de la notice n° 63",
        "note": "Le fascicule contient une notice consacrée à « Saad ibn Ar-Rabi' ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "64": {
    "id": 64,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/326",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 40,
        "printedPage": 39,
        "title": "Identification de la notice n° 64",
        "note": "Le fascicule contient une notice consacrée à « Mane ibn 'Adi ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "65": {
    "id": 65,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/328",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 43,
        "printedPage": 42,
        "title": "Identification de la notice n° 65",
        "note": "Le fascicule contient une notice consacrée à « Abd-Allah ibn Abd-Allah ibn Oubay ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "66": {
    "id": 66,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/329",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 45,
        "printedPage": 44,
        "title": "Identification de la notice n° 66",
        "note": "Le fascicule contient une notice consacrée à « Ikrima ibn Abou Jahl ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "67": {
    "id": 67,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/331",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 48,
        "printedPage": 47,
        "title": "Identification de la notice n° 67",
        "note": "Le fascicule contient une notice consacrée à « Abd-Allah ibn 'Amr ibn Haram ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "68": {
    "id": 68,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/334",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 53,
        "printedPage": 52,
        "title": "Identification de la notice n° 68",
        "note": "Le fascicule contient une notice consacrée à « Yazid ibn Abou Soufiane ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "69": {
    "id": 69,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/337",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 58,
        "printedPage": 57,
        "title": "Identification de la notice n° 69",
        "note": "Le fascicule contient une notice consacrée à « Abou Al-'Ass ibn Ar-Rabi' ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "identity",
        "id": 1,
        "pdfPage": 58,
        "printedPage": 57,
        "title": "Gendre du Prophète : identification",
        "note": "Cette notice concerne Abou Al-'Ass ibn Ar-Rabi', époux de Zaynab et gendre du Prophète.",
        "status": "located"
      }
    ]
  },
  "70": {
    "id": 70,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/341",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 64,
        "printedPage": 63,
        "title": "Identification de la notice n° 70",
        "note": "Le fascicule contient une notice consacrée à « Zaynab bint Mouhammad ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 64,
        "printedPage": 63,
        "title": "Décès de Zaynab en 8 H",
        "note": "La notice mentionne la mort de Zaynab en l'an 8, mais ne confirme pas dans ce passage la cause précise liée à une blessure ancienne.",
        "status": "qualification"
      }
    ]
  },
  "71": {
    "id": 71,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/341",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 65,
        "printedPage": 64,
        "title": "Identification de la notice n° 71",
        "note": "Le fascicule contient une notice consacrée à « Oumama bint Abou Al-'Ass ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "72": {
    "id": 72,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/342",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 66,
        "printedPage": 65,
        "title": "Identification de la notice n° 72",
        "note": "Le fascicule contient une notice consacrée à « Abou Zayd Al-Ansari ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "identity",
        "id": 1,
        "pdfPage": 66,
        "printedPage": 65,
        "title": "Nom d'Abou Zayd : variantes",
        "note": "Ibn Saad l'identifie comme Thabit ibn Zayd. La page suivante mentionne aussi Aous ou Mouadh, mais préfère le premier nom.",
        "status": "variant"
      }
    ]
  },
  "73": {
    "id": 73,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/343",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 67,
        "printedPage": 66,
        "title": "Identification de la notice n° 73",
        "note": "Le fascicule contient une notice consacrée à « 'Abbad ibn Bichr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "identity",
        "id": 1,
        "pdfPage": 69,
        "printedPage": 68,
        "title": "Annonce de martyre : faible transmission",
        "note": "Le récit du songe d'Abbad est explicitement rapporté avec une chaîne jugée faible. Ne pas présenter cette annonce comme certaine.",
        "status": "weak"
      }
    ]
  },
  "74": {
    "id": 74,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/346",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 73,
        "printedPage": 72,
        "title": "Identification de la notice n° 74",
        "note": "Le fascicule contient une notice consacrée à « Oussayd ibn Al-Houdayr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "75": {
    "id": 75,
    "fascicle": "57–75",
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "Les pages PDF sont celles des six fascicules transmis ; la page imprimée est PDF − 1. La pagination Siyar.fr (tome 1) est différente.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l'intégralité de la biographie ni l'authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/350",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 78,
        "printedPage": 77,
        "title": "Identification de la notice n° 75",
        "note": "Le fascicule contient une notice consacrée à « At-Toufayl ibn 'Amr ». Il s'agit d'un repérage bibliographique de l'identité, non d'une validation des récits, citations, dates ou hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "76": {
    "id": 76,
    "fascicle": "76–77",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/354",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 76",
        "note": "Le fascicule 76–77 contient la notice relative à « Bilal ibn Rabah ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 4,
        "pdfPage": 3,
        "printedPage": 2,
        "title": "Date et lieu de décès : tradition",
        "note": "La notice signale plusieurs traditions sur le décès de Bilal ; l'une situe celui-ci à Darayya en 20 H, sans le présenter comme une date et un lieu unanimement établis.",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 761,
        "pdfPage": 10,
        "printedPage": 9,
        "title": "Persécution et proclamation de l’unicité",
        "note": "La notice rapporte les supplices et l'invocation de l'unicité divine ; elle critique spécifiquement comme moursal un autre récit impliquant Waraqa.",
        "status": "qualification"
      }
    ]
  },
  "77": {
    "id": 77,
    "fascicle": "76–77",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/367",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 25,
        "printedPage": 24,
        "title": "Identification de la notice 77",
        "note": "Le fascicule 76–77 contient la notice relative à « Ibnou Oum Maktoum ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 32,
        "printedPage": 31,
        "title": "Mort d’Ibn Oum Maktoum : versions divergentes",
        "note": "Al-Waqidi rapporte qu'il revint à Médine et y mourut après Al-Qadisiyya ; Dhahabî signale également une version où il serait mort au cours de la bataille.",
        "status": "variant"
      }
    ]
  },
  "78": {
    "id": 78,
    "fascicle": "78",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/372",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 78",
        "note": "Le fascicule 78 contient la notice relative à « Khalid ibn Al-Walid ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 781,
        "pdfPage": 16,
        "printedPage": 15,
        "title": "Neuf épées à Mouta",
        "note": "Un récit rapporté d'après Qays attribue à Khalid la mention de neuf épées brisées, puis d'une large lame yéménite.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 783,
        "pdfPage": 17,
        "printedPage": 16,
        "title": "Boisson empoisonnée : récit transmis",
        "note": "Deux traditions relatent l'absorption d'une préparation déclarée empoisonnée ; cette narration ne doit pas servir de preuve médicale d'innocuité.",
        "status": "qualification"
      }
    ]
  },
  "79": {
    "id": 79,
    "fascicle": "79–83",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/392",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 79",
        "note": "Le fascicule 79–83 contient la notice relative à « Safoine ibn Bayda ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": 3,
        "printedPage": 2,
        "title": "Deux dates de décès divergentes",
        "note": "Selon Al-Waqidi, une voie donne une mort à Badr ; une autre donne une survie jusqu'au Ramadan 38 H, sans préférence explicitement arrêtée dans cette notice.",
        "status": "variant"
      }
    ]
  },
  "80": {
    "id": 80,
    "fascicle": "79–83",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/393",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 3,
        "printedPage": 2,
        "title": "Identification de la notice 80",
        "note": "Le fascicule 79–83 contient la notice relative à « Souhayl ibn Bayda ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 802,
        "pdfPage": 3,
        "printedPage": 2,
        "title": "Deux migrations vers l’Abyssinie",
        "note": "Les récits d'Ibn Ishaq et d'Al-Waqidi attestent deux voyages vers l'Abyssinie ; le fascicule ne décrit pas d'épisode de protection rapprochée à Tabouk.",
        "status": "qualification"
      }
    ]
  },
  "81": {
    "id": 81,
    "fascicle": "79–83",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/394",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 4,
        "printedPage": 3,
        "title": "Identification de la notice 81",
        "note": "Le fascicule 79–83 contient la notice relative à « Al-Miqdad ibn 'Amr ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": 5,
        "printedPage": 4,
        "title": "Cavalier à Badr, exclusivité non établie",
        "note": "Dhahabî affirme que la présence d'Al-Miqdad à cheval est sûre, tout en relevant une divergence concernant Zoubayr : cela ne confirme pas qu'il était l'unique cavalier.",
        "status": "qualification"
      },
      {
        "kind": "narrative",
        "id": 813,
        "pdfPage": 9,
        "printedPage": 8,
        "title": "Cause du décès et récit médical non étayé",
        "note": "Le fascicule signale seulement qu'il aurait succombé après avoir ingéré de l'huile de ricin ; l'opération de retrait de graisse décrite auparavant n'est pas trouvée dans cette notice.",
        "status": "qualification"
      }
    ]
  },
  "82": {
    "id": 82,
    "fascicle": "79–83",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/397",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 10,
        "printedPage": 9,
        "title": "Identification de la notice 82",
        "note": "Le fascicule 79–83 contient la notice relative à « Oubay ibn Kaab ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": 30,
        "printedPage": 29,
        "title": "Compilation du Coran : avis discutés",
        "note": "Dhahabî déclare improbable la présence d'Oubay dans la commission de compilation d'Outhman : le récit invoqué pour l'appuyer est moursal.",
        "status": "weak"
      },
      {
        "kind": "timeline",
        "id": 3,
        "pdfPage": 30,
        "printedPage": 29,
        "title": "Date du décès d’Oubay : préférence de Dhahabî",
        "note": "Plusieurs dates (19, 22, 30 ou 32 H) sont rapportées ; Dhahabî préfère une mort durant le califat d'Oumar, vers 22 H.",
        "status": "variant"
      }
    ]
  },
  "83": {
    "id": 83,
    "fascicle": "79–83",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/411",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 33,
        "printedPage": 32,
        "title": "Identification de la notice 83",
        "note": "Le fascicule 79–83 contient la notice relative à « An-Nou'mane ibn Mouqarine ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": 38,
        "printedPage": 37,
        "title": "Mort de Nou'mane à Nahavand",
        "note": "Le récit distingue la chute au combat de Nou'mane et la chute de monture du général perse ; il ne faut pas confondre les deux.",
        "status": "qualification"
      }
    ]
  },
  "84": {
    "id": 84,
    "fascicle": "84–85",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/415",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 84",
        "note": "Le fascicule 84–85 contient la notice relative à « Ammar ibn Yassir ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "85": {
    "id": 85,
    "fascicle": "84–85",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/438",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 42,
        "printedPage": 41,
        "title": "Identification de la notice 85",
        "note": "Le fascicule 84–85 contient la notice relative à « Le Négus (Assehama) ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 852,
        "pdfPage": 47,
        "printedPage": 46,
        "title": "Lumière sur la tombe : parole rapportée",
        "note": "Le fascicule attribue à Oum Salama la formule « nous racontions » au sujet d'une lumière sur la tombe : il n'établit pas une observation permanente vérifiée.",
        "status": "qualification"
      }
    ]
  },
  "86": {
    "id": 86,
    "fascicle": "86",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/458",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 86",
        "note": "Le fascicule 86 contient la notice relative à « Mouadh ibn Jabal ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "identity",
        "id": 1,
        "pdfPage": 8,
        "printedPage": 7,
        "title": "Élévation au-dessus des savants : réserves de chaîne",
        "note": "La notice rapporte plusieurs versions du rang de Mouadh au Jour de la Résurrection et signale qu'au moins une chaîne de cette tradition est faible.",
        "status": "weak"
      },
      {
        "kind": "timeline",
        "id": 4,
        "pdfPage": 38,
        "printedPage": 37,
        "title": "Âge et décès : variantes",
        "note": "La notice situe son décès en 17 ou 18 H, et donne plusieurs âges (28, 32, 33, 34 et 38 ans) selon les auteurs.",
        "status": "variant"
      }
    ]
  },
  "87": {
    "id": 87,
    "fascicle": "87–90",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/480",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 87",
        "note": "Le fascicule 87–90 contient la notice relative à « Abd-Allah ibn Massoud ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "88": {
    "id": 88,
    "fascicle": "87–90",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/519",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 71,
        "printedPage": 70,
        "title": "Identification de la notice 88",
        "note": "Le fascicule 87–90 contient la notice relative à « Outba ibn Massoud ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "89": {
    "id": 89,
    "fascicle": "87–90",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/520",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 72,
        "printedPage": 71,
        "title": "Identification de la notice 89",
        "note": "Le fascicule 87–90 contient la notice relative à « Khoubayb ibn Yassaf ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "90": {
    "id": 90,
    "fascicle": "87–90",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/522",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 76,
        "printedPage": 75,
        "title": "Identification de la notice 90",
        "note": "Le fascicule 87–90 contient la notice relative à « 'Ouaym ibn Saïda ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "91": {
    "id": 91,
    "fascicle": "91",
    "tome": 1,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/1/524",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 91",
        "note": "Le fascicule 91 contient la notice relative à « Salmane Al-Farissi ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 5,
        "pdfPage": 119,
        "printedPage": 118,
        "title": "Décès de Salmane : années divergentes",
        "note": "Al-Waqidi situe sa mort sous Outhman ; d'autres donnent 33, 36 ou 37 H, la dernière date étant rejetée par Dhahabî comme postérieure à Jamal et Siffine.",
        "status": "variant"
      },
      {
        "kind": "identity",
        "id": 1,
        "pdfPage": 121,
        "printedPage": 120,
        "title": "250 ans : hypothèse rejetée par Dhahabî",
        "note": "Dhahabî indique qu'il ne considère plus authentique son ancienne estimation de 250 ans et penche plutôt pour environ 70 ans, sans prétendre disposer d'une datation certaine.",
        "status": "qualification"
      }
    ]
  },
  "92": {
    "id": 92,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/1",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 2,
        "printedPage": 1,
        "title": "Identification de la notice 92",
        "note": "Le fascicule 92–100 contient la notice relative à « 'Oubada ibn As-Samit ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "93": {
    "id": 93,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/6",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 11,
        "printedPage": 10,
        "title": "Identification de la notice 93",
        "note": "Le fascicule 92–100 contient la notice relative à « Abd-Allah ibn Houdhafa ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "narrative",
        "id": 931,
        "pdfPage": 15,
        "printedPage": 14,
        "title": "Le baiser à l’empereur : tradition à variantes",
        "note": "Le récit du roi byzantin et des prisonniers est rapporté avec des versions différentes sur le nombre de captifs libérés (80, 100 ou 300).",
        "status": "variant"
      },
      {
        "kind": "narrative",
        "id": 932,
        "pdfPage": 14,
        "printedPage": 13,
        "title": "Ordre de se jeter au feu : transmission abrégée",
        "note": "Le récit de la plaisanterie de feu est rapporté par une voie dont la version alternative citée est interrompue.",
        "status": "qualification"
      }
    ]
  },
  "94": {
    "id": 94,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/12",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 20,
        "printedPage": 19,
        "title": "Identification de la notice 94",
        "note": "Le fascicule 92–100 contient la notice relative à « Abou Rafi' ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "95": {
    "id": 95,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/13",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 23,
        "printedPage": 22,
        "title": "Identification de la notice 95",
        "note": "Le fascicule 92–100 contient la notice relative à « Souhayb Ar-Roumi ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "96": {
    "id": 96,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/23",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 40,
        "printedPage": 39,
        "title": "Identification de la notice 96",
        "note": "Le fascicule 92–100 contient la notice relative à « Abou Talha Al-Ansari ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      },
      {
        "kind": "timeline",
        "id": 0,
        "pdfPage": 40,
        "printedPage": 39,
        "title": "Douze apôtres : divergences dans le livre",
        "note": "La note du traducteur précise qu'Abou Talha n'apparaît pas parmi les douze de la notice 58, bien que sa présence à la seconde Aqaba ne fasse pas débat.",
        "status": "qualification"
      },
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": 42,
        "printedPage": 41,
        "title": "Jeûne quarante années : chronologie contestée",
        "note": "Un récit lui attribue 40 ans de jeûne après le décès du Prophète ; Dhahabî le contredit ici en indiquant qu'il n'aurait vécu qu'une vingtaine d'années après lui.",
        "status": "variant"
      }
    ]
  },
  "97": {
    "id": 97,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/31",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 53,
        "printedPage": 52,
        "title": "Identification de la notice 97",
        "note": "Le fascicule 92–100 contient la notice relative à « Abou Bourda ibn Niyar ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "98": {
    "id": 98,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/32",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 54,
        "printedPage": 53,
        "title": "Identification de la notice 98",
        "note": "Le fascicule 92–100 contient la notice relative à « Jabr ibn 'Atik ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "99": {
    "id": 99,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/33",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 57,
        "printedPage": 56,
        "title": "Identification de la notice 99",
        "note": "Le fascicule 92–100 contient la notice relative à « Al-Ache'ath ibn Qays ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  },
  "100": {
    "id": 100,
    "fascicle": "92–100",
    "tome": 2,
    "author": "Shams ad-Dîn adh-Dhahabî",
    "work": "Siyar A‘lam an-Nubalâ’",
    "translation": "Les Grandes Figures de l’Islam — traduction française diffusée par Islam Patrimoine",
    "publisherUrl": "https://islam-patrimoine.org/",
    "editionNote": "La page PDF citée correspond au fascicule transmis. Sa page imprimée = page PDF − 1 ; la pagination de Siyar.fr et le numéro de tome sont distincts.",
    "reviewScope": "Repérage documentaire uniquement : il ne certifie ni l’intégralité des biographies, ni l’authenticité des chaînes de transmission.",
    "readUrl": "https://siyar.fr/livre/2/40",
    "entries": [
      {
        "kind": "identity",
        "id": 0,
        "pdfPage": 68,
        "printedPage": 67,
        "title": "Identification de la notice 100",
        "note": "Le fascicule 92–100 contient la notice relative à « Hatib ibn Abou Baltaa ». Cette correspondance de nom et de numéro n'est pas une certification des récits, des chronologies ou des hadiths de la fiche Athar.",
        "status": "located"
      }
    ]
  }
};
