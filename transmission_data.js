// Fichier: js/data/transmission_data.js

// 1. Définition des Thèmes (Couleurs pour le graphe)
const SILSILA_THEMES = {
    hadith: { color: '#9b59b6', bg: 'bg-purple-100', border: 'border-purple-200', btn: 'bg-purple-600' },
    hanafi: { color: '#2ecc71', bg: 'bg-green-100', border: 'border-green-200', btn: 'bg-green-600' },
    maliki: { color: '#f1c40f', bg: 'bg-yellow-100', border: 'border-yellow-200', btn: 'bg-yellow-600' },
    shafii: { color: '#3498db', bg: 'bg-blue-100', border: 'border-blue-200', btn: 'bg-blue-600' },
    hanbali: { color: '#e74c3c', bg: 'bg-red-100', border: 'border-red-200', btn: 'bg-red-600' },
    pre: { color: '#95a5a6', bg: 'bg-gray-100', border: 'border-gray-200', btn: 'bg-gray-500' }
};

// 2. Les Données du Graphe (Nodes & Edges)
// Note: J'ai renommé 'scholarsData' en 'SILSILA_DATA' pour que app.js le trouve.
const SILSILA_DATA = {
    nodes: [
        // --- GÉNÉRATION 1 : TABI'UN ---
        { id: 1, label: 'Hammad b.\nAbi Sulayman', group: 'pre', shape: 'box', level: 1, bio: "Le pivot de l'école de la raison (Ahl al-Ra'y) à Koufa. Maître d'Abu Hanifa pendant 18 ans." },
        { id: 2, label: 'Nafi', group: 'pre', shape: 'box', level: 1, bio: "L'affranchi d'Ibn Umar. Le maillon de la 'Chaîne d'Or' (Silsilat al-Dhahab)." },
        { id: 3, label: 'Az-Zuhri', group: 'pre', shape: 'box', level: 1, bio: "Le premier à compiler officiellement les Hadiths sous l'ordre d'Umar ibn Abdul Aziz." },
        { id: 4, label: 'Ja\'far al-Sadiq', group: 'pre', shape: 'box', level: 1, bio: "Descendant du Prophète, respecté par toutes les écoles pour sa spiritualité et sa science." },
        { id: 12, label: 'Al-Awza\'i', group: 'pre', shape: 'box', level: 1, bio: "L'Imam de la Syrie et de Beyrouth." },
        { id: 13, label: 'Al-Layth', group: 'pre', shape: 'box', level: 1, bio: "L'Imam de l'Égypte. Shafi'i disait qu'il était plus savant que Malik." },
        { id: 14, label: 'Sufyan Thawri', group: 'pre', shape: 'box', level: 1, bio: "Le Prince des Croyants dans le Hadith." },

        // --- GÉNÉRATION 2 : FONDATEURS ---
        { id: 10, label: 'Abu Hanifa', group: 'hanafi', shape: 'star', size: 40, level: 2, bio: "L'Imam Al-A'zam. Fondateur de l'école Hanafite basée sur le Qiyas (analogie)." },
        { id: 11, label: 'Imam Malik', group: 'maliki', shape: 'star', size: 40, level: 2, bio: "L'Imam de Médine. Auteur du Muwatta. Il privilégiait la pratique des gens de Médine." },
        { id: 30, label: 'Imam Shafi\'i', group: 'shafii', shape: 'star', size: 40, level: 3, bio: "Le défenseur de la Sunnah. Il a réuni l'école du Hadith et l'école de la Raison." },
        { id: 40, label: 'Imam Ahmad', group: 'hanbali', shape: 'star', size: 40, level: 4, bio: "L'Imam de la Sunnah. Il a résisté à l'inquisition (Mihna) pour défendre le dogme." },

        // --- GÉNÉRATION 3 : ÉLÈVES ---
        { id: 20, label: 'Abu Yusuf', group: 'hanafi', level: 3, bio: "Le Juge Suprême (Qadi al-Qudat) qui a répandu l'école Hanafite." },
        { id: 21, label: 'Al-Shaybani', group: 'hanafi', level: 3, bio: "Le scribe de l'école Hanafite et professeur de Shafi'i." },
        { id: 23, label: 'Ibn al-Mubarak', group: 'pre', level: 3, bio: "Le savant combattant et ascète. Élève de Malik et Abu Hanifa." },
        { id: 24, label: 'Ibn al-Qasim', group: 'maliki', level: 3, bio: "Le transmetteur principal du Fiqh de Malik dans la Mudawwana." },

        // --- GÉNÉRATION 4 : LES MAÎTRES DU HADITH ---
        { id: 41, label: 'Al-Bukhari', group: 'hadith', shape: 'diamond', size: 30, level: 5, bio: "L'auteur du livre le plus authentique après le Coran." },
        { id: 42, label: 'Muslim', group: 'hadith', shape: 'diamond', size: 25, level: 5, bio: "L'élève fidèle de Bukhari et auteur du Sahih Muslim." },
        { id: 43, label: 'Abu Dawud', group: 'hadith', shape: 'diamond', level: 5, bio: "Auteur des Sunan, concentré sur les ahkam (lois)." },
        { id: 44, label: 'At-Tirmidhi', group: 'hadith', shape: 'diamond', level: 5, bio: "Auteur du Jami', connu pour son Fiqh comparé." },
        { id: 45, label: 'An-Nasa\'i', group: 'hadith', shape: 'diamond', level: 5, bio: "Très strict dans ses conditions d'acceptation." },
        { id: 31, label: 'Yahya b. Main', group: 'hadith', level: 4, bio: "Le grand critique des hommes (Jarh wa Ta'dil)." },
        { id: 33, label: 'Ishaq b. Rahwayh', group: 'hadith', level: 4, bio: "Il a suggéré à Bukhari de compiler le Sahih." }
    ],
    edges: [
        // Liens
        { from: 1, to: 10, arrows: 'to' }, // Hammad -> Abu Hanifa
        { from: 4, to: 10, dashes: true }, // Jafar -> Abu Hanifa
        { from: 4, to: 11, dashes: true }, // Jafar -> Malik
        { from: 2, to: 11, width: 2, color: { color: 'gold' } }, // Nafi -> Malik (Chaine d'or)
        { from: 3, to: 11 }, // Zuhri -> Malik
        
        { from: 10, to: 20 }, // Abu Hanifa -> Abu Yusuf
        { from: 10, to: 21 }, // Abu Hanifa -> Shaybani
        { from: 10, to: 23 }, // Abu Hanifa -> Ibn Mubarak
        
        { from: 11, to: 21 }, // Malik -> Shaybani
        { from: 11, to: 30, width: 2 }, // Malik -> Shafi'i
        { from: 11, to: 24 }, // Malik -> Ibn Qasim
        { from: 11, to: 23 }, // Malik -> Ibn Mubarak
        
        { from: 21, to: 30, dashes: true }, // Shaybani -> Shafi'i
        
        { from: 30, to: 40, width: 2 }, // Shafi'i -> Ahmad
        
        { from: 40, to: 41 }, // Ahmad -> Bukhari
        { from: 40, to: 42 }, // Ahmad -> Muslim
        { from: 40, to: 43 }, // Ahmad -> Abu Dawud
        
        { from: 31, to: 40, dashes: true }, // Yahya -> Ahmad (Amis)
        { from: 33, to: 41 }, // Ishaq -> Bukhari
        { from: 41, to: 42, width: 2 }, // Bukhari -> Muslim
        { from: 41, to: 44 } // Bukhari -> Tirmidhi
    ]
};