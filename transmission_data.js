// Fichier: js/data/transmission_data.js

// 1. LES THÈMES (Vital pour que les boutons s'affichent)
const SILSILA_THEMES = {
    hadith: { 
        label: "Hadiths",
        color: 'text-purple-600', 
        bg: 'bg-purple-50', 
        border: 'border-purple-200', 
        btn: 'bg-purple-600', 
        icon: 'scroll-text' 
    },
    fiqh: { 
        label: "Fiqh (Droit)",
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200', 
        btn: 'bg-emerald-600', 
        icon: 'scale' 
    },
    quran: { 
        label: "Lectures (Qira'at)",
        color: 'text-amber-600', 
        bg: 'bg-amber-50', 
        border: 'border-amber-200', 
        btn: 'bg-amber-600', 
        icon: 'book-open' 
    }
};

// 2. LES DONNÉES (Noeuds et Liens)
const SILSILA_DATA = {
    nodes: [
        // --- RACINES COMMUNES ---
        { id: 1, label: 'Le Prophète (ﷺ)', group: 'hadith', bio: "La source de toute science.", role: "Source" },
        { id: 2, label: 'Ibn Abbas', group: 'quran', bio: "L'interprète du Coran.", role: "Sahabi" },
        { id: 3, label: 'Ibn Omar', group: 'hadith', bio: "Le rigoureux dans le suivi.", role: "Sahabi" },
        { id: 4, label: 'Ibn Masoud', group: 'fiqh', bio: "Le juriste de l'Irak.", role: "Sahabi" },

        // --- BRANCHE FIQH (JURISPRUDENCE) ---
        { id: 10, label: 'Abu Hanifa', group: 'fiqh', bio: "L'Imam Al-A'zam. Fondateur de l'école Hanafite.", role: "Imam" },
        { id: 11, label: 'Imam Malik', group: 'fiqh', bio: "L'Imam de Médine. Auteur du Muwatta.", role: "Imam" },
        { id: 12, label: 'Imam Shafi\'i', group: 'fiqh', bio: "Le défenseur de la Sunnah.", role: "Imam" },
        { id: 13, label: 'Imam Ahmad', group: 'fiqh', bio: "L'Imam de la Sunnah.", role: "Imam" },
        { id: 14, label: 'Hammad', group: 'fiqh', bio: "Le maître d'Abu Hanifa.", role: "Tabi'i" },
        { id: 15, label: 'Ibrahim Al-Nakha\'i', group: 'fiqh', bio: "Le grand juriste de Koufa.", role: "Tabi'i" },

        // --- BRANCHE HADITH ---
        { id: 41, label: 'Al-Bukhari', group: 'hadith', bio: "L'auteur du Sahih.", role: "Hafiz" },
        { id: 42, label: 'Muslim', group: 'hadith', bio: "L'élève fidèle.", role: "Hafiz" },
        { id: 43, label: 'Abu Dawud', group: 'hadith', bio: "L'auteur des Sunan.", role: "Hafiz" },
        { id: 44, label: 'At-Tirmidhi', group: 'hadith', bio: "L'auteur du Jami'.", role: "Hafiz" },
        { id: 45, label: 'Ishaq ibn Rahwayh', group: 'hadith', bio: "Le maître de Bukhari.", role: "Cheikh" },

        // --- BRANCHE CORAN (LECTURES) ---
        { id: 60, label: 'Nafi', group: 'quran', bio: "Le lecteur de Médine.", role: "Qari" },
        { id: 61, label: 'Warsh', group: 'quran', bio: "L'élève égyptien de Nafi.", role: "Qari" },
        { id: 62, label: 'Qalun', group: 'quran', bio: "L'élève médinois de Nafi.", role: "Qari" },
        { id: 63, label: 'Asim', group: 'quran', bio: "Le lecteur de Koufa.", role: "Qari" },
        { id: 64, label: 'Hafs', group: 'quran', bio: "Le transmetteur le plus célèbre d'Asim.", role: "Qari" }
    ],
    edges: [
        // Fiqh
        { from: 1, to: 3 }, { from: 1, to: 4 },
        { from: 4, to: 15 }, // Ibn Masoud -> Ibrahim
        { from: 15, to: 14 }, // Ibrahim -> Hammad
        { from: 14, to: 10 }, // Hammad -> Abu Hanifa
        { from: 3, to: 11 }, // Ibn Omar (via Nafi) -> Malik
        { from: 11, to: 12 }, // Malik -> Shafi'i
        { from: 12, to: 13 }, // Shafi'i -> Ahmad

        // Hadith
        { from: 13, to: 41 }, // Ahmad -> Bukhari
        { from: 45, to: 41 }, // Ishaq -> Bukhari
        { from: 41, to: 42 }, // Bukhari -> Muslim
        { from: 41, to: 44 }, // Bukhari -> Tirmidhi

        // Coran
        { from: 3, to: 60 }, // Lien spirituel Médine -> Nafi
        { from: 60, to: 61 }, // Nafi -> Warsh
        { from: 60, to: 62 }, // Nafi -> Qalun
        { from: 4, to: 63 }, // Ibn Masoud -> Asim (chaine Koufa)
        { from: 63, to: 64 }  // Asim -> Hafs
    ]
};