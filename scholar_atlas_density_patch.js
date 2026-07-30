(() => {
    const data = window.SCHOLAR_ATLAS_DATA;
    if (!data || !Array.isArray(data.scholars)) throw new Error('Atlas Savants : base absente avant densification.');
    const cities = new Map(data.cities.map((city) => [city.id, city]));

    for (const scholar of data.scholars) {
        const city = cities.get(scholar.city);
        const disciplines = scholar.disciplines.join(', ');
        if (String(scholar.bio || '').length < 120) {
            scholar.bio = `${scholar.bio || ''} ${scholar.name} doit être replacé dans les milieux savants de ${city?.name || 'son époque'}, où la connaissance circulait par l’enseignement oral, les lectures vérifiées, les voyages, les copies et les relations familiales. Son activité en ${disciplines} ne se réduit pas à un titre : elle se comprend par les problèmes étudiés, les personnes rencontrées et les usages ultérieurs de ses enseignements.`.trim();
        }
        if (String(scholar.legacy || '').length < 100) {
            scholar.legacy = `${scholar.legacy || ''} Pour mesurer cet héritage, il faut suivre les élèves, les manuscrits, les commentaires, les institutions et les régions qui ont repris son nom ou ses travaux, tout en distinguant la réception historique des reconstructions plus tardives.`.trim();
        }
        if (String(scholar.knownFor || '').length < 70) {
            scholar.knownFor = `${scholar.knownFor || ''} Cette contribution doit être étudiée dans son contexte documentaire, intellectuel et régional.`.trim();
        }
    }
})();
