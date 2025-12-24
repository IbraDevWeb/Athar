// Fichier: ussul_data.js
const USSUL_LESSONS = [
    {
        id: 1,
        title: "Introduction à Al-Khulasa & Histoire des Écoles",
        author: "Dr. Muhammad Hasan Hito",
        videoUrl: "https://youtu.be/2Djsq0fghsU?si=hGJzyBhPeGnx72_N",
        intro: "Cours magistral complet sur la généalogie de la science des Oussoul. De l'instinct des Compagnons à la divergence méthodologique majeure entre Théologiens et Juristes, jusqu'à la bibliographie critique du cursus.",
        sections: [
            {
                title: "1. Présentation du Livre : Al-Khulasa",
                content: "Le livre support est **Al-Khulasa fi Usul al-Fiqh** (Le Résumé) du Dr. Muhammad Hasan Hito. C'est un ouvrage concis qui synthétise les principes de l'école des {Mutakallimin}.<br>Il reprend l'esprit du célèbre **Al-Waraqat** de l'Imam Al-Juwayni, mais avec une approche moderne :<br>1. **Simplification** : L'auteur évite le style complexe des anciens pour rendre la science accessible.<br>2. **Esprit vs Lettre** : Il garde la structure (l'esprit) de Juwayni mais change la formulation pour s'adapter aux contemporains.",
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
                content: "Avec l'expansion de l'Islam et le mélange avec les non-Arabes, la {Saliqa} s'est affaiblie. Le besoin de règles écrites est apparu pour préserver la compréhension.<br><br>**Le Rôle d'Al-Shafi'i :**<br>L'Imam Al-Shafi'i n'a pas inventé les Oussoul (Abu Hanifa et Malik les pratiquaient déjà), mais il est le **premier à les avoir codifiés** dans son livre **Al-Risala**.<br>Il a transformé une compétence implicite ({Malika}) en une science explicite, définissant des concepts comme le {Naskh} (abrogation) ou l'acceptation du Hadith Ahad."
            },
            {
                title: "4. Le Grand Schisme Méthodologique : Mutakallimin vs Fuqaha",
                content: "Il existe deux grandes manières d'écrire les Oussoul :<br><br>**A. L'École des {Mutakallimin} (Théologiens)**<br>- **Qui ?** : Shafi'ites, Malikites, Hanbalites (La Majorité/Jumhur).<br>- **Méthode** : {Tajrid} (Abstraction). Ils établissent la règle théorique pure, basée sur la raison et les textes, sans regarder les branches du Fiqh ({Furu'}).<br>- **Logique** : La Règle est Juge. Si un cas pratique contredit la règle, le cas est rejeté. Ils visent à **Fonder** ({Ta'sis}) la loi.<br><br>**B. L'École des {Fuqaha} (Hanafites)**<br>- **Qui ?** : Les Hanafites uniquement.<br>- **Méthode** : {Istinbat} (Extraction) et {Mazj} (Mélange). Abu Hanifa n'ayant pas écrit de livre d'Oussoul, ses élèves ont déduit ses règles en analysant ses milliers de jugements pratiques.<br>- **Logique** : Le Fiqh est Juge. Si la règle contredit le jugement de l'Imam, on adapte la règle ou on crée une exception. Ils visent à **Confirmer** ({Taqrir}) la pratique de l'école. ",
                deepDive: {
                    title: "Exemple de différence",
                    content: "Chez les {Mutakallimin}, on nettoie la règle de tout exemple pratique. Chez les {Fuqaha}, on mélange la règle avec l'exemple car la règle est née de l'exemple."
                }
            },
            {
                title: "5. La Bibliothèque Idéale : Les 4 Piliers des {Mutakallimin}",
                content: "Toute la science des Oussoul selon la méthode des Théologiens repose sur quatre livres fondateurs :<br>1. **Al-Amad** (Qadi Abd al-Jabbar) - Auteur Mu'tazilite.<br>2. **Al-Mu'tamad** (Abu al-Husayn al-Basri) - Auteur Mu'tazilite (explication du premier).<br>3. **Al-Burhan** (Imam Al-Juwayni) - **Shafi'ite** ('Le livre le plus robuste' selon Al-Subki).<br>4. **Al-Mustasfa** (Imam Al-Ghazali) - **Shafi'ite**.<br><br>Note : Bien que deux auteurs soient Mu'tazilites (secte théologique), leurs ouvrages sont fondateurs pour leur rigueur logique dans l'argumentation."
            },
            {
                title: "6. Les Synthèses et l'Évolution Littéraire",
                content: "Ces quatre piliers ont ensuite été résumés et raffinés par deux géants :<br><br>**A. Les Deux Raffineurs (Al-Muhaqqiqan)**<br>1. **Fakhr al-Din al-Razi** dans **Al-Mahsul** : Il a compilé les 4 livres. Son style est concis, très structuré et organisé.<br>2. **Sayf al-Din al-Amidi** dans **Al-Ihkam** : Il a aussi compilé les 4, mais avec un style prolixe. Il peut citer 40 preuves pour un seul avis, au point où 'on oublie le début quand on arrive à la fin'.<br><br>**B. Les Résumés Étudiants (Mukhtasarat)**<br>Les livres de Razi et Amidi étant trop denses, ils ont été résumés pour l'enseignement :<br>- **Al-Minhaj** d'Al-Baydawi (Résumé de Razi).<br>- **Mukhtasar** d'Ibn al-Hajib (Résumé de Amidi).<br><br>**C. La Méthode Combinée (Muta'akhireen)**<br>Finalement, des savants ont fusionné la méthode des Théologiens et celle des Hanafites :<br>- **Taj al-Din al-Subki** dans *Jam' al-Jawami'* (Shafi'ite qui cite les Hanafites).<br>- **Ibn al-Humam** dans **Al-Tahrir** (Hanafite qui cite les Shafi'ites)."
            }
        ]
    },
    {
        id: 2,
        title: "Définitions Fondamentales & Structure de la Science",
        author: "Dr. Muhammad Hasan Hito",
        videoUrl: "https://youtu.be/r-6yO7sucBI?si=gagTdJZjFxyB8LtA",
        intro: "Analyse complète de la définition des Oussoul al-Fiqh. Distinction cruciale entre la preuve globale ({Dalil Ijmali}) et détaillée ({Dalil Tafsili}), et application du syllogisme logique pour déduire la loi.",
        sections: [
            {
                title: "1. La Définition Linguistique : Décomposer le terme",
                content: "Avant de devenir une science codifiée, 'Usul al-Fiqh' est un terme composé de deux mots qu'il faut définir séparément pour dissiper l'inconnu.<br><br>**A. {Al-Asl} (Le Fondement)** :<br>Linguistiquement, c'est ce sur quoi autre chose est bâti (comme les fondations d'un mur).<br>Techniquement, le mot {Asl} a plusieurs sens, dont deux principaux ici :<br>1. **Le Preuve ({Dalil})** : Quand on dit 'L'origine de cette question est le Coran'.<br>2. **La Règle Constante ({Qa'ida Mustamirra})** : Une règle qui ne change pas, ex: 'L'origine dans la bête morte est l'interdiction'.<br><br>**B. {Al-Fiqh} (La Compréhension)** :<br>Linguistiquement, c'est la compréhension, parfois subtile (ex: le peuple de Shu'ayb ne comprenait pas ses principes).<br>Techniquement (selon Al-Juwayni) : C'est la connaissance des jugements légaux ({Ahkam Shar'iyya}) acquis par la voie de l'effort intellectuel ({Ijtihad}).",
                deepDive: {
                    title: "Ce qui n'est pas du Fiqh",
                    content: "Savoir que les 5 prières sont obligatoires n'est pas techniquement du 'Fiqh' mais une 'Connaissance nécessaire' ({Ma'lum min al-din bid-darura}). Le Fiqh concerne ce qui est spéculatif et demande réflexion, comme savoir que l'intention est obligatoire pour le Wudu."
                }
            },
            {
                title: "2. Le Sujet et les Sources",
                content: "**Le Sujet :** La science du Fiqh étudie les actions du **{Mukallaf}** (la personne responsable) sous l'angle du Licite ({Halal}) et de l'Illicite ({Haram}), et non sa physiologie ou ses croyances.<br>**Les Sources :** Le Coran, la Sunna, le Consensus ({Ijma}) et l'Analogie ({Qiyas}).<br><br>**L'Art du Mujtahid :**<br>Le rôle du savant est de rassembler les textes. Exemple : Le Prophète ﷺ a expliqué le terme 'Injustice' ({Zulm}) de la Sourate Al-An'am (qui effrayait les Sahaba) par le verset de la Sourate Luqman définissant le Shirk comme une 'immense injustice'. C'est cela, l'association des preuves."
            },
            {
                title: "3. La Définition Technique (Istilahiyya)",
                content: "Une fois devenu un titre de science, Usul al-Fiqh se définit par trois piliers :<br>1. **Connaissance des Preuves Globales ({Dalail Ijmaliyya})**.<br>2. **Méthode d'utilisation (Comment en tirer profit)**.<br>3. **État du Bénéficiaire ({Hal al-Mustafid})** : C'est-à-dire le Mujtahid.<br><br>C'est comme la médecine : le médicament est le texte, le médecin est l'Oussouli qui t'apprend à l'utiliser. Sans méthode, on se nuit à soi-même.",
            },
            {
                title: "4. Distinction Clé : Preuve Globale vs Détaillée",
                content: "C'est la frontière entre l'Oussouli et le Faqih.<br><br>**A. {Dalil Tafsili} (Preuve Détaillée) - Domaine du Faqih** :<br>Concerne une question précise. Ex: Le verset 'Accomplissez la prière'. Il ne concerne que la prière, pas la Zakat. Le Faqih étudie ces détails.<br><br>**B. {Dalil Ijmali} (Preuve Globale) - Domaine de l'Oussouli** :<br>C'est une règle universelle. Ex: 'L'Impératif implique l'Obligation'. Cette règle s'applique à la prière, au jeûne, au Hajj, etc. L'Oussouli fournit les outils (règles globales) et le Faqih les applique aux matériaux (versets détaillés). ",
                deepDive: {
                    title: "Gestion des Conflits",
                    content: "Les Oussoul servent aussi à résoudre les contradictions apparentes ({Ta'arud}). Ex: Le hadith général 'Purifiez-vous de l'urine' vs le hadith spécifique autorisant l'urine de chameau pour le soin. La règle Oussouli dit : 'Le Spécifique prévaut sur le Général'."
                }
            },
            {
                title: "5. L'Application Logique : Le Syllogisme Juridique",
                content: "Comment produit-on une Fatwa ? En utilisant un **{Qiyas Mantiqi}** (Syllogisme Logique) qui combine le travail du Faqih et de l'Oussouli.<br><br>**L'Équation :**<br>1. **Prémisse Mineure** (Donnée par le Fiqh/Texte) :<br>*'Accomplissez la Prière' est un ordre.*<br>2. **Prémisse Majeure** (Donnée par les Oussoul/Règle) :<br>*Tout ordre dans le texte implique l'Obligation (sauf preuve contraire).*<br>3. **Conclusion** (Jugement) :<br>*Donc, la Prière est Obligatoire.*<br><br>Sans les Oussoul, on ne peut pas passer du texte au jugement. C'est la balance qui pèse l'or. "
            }
        ]
    },
    {
        id: 3,
        title: "Les Niveaux de Perception & La Science du Hadith",
        author: "Dr. Muhammad Hasan Hito",
        videoUrl: "https://youtu.be/of_2814q-ck?si=Zl9CaOoPm6s3tmnL",
        intro: "Cours fondamental sur l'épistémologie islamique : Comment savons-nous ce que nous savons ? Étude détaillée de la hiérarchie de la certitude (du Doute au Yaqin), de la classification de l'Ignorance, et de la valeur probante du Hadith (Mutawatir vs Ahad).",
        sections: [
            {
                title: "1. La Hiérarchie de la Perception (Maratib al-Idrak)",
                content: "Avant d'étudier les textes, il faut comprendre comment l'esprit humain juge une information. Il existe 5 degrés de 'relation de l'âme à l'information' :<br><br>**1. {Al-Yaqin} / {Al-'Ilm} (La Certitude - 100%)** :<br>C'est une perception ferme, conforme à la réalité et fondée sur une preuve. Elle n'accepte aucun doute. Ex : 'Le feu brûle' ou '1+1=2'.<br>**L'argument du Magicien :** Si un magicien transforme un bâton en serpent pour prouver que 'la neige est noire', on s'étonnera de sa magie, mais on gardera la certitude que la neige est blanche. Les miracles ne changent pas les vérités rationnelles.<br><br>**2. {Al-Zann} (L'Opinion Prépondérante - 51% à 99%)** :<br>C'est le domaine du Fiqh. Il y a une possibilité d'erreur, mais le côté 'Vrai' pèse plus lourd. Ex : Les prévisions météo ou le témoignage d'un homme honnête (il peut se tromper, mais on le croit généralement).<br><br>**3. {Al-Shakk} (Le Doute - 50%)** :<br>L'hésitation parfaite. 'Est-ce un homme ou une statue au loin ?'. Les deux options sont égales, sans prédominance.<br><br>**4. {Al-Wahm} (L'Illusion - 1% à 49%)** :<br>C'est le côté faible d'une hypothèse. Si le {Zann} est le côté fort (ex: 'C'est un homme'), le {Wahm} est l'erreur probable (ex: 'C'est peut-être une statue').<br><br>**5. {Al-Jahl} (L'Ignorance / Le Faux - 0%)**.<br>",
            },
            {
                title: "2. La Classification de l'Ignorance (Al-Jahl)",
                content: "L'ignorance n'est pas seulement l'absence de savoir. Elle se divise en deux :<br><br>**A. {Jahl Basit} (Ignorance Simple)** :<br>Ne pas savoir, et savoir qu'on ne sait pas. C'est l'état de celui qui admet 'Je ne sais pas'. Il est facile à enseigner.<br><br>**B. {Jahl Murakkab} (Ignorance Composée)** :<br>Ne pas savoir, mais être persuadé de savoir. C'est percevoir la réalité à l'inverse de ce qu'elle est (ex: croire que le monde est éternel ou que l'idole est un dieu). C'est le plus dangereux car le malade se croit médecin.",
                deepDive: {
                    title: "Le Fléau du Ta'alum",
                    content: "L'auteur met en garde contre les 'Mutafayhiqun' (pseudo-savants) atteints d'ignorance composée, qui prétendent à la connaissance sans en avoir les outils."
                }
            },
            {
                title: "3. La Science du Hadith : Mutawatir vs Ahad",
                content: "Comment les informations religieuses nous parviennent-elles ? Les Oussouliyyun (contrairement parfois aux Muhaddithun) divisent strictement l'information en deux :<br><br>**A. {Al-Mutawatir} (L'Information Récurrente)** :<br>- **Définition** : Rapporté par un groupe si nombreux (foule à chaque génération) qu'il est impossible qu'ils se soient accordés sur un mensonge.<br>- **Condition** : Doit reposer sur le **Sens** (Vue/Ouïe), pas la Raison. (Ex: Si des millions de bouddhistes disent 'Bouddha est Dieu', ce n'est pas un Mutawatir valide car 'Dieu' est un concept rationnel, pas visible. Par contre, s'ils disent 'Nous avons vu Bouddha', c'est valide sur le fait de l'avoir vu).<br>- **Statut** : Donne la **Certitude ({Yaqin})**. Le nier est du **Kufr** (Mécréance). Le Coran est entièrement Mutawatir.<br><br>**B. {Al-Ahad} (L'Information Singulière)** :<br>- **Définition** : Tout ce qui n'atteint pas le seuil du Mutawatir (même si rapporté par 3 ou 4 personnes). La majorité de la Sunna est Ahad.<br>- **Statut** : Donne le **{Zann}** (Speculation).<br>- **Règle d'Or** : On **DOIT** agir selon le Hadith Ahad (Fiqh/Pratique) même s'il ne donne pas une certitude absolue de foi. Le nier est du **Fisq** (Péché grave) mais pas du Kufr. ",
                deepDive: {
                    title: "Pourquoi agir sur le doute ?",
                    content: "Allah nous a ordonné d'agir sur la prépondérance ({Ghalabat al-Zann}). Quand tu pries vers la Qibla, tu n'es pas sûr à 100,00% de l'angle exact au millimètre, mais ton Zann suffit pour valider l'acte. Idem pour le hadith authentique."
                }
            },
            {
                title: "4. Types de Savoir : Nécessaire vs Acquis",
                content: "Le savoir ({Ilm}) n'est pas uniforme :<br><br>**1. {Ilm Daruri} (Savoir Nécessaire/Évident)** :<br>Ne nécessite aucune réflexion. Ex : Le feu brûle, le tout est plus grand que la partie. Si un enfant voit un chameau essayer d'entrer dans le chas d'une aiguille, il rira car son instinct sait que c'est impossible. C'est intuitif.<br><br>**2. {Ilm Nazari} (Savoir Théorique/Acquis)** :<br>Nécessite {Nazar} (Réflexion) et {Istidlal} (Déduction). Ex : Savoir que le monde est créé (nécessite d'observer le changement), ou que la somme des angles d'un triangle = 180°. Ce n'est pas inné, ça s'apprend."
            }
        ]
    },
    {
        id: 6,
        title: "Le Jugement Légal (Al-Hukm Al-Shar'i)",
        author: "Dr. Muhammad Hasan Hito",
        videoUrl: "https://youtu.be/vEM7OC0XkU8?si=lKCUdkehwjoTQKy-",
        intro: "Anatomie complète du Jugement Légal selon la définition canonique d'Ibn Al-Hajib. Analyse des concepts de Demande (Iqtida), de Choix (Takhyir) et de Situation (Wad'), et la distinction subtile entre l'Acte de Dieu (Ijab) et l'Acte de l'Homme (Wajib).",
        sections: [
            {
                title: "1. La Définition de Référence",
                content: "Ibn Al-Hajib définit le **{Hukm Shar'i}** ainsi :<br><em>'Le Discours d'Allah ({Khitab Allah}) lié aux actions des responsables ({Mukallafin}), par voie de Demande ({Iqtida}), de Choix ({Takhyir}) ou de Situation ({Wad'}).'</em><br>Cette définition est la fondation de tout le chapitre et nécessite une décomposition minutieuse.",
            },
            {
                title: "2. Analyse : 'Lié aux Actions, pas aux Essences'",
                content: "Le jugement divin ne vise pas la matière ({Dhat}) mais l'acte ({Fi'l}).<br>- **Exemple du Porc** : Quand on dit 'Le porc est {Haram}', c'est une métaphore ({Majaz}). La vérité juridique est : 'Manger du porc est Haram'. L'interdiction ne tombe pas sur l'animal (essence), mais sur l'action de le consommer.<br>- **Règle** : Ce {Majaz} est devenu si célèbre qu'il est compris instinctivement sans besoin de préciser l'acte.",
                deepDive: {
                    title: "Le Concept de {Kalam Nafsi}",
                    content: "Quand on parle de 'Discours d'Allah', on parle de Son Attribut éternel ({Kalam Nafsi}) et non des lettres et sons créés. Les mots du Coran sont l'expression créée qui indique cette signification éternelle. Si l'humanité s'accorde ({Ijma}) sur un jugement, elle révèle ce Discours éternel."
                }
            },
            {
                title: "3. Les Trois Modes du Discours : {Iqtida}, {Takhyir}, {Wad'}",
                content: "Le Discours divin s'adresse à nous de trois manières :<br><br>**A. {Al-Iqtida} (La Demande/Exigence)** :<br>Le Législateur demande quelque chose. Cela se divise en 4 selon l'intensité :<br>1. Demande de **Faire** avec fermeté ({Jazm}) = **{Al-Ijab}** (Obligation).<br>2. Demande de **Faire** sans fermeté = **{Al-Nad b}** (Recommandation).<br>3. Demande de **Laisser** avec fermeté = **{Al-Tahrim}** (Interdiction).<br>4. Demande de **Laisser** sans fermeté = **{Al-Karaha}** (Détestation).<br><br>**B. {Al-Takhyir} (Le Choix)** :<br>Le Législateur laisse le choix entre faire et ne pas faire. Cela donne un seul statut : **{Al-Ibaha}** (Permission).<br><br>**C. {Al-Wad'} (La Situation/Mise en place)** :<br>Allah place des signes. Il lie un phénomène naturel à un jugement.<br>- *Exemple* : Le déclin du soleil ({Duluk}) est la **Cause ({Sabab})** de la prière. Ce n'est pas le fidèle qui cause le temps, c'est Allah qui a 'posé' ({Wada'a}) ce signe comme indicateur. "
            },
            {
                title: "4. Distinction Subtile : {Al-Ijab} vs {Al-Wajib}",
                content: "Il y a une différence majeure entre l'acte de Dieu et l'acte de l'Homme, comme la différence entre le Créateur et la créature.<br><br>**{Al-Ijab} (L'Action d'Obliger)** :<br>C'est le **Discours d'Allah**. C'est un attribut ancien et éternel.<br>**{Al-Wajib} (L'Acte Obligatoire)** :<br>C'est l'**Action du Serviteur** (ex: la Prière). C'est un acte créé et temporel.<br><br>Ainsi, on dit : 'Le jugement d'Allah est l'{Ijab} (l'ordre d'obliger), et ma prière est le {Wajib} (la chose obligée)'."
            },
            {
                title: "5. Les 5 Statuts du {Hukm Taklifi}",
                content: "Définis par leurs conséquences dans l'au-delà (Thawab/Iqab) :<br><br>1. **{Al-Wajib}** : Récompensé si fait, puni si délaissé **intentionnellement** ({'Amdan}). (Oublier n'entraîne pas de punition).<br>2. **{Al-Mandub}** : Récompensé si fait, non puni si délaissé.<br>3. **{Al-Haram}** : Récompensé si délaissé (pour Dieu), puni si fait **intentionnellement**.<br>4. **{Al-Makruh}** : Récompensé si délaissé, non puni si fait (ex: boire debout ou se tourner les pouces).<br>5. **{Al-Mubah}** : Ni récompense ni punition en soi. (Mais peut devenir méritoire selon l'intention, ex: manger pour avoir la force de prier).",
                deepDive: {
                    title: "Note Comparative (Hanafites)",
                    content: "Pour les Mutakallimin (Shafi'ites, etc.), {Fard} et {Wajib} sont synonymes. Pour les Hanafites, le {Fard} est prouvé par un texte certain (Coran), le {Wajib} par un texte spéculatif (Hadith Ahad). De même, ils distinguent le Makruh 'Tanzihi' (léger) du Makruh 'Tahrimi' (proche de l'interdit)."
                }
            }
        ]
    },
    {
        id: 5,
        title: "Le Jugement Situationnel (Al-Hukm Al-Wad'i)",
        author: "Dr. Muhammad Hasan Hito",
        videoUrl: "https://youtu.be/R0eV-2uwI9g?si=TZxzYBpnuU59Rcr3",
        intro: "Étude approfondie du deuxième versant du Jugement Légal : le Jugement Situationnel. Distinction entre les Signes (Wad') et les Ordres (Taklif), et analyse détaillée des Causes, Conditions, Empêchements, Validité et Nullité.",
        sections: [
            {
                title: "1. La Nature du Discours Divin : Signe vs Ordre",
                content: "Le Discours de la Charia se divise en deux types fondamentaux :<br><br>**A. {Hukm Taklifi} (Jugement d'Obligation)** :<br>C'est un discours qui demande de faire ou de ne pas faire (Halal/Haram). Il s'adresse directement à l'acte du responsable.<br><br>**B. {Hukm Wad'i} (Jugement Situationnel)** :<br>C'est un discours d'information ({I'lam}) qui établit des **Signes ({Alamat})**. Il n'ordonne rien directement, mais lie des phénomènes entre eux.<br>- *Analogie routière :* Le feu rouge est un signe posé ({Wad'}) pour indiquer l'arrêt. Le signe lui-même n'est pas l'action, mais l'indicateur du moment de l'action.",
            },
            {
                title: "2. Les Composantes du Hukm Wad'i",
                content: "Le Jugement Situationnel définit les liens entre les événements juridiques. Il comprend 5 éléments majeurs :<br><br>**1. La Cause ({Sabab})** :<br>Ce dont l'existence entraîne l'existence du jugement, et l'absence entraîne l'absence. Il y a une corrélation dans les deux sens (Existence/Néant).<br>Exemple : L'ivresse ({Iskar}) est la cause de l'interdiction. Pas d'ivresse = Pas d'interdiction. Ivresse = Interdiction.<br><br>**2. La Condition ({Shart})** :<br>Ce dont l'absence entraîne l'absence du jugement, mais dont la présence n'entraîne pas forcément la présence.<br>Exemple : Le Wudu (ablutions) pour la prière. Sans Wudu, pas de prière valide. Mais avoir le Wudu ne t'oblige pas à prier à l'instant.<br><br>**3. L'Empêchement ({Mani'})** :<br>Ce dont la présence entraîne l'absence du jugement.<br>Exemple : Les menstrues ({Hayd}). Si elles sont là, la prière est empêchée. Si elles partent, la prière n'est pas forcément valide (car il faut aussi le Wudu, etc.). "
            },
            {
                title: "3. Validité et Nullité : Sahih vs Batil",
                content: "C'est le jugement porté sur la conformité de l'acte :<br><br>**A. Le Valide ({Sahih})** :<br>Ce qui remplit ses conditions et piliers. L'effet juridique s'applique (la prière compte, la vente transfère la propriété).<br>**Note importante :** En Fiqh, on juge la **Validité** (conformité extérieure), pas l'**Acceptation ({Qabul})** qui est une affaire divine secrète.<br><br>**B. Le Nul ({Batil}) / Le Vicié ({Fasid})** :<br>Ce qui ne remplit pas les conditions et n'a aucun effet juridique.<br>- **Chez la Majorité (Jumhur)** : {Batil} et {Fasid} sont synonymes. Une prière nulle = une prière viciée.<br>- **Chez les Hanafites** : Ils distinguent les deux dans les transactions ({Mu'amalat}). Le {Fasid} est légal dans son fond mais illégal dans sa forme (ex: vente avec condition), et produit certains effets (propriété imparfaite). Le {Batil} est illégal dans son fond (ex: vente d'alcool) et ne produit rien."
            },
            {
                title: "4. Différences Clés : Taklifi vs Wad'i",
                content: "Pourquoi distinguer ces deux jugements ? Pour comprendre la responsabilité.<br><br>**1. Le Lien avec le {Mukallaf}** :<br>- Le {Taklifi} exige la capacité (être adulte, sain d'esprit). On n'ordonne pas à un enfant.<br>- Le {Wad'i} ne l'exige pas. Il lie des faits. Si un enfant brise une vitre, il doit payer (garantie/{Daman}). Pourquoi ? Car Allah a fait de la **Destruction ({Itlaf})** la **Cause** de la **Garantie**. La cause agit même sur l'enfant.<br><br>**2. L'Action Directe** :<br>- Le {Taklifi} est l'action du serviteur (Prier).<br>- Le {Wad'i} est souvent hors du contrôle du serviteur (Le coucher du soleil déclenche le Maghreb, ce n'est pas l'homme qui le fait coucher)."
            },
            {
                title: "5. Plan du Cursus à Venir",
                content: "L'auteur conclut l'introduction en annonçant la structure du livre :<br>1. Les questions linguistiques.<br>2. Le Coran ({Al-Kitab}).<br>3. La Sunna.<br>4. Le Consensus ({Ijma}).<br>5. L'Analogie ({Qiyas}).<br>**(Ces 4 sont les preuves convenues)**.<br>6. Les preuves divergentes (Istihsan, Masalih...).<br>7. La résolution des conflits ({Ta'arud}).<br>8. L'Ijtihad et le Taqlid."
            }
        ]
    },
    {
        id: 6,
        title: "La Vérité (Haqiqa) & La Métaphore (Majaz)",
        author: "Dr. Muhammad Hasan Hito",
        videoUrl: "https://youtu.be/8dnA-ZDX9Jo?si=iL7CH3IGU7vw-SkX",
        intro: "Introduction aux recherches linguistiques (Mabahith al-Alfaz). Analyse de l'usage des mots : quand le sens est-il littéral (Haqiqa) ou figuré (Majaz) ? Étude des sources du langage (Langue, Loi, Coutume) et des règles d'interprétation.",
        sections: [
            {
                title: "1. Introduction aux Recherches Linguistiques",
                content: "Ce chapitre ouvre la porte des 'Recherches sur les Mots' ({Mabahith al-Alfaz}). L'auteur annonce 8 thèmes majeurs qui s'appliquent aussi bien au Coran qu'à la Sunna, car ces sources reposent sur la langue arabe :<br>1. **{Haqiqa} & {Majaz}** (Vérité & Métaphore).<br>2. **{Mantuq} & {Mafhum}** (Prononcé & Compris).<br>3. **{Amr} & {Nahi}** (Ordre & Interdiction).<br>4. **{Ummum} & {Khusus}** (Général & Spécifique).<br>5. **{Mutlaq} & {Muqayyad}** (Absolu & Restreint).<br>6. **{Mujmal} & {Mubayyin}** (Ambigu & Clarifié).<br>7. **{Zahir} & {Mu'awwal}** (Apparent & Interprété).<br>8. **{Nasikh} & {Mansukh}** (Abrogeant & Abrogé).",
            },
            {
                title: "2. Définition : Haqiqa vs Majaz",
                content: "Tout repose sur le **{Wad'}** (l'Assignation/Institution originelle du mot) :<br><br>**A. {Al-Haqiqa} (La Vérité/Sens Propre)** :<br>C'est l'utilisation d'un mot dans le sens pour lequel il a été **initialement institué** ({Wudi'a lahu}).<br>Exemple : Les Arabes ont assigné le mot 'Lion' ({Asad}) à l'animal prédateur. Si je dis 'J'ai vu un lion' et que je désigne l'animal, c'est une {Haqiqa}.<br><br>**B. {Al-Majaz} (La Métaphore/Sens Figuré)** :<br>C'est l'utilisation d'un mot dans un sens **différent** de son sens originel, en raison d'une relation ({'Alaqa}) entre les deux sens.<br>*Exemple :* Utiliser le mot 'Lion' pour désigner un homme courageux.<br><br>**Note historique :** Ibn Jinni (auteur d'**Al-Khasa'is**) soutient que la majorité de la langue arabe est constituée de {Majaz}, car il apporte une richesse et une beauté indispensables. "
            },
            {
                title: "3. La Règle d'Or : La Qarina (L'Indice)",
                content: "Comment savoir si c'est du {Majaz} ?<br>L'usage figuré nécessite obligatoirement une **{Qarina}** (un indice contextuel) qui empêche le sens propre. La {Haqiqa} est l'origine ({Asl}) et n'a pas besoin de preuve. Le {Majaz} est l'exception ({Far'}) et nécessite une preuve.<br><br>Exemple :<br>- 'J'ai vu un lion.' -> Pas d'indice = Sens propre (Animal).<br>- 'J'ai vu un lion **porter une épée**.' -> 'Porter une épée' est la {Qarina} qui interdit le sens animal (les lions ne portent pas d'épée). Donc, on bascule vers le sens figuré (Guerrier courageux)."
            },
            {
                title: "4. Les 3 Sources de la Vérité (Aqsam al-Haqiqa)",
                content: "Qui décide du sens d'un mot ? Il y a trois 'Instituteurs' ({Wadi'}) possibles :<br><br>**1. {Haqiqa Lughawiyya} (Vérité Linguistique)** :<br>Le sens donné par les fondateurs de la langue.<br>*Ex :* 'Salat' = Invocation/Dua. 'Dabba' = Tout ce qui rampe/marche sur terre (y compris l'homme).<br><br>**2. {Haqiqa Shar'iyya} (Vérité Légale/Religieuse)** :<br>Le sens donné par la Loi Divine, qui prime sur la langue dans les textes religieux.<br>Ex : 'Salat' = Actes spécifiques avec Ruku' et Sujud (et non juste une invocation). Dans le Coran, 'Salat' doit être compris selon cette vérité.<br><br>**3. {Haqiqa Urfiyya} (Vérité Coutumière)** :<br>Le sens donné par l'usage social ou technique.<br>*Ex :* 'Dabba' = Dans la coutume, désigne uniquement les animaux à 4 pattes (cheval, âne), pas l'homme. Si tu traites quelqu'un de 'Dabba', il se vexe, bien que linguistiquement ce soit vrai. ",
                deepDive: {
                    title: "Règle de Conflit",
                    content: "En cas de conflit entre les sens : Dans un contexte religieux, la **Vérité Légale** prime sur la Linguistique. Dans un contexte social ou contractuel, la **Vérité Coutumière** prime sur la Linguistique."
                }
            },
            {
                title: "5. L'Importance de la Terminologie Scientifique",
                content: "L'auteur insiste sur un point méthodologique : On ne définit pas un terme technique avec un dictionnaire général, mais avec le dictionnaire de la science concernée ({Istilah Ahl al-Fann}).<br>- **Le Cœur ({Qalb})** : En médecine = muscle pompe. En Soufisme/Tazkiya = siège de la perception spirituelle.<br>- **L'Acteur ({Fa'il})** : En grammaire = celui qui fait l'action. En Aqida = Allah (l'Agent réel).<br>Expliquer un terme de logique avec un sens linguistique courant est une erreur grave."
            },
            {
                title: "6. Classification du Majaz",
                content: "Le sens figuré se divise selon le type de relation ou de structure :<br><br>**A. {Majaz Mursal} (Métaphore Lâche/Envoyée)** :<br>La relation n'est PAS la ressemblance. Le mot est utilisé à la place d'un autre pour une connexion logique (Cause/Effet, Partie/Tout...).<br>Exemple Coranique : 'Il fait descendre du ciel votre **Subsistance ({Rizq})**'. La subsistance (pain, fruit) ne descend pas du ciel. C'est la **Pluie** (Cause) qui descend. On a nommé la Cause par le nom de l'Effet ({Musabbab}).<br><br>**B. {Majaz 'Aqli} (Métaphore Intellectuelle/Cognitive)** :<br>Le mot reste au sens propre, mais l'attribution de l'action ({Isnad}) est figurée.<br>Exemple : 'Le Prince a construit le barrage'. Le Prince n'a pas posé les pierres (sens propre faux). Ses ouvriers l'ont fait. Mais comme il est la cause ordonnatrice, l'esprit ({'Aql}) valide cette attribution.<br><br>**C. Majaz par Ajout/Omission (Selon Al-Juwayni)** :<br>- **Ajout ({Ziyada})** : 'Rien n'est comme Lui' (Laysa **Ka**-mithlihi shay). La lettre 'Ka' est ajoutée pour l'emphase, sinon cela signifierait 'Rien n'est comme Son semblable' (ce qui impliquerait qu'Il a un semblable).<br>- **Omission ({Nuqsan})** : 'Interroge la ville' (*Was'al al-Qarya*). Sens : Interroge les **gens** de la ville."
            }
        ]
    }
];