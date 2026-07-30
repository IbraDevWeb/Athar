(() => {
    const parseRows = window.__parseScholarAtlasRows;
    if (!parseRows || !window.SCHOLAR_ATLAS_DATA) throw new Error('Atlas Savants : base principale absente avant les villes supplémentaires.');
    const rows = `abyssinia|Aksoum / Abyssinie|الحبشة|14.13|38.72|Corne de l’Afrique|Repère pédagogique pour la première émigration de musulmans vers le royaume d’Aksoum.
khaybar|Khaybar|خيبر|25.698|39.293|Hedjaz|Oasis du nord du Hedjaz, importante dans la Sīra et les circulations médinoises.
fez|Fès|فاس|34.033|-5.0|Maghreb|Grand foyer de droit malikite, d’enseignement et de culture du livre autour d’al-Qarawiyyīn.
tlemcen|Tlemcen|تلمسان|34.882|-1.316|Maghreb|Centre savant du Maghreb central, actif en droit, théologie, langue et spiritualité.
sokoto|Sokoto|سوكوتو|13.062|5.233|Afrique de l’Ouest|Centre du califat de Sokoto et d’un important mouvement d’éducation islamique.
padang|Padang Panjang|فادانغ بانجانغ|-0.466|100.4|Asie du Sud-Est|Ville de Sumatra associée aux réformes modernes de l’éducation islamique féminine.
damietta|Damiette|دمياط|31.417|31.814|Égypte|Ville du delta du Nil, liée à plusieurs figures modernes de la littérature et de l’enseignement.
qena|Qinā|قنا|26.155|32.716|Égypte|Repère de Haute-Égypte associé à la jeunesse d’Ibn Daqīq al-ʿĪd.
seville|Séville|إشبيلية|37.389|-5.984|al-Andalus|Grand centre andalou de droit, littérature, histoire et sciences religieuses.
ferghana|Vallée de Ferghana|فرغانة|40.384|71.787|Asie centrale|Région de juristes, astronomes et savants entre Transoxiane et routes orientales.
bust|Bust|بست|31.5|64.36|Afghanistan|Ancienne ville du Sijistan, patrie d’Ibn Ḥibbān et carrefour de l’Iran oriental.
diyarbakir|Diyarbakır / Āmid|آمد|37.914|40.23|Anatolie & Jazira|Centre artuqide associé aux travaux d’ingénierie d’al-Jazarī.
raqqa|Raqqa|الرقة|35.95|39.009|Jazira|Ville de l’Euphrate associée aux observations astronomiques d’al-Battānī.
shushtar|Tustar / Shushtar|تستر|32.045|48.856|Iran|Ville du Khuzistan associée à Sahl al-Tustarī.
gilan|Jīlān / Gilan|جيلان|37.28|49.59|Iran|Région caspienne associée à l’origine de ʿAbd al-Qādir al-Jīlānī.
wasit|Wāsiṭ|واسط|32.5|45.82|Irak|Ville d’Irak liée à plusieurs familles de traditionnistes.
shiraz|Shiraz|شيراز|29.592|52.584|Iran|Centre de droit, exégèse, littérature et sciences dans le Fars.
kashan|Kashan|كاشان|33.985|51.41|Iran|Ville associée à Jamshīd al-Kāshī et aux traditions scientifiques du centre iranien.`;
    const existing = new Set(window.SCHOLAR_ATLAS_DATA.cities.map((city) => city.id));
    const cities = parseRows(rows, ['id','name','arabic','lat','lon','region','summary']).map((item) => ({
        ...item,
        coords: [Number(item.lat), Number(item.lon)]
    })).filter((city) => !existing.has(city.id));
    window.SCHOLAR_ATLAS_DATA.cities.push(...cities);
})();
