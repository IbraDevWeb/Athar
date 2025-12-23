// Fichier: ussul_data.js
const USSUL_LESSONS = [
    {
        id: 1,
        title: "Introduction à Al-Ishara",
        author: "Imam Abu Al-Walid Al-Baji",
        videoUrl: "https://youtu.be/yOtcqnatTvA",
        intro: "Une analyse du système unifié des Oussoul selon l'école Malikite. Comprendre la fusion entre la Preuve ({Adilla}) et la Déduction ({Istidlal}).",
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
                content: "Al-Baji classe les preuves en trois types :<br>1. **{Al-Asl} (L'Origine)** : Coran, Sunna, {Ijma}.<br>2. **{Ma'qul al-Asl}** : Ce qui est raisonné à partir du texte.<br>3. **{Istishab al-Hal}** : La présomption de continuité."
            },
            {
                title: "4. Analyse de {Ma'qul al-Asl}",
                content: "C'est la partie technique. Elle comprend :<br>- **{Lahn al-Khitab}** : L'implicite.<br>- **{Fahwa al-Khitab}** : Le raisonnement a fortiori (ex: interdiction de frapper déduite de l'interdiction de dire 'Ouf').<br>- **Ma'na al-Khitab** : Le Qiyas (Analogie).",
                deepDive: {
                    title: "Note Importante",
                    content: "Ce n'est pas purement rationnel. C'est un mélange de **Lugha** (Langue) et de **Sharia** (Loi). On ne peut comprendre la loi sans la langue."
                }
            },
            {
                title: "5. Le Débat : Haqiqa vs {Majaz}",
                content: "Al-Baji affirme que le Livre contient du {Majaz} (Métaphore). C'est un débat théologique. Si on utilise '{Majaz}' pour décrire un style linguistique (éloquence), c'est acceptable. Mais les Mu'tazila l'ont utilisé pour nier les Attributs d'Allah.",
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
                content: "Tout texte sacré possède deux facettes :<br>1. **{Al-Mantuq}** (Le Prononcé) : Ce que le mot indique explicitement (Ex: 'Honore les étudiants').<br>2. **{Al-Mafhum}** (Le Compris) : Ce qui est déduit sans être dit (Ex: Ne pas honorer les paresseux).",
                deepDive: {
                    title: "Exemple Coranique",
                    content: "L'interdiction de dire 'Ouf' aux parents est le **{Al-Mantuq}**. L'interdiction de les frapper n'est pas prononcée, mais elle est comprise par le **{Al-Mafhum}** (si 'Ouf' est interdit, les frapper l'est a fortiori)."
                }
            },
            {
                title: "2. {Mafhum al-Muwafaqa} (Concordance)",
                content: "C'est lorsque le jugement de l'implicite concorde avec le prononcé. Il a deux degrés :<br>- **{Fahwa al-Khitab}** : L'implicite est *plus fort* que le prononcé (Frapper > dire Ouf).<br>- **{Lahn al-Khitab}** : L'implicite est *égal* au prononcé (Brûler l'argent de l'orphelin est égal à le manger, car c'est une destruction)."
            },
            {
                title: "3. {Mafhum al-Mukhalafa} (Divergence)",
                content: "Aussi appelé **{Dalil al-Khitab}**. C'est lorsque le jugement implicite est l'inverse du prononcé.<br>Exemple : 'Pas de testament pour l'héritier'.<br>Mantuq : Interdit pour l'héritier.<br>Mafhum : Permis pour le non-héritier.",
                deepDive: {
                    title: "Les 10 types",
                    content: "L'Imam Ibn Ghazi a recensé 10 types de {Mafhum al-Mukhalafa}, incluant la condition, la description, le but, et le nombre."
                }
            },
            {
                title: "4. Le Débat sur le Nombre ({Mafhum al-'Adad})",
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
    },
    {
        id: 3,
        title: "Introduction à Al-Khulasa & Histoire des Écoles",
        author: "Dr. Muhammad Hasan Hito",
        videoUrl: "https://youtu.be/2Djsq0fghsU?si=hGJzyBhPeGnx72_N",
        intro: "Cours magistral complet sur la généalogie de la science des Oussoul. De l'instinct des Compagnons à la divergence méthodologique majeure entre Théologiens et Juristes, jusqu'à la bibliographie critique du cursus.",
        sections: [
            {
                title: "1. Présentation du Livre : Al-Khulasa",
                content: "Le livre support est **Al-Khulasa fi Usul al-Fiqh** (Le Résumé) du Dr. Muhammad Hasan Hito. C'est un ouvrage concis (env. 136 pages) qui synthétise les principes de l'école des {Mutakallimin}.<br>Il reprend l'esprit du célèbre **Al-Waraqat** de l'Imam Al-Juwayni, mais avec une approche moderne :<br>1. **Simplification** : L'auteur évite le style complexe des anciens pour rendre la science accessible.<br>2. **Esprit vs Lettre** : Il garde la structure (l'esprit) de Juwayni mais change la formulation pour s'adapter aux contemporains.",
                deepDive: {
                    title: "Le Conseil de Lecture",
                    content: "Pour bien débuter, il est conseillé de lire d'abord les introductions de deux livres : 'Mabadi al-Usul' (pour l'école Hanafite) et 'Al-Khulasa' (pour l'école des Théologiens) afin d'avoir une vue d'ensemble."
                }
            },
            {
                title: "2. L'Histoire : Pourquoi les Oussoul sont une 'Science Nouvelle' ?",
                content: "Ibn Khaldun qualifie les Oussoul de science 'Mustahdatha' (créée tardivement). Pourquoi les Compagnons (Sahaba) n'en avaient-ils pas besoin ?<br><br>**A. La {Saliqa} (L'Instinct Linguistique) :**<br>Les Compagnons possédaient une maîtrise innée de la langue. Ils n'avaient pas besoin de règles pour savoir que :<br>- **{Man}** (Qui) désigne les êtres doués de raison (le Prophète demandait 'Qui est là ?' pour une personne).<br>- **{Ma}** (Quoi) désigne les objets ou animaux.<br>- Si on dit '10', c'est restrictif (ce n'est ni 9 ni 11).<br>Tout cela était compris naturellement par leur instinct ({Saliqa}).<br><br>**B. L'Absence d'Intermédiaires :**<br>Ils vivaient la Révélation en direct. Ils n'avaient besoin ni de :<br>- **Isnad** (chaîne de transmission) car ils entendaient le Prophète.<br>- **Asbab al-Nuzul** (causes de révélation) car ils étaient présents lors de l'événement.",
            },
            {
                title: "3. La Transition et la Codification",
                content: "Avec l'expansion de l'Islam et le mélange avec les non-Arabes, la {Saliqa} s'est affaiblie. Le besoin de règles écrites est apparu pour préserver la compréhension.<br><br>**Le Rôle d'Al-Shafi'i :**<br>L'Imam Al-Shafi'i n'a pas inventé les Oussoul (Abu Hanifa et Malik les pratiquaient déjà), mais il est le **premier à les avoir codifiés** dans son livre *Al-Risala*.<br>Il a transformé une compétence implicite ({Malika}) en une science explicite, définissant des concepts comme le {Naskh} (abrogation) ou l'acceptation du Hadith Ahad."
            },
            {
                title: "4. Le Grand Schisme Méthodologique : {Mutakallimin} vs {Fuqaha}",
                content: "Il existe deux grandes manières d'écrire les Oussoul :<br><br>**A. L'École des {Mutakallimin} (Théologiens)**<br>- **Qui ?** : Shafi'ites, Malikites, Hanbalites (La Majorité/Jumhur).<br>- **Méthode** : {Tajrid} (Abstraction). Ils établissent la règle théorique pure, basée sur la raison et les textes, sans regarder les branches du Fiqh ({Furu'}).<br>- **Logique** : La Règle est Juge. Si un cas pratique contredit la règle, le cas est rejeté. Ils visent à **Fonder** ({Ta'sis}) la loi.<br><br>**B. L'École des {Fuqaha} (Hanafites)**<br>- **Qui ?** : Les Hanafites uniquement.<br>- **Méthode** : {Istinbat} (Extraction) et {Mazj} (Mélange). Abu Hanifa n'ayant pas écrit de livre d'Oussoul, ses élèves ont déduit ses règles en analysant ses milliers de jugements pratiques.<br>- **Logique** : Le Fiqh est Juge. Si la règle contredit le jugement de l'Imam, on adapte la règle ou on crée une exception. Ils visent à **Confirmer** ({Taqrir}) la pratique de l'école. ",
                deepDive: {
                    title: "Exemple de différence",
                    content: "Chez les {Mutakallimin}, on nettoie la règle de tout exemple pratique. Chez les {Fuqaha}, on mélange la règle avec l'exemple car la règle est née de l'exemple."
                }
            },
            {
                title: "5. La Bibliothèque Idéale : Les 4 Piliers des {Mutakallimin}",
                content: "Toute la science des Oussoul selon la méthode des Théologiens repose sur quatre livres fondateurs :<br>1. **Al-Amad** (Qadi Abd al-Jabbar) - *Auteur Mu'tazilite*.<br>2. **Al-Mu'tamad** (Abu al-Husayn al-Basri) - *Auteur Mu'tazilite* (explication du premier).<br>3. **Al-Burhan** (Imam Al-Juwayni) - *Shafi'ite* ('Le livre le plus robuste' selon Al-Subki).<br>4. **Al-Mustasfa** (Imam Al-Ghazali) - *Shafi'ite*.<br><br>*Note : Bien que deux auteurs soient Mu'tazilites (secte théologique), leurs ouvrages sont fondateurs pour leur rigueur logique dans l'argumentation.*"
            },
            {
                title: "6. Les Synthèses et l'Évolution Littéraire",
                content: "Ces quatre piliers ont ensuite été résumés et raffinés par deux géants :<br><br>**A. Les Deux Raffineurs (Al-Muhaqqiqan)**<br>1. **Fakhr al-Din al-Razi** dans *Al-Mahsul* : Il a compilé les 4 livres. Son style est concis, très structuré et organisé.<br>2. **Sayf al-Din al-Amidi** dans *Al-Ihkam* : Il a aussi compilé les 4, mais avec un style prolixe. Il peut citer 40 preuves pour un seul avis, au point où 'on oublie le début quand on arrive à la fin'.<br><br>**B. Les Résumés Étudiants (Mukhtasarat)**<br>Les livres de Razi et Amidi étant trop denses, ils ont été résumés pour l'enseignement :<br>- *Al-Minhaj* d'Al-Baydawi (Résumé de Razi).<br>- *Mukhtasar* d'Ibn al-Hajib (Résumé de Amidi).<br><br>**C. La Méthode Combinée (Muta'akhireen)**<br>Finalement, des savants ont fusionné la méthode des Théologiens et celle des Hanafites :<br>- **Taj al-Din al-Subki** dans *Jam' al-Jawami'* (Shafi'ite qui cite les Hanafites).<br>- **Ibn al-Humam** dans *Al-Tahrir* (Hanafite qui cite les Shafi'ites)."
            }
        ]
    }
];