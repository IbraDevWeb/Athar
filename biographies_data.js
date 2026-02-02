// Fichier: data.js

         const CHAPTERS_DATA = [
            {
                id: 1, 
                verified: true, // NOUVEAU : Badge de certification
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Oubayda ibn Al-Jarrah", 
                arabicName: "أبو عبيدة", 
                subtitle: "L'Amin de la Communauté",
                intro: "L'un des dix promis au Paradis. Le confident, le chef respecté. Celui dont le Prophète (ﷺ) a dit : « Chaque communauté a un homme de confiance, et le mien est Abou Oubayda. »",
                heroQuote: "Si je l'avais voulu, j'aurais pu adresser des reproches à chacun d'entre vous... excepté Abou Oubayda !",
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
                    { year: "18 H", desc: "Décède lors de la peste d'{Amwas} à 58 ans." }
                ],
                narratives: [
                    { id: 100, title: "L'un des cinq premiers", content: "Il se convertit en même temps qu'Ibn Mazhoun, Oubayda ibn Al-Harith, Abderrahman ibn 'Aouf et Abou Salama, juste après Abou Bakr et avant l'entrée à Dar Al-Arqam." },
                    { id: 101, title: "Le Meilleur Dentiste", content: "À {Ouhoud}, deux maillons du casque du Prophète (ﷺ) s'étaient enfoncés dans sa joue bénie. Craignant de le blesser avec ses mains, Abou Oubayda tira dessus avec ses dents. Il perdit une incisive pour chaque maillon retiré. On disait : « Il n'est pas de plus belle brèche (dentaire) que celle d'Abou Oubayda »." },
                    { id: 102, title: "L'Ascétisme Radical", content: "Oumar (Calife) visita sa demeure de gouverneur au {Sham}. Il n'y vit qu'un bol, une épée et une selle. Oumar pleura : « La {Dounia} nous a tous changés, sauf toi, Abou Oubayda ». Ce dernier répondit : « Ô Prince des croyants, cela nous suffit pour atteindre le lieu de la sieste (la mort). »" },
                    { id: 103, title: "Le Conflit Évité", content: "Envoyé en renfort à l'expédition 'As-Salassil' dirigée par 'Amr ibn Al-'Ass, ce dernier refusa de céder le commandement. Bien qu'étant plus méritant, Abou Oubayda dit : « Le Prophète m'a ordonné de ne pas diverger. Tu es l'émir et je t'obéis ». Il sauva l'unité de l'armée par son humilité." },
                    { id: 104, title: "Face à la Peste", content: "Lors de la peste d'{Amwas}, Oumar lui écrivit : « J'ai besoin de toi, viens tout de suite ». Abou Oubayda comprit qu'Oumar voulait le sauver de la mort. Il répondit : « Je suis au milieu d'une armée musulmane et je ne souhaite pas me sauver moi-même en les laissant. Laisse-moi jusqu'à ce qu'Allah décide de mon sort ». Oumar pleura en lisant la lettre." },
                    { id: 105, title: "L'Or Distribué", content: "Oumar lui envoya 4000 dinars (ou 400). Il distribua tout immédiatement aux soldats et aux pauvres. Sa femme dit : « Nous en avions pourtant besoin ! ». Il ne garda rien pour lui." },
                    { id: 106, title: "L'Expédition du Cachalot", content: "Lors d'une expédition (Habat) où la famine frappa ses 300 hommes, la mer rejeta un immense cachalot (Ambre). Abou Oubayda dit d'abord 'C'est une bête morte (interdit)', puis se ravisa par ijtihad : 'Non, nous sommes les envoyés du Messager d'Allah et nous sommes contraints... Mangez !'. Ils s'en nourrirent un mois." }
                ],
                hadiths: [
                    { text: "Chaque communauté a un digne de confiance (Amin) et le digne de confiance de cette communauté est Abou Oubayda !", narrator: "Le Prophète (ﷺ)", source: "Bukhari / Muslim" },
                    { text: "J'aurais aimé être un bélier que ma famille égorge, dont ils mangent la chair et boivent le bouillon, et ainsi je ne serais plus rien !", narrator: "Abou Oubayda", source: "Siyar A'lam al-Nubula" },
                    { text: "Le jeûne est une armure tant que celle-ci n'est pas rompue (par la médisance) !", narrator: "Abou Oubayda", source: "Rapporté par Iyad ibn Ghoutayf" }
                ],
                quizData: [
                    { q: "Quel surnom unique le Prophète a-t-il donné à Abou Oubayda ?", opts: ["Le Véridique", "L'Amin (Digne de Confiance)", "Le Sabre d'Allah", "Le Sage"], c: 1, exp: "Il est Amin al-Oumma (Le digne de confiance de la communauté)." },
                    { q: "Pourquoi a-t-il perdu ses dents de devant ?", opts: ["Au combat à l'épée", "En retirant des maillons du visage du Prophète", "De vieillesse", "Par maladie"], c: 1, exp: "Il les a utilisées comme pinces pour retirer le métal enfoncé dans la joue du Prophète à Ouhoud." },
                    { q: "Comment a-t-il réagi quand Oumar a voulu le rappeler pour le sauver de la peste ?", opts: ["Il est parti immédiatement", "Il a refusé de quitter son armée", "Il a envoyé sa famille", "Il a démissionné"], c: 1, exp: "Il a répondu qu'il ne valait pas mieux que ses soldats et qu'il resterait avec eux jusqu'à la fin." }
                ]
            },
            {
                id: 2, 
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Talha ibn Oubayd-Allah", 
                arabicName: "طلحة", 
                subtitle: "Le Martyr Vivant",
                intro: "Le Faucon d'Ouhoud. Celui qui fit de son corps un bouclier pour le Messager d'Allah (ﷺ). Surnommé « Le Bon », « Le Brave » et « Le Généreux » par le Prophète lui-même.",
                heroQuote: "Quiconque désire voir un martyr marchant sur Terre, qu'il regarde Talha ibn Oubayd-Allah !",
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
                    { id: 201, title: "Le Bouclier Humain", content: "À {Ouhoud}, alors que tous avaient fui, il resta avec le Prophète (ﷺ). Il interceptait les flèches avec sa main nue jusqu'à ce que ses doigts soient tranchés. Il poussa un cri de douleur (« Hassi ! »). Le Prophète lui dit : « Si tu avais dit Bismillah, les anges t'auraient élevé sous les yeux de tous »." },
                    { id: 202, title: "L'Angoisse du Riche", content: "Il reçut une somme colossale (700 000) de l'Hadramaout qui l'empêcha de dormir. Sa femme Oum Koulthoum (fille d'Abou Bakr) lui conseilla de la partager. Au matin, il ne lui restait plus un dirham." },
                    { id: 203, title: "Les Regrets d'Ali", content: "Après le combat du Chameau, Ali vit le corps de Talha dans un fossé. Il descendit, essuya la poussière de son visage et pleura en disant : « Si seulement j'étais mort vingt ans avant ce jour ! ». Il témoigna que le Prophète avait dit : « Talha et Zoubayr sont mes voisins au Paradis »." },
                    { id: 204, title: "Le Miracle de la Tombe", content: "Trente ans après sa mort, sa fille Aïsha le vit en rêve se plaignant de l'humidité. En ouvrant sa tombe, ils trouvèrent son corps intact, comme s'il venait de mourir, à l'exception de quelques poils de barbe. Ils le déplacèrent dans une autre tombe." }
                ],
                hadiths: [
                    { text: "Talha et Zoubayr sont mes deux voisins au Paradis !", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" },
                    { text: "Le Paradis est obligatoire pour Talha (suite à son action à Ouhoud).", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" }
                ],
                quizData: [
                    { q: "Quelle blessure Talha a-t-il gardée d'Ouhoud ?", opts: ["Œil crevé", "Main paralysée", "Jambe coupée", "Aucune"], c: 1, exp: "Sa main fut paralysée après avoir stoppé des flèches destinées au Prophète (ﷺ)." },
                    { q: "Quels sont les trois surnoms donnés par le Prophète ?", opts: ["Le Bon, Le Brave, Le Généreux", "Le Lion, L'Épée, Le Sage", "Le Véridique, Le Farouq, Le Riche"], c: 0, exp: "Talha Al-Khayr (Le Bon), Talha Al-Fayyad (Le Brave/Généreux torrentiel), Talha Al-Jud (Le Généreux)." },
                    { q: "Pourquoi était-il absent physiquement à Badr ?", opts: ["Malade", "En voyage au Sham", "Peur", "Pas converti"], c: 1, exp: "Il était en voyage d'affaires (ou d'espionnage selon les versions) au Sham, mais fut compté comme présent." }
                ]
            },
            {
                id: 3,
                verified: true,
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
                    { year: "12-16 ans", desc: "Conversion. Premier homme à dégainer une épée pour l'Islam suite à une rumeur." },
                    { year: "2 H", desc: "À {Badr}, il porte un turban jaune. Les anges descendent vêtus de la même façon." },
                    { year: "5 H", desc: "À Khandaq, le Prophète réunit ses parents en sacrifice verbal pour lui : « Tire, pour toi mon père et ma mère ! »." },
                    { year: "15 H", desc: "À Yarmouk, il charge seul et perce les rangs ennemis à deux reprises." },
                    { year: "36 H", desc: "Quitte le champ de bataille (Al-Jamal) après un rappel d'Ali. Assassiné traîtreusement par Ibn Jourmouz pendant sa prière." }
                ],
                narratives: [
                    { id: 301, title: "Le Premier Glaive", content: "Enfant, il entendit une rumeur que le Prophète était tué. Il sortit l'épée à la main fendant la foule à la Mecque. Le Prophète lui dit : « Qu'as-tu ? ». Il répondit : « Je suis venu trancher tes assaillants ! ». Le Prophète invoqua pour lui et son épée." },
                    { id: 302, title: "Le Turban Jaune", content: "Le jour de Badr, Zoubayr portait un turban jaune distinctif. Le Prophète (ﷺ) vit alors les anges descendre pour aider les musulmans, et ils portaient tous des turbans jaunes à l'image de Zoubayr ce jour-là." },
                    { id: 303, title: "L'Allié contre les Dettes", content: "Avant sa mort, il confia ses dettes massives (2,2 millions) à son fils Abd-Allah en lui disant : « Si tu rencontres une difficulté, appelle mon Maître (Mawla) ». Son fils demanda « Qui est-ce ? ». Il dit : « Allah ». Son fils raconte qu'à chaque difficulté, il invoquait le Maître de Zoubayr et la dette se réglait." },
                    { id: 304, title: "Le Duel de l'Œil", content: "À Badr, il affronta Oubayda ibn Saïd, un guerrier en armure intégrale dont on ne voyait que les yeux. Zoubayr visa l'œil avec son épieu et le tua. Il dut mettre son pied sur le cadavre pour réussir à retirer son arme tant le coup fut violent." }
                ],
                hadiths: [
                    { text: "Zoubayr est le fils de ma tante et l'apôtre de ma communauté !", narrator: "Le Prophète (ﷺ)", source: "Mousnad Ahmad" },
                    { text: "Annoncez le feu de l'Enfer au meurtrier du fils de Safiya (Zoubayr) !", narrator: "Ali ibn Abi Talib", source: "Siyar A'lam al-Nubula" }
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
                verified: true,
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
                    { id: 401, title: "Le Convoi de Médine", content: "Un jour, 700 montures chargées de vivres arrivèrent à Médine, faisant trembler le sol. Aïsha dit : « J'ai entendu que Abderrahman entrerait au Paradis en rampant (à cause de sa richesse) ». Apprenant cela, il donna tout le convoi en aumône pour espérer y entrer debout !" },
                    { id: 402, title: "L'Imam du Prophète", content: "Lors de l'expédition de Tabouk, le Prophète (ﷺ) arriva en retard pour la prière de l'aube. Abderrahman avait déjà commencé. Le Prophète pria alors une unité de prière derrière lui. C'est un honneur qu'il ne partage qu'avec Abou Bakr." },
                    { id: 403, title: "L'Héritage en Or", content: "Sa fortune était telle qu'à sa mort, on dut utiliser des haches pour partager son or, au point que les mains des hommes en eurent des ampoules. Chacune de ses 4 veuves reçut 80 000 dinars." },
                    { id: 404, title: "Le Refus du Pouvoir", content: "Lors de la Shura pour succéder à Omar, il dit : « Lequel d'entre vous accepterait de se désister pour choisir le meilleur ? ». Personne ne répondit. Il dit : « Moi je me désiste ». Il passa 3 jours sans dormir à consulter les gens pour finalement choisir Outhman." },
                    { id: 405, title: "La Jizya des Mages", content: "C'est grâce à son témoignage unique que le Calife Omar accepta de prélever la Jizya (impôt) sur les Mazdéens (Mages) de Hajar, car Abderrahman attesta avoir vu le Prophète le faire." }
                ],
                hadiths: [
                    { text: "Laissez mes compagnons ! Si l'un de vous dépensait l'équivalent d'Ouhoud en or, cela n'égalerait pas une poignée donnée par eux.", narrator: "Le Prophète (à Khalid)", source: "Sahih Muslim" },
                    { text: "Tu es un digne de confiance pour les gens du ciel et ceux de la Terre !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam al-Nubula" }
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
                verified: true,
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
                    { id: 502, title: "L'Invocation Exaucée", content: "À Koufa, un homme l'accusa injustement de ne pas être équitable. Saad invoqua : « Ô Allah, s'il ment, prolonge sa vie, sa pauvreté et expose-le aux tentations ». L'homme vécut très vieux, aveugle, mendiant et racolant les femmes en disant : « Je suis un vieillard frappé par l'invocation de Saad »." },
                    { id: 503, title: "Le Manteau de Laine", content: "Sur son lit de mort, il demanda un vieux manteau de laine usé (Joubba) qu'il gardait précieusement dans un coffre. Il dit : « C'est avec cela que j'ai combattu les polythéistes à Badr. Je l'ai gardé pour ce jour ». Il fut son linceul." },
                    { id: 504, title: "La Retraite", content: "Lors de la Grande Discorde (Fitna), son fils vint le pousser à revendiquer le Califat. Saad lui tapa la poitrine et dit : « Tais-toi ! J'ai entendu le Prophète dire : Allah aime le serviteur riche (de cœur), pieux et discret ». Il mourut en paix dans son château d'Al-Aqiq." }
                ],
                hadiths: [
                    { text: "Ô Allah, vise bien par ses flèches et exauce son invocation !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam al-Nubula" },
                    { text: "Voici mon oncle (maternel); faites-moi donc voir un pareil oncle !", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" }
                ],
                quizData: [
                    { q: "Quelle était sa particularité physique ?", opts: ["Très grand et mince", "Petit et ventru", "Blond aux yeux bleus", "Unijambiste"], c: 1, exp: "Le Siyar le décrit comme petit, trapu, avec du ventre et une grosse tête." },
                    { q: "Quel objet a-t-il gardé toute sa vie pour son enterrement ?", opts: ["L'épée du Prophète", "Son manteau de Badr", "Un morceau de la Kaaba", "Une poignée de terre"], c: 1, exp: "Il a exigé d'être enterré dans la vieille laine qu'il portait le jour de Badr." },
                    { q: "Pourquoi ses invocations étaient-elles redoutées ?", opts: ["Il était magicien", "Le Prophète a prié pour qu'il soit exaucé", "Il était Calife", "Il avait un talisman"], c: 1, exp: "Le Prophète a dit : « Ô Allah, exauce Saad lorsqu'il T'invoque »." }
                ]
            },
            {
                id: 6,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saïd ibn Zayd",
                arabicName: "سعيد بن زيد",
                subtitle: "L'un des Dix Promis au Paradis",
                intro: "Le 'Neuvième' des élus. Il se convertit avant même que le Prophète n'entre à Dar al-Arqam. Homme de l'ombre mais pilier de la foi, il fut le premier gouverneur de Damas.",
                heroQuote: "Une seule bataille avec le Prophète vaut mieux que toutes vos œuvres, même si vous viviez la vie de Noé !",
                tags: ["10 Promis", "Muhajirun", "Gouverneur"],
                genealogy: "Saïd ibn Zayd ibn 'Amr ibn Noufayl. Cousin d'Oumar ibn Al-Khattab et époux de sa sœur Fatima. Son père Zayd était un monothéiste (Hanif) mort avant l'Islam.",
                physicalDesc: "Un homme très grand, au teint basané (mat) et très velu.",
                timeline: [
                    { year: "Pré-Islam", desc: "Son père Zayd meurt en cherchant la religion d'Ibrahim." },
                    { year: "Débuts", desc: "Converti très tôt. Oumar (non-musulman) le ligotait pour le punir." },
                    { year: "2 H", desc: "Absent de {Badr} (en mission d'espionnage avec Talha) mais récompensé comme présent." },
                    { year: "13 H", desc: "Participe au siège de {Damas} et en devient le premier gouverneur." },
                    { year: "51 H", desc: "Meurt à {Al-Aqiq} à plus de 70 ans. Saad et Ibn Oumar le mettent en terre." }
                ],
                narratives: [
                    { id: 601, title: "Le Neuvième Homme", content: "À la mosquée de Koufa, un homme insultait Ali. Saïd se leva et dit : « J'atteste que le Prophète a dit : 10 sont au Paradis... Abou Bakr, Oumar, Outhman, Ali... ». Les gens demandèrent « Qui est le 9ème ? ». Il dit : « C'est moi ». (Le 10ème étant le Prophète ou un autre compagnon selon les versions)." },
                    { id: 602, title: "La Voleuse de Terre", content: "Arwa bint Ouways l'accusa d'avoir volé un bout de sa terre. Saïd dit : « Prenez-la ! Ô Allah, si elle ment, rends-la aveugle et fais de sa terre son tombeau ». Elle devint aveugle peu après et tomba dans un puits sur cette même terre, qui devint sa tombe." },
                    { id: 603, title: "L'Espion de Badr", content: "Le Prophète l'envoya avec Talha pour espionner la caravane de Quraysh. Ils allèrent jusqu'à Al-Hawra. À leur retour, la bataille de Badr était finie. Le Prophète leur donna tout de même leur part de butin et de mérite." }
                ],
                hadiths: [
                    { text: "Les truffes (Kam'a) sont une manne divine et leur jus est un remède pour les yeux.", narrator: "Saïd ibn Zayd", source: "Bukhari / Muslim" },
                    { text: "Zayd (son père) sera ressuscité comme une communauté à lui seul.", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam al-Nubula" }
                ],
                quizData: [
                    { q: "Pourquoi était-il absent physiquement à Badr ?", opts: ["Malade", "En mission d'espionnage", "En voyage", "Pas converti"], c: 1, exp: "Il surveillait la caravane d'Abou Soufiane avec Talha sur ordre du Prophète." },
                    { q: "Quel est son lien avec Oumar ibn Al-Khattab ?", opts: ["Frère", "Cousin et beau-frère", "Oncle", "Fils"], c: 1, exp: "Ils sont cousins (Clan Adi) et Saïd a épousé Fatima, la sœur d'Oumar." },
                    { q: "Quelle invocation célèbre a-t-il faite ?", opts: ["Contre une voleuse de terre", "Pour la pluie", "Pour la richesse", "Pour la victoire"], c: 0, exp: "Il a invoqué contre Arwa qui l'accusait faussement, et elle devint aveugle." }
                ]
            },
            {
                id: 7,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mouss'ab ibn Oumayr",
                arabicName: "مُصْعَب بن عُمَيْر",
                subtitle: "Le Premier Ambassadeur de l'Islam",
                intro: "Le jeune homme le plus choyé de La Mecque qui sacrifia tout pour Allah. Premier émissaire à Médine, il mourut à Ouhoud si pauvre que son linceul ne couvrait pas son corps entier.",
                heroQuote: "Vous êtes aujourd'hui bien meilleurs [dans la pauvreté] que si vous étiez dans l'abondance !",
                tags: ["Martyrs", "Muhajirun", "Badriyun"],
                genealogy: "Mouss'ab ibn Oumayr... du clan {Abdari} (Banu Abd Ad-Dar). Surnommé « Le Noble », « Le Pionnier ».",
                physicalDesc: "Avant l'Islam : beau, parfumé et riche. Après l'Islam : Saad raconte qu'il avait « la peau sur les os, flétrie telle la peau d'un serpent » à cause de la famine, au point que les compagnons devaient le porter.",
                timeline: [
                    { year: "Mecque", desc: "Jeunesse dorée. Conversion secrète à Dar Al-Arqam. Emprisonné par sa mère." },
                    { year: "Médine", desc: "Premier émissaire (ambassadeur) envoyé pour enseigner le Coran aux Ansars." },
                    { year: "2 H", desc: "Porte l'étendard des Muhajirounes à la bataille de {Badr}." },
                    { year: "3 H", desc: "Meurt martyr à {Ouhoud}, tué par Ibn Qamia qui crut avoir tué le Prophète." }
                ],
                narratives: [
                    { id: 701, title: "L'Épreuve du Linceul", content: "À sa mort à {Ouhoud}, il ne possédait qu'un pagne à rayures. Si on couvrait sa tête, ses pieds dépassaient ; si on couvrait ses pieds, sa tête était exposée. Le Prophète (ﷺ) ordonna : « Couvrez sa tête et mettez de la citronnelle (Idhkhir) sur ses pieds »." },
                    { id: 702, title: "La Peau de Serpent", content: "Saad ibn Abi Waqas raconte : « Mouss'ab était le plus aisé d'entre nous... Mais la faim l'avait tellement touché que sa peau avait séché et pelait comme celle d'un serpent. Nous étions parfois obligés de le porter sur nos épaules tant il était faible. »" },
                    { id: 703, title: "Les Pleurs d'Abderrahman", content: "Bien plus tard, on servit un repas copieux à Abderrahman ibn 'Aouf. Il se mit à pleurer en disant : « Mouss'ab est mort et n'avait qu'un seul vêtement pour linceul... J'ai peur que nos récompenses nous aient été anticipées dans cette vie ! »." }
                ],
                hadiths: [
                    { text: "J'ai vu Mouss'ab à la Mecque, nul n'était plus choyé que lui. Il a tout quitté pour l'amour d'Allah.", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" },
                    { text: "Parmi les croyants, il est des hommes qui ont été sincères dans leur engagement...", narrator: "Verset 33:23", source: "Révélé à son sujet (et Talha/Anas)" }
                ],
                quizData: [
                    { q: "Quelle plante a servi à couvrir les pieds de Mouss'ab dans sa tombe ?", opts: ["Le Laurier", "L'Idhkhir (Citronnelle)", "Le Palmier", "L'Olivier"], c: 1, exp: "Son linceul étant trop court, le Prophète ordonna d'utiliser cette plante aromatique pour ses pieds." },
                    { q: "Pourquoi sa peau était-elle comparée à celle d'un serpent ?", opts: ["Une maladie", "La richesse", "La famine extrême", "Les brûlures"], c: 2, exp: "Saad raconte que la disette avait tellement asséché sa peau qu'elle pelait (mue) comme un serpent." }
                ]
            },
            {
                id: 8,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Salama",
                arabicName: "أبو سَلَمَة",
                subtitle: "Le Cousin Bien-Aimé",
                intro: "Cousin et frère de lait du Prophète (ﷺ). Il fut le premier à émigrer en Abyssinie. Blessé à Ouhoud, il mourut peu après, laissant une invocation célèbre à sa femme.",
                heroQuote: "Ô Allah, accorde à Oum Salama une suite meilleure à son malheur !",
                tags: ["Muhajirun", "Badriyun", "Frère de lait"],
                genealogy: "Abd-Allah ibn Abd Al-Assad, du clan {Makhzoum}. Fils de Barra (tante paternelle du Prophète). Frère de lait du Prophète (allaités par Thouwayba).",
                physicalDesc: "Un guerrier patient. Il mourut alors qu'il était encore dans la force de l'âge.",
                timeline: [
                    { year: "Abyssinie", desc: "Premier homme à émigrer (Hijra) en Abyssinie avec sa femme." },
                    { year: "2 H", desc: "Combat victorieusement à {Badr}." },
                    { year: "3 H", desc: "Blessé au bras à {Ouhoud}. La blessure semble guérir mais s'infecte plus tard." },
                    { year: "4 H", desc: "Dirige l'expédition de {Qatane} (150 hommes). Meurt de sa blessure infectée au mois de Joumada." }
                ],
                narratives: [
                    { id: 801, title: "L'Expédition de Qatane", content: "Au mois de Mouharram (an 4), le Prophète l'envoya attaquer les Banu Assad à Qatane avec 150 hommes. Il revint victorieux avec du butin, mais l'effort fit rouvrir sa blessure d'Ouhoud, ce qui causa sa mort." },
                    { id: 802, title: "Le Regard Figé", content: "Le Prophète (ﷺ) ferma les yeux d'Abou Salama à sa mort et dit : « Lorsque l'âme est saisie, le regard la suit ». Il entendit des gens se lamenter et dit : « N'invoquez pour vous que le bien, car les anges disent 'Amine' à ce que vous dites »." },
                    { id: 803, title: "L'Héritage Spirituel", content: "Il enseigna à sa femme Oum Salama l'invocation du malheur : « Ô Allah, rétribue-moi dans mon malheur et remplace-le par meilleur ». Elle l'appliqua et Allah lui donna le Prophète comme époux." }
                ],
                hadiths: [
                    { text: "Ô Allah, pardonne à Abou Salama, élève son degré parmi les guidés et prends en charge sa descendance !", narrator: "Le Prophète (ﷺ)", source: "Sahih Muslim" }
                ],
                quizData: [
                    { q: "Quel lien de parenté précis avait-il avec le Prophète ?", opts: ["Oncle maternel", "Frère de lait et Cousin", "Fils adoptif", "Beau-père"], c: 1, exp: "Il était le fils de sa tante Barra et ils avaient partagé la même nourrice." },
                    { q: "Quelle expédition a-t-il dirigée juste avant sa mort ?", opts: ["Mouta", "Qatane", "Hunayn", "Tabouk"], c: 1, exp: "L'expédition vers le mont Qatane contre les Banu Assad, d'où il revint blessé." }
                ]
            },
            {
                id: 9,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Outhman ibn Mazh'oune",
                arabicName: "عثمان بن مَظْعُون",
                subtitle: "L'Ascète de la Oumma",
                intro: "14ème converti et frère de lait du Prophète. Connu pour son ascétisme extrême (il voulait se castrer), il est le premier Émigré enterré au Baqi'. Le Prophète l'embrassa mort en pleurant.",
                heroQuote: "Tu es parti sans n'avoir joui d'elle [la vie] en quoique ce soit !",
                tags: ["Muhajirun", "Badriyun", "Ascète"],
                genealogy: "Outhman ibn Mazh'oune Al-Joumahi. Surnommé « Abou As-Saïb ». Frère de lait du Prophète.",
                physicalDesc: "Il avait la peau très mate (foncée) et une barbe dense.",
                timeline: [
                    { year: "Mecque", desc: "S'interdit le vin avant même l'Islam. 14ème converti." },
                    { year: "Hégire", desc: "Émigre en Abyssinie puis à Médine. Sa maison est localisée par le Prophète." },
                    { year: "3 H", desc: "Meurt après Badr (en Shabane). Premier enterré au {Baqi}." }
                ],
                narratives: [
                    { id: 901, title: "Le Refus du Monachisme", content: "Il voulait se faire castrer (ou s'abstenir des femmes) et vivre en ermite. Le Prophète (ﷺ) le lui interdit formellement : « Outhman, le monachisme n'a pas été prescrit pour nous. La meilleure religion est le monothéisme pur et tolérant (Hanifiya) »." },
                    { id: 902, title: "Les Larmes du Prophète", content: "À sa mort, le Prophète (ﷺ) embrassa son front. Aïsha raconte : « Je vis les larmes du Messager d'Allah couler sur les joues d'Outhman ». Il dit : « Tu nous as quittés sans t'être sali par ce bas-monde »." },
                    { id: 903, title: "Le Rocher du Baqi'", content: "Le Prophète plaça lui-même un gros rocher sur sa tombe pour la marquer, disant : « C'est la première de nos tombes, j'y enterrent les membres de ma famille » (c'est là qu'il enterra plus tard ses filles)." },
                    { id: 904, title: "L'Incident de la Louange", content: "Une femme (Oum Al-'Ala) dit devant le corps : « Je témoigne qu'Allah t'a honoré ». Le Prophète la reprit : « Qu'en sais-tu ? Je suis le Messager d'Allah et je ne sais pas ce qu'on fera de moi ! ». Cela effraya les compagnons sur leur propre sort." }
                ],
                hadiths: [
                    { text: "Le Prophète l'embrassa alors qu'il était mort, et je vis les larmes couler de ses yeux.", narrator: "Aïsha", source: "Tirmidhi" },
                    { text: "Rejoins notre excellent prédécesseur, Outhman ibn Mazh'oune !", narrator: "Le Prophète (à la mort de sa fille)", source: "Ibn Saad" }
                ],
                quizData: [
                    { q: "Quelle pratique extrême le Prophète lui a-t-il interdite ?", opts: ["Le jeûne continu", "La castration (monachisme)", "L'aumône totale", "Le silence"], c: 1, exp: "Il voulait se castrer pour éviter les tentations, ce que le Prophète a fermement rejeté." },
                    { q: "Quelle est sa primauté concernant Médine ?", opts: ["Premier martyr", "Premier gouverneur", "Premier Muhajir enterré au Baqi'", "Premier né"], c: 2, exp: "Il a inauguré le cimetière du Baqi' pour les émigrés." }
                ]
            },
            {
                id: 10,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Qoudama ibn Mazh'oune",
                arabicName: "قدَامَة بن مَظْعُون",
                subtitle: "Le Gouverneur Puni",
                intro: "Frère d'Outhman et oncle d'Ibn Oumar. Gouverneur de Bahreïn sous Omar, il est célèbre pour avoir été fouetté (peine légale) suite à une erreur d'interprétation du Coran.",
                heroQuote: "Il n'y a pas de péché pour ceux qui ont cru... (Le verset qu'il interpréta à tort)",
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
                    { id: 1001, title: "L'Erreur d'Interprétation", content: "Accusé d'avoir bu du vin, il se défendit en citant le verset 5:93 : « Pas de péché... pour ceux qui croient et font le bien ». Omar rejeta cette interprétation (le verset parlait du passé ou des cas de nécessité), le destitua et lui appliqua la peine (le fouet), prouvant que la loi s'applique à tous, même aux vétérans de Badr." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Pourquoi Omar l'a-t-il destitué de son poste de gouverneur ?", opts: ["Pour vol", "Pour incompétence", "Pour consommation d'alcool (erreur d'interprétation)", "Pour trahison"], c: 2, exp: "Il avait bu du vin en pensant à tort qu'un verset l'autorisait aux gens pieux." }
                ]
            },
            {
                id: 11,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Oubayda ibn Al-Harith",
                arabicName: "عبيدة بن الحارث",
                subtitle: "Le Doyen de Badr",
                intro: "Cousin âgé du Prophète. Il reçut la première bannière de l'Islam et fut le premier martyr des duels de Badr, la jambe tranchée.",
                heroQuote: "Ne suis-je pas un martyr, ô Messager d'Allah ?",
                tags: ["Ahl al-Bayt", "Martyrs", "Badriyun"],
                genealogy: "Oubayda ibn Al-Harith ibn Al-Mouttalib (cousin du père du Prophète). Sa mère est Soukhayla.",
                physicalDesc: "Il était âgé de 63 ans à Badr (10 ans de plus que le Prophète).",
                timeline: [
                    { year: "1 H", desc: "Premier chef d'expédition désigné par le Prophète (Thaniyat al-Marra)." },
                    { year: "2 H", desc: "Duel contre Outba à {Badr}. Jambe tranchée. Il meurt à As-Safra sur le chemin du retour." }
                ],
                narratives: [
                    { id: 1101, title: "Le Duel des Cousins", content: "À Badr, il fut le premier à sortir en duel. Il affronta Outba. Ils se frappèrent mutuellement. Hamza et Ali tuèrent Outba et portèrent Oubayda. Sa jambe était coupée et la moelle en coulait. Il dit au Prophète : « Si Abou Talib me voyait, il saurait que je suis digne de ses vers ». Le Prophète l'enterra à As-Safra." }
                ],
                quizData: [
                    { q: "Quelle distinction militaire détient-il ?", opts: ["Premier archer", "Premier chef d'expédition (Bannière)", "Premier cavalier", "Premier calife"], c: 1, exp: "Le Prophète a noué pour lui la première bannière de l'Islam avant Badr." },
                    { q: "Où est-il mort ?", opts: ["Sur le champ de Badr", "À Médine", "À As-Safra (au retour de Badr)", "À la Mecque"], c: 2, exp: "Il a survécu au duel mais est mort de sa blessure sur le chemin du retour." }
                ]
            },
            {
                id: 12,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Jahche",
                arabicName: "عبد الله بن جحش",
                subtitle: "L'Homme au Vœu Mutilé",
                intro: "Cousin du Prophète et premier « Émir des Croyants » (titre donné lors d'une expédition). Il demanda à Allah un martyre violent à Ouhoud et fut exaucé.",
                heroQuote: "Je dirai : 'Pour Toi et Ton Messager' !",
                tags: ["Ahl al-Bayt", "Martyrs", "Commandants"],
                genealogy: "Fils de Oumayma bint Abdelmoutalib (tante du Prophète). Frère de Zaynab (Mère des Croyants).",
                physicalDesc: "On le retrouva le nez et les oreilles coupés, suspendus à un fil.",
                timeline: [
                    { year: "2 H", desc: "Dirige l'expédition de Nakhla. Premier butin, premier captif de l'Islam." },
                    { year: "3 H", desc: "Meurt à {Ouhoud}. Enterré dans la même tombe que son oncle Hamza." }
                ],
                narratives: [
                    { id: 1201, title: "L'Invocation Terrible", content: "La veille d'Ouhoud, il invoqua : « Seigneur, envoie-moi un adversaire féroce. Je le combattrai, puis il me tuera, me coupera le nez et les oreilles. Quand je Te rencontrerai, Tu demanderas 'Pourquoi ?' et je dirai 'Pour Toi' ». Saad ibn Abi Waqas vit son vœu exaucé le lendemain." },
                    { id: 1202, title: "La Tombe Commune", content: "Il fut enterré dans la même tombe que le maître des martyrs, Hamza ibn Abdelmoutalib (son oncle), sur le champ de bataille d'Ouhoud." }
                ],
                quizData: [
                    { q: "Avec qui partage-t-il sa tombe ?", opts: ["Mouss'ab", "Hamza", "Le Prophète", "Ali"], c: 1, exp: "Lui et son oncle Hamza ont été enterrés ensemble à Ouhoud." }
                ]
            },
            {
                id: 13,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Houdhayfa",
                arabicName: "أبو حُذَيْفَة",
                subtitle: "L'Homme qui défia son Père",
                intro: "Fils d'Outba (le grand ennemi de l'Islam), il choisit la foi contre le sang. Il mourut en martyr, uni à son fils adoptif Salim.",
                heroQuote: "Laisse-le (ton père), ô Abou Houdhayfa !",
                tags: ["Martyrs", "Badriyun", "Yamama"],
                genealogy: "Mihsham (son vrai nom) ibn Outba ibn Rabi'a. Du clan Abd-Shams. Frère de Hind (femme d'Abou Soufiane).",
                physicalDesc: "Grand, beau visage, mais avec des dents qui se chevauchaient (ou espacées selon les versions), ce qui marquait son sourire.",
                timeline: [
                    { year: "Mecque", desc: "Conversion précoce. Émigre en Abyssinie." },
                    { year: "2 H", desc: "À {Badr}, il veut combattre son père Outba en duel mais le Prophète l'en empêche." },
                    { year: "12 H", desc: "Meurt martyr à la bataille d'{Al-Yamama} à 53 ans." }
                ],
                narratives: [
                    { id: 1301, title: "Le Lien du Sang Brisé", content: "À Badr, quand son père Outba défia les musulmans, Abou Houdhayfa se leva pour l'affronter. Le Prophète (ﷺ) l'ordonna de s'asseoir, ne voulant pas qu'il commette un parricide. Sa sœur Hind lui dédia un poème moqueur sur ses dents et sa 'trahison'." },
                    { id: 1302, title: "Unis dans la Mort", content: "On le retrouva mort sur le champ de bataille d'Al-Yamama. Son protégé Salim gisait à côté de lui, la tête de l'un aux pieds de l'autre. Ils vécurent ensemble et moururent ensemble." }
                ],
                quizData: [
                    { q: "Qui voulait-il tuer de ses propres mains à Badr ?", opts: ["Abou Jahl", "Son père Outba", "Son frère", "Abou Soufiane"], c: 1, exp: "Il voulait prouver sa foi en affrontant son propre père, chef des polythéistes." },
                    { q: "Quelle particularité physique avait-il ?", opts: ["Un œil borgne", "Des dents qui se chevauchaient", "Il était chauve", "Il boitait"], c: 1, exp: "Le Siyar mentionne ses dents chevauchées (ou espacées) ('Shateer')." }
                ]
            },
            {
                id: 14,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Salim Mawla Abou Houdhayfa",
                arabicName: "سَالِمٍ",
                subtitle: "Le Porteur du Coran",
                intro: "Esclave persan affranchi, il devint un imam de référence. Oumar ibn Al-Khattab le considérait digne d'être Calife.",
                heroQuote: "Si Salim était vivant, je l'aurais désigné comme successeur sans consulter personne !",
                tags: ["Martyrs", "Savants", "Coran"],
                genealogy: "Salim ibn Ma'qil. Originaire d'Istakhr (Perse). Affranchi de Thoubayta, femme d'Abou Houdhayfa, qui l'adopta.",
                physicalDesc: "Il récitait le Coran d'une voix qui captivait les cœurs.",
                timeline: [
                    { year: "Qouba", desc: "Imam des premiers émigrés (dont Oumar) car il connaissait le plus de Coran." },
                    { year: "Adoption", desc: "Sujet d'une fatwa unique sur l'allaitement de l'adulte pour rester dans sa famille adoptive." },
                    { year: "12 H", desc: "Porte-étendard à {Al-Yamama}. Creuse un trou pour ses pieds et meurt martyr." }
                ],
                narratives: [
                    { id: 1401, title: "Le Testament d'Omar", content: "Sur son lit de mort, le Calife Omar dit : « Si Salim était vivant, je l'aurais désigné successeur sans hésitation car j'ai entendu le Prophète dire : Salim aime Allah d'un amour véritable »." },
                    { id: 1402, title: "Le Trou de la Fermeté", content: "À Yamama, portant l'étendard, il dit : « Quel mauvais porteur de Coran je serais si l'ennemi passait par moi ! ». Il creusa un trou dans le sol pour y fixer ses pieds et ne pas reculer, combattant jusqu'à la mort." },
                    { id: 1403, title: "L'Héritage d'Omar", content: "À sa mort, comme il n'avait pas d'héritiers, Omar vendit ses biens (200 dirhams) et donna l'argent à sa mère adoptive en charité." }
                ],
                hadiths: [
                    { text: "Apprenez le Coran de quatre personnes : ... Salim le mawla d'Abou Houdhayfa.", narrator: "Le Prophète (ﷺ)", source: "Sahih Bukhari" },
                    { text: "Louange à Allah qui a mis dans ma communauté des hommes tels que toi !", narrator: "Le Prophète (après l'avoir écouté réciter)", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Pourquoi dirigeait-il la prière devant des grands compagnons comme Omar à Qouba ?", opts: ["Il était le plus âgé", "Il connaissait le plus de Coran", "Il était le maître des lieux", "Il était Qourashite"], c: 1, exp: "Sa mémorisation du Coran lui donnait la prééminence pour l'imamat." },
                    { q: "Comment est-il mort à Yamama ?", opts: ["En fuyant", "En protégeant l'étendard, pieds fixés au sol", "D'une flèche perdue", "De soif"], c: 1, exp: "Il s'était ancré dans le sol pour ne pas reculer d'un pouce." }
                ]
            },
            {
                id: 15,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Hamza Ibn Abdelmoutalib",
                arabicName: "حَمْزَة بن عبد المطلب",
                subtitle: "Le Lion d'Allah et le Maître des Martyrs",
                intro: "Oncle paternel du Prophète (ﷺ) et son frère de lait. Héros de Badr et martyr d'Ouhoud, il est surnommé « Asadullah » (Le Lion d'Allah). Sa mort affecta le Prophète jusqu'aux larmes.",
                heroQuote: "Je suis le Lion d'Allah !",
                tags: ["Martyrs", "Ahl al-Bayt", "Commandants", "Badriyun"],
                genealogy: "Hamza ibn Abdelmoutalib ibn Hashim. Surnommé « Abou Oumara » et « Abou Ya'la ». Il est l'oncle du Prophète et son frère de lait (allaités par Thouwayba).",
                physicalDesc: "Un guerrier redoutable. Wahchi le décrit à Ouhoud : « Il terrassait les hommes... Il ressemblait à un chameau cendré (gris) tant la poussière de la bataille l'avait recouvert. »",
                timeline: [
                    { year: "La Mecque", desc: "Sa conversion offre une protection immédiate au Prophète contre les Qurayshites." },
                    { year: "2 H", desc: "À {Badr}, il tue le champion des polythéistes Outba ibn Rabi'a en duel." },
                    { year: "3 H", desc: "Combat à {Ouhoud} avec deux épées en criant « Je suis le Lion d'Allah ». Tué par traîtrise." },
                    { year: "Funérailles", desc: "Le Prophète ne prie pas sur lui immédiatement (selon certains avis) mais pleure à chaudes larmes devant son corps mutilé." }
                ],
                narratives: [
                    { id: 1501, title: "L'Assassinat (Récit de Wahchi)", content: "Wahchi, esclave abyssin, raconte : « Je me cachais derrière un rocher... Hamza fauchait les hommes. Soudain, Siba' ibn Abd Al-Ouzza s'approcha. Hamza lui dit 'Approche fils d'exciseuse !' et le tua d'un coup. À cet instant, je lançai ma javeline. Elle entra dans son abdomen et ressortit entre ses jambes. Il essaya de se relever vers moi mais s'effondra. »" },
                    { id: 1502, title: "La Douleur du Prophète", content: "Découvrant Hamza éventré et mutilé (nez et oreilles coupés, foie arraché par Hind), le Prophète (ﷺ) pleura et dit : « Si Safiya (la sœur de Hamza) n'avait pas été attristée, je l'aurais laissé ainsi pour qu'il soit ressuscité depuis les ventres des fauves et des oiseaux ! »." },
                    { id: 1503, title: "Le Linceul Trop Court", content: "On ne trouva pour l'enterrer qu'un manteau rayé (Namira). Si on couvrait sa tête, ses pieds dépassaient. Si on couvrait ses pieds, sa tête dépassait. Le Prophète ordonna : « Couvrez sa tête et mettez de l'Idhkhir (citronnelle) sur ses pieds »." },
                    { id: 1504, title: "La Rédemption de Wahchi", content: "Wahchi se convertit plus tard. Le Prophète, peiné, lui demanda de ne plus montrer son visage. Des années après, Wahchi tua le faux prophète Moussaylima avec la même javeline, disant : « J'ai tué le meilleur des hommes (Hamza) et le pire d'entre eux ! »." }
                ],
                hadiths: [
                    { text: "Hamza ibn Abdelmoutalib est le Maître des Martyrs (Sayyid al-Shuhada) !", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Jabir" },
                    { text: "Les âmes des martyrs sont dans des oiseaux verts (émeraude) qui mangent au Paradis et nichent dans des lanternes d'or sous le Trône.", narrator: "Le Prophète (ﷺ)", source: "Sahih Muslim" },
                    { text: "Quant à Hamza, personne ne le pleure lui ! (Le Prophète entendant les pleureuses de Médine)", narrator: "Ibn Oumar", source: "Siyar A'lam al-Nubula" }
                ],
                quizData: [
                    { q: "Quelle arme a tué Hamza ?", opts: ["Une épée", "Une flèche", "Une javeline (Harba)", "Une pierre"], c: 2, exp: "Wahchi était un expert du lancer de javeline éthiopienne." },
                    { q: "Quel titre le Prophète a-t-il donné à Hamza ?", opts: ["L'Épée d'Allah", "Le Maître des Martyrs", "Le Véridique", "Le Sage"], c: 1, exp: "Il est Sayyid al-Shuhada." },
                    { q: "Quelle particularité a eu son enterrement ?", opts: ["Il a été lavé par les anges", "Il a été enterré sans linceul", "Son linceul était trop court", "Il a été enterré à la Mecque"], c: 2, exp: "On a dû utiliser de l'herbe (Idhkhir) pour couvrir ses pieds car le tissu était trop court." }
                ]
            },
            {
                id: 16,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Aqil ibn Al-Boukayr",
                arabicName: "عَاقِل بن البكير",
                subtitle: "L'Aîné de la Fratrie de Badr",
                intro: "L'un des quatre frères qui marquèrent l'histoire par leur conversion simultanée et leur participation collective à Badr. Il se nommait 'Ghafil' (L'Insouciant) avant que le Prophète ne le renomme.",
                heroQuote: "Le Messager d'Allah le rebaptisa 'Aqil (Le Bien-Pensant).",
                tags: ["Badriyun", "Fratrie", "Martyrs"],
                genealogy: "'Aqil ibn Al-Boukayr Al-Laythi. Allié (Halif) des Banou 'Adi (le clan d'Omar).",
                physicalDesc: "Il avait 34 ans lorsqu'il tomba martyr.",
                timeline: [
                    { year: "Mecque", desc: "Premier serment d'allégeance à Dar Al-Arqam avec ses frères." },
                    { year: "Hégire", desc: "Émigre avec toute sa famille; leurs maisons à La Mecque furent scellées." },
                    { year: "2 H", desc: "Participe à Badr avec ses trois frères (cas unique)." },
                    { year: "2 H", desc: "Meurt martyr à Badr, tué par Malik ibn Zouhayr." }
                ],
                narratives: [
                    { id: 161, title: "Le Changement de Nom", content: "Son nom pré-islamique était 'Ghafil' (L'Insouciant/Le Négligent). Le Prophète (ﷺ), préférant les noms porteurs de sens positif, le renomma 'Aqil (Le Raisonnable/Le Bien-Pensant)." },
                    { id: 162, title: "L'Exode Total", content: "La famille d'Al-Boukayr est citée comme l'exemple de l'engagement total : ils émigrèrent tous, hommes et femmes, laissant leurs maisons de La Mecque vides et scellées derrière eux." }
                ],
                hadiths: [
                    { text: "Le Messager d'Allah lui désigna Moubashir ibn Abd Al-Moundhir comme frère de foi. Ils furent tous deux tués à Badr.", narrator: "Ibn Saad", source: "Tabaqat" },
                    { text: "Les fils d'Al-Boukayr se convertirent tous les quatre en même temps.", narrator: "Yazid ibn Roumane", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel était son nom avant l'Islam ?", opts: ["Zayd", "Ghafil", "Harith", "Amr"], c: 1, exp: "Il s'appelait Ghafil (Insouciant), le Prophète l'a renommé 'Aqil." },
                    { q: "À quel âge est-il mort martyr ?", opts: ["20 ans", "34 ans", "50 ans", "63 ans"], c: 1, exp: "Il est tombé à Badr à l'âge de 34 ans." }
                ]
            },
            {
                id: 17,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khalid ibn Al-Boukayr",
                arabicName: "خالد بن البكير",
                subtitle: "Le Martyr d'Ar-Raji",
                intro: "Frère de 'Aqil. Il survécut à Badr pour tomber dans le guet-apens tragique d'Ar-Raji. Il avait le même âge que son frère à sa mort.",
                heroQuote: "Il participa aux batailles de Badr et d'Ouhoud.",
                tags: ["Badriyun", "Fratrie", "Martyrs"],
                genealogy: "Khalid ibn Al-Boukayr Al-Laythi.",
                physicalDesc: "Mort à 34 ans.",
                timeline: [
                    { year: "2 H", desc: "Combat à Badr." },
                    { year: "3 H", desc: "Combat à Ouhoud." },
                    { year: "4 H", desc: "Tué lors de l'expédition d'Ar-Raji' (trahison des tribus)." }
                ],
                narratives: [
                    { id: 171, title: "Le Frère de Foi", content: "À Médine, le Prophète (ﷺ) instaura un lien de fraternité unique entre lui et Zayd ibn Ad-Dathina. Le destin voulut qu'ils soient tous deux impliqués dans des fins tragiques (martyre)." }
                ],
                hadiths: [
                    { text: "Le Messager d'Allah lui désigna pour frère de foi Zayd ibn Ad-Dathina.", narrator: "Ibn Saad", source: "Tabaqat" }
                ],
                quizData: [
                    { q: "Lors de quel événement Khalid a-t-il été tué ?", opts: ["Badr", "Ouhoud", "Ar-Raji'", "Le Fossé"], c: 2, exp: "Il fut tué lors de l'expédition d'Ar-Raji en l'an 4." }
                ]
            },
            {
                id: 18,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Iyas ibn Al-Boukayr",
                arabicName: "إياس بن أبي البكير",
                subtitle: "Le Conquérant d'Égypte",
                intro: "Le troisième frère de la fratrie. Il eut une longue vie de combattant, participant à toutes les batailles du Prophète puis à la conquête de l'Égypte.",
                heroQuote: "Il participa à Badr et à toutes les batailles qui suivirent.",
                tags: ["Badriyun", "Fratrie", "Conquérants"],
                genealogy: "Iyas ibn Abou Al-Boukayr.",
                timeline: [
                    { year: "2 H", desc: "Présent à Badr." },
                    { year: "Campagnes", desc: "Participe à la conquête de l'Égypte sous le califat d'Omar/Othman." },
                    { year: "34 H", desc: "Décès." }
                ],
                narratives: [
                    { id: 181, title: "La Longévité au Combat", content: "Contrairement à ses frères 'Aqil et Khalid morts tôt, Iyas continua le combat bien après la mort du Prophète, portant l'héritage des 'Quatre de Badr' jusqu'en Afrique." }
                ],
                hadiths: [
                    { text: "Le Messager d'Allah lui désigna pour frère de foi Al-Harith ibn Khazma.", narrator: "Ibn Saad", source: "Tabaqat" }
                ],
                quizData: [
                    { q: "À quelle conquête majeure Iyas a-t-il participé ?", opts: ["La Perse", "L'Égypte", "L'Inde", "L'Espagne"], c: 1, exp: "Il a participé à l'ouverture (Fath) de l'Égypte." }
                ]
            },
            {
                id: 19,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Amir ibn Al-Boukayr",
                arabicName: "عامر بن أبي البكير",
                subtitle: "Le Quatrième Frère",
                intro: "Le dernier de cette fratrie unique. Il accompagna le Prophète dans toutes ses batailles avant de tomber martyr face à l'imposteur Musaylima.",
                heroQuote: "Les fils d'Abou Al-Boukayr ont le mérite d'être la seule fratrie de quatre à avoir participé à Badr.",
                tags: ["Badriyun", "Fratrie", "Martyrs"],
                genealogy: "'Amir ibn Abou Al-Boukayr.",
                timeline: [
                    { year: "2 H", desc: "Présent à Badr." },
                    { year: "11 H", desc: "Martyr à la bataille d'Al-Yamama." }
                ],
                narratives: [
                    { id: 191, title: "L'Unicité Historique", content: "L'Imam Dhahabi souligne : 'Les fils d'Abou Al-Boukayr ont le mérite d'être la seule fratrie de quatre à avoir participé à la bataille de Badr'. C'est un honneur qu'aucune autre famille ne partage." }
                ],
                hadiths: [
                    { text: "Le Messager d'Allah lui désigna pour frère de foi Thabit ibn Qays ibn Shammas (l'orateur).", narrator: "Ibn Saad", source: "Tabaqat" }
                ],
                quizData: [
                    { q: "Où 'Amir est-il mort ?", opts: ["Badr", "Ouhoud", "Al-Yamama", "Tabouk"], c: 2, exp: "Il est tombé martyr lors de la guerre contre l'apostasie (Yamama)." }
                ]
            },
            {
                id: 20,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mistah ibn Outhatha",
                arabicName: "مِسْطَح بن أُثَاثَة",
                subtitle: "Le Compagnon Pardonné",
                intro: "Cousin d'Abou Bakr et vétéran de Badr. Connu pour sa pauvreté et son implication involontaire dans l'affaire de la calomnie (Ifk), il fut pardonné par Allah et son Prophète.",
                heroQuote: "Sache qu'il compte bien parmi les occupants du Paradis !",
                tags: ["Badriyun", "Mouhajir", "Pardonné"],
                genealogy: "Mistah ibn Outhatha. Sa mère est la tante maternelle d'Abou Bakr (Raka bint Sakhr).",
                physicalDesc: "Petit de taille, les yeux enfoncés, de grosses mains.",
                timeline: [
                    { year: "2 H", desc: "Combat à Badr." },
                    { year: "6 H", desc: "Participe à la rumeur de l'Ifk. Puni puis pardonné." },
                    { year: "34 H", desc: "Décès à 56 ans." }
                ],
                narratives: [
                    { id: 201, title: "L'Avertissement de Dhahabi", content: "L'Imam Dhahabi écrit : 'Prends garde à regarder ce compagnon de Badr d'un mauvais œil pour une faute commise... Elle lui a été pardonnée. Sache qu'il est au Paradis !'. C'est une leçon sur le fait que les erreurs des grands hommes n'effacent pas leur rang." },
                    { id: 202, title: "La Révélation du Pardon", content: "Abou Bakr, qui l'entretenait, jura de couper les vivres à Mistah après la calomnie. Allah révéla : 'Que les détenteurs de richesse... ne jurent pas de ne plus aider... Qu'ils pardonnent'. Abou Bakr dit : 'J'aime qu'Allah me pardonne' et rendit l'aide à Mistah." }
                ],
                hadiths: [
                    { text: "Allah a regardé les gens de Badr et a dit : Faites ce que vous voulez, je vous ai pardonné.", narrator: "Hadith Qudsi (Général)", source: "S'applique à Mistah" },
                    { text: "Prends garde à regarder ce compagnon d'un mauvais œil !", narrator: "Ad-Dhahabi", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel lien de parenté avait-il avec Abou Bakr ?", opts: ["Frère", "Cousin maternel", "Oncle", "Fils"], c: 1, exp: "Sa mère était la tante d'Abou Bakr." },
                    { q: "Pourquoi est-il célèbre malgré sa faute ?", opts: ["Il a tué un chef", "Il est un vétéran de Badr pardonné", "Il était riche", "Il a fui"], c: 1, exp: "Sa participation à Badr lui a valu le pardon divin malgré son erreur dans l'affaire de l'Ifk." }
                ]
            },
            {
                id: 21,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou 'Abs",
                arabicName: "أبو عبس",
                subtitle: "Le Destructeur d'Idoles",
                intro: "L'un des rares Arabes lettrés avant l'Islam. Il purifia son clan en brisant leurs idoles et servit l'État islamique comme percepteur.",
                heroQuote: "Il était parmi les rares, à cette époque, à savoir écrire l'arabe.",
                tags: ["Ansar", "Badriyun", "Lettré"],
                genealogy: "Abou 'Abs (Abderrahman) ibn Jabr, des Aous.",
                physicalDesc: "Il savait écrire, une compétence rare.",
                timeline: [
                    { year: "Débuts", desc: "Détruit les idoles des Banou Haritha avec Abou Bourda." },
                    { year: "2 H", desc: "Badr." },
                    { year: "3 H", desc: "Participe à l'élimination du poète ennemi Kaab ibn Al-Ashraf." },
                    { year: "34 H", desc: "Décès à 70 ans. Outhman prie sur lui." }
                ],
                narratives: [
                    { id: 211, title: "L'Expédition de Kaab", content: "Il fit partie du commando restreint (avec Mohamed ibn Maslamah) qui débarrassa les musulmans de Kaab ibn Al-Ashraf, le poète qui insultait les femmes musulmanes et incitait à la guerre." },
                    { id: 212, title: "La Confiance des Califes", content: "Omar et Outhman lui firent tous deux confiance pour la tâche délicate de collecter la Zakat (l'aumône légale)." }
                ],
                hadiths: [
                    { text: "Le Messager d'Allah lui désigna Khounays ibn Houdhafa comme frère de foi.", narrator: "Ibn Saad", source: "Tabaqat" }
                ],
                quizData: [
                    { q: "Quelle compétence rare possédait-il ?", opts: ["Tir à l'arc", "Écriture", "Médecine", "Navigation"], c: 1, exp: "Il savait écrire l'arabe avant même l'Islam." },
                    { q: "Quelle mission secrète a-t-il accomplie ?", opts: ["Espionner à la Mecque", "Éliminer Kaab ibn Al-Ashraf", "Protéger le Prophète", "Négocier la paix"], c: 1, exp: "Il a participé à l'exécution du poète hostile Kaab ibn Al-Ashraf." }
                ]
            },
            {
                id: 22,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Malik ibn At-Tayihane",
                arabicName: "ابن التيهان",
                subtitle: "Le Monothéiste Précité",
                intro: "Connu sous le nom d'Abou Al-Haytham. Il rejetait les idoles avant même l'Islam. L'un des 12 chefs (Nuqaba) d'Aqaba et l'estimateur des récoltes du Prophète.",
                heroQuote: "Celui que l'on sollicite pour un conseil se doit d'être digne !",
                tags: ["Ansar", "Aqaba", "Badriyun"],
                genealogy: "Malik ibn At-Tayihane. Il prêchait le Tawhid avec As'ad ibn Zourara à l'époque pré-islamique.",
                timeline: [
                    { year: "Pré-Islam", desc: "Rejette les idoles." },
                    { year: "Aqaba", desc: "L'un des 12 chefs." },
                    { year: "Khaybar", desc: "Estime les récoltes pour le Prophète." },
                    { year: "20 H", desc: "Décès sous le califat d'Omar." }
                ],
                narratives: [
                    { id: 221, title: "L'Estimation et l'Invocation", content: "Le Prophète l'envoyait estimer les dattes de Khaybar. Plus tard, Abou Bakr voulut l'envoyer mais il refusa : 'Quand je partais pour le Prophète, il invoquait pour moi à mon retour'. Il ne voulait pas perdre cette baraka." }
                ],
                hadiths: [
                    { text: "Celui que l'on sollicite pour un conseil se doit d'être digne !", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Abou Al-Haytham" }
                ],
                quizData: [
                    { q: "Quelle était sa croyance avant l'Islam ?", opts: ["Juive", "Chrétienne", "Monothéiste (contre les idoles)", "Païenne"], c: 2, exp: "Il détestait les idoles et prêchait l'unicité de Dieu avant la venue du Prophète." },
                    { q: "Quelle fonction occupait-il à Khaybar ?", opts: ["Gouverneur", "Estimateur de récoltes", "Général", "Juge"], c: 1, exp: "Il évaluait la quantité de dattes pour l'impôt." }
                ]
            },
            {
                id: 23,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Jandal",
                arabicName: "أبو جندل",
                subtitle: "Le Prisonnier de la Foi",
                intro: "Fils de Souhayl ibn 'Amr. Emprisonné par son père pour sa foi, il s'échappa enchainé jusqu'à Houdaybiya mais fut renvoyé aux païens par respect du pacte.",
                heroQuote: "Ô musulmans, vers la mécréance vous me renvoyez !?",
                tags: ["Mouhajir", "Patience", "Martyr"],
                genealogy: "Al-Ass (son vrai nom) ibn Souhayl ibn 'Amr.",
                timeline: [
                    { year: "6 H", desc: "S'échappe et arrive à Houdaybiya en boitant avec ses chaînes." },
                    { year: "Retour", desc: "Rendu à son père par le Prophète selon le traité." },
                    { year: "18 H", desc: "Meurt martyr de la peste d'Emmaüs au Sham." }
                ],
                narratives: [
                    { id: 231, title: "Le Sacrifice du Pacte", content: "À Houdaybiya, son père Souhayl (négociateur païen) exigea son retour. Le Prophète (ﷺ) tenta de le garder, mais Souhayl refusa de signer la paix sinon. Abou Jandal cria son désespoir, mais le Prophète lui dit : 'Patiente, Allah te donnera une issue'. Il fut libéré plus tard." }
                ],
                hadiths: [
                    { text: "Son histoire est connue et rapportée dans l'Authentique.", narrator: "Ad-Dhahabi", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Pourquoi le Prophète l'a-t-il renvoyé à la Mecque ?", opts: ["Il l'a trahi", "Pour respecter le traité de Houdaybiya", "Abou Jandal le voulait", "Il était espion"], c: 1, exp: "Le traité stipulait que tout musulman fuyant la Mecque devait être rendu." }
                ]
            },
            {
                id: 24,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Souhayl",
                arabicName: "عَبْدُ الله بن سُهَيْل",
                subtitle: "L'Infiltré de Badr",
                intro: "Frère d'Abou Jandal. Il vint à Badr dans l'armée des polythéistes avec son père, puis traversa les lignes pour rejoindre le Prophète avant le combat.",
                heroQuote: "J'espère bien qu'Abd-Allah commencera par moi (dans son intercession) !",
                tags: ["Badriyun", "Martyrs", "Yamama"],
                genealogy: "Abd-Allah ibn Souhayl ibn 'Amr.",
                timeline: [
                    { year: "2 H", desc: "Change de camp à Badr et combat avec les musulmans." },
                    { year: "12 H", desc: "Meurt martyr à Al-Yamama à 38 ans." }
                ],
                narratives: [
                    { id: 241, title: "L'Espoir du Père", content: "Son père Souhayl, après sa conversion, apprit que le martyr intercède pour 70 proches. Il disait : 'J'espère qu'il commencera par moi', malgré le fait qu'ils étaient dans des camps opposés à Badr." }
                ],
                hadiths: [
                    { text: "Le martyr intercèdera pour soixante-dix membres de sa famille !", narrator: "Le Prophète (ﷺ) rapporté par Souhayl", source: "Al-Waqidi" }
                ],
                quizData: [
                    { q: "Comment a-t-il rejoint les musulmans ?", opts: ["À la Mecque", "En changeant de camp à Badr", "Après la conquête", "En Abyssinie"], c: 1, exp: "Il a feint d'être avec les païens pour sortir, puis a rejoint le Prophète sur le champ de bataille." }
                ]
            },
            {
                id: 25,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Souhayl ibn 'Amr",
                arabicName: "سُهَيْل بن عمرو",
                subtitle: "L'Orateur Repenti",
                intro: "La 'Voix' de Quraysh. Négociateur obstiné à Houdaybiya, il se convertit tardivement mais rattrapa son retard par une adoration intense, le jeûne et les larmes.",
                heroQuote: "Les choses nous ont été 'sahal' (facilitées) !",
                tags: ["Orateur", "Hudaybiya", "Ascète"],
                genealogy: "Souhayl ibn 'Amr. Surnommé Abou Yazid.",
                physicalDesc: "Sa peau et son apparence changèrent à force de jeûner et de prier après sa conversion.",
                timeline: [
                    { year: "2 H", desc: "Captif à Badr." },
                    { year: "6 H", desc: "Négocie le traité d'Houdaybiya." },
                    { year: "8 H", desc: "Conversion à la Conquête." },
                    { year: "15 H", desc: "Commandant à Yarmouk (ou mort de peste)." }
                ],
                narratives: [
                    { id: 251, title: "Le Discours de Stabilisation", content: "À la mort du Prophète (ﷺ), La Mecque faillit apostasier. Souhayl se leva et tint un discours puissant (similaire à celui d'Abou Bakr) qui raffermit l'Islam dans la ville sainte." },
                    { id: 252, title: "Les Larmes du Coran", content: "Après sa conversion, il pleurait abondamment en entendant le Coran, cherchant à expier son passé d'ennemi de l'Islam." }
                ],
                hadiths: [
                    { text: "Les choses nous ont été facilitées (Sahal) !", narrator: "Le Prophète (ﷺ) en voyant Souhayl", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Quel rôle a-t-il joué à la mort du Prophète ?", opts: ["Il a apostasié", "Il a prononcé un discours pour stabiliser la Mecque", "Il a pris le pouvoir", "Il a fui"], c: 1, exp: "Il a empêché les Mecquois de quitter l'Islam par son éloquence." }
                ]
            },
            {
                id: 26,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Bara ibn Malik",
                arabicName: "البراء بن مالك",
                subtitle: "L'Homme au Serment Exaucé",
                intro: "Frère d'Anas ibn Malik. Un guerrier dont le serment était exaucé par Allah. Il tua 100 hommes en duel. À Yamama, il se fit jeter dans le jardin ennemi pour ouvrir la porte.",
                heroQuote: "As-tu peur que je meure dans mon lit ?!",
                tags: ["Guerrier", "Martyrs", "Yamama"],
                genealogy: "Al-Bara ibn Malik Al-Ansari.",
                physicalDesc: "Il avait une apparence miséreuse (vieux vêtements), mais une valeur immense auprès d'Allah.",
                timeline: [
                    { year: "11 H", desc: "Se fait catapulter dans le jardin de la mort à Yamama." },
                    { year: "20 H", desc: "Martyr à Tustar (Shushtar) après avoir tué le Satrape." }
                ],
                narratives: [
                    { id: 261, title: "La Catapulte Humaine", content: "À Yamama, il demanda à ses compagnons : 'Portez-moi sur un bouclier et jetez-moi par-dessus le mur !'. Il atterrit seul au milieu de l'armée de Musaylima, combattit furieusement et ouvrit la porte aux musulmans." },
                    { id: 262, title: "Le Serment", content: "Quand la bataille devenait dure, les compagnons lui disaient : 'Jure par Allah, ô Bara !'. Il jurait la victoire et Allah la lui donnait." }
                ],
                hadiths: [
                    { text: "Combien de serviteurs... s'ils jurent par Allah, Il les exauce ! Al-Bara est l'un d'eux.", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" }
                ],
                quizData: [
                    { q: "Combien d'hommes a-t-il tués en duel ?", opts: ["10", "50", "100", "1000"], c: 2, exp: "Il a tué 100 champions en duel singulier, sans compter les mêlées." }
                ]
            },
            {
                id: 27,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Nawfal ibn Al-Harith",
                arabicName: "نَوْفَل",
                subtitle: "Le Doyen des Hashimites",
                intro: "Cousin du Prophète et doyen de la famille après Hamza et Abbas. Capturé à Badr, il devint ensuite un soutien indéfectible, fournissant 3000 lances à Hunayn.",
                tags: ["Ahl al-Bayt", "Cousin", "Soutien"],
                genealogy: "Nawfal ibn Al-Harith ibn Abdelmoutalib.",
                timeline: [
                    { year: "2 H", desc: "Capturé à Badr (côté païen), rançonné par Abbas." },
                    { year: "5 H", desc: "Émigre à Médine." },
                    { year: "8 H", desc: "Fournit 3000 lances pour la bataille de Hunayn." },
                    { year: "20 H", desc: "Décès." }
                ],
                narratives: [
                    { id: 271, title: "Le Soutien Logistique", content: "Bien que converti tardivement, il mit sa fortune au service de l'Islam en offrant 3000 lances pour l'armée lors de la bataille de Hunayn." }
                ],
                hadiths: [
                    { text: "Le Prophète le désigna comme frère de foi d'Al-Abbas (son oncle).", narrator: "Dhahabi", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Qu'a-t-il offert à l'armée musulmane à Hunayn ?", opts: ["100 chameaux", "3000 lances", "De l'or", "Des chevaux"], c: 1, exp: "Il a fourni un armement considérable pour soutenir le Prophète." }
                ]
            },
            {
                id: 28,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Harith ibn Nawfal",
                arabicName: "الحَارِث بن نَوْفَل",
                subtitle: "Le Gouverneur de La Mecque",
                intro: "Fils de Nawfal, il fut nommé gouverneur de la ville sainte par les califes. Il s'installa ensuite à Bassora.",
                tags: ["Gouverneur", "Ahl al-Bayt"],
                genealogy: "Al-Harith ibn Nawfal.",
                timeline: [
                    { year: "Conquête", desc: "Se convertit avec son père." },
                    { year: "Califat", desc: "Gouverneur de La Mecque sous Omar et Othman." },
                    { year: "70 ans", desc: "Décès à Bassora." }
                ],
                narratives: [
                    { id: 281, title: "La Confiance des Califes", content: "Sa compétence et sa noble lignée (Hashimite) firent de lui le choix naturel pour gouverner la Mecque sous les premiers califes." }
                ],
                hadiths: [
                    { text: "Le Prophète lui confia certaines responsabilités de son vivant.", narrator: "Dhahabi", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "De quelle ville fut-il gouverneur ?", opts: ["Médine", "La Mecque", "Koufa", "Yémen"], c: 1, exp: "Il a dirigé la ville sainte sous les Califes Bien Guidés." }
                ]
            },
            {
                id: 29,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Al-Harith",
                arabicName: "عَبْدُ الله بن الحارث",
                subtitle: "Le Gouverneur Baba",
                intro: "Surnommé 'Baba'. Né du vivant du Prophète, il fut choisi comme gouverneur par les habitants de Bassora eux-mêmes lors des troubles.",
                heroQuote: "Ô Baba, ô Baba, je marierai Baba...",
                tags: ["Gouverneur", "Tabi'i", "Ahl al-Bayt"],
                genealogy: "Abd-Allah ibn Al-Harith. Sa mère est Hind, sœur de Muawiya.",
                physicalDesc: "Béni par la salive du Prophète bébé.",
                timeline: [
                    { year: "Naissance", desc: "Le Prophète lui donne sa salive." },
                    { year: "Fitna", desc: "Élu gouverneur par les gens de Bassora." },
                    { year: "84 H", desc: "Décès à Oman (fuite)." }
                ],
                narratives: [
                    { id: 291, title: "Le Surnom Affectueux", content: "Sa tante Hind le berçait en chantant 'Ô Baba, beauté de la Kaaba'. Ce surnom lui resta toute sa vie." },
                    { id: 292, title: "L'Élection Populaire", content: "Fait rare : à la fuite du gouverneur omeyyade, les habitants de Bassora s'accordèrent unanimement pour le désigner comme chef, preuve de son immense popularité." }
                ],
                hadiths: [
                    { text: "Il a rapporté des récits d'Omar, Othman et Ali.", narrator: "Dhahabi", source: "Siyar A'lam" }
                ],
                quizData: [
                    { q: "Pourquoi s'est-il enfui à Oman ?", opts: ["Pour le commerce", "Pour fuir Al-Hajjaj", "Pour prêcher", "Pour se marier"], c: 1, exp: "Il craignait la tyrannie d'Al-Hajjaj lors de la répression." }
                ]
            },
            {
                id: 30,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Abd-Allah",
                arabicName: "عَبْدُ الله بن عَبْدِ الله",
                subtitle: "La Victime du Simoun",
                intro: "Surnommé Abou Yahya. Il mourut tragiquement à Al-Abwa, tué par un vent brûlant du désert alors qu'il accompagnait le calife.",
                heroQuote: "Le simoun eut raison de lui...",
                tags: ["Ahl al-Bayt", "Hashimite"],
                genealogy: "Abd-Allah ibn Abd-Allah ibn Al-Harith.",
                timeline: [
                    { year: "97 H", desc: "Meurt du vent Simoun à Al-Abwa." }
                ],
                narratives: [
                    { id: 301, title: "La Mort par le Vent", content: "Alors qu'il voyageait avec le calife Soulayman, une tempête de vent brûlant (Simoun) le frappa et le tua. Le calife pria sur lui." }
                ],
                hadiths: [
                    { text: "Il est un rapporteur digne de confiance.", narrator: "Ibn Saad", source: "Tabaqat" }
                ],
                quizData: [
                    { q: "Qu'est-ce qui a causé sa mort ?", opts: ["Une épée", "Le vent Simoun", "La peste", "Une chute"], c: 1, exp: "Un vent de désert brûlant et violent." }
                ]
            },
            {
                id: 31,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saïd ibn Al-Harith",
                arabicName: "سعيد بن الحارث",
                subtitle: "Le Cousin Discret",
                intro: "Cousin du Prophète. Peu de détails sont connus sur lui, si ce n'est qu'il rapporte un hadith fondamental sur la foi.",
                tags: ["Cousin", "Ahl al-Bayt"],
                genealogy: "Saïd ibn Al-Harith ibn Abdelmoutalib.",
                timeline: [
                    { year: "Vie", desc: "Compagnon cité par Al-Hakim." }
                ],
                narratives: [
                    { id: 311, title: "L'Unique Récit", content: "Dhahabi note qu'il est mentionné par Al-Hakim dans son Mustadrak comme compagnon, transmettant une parole d'espoir pour les croyants." }
                ],
                hadiths: [
                    { text: "Le Paradis est dû à quiconque rencontre Allah tout en étant croyant !", narrator: "Saïd ibn Al-Harith", source: "Al-Mustadrak" }
                ],
                quizData: [
                    { q: "Quelle est sa particularité généalogique ?", opts: ["Oncle du Prophète", "Cousin paternel du Prophète", "Frère de lait", "Fils adoptif"], c: 1, exp: "Il est le fils d'Al-Harith, l'oncle du Prophète." }
                ]
            },
            {
                id: 32,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Soufiane ibn Al-Harith",
                arabicName: "أبو سُفْيَان بن الحارث",
                subtitle: "Le Cousin Ressemblant",
                intro: "Cousin germain, frère de lait et sosie du Prophète. Après une longue hostilité, sa conversion fut exemplaire. Il tint la mule du Prophète à Hunayn quand tous fuyaient.",
                heroQuote: "Abou Soufiane ibn Al-Harith figure à la tête des jeunes du Paradis !",
                tags: ["Cousin", "Hunayn", "Poète", "Ahl al-Bayt"],
                genealogy: "Al-Moughira (son vrai nom) ibn Al-Harith. Frère de lait du Prophète (allaité par Halima).",
                physicalDesc: "Il ressemblait physiquement au Prophète.",
                timeline: [
                    { year: "8 H", desc: "Conversion avant la Conquête." },
                    { year: "8 H", desc: "Héros de Hunayn (tient la mule)." },
                    { year: "20 H", desc: "Décès à Médine (infection verrue)." }
                ],
                narratives: [
                    { id: 321, title: "L'Accueil Glacial puis Chaleureux", content: "Le Prophète refusa d'abord de le voir à cause de ses poèmes satiriques passés. Abou Soufiane dit : 'S'il ne m'accepte pas, je prendrai mon fils et j'irai mourir dans le désert'. Le Prophète, ému, l'accepta. Il devint ensuite un adorateur qui ne relevait jamais la tête devant le Prophète par pudeur." },
                    { id: 322, title: "La Verrue Fatale", content: "Au Hajj, le barbier coupa une verrue sur son crâne. Elle s'infecta et causa sa mort. Il dit à sa famille : 'Ne pleurez pas, car je n'ai commis aucun péché depuis ma conversion'." }
                ],
                hadiths: [
                    { text: "J'espère bien qu'il devienne le successeur de Hamza !", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" },
                    { text: "Abou Soufiane figure à la tête des jeunes du Paradis !", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Hisham" }
                ],
                quizData: [
                    { q: "Quelle ressemblance avait-il avec le Prophète ?", opts: ["Voix", "Physique", "Écriture", "Démarche"], c: 1, exp: "Il faisait partie des 4 personnes qui ressemblaient le plus au Prophète." },
                    { q: "Quel acte héroïque a-t-il fait à Hunayn ?", opts: ["Il a porté l'étendard", "Il a tenu la bride de la mule du Prophète sous les flèches", "Il a tué le chef ennemi", "Il a protégé les femmes"], c: 1, exp: "Il est resté à pied à côté du Prophète quand l'armée était en déroute." }
                ]
            },
            {
                id: 33,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Jafar ibn Abou Soufiane",
                arabicName: "جَعْفَر بن أبي سُفْيَان",
                subtitle: "Le Compagnon Fidèle",
                intro: "Fils d'Abou Soufiane ibn Al-Harith. Il partagea avec son père l'honneur de rester ferme à la bataille de Hunayn.",
                heroQuote: "Il resta courageusement aux côtés du Prophète le jour de Hounayn.",
                tags: ["Ahl al-Bayt", "Hunayn"],
                genealogy: "Jafar ibn Abou Soufiane.",
                timeline: [
                    { year: "8 H", desc: "Combat à Hunayn." },
                    { year: "Muawiya", desc: "Décès sous le règne de Muawiya." }
                ],
                narratives: [
                    { id: 331, title: "La Bravoure Héréditaire", content: "Comme son père, il ne fuit pas lors de l'embuscade de Hunayn, montrant la valeur des Ahl al-Bayt dans l'épreuve." }
                ],
                hadiths: [
                    { text: "Il demeure parmi les compagnons.", narrator: "Ibn Saad", source: "Tabaqat" }
                ],
                quizData: [
                    { q: "À quelle bataille s'est-il illustré avec son père ?", opts: ["Badr", "Ouhoud", "Hunayn", "Tabouk"], c: 2, exp: "Il est resté ferme à Hunayn." }
                ]
            },
  {
                id: 34,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Jafar ibn Abou Talib",
                arabicName: "جَعْفَر بن أبي طالب",
                subtitle: "Le Martyr aux Deux Ailes",
                intro: "Cousin du Messager d'Allah (ﷺ) et frère aîné d'Ali. Il ressemblait au Prophète physiquement et moralement. Héros de l'Abyssinie et de Mouta, il vole désormais au Paradis avec des ailes.",
                heroQuote: "Allah a remplacé mes mains par deux ailes avec lesquelles je vole au Paradis !",
                tags: ["Martyrs", "Ahl al-Bayt", "Abyssinie", "Mouta"],
                genealogy: "Jafar ibn Abou Talib ibn Abd-Manaf. Hachimite. Fils de Fatima bint Assad. Il est plus âgé qu'Ali de dix ans.",
                physicalDesc: "Il était l'homme qui ressemblait le plus au Prophète (ﷺ) tant dans son physique que dans son comportement (Khulq et Khalq).",
                timeline: [
                    { year: "Débuts", desc: "32ème converti à l'Islam." },
                    { year: "5 H", desc: "Émigre en Abyssinie avec son épouse Asma bint Oumays. Il y reste des années." },
                    { year: "7 H", desc: "Revient à Khaybar. Le Prophète l'embrasse entre les yeux et dit : « Je ne sais pas ce qui me réjouit le plus : la victoire ou l'arrivée de Jafar »." },
                    { year: "8 H", desc: "Meurt martyr à la bataille de {Mouta} à 33 ans (ou 41 ans), le corps criblé de 90 blessures." }
                ],
                narratives: [
                    { id: 341, title: "L'Avocat de l'Islam", content: "Devant le Négus (Roi d'Abyssinie), Jafar défendit les musulmans contre les accusations de Quraysh. Il récita le début de la Sourate Maryam (Kaf, Ha, Ya, 'Ayn, Sad). Le roi pleura jusqu'à mouiller sa barbe et dit : « Ces paroles et celles de Moïse sortent de la même niche lumineuse »." },
                    { id: 342, title: "Le Père des Nécessiteux", content: "Abou Hourayra disait : « Nul n'était meilleur pour les pauvres que Jafar ». Il les emmenait chez lui et leur donnait tout, même quand il ne restait qu'une outre de miel vide qu'ils déchiraient pour en lécher les traces." },
                    { id: 343, title: "La Danse de la Joie", content: "Lorsque le Prophète jugea en sa faveur pour la garde de la fille de Hamza, Jafar se leva et sautilla (dansa) autour du Prophète. Il expliqua : « C'est ce que font les Abyssins lorsqu'ils satisfont leurs rois ». Le Prophète ne le blâma pas." },
                    { id: 344, title: "Le Sacrifice de Mouta", content: "Porte-étendard à Mouta, il trancha les jarrets de son cheval (premier à faire cela en Islam) pour ne pas fuir. Il perdit sa main droite, prit l'étendard de la gauche, la perdit, puis le serra avec ses moignons contre sa poitrine jusqu'à être tué." }
                ],
                hadiths: [
                    { text: "Tu me ressembles dans ta constitution physique et ton comportement !", narrator: "Le Prophète (ﷺ)", source: "Sahih Al-Boukhari" },
                    { text: "J'ai vu Jafar au Paradis, il avait des ailes teintées de sang.", narrator: "Le Prophète (ﷺ)", source: "Siyar A'lam" },
                    { text: "Les gens sont issus d'arbres différents, mais moi et Jafar sommes issus du même arbre.", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Ibn Abbas" }
                ],
                quizData: [
                    { q: "Quelle sourate a-t-il récitée devant le Négus ?", opts: ["Al-Baqara", "Yasin", "Maryam", "Taha"], c: 2, exp: "Il a récité le passage concernant Marie et Jésus, ce qui a touché le cœur du roi chrétien." },
                    { q: "Quel est son surnom au Paradis ?", opts: ["Le Lion", "At-Tayyar (Le Volant)", "Le Véridique", "Le Sabre"], c: 1, exp: "Il est Jafar At-Tayyar, car Allah lui a donné des ailes pour remplacer ses bras coupés." }
                ]
            },
            {
                id: 35,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "'Aqil ibn Abou Talib",
                arabicName: "عقيل بن أبي طالب",
                subtitle: "L'Aîné des Hachimites",
                intro: "Frère aîné d'Ali et de Jafar. Capturé à Badr dans le camp adverse, il se convertit plus tard et fut aimé « doublement » par le Prophète. Il était expert en généalogie des Arabes.",
                heroQuote: "Abou Jahl est mort ! À présent, la voie t'est ouverte !",
                tags: ["Ahl al-Bayt", "Savant", "Badr"],
                genealogy: "'Aqil ibn Abou Talib. Surnommé Abou Yazid. Il est l'ancêtre d'une grande lignée de savants (dont le mouhadith Abd-Allah ibn Mouhammad ibn 'Aqil).",
                physicalDesc: "Il vécut très vieux et devint aveugle à la fin de sa vie.",
                timeline: [
                    { year: "2 H", desc: "Capturé à Badr (côté païen). N'ayant pas d'argent, c'est son oncle Al-Abbas qui paie sa rançon." },
                    { year: "8 H", desc: "Se convertit et émigre au début de l'année. Participe à la bataille de Mouta." },
                    { year: "Après 8 H", desc: "Le Prophète lui accorde un revenu annuel de 140 wasq de dattes de Khaybar." },
                    { year: "Muawiya", desc: "Décède sous le califat de Muawiya." }
                ],
                narratives: [
                    { id: 351, title: "Le Double Amour", content: "Le Prophète (ﷺ) lui dit un jour : « Ô Abou Yazid, je t'aime doublement : une fois pour ta parenté avec moi, et une fois car mon oncle (Abou Talib) t'aimait ! »." },
                    { id: 352, title: "L'Aiguille et le Fil", content: "De retour de l'expédition de Hounayn, il donna une aiguille à sa femme pour coudre. Quand le crieur annonça qu'il fallait rendre tout le butin, même une aiguille, 'Aqil la reprit à sa femme et la jeta dans le butin commun, par scrupule." },
                    { id: 353, title: "La Réponse Cinglante", content: "Captif à Badr, le Prophète lui demanda qui était tué parmi les chefs de Quraysh. 'Aqil apprit la mort d'Abou Jahl. Le Prophète lui dit : « La voie est désormais libre ! »." }
                ],
                hadiths: [
                    { text: "Je t'aime de deux amours : un amour pour toi et un amour pour l'amour qu'Abou Talib te portait.", narrator: "Le Prophète (ﷺ)", source: "At-Tabarani" }
                ],
                quizData: [
                    { q: "Qui a payé sa rançon après la bataille de Badr ?", opts: ["Lui-même", "Le Prophète", "Son oncle Al-Abbas", "Ali"], c: 2, exp: "Il était pauvre, c'est son oncle Al-Abbas qui a payé pour lui." },
                    { q: "Quelle science maîtrisait-il parfaitement ?", opts: ["Le tir à l'arc", "La généalogie des Arabes", "La médecine", "L'astronomie"], c: 1, exp: "Il était la référence pour connaître les lignées et les histoires des tribus arabes." }
                ]
            },
            {
                id: 36,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Zayd ibn Haritha",
                arabicName: "زيد بن حارثة",
                subtitle: "Le Bien-Aimé (Al-Hibb)",
                intro: "Le seul compagnon cité par son nom dans le Coran. Enlevé enfant, esclave, puis fils adoptif du Prophète, il fut le premier général de l'Islam à Mouta. Il préféra le Prophète à son propre père.",
                heroQuote: "Par Allah, je ne choisirai personne d'autre que toi !",
                tags: ["Commandants", "Martyrs", "Coran", "Affranchi"],
                genealogy: "Zayd ibn Haritha des Banou Kalb. Surnommé « Le Bien-Aimé » (Al-Hibb).",
                physicalDesc: "Il était petit de taille, la peau très noire (châtain très foncé) et avait le nez épaté (camus).",
                timeline: [
                    { year: "Enfance", desc: "Enlevé par des cavaliers, vendu au marché de 'Ukaz pour 700 dirhams à Khadija qui l'offre au Prophète." },
                    { year: "Adoption", desc: "Appelé 'Zayd ibn Mouhammad' jusqu'à l'interdiction de l'adoption (Verset 33:5)." },
                    { year: "Missions", desc: "Commande 7 expéditions militaires." },
                    { year: "8 H", desc: "Premier émir à Mouta. Meurt martyr à 55 ans transpercé par les lances." }
                ],
                narratives: [
                    { id: 361, title: "Le Choix du Cœur", content: "Son père et son oncle retrouvèrent sa trace et vinrent le réclamer à la Mecque. Le Prophète laissa le choix à Zayd. Zayd dit : « Je ne choisirai personne contre toi. Tu es pour moi un père et une mère ». Son père s'écria : « Malheur à toi, tu préfères l'esclavage à la liberté et à ta famille ? ». Zayd confirma. Le Prophète l'affranchit et l'adopta sur le champ." },
                    { id: 362, title: "La Rencontre de Zayd ibn 'Amr", content: "Avant l'Islam, le Prophète et Zayd rencontrèrent le monothéiste Zayd ibn 'Amr. Ils lui offrirent de la viande. Zayd ibn 'Amr refusa car elle était sacrifiée aux idoles. Depuis ce jour, le Prophète ne toucha plus jamais aux idoles." },
                    { id: 363, title: "L'Accueil Chaleureux", content: "De retour de voyage, Zayd frappa à la porte du Prophète. Le Prophète se leva précipitamment, traînant son vêtement (le torse mi-nu), pour le serrer dans ses bras et l'embrasser." }
                ],
                hadiths: [
                    { text: "Puis, quand Zayd eut cessé toute relation avec elle... (Seule mention d'un compagnon dans le Coran)", narrator: "Coran (33:37)", source: "Sourate Al-Ahzab" },
                    { text: "Tu es notre frère et notre mawla (allié/affranchi) !", narrator: "Le Prophète (ﷺ)", source: "Sahih Al-Boukhari" },
                    { text: "Par Allah, il était certes digne du commandement (l'Emirat) et il était l'un des hommes que j'aimais le plus.", narrator: "Le Prophète (ﷺ)", source: "Sahih Al-Boukhari" }
                ],
                quizData: [
                    { q: "Quelle est sa particularité unique dans le Coran ?", opts: ["Il a une sourate à son nom", "Il est cité nommément (Zayd)", "Il est appelé 'Fils du Prophète'", "Il n'est pas cité"], c: 1, exp: "C'est le seul compagnon dont le prénom 'Zayd' est mentionné explicitement dans le verset 37 de la sourate 33." },
                    { q: "Comment le décrivent les textes ?", opts: ["Grand et blond", "Petit et noir de peau", "Roux et fort", "Albinos"], c: 1, exp: "Le Siyar précise qu'il était petit, très mat de peau (châtain foncé/noir) avec un nez plat." }
                ]
            },
            {
                id: 37,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abd-Allah ibn Rawaha",
                arabicName: "عبد الله بن رواحة",
                subtitle: "Le Poète Martyr",
                intro: "Grand poète des Ansar et troisième commandant de Mouta. Ses vers défendaient le Prophète plus efficacement que des flèches. Il motiva l'armée face aux Byzantins.",
                heroQuote: "Ô mon âme ! Si tu ne meurs pas (au combat), tu mourras quand même (de vieillesse) !",
                tags: ["Poète", "Ansar", "Scribe", "Mouta"],
                genealogy: "Abd-Allah ibn Rawaha des Banou Al-Harith (Khazraj). Oncle maternel de Nou'man ibn Bachir.",
                physicalDesc: "Il était scribe à une époque où l'écriture était rare.",
                timeline: [
                    { year: "Aqaba", desc: "L'un des doyens (Nuqaba) du pacte d'Aqaba." },
                    { year: "Badr", desc: "Participe à Badr et Ouhoud." },
                    { year: "7 H", desc: "Envoyé à Khaybar pour estimer les récoltes de dattes." },
                    { year: "8 H", desc: "Meurt martyr à Mouta après avoir pris l'étendard." }
                ],
                narratives: [
                    { id: 371, title: "La Foi de l'Instant", content: "Il disait souvent à ses compagnons : « Venez, asseyons-nous et croyons (renouvelons notre foi) un instant (Nou'min Sa'a) ! ». Le Prophète (ﷺ) disait : « Qu'Allah fasse miséricorde à Ibn Rawaha, il aime les assises dont les anges sont fiers »." },
                    { id: 372, title: "Le Discours de Ma'an", content: "Face à l'armée romaine de 200 000 hommes, les musulmans hésitèrent. Ibn Rawaha les harangua : « Ô gens ! Ce que vous détestez (la mort) est ce pour quoi vous êtes sortis ! Nous ne combattons pas par le nombre, mais par cette Religion ! ». L'armée avança." },
                    { id: 373, title: "L'Estimation Juste", content: "Les Juifs de Khaybar voulurent le corrompre avec des bijoux pour qu'il allège leur impôt. Il dit : « Vous êtes les créatures que je déteste le plus (pour avoir tué des prophètes)... mais cela ne me poussera pas à être injuste envers vous. La corruption est du feu (Souht) ! ». Ils dirent : « C'est sur cette justice que tiennent les cieux et la terre »." }
                ],
                hadiths: [
                    { text: "Et s'il arrive quelque chose à Ibn Rawaha, alors que les musulmans se choisissent un chef !", narrator: "Le Prophète (ﷺ)", source: "Sahih Al-Boukhari" },
                    { text: "Laisse-le (réciter ses poèmes) ô Omar ! Car ses vers s'abattent sur eux plus vite que les flèches !", narrator: "Le Prophète (ﷺ)", source: "Tirmidhi" }
                ],
                quizData: [
                    { q: "Quelle était sa fonction à Khaybar ?", opts: ["Gouverneur", "Juge", "Estimateur de récoltes (Khars)", "Général"], c: 2, exp: "Il estimait la quantité de dattes sur les palmiers pour calculer la part des musulmans." },
                    { q: "Quelle fut sa fin ?", opts: ["Mort dans son lit", "Martyr à Mouta", "Empoisonné", "Noyé"], c: 1, exp: "Il prit l'étendard après la mort de Zayd et Jafar, et combattit jusqu'à la mort." }
                ]
            },
			{
                id: 38,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Koulthoum ibn Al-Hidm",
                arabicName: "كُلْثُوم بن الهِدْم",
                subtitle: "L'Hôte de Qouba",
                intro: "Le doyen (Shaykh) des Ansars chez qui le Prophète (ﷺ) séjourna à son arrivée à Qouba lors de l'Hégire. Sa maison fut le premier foyer du Messager d'Allah à Médine.",
                heroQuote: "Le Prophète descendit chez lui à Qouba avant d'entrer à Médine.",
                tags: ["Ansar", "Hôte", "Qouba"],
                genealogy: "Koulthoum ibn Al-Hidm... Al-Aoussi. De la branche des Banou 'Amr ibn 'Aouf.",
                physicalDesc: "Un homme âgé et respecté, doyen de sa tribu.",
                timeline: [
                    { year: "Hégire", desc: "Accueille le Prophète à son arrivée à Qouba (lundi 12 Rabi' al-Awwal)." },
                    { year: "1 H", desc: "Décède peu après l'arrivée du Prophète, avant la bataille de Badr." }
                ],
                narratives: [
                    { id: 381, title: "L'Hospitalité Première", content: "Bien que le Prophète tînt ses assemblées chez Saad ibn Khaythama (pour les célibataires), c'est bien chez Koulthoum ibn Al-Hidm qu'il logeait physiquement et dormait lors de son séjour à Qouba." }
                ],
                hadiths: [
                    { text: "Le Messager d'Allah logea chez Koulthoum ibn Al-Hidm à Qouba.", narrator: "Ibn Ishaq", source: "Sira" }
                ],
                quizData: [
                    { q: "Quel est le mérite unique de Koulthoum ?", opts: ["Il a tué Abou Jahl", "Il a hébergé le Prophète à Qouba", "Il a construit la Kaaba", "Il était le premier muezzin"], c: 1, exp: "Il fut le premier hôte du Prophète avant son entrée dans Médine même." }
                ]
            },
            {
                id: 39,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Doujana",
                arabicName: "أبو دُجَانَة",
                subtitle: "Le Bandeau de la Mort",
                intro: "Guerrier redoutable qui portait un bandeau rouge lorsqu'il s'apprêtait à combattre à mort. Il protégea le Prophète de son propre corps à Ouhoud et mourut en héros à Yamama.",
                heroQuote: "Je suis un homme à qui le fidèle a promis... Avec l'épée d'Allah, je vaincrai l'ennemi !",
                tags: ["Ansar", "Guerrier", "Ouhoud", "Yamama"],
                genealogy: "Simak ibn Kharasha (Abou Doujana). Frère de foi de 'Outba ibn Ghazouane.",
                physicalDesc: "Il marchait avec fierté (se dandinant) entre les rangs ennemis avant le combat.",
                timeline: [
                    { year: "3 H", desc: "Prend l'épée du Prophète à Ouhoud et sort avec son bandeau rouge." },
                    { year: "11 H", desc: "Se jette dans le 'Jardin de la Mort' à Yamama, se casse la jambe mais continue à combattre jusqu'à la mort." }
                ],
                narratives: [
                    { id: 391, title: "Le Droit de l'Épée", content: "Le Prophète tendit une épée en demandant : « Qui la prendra avec son droit ? ». Les hommes hésitèrent. Abou Doujana demanda : « Quel est son droit ? ». Le Prophète dit : « Que tu combattes avec jusqu'à ce qu'elle se torde ». Il la prit." },
                    { id: 392, title: "La Marche Orgueilleuse", content: "Il sortit avec son bandeau rouge et marcha avec fierté entre les rangs. Le Prophète dit : « C'est une démarche qu'Allah déteste, sauf dans une telle circonstance (face à l'ennemi) »." },
                    { id: 393, title: "Le Visage Lumineux", content: "Malade, son visage restait resplendissant. Il expliqua : « Deux œuvres me donnent espoir : je ne parle pas de ce qui ne me regarde pas, et mon cœur est sain envers les musulmans »." }
                ],
                hadiths: [
                    { text: "Je me revois à Ouhoud, seul avec Jibril à ma droite et Talha à ma gauche (Abou Doujana les protégeait).", narrator: "Le Prophète (ﷺ)", source: "Rapporté par Abou Hourayra" }
                ],
                quizData: [
                    { q: "Que signifiait le bandeau rouge d'Abou Doujana ?", opts: ["Qu'il était blessé", "Qu'il allait combattre jusqu'à la mort", "Qu'il était chef", "Qu'il se rendait"], c: 1, exp: "C'était son 'bandeau de la mort', signe qu'il ne reculerait pas." },
                    { q: "Quelle était sa qualité secrète qui illuminait son visage ?", opts: ["Le jeûne", "La prière de nuit", "Le cœur sain envers les musulmans", "L'aumône"], c: 2, exp: "Il disait n'avoir aucune haine contre un musulman." }
                ]
            },
            {
                id: 40,
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khoubayb ibn 'Adi",
                arabicName: "خُبَيْب بن عَدِي",
                subtitle: "Le Crucifié qui Pria",
                intro: "Capturé par traîtrise lors de l'expédition d'Ar-Raji', il fut vendu aux Qurayshites. Il est le premier à avoir instauré la tradition de prier deux unités de prière avant d'être exécuté.",
                heroQuote: "Ô Allah, dénombre-les et tue-les, un à un, sans en épargner un seul !",
                tags: ["Martyrs", "Badr", "Prière"],
                genealogy: "Khoubayb ibn 'Adi... Le Ansari.",
                timeline: [
                    { year: "2 H", desc: "Tue Al-Harith ibn 'Amir à Badr." },
                    { year: "4 H", desc: "Trahi à Ar-Raji', vendu aux enfants de sa victime à la Mecque." },
                    { year: "Exécution", desc: "Crucifié au Tan'im. Prie 2 rakats avant de mourir." }
                ],
                narratives: [
                    { id: 401, title: "La Tradition des Deux Rakats", content: "Avant son exécution, il demanda à prier. Après deux unités rapides, il dit : « Si vous n'aviez pas pensé que je faisais cela par peur de la mort, j'aurais prié plus longtemps ». Il instaura ainsi cette sunna pour les condamnés à mort." },
                    { id: 402, title: "Le Miracle du Raisin", content: "Sa geôlière (Mawiya) témoigna l'avoir vu manger une grappe de raisin de la taille d'une tête d'homme, alors qu'il n'y avait pas de fruits à la Mecque à cette époque et qu'il était enchaîné." },
                    { id: 403, title: "L'Invocation contre les Traîtres", content: "Sur le patibulum, il invoqua contre ses bourreaux. Mouawiya (alors païen) se jeta au sol par peur d'être touché par cette invocation." }
                ],
                hadiths: [
                    { text: "Ô Allah, certes nous avons transmis le message de ton Prophète; transmets-lui donc ce matin ce qui nous arrive !", narrator: "Khoubayb (Invocation)", source: "Sur le lieu d'exécution" }
                ],
                quizData: [
                    { q: "Quelle tradition a-t-il instaurée avant de mourir ?", opts: ["Réciter la Shahada", "Prier deux unités de prière", "Demander de l'eau", "Faire un discours"], c: 1, exp: "Il est le premier musulman à avoir prié deux rakats avant d'être exécuté." },
                    { q: "Qui a-t-il tué à Badr (ce qui causa sa vendetta) ?", opts: ["Abou Jahl", "Al-Harith ibn 'Amir", "Oumaya", "Walid"], c: 1, exp: "Il fut acheté par les fils d'Al-Harith pour venger leur père." }
                ]
            },
            {
                id: 41,
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                    { year: "13 H", desc: "Martyr à Ajnadayne avec ses frères." }
                ],
                narratives: [
                    { id: 491, title: "La Protection d'Outhman", content: "Lorsqu'Outhman vint négocier à la Mecque (Houdaybiya), Abane (alors païen) le prit sous sa protection et le fit monter sur sa selle, lui permettant de circuler en sécurité." },
                    { id: 492, title: "La Mort des Trois Frères", content: "Lui et ses deux frères (Khalid et 'Amr) moururent tous en martyrs lors de la conquête du Sham (Ajnadayne ou Yarmouk), un sacrifice familial immense." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Qui a-t-il protégé lors de l'incident d'Houdaybiya ?", opts: ["Le Prophète", "Outhman ibn Affan", "Abou Bakr", "Ali"], c: 1, exp: "Il a pris son cousin Outhman sous sa protection pour qu'il puisse négocier à la Mecque." }
                ]
            },
            {
                id: 50,
                verified: true,
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
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-'Ala ibn Al-Hadrami",
                arabicName: "العَلاء بن الحَضْرَمي",
                subtitle: "L'Homme aux Miracles",
                intro: "Gouverneur du Bahreïn célèbre pour ses miracles (Karama) : il traversa la mer à cheval avec son armée et fit jaillir l'eau du désert par son invocation.",
                heroQuote: "Ô Omniscient, Ô Indulgent, Ô Très-Haut... Abreuve-nous !",
                tags: ["Gouverneur", "Miracle", "Bahreïn"],
                genealogy: "Al-'Ala ibn Abd-Allah... Al-Hadrami. Allié des Banou Oumaya.",
                timeline: [
                    { year: "Mandat", desc: "Gouverneur de Bahreïn sous le Prophète, Abou Bakr et Omar." },
                    { year: "Miracle", desc: "Traverse la mer à pied/cheval pour attaquer Darine." },
                    { year: "21 H", desc: "Décès. Son corps est enterré sans niche, creusé avec des épées, puis disparait." }
                ],
                narratives: [
                    { id: 511, title: "La Traversée de la Mer", content: "Face à l'ennemi à Darine, séparé par la mer, il invoqua Allah. Lui et son armée traversèrent l'eau en marchant (ou à cheval) sans même se mouiller les pieds, un exploit stupéfiant témoigné par Abou Hourayra." },
                    { id: 512, title: "L'Eau du Désert", content: "Dans le désert du Dahna, assoiffé, il pria deux rakats et invoqua Allah. Une nuée apparut et il plut immédiatement. Ils remplirent leurs outres et l'eau disparut après leur départ." }
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Saad ibn Oubada",
                arabicName: "سعد بن عبادة",
                subtitle: "Le Doyen des Khazraj",
                intro: "Chef incontesté des Khazraj et porteur de l'étendard des Ansar lors des conquêtes. Sa générosité était proverbiale : son plat de nourriture suivait le Prophète (ﷺ) chaque soir. Il mourut de façon mystérieuse en Syrie.",
                heroQuote: "Ô Allah, pourvois-moi d'argent; il est certes indispensable à l'entreprise des œuvres !",
                tags: ["Ansar", "Khazraj", "Généreux", "Chef"],
                genealogy: "Saad ibn Oubada ibn Doulaym... Le doyen des Khazraj. Sa mère (Amra) décéda alors qu'elle devait accomplir un vœu.",
                physicalDesc: "Un homme d'une grande corpulence, noble et généreux. On raconte que sa peau verdit après sa mort étrange.",
                timeline: [
                    { year: "Avant l'Hégire", desc: "Participe au serment d'allégeance d'Al-'Aqaba et compte parmi les douze apôtres (Nuqaba)." },
                    { year: "2 H", desc: "Prépare l'expédition de Badr mais est mordu par un serpent (ou malade) juste avant. Le Prophète lui accorde sa part de butin." },
                    { year: "Vie du Prophète", desc: "Fait envoyer quotidiennement une écuelle de viande ou de lait au Prophète dans ses demeures." },
                    { year: "11 H", desc: "Candidat au califat à la Saqifa. Refuse de prêter allégeance à Abou Bakr puis à Oumar par fierté tribale." },
                    { year: "15 H", desc: "S'exile au Hauran (Syrie) et y meurt mystérieusement. On ne retrouva son corps qu'après avoir entendu des djinns." }
                ],
                narratives: [
                    { id: 551, title: "L'Ombre de la Générosité", content: "Lorsque le Prophète (ﷺ) arriva à Médine, Saad instaura une coutume : chaque soir, une écuelle de 'Tharid' (viande et bouillon) ou de lait ou de graisse était envoyée au Prophète, le suivant tour à tour chez ses épouses. Le Prophète invoquait : « Ô Allah, accorde Tes bénédictions à la famille de Saad ibn Oubada »." },
                    { id: 552, title: "La Jalousie Légendaire", content: "Saad était d'une jalousie (Ghayra) extrême pour son honneur. Il jura : « Si je voyais un homme avec ma femme, je le frapperais du tranchant de l'épée ! ». Le Prophète (ﷺ) dit : « Vous étonnez-vous de la jalousie de Saad ? Par Allah, je suis plus jaloux que lui et Allah est plus jaloux que moi ! »." },
                    { id: 553, title: "La Mort par les Djinns", content: "Il s'isola au Hauran en Syrie. On le retrouva mort dans son bain (ou après avoir uriné debout), sa peau devenue verdâtre. Une voix invisible (Djinn) récita : « Nous avons tué le seigneur des Khazraj, Saad ibn Oubada... Nous lui avons décoché deux flèches qui n'ont pas manqué son cœur »." }
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
                verified: true,
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
                    { id: 564, title: "L'Étreinte de la Tombe", content: "Malgré son rang immense qui fit bouger le Trône, le Prophète (ﷺ) dit après son enterrement : « La tombe a serré Saad d'une étreinte... Si quelqu'un avait dû y échapper, c'eût été lui. Puis Allah l'a relâché »." }
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                    { year: "11 H", desc: "Tué en martyr par Toulayha (le faux prophète) lors de la bataille de Bouzakha." }
                ],
                narratives: [
                    { id: 601, title: "L'Épée Miraculeuse", content: "À Badr, son épée se brisa. Le Prophète (ﷺ) lui donna une branche d'arbre (ou racine). En la secouant, elle devint une épée d'acier blanc tranchante. Il l'appela 'Al-Awn' (Le Secours) et combattit avec jusqu'à sa mort." },
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                    { year: "8 H", desc: "Décès des suites de sa blessure ancienne." }
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
                verified: true,
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
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Abou Zayd Al-Ansari",
                arabicName: "أَبُو زَيْد",
                subtitle: "Le Collecteur du Coran",
                intro: "L'un des 4 (ou 6) compagnons à avoir mémorisé tout le Coran du vivant du Prophète. Son nom est Saad ibn Oubayd (ou autre selon divergence).",
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                    { year: "20 H", desc: "Meurt à Damas à environ 60 ans. Enterré au cimetière de la Petite Porte (Bab As-Saghir)." }
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
                verified: true,
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
                    { year: "Hégire", desc: "Arrive à Médine juste après Mouss'ab pour enseigner le Coran aux habitants." },
                    { year: "Gouvernance", desc: "Le Prophète le laisse plusieurs fois gouverneur de Médine lors de ses expéditions." },
                    { year: "15 H", desc: "Meurt martyr à la bataille d'{Al-Qadisiyya} en tenant l'étendard." }
                ],
                narratives: [
                    { id: 771, title: "Le Reproche Divin", content: "Le Prophète (ﷺ) était occupé à prêcher aux notables de Quraysh quand Ibnou Oum Maktoum vint l'interroger avec insistance. Le Prophète se détourna légèrement. Allah révéla alors : « Il s'est renfrogné et s'est détourné parce que l'aveugle est venu à lui » (Coran 80:1-2)." },
                    { id: 772, title: "L'Exception du Coran", content: "Lorsque le verset sur le mérite des combattants fut révélé (« Ne sont pas égaux ceux qui restent assis... »), Ibnou Oum Maktoum se plaignit de son handicap. Le Prophète reçut alors immédiatement la révélation ajoutant l'exception : « sauf ceux qui ont une infirmité »." },
                    { id: 773, title: "L'Étendard Noir", content: "Bien qu'aveugle et dispensé, il insista pour participer à la bataille décisive d'Al-Qadisiyya contre les Perses. Il demanda à tenir l'étendard pour encourager les troupes, disant qu'il ne pouvait pas fuir. On le retrouva mort, serrant la bannière." }
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
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Khalid ibn Al-Walid",
                arabicName: "خالد بن الوليد",
                subtitle: "L'Épée d'Allah (Sayfullah)",
                intro: "Le génie militaire invaincu. Surnommé « Une épée parmi les épées d'Allah » par le Prophète. Il brisa neuf épées à Mouta et fut l'architecte des conquêtes de l'Irak et du Sham.",
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
                    { id: 783, title: "Le Poison", content: "À Al-Hira, on lui apporta un poison mortel. Il demanda la coupe, dit « Bismillah » et la but d'un trait sans en subir le moindre mal, prouvant sa confiance totale (Tawakkul) en Allah." }
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
                verified: true,
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
                    { year: "38 H", desc: "Décès probable à Médine (selon Al-Waqidi), bien que certains disent qu'il fut tué à Badr." }
                ],
                narratives: [
                    { id: 791, title: "La Divergence sur sa Mort", content: "Il existe deux versions sur sa fin : certains historiens disent qu'il fut tué à Badr par Touayma ibn 'Adi. Cependant, l'avis prépondérant (Al-Waqidi) est qu'il a survécu, participé à toutes les batailles et est mort bien plus tard à Médine." }
                ],
                hadiths: [],
                quizData: [
                    { q: "Quel est le vrai nom de sa mère 'Bayda' ?", opts: ["Daad", "Fatima", "Aïsha", "Khadija"], c: 0, exp: "Sa mère s'appelait Daad la Fihriya, mais était surnommée Bayda (La Blanche)." }
                ]
            },
            {
                id: 80,
                verified: true,
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
                    { id: 802, title: "La Protection du Prophète", content: "Lors de l'expédition de Tabouk, il marchait aux côtés du Prophète pour le protéger." }
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
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Al-Miqdad ibn 'Amr",
                arabicName: "المِقْدَاد بن عَمْرو",
                subtitle: "Le Premier Cavalier de l'Islam",
                intro: "L'un des sept premiers à avoir déclaré son Islam. Il fut le seul cavalier musulman (monté sur un cheval) lors de la bataille de Badr. Connu pour son courage et sa franchise.",
                heroQuote: "Nous ne te dirons pas comme les fils d'Israël : Va, toi et ton Seigneur, et combattez !",
                tags: ["Badriyun", "Mouhajir", "Cavalier", "Premier"],
                genealogy: "Al-Miqdad ibn 'Amr. Adopté par Al-Aswad à la période préislamique (d'où le nom Al-Miqdad ibn Al-Aswad). Il reprit son vrai nom après l'interdiction de l'adoption.",
                physicalDesc: "Il était grand, très brun, avait le ventre rond, une tête touffue, de larges yeux noirs, des sourcils joints et une barbe qu'il teignait au henné. Il avait une voix tonitruante.",
                timeline: [
                    { year: "Débuts", desc: "L'un des 7 premiers à afficher son Islam." },
                    { year: "2 H", desc: "Le seul cavalier monté sur un cheval (nommé Ba'zaja) lors de la bataille de Badr." },
                    { year: "Conquêtes", desc: "Participe à la conquête de l'Égypte et du Sham." },
                    { year: "33 H", desc: "Décès à Al-Jourf à 70 ans. Outhman prie sur lui." }
                ],
                narratives: [
                    { id: 811, title: "Le Discours de Badr", content: "Avant Badr, quand le Prophète consulta ses compagnons, Al-Miqdad se leva et dit : « Ô Messager d'Allah, nous ne te dirons pas ce que les Juifs ont dit à Moïse : 'Va toi et ton Seigneur et combattez'. Mais nous disons : Va, toi et ton Seigneur, et nous combattrons avec vous, à droite, à gauche, devant et derrière ! ». Le visage du Prophète s'illumina." },
                    { id: 812, title: "L'Expérience du Pouvoir", content: "Le Prophète le nomma émir d'une expédition. À son retour, il demanda : « Comment as-tu trouvé le commandement ? ». Al-Miqdad répondit : « J'avais l'impression que les gens étaient mes serviteurs... Par celui qui t'a envoyé, je ne commanderai plus jamais deux hommes ! ». Il craignait l'orgueil." },
                    { id: 813, title: "La Graisse du Ventre", content: "Il avait pris du poids avec l'âge. Un esclave romain lui proposa de l'opérer pour retirer la graisse. Il lui ouvrit le ventre et retira la graisse (liposuccion primitive), mais Al-Miqdad mourut peu après de cette opération." }
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
                verified: true,
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
                    { year: "Vie du Prophète", desc: "Mémorise et compile le Coran intégralement. Scribe de la révélation." },
                    { year: "Califat d'Omar", desc: "Désigné pour diriger les prières de Tarawih (Ramadan) pour les gens." },
                    { year: "22 H (ou 30 H)", desc: "Décès à Médine. Omar prononça : « Aujourd'hui le Maître des musulmans est mort ! »." }
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
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "An-Nou'mane ibn Mouqarine",
                arabicName: "النُّعْمَانِ بن مُقَرِّن",
                subtitle: "Le Conquérant de Nahavand",
                intro: "Chef de la tribu des Mouzayna, il se convertit avec ses dix frères (première maison entière à se convertir). Commandant des armées musulmanes lors de la bataille décisive de Nahavand contre l'Empire Perse.",
                heroQuote: "Ô Allah, octroie à An-Nou'mane une mort qui puisse donner la victoire aux musulmans !",
                tags: ["Commandant", "Martyr", "Perse", "Nahavand"],
                genealogy: "An-Nou'mane ibn Mouqarine Al-Mouzani. Il avait plusieurs frères compagnons (les fils de Mouqarine : Souwayd, Sinane, etc.).",
                timeline: [
                    { year: "5 H", desc: "Première bataille (Le Fossé)." },
                    { year: "Conquête", desc: "Porte l'étendard des Mouzayna lors de la prise de La Mecque." },
                    { year: "21 H", desc: "Commandant en chef à {Nahavand}. Il meurt martyr en glissant de sa monture, juste avant la victoire totale sur les Perses." }
                ],
                narratives: [
                    { id: 831, title: "L'Invocation de la Victoire", content: "Avant la bataille de Nahavand, il pria : « Ô Allah, accorde-moi le martyre aujourd'hui et fais que ma mort soit une victoire pour les musulmans, et ne me fais pas subir l'humiliation ». Il fut le premier à tomber (son cheval glissa sur le sang), et les musulmans remportèrent une victoire totale." },
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
                verified: true,
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
                verified: true,
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
                    { id: 852, title: "La Lumière sur la Tombe", content: "Aïsha rapporte que les compagnons disaient voir une lumière perpétuelle émaner de la tombe du Négus, signe de son statut élevé auprès d'Allah." },
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
                verified: true,
                source: "Siyar A'lam al-Nubula (Dhahabi)",
                name: "Mouadh ibn Jabal",
                arabicName: "مُعَاذ بن جَبَل",
                subtitle: "Le Savant du Halal et du Haram",
                intro: "Le Prophète (ﷺ) a dit de lui qu'il serait ressuscité, le Jour du Jugement, à la tête des savants. Envoyé au Yémen comme juge, il était aimé de tous pour sa science et sa douceur.",
                heroQuote: "Le Jour de la Résurrection, Mouadh devancera tous les savants d'un jet de pierre !",
                tags: ["Ansar", "Savant", "Juge", "Aqaba"],
                genealogy: "Mouadh ibn Jabal... des Banou Jousham (Khazraj). Surnommé Abou Abderrahman.",
                physicalDesc: "Un homme grand, à la peau blanche, aux grands yeux noirs vifs (Kahil), aux dents blanches et aux cheveux frisés. Il avait l'un des plus beaux visages.",
                timeline: [
                    { year: "18 ans", desc: "Se convertit et assiste au serment d'Al-Aqaba (le plus jeune)." },
                    { year: "2 H", desc: "Participe à la bataille de Badr à l'âge de 20 ou 21 ans." },
                    { year: "8 H", desc: "À la conquête de La Mecque, le Prophète le désigne pour enseigner le Coran aux Mecquois." },
                    { year: "9 H", desc: "Envoyé au Yémen comme juge (Qadi) et enseignant. Le Prophète l'accompagne à pied pour lui faire ses adieux." },
                    { year: "17-18 H", desc: "Meurt de la peste d'Emmaüs (Amwas) en Jordanie à 33 ou 34 ans (l'âge du Christ)." }
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                    { year: "36 H", desc: "Meurt à Al-Madaïne (Ctésiphon) sous le califat d'Othman ou Ali (selon divergences)." }
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
                verified: true,
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
                verified: true,
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
                    { id: 931, title: "Le Baiser et la Liberté", content: "Prisonnier, l'empereur byzantin tenta de le convertir (eau bouillante, femmes, partage du pouvoir). Abd-Allah refusa tout. L'empereur, impressionné, proposa : « Embrasse ma tête et je te libère ». Abd-Allah dit : « Et tous les prisonniers musulmans avec moi ? ». L'empereur accepta. À son retour, Omar l'embrassa sur la tête en disant : « C'est un devoir pour tout musulman d'embrasser la tête d'Ibn Houdhafa »." },
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                    { year: "Aqaba", desc: "L'un des douze apôtres (Nuqaba)." },
                    { year: "3 H", desc: "Protège le Prophète de son corps à Ouhoud, brisant 3 arcs." },
                    { year: "Après 11 H", desc: "Jeûne continuellement pendant 40 ans (sauf les jours interdits)." },
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
                verified: true,
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
                verified: true,
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
                verified: true,
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
                verified: true,
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