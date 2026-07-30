(() => {
    const parseRows = (text, keys) => text.trim().split('\n').filter(Boolean).map((line) => {
        const values = line.split('|');
        return Object.fromEntries(keys.map((key, index) => [key, (values[index] || '').replaceAll('¦', '|')]));
    });

    window.__parseScholarAtlasRows = parseRows;

    const cityRows = `makkah|La Mecque|مكة|21.4225|39.8262|Hedjaz|Centre du pèlerinage, de la récitation et des premiers cercles de transmission.
madinah|Médine|المدينة|24.4672|39.6108|Hedjaz|Ville de la première communauté et grand foyer de hadith, de fiqh et de qirāʾāt.
kufa|Koufa|الكوفة|32.03|44.4|Irak|Centre majeur du fiqh, de la langue arabe, des lectures coraniques et de la transmission.
basra|Bassora|البصرة|30.5085|47.7804|Irak|Foyer de grammaire, d’ascèse, de hadith et de littérature.
baghdad|Bagdad|بغداد|33.3152|44.3661|Irak|Capitale abbasside et carrefour des sciences religieuses, linguistiques et rationnelles.
bukhara|Boukhara|بخارى|39.7681|64.4556|Transoxiane|Grand centre de hadith, de droit et de culture savante en Transoxiane.
nishapur|Nishapur|نيسابور|36.2141|58.7961|Khurasan|Ville de hadith, de théologie et d’enseignement supérieur dans le Khurasan.
tirmidh|Tirmidh|ترمذ|37.2242|67.2783|Transoxiane|Ville associée à une importante tradition de hadith.
nasa|Nasa|نسا|37.95|58.21|Khurasan|Ancien centre du Khurasan lié à la transmission du hadith.
qazvin|Qazvin|قزوين|36.2688|50.0041|Iran|Ville d’enseignement et de transmission en Iran occidental.
samarqand|Samarcande|سمرقند|39.6542|66.9597|Transoxiane|Centre du droit hanafite, de la théologie maturidite et des sciences.
damascus|Damas|دمشق|33.5138|36.2765|Levant|Carrefour du hadith, de l’histoire, du droit et des lectures coraniques.
cairo|Le Caire|القاهرة|30.0444|31.2357|Égypte|Métropole du savoir autour des grandes madrasas et d’al-Azhar.
kairouan|Kairouan|القيروان|35.6781|10.0963|Maghreb|Foyer ancien du malikisme et de l’enseignement en Afrique du Nord.
cordoba|Cordoue|قرطبة|37.8882|-4.7794|al-Andalus|Capitale intellectuelle d’al-Andalus, active en droit, médecine, philosophie et littérature.
ceuta|Ceuta|سبتة|35.8894|-5.3213|Maghreb|Ville de juristes et de traditionnistes au contact du Maghreb et d’al-Andalus.
granada|Grenade|غرناطة|37.1773|-3.5986|al-Andalus|Dernier grand foyer andalou, actif en droit, langue et pensée juridique.
tus|Tus|طوس|36.48|59.58|Khurasan|Ville associée à plusieurs figures majeures de la théologie et de l’éthique.
rayy|Rayy|الري|35.5935|51.4393|Iran|Ancienne métropole iranienne, centre de théologie, médecine et exégèse.
khwarazm|Khwarazm|خوارزم|41.55|60.63|Asie centrale|Région de savants en mathématiques, géographie, langue et théologie.
isfahan|Ispahan|أصفهان|32.6546|51.668|Iran|Ville de tradition savante, de littérature et de philosophie.
mosul|Mossoul|الموصل|36.34|43.13|Irak|Centre de grammaire, de hadith et de culture urbaine en Haute Mésopotamie.
hamadan|Hamadan|همذان|34.798|48.5146|Iran|Ville liée à la médecine, à la philosophie et à la vie de cour.
ghazni|Ghazni|غزنة|33.5536|68.4269|Afghanistan|Centre politique et savant de l’Orient islamique médiéval.
palermo|Palerme|بلرم|38.1157|13.3615|Méditerranée|Carrefour méditerranéen de géographie, de sciences et de cultures de cour.
maragha|Maragha|مراغة|37.3892|46.2371|Iran|Centre astronomique majeur autour de l’observatoire de Maragha.
tunis|Tunis|تونس|36.8065|10.1815|Maghreb|Ville de droit, d’histoire et de pensée sociale au Maghreb.
aleppo|Alep|حلب|36.2021|37.1343|Levant|Ville de juristes et de lettrés entre Anatolie et Syrie.
nawa|Nawa|نوى|32.8894|36.0399|Levant|Localité du Hawran associée à la naissance d’al-Nawawi.
bayhaq|Bayhaq|بيهق|36.21|57.68|Khurasan|Région du Khurasan liée à l’œuvre d’al-Bayhaqi.
sijistan|Sijistan|سجستان|31.03|61.5|Iran oriental|Région orientale ayant produit plusieurs traditionnistes.
gaza|Gaza|غزة|31.5017|34.4668|Levant|Ville associée à la naissance d’al-Shafiʿi et aux échanges du Levant.
sanaa|Sanaa|صنعاء|15.3694|44.191|Yémen|Centre ancien de transmission dans la péninsule Arabique.
valencia|Valence|بلنسية|39.4699|-0.3763|al-Andalus|Ville savante de l’est d’al-Andalus.
denia|Dénia|دانية|38.8408|0.1057|al-Andalus|Port et centre culturel de l’Orient andalou.
marrakesh|Marrakech|مراكش|31.6295|-7.9811|Maghreb|Capitale politique et intellectuelle du Maghreb occidental.
india|Sous-continent indien|الهند|28.6139|77.209|Asie du Sud|Repère pédagogique pour les séjours et observations d’al-Bīrūnī.
merv|Merv|مرو|37.6646|62.1747|Khurasan|Grand centre du Khurasan et carrefour des routes savantes.
jerusalem|Jérusalem|القدس|31.7683|35.2137|Levant|Ville de pèlerinage et de circulation savante.
harran|Harran|حران|36.8637|39.0314|Jazira|Ville de Haute Mésopotamie associée à plusieurs familles savantes.
bosra|Bosra|بصرى|32.5183|36.4815|Levant|Ville du Hawran et repère biographique d’Ibn Kathīr.
herat|Hérat|هرات|34.3529|62.204|Khurasan|Centre intellectuel et politique majeur de l’Orient islamique.`;

    const cities = parseRows(cityRows, ['id', 'name', 'arabic', 'lat', 'lon', 'region', 'summary']).map((item) => ({
        ...item,
        coords: [Number(item.lat), Number(item.lon)]
    }));

    window.SCHOLAR_ATLAS_DATA = {
        meta: {
            version: '1.0.0',
            title: 'Atlas des savants',
            scope: 'Sélection pédagogique de figures majeures de l’histoire intellectuelle islamique.',
            methodology: [
                'Les dates en années de l’Hégire sont parfois approximatives ou discutées.',
                'La ville principale sert de point d’ancrage cartographique et ne résume pas toute la carrière du savant.',
                'Les itinéraires représentent des étapes biographiques attestées ou couramment rapportées ; ils ne prétendent pas restituer chaque voyage.',
                'Les étiquettes d’école et de discipline sont des outils pédagogiques, parfois rétrospectifs.',
                'Les références affichées orientent vers des sources biographiques ou des œuvres ; elles ne valent pas authentification de chaque détail.'
            ]
        },
        cities,
        scholars: [],
        journeys: []
    };
})();
