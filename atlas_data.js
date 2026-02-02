/**
 * AtharPro - Atlas Data (Version Corrigée & Optimisée)
 * Contient 122 lieux majeurs de l'ère Prophétique et des Compagnons.
 * Correctif : Format des images nettoyé (suppression du Markdown).
 */

const atlasLocations = [
    // --- VILLES SAINTES & LIEUX CULTES ---
    {
        id: 1,
        name: "La Mecque (Makkah)",
        type: "ville",
        coords: [21.4225, 39.8262],
        desc: "La Mère des Cités, lieu de naissance du Prophète (ﷺ). Elle abrite la Kaaba, direction de prière (Qibla). C'est le cœur battant de l'Islam.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Abu Bakr As-Siddiq", "Khadija bint Khuwaylid", "Bilal ibn Rabah"],
        image: "https://images.unsplash.com/photo-1537248386873-625841682705?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Médine (Al-Madinah)",
        type: "ville",
        coords: [24.4672, 39.6108],
        desc: "Al-Madinah Al-Munawwarah, refuge des Muhajirun et première capitale de l'État islamique. Elle abrite la Mosquée du Prophète (ﷺ).",
        figures: ["Le Prophète Muhammad (ﷺ)", "Umar ibn Al-Khattab", "Aisha bint Abi Bakr", "Salman Al-Farisi"],
        image: "https://images.unsplash.com/photo-1531256379416-9f000e90aacc?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Masjid Al-Aqsa (Jérusalem)",
        type: "ville",
        coords: [31.7761, 35.2358],
        desc: "La première Qibla et le lieu de l'Ascension Nocturne (Al-Isra wal-Mi'raj). Conquise pacifiquement sous le califat d'Umar.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Umar ibn Al-Khattab", "Abu Ubaydah ibn al-Jarrah"],
        image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Masjid Quba",
        type: "monument",
        coords: [24.4392, 39.6173],
        desc: "La première mosquée bâtie par le Prophète (ﷺ) à son arrivée de l'Hégire. Une prière y équivaut à une Omra.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Comagnons de Quba"],
        image: "https://images.unsplash.com/photo-1580418827493-f2b22c438536?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Masjid Al-Qiblatayn",
        type: "monument",
        coords: [24.4843, 39.5794],
        desc: "La Mosquée des Deux Qiblas. C'est ici que le verset ordonnant le changement de direction vers la Mecque fut révélé en pleine prière.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Bishr ibn Bara"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Masjid_Qiblatain.jpg/640px-Masjid_Qiblatain.jpg"
    },

    // --- SITES CLÉS DE LA SIRA (MECQUE) ---
    {
        id: 6,
        name: "Grotte de Hira (Jabal Al-Nour)",
        type: "monument",
        year: 1, 
        coords: [21.4563, 39.8584],
        desc: "Le lieu de la toute première révélation du Coran (Sourate Al-Alaq) par l'archange Jibril.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Jibril (Alayhi Salam)"],
        image: "https://images.unsplash.com/photo-1647849649557-417d3d0f0d2c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "Grotte de Thawr",
        type: "monument",
        year: 1,
        coords: [21.3768, 39.8452],
        desc: "Le refuge du Prophète (ﷺ) et d'Abu Bakr pendant 3 jours lors de l'Hégire, échappant aux poursuivants de Quraysh.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Abu Bakr As-Siddiq", "Asma bint Abi Bakr"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jabal_Thawr.jpg/640px-Jabal_Thawr.jpg"
    },
    {
        id: 8,
        name: "Dar Al-Arqam",
        type: "monument",
        year: 1,
        coords: [21.4240, 39.8270],
        desc: "Le premier centre de formation secret de l'Islam, situé au pied du mont Safa, où les premiers compagnons apprenaient le Coran.",
        figures: ["Al-Arqam ibn Abi Al-Arqam", "Les premiers convertis"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Safa_Marwah.jpg/640px-Safa_Marwah.jpg"
    },
    {
        id: 9,
        name: "Mina",
        type: "ville",
        year: 10,
        coords: [21.4161, 39.8858],
        desc: "La ville des tentes. Lieu important du Hajj et site des serments d'allégeance d'Aqabah qui ont précédé l'Hégire.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Les 12 Naqibs"],
        image: "https://images.unsplash.com/photo-1565613368222-2975949d012d?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 10,
        name: "Mont Arafat",
        type: "monument",
        year: 10,
        coords: [21.3549, 39.9840],
        desc: "Le lieu du pardon. Le Prophète (ﷺ) y prononça son célèbre sermon d'adieu (An 10 H), parachevant la religion.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Bilal ibn Rabah"],
        image: "https://images.unsplash.com/photo-1596700813303-39f8df59d3e8?q=80&w=600&auto=format&fit=crop"
    },

    // --- GRANDES BATAILLES ---
    {
        id: 11,
        name: "Badr",
        type: "bataille",
        year: 2,
        coords: [23.7753, 38.7919],
        desc: "Le Jour du Discernement (An 2 H). 313 musulmans remportèrent une victoire miraculeuse contre 1000 Qurayshites.",
        figures: ["Hamza ibn Abd al-Muttalib", "Ali ibn Abi Talib", "Abu Ubaydah"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Badr_Battlefield.jpg/640px-Badr_Battlefield.jpg"
    },
    {
        id: 12,
        name: "Mont Uhud",
        type: "bataille",
        year: 3,
        coords: [24.5034, 39.6117],
        desc: "Bataille éprouvante (An 3 H). Hamza y tomba en martyr. Une leçon sur l'importance d'obéir aux ordres du Prophète.",
        figures: ["Hamza ibn Abd al-Muttalib", "Mus'ab ibn Umayr", "Khalid ibn Walid (Côté Quraysh)"],
        image: "https://images.unsplash.com/photo-1565552632230-67c0388e4040?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 13,
        name: "Le Fossé (Al-Khandaq)",
        type: "bataille",
        year: 5,
        coords: [24.4750, 39.5950],
        desc: "Siège de Médine (An 5 H). Sur conseil de Salman, un fossé fut creusé pour protéger la ville contre 10 000 coalisés.",
        figures: ["Salman Al-Farisi", "Ali ibn Abi Talib", "Hudhayfah ibn al-Yaman"],
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Seven_Mosques.jpg"
    },
    {
        id: 14,
        name: "Khaybar",
        type: "bataille",
        year: 7,
        coords: [25.6948, 39.2905],
        desc: "Conquête des forteresses au nord de Médine (An 7 H). Ali ibn Abi Talib y montra une force légendaire.",
        figures: ["Ali ibn Abi Talib", "Jafar ibn Abi Talib"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Khaybar_Fortress.jpg/640px-Khaybar_Fortress.jpg"
    },
    {
        id: 15,
        name: "Mu'tah",
        type: "bataille",
        year: 8,
        coords: [31.0667, 35.7000],
        desc: "Première confrontation avec les Romains (An 8 H). Khalid ibn Walid y gagna son titre de 'Sabre d'Allah'.",
        figures: ["Zayd ibn Harithah", "Jafar ibn Abi Talib", "Abdullah ibn Rawahah", "Khalid ibn Walid"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mutah_Battle_Field.jpg/640px-Mutah_Battle_Field.jpg"
    },
    {
        id: 16,
        name: "Hunayn",
        type: "bataille",
        year: 8,
        coords: [21.4333, 39.9667],
        desc: "Bataille survenue juste après la conquête de la Mecque (An 8 H). Une leçon divine sur le danger de l'orgueil du nombre.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Abbas ibn Abd al-Muttalib"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hunayn_valley.jpg/640px-Hunayn_valley.jpg"
    },
    {
        id: 17,
        name: "Tabuk",
        type: "bataille",
        year: 9,
        coords: [28.3833, 36.5667],
        desc: "Dernière expédition militaire du Prophète (An 9 H), marquée par une grande chaleur et l'épreuve de la foi.",
        figures: ["Uthman ibn Affan", "Ka'b ibn Malik"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Tabuk_castle.jpg/640px-Tabuk_castle.jpg"
    },
    {
        id: 18,
        name: "Yarmouk",
        type: "bataille",
        year: 15,
        coords: [32.8143, 35.9540],
        desc: "Bataille décisive (An 15 H) contre l'Empire Byzantin. La stratégie de Khalid ibn Walid y fut brillante.",
        figures: ["Khalid ibn Walid", "Abu Ubaydah ibn al-Jarrah", "Ikrimah ibn Abi Jahl"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yarmouk_Valley.jpg/640px-Yarmouk_Valley.jpg"
    },
    {
        id: 19,
        name: "Al-Qadisiyyah",
        type: "bataille",
        year: 15,
        coords: [31.5790, 44.5000],
        desc: "Victoire majeure (An 15 H) contre l'Empire Perse Sassanide, ouvrant la porte à l'Islam en Perse.",
        figures: ["Sa'd ibn Abi Waqqas", "Al-Muthanna ibn Haritha"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Qadisiyyah.jpg/640px-Qadisiyyah.jpg"
    },

    // --- LIEUX POLITIQUES ET ÉVÉNEMENTS ---
    {
        id: 20,
        name: "Al-Hudaibiyah",
        type: "ville",
        year: 6,
        coords: [21.4420, 39.6300],
        desc: "Lieu du pacte de paix historique (An 6 H) et du serment de Ridwan sous l'arbre.",
        figures: ["Uthman ibn Affan", "Suhayl ibn Amr", "Umar ibn Al-Khattab"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Hudaibiyah.jpg/640px-Hudaibiyah.jpg"
    },
    {
        id: 21,
        name: "Thaqifah Bani Sa'idah",
        type: "monument",
        year: 11,
        coords: [24.4690, 39.6080],
        desc: "Jardin à Médine où les Compagnons élurent Abu Bakr comme premier Calife (An 11 H).",
        figures: ["Abu Bakr As-Siddiq", "Umar ibn Al-Khattab", "Abu Ubaydah"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Saqifah_Garden.jpg/640px-Saqifah_Garden.jpg"
    },
    {
        id: 22,
        name: "Abyssinie (Habasha)",
        type: "ville",
        year: 1, 
        coords: [13.7900, 39.5400],
        desc: "Terre du premier exil. Le roi juste, le Négus, protégea les musulmans persécutés par Quraysh.",
        figures: ["Jafar ibn Abi Talib", "Umm Salama", "Le Négus (Ashama)"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Negash_Mosque.jpg/640px-Negash_Mosque.jpg"
    },
    {
        id: 23,
        name: "Taïf",
        type: "ville",
        year: 8,
        coords: [21.2841, 40.4248],
        desc: "Ville des Thaqif. Assiégée en l'an 8 H, elle embrassa l'Islam plus tard par la diplomatie.",
        figures: ["Zayd ibn Harithah", "Addas"],
        image: "https://images.unsplash.com/photo-1597908868369-6d6349d44c61?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 24,
        name: "Jannat al-Baqi",
        type: "monument",
        year: 1,
        coords: [24.4670, 39.6140],
        desc: "Le cimetière de Médine. 10 000 compagnons y reposent, dont Uthman, les épouses et les filles du Prophète.",
        figures: ["Uthman ibn Affan", "Fatima bint Muhammad", "Hasan ibn Ali"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Al-Baqi_Cemetery.jpg/640px-Al-Baqi_Cemetery.jpg"
    },

    // --- CONQUÊTES & LIEUX ÉLOIGNÉS ---
    {
        id: 25,
        name: "Al-Yamamah",
        type: "bataille",
        year: 11,
        coords: [24.1300, 47.3000],
        desc: "Bataille sanglante contre l'imposteur Musaylima (An 11 H). Beaucoup de mémorisateurs du Coran y périrent.",
        figures: ["Khalid ibn Walid", "Wahshi ibn Harb", "Salim Mawla Abi Hudhayfa"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Desert_Arabia.jpg/640px-Desert_Arabia.jpg"
    },
    {
        id: 26,
        name: "Ctésiphon (Al-Mada'in)",
        type: "ville",
        year: 16,
        coords: [33.0936, 44.5808],
        desc: "Capitale de l'Empire Perse, conquise par Sa'd ibn Abi Waqqas (An 16 H).",
        figures: ["Sa'd ibn Abi Waqqas", "Salman Al-Farisi (Gouverneur)"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Taq_Kasra_2017.jpg/640px-Taq_Kasra_2017.jpg"
    },
    {
        id: 27,
        name: "Damas",
        type: "ville",
        year: 14,
        coords: [33.5138, 36.2765],
        desc: "Première grande ville byzantine conquise (An 14 H). Khalid entra par une porte par la force, Abu Ubaydah par l'autre par la paix.",
        figures: ["Khalid ibn Walid", "Abu Ubaydah ibn al-Jarrah"],
        image: "https://images.unsplash.com/photo-1554418641-6e3e5c9b6b7a?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 28,
        name: "Fustat (Égypte)",
        type: "ville",
        year: 20,
        coords: [30.0055, 31.2267],
        desc: "Le camp fondé par Amr ibn al-As après la conquête de l'Égypte (An 20 H).",
        figures: ["Amr ibn al-As", "Zubayr ibn al-Awwam"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Amr_Ibn_Al-As_Mosque.jpg/640px-Amr_Ibn_Al-As_Mosque.jpg"
    },
    {
        id: 29,
        name: "Najran",
        type: "ville",
        year: 9,
        coords: [17.4917, 44.1322],
        desc: "Région chrétienne au sud. Une délégation vint discuter avec le Prophète (ﷺ) en l'an 9 H.",
        figures: ["Ali ibn Abi Talib", "Abu Ubaydah (Juge envoyé)"],
        image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 30,
        name: "Ji'ranah",
        type: "ville",
        year: 8,
        coords: [21.5600, 39.9200],
        desc: "Lieu où le Prophète (ﷺ) partagea le butin après Hunayn (An 8 H).",
        figures: ["Le Prophète Muhammad (ﷺ)"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Mecca_Mountains.jpg/640px-Mecca_Mountains.jpg"
    },
    {
        id: 31,
        name: "Sana'a (Yémen)",
        type: "ville",
        year: 10,
        coords: [15.3694, 44.1910],
        desc: "La grande mosquée de Sana'a fut construite sur ordre du Prophète (ﷺ). Muadh ibn Jabal y fut envoyé.",
        figures: ["Muadh ibn Jabal", "Ali ibn Abi Talib"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Old_City_of_Sanaa.jpg/640px-Old_City_of_Sanaa.jpg"
    },
    {
        id: 32,
        name: "Aqabah (Lieu des Serments)",
        type: "ville",
        year: 1, 
        coords: [21.4190, 39.8890],
        desc: "Lieu secret où les Ansar de Médine prêtèrent allégeance au Prophète (ﷺ) avant l'Hégire.",
        figures: ["Mus'ab ibn Umayr", "As'ad ibn Zurarah"],
        image: "https://images.unsplash.com/photo-1628761227091-628464654922?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 33,
        name: "Al-Abwa",
        type: "ville",
        year: 2,
        coords: [23.1094, 39.0967],
        desc: "Lieu où repose Amina, la mère du Prophète (ﷺ). Site de la première expédition militaire (An 2 H).",
        figures: ["Le Prophète Muhammad (ﷺ)", "Amina bint Wahb"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Saudi_Arabia_Abwa_Mountain.jpg/640px-Saudi_Arabia_Abwa_Mountain.jpg"
    },
    {
        id: 34,
        name: "Cimetière Al-Ma'la",
        type: "monument",
        year: 1,
        coords: [21.4300, 39.8300],
        desc: "Cimetière de La Mecque où repose Khadija (qu'Allah l'agrée).",
        figures: ["Khadija bint Khuwaylid", "Abdullah ibn Zubayr"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Al-Ma%27la_Cemetery.jpg/640px-Al-Ma%27la_Cemetery.jpg"
    },
    {
        id: 35,
        name: "Masjid al-Jinn",
        type: "monument",
        year: 1,
        coords: [21.4330, 39.8280],
        desc: "Lieu où des djinns écoutèrent le Coran et embrassèrent l'Islam (Période Mecquoise).",
        figures: ["Le Prophète Muhammad (ﷺ)", "Abdullah ibn Masud"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Masjid_al_Jinn.jpg/640px-Masjid_al_Jinn.jpg"
    },
    {
        id: 36,
        name: "Puits de Ruma",
        type: "monument",
        year: 3,
        coords: [24.4860, 39.5850],
        desc: "Le puits acheté par Uthman ibn Affan pour l'offrir aux musulmans. Une aumône continue (Sadaqa Jariya).",
        figures: ["Uthman ibn Affan"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bir_Rumah.jpg/640px-Bir_Rumah.jpg"
    },
    {
        id: 37,
        name: "Hamra al-Asad",
        type: "bataille",
        year: 3,
        coords: [24.3800, 39.5500],
        desc: "Expédition punitive menée juste après la défaite d'Uhud (An 3 H) pour dissuader Quraysh.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Abu Bakr As-Siddiq"],
        image: "https://images.unsplash.com/photo-1548259453-659f7b055964?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 38,
        name: "Fadak",
        type: "ville",
        year: 7,
        coords: [26.0000, 39.5000],
        desc: "Oasis fertile acquise pacifiquement par les musulmans après Khaybar (An 7 H).",
        figures: ["Fatima bint Muhammad", "Le Prophète Muhammad (ﷺ)"],
        image: "https://images.unsplash.com/photo-1590059530088-349f7e497576?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 39,
        name: "Dhu Al-Hulayfah (Bir Ali)",
        type: "monument",
        year: 10,
        coords: [24.4100, 39.5500],
        desc: "Le Miqat de Médine. C'est d'ici que le Prophète partit pour le Hajj d'Adieu (An 10 H).",
        figures: ["Le Prophète Muhammad (ﷺ)"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Miqat_Mosque.jpg/640px-Miqat_Mosque.jpg"
    },
    {
        id: 40,
        name: "Forteresse des Banu Qurayzah",
        type: "bataille",
        year: 5,
        coords: [24.4400, 39.6300],
        desc: "Lieu du siège final (An 5 H) contre la tribu qui avait trahi le pacte lors du Fossé.",
        figures: ["Sa'd ibn Mu'adh", "Ali ibn Abi Talib"],
        image: "https://images.unsplash.com/photo-1575888062896-7517909c2565?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 41,
        name: "Dumat al-Jandal",
        type: "bataille",
        year: 5,
        coords: [29.8130, 39.8680],
        desc: "Forteresse stratégique au nord, ciblée par plusieurs expéditions (An 5 H, puis 9 H).",
        figures: ["Khalid ibn Walid", "Abdur Rahman ibn Awf"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Marid_Castle.jpg/640px-Marid_Castle.jpg"
    },
    {
        id: 42,
        name: "Koufa (Kufa)",
        type: "ville",
        year: 17,
        coords: [32.0300, 44.4000],
        desc: "Ville de garnison fondée par Sa'd ibn Abi Waqqas (An 17 H). Future capitale d'Ali.",
        figures: ["Ali ibn Abi Talib", "Sa'd ibn Abi Waqqas", "Abdullah ibn Masud"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Great_Mosque_of_Kufa.jpg/640px-Great_Mosque_of_Kufa.jpg"
    },
    {
        id: 43,
        name: "Bassora (Basra)",
        type: "ville",
        year: 14,
        coords: [30.5080, 47.7800],
        desc: "Première ville islamique construite hors d'Arabie (An 14 H).",
        figures: ["Utbah ibn Ghazwan", "Abu Musa Al-Ash'ari"],
        image: "https://images.unsplash.com/photo-1591888981686-b4d4f8266205?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 44,
        name: "Bataille du Pont (Al-Jisr)",
        type: "bataille",
        year: 13,
        coords: [32.0500, 44.4500],
        desc: "Défaite douloureuse contre les Perses et leurs éléphants (An 13 H).",
        figures: ["Abu Ubayd al-Thaqafi", "Al-Muthanna ibn Haritha"],
        image: "https://images.unsplash.com/photo-1550952047-b70d49410168?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 45,
        name: "Nihawand",
        type: "bataille",
        year: 21,
        coords: [34.1900, 48.3700],
        desc: "La 'Victoire des Victoires' (An 21 H). Effondrement définitif de l'Empire Sassanide.",
        figures: ["Nu'man ibn Muqarrin", "Hudhayfah ibn al-Yaman"],
        image: "https://images.unsplash.com/photo-1627814420068-d05541571d47?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 46,
        name: "Al-Anbar",
        type: "bataille",
        year: 12,
        coords: [33.3500, 43.4200],
        desc: "La 'Bataille de l'Œil' (An 12 H). Khalid ibn Walid y fit preuve de génie militaire.",
        figures: ["Khalid ibn Walid"],
        image: "https://images.unsplash.com/photo-1518241778946-8c43093229b4?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 47,
        name: "Tustar",
        type: "bataille",
        year: 20,
        coords: [32.0400, 48.8500],
        desc: "Siège d'une forteresse perse (An 20 H). Infiltration par les canalisations d'eau.",
        figures: ["Abu Musa Al-Ash'ari", "Al-Bara ibn Malik (Martyr)"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Shushtar_Historical_Hydraulic_System.jpg/640px-Shushtar_Historical_Hydraulic_System.jpg"
    },
    {
        id: 48,
        name: "Ajnadayn",
        type: "bataille",
        year: 13,
        coords: [31.6800, 34.9600],
        desc: "Première grande bataille rangée contre les Byzantins en Palestine (An 13 H).",
        figures: ["Amr ibn al-As", "Khalid ibn Walid"],
        image: "https://images.unsplash.com/photo-1473180238804-032904535316?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 49,
        name: "Homs (Emesa)",
        type: "ville",
        year: 14,
        coords: [34.7300, 36.7100],
        desc: "Centre stratégique syrien conquis en 14 H. Khalid ibn Walid y est enterré.",
        figures: ["Khalid ibn Walid", "Abu Ubaydah ibn al-Jarrah"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Khalid_ibn_al-Walid_Mosque.jpg/640px-Khalid_ibn_al-Walid_Mosque.jpg"
    },
    {
        id: 50,
        name: "Bayt Jibrin",
        type: "ville",
        year: 13,
        coords: [31.6000, 34.9000],
        desc: "Lieu stratégique en Palestine conquis par Amr ibn al-As.",
        figures: ["Amr ibn al-As"],
        image: "https://images.unsplash.com/photo-1461695008521-124976450143?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 51,
        name: "Babylone (Égypte)",
        type: "bataille",
        year: 20,
        coords: [30.0000, 31.2300],
        desc: "Forteresse romaine clé dont la chute (An 20 H) marqua la perte de l'Égypte pour Byzance.",
        figures: ["Amr ibn al-As", "Zubayr ibn al-Awwam"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Babylon_Fortress_Cairo.jpg/640px-Babylon_Fortress_Cairo.jpg"
    },
    {
        id: 52,
        name: "Alexandrie",
        type: "ville",
        year: 21,
        coords: [31.2000, 29.9100],
        desc: "La perle de la Méditerranée, conquise par Amr ibn al-As en 21 H.",
        figures: ["Amr ibn al-As", "Ubadah ibn al-Samit"],
        image: "https://images.unsplash.com/photo-1563297129-e882a1380907?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 53,
        name: "Barqa (Cyrénaïque)",
        type: "ville",
        year: 22,
        coords: [32.5000, 20.9000],
        desc: "Première expansion en Afrique du Nord (Libye, An 22 H).",
        figures: ["Amr ibn al-As", "Uqba ibn Nafi"],
        image: "https://images.unsplash.com/photo-1549646002-3114d59a8c08?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 54,
        name: "Chypre (Qubrus)",
        type: "bataille",
        year: 28,
        coords: [35.1800, 33.3800],
        desc: "Première expédition navale majeure (An 28 H) sous Uthman. Umm Haram y mourut martyre.",
        figures: ["Muawiya ibn Abi Sufyan", "Umm Haram bint Milhan"],
        image: "https://images.unsplash.com/photo-1528659856750-62157778ce35?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 55,
        name: "Hélipolis (Ayn Shams)",
        type: "bataille",
        year: 19,
        coords: [30.1300, 31.3100],
        desc: "Bataille décisive en plein champ en Égypte (An 19 H).",
        figures: ["Amr ibn al-As", "Zubayr ibn al-Awwam"],
        image: "https://images.unsplash.com/photo-1627568285521-b1e62c140df9?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 56,
        name: "Bataille du Chameau (Al-Jamal)",
        type: "bataille",
        year: 36,
        coords: [30.4000, 47.7000],
        desc: "Tragique confrontation (An 36 H) marquant le début de la grande discorde.",
        figures: ["Ali ibn Abi Talib", "Aisha bint Abi Bakr", "Talha", "Zubayr"],
        image: "https://images.unsplash.com/photo-1516216628259-2225e9668799?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 57,
        name: "Siffin",
        type: "bataille",
        year: 37,
        coords: [35.9500, 39.0100],
        desc: "Confrontation majeure entre Ali et Muawiya (An 37 H).",
        figures: ["Ali ibn Abi Talib", "Muawiya ibn Abi Sufyan", "Ammar ibn Yasir"],
        image: "https://images.unsplash.com/photo-1548680879-63304526d833?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 58,
        name: "Nahrawan",
        type: "bataille",
        year: 38,
        coords: [33.3100, 44.7500],
        desc: "Bataille menée par Ali contre les Kharijites (An 38 H).",
        figures: ["Ali ibn Abi Talib"],
        image: "https://images.unsplash.com/photo-1560934448-6d2c0d51c72e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 59,
        name: "Rayy (Téhéran)",
        type: "ville",
        year: 22,
        coords: [35.6000, 51.4000],
        desc: "Ancienne cité stratégique de Perse conquise sous Omar (An 22 H).",
        figures: ["Nu'aym ibn Muqarrin"],
        image: "https://images.unsplash.com/photo-1570183182878-502a9193792b?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 60,
        name: "Dabiq",
        type: "ville",
        year: 15,
        coords: [36.5000, 37.2500],
        desc: "Lieu symbolique au nord d'Alep, zone de confrontation avec les Byzantins.",
        figures: ["Abu Ubaydah ibn al-Jarrah"],
        image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 61,
        name: "Oman (Sohar)",
        type: "ville",
        year: 8,
        coords: [24.3600, 56.7000],
        desc: "Acceptation pacifique de l'Islam suite à une lettre du Prophète (An 8 H).",
        figures: ["Amr ibn al-As (Envoyé)"],
        image: "https://images.unsplash.com/photo-1588785899732-4d2222d667c4?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 62,
        name: "Al-Yamamah (Jardin de la Mort)",
        type: "bataille",
        year: 11,
        coords: [24.7000, 46.7000],
        desc: "Le jardin fortifié où Musaylima fut vaincu (An 11 H).",
        figures: ["Wahshi ibn Harb", "Al-Bara ibn Malik"],
        image: "https://images.unsplash.com/photo-1605649988587-160655866164?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 63,
        name: "Muzdalifa",
        type: "monument",
        year: 10,
        coords: [21.3891, 39.9042],
        desc: "Étape sacrée du Hajj. Le Prophète (ﷺ) y a passé la nuit lors du Hajj d'Adieu.",
        figures: ["Le Prophète Muhammad (ﷺ)"],
        image: "https://images.unsplash.com/photo-1534065639144-6725225c94e8?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 64,
        name: "Wadi Muhassar",
        type: "monument",
        year: 1, 
        coords: [21.3980, 39.8850],
        desc: "La vallée maudite où l'armée d'Abraha fut détruite.",
        figures: ["Le Prophète Muhammad (ﷺ)"],
        image: "https://images.unsplash.com/photo-1452457807411-4979b707c588?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 65,
        name: "Masjid al-Ghamama",
        type: "monument",
        year: 4,
        coords: [24.4660, 39.6050],
        desc: "Lieu de la prière pour la pluie (Salat al-Istisqa) à Médine.",
        figures: ["Le Prophète Muhammad (ﷺ)"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ghamama_Mosque.jpg/640px-Ghamama_Mosque.jpg"
    },
    {
        id: 66,
        name: "Le Jardin de Salman",
        type: "monument",
        year: 4, 
        coords: [24.4900, 39.6300],
        desc: "Jardin où le Prophète (ﷺ) planta 300 palmiers pour l'affranchissement de Salman.",
        figures: ["Salman Al-Farisi", "Le Prophète Muhammad (ﷺ)"],
        image: "https://images.unsplash.com/photo-1505562722137-9753e1a8a25a?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 67,
        name: "Wadi Al-Aqiq",
        type: "monument",
        year: 1,
        coords: [24.4500, 39.5500],
        desc: "La 'Vallée Bénie' à l'ouest de Médine.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Aisha bint Abi Bakr"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Wadi_Aqiq.jpg/640px-Wadi_Aqiq.jpg"
    },
    {
        id: 68,
        name: "Bir Ma'una",
        type: "bataille",
        year: 4,
        coords: [24.8000, 40.5000],
        desc: "Lieu d'une terrible trahison où 70 lecteurs du Coran furent massacrés (An 4 H).",
        figures: ["Anas ibn Malik", "Haram ibn Milhan"],
        image: "https://images.unsplash.com/photo-1544979590-37e9b47cd705?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 69,
        name: "Al-Muraysi' (Banu Mustaliq)",
        type: "bataille",
        year: 6,
        coords: [22.2500, 39.3000],
        desc: "Bataille (An 6 H) liée à l'incident de la calomnie (Ifk) contre Aisha.",
        figures: ["Juwayriya bint al-Harith", "Aisha bint Abi Bakr"],
        image: "https://images.unsplash.com/photo-1548259453-659f7b055964?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 70,
        name: "Dhat al-Riqa",
        type: "bataille",
        year: 4,
        coords: [25.1000, 40.1000],
        desc: "Expédition des 'Loques'. C'est là que la prière de la peur fut instituée.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Abu Musa Al-Ash'ari"],
        image: "https://images.unsplash.com/photo-1605649988587-160655866164?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 71,
        name: "Wadi al-Qura",
        type: "ville",
        year: 7,
        coords: [26.6000, 37.9000],
        desc: "Vallée fertile conquise après Khaybar (An 7 H).",
        figures: ["Le Prophète Muhammad (ﷺ)", "Khalid ibn Walid"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Al_Ula_View.jpg/640px-Al_Ula_View.jpg"
    },
    {
        id: 72,
        name: "Mada'in Saleh (Al-Hijr)",
        type: "monument",
        year: 9, 
        coords: [26.8000, 37.9500],
        desc: "La cité maudite des Thamud, traversée lors de l'expédition de Tabuk.",
        figures: ["Le Prophète Muhammad (ﷺ)"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mada%27in_Saleh.jpg/640px-Mada%27in_Saleh.jpg"
    },
    {
        id: 73,
        name: "Masjid al-Fath",
        type: "monument",
        year: 5,
        coords: [24.4780, 39.5930],
        desc: "Site du Fossé où le Prophète (ﷺ) a invoqué Allah pour la victoire.",
        figures: ["Le Prophète Muhammad (ﷺ)", "Jabir ibn Abdullah"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Seven_Mosques.jpg/640px-Seven_Mosques.jpg"
    },
    {
        id: 74,
        name: "Al-Hira",
        type: "ville",
        year: 12,
        coords: [31.8800, 44.3500],
        desc: "Ancienne capitale des Lakhmides, soumise pacifiquement par Khalid (An 12 H).",
        figures: ["Khalid ibn Walid", "Al-Muthanna ibn Haritha"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Qadisiyyah.jpg/640px-Qadisiyyah.jpg"
    },
    {
        id: 75,
        name: "Dhat al-Salasil",
        type: "bataille",
        year: 12,
        coords: [29.9000, 47.5000],
        desc: "La 'Bataille des Chaînes' (An 12 H). Première victoire majeure de Khalid en Irak.",
        figures: ["Khalid ibn Walid", "Hormuz"],
        image: "https://images.unsplash.com/photo-1548586196-aa5803b77379?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 76,
        name: "Walaja",
        type: "bataille",
        year: 12,
        coords: [31.5000, 44.8000],
        desc: "Chef-d'œuvre tactique de Khalid (pince) en l'an 12 H.",
        figures: ["Khalid ibn Walid"],
        image: "https://images.unsplash.com/photo-1550952047-b70d49410168?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 77,
        name: "Ullais",
        type: "bataille",
        year: 12,
        coords: [31.6000, 44.7000],
        desc: "Surnommée la bataille de la 'Rivière de Sang' (An 12 H).",
        figures: ["Khalid ibn Walid"],
        image: "https://images.unsplash.com/photo-1518241778946-8c43093229b4?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 78,
        name: "Ein al-Tamr",
        type: "bataille",
        year: 12,
        coords: [32.5500, 43.4800],
        desc: "Oasis prise par Khalid (An 12 H). On y trouva de jeunes étudiants de l'Évangile.",
        figures: ["Khalid ibn Walid", "Nusayr"],
        image: "https://images.unsplash.com/photo-1549144511-6c278c2e3077?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 79,
        name: "Firaz",
        type: "bataille",
        year: 12,
        coords: [34.5000, 41.0000],
        desc: "Victoire de Khalid contre une coalition Perses/Byzantins/Arabes (An 12 H).",
        figures: ["Khalid ibn Walid"],
        image: "https://images.unsplash.com/photo-1473180238804-032904535316?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 80,
        name: "Pella (Fahl)",
        type: "bataille",
        year: 13,
        coords: [32.4500, 35.6100],
        desc: "La 'Bataille de la Boue' (An 13 H). Les Byzantins inondèrent les plaines en vain.",
        figures: ["Shurahbil ibn Hasana", "Abu Ubaydah ibn al-Jarrah"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pella_Jordan_Ruins.jpg/640px-Pella_Jordan_Ruins.jpg"
    },
    {
        id: 81,
        name: "Caesarea (Qisarya)",
        type: "ville",
        year: 19,
        coords: [32.5000, 34.9000],
        desc: "Forteresse maritime imprenable conquise en 19 H, finissant la conquête du Levant.",
        figures: ["Muawiya ibn Abi Sufyan", "Amr ibn al-As"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Caesarea_Maritima.jpg/640px-Caesarea_Maritima.jpg"
    },
    {
        id: 82,
        name: "Baalbek",
        type: "ville",
        year: 15,
        coords: [34.0000, 36.2000],
        desc: "Ancienne cité romaine conquise pacifiquement par Abu Ubaydah (An 15 H).",
        figures: ["Abu Ubaydah ibn al-Jarrah"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Baalbek_Jupiter_Temple.jpg/640px-Baalbek_Jupiter_Temple.jpg"
    },
    {
        id: 83,
        name: "Antioche (Antakya)",
        type: "ville",
        year: 16,
        coords: [36.2000, 36.1500],
        desc: "Capitale régionale byzantine conquise en 16 H.",
        figures: ["Abu Ubaydah ibn al-Jarrah", "Habib ibn Maslama"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Antakya_City_View.jpg/640px-Antakya_City_View.jpg"
    },
    {
        id: 84,
        name: "Qinnasrin",
        type: "ville",
        year: 15,
        coords: [35.9000, 37.0000],
        desc: "Base militaire byzantine conquise par Khalid ibn Walid (An 15 H).",
        figures: ["Khalid ibn Walid"],
        image: "https://images.unsplash.com/photo-1546252495-34c9c22e4d3a?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 85,
        name: "Istakhr (Persépolis)",
        type: "ville",
        year: 23, 
        coords: [29.9300, 52.8900],
        desc: "Le berceau des rois Perses, conquise vers 23 H.",
        figures: ["Uthman ibn Abi al-As", "Abdullah ibn Aamir"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Persepolis.jpg/640px-Persepolis.jpg"
    },
    {
        id: 86,
        name: "Hamadan",
        type: "ville",
        year: 23,
        coords: [34.8000, 48.5100],
        desc: "Grande cité perse conquise après Nihawand.",
        figures: ["Al-Mughira ibn Shu'ba"],
        image: "https://images.unsplash.com/photo-1590425719946-b337c7674254?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 87,
        name: "Mossoul",
        type: "ville",
        year: 20,
        coords: [36.3400, 43.1300],
        desc: "Centre clé de la Jazira conquis sous le califat d'Omar (An 20 H).",
        figures: ["Utba ibn Farqad", "Iyad ibn Ghanm"],
        image: "https://images.unsplash.com/photo-1570569766938-0c30a84e68e4?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 88,
        name: "Tripoli (Libye)",
        type: "ville",
        year: 22,
        coords: [32.8800, 13.1900],
        desc: "Conquise par Amr ibn al-As après un siège (An 22 H).",
        figures: ["Amr ibn al-As", "Uqba ibn Nafi"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Red_Castle_Tripoli.jpg/640px-Red_Castle_Tripoli.jpg"
    },
    {
        id: 89,
        name: "Subaytulah (Sbeitla)",
        type: "bataille",
        year: 27,
        coords: [35.2300, 9.1200],
        desc: "Victoire éclatante (An 27 H) contre le Patrice Grégoire en Tunisie.",
        figures: ["Abdullah ibn Zubayr", "Abdullah ibn Sa'd"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sbeitla_Capitol.jpg/640px-Sbeitla_Capitol.jpg"
    },
    {
        id: 90,
        name: "Dongola",
        type: "ville",
        year: 31,
        coords: [19.1700, 30.4700],
        desc: "Siège de la capitale nubienne (An 31 H), menant au traité du Baqt.",
        figures: ["Abdullah ibn Sa'd ibn Abi Sarh"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Old_Dongola.jpg/640px-Old_Dongola.jpg"
    },
    {
        id: 91,
        name: "Fustat (Caire)",
        type: "ville",
        year: 20,
        coords: [30.0050, 31.2260],
        desc: "Fondation de la première capitale islamique en Égypte (An 20 H).",
        figures: ["Amr ibn al-As", "Zubayr ibn al-Awwam"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Amr_Ibn_Al-As_Mosque.jpg/640px-Amr_Ibn_Al-As_Mosque.jpg"
    },
    {
        id: 92,
        name: "Barka",
        type: "ville",
        year: 22,
        coords: [32.4900, 20.8400],
        desc: "Ville de Cyrénaïque qui accepta l'Islam pacifiquement (An 22 H).",
        figures: ["Amr ibn al-As"],
        image: "https://images.unsplash.com/photo-1560934448-6d2c0d51c72e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 93,
        name: "Jabal Tariq (Gibraltar)",
        type: "monument",
        year: 92,
        coords: [36.1408, -5.3536],
        desc: "Entrée de l'Islam en Europe (An 92 H) sous Tariq ibn Ziyad.",
        figures: ["Tariq ibn Ziyad", "Musa ibn Nusayr"],
        image: "https://images.unsplash.com/photo-1599930129780-e85d99723528?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 94,
        name: "Cordoue (Qurtuba)",
        type: "ville",
        year: 92,
        coords: [37.8882, -4.7794],
        desc: "Capitale de l'Andalousie conquise en 92 H. Elle deviendra un phare mondial.",
        figures: ["Abd al-Rahman al-Dakhil", "Musa ibn Nusayr"],
        image: "https://images.unsplash.com/photo-1555005873-1e523362a26c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 95,
        name: "Tolède (Tulaytulah)",
        type: "ville",
        year: 93,
        coords: [39.8628, -4.0273],
        desc: "Conquise rapidement par Tariq ibn Ziyad (An 93 H).",
        figures: ["Tariq ibn Ziyad"],
        image: "https://images.unsplash.com/photo-1563204686-3d2371924618?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 96,
        name: "Poitiers (Balat al-Shuhada)",
        type: "bataille",
        year: 114,
        coords: [46.5802, 0.3404],
        desc: "Le 'Pavé des Martyrs' (An 114 H). Point d'arrêt de l'expansion en Gaule.",
        figures: ["Abd al-Rahman al-Ghafiqi"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Bataille_de_Poitiers.png/640px-Bataille_de_Poitiers.png"
    },
    {
        id: 97,
        name: "Narbonne (Arbuna)",
        type: "ville",
        year: 101,
        coords: [43.1843, 3.0031],
        desc: "Base musulmane en France établie en 101 H.",
        figures: ["As-Samh ibn Malik"],
        image: "https://images.unsplash.com/photo-1520633852233-030a0827297e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 98,
        name: "Kairouan (Al-Qayrawan)",
        type: "ville",
        year: 50,
        coords: [35.6781, 10.0963],
        desc: "Fondée par Uqba ibn Nafi (An 50 H), première base durable au Maghreb.",
        figures: ["Uqba ibn Nafi"],
        image: "https://images.unsplash.com/photo-1576402092795-c49c25f4486d?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 99,
        name: "Souss (Massa)",
        type: "monument",
        year: 62,
        coords: [30.0000, -9.6000],
        desc: "L'extrémité Ouest atteinte par Uqba (An 62 H) face à l'Atlantique.",
        figures: ["Uqba ibn Nafi"],
        image: "https://images.unsplash.com/photo-1534234828569-2c0eb2d8b584?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 100,
        name: "Tahert (Tiaret)",
        type: "ville",
        year: 144, 
        coords: [35.3710, 1.3169],
        desc: "Capitale des Rustamides, fondée vers 144 H.",
        figures: ["Abd al-Rahman ibn Rustam"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tihert.jpg/640px-Tihert.jpg"
    },
    {
        id: 101,
        name: "Merv",
        type: "ville",
        year: 31,
        coords: [37.6600, 62.1800],
        desc: "Capitale du Khorasan conquise sous Othman (An 31 H).",
        figures: ["Qutayba ibn Muslim", "Al-Ma'mun"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Gyaur_Kala.jpg/640px-Gyaur_Kala.jpg"
    },
    {
        id: 102,
        name: "Samarkand",
        type: "ville",
        year: 93,
        coords: [39.6270, 66.9750],
        desc: "Conquise par Qutayba ibn Muslim (An 93 H).",
        figures: ["Qutayba ibn Muslim"],
        image: "https://images.unsplash.com/photo-1529520447385-a7b3c220199d?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 103,
        name: "Boukhara",
        type: "ville",
        year: 90,
        coords: [39.7681, 64.4556],
        desc: "Conquise après plusieurs tentatives vers 90 H.",
        figures: ["Qutayba ibn Muslim", "Imam Al-Bukhari"],
        image: "https://images.unsplash.com/photo-1583256038166-7140f121d596?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 104,
        name: "Bataille de Talas",
        type: "bataille",
        year: 133,
        coords: [42.5200, 72.2300],
        desc: "Le point de contact ultime avec la Chine (An 133 H).",
        figures: ["Ziyad ibn Salih"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Talas_River.jpg/640px-Talas_River.jpg"
    },
    {
        id: 105,
        name: "Balkh",
        type: "ville",
        year: 32,
        coords: [36.7500, 66.9000],
        desc: "Conquise par Al-Ahnaf ibn Qays vers 32 H.",
        figures: ["Al-Ahnaf ibn Qays"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Balkh_Green_Mosque.jpg/640px-Balkh_Green_Mosque.jpg"
    },
    {
        id: 106,
        name: "Kaboul",
        type: "ville",
        year: 44,
        coords: [34.5553, 69.2075],
        desc: "Premières incursions sous Muawiya (vers 44 H).",
        figures: ["Abdur Rahman ibn Samura"],
        image: "https://images.unsplash.com/photo-1565063236025-a764d7807b5a?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 107,
        name: "Fergana",
        type: "ville",
        year: 96,
        coords: [40.3842, 71.7843],
        desc: "La limite orientale atteinte par Qutayba (An 96 H).",
        figures: ["Qutayba ibn Muslim"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fergana_Valley.jpg/640px-Fergana_Valley.jpg"
    },
    {
        id: 108,
        name: "Debal (Banbhore)",
        type: "bataille",
        year: 93,
        coords: [24.7500, 67.5000],
        desc: "Port stratégique du Sindh conquis par Muhammad ibn Qasim (An 93 H).",
        figures: ["Muhammad ibn Qasim"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Banbhore_Ruins.jpg/640px-Banbhore_Ruins.jpg"
    },
    {
        id: 109,
        name: "Multan",
        type: "ville",
        year: 94,
        coords: [30.1575, 71.5249],
        desc: "Conquise par Muhammad ibn Qasim (An 94 H), implantant l'Islam en Inde.",
        figures: ["Muhammad ibn Qasim"],
        image: "https://images.unsplash.com/photo-1582298622152-3347b74f3780?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 110,
        name: "Mansura",
        type: "ville",
        year: 112,
        coords: [25.8600, 68.5200],
        desc: "Capitale arabe du Sindh fondée vers 112 H.",
        figures: ["Dynastie Habbarid"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Desert_Arabia.jpg/640px-Desert_Arabia.jpg"
    },
    {
        id: 111,
        name: "Derbent (Bab al-Abwab)",
        type: "monument",
        year: 22,
        coords: [42.0578, 48.2890],
        desc: "La 'Porte des Portes' du Caucase, atteinte dès 22 H.",
        figures: ["Maslama ibn Abd al-Malik"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Derbent_Fortress.jpg/640px-Derbent_Fortress.jpg"
    },
    {
        id: 112,
        name: "Tbilissi (Tiflis)",
        type: "ville",
        year: 24,
        coords: [41.7151, 44.8271],
        desc: "Pacte de sécurité accordé par Habib ibn Maslama (An 24 H).",
        figures: ["Habib ibn Maslama"],
        image: "https://images.unsplash.com/photo-1563212623-6404c0556c4d?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 113,
        name: "Constantinople (Sièges)",
        type: "bataille",
        year: 49,
        coords: [41.0082, 28.9784],
        desc: "Le rêve inachevé. Premier siège majeur en 49 H.",
        figures: ["Abu Ayyub Al-Ansari", "Yazid ibn Muawiya"],
        image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 114,
        name: "Amorium",
        type: "bataille",
        year: 223,
        coords: [39.0200, 31.2900],
        desc: "Prise par Al-Mu'tasim en 223 H ('Wa Mu'tasimah!').",
        figures: ["Calife Al-Mu'tasim"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Phrygian_Valley.jpg/640px-Phrygian_Valley.jpg"
    },
    {
        id: 115,
        name: "Palerme (Siqilliyya)",
        type: "ville",
        year: 216,
        coords: [38.1157, 13.3615],
        desc: "Conquête de la Sicile commencée vers 212 H, Palerme prise en 216 H.",
        figures: ["Asad ibn al-Furat"],
        image: "https://images.unsplash.com/photo-1542398516-f28825827361?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 116,
        name: "Chandax (Crète)",
        type: "ville",
        year: 212,
        coords: [35.3387, 25.1442],
        desc: "Fondation de l'Émirat de Crète par des exilés andalous (An 212 H).",
        figures: ["Abu Hafs Umar al-Iqritishi"],
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 117,
        name: "Bagdad (Madinat al-Salam)",
        type: "ville",
        year: 145,
        coords: [33.3152, 44.3661],
        desc: "La Ville Ronde fondée par Al-Mansur en 145 H.",
        figures: ["Calife Al-Mansur", "Imam Ahmad ibn Hanbal"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Baghdad_Round_City.jpg/640px-Baghdad_Round_City.jpg"
    },
    {
        id: 118,
        name: "Wasit",
        type: "ville",
        year: 83,
        coords: [32.2000, 46.3000],
        desc: "Ville de garnison fondée par Al-Hajjaj en 83 H.",
        figures: ["Al-Hajjaj ibn Yusuf"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Desert_Arabia.jpg/640px-Desert_Arabia.jpg"
    },
    {
        id: 119,
        name: "Raqqa",
        type: "ville",
        year: 170, 
        coords: [35.9500, 39.0100],
        desc: "Résidence d'été du calife Harun al-Rashid (période Abbasside).",
        figures: ["Harun al-Rashid", "Uwais al-Qarni"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Raqqa_Wall.jpg/640px-Raqqa_Wall.jpg"
    },
    {
        id: 120,
        name: "Harran",
        type: "ville",
        year: 127, 
        coords: [36.8600, 39.0200],
        desc: "Dernière capitale des Omeyyades (An 127 H).",
        figures: ["Marwan II", "Ibn Taymiyyah"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Beehive_houses_Harran.jpg/640px-Beehive_houses_Harran.jpg"
    },
    {
        id: 121,
        name: "Samarra",
        type: "monument",
        year: 221,
        coords: [34.2000, 43.8800],
        desc: "Capitale Abbasside fondée en 221 H.",
        figures: ["Calife Al-Mutawakkil"],
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Great_Mosque_of_Samarra.jpg/640px-Great_Mosque_of_Samarra.jpg"
    },
    {
        id: 122,
        name: "Zanzibar (Qanbalu)",
        type: "ville",
        year: 100,
        coords: [-6.1659, 39.2026],
        desc: "Premières traces de l'Islam en Afrique de l'Est (vers 1er siècle H).",
        figures: ["Marchands musulmans"],
        image: "https://images.unsplash.com/photo-1534768393527-3114d59a8c08?q=80&w=600&auto=format&fit=crop"
    }
];

// Tracé approximatif de la route de l'Hégire (Mecque -> Médine)
const hijraRoutePoints = [
    [21.4225, 39.8262], // Mecque
    [21.3768, 39.8452], // Grotte Thawr (Sud)
    [21.6000, 39.4000], // Redirection vers la côte Rouge
    [22.2000, 39.1000], // Qudaid
    [23.0000, 38.9000], // Juhfah
    [23.9000, 39.0000], // Badr (passage au large)
    [24.4392, 39.6173], // Quba
    [24.4672, 39.6108]  // Médine
];