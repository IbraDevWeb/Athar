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
        "title": "Litige de Sa‘îd : récit présent chez Mouslim",
        "note": "Le récit du litige foncier et de l'invocation de Sa‘îd est transmis dans Sahîh Mouslim 1610c ; il convient de le citer comme récit et non comme une simple accusation établie contre l'autre partie.",
        "status": "located",
        "hadithRef": "Mouslim 1610c",
        "externalUrl": "https://sunnah.com/muslim:1610c",
        "isnad": "Hishâm ibn ‘Urwa → son père ‘Urwa → récit du litige entre Arwa et Sa‘îd."
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
      },
      {
        "kind": "hadith",
        "id": 1,
        "hadithRef": "Abou Ya‘lâ 973 ; Ahmad 1648 (autre voie)",
        "externalUrl": "https://dorar.net/h/JKxKOrRq/osoul",
        "isnad": "Voie rapportée par Saïd ibn Zayd : ‘Abd ar-Rahmân ibn Abî az-Zinâd → Hishâm ibn ‘Urwa → ‘Urwa → Saïd ibn Zayd ; autres voies distinctes.",
        "grade": "disputed",
        "status": "variant",
        "title": "Zayd ibn ‘Amr : plusieurs appréciations selon les voies",
        "note": "Al-Haythamî (Majma‘ az-Zawâ’id 9/420) : isnâd hasan pour la voie rapportée par Saïd ; Shu‘ayb al-Arna’ût (Tahqîq Musnad Ahmad 1648) : isnâd faible pour une autre voie. Ne pas confondre ces deux chaînes.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation en tête de notice",
        "pdfPage": null,
        "printedPage": null,
        "hadithRef": "Abou Ya‘lâ 973 ; Al-Haythamî 9/420",
        "externalUrl": "https://dorar.net/h/JKxKOrRq/osoul",
        "isnad": "Transmission et attribution précisées dans la référence externe.",
        "note": "Parole prophétique rapportée par Sa‘îd selon Abou Ya‘lâ. Al-Haythamî qualifie cette chaîne de hasan ; Shu‘ayb al-Arna’ût juge faible une autre voie rapportée par Ahmad 1648.",
        "status": "variant",
        "grade": "hasan"
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
        "title": "Abderrahmân pleure devant son repas",
        "note": "Le témoignage est cité dans Riyâd as-Sâlihîn 454 avec attribution à Al-Bukhârî ; parole de compagnon, non citation prophétique.",
        "status": "located",
        "hadithRef": "Al-Bukhârî, récit d'Abderrahmân (via Riyâd as-Sâlihîn 454)",
        "externalUrl": "https://sunnah.com/riyadussalihin:454"
      },
      {
        "kind": "hadith",
        "id": 0,
        "hadithRef": "Ibn Sa‘d, at-Tabaqât al-Kubrâ, récit 2886",
        "externalUrl": "https://hadithportal.com/takhreej/64883",
        "isnad": "Ibn Sa‘d : Muhammad ibn ‘Umar → Ibrâhîm ibn Muhammad al-‘Abdarî → son père. Attribution au Prophète dans la narration biographique.",
        "grade": "ungraded",
        "status": "qualification",
        "title": "Description de Mouss’ab à La Mecque",
        "note": "La formule figure dans le récit biographique reproduit d’Ibn Sa‘d ; référence « Tirmidhî » supprimée, car non localisée pour cette formulation. Aucun jugement de savant sur cette voie n’est assigné ici.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "verse",
        "id": 1,
        "title": "Verset du Coran 33:23",
        "externalUrl": "https://quran.com/33/23",
        "status": "qualification",
        "note": "La formulation est un verset, pas un hadith. Sa portée générale est coranique ; l’appliquer spécifiquement à Mouss’ab est une attribution exégétique qui nécessite une source distincte.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation en tête de notice",
        "pdfPage": null,
        "printedPage": null,
        "hadithRef": "At-Tirmidhî 2476",
        "externalUrl": "https://sunnah.com/tirmidhi:2476",
        "isnad": "Transmission et attribution précisées dans la référence externe.",
        "note": "At-Tirmidhî : hasan gharîb ; Al-Albânî dans Da‘îf at-Tirmidhî 2476 : faible. Al-Mundhirî signale un rapporteur non nommé entre Muhammad ibn Ka‘b et ‘Alî.",
        "status": "variant",
        "grade": "disputed"
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
        "title": "Paroles bienveillantes près du défunt",
        "note": "Oum Salama rapporte dans Mouslim 920a la recommandation de ne dire que du bien et l'invocation en faveur d'Abou Salama.",
        "status": "located",
        "hadithRef": "Mouslim 920a",
        "externalUrl": "https://sunnah.com/muslim:920a"
      },
      {
        "kind": "narrative",
        "id": 803,
        "pdfPage": 17,
        "printedPage": 16,
        "title": "Invocation lors de l'épreuve",
        "note": "La formule et son application par Oum Salama après la mort d'Abou Salama figurent dans Sahîh Mouslim 918a–b.",
        "status": "located",
        "hadithRef": "Mouslim 918a–b",
        "externalUrl": "https://sunnah.com/muslim:918a"
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
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation en tête de notice",
        "pdfPage": null,
        "printedPage": null,
        "hadithRef": "Mouslim 920a",
        "externalUrl": "https://sunnah.com/muslim:920a",
        "isnad": "Transmission et attribution précisées dans la référence externe.",
        "note": "Formule extraite de l'invocation du Prophète pour Abou Salama, rapportée par Oum Salama dans Sahîh Mouslim 920a.",
        "status": "located",
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
        "note": "Selon Sa‘d ibn Abî Waqqâs, le Prophète refusa à ‘Outhman ibn Mazh‘oune le célibat ascétique ; le propos sur la castration est une hypothèse formulée par Sa‘d.",
        "status": "located",
        "hadithRef": "Al-Bukhârî 5073 ; Mouslim 1402b",
        "externalUrl": "https://sunnah.com/bukhari:5073"
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
        "title": "Oum Al-‘Alâ : prudence sur le sort d’un défunt",
        "note": "Le témoignage d’Oum Al-‘Alâ figure dans Sahîh al-Bukhârî 1243, avec la réponse du Prophète et sa réserve sur la certitude du sort individuel.",
        "status": "located",
        "hadithRef": "Al-Bukhârî 1243",
        "externalUrl": "https://sunnah.com/bukhari:1243"
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
      },
      {
        "kind": "hadith",
        "id": 1,
        "hadithRef": "Ahmad 2127 ; Ibn Sa‘d 3/398 ; al-Hâkim 4869",
        "externalUrl": "https://dorar.net/h/sS5iuU9W/osoul",
        "isnad": "Hammâd ibn Salama → ‘Alî ibn Zayd → Yûsuf ibn Mihrân → Ibn ‘Abbâs (version Ahmad 2127).",
        "grade": "disputed",
        "status": "variant",
        "title": "Parole aux funérailles de la fille du Prophète",
        "note": "Shu‘ayb al-Arna’ût (Takhrîj Siyar 1/160) : isnâd faible ; Ahmad Shâkir (Takhrîj Musnad 5/41) : isnâd sahîh selon sa propre évaluation. Les transmissions mentionnent Zaynab ou Rouqayya selon les versions.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation en tête de notice",
        "pdfPage": null,
        "printedPage": null,
        "hadithRef": "Al-Bukhârî 5073",
        "externalUrl": "https://sunnah.com/bukhari:5073",
        "isnad": "Transmission et attribution précisées dans la référence externe.",
        "note": "Parole de Sa‘d sur le refus du tabattul (renoncement conjugal), dans Al-Bukhârî 5073 ; à distinguer de toute assertion que ‘Outhman demanda personnellement la castration.",
        "status": "located",
        "grade": "sahih"
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
        "title": "Qoudama : récit du verset 5:93 et avis recensé",
        "note": "Dorar rapporte le récit d’Ibn ‘Abbâs et cite le jugement « fîhi nazar » d’Ibn Taymiyya (Minhâj as-Sunna 6/84) sur cette transmission ; le contenu est conservé avec cette réserve attribuée.",
        "status": "qualification",
        "hadithRef": "An-Nasâ’î, al-Kubrâ 5270 ; Ibn Taymiyya, Minhâj as-Sunna 6/84",
        "externalUrl": "https://dorar.net/h/x4HMmzcz"
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation en tête de notice",
        "pdfPage": null,
        "printedPage": null,
        "hadithRef": "Coran 5:93 ; récit historique Siyar",
        "externalUrl": "https://quran.com/5/93",
        "isnad": "Sans objet : verset coranique.",
        "note": "Citation coranique ; le renvoi biographique concerne l'interprétation attribuée à Qoudama. Ibn Taymiyya (Minhâj as-Sunna 6/84) indique « fîhi nazar » pour une voie du récit selon Darar.",
        "status": "qualification",
        "grade": "not_applicable"
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
        "title": "Doublon documentaire : notices Athar 11 et 45",
        "note": "Oubayda ibn Al-Hârith est la même personne dans les notices Athar 11 et 45. La référence Siyar française classe Oubayda à son chapitre n° 45 (et non 11). Les deux notices ne sont pas deux individus distincts.",
        "status": "qualification"
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation principale : Les six combattants de Badr",
        "externalUrl": "https://sunnah.com/bukhari:3965",
        "hadithRef": "Al-Bukhârî 3965 ; Mouslim 3033",
        "grade": "sahih",
        "status": "located",
        "note": "Al-Bukhârî 3965 transmet le récit de Qays ibn ‘Ubâd et de ‘Alî sur l'application du verset 22:19 aux six combattants de Badr ; il ne contient pas la phrase antérieure « Ne suis-je pas un martyr ? ».",
        "isnad": "Attribution consignée dans la source indiquée ; aucune analyse indépendante de chaîne par Athar.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 0,
        "title": "La première bannière : attribution selon Ibn Ishâq",
        "externalUrl": "https://g1.islamweb.net/ar/library/content/58/682/",
        "hadithRef": "Ibn Hishâm, récit d'Ibn Ishâq",
        "status": "variant",
        "note": "Ibn Ishâq attribue à Oubayda une des premières bannières, indiquant « selon ce qui m'est parvenu » ; d'autres sources attribuent cette primauté à Abd-Allah ibn Jahsh. N'imposons pas un vainqueur unique dans les variantes.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 1,
        "title": "Badr et les variantes sur l'adversaire d'Oubayda",
        "externalUrl": "https://sunnah.com/abudawud:2665",
        "hadithRef": "Abou Dâwoud 2665 ; Ibn Ishâq",
        "status": "variant",
        "note": "Abou Dâwoud 2665 (sahîh selon Al-Albânî) place Oubayda face à al-Walîd ; Ibn Ishâq dans Al-Bidâya wa-n-Nihâya donne ‘Outba. L'année 2 H est la date de Badr, pas une validation de tous les détails annexes.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1101,
        "title": "Le duel de Badr : témoignage de ‘Alî",
        "externalUrl": "https://sunnah.com/abudawud:2665",
        "hadithRef": "Abou Dâwoud 2665",
        "status": "variant",
        "note": "La version de ‘Alî citée chez Abou Dâwoud nomme Hamza, ‘Alî et Oubayda et mentionne qu'Oubayda affronta al-Walîd, contrairement à certaines narrations d'Ibn Ishâq qui nomment ‘Outba. Grade : sahîh selon Al-Albânî.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1102,
        "title": "Le verset 22:19 et les six duellistes",
        "externalUrl": "https://sunnah.com/muslim:3033",
        "hadithRef": "Mouslim 3033",
        "status": "located",
        "note": "Mouslim 3033 rapporte l'attribution par Abou Dharr du verset 22:19 aux six duellistes de Badr ; ce n'est pas une citation prophétique formulée dans la notice.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "hadith",
        "id": 0,
        "title": "Ordre de duel adressé à Hamza, ‘Alî et Oubayda",
        "externalUrl": "https://sunnah.com/abudawud:2665",
        "hadithRef": "Abou Dâwoud 2665 — sahîh selon Al-Albânî",
        "grade": "sahih",
        "status": "located",
        "note": "La source rapporte l'ordre du Prophète et les duels ; Al-Albânî indique sahîh pour la version de Sunan Abî Dâwoud 2665.",
        "isnad": "Hârûn ibn ‘Abd Allah → ‘Outhmân ibn ‘Oumar → Isrâ’îl → Abou Ishâq → Hâritha ibn Mudarrib → ‘Alî ibn Abî Tâlib.",
        "pdfPage": null,
        "printedPage": null
      }
    ]
  },
  "12": {
    "id": 12,
    "fascicle": "sources externes",
    "author": "Ibn Ishâq, Ibn Hishâm, Al-Haythamî et autres auteurs",
    "work": "Dossiers et récits relatifs à Abd-Allah ibn Jahsh",
    "translation": "Références arabes accessibles sur Ad-Durar as-Saniyya et Islamweb",
    "publisherUrl": "https://dorar.net/history/event/54",
    "publisherLabel": "Répertoire historique Dorar",
    "readUrl": "https://dorar.net/history/event/54",
    "readLabel": "Consulter le dossier sur Dorar",
    "editionNote": "La fiche Athar n° 12 ne correspond pas au chapitre n° 12 du fascicule français 07–14. Aucun numéro de page Siyar n'est attribué à cette personne dans ce registre.",
    "reviewScope": "Recoupement auprès de recueils et chroniques ; le repérage ne certifie aucune authenticité par une analyse autonome de chaîne.",
    "entries": [
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation principale : Invocation d'Ouhoud",
        "externalUrl": "https://dorar.net/h/WyJwUUz5",
        "hadithRef": "Al-Haythamî, Majma‘ az-Zawâ’id 9/304",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Al-Haythamî, Majma‘ az-Zawâ’id 9/304, écrit « rijâluhu rijâl as-sahîh » (ses rapporteurs sont ceux du Sahîh). Cela ne doit pas être automatiquement paraphrasé « hadith authentifié ». Il s'agit ici de la parole de ‘Abd-Allah rapportée par Sa‘d.",
        "isnad": "Attribution consignée dans la source indiquée ; aucune analyse indépendante de chaîne par Athar.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1201,
        "title": "L'invocation d'Abd-Allah à Ouhoud",
        "externalUrl": "https://dorar.net/h/WyJwUUz5",
        "hadithRef": "At-Tabarânî ; Al-Haythamî 9/304",
        "status": "qualification",
        "note": "Dorar donne le récit de Sa‘d ibn Abî Waqqâs ; Al-Haythamî (Majma‘ az-Zawâ’id 9/304) mentionne « rapporteurs du Sahîh », sans qu'Athar transforme la formule en degré d'authenticité inventé.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1202,
        "title": "Enterrement avec Hamza, témoignage familial",
        "externalUrl": "https://www.islamweb.com/ar/library/content/58/977/",
        "hadithRef": "Ibn Hishâm, Sîra : récit attribué à la famille",
        "status": "qualification",
        "note": "Ibn Ishâq, cité par Ibn Hishâm, précise que l'information sur l'inhumation d'Abd-Allah avec Hamza provient de sa famille et qu'il ne l'avait pas entendue d'autres personnes.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1203,
        "title": "Nakhla, le mois sacré et la chronologie",
        "externalUrl": "https://dorar.net/history/event/54",
        "hadithRef": "Dorar — Encyclopédie historique ; Ibn Sa‘d",
        "status": "located",
        "note": "Dorar date l'expédition de Rajab 2 H ; le compte rendu de sîra rapporte le contexte du verset 2:217 et des variantes dans le nombre de participants.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 0,
        "title": "Expédition de Nakhla, Rajab 2 H",
        "externalUrl": "https://dorar.net/history/event/54",
        "hadithRef": "Ad-Durar as-Saniyya, chronologie 2 H",
        "status": "located",
        "note": "Dorar date l'expédition de Rajab 2 H et décrit les événements ; ce repère situe l'expédition, sans certifier toutes les traditions associées.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 1,
        "title": "Mort à Ouhoud",
        "externalUrl": "https://dorar.net/h/WyJwUUz5",
        "hadithRef": "Al-Haythamî, Majma‘ az-Zawâ’id 9/304",
        "status": "located",
        "note": "Le récit de Sa‘d place son témoignage à Ouhoud ; l'année 3 H doit être documentée dans les chroniques de la bataille.",
        "pdfPage": null,
        "printedPage": null
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
        "pdfPage": null,
        "printedPage": null,
        "title": "Abou Houdhayfa et l'appel au duel",
        "note": "Le récit est attribué à Abou az-Zinâd dans Al-Moustadrak 5039. Il ne contient pas de commandement du Prophète à Abou Houdhayfa de s'asseoir ; aucune évaluation indépendante d'isnâd n'est avancée.",
        "status": "qualification",
        "externalUrl": "https://www.islamweb.net/ar/library/content/74/4861/",
        "hadithRef": "Al-Hâkim 5039"
      },
      {
        "kind": "narrative",
        "id": 1302,
        "pdfPage": 42,
        "printedPage": 41,
        "title": "Dépouilles rapprochées",
        "note": "La proximité des corps d'Abou Houdhayfa et de Salim est rapportée dans le passage consacré à Salim.",
        "status": "located"
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation principale : Défi adressé à ‘Outba",
        "externalUrl": "https://www.islamweb.net/ar/library/content/74/4861/",
        "hadithRef": "Al-Hâkim, Al-Moustadrak 5039",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Al-Hâkim 5039 transmet d'après ‘Abd ar-Rahmân ibn Abî az-Zinâd, d'après son père, qu'Abou Houdhayfa appela son père en duel ; aucun degré n'est attribué à cette chaîne dans la fiche.",
        "isnad": "Attribution consignée dans la source indiquée ; aucune analyse indépendante de chaîne par Athar.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1303,
        "title": "L'espoir de conversion du père d'Abou Houdhayfa",
        "externalUrl": "https://gcp.islamweb.net/ar/library/content/59/266/",
        "hadithRef": "Ibn Kathîr, Al-Bidâya wa-n-Nihâya",
        "status": "qualification",
        "note": "Ibn Kathîr transmet d'après Ibn Ishâq un récit où Abou Houdhayfa exprime sa tristesse d'avoir espéré que son père embrasse l'islam. Cette transmission de sîra reste présentée comme attribuée à Ibn Ishâq.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 1,
        "title": "L'appel au duel lors de Badr",
        "externalUrl": "https://www.islamweb.net/ar/library/content/74/4861/",
        "hadithRef": "Al-Moustadrak 5039",
        "status": "qualification",
        "note": "Al-Hâkim rapporte l'appel au duel d'Abou Houdhayfa ; le récit cité ne précise pas d'intervention prophétique l'empêchant de combattre.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 0,
        "pdfPage": null,
        "printedPage": null,
        "title": "Conversion précoce et migration vers l'Abyssinie",
        "note": "La notice biographique situe la conversion et la migration d'Abou Houdhayfa, mais « Mecque » n'est pas une année et aucune datation précise n'est imposée par Athar.",
        "hadithRef": "",
        "externalUrl": "https://siyar.fr/livre/1/167",
        "status": "qualification"
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
        "pdfPage": null,
        "printedPage": null,
        "title": "Allaitement de l'adulte : cas de Sâlim",
        "note": "Mouslim 1453a–b rapporte l'épisode ; Mouslim 1454 préserve la position des autres épouses du Prophète qui y voyaient une permission propre à Sâlim. Le registre décrit les positions, sans formuler une fatwa générale.",
        "status": "qualification",
        "externalUrl": "https://sunnah.com/muslim:1454",
        "hadithRef": "Mouslim 1453a–b et 1454"
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
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation principale : Quatre maîtres de récitation du Coran",
        "externalUrl": "https://sunnah.com/bukhari:3758",
        "hadithRef": "Al-Bukhârî 3758",
        "grade": "sahih",
        "status": "located",
        "note": "Al-Bukhârî 3758 cite Sâlim parmi quatre personnes auprès de qui apprendre la récitation du Coran. ‘Abd Allah ibn ‘Amr est le transmetteur du hadith dans ce recueil.",
        "isnad": "Attribution consignée dans la source indiquée ; aucune analyse indépendante de chaîne par Athar.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 0,
        "title": "Sâlim imam à Qoubâ",
        "externalUrl": "https://sunnah.com/bukhari:692",
        "hadithRef": "Al-Bukhârî 692",
        "status": "located",
        "note": "Ibn ‘Oumar rapporte chez Al-Bukhârî 692 que Sâlim dirigeait la prière des premiers émigrés car il connaissait davantage le Coran.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1404,
        "title": "Le choix de Sâlim comme imam",
        "externalUrl": "https://sunnah.com/bukhari:692",
        "hadithRef": "Al-Bukhârî 692",
        "status": "located",
        "note": "Ibn ‘Oumar rapporte qu'avant l'arrivée du Prophète à Médine, Sâlim dirigeait les premiers émigrés parce qu'il connaissait davantage de Coran.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "narrative",
        "id": 1405,
        "title": "Sahla et Sâlim : textes et interprétation",
        "externalUrl": "https://sunnah.com/muslim:1454",
        "hadithRef": "Mouslim 1453a–b ; 1454",
        "status": "variant",
        "note": "Mouslim 1453a–b rapporte l'épisode de Sahla ; Mouslim 1454 rapporte que les autres épouses le considéraient comme une permission particulière à Sâlim et non un principe général.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "hadith",
        "id": 0,
        "title": "Apprendre la récitation du Coran auprès de quatre personnes",
        "externalUrl": "https://sunnah.com/bukhari:3758",
        "hadithRef": "Al-Bukhârî 3758",
        "grade": "sahih",
        "status": "located",
        "note": "Al-Bukhârî 3758 nomme Ibn Mas‘oud, Sâlim, Oubay ibn Ka‘b et Mou‘âdh ibn Jabal.",
        "isnad": "Soulaymân ibn Harb → Shu‘ba → ‘Amr ibn Mourra → Ibrâhîm → Masrûq → ‘Abd Allah ibn ‘Amr.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "hadith",
        "id": 1,
        "title": "Éloge de la récitation de Sâlim",
        "externalUrl": "https://sunnah.com/ibnmajah:1338",
        "hadithRef": "Ibn Mâjah 1338 — sahîh selon Darussalam/Al-Albânî ; hasan selon Ibn Hajar",
        "grade": "sahih",
        "status": "located",
        "note": "Ibn Mâjah 1338 est classé sahîh dans l'évaluation Darussalam et selon Al-Albânî (Sahîh Ibn Mâjah 1108) ; Ibn Hajar le juge hasan (Natâ’ij al-Afkâr 3/224).",
        "isnad": "Al-‘Abbâs ibn ‘Outhmân → al-Walîd ibn Mouslim → Hanzala ibn Abî Soufyân → ‘Abd ar-Rahmân ibn Sâbit → ‘Â’isha.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": null,
        "printedPage": null,
        "title": "Mort de Sâlim à Al-Yamâma",
        "note": "Le récit d'Al-Wâqidî repris dans Siyar situe la mort à Al-Yamâma ; le détail du trou où se seraient fixés ses pieds n'est pas transformé en hadith sahîh.",
        "hadithRef": "",
        "externalUrl": "https://siyar.fr/livre/1/169",
        "status": "qualification"
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
        "pdfPage": null,
        "printedPage": null,
        "title": "Wahchî relate la mort de Hamza et l'épisode de Moussaylima",
        "note": "Al-Bukhârî 4072 transmet directement le récit de Wahchî : mort de Hamza à Ouhoud et participation revendiquée au combat contre Moussaylima.",
        "status": "located",
        "externalUrl": "https://sunnah.com/bukhari:4072",
        "hadithRef": "Al-Bukhârî 4072"
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
        "pdfPage": null,
        "printedPage": null,
        "title": "Wahchî après sa conversion et Moussaylima",
        "note": "La narration d'Al-Bukhârî 4072 indique le souhait de Wahchî de compenser son acte précédent et mentionne l'intervention d'un combattant ansâri contre Moussaylima.",
        "status": "located",
        "externalUrl": "https://sunnah.com/bukhari:4072",
        "hadithRef": "Al-Bukhârî 4072"
      },
      {
        "kind": "quote",
        "id": 0,
        "title": "Citation principale : Wahchî témoigne sur la mort de Hamza",
        "externalUrl": "https://sunnah.com/bukhari:4072",
        "hadithRef": "Al-Bukhârî 4072",
        "grade": "sahih",
        "status": "located",
        "note": "Al-Bukhârî 4072 transmet le récit de Wahchî relatant le coup de javeline contre Hamza à Ouhoud. Il s'agit d'un témoignage de Wahchî, non d'une parole du Prophète.",
        "isnad": "Attribution consignée dans la source indiquée ; aucune analyse indépendante de chaîne par Athar.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "hadith",
        "id": 0,
        "title": "Titre de maître des martyrs : chaîne faible signalée",
        "externalUrl": "https://dorar.net/h/cK6Ib1Lk?osoul=1",
        "hadithRef": "Al-Hâkim 4884 ; adh-Dhahabî, Siyar 1/173",
        "grade": "weak_chain",
        "status": "qualification",
        "note": "Adh-Dhahabî qualifie d'« isnâd faible » la voie de Jâbir dans Siyar A‘lâm an-Nubalâ’ 1/173. Le titre ne doit pas être présenté comme unanimement sahîh.",
        "isnad": "Version attribuée à Jâbir chez Al-Hâkim ; le jugement d'adh-Dhahabî porte sur cette chaîne, non toutes les voies.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "hadith",
        "id": 1,
        "title": "Âmes des martyrs dans les oiseaux verts",
        "externalUrl": "https://sunnah.com/muslim:1887",
        "hadithRef": "Mouslim 1887",
        "grade": "sahih",
        "status": "located",
        "note": "Mouslim 1887 rapporte le hadith d'Ibn Mas‘oud à propos des martyrs en général ; il ne nomme pas Hamza dans cette formulation.",
        "isnad": "Masrûq → ‘Abd Allah ibn Mas‘oud → le Prophète ﷺ.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "hadith",
        "id": 2,
        "title": "« Mais Hamza n'a personne pour le pleurer »",
        "externalUrl": "https://dorar.net/h/aAGK8Qtz",
        "hadithRef": "Ahmad 5666 ; Ibn Mâjah 1591 — hasan selon Shu‘ayb al-Arna’ût",
        "grade": "hasan",
        "status": "qualification",
        "note": "Shu‘ayb al-Arna’ût juge hasan l'isnâd d'Ahmad 5666 ; ce récit est aussi repris chez Ibn Mâjah 1591. Le jugement est explicitement attribué à Al-Arna’ût.",
        "isnad": "‘Abd Allah ibn ‘Oumar → Nâfi‘ → Ousâma ibn Zayd → narrations d'Ahmad.",
        "pdfPage": null,
        "printedPage": null
      },
      {
        "kind": "timeline",
        "id": 0,
        "pdfPage": null,
        "printedPage": null,
        "title": "Conversion de Hamza à La Mecque",
        "note": "La notice de Siyar évoque la conversion à La Mecque. Le libellé ne livre pas de date précise et n'atteste pas à lui seul l'ensemble des détails de protection qui lui sont associés.",
        "hadithRef": "",
        "externalUrl": "https://siyar.fr/livre/1/175",
        "status": "qualification"
      },
      {
        "kind": "timeline",
        "id": 1,
        "pdfPage": null,
        "printedPage": null,
        "title": "Hamza au duel de Badr",
        "note": "Abou Dâwoud 2665 cite Hamza parmi les duellistes de Badr. Al-Albânî juge cette voie sahîh ; la confrontation exacte des trois paires peut varier selon les traditions.",
        "hadithRef": "Abou Dâwoud 2665 — sahîh selon Al-Albânî",
        "externalUrl": "https://sunnah.com/abudawud:2665",
        "status": "variant"
      },
      {
        "kind": "timeline",
        "id": 2,
        "pdfPage": null,
        "printedPage": null,
        "title": "Mort de Hamza au combat d'Ouhoud",
        "note": "Le récit de Wahchî transmis par Al-Bukhârî 4072 décrit le coup de javeline qui provoqua la mort de Hamza à Ouhoud.",
        "hadithRef": "Al-Bukhârî 4072",
        "externalUrl": "https://sunnah.com/bukhari:4072",
        "status": "located"
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
    "reviewScope": "Repères et variantes vérifiés dans les sources identifiées ; ce repérage documentaire ne certifie pas l'authenticité des chaînes de transmission ni toutes les dates des chroniques.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Changement de nom Ghâfil → ‘Aqil",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 16",
        "isnad": "Attribution bibliographique, sans authentification indépendante par Athar.",
        "grade": "ungraded",
        "externalUrl": "https://siyar.fr/livre/1/186",
        "note": "Ibn Sa‘d, reproduit par adh-Dhahabî, rapporte le changement de nom. Il s'agit d'une attribution biographique ; aucun jugement de chaîne n'est reproduit dans la notice."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Conversion des quatre frères à Dâr al-Arqam",
        "externalUrl": "https://siyar.fr/livre/1/186",
        "hadithRef": "Siyar / source citée (notice 16)",
        "note": "Ibn Sa‘d transmet via Muhammad ibn ‘Umar → Muhammad ibn Sâlih → Yazîd ibn Roumân l'histoire de la conversion commune. Cette voie n'est pas classée ici."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Départ familial vers Médine",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Siyar / source citée (notice 16)",
        "note": "Récit transmis chez Ibn Sa‘d via Muhammad ibn ‘Umar → ‘Abd al-Jabbâr ibn ‘Umâra → ‘Abd Allah ibn Abî Bakr ; les maisons restèrent fermées. Aucune date précise n'est assignée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 2,
        "title": "Les quatre frères à Badr",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Siyar / source citée (notice 16)",
        "note": "Adh-Dhahabî souligne la participation des quatre frères à Badr, selon les récits d'Ibn Sa‘d et de sîra."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 3,
        "title": "Mort de ‘Aqil à Badr",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Siyar / source citée (notice 16)",
        "note": "La notice rapporte l'âge de 34 ans et nomme Mâlik ibn Zouhayr comme son meurtrier ; données biographiques, sans jugement d'isnâd ajouté."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 161,
        "title": "Nom antérieur et renommage",
        "externalUrl": "https://siyar.fr/livre/1/186",
        "hadithRef": "Adh-Dhahabî / Ibn Sa‘d — source indiquée",
        "note": "Ibn Sa‘d affirme que son nom était Ghâfil et que le Prophète le renomma ‘Aqil. C'est un récit biographique rapporté, pas une preuve autonome du propos prophétique."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 162,
        "title": "Émigration collective",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Adh-Dhahabî / Ibn Sa‘d — source indiquée",
        "note": "Adh-Dhahabî reproduit la transmission d'Ibn Sa‘d sur l'émigration des hommes et des femmes de la famille et les maisons demeurées fermées."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Deux versions de la fraternité",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Ibn Sa‘d, At-Tabaqât ; repris dans Siyar",
        "isnad": "Transmission biographique ou commentaire attribué à l'auteur cité ; l'isnâd complet n'est pas établi dans la fiche.",
        "grade": "ungraded",
        "note": "Adh-Dhahabî donne Moubashir ibn ‘Abd al-Moundhir, puis la variante Moujadhar ibn Ziyâd. Ce sont des attributions historiques, non un hadith authentifié dans cette notice.",
        "category": "historical"
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 1,
        "title": "Conversion des quatre frères",
        "externalUrl": "https://siyar.fr/livre/1/186",
        "hadithRef": "Ibn Sa‘d, At-Tabaqât ; repris dans Siyar",
        "isnad": "Transmission biographique ou commentaire attribué à l'auteur cité ; l'isnâd complet n'est pas établi dans la fiche.",
        "grade": "ungraded",
        "note": "Le texte d'Ibn Sa‘d, transmis d'après Yazîd ibn Roumân, rapporte leur conversion commune ; le jugement des spécialistes sur cette chaîne n'est pas identifié ici.",
        "category": "historical"
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
    "reviewScope": "Repères et variantes vérifiés dans les sources identifiées ; ce repérage documentaire ne certifie pas l'authenticité des chaînes de transmission ni toutes les dates des chroniques.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Badr, Ouhoud, puis Ar-Rajî‘",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 17",
        "isnad": "Attribution bibliographique, sans authentification indépendante par Athar.",
        "grade": "ungraded",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "note": "La notice attribue à Ibn Sa‘d ces trois repères, dont Safar 4 H et l'âge de 34 ans ; déclaration historique, sans classification indépendante."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 0,
        "title": "Participation à Badr",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Siyar / source citée (notice 17)",
        "note": "Ibn Sa‘d cité par adh-Dhahabî rapporte sa présence à Badr."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 1,
        "title": "Participation à Ouhoud",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Siyar / source citée (notice 17)",
        "note": "Ibn Sa‘d cité par adh-Dhahabî rapporte sa présence à Ouhoud."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 2,
        "title": "Mort à Ar-Rajî‘ en Safar 4 H",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Siyar / source citée (notice 17)",
        "note": "La notice place sa mort à Ar-Rajî‘ en Safar 4 H, à 34 ans. Aucun classement des voies détaillées n'est donné dans ce passage."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 171,
        "title": "Fraternité avec Zayd ibn ad-Dathina",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Adh-Dhahabî / Ibn Sa‘d — source indiquée",
        "note": "L'attribution de la fraternité est rapportée d'Ibn Sa‘d par adh-Dhahabî. Le destin des deux personnages ne doit pas être amalgamé."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Fraternité avec Zayd ibn ad-Dathina",
        "externalUrl": "https://siyar.fr/livre/1/187",
        "hadithRef": "Ibn Sa‘d, At-Tabaqât ; repris dans Siyar",
        "isnad": "Transmission biographique ou commentaire attribué à l'auteur cité ; l'isnâd complet n'est pas établi dans la fiche.",
        "grade": "ungraded",
        "note": "Récit d'Ibn Sa‘d conservé par adh-Dhahabî ; chaîne complète et avis d'authenticité non indiqués dans la source consultée.",
        "category": "historical"
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
    "reviewScope": "Repères et variantes vérifiés dans les sources identifiées ; ce repérage documentaire ne certifie pas l'authenticité des chaînes de transmission ni toutes les dates des chroniques.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Campagnes et Égypte",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 18",
        "isnad": "Attribution bibliographique, sans authentification indépendante par Athar.",
        "grade": "ungraded",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "note": "Adh-Dhahabî transmet d'après Ibn Sa‘d la participation à Badr, aux autres campagnes et à la conquête de l'Égypte ; attribution historique sans degré de hadith revendiqué."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 0,
        "title": "Badr",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Siyar / source citée (notice 18)",
        "note": "La participation à Badr figure dans la notice d'Iyâs citant Ibn Sa‘d."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 1,
        "title": "Conquête de l'Égypte",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Siyar / source citée (notice 18)",
        "note": "Adh-Dhahabî cite la participation d'Iyâs à la conquête ; la notice ne donne aucune année de campagne propre à Iyâs."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 2,
        "title": "Décès en 34 H",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Siyar / source citée (notice 18)",
        "note": "Adh-Dhahabî indique une date de décès 34 H, donnée de chronique sans jugement d'isnâd indépendant."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 181,
        "title": "Long parcours d'Iyâs",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/26/",
        "hadithRef": "Adh-Dhahabî / Ibn Sa‘d — source indiquée",
        "note": "La synthèse se fonde sur Ibn Sa‘d cité par adh-Dhahabî : Badr, campagnes et Égypte, décès 34 H. Aucun détail supplémentaire de batailles n'est introduit."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Lien de fraternité avec al-Hârith ibn Khazma",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Ibn Sa‘d, At-Tabaqât ; repris dans Siyar",
        "isnad": "Transmission biographique ou commentaire attribué à l'auteur cité ; l'isnâd complet n'est pas établi dans la fiche.",
        "grade": "ungraded",
        "note": "Citation de l'information d'Ibn Sa‘d chez adh-Dhahabî ; tradition biographique sans évaluation de chaîne dans ce passage.",
        "category": "historical"
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
    "reviewScope": "Repères et variantes vérifiés dans les sources identifiées ; ce repérage documentaire ne certifie pas l'authenticité des chaînes de transmission ni toutes les dates des chroniques.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Les quatre frères à Badr",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 19",
        "isnad": "Attribution bibliographique, sans authentification indépendante par Athar.",
        "grade": "ungraded",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "note": "La formule sur l'absence d'autre fratrie de quatre connue à Badr appartient au commentaire d'adh-Dhahabî, pas à une parole prophétique."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 0,
        "title": "‘Âmir à Badr",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Siyar / source citée (notice 19)",
        "note": "Ibn Sa‘d et adh-Dhahabî mentionnent la présence de ‘Âmir et de ses frères à Badr."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 1,
        "title": "Al-Yamâma : datation divergente",
        "externalUrl": "https://islamweb.net/ar/library/content/200/17885/",
        "hadithRef": "Siyar / source citée (notice 19)",
        "note": "Ibn Kathîr recense la fin de 11 H ou le début de 12 H pour Al-Yamâma et envisage une campagne traversant ces deux années. La notice d'adh-Dhahabî indique que ‘Âmir y fut tué."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 191,
        "title": "Particularité des quatre frères",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Adh-Dhahabî / Ibn Sa‘d — source indiquée",
        "note": "Adh-Dhahabî formule lui-même cette remarque historique après les notices d'Iyâs et de ‘Âmir ; ne pas la présenter comme hadith."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Lien de fraternité avec Thâbit ibn Qays",
        "externalUrl": "https://siyar.fr/livre/1/188",
        "hadithRef": "Ibn Sa‘d, At-Tabaqât ; repris dans Siyar",
        "isnad": "Transmission biographique ou commentaire attribué à l'auteur cité ; l'isnâd complet n'est pas établi dans la fiche.",
        "grade": "ungraded",
        "note": "Ibn Sa‘d est cité pour la fraternité de ‘Âmir avec Thâbit ibn Qays ; degré de la transmission non identifié ici.",
        "category": "historical"
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
    "reviewScope": "Repères et variantes vérifiés dans les sources identifiées ; ce repérage documentaire ne certifie pas l'authenticité des chaînes de transmission ni toutes les dates des chroniques.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "quote",
        "id": 0,
        "title": "Aide d'Abou Bakr et verset 24:22",
        "hadithRef": "Al-Bukhârî 4750",
        "isnad": "Attribution bibliographique, sans authentification indépendante par Athar.",
        "grade": "sahih",
        "externalUrl": "https://sunnah.com/bukhari:4750",
        "note": "‘Â’isha rapporte dans Sahîh al-Bukhârî 4750 qu'Abou Bakr reprit son aide à Mistah après la révélation de 24:22. La citation en tête est une paraphrase signalée du récit."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "timeline",
        "id": 0,
        "title": "Mistah est un combattant de Badr",
        "externalUrl": "https://sunnah.com/bukhari:4750",
        "hadithRef": "Al-Bukhârî 4750",
        "note": "Dans le récit de ‘Â’isha, elle demande à Oum Mistah pourquoi elle maudit un homme qui a participé à Badr ; témoignage situé dans Sahîh al-Bukhârî."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 1,
        "title": "Affaire de l'Ifk : datation de l'expédition discutée",
        "externalUrl": "https://sunnah.com/bukhari:4750",
        "hadithRef": "Siyar / source citée (notice 20)",
        "note": "Al-Bukhârî 4750 rapporte l'affaire et le rôle de Mistah, mais ne fixe pas ici l'année. Ibn Hajar discute les versions 4, 5 et 6 H de l'expédition liée à l'épisode."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 2,
        "title": "Décès en 34 H et version concurrente",
        "externalUrl": "https://siyar.fr/livre/1/189",
        "hadithRef": "Siyar / source citée (notice 20)",
        "note": "Adh-Dhahabî cite Ibn Sa‘d pour une mort en 34 H à 56 ans. Une autre tradition le mentionne à Siffîn en 37 H ; la frise ne choisit pas une année définitive."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 201,
        "title": "Commentaire propre à adh-Dhahabî",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/28/",
        "hadithRef": "Adh-Dhahabî / Ibn Sa‘d — source indiquée",
        "note": "La mise en garde contre le mépris de Mistah appartient au commentaire d'adh-Dhahabî, dans Siyar 1/188, et n'est pas une parole du Prophète."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "narrative",
        "id": 202,
        "title": "Révélation du verset et reprise du soutien",
        "externalUrl": "https://sunnah.com/bukhari:4750",
        "hadithRef": "Al-Bukhârî 4750",
        "note": "‘Â’isha rapporte le serment d'Abou Bakr, la révélation du verset 24:22 et la reprise de l'assistance. Le hadith ne doit pas être présenté comme une absolution prophétique nominative pour Mistah."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "hadith",
        "id": 0,
        "title": "Hadith prophétique général concernant Badr",
        "externalUrl": "https://sunnah.com/bukhari:3007",
        "hadithRef": "Al-Bukhârî 3007 — Sahîh",
        "isnad": "‘Alî ibn Abî Tâlib rapporte le récit de Hâtib ; isnâd complet sur Al-Bukhârî 3007.",
        "grade": "sahih",
        "note": "Al-Bukhârî 3007 relate l'épisode de Hâtib, rapporté par ‘Alî, et une parole sur le pardon accordé aux gens de Badr. Mistah n'est pas nommé dans cet épisode.",
        "category": "prophetic"
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 1,
        "title": "Commentaire éditorial d'adh-Dhahabî",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/28/",
        "hadithRef": "Siyar 1/188, commentaire d'adh-Dhahabî",
        "isnad": "Transmission biographique ou commentaire attribué à l'auteur cité ; l'isnâd complet n'est pas établi dans la fiche.",
        "grade": "ungraded",
        "note": "C'est le jugement moral de l'historien sur Mistah ; ce n'est pas une parole prophétique ni un hadith qudsî.",
        "category": "commentary"
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Siyar : aptitude à écrire ; commentaire biographique",
        "externalUrl": "https://siyar.fr/livre/1/189",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 21",
        "grade": "ungraded",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Siyar : aptitude à écrire ; commentaire biographique. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : Avant Badr",
        "externalUrl": "https://siyar.fr/livre/1/189",
        "hadithRef": "Siyar — notice 21",
        "note": "La notice indique : « Avec Abou Bourda ibn Niyâr, il détruisit les idoles des Banou Hâritha, selon la biographie transmise par adh-Dhahabî. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 2 H",
        "externalUrl": "https://siyar.fr/livre/1/189",
        "hadithRef": "Siyar — notice 21",
        "note": "La notice indique : « Participe à la bataille de Badr selon la notice Siyar. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 2,
        "title": "Repère : Après Badr",
        "externalUrl": "https://sunnah.com/bukhari:4037",
        "hadithRef": "bukhari:4037",
        "note": "La notice indique : « Une variante nomme Abou ‘Abs parmi les hommes ayant accompagné Muhammad ibn Maslama contre Ka‘b ibn al-Ashraf (Al-Bukhârî 4037). Aucune date n'est tirée de ce seul libellé. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 3,
        "title": "Repère : 34 H",
        "externalUrl": "https://siyar.fr/livre/1/189",
        "hadithRef": "Siyar — notice 21",
        "note": "La notice indique : « La notice d'adh-Dhahabî place sa mort à Médine à 70 ans ; ‘Outhman aurait prié sur lui. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 211,
        "title": "Abou ‘Abs dans les versions de l'expédition contre Ka‘b",
        "externalUrl": "https://sunnah.com/bukhari:4037",
        "hadithRef": "bukhari:4037",
        "note": "Récit « Abou ‘Abs dans les versions de l'expédition contre Ka‘b » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 212,
        "title": "La collecte de la zakât",
        "externalUrl": "https://siyar.fr/livre/1/189",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 21",
        "note": "Récit « La collecte de la zakât » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Récit biographique — notice 21",
        "category": "historical",
        "externalUrl": "https://siyar.fr/livre/1/189",
        "hadithRef": "Siyar, notice 21 — témoignage historique ou commentaire",
        "grade": "ungraded",
        "isnad": "Attribution biographique à l'auteur indiqué ; chaîne complète non établie dans cette notice.",
        "note": "Parole ou description attribuée à un biographe ; ce n'est pas un hadith prophétique authentifié."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
        "title": "Repère : 20 H (autres récits : Siffîn)",
        "note": "La notice indique : « Sâlih ibn Kaysân le fait mourir sous ‘Oumar ; d'autres donnent 20 H ou le placent à Siffîn. Al-Wâqidî préférait le décès antérieur à Siffîn. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar.",
        "status": "variant",
        "externalUrl": "https://siyar.fr/livre/1/192",
        "hadithRef": "Siyar — notice 22"
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — La parole du conseiller se trouve dans Siyar 1/192 ; classement indépendant de cette voie non retrouvé",
        "externalUrl": "https://siyar.fr/livre/1/192",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 22",
        "grade": "ungraded",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "La parole du conseiller se trouve dans Siyar 1/192 ; classement indépendant de cette voie non retrouvé. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : Avant l'Hégire",
        "externalUrl": "https://siyar.fr/livre/1/190",
        "hadithRef": "Siyar — notice 22",
        "note": "La notice indique : « La notice rapporte son rejet des idoles et l'attachement au monothéisme avant l'islam. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : Avant l'Hégire",
        "externalUrl": "https://siyar.fr/livre/1/190",
        "hadithRef": "Siyar — notice 22",
        "note": "La notice indique : « Selon la sîra, il figure parmi les représentants (nuqabâ’) de la rencontre d'al-‘Aqaba. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 2,
        "title": "Repère : Khaybar",
        "externalUrl": "https://siyar.fr/livre/1/190",
        "hadithRef": "Siyar — notice 22",
        "note": "La notice indique : « Des récits biographiques le présentent comme chargé d'estimer les dattes de Khaybar ; aucune année individuelle n'est inventée pour cette mission. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 221,
        "title": "La mission d'estimation et la prière du Prophète",
        "externalUrl": "https://siyar.fr/livre/1/190",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 22",
        "note": "Récit « La mission d'estimation et la prière du Prophète » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Tradition rapportée — notice 22",
        "category": "prophetic",
        "externalUrl": "https://siyar.fr/livre/1/192",
        "hadithRef": "Siyar, notice 22 — témoignage historique ou commentaire",
        "grade": "ungraded",
        "isnad": "Attribution biographique à l'auteur indiqué ; chaîne complète non établie dans cette notice.",
        "note": "Degré et attribution issus du recueil cité : Siyar, notice 22 — témoignage historique ou commentaire."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Al-Bukhârî 2731–2732 : Abou Jandal à al-Houdaybiya",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "Al-Bukhârî 2731–2732",
        "grade": "sahih",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Al-Bukhârî 2731–2732 : Abou Jandal à al-Houdaybiya. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 6 H",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "bukhari:2731",
        "note": "La notice indique : « Arrive à al-Houdaybiya en portant des entraves, alors que se négocie le traité avec son père Souhayl ; le récit figure dans Al-Bukhârî 2731–2732. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : Après al-Houdaybiya",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "bukhari:2731",
        "note": "La notice indique : « Le récit d'Al-Bukhârî le montre rejoignant Abou Basîr après avoir retrouvé sa liberté. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 2,
        "title": "Repère : 18 H",
        "externalUrl": "https://siyar.fr/livre/1/192",
        "hadithRef": "Siyar — notice 23",
        "note": "La notice indique : « Adh-Dhahabî rapporte sa mort au Shâm lors de la peste d'‘Amwâs, en 18 H. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 231,
        "title": "Le retour imposé lors des négociations",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "bukhari:2731",
        "note": "Récit « Le retour imposé lors des négociations » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 232,
        "title": "La sortie d'Abou Jandal et son association avec Abou Basîr",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "bukhari:2731",
        "note": "Récit « La sortie d'Abou Jandal et son association avec Abou Basîr » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "hadith",
        "id": 0,
        "title": "Tradition rapportée — notice 23",
        "category": "prophetic",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "Al-Bukhârî 2731–2732",
        "grade": "sahih",
        "isnad": "Al-Miswar ibn Makhrama et Marwân rapportent le récit ; transmission dans Sahîh al-Bukhârî.",
        "note": "Degré et attribution issus du recueil cité : Al-Bukhârî 2731–2732."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Adh-Dhahabî critique l'anachronisme de la citation attribuée à Souhayl",
        "externalUrl": "https://siyar.fr/livre/1/194",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 24",
        "grade": "ungraded",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Adh-Dhahabî critique l'anachronisme de la citation attribuée à Souhayl. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 2 H",
        "externalUrl": "https://siyar.fr/livre/1/193",
        "hadithRef": "Siyar — notice 24",
        "note": "La notice indique : « Selon Siyar, rejoint le camp musulman pendant la bataille de Badr après avoir dissimulé sa foi. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 12 H",
        "externalUrl": "https://siyar.fr/livre/1/193",
        "hadithRef": "Siyar — notice 24",
        "note": "La notice indique : « La notice rapporte sa mort à al-Yamâma, à l'âge de 38 ans, et mentionne aussi une tradition de première émigration en Abyssinie. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "narrative",
        "id": 241,
        "title": "L'intercession évoquée par Souhayl : récit chronologiquement problématique",
        "externalUrl": "https://siyar.fr/livre/1/194",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 24",
        "note": "Récit « L'intercession évoquée par Souhayl : récit chronologiquement problématique » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 242,
        "title": "La participation à Badr",
        "externalUrl": "https://siyar.fr/livre/1/193",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 24",
        "note": "Récit « La participation à Badr » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "hadith",
        "id": 0,
        "title": "Tradition rapportée — notice 24",
        "category": "prophetic",
        "externalUrl": "https://sunnah.com/abudawud:2522",
        "hadithRef": "Abou Dâwoud 2522 — sahîh selon Al-Albânî",
        "grade": "sahih",
        "isnad": "Abou ad-Dardâ’ rapporte cette parole ; Abou Dâwoud discute le nom du transmetteur Rabâh ibn al-Walîd.",
        "note": "Hadith général transmis par Abou ad-Dardâ’, sahîh selon Al-Albânî ; n'authentifie pas le dialogue anachronique rapporté par Al-Wâqidî."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Al-Bukhârî 2731–2732 : négociations à al-Houdaybiya",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "Al-Bukhârî 2731–2732",
        "grade": "sahih",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Al-Bukhârî 2731–2732 : négociations à al-Houdaybiya. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 2 H",
        "externalUrl": "https://siyar.fr/livre/1/194",
        "hadithRef": "Siyar — notice 25",
        "note": "La notice indique : « Capturé à Badr selon la notice biographique. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 6 H",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "bukhari:2731",
        "note": "La notice indique : « Négocie pour Quraysh le traité d'al-Houdaybiya ; Al-Bukhârî 2731–2732 rapporte ses échanges avec le Prophète ﷺ. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 2,
        "title": "Repère : 8 H",
        "externalUrl": "https://siyar.fr/livre/1/194",
        "hadithRef": "Siyar — notice 25",
        "note": "La notice indique : « Adh-Dhahabî rapporte sa conversion lors de la conquête de La Mecque. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 3,
        "title": "Repère : Décès au Shâm (versions divergentes)",
        "externalUrl": "https://siyar.fr/livre/1/196",
        "hadithRef": "Siyar — notice 25",
        "note": "La notice indique : « Al-Madâ’inî situe sa mort à al-Yarmouk ; ach-Châfi‘î et al-Wâqidî la rattachent à la peste d'‘Amwâs. Athar ne choisit pas une version sans source décisive. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 251,
        "title": "Un discours à La Mecque après la mort du Prophète",
        "externalUrl": "https://siyar.fr/livre/1/194",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 25",
        "note": "Récit « Un discours à La Mecque après la mort du Prophète » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 252,
        "title": "Une vie d'adoration après sa conversion",
        "externalUrl": "https://siyar.fr/livre/1/194",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 25",
        "note": "Récit « Une vie d'adoration après sa conversion » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "hadith",
        "id": 0,
        "title": "Tradition rapportée — notice 25",
        "category": "prophetic",
        "externalUrl": "https://sunnah.com/bukhari:2731",
        "hadithRef": "Al-Bukhârî 2731–2732",
        "grade": "sahih",
        "isnad": "Al-Miswar ibn Makhrama et Marwân rapportent le récit ; transmission dans Sahîh al-Bukhârî.",
        "note": "Degré et attribution issus du recueil cité : Al-Bukhârî 2731–2732."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — At-Tirmidhî 3854 : hasan gharîb selon At-Tirmidhî ; hasan selon Darussalam",
        "externalUrl": "https://sunnah.com/tirmidhi:3854",
        "hadithRef": "At-Tirmidhî 3854",
        "grade": "hasan",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "At-Tirmidhî 3854 : hasan gharîb selon At-Tirmidhî ; hasan selon Darussalam. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 11 ou 12 H",
        "externalUrl": "https://siyar.fr/livre/1/196",
        "hadithRef": "Siyar — notice 26",
        "note": "La notice indique : « Selon les chroniques, Al-Barâ’ fut porté au-dessus du mur du jardin pendant la bataille d'al-Yamâma ; la bataille est située à la fin de 11 H ou au début de 12 H. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 20 H",
        "externalUrl": "https://siyar.fr/livre/1/199",
        "hadithRef": "Siyar — notice 26",
        "note": "La notice indique : « Adh-Dhahabî rapporte sa mort à Shushtar lors des campagnes du Khûzistân. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 261,
        "title": "La porte du jardin à al-Yamâma",
        "externalUrl": "https://siyar.fr/livre/1/196",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 26",
        "note": "Récit « La porte du jardin à al-Yamâma » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 262,
        "title": "Le serment d'Al-Barâ’",
        "externalUrl": "https://sunnah.com/tirmidhi:3854",
        "hadithRef": "tirmidhi:3854",
        "note": "Récit « Le serment d'Al-Barâ’ » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "located",
        "kind": "hadith",
        "id": 0,
        "title": "Tradition rapportée — notice 26",
        "category": "prophetic",
        "externalUrl": "https://sunnah.com/tirmidhi:3854",
        "hadithRef": "At-Tirmidhî 3854 — hasan gharîb selon At-Tirmidhî, hasan selon Darussalam",
        "grade": "hasan",
        "isnad": "‘Abd Allah ibn Abî Ziyâd → Sayyâr → Ja‘far ibn Soulaymân → Thâbit et ‘Alî ibn Zayd → Anas.",
        "note": "Degré et attribution issus du recueil cité : At-Tirmidhî 3854 — hasan gharîb selon At-Tirmidhî, hasan selon Darussalam."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
        "title": "Repère : 15 ou 20 H",
        "note": "La notice indique : « Adh-Dhahabî indique une mort estimée en 20 H et rapporte également 15 H. Ces deux versions restent visibles. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar.",
        "status": "variant",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Siyar — notice 27"
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Siyar : participation à Hounayn et don de trois mille lances ; mort 15 ou 20 H",
        "externalUrl": "https://siyar.fr/livre/1/199",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 27",
        "grade": "ungraded",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Siyar : participation à Hounayn et don de trois mille lances ; mort 15 ou 20 H. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 2 H",
        "externalUrl": "https://siyar.fr/livre/1/199",
        "hadithRef": "Siyar — notice 27",
        "note": "La notice indique : « Capturé dans les rangs qurayshites à Badr ; le récit biographique mentionne la rançon payée par al-‘Abbâs. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 5 H",
        "externalUrl": "https://siyar.fr/livre/1/199",
        "hadithRef": "Siyar — notice 27",
        "note": "La notice indique : « Selon Siyar, Nawfal se convertit et émigra l'année d'al-Khandaq. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 2,
        "title": "Repère : 8 H",
        "externalUrl": "https://siyar.fr/livre/1/199",
        "hadithRef": "Siyar — notice 27",
        "note": "La notice indique : « Des récits lui attribuent la mise à disposition de trois mille lances lors de Hounayn. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 271,
        "title": "L'aide matérielle lors de Hounayn",
        "externalUrl": "https://siyar.fr/livre/1/199",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 27",
        "note": "Récit « L'aide matérielle lors de Hounayn » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Récit biographique — notice 27",
        "category": "historical",
        "externalUrl": "https://siyar.fr/livre/1/199",
        "hadithRef": "Siyar, notice 27 — témoignage historique ou commentaire",
        "grade": "ungraded",
        "isnad": "Attribution biographique à l'auteur indiqué ; chaîne complète non établie dans cette notice.",
        "note": "Parole ou description attribuée à un biographe ; ce n'est pas un hadith prophétique authentifié."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Siyar : Al-Hârith gouverneur de La Mecque sous ‘Oumar et ‘Outhman",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 28",
        "grade": "ungraded",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Siyar : Al-Hârith gouverneur de La Mecque sous ‘Oumar et ‘Outhman. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : À la conversion de son père",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Siyar — notice 28",
        "note": "La notice indique : « Adh-Dhahabî rapporte qu'Al-Hârith se convertit avec son père Nawfal ; aucune année personnelle n'est imposée. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : Califats de ‘Oumar et ‘Outhman",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Siyar — notice 28",
        "note": "La notice indique : « La notice le présente comme gouverneur de La Mecque sous ces deux califes ; la période n'est pas transformée en année fictive. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 2,
        "title": "Repère : Sous le califat d'‘Outhman",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Siyar — notice 28",
        "note": "La notice indique : « Siyar rapporte sa mort vers 70 ans, sans année hégirienne exacte. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 281,
        "title": "Administration de La Mecque",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 28",
        "note": "Récit « Administration de La Mecque » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Récit biographique — notice 28",
        "category": "historical",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Siyar, notice 28 — témoignage historique ou commentaire",
        "grade": "ungraded",
        "isnad": "Attribution biographique à l'auteur indiqué ; chaîne complète non établie dans cette notice.",
        "note": "Parole ou description attribuée à un biographe ; ce n'est pas un hadith prophétique authentifié."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Ibn Sa‘d classe ‘Abd-Allah ibn al-Hârith parmi les tâbi‘în fiables ; 83 ou 84 H",
        "externalUrl": "https://siyar.fr/livre/1/202",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 29",
        "grade": "ungraded",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Ibn Sa‘d classe ‘Abd-Allah ibn al-Hârith parmi les tâbi‘în fiables ; 83 ou 84 H. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : Enfance (sans année)",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Siyar — notice 29",
        "note": "La notice indique : « Selon Ibn Sa‘d, sa mère le présenta nourrisson au Prophète ﷺ, qui invoqua pour lui et lui transmit de sa salive ; aucune année précise n'est donnée. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 1,
        "title": "Repère : Troubles à Bassora",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Siyar — notice 29",
        "note": "La notice indique : « Des chroniques indiquent qu'il fut choisi pour gouverner Bassora dans une période de troubles, avant de quitter la ville par crainte d'al-Hajjâj. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "variant",
        "kind": "timeline",
        "id": 2,
        "title": "Repère : 83 ou 84 H",
        "externalUrl": "https://siyar.fr/livre/1/202",
        "hadithRef": "Siyar — notice 29",
        "note": "La notice indique : « Ibn Sa‘d situe son décès à Oman en 84 H ; Abou ‘Oubayd donne 83 H. La divergence est conservée. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 291,
        "title": "L'origine du surnom Babbâ",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 29",
        "note": "Récit « L'origine du surnom Babbâ » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 292,
        "title": "Le gouvernement de Bassora et le départ pour Oman",
        "externalUrl": "https://siyar.fr/livre/1/200",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 29",
        "note": "Récit « Le gouvernement de Bassora et le départ pour Oman » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Avis de l'auteur — notice 29",
        "category": "commentary",
        "externalUrl": "https://siyar.fr/livre/1/202",
        "hadithRef": "Siyar, notice 29 — témoignage historique ou commentaire",
        "grade": "ungraded",
        "isnad": "Attribution biographique à l'auteur indiqué ; chaîne complète non établie dans cette notice.",
        "note": "Parole ou description attribuée à un biographe ; ce n'est pas un hadith prophétique authentifié."
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
    "reviewScope": "Attributions, variantes et avis des auteurs identifiés sont indiqués, mais ce repérage ne certifie ni toutes les chaînes ni les dates des chroniques. Athar ne produit aucun jugement d'authenticité indépendant.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "quote",
        "id": 0,
        "title": "Citation principale — Ibn Sa‘d qualifie Abou Yahyâ de fiable et place sa mort en 97 H à al-Abwâ",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 30",
        "grade": "ungraded",
        "isnad": "Attribution ou jugement rapporté de la source indiquée ; Athar ne classe pas indépendamment les chaînes.",
        "note": "Ibn Sa‘d qualifie Abou Yahyâ de fiable et place sa mort en 97 H à al-Abwâ. Les propos biographiques ou les réserves de l'historien sont distingués des paroles prophétiques."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 97 H",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Siyar — notice 30",
        "note": "La notice indique : « Selon Ibn Sa‘d, il mourut à al-Abwâ, frappé par le vent chaud appelé simoun, lors d'un déplacement avec le calife Soulaymân, qui aurait accompli la prière mortuaire. » Cette datation ou cette attribution est présentée comme transmise, sans déduction nouvelle d'Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "narrative",
        "id": 301,
        "title": "Une mort rapportée à al-Abwâ",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Adh-Dhahabî, Siyar, notice 30",
        "note": "Récit « Une mort rapportée à al-Abwâ » attribué au recueil cité. Le texte distingue le témoignage rapporté des appréciations personnelles de l'auteur et n'invente aucun classement."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "status": "qualification",
        "kind": "hadith",
        "id": 0,
        "title": "Avis de l'auteur — notice 30",
        "category": "commentary",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Siyar, notice 30 — témoignage historique ou commentaire",
        "grade": "ungraded",
        "isnad": "Attribution biographique à l'auteur indiqué ; chaîne complète non établie dans cette notice.",
        "note": "Parole ou description attribuée à un biographe ; ce n'est pas un hadith prophétique authentifié."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 31",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/39/",
        "hadithRef": "Adh-Dhahabî, Siyar : mention unique d'al-Hâkim",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : Époque prophétique, date non établie",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/39/",
        "hadithRef": "Siyar, figure 31",
        "status": "qualification",
        "note": "Événement rapporté : Al-Hâkim classe Sa‘îd parmi les compagnons ; adh-Dhahabî ne signale aucun autre biographe l'ayant mentionné. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 311,
        "title": "Le récit isolé de Sa‘îd",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/39/",
        "hadithRef": "Siyar ou répertoire : figure 31",
        "status": "qualification",
        "note": "Adh-Dhahabî dit que Salmân al-Agharr transmet de Sa‘îd une parole sur le croyant qui rencontrera Allah. Il signale Ibn Lahî‘a dans la chaîne. La notice ne fournit pas d'évaluation explicite permettant à Athar de classer ce récit par lui-même."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 312,
        "title": "Une documentation très réduite",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/39/",
        "hadithRef": "Siyar ou répertoire : figure 31",
        "status": "qualification",
        "note": "Adh-Dhahabî explique que seul al-Hâkim lui est connu pour l'avoir compté parmi les compagnons. Aucun voyage, bataille ou événement précis n'est ajouté sans source propre à Sa‘îd."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://www.islamweb.net/ar/library/content/60/39/",
        "hadithRef": "Al-Hâkim, cité par adh-Dhahabî : chaîne comportant Ibn Lahî‘a",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Adh-Dhahabî signale explicitement Ibn Lahî‘a dans la chaîne. Aucun classement indépendant n'est inventé par Athar.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 32",
        "externalUrl": "https://sunnah.com/bukhari:3042",
        "hadithRef": "Hadith ou récit précisément référencé dans la notice",
        "grade": "sahih",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 8 H",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Siyar, figure 32",
        "status": "qualification",
        "note": "Événement rapporté : Sa conversion à l'époque de la conquête de La Mecque est relatée dans les biographies. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 8 H",
        "externalUrl": "https://sunnah.com/bukhari:3042",
        "hadithRef": "3042",
        "status": "qualification",
        "note": "Événement rapporté : Al-Bukhârî 3042 le montre tenant les rênes de la mule du Prophète à Hounayn. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 2,
        "title": "Repère : 20 H selon une tradition",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Siyar, figure 32",
        "status": "variant",
        "note": "Événement rapporté : Adh-Dhahabî mentionne un décès à Médine vers 20 H après une blessure survenue lors d'un rasage. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 321,
        "title": "De l'hostilité à la réconciliation",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Siyar ou répertoire : figure 32",
        "status": "qualification",
        "note": "Les ouvrages de sîra relatent qu'après des années d'opposition et de poésie hostile, Abou Soufyân chercha à rencontrer le Prophète et fut finalement accueilli. Les dialogues précis de cette scène ne figurent pas dans Al-Bukhârî 3042."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 322,
        "title": "La bride de la mule à Hounayn",
        "externalUrl": "https://sunnah.com/bukhari:3042",
        "hadithRef": "Recueil cité : 3042",
        "status": "qualification",
        "note": "Al-Barâ’ ibn ‘Âzib rapporte dans Al-Bukhârî 3042 et 4315 qu'Abou Soufyân ibn al-Hârith tenait la mule lorsque les combattants affrontèrent les flèches adverses. Le Prophète resta sur place."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 323,
        "title": "Une mort rapportée après une blessure",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Siyar ou répertoire : figure 32",
        "status": "qualification",
        "note": "Adh-Dhahabî cite une tradition selon laquelle un barbier coupa une verrue sur son crâne lors d'un pèlerinage ; il mourut ensuite. Ce détail est biographique et ne constitue pas une conclusion médicale indépendante."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 324,
        "title": "Un titre honorifique dans une voie interrompue",
        "externalUrl": "https://siyar.fr/livre/1/203",
        "hadithRef": "Siyar ou répertoire : figure 32",
        "status": "variant",
        "note": "Une parole lui attribue le titre de chef des jeunes du Paradis. La note d'Ibn Hajar sur cette voie la décrit comme moursal. Elle reste visible avec ce jugement, et n'est pas présentée comme unanimement authentifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "historical",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:3042",
        "hadithRef": "Al-Bukhârî 3042 ; 4315",
        "grade": "sahih",
        "status": "located",
        "note": "Témoignage d'al-Barâ’ : Abou Soufyân tient la bride de la mule à Hounayn.",
        "isnad": "Témoignage historique attribué au rapporteur cité, non nouvelle parole prophétique."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 1,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://ketabonline.com/ar/books/598/read?page=1812&part=1",
        "hadithRef": "Siyar 1/206 : voie d'‘Urwa, moursal selon Ibn Hajar",
        "grade": "attribution_discontinue",
        "status": "qualification",
        "note": "Ibn Hajar souligne que la voie est moursal. La tradition est conservée avec sa réserve sans la faire passer pour un hadith unanimement authentifié.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 33",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Siyar, figure 33",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 8 H",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Siyar, figure 33",
        "status": "qualification",
        "note": "Événement rapporté : D'après Ibn Sa‘d, Ja‘far demeura auprès de son père pendant la bataille de Hounayn. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : Milieu du califat de Mou‘âwiya",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Siyar, figure 33",
        "status": "variant",
        "note": "Événement rapporté : La notice situe le décès au milieu de ce califat, sans année précise. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 331,
        "title": "Ja‘far et son père à Hounayn",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Siyar ou répertoire : figure 33",
        "status": "qualification",
        "note": "Adh-Dhahabî reprend Ibn Sa‘d : Ja‘far et son père Abou Soufyân tinrent bon au combat de Hounayn. Aucune action militaire personnelle supplémentaire n'est décrite dans cette courte notice."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 332,
        "title": "Une dernière mention sous Mou‘âwiya",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Siyar ou répertoire : figure 33",
        "status": "qualification",
        "note": "Ibn Sa‘d rapporte que Ja‘far vécut jusqu'au milieu du califat de Mou‘âwiya. La notice ne donne ni année précise ni autres événements qu'il serait rigoureux d'ajouter."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "historical",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Ibn Sa‘d cité par adh-Dhahabî, Siyar notice 33",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Le bref récit est une tradition historique ; aucun hadith individuel ni degré n'est attribué à Ja‘far par Athar.",
        "isnad": "Témoignage historique attribué au rapporteur cité, non nouvelle parole prophétique."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 34",
        "externalUrl": "https://sunnah.com/bukhari:4251",
        "hadithRef": "Hadith ou récit précisément référencé dans la notice",
        "grade": "sahih",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : Avant l'Hégire",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Siyar, figure 34",
        "status": "qualification",
        "note": "Événement rapporté : Ja‘far émigre en Abyssinie avec Asmâ’ bint ‘Oumays. L'ancien repère « 5 H » était chronologiquement erroné. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 7 H",
        "externalUrl": "https://sunnah.com/bukhari:4230",
        "hadithRef": "4230",
        "status": "qualification",
        "note": "Événement rapporté : Ja‘far et les émigrés d'Abyssinie retrouvent le Prophète à l'époque de Khaybar, selon Al-Bukhârî 4230. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 2,
        "title": "Repère : 7 H",
        "externalUrl": "https://sunnah.com/bukhari:4251",
        "hadithRef": "4251",
        "status": "qualification",
        "note": "Événement rapporté : Al-Bukhârî 4251 rapporte le litige concernant la fille de Hamza et le compliment adressé à Ja‘far. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 3,
        "title": "Repère : 8 H",
        "externalUrl": "https://sunnah.com/bukhari:4261",
        "hadithRef": "4261",
        "status": "qualification",
        "note": "Événement rapporté : Meurt à Mou’ta après Zayd ibn Hâritha selon Al-Bukhârî 4261–4262. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 341,
        "title": "La défense des émigrés devant le Négus",
        "externalUrl": "https://siyar.fr/livre/1/207",
        "hadithRef": "Siyar ou répertoire : figure 34",
        "status": "qualification",
        "note": "Les ouvrages de sîra racontent que Ja‘far prit la parole devant le souverain d'Abyssinie et récita des versets de la sourate Maryam. Les détails des dialogues et l'émotion du roi relèvent de transmissions historiques distinctes, pas du hadith de Mou’ta dans Al-Bukhârî."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 342,
        "title": "L'hospitalité de Ja‘far envers les pauvres",
        "externalUrl": "https://sunnah.com/bukhari:3708",
        "hadithRef": "Recueil cité : 3708",
        "status": "qualification",
        "note": "Abou Hourayra témoigne dans Al-Bukhârî 3708 que Ja‘far accueillait les pauvres et partageait avec eux même les derniers restes de nourriture contenus dans un récipient."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 343,
        "title": "La fille de Hamza et la ressemblance avec le Prophète",
        "externalUrl": "https://sunnah.com/bukhari:4251",
        "hadithRef": "Recueil cité : 4251",
        "status": "qualification",
        "note": "Al-Barâ’ rapporte dans Al-Bukhârî 4251 que ‘Alî, Ja‘far et Zayd discutèrent de la garde de la fille de Hamza. Le Prophète la confia à sa tante, épouse de Ja‘far, puis lui dit qu'il lui ressemblait en apparence et en caractère. Le récit du saut de joie provient d'autres versions."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 344,
        "title": "Les commandants et les blessures à Mou’ta",
        "externalUrl": "https://sunnah.com/bukhari:4261",
        "hadithRef": "Recueil cité : 4261",
        "status": "qualification",
        "note": "Ibn ‘Oumar rapporte dans Al-Bukhârî 4261 la succession prévue entre Zayd, Ja‘far et Ibn Rawâha. Il dit avoir retrouvé sur le corps de Ja‘far plus de quatre-vingt-dix blessures. Le détail des deux mains coupées est mentionné dans d'autres voies."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 345,
        "title": "Le mérite accordé aux gens du bateau",
        "externalUrl": "https://sunnah.com/bukhari:3876",
        "hadithRef": "Recueil cité : 3876",
        "status": "qualification",
        "note": "Abou Moussa raconte dans Al-Bukhârî 3876 que les migrants arrivés en Abyssinie rencontrèrent Ja‘far, puis rejoignirent tous le Prophète lors de Khaybar. Le Prophète leur parla de leur double émigration."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 346,
        "title": "Préparer le repas de la famille endeuillée",
        "externalUrl": "https://sunnah.com/tirmidhi:998",
        "hadithRef": "Recueil cité : 998",
        "status": "qualification",
        "note": "‘Abd-Allah ibn Ja‘far transmet dans At-Tirmidhî 998 que le Prophète demanda que l'on apporte un repas à la famille de Ja‘far, occupée par son deuil. At-Tirmidhî et Darussalam le qualifient de hasan."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:4251",
        "hadithRef": "Al-Bukhârî 4251",
        "grade": "sahih",
        "status": "located",
        "note": "Al-Barâ’ transmet la parole prophétique sur la ressemblance de Ja‘far.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 1,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://dorar.net/h/MiqsDlc2",
        "hadithRef": "At-Tabarânî 1467 ; Al-Haythamî : une voie hasan ; Al-Albânî : sahîh li-ghayrihi",
        "grade": "disputed",
        "status": "variant",
        "note": "Les deux jugements positifs sont de nature différente et s'appliquent à des évaluations distinctes ; aucun nouveau jugement n'est produit.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 2,
        "category": "historical",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:4261",
        "hadithRef": "Al-Bukhârî 4261",
        "grade": "sahih",
        "status": "located",
        "note": "Ibn ‘Oumar rapporte avoir constaté plus de quatre-vingt-dix blessures sur le corps de Ja‘far.",
        "isnad": "Témoignage historique attribué au rapporteur cité, non nouvelle parole prophétique."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 3,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/tirmidhi:998",
        "hadithRef": "At-Tirmidhî 998 — hasan selon At-Tirmidhî et Darussalam",
        "grade": "hasan",
        "status": "located",
        "note": "Transmission d'‘Abd-Allah ibn Ja‘far relative à la préparation du repas pour sa famille.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
        "title": "La réponse d'‘Aqîl après Badr",
        "note": "Les chroniques rapportent qu'‘Aqîl s'enquit auprès du Prophète des chefs mecquois tombés à Badr. La formule sur la voie désormais ouverte est attribuée à ‘Aqîl lui-même, et non au Prophète.",
        "status": "qualification",
        "externalUrl": "https://siyar.fr/livre/1/218",
        "hadithRef": "Siyar ou répertoire : figure 35"
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 35",
        "externalUrl": "https://dorar.net/h/ARqrTG9R",
        "hadithRef": "Siyar, figure 35",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 2 H",
        "externalUrl": "https://siyar.fr/livre/1/218",
        "hadithRef": "Siyar, figure 35",
        "status": "qualification",
        "note": "Événement rapporté : Les biographies placent ‘Aqîl parmi les captifs de Badr, dans le camp qurayshite. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 8 H selon les chroniques",
        "externalUrl": "https://siyar.fr/livre/1/218",
        "hadithRef": "Siyar, figure 35",
        "status": "qualification",
        "note": "Événement rapporté : Son ralliement à l'islam est situé vers la conquête de La Mecque, selon les chroniques. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 2,
        "title": "Repère : Après 8 H, sans date précise",
        "externalUrl": "https://siyar.fr/livre/1/218",
        "hadithRef": "Siyar, figure 35",
        "status": "qualification",
        "note": "Événement rapporté : Siyar rapporte des revenus en dattes liés à Khaybar, sans année individuelle établie. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 3,
        "title": "Repère : Sous Mou‘âwiya",
        "externalUrl": "https://siyar.fr/livre/1/218",
        "hadithRef": "Siyar, figure 35",
        "status": "variant",
        "note": "Événement rapporté : La notice situe son décès durant le califat de Mou‘âwiya, sans année unique. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 351,
        "title": "Les deux motifs d'affection : une voie moursal",
        "externalUrl": "https://dorar.net/h/ARqrTG9R",
        "hadithRef": "Siyar ou répertoire : figure 35",
        "status": "qualification",
        "note": "Une parole attribuée au Prophète exprime son affection pour ‘Aqîl en raison de leur parenté et de l'amour qu'Abou Tâlib lui portait. Ach-Chawkânî indique que la chaîne est moursal et que ses rapporteurs mentionnés sont fiables. Al-Hâkim et At-Tabarânî transmettent aussi le récit."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 352,
        "title": "Une aiguille rendue par scrupule",
        "externalUrl": "https://siyar.fr/livre/1/218",
        "hadithRef": "Siyar ou répertoire : figure 35",
        "status": "qualification",
        "note": "Selon Zayd ibn Aslam, ‘Aqîl ramena une aiguille à son épouse, puis demanda qu'on la rende lorsqu'il apprit qu'il n'était pas permis de prélever un bien du butin. La source ne précise pas nécessairement le lieu de cette scène."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 354,
        "title": "Un connaisseur des filiations tribales",
        "externalUrl": "https://siyar.fr/livre/1/218",
        "hadithRef": "Siyar ou répertoire : figure 35",
        "status": "qualification",
        "note": "Adh-Dhahabî rapporte qu'‘Aqîl connaissait les généalogies arabes et les lignages des tribus. Ce témoignage éclaire sa place parmi les transmetteurs de mémoire familiale."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://dorar.net/h/ARqrTG9R",
        "hadithRef": "Al-Hâkim 6625 ; ach-Chawkânî, Durr as-Sahâba 275 : moursal, rapporteurs fiables",
        "grade": "attribution_discontinue",
        "status": "qualification",
        "note": "Ach-Chawkânî distingue la fiabilité des transmetteurs présents de l'interruption de la chaîne. Athar n'en déduit pas un verdict inédit.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 36",
        "externalUrl": "https://sunnah.com/bukhari:4250",
        "hadithRef": "Hadith ou récit précisément référencé dans la notice",
        "grade": "sahih",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : Enfance, sans année précise",
        "externalUrl": "https://siyar.fr/livre/1/221",
        "hadithRef": "Siyar, figure 36",
        "status": "qualification",
        "note": "Événement rapporté : Les récits biographiques racontent l'enlèvement, la vente et l'affranchissement de Zayd ; les montants varient selon les chroniques. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : Avant la révélation de 33:5",
        "externalUrl": "https://sunnah.com/bukhari:4782",
        "hadithRef": "4782",
        "status": "qualification",
        "note": "Événement rapporté : Ibn ‘Oumar raconte que Zayd était appelé « ibn Mouhammad » jusqu'à la révélation prescrivant de nommer les enfants par leurs pères (Al-Bukhârî 4782). Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 2,
        "title": "Repère : Avant 8 H",
        "externalUrl": "https://sunnah.com/bukhari:4250",
        "hadithRef": "4250",
        "status": "qualification",
        "note": "Événement rapporté : Zayd dirige plusieurs expéditions selon les biographies ; Al-Bukhârî 4250 témoigne de la défense prophétique de son aptitude à commander. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 3,
        "title": "Repère : 8 H",
        "externalUrl": "https://sunnah.com/bukhari:4261",
        "hadithRef": "4261",
        "status": "qualification",
        "note": "Événement rapporté : Premier commandant désigné à Mou’ta, où il meurt, selon Al-Bukhârî 4261–4262. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 361,
        "title": "Le choix de Zayd",
        "externalUrl": "https://siyar.fr/livre/1/221",
        "hadithRef": "Siyar ou répertoire : figure 36",
        "status": "qualification",
        "note": "Les ouvrages de sîra racontent que le père et l'oncle de Zayd vinrent le rechercher. Zayd choisit de rester auprès du Prophète, qui l'affranchit. Les dialogues détaillés sont rapportés historiquement, pas dans le hadith d'Al-Bukhârî 4782."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 362,
        "title": "L'ancien nom et les versets de la sourate al-Ahzâb",
        "externalUrl": "https://sunnah.com/bukhari:4782",
        "hadithRef": "Recueil cité : 4782",
        "status": "qualification",
        "note": "Ibn ‘Oumar rapporte dans Al-Bukhârî 4782 que Zayd était appelé « fils de Mouhammad » jusqu'à la révélation de 33:5. Le Coran nomme explicitement Zayd dans le verset 33:37."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 363,
        "title": "L'accueil de Zayd à Médine et les divergences de classement",
        "externalUrl": "https://sunnah.com/tirmidhi:2732",
        "hadithRef": "Recueil cité : 2732",
        "status": "variant",
        "note": "‘Â’isha rapporte dans At-Tirmidhî 2732 que le Prophète embrassa Zayd lors de son arrivée. At-Tirmidhî juge cette voie hasan gharîb ; l'édition Darussalam la classe da‘îf. Les deux jugements sont affichés."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 364,
        "title": "Une défense explicite de ses qualités de commandement",
        "externalUrl": "https://sunnah.com/bukhari:4250",
        "hadithRef": "Recueil cité : 4250",
        "status": "qualification",
        "note": "Dans Al-Bukhârî 4250, Ibn ‘Oumar rapporte que des personnes critiquèrent la nomination d'Ousâma. Le Prophète répondit que son père Zayd avait déjà subi de telles critiques mais était digne de commander."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 365,
        "title": "La succession prévue à Mou’ta",
        "externalUrl": "https://sunnah.com/bukhari:4262",
        "hadithRef": "Recueil cité : 4262",
        "status": "qualification",
        "note": "Al-Bukhârî 4261–4262 transmet la succession entre Zayd, Ja‘far et Ibn Rawâha. Selon Anas, le Prophète annonça leur mort avant l'arrivée de la nouvelle et ses yeux étaient remplis de larmes."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "verse",
        "id": 0,
        "category": "verse",
        "title": "Verset du Coran",
        "externalUrl": "https://quran.com/33/37",
        "hadithRef": "Coran 33:37",
        "grade": "not_applicable",
        "status": "located",
        "note": "Le verset cite Zayd ; c'est un texte coranique et non un hadith.",
        "isnad": "Sans objet : Coran."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 1,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:4251",
        "hadithRef": "Al-Bukhârî 4251",
        "grade": "sahih",
        "status": "located",
        "note": "Le Prophète appelle Zayd son frère et affranchi.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 2,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:4250",
        "hadithRef": "Al-Bukhârî 4250",
        "grade": "sahih",
        "status": "located",
        "note": "Ibn ‘Oumar rapporte la défense de Zayd et d'Ousâma par le Prophète.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 3,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/tirmidhi:2732",
        "hadithRef": "At-Tirmidhî 2732 : hasan gharîb selon At-Tirmidhî ; da‘îf selon Darussalam",
        "grade": "disputed",
        "status": "variant",
        "note": "Deux appréciations distinctes de la transmission sur l'accueil de Zayd sont affichées.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 37",
        "externalUrl": "https://sunnah.com/bukhari:4261",
        "hadithRef": "Hadith ou récit précisément référencé dans la notice",
        "grade": "sahih",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : Avant l'Hégire",
        "externalUrl": "https://siyar.fr/livre/1/230",
        "hadithRef": "Siyar, figure 37",
        "status": "qualification",
        "note": "Événement rapporté : Les traditions de sîra le comptent parmi les Ansâr engagés lors du pacte d'al-‘Aqaba. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 2–3 H",
        "externalUrl": "https://siyar.fr/livre/1/230",
        "hadithRef": "Siyar, figure 37",
        "status": "qualification",
        "note": "Événement rapporté : Les chroniques le mentionnent à Badr et Ouhoud, sans déduction d'autres événements. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 2,
        "title": "Repère : 7 H",
        "externalUrl": "https://dorar.net/h/HPSMvins",
        "hadithRef": "Siyar, figure 37",
        "status": "qualification",
        "note": "Événement rapporté : Le Mouwatta’ relate l'estimation des récoltes à Khaybar : Ibn ‘Abd al-Barr dit moursal et mentionne des voies complémentaires. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 3,
        "title": "Repère : 8 H",
        "externalUrl": "https://sunnah.com/bukhari:4261",
        "hadithRef": "4261",
        "status": "qualification",
        "note": "Événement rapporté : Meurt à Mou’ta après Zayd et Ja‘far selon Al-Bukhârî 4261–4262. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 371,
        "title": "« Venez, croyons un instant » : jugements distincts",
        "externalUrl": "https://dorar.net/h/pCGzjR2I",
        "hadithRef": "Siyar ou répertoire : figure 37",
        "status": "variant",
        "note": "Une tradition d'Anas raconte qu'Ibn Rawâha invitait ses compagnons à renforcer leur foi et que le Prophète invoqua pour lui. Al-Haythamî juge une chaîne hasan (Majma‘ az-Zawâ’id 10/79), mais Shu‘ayb al-Arna’ût juge faible la voie étudiée dans Siyar 1/231. Les évaluations sont attribuées séparément."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 372,
        "title": "Le discours de Ma‘ân dans les chroniques",
        "externalUrl": "https://siyar.fr/livre/1/230",
        "hadithRef": "Siyar ou répertoire : figure 37",
        "status": "qualification",
        "note": "Les ouvrages de sîra racontent qu'avant Mou’ta Ibn Rawâha encouragea les musulmans à ne pas renoncer face à l'adversaire. Les chiffres précis de soldats évoqués dans certaines versions ne sont pas fournis par Al-Bukhârî 4261."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 373,
        "title": "L'estimation équitable des dattes",
        "externalUrl": "https://dorar.net/h/HPSMvins",
        "hadithRef": "Siyar ou répertoire : figure 37",
        "status": "qualification",
        "note": "Selon une transmission du Mouwatta’ par Soulaymân ibn Yasâr, Ibn Rawâha refusa des bijoux proposés pour modifier la répartition à Khaybar, disant que son aversion pour ses interlocuteurs ne l'autoriserait pas à être injuste. Ibn ‘Abd al-Barr considère cette version moursal avec une corroboration et une voie reliée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 374,
        "title": "La nouvelle des trois commandants",
        "externalUrl": "https://sunnah.com/bukhari:4262",
        "hadithRef": "Recueil cité : 4262",
        "status": "qualification",
        "note": "Al-Bukhârî 4262 rapporte qu'avant l'arrivée de la nouvelle, le Prophète annonça la mort de Zayd, de Ja‘far et d'Ibn Rawâha et pleura. Khâlid prit ensuite l'étendard."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:4262",
        "hadithRef": "Al-Bukhârî 4262",
        "grade": "sahih",
        "status": "located",
        "note": "Anas rapporte l'annonce prophétique de la mort des commandants de Mou’ta.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 1,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://dorar.net/h/pCGzjR2I",
        "hadithRef": "Ahmad 13796 ; Al-Haythamî 10/79 : hasan ; Shu‘ayb al-Arna’ût, Siyar 1/231 : faible",
        "grade": "disputed",
        "status": "variant",
        "note": "Les évaluations concernent des voies examinées par des spécialistes différents, et sont signalées sans uniformisation.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 2,
        "category": "historical",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://dorar.net/h/HPSMvins",
        "hadithRef": "Mouwatta’ ; Ibn ‘Abd al-Barr, al-Istidhkâr 6/39 : moursal avec corroboration",
        "grade": "attribution_discontinue",
        "status": "qualification",
        "note": "Ibn ‘Abd al-Barr déclare la voie moursal et signale une corroboration et une version reliée.",
        "isnad": "Témoignage historique attribué au rapporteur cité, non nouvelle parole prophétique."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 38",
        "externalUrl": "https://dorar.net/h/sK6hUNNK",
        "hadithRef": "Siyar, figure 38",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 1 H",
        "externalUrl": "https://dorar.net/h/sK6hUNNK",
        "hadithRef": "Siyar, figure 38",
        "status": "qualification",
        "note": "Événement rapporté : À Qoubâ, hébergement chez Koulthoum selon Ibn Ishâq, ou chez Sa‘d ibn Khaythama selon une autre version. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : Avant Badr (2 H)",
        "externalUrl": "https://siyar.fr/livre/1/242",
        "hadithRef": "Siyar, figure 38",
        "status": "qualification",
        "note": "Événement rapporté : Ibn Sa‘d situe le décès de Koulthoum peu après l'Hégire, avant Badr, sans date journalière démontrée. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 381,
        "title": "Deux hôtes possibles à Qoubâ",
        "externalUrl": "https://dorar.net/h/sK6hUNNK",
        "hadithRef": "Siyar ou répertoire : figure 38",
        "status": "qualification",
        "note": "Ibn Ishâq rapporte le séjour du Prophète chez Koulthoum, tout en donnant la version alternative de Sa‘d ibn Khaythama. Al-Haythamî indique que les transmetteurs de la voie examinée sont fiables (Majma‘ az-Zawâ’id 6/65) ; le classement ne supprime pas l'existence de variantes."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 382,
        "title": "La maison des célibataires chez Sa‘d",
        "externalUrl": "https://gcp.islamweb.net/ar/library/content/59/227/",
        "hadithRef": "Siyar ou répertoire : figure 38",
        "status": "qualification",
        "note": "La sîra concilie parfois les récits en expliquant que le Prophète logeait chez Koulthoum mais recevait les visiteurs chez Sa‘d, dont la maison était appelée la maison des célibataires. Cette explication est attribuée aux chroniqueurs et n'est pas posée comme une preuve excluant les autres versions."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "historical",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://dorar.net/h/sK6hUNNK",
        "hadithRef": "At-Tabarânî 5414 ; Al-Haythamî, Majma‘ az-Zawâ’id 6/65 : rapporteurs fiables",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Al-Haythamî dit que les rapporteurs de la chaîne sont fiables ; l'attribution à Koulthoum connaît toutefois une variante à Sa‘d ibn Khaythama.",
        "isnad": "Témoignage historique attribué au rapporteur cité, non nouvelle parole prophétique."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
        "title": "Repère : 3 H",
        "note": "Événement rapporté : À Ouhoud, prend l'épée du Prophète en acceptant d'en respecter les droits (Mouslim 2470) ; le bandeau rouge est transmis par une autre voie. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée.",
        "status": "qualification",
        "externalUrl": "https://sunnah.com/muslim:2470",
        "hadithRef": "2470"
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 39",
        "externalUrl": "https://sunnah.com/muslim:2470",
        "hadithRef": "Hadith ou récit précisément référencé dans la notice",
        "grade": "sahih",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 11 ou 12 H",
        "externalUrl": "https://siyar.fr/livre/1/244",
        "hadithRef": "Siyar, figure 39",
        "status": "variant",
        "note": "Événement rapporté : La notice d'adh-Dhahabî rapporte sa mort à Al-Yamâma après avoir franchi le mur du jardin et s'être blessé. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 391,
        "title": "Prendre l'épée avec ses droits",
        "externalUrl": "https://sunnah.com/muslim:2470",
        "hadithRef": "Recueil cité : 2470",
        "status": "qualification",
        "note": "Anas rapporte dans Mouslim 2470 que le Prophète proposa son épée puis demanda qui accepterait toute la responsabilité qui s'y attachait. Abou Doujâna s'avança et la prit. Le texte ne contient pas nécessairement les paroles dramatisées des versions de sîra."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 392,
        "title": "La démarche et le bandeau rouge : réserve",
        "externalUrl": "https://dorar.net/h/Nb2x0gaa",
        "hadithRef": "Siyar ou répertoire : figure 39",
        "status": "variant",
        "note": "Une tradition mentionne un bandeau rouge et une démarche fière devant les lignes adverses. Al-Haythamî (Majma‘ az-Zawâ’id 6/112) signale que la chaîne comporte des personnes qu'il ne connaissait pas. Athar conserve la narration avec cette réserve explicite."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 393,
        "title": "Un cœur sans rancune selon Zayd ibn Aslam",
        "externalUrl": "https://gcp.islamweb.net/ar/library/index.php?ID=50&bk_no=60&flag=1&page=bookcontents",
        "hadithRef": "Siyar ou répertoire : figure 39",
        "status": "qualification",
        "note": "Adh-Dhahabî transmet d'après Zayd ibn Aslam qu'Abou Doujâna, malade, expliqua sa sérénité par son refus de parler inutilement et son cœur exempt de rancœur envers les musulmans. Aucun jugement de hadith n'est inventé."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 394,
        "title": "Al-Yamâma : un récit d'Anas",
        "externalUrl": "https://siyar.fr/livre/1/244",
        "hadithRef": "Siyar ou répertoire : figure 39",
        "status": "qualification",
        "note": "Selon le récit transmis d'Anas dans Siyar, Abou Doujâna fut projeté au-delà du mur du jardin à Al-Yamâma ; il se cassa la jambe et continua le combat jusqu'à sa mort. Ce récit historique est distinct du hadith de l'épée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/muslim:2470",
        "hadithRef": "Mouslim 2470",
        "grade": "sahih",
        "status": "located",
        "note": "Anas rapporte la prise de l'épée à Ouhoud et la demande de respecter ses droits.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 1,
        "category": "prophetic",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://dorar.net/h/Nb2x0gaa",
        "hadithRef": "At-Tabarânî 6508 ; Al-Haythamî, Majma‘ az-Zawâ’id 6/112 : transmetteurs inconnus de lui",
        "grade": "ungraded",
        "status": "qualification",
        "note": "Al-Haythamî dit : « Il y a dans cette chaîne des personnes que je ne connais pas. » Cette réserve est conservée.",
        "isnad": "Rapporteurs et avis à consulter dans le recueil ou la base liée ; aucune authentification originale par Athar."
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
    "reviewScope": "Références consultées et jugements attribués aux savants lorsqu'ils existent. Les récits historiques sans degré restent indiqués sans authentification indépendante par Athar.",
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
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "quote",
        "id": 0,
        "title": "Citation principale de la notice 40",
        "externalUrl": "https://sunnah.com/bukhari:4086",
        "hadithRef": "Hadith ou récit précisément référencé dans la notice",
        "grade": "sahih",
        "status": "qualification",
        "note": "Citation principale paraphrasée ou présentée comme attribution : consulter les références des traditions distinctes ci-dessous. Aucun classement n'est déduit par Athar.",
        "isnad": "Attribution liée à la source affichée ; la fiche ne prétend pas établir une nouvelle chaîne."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 0,
        "title": "Repère : 2 H",
        "externalUrl": "https://sunnah.com/bukhari:3045",
        "hadithRef": "3045",
        "status": "qualification",
        "note": "Événement rapporté : Al-Bukhârî 3045 rapporte que Khoubayb tua al-Hârith ibn ‘Âmir lors de Badr. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 1,
        "title": "Repère : 4 H selon les chroniques",
        "externalUrl": "https://sunnah.com/bukhari:4086",
        "hadithRef": "4086",
        "status": "qualification",
        "note": "Événement rapporté : Khoubayb fut capturé à l'expédition d'Ar-Rajî‘ ; le récit est présent dans Al-Bukhârî 3045 et 4086. Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "timeline",
        "id": 2,
        "title": "Repère : Après la captivité, date distincte inconnue",
        "externalUrl": "https://sunnah.com/bukhari:4086",
        "hadithRef": "4086",
        "status": "qualification",
        "note": "Événement rapporté : Conduit hors de la zone sacrée pour l'exécution, Khoubayb prie deux raka‘ât avant sa mort (Al-Bukhârî 4086). Le libellé ne suffit pas à transformer une période ou une variante en année historique vérifiée."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 401,
        "title": "Deux unités de prière avant l'exécution",
        "externalUrl": "https://sunnah.com/bukhari:4086",
        "hadithRef": "Recueil cité : 4086",
        "status": "qualification",
        "note": "Al-Bukhârî 4086 transmet que Khoubayb demanda à accomplir deux raka‘ât, puis dit qu'il aurait prié davantage s'il n'avait craint qu'on croie à sa peur de mourir. Le texte lui attribue le précédent de cette prière dans ces circonstances."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 402,
        "title": "Le raisin pendant la captivité",
        "externalUrl": "https://sunnah.com/bukhari:3045",
        "hadithRef": "Recueil cité : 3045",
        "status": "qualification",
        "note": "La fille d'al-Hârith témoigne avoir vu Khoubayb manger du raisin, bien qu'il fût enchaîné et que ce fruit n'eût pas été disponible à La Mecque. Elle y vit une faveur d'Allah ; ce témoignage est rapporté dans Al-Bukhârî 3045."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 403,
        "title": "Une invocation prononcée par Khoubayb",
        "externalUrl": "https://sunnah.com/bukhari:3045",
        "hadithRef": "Recueil cité : 3045",
        "status": "qualification",
        "note": "Al-Bukhârî transmet l'invocation et des vers récités par Khoubayb devant ses exécuteurs, où il exprime son acceptation du martyre. Ces paroles sont attribuées à Khoubayb, non au Prophète ﷺ."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 404,
        "title": "L'enfant et le rasoir",
        "externalUrl": "https://sunnah.com/bukhari:4086",
        "hadithRef": "Recueil cité : 4086",
        "status": "qualification",
        "note": "La même femme raconte avoir prêté un rasoir au prisonnier et trouvé son enfant sur ses genoux. Khoubayb la rassura : il ne ferait aucun mal au petit. Cette scène apparaît dans Al-Bukhârî 4086."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "narrative",
        "id": 405,
        "title": "L'embuscade après l'expédition d'Ar-Rajî‘",
        "externalUrl": "https://sunnah.com/bukhari:4086",
        "hadithRef": "Recueil cité : 4086",
        "status": "qualification",
        "note": "Selon Abou Hourayra dans Al-Bukhârî 4086, le groupe commandé par ‘Âsim ibn Thâbit fut poursuivi par des archers, et Khoubayb fut finalement capturé. Ce récit se distingue des épisodes ultérieurs de détention."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 0,
        "category": "historical",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:4086",
        "hadithRef": "Al-Bukhârî 4086",
        "grade": "sahih",
        "status": "located",
        "note": "Paroles et prière de Khoubayb transmises dans le Sahîh : il ne s'agit pas d'un propos prophétique.",
        "isnad": "Témoignage historique attribué au rapporteur cité, non nouvelle parole prophétique."
      },
      {
        "pdfPage": null,
        "printedPage": null,
        "kind": "hadith",
        "id": 1,
        "category": "historical",
        "title": "Tradition ou parole rapportée",
        "externalUrl": "https://sunnah.com/bukhari:3045",
        "hadithRef": "Al-Bukhârî 3045",
        "grade": "sahih",
        "status": "located",
        "note": "La fille d'al-Hârith raconte le prêt du rasoir et l'épisode de son enfant.",
        "isnad": "Témoignage historique attribué au rapporteur cité, non nouvelle parole prophétique."
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
