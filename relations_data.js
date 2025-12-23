const RELATIONS_DATA = {
    nodes: [
        { id: 1, label: "Abu Bakr", group: "calife" },
        { id: 2, label: "Umar", group: "calife" },
        { id: 3, label: "Uthman", group: "calife" },
        { id: 4, label: "Ali", group: "calife" },
        { id: 5, label: "Aïcha", group: "family" },
        { id: 6, label: "Bilal", group: "sahaba" },
        { id: 7, label: "Ibn Mas'ud", group: "scholar" }
    ],
    edges: [
        { from: 1, to: 2, label: "Conseiller" },
        { from: 1, to: 5, label: "Père" },
        { from: 4, to: 5, label: "Conflit (Chameau)", dashes: true, color: "red" },
        { from: 2, to: 3, label: "Succession" },
        { from: 3, to: 4, label: "Succession" }
    ]
};