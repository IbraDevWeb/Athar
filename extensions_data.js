// Fichier: extensions_data.js
const EXTENSIONS_DATA = {
    // --- GROUPE 1 : CORAN & LANGUE ---
    constellation: {
        title: "Constellation Coranique",
        icon: "network",
        desc: "Visualisation sémantique des concepts du Coran.",
        type: "visualizer",
        content: "Module de connexion des versets (En développement)"
    },
    eloquence: {
        title: "L'Éloquence Muette",
        icon: "mic-2",
        desc: "Les secrets rhétoriques des versets.",
        type: "text",
        content: []
    },
    roots: {
        title: "L'Arbre des Racines",
        icon: "sprout",
        desc: "Étymologie profonde des mots sacrés.",
        type: "interactive",
        data: []
    },
    scriptorium: {
        title: "Le Scriptorium",
        icon: "feather",
        desc: "L'histoire de l'écriture du Coran.",
        type: "gallery",
        data: []
    },
    diwan: {
        title: "Le Diwan Sonore",
        icon: "headphones",
        desc: "Poésie pré-islamique et des Compagnons.",
        type: "audio",
        data: []
    },

    // --- GROUPE 2 : HISTOIRE & TEMPS ---
    scholars_map: {
        title: "Atlas des Savants",
        icon: "globe",
        desc: "Les voyages de la quête du savoir (Rihla).",
        type: "map",
        data: []
    },
    mosque: {
        title: "La Mosquée Prophétique",
        icon: "landmark",
        desc: "Reconstitution 3D historique.",
        type: "3d",
        data: []
    },
    history_nights: {
        title: "Les Nuits de l'Histoire",
        icon: "moon",
        desc: "Récits audio immersifs.",
        type: "audio",
        data: []
    },
    isnad: {
        title: "La Chaîne d'Or",
        icon: "link",
        desc: "Visualiseur de chaînes de transmission.",
        type: "visualizer",
        data: []
    },
    currency: {
        title: "Dinar & Dirham",
        icon: "coins",
        desc: "Convertisseur de monnaie historique.",
        type: "tool",
        // Données fonctionnelles pour le convertisseur
        rates: { gold_gram: 60, silver_gram: 0.75, dinar_weight: 4.25, dirham_weight: 2.975 }
    },
    astronomy: {
        title: "Le Ciel des Anciens",
        icon: "star",
        desc: "Astronomie et horaires de prière.",
        type: "tool",
        data: []
    },

    // --- GROUPE 3 : RAISON & ESPRIT ---
    brahine: {
        title: "Al-Brahine",
        icon: "shield",
        desc: "Preuves rationnelles et certitude.",
        type: "text",
        data: []
    },
    faqih: {
        title: "L'Atelier du Faqih",
        icon: "gavel",
        desc: "Logique et fondements juridiques.",
        type: "interactive",
        data: []
    },
    balance: {
        title: "La Balance des Actions",
        icon: "scale",
        desc: "Éthique commerciale et Mu'amalat.",
        type: "quiz",
        data: []
    },
    memory: {
        title: "Palais de la Mémoire",
        icon: "brain-circuit",
        desc: "Techniques de mémorisation spatiale.",
        type: "tool",
        data: []
    }
};