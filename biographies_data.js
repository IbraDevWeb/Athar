// Fichier: data.js

         const CHAPTERS_DATA = [
            {
                id: 1, 
                verified: false, // Repérage bibliographique ≠ certification de tous les récits
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Oubayda ibn Al-Jarrah", 
                arabicName: "أبو عبيدة", 
                subtitle: "L'Amin de la Communauté",
                intro: "L'un des dix promis au Paradis. Le confident, le chef respecté. Celui dont le Prophète (ﷺ) a dit : « Chaque communauté a un homme de confiance, et le mien est Abou Oubayda. »",
                heroQuote: "Attribution moursal : « Je pourrais adresser des reproches à certains, sauf à Abou Oubayda. »",
                tags: ["10 Promis", "Muhajirun", "Commandants"],
                genealogy: "Il est Amir ibn Abd-Allah ibn Al-Jarrah ibn Hilal... ibn {Fihr}. Sa lignée rejoint celle du Prophète (ﷺ) en la personne de Fihr. Il est le Qourashite, Al-Fihri, Al-Makki.",
                physicalDesc: "Selon Malik ibn Yakhamir : Un homme grand, très mince, le dos légèrement voûté, au visage émacié et à la barbe légère. Il avait les incisives cassées suite à la bataille d'Ouhoud. Il se teignait les cheveux avec du henné et du katam et portait deux nattes.",
                timeline: [
                    { year: "Avant l'Hégire", desc: "Conversion précoce avec Abou Bakr avant Dar Al-Arqam." },
                    { year: "2 H", desc: "Participe à {Badr}." },
                    { year: "3 H", desc: "Arrache avec ses dents les maillons du casque enfoncés dans la joue du Prophète (ﷺ) à {Ouhoud}." },
                    { year: "10 H", desc: "Envoyé avec la délégation de {Najran} comme 'Homme de Confiance' (Al-Amin)." },
                    { year: "13 H", desc: "Commandant des armées au Sham. Conquête pacifique de {Damas}." },
                    { year: "15 H", desc: "Dirige les armées lors de la bataille décisive de {Yarmouk}." },
                    { year: "18 H (17 H aussi rapporté)", desc: "Décède lors de la peste d'{Amwas} à 58 ans selon la datation principale retenue par le fascicule." }
                ],
                narratives: [
                    { id: 100, title: "L'un des cinq premiers", content: "Il se convertit en même temps qu'Ibn Mazhoun, Oubayda ibn Al-Harith, Abderrahman ibn 'Aouf et Abou Salama, juste après Abou Bakr et avant l'entrée à Dar Al-Arqam." },
                    { id: 101, title: "Le Meilleur Dentiste", content: "À {Ouhoud}, deux maillons du casque du Prophète (ﷺ) s'étaient enfoncés dans sa joue bénie. Craignant de le blesser avec ses mains, Abou Oubayda tira dessus avec ses dents. Il perdit une incisive pour chaque maillon retiré. On disait : « Il n'est pas de plus belle brèche (dentaire) que celle d'Abou Oubayda »." },
                    { id: 102, title: "L'Ascétisme Radical", content: "Oumar (Calife) visita sa demeure de gouverneur au {Sham}. Il n'y vit qu'un bol, une épée et une selle. Oumar pleura : « La {Dounia} nous a tous changés, sauf toi, Abou Oubayda ». Ce dernier répondit : « Ô Prince des croyants, cela nous suffit pour atteindre le lieu de la sieste (la mort). »" },
                    { id: 103, title: "Le Conflit Évité", content: "Envoyé en renfort à l'expédition 'As-Salassil' dirigée par 'Amr ibn Al-'Ass, ce dernier refusa de céder le commandement. Bien qu'étant plus méritant, Abou Oubayda dit : « Le Prophète m'a ordonné de ne pas diverger. Tu es l'émir et je t'obéis ». Il sauva l'unité de l'armée par son humilité." },
                    { id: 104, title: "Face à la Peste", content: "Lors de la peste d'{Amwas}, Oumar lui écrivit : « J'ai besoin de toi, viens tout de suite ». Abou Oubayda comprit qu'Oumar voulait le sauver de la mort. Il répondit : « Je suis au milieu d'une armée musulmane et je ne souhaite pas me sauver moi-même en les laissant. Laisse-moi jusqu'à ce qu'Allah décide de mon sort ». Oumar pleura en lisant la lettre." },
                    { id: 105, title: "Le don de ‘Oumar : plusieurs montants", content: "Un récit rapporte que ‘Oumar fit parvenir à Abou Oubayda 400 ou 4 000 dinars. Abou Oubayda en donna une partie à Mouadh et distribua le reste. Les sommes constituent des variantes de transmission, sans authentification indépendante de la chaîne." },
                    { id: 106, title: "L'expédition du grand poisson", content: "Selon Jâbir dans Sahîh al-Bukhârî (5493–5494), environ trois cents hommes commandés par Abou Oubayda souffrirent de la faim lors de l'expédition d'Al-Khabat. La mer rejeta un énorme poisson appelé al-‘Anbar, dont ils mangèrent environ quinze jours selon ces versions. Abou Oubayda leur permit de s'en nourrir." }
                ],
                hadiths: [
                  {
                    "text": "Chaque communauté a un digne de confiance (Amin) et le digne de confiance de cette communauté est Abou Oubayda !",
                    "narrator": "Le Prophète (ﷺ)",
                    "source": "Al-Bukhârî 3744 (sahîh)"
                  },
                  {
                    "text": "Selon une parole attribuée à Abou Oubayda : « J'aurais aimé être un ovin que ma famille égorge, afin qu'ils mangent sa chair. »",
                    "narrator": "Abou Oubayda",
                    "source": "Siyar, fasc. 01, p. 20 — chaîne interrompue"
                  },
                  {
                    "text": "Le jeûne est une protection tant qu'on ne l'abîme pas.",
                    "narrator": "Le Prophète (ﷺ), transmis par Abou Oubayda",
                    "source": "An-Nasâ’î 2233 (hasan)"
                  }
                ],
                quizData: [
                    { q: "Quel surnom unique le Prophète a-t-il donné à Abou Oubayda ?", opts: ["Le Véridique", "L'Amin (Digne de Confiance)", "Le Sabre d'Allah", "Le Sage"], c: 1, exp: "Il est Amin al-Oumma (Le digne de confiance de la communauté)." },
                    { q: "Pourquoi a-t-il perdu ses dents de devant ?", opts: ["Au combat à l'épée", "En retirant des maillons du visage du Prophète", "De vieillesse", "Par maladie"], c: 1, exp: "Il les a utilisées comme pinces pour retirer le métal enfoncé dans la joue du Prophète à Ouhoud." },
                    { q: "Comment a-t-il réagi quand Oumar a voulu le rappeler pour le sauver de la peste ?", opts: ["Il est parti immédiatement", "Il a refusé de quitter son armée", "Il a envoyé sa famille", "Il a démissionné"], c: 1, exp: "Il a répondu qu'il ne valait pas mieux que ses soldats et qu'il resterait avec eux jusqu'à la fin." }
                ]
            },
            {
                id: 2, 
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Talha ibn Oubayd-Allah", 
                arabicName: "طلحة", 
                subtitle: "Le Martyr Vivant",
                intro: "Le Faucon d'Ouhoud. Celui qui fit de son corps un bouclier pour le Messager d'Allah (ﷺ). Surnommé « Le Bon », « Le Brave » et « Le Généreux » par le Prophète lui-même.",
                heroQuote: "Selon une chaîne jugée faible : « Qui souhaite voir un martyr marcher sur terre regarde Talha. »",
                tags: ["10 Promis", "Muhajirun", "Martyrs"],
                genealogy: "Talha ibn Oubayd-Allah... ibn Kaab ibn Saad. Du clan des {Taym}, cousin éloigné d'Abou Bakr. Surnommé Abou Mouhammad.",
                physicalDesc: "Selon Moussa ibn Talha : Un homme à la peau blanche avec un teint rosé (d'autres disent très brun), de taille moyenne (plutôt petit), le torse et les épaules larges. Il avait des pieds imposants. Il ne teignait pas ses cheveux. Il marchait d'un pas vif et son allure traduisait la dignité.",
                timeline: [
                    { year: "Débuts", desc: "L'un des premiers convertis, persécuté à La Mecque." },
                    { year: "2 H", desc: "Absent de {Badr} (en mission commerciale au Sham) mais le Prophète lui attribua sa part de butin et de récompense." },
                    { year: "3 H", desc: "Le jour d'{Ouhoud}, il reçut 24 blessures. Sa main fut paralysée (doigts tranchés) en protégeant le visage du Prophète." },
                    { year: "Surnoms", desc: "Nommé Talha le Bon (Ouhoud), Talha le Brave (Al-Ashira) et Talha le Généreux (Khaybar)." },
                    { year: "36 H", desc: "Meurt lors de la bataille du Chameau ({Al-Jamal}) à 62 ans, tué par une flèche de Marwan ibn Al-Hakam." }
                ],
                narratives: [
                    { id: 201, title: "La défense du Prophète à Ouhoud", content: "Plusieurs récits relatent comment Talha protégea le Prophète (ﷺ) à Ouhoud au prix de blessures à la main et au corps. Une transmission mentionne un cri de douleur et une parole relative à « Bismillah » ; la présence de ces détails dans une notice historique ne les authentifie pas automatiquement mot pour mot." },
                    { id: 202, title: "L'Angoisse du Riche", content: "Il reçut une somme colossale (700 000) de l'Hadramaout qui l'empêcha de dormir. Sa femme Oum Koulthoum (fille d'Abou Bakr) lui conseilla de la partager. Au matin, il ne lui restait plus un dirham." },
                    { id: 203, title: "Les Regrets d'Ali", content: "Après le combat du Chameau, Ali vit le corps de Talha dans un fossé. Il descendit, essuya la poussière de son visage et pleura en disant : « Si seulement j'étais mort vingt ans avant ce jour ! ». Il témoigna que le Prophète avait dit : « Talha et Zoubayr sont mes voisins au Paradis »." },
                    { id: 204, title: "Un récit sur sa sépulture", content: "Un récit transmis rapporte qu'environ trente ans après sa mort, un homme rêva que Talha se plaignait des infiltrations d'eau près de sa tombe. Sa famille aurait fait déplacer sa sépulture ; le narrateur décrit alors son corps comme peu altéré. Une autre version attribue le rêve à sa fille Aïsha. L'épisode est présenté comme une transmission rapportée, non comme un miracle établi." }
                ],
                hadiths: [
                  {
                    "text": "Talha et Zoubayr sont mes deux voisins au Paradis !",
                    "narrator": "Le Prophète (ﷺ)",
                    "source": "At-Tirmidhî 3741 — gharîb, jugé hasan par Darussalam"
                  },
                  {
                    "text": "Le Paradis est obligatoire pour Talha (suite à son action à Ouhoud).",
                    "narrator": "Le Prophète (ﷺ)",
                    "source": "At-Tirmidhî 3738 — hasan"
                  }
                ],
                quizData: [
                    { q: "Quelle blessure Talha a-t-il gardée d'Ouhoud ?", opts: ["Œil crevé", "Main paralysée", "Jambe coupée", "Aucune"], c: 1, exp: "Sa main fut paralysée après avoir stoppé des flèches destinées au Prophète (ﷺ)." },
                    { q: "Quels sont les trois surnoms donnés par le Prophète ?", opts: ["Le Bon, Le Brave, Le Généreux", "Le Lion, L'Épée, Le Sage", "Le Véridique, Le Farouq, Le Riche"], c: 0, exp: "Talha Al-Khayr (Le Bon), Talha Al-Fayyad (Le Brave/Généreux torrentiel), Talha Al-Jud (Le Généreux)." },
                    { q: "Pourquoi était-il absent physiquement à Badr ?", opts: ["Malade", "En voyage au Sham", "Peur", "Pas converti"], c: 1, exp: "Il était en voyage d'affaires (ou d'espionnage selon les versions) au Sham, mais fut compté comme présent." }
                ]
            },
            {
                id: 3,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Zoubayr ibn Al-'Awam",
                arabicName: "الزبير بن العوام",
                subtitle: "Le Hawari du Prophète",
                intro: "Cousin du Prophète (ﷺ) et l'un des dix promis au Paradis. Il est le premier à avoir dégainé une épée pour la cause de l'Islam. Une fidélité sans faille qui lui valut le titre unique d'Apôtre (Hawari).",
                heroQuote: "Chaque prophète a un apôtre (Hawari) et mon apôtre à moi est Zoubayr !",
                tags: ["10 Promis", "Muhajirun", "Martyrs", "Ahl al-Bayt"],
                genealogy: "Il est Zoubayr ibn Al-'Awam ibn Khouwaylid. Cousin du Prophète (ﷺ) par sa tante paternelle {Safiya} bint Abdelmoutalib. Neveu de Khadija.",
                physicalDesc: "Il était très grand (ses pieds touchaient le sol lorsqu'il montait à cheval), très velu, et avait une barbe peu fournie. Il portait sur son corps les cicatrices profondes de coups d'épée (notamment à l'épaule) reçus à Badr et Yarmouk.",
                timeline: [
                    { year: "Jeunesse", desc: "Sa conversion est datée de 8 ou 16 ans selon les transmissions. L'épisode du glaive est distinct et relaté vers 12 ans." },
                    { year: "2 H", desc: "À {Badr}, il aurait porté un turban jaune ; des transmissions évoquent Jibrîl et d'autres les anges sous cette apparence." },
                    { year: "5 H", desc: "À Khandaq, le Prophète réunit ses parents en sacrifice verbal pour lui : « Tire, pour toi mon père et ma mère ! »." },
                    { year: "15 H", desc: "À Yarmouk, il charge seul et perce les rangs ennemis à deux reprises." },
                    { year: "36 H", desc: "Quitte le champ de bataille (Al-Jamal) après un rappel d'Ali. Assassiné traîtreusement par Ibn Jourmouz pendant sa prière." }
                ],
                narratives: [
                    { id: 301, title: "Le Premier Glaive", content: "Enfant, il entendit une rumeur que le Prophète était tué. Il sortit l'épée à la main fendant la foule à la Mecque. Le Prophète lui dit : « Qu'as-tu ? ». Il répondit : « Je suis venu trancher tes assaillants ! ». Le Prophète invoqua pour lui et son épée." },
                    { id: 302, title: "Le Turban Jaune", content: "Il est rapporté que Zoubayr portait un turban jaune à Badr. Selon une transmission, Jibrîl descendit sous cette apparence ; une autre mentionne les anges. Ces versions sont rapportées dans le Siyar sans être réduites à une affirmation unique." },
                    { id: 303, title: "L'Allié contre les Dettes", content: "Avant sa mort, il confia ses dettes massives (2,2 millions) à son fils Abd-Allah en lui disant : « Si tu rencontres une difficulté, appelle mon Maître (Mawla) ». Son fils demanda « Qui est-ce ? ». Il dit : « Allah ». Son fils raconte qu'à chaque difficulté, il invoquait le Maître de Zoubayr et la dette se réglait." },
                    { id: 304, title: "Le Duel de l'Œil", content: "À Badr, il affronta Oubayda ibn Saïd, un guerrier en armure intégrale dont on ne voyait que les yeux. Zoubayr visa l'œil avec son épieu et le tua. Il dut mettre son pied sur le cadavre pour réussir à retirer son arme tant le coup fut violent." }
                ],
                hadiths: [
                  {
                    "text": "Chaque prophète a un hawârî (allié dévoué), et mon hawârî est Zoubayr !",
                    "narrator": "Le Prophète (ﷺ)",
                    "source": "Al-Bukhârî 3719 (sahîh)"
                  },
                  {
                    "text": "Selon une transmission historique, ‘Alî aurait demandé d'annoncer le Feu au meurtrier du fils de Safiya.",
                    "narrator": "Propos attribué à ‘Alî (non prophétique)",
                    "source": "Siyar, fasc. 03, p. 11 — chaîne non classée ici"
                  }
                ],
                quizData: [
                    { q: "Quel est le titre unique donné par le Prophète à Zoubayr ?", opts: ["Saifullah", "Al-Hawari", "Al-Farouq", "As-Siddiq"], c: 1, exp: "C'est Al-Hawari (l'Apôtre/Disciple pur/Allié). Saifullah est Khalid." },
                    { q: "Quel lien de parenté avait-il avec le Prophète ?", opts: ["Son oncle", "Son cousin (fils de tante)", "Son frère de lait", "Son beau-père"], c: 1, exp: "Il était le fils de Safiya, la tante paternelle du Prophète." },
                    { q: "Comment les anges étaient-ils habillés à Badr ?", opts: ["En blanc", "Avec des turbans jaunes", "En vert", "En armure noire"], c: 1, exp: "Ils ont imité l'apparence de Zoubayr qui portait ce jour-là un turban jaune." },
                    { q: "Pourquoi a-t-il quitté la bataille du Chameau ?", opts: ["Par peur", "Ali lui a rappelé un hadith", "Il était blessé", "Son fils l'a appelé"], c: 1, exp: "Ali lui a rappelé que le Prophète avait prédit qu'il le combattrait injustement. Zoubayr s'est souvenu et est parti." }
                ]
            },
            {
                id: 4,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abderrahman ibn 'Aouf",
                arabicName: "عبد الرحمن بن عوف",
                subtitle: "Le Riche Reconnaissant",
                intro: "Il fait partie des dix promis au Paradis et des six membres de la Shura. Un génie du commerce dont la fortune n'avait d'égal que la générosité. Le Prophète (ﷺ) a prié derrière lui, un honneur rare.",
                heroQuote: "Indique-moi plutôt où se trouve le marché !",
                tags: ["10 Promis", "Muhajirun", "Shura"],
                genealogy: "Il est Abderrahman ibn 'Aouf... du clan {Zouhri} (comme la mère du Prophète). Sa mère est As-Shifa. Il se nommait Abd-'Amr avant l'Islam.",
                physicalDesc: "Peau blanche, teint rosé, grands yeux noirs avec de longs cils, nez busqué. Il avait de grandes canines supérieures qui blessaient sa lèvre. Il boitait d'une jambe (blessure d'Ouhoud) et il lui manquait des incisives. Il ne teignait pas ses cheveux.",
                timeline: [
                    { year: "Avant l'Hégire", desc: "L'un des 8 premiers convertis. Change son nom d'Abd-'Amr pour Abderrahman." },
                    { year: "1 H", desc: "Arrive pauvre à Médine. Refuse la moitié de la fortune de Saad ibn Rabi' et demande le marché." },
                    { year: "3 H", desc: "Reçoit une vingtaine de blessures à {Ouhoud} et devient boiteux permanent." },
                    { year: "9 H", desc: "Honneur immense à {Tabouk} : Le Prophète (ﷺ) prie une raka derrière lui." },
                    { year: "23 H", desc: "Préside la {Shura} (conseil) et se désiste pour choisir Outhman comme Calife." },
                    { year: "32 H", desc: "Meurt à 75 ans. Laisse une fortune colossale (or coupé à la hache)." }
                ],
                narratives: [
                    { id: 401, title: "Le convoi de Médine (récit discuté)", content: "Un récit au sujet d'Abderrahman ibn Aouf évoque l'arrivée à Médine de sept cents montures chargées de provisions et leur don en aumône. Il rapporte aussi une parole sur son entrée au Paradis. La transmission est qualifiée de « munkar » (discordante) dans le fascicule consulté ; elle ne doit pas être présentée comme un événement établi." },
                    { id: 402, title: "L'Imam du Prophète", content: "Lors de l'expédition de Tabouk, le Prophète (ﷺ) arriva en retard pour la prière de l'aube. Abderrahman avait déjà commencé. Le Prophète pria alors une unité de prière derrière lui. C'est un honneur qu'il ne partage qu'avec Abou Bakr." },
                    { id: 403, title: "Une succession et des chiffres divergents", content: "Plusieurs récits historiques décrivent une fortune considérable laissée par Abderrahman ibn ‘Aouf, avec des quantités d'or et des parts attribuées à ses épouses. Les montants diffèrent selon les voies : les sommes exactes ne doivent pas être présentées comme unanimement établies." },
                    { id: 404, title: "Le Refus du Pouvoir", content: "Lors de la Shura pour succéder à Omar, il dit : « Lequel d'entre vous accepterait de se désister pour choisir le meilleur ? ». Personne ne répondit. Il dit : « Moi je me désiste ». Il passa 3 jours sans dormir à consulter les gens pour finalement choisir Outhman." },
                    { id: 405, title: "La Jizya des Mages", content: "C'est grâce à son témoignage unique que le Calife Omar accepta de prélever la Jizya (impôt) sur les Mazdéens (Mages) de Hajar, car Abderrahman attesta avoir vu le Prophète le faire." }
                ],
                hadiths: [
                  {
                    "text": "N'insultez pas mes compagnons. Si l'un de vous dépensait l'équivalent d'Ouhoud en or, cela n'égalerait pas la mesure d'un seul d'entre eux ni même sa moitié.",
                    "narrator": "Le Prophète (à Khalid)",
                    "source": "Mouslim 2541a–b (sahîh)"
                  },
                  {
                    "text": "Une transmission de chaîne faible attribue au Prophète : « Tu es digne de confiance pour les habitants du ciel et de la terre. »",
                    "narrator": "Attribution prophétique discutée",
                    "source": "Siyar, fasc. 04, p. 30 — rapporteur faible"
                  }
                ],
                quizData: [
                    { q: "Quel était son nom avant l'Islam ?", opts: ["Abd-Shams", "Abd-'Amr", "Abou-Hakam", "Abd-Allah"], c: 1, exp: "Il s'appelait Abd-'Amr. Le Prophète l'a renommé Abderrahman (Serviteur du Tout-Miséricordieux)." },
                    { q: "Quelle fut sa réponse lorsqu'on lui proposa la moitié d'une fortune ?", opts: ["J'accepte", "Indique-moi le marché", "Donne-la aux pauvres", "Prête-la moi"], c: 1, exp: "Il refusa poliment l'offre de son frère Ansari et demanda simplement où faire du commerce." },
                    { q: "Quelle infirmité garda-t-il d'Ouhoud ?", opts: ["Aveugle", "Manchot", "Boiteux", "Sourd"], c: 2, exp: "Il reçut des coups au pied qui le firent boiter pour le reste de sa vie." },
                    { q: "Quel honneur unique a-t-il eu lors de la prière ?", opts: ["Prier dans la Kaaba", "Le Prophète a prié derrière lui", "Faire l'Adhan", "Diriger Jibril"], c: 1, exp: "À Tabouk, le Prophète a prié une raka derrière lui." }
                ]
            },
            {
                id: 5,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saad Ibn Abi Waqas",
                arabicName: "سعد بن أبي وقاص",
                subtitle: "Le Premier Archer de l'Islam",
                intro: "L'un des dix promis au Paradis et le dernier des Mouhajirounes à mourir. Oncle maternel du Prophète, il fut le conquérant de l'Irak (Qadisiyya) et celui dont les invocations étaient redoutables.",
                heroQuote: "Tire, pour toi mon père et ma mère ô Saad !",
                tags: ["10 Promis", "Muhajirun", "Commandants"],
                genealogy: "Saad ibn Malik (Abou Waqas) ibn Ouhayb des {Banou Zouhra}. Sa mère est Hamna bint Soufiane. Il est le cousin de la mère du Prophète (Amina).",
                physicalDesc: "D'après sa fille Aïsha : Il était petit de taille, ventru (un peu de ventre), trapu avec une grosse tête et de gros doigts. Il avait les cheveux bouclés, le corps très velu et le nez épaté. Il teignait ses cheveux en noir.",
                timeline: [
                    { year: "17 ans", desc: "Conversion. Il resta 7 jours en étant le 'tiers de l'Islam' (le 3ème homme)." },
                    { year: "1 H", desc: "Expédition de Rabigh : Il tire la première flèche de l'histoire de l'Islam." },
                    { year: "3 H", desc: "À {Ouhoud}, le Prophète lui donne ses propres flèches en sacrifiant ses parents pour lui." },
                    { year: "15 H", desc: "Commandant suprême à {Al-Qadisiyya}. Malade, il dirige la bataille depuis sa litière." },
                    { year: "19 H", desc: "Victoire de {Jalula}, la 'Victoire des Victoires' contre les Perses." },
                    { year: "55 H", desc: "Dernier des émigrés à mourir (à 82 ans). Enterré au {Baqi}." }
                ],
                narratives: [
                    { id: 501, title: "La Grève de la Faim", content: "Sa mère jura de ne plus manger tant qu'il ne renierait pas l'Islam. Après un jour et une nuit, Saad lui dit fermement : « Ô mère, si tu avais cent âmes et qu'elles sortaient une à une, je ne laisserais pas ma religion. Mange ou ne mange pas ! ». Elle finit par manger." },
                    { id: 502, title: "L'accusateur de Koufa", content: "Selon Jâbir ibn Samoura dans Sahîh al-Bukhârî (755), des habitants de Koufa se plaignirent de Sa‘d auprès de ‘Oumar. Après enquête, un homme l'accusa injustement. Sa‘d invoqua contre ce mensonge ; le rapporteur décrit ensuite le grand âge de l'accusateur et ses mauvais comportements. Le récit est cité avec sa source, sans extrapoler sur l'état médical de cet homme." },
                    { id: 503, title: "Le Manteau de Laine", content: "Sur son lit de mort, il demanda un vieux manteau de laine usé (Joubba) qu'il gardait précieusement dans un coffre. Il dit : « C'est avec cela que j'ai combattu les polythéistes à Badr. Je l'ai gardé pour ce jour ». Il fut son linceul." },
                    { id: 504, title: "La Retraite", content: "Lors de la Grande Discorde (Fitna), son fils vint le pousser à revendiquer le Califat. Saad lui tapa la poitrine et dit : « Tais-toi ! J'ai entendu le Prophète dire : Allah aime le serviteur riche (de cœur), pieux et discret ». Il mourut en paix dans son château d'Al-Aqiq." }
                ],
                hadiths: [
                  {
                    "text": "Ô Allah, exauce Sa‘d lorsqu'il T'invoque !",
                    "narrator": "Le Prophète (ﷺ)",
                    "source": "At-Tirmidhî 3751 (hasan)"
                  },
                  {
                    "text": "Voici mon oncle (maternel); faites-moi donc voir un pareil oncle !",
                    "narrator": "Le Prophète (ﷺ)",
                    "source": "At-Tirmidhî 3752 — hasan gharîb selon At-Tirmidhî ; faible selon Darussalam"
                  }
                ],
                quizData: [
                    { q: "Quelle était sa particularité physique ?", opts: ["Très grand et mince", "Petit et ventru", "Blond aux yeux bleus", "Unijambiste"], c: 1, exp: "Le Siyar le décrit comme petit, trapu, avec du ventre et une grosse tête." },
                    { q: "Quel objet a-t-il gardé toute sa vie pour son enterrement ?", opts: ["L'épée du Prophète", "Son manteau de Badr", "Un morceau de la Kaaba", "Une poignée de terre"], c: 1, exp: "Il a exigé d'être enterré dans la vieille laine qu'il portait le jour de Badr." },
                    { q: "Pourquoi ses invocations étaient-elles redoutées ?", opts: ["Il était magicien", "Le Prophète a prié pour qu'il soit exaucé", "Il était Calife", "Il avait un talisman"], c: 1, exp: "Le Prophète a dit : « Ô Allah, exauce Saad lorsqu'il T'invoque »." }
                ]
            },
            {
                id: 6,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saïd ibn Zayd",
                arabicName: "سعيد بن زيد",
                subtitle: "L'un des Dix Promis au Paradis",
                intro: "L'un des dix compagnons pour lesquels le Paradis a été attesté. Converti très tôt, avant les réunions dans la maison d'Al-Arqam, il fut nommé gouverneur de Damas selon la notice de Dhahabî.",
                heroQuote: "Selon une parole rapportée de Sa‘îd : « Zayd ibn ‘Amr sera ressuscité comme une communauté à lui seul. »",
                tags: ["10 Promis", "Muhajirun", "Gouverneur"],
                genealogy: "Saïd ibn Zayd ibn 'Amr ibn Noufayl. Cousin d'Oumar ibn Al-Khattab et époux de sa sœur Fatima. Son père Zayd était un monothéiste (Hanif) mort avant l'Islam.",
                physicalDesc: "Un homme très grand, au teint basané (mat) et très velu.",
                timeline: [
                    { year: "Pré-Islam", desc: "Son père Zayd meurt en cherchant la religion d'Ibrahim." },
                    { year: "Débuts", desc: "Converti très tôt. Oumar (non-musulman) le ligotait pour le punir." },
                    { year: "2 H", desc: "Absent de {Badr} (en mission d'espionnage avec Talha) mais récompensé comme présent." },
                    { year: "13 H", desc: "Participe au siège de {Damas} et en devient le premier gouverneur." },
                    { year: "51 H (52 H aussi rapporté)", desc: "Selon Al-Waqidi, il meurt à {Al-Aqiq} après 70 ans et est inhumé à Médine. Une autre tradition donne 52 H ; un avis minoritaire situe son décès à Koufa." }
                ],
                narratives: [
                    { id: 601, title: "Les présents sur le mont Hirâ", content: "Dans une tradition transmise par Saïd ibn Zayd, le Prophète (ﷺ) s'adresse au mont Hirâ et évoque la présence d'un prophète, d'un véridique et de martyrs. Le récit énumère le Prophète, Abou Bakr, ‘Oumar, ‘Outhman, ‘Ali, Talha, Zoubayr, Saad, Abderrahman et Saïd. La scène dite du « neuvième homme » ne figure pas dans le passage du fascicule utilisé ici." },
                    { id: 602, title: "La Voleuse de Terre", content: "Selon le récit transmis par ‘Urwa (Mouslim 1610c), Arwa bint Ouways accusa Saïd d’empiéter sur sa terre. Saïd rappela la parole prophétique concernant l’usurpation de terrain et invoqua contre elle si son accusation était mensongère. La suite du récit rapporte qu’elle perdit la vue puis tomba dans un puits." },
                    { id: 603, title: "L'Espion de Badr", content: "Le Prophète l'envoya avec Talha pour espionner la caravane de Quraysh. Ils allèrent jusqu'à Al-Hawra. À leur retour, la bataille de Badr était finie. Le Prophète leur donna tout de même leur part de butin et de mérite." }
                ],
                hadiths: [
                    { text: "Les truffes (Kam'a) sont une manne divine et leur jus est un remède pour les yeux.", narrator: "Saïd ibn Zayd", source: "Al-Bukhârî 5708 ; Mouslim 2049a" },
                    { text: "Zayd (son père) sera ressuscité comme une communauté à lui seul.", narrator: "Le Prophète (ﷺ)", source: "Abou Ya‘lâ 973 — hasan selon Al-Haythamî ; autre voie faible selon Al-Arna’ût (Dorar)" }
                ],
                quizData: [
                    {"q":"Quel recueil contient le litige foncier entre Sa‘îd et Arwa ?","opts":["Sahîh Mouslim 1610c","Sunan Abî Dâwûd seulement","Aucun recueil"],"c":0,"exp":"Le récit se trouve dans Mouslim 1610c, avec la parole du Prophète relative à l'usurpation de terrain.","ref":"https://sunnah.com/muslim:1610c"},
                    {"q":"Quelle précaution concerne le récit « une communauté à lui seul » ?","opts":["Il n'existe aucune transmission","La même chaîne est unanimement authentifiée","Des spécialistes ont évalué différemment plusieurs voies"],"c":2,"exp":"Al-Haythamî indique hasan pour une voie citée dans Abou Ya‘lâ ; Al-Arna’ût juge faible une autre voie d’Ahmad.","ref":"https://dorar.net/h/JKxKOrRq/osoul"},

                    {"q":"Quel recueil rapporte le hadith des truffes transmis par Saïd ibn Zayd ?","opts":["Sahîh al-Bukhârî","Uniquement un récit historique","Aucun recueil connu"],"c":0,"exp":"Le hadith figure dans Sahîh al-Bukhârî 5708, et également chez Mouslim 2049a.","ref":"https://sunnah.com/bukhari:5708"},
                    {"q":"Que peut-on affirmer du récit de Saïd sur le mont Hirâ ?","opts":["Il existe une transmission mentionnant les personnes présentes","Toutes les versions sont identiques","Aucune source ne le rapporte"],"c":0,"exp":"La notice distingue la liste rapportée d'autres détails narratifs non présents dans le fascicule.","ref":"https://siyar.fr/livre/1/143"},

                    { q: "Pourquoi était-il absent physiquement à Badr ?", opts: ["Malade", "En mission d'espionnage", "En voyage", "Pas converti"], c: 1, exp: "Il surveillait la caravane d'Abou Soufiane avec Talha sur ordre du Prophète." },
                    { q: "Quel est son lien avec Oumar ibn Al-Khattab ?", opts: ["Frère", "Cousin et beau-frère", "Oncle", "Fils"], c: 1, exp: "Ils sont cousins (Clan Adi) et Saïd a épousé Fatima, la sœur d'Oumar." },
                    { q: "Quelle invocation célèbre a-t-il faite ?", opts: ["Contre une voleuse de terre", "Pour la pluie", "Pour la richesse", "Pour la victoire"], c: 0, exp: "Il a invoqué contre Arwa qui l'accusait faussement, et elle devint aveugle." }
                ]
            },
            {
                id: 7,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mouss'ab ibn Oumayr",
                arabicName: "مُصْعَب بن عُمَيْر",
                subtitle: "Le Pionnier parmi les premiers émigrés",
                intro: "Le jeune homme le plus choyé de La Mecque qui sacrifia tout pour Allah. D’après Al-Barâ’, il fut le premier des émigrés accueillis à Médine. Il mourut à Ouhoud si démuni que son linceul ne couvrait pas entièrement son corps.",
                heroQuote: "Selon une transmission : « Vous êtes aujourd’hui meilleurs qu’au jour où vous seriez comblés d’abondance. »",
                tags: ["Martyrs", "Muhajirun", "Badriyun"],
                genealogy: "Mouss'ab ibn Oumayr... du clan {Abdari} (Banu Abd Ad-Dar). Surnommé « Le Noble », « Le Pionnier ».",
                physicalDesc: "Avant l'Islam : beau, parfumé et riche. Après l'Islam : Saad raconte qu'il avait « la peau sur les os, flétrie telle la peau d'un serpent » à cause de la famine, au point que les compagnons devaient le porter.",
                timeline: [
                    { year: "Mecque", desc: "Jeunesse dorée. Conversion secrète à Dar Al-Arqam. Emprisonné par sa mère." },
                    { year: "Médine", desc: "D’après Al-Barâ’ ibn ‘Azib, il fut le premier des Mouhâjirûn accueillis à Médine." },
                    { year: "2 H", desc: "Porte l'étendard des Muhajirounes à la bataille de {Badr}." },
                    { year: "3 H", desc: "Meurt martyr à {Ouhoud}, tué par Ibn Qamia qui crut avoir tué le Prophète." }
                ],
                narratives: [
                    { id: 701, title: "L'Épreuve du Linceul", content: "À sa mort à {Ouhoud}, il ne possédait qu'un pagne à rayures. Si on couvrait sa tête, ses pieds dépassaient ; si on couvrait ses pieds, sa tête était exposée. Le Prophète (ﷺ) ordonna : « Couvrez sa tête et mettez de la citronnelle (Idhkhir) sur ses pieds »." },
                    { id: 702, title: "La Peau de Serpent", content: "Une transmission rapportée dans la notice biographique, attribuée à Sa‘d ibn Abî Waqqâs, décrit Mouss’ab éprouvé par la faim et amaigri au point de devoir être soutenu. Les détails de cette version doivent être distingués des hadiths du linceul établis dans Al-Bukhârî." },
                    { id: 703, title: "Les Pleurs d'Abderrahman", content: "Bien plus tard, on servit un repas copieux à Abderrahman ibn 'Aouf. Il se mit à pleurer en disant : « Mouss'ab est mort et n'avait qu'un seul vêtement pour linceul... J'ai peur que nos récompenses nous aient été anticipées dans cette vie ! »." }
                ],
                hadiths: [
                    { text: "Selon un récit biographique attribué au Prophète (ﷺ) : « Je n’ai vu à La Mecque personne mieux coiffée, mieux vêtue et plus comblée que Mouss’ab ibn Oumayr. »", narrator: "Le Prophète (ﷺ)", source: "Ibn Sa‘d, at-Tabaqât (récit 2886) — degré non retrouvé pour cette chaîne" },
                    { text: "Parmi les croyants, il est des hommes qui ont été sincères dans leur engagement...", narrator: "Verset 33:23", source: "Coran 33:23 — verset, et non hadith ; application à Mouss’ab à documenter", type: "verse" }
                ],
                quizData: [
                    {"q":"Qui rapporte l’épisode du linceul de Mouss’ab dans Al-Bukhârî ?","opts":["Abou Hourayra","Khabbâb","Ibn ‘Abbâs"],"c":1,"exp":"Khabbâb témoigne de la difficulté de trouver un linceul couvrant le corps à Ouhoud.","ref":"https://sunnah.com/bukhari:1276"},
                    {"q":"Le verset 33:23 est-il une parole d’un compagnon ?","opts":["Oui, attribuée à Mouss’ab","Oui, attribuée à Talha","Non, c'est un verset coranique"],"c":2,"exp":"Le passage est du Coran ; le lien avec Mouss’ab dans les ouvrages biographiques doit être cité séparément.","ref":"https://quran.com/33/23"},

                    {"q":"Dans quel recueil trouve-t-on l'épisode du linceul trop court de Mouss’ab ?","opts":["Sahîh al-Bukhârî","Uniquement dans un récit non attribué","Dans la sourate 33"],"c":0,"exp":"Khabbâb rapporte que l’on couvrit la tête de Mouss’ab et ses pieds avec de l’idhkhir.","ref":"https://sunnah.com/bukhari:1276"},
                    {"q":"Peut-on attribuer sans réserve à Mouss’ab le titre de « premier ambassadeur » à partir du passage d’Al-Barâ’ ?","opts":["Non, ce passage parle du premier émigré accueilli","Oui, le passage utilise ce titre explicitement","Oui, c'est une citation coranique"],"c":0,"exp":"Le passage du fascicule dit « premier Muhâjir accueilli » ; les deux qualifications ne doivent pas être confondues.","ref":"https://siyar.fr/livre/1/150"},

                    { q: "Quelle plante a servi à couvrir les pieds de Mouss'ab dans sa tombe ?", opts: ["Le Laurier", "L'Idhkhir (Citronnelle)", "Le Palmier", "L'Olivier"], c: 1, exp: "Son linceul étant trop court, le Prophète ordonna d'utiliser cette plante aromatique pour ses pieds." },
                    { q: "Pourquoi sa peau était-elle comparée à celle d'un serpent ?", opts: ["Une maladie", "La richesse", "La famine extrême", "Les brûlures"], c: 2, exp: "Saad raconte que la disette avait tellement asséché sa peau qu'elle pelait (mue) comme un serpent." }
                ]
            },
            {
                id: 8,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Salama",
                arabicName: "أبو سَلَمَة",
                subtitle: "Le Cousin Bien-Aimé",
                intro: "Cousin et frère de lait du Prophète (ﷺ). Il fut le premier à émigrer en Abyssinie. Blessé à Ouhoud, il mourut peu après, laissant une invocation célèbre à sa femme.",
                heroQuote: "« Ô Allah, pardonne à Abou Salama et élève son rang parmi les bien-guidés. »",
                tags: ["Muhajirun", "Badriyun", "Frère de lait"],
                genealogy: "Abd-Allah ibn Abd Al-Assad, du clan {Makhzoum}. Fils de Barra (tante paternelle du Prophète). Frère de lait du Prophète (allaités par Thouwayba).",
                physicalDesc: "Un guerrier patient. Il mourut alors qu'il était encore dans la force de l'âge.",
                timeline: [
                    { year: "Abyssinie", desc: "Premier homme à émigrer (Hijra) en Abyssinie avec sa femme." },
                    { year: "2 H", desc: "Combat victorieusement à {Badr}." },
                    { year: "3 H", desc: "Blessé au bras à {Ouhoud}. La blessure semble guérir mais s'infecte plus tard." },
                    { year: "3 ou 4 H selon les récits", desc: "Après l’expédition de {Qatane} (150 hommes), une transmission situe son décès au second mois de Joumada en 4 H ; une autre mentionne 3 H." }
                ],
                narratives: [
                    { id: 801, title: "L'Expédition de Qatane", content: "Au mois de Mouharram (an 4), le Prophète l'envoya attaquer les Banu Assad à Qatane avec 150 hommes. Il revint victorieux avec du butin, mais l'effort fit rouvrir sa blessure d'Ouhoud, ce qui causa sa mort." },
                    { id: 802, title: "De bonnes paroles auprès du défunt", content: "Oum Salama rapporte que le Messager d’Allah (ﷺ) recommandait de ne prononcer que de bonnes paroles auprès d’un défunt, car les anges disent « Amîn » aux invocations. Après la mort d’Abou Salama, il lui enseigna une invocation en faveur du défunt et de ceux qui restent." },
                    { id: 803, title: "L'Héritage Spirituel", content: "Oum Salama rapporte dans Sahîh Mouslim (918a–b) une invocation enseignée par le Prophète (ﷺ) pour celui qui traverse un malheur. Elle indique l’avoir prononcée à la mort de son mari Abou Salama avant de devenir l’épouse du Prophète." }
                ],
                hadiths: [
                    { text: "Ô Allah, pardonne à Abou Salama, élève son degré parmi les guidés et prends en charge sa descendance !", narrator: "Le Prophète (ﷺ)", source: "Sahîh Mouslim 920a" }
                ],
                quizData: [
                    {"q":"Qui rapporte l’invocation pour Abou Salama dans Mouslim 920a ?","opts":["Oum Salama","‘Oumar","Abou Bakr"],"c":0,"exp":"Oum Salama décrit la visite du Prophète ﷺ auprès d'Abou Salama et son invocation.","ref":"https://sunnah.com/muslim:920a"},
                    {"q":"Quelle invocation prononce Oum Salama pendant l’épreuve ?","opts":["Une invocation contre sa famille","La demande de récompense et de remplacement par meilleur","Une demande de richesse"],"c":1,"exp":"Oum Salama rapporte l'invocation prophétique dans Mouslim 918a–b.","ref":"https://sunnah.com/muslim:918a"},

                    {"q":"Que recommande le Prophète ﷺ auprès d'un défunt dans le récit d'Oum Salama ?","opts":["Ne prononcer que des invocations bienveillantes","Rester constamment silencieux","Ne jamais pleurer"],"c":0,"exp":"Les anges disent « Amîn » aux invocations ; le passage se trouve dans Sahîh Mouslim 920a.","ref":"https://sunnah.com/muslim:920a"},
                    {"q":"Quelle prudence faut-il garder sur la date du décès d'Abou Salama ?","opts":["Les notices rapportent des datations divergentes","La date est unanimement fixée au jour près","Il est mort à Badr"],"c":0,"exp":"Le fascicule mentionne 3 H et un récit plaçant le décès en 4 H après Qatane.","ref":"https://siyar.fr/livre/1/156"},

                    { q: "Quel lien de parenté précis avait-il avec le Prophète ?", opts: ["Oncle maternel", "Frère de lait et Cousin", "Fils adoptif", "Beau-père"], c: 1, exp: "Il était le fils de sa tante Barra et ils avaient partagé la même nourrice." },
                    { q: "Quelle expédition a-t-il dirigée juste avant sa mort ?", opts: ["Mouta", "Qatane", "Hunayn", "Tabouk"], c: 1, exp: "L'expédition vers le mont Qatane contre les Banu Assad, d'où il revint blessé." }
                ]
            },
            {
                id: 9,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Outhman ibn Mazh'oune",
                arabicName: "عثمان بن مَظْعُون",
                subtitle: "L'Ascète de la Oumma",
                intro: "14ème converti et frère de lait du Prophète. Connu pour son ascétisme extrême (il voulait se castrer), il est le premier Émigré enterré au Baqi'. Le Prophète l'embrassa mort en pleurant.",
                heroQuote: "Selon Sa‘d ibn Abî Waqqâs : « Le Prophète refusa à ‘Outhman ibn Mazh‘oune le célibat ascétique. »",
                tags: ["Muhajirun", "Badriyun", "Ascète"],
                genealogy: "Outhman ibn Mazh'oune Al-Joumahi. Surnommé « Abou As-Saïb ». Frère de lait du Prophète.",
                physicalDesc: "Il avait la peau très mate (foncée) et une barbe dense.",
                timeline: [
                    { year: "Mecque", desc: "Quatorzième converti selon Abou Oumar. Un récit affirme qu’il avait délaissé le vin avant l’Islam, mais Dhahabî juge sa chaîne discontinue et ce récit non authentique." },
                    { year: "Hégire", desc: "Émigre en Abyssinie puis à Médine. Sa maison est localisée par le Prophète." },
                    { year: "3 H", desc: "Meurt après Badr (en Shabane). Premier enterré au {Baqi}." }
                ],
                narratives: [
                    { id: 901, title: "Le Refus du Monachisme", content: "Il voulait se faire castrer (ou s'abstenir des femmes) et vivre en ermite. Le Prophète (ﷺ) le lui interdit formellement : « Outhman, le monachisme n'a pas été prescrit pour nous. La meilleure religion est le monothéisme pur et tolérant (Hanifiya) »." },
                    { id: 902, title: "Les Larmes du Prophète", content: "À sa mort, le Prophète (ﷺ) embrassa son front. Aïsha raconte : « Je vis les larmes du Messager d'Allah couler sur les joues d'Outhman ». Il dit : « Tu nous as quittés sans t'être sali par ce bas-monde »." },
                    { id: 903, title: "La pierre posée près de sa tombe", content: "La biographie rapporte que le Prophète (ﷺ) fit placer une grande pierre près de la tombe d’Outhman ibn Mazh’oune afin de la reconnaître et d’enterrer ses proches à proximité. Dhahabî précise toutefois que la chaîne de ce récit est moursal : son dernier maillon manque." },
                    { id: 904, title: "L'Incident de la Louange", content: "Une femme (Oum Al-'Ala) dit devant le corps : « Je témoigne qu'Allah t'a honoré ». Le Prophète la reprit : « Qu'en sais-tu ? Je suis le Messager d'Allah et je ne sais pas ce qu'on fera de moi ! ». Cela effraya les compagnons sur leur propre sort." }
                ],
                hadiths: [
                    { text: "Le Prophète l'embrassa alors qu'il était mort, et je vis les larmes couler de ses yeux.", narrator: "Aïsha", source: "At-Tirmidhî 989 — hasan sahîh selon At-Tirmidhî ; faible selon Darussalam" },
                    { text: "Rejoins notre excellent prédécesseur, Outhman ibn Mazh'oune !", narrator: "Le Prophète (à la mort de sa fille)", source: "Ahmad 2127 ; Ibn Sa‘d 3/398 — chaîne faible selon Al-Arna’ût, sahîh selon Ahmad Shâkir (Dorar)" }
                ],
                quizData: [
                    {"q":"Selon Al-Bukhârî 5073, que refuse le Prophète à Outhman ?","opts":["Le voyage","L’apprentissage du Coran","Le célibat ascétique"],"c":2,"exp":"Sa‘d ibn Abî Waqqâs rapporte que le Prophète refusa le renoncement au mariage.","ref":"https://sunnah.com/bukhari:5073"},
                    {"q":"Quel enseignement ressort du dialogue avec Oum Al-‘Alâ ?","opts":["Éviter d'affirmer avec certitude le sort d'un défunt sans preuve","Interdire toute invocation","Déduire le Paradis du seul décès"],"c":0,"exp":"Le récit est présent dans Sahîh al-Bukhârî 1243.","ref":"https://sunnah.com/bukhari:1243"},

                    {"q":"Quelles appréciations figurent pour le hadith de l'embrassade funéraire ?","opts":["Hasan sahîh selon At-Tirmidhî, faible selon Darussalam","Unanimement inventé","Unanimement sahîh sans divergence"],"c":0,"exp":"At-Tirmidhî 989 écrit hasan sahîh ; l’évaluation Darussalam indiquée sur Sunnah.com est da‘îf.","ref":"https://sunnah.com/tirmidhi:989"},
                    {"q":"Quel statut documentaire possède le récit de la pierre sur la tombe ?","opts":["Une chaîne qualifiée de moursal","Une chaîne unanimement sahîh","Un verset coranique"],"c":0,"exp":"Le fascicule signale une transmission moursal ; il ne faut pas la traiter comme une authentification.","ref":"https://siyar.fr/livre/1/158"},

                    { q: "Quelle forme d’ascétisme le Prophète a-t-il refusée à ‘Outhman ?", opts: ["Le silence", "Le renoncement au mariage", "L’aumône"], c: 1, exp: "Le hadith d’Al-Bukhârî 5073 rapporte le refus du célibat ascétique. La castration est évoquée par Sa‘d comme une hypothèse si le renoncement avait été permis.", ref: "https://sunnah.com/bukhari:5073" },
                    { q: "Quelle est sa primauté concernant Médine ?", opts: ["Premier martyr", "Premier gouverneur", "Premier Muhajir enterré au Baqi'", "Premier né"], c: 2, exp: "Il a inauguré le cimetière du Baqi' pour les émigrés." }
                ]
            },
            {
                id: 10,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Qoudama ibn Mazh'oune",
                arabicName: "قدَامَة بن مَظْعُون",
                subtitle: "Le Gouverneur Puni",
                intro: "Frère d'Outhman et oncle d'Ibn Oumar. Gouverneur de Bahreïn sous Omar, il est célèbre pour avoir été fouetté (peine légale) suite à une erreur d'interprétation du Coran.",
                heroQuote: "Extrait du Coran 5:93 : « Il n’est pas de faute pour ceux qui ont cru et accompli de bonnes œuvres en ce qu’ils ont consommé… »",
                tags: ["Muhajirun", "Badriyun", "Gouverneur"],
                genealogy: "Qoudama ibn Mazh'oune Al-Joumahi. Beau-frère d'Omar (marié à Safiya bint Al-Khattab).",
                physicalDesc: "Il était grand, de peau mate (foncée). Il ne teignait pas ses cheveux blancs.",
                timeline: [
                    { year: "Abyssinie", desc: "Participe au 2ème exode." },
                    { year: "2 H", desc: "Participe à la bataille de {Badr}." },
                    { year: "Califat d'Omar", desc: "Nommé Gouverneur de Bahreïn. Destitué et fouetté pour consommation d'alcool." },
                    { year: "36 H", desc: "Décès à 65 ans." }
                ],
                narratives: [
                    { id: 1001, title: "L’interprétation du verset 5:93", content: "Il est rapporté que Qoudama, alors gouverneur de Bahreïn, avait bu du vin et invoqua le verset 5:93 de la sourate Al-Mâ’ida. ‘Oumar le fit néanmoins fouetter et le destitua de sa fonction. Le passage du fascicule ne précise pas l’explication supplémentaire auparavant donnée dans cette fiche." }
                ],
                hadiths: [],
                quizData: [
                    {"q":"Comment Ibn Taymiyya qualifie-t-il la transmission examinée sur Qoudama ?","opts":["Sahîh sans réserve","« Fîhi nazar » (« à examiner »)","Moutawâtir"],"c":1,"exp":"Dorar cite le jugement « fîhi nazar » dans Minhâj as-Sunna 6/84 ; cela concerne cette version, pas toutes les voies possibles.","ref":"https://dorar.net/h/x4HMmzcz"},
                    {"q":"Comment Athar doit-il présenter un récit historique non classé ?","opts":["Le supprimer sans explication","Le transformer en hadith sahîh","Citer l'ouvrage et signaler l'absence de classement identifié"],"c":2,"exp":"La présence d’un récit dans une chronique ne constitue pas à elle seule un jugement d'authenticité.","ref":"https://siyar.fr/livre/1/165"},

                    {"q":"Quel verset Qoudama invoqua-t-il selon le récit historique ?","opts":["Al-Mâ’ida 5:93","Al-Fâtiha 1:1","Al-Ikhlâs 112:1"],"c":0,"exp":"La notice rapporte son recours au verset 5:93 et la sanction ordonnée par ‘Oumar.","ref":"https://siyar.fr/livre/1/165"},
                    {"q":"Que prouve la localisation de cet épisode dans Siyar ?","opts":["Qu'un récit est mentionné, pas que chaque chaîne est authentifiée","Que toute interprétation ajoutée est certaine","Que le récit est un hadith prophétique sahîh"],"c":0,"exp":"Une référence biographique permet de retrouver le passage, pas d'authentifier automatiquement toutes les traditions.","ref":"https://siyar.fr/livre/1/165"},

                    { q: "Pourquoi Omar l'a-t-il destitué de son poste de gouverneur ?", opts: ["Pour vol", "Pour incompétence", "Pour consommation d'alcool (erreur d'interprétation)", "Pour trahison"], c: 2, exp: "Il avait bu du vin en pensant à tort qu'un verset l'autorisait aux gens pieux." }
                ]
            },
            {
                id: 11,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Oubayda ibn Al-Harith",
                arabicName: "عبيدة بن الحارث",
                subtitle: "Le Doyen de Badr",
                intro: "Oubayda ibn Al-Hârith ibn Al-Mouttalib participa aux premiers détachements militaires et au duel de Badr. Cette fiche Athar correspond au même compagnon que la fiche n° 45 ; les variantes sur le déroulement du duel sont conservées.",
                heroQuote: "Selon Abou Dharr, le verset 22:19 concerne les six hommes qui s'affrontèrent en duel à Badr, parmi lesquels Oubayda.",
                tags: ["Ahl al-Bayt", "Martyrs", "Badriyun"],
                genealogy: "Oubayda ibn Al-Harith ibn Al-Mouttalib (cousin du père du Prophète). Sa mère est Soukhayla.",
                physicalDesc: "Il était âgé de 63 ans à Badr (10 ans de plus que le Prophète).",
                timeline: [
                    { year: "1 H", desc: "Selon Ibn Ishâq, il reçoit la première bannière ; d'autres chroniques attribuent la première bannière à un autre compagnon." },
                    { year: "2 H", desc: "Blessé lors du duel de {Badr} et mort ensuite à As-Safrâ selon les traditions biographiques. Abou Dâwoud 2665 l'oppose à al-Walîd, tandis que d'autres versions donnent ‘Outba." }
                ],
                narratives: [
                    {"id":1102,"title":"Le verset 22:19 et les six combattants de Badr","content":"Abou Dharr rapporte que le verset « Voici deux adversaires qui disputent au sujet de leur Seigneur » (Al-Hajj 22:19) concerne Hamza, ‘Alî et Oubayda, opposés à ‘Outba, Shayba et al-Walîd. Ce récit est transmis dans Sahîh Mouslim 3033 et Al-Bukhârî 3965. Il s'agit d'une attribution du contexte du verset par un compagnon."},
                    { id: 1101, title: "Le Duel des Cousins", content: "Lors du duel de Badr, ‘Alî rapporte que le Prophète appela Hamza, ‘Alî et Oubayda. Selon Abou Dâwoud 2665, Oubayda affronta al-Walîd : tous deux furent gravement blessés, puis Hamza et ‘Alî le ramenèrent. Une autre version attribuée à Ibn Ishâq met Oubayda face à ‘Outba. Le décès à As-Safrâ et les propos concernant Abou Tâlib sont des éléments des chroniques biographiques, à ne pas présenter comme tous compris dans le même hadith." }
                ],
                hadiths: [
                    {"text":"Le Prophète ﷺ appela Hamza, ‘Alî et Oubayda pour répondre au duel de Badr.","narrator":"‘Alî ibn Abî Tâlib","source":"Sunan Abî Dâwoud 2665 — sahîh selon Al-Albânî"},
                ],
                quizData: [
                    {"q":"Quel verset est associé aux six combattants du duel de Badr ?","opts":["Al-Hajj 22:19","Al-Fâtiha 1:1","An-Nâs 114:1"],"c":0,"exp":"Abou Dharr transmet cette attribution dans Mouslim 3033. Le verset ne nomme pas les duellistes lui-même.","ref":"https://sunnah.com/muslim:3033"},
                    {"q":"Qui affronte Oubayda selon la version d'Abou Dâwoud 2665 ?","opts":["Al-Walîd ibn ‘Outba","‘Outba ibn Rabî‘a","Abou Jahl"],"c":0,"exp":"Abou Dâwoud rapporte al-Walîd ; une narration d'Ibn Ishâq situe plutôt ‘Outba face à Oubayda.","ref":"https://sunnah.com/abudawud:2665"},
                    {"q":"À quelle autre fiche d'Athar le personnage d'Oubayda correspond-il ?","opts":["45","12","84"],"c":0,"exp":"Les fiches 11 et 45 désignent le même compagnon ; le numéro 45 correspond à la notice dans Siyar.","ref":"https://siyar.fr/livre/1/256"},
                    { q: "Que rapporte Ibn Ishâq concernant sa bannière ?", opts: ["Elle aurait été la première nouée à un musulman", "Elle datait de Siffîn", "Elle fut offerte par César"], c: 0, exp: "Ibn Ishâq emploie une formule d’attribution et des traditions concurrentes évoquent aussi Abd-Allah ibn Jahsh. Il ne s’agit pas d’une primauté unanimement établie.", ref: "https://g1.islamweb.net/ar/library/content/58/682/" },
                    { q: "Où est-il mort ?", opts: ["Sur le champ de Badr", "À Médine", "À As-Safra (au retour de Badr)", "À la Mecque"], c: 2, exp: "Il a survécu au duel mais est mort de sa blessure sur le chemin du retour." }
                ]
            },
            {
                id: 12,
                verified: false,
                source: "Chroniques d’Ibn Hishâm, Ibn Sa‘d et Al-Haythamî (références externes)",
                name: "Abd-Allah ibn Jahche",
                arabicName: "عبد الله بن جحش",
                subtitle: "L'Homme au Vœu Mutilé",
                intro: "Compagnon de la première génération, chef de l'expédition de Nakhla en 2 H et mort à Ouhoud en 3 H. Ibn Sa‘d rapporte que le titre « émir des croyants » lui fut donné lors de cette expédition ; ce récit ne définit pas l'emploi ultérieur du titre califal.",
                heroQuote: "Selon Sa‘d ibn Abî Waqqâs, Abd-Allah invoqua à Ouhoud : « Pour Toi et Ton Messager » (récit rapporté par At-Tabarânî).",
                tags: ["Ahl al-Bayt", "Martyrs", "Commandants"],
                genealogy: "Fils de Oumayma bint Abdelmoutalib (tante du Prophète). Frère de Zaynab (Mère des Croyants).",
                physicalDesc: "On le retrouva le nez et les oreilles coupés, suspendus à un fil.",
                timeline: [
                    { year: "2 H", desc: "Dirige l'expédition de Nakhla selon les chroniques ; l'incident du mois sacré est rapproché du verset 2:217. Les auteurs divergent sur plusieurs détails du détachement." },
                    { year: "3 H", desc: "Meurt à {Ouhoud}. Enterré dans la même tombe que son oncle Hamza." }
                ],
                narratives: [
                    {"id":1203,"title":"L'expédition de Nakhla et le mois sacré","content":"Les chroniqueurs rapportent qu'Abd-Allah conduisit le détachement de Nakhla en 2 H. Un affrontement se produisit pendant un mois sacré, puis le verset 2:217 est cité dans ce contexte par les ouvrages de sîra. Les versions divergent sur le nombre de participants et sur le traitement initial du butin."},
                    { id: 1201, title: "L'Invocation Terrible", content: "Selon Sa‘d ibn Abî Waqqâs, avant le combat d'Ouhoud, Abd-Allah invoqua Allah pour rencontrer un adversaire qui le tuerait et le mutilerait. Sa‘d dit avoir observé après la bataille que son nez et son oreille avaient été mutilés. Al-Haythamî écrit « ses rapporteurs sont ceux du Sahîh » (Majma‘ az-Zawâ’id 9/304) ; cette formule est reproduite sans lui substituer un classement inédit." },
                    { id: 1202, title: "La Tombe Commune", content: "Ibn Hishâm rapporte d'après la famille d'Abd-Allah ibn Jahsh qu'il fut enterré dans la même tombe que Hamza, son oncle maternel. Ibn Ishâq précise qu'il n'a entendu ce détail que de sa famille ; il s'agit d'une tradition historique attribuée, et non d'un fait unanimement démontré." }
                ],
                quizData: [
                    {"q":"À quel événement la chronique de Dorar rattache-t-elle l'expédition de Nakhla ?","opts":["Rajab 2 H","La bataille de Siffîn","L'année 40 H"],"c":0,"exp":"Ad-Durar as-Saniyya date cette expédition de Rajab 2 H.","ref":"https://dorar.net/history/event/54"},
                    {"q":"Quel jugement Al-Haythamî donne-t-il au récit de l'invocation d'Ouhoud ?","opts":["« Ses rapporteurs sont ceux du Sahîh »","« Unanimement inventé »","« Coran »"],"c":0,"exp":"Majma‘ az-Zawâ’id 9/304 contient cette appréciation sur les rapporteurs, qu'on ne doit pas transformer en authentification autonome.","ref":"https://dorar.net/h/WyJwUUz5"},
                    {"q":"À qui Ibn Ishâq attribue-t-il le détail de l'inhumation avec Hamza ?","opts":["À la famille d'Abd-Allah","À Abou Hourayra","À Oum Salama"],"c":0,"exp":"Il explique n'avoir entendu cette précision que de la famille du compagnon.","ref":"https://www.islamweb.com/ar/library/content/58/977/"},
                    {"q":"Quel verset est évoqué dans les chroniques concernant Nakhla et le mois sacré ?","opts":["Al-Baqara 2:217","An-Nasr 110:3","Al-Qadr 97:1"],"c":0,"exp":"Les chroniques rapportent l'incident dans le contexte du verset 2:217.","ref":"https://dorar.net/history/event/54"},
                    { q: "Selon Ibn Ishâq, avec qui fut-il enterré ?", opts: ["Mouss’ab", "Hamza", "Le Prophète", "‘Alî"], c: 1, exp: "Ibn Ishâq attribue cette tradition à la famille d’Abd-Allah ibn Jahsh, en disant ne l’avoir entendue que d’eux.", ref: "https://www.islamweb.com/ar/library/content/58/977/" }
                ]
            },
            {
                id: 13,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Houdhayfa",
                arabicName: "أبو حُذَيْفَة",
                subtitle: "L'Homme qui défia son Père",
                intro: "Abou Houdhayfa ibn ‘Outba ibn Rabî‘a fut parmi les premiers croyants. Des récits rapportent son appel au duel avec son père à Badr et sa mort à Al-Yamâma auprès de Sâlim. L'intervention prophétique parfois ajoutée à l'épisode du duel n'est pas étayée par la source citée.",
                heroQuote: "Selon Abou az-Zinâd, Abou Houdhayfa appela son père ‘Outba au duel à Badr.",
                tags: ["Martyrs", "Badriyun", "Yamama"],
                genealogy: "Mihsham (son vrai nom) ibn Outba ibn Rabi'a. Du clan Abd-Shams. Frère de Hind (femme d'Abou Soufiane).",
                physicalDesc: "Grand, beau visage, mais avec des dents qui se chevauchaient (ou espacées selon les versions), ce qui marquait son sourire.",
                timeline: [
                    { year: "Mecque", desc: "Conversion précoce. Émigre en Abyssinie." },
                    { year: "2 H", desc: "À {Badr}, selon Abou az-Zinâd, il invite son père ‘Outba à combattre en duel. Cette transmission ne rapporte pas que le Prophète l'en aurait empêché." },
                    { year: "12 H", desc: "Meurt martyr à la bataille d'{Al-Yamama} à 53 ans." }
                ],
                narratives: [
                    {"id":1303,"title":"La mort de ‘Outba et le chagrin rapporté à Badr","content":"Ibn Ishâq rapporte qu'après la mort de ‘Outba à Badr, le Prophète remarqua la tristesse d'Abou Houdhayfa. Celui-ci expliqua qu'il avait espéré la conversion de son père. Le récit, conservé dans les ouvrages de sîra, est à distinguer du hadith sur les duels et ne reçoit pas ici de classement indépendant."},
                    { id: 1301, title: "L’appel au duel contre son père", content: "Al-Hâkim transmet d'après ‘Abd ar-Rahmân ibn Abî az-Zinâd, d'après son père, qu'Abou Houdhayfa appela son père ‘Outba à combattre à Badr. La version cite également des vers attribués à sa sœur Hind. Aucune intervention du Prophète lui ordonnant de s'asseoir ne figure dans ce passage ; le degré de cette voie n'est pas indiqué ici." },
                    { id: 1302, title: "Unis dans la Mort", content: "La notice de Siyar rapporte que les corps d'Abou Houdhayfa et de Sâlim étaient rapprochés après Al-Yamâma. La description de leur position appartient à cette tradition biographique ; aucun classement indépendant de cette voie n'est affirmé." }
                ],
                quizData: [
                    {"q":"Qui rapporte dans Al-Moustadrak l'appel au duel contre ‘Outba ?","opts":["Abou az-Zinâd, par son fils","Jâbir uniquement","Anas ibn Mâlik"],"c":0,"exp":"Al-Hâkim 5039 cite ‘Abd ar-Rahmân ibn Abî az-Zinâd, d'après son père.","ref":"https://www.islamweb.net/ar/library/content/74/4861/"},
                    {"q":"Qu'ajoute Ibn Ishâq au récit de la mort d'‘Outba ?","opts":["Qu'Abou Houdhayfa avait espéré la conversion de son père","Qu'il avait quitté Badr avant le duel","Qu'il n'était pas croyant"],"c":0,"exp":"Ibn Kathîr reprend ce témoignage dans Al-Bidâya wa-n-Nihâya, sans que l'on confonde ce récit de sîra avec un hadith du Sahîh.","ref":"https://gcp.islamweb.net/ar/library/content/59/266/"},
                    {"q":"Peut-on affirmer que le Prophète ordonna à Abou Houdhayfa de s'asseoir ?","opts":["Pas à partir de la version citée d'Al-Hâkim","Oui, c'est explicitement écrit chez Al-Hâkim 5039","C'est un verset"],"c":0,"exp":"Cette intervention n'est pas présente dans la transmission citée d'Al-Hâkim 5039.","ref":"https://www.islamweb.net/ar/library/content/74/4861/"},
                    { q: "Qui voulait-il tuer de ses propres mains à Badr ?", opts: ["Abou Jahl", "Son père Outba", "Son frère", "Abou Soufiane"], c: 1, exp: "Le rapport attribué à Abou az-Zinâd signale l’appel au duel, sans établir avec certitude ses intentions personnelles." },
                    { q: "Quelle particularité physique avait-il ?", opts: ["Un œil borgne", "Des dents qui se chevauchaient", "Il était chauve", "Il boitait"], c: 1, exp: "Le Siyar mentionne ses dents chevauchées (ou espacées) ('Shateer')." }
                ]
            },
            {
                id: 14,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Salim Mawla Abou Houdhayfa",
                arabicName: "سَالِمٍ",
                subtitle: "Le Porteur du Coran",
                intro: "Sâlim, affranchi d'Abou Houdhayfa, fut un lecteur reconnu du Coran. Al-Bukhârî le cite parmi quatre maîtres recommandés pour l'apprentissage et rapporte son imamat à Qoubâ. Sa mort à Al-Yamâma et les propos sur la succession proviennent de traditions biographiques distinctes.",
                heroQuote: "« Apprenez la récitation du Coran auprès de quatre personnes », parmi lesquelles Sâlim, affranchi d'Abou Houdhayfa (Al-Bukhârî 3758).",
                tags: ["Martyrs", "Savants", "Coran"],
                genealogy: "Salim ibn Ma'qil. Originaire d'Istakhr (Perse). Affranchi de Thoubayta, femme d'Abou Houdhayfa, qui l'adopta.",
                physicalDesc: "Il récitait le Coran d'une voix qui captivait les cœurs.",
                timeline: [
                    { year: "Qouba", desc: "Imam des premiers émigrés (dont Oumar) car il connaissait le plus de Coran." },
                    { year: "Adoption", desc: "Le cas de Sâlim et Sahla bint Souhayl figure chez Mouslim 1453a–b. Mouslim 1454 rapporte que les autres épouses du Prophète y voyaient une permission particulière à Sâlim." },
                    { year: "12 H", desc: "Porte-étendard à {Al-Yamama}. Creuse un trou pour ses pieds et meurt martyr." }
                ],
                narratives: [
                    {"id":1404,"title":"L'imamat des premiers émigrés à Qoubâ","content":"Ibn ‘Oumar rapporte dans Sahîh al-Bukhârî 692 que Sâlim dirigeait les prières des premiers émigrés avant l'arrivée du Prophète à Médine, car il connaissait davantage de Coran."},
                    {"id":1405,"title":"Le cas de Sahla et de Sâlim : versions et réserve des autres épouses","content":"Mouslim 1453a–b rapporte que Sahla bint Souhayl interrogea le Prophète au sujet de Sâlim devenu adulte. Mouslim 1454 rapporte que les autres épouses du Prophète considéraient la réponse comme une permission spéciale pour Sâlim. Athar juxtapose les témoignages sans inventer une règle juridique générale."},
                    { id: 1401, title: "Un choix de succession rapporté sous réserve", content: "Un récit attribué à ‘Oumar rapporte qu’il aurait eu confiance en Salim et Abou Oubayda ibn Al-Jarrah pour lui succéder s’ils avaient été vivants. Dhahabî critique toutefois le rapporteur Ali ibn Zayd, puis conditionne son commentaire à l’authenticité du récit. Il ne faut pas transformer cette transmission discutée en déclaration historique certaine." },
                    { id: 1402, title: "Le Trou de la Fermeté", content: "À Yamama, portant l'étendard, il dit : « Quel mauvais porteur de Coran je serais si l'ennemi passait par moi ! ». Il creusa un trou dans le sol pour y fixer ses pieds et ne pas reculer, combattant jusqu'à la mort." },
                    { id: 1403, title: "Les deux cents dirhams", content: "Il est rapporté qu’après le décès de Salim, ‘Oumar vendit ses biens pour deux cents dirhams et remit cette somme à sa mère, en héritage. Le fascicule ne parle pas d’une aumône ni ne dit ici qu’il n’avait aucun héritier." }
                ],
                hadiths: [
                    { text: "Apprenez la récitation du Coran auprès de quatre personnes, dont Sâlim, affranchi d'Abou Houdhayfa.", narrator: "Le Prophète ﷺ, d'après Abd-Allah ibn ‘Amr", source: "Sahîh al-Bukhârî 3758" },
                    { text: "Louange à Allah qui a placé dans ma communauté quelqu'un comme lui !", narrator: "Le Prophète ﷺ, d'après ‘Â’isha", source: "Ibn Mâjah 1338 — sahîh selon Al-Albânî ; hasan selon Ibn Hajar (Dorar)" }
                ],
                quizData: [
                    {"q":"Quel recueil rapporte que Sâlim dirigeait les émigrés en prière à Qoubâ ?","opts":["Sahîh al-Bukhârî 692","Al-Mouwatta uniquement","Aucune référence"],"c":0,"exp":"Ibn ‘Oumar indique que Sâlim connaissait davantage de Coran.","ref":"https://sunnah.com/bukhari:692"},
                    {"q":"Quel avis sur le cas de Sâlim rapporte Mouslim 1454 ?","opts":["Les autres épouses le considéraient comme une exception propre à Sâlim","Toutes imposaient l'application générale","Il n'existe pas de récit"],"c":0,"exp":"Le texte rapporte une permission spéciale selon les autres épouses du Prophète, contrairement à l'approche attribuée à ‘Â’isha.","ref":"https://sunnah.com/muslim:1454"},
                    {"q":"Dans quel recueil trouve-t-on l'éloge de la récitation de Sâlim ?","opts":["Ibn Mâjah 1338","Al-Bukhârî 1276","Mouslim 1887"],"c":0,"exp":"Ibn Mâjah 1338 ; sahîh selon Darussalam et Al-Albânî, hasan selon Ibn Hajar.","ref":"https://sunnah.com/ibnmajah:1338"},
                    { q: "Pourquoi dirigeait-il la prière devant des grands compagnons comme Omar à Qouba ?", opts: ["Il était le plus âgé", "Il connaissait le plus de Coran", "Il était le maître des lieux", "Il était Qourashite"], c: 1, exp: "Sa mémorisation du Coran lui donnait la prééminence pour l'imamat." },
                    { q: "Comment est-il mort à Yamama ?", opts: ["En fuyant", "En protégeant l'étendard, pieds fixés au sol", "D'une flèche perdue", "De soif"], c: 1, exp: "Une narration attribuée à Al-Wâqidî dans Siyar décrit cette scène ; le récit est conservé avec son attribution historique." }
                ]
            },
            {
                id: 15,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Hamza Ibn Abdelmoutalib",
                arabicName: "حَمْزَة بن عبد المطلب",
                subtitle: "Le Lion d'Allah et le Maître des Martyrs",
                intro: "Hamza ibn ‘Abd al-Mouttalib, oncle et frère de lait du Prophète ﷺ, participa à Badr et fut tué à Ouhoud. Le témoignage de Wahchî est rapporté dans Al-Bukhârî 4072 ; les titres honorifiques et les autres récits sont présentés avec leurs jugements propres.",
                heroQuote: "Wahchî rapporte : « Je lançai sur Hamza mon javelot, qui l'atteignit mortellement » (Al-Bukhârî 4072).",
                tags: ["Martyrs", "Ahl al-Bayt", "Commandants", "Badriyun"],
                genealogy: "Hamza ibn Abdelmoutalib ibn Hashim. Surnommé « Abou Oumara » et « Abou Ya'la ». Il est l'oncle du Prophète et son frère de lait (allaités par Thouwayba).",
                physicalDesc: "Un guerrier redoutable. Wahchi le décrit à Ouhoud : « Il terrassait les hommes... Il ressemblait à un chameau cendré (gris) tant la poussière de la bataille l'avait recouvert. »",
                timeline: [
                    { year: "La Mecque", desc: "Sa conversion offre une protection immédiate au Prophète contre les Qurayshites." },
                    { year: "2 H", desc: "À {Badr}, il tue le champion des polythéistes Outba ibn Rabi'a en duel." },
                    { year: "3 H", desc: "Combat à {Ouhoud} avec deux épées en criant « Je suis le Lion d'Allah ». Tué par traîtrise." },
                    { year: "Funérailles", desc: "Les récits divergent sur la prière funéraire. Dhahabî juge plus probante la version selon laquelle aucune prière ne fut accomplie sur les martyrs d’Ouhoud le jour même ; une prière ultérieure est également rapportée." }
                ],
                narratives: [
                    { id: 1501, title: "Le récit de Wahchî", content: "Wahchî rapporte qu’il combattait à Ouhoud après avoir reçu la promesse d’être affranchi s’il tuait Hamza. Il raconte avoir vu Hamza affronter Sibâ’ ibn Abd Al-‘Ouzza, puis lui avoir lancé une javeline qui le frappa à l’abdomen. Hamza tenta de se relever avant de succomber." },
                    { id: 1502, title: "Le deuil du Prophète et la mutilation", content: "Des récits décrivent la douleur du Messager d’Allah (ﷺ) devant la dépouille mutilée de Hamza. Une narration attribuée à Moussa ibn ‘Ouqba rapporte que Wahchî lui aurait retiré le foie afin de l’apporter à Hind : le texte ne dit pas que Hind l'avait extrait elle-même. Le Prophète exprima aussi le souhait de préserver Safiya d’une nouvelle peine." },
                    { id: 1503, title: "Un linceul trop court", content: "Selon la notice de Hamza, son corps fut enveloppé dans un vêtement rayé trop court : lorsque l’on couvrait sa tête, ses pieds dépassaient. Une autre tradition du même fascicule mentionne des branches d’arbres pour le couvrir. Le recours à l’idhkhir pour les pieds est rapporté dans la notice de Mouss’ab ibn Oumayr, et ne doit pas être transféré ici sans une autre source." },
                    { id: 1504, title: "La conversion de Wahchî et le combat contre Moussaylima", content: "Wahchî rapporte qu’il se convertit et que le Prophète (ﷺ), peiné par le souvenir de Hamza, lui demanda de ne plus se montrer devant lui. Plus tard, à Al-Yamâma, il lança sa javeline sur Moussaylima, qu’un combattant ansâri frappa également. Il exprima lui-même une réserve : si Moussaylima était mort de son coup, il aurait tué le meilleur des hommes après le Prophète et le pire d’entre eux." }
                ],
                hadiths: [
                    { text: "Hamza ibn Abdelmoutalib est le Maître des Martyrs (Sayyid al-Shuhada) !", narrator: "Le Prophète (ﷺ)", source: "Al-Hâkim, d’après Jâbir — chaîne faible selon Dhahabî (Siyar, notice de Hamza)" },
                    { text: "Les âmes des martyrs résident dans des oiseaux verts et trouvent leur subsistance au Paradis.", narrator: "Le Prophète ﷺ, d'après Ibn Mas‘oud", source: "Sahîh Mouslim 1887 — enseignement général sur les martyrs, non propre à Hamza" },
                    { text: "Mais Hamza, personne ne le pleure ! (parole rapportée après Ouhoud)", narrator: "Le Prophète ﷺ, d'après Ibn ‘Oumar", source: "Ibn Mâjah 1591 ; Ahmad 5666 — isnâd hasan selon Shu‘ayb al-Arna’ût (Dorar)" }
                ],
                quizData: [
                    {"q":"Quelle source transmet le témoignage direct de Wahchî sur Ouhoud ?","opts":["Al-Bukhârî 4072","Le verset 22:19","Le recueil de Mouslim 1454"],"c":0,"exp":"Al-Bukhârî 4072 rapporte la mort de Hamza et le parcours ultérieur de Wahchî.","ref":"https://sunnah.com/bukhari:4072"},
                    {"q":"Quel savant a qualifié de hasan l'isnâd du récit des femmes pleurant Hamza ?","opts":["Shu‘ayb al-Arna’ût","At-Tabarî","Ibn Hazm"],"c":0,"exp":"Dorar cite Shu‘ayb al-Arna’ût pour Ahmad 5666, tandis qu'une autre voie porte le numéro Ahmad 5563.","ref":"https://dorar.net/h/aAGK8Qtz"},
                    { q: "Quelle arme a tué Hamza ?", opts: ["Une épée", "Une flèche", "Une javeline (Harba)", "Une pierre"], c: 2, exp: "Wahchi était un expert du lancer de javeline éthiopienne." },
                    { q: "Quelle réserve accompagne une voie du titre « maître des martyrs » ?", opts: ["Aucune, toutes les voies sont unanimement sahîh", "Adh-Dhahabî indique une chaîne faible pour la version de Jâbir", "Il s'agit d'un verset du Coran"], c: 1, exp: "Adh-Dhahabî juge faible l’isnâd de la version rapportée de Jâbir dans Siyar 1/173. L’expression honorifique est conservée en indiquant ce jugement.", ref: "https://dorar.net/h/cK6Ib1Lk?osoul=1" },
                    { q: "Que faut-il distinguer dans les récits du linceul de Hamza ?", opts: ["La notice de Hamza et le récit d'Al-Bukhârî concernant Mouss’ab", "Tous les récits parlent exactement des mêmes détails", "Le linceul concerne uniquement Badr"], c: 0, exp: "La notice de Hamza mentionne un tissu trop court et d'autres versions ; l’idhkhir est explicitement présent dans le hadith de Mouss’ab (Al-Bukhârî 1276).", ref: "https://sunnah.com/bukhari:1276" }
                ]
            },
            {
                id: 16,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Aqil ibn Al-Boukayr",
                arabicName: "عَاقِل بن البكير",
                subtitle: "L'Aîné de la Fratrie de Badr",
                intro: "‘Aqil, anciennement appelé Ghâfil selon Ibn Sa‘d, appartient à une fratrie de quatre compagnons présents à Badr. Les transmissions biographiques rapportent sa conversion, son émigration et sa mort à Badr à 34 ans ; certaines précisions ont des variantes.",
                heroQuote: "Selon Ibn Sa‘d, il portait d’abord le nom de « Ghâfil » avant que le Prophète ﷺ ne l’appelle ‘Aqil.",
                tags: ["Badriyun", "Fratrie", "Martyrs"],
                genealogy: "'Aqil ibn Al-Boukayr Al-Laythi. Allié (Halif) des Banou 'Adi (le clan d'Omar).",
                physicalDesc: "Il avait 34 ans lorsqu'il tomba martyr.",
                timeline: [
                    { year: "Mecque", desc: "Selon une transmission d’Ibn Sa‘d d’après Yazîd ibn Roumân, les quatre frères se convertirent ensemble et furent parmi les premiers à prêter allégeance dans la maison d’Al-Arqam." },
                    { year: "Hégire", desc: "Selon une autre transmission d’Ibn Sa‘d, la famille émigra à Médine, laissant ses maisons fermées à La Mecque." },
                    { year: "2 H", desc: "Participe à Badr avec ses trois frères selon Ibn Sa‘d et Ibn Ishâq ; adh-Dhahabî souligne cette particularité familiale." },
                    { year: "2 H", desc: "Ibn Sa‘d rapporte sa mort à Badr, à 34 ans, et nomme Mâlik ibn Zouhayr comme auteur du coup fatal." }
                ],
                narratives: [
                    { id: 161, title: "Le Changement de Nom", content: "Ibn Sa‘d rapporte que son nom était « Ghâfil » et que le Prophète ﷺ l’appela « ‘Aqil ». L’explication de son intention (« préférant les noms positifs ») n’est pas donnée dans la transmission citée et n’est pas présentée comme une parole prophétique." },
                    { id: 162, title: "L'Exode Total", content: "Une transmission historique reproduite par adh-Dhahabî d’après Ibn Sa‘d rapporte que les hommes et les femmes de la famille émigrèrent à Médine et laissèrent leurs demeures fermées. Elle est conservée comme tradition biographique, sans degré de hadith ajouté." }
                ],
                hadiths: [
                    { text: "Selon une transmission, ‘Aqil et Moubashir ibn ‘Abd al-Moundhir furent désignés frères de foi ; une autre version cite Moujadhar ibn Ziyâd.", narrator: "Récits biographiques recueillis par Ibn Sa‘d", source: "At-Tabaqât ; Siyar (notice de ‘Aqil) — variantes ; non classé ici", type: "historical" },
                    { text: "Selon Yazîd ibn Roumân, les quatre fils d’Abou al-Boukayr embrassèrent l’islam ensemble.", narrator: "Yazîd ibn Roumân, via Ibn Sa‘d", source: "Siyar 1/185 ; transmission historique non classée ici", type: "historical" }
                ],
                quizData: [
                    {"q":"Quelles deux personnes sont mentionnées comme frères de foi de ‘Aqil dans des variantes ?","opts":["Moubashir et Moujadhar","Abou Bakr et ‘Oumar","Hamza et ‘Alî"],"c":0,"exp":"Adh-Dhahabî rapporte les deux attributions : Moubashir ibn ‘Abd al-Moundhir et Moujadhar ibn Ziyâd.","ref":"https://siyar.fr/livre/1/187"},
                    {"q":"Quelle était l'appellation antérieure de ‘Aqil selon Ibn Sa‘d ?","opts":["Ghâfil","Sâlim","Mous‘ab"],"c":0,"exp":"Ibn Sa‘d rapporte qu’il s’appelait Ghâfil avant le changement de nom.","ref":"https://siyar.fr/livre/1/186"},
                    {"q":"Que disent les chroniques du départ de la fratrie pour Médine ?","opts":["Hommes et femmes partirent, leurs maisons restant fermées","Ils ne quittèrent jamais La Mecque","Seul ‘Aqil émigra"],"c":0,"exp":"Le récit d'Ibn Sa‘d repris dans Siyar décrit une émigration familiale, avec les maisons laissées fermées.","ref":"https://siyar.fr/livre/1/187"},
                    { q: "Quel était son nom avant l'Islam ?", opts: ["Zayd", "Ghafil", "Harith", "Amr"], c: 1, exp: "Il s'appelait Ghafil (Insouciant), le Prophète l'a renommé 'Aqil." },
                    { q: "À quel âge est-il mort martyr ?", opts: ["20 ans", "34 ans", "50 ans", "63 ans"], c: 1, exp: "Il est tombé à Badr à l'âge de 34 ans." }
                ]
            },
            {
                id: 17,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khalid ibn Al-Boukayr",
                arabicName: "خالد بن البكير",
                subtitle: "Le Martyr d'Ar-Raji",
                intro: "Khâlid ibn al-Boukayr participa à Badr puis à Ouhoud, selon Ibn Sa‘d cité par adh-Dhahabî. Il mourut lors de l'expédition d'Ar-Rajî‘, en Safar 4 H, à l'âge rapporté de 34 ans.",
                heroQuote: "Ibn Sa‘d rapporte sa participation à Badr et à Ouhoud, puis sa mort à Ar-Rajî‘ en Safar 4 H.",
                tags: ["Badriyun", "Fratrie", "Martyrs"],
                genealogy: "Khalid ibn Al-Boukayr Al-Laythi.",
                physicalDesc: "Mort à 34 ans.",
                timeline: [
                    { year: "2 H", desc: "Combat à Badr." },
                    { year: "3 H", desc: "Combat à Ouhoud." },
                    { year: "4 H", desc: "Tué à Ar-Rajî‘ en Safar 4 H, selon Ibn Sa‘d ; les circonstances détaillées de l'embuscade relèvent d'autres traditions." }
                ],
                narratives: [
                    { id: 171, title: "Le Frère de Foi", content: "Selon Ibn Sa‘d, le Prophète ﷺ établit un lien de fraternité entre Khâlid et Zayd ibn ad-Dathina. La notice de Khâlid rapporte sa mort à Ar-Rajî‘ ; les parcours de chacun doivent être distingués." }
                ],
                hadiths: [
                    { text: "Ibn Sa‘d rapporte que le Prophète ﷺ établit une fraternité entre Khâlid et Zayd ibn ad-Dathina.", narrator: "Ibn Sa‘d, récit biographique", source: "At-Tabaqât, repris dans Siyar 1/187 — non classé ici", type: "historical" }
                ],
                quizData: [
                    {"q":"Quel mois est mentionné pour l'expédition d'Ar-Rajî‘ ?","opts":["Safar","Ramadan","Dhou al-Hijja"],"c":0,"exp":"La notice d'adh-Dhahabî, citant Ibn Sa‘d, la situe en Safar 4 H.","ref":"https://siyar.fr/livre/1/187"},
                    {"q":"Avec quel compagnon Ibn Sa‘d rapporte-t-il un lien de fraternité ?","opts":["Zayd ibn ad-Dathina","Abou Oubayda","Bilâl"],"c":0,"exp":"Le lien avec Zayd ibn ad-Dathina figure dans la notice historique.","ref":"https://siyar.fr/livre/1/187"},
                    {"q":"À quelles deux batailles participa-t-il avant Ar-Rajî‘ ?","opts":["Badr et Ouhoud","Badr et Siffîn","Al-Yamâma et Qâdisiyya"],"c":0,"exp":"Ibn Sa‘d indique Badr et Ouhoud avant sa mort à Ar-Rajî‘.","ref":"https://www.islamweb.net/ar/library/content/60/25/"},
                    {"q":"Quelle est la nature du récit concernant sa fraternité ?","opts":["Une tradition biographique citée par Ibn Sa‘d","Une sourate du Coran","Une parole unanimement jugée sahîh"],"c":0,"exp":"Athar cite le récit et son auteur ; aucun classement indépendant n'a été attribué à cette chaîne.","ref":"https://www.islamweb.net/ar/library/content/60/25/"},
                    { q: "Lors de quel événement Khalid a-t-il été tué ?", opts: ["Badr", "Ouhoud", "Ar-Raji'", "Le Fossé"], c: 2, exp: "Il fut tué lors de l'expédition d'Ar-Raji en l'an 4." }
                ]
            },
            {
                id: 18,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Iyas ibn Al-Boukayr",
                arabicName: "إياس بن أبي البكير",
                subtitle: "Le Conquérant d'Égypte",
                intro: "Iyâs ibn al-Boukayr, l'un des quatre frères présents à Badr, participa selon Ibn Sa‘d aux autres campagnes du Prophète ﷺ. Sa participation à la conquête de l'Égypte et son décès en 34 H sont également rapportés par adh-Dhahabî.",
                heroQuote: "Selon Ibn Sa‘d : « Il participa à Badr et aux autres campagnes », puis à la conquête de l'Égypte.",
                tags: ["Badriyun", "Fratrie", "Conquérants"],
                genealogy: "Iyas ibn Abou Al-Boukayr.",
                timeline: [
                    { year: "2 H", desc: "Présent à Badr." },
                    { year: "Campagnes", desc: "Selon Ibn Sa‘d repris par adh-Dhahabî, participe à la conquête de l'Égypte ; aucune année exacte n'est indiquée dans la notice." },
                    { year: "34 H", desc: "Décès." }
                ],
                narratives: [
                    { id: 181, title: "La Longévité au Combat", content: "D'après la notice d'adh-Dhahabî, Iyâs survécut à ‘Aqil et Khâlid et participa à la conquête de l'Égypte. Il serait décédé en 34 H. Il ne faut pas déduire de ce résumé les détails de campagnes que la source ne donne pas." }
                ],
                hadiths: [
                    { text: "Ibn Sa‘d rapporte que le Prophète ﷺ associa Iyâs et al-Hârith ibn Khazma dans la fraternité médinoise.", narrator: "Ibn Sa‘d, récit historique", source: "At-Tabaqât ; Siyar 1/188 — non classé ici", type: "historical" }
                ],
                quizData: [
                    {"q":"Quelle année de décès est donnée pour Iyâs dans Siyar ?","opts":["34 H","4 H","70 H"],"c":0,"exp":"La notice d'adh-Dhahabî indique un décès en 34 H.","ref":"https://siyar.fr/livre/1/188"},
                    {"q":"Quel compagnon est cité comme son frère de foi ?","opts":["Al-Hârith ibn Khazma","Oubayda ibn al-Hârith","Abou Bakr"],"c":0,"exp":"Ibn Sa‘d rapporte sa fraternité avec al-Hârith ibn Khazma.","ref":"https://www.islamweb.net/ar/library/content/60/26/"},
                    {"q":"Quel auteur relaie sa participation à la conquête d'Égypte ?","opts":["Adh-Dhahabî dans Siyar","L'auteur d'Al-Mouwatta exclusivement","Un chroniqueur anonyme sans ouvrage"],"c":0,"exp":"La notice Siyar reprend Ibn Sa‘d et mentionne cette conquête, sans préciser une année unique.","ref":"https://siyar.fr/livre/1/188"},
                    {"q":"Quel est le bon statut de sa notice concernant l'Égypte ?","opts":["Un récit historique attribué, non un hadith prophétique","Un verset coranique","Un jugement d'authenticité indépendant"],"c":0,"exp":"Le récit d'Ibn Sa‘d transmis par adh-Dhahabî est conservé comme biographie, non comme hadith prophétique.","ref":"https://www.islamweb.net/ar/library/content/60/26/"},
                    { q: "À quelle conquête majeure Iyas a-t-il participé ?", opts: ["La Perse", "L'Égypte", "L'Inde", "L'Espagne"], c: 1, exp: "Il a participé à l'ouverture (Fath) de l'Égypte." }
                ]
            },
            {
                id: 19,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Amir ibn Al-Boukayr",
                arabicName: "عامر بن أبي البكير",
                subtitle: "Le Quatrième Frère",
                intro: "‘Âmir ibn al-Boukayr, l'un des quatre frères présents à Badr selon Ibn Sa‘d, mourut à Al-Yamâma. Les chroniqueurs situent cette bataille à la fin de 11 H ou au début de 12 H ; Athar ne fixe pas arbitrairement l'année de sa mort.",
                heroQuote: "Adh-Dhahabî souligne que quatre frères de cette même famille participèrent à Badr.",
                tags: ["Badriyun", "Fratrie", "Martyrs"],
                genealogy: "'Amir ibn Abou Al-Boukayr.",
                timeline: [
                    { year: "2 H", desc: "Présent à Badr." },
                    { year: "11 ou 12 H", desc: "Mort à Al-Yamâma selon adh-Dhahabî. Ibn Kathîr rapporte des datations de cette bataille à la fin de 11 H ou au début de 12 H." }
                ],
                narratives: [
                    { id: 191, title: "L'Unicité Historique", content: "Adh-Dhahabî écrit que les quatre fils d'Abou al-Boukayr ont participé ensemble à Badr et qu'il ne connaît pas d'autre fratrie de quatre dans ce cas. Cette formule exprime sa connaissance de l'histoire, et non une révélation prophétique." }
                ],
                hadiths: [
                    { text: "Ibn Sa‘d rapporte que le Prophète ﷺ associa ‘Âmir et Thâbit ibn Qays ibn Shammâs dans la fraternité.", narrator: "Ibn Sa‘d, récit biographique", source: "At-Tabaqât ; Siyar 1/188 — non classé ici", type: "historical" }
                ],
                quizData: [
                    {"q":"Quel auteur souligne le cas de quatre frères ayant participé à Badr ?","opts":["Adh-Dhahabî","L'imam Mâlik dans Al-Mouwatta","Mouslim dans un hadith sur le Hajj"],"c":0,"exp":"Adh-Dhahabî fait cette remarque après les notices d'Iyâs et de ‘Âmir.","ref":"https://siyar.fr/livre/1/188"},
                    {"q":"Qui est mentionné comme frère de foi de ‘Âmir ?","opts":["Thâbit ibn Qays","Abou Hourayra","Salman al-Fârisî"],"c":0,"exp":"Ibn Sa‘d est cité pour la fraternité avec Thâbit ibn Qays ibn Shammâs.","ref":"https://siyar.fr/livre/1/188"},
                    {"q":"Quelles datations de la bataille d'Al-Yamâma sont rapportées par Ibn Kathîr ?","opts":["Fin 11 H ou début 12 H","2 H ou 3 H","40 H ou 41 H"],"c":0,"exp":"Ibn Kathîr rapporte la divergence puis envisage le début et la fin de la campagne entre les deux années.","ref":"https://www.islamweb.net/amp/ar/library/content/59/719/"},
                    {"q":"Comment lire le propos d'adh-Dhahabî sur les quatre frères ?","opts":["Comme une observation historique attribuée","Comme un hadith qudsî","Comme une date révélée"],"c":0,"exp":"Il s'agit d'une remarque de l'historien, non d'un hadith du Prophète.","ref":"https://siyar.fr/livre/1/188"},
                    { q: "Où 'Amir est-il mort ?", opts: ["Badr", "Ouhoud", "Al-Yamama", "Tabouk"], c: 2, exp: "Sa mort à Al-Yamâma est rapportée par adh-Dhahabî. Ibn Kathîr situe l'événement à la fin de 11 H ou au début de 12 H." }
                ]
            },
            {
                id: 20,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mistah ibn Outhatha",
                arabicName: "مِسْطَح بن أُثَاثَة",
                subtitle: "Le Compagnon Pardonné",
                intro: "Mistah ibn Outhâtha, émigré et vétéran de Badr, fut impliqué dans les paroles de l'affaire de la calomnie (al-Ifk). ‘Â’isha rapporte dans Al-Bukhârî 4750 la reprise du soutien financier d'Abou Bakr après la révélation du verset 24:22.",
                heroQuote: "‘Â’isha rapporte qu'Abou Bakr reprit son aide à Mistah après la révélation du verset 24:22 (Al-Bukhârî 4750).",
                tags: ["Badriyun", "Mouhajir", "Pardonné"],
                genealogy: "Mistah ibn Outhatha. Sa mère est Oum Mistah, fille d'Abou Rouhm. Dans le récit d'Al-Bukhârî 4750, la grand-mère maternelle de Mistah est présentée comme la tante d'Abou Bakr.",
                physicalDesc: "Petit de taille, les yeux enfoncés, de grosses mains.",
                timeline: [
                    { year: "2 H", desc: "Combat à Badr." },
                    { year: "Datation discutée", desc: "Son implication dans l'affaire de l'Ifk est rapportée par ‘Â’isha (Al-Bukhârî 4750). Les chroniques divergent sur l'année de l'expédition des Banou al-Moustaliq (4, 5 ou 6 H selon les auteurs)." },
                    { year: "Décès (date discutée)", desc: "Ibn Sa‘d, cité par adh-Dhahabî, donne 34 H et 56 ans ; une autre tradition rapporte que Mistah aurait été présent à Siffîn en 37 H. Ces indications ne permettent pas de fixer ici une année unique." }
                ],
                narratives: [
                    { id: 201, title: "L'Avertissement de Dhahabi", content: "Adh-Dhahabî exhorte son lecteur à ne pas mépriser Mistah pour une faute, rappelant son rang de combattant de Badr et affirmant qu'il est des gens du Paradis. Il s'agit d'un commentaire de l'historien, non d'une parole du Prophète attribuée à Mistah." },
                    { id: 202, title: "La Révélation du Pardon", content: "Selon ‘Â’isha (Al-Bukhârî 4750), Abou Bakr cessa de soutenir financièrement Mistah après l'affaire de la calomnie. Lorsque le verset 24:22 fut révélé, il reprit son aide. Le passage coranique enjoint le pardon ; il ne faut pas lui ajouter une formulation attribuant directement au Prophète une déclaration personnelle sur le sort de Mistah." }
                ],
                hadiths: [
                    { text: "Le Prophète ﷺ rapporte au sujet des gens de Badr qu’Allah les a peut-être déjà regardés en leur accordant Son pardon.", narrator: "Le Prophète ﷺ, dans le récit de ‘Alî sur Hâtib", source: "Sahîh al-Bukhârî 3007 — parole générale concernant Badr ; Mistah n'est pas nommé", type: "prophetic" },
                    { text: "Ne regarde pas ce compagnon de Badr avec mépris pour sa faute, écrit adh-Dhahabî.", narrator: "Adh-Dhahabî (commentaire d'historien)", source: "Siyar A‘lâm an-Nubalâ’ 1/188 — commentaire savant, non hadith prophétique", type: "commentary" }
                ],
                quizData: [
                    {"q":"Quel verset est associé à la reprise de l'aide d'Abou Bakr à Mistah ?","opts":["An-Nour 24:22","Al-Ikhlâs 112:1","Al-Fâtiha 1:5"],"c":0,"exp":"Le récit de ‘Â’isha dans Al-Bukhârî 4750 rapproche directement ce geste du verset 24:22.","ref":"https://sunnah.com/bukhari:4750"},
                    {"q":"Le hadith sur le pardon accordé aux combattants de Badr nomme-t-il Mistah ?","opts":["Non, le récit cité concerne Hâtib et évoque les gens de Badr en général","Oui, uniquement Mistah","Le texte ne parle pas de Badr"],"c":0,"exp":"Al-Bukhârî 3007 transmet cette parole dans l'épisode de Hâtib ; Mistah n'y est pas nommé.","ref":"https://sunnah.com/bukhari:3007"},
                    {"q":"Quelle précaution chronologique faut-il garder pour l'affaire de l'Ifk ?","opts":["Les chroniques mentionnent plusieurs années","La date de 6 H est unanimement imposée","Il s'agit d'un événement après 100 H"],"c":0,"exp":"La datation de l'expédition des Banou al-Moustaliq varie selon les chroniqueurs ; Ibn Hajar discute les années 4 à 6 H.","ref":"https://archive-1446.islamqa.info/index.php/ar/answers/484639/"},
                    {"q":"Quel est le statut de l'exhortation d'adh-Dhahabî sur Mistah ?","opts":["Un commentaire de l'historien","Un verset","Un hadith qudsî prononcé par Mistah"],"c":0,"exp":"La notice Siyar rapporte le commentaire d'adh-Dhahabî ; Athar le distingue d'un hadith.","ref":"https://www.islamweb.net/ar/library/content/60/28/"},
                    { q: "Que rapporte ‘Â’isha sur la parenté entre Mistah et Abou Bakr ?", opts: ["Ils avaient un lien familial par Oum Mistah", "Ils étaient frères", "Ils étaient père et fils"], c: 0, exp: "Al-Bukhârî 4750 explique la parenté maternelle et le soutien financier d'Abou Bakr à Mistah.", ref: "https://sunnah.com/bukhari:4750" },
                    { q: "Pourquoi est-il célèbre malgré sa faute ?", opts: ["Il a tué un chef", "Il est un vétéran de Badr pardonné", "Il était riche", "Il a fui"], c: 1, exp: "Adh-Dhahabî rappelle son mérite de combattant de Badr ; il ne faut pas confondre ce commentaire avec une parole prophétique nominative sur Mistah." }
                ]
            },
            {
                id: 21,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou 'Abs",
                arabicName: "أبو عبس",
                subtitle: "Le Lettré des Ansâr",
                intro: "Abou ‘Abs ibn Jabr, Ansârî présent à Badr, est décrit par adh-Dhahabî comme l'un des rares hommes sachant écrire l'arabe. Sa participation à l'expédition contre Ka‘b ibn al-Ashraf et son service de percepteur sont transmis par les sources identifiées.",
                heroQuote: "Adh-Dhahabî rapporte qu'Abou ‘Abs savait écrire l'arabe, aptitude alors peu répandue.",
                tags: ["Ansar", "Badriyun", "Lettré"],
                genealogy: "Abou 'Abs (Abderrahman) ibn Jabr, des Aous.",
                physicalDesc: "Il savait écrire, une compétence rare.",
                timeline: [
                  {
                    "year": "Avant Badr",
                    "desc": "Avec Abou Bourda ibn Niyâr, il détruisit les idoles des Banou Hâritha, selon la biographie transmise par adh-Dhahabî."
                  },
                  {
                    "year": "2 H",
                    "desc": "Participe à la bataille de Badr selon la notice Siyar."
                  },
                  {
                    "year": "Après Badr",
                    "desc": "Une variante nomme Abou ‘Abs parmi les hommes ayant accompagné Muhammad ibn Maslama contre Ka‘b ibn al-Ashraf (Al-Bukhârî 4037). Aucune date n'est tirée de ce seul libellé."
                  },
                  {
                    "year": "34 H",
                    "desc": "La notice d'adh-Dhahabî place sa mort à Médine à 70 ans ; ‘Outhman aurait prié sur lui."
                  }
                ],
                narratives: [
                  {
                    "id": 211,
                    "title": "Abou ‘Abs dans les versions de l'expédition contre Ka‘b",
                    "content": "Adh-Dhahabî le cite parmi les participants à l'expédition. Al-Bukhârî 4037 rapporte l'opération d'après Jâbir ; la liste des hommes varie selon les transmetteurs et une version mentionne Abou ‘Abs ibn Jabr. Il faut distinguer la liste des compagnons du texte principal."
                  },
                  {
                    "id": 212,
                    "title": "La collecte de la zakât",
                    "content": "La notice de Siyar attribue à ‘Oumar puis à ‘Outhman la nomination d'Abou ‘Abs pour la collecte de la zakât. Il s'agit d'une donnée biographique, non d'un hadith prophétique indépendamment classé."
                  }
                ],
                hadiths: [
                  {
                    "text": "Selon la notice de Siyar, le Prophète ﷺ établit une fraternité entre Abou ‘Abs et Khounays ibn Houdhâfa.",
                    "narrator": "Récit biographique reproduit par adh-Dhahabî",
                    "source": "Siyar, notice 21 — degré de cette transmission non précisé",
                    "type": "historical"
                  }
                ],
                quizData: [
                  {
                    "q": "Quelle aptitude adh-Dhahabî mentionne-t-il chez Abou ‘Abs ?",
                    "opts": [
                      "Savoir écrire l'arabe",
                      "La navigation",
                      "La médecine"
                    ],
                    "c": 0,
                    "exp": "La notice le cite parmi les personnes sachant écrire à cette époque.",
                    "ref": "https://siyar.fr/livre/1/190"
                  },
                  {
                    "q": "Avec qui le récit biographique le montre-t-il détruisant des idoles ?",
                    "opts": [
                      "Abou Bourda ibn Niyâr",
                      "Souhayl ibn ‘Amr",
                      "Abou Jandal"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî mentionne Bourda ibn Niyâr et les idoles des Banou Hâritha.",
                    "ref": "https://siyar.fr/livre/1/190"
                  },
                  {
                    "q": "Quel recueil présente une variante des noms des participants à l'expédition contre Ka‘b ?",
                    "opts": [
                      "Al-Bukhârî 4037",
                      "At-Tirmidhî 3854",
                      "Mouslim 1887"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 4037 rapporte l'expédition et signale une variante dans l'identification des participants.",
                    "ref": "https://sunnah.com/bukhari:4037"
                  },
                  {
                    "q": "Qui le désigna comme percepteur de zakât selon la notice ?",
                    "opts": [
                      "‘Oumar puis ‘Outhman",
                      "Les Abbassides",
                      "Al-Hajjâj"
                    ],
                    "c": 0,
                    "exp": "La fonction est rapportée par Siyar ; elle ne doit pas être transformée en parole prophétique.",
                    "ref": "https://siyar.fr/livre/1/190"
                  },
                  {
                    "q": "Quelle année de décès indique adh-Dhahabî pour Abou ‘Abs ?",
                    "opts": [
                      "34 H",
                      "97 H",
                      "18 H"
                    ],
                    "c": 0,
                    "exp": "La notice mentionne 34 H et la prière funéraire de ‘Outhman.",
                    "ref": "https://siyar.fr/livre/1/190"
                  }
                ]
            },
            {
                id: 22,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Malik ibn At-Tayihane",
                arabicName: "ابن التيهان",
                subtitle: "Le Monothéiste Précité",
                intro: "Mâlik ibn at-Tayihân, connu comme Abou al-Haytham, figure parmi les Ansâr et les représentants d'al-‘Aqaba selon les biographies. Adh-Dhahabî rapporte son travail d'estimation des récoltes de Khaybar et plusieurs traditions divergentes sur sa mort.",
                heroQuote: "« Celui qui est consulté est dépositaire d'une confiance » : hadith transmis dans la notice d'Abou al-Haytham, degré de cette voie non établi ici.",
                tags: ["Ansar", "Aqaba", "Badriyun"],
                genealogy: "Malik ibn At-Tayihane. Il prêchait le Tawhid avec As'ad ibn Zourara à l'époque pré-islamique.",
                timeline: [
                  {
                    "year": "Avant l'Hégire",
                    "desc": "La notice rapporte son rejet des idoles et l'attachement au monothéisme avant l'islam."
                  },
                  {
                    "year": "Avant l'Hégire",
                    "desc": "Selon la sîra, il figure parmi les représentants (nuqabâ’) de la rencontre d'al-‘Aqaba."
                  },
                  {
                    "year": "Khaybar",
                    "desc": "Des récits biographiques le présentent comme chargé d'estimer les dattes de Khaybar ; aucune année individuelle n'est inventée pour cette mission."
                  },
                  {
                    "year": "20 H (autres récits : Siffîn)",
                    "desc": "Sâlih ibn Kaysân le fait mourir sous ‘Oumar ; d'autres donnent 20 H ou le placent à Siffîn. Al-Wâqidî préférait le décès antérieur à Siffîn."
                  }
                ],
                narratives: [
                  {
                    "id": 221,
                    "title": "La mission d'estimation et la prière du Prophète",
                    "content": "Adh-Dhahabî rapporte qu'Abou al-Haytham estimait les récoltes de Khaybar. Quand Abou Bakr envisagea une mission semblable, il aurait répondu que le Prophète invoquait pour lui à son retour. Ce sont des traditions biographiques, et non un degré d'authenticité établi par Athar."
                  }
                ],
                hadiths: [
                  {
                    "text": "« Celui qui est consulté est dépositaire d'une confiance. »",
                    "narrator": "Attribué au Prophète ﷺ, transmis dans cette notice par Abou al-Haytham",
                    "source": "Siyar 1/192 : chaîne signalant ‘Abd al-Hakîm ibn Mansour ; degré de cette voie non établi ici",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel surnom désigne Mâlik ibn at-Tayihân ?",
                    "opts": [
                      "Abou al-Haytham",
                      "Abou Jandal",
                      "Abou Yahyâ"
                    ],
                    "c": 0,
                    "exp": "Mâlik est connu sous le nom d'Abou al-Haytham.",
                    "ref": "https://siyar.fr/livre/1/190"
                  },
                  {
                    "q": "Quel rôle lui attribuent les récits de Khaybar ?",
                    "opts": [
                      "Estimer les récoltes de dattes",
                      "Diriger la flotte",
                      "Copier des manuscrits"
                    ],
                    "c": 0,
                    "exp": "La notice parle d'une estimation des récoltes de Khaybar.",
                    "ref": "https://siyar.fr/livre/1/192"
                  },
                  {
                    "q": "Comment Athar présente-t-il le hadith du conseiller digne de confiance dans cette notice ?",
                    "opts": [
                      "Comme une voie à documenter",
                      "Comme unanimement authentifiée",
                      "Comme une parole d'Abou Bakr"
                    ],
                    "c": 0,
                    "exp": "La notice donne une chaîne mais ne suffit pas à attribuer un degré établi sans avis identifiable.",
                    "ref": "https://siyar.fr/livre/1/192"
                  },
                  {
                    "q": "Quelle mort Al-Wâqidî estime-t-il plus vraisemblable ?",
                    "opts": [
                      "Avant Siffîn, autour de 20 H",
                      "En 97 H",
                      "À Badr"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî cite Al-Wâqidî comparant les versions de la mort.",
                    "ref": "https://siyar.fr/livre/1/192"
                  },
                  {
                    "q": "À quel rassemblement de représentants est-il associé ?",
                    "opts": [
                      "Al-‘Aqaba",
                      "Siffîn",
                      "Al-Qâdisiyya"
                    ],
                    "c": 0,
                    "exp": "La notice rattache Abou al-Haytham aux représentants d'al-‘Aqaba.",
                    "ref": "https://siyar.fr/livre/1/190"
                  }
                ]
            },
            {
                id: 23,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Jandal",
                arabicName: "أبو جندل",
                subtitle: "Le Prisonnier de la Foi",
                intro: "Abou Jandal, dont le prénom était al-‘Âss, était le fils de Souhayl ibn ‘Amr. Son arrivée entravée à al-Houdaybiya et les négociations autour de son retour sont rapportées dans Al-Bukhârî 2731–2732. Il retrouva ensuite sa liberté et mourut selon les chroniques durant la peste d'‘Amwâs.",
                heroQuote: "À al-Houdaybiya, Abou Jandal supplia les musulmans de ne pas le reconduire aux siens (Al-Bukhârî 2731–2732).",
                tags: ["Mouhajir", "Patience", "Martyr"],
                genealogy: "Al-Ass (son vrai nom) ibn Souhayl ibn 'Amr.",
                timeline: [
                  {
                    "year": "6 H",
                    "desc": "Arrive à al-Houdaybiya en portant des entraves, alors que se négocie le traité avec son père Souhayl ; le récit figure dans Al-Bukhârî 2731–2732."
                  },
                  {
                    "year": "Après al-Houdaybiya",
                    "desc": "Le récit d'Al-Bukhârî le montre rejoignant Abou Basîr après avoir retrouvé sa liberté."
                  },
                  {
                    "year": "18 H",
                    "desc": "Adh-Dhahabî rapporte sa mort au Shâm lors de la peste d'‘Amwâs, en 18 H."
                  }
                ],
                narratives: [
                  {
                    "id": 231,
                    "title": "Le retour imposé lors des négociations",
                    "content": "Selon al-Miswar ibn Makhrama et Marwân dans Al-Bukhârî 2731–2732, Abou Jandal parvint à al-Houdaybiya avec ses entraves. Son père Souhayl réclama son retour au titre de la condition négociée ; le Prophète tenta d'obtenir une exception. Le récit préserve également les protestations d'Abou Jandal."
                  },
                  {
                    "id": 232,
                    "title": "La sortie d'Abou Jandal et son association avec Abou Basîr",
                    "content": "Al-Bukhârî 2731–2732 rapporte qu'Abou Jandal retrouva ensuite sa liberté et rejoignit le groupe d'Abou Basîr. Ce développement figure dans la même transmission que les négociations d'al-Houdaybiya."
                  }
                ],
                hadiths: [
                  {
                    "text": "Abou Jandal arriva à al-Houdaybiya avec ses entraves, tandis que son père réclamait son retour.",
                    "narrator": "Al-Miswar ibn Makhrama et Marwân",
                    "source": "Sahîh al-Bukhârî 2731–2732 — récit transmis dans le Sahîh",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Dans quel recueil retrouve-t-on l'arrivée d'Abou Jandal à al-Houdaybiya ?",
                    "opts": [
                      "Al-Bukhârî 2731–2732",
                      "At-Tirmidhî 3854",
                      "Mouslim 1887"
                    ],
                    "c": 0,
                    "exp": "La transmission d'al-Miswar et de Marwân rapporte son arrivée entravée.",
                    "ref": "https://sunnah.com/bukhari:2731"
                  },
                  {
                    "q": "Qui exigeait son retour pendant les négociations ?",
                    "opts": [
                      "Son père Souhayl",
                      "‘Oumar",
                      "Abou Bakr"
                    ],
                    "c": 0,
                    "exp": "Souhayl ibn ‘Amr, son père, était l'un des négociateurs.",
                    "ref": "https://sunnah.com/bukhari:2731"
                  },
                  {
                    "q": "Quel autre compagnon Abou Jandal rejoignit-il ensuite ?",
                    "opts": [
                      "Abou Basîr",
                      "Bilâl",
                      "Khâlid ibn al-Boukayr"
                    ],
                    "c": 0,
                    "exp": "Le récit d'Al-Bukhârî mentionne sa réunion avec Abou Basîr.",
                    "ref": "https://sunnah.com/bukhari:2731"
                  },
                  {
                    "q": "Quel était le prénom d'Abou Jandal selon Siyar ?",
                    "opts": [
                      "Al-‘Âss",
                      "Al-Haytham",
                      "Al-Barâ’"
                    ],
                    "c": 0,
                    "exp": "La notice d'adh-Dhahabî précise qu'il s'appelait al-‘Âss.",
                    "ref": "https://siyar.fr/livre/1/192"
                  },
                  {
                    "q": "À quel événement les chroniques rattachent-elles sa mort ?",
                    "opts": [
                      "À la peste d'‘Amwâs",
                      "À Badr",
                      "À Al-Yamâma"
                    ],
                    "c": 0,
                    "exp": "La notice le fait mourir au Shâm lors de la peste de 18 H.",
                    "ref": "https://siyar.fr/livre/1/193"
                  }
                ]
            },
            {
                id: 24,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Souhayl",
                arabicName: "عَبْدُ الله بن سُهَيْل",
                subtitle: "L'Infiltré de Badr",
                intro: "‘Abd-Allah ibn Souhayl, frère d'Abou Jandal, aurait rejoint les musulmans depuis les rangs qurayshites le jour de Badr. Il mourut selon adh-Dhahabî à al-Yamâma. L'auteur signale expressément qu'un récit attribué à son père est chronologiquement contradictoire et ne doit pas être rapporté comme un propos assuré.",
                heroQuote: "Adh-Dhahabî relève une contradiction chronologique dans une parole attribuée à Souhayl sur le martyre de son fils.",
                tags: ["Badriyun", "Martyrs", "Yamama"],
                genealogy: "Abd-Allah ibn Souhayl ibn 'Amr.",
                timeline: [
                  {
                    "year": "2 H",
                    "desc": "Selon Siyar, rejoint le camp musulman pendant la bataille de Badr après avoir dissimulé sa foi."
                  },
                  {
                    "year": "12 H",
                    "desc": "La notice rapporte sa mort à al-Yamâma, à l'âge de 38 ans, et mentionne aussi une tradition de première émigration en Abyssinie."
                  }
                ],
                narratives: [
                  {
                    "id": 241,
                    "title": "L'intercession évoquée par Souhayl : récit chronologiquement problématique",
                    "content": "Al-Wâqidî attribue à Souhayl une parole selon laquelle il espérait bénéficier de l'intercession de son fils martyr. Adh-Dhahabî signale explicitement une incohérence chronologique : la scène est placée avant le pèlerinage d'Adieu, alors que la mort de ‘Abd-Allah à al-Yamâma se produisit plus tard. Il présente donc cette attribution avec une réserve explicite."
                  },
                  {
                    "id": 242,
                    "title": "La participation à Badr",
                    "content": "Selon adh-Dhahabî, ‘Abd-Allah vint à Badr avec son père alors qu'il dissimulait sa foi, puis rejoignit les musulmans pendant la bataille. Certains rapporteurs le font plutôt figurer parmi les premiers croyants ayant émigré en Abyssinie ; cette variante est conservée."
                  }
                ],
                hadiths: [
                  {
                    "text": "Le martyr pourra intercéder pour soixante-dix personnes de sa famille.",
                    "narrator": "Le Prophète ﷺ, d'après Abou ad-Dardâ’",
                    "source": "Sunan Abî Dâwoud 2522 — sahîh selon Al-Albânî ; ce hadith général n'est pas un témoignage direct de Souhayl",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quand ‘Abd-Allah rejoignit-il les musulmans selon adh-Dhahabî ?",
                    "opts": [
                      "Lors de Badr",
                      "À Siffîn",
                      "Pendant la peste d'‘Amwâs"
                    ],
                    "c": 0,
                    "exp": "La notice décrit un changement de camp au cours de Badr.",
                    "ref": "https://siyar.fr/livre/1/193"
                  },
                  {
                    "q": "Quelle réserve adh-Dhahabî formule-t-il sur la parole de Souhayl ?",
                    "opts": [
                      "Une incohérence entre la date de la scène et la mort de son fils",
                      "Une erreur dans le nom de Souhayl",
                      "Une citation coranique inventée"
                    ],
                    "c": 0,
                    "exp": "La parole est située avant le pèlerinage d'Adieu, mais le fils est mort plus tard à al-Yamâma.",
                    "ref": "https://siyar.fr/livre/1/194"
                  },
                  {
                    "q": "Qui transmet le hadith sur l'intercession de soixante-dix proches dans Abou Dâwoud 2522 ?",
                    "opts": [
                      "Abou ad-Dardâ’",
                      "Souhayl lui-même",
                      "‘Aqil ibn al-Boukayr"
                    ],
                    "c": 0,
                    "exp": "Abou Dâwoud 2522 passe par Abou ad-Dardâ’, et Al-Albânî le classe sahîh.",
                    "ref": "https://sunnah.com/abudawud:2522"
                  },
                  {
                    "q": "Quel lieu de décès est mentionné pour ‘Abd-Allah ?",
                    "opts": [
                      "Al-Yamâma",
                      "Al-Abwâ",
                      "Ouhoud"
                    ],
                    "c": 0,
                    "exp": "Le récit biographique le fait mourir à al-Yamâma.",
                    "ref": "https://siyar.fr/livre/1/194"
                  },
                  {
                    "q": "Quelle autre tradition est mentionnée pour son parcours initial ?",
                    "opts": [
                      "Une émigration ancienne en Abyssinie",
                      "Un voyage à Oman en 97 H",
                      "Un califat à Médine"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî signale une version le comptant parmi les premiers émigrés en Abyssinie.",
                    "ref": "https://siyar.fr/livre/1/194"
                  }
                ]
            },
            {
                id: 25,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Souhayl ibn 'Amr",
                arabicName: "سُهَيْل بن عمرو",
                subtitle: "L'Orateur Repenti",
                intro: "Souhayl ibn ‘Amr fut capturé à Badr, négocia le traité d'al-Houdaybiya pour Quraysh puis se convertit lors de la conquête de La Mecque. Les récits biographiques rapportent son rôle auprès des Mecquois après le décès du Prophète et des versions divergentes sur son décès au Shâm.",
                heroQuote: "Souhayl ibn ‘Amr négocia les clauses du traité d'al-Houdaybiya, comme le rapporte Al-Bukhârî 2731–2732.",
                tags: ["Orateur", "Hudaybiya", "Ascète"],
                genealogy: "Souhayl ibn 'Amr. Surnommé Abou Yazid.",
                physicalDesc: "Sa peau et son apparence changèrent à force de jeûner et de prier après sa conversion.",
                timeline: [
                  {
                    "year": "2 H",
                    "desc": "Capturé à Badr selon la notice biographique."
                  },
                  {
                    "year": "6 H",
                    "desc": "Négocie pour Quraysh le traité d'al-Houdaybiya ; Al-Bukhârî 2731–2732 rapporte ses échanges avec le Prophète ﷺ."
                  },
                  {
                    "year": "8 H",
                    "desc": "Adh-Dhahabî rapporte sa conversion lors de la conquête de La Mecque."
                  },
                  {
                    "year": "Décès au Shâm (versions divergentes)",
                    "desc": "Al-Madâ’inî situe sa mort à al-Yarmouk ; ach-Châfi‘î et al-Wâqidî la rattachent à la peste d'‘Amwâs. Athar ne choisit pas une version sans source décisive."
                  }
                ],
                narratives: [
                  {
                    "id": 251,
                    "title": "Un discours à La Mecque après la mort du Prophète",
                    "content": "Les ouvrages de sîra attribuent à Souhayl un discours destiné à stabiliser la situation religieuse de La Mecque après le décès du Prophète ﷺ. Ce témoignage est présenté comme une tradition historique, sans le transformer en hadith classé sahîh."
                  },
                  {
                    "id": 252,
                    "title": "Une vie d'adoration après sa conversion",
                    "content": "Adh-Dhahabî rapporte qu'après sa conversion Souhayl multiplia les actes d'adoration et pleurait à l'écoute du Coran. Ces descriptions dépendent des récits biographiques cités et ne constituent pas un jugement autonome sur leurs chaînes."
                  }
                ],
                hadiths: [
                  {
                    "text": "À al-Houdaybiya, Souhayl demanda la rédaction de clauses concernant les déplacements entre Quraysh et les musulmans.",
                    "narrator": "Al-Miswar ibn Makhrama et Marwân",
                    "source": "Al-Bukhârî 2731–2732 — récit du traité, non citation prophétique inventée",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel événement Souhayl négocia-t-il au nom de Quraysh ?",
                    "opts": [
                      "Le traité d'al-Houdaybiya",
                      "La bataille de Siffîn",
                      "La bataille de Shushtar"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 2731–2732 rapporte sa participation aux négociations.",
                    "ref": "https://sunnah.com/bukhari:2731"
                  },
                  {
                    "q": "Quel lien familial unissait Souhayl à Abou Jandal ?",
                    "opts": [
                      "Il était son père",
                      "Il était son frère",
                      "Il était son cousin"
                    ],
                    "c": 0,
                    "exp": "Souhayl exigea le retour de son fils Abou Jandal pendant la négociation.",
                    "ref": "https://sunnah.com/bukhari:2731"
                  },
                  {
                    "q": "À quelle occasion les biographies situent-elles sa conversion ?",
                    "opts": [
                      "À la conquête de La Mecque",
                      "À Badr",
                      "Au califat d'‘Outhman"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî relate sa conversion à la conquête de La Mecque.",
                    "ref": "https://siyar.fr/livre/1/194"
                  },
                  {
                    "q": "Quelles versions de sa mort cite adh-Dhahabî ?",
                    "opts": [
                      "Al-Yarmouk ou la peste d'‘Amwâs",
                      "Badr ou Ouhoud",
                      "Oman ou Al-Abwâ"
                    ],
                    "c": 0,
                    "exp": "Al-Madâ’inî et d'autres donnent al-Yarmouk, tandis qu'ach-Châfi‘î et al-Wâqidî parlent de la peste.",
                    "ref": "https://siyar.fr/livre/1/196"
                  },
                  {
                    "q": "Quelle est la nature du récit sur son discours après le décès du Prophète ?",
                    "opts": [
                      "Une narration biographique attribuée",
                      "Un verset coranique",
                      "Un jugement unanime de hadith"
                    ],
                    "c": 0,
                    "exp": "Le récit est conservé avec l'attribution historique et sans classement inventé.",
                    "ref": "https://siyar.fr/livre/1/195"
                  }
                ]
            },
            {
                id: 26,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Bara ibn Malik",
                arabicName: "البراء بن مالك",
                subtitle: "L'Homme au Serment Exaucé",
                intro: "Al-Barâ’ ibn Mâlik, frère d'Anas, est mentionné dans At-Tirmidhî 3854 parmi ceux dont Allah exauce le serment. Les chroniques lui attribuent un exploit à al-Yamâma et sa mort à Shushtar en 20 H. Le récit des quatre-vingt-dix-neuf duels demeure une déclaration rapportée, non un total de cent établi.",
                heroQuote: "At-Tirmidhî 3854 : le Prophète ﷺ nomme Al-Barâ’ parmi ceux dont Allah exauce le serment (hasan gharîb selon At-Tirmidhî).",
                tags: ["Guerrier", "Martyrs", "Yamama"],
                genealogy: "Al-Bara ibn Malik Al-Ansari.",
                physicalDesc: "Il avait une apparence miséreuse (vieux vêtements), mais une valeur immense auprès d'Allah.",
                timeline: [
                  {
                    "year": "11 ou 12 H",
                    "desc": "Selon les chroniques, Al-Barâ’ fut porté au-dessus du mur du jardin pendant la bataille d'al-Yamâma ; la bataille est située à la fin de 11 H ou au début de 12 H."
                  },
                  {
                    "year": "20 H",
                    "desc": "Adh-Dhahabî rapporte sa mort à Shushtar lors des campagnes du Khûzistân."
                  }
                ],
                narratives: [
                  {
                    "id": 261,
                    "title": "La porte du jardin à al-Yamâma",
                    "content": "Adh-Dhahabî rapporte qu'Al-Barâ’ demanda à être porté sur un bouclier puis projeté au-delà du mur du jardin où s'étaient retranchés les adversaires. Le récit est conservé avec son attribution biographique sans lui attribuer un degré de hadith non retrouvé."
                  },
                  {
                    "id": 262,
                    "title": "Le serment d'Al-Barâ’",
                    "content": "Anas ibn Mâlik transmet un hadith dans Jâmi‘ at-Tirmidhî 3854 où le Prophète ﷺ mentionne Al-Barâ’ parmi les serviteurs dont Allah exauce le serment. At-Tirmidhî le classe hasan gharîb pour cette voie et l'édition Darussalam hasan."
                  }
                ],
                hadiths: [
                  {
                    "text": "Parmi les serviteurs méconnus dont Allah honore le serment figure Al-Barâ’ ibn Mâlik.",
                    "narrator": "Anas ibn Mâlik, d'après le Prophète ﷺ",
                    "source": "Jâmi‘ at-Tirmidhî 3854 — hasan gharîb selon At-Tirmidhî ; hasan selon Darussalam",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel classement At-Tirmidhî donne-t-il au hadith 3854 ?",
                    "opts": [
                      "Hasan gharîb",
                      "Moutawâtir",
                      "Inventé unanimement"
                    ],
                    "c": 0,
                    "exp": "At-Tirmidhî écrit hasan gharîb ; Darussalam affiche hasan.",
                    "ref": "https://sunnah.com/tirmidhi:3854"
                  },
                  {
                    "q": "Qui transmet la parole sur Al-Barâ’ dans ce hadith ?",
                    "opts": [
                      "Anas ibn Mâlik",
                      "Abou Hourayra",
                      "Ibn ‘Abbâs"
                    ],
                    "c": 0,
                    "exp": "Le hadith 3854 est transmis par Anas, le frère d'Al-Barâ’.",
                    "ref": "https://sunnah.com/tirmidhi:3854"
                  },
                  {
                    "q": "Combien d'adversaires Al-Barâ’ dit-il avoir vaincus dans un récit biographique ?",
                    "opts": [
                      "Quatre-vingt-dix-neuf",
                      "Exactement cent",
                      "Dix"
                    ],
                    "c": 0,
                    "exp": "La notice rapporte une déclaration de quatre-vingt-dix-neuf, sans l'ériger en décompte historiquement certifié.",
                    "ref": "https://siyar.fr/livre/1/198"
                  },
                  {
                    "q": "Que raconte la tradition du jardin d'al-Yamâma ?",
                    "opts": [
                      "Al-Barâ’ franchit un mur et ouvrit la porte",
                      "Il négocia le traité d'al-Houdaybiya",
                      "Il mourut à Badr"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî retransmet une narration de son passage par-dessus le mur du jardin.",
                    "ref": "https://siyar.fr/livre/1/196"
                  },
                  {
                    "q": "Où est-il mort selon Siyar ?",
                    "opts": [
                      "À Shushtar",
                      "À La Mecque",
                      "À Al-Abwâ"
                    ],
                    "c": 0,
                    "exp": "La notice situe sa mort à Shushtar en 20 H.",
                    "ref": "https://siyar.fr/livre/1/199"
                  }
                ]
            },
            {
                id: 27,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Nawfal ibn Al-Harith",
                arabicName: "نَوْفَل",
                subtitle: "Le Doyen des Hashimites",
                intro: "Nawfal ibn al-Hârith, parent du Prophète ﷺ, fut capturé parmi les Qurayshites à Badr, puis se convertit. Les chroniques rapportent son émigration à l'époque d'al-Khandaq et son aide matérielle à Hounayn. Adh-Dhahabî donne deux années de décès : 15 ou 20 H.",
                heroQuote: "Adh-Dhahabî rapporte que Nawfal mit trois mille lances à disposition lors de Hounayn.",
                tags: ["Ahl al-Bayt", "Cousin", "Soutien"],
                genealogy: "Nawfal ibn Al-Harith ibn Abdelmoutalib.",
                timeline: [
                  {
                    "year": "2 H",
                    "desc": "Capturé dans les rangs qurayshites à Badr ; le récit biographique mentionne la rançon payée par al-‘Abbâs."
                  },
                  {
                    "year": "5 H",
                    "desc": "Selon Siyar, Nawfal se convertit et émigra l'année d'al-Khandaq."
                  },
                  {
                    "year": "8 H",
                    "desc": "Des récits lui attribuent la mise à disposition de trois mille lances lors de Hounayn."
                  },
                  {
                    "year": "15 ou 20 H",
                    "desc": "Adh-Dhahabî indique une mort estimée en 20 H et rapporte également 15 H. Ces deux versions restent visibles."
                  }
                ],
                narratives: [
                  {
                    "id": 271,
                    "title": "L'aide matérielle lors de Hounayn",
                    "content": "Adh-Dhahabî rapporte que Nawfal mit trois mille lances à disposition au moment de Hounayn, et qu'il resta parmi les hommes qui tinrent bon. Cette information est conservée comme récit historique sans classement de chaîne inventé."
                  }
                ],
                hadiths: [
                  {
                    "text": "Selon la notice d'adh-Dhahabî, le Prophète ﷺ établit un lien de fraternité entre Nawfal et al-‘Abbâs, qui avaient auparavant des intérêts communs.",
                    "narrator": "Adh-Dhahabî, récit biographique",
                    "source": "Siyar, notice 27 — tradition historique non classée ici",
                    "type": "historical"
                  }
                ],
                quizData: [
                  {
                    "q": "Quelle bataille Nawfal vécut-il d'abord dans les rangs qurayshites ?",
                    "opts": [
                      "Badr",
                      "Al-Yamâma",
                      "Shushtar"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî le cite parmi les captifs de Badr.",
                    "ref": "https://siyar.fr/livre/1/199"
                  },
                  {
                    "q": "Quel soutien matériel lui est attribué à Hounayn ?",
                    "opts": [
                      "Trois mille lances",
                      "Trois mille bateaux",
                      "Cent chameaux exclusivement"
                    ],
                    "c": 0,
                    "exp": "La notice mentionne une contribution de trois mille lances.",
                    "ref": "https://siyar.fr/livre/1/199"
                  },
                  {
                    "q": "Quelles années de décès sont réellement mentionnées dans Siyar ?",
                    "opts": [
                      "15 ou 20 H",
                      "20 ou 25 H",
                      "83 ou 84 H"
                    ],
                    "c": 0,
                    "exp": "Le texte consulté mentionne 20 H et 15 H, et non 25 H.",
                    "ref": "https://siyar.fr/livre/1/200"
                  },
                  {
                    "q": "À quelle époque son émigration est-elle située ?",
                    "opts": [
                      "L'année d'al-Khandaq",
                      "Pendant le califat d'Al-Mansour",
                      "En 97 H"
                    ],
                    "c": 0,
                    "exp": "Siyar rapporte qu'il émigra l'année d'al-Khandaq.",
                    "ref": "https://siyar.fr/livre/1/199"
                  },
                  {
                    "q": "Avec qui une tradition le présente-t-elle comme frère de foi ?",
                    "opts": [
                      "Al-‘Abbâs",
                      "Abou Jandal",
                      "Al-Barâ’"
                    ],
                    "c": 0,
                    "exp": "La notice indique une fraternité avec al-‘Abbâs et leur association antérieure dans les affaires.",
                    "ref": "https://siyar.fr/livre/1/199"
                  }
                ]
            },
            {
                id: 28,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Harith ibn Nawfal",
                arabicName: "الحَارِث بن نَوْفَل",
                subtitle: "Le Gouverneur de La Mecque",
                intro: "Al-Hârith ibn Nawfal, fils de Nawfal, est présenté par adh-Dhahabî comme gouverneur de La Mecque sous ‘Oumar et ‘Outhman. La notice lui attribue aussi des responsabilités reçues du Prophète ﷺ et sa mort sous le califat d'‘Outhman, vers l'âge de soixante-dix ans, sans année précise.",
                heroQuote: "Selon Siyar, Al-Hârith ibn Nawfal gouverna La Mecque sous ‘Oumar et ‘Outhman.",
                tags: ["Gouverneur", "Ahl al-Bayt"],
                genealogy: "Al-Harith ibn Nawfal.",
                timeline: [
                  {
                    "year": "À la conversion de son père",
                    "desc": "Adh-Dhahabî rapporte qu'Al-Hârith se convertit avec son père Nawfal ; aucune année personnelle n'est imposée."
                  },
                  {
                    "year": "Califats de ‘Oumar et ‘Outhman",
                    "desc": "La notice le présente comme gouverneur de La Mecque sous ces deux califes ; la période n'est pas transformée en année fictive."
                  },
                  {
                    "year": "Sous le califat d'‘Outhman",
                    "desc": "Siyar rapporte sa mort vers 70 ans, sans année hégirienne exacte."
                  }
                ],
                narratives: [
                  {
                    "id": 281,
                    "title": "Administration de La Mecque",
                    "content": "Adh-Dhahabî mentionne qu'Al-Hârith fut chargé de gouverner La Mecque au temps de ‘Oumar puis d'‘Outhman. Son commentaire ajoute que le Prophète lui avait confié certaines responsabilités. La notice ne détaille pas toutes ces missions et n'établit pas que la parenté à elle seule déterminait les nominations."
                  }
                ],
                hadiths: [
                  {
                    "text": "Adh-Dhahabî affirme que le Prophète ﷺ confia certaines responsabilités à Al-Hârith de son vivant.",
                    "narrator": "Adh-Dhahabî, récit historique",
                    "source": "Siyar 1/200 — détail de la mission et degré de la chaîne non fournis",
                    "type": "historical"
                  }
                ],
                quizData: [
                  {
                    "q": "Quelle ville Al-Hârith ibn Nawfal gouverna-t-il selon Siyar ?",
                    "opts": [
                      "La Mecque",
                      "Alexandrie",
                      "Damas"
                    ],
                    "c": 0,
                    "exp": "La notice le fait gouverner La Mecque sous ‘Oumar et ‘Outhman.",
                    "ref": "https://siyar.fr/livre/1/200"
                  },
                  {
                    "q": "Qui était son père ?",
                    "opts": [
                      "Nawfal ibn al-Hârith",
                      "Abou Jandal",
                      "Al-Barâ’"
                    ],
                    "c": 0,
                    "exp": "Le texte le présente comme le fils de Nawfal.",
                    "ref": "https://siyar.fr/livre/1/200"
                  },
                  {
                    "q": "Quelle année précise de décès donne la notice ?",
                    "opts": [
                      "Aucune : le califat d'‘Outhman seulement",
                      "97 H",
                      "18 H"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî dit qu'il décéda sous ‘Outhman, autour de 70 ans.",
                    "ref": "https://siyar.fr/livre/1/200"
                  },
                  {
                    "q": "Que dit la biographie de son installation après La Mecque ?",
                    "opts": [
                      "Il s'établit à Bassora et y fit construire une maison",
                      "Il émigra au Sri Lanka",
                      "Il dirigea la flotte d'Égypte"
                    ],
                    "c": 0,
                    "exp": "Le passage mentionne Bassora et la construction d'une demeure.",
                    "ref": "https://siyar.fr/livre/1/200"
                  },
                  {
                    "q": "La phrase sur les responsabilités confiées par le Prophète est-elle ici un hadith authentifié ?",
                    "opts": [
                      "Non, un renseignement biographique à attribuer",
                      "Oui, le texte indique une chaîne complète sahîh",
                      "C'est le verset 24:22"
                    ],
                    "c": 0,
                    "exp": "La notice ne fournit pas de jugement de hadith pour cette information.",
                    "ref": "https://siyar.fr/livre/1/200"
                  }
                ]
            },
            {
                id: 29,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Al-Harith",
                arabicName: "عَبْدُ الله بن الحارث",
                subtitle: "Le Transmetteur surnommé Babbâ",
                intro: "‘Abd-Allah ibn al-Hârith ibn Nawfal, surnommé Babbâ, est classé par Ibn Sa‘d parmi les tâbi‘în fiables. Il reçut, nourrisson, une bénédiction du Prophète ﷺ selon la biographie, gouverna Bassora durant les troubles et mourut à Oman, en 83 ou 84 H selon les sources.",
                heroQuote: "Ibn Sa‘d le décrit comme un transmetteur digne de confiance de la génération des tâbi‘în.",
                tags: ["Tabi'i","Gouverneur","Ahl al-Bayt"],
                genealogy: "Abd-Allah ibn Al-Harith. Sa mère est Hind, sœur de Muawiya.",
                physicalDesc: "Béni par la salive du Prophète bébé.",
                timeline: [
                  {
                    "year": "Enfance (sans année)",
                    "desc": "Selon Ibn Sa‘d, sa mère le présenta nourrisson au Prophète ﷺ, qui invoqua pour lui et lui transmit de sa salive ; aucune année précise n'est donnée."
                  },
                  {
                    "year": "Troubles à Bassora",
                    "desc": "Des chroniques indiquent qu'il fut choisi pour gouverner Bassora dans une période de troubles, avant de quitter la ville par crainte d'al-Hajjâj."
                  },
                  {
                    "year": "83 ou 84 H",
                    "desc": "Ibn Sa‘d situe son décès à Oman en 84 H ; Abou ‘Oubayd donne 83 H. La divergence est conservée."
                  }
                ],
                narratives: [
                  {
                    "id": 291,
                    "title": "L'origine du surnom Babbâ",
                    "content": "Adh-Dhahabî rapporte une chanson affectueuse chantée à l'enfant dans la famille, dont dérive le surnom « Babbâ ». Il ne s'agit pas d'une parole prophétique."
                  },
                  {
                    "id": 292,
                    "title": "Le gouvernement de Bassora et le départ pour Oman",
                    "content": "Les récits historiques rapportent qu'il administra Bassora durant la période des troubles, puis partit à Oman par crainte d'al-Hajjâj, dans le contexte de la révolte d'Ibn al-Ash‘ath. Ibn Sa‘d donne 84 H pour sa mort ; Abou ‘Oubayd indique 83 H."
                  }
                ],
                hadiths: [
                  {
                    "text": "Ibn Sa‘d le qualifie de transmetteur de confiance parmi les tâbi‘în ; il rapporte des traditions des compagnons.",
                    "narrator": "Ibn Sa‘d, évaluation biographique d'un transmetteur",
                    "source": "Siyar 1/202 — ce propos d'un historien n'est pas un hadith prophétique",
                    "type": "commentary"
                  }
                ],
                quizData: [
                  {
                    "q": "À quelle génération Ibn Sa‘d rattache-t-il ‘Abd-Allah ibn al-Hârith ibn Nawfal ?",
                    "opts": [
                      "Aux tâbi‘în",
                      "Aux prophètes",
                      "Aux quatre califes"
                    ],
                    "c": 0,
                    "exp": "La notice le qualifie de tâbi‘î, transmetteur digne de confiance selon Ibn Sa‘d.",
                    "ref": "https://siyar.fr/livre/1/202"
                  },
                  {
                    "q": "Quel était son surnom ?",
                    "opts": [
                      "Babbâ",
                      "Abou Jandal",
                      "Abou ‘Abs"
                    ],
                    "c": 0,
                    "exp": "Le surnom affectueux « Babbâ » apparaît dans la notice.",
                    "ref": "https://siyar.fr/livre/1/200"
                  },
                  {
                    "q": "Quelles années de décès sont rapportées ?",
                    "opts": [
                      "83 ou 84 H",
                      "20 ou 25 H",
                      "2 ou 3 H"
                    ],
                    "c": 0,
                    "exp": "Ibn Sa‘d indique 84 H et Abou ‘Oubayd 83 H.",
                    "ref": "https://siyar.fr/livre/1/202"
                  },
                  {
                    "q": "Dans quelle région mourut-il selon la notice ?",
                    "opts": [
                      "Oman",
                      "Al-Abwâ",
                      "Al-Yamâma"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî rapporte son départ de Bassora vers Oman.",
                    "ref": "https://siyar.fr/livre/1/202"
                  },
                  {
                    "q": "Qui désigne Ibn Sa‘d comme responsable de la qualification de confiance ?",
                    "opts": [
                      "Le savant Ibn Sa‘d",
                      "Athar lui-même",
                      "Un hadith du Prophète"
                    ],
                    "c": 0,
                    "exp": "La qualification d'Ibn Sa‘d est rapportée comme son avis, sans que l'application produise un degré personnel.",
                    "ref": "https://siyar.fr/livre/1/202"
                  }
                ]
            },
            {
                id: 30,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Abd-Allah",
                arabicName: "عَبْدُ الله بن عَبْدِ الله",
                subtitle: "Un Transmetteur de la Génération Suivante",
                intro: "‘Abd-Allah ibn ‘Abd-Allah ibn al-Hârith, connu sous le nom d'Abou Yahyâ, fut un transmetteur de la génération postérieure aux compagnons. Il rapporta notamment de son père et d'Ibn ‘Abbâs. Ibn Sa‘d le dit fiable et situe sa mort à al-Abwâ, frappé par le simoun en 97 H, pendant un déplacement avec le calife Soulaymân.",
                heroQuote: "Ibn Sa‘d le décrit comme digne de confiance et situe sa mort à al-Abwâ, en 97 H.",
                tags: ["Tabi'i","Transmetteur","Ahl al-Bayt"],
                genealogy: "Abd-Allah ibn Abd-Allah ibn Al-Harith.",
                timeline: [
                  {
                    "year": "97 H",
                    "desc": "Selon Ibn Sa‘d, il mourut à al-Abwâ, frappé par le vent chaud appelé simoun, lors d'un déplacement avec le calife Soulaymân, qui aurait accompli la prière mortuaire."
                  }
                ],
                narratives: [
                  {
                    "id": 301,
                    "title": "Une mort rapportée à al-Abwâ",
                    "content": "Adh-Dhahabî transmet d'après Ibn Sa‘d que ‘Abd-Allah ibn ‘Abd-Allah fut frappé par le simoun à al-Abwâ en 97 H, alors qu'il voyageait avec le calife Soulaymân. La notice attribue à ce dernier la prière funéraire. Il s'agit d'un récit historique et non d'un hadith prophétique."
                  }
                ],
                hadiths: [
                  {
                    "text": "Ibn Sa‘d le juge fiable, tout en indiquant que peu de traditions ont été rapportées de lui.",
                    "narrator": "Ibn Sa‘d, avis d'un biographe des transmetteurs",
                    "source": "Siyar 1/203 — évaluation de rapporteur, pas hadith prophétique",
                    "type": "commentary"
                  }
                ],
                quizData: [
                  {
                    "q": "Quelle année de décès la notice donne-t-elle ?",
                    "opts": [
                      "97 H",
                      "18 H",
                      "34 H"
                    ],
                    "c": 0,
                    "exp": "Ibn Sa‘d, cité par adh-Dhahabî, indique 97 H.",
                    "ref": "https://siyar.fr/livre/1/203"
                  },
                  {
                    "q": "Où se situait-il lors de sa mort ?",
                    "opts": [
                      "Al-Abwâ",
                      "Badr",
                      "Al-Houdaybiya"
                    ],
                    "c": 0,
                    "exp": "La notice d'Ibn Sa‘d, reproduite par adh-Dhahabî, situe sa mort à al-Abwâ en 97 H.",
                    "ref": "https://siyar.fr/livre/1/203"
                  },
                  {
                    "q": "Quel phénomène est mentionné comme cause de son décès ?",
                    "opts": [
                      "Le vent chaud simoun",
                      "Un naufrage",
                      "Une bataille à Ouhoud"
                    ],
                    "c": 0,
                    "exp": "Ibn Sa‘d parle du simoun, dans son récit biographique.",
                    "ref": "https://siyar.fr/livre/1/203"
                  },
                  {
                    "q": "Quel calife était présent selon le récit ?",
                    "opts": [
                      "Soulaymân",
                      "Abou Bakr",
                      "‘Outhman"
                    ],
                    "c": 0,
                    "exp": "La notice mentionne le calife Soulaymân et la prière sur le défunt.",
                    "ref": "https://siyar.fr/livre/1/203"
                  },
                  {
                    "q": "Qui porte l'appréciation de fiabilité sur ce transmetteur ?",
                    "opts": [
                      "Ibn Sa‘d",
                      "Al-Barâ’",
                      "Athar"
                    ],
                    "c": 0,
                    "exp": "L'avis « digne de confiance » est celui d'Ibn Sa‘d, non une authentification produite par Athar.",
                    "ref": "https://siyar.fr/livre/1/203"
                  }
                ]
            },
            {
                id: 31,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saïd ibn Al-Harith",
                arabicName: "سعيد بن الحارث",
                subtitle: "Le Cousin Discret",
                intro: "Sa‘îd ibn al-Hârith ibn ‘Abd al-Mouttalib est présenté comme cousin du Prophète ﷺ dans Siyar. Adh-Dhahabî n'y connaît qu'un seul récit attribué à ce personnage et signale la présence d'Ibn Lahî‘a dans sa chaîne. Sa biographie personnelle reste très peu documentée.",
                heroQuote: "Adh-Dhahabî : « Je n'ai pas vu d'autre auteur qu'al-Hâkim le mentionner » (Siyar, notice 31).",
                tags: ["Cousin", "Ahl al-Bayt"],
                genealogy: "Saïd ibn Al-Harith ibn Abdelmoutalib.",
                timeline: [
                  {
                    "year": "Époque prophétique, date non établie",
                    "desc": "Al-Hâkim classe Sa‘îd parmi les compagnons ; adh-Dhahabî ne signale aucun autre biographe l'ayant mentionné."
                  }
                ],
                narratives: [
                  {
                    "id": 311,
                    "title": "Le récit isolé de Sa‘îd",
                    "content": "Adh-Dhahabî dit que Salmân al-Agharr transmet de Sa‘îd une parole sur le croyant qui rencontrera Allah. Il signale Ibn Lahî‘a dans la chaîne. La notice ne fournit pas d'évaluation explicite permettant à Athar de classer ce récit par lui-même."
                  },
                  {
                    "id": 312,
                    "title": "Une documentation très réduite",
                    "content": "Adh-Dhahabî explique que seul al-Hâkim lui est connu pour l'avoir compté parmi les compagnons. Aucun voyage, bataille ou événement précis n'est ajouté sans source propre à Sa‘îd."
                  }
                ],
                hadiths: [
                  {
                    "text": "Selon une tradition attribuée à Sa‘îd, quiconque rencontre Allah croyant entrera au Paradis.",
                    "narrator": "Sa‘îd ibn al-Hârith ; transmis par Salmân al-Agharr",
                    "source": "Al-Hâkim, mentionné dans Siyar ; présence d'Ibn Lahî‘a dans la chaîne, sans degré attribué ici",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Qui mentionne Sa‘îd parmi les compagnons selon adh-Dhahabî ?",
                    "opts": [
                      "Al-Hâkim",
                      "Mâlik",
                      "Al-Bukhârî"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî cite al-Hâkim et dit ne pas connaître d'autres notices sur ce personnage.",
                    "ref": "https://www.islamweb.net/ar/library/content/60/39/"
                  },
                  {
                    "q": "Quel transmetteur de la chaîne le biographe signale-t-il ?",
                    "opts": [
                      "Ibn Lahî‘a",
                      "Anas",
                      "Ibn ‘Oumar"
                    ],
                    "c": 0,
                    "exp": "Le commentaire d'adh-Dhahabî souligne la présence d'Ibn Lahî‘a dans le récit.",
                    "ref": "https://www.islamweb.net/ar/library/content/60/39/"
                  },
                  {
                    "q": "Quel thème concerne son seul récit mentionné ?",
                    "opts": [
                      "Le croyant rencontrant Allah",
                      "La bataille de Mou’ta",
                      "Le traité d'al-Houdaybiya"
                    ],
                    "c": 0,
                    "exp": "Le texte porte sur l'espérance de celui qui rencontre Allah avec la foi.",
                    "ref": "https://www.islamweb.net/ar/library/content/60/39/"
                  },
                  {
                    "q": "Combien de récits personnels lui sont attribués dans cette notice ?",
                    "opts": [
                      "Un",
                      "Quarante",
                      "Cent"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî n'en mentionne qu'un ; Athar ne lui fabrique pas d'autres traditions.",
                    "ref": "https://www.islamweb.net/ar/library/content/60/39/"
                  },
                  {
                    "q": "Comment présenter une chaîne non classée dans la notice ?",
                    "opts": [
                      "Avec les réserves et sans verdict inventé",
                      "Sahîh par défaut",
                      "À supprimer sans explication"
                    ],
                    "c": 0,
                    "exp": "L'absence de jugement attribuable à un savant n'autorise pas Athar à l'inventer.",
                    "ref": "https://www.islamweb.net/ar/library/content/60/39/"
                  }
                ]
            },
            {
                id: 32,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Soufiane ibn Al-Harith",
                arabicName: "أبو سُفْيَان بن الحارث",
                subtitle: "Le Cousin Ressemblant",
                intro: "Abou Soufyân ibn al-Hârith, cousin du Prophète ﷺ, s'opposa d'abord à lui avant de se convertir. Al-Bukhârî rapporte qu'il tenait la bride de sa mule à Hounayn. D'autres récits relatent sa réconciliation, son ascétisme et son décès, avec des voies distinctes.",
                heroQuote: "Al-Barâ’ rapporte qu'à Hounayn Abou Soufyân tenait la bride de la mule du Prophète ﷺ (Al-Bukhârî 3042).",
                tags: ["Cousin", "Hunayn", "Poète", "Ahl al-Bayt"],
                genealogy: "Al-Moughira (son vrai nom) ibn Al-Harith. Frère de lait du Prophète (allaité par Halima).",
                physicalDesc: "Il ressemblait physiquement au Prophète.",
                timeline: [
                  {
                    "year": "8 H",
                    "desc": "Sa conversion à l'époque de la conquête de La Mecque est relatée dans les biographies."
                  },
                  {
                    "year": "8 H",
                    "desc": "Al-Bukhârî 3042 le montre tenant les rênes de la mule du Prophète à Hounayn."
                  },
                  {
                    "year": "20 H selon une tradition",
                    "desc": "Adh-Dhahabî mentionne un décès à Médine vers 20 H après une blessure survenue lors d'un rasage."
                  }
                ],
                narratives: [
                  {
                    "id": 321,
                    "title": "De l'hostilité à la réconciliation",
                    "content": "Les ouvrages de sîra relatent qu'après des années d'opposition et de poésie hostile, Abou Soufyân chercha à rencontrer le Prophète et fut finalement accueilli. Les dialogues précis de cette scène ne figurent pas dans Al-Bukhârî 3042."
                  },
                  {
                    "id": 322,
                    "title": "La bride de la mule à Hounayn",
                    "content": "Al-Barâ’ ibn ‘Âzib rapporte dans Al-Bukhârî 3042 et 4315 qu'Abou Soufyân ibn al-Hârith tenait la mule lorsque les combattants affrontèrent les flèches adverses. Le Prophète resta sur place."
                  },
                  {
                    "id": 323,
                    "title": "Une mort rapportée après une blessure",
                    "content": "Adh-Dhahabî cite une tradition selon laquelle un barbier coupa une verrue sur son crâne lors d'un pèlerinage ; il mourut ensuite. Ce détail est biographique et ne constitue pas une conclusion médicale indépendante."
                  },
                  {
                    "id": 324,
                    "title": "Un titre honorifique dans une voie interrompue",
                    "content": "Une parole lui attribue le titre de chef des jeunes du Paradis. La note d'Ibn Hajar sur cette voie la décrit comme moursal. Elle reste visible avec ce jugement, et n'est pas présentée comme unanimement authentifiée."
                  }
                ],
                hadiths: [
                  {
                    "text": "À Hounayn, Abou Soufyân tenait la bride de la mule du Prophète ﷺ.",
                    "narrator": "Al-Barâ’ ibn ‘Âzib",
                    "source": "Al-Bukhârî 3042 et 4315 — témoignage historique",
                    "type": "historical"
                  },
                  {
                    "text": "Une tradition attribue à Abou Soufyân le titre de chef des jeunes du Paradis.",
                    "narrator": "‘Urwa ibn az-Zoubayr, récit reproduit dans Siyar",
                    "source": "Siyar 1/206 ; voie moursal selon Ibn Hajar, non présentée comme unanimement sahîh",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel geste d'Abou Soufyân est rapporté chez Al-Bukhârî ?",
                    "opts": [
                      "Tenir la mule du Prophète à Hounayn",
                      "Commander une flotte",
                      "Prêcher en Égypte"
                    ],
                    "c": 0,
                    "exp": "Al-Barâ’ décrit Abou Soufyân à Hounayn auprès de la mule du Prophète ﷺ.",
                    "ref": "https://sunnah.com/bukhari:3042"
                  },
                  {
                    "q": "Quel autre numéro d'Al-Bukhârî relate cet épisode ?",
                    "opts": [
                      "4315",
                      "3045",
                      "4782"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 4315 mentionne également son rôle auprès de la mule.",
                    "ref": "https://sunnah.com/bukhari:4315"
                  },
                  {
                    "q": "Quel jugement est rapporté sur la voie du titre honorifique ?",
                    "opts": [
                      "Moursal selon Ibn Hajar",
                      "Moutawâtir selon tous",
                      "Un verset coranique"
                    ],
                    "c": 0,
                    "exp": "La note d'Ibn Hajar qualifie la voie d'interrompue.",
                    "ref": "https://ketabonline.com/ar/books/598/read?page=1812&part=1"
                  },
                  {
                    "q": "À quelle source appartient le récit du barbier ?",
                    "opts": [
                      "La notice biographique de Siyar",
                      "Al-Bukhârî 3042",
                      "Le Coran"
                    ],
                    "c": 0,
                    "exp": "Les circonstances du décès proviennent de la chronique, pas du hadith de Hounayn.",
                    "ref": "https://siyar.fr/livre/1/206"
                  },
                  {
                    "q": "Que précéda sa conversion ?",
                    "opts": [
                      "Une période d'opposition au Prophète",
                      "Un califat personnel",
                      "Un exil à Al-Abwâ"
                    ],
                    "c": 0,
                    "exp": "La sîra raconte son opposition, puis une réconciliation après sa conversion.",
                    "ref": "https://siyar.fr/livre/1/203"
                  }
                ]
            },
            {
                id: 33,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Jafar ibn Abou Soufiane",
                arabicName: "جَعْفَر بن أبي سُفْيَان",
                subtitle: "Le Compagnon Fidèle",
                intro: "Ja‘far ibn Abou Soufyân ibn al-Hârith est peu documenté. Ibn Sa‘d le mentionne aux côtés de son père à Hounayn et situe sa mort vers le milieu du califat de Mou‘âwiya. Aucun hadith personnel distinct n'a été identifié pour lui dans les références consultées.",
                heroQuote: "Selon Ibn Sa‘d, Ja‘far resta ferme auprès de son père à Hounayn (Siyar, notice 33).",
                tags: ["Ahl al-Bayt", "Hunayn"],
                genealogy: "Jafar ibn Abou Soufiane.",
                timeline: [
                  {
                    "year": "8 H",
                    "desc": "D'après Ibn Sa‘d, Ja‘far demeura auprès de son père pendant la bataille de Hounayn."
                  },
                  {
                    "year": "Milieu du califat de Mou‘âwiya",
                    "desc": "La notice situe le décès au milieu de ce califat, sans année précise."
                  }
                ],
                narratives: [
                  {
                    "id": 331,
                    "title": "Ja‘far et son père à Hounayn",
                    "content": "Adh-Dhahabî reprend Ibn Sa‘d : Ja‘far et son père Abou Soufyân tinrent bon au combat de Hounayn. Aucune action militaire personnelle supplémentaire n'est décrite dans cette courte notice."
                  },
                  {
                    "id": 332,
                    "title": "Une dernière mention sous Mou‘âwiya",
                    "content": "Ibn Sa‘d rapporte que Ja‘far vécut jusqu'au milieu du califat de Mou‘âwiya. La notice ne donne ni année précise ni autres événements qu'il serait rigoureux d'ajouter."
                  }
                ],
                hadiths: [
                  {
                    "text": "Ja‘far et son père restèrent fermes le jour de Hounayn, selon la notice d'Ibn Sa‘d.",
                    "narrator": "Ibn Sa‘d, cité par adh-Dhahabî",
                    "source": "Siyar, notice 33 ; attribution historique, sans jugement d'isnâd identifié",
                    "type": "historical"
                  }
                ],
                quizData: [
                  {
                    "q": "De qui Ja‘far était-il le fils ?",
                    "opts": [
                      "Abou Soufyân ibn al-Hârith",
                      "Abou Tâlib",
                      "Anas"
                    ],
                    "c": 0,
                    "exp": "Le personnage est distinct de Ja‘far ibn Abou Tâlib, traité dans la notice suivante.",
                    "ref": "https://siyar.fr/livre/1/207"
                  },
                  {
                    "q": "Dans quelle bataille est-il cité avec son père ?",
                    "opts": [
                      "Hounayn",
                      "Mou’ta",
                      "Badr"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî cite Ibn Sa‘d pour leur présence à Hounayn.",
                    "ref": "https://siyar.fr/livre/1/207"
                  },
                  {
                    "q": "À quelle période son décès est-il situé ?",
                    "opts": [
                      "Au milieu du califat de Mou‘âwiya",
                      "En 8 H avec certitude",
                      "À Badr"
                    ],
                    "c": 0,
                    "exp": "La notice donne le milieu d'un règne mais aucune année précise.",
                    "ref": "https://siyar.fr/livre/1/207"
                  },
                  {
                    "q": "Qui est l'auteur biographique cité par adh-Dhahabî ?",
                    "opts": [
                      "Ibn Sa‘d",
                      "Al-Bukhârî",
                      "At-Tirmidhî"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî attribue les deux informations principales de sa notice à Ibn Sa‘d.",
                    "ref": "https://ketabonline.com/ar/books/598/read?page=1812&part=1"
                  },
                  {
                    "q": "Quel traitement adopter faute d'autres récits indépendants ?",
                    "opts": [
                      "Laisser la biographie brève et référencée",
                      "Inventer des scènes",
                      "L'appeler hadith sahîh"
                    ],
                    "c": 0,
                    "exp": "Le peu d'informations ne justifie pas l'ajout de détails non attestés.",
                    "ref": "https://siyar.fr/livre/1/207"
                  }
                ]
            },
  {
                id: 34,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Jafar ibn Abou Talib",
                arabicName: "جَعْفَر بن أبي طالب",
                subtitle: "Le Martyr aux Deux Ailes",
                intro: "Ja‘far ibn Abou Tâlib, frère de ‘Alî, émigra en Abyssinie avant l'Hégire et revint à l'époque de Khaybar. Al-Bukhârî rapporte sa générosité envers les pauvres, sa ressemblance avec le Prophète et son martyre à Mou’ta. D'autres récits sur ses ailes possèdent des évaluations distinctes.",
                heroQuote: "Le Prophète ﷺ dit à Ja‘far : « Tu me ressembles en apparence et en caractère » (Al-Bukhârî 4251).",
                tags: ["Martyrs", "Ahl al-Bayt", "Abyssinie", "Mouta"],
                genealogy: "Jafar ibn Abou Talib ibn Abd-Manaf. Hachimite. Fils de Fatima bint Assad. Il est plus âgé qu'Ali de dix ans.",
                physicalDesc: "Il était l'homme qui ressemblait le plus au Prophète (ﷺ) tant dans son physique que dans son comportement (Khulq et Khalq).",
                timeline: [
                  {
                    "year": "Avant l'Hégire",
                    "desc": "Ja‘far émigre en Abyssinie avec Asmâ’ bint ‘Oumays. L'ancien repère « 5 H » était chronologiquement erroné."
                  },
                  {
                    "year": "7 H",
                    "desc": "Ja‘far et les émigrés d'Abyssinie retrouvent le Prophète à l'époque de Khaybar, selon Al-Bukhârî 4230."
                  },
                  {
                    "year": "7 H",
                    "desc": "Al-Bukhârî 4251 rapporte le litige concernant la fille de Hamza et le compliment adressé à Ja‘far."
                  },
                  {
                    "year": "8 H",
                    "desc": "Meurt à Mou’ta après Zayd ibn Hâritha selon Al-Bukhârî 4261–4262."
                  }
                ],
                narratives: [
                  {
                    "id": 341,
                    "title": "La défense des émigrés devant le Négus",
                    "content": "Les ouvrages de sîra racontent que Ja‘far prit la parole devant le souverain d'Abyssinie et récita des versets de la sourate Maryam. Les détails des dialogues et l'émotion du roi relèvent de transmissions historiques distinctes, pas du hadith de Mou’ta dans Al-Bukhârî."
                  },
                  {
                    "id": 342,
                    "title": "L'hospitalité de Ja‘far envers les pauvres",
                    "content": "Abou Hourayra témoigne dans Al-Bukhârî 3708 que Ja‘far accueillait les pauvres et partageait avec eux même les derniers restes de nourriture contenus dans un récipient."
                  },
                  {
                    "id": 343,
                    "title": "La fille de Hamza et la ressemblance avec le Prophète",
                    "content": "Al-Barâ’ rapporte dans Al-Bukhârî 4251 que ‘Alî, Ja‘far et Zayd discutèrent de la garde de la fille de Hamza. Le Prophète la confia à sa tante, épouse de Ja‘far, puis lui dit qu'il lui ressemblait en apparence et en caractère. Le récit du saut de joie provient d'autres versions."
                  },
                  {
                    "id": 344,
                    "title": "Les commandants et les blessures à Mou’ta",
                    "content": "Ibn ‘Oumar rapporte dans Al-Bukhârî 4261 la succession prévue entre Zayd, Ja‘far et Ibn Rawâha. Il dit avoir retrouvé sur le corps de Ja‘far plus de quatre-vingt-dix blessures. Le détail des deux mains coupées est mentionné dans d'autres voies."
                  },
                  {
                    "id": 345,
                    "title": "Le mérite accordé aux gens du bateau",
                    "content": "Abou Moussa raconte dans Al-Bukhârî 3876 que les migrants arrivés en Abyssinie rencontrèrent Ja‘far, puis rejoignirent tous le Prophète lors de Khaybar. Le Prophète leur parla de leur double émigration."
                  },
                  {
                    "id": 346,
                    "title": "Préparer le repas de la famille endeuillée",
                    "content": "‘Abd-Allah ibn Ja‘far transmet dans At-Tirmidhî 998 que le Prophète demanda que l'on apporte un repas à la famille de Ja‘far, occupée par son deuil. At-Tirmidhî et Darussalam le qualifient de hasan."
                  }
                ],
                hadiths: [
                  {
                    "text": "« Tu me ressembles en apparence et en caractère. »",
                    "narrator": "Le Prophète ﷺ, d'après al-Barâ’",
                    "source": "Al-Bukhârî 4251",
                    "type": "prophetic"
                  },
                  {
                    "text": "Une tradition rapporte que Ja‘far possédait deux ailes au Paradis.",
                    "narrator": "Ibn ‘Abbâs",
                    "source": "At-Tabarânî ; Al-Haythamî : une voie hasan ; Al-Albânî : sahîh li-ghayrihi",
                    "type": "prophetic"
                  },
                  {
                    "text": "Ja‘far fut retrouvé à Mou’ta avec plus de quatre-vingt-dix blessures.",
                    "narrator": "‘Abd-Allah ibn ‘Oumar",
                    "source": "Al-Bukhârî 4261 — témoignage de compagnon",
                    "type": "historical"
                  },
                  {
                    "text": "Le Prophète demanda qu'on prépare de la nourriture à la famille de Ja‘far.",
                    "narrator": "‘Abd-Allah ibn Ja‘far",
                    "source": "At-Tirmidhî 998 — hasan selon At-Tirmidhî et Darussalam",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel recueil donne la ressemblance de Ja‘far avec le Prophète ?",
                    "opts": [
                      "Al-Bukhârî 4251",
                      "Mouslim 2470",
                      "Al-Bukhârî 3045"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 4251 contient les paroles sur l'apparence et le caractère de Ja‘far.",
                    "ref": "https://sunnah.com/bukhari:4251"
                  },
                  {
                    "q": "Quel compagnon décrit la générosité de Ja‘far ?",
                    "opts": [
                      "Abou Hourayra",
                      "Sa‘îd ibn al-Hârith",
                      "Abou Doujâna"
                    ],
                    "c": 0,
                    "exp": "Dans Al-Bukhârî 3708, Abou Hourayra raconte comment Ja‘far nourrissait les pauvres.",
                    "ref": "https://sunnah.com/bukhari:3708"
                  },
                  {
                    "q": "À quelle époque Ja‘far revint-il d'Abyssinie ?",
                    "opts": [
                      "Lors de Khaybar, en 7 H",
                      "En 5 H après l'Hégire",
                      "Sous Mou‘âwiya"
                    ],
                    "c": 0,
                    "exp": "Le récit d'Abou Moussa dans Al-Bukhârî 4230 situe son retour lors de Khaybar.",
                    "ref": "https://sunnah.com/bukhari:4230"
                  },
                  {
                    "q": "Quel témoignage est donné sur son corps après Mou’ta ?",
                    "opts": [
                      "Plus de quatre-vingt-dix blessures",
                      "Une mort à Al-Abwâ",
                      "Une blessure à Hounayn"
                    ],
                    "c": 0,
                    "exp": "Ibn ‘Oumar donne ce chiffre de blessures dans Al-Bukhârî 4261.",
                    "ref": "https://sunnah.com/bukhari:4261"
                  },
                  {
                    "q": "Que dit Al-Haythamî sur la tradition des deux ailes ?",
                    "opts": [
                      "Une des deux voies est hasan",
                      "C'est un verset",
                      "Toutes les voies sont unanimement rejetées"
                    ],
                    "c": 0,
                    "exp": "Al-Haythamî signale deux voies et indique que l'une est hasan.",
                    "ref": "https://dorar.net/h/QSZNI0Nn"
                  },
                  {
                    "q": "Quel acte de solidarité suit son décès dans At-Tirmidhî 998 ?",
                    "opts": [
                      "Préparer à manger à sa famille",
                      "Éviter sa famille",
                      "Annuler les visites"
                    ],
                    "c": 0,
                    "exp": "La recommandation de préparer un repas est transmise par son fils ‘Abd-Allah.",
                    "ref": "https://sunnah.com/tirmidhi:998"
                  },
                  {
                    "q": "Qui succédait à Zayd dans l'ordre prévu à Mou’ta ?",
                    "opts": [
                      "Ja‘far",
                      "Abou Doujâna",
                      "Abou Soufyân"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 4261 prévoit Ja‘far après Zayd, puis Ibn Rawâha.",
                    "ref": "https://sunnah.com/bukhari:4261"
                  }
                ]
            },
            {
                id: 35,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Aqil ibn Abou Talib",
                arabicName: "عقيل بن أبي طالب",
                subtitle: "L'Aîné des Hachimites",
                intro: "‘Aqîl ibn Abou Tâlib, frère de ‘Alî et Ja‘far, fut capturé à Badr puis se rapprocha du Prophète ﷺ. Le propos sur deux formes d'affection est transmis par Al-Hâkim ; ach-Chawkânî qualifie la voie de moursal, malgré des rapporteurs fiables. Les détails de sa généalogie et de ses scrupules proviennent de chroniques.",
                heroQuote: "« Je t'aime de deux amours... » : récit que ach-Chawkânî qualifie de moursal pour la voie considérée.",
                tags: ["Ahl al-Bayt", "Savant", "Badr"],
                genealogy: "'Aqil ibn Abou Talib. Surnommé Abou Yazid. Il est l'ancêtre d'une grande lignée de savants (dont le mouhadith Abd-Allah ibn Mouhammad ibn 'Aqil).",
                physicalDesc: "Il vécut très vieux et devint aveugle à la fin de sa vie.",
                timeline: [
                  {
                    "year": "2 H",
                    "desc": "Les biographies placent ‘Aqîl parmi les captifs de Badr, dans le camp qurayshite."
                  },
                  {
                    "year": "8 H selon les chroniques",
                    "desc": "Son ralliement à l'islam est situé vers la conquête de La Mecque, selon les chroniques."
                  },
                  {
                    "year": "Après 8 H, sans date précise",
                    "desc": "Siyar rapporte des revenus en dattes liés à Khaybar, sans année individuelle établie."
                  },
                  {
                    "year": "Sous Mou‘âwiya",
                    "desc": "La notice situe son décès durant le califat de Mou‘âwiya, sans année unique."
                  }
                ],
                narratives: [
                  {
                    "id": 351,
                    "title": "Les deux motifs d'affection : une voie moursal",
                    "content": "Une parole attribuée au Prophète exprime son affection pour ‘Aqîl en raison de leur parenté et de l'amour qu'Abou Tâlib lui portait. Ach-Chawkânî indique que la chaîne est moursal et que ses rapporteurs mentionnés sont fiables. Al-Hâkim et At-Tabarânî transmettent aussi le récit."
                  },
                  {
                    "id": 352,
                    "title": "Une aiguille rendue par scrupule",
                    "content": "Selon Zayd ibn Aslam, ‘Aqîl ramena une aiguille à son épouse, puis demanda qu'on la rende lorsqu'il apprit qu'il n'était pas permis de prélever un bien du butin. La source ne précise pas nécessairement le lieu de cette scène."
                  },
                  {
                    "id": 353,
                    "title": "La réponse d'‘Aqîl après Badr",
                    "content": "Les chroniques rapportent qu'‘Aqîl s'enquit auprès du Prophète des chefs mecquois tombés à Badr. La formule sur la voie désormais ouverte est attribuée à ‘Aqîl lui-même, et non au Prophète."
                  },
                  {
                    "id": 354,
                    "title": "Un connaisseur des filiations tribales",
                    "content": "Adh-Dhahabî rapporte qu'‘Aqîl connaissait les généalogies arabes et les lignages des tribus. Ce témoignage éclaire sa place parmi les transmetteurs de mémoire familiale."
                  }
                ],
                hadiths: [
                  {
                    "text": "« Je t'aime de deux amours : pour ta parenté et parce qu'Abou Tâlib t'aimait. »",
                    "narrator": "Attribué au Prophète ﷺ, d'après une voie d'Abou Ishâq",
                    "source": "Al-Hâkim, Al-Moustadrak 6625 ; ach-Chawkânî : moursal, rapporteurs fiables",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel savant signale que la voie des deux amours est moursal ?",
                    "opts": [
                      "Ach-Chawkânî",
                      "Al-Bukhârî",
                      "Mouslim"
                    ],
                    "c": 0,
                    "exp": "Ach-Chawkânî signale le caractère interrompu de cette voie.",
                    "ref": "https://dorar.net/h/ARqrTG9R"
                  },
                  {
                    "q": "À quelle bataille ‘Aqîl fut-il capturé selon Siyar ?",
                    "opts": [
                      "Badr",
                      "Mou’ta",
                      "Hounayn"
                    ],
                    "c": 0,
                    "exp": "Il est cité parmi les captifs qurayshites de Badr.",
                    "ref": "https://siyar.fr/livre/1/218"
                  },
                  {
                    "q": "Qui prononce la formule sur la voie ouverte après la mort d'Abou Jahl ?",
                    "opts": [
                      "‘Aqîl",
                      "Le Prophète ﷺ",
                      "Le Négus"
                    ],
                    "c": 0,
                    "exp": "Ce propos est attribué à ‘Aqîl dans le récit historique.",
                    "ref": "https://siyar.fr/livre/1/220"
                  },
                  {
                    "q": "Quel savoir est associé à ‘Aqîl ?",
                    "opts": [
                      "La généalogie des Arabes",
                      "La médecine grecque",
                      "L'astronomie moderne"
                    ],
                    "c": 0,
                    "exp": "Les biographes décrivent sa connaissance des tribus et des filiations.",
                    "ref": "https://siyar.fr/livre/1/219"
                  },
                  {
                    "q": "Quel objet apparaît dans le récit du scrupule d'‘Aqîl ?",
                    "opts": [
                      "Une aiguille",
                      "Une bride de mule",
                      "Un rouleau de papyrus"
                    ],
                    "c": 0,
                    "exp": "Le témoignage attribué à Zayd ibn Aslam évoque une aiguille rendue.",
                    "ref": "https://siyar.fr/livre/1/219"
                  },
                  {
                    "q": "Quelle période est donnée pour son décès ?",
                    "opts": [
                      "Sous Mou‘âwiya",
                      "À Badr",
                      "En 2 H"
                    ],
                    "c": 0,
                    "exp": "La notice cite une période califale sans fixer d'année unique.",
                    "ref": "https://siyar.fr/livre/1/220"
                  }
                ]
            },
            {
                id: 36,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Zayd ibn Haritha",
                arabicName: "زيد بن حارثة",
                subtitle: "Le Bien-Aimé (Al-Hibb)",
                intro: "Zayd ibn Hâritha, affranchi et proche du Prophète ﷺ, fut appelé Zayd ibn Mouhammad avant la révélation de 33:5, comme le rapporte Ibn ‘Oumar. Il est nommé dans le Coran (33:37), fut reconnu pour ses qualités de commandement et mourut à Mou’ta en 8 H.",
                heroQuote: "Le Prophète ﷺ dit de Zayd qu'il était digne du commandement et parmi ceux qu'il aimait le plus (Al-Bukhârî 4250).",
                tags: ["Commandants", "Martyrs", "Coran", "Affranchi"],
                genealogy: "Zayd ibn Haritha des Banou Kalb. Surnommé « Le Bien-Aimé » (Al-Hibb).",
                physicalDesc: "Il était petit de taille, la peau très noire (châtain très foncé) et avait le nez épaté (camus).",
                timeline: [
                  {
                    "year": "Enfance, sans année précise",
                    "desc": "Les récits biographiques racontent l'enlèvement, la vente et l'affranchissement de Zayd ; les montants varient selon les chroniques."
                  },
                  {
                    "year": "Avant la révélation de 33:5",
                    "desc": "Ibn ‘Oumar raconte que Zayd était appelé « ibn Mouhammad » jusqu'à la révélation prescrivant de nommer les enfants par leurs pères (Al-Bukhârî 4782)."
                  },
                  {
                    "year": "Avant 8 H",
                    "desc": "Zayd dirige plusieurs expéditions selon les biographies ; Al-Bukhârî 4250 témoigne de la défense prophétique de son aptitude à commander."
                  },
                  {
                    "year": "8 H",
                    "desc": "Premier commandant désigné à Mou’ta, où il meurt, selon Al-Bukhârî 4261–4262."
                  }
                ],
                narratives: [
                  {
                    "id": 361,
                    "title": "Le choix de Zayd",
                    "content": "Les ouvrages de sîra racontent que le père et l'oncle de Zayd vinrent le rechercher. Zayd choisit de rester auprès du Prophète, qui l'affranchit. Les dialogues détaillés sont rapportés historiquement, pas dans le hadith d'Al-Bukhârî 4782."
                  },
                  {
                    "id": 362,
                    "title": "L'ancien nom et les versets de la sourate al-Ahzâb",
                    "content": "Ibn ‘Oumar rapporte dans Al-Bukhârî 4782 que Zayd était appelé « fils de Mouhammad » jusqu'à la révélation de 33:5. Le Coran nomme explicitement Zayd dans le verset 33:37."
                  },
                  {
                    "id": 363,
                    "title": "L'accueil de Zayd à Médine et les divergences de classement",
                    "content": "‘Â’isha rapporte dans At-Tirmidhî 2732 que le Prophète embrassa Zayd lors de son arrivée. At-Tirmidhî juge cette voie hasan gharîb ; l'édition Darussalam la classe da‘îf. Les deux jugements sont affichés."
                  },
                  {
                    "id": 364,
                    "title": "Une défense explicite de ses qualités de commandement",
                    "content": "Dans Al-Bukhârî 4250, Ibn ‘Oumar rapporte que des personnes critiquèrent la nomination d'Ousâma. Le Prophète répondit que son père Zayd avait déjà subi de telles critiques mais était digne de commander."
                  },
                  {
                    "id": 365,
                    "title": "La succession prévue à Mou’ta",
                    "content": "Al-Bukhârî 4261–4262 transmet la succession entre Zayd, Ja‘far et Ibn Rawâha. Selon Anas, le Prophète annonça leur mort avant l'arrivée de la nouvelle et ses yeux étaient remplis de larmes."
                  }
                ],
                hadiths: [
                  {
                    "text": "« Puis, quand Zayd eut cessé toute relation avec elle... » (33:37).",
                    "narrator": "Coran, verset 33:37",
                    "source": "Sourate al-Ahzâb — texte coranique, non hadith",
                    "type": "verse"
                  },
                  {
                    "text": "« Tu es notre frère et notre affranchi. »",
                    "narrator": "Le Prophète ﷺ, d'après al-Barâ’",
                    "source": "Al-Bukhârî 4251",
                    "type": "prophetic"
                  },
                  {
                    "text": "Zayd était digne du commandement et comptait parmi ceux que le Prophète aimait le plus.",
                    "narrator": "Ibn ‘Oumar",
                    "source": "Al-Bukhârî 4250",
                    "type": "prophetic"
                  },
                  {
                    "text": "Le Prophète embrassa Zayd à son arrivée, d'après une tradition d'‘Â’isha.",
                    "narrator": "‘Â’isha",
                    "source": "At-Tirmidhî 2732 : hasan gharîb selon At-Tirmidhî ; da‘îf selon Darussalam",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel verset du Coran cite Zayd nommément ?",
                    "opts": [
                      "33:37",
                      "24:22",
                      "2:217"
                    ],
                    "c": 0,
                    "exp": "La sourate al-Ahzâb nomme explicitement Zayd au verset 37.",
                    "ref": "https://quran.com/33/37"
                  },
                  {
                    "q": "Quel hadith rapporte l'ancien nom Zayd ibn Mouhammad ?",
                    "opts": [
                      "Al-Bukhârî 4782",
                      "Al-Bukhârî 3045",
                      "Mouslim 2470"
                    ],
                    "c": 0,
                    "exp": "Ibn ‘Oumar rapporte cet ancien usage du nom jusqu'à la révélation de 33:5.",
                    "ref": "https://sunnah.com/bukhari:4782"
                  },
                  {
                    "q": "Qui commande en premier à Mou’ta ?",
                    "opts": [
                      "Zayd ibn Hâritha",
                      "Ja‘far",
                      "Khoubayb"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 4261 cite Zayd avant Ja‘far et Ibn Rawâha.",
                    "ref": "https://sunnah.com/bukhari:4261"
                  },
                  {
                    "q": "Quel avis At-Tirmidhî donne-t-il sur l'accueil de Zayd ?",
                    "opts": [
                      "Hasan gharîb",
                      "Moutawâtir",
                      "Mawdou‘"
                    ],
                    "c": 0,
                    "exp": "At-Tirmidhî le dit hasan gharîb, tandis que Darussalam le juge faible.",
                    "ref": "https://sunnah.com/tirmidhi:2732"
                  },
                  {
                    "q": "Que défend le Prophète dans Al-Bukhârî 4250 ?",
                    "opts": [
                      "L'aptitude de Zayd et de son fils Ousâma à commander",
                      "Leur droit au trône",
                      "Leurs affaires commerciales"
                    ],
                    "c": 0,
                    "exp": "Le Prophète répond aux critiques des commandements du père et du fils.",
                    "ref": "https://sunnah.com/bukhari:4250"
                  },
                  {
                    "q": "Quelle catégorie documentaire faut-il donner à 33:37 ?",
                    "opts": [
                      "Verset coranique",
                      "Hadith qudsî",
                      "Poésie de Ja‘far"
                    ],
                    "c": 0,
                    "exp": "Le verset de la sourate al-Ahzâb est du Coran et non un hadith prophétique.",
                    "ref": "https://quran.com/33/37"
                  }
                ]
            },
            {
                id: 37,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Rawaha",
                arabicName: "عبد الله بن رواحة",
                subtitle: "Le Poète Martyr",
                intro: "‘Abd-Allah ibn Rawâha, poète des Ansâr, participa à Badr et fut chargé d'estimer les récoltes de Khaybar. Le Mouwatta’ conserve un récit discuté de son refus d'une tentative de corruption. Al-Bukhârî le cite comme troisième commandant à Mou’ta ; le récit de ses assises de foi reçoit des évaluations divergentes.",
                heroQuote: "Selon Al-Bukhârî 4261, le Prophète ﷺ désigna Ibn Rawâha troisième commandant à Mou’ta.",
                tags: ["Poète", "Ansar", "Scribe", "Mouta"],
                genealogy: "Abd-Allah ibn Rawaha des Banou Al-Harith (Khazraj). Oncle maternel de Nou'man ibn Bachir.",
                physicalDesc: "Il était scribe à une époque où l'écriture était rare.",
                timeline: [
                  {
                    "year": "Avant l'Hégire",
                    "desc": "Les traditions de sîra le comptent parmi les Ansâr engagés lors du pacte d'al-‘Aqaba."
                  },
                  {
                    "year": "2–3 H",
                    "desc": "Les chroniques le mentionnent à Badr et Ouhoud, sans déduction d'autres événements."
                  },
                  {
                    "year": "7 H",
                    "desc": "Le Mouwatta’ relate l'estimation des récoltes à Khaybar : Ibn ‘Abd al-Barr dit moursal et mentionne des voies complémentaires."
                  },
                  {
                    "year": "8 H",
                    "desc": "Meurt à Mou’ta après Zayd et Ja‘far selon Al-Bukhârî 4261–4262."
                  }
                ],
                narratives: [
                  {
                    "id": 371,
                    "title": "« Venez, croyons un instant » : jugements distincts",
                    "content": "Une tradition d'Anas raconte qu'Ibn Rawâha invitait ses compagnons à renforcer leur foi et que le Prophète invoqua pour lui. Al-Haythamî juge une chaîne hasan (Majma‘ az-Zawâ’id 10/79), mais Shu‘ayb al-Arna’ût juge faible la voie étudiée dans Siyar 1/231. Les évaluations sont attribuées séparément."
                  },
                  {
                    "id": 372,
                    "title": "Le discours de Ma‘ân dans les chroniques",
                    "content": "Les ouvrages de sîra racontent qu'avant Mou’ta Ibn Rawâha encouragea les musulmans à ne pas renoncer face à l'adversaire. Les chiffres précis de soldats évoqués dans certaines versions ne sont pas fournis par Al-Bukhârî 4261."
                  },
                  {
                    "id": 373,
                    "title": "L'estimation équitable des dattes",
                    "content": "Selon une transmission du Mouwatta’ par Soulaymân ibn Yasâr, Ibn Rawâha refusa des bijoux proposés pour modifier la répartition à Khaybar, disant que son aversion pour ses interlocuteurs ne l'autoriserait pas à être injuste. Ibn ‘Abd al-Barr considère cette version moursal avec une corroboration et une voie reliée."
                  },
                  {
                    "id": 374,
                    "title": "La nouvelle des trois commandants",
                    "content": "Al-Bukhârî 4262 rapporte qu'avant l'arrivée de la nouvelle, le Prophète annonça la mort de Zayd, de Ja‘far et d'Ibn Rawâha et pleura. Khâlid prit ensuite l'étendard."
                  }
                ],
                hadiths: [
                  {
                    "text": "Le Prophète annonça la mort de Zayd, Ja‘far et Ibn Rawâha après leur commandement à Mou’ta.",
                    "narrator": "Anas ibn Mâlik",
                    "source": "Al-Bukhârî 4262",
                    "type": "prophetic"
                  },
                  {
                    "text": "Le Prophète aurait loué les assises de foi aimées d'Ibn Rawâha.",
                    "narrator": "Anas ibn Mâlik",
                    "source": "Ahmad 13796 ; Al-Haythamî : isnâd hasan ; Al-Arna’ût : faible pour la version étudiée",
                    "type": "prophetic"
                  },
                  {
                    "text": "Ibn Rawâha aurait refusé une tentative de corruption à Khaybar.",
                    "narrator": "Soulaymân ibn Yasâr",
                    "source": "Mouwatta’ ; Ibn ‘Abd al-Barr : moursal avec corroboration et voie reliée",
                    "type": "historical"
                  }
                ],
                quizData: [
                  {
                    "q": "Quelle fonction Ibn Rawâha exerçait-il à Khaybar ?",
                    "opts": [
                      "Estimation des récoltes",
                      "Commandement de navires",
                      "Gouvernement d'Alexandrie"
                    ],
                    "c": 0,
                    "exp": "Le Mouwatta’ le présente comme chargé de l'estimation des dattes.",
                    "ref": "https://dorar.net/h/HPSMvins"
                  },
                  {
                    "q": "Quel est l'avis d'Ibn ‘Abd al-Barr sur la version de Khaybar ?",
                    "opts": [
                      "Moursal avec corroboration",
                      "Moutawâtir",
                      "Sans auteur"
                    ],
                    "c": 0,
                    "exp": "Ibn ‘Abd al-Barr note le caractère moursal et d'autres voies.",
                    "ref": "https://dorar.net/h/HPSMvins"
                  },
                  {
                    "q": "Comment les avis sur les assises de foi diffèrent-ils ?",
                    "opts": [
                      "Al-Haythamî : hasan ; Al-Arna’ût : faible sur la voie étudiée",
                      "Unanimement rejetées",
                      "Coran"
                    ],
                    "c": 0,
                    "exp": "Les deux savants ont publié des appréciations distinctes selon les voies étudiées.",
                    "ref": "https://dorar.net/h/pCGzjR2I"
                  },
                  {
                    "q": "Quel rang occupait-il parmi les commandants de Mou’ta ?",
                    "opts": [
                      "Troisième",
                      "Premier",
                      "Aucun"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 4261 cite Zayd, Ja‘far puis Ibn Rawâha.",
                    "ref": "https://sunnah.com/bukhari:4261"
                  },
                  {
                    "q": "Quel élément ne figure pas dans le hadith d'Al-Bukhârî 4261 ?",
                    "opts": [
                      "Le chiffre de 200 000 adversaires",
                      "L'ordre de commandement",
                      "La présence d'Ibn Rawâha"
                    ],
                    "c": 0,
                    "exp": "Le hadith documente les commandants, pas ce chiffre précis d'effectifs.",
                    "ref": "https://sunnah.com/bukhari:4261"
                  },
                  {
                    "q": "Quel principe ressort de l'estimation de Khaybar ?",
                    "opts": [
                      "Éviter la corruption et l'injustice",
                      "Accepter un pot-de-vin",
                      "Supprimer toute estimation"
                    ],
                    "c": 0,
                    "exp": "Le récit insiste sur le refus des bijoux et sur la nécessité d'être équitable.",
                    "ref": "https://dorar.net/h/HPSMvins"
                  }
                ]
            },
			{
                id: 38,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Koulthoum ibn Al-Hidm",
                arabicName: "كُلْثُوم بن الهِدْم",
                subtitle: "L'Hôte de Qouba",
                intro: "Koulthoum ibn al-Hidm, un notable âgé des Ansâr, est mentionné par Ibn Ishâq comme hôte du Prophète ﷺ à Qoubâ au début de l'Hégire. Une autre tradition cite Sa‘d ibn Khaythama, dont la maison servait aux réunions. Koulthoum mourut avant Badr selon les biographies.",
                heroQuote: "Ibn Ishâq cite Koulthoum comme hôte du Prophète à Qoubâ, en mentionnant aussi une autre version chez Sa‘d ibn Khaythama.",
                tags: ["Ansar", "Hôte", "Qouba"],
                genealogy: "Koulthoum ibn Al-Hidm... Al-Aoussi. De la branche des Banou 'Amr ibn 'Aouf.",
                physicalDesc: "Un homme âgé et respecté, doyen de sa tribu.",
                timeline: [
                  {
                    "year": "1 H",
                    "desc": "À Qoubâ, hébergement chez Koulthoum selon Ibn Ishâq, ou chez Sa‘d ibn Khaythama selon une autre version."
                  },
                  {
                    "year": "Avant Badr (2 H)",
                    "desc": "Ibn Sa‘d situe le décès de Koulthoum peu après l'Hégire, avant Badr, sans date journalière démontrée."
                  }
                ],
                narratives: [
                  {
                    "id": 381,
                    "title": "Deux hôtes possibles à Qoubâ",
                    "content": "Ibn Ishâq rapporte le séjour du Prophète chez Koulthoum, tout en donnant la version alternative de Sa‘d ibn Khaythama. Al-Haythamî indique que les transmetteurs de la voie examinée sont fiables (Majma‘ az-Zawâ’id 6/65) ; le classement ne supprime pas l'existence de variantes."
                  },
                  {
                    "id": 382,
                    "title": "La maison des célibataires chez Sa‘d",
                    "content": "La sîra concilie parfois les récits en expliquant que le Prophète logeait chez Koulthoum mais recevait les visiteurs chez Sa‘d, dont la maison était appelée la maison des célibataires. Cette explication est attribuée aux chroniqueurs et n'est pas posée comme une preuve excluant les autres versions."
                  }
                ],
                hadiths: [
                  {
                    "text": "Selon Ibn Ishâq, le Prophète séjourna chez Koulthoum à Qoubâ ; une autre version cite Sa‘d ibn Khaythama.",
                    "narrator": "Ibn Ishâq, tradition de sîra",
                    "source": "At-Tabarânî 5414 ; Al-Haythamî (6/65) : rapporteurs fiables",
                    "type": "historical"
                  }
                ],
                quizData: [
                  {
                    "q": "Où le Prophète séjourna-t-il avant son entrée à Médine ?",
                    "opts": [
                      "Qoubâ",
                      "Badr",
                      "Al-Abwâ"
                    ],
                    "c": 0,
                    "exp": "Ibn Ishâq rapporte le séjour à Qoubâ dans la région de Médine.",
                    "ref": "https://dorar.net/h/sK6hUNNK"
                  },
                  {
                    "q": "Quels deux hôtes sont cités dans les variantes ?",
                    "opts": [
                      "Koulthoum et Sa‘d ibn Khaythama",
                      "Ja‘far et ‘Aqîl",
                      "Abou Doujâna et Ibn Rawâha"
                    ],
                    "c": 0,
                    "exp": "Le récit d'Ibn Ishâq conserve les deux attributions d'hébergement.",
                    "ref": "https://dorar.net/h/sK6hUNNK"
                  },
                  {
                    "q": "Que dit Al-Haythamî sur une chaîne de ce récit ?",
                    "opts": [
                      "Ses rapporteurs sont fiables",
                      "C'est un verset",
                      "Il est unanimement inventé"
                    ],
                    "c": 0,
                    "exp": "Majma‘ az-Zawâ’id 6/65 évalue les rapporteurs de la voie citée.",
                    "ref": "https://dorar.net/h/sK6hUNNK"
                  },
                  {
                    "q": "Comment était surnommée la maison de Sa‘d ?",
                    "opts": [
                      "La maison des célibataires",
                      "La maison des marins",
                      "La maison du conseil"
                    ],
                    "c": 0,
                    "exp": "La tradition précise que Sa‘d accueillait les visiteurs dans sa maison.",
                    "ref": "https://gcp.islamweb.net/ar/library/content/59/227/"
                  },
                  {
                    "q": "Quand les chroniques situent-elles la mort de Koulthoum ?",
                    "opts": [
                      "Avant Badr",
                      "En 97 H",
                      "À Mou’ta"
                    ],
                    "c": 0,
                    "exp": "Adh-Dhahabî cite la mort précoce de Koulthoum avant la bataille de Badr.",
                    "ref": "https://ar.wikisource.org/wiki/سير_أعلام_النبلاء/كلثوم_بن_الهدم"
                  }
                ]
            },
            {
                id: 39,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Doujana",
                arabicName: "أبو دُجَانَة",
                subtitle: "Le Bandeau de la Mort",
                intro: "Abou Doujâna, Simâk ibn Kharasha, est nommé dans Mouslim 2470 comme le compagnon qui prit l'épée du Prophète à Ouhoud en acceptant d'en respecter les droits. D'autres traditions rapportent un bandeau rouge, sa démarche, sa générosité morale et sa mort à Al-Yamâma, avec des réserves sur certaines voies.",
                heroQuote: "À Ouhoud, Abou Doujâna accepta l'épée du Prophète ﷺ en promettant d'en respecter les droits (Mouslim 2470).",
                tags: ["Ansar", "Guerrier", "Ouhoud", "Yamama"],
                genealogy: "Simak ibn Kharasha (Abou Doujana). Frère de foi de 'Outba ibn Ghazouane.",
                physicalDesc: "Il marchait avec fierté (se dandinant) entre les rangs ennemis avant le combat.",
                timeline: [
                  {
                    "year": "3 H",
                    "desc": "À Ouhoud, prend l'épée du Prophète en acceptant d'en respecter les droits (Mouslim 2470) ; le bandeau rouge est transmis par une autre voie."
                  },
                  {
                    "year": "11 ou 12 H",
                    "desc": "La notice d'adh-Dhahabî rapporte sa mort à Al-Yamâma après avoir franchi le mur du jardin et s'être blessé."
                  }
                ],
                narratives: [
                  {
                    "id": 391,
                    "title": "Prendre l'épée avec ses droits",
                    "content": "Anas rapporte dans Mouslim 2470 que le Prophète proposa son épée puis demanda qui accepterait toute la responsabilité qui s'y attachait. Abou Doujâna s'avança et la prit. Le texte ne contient pas nécessairement les paroles dramatisées des versions de sîra."
                  },
                  {
                    "id": 392,
                    "title": "La démarche et le bandeau rouge : réserve",
                    "content": "Une tradition mentionne un bandeau rouge et une démarche fière devant les lignes adverses. Al-Haythamî (Majma‘ az-Zawâ’id 6/112) signale que la chaîne comporte des personnes qu'il ne connaissait pas. Athar conserve la narration avec cette réserve explicite."
                  },
                  {
                    "id": 393,
                    "title": "Un cœur sans rancune selon Zayd ibn Aslam",
                    "content": "Adh-Dhahabî transmet d'après Zayd ibn Aslam qu'Abou Doujâna, malade, expliqua sa sérénité par son refus de parler inutilement et son cœur exempt de rancœur envers les musulmans. Aucun jugement de hadith n'est inventé."
                  },
                  {
                    "id": 394,
                    "title": "Al-Yamâma : un récit d'Anas",
                    "content": "Selon le récit transmis d'Anas dans Siyar, Abou Doujâna fut projeté au-delà du mur du jardin à Al-Yamâma ; il se cassa la jambe et continua le combat jusqu'à sa mort. Ce récit historique est distinct du hadith de l'épée."
                  }
                ],
                hadiths: [
                  {
                    "text": "À Ouhoud, Abou Doujâna accepta l'épée du Prophète ﷺ en prenant la responsabilité de ses droits.",
                    "narrator": "Anas ibn Mâlik",
                    "source": "Sahîh Mouslim 2470",
                    "type": "prophetic"
                  },
                  {
                    "text": "Une voie attribue au Prophète une exception concernant la démarche fière d'Abou Doujâna entre les rangs.",
                    "narrator": "‘Abd Allah ibn Khâlid ibn Simâk, selon At-Tabarânî",
                    "source": "At-Tabarânî 6508 ; Al-Haythamî : présence de transmetteurs inconnus de lui",
                    "type": "prophetic"
                  }
                ],
                quizData: [
                  {
                    "q": "Quel recueil contient le récit de l'épée à Ouhoud ?",
                    "opts": [
                      "Mouslim 2470",
                      "Al-Bukhârî 4250",
                      "At-Tirmidhî 2732"
                    ],
                    "c": 0,
                    "exp": "Anas transmet cet épisode dans Sahîh Mouslim 2470.",
                    "ref": "https://sunnah.com/muslim:2470"
                  },
                  {
                    "q": "Que promet Abou Doujâna en acceptant l'épée ?",
                    "opts": [
                      "D'en assumer les droits",
                      "De naviguer sur un bateau",
                      "De prêter de l'argent"
                    ],
                    "c": 0,
                    "exp": "Le Prophète insiste sur les responsabilités liées à l'épée.",
                    "ref": "https://sunnah.com/muslim:2470"
                  },
                  {
                    "q": "Quel avis Al-Haythamî donne-t-il sur la voie du bandeau rouge ?",
                    "opts": [
                      "Des transmetteurs lui sont inconnus",
                      "Elle est unanimement moutawâtir",
                      "C'est un verset"
                    ],
                    "c": 0,
                    "exp": "Il signale des personnes qu'il ne connaît pas dans la chaîne de ce récit.",
                    "ref": "https://dorar.net/h/Nb2x0gaa"
                  },
                  {
                    "q": "Quelles qualités Abou Doujâna évoque-t-il selon Zayd ibn Aslam ?",
                    "opts": [
                      "Retenue dans les paroles et cœur sain",
                      "Richesse et gloire",
                      "Commerce et voyage"
                    ],
                    "c": 0,
                    "exp": "Il s'agit d'un propos personnel conservé dans la notice de Siyar.",
                    "ref": "https://gcp.islamweb.net/ar/library/index.php?ID=50&bk_no=60&flag=1&page=bookcontents"
                  },
                  {
                    "q": "Où la tradition rapporte-t-elle sa mort ?",
                    "opts": [
                      "Al-Yamâma",
                      "Mou’ta",
                      "Badr"
                    ],
                    "c": 0,
                    "exp": "Le récit d'Anas cité par adh-Dhahabî le situe à Al-Yamâma.",
                    "ref": "https://siyar.fr/livre/1/244"
                  },
                  {
                    "q": "Qu'apporte Mouslim 2470 par rapport à la version du bandeau ?",
                    "opts": [
                      "Il établit le récit de l'épée, non tous les détails du bandeau",
                      "Il établit la couleur du bandeau",
                      "Il date sa mort à 97 H"
                    ],
                    "c": 0,
                    "exp": "Il faut distinguer le hadith sur l'épée et les autres transmissions.",
                    "ref": "https://sunnah.com/muslim:2470"
                  }
                ]
            },
            {
                id: 40,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khoubayb ibn 'Adi",
                arabicName: "خُبَيْب بن عَدِي",
                subtitle: "Le Crucifié qui Pria",
                intro: "Khoubayb ibn ‘Adî, compagnon des Ansâr, fut capturé après l'expédition d'Ar-Rajî‘ et détenu à La Mecque. Al-Bukhârî 3045 et 4086 rapportent son refus de nuire à un enfant, la grappe de raisin reçue pendant sa captivité et sa prière de deux unités avant l'exécution.",
                heroQuote: "La femme qui le détenait témoigne : « Je n'ai jamais vu un prisonnier meilleur que lui » (Al-Bukhârî 4086).",
                tags: ["Martyrs", "Badr", "Prière"],
                genealogy: "Khoubayb ibn 'Adi... Le Ansari.",
                timeline: [
                  {
                    "year": "2 H",
                    "desc": "Al-Bukhârî 3045 rapporte que Khoubayb tua al-Hârith ibn ‘Âmir lors de Badr."
                  },
                  {
                    "year": "4 H selon les chroniques",
                    "desc": "Khoubayb fut capturé à l'expédition d'Ar-Rajî‘ ; le récit est présent dans Al-Bukhârî 3045 et 4086."
                  },
                  {
                    "year": "Après la captivité, date distincte inconnue",
                    "desc": "Conduit hors de la zone sacrée pour l'exécution, Khoubayb prie deux raka‘ât avant sa mort (Al-Bukhârî 4086)."
                  }
                ],
                narratives: [
                  {
                    "id": 401,
                    "title": "Deux unités de prière avant l'exécution",
                    "content": "Al-Bukhârî 4086 transmet que Khoubayb demanda à accomplir deux raka‘ât, puis dit qu'il aurait prié davantage s'il n'avait craint qu'on croie à sa peur de mourir. Le texte lui attribue le précédent de cette prière dans ces circonstances."
                  },
                  {
                    "id": 402,
                    "title": "Le raisin pendant la captivité",
                    "content": "La fille d'al-Hârith témoigne avoir vu Khoubayb manger du raisin, bien qu'il fût enchaîné et que ce fruit n'eût pas été disponible à La Mecque. Elle y vit une faveur d'Allah ; ce témoignage est rapporté dans Al-Bukhârî 3045."
                  },
                  {
                    "id": 403,
                    "title": "Une invocation prononcée par Khoubayb",
                    "content": "Al-Bukhârî transmet l'invocation et des vers récités par Khoubayb devant ses exécuteurs, où il exprime son acceptation du martyre. Ces paroles sont attribuées à Khoubayb, non au Prophète ﷺ."
                  },
                  {
                    "id": 404,
                    "title": "L'enfant et le rasoir",
                    "content": "La même femme raconte avoir prêté un rasoir au prisonnier et trouvé son enfant sur ses genoux. Khoubayb la rassura : il ne ferait aucun mal au petit. Cette scène apparaît dans Al-Bukhârî 4086."
                  },
                  {
                    "id": 405,
                    "title": "L'embuscade après l'expédition d'Ar-Rajî‘",
                    "content": "Selon Abou Hourayra dans Al-Bukhârî 4086, le groupe commandé par ‘Âsim ibn Thâbit fut poursuivi par des archers, et Khoubayb fut finalement capturé. Ce récit se distingue des épisodes ultérieurs de détention."
                  }
                ],
                hadiths: [
                  {
                    "text": "Avant son exécution, Khoubayb pria deux unités puis expliqua qu'il n'avait pas voulu prolonger sa prière pour ne pas paraître effrayé.",
                    "narrator": "Abou Hourayra et la fille d'al-Hârith",
                    "source": "Sahîh al-Bukhârî 4086 — témoignage historique",
                    "type": "historical"
                  },
                  {
                    "text": "Khoubayb rassura la femme après qu'elle l'eut vu avec un rasoir et son enfant sur les genoux.",
                    "narrator": "La fille d'al-Hârith",
                    "source": "Sahîh al-Bukhârî 3045 — témoignage historique",
                    "type": "historical"
                  }
                ],
                quizData: [
                  {
                    "q": "Que fit Khoubayb avant son exécution ?",
                    "opts": [
                      "Il accomplit deux unités de prière",
                      "Il traversa la mer",
                      "Il estima des récoltes"
                    ],
                    "c": 0,
                    "exp": "Al-Bukhârî 4086 rapporte les deux raka‘ât et sa déclaration.",
                    "ref": "https://sunnah.com/bukhari:4086"
                  },
                  {
                    "q": "Quel objet Khoubayb emprunta-t-il ?",
                    "opts": [
                      "Un rasoir",
                      "Une épée",
                      "Un bouclier"
                    ],
                    "c": 0,
                    "exp": "La femme qui le détenait lui prêta un rasoir.",
                    "ref": "https://sunnah.com/bukhari:3045"
                  },
                  {
                    "q": "Comment réagit-il lorsqu'elle craignit pour son enfant ?",
                    "opts": [
                      "Il la rassura et refusa de faire du mal au bébé",
                      "Il demanda une rançon",
                      "Il abandonna l'enfant dans la rue"
                    ],
                    "c": 0,
                    "exp": "Le hadith indique qu'il n'avait pas l'intention de nuire à l'enfant.",
                    "ref": "https://sunnah.com/bukhari:4086"
                  },
                  {
                    "q": "Quel aliment reçut-il en captivité selon la narratrice ?",
                    "opts": [
                      "Du raisin",
                      "Du miel",
                      "Des olives"
                    ],
                    "c": 0,
                    "exp": "La témoin raconte une grappe de raisin alors que ce fruit n'était pas disponible.",
                    "ref": "https://sunnah.com/bukhari:3045"
                  },
                  {
                    "q": "Qui commandait le groupe envoyé en expédition ?",
                    "opts": [
                      "‘Âsim ibn Thâbit",
                      "Ja‘far",
                      "Zayd"
                    ],
                    "c": 0,
                    "exp": "Abou Hourayra donne le nom de ‘Âsim ibn Thâbit dans le récit.",
                    "ref": "https://sunnah.com/bukhari:4086"
                  },
                  {
                    "q": "À qui attribue-t-on la supplication faite avant l'exécution ?",
                    "opts": [
                      "À Khoubayb",
                      "Au Prophète ﷺ",
                      "Au Négus"
                    ],
                    "c": 0,
                    "exp": "Ce sont des paroles de Khoubayb transmises dans le hadith, et non des propos du Prophète.",
                    "ref": "https://sunnah.com/bukhari:3045"
                  }
                ]
            },
            {
                id: 41,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mouadh ibn 'Amr",
                arabicName: "مُعَاذ بن عَمْرو بن الجَموح",
                subtitle: "Le Tombeur d'Abou Jahl",
                intro: "Jeune héros de Badr qui, avec Mouadh ibn Afra, terrassa le tyran Abou Jahl. Il perdit sa main au combat mais continua à lutter avec un courage inouï.",
                heroQuote: "Par Allah, voilà ce qu'est la réelle bravoure !",
                tags: ["Ansar", "Badr", "Héros"],
                genealogy: "Mouadh ibn 'Amr ibn Al-Jamouh Al-Khazraji.",
                timeline: [
                    { year: "2 H", desc: "Attaque Abou Jahl à Badr. Sa main est tranchée par Ikrima." },
                    { year: "35 H", desc: "Vécut jusqu'au califat d'Outhman." }
                ],
                narratives: [
                    { id: 411, title: "La Main Tranchée", content: "À Badr, Ikrima (fils d'Abou Jahl) coupa presque entièrement sa main. Elle ne tenait que par un lambeau de peau. Gêné dans le combat, Mouadh la coinça sous son pied et l'arracha lui-même pour continuer à se battre." },
                    { id: 412, title: "Le Pacte des Jeunes", content: "Lui et un autre jeune (Mouadh ibn Afra) demandèrent à Abderrahman ibn 'Aouf où était Abou Jahl. Dès qu'ils l'aperçurent, ils foncèrent sur lui comme deux faucons et le frappèrent à mort." }
                ],
                hadiths: [
                    { text: "Lequel de vous deux l'a tué ? (Voyant les épées) Vous l'avez tué tous les deux !", narrator: "Le Prophète (ﷺ)", source: "Bukhari / Muslim" }
                ],
                quizData: [
                    { q: "Qui a-t-il tué en collaboration avec un autre jeune à Badr ?", opts: ["Oumaya ibn Khalaf", "Abou Lahab", "Abou Jahl", "Walid"], c: 2, exp: "Ils ont attaqué conjointement le Pharaon de cette communauté." },
                    { q: "Qu'a-t-il fait de sa main blessée ?", opts: ["Il l'a bandée", "Il a arrêté le combat", "Il l'a arrachée avec son pied", "Il a demandé de l'aide"], c: 2, exp: "Elle le gênait pour combattre, alors il l'a arrachée lui-même." }
                ]
            },
            {
                id: 42,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mouawidh ibn 'Amr",
                arabicName: "مُعَوِّذ بن عَمْرو",
                subtitle: "Le Frère de Badr",
                intro: "Frère de Mouadh ibn 'Amr. Il participa à la bataille de Badr aux côtés de ses frères, formant un trio de combattants issus de la même maison.",
                tags: ["Ansar", "Badr"],
                genealogy: "Fils de 'Amr ibn Al-Jamouh.",
                timeline: [
                    { year: "2 H", desc: "Participation à Badr avec ses frères Mouadh et Khallad." }
                ],
                narratives: [
                    { id: 421, title: "La Fratrie au Combat", content: "Il accompagna ses frères Mouadh et Khallad à Badr. Bien que moins célèbre que Mouadh (le tueur d'Abou Jahl), sa présence témoigne de l'engagement total de la famille d'Amr ibn Al-Jamouh." }
                ],
                hadiths: [
                    { text: "Il participa à Badr avec ses deux frères.", narrator: "Al-Waqidi", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Avec qui a-t-il participé à Badr ?", opts: ["Seul", "Avec ses frères Mouadh et Khallad", "Avec son père", "Avec son oncle"], c: 1, exp: "Les trois frères étaient présents à la première grande bataille." }
                ]
            },
            {
                id: 43,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khallad ibn 'Amr",
                arabicName: "خَلَّاد بن عَمْرو",
                subtitle: "Le Martyr d'Ouhoud",
                intro: "Frère de Mouadh et Mouawidh. Il combattit à Badr et tomba martyr à Ouhoud en même temps que son père 'Amr, défendant le Prophète.",
                tags: ["Ansar", "Badr", "Martyrs"],
                genealogy: "Fils de 'Amr ibn Al-Jamouh.",
                timeline: [
                    { year: "2 H", desc: "Participation à Badr." },
                    { year: "3 H", desc: "Meurt martyr à Ouhoud avec son père." }
                ],
                narratives: [
                    { id: 431, title: "Le Père et le Fils", content: "Le jour d'Ouhoud, il sortit avec son père boiteux ('Amr). Ils furent tous deux tués au combat. Sa mère Hind transporta leurs corps sur un chameau vers Médine, mais le chameau s'agenouilla et refusa d'avancer vers la ville, préférant retourner vers Ouhoud où ils furent enterrés." }
                ],
                hadiths: [
                    { text: "Nul grief à vous... il est possible qu'Allah lui accorde le martyre.", narrator: "Le Prophète (à propos de son père)", source: "Contexte d'Ouhoud" }
                ],
                quizData: [
                    { q: "Où Khallad est-il mort ?", opts: ["Badr", "Ouhoud", "La Mecque", "Khaybar"], c: 1, exp: "Il est tombé martyr à Ouhoud le même jour que son père." }
                ]
            },
            {
                id: 44,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Amr ibn Al-Jamouh",
                arabicName: "عَمْرو بن الجَموح",
                subtitle: "Le Boiteux du Paradis",
                intro: "Doyen des Banou Salima, il se convertit tardivement après que ses fils eurent jeté son idole aux ordures. Handicapé d'une jambe, il insista pour combattre à Ouhoud et y gagna le Paradis.",
                heroQuote: "Par Allah, je sautillerai avec ce pied au Paradis !",
                tags: ["Ansar", "Ouhoud", "Martyrs", "Boiteux"],
                genealogy: "Doyen des Banou Salima. Père de Mouadh, Mouawidh et Khallad.",
                physicalDesc: "Il était sévèrement handicapé d'une jambe (boiteux) et avait les cheveux blancs et crépus.",
                timeline: [
                    { year: "Conversion", desc: "Ses fils jettent son idole Manaf dans une fosse septique, ce qui le réveille spirituellement." },
                    { year: "3 H", desc: "Insiste pour aller à Ouhoud malgré son handicap. Meurt martyr et est enterré avec Abd-Allah ibn Amr ibn Haram." }
                ],
                narratives: [
                    { id: 441, title: "La Fin de Manaf", content: "Il parfumait son idole Manaf. La nuit, des jeunes la jetaient dans les ordures. Après l'avoir retrouvée attachée à un chien mort dans un puits, 'Amr réalisa : « Si tu étais un dieu, tu ne serais pas au fond d'un puits avec un chien mort ». Il se convertit alors." },
                    { id: 442, title: "Le Vœu du Boiteux", content: "Ses fils voulaient l'empêcher d'aller à Ouhoud car il était boiteux (excusé légalement). Il se plaignit au Prophète : « Mes fils veulent m'empêcher d'entrer au Paradis ! ». Le Prophète lui permit d'y aller. Il dit : « Je veux fouler le Paradis avec mon pied boiteux »." },
                    { id: 443, title: "Le Corps Intact", content: "46 ans après sa mort, une inondation obligea à déplacer sa tombe. On retrouva son corps et celui de son compagnon Abd-Allah ibn Amr intacts, souples comme s'ils venaient de mourir la veille. Sa main, qui couvrait sa blessure, revenait à sa place si on l'enlevait." }
                ],
                hadiths: [
                    { text: "Votre doyen est 'Amr ibn Al-Jamouh, l'homme aux cheveux blancs et crépelés !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" },
                    { text: "Par Allah, je l'ai vu sautiller dans le Paradis avec sa jambe (guérie) !", narrator: "Le Prophète (ﷺ)", source: "Hadith authentique" }
                ],
                quizData: [
                    { q: "Pourquoi ses fils voulaient-ils l'empêcher de combattre ?", opts: ["Il était aveugle", "Il était boiteux", "Il était trop jeune", "Il était malade"], c: 1, exp: "Il avait un handicap sévère à la jambe qui l'exemptait du Jihad." },
                    { q: "Qu'a-t-il dit au Prophète avant Ouhoud ?", opts: ["Prie pour moi", "Je veux sautiller au Paradis avec mon pied", "Donne-moi une épée", "Je veux rester"], c: 1, exp: "Il a exprimé son désir ardent du martyre malgré son handicap." }
                ]
            },
            {
                id: 45,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Oubayda ibn Al-Harith",
                arabicName: "عُبَيْدة بن الحارِث",
                subtitle: "Le Doyen des Combattants",
                intro: "Cousin âgé du Prophète (plus vieux que lui de 10 ans). Il reçut la première bannière de guerre de l'Islam et fut le premier martyr des duels de Badr.",
                heroQuote: "Si Abou Talib me voyait, il saurait que je suis digne de ses vers !",
                tags: ["Ahl al-Bayt", "Badr", "Martyrs", "Doyen"],
                genealogy: "Oubayda ibn Al-Harith ibn Al-Mouttalib (cousin du père du Prophète). Sa mère est Soukhayla.",
                physicalDesc: "Il était âgé de 63 ans à Badr.",
                timeline: [
                    { year: "1 H", desc: "Premier chef d'expédition (60 cavaliers) à Thaniyat al-Marra." },
                    { year: "2 H", desc: "Duel contre Outba à Badr. Jambe tranchée. Meurt à As-Safra au retour." }
                ],
                narratives: [
                    { id: 451, title: "Le Duel de Badr", content: "Il fut le premier à sortir en duel à Badr. Il affronta Outba ibn Rabi'a. Ils se frappèrent mutuellement. Hamza et Ali vinrent à son secours, tuèrent Outba et portèrent Oubayda. Sa jambe était coupée et la moelle en coulait. Il mourut quelques jours plus tard." },
                    { id: 452, title: "La Première Bannière", content: "Le Prophète (ﷺ) noua pour lui la toute première bannière de l'Islam (blanche) lors de la première expédition militaire (Sariya)." }
                ],
                hadiths: [
                    { text: "Il est un bienheureux qui a rejoint le bonheur (Le martyre).", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quelle particularité militaire a Oubayda ?", opts: ["Premier archer", "Premier porteur de bannière (Chef d'expédition)", "Premier cavalier", "Premier martyr"], c: 1, exp: "Le Prophète lui remit la première bannière de guerre dressée en Islam." },
                    { q: "Quel âge avait-il à Badr ?", opts: ["20 ans", "40 ans", "63 ans", "80 ans"], c: 2, exp: "Il était le doyen des combattants, plus âgé que le Prophète." }
                ]
            },
            {
                id: 46,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Rabi'a ibn Al-Harith",
                arabicName: "رَبِيعَة بن الحارِث",
                subtitle: "Le Cousin Associé",
                intro: "Cousin du Prophète et associé d'Outhman dans le commerce. Il se convertit tardivement mais sincèrement. Le Prophète annula la vendetta de son fils.",
                heroQuote: "La première vengeance que je rends caduque est celle du fils de Rabi'a !",
                tags: ["Ahl al-Bayt", "Cousin"],
                genealogy: "Rabi'a ibn Al-Harith ibn Abdelmoutalib. Plus âgé que son oncle Abbas de 2 ans.",
                timeline: [
                    { year: "5 H", desc: "Tente de rejoindre le Prophète avec Abbas, y parvient et se convertit à l'année de Khaybar." },
                    { year: "Don", desc: "Reçoit 100 wasq de dattes de Khaybar par an." },
                    { year: "13 H", desc: "Décès sous le califat d'Omar." }
                ],
                narratives: [
                    { id: 461, title: "Le Prix du Sang", content: "Son fils Adam (bébé) fut tué dans une guerre tribale pré-islamique. Lors du Pèlerinage d'Adieu, le Prophète annula toutes les vendettas de la Jahiliya, commençant symboliquement par celle de sa propre famille : le sang du fils de Rabi'a." }
                ],
                hadiths: [
                    { text: "Le premier sang que j'abolis est celui d'Adam ibn Rabi'a (ou Iyas ibn Rabi'a).", narrator: "Le Prophète (ﷺ)", source: "Sermon d'Adieu" }
                ],
                quizData: [
                    { q: "Quel lien avait-il avec le Prophète ?", opts: ["Oncle", "Cousin", "Frère", "Neveu"], c: 1, exp: "Il était le fils de son oncle Al-Harith." }
                ]
            },
            {
                id: 47,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Al-Harith",
                arabicName: "عبد الله بن الحارث",
                subtitle: "Le Bienheureux",
                intro: "Frère de Rabi'a et Nawfal. Il s'appelait 'Abd-Shams' avant que le Prophète ne le renomme. Il mourut lors d'une expédition avec le Prophète.",
                heroQuote: "Il est un bienheureux qui a rejoint le bonheur !",
                tags: ["Ahl al-Bayt", "Cousin"],
                genealogy: "Fils d'Al-Harith ibn Abdelmoutalib.",
                timeline: [
                    { year: "Nom", desc: "Rebaptisé Abd-Allah par le Prophète (il s'appelait Abd-Shams)." },
                    { year: "Décès", desc: "Meurt à As-Safra au retour d'une expédition. Le Prophète l'enterre avec sa propre tunique." }
                ],
                narratives: [
                    { id: 471, title: "L'Enterrement Béni", content: "Le Prophète (ﷺ) l'ensevelit dans sa propre tunique (Qamis) avant de le mettre en terre, un honneur immense." }
                ],
                hadiths: [
                    { text: "Il est un bienheureux qui a rejoint le bonheur !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel était son nom avant l'Islam ?", opts: ["Abd-Allah", "Abd-Shams", "Abou Jahl", "Al-Harith"], c: 1, exp: "Il portait un nom polythéiste (Serviteur du Soleil) que le Prophète a changé." }
                ]
            },
            {
                id: 48,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khalid ibn Saïd",
                arabicName: "خالِد بن سَعِيد",
                subtitle: "Le Scribe de la Basmala",
                intro: "L'un des cinq premiers musulmans. Il serait le premier à avoir écrit 'Bismillah Ar-Rahman Ar-Rahim'. Gouverneur du Yémen et martyr en Syrie.",
                heroQuote: "Accomplissez ce qu'il a accompli et vous revêtirez pareil vêtement !",
                tags: ["Omeyyade", "Scribe", "Abyssinie", "Martyr"],
                genealogy: "Khalid ibn Saïd ibn Al-'Ass (Omeyyade).",
                physicalDesc: "Particulièrement beau.",
                timeline: [
                    { year: "Débuts", desc: "5ème converti. Immigre en Abyssinie (10 ans)." },
                    { year: "Mission", desc: "Gouverneur de Sanaa (Yémen) nommé par le Prophète." },
                    { year: "13 H", desc: "Martyr à la bataille d'Ajnadayne (ou Marj as-Soûffar)." }
                ],
                narratives: [
                    { id: 481, title: "La Soie Interdite", content: "Il tua un polythéiste et mit son vêtement de soie. 'Amr s'agaça de le voir porter de la soie. On lui répondit : 'Fais ce qu'il a fait (tuer l'ennemi) et tu porteras ce qu'il porte', justifiant le butin de guerre." },
                    { id: 482, title: "Le Premier Scribe", content: "Sa fille Oum Khalid rapporte qu'il fut le premier à écrire la formule 'Bismillah Ar-Rahman Ar-Rahim' (Au nom d'Allah le Clément le Miséricordieux)." }
                ],
                hadiths: [
                    { text: "Qui donc est cet homme ? J'ai vu une lumière émaner de lui jusqu'au ciel !", narrator: "Le tueur de Khalid (avant sa conversion)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quelle formule sacrée aurait-il écrite en premier ?", opts: ["Allahu Akbar", "La ilaha illa Allah", "Bismillah Ar-Rahman Ar-Rahim", "Alhamdulillah"], c: 2, exp: "Sa fille témoigne qu'il est le premier à avoir écrit la Basmala." }
                ]
            },
            {
                id: 49,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abane ibn Saïd",
                arabicName: "أَبان بن سَعِيد",
                subtitle: "Le Protecteur d'Outhman",
                intro: "Frère de Khalid ibn Saïd. Il accorda sa protection (Jiwar) à Outhman lors du traité d'Houdaybiya. Il devint gouverneur du Bahreïn.",
                tags: ["Omeyyade", "Gouverneur", "Martyr"],
                genealogy: "Abane ibn Saïd ibn Al-'Ass.",
                timeline: [
                    { year: "6 H", desc: "Protège Outhman à la Mecque lors des négociations." },
                    { year: "Conversion", desc: "Se convertit suite à l'appel de ses frères." },
                    { year: "9 H", desc: "Nommé Gouverneur de Bahreïn par le Prophète." },
                    { year: "13 H", desc: "Martyr au Sham, suivant des traditions qui évoquent notamment Yarmouk et Ajnadayne." }
                ],
                narratives: [
                    { id: 491, title: "La Protection d'Outhman", content: "Lorsqu'Outhman vint négocier à la Mecque (Houdaybiya), Abane (alors païen) le prit sous sa protection et le fit monter sur sa selle, lui permettant de circuler en sécurité." },
                    { id: 492, title: "Le départ au Sham des trois frères", content: "Un récit attribué à ‘Amr ibn Saïd Al-Ashdaq dit que Khalid, Abane et ‘Amr quittèrent leurs fonctions après la mort du Prophète (ﷺ), puis partirent au Sham où ils trouvèrent le martyre. La notice d’‘Amr donne Yarmouk ou Ajnadayne selon les voies : il est excessif d’affirmer qu’ils moururent tous au même endroit le même jour." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Qui a-t-il protégé lors de l'incident d'Houdaybiya ?", opts: ["Le Prophète", "Outhman ibn Affan", "Abou Bakr", "Ali"], c: 1, exp: "Il a pris son cousin Outhman sous sa protection pour qu'il puisse négocier à la Mecque." }
                ]
            },
            {
                id: 50,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Amr ibn Saïd",
                arabicName: "عَمْرو بن سَعِيد",
                subtitle: "Le Troisième Frère",
                intro: "Frère de Khalid et Abane. Il participa aux deux émigrations (Abyssinie et Médine) et refusa les honneurs politiques après la mort du Prophète pour se consacrer au Jihad.",
                heroQuote: "Nous ne travaillerons pour personne après le Messager d'Allah !",
                tags: ["Omeyyade", "Abyssinie", "Martyr"],
                genealogy: "'Amr ibn Saïd ibn Al-'Ass.",
                timeline: [
                    { year: "Exil", desc: "Accomplit les deux hégires (Abyssinie et Médine)." },
                    { year: "11 H", desc: "Refuse de garder son poste de gouverneur après la mort du Prophète." },
                    { year: "13 H", desc: "Martyr au Sham avec ses frères." }
                ],
                narratives: [
                    { id: 501, title: "Le Refus du Poste", content: "À la mort du Prophète, Abou Bakr demanda aux frères Saïd de rester gouverneurs. Ils répondirent : « Nous ne travaillerons pour personne après le Messager d'Allah ». Ils partirent tous au Jihad au Sham et y moururent." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Combien d'émigrations (Hijra) a-t-il accomplies ?", opts: ["Une", "Deux (Abyssinie et Médine)", "Trois", "Aucune"], c: 1, exp: "Il fait partie des rares 'Mouhajirounes des deux exodes'." }
                ]
            },
            {
                id: 51,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-'Ala ibn Al-Hadrami",
                arabicName: "العَلاء بن الحَضْرَمي",
                subtitle: "L'Homme aux Miracles",
                intro: "Gouverneur du Bahreïn, connu également par des récits historiques évoquant une traversée de la mer ou d’un gué, ainsi que l’apparition d’eau dans le désert. Ces épisodes sont rapportés avec des voies distinctes et ne sont pas authentifiés ici de façon indépendante.",
                heroQuote: "Ô Omniscient, Ô Indulgent, Ô Très-Haut... Abreuve-nous !",
                tags: ["Gouverneur", "Miracle", "Bahreïn"],
                genealogy: "Al-'Ala ibn Abd-Allah... Al-Hadrami. Allié des Banou Oumaya.",
                timeline: [
                    { year: "Mandat", desc: "Gouverneur de Bahreïn sous le Prophète, Abou Bakr et Omar." },
                    { year: "Miracle", desc: "Traverse la mer à pied/cheval pour attaquer Darine." },
                    { year: "21 H", desc: "Décès. Son corps est enterré sans niche, creusé avec des épées, puis disparait." }
                ],
                narratives: [
                    { id: 511, title: "Les récits d’une traversée", content: "La notice rapporte d’après ‘Ourwa qu’Al-‘Ala traversa avec ses troupes à pied une étendue décrite comme mer ou gué. Un témoignage attribué à Abou Hourayra évoque une traversée à cheval. Ces narrations ne doivent pas être confondues ni présentées comme des miracles historiquement démontrés." },
                    { id: 512, title: "L’eau du désert, selon une narration", content: "La notice transmet d’Abou Hourayra un souvenir de voyage dans le désert du Dahna : après l’invocation d’Al-‘Ala, de l’eau serait apparue et le groupe aurait pu boire. Il s’agit d’un récit attribué à son rapporteur, sans vérification indépendante effectuée par Athar." }
                ],
                hadiths: [
                    { text: "J'ai vu trois choses étonnantes avec Al-'Ala : la traversée de la mer, l'eau du désert et la disparition de son corps.", narrator: "Abou Hourayra", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel miracle est associé à Al-'Ala ?", opts: ["Voler dans les airs", "Traverser la mer à sec avec son armée", "Parler aux animaux", "Guérir les aveugles"], c: 1, exp: "Abou Hourayra témoigne l'avoir vu traverser la mer comme sur la terre ferme." }
                ]
            },
            {
                id: 52,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saad ibn Khaythama",
                arabicName: "سَعْد بن خَيْثَمَة",
                subtitle: "L'Hôte des Célibataires",
                intro: "L'un des 12 apôtres (Nuqaba). Sa maison à Médine était le refuge des émigrés célibataires. Il tira au sort contre son père pour aller mourir à Badr.",
                heroQuote: "Si cela avait été pour une chose autre que le Paradis, je t'aurais laissé y aller !",
                tags: ["Ansar", "Badr", "Martyr", "Apôtre"],
                genealogy: "Saad ibn Khaythama Al-Aoussi.",
                timeline: [
                    { year: "Hégire", desc: "Sa maison est surnommée 'Le Repaire des célibataires'." },
                    { year: "2 H", desc: "Gagne le tirage au sort contre son père et meurt martyr à Badr." }
                ],
                narratives: [
                    { id: 521, title: "Le Tirage au Sort", content: "Son père Khaythama lui demanda de rester avec les femmes pour qu'il puisse aller combattre à Badr. Saad refusa, désirant le Paradis. Ils tirèrent au sort, Saad gagna, partit et fut tué. Son père mourut plus tard à Ouhoud." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Comment sa maison était-elle surnommée ?", opts: ["La Maison de la Paix", "Le Repaire des célibataires", "Dar Al-Arqam", "La Forteresse"], c: 1, exp: "Il accueillait les Muhajirounes célibataires à leur arrivée à Médine." }
                ]
            },
            {
                id: 53,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Bara ibn Marour",
                arabicName: "البراء بن مَعْرُور",
                subtitle: "L'Homme à la Kaaba",
                intro: "Premier à avoir prêté serment à Aqaba. Il priait vers la Kaaba avant même que l'ordre ne soit révélé. Il mourut un mois avant l'arrivée du Prophète à Médine.",
                heroQuote: "J'ai souhaité ne plus donner le dos à cet édifice (la Kaaba)...",
                tags: ["Ansar", "Aqaba", "Premier"],
                genealogy: "Chef des Banou Salima. Père de Bishr.",
                timeline: [
                    { year: "Aqaba", desc: "Premier à prêter serment (Bay'a)." },
                    { year: "Voyage", desc: "Prie vers la Mecque pendant le voyage, contrairement aux autres." },
                    { year: "Décès", desc: "Meurt un mois avant l'Hégire. Le Prophète prie sur sa tombe." }
                ],
                narratives: [
                    { id: 531, title: "L'Intuition de la Qibla", content: "En route pour la Mecque, il décida de prier vers la Kaaba alors que la Qibla était Jérusalem. Le Prophète lui dit : « Tu étais sur une Qibla (Jérusalem), si seulement tu avais patienté ». Mais il avait anticipé le désir du Prophète." },
                    { id: 532, title: "Le Testament", content: "Il légua un tiers de ses biens au Prophète. Le Prophète (ﷺ) rendit cet argent à ses héritiers, instaurant une justice successorale." }
                ],
                hadiths: [
                    { text: "Ô Allah, accorde-lui ton pardon, ta miséricorde et fais-le rentrer dans ton Paradis !", narrator: "Le Prophète (ﷺ) sur sa tombe", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quelle primauté détient Al-Bara ibn Marour ?", opts: ["Premier martyr", "Premier à prêter serment à Aqaba", "Premier muezzin", "Premier calife"], c: 1, exp: "Il fut le premier des 70 Ansar à taper dans la main du Prophète lors de la nuit d'Aqaba." }
                ]
            },
            {
                id: 54,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Bishr ibn Al-Bara",
                arabicName: "بِشْر بن البَراء",
                subtitle: "Le Martyr du Poison",
                intro: "Fils d'Al-Bara ibn Marour. Il mangea avec le Prophète de la brebis empoisonnée offerte par une femme juive à Khaybar et en mourut.",
                heroQuote: "Votre chef est plutôt l'homme blanc à la chevelure crêpelée : Bishr ibn Al-Bara !",
                tags: ["Ansar", "Badr", "Martyr"],
                genealogy: "Bishr ibn Al-Bara ibn Marour.",
                timeline: [
                    { year: "2 H", desc: "Participe à Badr." },
                    { year: "7 H", desc: "Mange la viande empoisonnée à Khaybar et meurt (immédiatement ou après un an)." }
                ],
                narratives: [
                    { id: 541, title: "Le Chef des Banou Salima", content: "Quand le clan se plaignit de l'avarice de leur chef officiel (Al-Jad ibn Qays), le Prophète (ﷺ) demanda : « Et quel mal est pire que l'avarice ? ». Il désigna alors Bishr comme leur véritable chef pour sa générosité." }
                ],
                hadiths: [],
                quizData: [
                    { q: "De quoi est mort Bishr ?", opts: ["D'une flèche", "De la peste", "En mangeant une brebis empoisonnée", "De vieillesse"], c: 2, exp: "Il a mangé le poison destiné au Prophète lors de la conquête de Khaybar." }
                ]
            },
			{
                id: 55,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saad ibn Oubada",
                arabicName: "سعد بن عبادة",
                subtitle: "Le Doyen des Khazraj",
                intro: "Chef des Khazraj, Saad ibn Oubada était connu pour sa générosité et envoyait quotidiennement de la nourriture au Prophète (ﷺ). Sa mort au Sham est entourée de récits et de datations divergents.",
                heroQuote: "Ô Allah, pourvois-moi d'argent; il est certes indispensable à l'entreprise des œuvres !",
                tags: ["Ansar", "Khazraj", "Généreux", "Chef"],
                genealogy: "Saad ibn Oubada ibn Doulaym... Le doyen des Khazraj. Sa mère (Amra) décéda alors qu'elle devait accomplir un vœu.",
                physicalDesc: "Un homme d'une grande corpulence, noble et généreux. On raconte que sa peau verdit après sa mort étrange.",
                timeline: [
                    { year: "Avant l'Hégire", desc: "Participe au serment d'allégeance d'Al-'Aqaba et compte parmi les douze apôtres (Nuqaba)." },
                    { year: "2 H", desc: "Prépare l'expédition de Badr mais est mordu par un serpent (ou malade) juste avant. Le Prophète lui accorde sa part de butin." },
                    { year: "Vie du Prophète", desc: "Fait envoyer quotidiennement une écuelle de viande ou de lait au Prophète dans ses demeures." },
                    { year: "11 H", desc: "Des Ansâr envisagèrent de lui prêter allégeance à la Saqîfa ; un récit rapporte ensuite son refus d’allégeance à Abou Bakr puis à ‘Oumar, sans établir à lui seul ses motivations." },
                    { year: "14 ou 16 H selon des récits", desc: "Plusieurs narrations situent sa mort au Hauran. Une tradition l’attribue aux djinns ; il ne s’agit pas d’une cause établie." }
                ],
                narratives: [
                    { id: 551, title: "L'Ombre de la Générosité", content: "Lorsque le Prophète (ﷺ) arriva à Médine, Saad instaura une coutume : chaque soir, une écuelle de 'Tharid' (viande et bouillon) ou de lait ou de graisse était envoyée au Prophète, le suivant tour à tour chez ses épouses. Le Prophète invoquait : « Ô Allah, accorde Tes bénédictions à la famille de Saad ibn Oubada »." },
                    { id: 552, title: "La Jalousie Légendaire", content: "Saad était d'une jalousie (Ghayra) extrême pour son honneur. Il jura : « Si je voyais un homme avec ma femme, je le frapperais du tranchant de l'épée ! ». Le Prophète (ﷺ) dit : « Vous étonnez-vous de la jalousie de Saad ? Par Allah, je suis plus jaloux que lui et Allah est plus jaloux que moi ! »." },
                    { id: 553, title: "Des traditions sur sa mort au Hauran", content: "Le fascicule rapporte plusieurs traditions concernant sa mort dans le Hauran, avec des dates divergentes. Certaines attribuent cette mort aux djinns et évoquent une voix entendue après son décès. Ces récits sont conservés comme témoignages transmis, sans conclure à une causalité surnaturelle certaine." }
                ],
                hadiths: [
                    { text: "La foi (Al-Iman) est l'amour des Ansar, et l'hypocrisie est la haine des Ansar.", narrator: "Le Prophète (ﷺ)", source: "Sahih Al-Boukhari" },
                    { text: "Ô Allah, donne-moi la gloire (Hamd) et la richesse (Majd) ! Car la gloire ne s'obtient pas sans actes, et les actes ne se font pas sans argent.", narrator: "Saad ibn Oubada (Invocation)", source: "Rapporté par Qays" }
                ],
                quizData: [
                    { q: "Pourquoi Saad n'a-t-il pas combattu physiquement à Badr ?", opts: ["Il était malade / mordu par un serpent", "Il avait peur", "Il était trop vieux", "Il était en voyage"], c: 0, exp: "Il préparait l'expédition mais fut empêché par une morsure de serpent (ou maladie) juste avant le départ." },
                    { q: "Quelle invocation faisait-il souvent ?", opts: ["Pour la pauvreté", "Pour la richesse afin d'agir", "Pour le pouvoir", "Pour la science"], c: 1, exp: "Il demandait l'argent non pour le luxe, mais parce qu'il est indispensable pour les grandes œuvres." }
                ]
            },
            {
                id: 56,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saad ibn Mouadh",
                arabicName: "سعد بن معاذ",
                subtitle: "Celui pour qui le Trône a vibré",
                intro: "Chef des Aous. Sa conversion entraîna celle de tout son clan en une après-midi. Sa mort fit trembler le Trône du Tout-Miséricordieux et 70 000 anges descendirent pour ses funérailles.",
                heroQuote: "Le Trône d'Allah a émis des vibrations à la mort de Saad ibn Mouadh !",
                tags: ["Ansar", "Aous", "Badr", "Martyrs"],
                genealogy: "Saad ibn Mouadh... ibn Abd Al-Achehal. Chef incontesté des Aous. Mère : Kabsha bint Rafi'.",
                physicalDesc: "Un homme à la peau blanche, très grand de taille, corpulent et imposant. Il avait une belle barbe et de beaux yeux.",
                timeline: [
                    { year: "Conversion", desc: "Se convertit via Mouss'ab. Interdit à son clan de lui parler tant qu'ils ne se convertissent pas : tous le suivent le soir même." },
                    { year: "2 H", desc: "Porte la bannière des Ansars à Badr. Menace Abou Jahl à la Mecque avant la bataille." },
                    { year: "5 H", desc: "Blessé à l'artère médiane (bras) par une flèche à la bataille du Fossé (Khandaq)." },
                    { year: "Décès", desc: "Juge le sort des Banou Qourayzha puis sa blessure se rouvre. Il meurt à 37 ans." }
                ],
                narratives: [
                    { id: 561, title: "Le Jugement Divin", content: "Blessé, Saad fut porté à dos d'âne pour juger les traîtres de Banou Qourayzha. Il décréta l'exécution des combattants et la captivité des familles. Le Prophète (ﷺ) s'écria : « Tu as jugé selon le jugement d'Allah prononcé au-dessus des sept cieux ! »." },
                    { id: 562, title: "Le Tremblement du Trône", content: "À sa mort, Jibril vint voir le Prophète (ﷺ) et demanda : « Qui est ce défunt pour qui les portes du ciel se sont ouvertes et pour qui le Trône a vibré ? ». Le Prophète sortit en hâte, traînant son habit, et trouva Saad mort." },
                    { id: 563, title: "Les Mouchoirs du Paradis", content: "On offrit au Prophète une tunique de soie brodée d'or. Les compagnons touchaient le tissu avec admiration. Le Prophète dit : « Vous admirez la douceur de ceci ? Par Celui qui détient mon âme, les mouchoirs de Saad ibn Mouadh au Paradis sont bien plus doux et beaux que cela ! »." },
                    { id: 564, title: "Une étreinte de la tombe : des voies à distinguer", content: "La notice rapporte des paroles décrivant l’étreinte de la tombe de Saad ibn Mouadh. Dhahabî signale expressément qu’une version expliquant cette étreinte par des éclaboussures d’urine a une chaîne de transmission discontinue. Athar ne retient pas cette explication comme certaine." }
                ],
                hadiths: [
                    { text: "Le Trône du Tout-Miséricordieux a tremblé à cause de la mort de Saad ibn Mouadh !", narrator: "Le Prophète (ﷺ)", source: "Bukhari / Muslim" },
                    { text: "Ô Allah, si Tu as prévu d'autres guerres contre Quraysh, garde-moi en vie... Sinon, fais que cette blessure soit mon martyre.", narrator: "Saad ibn Mouadh (Invocation)", source: "Sahih Bukhari" }
                ],
                quizData: [
                    { q: "Quelle blessure a causé la mort de Saad ?", opts: ["Une épée dans le ventre", "Une flèche sectionnant l'artère du bras", "Une chute de cheval", "La peste"], c: 1, exp: "Il reçut une flèche d'Ibn Al-Ariqa qui sectionna son artère médiane (Akhal) lors du siège du Fossé." },
                    { q: "Combien d'anges ont assisté à ses funérailles ?", opts: ["1000", "70 000", "5000", "Tous les anges"], c: 1, exp: "Le Prophète a dit que 70 000 anges, qui n'étaient jamais descendus sur Terre, sont venus pour lui." }
                ]
            },
			{
                id: 57,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Zayd ibn Al-Khattab",
                arabicName: "زيد بن الخطاب",
                subtitle: "Le Frère Précédent",
                intro: "Frère aîné d'Oumar ibn Al-Khattab. Il devança son frère dans la conversion à l'Islam et le devança dans le martyre. Oumar pleurait souvent sa perte en sentant le vent de l'Est.",
                heroQuote: "À chaque fois que le vent d'est souffle, je sens l'odeur de Zayd !",
                tags: ["Muhajirun", "Martyrs", "Yamama"],
                genealogy: "Zayd ibn Al-Khattab ibn Noufayl. Surnommé Abou Abderrahman. Frère d'Oumar.",
                physicalDesc: "Il avait la peau basanée et était très grand de taille.",
                timeline: [
                    { year: "2 H", desc: "Participe à Badr. Oumar lui propose son armure, il refuse disant : « Je souhaite le martyre autant que toi ! »." },
                    { year: "3 H", desc: "Combat à Ouhoud et aux batailles suivantes." },
                    { year: "12 H", desc: "Porte-étendard à Yamama. Il exhorte les musulmans en fuite et combat jusqu'à la mort." }
                ],
                narratives: [
                    { id: 571, title: "Le Vœu de Silence", content: "À Yamama, voyant les musulmans reculer, il cria : « Ô Allah, je m'excuse de ce qu'ont fait mes compagnons (fuite) et je désavoue ce qu'ont fait ces gens (Musaylima) ! ». Puis il jura de ne plus parler jusqu'à la victoire ou la mort. Il fut tué sans avoir prononcé un mot de plus." },
                    { id: 572, title: "Le Chagrin d'Oumar", content: "Oumar dit à son fils qui revint vivant de Yamama : « Pourquoi n'es-tu pas mort avant ton oncle ? ». Le fils répondit : « Il a demandé le martyre et l'a eu, j'ai combattu mais on ne me l'a pas accordé »." }
                ],
                hadiths: [
                    { text: "Le meilleur de vous deux est celui qui est mort (Zayd) ! Le Prophète a témoigné du Paradis pour Zayd.", narrator: "Oumar ibn Al-Khattab", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel était son lien avec Oumar ibn Al-Khattab ?", opts: ["Son fils", "Son père", "Son frère aîné", "Son cousin"], c: 2, exp: "Il était son frère aîné et s'était converti avant lui." },
                    { q: "Quel serment a-t-il fait à Yamama ?", opts: ["De tuer Musaylima", "De ne plus parler jusqu'à la victoire", "De ne pas manger", "De ne pas reculer"], c: 1, exp: "Il a juré le silence total pour se concentrer uniquement sur le combat." }
                ]
            },
            {
                id: 58,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "As'ad ibn Zourara",
                arabicName: "أَسْعَد بن زرارة",
                subtitle: "Le Premier Imam de Médine",
                intro: "Surnommé Abou Oumama. Chef des Banou Najjar et l'un des tout premiers Ansars. Il fut le premier à diriger la prière du vendredi à Médine avant même l'Hégire.",
                heroQuote: "C'est moi-même qui serai votre chef ! (Le Prophète prenant sa place)",
                tags: ["Ansar", "Aqaba", "Imam", "Nuqaba"],
                genealogy: "As'ad ibn Zourara... des Banou Najjar (oncles maternels du Prophète).",
                physicalDesc: "Il est mort très tôt, avant Badr.",
                timeline: [
                    { year: "Aqaba I", desc: "L'un des six premiers convertis de Yathrib." },
                    { year: "Aqaba II", desc: "Le plus jeune des 12 chefs (Nuqaba). Il prit la main du Prophète pour valider le pacte." },
                    { year: "Médine", desc: "Organise la première prière du vendredi (Joumou'a) dans un terrain caillouteux." },
                    { year: "1 H", desc: "Meurt d'une angine (ou diphtérie) pendant la construction de la mosquée." }
                ],
                narratives: [
                    { id: 581, title: "La Cautérisation", content: "Il fut atteint d'une 'Dhabha' (angine grave/diphtérie). Le Prophète (ﷺ) le cautérisa lui-même au cou pour tenter de le sauver, disant : « Je ne veux pas que les Juifs disent que je n'ai rien pu faire pour mon compagnon ». Mais le destin d'Allah s'accomplit." },
                    { id: 582, title: "L'Honneur des Banou Najjar", content: "À sa mort, son clan demanda un nouveau chef (Naqib). Le Prophète répondit : « Vous êtes mes oncles maternels, je suis moi-même votre chef ». Ce fut un honneur immense pour eux." }
                ],
                hadiths: [
                    { text: "Abou Oumama (As'ad) est le premier à avoir prié le vendredi avec nous à Hazm An-Nabit.", narrator: "Kaab ibn Malik", source: "Sunan Abi Dawud" }
                ],
                quizData: [
                    { q: "Quel rite a-t-il instauré à Médine avant l'Hégire ?", opts: ["L'appel à la prière", "La prière du Vendredi (Joumou'a)", "Le jeûne", "Le pèlerinage"], c: 1, exp: "Il réunissait les 40 premiers musulmans pour la prière du vendredi avant l'arrivée du Prophète." },
                    { q: "Qui est devenu le chef de son clan après sa mort ?", opts: ["Saad ibn Oubada", "Le Prophète lui-même", "Abou Bakr", "Son fils"], c: 1, exp: "Le Prophète a pris personnellement le titre de Naqib des Banou Najjar." }
                ]
            },
            {
                id: 59,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Outba ibn Ghazouane",
                arabicName: "عُتْبَة بن غَزْوَان",
                subtitle: "Le Fondateur de Bassora",
                intro: "Septième converti à l'Islam et archer émérite. Il conquit la région de l'Oubolla et fonda la ville de Bassora, dont il fut le premier gouverneur.",
                heroQuote: "Je me suis vu septième personne avec le Prophète, n'ayant pour nourriture que des feuilles d'arbres...",
                tags: ["Muhajirun", "Gouverneur", "Bassora", "Archer"],
                genealogy: "Outba ibn Ghazouane... Allié des Banou Nawfal. Surnommé Abou Abd-Allah.",
                physicalDesc: "Grand de taille.",
                timeline: [
                    { year: "Débuts", desc: "7ème converti. Immigre en Abyssinie puis à Médine." },
                    { year: "17 H", desc: "Fonde la ville de Bassora (Al-Basra) et construit sa mosquée en roseaux." },
                    { year: "Décès", desc: "Meurt sur la route du retour après avoir demandé à Oumar de le démettre de ses fonctions." }
                ],
                narratives: [
                    { id: 591, title: "L'Ascétisme du Gouverneur", content: "Gouverneur de Bassora, il prononça un sermon mémorable : « Je me suis vu avec le Prophète, septième de sept, mangeant des feuilles qui nous écorchaient la bouche... Je cherche protection auprès d'Allah d'être grand à mes propres yeux et petit aux yeux d'Allah ! ». Il refusa le luxe." },
                    { id: 592, title: "L'Invocation Fatale", content: "Oumar refusa sa démission et lui ordonna de retourner à Bassora. Outba invoqua : « Ô Allah, ne me renvoie pas là-bas ! ». Il tomba de sa monture sur le chemin et mourut." }
                ],
                hadiths: [
                    { text: "J'étais le septième de sept avec le Messager d'Allah...", narrator: "Outba ibn Ghazouane", source: "Sahih Muslim" }
                ],
                quizData: [
                    { q: "Quelle grande ville d'Irak a-t-il fondée ?", opts: ["Koufa", "Bassora (Al-Basra)", "Bagdad", "Mossoul"], c: 1, exp: "Il a choisi l'emplacement, tracé les plans et construit la première mosquée de Bassora." }
                ]
            },
            {
                id: 60,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Oukacha ibn Mihssane",
                arabicName: "عُكَاشَة بن مِحْصَن",
                subtitle: "Le Cavalier à l'Épée de Bois",
                intro: "L'un des premiers croyants et promis au Paradis sans jugement. À Badr, son épée se brisa et le Prophète lui donna un morceau de bois qui se transforma en épée d'acier.",
                heroQuote: "Tu fais partie d'eux (ceux qui entreront au Paradis sans jugement) !",
                tags: ["Badr", "Promis au Paradis", "Miracle"],
                genealogy: "Oukacha ibn Mihssane Al-Assadi. Allié des Banou Abd-Shams.",
                physicalDesc: "C'était l'un des plus beaux hommes de son temps.",
                timeline: [
                    { year: "2 H", desc: "Son épée casse à Badr. Le miracle de l'épée 'Al-Awn'." },
                    { year: "11 H (12 H également rapporté)", desc: "Tué à Bouzakha par Toulayha selon la version que Dhahabî juge la plus authentique ; une autre version donne 12 H." }
                ],
                narratives: [
                    { id: 601, title: "La palme devenue épée, d’après la notice", content: "La notice de Siyar raconte que l’épée d’Oukacha se brisa à Badr et que le Prophète (ﷺ) lui remit une palme ou un morceau de bois, devenu une épée entre ses mains. Ce passage ne mentionne pas le nom « Al-Awn » : Athar le présente comme un récit rapporté sans le compléter par un détail non trouvé dans le fascicule." },
                    { id: 602, title: "Les 70 000 Élus", content: "Quand le Prophète mentionna les 70 000 qui entreront au Paradis sans jugement, Oukacha se leva et dit : « Invoque Allah pour que j'en sois ! ». Le Prophète dit : « Tu en fais partie ». Un autre se leva, et le Prophète dit : « Oukacha t'a devancé »." }
                ],
                hadiths: [
                    { text: "Le meilleur d'entre nous est celui qui a tué Oukacha (car il s'est repenti) et Oukacha est meilleur que lui (car martyr).", narrator: "Oumar ibn Al-Khattab", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "En quoi s'est transformé le morceau de bois donné par le Prophète ?", opts: ["En serpent", "En épée d'acier", "En lance", "En bouclier"], c: 1, exp: "Le bois est devenu une épée redoutable nommée 'Al-Awn'." },
                    { q: "Quel privilège a-t-il obtenu ?", opts: ["Le Paradis sans jugement", "Le Califat", "La richesse", "La prophétie"], c: 0, exp: "Le Prophète lui a garanti qu'il faisait partie des 70 000 élus." }
                ]
            },
            {
                id: 61,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Thabit ibn Qays",
                arabicName: "ثابت بن قيس",
                subtitle: "L'Orateur du Prophète",
                intro: "L'orateur officiel des Ansars (Khatib Al-Ansar). Doté d'une voix puissante, il craignait qu'elle n'annule ses œuvres. Il mourut en martyr parfumé à Yamama.",
                heroQuote: "Je ne quitterai pas ce lieu avant d'être tué !",
                tags: ["Ansar", "Orateur", "Martyrs", "Yamama"],
                genealogy: "Thabit ibn Qays ibn Shammas Al-Khazraji.",
                physicalDesc: "Il avait une voix naturellement très forte et portante.",
                timeline: [
                    { year: "Débuts", desc: "Orateur des Ansars lors de l'arrivée du Prophète. Répondait aux poètes des délégations." },
                    { year: "Révélation", desc: "S'enferme chez lui de peur du verset sur l'élévation de la voix." },
                    { year: "12 H", desc: "S'enduit de parfum (Hanout) et de son linceul à Yamama et meurt en combattant." }
                ],
                narratives: [
                    { id: 611, title: "La Crainte du Verset", content: "À la révélation de 'N'élevez pas vos voix au-dessus du Prophète', Thabit s'enferma en pleurant, pensant être voué à l'Enfer à cause de sa voix forte. Le Prophète le fit appeler et lui dit : « Tu vis heureux, tu mourras martyr et tu entreras au Paradis »." },
                    { id: 612, title: "Le Testament du Rêve", content: "Après sa mort, il apparut en rêve à un homme pour lui dire où était son armure volée (sous une marmite). On la retrouva. Il demanda aussi qu'on règle ses dettes. Abou Bakr exécuta ce testament posthume, cas unique dans l'histoire." }
                ],
                hadiths: [
                    { text: "Quel excellent homme est Thabit ibn Qays !", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" }
                ],
                quizData: [
                    { q: "Quelle était la fonction officielle de Thabit ?", opts: ["Poète", "Orateur (Khatib)", "Scribe", "Garde"], c: 1, exp: "Il était la voix des Ansars, chargé de faire les discours officiels." },
                    { q: "Pourquoi s'est-il enfermé chez lui en pleurant ?", opts: ["Il avait péché", "Il craignait qu'un verset sur la voix forte ne le vise", "Il était malade", "Il avait peur de la guerre"], c: 1, exp: "Il pensait que sa voix naturellement forte annulait ses bonnes œuvres." }
                ]
            },
            {
                id: 62,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Toulayha ibn Khouwaylid",
                arabicName: "طُلَيْحَة بن خُوَيْلِد",
                subtitle: "Le Repenti Héroïque",
                intro: "Guerrier redoutable et chef de tribu. Il apostasia et prétendit être prophète, mais revint sincèrement à l'Islam pour devenir un héros des conquêtes perses.",
                heroQuote: "C'est un homme qu'Allah a honoré par mes mains (en faisant de lui un martyr)...",
                tags: ["Repenti", "Guerrier", "Perse"],
                genealogy: "Toulayha ibn Khouwaylid Al-Assadi. Chef des Banou Assad.",
                timeline: [
                    { year: "9 H", desc: "Conversion." },
                    { year: "11 H", desc: "Apostasie (Ridda). Prétend être prophète. Vaincu à Bouzakha par Khalid." },
                    { year: "Repentir", desc: "Se convertit de nouveau, fait le Hajj." },
                    { year: "21 H", desc: "Meurt en martyr à la bataille de Nahavand après des exploits guerriers." }
                ],
                narratives: [
                    { id: 621, title: "La Confrontation avec Omar", content: "Omar lui dit : « Je ne t'aimerai jamais, toi qui as tué le vertueux Oukacha ! ». Toulayha répondit : « C'est un homme qu'Allah a honoré par mes mains (martyre) et par qui Il ne m'a pas humilié (je ne suis pas mort mécréant, je me suis repenti) ». Omar accepta son Islam." },
                    { id: 622, title: "Le Guerrier qui vaut Mille Hommes", content: "Le Calife écrivit à ses généraux : « Consultez Toulayha pour la guerre, car c'est un stratège, mais ne lui confiez pas le commandement (à cause de son passé) »." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Quel grand péché a-t-il commis ?", opts: ["Vol", "Prétention à la prophétie (Faux prophète)", "Meurtre du Calife", "Fuite"], c: 1, exp: "Il fut l'un des faux prophètes avant de se repentir sincèrement." }
                ]
            },
            {
                id: 63,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saad ibn Ar-Rabi'",
                arabicName: "سعد بن الربيع",
                subtitle: "Le Riche Altruiste",
                intro: "L'un des chefs (Nuqaba) d'Aqaba. Il offrit la moitié de sa fortune à son frère en Dieu Abderrahman ibn 'Aouf. Mourant à Ouhoud, il envoya un dernier message poignant à son peuple.",
                heroQuote: "Dites à mon peuple : Vous n'avez aucune excuse devant Allah si le Prophète est touché tant qu'un œil bouge encore parmi vous !",
                tags: ["Ansar", "Martyrs", "Généreux"],
                genealogy: "Saad ibn Ar-Rabi' des Banou Al-Harith (Khazraj).",
                physicalDesc: "Un homme riche et généreux.",
                timeline: [
                    { year: "1 H", desc: "Fraternisation avec Abderrahman ibn 'Aouf. Il lui offre la moitié de ses biens." },
                    { year: "3 H", desc: "Meurt à Ouhoud, percé de 12 coups de lance." }
                ],
                narratives: [
                    { id: 631, title: "Le Partage Absolu", content: "Lors de la fraternisation, il dit à Abderrahman : « Je suis le plus riche des Ansars. Prends la moitié de mes biens. J'ai deux femmes, choisis celle qui te plaît, je la répudierai pour que tu l'épouses ». Abderrahman refusa poliment : « Qu'Allah bénisse tes biens, montre-moi le marché »." },
                    { id: 632, title: "Le Dernier Message", content: "À la fin d'Ouhoud, on le trouva agonisant. Il dit : « Dis au Prophète que je sens l'odeur du Paradis ! Et dis aux Ansars qu'Allah ne leur pardonnera pas si l'ennemi atteint le Prophète tant qu'il leur reste un souffle »." }
                ],
                hadiths: [
                    { text: "Allah va trancher dans cela ! (Révélation de l'héritage)", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Jabir" }
                ],
                quizData: [
                    { q: "Qu'a-t-il proposé à Abderrahman ibn 'Aouf ?", opts: ["De travailler pour lui", "La moitié de sa fortune et une épouse", "Un chameau", "Sa maison"], c: 1, exp: "Il a offert de partager absolument tout ce qu'il possédait." }
                ]
            },
            {
                id: 64,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mane ibn 'Adi",
                arabicName: "مَعْن بن عَدِي",
                subtitle: "Le Témoin Véridique",
                intro: "Compagnon lettré (il savait écrire) et allié des Ansar. Il pleura à la mort du Prophète, non par désespoir, mais par désir de prouver sa foi dans l'épreuve.",
                heroQuote: "Je n'aurais pas aimé mourir avant lui... pour attester de sa véracité après sa mort !",
                tags: ["Ansar", "Lettré", "Martyrs"],
                genealogy: "Mane ibn 'Adi Al-Balawi. Allié des Banou 'Amr ibn 'Aouf.",
                timeline: [
                    { year: "Saqifa", desc: "Accueille Abou Bakr et Oumar lors de la réunion de la Saqifa." },
                    { year: "12 H", desc: "Meurt en martyr à Al-Yamama." }
                ],
                narratives: [
                    { id: 641, title: "La Foi Inébranlable", content: "Quand les gens pleuraient la mort du Prophète en disant « Si seulement nous étions morts avant d'être éprouvés », Mane dit : « Moi je ne voudrais pas être mort avant. Je veux croire en lui mort comme j'ai cru en lui vivant »." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Où est-il mort ?", opts: ["Badr", "Ouhoud", "Al-Yamama", "Tabouk"], c: 2, exp: "Il est tombé lors des guerres contre l'apostasie." }
                ]
            },
            {
                id: 65,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Abd-Allah ibn Oubay",
                arabicName: "عبد الله بن عبد الله بن أبي",
                subtitle: "Le Fils Vertueux de l'Hypocrite",
                intro: "Fils d'Ibn Saloul (le chef des hypocrites), il était lui un croyant sincère et dévoué. Il demanda la chemise du Prophète pour l'enterrement de son père infidèle.",
                heroQuote: "Si tu le veux, ô Messager d'Allah, je te l'apporte (la tête de mon père) !",
                tags: ["Ansar", "Fils", "Ouhoud", "Yamama"],
                genealogy: "Fils d'Abd-Allah ibn Oubay ibn Saloul. Il s'appelait Al-Houbab, le Prophète le renomma Abd-Allah.",
                physicalDesc: "Il eut le nez coupé (ou une dent cassée) à Ouhoud et porta une prothèse en or.",
                timeline: [
                    { year: "3 H", desc: "Blessé au visage à Ouhoud." },
                    { year: "9 H", desc: "Son père meurt. Il obtient le Qamis du Prophète pour le linceul." },
                    { year: "12 H", desc: "Meurt en martyr à Al-Yamama." }
                ],
                narratives: [
                    { id: 651, title: "La Loyauté Suprême", content: "Quand son père tint des propos insultants (« Le plus fort chassera le plus vil de Médine »), Abd-Allah proposa au Prophète de tuer son propre père pour éviter la Fitna. Le Prophète refusa et ordonna la bienveillance." },
                    { id: 652, title: "La Chemise du Prophète", content: "Par amour filial, il demanda au Prophète sa chemise pour en faire le linceul de son père hypocrite, espérant alléger son châtiment. Le Prophète accepta, mais Allah révéla l'interdiction de prier pour les hypocrites." }
                ],
                hadiths: [
                    { text: "Ne prie jamais sur l'un d'entre eux qui meurt...", narrator: "Coran", source: "Sourate 9:84" }
                ],
                quizData: [
                    { q: "Qui était son père ?", opts: ["Abou Bakr", "Le chef des Hypocrites (Ibn Saloul)", "Abou Lahab", "Hamza"], c: 1, exp: "Il était le fils du grand hypocrite, mais était lui-même un grand compagnon." }
                ]
            },
            {
                id: 66,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Ikrima ibn Abou Jahl",
                arabicName: "عِكْرِمَة بن أبي جَهْل",
                subtitle: "Le Cavalier Repenti",
                intro: "Fils du pire ennemi de l'Islam (Abou Jahl). Il combattit l'Islam avec fureur avant de se convertir et de devenir un martyr héroïque, mourant criblé de blessures.",
                heroQuote: "Est-ce moi qui fuirais aujourd'hui ?!",
                tags: ["Makhzoumi", "Repenti", "Martyr"],
                genealogy: "Ikrima ibn Abou Jahl. Chef des Banou Makhzoum après son père.",
                timeline: [
                    { year: "Badr/Ouhoud", desc: "Combat contre les musulmans." },
                    { year: "8 H", desc: "S'enfuit au Yémen. Sa femme demande sa grâce. Il revient et se convertit." },
                    { year: "13/15 H", desc: "Meurt en martyr à Yarmouk (ou Ajnadayne), le corps portant plus de 70 blessures." }
                ],
                narratives: [
                    { id: 661, title: "L'Accueil", content: "Quand il entra pour se convertir, le Prophète se leva si vite qu'il en fit tomber son manteau, disant : « Bienvenue au cavalier émigré ! ». Il interdit qu'on l'appelle 'Fils d'Abou Jahl' pour ne pas le blesser." },
                    { id: 662, title: "Le Sacrifice", content: "À Yarmouk, il brisa le fourreau de son épée (signe de non-retour) et fonça dans la mêlée avec 400 hommes, jurant de ne pas reculer. Ils moururent tous." }
                ],
                hadiths: [
                    { text: "Accueillez Ikrima, mais n'insultez pas son père, car l'insulte au mort blesse le vivant.", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Qui était son père ?", opts: ["Abou Soufiane", "Abou Jahl", "Oumaya", "Walid"], c: 1, exp: "Son père était l'ennemi juré de l'Islam." },
                    { q: "Comment le Prophète l'a-t-il accueilli ?", opts: ["Froidement", "Avec joie (Bienvenue au cavalier)", "Il a refusé de le voir", "Il l'a fait prisonnier"], c: 1, exp: "Il l'a accueilli chaleureusement malgré son passé." }
                ]
            },
            {
                id: 67,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn 'Amr ibn Haram",
                arabicName: "عبد الله بن عَمْرو بن حَرَام",
                subtitle: "L'Interlocuteur d'Allah",
                intro: "Père de Jabir. Premier martyr d'Ouhoud. Allah lui parla directement, sans voile, après sa mort, pour exaucer son vœu de revenir mourir encore pour Lui.",
                heroQuote: "Ô Allah, renvoie-moi sur terre pour que je sois tué pour Toi une seconde fois !",
                tags: ["Ansar", "Martyrs", "Miracle"],
                genealogy: "Abd-Allah ibn 'Amr... Abou Jabir. Des Banou Salima.",
                timeline: [
                    { year: "Aqaba", desc: "Doyen (Naqib) lors du serment." },
                    { year: "3 H", desc: "Premier tué à Ouhoud. Mutilé par les païens." },
                    { year: "46 ans après", desc: "Corps retrouvé intact." }
                ],
                narratives: [
                    { id: 671, title: "La Parole sans Voile", content: "Le Prophète dit à Jabir : « Allah a parlé à ton père face à face (Kifah), sans voile ». Allah lui demanda son désir. Il dit : « Être tué encore pour Toi ». Allah répondit : « Le décret est qu'on ne revient pas ». Le verset 3:169 fut révélé sur lui." },
                    { id: 672, title: "L'Ombre des Anges", content: "Son corps ayant été mutilé, sa sœur pleura. Le Prophète dit : « Que vous pleuriez ou non, les anges n'ont cessé de l'ombrager de leurs ailes jusqu'à ce que vous le leviez »." }
                ],
                hadiths: [
                    { text: "Ne pensez pas que ceux qui sont tués dans le sentier d'Allah sont morts...", narrator: "Coran (3:169)", source: "Révélé à son sujet" }
                ],
                quizData: [
                    { q: "Quel miracle post-mortem lui est arrivé ?", opts: ["Il est ressuscité", "Allah lui a parlé directement", "Il a volé au Paradis", "Son corps a disparu"], c: 1, exp: "Allah lui a parlé sans interprète ni voile." }
                ]
            },
            {
                id: 68,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Yazid ibn Abou Soufiane",
                arabicName: "يزيد بن أبي سُفْيَان",
                subtitle: "Yazid le Bon",
                intro: "Frère aîné de Muawiya. L'un des quatre grands généraux de la conquête du Sham. Il était connu pour sa piété et sa justice.",
                heroQuote: "Le premier à changer ma Sunna sera un homme des Banou Oumaya appelé Yazid (Ce n'était pas lui).",
                tags: ["Omeyyade", "Gouverneur", "Sham"],
                genealogy: "Yazid ibn Abou Soufiane. Surnommé « Yazid Al-Khayr » (Le Bon).",
                timeline: [
                    { year: "8 H", desc: "Conversion à la Conquête." },
                    { year: "Guerres", desc: "Commandant d'un quart de l'armée du Sham." },
                    { year: "18 H", desc: "Gouverneur de Damas. Meurt de la peste d'Amwas." }
                ],
                narratives: [
                    { id: 681, title: "La Marche du Calife", content: "Quand il partit en guerre, Abou Bakr (à pied) accompagna Yazid (à cheval) pour lui donner ses recommandations. Yazid voulut descendre, mais Abou Bakr refusa, disant : « Je compte mes pas pour Allah »." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Quel était son surnom ?", opts: ["Yazid le Cruel", "Yazid le Bon (Al-Khayr)", "Yazid le Riche", "Yazid le Poète"], c: 1, exp: "Pour le distinguer des autres Yazid (comme Yazid ibn Muawiya)." }
                ]
            },
            {
                id: 69,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Al-'Ass ibn Ar-Rabi'",
                arabicName: "أبو العاص بن الربيع",
                subtitle: "Le Gendre Loyal",
                intro: "Époux de Zaynab (fille du Prophète). Il refusa de divorcer d'elle sous la pression de Quraysh. Commerçant intègre, il se convertit après avoir rendu chaque sou à ses associés païens.",
                heroQuote: "Il m'a parlé et a été véridique, il m'a fait une promesse et l'a tenue.",
                tags: ["Famille", "Loyauté", "Honnête"],
                genealogy: "Neveu de Khadija. Gendre du Prophète.",
                timeline: [
                    { year: "2 H", desc: "Capturé à Badr. Libéré contre la promesse de laisser partir Zaynab." },
                    { year: "6 H", desc: "Sa caravane est prise. Il se met sous la protection de Zaynab à Médine." },
                    { year: "Conversion", desc: "Retourne à la Mecque, rend l'argent, se convertit et revient à Médine." },
                    { year: "12 H", desc: "Décès." }
                ],
                narratives: [
                    { id: 691, title: "L'Honnêteté avant Tout", content: "Après avoir récupéré ses biens saisis par les musulmans, il retourna à la Mecque, rendit les dépôts à leurs propriétaires païens, puis dit : « Maintenant que je ne vous dois plus rien, j'atteste qu'il n'y a de dieu qu'Allah ». Il ne voulait pas qu'on dise qu'il s'était converti pour voler l'argent." }
                ],
                hadiths: [
                    { text: "Il m'a promis et a tenu parole.", narrator: "Le Prophète (ﷺ)", source: "Bukhari" }
                ],
                quizData: [
                    { q: "Pourquoi est-il retourné à la Mecque avant de se convertir ?", opts: ["Pour voir sa famille", "Pour rendre l'argent (Amana) à ses propriétaires", "Pour tuer quelqu'un", "Pour espionner"], c: 1, exp: "Il voulait que sa conversion soit libre de tout soupçon de vol." }
                ]
            },
            {
                id: 70,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Zaynab bint Mouhammad",
                arabicName: "زَيْنَب",
                subtitle: "La Fille Éprouvée",
                intro: "Fille aînée du Prophète. Elle vécut une séparation douloureuse avec son mari païen et fut blessée lors de son émigration (Hégire). Le Prophète dit : « C'est la meilleure de mes filles, elle a été blessée pour moi ».",
                heroQuote: "Elle est ma fille la meilleure pour ce qu'elle a subi pour moi.",
                tags: ["Ahl al-Bayt", "Fille du Prophète"],
                genealogy: "Fille aînée du Prophète et de Khadija.",
                timeline: [
                    { year: "2 H", desc: "Envoie le collier de sa mère pour rançonner son mari." },
                    { year: "Hégire", desc: "Attaquée par Habbar ibn Al-Aswad en quittant la Mecque, elle fait une fausse couche." },
                    { year: "7 H", desc: "Son mari la rejoint et se convertit." },
                    { year: "8 H", desc: "Décès en 8 H ; le passage consulté ne précise pas la cause de sa mort." }
                ],
                narratives: [
                    { id: 701, title: "Le Collier de Khadija", content: "Elle envoya le collier de Khadija pour payer la rançon de son mari. Le Prophète pleura en le voyant et demanda à ce qu'on libère le prisonnier et qu'on rende le collier." }
                ],
                hadiths: [
                    { text: "Lavez-la trois ou cinq fois... et mettez mon habit (Izar) sur elle.", narrator: "Le Prophète (ﷺ)", source: "Bukhari" }
                ],
                quizData: [
                    { q: "Quel objet a ému le Prophète lors de la rançon ?", opts: ["Une épée", "Le collier de Khadija", "Une bague", "Un manteau"], c: 1, exp: "Le collier lui rappelait sa défunte épouse bien-aimée." }
                ]
            },
            {
                id: 71,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Oumama bint Abou Al-'Ass",
                arabicName: "أُمَامَة",
                subtitle: "La Petite-Fille de la Prière",
                intro: "Fille de Zaynab. Célèbre parce que le Prophète la portait sur son cou pendant qu'il dirigeait la prière. Elle épousa Ali après la mort de Fatima.",
                tags: ["Ahl al-Bayt", "Enfance"],
                genealogy: "Petite-fille du Prophète.",
                timeline: [
                    { year: "Enfance", desc: "Le Prophète prie en la portant." },
                    { year: "Mariage", desc: "Épouse Ali ibn Abi Talib (testament de Fatima)." }
                ],
                narratives: [
                    { id: 711, title: "Sur le Dos du Prophète", content: "Le Prophète priait avec elle sur ses épaules. Quand il se prosternait, il la posait ; quand il se relevait, il la reprenait. Cela montre la miséricorde envers les enfants." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Qui a-t-elle épousé ?", opts: ["Othman", "Ali", "Hassan", "Zoubayr"], c: 1, exp: "Ali l'a épousée après le décès de Fatima." }
                ]
            },
            {
                id: 72,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Zayd Al-Ansari",
                arabicName: "أَبُو زَيْد",
                subtitle: "Le Collecteur du Coran",
                intro: "L’un des compagnons qui mémorisèrent intégralement le Coran du vivant du Prophète (ﷺ). Ibn Saad donne le nom Thabit ibn Zayd ; Aous et Mouadh sont également mentionnés, le premier nom étant préféré.",
                heroQuote: "Quatre ont rassemblé le Coran... dont Abou Zayd.",
                tags: ["Ansar", "Coran", "Hafiz"],
                genealogy: "Saad ibn Oubayd (selon l'avis le plus fort).",
                timeline: [
                    { year: "Badr", desc: "Participant." },
                    { year: "Coran", desc: "Mémorise l'intégralité du Livre." }
                ],
                narratives: [],
                hadiths: [
                    { text: "Prenez le Coran de quatre...", narrator: "Anas", source: "Bukhari" }
                ],
                quizData: [
                    { q: "Quelle est sa particularité ?", opts: ["Général", "A mémorisé tout le Coran du vivant du Prophète", "Poète", "Riche"], c: 1, exp: "Il fait partie du cercle très restreint des Hafiz complets de l'époque prophétique." }
                ]
            },
            {
                id: 73,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Abbad ibn Bichr",
                arabicName: "عباد بن بشر",
                subtitle: "L'Homme à la Lumière",
                intro: "Dévot dont le bâton s'illuminait la nuit. Il priait lorsqu'il fut frappé de trois flèches sans s'arrêter. Héros de Yamama.",
                heroQuote: "J'étais en train de lire une sourate et je n'ai pas voulu la couper...",
                tags: ["Ansar", "Lumière", "Prière"],
                genealogy: "'Abbad ibn Bichr Al-Achehali.",
                timeline: [
                    { year: "Miracle", desc: "Lumière qui émane de lui." },
                    { year: "Garde", desc: "Veille et reçoit 3 flèches en priant." },
                    { year: "12 H", desc: "Martyr à Yamama." }
                ],
                narratives: [
                    { id: 731, title: "La Prière sous les Flèches", content: "Montant la garde, il priait. Un ennemi lui tira une flèche, il l'arracha et continua. Une deuxième, il l'arracha. Une troisième... Il finit sa sourate avant de réveiller son compagnon. Il dit : « Si je n'avais pas craint pour le poste que le Prophète m'a confié, je serais mort avant de couper ma prière »." }
                ],
                hadiths: [
                    { text: "Si les gens sont les vêtements de dessus, les Ansars sont les vêtements de dessous (les intimes).", narrator: "Le Prophète", source: "Siyar" }
                ],
                quizData: [
                    { q: "Qu'a-t-il fait en recevant des flèches ?", opts: ["Il a crié", "Il a continué sa prière", "Il a fui", "Il est mort sur le coup"], c: 1, exp: "Il a arraché les flèches et continué sa récitation par amour du Coran." }
                ]
            },
            {
                id: 74,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Oussayd ibn Al-Houdayr",
                arabicName: "أسيد بن الحضير",
                subtitle: "L'Homme aux Anges",
                intro: "Chef des Aous. Sa récitation du Coran était si belle que les anges descendaient pour l'écouter sous forme de lumières.",
                heroQuote: "C'étaient des Anges venus écouter le Coran !",
                tags: ["Ansar", "Coran", "Anges"],
                genealogy: "Oussayd ibn Al-Houdayr.",
                timeline: [
                    { year: "Aqaba", desc: "L'un des 12 chefs." },
                    { year: "Miracle", desc: "Les anges l'écoutent lire la sourate Al-Baqara." },
                    { year: "20 H", desc: "Décès." }
                ],
                narratives: [
                    { id: 741, title: "La Descente des Anges", content: "Il lisait le Coran la nuit, son cheval s'agita. Il vit comme une nuée de lanternes au-dessus de lui. Le Prophète lui dit le lendemain : « C'étaient les Anges. Si tu avais continué, les gens les auraient vus au matin »." }
                ],
                hadiths: [
                    { text: "Quel excellent homme est Oussayd !", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" }
                ],
                quizData: [
                    { q: "Qu'est-ce qui est descendu l'écouter ?", opts: ["Des djinns", "Des anges", "Des oiseaux", "Le vent"], c: 1, exp: "Les anges, attirés par sa belle voix récitant le Coran." }
                ]
            },
            {
                id: 75,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "At-Toufayl ibn 'Amr",
                arabicName: "الطُّفَيْل بن عَمْرو",
                subtitle: "Dhou-Noor (L'Homme à la Lumière)",
                intro: "Chef de la tribu Daous. Il se convertit malgré les bouchons dans ses oreilles. Une lumière divine apparut sur son front (puis son fouet) pour l'aider à prêcher.",
                heroQuote: "Ô Allah, donne-lui un signe (Lumière) !",
                tags: ["Lumière", "Daous", "Miracle"],
                timeline: [
                    { year: "Mecque", desc: "Se bouche les oreilles, puis écoute et se convertit." },
                    { year: "Miracle", desc: "Lumière sur son fouet." },
                    { year: "12 H", desc: "Martyr à Yamama." }
                ],
                narratives: [
                    { id: 751, title: "Le Coton", content: "Quraysh lui fit peur de la 'magie' du Prophète. Il mit du coton dans ses oreilles. Puis il se dit 'Je suis un poète intelligent, je vais écouter'. Il écouta et se convertit immédiatement." },
                    { id: 752, title: "Le Signe Lumineux", content: "Il demanda un signe pour convertir son peuple. Une lumière apparut entre ses yeux. Il demanda à Allah de la déplacer. Elle se mit au bout de son fouet comme une lanterne." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Quel surnom a-t-il ?", opts: ["Le Poète", "Dhou-Noor (L'homme à la lumière)", "Le Sage", "Le Chef"], c: 1, exp: "À cause de la lumière miraculeuse sur son fouet." }
                ]
            },
			{
                id: 76,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Bilal ibn Rabah",
                arabicName: "بِلال بن رَبَاح",
                subtitle: "Le Muezzin du Prophète",
                intro: "L'affranchi d'Abou Bakr et le premier Muezzin de l'Islam. Esclave torturé pour sa foi qui répétait inlassablement « Ahad ! Ahad ! » (L'Unique). Le Prophète (ﷺ) entendit le bruit de ses pas devant lui au Paradis.",
                heroQuote: "Ahad ! Ahad ! (Il est Unique ! Il est Unique !)",
                tags: ["Muezzin", "Badr", "Endurance", "Paradis"],
                genealogy: "Bilal ibn Rabah. Sa mère s'appelait Hamama (une esclave).",
                physicalDesc: "Il avait la peau très noire, était grand, maigre, un peu voûté, avec des cheveux grisants et touffus. Son visage était fin.",
                timeline: [
                    { year: "Mecque", desc: "Torturé sous le soleil brûlant avec un rocher sur la poitrine. Acheté et affranchi par Abou Bakr." },
                    { year: "Hégire", desc: "Premier homme à appeler à la prière (Adhan) en Islam." },
                    { year: "8 H", desc: "Monte sur le toit de la Kaaba pour l'appel à la prière lors de la Conquête de la Mecque." },
                    { year: "Après 11 H", desc: "Cesse l'adhan après la mort du Prophète (trop d'émotion). Part au Sham pour le jihad." },
                    { year: "20 H", desc: "Meurt au Sham selon les récits. Une tradition situe son décès en 20 H à Darayya, près de Damas ; la notice rapporte plusieurs versions." }
                ],
                narratives: [
                    { id: 761, title: "L'Épreuve du Rocher", content: "Ses maîtres l'allongeaient sur le sable brûlant de la Mecque et posaient une grosse pierre sur sa poitrine pour qu'il renie Allah. Il ne cessait de répéter : « Ahad ! Ahad ! » (Il est l'Unique !)." },
                    { id: 762, title: "Les Pas au Paradis", content: "Le Prophète (ﷺ) lui demanda un matin : « Ô Bilal, par quelle œuvre m'as-tu devancé au Paradis ? J'ai entendu le bruit de tes sandales devant moi cette nuit ». Bilal répondit : « Je ne fais jamais mes ablutions sans prier deux unités de prière juste après »." },
                    { id: 763, title: "Le Dernier Adhan", content: "Lorsqu'Oumar vint au Sham (Jabiya), les musulmans demandèrent à Bilal de faire l'adhan pour eux. Quand il lança l'appel, l'armée entière fondit en larmes, se rappelant l'époque du Prophète. Jamais on ne vit autant d'hommes pleurer." }
                ],
                hadiths: [
                    { text: "Bilal est le maître (sayyid) des Abyssins !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" },
                    { text: "Le Paradis désire ardemment trois personnes : Ali, Ammar et Bilal.", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Anas" }
                ],
                quizData: [
                    { q: "Qui a racheté et affranchi Bilal ?", opts: ["Le Prophète", "Abou Bakr", "Oumar", "Othman"], c: 1, exp: "Abou Bakr l'a acheté (pour 5, 7 ou 9 onces d'or selon les versions) pour le sauver de la torture." },
                    { q: "Pourquoi a-t-il arrêté de faire l'Adhan ?", opts: ["Il a perdu sa voix", "Par tristesse après la mort du Prophète", "Oumar le lui a interdit", "Il est devenu sourd"], c: 1, exp: "Il ne supportait plus de prononcer le nom du Prophète dans l'appel sans le voir sortir pour la prière." }
                ]
            },
            {
                id: 77,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Ibnou Oum Maktoum",
                arabicName: "ابن أم مكتوم",
                subtitle: "Le Muezzin Aveugle",
                intro: "L'aveugle au sujet de qui la sourate 'Abasa' a été révélée. Muezzin du Prophète avec Bilal, il fut laissé gouverneur intérimaire de Médine à de nombreuses reprises.",
                heroQuote: "Confiez-moi l'étendard car je suis aveugle et je ne peux pas fuir !",
                tags: ["Muezzin", "Aveugle", "Coran", "Qadisiya"],
                genealogy: "'Amr (ou Abd-Allah) ibn Qays. Cousin de Khadija bint Khouwaylid. Sa mère s'appelait Atika (Oum Maktoum).",
                physicalDesc: "Aveugle de naissance. Allah a dit : « La seule récompense que je puisse lui offrir (pour sa cécité) est le Paradis ».",
                timeline: [
                    { year: "Mecque", desc: "Révélation de la Sourate 'Abasa' (Il s'est renfrogné) à son sujet." },
                    { year: "Hégire", desc: "Selon Ibn Saad, émigre à Médine peu après Badr ; la notice rapporte aussi d’autres versions." },
                    { year: "Gouvernance", desc: "Le Prophète le laisse plusieurs fois gouverneur de Médine lors de ses expéditions." },
                    { year: "15 H", desc: "Porte une bannière à {Al-Qadisiyya}. Al-Waqidi rapporte un retour puis un décès à Médine ; une autre version le fait mourir au combat." }
                ],
                narratives: [
                    { id: 771, title: "Le Reproche Divin", content: "Le Prophète (ﷺ) était occupé à prêcher aux notables de Quraysh quand Ibnou Oum Maktoum vint l'interroger avec insistance. Le Prophète se détourna légèrement. Allah révéla alors : « Il s'est renfrogné et s'est détourné parce que l'aveugle est venu à lui » (Coran 80:1-2)." },
                    { id: 772, title: "L'Exception du Coran", content: "Lorsque le verset sur le mérite des combattants fut révélé (« Ne sont pas égaux ceux qui restent assis... »), Ibnou Oum Maktoum se plaignit de son handicap. Le Prophète reçut alors immédiatement la révélation ajoutant l'exception : « sauf ceux qui ont une infirmité »." },
                    { id: 773, title: "À Al-Qadisiyya, une bannière et deux récits", content: "Des témoignages mentionnent Ibn Oum Maktoum porteur de la bannière à Al-Qadisiyya. Al-Waqidi affirme qu'il revint ensuite à Médine, où il mourut ; Dhahabî mentionne aussi une tradition le faisant mourir lors de la bataille. Sa mort sur le champ de bataille ne peut donc être donnée comme certaine." }
                ],
                hadiths: [
                    { text: "Mangez et buvez jusqu'à ce que Ibnou Oum Maktoum fasse l'appel (Adhan) !", narrator: "Le Prophète (ﷺ)", source: "Bukhari / Muslim" }
                ],
                quizData: [
                    { q: "Quelle sourate a été révélée à son sujet ?", opts: ["Al-Fatiha", "Abasa (Il s'est renfrogné)", "Yasin", "Al-Baqara"], c: 1, exp: "La sourate 80 a été révélée pour reprocher doucement au Prophète de s'être détourné de lui." },
                    { q: "Quel rôle occupait-il souvent à Médine en l'absence du Prophète ?", opts: ["Juge", "Gouverneur intérimaire (Imam)", "Trésorier", "Général"], c: 1, exp: "Le Prophète le désignait pour diriger la prière et gérer les affaires courantes de Médine lors de ses expéditions." }
                ]
            },
            {
                id: 78,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khalid ibn Al-Walid",
                arabicName: "خالد بن الوليد",
                subtitle: "L'Épée d'Allah (Sayfullah)",
                intro: "Commandant militaire surnommé « l'Épée d'Allah » dans les traditions. Il brisa neuf épées à Mouta et fut l'architecte des conquêtes de l'Irak et du Sham.",
                heroQuote: "Je meurs dans mon lit comme meurt un vieux chameau... Que les yeux des lâches ne trouvent jamais le sommeil !",
                tags: ["Commandant", "Stratège", "Mecquois", "Invaincu"],
                genealogy: "Khalid ibn Al-Walid ibn Al-Moughira, du clan des Banou Makhzoum. Neveu de Maymouna (Mère des croyants).",
                physicalDesc: "Un guerrier imposant. Son corps était couvert de cicatrices; pas un empan de sa peau n'était exempt d'un coup de lance ou d'épée.",
                timeline: [
                    { year: "8 H", desc: "Conversion à l'Islam (Safar). Sauve l'armée musulmane à Mouta (Joumada)." },
                    { year: "8 H", desc: "Participe à la Conquête de la Mecque et détruit l'idole Al-Ouzza." },
                    { year: "12 H", desc: "Écrase la rébellion de Moussaylima à Al-Yamama (Jardin de la Mort)." },
                    { year: "13 H", desc: "Traverse le désert périlleux pour rejoindre le front du Sham et conquiert Damas." },
                    { year: "21 H", desc: "Décès à Homs (Syrie) dans son lit, à son grand regret." }
                ],
                narratives: [
                    { id: 781, title: "Les Neuf Épées", content: "Lors de la bataille de Mouta, Khalid raconta : « Neuf épées se sont brisées dans ma main le jour de Mouta. Il ne m'est resté qu'une large lame yéménite avec laquelle j'ai continué le combat »." },
                    { id: 782, title: "La Calotte Bénie", content: "À la bataille de Yarmouk, Khalid perdit sa calotte (couvre-chef) et ordonna avec insistance qu'on la retrouve. Quand on la lui rapporta, elle était vieille et usée. Il expliqua : « Le Prophète a rasé sa tête lors d'un pèlerinage et j'ai récupéré ses cheveux de devant que j'ai cousus dans cette calotte. Je ne l'ai jamais portée dans une bataille sans que la victoire ne me soit accordée ! »." },
                    { id: 783, title: "Une boisson empoisonnée : récit historique", content: "Deux récits rapportent qu'une préparation décrite comme empoisonnée fut présentée à Khalid, qui la but après avoir prononcé « Bismillah ». Dhahabî y voit un prodige. Athar cite cette narration sans en faire une preuve médicale d'innocuité ni une pratique à reproduire." }
                ],
                hadiths: [
                    { text: "Khalid est une épée parmi les épées d'Allah qu'Il a dégainée contre les polythéistes !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam / Bukhari" },
                    { text: "Ne vous en prenez pas à Khalid... (Défense de son honneur)", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel objet précieux Khalid gardait-il dans sa calotte ?", opts: ["Un verset du Coran", "Des cheveux du Prophète", "Une pierre de la Kaaba", "De l'or"], c: 1, exp: "Il avait cousu des mèches de cheveux du Prophète dans sa coiffe, source de baraka pour ses victoires." },
                    { q: "Comment est-il mort ?", opts: ["Tué à Yarmouk", "Empoisonné", "Dans son lit", "Noyé"], c: 2, exp: "Malgré sa vie de guerrier, il est mort de maladie dans son lit, ce qui était son plus grand chagrin." }
                ]
            },
{
                id: 79,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Safoine ibn Bayda",
                arabicName: "صَفْوَان ابن بَيْضَاء",
                subtitle: "Le Compagnon de l'Exode",
                intro: "L'un des premiers croyants. Sa mère, Bayda (La Blanche), lui donna son surnom. Il participa aux grandes batailles aux côtés du Messager d'Allah.",
                heroQuote: "Il compte parmi ceux qui accomplirent l'Exode et participèrent à Badr.",
                tags: ["Badriyun", "Mouhajir", "Discret"],
                genealogy: "Safoine ibn Wahb ibn Rabi'a... Al-Fihri (Qourashite). Sa mère est Daad bint Jahdam (surnommée Bayda). Frère de Souhayl.",
                physicalDesc: "Un compagnon discret mais présent.",
                timeline: [
                    { year: "Mecque", desc: "Conversion précoce." },
                    { year: "2 H", desc: "Participation à la bataille de {Badr}." },
                    { year: "38 H", desc: "Deux versions sont rapportées : mort à Badr ou survie jusqu'au Ramadan 38 H. La notice ne tranche pas." }
                ],
                narratives: [
                    { id: 791, title: "Deux versions de son décès", content: "Al-Waqidi transmet une version selon laquelle Safoine mourut à Badr, tué par Touayma ibn ‘Adi. Il rapporte aussi une tradition le faisant survivre aux combats ultérieurs et mourir au Ramadan 38 H. Aucun avis prépondérant n'est expressément fixé dans ce passage." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Quel est le vrai nom de sa mère 'Bayda' ?", opts: ["Daad", "Fatima", "Aïsha", "Khadija"], c: 0, exp: "Sa mère s'appelait Daad la Fihriya, mais était surnommée Bayda (La Blanche)." }
                ]
            },
            {
                id: 80,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Souhayl ibn Bayda",
                arabicName: "سُهَيْل ابن بَيْضَاء",
                subtitle: "Le Voyageur d'Abyssinie",
                intro: "Frère de Safoine. Il a l'honneur d'avoir accompli les deux émigrations (Abyssinie et Médine) et d'avoir été prié dans la mosquée par le Prophète lui-même.",
                heroQuote: "Le Prophète a prié sur lui à l'intérieur de la mosquée.",
                tags: ["Badriyun", "Mouhajir", "Abyssinie"],
                genealogy: "Souhayl ibn Wahb (Ibn Bayda). Surnommé Abou Moussa.",
                timeline: [
                    { year: "Abyssinie", desc: "Participe aux deux exodes vers l'Abyssinie." },
                    { year: "2 H", desc: "Combat à Badr à l'âge de 34 ans." },
                    { year: "9 H", desc: "Décède à Médine au retour de l'expédition de Tabouk." }
                ],
                narratives: [
                    { id: 801, title: "La Prière dans la Mosquée", content: "Fait rare : à sa mort, le Prophète (ﷺ) ordonna qu'on apporte son corps à l'intérieur de la mosquée pour prier sur lui, alors que d'habitude la prière mortuaire se faisait à l'extérieur (au Mousalla). Cela montre son rang élevé." },
                    { id: 802, title: "Les deux migrations en Abyssinie", content: "La notice rapporte, d’après Ibn Ishaq et Al-Waqidi, que Souhayl prit part aux deux migrations vers l’Abyssinie. Elle signale qu'avec son frère Safoine il fut hébergé chez Koulthoum ibn Al-Hidm après leur départ de La Mecque. Elle ne décrit aucun épisode de protection rapprochée à Tabouk." }
                ],
                hadiths: [
                    { text: "Par Allah, le Prophète n'a prié sur les deux fils de Bayda (Souhayl et son frère) que dans la mosquée !", narrator: "Aïsha", source: "Sahih Muslim" }
                ],
                quizData: [
                    { q: "Où le Prophète a-t-il prié sur Souhayl ibn Bayda ?", opts: ["Au cimetière", "Dans la mosquée", "Chez lui", "À la Mecque"], c: 1, exp: "Fait exceptionnel rapporté par Aïsha : la prière funéraire eut lieu dans la mosquée du Prophète." }
                ]
            },
            {
                id: 81,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Miqdad ibn 'Amr",
                arabicName: "المِقْدَاد بن عَمْرو",
                subtitle: "Le Premier Cavalier de l'Islam",
                intro: "L'un des sept premiers à avoir déclaré son Islam. Sa présence à cheval à Badr est tenue pour établie par Dhahabî, qui relève une divergence concernant Zoubayr. Connu pour son courage et sa franchise.",
                heroQuote: "Nous ne te dirons pas comme les fils d'Israël : Va, toi et ton Seigneur, et combattez !",
                tags: ["Badriyun", "Mouhajir", "Cavalier", "Premier"],
                genealogy: "Al-Miqdad ibn 'Amr. Adopté par Al-Aswad à la période préislamique (d'où le nom Al-Miqdad ibn Al-Aswad). Il reprit son vrai nom après l'interdiction de l'adoption.",
                physicalDesc: "Il était grand, très brun, avait le ventre rond, une tête touffue, de larges yeux noirs, des sourcils joints et une barbe qu'il teignait au henné. Il avait une voix tonitruante.",
                timeline: [
                    { year: "Débuts", desc: "L'un des 7 premiers à afficher son Islam." },
                    { year: "2 H", desc: "Combat à cheval à Badr ; la présence de Zoubayr à cheval fait l’objet d’une divergence." },
                    { year: "Conquêtes", desc: "Participe à la conquête de l'Égypte et du Sham." },
                    { year: "33 H", desc: "Décès à Al-Jourf à 70 ans. Outhman prie sur lui." }
                ],
                narratives: [
                    { id: 811, title: "Le Discours de Badr", content: "Avant Badr, quand le Prophète consulta ses compagnons, Al-Miqdad se leva et dit : « Ô Messager d'Allah, nous ne te dirons pas ce que les Juifs ont dit à Moïse : 'Va toi et ton Seigneur et combattez'. Mais nous disons : Va, toi et ton Seigneur, et nous combattrons avec vous, à droite, à gauche, devant et derrière ! ». Le visage du Prophète s'illumina." },
                    { id: 812, title: "L'Expérience du Pouvoir", content: "Le Prophète le nomma émir d'une expédition. À son retour, il demanda : « Comment as-tu trouvé le commandement ? ». Al-Miqdad répondit : « J'avais l'impression que les gens étaient mes serviteurs... Par celui qui t'a envoyé, je ne commanderai plus jamais deux hommes ! ». Il craignait l'orgueil." },
                    { id: 813, title: "Décès : une tradition sur l’huile de ricin", content: "Après avoir mentionné sa mort en 33 H, le fascicule rapporte seulement qu’Al-Miqdad serait décédé après avoir ingéré de l’huile de ricin. L'intervention chirurgicale et le retrait de graisse auparavant décrits ne figurent pas dans la notice étudiée." }
                ],
                hadiths: [
                    { text: "Allah m'a ordonné d'aimer quatre personnes et m'a informé qu'Il les aime : Ali, Al-Miqdad, Salmane et Abou Dharr.", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi / Ibn Majah" },
                    { text: "Le bienheureux est celui qui a été épargné des troubles (Fitna).", narrator: "Al-Miqdad", source: "Sounan Abi Dawud" }
                ],
                quizData: [
                    { q: "Quelle était la particularité d'Al-Miqdad à Badr ?", opts: ["Il portait une armure d'or", "Il était le seul cavalier à cheval", "Il portait l'étendard", "Il a tué le chef ennemi"], c: 1, exp: "Il était le seul combattant musulman monté sur un cheval ce jour-là (les autres étaient à pied ou à chameau)." },
                    { q: "Pourquoi a-t-il refusé de commander à nouveau ?", opts: ["Il a échoué", "Il a eu peur de l'orgueil", "Il a été blessé", "Le Prophète le lui a interdit"], c: 1, exp: "Il a senti que le pouvoir corrompait son cœur et a préféré rester simple soldat." }
                ]
            },
            {
                id: 82,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Oubay ibn Kaab",
                arabicName: "أُبَيّ بن كَعْبٍ",
                subtitle: "Le Maître des Récitateurs",
                intro: "Surnommé « Sayyid Al-Qurra » (Le Maître des Lecteurs). Ansarite du clan Khazraj, il fut l'un des scribes de la révélation. Le Prophète reçut l'ordre divin de réciter le Coran spécifiquement à Oubay.",
                heroQuote: "Allah a-t-il cité mon nom ?!",
                tags: ["Ansar", "Coran", "Badriyun", "Scribe"],
                genealogy: "Oubay ibn Kaab... des Banou Najjar. Surnommé Abou Al-Moundhir et Abou At-Toufayl.",
                physicalDesc: "Il était de taille moyenne, avait les cheveux et la barbe blancs comme du coton (il ne se teignait pas).",
                timeline: [
                    { year: "Aqaba", desc: "Présent au second serment d'Al-Aqaba." },
                    { year: "Vie du Prophète", desc: "Mémorise le Coran et le récite auprès du Prophète. Son rôle supposé dans la compilation sous Outhman est contesté par Dhahabî." },
                    { year: "Califat d'Omar", desc: "Désigné pour diriger les prières de Tarawih (Ramadan) pour les gens." },
                    { year: "22 H (ou 30 H)", desc: "Plusieurs dates sont rapportées (19, 22, 30 ou 32 H). Dhahabî préfère un décès sous Oumar, vers 22 H." }
                ],
                narratives: [
                    { id: 821, title: "L'Ordre Divin", content: "Le Prophète (ﷺ) dit à Oubay : « Allah m'a ordonné de réciter le Coran sur toi ! ». Oubay, bouleversé, demanda : « Allah a-t-il cité mon nom (auprès de toi) ? ». Le Prophète répondit « Oui, Il t'a nommé ». Oubay fondit en larmes de joie et d'émotion." },
                    { id: 822, title: "Le Plus Grand Verset", content: "Le Prophète demanda à Oubay quel était le plus grand verset du Livre d'Allah. Oubay répondit : « Allahou La ilaha illa Houwa Al-Hayy Al-Qayyoum » (Ayat al-Kursi). Le Prophète lui tapa la poitrine en disant : « Félicitations pour ta science, ô Abou Al-Moundhir ! »." },
                    { id: 823, title: "Le Tronc du Palmier", content: "Avant d'avoir une chaire (minbar), le Prophète s'appuyait sur un tronc de palmier. Quand le minbar fut construit, le tronc se mit à gémir comme un enfant. Oubay récupéra ce tronc chez lui jusqu'à ce qu'il se désagrège." }
                ],
                hadiths: [
                    { text: "Oubay est, de toute ma communauté, celui qui connaît le mieux la lecture du Coran (Aqra-ouhoum) !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam al-Nubula" },
                    { text: "La prière de l'homme en groupe est supérieure de 20 et quelques degrés...", narrator: "Oubay ibn Kaab", source: "Recueils de Hadiths" }
                ],
                quizData: [
                    { q: "Quelle distinction unique Oubay a-t-il reçue ?", opts: ["Le Prophète a prié derrière lui", "Allah a ordonné au Prophète de lui réciter le Coran", "Il a vu Jibril", "Il est monté au ciel"], c: 1, exp: "C'est le seul compagnon à qui le Prophète a récité le Coran sur ordre divin direct mentionnant son nom." },
                    { q: "Quel titre Omar a-t-il donné à Oubay à sa mort ?", opts: ["L'Épée de l'Islam", "Le Maître (Sayyid) des musulmans", "Le Sage de la Oumma", "La Voix du Ciel"], c: 1, exp: "Omar a dit : « Aujourd'hui est mort le Sayyid (Maître/Prince) des musulmans »." }
                ]
            },
            {
                id: 83,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "An-Nou'mane ibn Mouqarine",
                arabicName: "النُّعْمَانِ بن مُقَرِّن",
                subtitle: "Le Conquérant de Nahavand",
                intro: "Compagnon de Mouzayna et commandant à Nahavand, où il mourut. La notice mentionne plusieurs de ses frères, mais ne permet pas d'affirmer que dix frères se convertirent ensemble.",
                heroQuote: "Ô Allah, octroie à An-Nou'mane une mort qui puisse donner la victoire aux musulmans !",
                tags: ["Commandant", "Martyr", "Perse", "Nahavand"],
                genealogy: "An-Nou'mane ibn Mouqarine Al-Mouzani. Il avait plusieurs frères compagnons (les fils de Mouqarine : Souwayd, Sinane, etc.).",
                timeline: [
                    { year: "5 H", desc: "Première bataille (Le Fossé)." },
                    { year: "Conquête", desc: "Porte l'étendard des Mouzayna lors de la prise de La Mecque." },
                    { year: "21 H", desc: "Commandant à {Nahavand}. Blessé au combat, il meurt après avoir appris la victoire ; la chute de monture concerne le général adverse." }
                ],
                narratives: [
                    { id: 831, title: "L'invocation et la nouvelle de Nahavand", content: "Un récit attribué notamment à Maaqil ibn Yassar rapporte qu'An-Nou‘mane pria pour que sa mort accompagne une victoire des musulmans. Blessé, il apprit de Maaqil que les musulmans avaient triomphé, demanda qu’on en informe ‘Oumar, puis mourut. La chute de monture dans ce récit concerne le chef perse et non An-Nou‘mane." },
                    { id: 832, title: "L'Humilité", content: "Malgré son rang de général, il restait simple. Il demanda à ses soldats : « Si je secoue mon étendard une fois, préparez-vous. Deux fois, tenez-vous prêts. Trois fois, attaquez ! ». Il attendit le déclin du soleil, moment préféré du Prophète, pour lancer l'assaut." }
                ],
                hadiths: [
                    { text: "An-Nou'mane ibn Mouqarine fait partie des meilleurs des Mouzayna.", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "De quelle grande bataille fut-il le héros et le martyr ?", opts: ["Yarmouk", "Qadisiyya", "Nahavand", "Siffine"], c: 2, exp: "Il commandait l'armée à Nahavand, la « Victoire des Victoires » contre la Perse." },
                    { q: "Quelle particularité avait sa famille (les Banou Mouqarine) ?", opts: ["Ils étaient tous poètes", "Ils se sont convertis tous ensemble (10 frères)", "Ils étaient forgerons", "Ils ont fui"], c: 1, exp: "C'est la première maison dont 10 frères se sont convertis et ont émigré ensemble." }
                ]
            },
{
                id: 84,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Ammar ibn Yassir",
                arabicName: "عَمَّار بن ياسر",
                subtitle: "L'Homme de la Saine Nature",
                intro: "Fils des premiers martyrs de l'Islam. Torturé pour sa foi, il est le baromètre de la vérité lors des troubles (Fitna) : le Prophète prédit qu'il serait tué par « le groupe rebelle ».",
                heroQuote: "Bienvenue au Bon et au Pur !",
                tags: ["Ahl al-Bayt", "Martyr", "Siffine", "Architecte"],
                genealogy: "Ammar ibn Yassir... du clan Madhij (Yémen), allié des Banou Makhzoum. Sa mère est Soumaya.",
                physicalDesc: "Il était très grand de taille, avait les yeux noirs teintés de bleu (Ash'hal), les épaules larges. Il était chauve sur le devant du crâne. À 93 ans, il combattait encore.",
                timeline: [
                    { year: "Débuts", desc: "L'un des 7 premiers musulmans. Voit ses parents (Yassir et Soumaya) torturés à mort." },
                    { year: "1 H", desc: "Participe à la construction de la mosquée de Qouba et de Médine (le Prophète essuie la poussière de son visage)." },
                    { year: "37 H", desc: "Meurt martyr à la bataille de Siffine (à 91 ou 93 ans) dans le camp d'Ali, tué par les troupes de Mouawiya." }
                ],
                narratives: [
                    { id: 841, title: "La Contrainte du Cœur", content: "Sous la torture des polythéistes (tête maintenue sous l'eau), il fut forcé d'insulter le Prophète et de louer les idoles. En pleurs, il avoua tout au Prophète (ﷺ). Ce dernier lui demanda : « Comment trouves-tu ton cœur ? ». Ammar répondit : « Apaisé par la foi ! ». Le Prophète dit : « S'ils recommencent, refais de même ! » (Révélation de 16:106)." },
                    { id: 842, title: "La Prédiction de Siffine", content: "Lors de la construction de la mosquée, alors qu'Ammar portait deux briques au lieu d'une, le Prophète (ﷺ) dit : « Malheur à toi ô fils de Soumaya ! Le groupe rebelle (injuste) te tuera ». À Siffine, sa mort confirma la légitimité du camp d'Ali." },
                    { id: 843, title: "La Dernière Gorgée", content: "Juste avant de mourir à Siffine, assoiffé, il demanda à boire. On lui apporta du lait coupé avec de l'eau. Il sourit et dit : « Le Messager d'Allah m'avait prédit que ma dernière subsistance dans ce monde serait une gorgée de lait »." }
                ],
                hadiths: [
                    { text: "La foi de Ammar pénètre jusqu'à la moelle de ses os !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam al-Nubula" },
                    { text: "Celui qui est hostile à Ammar, Allah lui sera hostile !", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Khalid ibn Walid" }
                ],
                quizData: [
                    { q: "Quel signe prophétique annonçait sa mort ?", opts: ["Il mourrait à la Mecque", "Il serait tué par le parti rebelle/injuste", "Il mourrait en prière", "Il vivrait 100 ans"], c: 1, exp: "Le hadith 'Taqtuluka al-fi'a al-baghiya' est célèbre et désignait ses tueurs comme étant dans l'erreur." },
                    { q: "Quelle fut sa dernière boisson ?", opts: ["De l'eau de Zamzam", "Du miel", "Du lait (Midhqa)", "Du vinaigre"], c: 2, exp: "Il a bu du lait mélangé à de l'eau juste avant de rendre l'âme, réalisant la prophétie." }
                ]
            },
            {
                id: 85,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Le Négus (Assehama)",
                arabicName: "النجاشي",
                subtitle: "Le Roi Juste d'Abyssinie",
                intro: "Roi chrétien d'Éthiopie qui accueillit et protégea les musulmans persécutés. Il embrassa l'Islam en secret. Le Prophète (ﷺ) pria sur lui la prière de l'absent à sa mort.",
                heroQuote: "Par Allah, ces gens sont libres sur ma terre, même contre des montagnes d'or !",
                tags: ["Roi", "Juste", "Abyssinie"],
                genealogy: "Assehama ibn Abjar. Roi d'Abyssinie (Al-Habasha). Son nom signifie 'Don' ou 'Cadeau' en amharique.",
                timeline: [
                    { year: "5 H", desc: "Accueille Jafar et les émigrés musulmans fuyant la Mecque." },
                    { year: "Dialogue", desc: "Refuse de livrer les musulmans à 'Amr ibn Al-'Ass après avoir entendu la sourate Maryam." },
                    { year: "7 H", desc: "Célèbre le mariage du Prophète avec Oum Habiba (par procuration) et paye sa dot." },
                    { year: "9 H", desc: "Décès. Le Prophète annonce sa mort à Médine le jour même et prie sur lui (Salat Al-Ghaib)." }
                ],
                narratives: [
                    { id: 851, title: "La Ligne sur le Sol", content: "Après avoir entendu Jafar décrire Jésus (Issa) selon le Coran, le Négus ramassa une brindille au sol et dit : « Par Allah, Jésus ne dépasse pas ce que tu viens de dire de l'épaisseur de cette brindille ». Il confirma ainsi la vérité de l'Islam face à ses prêtres." },
                    { id: 852, title: "Une lumière sur la tombe, selon un récit", content: "La notice attribue à Oum Salama une parole selon laquelle on racontait qu’une lumière éclairait la tombe du Négus. Cette tradition n'est pas une observation historiquement vérifiée ni une preuve d'un phénomène lumineux permanent." },
                    { id: 853, title: "Le Parchemin Secret", content: "Lors d'une révolte de son peuple l'accusant d'avoir quitté le christianisme, il écrivit sa profession de foi musulmane sur un papier caché contre sa poitrine. Interrogé, il dit « Je crois en ceci » (mettant la main sur sa poitrine, visant le papier). Le peuple crut qu'il parlait du christianisme et se calma." }
                ],
                hadiths: [
                    { text: "Votre frère en Abyssinie est décédé, levez-vous et priez sur lui !", narrator: "Le Prophète (ﷺ)", source: "Bukhari / Muslim" },
                    { text: "Laissez les Abyssins tant qu'ils vous laissent tranquilles.", narrator: "Le Prophète (ﷺ)", source: "Abou Dawud" }
                ],
                quizData: [
                    { q: "Quelle prière unique le Prophète a-t-il faite pour le Négus ?", opts: ["Prière de l'éclipse", "Prière de l'absent (Salat al-Ghaib)", "Prière de la peur", "Prière de la pluie"], c: 1, exp: "C'est le seul cas avéré où le Prophète a prié sur un défunt à distance, car personne n'avait prié sur lui." },
                    { q: "Quel cadeau a-t-il fait à Oum Habiba ?", opts: ["Un palais", "Sa dot de mariage (400 dinars)", "Une armée", "Des terres"], c: 1, exp: "Il a payé la dot au nom du Prophète pour son mariage avec Oum Habiba qui était réfugiée chez lui." }
                ]
            },
            {
                id: 86,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mouadh ibn Jabal",
                arabicName: "مُعَاذ بن جَبَل",
                subtitle: "Le Savant du Halal et du Haram",
                intro: "Mouadh ibn Jabal est présenté comme une grande figure de la science religieuse, notamment concernant le licite et l’illicite. Des traditions évoquent son rang parmi les savants au Jour du Jugement, mais certaines chaînes sont discutées.",
                heroQuote: "Le Jour de la Résurrection, Mouadh devancera tous les savants d'un jet de pierre !",
                tags: ["Ansar", "Savant", "Juge", "Aqaba"],
                genealogy: "Mouadh ibn Jabal... des Banou Jousham (Khazraj). Surnommé Abou Abderrahman.",
                physicalDesc: "Un homme grand, à la peau blanche, aux grands yeux noirs vifs (Kahil), aux dents blanches et aux cheveux frisés. Il avait l'un des plus beaux visages.",
                timeline: [
                    { year: "18 ans", desc: "Assiste adolescent au serment d’Al-Aqaba ; la notice ne précise pas ici qu'il était le plus jeune." },
                    { year: "2 H", desc: "Participe à la bataille de Badr à l'âge de 20 ou 21 ans." },
                    { year: "8 H", desc: "À la conquête de La Mecque, le Prophète le désigne pour enseigner le Coran aux Mecquois." },
                    { year: "9 H", desc: "Envoyé au Yémen comme juge (Qadi) et enseignant. Le Prophète l'accompagne à pied pour lui faire ses adieux." },
                    { year: "17-18 H", desc: "Meurt au Sham durant la peste d’Emmaüs. Plusieurs versions situent son décès en 17 ou 18 H et lui attribuent des âges différents." }
                ],
                narratives: [
                    { id: 861, title: "L'Adieu Déchirant", content: "Lorsque le Prophète (ﷺ) envoya Mouadh au Yémen, il marcha à côté de sa monture pour lui donner ses dernières recommandations. Il lui dit : « Ô Mouadh, c'est très certainement la dernière fois que nous nous rencontrons. À ton retour, tu ne trouveras sans doute que ma mosquée et ma tombe ». Mouadh fondit en larmes, le cœur brisé par cette séparation." },
                    { id: 862, title: "L'Amour du Prophète", content: "Un jour, le Prophète (ﷺ) prit la main de Mouadh et lui dit : « Ô Mouadh, par Allah, je t'aime ! ». Puis il lui enseigna l'invocation à dire après chaque prière : « Ô Seigneur, aide-moi à T'évoquer, à Te remercier et à T'adorer de la meilleure des manières »." },
                    { id: 863, title: "La Peste d'Amwas", content: "Lorsque la peste frappa le Sham, Mouadh ne la fuit pas. Il perdit ses deux épouses et son fils Abderrahman. Atteint à son tour à la main (ou à l'index), il embrassait l'infection en disant : « Ce bubon m'est plus cher que tout l'or du monde ». Il mourut en disant : « Ô Allah, Tu sais que je T'aimais »." }
                ],
                hadiths: [
                    { text: "Le plus savant de ma communauté concernant le licite et l'illicite est Mouadh ibn Jabal.", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Anas" },
                    { text: "Mouadh ibn Jabal est un Imam (guide) pour les savants le Jour de la Résurrection.", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quelle position occupera Mouadh le Jour du Jugement ?", opts: ["Porte-étendard", "À la tête des savants (d'un jet de pierre)", "Scribe", "Gardien du Paradis"], c: 1, exp: "Le Prophète a dit qu'il devancera tous les savants d'un degré ou d'un jet de pierre (Ratwa)." },
                    { q: "À quel âge est-il mort ?", opts: ["60 ans", "33 ans", "80 ans", "20 ans"], c: 1, exp: "Il est mort très jeune, à 33 ou 34 ans (l'âge de Issa/Jésus), malgré son immense science." }
                ]
            },
            {
                id: 87,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Massoud",
                arabicName: "عبد الله بن مَسْعُود",
                subtitle: "L'Érudit de la Communauté",
                intro: "Surnommé « Ibn Oum Abd ». Il fut le premier à réciter le Coran à voix haute à La Mecque. Petit de corps mais immense par la science, ses jambes pèseront plus lourd qu'Ouhoud dans la balance. Il portait les sandales du Prophète.",
                heroQuote: "Quiconque veut lire le Coran, frais tel qu'il a été révélé, qu'il le lise à la manière d'Ibn Oum Abd !",
                tags: ["Savant", "Coran", "Badriyun", "Muhajirun"],
                genealogy: "Abd-Allah ibn Massoud... Al-Houdhali. Allié (Halif) des Banou Zouhra. Surnommé Abou Abderrahman.",
                physicalDesc: "Il était très petit de taille, très mince et avait la peau mate (basanée). Il ne teignait pas ses cheveux.",
                timeline: [
                    { year: "Débuts", desc: "6ème personne à embrasser l'Islam. Berger converti après un miracle du Prophète." },
                    { year: "Mecque", desc: "Premier à réciter le Coran publiquement devant la Kaaba, subissant les coups des Qurayshites." },
                    { year: "2 H", desc: "À Badr, il achève Abou Jahl agonisant et apporte sa tête au Prophète." },
                    { year: "Médine", desc: "Serviteur personnel du Prophète (chargé de ses sandales, son siwak, son oreiller)." },
                    { year: "32 H", desc: "Décès à Médine. Outhman prie sur lui (ou Zoubayr selon les versions) et il est enterré au Baqi." }
                ],
                narratives: [
                    { id: 871, title: "Le Miracle du Lait", content: "Jeune berger, il gardait les moutons d'Ouqba ibn Abi Mouait. Le Prophète (ﷺ) et Abou Bakr lui demandèrent du lait. Il refusa par honnêteté car les bêtes ne lui appartenaient pas. Le Prophète toucha alors le pis d'une jeune brebis non féconde, et le lait en jaillit abondamment. Émerveillé, Ibn Massoud demanda à apprendre « ces paroles » (le Coran)." },
                    { id: 872, title: "Les Jambes dans la Balance", content: "Il grimpa un jour à un arbre (Arak) pour cueillir du siwak. Le vent souleva son vêtement, révélant ses jambes très fines. Certains compagnons rirent de leur maigreur. Le Prophète (ﷺ) s'écria : « Vous riez de la finesse de ses jambes ? Par Celui qui détient mon âme, elles pèseront plus lourd dans la balance, au Jour du Jugement, que la montagne d'Ouhoud ! »." },
                    { id: 873, title: "La Science du Coran", content: "Il disait : « J'ai appris 70 sourates directement de la bouche du Messager d'Allah, sans intermédiaire ». Il était la référence en matière de lecture coranique." }
                ],
                hadiths: [
                    { text: "J'approuve pour ma communauté ce qu'Ibn Oum Abd approuve pour elle !", narrator: "Le Prophète (ﷺ)", source: "Musnad Ahmad" },
                    { text: "Si j'avais dû nommer un émir sans consulter quiconque, j'aurais nommé Ibn Oum Abd.", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" }
                ],
                quizData: [
                    { q: "Quelle était sa fonction particulière auprès du Prophète ?", opts: ["Garde du corps", "Porte-sandales et Siwak", "Trésorier", "Poète"], c: 1, exp: "Il était autorisé à entrer chez le Prophète et s'occupait de ses effets personnels (sandales, eau, oreiller)." },
                    { q: "Quel ennemi célèbre a-t-il achevé à Badr ?", opts: ["Oumaya ibn Khalaf", "Outba", "Abou Jahl", "Abou Lahab"], c: 2, exp: "Il trouva Abou Jahl agonisant, monta sur sa poitrine et l'acheva avec sa propre épée." }
                ]
            },
            {
                id: 88,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Outba ibn Massoud",
                arabicName: "عُتْبَة بن مَسْعُود",
                subtitle: "Le Frère Bien-Aimé",
                intro: "Frère d'Abd-Allah ibn Massoud et l'un des premiers émigrés en Abyssinie. Il était très cher au cœur d'Abd-Allah qui pleura sa mort.",
                heroQuote: "Il était mon frère, mon compagnon avec le Messager d'Allah et la personne qui m'était la plus chère !",
                tags: ["Muhajirun", "Famille", "Abyssinie"],
                genealogy: "Outba ibn Massoud Al-Houdhali. Frère cadet d'Abd-Allah.",
                timeline: [
                    { year: "Abyssinie", desc: "Participe à l'émigration vers l'Abyssinie." },
                    { year: "Médine", desc: "Accomplit l'Hégire." },
                    { year: "Califat d'Omar", desc: "Décès. Omar attendit la mère d'Outba (Oum Abd) pour qu'elle puisse prier sur lui avant l'enterrement." }
                ],
                narratives: [
                    { id: 881, title: "Les Pleurs d'Ibn Massoud", content: "À la mort d'Outba, son frère Abd-Allah ibn Massoud pleura chaudement. On lui demanda pourquoi. Il répondit : « C'était mon frère, mon compagnon avec le Messager d'Allah, et la personne que j'aimais le plus après Omar ibn Al-Khattab »." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Quel lien avait Outba avec le célèbre Abd-Allah ibn Massoud ?", opts: ["Son père", "Son fils", "Son frère", "Son cousin"], c: 2, exp: "Ils étaient frères de sang." }
                ]
            },
            {
                id: 89,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khoubayb ibn Yassaf",
                arabicName: "حُبَيْب بن يساف",
                subtitle: "Le Combattant Tardif",
                intro: "Ansari qui refusa d'abord de se convertir en voulant combattre à Badr par pur esprit tribal. Le Prophète refusa son aide jusqu'à ce qu'il embrasse l'Islam.",
                heroQuote: "Retourne, car nous ne sollicitons pas l'aide d'un polythéiste !",
                tags: ["Ansar", "Badr"],
                genealogy: "Khoubayb ibn Yassaf... Al-Khazraji. Il tua Oumaya ibn Khalaf à Badr (selon une version, bien que Bilal soit plus cité).",
                timeline: [
                    { year: "2 H", desc: "Rejoint l'armée en route pour Badr. Se convertit juste avant la bataille." },
                    { year: "Badr", desc: "Tue Al-Harith ibn 'Amir durant la bataille (et blesse Oumaya)." }
                ],
                narratives: [
                    { id: 891, title: "La Condition de la Foi", content: "Il rejoignit le Prophète en route pour Badr en disant : « Je suis venu te prêter main forte par honneur pour mon peuple, bien que je ne te suive pas ». Le Prophète (ﷺ) demanda : « Crois-tu en Allah et Son Messager ? ». Il répondit non. Le Prophète le renvoya : « Retourne, nous ne nous aidons pas de polythéistes ». Il revint plus tard, attestant de sa foi, et fut accepté." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Pourquoi le Prophète l'a-t-il initialement renvoyé avant Badr ?", opts: ["Il était trop jeune", "Il n'était pas musulman", "Il n'avait pas d'armes", "Il était malade"], c: 1, exp: "Le Prophète a refusé l'aide militaire d'un polythéiste, ce qui l'a poussé à se convertir sincèrement." }
                ]
            },
            {
                id: 90,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Ouaym ibn Saïda",
                arabicName: "عُوَيْم بن سَاعِدَة",
                subtitle: "L'Homme des Gens du Paradis",
                intro: "Vétéran de Badr et d'Aqaba. Le Prophète (ﷺ) a témoigné qu'il faisait partie des gens du Paradis et de ceux qui aiment se purifier (mosquée de Qouba).",
                heroQuote: "Il s'y trouve des hommes qui aiment se purifier (Verset révélé à son sujet).",
                tags: ["Ansar", "Badr", "Aqaba", "Paradis"],
                genealogy: "'Ouaym ibn Saïda, des Banou 'Amr ibn 'Aouf (Aws).",
                timeline: [
                    { year: "Aqaba", desc: "Assiste aux deux serments d'Aqaba." },
                    { year: "2 H", desc: "Combattant de Badr." },
                    { year: "Saqifa", desc: "L'un des deux hommes (avec Mane ibn 'Adi) qui informèrent Abou Bakr et Omar de la réunion secrète des Ansar." },
                    { year: "Califat d'Omar", desc: "Décès à 65 ou 66 ans. Sa tombe fut la première marquée par une stèle (selon une version)." }
                ],
                narratives: [
                    { id: 901, title: "Le Témoignage du Paradis", content: "Le Prophète (ﷺ) a dit de lui : « Quel excellent homme est 'Ouaym ibn Saïda ! ». Et aussi : « 'Ouaym ibn Saïda demeure parmi les occupants du Paradis »." },
                    { id: 902, title: "La Pureté de Qouba", content: "Le Prophète interrogea les gens de Qouba sur le verset « Il s'y trouve des hommes qui aiment se purifier ». Ils répondirent qu'ils utilisaient l'eau (pour l'istinja) après les pierres. 'Ouaym était l'un d'eux." }
                ],
                hadiths: [
                    { text: "Nul, parmi les Ansar, n'aimait plus le Prophète que 'Ouaym ibn Saïda !", narrator: "Omar ibn Al-Khattab", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel rôle clé a-t-il joué à la mort du Prophète ?", opts: ["Il a lavé le corps", "Il a averti Abou Bakr de la réunion de la Saqifa", "Il a creusé la tombe", "Il a dirigé la prière"], c: 1, exp: "Avec Mane ibn 'Adi, il a prévenu Abou Bakr et Omar que les Ansar se réunissaient pour élire un chef, évitant ainsi la division." }
                ]
            },
            {
                id: 91,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Salmane Al-Farissi",
                arabicName: "سَلْمَان الفَارِسِي",
                subtitle: "Le Chercheur de Vérité",
                intro: "L'Imam, le Savant, le Grand Adorateur. Surnommé « Salmane le Bon » et « Abou Abd-Allah ». Le premier Perse à embrasser l'Islam. Il traversa les terres et les religions jusqu'à trouver le Prophète à Médine.",
                heroQuote: "Je suis Salmane, fils de l'Islam ! (Quand on lui demanda sa généalogie)",
                tags: ["Ahl al-Bayt", "Savant", "Perse", "Khandaq"],
                genealogy: "Originaire de Ramhormoz ou Ispahan (village de Jay). Son père était le chef du village (Dihqan).",
                physicalDesc: "Un homme fort, aux avant-bras robustes et très poilus. Il avait une grande endurance.",
                timeline: [
                    { year: "Perse", desc: "Gardien du feu sacré (il ne devait jamais s'éteindre). Se convertit au christianisme en entendant des prières." },
                    { year: "Le Périple", desc: "Fuit vers la Syrie, puis Mossoul, Nisibe et Amorium, servant des moines vertueux." },
                    { year: "Esclavage", desc: "Trahi par des guides arabes (Kalbites), vendu comme esclave à Wadi Al-Qoura puis à Médine." },
                    { year: "1 H", desc: "Rencontre le Prophète à Qouba. Vérifie les signes et se convertit." },
                    { year: "5 H", desc: "Sa première bataille est le Fossé (Khandaq), dont il est le stratège." },
                    { year: "36 H", desc: "Meurt à Al-Madâ’in (Ctésiphon). Les versions donnent notamment 33 ou 36 H. Al-Waqidi le situe sous Outhman, tandis que Dhahabî rejette la date de 37 H." }
                ],
                narratives: [
                    { id: 911, title: "L'Aventure Spirituelle", content: "Fils chéri d'un chef perse, il fut enfermé pour protéger le feu sacré. Un jour, en passant devant une église, il fut touché par leur prière. Il s'enfuit en Syrie, servit un évêque (corrompu puis un vertueux), puis passa de moine en moine jusqu'à ce que le dernier, mourant à Amorium, lui dise : « Il n'y a plus personne sur la vraie voie. Va vers la terre des palmiers, un Prophète va y apparaître »." },
                    { id: 912, title: "L'Épreuve des Signes", content: "Arrivé esclave à Médine, il entendit parler du Prophète. Il alla le voir à Qouba avec des dattes : « C'est une aumône ». Le Prophète n'en mangea pas. À Médine, il apporta d'autres dattes : « C'est un cadeau ». Le Prophète en mangea. Plus tard, au Baqi', le Prophète laissa tomber son manteau pour lui montrer le Sceau de la Prophétie entre ses épaules. Salmane se jeta sur lui en pleurant et l'embrassa." },
                    { id: 913, title: "Le Rachat Miraculeux", content: "Son maître juif exigea pour sa liberté : 300 palmiers plantés et 40 onces d'or. Le Prophète (ﷺ) planta les 300 arbres de ses propres mains (sauf un, planté par Omar, qui dut être replanté par le Prophète). Pour l'or, le Prophète lui donna une pépite de la taille d'un œuf de poule. Salmane dit : « Que faire avec ça ? ». Le Prophète la prit, la retourna sur sa langue, et elle pesa miraculeusement le poids exact de la dette." },
                    { id: 914, title: "Salmane est des Nôtres", content: "Lors du creusement du fossé, sa force de travail était telle que les Mouhajirounes dirent « Salmane est à nous » et les Ansars dirent « Non, il est à nous ». Le Prophète (ﷺ) trancha : « Salmane est des nôtres, il fait partie des Ahl al-Bayt (Gens de la Maison) »." }
                ],
                hadiths: [
                    { text: "Le Paradis désire ardemment trois personnes : Ali, Ammar et Salmane.", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" },
                    { text: "Même si la foi se trouvait aux Pléiades (l'étoile), des hommes de Perse l'auraient atteinte.", narrator: "Le Prophète (ﷺ)", source: "Bukhari / Muslim" }
                ],
                quizData: [
                    { q: "Quel était le signe décisif qui a convaincu Salmane ?", opts: ["Le Sceau de la Prophétie", "Le refus de l'aumône", "L'acceptation du cadeau", "La beauté du Coran"], c: 0, exp: "Bien qu'il ait vérifié les deux premiers, c'est la vue du Sceau entre les épaules qui l'a fait s'effondrer en larmes." },
                    { q: "Comment a-t-il payé sa liberté ?", opts: ["Avec de l'argent gagné", "Le Prophète a payé pour lui (palmiers et or)", "Il s'est enfui", "Abou Bakr l'a acheté"], c: 1, exp: "Le Prophète a planté 300 palmiers pour lui et lui a donné de l'or miraculeux." },
                    { q: "Quelle idée géniale a-t-il eue pour défendre Médine ?", opts: ["Construire une muraille", "Creuser un fossé (Khandaq)", "Attaquer de nuit", "Utiliser le feu"], c: 1, exp: "C'était une technique de guerre perse inconnue des Arabes." }
                ]
            },
{
                id: 92,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Oubada ibn As-Samit",
                arabicName: "عُبَادَة بن الصَّامِت",
                subtitle: "L'Imam Légendaire",
                intro: "L'un des chefs (Nuqaba) de la nuit d'Al-Aqaba et héros de Badr. Il fut le premier juge de Palestine et s'opposa fermement à toute injustice, même face au puissant gouverneur Mouawiya.",
                heroQuote: "De toute évidence, il n'y a pas d'obéissance au transgresseur !",
                tags: ["Ansar", "Aqaba", "Badriyun", "Juge"],
                genealogy: "'Oubada ibn As-Samit... Al-Khazraji. Surnommé « Abou Al-Walid ».",
                physicalDesc: "Il était grand, très costaud (Jassim), et c'était un très bel homme.",
                timeline: [
                    { year: "Aqaba", desc: "L'un des 12 apôtres (Nuqaba) du premier serment." },
                    { year: "2 H", desc: "Participe à la bataille de Badr." },
                    { year: "Califat d'Omar", desc: "Envoyé au Sham pour enseigner le Coran et juger. S'installe à Homs puis en Palestine." },
                    { year: "34 H", desc: "Décès à {Ramla} (ou Jérusalem) à l'âge de 72 ans. Enterré en Palestine." }
                ],
                narratives: [
                    { id: 921, title: "L'Opposition à l'Injustice", content: "Au Sham, 'Oubada s'opposa publiquement à Mouawiya sur l'usure (Riba). Mouawiya dit : « Je ne peux vivre sur une terre où tu es ». 'Oubada partit, mais le Calife Omar le renvoya en disant à Mouawiya : « Qu'Allah enlaidisse une terre où 'Oubada n'est pas ! Il est ton émir, tu n'as aucune autorité sur lui »." },
                    { id: 922, title: "La Terre dans la Bouche", content: "Un prédicateur se leva pour faire des éloges excessifs à un émir. 'Oubada prit une poignée de terre et la lui jeta au visage. Il dit : « Le Prophète a dit : Si vous voyez les élogieux, jetez-leur de la terre au visage ! »." },
                    { id: 923, title: "Les Outres de Vin", content: "Il vit une caravane d'outres qui appartenait à un notable (peut-être Mouawiya). Apprenant que c'était du vin, il sortit son couteau et les perça toutes une à une sur la place publique, ne craignant le blâme de personne." }
                ],
                hadiths: [
                    { text: "Nous avons prêté serment au Messager d'Allah d'écouter et d'obéir... et de dire la vérité où que nous soyons sans craindre le blâme.", narrator: "'Oubada ibn As-Samit", source: "Bukhari / Muslim" },
                    { text: "Quiconque témoigne qu'il n'y a de dieu qu'Allah... Allah lui interdit le Feu.", narrator: "Le Prophète (ﷺ)", source: "Rapporté par 'Oubada sur son lit de mort" }
                ],
                quizData: [
                    { q: "Où est enterré 'Oubada ibn As-Samit ?", opts: ["À Médine", "À Damas", "À Ramla (Palestine)", "À la Mecque"], c: 2, exp: "Il est mort et enterré en Palestine (Ramla ou Jérusalem)." },
                    { q: "Quelle était sa mission au Sham ?", opts: ["Général", "Enseignant du Coran et Juge", "Commerçant", "Agriculteur"], c: 1, exp: "Omar l'a envoyé avec Mouadh et Abou Darda pour éduquer les gens du Sham." }
                ]
            },
            {
                id: 93,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Houdhafa",
                arabicName: "عبد الله بن حُذَافَة",
                subtitle: "Le Défi à l'Empereur",
                intro: "Compagnon connu pour son humour et son courage exceptionnel. Il embrassa la tête de l'empereur byzantin pour sauver 80 musulmans de la mort.",
                heroQuote: "J'aurais souhaité avoir autant d'âmes que j'ai de cheveux, pour qu'elles soient toutes jetées au feu pour Allah !",
                tags: ["Muhajirun", "Ambassadeur", "Captif", "Sahmite"],
                genealogy: "Abd-Allah ibn Houdhafa As-Sahmi. Il portait le message du Prophète à Khosro (Perse).",
                physicalDesc: "Un homme qui aimait beaucoup plaisanter (Mizah).",
                timeline: [
                    { year: "Mission", desc: "Porte la lettre du Prophète à Khosro (Perse)." },
                    { year: "Expédition", desc: "Plaisanterie célèbre où il ordonne à ses hommes de se jeter au feu." },
                    { year: "19 H", desc: "Capturé par les Romains lors de la conquête du Sham." },
                    { year: "33 H", desc: "Décès en Égypte (ou Médine) sous le califat d'Outhman." }
                ],
                narratives: [
                    { id: 931, title: "Le baiser à l’empereur : récit à variantes", content: "Le fascicule rapporte qu’Abd-Allah ibn Houdhafa résista aux pressions d’un souverain byzantin, puis accepta d’embrasser sa tête en échange de la liberté de prisonniers musulmans. Les versions diffèrent sur le nombre libéré : 80, 100 ou 300. Il convient de distinguer ces voies au lieu de fixer un chiffre unique." },
                    { id: 932, title: "La Plaisanterie du Feu", content: "Nommé chef d'une expédition, il alluma un grand feu et ordonna à ses hommes d'y sauter, invoquant son droit à l'obéissance. Ils hésitèrent. Il rit et dit qu'il plaisantait. Le Prophète (ﷺ) dit plus tard : « L'obéissance n'est que dans le bien (Ma'rouf) »." }
                ],
                hadiths: [
                    { text: "Si on vous ordonne de vous jeter dans le feu, n'obéissez pas !", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Ali" },
                    { text: "C'est un devoir pour chaque musulman d'embrasser la tête d'Abd-Allah ibn Houdhafa !", narrator: "Omar ibn Al-Khattab", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quelle condition a-t-il posée pour embrasser la tête de l'Empereur ?", opts: ["De l'or", "La vie sauve", "La libération de tous les prisonniers musulmans", "Un cheval"], c: 2, exp: "Il a sacrifié sa fierté personnelle pour sauver la communauté (80 ou 300 hommes)." },
                    { q: "Quelle leçon le Prophète a-t-il tirée de sa blague ?", opts: ["Il faut toujours obéir", "Pas d'obéissance dans le péché", "Il faut rire", "Le feu est interdit"], c: 1, exp: "Il a clarifié que l'obéissance au chef a des limites religieuses." }
                ]
            },
            {
                id: 94,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Rafi'",
                arabicName: "أبو رَافِع",
                subtitle: "L'Affranchi du Prophète",
                intro: "Esclave copte offert au Prophète (ﷺ) puis affranchi pour une bonne nouvelle. Il resta un serviteur dévoué et un intendant fidèle de la famille prophétique.",
                heroQuote: "L'affranchi d'un peuple est considéré comme l'un des leurs !",
                tags: ["Affranchi", "Serviteur", "Copte", "Ahl al-Bayt"],
                genealogy: "Copte d'Égypte. Son nom était Ibrahim ou Aslam. Esclave d'Al-Abbas puis du Prophète.",
                timeline: [
                    { year: "Mecque", desc: "Offert au Prophète par Al-Abbas." },
                    { year: "Badr", desc: "Reste à la Mecque, cachant son Islam avec Al-Abbas." },
                    { year: "Affranchissement", desc: "Le Prophète l'affranchit quand il lui annonce la conversion d'Al-Abbas." },
                    { year: "40 H", desc: "Décès à Koufa (ou Médine) sous le califat d'Ali." }
                ],
                narratives: [
                    { id: 941, title: "La Joie de la Conversion", content: "Il était le serviteur d'Al-Abbas. Lorsque ce dernier se convertit, Abou Rafi' courut annoncer la bonne nouvelle au Prophète. En récompense de cette joie, le Prophète l'affranchit sur le champ." },
                    { id: 942, title: "L'Appartenance", content: "Le Prophète envoya un homme des Banou Makhzoum collecter la Zakat. Abou Rafi' voulut l'accompagner pour en recevoir une part. Le Prophète lui dit : « L'aumône nous est interdite (Ahl al-Bayt), et l'affranchi d'un peuple est comme l'un d'eux »." }
                ],
                hadiths: [
                    { text: "Les esclaves (ou affranchis) sont rattachés à ceux qui les possèdent et, en ce qui nous concerne, les aumônes nous sont interdites !", narrator: "Le Prophète (ﷺ)", source: "Rapporté par son fils" }
                ],
                quizData: [
                    { q: "Quelle était l'origine d'Abou Rafi' ?", opts: ["Perse", "Abyssinie", "Copte (Égypte)", "Romaine"], c: 2, exp: "Il était un Copte d'Égypte." },
                    { q: "Pourquoi ne pouvait-il pas recevoir la Zakat ?", opts: ["Il était riche", "Il était considéré comme membre de la famille du Prophète", "Il était mécréant", "Il était voyageur"], c: 1, exp: "En tant qu'affranchi du Prophète, il avait le même statut que les Ahl al-Bayt concernant l'interdiction de l'aumône." }
                ]
            },
            {
                id: 95,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Souhayb Ar-Roumi",
                arabicName: "صُهَيْب بن سِنَان",
                subtitle: "Le Romain Gagnant",
                intro: "Surnommé « Le Romain » bien qu'Arabe, car il grandit captif chez les Byzantins. Il sacrifia toute sa fortune amassée à la Mecque pour pouvoir émigrer vers Allah et Son Messager.",
                heroQuote: "Quel commerce fructueux a fait Souhayb ! (Répété 3 fois par le Prophète)",
                tags: ["Muhajirun", "Généreux", "Romain"],
                genealogy: "Souhayb ibn Sinane, de la tribu arabe des {Namari}. Son père était gouverneur pour les Perses. Capturé enfant par les Romains.",
                physicalDesc: "Il était très blanc de peau (ou très rouge), de taille moyenne, avec beaucoup de cheveux.",
                timeline: [
                    { year: "Enfance", desc: "Capturé à Ninive (Mossoul), grandit esclave chez les Byzantins." },
                    { year: "Mecque", desc: "Acheté par Ibn Jud'an, il devient riche commerçant. Conversion à Dar Al-Arqam." },
                    { year: "Hégire", desc: "Laisse toute sa fortune aux Qurayshites en échange de sa liberté de partir." },
                    { year: "23 H", desc: "Dirige la prière pour la communauté pendant 3 jours après qu'Omar fut poignardé." },
                    { year: "38 H", desc: "Décès à Médine à 73 ans. Enterré au Baqi." }
                ],
                narratives: [
                    { id: 951, title: "La Transaction", content: "Les Qurayshites l'arrêtèrent lors de son départ : « Tu es venu pauvre et tu as fait fortune chez nous, et tu veux partir avec ton argent ? ». Souhayb dit : « Si je vous laisse mes biens, me laisserez-vous partir ? ». Ils acceptèrent. Il leur indiqua sa cachette et partit. Le Prophète, révélant le verset 2:207, s'écria : « Le commerce de Souhayb a gagné ! »." },
                    { id: 952, title: "L'Humour Prophétique", content: "Il arriva à Qouba avec une infection à l'œil et se mit à manger des dattes. Le Prophète (ﷺ) plaisanta : « Tu manges des dattes alors que tu as une ophtalmie ? ». Souhayb répondit avec esprit : « Ne t'inquiète pas, je mâche avec l'autre côté ! ». Le Prophète rit." },
                    { id: 953, title: "La Générosité Excessive", content: "Omar lui reprocha de trop dépenser (gaspillage). Souhayb répondit : « J'ai entendu le Prophète dire : Le meilleur d'entre vous est celui qui offre à manger »." }
                ],
                hadiths: [
                    { text: "Souhayb est le précurseur (Sabiq) des Romains !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" },
                    { text: "Parmi les gens, il y a celui qui vend sa propre âme pour rechercher l'agrément d'Allah...", narrator: "Coran (2:207)", source: "Révélé à son sujet" }
                ],
                quizData: [
                    { q: "Pourquoi était-il appelé 'Ar-Roumi' (Le Romain) ?", opts: ["Il était né à Rome", "Il avait été capturé et élevé par les Byzantins", "Il avait les yeux bleus", "Il parlait latin"], c: 1, exp: "Bien qu'Arabe, il a grandi en captivité chez les Byzantins et avait même un accent étranger." },
                    { q: "Quel rôle important a-t-il joué à la mort d'Omar ?", opts: ["Calife", "Imam de la prière", "Juge", "Général"], c: 1, exp: "Omar l'a désigné pour diriger la prière durant la période de transition (Shura) avant l'élection d'Outhman." }
                ]
            },
            {
                id: 96,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Talha Al-Ansari",
                arabicName: "أبو طَلْحَة الأنصاري",
                subtitle: "L'Archer à la Voix de Tonnerre",
                intro: "Légendaire archer d'Ouhoud et beau-père d'Anas ibn Malik. Sa voix sur le champ de bataille valait celle de cent hommes. Il offrit son plus beau jardin à Allah.",
                heroQuote: "La voix d'Abou Talha dans une armée vaut mieux que cent hommes !",
                tags: ["Ansar", "Archer", "Badr", "Généreux"],
                genealogy: "Zayd ibn Sahl... des Banou Najjar. Mari d'Oum Soulaym.",
                physicalDesc: "Un homme fort, à la voix puissante. Il ne teignait pas ses cheveux blancs.",
                timeline: [
                    { year: "Aqaba", desc: "Présent à la deuxième rencontre d’Al-Aqaba. La liste des douze délégués fait l’objet de différences entre les notices." },
                    { year: "3 H", desc: "Protège le Prophète de son corps à Ouhoud, brisant 3 arcs." },
                    { year: "Après 11 H", desc: "Une tradition lui attribue quarante années de jeûne après le Prophète ; Dhahabî conteste cette durée, puisqu'il serait décédé environ vingt ans après lui." },
                    { year: "34 H", desc: "Meurt en mer lors d'une expédition à 70 ans. Son corps reste 7 jours sans s'altérer." }
                ],
                narratives: [
                    { id: 961, title: "La Dot la plus Noble", content: "Il demanda la main d'Oum Soulaym alors qu'il était païen. Elle répondit : « Un homme comme toi ne se refuse pas, mais tu es mécréant. Si tu te convertis, ce sera ma dot, je ne veux rien d'autre ». Il accepta. Thabit disait : « On n'a jamais vu de dot plus noble que celle d'Oum Soulaym : l'Islam »." },
                    { id: 962, title: "Le Bouclier Humain", content: "À Ouhoud, il se tenait devant le Prophète, tirant flèche après flèche. Il se haussait pour protéger le Prophète de son corps en disant : « Que ma poitrine soit la cible avant la tienne, ô Messager d'Allah ! »." },
                    { id: 963, title: "Le Jardin de Bayraha", content: "Il possédait la palmeraie la plus aimée à Médine (Bayraha). À la révélation de « Vous n'atteindrez la piété que si vous dépensez de ce que vous aimez » (3:92), il l'offrit immédiatement à Allah." }
                ],
                hadiths: [
                    { text: "La voix d'Abou Talha, dans une armée, est meilleure qu'un groupe de mille hommes !", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Anas" },
                    { text: "Je suis entré au Paradis et j'ai entendu un bruit de pas... c'était Al-Ghoumayassa (Oum Soulaym, femme d'Abou Talha).", narrator: "Le Prophète (ﷺ)", source: "Bukhari" }
                ],
                quizData: [
                    { q: "Quelle fut la dot de son mariage ?", opts: ["100 chameaux", "Un jardin", "L'Islam", "De l'or"], c: 2, exp: "Sa conversion à l'Islam fut la seule condition posée par Oum Soulaym." },
                    { q: "Comment est-il mort ?", opts: ["Dans son lit", "En mer", "À Ouhoud", "De vieillesse"], c: 1, exp: "Il est mort sur un navire en pleine mer. Ils mirent 7 jours à trouver une île pour l'enterrer, et son corps ne changea pas." }
                ]
            },
            {
                id: 97,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Bourda ibn Niyar",
                arabicName: "أبو بَرْدَة بن نِيَار",
                subtitle: "Le Briseur d'Idoles",
                intro: "Vétéran de Badr et oncle maternel d'Al-Bara ibn Azib. Il fut chargé de détruire les idoles de son clan.",
                heroQuote: "Il a participé à Badr et a détruit les idoles des Banou Haritha.",
                tags: ["Ansar", "Badr", "Archer"],
                genealogy: "Hani (son vrai nom) ibn Niyar. Allié des Banou Haritha (Aous).",
                timeline: [
                    { year: "Aqaba", desc: "Assiste à la seconde rencontre d'Aqaba." },
                    { year: "2 H", desc: "Combattant de Badr." },
                    { year: "Mission", desc: "Détruit les idoles de son clan avec Abou 'Abs." },
                    { year: "41 H", desc: "Décès." }
                ],
                narratives: [
                    { id: 971, title: "Le Sacrifice Hâtif", content: "Le jour de l'Aïd, il sacrifia sa bête avant la prière pour nourrir ses invités. Le Prophète (ﷺ) lui dit : « Ton mouton est un mouton de viande (pas un sacrifice) ». Abou Bourda demanda s'il pouvait sacrifier une jeune chevrette (Jadha'a) à la place. Le Prophète l'autorisa « pour toi seulement, et pour personne d'autre après toi »." }
                ],
                hadiths: [
                    { text: "Cette permission (pour la chevrette) est valable pour toi, mais pour personne d'autre après toi.", narrator: "Le Prophète (ﷺ)", source: "Bukhari / Muslim" }
                ],
                quizData: [
                    { q: "Quelle exception juridique a-t-il obtenue ?", opts: ["Ne pas jeûner", "Sacrifier une bête trop jeune", "Prier assis", "Porter de la soie"], c: 1, exp: "Le Prophète l'a autorisé à sacrifier une 'Jadha'a' (moins d'un an) exceptionnellement." }
                ]
            },
            {
                id: 98,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Jabr ibn 'Atik",
                arabicName: "جَبْر بن عَتِيك",
                subtitle: "L'Étendard des Mouawiya",
                intro: "Grand combattant de Badr et porteur de l'étendard de son clan lors de la Conquête de la Mecque.",
                tags: ["Ansar", "Badr"],
                genealogy: "Jabr ibn 'Atik... des Banou Mouawiya (Ansar).",
                timeline: [
                    { year: "2 H", desc: "Participe à Badr." },
                    { year: "8 H", desc: "Porte le gonfanon de son clan à la Conquête de la Mecque." },
                    { year: "61 H", desc: "Décès à 91 ans." }
                ],
                narratives: [
                    { id: 981, title: "La Maladie", content: "Le Prophète (ﷺ) lui rendit visite alors qu'il était malade. Sa femme dit : « Nous espérions qu'il meure martyr au combat ». Le Prophète répondit : « Les martyrs de ma communauté seraient alors peu nombreux ! », et il cita les 7 types de martyrs (dont le noyé, le brûlé, etc.)." }
                ],
                hadiths: [
                    { text: "Les martyrs sont au nombre de sept, outre le fait d'être tué dans le sentier d'Allah...", narrator: "Le Prophète (ﷺ)", source: "Al-Muwatta / Abou Dawud" }
                ],
                quizData: []
            },
            {
                id: 99,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Ache'ath ibn Qays",
                arabicName: "الأَشْعَث بن قَيْس",
                subtitle: "L'Échevelé de Kinda",
                intro: "Roi de la tribu de Kinda. Il apostasia après la mort du Prophète, fut capturé, pardonné par Abou Bakr dont il épousa la sœur, et devint un général important en Irak.",
                heroQuote: "Je n'ai pas apostasié ! Mais Abou Bakr m'a marié à sa sœur !",
                tags: ["Chef", "Kinda", "Siffine", "Repenti"],
                genealogy: "Al-Ache'ath (L'échevelé), de son vrai nom Maadi-Karib. Prince de Kinda.",
                physicalDesc: "Il avait toujours les cheveux ébouriffés (d'où son surnom). Il perdit un œil à Yarmouk.",
                timeline: [
                    { year: "10 H", desc: "Vient voir le Prophète avec 80 cavaliers de Kinda." },
                    { year: "11 H", desc: "Apostasie (Ridda). Capturé, il est amené enchaîné à Abou Bakr qui le gracie." },
                    { year: "37 H", desc: "Commande l'aile droite d'Ali à {Siffine}." },
                    { year: "40 H", desc: "Décès à Koufa. Al-Hassan ibn Ali (son gendre) prie sur lui." }
                ],
                narratives: [
                    { id: 991, title: "Le Festin de la Grâce", content: "Gracié par Abou Bakr et marié à sa sœur Oum Farwa, Al-Ache'ath sortit au marché de Médine, tira son épée et abattit tous les chameaux présents pour offrir un festin au peuple, disant : « Je fête mes noces ! »." },
                    { id: 992, title: "L'Expiation", content: "Il jura un faux serment (ou avide) pour un terrain. Regrettant son acte après la révélation d'un verset, il offrit 30 000 dirhams en expiation." }
                ],
                hadiths: [
                    { text: "Ceux qui vendent à vil prix leur engagement avec Allah... (3:77)", narrator: "Coran", source: "Révélé suite à son litige" }
                ],
                quizData: [
                    { q: "Quel lien de parenté a-t-il eu avec Abou Bakr ?", opts: ["Son fils", "Son beau-frère", "Son cousin", "Son ennemi"], c: 1, exp: "Abou Bakr lui donna sa sœur en mariage après l'avoir gracié." }
                ]
            },
            {
                id: 100,
                verified: false,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Hatib ibn Abou Baltaa",
                arabicName: "حَاطِب بن أبي بَلْتَعَة",
                subtitle: "Le Messager Pardonné",
                intro: "Vétéran de Badr qui commit une erreur grave en prévenant les Mecquois de la Conquête, mais fut pardonné par le Prophète car « Allah a regardé les gens de Badr ».",
                heroQuote: "Ignores-tu qu'Allah a dit à leur sujet : Faites ce que vous voulez, je vous ai pardonnés !",
                tags: ["Muhajirun", "Badr", "Ambassadeur", "Pardonné"],
                genealogy: "Allié des Banou Assad. Originaire du Yémen (Lakhmite).",
                physicalDesc: "Taille moyenne, doigts larges, corps robuste.",
                timeline: [
                    { year: "2 H", desc: "Participe à Badr." },
                    { year: "Mission", desc: "Envoyé comme ambassadeur au {Mouqawqis} (Roi d'Égypte) qui offre Maria au Prophète." },
                    { year: "8 H", desc: "L'affaire de la lettre secrète. Pardonné par le Prophète." },
                    { year: "30 H", desc: "Décès à 65 ans. Outhman prie sur lui." }
                ],
                narratives: [
                    { id: 1001, title: "La Lettre Interceptée", content: "Hatib écrivit aux Mecquois pour les avertir de l'arrivée de l'armée musulmane, par peur pour sa famille. Ali intercepta la lettre. Omar voulut le tuer pour trahison. Le Prophète (ﷺ) dit : « Il a assisté à Badr. Qui te dit qu'Allah n'a pas regardé les gens de Badr en disant : Faites ce que vous voulez, je vous ai pardonnés ? ». Omar pleura." },
                    { id: 1002, title: "La Vengeance d'Ouhoud", content: "C'est lui qui tua et décapita 'Outba ibn Abi Waqas à Ouhoud, l'homme qui avait cassé la dent du Prophète et blessé son visage. Le Prophète fut satisfait de cet acte." }
                ],
                hadiths: [
                    { text: "Le feu de l'Enfer ne touchera pas, inshaAllah, ceux qui ont prêté serment sous l'arbre (Hatib en faisait partie).", narrator: "Le Prophète (ﷺ)", source: "Sahih Muslim" }
                ],
                quizData: [
                    { q: "Pourquoi le Prophète a-t-il pardonné sa trahison ?", opts: ["Il a payé une rançon", "Car il était vétéran de Badr", "Il était son cousin", "Il a nié"], c: 1, exp: "Son statut de Badri lui a valu l'absolution divine." },
                    { q: "Auprès de quel roi fut-il envoyé ?", opts: ["Le Négus", "Héraclius", "Le Mouqawqis (Égypte)", "Khosro"], c: 2, exp: "Il fut l'ambassadeur du Prophète auprès du gouverneur d'Égypte." }
                ]
            },
{
                id: 201,
                name: "Juwayriya bint Al-Harith",
                arabicName: "جويرية بنت الحارث",
                subtitle: "La Femme Bénie pour son Peuple",
                intro: "Mère des Croyants et fille du chef des Banu Mustaliq. Son mariage avec le Prophète (ﷺ) déclencha l'un des plus grands actes de libération de l'histoire : cent familles de son clan furent affranchies grâce à elle.",
                heroQuote: "Je ne connais pas de femme qui fut une plus grande bénédiction pour son peuple qu'elle.",
                tags: ["Mères des Croyants"],
                genealogy: "Elle est Juwayriya bint Al-Harith ibn Abi Dirar, de la tribu des {Banu Mustaliq} (une branche des Khuza'a). Son prénom initial était Barrah (Pieuse), le Prophète la renomma Juwayriya (Petite fille/Jeune demoiselle).",
                physicalDesc: "Aïsha la décrivit ainsi : « Elle était d'une beauté douce et quiconque la voyait en était charmé ». Elle était connue pour sa grande piété et ses longues heures de prière.",
                timeline: [
                    { year: "5 H", desc: "Capturée lors de la bataille des Banu Mustaliq (Al-Mouraysi'). Elle tombe dans le lot de Thabit ibn Qays." },
                    { year: "Mariage", desc: "Elle demande l'aide du Prophète pour payer sa rançon. Il paye sa dette et l'épouse. En conséquence, les musulmans libèrent tous les captifs de sa tribu." },
                    { year: "Dévotion", desc: "Le Prophète lui enseigne des formules de rappel (Dhikr) qui pèsent lourd dans la balance." },
                    { year: "50 H", desc: "Décès à Médine à l'âge de 65 ans sous le califat de Muawiya. Elle est enterrée au {Baqi}." }
                ],
                narratives: [
                    { id: 2011, title: "La Grande Libération", content: "Dès que la nouvelle du mariage de Juwayriya avec le Prophète (ﷺ) se répandit, les compagnons dirent : « Les beaux-parents du Messager d'Allah sont nos esclaves ? Cela ne se peut pas ! ». Ils relâchèrent alors tous les captifs des {Banu Mustaliq} qu'ils détenaient. Aïsha commenta : « On a libéré grâce à elle cent familles de son peuple ! »." },
                    { id: 2012, title: "Le Dhikr du Matin", content: "Le Prophète sortit tôt le matin alors qu'elle priait, et revint en fin de matinée alors qu'elle était toujours assise à invoquer. Il lui dit : « Tu es restée dans cet état ? Je vais t'apprendre quatre paroles qui, répétées trois fois, pèsent plus lourd que tout ce que tu as dit : 'Gloire et louange à Allah, autant de fois que le nombre de Ses créatures, autant qu'il Lui plaît, autant que pèse Son Trône et autant que l'encre de Ses paroles'. »" },
                    { id: 2013, title: "Le Changement de Nom", content: "Elle s'appelait initialement « Barrah » (La Pieuse/Bienfaisante). Le Prophète (ﷺ), n'aimant pas que l'on dise « Il sort de chez La Pieuse » (comme si la piété restait derrière), la renomma Juwayriya." }
                ],
                hadiths: [
                    { text: "Je ne connais pas de femme qui fut une plus grande bénédiction pour son peuple qu'elle.", narrator: "Aïsha bint Abi Bakr", source: "Sunan Abi Dawud" },
                    { text: "SubhanAllahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'archihi, wa midada kalimatihi.", narrator: "Le Prophète (ﷺ) à Juwayriya", source: "Sahih Muslim" }
                ],
                quizData: [
                    { q: "Quel était son prénom avant que le Prophète ne le change ?", opts: ["Zaynab", "Barrah", "Hind", "Atika"], c: 1, exp: "Elle s'appelait Barrah (Pieuse), mais le Prophète changea son nom pour éviter l'auto-sanctification." },
                    { q: "Quel fut l'impact direct de son mariage ?", opts: ["Une trêve de 10 ans", "La libération de 100 familles de son clan", "La conversion de la Mecque", "La révélation du Hijab"], c: 1, exp: "Les compagnons ont libéré tous les captifs des Banu Mustaliq par respect pour les nouveaux liens de parenté du Prophète." },
                    { q: "De quelle tribu était-elle issue ?", opts: ["Quraysh", "Banu Mustaliq", "Aws", "Khazraj"], c: 1, exp: "Elle était la fille du chef des Banu Mustaliq, Al-Harith ibn Abi Dirar." }
                ]
    },
    {
  "id": 102,
  "name": "Atikah bint Khalid (Umm Ma'bad)",
  "arabicName": "عاتكة بنت خالد - أم معبد",
  "subtitle": "L'Hôtesse de la Hijra et la Gardienne du Portrait",
  "intro": "Issue de la tribu des Khuza'a, elle accueillit le Prophète (ﷺ) et Abu Bakr dans sa tente lors de leur migration clandestine vers Médine. Témoin d'un miracle laitier, elle est célèbre pour avoir formulé la description physique (Hilya) la plus précise et poétique du Messager d'Allah.",
  "heroQuote": "J'ai vu un homme d'une beauté éclatante, au visage lumineux... Si tu le voyais de loin, il était le plus beau et le plus glorieux ; et de près, il était le plus doux et le plus noble.",
  "tags": [
    "Sahabiyat",
    "Hijra",
    "Khuza'a"
  ],
  "genealogy": "Elle est Atikah bint Khalid ibn Munqidh al-Khuza'iyyah. Elle est plus connue sous sa kunya {Umm Ma'bad}. Son mari était Abu Ma'bad (Aktham ibn Abi al-Jawn). Sa tribu résidait à Qudayd, sur la route entre La Mecque et Médine.",
  "physicalDesc": "Décrite comme une femme forte, courageuse et très éloquente. Elle était une 'femme assise dans la cour de sa tente' (Barza), habituée à recevoir les voyageurs et à faire preuve d'une hospitalité bédouine franche et généreuse.",
  "timeline": [
    {
      "year": "1 H",
      "desc": "L'événement majeur : Le Prophète (ﷺ) et Abu Bakr, fuyant La Mecque, s'arrêtent à sa tente à Qudayd. Elle assiste au miracle de la brebis."
    },
    {
      "year": "Conversion",
      "desc": "Son mari rentre, écoute sa description de l'étranger et déclare qu'il s'agit du 'compagnon des Quraysh'. Ils décident d'embrasser l'Islam."
    },
    {
      "year": "Migration",
      "desc": "Elle émigre plus tard vers Médine avec son mari et son fils pour rejoindre la communauté musulmane. Le Prophète l'honore lors de ses visites."
    },
    {
      "year": "Post-Prophétique",
      "desc": "Elle vécut longtemps après la mort du Prophète, jusqu'au califat de Uthman ibn Affan, transmettant fidèlement le récit de sa rencontre."
    }
  ],
  "narratives": [
    {
      "id": 1021,
      "title": "La Brebis Tarie",
      "content": "Le Prophète et Abu Bakr, épuisés et assoiffés, demandèrent à acheter de la nourriture. Umm Ma'bad n'avait rien, la sécheresse ayant tout décimé. Le Prophète vit une brebis chétive dans un coin et demanda s'il pouvait la traire. Elle répondit : « Elle est trop épuisée pour avoir du lait ». Il posa sa main bénie sur le pis, invoqua Allah, et le lait coula en abondance. Il fit boire Umm Ma'bad jusqu'à satiété, puis ses compagnons, et but en dernier. Il laissa même un récipient plein avant de repartir."
    },
    {
      "id": 1022,
      "title": "La Hilya (Description)",
      "content": "Au retour de son mari, Abu Ma'bad, qui s'étonna de trouver du lait, elle décrivit le visiteur avec une éloquence rare : « Il a des yeux noirs très contrastés, des cils longs... Dans sa voix, il y a une raucité (douceur grave)... Son cou est éclatant... Son silence inspire le respect, sa parole la fascination... ». Cette description est devenue la référence pour visualiser le Prophète (ﷺ)."
    },
    {
      "id": 1023,
      "title": "Le Cadeau de bienvenue",
      "content": "Lorsqu'elle arriva plus tard à Médine en tant que musulmane, le Prophète (ﷺ) la reconnut immédiatement, l'accueillit chaleureusement et lui offrit des cadeaux, honorant l'hospitalité qu'elle lui avait offerte alors qu'il était un fugitif pourchassé."
    }
  ],
  "hadiths": [
    {
      "text": "J'ai vu un homme dont la propreté était évidente, le visage lumineux, de belle constitution... Il n'était ni trop grand ni trop petit... Il était entouré de compagnons qui, s'il parlait, écoutaient, et s'il ordonnait, s'empressaient d'obéir.",
      "narrator": "Umm Ma'bad décrivant le Prophète",
      "source": "Mustadrak Al-Hakim (Authentifié)"
    }
  ],
  "quizData": [
    {
      "q": "Quel événement célèbre est associé à Umm Ma'bad ?",
      "opts": [
        "Elle a soigné les blessés à Uhud",
        "Elle a accueilli le Prophète lors de la Hijra et a vu le miracle de la brebis",
        "Elle a épousé le Prophète",
        "Elle a été la première femme martyre"
      ],
      "c": 1,
      "exp": "Sa tente à Qudayd fut une halte cruciale lors de l'Hégire où le Prophète a trait une brebis qui n'avait plus de lait."
    },
    {
      "q": "Quelle est la particularité de sa description du Prophète (ﷺ) ?",
      "opts": [
        "Elle est très brève",
        "Elle ne décrit que ses vêtements",
        "C'est l'une des descriptions physiques les plus détaillées et éloquentes",
        "Elle ne l'a jamais décrit"
      ],
      "c": 2,
      "exp": "Les savants considèrent sa description (Hilya) comme l'une des plus complètes et poétiques, servant de base à la compréhension de l'apparence du Prophète."
    },
    {
      "q": "De quelle tribu était-elle issue ?",
      "opts": [
        "Quraysh",
        "Khuza'a",
        "Aws",
        "Thaqif"
      ],
      "c": 1,
      "exp": "Elle appartenait à la tribu des Khuza'a, qui avait des liens historiques avec le Prophète et les Banu Hashim."
    }
  ]
},
{
  "id": 103,
  "name": "Sayyida Nafisa bint Al-Hasan",
  "arabicName": "نفيسة بنت الحسن",
  "subtitle": "La Maîtresse des Savants et l'Enseignante de l'Imam Shafi'i",
  "intro": "Arrière-arrière-petite-fille du Prophète (ﷺ), elle fut une sommité spirituelle et intellectuelle. Figure majeure de la science au Caire, elle était consultée par les plus grands Imams de son temps pour sa connaissance du Hadith et du Fiqh.",
  "heroQuote": "Comment ne pas désirer la rencontre avec Allah alors que j'ai récité le Coran six mille fois dans cette tombe que j'ai creusée de mes mains ?",
  "tags": [
    "Ahl al-Bayt",
    "Érudition",
    "Spiritualité"
  ],
  "genealogy": "Elle est Nafisa bint Al-Hasan ibn Zayd ibn Al-Hasan ibn Ali ibn Abi Talib. Sa mère venait également de la lignée prophétique. Elle épousa Ishaq al-Mu'tamin, le fils de l'Imam Ja'far al-Sadiq.",
  "physicalDesc": "Elle était décrite comme une femme à la présence imposante, le visage illuminé par le culte (Ibada). Elle ne cessait de jeûner le jour et de prier la nuit, vivant dans un détachement total des biens matériels.",
  "timeline": [
    {
      "year": "145 H",
      "desc": "Naissance à La Mecque. Elle grandit à Médine où elle mémorise le Coran et étudie le Fiqh dès son plus jeune âge."
    },
    {
      "year": "Mariage",
      "desc": "Elle épouse Ishaq al-Mu'tamin (fils de Ja'far al-Sadiq). Ce mariage unit les branches Hassanide et Husseinide des Ahl al-Bayt."
    },
    {
      "year": "193 H",
      "desc": "Arrivée au Caire (Égypte). Les habitants l'accueillent en masse pour bénéficier de sa Baraka (bénédiction) et de sa science."
    },
    {
      "year": "Enseignement",
      "desc": "L'Imam Al-Shafi'i, arrivé en Égypte, lui rend visite fréquemment pour écouter ses Hadiths et débattre de questions juridiques."
    },
    {
      "year": "208 H",
      "desc": "Décès au Caire pendant le Ramadan, alors qu'elle récitait le verset 'Pour eux la maison du Salut auprès de leur Seigneur'. L'Imam Shafi'i étant mort peu avant elle, son corps avait été porté chez elle pour qu'elle prie sur lui."
    }
  ],
  "narratives": [
    {
      "id": 1031,
      "title": "La Professeure de l'Imam Shafi'i",
      "content": "L'un des plus grands juristes de l'Islam, l'Imam Al-Shafi'i, avait un immense respect pour elle. Lorsqu'il était malade, il envoyait un messager lui demander des invocations. Il s'asseyait dans son assemblée pour entendre les Hadiths. Dans son testament, il demanda à ce que son cercueil passe devant sa maison pour qu'elle effectue la prière mortuaire sur lui, ce qu'elle fit depuis derrière un rideau."
    },
    {
      "id": 1032,
      "title": "L'Érudition et la Mémoire",
      "content": "Dès son enfance à Médine, elle assistait aux cercles de science à la Mosquée du Prophète. Elle devint une référence (Hujja) dans la transmission du savoir prophétique. Les gens venaient de loin non seulement pour sa lignée, mais pour la précision de ses avis juridiques et sa connaissance du Coran."
    },
    {
      "id": 1033,
      "title": "La Tombe et le Coran",
      "content": "Consciente de l'éphémérité de la vie, elle avait creusé sa propre tombe dans sa maison. Elle y descendait pour prier et y récitait le Coran en entier. On rapporte qu'elle y a complété la lecture du Coran plusieurs milliers de fois avant sa mort, imprégnant le lieu de spiritualité."
    }
  ],
  "hadiths": [
    {
      "text": "L'Imam Al-Dhahabi la décrit ainsi : 'Elle était une dame noble, pieuse, une adoratrice dévouée, et une savante digne de confiance dans la transmission divine.'",
      "narrator": "Al-Dhahabi (Siyar A'lam al-Nubala)",
      "source": "Siyar A'lam al-Nubala"
    }
  ],
  "quizData": [
    {
      "q": "Quel grand Imam fut l'élève et l'admirateur de Sayyida Nafisa ?",
      "opts": [
        "Imam Abu Hanifa",
        "Imam Malik",
        "Imam Al-Shafi'i",
        "Imam Ahmad"
      ],
      "c": 2,
      "exp": "L'Imam Al-Shafi'i la visitait régulièrement au Caire pour apprendre le Hadith et lui demander des invocations."
    },
    {
      "q": "Quel est son lien de parenté avec le Prophète (ﷺ) ?",
      "opts": [
        "Sa fille",
        "Sa petite-fille",
        "Son arrière-arrière-petite-fille",
        "Sa tante"
      ],
      "c": 2,
      "exp": "Elle est la fille d'Al-Hasan ibn Zayd, qui est le petit-fils de Ali et Fatima. Elle est donc de la 4ème génération après le Prophète."
    },
    {
      "q": "Dans quelle ville a-t-elle passé la fin de sa vie et enseigné ?",
      "opts": [
        "Bagdad",
        "Damas",
        "Le Caire (Fostat)",
        "Cordoue"
      ],
      "c": 2,
      "exp": "Elle s'installa en Égypte (au Fostat, le vieux Caire) où elle devint une figure centrale de la communauté jusqu'à sa mort."
    }
  ]
},
{
  "id": 106,
  "name": "Fatima as-Samarqandiyya",
  "arabicName": "فاطمة السمرقندية",
  "subtitle": "Celle dont la Dot fut un Livre de Droit",
  "intro": "Fille d'un grand maître de Samarcande, elle devint une juriste Hanafite de premier plan. Elle est célèbre pour avoir éduqué son mari, le grand Imam Al-Kasani, et pour avoir fait de la science juridique la condition de son mariage.",
  "heroQuote": "Les fatwas sortaient de leur maison ornées de trois signatures : celle du père, celle de la fille, et celle du mari.",
  "tags": [
    "Faqiha",
    "Hanafite",
    "Alep"
  ],
  "genealogy": "Fatima bint Muhammad ibn Ahmad al-Samarqandi. Son père est l'auteur du célèbre ouvrage 'Tuhfat al-Fuqaha' (Le joyau des juristes). Elle épousa Ala' al-Din al-Kasani.",
  "physicalDesc": "Les sources historiques taisent ses traits physiques par respect, mais insistent sur son 'Haybah' (prestance intellectuelle). Elle enseignait derrière un rideau et son mari la consultait publiquement pour résoudre les cas difficiles.",
  "timeline": [
    {
      "year": "Jeunesse",
      "desc": "Elle étudie le Fiqh Hanafite sous la tutelle de son père à Samarcande. Elle mémorise son livre 'Tuhfat al-Fuqaha' par cœur."
    },
    {
      "year": "Mariage",
      "desc": "De nombreux rois et princes demandent sa main. Elle refuse tout prétendant qui ne peut l'égaler en science. Elle accepte Al-Kasani lorsqu'il écrit le commentaire parfait du livre de son père."
    },
    {
      "year": "Migration",
      "desc": "Elle déménage avec son père et son mari à Alep (Syrie) à la demande du souverain Nur ad-Din Zengi, qui les tenait en haute estime."
    },
    {
      "year": "581 H",
      "desc": "Décès à Alep. Elle est enterrée dans la mosquée Ibrahim, près de la citadelle. Son mari, inconsolable, demandera à être enterré à ses côtés quelques années plus tard."
    },
    {
      "year": "Héritage",
      "desc": "Elle laisse derrière elle une tradition de rigueur juridique et un exemple unique de partenariat intellectuel conjugal."
    }
  ],
  "narratives": [
    {
      "id": 1061,
      "title": "La Dot la plus Précieuse",
      "content": "Son père avait écrit *Tuhfat al-Fuqaha*. Un étudiant brillant, Al-Kasani, écrivit un commentaire magistral de ce livre intitulé *Bada'i' al-Sana'i'*. Impressionné, le père lui offrit la main de Fatima. Elle accepta, considérant ce livre comme sa dot. Les juristes de l'époque disaient avec admiration : « Il a expliqué son Joyau (le livre Tuhfa) et il a épousé sa fille »."
    },
    {
      "id": 1062,
      "title": "La Correctrice du Maître",
      "content": "Bien que son mari fut surnommé 'Le Roi des Savants', il lui arrivait d'hésiter ou de se tromper sur une Fatwa. Lorsqu'il rentrait à la maison, Fatima lui indiquait l'erreur et lui donnait la preuve juridique correcte. Il retournait alors sur son avis. Elle était sa référence ultime."
    },
    {
      "id": 1063,
      "title": "La Conseillère des Rois",
      "content": "Le sultan Nur ad-Din Zengi, grand dirigeant de l'époque des Croisades, consultait Fatima sur des questions d'État et de droit religieux. Il respectait ses avis et lui accordait une grande influence dans les affaires religieuses d'Alep."
    }
  ],
  "hadiths": [
    {
      "text": "L'historien Ibn al-Adim rapporte : 'Elle mémorisait la doctrine Hanafite mieux que quiconque. Son mari la respectait et l'honorait énormément.'",
      "narrator": "Ibn al-Adim (Historien d'Alep)",
      "source": "Bugyat al-Talab fi Tarikh Halab"
    }
  ],
  "quizData": [
    {
      "q": "Quelle était la dot de Fatima as-Samarqandiyya ?",
      "opts": [
        "1000 pièces d'or",
        "Un livre de jurisprudence (Fiqh)",
        "Un palais à Alep",
        "Un troupeau de chameaux"
      ],
      "c": 1,
      "exp": "Sa dot fut le livre 'Bada'i' al-Sana'i'', écrit par son mari. C'est considéré comme l'une des dots les plus nobles de l'histoire islamique."
    },
    {
      "q": "De quelle école juridique (Madhhab) était-elle une experte ?",
      "opts": [
        "Malikite",
        "Shafi'ite",
        "Hanafite",
        "Hanbalite"
      ],
      "c": 2,
      "exp": "Elle et sa famille étaient des piliers de l'école Hanafite, originaire de Kufa mais très répandue en Asie Centrale et en Turquie."
    },
    {
      "q": "Quel rôle jouait-elle vis-à-vis de son mari, l'Imam Al-Kasani ?",
      "opts": [
        "Elle ne s'occupait que de la maison",
        "Elle écrivait ses livres à sa place",
        "Elle corrigeait ses Fatwas et enseignait",
        "Elle était son élève uniquement"
      ],
      "c": 2,
      "exp": "Elle était son égale intellectuelle et corrigeait souvent ses avis juridiques lorsqu'il commettait une erreur."
    }
  ]
}
];