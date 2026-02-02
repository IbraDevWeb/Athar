// ==========================================
// Fichier: data.js (Version Étendue - "Enterprise Data")
// ==========================================

var scholarsData = {
    nodes: [
        // =========================================================================
        // GÉNÉRATION 0 & 1 : LES TABI'UN (LES SUIVANTS)
        // =========================================================================
        {
            id: 1, 
            label: 'Hammad b.\nAbi Sulayman', 
            group: 'pre', 
            dates: 'Mort en 120 H (738 EC)', 
            arabic: 'حماد بن أبي سليمان', 
            bio: `
                <strong>Le Maître de l'Iraq</strong><br>
                Hammad fut le pivot de la transmission du savoir à Koufa. Il est le maillon principal reliant l'école de la raison (Ahl al-Ra'y) aux Compagnons.<br><br>
                
                <strong>Sa méthodologie :</strong><br>
                Il a hérité de la méthode d'Ibrahim Al-Nakha'i, basée sur l'analyse et la déduction. Il organisait des cercles de débats intenses où chaque question juridique était décortiquée.<br><br>
                
                <strong>Relation avec Abu Hanifa :</strong><br>
                Abu Hanifa a étudié sous sa tutelle pendant 18 ans. Il disait : <em>"Je n'ai jamais prié une prière depuis la mort de Hammad sans implorer le pardon d'Allah pour lui."</em>
            `
        },
        {
            id: 2, 
            label: 'Nafi', 
            group: 'pre', 
            dates: 'Mort en 117 H', 
            arabic: 'نافع مولى ابن عمر', 
            bio: `
                <strong>La Chaîne d'Or (Silsilat al-Dhahab)</strong><br>
                Nafi était l'affranchi d'Abdullah ibn Umar. Il est célèbre pour avoir transmis la science de son maître avec une précision inégalée.<br><br>
                
                Malik ibn Anas disait : <em>"Si j'entends 'Nafi d'après Ibn Umar', je ne me soucie pas de ne pas l'avoir entendu d'un autre."</em> C'est la chaîne de narration la plus authentique selon l'Imam Bukhari.
            `
        },
        {
            id: 3, 
            label: 'Imam Az-Zuhri', 
            group: 'pre', 
            dates: '58 - 124 H', 
            arabic: 'ابن شهاب الزهري', 
            bio: `
                <strong>Le premier compilateur officiel</strong><br>
                Muhammad ibn Muslim al-Zuhri fut le premier à compiler les Hadiths par ordre officiel sous le califat de Umar ibn Abdul Aziz. Il craignait que la science ne disparaisse avec la mort des savants.<br><br>
                Il avait une mémoire photographique légendaire. On dit qu'il pouvait mémoriser un livre entier en une seule lecture. Il fut le professeur principal de l'Imam Malik à Médine.
            `
        },
        {
            id: 4, 
            label: 'Ja\'far al-Sadiq', 
            group: 'pre', 
            dates: '80 - 148 H', 
            arabic: 'جعفر الصادق', 
            bio: `
                <strong>Le Maître Spirituel et Juridique</strong><br>
                Descendant du Prophète (paix sur lui) par Ali et Abu Bakr. Ja'far al-Sadiq est une figure centrale respectée par toutes les écoles de pensée.<br><br>
                
                <strong>Son enseignement :</strong><br>
                Il tenait un cercle immense à Médine où se pressaient les savants de toutes disciplines (chimie avec Jabir ibn Hayyan, jurisprudence avec Abu Hanifa et Malik).<br>
                Abu Hanifa a dit de lui : <em>"Je n'ai jamais vu plus savant que Ja'far ibn Muhammad."</em>
            `
        },
        {
            id: 5,
            label: 'Sa\'id ibn\nal-Musayyib',
            group: 'pre',
            dates: '15 - 94 H',
            arabic: 'سعيد بن المسيب',
            bio: `
                <strong>Le savant des Tabi'un</strong><br>
                Il est considéré comme le plus grand des Tabi'un. Il a épousé la fille d'Abu Huraira et a combiné le Fiqh et le Hadith. Il était connu pour son refus d'accepter les cadeaux des gouverneurs omeyyades.
            `
        },
        {
            id: 6, label: 'Al-A\'mash', group: 'pre', bio: "Sulayman ibn Mihran. Un géant du Hadith à Koufa, connu pour son humour piquant et sa rigueur extrême dans la narration."},
        {
            id: 12, 
            label: 'Al-Awza\'i', 
            group: 'pre', 
            dates: '88 - 157 H', 
            arabic: 'الأوزاعي',
            bio: `
                <strong>L'Imam de la Syrie</strong><br>
                Abdur-Rahman al-Awza'i était l'autorité suprême à Damas et Beyrouth. Son école juridique (Madhhab) fut pratiquée en Syrie et en Andalousie avant d'être remplacée par les écoles Shafi'ite et Malikite.<br><br>
                Il était célèbre pour son courage face aux gouverneurs injustes, n'hésitant pas à les réprimander publiquement.
            `
        },
        {
            id: 13, 
            label: 'Al-Layth b. Sa\'d', 
            group: 'pre', 
            dates: '94 - 175 H', 
            arabic: 'الليث بن سعد',
            bio: `
                <strong>L'Imam de l'Égypte</strong><br>
                L'Imam Shafi'i a dit : <em>"Al-Layth était plus savant (dans le Fiqh) que Malik, mais ses élèves ne l'ont pas porté (n'ont pas codifié son école)."</em><br><br>
                Il était immensément riche et payait les dettes de tous les savants, y compris celles de l'Imam Malik, sans jamais payer la Zakat car il donnait tout avant qu'un an ne s'écoule.
            `
        },
        {
            id: 14, 
            label: 'Sufyan\nAl-Thawri', 
            group: 'pre', 
            dates: '97 - 161 H', 
            arabic: 'سفيان الثوري',
            bio: `
                <strong>Le Prince des Croyants dans le Hadith</strong><br>
                Sufyan était un ascète (Zahid) et un juriste. Il a fondé une école qui a duré quelques siècles avant de disparaître. Il fuyait les cours des califes et vivait caché pour éviter d'être nommé juge.
            `
        },

        // =========================================================================
        // GÉNÉRATION 2 : LES FONDATEURS D'ÉCOLES (IMAMS)
        // =========================================================================
        {
            id: 10, 
            label: 'Imam\nAbû Ḥanîfa', 
            group: 'hanafi', 
            shape: 'star', 
            size: 40,
            font: {color:'black', size: 18, face: 'Arial'},
            dates: '80 - 150 H (699 - 767 EC)', 
            arabic: 'أبو حنيفة النعمان', 
            bio: `
                <h3>L'Imam Al-A'zam (Le Plus Grand Imam)</h3>
                <p>Nu'man ibn Thabit, d'origine perse, est le fondateur de l'école Hanafite, la plus suivie au monde. Il était commerçant en tissus (soie), ce qui lui donnait une indépendance financière totale et une compréhension pragmatique des transactions.</p>
                
                <hr>
                
                <h4>Son Méthodologie (Usul)</h4>
                <ul>
                    <li><strong>Le Coran et la Sunnah :</strong> Bases indiscutables.</li>
                    <li><strong>Le Qiyas (Analogie) :</strong> Il a perfectionné l'art de déduire des lois pour des situations nouvelles par analogie logique.</li>
                    <li><strong>L'Istihsan (Préférence juridique) :</strong> S'écarter de la règle stricte pour l'intérêt général ou l'équité.</li>
                </ul>

                <h4>Le refus du pouvoir</h4>
                <p>Le Calife Al-Mansur a voulu le nommer Grand Juge (Qadi al-Qhudat) de Bagdad pour le contrôler. Abu Hanifa a refusé en disant : <em>"Si je suis honnête, je ne suis pas apte (car je jugerai contre toi), et si je mens, je ne suis pas apte non plus."</em> Il fut emprisonné et torturé jusqu'à sa mort.</p>
            `
        },
        {
            id: 11, 
            label: 'Imam\nMâlik', 
            group: 'maliki', 
            shape: 'star', 
            size: 40,
            font: {color:'black', size: 18},
            dates: '93 - 179 H (711 - 795 EC)', 
            arabic: 'مالك بن أنس', 
            bio: `
                <h3>L'Imam de Dar al-Hijrah (Médine)</h3>
                <p>Malik ibn Anas n'a quasiment jamais quitté Médine. Il considérait que la pratique des habitants de Médine ("Amal Ahl al-Madina") était une preuve juridique plus forte qu'un hadith isolé (Ahad), car c'est une transmission de masse (Tawatur) par la pratique depuis le Prophète.</p>
                
                <hr>
                
                <h4>Le Muwatta</h4>
                <p>Son livre, <em>Al-Muwatta</em> (La voie aplanie), est le premier grand code juridique de l'Islam combinant Hadith et Fiqh. Le Calife Harun al-Rashid voulait l'accrocher dans la Kaaba et obliger tous les musulmans à le suivre. Malik a refusé : <em>"Ô Commandeur des Croyants, ne fais pas cela. Les compagnons se sont dispersés dans les contrées et chacun possède une science."</em></p>

                <h4>Adab (Respect)</h4>
                <p>Il ne donnait jamais cours de Hadith sans avoir fait ses ablutions, s'être parfumé et avoir mis ses plus beaux vêtements par respect pour la parole du Prophète.</p>
            `
        },
        {
            id: 30, 
            label: 'Imam\nach-Shâfiʿî', 
            group: 'shafii', 
            shape: 'star', 
            size: 40,
            font: {color:'black', size: 18},
            dates: '150 - 204 H (767 - 820 EC)', 
            arabic: 'محمد بن إدريس الشافعي', 
            bio: `
                <h3>Le Nasir al-Sunnah (Le défenseur de la Sunnah)</h3>
                <p>Né à Gaza l'année de la mort d'Abu Hanifa, il a grandi à la Mecque, étudié à Médine auprès de Malik, puis en Irak auprès des élèves d'Abu Hanifa (Shaybani). Il a fini sa vie en Égypte.</p>

                <hr>
                
                <h4>La Synthèse</h4>
                <p>Il a réussi l'exploit de réunir l'école du Hadith (Médine) et l'école de la Raison (Irak). Il est le fondateur de la science des fondements du droit (Usul al-Fiqh) avec son livre <em>Al-Risala</em>.</p>
                
                <h4>L'Ancien et le Nouveau Madhhab</h4>
                <p>Il a changé la majorité de ses avis juridiques (Fatwas) lorsqu'il s'est installé en Égypte, constatant que le changement de contexte et de coutumes nécessitait une réévaluation du Fiqh. C'est une leçon de flexibilité intellectuelle.</p>
            `
        },
        {
            id: 40, 
            label: 'Imam\nAḥmad', 
            group: 'hanbali', 
            shape: 'star', 
            size: 40,
            font: {color:'black', size: 18},
            dates: '164 - 241 H (780 - 855 EC)', 
            arabic: 'أحمد بن حنبل', 
            bio: `
                <h3>L'Imam de la Sunnah</h3>
                <p>Ahmad ibn Hanbal est le symbole de la résistance orthodoxe. Élève de Shafi'i, il s'est concentré massivement sur la collecte du Hadith. Son recueil, le <em>Musnad</em>, contient environ 27 000 hadiths.</p>
                
                <hr>
                
                <h4>La Mihna (L'Inquisition)</h4>
                <p>Sous le calife Al-Ma'mun, une doctrine mu'tazilite (création du Coran) fut imposée. Tous les savants cédèrent sous la menace ou la torture, sauf Ahmad. Il fut emprisonné et fouetté pendant des années, mais refusa de changer un iota de sa croyance. Sa fermeté a sauvé, selon les historiens, le credo sunnite traditionnel.</p>
            `
        },

        // =========================================================================
        // GÉNÉRATION 3 : LES GRANDS ÉLÈVES & CODIFICATEURS
        // =========================================================================
        {
            id: 20, 
            label: 'Abû Yûsuf', 
            group: 'hanafi', 
            dates: '113 - 182 H', 
            bio: `
                <strong>Le Juge des Juges (Qadi al-Qudat)</strong><br>
                Premier élève d'Abu Hanifa. Contrairement à son maître, il a accepté le poste de juge suprême sous Harun al-Rashid. C'est grâce à lui que l'école Hanafite est devenue la doctrine officielle de l'Empire Abbasside. Il a introduit l'usage de l'école Hanafite dans l'administration fiscale.
            `
        },
        {
            id: 21, 
            label: 'Muḥammad\nach-Shaybânî', 
            group: 'hanafi', 
            shape: 'ellipse', 
            borderWidth: 3, 
            color:{border:'#2ecc71', background:'#D4AF37'}, 
            dates: '132 - 189 H', 
            bio: `
                <strong>Le Scribe de l'École</strong><br>
                Si Abu Hanifa a fondé la pensée et Abu Yusuf l'a appliquée politiquement, c'est Muhammad al-Shaybani qui l'a écrite. Ses 6 livres (Zahir al-Riwaya) sont la base canonique du Hanafisme.<br><br>
                Il fut également le professeur de l'Imam Shafi'i à Bagdad. Il a débattu avec Malik à Médine.
            `
        },
        {id: 22, label: 'Zufar', group: 'hanafi', bio: "Zufar ibn al-Hudhayl. Il était le plus fort des élèves d'Abu Hanifa en Analogie (Qiyas), mais il est mort jeune, avant de pouvoir codifier ses avis."},
        {
            id: 23, 
            label: 'Ibn al-Mubarak', 
            group: 'pre', 
            arabic: 'عبد الله بن المبارك', 
            bio: `
                <strong>Le Savant Combattant</strong><br>
                Une figure unique : riche commerçant, grand savant du Hadith, juriste, et combattant sur les frontières (Murabit). Il payait le Hajj pour ses voisins. Il est le symbole de l'ascétisme actif (Zuhd). Il a étudié chez Abu Hanifa et Malik.
            `
        },
        {id: 24, label: 'Ibn al-Qasim', group: 'maliki', bio: "Le principal transmetteur du Fiqh de Malik. C'est sa version de la 'Mudawwana' qui est devenue la référence de l'école Malikite au Maghreb."},
        {id: 25, label: 'Ibn Wahb', group: 'maliki', bio: "Il a combiné le Fiqh de Malik et celui de Layth ibn Sa'd. Il refusait le poste de juge par piété."},
        {id: 27, label: 'Waki\' b. al-Jarrah', group: 'pre', bio: "Célèbre pour sa mémoire. C'est à lui que Shafi'i s'est plaint de sa mauvaise mémoire dans son célèbre poème."},

        // =========================================================================
        // GÉNÉRATION 4 : LES MAÎTRES DU HADITH (KUTUB AL-SITTAH)
        // =========================================================================
        {
            id: 41, 
            label: 'Al-Bukhari', 
            group: 'hadith', 
            shape: 'diamond', 
            size: 35, 
            color: {background: '#9b59b6'},
            dates: '194 - 256 H', 
            arabic: 'محمد بن إسماعيل البخاري',
            bio: `
                <h3>L'Amir al-Mu'minin fil Hadith</h3>
                <p>Né à Boukhara (Ouzbékistan actuel). Il a compilé le <em>Sahih Al-Bukhari</em>, considéré comme le livre le plus authentique après le Coran. Il a sélectionné environ 7 000 hadiths parmi 600 000 qu'il avait mémorisés.</p>
                <p><strong>Rigueur :</strong> Pour accepter un hadith d'un rapporteur, il exigeait non seulement qu'il soit digne de confiance, mais qu'il soit prouvé historiquement qu'il a rencontré physiquement son professeur (Mu'asara + Liqa).</p>
            `
        },
        {
            id: 42, 
            label: 'Muslim', 
            group: 'hadith', 
            shape: 'diamond', 
            size: 30,
            dates: '206 - 261 H', 
            bio: `
                <strong>L'élève fidèle</strong><br>
                Muslim ibn al-Hajjaj, de Nishapur. Son Sahih est considéré comme l'égal de celui de Bukhari en authenticité, et supérieur en termes d'organisation et de classement. Il a embrassé le front de Bukhari en public lorsque ce dernier fut ostracisé.
            `
        },
        {id: 43, label: 'Abu Dawud', group: 'hadith', dates: '202 - 275 H', bio: "Son 'Sunan' se concentre spécifiquement sur les Hadiths juridiques (Ahkam). C'est le livre préféré des juristes (Fuqaha)."},
        {id: 44, label: 'At-Tirmidhi', group: 'hadith', dates: '209 - 279 H', bio: "Élève de Bukhari. Son livre 'Jami' est célèbre car il mentionne après chaque hadith les avis des juristes (Hanafi, Maliki, Shafi'i...) sur la question."},
        {id: 45, label: 'An-Nasa\'i', group: 'hadith', dates: '215 - 303 H', bio: "Son livre est considéré comme ayant les conditions les plus strictes après les deux Sahihs."},
        {id: 46, label: 'Ibn Majah', group: 'hadith', dates: '209 - 273 H', bio: "Le dernier des 6 livres. Il contient des hadiths uniques (Zawa'id) mais certains sont faibles."},
        
        // --- AUTRES SAVANTS CLÉS ---
        {id: 31, label: 'Yahya ibn Ma\'in', group: 'hadith', bio: "Le grand critique des hommes (Jarh wa Ta'dil). Ami intime d'Ahmad ibn Hanbal."},
        {id: 32, label: 'Ali ibn al-Madini', group: 'hadith', bio: "Le professeur de Bukhari dans les 'Ilal (défauts cachés du hadith)."},
        {id: 33, label: 'Ishaq ibn Rahwayh', group: 'hadith', bio: "Le savant du Khurasan. C'est lui qui a suggéré à Bukhari de compiler un livre ne contenant que des hadiths authentiques."},
        {id: 34, label: 'Al-Buwayti', group: 'shafii', bio: "Successeur de Shafi'i. Il est mort en prison durant la Mihna, enchaîné, pour avoir défendu la même position qu'Ahmad."},
        {id: 35, label: 'Al-Muzani', group: 'shafii', bio: "Le champion du débat et de la déduction dans l'école Shafi'ite."},
{
            id: 36, 
            label: 'Al-Humaydi', 
            group: 'hadith', 
            bio: "Le grand savant de La Mecque et professeur de Bukhari. C'est avec son hadith ('Les actes ne valent que par les intentions') que Bukhari commence son Sahih."
        },
        {id: 47, label: 'Abdullah b. Ahmad', group: 'hanbali', bio: "Fils de l'Imam Ahmad, c'est lui qui a compilé le Musnad de son père et ajouté des suppléments (Zawa'id)."},
        {id: 50, label: 'Al-Rabi\' al-Muradi', group: 'shafii', bio: "Le narrateur principal des livres de Shafi'i en Égypte. Sans lui, 'Al-Umm' ne nous serait pas parvenu."}
    ],
    
    edges: [
        // RELATIONS GÉNÉRATION 1 -> 2
        {from: 1, to: 10, label: "Maître principal (18 ans)", arrows: "to", color: {color:'#555'}}, // Hammad -> Abu Hanifa
        {from: 4, to: 10, dashes:true, label: "Influence spirituelle"}, // Ja'far -> Abu Hanifa
        {from: 4, to: 11, dashes:true}, // Ja'far -> Malik
        {from: 2, to: 11, label: "Chaîne d'Or", width: 2, color:{color:'gold'}}, // Nafi -> Malik
        {from: 3, to: 11, label: "Enseignant Hadith"}, // Zuhri -> Malik
        {from: 5, to: 3}, // Said ibn Musayyib -> Zuhri (Lien indirect via culture Médine)
        {from: 6, to: 14}, // Amash -> Sufyan Thawri
        {from: 12, to: 10, dashes:true, label: "Débats"}, // Awza'i <-> Abu Hanifa

        // RELATIONS GENERATION 2 -> 3
        {from: 10, to: 20, width: 2}, // Abu Hanifa -> Abu Yusuf
        {from: 10, to: 21, width: 3, label: "Transmission Fiqh"}, // Abu Hanifa -> Shaybani
        {from: 10, to: 22}, // Abu Hanifa -> Zufar
        {from: 10, to: 23}, // Abu Hanifa -> Ibn Mubarak
        
        {from: 11, to: 21, color:{color:'#2ecc71'}, width: 2, label: "Transmission Muwatta"}, // Malik -> Shaybani
        {from: 11, to: 24}, // Malik -> Ibn Qasim
        {from: 11, to: 25}, // Malik -> Ibn Wahb
        {from: 11, to: 23, label: "Respect mutuel"}, // Malik -> Ibn Mubarak
        {from: 11, to: 30, width: 3, label: "Élève direct"}, // Malik -> Shafi'i
        
        {from: 13, to: 30, dashes:true, label: "Influence (Égypte)"}, // Layth -> Shafi'i
        {from: 14, to: 23}, // Thawri -> Ibn Mubarak

        // RELATIONS GENERATION 3 -> 4
        {from: 21, to: 30, color:{color:'#D4AF37'}, dashes:true, label: "Étude du Fiqh irakien"}, // Shaybani -> Shafi'i
        {from: 20, to: 40, dashes:true}, // Abu Yusuf -> Ahmad (Ahmad a assisté à ses cercles jeune)
        
        {from: 30, to: 40, width: 3, label: "Maître & Élève"}, // Shafi'i -> Ahmad
        {from: 30, to: 34}, // Shafi'i -> Buwayti
        {from: 30, to: 35}, // Shafi'i -> Muzani
        {from: 30, to: 50}, // Shafi'i -> Rabi'
        
        {from: 27, to: 30}, // Waki -> Shafi'i
        {from: 27, to: 40}, // Waki -> Ahmad
        {from: 23, to: 40, dashes:true}, // Ibn Mubarak -> Ahmad (Influence)

        // RELATIONS VERS LES SAVANTS DU HADITH (GEN 5)
        {from: 40, to: 41, width: 2, label: "Soutien"}, // Ahmad -> Bukhari
        {from: 40, to: 42}, // Ahmad -> Muslim
        {from: 40, to: 43}, // Ahmad -> Abu Dawud
        {from: 40, to: 47}, // Ahmad -> Abdullah
        
        {from: 31, to: 40, label: "Amis intimes"}, // Yahya ibn Main <-> Ahmad
        {from: 31, to: 41}, // Yahya -> Bukhari
        
        {from: 32, to: 41, label: "Maître en 'Ilal"}, // Ali ibn Madini -> Bukhari
        {from: 33, to: 41, label: "Inspiration Sahih"}, // Ishaq ibn Rahwayh -> Bukhari
        
        {from: 41, to: 42, width: 2, label: "Admiration totale"}, // Bukhari -> Muslim
        {from: 41, to: 44}, // Bukhari -> Tirmidhi
        
        {from: 36, to: 41} // Humaydi -> Bukhari
    ]
};

// Fonction utilitaire pour dupliquer les données si besoin de Stress-Test
// Appeler expandData(5) dans la console pour multiplier les noeuds par 5
function expandData(factor) {
    let originalLength = scholarsData.nodes.length;
    for(let i = 1; i < factor; i++) {
        for(let j = 0; j < originalLength; j++) {
            let node = {...scholarsData.nodes[j]};
            node.id = node.id + (i * 1000);
            node.label = node.label + " (" + i + ")";
            scholarsData.nodes.push(node);
            
            // Créer des liens aléatoires pour garder le graphe connecté
            if(Math.random() > 0.7) {
                scholarsData.edges.push({
                    from: node.id,
                    to: scholarsData.nodes[Math.floor(Math.random() * originalLength)].id
                });
            }
        }
    }
    console.log("Data expanded to " + scholarsData.nodes.length + " nodes.");
}