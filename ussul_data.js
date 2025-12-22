// Fichier: ussul_data.js
const USSUL_LESSONS = [
    {
        id: 1,
        title: "Introduction à Al-Ishara",
        author: "Imam Abu Al-Walid Al-Baji",
        videoUrl: "https://youtu.be/yOtcqnatTvA",
        intro: "Une analyse du système unifié des Oussoul selon l'école Malikite. Comprendre la fusion entre la Preuve (Adilla) et la Déduction (Istidlal).",
        sections: [
            {
                title: "1. Contexte et Auteur",
                content: "Le livre étudié est **Al-Ishara**, l'œuvre de l'Imam Abu Al-Walid Al-Baji (mort en 474 H). C'est un résumé de son propre ouvrage majeur, **Ahkam al-Fusul**.",
                deepDive: {
                    title: "Qui est Al-Baji ?",
                    content: "Malikite andalou, considéré comme un 'Muhaqqiq' (vérificateur). Ibn Taymiyya a fait son éloge pour sa défense de la Sunna face aux innovations, bien qu'il ait adopté certaines méthodes dialectiques (Kalam)."
                }
            },
            {
                title: "2. Le Système Unifié",
                content: "Contrairement à la majorité qui séparent les {Adilla} (Preuves) de l'{Istidlal} (Déduction), Al-Baji les a fusionnés. Il a fait des Oussoul al-Fiqh une colonne unique et un système unifié."
            },
            {
                title: "3. Les 3 Piliers de la Preuve",
                content: "Al-Baji classe les preuves en trois types :<br>1. **Al-Asl (L'Origine)** : Coran, Sunna, Ijma.<br>2. **Ma'qul al-Asl** : Ce qui est raisonné à partir du texte.<br>3. **Istishab al-Hal** : La présomption de continuité."
            },
            {
                title: "4. Analyse de Ma'qul al-Asl",
                content: "C'est la partie technique. Elle comprend :<br>- **Lahn al-Khitab** : L'implicite.<br>- **Fahwa al-Khitab** : Le raisonnement a fortiori (ex: interdiction de frapper déduite de l'interdiction de dire 'Ouf').<br>- **Ma'na al-Khitab** : Le Qiyas (Analogie).",
                deepDive: {
                    title: "Note Importante",
                    content: "Ce n'est pas purement rationnel. C'est un mélange de **Lugha** (Langue) et de **Sharia** (Loi). On ne peut comprendre la loi sans la langue."
                }
            },
            {
                title: "5. Le Débat : Haqiqa vs Majaz",
                content: "Al-Baji affirme que le Livre contient du {Majaz} (Métaphore). C'est un débat théologique. Si on utilise 'Majaz' pour décrire un style linguistique (éloquence), c'est acceptable. Mais les Mu'tazila l'ont utilisé pour nier les Attributs d'Allah.",
            }
        ]
    },
    {
        id: 2,
        title: "Le Concept du Nombre & L'Implicite",
        author: "Sheikh Sa'id Al Kamali",
        videoUrl: "https://youtu.be/9AHaxqEyIug?si=bd0f2cRhYNzW3XVs",
        intro: "Exploration de la déduction juridique : Comment comprendre ce que le texte ne dit pas ? Le débat sur la valeur juridique des nombres.",
        sections: [
            {
                title: "1. Le Prononcé et le Compris",
                content: "Tout texte sacré possède deux facettes :<br>1. **Al-Mantuq** (Le Prononcé) : Ce que le mot indique explicitement (Ex: 'Honore les étudiants').<br>2. **Al-Mafhum** (Le Compris) : Ce qui est déduit sans être dit (Ex: Ne pas honorer les paresseux).",
                deepDive: {
                    title: "Exemple Coranique",
                    content: "L'interdiction de dire 'Ouf' aux parents est le **Mantuq**. L'interdiction de les frapper n'est pas prononcée, mais elle est comprise par le **Mafhum** (si 'Ouf' est interdit, les frapper l'est a fortiori)."
                }
            },
            {
                title: "2. Mafhum al-Muwafaqa (Concordance)",
                content: "C'est lorsque le jugement de l'implicite concorde avec le prononcé. Il a deux degrés :<br>- **Fahwa al-Khitab** : L'implicite est *plus fort* que le prononcé (Frapper > dire Ouf).<br>- **Lahn al-Khitab** : L'implicite est *égal* au prononcé (Brûler l'argent de l'orphelin est égal à le manger, car c'est une destruction)."
            },
            {
                title: "3. Mafhum al-Mukhalafa (Divergence)",
                content: "Aussi appelé **Dalil al-Khitab**. C'est lorsque le jugement implicite est l'inverse du prononcé.<br>Exemple : 'Pas de testament pour l'héritier'.<br>Mantuq : Interdit pour l'héritier.<br>Mafhum : Permis pour le non-héritier.",
                deepDive: {
                    title: "Les 10 types",
                    content: "L'Imam Ibn Ghazi a recensé 10 types de Mafhum al-Mukhalafa, incluant la condition, la description, le but, et le nombre."
                }
            },
            {
                title: "4. Le Débat sur le Nombre (Mafhum al-'Adad)",
                content: "Si la Loi cite un nombre (ex: 80 coups de fouet, 40 moutons), est-ce restrictif ?<br>**La Majorité** (Malikites, Hanbalites) : Oui, c'est une preuve. On ne peut ni ajouter ni diminuer.<br>**Hanafites & Qadi Iyad** : Ce n'est pas une preuve en soi."
            },
            {
                title: "5. L'Argument de Qadi Iyad",
                content: "Qadi Iyad soutient que le nombre n'est pas une preuve restrictive car les Sahaba demandaient souvent des précisions (ex: 'Et pour deux ?' quand le Prophète parlait de trois). S'ils avaient compris le nombre comme restrictif, ils n'auraient pas posé la question.",
                deepDive: {
                    title: "Réponse de la Majorité",
                    content: "La majorité répond que les nombres dans la Sharia ne sont pas aléatoires. Si l'on ignore la restriction du nombre, la mention même du chiffre (ex: 40 moutons pour la Zakat) deviendrait inutile et vide de sens, ce qui est impossible pour la parole divine."
                }
            }
        ]
    }
];