// Répertoire des six recueils traditionnels de la Kutub as-Sitta.
// Les fichiers JSON sont indépendants et chargés uniquement à l'ouverture du recueil.
// Aucune donnée issue du corpus de hadiths actuel n'est attribuée automatiquement aux livres.
const ATHAR_KUTUB_SITTA = Object.freeze({
    version: 1,
    collections: [
        {
                "id": "bukhari",
                "name": "Sahîh al-Bukhârî",
                "arabicName": "صحيح البخاري",
                "compiler": "Imam al-Bukhârî",
                "type": "Sahîh",
                "description": "Recueil organisé en livres et chapitres.",
                "dataPath": "data/kutub-sitta/bukhari.json"
        },
        {
                "id": "muslim",
                "name": "Sahîh Muslim",
                "arabicName": "صحيح مسلم",
                "compiler": "Imam Muslim ibn al-Hajjâj",
                "type": "Sahîh",
                "description": "Recueil de hadiths classés par thèmes et transmissions.",
                "dataPath": "data/kutub-sitta/muslim.json"
        },
        {
                "id": "abu-dawud",
                "name": "Sunan Abou Dâwoud",
                "arabicName": "سنن أبي داود",
                "compiler": "Abou Dâwoud as-Sijistânî",
                "type": "Sunan",
                "description": "Recueil de traditions notamment organisées autour des questions juridiques.",
                "dataPath": "data/kutub-sitta/abu-dawud.json"
        },
        {
                "id": "tirmidhi",
                "name": "Jâmi‘ at-Tirmidhî",
                "arabicName": "جامع الترمذي",
                "compiler": "Imam at-Tirmidhî",
                "type": "Jâmi‘",
                "description": "Recueil accompagné de discussions et d’appréciations sur les traditions.",
                "dataPath": "data/kutub-sitta/tirmidhi.json"
        },
        {
                "id": "nasai",
                "name": "Sunan an-Nasâ’î",
                "arabicName": "سنن النسائي",
                "compiler": "Imam an-Nasâ’î",
                "type": "Sunan",
                "description": "Recueil de traditions organisé selon les sujets abordés.",
                "dataPath": "data/kutub-sitta/nasai.json"
        },
        {
                "id": "ibn-majah",
                "name": "Sunan Ibn Mâjah",
                "arabicName": "سنن ابن ماجه",
                "compiler": "Imam Ibn Mâjah",
                "type": "Sunan",
                "description": "Recueil de hadiths classés par chapitres thématiques.",
                "dataPath": "data/kutub-sitta/ibn-majah.json"
        }
]
});
